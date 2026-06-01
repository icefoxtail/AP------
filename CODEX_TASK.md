cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
작업 대상 프로젝트: C:\Users\USER\Desktop\AP------

작업명:
APMS 출제 대상 확장 Round 5-1 - 학년별 출제 보정

목표:
Round 5에서 구현한 기존 아카이브 + 시험지 보관함의 학년별 출제 UI를 보정한다.
핵심 보정은 2가지다.

1. 기존 아카이브 archive/index.html의 학년별 출제에서 question_count가 0으로 저장될 위험 제거.
2. 선생님 계정도 원장님과 동일하게 전체 학년 출제가 가능하도록 qr-classes/API/프론트 데이터 흐름을 확인하고 필요한 경우 보정.

이번 라운드에서는 분석표, 리포트, premium analysis, snapshot 저장, DB migration, 배포를 하지 않는다.

중요 원칙:
- git add, git commit, git push 금지.
- 작업 결과 파일명은 반드시 CODEX_RESULT2.md로 작성한다.
- CODEX_RESULT.md 또는 CODEX_RESULT1.md를 새로 만들지 않는다.
- wrangler d1 migrations apply 실행 금지.
- wrangler deploy 실행 금지.
- DB migration 파일 추가/수정 금지.
- schema.sql 수정 금지.
- 분석표 버튼/화면 구현 금지.
- assessment_result_items 저장 로직 수정 금지.
- premium/report snapshot 저장 구현 금지.
- 학부모 리포트 구현 금지.
- 원장님 대시보드, 선생님 사이드바, 휴원 기능 수정 금지.
- 평가팩 데이터 JS 수정 금지.
- 기존 일반 기출 출제/QR/OMR 흐름을 깨뜨리지 말 것.
- 기존 MIXED:<key> 흐름을 유지한다.
- ASSESSMENT:<packId>를 archive_file에 넣지 않는다.
- 출제자 정보는 저장하지 않는다. created_by 컬럼은 이번 구현에서도 사용하지 않는다.
- 기존 아카이브와 시험지 보관함의 출제 대상 문구/흐름은 동일하게 유지한다.

반드시 먼저 확인할 파일:
- archive/index.html
- archive/assessment/assessment-mvp.html
- archive/engine.html
- archive/mixed_engine.html
- apmath/worker-backup/worker/routes/check-omr.js
- apmath/worker-backup/worker/routes/exams.js
- apmath/js/qr-omr.js
- tests/assessment-grade-target-assignment.test.js
- tests/assessment-result-items-storage.test.js
- tests/assessment-assignment-metadata-flow.test.js
- tests/assessment-archive-print-flow.test.js
- tests/assessment-mvp-archive-style.test.js

현재 Round 5 검수에서 확인된 문제:
1. archive/index.html 학년별 사전 출제 등록 payload에서 question_count가 아래처럼 0 fallback 가능성이 있음.
   question_count: Number(item.question_count || item.questionCount || item.count || 0)

2. normalizeExamMeta() 또는 기존 아카이브 시험지 메타 구조에서 question_count/questionCount/count를 보장하지 않으면, 기존 아카이브 시험지를 학년별로 출제할 때 class_exam_assignments.question_count가 0으로 저장될 수 있음.

3. 선생님도 전체 학년 출제가 가능해야 하는 정책인데, 현재 qr-classes API가 선생님에게 전체 반을 내려주는지 확인이 필요함. 담당반만 내려주면 정책과 다름.

확정 정책:
- 원장님/선생님 모두 반별·학년별 출제 가능.
- 선생님도 전체 학년 출제 가능.
- 출제자 저장 안 함.
- 학년별 출제는 DB에 반별 assignment 여러 개로 저장.
- 같은 학년별 출제는 assignment_batch_id로 묶음.
- 기존 아카이브 시험지 학년별 출제 시 question_count 0 저장 금지.
- question_count를 확정할 수 없으면 학년별 사전 등록을 진행하지 말고 사용자에게 “문항 수 확인이 필요합니다.”를 보여준다.
- 시험지 보관함 평가팩은 pack.questions.length를 사용하므로 기존 구조 유지.
- 반별 출제 기존 흐름은 유지.

