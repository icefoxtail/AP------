# CODEX_RESULT

## 1. 생성/수정 파일
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/planner.js
- CODEX_RESULT.md

## 2. 구현 완료 또는 확인 완료
- planner route 분리 완료
- index.js planner legacy 본문 제거 완료
- planner-auth-by-name / planner-auth / planner 위임 완료
- 학생포털 SSO 및 플래너 독립 로그인 정책 변경 없음
- UI/schema/migration 변경 없음

## 3. 실행 결과
- node --check apmath/worker-backup/worker/index.js: PASS
- node --check apmath/worker-backup/worker/routes/planner.js: PASS
- routes/*.js node --check: PASS
- 중복 잔존 확인:
- index.js에는 planner 위임부만 남음
- planner-auth-by-name / planner-auth / student_plans / planner_feedback 본문은 routes/planner.js로 이동 확인
- git diff --name-only -- apmath/worker-backup/worker/index.js apmath/worker-backup/worker/routes/planner.js CODEX_RESULT.md 결과:
- apmath/worker-backup/worker/index.js
- git status --short -- apmath/worker-backup/worker/index.js apmath/worker-backup/worker/routes/planner.js CODEX_RESULT.md 결과:
- M CODEX_RESULT.md
- M apmath/worker-backup/worker/index.js
- ?? apmath/worker-backup/worker/routes/planner.js
- 배포 여부: 미실행
- smoke 결과: 미실행

## 4. 결과 요약
- index.js에서 planner API 본문을 제거하고 routes/planner.js로 이동했다.
- 기존 응답 구조와 인증 흐름은 보존했다.
- teacher 스코프 위험 없이 handler 내부 인증 방식으로 정리했다.

## 5. 다음 조치
- 배포 후 planner-auth-by-name 실제 학생 계정 smoke 확인
- index.js 남은 legacy 블록 재평가
