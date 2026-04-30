/**
 * Shared normaliser. Converts both upstream WC JSON Schema and Zod-derived
 * JSON Schema into the same flat field map so the diff engine doesn't care
 * which side a record came from.
 *
 * Output shape:
 *   {
 *     fields: {
 *       "<dot.path>": {
 *         type:       "string" | "integer" | "number" | "boolean" | "array" | "object" | "any" | "null",
 *         optional:   boolean,   // true when not in the parent's `required` list
 *         nullable:   boolean,   // true when the type is or includes "null"
 *         enum:       string[] | undefined,  // sorted
 *         items:      <type>     // for arrays, the element's `type`
 *         additionalProperties: boolean,
 *         format:     string | undefined,
 *         readonly:   boolean,
 *         context:    string[] | undefined,  // upstream-only; used for filtering
 *       },
 *       ...
 *     },
 *     additionalProperties: boolean   // root-level
 *   }
 */

export function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = sortKeysDeep(value[k]);
    return out;
  }
  return value;
}

// WC declares several non-standard `type` values that must be normalised
// before comparison. Map them to canonical JSON Schema primitives. The
// original meaning is preserved as `format` where useful.
const TYPE_ALIASES = {
  'date-time': { type: 'string', format: 'date-time' },
  uuid: { type: 'string', format: 'uuid' },
  uri: { type: 'string', format: 'uri' },
  email: { type: 'string', format: 'email' },
  mixed: { type: 'any' },
  // WC sometimes uses `bool` instead of `boolean`.
  bool: { type: 'boolean' },
  // WC's `int` is a JSON integer.
  int: { type: 'integer' },
};

function aliasType(t) {
  return TYPE_ALIASES[t] ?? { type: t };
}

function coerceType(rawType) {
  // JSON Schema `type` may be a string, an array (union), or undefined.
  if (Array.isArray(rawType)) {
    const aliased = rawType.map((t) => aliasType(t));
    const nullable = rawType.includes('null') || aliased.some((a) => a.type === 'null');
    const nonNull = aliased
      .filter((a) => a.type !== 'null')
      .map((a) => a.type);
    const unique = [...new Set(nonNull)].sort();
    return {
      type: unique.length === 1 ? unique[0] : (unique[0] ?? 'any'),
      types: unique,
      nullable,
    };
  }
  if (typeof rawType === 'string') {
    const aliased = aliasType(rawType);
    return { type: aliased.type, types: [aliased.type], nullable: false, format: aliased.format };
  }
  return { type: 'any', types: ['any'], nullable: false };
}

function unwrapOneOfNull(node) {
  // Some schemas express nullability via oneOf/anyOf with a {type:"null"} branch.
  for (const key of ['oneOf', 'anyOf']) {
    const arr = node?.[key];
    if (Array.isArray(arr)) {
      const nullBranch = arr.find((b) => b?.type === 'null');
      const valBranch = arr.find((b) => b?.type && b.type !== 'null');
      if (nullBranch && valBranch) {
        return { ...valBranch, _nullable: true };
      }
    }
  }
  return null;
}

/**
 * `additionalProperties` may be `true`, an empty schema `{}` (which Zod 4
 * emits for `z.looseObject`), or omitted. The first two mean "loose".
 * `false` and a non-empty schema mean "strict".
 */
function isAdditionalPropertiesOpen(node) {
  const ap = node?.additionalProperties;
  if (ap === true) return true;
  if (ap === false) return false;
  if (ap && typeof ap === 'object') {
    return Object.keys(ap).length === 0;
  }
  // Undefined: treat as open only when the schema declares no properties
  // at all (free-form record). Otherwise default to strict.
  return !node?.properties;
}

function describeNode(node, requiredSet, fieldName) {
  const collapsed = unwrapOneOfNull(node) ?? node;
  const coerced = coerceType(collapsed.type);
  const { type, types, nullable: typeNullable, format: aliasFormat } = coerced;
  const nullable = typeNullable || collapsed._nullable === true;

  const enumValues = Array.isArray(collapsed.enum)
    ? [...collapsed.enum].map(String).sort()
    : undefined;

  // For arrays we keep both the element's primitive type AND any enum
  // declared on the element. WC frequently expresses "list of allowed
  // values" as an array of string with items.enum (e.g. include_status).
  // Older snapshots stored items as a bare string; the diff engine handles
  // both shapes for back-compat.
  let items;
  if (type === 'array') {
    if (collapsed.items && typeof collapsed.items === 'object') {
      const inner = coerceType(collapsed.items.type);
      const itemEnum = Array.isArray(collapsed.items.enum)
        ? [...collapsed.items.enum].map(String).sort()
        : undefined;
      items = itemEnum ? { type: inner.type, enum: itemEnum } : { type: inner.type };
    } else {
      items = { type: 'any' };
    }
  }

  // Capture default if declared. WC OPTIONS often supplies defaults for
  // query params (per_page=10, context="view", …); Zod 4 emits `default`
  // when toJSONSchema runs with io:"input" on a `.default(...)` schema.
  const defaultValue =
    collapsed && typeof collapsed === 'object' && 'default' in collapsed
      ? collapsed.default
      : undefined;

  // Capture description. Zod's `.describe(...)` round-trips through
  // toJSONSchema as `description`. WC always populates this on its OPTIONS
  // payloads. Plain JSDoc on Zod schemas is stripped at compile time and
  // does NOT reach the runtime — switch to `.describe()` to make this
  // comparison meaningful.
  const description =
    typeof collapsed?.description === 'string'
      ? collapsed.description
      : undefined;

  return {
    type,
    types: types.length > 1 ? types : undefined,
    optional: requiredSet ? !requiredSet.has(fieldName) : true,
    nullable,
    enum: enumValues,
    items,
    default: defaultValue,
    description,
    additionalProperties:
      type === 'object' ? isAdditionalPropertiesOpen(collapsed) : false,
    format:
      typeof collapsed.format === 'string' ? collapsed.format : aliasFormat,
    readonly: collapsed.readonly === true,
    context: Array.isArray(collapsed.context) ? collapsed.context : undefined,
  };
}

/**
 * Walk a JSON Schema and emit a flat dot-path field map. Nested objects are
 * walked recursively. Array element shapes are not recursed into (we only
 * compare the element's primitive `type`); deep array-of-object compatibility
 * is checked via the parent's nested object structure when applicable.
 */
export function normaliseJsonSchema(root) {
  if (!root || typeof root !== 'object') {
    return { fields: {}, additionalProperties: true };
  }

  const fields = {};

  function visit(node, prefix) {
    if (!node || typeof node !== 'object') return;
    const props = node.properties;
    if (!props || typeof props !== 'object') return;
    const required = new Set(
      Array.isArray(node.required) ? node.required : []
    );

    for (const [name, child] of Object.entries(props)) {
      const path = prefix ? `${prefix}.${name}` : name;
      const desc = describeNode(child, required, name);
      fields[path] = desc;

      if (desc.type === 'object' && child?.properties) {
        visit(child, path);
      }
    }
  }

  visit(root, '');

  return {
    fields,
    additionalProperties: isAdditionalPropertiesOpen(root),
  };
}
