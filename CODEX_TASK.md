cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

/goal
온보딩 화면 정리분에 이어서, 나온 김에 온보딩 보안/정책 보강까지 같은 흐름에서 마무리한다.
단, 시간표/결제/APMS/문서 대규모 수정은 하지 않는다.

수정 허용:
- web-react/src/pages/Onboarding.jsx
- worker/routes/onboarding.js
- worker/helpers/profile-processor.js
- worker/helpers/module-policy.js
- web-react/src/config/profileProcessor.js
- web-react/src/config/modulePolicy.js
- tools/test-profile-processor.mjs
- CODEX_RESULT.md

금지:
- 시간표 수정 금지
- PlatformAdmin 수정 금지
- docs 수정 금지
- DB/migration 금지
- package/package-lock 수정 금지
- git add/commit/push 금지
- wrangler deploy 금지

작업:
1. Onboarding.jsx에서 `form.adminPassword || 'test1234'` 제거
   - 관리자 비밀번호 필수 입력
   - 최소 8자 검증
   - 기존 입력 라벨/버튼명은 바꾸지 않음

2. 일반 onboarding/create에서 클라이언트 plan_key, processor_override, processor_result를 신뢰하지 않게 재확인/보강
   - 서버는 profile 기준으로 processProfile 재계산
   - 일반 사용자는 무조건 free 기준으로 최종 active modules 검증
   - adjusted_modules는 사용자 의사값으로만 받고, 서버 modulePolicy로 필터링
   - core 필수 포함
   - free 미허용 모듈 제거

3. profile_json 저장 구조 재확인/보강
   - profile
   - processor_result 서버 재계산값
   - adjusted_modules
   - final_active_modules
   - processor_version
   - module_policy_version

4. Onboarding.jsx에서 UI는 계속 플랜/추천/업그레이드 문구 없이 유지
   - Free/Starter/Pro 추천 문구 다시 넣지 말 것
   - 테스트용/sandbox 일반 노출 금지 유지

5. useEffect 의존성의 `processor.active_modules.join('|')`가 위험하면 최소 수정
   - 불필요하면 건드리지 말고 CODEX_RESULT.md에 보류 기록

검증:
node --check worker/helpers/profile-processor.js
node --check worker/helpers/module-policy.js
node --check worker/routes/onboarding.js
node --check tools/test-profile-processor.mjs
node tools/test-profile-processor.mjs

cd web-react
npm.cmd run build
npm.cmd run check

CODEX_RESULT.md에 기록:
- 수정 파일
- test1234 제거 여부
- 비밀번호 8자 검증 여부
- 서버 free 강제 검증 여부
- processor_result 미신뢰 여부
- profile_json 저장 구조
- build/check 결과
- 금지 파일 미수정 여부
- git add/commit/push 하지 않았음

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
EOF