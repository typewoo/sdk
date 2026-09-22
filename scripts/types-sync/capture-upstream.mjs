/**
 * Capture WooCommerce REST API schemas from a running WP+WC instance.
 *
 * The /wp-json/<ns> discovery endpoint lists every route and its
 * `endpoints[].args` (request/query) but NOT the per-route response `schema`.
 * To get the response schema we hit each route with `?_method=OPTIONS`, which
 * returns the JSON Schema document. We do that in parallel with a small
 * concurrency cap.
 *
 * Path params like `(?P<id>[\d]+)` are substituted with `1` purely so the URL
 * matches the route — OPTIONS returns the schema regardless of whether
 * resource id=1 actually exists.
 */

import { normaliseJsonSchema, sortKeysDeep } from './normalise.mjs';

const SURFACES = {
  admin: { discovery: '/wp-json/wc/v3' },
  store: { discovery: '/wp-json/wc/store/v1' },
  analytics: { discovery: '/wp-json/wc-analytics' },
};

const CONCURRENCY = 8;

function authHeader(consumerKey, consumerSecret) {
  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    'base64'
  );
  return `Basic ${token}`;
}

function buildHeaders(creds) {
  const h = { Accept: 'application/json' };
  if (creds?.consumerKey && creds?.consumerSecret) {
    h.Authorization = authHeader(creds.consumerKey, creds.consumerSecret);
  }
  return h;
}

/**
 * Replace WP REST regex placeholders (`(?P<name>pattern)`) with a concrete
 * value. `1` is a safe stand-in for numeric ids; for non-numeric patterns we
 * fall back to `1` too — OPTIONS doesn't validate the path against the regex
 * for schema lookup in the WP routers we've tested.
 */
// Values tried, in order, for a route placeholder. The first one matching
// the placeholder's own pattern is used, so `[\d]+` gets `1`, a currency
// code `[\w-]{3}` gets `abc` and a cart item key `[\w-]{32}` gets 32 chars.
const PLACEHOLDER_CANDIDATES = ['1', 'abc', 'a'.repeat(32)];

function placeholderFor(pattern) {
  let re;
  try {
    re = new RegExp(`^(?:${pattern})$`);
  } catch {
    return '1';
  }
  return PLACEHOLDER_CANDIDATES.find((c) => re.test(c)) ?? '1';
}

export function concretiseRoute(route) {
  // Placeholders can contain nested groups, e.g. `(?P<x>(?:a|b))`, so find
  // each one's closing parenthesis by depth rather than with a regex.
  let out = '';
  let i = 0;
  while (i < route.length) {
    if (route.startsWith('(?P<', i)) {
      let depth = 0;
      let j = i;
      for (; j < route.length; j++) {
        if (route[j] === '\\') {
          j++;
          continue;
        }
        if (route[j] === '(') depth++;
        else if (route[j] === ')' && --depth === 0) break;
      }
      out += placeholderFor(route.slice(route.indexOf('>', i) + 1, j));
      i = j + 1;
    } else {
      out += route[i++];
    }
  }
  return out;
}

const FETCH_TIMEOUT_MS = 30_000;

async function fetchJson(url, headers) {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* leave null */
  }
  return { ok: res.ok, status: res.status, body };
}

/**
 * From args (an object keyed by param name, with JSON-Schema-ish props),
 * synthesise a JSON Schema object so the normaliser can consume it uniformly.
 */
export function argsToSchema(args) {
  if (!args || typeof args !== 'object') {
    return { type: 'object', properties: {}, required: [] };
  }
  const properties = {};
  const required = [];
  for (const [name, def] of Object.entries(args)) {
    if (!def || typeof def !== 'object') continue;
    const node = {
      type: def.type ?? 'any',
      description: def.description,
      enum: def.enum,
      items: def.items,
      format: def.format,
      readonly: def.readonly,
      context: def.context,
      default: def.default,
    };
    if (def.properties) node.properties = def.properties;
    properties[name] = node;
    if (def.required === true) required.push(name);
  }
  return { type: 'object', properties, required };
}

async function pMap(items, mapper, concurrency = CONCURRENCY) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await mapper(items[idx]);
    }
  }
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    worker
  );
  await Promise.all(workers);
  return out;
}

/**
 * Fetch one route's OPTIONS document. Returns `{ body }` on success or
 * `{ error }` describing why it failed (HTTP status or network error).
 */
