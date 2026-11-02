# APMS 모달 통합 부록 — 등급 정의와 98종 배정표 (v0.2 계획서 부록)

작성 2026-11-02. 본문: `docs/plans/2026-11-02-apms-ui-upgrade-plan-v0.1.md`(파일 이름은 유지, 내용은 v0.2). 코드는 바꾸지 않았다.

**읽는 법.** 함수의 파일:줄은 `function` 정의 줄이다(2026-11-02 `main` 기준). 등급은 "통합 후에도 그 모양으로 남는다면"의 등급이고, 묶음에 속한 모달은 해당 작업 화면 안의 구역으로 흡수될 수 있다(본문 3.3). 비고의 "정리 후보"는 **코드 검색으로 호출처를 찾지 못했거나 같은 이름에 덮어쓰여 실행되지 않는 것**이다. 동적 호출까지 확인한 것은 아니므로 "의심"이며, 삭제 전에 실제 화면 확인과 사용자 승인이 필요하다.

## 1. 등급 정의 (값은 현재 CSS)

현재 값의 출처: 일반 껍데기 `apmath/index.html:692-706, 931-945` · 통합 양식 `apmath/css/apms-unified-modal.css:4-9, 138-150` · 진도 모달 `apmath/css/apms-theme-override.css:1036-1049, 1605-1624` · 클리닉 전체 화면 `apmath/css/apms-clinic-print.css:1008-1021, 1082-1096`. "제안"은 지금 없는 동작이다(구현은 이 문서의 범위 밖).

| 등급 | 쓰는 곳 | 데스크톱 너비 · 최대 높이 | 휴대폰(≤600px) | 헤더 · 본문 · 하단 | 닫기 (Esc / 바깥 클릭) | 저장 위치 |
|---|---|---|---|---|---|---|
| **C 확인·선택** | 한 문장 + 값 나열 + 버튼 2~3개, 또는 항목 고르기(반 선택·메뉴) | 현재 값 `max-width 500px`(`index.html:692-696`), `max-height 90vh` | 아래에서 올라오는 시트: 100vw, 위 모서리 16px, `max-height calc(92vh - safe-area)`(`index.html:931-938`) | 헤더 취소·제목. 본문은 맥락 상자(`apms-unified-context`) 한 개 + 값 목록. 하단 액션줄 | 제안: Esc 닫기 · 바깥 클릭 닫기 (현재: Esc 없음, 바깥 클릭은 `closeModal()`, `index.html:1014`) | 제안: 하단 액션줄 오른쪽 주요 버튼. 위험 동작은 투명 바탕+빨간 글씨/선(No-Solid-Red) |
| **F 폼** | 입력 1~8개, 짧은 읽기 목록 | 현재 값 `min(720px, 100vw - 32px)`, `max-height calc(100dvh - 32px)`(`apms-unified-modal.css:4-9`) | 시트: 100vw, 높이 92dvh, 본문 하단 여백 18px+safe-area(`:138-150`). 컨트롤 44px·글자 16px | 헤더 취소·제목. 본문 맥락 상자 + 라벨 달린 컨트롤(`apms-unified-label/-control`, 간격 12px). 하단 `apms-unified-actions`(우측 정렬, 윗선) | 제안: Esc는 입력이 있으면 확인 후 닫기, 바깥 클릭은 입력이 있으면 무시 | 제안: 하단 액션줄 오른쪽(`apms-unified-primary`). 헤더 오른쪽 행동은 쓰지 않음(미정 6) |
| **W 작업 화면** | 목록 + 상세(+같은 자리 추가·수정). 진도 모달형 | 현재 값 `min(1180px, 100vw - 32px)` × `min(860px, 100vh - 32px)`(`apms-theme-override.css:1036-1041`). 목록 열 `minmax(300px, 0.38fr)` + 상세 `1fr`, 간격 14px(`:1091-1097`) | 현재 값(≤760px): `100vw - 16px` × `100vh - 16px`, 목록 위·상세 아래 한 열(`:1605-1625`). 제안: 휴대폰은 화면 전체(100vw × 100dvh) | 헤더 취소·제목 → 맥락 줄(대상 이름·날짜) → 대상 전환 탭(sticky, `:2559-2564`) → 목록/상세 → 하단 고정 막대 | 제안: Esc는 저장 안 한 변경이 있으면 확인 후 닫기(진도 모달의 `hasUnsavedClassProgressChanges`, `classroom.js:2413` 방식), 바깥 클릭은 무시 | 항목 하나를 고치는 인라인 폼은 폼 안 하단 액션줄. 화면 전체를 한 번에 저장하는 경우만 하단 고정 저장 막대(진도 모달 `.ap-class-progress-footer`) |
| **W 단열 변형** | 목록 + 같은 자리 폼, 상세 열이 필요 없는 것(계정·반 관리·학생 상세) | 너비 `min(720px, 100vw - 32px)`(F와 같음), 높이는 W와 같음 | W와 같음 | W와 같되 좌우 2열 대신 목록 위 인라인 폼, 행 아래 펼침 | W와 같음 | W와 같음 |
| **P 전체 화면 패널** | 입력·컨트롤이 많은 독립 도구(클리닉 출력 센터, 교재 오답) | 현재 값: 화면에서 위·오른쪽·아래 14px, 왼쪽 70px(드로어 펼치면 274px)(`apms-clinic-print.css:1008-1021, 1031-1035`) | 현재 값: ≤900px에서 여백 10px(`:1081-1088`), ≤880px에서 컨트롤·미리보기 세로로 쌓기(`:1090-1100`). 제안: 100vw × 100dvh | 헤더 취소·제목 + 본문 전체. 하단 버튼은 본문 안 | 제안: 바깥 클릭 없음. Esc는 확인 후 닫기 | 본문 안 주요 버튼(출력·저장) |

