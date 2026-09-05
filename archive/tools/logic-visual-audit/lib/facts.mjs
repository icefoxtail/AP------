import fs from 'node:fs';
import path from 'node:path';
import { sha256, stableStringify } from './io.mjs';

export const FACT_SCHEMA_VERSION = 'LOGIC_VISUAL_FACT_v1';

const SET_FIELDS = new Set([
  'expectedRegions', 'forcedElements', 'forbiddenElements', 'freeElements', 'universeLabels',
  'requiredLabels', 'regionLabels', 'boundaryLabels', 'semanticRolePattern'
]);

const SORT_BY_KEY_FIELDS = new Set(['proofEdges']);
const SORT_BY_CASE_ID_FIELDS = new Set(['caseRows']);
const SEQUENCE_FIELDS = new Set(['proofSteps', 'truthVector', 'intervalComponents']);

export function canonicalizeFact(fact) {
  if (!fact || typeof fact !== 'object' || Array.isArray(fact)) throw new Error('fact must be an object');
  const visit = (value, fieldName = '') => {
    if (Array.isArray(value)) {
      const items = value.map((item) => visit(item, fieldName));
      if (SET_FIELDS.has(fieldName)) return items.sort((a, b) => stableStringify(a).localeCompare(stableStringify(b)));
      if (SORT_BY_KEY_FIELDS.has(fieldName)) return items.sort((a, b) => String(a?.key ?? '').localeCompare(String(b?.key ?? '')));
      if (SORT_BY_CASE_ID_FIELDS.has(fieldName)) return items.sort((a, b) => String(a?.caseId ?? '').localeCompare(String(b?.caseId ?? '')));
      return items;
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map((key) => [key, visit(value[key], key)]));
    }
    return value;
  };
  return visit(fact);
}

export function projectSemantic(fact, spec) {
  const fields = spec?.semanticFields?.[fact.visualType];
  if (!fields) throw new Error(`missing semantic projection for ${fact.visualType}`);
  const result = { visualType: fact.visualType };
  for (const field of fields) {
    if (!(field in fact)) throw new Error(`required semantic field missing: ${fact.visualType}.${field}`);
    result[field] = fact[field];
  }
  return canonicalizeFact(result);
}

export function semanticHash(fact, spec) {
  return sha256(projectSemantic(fact, spec));
}

export function canonicalFactHash(fact) {
  return sha256(canonicalizeFact(fact));
}

export function validateFact(fact, schema) {
  const errors = [];
  if (!fact || typeof fact !== 'object' || Array.isArray(fact)) return ['fact must be an object'];
  if (fact.factSchemaVersion !== FACT_SCHEMA_VERSION) errors.push(`factSchemaVersion must be ${FACT_SCHEMA_VERSION}`);
  if (!fact.visualType || !schema.visualTypes?.[fact.visualType]) errors.push(`unsupported visualType: ${fact.visualType ?? '(missing)'}`);
  const required = schema.visualTypes?.[fact.visualType]?.requiredFields ?? [];
  for (const field of required) {
    if (!(field in fact)) errors.push(`missing required field: ${fact.visualType}.${field}`);
  }
  if (Object.keys(fact).length <= 1) errors.push('free-form empty fact is forbidden');
  return errors;
}

export function loadSpecs(specDir) {
  return {
    schema: JSON.parse(fs.readFileSync(path.join(specDir, 'logic-visual-fact-schema-v1.json'), 'utf8')),
    projection: JSON.parse(fs.readFileSync(path.join(specDir, 'semantic-projection-spec-v1.json'), 'utf8')),
    canonicalization: JSON.parse(fs.readFileSync(path.join(specDir, 'fact-canonicalization-spec-v1.json'), 'utf8'))
  };
}
