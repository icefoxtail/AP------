import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  buildBenchmarkRun,
  loadExamBank,
  normalizeBenchmarkExamPath,
} from '../scripts/fast-runtime-shadow-benchmark.mjs';

const root = path.resolve(import.meta.dirname, '../../../..');
const imageRichExam = 'archive/exams/original/middle/m3/2final/23_순천여중_2학기_기말_중3_기출.js';

test('shadow benchmark builds a frozen run from a real archive exam', () => {
  const exam = loadExamBank(root, imageRichExam);
  assert.equal(exam.questions.length, 24);
  assert.equal(exam.questions.filter(question => question.image).length, 24);
  assert.equal(normalizeBenchmarkExamPath(imageRichExam), imageRichExam);

  const run = buildBenchmarkRun(root, imageRichExam, { runId: 'loop9-test-run' });
  assert.equal(run.publicationIntent, 'FULL_EXAM');
  assert.equal(run.questions.length, exam.questions.length);
  assert.equal(run.questions[0].questionUid, `${imageRichExam}|real-exam|1`);
  assert.ok(run.inputs.some(ref => ref.role === 'candidate' && ref.path === imageRichExam));
  assert.equal(run.questions.filter(question => question.problemAssetPaths.length).length, 24);
  for (const question of run.questions) {
    for (const assetPath of [...question.problemAssetPaths, ...question.solutionAssetPaths]) {
      const ref = run.inputs.find(input => input.path === assetPath && input.role === 'asset');
      assert.ok(ref, `asset input missing: ${assetPath}`);
      assert.ok(fs.existsSync(path.join(root, assetPath)));
    }
  }
  assert.equal(run.inputSha.startsWith('sha256:'), true);
});
