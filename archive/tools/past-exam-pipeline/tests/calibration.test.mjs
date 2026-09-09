import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareCalibration, validateCalibration, assertBuilderStart, QUALITY_PROFILE_CHECKS, CALIBRATION_AXES } from '../lib/calibration.mjs';
import { bytesSha } from '../../pipeline-core/canonical.mjs';
import { runOneExam } from '../run-one-exam.mjs';
import { fileRef } from '../../pipeline-core/canonical.mjs';
import { validatePastExamCompletion } from '../../pipeline-core/past-exam-contract.mjs';
import { prepareDraft } from '../../pipeline-core/prepare.mjs';
import { rulePreflight } from '../../pipeline-core/rulepack.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'past-calibration-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, data) => { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data)); return file; };
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  write('docs/rules/rule.md', 'synthetic test rule');
  const b = fs.readFileSync(path.join(root, 'docs/rules/rule.md'));
  write('docs/rules/MANIFEST.md', `- rule.md | ${b.length} bytes | sha256 ${bytesSha(b).slice(7)}\n`);
  const samplePaths = ['archive/exams/original/high/h1/1mid/one.js', 'archive/exams/original/high/h1/1mid/two.js'];
  for (const file of samplePaths) write(file, `window.examTitle=${JSON.stringify(file)};window.questionBank=${JSON.stringify([1, 2].map(id => ({ id, level: id === 1 ? '상' : '중', questionType: id === 1 ? '서술형' : '객관식', solutionImage: id === 1 ? 'solution.svg' : undefined, standardCourse: '공통수학1', content: 'x+1=2', choices: id === 1 ? [] : ['1', '2'], answer: '1', solution: '양변에서 1을 빼면 x=1이다.' })))};`);
  git(['init', '-b', 'main']); git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'synthetic']);
  git(['remote', 'add', 'origin', root]); git(['update-ref', 'refs/remotes/origin/main', 'HEAD']);
  const manifest = { examId: 'target', pdfPath: write('source.pdf', 'synthetic source'), archiveRelativePath: 'original/high/h1/1mid/target.js' };
  const lock = prepareCalibration(root, manifest, samplePaths);
  lock.readerId = 'synthetic-builder'; lock.readerSessionId = 'synthetic-session'; lock.startedAt = '2026-01-01T00:00:00Z'; lock.frozenAt = '2026-01-01T00:01:00Z'; lock.status = 'PASS';
  for (const sample of lock.samples) {
    sample.selectionReason = '동일 교육과정 synthetic sample'; sample.qualityAcceptanceReason = 'Test-only acceptance';
    for (const axis of CALIBRATION_AXES) sample.checkedAxes[axis] = { status: 'PASS', observation: `Test observation ${axis}` };
    for (const q of sample.questionObservations) { q.solutionExcerpt = '양변에서 1을 빼면'; q.observation = `Test question ${q.qid}`; }
  }
  for (const key of QUALITY_PROFILE_CHECKS) lock.productionQualityProfile[key] = { status: 'PASS', minimumStandard: `Test minimum ${key}`, sampleAnchors: [`${samplePaths[0]}|${key === 'choiceConclusionNumber' ? 2 : 1}`] };
  return { root, lock, manifest, write, git };
}

test('fresh main, complete sample coverage and anchored quality profile permit builder start', t => {
  const f = fixture(t);
  assert.equal(validateCalibration(f.root, f.lock, { manifest: f.manifest, requireLatestMain: true }).status, 'PASS');
  const file = f.write('lock.json', f.lock), b = fs.readFileSync(file);
  assert.doesNotThrow(() => assertBuilderStart(f.root, { ...f.manifest, referenceSampleLock: { path: file, bytes: b.length, sha256: bytesSha(b) } }));
});

for (const [name, mutate] of [
  ['missing last question', l => l.samples[0].questionObservations.pop()],
  ['PASS-only calibration', l => { delete l.productionQualityProfile; }],
  ['one sample', l => l.samples.pop()],
  ['duplicate samples', l => { l.samples[1] = structuredClone(l.samples[0]); }],
  ['wrong full-file SHA', l => { l.samples[0].rawSha256 = 'sha256:' + '0'.repeat(64); }],
  ['invented solution quote', l => { l.samples[0].questionObservations[0].solutionExcerpt = 'not present'; }],
  ['unread solutionVisual axis', l => { l.samples[0].checkedAxes.solutionVisual.status = 'NOT_TESTED'; }],
  ['sample used as source truth', l => { l.sourceTruthPolicy = 'SAMPLE_SOURCE'; }],
  ['baseline not read', l => { l.target.baselineStatus = 'PRESENT'; }],
  ['target mismatch', l => { l.target.examId = 'other'; }]
]) test(`builder start rejects ${name}`, t => {
  const f = fixture(t); mutate(f.lock);
  assert.equal(validateCalibration(f.root, f.lock, { manifest: f.manifest }).status, 'BLOCKED');
});

