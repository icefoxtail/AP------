import fs from 'node:fs';
import crypto from 'node:crypto';

const SET_FIELDS = new Set(['requiredLabels', 'expectedRegions', 'forcedElements', 'forbiddenElements', 'freeElements']);
const SORTED_EDGE_FIELDS = new Set(['proofEdges']);
const SORTED_CASE_FIELDS = new Set(['caseRows']);
const PROJECTION_SPEC = JSON.parse(fs.readFileSync(new URL('../specs/semantic-projection-spec-v1.json', import.meta.url), 'utf8'));
const FACT_SCHEMA = JSON.parse(fs.readFileSync(new URL('../specs/logic-visual-fact-schema-v1.json', import.meta.url), 'utf8'));

const normalizeString = (value) => String(value).normalize('NFC').replace(/[−‐‑‒–—]/g, '-').replace(/\s+/g, ' ').trim();
const primitiveKey = (value) => typeof value === 'string' ? normalizeString(value) : JSON.stringify(value);

function canonicalize(value, field = '') {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return normalizeString(value);
  if (Array.isArray(value)) {
    const items = value.map((item) => canonicalize(item));
    if (SET_FIELDS.has(field)) {
      const keys = new Set(items.map(primitiveKey));
      if (keys.size !== items.length) throw new Error(`duplicate value in SET field: ${field}`);
      return [...items].sort((a, b) => primitiveKey(a).localeCompare(primitiveKey(b), 'en'));
    }
    if (SORTED_EDGE_FIELDS.has(field)) {
      return [...items].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));
    }
    if (SORTED_CASE_FIELDS.has(field)) {
      return [...items].sort((a, b) => String(a?.caseId ?? '').localeCompare(String(b?.caseId ?? ''), 'en'));
    }
    return items;
  }
  if (typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key], key)]));
  }
  throw new Error(`unsupported fact value: ${typeof value}`);
}