등급 사이 공통 규칙 (제안):
- 높이는 `dvh`로 통일한다. 지금은 `90vh`(일반)·`100dvh - 32px`(통합)·`100vh - 32px`(진도)가 섞여 있어 휴대폰 주소창 때문에 하단이 잘릴 수 있다(의심).
- W 너비는 1180px을 기본으로 한다(`main#app-root` 데스크톱 최대폭과 같음, `index.html:292-297`). 상담 센터(`dashboard-foundation.css:1379`)와 플래너(`classroom-planner.js:1588`)는 1080px이라 해당 묶음 PR에서 맞춘다.
- 모달 연쇄는 만들지 않는다. W 안에서는 `showModalStep`을 쓰지 않고 구역 전환(목록 선택, 행 펼침, 인라인 폼)으로 한다. 지금 단계 스택(`showModalStep`)을 쓰는 곳은 일정·시간표·학생 상세뿐이고(`schedule.js` 2, `timetable.js` 2, `student.js` 1), 나머지 모달 연쇄는 `showModal`로 갈아 끼워서 **뒤로 가기가 없다**(취소 = 닫기).

## 2. 98종 배정표

열기 함수 98개 = `showModal`·`showModalStep`·`replaceModalStep`·`setModalBody`를 부르는 함수 99개 − 같은 모달을 다시 그리는 `renderGlobalTextbookManage`(`textbook.js:204`) 1개. 같은 모달의 재그리기 함수(`renderAdminTeacherAccountManage`)는 v0.1 집계 방식대로 따로 세었다. 학생 상세 하위 10종은 `showStudentDetailSubModalStep`(`student.js:411`) 경유.

