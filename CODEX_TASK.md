````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업명

AP Math OS 선생님용 반 플래너 확인 화면 업그레이드

## 1. 작업 목적

현재 선생님 반 화면의 `플래너` 기능은 특정 날짜 기준의 요약 확인에 가깝다.

이번 작업의 목적은 선생님이 반 전체 학생의 플래너 내용을 직접 확인할 수 있도록, 반 단위 플래너 확인 화면을 업그레이드하는 것이다.

핵심은 이행률/통계가 아니라 **학생별 실제 플래너 항목 전체 목록**을 보는 것이다.

## 2. 수정 대상

주 수정 파일:

- `apmath/js/classroom.js`

필요 시 확인 파일:

- `apmath/planner/index.html`
- `apmath/worker-backup/worker/routes/planner.js`
- `apmath/worker-backup/worker/index.js`

단, 1차 구현은 가능한 한 `classroom.js` 중심으로 끝낸다.

## 3. 절대 원칙

- 학생 개인 플래너 화면의 기존 기능을 임의로 변경하지 말 것.
- 학생 개인 플래너의 문구, 버튼명, 화면명을 임의로 바꾸지 말 것.
- 기존 반 화면의 문구, 버튼명, 화면명을 요청 범위 밖에서 바꾸지 말 것.
- 기존 출결/숙제/진도/QR/OMR/시험성적/클리닉 기능을 건드리지 말 것.
- 기존 `플래너` 버튼 위치와 호출 흐름을 최대한 유지할 것.
- 이행률/통계 중심 UI로 만들지 말 것.
- 선생님이 학생별 실제 계획 내용을 모두 읽을 수 있어야 한다.
- 관리자 대시보드 기능은 수정하지 말 것.
- 새로운 대형 기능을 임의로 추가하지 말 것.
- 연결되지 않는 함수, 미사용 API 호출, 임시 더미 함수는 넣지 말 것.
- `git add`, `git commit`, `git push`는 하지 말 것.

## 4. 현재 구조 확인

현재 `classroom.js`에는 반 화면 툴바에 `플래너` 버튼이 있고, 이 버튼은 `renderPlannerControl(classId)`를 호출한다.

현재 `renderPlannerControl()` 및 관련 함수는 선생님이 특정 날짜의 반 학생 플래너를 확인하는 구조다.

이번 작업은 이 기존 선생님용 플래너 확인 화면을 업그레이드한다.

## 5. 구현 목표

### 5.1 모바일

모바일에서는 화면 폭이 좁으므로 **요일별 전체 목록** 중심으로 구현한다.

모바일 표시 구조:

```text
플래너 확인

[이번 주] [지난 주] [다음 주]
[월] [화] [수] [목] [금] [토] [일]

월요일 2026-05-18

홍길동
- 수학 쎈 p.10~15
- 영어 단어 30개
- 오답노트 정리

김민수
- 수학 RPM 2단원

박지훈
등록된 계획 없음
````

필수 조건:

* 모바일에서는 주간표를 억지로 보여주지 않는다.
* 모바일 기본 화면은 선택 요일의 반 전체 목록이어야 한다.
* 학생별 계획 항목은 생략하지 말고 모두 보여준다.
* 계획이 없는 학생도 목록에서 빠지면 안 되며 `등록된 계획 없음`으로 표시한다.
* 완료된 항목은 체크 또는 흐림 처리로 구분한다.
* 미완료 항목은 일반 텍스트로 표시한다.

### 5.2 PC

PC에서는 화면 폭이 충분하므로 다음 두 가지 보기를 제공한다.

```text
[요일별] [주간별]
```

#### A. PC 요일별 보기

선택한 요일 또는 날짜의 반 전체 학생 플래너 목록을 표시한다.

구조:

```text
요일별 보기

[이번 주] [지난 주] [다음 주]
[월] [화] [수] [목] [금] [토] [일]

월요일 2026-05-18

홍길동
- 수학 쎈 p.10~15
- 영어 단어 30개

