# APMS UI 업그레이드 계획 v0.1 (조사 단계)

작성 2026-11-02. 기준 문서: `apmath/DESIGN.md`(APMS와 학생 포털을 한 기준으로 묶은 것), `PRODUCT.md`(원칙 1: 학생이 쓰는 화면 최우선, WCAG 2.2 AA).
이 문서는 **조사 결과**다. 코드는 바꾸지 않았다. "새 체계"는 웜 테마(`apms-warm-theme.scope.css`) + 통합 모달(`apms-unified-modal.css`) + 공통 클래스(`apms-*`·`.ap-*`)를 뜻한다. 웜 테마 색은 `<body class="apms-warm-scope">`로 앱 전체에 자동 적용되므로, 아래 "적용 정도"는 색이 아니라 **클래스로 그려졌는가**(JS 안 `apms-` 클래스 수 대 인라인 `style="` 수, 전용 CSS 유무)로 가른 1차 판정이다. 화면을 눈으로 보고 확정한 것이 아니다.

## 1. 화면 현황표

| 화면 | 코드 | CSS 층 | 지표(apms 클래스 / 인라인 style / 하드코딩 hex) | 적용 정도 |
|---|---|---|---|---|
| 선생님 대시보드 | `dashboard.js`, `dashboard-teacher.js` | `dashboard-foundation.css`(`.ap-dash-*`, 4px 스케일, 카드 16px) | 6 / 104 / 3 | 적용(전용 CSS), 인라인 일부 남음 |
| 원장(관리자) 대시보드 | `dashboard-admin.js` | `dashboard-foundation.css`의 `#ap-admin-dashboard`, override의 6px 카드 | 0 / 228 / 11 | 부분 |
| 반 화면(출결·진도 진입) | `classroom.js` | `classroom-foundation.css`(`.ap-classroom-*`), 통합 모달 2종 | 104 / 87 / 10 | 적용 |
| 출석부·원내평가·플래너 확인 | `classroom-planner.js` | override, `classroom-foundation.css` | 45 / 133 / 7 | 부분 |
| 학생 상세·목록·등록 | `student.js`, `student-edit.js`, `management.js`(주소록) | override의 `.apms-student-*`·`.std-*`, `apms-ui-foundation.css` | student 153 / 214 / 46 | 부분 |
| 학교시험 성적 | `cumulative.js` | 없음(전용 CSS 없음) | 0 / 90 / 40 | 옛 모양 |
| 시간표 | `timetable.js`, `timetable-months.js` | `timetable-months.css`(월간만) | 0 / 100 / 50 | 옛 모양(월간만 전용 CSS) |
| 일정 | `schedule.js` | 없음 | 0 / 47 / 0 | 옛 모양 |
| 클리닉(출력 센터 등) | `clinic-print.js`(6235줄), `core.js` | `apms-clinic-print.css`(`.clinic-*` 161개) | 15 / 200 / 0 | 부분(전용 CSS 있으나 인라인 200) |
| 리포트 센터·인쇄 | `report-center.js`(8601줄), `report-print.js`, `report-text.js` | 자체 인쇄 스타일 | 1 / 312 / 157, report-print hex 189 | 옛 모양(문서 스타일은 별도 판단 필요) |
| 교재·교재 오답 | `textbook.js`, `study-material-wrong.js` | override, 자체 `.smw-*` | 35 / 40 · 38 / 2 | 부분 · 적용 |
| QR·OMR | `qr-omr.js` | 통합 모달 1종 | 28 / 83 / 3 | 부분 |
| 메모 | `memo.js` | override | 10 / 25 / 0 | 부분 |
| 사이드바·서랍 | `ui.js` | `sidebar-foundation.css`(`.drw-*`) | 0 / 6 / 0 | 적용 |
| 로그인 | `core.js:606` | 인라인(보라-분홍 그라데이션 `#4F46E5→#7C3AED→#DB2777`) | 인라인만 | 옛 모양(웜 체계와 무관) |
| 학생 포털·숙제·플래너 | `apmath/student/`, `homework/`, `planner/` | 각자 인라인 + `apms-ui-foundation.css`/`apms-theme-override.css` | — | 별도 체계(DESIGN.md "학생 포털과의 차이", 맞출 방향 미정) |

참고: `wangji-student-management.html`(`wsm-*`), `wrong_print_engine.html`은 `apmath/` 아래 독립 화면이다(DESIGN.md 미정 9번).

## 2. 모달 현황표