| # | 함수 | 파일:줄 | 용도 | 등급 | 묶음 | 비고 |
|---|---|---|---|---|---|---|
| 1 | `openHomeworkPhotoAssignmentModal` | `classroom.js:944` | 숙제 등록(제목·설명·마감) | F 폼 | 숙제 | 이미 통합 양식. 입력에 라벨 없음(placeholder만). 작업 화면 안 인라인 등록 폼으로 흡수 |
| 2 | `openHomeworkPhotoAssignmentList` | `classroom.js:984` | 반의 숙제 목록(제출 n/N, 현황·삭제) | W 작업 화면 | 숙제 | 작업 화면 좌측 목록 |
| 3 | `openHomeworkPhotoOverviewModal` | `classroom.js:1071` | 선택 숙제의 학생별 제출 현황, 마감·삭제 | W 작업 화면 | 숙제 | 작업 화면 우측 현황 |
| 4 | `openHomeworkPhotoSubmissionFilesModal` | `classroom.js:882` | 제출한 학생의 사진 목록 | W 작업 화면 | 숙제 | 현황 행 아래로 펼침 |
| 5 | `openHomeworkPhotoImageViewer` | `classroom.js:932` | 사진 확대 보기 | C 확인·선택 | 숙제 | 작업 화면 안 큰 보기로 흡수(별도 모달 폐지) |
| 6 | `loadHomeworkPhotoLinksModal` | `classroom.js:1022` | 학생별 링크 불러오기(로딩) | C 확인·선택 | 숙제 | UI 어디에서도 호출 안 됨. 테스트가 목록의 링크 버튼 노출 금지를 고정(`homework-assignment-save-only.test.js`) **보류: 사용자 결정(숨김 고정 테스트가 경계로 씀)** |
| 7 | `openHomeworkPhotoLinksModal` | `classroom.js:1036` | 학생별 제출 링크·QR 목록 | W 작업 화면 | 숙제 | 위와 같음(숨김 고정). 삭제 여부는 사용자 결정 **보류: 사용자 결정(6행과 한 묶음)** |
| 8 | `openAdminTeacherAccountManage` | `dashboard-admin.js:2450` | 선생님 계정 목록 불러오기(GET teachers) | W 작업 화면(단열) | 선생님 계정 | 목록+인라인 폼 단열 작업 화면 |
| 9 | `renderAdminTeacherAccountManage` | `dashboard-admin.js:2465` | 계정 목록 그리기(같은 모달 재그리기) | W 작업 화면(단열) | 선생님 계정 | 위와 같은 모달 |
| 10 | `openAdminCreateTeacherModal` | `dashboard-admin.js:2503` | 새 계정(이름·ID·초기 비밀번호·역할) | F 폼 | 선생님 계정 | 입력 3개 placeholder만. 목록 위 인라인 폼으로 흡수 |
| 11 | `openAdminEditTeacherModal` | `dashboard-admin.js:2542` | 계정 수정(이름·역할) | F 폼 | 선생님 계정 | 행 아래 인라인 폼으로 흡수 |
| 12 | `openAdminResetTeacherPasswordModal` | `dashboard-admin.js:2578` | 비밀번호 초기화 | F 폼 | 선생님 계정 | 행 아래 인라인 폼으로 흡수 |
| 13 | `openGlobalExamGradeView` | `dashboard.js:1011` | 원내평가: 반 고르기 | C 확인·선택 | 원내평가·OMR | 반 전환 탭으로 대체(서랍 `ui.js:897`) |
| 14 | `openExamScoreMenu` | `ui.js:841` | 점수 메뉴(반별 원내평가 진입) | C 확인·선택 | 원내평가·OMR | 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 15 | `openExamGradeView` | `classroom-planner.js:285` | 반의 시험 이력(평균·응시) | W 작업 화면 | 원내평가·OMR | 작업 화면 좌측 목록 |
| 16 | `openExamDetail` | `classroom-planner.js:443` | 시험 상세: 학생별 점수·오답·제외·삭제 | W 작업 화면 | 원내평가·OMR | 작업 화면 우측. 인라인 style 36개·11px 8곳 |
| 17 | `openOMR` | `qr-omr.js:530` | 학생 1명 OMR 성적 입력(문항 격자) | W 작업 화면 | 원내평가·OMR | 작업 화면 우측 입력 패널. 저장 후 반 화면으로 나감(`qr-omr.js:722-731`) |
| 18 | `openQrSubmitStatus` | `qr-omr.js:456` | QR 시험 제출 현황 조회 | F 폼 | 원내평가·OMR | 자기 자신 외 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 19 | `openClassManageModal` | `management.js:218` | 학급관리: 활성·숨김 반 목록 | W 작업 화면(단열) | 반·학생 관리 | 목록+인라인 폼 단열 |
| 20 | `openAddClassModal` | `management.js:239` | 새 반 추가 | F 폼 | 반·학생 관리 | 이미 통합 양식. 라벨 없음. 인라인 폼으로 흡수(테스트가 ID·헤더 '추가' 고정) |
| 21 | `openEditClassModal` | `management.js:295` | 반 수정 | F 폼 | 반·학생 관리 | 이미 통합 양식. 인라인 폼으로 흡수. 반 화면에서도 호출(`classroom.js:1932`) |
| 22 | `openAddressBook` | `management.js:104` | 학생관리: 검색·반 필터·재원생 목록 | W 작업 화면 | 반·학생 관리 | 작업 화면 좌측 목록. 서랍 진입 |
| 23 | `renderWithdrawalReportModal` | `dashboard-admin.js:555` | 퇴원생 리포트(서랍 '퇴원생'이 실제로 여는 것) | W 작업 화면 | 반·학생 관리 | `openDischargedStudents`가 이것을 연다(`dashboard-admin.js:218`) |
| 24 | `openAddStudent` | `student-edit.js:714` | 신규 학생 등록(입력 8개+) | F 폼 | 반·학생 관리 | 390px에서 15개 입력·placeholder만. 인라인 폼으로 흡수 |
| 25 | `handleRestore` | `student-edit.js:111` | 재등원 처리(반·재등원일) | F 폼 | 반·학생 관리 | 인라인 폼으로 흡수. 저장 뒤 퇴원 리포트로 이동(`student-edit.js:185`) |
| 26 | `renderPlannerControl` | `classroom-planner.js:1797` | 반 전체 학생 플래너 확인(주·월 표) | W 작업 화면 | 플래너 | JS가 PC에서 1080px 직접 지정(`:1588`), 테스트 고정 |
| 27 | `openPlannerStudentPlans` | `classroom-planner.js:1669` | 학생 한 명의 월 계획 상세 | W 작업 화면 | 플래너 | 작업 화면 우측 상세 |
| 28 | `openPlannerFeedbackModal` | `classroom-planner.js:1901` | 학생 플래너 피드백 입력 | F 폼 | 플래너 | 학생 플래너 화면에 표시되는 값. 우측 인라인 폼으로 흡수 |
| 29 | `copyPlannerStudentLink` | `classroom-planner.js:666` | 학생 플래너 링크 복사 안내 | C 확인·선택 | 플래너 | 복사 버튼 즉시 복사+토스트로 모달 제거 후보 |
| 30 | `renderStudentDetailShell` | `student.js:2420` | 학생 상세: 기본·상담·성적·오답 탭, 보기·수정 | W 작업 화면(단열) | 학생 상세 | 기본 껍데기 500px 단열(폭 규칙 없음) |
| 31 | `openStudentStatusHistoryModal` | `student.js:631` | 상태 변경 이력(읽기) | F 폼 | 학생 상세 | 기본 탭의 접이식 구역으로 흡수 |
| 32 | `openStudentClassTransferHistoryModal` | `student.js:643` | 반 이동 이력(읽기) | F 폼 | 학생 상세 | 위와 같음 |
| 33 | `openParentConsentModal` | `student.js:819` | 보호자 연락 설정(동의 토글) | F 폼 | 학생 상세 | 보호자 행 아래 펼침 **삭제됨(정리 PR, 보호자 화면)** |
| 34 | `openParentMessageHistoryModal` | `student.js:878` | 보호자 연락 이력(읽기) | F 폼 | 학생 상세 | 보호자 행 아래 펼침 **삭제됨(정리 PR, 보호자 화면)** |
| 35 | `openStudentParentManageModal` | `student.js:976` | 보호자 관리(탭의 구역을 모달로 복제) | F 폼 | 학생 상세 | 호출처 없음. EIE 테스트가 기본 탭 노출 금지를 고정(`eie-timetable-student-profile-ap-parity.test.js:130`). 정리 후보 **삭제됨(정리 PR)** |
| 36 | `openAddParentContactModal` | `student.js:3177` | 보호자 연락처 추가 | F 폼 | 학생 상세 | 인라인 폼으로 흡수 **삭제됨(정리 PR, 보호자 화면)** |
| 37 | `openEditParentContactModal` | `student.js:3221` | 보호자 연락처 수정 | F 폼 | 학생 상세 | 인라인 폼으로 흡수 **삭제됨(정리 PR, 보호자 화면)** |
| 38 | `renderConsultationThreadSummaryModal` | `student.js:1067` | 상담 AI 요약 | F 폼 | 학생 상세 | 상담 탭 우측 접이식 패널 |
| 39 | `openAddConsultationModal` | `student.js:3335` | 상담 기록 추가 | F 폼 | 학생 상세 | 반 화면에서도 직접 호출(`classroom.js:544`), 테스트가 반 복귀 고정 |
| 40 | `openEditConsultation` | `student.js:3483` | 상담 수정 | F 폼 | 학생 상세 | 인라인 폼으로 흡수 |
| 41 | `openClinicClassPicker` | `clinic-print.js:5811` | 클리닉: 반 고르기 | C 확인·선택 | 클리닉 | 반 전환 탭으로 대체 |
| 42 | `openClinicCenter` | `clinic-print.js:5794` | 클리닉 메뉴(출력 센터 / 유사문항 2버튼) | C 확인·선택 | 클리닉 | 탭으로 대체해 폐지 후보 |
| 43 | `openClinicPrintCenter` | `clinic-print.js:6028` | 오답 클리닉 출력 센터(컨트롤 24개) | P 전체 화면 | 클리닉 | 이미 전체 화면(`apms-clinic-print.css:1008`). 열기 전 API 2건 대기(`:6048-6055`) |
| 44 | `openClinicSimilarForClass` | `core.js:1908` | 유사문항: 반 취약 단원 목록(로딩→목록, showModal 3곳) | W 작업 화면 | 클리닉 | 작업 화면 좌측 목록 |
| 45 | `openWeakUnitDetail` | `core.js:1555` | 취약 단원 상세(오답 문항) | W 작업 화면 | 클리닉 | 작업 화면 우측 상세. 시험 상세 등에서도 호출(`core.js:1595`) |
| 46 | `openSimilarQuestionRecommendations` | `core.js:2156` | 유사문항 추천(로딩→결과) | W 작업 화면 | 클리닉 | 우측 하단 패널 |
| 47 | `openClinicBasketByKey` | `core.js:2038` | 클리닉 바구니(후보 담기) | W 작업 화면 | 클리닉 | 우측 탭/패널 |
| 48 | `openClassRecordModal` | `classroom.js:3626` | 진도관리(교재별 진도+과정+특이사항) | W 작업 화면 | 진도·교재 | 본보기. 매일 쓰는 화면 |
| 49 | `openGlobalTextbookManage` | `textbook.js:214` | 전체 교재 관리(반 목록→반 패널, 인라인 추가) | W 작업 화면 | 진도·교재 | 진도 모달과 같은 부품이지만 폭 규칙 없음(기본 500px) |
| 50 | `openTextbookManageModal` | `textbook.js:381` | 옛 교재 관리 목록 | W 작업 화면 | 진도·교재 | `returnToPreviousManagementView`(`ui.js:502`)로만 도달. 정리 후보 **삭제됨(정리 PR)** |
| 51 | `openAddTextbookModal` | `textbook.js:393` | 옛 교재 등록 폼 | F 폼 | 진도·교재 | 위 모달에서만 도달. 정리 후보 **삭제됨(정리 PR)** |
| 52 | `openEditTextbookModal` | `textbook.js:469` | 옛 교재 수정 폼 | F 폼 | 진도·교재 | 옛 목록(`groupAndSortBooks`)에서만 도달. 정리 후보 **삭제됨(정리 PR)** |
| 53 | `openAttendanceMetaModal` | `classroom.js:619` | 출결 메모·태그 | F 폼 | 등급만 | 호출처 없음(의심). 정리 후보. 저장 버튼이 본문 아래 **삭제됨(정리 PR)** |
| 54 | `openClassroomStudentMovePicker` | `classroom.js:1954` | 학생 이동: 학생 고르기 | C 확인·선택 | 등급만 | `openClassroomManagementAction`에서 호출. 학생 수정으로 이어짐 |
| 55 | `openStudentActionSheetV4` | `classroom.js:1854` | 학생 관리 3버튼 시트 | C 확인·선택 | 등급만 | 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 56 | `renderAttendanceLedger` | `classroom-planner.js:30` | 출석부 표 | W 작업 화면 | 등급만 | 서랍 진입. 표 중심 |
| 57 | `openSchoolExamRecordModal` | `cumulative.js:2231` | 학교시험 성적 1건 입력(11개 입력) | F 폼 | 등급만 | 자기 자신 외 호출처 못 찾음(의심). 라벨 0 **삭제됨(정리 PR)** |
| 58 | `openQrGenerator` | `qr-omr.js:262` | QR 생성기(시험명·문항 수·날짜) | F 폼 | 등급만 | 이미 통합 양식. 반 화면 6기능 진입 중 하나(`classroom.js:1741`). M3와 연결만 |
| 59 | `openExamScheduleModal` | `schedule.js:800` | 일정 관리(달력+목록+입력) | W 작업 화면 | 등급만 | 저장 6곳이 `loadData()`+재오픈. 수정만 단계(스택) |
| 60 | `openEditUnifiedScheduleModal` | `schedule.js:972` | 일정 수정(단계) | F 폼 | 등급만 | `showModalStep` |
| 61 | `openEditGroupedExamScheduleModal` | `schedule.js:1055` | 묶음 시험 일정 수정(단계) | F 폼 | 등급만 | `showModalStep` |
| 62 | `openTimetableDraftActivateConfirm` | `timetable.js:1290` | 개편 시간표 적용 확인 | C 확인·선택 | 등급만 | 확인형 |
| 63 | `openTimetableDraftConflictDetailsModal` | `timetable.js:1565` | 충돌 확인 결과(읽기) | F 폼 | 등급만 | `showModalStep` |
| 64 | `openTimetableDraftAddStudentModal` | `timetable.js:1334` | 초안에 학생 추가 | F 폼 | 등급만 | 입력 5 |
| 65 | `openTimetableClassMoveConfirmModal` | `timetable.js:2259` | 반 시간표 이동 확인 | C 확인·선택 | 등급만 | 확인형 |
| 66 | `openTimetableAddClassModal` | `timetable.js:2432` | 시간표에 반 추가 | F 폼 | 등급만 | 입력 4 |
| 67 | `openTimetableTransferConfirmModal` | `timetable.js:2548` | 전반 확인 | C 확인·선택 | 등급만 | 확인형 |
| 68 | `openOperationMenu` | `dashboard.js:1025` | 시스템·동기화 상태 | C 확인·선택 | 등급만 | 상태 2줄+버튼 |
| 69 | `openTodayCloseModal` | `dashboard.js:2109` | 예외 현황(3단계) | F 폼 | 등급만 | 단계마다 `showModal` 재호출 |
| 70 | `openDailyJournalModal` | `dashboard.js:2792` | 일지 작성 | F 폼 | 등급만 | 매일 사용 |
| 71 | `openTodayExamSetModal` | `dashboard.js:2154` | 오늘 시험 설정 | F 폼 | 등급만 | 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 72 | `openTodoMemoModal` | `memo.js:91` | 메모: 입력+목록 | F 폼 | 등급만 | 이미 같은 자리 추가. 수정만 별도 모달. 매일 사용 |
| 73 | `openEditTodoMemoModal` | `memo.js:226` | 메모 수정 | F 폼 | 등급만 | 저장 뒤 `openTodoMemoModal()`로 복귀 |
| 74 | `openStudentReportModal` | `report-text.js:803` | 보고 문구 종류 고르기 | C 확인·선택 | 등급만 | `openRiskStudentReport`에서만 호출 |
| 75 | `copyReportLegacy` | `report-text.js:345` | 보고 문구 편집·복사(본문 2열) | W 작업 화면 | 등급만 | `window.copyReport`가 이것(`:1447`) |
| 76 | `copyReport` | `report-text.js:1284` | 보고 문구(옛 정의) | F 폼 | 등급만 | `window.copyReport = copyReportLegacy`로 덮어써 실행 안 됨. 정리 후보 **삭제됨(정리 PR)** |
| 77 | `requestAiReport` | `report-text.js:1339` | AI 보고 문구 요청→결과 | F 폼 | 등급만 | 로딩→결과 2번 `showModal` |
| 78 | `openClassReportBatchModal` | `report-text.js:1201` | 반 전체 보고 문구 | W 작업 화면 | 등급만 | `buildClassReportBatchHtml`(자기 자신)에서만 호출. 정리 후보 **삭제됨(정리 PR)** |
| 79 | `openReportPreview` | `student.js:3133` | 리포트 미리보기 | F 폼 | 등급만 | 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 80 | `renderStudentExportModal` | `student-export.js:273` | 명단 출력 옵션 | F 폼 | 등급만 | `openAddressBook`에 버튼을 덧붙이는 래퍼(`student-export.js:322`) |
| 81 | `openDischargedStudents` | `student-edit.js:812` | 퇴원생 관리 목록(옛) | F 폼 | 등급만 | `dashboard-admin.js:218`이 같은 이름으로 덮어써 실행 안 됨. 정리 후보 **삭제됨(정리 PR)** |
| 82 | `openAdminOperationMenu` | `dashboard-admin.js:322` | 원장 관리 메뉴 | C 확인·선택 | 등급만 | 버튼 4 |
| 83 | `openAdminPinBatchModal` | `dashboard-admin.js:354` | PIN 일괄 배분 결과 | F 폼 | 등급만 |  |
| 84 | `openAdminStudentList` | `dashboard-admin.js:249` | 원장: 학생 목록(필터) | W 작업 화면 | 등급만 | 버튼 8 |
| 85 | `renderAdminStudentGradeModal` | `dashboard-admin.js:1165` | 원장: 학년별 학생 | F 폼 | 등급만 | 읽기 목록 |
| 86 | `renderAdminSimpleStudentList` | `dashboard-admin.js:1525` | 원장: 미배정·휴원 등 단순 목록 | F 폼 | 등급만 | 읽기 목록 |
| 87 | `renderAdminTeacherAllStudents` | `dashboard-admin.js:2379` | 원장: 선생님 전체 학생 | F 폼 | 등급만 | 읽기 목록 |
| 88 | `renderAdminTeacherStudents` | `dashboard-admin.js:2411` | 원장: 선생님 담당 학생 | F 폼 | 등급만 | 읽기 목록 |
| 89 | `openAdminTeacherlessClassList` | `dashboard-admin.js:1505` | 원장: 담당 미지정 반 | F 폼 | 등급만 | 읽기 목록. 반 관리로 이동 버튼(`:1518`) |
| 90 | `openAdminStudentConsultationHistory` | `dashboard-admin.js:1230` | 원장: 학생 상담 이력 | F 폼 | 등급만 | 읽기 목록 |
| 91 | `openAdminConsultationCenter` | `dashboard-admin.js:1295` | 원장: 상담 전체 보기 | W 작업 화면 | 등급만 | 이미 전용 1080×820(`dashboard-foundation.css:1379`) |
| 92 | `renderAdminJournalList` | `dashboard-admin.js:2200` | 원장: 일지 목록 | F 폼 | 등급만 | 읽기 목록 |
| 93 | `openAdminJournalFeedback` | `dashboard-admin.js:2237` | 원장: 일지 피드백 입력 | F 폼 | 등급만 |  |
| 94 | `openAdminRecentTeacherJournals` | `dashboard-admin.js:2286` | 원장: 최근 선생님 일지 | F 폼 | 등급만 | 읽기 목록 |
| 95 | `openPublicInquiryList` | `dashboard-admin.js:2772` | 공개 문의 목록 | F 폼 | 등급만 | 읽기 목록 |
| 96 | `renderBillingAccountingFoundationModal` | `management.js:2016` | 수납·회계(탭) | W 작업 화면 | 등급만 | 탭+표. 최대 높이 60vh |
| 97 | `openGlobalPinManagement` | `management.js:128` | PIN 관리: 반 고르기 | C 확인·선택 | 등급만 | 호출처 없음(의심). 정리 후보 **삭제됨(정리 PR)** |
| 98 | `openStudyMaterialWrongCenter / openStudyMaterialManage` | `study-material-wrong.js:531` | 교재 오답(준비·입력·보기 탭, 입력 27개) | P 전체 화면 | 등급만 | `render()`가 `showModal`. 표 최소 폭 520px(`:99`) |

