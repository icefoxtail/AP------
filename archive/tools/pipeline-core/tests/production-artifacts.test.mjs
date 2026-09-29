import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
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

test('real production DB/index, source and candidate image lanes preserve choices and SVG/raster bytes', async () => {
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
      const native = await buildNativeTurnInput('review', { phase: 'U3', payload });
      assert.equal(native.filter(x => x.type === 'image').length, q.image ? 1 : 0);
      for (const ref of inputs.filter(x => x.role === 'asset')) {
        const asset = visualAssetPayload(root, ref);
        assert.match(asset.dataUrl, /^data:image\/png;base64,/);
        assert.equal(asset.sha256, ref.sha256);
        if (ref.path.endsWith('.svg')) assert.ok(asset.nativeSha256 && asset.nativeSha256 !== ref.sha256);
        const input = await buildNativeTurnInput('review', { phase: 'U2', payload: { artifact: { assetRefs: [asset] } } });
        assert.equal(typeof input[1].url, 'string');
        assert.match(input[1].url, /^data:image\/(?:png|jpeg);base64,/);
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

test('actual final native envelope carries render screenshots only in U3, without wrapping image objects', async () => {
  const image = { dataUrl: 'data:image/png;base64,AA==' };
  const row = { renderWitnesses: [{ mode: 'solution', viewportProfile: 'desktop', screenshot: image }, { mode: 'exam', viewportProfile: 'desktop', screenshot: image }] };
  assert.equal((await buildNativeTurnInput('review', { phase: 'U1', payload: row })).length, 1);
  assert.equal((await buildNativeTurnInput('review', { phase: 'U2', payload: { ...row, artifact: { assetRefs: [image] } } }))[1].url, image.dataUrl);
  assert.equal((await buildNativeTurnInput('review', { phase: 'U3', payload: row }))[1].url, image.dataUrl);
});

test('native prompt replaces repeated image data URLs with bound image-input indexes', async () => {
  const image = { path: 'pages/page-11.svg', sha256: 'sha256:' + 'a'.repeat(64), mimeType: 'image/svg+xml', dataUrl: `data:image/svg+xml;base64,${'A'.repeat(1_100_000)}` };
  const packet = { phase: 'U1', payload: [{ questionUid: 'exam|1', sourcePixels: [image] }, { questionUid: 'exam|2', sourcePixels: [image] }] };
  const native = await buildNativeTurnInput(JSON.stringify({ packet }), packet);
  assert.equal(native.length, 2, 'one text item and one deduplicated image item');
  assert.ok(native[0].text.length < 2_000);
  assert.equal(native[0].text.includes(image.dataUrl), false);
  const projected = JSON.parse(native[0].text);
  assert.equal(projected.packet.payload[0].sourcePixels[0].nativeImageInputIndex, 0);
  assert.equal(projected.packet.payload[1].sourcePixels[0].nativeImageInputIndex, 0);
  assert.deepEqual(projected.nativeImageInputs, [{ index: 0, path: image.path, sha256: image.sha256, mimeType: image.mimeType, transferMimeType: image.mimeType, originalBytes: null, transferBytes: null }]);
  assert.equal(native[1].url, image.dataUrl);
});

test('U3 attaches one solution-desktop witness per item while retaining omitted capture metadata', async () => {
  const problem = { path: 'assets/q08.png', sha256: 'sha256:' + 'b'.repeat(64), mimeType: 'image/png', dataUrl: 'data:image/png;base64,AA==' };
  const solutionDesktop = { screenshot: { path: 'capture/solution-desktop.png', sha256: 'sha256:' + 'c'.repeat(64), mimeType: 'image/png', dataUrl: 'data:image/png;base64,BB==' } };
  const exam = { screenshot: { path: 'capture/exam-desktop.png', sha256: 'sha256:' + 'd'.repeat(64), mimeType: 'image/png', dataUrl: 'data:image/png;base64,CC==' } };
  const packet = { phase: 'U3', payload: [{ questionUid: 'exam|8', currentQuestion: { problemAssets: [problem] }, renderWitnesses: [
    { mode: 'exam', viewportProfile: 'desktop', ...exam },
    { mode: 'solution', viewportProfile: 'desktop', ...solutionDesktop, blocks: [{ screenshot: { path: 'capture/solution-block.png', sha256: 'sha256:' + 'f'.repeat(64), mimeType: 'image/png', dataUrl: 'data:image/png;base64,EE==' } }] },
    { mode: 'solution', viewportProfile: 'mobile', screenshot: { path: 'capture/solution-mobile.png', sha256: 'sha256:' + 'e'.repeat(64), mimeType: 'image/png', dataUrl: 'data:image/png;base64,DD==' } },
  ] }] };
  const native = await buildNativeTurnInput(JSON.stringify({ packet }), packet);
  assert.equal(native.length, 3, 'text, one problem asset, and one solution desktop witness');
  const projected = JSON.parse(native[0].text);
  const witnesses = projected.packet.payload[0].renderWitnesses;
  assert.equal(witnesses[0].screenshot.nativeImageInputOmitted, true);
  assert.equal(witnesses[1].screenshot.nativeImageInputIndex, 1);
  assert.equal(witnesses[1].blocks[0].screenshot.nativeImageInputOmitted, true);
  assert.equal(witnesses[2].screenshot.nativeImageInputOmitted, true);
  assert.equal(projected.nativeImageInputs[1].path, 'capture/solution-desktop.png');
});

test('native render witness keeps source evidence metadata and reports transfer media', async () => {
  const image = {
    path: 'archive/_generated/pipeline-renders/candidate-0-solution-desktop-q1.png',
    sha256: 'sha256:' + 'b'.repeat(64),
    mimeType: 'image/png',
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAD0lEQVQImWP4jwQYiOMAANuQL9HsugRzAAAAAElFTkSuQmCC',
  };
  const packet = { phase: 'U3', payload: [{ questionUid: 'exam|1', currentQuestion: {}, renderWitnesses: [{ mode: 'solution', viewportProfile: 'desktop', screenshot: image }] }] };
  const native = await buildNativeTurnInput(JSON.stringify({ packet }), packet);
  const projected = JSON.parse(native[0].text);
  assert.match(native[1].url, /^data:image\/(?:png|jpeg);base64,/);
  assert.equal(projected.nativeImageInputs[0].path, image.path);
  assert.equal(projected.nativeImageInputs[0].sha256, image.sha256);
  assert.equal(projected.nativeImageInputs[0].mimeType, 'image/png');
  assert.equal(projected.nativeImageInputs[0].transferMimeType, native[1].url.match(/^data:(image\/[^;]+)/)[1]);
  assert.ok(projected.nativeImageInputs[0].transferBytes <= projected.nativeImageInputs[0].originalBytes);
});

test('native SVG preview transfer flattens transparent pixels to white without changing the source SHA', async () => {
  const requireFromRuntime = createRequire(path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json'));
  const sharp = requireFromRuntime('sharp');
  const image = {
    path: 'assets/q10-solution.svg',
    sha256: 'sha256:' + 'c'.repeat(64),
    mimeType: 'image/png',
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEUlEQVQImWNgYGD4DwIM5AMANR0E/MB/CVgAAAAASUVORK5CYII=',
  };
  const packet = { phase: 'U2', payload: [{ questionUid: 'exam|10', artifact: image }] };
  const native = await buildNativeTurnInput(JSON.stringify({ packet }), packet);
  const projected = JSON.parse(native[0].text);
  assert.equal(projected.nativeImageInputs[0].sha256, image.sha256);
  assert.equal(projected.nativeImageInputs[0].mimeType, 'image/png');
  const bytes = Buffer.from(native[1].url.split(',')[1], 'base64');
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 3, 'flattened PNG has no transparent alpha channel');
  assert.deepEqual([...data.subarray(3, 6)], [255, 255, 255], 'transparent source canvas is white in the native transfer');
});
