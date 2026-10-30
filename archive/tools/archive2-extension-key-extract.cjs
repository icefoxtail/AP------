'use strict';
// Read-only extractor for Generated-only EXTENSION keys (EXT-L3 / EXT-L4 / EXT-COND / EXT-CROSS /
// EXT-CC / EXT-TPL / EXT-PT ...). It only reads JSON that the ALIVE/GPT lines already wrote under
//   archive/generated/lite/v1/**/extension-meta|extension-l4|extension-l3/*.json
//   archive/data/meta-foundation/extensions/**/*.json   (when present)
// and normalises the many historical registry schemas into one definition shape. It never writes
// to a source file, never touches canonical registries and never invents a value: a field that is
// not stated by a source stays absent.
//
// The output (a plain object) is the content of archive/data/archive2-extension-keys.json, the
// compact derived index that the browser resolver (archive/archive2-key-resolver.js) loads lazily.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const SCHEMA_VERSION = 'archive2-extension-keys-v1';
const SOURCE_ROOTS = Object.freeze([
  { root: 'archive/generated/lite/v1', dirs: ['extension-meta', 'extension-l4', 'extension-l3'] },
  { root: 'archive/data/meta-foundation/extensions', dirs: null },
]);

const text = value => (value == null ? '' : String(value)).trim();
// "2022", "2022 공통수학1" -> "2022". Only an explicitly recorded curriculum counts: the field itself,
// the unit key prefix (H22-/H15-) or the registry's own directory (.../v1/2022/...). Never converted.
const curriculumOf = value => (/(?:^|\D)(2015|2022)(?:\D|$)/.exec(text(value)) || [])[1] || '';
const curriculumFromPath = file => curriculumOf((/\/v1\/(\d{4})\//.exec(file) || [])[1]);
const array = value => (Array.isArray(value) ? value : value == null ? [] : [value]);
const isExt = value => typeof value === 'string' && /^EXT-/.test(value);
const RPM_ID = /^[A-Z0-9]+-RPM-\d+$/;
const UNIT_KEY = /^[HM]\d{1,2}-[A-Z0-9]+(?:-[A-Z0-9_]+)*$/;
const CANONICAL_KEY = /^(?:PT|TPL|TT|CC|COND)_[A-Z0-9_]+$/;

// Properties that declare the PARENT of a key (not a comparator, not a sibling reference).
const PARENT_ID_PROPS = new Set([
  'parentPrimaryL3RecordId', 'parentRPMPrimaryL3RecordId', 'parentLockedRpmL3Id', 'parentRpmL3RecordIds',
  'parentLockedRpmRecordIds', 'parentRpmRecordId', 'canonicalRPMParentId', 'parentL3Id', 'parentPrimaryRpmRecordId',
  'parentRpmL3RecordId', 'parentPrimaryL3Id', 'canonicalParentL3RecordId', 'rpmParentRecordIds',
  'parentLockedRpmRecordId', 'parentRPMPrimaryL3RecordIds', 'parentRPMPrimaryL3RecordId', 'recordId', 'recordIds',
  'exactRpmRecordId',
]);
// Parent properties whose value is either a record id or an L3 label.
const PARENT_MIXED_PROPS = new Set([
  'parentPrimaryL3', 'parentL3', 'parent', 'primaryL3', 'rpmPrimaryL3', 'proposedParentRPMPrimaryL3',
  'lockedParentL3', 'parentLockedPrimaryL3', 'parentL3Label', 'parentPrimaryL3Label', 'parentLockedRpmL3Label',
  'parentRPMPrimaryL3', 'parentRpmL3', 'parentLockedRpmL3', 'parentPrimaryL3Name', 'canonicalRPMParentL3',
  'primaryRPMParentL3', 'primaryL3Label', 'parentRPMPrimaryL3Label', 'lockedPrimaryL3', 'lockedParentL3',
  'primaryRPMParentL3',
]);
const PARENT_L4_PROPS = new Set([
  'canonicalRPMParentL4', 'parentRpmL4', 'parentL4', 'canonicalParentL4', 'parentLockedRpmL4', 'rpmParentL4Label',
  'nearestRpmL4', 'parentRpmL4Label',
]);
const PARENT_EXT_PROPS = new Set(['parentGeneratedExtL3Id']);
const PARENT_PT_PROPS = new Set([
  'canonicalProblemTypeKey', 'existingCanonicalProblemType', 'parentProblemTypeKey', 'existingProblemType',
  'existingProblemTypeKey', 'existingActiveProblemTypeKey', 'actualActivePt',
]);
const PARENT_TPL_PROPS = new Set([
  'canonicalTemplateKey', 'existingTemplate', 'existingTemplateKey', 'actualActiveTpl',
]);
const COMPARATOR_PROPS = new Set([
  'closestCanonicalL4', 'existingCanonicalL4', 'canonicalRPMComparatorRecordIds', 'canonicalComparatorRecordIds',
  'canonicalComparatorRPMIds', 'closestCanonicalRPMRecords', 'lookupComparatorRPM', 'closestCanonicalL3',
  'existingCanonicalL3', 'canonicalL4',
]);
const UNIT_PROPS = new Set(['parentStandardUnitKey', 'standardUnitKey', 'subUnitKey', 'parentSubUnitKey', 'semanticSourceScope']);

const ID_PROPS = [
  ['generatedExtL4Id', 'l4'], ['candidateL4Id', 'l4'], ['generatedExtL3Id', 'l3'], ['candidateL3Id', 'l3'],
  ['generatedExtConditionId', 'cond'], ['generatedBindingId', null], ['id', null], ['key', null],
];
const CONTAINER_KIND = {
  conditions: 'cond', conditionDefinitions: 'cond', crossConcepts: 'cross', crossConceptDefinitions: 'cross',
  templates: 'tpl', generatedTemplates: 'tpl', reusedTemplates: 'tpl', problemTypes: 'pt',
};
const PREFIX_KIND = [
  [/^EXT-L4-/, 'l4'], [/^EXT-L3-/, 'l3'], [/^EXT-COND-/, 'cond'], [/^EXT-CROSS-/, 'cross'], [/^EXT-CC-/, 'cross'],
  [/^EXT-TPL-/, 'tpl'], [/^EXT-PT-/, 'pt'],
];
const INFIX_KIND = [
  [/-L4-/, 'l4'], [/-L3-/, 'l3'], [/-COND-/, 'cond'], [/-CROSS-/, 'cross'], [/-CC-/, 'cross'], [/-TPL-/, 'tpl'],
  [/-PT-/, 'pt'],
];

function classifyRef(value) {
  const v = text(value);
  if (!v) return null;
  if (isExt(v)) return { type: 'ext', value: v };
  if (RPM_ID.test(v)) return { type: 'record', value: v };
  if (CANONICAL_KEY.test(v)) return { type: 'canonical', value: v };
  if (UNIT_KEY.test(v)) return { type: 'unit', value: v };
  if (/^UNVERIFIED|^NO_|^NONE$|^N\/A$/i.test(v)) return null;
  const recordInside = v.match(/\b([A-Z0-9]+-RPM-\d+)\b/);
  if (recordInside && v.length > recordInside[0].length) return { type: 'record', value: recordInside[1] };
  // "L3-1.2.1|직선의 방정식" keeps its human label; the code alone is not a label.
  const pipe = v.indexOf('|');
  if (pipe > 0 && /^L\d-[\d.]+$/.test(v.slice(0, pipe))) return { type: 'label', value: v.slice(pipe + 1).trim(), code: v.slice(0, pipe) };
  if (/^L\d-[\d.]+$/.test(v)) return { type: 'code', value: v };
  return { type: 'label', value: v };
}

function collectParentRefs(object, into) {
  for (const [name, raw] of Object.entries(object)) {
    const values = array(raw).filter(item => typeof item === 'string');
    if (!values.length) continue;
    const group = PARENT_ID_PROPS.has(name) ? 'id' : PARENT_MIXED_PROPS.has(name) ? 'mixed'
      : PARENT_L4_PROPS.has(name) ? 'l4' : PARENT_EXT_PROPS.has(name) ? 'ext'
        : PARENT_PT_PROPS.has(name) ? 'pt' : PARENT_TPL_PROPS.has(name) ? 'tpl'
          : COMPARATOR_PROPS.has(name) ? 'comparator' : UNIT_PROPS.has(name) ? 'unit' : '';
    if (!group) continue;
    for (const item of values) {
      const ref = classifyRef(item);
      if (!ref) continue;
      if (group === 'comparator') {
        if (ref.type === 'record' || ref.type === 'label' || ref.type === 'canonical') into.comparators.add(ref.value);
        continue;
      }
      if (group === 'unit') { if (ref.type === 'unit') into.unitKeys.add(ref.value); continue; }
      if (group === 'pt') { if (ref.type === 'canonical') into.ptKeys.add(ref.value); continue; }
      if (group === 'tpl') { if (ref.type === 'canonical') into.tplKeys.add(ref.value); continue; }
      if (group === 'l4') { if (ref.type === 'label') into.l4Labels.add(ref.value); continue; }
      if (ref.type === 'record') into.recordIds.add(ref.value);
      else if (ref.type === 'ext') into.extParents.add(ref.value);
      else if (ref.type === 'label' && group === 'mixed') into.l3Labels.add(ref.value);
      else if (ref.type === 'code') into.l3Codes.add(item);
    }
  }
}

function emptyRefs() {
  return {
    recordIds: new Set(), extParents: new Set(), l3Labels: new Set(), l3Codes: new Set(), l4Labels: new Set(),
    ptKeys: new Set(), tplKeys: new Set(), unitKeys: new Set(), comparators: new Set(),
  };
}
const freezeRefs = refs => {
  const out = {};
  for (const [name, set] of Object.entries(refs)) if (set.size) out[name] = [...set].sort();
  return out;
};
function mergeRefs(base, extra) {
  const out = emptyRefs();
  for (const source of [base, extra]) for (const [name, set] of Object.entries(source)) for (const v of set) out[name].add(v);
  return out;
}
const hasParentRefs = refs => refs.recordIds.size || refs.extParents.size || refs.l3Labels.size || refs.l3Codes.size;

function fileDefaults(json) {
  const refs = emptyRefs();
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    collectParentRefs(json, refs);
    for (const nested of ['sourceUidMetadataProjection']) if (json[nested]) void nested;
    // parentPrimaryL3 as a nested object (geumdang q14) carries its own id/label.
    const nestedParent = json.parentPrimaryL3;
    if (nestedParent && typeof nestedParent === 'object' && !Array.isArray(nestedParent)) collectParentRefs(nestedParent, refs);
  }
  return refs;
}

function definitionKind(object, keyProp, container, key) {
  for (const [pattern, kind] of PREFIX_KIND) if (pattern.test(key)) return { kind, basis: 'prefix' };
  const idKind = ID_PROPS.find(([name]) => name === keyProp)?.[1];
  if (idKind) return { kind: idKind, basis: 'id-property' };
  if (CONTAINER_KIND[container]) return { kind: CONTAINER_KIND[container], basis: 'container' };
  if (/^(template|tpl)$/i.test(text(object.type) || text(object.kind))) return { kind: 'tpl', basis: 'type-property' };
  for (const [pattern, kind] of INFIX_KIND) if (pattern.test(key)) return { kind, basis: 'infix' };
  return { kind: 'l4', basis: 'default' };
}

function pickText(object, names) {
  for (const name of names) if (typeof object[name] === 'string' && object[name].trim()) return object[name].trim();
  return '';
}
const LABEL_NAMES = ['labelKo', 'label', 'canonicalLabelKo', 'name', 'titleKo'];
const DEFINITION_NAMES = ['definition', 'decisiveStep', 'definingDecisiveStep', 'decisiveStepSignature', 'role'];

function uidsOf(object) {
  const uids = new Set();
  for (const name of ['exampleUids', 'scopeUids', 'uids', 'sourceUids', 'examples']) {
    for (const item of array(object[name])) {
      if (typeof item === 'string' && /^ALITE-|^ALIVE-|^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/.test(item)) uids.add(item);
      else if (item && typeof item === 'object' && typeof item.uid === 'string') uids.add(item.uid);
    }
  }
  for (const name of ['sourceUid', 'evidenceUid']) if (typeof object[name] === 'string') uids.add(object[name]);
  return uids;
}

function extractFromJson(file, json) {
  const defaults = fileDefaults(json);
  const header = {
    schemaVersion: text(json?.schemaVersion),
    fileStatus: text(json?.status),
    curriculum: curriculumOf(json?.curriculum) || curriculumOf(json?.educationalScope) || curriculumFromPath(file),
    standardCourse: text(json?.standardCourse || json?.course),
    sourceExam: text(json?.sourceExamPath || json?.sourceExam || json?.sourceOriginalExam || json?.sourceSchoolExam || json?.sourcePath),
  };
  const found = [];
  const bindings = [];
  const walk = (node, container, ancestors) => {
    if (Array.isArray(node)) { for (const item of node) walk(item, container, ancestors); return; }
    if (!node || typeof node !== 'object') return;
    let keyProp = '';
    let key = '';
    for (const [name] of ID_PROPS) {
      if (isExt(node[name])) { keyProp = name; key = node[name]; break; }
    }
    if (key && /^EXT-BIND-/.test(key)) {
      const refs = emptyRefs();
      collectParentRefs(node, refs);
      bindings.push({
        key, canonicalProblemTypeKey: text(node.canonicalProblemTypeKey), canonicalTemplateKey: text(node.canonicalTemplateKey),
        parentRefs: freezeRefs(refs), uidCount: uidsOf(node).size, status: text(node.status),
      });
    } else if (key && (pickText(node, LABEL_NAMES) || keyProp !== 'id' || container)) {
      const refs = emptyRefs();
      collectParentRefs(node, refs);
      const own = hasParentRefs(refs);
      const merged = own ? refs : mergeRefs(refs, defaults);
      for (const ancestor of ancestors) if (!hasParentRefs(merged)) collectParentRefs(ancestor, merged);
      // Defaults still supply unit keys / PT / TPL when the entry only names its own parent.
      for (const name of ['unitKeys', 'ptKeys', 'tplKeys']) if (!merged[name].size) for (const v of defaults[name]) merged[name].add(v);
      for (const v of defaults.comparators) merged.comparators.add(v);
      const { kind, basis } = definitionKind(node, keyProp, container, key);
      const uids = uidsOf(node);
      found.push({
        key,
        kind,
        kindBasis: basis,
        label: pickText(node, LABEL_NAMES),
        definition: pickText(node, DEFINITION_NAMES),
        status: text(node.status || node.lifecycle || node.namespace || node.reviewStatus),
        reviewStatus: text(node.reviewStatus),
        canonicalPromoted: node.canonicalPromoted === true || node.canonicalRpmPromoted === true || node.canonicalRpmPromotion === true,
        consumerSelectable: typeof node.consumerSelectable === 'boolean' ? node.consumerSelectable : undefined,
        declaredReference: container === 'reusedExistingL4' || container === 'reusedCrossConcepts' || undefined,
        parentRefs: freezeRefs(merged),
        parentDeclaredOnEntry: own || undefined,
        curriculum: curriculumOf(node.curriculum) || header.curriculum || undefined,
        sourceQid: Number.isInteger(node.sourceQid) ? node.sourceQid : Number.isInteger(json?.sourceQid) ? json.sourceQid : undefined,
        uidCount: uids.size || (Number.isInteger(node.uidCount) ? node.uidCount : 0),
        file,
        schemaVersion: header.schemaVersion || undefined,
      });
    }
    // Bare key lists ("keys": ["EXT-..."], optionally parallel to "sourceUids") define keys without labels.
    for (const listName of ['keys', 'extensionKeys']) {
      const list = node[listName];
      if (!Array.isArray(list) || !list.length || !list.every(isExt)) continue;
      const refs = emptyRefs();
      collectParentRefs(node, refs);
      const merged = hasParentRefs(refs) ? refs : mergeRefs(refs, defaults);
      const parallelUids = Array.isArray(node.sourceUids) && node.sourceUids.length === list.length ? node.sourceUids : [];
      list.forEach((listed, index) => {
        const { kind, basis } = definitionKind(node, listName, container, listed);
        found.push({
          key: listed, kind, kindBasis: basis, label: '', definition: '',
          status: text(node.status || node.namespace), reviewStatus: '', canonicalPromoted: false,
          parentRefs: freezeRefs(merged), parentDeclaredOnEntry: true,
          curriculum: header.curriculum || undefined,
          sourceQid: Number.isInteger(node.sourceQid) ? node.sourceQid : undefined,
          uidCount: parallelUids[index] ? 1 : 0, file, schemaVersion: header.schemaVersion || undefined,
        });
      });
    }
    for (const [name, value] of Object.entries(node)) {
      if (value && typeof value === 'object') {
        // Do not descend into per-UID metadata projections: they restate keys, they do not define them.
        if (name === 'sourceUidMetadataProjection' || name === 'provenance' || name === 'students') continue;
        walk(value, Array.isArray(value) ? name : container, key ? [...ancestors, node] : ancestors);
      }
    }
  };
  walk(json, '', []);
  return { header, found, bindings };
}

function* walkDir(directory) {
  let entries;
  try { entries = fs.readdirSync(directory, { withFileTypes: true }); } catch { return; }
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walkDir(full);
    else yield full;
  }
}

