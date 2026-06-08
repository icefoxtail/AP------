````powershell
cd C:\Users\USER\Desktop\AP------

@'
# CODEX_TASK — EIE 원장 대시보드 선생님 카드 MVP 구현

## 0. 작업 성격

이번 작업은 EIE 원장 대시보드의 “선생님 현황판”을 실제 운영용 MVP로 꺼내는 구현 작업이다.

목표는 완성형 설계를 한 번에 끝내는 것이 아니라, 원장님 화면에서 선생님별 오늘 시간표를 바로 보고, 클릭하면 해당 선생님 대시보드로 들어갈 수 있게 만드는 것이다.

이번 작업은 선생님 대시보드 fix2를 다시 크게 수정하는 작업이 아니다.
이번 작업은 클래스룸/학생상담 전체 구현 작업도 아니다.
이번 작업은 원장 대시보드 선생님 카드 MVP다.

git add, git commit, git push는 하지 않는다.

## 1. 최종 목표

원장 대시보드의 선생님 카드가 아래 역할을 하게 만든다.

1. 원장님이 오늘 EIE 선생님별 수업 배치를 한눈에 본다.
2. 선생님 카드 클릭 시 해당 선생님 대시보드 홈으로 이동한다.
3. Foreigner는 개인 선생님 대시보드가 없으므로 클릭되지 않는다.
4. 선생님 카드에는 “담당/보조 45” 같은 내부 지표가 아니라, 오늘 요일/교시 기준 반명이 표시된다.
5. 교시별 반명은 임의 하드코딩하지 않고 현재 EIE 시간표/요일/교시 데이터와 연동해서 가져온다.
6. 화면에는 “관전모드”, “관람모드”, “읽기 전용” 같은 문구를 노출하지 않는다.

## 2. 현재 화면 문제

현재 원장 대시보드 선생님 현황 카드에는 아래처럼 운영 의미가 약한 지표가 출력된다.

- 오늘 수업 0
- 담당/보조 45
- 출석 완료 0
- 미확인 0

이 지표들은 이번 작업에서 제거하거나 더 이상 핵심 정보로 쓰지 않는다.

특히 `담당/보조 45`는 원장님 운영 화면에 노출하지 않는다.

## 3. 새 카드 출력 형식

선생님 카드 안에는 오늘 요일 기준 교시별 반명을 작은 표/리스트 형태로 표시한다.

권장 형태:

Carmen

1  RS3
2  FO2
3  -
4  R4
5  R5

출력 원칙:

1. 선생님 이름을 상단에 표시한다.
2. 그 아래에 작은 표 형식으로 교시 번호와 반명을 표시한다.
3. 교시 번호는 짧게 `1`, `2`, `3`, `4`처럼 표시한다.
4. 반명은 시간표 데이터의 실제 반명/수업명에서 가져온다.
5. 해당 교시에 수업이 없으면 `-`로 표시한다.
6. 긴 설명형 문구를 넣지 않는다.
7. 오늘 요일 기준으로만 표시한다.
8. 가짜 수업 수나 가짜 출결 숫자를 만들지 않는다.

예시:

Carmen
1  RS3
2  FO2
3  -
4  R4

Zoe
1  -
2  RS1
3  RS2
4  -

Foreigner
1  Speaking
2  -
3  Speaking
4  -

단, Foreigner는 카드가 표시되더라도 클릭되면 안 된다.

## 4. 클릭 동작

### 4.1 클릭 가능 선생님

아래 실제 선생님 카드는 클릭 시 해당 선생님 대시보드로 이동한다.

- Carmen
- Zoe
- IVY
- Stacy
- Lily

현재 코드에 실제 운영명 표기가 다르면 기존 데이터 기준 이름을 유지한다.
단, 임의로 teacherRoster 명단을 크게 갈아엎지 않는다.

### 4.2 Foreigner

Foreigner는 개인 선생님 대시보드가 없다.

따라서:

1. Foreigner 카드가 표시되더라도 클릭 이벤트를 붙이지 않는다.
2. 클릭 가능한 카드처럼 보이지 않게 한다.
3. Foreigner를 클릭했을 때 EieTeacherView.openTeacher('Foreigner') 같은 동작이 발생하면 안 된다.
4. 화면에 “대시보드 없음” 같은 긴 문구를 띄우지 않는다.

### 4.3 클릭 연결 방식

선생님 카드 클릭은 기존 선생님 대시보드 진입 구조를 우선 사용한다.

우선 후보:

- `EieTeacherView.openTeacher(name)`

또는 현재 코드에 더 안전한 기존 wrapper가 있으면 그것을 사용한다.

금지:

- 새 route 만들기
- route/hash 전체 재배선
- `eie-router.js` 구조 변경
- 원장 관전모드 실제 구현
- 화면에 관전/관람/읽기전용 문구 노출

## 5. 시간표 데이터 연동

