# WANGJI_OWNER_LOGIN_BRIDGE_POLICY

## 1. 목적

원장님이 AP MATH와 EIE 운영 화면을 반복 로그인 없이 사용할 수 있게 한다.

## 2. 고정 원칙

- 왕지교육 대문은 공개 홈페이지 (로그인 없음)
- 원장님 운영 로그인은 공용처럼 동작
- 선생님은 교육관별 분리 가능
- 학생은 별도 포털

## 3. 1차 브릿지 방식

- AP MATH 로그인 성공(admin) 후 EIE session_token 자동 발급 시도
- EIE 로그인 성공 후 EIE session_token 저장 + AP MATH 세션 브릿지 시도
- 브릿지 실패는 기존 로그인 흐름을 막지 않음

## 4. 토큰 저장 키

| 키 | 용도 |
|---|---|
| `WANGJI_EIE_SESSION_TOKEN` | EIE 세션 (최우선) |
| `WANGJI_EIE_LOGIN_ID` | EIE 로그인 ID |
| `WANGJI_EIE_ROLE` | EIE 역할 |
| `WANGJI_EIE_NAME` | EIE 이름 |
| `WANGJI_EIE_EXPIRES_AT` | EIE 만료일 |
| `APMATH_SESSION` | AP MATH 세션 (기존 구조 유지) |

## 5. 공통 헬퍼

파일: `shared/js/wangji-owner-auth-bridge.js`

전역 객체: `window.WangjiOwnerAuthBridge`

| 메서드 | 설명 |
|---|---|
| `loginEieWithCredentials(id, pw)` | EIE Worker 로그인 API 호출 |
| `saveEieSession(payload)` | EIE 세션 localStorage 저장 |
| `getEieToken()` | WANGJI_EIE_SESSION_TOKEN 읽기 |
| `clearEieSession()` | EIE 세션 전체 제거 |
| `hasEieSession()` | EIE 토큰 존재 여부 |
| `isAdminPayload(payload)` | admin/owner 판별 |
| `bridgeAfterApmathLogin(id, pw, payload)` | AP MATH 로그인 후 EIE 브릿지 |
| `bridgeAfterEieLogin(id, pw, payload)` | EIE 로그인 후 AP MATH 브릿지 |

## 6. 보안 원칙

- 비밀번호 localStorage/sessionStorage 저장 금지
- session_token 코드 하드코딩 금지
- 브릿지 실패가 기존 로그인 실패로 이어지지 않음

## 7. 보류 (2차 이후)

- 완전한 WANGJI_OWNER_SESSION_TOKEN 공통 인증
- AP/EIE Worker 간 공통 세션 검증
- CMath 연결