## 3. 집계

| 등급 | 개수 |
|---|---|
| C 확인·선택 | 16 |
| F 폼 | 51 |
| W 작업 화면 | 25 |
| W 작업 화면(단열) | 4 |
| P 전체 화면 | 2 |
| 합계 | 98 |

| 묶음 | 소속 모달 수 | 이 중 정리 후보 |
|---|---|---|
| 숙제 | 7 | 2 |
| 선생님 계정 | 5 | 0 |
| 원내평가·OMR | 6 | 2 |
| 반·학생 관리 | 7 | 0 |
| 플래너 | 4 | 0 |
| 학생 상세 | 11 | 1 |
| 클리닉 | 7 | 0 |
| 진도·교재 | 5 | 3 |
| 등급만 | 46 | 9 |
| 합계 | 98 | 17 |

## 4. 호출 경로가 없거나 덮어쓰여 실행되지 않는 17종 (정리 후보, 의심)

방법: `apmath/js/*.js`, `apmath/index.html`, `apmath/*.html`, `tests/`에서 함수 이름 검색(호출 그래프를 함수 단위로 계산). `window[...]` 같은 동적 호출은 `lockId`·`stateKey`·`globalName`뿐이어서 모달 함수 이름을 만드는 곳은 찾지 못했다. 그래도 "의심"이다.

