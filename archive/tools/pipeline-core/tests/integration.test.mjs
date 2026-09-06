import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fixture } from './fixture.mjs';
import { closureFromFile, reviewedMutationPlan } from '../integration.mjs';
import { prepareDraft } from '../prepare.mjs';
import { auditRun } from '../closure.mjs';

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
    for (const p of ['archive/engine.html', 'archive/tools/pipeline-core/visual-contract.json', 'archive/tools/pipeline-core/closure.mjs', 'archive/tools/pipeline-core/generator.py']) f.write(p, fs.readFileSync(path.join(repository, p)));
    const result = prepareDraft(f.root, { pipeline: 'logic-visual', runId: 'new-run', sourcePath: 'source.js', candidatePath: 'candidate.js', workdir: 'work/new-run' });
    assert.equal(result.status, 'DRAFT_NOT_EXECUTABLE');
    const run = JSON.parse(fs.readFileSync(path.join(f.root, result.manifestPath)));
    assert.equal(auditRun(f.root, run).status, 'BLOCKED');
    const v1 = JSON.parse(fs.readFileSync(path.join(f.root, 'work/new-run/bundles/q1-v1.json')));
    const v2 = JSON.parse(fs.readFileSync(path.join(f.root, 'work/new-run/bundles/q1-v2.json')));
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
