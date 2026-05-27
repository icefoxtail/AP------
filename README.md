# AP_ONBOARDING_ROUND_4_3_GPT_FIXED_PATCH

## 포함 파일
- apmath/js/dashboard.js
- tools/test-onboarding-tasks.mjs

## 보정 내용
- 학부모 복사 문구 3개를 확정 원문으로 복구
- 패널 안내 문구를 확정 원문으로 복구
- 이번 단계 넘기기 확인 문구 쉼표 포함 원문 복구
- test-onboarding-tasks.mjs에 원문 문장 단위 검증 추가
- 잘못된 표현 금지 검사 보강

## 검증 결과
- node --check apmath/js/dashboard.js PASS
- node --check tools/test-onboarding-tasks.mjs PASS
- node tools/test-onboarding-tasks.mjs PASS
- node --check apmath/js/student.js PASS
- node --check apmath/worker-backup/worker/index.js PASS
- node --check apmath/worker-backup/worker/routes/onboarding.js PASS
- onboarding route import PASS
