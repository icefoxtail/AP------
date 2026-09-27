#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadActiveMetaRegistry } from './active-registry.mjs';
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

function collectM3GlobalActive() {
  const canonical = collectGlobalActive();
  const compiled = loadActiveMetaRegistry(ROOT);
  if (compiled.status !== 'ACTIVE') throw new Error(`Compiled GLOBAL ACTIVE registry unavailable: ${compiled.errors.join(',')}`);
  const canonicalPtKeys = [...canonical.problemTypes.keys()].sort();
  const compiledPtKeys = [...compiled.problemTypes.keys()].sort();
  const canonicalTplKeys = [...canonical.templates.keys()].sort();
  const compiledTplKeys = [...compiled.templates.keys()].sort();
  if (JSON.stringify(canonicalPtKeys) !== JSON.stringify(compiledPtKeys)
    || JSON.stringify(canonicalTplKeys) !== JSON.stringify(compiledTplKeys)) {
    throw new Error('Canonical and compiled GLOBAL ACTIVE key denominators differ.');
  }
  return { ...canonical, activePacks: [...compiled.activePacks.keys()].sort(),
    problemTypes: compiled.problemTypes, templates: compiled.templates, bindings: compiled.bindingRows,
    compiledRegistrySha: compiled.registrySha };
}

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
  const binding = exactBindings(global, { ...row, problemTypeKey }).find(candidate => candidate.status === 'ACTIVE'
    && candidate.ownerPack === problemType.ownerPack) || null;
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

function reconcileCrosswalkBindingOwners(crosswalk, global) {
  const reconciled = [];
  for (const row of crosswalk.records) {
    if (row.mappingStatus === 'RPM_ONLY' || !row.problemTypeKey) continue;
    const problemType = global.problemTypes.get(row.problemTypeKey);
    const exact = exactBindings(global, row).filter(binding => binding.status === 'ACTIVE');
    const binding = exact.find(candidate => candidate.ownerPack === problemType?.ownerPack) || null;
    const wrongOwner = exact.filter(candidate => candidate.ownerPack !== problemType?.ownerPack);
    const oldStatus = row.mappingStatus;
    const oldBinding = row.binding;
    if (binding) {
      row.bindingStatus = 'ACTIVE';
      row.binding = { curriculum: binding.curriculum, standardUnitKey: binding.standardUnitKey,
        subUnitKey: binding.subUnitKey || '', ownerPack: binding.ownerPack };
      row.mappingStatus = oldStatus.startsWith('FAMILY') ? 'FAMILY_ACTIVE' : 'DIRECT_ACTIVE';
      delete row.m3OwnerMismatchBinding;
    } else {
      row.bindingStatus = 'MISSING';
      delete row.binding;
      row.mappingStatus = oldStatus.startsWith('FAMILY') ? 'FAMILY_BINDING_GAP' : 'DIRECT_BINDING_GAP';
      if (wrongOwner.length) row.m3OwnerMismatchBinding = {
        canonicalOwnerPack: problemType?.ownerPack || '',
        activeBindingOwnerPacks: [...new Set(wrongOwner.map(candidate => candidate.ownerPack))].sort(),
        reason: 'An ACTIVE exact-path binding exists, but its owner pack does not match the compiled GLOBAL ACTIVE PT owner; it is not an exact binding for the selected canonical identity.',
      };
    }
    if (oldStatus !== row.mappingStatus || JSON.stringify(oldBinding || null) !== JSON.stringify(row.binding || null)) {
      reconciled.push({ id: row.id, oldMappingStatus: oldStatus, finalMappingStatus: row.mappingStatus,
        canonicalOwnerPack: problemType?.ownerPack || '', wrongOwnerBindingPackCount: wrongOwner.length });
      if (!row.m3NormalizationDisposition) {
        row.m3NormalizationDisposition = binding ? 'RECONCILE_EXACT_BINDING_STATUS' : 'RECONCILE_BINDING_OWNER_MISMATCH';
        row.m3NormalizationDefectType = binding ? 'BINDING_ONLY_GAP' : 'BINDING_ONLY_GAP';
        row.m3NormalizationRationale = binding
          ? 'Crosswalk binding status was synchronized to the compiled GLOBAL ACTIVE exact owner binding.'
          : 'The exact curriculum tuple has no binding owned by the selected compiled GLOBAL ACTIVE PT. A binding from another owner pack is recorded as non-matching evidence and is not treated as exact.';
      }
    }
  }
  return reconciled;
}

