cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
EIE APMS 리베이스 Round 1.1 보정 지시서

작업 루트:
C:\Users\USER\Desktop\AP------

상황:
Round 1 호환 레이어 작업은 구현됐지만 외부감사에서 FAIL 판정을 받았다.
감사 결과의 핵심 FAIL 사유는 다음 4개다. :contentReference[oaicite:0]{index=0}

1. apmath-home/index.html이 git status에 수정으로 잡혔지만 검수팩에 포함되지 않았고, 이번 Round 1 범위 밖이다.
2. APMS 복사 코드 호환 목표인데 window.state가 제공되지 않아 APMS 원본 코드가 state.db를 직접 접근하면 ReferenceError가 날 수 있다.
3. EieApmsApi.get('students')가 APMS형 { success, data } 구조로 normalize하지 않고 EieApi.getStudents() 원본 응답을 그대로 반환한다.
4. Worker endpoint가 없는 쓰기 API를 adapter에서 있는 것처럼 연결해 Round 2에서 저장 버튼 연결 시 뒤늦게 404/405/500이 날 수 있다.

이번 작업의 목적:
Round 1 호환 레이어를 APMS 복사 코드가 실제로 받을 수 있는 수준으로 보정한다.
이번 라운드도 학생관리 UI parity 구현은 하지 않는다.
기존 EIE view 파일은 건드리지 않는다.

절대 금지:
1. git add 금지.
2. git commit 금지.
3. git push 금지.
4. 배포 금지.
5. wrangler deploy 금지.
6. D1 migration 실행 금지.
7. eie/js/views/eie-students.js 수정 금지.
8. eie/js/views/eie-classroom.js 수정 금지.
9. eie/js/views/eie-timetable.js 수정 금지.
10. eie/js/views/eie-timetable-v2.js 수정 금지.
11. eie/js/views/eie-dashboard.js 수정 금지.
12. 학생관리 UI parity 구현 금지.
13. 클래스룸 UI parity 구현 금지.
14. 없는 Worker endpoint를 성공처럼 처리하는 것 금지.
15. 검수요청서 작성 금지. 검수요청서는 ChatGPT가 별도로 작성한다.

수정 허용 파일:
1. eie/js/apms-compat/eie-apms-state.js
2. eie/js/apms-compat/eie-apms-api.js
3. eie/js/apms-compat/eie-apms-ui-bridge.js
4. eie/js/eie-state.js
5. eie/js/eie-api.js
6. docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
7. docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
8. CODEX_RESULT.md

먼저 할 일:
1. git status --short --untracked-files=all 확인.
2. git diff -- apmath-home/index.html 확인.
3. apmath-home/index.html 변경이 이번 Round 1과 무관하면 반드시 되돌린다.
   실행:
   git restore apmath-home/index.html
4. apmath-home/index.html 변경이 의도된 다른 작업이라면 이번 review pack에 포함하지 말고, CODEX_RESULT.md에 "범위 밖 기존 변경으로 커밋 제외 필요"라고 명확히 기록한다.
5. 단, 이번 Round 1.1 결과에서 git status에 apmath-home/index.html이 남아 있으면 FAIL로 간주한다. 가능한 한 되돌려서 작업트리를 정리한다.

보정 1: window.state 제공
APMS 복사 코드가 state.db, state.ui를 직접 접근할 수 있어야 한다.
Round 1.1에서 window.state를 반드시 제공한다.

구현 위치:
- 우선 eie/js/apms-compat/eie-apms-state.js에 추가한다.
- 필요하면 eie/js/apms-compat/eie-apms-ui-bridge.js에서도 보강할 수 있다.

필수 동작:
if (!window.state && window.EieState && typeof window.EieState.get === 'function') {
  window.state = window.EieState.get();
}

주의:
- EieState.get()이 반환하는 객체 참조가 살아있어야 한다.
- window.state를 EieState.get()의 복사본으로 만들지 않는다.
- 이미 window.state가 있으면 덮어쓰지 않는다.
- 이미 window.state가 있으면 CODEX_RESULT.md에 기록한다.
- docs/EIE_APMS_STATE_API_COMPAT_SPEC.md에서 "Round 1에서는 window.state를 따로 설정하지 않는다"라는 정책이 있으면 반드시 수정한다.

보정 2: EieApmsApi.get('students') 반환 구조 normalize
APMS 복사 코드가 api.get('students')를 호출했을 때 { success: true, data: [...] } 형태를 안정적으로 받을 수 있어야 한다.

수정 대상:
- eie/js/apms-compat/eie-apms-api.js

