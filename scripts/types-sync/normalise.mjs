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
 *                                // and not marked `required: true` itself
 *         requiredDeclared: boolean, // false when the parent object says
 *                                // nothing about which fields are required
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
  // WC uses `float` for floating-point numbers; treat as `number`.
  float: { type: 'number' },
};

function aliasType(t) {
  return TYPE_ALIASES[t] ?? { type: t };
}

function coerceType(rawType) {
  // JSON Schema `type` may be a string, an array (union), or undefined.
  if (Array.isArray(rawType)) {
    const aliased = rawType.map((t) => aliasType(t));
    const nullable =
      rawType.includes('null') || aliased.some((a) => a.type === 'null');
    const nonNull = aliased.filter((a) => a.type !== 'null').map((a) => a.type);
    const unique = [...new Set(nonNull)].sort();
    return {
      type: unique.length === 1 ? unique[0] : unique[0] ?? 'any',
      types: unique,
      nullable,
    };
  }
  if (typeof rawType === 'string') {
    const aliased = aliasType(rawType);
    return {
      type: aliased.type,
      types: [aliased.type],
      nullable: false,
      format: aliased.format,
    };
  }
  return { type: 'any', types: ['any'], nullable: false };
}

function unwrapOneOfNull(node) {
  // Some schemas express nullability via oneOf/anyOf with a {type:"null"} branch.
  // Zod 4 emits `.describe(...)` on the parent node alongside an `anyOf`
  // branch list — preserve parent-level metadata (description, default,
  // readonly) when collapsing so the diff sees it. Only a single non-null
  // branch collapses; wider unions are handled by `describeUnion`.
  for (const key of ['oneOf', 'anyOf']) {
    const arr = node?.[key];
    if (Array.isArray(arr)) {
      const nullBranch = arr.find((b) => b?.type === 'null');
      const valBranches = arr.filter((b) => b?.type !== 'null');
      const valBranch = valBranches.length === 1 ? valBranches[0] : undefined;
      if (nullBranch && valBranch?.type) {
        const merged = { ...valBranch, _nullable: true };
        if (typeof node.description === 'string' && !merged.description) {
          merged.description = node.description;
        }
        if ('default' in node && !('default' in merged)) {
          merged.default = node.default;
        }
        if (node.readonly === true) merged.readonly = true;
        return merged;
      }
    }
  }
  return null;
}

/**
 * Describe an `anyOf`/`oneOf` union that `unwrapOneOfNull` didn't collapse
 * (several non-null branches). Returns the branch types, whether a null
 * branch exists, and an enum when every branch is a literal. A branch whose
 * type can't be determined (e.g. a `$ref`) makes the whole union
 * `unsupported`, so it's reported instead of silently matching anything.
 */
