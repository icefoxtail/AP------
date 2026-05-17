````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 재작업 사유

이전 작업 결과는 완료 보고와 실제 코드가 불일치했다.

업로드된 실제 파일 기준 검수 결과:

- `20260516_teacher_sessions.sql`: 세션 테이블 migration은 일부 존재
- `schema.sql`: `teacher_sessions` 최종 구조 반영 누락
- `index.js`: Bearer 인증 검증, 세션 테이블 조회, 로그인/로그아웃 라우팅 연결 누락
- `auth.js`: 세션 토큰 로직 일부는 있으나 `index.js`에 연결되지 않은 고립 파일
- `core.js`: `raw_password` localStorage 저장이 그대로 남아 있음
- `core.js`: `btoa(`${s.login_id}:${s.raw_password}`)` 직접 호출이 그대로 남아 있음
- `CODEX_RESULT.md`: 실제 코드와 다른 완료 보고 작성됨

이번 재작업은 이전 `CODEX_RESULT.md`를 신뢰하지 말고, 실제 파일을 처음부터 다시 열어 확인한 뒤 진행한다.

---

## 1. 절대 규칙

- 현재 프로젝트 루트에서 작업한다.
- 먼저 `CODEX_TASK.md`를 처음부터 끝까지 다시 읽고 작업한다.
- 이전 완료 보고 내용으로 대체하지 않는다.
- 실제 파일을 열어 확인하지 않은 상태로 완료 처리하지 않는다.
- 기존 문구, 버튼명, 화면명, 모달명, 안내문을 임의로 변경하지 않는다.
- 원장님/관리자 대시보드 UI를 새로 추가하거나 바꾸지 않는다.
- 학생 포털, 학생 OMR, 플래너 흐름은 이번 작업에서 건드리지 않는다.
- 학생의 시험지 직접 열기 금지 원칙을 건드리지 않는다.
- 학생 OMR 제출 완료 후 재수정 금지 원칙을 건드리지 않는다.
- 이번 작업은 선생님/원장님 로그인 인증 안정화만 목표로 한다.
- `git add`, `git commit`, `git push`는 하지 않는다.
- 기존 Basic Auth는 즉시 삭제하지 않는다.
- 새 구조는 Bearer 토큰 우선, Basic Auth fallback 임시 유지 방식으로 구현한다.
- `localStorage`에 `raw_password`, `password`, `pw`를 저장하지 않는다.
- `CODEX_RESULT.md`는 실제 코드 검증 결과와 일치해야 한다.

---

## 2. 반드시 먼저 열어볼 파일

아래 파일을 실제로 열어서 현재 상태를 확인한다.

- `schema.sql`
- `migrations/20260516_teacher_sessions.sql` 또는 실제 migration 파일명
- `index.js`
- `auth.js` 또는 실제 인증 라우트 파일
- `apmath/js/core.js`
- `CODEX_RESULT.md`

확인 후 아래를 메모하면서 작업한다.

1. Worker 엔트리 파일이 실제로 `index.js`인지
2. 로그인 API 경로가 실제로 무엇인지
3. 기존 Basic Auth 검증 함수 이름과 위치
4. 기존 `auth.js`가 실제로 사용되는 구조인지
5. D1 바인딩 이름
6. `teacher_sessions` migration이 실제 migrations 폴더에 있는지
7. `schema.sql`에 `teacher_sessions`가 반영되어 있는지
8. `core.js`의 `setSession`, `getAuthHeader`, `handleLogin`, `logout`, `api.get/post/patch/delete`, `loadData` 구조

---

## 3. 이전 실패 지점 강제 수정

### 3-1. `schema.sql` 반영

`schema.sql`에 `teacher_sessions` 테이블이 없으면 반드시 추가한다.

기준 구조:

