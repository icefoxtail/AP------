# AP------ 대규모 리팩토링 세부설계서

- 작성일: 2026-06-13
- 근거: `docs/reports/ap-code-review-improvements-20260612.md` 리뷰 15·16·17·20·21번 + XSS 2차(6번 잔여)
- 사전 분석: apmath 대형 파일 5개 함수 인벤토리, eie 뷰 중복 함수 맵, eie.css 구조 감사, 홈페이지 4종 중복도 측정 (2026-06-13 실측)

---

## 0. 원칙과 안전 절차 (모든 Phase 공통)

이 저장소는 **main 머지 = 즉시 운영 배포**(GitHub Pages)이므로 아래 절차를 깨지 않는다.

### 0-1. 작업 규칙
1. **순수 이동 우선**: 동작을 바꾸지 않는 "함수 이동·파일 분할"과 동작을 바꾸는 "구조 변경"을 절대 한 PR에 섞지 않는다.
2. **PR 1개 = 파일 1개(또는 밀접한 묶음 1개)**: diff가 커도 "이동만" 했다면 리뷰 가능. 이동+수정이 섞이면 리뷰 불가능.
3. **리팩토링 PR은 즉시 머지 금지**: PC에서 브랜치 체크아웃 → 로컬 브라우저로 핵심 화면 확인 → 머지. (체크리스트는 각 Phase에 명시)
4. **한 Phase 머지 후 최소 2~3일 실사용** 뒤 다음 Phase 진행. 문제 발견 시 `git revert` (프론트는 1~2분 내 원복).

