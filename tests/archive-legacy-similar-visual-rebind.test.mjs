import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyVisualRebindQuestions } from '../archive/tools/intelligence/apply-reviewed-legacy-similar-ledgers.mjs';

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const sourceFile = 'similar/high/h1/2final/example.js';
const oldAsset = 'assets/images/example/q01.svg';
const newAsset = 'assets/images/example/q01-problem-v2.svg';
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
const oldQuestion = { id: 1, content: 'given', choices: ['1', '2'], answer: '①', solution: 'reason',
  image: oldAsset, visualAsset: oldAsset, visualSpec: { assetRef: oldAsset, facts: ['given'] } };
const other = { ...oldQuestion, id: 2, content: 'second' };
const current = { ...oldQuestion, image: newAsset, imageSize: 'tall', visualAsset: newAsset,
  visualSpec: { ...oldQuestion.visualSpec, assetRef: newAsset } };
const review = { sourceFile, questions: [oldQuestion, other].map(question => {
  const { content, choices, answer, solution, image, id } = question;
  return { qid: id, sourceFingerprint: digest(JSON.stringify({ content, choices, answer, solution, image })),
    sourceBodyFingerprint: digest(JSON.stringify({ content, choices, image })) };
}) };
const figure = { qid: 1, asset: newAsset, assetSha256: digest(svg) };
const verify = (questions, figures = [figure], bytes = svg) =>
  verifyVisualRebindQuestions(review, [oldQuestion, other], questions, figures, () => bytes);

test('legacy visual rebind preserves every nonvisual field and rechecks the new SVG bytes', () => {
  assert.deepEqual([...verify([current, other])], [1]);
  assert.throws(() => verify([{ ...current, answer: '②' }, other]), /protected fields q1/);
  assert.throws(() => verify([{ ...current, visualSpec: { ...current.visualSpec, facts: ['changed'] } }, other]), /protected fields q1/);
  assert.throws(() => verify([current, { ...other, solution: 'changed' }]), /unlisted visual rebind q2/);
  assert.throws(() => verify([current, other], [figure], Buffer.from('<svg/>')), /asset bytes q1/);
  assert.throws(() => verify([{ ...current, visualAsset: oldAsset }, other]), /SVG reference q1/);
  assert.throws(() => verify([current, other], [figure, figure]), /unique qid/);
  assert.throws(() => verify([current, other], [figure, { ...figure, qid: 3 }]), /unknown qid/);
});