```sql
CREATE TABLE IF NOT EXISTS teacher_sessions (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    login_id TEXT,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_used_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_teacher_sessions_token ON teacher_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_teacher ON teacher_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_expires ON teacher_sessions(expires_at);
````

이미 migration에 컬럼명이 다르게 들어가 있다면, migration과 `schema.sql`을 일치시킨다.
단, 운영 데이터 파괴성 변경은 하지 않는다.

### 3-2. migration 위치 확인

`20260516_teacher_sessions.sql`이 루트에만 있고 `migrations/`에 없으면, 프로젝트의 기존 migration 규칙에 맞게 `migrations/` 아래에 배치한다.

이미 `migrations/`에 같은 내용이 있으면 중복 생성하지 않는다.

---

## 4. Worker 인증 연결 재작업

### 4-1. 고립된 `auth.js` 금지

`auth.js`에 토큰 발급/검증/로그아웃 코드가 있어도 `index.js`에서 실제로 호출되지 않으면 실패다.

둘 중 하나로 정리한다.

#### 선택 A: 기존 Worker가 단일 `index.js` 구조라면

* `auth.js`에 만든 코드를 `index.js`에서 import하지 말고, 실제 기존 구조에 맞게 `index.js` 내부 인증 흐름에 직접 연결한다.
* 사용하지 않는 고립 파일은 남기지 않는다. 단, 삭제가 위험하면 `CODEX_RESULT.md`에 “미사용 파일로 남아 있음”을 명시한다.

#### 선택 B: Worker가 라우트 분리 구조라면

* `index.js`에서 `auth.js`를 실제 import한다.
* `/api/auth/login`, `/api/logout` 또는 기존 로그인/로그아웃 경로가 실제로 `auth.js` 핸들러를 타도록 라우팅한다.
* 라우팅 연결이 없는 `auth.js`는 실패로 간주한다.

### 4-2. 로그인 성공 시 세션 토큰 발급

기존 로그인 API에서 아이디/비밀번호 검증 성공 후 `teacher_sessions`에 새 세션을 저장한다.

응답에는 최소 아래 필드를 포함한다.

```json
{
  "success": true,
  "id": "...",
  "name": "...",
  "role": "...",
  "login_id": "...",
  "session_token": "...",
  "expires_at": "..."
}
```

주의:

* 응답에 `password`, `raw_password`, `pw`를 절대 포함하지 않는다.
* 기존 프론트가 사용하던 `id`, `name`, `role`은 유지한다.
* 기존 로그인 실패 문구는 임의 변경하지 않는다.

### 4-3. 토큰 생성 헬퍼

Worker에 안전한 토큰 생성 헬퍼를 둔다.

요구사항:

* `crypto.getRandomValues` 또는 `crypto.randomUUID` 기반
* 예측 불가능한 긴 문자열
* 기본 만료 7일
* 상수로 TTL 관리

권장 함수명:

```js
const TEACHER_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

function makeSessionToken() {}
function makeSessionExpiryIso() {}
async function createTeacherSession(env, teacher) {}
async function verifyTeacherSession(env, token) {}
async function revokeTeacherSession(env, token) {}
```

실제 프로젝트 코드 스타일에 맞게 함수명은 조정 가능하나 역할은 반드시 분리한다.

### 4-4. Bearer 인증 검증 연결

기존 인증 미들웨어 또는 인증 함수에서 다음 순서로 처리한다.

1. `Authorization: Bearer <token>`이 있으면 `teacher_sessions`에서 검증
2. Bearer가 없으면 기존 Basic Auth 검증
3. 둘 다 없거나 실패하면 기존 방식대로 401 Unauthorized

Bearer 검증 조건:

* `session_token` 일치
* `revoked_at IS NULL`
* `expires_at`이 현재시각보다 미래
* 연결된 teacher/admin 계정이 유효함
* 성공 시 기존 인증 객체와 동일한 형태로 반환

중요:

* Bearer 검증 로직이 있어도 기존 API 라우트들이 그 인증 함수를 실제로 사용하지 않으면 실패다.
* 실제 API 요청에서 Bearer 토큰이 통과되는지 코드 경로를 확인한다.

### 4-5. 로그아웃 API 연결

로그아웃 API가 없으면 추가한다.

권장 경로:

```text
POST /api/logout
```

동작:

* Bearer 토큰이 있으면 해당 세션의 `revoked_at`을 현재시각으로 업데이트
* Basic Auth만 있거나 토큰이 없으면 프론트 로그아웃을 막지 않도록 `{ success: true }` 반환
* 실패해도 프론트 세션 정리를 막지 않는다

응답:

```json
{ "success": true }
```

---

## 5. `apmath/js/core.js` 강제 수정

### 5-1. `setSession()` 민감정보 제거

현재 아래처럼 되어 있으면 실패다.

```js
function setSession(data) { localStorage.setItem(AUTH_KEY, JSON.stringify(data)); }
```

반드시 저장 전 민감정보 제거 함수를 둔다.

필수:

```js
function sanitizeSessionForStorage(data) {
    const safe = { ...(data || {}) };
    delete safe.raw_password;
    delete safe.password;
    delete safe.pw;
    return safe;
}

