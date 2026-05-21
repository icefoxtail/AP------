cd /mnt/c/Users/USER/Desktop/AP------
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 0. 작업명

AP Math 운영 화면 인쇄 기능 1차: 시간표 + cumulative.js 월간/누적 출석부를 A4 가로 인쇄 전용 문서로 출력

---

## 1. 작업 위치

반드시 아래 폴더를 프로젝트 루트로 사용한다.

- /mnt/c/Users/USER/Desktop/AP------

작업 시작 시 반드시 아래 명령으로 이동한다.

- cd /mnt/c/Users/USER/Desktop/AP------

반드시 아래 파일을 다시 열어 처음부터 끝까지 읽고 실행한다.

- /mnt/c/Users/USER/Desktop/AP------/CODEX_TASK.md

다른 위치의 CODEX_TASK.md를 읽거나 현재 셸의 임의 위치를 프로젝트 루트로 착각하지 않는다.

프로젝트 루트 확인 기준:

- apmath/ 가 있어야 한다.
- apmath/js/timetable.js 가 있어야 한다.
- apmath/js/cumulative.js 가 있어야 한다.
- apmath/js/report.js 가 있어야 한다.

위 조건이 맞지 않으면 작업하지 말고 /mnt/c/Users/USER/Desktop/AP------/CODEX_RESULT.md에 중단 사유를 기록한다.

---

## 2. 작업 목적

현재 시간표와 출석부를 종이로 출력하려면 화면용 UI 그대로 인쇄되어 A4에 맞지 않거나 가로 폭이 잘릴 수 있다.

이번 작업에서는 리포트 출력처럼 인쇄 전용 문서를 만들어 A4 가로 기준으로 깔끔하게 출력되도록 한다.

이번 작업의 출석부 대상은 classroom.js의 하루 출석부 모달이 아니다.

반드시 cumulative.js에 있는 월간/누적 출석부를 대상으로 한다.

1차 대상:

- 시간표: apmath/js/timetable.js
- 월간/누적 출석부: apmath/js/cumulative.js

목표:

- 시간표 화면에 인쇄 버튼 추가 또는 기존 적절한 위치에 최소 노출
- cumulative.js 월간/누적 출석부 화면에 인쇄 버튼 추가 또는 기존 적절한 위치에 최소 노출
- 인쇄 버튼 클릭 시 화면 DOM을 그대로 print하지 않고 인쇄 전용 HTML 생성
- A4 landscape 기준 print CSS 적용
- 버튼/필터/탭/사이드바/불필요 UI는 인쇄물에서 제외
- 현재 화면에 보이는 조건을 기준으로 출력
- 기존 데이터 저장/수정/삭제 로직은 변경하지 않음
- 리포트 인쇄 구조는 참고만 하고 report.js 기능은 훼손하지 않음

---

## 3. 절대 금지 사항

아래는 절대 금지한다.

- 기존 UI 문구, 버튼명, 화면명, 메뉴명 임의 변경 금지
- 시간표 구조 전체 개편 금지
- cumulative.js 출석부 구조 전체 개편 금지
- classroom.js 하루 출석부 인쇄 기능으로 바꾸기 금지
- 기존 리포트 인쇄 기능 훼손 금지
- 출결/숙제 데이터 저장 로직 변경 금지
- 시간표 데이터 저장/수정/삭제 로직 변경 금지
- API 변경 금지
- DB schema 변경 금지
- migration 생성 금지
- Worker route 변경 금지
- hidden foundation UI 노출 금지
- 원장/관리자 신규 기능 추가 금지
- 학생 포털/OMR/archive/report AI 흐름 수정 금지
- 수납/홈페이지 관련 코드 수정 금지
- git add, git commit, git push 금지
- 검수요청서 작성 금지

이번 작업은 프론트 인쇄 기능과 인쇄 전용 스타일 보정만 한다.

---

## 4. 반드시 먼저 읽을 문서

존재하는 경우 아래 문서를 먼저 읽는다.

