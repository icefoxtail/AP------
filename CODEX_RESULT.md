# CODEX_RESULT

작업명: 원장님 AP MATH / EIE 공용 로그인 브릿지 1차
작업일: 2026-05-30

## 1. 생성/수정 파일

| 구분 | 파일 |
|---|---|
| 신규 | `shared/js/wangji-owner-auth-bridge.js` |
| 신규 | `docs/WANGJI_OWNER_LOGIN_BRIDGE_POLICY.md` |
| 수정 | `apmath/js/core.js` |
| 수정 | `apmath/index.html` |
| 수정 | `eie/js/eie-api.js` |
| 수정 | `eie/js/eie-app.js` |
| 수정 | `eie/css/eie.css` |
| 수정 | `eie/index.html` |

## 2. 구현 내용

- 원장님이 AP MATH 또는 EIE 중 한 곳에서 로그인하면 양쪽 세션이 자동으로 브릿지됨
- 공통 브릿지 헬퍼 `window.WangjiOwnerAuthBridge` 구현 (`shared/js/`)
- EIE 화면에 토큰 없을 때 로그인 화면 자동 표시
- EIE 401 응답 시 로그인 화면으로 자동 전환
- EIE 헤더에 로그아웃 버튼 동적 추가
- AP MATH 로그아웃 시 EIE 토큰 자동 제거

## 3. 원장님 공용 로그인 브릿지 방식

### AP MATH → EIE 방향
1. 원장님이 AP MATH 로그인 성공
2. `isAdminPayload(data)` — role=admin/owner 또는 login_id=admin 판별
3. admin이면 같은 login_id/password로 EIE `/api/auth/login` 조용히 호출
4. 성공 시 `WANGJI_EIE_SESSION_TOKEN` 등 localStorage 저장
5. 실패해도 AP MATH 로그인 진입 차단 없음 (console.warn만)

### EIE → AP MATH 방향
1. 원장님이 EIE 로그인 화면에서 로그인
2. EIE 세션 저장
3. `bridgeAfterEieLogin()` — AP MATH `/api/auth/login` 조용히 시도
4. 성공 시 `APMATH_SESSION` localStorage 저장
5. 실패해도 EIE 진입 차단 없음

## 4. EIE 로그인 화면/세션 처리

- `eie-app.js` `bootWhenReady()`가 `WANGJI_EIE_SESSION_TOKEN` 존재 확인
- 토큰 없으면 `renderEieLogin()` — 전체 화면 오버레이 로그인 폼 표시
- 토큰 있으면 `EieRouter.boot()` 실행 후 헤더에 로그아웃 버튼 추가
- 로그인 폼: 아이디 / 비밀번호 / 로그인 버튼
- 오류 메시지: 로그인 정보를 확인해 주세요. / EIE 서버에 연결하지 못했습니다.

## 5. AP MATH 로그인 후 EIE 브릿지 처리

- `handleLogin()` 성공 후 `WangjiOwnerAuthBridge.bridgeAfterApmathLogin(lid, lpw, data)` 호출
- 브릿지는 `isAdminPayload()` 통과 시에만 시도 (role=admin/owner 또는 login_id=admin)
- 선생님 계정은 브릿지 미시도

## 6. 토큰 저장 key

| key | 내용 |
|---|---|
| `WANGJI_EIE_SESSION_TOKEN` | EIE session_token (eie-api.js 최우선) |
| `WANGJI_EIE_LOGIN_ID` | EIE login_id |
| `WANGJI_EIE_ROLE` | EIE role |
| `WANGJI_EIE_NAME` | EIE name |
| `WANGJI_EIE_EXPIRES_AT` | EIE expires_at |
| `APMATH_SESSION` | AP MATH 기존 세션 (구조 유지) |

`WANGJI_SESSION_TOKEN` 호환 key는 충돌 방지를 위해 EIE 쪽 신규 저장에 사용하지 않음.

## 7. Unauthorized 처리

- `eie-api.js` `get()` 함수: `error.status === 401`이면 stub 반환 대신 re-throw
- `eie-app.js` `bootWhenReady()`: EieRouter.boot() 중 401 발생 시 `handleEie401()` 호출
- `handleEie401()`: WANGJI_EIE_SESSION_TOKEN 제거 → "다시 로그인해 주세요." 로그인 화면 표시

## 8. 로그아웃 처리

### EIE 로그아웃
- `eie-app.js` `handleEieLogout()`:
  1. EIE `/api/auth/logout` POST 시도 (실패 무시)
  2. localStorage EIE 토큰 전체 제거
  3. EIE 로그인 화면 표시 ("다시 로그인해 주세요.")

