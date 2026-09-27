#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  BASE_MAIN_SHA as M1_M2_BASE_MAIN_SHA,
  CANONICAL_DIR,
  CROSSWALK_DIR,
  MASTER_PATH,
  RPM,
  collectGlobalActive,
  exactBindings,
  flattenMaster,
  parseView,
  scopeViewPaths,
} from './normalize-rpm-primary-m1-m2.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const M3_BASE_MAIN_SHA = '1baada0ab3ae6f13528edc6a6feb12ff8848479d';
export const M3_SCOPES = ['M3-1', 'M3-2'];
export const M3_CROSSWALK_PATH = `${CROSSWALK_DIR}/middle3.json`;
export const M3_EVIDENCE_DIR = 'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m3-normalization';
const readText = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8').replace(/^\uFEFF/, '');
const readJson = relative => JSON.parse(readText(relative));
const writeJson = (relative, value) => {
  const target = path.join(ROOT, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function flattenM3Master(master = readJson(MASTER_PATH)) {
  return flattenMaster(master, { scopes: new Set(M3_SCOPES) })
    .sort((a, b) => Number(a.curriculum) - Number(b.curriculum)
      || M3_SCOPES.indexOf(a.scope) - M3_SCOPES.indexOf(b.scope)
      || a.rpmSource.localeCompare(b.rpmSource)
      || a.majorUnit.localeCompare(b.majorUnit, 'ko')
      || a.midUnit.localeCompare(b.midUnit, 'ko')
      || a.l3.localeCompare(b.l3, 'ko')
      || a.l4.localeCompare(b.l4, 'ko'));
}

export function m3SemanticKey(row) {
  return [row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4].join('|');
}

function crosswalkKey(row) {
  return [row.curriculum, row.scope, row.rpmPath.majorUnit, row.rpmPath.midUnit, row.rpmPath.l3, row.rpmPath.l4].join('|');
}

function countStatuses(rows, field = 'mappingStatus') {
  return rows.reduce((counts, row) => {
    const status = row[field] || 'UNKNOWN';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function ensureTemplateKeys(global, templateKeys, problemTypeKey) {
  for (const key of templateKeys) {
    const template = global.templates.get(key);
    if (!template || template.status !== 'ACTIVE' || template.parentProblemTypeKey !== problemTypeKey) {
      throw new Error(`Invalid GLOBAL ACTIVE template ${key} for ${problemTypeKey}`);
    }
  }
}

function applyMappedRow(row, global, { problemTypeKey, templateKeys, family = false, selectionRule = '' }) {
  const problemType = global.problemTypes.get(problemTypeKey);
  if (!problemType || problemType.status !== 'ACTIVE') throw new Error(`Missing GLOBAL ACTIVE problem type ${problemTypeKey}`);
  ensureTemplateKeys(global, templateKeys, problemTypeKey);
  const binding = exactBindings(global, { ...row, problemTypeKey }).find(candidate => candidate.status === 'ACTIVE') || null;
  row.problemTypeKey = problemTypeKey;
  row.problemTypeLabelKo = problemType.canonicalLabelKo;
  row.ownerPack = problemType.ownerPack;
  row.bindingStatus = binding ? 'ACTIVE' : 'MISSING';
  if (binding) row.binding = { curriculum: binding.curriculum, standardUnitKey: binding.standardUnitKey,
    subUnitKey: binding.subUnitKey || '', ownerPack: binding.ownerPack };
  else delete row.binding;
  if (family) {
    row.mappingStatus = binding ? 'FAMILY_ACTIVE' : 'FAMILY_BINDING_GAP';
    delete row.templateKey;
    delete row.templateLabelKo;
    row.templateCandidates = templateKeys.map(templateKey => ({
      templateKey,
      templateLabelKo: global.templates.get(templateKey).canonicalLabelKo,
    }));
    row.selectionRule = selectionRule;
  } else {
    const templateKey = templateKeys[0];
    row.mappingStatus = binding ? 'DIRECT_ACTIVE' : 'DIRECT_BINDING_GAP';
    row.templateKey = templateKey;
    row.templateLabelKo = global.templates.get(templateKey).canonicalLabelKo;
    delete row.templateCandidates;
    delete row.selectionRule;
  }
  return row;
}

function applyRpmOnly(row) {
  row.mappingStatus = 'RPM_ONLY';
  row.bindingStatus = 'NO_ACTIVE_MAPPING';
  delete row.problemTypeKey;
  delete row.problemTypeLabelKo;
  delete row.templateKey;
  delete row.templateLabelKo;
  delete row.templateCandidates;
  delete row.selectionRule;
  delete row.ownerPack;
  delete row.binding;
  return row;
}

export function takeM3BaselineSnapshot() {
  const master = readJson(MASTER_PATH);
  const rows = flattenM3Master(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const global = collectGlobalActive();
  const byKey = new Map(crosswalk.records.map(row => [crosswalkKey(row), row]));
  const missing = rows.filter(row => !byKey.has(m3SemanticKey(row)));
  const orphans = crosswalk.records.filter(row => !rows.some(rpm => m3SemanticKey(rpm) === crosswalkKey(row)));
  if (rows.length !== 181 || crosswalk.records.length !== 181 || missing.length || orphans.length) {
    throw new Error(`Unexpected M3 baseline denominator: ${JSON.stringify({ rpm: rows.length, crosswalk: crosswalk.records.length, missing: missing.length, orphans: orphans.length })}`);
  }
  const rpmViews = [];
  for (const curriculum of ['2015', '2022']) for (const scope of M3_SCOPES) {
    const parsed = parseView(scopeViewPaths(curriculum, scope), curriculum, scope);
    rpmViews.push({ curriculum, scope, rowCount: parsed.length, sha256: sha256(fs.readFileSync(path.join(ROOT, scopeViewPaths(curriculum, scope)))) });
  }
  const oldApplicability = rows.find(row => row.curriculum === '2015' && row.scope === 'M3-1'
    && row.l3 === '일반형' && row.l4 === '최대·최소');
  const snapshot = {
    schemaVersion: 'RPM_PRIMARY_M3_NORMALIZATION_BASELINE_v1',
    baseMainSha: M3_BASE_MAIN_SHA,
    priorM1M2BaseMainSha: M1_M2_BASE_MAIN_SHA,
    rpmMasterSha256: sha256(fs.readFileSync(path.join(ROOT, MASTER_PATH))),
    rpmM3RecordCount: rows.length,
    rpmRecords: rows,
    curriculumViews: rpmViews,
    crosswalk: {
      path: M3_CROSSWALK_PATH,
      sha256: sha256(fs.readFileSync(path.join(ROOT, M3_CROSSWALK_PATH))),
      summary: crosswalk.summary,
      records: crosswalk.records.map(row => ({
        semanticKey: crosswalkKey(row),
        id: row.id,
        mappingStatus: row.mappingStatus,
        bindingStatus: row.bindingStatus,
        problemTypeKey: row.problemTypeKey || '',
        templateKey: row.templateKey || '',
        templateCandidates: (row.templateCandidates || []).map(candidate => typeof candidate === 'string' ? candidate : candidate.templateKey),
        ownerPack: row.ownerPack || '',
        rpmPath: row.rpmPath,
        standardUnitKey: row.standardUnitKey,
        subUnitKey: row.subUnitKey,
      })),
    },
    globalActive: {
      activePacks: global.activePacks,
      problemTypeCount: global.problemTypes.size,
      templateCount: global.templates.size,
      exactBindingCount: global.bindings.length,
      registryFingerprint: global.registryFingerprint,
    },
    curriculumApplicabilityBaseline: oldApplicability ? {
      curriculum: oldApplicability.curriculum, scope: oldApplicability.scope,
      l3: oldApplicability.l3, l4: oldApplicability.l4,
      curriculumApplicability: oldApplicability.curriculumApplicability,
      defaultSelectable: oldApplicability.defaultSelectable,
    } : null,
    existingM3ReviewArtifacts: {
      sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
      l3FreshAssignment: 'archive/data/meta-foundation/evidence/middle-geometry/v1/m3_stage2_l3_fresh_assignment_526.json',
      l3AssignmentStatus: 'CANDIDATE_REVIEW_PENDING_FAIL_CLOSED',
      l3AssignmentDenominator: 526,
      usePolicy: 'Not treated as semantic FINAL authority; this task audits RPM and crosswalk meaning, and does not restart the 1,646-question / 526-row M3 L3 assignment work.'
    },
  };
  writeJson(`${M3_EVIDENCE_DIR}/baseline-snapshot.json`, snapshot);
  const inventory = {
    schemaVersion: 'RPM_PRIMARY_M3_NORMALIZATION_INVENTORY_v1',
    baseMainSha: M3_BASE_MAIN_SHA,
    scope: ['2015/M3-1', '2015/M3-2', '2022/M3-1', '2022/M3-2'],
    rpmRecords: rows.length,
    crosswalkRecords: crosswalk.records.length,
    viewParity: '8/8 views parsed; final parity validation pending after audit',
    currentCrosswalkSummary: crosswalk.summary,
    globalActive: snapshot.globalActive,
    priorM3Ledger: snapshot.existingM3ReviewArtifacts,
    baselineSnapshotPath: `${M3_EVIDENCE_DIR}/baseline-snapshot.json`,
  };
  writeJson(`${M3_EVIDENCE_DIR}/INVENTORY.json`, inventory);
  const state = {
    schemaVersion: 'RPM_PRIMARY_M3_NORMALIZATION_STATE_v1',
    task: 'M3 RPM completeness and GLOBAL ACTIVE crosswalk semantic normalization',
    branch: 'work/meta-rpm-m1-m2-normalization',
    baseMainSha: M3_BASE_MAIN_SHA,
    currentStage: 'BASELINE_FROZEN',
    denominator: { rpmRecords: rows.length, crosswalkRows: crosswalk.records.length, curriculumViews: 8 },
    completedStages: ['LATEST_MAIN_FETCHED', 'NOTION_START_GATE_READ', 'EXISTING_M1_M2_BRANCH_AND_M3_ARTIFACTS_RESTORED', 'M3_RPM_CROSSWALK_BASELINE_FROZEN'],
    remainingStages: ['M3_CURRICULUM_SEMANTIC_PAIR_AUDIT', 'M3_CROSSWALK_SEMANTIC_NORMALIZATION', 'M3_R2E_GAP_REASSESSMENT', 'M3_RESOLVER_RUNTIME_VALIDATION', 'REMOTE_PUSH', 'NOTION_CLOSEOUT'],
    lastCompletedItem: `M3 denominator fixed at ${rows.length} RPM L4 and ${crosswalk.records.length} middle3 crosswalk rows; previous candidate L3 semantic ledger remains pending and was not reused as FINAL authority.`,
    nextStartPoint: 'Build M3 2015/2022 curriculum semantic pairs, review all 181 crosswalk entries against GLOBAL ACTIVE definitions/skeletons/support/bindings, then normalize only confirmed defects.',
    hardBlockers: [],
  };
  writeJson(`${M3_EVIDENCE_DIR}/STATE.json`, state);
  const checkpoints = {
    schemaVersion: 'RPM_PRIMARY_M3_NORMALIZATION_CHECKPOINTS_v1',
    baseMainSha: M3_BASE_MAIN_SHA,
    checkpoints: [{
      name: 'M3_AUDIT_BASELINE',
      stage: 'BASELINE_FROZEN',
      denominator: { rpmRecords: rows.length, crosswalkRows: crosswalk.records.length, views: 8 },
      artifacts: [`${M3_EVIDENCE_DIR}/baseline-snapshot.json`, `${M3_EVIDENCE_DIR}/INVENTORY.json`, `${M3_EVIDENCE_DIR}/STATE.json`],
      baselineSnapshotSha256: sha256(Buffer.from(JSON.stringify(snapshot, null, 2) + '\n', 'utf8')),
      commitSha: 'PENDING',
    }],
    remaining: ['M3_CURRICULUM_AUDIT', 'M3_CROSSWALK_NORMALIZATION', 'M3_VALIDATION', 'REMOTE_PUSH', 'NOTION_CLOSEOUT'],
    mainMerge: 'NOT_REQUESTED',
  };
  writeJson(`${M3_EVIDENCE_DIR}/CHECKPOINTS.json`, checkpoints);
  return { status: 'PASS', baselineSnapshotSha256: sha256(fs.readFileSync(path.join(ROOT, `${M3_EVIDENCE_DIR}/baseline-snapshot.json`))),
    rpmRows: rows.length, crosswalkRows: crosswalk.records.length, viewRows: rpmViews.map(x => ({ curriculum: x.curriculum, scope: x.scope, count: x.rowCount })) };
}

function applyCurriculumApplicabilityRepair(master) {
  const candidates = [];
  for (const block of master.records.filter(row => row.curriculum === '2015' && row.scope === 'M3-1')) {
    for (const concept of block.concepts || []) for (const leaf of concept.problemTypes || []) {
      if (concept.concept === '일반형' && leaf.problemType === '최대·최소') candidates.push({ block, concept, leaf });
    }
  }
  if (candidates.length !== 1) throw new Error(`Expected one 2015/M3-1 RPM max-min applicability candidate; found ${candidates.length}`);
  const { leaf } = candidates[0];
  leaf.curriculumApplicability = 'RPM_EXTENDED_CANDIDATE';
  leaf.defaultSelectable = false;
  return candidates[0];
}

function applyCrosswalkNormalization(crosswalk, global) {
  const byId = new Map(crosswalk.records.map(row => [row.id, row]));
  const rules = [
    ...['M3-RPM-016', 'M3-RPM-017', 'M3-RPM-108', 'M3-RPM-109'].map(id => ({
      id, disposition: 'REMAP_DIRECT_TEMPLATE_TO_POLYNOMIAL_OPERATION', type: 'DIRECT',
      problemTypeKey: 'PT_H1_POLY_OPERATION_EXPANSION', templateKeys: ['TPL_H1_POLY_OPERATION_DIRECT'],
      rationale: 'The RPM leaf asks to multiply/expand two polynomial factors (including conjugate binomials); the former formula-symmetry template uses a narrower perfect-square skeleton. The GLOBAL ACTIVE polynomial-operation template directly expands and simplifies the product.',
    })),
    ...['M3-RPM-020', 'M3-RPM-112'].map(id => ({
      id, disposition: 'REMOVE_NARROW_GEOMETRY_FORMULA_TEMPLATE', type: 'RPM_ONLY',
      rationale: 'The RPM leaf is a broad geometric application of multiplication formulas. The former TPL_H1_FORMULA_SYMMETRIC internal skeleton is a quadratic product-to-perfect-square pattern and does not establish coverage of the geometry-application family; no other GLOBAL ACTIVE template safely covers it.',
    })),
    ...['M3-RPM-055', 'M3-RPM-143'].map(id => ({
      id, disposition: 'REMAP_TRIG_RATIO_TO_BASIC_DEFINITION_TEMPLATE', type: 'DIRECT',
      problemTypeKey: 'PT_TRIG_RATIO', templateKeys: ['TPL_TRIG_RATIO_BASIC_RELATION'],
      rationale: 'The leaf states the sine/cosine/tangent ratio definitions and direct conversion among ratios. The former geometric-derivation template requires reconstructing auxiliary geometry, a narrower decisive structure.',
    })),
    ...['M3-RPM-137'].map(id => ({
      id, disposition: 'REMOVE_WRONG_QUADRATIC_EQUATION_RECONSTRUCTION_TARGET', type: 'RPM_ONLY',
      rationale: 'The RPM leaf asks for a vertex coordinate. PT_H1_QUADRATIC_RECONSTRUCTION/TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX solves in the reverse direction: given roots/axis/vertex/point data, recover the quadratic function. The GLOBAL ACTIVE function-graph translation/property candidates do not establish the full vertex-coordinate skeleton across the broader RPM leaf, so no direct/family mapping is safe.',
    })),
    {
      id: 'M3-RPM-138', disposition: 'REMAP_AXIS_TO_GRAPH_SYMMETRY_TEMPLATE', type: 'DIRECT',
      problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKeys: ['TPL_FUNCTION_GRAPH_SYMMETRY'],
      rationale: 'The RPM leaf asks for the axis of symmetry of a quadratic graph. The GLOBAL ACTIVE function-graph symmetry template matches that target; the prior quadratic-reconstruction template solves for a function equation from graph data, which is a different objective.',
    },
    ...['M3-RPM-049', 'M3-RPM-136'].map(id => ({
      id, disposition: 'REUSE_EXISTING_GRAPH_TRANSLATION_CANONICAL', type: 'DIRECT',
      problemTypeKey: 'PT_FUNCTION_GRAPH_TRANSFORM', templateKeys: ['TPL_FUNCTION_GRAPH_TRANSLATION'],
      rationale: 'The RPM leaf is explicitly parallel translation of a quadratic-function graph. The GLOBAL ACTIVE graph-transformation parent and translation template share the same operation; exact M3 curriculum binding is checked separately.',
    })),
    ...['M3-RPM-052', 'M3-RPM-141'].map(id => ({
      id, disposition: 'DIRECT_TO_COMPLETE_QUADRATIC_EXTREMA_FAMILY', type: 'FAMILY',
      problemTypeKey: 'PT_H1_QUADRATIC_EXTREMA',
      templateKeys: ['TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL', 'TPL_H1_QUADRATIC_EXTREMA_MODEL'],
      selectionRule: 'Choose VERTEX_INTERVAL for the pure quadratic-function vertex/range case; choose MODEL when the source first translates a geometry/contextual target into a quadratic expression. No other template outside this listed set may be selected.',
      rationale: 'A single bounded-interval extrema template does not cover the full RPM maximum/minimum leaf. The existing active extrema family separates pure vertex/interval extrema from contextual quadratic modelling. The 2015 M3 leaf is retained as RPM_EXTENDED_CANDIDATE with defaultSelectable=false based on the official course-placement evidence.',
    })),
  ];
  for (const rule of rules) {
    const row = byId.get(rule.id);
    if (!row) throw new Error(`M3 normalization rule has no RPM row: ${rule.id}`);
    if (rule.type === 'RPM_ONLY') applyRpmOnly(row);
    else applyMappedRow(row, global, { problemTypeKey: rule.problemTypeKey, templateKeys: rule.templateKeys,
      family: rule.type === 'FAMILY', selectionRule: rule.selectionRule || '' });
    row.m3NormalizationDisposition = rule.disposition;
    row.m3NormalizationRationale = rule.rationale;
  }
  // Preserve enough global-owner coverage metadata to make the full GLOBAL ACTIVE search explicit.
  crosswalk.activeAuthority.packs = global.activePacks;
  crosswalk.generatedAgainstMain = M3_BASE_MAIN_SHA;
  crosswalk.summary = countStatuses(crosswalk.records);
  crosswalk.summary.recordCount = crosswalk.records.length;
  return { crosswalk, rules };
}

export function normalizeM3CrosswalkAndApplicability() {
  const master = readJson(MASTER_PATH);
  const global = collectGlobalActive();
  applyCurriculumApplicabilityRepair(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const result = applyCrosswalkNormalization(crosswalk, global);
  writeJson(MASTER_PATH, master);
  const viewPath = `${RPM}/01_2015/MIDDLE/M3-1.md`;
  let view = readText(viewPath);
  const oldViewEntry = '- **L4-4.2.2.2** 最大·최소';
  const newViewEntry = '- **L4-4.2.2.2** 최대·최소 `[RPM_EXTENDED_CANDIDATE; defaultSelectable=false]`';
  if (view.includes(oldViewEntry)) view = view.replace(oldViewEntry, newViewEntry);
  else if (!view.includes(newViewEntry)) throw new Error('Missing 2015 M3-1 maximum/minimum leaf in the curriculum view.');
  fs.writeFileSync(path.join(ROOT, viewPath), view, 'utf8');
  writeJson(M3_CROSSWALK_PATH, result.crosswalk);
  return { status: 'PASS', records: result.crosswalk.records.length, summary: result.crosswalk.summary,
    rulesApplied: result.rules.map(rule => ({ id: rule.id, disposition: rule.disposition })), activePackCount: global.activePacks.length };
}

export function validateM3Sources() {
  const master = readJson(MASTER_PATH);
  const rpmRows = flattenM3Master(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const global = collectGlobalActive();
  const errors = [];
  const views = [];
  for (const curriculum of ['2015', '2022']) for (const scope of M3_SCOPES) {
    const parsed = parseView(scopeViewPaths(curriculum, scope), curriculum, scope);
    const expected = rpmRows.filter(row => row.curriculum === curriculum && row.scope === scope);
    const fingerprint = row => [row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4].join('|');
    const left = expected.map(fingerprint).sort();
    const right = parsed.map(fingerprint).sort();
    if (JSON.stringify(left) !== JSON.stringify(right)) errors.push(`VIEW_PARITY:${curriculum}:${scope}`);
    views.push({ curriculum, scope, masterRows: expected.length, viewRows: parsed.length,
      parity: JSON.stringify(left) === JSON.stringify(right) ? 'PASS' : 'FAIL' });
  }
  const key = row => [row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4].join('|');
  const tuples = rpmRows.map(key);
  const duplicates = tuples.filter((value, index) => tuples.indexOf(value) !== index);
  if (duplicates.length) errors.push(`DUPLICATE_RPM_TUPLE:${duplicates.length}`);
  const masterByKey = new Map(rpmRows.map(row => [key(row), row]));
  const crossByKey = new Map(crosswalk.records.map(row => [crosswalkKey(row), row]));
  const missing = [...masterByKey.keys()].filter(value => !crossByKey.has(value));
  const orphan = [...crossByKey.keys()].filter(value => !masterByKey.has(value));
  if (missing.length || orphan.length || crosswalk.records.length !== rpmRows.length) errors.push(`DENOMINATOR_PARITY:${JSON.stringify({ master: rpmRows.length, crosswalk: crosswalk.records.length, missing: missing.length, orphan: orphan.length })}`);
  const familyErrors = [];
  const structuralErrors = [];
  const bindingErrors = [];
  const directErrors = [];
  for (const row of crosswalk.records) {
    if (row.mappingStatus === 'RPM_ONLY') {
      if (row.problemTypeKey || row.templateKey || (row.templateCandidates || []).length) structuralErrors.push(`${row.id}:RPM_ONLY_HAS_KEY`);
      continue;
    }
    const pt = global.problemTypes.get(row.problemTypeKey);
    const candidates = row.templateKey ? [{ templateKey: row.templateKey }] : (row.templateCandidates || []);
    const templates = candidates.map(candidate => global.templates.get(candidate.templateKey));
    if (!pt || pt.status !== 'ACTIVE' || !templates.length || templates.some(template => !template || template.status !== 'ACTIVE' || template.parentProblemTypeKey !== row.problemTypeKey)) structuralErrors.push(row.id);
    const binding = exactBindings(global, row).find(candidate => candidate.status === 'ACTIVE') || null;
    const isActiveMapping = row.mappingStatus.endsWith('_ACTIVE');
    const isBindingGap = row.mappingStatus.endsWith('_BINDING_GAP');
    if ((isActiveMapping && !binding) || (isBindingGap && binding)) bindingErrors.push(row.id);
    if (row.mappingStatus.startsWith('FAMILY') && !familyCoverageM3(row, candidates)) familyErrors.push(row.id);
    if (row.mappingStatus.startsWith('DIRECT') && !DIRECT_REVIEW_RULES[`${row.problemTypeKey}|${row.templateKey}`]) directErrors.push(row.id);
  }
  const packageValidation = execFileSync('node', ['archive/tools/meta-foundation/normalize-rpm-primary-m1-m2.mjs', '--validate-rpm'], { cwd: ROOT, encoding: 'utf8' });
  const canonicalValidation = JSON.parse(packageValidation);
  if (canonicalValidation.status !== 'PASS') errors.push(`RPM_PACKAGE_VALIDATION:${JSON.stringify(canonicalValidation.errors)}`);
  return {
    status: errors.length || missing.length || orphan.length || duplicates.length || familyErrors.length || structuralErrors.length || bindingErrors.length || directErrors.length ? 'FAIL' : 'PASS',
    errors, rpmRows: rpmRows.length, crosswalkRows: crosswalk.records.length,
    missingCrosswalkRows: missing.length, orphanCrosswalkRows: orphan.length, duplicateSemanticTuples: duplicates.length,
    viewCount: views.length, viewParityErrors: views.filter(row => row.parity !== 'PASS').length,
    mappedStatuses: countStatuses(crosswalk.records), activeStructuralErrors: structuralErrors.length,
    exactBindingStatusMismatchErrors: bindingErrors.length, incompleteFamilyCandidateSets: familyErrors.length,
    directSemanticRuleErrors: directErrors.length, globalActivePackCount: global.activePacks.length,
    registryFingerprint: global.registryFingerprint, rpmPackageValidation: canonicalValidation,
    viewResults: views, actualM3R2EReceipts: countM3R2EReceipts(),
  };
}

function familyCoverageM3(row, candidates) {
  const expected = FAMILY_REVIEW_RULES[row.id];
  if (!expected) return false;
  const actual = candidates.map(candidate => candidate.templateKey).sort();
  return JSON.stringify(actual) === JSON.stringify([...expected.templateKeys].sort());
}

function countM3R2EReceipts() {
  const roots = ['archive/data/r2e-intake/m3', 'archive/data/r2e-input/middle3'];
  return roots.reduce((count, relative) => {
    const dir = path.join(ROOT, relative);
    if (!fs.existsSync(dir)) return count;
    return count + fs.readdirSync(dir, { recursive: true }).filter(file => /\.(json|jsonl)$/.test(String(file))).length;
  }, 0);
}

export const M3_NORMALIZATION_RULES = Object.freeze({
  DIRECT_TEMPLATE_REMAPS: {
    'M3-RPM-016': ['PT_H1_POLY_OPERATION_EXPANSION', 'TPL_H1_POLY_OPERATION_DIRECT'],
    'M3-RPM-017': ['PT_H1_POLY_OPERATION_EXPANSION', 'TPL_H1_POLY_OPERATION_DIRECT'],
    'M3-RPM-108': ['PT_H1_POLY_OPERATION_EXPANSION', 'TPL_H1_POLY_OPERATION_DIRECT'],
    'M3-RPM-109': ['PT_H1_POLY_OPERATION_EXPANSION', 'TPL_H1_POLY_OPERATION_DIRECT'],
    'M3-RPM-055': ['PT_TRIG_RATIO', 'TPL_TRIG_RATIO_BASIC_RELATION'],
    'M3-RPM-143': ['PT_TRIG_RATIO', 'TPL_TRIG_RATIO_BASIC_RELATION'],
    'M3-RPM-138': ['PT_FUNCTION_GRAPH_PROPERTIES', 'TPL_FUNCTION_GRAPH_SYMMETRY'],
    'M3-RPM-049': ['PT_FUNCTION_GRAPH_TRANSFORM', 'TPL_FUNCTION_GRAPH_TRANSLATION'],
    'M3-RPM-136': ['PT_FUNCTION_GRAPH_TRANSFORM', 'TPL_FUNCTION_GRAPH_TRANSLATION'],
  },
  RPM_ONLY_REMOVALS: {
    'M3-RPM-020': 'The geometry application L4 is broader than the perfect-square product internal skeleton and has no safe GLOBAL ACTIVE target.',
    'M3-RPM-112': 'The geometry application L4 is broader than the perfect-square product internal skeleton and has no safe GLOBAL ACTIVE target.',
    'M3-RPM-013': 'Radical-expression application is not established as equivalent to the one supported generic radical-application skeleton.',
    'M3-RPM-014': 'Radical-expression application is not established as equivalent to the one supported generic radical-application skeleton.',
    'M3-RPM-105': 'Radical-expression application is not established as equivalent to the one supported generic radical-application skeleton.',
    'M3-RPM-106': 'Radical-expression application is not established as equivalent to the one supported generic radical-application skeleton.',
    'M3-RPM-018': 'Numeric calculation via a broad set of multiplication-formula subtypes is not fully covered by one perfect-square template.',
    'M3-RPM-019': 'Expression evaluation via a broad set of multiplication-formula subtypes is not fully covered by one perfect-square template.',
    'M3-RPM-110': 'Numeric calculation via a broad set of multiplication-formula subtypes is not fully covered by one perfect-square template.',
    'M3-RPM-111': 'Expression evaluation via a broad set of multiplication-formula subtypes is not fully covered by one perfect-square template.',
    'M3-RPM-137': 'Vertex-coordinate calculation is not quadratic-equation reconstruction; no GLOBAL ACTIVE template covers the full generic RPM vertex-coordinate range.',
  },
  FAMILY_REMAPS: {
    'M3-RPM-052': ['PT_H1_QUADRATIC_EXTREMA', ['TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL', 'TPL_H1_QUADRATIC_EXTREMA_MODEL']],
    'M3-RPM-141': ['PT_H1_QUADRATIC_EXTREMA', ['TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL', 'TPL_H1_QUADRATIC_EXTREMA_MODEL']],
  },
});

const DIRECT_REVIEW_RULES = {
  'PT_RADICAL_EXPRESSION|TPL_RADICAL_EXPRESSION_SIMPLIFY': 'Radical product, quotient, like-radical, distributive and rationalization leaves ask to simplify radical expressions; the exact calculation operation is fixed by the RPM L4.',
  'PT_H1_POLY_FORMULA_SYMMETRIC|TPL_H1_FORMULA_SYMMETRIC': 'The surviving formula-use leaves ask for sum/difference square identities or formula-based value calculation; the two product expansion leaves were remapped to the broader polynomial-operation template.',
  'PT_H1_POLY_FACTORIZATION|TPL_H1_FACTORIZATION_STANDARD': 'Common-factor grouping and named factorization identities are the exact standard-factorization objective. The parent and template definitions cover these listed operations.',
  'PT_H1_POLY_FACTORIZATION|TPL_H1_FACTORIZATION_APPLICATION': 'These leaves require factoring first and then applying a numeric/value/condition filter, matching the application template scope.',
  'PT_H1_QUADRATIC_DISCRIMINANT|TPL_H1_DISCRIMINANT_ROOT_EXISTENCE': 'The L4 is explicitly root-count/discriminant judgment; the TPL definition uses the discriminant sign to classify root existence/multiplicity.',
  'PT_FUNCTION_VALUE|TPL_FUNCTION_VALUE_DIRECT': 'The RPM leaf asks for a function value at an input, which is the direct-substitution calculation target.',
  'PT_FUNCTION_GRAPH_PROPERTIES|TPL_FUNCTION_GRAPH_SYMMETRY': 'The RPM L4 asks for a quadratic graph symmetry axis; the active template directly identifies graph symmetry.',
  'PT_FUNCTION_GRAPH_TRANSFORM|TPL_FUNCTION_GRAPH_TRANSLATION': 'The RPM L4 explicitly asks for graph parallel translation; the active template has that same operation.',
  'PT_TRIG_RATIO|TPL_TRIG_RATIO_BASIC_RELATION': 'The RPM L4 asks for basic sine/cosine/tangent definition and ratio relation; the active template translates right-triangle side/angle data to a ratio or converts one ratio to another.',
  'PT_TRIG_RATIO|TPL_TRIG_RATIO_SPECIAL_ANGLE': 'The RPM L4 is explicitly special-angle ratio calculation/recognition; the active template uses those special-angle values.',
  'PT_TRIG_RATIO_APPLICATION|TPL_TRIG_APPLICATION_DIRECT_MEASURE': 'The RPM L4 asks for direct side/length/height/distance measurement with a trig ratio and the direct-measure skeleton matches.',
  'PT_TRIG_RATIO_APPLICATION|TPL_TRIG_APPLICATION_CHAINED_MEASURE': 'The RPM L4 explicitly combines auxiliary geometry/Pythagorean relations and trig, matching the chained measurement skeleton.',
  'PT_CIRCLE_LINE_RELATION|TM_CIRCLE_CHORD_PERP_BISECTOR': 'The RPM L4 is the center/chord perpendicular-bisector relation; the template uses the theorem that a chord perpendicular bisector passes through the center.',
  'PT_CIRCLE_LINE_RELATION|TM_CIRCLE_CHORD_LENGTH': 'The RPM L4 explicitly relates center distance and chord length; the template has the same circle-chord length target.',
  'PT_CIRCLE_TANGENT|TM_TANGENCY_CONDITION': 'The RPM L4 is the radius-at-contact/tangent relation; the template is the exact tangency condition.',
  'PT_CIRCLE_TANGENT|TM_TANGENT_LENGTH': 'The RPM L4 asks for equal tangents from an external point or tangent length, matching the template objective.',
  'PT_CIRCLE_ANGLE_RELATIONS|TPL_CIRCLE_ANGLE_TANGENT_CHORD': 'The RPM L4 is a tangent-chord angle relation and the TPL uses the tangent-chord theorem with inscribed angles.',
  'PT_CIRCLE_ANGLE_RELATIONS|TPL_CIRCLE_ANGLE_CENTER_ARC': 'The RPM L4 is same-arc or central/inscribed angle; the template uses arc/central/inscribed angle correspondence.',
  'PT_CIRCLE_ANGLE_RELATIONS|TPL_CIRCLE_ANGLE_COMPOSITE': 'The RPM L4 is an inscribed-quadrilateral/cyclic criterion or composite-angle inference requiring chained circle-angle relations.',
};

const FAMILY_REVIEW_RULES = {
  'M3-RPM-048': { templateKeys: ['TPL_H1_QUADRATIC_RECONSTRUCT_MULTI_CONDITION', 'TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX'], subtypes: ['roots/axis/vertex/one-point reconstruction', 'multi-condition/sign/graph reconstruction'] },
  'M3-RPM-054': { templateKeys: ['TPL_H1_QUADRATIC_RECONSTRUCT_MULTI_CONDITION', 'TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX'], subtypes: ['roots/axis/vertex/one-point reconstruction', 'multi-condition/sign/graph reconstruction'] },
  'M3-RPM-142': { templateKeys: ['TPL_H1_QUADRATIC_RECONSTRUCT_MULTI_CONDITION', 'TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX'], subtypes: ['roots/axis/vertex/one-point reconstruction', 'multi-condition/sign/graph reconstruction'] },
  'M3-RPM-052': { templateKeys: ['TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL', 'TPL_H1_QUADRATIC_EXTREMA_MODEL'], subtypes: ['vertex/interval extrema', 'contextual quadratic model extrema'] },
  'M3-RPM-141': { templateKeys: ['TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL', 'TPL_H1_QUADRATIC_EXTREMA_MODEL'], subtypes: ['vertex/interval extrema', 'contextual quadratic model extrema'] },
  'M3-RPM-061': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_CHAINED_MEASURE'], subtypes: ['direct triangle measurement', 'auxiliary/other-quantity chained measurement'] },
  'M3-RPM-062': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_CHAINED_MEASURE'], subtypes: ['direct triangle measurement', 'auxiliary/other-quantity chained measurement'] },
  'M3-RPM-063': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_SHARED_HEIGHT'], subtypes: ['single-view direct measurement', 'two-angle common-height/distance system'] },
  'M3-RPM-064': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_SHARED_HEIGHT'], subtypes: ['single-view direct measurement', 'two-angle common-height/distance system'] },
  'M3-RPM-149': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_CHAINED_MEASURE'], subtypes: ['direct triangle measurement', 'auxiliary/other-quantity chained measurement'] },
  'M3-RPM-150': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_CHAINED_MEASURE'], subtypes: ['direct triangle measurement', 'auxiliary/other-quantity chained measurement'] },
  'M3-RPM-151': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_SHARED_HEIGHT'], subtypes: ['single-view direct measurement', 'two-angle common-height/distance system'] },
  'M3-RPM-152': { templateKeys: ['TPL_TRIG_APPLICATION_DIRECT_MEASURE', 'TPL_TRIG_APPLICATION_SHARED_HEIGHT'], subtypes: ['single-view direct measurement', 'two-angle common-height/distance system'] },
};

function main() {
  const command = process.argv[2];
  if (command === '--snapshot-baseline') return console.log(JSON.stringify(takeM3BaselineSnapshot(), null, 2));
  if (command === '--normalize') return console.log(JSON.stringify(normalizeM3CrosswalkAndApplicability(), null, 2));
  if (command === '--validate') return console.log(JSON.stringify(validateM3Sources(), null, 2));
  throw new Error('Usage: normalize-rpm-primary-m3.mjs --snapshot-baseline | --normalize | --validate');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