function describeUnion(node) {
  const branches = node?.anyOf ?? node?.oneOf;
  if (!Array.isArray(branches) || branches.length === 0) return null;

  const types = new Set();
  const literals = [];
  let nullable = false;
  let allLiterals = true;
  for (const branch of branches) {
    if (branch?.type === 'null') {
      nullable = true;
      continue;
    }
    const inner = branch?.anyOf || branch?.oneOf ? describeUnion(branch) : null;
    if (inner) {
      inner.types.forEach((t) => types.add(t));
      nullable ||= inner.nullable;
      if (inner.enum) literals.push(...inner.enum);
      else allLiterals = false;
      continue;
    }
    if (!branch?.type) return { types: ['unsupported'], nullable };
    for (const t of Array.isArray(branch.type) ? branch.type : [branch.type]) {
      const aliased = aliasType(t).type;
      if (aliased === 'null') nullable = true;
      else types.add(aliased);
    }
    if ('const' in branch) literals.push(branch.const);
    else if (Array.isArray(branch.enum)) literals.push(...branch.enum);
    else allLiterals = false;
  }

  return {
    types: [...types].sort(),
    nullable,
    enum:
      allLiterals && literals.length > 0
        ? [...new Set(literals.map(String))].sort()
        : undefined,
  };
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

/**
 * Type information for a schema node: a plain `type`, a `$ref` (reported as
 * `unsupported`), or an `anyOf`/`oneOf` union.
 */
function nodeType(node) {
  if (node?.$ref) {
    return { type: 'unsupported', types: ['unsupported'], nullable: false };
  }
  if (node?.type === undefined) {
    const union = describeUnion(node);
    if (union) {
      return {
        type: union.types[0] ?? 'any',
        types: union.types,
        nullable: union.nullable,
        enum: union.enum,
      };
    }
  }
  return coerceType(node?.type);
}

function describeNode(node, requiredSet, fieldName, requiredDeclared = true) {
  const collapsed = unwrapOneOfNull(node) ?? node;
  const coerced = nodeType(collapsed);
  const { type, types, nullable: typeNullable, format: aliasFormat } = coerced;
  const nullable = typeNullable || collapsed._nullable === true;

  const rawEnum = Array.isArray(collapsed.enum) ? collapsed.enum : coerced.enum;
  const enumValues = rawEnum
    ? [...new Set([...rawEnum].map(String))].sort()
    : undefined;

  // Fix WC schema inconsistency: some fields are declared as type "number"
  // but carry string-valued enum entries (e.g. format: ["currency","number"]).
  // Reclassify as "string" so the diff engine sees matching types.
  const effectiveType =
    (type === 'number' || type === 'integer') &&
    enumValues?.length > 0 &&
    enumValues.every((v) => isNaN(Number(v)))
      ? 'string'
      : type;

  // For arrays we keep both the element's primitive type AND any enum
  // declared on the element. WC frequently expresses "list of allowed
  // values" as an array of string with items.enum (e.g. include_status).
  // Older snapshots stored items as a bare string; the diff engine handles
  // both shapes for back-compat.
  let items;
  if (effectiveType === 'array') {
    if (collapsed.items && typeof collapsed.items === 'object') {
      const inner = nodeType(collapsed.items);
      const rawItemEnum = Array.isArray(collapsed.items.enum)
        ? collapsed.items.enum
        : inner.enum;
      const itemEnum =
        rawItemEnum?.length > 0
          ? [...new Set([...rawItemEnum].map(String))].sort()
          : undefined;
      items = { type: inner.type };
      if (inner.types?.length > 1) items.types = inner.types;
      if (itemEnum) items.enum = itemEnum;
    } else {
      items = { type: 'any' };
    }
  }

  // Capture default if declared. WC OPTIONS often supplies defaults for
  // query params (per_page=10, context="view", …); Zod 4 emits `default`
  // when toJSONSchema runs with io:"input" on a `.default(...)` schema.
  // WC inconsistency: some array fields declare a scalar string default (e.g.
  // status: default "any"). Treat those as no default to avoid false mismatches.
  const rawDefault =
    collapsed && typeof collapsed === 'object' && 'default' in collapsed
      ? collapsed.default
      : undefined;
  const defaultValue =
    effectiveType === 'array' && !Array.isArray(rawDefault)
      ? undefined
      : rawDefault;

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
    type: effectiveType,
    types: types.length > 1 ? types : undefined,
    // WP REST marks required properties either JSON-Schema style, in the
    // parent's `required` list, or WP style, as `required: true` on the
    // property itself (e.g. Store API address fields).
    optional:
      collapsed.readonly === true
        ? false
        : !(requiredSet?.has(fieldName) || collapsed.required === true),
    requiredDeclared,
    nullable,
    enum: enumValues,
    items,
    default: defaultValue,
    description,
    additionalProperties:
      effectiveType === 'object'
        ? isAdditionalPropertiesOpen(collapsed)
        : false,
    format:
      typeof collapsed.format === 'string' ? collapsed.format : aliasFormat,
    readonly: collapsed.readonly === true,
    context: Array.isArray(collapsed.context) ? collapsed.context : undefined,
  };
}

/**
 * Walk a JSON Schema and emit a flat dot-path field map. Nested objects are
 * walked recursively, and the properties of object array elements are
 * emitted as `field[].child`.
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
    const required = new Set(Array.isArray(node.required) ? node.required : []);
    // WooCommerce rarely says which nested fields are required, so a nested
    // field it lists as optional usually just means "not declared". Top-level
    // fields always count as declared.
    const requiredDeclared =
      !prefix ||
      required.size > 0 ||
      Object.values(props).some((p) => p?.required === true);

    for (const [name, child] of Object.entries(props)) {
      const path = prefix ? `${prefix}.${name}` : name;
      const desc = describeNode(child, required, name, requiredDeclared);
      fields[path] = desc;

      // Unwrap anyOf/oneOf nullable wrapper so nested properties are still
      // traversed when the object is nullable (Zod 4 emits anyOf for .nullable()).
      const traversable = unwrapOneOfNull(child) ?? child;
      if (desc.type === 'object' && traversable?.properties) {
        visit(traversable, path);
      }
      // Walk object elements of arrays too, as `field[].child`, so element
      // shapes such as line_items, meta_data or images are compared.
      if (desc.type === 'array' && traversable?.items) {
        const items = unwrapOneOfNull(traversable.items) ?? traversable.items;
        // Only object elements: WC sometimes attaches `properties` to items
        // declared as another type (leaderboard `rows` is an array of arrays).
        const itemType = nodeType(items).type;
        if (
          items?.properties &&
          (itemType === 'object' || itemType === 'any')
        ) {
          visit(items, `${path}[]`);
        }
      }
    }
  }

  visit(root, '');

  return {
    fields,
    additionalProperties: isAdditionalPropertiesOpen(root),
  };
}
