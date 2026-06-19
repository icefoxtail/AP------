# AP/EIE Auth Backend Audit Result

## 작업 성격
- 조사 전용
- 코드 수정 없음
- 리팩터링 없음
- 임시 백업 파일 생성 없음
- zip 생성 명령 작성 없음

## 조사 범위
- AP Math OS: `apmath/js/core.js`, `apmath/app.js`, `apmath/js/dashboard.js`, `apmath/js/dashboard-admin.js`, `apmath/js/ui.js`, `apmath/js/classroom*.js`, `apmath/js/student*.js`, `apmath/js/timetable*.js`, `apmath/js/management*.js`, `apmath/js/report.js`, `apmath/js/qr-omr.js`, `apmath/js/wangji-student-management.js`
- EIE: `eie/js/eie-app.js`, `eie/js/eie-api.js`, `eie/js/eie-router.js`, `eie/js/apms-compat/*.js`, `eie/js/views/*.js`, `eie-home/index.html`
- Archive: `archive/index.html`, `archive/mixer.html`, `archive/engine.html`, `archive/mixed_engine.html`, `archive/assessment/assessment-mvp.html`
- Shared bridge: `shared/js/wangji-owner-auth-bridge.js`
- Workers/API: `apmath/worker-backup/worker/index.js`, `apmath/worker-backup/worker/routes/auth.js`, `workers/wangji-eie-worker/index.js`, `workers/wangji-eie-worker/routes/eie.js`, `workers/wangji-common-worker/*`

## 핵심 결론
- AP 본체는 `session_token` 기반 Bearer 인증으로 전환되어 있고 `raw_password`를 localStorage에 저장하지 않도록 방어한다.
- Archive 일부 화면은 아직 `raw_password` 기반 Basic 인증만 요구하거나 localStorage에 `raw_password`를 저장한다.
- AP -> Archive 세션 브리지는 `archive/index` 및 `archive/mixer` 일부에는 있으나 `assessment-mvp`, `engine`, `mixed_engine` 경로에는 일관되게 이어지지 않는다.
- EIE는 AP 본체와 별도 세션 저장소(`WANGJI_EIE_SESSION_TOKEN`)를 사용하며, 브리지로 로그인 동기화를 시도하지만 화면 이동 시 AP 세션 복원 규칙은 제한적이다.
- EIE Worker는 Bearer만 검증한다. AP Worker는 Bearer 우선, Basic fallback을 지원한다. 즉 EIE 쪽에 Basic 토큰이 들어가면 인증 실패 가능성이 높다.

## 세션 저장/복원 지도

| 파일 | 함수/위치 | 역할 | session_token | raw_password 보존 | 위험도 | 비고 |
|---|---|---|---|---|---|---|
| `apmath/js/core.js:41` | `getSession` | `APMATH_SESSION` 읽기 | 예 | 읽기 fallback만 | P2 | AP 공통 세션 진입점 |
| `apmath/js/core.js:44` | `sanitizeSessionForStorage` | 저장 전 민감값 제거 | 예 | 아니오 | 낮음 | `raw_password`, `password`, `pw` 삭제 |
| `apmath/js/core.js:51` | `setSession` | `APMATH_SESSION` 저장 | 예 | 아니오 | 낮음 | AP 본체 저장은 안전한 방향 |
| `apmath/js/core.js:52` | `clearSession` | AP 세션 삭제 | 해당 없음 | 메모리 삭제 | 낮음 | `__APMATH_AUTH_MEMORY`도 초기화 |
| `apmath/js/core.js:722` | `handleLogin` | 로그인 성공 후 메모리 보관 | 예 | 메모리에만 보관 | P2 | 새로고침 후 Basic fallback은 사라짐 |
| `archive/index.html:2316`, `2338` | Archive 자체 로그인 | `APMATH_SESSION` 저장 | 예 | 예 | P0 | `raw_password`가 localStorage에 저장됨 |
| `archive/assessment/assessment-mvp.html:1375`, `1408` | Assessment 자체 로그인 | `APMATH_SESSION` 저장 | 누락 | 예 | P0 | `session_token`을 저장하지 않고 `raw_password` 저장 |
| `archive/index.html:2463` | `restoreApmathSessionFromHash` | hash `apmsess` 복원 | 예 | 기존값 유지 가능 | P1 | hash 제거 처리 있음 |
| `archive/mixer.html:1047` | `restoreApmathSessionFromHash` | hash `apmsess` 복원 | 예 | 기존값 유지 가능 | P1 | mixer 진입에는 복원 있음 |
| `eie/js/eie-app.js:59` | `findStoredAuth` | EIE 토큰 탐색 | 예 | 아니오 | P2 | 여러 legacy key를 허용 |
| `shared/js/wangji-owner-auth-bridge.js:16` | `saveEieSession` | EIE 세션 저장 | 예 | 아니오 | 낮음 | `WANGJI_EIE_SESSION_TOKEN` 사용 |
| `shared/js/wangji-owner-auth-bridge.js:75` | `bridgeAfterEieLogin` | EIE -> AP 세션 저장 | 예 | 아니오 | P1 | AP 세션 복원은 같은 origin localStorage에 한정 |