요구 동작:
GET students는 EieApi.getStudents() 원본을 그대로 반환하지 않는다.
반드시 EieApmsState.normalizeFoundation(payload, null) 또는 동등한 정규화 함수를 거쳐 foundation.students를 반환한다.

권장 구현:
if (clean === 'students' && method === 'GET') {
  return {
    type: 'fn',
    fn: async function () {
      var payload = await window.EieApi.getStudents();
      var foundation = window.EieApmsState && typeof window.EieApmsState.normalizeFoundation === 'function'
        ? window.EieApmsState.normalizeFoundation(payload, null)
        : { students: [] };
      return {
        success: true,
        data: Array.isArray(foundation.students) ? foundation.students : [],
        raw: payload
      };
    }
  };
}

추가 확인:
- confirmed_students, students, data 형태가 들어와도 data 배열이 정상 반환되어야 한다.
- 학생이 없으면 success true + data []로 반환한다.
- 401/403은 숨기지 말고 throw 흐름을 유지한다.

보정 3: 미구현 쓰기 endpoint 정책 고정
외부감사 기준으로 현재 Worker endpoint가 없는 쓰기 API를 adapter에서 있는 것처럼 연결하면 위험하다.
Round 1.1에서는 Worker endpoint가 확인되지 않은 쓰기는 EIE_NOT_IMPLEMENTED로 명확히 막는다.

수정 대상:
- eie/js/apms-compat/eie-apms-api.js
- docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
- docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md

Round 1.1 정책:
A안/B안 중 B안으로 고정한다.

B안:
현재 Round 1.1에서는 Worker endpoint가 없는 쓰기 API를 EIE_NOT_IMPLEMENTED로 명확히 막는다.
Round 2 학생관리 UI parity 전에 Worker endpoint를 선구현하거나, Round 2 UI에서 저장 버튼을 준비중으로 막아야 한다.

not implemented로 막을 대상:
1. POST students
2. PATCH students/{id}
3. PATCH students/{id}/status
4. POST students/{id}/status
5. POST consultations
6. PATCH consultations/{id}
7. DELETE consultations/{id}
8. POST parent-foundation/contacts
9. PATCH parent-foundation/contacts/{id}
10. POST attendance
11. PATCH attendance/{id}
12. POST homework
13. PATCH homework/{id}
14. POST class-daily-records
15. PATCH class-daily-records/{id}
16. POST timetable-cells/{id}/students
17. DELETE timetable-cells/{id}/students/{studentId}

예외:
- GET 계열은 화면 렌더를 위해 빈 배열 fallback 가능.
- POST/PATCH/DELETE 쓰기 계열은 성공처럼 처리 금지.
- EieApi.createTimetableCell/updateTimetableCell/updateTimetableCellStatus는 기존 Round 1 정책을 유지해도 되지만, Worker endpoint가 실제 존재하는지 문서에 명확히 구분한다.
- 학생관리 parity에 직접 필요한 학생 create/update/status는 Worker endpoint가 없는 것으로 기록되어 있으므로 이번 Round 1.1에서는 not implemented 처리한다.

not implemented 오류 형식:
const error = new Error('EIE API endpoint not implemented: <METHOD> <path>');
error.code = 'EIE_NOT_IMPLEMENTED';
error.path = path;
error.method = method;
throw error;

보정 4: docs 업데이트
docs/EIE_APMS_STATE_API_COMPAT_SPEC.md에 다음 내용을 반영한다.

필수 기록:
1. window.state = EieState.get() 제공 정책.
2. window.api = EieApmsApi 제공 정책.
3. GET students는 APMS형 { success, data } 구조로 normalize해서 반환한다.
4. 없는 Worker 쓰기 endpoint는 EIE_NOT_IMPLEMENTED로 실패시킨다.
5. Round 2 학생관리 parity 전제 조건:
   - 학생 등록/수정/상태변경 Worker endpoint를 먼저 구현하거나
   - Round 2 UI에서 저장 버튼을 준비중으로 막는다.
6. timetable_cell_id를 class_id adapter로 쓰는 정책 유지.
7. EieState.db/ui 구조 유지.

docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md에 다음 내용을 반영한다.
1. Round 1.1 보정 완료 상태.
2. Round 2 진입 전 필수 선행:
   - window.state 제공 완료
   - students GET normalize 완료
   - 미구현 쓰기 endpoint not implemented 고정
   - apmath-home/index.html 범위 밖 변경 제거
3. Round 2는 바로 학생관리 UI를 갈아엎기 전 Worker endpoint 보강 필요 여부를 먼저 판정해야 한다.

