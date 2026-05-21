# HOMEWORK_PHOTO_DOMAIN

## A. 정책

- UI 용어 `숙제`를 유지하고 `과제`로 임의 변경하지 않는다.
- R2 파일 만료/삭제 정책을 훼손하지 않는다.
- 학생 제출 링크와 선생님 확인 화면을 분리한다.

## B. 현재 구현 구조

- frontend: `apmath/homework/index.html`, `apmath/js/classroom.js`, `apmath/student/index.html`
- route: `routes/homework-photo.js`
- DB: `homework_photo_assignments`, `homework_photo_submissions`, `homework_photo_files`
- config: R2 binding `HOMEWORK_PHOTO_BUCKET`

## C. 데이터/API 흐름

선생님이 assignment를 만들고 student link/overview/files를 조회한다. 학생은 링크/PIN/token으로 사진을 제출하고, 파일은 R2에 저장되며 DB에는 file key와 expires_at이 남는다.

## D. 회귀 위험

- 파일 만료/삭제 처리 누락
- 학생이 다른 학생 제출물 접근
- 숙제 상태와 homework table sync 불일치
- 단톡방 공유/QR/link 노출 범위 혼선

## E. 추가 계획

선생님 사진 뷰어, 제출 상태 요약, 24시간 만료 정책 검수, 단톡방 공유 링크 범위를 보강한다.

## F. 작업 후 업데이트 규칙

숙제 사진 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_UI_EXPOSURE_MAP.md`, `HOMEWORK_PHOTO_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