## 인증 헤더 지도

| 파일 | 함수/위치 | 방식 | Bearer 지원 | Basic 잔존 | getAuthHeader 사용 | 위험도 | 비고 |
|---|---|---|---|---|---|---|---|
| `apmath/js/core.js:66` | `getAuthHeader` | Bearer 우선, Basic fallback | 예 | 예 | 기준 함수 | P2 | fallback은 메모리/legacy 세션용 |
| `apmath/js/core.js:481` | `api` wrapper | 공통 API 래퍼 | 예 | 예 | 예 | 낮음 | 401 처리 포함 |
| `apmath/js/classroom-planner.js:6`, `435` | 직접 fetch | AP API 직접 호출 | 예 | 예 | 예 | P2 | 헤더는 붙지만 401 공통 파서는 우회 |
| `apmath/js/report.js:657` | AI report 직접 fetch | AP API 직접 호출 | 예 | 예 | 예 | P2 | 401 공통 처리 우회 가능 |
| `apmath/js/study-material-wrong.js:32` | 직접 fetch helper | AP API 직접 호출 | 예 | 예 | 예 | P2 | 자체 응답 처리 |
| `archive/index.html:2074` | `getIndexAssignmentAuthHeader` | Bearer 우선, Basic fallback | 예 | 예 | 별도 구현 | P1 | AP helper 중복 구현 |
| `archive/mixer.html:1907` | `getMixerAssignmentAuthHeader` | Bearer 우선, Basic fallback | 예 | 예 | 별도 구현 | P1 | AP helper 중복 구현 |
| `archive/engine.html:557` | `getAssignmentAuthHeader` | Basic only | 아니오 | 예 | 아니오 | P0 | AP Bearer 세션만 있으면 QR/API 실패 |
| `archive/mixed_engine.html:636` | `getAssignmentAuthHeader` | Basic only | 아니오 | 예 | 아니오 | P0 | mixer 출력 엔진에서 세션 단절 가능 |
| `archive/assessment/assessment-mvp.html:1123` | `getAssessmentAssignmentAuthHeader` | Basic only | 아니오 | 예 | 아니오 | P0 | AP Bearer 세션과 불일치 |
| `eie/js/eie-api.js:18` | `findStoredAuthHeader` | Bearer/Basic 문자열 허용 | 예 | 예(문자열 허용) | EIE 전용 | P1 | Worker는 Bearer만 검증 |
| `apmath/js/wangji-student-management.js:26`, `34` | AP/EIE auth headers | AP Bearer, EIE token 탐색 | 예 | 예(legacy key 문자열) | 별도 구현 | P1 | 세 저장소를 각각 탐색 |

## API 호출 지도