| 함수 | 사유 |
|---|---|
| `loadHomeworkPhotoLinksModal` (`classroom.js:1022`) | 자기 자신만 호출. 테스트가 숨김 고정 |
| `openHomeworkPhotoLinksModal` (`classroom.js:1036`) | 위 함수만 호출. 테스트가 숨김 고정 |
| `openExamScoreMenu` (`ui.js:841`) | 호출처 없음 |
| `openQrSubmitStatus` (`qr-omr.js:456`) | 자기 자신(`qr-omr.js:477`)만 호출. QR 생성기에 제출 현황으로 가는 버튼이 없다(시험명 칩 4개와 공유·복사뿐, `qr-omr.js:262-455`) |
| `openStudentParentManageModal` (`student.js:976`) | 호출처 없음. EIE 테스트가 기본 탭 노출을 금지 |
| `openTextbookManageModal` (`textbook.js:381`) | `returnToPreviousManagementView`의 `textbookManage` 분기로만 도달, 그 값은 옛 교재 모달 3종만 설정. 서랍은 `openGlobalTextbookManage`(`ui.js:888`) |
| `openAddTextbookModal` (`textbook.js:393`) | 위 옛 목록에서만 도달 |
| `openEditTextbookModal` (`textbook.js:469`) | 옛 목록(`groupAndSortBooks`)에서만 도달 |
| `openAttendanceMetaModal` (`classroom.js:619`) | 호출처 없음 |
| `openStudentActionSheetV4` (`classroom.js:1854`) | 호출처 없음 |
| `openSchoolExamRecordModal` (`cumulative.js:2231`) | 자기 자신(select onchange)만 호출 |
| `openTodayExamSetModal` (`dashboard.js:2154`) | 호출처 없음 |
| `copyReport` (`report-text.js:1284`) | `window.copyReport = copyReportLegacy`(`report-text.js:1447`)가 덮어씀 |
| `openClassReportBatchModal` (`report-text.js:1201`) | `buildClassReportBatchHtml` 안(자기 자신)에서만 호출 |
| `openReportPreview` (`student.js:3133`) | 호출처 없음 |
| `openDischargedStudents` (`student-edit.js:812`) | `dashboard-admin.js:218`이 나중에 로드(`index.html:1054` > `:1039`)되어 같은 이름을 덮어씀 |
| `openGlobalPinManagement` (`management.js:128`) | 호출처 없음 |

