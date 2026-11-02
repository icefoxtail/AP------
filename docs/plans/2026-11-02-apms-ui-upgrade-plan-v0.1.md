# APMS UI 업그레이드 계획 v0.2 (조사 + 모달 통합 설계)

작성 2026-11-02. **변경 이력:** v0.1 조사(화면 현황·모달 현황·화면 확인 방법) → **v0.2: 3절을 "모달 통합" 기준으로 다시 씀(작업 화면 패턴, 모달 등급 4단계, 통합 묶음 8개, PR 순서). 2절에 코드 재확인 정정을 더하고 98종 배정표는 부록으로 분리**(`docs/plans/2026-11-02-apms-modal-consolidation-appendix.md`). 1·4절은 v0.1 그대로.
기준 문서: `apmath/DESIGN.md`(APMS와 학생 포털을 한 기준으로 묶은 것), `PRODUCT.md`(원칙 1: 학생이 쓰는 화면 최우선, WCAG 2.2 AA).
이 문서는 **조사·설계 결과**다. 코드는 바꾸지 않았다. "새 체계"는 웜 테마(`apms-warm-theme.scope.css`) + 통합 모달(`apms-unified-modal.css`) + 공통 클래스(`apms-*`·`.ap-*`)를 뜻한다. 웜 테마 색은 `<body class="apms-warm-scope">`로 앱 전체에 자동 적용되므로, 아래 "적용 정도"는 색이 아니라 **클래스로 그려졌는가**(JS 안 `apms-` 클래스 수 대 인라인 `style="` 수, 전용 CSS 유무)로 가른 1차 판정이다. 화면을 눈으로 보고 확정한 것이 아니다.

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

**v0.2 정정 (모달 코드를 다시 읽고 확인한 것, 위 표와 어긋나는 부분은 이쪽이 맞다).**
1. **호출처가 없거나 덮어쓰여 실행되지 않는 모달이 17종**이다(부록 4절). 코드 검색(`apmath/js`·`index.html`·`tests`)에서 호출 경로를 찾지 못한 것이라 "의심"이다. v0.1 PR-A·C·D·E가 꾸미려던 `openDischargedStudents`(`student-edit.js:812`, 같은 이름의 `dashboard-admin.js:218`이 나중에 로드되어 덮어씀), `openTodayExamSetModal`, `openSchoolExamRecordModal`, `openAddTextbookModal`, `openEditTextbookModal`이 여기에 든다. 꾸미기 전에 사용자 확인이 먼저다.
2. **숙제 사진 흐름은 도달 가능한 것이 5단계**다. 링크 2종(`classroom.js:1022, 1036`)은 UI 어디서도 열리지 않고 테스트가 숨김을 고정한다(`homework-assignment-save-only.test.js`).
3. **모달 연쇄에는 뒤로 가기가 없다.** 단계 스택(`showModalStep`)을 쓰는 곳은 일정·시간표·학생 상세뿐이고, 나머지 연쇄는 `showModal`로 내용을 갈아 끼운다. 취소는 이전 모달이 아니라 반 화면/대시보드로 나간다(`ui.js:539-590`).
4. **`loadData()`는 `GET initial-data` 1회로 전체 데이터(40여 개 배열)를 새로 받는다**(`core.js:808-870`). `refreshDataOnly()`도 같은 요청이다(`:895`). "저장 뒤 재조회"는 이 전체 요청을 뜻한다.

## 3. 모달 통합 설계와 PR 순서 (제안, 승인 전)

사용자 요청(2026-11-02): "모달 자체를 통합하는 방향도 생각해야 될 것 같아. 지금 보면 모달들이 크기도 다 제각각이고 형태도 다 제각각인데 그것들을 통합해서, 예를 들면 이번에 진도관리 통합하면서 거기다가 교재까지 같이 붙였잖아. 그런 통합 시너지가 나는 애들을 한꺼번에 묶어서 어떻게 관리·정리할지 고민해야 될 것 같아."

v0.1은 모달을 한 개씩 꾸미는 PR(A~G)이었다. v0.2는 방향을 바꾼다. **① 크기·모양을 4등급으로 정하고(3.2), ② 같은 대상을 앞뒤로 다루는 모달은 진도 모달 같은 "작업 화면" 하나로 묶고(3.1·3.3), ③ 묶을 이유가 없는 나머지는 등급만 맞춘다(3.4).** 98종 전체의 배정은 부록(`docs/plans/2026-11-02-apms-modal-consolidation-appendix.md`)에 있다. 화면 스타일은 `apmath/DESIGN.md`를 따른다. 이 절은 정보 구조와 작업 흐름만 다룬다(impeccable `shape`·`layout`·`distill`의 기준: 주 작업 하나, 관련 있는 것은 가까이, 단계 줄이기, 모달 연쇄 대신 같은 자리 처리).

**결과 규모(부록 3절 집계).** 98종 중 52종이 8개 묶음에 속하고 46종은 등급만 맞춘다. 정리 후보(호출처 없음·덮어쓰임, 의심) 17종은 묶음 안 8 + 밖 9이다. 정리 17 + 흡수 33이 실행되면 모달 화면은 **약 98 → 48**이 된다. 선생님이 휴대폰에서도 겪는 모달 연쇄(뒤로 가기 없는 갈아 끼움)가 묶음 8곳에서 사라진다.

### 3.1 본보기 분석: 진도 모달 = "통합 작업 화면" 패턴

대상: `openClassRecordModal`(`classroom.js:3626`). 진도 + 교재 + 과정 + 특이사항을 모달 연쇄 없이 한 화면에서 처리한다(이 함수 구간에 `showModalStep` 0건). 아래가 패턴의 부품이고, 오른쪽이 일반화한 규칙이다.

