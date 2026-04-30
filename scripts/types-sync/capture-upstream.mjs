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
function concretiseRoute(route) {
  return route.replace(/\(\?P<[^>]+>[^)]+\)/g, '1');
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers });
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
function argsToSchema(args) {
  if (!args || typeof args !== 'object') {
    return { type: 'object', properties: {}, required: [] };
  }
  const properties = {};
  const required = [];
  for (const [name, def] of Object.entries(args)) {
    if (!def || typeof def !== 'object') continue;
    const node = {
      type: def.type ?? 'any',
      enum: def.enum,
      items: def.items,
      format: def.format,
      readonly: def.readonly,
      context: def.context,
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
      out[idx] = await mapper(items[idx], idx);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return out;
}

/**
 * Fetch one route's OPTIONS document. Returns null on non-2xx.
 */
async function fetchRouteOptions(baseUrl, route, headers) {
  // Discovery returns route keys without the /wp-json prefix.
  const url = `${baseUrl}/wp-json${concretiseRoute(route)}?_method=OPTIONS`;
  const { ok, body } = await fetchJson(url, headers);
  if (!ok || !body) return null;
  return body;
}

function shapeRouteEntry(routeDef) {
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
        } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
          entry.request[method] = normArgs;
        }
      }
    }
  }

  return entry;
}

async function captureSurface(baseUrl, surface, headers, log) {
  const discoveryUrl = `${baseUrl}${SURFACES[surface].discovery}`;
  const { ok, status, body: discovery } = await fetchJson(discoveryUrl, headers);
  if (!ok || !discovery?.routes) {
    throw new Error(
      `Discovery failed for ${surface} (${discoveryUrl}): HTTP ${status}`
    );
  }

  const routes = Object.keys(discovery.routes);
  log(`[${surface}] ${routes.length} routes — fetching OPTIONS…`);

  const out = {};
  let done = 0;
  await pMap(routes, async (route) => {
    const optionsDoc = await fetchRouteOptions(baseUrl, route, headers);
    // Prefer OPTIONS payload (has schema); fall back to discovery's route def
    // (no schema, but has args) if OPTIONS failed.
    const def = optionsDoc ?? discovery.routes[route];
    out[route] = shapeRouteEntry(def);
    done++;
    if (done % 25 === 0 || done === routes.length) {
      log(`[${surface}]   ${done}/${routes.length}`);
    }
  });

  return out;
}

export async function captureUpstream({ baseUrl, wcVersion, creds, log = () => {} }) {
  const headers = buildHeaders(creds);
  const surfaces = {};
  for (const surface of Object.keys(SURFACES)) {
    surfaces[surface] = await captureSurface(baseUrl, surface, headers, log);
  }
  return sortKeysDeep({
    wcVersion,
    capturedAt: new Date().toISOString(),
    surfaces,
  });
}