| 파일 | 함수/위치 | 호출 방식 | endpoint | 인증 포함 | 401 처리 | 위험도 | 비고 |
|---|---|---|---|---|---|---|---|
| `apmath/js/core.js:484` | `api.get` | `CONFIG.API_BASE` | 모든 AP 리소스 | 예 | 예 | 낮음 | `parseApiResponse` 사용 |
| `apmath/js/core.js:493` | `api.patch` | `CONFIG.API_BASE` | 모든 AP 리소스 | 예 | 예 | 낮음 | offline queue 지원 |
| `apmath/js/core.js:498` | `api.delete` | `CONFIG.API_BASE` | 모든 AP 리소스 | 예 | 예 | 낮음 | offline queue 지원 |
| `apmath/js/core.js:503` | `api.post` | `CONFIG.API_BASE` | 모든 AP 리소스 | 예 | 예 | 낮음 | offline queue 지원 |
| `archive/index.html:1481` | assignment board | hardcoded workers.dev | `qr-classes` | 예 | 부분 | P1 | 실패 시 throw/빈 목록 가능 |
| `archive/index.html:1517` | assignment board | hardcoded workers.dev | `class-exam-assignments` | 예 | 아니오 | P1 | 실패 시 빈 배열 처리 |
| `archive/index.html:2127` | assignment save | hardcoded workers.dev | `class-exam-assignments` | 예 | 아니오 | P1 | `assignment failed: status`만 throw |
| `archive/mixer.html:1952` | class modal | hardcoded workers.dev | `qr-classes` | 예 | 401 fallback | P1 | 403 안내 부족 |
| `archive/engine.html:588` | assignment save | hardcoded workers.dev | `class-exam-assignments` | Basic only | 아니오 | P0 | Bearer-only 세션에서 authHeader 없음 |
| `archive/mixed_engine.html:668` | assignment save | hardcoded workers.dev | `class-exam-assignments` | Basic only | 아니오 | P0 | Bearer-only 세션에서 authHeader 없음 |
| `archive/assessment/assessment-mvp.html:1185` | assignment save | hardcoded workers.dev | `class-exam-assignments` | Basic only | 아니오 | P0 | 자체 로그인도 token 저장 안 함 |
| `eie/js/eie-api.js:98` | EIE request | `resolveApiBase` | `/api/eie/*` | 예 | 401 throw | P1 | 403는 `isAuthError`에는 포함되지만 라우터는 일부 401만 처리 |
| `eie/js/eie-app.js:84` | `fetchWithAuth` | direct fetch | boot/초기 호출 | 예 | error throw | P1 | 별도 fetch helper |
| `shared/js/wangji-owner-auth-bridge.js:44`, `68` | bridge login | hardcoded workers.dev | EIE/AP login | no auth | 해당 없음 | P2 | 로그인 동기화 전용 |

## 401/403 처리 지도

| 파일 | 함수/위치 | 처리 방식 | 세션 삭제 | 로그인 복귀 | 사용자 안내 | 위험도 |
|---|---|---|---|---|---|---|
| `apmath/js/core.js:85` | `handleUnauthorizedResponse` | 401 공통 처리 | 예 | 예 | toast | 낮음 |
| `apmath/js/core.js:92` | `parseApiResponse` | 401이면 공통 처리 후 `{success:false}` | 예 | 예 | toast | 낮음 |
| `apmath/js/core.js:481` | `api` wrapper | GET catch는 `{}` 반환 | 아니오 | 아니오 | notify | P1 |
| `archive/index.html:2211`, `2284` | QR class load | 401이면 AP 로그인 안내 | 아니오 | 아니오 | inline | P1 |
| `archive/mixer.html:1952` | QR class load | 401이면 fallback modal | 아니오 | AP 링크 | inline | P1 |
| `archive/engine.html:588`, `1366` | save/blueprint | `!res.ok` throw 또는 warn | 아니오 | 아니오 | 제한적 | P1 |
| `archive/mixed_engine.html:668`, `752` | save/blueprint | `!res.ok` throw | 아니오 | 아니오 | 제한적 | P1 |
| `archive/assessment/assessment-mvp.html:1269` | QR class load | 401만 안내 | 아니오 | 아니오 | inline | P1 |
| `eie/js/eie-app.js:348` | `handleEie401` | EIE token 삭제 | 예 | 예 | login message | 낮음 |
| `eie/js/eie-router.js:91` | boot catch | 401만 EIE login 복귀 | 예 | 예 | login message | P1 |
| `eie/js/apms-compat/eie-apms-state.js:133`, `148` | APMS compat | 401/403 메시지 | 아니오 | 아니오 | error state | P1 |

## AP/EIE/Archive 이동 세션 지도