| 부품 | 진도 모달 근거 | 일반 규칙 |
|---|---|---|
| ① 맥락 줄 + 대상 전환 탭 | 반 이름·날짜 `ap-class-progress-context`(`classroom.js:3798`). 담당 반 탭 `renderClassProgressClassTabs`(`:2451`), 탭은 sticky(`apms-theme-override.css:2559-2564`). 전환은 모달을 닫지 않고 레이아웃만 "불러오는 중"으로 바꾼다(`openClassRecordModal` `:3640-3662`). 저장 안 한 변경이 있으면 확인(`hasUnsavedClassProgressChanges` `:2413`, `requestClassProgressClassSwitch` `:2462`) | 대상(반·학생·숙제)은 화면 위쪽 한 줄에 보이고, 바꿔도 모달이 닫히지 않는다 |
| ② 목록(좌) / 상세(우) 한 쌍 | 교재 카드 목록 `renderClassProgressTextbookRow`(`:2958`) + 상세 `renderClassProgressTextbookDetail`(`:3056`). 열 `minmax(300px, 0.38fr) 1fr`(`apms-theme-override.css:1091-1097`), ≤760px에서 한 열(`:1621-1625`). 목록 선택 `selectClassProgressTextbook`(`:3198`)은 서버 호출 없이 상태와 DOM만 바꾼다 | 목록에서 고르면 오른쪽 상세만 바뀐다. 고르는 데 서버 왕복이 없다 |
| ③ 같은 자리 추가·수정·관리 | "교재 추가" 버튼 → 목록 맨 위 인라인 폼(`openClassProgressTextbookAdd` `:3462` → `renderTextbookInlineAddForm` `textbook.js:28`), "교재 관리" 모드(`:3471`, `renderTextbookManagementRow` `textbook.js:61`), 상세 안 "과정 추가" 인라인 패널과 새 교재 폼(`renderClassProgressCourseAddControl` `:3130`, `:3164-3175`) | 추가·수정·삭제는 새 모달이 아니라 목록 위 폼 / 행 아래 펼침 / 상세 안 구역으로 연다 |
| ④ 초안은 화면 상태에, 저장은 한 곳 | 교재별 진도 초안 `modalState.progressByTextbook`(`:3699-3704, 3750`), DOM 동기화 `syncClassProgressTextbookDraftsFromDom`(`:3491`), 부분 재그리기가 초안을 보존(`renderClassProgressTextbookPanelInPlace` `:3480`). 하단 저장 한 번(`saveClassRecord` `:3893`, `.ap-class-progress-footer`) | 여러 항목을 고친 뒤 한 번에 저장하는 화면은 하단 고정 막대. 항목 하나짜리 인라인 폼은 폼 안 하단 |
| ⑤ 늦게 온 응답 가드 | `classProgressModalRequestId`(`:3636-3637, 3667`), `closeModal`이 값을 올려 이전 요청을 무효화(`ui.js:544-546`) | 대상을 빨리 바꿔도 이전 대상의 응답이 새 화면을 덮지 않는다 |
| ⑥ 모달 먼저, 로딩은 자리에서 | `showModal('진도관리', '…불러오는 중…')`(`:3665`) 뒤 3개 API를 `Promise.all`(`:3667-3671`) | 느린 망에서 눌렀을 때 바로 반응이 보인다(클리닉 출력 센터는 API 2건을 기다린 뒤에야 열린다: v0.1 표) |
| ⑦ 같은 부품을 다른 화면이 재사용 | `openGlobalTextbookManage`(`textbook.js:214`)는 반 목록 → 반 패널을 `setModalBody`로 한 모달 안에서 바꾸고(`:204-212`) 같은 `ap-class-progress-*` 카드·인라인 폼을 쓴다 | 두 번째 사례가 이미 있다 = 일반화할 만하다 |

**이 패턴의 한계 (코드 사실).** 새 구현에서 그대로 베끼면 안 되는 부분이다.
1. **"같은 자리"가 완전하지 않다.** 교재 추가 저장은 `handleAddTextbook`(`textbook.js:410`)이 `POST` 후 `await loadData()`(전체 `GET initial-data`, `:455`)를 하고, `resumeClassProgressAfterInlineTextbookAction`(`textbook.js:290`)이 `openClassRecordModal`을 다시 불러 3개 API를 또 받는다. 호출한 화면을 알리려고 전역 플래그 `state.ui.classProgressInlineTextbookAction`을 쓰고 `textbook.js` 안에 화면별 분기가 있다(`:425, 456, 525, 547`). 이미 같은 파일에 응답으로 로컬 상태만 갱신하는 선례가 있다(`syncClassProgressTextbookBindingToState` `classroom.js:2896`).
2. **교재 추가·변경·삭제 구현이 두 벌이다.** 진도 모달용 `submitClassProgressTextbookAdd/Patch/Delete`(`classroom.js:3520, 3531, 3549`)와 전역 교재 관리용 `submitGlobalTextbookAdd/Patch/Delete`(`textbook.js:261, 268, 282`)가 같은 `handleAdd/Patch/DeleteTextbook`(`:410, 505, 538`)를 부른다.
3. **CSS가 반 전용 이름이고 흩어져 있다.** `.ap-class-progress-layout` 규칙이 5곳에 겹쳐 있고(`apms-theme-override.css:1091, 1621, 1904, 1993, 2358`), `#modal-content:has(.ap-class-progress-modal)` 폭·높이 규칙도 겹친다(`:1036, 1605, 2339, 2530`). `apms-unified-modal.css`에는 목록+상세가 없다(머리말은 "진도 모달을 본뜬 양식"이라고만 한다). 그래서 다른 화면이 쓰려면 CSS를 복제해야 했다(전역 교재 관리는 폭 규칙이 없어 기본 500px, `:1721-1725`).
4. **테스트 제약.** `tests/apmath-modal-design-family.test.js`는 통합 CSS가 `.ap-class-progress-modal {` 규칙을 갖지 않는다고 고정한다. 새 패턴은 `.apms-workspace*` 같은 별도 이름(제안)으로 만들고 진도 모달 쪽은 마지막에 옮긴다(M8).

**패턴 정의 (제안): 통합 작업 화면.** ① 한 껍데기, 대상 하나 + 전환 탭, ② 목록/상세 한 쌍(선택은 서버 호출 없이), ③ 추가·수정·관리는 인라인 폼·행 펼침, ④ 초안은 화면 상태에 두고 저장 위치는 등급 규칙대로, ⑤ 모달 연쇄 금지·미저장 변경 확인, ⑥ 늦은 응답 가드, ⑦ 모달 먼저 열고 자리에서 로딩, ⑧ **저장 응답으로 로컬 상태를 갱신하고 전체 `loadData()`·모달 재오픈은 피한다**(응답에 필요한 행이 없어 불가능한 곳은 그 사실을 PR에 적는다). 구현은 공통 부품(`apms-workspace`, `-list`, `-detail`, `-inline-form`)으로 한 번 만들고 묶음들이 재사용한다(PR-1에서 도입).

### 3.2 모달 크기·형태 등급 4단계

값은 현재 CSS이고(출처는 부록 1절), "제안"은 지금 없는 동작이다.

