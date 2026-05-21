# CURRENT_DEPLOY_SMOKE_MAP

## 1. Worker 설정

- 확인 파일: `apmath/worker-backup/worker/wrangler.jsonc`
- name: `ap-math-os-v2612`
- main: `index.js`
- compatibility_date: `2026-04-18`
- D1 binding: `DB`, database_name `ap-math-os`
- R2 binding: `HOMEWORK_PHOTO_BUCKET`, bucket `apmath-homework-photo`

## 2. 배포 정책

문서 작업에서는 deploy하지 않는다. `wrangler deploy`, remote D1 apply, 운영 API smoke는 사용자 명시 승인 전 금지다.

## 3. 로컬 검증 후보

- 문서 작업: `find docs -maxdepth 3 -type f | sort`, `find docs -type f | wc -l`, `git status --short`, `git diff --name-only`
- JS 변경 시: 변경 파일별 `node --check`
- report AI proxy: `report-ai-proxy/package.json`의 `npm run check`는 `node --check api/report-analysis.js`

## 4. smoke 고위험 기준

- planner-auth-by-name 빈 값
- `teacher is not defined`
- initial-data key 누락
- student portal OMR 제출 완료 수정 노출
- timetable 운영/staging 혼선
- billing 금액 합계 불일치

