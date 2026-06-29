형님, 이번 과제는 **EIE 선생님 대시보드의 셸 구조를 APMath 선생님 대시보드(8:4 메인/사이드)처럼 포팅**하는 작업입니다.
메모·일정 기능은 이미 API 기반으로 붙어 동작하므로, 신규 기능 추가가 아니라 **레이아웃 셸을 AP식 2단(메인/사이드)으로 재구성**하고, 그 과정에서 알려진 결함(빠른버튼 그리드 깨짐, 메모 직접수정 부재, 시험 그룹 삭제 미연결)을 함께 정리합니다.

핵심 전제:

- **원장(원장님) 대시보드는 절대 손대지 않는다.** `EieDashboardView.render()` 및 원장 경로의 레이아웃·시각·동작은 과제 전후 동일해야 한다(PC·모바일 모두).
- 포팅은 **AP의 콘텐츠가 아니라 셸 구조**를 옮기는 것이다. EIE 콘텐츠(요일 수업, 메모, 주간일정)는 그대로 두고 배치만 AP식 8:4로 바꾼다.
- 메모/일정 카드는 원장·선생님 **공용 컴포넌트**다. 선생님 전용 변경은 반드시 `mode`로 분기해 **원장 경로 동작을 보존**한다.

## 확정 결정 (형님 컨펌)

```text
[메인 8칸]  요일 수업 승격 — 현재 renderWeekdaySchedule 을 메인 컬럼으로 올린다.
            AP식 "학급관리 반 목록"은 신규 구현하지 않는다.
[사이드 4칸] 메모 → 주간일정 세로 스택. (오늘일지 카드는 생략 — EIE 일지 데이터 없음)
[일정 권한] 옵션 A 현행 유지 — 선생님도 공용 일정 편집 가능. 권한 코드 변경 없음.
```

---

# 1. 작업 범위와 불변식

## 1-1. 절대 불변 (FAIL 조건)

```text
원장 대시보드 EieDashboardView.render() 출력이 바뀌면 FAIL — PC/모바일 모두
  - ap-owner-grid 셀 배치(8/4/8/4/12)·카드 배치·호출 순서 변경 금지
  - 원장 메모 카드 행 클릭 동작 변경 금지
  - 원장 일정 카드/모달의 추가·수정·삭제 동작 변경 금지
  - 공용 카드 렌더러(renderEieMemoDashboardCard / renderEieWeeklyScheduleDashboardCard)의
    mode==='owner'(기본값) 경로 출력이 바뀌면 FAIL

메모 scope 가 owner_user_id(auth.id) 외 기준으로 바뀌면 FAIL
  - getOperationMemos 에 teacherName/teacher_name 파라미터 추가 금지

일정 권한은 옵션 A 현행 유지
  - 워커 일정 라우트에 requireEieOwner 가드 추가 금지, 선생님 일정 버튼 숨김 금지
```

## 1-2. 이번 과제 대상 (PASS 목표)

```text
선생님 대시보드 셸을 AP식 8:4 메인/사이드 2단으로 포팅
  - 메인(8): 요일 수업
  - 사이드(4): 메모 → 주간일정 세로 스택
  - <1024px 에서는 단일 컬럼으로 접힘
빠른버튼 그리드 깨짐(4버튼 3칸) 수정
선생님 메모 행에서 해당 메모 직접 수정 진입 (mode 게이팅)
시험 기간 일정의 그룹 삭제/수정 배선 (mode 게이팅)
메모/일정 카드 보조 라벨 보강(내 개인 메모 / 학원 공용 일정)
```

---

# 2. 현재 EIE 선생님 구조 (수정 기준점)

```text
파일: eie/js/views/eie-teacher.js
render():742
  section.eie-teacher-dashboard.eie-v2-screen
    h1.eie-teacher-sr-title
    div.eie-teacher-dashboard-shell   ← display:grid; gap:12px; max-width:860px (단일 컬럼)
      errorHtml
      renderHomeHead(:633)            선생님명 + 날짜 + renderShortcutRow(빠른버튼 4개)
      renderOperationCards(:719)      메모+주간일정 (auto-fit minmax 260 → 2칸 grid)
      renderWeekdaySchedule(:704)     요일 탭 + 요일 수업 행

CSS: eie/css/eie-dashboard-classroom.css
  .eie-teacher-dashboard-shell:561   display:grid; max-width:860px; gap:12px  (단일 컬럼)
  .eie-teacher-quick-cards:620       grid-template-columns: repeat(3,...)  ← 버튼 4개와 불일치
  .eie-teacher-schedule / day-row    요일 수업 카드/행 스타일 (재사용)
```