test('updated main and changed target source require fresh calibration', t => {
  const f = fixture(t);
  f.write('new.txt', 'next main'); f.git(['add', 'new.txt']); f.git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'new main']);
  assert.equal(validateCalibration(f.root, f.lock, { manifest: f.manifest, requireLatestMain: true }).status, 'BLOCKED');
  // Existing frozen jobs verify their pinned main commit without demanding a new launch.
  assert.equal(validateCalibration(f.root, f.lock, { manifest: f.manifest }).status, 'PASS');
  f.write('source.pdf', 'changed bytes');
  assert.equal(validateCalibration(f.root, f.lock, { manifest: f.manifest }).status, 'BLOCKED');
});

test('runOneExam stops before creating a candidate directory without calibration', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'past-start-gate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const out = path.join(root, 'must-not-exist');
  await assert.rejects(runOneExam({ generatedRoot: root, archiveRoot: root }, { examId: 'target', outputDir: out }), /BUILDER_START_BLOCKED/);
  assert.equal(fs.existsSync(out), false);
});

test('V3 completion binds calibration, project geometry pin and exact source inventory', t => {
  const f = fixture(t);
  f.write('lock.json', f.lock);
  const contractPath = 'archive/tools/past-exam-pipeline/completion-contract.json';
  const contract = JSON.parse(fs.readFileSync(new URL('../completion-contract.json', import.meta.url), 'utf8'));
  f.write(contractPath, contract);
  const policyDestination = path.join(f.root, contract.geometryPolicyRef.path);
  fs.mkdirSync(path.dirname(policyDestination), { recursive: true });
  fs.copyFileSync(new URL('../../../../' + contract.geometryPolicyRef.path, import.meta.url), policyDestination);
  const inventoryRef = fileRef(f.root, path.relative(f.root, f.write('inventory.json', { status: 'SOURCE_INVENTORY_FROZEN', examId: 'target', questions: [{ sourceIdentityKey: 'target-source|1', disposition: 'INCLUDED' }] })));
  const lockRef = fileRef(f.root, 'lock.json');
  const config = { schemaVersion: 'PAST_EXAM_V3_PROJECT_CONFIG', referenceSampleLockRef: lockRef, geometryPolicyRef: contract.geometryPolicyRef, sourceInventorySha: inventoryRef.sha256 };
  f.write('project.json', config);
  const run = { schemaVersion: 'APMATH_PIPELINE_RUN_v2', pipeline: 'past-exam', builderId: f.lock.readerId, builderSessionId: f.lock.readerSessionId, publicationIntent: 'FULL_EXAM', pastExamCompletionRef: fileRef(f.root, 'project.json'), questions: [{ examId: 'target', sourceIdentityKey: 'target-source|1' }], inputs: [{ ...fileRef(f.root, 'project.json'), role: 'spec' }, { ...lockRef, role: 'spec' }, { ...fileRef(f.root, contractPath), role: 'spec' }, { ...inventoryRef, role: 'dependency' }, { ...contract.geometryPolicyRef, role: 'rule' }] };
  assert.deepEqual(validatePastExamCompletion(f.root, run), []);
  assert.ok(validatePastExamCompletion(f.root, { ...run, schemaVersion: 'APMATH_PIPELINE_RUN_v1' }).includes('PAST_EXAM_V3_REQUIRES_CORE_V2'));
  assert.ok(validatePastExamCompletion(f.root, { ...run, builderId: 'other' }).includes('CALIBRATION_READER_BUILDER_MISMATCH'));
  assert.ok(validatePastExamCompletion(f.root, { ...run, questions: [] }).includes('PAST_EXAM_SOURCE_INVENTORY_COVERAGE_FAIL'));
  assert.ok(validatePastExamCompletion(f.root, { ...run, publicationIntent: 'QUESTION_ONLY' }).includes('PAST_EXAM_FULL_EXAM_CLOSURE_REQUIRED'));
  const missingPolicy = { ...run, inputs: run.inputs.filter(r => r.role !== 'rule') };
  assert.ok(validatePastExamCompletion(f.root, missingPolicy).includes('GEOMETRY_POLICY_APPLIED_REF_REQUIRED'));
});

