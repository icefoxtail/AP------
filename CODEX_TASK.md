# EIE 대시보드 — 선생님 현황 "재원" 호버 전환 작업 지시서

형님 지시: **EIE 대시보드 "선생님 현황" 카드에서 `담당반`/`재원` 클릭 이동을 없애고, `재원`은 호버 시 그 선생님이 담임인 반의 재원 인원수만 뜨게 한다.**

- "선생님이 들어가는 수업 인원"이 아니라 **"담임을 맡고 있는 반의 재원 인원"** 이어야 함.
- `재원` 호버 내용은 **총 인원수만** (상단 재원생 카드 같은 학년별 그리드 X).
- `담당반`은 **클릭만 제거** — 카드 하단에 이미 교시별 담당 반이 뜨므로 그 부분에 대한 안내 라벨 역할.

실행: Codex / 검수: Claude

---

## 0. 현재 상태 기준 (확인된 사실)

- 대상 렌더: `eie/js/views/eie-dashboard.js` 의 `renderTeacherStatus(data)` (약 440행~).
- 선생님 카드에 두 개의 클릭 버튼이 있음:
  - **담당반** — `eie-dashboard.js:451`, `onclick="... openDashboardTeacherClassroom(name)"` → 교실(Classroom) 화면 이동.
  - **재원** — `eie-dashboard.js:452`, `onclick="... openDashboardTeacherStudents(name)"` → 학생 화면(교사 필터) 이동.
- 카드 하단 `renderTeacherPeriodRows`(`eie-dashboard.js:402`)에 이미 교시별 담당 반/인원이 표시됨.
- 상단 "재원생 / 최근 등록 / 퇴원" 카드의 **호버 툴팁** 패턴:
  - `renderEieOverviewStatCard(...)` (`eie-dashboard.js:630`)가 `.eie-owner-stat__tip` div를 만들고,
  - CSS `eie/css/eie-dashboard-classroom.css:1715~1735` 에서 `:hover` / `:focus-within` 시 노출.
- quick-action 버튼 CSS: `eie/css/eie-dashboard-classroom.css:67~85`.
- 대시보드 roster: `DASHBOARD_TEACHER_ROSTER = ['Carmen','Zoe','IVY','STACY','Lily','Foreigner']` (`eie-dashboard.js:53`).

### 담임(담당) 판정 — 시간표와 동일하게

시간표 "담임 열"에 뜨는 사람 = `eie/js/views/eie-timetable.js:1079` 의 `getPrimaryTeacherName(cell)` 결과. 로직:

```text
담임(cell) =
  1) homeroom_teacher (cell.homeroom_teacher || raw.homeroom_teacher) 가 있고 Foreigner가 아니면 → 그 사람
  2) 없으면: Foreigner 제외한 첫 교사명 → teacher_name_raw / teacher_name 폴백
  3) 그래도 없으면 '미정'
```

- raw 접근: 대시보드 셀은 API raw 셀이며 담임은 `raw_meta_json` 안 `homeroom_teacher` 로 실려옴. 대시보드에는 이미 `rawOfDashboard(cell)`(`eie-dashboard.js:279`) 헬퍼가 있음.
- 사용할 기존 헬퍼: `classNameOfCell(cell)`(`:295`), `studentCountOfCell(cell)`(`:322`), `teacherKey(value)`(`:55`), `esc`, `uniqueNames`.
- **이 판정 로직을 그대로 쓰면 "담임 폴백 포함 여부"는 따로 결정할 필요 없음.**

---

## 1. 핵심 설계 결정

1. `재원` / `담당반` **둘 다 클릭 네비게이션 제거**. `<button onclick=...>` → 비클릭 요소.
2. `재원` 은 **호버 트리거**로 전환 — 상단 stat 카드의 `.eie-owner-stat__tip` 패턴을 재사용해 "담임반 재원 N명" 한 줄(총 인원수만) 표시.
3. `담당반` 은 **클릭만 제거한 안내 라벨**. 별도 툴팁/이동 없음 (하단 교시별 목록이 실제 담당 반 정보).
4. 담임 판정은 **시간표 `getPrimaryTeacherName` 로직을 복제**해서 일관성 유지.
5. 재원 인원은 **반 단위 중복 제거 후 합산** — 같은 반이 요일/교시별 여러 셀로 들어와 합산 시 부풀지 않게.

---

## 2. 단계별 작업 (모두 `eie/` 프론트 한정, 백엔드/DB 변경 없음)

### 1단계: 담임 판정 헬퍼 추가 (`eie/js/views/eie-dashboard.js`)

`renderTeacherStatus` 근처에 추가:

1. `isForeignerTeacherName(name)` — `teacherKey(name)`가 `'foreigner'` 인지(또는 시간표의 `isForeignerTeacher`와 동일 기준) 판정.
2. `primaryTeacherOfCell(cell)` — 위 "담임 판정" 로직 복제:
   - `cell.homeroom_teacher || rawOfDashboard(cell).homeroom_teacher` 우선(Foreigner 제외),
   - 없으면 Foreigner 제외 교사명(`teacher_names` / `teacher_name_raw` / `teacher_name`, cell·raw 양쪽), 폴백.
   - 시간표 결과와 어긋나지 않게 `eie-timetable.js:1064~1087`(`getTeacherNames`/`getPrimaryTeacherName`)와 동일 우선순위 유지.

### 2단계: 담임반 재원 합산 헬퍼 (`eie/js/views/eie-dashboard.js`)