AP 참고 구조(목표 형태):

```text
파일: apmath/js/dashboard-teacher.js + injectDashboardRedesignStyles()(dashboard.js:573)
  .ap-dash-redesign
    .ap-dash-quick-panel             상단 빠른버튼
    .ap-dash-grid                    @min-width:1024px → 12칼럼
      .ap-dash-main (span 8)         학급관리(반 목록)        ← EIE에선 "요일 수업"
      .ap-dash-side (span 4)         오늘일지 + 메모 + 주간일정 ← EIE에선 "메모 + 주간일정"(일지 생략)
  .ap-dash-grid 기본 1fr, 1024px 미만에서 단일 컬럼
```

---

# 3. AP 선생님 구조 → EIE 매핑

| AP 컴포넌트 | EIE 처리 | 비고 |
|---|---|---|
| `.ap-dash-redesign` 넓은 캔버스(~1640px) | `.eie-teacher-dashboard-shell` max-width 확대(~1280px) | 2단 수용 위해 폭 확대 |
| `.ap-dash-quick-panel` (버튼 3개) | `renderHomeHead` 안의 `renderShortcutRow`(버튼 4개) | 기존 유지, 그리드만 수정 |
| `.ap-dash-grid` 8:4 | 신규 `.eie-teacher-grid` (main 8 / side 4) | 1024px 미만 단일 컬럼 |
| `.ap-dash-main` = 학급관리 | `renderWeekdaySchedule`(요일 수업) | **요일 수업 승격** |
| `.ap-dash-side` 오늘일지 | (생략) | EIE 일지 데이터 없음 |
| `.ap-dash-side` 메모 + 주간일정 | `renderOperationCards`(메모 → 주간일정) | 2칸 grid → **세로 스택** |
| `.ap-dash-card` 흰 카드 | 기존 `.eie-p-card` 토큰 유지 | 새 카드 톤 도입 안 함 |

원칙:

```text
새 CSS 는 AP 클래스(.ap-dash-*, body.ap-teacher-dashboard-mode)를 재사용하지 않는다.
  → EIE 네임스페이스(.eie-teacher-grid / -main / -side)로 새로 만든다.
카드 내부(메모/일정/수업 행) 스타일은 기존 eie-p-card / eie-v2-screen 토큰을 그대로 쓴다.
```

---

# 4. 구현 루프

## Loop 1 — AP 8:4 셸 포팅 (1순위, 본 과제 핵심)

파일: `eie/js/views/eie-teacher.js`, `eie/css/eie-dashboard-classroom.css`

`render()`를 헤더(풀폭) + 8:4 그리드(메인/사이드)로 재구성한다.

```text
변경 후 구조:
  section.eie-teacher-dashboard.eie-v2-screen
    h1.eie-teacher-sr-title
    div.eie-teacher-dashboard-shell
      errorHtml
      renderHomeHead(todayRows)              ← 풀폭 상단(선생님명/날짜/빠른버튼)
      div.eie-teacher-grid
        div.eie-teacher-main                 → renderWeekdaySchedule()   (요일 수업)
        div.eie-teacher-side                 → renderOperationCards()    (메모 → 주간일정)
```

CSS:

```text
.eie-teacher-dashboard-shell
  max-width 860px → ~1280px 로 확대, display:grid; gap:16px (헤더/그리드 세로)

.eie-teacher-grid
  기본: grid-template-columns: 1fr; gap:16px;          (모바일/태블릿 단일 컬럼)
  @media (min-width:1024px):
    grid-template-columns: minmax(0,8fr) minmax(0,4fr);
    align-items: start;
.eie-teacher-main { min-width:0; }
.eie-teacher-side { min-width:0; display:grid; gap:12px; align-content:start; }
```

renderOperationCards 수정:

```text
현재: .eie-teacher-operation-grid  grid auto-fit minmax(260,1fr)  (메모|일정 2칸)
변경: 사이드(4칸)로 들어가므로 세로 스택으로 — display:grid; gap:12px; (1 컬럼)
      메모 카드 → 주간일정 카드 순서 유지.
```

주의:

```text
eie-v2-screen 래퍼, data-eie-teacher-key, sr-title, errorHtml 위치는 유지(다크모드/테마/접근성).
renderWeekdaySchedule 자체(요일 탭/수업 행)는 콘텐츠 변경 없이 메인 컬럼으로 이동만.
메모/일정 카드 렌더러(공용)는 호출만 하고 내부는 손대지 않는다(원장 불변).
1024px 미만에서 사이드가 메인 아래로 자연스럽게 떨어지는지 확인(요일수업 → 메모 → 주간일정).
```