async function fetchRouteOptions(baseUrl, route, headers) {
  // Discovery returns route keys without the /wp-json prefix.
  const url = `${baseUrl}/wp-json${concretiseRoute(route)}?_method=OPTIONS`;
  try {
    const { ok, status, body } = await fetchJson(url, headers);
    if (!ok || !body) return { error: `HTTP ${status}` };
    return { body };
  } catch (err) {
    return { error: err?.message ?? String(err) };
  }
}

export function shapeRouteEntry(routeDef) {
  const entry = { response: null, request: {}, query: {} };

  if (routeDef?.schema) {
    entry.response = normaliseJsonSchema(routeDef.schema);
  }

  if (Array.isArray(routeDef?.endpoints)) {
    for (const ep of routeDef.endpoints) {
      const methods = Array.isArray(ep.methods) ? ep.methods : [];
      const argsSchema = argsToSchema(ep.args);
      const normArgs = normaliseJsonSchema(argsSchema);
      for (const method of methods) {
        if (method === 'GET') {
          entry.query[method] = normArgs;
        } else if (
          method === 'POST' ||
          method === 'PUT' ||
          method === 'PATCH'
        ) {
          entry.request[method] = normArgs;
        }
      }
    }
  }

  return entry;
}

async function captureSurface(baseUrl, surface, headers, log) {
  const discoveryUrl = `${baseUrl}${SURFACES[surface].discovery}`;
  const {
    ok,
    status,
    body: discovery,
  } = await fetchJson(discoveryUrl, headers);
  if (!ok || !discovery?.routes) {
    throw new Error(
      `Discovery failed for ${surface} (${discoveryUrl}): HTTP ${status}`
    );
  }

  const routes = Object.keys(discovery.routes);
  log(`[${surface}] ${routes.length} routes — fetching OPTIONS…`);

  const out = {};
  const failures = [];
  let done = 0;
  await pMap(routes, async (route) => {
    const { body, error } = await fetchRouteOptions(baseUrl, route, headers);
    // Prefer OPTIONS payload (has schema); fall back to discovery's route def
    // (no schema, but has args) if OPTIONS failed, and record the failure.
    if (error) failures.push({ surface, route, error });
    out[route] = shapeRouteEntry(body ?? discovery.routes[route]);
    done++;
    if (done % 25 === 0 || done === routes.length) {
      log(`[${surface}]   ${done}/${routes.length}`);
    }
  });

  return { routes: out, failures, total: routes.length };
}

/**
 * Fails the capture when too many OPTIONS requests failed. A failed OPTIONS
 * request leaves the route without a response schema, which would otherwise
 * show up later as quiet `endpoint-missing-upstream` warnings instead of an
 * obviously broken capture (e.g. wrong credentials returning 401).
 *
 * @param {{ surface: string, route: string, error: string }[]} failures
 * @param {number} total - number of routes attempted
 * @param {number} maxFailureRatio - tolerated share of failures (0–1)
 */
export function assertCaptureHealthy(failures, total, maxFailureRatio) {
  if (failures.length === 0) return;
  const ratio = total === 0 ? 1 : failures.length / total;
  if (ratio <= maxFailureRatio) return;
  const sample = failures
    .slice(0, 10)
    .map((f) => `  ${f.surface} ${f.route}: ${f.error}`)
    .join('\n');
  throw new Error(
    `OPTIONS failed for ${failures.length}/${total} routes ` +
      `(limit ${Math.round(maxFailureRatio * 100)}%). Check the credentials ` +
      `and that the store is running.\n${sample}`
  );
}

export async function captureUpstream({
  baseUrl,
  wcVersion,
  creds,
  log = () => {},
  maxFailureRatio = 0.05,
}) {
  const headers = buildHeaders(creds);
  const surfaces = {};
  const failures = [];
  let total = 0;
  for (const surface of Object.keys(SURFACES)) {
    const result = await captureSurface(baseUrl, surface, headers, log);
    surfaces[surface] = result.routes;
    failures.push(...result.failures);
    total += result.total;
  }
  for (const f of failures) {
    log(`[capture] OPTIONS failed: ${f.surface} ${f.route} (${f.error})`);
  }
  assertCaptureHealthy(failures, total, maxFailureRatio);
  return sortKeysDeep({
    wcVersion,
    capturedAt: new Date().toISOString(),
    surfaces,
  });
}
