import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classify, fingerprints, normalizeNotation, REPLACED_RECALL_THRESHOLD, CLASSES, NOTATION_RULES,
} from '../archive/tools/meta-foundation/source-delta.mjs';
import { sourceFingerprint as registrarSource, contentFingerprint as registrarContent } from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import { sourceFingerprint as rebindSource, contentFingerprint as rebindContent } from '../archive/tools/meta-foundation/register-basic-scope-rebind.mjs';
import { parseArgs, resolveOutputPath } from '../archive/tools/meta-foundation/source-delta-report.mjs';

const repo = fileURLToPath(new URL('..', import.meta.url));
const fixtureDir = path.join(repo, 'tests/fixtures/source-delta');
const fixtures = fs.readdirSync(fixtureDir).filter(n => n.endsWith('.json')).sort()
  .map(n => JSON.parse(fs.readFileSync(path.join(fixtureDir, n), 'utf8')));

// ---- golden pairs: real Middle-3 term-1 cases, reduced to the fields that matter ----
test('golden pairs from real Middle-3 questions classify as recorded', () => {
  assert.ok(fixtures.length >= 7);
  for (const f of fixtures) {
    const result = classify(f.old, f.new);
    assert.equal(result.class, f.expectedClass, `${f.name} (${f.source})`);
  }
});

test('a table appended to the stem is a STEM_EDIT, not a replacement', () => {
  const f = fixtures.find(x => x.name === 'table-appended');
  const r = classify(f.old, f.new);
  assert.equal(r.class, 'STEM_EDIT');
  // the old stem survives whole inside the longer one; only the reverse direction is low
  assert.ok(r.stemRecall.oldInNew >= REPLACED_RECALL_THRESHOLD);
  assert.ok(r.stemRecall.newInOld < REPLACED_RECALL_THRESHOLD);
});

test('restored choices are a STEM_EDIT with the stem untouched', () => {
  const f = fixtures.find(x => x.name === 'choices-restored');
  const r = classify(f.old, f.new);
  assert.equal(r.class, 'STEM_EDIT');
  assert.equal(r.changed.choicesText, true);
  assert.equal(r.changed.stemText, false);
  assert.equal(r.changed.answer, false);
});

test('a different question in the same slot is REPLACED with low recall both ways', () => {
  const f = fixtures.find(x => x.name === 'replaced');
  const r = classify(f.old, f.new);
  assert.equal(r.class, 'REPLACED');
  assert.ok(r.stemRecall.oldInNew < REPLACED_RECALL_THRESHOLD && r.stemRecall.newInOld < REPLACED_RECALL_THRESHOLD);
});

test('figure-only and answer changes are reported on their own flags', () => {
  const figure = classify(...['figure'].map(n => fixtures.find(x => x.name === n)).flatMap(f => [f.old, f.new]));
  assert.deepEqual(figure.changed, { stemText: false, choicesText: false, answer: false, solutionText: false, figure: true, notationOnly: false });
  const answer = classify(...['answer-changed'].map(n => fixtures.find(x => x.name === n)).flatMap(f => [f.old, f.new]));
  assert.equal(answer.changed.answer, true);
  assert.equal(answer.changed.stemText, false);
});

// ---- notation rules: explicit, and nothing looser ----
const stem = (content, extra = {}) => ({ content, answer: '1', ...extra });

test('each explicit notation rule makes the texts equal (class NOTATION)', () => {
  const pairs = [
    ['$\\dfrac{1}{2}$', '$\\frac{1}{2}$'],
    ['$\\tfrac{1}{2}$', '$\\frac{1}{2}$'],
    ['$\\left(x+1\\right)^2$', '$(x+1)^2$'],
    ['$f(x)\\,dx$', '$f(x)dx$'],
    ['$a\\;b\\!c$', '$abc$'],
    ['$x+y$', '\\(x+y\\)'],
    ['$$x+y$$', '\\[x+y\\]'],
    ['$x ^ {2}$', '$x^2$'],
    ['$x^{2}$', '$x^2$'],
    ['$a \\leq b$', '$a \\le b$'],
    ['１＋２', '1+2'],
    ['다음 중   옳은 것은?', '다음 중 옳은 것은?'],
    ['$x−1$', '$x-1$'],
  ];
  for (const [a, b] of pairs) {
    const r = classify(stem(a), stem(b));
    assert.equal(r.class, 'NOTATION', `${a} vs ${b}`);
    assert.equal(r.changed.notationOnly, true);
  }
});

