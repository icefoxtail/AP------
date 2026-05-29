cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업명

원장님 AP MATH / EIE 공용 로그인 브릿지 1차

## 1. 작업 목적

원장님은 AP MATH에 들어가든 EIE에 들어가든 한 번 로그인하면 수학과 영어 운영 화면을 모두 볼 수 있어야 한다.

왕지교육 큰 대문은 공개 홈페이지로 유지한다.
왕지교육 대문에는 로그인 세션을 만들지 않는다.

이번 작업의 목표는 “원장님 운영 로그인만 공용처럼 동작”하게 만드는 것이다.

원칙:
- 원장님 = AP MATH / EIE 공용 운영 접근
- 선생님 = 각 교육관별 분리 가능
- 학생 = 각 포털별 간편 진입
- 왕지교육 대문 = 공개 브랜드 허브, 로그인 없음

## 2. 현재 확정 사실

EIE 백엔드 연결은 정상이다.

확정:
- EIE Worker 운영 주소: https://wangji-eie-os.js-pdf.workers.dev
- EIE D1: wangji-eie-os
- EIE remote D1 teachers 테이블에 admin 계정 있음
- /api/auth/login 성공 확인
- 발급된 session_token으로 아래 API 호출 성공 확인
  - /api/eie/timetable
  - /api/eie/student-seeds
  - /api/eie/needs-review

현재 문제:
- EIE 화면은 session_token이 없으면 Unauthorized가 뜬다.
- 원장님이 AP MATH에 로그인해도 EIE session_token은 자동으로 생기지 않는다.
- 반대로 EIE에 로그인해도 AP MATH 원장 세션과 연결되지 않는다.

이번 작업은 이 간극을 브릿지로 메운다.

## 3. 프로젝트 루트

AP 프론트/운영 앱 루트:

C:\Users\USER\Desktop\AP------

EIE Worker 루트:

C:\Users\USER\Desktop\wangji-eie-worker

반드시 위 경로 기준으로 작업한다.

## 4. 절대 금지

- git add 금지
- git commit 금지
- git push 금지
- wrangler deploy 금지
- remote D1 migration 금지
- APMS 기존 로그인/로그아웃/세션/dashboard 흐름 전체 교체 금지
- APMS /api/initial-data 응답 구조 변경 금지
- EIE Worker 인증 정책 무단 변경 금지
- 왕지교육 대문 index.html 수정 금지
- apmath-home/index.html 수정 금지
- archive/ 수정 금지
- apmath/student/ 수정 금지
- 프로젝트 전체 압축 금지
- 루트 임시 폴더 생성 금지
- 비밀번호 하드코딩 금지
- session_token 하드코딩 금지
- admin1234 같은 값을 코드에 저장 금지

## 5. 이번 작업의 핵심 방향

완전한 공통 인증 서버를 새로 만들지 않는다.

이번 1차는 “브릿지 로그인”이다.

브릿지 방식:
1. 원장님이 AP MATH 로그인 화면에서 로그인한다.
2. AP MATH 로그인이 성공하면 같은 login_id/password로 EIE /api/auth/login도 조용히 호출한다.
3. EIE 로그인도 성공하면 EIE session_token을 localStorage에 저장한다.
4. 원장님이 EIE 화면으로 이동하면 이미 저장된 EIE token으로 바로 진입한다.

반대 방향도 가능하게 한다.
1. 원장님이 EIE 로그인 화면에서 로그인한다.
2. EIE 로그인이 성공하면 EIE session_token을 저장한다.
3. 가능하면 같은 login_id/password로 AP MATH 로그인도 조용히 시도한다.
4. AP MATH 로그인도 성공하면 AP MATH 기존 세션 저장 흐름을 유지한다.
5. 불가능하면 EIE 로그인만 성공시키고 AP MATH 브릿지 실패는 낮은 위계 notice로 남긴다.

중요:
- 원장님 입장에서는 한 번 로그인한 것처럼 느끼게 한다.
- 내부적으로 AP MATH token과 EIE token은 분리 저장해도 된다.
- 최종 공용 토큰은 나중에 별도 설계한다.

## 6. 먼저 조사할 것

작업 전 아래를 확인한다.

### 6.1 AP MATH 로그인 구조 확인

아래 키워드로 APMS 로그인 파일과 API를 찾는다.

- login
- logout
- session
- token
- teacher
- admin
- password
- localStorage
- Authorization
- Bearer

예시:

Get-ChildItem .\apmath -Recurse -File -Include *.js,*.html | Select-String -Pattern "login|logout|session|token|teacher|admin|password|localStorage|Authorization|Bearer" -CaseSensitive:$false