function listSourceFiles(repoRoot) {
  const files = [];
  for (const source of SOURCE_ROOTS) {
    const base = path.join(repoRoot, source.root);
    for (const full of walkDir(base)) {
      if (!full.endsWith('.json')) continue;
      const rel = path.relative(repoRoot, full).split(path.sep).join('/');
      if (source.dirs && !source.dirs.some(dir => rel.includes(`/${dir}/`))) continue;
      files.push(rel);
    }
  }
  return files.sort();
}

// Priority when one key is defined in several places: a registry that states a definition and a
// parent beats a bare reference; `extension-l4` registry beats `extension-meta` echoes.
function priority(definition) {
  let score = 0;
  if (definition.definition) score += 4;
  if (definition.label) score += 2;
  if (definition.parentRefs.recordIds || definition.parentRefs.extParents) score += 2;
  if (definition.parentDeclaredOnEntry) score += 1;
  if (definition.declaredReference) score -= 5;
  return score;
}

function buildIndex(repoRoot) {
  const files = listSourceFiles(repoRoot);
  const digest = crypto.createHash('sha256');
  const byKey = new Map();
  const bindings = [];
  const fileStats = [];
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(repoRoot, file));
    digest.update(`${file}\0${crypto.createHash('sha256').update(bytes).digest('hex')}\n`);
    let json;
    try { json = JSON.parse(bytes.toString('utf8')); } catch (error) {
      fileStats.push({ file, error: 'JSON_PARSE_FAILED' });
      continue;
    }
    const { found, bindings: fileBindings } = extractFromJson(file, json);
    fileStats.push({ file, definitions: found.length });
    bindings.push(...fileBindings.map(item => ({ ...item, file })));
    for (const definition of found) {
      const entry = byKey.get(definition.key) || { definitions: [] };
      entry.definitions.push(definition);
      byKey.set(definition.key, entry);
    }
  }
  const definitions = [];
  for (const key of [...byKey.keys()].sort()) {
    const { definitions: all } = byKey.get(key);
    const ranked = [...all].sort((a, b) => priority(b) - priority(a));
    const primary = { ...ranked[0] };
    const files = [...new Set(all.map(item => item.file))].sort();
    if (files.length > 1) primary.files = files;
    delete primary.file;
    primary.file = ranked[0].file;
    // Same key, different labels: kept visible, never merged silently.
    const labels = [...new Set(all.map(item => item.label).filter(Boolean))];
    if (labels.length > 1) primary.labelConflicts = labels.filter(label => label !== primary.label).sort();
    // Same key, different kinds (e.g. echoed as a condition and as an L4): visible as well.
    const kinds = [...new Set(all.map(item => item.kind))];
    if (kinds.length > 1) primary.kindConflicts = kinds.filter(kind => kind !== primary.kind).sort();
    for (const field of Object.keys(primary)) if (primary[field] === undefined || primary[field] === '' ) delete primary[field];
    definitions.push(primary);
  }
  bindings.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const byKind = {};
  for (const item of definitions) byKind[item.kind] = (byKind[item.kind] || 0) + 1;
  return {
    schemaVersion: SCHEMA_VERSION,
    status: 'DERIVED_READ_ONLY',
    policy: 'Generated-only extension keys; never written to canonical registries or RPM LOCKED values; never attached to original exam items.',
    sourceRoots: SOURCE_ROOTS.map(source => source.root),
    sourceFileCount: files.length,
    sourceDigest: digest.digest('hex'),
    definitionCount: definitions.length,
    definitionsByKind: Object.fromEntries(Object.entries(byKind).sort()),
    bindingCount: bindings.length,
    definitions,
    bindings,
  };
}

module.exports = { SCHEMA_VERSION, SOURCE_ROOTS, buildIndex, extractFromJson, listSourceFiles, classifyRef };