test('anything that can change the meaning is NOT notation', () => {
  const pairs = [
    ['$\\sqrt{2}$', '$2$'],
    ['$\\frac12$', '$\\frac{1}{2}$'],
    ['$x^{23}$', '$x^23$'],
    ['$\\alpha b$', '$\\alphab$'],
    ['$2 \\times 3$', '$2 \\cdot 3$'],
    ['$x^2$', '$x_2$'],
    ['$\\cdot$', '$\\cdots$'],
    ['\\$5', '5'],
  ];
  for (const [a, b] of pairs) {
    const r = classify(stem(a), stem(b));
    assert.notEqual(r.class, 'NOTATION', `${a} vs ${b}`);
    assert.notEqual(r.class, 'UNCHANGED', `${a} vs ${b}`);
  }
  assert.equal(classify(stem('$\\sqrt{2}$'), stem('$2$')).changed.stemText, true);
});

test('every documented notation rule has a reason', () => {
  assert.ok(NOTATION_RULES.length > 0);
  for (const [id, why] of NOTATION_RULES) assert.ok(id && why.length > 10, id);
});

// ---- classes, details, purity ----
test('class ladder: identical, solution, answer, figure by markup and by field', () => {
  const base = { content: '문제', choices: ['① 1', '② 2'], answer: '①', solution: '풀이' };
  assert.equal(classify(base, { ...base }).class, 'UNCHANGED');
  assert.equal(classify(base, { ...base, solution: '다른 풀이' }).class, 'SOLUTION');
  assert.equal(classify(base, { ...base, answer: '②' }).class, 'ANSWER');
  assert.equal(classify(base, { ...base, content: '문제 <img src="a.png">' }).class, 'FIGURE');
  assert.equal(classify(base, { ...base, solution: '풀이 <svg viewBox="0 0 1 1"></svg>' }).class, 'FIGURE');
  assert.equal(classify(base, { ...base, images: ['assets/x.png'] }).class, 'FIGURE');
  assert.equal(classify(base, { ...base, solutionFigureSvg: '<svg></svg>' }).class, 'FIGURE');
  assert.equal(classify(base, { ...base, choices: ['① 1', '② 3'] }).class, 'STEM_EDIT');
  assert.equal(classify(base, { ...base, answer: '②', content: '문제 수정됨' }).class, 'ANSWER');
  assert.equal(classify({ ...base, questionNumber: 3 }, { ...base, questionNumber: 4 }).class, 'NUMBER_MISMATCH');
  assert.equal(classify({ ...base, layoutTag: 'a' }, { ...base, layoutTag: 'b' }).class, 'UNCHANGED');
  for (const c of ['UNCHANGED', 'FIGURE', 'NOTATION', 'SOLUTION', 'STEM_EDIT', 'ANSWER', 'REPLACED', 'NUMBER_MISMATCH']) assert.ok(CLASSES.includes(c));
});

test('the stem falls back to question when content is absent', () => {
  const a = { question: '다음 식을 계산하시오.', answer: '1' };
  assert.equal(classify(a, { ...a, question: '다음 식을 간단히 하시오.' }).class, 'STEM_EDIT');
  assert.equal(classify(a, { ...a }).class, 'UNCHANGED');
});

test('classify is deterministic and never mutates its inputs', () => {
  for (const f of fixtures) {
    const oldCopy = structuredClone(f.old), newCopy = structuredClone(f.new);
    const first = classify(f.old, f.new);
    const second = classify(f.old, f.new);
    assert.deepEqual(first, second);
    assert.deepEqual(f.old, oldCopy);
    assert.deepEqual(f.new, newCopy);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
  }
  const frozen = Object.freeze({ content: '문제', choices: Object.freeze(['① 1']), answer: '①' });
  assert.doesNotThrow(() => classify(frozen, frozen));
  assert.equal(normalizeNotation(normalizeNotation('$\\dfrac{1}{2}$ x')), normalizeNotation('$\\dfrac{1}{2}$ x'));
});

