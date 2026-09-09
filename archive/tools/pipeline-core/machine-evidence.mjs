import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileRef, objectSha, readBoundFile, safePath, writeNewJson, nonempty, canonicalJson } from './canonical.mjs';
import { profiles, RUN_VERSION_V2, runInputSha, loadBoundQuestionBanks, EVIDENCE_VERSION_V2 } from './closure.mjs';
import { computeV2AxisInputShas } from './v2-audit.mjs';
import { requiredAxesForQuestion } from './projection.mjs';
import { validateMachineEvidence, validateTypedEvidence } from './review-evidence-v2.mjs';
import { validateSchema } from './schema.mjs';

export const MACHINE_EVIDENCE_BRIDGE_VERSION = 'APMATH_MACHINE_EVIDENCE_BRIDGE_v1';
export const MACHINE_EVIDENCE_COLLECTOR = 'pipeline-core-machine-collector';
const MACHINE_AXES = Object.freeze(['STATIC', 'METADATA']);
const evidenceContract = JSON.parse(fs.readFileSync(new URL('./contracts/evidence-v2.schema.json', import.meta.url), 'utf8'));

const repositoryRelative = (root, value) => {
  if (!nonempty(value)) throw new Error('MACHINE_MANIFEST_REQUIRED');
  const base = fs.realpathSync(root);
  const absolute = path.resolve(base, value);
  const relative = path.relative(base, absolute).split(path.sep).join('/');
  if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) throw new Error('MACHINE_PATH_OUTSIDE_ROOT');
  return relative;
};

