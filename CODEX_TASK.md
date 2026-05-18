cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## GOAL

학생 상세 lazy loader 표준 패턴 1차를 구현한다.

이번 작업의 핵심은 `/api/initial-data`를 바로 더 줄이는 것이 아니라, 앞으로 화면별 데이터 지연 로딩을 반복해서 쓸 수 있는 표준 패턴을 하나 만드는 것이다.

1차 구현 범위:
- `GET /api/students/:id/detail-data` read-only API 추가 또는 보강
- `apmath/js/student.js`에 `ensureStudentDetailLazyData(studentId, options)` 패턴 추가
- 응답 범위는 아래 3개 데이터만 포함
  - `parent_contacts`
  - `student_status_history`
  - `class_transfer_history`
- `message_logs`는 1차 응답에서 제외
- `/api/initial-data` 응답 key 제거는 하지 않음
- 새 UI를 크게 노출하지 않음
- 기존 학생 상세 화면 흐름 보존

## CONTEXT

작업 전 반드시 `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

이번 작업은 GOAL에 적힌 하나의 목표만 수행한다.

사용자가 명시하지 않은 경우 작업자는 배포, 운영 smoke test, git commit, git push를 실행하지 말고, 수정과 로컬 검증 및 `CODEX_RESULT.md` 작성까지만 수행하라.

현재 판단:
- `initial-data` 분리 자체보다 lazy loader 패턴 확립이 더 중요하다.
- 남은 foundation key를 무리하게 제거하지 않는다.
- `message_logs`는 응답 크기와 개인정보 노출 범위가 커질 수 있으므로 1차에서 제외한다.
- message logs는 2차에서 별도 lazy loader 또는 `/api/students/:id/messages` 같은 별도 endpoint로 검토한다.
- 1차 목적은 데이터 완성이 아니라 lazy loader 표준 패턴 확립이다.

관련 문서:
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `docs/INITIAL_DATA_SPLIT_ANALYSIS.md`

관련 route:
- `apmath/worker-backup/worker/routes/students.js`
- 필요 시 `apmath/worker-backup/worker/index.js` route 위임부 확인

관련 frontend:
- `apmath/js/student.js`

관련 DB:
- `students`
- `parent_contacts`
- `student_status_history`
- `class_transfer_history`

1차 응답 형태는 아래 구조를 기준으로 한다.

{
  "success": true,
  "student_id": "학생ID",
  "parent_contacts": [],
  "student_status_history": [],
  "class_transfer_history": []
}

## CONSTRAINTS

반드시 지킨다.

1. `/api/initial-data` 응답 구조를 변경하지 않는다.
2. `/api/initial-data`에서 key를 제거하지 않는다.
3. `message_logs`는 1차 응답에 포함하지 않는다.
4. 실제 문자/SMS/카카오/이메일 발송 기능을 만들지 않는다.
5. `message-preview` UI를 노출하지 않는다.
6. 원장/관리자 대시보드에 새 카드나 새 섹션을 추가하지 않는다.
7. 학부모 연락 통합 화면을 새로 만들지 않는다.
8. 수납·출납 foundation UI를 노출하지 않는다.
9. 학생 포털을 수정하지 않는다.
10. 플래너를 수정하지 않는다.
11. 숙제 사진 관련 파일을 수정하지 않는다.
12. OMR/시험지/아카이브 흐름을 수정하지 않는다.
13. 학생이 시험지를 직접 여는 기능을 만들지 않는다.
14. 제출 완료 OMR 수정/재입력/재제출 기능을 만들지 않는다.
15. 기존 학생 상세 문구·버튼명·화면명·탭명을 임의 변경하지 않는다.
16. 기존 상담/학부모 연락 UI의 노출 방식을 임의로 넓히지 않는다.
17. 새 API 본문을 `index.js`에 직접 구현하지 않는다.
18. 새 API 본문은 route 파일 안에서 처리한다.
19. `index.js`는 필요 시 route 위임/import만 확인 또는 최소 보강한다.
20. route 위임부에서 스코프에 없는 `teacher` 변수를 넘기지 않는다.
21. DB migration은 만들지 않는다.
22. schema.sql은 수정하지 않는다.
23. `git add`, `git commit`, `git push`는 하지 않는다.
24. `wrangler deploy`는 하지 않는다.
25. 운영 API smoke test는 하지 않는다.

## PRIORITY

충돌 시 아래 순서를 우선한다.

1. 기존 운영 흐름 보존
2. 개인정보/권한 보호
3. lazy loader 표준 패턴 확립
4. 최소 read-only API 추가
5. 기존 UI 노출 최소화
6. 로컬 검증과 정확한 완료 보고

## PLAN

### 1. 사전 확인

다음 파일을 먼저 읽는다.

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `docs/INITIAL_DATA_SPLIT_ANALYSIS.md`
- `apmath/worker-backup/worker/routes/students.js`
- `apmath/worker-backup/worker/index.js`
- `apmath/js/student.js`

확인할 것:

1. 기존 students route가 `/api/students/:id/detail-data` 또는 유사 endpoint를 이미 처리하는지 확인한다.
2. 기존 route 패턴이 path segment 기반인지 query 기반인지 확인한다.
3. `verifyAuth(request, env)` 또는 기존 인증 helper 사용 방식을 확인한다.
4. `canAccessStudent` 또는 학생 권한 필터 helper가 있는지 확인한다.
5. 없으면 기존 students route의 학생 단건 조회/수정 권한 검증 방식을 재사용한다.
6. `student.js`에서 학생 상세 렌더링 함수와 기존 parent contacts UI 사용 위치를 확인한다.
7. 기존 `state.ui` 구조를 확인한다.

### 2. Worker read-only API 구현

`apmath/worker-backup/worker/routes/students.js` 안에서 아래 endpoint를 구현한다.

Endpoint:

- `GET /api/students/:id/detail-data`

또는 현재 route parser 구조가 `resource` 기반이면 동일 의미로 아래를 지원한다.

- `/api/students/{studentId}/detail-data`

구현 원칙:

1. read-only GET만 구현한다.
2. POST/PATCH/DELETE는 만들지 않는다.
3. 학생 ID가 없으면 400.
4. 인증되지 않으면 기존 auth 정책에 따라 401.
5. 권한이 없으면 403.
6. 학생이 존재하지 않으면 404.
7. admin은 조회 가능.
8. 일반 선생님은 본인 담당 반 학생만 조회 가능.
9. 권한 검증은 기존 students route의 권한 정책과 동일하게 맞춘다.
10. `message_logs`는 조회하지 않는다.
11. `parent_contacts`는 해당 student_id만 조회한다.
12. `student_status_history`는 해당 student_id만 조회한다.
13. `class_transfer_history`는 해당 student_id만 조회한다.
14. 각 배열은 최신순 또는 기존 DB 의미에 맞는 안정적 정렬을 적용한다.
15. 응답 key 이름은 snake_case로 고정한다.

응답 예시:

{
  "success": true,
  "student_id": "s_123",
  "parent_contacts": [],
  "student_status_history": [],
  "class_transfer_history": []
}

권장 정렬:

- `parent_contacts`: 대표 연락처 우선, created_at 최신순
- `student_status_history`: changed_at 또는 created_at 최신순
- `class_transfer_history`: transferred_at 또는 created_at 최신순

컬럼명이 실제 schema와 다르면 schema 기준으로 안전하게 맞춘다.
없는 컬럼을 추측해서 query하지 않는다.

### 3. Frontend lazy loader 패턴 구현

`apmath/js/student.js`에 학생 상세 전용 lazy cache와 loader를 추가한다.

권장 구조:

- `state.ui.studentDetailLazyData`
- key는 studentId 기준

예시 구조:

{
  [studentId]: {
    loading: false,
    loadedAt: "",
    error: "",
    parent_contacts: [],
    student_status_history: [],
    class_transfer_history: []
  }
}

함수:

- `getStudentDetailLazyState(studentId)`
- `ensureStudentDetailLazyData(studentId, options = {})`
- 필요 시 `renderStudentDetailLazyStatus(studentId)` 또는 기존 렌더 함수 내부 최소 연결

`ensureStudentDetailLazyData(studentId, options)` 동작:

1. studentId 없으면 빈 상태 반환.
2. 기존 캐시가 있고 `force !== true`이며 `loadedAt`이 있으면 캐시 반환.
3. 이미 loading이면 중복 호출하지 않는다.
4. loading true 설정.
5. `/api/students/${studentId}/detail-data` 호출.
6. 성공 시 cache에 3개 배열 저장.
7. 실패 시 기존 성공 데이터는 유지하고 error만 기록.
8. loading false 처리.
9. loadedAt 기록.
10. `state.db` 전체에는 병합하지 않는다.
11. 기존 initial-data shape를 바꾸지 않는다.
12. 필요 시 현재 학생 상세 화면의 해당 작은 영역만 다시 렌더링한다.

중요:
- 이번 작업의 핵심은 패턴이다.
- UI를 크게 추가하지 않는다.
- 이미 기존 학생 상세 안에서 보호자 연락처/이력 영역을 표시하는 함수가 있으면, 그 함수가 이 캐시를 우선 참조하게 하는 정도까지만 허용한다.
- 기존 화면에 없던 새 큰 섹션은 추가하지 않는다.
- 이력은 기본 펼침으로 길게 노출하지 않는다.
- 필요하면 버튼/모달/접힘 뒤에 두되, 기존에 그런 UI가 있을 때만 연결한다.

### 4. message_logs 제외 처리

반드시 아래를 지킨다.

1. Worker detail-data API에서 `message_logs`를 select하지 않는다.
2. 응답에 `message_logs` key를 넣지 않는다.
3. `student.js` lazy cache에도 `message_logs`를 넣지 않는다.
4. 문서에는 “message_logs는 2차 별도 lazy loader 후보”로 기록한다.

### 5. 문서 업데이트

새 read-only API와 lazy loader 패턴이 생기므로 문서를 업데이트한다.

수정 대상:

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 필요 시 `docs/INITIAL_DATA_SPLIT_ANALYSIS.md`

문서 반영 내용:

1. `/api/students/:id/detail-data` read-only API 추가
2. 담당 route는 `routes/students.js`
3. 용도는 학생 상세 부가 데이터 lazy load
4. 1차 응답 범위는 `parent_contacts`, `student_status_history`, `class_transfer_history`
5. `message_logs`는 1차 제외, 2차 별도 lazy loader 후보
6. `/api/initial-data` 제거 없음
7. 학생 상세 lazy loader 표준 패턴 1차 구현
8. state.db 전체 병합 없이 `state.ui.studentDetailLazyData` 같은 화면 캐시 사용

주의:
- 문서 업데이트 중 기존 완료 목록이나 금지 원칙을 임의 삭제하지 않는다.
- 로드맵 전체를 갈아엎지 않는다.
- 이번 작업과 관련된 최소 문서만 갱신한다.

## DONE WHEN

완료 조건:

1. `GET /api/students/:id/detail-data`가 students route에서 처리된다.
2. endpoint는 read-only GET이다.
3. 응답에는 `parent_contacts`, `student_status_history`, `class_transfer_history`만 포함된다.
4. 응답에 `message_logs`가 없다.
5. 권한 없는 학생 조회가 차단된다.
6. `apmath/js/student.js`에 `ensureStudentDetailLazyData(studentId, options)` 패턴이 있다.
7. lazy loader는 `loading`, `loadedAt`, `error` 상태를 가진다.
8. lazy loader는 중복 호출을 방지한다.
9. lazy loader는 실패해도 기존 캐시 데이터를 보존한다.
10. lazy loader는 `state.db` 전체에 병합하지 않는다.
11. `/api/initial-data` 응답은 변경하지 않았다.
12. 기존 학생 상세 화면 문구·버튼명·탭명은 임의 변경하지 않았다.
13. 새 대시보드 카드나 원장 화면 노출이 없다.
14. `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`에 새 API와 lazy loader 패턴이 반영되어 있다.
15. `CODEX_RESULT.md`가 실제 변경 내용과 일치한다.

## VERIFY

반드시 실행한다.

1. `node --check apmath/worker-backup/worker/routes/students.js`
2. `node --check apmath/js/student.js`
3. `node --check apmath/worker-backup/worker/index.js` if modified

검색 검증:

1. `rg -n "detail-data|ensureStudentDetailLazyData|studentDetailLazyData|parent_contacts|student_status_history|class_transfer_history|message_logs" apmath/worker-backup/worker/routes/students.js apmath/js/student.js docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md docs/INITIAL_DATA_SPLIT_ANALYSIS.md`
2. `rg -n "message_logs" apmath/worker-backup/worker/routes/students.js apmath/js/student.js`
   - 이 검색에서 새 detail-data 응답 또는 lazy cache에 message_logs가 들어가 있으면 실패다.
   - 단, 기존 다른 기능에서 이미 쓰던 message_logs 참조가 있으면 이번 작업에서 새로 추가했는지 diff로 구분한다.
3. `rg -n "billing_templates|payments|payment_items|billing_adjustments|billing_runs|payment_methods|payment_transactions|cashbook_entries|refund_records|carryover_records|billing_policy_rules|accounting_daily_summaries|accounting_monthly_summaries" apmath/worker-backup/worker/index.js`
   - 이번 작업에서 수납·출납 initial-data 관련 회귀가 없는지 확인한다.
4. `git diff --name-only -- apmath/worker-backup/worker/routes/students.js apmath/worker-backup/worker/index.js apmath/js/student.js docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md docs/INITIAL_DATA_SPLIT_ANALYSIS.md CODEX_RESULT.md`
5. `git status --short -- apmath/worker-backup/worker/routes/students.js apmath/worker-backup/worker/index.js apmath/js/student.js docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md docs/INITIAL_DATA_SPLIT_ANALYSIS.md CODEX_RESULT.md`

운영 API smoke test는 하지 않는다.
브라우저 실기 확인은 하지 않는다.
Worker deploy는 하지 않는다.

사용자 직접 확인 항목으로 남긴다.

1. 학생 상세 화면 진입
2. 기존 학생 상세 화면이 깨지지 않는지 확인
3. 기존 상담기록 탭 유지 확인
4. 기존 보호자 연락처 UI 유지 확인
5. lazy loader 실패 시 화면 전체가 깨지지 않는지 확인
6. 권한 없는 학생 detail-data 접근이 차단되는지 운영 smoke는 사용자가 직접 확인

## OUTPUT

작업 완료 후 루트의 `CODEX_RESULT.md`에 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

- 수정/생성 파일 목록

## 2. 구현 완료 또는 확인 완료

### Worker read-only API

- `GET /api/students/:id/detail-data` 구현 여부
- read-only GET만 구현했는지 여부
- 권한 검증 적용 여부
- 응답 key 확인
- `message_logs` 제외 여부
- `/api/initial-data` 미수정 여부

### Frontend lazy loader

- `ensureStudentDetailLazyData(studentId, options)` 구현 여부
- `state.ui.studentDetailLazyData` 또는 동등 캐시 구조 구현 여부
- loading/loadedAt/error 상태 구현 여부
- 중복 호출 방지 여부
- 실패 시 기존 캐시 보존 여부
- `state.db` 전체 병합 없음 여부
- 기존 학생 상세 화면 흐름 보존 여부

### 문서 업데이트

- `PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` 업데이트 여부
- `INITIAL_DATA_SPLIT_ANALYSIS.md` 업데이트 여부 또는 미수정 사유
- message_logs 2차 분리 후보 기록 여부

### 보존 확인

- 기존 문구 변경 없음
- 기존 버튼명 변경 없음
- 기존 화면명 변경 없음
- 기존 메뉴명/탭명 변경 없음
- 학생 포털 미수정
- 플래너 미수정
- 숙제 사진 미수정
- OMR/시험지/아카이브 미수정
- 원장/관리자 대시보드 미수정
- 수납·출납 UI 노출 없음
- 실제 문자/SMS/카카오 발송 없음
- 실제 결제/청구 실행 없음

## 3. 실행 결과

- 실행한 명령
- PASS/FAIL
- 실패한 검증이 있으면 원인
- 실행하지 못한 검증이 있으면 이유

## 4. 결과 요약

- 3~6줄 요약

## 5. 잘못한 점 / 위험했던 점 / 보존한 점

- 잘못한 점: 없으면 없음
- 위험했던 점: 권한 검증, 개인정보 노출, message_logs 제외, state.db 병합 회피, 기존 학생 상세 UI 회귀 위험 기록
- 보존한 점: 기존 AP Math 화면, 학생 포털, OMR/시험지, 플래너, 숙제 사진, 수납·출납 숨김 상태 보존 기록

## 6. 배포/운영 필요 사항

- Worker deploy 필요 여부
- D1 migration 필요 여부
- 운영 API smoke 필요 여부
- 브라우저 확인 필요 항목
- git commit/push 미실행 여부
- 다음 단계 추천

## STOP RULES

아래 상황이면 멈추고 `CODEX_RESULT.md`에 기록한다.

1. `/api/students/:id/detail-data` 구현에 DB migration이 필요하면 멈춘다.
2. 권한 검증 방식이 불명확하면 추측 구현하지 말고 멈춘다.
3. `message_logs`를 포함해야만 화면이 동작하는 구조라면 포함하지 말고 멈춘다.
4. 기존 학생 상세 UI를 크게 바꿔야 한다면 멈춘다.
5. 원장/관리자 화면 변경이 필요하면 멈춘다.
6. 기존 문구·버튼명·화면명을 바꿔야 하면 멈춘다.
7. `/api/initial-data`를 수정해야 목표가 가능하다면 멈춘다.
8. 운영 API smoke test가 필요하면 실행하지 말고 사용자 직접 확인 항목으로 남긴다.
9. Worker 배포가 필요하면 실행하지 말고 사용자 직접 실행 항목으로 남긴다.
10. 목표를 달성했으면 추가 개선하지 않는다.

## 마지막 지시

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF