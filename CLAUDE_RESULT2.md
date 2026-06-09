# CLAUDE_RESULT2 — EIE 출석부 우선순위 보정 (선생님 날짜별 학생별 입력판 1순위)

담당: Claude Code (Opus 4.8). 작업일: 2026-06-09. (CLAUDE_RESULT1 후속 보정)

---

## 1. 이전 지시의 우선순위 오류를 어떻게 보정했는지

CLAUDE_RESULT1 구현은 **원장 월간판 + 셀 단위 일괄 저장**을 1순위로 만들었으나,
보정 지시에 따르면 1차 핵심은 **선생님이 매일 입력하는 날짜별·교시별 "학생별" 입력판**이다.
다음과 같이 방향을 바로잡았다.

- 출석부 진입 시 **세션 역할로 화면을 분기**한다.
  - 선생님 로그인 → **선생님 날짜별 입력 화면**(1순위, 실제 입력).
  - 원장 로그인 → **월간 확인판**(2순위, 확인용).
- **셀 단위 전체 학생 일괄 저장을 완전히 제거**했다.
  - 프런트 `EieApi.saveAttendanceCell` 삭제.
  - 워커 `handlePostAttendanceCell` 및 `attendance-records/cell` 라우트 삭제.
  - 코드베이스에 해당 경로 잔존 없음(grep 확인).
- 실제 입력은 **학생별**로만 이루어진다(`EieApi.saveAttendanceRecord`,
  저장 단위 date + timetable_cell_id + student_id).
- 원장 월간판은 **확인 화면**으로 격하하고, **셀 클릭 시 학생별 드릴다운**
  (학생 목록 → 학생별 입력판)으로 열리도록 보정했다.
- CLAUDE_RESULT1 결과물(route/API/state/cache/index/migration/기호 렌더/월간판/롤백 패턴)은
  버리지 않고 재사용했다.

---

## 2. 선생님 날짜별 입력판 구현 내용

화면 구조(지시한 흐름 그대로):

```
날짜 선택(‹ › / 날짜 입력)
→ 선택 날짜의 요일 계산 (weekdayOf)
→ 로그인 선생님이 그날 담당하는 수업만 추출 (day_teachers[요일]에 본인 포함)
→ period_order / start_time 기준 교시별 수업 카드 나열 (sortSessions)
→ 각 카드 아래 assigned_students 명단 표시
→ 학생 이름 옆 출석 셀 클릭 → 학생별 입력판
```

- 헤더: `{선생님} 출석부`, 날짜 라벨 `2026-06-08 월요일`.
- 수업 카드: `{교시} {시간} {반}` + 학생 행(이름·학년 + 출석 셀 기호).
- 학생 셀 클릭 → 입력판: `○ × ★ ■` + `저장`만. 취소 없음, 텍스트 설명 반복 없음.
- 자동 저장 없음: 기호 클릭은 임시 상태만 변경, 저장 버튼에서만 실제 저장.
- 선택 규칙: ○/× 상호배타, ★/■는 ○와 공존·단독 가능, ×는 ★/■ 자동 해제,
  미선택 저장 시 공란(서버에서 해당 학생 레코드 삭제).
- 저장 실패 시 직전 학생 상태로 롤백(`applyAttendanceStudentResult(prev)`).
- student_id가 확정되지 않은 학생 행은 입력 불가로 표시(— 비활성).

브라우저 확인: Carmen/월요일에서 1교시 RS2-1 카드, 학생 민준·서윤 표시,
서윤 × 저장 시 서윤만 ×로 바뀌고 민준은 그대로(일괄 적용 아님) 확인.

---

## 3. 원장님 확인 화면 유지/보정 내용

- 월 선택 → 선생님별 섹션 → 각 선생님 월간 시간표(요일·교시·반 row × 날짜 컬럼).
- 칸에는 그 수업의 출석 요약 기호(확인용 roll-up)를 표시.
- **칸 클릭 = 입력이 아니라 확인**: 그 수업의 **학생별 드릴다운** 패널을 열어
  학생별 현재 상태를 보여주고, 학생을 누르면 학생별 입력판으로 수정 가능(§139 반영).
- 안내 문구를 "확인판"으로 바꿔 입력 화면이 아님을 명확히 함.
- 학생 전체 가나다 월간표를 기본 화면으로 만들지 않음.

---

## 4. 저장 구조

- 저장 단위: **date + timetable_cell_id + student_id** (학생별).
- API: `POST /api/eie/attendance-records` (`saveAttendanceRecord`).
  - 상태 `등원`/`결석`/`''`(공란), 태그 `상담,보강`.
  - `결석` 선택 시 태그 자동 제거(서버에서도 강제).
  - 공란(상태·태그 모두 없음) → 해당 (student,date,cell) 레코드 **삭제**.
  - upsert는 `ON CONFLICT(student_id, date, timetable_cell_id)`로 동일 학생·날짜·다른
    수업이 충돌하지 않음.