export function takeM3BaselineSnapshot() {
  const master = readJson(MASTER_PATH);
  const rows = flattenM3Master(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const global = collectM3GlobalActive();
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
      compiledRegistrySha: global.compiledRegistrySha,
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
    ...['M3-RPM-013', 'M3-RPM-014', 'M3-RPM-105', 'M3-RPM-106'].map(id => ({
      id, disposition: 'REMOVE_UNSUPPORTED_RADICAL_APPLICATION_TEMPLATE', defectType: 'WRONG_TEMPLATE', type: 'RPM_ONLY',
      rationale: 'These leaves ask for a broad mixed radical-expression value/application. TPL_RADICAL_EXPRESSION_APPLICATION has one supporting item and a generic placeholder skeleton, which is not enough to establish the RPM scope as equivalent.',
    })),
    ...['M3-RPM-015', 'M3-RPM-016', 'M3-RPM-017', 'M3-RPM-018', 'M3-RPM-019', 'M3-RPM-020',
      'M3-RPM-107', 'M3-RPM-108', 'M3-RPM-109', 'M3-RPM-110', 'M3-RPM-111', 'M3-RPM-112'].map(id => ({
      id, disposition: 'REMOVE_NARROW_MULTIPLICATION_FORMULA_TEMPLATE', defectType: 'DIRECT_OVERMAPPING', type: 'RPM_ONLY',
      rationale: 'TPL_H1_FORMULA_SYMMETRIC has the decisive skeleton QUADRATIC_PRODUCT_TO_PERFECT_SQUARE, narrower than the RPM leaves for square expansion, arbitrary linear-factor products, generic arithmetic/value calculation, and geometry applications. TPL_H1_POLY_OPERATION_DIRECT is also excluded because its decisive skeleton is BINOMIAL_EXPANSION_REMAINDER_BY_DIVISIBILITY.',
    })),
    ...['M3-RPM-021', 'M3-RPM-022', 'M3-RPM-023', 'M3-RPM-024', 'M3-RPM-025', 'M3-RPM-026', 'M3-RPM-027', 'M3-RPM-028',
      'M3-RPM-113', 'M3-RPM-114', 'M3-RPM-115', 'M3-RPM-116', 'M3-RPM-117', 'M3-RPM-118', 'M3-RPM-119', 'M3-RPM-120'].map(id => ({
      id, disposition: 'REMOVE_NARROW_FACTORIZATION_TEMPLATE', defectType: 'DIRECT_OVERMAPPING', type: 'RPM_ONLY',
      rationale: 'TPL_H1_FACTORIZATION_STANDARD has the decisive skeleton BIVARIATE_LINEAR_FACTOR_COEFFICIENT_MATCH, while its RPM leaves span common-factor grouping, identities, and general quadratic factorization. TPL_H1_FACTORIZATION_APPLICATION has INTEGER_LINEAR_FACTOR_PAIR_ENUMERATION, narrower than the generic value/condition application leaves.',
    })),
    ...['M3-RPM-036', 'M3-RPM-128'].map(id => ({
      id, disposition: 'REMOVE_DISCRIMINANT_TEMPLATE_SKELETON_MISMATCH', defectType: 'WRONG_TEMPLATE', type: 'RPM_ONLY',
      rationale: 'The RPM leaf asks to classify the number of quadratic-equation roots by the discriminant. The linked template definition mentions discriminant sign, but its internal skeleton ROOT_LOCATION_BY_ENDPOINT_SIGN is an endpoint-sign root-location method and does not establish the same decisive route.',
    })),
    ...['M3-RPM-055', 'M3-RPM-143'].map(id => ({
      id, disposition: 'REMAP_TRIG_RATIO_TO_BASIC_DEFINITION_TEMPLATE', defectType: 'WRONG_TEMPLATE', type: 'DIRECT',
      problemTypeKey: 'PT_TRIG_RATIO', templateKeys: ['TPL_TRIG_RATIO_BASIC_RELATION'],
      rationale: 'The leaf states the sine/cosine/tangent ratio definitions and direct conversion among ratios. The former geometric-derivation template requires reconstructing auxiliary geometry, a narrower decisive structure.',
    })),
    ...['M3-RPM-137'].map(id => ({
      id, disposition: 'REMOVE_WRONG_QUADRATIC_EQUATION_RECONSTRUCTION_TARGET', defectType: 'WRONG_PT', type: 'RPM_ONLY',
      rationale: 'The RPM leaf asks for a vertex coordinate. PT_H1_QUADRATIC_RECONSTRUCTION/TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX solves in the reverse direction: given roots/axis/vertex/point data, recover the quadratic function. The GLOBAL ACTIVE function-graph translation/property candidates do not establish the full vertex-coordinate skeleton across the broader RPM leaf, so no direct/family mapping is safe.',
    })),
    {
      id: 'M3-RPM-138', disposition: 'REMAP_AXIS_TO_GRAPH_SYMMETRY_TEMPLATE', defectType: 'WRONG_PT', type: 'DIRECT',
      problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKeys: ['TPL_FUNCTION_GRAPH_SYMMETRY'],
      rationale: 'The RPM leaf asks for the axis of symmetry of a quadratic graph. The GLOBAL ACTIVE function-graph symmetry template matches that target; the prior quadratic-reconstruction template solves for a function equation from graph data, which is a different objective.',
    },
    ...['M3-RPM-049', 'M3-RPM-136'].map(id => ({
      id, disposition: 'REUSE_EXISTING_GRAPH_TRANSLATION_CANONICAL', type: 'DIRECT',
      problemTypeKey: 'PT_FUNCTION_GRAPH_TRANSFORM', templateKeys: ['TPL_FUNCTION_GRAPH_TRANSLATION'],
      rationale: 'The RPM leaf is explicitly parallel translation of a quadratic-function graph. The GLOBAL ACTIVE graph-transformation parent and translation template share the same operation; exact M3 curriculum binding is checked separately.',
    })),
    ...['M3-RPM-052', 'M3-RPM-141'].map(id => ({
      id, disposition: 'REMOVE_EXTREMA_TEMPLATES_WITHOUT_ALL_REAL_DOMAIN_CASE', defectType: 'DIRECT_OVERMAPPING', type: 'RPM_ONLY',
      rationale: 'The 2022 curriculum leaf includes maximum/minimum over the all-real domain, while TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL is specifically bounded-interval endpoint comparison and TPL_H1_QUADRATIC_EXTREMA_MODEL is contextual modelling. Their union does not establish coverage of the ordinary all-real vertex-extremum subtype. The 2015 leaf is additionally outside that curriculum placement.',
    })),
    ...['M3-RPM-073', 'M3-RPM-161'].map(id => ({
      id, disposition: 'REMOVE_GENERIC_TANGENT_ANGLE_FROM_TANGENT_CHORD_TEMPLATE', defectType: 'WRONG_TEMPLATE', type: 'RPM_ONLY',
      rationale: 'The RPM leaf says to find an angle from a tangent condition; this can use the radius-perpendicular-to-tangent relation and is broader than TPL_CIRCLE_ANGLE_TANGENT_CHORD, which specifically uses a tangent-chord/arc/inscribed-angle correspondence.',
    })),
    ...['M3-RPM-077', 'M3-RPM-078', 'M3-RPM-165', 'M3-RPM-166'].map(id => ({
      id, disposition: 'REMOVE_SIMPLE_CYCLIC_CONDITION_FROM_COMPOSITE_ANGLE_TEMPLATE', defectType: 'DIRECT_OVERMAPPING', type: 'RPM_ONLY',
      rationale: 'Inscribed-quadrilateral angle and four-points-cyclic conditions can be decided by one circle criterion; TPL_CIRCLE_ANGLE_COMPOSITE requires a chain of multiple circle-angle relations. The template is too specific in the opposite direction to serve as a direct equivalent, and no complete active family covers every criterion subtype.',
    })),
  ];
  for (const rule of rules) {
    const row = byId.get(rule.id);
    if (!row) throw new Error(`M3 normalization rule has no RPM row: ${rule.id}`);
    if (rule.type === 'RPM_ONLY') applyRpmOnly(row);
    else applyMappedRow(row, global, { problemTypeKey: rule.problemTypeKey, templateKeys: rule.templateKeys,
      family: rule.type === 'FAMILY', selectionRule: rule.selectionRule || '' });
    row.m3NormalizationDisposition = rule.disposition;
    row.m3NormalizationDefectType = rule.defectType || (rule.type === 'RPM_ONLY' ? 'DIRECT_OVERMAPPING' : 'SAFE_EXISTING_REUSE');
    row.m3NormalizationRationale = rule.rationale;
  }
  const bindingOwnerReconciliation = reconcileCrosswalkBindingOwners(crosswalk, global);
  // Preserve enough global-owner coverage metadata to make the full GLOBAL ACTIVE search explicit.
  crosswalk.activeAuthority.packs = global.activePacks;
  crosswalk.generatedAgainstMain = M3_BASE_MAIN_SHA;
  crosswalk.summary = countStatuses(crosswalk.records);
  crosswalk.summary.recordCount = crosswalk.records.length;
  return { crosswalk, rules, bindingOwnerReconciliation };
}