확인할 것:
- AP MATH 로그인 submit 함수 위치
- AP MATH 로그인 API endpoint
- AP MATH 로그인 성공 응답 구조
- AP MATH token/localStorage key
- 원장님/admin 판별 방식
- 기존 logout 처리 방식

### 6.2 EIE 로그인 구조 확인

현재 EIE Worker 인증은 확인됐다.

EIE 로그인 API:
- POST https://wangji-eie-os.js-pdf.workers.dev/api/auth/login

요청 body:
- login_id
- password

응답:
- success
- id
- name
- role
- login_id
- session_token
- expires_at

EIE token 저장 key는 이번 작업에서 아래로 고정한다.
- WANGJI_EIE_SESSION_TOKEN

호환 key:
- WANGJI_SESSION_TOKEN
- TEACHER_SESSION_TOKEN

## 7. 구현 범위

수정 허용:
- AP MATH 로그인 관련 프론트 JS
- AP MATH logout 관련 프론트 JS
- EIE 로그인/세션 관련 프론트 JS
- eie/js/eie-api.js
- eie/js/eie-app.js
- eie/js/eie-router.js
- eie/css/eie.css
- 필요 시 docs/*.md
- CODEX_RESULT.md

수정은 최소화한다.

가능하면 새 공통 helper 파일을 만든다.

권장 새 파일:
- apmath/js/wangji-owner-login-bridge.js

또는 EIE 전용:
- eie/js/eie-owner-login.js

하지만 AP MATH와 EIE 양쪽에서 재사용 가능한 위치가 더 안전하면:
- shared/js/wangji-owner-auth-bridge.js
단, 새 shared 폴더가 기존 구조와 충돌하지 않도록 한다.

## 8. 원장님 브릿지 helper 요구사항

공통 helper를 만들 수 있으면 아래 기능을 제공한다.

권장 전역 객체:
window.WangjiOwnerAuthBridge

필수 메서드:
- loginEieWithCredentials(loginId, password)
- saveEieSession(payload)
- getEieToken()
- clearEieSession()
- hasEieSession()
- isAdminPayload(payload)
- bridgeAfterApmathLogin(loginId, password, apmathPayload)
- bridgeAfterEieLogin(loginId, password, eiePayload)

EIE token 저장:
- WANGJI_EIE_SESSION_TOKEN
- WANGJI_EIE_LOGIN_ID
- WANGJI_EIE_ROLE
- WANGJI_EIE_NAME
- WANGJI_EIE_EXPIRES_AT

호환 저장:
- WANGJI_SESSION_TOKEN
단, 기존 APMS가 같은 key를 쓰고 있다면 충돌 가능성이 있으므로 조사 후 결정한다.
충돌 위험이 있으면 WANGJI_EIE_SESSION_TOKEN만 저장하고 EieApi가 이 key를 우선 읽게 한다.

중요:
비밀번호는 localStorage/sessionStorage에 저장하지 않는다.
비밀번호는 로그인 직후 브릿지 호출에만 사용한다.

## 9. AP MATH 로그인 후 EIE 브릿지

AP MATH 기존 로그인 성공 흐름을 찾아서, 성공 이후에만 EIE 브릿지를 추가한다.

조건:
- 로그인 사용자가 admin/원장 권한이면 EIE 브릿지 시도
- teacher 일반 권한이면 브릿지하지 않거나 보류
- admin 판별이 불확실하면 기존 role 값 확인 후 안전하게 처리

동작:
1. AP MATH 기존 로그인 성공
2. 기존 AP MATH 세션 저장 완료
3. 같은 login_id/password로 EIE /api/auth/login 호출
4. 성공 시 WANGJI_EIE_SESSION_TOKEN 저장
5. 실패 시 AP MATH 로그인은 막지 않음
6. 실패는 console.warn 또는 낮은 위계 notice만 표시
7. EIE 진입 시 토큰 없으면 EIE 로그인 화면 표시

주의:
AP MATH 로그인을 실패시키면 안 된다.
EIE 브릿지 실패가 AP MATH 운영 진입을 막으면 안 된다.

## 10. EIE 로그인 화면 1차

EIE 화면에 token이 없으면 로그인 화면을 표시한다.

단, 이 로그인 화면은 EIE 전용이면서도 원장님 공용 브릿지 입구 역할을 한다.

필드:
- 아이디
- 비밀번호

버튼:
- 로그인

문구:
- 원장님 계정으로 로그인합니다.
- 로그인 상태는 이 브라우저에 저장됩니다.

성공:
- EIE session_token 저장
- EIE dashboard 표시
- 가능하면 AP MATH 세션 브릿지 시도
- AP MATH 브릿지가 어렵거나 기존 구조상 위험하면 이번 라운드에서는 EIE만 처리하고 CODEX_RESULT.md에 남긴다.

실패:
- 로그인 정보를 확인해 주세요.
- EIE 서버에 연결하지 못했습니다.
- 다시 로그인해 주세요.

금지:
- 비밀번호 찾기
- 회원가입
- 학생 로그인
- 학부모 로그인
- 과한 모달
- 왕지교육 대문 로그인 연결

## 11. EIE API helper 보정

eie/js/eie-api.js 확인 후 보정한다.

필수:
1. PROD_WORKER_ORIGIN 유지
   https://wangji-eie-os.js-pdf.workers.dev

2. token 읽기 우선순위에 WANGJI_EIE_SESSION_TOKEN 추가
   최우선으로 읽는다.

3. Unauthorized 처리 개선
   - 401이면 token 만료/없음으로 판단할 수 있게 error.status = 401 유지
   - EieApp 또는 Router에서 로그인 화면으로 전환 가능하게 한다.

4. 깨진 한글 문구 복구
   예:
   - 요청을 처리하지 못했습니다.
   - 운영 데이터를 불러오지 못했습니다.
   - 로그인이 필요합니다.

## 12. EIE router/app 흐름

권장 흐름:
1. EIE boot
2. token 존재 확인
3. token 없으면 로그인 화면 렌더
4. token 있으면 기존 EieRouter.boot()
5. API 호출 중 401 Unauthorized가 나오면:
   - WANGJI_EIE_SESSION_TOKEN 제거
   - 로그인 화면 표시
   - 메시지: 다시 로그인해 주세요.

단, 일부 API fallback이 기존처럼 화면 notice만 표시해야 하는 경우는 유지한다.
401 Unauthorized만 로그인 화면으로 전환한다.

## 13. Logout 정책

EIE 로그아웃 버튼을 추가한다.

위치:
- EIE 헤더 우측
또는
- EIE 사이드바 하단

문구:
- 로그아웃

동작:
1. EIE /api/auth/logout 호출 시도
2. 실패해도 localStorage token 제거
3. EIE 로그인 화면 표시

AP MATH 로그아웃과의 관계:
- 이번 라운드에서는 AP MATH logout 시 EIE token도 제거할 수 있으면 제거한다.
- AP MATH logout 코드 위치를 안전하게 찾은 경우만 추가한다.
- 못 찾거나 위험하면 CODEX_RESULT.md에 남긴다.

권장:
AP MATH에서 원장님 로그아웃 시:
- 기존 APMS token 제거
- WANGJI_EIE_SESSION_TOKEN 제거

## 14. 프론트 UI/문구 기준

짧게 쓴다.

허용 문구:
- 원장님 로그인
- 로그인
- 로그아웃
- 아이디
- 비밀번호
- 로그인 정보를 확인해 주세요.
- 다시 로그인해 주세요.
- EIE 서버에 연결하지 못했습니다.

피할 문구:
- 통합 인증 시스템
- SSO
- 엔터프라이즈
- 토큰
- 세션 만료 코드
- 기술적인 긴 오류

## 15. Worker 설정 정리

EIE Worker 폴더에는 wrangler.toml과 wrangler.jsonc가 함께 있을 수 있다.

확인된 문제:
- wrangler.jsonc는 AP Math 설정 찌꺼기다.
- EIE 작업은 wrangler.toml 기준으로 해야 한다.

이번 작업에서 Worker 명령이 필요하면:
cd C:\Users\USER\Desktop\wangji-eie-worker
wrangler deployments list --config .\wrangler.toml

deploy는 하지 않는다.

문서에 명시:
- EIE Worker는 wrangler.toml 기준
- wrangler.jsonc는 AP Math 설정이므로 EIE 명령에 사용하지 않는다.

## 16. 기존 APMS 회귀 방지

아래를 반드시 보존한다.

- AP MATH 원장 로그인 성공 흐름
- AP MATH 선생님 로그인 성공 흐름
- AP MATH logout 흐름
- APMS dashboard 이동
- APMS /api/initial-data
- 선생님 화면에 EIE 노출 금지
- 학생 포털
- archive

브릿지 실패 시 AP MATH 로그인 자체가 실패하면 안 된다.

## 17. 테스트/검증

AP------ 루트에서 실행:

node --check .\eie\js\eie-api.js
node --check .\eie\js\eie-app.js
node --check .\eie\js\eie-router.js

수정한 AP MATH JS도 검사한다.
예:
node --check .\apmath\js\core.js
node --check .\apmath\js\dashboard.js
node --check .\apmath\js\dashboard-admin.js
node --check .\apmath\js\dashboard-teacher.js

실제 수정한 파일만 검사한다.

검색:
Select-String -Path .\eie\js\*.js,.\eie\js\views\*.js -Pattern "WANGJI_EIE_SESSION_TOKEN|auth/login|auth/logout|로그인|로그아웃|Unauthorized|session_token" -CaseSensitive:$false

AP MATH 쪽:
Select-String -Path .\apmath\js\*.js -Pattern "WANGJI_EIE_SESSION_TOKEN|OwnerAuthBridge|auth/login|로그인|logout|localStorage" -CaseSensitive:$false

git status:
git status --short --untracked-files=all

## 18. 수동 확인 항목

CODEX_RESULT.md에 아래를 적는다.

1. EIE 화면 접속
2. 토큰 없을 때 원장님 로그인 화면 표시
3. admin 계정으로 로그인
4. 로그인 성공 후 EIE dashboard 표시
5. 새로고침 후 EIE 로그인 유지
6. EIE 시간표/학생관리/클래스룸 API Unauthorized가 사라지는지 확인
7. EIE 로그아웃 시 로그인 화면 복귀
8. AP MATH 원장 로그인 후 EIE token 브릿지 저장 여부 확인
9. AP MATH 로그인 성공이 EIE 브릿지 실패 때문에 막히지 않는지 확인
10. AP MATH 선생님 화면 회귀 없음
11. 왕지교육 대문 로그인 없음
12. apmath-home 대문 로그인 없음

## 19. 문서화

아래 문서를 생성 또는 갱신한다.

docs/WANGJI_OWNER_LOGIN_BRIDGE_POLICY.md

내용:

# WANGJI_OWNER_LOGIN_BRIDGE_POLICY

## 1. 목적
원장님이 AP MATH와 EIE 운영 화면을 반복 로그인 없이 사용할 수 있게 한다.

## 2. 고정 원칙
- 왕지교육 대문은 공개 홈페이지
- 원장님 운영 로그인은 공용처럼 동작
- 선생님은 교육관별 분리 가능
- 학생은 별도 포털

## 3. 1차 브릿지 방식
- AP MATH 로그인 성공 후 EIE session_token 발급 시도
- EIE 로그인 성공 후 EIE session_token 저장
- 필요 시 AP MATH 세션 브릿지는 별도 보완

## 4. 토큰 저장
- WANGJI_EIE_SESSION_TOKEN
- 기존 APMS token은 기존 구조 유지

## 5. 보안 원칙
- 비밀번호 저장 금지
- session_token 하드코딩 금지
- 브릿지 실패가 기존 로그인 실패로 이어지지 않게 함

## 6. 보류
- 완전한 WANGJI_OWNER_SESSION_TOKEN 공통 인증
- AP/EIE Worker 간 공통 세션 검증
- CMath 연결

## 20. CODEX_RESULT.md 작성

루트에 CODEX_RESULT.md 작성.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 내용
## 3. 원장님 공용 로그인 브릿지 방식
## 4. EIE 로그인 화면/세션 처리
## 5. AP MATH 로그인 후 EIE 브릿지 처리
## 6. 토큰 저장 key
## 7. Unauthorized 처리
## 8. 로그아웃 처리
## 9. 실행 결과
## 10. 수동 확인 항목
## 11. 기존 APMS 보존 확인
## 12. 남은 작업
## 13. 금지 작업 준수 확인
## 14. 자체 검수 및 검수팩

## 21. 자체 검수 및 검수팩

작업 완료 후 codex-self-audit 수행.
문제 발견 시 CODEX_RESULT.md 작성 전 직접 보정.

그 다음 codex-work-review-pack으로 변경/신규 파일 중심 검수팩 생성.

검수팩 포함 권장:
- 수정한 AP MATH 로그인 관련 JS
- 수정한 EIE 로그인 관련 JS
- eie/js/eie-api.js
- eie/js/eie-app.js
- eie/js/eie-router.js
- eie/css/eie.css
- docs/WANGJI_OWNER_LOGIN_BRIDGE_POLICY.md
- CODEX_RESULT.md

프로젝트 전체 압축 금지.
apmath 전체 압축 금지.
archive 전체 압축 금지.
node_modules 포함 금지.
git add, git commit, git push 금지.

최종 보고에는 CODEX_RESULT.md 위치와 검수팩 zip 경로만 짧게 적는다.

## 22. 최종 실행 지시

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