- 마이그레이션(`20260609_eie_attendance_cell_unique.sql`)은 그대로 사용
  (UNIQUE(student_id,date,timetable_cell_id) + tags 컬럼, 기존 행 보존).
- 셀 단위 일괄 저장 경로 제거.

---

## 5. 수정 파일 목록

수정:
- `eie/js/views/eie-attendance.js` — 선생님 날짜별 입력 화면(학생별 입력판) +
  원장 확인판(학생 드릴다운)로 전면 재작성. 셀 일괄 저장 제거.
- `eie/js/eie-api.js` — `saveAttendanceCell` 삭제(학생별 `saveAttendanceRecord` 유지).
- `eie/js/eie-state.js` — `viewDate`/`selectedStudentId` 추가,
  `setAttendanceViewDate`, `setAttendanceStudentSelection`,
  `clearAttendanceStudentSelection`, `applyAttendanceStudentResult` 추가.
- `workers/wangji-eie-worker/routes/eie.js` — `handlePostAttendanceCell` 및
  `attendance-records/cell` 라우트 삭제. `handlePostAttendanceRecord`에 공란-삭제 추가.
- `tests/eie-attendance-board-contract.test.js` — 학생별 입력/일괄저장 제거/원장
  드릴다운 계약으로 재작성.

유지(이전 라운드 산출, 그대로 재사용):
- `migrations/20260609_eie_attendance_cell_unique.sql`
- `eie/js/eie-router.js`(attendance 라우트), `eie/index.html`(스크립트·드로어),
  `eie/css/eie.css`(출석판 스타일 — 학생 카드/행 스타일 포함), `eie/js/views/eie-dashboard.js`.

APMS 파일은 참조만, 수정 없음.

---

## 6. 하위 검수 A/B/C/D 결과

> 검수는 동일 세션 내 단계별 직접 수행(호스트 가이드상 에이전트 스폰은 사용자 명시 요청 시).

**A — 구조 재확인:** PASS. CLAUDE_RESULT1을 읽고 우선순위 오류(원장판/셀 일괄저장 우선)를
인지. 선생님 날짜별 학생별 입력판을 1순위로 보정했음을 확인.

**B — EIE 시간표 로직:** PASS.
- 선택 날짜의 요일 기준으로 로그인 선생님 담당 수업만 노출
  (브라우저: 월요일에 Carmen 수업만, Foreigner 수요일 수업 미노출).
- 수업 카드 period_order/start_time 정렬(sortSessions).
- 카드 아래 assigned_students 정확 표시(민준/서윤).
- 저장 단위 date+timetable_cell_id+student_id(계약 테스트 payload 검증, student_ids 없음).

**C — UI/UX:** PASS.
- 선생님 화면이 "1교시 학생명단 / 2교시 학생명단" 구조(교시 카드 + 학생행).
- 기호 ○ × ★ ■ 공란만.
- 입력판에 기호 설명 문구 반복 없음(`○ × ★ ■ 저장`).
- 저장 버튼 있음, 취소 버튼 없음.
- 자동 저장 없음(기호 pick은 API 미호출 — 테스트로 apiCalls===0 확인).

**D — 회귀/테스트:** PASS(아래 7). 유일 실패는 본 작업과 무관한 사전 결함.

---

## 7. 실행한 검증 명령

- `node --check` — 재작성/수정 파일(view, state, api, worker, 계약 테스트) 전부 통과.
- `grep` — `saveAttendanceCell` / `handlePostAttendanceCell` / `attendance-records/cell`
  잔존 없음 확인(셀 일괄저장 완전 제거).
- `node --test tests/eie-attendance-board-contract.test.js` → PASS
  (셀 일괄저장 제거·교시별 학생명단·기호 4종·자동저장 금지·선택 규칙·학생별 단건 저장·
  원장 드릴다운 확인).
- `node --test tests/eie-*.test.js tests/attendance-index-invalidation.test.js`
  → 19개 중 18 pass / 1 fail. 유일 실패는 `eie-teacher-classroom-panel-route.test.js`
  (`EieTeacherView.openClassroom` 미존재) — `git stash`로 본 변경 제외해도 동일 실패하는
  **사전 존재 결함**, eie-teacher.js 미수정으로 본 작업과 무관.
- 마이그레이션은 이전 라운드에서 `node:sqlite`로 검증 완료(변경 없음).
- 회귀 대상 route(시간표/학생관리/클래스룸/상담/대시보드) 관련 EIE 테스트 모두 통과.

---

## 8. 브라우저 확인 여부

**확인함**(정적 서버 + preview, 콘솔 에러 없음).
- 선생님 화면(role=teacher, Carmen): "Carmen 출석부", "2026-06-08 월요일",
  1교시 RS2-1 카드 + 민준/서윤, 학생 셀 클릭 → 입력판(○×★■+저장, 취소 없음),
  서윤 × 저장 → 서윤만 ×로 변경(민준 ○★ 유지) = 학생별 저장 동작 확인. 스크린샷 확보.
