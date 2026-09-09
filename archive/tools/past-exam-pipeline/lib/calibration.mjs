import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { bytesSha, objectSha, nonempty } from '../../pipeline-core/canonical.mjs';
import { rulePreflight } from '../../pipeline-core/rulepack.mjs';

export const CALIBRATION_VERSION = 'PAST_EXAM_REFERENCE_SAMPLE_LOCK_v1';
export const CALIBRATION_AXES = ['schema', 'solutionQuality', 'metadata', 'problemVisual', 'solutionVisual', 'layout'];
export const QUALITY_PROFILE_CHECKS = ['noAnswerOnlySolution', 'conceptExplained', 'conditionsInterpreted', 'intermediateReasoningPreserved', 'choiceConclusionNumber', 'highLevelNoLogicJump', 'subjectiveStepsSufficient', 'problemSolutionImagesSeparate', 'beneficialVisualsUsed', 'visualAltCaption', 'visualMathParity'];
const git = (root, args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
const localRef = file => { const absolute = path.resolve(file), bytes = fs.readFileSync(absolute); return { path: absolute, bytes: bytes.length, sha256: bytesSha(bytes) }; };
const sameRef = (a, b) => a?.path === b?.path && a?.bytes === b?.bytes && a?.sha256 === b?.sha256;

export function latestMainCommit(root) {
  const local = git(root, ['rev-parse', 'refs/remotes/origin/main']).toString().trim();
  const remote = git(root, ['ls-remote', '--exit-code', 'origin', 'refs/heads/main']).toString().trim().split(/\s+/)[0];
  if (!/^[0-9a-f]{40,64}$/.test(local) || local !== remote) throw new Error('CALIBRATION_MAIN_STALE: fetch origin main before preparing calibration');
  return local;
}

export function readProductionSample(root, mainCommit, relative) {
  if (!/^archive\/exams\/original\/.+\.js$/.test(relative || '') || relative.includes('..') || relative.includes('\\')) throw new Error('CALIBRATION_PRODUCTION_PATH_REQUIRED');
  if (!/^[0-9a-f]{40,64}$/.test(mainCommit || '')) throw new Error('CALIBRATION_MAIN_COMMIT_REQUIRED');
  const raw = git(root, ['show', `${mainCommit}:${relative}`]);
  const context = { window: {} };
  vm.runInNewContext(raw.toString('utf8'), context, { timeout: 1000 });
  const bank = JSON.parse(JSON.stringify(context.window));
  if (!nonempty(bank.examTitle) || !Array.isArray(bank.questionBank) || !bank.questionBank.length) throw new Error('CALIBRATION_SAMPLE_BANK_INVALID');
  return { path: relative, rawSha256: bytesSha(raw), bytes: raw.length, examTitle: bank.examTitle,
    standardCourse: [...new Set(bank.questionBank.map(q => q.standardCourse || ''))].sort(),
    questionCount: bank.questionBank.length, bank: bank.questionBank };
}

export function calibrationTarget(root, manifest) {
  const sourceFiles = [...new Set([manifest.pdfPath, ...(manifest.sourcePageImagePaths || [])].filter(Boolean))].map(file => localRef(path.resolve(root, file)));
  if (!manifest.examId || !sourceFiles.length) throw new Error('CALIBRATION_TARGET_SOURCE_REQUIRED');
  const baselinePath = manifest.archiveRelativePath ? path.resolve(root, 'archive/exams', manifest.archiveRelativePath) : null;
  const productionRoot = path.resolve(root, 'archive/exams/original') + path.sep;
  if (baselinePath && !baselinePath.startsWith(productionRoot)) throw new Error('CALIBRATION_BASELINE_PATH_INVALID');
  return { examId: manifest.examId, sourceFiles, baselineStatus: baselinePath && fs.existsSync(baselinePath) ? 'PRESENT' : 'ABSENT', baselineRef: baselinePath && fs.existsSync(baselinePath) ? localRef(baselinePath) : null };
}

export function prepareCalibration(root, manifest, samplePaths) {
  const rules = rulePreflight(root);
  if (rules.status !== 'PASS') throw new Error(`SOURCE_PACK_DRIFT:${rules.errors.join(';')}`);
  const mainCommit = latestMainCommit(root);
  if (![2, 3].includes(samplePaths.length) || new Set(samplePaths).size !== samplePaths.length) throw new Error('CALIBRATION_REQUIRES_2_OR_3_DISTINCT_SAMPLES');
  const target = calibrationTarget(root, manifest);
  const baselineBytes = target.baselineRef ? fs.readFileSync(target.baselineRef.path) : null;
  let baselineQuestions = [];
  if (baselineBytes) {
    const context = { window: {} };
    vm.runInNewContext(baselineBytes.toString('utf8'), context, { timeout: 1000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error('CALIBRATION_BASELINE_BANK_INVALID');
    baselineQuestions = JSON.parse(JSON.stringify(context.window.questionBank));
  }
  return { schemaVersion: CALIBRATION_VERSION, status: 'NOT_TESTED', mainCommit, rulePackSha: rules.rulePackSha,
    target, readerId: '', readerSessionId: '', startedAt: null, frozenAt: null,
    baselineObservation: '', baselineSnapshotBase64: baselineBytes?.toString('base64') ?? null,
    baselineQuestionObservations: baselineQuestions.map(q => ({ qid: q.id, questionSha: objectSha(q), observation: '' })),
    sourceTruthPolicy: 'TARGET_SOURCE_ONLY', sampleRole: 'QUALITY_CALIBRATION_ONLY',
    samples: samplePaths.map(relative => {
      const { bank, ...sample } = readProductionSample(root, mainCommit, relative);
      return { ...sample, selectionReason: '', qualityAcceptanceReason: '', checkedAxes: Object.fromEntries(CALIBRATION_AXES.map(axis => [axis, { status: 'NOT_TESTED', observation: '' }])),
        questionObservations: bank.map(q => ({ qid: q.id, questionSha: objectSha(q), solutionExcerpt: '', observation: '' })) };
    }),
    productionQualityProfile: Object.fromEntries(QUALITY_PROFILE_CHECKS.map(key => [key, { status: 'NOT_TESTED', minimumStandard: '', sampleAnchors: [] }])) };
}

export function validateCalibration(root, lock, { manifest = null, requireLatestMain = false, requirePass = true } = {}) {
  const errors = [];
  if (lock?.schemaVersion !== CALIBRATION_VERSION) return { status: 'BLOCKED', errors: ['REFERENCE_SAMPLE_LOCK_REQUIRED'] };
  try {
    if (requireLatestMain && latestMainCommit(root) !== lock.mainCommit) errors.push('CALIBRATION_MAIN_STALE');
    const rules = rulePreflight(root);
    if (rules.status !== 'PASS' || rules.rulePackSha !== lock.rulePackSha) errors.push('CALIBRATION_RULE_PACK_STALE');
    if (manifest && objectSha(calibrationTarget(root, manifest)) !== objectSha(lock.target)) errors.push('CALIBRATION_TARGET_STALE');
    for (const ref of lock.target?.sourceFiles || []) if (!sameRef(ref, localRef(ref.path))) errors.push('CALIBRATION_TARGET_BYTES_STALE');
    if (!lock.target?.sourceFiles?.length || !nonempty(lock.target.examId)) errors.push('CALIBRATION_TARGET_REQUIRED');
    if (lock.target?.baselineStatus === 'PRESENT' && (!lock.target.baselineRef || !nonempty(lock.baselineObservation))) errors.push('CALIBRATION_BASELINE_REVIEW_REQUIRED');
    if (lock.target?.baselineStatus === 'PRESENT') {
      const snapshot = Buffer.from(lock.baselineSnapshotBase64 || '', 'base64');
      if (!snapshot.length || snapshot.length !== lock.target.baselineRef?.bytes || bytesSha(snapshot) !== lock.target.baselineRef?.sha256) errors.push('CALIBRATION_BASELINE_SNAPSHOT_REQUIRED');
      else {
        const context = { window: {} };
        vm.runInNewContext(snapshot.toString('utf8'), context, { timeout: 1000 });
        const bank = JSON.parse(JSON.stringify(context.window.questionBank || []));
        const rows = lock.baselineQuestionObservations;
        if (!bank.length || !Array.isArray(rows) || rows.length !== bank.length || new Set(rows.map(r => r.qid)).size !== bank.length || bank.some(q => !rows.some(r => r.qid === q.id && r.questionSha === objectSha(q) && nonempty(r.observation)))) errors.push('CALIBRATION_BASELINE_FULL_FILE_COVERAGE_REQUIRED');
      }
    }
    if (!['PRESENT', 'ABSENT'].includes(lock.target?.baselineStatus)) errors.push('CALIBRATION_BASELINE_STATUS_REQUIRED');
    if (!nonempty(lock.readerId) || !nonempty(lock.readerSessionId)) errors.push('CALIBRATION_READER_REQUIRED');
    if (!Number.isFinite(Date.parse(lock.startedAt)) || !Number.isFinite(Date.parse(lock.frozenAt)) || Date.parse(lock.startedAt) > Date.parse(lock.frozenAt) || Date.parse(lock.frozenAt) > Date.now()) errors.push('CALIBRATION_TIME_INVALID');
    if (lock.sampleRole !== 'QUALITY_CALIBRATION_ONLY' || lock.sourceTruthPolicy !== 'TARGET_SOURCE_ONLY') errors.push('CALIBRATION_SOURCE_TRUTH_CONFLATION');
    if (requirePass && lock.status !== 'PASS') errors.push('REFERENCE_SAMPLE_LOCK_NOT_PASS');
    if (!Array.isArray(lock.samples) || ![2, 3].includes(lock.samples.length) || new Set(lock.samples.map(s => s.path)).size !== lock.samples.length) errors.push('CALIBRATION_REQUIRES_2_OR_3_DISTINCT_SAMPLES');
    const anchors = new Map();
    for (const sample of lock.samples || []) {
      const actual = readProductionSample(root, lock.mainCommit, sample.path);
      const { bank, ...summary } = actual;
      if (Object.keys(summary).some(key => objectSha(summary[key]) !== objectSha(sample[key] ?? null))) errors.push(`CALIBRATION_SAMPLE_STALE:${sample.path}`);
      if (manifest?.archiveRelativePath && sample.path === `archive/exams/${manifest.archiveRelativePath}` || lock.target?.baselineRef && path.resolve(root, sample.path) === lock.target.baselineRef.path) errors.push('TARGET_BASELINE_IS_NOT_CALIBRATION_SAMPLE');
      if (!nonempty(sample.selectionReason) || !nonempty(sample.qualityAcceptanceReason)) errors.push('CALIBRATION_SAMPLE_QUALITY_REASON_REQUIRED');
      for (const axis of CALIBRATION_AXES) if (sample.checkedAxes?.[axis]?.status !== 'PASS' || !nonempty(sample.checkedAxes?.[axis]?.observation)) errors.push(`CALIBRATION_AXIS_NOT_READ:${axis}`);
      const rows = sample.questionObservations;
      if (!Array.isArray(rows) || rows.length !== bank.length || new Set(rows.map(r => r.qid)).size !== bank.length) { errors.push('CALIBRATION_FULL_FILE_COVERAGE_REQUIRED'); continue; }
      for (const q of bank) {
        const row = rows.find(r => r.qid === q.id);
        if (!row || row.questionSha !== objectSha(q) || !nonempty(row.observation) || !nonempty(row.solutionExcerpt) || !String(q.solution || '').includes(row.solutionExcerpt)) errors.push(`CALIBRATION_QUESTION_NOT_READ:${sample.path}:q${q.id}`);
        else anchors.set(`${sample.path}|${q.id}`, q);
      }
    }
    const applicable = (key, q) => {
      if (!q) return false;
      if (key === 'highLevelNoLogicJump') return q.level === '상';
      if (key === 'subjectiveStepsSufficient') return /서술|서답|주관|subjective|essay/i.test(q.questionType || '');
      if (key === 'choiceConclusionNumber') return q.choices?.length > 0;
      if (['problemSolutionImagesSeparate', 'beneficialVisualsUsed', 'visualAltCaption', 'visualMathParity'].includes(key)) return Boolean(q.solutionImage || /<(?:svg|table|img)\b/i.test(q.solution || ''));
      return true;
    };
    for (const key of QUALITY_PROFILE_CHECKS) {
      const item = lock.productionQualityProfile?.[key];
      if (item?.status !== 'PASS' || !nonempty(item.minimumStandard) || !Array.isArray(item.sampleAnchors) || !item.sampleAnchors.length || item.sampleAnchors.some(anchor => !anchors.has(anchor))) errors.push(`PRODUCTION_QUALITY_PROFILE_INCOMPLETE:${key}`);
      else if (item.sampleAnchors.some(anchor => !applicable(key, anchors.get(anchor)))) errors.push(`PRODUCTION_QUALITY_PROFILE_ANCHOR_INAPPLICABLE:${key}`);
    }
  } catch (error) { errors.push(String(error.message || error)); }
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors: [...new Set(errors)] };
}

export function assertBuilderStart(root, manifest) {
  const rules = rulePreflight(root);
  if (rules.status !== 'PASS') throw new Error(`BUILDER_START_BLOCKED:SOURCE_PACK_DRIFT:${rules.errors.join(';')}`);
  const ref = manifest.referenceSampleLock;
  if (!ref || !sameRef(ref, localRef(path.resolve(root, ref.path)))) throw new Error('BUILDER_START_BLOCKED:REFERENCE_SAMPLE_LOCK_REQUIRED');
  const lock = JSON.parse(fs.readFileSync(ref.path, 'utf8'));
  const result = validateCalibration(root, lock, { manifest, requireLatestMain: true });
  if (result.status !== 'PASS') throw new Error(`BUILDER_START_BLOCKED:${result.errors.join(';')}`);
  return { referenceSampleLock: ref, mainCommit: lock.mainCommit, rulePackSha: lock.rulePackSha };
}