test('existing target must be read in full; the frozen baseline survives later promotion', t => {
  const f = fixture(t);
  const baseline = f.write('archive/exams/original/high/h1/1mid/target.js', 'window.examTitle="target";window.questionBank=[{id:1,solution:"old"},{id:2,solution:"old"}];');
  const draft = prepareCalibration(f.root, f.manifest, f.lock.samples.map(s => s.path));
  Object.assign(draft, { readerId: f.lock.readerId, readerSessionId: f.lock.readerSessionId, startedAt: f.lock.startedAt, frozenAt: f.lock.frozenAt, status: 'PASS', samples: f.lock.samples, productionQualityProfile: f.lock.productionQualityProfile, baselineObservation: '기존 identity 보존; 기존 해설은 품질 기준이 아님' });
  assert.equal(validateCalibration(f.root, draft, { manifest: f.manifest }).status, 'BLOCKED');
  for (const row of draft.baselineQuestionObservations) row.observation = `기존 q${row.qid} 전체 필드 확인`;
  assert.equal(validateCalibration(f.root, draft, { manifest: f.manifest }).status, 'PASS');
  fs.writeFileSync(baseline, 'promoted bytes');
  assert.equal(validateCalibration(f.root, draft).status, 'PASS');
  assert.equal(validateCalibration(f.root, draft, { manifest: f.manifest }).status, 'BLOCKED');
});