### AP MATH 로그아웃 시 EIE 토큰 제거
- `core.js` `logout()` 내 `WangjiOwnerAuthBridge.clearEieSession()` 호출
- 브릿지 없을 때 fallback: `localStorage.removeItem('WANGJI_EIE_SESSION_TOKEN')`

## 9. 실행 결과

```
node --check eie/js/eie-api.js                     → OK
node --check eie/js/eie-app.js                     → OK
node --check eie/js/eie-router.js                  → OK
node --check apmath/js/core.js                     → OK
node --check shared/js/wangji-owner-auth-bridge.js → OK
```

## 10. 수동 확인 항목

| # | 항목 | 확인 방법 |
|---|---|---|
| 1 | EIE 화면 접속 | eie/index.html 열기 |
| 2 | 토큰 없을 때 원장님 로그인 화면 표시 | localStorage 비운 후 접속 |
| 3 | admin 계정으로 로그인 | 로그인 폼 입력 |
| 4 | 로그인 성공 후 EIE dashboard 표시 | 정상 진입 확인 |
| 5 | 새로고침 후 EIE 로그인 유지 | F5 후 dashboard 유지 확인 |
| 6 | EIE 시간표/학생관리/클래스룸 Unauthorized 사라짐 | 각 메뉴 클릭 |
| 7 | EIE 로그아웃 시 로그인 화면 복귀 | 헤더 로그아웃 버튼 클릭 |
| 8 | AP MATH 원장 로그인 후 WANGJI_EIE_SESSION_TOKEN 확인 | DevTools > Application > localStorage |
| 9 | AP MATH 로그인이 EIE 브릿지 실패에 막히지 않음 | EIE 미연결 환경에서 AP MATH 로그인 시도 |
| 10 | AP MATH 선생님 화면 회귀 없음 | 선생님 계정으로 AP MATH 로그인 |
| 11 | 왕지교육 대문 로그인 없음 | 루트 index.html 확인 |
| 12 | apmath-home 대문 로그인 없음 | apmath-home/index.html 확인 |

## 11. 기존 APMS 보존 확인

- AP MATH 원장 로그인 흐름: `handleLogin()` 기존 로직 유지, 브릿지는 성공 후 추가
- AP MATH 선생님 로그인: `isAdminPayload()` false → 브릿지 미시도
- AP MATH logout: 기존 흐름 유지 + EIE 토큰 제거만 추가
- APMS dashboard 이동: 변경 없음
- `/api/initial-data` 응답 구조: 변경 없음
- 선생님 화면에 EIE 노출: 없음
- 학생 포털/archive: 건드리지 않음

## 12. 남은 작업

- 완전한 WANGJI_OWNER_SESSION_TOKEN 공통 인증 (2차)
- AP/EIE Worker 간 공통 세션 서버 검증 (2차)
- CMath 연결 (미정)
- EIE token 만료 시간 자동 갱신 (미구현)

## 13. 금지 작업 준수 확인

- git add/commit/push: 미실행
- wrangler deploy: 미실행
- remote D1 migration: 미실행
- APMS 로그인/세션/dashboard 흐름 교체: 미실행
- /api/initial-data 응답 구조 변경: 미실행
- EIE Worker 인증 정책 변경: 미실행
- 왕지교육 대문 index.html 수정: 미실행
- apmath-home/index.html 수정: 미실행
- archive/ 수정: 미실행
- apmath/student/ 수정: 미실행
- 비밀번호/session_token 하드코딩: 미실행

## 14. 자체 검수 및 검수팩

### 자체 검수 결과
- 모든 수정 파일 syntax check 통과
- 브릿지 실패가 기존 로그인을 막지 않는 구조 확인 (try/catch 격리)
- 비밀번호는 localStorage에 저장하지 않음
- WANGJI_EIE_SESSION_TOKEN이 eie-api.js findStoredAuthHeader() 최우선으로 읽힘
- EIE 401만 로그인 화면 전환, 그 외 오류는 기존 fallback 유지

### 검수팩 위치
`C:\Users\USER\Desktop\AP------\CODEX_RESULT.md`

검수팩 대상 파일:
- `shared/js/wangji-owner-auth-bridge.js`
- `apmath/js/core.js`
- `apmath/index.html`
- `eie/js/eie-api.js`
- `eie/js/eie-app.js`
- `eie/css/eie.css`
- `eie/index.html`
- `docs/WANGJI_OWNER_LOGIN_BRIDGE_POLICY.md`