| 이동 경로 | 현재 방식 | 세션 유지 방식 | 문제 여부 | 위험도 | 비고 |
|---|---|---|---|---|---|
| AP 로그인 -> AP 본체 | localStorage `APMATH_SESSION` | Bearer token 저장 | 낮음 | 낮음 | `raw_password` 저장 안 함 |
| AP dashboard -> Archive index | `window.open('../archive/index#apmsess=...')` | URL hash bridge | 부분 문제 | P1 | `dashboard.js:342`에서만 적용 |
| Archive index -> mixer | `location.href=buildArchiveInternalUrl('mixer.html')` | URL hash bridge | 낮음 | P1 | `archive/index.html:1116` |
| mixer -> mixed_engine | `window.open('mixed_engine.html?...')` | localStorage 의존 | 문제 있음 | P0 | hash bridge 없음, mixed_engine Basic only |
| Archive index -> engine | `window.open(engine.html...)` | localStorage 의존 | 문제 있음 | P0 | engine Basic only |
| AP drawer/dashboard -> assessment-mvp | `window.open('../archive/assessment/assessment-mvp.html')` | bridge 없음 | 문제 있음 | P0 | AP Bearer 세션이 assessment로 복원되지 않음 |
| AP -> EIE | `location.href`/`location.replace` | EIE 별도 token 저장소 | 부분 문제 | P1 | 같은 origin이면 가능, scope/origin 분리 시 불안정 |
| EIE -> AP | `location.replace('../apmath/index.html')` | AP localStorage 또는 bridge login | 부분 문제 | P1 | URL hash 세션 전달 없음 |

## EIE 백엔드 연결 지도

| 파일 | 기능 | API 호출 방식 | 인증 방식 | 권한 처리 | 위험도 | 비고 |
|---|---|---|---|---|---|---|
| `eie/js/eie-api.js` | EIE API wrapper | `resolveApiBase()` | stored Authorization | 401 throw, 403 auth error 판정 | P1 | Worker는 Bearer 전용 |
| `eie/js/eie-app.js` | 로그인/로그아웃/boot | direct fetch | Bearer token | 401 login 복귀 | 낮음 | EIE 전용 세션 |
| `eie/js/apms-compat/eie-apms-state.js` | APMS 호환 state | `EieApi.*` | EIE wrapper | 401/403 메시지 | P1 | AP state.auth와 직접 공유하지 않음 |
| `apmath/js/wangji-student-management.js` | AP/EIE overlay | AP/EIE/overlay 직접 fetch | AP Bearer, EIE Bearer | 오류 notify 수준 | P1 | 3개 API base hardcoding |

## Worker/API 인증 지도

| endpoint/route | 인증 방식 | Bearer 지원 | Basic 지원 | role 체크 | 위험도 | 비고 |
|---|---|---|---|---|---|---|
| AP `/api/auth/login` | login_id/password | 발급 | 해당 없음 | teacher 존재 | 낮음 | `apmath/worker-backup/worker/routes/auth.js:19` |
| AP `verifyAuth` | Authorization | 예 | 예 | 이후 route별 | 낮음 | `apmath/worker-backup/worker/index.js:153` |
| AP `/api/qr-classes` | `verifyAuth` | 예 | 예 | check-omr route 내부 | 낮음 | `index.js:3203` |
| AP `/api/class-exam-assignments` | `verifyAuth` | 예 | 예 | exams route 내부 | 낮음 | `index.js:3427` |
| AP `/api/eie/*` in backup worker | `verifyAuth` | 예 | 예 | route 내부 | P2 | AP backup worker route, 별도 active EIE worker도 존재 |
| EIE `/api/auth/login` | login_id/password | 발급 | 해당 없음 | disabled 403 | 낮음 | `workers/wangji-eie-worker/index.js:128` |
| EIE `/api/eie/*` | Bearer session only | 예 | 아니오 | owner-only 일부 | P1 | `verifyTeacher`는 Bearer만 파싱 |
| EIE owner routes | Bearer + admin role | 예 | 아니오 | `requireEieOwner` | 낮음 | teacher management/import/snapshot 등 |
| Common worker `/api/wangji/*` | Bearer session | 예 | 아니오 | admin session | P2 | overlay 별도 세션 |

## P0 즉시 수정 필요

### P0-1. Archive 출력 엔진이 Bearer 세션을 인정하지 않아 AP 로그인 후에도 QR 제출 API가 실패할 수 있음
- 파일: `archive/engine.html`, `archive/mixed_engine.html`, `archive/assessment/assessment-mvp.html`
- 함수/위치: `getAssignmentAuthHeader` / `getAssessmentAssignmentAuthHeader`
- 문제: 세 파일이 `session.login_id + session.raw_password` Basic 인증만 만든다.
- 재현 가능 흐름: AP Math OS에서 로그인하면 `raw_password`는 저장되지 않고 `session_token`만 저장된다. 이후 Archive engine/mixed_engine/assessment로 이동하면 authHeader가 null 또는 Basic-only가 되어 QR class/assignment 저장이 실패한다.
- 영향: 모바일/PWA/WebView에서 AP 로그인 상태가 있어도 Archive QR 출력/제출 연동이 끊길 수 있다.
- 추천 수정 방향: Archive 엔진 계열도 `session_token` Bearer 우선, Basic legacy fallback으로 통일한다.