| 등급 | 데스크톱 | 최대 높이 | 휴대폰(≤600px) | 닫기 | 저장 위치 | 현재 모달 수 |
|---|---|---|---|---|---|---|
| **C 확인·선택** | 최대 500px (기본 껍데기) | 90vh | 아래 시트 100vw, 위 모서리 16px | Esc·바깥 클릭 닫기(제안) | 하단 액션줄 오른쪽(제안) | 16 |
| **F 폼** | `min(720px, 100vw - 32px)` (통합 양식) | `100dvh - 32px` | 시트 100vw, 92dvh, 컨트롤 44px·글자 16px | Esc는 입력 있으면 확인, 바깥 클릭은 입력 있으면 무시(제안) | 하단 액션줄 오른쪽(제안) | 51 |
| **W 작업 화면** | `min(1180px, 100vw - 32px)`, 목록 0.38fr + 상세 1fr. 단열 변형 720px | `min(860px, 100vh - 32px)` | 현재 ≤760px: 거의 전체, 목록 위·상세 아래. 제안: 화면 전체 | Esc는 미저장 변경 확인, 바깥 클릭 무시(제안) | 인라인 폼은 폼 하단, 일괄 저장은 하단 고정 막대 | 25 + 단열 4 |
| **P 전체 화면 패널** | 가장자리 14px 안쪽(왼쪽 레일 70px) | 화면 전체 | 현재 ≤880px 세로 쌓기. 제안: 100vw × 100dvh | 바깥 클릭 없음, Esc 확인(제안) | 본문 안 주요 버튼 | 2 |

현재 공통 동작(코드 사실): **Esc로 닫는 코드가 없고**(`handleModalKeyboard` `ui.js:428`은 Tab만), 바깥 클릭은 `closeModal()`(`index.html:1014`)이라 입력 중인 폼도 확인 없이 닫힌다(진도 모달만 대상 전환 때 확인). 모든 모달이 헤더 오른쪽 행동 또는 본문 아래 버튼 중 모달마다 다르게 저장한다(DESIGN.md 미정 6). 등급을 정하면 이 둘이 같이 정리된다.

### 3.3 통합 후보 묶음 8개

기준: ① 같은 대상(반·학생·숙제·시험·클리닉)을 다루고, ② 연달아 열리거나 갈아 끼워지고(모달 연쇄), ③ 같은 데이터를 저장 후 다시 불러와 고치는 것. 억지로 묶지 않았다(3.4).

**M1. 숙제 사진** (7종, 도달 가능 5 + 숨김 2) — 등급 W
- 합칠 모달: `openHomeworkPhotoAssignmentModal` classroom.js:944(등록) · `openHomeworkPhotoAssignmentList` :984 · `openHomeworkPhotoOverviewModal` :1071 · `openHomeworkPhotoSubmissionFilesModal` :882 · `openHomeworkPhotoImageViewer` :932. 숨김: `loadHomeworkPhotoLinksModal` :1022 · `openHomeworkPhotoLinksModal` :1036. 진입은 반 화면 6기능 중 하나(`openClassroomFeature` `:1740`).
- 시너지(코드 사실):
  - 5개가 모두 `showModal`이라 **뒤로 가기가 없다**(`classroom.js`에 `showModalStep` 0건). 사진 화면에서 "취소"는 반 화면으로 나간다(`closeModal`의 복귀 경로 `ui.js:555-561, 586`). 한 학생 사진을 보려면 숙제(1) → 기존 숙제 보기(2) → 현황(3) → 사진 보기(4) 4클릭과 `GET` 3회(목록 `:989`, 현황 `:1076`, 사진 `:886`)이고 **다음 학생도 처음부터 4클릭**이다. 통합 후 다음 학생은 1클릭·`GET` 1회(사진)다.
  - 등록 저장은 `closeModal(true)`(`handleCreateHomeworkPhotoAssignment` `:964`, `:977`)로 끝난다. 등록한 숙제가 목록에 들어갔는지 보려면 다시 2클릭 + `GET` 1회다. 통합 후 목록 맨 위에 바로 나타난다.
  - 마감·삭제는 `refreshDataOnly()`(전체 `GET initial-data`, `core.js:895`) 뒤에 목록/현황을 또 `GET`한다(`:1131-1132, 1150-1152`). 마감은 "미제출을 숙제 칸에 미완료로 반영"이라 `state.db.homework` 갱신이 필요해 유지한다. 삭제에 전체 재조회가 필요한지는 **의심**.
- 구조 스케치:
  ```
  숙제 · 중2A 반 (반 전환 탭)
  ┌ 숙제 목록 ─────────────┐┌ 선택한 숙제: 현황 ──────────────────┐
  │ [+ 숙제 등록]           ││ 전체 20 · 제출 14 · 미제출 6  [마감][삭제] │
  │  (등록 폼은 이 위에 펼침)││ 김민수  제출 10-31 21:03  사진 3장 [보기] │
  │ ▸ 10/31 단원평가 14/20  ││   └ 썸네일 3장, 탭하면 같은 칸 안에서 크게  │
  │   마감 · 진행            ││ 이서윤  미제출                          │
  └─────────────────────────┘└────────────────────────────────────────┘
  휴대폰: 목록 위 · 현황 아래, 사진은 행 아래로 펼침
  ```
- 위험: 테스트 — `homework-assignment-save-only.test.js`(등록 저장이 링크/QR 모달을 열지 않음, 목록에 링크 버튼 없음; 함수 경계 문자열 정규식이라 함수 순서·이름 변경에 민감), `apmath-modal-design-family.test.js`(ID `hw-photo-title/desc/date/time`, `handleCreateHomeworkPhotoAssignment`, `openHomeworkPhotoAssignmentList`, 통합 클래스), `classroom-button-width-guard.test.js`(현황), `apmath-classroom-feature-return.test.js`(진입·복귀). 옛 함수는 얇은 래퍼로 남겨 새 화면을 열게 한다. `apmath-global-surface.test.js`(classroom 함수 표면 fixture)는 `--update` 필요 여부 확인.
- 학생 화면 영향: 학생 제출 페이지(`homework/index.html:317-636`)가 쓰는 `homework-photo/*` API·링크 형식(`buildHomeworkPhotoStudentUrl` `classroom.js`)을 바꾸지 않는다. 마감·삭제는 학생이 제출할 수 있는지를 바꾸므로 확인 대화상자는 유지하고 버튼 위치만 옮긴다.

**M2. 선생님 계정** (원장, 5종) — 등급 W 단열
- 합칠 모달: `openAdminTeacherAccountManage` dashboard-admin.js:2450(+재그리기 `renderAdminTeacherAccountManage` :2465) · `openAdminCreateTeacherModal` :2503 · `openAdminEditTeacherModal` :2542 · `openAdminResetTeacherPasswordModal` :2578.
- 시너지(코드 사실): 세 저장 함수 모두 끝에서 `openAdminTeacherAccountManage()`를 다시 불러(`:2532, 2568, 2601`) "불러오는 중" 화면 + `GET teachers`(`:2454`)를 한 번 더 한다. 폼 셋은 `showModal`이라 **취소가 목록으로 돌아가지 않는다**(단계 스택 없음). 새 계정 입력 3개는 placeholder만 있다(`:2506-2508`). 통합 후 새 계정은 목록 위 인라인 폼, 수정·비밀번호 초기화는 행 아래 펼침이고, 저장 응답으로 행만 갱신한다(응답에 계정 행이 없으면 `GET teachers` 1회로 유지하되 "불러오는 중" 화면은 없앤다).
- 스케치: `[+ 새 계정]`(펼치면 이름·로그인 ID·초기 비밀번호·역할 + 저장/취소) / 행: 이름 · ID · 역할 · [수정] [비밀번호 초기화] (각각 행 아래 펼침).
- 위험: **서버·인증 코드는 건드리지 않는다**(`POST teachers`, `PATCH teachers/:id`, `PATCH teachers/:id/reset-password`와 payload 그대로). 이 모달들의 전용 테스트가 없다(이름 검색 0건) → 입력 ID·API 경로·역할 값·`type=password`를 지키는 테스트를 먼저 추가한다. 학생 영향 없음.

**M3. 원내평가·OMR 성적 입력** (6종, 도달 가능 4 + 호출처 없음 2) — 등급 W
- 합칠 모달: `openGlobalExamGradeView` dashboard.js:1011(반 고르기) · `openExamGradeView` classroom-planner.js:285(시험 이력) · `openExamDetail` :443(시험 상세) · `openOMR` qr-omr.js:530(학생 OMR 입력). 호출처 없음(의심): `openExamScoreMenu` ui.js:841, `openQrSubmitStatus` qr-omr.js:456. 연결만(통합 아님): `openQrGenerator` qr-omr.js:262(F, 이미 통합 양식).
- 시너지(코드 사실):
  - **OMR 저장 뒤 시험 상세로 돌아오지 않는다.** 시험 상세의 학생 행 버튼은 `closeModal(true); openOMR(...)`(`classroom-planner.js:557, 569`)이고, OMR 저장은 `closeModal(); await refreshDataOnly(); renderClass(...)`(`qr-omr.js:722-731`) = 반 화면으로 나간다. 미제출 학생 N명의 성적을 입력하면 학생마다 원내평가(1) → 시험(2) → 학생 [입력](3) → 저장, 그리고 매번 `GET initial-data` 전체 + 반 화면 재그리기다. 통합 후 저장하면 같은 표의 다음 미제출 학생으로 넘어간다.
  - 시험 상세의 학생 제외·성적 삭제·시험 전체 삭제는 모두 `closeModal(true); await refreshDataOnly(); …; openExamDetail/GradeView(...)`(`:619, 631, 649`) = 닫고, 전체 재조회하고, 다시 연다.
  - 반 고르기 모달(`dashboard.js:1011`)은 각 행이 `closeModal(); openExamGradeView(...)`를 부르는 한 단계짜리다. 반 전환 탭으로 대체된다.
- 스케치: 좌 시험 이력(제목·날짜·평균·응시 n/N·삭제) / 우 선택 시험의 학생 표(점수·오답·제출 상태, 미제출 행에 [입력]) → [입력]은 행 아래(휴대폰) 또는 오른쪽 패널(PC)에 OMR 격자를 펼치고 저장하면 다음 미제출 학생. 아래에 반 취약 단원 요약(`renderWeakUnitSummary`) → 단원 탭은 M7 상세로.
- 위험: 테스트 — `apmath-omr-result-identity.test.mjs`, `assessment-diagnostic-omr-flow.test.js`, `apmath-exam-assignment-identity.test.js`, `classroom-exam-title-display.test.js`, `classroom-status-exam-title.test.js`, `apmath-classroom-feature-return.test.js`. OMR 격자는 문항 수가 최대 50(QR 생성기 `max=50`)이고 `isQrArchiveLike` 분기(`qr-omr.js:531`)가 있다 → 390px 한 화면 검증 필수. 저장 payload(`exam-sessions/new`)·`session_id`/`assignment_id`/`archive_file` 필드를 그대로 둔다.
- 학생 화면 영향: 학생 포털의 시험 결과·OMR 목록이 이 저장 값을 읽는다. **값이 달라지지 않는지** payload 비교 테스트 필수. 일괄 OMR 입력(`bulk-omr`, `qr-omr.js:1420`)은 모달이 아니라 범위 밖.

**M4. 반·학생 관리** (7종) — 4a 반 관리 W 단열 · 4b 학생 명단 W
- 합칠 모달: 4a `openClassManageModal` management.js:218 · `openAddClassModal` :239 · `openEditClassModal` :295. 4b `openAddressBook` :104(학생관리) · `renderWithdrawalReportModal` dashboard-admin.js:555(서랍 "퇴원생"이 실제로 여는 것) · `openAddStudent` student-edit.js:714 · `handleRestore` :111. 호출처 없음/덮어쓰임(의심): `openGlobalPinManagement` :128, `openDischargedStudents` student-edit.js:812. 연결만: `renderStudentExportModal` student-export.js:273(명단 출력).
- 시너지(코드 사실): 반 추가·수정·숨김·복구·삭제 5동작이 모두 `await loadData()` 뒤 `openClassManageModal()`을 다시 부른다(`management.js:285, 358, 380, 405`). 반 이름·학년·과목·담당 입력에 라벨이 없다. 재등원은 저장 후 `closeModal()` → `openWithdrawalReport()`(`student-edit.js:185`)로 목록 화면을 다시 만든다. 신규 학생 추가는 390px에서 입력 15개 본문 640px로 한 화면을 넘는다(v0.1). 통합 후 반 관리는 목록 위 [새 반] 인라인 폼 + 행 [수정] 펼침, 학생 명단은 필터 목록 + 오른쪽(휴대폰은 행 아래) [학생 추가]·[재등원] 인라인 폼.
- 스케치(4a): `학급관리` / `[+ 새 반]`(이름·학년·과목·담당 라벨 + 요일 칩 + 교시/시간) / 활성 반 행(요약 + [수정] [숨김] [삭제]) / 숨김 반 행([복구]).
- 위험: **`apmath-modal-design-family.test.js`**가 반 추가·수정의 통합 양식 클래스, ID(`add-cls-*`, `edit-cls-*`), 헤더 행동 `'추가'`·`'저장'`, 핸들러(`handleAddClass`, `handleEditClass(cid, returnTo)`)를 고정한다 → 인라인 폼으로 옮기면 이 테스트를 같이 고쳐야 한다(저장 위치 결정 필요). `apmath-classroom-management-actions.test.js`(반 화면의 "반 설정" `openEditClassModal(classId, { returnTo })`), `apmath-student-reenrollment.test.js`(`handleRestore`), `apmath-withdrawal-report.test.js`, `admin-discharged-sort.test.js`. 반 화면 쪽 진입은 `openClassroomManagementAction`(`classroom.js:1915`)이 `returnTo` 계약을 쓴다. 응답에 반 행이 있는지에 따라 `loadData()` 제거 여부가 갈린다(**의심**, 확인 필요).
- 학생 화면 영향: 반·학생 구성이 바뀌면 학생 포털의 반 소속·PIN 표시에 영향이 있으나 저장 로직·API는 그대로다.

