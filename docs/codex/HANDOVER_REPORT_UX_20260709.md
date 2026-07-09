# 인수인계 — 리포트 센터 UI/UX 개선 (이어서)

작성일: 2026-07-09 · 대상: 새 세션에서 리포트 UI/UX 개선을 이어갈 담당
핵심 파일: `apmath/js/report-center.js` (7,500줄+). 프론트 전용, apmath 프론트(Cloudflare Pages) + 워커(별도) 구조.

## 0. 지금까지 한 일 (이번 세션, 워킹트리에 미커밋 상태)

지시서 1개에 Task A–F로 정리하고 대부분 구현·검수 완료.

- 지시서: `docs/codex/CODEX_TASK_REPORT_CENTER_ENTRY_AVG_UX_20260709.md`
- 결과: `docs/codex/CODEX_RESULT_REPORT_CENTER_ENTRY_AVG_UX_20260709.md`, `docs/codex/CLAUDE_RESULT_TASK_F_HUB_GRADE_GROUPING_20260709.md`

완료된 것:
- **A 진입 통합**: 오늘/평가/상담 리포트가 드릴다운 셸 안에서 열림. 학생 미선택 시 토스트 대신 인라인 학생 선택. `openReportCenterMenu`, `reportCenterBuildMenuBody`, `reportCenterBuildReportStudentPicker`, `reportCenterBuildReportContextBar`, `openReportCenterRefresh`.
- **B 고급보기 정리**: `고급 보기` → `상세 편집 도구`. 진입 라우팅 책임 제거, 편집/프리미엄 노출 게이팅만.
- **C 평균 전체화**: 대시보드/응시수 `report_exam_cohort_stats`(학원 전체) 우선 + `학원 전체`/`우리 반` 라벨. `reportCenterGetCohortStatForSession`, `reportCenterGetGroupCohortSummary`.
- **D**: 준비중 "시험지 찾기" 버튼 숨김(→ F에서 검색으로 부활).
- **E-1** 상세 리포트 2페이지 카드 레이아웃(테두리/라운드/`--parent` 강조).
- **E-2** 인쇄 러닝 푸터 "페이지 0"(`counter(page)` fixed) 제거.
- **E-3** 시험명 resolver `reportCenterResolveExamDisplayTitle`(아카이브 파일명 우선). 목록/대시보드/카드/`시험`필드/**학부모 본문·상담 요약·카톡 문구**까지 적용(학원명 오염 제거).
- **E-4** 평균 대비 라벨(`학원 전체`/`우리 반`).
- **E-6 부분**: 상세 리포트 `앞으로의 학습 방향`·`학부모님께` 인라인 수정/저장(`school_exam_detail`).
- **E-7/E-7b 부분**: 오답 카드 포함여부 + 요소별 on/off(`showContent/showAnswer/showComment/showMeta`) 저장(`school_exam_wrong_selection`).
- **F 시험지 목록 개편**: 기본 최근 1개월 학년 그룹 + 학년 필터 칩 + 심플 카드(상태 배지 제거) + 응시수 학원 전체(코호트) + 과거 검색(키워드/연/월, 결과는 연·월 그룹). `reportCenterRenderExamHubList` 재작성, helper 다수. Codex 검수 후 P1(날짜 fallback)·P2(허브 테스트 갱신) 수정 완료.

## 1. 남은 리포트 UI/UX 과제 (이 세션에서 이어서)

우선순위 순:

1. **E-5 점수바 시각 재설계 + 성취 구간별 톤** (미착수)
   - 문제: `reportCenterBuildScoreBar`가 본인 점수를 축 최대로 잡아 **만점/상위 학생은 전체·반 평균 바가 둘 다 꽉 차 동일하게** 보임(전체 82 vs 반 88 차이 안 보임).
   - 방향: 평균 대비를 `0~만점` 단일 축에 **평균선 마커 + 내 점수 마커**로, 또는 만점/상위 구간은 바 대신 `전체 +18 / 반 +12` 배지.
   - 톤: 만점/상위/중위/하위 성취 구간별 문구 분기(만점 학생에게 방어적 마무리 넣지 않기). 메모: 가정 지도 제안 금지, 학원 책임 강조.

2. **E-6 완성 — 전 카드 편집 UX 단일화** (부분만 됨)
   - 아직: 요약 카드 `핵심 진단`·`담임 총평` 인라인 편집 없음. 상세는 학습방향/학부모만.
   - 목표: 화면에서 보는 모든 리포트 카드(요약·상세·상담)를 그 자리에서 수정/저장, 저장본이 출력·일괄출력·카톡까지 일관 반영. 상담 리포트의 `data-report-*-field`+수정/저장 패턴을 요약 카드로 확장. 저장 타입 분리 유지(`school_exam_detail`/`school_exam_wrong_selection`/counsel).
   - 검토: 저장본 우선순위(저장본 > 프리미엄 AI > 기본)가 출력/일괄/카톡에서 실제로 반영되는지 회귀로 못박기.

3. **일관성·품질 점검**
   - 카드 편집 진입 UX(수정 버튼 위치/톤) 통일, `no-print` 처리 확인.
   - E-7 요소 토글이 인쇄물·일괄출력에도 반영되는지.

4. **C-2 코호트 데이터 실충전 확인** (프론트는 fallback 안전 동작 중)
   - 브라우저/네트워크로 `initial-data` 응답의 `report_exam_cohort_stats`가 school-exam 세션에 실제로 채워지는지 확인. 안 채워지면 워커 `buildReportExamCohortStats` 원인 규명 → **커밋만, 배포는 원장 지시 대기**(메모: apmath 배포 토폴로지).

## 2. 작업 규칙 / 함정

- **테스트**: 리포트센터 테스트는 전부 `.mjs`(vm 로딩), 개별 실행. `tools/run-tests.js`는 `.test.js`만 수집하므로 `.mjs`는 여기 안 잡힘(정상). 관련: `report-center-*.test.mjs`, `report-school-exam-counsel.test.mjs`, `report-center-hub-grade-grouping.test.mjs`.
- **전역 표면 가드**: 새 전역 함수 추가 시 `node tests/apmath-global-surface.test.js --update` 후 diff로 report fixture만 바뀌는지 확인. `apmath-onclick-defined.test.js`도 통과 유지.
- **전체 스위트 baseline**: `node tools/run-tests.js` = 88/94. 실패 6개(archive/assessment/classroom/worker/student-portal)는 **기존 실패, 무관**. stash로 baseline 대조해 확인됨.
- **리포트 문구 톤**(메모): 가정 지도 제안 금지, 학원이 책임지고 진행 강조. 추이는 토글로만.
- **PDF page-break**(메모): 섹션/문구가 페이지 경계에서 쪼개지면 안 됨 — 인쇄 CSS 변경 시 최우선 검수.
- **브라우저 E2E**: apmath는 워커+인증+실데이터라 로컬 프리뷰로 검증 어려움. Node/VM 회귀로 대체(이전 라운드들도 동일).
- 파일이 크므로 helper 추가/부분 수정 우선, 광범위 리팩터 금지. inline style 패턴·`.aprc-*` 클래스 재사용.

## 3. 핵심 함수 위치(대략)

- 진입/셸: `openReportCenterModal`, `openReportCenterMenu`, `reportCenterBuildDrilldownShell`, `reportCenterInternalMenuHtml`.
- 출력 문서: `reportCenterBuildSchoolExamDetailedPrintDocument`(요약페이지 `reportCenterBuildSchoolExamPrintSummaryPage` + 상세 `reportCenterBuildSchoolExamDetailedParentReport`).
- 점수바: `reportCenterBuildScoreBar` (E-5 대상).
- 카드 편집: 상담 `reportCenterBuildSchoolExamCounselReport`+`reportCenterSaveSchoolExamCounselReport`(패턴 참고), 상세 `reportCenterSaveSchoolExamDetailReport`.
- 오답 카드: `reportCenterBuildParentWrongQuestionCard`(showContent/Answer/Comment/Meta).
- 시험명: `reportCenterResolveExamDisplayTitle`. 평균/코호트: `reportCenterGetGroupCohortSummary`.
- 시험지 목록: `reportCenterRenderExamHubList` / `reportCenterBuildExamHubList`.

## 4. 시작 방법

새 세션 첫 액션 권장: 위 지시서/결과 문서 3개를 읽고, E-5(점수바)부터 착수. 목업이 필요하면 visualize로 먼저 보여주고 원장 확인 후 구현. 구현 후 관련 `.mjs` 회귀 + surface/onclick + `node --check` 돌리고 결과 문서에 기록.