김민수
- 수학 RPM 2단원

박지훈
등록된 계획 없음
```

#### B. PC 주간별 보기

학생 × 월~일 표로 1주일 전체 플래너 항목을 표시한다.

구조:

```text
주간별 보기

학생      월        화        수        목        금        토        일
홍길동    쎈 p10    오답노트   RPM       없음      단어      없음      없음
김민수    RPM       없음      쎈        오답      없음      없음      없음
박지훈    없음      개념원리   쎈        없음      오답      없음      없음
```

필수 조건:

* 주간별 표의 각 날짜 셀에 해당 날짜의 실제 계획 제목을 표시한다.
* 한 셀에 항목이 여러 개면 줄바꿈 또는 작은 목록으로 모두 표시한다.
* 항목을 임의로 1개만 보여주고 나머지를 숨기면 안 된다.
* 셀이 너무 길어질 경우 CSS로 영역을 정돈하되 데이터 자체를 누락하지 말 것.
* 계획이 없는 셀은 `없음`으로 표시한다.
* 완료된 항목은 체크 또는 흐림 처리로 구분한다.
* 미완료 항목은 일반 텍스트로 표시한다.

## 6. 데이터 조회 방식

### 6.1 1차 구현 방식

가능하면 기존 플래너 조회 API를 그대로 사용한다.

기존에 특정 날짜 기준으로 반 플래너 데이터를 가져오는 함수가 있다면, 주간별은 월~일 7일치 데이터를 순차 또는 병렬로 호출해 프론트에서 합친다.

예상 구조:

```js
async function loadClassPlannerWeek(classId, weekStart) {
    const dates = getPlannerWeekDates(weekStart);
    const results = await Promise.all(dates.map(date => loadPlannerOverview(classId, date)));
    return mergePlannerWeekResults(dates, results);
}
```

단, 실제 기존 함수명과 응답 구조를 먼저 확인한 뒤 기존 코드 스타일에 맞춰 구현한다.

### 6.2 백엔드 추가 여부

이번 1차 작업에서는 백엔드 신규 API 추가를 기본 목표로 하지 않는다.

다만 기존 API로는 주간 데이터 구성 자체가 불가능하거나 너무 비효율적인 경우에만 다음 API 추가를 검토한다.

```text
GET /api/planner/class-week?class_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD
```

백엔드 추가가 필요하다고 판단되면 먼저 코드상 근거를 `CODEX_RESULT.md`에 적고, 이번 작업에서는 가능하면 프론트 1차 구현까지만 한다.

## 7. 구현 세부 사항

### 7.1 상태값 추가

`classroom.js` 내부에 선생님용 플래너 화면 상태를 추가한다.

예시:

```js
if (!state.ui.classPlannerViewMode) state.ui.classPlannerViewMode = 'day';
if (!state.ui.classPlannerWeekStart) state.ui.classPlannerWeekStart = getWeekStartDate(...);
if (!state.ui.classPlannerSelectedDate) state.ui.classPlannerSelectedDate = getClassroomOperationDate();
```

실제 구현 시 기존 `state.ui` 구조와 충돌하지 않게 이름을 명확히 한다.

추천 이름:

* `state.ui.classPlannerMode`
* `state.ui.classPlannerWeekStart`
* `state.ui.classPlannerSelectedDate`
* `state.ui.classPlannerWeekCache`

### 7.2 날짜 유틸

기존 날짜 유틸이 있으면 재사용한다.

필요 시 `classroom.js` 안에 중복 충돌 없는 이름으로 작성한다.

추천 함수:

* `getClassPlannerWeekStart(dateStr)`
* `getClassPlannerWeekDates(weekStart)`
* `addClassPlannerDays(dateStr, days)`
* `formatClassPlannerDayLabel(dateStr)`

주의:

* 기존 전역 함수와 이름 충돌 방지.
* KST 기준 날짜 문자열 `YYYY-MM-DD` 유지.
* `new Date(date + 'T00:00:00')` 패턴을 사용할 경우 기존 코드 스타일과 맞춘다.

### 7.3 렌더 함수

기존 `renderPlannerControl(classId)` 흐름을 보존하되 내부 화면을 업그레이드한다.

추천 함수 구조:

```js
function renderPlannerControl(classId) {
    // 기존 접근 제한/반 조회 로직 확인 후 유지
    // 선생님용 플래너 컨테이너 렌더
    // 모바일/PC 공통 상태 기준으로 요일별/주간별 UI 렌더
}