`homeroomStudentCountForTeacher(name, cells)`:

- `cells`에서 `teacherKey(primaryTeacherOfCell(cell)) === teacherKey(name)` 인 셀만 필터.
- `classNameOfCell(cell)` 기준으로 **반 중복 제거**(같은 반 1회만 카운트).
- 반별 `studentCountOfCell(cell)` 합산. (값 없으면 0으로 무시.)
- 정수 합계 반환.

> 참고: `assigned_students` 명단이 있으면 학생 식별자 기준 dedup이 더 정확하지만, 기존 `studentCountOfCell`이 명단 우선 처리하므로 **반 단위 dedup + 합산**이면 충분.

### 3단계: "재원" 버튼 → 비클릭 호버 (`eie-dashboard.js:452`)

- `<button ... onclick="... openDashboardTeacherStudents(...)">재원</button>` 제거.
- 대체: 비클릭 호버 요소 (예시)

```html
<span class="admin-teacher-card__quick-action admin-teacher-card__quick-action--hover"
      tabindex="0" aria-label="${esc(name)} 담임반 재원">
  재원
  <span class="eie-owner-stat__tip eie-owner-stat__tip--inline">담임반 재원 ${esc(count)}명</span>
</span>
```

- `count = homeroomStudentCountForTeacher(name, data.timetableCells)`. 0명도 "담임반 재원 0명"으로 표시.
- 상단 카드의 `.eie-owner-stat__tip` 클래스를 재사용하되, 학년 그리드 없이 **텍스트 한 줄만**.

### 4단계: "담당반" 버튼 → 비클릭 라벨 (`eie-dashboard.js:451`)

- `onclick` 제거. `<button>` → `<span class="admin-teacher-card__quick-action admin-teacher-card__quick-action--static">담당반</span>`.
- 이동/툴팁 없음. 하단 교시별 목록 안내 라벨 역할.

### 5단계: CSS (`eie/css/eie-dashboard-classroom.css`)

- `.admin-teacher-card__quick-action` 호버 요소가 툴팁 기준점이 되도록 `position: relative` 보장.
- 비클릭이므로 `cursor: default` (호버 요소는 정보 강조만).
- 인라인 툴팁 표시 규칙 추가(상단 `eie-owner-stat__tip` 규칙 재사용/복제):

```css
.eie-admin-home .admin-teacher-card__quick-action--hover { position: relative; cursor: default; }
.eie-admin-home .admin-teacher-card__quick-action--hover .eie-owner-stat__tip--inline {
  /* 카드 폭 좁으므로 버튼 기준 드롭다운, 안 잘리게 */
  left: auto; right: 0; min-width: max-content; white-space: nowrap;
}
.eie-admin-home .admin-teacher-card__quick-action--hover:hover .eie-owner-stat__tip,
.eie-admin-home .admin-teacher-card__quick-action--hover:focus-within .eie-owner-stat__tip {
  opacity: 1; transform: translateY(0);
}
.eie-admin-home .admin-teacher-card__quick-action--static { cursor: default; }
```

> 기존 `.eie-owner-stat__tip` 의 `position:absolute; top:calc(100%+8px)` 등이 그대로 적용되도록 셀렉터를 맞출 것. 카드가 좁아 좌우로 잘리면 `right:0` 기준 정렬 + `min-width:max-content`.

### 6단계: 미사용 함수 정리

- `openDashboardTeacherClassroom`(`:424`) / `openDashboardTeacherStudents`(`:432`) 가 이 카드 외 **다른 사용처가 없는지** `eie/` 전체 검색.
  - 없으면 제거. 있으면(다른 진입점에서 호출) **그대로 유지**.

---

## 3. 변경 금지 / 주의

```text
- EIE 외 다른 화면(timetable/classroom/students/attendance) 로직 변경 금지.
- 담임 판정은 반드시 시간표 getPrimaryTeacherName와 동일 결과여야 함(불일치 시 형님 혼란).
- 백엔드/DB/마이그레이션 변경 없음 (순수 프론트 표시 변경).
- 카드 레이아웃·다른 카드(재원생/최근등록/퇴원 상단 카드)는 건드리지 말 것.
- 0명일 때도 깨지지 않게(툴팁 정상 표시).
```

---

## 4. 검수 체크리스트 (완료 후 Claude 검수용)

```text
[ ] 선생님 카드의 "재원" 클릭 시 더 이상 화면 이동 안 됨
[ ] 선생님 카드의 "담당반" 클릭 시 더 이상 화면 이동 안 됨
[ ] "재원"에 마우스 호버 시 "담임반 재원 N명" 툴팁 표시 (총 인원수만)
[ ] 표시되는 N = 그 선생님이 "담임"인 반들의 재원 합계 (= 시간표 담임 열 기준)
[ ] "선생님이 들어가기만 하는 수업"은 N에 포함되지 않음
[ ] 같은 반이 여러 요일/교시로 있어도 중복 합산되지 않음
[ ] Foreigner 등은 담임 판정에서 제외되어 시간표와 동일
[ ] 0명 선생님도 툴팁 정상("담임반 재원 0명"), 레이아웃 안 깨짐
[ ] 키보드 포커스(tab)로도 툴팁 노출(:focus-within)
[ ] 카드 폭에서 툴팁이 잘리지 않음(좌우/하단)
[ ] openDashboardTeacherClassroom/Students 미사용 시 제거, 사용 중이면 유지(회귀 없음)
[ ] EIE 다른 화면 회귀 없음
```
