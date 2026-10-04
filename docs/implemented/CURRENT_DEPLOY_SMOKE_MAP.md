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

## 5. 2026-06-22 일정 시리즈 배포

- 승인: 사용자 명시 승인 후 실행.
- 원격 D1: `ap-math-os`에 `20260622_academy_schedules_series.sql` 적용.
- 검증:
  - `series_id`, `series_kind`, `series_until` 컬럼 존재.
  - `idx_academy_schedules_series` 존재.
  - 기존 일정 5건 백필, 누락 0건.
- Worker: `ap-math-os-v2612`
- 배포 시각: 2026-06-22 22:09 KST
- Version ID: `d01e795e-de6e-4409-abbe-76bece5ec8de` (version 187)
- URL: `https://ap-math-os-v2612.js-pdf.workers.dev`
- smoke:
  - `/api/academy-schedules` 무인증 요청 `401` 확인.
  - root `/`는 기존대로 `404`.
- 배포 전 백업: `reports/backups/ap-math-os_before_schedule_series_20260622_220845.sql`