// ---- fingerprints: same as every existing copy ----
const samples = [
  { content: '다음 중 옳은 것은?', choices: ['① 1', '② 2'], answer: '①', solution: '풀이', image: 'a.png' },
  { content: '서술형', answer: '3', solution: '해설' },
  { content: '선택지 없음', choices: 'not-an-array', answer: 1 },
  { question: 'content 없음', choices: [], answer: null },
  {},
];

test('fingerprints equal the importable registrar copies', () => {
  for (const q of samples) {
    const fp = fingerprints(q);
    assert.equal(fp.sourceFingerprint, registrarSource(q));
    assert.equal(fp.contentFingerprint, registrarContent(q));
    assert.equal(fp.sourceFingerprint, rebindSource(q));
    assert.equal(fp.contentFingerprint, rebindContent(q));
    assert.match(fp.sourceFingerprint, /^[0-9a-f]{64}$/);
  }
});

test('copies that cannot be imported keep the same field order and defaults', () => {
  const squash = rel => fs.readFileSync(path.join(repo, rel), 'utf8').replace(/\s+/g, '');
  const full = v => new RegExp(`content:${v}\\.content\\?\\?null,choices:Array\\.isArray\\(${v}\\.choices\\)\\?${v}\\.choices:null,answer:${v}\\.answer\\?\\?null,solution:${v}\\.solution\\?\\?null,image:${v}\\.image\\?\\?null`);
  const contentOnly = v => new RegExp(`content:${v}\\.content\\?\\?null,choices:Array\\.isArray\\(${v}\\.choices\\)\\?${v}\\.choices:null,image:${v}\\.image\\?\\?null`);
  for (const [rel, v, withContent] of [
    ['archive/tools/meta-foundation/register-difficulty5.mjs', 'q', true],
    ['archive/tools/build-archive2-catalog.mjs', 'question', true],
    ['archive/archive2-source.js', 'question', false],
    ['apmath/worker-backup/worker/helpers/archive2-questions.js', 'q', false],
  ]) {
    const text = squash(rel);
    assert.match(text, full(v), `${rel} full fingerprint fields`);
    if (withContent) assert.match(text, contentOnly(v), `${rel} content fingerprint fields`);
  }
  const identity = squash('archive/tools/intelligence/sync-question-identity-map-v1.mjs');
  assert.ok(identity.includes('content:q?.content??null,choices:Array.isArray(q?.choices)?q.choices:null,answer:q?.answer??null,solution:q?.solution??null,image:q?.image??null'), 'identity map sync full fingerprint fields');
  const reviewed = squash('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  assert.ok(reviewed.includes('content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null'));
  assert.ok(reviewed.includes('answer:q.answer??null,solution:q.solution??null,image:content.image'));
});

// ---- report CLI guards (no git, no corpus) ----
test('the report refuses to write inside the repository and accepts outside paths', () => {
  assert.throws(() => resolveOutputPath(path.join(repo, 'report.json'), repo), /inside the repository/);
  assert.throws(() => resolveOutputPath(path.join(repo, 'a', '..', 'x', 'r.json'), repo), /inside the repository/);
  const outside = path.join(os.tmpdir(), 'source-delta-test-report.json');
  assert.equal(resolveOutputPath(outside, repo), path.resolve(outside));
});

test('report options parse and reject unknown or valueless flags', () => {
  const o = parseArgs(['--scope', 'archive/exams/original/middle/m3/1mid/', '--limit', '3', '--out', 'x.json']);
  assert.equal(o.scope, 'original/middle/m3/1mid');
  assert.equal(o.limit, 3);
  assert.throws(() => parseArgs(['--bogus', '1']), /unknown argument/);
  assert.throws(() => parseArgs(['--limit', '0']), /positive integer/);
  assert.throws(() => parseArgs(['--scope']), /needs a value/);
});