async function refreshClassPlannerControl(classId) {
    // 선택 주간 또는 선택 날짜 데이터 로드
    // 요일별/주간별 현재 모드에 맞춰 다시 렌더
}

function renderClassPlannerModeTabs(classId) {
    // PC에서는 요일별/주간별 표시
    // 모바일에서는 요일별만 표시하거나 주간별 탭 숨김
}

function renderClassPlannerDayTabs(classId, weekStart, selectedDate) {
    // 월~일 탭
}

function renderClassPlannerDayList(classId, date, data) {
    // 학생별 실제 계획 전체 목록
}

function renderClassPlannerWeekTable(classId, weekStart, weekData) {
    // PC 주간표
}

function renderClassPlannerStudentPlanList(plans) {
    // 계획 항목 리스트 렌더
}
```

실제 함수명은 기존 코드 스타일을 따라도 된다.

### 7.4 학생 목록 기준

반 학생 목록은 기존 classroom 학생 목록 기준을 사용한다.

추천:

* `getClassroomActiveStudents(classId)`가 있으면 재사용한다.
* 재원생만 표시하는 기존 정책을 유지한다.
* 학생 순서는 기존 반 화면 순서와 맞춘다.
* 플래너 데이터가 없는 학생도 반드시 표시한다.

### 7.5 계획 항목 표시 기준

각 계획 항목에는 최소한 아래 정보를 표시한다.

* 계획 제목
* 과목이 있으면 과목 태그
* 완료 여부

예시:

```text
- [ ] 수학 쎈 p.10~15
- [완료] 영어 단어 30개
```

또는:

```text
✓ 영어 단어 30개
수학 쎈 p.10~15
```

주의:

* 제목을 임의로 짧게 자르지 말 것.
* HTML escape 처리 필수.
* 완료 항목은 `.done` 또는 별도 클래스로 흐리게 처리한다.
* 학생이 작성한 텍스트를 그대로 innerHTML에 넣지 말고 escape 처리한다.

### 7.6 CSS

`injectClassroomStyles()` 안에 선생님용 플래너 전용 CSS를 추가한다.

추천 클래스 prefix:

```text
.cls-planner-
```

필수 스타일:

* 모바일 요일별 목록 카드
* PC 요일별 목록 카드
* PC 주간표
* 완료 항목 흐림 처리
* 계획 없음 표시
* 가로 스크롤이 필요한 경우 표 컨테이너에만 적용

주의:

* 기존 `.cls-v4-*` 스타일을 깨지 말 것.
* 기존 출석부 스타일과 충돌하지 않게 prefix를 명확히 할 것.
* 모바일에서 주간표가 보이지 않도록 처리할 것.
* PC에서 주간표는 표 형태로 보기 좋게 정리할 것.

## 8. 화면 동작

### 8.1 공통

* 반 화면에서 `플래너` 버튼 클릭
* 선생님용 플래너 확인 영역 표시
* 기본 주간은 오늘이 포함된 주
* 기본 선택일은 오늘
* 오늘이 해당 주에 있으면 오늘 요일 탭 선택
* 지난 주 / 이번 주 / 다음 주 이동 가능

### 8.2 모바일

* 기본: 요일별 전체 목록
* 요일 탭 누르면 해당 날짜의 학생별 전체 계획 목록 표시
* 주간별 표 탭은 숨기거나 렌더하지 않음

### 8.3 PC

* 기본: 요일별 또는 주간별 중 기존 상태값 유지
* 처음 진입 시 기본은 `요일별`
* `요일별` 탭: 선택 요일의 학생별 목록 표시
* `주간별` 탭: 학생 × 월~일 표 표시
* 요일 탭은 요일별/주간별 모두에서 기준 날짜 확인용으로 유지 가능

## 9. 기존 제한 확인

현재 코드에 특정 반만 허용하는 문구나 조건이 있을 수 있다.

예:

```text
고1A 전용 기능입니다.
```

이번 작업에서는 플래너 기능을 반 전체 확인 기능으로 확장해야 하므로, 해당 제한이 남아 있다면 제거 또는 완화한다.

단, 무조건 전체 공개하면 안 된다.

권한 기준은 다음을 따른다.

* 현재 로그인 선생님이 접근 가능한 반이면 허용
* 관리자면 허용
* 기존 `canAccessClass` 또는 프론트의 담당반 제한 흐름이 있으면 유지
* 학생 개인 플래너 직접 접근 권한은 변경하지 말 것

## 10. 금지 사항

* 학생 개인 플래너의 저장/수정/삭제 로직을 변경하지 말 것.
* 학생이 보는 플래너 UI를 이번 작업에서 개편하지 말 것.
* 이행률 카드, 통계 카드, 위험도 분석 같은 새 요약 기능을 넣지 말 것.
* 반 화면의 출석/숙제 버튼 문구를 바꾸지 말 것.
* `숙제`를 다른 용어로 바꾸지 말 것.
* 기존 `진도`, `숙제`, `QR/OMR`, `시험성적`, `클리닉`, `플래너` 버튼명을 임의 변경하지 말 것.
* 관리자 대시보드 카드 또는 원장 화면을 수정하지 말 것.
* 테스트용 console 로그를 남발하지 말 것.
* 미완성 함수 호출을 남기지 말 것.
* 전체 파일을 축약하거나 기존 대형 블록을 삭제하지 말 것.

## 11. 검증

수정 후 반드시 아래를 실행한다.

```bash
node --check apmath/js/classroom.js
```

백엔드 파일을 수정한 경우에만 추가 실행한다.

```bash
node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/planner.js
```

## 12. 수동 확인 체크리스트

`CODEX_RESULT.md`에 아래 항목 확인 결과를 적는다.

* 반 화면에서 기존 `플래너` 버튼이 정상 작동하는지
* 모바일 폭에서 요일별 전체 목록이 보이는지
* 모바일에서 학생별 계획 항목이 모두 표시되는지
* 모바일에서 계획 없는 학생이 `등록된 계획 없음`으로 표시되는지
* PC 폭에서 `요일별 / 주간별` 보기 전환이 가능한지
* PC 요일별 보기에서 선택 날짜의 반 전체 계획이 보이는지
* PC 주간별 보기에서 학생 × 월~일 표가 보이는지
* 주간별 셀에 실제 계획 제목들이 누락 없이 표시되는지
* 완료된 항목이 구분되는지
* 기존 출결/숙제/진도/QR/OMR/시험성적/클리닉 버튼이 그대로 남아 있는지
* 기존 학생 개인 플래너 저장/수정/삭제 흐름을 건드리지 않았는지
* 기존 문구·버튼명·화면명을 요청 범위 밖에서 변경하지 않았는지

## 13. 완료 보고 작성

작업 완료 후 프로젝트 루트에 `CODEX_RESULT.md`를 작성한다.

형식은 반드시 아래 구조를 사용한다.

```markdown
# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `...`

## 2. 구현 완료 또는 확인 완료
- ...

## 3. 실행 결과
- `node --check apmath/js/classroom.js`: PASS 또는 실패 내용

## 4. 결과 요약
- ...

## 5. 잘못한 점/위험했던 점/보존해야 할 점
- 잘못한 점:
- 위험했던 점:
- 보존해야 할 점:

## 6. 다음 조치
- ...
```

마지막 터미널 출력은 반드시 아래 문장으로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
