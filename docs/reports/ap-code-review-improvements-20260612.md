# AP------ 전체 코드 리뷰 — 개선점 목록 (우선순위순)

- 작성일: 2026-06-12
- 범위: `apmath/`(프론트엔드), `workers/` + `apmath/worker-backup/worker/`(백엔드), `eie/`, `shared/`, `archive/`, 홈페이지들(`index.html`, `*-home/`), 저장소 구조 전반
- 정렬 기준: **보안 위험 → 데이터/안정성 → 아키텍처 → 유지보수성 → 성능 → 저장소 위생** 순. 번호가 낮을수록 먼저 처리 권장.

---

## 🔴 긴급 (보안 — 즉시 조치 권장)

### 1. 실제 학생 개인정보가 git에 커밋되어 있음
- **위치**: `apmath/worker-backup/worker/initial_teacher1.json` (약 64KB), `initial_admin.json`
- **문제**: 실제 학생 이름, 학교명, 학년, 보호자 연락처, 로그인 PIN이 평문 그대로 저장소에 포함되어 있음. 저장소 접근 권한이 있는 누구나 열람 가능하고, git 히스토리에도 영구 보존됨.
- **개선**: 두 파일을 `git rm --cached`로 제거하고 `.gitignore`에 추가. 과거 히스토리에서도 제거하려면 `git filter-repo` 사용. 초기화 데이터가 필요하면 익명화된 샘플 데이터로 대체.

### 2. SQL 쿼리에 변수 문자열 연결 (SQL Injection 위험)
- **위치**:
  - `apmath/worker-backup/worker/routes/timetable-conflicts.js:169` — `` `created_at DESC LIMIT ${limit}` ``
  - `apmath/worker-backup/worker/routes/foundation-logs.js:43, 66, 92` — `LIMIT ${limit}` + 동적 테이블명
  - `apmath/worker-backup/worker/routes/parent-foundation.js:56`
  - `apmath/worker-backup/worker/helpers/foundation-db.js:74, 83, 96` — INSERT/UPDATE 시 컬럼명을 object key에서 직접 생성
  - `apmath/worker-backup/worker/index.js:516` — `ORDER BY ${order}` 검증 없이 연결
- **문제**: LIMIT/ORDER BY/컬럼명이 파라미터 바인딩 없이 문자열로 SQL에 삽입됨. 현재는 일부 숫자 검증이 있으나 방어선이 한 겹뿐.
- **개선**: `limit`은 `Number.parseInt` 후 범위 강제(예: 1~500), `order`와 컬럼명은 화이트리스트 검증을 필수화. `foundationSelect()` 헬퍼 자체에 검증을 내장해 모든 호출처가 보호되도록 변경.

### 3. CORS가 모든 origin에 열려 있음 (`Access-Control-Allow-Origin: *`)
- **위치**: `workers/wangji-eie-worker/index.js:10`, `workers/wangji-eie-worker/helpers/response.js:2`, `workers/wangji-common-worker/helpers/response.js:2`, `apmath/worker-backup/worker/index.js:37`, `apmath/worker-backup/worker/helpers/response.js:3`
- **문제**: 인증이 필요한 API를 임의의 외부 사이트에서 호출 가능. 토큰이 localStorage에 있어 쿠키 기반 CSRF보다는 덜 위험하지만, 공격 표면이 불필요하게 넓음.
- **개선**: 허용 도메인 목록(운영 도메인 + localhost)을 env 변수로 관리하고, 요청 `Origin`을 검사해 일치할 때만 echo하는 방식으로 전환.

### 4. 인증 토큰을 localStorage에 평문 저장
- **위치**: `shared/js/wangji-owner-auth-bridge.js:17, 75, 82`, `apmath/js/core.js:44~51`
- **문제**: `session_token`, `APMATH_SESSION`(login_id, name, role 포함)이 localStorage에 평문 저장됨. XSS 한 번이면 세션 탈취 가능. core.js는 비밀번호를 `window.__APMATH_AUTH_MEMORY`에 보관하는 패턴도 있음.
- **개선**: 단기적으로 sessionStorage + 토큰 만료(exp) 도입, 장기적으로 HttpOnly 쿠키 기반 세션으로 전환. 비밀번호는 어떤 형태로도 클라이언트에 보관하지 않기.

