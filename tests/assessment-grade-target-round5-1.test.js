const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const archiveIndex = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const assessmentMvp = fs.readFileSync(path.join(root, 'archive', 'assessment', 'assessment-mvp.html'), 'utf8');
const checkOmr = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'check-omr.js'), 'utf8');

// 1. archive/index.html: question_count 0 fallback 패턴 제거 확인
assert(
  !archiveIndex.includes('Number(item.question_count || item.questionCount || item.count || 0)'),
  'archive/index.html: question_count 0 fallback 패턴이 없어야 한다'
);

// 2. archive/index.html: resolveExamQuestionCountForAssignment helper 존재 확인
assert(
  archiveIndex.includes('resolveExamQuestionCountForAssignment'),
  'archive/index.html: resolveExamQuestionCountForAssignment helper가 있어야 한다'
);

// 3. archive/index.html: 문항 수 확인 실패 시 사용자 메시지 확인
assert(
  archiveIndex.includes('문항 수 확인이 필요합니다.'),
  'archive/index.html: 문항 수 확인 실패 시 "문항 수 확인이 필요합니다." 문구가 있어야 한다'
);

// 4. archive/index.html: null 반환 시 throw 또는 early return 로직 확인
assert(
  archiveIndex.includes("throw new Error('문항 수 확인이 필요합니다.')"),
  'archive/index.html: resolvedCount null 시 throw를 해야 한다'
);

// 5. assessment-mvp.html: 평가팩 question count 확인 실패 방어 확인
assert(
  assessmentMvp.includes('문항 수 확인이 필요합니다.'),
  'assessment-mvp.html: 문항 수 확인 실패 시 "문항 수 확인이 필요합니다." 문구가 있어야 한다'
);
assert(
  assessmentMvp.includes('pack.questions.length === 0'),
  'assessment-mvp.html: pack.questions 빈 배열 방어 로직이 있어야 한다'
);

// 6. check-omr.js: qr-classes가 teacher에게 전체 반 반환 (teacher_classes JOIN 없음)
assert(
  !checkOmr.includes('JOIN teacher_classes'),
  'check-omr.js: qr-classes에서 teacher_classes JOIN으로 반을 제한하지 않아야 한다'
);
assert(
  !checkOmr.includes('tc.teacher_id = ?'),
  'check-omr.js: qr-classes에서 teacher_id 필터를 강제하지 않아야 한다'
);

// 7. created_by 미사용 확인
assert(!archiveIndex.includes('created_by'), 'archive/index.html: created_by를 전송하지 않아야 한다');
assert(!assessmentMvp.includes('created_by'), 'assessment-mvp.html: created_by를 전송하지 않아야 한다');

// 8. ASSESSMENT:<packId> archive_file 미사용 확인
assert(!archiveIndex.includes('ASSESSMENT:'), 'archive/index.html: ASSESSMENT:<packId>를 archive_file에 넣지 않아야 한다');
assert(!assessmentMvp.includes('ASSESSMENT:'), 'assessment-mvp.html: ASSESSMENT:<packId>를 archive_file에 넣지 않아야 한다');

// 9. target_scope grade 흐름 확인
assert(archiveIndex.includes("target_scope: 'grade'"), 'archive/index.html: 학년별 출제 시 target_scope: grade가 있어야 한다');
assert(assessmentMvp.includes("target_scope: 'grade'"), 'assessment-mvp.html: 학년별 출제 시 target_scope: grade가 있어야 한다');

// 10. assignment_batch_id 흐름 확인
assert(archiveIndex.includes('assignment_batch_id'), 'archive/index.html: assignment_batch_id가 있어야 한다');
assert(assessmentMvp.includes('assignment_batch_id'), 'assessment-mvp.html: assignment_batch_id가 있어야 한다');
assert(assessmentMvp.includes('grade_label'), 'assessment-mvp.html: grade_label이 있어야 한다');
assert(assessmentMvp.includes('pack_id'), 'assessment-mvp.html: pack_id가 있어야 한다');
assert(assessmentMvp.includes('pack_hash'), 'assessment-mvp.html: pack_hash가 있어야 한다');

// 11. 분석표 미구현 확인
assert(!archiveIndex.includes('assessment-analysis.html'), 'archive/index.html: 분석표 화면 링크가 없어야 한다');
assert(!assessmentMvp.includes('assessment-analysis.html'), 'assessment-mvp.html: 분석표 화면 링크가 없어야 한다');

// 12. 기존 출제 대상 문구 유지 확인
for (const [label, html] of [['archive/index.html', archiveIndex], ['assessment-mvp.html', assessmentMvp]]) {
  assert(html.includes('출제 대상'), `${label}: "출제 대상" 문구가 유지되어야 한다`);
  assert(html.includes('반별'), `${label}: "반별" 문구가 유지되어야 한다`);
  assert(html.includes('학년별'), `${label}: "학년별" 문구가 유지되어야 한다`);
  assert(html.includes('해당 학년에 출제할 반이 없습니다.'), `${label}: "해당 학년에 출제할 반이 없습니다." 문구가 유지되어야 한다`);
}

console.log('assessment grade target round5-1 checks passed');