function validateSchemaValue(value, schema, path = '$') {
  const errors = [];
  if (!schema) return errors;
  if (schema.const !== undefined && value !== schema.const) errors.push(`${path}:const`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}:enum`);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const valid = types.some((type) => {
      if (type === 'null') return value === null;
      if (type === 'array') return Array.isArray(value);
      if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
      if (type === 'integer') return Number.isInteger(value);
      if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
      if (type === 'string') return typeof value === 'string';
      if (type === 'boolean') return typeof value === 'boolean';
      return true;
    });
    if (!valid) return [`${path}:type`];
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}:minLength`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}:maxLength`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}:minItems`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path}:maxItems`);
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}:minimum`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}:maximum`);
  }
  if (Array.isArray(value) && schema.items) value.forEach((item, index) => errors.push(...validateSchemaValue(item, schema.items, `${path}[${index}]`)));
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && schema.properties) {
    for (const [key, child] of Object.entries(schema.properties)) if (key in value) errors.push(...validateSchemaValue(value[key], child, `${path}.${key}`));
  }
  return errors;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256(value) {
  const input = typeof value === 'string' ? value : canonicalJson(value);
  return `sha256:${crypto.createHash('sha256').update(input).digest('hex')}`;
}

export function validateFact(fact) {
  const errors = [];
  errors.push(...validateSchemaValue(fact, FACT_SCHEMA));
  if (!fact || fact.factSchemaVersion !== FACT_SCHEMA.properties.factSchemaVersion.const) errors.push('FACT_SCHEMA_VERSION');
  for (const field of FACT_SCHEMA.required) if (!(field in (fact || {}))) errors.push(`missing:${field}`);
  if (typeof fact?.questionUid !== 'string' || fact.questionUid.trim().length === 0) errors.push('questionUid:type');
  if (typeof fact?.visualRole !== 'string' || fact.visualRole.trim().length === 0) errors.push('visualRole:type');
  for (const field of ['requiredLabels', 'decisiveStepIds']) {
    if (!Array.isArray(fact?.[field]) || fact[field].some((value) => typeof value !== 'string' || value.trim().length === 0)) errors.push(`${field}:type`);
  }
  const fields = PROJECTION_SPEC.projectionByVisualType[fact?.visualType];
  if (fact?.visualType !== 'NONE' && !fields) errors.push(`unknownVisualType:${fact?.visualType}`);
  for (const field of fields || []) if (!(field in fact)) errors.push(`missingProjectionField:${field}`);
  for (const field of SET_FIELDS) if (Array.isArray(fact?.[field]) && new Set(fact[field].map(primitiveKey)).size !== fact[field].length) errors.push(`duplicateSet:${field}`);
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;
  if (fact?.visualType === 'SET_REGION_VENN_2' || fact?.visualType === 'SET_REGION_VENN_3') {
    if (!Array.isArray(fact.expectedRegions) || fact.expectedRegions.some((value) => typeof value !== 'string')) errors.push('expectedRegions:type');
    if (!isObject(fact.boundaryIdentity)) errors.push('boundaryIdentity:type');
  }
  if (fact?.visualType === 'SET_CARDINALITY_VENN') {
    if (!isObject(fact.cardinalityByRegion)) errors.push('cardinalityByRegion:type');
    if (!Number.isFinite(fact.totalCardinality) || fact.totalCardinality < 0) errors.push('totalCardinality:type');
    if (!isObject(fact.extremeConfiguration)) errors.push('extremeConfiguration:type');
  }
  if (fact?.visualType === 'SET_CASE_PARTITION' || fact?.visualType === 'CASE_TABLE' || fact?.visualType === 'TRUTH_TABLE') {
    if (!Array.isArray(fact.caseRows) || fact.caseRows.some((row) => !isObject(row))) errors.push('caseRows:type');
    else {
      const caseIds = fact.caseRows.map((row) => row.caseId);
      if (caseIds.some((value) => typeof value !== 'string' || value.trim().length === 0)) errors.push('caseRows.caseId:type');
      if (new Set(caseIds).size !== caseIds.length) errors.push('caseRows.caseId:duplicate');
    }
  }
  if (fact?.visualType === 'SET_LATTICE_POINT_COUNT') {
    if (!Array.isArray(fact.latticePointFamilies) || fact.latticePointFamilies.some((family) => !isObject(family) || typeof family.familyId !== 'string' || family.familyId.trim().length === 0 || typeof family.pattern !== 'string' || !isNonNegativeInteger(family.count))) errors.push('latticePointFamilies:type');
    else if (new Set(fact.latticePointFamilies.map((family) => family.familyId)).size !== fact.latticePointFamilies.length) errors.push('latticePointFamilies.familyId:duplicate');
    if (typeof fact.domainDescription !== 'string' || fact.domainDescription.length === 0) errors.push('domainDescription:type');
    if (!['string', 'number'].includes(typeof fact.countingResult)) errors.push('countingResult:type');
  }
  if (fact?.visualType === 'SET_FORCE_FORBID_FREE') {
    for (const field of ['forcedElements', 'forbiddenElements', 'freeElements']) if (!Array.isArray(fact[field])) errors.push(`${field}:type`);
    if (!isNonNegativeInteger(fact.freeCount)) errors.push('freeCount:type');
  }
  if (fact?.visualType === 'SET_NUMBER_LINE' && !Array.isArray(fact.intervalComponents)) errors.push('intervalComponents:type');
  return { pass: errors.length === 0, errors };
}

export function projectSemantic(fact) {
  const fields = PROJECTION_SPEC.projectionByVisualType[fact.visualType] || [];
  // questionUid identifies the source item, but is not part of its mathematical
  // meaning. Keeping it out of this projection is required for cross-UID shared
  // visual equivalence checks; use the raw fact/identity hash for item identity.
  const projection = { factSchemaVersion: fact.factSchemaVersion, visualType: fact.visualType };
  for (const field of fields) projection[field] = fact[field];
  return canonicalize(projection);
}

export function semanticSha(fact) {
  return sha256(projectSemantic(fact));
}

export function projectSemanticContent(fact) {
  const fields = PROJECTION_SPEC.projectionByVisualType[fact.visualType] || [];
  const projection = { factSchemaVersion: fact.factSchemaVersion, visualType: fact.visualType };
  for (const field of fields) projection[field] = fact[field];
  return canonicalize(projection);
}

export function semanticContentSha(fact) {
  return sha256(projectSemanticContent(fact));
}

export function structureFingerprint(fact) {
  const value = {
    visualType: fact.visualType,
    regionTopology: fact.expectedRegions || fact.truthSetRelation || null,
    boundaryTopology: fact.boundaryIdentity || fact.universe || null,
    arrowTopology: fact.edges || fact.proofEdges || null,
    intervalComponentTopology: fact.intervalComponents || null,
    tableShape: fact.caseRows ? fact.caseRows.map((row) => Object.keys(row || {}).sort()) : null,
    panelStructure: fact.visualRole || null,
    semanticRolePattern: fact.requiredLabels || []
  };
  return sha256(value);
}
