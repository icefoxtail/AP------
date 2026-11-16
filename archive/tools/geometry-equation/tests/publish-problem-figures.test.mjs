import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadBank } from '../build-visual-render-matrix.mjs';
import { normalizedInputDigest, problemDigest, problemIdentity } from '../production/problem-plan.mjs';
import { publishProblemFigures } from '../ops/tools/publish-problem-figures.mjs';

const sourcePath = 'archive/exams/original/middle/m3/2final/25_예시중_2학기_기말_중3_수학.js';
const priorAsset = 'assets/images/publisher-fixture/choice.svg';
const nextSvg = '<svg xmlns="http://www.w3.org/2000/svg"><title>직선</title></svg>';

function fixture(t, shared = false) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-problem-publish-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const schoolFile = path.join(root, sourcePath);
  const assetFile = path.join(root, 'archive', priorAsset);
  const figure = '<img alt="직선" src="' + priorAsset + '">';
  const bank = [
    { id: '7', content: '발문', choices: ['보기 1', figure], answer: '①', solution: '해설' },
    { id: '8', content: shared ? figure : '다음 문항', answer: '②' }
  ];
  const code = 'window.questionBank = ' + JSON.stringify(bank) + ';\n';
  fs.mkdirSync(path.dirname(schoolFile), { recursive: true });
  fs.mkdirSync(path.dirname(assetFile), { recursive: true });
  fs.writeFileSync(schoolFile, code);
  fs.writeFileSync(assetFile, '<svg xmlns="http://www.w3.org/2000/svg"/>');
  const out = path.join(root, 'out');
  fs.mkdirSync(out);
  const item = { visualRole: 'PROBLEM_VISUAL', sourcePath, ordinal: 1, slot: 'choice-2', assetRef: priorAsset };
  const plan = { capability: 'construction-spike-v1', caption: '직선' };
  const receipt = {
    status: 'PROBLEM_RENDERED', layoutStatus: 'PASS', identity: problemIdentity(item),
    sourcePath, ordinal: 1, slot: 'choice-2', assetRef: priorAsset,
    itemSha256: normalizedInputDigest(item), planSha256: normalizedInputDigest(plan),
    sourceSha256: problemDigest(code), svgSha256: problemDigest(nextSvg)
  };
  const receiptFile = path.join(out, 'figure-result.json');
  fs.writeFileSync(receiptFile, JSON.stringify(receipt));
  fs.writeFileSync(path.join(out, 'figure-problem.svg'), nextSvg);
  return { root, schoolFile, assetFile, bank, code, receiptFile, receipt, entries: [{ item, plan, out }] };
}

test('binds the rendered SVG only to the selected choice', t => {
  const { root, entries, schoolFile, assetFile, code, bank } = fixture(t);
  const ready = publishProblemFigures(entries, { root });
  assert.equal(ready.status, 'PROBLEM_PUBLISH_READY');
  assert.equal(fs.readFileSync(schoolFile, 'utf8'), code);
  const destination = path.join(root, 'archive', ready.rows[0].asset);
  assert.equal(fs.existsSync(destination), false);
  assert.equal(publishProblemFigures(entries, { root, apply: true }).status, 'PROBLEM_BOUND');
  bank[0].choices[1] = bank[0].choices[1].replace(priorAsset, ready.rows[0].asset);
  assert.deepEqual(structuredClone(loadBank(fs.readFileSync(schoolFile, 'utf8'))), bank);
  assert.equal(fs.readFileSync(destination, 'utf8'), nextSvg);
  assert.equal(fs.existsSync(assetFile), true);
});

test('rejects a receipt when the latest exam or proof identity changed', t => {
  const { root, entries, schoolFile, code, receiptFile, receipt } = fixture(t);
  fs.writeFileSync(schoolFile, code.replace('발문', '교정 발문'));
  assert.throws(() => publishProblemFigures(entries, { root, apply: true }), /PROBLEM_RENDER_RECEIPT_MISMATCH/);
  fs.writeFileSync(schoolFile, code);
  receipt.identity = { ...receipt.identity, visualRole: 'image' };
  fs.writeFileSync(receiptFile, JSON.stringify(receipt));
  assert.throws(() => publishProblemFigures(entries, { root, apply: true }), /PROBLEM_RENDER_RECEIPT_MISMATCH/);
  assert.equal(fs.readFileSync(schoolFile, 'utf8'), code);
});

test('rejects an unlisted question sharing the same prior image', t => {
  const { root, entries, schoolFile, code } = fixture(t, true);
  assert.throws(() => publishProblemFigures(entries, { root, apply: true }), /PROBLEM_PUBLISH_FIELD_DRIFT/);
  assert.equal(fs.readFileSync(schoolFile, 'utf8'), code);
});