---

## Loop 2 — 빠른버튼 그리드 수정 (셸 일부)

파일: `eie/css/eie-dashboard-classroom.css`

```text
.eie-teacher-quick-cards
  현재: grid-template-columns: repeat(3, minmax(0,1fr));
  변경:
    PC(기본):        repeat(4, minmax(0,1fr));
    모바일(<=620px): repeat(2, minmax(0,1fr));   ← 2×2
```

```text
JS(renderShortcutRow) 버튼 수/순서 변경 금지. .eie-teacher-quick-card 토큰 스타일 유지.
```

---

## Loop 3 — 메모 행 직접 수정 진입 (mode 게이팅)

파일: `eie/js/views/eie-operation-memos.js`

```text
현재: renderMemoRow(row, compact=true) → rowAction = openEieTodoMemoModal()  (목록 모달)
변경: renderMemoRow(row, compact, mode)
        mode==='teacher' → openEditEieTodoMemoModal(id)   (해당 메모 직접 수정)
        그 외(원장)       → openEieTodoMemoModal()          (현행 유지)
      renderEieMemoDashboardCard 에서 mode 를 행까지 주입.
```

```text
options.mode 기본값 'owner' 유지 → 원장 경로 동작 보존(불변식 1-1).
체크박스 완료 토글·stopPropagation 동작 유지.
```

---

## Loop 4 — 시험 기간 일정 그룹 삭제/수정 배선 (mode 게이팅 필수)

파일: `eie/js/views/eie-operation-schedule.js`

```text
*** 카드/모달은 원장·선생님 공용. 그룹 삭제/수정·그룹 표시는 mode==='teacher' 에서만 켠다.
    원장(mode==='owner', 기본값) 경로는 현행 코드를 그대로 통과시킨다. ***

mode 를 모달 열기 체인까지 전달:
  openEieScheduleModal(mode) / renderScheduleModal(data, mode)
  openEditEieUnifiedScheduleModal(kind, id, seriesId, occurrenceIds, mode)

표시(teacher 한정):
  renderScheduleModal mode==='teacher' → combinedRows(data,{group:true}), 행에 occurrenceIds 실음
  원장 → 현행 combinedRows(data)(개별 일자 행) 유지

삭제 deleteEieUnifiedSchedule (teacher + exam):
  occurrenceIds 길이 > 1 → EieApi.deleteExamScheduleGroup(occurrenceIds)
  단건                   → EieApi.deleteExamSchedule(id)   (현행)
  academy / 원장          → 현행 유지

수정 handleEditEieUnifiedSchedule (teacher + exam):
  기간 변경 → EieApi.updateExamScheduleGroup(payload)
  단건      → EieApi.updateExamSchedule(id, payload)
  원장      → 현행 updateExamSchedule 유지
```

```text
그룹 API(create/update/deleteExamScheduleGroup)와 워커 group-delete 라우트는 이미 존재 → 백엔드 추가 불필요.
mode 스레딩이 전역 onclick 구조상 과도하게 침습적이면 Loop 4 보류 후 별도 과제로 분리(원장 불변 우선).
```

---

## Loop 5 — 카드 보조 라벨 보강

파일: `eie/js/views/eie-operation-memos.js`, `eie/js/views/eie-operation-schedule.js`

```text
메모 카드:     "메모"     + 보조 "내 개인 메모"
주간일정 카드: "주간일정"  + 보조 "학원 공용 일정"
```

```text
기능명 변경 금지, 보조 문구만 추가. --eie-p-text-sub 토큰 사용.
원장 톤이 어색하면 mode==='teacher' 일 때만 노출(불변식 1-1 우선).
```

---

# 5. 범위 외 / 보류 (이번 과제에서 하지 않음)

```text
AP식 학급관리(반 목록) 메인 컬럼 신규 구현 — 이번엔 요일수업 승격으로 대체.
오늘일지 카드 — EIE 일지 데이터/기능 없음. 별도 대형 과제.
원장 화면 선생님 명단 하드코딩(DASHBOARD_TEACHER_ROSTER, eie-dashboard.js:53) — 원장 파일이라 제외.
AP 선생님 보조 자동 메모(결석/숙제/일지 알림) — 데이터 모델 연계 필요, 후속.
메모 인라인 빠른 추가 폼 — 현행 모달 유지.
주간일정 편집 권한 분리 — 옵션 A 확정, 변경 없음.
```

---

# 6. 회귀 위험

