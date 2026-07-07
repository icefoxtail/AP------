# CODEX LOOP 9 - 학교시험 상세 리포트 실제 문제 출력 완성

> 작성일: 2026-07-03  
> 대상: `apmath/js/report-center.js`, 관련 테스트  
> 목표: 학교시험 학생별 상세 리포트가 실제 오답 문제 원문/보기/정답/해설/문항분석을 포함하고, 화면 미리보기와 출력 경로가 같은 상세 리포트 레이어를 사용하게 한다.

---

## 1. 배경

Loop 8에서 학교시험 분석 화면을 상담 업무 흐름에 맞게 재배치하고 `상세 학부모 리포트` / `간단 리포트` 레이어를 분리했다. 다만 상세 리포트의 문항 원문은 캐시가 이미 있을 때만 자연스럽게 채워지고, 출력 버튼은 기존 평가 리포트 출력 경로를 그대로 사용한다.

이번 루프는 기존 archive detail fetch/cache를 재사용하되, 학교시험 상세 리포트 전용 출력 경로를 추가한다.

---

## 2. 구현 범위

### 2.1 상세 리포트 문항 병합

- `reportCenterBuildQuestionReviewCardsForReport()`가 이미 `data.archiveDetails`를 통해 원문/보기/정답/해설을 병합한다.
- 상세 리포트 함수가 `options.archiveDetails`를 받아 캐시 여부와 무관하게 병합된 data를 만들 수 있게 한다.
- 오답이 없는 학생은 문제 카드 대신 전 문항 정답 안내와 다음 확장 계획을 출력한다.

### 2.2 학교시험 상세 리포트 출력 전용 경로

- 신규 함수:
  - `reportCenterBuildSchoolExamDetailedPrintDocument(studentId, sessionId, options = {})`
  - `reportCenterOpenSchoolExamDetailedPrintView(studentId, sessionId, event = null)`
- 출력 버튼은 기존 평가 리포트 출력이 아니라 학교시험 상세 리포트 전용 출력 문서를 연다.
- 출력 직전 `reportCenterFetchArchiveQuestionDetails(session)`를 호출해 문항 원문 캐시를 선로딩한다.

### 2.3 화면 선로딩

- 학생별 화면 진입 시 `data.archiveDetails`가 없으면 조용히 `reportCenterPreloadArchiveQuestionDetails(...)`를 호출하도록 marker/render 훅을 둔다.
- 선로딩 실패 시에도 오답 번호/정답률/저장 분석 기반 상세 리포트가 유지되어야 한다.

---

## 3. 제외 범위

- 프리미엄 AI 이식
- DB 컬럼 확장
- 모든 문항(맞힌 문항 포함) 전체 출력
- 외부 아카이브 파일이 없는 경우의 원문 복원

---

## 4. 검증 계획

- 문법 검사:
  - `node --check apmath/js/report-center.js`
- 관련 테스트:
  - `node tests/report-center-student-view.test.mjs`
  - `node tests/report-school-exam-counsel.test.mjs`
  - `node tests/apmath-report-center-unified-entry.test.mjs`
  - `node tests/report-archive-image.test.mjs`
- 신규/갱신 계약:
  - 상세 리포트가 archive detail 옵션으로 문항/보기/정답/해설을 렌더
  - 학생 화면 출력 버튼이 `reportCenterOpenSchoolExamDetailedPrintView`를 호출
  - 학교시험 상세 출력 문서가 `상세 학부모 리포트`와 `인쇄/PDF 저장`을 포함

---

## 5. 결과 기록

| 항목 | 상태 |
|------|------|
| 상세 리포트가 `archiveDetails` 옵션을 받아 원문/보기/정답/해설을 병합 | 완료 |
| `reportCenterBuildSchoolExamDetailedPrintDocument` 추가 | 완료 |
| `reportCenterOpenSchoolExamDetailedPrintView` 추가 | 완료 |
| 학생별 화면 출력 버튼을 학교시험 상세 출력 전용 경로로 연결 | 완료 |
| 학생별 화면 진입 시 archive question detail 조용한 선로딩 marker/hook 추가 | 완료 |
| 오답 없는 학생의 상세 리포트 안내 유지 | 완료 |

검증:

- `node --check apmath/js/report-center.js` PASS
- `node tests/report-school-exam-counsel.test.mjs` PASS
- `node tests/report-center-student-view.test.mjs` PASS
- `node tests/apmath-report-center-unified-entry.test.mjs` PASS
- `node tests/report-archive-image.test.mjs` PASS
- `node tests/report-center-exam-dashboard.test.mjs` PASS
- `node tests/report-school-exam-edit.test.mjs` PASS
- `node tests/exam-question-review-card.test.mjs` PASS
- `node tests/report-center-shell.test.mjs` PASS

남은 범위:

- 학교시험 상세 리포트 전용 출력 CSS를 더 촘촘히 다듬는 작업
- 다중 학생 일괄 출력도 학교시험 상세 리포트 전용 문서로 전환하는 작업
- 프리미엄 분석을 archive/student 단위로 이식하는 작업