function setSession(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(sanitizeSessionForStorage(data)));
}
```

동등하게 안전한 구현은 허용한다.

### 5-2. 로그인 성공 처리에서 `raw_password` 저장 제거

현재 아래와 같은 코드가 남아 있으면 실패다.

```js
setSession({ login_id: lid, raw_password: lpw, id: data.id, name: data.name, role: data.role });
```

반드시 아래 방향으로 바꾼다.

```js
setSession({
    login_id: lid,
    id: data.id,
    name: data.name,
    role: data.role,
    session_token: data.session_token || '',
    expires_at: data.expires_at || ''
});
```

구버전 Basic fallback이 필요하면 로그인 직후 현재 탭 메모리에만 보관한다.

```js
window.__APMATH_AUTH_MEMORY = {
    login_id: lid,
    raw_password: lpw
};
```

단, 이 메모리 값은 localStorage에 저장하면 안 된다.

### 5-3. `btoa()` 직접 호출 제거

현재 아래 코드가 남아 있으면 실패다.

```js
btoa(`${s.login_id}:${s.raw_password}`)
```

Basic fallback용 안전 인코딩 헬퍼를 둔다.

```js
function encodeBasicAuthUnicodeSafe(value) {
    const str = String(value || '');
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        return btoa(str);
    }
}
```

더 안전한 TextEncoder 기반 구현도 허용한다.
단, `btoa()` 직접 호출은 이 헬퍼 내부 외에는 남기지 않는다.

### 5-4. `getAuthHeader()` Bearer 우선

`getAuthHeader()`는 반드시 아래 순서로 동작한다.

1. 저장 세션에 `session_token`이 있으면 Bearer 반환
2. 메모리 전용 `raw_password`가 있으면 Basic fallback 반환
3. 구버전 세션에 `raw_password`가 남아 있으면 임시 Basic fallback 가능
4. 아무 인증 정보가 없으면 `{}` 반환

기준 구현:

```js
function getAuthHeader() {
    const s = getSession();
    if (!s) return {};

    if (s.session_token) {
        return { 'Authorization': 'Bearer ' + s.session_token };
    }

    const mem = window.__APMATH_AUTH_MEMORY || {};
    const loginId = mem.login_id || s.login_id;
    const rawPassword = mem.raw_password || s.raw_password;

    if (loginId && rawPassword) {
        return { 'Authorization': 'Basic ' + encodeBasicAuthUnicodeSafe(`${loginId}:${rawPassword}`) };
    }

    return {};
}
```

프로젝트 코드 스타일에 맞게 조정 가능하나 Bearer 우선은 반드시 지킨다.

### 5-5. 401 공통 처리

`api.get`, `api.post`, `api.patch`, `api.delete`에 401 공통 처리를 연결한다.

요구사항:

* 401이면 `clearSession()`
* `state.auth` 초기화
* 가능하면 toast로 “로그인이 만료되었습니다. 다시 로그인해주세요.” 표시
* 가능하면 `renderLogin()` 호출
* `window.location.href = '/'` 강제 이동 금지
* API 결과 형태를 기존 코드와 최대한 유지

권장 헬퍼:

```js
function handleUnauthorizedResponse() {
    clearSession();
    if (state && state.auth) state.auth = { id: null, name: null, role: null };
    if (typeof toast === 'function') toast('로그인이 만료되었습니다. 다시 로그인해주세요.', 'warn');
    if (typeof renderLogin === 'function') renderLogin();
}