test('complete preparation preserves page source evidence and emits only unreviewed V3 drafts', t => {
  const f = fixture(t);
  const contractPath = 'archive/tools/past-exam-pipeline/completion-contract.json';
  const contract = JSON.parse(fs.readFileSync(new URL('../completion-contract.json', import.meta.url), 'utf8'));
  for (const relative of [contractPath, contract.geometryPolicyRef.path, 'archive/tools/pipeline-core/visual-contract.json', 'archive/tools/pipeline-core/closure.mjs', 'archive/tools/pipeline-core/generator.py']) {
    const dest = path.join(f.root, relative); fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(new URL('../../../../' + relative, import.meta.url), dest);
  }
  const policy = contract.geometryPolicyRef;
  fs.appendFileSync(path.join(f.root, 'docs/rules/MANIFEST.md'), `- ${policy.path.replace('docs/rules/', '')} | ${policy.bytes} bytes | sha256 ${policy.sha256.slice(7)}\n`);
  f.lock.rulePackSha = rulePreflight(f.root).rulePackSha;
  f.write('lock.json', f.lock);
  f.manifest.referenceSampleLock = fileRef(f.root, 'lock.json');
  f.manifest.referenceSampleLock.path = path.join(f.root, 'lock.json');
  const sourceSha = f.lock.target.sourceFiles[0].sha256;
  const sourceIdentityKey = `${sourceSha}|1`;
  const q = { id: 1, content: 'x+1=2', choices: ['1', '2'], answer: '1', solution: '양변에서 1을 빼면 x=1이다.', sourceIdentityKey, sourceDocumentSha256: sourceSha, sourceQuestionNo: '1', sourcePageNo: 1, sourcePageEvidencePaths: ['pages/page_p001.png'], sourceEvidencePath: 'pages/page_p001.png' };
  q.image = 'assets/images/target/q001_visual.png';
  f.write('staged/' + q.image, 'synthetic problem image');
  f.write('staged/source.js', `window.examTitle="target";window.questionBank=${JSON.stringify([{ ...q, answer: '', solution: '' }])};`);
  q.solutionImage = 'assets/images/target/q01-solution.svg';
  q.solutionImageAlt = '방정식 해설'; q.solutionImageCaption = '계산 과정'; q.solutionImageSize = 'medium';
  f.write('staged/' + q.solutionImage, '<svg xmlns="http://www.w3.org/2000/svg"/>');
  f.write('staged/candidate.js', `window.examTitle="target";window.questionBank=${JSON.stringify([q])};`);
  f.write('staged/pages/page_p001.png', 'synthetic page bytes');
  f.write('staged/reports/source_inventory.json', { status: 'SOURCE_INVENTORY_FROZEN', examId: 'target', questions: [{ ...q, disposition: 'INCLUDED' }] });
  f.manifest.sourceInventoryPath = 'staged/reports/source_inventory.json';
  f.write('manifest.json', f.manifest);
  f.write('archive/engine.html', '<!doctype html><title>SYNTHETIC</title>');
  f.write('registry.json', { entries: [{ canonicalSourceExamId: 'target', sourceIdentityKey: sourceSha, status: 'ACTIVE', sourceExamId: 'target', questionUidV2: 'target|1', sourceQuestionOrdinal: 1, sourcePath: 'staged/source.js', sourceSha256: fileRef(f.root, 'staged/source.js').sha256 }] });
  const result = prepareDraft(f.root, { pipeline: 'past-exam', runId: 'test', sourcePath: 'staged/source.js', candidatePath: 'staged/candidate.js', workdir: 'new-run', schemaVersion: 'APMATH_PIPELINE_RUN_v2', builderId: f.lock.readerId, builderSessionId: f.lock.readerSessionId, builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', workBatchId: 'test-job', pastExamManifestPath: 'manifest.json', sourceExamIdRegistryRef: fileRef(f.root, 'registry.json') });
  assert.equal(result.status, 'DRAFT_NOT_EXECUTABLE');
  const run = JSON.parse(fs.readFileSync(path.join(f.root, result.manifestPath), 'utf8'));
  assert.equal(run.publicationIntent, 'FULL_EXAM');
  assert.equal(run.assetRoot, 'staged');
  assert.deepEqual(run.questions[0].solutionAssetPaths, ['staged/assets/images/target/q01-solution.svg']);
  assert.equal(run.questions[0].sourceIdentityKey, sourceIdentityKey);
  assert.ok(run.sourceAuthority.sourceTruthRefs.some(ref => ref.path === 'staged/pages/page_p001.png'));
  assert.deepEqual(validatePastExamCompletion(f.root, run), []);
  assert.deepEqual(run.evidence, []);
  const quality = JSON.parse(fs.readFileSync(path.join(f.root, 'new-run/review-drafts/q1-quality.json'), 'utf8'));
  assert.equal(quality.status, 'NOT_TESTED');
});

test('V3 crop links are canonical in staging and never imply semantic review PASS', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'past-canonical-crop-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const script = `import importlib.util,json,sys
from pathlib import Path
from PIL import Image
spec=importlib.util.spec_from_file_location('scan',sys.argv[1]); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
root=Path(sys.argv[2]); page=root/'page.png'; Image.new('RGB',(400,400),'white').save(page)
q={'id':1,'hasVisualAsset':True,'fullPageImagePath':str(page),'visualAssetBBoxOnPage':{'x1':30,'y1':30,'x2':130,'y2':130}}
result=m.crop_visual_assets(root,[q],'synthetic-exam')
assert result[0]['status']=='asset_crop_success',result
assert q['image']=='assets/images/synthetic-exam/q001_visual.png'
assert (root/q['image']).exists()
assert q['visualAssetProvenance']['checks']['CROP_PURITY'] is False
try: m.crop_visual_assets(root,[q],'../escape')
except ValueError: pass
else: raise AssertionError('unsafe exam id accepted')
print('CANONICAL_STAGED_CROP_PASS')`;
  const out = execFileSync('python', ['-X', 'utf8', '-c', script, fileURLToPath(new URL('../helpers/scanned_exam_pipeline.py', import.meta.url)), root], { encoding: 'utf8' });
  assert.match(out, /CANONICAL_STAGED_CROP_PASS/);
});

for (const key of ['highLevelNoLogicJump', 'subjectiveStepsSufficient', 'problemSolutionImagesSeparate', 'beneficialVisualsUsed', 'visualAltCaption', 'visualMathParity']) test(`quality profile rejects inapplicable anchor: ${key}`, t => {
  const f = fixture(t);
  assert.equal(validateCalibration(f.root, f.lock).status, 'PASS');
  f.lock.productionQualityProfile[key].sampleAnchors = [`${f.lock.samples[0].path}|2`];
  const report = validateCalibration(f.root, f.lock);
  assert.equal(report.status, 'BLOCKED');
  assert.ok(report.errors.includes(`PRODUCTION_QUALITY_PROFILE_ANCHOR_INAPPLICABLE:${key}`));
});

test('one ordinary question cannot pass every quality profile', t => {
  const f = fixture(t);
  for (const item of Object.values(f.lock.productionQualityProfile)) item.sampleAnchors = [`${f.lock.samples[0].path}|2`];
  assert.equal(validateCalibration(f.root, f.lock).status, 'BLOCKED');
});
