# CLAUDE_RESULT1 — EIE 출석부 (선생님별 월간 시간표 출석판)

담당: Claude Code (Opus 4.8). 작업일: 2026-06-09.

---

## 1. APMS에서 실제 확인한 구조

선행 확인 파일을 직접 열어 다음을 확인했다.

- **apmath/js/timetable.js / classroom.js / cumulative.js**
  - APMS 시간표/출석부는 `timetable_cells` 같은 단일 테이블이 아니라
    `classes`, `class_students`, `students`, `teacher_name`, `schedule_days`,
    `time_label` 등을 조합해서 표 틀을 만든다.
  - 월간 출석판(cumulative.js)은 **sticky 좌측 이름열 + sticky 상단 날짜열**,
    `<th class="pa-day">` 날짜 헤더, `endDay = new Date(year, monthNo, 0).getDate()`로
    월 날짜 배열 생성, `○/×` 기호 표시 구조를 쓴다.
  - 출석 표현은 `status`(등원/결석) + `tags`(상담/보강 등 콤마 텍스트) 모델이며,
    저장 실패 시 `syncAttendanceMetaToState(prev)`로 **롤백**한다.
  - 월간 캐시/인덱스(`apmsInvalidateDataIndexes()`) 패턴으로 재조회를 줄인다.

- **apmath/worker-backup/worker/routes/attendance-homework.js**
  - `attendance-month?month=YYYY-MM` → `date BETWEEN start AND end` 범위 조회.
  - `attendance` PATCH는 `status / tags / memo`를 부분 갱신, `id = studentId_date`.
  - `tags`는 `normalizeText`로 콤마 텍스트 정규화.

**가져온 것(감각만):** 표 틀(sticky 행/열), 월간/날짜 기반 운영 감각, ○/× 중심 표현,
status+tags 모델, 저장 실패 롤백, 월간 캐시/인덱스 패턴.

**가져오지 않은 것:** APMS `class_students` 기반 데이터 원천, `classes/teacher_classes`
조인, APMS `attendance`/`homework` 테이블 접근 — EIE에 이식하지 않았다.

---

## 2. EIE에서 실제 사용한 시간표/출석 데이터 구조

- **시간표 원천:** EIE `timetable_cells` (assigned_students, day_teachers,
  raw_meta_json, period_order, start_time/end_time, class_name_raw 등).
- **세션 생성:** 기존 `EieTimetableView._buildDisplaySessions(cells)`를 재사용해
  병합 세션(card)을 만든다. 각 세션은 `source_cell_ids`, `day_teachers`(요일→선생님),
  `periods`, `material/class_full_name`, `students`(student_id 포함)를 가진다.
- **원장 화면 데이터 생성:**
  1. 선택 월의 **평일(월~금)** 날짜 컬럼 배열 생성 (EIE는 주말 수업 없음).
  2. EIE 시간표 셀 → 세션.
  3. 각 세션 × 요일(월~금)에서 `day_teachers[day]`에 있는 선생님별로 row 생성.
  4. **선생님별로 묶어** 섹션화. row = 선생님 + 요일 + 교시/시간 + 수업반.
  5. row 정렬: 요일 → period_order → 수업명.
  6. 날짜 칸: 그 날짜의 요일이 row 요일과 같을 때만 `date + timetable_cell_id`
     출석 요약 기호 표시.
  7. 칸 클릭 → 입력판(우측 패널). 저장은 셀(수업) 단위로 배정 학생 전체에 적용.
- **출석 저장 구조:** `eie_attendance_records`에 `status`(등원/결석/'') +
  `tags`(상담,보강) 저장. 저장 단위는 **date + timetable_cell_id + student_id**.
- 같은 학생이 같은 날짜 여러 수업에 있어도 셀별로 독립 레코드를 가진다(덮어쓰기 없음).

---

## 3. 수정/추가 파일 목록

신규:
- `migrations/20260609_eie_attendance_cell_unique.sql` — UNIQUE를
  `(student_id, date, timetable_cell_id)`로 재구성 + `tags` 컬럼 추가(기존 행 보존).
- `eie/js/views/eie-attendance.js` — 원장 월간 출석판 뷰 + 셀 입력판.
- `tests/eie-attendance-board-contract.test.js` — 출석판 UI/UX·로직 계약 테스트.

