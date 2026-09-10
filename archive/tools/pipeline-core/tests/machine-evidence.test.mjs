import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { fileRef, objectSha } from '../canonical.mjs';
import { profiles, runInputSha } from '../closure.mjs';
import { requiredAxesForQuestion } from '../projection.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { initWorkBatch, freezeWorkBatch, reserveWorkBatchReview, readWorkBatch } from '../work-batch.mjs';
import { collectMachineEvidence, isChoicesContractValid } from '../machine-evidence.mjs';
import { validateCurriculumBinding, validateStudentSerialization } from '../student-output.mjs';

const write = (root, relative, value) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
  return fileRef(root, relative);
};

function fixture(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-machine-evidence-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const uid = 'synthetic|1';
  const bank = q => `window.examTitle="synthetic";window.questionBank=${JSON.stringify([q])};`;
  const q = options.imageOnly
    ? { id: 1, content: '그림 속 보기를 보고 정답을 고른다.', answer: '2', solution: '그림 속 ②가 정답이다.', questionType: '객관식', image: 'assets/images/synthetic/q001.png', tags: ['객관식', '통이미지보기'], standardCourse: 'synthetic', standardUnitKey: 'SYN-01', standardUnit: 'Synthetic', standardUnitOrder: 1, subUnitKey: 'SYN-01-CORE', subUnit: 'Synthetic', layoutTag: 'grid', wide: false }
    : { id: 1, content: '2+2를 계산한다.', choices: ['3', '4'], answer: '2', solution: '2+2=4이다.' };
  const sourceRef = { ...write(root, 'source.js', bank(q)), role: 'source' };
  const candidateRef = { ...write(root, 'candidate.js', bank(q)), role: 'candidate' };
  const assetRef = options.imageOnly ? { ...write(root, q.image, 'synthetic image bytes'), role: 'asset' } : null;
  initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session' });
  const question = { questionUid: uid, sourceExamId: 'synthetic', sourceQuestionOrdinal: 1, examId: 'synthetic', sourcePath: sourceRef.path, candidatePath: candidateRef.path, qid: 1, requiredAxes: [], axisInputShas: {}, evidence: {}, visual: { requirement: 'VISUAL_EXEMPT', action: 'NONE', adjudicationId: 'synthetic-r1', adjudicationStatus: 'RESOLVED', exemptReason: 'NO_VISUAL_NEEDED', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false }, problemAssetPaths: assetRef ? [assetRef.path] : [], solutionAssetPaths: [] };
  const run = { schemaVersion: 'APMATH_PIPELINE_RUN_v2', pipeline: 'tag-enrichment', runId: 'run', revision: 1, workBatchId: 'job', builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', inputSha: null, inputs: [sourceRef, candidateRef, ...(assetRef ? [assetRef] : [])], evidence: [], questions: [question] };
  question.requiredAxes = requiredAxesForQuestion(profiles.pipelines[run.pipeline], question, run);
  run.inputSha = runInputSha(run);
  question.axisInputShas = computeV2AxisInputShas(root, run)[uid];
  const runRef = write(root, 'run.json', run);
  const writeRun = value => {
    const relative = `run-${Math.random().toString(16).slice(2)}.json`;
    return write(root, relative, value);
  };
  const bridged = () => {
    const result = collectMachineEvidence(root, runRef.path, { manifestOut: 'run.machine.json', evidenceDir: 'evidence/machine' });
    return { result, run: JSON.parse(fs.readFileSync(path.join(root, result.manifestRef.path), 'utf8')), ref: result.manifestRef };
  };
  return { root, run, runRef, bridged, writeRun };
}

test('choices contract keeps normal objective arrays valid', () => {
  assert.equal(isChoicesContractValid({ questionType: '객관식', choices: ['1', '2', '3', '4', '5'] }), true);
});

test('choices contract accepts an image-only objective with omitted choices', () => {
  assert.equal(isChoicesContractValid({ questionType: '객관식', image: 'assets/images/exam/q001.png', tags: ['객관식', '통이미지보기'] }), true);
  assert.equal(isChoicesContractValid({ questionType: '객관식', image: 'assets/images/exam/q001.png', tags: ['객관식', '통이미지보기'], choices: [] }), true);
});

test('choices contract rejects a non-array choices field', () => {
  assert.equal(isChoicesContractValid({ questionType: '객관식', choices: '1,2,3,4,5' }), false);
});

test('choices contract rejects unjustified objective choices omission', () => {
  assert.equal(isChoicesContractValid({ questionType: '객관식' }), false);
  assert.equal(isChoicesContractValid({ questionType: '객관식', image: 'assets/images/exam/q001.png', tags: ['객관식'] }), false);
  assert.equal(isChoicesContractValid({ questionType: '객관식', choices: [] }), false);
});

test('constructed responses with empty choices are valid while image-only objective omission stays explicit', () => {
  assert.equal(isChoicesContractValid({ questionType: '서술형', choices: [] }), true);
  assert.equal(isChoicesContractValid({ questionType: '단답형', choices: [] }), true);
  assert.equal(isChoicesContractValid({ questionType: '객관식', choices: [] }), false);
});

test('serialization and curriculum defects are deterministic machine findings', () => {
  assert.equal(validateStudentSerialization({ solution: '$x ge 0$, $a cdot b$' }).status, 'FAIL');
  assert.equal(validateStudentSerialization({ solution: '$x \\ge 0$, $a \\cdot b$' }).status, 'PASS');
  assert.equal(validateCurriculumBinding({ standardCourse: '공통수학1', standardUnitKey: 'H22-C-05', standardUnit: '이차방정식과 이차함수' }, { examId: '26_금당고_1학기_기말_고1_기출' }).status, 'PASS');
  assert.equal(validateCurriculumBinding({ standardCourse: '수학(상)', standardUnitKey: 'H15-SA-05', standardUnit: '이차방정식과 이차함수' }, { examId: '26_금당고_1학기_기말_고1_기출' }).status, 'FAIL');
});

test('machine bridge creates current STATIC and METADATA evidence and freeze succeeds', t => {
  const f = fixture(t);
  const out = f.bridged();
  assert.equal(out.result.status, 'MACHINE_EVIDENCE_READY');
  assert.equal(out.result.machineEvidenceCount, 2);
  assert.equal(out.run.evidence.length, 2);
  const state = freezeWorkBatch(f.root, 'job', [out.ref]);
  assert.equal(state.status, 'FROZEN');
  assert.equal(readWorkBatch(f.root, 'job').freezes.length, 1);
});

test('candidate quality failure is preserved as diagnostic evidence and does not prevent freeze', t => {
  const f = fixture(t);
  const source = fs.readFileSync(path.join(f.root, 'candidate.js'), 'utf8');
  const questions = JSON.parse(source.match(/window\.questionBank=(.*);\s*$/s)[1]);
  questions[0].content = '';
  fs.writeFileSync(path.join(f.root, 'candidate.js'), `window.examTitle="synthetic";window.questionBank=${JSON.stringify(questions)};`);
  f.run.inputs = f.run.inputs.map(ref => ref.path === 'candidate.js' ? { ...fileRef(f.root, 'candidate.js'), role: 'candidate' } : ref);
  f.run.inputSha = runInputSha(f.run);
  f.run.questions[0].axisInputShas = computeV2AxisInputShas(f.root, f.run)[f.run.questions[0].questionUid];
  const runRef = f.writeRun(f.run);
  const result = collectMachineEvidence(f.root, runRef.path, { manifestOut: 'diagnostic.machine.json', evidenceDir: 'evidence/diagnostic' });
  const machine = JSON.parse(fs.readFileSync(path.join(f.root, result.manifestRef.path), 'utf8'));
  const staticEvidence = machine.evidence.map(ref => JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8'))).find(e => e.axis === 'STATIC');
  assert.equal(staticEvidence.status, 'FAIL');
  assert.ok(staticEvidence.findings.some(finding => finding.code === 'MACHINE_CHECK_FAILED:STATIC:schema'));
  assert.equal(freezeWorkBatch(f.root, 'job', [result.manifestRef]).status, 'FROZEN');
  const reserved = reserveWorkBatchReview(f.root, 'job', {
    purpose: 'FINAL_AUDIT', callerRole: 'MAIN_WORKER', auditorId: 'auditor', auditorSessionId: 'auditor-session',
    parentLaunchId: null, recursiveSubagentLaunchCount: 0, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false,
    contexts: { U1: { sessionId: 'u1-session', contextId: 'u1-context' }, U2: { sessionId: 'u2-session', contextId: 'u2-context' }, U3: { sessionId: 'u3-session', contextId: 'u3-context' } }
  });
  assert.equal(reserved.launches[0].purpose, 'FINAL_AUDIT');
});

test('image-only objective machine bridge and freeze succeed without choices', t => {
  const f = fixture(t, { imageOnly: true });
  const out = f.bridged();
  assert.equal(out.result.status, 'MACHINE_EVIDENCE_READY');
  assert.equal(out.result.machineEvidenceCount, 2);
  assert.equal(freezeWorkBatch(f.root, 'job', [out.ref]).status, 'FROZEN');
});

test('machine-checks CLI emits a manifest usable by work-batch-freeze', t => {
  const f = fixture(t);
  const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../cli.mjs');
  const result = spawnSync(process.execPath, [cli, 'machine-checks', '--root', f.root, '--manifest', 'run.json', '--manifest-out', 'run.cli.machine.json', '--evidence-dir', 'evidence/cli'], { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'MACHINE_EVIDENCE_READY');
  const manifestRef = fileRef(f.root, report.manifestRef.path);
  assert.equal(freezeWorkBatch(f.root, 'job', [manifestRef]).status, 'FROZEN');
});

for (const axis of ['STATIC', 'METADATA']) test(`${axis} evidence missing keeps freeze on HOLD`, t => {
  const f = fixture(t);
  const out = f.bridged();
  const removed = out.run.evidence.find(ref => JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8')).axis === axis);
  out.run.evidence = out.run.evidence.filter(ref => ref.path !== removed.path);
  delete out.run.questions[0].evidence[axis];
  const badRef = f.writeRun(out.run);
  assert.throws(() => freezeWorkBatch(f.root, 'job', [badRef]), /WHOLE_JOB_MACHINE_CHECK_REQUIRED/);
});

test('stale axisInputSha keeps freeze on HOLD', t => {
  const f = fixture(t);
  const out = f.bridged();
  const ref = out.run.evidence.find(item => JSON.parse(fs.readFileSync(path.join(f.root, item.path), 'utf8')).axis === 'STATIC');
  const evidence = JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8'));
  evidence.axisInputSha = objectSha({ stale: true });
  const fakeRef = write(f.root, 'evidence/stale-static.json', evidence);
  out.run.evidence[out.run.evidence.findIndex(item => item.path === ref.path)] = fakeRef;
  const badRef = f.writeRun(out.run);
  assert.throws(() => freezeWorkBatch(f.root, 'job', [badRef]), /WHOLE_JOB_MACHINE_CHECK_REQUIRED/);
});

for (const field of ['runId', 'revision', 'inputSha']) test(`wrong ${field} keeps freeze on HOLD`, t => {
  const f = fixture(t);
  const out = f.bridged();
  const ref = out.run.evidence.find(item => JSON.parse(fs.readFileSync(path.join(f.root, item.path), 'utf8')).axis === 'METADATA');
  const evidence = JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8'));
  evidence[field] = field === 'revision' ? 2 : field === 'runId' ? 'other-run' : objectSha({ other: true });
  const fakeRef = write(f.root, `evidence/wrong-${field}.json`, evidence);
  out.run.evidence[out.run.evidence.findIndex(item => item.path === ref.path)] = fakeRef;
  const badRef = f.writeRun(out.run);
  assert.throws(() => freezeWorkBatch(f.root, 'job', [badRef]), /WHOLE_JOB_MACHINE_CHECK_REQUIRED/);
});

test('auditor evidence cannot replace the machine collector axis', t => {
  const f = fixture(t);
  const out = f.bridged();
  const ref = out.run.evidence.find(item => JSON.parse(fs.readFileSync(path.join(f.root, item.path), 'utf8')).axis === 'STATIC');
  const evidence = JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8'));
  evidence.auditorPrincipalType = 'HUMAN';
  evidence.reviewerId = 'auditor';
  const fakeRef = write(f.root, 'evidence/fake-auditor-static.json', evidence);
  out.run.evidence[out.run.evidence.findIndex(item => item.path === ref.path)] = fakeRef;
  const badRef = f.writeRun(out.run);
  assert.throws(() => freezeWorkBatch(f.root, 'job', [badRef]), /WHOLE_JOB_MACHINE_CHECK_REQUIRED/);
});

test('H15-GV-08 has a canonical and compiled parent entry but no unsupported child subunit', () => {
  const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  const canonicalPath = path.join(repository, 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md');
  const compiledPath = path.join(repository, 'archive/data/master_tables/js_archive_tag_master.json');
  const canonical = fs.readFileSync(canonicalPath, 'utf8');
  assert.match(canonical, /^\| H15-GV-08 \| 공간도형 \| 8 \|$/m);
  const compiled = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
  const parent = compiled.find(row => row.key === 'H15-GV-08' && row.keyType === 'standardUnitKey');
  assert.equal(parent?.labelKo, '공간도형');
  assert.equal(compiled.filter(row => row.keyType === 'subUnitKey' && row.standardUnitKey === 'H15-GV-08').length, 0);
});
