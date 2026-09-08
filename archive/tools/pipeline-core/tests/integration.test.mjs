import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fixture } from './fixture.mjs';
import { closureFromFile, requireProductionClosure, reviewedMutationPlan } from '../integration.mjs';
import { prepareDraft } from '../prepare.mjs';
import { auditRun } from '../closure.mjs';
import { createRenderReview } from '../render.mjs';
import { runtimeDependencyBundle } from '../runtime.mjs';

test('runtime bundle binds dynamic same-origin metadata and MathJax loader resources', () => {
  const bundle = runtimeDependencyBundle(process.cwd());
  const paths = new Set(bundle.localFiles.map(ref => ref.path));
  assert.equal(paths.has('archive/data/question_metadata.json'), true);
  assert.equal(paths.has('archive/vendor/mathjax/input/tex/extensions/boldsymbol.js'), true);
});

test('a valid closure for a different native scope does not authorize legacy finalizers', () => {
  const f = fixture(); try {
    const manifest = path.join(f.root, 'run.json'); fs.writeFileSync(manifest, JSON.stringify(f.run));
    assert.equal(closureFromFile(f.root, 'logic-visual', manifest, [], [{ sourcePath: 'source.js', qid: 1 }]).status, 'PASS');
    assert.equal(closureFromFile(f.root, 'logic-visual', manifest, [], [{ sourcePath: 'source.js', qid: 2 }]).status, 'BLOCKED');
  } finally { f.cleanup(); }
});
test('fresh preparation emits blind bundles, never fabricated review PASS', () => {
  const f = fixture(); try {
    const repository = process.cwd();
    f.write('archive/assets/visual.svg', fs.readFileSync(path.join(f.root, 'assets/visual.svg')));
    const sourceVisual = f.write('archive/assets/source.svg', '<svg xmlns="http://www.w3.org/2000/svg"><title>source-only</title></svg>');
    // Source and candidate assets must not be interchanged in the blind bundle.
    for (const [file, image] of [['source.js', 'assets/source.svg'], ['candidate.js', 'assets/visual.svg']]) {
      const original = fs.readFileSync(path.join(f.root, file), 'utf8');
      f.write(file, `${original}\nwindow.questionBank[0].image=${JSON.stringify(image)};`);
    }
    for (const ref of runtimeDependencyBundle(repository).localFiles) f.write(ref.path, fs.readFileSync(path.join(repository, ref.path)));
    for (const p of ['archive/tools/pipeline-core/visual-contract.json', 'archive/tools/pipeline-core/closure.mjs', 'archive/tools/pipeline-core/generator.py']) f.write(p, fs.readFileSync(path.join(repository, p)));
    const result = prepareDraft(f.root, { pipeline: 'logic-visual', runId: 'new-run', sourcePath: 'source.js', candidatePath: 'candidate.js', workdir: 'work/new-run' });
    assert.equal(result.status, 'DRAFT_NOT_EXECUTABLE');
    const run = JSON.parse(fs.readFileSync(path.join(f.root, result.manifestPath)));
    assert.equal(auditRun(f.root, run).status, 'BLOCKED');
    const v1 = JSON.parse(fs.readFileSync(path.join(f.root, 'work/new-run/bundles/q1-v1.json')));
    const v2 = JSON.parse(fs.readFileSync(path.join(f.root, 'work/new-run/bundles/q1-v2.json')));
    assert.deepEqual(v1.problemAssets, [sourceVisual]);
    assert.equal(v2.artifact.path, 'archive/assets/visual.svg');
    for (const key of ['answer', 'solution', 'solutionImage', 'expectedFact', 'previousVerdict']) assert.equal(key in v1, false);
    for (const key of ['content', 'choices', 'answer', 'solution', 'expectedFact', 'alt', 'caption']) assert.equal(key in v2, false);
    assert.throws(() => prepareDraft(f.root, { pipeline: 'logic-visual', runId: 'new-run', sourcePath: 'source.js', candidatePath: 'candidate.js', workdir: 'work/new-run' }), /NEW_RUN_DIRECTORY_REQUIRED/);
  } finally { f.cleanup(); }
});
for (const file of ['archive/tools/geometry-equation/create-mother-final-seal-s15.mjs', 'archive/tools/high1-svg-audit/finalize-line-report.mjs', 'archive/tools/logic-visual-audit/build-phase2-2022-set-pilot-final-report.mjs']) test(`native finalizer blocks before writing without current closure: ${file}`, () => {
  const run = spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 15000, maxBuffer: 2_000_000 });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /COMMON_PIPELINE_CLOSURE_BLOCKED/);
});
test('metadata-only cannot silently change solution or layout', () => {
  const f = fixture('tag-enrichment', { visual: false }); try {
    f.write('candidate.js', 'window.examTitle="fixture";window.questionBank=[{id:1,content:"changed",choices:[],answer:"1",solution:"changed",wide:true}];');
    assert.equal(auditRun(f.root, f.run).status, 'BLOCKED');
  } finally { f.cleanup(); }
});
test('NO_VISUAL still requires an independent V1 necessity decision', () => {
  const f = fixture('logic-visual', { visual: false }); try {
    assert.equal(auditRun(f.root, f.run).status, 'PASS');
    delete f.run.questions[0].evidence.v1;
    assert.equal(auditRun(f.root, f.run).status, 'BLOCKED');
  } finally { f.cleanup(); }
});
test('metadata mutation must equal the reviewed candidate bytes', () => {
  const f = fixture('intelligence', { visual: false }); try {
    const file = path.join(f.root, 'run.json'); fs.writeFileSync(file, JSON.stringify(f.run));
    const plan = reviewedMutationPlan(f.root, 'intelligence', [{ sourcePath: 'source.js', qid: 1 }], ['node', 'test', '--closure-manifest', file]);
    assert.doesNotThrow(() => plan.assertCandidateBytes('source.js', fs.readFileSync(path.join(f.root, 'candidate.js'), 'utf8')));
    assert.throws(() => plan.assertCandidateBytes('source.js', 'unreviewed changes'), /PLANNED_MUTATION_DIFFERS/);
  } finally { f.cleanup(); }
});
test('a quality PASS cannot authorize production while authority is false', () => {
  const f = fixture('past-exam', { visual: true }); try {
    const file = path.join(f.root, 'run.json'); fs.writeFileSync(file, JSON.stringify(f.run));
    assert.equal(closureFromFile(f.root, 'past-exam', file).status, 'PASS');
    assert.throws(() => requireProductionClosure(f.root, 'past-exam', ['node', 'test', '--closure-manifest', file]), /PRODUCTION_AUTHORITY_BLOCKED/);
  } finally { f.cleanup(); }
});
test('production authority binds the frozen render reviews and runtime bundle', () => {
  const f = fixture('past-exam', { visual: true }); try {
    const file = path.join(f.root, 'run.json');
    const reviews = f.run.evidence.map(ref => JSON.parse(fs.readFileSync(path.join(f.root, ref.path), 'utf8'))).filter(e => e.axis === 'render').map(e => e.evidenceId).sort();
    f.run.productionAuthorization = { status: 'APPROVED', authorityId: 'release-manager', approvedAt: '2026-09-06T03:00:00Z', releaseInputSha: f.run.inputSha, runtimeBundleSha: f.run.renderRuntime.bundleSha, renderReviewEvidenceIds: reviews };
    fs.writeFileSync(file, JSON.stringify(f.run));
    assert.equal(closureFromFile(f.root, 'past-exam', file).productionAuthorized, true);
    assert.doesNotThrow(() => requireProductionClosure(f.root, 'past-exam', ['node', 'test', '--closure-manifest', file]));
    f.run.productionAuthorization.runtimeBundleSha = `sha256:${'0'.repeat(64)}`;
    fs.writeFileSync(file, JSON.stringify(f.run));
    assert.equal(closureFromFile(f.root, 'past-exam', file).productionAuthorized, false);
  } finally { f.cleanup(); }
});
test('render reviewer output is derived from a frozen capture ref', () => {
  const f = fixture('logic-visual', { visual: true }); try {
    const captureRef = f.run.evidence.find(ref => ref.path.endsWith('solution-mobile-capture.json'));
    const capture = JSON.parse(fs.readFileSync(path.join(f.root, captureRef.path), 'utf8'));
    const witness = capture.payload.itemWitnesses[0];
    const review = createRenderReview(f.root, f.run, captureRef, { reviewerId: 'independent-render-reviewer', reviewSessionId: 'independent-render-session', reviewerModelOrAgent: 'TEST_ONLY', startedAt: '2026-09-06T02:00:00Z', checks: { clipping: 'PASS', overflow: 'PASS', readability: 'PASS' }, itemReviews: [{ questionUid: witness.questionUid, screenshotSha: witness.screenshot.sha256, status: 'PASS' }], findings: [] });
    assert.equal(review.axis, 'render');
    assert.equal(review.payload.captureEvidenceSha, captureRef.sha256);
    assert.throws(() => createRenderReview(f.root, f.run, captureRef, { reviewerId: capture.reviewerId, reviewSessionId: capture.reviewSessionId, reviewerModelOrAgent: 'TEST_ONLY', startedAt: '2026-09-06T02:00:00Z', checks: { clipping: 'PASS', overflow: 'PASS', readability: 'PASS' }, itemReviews: [{ questionUid: witness.questionUid, screenshotSha: witness.screenshot.sha256, status: 'PASS' }] }), /NOT_INDEPENDENT/);
  } finally { f.cleanup(); }
});