검증 명령:
node --check .\eie\js\eie-api.js
node --check .\eie\js\eie-state.js
node --check .\eie\js\apms-compat\eie-apms-state.js
node --check .\eie\js\apms-compat\eie-apms-api.js
node --check .\eie\js\apms-compat\eie-apms-ui-bridge.js
node --check .\eie\js\eie-app.js
node --check .\eie\js\eie-router.js

추가 정적 확인:
1. git diff --name-only 확인.
2. git status --short --untracked-files=all 확인.
3. git diff -- apmath-home/index.html 결과가 비어 있는지 확인.
4. git diff -- eie/js/views/eie-students.js eie/js/views/eie-classroom.js eie/js/views/eie-timetable.js eie/js/views/eie-timetable-v2.js eie/js/views/eie-dashboard.js 결과가 비어 있는지 확인.
5. Select-String -Path .\eie\js\apms-compat\*.js -Pattern "window.state|EIE_NOT_IMPLEMENTED|not implemented|students" 로 핵심 보정 확인.
6. Select-String -Path .\eie\js\apms-compat\eie-apms-api.js -Pattern "createStudent|updateStudent|updateStudentStatus|assignStudentToCell|removeStudentFromCell" 확인.
   - Worker endpoint 없는 쓰기 API가 성공 호출로 연결되어 있으면 FAIL이다.
   - not implemented로 막혀 있어야 한다.

CODEX_RESULT.md 형식:
# CODEX_RESULT

## 1. 생성/수정 파일
- 생성 파일
- 수정 파일

## 2. 보정 완료
- apmath-home/index.html 범위 밖 변경 처리
- window.state 제공
- api.get('students') APMS형 normalize
- 미구현 쓰기 endpoint EIE_NOT_IMPLEMENTED 처리
- 문서 업데이트

## 3. 실제 확인한 핵심 파일
- EIE 수정 파일
- 문서 파일
- 확인한 금지 파일

## 4. 실행 결과
- node --check 결과
- git diff --name-only
- git status --short
- apmath-home/index.html diff 확인 결과
- EIE view 파일 diff 없음 확인 결과

## 5. 구현하지 않은 것
- 학생관리 UI parity 미구현
- 클래스룸 UI parity 미구현
- 상담/숙제/출결 저장 미구현
- Worker endpoint 추가 미구현
- DB migration 미실행
- 배포 없음

## 6. 남은 위험
- 학생 쓰기 Worker endpoint 없음
- APMS student.js 복사 시 추가 bridge 필요 가능성
- 브라우저 실구동 확인 필요 항목

## 7. 다음 라운드
- Round 2 전 선택지:
  A. Worker 학생 CRUD endpoint 선구현
  B. 학생관리 parity UI를 먼저 붙이되 저장 버튼은 준비중으로 차단
- 권장: Worker 학생 CRUD endpoint 선구현 후 학생관리 parity

## 8. review pack 경로
- 생성한 zip 경로

review pack 생성:
- 프로젝트 전체 압축 금지.
- 이번 생성/수정 파일만 포함한다.
- 포함 파일:
  - eie/js/eie-api.js
  - eie/js/eie-state.js
  - eie/js/apms-compat/eie-apms-state.js
  - eie/js/apms-compat/eie-apms-api.js
  - eie/js/apms-compat/eie-apms-ui-bridge.js
  - docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
  - docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
  - CODEX_RESULT.md
  - git diff txt
  - git status txt
  - node check txt
  - apmath-home diff txt
  - eie view diff check txt
- eie/index.html이 이번 Round 1.1에서 수정되지 않았으면 포함하지 않아도 된다.
- 임시 폴더는 프로젝트 루트에 만들지 말고 $env:TEMP\AP_REVIEW_WORK 아래에 만든다.
- 최종 zip은 $env:USERPROFILE\Downloads 아래에 생성한다.
- zip 파일명:
  $env:USERPROFILE\Downloads\eie_apms_rebase_round1_1_compat_review_pack_20260530.zip

작업 완료 전 자체 검수:
1. apmath-home/index.html이 git status에서 사라졌는지 확인한다.
2. window.state가 실제로 제공되는지 코드로 확인한다.
3. GET students가 { success, data }로 normalize되는지 확인한다.
4. Worker endpoint 없는 쓰기 API가 성공처럼 처리되지 않는지 확인한다.
5. EIE 기존 view 파일 diff가 없는지 확인한다.
6. node --check 결과를 모두 확인한다.
7. git add/commit/push를 하지 않았는지 확인한다.

마지막 지시:
작업 완료 후 바로 보고하지 말고, 먼저 자체 검수한다.
자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.
그 다음 변경 파일 중심 review pack zip을 생성한다.
git add, git commit, git push는 하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
EOF

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.