**수량.** 모달은 하나의 껍데기(`#modal-overlay`)를 `showModal`·`showModalStep`·`replaceModalStep`로 채운다(`js/ui.js:423, 447, 455`). 호출 지점 103곳, 열기 함수 91개(도우미 3개 제외 88개) + 학생 상세 하위 모달 10종(`student.js`의 `showStudentDetailSubModalStep`) = **약 98종**. 껍데기를 쓰지 않는 것: 진단평가 오버레이(`dashboard-admin.js:175`), 리포트 센터 넓은 오버레이(`report-center.js:1808`), 학부모 리포트(`report-print.js:1128`, `#modal-body` 직접 채움).
**통합 양식(`apms-unified-modal`) 적용: 4종뿐** — 새 반 추가(`management.js:239`), 반 수정(`:295`), 숙제 등록(`classroom.js:944`), QR 생성기(`qr-omr.js:262`). 나머지 약 94종은 옛 모양(인라인 스타일).
**실측.** 빈 데이터로 연 32건 중 29건(모달 28종)을 Chrome 390px 폭에서 쟀다. 가로 넘침 0건, 글자 11px 이하를 포함하는 모달 12종, 24px 미만 터치 요소 1건(클리닉 출력 센터), 본문이 스크롤되는 모달 2건(OMR 입력, 일정관리). 데이터가 실제로 채워지면 길어진다.