수정:
- `workers/wangji-eie-worker/routes/eie.js` — status 빈값 허용, `tags` 정규화,
  월(month) 범위 조회, `(student_id,date,timetable_cell_id)` 기준 upsert,
  셀 단위 일괄 저장 핸들러 `attendance-records/cell`(D1 batch) + 라우트.
- `eie/js/eie-api.js` — `getAttendanceMonth(month)`, `saveAttendanceCell(payload)`,
  `getAttendanceRecords`에 month 파라미터 추가.
- `eie/js/eie-state.js` — `attendance` 슬라이스(month/byMonth 캐시/index/draft) +
  관련 메서드(월 캐시, date|cell 인덱스, 셀 결과 반영, draft, 무효화).
- `eie/js/eie-router.js` — `attendance` 라우트 추가.
- `eie/index.html` — `eie-attendance.js` script 추가, 드로어에 출석부 메뉴 추가.
- `eie/js/views/eie-dashboard.js` — 출석부 바로가기 활성화(`data-eie-route="attendance"`).
- `tests/eie-owner-dashboard-ap-parity.test.js` — "출석부 미구현" 단언을
  "구현됨/attendance 라우트" 단언으로 갱신(아래 D 참고).

APMS 파일은 **참조만** 했고 수정하지 않았다.

---

## 4. 구현한 기능

- 원장 기본 화면 = **선생님별 월간 시간표 출석판**(학생 전체 월간표 아님).
- 월 이동(‹ ›), 상단 기호 범례(○ × ★ ■).
- 셀 클릭 → 우측 입력판. 버튼 `○ × ★ ■` + `저장`만(취소 없음).
- 자동 저장 없음. 기호 클릭은 임시 상태만 변경, 저장 버튼에서만 실제 저장.
- 선택 규칙: ○/× 상호배타, ★/■는 ○와 공존·단독 가능, ×는 ★/■ 자동 해제,
  미선택 저장 시 공란(레코드 삭제).
- 셀 표시: 출석 ○ / 결석 × / 상담 ★ / 보강 ■ /
  출석+상담 ○(작은 ★) / 출석+보강 ○(작은 ■) / 출석+상담+보강 ○(작은 ★■) / 공란.
- 저장 단위 date+cell+student, 셀 단위 일괄 저장(배정 학생 전체), 저장 실패 시 롤백.

---

## 5. 하위 에이전트 A/B/C/D 검수 결과

> 본 작업의 검수는 동일 세션 내에서 단계별로 직접 수행했다(별도 에이전트 스폰은
> 호스트 가이드상 사용자 요청 시에만 허용되어, 같은 기준의 점검을 인라인으로 진행).

**A — APMS 구조 조사/포팅 범위:** PASS.
timetable/classroom/cumulative/attendance-homework를 실제로 열어 확인.
APMS `class_students`/`classes` 기반 데이터 원천을 EIE에 이식하지 않음.
표 틀·월간 감각·status+tags·롤백·캐시 패턴만 차용. APMS attendance/homework 미접근.

**B — EIE 시간표/데이터 로직:** PASS.
`_buildDisplaySessions`/`day_teachers`/`assigned_students` 흐름으로 원장 화면이
선생님별 월간 시간표로 생성됨을 브라우저에서 확인(Carmen/Zoe/Foreigner 섹션, 5 row).
저장 단위 date+cell+student. 같은 날짜 다른 셀이면 독립 레코드(마이그레이션 테스트로
다중-수업 동일-날짜 비충돌 확인). `eie_attendance_records`에만 기록.

**C — UI/UX:** PASS.
원장 기본 화면이 선생님별 월간 시간표(학생 전체표 아님). 기호 ○ × ★ ■ 공란만 사용.
지각/메모/확인 필요 1차 화면 미포함(계약 테스트의 정규식 가드로 확인).
입력판에 텍스트 설명 반복 없음(`○ × ★ ■ 저장`만). 저장 버튼 있음·취소 버튼 없음.
자동 저장 없음(pick는 API 미호출). PC 도형 명확/모바일 반응형(@media 720px) 처리.