const loadBank = (root, ref) => {
  const context = { window: {} };
  vm.runInNewContext(readBoundFile(root, ref).toString('utf8'), context, { timeout: 1000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`MACHINE_JS_BANK_REQUIRED:${ref.path}`);
  if (new Set(context.window.questionBank.map(q => q?.id)).size !== context.window.questionBank.length) throw new Error(`MACHINE_JS_BANK_ID_DUPLICATE:${ref.path}`);
  return JSON.parse(JSON.stringify(context.window));
};

const assetMatches = (question, paths, field, run) => {
  const value = question?.[field];
  if (!value) return true;
  return (paths || []).some(candidate => candidate === value || candidate === `archive/${value}` || candidate === `${run.assetRoot || 'archive'}/${value}`);
};

function staticChecks(root, run, question, declared, sourceBank, candidateBank, axisShas) {
  const checks = {
    schema: Boolean(run.schemaVersion === RUN_VERSION_V2 && declared?.questionUid && Number.isSafeInteger(declared?.qid) && Array.isArray(declared?.requiredAxes) && Array.isArray(question?.choices) && nonempty(question?.content) && nonempty(String(question?.answer ?? '')) && nonempty(question?.solution)),
    jsLoad: Boolean(Array.isArray(sourceBank?.questionBank) && Array.isArray(candidateBank?.questionBank) && sourceBank.questionBank.some(q => q.id === declared.qid) && candidateBank.questionBank.some(q => q.id === declared.qid)),
    hashes: false,
    assetBinding: false,
    fileParity: false
  };
  try {
    for (const input of run.inputs || []) readBoundFile(root, input);
    checks.hashes = run.inputSha === runInputSha(run) && ['STATIC', 'METADATA'].every(axis => declared.axisInputShas?.[axis] === axisShas[axis]);
  } catch { checks.hashes = false; }
  try {
    const inputPaths = new Set((run.inputs || []).map(ref => ref.path));
    checks.assetBinding = (declared.problemAssetPaths || []).every(asset => inputPaths.has(asset)) && (declared.solutionAssetPaths || []).every(asset => inputPaths.has(asset)) && assetMatches(question, declared.problemAssetPaths, 'image', run) && assetMatches(question, declared.solutionAssetPaths, 'solutionImage', run);
  } catch { checks.assetBinding = false; }
  checks.fileParity = canonicalJson(sourceBank?.questionBank?.map(q => q.id)) === canonicalJson(candidateBank?.questionBank?.map(q => q.id)) && sourceBank?.examTitle === declared.examId && sourceBank.questionBank.some(q => q.id === declared.qid);
  return checks;
}

function metadataChecks(question, declared, source) {
  const metadataKeys = ['standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'questionType', 'layoutTag', 'tags', 'wide'];
  const hasMetadata = metadataKeys.some(key => Object.hasOwn(question || {}, key) || Object.hasOwn(source || {}, key));
  const schema = Boolean(question && Number.isSafeInteger(question.id) && Array.isArray(question.choices) && nonempty(question.content));
  const uidBinding = Boolean(declared?.questionUid === `${declared?.sourceExamId}|${declared?.sourceQuestionOrdinal}` && question?.id === declared?.qid && source?.id === declared?.qid);
  const curriculumBinding = !hasMetadata || (
    nonempty(question.standardCourse) && nonempty(question.standardUnitKey) && nonempty(question.standardUnit) &&
    Number.isSafeInteger(question.standardUnitOrder) && nonempty(question.questionType) && nonempty(question.layoutTag) &&
    Array.isArray(question.tags) && typeof question.wide === 'boolean' &&
    (!Object.hasOwn(question, 'subUnitKey') || nonempty(question.subUnitKey)) &&
    (!Object.hasOwn(question, 'subUnit') || nonempty(question.subUnit))
  );
  return { schema, uidBinding, curriculumBinding };
}

function buildEvidence({ run, question, axis, axisInputSha, checks, startedAt, frozenAt }) {
  const machineProvenance = { bridge: MACHINE_EVIDENCE_BRIDGE_VERSION, collector: MACHINE_EVIDENCE_COLLECTOR, runId: run.runId, revision: run.revision, inputSha: run.inputSha, questionUid: question.questionUid, axis, axisInputSha };
  const evidence = {
    schemaVersion: EVIDENCE_VERSION_V2,
    evidenceId: `machine:${run.runId}:r${run.revision}:${question.qid}:${axis}`,
    runId: run.runId,
    revision: run.revision,
    questionUid: question.questionUid,
    axis,
    inputSha: run.inputSha,
    axisInputSha,
    mode: 'MACHINE_CURRENT',
    status: 'PASS',
    validityStatus: 'FROZEN',
    reviewerId: MACHINE_EVIDENCE_COLLECTOR,
    reviewSessionId: `${run.runId}:r${run.revision}:machine-checks`,
    reviewerModelOrAgent: 'pipeline-core deterministic machine checks',
    auditorPrincipalType: 'MACHINE_COLLECTOR',
    startedAt,
    frozenAt,
    priorReviewVisibility: 'NONE',
    inputVisibilityProfile: 'MACHINE_CURRENT',
    findings: [],
    reviewIsolationProvenanceSha: objectSha(machineProvenance),
    reviewStartInputSha: run.inputSha,
    reviewEndInputSha: run.inputSha,
    withdrawalStatus: 'ACTIVE',
    revocationStatus: 'NOT_REVOKED',
    supersessionStatus: 'VALID',
    sourceAuthorityStatus: 'VALID',
    eligibilityStatus: 'ELIGIBLE',
    machineProvenance,
    payload: axis === 'STATIC'
      ? { checkedInputSha: run.inputSha, checks: Object.fromEntries(Object.entries(checks).map(([key, value]) => [key, value ? 'PASS' : 'FAIL'])) }
      : { metadataInputSha: axisInputSha, checks: Object.fromEntries(Object.entries(checks).map(([key, value]) => [key, value ? 'PASS' : 'FAIL'])) }
  };
  const schemaErrors = validateSchema(evidence, evidenceContract);
  const machineErrors = validateMachineEvidence(evidence, run);
  const typedErrors = validateTypedEvidence(evidence);
  if (schemaErrors.length || machineErrors.length || typedErrors.length) throw new Error(`MACHINE_EVIDENCE_CONTRACT:${[...schemaErrors, ...machineErrors, ...typedErrors].join(';')}`);
  return evidence;
}

export function collectMachineEvidence(root, manifestPath, { manifestOut = null, evidenceDir = null } = {}) {
  const manifestRelative = repositoryRelative(root, manifestPath);
  const manifestFile = safePath(root, manifestRelative);
  const run = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (run.schemaVersion !== RUN_VERSION_V2 || !profiles.pipelines[run.pipeline] || !run.questions?.length) throw new Error('MACHINE_RUN_V2_REQUIRED');
  if (run.inputSha !== runInputSha(run)) throw new Error('MACHINE_RUN_INPUT_SHA_STALE');
  const outputRelative = manifestOut ? repositoryRelative(root, manifestOut) : manifestRelative.replace(/\.json$/i, `.machine-r${run.revision}.json`);
  const outputFile = safePath(root, outputRelative, { mustExist: false });
  if (fs.existsSync(outputFile)) throw new Error('MACHINE_MANIFEST_OUTPUT_EXISTS');
  const computed = computeV2AxisInputShas(root, run);
  const actual = loadBoundQuestionBanks(root, run);
  const sourceRefByPath = new Map((run.inputs || []).filter(ref => ref.role === 'source').map(ref => [ref.path, ref]));
  const candidateRefByPath = new Map((run.inputs || []).filter(ref => ref.role === 'candidate').map(ref => [ref.path, ref]));
  const banks = new Map();
  for (const ref of [...sourceRefByPath.values(), ...candidateRefByPath.values()]) banks.set(ref.path, loadBank(root, ref));
  const existing = (run.evidence || []).map(ref => JSON.parse(readBoundFile(root, ref)));
  for (const evidence of existing) if (MACHINE_AXES.includes(evidence.axis) && run.questions.some(q => q.questionUid === evidence.questionUid)) throw new Error(`MACHINE_EVIDENCE_ALREADY_BOUND:${evidence.questionUid}:${evidence.axis}`);
  const outputRun = structuredClone(run);
  outputRun.evidence = [...(outputRun.evidence || [])];
  const evidenceRefs = [];
  const outputDirectory = path.posix.dirname(outputRelative);
  const rootDirectory = evidenceDir ? repositoryRelative(root, evidenceDir) : path.posix.join(outputDirectory, 'machine-evidence', `r${run.revision}`);
  const planned = [];
  for (const question of actual) {
    const declared = run.questions.find(row => row.questionUid === question.questionUid);
    const axisShas = computed[question.questionUid] || {};
    const sourceBank = banks.get(declared.sourcePath), candidateBank = banks.get(declared.candidatePath);
    for (const axis of MACHINE_AXES) {
      if (!axisShas[axis]) continue;
      if (declared.axisInputShas?.[axis] !== axisShas[axis]) throw new Error(`MACHINE_AXIS_INPUT_SHA_STALE:${question.questionUid}:${axis}`);
      const checks = axis === 'STATIC' ? staticChecks(root, run, question, declared, sourceBank, candidateBank, axisShas) : metadataChecks(question, declared, question.sourceRecord);
      if (Object.values(checks).some(value => value !== true)) throw new Error(`MACHINE_CHECK_FAILED:${question.questionUid}:${axis}:${Object.entries(checks).filter(([, value]) => !value).map(([key]) => key).join(',')}`);
      const startedAt = new Date().toISOString();
      const evidence = buildEvidence({ run, question: declared, axis, axisInputSha: axisShas[axis], checks, startedAt, frozenAt: new Date().toISOString() });
      const relative = path.posix.join(rootDirectory, `q${String(declared.qid).padStart(3, '0')}-${axis.toLowerCase()}.json`);
      const file = safePath(root, relative, { mustExist: false });
      if (fs.existsSync(file)) throw new Error(`MACHINE_EVIDENCE_OUTPUT_EXISTS:${relative}`);
      planned.push({ relative, file, evidence });
    }
  }
  for (const item of planned) {
    writeNewJson(item.file, item.evidence);
    const ref = fileRef(root, item.relative);
    evidenceRefs.push(ref);
    const question = outputRun.questions.find(q => q.questionUid === item.evidence.questionUid);
    question.evidence = { ...(question.evidence || {}), [item.evidence.axis]: item.evidence.evidenceId };
  }
  outputRun.evidence.push(...evidenceRefs);
  writeNewJson(outputFile, outputRun);
  return { status: 'MACHINE_EVIDENCE_READY', bridgeVersion: MACHINE_EVIDENCE_BRIDGE_VERSION, runId: run.runId, revision: run.revision, inputSha: run.inputSha, manifestRef: fileRef(root, outputRelative), evidenceRefs, questionCount: run.questions.length, machineEvidenceCount: evidenceRefs.length };
}