| 묶음 | 함수 (파일:줄) | 용도 | 통합 | 눈에 띄는 비효율 (사실 / 의심) |
|---|---|---|---|---|
| 반·출결·숙제 | `openAttendanceMetaModal` classroom.js:619, `openHomeworkPhotoAssignmentModal` :944, `…AssignmentList` :984, `…LinksModal` :1036/:1022, `…OverviewModal` :1071, `…SubmissionFilesModal` :882, `…ImageViewer` :932, `openStudentActionSheetV4` :1854, `openClassroomStudentMovePicker` :1954 | 출결 메모, 숙제 등록·목록·링크·현황·사진 | 숙제 등록만 적용 | 숙제 사진 흐름이 목록→링크/현황→사진→뷰어로 최대 5~6개 모달로 이어진다(사실). 숙제 등록은 통합 양식이어도 입력에 라벨이 없고 placeholder만 있다(사실). 출결 메모는 저장 버튼이 본문 아래 풀폭 버튼이고 다른 모달은 헤더 오른쪽이다(사실) |
| 진도·출석부·플래너 | `openClassRecordModal` classroom.js:3626(진도, 최대 1180px), `renderAttendanceLedger` classroom-planner.js:30, `openExamGradeView` :285, `openExamDetail` :443, `copyPlannerStudentLink` :666, `openPlannerStudentPlans` :1669, `renderPlannerControl` :1797, `openPlannerFeedbackModal` :1901 | 진도 관리, 출석부, 원내평가, 플래너 확인·피드백 | 없음 | `openExamDetail`은 인라인 style 36개·11px 글자 8곳·표(사실). 진도 모달은 별도 전용 레이아웃(좁은 화면 확인 필요, 의심) |
| 학생 | `openAddStudent` student-edit.js:714, `handleRestore` :111, `openDischargedStudents` :812, `renderStudentDetailShell` student.js:2420 + 하위 10종(상태 이력 :634, 반 이동 이력 :646, 연락 설정 :859, 연락 이력 :882, 보호자 관리 :978, 상담 요약 :1070, 연락처 추가 :3180/수정 :3227, 상담 추가 :3340/수정 :3489), `openReportPreview` :3133, `openAddressBook` management.js:104, `renderStudentExportModal` student-export.js:273 | 학생 등록·재등원·상세·상담·보호자·명단 출력 | 없음 | **신규 학생 추가**: 390px에서 입력 15개·본문 640px, 입력 7개가 placeholder만(사실, `student-edit.js:719-727`), 등원일 상자가 안 맞는 모양(스크린샷 확인). 학생 상세 하위 10종은 `showModalStep` 스택으로 깊이가 생긴다(사실) |
| 반 관리 | `openClassManageModal` management.js:218, `openAddClassModal` :239, `openEditClassModal` :295, `openGlobalPinManagement` :128, `renderBillingAccountingFoundationModal` :2016 | 반 추가·수정, PIN, 수납 | 추가·수정 적용 | 반 추가는 통합 양식인데 이름·학년·과목·담당 4개 입력에 라벨이 없다(스크린샷). 수납 모달은 인라인 6개·최대 높이 60vh(사실) |
| 시험·성적 입력 | `openSchoolExamRecordModal` cumulative.js:2231, `openOMR` qr-omr.js:530, `openQrGenerator` :262, `openQrSubmitStatus` :456, `openGlobalExamGradeView` dashboard.js:1011, `openTodayExamSetModal` :2154, `openExamScoreMenu` ui.js:841 | 학교시험 성적, OMR 성적 직접 입력, QR, 제출 현황 | QR 생성기만 | **OMR 입력 22개 칸, 390px에서 본문 683px로 스크롤**(사실). 학교시험 성적 입력 11개·placeholder 7개·라벨 0(사실). QR 제출 현황은 인라인 29개·표(사실), 조회 모달 뒤 결과 모달이 다시 열린다(`:463`, `:493`) |
| 클리닉 | `openClinicCenter` clinic-print.js:5794, `openClinicClassPicker` :5811, `openClinicPrintCenter` :6028, `openWeakUnitDetail` core.js:1555, `openClinicSimilarForClass` :1908, `openClinicBasketByKey` :2038, `openSimilarQuestionRecommendations` :2156 | 클리닉 반 선택·출력 센터·유사 문항 | 없음 | **출력 센터**: 209줄, 컨트롤 24개, 390px에서 본문 705px·10px 글자·24px 미만 터치 1개(사실). 모달이 열리기 전에 API 2건을 기다린다(`await` 2번 뒤 `showModal`, `:6048-6055`)(사실) → 느린 망에서 눌러도 반응이 없어 보일 의심. 진도 모달은 "불러오는 중" 먼저 보여 준다(`classroom.js:3665`) |
| 교재·자료 | `openGlobalTextbookManage` textbook.js:214, `openTextbookManageModal` :381, `openAddTextbookModal` :393, `openEditTextbookModal` :469, `study-material-wrong.js:531` | 교재 관리·등록·수정, 오답 교재 | 없음 | 등록 폼이 입력칸에 `class="btn"`을 붙여 쓰고 라벨이 없다(사실). 저장 뒤 `await loadData()`로 전체 데이터를 다시 받는다(`textbook.js:455`, 사실). 오답 교재 모달은 입력 27개, 표 최소 폭 520px(`study-material-wrong.js:99`)·최대 높이 86vh(사실) → 휴대폰에서 가로 스크롤 의심 |
| 일정·시간표 | `openExamScheduleModal` schedule.js:800, `openEditUnifiedScheduleModal` :972, `openEditGroupedExamScheduleModal` :1055, timetable.js `openTimetableDraftActivateConfirm` :1290, `…DraftAddStudentModal` :1334, `…DraftConflictDetailsModal` :1565, `…ClassMoveConfirmModal` :2259, `openTimetableAddClassModal` :2432, `…TransferConfirmModal` :2548 | 일정 관리, 시간표 개편 확인 | 없음 | 일정관리는 7열 달력 격자 + 입력 10개로 390px에서 본문 697px 스크롤(사실). 일정 수정은 `showModalStep`(되돌아가기 스택)(사실). 확인형 모달 3종은 값 나열 격자(`86px 1fr` 등) 인라인(사실) |
| 대시보드·메모·일지 | `openOperationMenu` dashboard.js:1025, `openTodayCloseModal` :2109, `openDailyJournalModal` :2792, `openTodoMemoModal` memo.js:91, `openEditTodoMemoModal` :226 | 시스템 상태, 예외 현황, 일지, 메모 | 없음 | 일지·메모는 매일 쓰는데 인라인 13·7개, 11px 글자 포함(사실). 메모 수정 모달은 `apms-button` 12px 버튼에 인라인 `border:none`(사실, `memo.js:243`) |
| 원장·계정·상담 | `openAdminStudentList` dashboard-admin.js:249, `openAdminOperationMenu` :322, `openAdminPinBatchModal` :354, `renderWithdrawalReportModal` :555, `renderAdminStudentGradeModal` :1165, `…ConsultationHistory` :1230, `openAdminConsultationCenter` :1295, `…TeacherlessClassList` :1505, `renderAdminSimpleStudentList` :1525, `renderAdminJournalList` :2200, `openAdminJournalFeedback` :2237, `…RecentTeacherJournals` :2286, `renderAdminTeacherAllStudents` :2379, `…TeacherStudents` :2411, `openAdminTeacherAccountManage` :2450/:2465, `openAdminCreateTeacherModal` :2503, `…EditTeacherModal` :2542, `…ResetTeacherPasswordModal` :2578, `openPublicInquiryList` :2772 | 원장 목록·계정·상담·일지 | 없음 | 선생님 계정은 목록→생성/수정/비밀번호 초기화로 모달이 이어진다(사실). 목록형은 최대 높이 55~65vh 안 스크롤(사실). 생성 폼 입력 4개 중 3개가 placeholder만(사실) |
| 리포트 | `copyReportLegacy` report-text.js:345, `openStudentReportModal` :803, `openClassReportBatchModal` :1201, `copyReport` :1284, `requestAiReport` :1339 | 보고 문구 생성·복사 | 없음 | `copyReportLegacy`는 본문 `1fr 280px` 2열 격자·입력 5개(사실, 좁은 화면 확인 필요 의심) |
| 공통 | `setModalLoading` ui.js:605 | 불러오는 중 표시 | — | 껍데기 자체: Escape 키로 닫는 코드 없음(사실, 바깥 클릭·취소 버튼만) |