**D — 테스트/회귀:** PASS(아래 6 참조). 단, 사전 존재 실패 1건은 본 작업과 무관.

---

## 6. 실행한 검증 명령

- `node --check` — 수정/신규 JS 5종(브라우저) + worker(eie.js, script·module 모두) 통과.
- 마이그레이션 검증(`node:sqlite`, 임시 메모리 DB):
  기존 행 보존, `tags` 컬럼 추가, `(student_id,date,timetable_cell_id)` UNIQUE,
  동일 학생·동일 날짜·다른 셀 2건 비충돌, worker upsert(ON CONFLICT)로 원 id 유지 확인.
  (임시 테스트 스크립트는 실행 후 삭제)
- `node --test tests/eie-*.test.js tests/attendance-index-invalidation.test.js`
  → 17 pass / 1 fail. 유일 실패는 `eie-teacher-classroom-panel-route.test.js`
  (`EieTeacherView.openClassroom` 미존재) — `git stash`로 본 변경 제외 후에도 동일하게
  실패하는 **사전 존재 결함**이며 본 작업과 무관(eie-teacher.js 미수정).
- `node --test tests/eie-attendance-board-contract.test.js` → PASS(신규).
- `node --test tests/eie-owner-dashboard-ap-parity.test.js` → PASS(단언 갱신 후).

---

## 7. 브라우저 확인 여부

**확인함.** 정적 서버(`npx serve`) + preview로 `/eie/#attendance` 로드.
- 콘솔 에러 없음.
- 빈 상태: 제목 "출석부", 범례 `○ 출석 × 결석 ★ 상담 ■ 보강`, 월 "2026년 6월",
  "표시할 선생님별 수업이 없습니다." 정상 표시.
- 모의 시간표/출석 주입: Carmen/Zoe/Foreigner 3개 선생님 섹션, 5개 row,
  6/1(월) 칸에 `○★`(출석+상담) 요약 기호 렌더 확인.
- 셀 클릭 → 입력판: 헤더 "2026-06-01 월요일", 버튼 `○ × ★ ■`(현재 ○·★ active),
  `저장` 존재·`취소` 없음, 텍스트 설명 반복 없음. 스크린샷으로 레이아웃 확인.

---

## 8. 남은 위험 / 후속 후보

- **선생님 날짜 입력판 화면(후순위):** 이번 범위에서는 원장 월간 출석판 + 셀 저장을
  우선 완성했다. 선생님용 날짜 선택형 화면은 동일 기호 입력 컴포넌트
  (`EieAttendanceView.openCell/pick/save`)를 재사용해 추가하는 후속 후보로 남긴다.
- **셀=학급 단위 저장 의미:** 입력판에 학생 목록이 없으므로(사양상 금지) 한 셀의 기호는
  배정 학생 전체에 동일 적용된다. 학생별 상이한 출결이 필요해지면 셀 상세 입력이 후속 과제.
- **배정 학생 student_id 없는 셀:** 후보 학생만 있고 confirmed student_id가 없는 셀은
  저장 불가(입력판에 "배정된 학생이 없어 저장할 수 없습니다." 안내) — 의도된 1차 제약.
- **마이그레이션 적용 순서:** `20260609_...`는 `20260602_...`가 만든 테이블이 있다고
  가정한다(순차 적용 전제). prod 적용 시 순서 보장 필요.
- **월 범위 조회 상한:** 워커는 `date <= 'YYYY-31'`로 범위를 잡아 모든 월에서 안전.

---

## 9. 임시 파일 삭제 여부

- 마이그레이션 검증용 임시 스크립트(`/tmp/eie_mig_test.mjs`)는 실행 직후 삭제했다.
- `tests/eie-attendance-board-contract.test.js`는 임시 파일이 아니라 정식 회귀
  테스트로 **의도적으로 유지**한다(추가 이유: 출석판의 기호 체계·선택 규칙·자동 저장
  금지·저장 단위를 코드로 고정해 회귀 방지).
- 그 외 임시 산출물 없음.

---

## 10. git add/commit/push 미수행 명시

요청대로 `git add` / `git commit` / `git push`를 **수행하지 않았다.**
모든 변경은 워킹 트리에만 있다(스테이징/커밋 없음).
