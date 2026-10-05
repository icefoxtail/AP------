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

// 4. archive/index.html: 통합 패널 제출 단계에서 문항 수 확인 실패 시
//    경고 노출 + early return으로 잘못된 배정/인쇄를 막는지 확인
//    (throw 대신 경고 UI + early return 방어를 정상 동작으로 수용 — Round 3 product decision #5)
assert(
  /if \(!resolveExamQuestionCountForAssignment\(AssignTarget\.item\)\)\s*\{[\s\S]*?문항 수 확인이 필요합니다\.[\s\S]*?return;[\s\S]*?\}/.test(archiveIndex),
  'archive/index.html: 통합 패널 문항 수 확인 실패 시 경고 노출 후 early return으로 배정을 중단해야 한다'
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

// 9. target_scope grade 흐름 확인. 통합 패널은 선택된 반 수에 따라
// AssignTarget.scope를 계산해 registerIndexClassExamAssignment 옵션으로 전달한다.
assert(archiveIndex.includes('AssignTarget.scope = classIds.length === 1 ? \'class\' : \'grade\''), 'archive/index.html: 통합 패널이 학년/반 scope를 계산해야 한다');
assert(archiveIndex.includes('target_scope: options.target_scope || \'class\''), 'archive/index.html: 계산한 target_scope를 배정 payload에 전달해야 한다');
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

// 12. 기존 assessment 모달 문구는 유지하고, archive는 통합 패널 계약을 확인한다.
for (const requiredText of ['출제 대상', '반별', '학년별', '해당 학년에 출제할 반이 없습니다.']) {
  assert(assessmentMvp.includes(requiredText), `assessment-mvp.html: "${requiredText}" 문구가 유지되어야 한다`);
}
for (const requiredText of ['출제 대상 선택', 'assignTargetModalOverlay', 'assignTargetGoReview', 'assignTargetSubmit']) {
  assert(archiveIndex.includes(requiredText), `archive/index.html: 통합 패널 표식 "${requiredText}"가 있어야 한다`);
}

console.log('assessment grade target round5-1 checks passed');