교시별 반명은 현재 EIE 시간표 데이터와 연동해서 가져와야 한다.

확인할 후보:

- `eie/js/views/eie-dashboard.js`
- `eie/js/views/eie-teacher.js`
- `eie/js/utils/eie-classroom-scope.js`
- `eie/js/views/eie-timetable-v2.js`
- `eie/js/eie-state.js`
- `eie/js/eie-api.js`

단, 이번 작업에서 시간표 핵심 로직을 수정하지 않는다.
읽어서 사용하는 것은 가능하지만 `eie-timetable-v2.js`의 핵심 로직은 수정하지 않는다.

확인할 데이터 후보:

- 요일 정보
- 교시 정보
- period_label
- period_order
- day_label
- class_name / classTitle / display name 계열
- homeroom teacher
- teacher_names
- teacher_names_by_day
- weekday_teachers
- day_teachers
- assigned teacher 관련 기존 helper

실제 필드명은 현재 코드 기준으로 확인하고 CODEX_RESULT1.md에 기록한다.

## 6. 구현 범위

### 수정 가능 파일

주 대상:

- `eie/js/views/eie-dashboard.js`
- `eie/css/eie.css`

필요 시 최소 확인/수정 가능:

- `eie/js/views/eie-teacher.js`
- 관련 테스트 파일

읽기 확인만 원칙:

- `eie/js/utils/eie-classroom-scope.js`
- `eie/js/views/eie-timetable-v2.js`
- `eie/js/eie-router.js`
- `eie/js/eie-state.js`
- `eie/js/eie-api.js`
- `eie/js/views/eie-classroom.js`
- `eie/js/views/eie-students.js`

## 7. 구현 세부 지시

### 7.1 현재 선생님 카드 렌더링 함수 확인

먼저 `eie-dashboard.js`에서 현재 원장 대시보드 선생님 현황판 렌더링 함수를 찾는다.

확인할 것:

1. 선생님 카드 렌더링 함수명
2. 현재 선생님 목록 생성 방식
3. 현재 `오늘 수업`, `담당/보조`, `출석 완료`, `미확인` 계산 방식
4. 현재 클래스룸 버튼/카드 클릭 동작
5. 현재 Foreigner/PREP/Laura/원장님이 섞이는 원인

CODEX_RESULT1.md에 실제 함수명과 근거를 기록한다.

### 7.2 기존 지표 제거

아래 지표는 원장 카드에서 제거한다.

- 담당/보조
- 출석 완료
- 미확인
- 오늘 수업 0처럼 의미 없는 숫자 지표

이번 MVP에서는 교시별 반명 표시를 우선한다.

### 7.3 교시별 반명 표 생성

새 helper를 만들 수 있다.

권장 helper 역할:

- 오늘 요일을 판단한다.
- 현재 timetable cell 목록에서 해당 선생님의 오늘 수업을 찾는다.
- 교시 번호 기준으로 정렬한다.
- 각 교시별 표시 반명을 만든다.
- 수업이 없는 교시는 `-`로 표시한다.

주의:

1. 새 날짜 판정 로직을 무리하게 만들지 말고 기존 요일/시간표 helper가 있으면 우선 사용한다.
2. 같은 교시에 여러 반이 잡히면 짧게 병합하거나 CODEX_RESULT1.md에 위험으로 기록한다.
3. 반명이 없으면 수업명/셀명/기존 display label 후보를 안전하게 fallback한다.
4. fallback도 없으면 `-`로 둔다.
5. 데이터 미로드 상태에서 가짜 값을 만들지 않는다.

### 7.4 작은 표 UI

카드 내부 UI는 작은 표/리스트 형태로 만든다.

예상 class 후보:

- `.eie-admin-teacher-periods`
- `.eie-admin-teacher-period-row`
- `.eie-admin-teacher-period-no`
- `.eie-admin-teacher-period-class`

실제 class명은 기존 CSS 규칙과 충돌하지 않게 정한다.

스타일 기준:

1. 흰색 카드 톤 유지
2. 얇은 border
3. 작은 칩/표 느낌
4. 모바일에서도 줄 깨짐 과하지 않게
5. 검은 테두리 박스 느낌 금지
6. AP MATH 색상 그대로 복사 금지
7. CSS 전체 갈아엎기 금지

### 7.5 카드 클릭 연결

클릭 가능 선생님 카드에는 `EieTeacherView.openTeacher(name)` 또는 현재 안전한 기존 진입 함수를 연결한다.

중요:

1. inline onclick을 쓸 경우 HTML attribute-safe 하게 escape한다.
2. 1차 선생님 대시보드에서 발생했던 `onclick="...("c1")"` 같은 따옴표 깨짐을 반복하지 않는다.
3. 가능하면 기존 escape helper나 안전한 인자 helper를 사용한다.
4. 테스트에서 깨진 onclick 패턴을 금지한다.

금지 패턴:

onclick="EieTeacherView.openTeacher("Carmen")"