구현 범위:

1. archive/index.html question_count 보정
수정 대상:
- archive/index.html

해야 할 일:
- 기존 아카이브 시험지의 실제 문항 수를 안정적으로 구하는 helper를 만든다.
- helper 이름은 코드 스타일에 맞추되 역할이 명확해야 한다.
  예:
  - resolveArchiveExamQuestionCount
  - getArchiveExamQuestionCount
  - resolveExamQuestionCountForAssignment

문항 수 계산 우선순위:
1. item.question_count
2. item.questionCount
3. item.count
4. item.questions.length 또는 유사 필드가 실제 존재하면 사용
5. db.js 메타에서 문항 수 필드가 있으면 사용
6. 기존 archive/index.html에서 engine으로 넘기는 파일 정보나 문제 수를 이미 계산하는 함수가 있으면 그 로직 재사용
7. 그래도 확인 불가하면 0을 쓰지 말고 null/NaN으로 처리 후 출제 등록 차단

금지:
- question_count fallback으로 0 사용 금지.
- 학년별 출제 payload에 question_count: 0 저장 금지.
- 하드코딩으로 모든 시험지를 20문항, 25문항 처리 금지.
- 파일명만 보고 임의 문항 수 추정 금지.

실패 처리:
- 학년별 출제에서 문항 수를 확정할 수 없는 시험지는 사전 등록을 중단한다.
- 사용자에게 아래 문구를 표시한다.
  문항 수 확인이 필요합니다.
- 콘솔에도 어떤 시험지에서 문항 수 확인이 실패했는지 남긴다.
- 기존 반별 출제 흐름은 가능한 한 기존처럼 유지한다.

2. assessment-mvp.html 문항 수 확인
수정 대상:
- archive/assessment/assessment-mvp.html

해야 할 일:
- 시험지 보관함 평가팩 학년별 출제는 pack.questions.length 또는 기존 평가팩 questionCount 값을 사용하고 있는지 확인한다.
- 여기는 0 fallback이 없어야 한다.
- pack.questions가 없거나 빈 배열이면 학년별 출제 등록을 차단하고 “문항 수 확인이 필요합니다.”를 표시한다.
- 정상 평가팩은 기존처럼 동작해야 한다.

3. qr-classes 전체 반 반환 정책 확인/보정
수정 대상 후보:
- apmath/worker-backup/worker/routes/check-omr.js

해야 할 일:
- qr-classes API가 원장님/선생님에게 어떤 반 목록을 내려주는지 실제 코드로 확인한다.
- 선생님에게 담당반만 내려주는 구조라면, AP 제출 QR 출제용 qr-classes에서는 선생님에게도 전체 반/전체 학년 출제가 가능하도록 보정한다.
- 보정 시 기존 PIN/check-init/check-pin 인증 흐름을 깨뜨리지 않는다.
- 보정 시 학생용 제출 보안이나 PIN 확인 흐름을 무력화하지 않는다.
- 단순히 출제 대상 목록에 쓰이는 반 목록만 원장님/선생님 모두 전체 반을 받을 수 있게 한다.
- 기존 API가 이미 전체 반을 반환한다면 코드 수정하지 말고 CODEX_RESULT2.md에 근거를 기록한다.

정책:
- 원장님/선생님 모두 전체 반 목록을 받아야 학년별 출제가 가능하다.
- 출제자 저장은 하지 않는다.
- teacher_id/created_by 같은 저장은 이번 라운드에서 추가하지 않는다.

4. 학년별 반 목록 추출 재확인
수정 대상:
- archive/index.html
- archive/assessment/assessment-mvp.html

