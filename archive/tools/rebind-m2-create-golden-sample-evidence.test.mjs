#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { compareExamForFigureOnly, gitBlobSha, parseArgs, runRebind, sha256 } from './rebind-m2-create-golden-sample-evidence.mjs';

const A = 'archive/exams/original/high/h1/2mid/golden-a.js';
const B = 'archive/exams/original/high/h1/2mid/golden-b.js';
const NEG = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const EVIDENCE = 'archive/data/r2e-intake/m2/fake.create.physical-evidence.json';
const AXES = ['STUDENT_REPRODUCIBILITY', 'SMALL_BOARD_STRUCTURE', 'EXPLANATION_DENSITY', 'VISUAL_SEMANTIC_PARITY', 'VISUAL_READABILITY'];

const bankA = () => [1, 2, 3].map(id => ({
  id, content: `문제 ${id}`, choices: ['1', '2'], answer: '①', solution: `해설 ${id}번 풀이이다.`,
  solutionImage: `a${id}.svg`, solutionImageAlt: `그림 ${id}`, solutionImageSize: 'M',
}));
const bankB = () => [1, 2].map(id => ({ id, content: `B ${id}`, choices: [], answer: '2', solution: `B 해설 ${id}.` }));
const examJs = bank => `window.examTitle="fake";\nwindow.questionBank=${JSON.stringify(bank, null, 1)};\n`;

function git(root, ...args) {
  return execFileSync('git', args, {
    cwd: root, encoding: 'utf8',
    env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' },
  });
}
function put(root, rel, text) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}
const pin = (root, rel) => { const bytes = fs.readFileSync(path.join(root, rel)); return { path: rel, sha256: sha256(bytes), gitBlobSha: gitBlobSha(bytes) }; };
function questionRef(rel, q, observation = 'obs') {
  return { path: rel, qid: q.id, solutionSha256: sha256(Buffer.from(q.solution)), solutionExcerpt: q.solution.slice(0, 4), observation };
}

const tempRoots = [];
process.on('exit', () => { for (const dir of tempRoots) fs.rmSync(dir, { recursive: true, force: true }); });

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'golden-rebind-'));
  tempRoots.push(root);
  git(root, 'init', '-q');
  git(root, 'config', 'core.autocrlf', 'false');
  put(root, A, examJs(bankA()));
  put(root, B, examJs(bankB()));
  put(root, NEG, 'negative sample\n');
  const evidence = {
    schemaVersion: 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1',
    stage: 'CREATE',
    solutionQualityCalibration: {
      sampleReadBeforeWork: true,
      calibrationStatus: 'PASS',
      calibrationAxes: AXES,
      goldenSampleRefs: [pin(root, A), pin(root, B)],
      goldenSampleQuestionRefs: [
        questionRef(A, bankA()[0]), questionRef(A, bankA()[1]),
        questionRef(B, bankB()[0]), questionRef(B, bankB()[1]),
      ],
      negativeSampleRefs: [pin(root, NEG)],
    },
    evidenceBindingHistory: { schemaVersion: 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1', entries: [{ sourcePath: 'older.js', previous: {}, current: {} }] },
    trailer: { keep: true },
  };
  put(root, EVIDENCE, `${JSON.stringify(evidence, null, 2)}\n`);
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'baseline');
  return root;
}
const rebind = (root, extra = {}) => runRebind({ root, sources: [A], evidencePaths: [EVIDENCE], date: '2026-11-10', ...extra });
const readEvidence = root => JSON.parse(fs.readFileSync(path.join(root, EVIDENCE), 'utf8'));

test('figure-only change: dry-run reports, --write rebinds and records history, rerun is ALREADY_BOUND', () => {
  const root = makeRepo();
  const bank = bankA();
  bank[1].solutionImage = 'a2-new.svg';
  bank[1].solutionImageAlt = '새 그림';
  bank[2].solutionImageSize = 'L';
  put(root, A, examJs(bank));
  const evidenceBefore = fs.readFileSync(path.join(root, EVIDENCE), 'utf8');

  const dry = rebind(root);
  assert.equal(dry.ok, true);
  assert.equal(dry.mode, 'DRY_RUN');
  assert.equal(dry.evidenceToUpdate, 1);
  assert.equal(dry.reports[0].sources[0].status, 'WOULD_UPDATE');
  assert.deepEqual(dry.reports[0].sources[0].changedQids, [2, 3]);
  assert.equal(fs.readFileSync(path.join(root, EVIDENCE), 'utf8'), evidenceBefore, 'dry-run must not write');

  const wrote = rebind(root, { write: true });
  assert.equal(wrote.ok, true);
  const evidence = readEvidence(root);
  const refA = evidence.solutionQualityCalibration.goldenSampleRefs.find(r => r.path === A);
  const bytes = fs.readFileSync(path.join(root, A));
  assert.equal(refA.sha256, sha256(bytes));
  assert.equal(refA.gitBlobSha, gitBlobSha(bytes));
  const refB = evidence.solutionQualityCalibration.goldenSampleRefs.find(r => r.path === B);
  assert.equal(refB.sha256, sha256(fs.readFileSync(path.join(root, B))), 'other golden pin untouched');
  const entries = evidence.evidenceBindingHistory.entries;
  assert.equal(entries.length, 2, 'existing history preserved, one entry appended');
  assert.equal(entries[0].sourcePath, 'older.js');
  assert.equal(entries[1].sourcePath, A);
  assert.equal(entries[1].reason, 'solution figure only (solutionImage*), content/answer/choices/solution unchanged');
  assert.equal(entries[1].date, '2026-11-10');
  assert.equal(entries[1].current.sha256, refA.sha256);
  assert.match(entries[1].previous.sha256, /^sha256:[0-9a-f]{64}$/);
  assert.notEqual(entries[1].previous.sha256, entries[1].current.sha256);
  assert.deepEqual(evidence.trailer, { keep: true });

  const again = rebind(root);
  assert.equal(again.evidenceToUpdate, 0);
  assert.equal(again.reports[0].sources[0].status, 'ALREADY_BOUND');
});

