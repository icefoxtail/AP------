import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { fileRef } from '../canonical.mjs';
import { visualAssetPayload } from '../native-visual.mjs';
import { loadCandidateReviewContext, visualApplicabilityForQuestion } from '../review-isolation-runner.mjs';
import { buildNativeTurnInput } from '../../../../alive/runtime/provider-bridge/codex-appserver-adapter.mjs';
import { packetInputs } from '../../past-exam-pipeline/resume-past-exam.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const readBank = relative => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, relative), 'utf8'), c); return JSON.parse(JSON.stringify(c.window)); };
const samples = [
  ['original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js', [1, 2, 16]],
  ['original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js', [11]],
  ['original/high/h1/2mid/21_강남여고_2학기_중간_고1_기출.js', [19]],
  ['original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js', [11]],
];

test('real production DB/index, source and candidate image lanes preserve choices and SVG/raster bytes', () => {
  const db = readBank('archive/db.js').mainDB.exams;
  const index = readBank('archive/question-index.js').questionIndex;
  for (const [relative, ids] of samples) {
    const file = `archive/exams/${relative}`;
    const bank = readBank(file).questionBank;
    assert.ok(db.some(row => row.file === relative));
    assert.equal(index.filter(row => row.sourceFile === relative).length, bank.length);
    for (const id of ids) {
      const q = bank.find(q => q.id === id), uid = `${relative}|${id}`;
      const inputs = [{ ...fileRef(root, file), role: 'source' }, { ...fileRef(root, file), role: 'candidate' }];
      for (const p of new Set([q.image, q.solutionImage].filter(Boolean))) inputs.push({ ...fileRef(root, `archive/${p}`), role: 'asset' });
      const run = { inputs, questions: [{ qid: id, questionUid: uid, sourcePath: file, candidatePath: file, problemAssetPaths: q.image ? [`archive/${q.image}`] : [], solutionAssetPaths: q.solutionImage ? [`archive/${q.solutionImage}`] : [] }] };
      const context = loadCandidateReviewContext(root, run)[uid];
      assert.deepEqual(context.currentQuestion.choices, q.choices || []);
      assert.equal(context.currentSolution, q.solution);
      const payload = { ...context, questionUid: uid, renderWitnesses: [] };
      const native = buildNativeTurnInput('review', { phase: 'U3', payload });
      assert.equal(native.filter(x => x.type === 'image').length, q.image ? 1 : 0);
      for (const ref of inputs.filter(x => x.role === 'asset')) {
        const asset = visualAssetPayload(root, ref);
        assert.match(asset.dataUrl, /^data:image\/png;base64,/);
        assert.equal(asset.sha256, ref.sha256);
        if (ref.path.endsWith('.svg')) assert.ok(asset.nativeSha256 && asset.nativeSha256 !== ref.sha256);
        const input = buildNativeTurnInput('review', { phase: 'U2', payload: { artifact: { assetRefs: [asset] } } });
        assert.equal(typeof input[1].url, 'string');
        assert.equal(input[1].url, asset.dataUrl);
      }
      if (q.image) assert.equal(visualApplicabilityForQuestion(q).status, 'VISUAL_REQUIRED');
      if (q.solutionImage) assert.equal(visualApplicabilityForQuestion(q).artifactRequired, true);
    }
  }
});

test('20-question freeze projects only targeted subset in every phase', t => {
  const f = recoveryFixture(t, { questionCount: 20 });
  const { run, ref } = f.makeRun(1);
  const targets = run.questions.map(q => ({ runId: run.runId, questionUid: q.questionUid }));
  const state = { freezes: [{ freezeSha: 'freeze', runRefs: [ref], targets }] };
  const scope = [targets[4], targets[7], targets[18]];
  const { byPhase } = packetInputs(f.root, state, { freezeSha: 'freeze', scope });
  for (const rows of Object.values(byPhase)) assert.deepEqual(new Set(rows.map(row => row.questionUid)), new Set(scope.map(t => t.questionUid)));
});

test('actual final native envelope carries render screenshots only in U3, without wrapping image objects', () => {
  const image = { dataUrl: 'data:image/png;base64,AA==' };
  const row = { renderWitnesses: [{ screenshot: image }], artifact: { assetRefs: [image] } };
  assert.equal(buildNativeTurnInput('review', { phase: 'U1', payload: row }).length, 1);
  assert.equal(buildNativeTurnInput('review', { phase: 'U2', payload: row })[1].url, image.dataUrl);
  assert.equal(buildNativeTurnInput('review', { phase: 'U3', payload: row })[1].url, image.dataUrl);
});