허용 예:

onclick="EieTeacherView.openTeacher(&quot;Carmen&quot;)"

또는 안전한 data attribute/event binding 구조가 이미 있으면 그 구조를 사용한다.

### 7.6 Foreigner non-click

Foreigner 카드에는 클릭 handler를 붙이지 않는다.

확인할 것:

1. Foreigner 카드에 `onclick`이 없는지
2. cursor pointer가 적용되지 않는지
3. 클래스룸/선생님 대시보드 버튼이 표시되지 않는지
4. 화면에서 너무 튀는 안내문이 나오지 않는지

## 8. 절대 금지

이번 작업에서 절대 하지 않는다.

- 파일명 변경 금지
- 파일 삭제 금지
- rename 금지
- route/hash 전체 재배선 금지
- 새 route 추가 금지
- 대량 문자열 치환 금지
- AP MATH 원본 수정 금지
- EIE 시간표 핵심 로직 수정 금지
- `eie-timetable-v2.js` 핵심 로직 수정 금지
- DB migration 금지
- Worker/API 권한 구조 변경 금지
- CSS 전체 갈아엎기 금지
- 선생님 대시보드 fix2 구조 재수정 금지
- 클래스룸/학생상담 전체 구현 금지
- 원장 관전/관람모드 실제 구현 금지
- 화면에 “관전모드”, “관람모드”, “읽기 전용” 문구 노출 금지
- git add 금지
- git commit 금지
- git push 금지

## 9. 검증

가능한 경우 아래를 실행하고 CODEX_RESULT1.md에 결과를 기록한다.

```powershell
node --check eie/js/views/eie-dashboard.js
node --check eie/js/views/eie-teacher.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-students.js
node --check eie/js/eie-router.js
````

관련 테스트가 있으면 찾아서 실행한다.
필요하면 최소 테스트만 추가한다.

테스트에 포함할 것:

1. 원장 대시보드 선생님 카드에서 `담당/보조`가 렌더되지 않는지
2. 교시별 반명 표가 렌더되는지
3. 클릭 가능 선생님 카드에 안전한 `openTeacher` 연결이 있는지
4. Foreigner 카드에는 `openTeacher('Foreigner')` 연결이 없는지
5. 깨진 inline onclick 패턴이 없는지

브라우저 확인 후보:

1. 원장 대시보드 진입
2. 선생님 카드에 `1 RS3`, `2 FO2` 형식 교시별 반명이 보이는지
3. Carmen/Zoe/IVY/Stacy/Lily 카드 클릭 시 해당 선생님 대시보드 진입
4. Foreigner 클릭이 동작하지 않는지
5. 콘솔 SyntaxError / undefined / 404 없음

브라우저 확인을 못 했으면 CODEX_RESULT1.md에 “브라우저 미확인”으로 기록한다.

## 10. CODEX_RESULT1.md 작성 형식

작업 완료 후 루트에 `CODEX_RESULT1.md`를 작성한다.

반드시 아래 구조로 작성한다.

# CODEX_RESULT1

## 1. 수정 파일

표로 작성한다.

열:

* 파일
* 수정 내용
* 수정 이유
* 위험도

## 2. 구현 내용

아래 항목별로 작성한다.

* 원장 대시보드 선생님 카드 구조 변경
* 제거한 기존 지표
* 교시별 반명 표시 방식
* 시간표 데이터 연동 방식
* 카드 클릭 → 선생님 대시보드 연결 방식
* Foreigner non-click 처리
* CSS 변경
* 테스트 변경

## 3. 검증 결과

실행한 명령과 결과를 그대로 기록한다.

## 4. 남은 위험

반드시 포함:

* 교시별 반명 fallback 위험
* 같은 교시 다중 수업 처리 위험
* teacherRoster/운영 선생님 명단 불일치 위험
* Foreigner/PREP/Laura/원장님 표시 정책 후속 확정 필요
* 실제 브라우저 확인 여부

## 5. 사용자 확인 필요

반드시 포함:

* 교시별 반명 표 형식이 보기 좋은지
* `-` 표시를 유지할지
* Foreigner 카드를 표시만 할지 아예 숨길지
* Laura/PREP/원장님을 카드에서 어떻게 처리할지
* 선생님 카드 클릭 후 선생님 대시보드 홈 진입이 맞는지

## 6. 다음 조치

다음 단계 후보:

1. 브라우저에서 원장 카드 클릭 확인
2. 선생님 대시보드 연결 후 원장 보기 전용 처리
3. 클래스룸/학생상담 연결 흐름 정리
4. 원장 대시보드 선생님 현황판 최종 정리

## 11. 마무리

CODEX_RESULT1.md 작성 후 멈춘다.
자동 zip 생성하지 않는다.
git add, git commit, git push는 하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
'@ | Set-Content -Path "C:\Users\USER\Desktop\AP------\CODEX_TASK.md" -Encoding UTF8

```
```