test('non-figure change in an unreferenced question is REFUSED and nothing is written', () => {
  const cases = {
    solution: bank => { bank[2].solution = '다른 해설이다.'; },
    content: bank => { bank[2].content = '바뀐 문제'; },
    answer: bank => { bank[2].answer = '②'; },
    choices: bank => { bank[2].choices = ['9']; },
    id: bank => { bank[2].id = 99; },
    problemImage: bank => { bank[2].image = 'new-problem.svg'; },
    count: bank => { bank.pop(); },
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const root = makeRepo();
    const bank = bankA();
    bank[2].solutionImage = 'also-changed.svg';
    mutate(bank);
    put(root, A, examJs(bank));
    const evidenceBefore = fs.readFileSync(path.join(root, EVIDENCE), 'utf8');
    const result = rebind(root, { write: true });
    assert.equal(result.ok, false, name);
    assert.equal(result.refused, true, name);
    assert.ok(result.violations.length >= 1, name);
    assert.equal(fs.readFileSync(path.join(root, EVIDENCE), 'utf8'), evidenceBefore, `${name}: evidence untouched`);
  }
});

test('REFUSE names the changed question and field', () => {
  const root = makeRepo();
  const bank = bankA();
  bank[2].solution = '새 해설';
  put(root, A, examJs(bank));
  const result = rebind(root);
  assert.match(result.violations[0].violation, /^NON_FIGURE_FIELD_CHANGED:q3:solution:/);
});

test('changed solution of a referenced golden question fails the existing solution SHA check', () => {
  const root = makeRepo();
  const bank = bankA();
  bank[0].solution = '해설 1번 바뀜';
  put(root, A, examJs(bank));
  assert.throws(() => rebind(root, { write: true }), /GOLDEN_SOLUTION_SHA_STALE/);
});

test('baseline that does not match the evidence pin is rejected', () => {
  const root = makeRepo();
  const bank = bankA();
  bank[0].solutionImage = 'new.svg';
  put(root, A, examJs(bank));
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'figure');
  const head = git(root, 'rev-parse', 'HEAD').trim();
  assert.throws(() => rebind(root, { baselines: [head] }), /BASELINE_DOES_NOT_MATCH_EVIDENCE_PIN/);
  const first = git(root, 'rev-parse', 'HEAD~1').trim();
  assert.equal(rebind(root, { baselines: [first] }).evidenceToUpdate, 1);
});

test('compareExamForFigureOnly: legacy line-wrap allowance stays limited to the listed qids', () => {
  const parsed = bank => ({ window: { examTitle: 't' }, bank });
  const base = [{ id: 10, content: 'abcdef', solution: 's' }, { id: 11, content: 'xyz', solution: 's' }];
  const wrapped = [{ id: 10, content: 'abc\ndef', solution: 's' }, { id: 11, content: 'xyz', solution: 's' }];
  assert.deepEqual(compareExamForFigureOnly(parsed(base), parsed(wrapped), { lineWrapQids: [10] }).violations, []);
  assert.equal(compareExamForFigureOnly(parsed(base), parsed(wrapped), {}).violations.length, 1);
  const wrapped11 = [{ id: 10, content: 'abcdef', solution: 's' }, { id: 11, content: 'x\nyz', solution: 's' }];
  assert.equal(compareExamForFigureOnly(parsed(base), parsed(wrapped11), { lineWrapQids: [10] }).violations.length, 1);
  const exact = compareExamForFigureOnly(parsed(base), parsed([{ ...base[0], solutionImage: 'x' }, base[1]]), { exactQids: [10] });
  assert.match(exact.violations[0], /^REFERENCED_QUESTION_CHANGED:q10:solutionImage/);
  const title = compareExamForFigureOnly(parsed(base), { window: { examTitle: 'other' }, bank: base });
  assert.match(title.violations[0], /^WINDOW_FIELD_CHANGED:examTitle/);
});

test('parseArgs: repeatable --source, paired --baseline, unknown argument rejected', () => {
  const opts = parseArgs(['--source', 'a.js', '--source', 'b.js', '--baseline', 'c1', '--baseline', 'c2', '--write']);
  assert.deepEqual(opts.sources, ['a.js', 'b.js']);
  assert.deepEqual(opts.baselines, ['c1', 'c2']);
  assert.equal(opts.write, true);
  assert.throws(() => parseArgs(['--source', 'a.js', '--source', 'b.js', '--baseline', 'c1']), /BASELINE_COUNT_MUST_MATCH_SOURCE_COUNT/);
  assert.throws(() => parseArgs(['--bogus']), /UNKNOWN_ARGUMENT/);
});