## 5. 껍데기(`#modal-overlay`)를 쓰지 않는 3종 (98종에 포함 안 됨)

| 화면 | 위치 | 비고 |
|---|---|---|
| 진단평가 오버레이 | `dashboard-admin.js:175` | 자체 오버레이 |
| 리포트 센터 넓은 오버레이 | `report-center.js:1808` | P 후보. 별도 계획서 필요 |
| 학부모 리포트 | `report-print.js:1128` | `#modal-body` 직접 채움. 인쇄 문서 |


## 결정 기록 (2026-11-02, 사용자)

- **보호자 연락처 화면은 정리 후보로 삭제한다.** `renderParentContactSection`과 그것만 부르는 `renderStudentContactHistoryTab`·`openStudentParentManageModal`(위 35번), 보호자 연락처 추가·수정·연락 설정·연락 이력 모달이 대상이다. 화면에서 닿는 입구가 없고(M6 작업 중 확인), 보호자 번호는 학생 수정 폼(`student-edit.js`)에서 고친다. 삭제는 정리 후보 삭제 PR에서 하고, 그때 `eie-timetable-student-profile-ap-parity.test.js`의 노출 금지 검사는 "구역 없음"으로 바뀌어도 의미가 유지되는지 확인한다. 이유: 사용자 결정 — 쓰지 않는 화면을 인라인으로 옮기는 것은 선생님에게 도움이 안 됨.
- 모달 통합 4묶음이 남긴 추가 정리 후보: `openExamScoreMenu`(ui.js), `openQrSubmitStatus`(qr-omr.js), 옛 교재 모달 3종(지금은 교재 관리 모드 래퍼), `openClassAttendance`·`openClassHomework`·`openClassroomMoreMenu`(classroom.js), `openParentReport`(report-print.js), `renderAdminStudentSearch`(dashboard.js), `student-edit.js`의 `openDischargedStudents`(dashboard-admin.js 정의에 덮임).