### 5. `new Function()`으로 외부 데이터 동적 실행
- **위치**: `apmath/js/core.js:1538, 1548, 1564`, `apmath/js/qr-omr.js:75`, `apmath/js/report.js:1152`
- **문제**: 문제은행/시험 데이터를 `new Function('window', text)` 형태로 실행. 데이터 출처(R2, 아카이브 파일)가 오염되면 임의 코드 실행으로 이어짐.
- **개선**: 데이터 파일을 JS 모듈 대신 JSON 포맷으로 전환하고 `JSON.parse` + 스키마 검증(구조·타입 체크)으로 교체. 당장 어렵다면 로드 후 필수 구조 검증이라도 추가.

### 6. inline `onclick` 속성에 변수 직접 삽입 (XSS 위험)
- **위치**: `apmath/js/management.js:93~97` 등 다수 (`onclick="openStudentDetail('${s.id}', ...)"` 패턴), `eie/js/views/eie-students.js:1398` 부근(이스케이프 누락 경로), `eie/js/views/eie-classroom.js:1311~1433` 일부 메시지 경로
- **문제**: 따옴표가 포함된 값이 들어오면 속성을 탈출해 스크립트 삽입 가능. `apEscapeHtml`/`esc()` 사용이 일관되지 않음.
- **개선**: inline onclick 제거 → `data-*` 속성 + 이벤트 위임(delegation)으로 전환. 모든 innerHTML 삽입 지점에서 이스케이프 함수 사용을 강제하는 공통 렌더링 헬퍼 도입.

### 7. 학생 포털 인증이 예측 가능한 PIN 기반
- **위치**: `apmath/worker-backup/worker/routes/student-portal.js:16~39`
- **문제**: 토큰이 `sha256(studentId:studentPin:상수)`로 결정적으로 생성됨. PIN이 "1101"처럼 학년 패턴으로 예측 가능하고(1번 항목 파일에서 확인), 토큰 무효화·만료 수단이 없음.
- **개선**: 서버 발급 랜덤 세션 토큰 + DB 저장 + 만료/회전 도입. 로그인 시도 rate limiting 추가.

### 8. 에러 응답에 내부 정보 노출
- **위치**: `apmath/worker-backup/worker/index.js:3430` 등 — `{ error: err.message }`를 500 응답으로 직접 반환
- **문제**: DB 에러 메시지, 내부 구조가 클라이언트에 노출될 수 있음.
- **개선**: 서버에는 `console.error`로 상세 기록, 클라이언트에는 일반화된 메시지(`Internal server error`)만 반환. 에러 응답 스키마를 통일(14번 항목과 연계).

---

## 🟠 높음 (안정성·데이터 무결성)

### 9. 다중 DB 작업에 트랜잭션 부재
- **위치**: `apmath/worker-backup/worker/routes/foundation-sync.js:6~97` 등 여러 동기화 라우트
- **문제**: 여러 INSERT/UPDATE가 트랜잭션 없이 순차 실행되어, 중간 실패 시 데이터가 반쪽만 반영됨.
- **개선**: D1의 `env.DB.batch([...])`로 원자적 실행하거나, 실패 시 보상 로직 추가.

### 10. API 에러를 빈 객체로 삼킴 (프론트엔드)
- **위치**: `apmath/js/core.js:469` — `catch (e) { return {}; }`
- **문제**: 네트워크 오류와 "데이터 없음"을 호출부에서 구분 불가. 사용자는 빈 화면만 보고 원인을 알 수 없음.
- **개선**: `{ success: false, error: 'network_error' }` 형태로 명시적 에러 상태를 반환하고, 공통 토스트로 사용자에게 알림.

### 11. localStorage 저장 실패의 조용한 무시
- **위치**: `eie/js/views/eie-timetable.js:74, 3601` 등 (try-catch로 실패를 숨김)
- **문제**: 저장소 할당량 초과 시 데이터 유실을 사용자가 인지하지 못함.
- **개선**: 공통 헬퍼 `getStorageItem(key, fallback)` / `setStorageItem`을 만들어 실패 시 경고 토스트 표시. eie 뷰들 간 제각각인 localStorage 접근 패턴도 이 헬퍼로 통일.