**M5. 플래너 확인** (4종) — 등급 W
- 합칠 모달: `renderPlannerControl` classroom-planner.js:1797(반 전체 주·월 표) · `openPlannerStudentPlans` :1669(학생 월 상세) · `openPlannerFeedbackModal` :1901(피드백 입력) · `copyPlannerStudentLink` :666(링크 복사 안내).
- 시너지(코드 사실): 피드백 저장 `savePlannerFeedback`(`:1922`)은 `closeModal(true)` 뒤 `await renderPlannerControl(classId)`(`:1940-1942`) = 닫고, 플래너 데이터를 다시 받아 처음부터 다시 연다. 학생 상세에서 반 표로 돌아가는 것도 `renderPlannerControl` 재호출이다. 폭은 JS가 PC에서 1080px을 직접 쓰고(`expandClassPlannerModalForPc` `:1582-1593`), 전용 CSS도 따로 있다(`:1080`대). 링크 복사 안내(`:666`)는 13줄짜리 모달이라 복사 버튼 + 토스트로 줄일 수 있다.
- 스케치: 상단 반 전환 탭 · 주/월 토글 · 날짜 탭 / 좌(PC)·위(휴대폰) 학생×날짜 완료율 표 / 우·아래 선택 학생 월 계획 + 같은 자리 피드백 입력 + [링크 복사].
- 위험: `class-planner-modal-width.test.js`가 `min(1080px, calc(100vw - 32px))` 문자열 두 개를 고정(1180 표준과 충돌 → 테스트 수정 또는 1080 유지 결정), `apmath-classroom-feature-return.test.js`(`renderPlannerControl` 복귀), `class-planner-week-month-start.test.js`.
- 학생 화면 영향: **피드백은 학생 플래너 화면에 표시된다**(`planner/index.html:253-266, 826, 1089`). 저장 payload(`planner/feedback`)를 그대로 두고, 피드백 입력 칸 길이·줄바꿈 처리가 달라지지 않게 한다.

**M6. 학생 상세** (11종, 호출처 없음 1) — 등급 W 단열
- 합칠 모달: 셸 `renderStudentDetailShell` student.js:2420(기본·상담·성적·오답 탭, 보기/수정) + 하위 10종: 상태 이력 :631 · 반 이동 이력 :643 · 연락 설정 :819 · 연락 이력 :878 · 보호자 관리 :976(호출처 없음) · 상담 요약 :1067 · 연락처 추가 :3177 · 연락처 수정 :3221 · 상담 추가 :3335 · 상담 수정 :3483.
- 시너지(코드 사실): 하위 10종은 `showStudentDetailSubModalStep`(`:411`)이 `showModalStep`으로 스택에 쌓는다(`ui.js:447`). 보호자 연락처 구역(`renderParentContactSection` `:908`)이 수정·삭제·연락 설정·연락 이력·추가 5버튼을 가지고 각각 새 모달을 연다. 상담 탭도 `+ 상담`·수정이 모달이다(`:1895, 2006`). 저장 성공은 **단계 전체를 닫고(`closeModal(true)` `:3209, 3255, 3399, 3548`) 상세를 다시 연다**(`renderStudentDetailTab`) + 재조회(상담 `GET consultations`, 보호자 `GET contacts` + `consents`). 통합 후 연락처·상담 편집은 탭 안 인라인이라 상세가 닫혔다 열리는 일이 없다. 상태/반 이동 이력은 기본 탭 하단 접이식(`:548`의 두 버튼을 `details`로).
- 스케치: 탭 기본 | 상담 | 성적 | 오답 (지금과 같음). 기본 탭: 보호자 행마다 [수정](행 아래 폼) [연락 설정](토글 줄) [연락 이력](접이식) / `[+ 보호자]` 인라인 폼 / "재원 이력" 접이식(상태·반 이동). 상담 탭: 목록 + 선택 상담, `[+ 상담]`은 목록 위 인라인 폼, AI 요약은 오른쪽 접이식.
- 위험: **가장 크다.** 학생 상세는 반 화면·시간표·원장 화면 어디서든 열리고 복귀 맥락(`currentStudentDetailReturnTo`, `resolveStudentDetailReturnContext`)이 복잡하다. 테스트 — `apmath-classroom-feature-return.test.js`(`openClassroomConsultation` → `openAddConsultationModal` 반 복귀), `apmath-student-detail-memo-blank.test.js`, `student-consultation-delete-ui.test.js`, `apmath-consultation-save-fallback.test.js`, `apmath-student-teacher-preview.test.js`, `apmath-timetable-cross-teacher-student-detail.test.js`, `eie-timetable-student-profile-ap-parity.test.js`(기본 탭에 `openStudentParentManageModal` 노출 금지), `apmath-global-surface.test.js`와 `tests/fixtures/apmath-surface-student.json`(함수 표면 고정). 상담 저장의 중복 방지 `clientRequestId`(`:3372`대)와 AI 요약 상태 초기화(`resetConsultationAiUiState`)를 인라인에서도 유지해야 한다.
- 학생 화면 영향: 학생에게 보이지 않는 교사용 기록(상담·보호자)이다. 학생 화면 확인 링크(`openStudentPortalPreview` `:575`)는 그대로.