- 원장 화면(role=admin): "확인판" 안내, Carmen/Zoe/Foreigner 3개 섹션 월간 표,
  셀 클릭 → 학생별 드릴다운(민준 ○★ / 서윤) 확인. 스크린샷 확보.

---

## 9. 남은 위험 / 후속 후보

- **선생님 식별:** 로그인 세션의 `WANGJI_EIE_NAME`/`teacherName`을 day_teachers와
  teacherKey로 매칭한다. 표시명이 시간표 표기와 다르면 매칭 누락 가능 → 표기 정합성은 별도 관리 필요.
- **student_id 미확정 학생:** 후보만 있고 confirmed id가 없는 학생은 입력 비활성(—) 처리.
  확정 후 입력 가능(의도된 제약).
- **원장 드릴다운 편집:** 원장도 드릴다운에서 학생별 수정 가능(§139 "가능하면" 반영).
  운영상 입력 주체를 선생님으로 한정하려면 권한 분리 추가가 후속 후보.
- **월간 캐시:** 선생님 화면도 날짜가 속한 월 캐시를 공유한다. 월 경계 이동 시 재조회됨.

---

## 10. git add/commit/push 미수행 명시

요청대로 `git add` / `git commit` / `git push`를 **수행하지 않았다.**
모든 변경은 워킹 트리에만 있다.

---

## 11. 최종 보정(5건) — 추가 반영

지시한 4개 대상 파일에 대해 다음을 추가 보정했다.

1. **공란 셀 `+` 제거** — `eie/js/views/eie-attendance.js`.
   기록 없는 학생 셀을 `<span class="eie-att-sym-empty" aria-hidden="true"></span>`로
   바꿔 진짜 빈 칸으로 만들었다(클릭 영역은 유지). 브라우저에서 서윤 셀이 빈 칸이고
   `+` 표식이 없음을 확인.

2. **백엔드 `timetable_cell_id` 필수 검증** — `workers/.../routes/eie.js`.
   `handlePostAttendanceRecord`에서 `if (!cellId) return jsonResponse({ ... 'timetable_cell_id is required' }, 400)`
   추가. student_id + date 단독 저장을 차단.

3. **원장 월간 요약 결석 숨김 버그 수정** — `eie/js/views/eie-attendance.js`.
   `summarize()`가 `absent: absent && !present` → `absent`(원본)로 변경. 한 수업에
   결석 학생이 1명이라도 있으면 원장 확인판에 ×가 드러난다(렌더는 absent 우선).
   브라우저에서 stu1 출석 + stu2 결석 → Carmen 월 6/1 칸이 ×로 표시됨을 확인.

4. **선생님 입력 화면 CSS 추가** — `eie/css/eie.css`.
   `eie-att-teacher-title / eie-att-date-input / eie-att-cards / eie-att-card /
   eie-att-card-head / eie-att-card-period / eie-att-card-time / eie-att-card-class /
   eie-att-student-list / eie-att-student-row / eie-att-student-name / eie-att-student-cell /
   eie-att-sym-empty / eie-att-drilldown` 카드·행·터치 영역 스타일 추가. 브라우저에서
   카드 radius 12px, 셀 radius 10px 등 스타일 적용 확인.

5. **다중 셀(source_cell_ids) 케이스 테스트 추가** —
   `tests/eie-attendance-board-contract.test.js`.
   `_buildDisplaySessions`가 여러 원본 셀을 한 세션으로 묶어도(`source_cell_ids:['cellA','cellB']`),
   렌더되는 학생 셀 onclick과 저장 payload의 `timetable_cell_id`가 모두 대표 셀
   `source_cell_ids[0]`(cellA)로 **일치(읽기==쓰기)** 함을 증명. 보조 셀(cellB)을 입력
   대상으로 쓰지 않음도 단언. 즉 `sessionCellId()`가 `source_cell_ids[0]`만 쓰는 구조가
   안전함을 테스트로 고정.

추가 검증:
- `node --check` 4개 대상 파일 전부 통과.
- `node --test tests/eie-attendance-board-contract.test.js` → PASS(위 5건 모두 포함).
- `node --test tests/eie-*.test.js` → 18 pass / 1 fail(기존 무관 결함 동일).
- 브라우저 확인(콘솔 에러 없음): 공란 셀 `+` 제거, 카드/셀 스타일, 원장 결석 노출.

참고: EIE 마이그레이션 정본 위치는 루트 `migrations/`(20260602와 동일)이며 본 마이그레이션은
거기에 있다. `workers/wangji-eie-worker/migrations/`에 동일 내용 사본이 존재하나(동일 D1 대상,
내용 IDENTICAL) 무해하다.
