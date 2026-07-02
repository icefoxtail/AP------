import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportSource = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: {
    auth: { id: 'teacher-1', name: 'Teacher' },
    db: {
      exam_question_reviews: [],
      exam_analysis_meta: []
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: (message, type) => { context.__toasts.push({ message, type }); },
  __toasts: [],
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(reportSource, context, { filename: 'apmath/js/report.js' });

const first = context.reportCenterUpsertExamReview('exam-1.js', 3, {
  review_text: '첫 분석',
  answer: '4'
});
assert.equal(first.archive_file, 'exams/exam-1.js');
assert.equal(first.question_no, '3');
assert.equal(context.state.db.exam_question_reviews.length, 1);
assert.equal(first.updated_by, 'teacher-1');

const second = context.reportCenterUpsertExamReview('exam-1.js', '3', {
  review_text: '교체 분석'
});
assert.equal(context.state.db.exam_question_reviews.length, 1, 'upsert must not duplicate the same archive/question');
assert.equal(second.review_text, '교체 분석');
assert.ok(second.updated_at);

context.reportCenterUpsertExamReview('exam-1.js', 4, { review_text: '다른 문항' });
context.reportCenterUpsertExamMeta('exam-1.js', { overview_text: '저장 총평' });
context.reportCenterUpsertExamMeta('exam-1.js', { overview_text: '교체 총평' });
assert.equal(context.state.db.exam_analysis_meta.length, 1, 'meta upsert must not duplicate the same archive');

const stored = context.reportCenterGetExamReviews('exam-1.js');
assert.equal(stored.meta.overview_text, '교체 총평');
assert.equal(stored.byQuestion.size, 2);
assert.equal(stored.byQuestion.get('3').review_text, '교체 분석');
assert.equal(stored.byQuestion.get('4').review_text, '다른 문항');

const empty = context.reportCenterGetExamReviews('missing.js');
assert.equal(empty.meta, null);
assert.equal(empty.byQuestion.size, 0);

context.state.db.exam_question_reviews = 'bad';
context.state.db.exam_analysis_meta = { bad: true };
const safeEmpty = context.reportCenterGetExamReviews('exam-1.js');
assert.equal(safeEmpty.meta, null);
assert.equal(safeEmpty.byQuestion.size, 0, 'non-array db values should be treated as empty stores');

context.reportCenterUpsertExamReview('exam-2.js', 1, { review_text: '복구' });
context.reportCenterUpsertExamMeta('exam-2.js', { overview_text: '복구 총평' });
assert.ok(Array.isArray(context.state.db.exam_question_reviews), 'review upsert should repair non-array store');
assert.ok(Array.isArray(context.state.db.exam_analysis_meta), 'meta upsert should repair non-array store');

const coreSource = fs.readFileSync(path.join(root, 'apmath/js/core.js'), 'utf8');
assert.match(coreSource, /exam_question_reviews:\s*\[\]/, 'core default db should include exam_question_reviews');
assert.match(coreSource, /exam_analysis_meta:\s*\[\]/, 'core default db should include exam_analysis_meta');
assert.match(
  coreSource,
  /exam_question_reviews:\s*Array\.isArray\(data\.exam_question_reviews\)\s*\?\s*data\.exam_question_reviews\s*:\s*\[\]/,
  'core loadData should normalize exam_question_reviews to an array'
);
assert.match(
  coreSource,
  /exam_analysis_meta:\s*Array\.isArray\(data\.exam_analysis_meta\)\s*\?\s*data\.exam_analysis_meta\s*:\s*\[\]/,
  'core loadData should normalize exam_analysis_meta to an array'
);

console.log('exam analysis store tests passed');