### 12. LIKE 검색 와일드카드 미이스케이프
- **위치**: `workers/wangji-common-worker/routes/wangji.js:81`
- **문제**: 검색어의 `%`, `_`가 그대로 LIKE 패턴에 들어가 의도치 않은 전체 매칭·성능 저하 가능.
- **개선**: 검색어에서 `%`, `_`를 이스케이프(`ESCAPE '\'` 구문) 후 바인딩.

### 13. 세션 토큰 fallback 엔트로피 부족
- **위치**: `apmath/worker-backup/worker/index.js:62` — `crypto.randomUUID` 미지원 시 16자만 사용
- **개선**: `crypto.getRandomValues`로 최소 24바이트 보장. Workers 환경에서는 randomUUID가 항상 지원되므로 fallback 자체를 제거해도 됨.

### 14. 에러 응답 형식 비일관성
- **위치**: 백엔드 전반 — `{success:false, error}` / `{success:false, message}` / `{error}` 혼용
- **개선**: `{ success, error: { code, message } }` 단일 스키마를 정의하고 response 헬퍼에서만 응답을 생성하도록 강제.

---

## 🟡 중간 (아키텍처·유지보수성)

### 15. 초대형 모놀리식 파일 분할
- **위치 및 규모**:
  | 파일 | 줄 수 |
  |---|---|
  | `eie/js/views/eie-timetable.js` | 5,049 |
  | `archive/db.js` | 5,176 |
  | `apmath/js/report.js` | 4,040 |
  | `apmath/js/dashboard.js` | 3,915 |
  | `apmath/js/timetable.js` | 3,628 |
  | `apmath/js/student.js` | 3,540 |
  | `apmath/worker-backup/worker/index.js` | 3,433 |
  | `apmath/js/classroom.js` | 3,095 |
- **문제**: 렌더링·데이터 페치·상태 관리가 한 파일에 혼재. 수정 영향 범위 파악이 어렵고 충돌이 잦음.
- **개선**: 도메인 단위로 분할 — 예: report.js → report-attendance / report-scores / report-print, eie-timetable.js → normalize / render / state 모듈. worker index.js는 라우터 모듈로 위임.

### 16. 워커 간 인증·응답 헬퍼 코드 중복
- **위치**: `workers/wangji-eie-worker/index.js:40~98` vs `apmath/worker-backup/worker/index.js:45~107` (sha256hex, makeSessionToken, verifyTeacherSession 동일 로직), `helpers/response.js` 3벌
- **개선**: `workers/shared/` 공통 모듈로 추출해 한 곳에서 관리. 보안 수정 시 한 워커만 고쳐지는 사고 방지.

### 17. eie 뷰 간 상태 관리·정규화 로직 패턴 불일치
- **위치**: `eie-timetable.js`(전역 viewState) vs `eie-classroom.js`(`window.EieState?.get?.()`) vs `eie-students.js`(혼용). `normalizeKey/normalizeDay/normalizeGrade`가 `eie-timetable.js:112~395`에 정의된 후 다른 뷰에 inline 중복.
- **개선**: `eie/js/eie-state.js` + `eie/js/eie-normalize.js` 공통 모듈로 통일.

### 18. 전역 `state` 객체 남용 (apmath 프론트엔드)
- **위치**: `apmath/js/core.js:103~129` — 20개 이상의 배열을 가진 단일 전역 객체를 모든 모듈이 직접 수정
- **개선**: 최소한 getter/setter 함수를 통한 접근으로 제한하고 변경 시 리렌더 알림(Observer) 패턴 도입. 단위 테스트 가능성도 함께 확보됨.

### 19. 하드코딩된 도메인 데이터 (교사 명단, 교시 시간, 공휴일)
- **위치**:
  - `apmath/js/timetable.js:25~42` — `TIMETABLE_FIXED_TEACHERS = ['정겨운', '정의한', '박준성']`, 교시 시간표
  - `eie/js/views/eie-timetable.js:4~25` — `DEFAULT_EIE_TEACHERS`, `STANDARD_PERIOD_TIMES`
  - `apmath/js/dashboard.js:84~89` — `DASH_HOLIDAYS` 2026년 공휴일 배열
  - `shared/js/wangji-owner-auth-bridge.js:2~3` — API 엔드포인트 URL
