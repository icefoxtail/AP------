# CODEX_RESULT

## 1. 생성/수정 파일

- 생성: `apmath/worker-backup/worker/migrations/20260516_study_material_wrongs.sql`
- 생성: `apmath/worker-backup/worker/routes/study-material-wrongs.js`
- 생성: `apmath/js/study-material-wrong.js`
- 수정: `apmath/worker-backup/worker/schema.sql`
- 수정: `apmath/worker-backup/worker/index.js`
- 수정: `apmath/student/index.html`
- 수정: `apmath/index.html`
- 수정: `apmath/js/ui.js`
- 수정: `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 수정: `docs/PROJECT_RULEBOOK_AND_MAPS.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 수업자료 오답 MVP DB 테이블과 인덱스를 migration 및 schema.sql에 반영.
- `/api/study-materials`, `/api/material-unit-ranges`, `/api/material-question-tags`, `/api/class-material-assignments`, `/api/material-omr`, `/api/material-wrongs`, `/api/material-review` route 구현.
- `index.js`에는 route import와 API 위임 조건만 추가.
- 학생 포털에 `수업자료 오답` 섹션, 번호 선택, 빠른 입력, `오답 없음`, 1회 제출 기능 추가.
- 강사용 drawer에 `수업자료 오답` 진입점 추가 및 관리 모달 구현.
- 복습 지시표 출력 데이터에는 문제 원문/PDF/archive 경로를 포함하지 않음.

## 3. 실행 결과

- `node --check apmath\worker-backup\worker\index.js` 성공
- `node --check apmath\worker-backup\worker\routes\study-material-wrongs.js` 성공
- `node --check apmath\js\study-material-wrong.js` 성공
- `node --check apmath\js\ui.js` 성공
- `apmath/student/index.html` inline script parse 확인 성공
- migration SQL 및 schema.sql에 신규 테이블 반영 확인

## 4. 결과 요약

- 기존 문구 변경 없음
- 기존 버튼명 변경 없음
- 기존 화면명 변경 없음
- 기존 메뉴명 변경 없음
- 기존 운영 용어 변경 없음
- 원장/관리자 대시보드 변경 없음
- 학생 제출 후 수정 기능 추가: 없음
- 학생 자료 원문 열기 기능 추가: 없음
- 배포 실행: 없음
- wrangler 실행: 없음
- git add/commit/push 실행: 없음

## 5. 다음 조치

- 실제 D1 migration 적용은 배포 권한자가 별도로 수행해야 함.
- 운영 반/학생 데이터로 교사용 배정 생성부터 학생 제출까지 수동 확인 필요.