- docs/00_READ_ME_FIRST.md
- docs/01_PROJECT_POLICY.md
- docs/domains/TIMETABLE_DOMAIN.md
- docs/domains/CLASSROOM_DOMAIN.md
- docs/implemented/CURRENT_FRONTEND_MAP.md
- docs/implemented/CURRENT_REGRESSION_RISK_MAP.md
- docs/plans/TIMETABLE_NEXT_PLAN.md
- docs/codex/00_CODEX_READ_ORDER.md

문서가 없으면 CODEX_RESULT.md에 미존재로 기록하되, 작업은 현재 코드 기준으로 진행한다.

이번 작업 후 관련 문서가 존재하면 필요한 범위만 업데이트한다.

---

## 5. 반드시 확인할 코드

아래 파일은 반드시 실제로 열어 확인한다.

- apmath/js/timetable.js
- apmath/js/cumulative.js
- apmath/js/report.js
- apmath/js/core.js
- apmath/index.html

필요하면 확인한다.

- apmath/js/classroom.js

단, classroom.js는 참고만 한다. 이번 출석부 인쇄 대상은 cumulative.js다.

---

## 6. 현재 상태 확인 항목

작업 전에 반드시 아래 내용을 확인한다.

### 6.1 timetable.js

확인할 것:

- renderTimetable 함수
- renderTimetableGrid 함수
- _renderMiddleGrid 또는 중등부 시간표 렌더 함수
- _renderHighGrid 또는 고등부 시간표 렌더 함수
- 현재 section/mode 상태
- 중등부/고등부 탭 상태
- 전체 보기/내 반 보기 상태
- 시간표 표 DOM 구조
- 인쇄 버튼을 넣을 수 있는 상단 toolbar 위치
- 기존 table/sticky/overflow 구조
- 현재 보이는 시간표 기준 데이터를 어떻게 얻는지

### 6.2 cumulative.js

확인할 것:

- 월간/누적 출석부를 렌더링하는 함수
- 현재 월/기간 상태값
- 반 필터 또는 학급 선택 상태값
- 학생별 출석 데이터 구조
- 날짜별 상태 표시 방식
- 도트 색상/상태값 의미
- 숙제/출석 이행률 또는 월 이행률 계산 여부
- 현재 화면에 인쇄 버튼을 넣을 수 있는 위치
- 현재 화면에 보이는 월간/누적 출석부 기준 데이터를 어떻게 얻는지

### 6.3 report.js

확인할 것:

- reportCenterOpenPrintView
- reportCenterBuildPrintDocument
- reportCenterPrintCleanPdf
- reportCenterInjectPrintViewStyle
- @media print 사용 방식
- window.print 사용 방식

report.js의 함수 자체를 무리하게 공용화하지 않는다.
구조와 스타일 방향만 참고한다.

---

## 7. 구현 방향

이번 작업은 화면 DOM을 그대로 인쇄하지 않는다.

반드시 아래 구조 중 하나로 구현한다.

1. 새 창 또는 인쇄 전용 document 생성
2. 인쇄 전용 HTML 문자열 생성
3. A4 landscape 전용 CSS 포함
4. document write 또는 전용 print container 사용
5. window.print 실행
6. 인쇄 후 창 닫기 또는 기존 화면 복귀

기존 화면용 DOM에 @media print만 붙여서 억지로 찍는 방식은 피한다.
단, 보조적으로 print CSS를 사용할 수는 있다.

---

## 8. 시간표 인쇄 요구사항

### 8.1 출력 기준

시간표 인쇄는 현재 화면에서 사용자가 보고 있는 조건을 기준으로 한다.

예:

- 중등부 또는 고등부
- 전체 보기 또는 내 반 보기
- 현재 선택된 모드/필터
- 현재 렌더링된 시간표 표

1차에서는 새로운 상세 출력 옵션을 만들지 않는다.

금지:

- 전체/강사별/과목별/대상별/교실별/반별/지점별 같은 view 버튼을 새로 많이 만들지 않는다.
- 기존 시간표 보기 구조를 바꾸지 않는다.
- 시간표 데이터 수정/저장 로직을 건드리지 않는다.

