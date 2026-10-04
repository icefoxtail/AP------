import { isObject } from './canonical.mjs';

// Deliberately bounded JSON Schema vocabulary. Unsupported schema keywords
// fail rather than silently pretending that a full schema was enforced.
const vocabulary = new Set(['$schema', '$id', '$defs', '$ref', 'title', 'description', 'type', 'const', 'enum', 'required', 'properties', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems', 'minLength', 'pattern', 'minimum', 'maximum', 'oneOf']);
export function validateSchema(value, schema, root = schema, pointer = '$') {
  const errors = [];
  if (!isObject(schema)) return [`${pointer}:INVALID_SCHEMA`];
  for (const key of Object.keys(schema)) if (!vocabulary.has(key)) errors.push(`${pointer}:UNSUPPORTED_SCHEMA_KEYWORD:${key}`);
  if (schema.$ref) {
    if (!/^#\/\$defs\/[A-Za-z0-9_-]+$/.test(schema.$ref)) return [`${pointer}:UNSUPPORTED_SCHEMA_REF`];
    const target = root.$defs?.[schema.$ref.split('/').at(-1)];
    return [...errors, ...validateSchema(value, target, root, pointer)];
  }
  if (schema.oneOf) {
    const matches = schema.oneOf.filter(child => validateSchema(value, child, root, pointer).length === 0);
    if (matches.length !== 1) errors.push(`${pointer}:ONE_OF:${matches.length}`);
  }
  const typeCheck = type => type === 'object' ? isObject(value) : type === 'array' ? Array.isArray(value) : type === 'null' ? value === null : type === 'integer' ? Number.isSafeInteger(value) : type === 'number' ? typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER : typeof value === type;
  if (schema.type && ![schema.type].flat().some(typeCheck)) return [...errors, `${pointer}:TYPE`];
  if ('const' in schema && value !== schema.const) errors.push(`${pointer}:CONST`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${pointer}:ENUM`);
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) errors.push(`${pointer}:MIN_LENGTH`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errors.push(`${pointer}:PATTERN`);
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${pointer}:MINIMUM`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${pointer}:MAXIMUM`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${pointer}:MIN_ITEMS`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${pointer}:MAX_ITEMS`);
    if (schema.uniqueItems && new Set(value.map(item => JSON.stringify(item))).size !== value.length) errors.push(`${pointer}:DUPLICATE`);
    if (schema.items) value.forEach((item, i) => errors.push(...validateSchema(item, schema.items, root, `${pointer}[${i}]`)));
  }
  if (isObject(value)) {
    for (const key of schema.required || []) if (!Object.hasOwn(value, key)) errors.push(`${pointer}.${key}:MISSING`);
    for (const [key, child] of Object.entries(value)) {
      if (schema.properties && Object.hasOwn(schema.properties, key)) errors.push(...validateSchema(child, schema.properties[key], root, `${pointer}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${pointer}.${key}:UNKNOWN_FIELD`);
      else if (isObject(schema.additionalProperties)) errors.push(...validateSchema(child, schema.additionalProperties, root, `${pointer}.${key}`));
    }
  }
  return errors;
}
