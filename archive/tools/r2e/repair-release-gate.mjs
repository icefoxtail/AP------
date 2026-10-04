#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseQuestionBank } from '../meta-foundation/reviewed-apply-core.mjs';
import { validateStudentSerialization } from '../pipeline-core/student-output.mjs';
import { safePath } from '../pipeline-core/canonical.mjs';
import { blob, ensure, relative, sha } from './common.mjs';

export const REQUIRED_FAST_GATES = Object.freeze([
  'fastIntegrity', 'r1ReadOnlyAuthority', 'holdInventoryCoverage', 'protectedParity',
]);
const VALID_RELEASE_EFFECTS = new Set(['RELEASE_BLOCKING', 'META_ONLY']);
const CLOSED_BLOCKING_OUTCOMES = new Set(['REPAIRED', 'VERIFIED_NO_CHANGE']);
const CLOSED_META_OUTCOMES = new Set(['MAPPED_EXISTING', 'GROUP_RESOLVED', 'REPAIRED']);
const assetPath = value => {
  const normalized = String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  return normalized.startsWith('archive/') ? normalized : 'archive/' + normalized.replace(/^\/+/, '');
};

function gateRef(root, gate, name, errors, required = true) {
  if (!gate || !gate.evidenceRef) {
    if (required) errors.push('GATE_EVIDENCE_REQUIRED:' + name);
    return;
  }
  try {
    const file = safePath(root, relative(gate.evidenceRef.path));
    const actual = sha(fs.readFileSync(file));
    if (actual !== String(gate.evidenceRef.sha256 || '').replace(/^sha256:/, '')) errors.push('GATE_EVIDENCE_SHA_MISMATCH:' + name);
  } catch (error) { errors.push('GATE_EVIDENCE_UNREADABLE:' + name + ':' + error.message); }
}
function readR1Blob(root, authority, key, errors) {
  const ref = authority && authority[key];
  if (!ref || !ref.path || !ref.sha256) {
    errors.push('R1_AUTHORITY_REF_MISSING:' + key);
    return null;
  }
  try {
    const bytes = blob(root, authority.inputCommit, relative(ref.path));
    if (sha(bytes) !== String(ref.sha256).replace(/^sha256:/, '')) errors.push('R1_AUTHORITY_SHA_MISMATCH:' + key);
    return bytes;
  } catch (error) { errors.push('R1_AUTHORITY_READ_FAIL:' + key + ':' + error.message); return null; }
}
function verifyEvidenceRef(root, ref, inputCommit, errors, label) {
  if (!ref || !ref.path || !ref.sha256) { errors.push('HOLD_EVIDENCE_REF_INVALID:' + label); return; }
  const expected = String(ref.sha256).replace(/^sha256:/, '');
  const frozenCommit = ref.inputCommit || inputCommit;
  try {
    const localPath = safePath(root, relative(ref.path));
    const localBytes = fs.readFileSync(localPath);
    if (sha(localBytes) === expected) return;
  } catch {}
  if (frozenCommit) {
    try {
      const frozenBytes = blob(root, frozenCommit, relative(ref.path));
      if (sha(frozenBytes) === expected) return;
    } catch {}
  }
  errors.push('HOLD_EVIDENCE_SHA_UNVERIFIED:' + label + ':' + ref.path);
}
function validateHoldCoverage(root, ledger, errors) {
  const inventory = ledger.holdInventory;
  if (!inventory || inventory.schemaVersion !== 'R2E_HOLD_INVENTORY_v2' || !Array.isArray(inventory.items) || !Array.isArray(inventory.groups)) {
    errors.push('R2E_HOLD_INVENTORY_REQUIRED'); return { metaOnlyPendingCount: null, releaseBlockingOpenCount: null, holdBatchStatus: null, upperModelPendingCount: null };
  }
  const items = inventory.items.filter(item => item.examUid === ledger.examUid);
  const ids = new Set(items.map(item => item.findingId));
  if (ids.size !== items.length) errors.push('HOLD_FINDING_ID_DUPLICATE');
  const examCommit = new Map((inventory.exams || []).map(row => [row.examUid, row.inputCommit])).get(ledger.examUid);
  const taxonomy = JSON.parse(fs.readFileSync(safePath(root, 'archive/data/meta-foundation/compiled/taxonomy_registry.json'), 'utf8'));
  const activeProblemTypes = new Map((taxonomy.problemTypes || []).filter(row => row.status === 'ACTIVE').map(row => [row.problemTypeKey, row]));
  const activeTemplates = new Map((taxonomy.templates || []).filter(row => row.status === 'ACTIVE').map(row => [row.templateKey, row]));
  const applications = new Map();
  for (const group of inventory.groups) {
    if (group.status === 'DECIDED' && (!group.decisionId || !Array.isArray(group.evidenceRefs) || !group.evidenceRefs.length)) errors.push('HOLD_GROUP_DECISION_EVIDENCE_MISSING:' + group.groupId);
    if (group.action === 'EXISTING_L3_L4_MAPPING') {
      const selectedProblemTypes = new Set((group.selectedExistingKeys || []).filter(key => activeProblemTypes.has(key)));
      for (const key of group.selectedExistingKeys || []) {
        const pt = activeProblemTypes.get(key), tpl = activeTemplates.get(key);
        if (!pt && !tpl) errors.push('GROUP_KEY_NOT_ACTIVE:' + group.groupId + ':' + key);
        if (tpl && tpl.parentProblemTypeKey && !activeProblemTypes.has(tpl.parentProblemTypeKey)) errors.push('GROUP_TEMPLATE_PARENT_INACTIVE:' + group.groupId + ':' + key);
        if (tpl && selectedProblemTypes.size && !selectedProblemTypes.has(tpl.parentProblemTypeKey)) errors.push('GROUP_TEMPLATE_PARENT_MISMATCH:' + group.groupId + ':' + key);
      }
    }
    for (const ref of group.evidenceRefs || []) verifyEvidenceRef(root, ref, examCommit, errors, 'GROUP:' + group.groupId);
    for (const row of group.uidApplications || []) {
      if (applications.has(row.findingId)) errors.push('HOLD_UID_APPLICATION_DUPLICATE:' + row.findingId);
      for (const ref of row.evidenceRefs || []) verifyEvidenceRef(root, ref, examCommit, errors, 'UID:' + row.findingId);
      applications.set(row.findingId, row);
    }
  }
  const cases = new Map((inventory.upperModelCases || []).map(item => [item.caseId, item]));
  let metaOnlyPendingCount = 0, releaseBlockingOpenCount = 0;
  for (const item of items) {
    if (!VALID_RELEASE_EFFECTS.has(item.releaseEffect)) { errors.push('HOLD_RELEASE_EFFECT_INVALID:' + item.findingId); continue; }
    const group = inventory.groups.find(row => row.groupId === item.groupId);
    const application = applications.get(item.findingId);
    if (!group && !item.upperModelCaseId) errors.push('HOLD_NOT_ROUTED:' + item.findingId);
    if (item.upperModelCaseId && !cases.has(item.upperModelCaseId)) errors.push('UPPER_MODEL_CASE_MISSING:' + item.findingId);
    if (application && (application.findingId !== item.findingId || application.questionUid !== item.questionUid || Number(application.ordinal) !== item.ordinal)) errors.push('HOLD_APPLICATION_UID_MISMATCH:' + item.findingId);
    if (application && (!group || group.status !== 'DECIDED' || !group.decisionId || application.decisionId !== group.decisionId)) errors.push('HOLD_APPLICATION_DECISION_MISMATCH:' + item.findingId);
    if (application && (!Array.isArray(application.evidenceRefs) || !application.evidenceRefs.length)) errors.push('HOLD_UID_APPLICATION_EVIDENCE_MISSING:' + item.findingId);
    if (application && item.outcome && application.outcome !== item.outcome) errors.push('HOLD_APPLICATION_OUTCOME_MISMATCH:' + item.findingId);
    if (application && group && group.action === 'EXISTING_L3_L4_MAPPING' && application.outcome === 'MAPPED_EXISTING') {
      const appliedKeys = application.appliedExistingKeys || [];
      if (!appliedKeys.length || appliedKeys.some(key => !(group.selectedExistingKeys || []).includes(key))) errors.push('HOLD_APPLICATION_KEY_MISMATCH:' + item.findingId);
    }
    if (item.releaseEffect === 'META_ONLY') {
      if (!group && !item.upperModelCaseId) errors.push('META_ONLY_NOT_GROUPED_OR_ROUTED:' + item.findingId);
      if (application && (!group || group.status !== 'DECIDED')) errors.push('META_ONLY_UID_APPLICATION_WITHOUT_GROUP_DECISION:' + item.findingId);
      if (!CLOSED_META_OUTCOMES.has(item.outcome || application && application.outcome)) metaOnlyPendingCount++;
    } else {
      const outcome = item.outcome || application && application.outcome || item.status;
      if (!group || group.status !== 'DECIDED' || !application) errors.push('RELEASE_BLOCKING_REPAIR_DECISION_MISSING:' + item.findingId);
      if (!CLOSED_BLOCKING_OUTCOMES.has(outcome)) {
        releaseBlockingOpenCount++;
        errors.push('RELEASE_BLOCKING_ITEM_OPEN:' + item.findingId + ':' + outcome);
      }
    }
  }
  return {
    metaOnlyPendingCount,
    releaseBlockingOpenCount,
    holdBatchStatus: inventory.summary && inventory.summary.holdBatchStatus || 'UNKNOWN',
    upperModelPendingCount: inventory.summary && inventory.summary.upperModelPendingCount || inventory.upperModelCases.length,
  };
}
export function repairReleaseGate(root, ledger, validation) {
  const errors = [];
  const record = (ok, code) => { if (!ok) errors.push(code); };
  record(ledger?.schemaVersion === 'R2E_REPAIR_RELEASE_LEDGER_v2', 'REPAIR_RELEASE_LEDGER_V2_REQUIRED');
  record(Object.values({ m2: 'work/intake/m2', m3: 'work/intake/m3' }).includes(ledger.inputBranch), 'INTAKE_AUTHORITY_INVALID');
  record(/^[a-f0-9]{40}$/.test(ledger.inputCommit || ''), 'FROZEN_INPUT_COMMIT_REQUIRED');
  record(ledger.r1Authority?.readOnly === true, 'R1_READ_ONLY_AUTHORITY_REQUIRED');
  if (ledger.r1Authority) {
    record(ledger.r1Authority.examUid === ledger.examUid, 'R1_AUTHORITY_UID_MISMATCH');
    record(ledger.r1Authority.inputCommit === ledger.inputCommit, 'R1_AUTHORITY_COMMIT_MISMATCH');
    readR1Blob(root, ledger.r1Authority, 'receiptRef', errors);
    if (ledger.r1Authority.evidenceRef) readR1Blob(root, ledger.r1Authority, 'evidenceRef', errors);
  }

  let examBytes = null, bank = [];
  try {
    const file = safePath(root, relative(ledger.examFile));
    examBytes = fs.readFileSync(file);
    record(sha(examBytes) === validation.artifactSha256, 'VALIDATION_ARTIFACT_SHA_STALE');
    bank = parseQuestionBank(examBytes.toString('utf8'), ledger.examFile);
    record(bank.length === ledger.denominator && bank.length > 0, 'DENOMINATOR_MISMATCH');
    record(ledger.integrityScanned === bank.length, 'INTEGRITY_SCAN_COVERAGE');
    record(bank.every((q, index) => Number(q.id) === index + 1), 'QUESTION_ORDINAL_SEQUENCE_INVALID');
    record(new Set(bank.map(q => Number(q.id))).size === bank.length, 'QUESTION_ORDINAL_DUPLICATE');
    const dependencyByPath = new Map((ledger.dependencyShas || []).map(ref => [ref.path, ref]));
    for (const [index, q] of bank.entries()) {
      record(Boolean(String(q.answer || '').trim()), 'ANSWER_BLANK:' + (index + 1));
      record(Boolean(String(q.solution || '').trim()), 'SOLUTION_BLANK:' + (index + 1));
      record(validateStudentSerialization(q).status === 'PASS', 'SERIALIZATION_FAIL:' + (index + 1));
      for (const value of [q.image, q.solutionImage].filter(Boolean)) {
        const referenced = assetPath(value), dependency = dependencyByPath.get(referenced);
        record(Boolean(dependency), 'ASSET_DEPENDENCY_REF_MISSING:' + referenced);
        try {
          const assetBytes = fs.readFileSync(safePath(root, relative(referenced)));
          record(Boolean(dependency) && sha(assetBytes) === String(dependency.sha256).replace(/^sha256:/, ''), 'ASSET_SHA_MISMATCH:' + referenced);
        } catch (error) { errors.push('ASSET_MISSING:' + referenced + ':' + error.message); }
      }
    }
  } catch (error) { errors.push('JS_LOAD:' + error.message); }

  const identity = JSON.parse(fs.readFileSync(safePath(root, 'archive/data/question_identity_map.json'), 'utf8'));
  const sourceArchiveFile = String(ledger.examFile).replace(/^archive\/exams\//, '');
  const identityByOrdinal = new Map((identity.records || []).filter(row => row.sourceArchiveFile === sourceArchiveFile).map(row => [Number(row.sourceOrdinal), row]));
  const integrityItems = ledger.integrityItems || [];
  record(integrityItems.length === ledger.denominator, 'INTEGRITY_UID_COVERAGE');
  const seenUids = new Set();
  for (let index = 0; index < integrityItems.length; index++) {
    const row = integrityItems[index], identityRow = identityByOrdinal.get(index + 1);
    record(Number(row.ordinal) === index + 1, 'INTEGRITY_ORDINAL_MISMATCH:' + (index + 1));
    record(Boolean(identityRow && row.questionUid === identityRow.questionUid), 'UID_SOURCE_IDENTITY_MISMATCH:' + (index + 1));
    if (row.questionUid) {
      record(!seenUids.has(row.questionUid), 'UID_DUPLICATE:' + row.questionUid);
      seenUids.add(row.questionUid);
    }
    if (row.r1Status === 'PASS' && !(ledger.changedItems || []).some(item => item.questionUid === row.questionUid)) {
      record((row.changedFields || []).length === 0, 'NORMAL_PASS_MUTATION:' + row.questionUid);
    }
  }

  for (const name of REQUIRED_FAST_GATES) {
    const gate = validation.gates && validation.gates[name];
    record(gate && gate.status === 'PASS', 'GATE_NOT_PASS:' + name);
    gateRef(root, gate, name, errors);
  }
  const holdCoverage = validateHoldCoverage(root, ledger, errors);
  const repairs = ledger.changedItems || [];
  const changedVisuals = repairs.filter(item => (item.changedFields || []).some(field => /svg|solutionImage|visualAsset|image/i.test(field)));
  const changedContent = repairs.filter(item => (item.changedFields || []).some(field => /content|choices|answer|solution/i.test(field)));
  const changedMeta = repairs.filter(item => (item.changedFields || []).some(field => /problemTypeKey|templateKey|crossConcept|condition|difficulty|standardUnit|subUnit/i.test(field)));
  if (changedContent.length) {
    const gate = validation.gates && validation.gates.targetedMath;
    record(gate && gate.status === 'PASS', 'TARGETED_MATH_GATE_REQUIRED');
    gateRef(root, gate, 'targetedMath', errors);
  }
  if (changedVisuals.length) {
    for (const name of ['targetedSvgParity', 'targetedRender']) {
      const gate = validation.gates && validation.gates[name];
      record(gate && gate.status === 'PASS', 'TARGETED_VISUAL_GATE_REQUIRED:' + name);
      gateRef(root, gate, name, errors);
    }
  }
  if (changedMeta.length) {
    const gate = validation.gates && validation.gates.targetedExistingKeyValidation;
    record(gate && gate.status === 'PASS', 'TARGETED_EXISTING_KEY_GATE_REQUIRED');
    gateRef(root, gate, 'targetedExistingKeyValidation', errors);
  }

  record(validation.inputCommit === ledger.inputCommit, 'VALIDATION_INPUT_COMMIT_MISMATCH');
  record(sha(examBytes || Buffer.alloc(0)) === String(validation.artifactSha256 || '').replace(/^sha256:/, ''), 'ARTIFACT_SHA_REQUIRED');
  const dependencies = [...(ledger.dependencyShas || []), ...(validation.artifacts || [])];
  for (const ref of dependencies) {
    try {
      const bytes = fs.readFileSync(safePath(root, relative(ref.path)));
      record(sha(bytes) === String(ref.sha256).replace(/^sha256:/, ''), 'DEPENDENCY_OR_ASSET_STALE:' + ref.path);
    } catch (error) { errors.push('DEPENDENCY_MISSING:' + ref.path + ':' + error.message); }
  }
  return {
    schemaVersion: 'R2E_REPAIR_RELEASE_GATE_RESULT_v2',
    status: errors.length ? 'FAIL' : 'PASS',
    errors: [...new Set(errors)],
    examUid: ledger.examUid,
    inputCommit: ledger.inputCommit,
    artifactSha256: examBytes ? sha(examBytes) : null,
    holdSummary: holdCoverage,
    changedItemCount: repairs.length,
    productionAuthorized: false,
  };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = key => { const index = args.indexOf('--' + key); return index < 0 ? null : args[index + 1]; };
  try {
    const repo = path.resolve(opt('repo') || '.');
    const ledger = JSON.parse(fs.readFileSync(opt('ledger'), 'utf8'));
    const validation = JSON.parse(fs.readFileSync(opt('validation'), 'utf8'));
    const result = repairReleaseGate(repo, ledger, validation);
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== 'PASS') process.exitCode = 1;
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', errors: [error.message], productionAuthorized: false })); process.exitCode = 1; }
}