### 8.2 출력물 구조

시간표 출력물은 A4 가로 기준으로 아래 구조를 가진다.

- 상단 제목: AP Math 시간표
- 기준: 중등부/고등부, 전체 보기/내 반 보기 등 현재 조건
- 출력일
- 시간표 표
- 필요하면 하단 작은 메모/확인란

표는 종이에 잘 보이도록 한다.

- A4 landscape
- 여백 작게
- 글자 크기 적절히 축소
- 표 경계선 선명
- 배경색은 너무 진하지 않게
- 화면용 sticky/overflow 제거
- 가로 잘림 방지

### 8.3 시간표 버튼 위치

기존 상단 toolbar 또는 시간표 제목 근처에 인쇄 버튼을 최소 추가한다.

버튼 문구는 기존 문구와 충돌하지 않게 단순하게 한다.

권장:

- 인쇄

이미 기존 프린트 관련 버튼 문구가 있으면 그 문구 체계를 따른다.

---

## 9. cumulative.js 월간/누적 출석부 인쇄 요구사항

### 9.1 출력 기준

출석부 인쇄는 반드시 cumulative.js에 있는 월간/누적 출석부를 대상으로 한다.

1차 기준:

- 현재 화면에 보이는 월/기간
- 현재 선택된 반/필터
- 현재 화면에 보이는 학생 목록
- 현재 화면에 보이는 날짜별 출석 상태
- 현재 화면에 보이는 출석/숙제/이행률 정보가 있으면 포함

classroom.js의 하루 출석부 모달을 대상으로 하지 않는다.

### 9.2 출력물 구조

출석부 출력물은 A4 가로 기준으로 아래 구조를 가진다.

- 상단 제목: AP Math 출석부
- 기준 월 또는 기간
- 반 또는 필터명
- 출력일
- 월간/누적 출석부 표

표 예시:

- 번호
- 학생명
- 학교 또는 학년
- 1일, 2일, 3일 ... 말일
- 출석/지각/결석/보강/기타 요약
- 숙제 또는 월 이행률이 현재 화면에 있으면 요약
- 비고 또는 메모 칸

현재 cumulative.js 화면이 날짜별 도트 방식이면 인쇄물에서도 도트/기호를 유지하거나, 종이에서 잘 보이는 문자 기호로 변환한다.

권장 기호 예:

- 출석: O
- 결석: X
- 지각: △
- 보강 또는 특이 상태: 표시 가능한 기존 상태값 유지
- 미기록: 빈칸 또는 -

단, 기존 상태 의미를 임의로 바꾸지 않는다.
현재 cumulative.js에 정의된 상태/색상/라벨 의미를 먼저 확인하고, 그 기준을 따른다.

### 9.3 출력 품질

- A4 landscape
- 날짜 칸이 많으므로 글자 크기를 적절히 줄인다.
- 학생명은 너무 작아지지 않게 한다.
- 날짜 칸은 균등 폭으로 잡는다.
- 표 경계선은 선명하게 한다.
- 배경색이 인쇄에서 흐려져도 상태를 알 수 있게 기호 또는 텍스트를 함께 둔다.
- 긴 학교명/반명은 줄바꿈 또는 축약되더라도 표가 깨지지 않게 한다.

### 9.4 출석부 버튼 위치

cumulative.js 월간/누적 출석부 화면의 상단 조작 영역 근처에 인쇄 버튼을 최소 추가한다.

버튼 문구는 단순하게 한다.

권장:

- 인쇄

새로운 복잡한 옵션 버튼은 추가하지 않는다.

---

## 10. 인쇄 공통 helper

중복을 줄이기 위해 파일별로 필요한 최소 helper를 만들 수 있다.

가능한 helper 역할:

- HTML escape
- 날짜 포맷
- 출력일 생성
- 새 창 print document 생성
- A4 landscape CSS 생성