**비효율 상위 5** (사실만): ① 라벨 없이 placeholder만 쓰는 폼(신규 학생·학교시험 성적·교재·계정, 통합 양식인 숙제 등록·반 추가까지). ② 입력칸이 많은 모달(클리닉 출력 센터 24·OMR 22·신규 학생 15·반 추가/수정 13)이 휴대폰에서 한 화면을 넘는다. ③ 모달 연쇄(숙제 사진 6개, 학생 상세 하위 10종 스택, 계정 목록→폼). ④ 모달 열기 전 대기(클리닉 출력 센터)와 저장 뒤 전체 `loadData()`(교재 등록; 같은 호출이 13개 파일에 31곳 있어 각 모달이 실제로 느린지는 확인 필요). ⑤ 11px 이하 글자(실측 28종 중 12종)와 저장 버튼 위치 불일치(헤더 오른쪽 대 본문 아래).

## 3. 업그레이드 후보 순서 (제안, 승인 전)

**선결(사용자 결정):** DESIGN.md 미정 2(카드 모서리)·3(학생 포털을 어느 쪽으로)·4(의미색 글자값)·6(저장 버튼 위치). 이 넷이 정해지기 전에 모양을 대량으로 바꾸면 다시 고친다.

기준: 학생에게 닿는 것 → 선생님이 매일 쓰는 것 → 입력 많고 휴대폰에서 막히는 것.

0. **학생 포털·숙제·플래너 접근성 결함**(미정 3·4 결정 뒤): placeholder 대비 2.30, 상태색 글자 2.2, 플래너 다크 파랑 버튼 흰 글자 2.09, 11px 글자 9곳(DESIGN.md 학생 포털 절). 학생이 직접 보는 화면이라 가장 먼저다.
1. **PR-A 학생 등록·상태** (3개): `openAddStudent`, `handleRestore`, `openDischargedStudents` — 라벨 추가, 통합 양식, 중첩 상자 제거. 같은 파일(`student-edit.js`).
2. **PR-B 출결·숙제** (4개): `openAttendanceMetaModal`, 숙제 목록·링크·현황(`classroom.js`) — 숙제 등록의 라벨 추가 포함, 저장 위치 통일, 숙제 사진 연쇄 줄이기는 별도 검토.
3. **PR-C 성적 입력** (3개): `openSchoolExamRecordModal`, `openOMR`, `openTodayExamSetModal` — 입력 많은 폼, 390px 한 화면 안에 들어오게 묶음·라벨.
4. **PR-D 일지·메모** (3개): `openDailyJournalModal`, `openTodoMemoModal`, `openEditTodoMemoModal` — 매일 쓰는 것.
5. **PR-E 교재·반 관리 폼** (4개): `openAddTextbookModal`, `openEditTextbookModal`, `openAddressBook`, `openClassManageModal` + 교재 저장 뒤 `loadData()` 확인.
6. **PR-F 원장 계정 폼** (4개): `openAdminCreateTeacherModal`, `…EditTeacherModal`, `…ResetTeacherPasswordModal`, `openAdminPinBatchModal`.
7. **PR-G 확인형 모달** (6개): 시간표 확인 3종 + 일정 수정 2종 + 개편 적용 — "맥락 상자 + 값 나열 + 액션줄" 한 모양으로.
8. **단독 PR(크기 때문에)**: 클리닉 출력 센터(열기 전 대기 + 컨트롤 24개), 학생 상세 하위 10종(한 가족으로), 진도 모달, 리포트 센터. 각각 따로 계획서를 쓴 뒤 진행.