### P0-2. Archive 자체 로그인 코드가 `raw_password`를 localStorage에 저장함
- 파일: `archive/index.html`, `archive/assessment/assessment-mvp.html`
- 함수/위치: `archive/index.html:2316`, `2338`; `assessment-mvp.html:1375`, `1408`
- 문제: `APMATH_SESSION`에 평문 비밀번호가 `raw_password`로 저장된다.
- 영향: XSS/공유기기/WebView 저장소 노출 시 계정 비밀번호가 직접 노출된다.
- 추천 수정 방향: 로그인 응답의 `session_token`을 저장하고 `raw_password` 저장을 제거한다. legacy Basic fallback은 메모리 한정 또는 제거 검토.

### P0-3. AP -> assessment-mvp 진입은 세션 hash bridge가 없어 PWA scope 밖 이동 시 세션이 끊길 수 있음
- 파일: `apmath/js/dashboard.js`, `apmath/js/ui.js`, `archive/assessment/assessment-mvp.html`
- 함수/위치: `dashboard.js:372`, `ui.js:822`
- 문제: `archive/index`에는 `apmsess` hash bridge가 있지만 `assessment-mvp.html`로 직접 여는 경로에는 없다.
- 영향: 모바일 설치 앱/WebView에서 assessment QR 출력이 AP 로그인과 무관하게 재로그인을 요구할 수 있다.
- 추천 수정 방향: assessment URL에도 동일한 hash bridge를 적용하고 assessment 쪽 복원 함수를 추가한다.

## P1 빠른 수정 필요

### P1-1. 401/403 처리 규칙이 화면마다 다름
- 파일: Archive 계열, EIE router/compat, AP direct fetch 파일
- 문제: AP 공통 wrapper는 401 시 세션 삭제/로그인 복귀를 수행하지만, Archive와 일부 direct fetch는 throw/warn/빈 배열 처리로 갈라진다.
- 영향: 인증 만료 시 사용자가 빈 화면, 빈 데이터, 실패 메시지 없는 상태를 볼 수 있다.
- 추천 수정 방향: AP 공통 `parseApiResponse` 수준의 정책을 Archive/EIE bridge helper에도 정의한다.

### P1-2. direct fetch가 api wrapper를 우회하는 AP 파일이 남아 있음
- 파일: `apmath/js/classroom-planner.js`, `apmath/js/report.js`, `apmath/js/study-material-wrong.js`, `archive/*`
- 문제: 일부는 `getAuthHeader`를 붙이지만 `parseApiResponse`/offline queue/401 공통 처리를 우회한다.
- 영향: 인증 만료와 네트워크 실패 처리 불일치.
- 추천 수정 방향: AP 내부 API는 가능한 `api.*` 또는 공통 request helper로 흡수한다.

### P1-3. EIE client는 Basic 형식도 허용하지만 EIE Worker는 Bearer만 검증함
- 파일: `eie/js/eie-api.js`, `eie/js/eie-app.js`, `workers/wangji-eie-worker/index.js`
- 문제: client helper는 `WANGJI_AUTH_HEADER` 등에 `Basic ...`이 들어와도 그대로 전송한다. Worker `getBearerToken`은 Bearer만 받는다.
- 영향: legacy key에 Basic이 저장된 환경에서 401 발생.
- 추천 수정 방향: EIE helper에서 Bearer token만 허용하거나 Basic 입력 시 명확히 무효 처리한다.

### P1-4. Hardcoded workers.dev API base가 여러 화면에 분산됨
- 파일: `archive/index.html`, `archive/mixer.html`, `archive/engine.html`, `archive/mixed_engine.html`, `archive/assessment/assessment-mvp.html`, `shared/js/wangji-owner-auth-bridge.js`, `apmath/js/wangji-student-management.js`
- 문제: `CONFIG.API_BASE`/`EIE_API_BASE`와 별도로 production URL이 하드코딩되어 있다.
- 영향: 배포/스테이징/도메인 변경 시 일부 화면만 다른 backend를 호출할 수 있다.
- 추천 수정 방향: shared config 또는 URL resolver로 통일한다.

## P2 구조 개선 후보