단, 프로젝트 전체 공용 helper로 무리하게 빼지 않는다.
이번 작업은 timetable.js와 cumulative.js 내부에서 최소 변경하는 것을 우선한다.

주의:

- report.js 공용 함수를 직접 의존하게 만들지 않는다.
- core.js를 수정해야 할 경우 반드시 필요한 최소 범위로 제한한다.
- 전역 이름 충돌을 피한다.
- 기존 함수명과 충돌하지 않는다.

---

## 11. 인쇄 CSS 기준

인쇄 전용 HTML에는 다음 기준을 포함한다.

- @page size: A4 landscape
- margin: 8mm 또는 10mm 수준
- body font-family는 기존 화면과 크게 다르지 않은 sans-serif
- table border-collapse: collapse
- th, td border 적용
- thead 반복 가능하면 고려
- page-break-inside avoid 가능한 곳에 적용
- 버튼/필터/입력 UI 미포함
- 배경색에 의존하지 않고 텍스트/기호로 상태 판별 가능

---

## 12. 문서 업데이트

관련 문서가 존재하면 필요한 범위만 업데이트한다.

업데이트 후보:

- docs/domains/TIMETABLE_DOMAIN.md
- docs/domains/CLASSROOM_DOMAIN.md
- docs/implemented/CURRENT_FRONTEND_MAP.md
- docs/implemented/CURRENT_REGRESSION_RISK_MAP.md
- docs/plans/TIMETABLE_NEXT_PLAN.md

업데이트 내용:

- 시간표 A4 가로 인쇄 기능 추가
- cumulative.js 월간/누적 출석부 A4 가로 인쇄 기능 추가
- classroom.js 하루 출석부는 이번 범위가 아님
- 인쇄 전용 HTML 방식
- 기존 화면 UI/저장 로직 미변경
- 회귀 위험: 화면 DOM 직접 print 금지, 저장 로직 변경 금지, 상태 기호 의미 변경 금지

문서가 없으면 생성하지 말고 CODEX_RESULT.md에 미존재로 기록한다.
단, docs 구조가 존재하면 위 문서는 최대한 업데이트한다.

---

## 13. 검증 기준

반드시 아래를 확인한다.

### 13.1 시간표

- 시간표 화면에 인쇄 버튼이 보인다.
- 버튼 클릭 시 인쇄 전용 화면 또는 인쇄 창이 열린다.
- A4 가로 기준으로 출력된다.
- 현재 선택된 중등부/고등부/전체/내 반 조건이 출력물에 반영된다.
- 표가 가로로 잘리지 않는다.
- 버튼/필터/사이드바가 출력물에 들어가지 않는다.
- 기존 시간표 수정/저장/탭 전환은 그대로 동작한다.

### 13.2 cumulative.js 출석부

- cumulative.js 월간/누적 출석부 화면에 인쇄 버튼이 보인다.
- 버튼 클릭 시 인쇄 전용 화면 또는 인쇄 창이 열린다.
- A4 가로 기준으로 출력된다.
- 현재 월/기간/반/필터가 출력물에 반영된다.
- 날짜별 출석 상태가 종이에서 구분 가능하다.
- 학생명/날짜/상태/요약이 잘리지 않는다.
- classroom.js 하루 출석부가 아니라 cumulative.js 기준이다.
- 기존 출석 데이터 저장/수정 로직은 변경되지 않는다.

### 13.3 공통

- report.js 기존 리포트 인쇄가 깨지지 않는다.
- UI 문구/버튼명/화면명 임의 변경 없음
- Worker/API/DB 변경 없음
- 학생 포털/OMR/archive/report AI 미수정
- 수납/홈페이지 미수정

---

## 14. 검증 명령

작업 후 아래 명령을 실행한다.

- cd /mnt/c/Users/USER/Desktop/AP------
- node --check apmath/js/timetable.js
- node --check apmath/js/cumulative.js
- node --check apmath/js/report.js
- git status --short
- git diff --name-only

core.js를 수정했다면 추가로 실행한다.