해야 할 일:
- 학년별 목록이 기존 qr-classes에서 받은 반 목록 기준으로 생성되는지 확인한다.
- 반명/학년 필드에서 중1, 중2, 중3, 고1, 고2를 추출하는 로직이 너무 약하면 보정한다.
- 가능한 경우 명시적인 grade/grade_label 필드 우선.
- 없으면 className/name에서 패턴 추출.
- 학년 추출 실패 반은 학년별 목록에 넣지 않는다.
- 해당 학년에 반이 없으면 기존 문구 유지:
  해당 학년에 출제할 반이 없습니다.

5. assignment_batch_id / target_scope 보존 확인
수정 대상:
- archive/index.html
- archive/assessment/assessment-mvp.html

해야 할 일:
- 학년별 출제 시 모든 반별 POST payload에 같은 assignment_batch_id가 들어가는지 확인한다.
- target_scope는 학년별일 때 grade.
- 반별일 때 target_scope는 class.
- 시험지 보관함 평가팩은 pack_id, pack_hash, grade_label도 같이 전달되어야 한다.
- 기존 아카이브 일반 시험지는 pack_id 없이도 정상이어야 한다.

6. tests 보강
수정 또는 추가 대상:
- tests/assessment-grade-target-assignment.test.js
- 필요하면 tests/assessment-grade-target-round5-1.test.js 추가 가능

테스트에 반드시 포함할 내용:
- archive/index.html에 question_count 0 fallback 패턴이 없어야 한다.
  금지 패턴 예:
  question_count: Number(item.question_count || item.questionCount || item.count || 0)
  또는 유사한 || 0 fallback
- archive/index.html에 문항 수 확인 실패 시 “문항 수 확인이 필요합니다.” 문구가 있어야 한다.
- archive/index.html에 문항 수 helper가 있어야 한다.
- archive/assessment/assessment-mvp.html도 평가팩 question count 확인 실패를 방어해야 한다.
- qr-classes route가 teacher에게 전체 반 출제를 막는 필터를 강제하지 않는지 확인한다.
  문자열 기반으로 teacher_id 제한이 있으면 테스트에서 잡거나, 코드 구조상 전체 반 반환 근거를 확인한다.
- archive/index.html과 assessment-mvp.html에 출제 대상/반별/학년별 문구가 유지되어야 한다.
- assignment_batch_id, target_scope, grade_label 흐름이 유지되어야 한다.
- created_by를 새로 보내는 코드가 없어야 한다.
- ASSESSMENT:<packId>를 archive_file에 넣는 코드가 없어야 한다.
- 분석표, assessment-analysis.html 관련 새 코드가 없어야 한다.

기존 테스트도 실행:
- node tests/assessment-grade-target-assignment.test.js
- node tests/assessment-result-items-storage.test.js
- node tests/assessment-assignment-metadata-flow.test.js
- node tests/assessment-archive-print-flow.test.js
- node tests/assessment-mvp-archive-style.test.js

검증:
1. node --check
- node --check apmath/worker-backup/worker/routes/check-omr.js
- node --check apmath/worker-backup/worker/routes/exams.js
- node --check apmath/js/qr-omr.js

2. 테스트 실행
- node tests/assessment-grade-target-assignment.test.js
- node tests/assessment-result-items-storage.test.js
- node tests/assessment-assignment-metadata-flow.test.js
- node tests/assessment-archive-print-flow.test.js
- node tests/assessment-mvp-archive-style.test.js
- 새 테스트를 추가했다면 해당 테스트도 실행

3. git diff 확인
실행:
- git diff --name-only
- git status --short --untracked-files=all

허용 변경 파일:
- archive/index.html
- archive/assessment/assessment-mvp.html
- apmath/worker-backup/worker/routes/check-omr.js
- tests/assessment-grade-target-assignment.test.js
- tests/assessment-grade-target-round5-1.test.js
- CODEX_RESULT2.md

