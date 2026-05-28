cd C:\Users\USER\Desktop\AP------

@'
# CODEX_TASK - Backdoor Student Consultations created_at 제거

## 1. 목적

Claude가 추가한 백도어 학생 상세 API 5개 중 `GET /api/backdoor/students/:studentId/consultations`만 핀포인트 보정한다.

운영 D1에 없을 수 있는 `consultations.created_at` 의존을 제거해 배포 후 `no such column: created_at` 500 위험을 없앤다.

## 2. 수정 파일

- `apmath/worker-backup/worker/routes/backdoor.js`

다른 파일은 수정하지 않는다.

## 3. 금지

- 돈/수납/billing-summary 수정 금지
- 학생 상세 API 5개 라우팅 제거 금지
- `apmath/js/*` 수정 금지
- `apmath/index.html` 수정 금지
- `apmath/worker-backup/worker/index.js` 수정 금지
- `/api/initial-data` 수정 금지
- 새 API 추가 금지
- 배포 금지
- git add/commit/push 금지
- 압축 생성 금지

## 4. 수정 내용

`apmath/worker-backup/worker/routes/backdoor.js`에서 학생 상담 API 처리 함수만 찾는다.

대상 함수 후보:
- `handleStudentConsultations`
- 또는 `/students/:studentId/consultations`를 처리하는 함수

아래를 수정한다.

1. `SELECT` 목록에서 `created_at` 제거

수정 전 예시:
`id, date, type, content_preview, next_action, created_at`

수정 후:
`id, date, type, content_preview, next_action`

2. 정렬에서 `created_at` 제거

수정 전 예시:
`ORDER BY date DESC, created_at DESC, id DESC`

수정 후:
`ORDER BY date DESC, id DESC`

3. 응답에서 `created_at` 필드를 기대하거나 가공하는 코드가 있으면 제거한다.

## 5. 유지해야 할 것

아래 API는 그대로 유지한다.

- `GET /api/backdoor/students/:studentId`
- `GET /api/backdoor/students/:studentId/classes`
- `GET /api/backdoor/students/:studentId/attendance-summary`
- `GET /api/backdoor/students/:studentId/exam-summary`
- `GET /api/backdoor/students/:studentId/consultations`

공통 조건도 그대로 유지한다.

- admin-only
- GET-only
- read-only
- limit 방어
- bind 파라미터 사용
- 연락처/PIN/address 반환 금지
- write SQL 금지

## 6. 검증

아래 명령을 실행한다.

`node --check apmath/worker-backup/worker/routes/backdoor.js`

`node --check apmath/worker-backup/worker/index.js`

`git diff -- apmath/worker-backup/worker/routes/backdoor.js`

`git diff -- apmath/js apmath/index.html`

추가 확인:

`Select-String -Path apmath/worker-backup/worker/routes/backdoor.js -Pattern "created_at" -Context 3,3`

판정 기준:

- `consultations` 쿼리에서 `created_at`이 없어야 한다.
- 다른 기능의 기존 `created_at` 문자열은 이번 수정 범위가 아니면 건드리지 않는다.
- `apmath/js` diff 없어야 한다.
- `apmath/index.html` diff 없어야 한다.
- node check 2개 PASS여야 한다.

## 7. CODEX_RESULT.md append

`CODEX_RESULT.md` 끝에 아래 제목으로 짧게 append한다.

`# CODEX_RESULT_APPEND - Backdoor Student Consultations created_at Fix`

포함 내용:

- 수정 파일
- 제거한 `created_at` 의존
- 유지한 학생 상세 API 목록
- 돈/수납 미수정 확인
- 프론트 미수정 확인
- node check 결과
- 배포하지 않음
- git add/commit/push 하지 않음

## 8. 완료 보고

작업 완료 후 아래만 보고한다.

- 수정 파일
- created_at 제거 위치
- node check 결과
- 프론트 미수정 여부
- 배포하지 않았음
- git add/commit/push 하지 않았음

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
'@ | Set-Content -Path .\CODEX_TASK.md -Encoding UTF8