- **문제**: 교사 입퇴사·학사일정 변경 때마다 코드 배포 필요.
- **개선**: 교사·교시·공휴일은 DB/API에서 로드, 엔드포인트는 환경별 config 객체로 외부화.

### 20. 홈페이지 4종 간 약 40% 코드 중복
- **위치**: `index.html`(669줄), `apmath-home/`, `eie-home/`, `cmath-home/` — 헤더/푸터/Hero/Philosophy 섹션이 색상만 다르고 마크업 90% 동일
- **개선**: 정적 사이트 생성기(11ty 등) 또는 공통 CSS + CSS 변수 테마로 단일 레이아웃화. 최소한 공통 스타일시트라도 추출.

### 21. `eie/css/eie.css` 비대화 (11,106줄, 268KB)
- **위치**: 특히 `eie.css:2200~2350` 모바일 오버라이드 구간에 `!important` 60개 이상, 같은 셀렉터가 브레이크포인트마다 3회 이상 재정의
- **개선**: `!important` 제거를 목표로 셀렉터 특이도 재설계, 반복 값은 CSS 커스텀 프로퍼티로 변수화, 가능하면 컴포넌트별 파일 분리 후 빌드 단계에서 병합.

### 22. 문서 폴더의 소스 코드 사본 (싱크 깨짐)
- **위치**: `docs/review-packs/eie-round1-docs-model-policy-review-pack-20260528/apmath/` — dashboard.js(200KB), worker index.js(172KB) 등 구버전 전체 사본
- **개선**: 리뷰 완료된 팩은 삭제하거나 커밋 해시 참조로 대체. 코드 사본을 문서에 두지 않기.

---

## 🟢 보통 (성능·품질)

### 23. 서비스 워커가 캐시 전략 없이 모든 요청을 네트워크로 전달
- **위치**: `apmath/service-worker.js` (13줄, `fetch(event.request)`만 수행)
- **개선**: 정적 자산(JS/CSS/아이콘)은 cache-first, API는 network-first + 오프라인 폴백 구현. PWA manifest가 이미 있으므로 효과가 큼.

### 24. 리스트 렌더링 시 DOM 쿼리 반복·디바운스 누락
- **위치**: `apmath/js/classroom.js`(getElementById 43회), `dashboard.js`(39회), `management.js:29`의 주소록 검색만 180ms 디바운스 적용
- **개선**: 자주 쓰는 요소 참조 캐싱, 검색·필터 입력 전반에 디바운스 적용, 대량 리스트는 DocumentFragment로 일괄 삽입.

### 25. 비동기 요청 취소 부재 (경쟁 상태)
- **위치**: apmath/eie 프론트엔드 전반의 fetch 패턴
- **문제**: 화면 전환 후에도 이전 요청 응답이 도착해 상태를 덮어씀.
- **개선**: 뷰 전환 시 `AbortController.abort()` 호출하는 공통 패턴 도입.

### 26. 프로덕션 콘솔 로그에 민감 정보 출력
- **위치**: `apmath/js/clinic-print.js:314`, `apmath/js/report.js:3171, 3241` 등 — 학생 ID·성적 payload 로깅
- **개선**: 디버그 플래그(`window.__DEBUG__`) 뒤로 숨기거나 배포 전 제거.

### 27. 입력 검증 부족 (클라이언트)
- **위치**: `apmath/js/management.js:265~276` 등 — 필수값 공백 체크만 존재
- **개선**: 길이 제한·형식(전화번호, 이메일) 검증 추가. 서버 검증 에러를 필드 단위로 표시.

### 28. 생성된 대용량 데이터 파일이 git에 포함
- **위치**: `archive/assessment/assessment-packs-1sem.generated.js`(3.4MB), `assessment-question-index-1sem.generated.js`(1.8MB), `apmath/vendor/xlsx.full.min.js`(864KB)
- **문제**: 갱신할 때마다 거대한 diff 발생, 저장소 비대화(.git 157MB).
- **개선**: `.generated.js`는 빌드 산출물로 취급해 R2/CDN에서 로드하거나 Git LFS로 이전. xlsx는 npm 패키지 또는 CDN+SRI로 대체.