async function parseApiResponse(r) {
    const data = await r.json().catch(() => ({}));
    if (r.status === 401) {
        handleUnauthorizedResponse();
        return { success: false, error: 'unauthorized', status: 401 };
    }
    return data;
}
```

### 5-6. 로그아웃 처리

기존 logout 함수가 있으면 수정한다.

요구사항:

* `clearSession()` 전에 현재 `session_token` 확보
* 있으면 `POST /api/logout` 호출 시도
* 실패해도 프론트 로그아웃은 계속 진행
* localStorage 세션 제거
* 메모리 인증 정보 제거
* 로그인 화면 표시

---

## 6. 이번 재작업에서 제외할 것

아래는 이번 작업에 넣지 않는다.

* syncQueue 데드락 수정
* dashboard clipboard fallback
* management 주소록 디바운스
* schedule 이벤트 중복 방지
* report payload 누적 제한
* html2canvas 실패 처리
* clinic-print JS escape 분리
* qr-omr 경로 안전화
* 학생 포털 PIN 저장 방식 개편
* JWT/HttpOnly Cookie 전면 전환
* 관리자 대시보드 UI 변경

이번 재작업은 오직 “세션 토큰 인증 연결 + raw_password localStorage 제거”만 완성한다.

---

## 7. 검증 명령

작업 후 반드시 실행한다.

```bash
node --check index.js
node --check apmath/js/core.js
```

`auth.js`를 실제로 사용하는 구조라면:

```bash
node --check auth.js
```

또는 실제 경로에 맞게 실행한다.

아래 검색도 반드시 실행한다.

```bash
grep -R "raw_password" -n index.js auth.js apmath/js/core.js schema.sql migrations 2>/dev/null || true
grep -R "btoa" -n index.js auth.js apmath/js/core.js 2>/dev/null || true
grep -R "session_token" -n index.js auth.js apmath/js/core.js schema.sql migrations 2>/dev/null || true
grep -R "teacher_sessions" -n index.js auth.js schema.sql migrations 2>/dev/null || true
grep -R "Authorization" -n index.js auth.js apmath/js/core.js 2>/dev/null || true
```

Windows PowerShell 환경이면 동등한 `Select-String` 명령으로 확인해도 된다.

검증 기준:

* `core.js`에서 `setSession({ ..., raw_password: ... })` 형태가 남아 있으면 실패
* `core.js`에서 `setSession(data)`가 민감정보 제거 없이 그대로 저장하면 실패
* `core.js`에서 `btoa(`${s.login_id}:${s.raw_password}`)` 직접 호출이 남아 있으면 실패
* `index.js` 또는 실제 Worker 인증 경로에 Bearer 검증이 연결되어 있지 않으면 실패
* `auth.js`에만 구현되고 `index.js`에서 호출되지 않으면 실패
* `schema.sql`에 `teacher_sessions`가 없으면 실패
* migration과 schema가 불일치하면 실패
* 로그인 응답에 `session_token`, `expires_at`이 없으면 실패
* 로그아웃 토큰 폐기 경로가 없으면 실패

---

## 8. 수동 테스트 체크리스트

`CODEX_RESULT.md`에 아래 수동 테스트 체크리스트를 반드시 적는다.

* 선생님/원장님 로그인 성공
* 로그인 응답에 `session_token`, `expires_at` 포함 확인
* 로그인 후 localStorage의 `APMATH_SESSION`에 `raw_password`, `password`, `pw`가 없는지 확인
* localStorage의 `APMATH_SESSION`에 `session_token`, `expires_at`이 있는지 확인
* 새로고침 후 재로그인 없이 데이터 로드되는지 확인
* API 요청 헤더가 `Authorization: Bearer ...`를 우선 사용하는지 확인
* 로그아웃 후 localStorage 세션 제거 확인
* 로그아웃 후 같은 토큰으로 API 호출 시 실패하는지 확인
* 토큰 만료/폐기 시 로그인 화면으로 돌아가는지 확인
* 기존 Basic Auth fallback이 임시로 동작하는지 확인
* 학생 포털/플래너/OMR 흐름을 수정하지 않았는지 확인

---

## 9. 완료 보고서 작성

작업 완료 후 루트의 `CODEX_RESULT.md`를 새로 작성한다.

반드시 아래 구조를 사용한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- ...

## 2. 구현 완료 또는 확인 완료
- ...

## 3. 실행 결과
- ...

## 4. 결과 요약
- ...

## 5. 다음 조치
- ...

## 6. 잘못한 점 / 위험했던 점 / 보존해야 할 점
- 잘못한 점:
- 위험했던 점:
- 보존해야 할 점:
```

보고서에 반드시 포함할 내용:

* 이전 결과물의 어떤 점이 실제 코드와 불일치했는지
* `schema.sql`에 `teacher_sessions`를 반영했는지
* migration 위치와 파일명
* Worker에서 Bearer 인증이 실제 API 인증 흐름에 연결되었는지
* `auth.js`가 있다면 실제로 `index.js`에서 사용되는지
* 로그인 성공 시 세션 토큰이 발급되는지
* 로그아웃 시 세션 토큰이 폐기되는지
* `core.js`에서 `raw_password`가 localStorage에 저장되지 않는지
* `getAuthHeader()`가 Bearer 우선인지
* `btoa()` 유니코드 방어가 적용되었는지
* 401 공통 처리가 적용되었는지
* 기존 문구·버튼명·화면명·모달명·안내문을 임의 변경하지 않았는지
* 학생 포털/OMR/플래너 흐름을 건드리지 않았는지
* git add/commit/push를 하지 않았는지

마지막 터미널 출력은 반드시 아래 한 줄로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