**M7. 클리닉** (7종) — 작업 화면 W + 출력 센터 P
- 합칠 모달: `openClinicClassPicker` clinic-print.js:5811 · `openClinicCenter` :5794(2버튼 메뉴) · `openClinicPrintCenter` :6028(P 유지) · `openClinicSimilarForClass` core.js:1908 · `openWeakUnitDetail` :1555 · `openSimilarQuestionRecommendations` :2156 · `openClinicBasketByKey` :2038.
- 시너지(코드 사실): 진입이 반 화면 → 클리닉 메뉴(2버튼 모달, `:5803-5808`) → 출력 센터 또는 유사문항 → 취약 단원 → 추천 → 바구니로 이어지고 전부 `showModal`(단계 스택 없음, 취소 = 반 화면)이다. 단원 A에서 단원 B로 가려면 클리닉(1) → 유사문항(2) → 단원(3) → 추천(4)을 다시 거친다. 반 없이 서랍에서 열면 반 고르기 모달이 한 단계 더 있다(`:5799`). 2버튼 메뉴와 반 고르기는 **탭(출력 센터 | 유사문항)과 반 전환 탭으로 대체**되어 1단계씩 줄어든다. 출력 센터는 열기 전 API 2건을 기다린다(`:6048-6055`).
- 스케치: 1단계(저위험) 클리닉 화면 = 반 전환 탭 + 탭 [출력 센터 | 유사문항]. 출력 센터는 지금 P를 그대로 쓰되 껍데기를 먼저 열고 자리에서 로딩. 2단계 유사문항 = 좌 취약 단원 목록(`openClinicSimilarForClass`) / 우 선택 단원 상세 + 추천(`openWeakUnitDetail`, `openSimilarQuestionRecommendations`) / 하단·탭에 바구니(`openClinicBasketByKey`). `openWeakUnitDetail`은 `renderWeakUnitSummary`(`core.js:1582`)를 쓰는 시험 상세(M3, `classroom-planner.js:575`)와 학생 상세(`student.js:2940, 2988`)에서도 호출되므로(`core.js:1595`) 독립 함수를 남기고 작업 화면이 같은 렌더러를 쓴다.
- 위험: `clinicPrint*` 출제·인쇄 로직은 **건드리지 않는다**(껍데기·진입만). 테스트 — `apmath-clinic-print-assignment-visibility.test.js`(`openClinicCenter`·`openClinicClassPicker`·`openClinicPrintCenter`·`openClinicSimilarForClass` 존재를 문자열로 고정), `clinic-grade-recent-month-browser.cjs`, `apms-clinic-uid-refresh.test.cjs`, `clinic-archive2-identity.test.cjs`, `print-*` 인쇄 계약. 인쇄물 계약이 걸려 있어 단계 분리(1단계만 먼저).
- 학생 화면 영향: 출제한 클리닉은 학생 포털의 오답 클리닉에 닿는다. 출제 payload·배정(`clinicPrintRefreshClassAssignments`)은 변경 금지.

**M8. 진도·교재** (5종, 정리 후보 3) — 등급 W (본보기 정리)
- 대상: `openClassRecordModal` classroom.js:3626 · `openGlobalTextbookManage` textbook.js:214. 정리 후보: `openTextbookManageModal` :381 · `openAddTextbookModal` :393 · `openEditTextbookModal` :469(옛 교재 관리 3종. 서랍은 `openGlobalTextbookManage`로 직행 `ui.js:888`, 옛 3종은 자기들끼리와 `returnToPreviousManagementView` 분기(`ui.js:502`)로만 도달).
- 시너지(코드 사실): 3.1의 한계 1·2·3 — 교재 변경 구현 두 벌 → 한 벌, 화면별 전역 플래그 분기 제거, 저장 후 `loadData()` + `openClassRecordModal` 재오픈(3개 API 재조회) 제거, 전역 교재 관리 폭(기본 500px)을 W로. 전역 교재 관리는 진도 작업 화면의 "교재 관리" 모드(반 탭을 전체 반으로)로 합치는 안과 따로 두는 안이 있다(사용자 결정).
- 위험: **매일 쓰는 화면이라 마지막에 한다.** 테스트 — `apmath-class-progress-*.test.mjs` 6개, `apmath-class-textbook-course-binding.test.mjs`, `apmath-dashboard-journal-progress.test.mjs`, `apmath-classroom-feature-return.test.js`, `apmath-modal-design-family.test.js`("progress modal remains untouched"). 진도 저장은 3종 API(`class-daily-records`, `class-progress`, 교재 연결)를 순서대로 부르므로 저장 흐름은 건드리지 않고 교재 쪽만 정리한다.
- 학생 화면 영향: 진도 값은 보고서·학부모 리포트에 쓰인다. 저장 payload 불변.

### 3.4 통합하지 않고 등급만 맞추는 것 (46종)

| 모달 | 등급 | 통합 안 하는 이유 |
|---|---|---|
| 원장 14종 — 읽기 목록 9(학생·학년·미배정·선생님별·상담 이력·일지·문의 등), 입력/결과 2(일지 피드백, PIN 결과), 학생 목록·상담 센터 W 2, 메뉴 C 1 | F·W·C | 읽기만 하고 같은 데이터를 앞뒤로 고치지 않는다. 행에서 학생 상세(M6)로 이동할 뿐. 상담 센터(`dashboard-admin.js:1295`)는 이미 전용 W(1080×820) |
| 시간표 확인형 3종(`openTimetableDraftActivateConfirm` timetable.js:1290, `…ClassMoveConfirmModal` :2259, `…TransferConfirmModal` :2548) | C | 드래그·적용 직후 한 번 묻는 확인. "맥락 상자 + 값 나열 + 액션줄" 한 양식으로 정렬(PR-G) |
| 시간표 폼 2종(반 추가·초안 학생 추가), 충돌 결과 | F | 시간표 화면이 주인이고 모달은 한 번 쓰고 닫는 입력 |
| 일정 관리 3종(`openExamScheduleModal` schedule.js:800 + 수정 2) | W + F | 이미 한 모달 안에 달력·목록·입력이 있는 작업 화면 모양이다. 수정만 `showModalStep`이고 저장 6곳이 `loadData()` + 재오픈이라 개선 여지는 있으나(`schedule.js:937, 959, 1167, 1199, 1224, 1249`) 학생 영향이 없고 묶을 다른 모달이 없다 → 후속 후보 |
| 메모 2종(`openTodoMemoModal` memo.js:91, 수정 :226) | F | 입력+목록은 이미 같은 자리다. 수정만 분리돼 있으나 저장 후 로컬 상태로 다시 그린다(`refreshAfterTodoMemoSource` `:197`). 인라인 수정은 효과가 작다 |
| 일지·예외 현황(`openDailyJournalModal` dashboard.js:2792, `openTodayCloseModal` :2109) | F | 매일 쓰지만 화면이 3단계 마법사/입력 하나씩이고 서로 데이터를 앞뒤로 고치지 않는다 |
| QR 생성기, 학교시험 성적 입력, 학생 명단 출력, PIN 일괄 결과 | F | 단일 입력 폼. QR 생성기는 이미 통합 양식(ID 고정 테스트) |
| 보고 문구 5종(`openStudentReportModal` report-text.js:803 등) | C·W·F | 종류 고르기 → 편집 → 복사로 순차이지만 쓰는 빈도·학생 영향이 작고, 정리 후보 2(`copyReport` 덮어씀, `openClassReportBatchModal`)부터 정리한 뒤 판단 |
| 출석부(`renderAttendanceLedger` classroom-planner.js:30), 수납(`management.js:2016`), 학생 이동 선택 | W·C | 표 중심 독립 화면 / 학생 수정으로 이어지는 선택 |
| 교재 오답(`study-material-wrong.js:531`) | P | 이미 탭형 독립 도구(입력 27개). 휴대폰에서 표 최소 폭 520px(`:99`)이 문제라 P 등급 정렬만 |
| 정리 후보 9종(묶음 밖, 위 분류와 겹침) | — | 부록 4절. 사용자 승인 뒤 한 PR로 삭제하고 함수 표면 fixture 갱신 |