## 정리 PR 결과 (2026-11-02)

삭제한 것(모두 호출처·동적 호출·다른 페이지 로드 없음 확인, 서버 API·worker 코드는 그대로):
- 보호자 연락처 화면 일체(`student.js`): 구역·관리 모달·연락처 추가/수정/삭제·연락 설정·연락 이력과 보조 함수·상수. 보호자 번호는 학생 수정 폼에서 고친다. 데이터 불러오기(`ensureStudentParentContactDataLoaded` 등)는 학생 상세를 열 때 미리 부르는 코드라 그대로 둠(별도 판단).
- `openExamScoreMenu`, `openQrSubmitStatus`(+`computeQrSubmitStatus`, `findExamQuestionCount`), 옛 교재 모달 3종과 `returnToPreviousManagementView`의 `textbookManage` 분기(그 값을 만드는 곳이 없음).
- `openClassAttendance`, `openClassHomework`, `openClassroomMoreMenu`(+`renderClassroomMoreButton`), `openAttendanceMetaModal`(+`saveAttendanceMeta`), `openStudentActionSheetV4`, `handleBatchGeneratePins`(PIN 관리 모달 전용; 원장 전체 배분 `openAdminPinBatchModal`은 그대로).
- `report-print.js`의 `openParentReport`(+`showParentReportModal`, `saveParentReportImage`, `buildReportCardNextPoint`), `renderAdminStudentSearch`, `student-edit.js`의 `openDischargedStudents`(+CSS `.apms-discharged-student-row`).
- `openSchoolExamRecordModal`(+`saveSchoolExamRecord`, `deleteSchoolExamRecord`), `openTodayExamSetModal`(+`handleSetTodayExam`, `clearTodayExamConfig`; `getTodayExamConfig`·`setTodayExamConfig`는 QR 생성기가 씀), `copyReport`(옛 정의, `window.copyReport = copyReportLegacy`가 덮음), `openClassReportBatchModal` 묶음(`buildClassReportBatchHtml`, `copyClassStudentReport`, `copyAllClassReports`, `getClassReportStudents`, `makeClassReportTextId`), `openReportPreview`, `openGlobalPinManagement`.

보류:
- `loadHomeworkPhotoLinksModal`, `openHomeworkPhotoLinksModal`(6·7행): "링크·QR 버튼 숨김"은 사용자가 정한 것이고 `homework-assignment-save-only.test.js`가 이 함수를 경계로 쓴다. 기능을 되살릴지 지울지 사용자 결정이 필요하다.
- `loadHtml2CanvasOnce`(`core.js`): 학부모 리포트 이미지 저장이 지워져 쓰는 곳이 없어졌지만 vendor 로더 3종(xlsx/chart/html2canvas) 한 벌이라 그대로 둠.
- `getSchoolExamRecordForCell`(`cumulative.js`): 이번 삭제와 무관하게 이미 호출처 없음. 다음 정리에서.