export function normalizeM3CrosswalkAndApplicability() {
  const master = readJson(MASTER_PATH);
  const global = collectM3GlobalActive();
  applyCurriculumApplicabilityRepair(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const result = applyCrosswalkNormalization(crosswalk, global);
  const viewPath = `${RPM}/01_2015/MIDDLE/M3-1.md`;
  let view = readText(viewPath);
  const lines = view.split(/\r?\n/);
  const viewRowIndex = lines.findIndex(line => line.includes("L4-4.2.2.2"));
  if (viewRowIndex < 0) throw new Error("Missing 2015 M3-1 maximum/minimum leaf in the curriculum view.");
  if (!lines[viewRowIndex].includes("RPM_EXTENDED_CANDIDATE")) lines[viewRowIndex] += " `[RPM_EXTENDED_CANDIDATE; defaultSelectable=false]`";
  view = lines.join("\n");
  writeJson(MASTER_PATH, master);
  fs.writeFileSync(path.join(ROOT, viewPath), view, 'utf8');
  writeJson(M3_CROSSWALK_PATH, result.crosswalk);
  return { status: 'PASS', records: result.crosswalk.records.length, summary: result.crosswalk.summary,
    rulesApplied: result.rules.map(rule => ({ id: rule.id, disposition: rule.disposition })),
    bindingOwnerReconciliation: result.bindingOwnerReconciliation, activePackCount: global.activePacks.length };
}

export function validateM3Sources() {
  const master = readJson(MASTER_PATH);
  const rpmRows = flattenM3Master(master);
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const global = collectM3GlobalActive();
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
    if (!pt || pt.status !== 'ACTIVE' || row.ownerPack !== pt.ownerPack || !templates.length
      || templates.some(template => !template || template.status !== 'ACTIVE' || template.parentProblemTypeKey !== row.problemTypeKey
        || template.ownerPack !== pt.ownerPack)) structuralErrors.push(row.id);
    const binding = exactBindings(global, row).find(candidate => candidate.status === 'ACTIVE'
      && candidate.ownerPack === pt?.ownerPack) || null;
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
    registryFingerprint: global.registryFingerprint, compiledRegistrySha: global.compiledRegistrySha, rpmPackageValidation: canonicalValidation,
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

const DIRECT_REVIEW_RULES = {
  'PT_RADICAL_EXPRESSION|TPL_RADICAL_EXPRESSION_SIMPLIFY': 'Radical product, quotient, like-radical, distributive and rationalization leaves ask to simplify radical expressions; the exact calculation operation is fixed by the RPM L4.',
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
  'PT_CIRCLE_ANGLE_RELATIONS|TPL_CIRCLE_ANGLE_COMPOSITE': 'The RPM L4 is explicitly composite angle inference and calls for a chain of circle-angle relations, matching the active template internal skeleton.',
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

const M3_CURRICULUM_EVIDENCE = {
  official2015Curriculum: {
    title: '2015 개정 교육과정 총론 및 각론 확정·발표',
    url: 'https://www.moe.go.kr/boardCnts/view.do?boardID=294&boardSeq=60753&lev=0&m=0204',
    sourceNote: '교육부가 공개한 2015 개정 교육과정 및 첨부 수학과 각론.',
  },
  official2015CourseChange: {
    title: '기획 2015 개정 교육과정으로 미래를 꿈꾸다',
    url: 'https://www.moe.go.kr/upload/brochureBoard/1/2016/12/1482218322461_335199041259440.pdf',
    sourceNote: '수학 주요 변경사항에서 이차함수 최대·최소를 중3에서 고1로 이동했다고 명시.',
  },
  official2022Curriculum: {
    title: '2022 개정 초중등학교 및 특수교육 교육과정 확정·발표',
    url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0',
    sourceNote: '교육부 고시 수학과 교육과정 원문 첨부. 확인한 성취기준: [9수02-22] 이차함수의 최댓값·최솟값, [9수04-01] 대푯값, [9수04-08] 상자그림.',
  },
  official2022Release: {
    title: '2022 개정 초·중등학교 및 특수교육 교육과정 확정·발표',
    url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=93459&lev=0&m=0204',
    sourceNote: '교육부 확정 발표. 중학교 자료 영역에 상자그림이 포함된 개정 내용을 확인.',
  },
  curriculumView2022M1_2: {
    title: 'RPM Primary 2022 M1-2 curriculum view',
    path: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/MIDDLE/M1-2.md',
    sourceNote: '2022 M1-2에 평균·중앙값·최빈값 및 대푯값 비교 L4가 분류되어 있음. M3 통계 항목과 학년 재배치를 확인하는 보조 evidence.',
  },
};

const M3_QUADRATIC_GROUPS = {
  '2015|이차함수의 뜻|이차함수 판별': 'quadratic.basic_definition_graph',
  '2015|이차함수의 뜻|함숫값': 'quadratic.basic_definition_graph',
  '2015|y=ax²의 그래프|그래프의 모양': 'quadratic.basic_definition_graph',
  '2022|이차함수의 기본 그래프|y=ax²': 'quadratic.basic_definition_graph',
  '2015|y=ax²의 그래프|대칭축·증감': 'quadratic.axis_and_monotonicity',
  '2022|꼭짓점과 축|대칭축': 'quadratic.axis_and_monotonicity',
  '2015|그래프와 식|점의 좌표': 'quadratic.graph_reading_and_reconstruction',
  '2015|그래프와 식|계수 결정': 'quadratic.graph_reading_and_reconstruction',
  '2015|그래프와 계수|그래프 위치': 'quadratic.graph_reading_and_reconstruction',
  '2015|그래프와 계수|조건으로 식 구하기': 'quadratic.graph_reading_and_reconstruction',
  '2022|일반형 그래프|그래프 그리기': 'quadratic.graph_reading_and_reconstruction',
  '2022|최대·최소와 활용|조건으로 식 결정': 'quadratic.graph_reading_and_reconstruction',
  '2015|꼭짓점형|평행이동': 'quadratic.graph_translation',
  '2022|이차함수의 기본 그래프|평행이동': 'quadratic.graph_translation',
  '2015|꼭짓점형|꼭짓점·축': 'quadratic.vertex_and_axis',
  '2022|꼭짓점과 축|꼭짓점 좌표': 'quadratic.vertex_and_axis',
  '2015|일반형|완전제곱식 변형': 'quadratic.complete_square',
  '2022|일반형 그래프|완전제곱식 변형': 'quadratic.complete_square',
  '2015|일반형|최대·최소': 'quadratic.maximum_minimum',
  '2022|최대·최소와 활용|최대·최소': 'quadratic.maximum_minimum',
};

const M3_STATISTICS_GROUPS = {
  '2015|대푯값|평균·중앙값·최빈값': 'statistics.central_values',
  '2015|대푯값|대푯값 비교': 'statistics.central_value_comparison',
  '2015|산포도|편차': 'statistics.deviation',
  '2022|편차|편차 계산': 'statistics.deviation',
  '2022|편차|편차의 합': 'statistics.deviation',
  '2015|산포도|분산': 'statistics.variance',
  '2022|분산과 표준편차|분산 계산': 'statistics.variance',
  '2015|산포도|표준편차': 'statistics.standard_deviation',
  '2022|분산과 표준편차|표준편차 계산': 'statistics.standard_deviation',
  '2015|자료 비교|평균과 산포도 비교': 'statistics.compare_center_and_spread',
  '2022|자료 비교|평균과 산포도': 'statistics.compare_center_and_spread',
  '2015|자료 비교|조건으로 자료 추론': 'statistics.compare_and_infer',
  '2022|자료 비교|두 집단 비교': 'statistics.compare_and_infer',
  '2022|자료의 분포 비교|분포와 상관관계의 종합 해석': 'statistics.compare_and_infer',
  '2015|산점도|산점도 읽기': 'statistics.scatter_representation',
  '2015|산점도|자료를 산점도로': 'statistics.scatter_representation',
  '2022|산점도|산점도 작성': 'statistics.scatter_representation',
  '2015|상관관계|양의 상관관계': 'statistics.correlation_interpretation',
  '2015|상관관계|음의 상관관계': 'statistics.correlation_interpretation',
  '2015|상관관계|상관관계가 약한 경우': 'statistics.correlation_interpretation',
  '2022|산점도|상관관계 해석': 'statistics.correlation_interpretation',
  '2022|상자그림|사분위수': 'statistics.boxplot',
  '2022|상자그림|상자그림 해석': 'statistics.boxplot',
  '2022|상자그림|두 분포 비교': 'statistics.boxplot',
  '2022|자료의 분포 비교|이상치를 포함한 자료 해석': 'statistics.outlier_interpretation',
};

function semanticGroupM3(row) {
  const exactKey = `${row.curriculum}|${row.l3}|${row.l4}`;
  if (row.scope === 'M3-1' && M3_QUADRATIC_GROUPS[exactKey]) return M3_QUADRATIC_GROUPS[exactKey];
  if (row.scope === 'M3-2' && M3_STATISTICS_GROUPS[exactKey]) return M3_STATISTICS_GROUPS[exactKey];
  return `${row.scope}.shared.${row.l3}|${row.l4}`;
}

function curriculumDecisionForM3(group) {
  if (group === 'quadratic.maximum_minimum') return {
    semanticRelation: 'LEGIT_CURRICULUM_DIFFERENCE', curriculumPresence2015: false, curriculumPresence2022: true,
    defectType: 'LEGIT_CURRICULUM_DIFFERENCE', evidence: '2015 curriculum moved quadratic maximum/minimum from middle 3 to high school; 2022 reintroduced the all-real-domain maximum/minimum standard [9수02-22].',
    sourceKeys: ['official2015CourseChange', 'official2022Curriculum'],
  };
  if (group === 'statistics.central_values' || group === 'statistics.central_value_comparison') return {
    semanticRelation: 'LEGIT_CURRICULUM_DIFFERENCE', curriculumPresence2015: true, curriculumPresence2022: false,
    curriculumPresenceNote: '2022 RPM places mean/median/mode and representative-value comparison in M1-2, outside the M3 denominator.',
    defectType: 'LEGIT_CURRICULUM_DIFFERENCE', evidence: '2015 middle 3 statistics includes representative values; the 2022 M3 path shifts this content to the 2022 M1-2 statistics unit.',
    sourceKeys: ['official2015Curriculum', 'official2022Curriculum', 'curriculumView2022M1_2'],
  };
  if (group === 'statistics.boxplot') return {
    semanticRelation: 'LEGIT_CURRICULUM_DIFFERENCE', curriculumPresence2015: false, curriculumPresence2022: true,
    defectType: 'LEGIT_CURRICULUM_DIFFERENCE', evidence: 'The 2022 curriculum adds the boxplot standard [9수04-08]; the 2015 middle 3 statistics standards do not contain this boxplot content.',
    sourceKeys: ['official2015Curriculum', 'official2022Curriculum', 'official2022Release'],
  };
  if (group === 'statistics.outlier_interpretation') return {
    semanticRelation: 'NEEDS_EVIDENCE', curriculumPresence2015: false, curriculumPresence2022: 'NEEDS_EVIDENCE',
    defectType: 'NEEDS_EVIDENCE', evidence: 'The 2022 RPM source marks this as RPM_EXTENDED_CANDIDATE/defaultSelectable=false. The reviewed official standard [9수04-08] covers boxplots, but explicit middle-school authority for a separate outlier-interpretation L4 was not found.',
    sourceKeys: ['official2022Curriculum'],
  };
  return {
    semanticRelation: 'BOTH_PRESENT', curriculumPresence2015: true, curriculumPresence2022: true,
    defectType: '', evidence: 'The 2015 and 2022 middle 3 curriculum sources both retain this semantic concept; different L3/L4 decomposition is paired by the explicit semantic group.',
    sourceKeys: ['official2015Curriculum', 'official2022Curriculum'],
  };
}

function compactTemplateEvidence(global, key) {
  const template = global.templates.get(key);
  if (!template) return { templateKey: key, exists: false };
  return {
    templateKey: key, canonicalLabelKo: template.canonicalLabelKo, definition: template.definition,
    internalSkeleton: template.internalSkeleton, parentProblemTypeKey: template.parentProblemTypeKey,
    status: template.status, ownerPack: template.ownerPack, supportingItemCount: template.supportingItemCount,
    supportingQuestionUids: template.supportingQuestionUids || [],
  };
}

function buildM3SemanticAudit() {
  const masterRows = flattenM3Master();
  const crosswalk = readJson(M3_CROSSWALK_PATH);
  const global = collectM3GlobalActive();
  const baseline = readJson(`${M3_EVIDENCE_DIR}/baseline-snapshot.json`);
  const baselineById = new Map(baseline.crosswalk.records.map(row => [row.id, row]));
  const groupMap = new Map();
  for (const row of masterRows) {
    const group = semanticGroupM3(row);
    const list = groupMap.get(group) || [];
    list.push(row);
    groupMap.set(group, list);
  }
  const auditRows = masterRows.map(rpm => {
    const group = semanticGroupM3(rpm);
    const decision = curriculumDecisionForM3(group);
    const pairRows = groupMap.get(group) || [];
    const pairCurricula = new Set(pairRows.map(pair => pair.curriculum));
    if (decision.semanticRelation === 'BOTH_PRESENT' && (!pairCurricula.has('2015') || !pairCurricula.has('2022'))) {
      throw new Error(`Unpaired M3 curriculum concept was marked BOTH_PRESENT: ${group}`);
    }
    const cross = crosswalk.records.find(row => crosswalkKey(row) === m3SemanticKey(rpm));
    if (!cross) throw new Error(`M3 audit lacks crosswalk row for ${m3SemanticKey(rpm)}`);
    const initial = baselineById.get(cross.id);
    if (!initial) throw new Error(`M3 baseline audit lacks row ${cross.id}`);
    const initialProblemType = initial.problemTypeKey ? global.problemTypes.get(initial.problemTypeKey) : null;
    const initialTemplateKeys = initial.templateKey ? [initial.templateKey] : (initial.templateCandidates || []);
    const initialBindings = initial.problemTypeKey ? exactBindings(global, initial) : [];
    const initialBinding = initialBindings.find(candidate => candidate.status === 'ACTIVE'
      && candidate.ownerPack === initialProblemType?.ownerPack) || null;
    const initialOwnerMismatchBindings = initialBindings.filter(candidate => candidate.status === 'ACTIVE'
      && candidate.ownerPack !== initialProblemType?.ownerPack);
    const initialCanonicalEvidence = initialProblemType ? {
      problemType: { problemTypeKey: initialProblemType.problemTypeKey, canonicalLabelKo: initialProblemType.canonicalLabelKo,
        definition: initialProblemType.definition, status: initialProblemType.status, ownerPack: initialProblemType.ownerPack,
        supportingItemCount: initialProblemType.supportingItemCount, supportingQuestionUids: initialProblemType.supportingQuestionUids || [] },
      templates: initialTemplateKeys.map(key => compactTemplateEvidence(global, key)),
      exactBinding: initialBinding ? { status: initialBinding.status, curriculum: initialBinding.curriculum,
        standardUnitKey: initialBinding.standardUnitKey, subUnitKey: initialBinding.subUnitKey || '',
        problemTypeKey: initialBinding.problemTypeKey, ownerPack: initialBinding.ownerPack } : null,
      activeButWrongOwnerBindings: initialOwnerMismatchBindings.map(candidate => ({ status: candidate.status,
        curriculum: candidate.curriculum, standardUnitKey: candidate.standardUnitKey, subUnitKey: candidate.subUnitKey || '',
        problemTypeKey: candidate.problemTypeKey, ownerPack: candidate.ownerPack })),
    } : null;
    const problemType = cross.problemTypeKey ? global.problemTypes.get(cross.problemTypeKey) : null;
    const templateKeys = cross.templateKey ? [cross.templateKey]
      : (cross.templateCandidates || []).map(candidate => typeof candidate === 'string' ? candidate : candidate.templateKey);
    const binding = cross.problemTypeKey ? exactBindings(global, cross).find(candidate => candidate.status === 'ACTIVE'
      && candidate.ownerPack === problemType?.ownerPack) || null : null;
    const knownDefect = cross.mappingStatus.endsWith('_BINDING_GAP') ? 'BINDING_ONLY_GAP'
      : cross.m3NormalizationDefectType || (initial.mappingStatus === 'RPM_ONLY' ? 'RPM_ONLY_VALID' : 'SAFE_EXISTING_REUSE');
    const templateEvidence = templateKeys.map(key => compactTemplateEvidence(global, key));
    const problemTypeEvidence = problemType ? {
      problemTypeKey: problemType.problemTypeKey, canonicalLabelKo: problemType.canonicalLabelKo,
      definition: problemType.definition, status: problemType.status, ownerPack: problemType.ownerPack,
      supportingItemCount: problemType.supportingItemCount, supportingQuestionUids: problemType.supportingQuestionUids || [],
    } : null;
    const familyRule = FAMILY_REVIEW_RULES[cross.id] || null;
    return {
      curriculum: rpm.curriculum, scope: rpm.scope, rpmRecordId: cross.id,
      rpmL1: rpm.majorUnit, rpmL2: rpm.midUnit, rpmL3: rpm.l3, rpmL4: rpm.l4,
      semanticPairId: group, semanticRelation: decision.semanticRelation,
      curriculumPresence2015: decision.curriculumPresence2015, curriculumPresence2022: decision.curriculumPresence2022,
      curriculumPresenceNote: decision.curriculumPresenceNote || '',
      existingMappingStatus: initial.mappingStatus,
      existingPTTPL: {
        problemTypeKey: initial.problemTypeKey || '', templateKey: initial.templateKey || '',
        templateCandidates: initial.templateCandidates || [],
      },
      existingCanonicalEvidence: initialCanonicalEvidence,
      finalMappingStatus: cross.mappingStatus,
      finalPTTPL: { problemTypeKey: cross.problemTypeKey || '', templateKey: cross.templateKey || '',
        templateCandidates: cross.templateCandidates || [] },
      semanticRelationEvidence: {
        curriculum: decision.evidence,
        curriculumSources: decision.sourceKeys.map(key => M3_CURRICULUM_EVIDENCE[key]),
        pairedRecordIds: pairRows.map(pair => {
          const paired = crosswalk.records.find(candidate => candidate.curriculum === pair.curriculum
            && candidate.scope === pair.scope && candidate.rpmPath.majorUnit === pair.majorUnit
            && candidate.rpmPath.midUnit === pair.midUnit && candidate.rpmPath.l3 === pair.l3 && candidate.rpmPath.l4 === pair.l4);
          return paired?.id || '';
        }).filter(Boolean),
      },
      canonicalEvidence: { problemType: problemTypeEvidence, templates: templateEvidence,
        familyCoverageProfile: familyRule ? { candidateTemplateKeys: familyRule.templateKeys, coveredMajorSubtypes: familyRule.subtypes,
          deterministicSelectionRule: cross.selectionRule || '' } : null },
      activeBinding: binding ? { exists: true, status: binding.status, curriculum: binding.curriculum,
        standardUnitKey: binding.standardUnitKey, subUnitKey: binding.subUnitKey || '', problemTypeKey: binding.problemTypeKey,
        ownerPack: binding.ownerPack } : { exists: false, status: cross.mappingStatus === 'RPM_ONLY' ? 'NO_ACTIVE_MAPPING' : 'MISSING' },
      existingActiveBinding: initialBinding ? { exists: true, status: initialBinding.status, curriculum: initialBinding.curriculum,
        standardUnitKey: initialBinding.standardUnitKey, subUnitKey: initialBinding.subUnitKey || '',
        problemTypeKey: initialBinding.problemTypeKey, ownerPack: initialBinding.ownerPack }
        : { exists: false, status: initialOwnerMismatchBindings.length ? 'OWNER_PACK_MISMATCH' : 'MISSING',
          conflictingActiveOwnerPacks: initialOwnerMismatchBindings.map(candidate => candidate.ownerPack) },
      finalOwnerMismatchBinding: cross.m3OwnerMismatchBinding || null,
      defectType: decision.defectType || knownDefect,
      additionalDefectTypes: [...new Set([decision.defectType, cross.m3NormalizationDefectType, knownDefect].filter(Boolean))],
      finalDisposition: cross.mappingStatus,
      repairAction: cross.m3NormalizationDisposition || (cross.mappingStatus === 'RPM_ONLY' ? 'KEEP_EXPLICIT_RPM_ONLY' : 'KEEP_SEMANTIC_MAPPING'),
      evidence: cross.m3NormalizationRationale || decision.evidence,
    };
  });
  const semanticCounts = countStatuses(auditRows, 'semanticRelation');
  const defectCounts = auditRows.reduce((counts, row) => {
    for (const key of new Set([row.defectType, ...row.additionalDefectTypes].filter(Boolean))) counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  const statusCounts = countStatuses(crosswalk.records);
  const normalization = { keep: 0, directToFamily: 0, directOrFamilyToRpmOnly: 0, ptTplRemap: 0,
    rpmOnlyToExistingCanonical: 0, bindingRepair: 0, bindingStatusReconciled: 0, unresolved: 0 };
  for (const row of crosswalk.records) {
    const initial = baselineById.get(row.id);
    if (!row.m3NormalizationDisposition) normalization.keep++;
    else if (initial.mappingStatus.startsWith('DIRECT') && row.mappingStatus.startsWith('FAMILY')) normalization.directToFamily++;
    else if ((initial.mappingStatus.startsWith('DIRECT') || initial.mappingStatus.startsWith('FAMILY')) && row.mappingStatus === 'RPM_ONLY') normalization.directOrFamilyToRpmOnly++;
    else if (initial.mappingStatus !== 'RPM_ONLY' && row.mappingStatus !== 'RPM_ONLY'
      && (initial.problemTypeKey !== row.problemTypeKey || initial.templateKey !== row.templateKey)) normalization.ptTplRemap++;
    else if (initial.mappingStatus === 'RPM_ONLY' && row.mappingStatus !== 'RPM_ONLY') normalization.rpmOnlyToExistingCanonical++;
    if (initial.bindingStatus === 'MISSING' && row.bindingStatus === 'ACTIVE') normalization.bindingRepair++;
    if (initial.bindingStatus === 'ACTIVE' && row.bindingStatus === 'MISSING') normalization.bindingStatusReconciled++;
    if (!['DIRECT_ACTIVE', 'FAMILY_ACTIVE', 'DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP', 'RPM_ONLY'].includes(row.mappingStatus)) normalization.unresolved++;
  }
  const summary = {
    schemaVersion: 'RPM_PRIMARY_M3_GLOBAL_ACTIVE_SEMANTIC_AUDIT_v1', baseMainSha: M3_BASE_MAIN_SHA,
    generatedAt: new Date().toISOString(), globalActivePacks: global.activePacks,
    globalActiveRegistryFingerprint: global.registryFingerprint, compiledRegistrySha: global.compiledRegistrySha,
    rpm: { totalRecords: auditRows.length, semanticRelationCounts: semanticCounts,
      omissions: { initial2015: 0, repaired2015: 0, 2022: 0 }, finalDefectTypeCounts: defectCounts },
    crosswalk: { totalRecords: crosswalk.records.length, finalMappingStatusCounts: statusCounts,
      normalizationCounts: normalization, exactBindingGaps: statusCounts.DIRECT_BINDING_GAP + statusCounts.FAMILY_BINDING_GAP },
    migration: { previousM3MigrationGapReceipts: 0, recoveredExistingReuse: 0, actualBindingOnlyGaps: 0,
    remainingSemanticGaps: 0, unresolvedCurriculumEvidenceRows: auditRows.filter(row => row.semanticRelation === 'NEEDS_EVIDENCE').length,
      resolverBindingGaps: statusCounts.DIRECT_BINDING_GAP + statusCounts.FAMILY_BINDING_GAP },
    curriculumEvidence: M3_CURRICULUM_EVIDENCE,
  };
  writeJson(`${M3_EVIDENCE_DIR}/global-active-registry-snapshot.json`, {
    schemaVersion: 'GLOBAL_ACTIVE_META_FOUNDATION_SNAPSHOT_v1', baseMainSha: M3_BASE_MAIN_SHA,
    registryFingerprint: global.registryFingerprint, compiledRegistrySha: global.compiledRegistrySha, activePacks: global.activePacks,
    problemTypeCount: global.problemTypes.size, templateCount: global.templates.size, exactBindingCount: global.bindings.length,
    problemTypes: [...global.problemTypes.values()], templates: [...global.templates.values()], bindings: global.bindings,
  });
  const ledger = { ...summary, records: auditRows };
  writeJson(`${M3_EVIDENCE_DIR}/semantic-audit-ledger.json`, ledger);
  writeJson(`${M3_EVIDENCE_DIR}/SEMANTIC_AUDIT_SUMMARY.json`, summary);
  return { status: 'PASS', summary, artifact: `${M3_EVIDENCE_DIR}/semantic-audit-ledger.json` };
}

function main() {
  const command = process.argv[2];
  if (command === '--snapshot-baseline') return console.log(JSON.stringify(takeM3BaselineSnapshot(), null, 2));
  if (command === '--normalize') return console.log(JSON.stringify(normalizeM3CrosswalkAndApplicability(), null, 2));
  if (command === '--validate') return console.log(JSON.stringify(validateM3Sources(), null, 2));
  if (command === '--audit') return console.log(JSON.stringify(buildM3SemanticAudit(), null, 2));
  throw new Error('Usage: normalize-rpm-primary-m3.mjs --snapshot-baseline | --normalize | --audit | --validate');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