- node --check apmath/js/core.js

다른 JS 파일을 수정했다면 해당 파일도 node --check를 실행한다.

브라우저 실제 인쇄 미리보기는 사용자가 직접 확인할 수 있도록 CODEX_RESULT.md에 수동 확인 항목으로 남긴다.

---

## 15. CODEX_RESULT.md 작성

작업 완료 후 반드시 아래 위치에 결과를 작성한다.

- /mnt/c/Users/USER/Desktop/AP------/CODEX_RESULT.md

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 수정한 코드 파일
- 수정한 문서 파일
- 새 테스트 파일 여부
- DB/migration 변경 여부
- Worker/API 변경 여부

## 2. 구현 완료 또는 확인 완료
- 시간표 A4 가로 인쇄 기능
- cumulative.js 월간/누적 출석부 A4 가로 인쇄 기능
- classroom.js 하루 출석부는 이번 작업 대상이 아님 확인
- 리포트 인쇄 방식 참고 여부
- 인쇄 전용 HTML 방식 적용 여부
- 기존 화면 UI/저장 로직 보존 여부

## 3. 실행 결과
- node --check apmath/js/timetable.js
- node --check apmath/js/cumulative.js
- node --check apmath/js/report.js
- node --check apmath/js/core.js 실행 여부
- git status --short
- git diff --name-only

## 4. 결과 요약
- 시간표 인쇄가 어떻게 동작하는지
- cumulative.js 출석부 인쇄가 어떻게 동작하는지
- A4 가로 출력 기준
- 기존 기능 보존 내용

## 5. 다음 조치
- 브라우저에서 확인할 항목
- 실제 인쇄 미리보기 확인 항목
- 2차로 고려할 항목

## 6. 실제로 읽은 문서/코드
- 읽은 docs
- 읽은 frontend 파일
- 참고한 report.js 인쇄 함수

## 7. 회귀 방지 확인
- UI 문구 변경 여부
- 기존 시간표 저장/수정 로직 변경 여부
- 기존 cumulative 출석 데이터 로직 변경 여부
- classroom.js 하루 출석부 미대상 확인
- report.js 기존 리포트 인쇄 보존 여부
- Worker/API/DB 미수정 여부
- 학생 포털/OMR/archive/report AI 미수정 여부
- 수납/홈페이지 미수정 여부
- git add/commit/push 미실행 여부

---

## 16. 작업 완료 전 자기검증

완료 전 아래를 스스로 확인한다.

- /mnt/c/Users/USER/Desktop/AP------에서 작업했는가?
- /mnt/c/Users/USER/Desktop/AP------/CODEX_TASK.md를 읽었는가?
- 시간표 인쇄 대상이 timetable.js인가?
- 출석부 인쇄 대상이 cumulative.js인가?
- classroom.js 하루 출석부를 잘못 대상으로 삼지 않았는가?
- 화면 DOM을 그대로 print하지 않고 인쇄 전용 HTML을 만들었는가?
- A4 landscape 기준이 들어갔는가?
- 버튼/필터/사이드바가 인쇄물에 포함되지 않는가?
- 기존 시간표 저장/수정 로직을 건드리지 않았는가?
- 기존 cumulative 출석 데이터 로직을 건드리지 않았는가?
- report.js 기존 리포트 인쇄가 깨지지 않는가?
- Worker/API/DB를 수정하지 않았는가?
- node --check를 수정 파일에 실행했는가?
- CODEX_RESULT.md를 작성했는가?
- git add/commit/push를 하지 않았는가?

---

## 17. 최종 지시

아래 명령으로 지정 폴더로 이동한 뒤, 그 폴더의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.

- cd /mnt/c/Users/USER/Desktop/AP------
- cat CODEX_TASK.md

다른 위치의 작업 결과로 대체하지 마라.

이번 작업은 시간표와 cumulative.js 월간/누적 출석부를 리포트처럼 A4 가로 인쇄 전용 문서로 출력하는 1차 작업이다.

EOF