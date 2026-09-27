import test from 'node:test';
import assert from 'node:assert/strict';
import { parseExamPdfMetadata } from '../lib/exam-id.mjs';

test('grade-two subjects are kept distinct and longest subject names win', () => {
  for (const [input, expected] of [['수학I', '수학I'], ['수학II', '수학II'], ['수학Ⅱ', '수학II'], ['미적분', '미적분'], ['미적분I', '미적분I'], ['미적분II', '미적분II'], ['미적분2', '미적분II'], ['미적분Ⅰ', '미적분I'], ['미적분Ⅱ', '미적분II'], ['대수', '대수'], ['확률과 통계', '확률과통계']]) {
    const row = parseExamPdfMetadata(`D:/기출/2학기기말/2025_학교고2_${input}_2기말.pdf`);
    assert.equal(row.course, expected, input); assert.equal(row.semester, '2'); assert.equal(row.examType, 'final');
  }
});

test('actual filename subject and term take precedence over conflicting parent folder names', () => {
  const row = parseExamPdfMetadata('D:/기출/1학기중간/미적분II/2025_학교고2_수학II_2학기_기말.pdf');
  assert.equal(row.course, '수학II'); assert.equal(row.semester, '2'); assert.equal(row.examType, 'final');
  assert.equal(row.examId, '25_학교고_2학기_기말_고2_수학II');
});

test('parenthesized and spaced subject/grade names retain their real identity', () => {
  const row = parseExamPdfMetadata('D:/기출/공통수학2/2019_학교고_고 1_수학 (하)_2기말.pdf');
  assert.equal(row.course, '수학(하)'); assert.equal(row.grade, '고1'); assert.equal(row.year, '19');
});