### 0-2. 기계적 검증 게이트 (Phase 1 시작 전에 구축)
기존 CI(#27: 문법 검사 + 테스트 51개)에 **분할 전용 가드 테스트 2개**를 추가한다:

**(A) 전역 함수 표면 보존 테스트** — `tests/apmath-global-surface.test.js`
- 분할 전에 원본 파일의 최상위 함수 이름 목록을 추출해 fixture로 저장:
  ```bash
  grep -oE "^(async )?function [A-Za-z_]+" apmath/js/report.js | awk '{print $NF}' | sort > tests/fixtures/surface-report.txt
  ```
- 테스트는 분할 후 새 파일들의 함수 합집합이 fixture와 **정확히 일치**하는지 검사 → 분할 중 함수 유실·중복 정의를 머지 전에 차단.

**(B) onclick 핸들러 존재 테스트** — `tests/apmath-onclick-defined.test.js`
- `apmath/index.html`과 모든 `apmath/js/*.js`의 `onclick="fnName("` 패턴에서 함수명을 추출하고, 각 함수가 어느 js 파일에든 `function fnName` 으로 정의되어 있는지 검사 → "버튼 눌렀더니 undefined" 사고를 머지 전에 차단.

### 0-3. 로컬 확인 절차 (PC, 머지 전)
```powershell
git fetch origin
git checkout <리팩토링 브랜치>
# apmath 폴더를 로컬 서버로 열기 (아무거나 가능)
npx serve apmath   # 또는 python -m http.server
```
→ 각 Phase의 확인 체크리스트 수행 → 이상 없으면 머지.

---

## 1. Phase 1 — apmath 대형 JS 파일 분할 (순수 이동)

전 파일 공통: **모듈화하지 않는다.** `<script>` 전역 스크립트 그대로, 함수를 파일만 옮긴다. 공개 함수명·전역 변수명 변경 금지. `apmath/index.html`의 `<script>` 순서만 갱신.

### PR-1a. 사전 준비: 가드 테스트 2종 추가 (0-2의 A·B)
- 위험도: 없음(테스트만 추가). 즉시 머지 가능.

### PR-1b. report.js (4,038줄) → 3분할
| 새 파일 | 내용 (함수 클러스터) | 대략 범위 |
|---|---|---|
| `report-text.js` | 레거시 텍스트 리포트: `buildParentReportText`/`buildStudentReportText`/`buildCounselReportText` 계열, `openStudentReportModal`, `openClassReportBatchModal`, `copyReport`, `saveReportToConsultation`, `requestAiReport` | 10~695줄 |
| `report-center.js` | 리포트센터 본체: `reportCenter*` 아카이브 캐시·문항 추출·난이도 분석·AI 분석 캐시·프리미엄 리포트 빌더, `openReportCenter*` 모달 | 715~2650줄 |
| `report-print.js` | 출력: `reportCenterBuildCleanPdfDocument`, `reportCenterOpenPrintView`, `openParentReport`, `saveParentReportImage` 등 인쇄·이미지 저장 | 2677~4038줄 |

- **이동 제약(공유 상태)**: `window.AP_REPORT_*` 캐시들은 window 전역이라 어느 파일에 있어도 무방. `AP_REPORT_CONTEXT_OPTIONS_LIMIT` 상수와 `registerReportPayload`는 report-text.js에 둔다(첫 로드).
- **로드 순서**: 기존 report.js 위치에 `report-text.js → report-center.js → report-print.js` 순서로 교체.
- **외부 호출 표면**(깨지면 안 됨): dashboard.js가 `openReportCenterModal`/`requestAiReport`/`reportCenterCopyExamKakaoSummary`, student.js가 `openReportPreview` 호출.
- **확인 체크리스트**: 학생 상세→리포트 미리보기 / 리포트센터(일일·시험·상담) 열기 / 시험 리포트 인쇄뷰 / 부모 리포트 카드 이미지 저장 / AI 분석 요청.

### PR-1c. dashboard.js (3,915줄) → 2분할
| 새 파일 | 내용 | 비고 |
|---|---|---|
| `dashboard.js` (유지·축소) | 교사용 메인: 날짜·공휴일 헬퍼, 일지 매트릭스, `computeDashboardData`/`renderDashboard`/`openDashboardClass`, 오늘 마감(`openTodayCloseModal`, `quickToggle*`), 일지 모달(`openDailyJournalModal`, `saveJournal`), 온보딩 패널 | 약 2,300줄 |
| `dashboard-admin-center.js` (신규) | 관리자 기능: `openAdmin*`/`renderAdmin*`/`handleAdmin*`/`admin*` 전 클러스터 (학생목록, 교사계정, 상담센터, 전역검색, 지표 패널, 퇴원생, PIN 일괄) | 약 1,600줄 |

- **주의**: 기존 `dashboard-admin.js`(별도 파일)와 **합치지 않는다** — 순수 이동 원칙 위반(이동+병합). 이름 충돌을 피해 `dashboard-admin-center.js`로 신설.
- **공유 상수**: `DASH_HOLIDAYS`, `DASHBOARD_DAY_*` 매핑은 dashboard.js(먼저 로드)에 남긴다. `apEscapeHtml`(dashboard.js:50 중복 정의)은 이번엔 그대로 두고 Phase 3에서 core.js 것으로 일원화.
- **로드 순서**: `... dashboard-admin.js → dashboard-teacher.js → dashboard.js → dashboard-admin-center.js` (admin-center는 dashboard.js의 헬퍼를 쓰므로 뒤).
- **확인 체크리스트**: 교사 대시보드 렌더 / 오늘 마감 / 일지 저장 / 관리자: 학생목록·상담센터·전역검색·교사계정관리·최근일지.

### PR-1d. classroom.js (3,095줄) → 2분할
| 새 파일 | 내용 |
|---|---|
| `classroom.js` (유지·축소) | 출결·숙제 코어: 상태 라벨·태그·보강칩, 출결 메타, `renderClass` V4 렌더링, 일일 운영 날짜, 수업기록, 숙제사진 |
| `classroom-planner.js` (신규) | 플래너·성적·출석부: `*ClassPlanner*` 전체, `openExamGradeView`/`openExamDetail`/시험 삭제, `loadLedger`/`renderAttendanceLedger`/`toggleAtt`/`toggleHw` |

- **공유 상태 제약**: `ledgerState`(1536줄)는 ledger 함수들과 함께 classroom-planner.js로 이동. `MAKEUP_TAG_DEFS`는 코어에 잔류.
- **교차 의존**: classroom-planner.js가 timetable.js의 `getTimetableClassStudentsWithInfo` 호출 → 로드 순서를 timetable.js **뒤**로 배치: `... timetable.js → classroom-planner.js → dashboard-admin.js ...` (onclick에서만 불리므로 실행 시점엔 모두 로드 완료 — 위치는 timetable 뒤가 안전).
- **확인 체크리스트**: 교실 출결 토글·보강칩·출결메타 / 출석부(레저) 토글 / 시험 성적 보기·학생별 입력 / 클래스 플래너 주간·월간 / 숙제사진 배정·제출현황.

### PR-1e. student.js (3,547줄) → 2분할
| 새 파일 | 내용 |
|---|---|
| `student.js` (유지·축소) | 학생 상세 보기: 상세 모달 상태·lazy 로딩, 헤더·기본/성적/이력 탭 렌더, 학교시험 매트릭스, 상담 목록·AI 요약, 학부모 연락처 |
| `student-edit.js` (신규) | 생성·수정: 수정모드 탭(`renderStudentDetailEditTabs`, `renderStudentEditBody*`), `openAddStudent`/`handleAddStudent`/`openEditStudent`/`handleEditStudent`/삭제·복원, 온보딩 입력, 고교 선택과목(`*HighSubject*`) |

- **공유 상태 제약**: 상담 in-flight 가드(`_consultSaveInFlight`)·`addStudentSubmitting`은 해당 핸들러와 함께 이동. `AP_STUDENT_DETAIL_TABS` 등 탭 상수는 student.js(먼저 로드)에 잔류.
- **확인 체크리스트**: 학생 상세 열기(탭 4종) / 상담 추가·수정·삭제 / 학생 추가·수정·삭제·복원 / 고교 과목 체크 / 온보딩 날짜 입력.

### PR-1f. timetable.js (3,628줄) — **분할 보류**
- 함수 결합도가 높고(렌더 컨텍스트 캐시 `TIMETABLE_RENDER_CONTEXT`를 전역에서 공유) 드래그앤드롭·버전 관리가 얽혀 있어 분할 이득 대비 위험이 큼. **eie-timetable(Phase 2) 경험 후 재평가.**

> Phase 1 효과: 최대 파일 4,038줄 → 약 2,300줄. 각 PR 사이 2~3일 실사용 간격 권장. 총 소요 약 2주.

---

## 2. Phase 2 — eie 공통화 (중복 제거 + 상태 패턴 통일)

### PR-2a. 공용 유틸 추출 — `eie/js/eie-view-utils.js` (신규)
실측된 중복 (8개 뷰 파일에 같은 함수가 제각각 구현됨):

| 함수 | 중복 위치 (파일:줄) |
|---|---|
| `esc()` | timetable:89, attendance:24, classroom:28, dashboard:2, students:21, teacher:16, management:10, timetable-editor:40 — **8벌** |
| `asRows()` | timetable:104, attendance:74, classroom:233, timetable-editor:44 — 4벌 |
| `uniqueNames()` | timetable:794, classroom:52, dashboard:62, students:205, teacher:76 — 5벌 |
| `normalizeGrade()` | timetable:363, classroom:284, students:61 — 3벌 (**구현이 서로 다름** — 주의) |
| `asTeacherList()` | timetable:132, classroom:77 — 2벌 |

- **방법**: `eie-view-utils.js`에 `window.EieViewUtils = { esc, asRows, uniqueNames, ... }`로 노출. 각 뷰 파일 상단의 로컬 정의를 `const esc = EieViewUtils.esc;` 한 줄로 교체(호출부 무수정).
- **`normalizeGrade` 특별 취급**: 3벌의 구현이 다르므로(정규식 vs 별칭 매핑) **1차에서는 추출하지 않는다**. 출력 차이를 표로 비교 검증한 후 2차 PR에서 통일.
- **로드 순서**: `eie/index.html`에서 `eie-app.js`(103줄) 다음, 첫 뷰 파일(104줄) 앞에 삽입.
- **확인**: eie 대시보드·시간표·교실·학생·교사 화면 각 1회 렌더.

### PR-2b. 상태 접근 패턴 통일 (동작 변경 — 신중)
- 현황: eie-timetable은 로컬 `viewState`(41~82줄), students/dashboard/editor는 `window.EieState?.get?.()`, attendance는 래퍼 함수 — 3가지 혼재.
- **방침**: `EieState.get()`으로 통일하되, eie-timetable의 `viewState`는 "뷰 내부 UI 상태(선택된 요일 등)"라서 전역화가 오히려 부적절한 항목이 많음 → **데이터 접근(`db.students` 등)만 EieState로 통일**하고 UI 상태는 로컬 유지. 화면별 1 PR.

### PR-2c. eie-timetable.js (5,049줄) 분할 — 2-a·2-b 완료 후
| 새 파일 | 내용 |
|---|---|
| `eie-timetable-data.js` | 상수(`STANDARD_PERIOD_TIMES` 등) + 정규화·시간 변환 헬퍼(89~372줄 잔여분) |
| `eie-timetable.js` (축소) | viewState + 그리드 렌더링 + 이벤트 핸들러 + API 호출 |
- Phase 1과 동일한 가드 테스트 방식 적용 (eie용 surface fixture 추가).

> Phase 2 효과: 중복 구현 약 300줄 제거, 뷰 간 동작 불일치(이스케이프 누락 등) 원천 차단.

---

## 3. Phase 3 — 이벤트 위임 전환 (XSS 2차, 동작 변경)

- 현황: inline `onclick` 약 360개. 자유 텍스트 인자는 #23에서 `apJsArg`로 방어 완료. 남은 위험은 낮음(서버 생성 ID) — **보안 긴급도는 낮고, 코드 품질 작업**임.
- **패턴** (화면 하나당 1 PR):
  ```html
  <!-- before --> <button onclick="openStudentDetail('${s.id}')">
  <!-- after  --> <button data-action="open-student-detail" data-student-id="${apEscapeAttr(s.id)}">
  ```
  ```js
  // 화면 루트에 위임 리스너 1개
  root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const handler = STUDENT_LIST_ACTIONS[btn.dataset.action];
      if (handler) handler(btn.dataset, e);
  });
  ```
- **순서**(작고 위험 낮은 화면부터): management.js 주소록(24곳) → student.js 상세(29곳) → dashboard.js(41곳) → classroom.js(55곳). 각 PR마다 해당 화면 전 버튼 클릭 체크리스트 필수.
- 이 Phase부터 `apEscapeHtml` 중복 정의(core.js/dashboard.js) 일원화 포함.

> 소요: 화면당 0.5~1일 + 검증. 전체 2~3주. **급하지 않으므로 Phase 1·2 안정화 후.**

---

## 4. Phase 4 — eie.css 정리 (11,106줄, !important 732개)

실측: `@media` 블록 54개(760px 18곳·720px 11곳 등 브레이크포인트 파편화), `.eie-v2-period-row`류 시간표 셀렉터가 브레이크포인트마다 **10~14회 재정의**, `!important`는 시간표 그리드(5196~7700줄)에 약 300개 집중.

### 단계 (각 1 PR, 시각 회귀 위험 있어 가장 신중하게)
1. **PR-4a 측정·동결**: 주요 화면 스크린샷 세트를 기준본으로 저장(수동, PC). 이후 PR마다 비교.
2. **PR-4b 변수 확장**: `:root`에 간격·라운드·브레이크포인트 변수 추가 (`--eie-space-*`, `--eie-radius-*`). 값 치환만, 셀렉터 무변경 — 시각 영향 0.
3. **PR-4c 시간표 그리드 통합**: 5196~7700줄의 중복 셀렉터를 "기본 규칙 1 + 브레이크포인트별 차이만" 구조로 재작성. **이 구간만** !important 제거. 머지 전 PC에서 시간표 화면을 모바일·태블릿·PC 폭으로 확인.
4. **PR-4d 이후**: 교사/교실 구간(8400줄~), 인쇄 스타일(10284줄~) 순으로 반복.
- 셀렉터 특이도 재설계가 필요한 곳은 `@layer` 도입 검토(지원 브라우저 확인 후).

> 주의: 과거 CSS 회귀(#12~#14) 전력이 있는 영역. **한 번에 한 구간씩.**

---

## 5. Phase 5 — 홈페이지 4종 중복 제거 (선택, 우선순위 최하)

실측: 헤더 ~95%·푸터 ~90%·히어로 60~70% 동일 (4페이지 합계 5,031줄, 공유 가능분 50~60%).

- **권장 방법**: 빌드 도구 없이 가능한 **공용 CSS 추출**부터 — `shared/css/wangji-home.css`로 헤더·푸터·카드 그리드 스타일을 빼고 각 페이지는 테마 변수만 정의. HTML 템플릿화(11ty 등)는 빌드 파이프라인이 생기는 큰 결정이라 **보류 권장** — 페이지가 4개뿐이고 변경 빈도가 낮음.
- 효과 대비 비용이 낮은 Phase이므로 여유 있을 때.

---

## 6. Phase 6 — 워커 공통 모듈화 (리뷰 16번, 배포 동반)

- 대상: `sha256hex`/`makeSessionToken`/`verifyTeacher*`(3개 워커에 중복), response 헬퍼 3벌, CORS 헬퍼 3벌(#20에서 복제 배치됨).
- **제약**: 워커는 독립 배포 단위라 단순 상대경로 import가 묶음 배포를 만듦 → `workers/shared/` 디렉토리 + 각 wrangler 빌드에서 참조(wrangler는 번들링 시 상대 import 지원). worker-backup 쪽은 위치 정리(리뷰 30번)와 함께 진행.
- **배포 필요**: 머지 후 워커 3개 재배포 + smoke 확인. **CLOUDFLARE_API_TOKEN을 원격 환경에 등록한 뒤 진행 권장** (원격에서 배포·검증까지 한 번에).

---

## 7. 실행 순서 요약

| 순서 | Phase | PR 수 | 위험도 | 선행 조건 |
|---|---|---|---|---|
| 1 | 가드 테스트 (PR-1a) | 1 | 없음 | 즉시 가능 |
| 2 | apmath 분할 (1b~1e) | 4 | 낮음(순수 이동+게이트) | PR-1a, PR 사이 2~3일 실사용 |
| 3 | eie 유틸 추출 (2a) | 1 | 낮음 | — |
| 4 | eie 상태 통일·분할 (2b~2c) | 2~3 | 중간 | 2a |
| 5 | 이벤트 위임 (Phase 3) | 4+ | 중간 | Phase 1 안정화 |
| 6 | CSS 정리 (Phase 4) | 4+ | 중간~높음(시각 회귀) | 스크린샷 기준본 |
| 7 | 워커 모듈화 (Phase 6) | 1~2 | 중간(배포 동반) | CF 토큰 등록 권장 |
| 8 | 홈페이지 (Phase 5) | 1 | 낮음 | 여유 시 |

**전체 기간 감각**: 주당 1~2 PR 페이스로 약 6~10주. 서두를 이유 없음 — 각 단계가 독립적으로 가치가 있고, 중단해도 어중간한 상태가 남지 않도록 설계됨.

---

## 8. 중단·롤백 기준

- 분할 PR 머지 후 48시간 내 해당 화면 오류 신고 → 즉시 `git revert` (다음 Pages 배포로 원복).
- 가드 테스트가 실패하는 PR은 원인 불문 머지 금지.
- 같은 Phase에서 revert가 2회 발생하면 해당 Phase 설계를 재검토한다.