```text
높음:
  공용 카드(메모/일정) 변경이 원장 경로 동작을 바꾸는 것
    → 모든 변경 mode 게이팅, 원장 경로는 기존 분기 그대로 통과 검증.
  셸 그리드 도입 시 min-width:0 누락으로 카드 내용이 컬럼을 밀어 가로 오버플로
    → main/side 에 min-width:0, grid 컬럼 minmax(0,*fr) 적용.

중간:
  1024px 경계에서 사이드가 메인 아래로 안 떨어지거나 순서 꼬임
    → 요일수업 → 메모 → 주간일정 순서 확인.
  빠른버튼 그리드 변경이 모바일에서 줄바꿈/높이 깨짐 → PC4 / 모바일2×2 양쪽 확인.
  eie-v2-screen 래퍼/data 속성 누락으로 다크모드·테마 색 깨짐 → 래퍼·속성 보존.
```

---

# 7. Codex 지시 핵심 문장

```text
EIE 선생님 대시보드 셸을 APMath 선생님(8:4 메인/사이드)처럼 포팅한다. 원장 대시보드는 손대지 않는다.

구조:
  헤더(선생님명/날짜/빠른버튼)는 풀폭 상단.
  그 아래 8:4 그리드 — 메인(8)=요일 수업, 사이드(4)=메모 → 주간일정 세로 스택.
  1024px 미만은 단일 컬럼. 오늘일지/학급관리 신규 구현은 하지 않는다.
  새 CSS 는 .ap-dash-* 를 재사용하지 말고 .eie-teacher-grid/-main/-side 로 만든다.
  카드 내부는 기존 eie-p-card / eie-v2-screen 토큰 유지.

원장 불변:
  공용 메모/일정 컴포넌트 수정은 options.mode 로 분기, mode='owner' 경로 출력/동작을 보존한다.

선생님 변경:
  1) render 를 헤더 → 8:4 그리드(메인=요일수업 / 사이드=메모·주간일정)로 재구성.
  2) .eie-teacher-quick-cards 를 PC 4칸 / 모바일 2×2 로 고친다.
  3) 선생님 메모 행 클릭은 해당 메모 수정창으로 직행(mode==='teacher' 한정).
  4) 시험 기간 일정 삭제/수정을 그룹 단위로 연결(mode==='teacher' 한정).
  5) 메모 "내 개인 메모", 일정 "학원 공용 일정" 보조 라벨 추가.

메모 scope 는 절대 바꾸지 않는다(teacher 파라미터 금지). 일정 권한은 옵션 A 현행 유지.
원장 대시보드는 PC·모바일 모두 과제 전과 동일해야 한다.
```

---

# 8. 최종 검수 기준 (PASS/FAIL)

```text
1.  원장 대시보드 렌더 결과가 과제 전과 동일하다 — PC.                               [불변]
2.  원장 대시보드가 모바일 폭에서도 과제 전과 동일하다.                              [불변]
3.  원장 메모/일정 카드 동작(행 클릭·추가·수정·삭제)이 과제 전과 동일하다.          [불변]
4.  선생님 대시보드가 ≥1024px 에서 8:4 2단(메인=요일수업 / 사이드=메모·주간일정)이다.
5.  선생님 대시보드가 <1024px 에서 단일 컬럼(요일수업 → 메모 → 주간일정)으로 접힌다.
6.  사이드에서 메모 → 주간일정 순으로 세로 스택된다(2칸 grid 아님).
7.  오늘일지 카드는 없다(생략 확정).
8.  선생님 빠른버튼 4개가 PC 한 줄(4칸), 모바일 2×2 로 정렬된다.
9.  선생님 메모 행을 누르면 해당 메모 수정창이 바로 열린다.
10. 선생님 화면에서 시험 기간(예 7/2~7/4) 일정을 한 번에 삭제하면 전체 일자가 삭제된다.
11. 선생님 화면에서 시험 기간 일정을 그룹 수정하면 묶인 일자에 반영된다.
12. 메모 카드 "내 개인 메모", 일정 카드 "학원 공용 일정" 보조 라벨이 보인다.
13. 메모 API 호출에 teacher_name/teacherName 파라미터가 없다.                        [scope]
14. 선생님도 공용 일정을 추가/수정/삭제할 수 있다(옵션 A).
15. 다크모드·선생님 테마색이 정상(eie-v2-screen 토큰 적용)이다.
16. 가로 스크롤/카드 오버플로가 없다(min-width:0 적용).
17. 위 항목 중 원장 화면이 PC·모바일 어느 한 군데라도 바뀌면 FAIL.
```