### 3.5 진행 순서 (PR)

기준: 선생님이 자주 쓰고(M1·M3) → 학생 화면에 값이 닿고(M3·M5·M7) → 위험이 낮은 것부터. 매일 쓰고 테스트가 많은 화면(M6·M8)은 부품이 검증된 뒤에 한다. 모든 PR은 서버·인증 코드를 건드리지 않는다.

| 순서 | PR | 내용 | 선행 | 위험 |
|---|---|---|---|---|
| 선결 | 사용자 결정 | 3.2 등급 확정, 저장 버튼 위치, Esc·바깥 클릭, 정리 후보 17 삭제 승인, 묶음·순서 승인(5절). v0.1 선결(DESIGN.md 미정 2·3·4·6)과 학생 포털 접근성 수정은 별도 트랙 | — | — |
| 1 | **M1 숙제** + 공통 부품 | `apms-workspace*` CSS·JS 부품(목록/상세/인라인 폼/대상 전환) 도입, 등급 클래스(`apms-modal--confirm/form/workspace/panel`, 이름은 제안), 숙제 5종 통합. 반 화면 6기능 진입(`openClassroomFeature`)은 그대로 | 선결 | 낮음~중간 |
| 2 | **M2 선생님 계정** | 목록+인라인 폼 단열(W 단열) 검증. 원장만 쓰고 위험 낮음. 서버·인증 코드 없이 UI만 | 1 | 낮음 |
| 3 | **M3 원내평가·OMR** | 시험 이력/상세/OMR 입력 패널. payload 불변 테스트 필수 | 1 | 중간 |
| 4 | **M4 반·학생 관리** | 4a 반 관리 → 4b 학생 명단(재등원·신규). `apmath-modal-design-family.test.js` 수정 동반 | 1, 저장 위치 결정 | 중간 |
| 5 | **M5 플래너** | 1080px 문자열 테스트 정리, 피드백 인라인 | 1 | 중간 |
| 6 | **M7 클리닉 1단계** | 메뉴·반 고르기 제거(탭), 출력 센터 로딩 먼저 열기. 2단계(유사문항 2열)는 별 PR | 1 | 중간(인쇄 계약) |
| 7 | **M6 학생 상세** | 보호자 구역 → 상담 탭 → 이력 순으로 3개 PR로 쪼갠다 | 1~4 | **높음** |
| 8 | **M8 진도·교재** | 교재 구현 한 벌 + 로컬 갱신, 전역 교재 관리 W, 진도 모달을 공통 부품 이름으로 이전 | 1~7 | 높음(매일 쓰는 화면) |
| 병행 | **등급 정렬 5개 PR** | 1번 이후 언제든: (a) 묶음 밖 확인·선택 C 9종 (b) 원장 읽기 목록 F (c) 폼 F: 학생 등록 외 입력 폼 라벨·44px (d) 일정·시간표 (e) 일지·메모·보고. 각 PR 모달 3~5개 | 1 | 낮음 |
| 병행 | **정리 후보 삭제 1 PR** | 사용자 승인 뒤. 숨김 고정 테스트 2건·EIE 테스트 1건 수정 동반 | 선결 | 낮음 |

v0.1의 PR-A~G는 이 표로 대체된다(학생 등록·재등원 → M4, 출결·숙제 → M1, 성적 입력 → M3, 일지·메모 → 등급 정렬 (e), 교재·반 관리 폼 → M4·M8, 원장 계정 → M2, 확인형 → 등급 정렬 (a)).

### 3.6 PR 공통 완료 기준

기준은 "학생·선생님이 실제 화면(PC·휴대폰)에서 막히지 않는가"다. 수치상 완벽을 요구하지 않는다.
1. **기능 유지.** 3.3의 묶음별 관련 테스트가 통과한다. 입력 ID·저장 함수·API 경로·돌아갈 화면은 그대로다. 옛 열기 함수(`openHomework…`, `openAdminCreateTeacherModal` 등)는 호출처가 있는 한 새 화면을 여는 얇은 래퍼로 남긴다(`apmath-onclick-defined.test.js`·`apmath-global-surface.test.js` fixture 확인, 이름을 지울 때만 `--update`).
2. **결함 조건 테스트(새로).** 묶음마다 개수가 아니라 결함을 검사한다: 작업 화면 구간에 `showModalStep`·`showModal` 갈아 끼움 0, 저장 성공 경로에 `closeModal(true)` 뒤 같은 화면 재오픈 0, 라벨 없는 입력 0, 저장 payload 필드 목록 불변(학생에게 닿는 M1·M3·M5·M7).
3. **화면 확인.** 4절 하니스 방식(`file://`로 `apmath/index.html`을 열고 페이지 안에서 `state.db`와 `api.get/post` 응답을 채운 뒤 모달 함수 호출, 로그인 오버레이 숨김은 테스트 안에서만, 서버·인증 코드 변경 금지)으로 PC 1280×800과 휴대폰 390×844 스크린샷. 상태는 빈 데이터 / 보통 / 많음(학생 30명·숙제 10개·OMR 문항 50개) 3종. 본다: 가로 넘침 없음, 저장·추가 버튼이 스크롤 없이 또는 고정 막대로 닿음, 가려지는 내용 없음, 신규 11px 이하 글자 없음, 터치 요소 44px, 다크 모드 1장.
4. **학생 화면 불변.** diff에 `apmath/student/`·`apmath/homework/`·`apmath/planner/`·`apmath/worker-backup/`가 없다.
5. **검수 비용.** 검수자는 바뀐 부분과 관련 테스트만 다시 돌리고, `node tools/run-tests.js` 전체는 병합 직전 1회(`CLAUDE.md`).

## 4. 화면 확인 방법 조사 (사실만, 새 장치 제안 없음)

APMS(`apmath/index.html`)와 학생 포털은 로그인이 필요하다. 이미 있는 방법:

1. **선생님 미리보기(실서버 필요).** 학생 상세의 "학생 화면 확인 ↗"가 `student/?teacher_preview=1&student_id=<id>`를 연다(`js/student.js:575-587`). 학생 포털은 `isTeacherPreview`일 때 `localStorage`의 `APMATH_SESSION.session_token`(교사 로그인 결과)을 `readTeacherPreviewToken()`(`student/index.html:1008`)으로 읽어 `Authorization: Bearer`로 실제 워커 API(`API_BASE` workers.dev, `:763`)를 부른다. 따라서 **실제 교사 로그인 + 네트워크가 있어야** 보인다. 읽기 전용(저장 시 오류). `tests/apmath-student-teacher-preview.test.js`는 소스 문자열만 검사하고 화면을 열지 않는다.
2. **학생 포털 목업 픽스처.** `tests/fixtures/student-portal-exam-list-preview.html`은 `/apmath/student/index.html`을 가져와 `boot()` 호출을 가짜 `session`·`omrData`로 바꿔 iframe `srcdoc`에 그린다(시험지 목록 화면). 같은 origin에서 정적 서버로 열어야 한다. 이 파일을 부르는 테스트·문서는 찾지 못했다(`grep`).
3. **정적 HTML 조각 + CSS 얹기.** `tests/clinic-grade-recent-month-browser.cjs`는 빈 HTML 페이지에 `apmath/css/apms-clinic-print.css`를 `addStyleTag`로 얹고 가짜 DOM을 넣어 Playwright(Chrome)로 렌더·검사한다. 로그인 없이 CSS만 확인하는 기존 방식이다.
4. **API 가로채기 선례(아카이브용).** `tests/archive-prewarm-browser.cjs`, `archive-fast-engine-browser.cjs`는 `localStorage.APMATH_SESSION`에 `local-test-only` 토큰을 심고 `context.route('**/api/**')`로 응답을 가짜로 만든다. APMS 화면(`apmath/index.html`)에 이 방식을 쓴 테스트는 찾지 못했다.
5. **로컬 워커.** `tests/archive2-worker-runtime.mjs`가 Miniflare로 실제 워커 코드를 메모리 D1과 함께 띄운다(아카이브 라우트 테스트). `apmath/worker-backup/worker/`에 `wrangler.jsonc`·`schema.sql`, `apmath/worker-backup/seed.sql`이 있다. APMS 화면 스크린샷을 위한 로컬 실행 절차는 문서에서 찾지 못했다.
6. **이번 조사에서 직접 해 본 것(기존 코드만 사용).** `file://`로 `apmath/index.html`을 Chrome(Playwright)에서 열면 로그인 화면이 뜨고 CSS·전역 함수가 모두 로드된다. 페이지 안에서 `state.db`에 가짜 반·학생을 채우고 `openAddClassModal()`처럼 열기 함수를 직접 호출하면 모달이 그려진다(32건 중 29건 성공, 3건은 함수명·인수·`fetch` 실패로 못 엶). 로그인 오버레이(`.ap-login-fullscreen`, `core.js:606`, z-index 3000)가 모달 위를 덮어서 하니스에서 `display:none` 스타일을 주입했다. 서버·인증 코드는 건드리지 않았고 실데이터도 없다. 이것을 "로그인 우회"로 볼지는 메인이 판단한다. 한계: 대시보드·반 화면 같은 전체 화면은 `renderDashboard()` 등에 필요한 `state.db` 모양을 채워야 하고 시도하지 않았다.

**결론.** 인증을 건드리지 않고 쓸 수 있는 기존 방식은 (3) 정적 조각 렌더, (2) 학생 포털 목업 픽스처, 그리고 6번의 하니스 방식이다. 선생님 미리보기는 실제 교사 로그인이 필요하다.

## 5. 이 계획에서 정하지 않은 것 (사용자 결정)

**v0.1에서 이어짐**
- 선결 결정 4건(DESIGN.md 미정 2·3·4·6)과, 학생 포털 접근성 수정(v0.1 0번: placeholder 대비 2.30, 상태색 글자, 플래너 다크 버튼, 11px 9곳)을 모양 통일 결정 전에 먼저 해도 되는지. 이 수정은 모달 통합과 별도 트랙이고 학생이 직접 보는 화면이라 가장 먼저다.
- 스크린샷 검수에 4절의 하니스 방식을 써도 되는지(로그인 오버레이 숨김은 테스트 안에서만, 서버·인증 코드 변경 없음).

**v0.2 새로 필요한 결정** (DESIGN.md 미정 11~16과 같은 내용)
1. **모달 4등급(C·F·W·P)과 W 단열 변형을 확정할지**, W 기본 너비를 진도 모달의 1180px로 할지 상담 센터·플래너의 1080px로 할지(제안: 1180px). 3.2.
2. **저장 버튼 위치**(미정 6 확장): C·F는 하단 액션줄, W는 인라인 폼 하단 + 일괄 저장 막대로 일원화할지(제안). 하면 반 추가·수정의 헤더 '추가'/'저장'이 바뀌고 `apmath-modal-design-family.test.js`를 같이 고친다.
3. **Esc 키와 바깥 클릭**: 지금은 Esc가 없고 바깥 클릭은 입력 중인 폼도 닫는다. 등급별로 Esc 닫기 추가, F는 입력 있으면 바깥 클릭 무시, W·P는 바깥 클릭 무시로 바꿔도 되는지(제안).
4. **정리 후보 17종 삭제**(부록 4절). 특히 숨김이 테스트로 고정된 숙제 링크·QR 2종(`homework-assignment-save-only.test.js`)과 EIE 테스트가 노출 금지를 고정한 `openStudentParentManageModal` 1종은 테스트를 고쳐야 한다. 실제 화면에서 쓰는 곳이 없는지 사용자 확인 필요(의심 단계).
5. **통합 묶음 8개와 순서 승인.** 특히 M6 학생 상세·M8 진도·교재는 매일 쓰는 화면이라 동작이 눈에 띄게 달라진다(저장 후 닫혔다 다시 열리는 일이 없어짐). M4는 반 추가·수정이 이미 통합 양식이어서 테스트 수정이 따른다.
6. **휴대폰에서 작업 화면(W)의 모양**: 목록 위 · 상세 아래로 쌓기(진도 모달의 현재 방식, 제안) 대 목록 → 상세 화면 전환(드릴다운). 쌓기는 스크롤이 길어지고 드릴다운은 뒤로 가기가 필요하다.
7. **전역 교재 관리**(서랍 "교재관리", 전체 반)를 진도 작업 화면의 "교재 관리" 모드로 합칠지 따로 둘지(M8).
8. **클리닉 2버튼 메뉴 모달과 반 고르기 모달을 탭으로 대체**해도 되는지(M7 1단계). 출력 센터 로직은 건드리지 않는다.