가능하면 check-omr.js는 실제 필요할 때만 수정한다.
routes/exams.js는 이번 보정에서 수정하지 않는 것이 원칙이다. 필요 시 이유를 CODEX_RESULT2.md에 기록한다.

금지 파일:
- apmath/worker-backup/worker/routes/exams.js
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/stage_assessment_analysis_storage_round2.sql
- docs/APMS_ASSESSMENT_ANALYSIS_MIGRATION_DRAFT.sql
- docs/APMS_ASSESSMENT_ANALYSIS_STORAGE_ROUND1.md
- archive/assessment/assessment-packs-1sem.generated.js
- archive/assessment/assessment-question-index-1sem.generated.js
- archive/mixed_engine.html
- archive/engine.html
- apmath/js/dashboard.js
- apmath/js/ui.js
- apmath/js/report.js
- apmath/js/classroom.js
- apmath/js/student.js
- apmath/js/qr-omr.js

4. 실제 원격 DB 쓰기 테스트는 이번 라운드에서 하지 않는다.
- wrangler d1 execute insert 금지.
- 브라우저에서 실제 출제 버튼을 눌러 원격 assignment를 생성하지 않는다.
- 이번 라운드는 코드/정적 테스트까지만 한다.

브라우저 확인 가능하면:
- 로컬에서 archive/index.html 열기
- AP 제출 QR 출제 흐름에서 출제 대상 모달 확인
- 반별/학년별 선택 화면 확인
- 문항 수 확인 실패 상황이 실제로 있으면 “문항 수 확인이 필요합니다.” 표시 확인
- archive/assessment/assessment-mvp.html도 동일 흐름 확인
- 실제 최종 출제 API 호출은 하지 않는다.
- 브라우저 확인이 불가능하면 CODEX_RESULT2.md에 명시한다.

이번 라운드에서 하지 말 것:
- 실제 원격 출제 테스트
- 원장/선생님 권한별 제한 추가
- 출제자 저장
- 반별 QR 통합 출력
- assessment_result_items 저장 변경
- 분석표 화면
- assessment_analysis_snapshots 저장
- assessment_report_snapshots 저장
- premium AI 호출
- 학부모 리포트
- D1 migration 적용
- 배포

CODEX_RESULT2.md 형식:

# CODEX_RESULT2

## 1. 수정 파일
- 수정한 파일 목록

## 2. 보정 내용
- archive/index.html question_count 0 방지 내용
- assessment-mvp.html question_count 방어 내용
- qr-classes 전체 반 반환 정책 확인/보정 내용
- 학년별 반 목록 추출 보정 내용
- assignment_batch_id / target_scope 보존 확인 내용

## 3. 정책 확인
- 원장님/선생님 모두 학년별 출제 가능 여부
- 출제자 저장 안 함 확인
- question_count 0 저장 방지 확인
- 학년별 출제는 반별 assignment 여러 개로 저장되는 구조 확인
- ASSESSMENT:<packId> 미사용 확인
- MIXED:<key> 유지 확인

## 4. 보존 확인
- 기존 반별 출제 흐름 보존 여부
- 기존 일반 시험지 출력 보존 여부
- 기존 정답/해설 동작 보존 여부
- 시험지 보관함 카드 스타일 보존 여부
- 분석표 미구현 여부
- DB migration 미실행 여부
- 원격 DB 쓰기 테스트 미실행 여부

## 5. 검증 결과
- node --check 결과
- 테스트 실행 결과
- git diff --name-only 결과
- git status 결과
- 브라우저 확인 여부
- 확인하지 못한 항목

## 6. 다음 조치
- 실제 브라우저에서 반별/학년별 출제 흐름 확인
- 개발 DB에서 학년별 assignment_batch_id 반별 생성 확인
- 이후 raw analysis snapshot 저장
- 이후 premium/report snapshot 저장

작업 완료 후 git add, git commit, git push는 하지 않는다.
CODEX_RESULT2.md 작성 후 멈춘다.
EOF

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.