---

## ⚪ 낮음 (저장소 위생)

### 29. 임시·캐시·백업 디렉토리가 git에 추적됨
- **위치**:
  - `.wrangler/cache/` (3곳, `wrangler-account.json` 포함)
  - `_tmp/` (1MB 감사 스크립트)
  - `codex_tmp_py/` (1.6MB — pypdf 라이브러리 통째 벤더링)
  - `_patch_apmath_worker_student_onboarding_*` (일회성 패치 ps1 스크립트 2개 디렉토리)
  - `.superpowers/` (IDE 생성 파일)
  - `CODEX_RESULT.md`, `CODEX_RESULT1.md` (gitignore 규칙은 있으나 이미 커밋된 상태)
- **개선**: 일괄 `git rm -r --cached` 후 `.gitignore`에 `_tmp/`, `codex_tmp_py/`, `**/.wrangler/`, `.superpowers/`, `/_patch_*/` 추가. `.gitignore` 자체도 중복 규칙(archive/textbook 3회 반복) 정리.

### 30. `apmath/worker-backup/` 전체가 저장소에 커밋됨
- **위치**: `apmath/worker-backup/` (worker 코드 + 마이그레이션 + 293KB SQL 백업)
- **문제**: 운영 코드의 사본이라 16번(코드 중복)의 근본 원인이기도 함. 어느 쪽이 진짜 소스인지 불명확.
- **개선**: 실제 배포 소스를 `workers/` 아래로 일원화하고, 백업은 별도 브랜치/태그 또는 외부 스토리지로 이동.

### 31. 마이그레이션 파일명에 공백 포함
- **위치**: `apmath/worker-backup/worker/migrations/Stage7a operation memos teacher.sql`
- **개선**: `Stage7a_operation_memos_teacher.sql`로 변경. 마이그레이션 파일명 규칙(날짜 접두사)도 통일 권장 (`stage5g2_pin_unique.sql` vs `stage5g_2_pin_unique.sql` 같은 중복 의심 파일 정리 포함).

### 32. 최상위 README / 구조 문서 부재
- **위치**: 저장소 루트 (추적 파일 1,657개, 디렉토리 70여 개인데 안내 문서 없음)
- **문제**: `alive/`, `check/`, `archive/archive/` 등 용도를 알 수 없는 디렉토리가 다수.
- **개선**: 루트 `README.md`에 디렉토리별 용도·배포 절차·소스 오브 트루스(어느 worker가 운영본인지)를 문서화. 모호한 디렉토리는 이름 변경 또는 목적 명시.

### 33. 테스트 부재
- **위치**: `tests/`에 fixture만 존재, 테스트 러너·CI 설정 없음 (`.github/workflows/`에는 R2 자산 복사 워크플로만 존재)
- **문제**: 전역 상태·DOM 의존 구조(18번)와 맞물려 회귀 검증 수단이 전무.
- **개선**: 우선 worker 라우트(순수 함수에 가까움)부터 vitest 등으로 단위 테스트 도입, CI 워크플로 추가. 프론트엔드는 18번 리팩토링과 병행해 순수 함수부터 테스트.

---

## 요약

| 구분 | 항목 번호 | 핵심 |
|---|---|---|
| 🔴 긴급 (보안) | 1~8 | 개인정보 커밋 제거, SQL 인젝션 차단, CORS 제한, 토큰 저장 방식 개선 |
| 🟠 높음 (안정성) | 9~14 | 트랜잭션, 에러 처리 일원화, 입력 이스케이프 |
| 🟡 중간 (아키텍처) | 15~22 | 모놀리식 파일 분할, 중복 제거, 하드코딩 데이터 외부화 |
| 🟢 보통 (성능·품질) | 23~28 | SW 캐시 전략, DOM 최적화, 대용량 파일 git 제외 |
| ⚪ 낮음 (위생) | 29~33 | 임시 파일 정리, 문서화, 테스트 도입 |

> 1번(개인정보)과 2~3번(인젝션·CORS)은 다른 모든 작업보다 먼저 처리할 것을 강력히 권장합니다.
