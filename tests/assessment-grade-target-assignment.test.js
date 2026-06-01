const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const archiveIndex = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const assessmentMvp = fs.readFileSync(path.join(root, 'archive', 'assessment', 'assessment-mvp.html'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');

for (const [label, html] of [
  ['archive/index.html', archiveIndex],
  ['archive/assessment/assessment-mvp.html', assessmentMvp],
]) {
  for (const requiredText of [
    '출제 대상',
    '시험지를 출제할 대상을 선택하세요.',
    '반별',
    '학년별',
    '출제 학년 선택',
    '선택한 학년의 모든 반에 시험지가 출제됩니다.',
    '해당 학년에 출제할 반이 없습니다.',
    'assignment_batch_id',
    'target_scope',
    "target_scope: 'grade'",
    'grade_label',
    'class-exam-assignments',
    '문항 수 확인이 필요합니다.',
  ]) {
    assert(html.includes(requiredText), `${label} should include grade target assignment marker: ${requiredText}`);
  }

  assert(!html.includes('ASSESSMENT:'), `${label} should not write ASSESSMENT:<packId> to archive_file`);
  assert(!html.includes('created_by'), `${label} should not send created_by`);
  assert(!html.includes('assessment-analysis.html'), `${label} should not add analysis screen links`);
}

assert(
  archiveIndex.includes('qCount'),
  'archive/index.html should consider qCount when resolving archive exam question counts'
);

assert(
  archiveIndex.includes('resolveExamQuestionCountForAssignment') &&
  archiveIndex.includes('getArchiveExamQuestionCount'),
  'archive/index.html should include positive question-count helpers for assignment registration'
);

assert(
  !/question_count\s*:\s*0\b/.test(archiveIndex),
  'archive/index.html should not fall back to question_count: 0 for assignment registration'
);

assert(
  assessmentMvp.includes('pack.questions') &&
  assessmentMvp.includes('문항 수 확인이 필요합니다.'),
  'assessment-mvp.html should block assessment assignment when pack question count cannot be confirmed'
);

assert(
  examsRoute.includes('COALESCE(excluded.${col}, class_exam_assignments.${col})'),
  'routes/exams.js should preserve assignment metadata on upsert'
);

console.log('assessment grade target assignment checks passed');