### P2-1. AP/Archive 인증 helper 중복
- 파일: `apmath/js/core.js`, `archive/index.html`, `archive/mixer.html`, `archive/engine.html`, `archive/mixed_engine.html`, `archive/assessment/assessment-mvp.html`
- 문제: Bearer/Basic 생성, hash bridge, session restore 로직이 파일별로 복제되어 정책 drift가 발생했다.
- 개선 방향: `shared/js/apmath-auth.js` 같은 공통 helper로 Bearer 우선, raw_password 금지, hash bridge 복원을 단일화한다.

### P2-2. offline queue 적용 범위가 AP wrapper에 한정됨
- 파일: `apmath/js/core.js`, AP direct fetch 파일
- 문제: `api.post/patch/delete`에는 offline queue가 있으나 direct fetch는 별도 처리한다.
- 개선 방향: offline이 필요한 mutation은 wrapper를 사용하도록 정리한다.

### P2-3. role 명칭 정규화가 AP/EIE에서 분산됨
- 파일: `apmath/worker-backup/worker/index.js`, `workers/wangji-eie-worker/index.js`, `workers/wangji-eie-worker/routes/eie.js`
- 문제: AP는 `admin`, EIE는 `owner`를 `admin`으로 매핑하는 등 정책이 분산되어 있다.
- 개선 방향: owner/admin/teacher/disabled 의미를 문서화하고 bridge 저장값을 정규화한다.

## 추천 수정 순서
1. Archive engine/mixed_engine/assessment 인증 헤더를 Bearer 우선으로 바꾼다.
2. Archive/assessment 자체 로그인에서 `raw_password` localStorage 저장을 제거하고 `session_token`을 저장한다.
3. AP -> assessment-mvp 및 mixer -> mixed_engine 이동에 `apmsess` hash bridge를 적용한다.
4. Archive/EIE direct fetch의 401/403 처리 정책을 공통화한다.
5. hardcoded workers.dev API base를 shared resolver로 모은다.

## 이번 라운드에서 수정하지 않은 이유
조사 전용 라운드로 요청되었고, 코드 수정/리팩터링/파일 이동/임시 백업 생성이 금지되어 있어 애플리케이션 코드는 변경하지 않았다. 변경은 `CODEX_RESULT.md` 보고서 작성에만 한정했다.

## 확인에 사용한 검색 명령
- `rg --files`
- `git status --short`
- `rg -n "APMATH_SESSION|AUTH_KEY|getSession|setSession|clearSession|sanitizeSessionForStorage|getAuthHeader|handleUnauthorizedResponse|parseApiResponse|__APMATH_AUTH_MEMORY|raw_password|session_token" apmath eie archive shared workers -g "*.js" -g "*.html"`
- `rg -n "Authorization|Bearer|Basic|fetch\\(|API_BASE|workers\\.dev|localStorage|sessionStorage|navigator\\.onLine|AP_SYNC_QUEUE|401|403|CORS|OPTIONS" apmath eie archive shared workers -g "*.js" -g "*.html"`
- `rg -n "fetch\\(|api\\.(get|post|patch|delete)|CONFIG\\.API_BASE|workers\\.dev|getAuthHeader\\(|handleUnauthorizedResponse\\(|parseApiResponse\\(" apmath/js apmath/app.js eie/js archive/index.html archive/mixer.html archive/engine.html archive/mixed_engine.html archive/assessment/assessment-mvp.html shared/js -g "*.js" -g "*.html"`
- `rg -n "location\\.href|window\\.open|buildArchiveInternalUrl|appendCurrentArchiveSessionToHash|restoreApmathSessionFromHash|apmsess|../apmath|/apmath|eie-home|eie/|archive/|mixer\\.html|mixed_engine\\.html|engine\\.html" apmath/js apmath/index.html eie eie-home archive/index.html archive/mixer.html shared/js -g "*.js" -g "*.html"`
- `Select-String`으로 `apmath/js/core.js`, Archive HTML, EIE JS, Worker route 파일의 주변 문맥 확인

## 남은 질문
- 실제 배포 중인 AP worker가 `apmath/worker-backup/worker/index.js`와 완전히 동일한지 배포 상태 확인이 필요하다.
- 모바일 WebView/PWA에서 AP -> Archive/Assessment가 실제로 어느 origin/scope로 열리는지는 실기기 확인이 필요하다.
- 운영 로그에서 401/403이 QR 출력 경로, mixed_engine, assessment-mvp 중 어디에서 가장 많이 발생하는지 확인하면 수정 우선순위를 더 정밀하게 잡을 수 있다.
