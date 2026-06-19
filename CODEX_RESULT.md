# AP/EIE Archive Auth Remediation Result

## 수정 파일
- `archive/index.html`
- `archive/mixer.html`
- `archive/engine.html`
- `archive/mixed_engine.html`
- `archive/assessment/assessment-mvp.html`
- `apmath/js/dashboard.js`
- `apmath/js/ui.js`
- `eie/js/eie-api.js`
- `eie/js/eie-router.js`
- `eie/js/eie-app.js`
- `apmath/js/classroom-planner.js`
- `apmath/js/report.js`
- `apmath/js/study-material-wrong.js`

## 해결한 문제
- Archive engine/mixed_engine/assessment Basic-only 인증
- Archive 자체 로그인 후 `raw_password` localStorage 저장
- AP -> assessment 세션 브리지 누락
- mixer -> mixed_engine 세션 브리지 누락
- Archive index -> engine 세션 브리지 누락
- EIE client가 legacy `Basic ...` auth header를 Worker로 보낼 수 있던 문제
- AP direct fetch 401/403 처리 누락
- Archive 파일 내 hardcoded AP worker URL 반복

## 핵심 변경
- Archive 출력 엔진 계열 인증을 `session_token` Bearer 우선으로 통일했다.
- Basic fallback은 `window.__APMATH_AUTH_MEMORY` 또는 기존 legacy `session.raw_password` 읽기만 허용했다.
- 새 `APMATH_SESSION` 저장은 `raw_password/password/pw`를 제거하는 sanitizer를 거치도록 했다.
- `apmsess` hash bridge를 Archive index -> engine, index -> mixer, mixer -> mixed_engine, AP -> assessment에 적용했다.
- engine/mixed_engine/assessment에 hash 복원 함수를 추가하고 복원 후 URL hash를 제거했다.
- EIE auth helper에서 `Basic ...` 값을 발견하면 제거하고 전송하지 않도록 했다.
- EIE 403은 권한 오류 안내로 로그인 화면에 복귀하도록 보강했다.
- AP direct fetch 파일은 401에서 `handleUnauthorizedResponse()`, 403에서 권한 안내를 수행하도록 보강했다.
- Archive 파일별 `ARCHIVE_AP_API_BASE` / `ASSESSMENT_AP_API_BASE` 상수로 AP API base를 모았다.

## 검증 결과
- AP -> Archive index: hash bridge 기존 동작 유지
- Archive index -> engine: `engine.html?...#apmsess=...` 적용
- Archive index -> mixer: `buildArchiveInternalUrl('mixer.html')` 유지
- mixer -> mixed_engine: 기존 `qpp/key/submitQr/class/teacher/className` query 유지 + hash bridge 적용
- AP -> assessment-mvp: dashboard/drawer 직접 진입에 hash bridge 적용
- session_token only: engine/mixed_engine/assessment auth header가 Bearer 우선으로 동작
- Basic fallback: memory/legacy fallback만 유지
- raw_password localStorage 미저장: `APMATH_SESSION` writes는 sanitizer 경유
- EIE Bearer-only: `Basic ...` legacy auth header는 제거 후 전송하지 않음
- AP direct fetch 401: common unauthorized handler 호출
- 일반 출력: authHeader가 없어도 submit QR API만 skip하고 출력 흐름은 유지
- QR 제출 출력: session이 있으면 Bearer 인증으로 class/assignment API 호출
- 모바일/WebView: hash bridge 적용. 실제 기기 origin/scope 검증은 별도 필요
- URL hash 제거: 복원 함수에서 `history.replaceState` 호출
- 콘솔 치명 오류: standalone JS와 Archive inline scripts parse 확인 통과

## 확인 명령
- `git diff --check`: 통과. LF/CRLF warning만 표시
- `node --check apmath/js/dashboard.js`
- `node --check apmath/js/ui.js`
- `node --check apmath/js/classroom-planner.js`
- `node --check apmath/js/report.js`
- `node --check apmath/js/study-material-wrong.js`
- `node --check eie/js/eie-api.js`
- `node --check eie/js/eie-app.js`
- `node --check eie/js/eie-router.js`
- `node --check eie/js/apms-compat/eie-apms-state.js`
- Node `vm.Script` inline script parse: `archive/index.html`, `archive/mixer.html`, `archive/engine.html`, `archive/mixed_engine.html`, `archive/assessment/assessment-mvp.html` 통과
- 요청된 `Select-String` checks 수행
- `Select-String -SimpleMatch "localStorage.setItem('APMATH_SESSION'"`: 모든 결과가 sanitizer 함수 내부 저장으로 확인됨

## 수정하지 않은 항목
- DB schema 변경 없음
- Worker endpoint 이름/응답 구조 변경 없음
- QR submit query/payload 구조 변경 없음
- 출력 엔진 레이아웃/문항 렌더링/MathJax 구조 변경 없음
- EIE 시간표 UI/레이아웃 변경 없음
- `mixedQuestions` localStorage 구조 변경 없음
- `CODEX_RESULT1.md` 작성 없음
- zip 생성 명령 작성 없음

## 남은 위험
- 실제 모바일 WebView/PWA origin/scope 차이는 실기기 확인이 필요하다.
- 운영 배포 Worker가 repo의 backup worker와 다르면 배포본 기준 추가 확인이 필요하다.
- API base 완전 공통화는 후속 구조 개선으로 남겨 두었다.