각 PR은 모달 3~4개 + `tests/apmath-modal-design-family.test.js` 패턴(입력 ID·저장 함수·돌아갈 화면 보존)을 같이 늘린다. 병합 직전 1회 `tools/run-tests.js`(`CLAUDE.md` 작업 방식).

## 4. 화면 확인 방법 조사 (사실만, 새 장치 제안 없음)

APMS(`apmath/index.html`)와 학생 포털은 로그인이 필요하다. 이미 있는 방법:

1. **선생님 미리보기(실서버 필요).** 학생 상세의 "학생 화면 확인 ↗"가 `student/?teacher_preview=1&student_id=<id>`를 연다(`js/student.js:575-587`). 학생 포털은 `isTeacherPreview`일 때 `localStorage`의 `APMATH_SESSION.session_token`(교사 로그인 결과)을 `readTeacherPreviewToken()`(`student/index.html:1008`)으로 읽어 `Authorization: Bearer`로 실제 워커 API(`API_BASE` workers.dev, `:763`)를 부른다. 따라서 **실제 교사 로그인 + 네트워크가 있어야** 보인다. 읽기 전용(저장 시 오류). `tests/apmath-student-teacher-preview.test.js`는 소스 문자열만 검사하고 화면을 열지 않는다.
2. **학생 포털 목업 픽스처.** `tests/fixtures/student-portal-exam-list-preview.html`은 `/apmath/student/index.html`을 가져와 `boot()` 호출을 가짜 `session`·`omrData`로 바꿔 iframe `srcdoc`에 그린다(시험지 목록 화면). 같은 origin에서 정적 서버로 열어야 한다. 이 파일을 부르는 테스트·문서는 찾지 못했다(`grep`).
3. **정적 HTML 조각 + CSS 얹기.** `tests/clinic-grade-recent-month-browser.cjs`는 빈 HTML 페이지에 `apmath/css/apms-clinic-print.css`를 `addStyleTag`로 얹고 가짜 DOM을 넣어 Playwright(Chrome)로 렌더·검사한다. 로그인 없이 CSS만 확인하는 기존 방식이다.
4. **API 가로채기 선례(아카이브용).** `tests/archive-prewarm-browser.cjs`, `archive-fast-engine-browser.cjs`는 `localStorage.APMATH_SESSION`에 `local-test-only` 토큰을 심고 `context.route('**/api/**')`로 응답을 가짜로 만든다. APMS 화면(`apmath/index.html`)에 이 방식을 쓴 테스트는 찾지 못했다.
5. **로컬 워커.** `tests/archive2-worker-runtime.mjs`가 Miniflare로 실제 워커 코드를 메모리 D1과 함께 띄운다(아카이브 라우트 테스트). `apmath/worker-backup/worker/`에 `wrangler.jsonc`·`schema.sql`, `apmath/worker-backup/seed.sql`이 있다. APMS 화면 스크린샷을 위한 로컬 실행 절차는 문서에서 찾지 못했다.
6. **이번 조사에서 직접 해 본 것(기존 코드만 사용).** `file://`로 `apmath/index.html`을 Chrome(Playwright)에서 열면 로그인 화면이 뜨고 CSS·전역 함수가 모두 로드된다. 페이지 안에서 `state.db`에 가짜 반·학생을 채우고 `openAddClassModal()`처럼 열기 함수를 직접 호출하면 모달이 그려진다(32건 중 29건 성공, 3건은 함수명·인수·`fetch` 실패로 못 엶). 로그인 오버레이(`.ap-login-fullscreen`, `core.js:606`, z-index 3000)가 모달 위를 덮어서 하니스에서 `display:none` 스타일을 주입했다. 서버·인증 코드는 건드리지 않았고 실데이터도 없다. 이것을 "로그인 우회"로 볼지는 메인이 판단한다. 한계: 대시보드·반 화면 같은 전체 화면은 `renderDashboard()` 등에 필요한 `state.db` 모양을 채워야 하고 시도하지 않았다.

**결론.** 인증을 건드리지 않고 쓸 수 있는 기존 방식은 (3) 정적 조각 렌더, (2) 학생 포털 목업 픽스처, 그리고 6번의 하니스 방식이다. 선생님 미리보기는 실제 교사 로그인이 필요하다.

## 5. 이 계획에서 정하지 않은 것

- 위 3번의 선결 결정 4건(DESIGN.md 미정 2·3·4·6).
- 학생 포털 접근성 수정(0번)을 모양 통일 결정 전에 먼저 해도 되는지.
- 스크린샷 검수에 6번 하니스 방식을 써도 되는지.
