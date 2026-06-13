# CODEX_RESULT — Phase 0.5 AP/EIE 운영 Smoke Test 자동화

## 0. 문서 정독 확인
- 읽은 문서:
  - `docs/reports/apmath-phase1-guard-result.md`
  - `docs/reports/apmath-phase1-function-inventory.md`
  - `docs/reports/apmath-phase1-script-order-map.md`
  - `docs/reports/apmath-phase1-split-risk-map.md`
  - `docs/reports/ap-code-review-improvements-20260612.md`
- Phase 1-0 보호망 문서 정독 여부: 완료
- 이번 작업이 Phase 0.5 smoke 자동화인지 확인: 완료
- 운영 JS 본체 수정 금지 확인: 완료
- 운영 데이터 write 금지 확인: 완료

## 1. A 구현 결과
- 생성 파일:
  - `tools/smoke-api.mjs`
  - `tools/smoke-browser.mjs`
  - `docs/reports/apmath-smoke-test-guide.md`
  - `docs/reports/apmath-smoke-test-result.md`
- 수정 파일: 없음
- 환경변수:
  - API: `AP_API_BASE`, `EIE_API_BASE`, `WANGJI_API_BASE`, `PAGES_ORIGIN`, `SMOKE_API_TIMEOUT_MS`
  - Browser: `AP_BASE_URL`, `EIE_BASE_URL`, `AP_SMOKE_ID`, `AP_SMOKE_PW`, `EIE_SMOKE_ID`, `EIE_SMOKE_PW`, `SMOKE_HEADLESS`
- read-only 보장:
  - API smoke uses only `GET` and `OPTIONS`.
  - Browser smoke only loads pages, optionally fills login fields, and checks navigation text.
  - Browser smoke does not click save/toggle/edit/delete/write controls.

## 2. B API smoke 검수
- 요청 method: `GET`, `OPTIONS`
- CORS 검사: `Access-Control-Allow-Origin` missing, `*`, or mismatch is FAIL
- `401/403` 처리: reachable로 허용
- `500` 처리: FAIL
- 비밀정보 하드코딩 여부: 없음
- PASS/FAIL: Codex B 검수 PASS. API smoke는 `GET`/`OPTIONS`만 사용하고, `Access-Control-Allow-Origin: *`를 FAIL 처리하며, Worker URL은 환경변수로 override 가능함

## 3. C Browser smoke 검수
- Playwright 사용 방식: dynamic import; missing module prints setup instructions and exits 1
- 로그인 정보 처리: environment variables only
- AP 확인 항목: page load, login/dashboard detection, optional login, post-login navigation, console/pageerror
- EIE 확인 항목: page load, login/dashboard detection, optional login, post-login navigation, console/pageerror
- write 동작 여부: 없음
- console/pageerror 수집: 있음
- PASS/FAIL: Codex C 검수 PASS. Playwright 미설치 안내, env-only credential, no-credential page smoke path, AP/EIE coverage, console/pageerror collection, headless env, failure exit 1 확인

## 4. D 테스트·회귀 검수
- `node --check`:
  - `tools/smoke-api.mjs`: 통과
  - `tools/smoke-browser.mjs`: 통과
- API smoke:
  - sandbox 기본 실행: 네트워크 제한으로 `fetch failed`
  - 승인된 read-only 네트워크 실행: 통과
  - 결과:
    - `[PASS] AP worker reachable`
    - `[PASS] AP CORS origin restricted`
    - `[PASS] AP 404 disclosure safe`
    - `[PASS] EIE worker reachable`
    - `[PASS] EIE CORS origin restricted`
    - `[PASS] EIE 404 disclosure safe`
    - `[PASS] Wangji worker reachable`
    - `[PASS] Wangji CORS origin restricted`
    - `[PASS] Wangji 404 disclosure safe`
    - `SMOKE API PASS`
- Browser smoke:
  - 실행: 미수행
  - 사유: Playwright 미설치
  - 확인된 동작: `tools/smoke-browser.mjs`가 Playwright 미설치 안내를 출력하고 exit 1
- Codex D 검수:
  - `node --check tools/smoke-api.mjs`: PASS
  - `node --check tools/smoke-browser.mjs`: PASS
  - API smoke runtime: D 봇 환경에서는 네트워크 제한으로 UNVERIFIED. 메인 실행에서 승인된 read-only 네트워크 권한으로 PASS 확인
  - Browser smoke runtime: Playwright 미설치로 UNVERIFIED
  - read-only/diff inspection: PASS
- `git diff --name-only`: `archive/mixer.html`만 추적 diff로 표시됨. 이번 작업 전부터 존재한 unrelated dirty state
- 운영 JS 수정 여부: 없음
- Worker 수정 여부: 없음
- EIE 수정 여부: 없음
- archive 수정 여부: 기존 unrelated `archive/mixer.html` dirty state 외 이번 작업 수정 없음
- tests 수정 여부: 없음
- 임시 파일 삭제 여부: 임시 파일 생성 없음

## 5. 변경 파일 목록
- `tools/smoke-api.mjs`
- `tools/smoke-browser.mjs`
- `docs/reports/apmath-smoke-test-guide.md`
- `docs/reports/apmath-smoke-test-result.md`

## 6. 미확인/보류 항목
- Playwright 설치 여부: 미설치
- 로그인 환경변수 제공 여부: 미제공
- safe-write smoke 보류 여부: 보류. 이번 phase는 read-only smoke만 허용

## 7. 다음 단계 권고
- `student.js` 분할 착수 가능 여부: smoke 검수까지 완료 후 가능
- smoke를 다음 PR에서 어떻게 사용할지: API smoke와 browser smoke를 PR 체크리스트에 추가하고, 로그인 정보는 환경변수/secret으로만 제공
