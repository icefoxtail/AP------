# CODEX LOOP 8 - 리포트센터 학교시험 분석 메인화 1차 패치

> 작성일: 2026-07-03  
> 대상: `apmath/js/report-center.js`, `apmath/js/report-print.js`, 관련 테스트  
> 목표: 리포트센터의 학교시험 분석 화면을 실제 상담/출력 업무 흐름에 맞게 재배치한다.

---

## 1. 배경

리포트센터의 메뉴 순서는 이미 `학교시험 분석`을 1번으로 두고 있다. 다만 시험 상세 화면의 실제 배치는 아직 시험지 통계/문항 분석 대시보드 중심이다. 현장 사용 흐름은 시험지 전체 통계보다 `반 선택 -> 학생 선택 -> 학생별 상세 리포트/출력`이 먼저다.

이번 루프는 DB 확장이나 프리미엄 AI 이식까지 가지 않고, 기존 데이터와 렌더러를 재사용해 화면 흐름과 리포트 기본형을 먼저 바로잡는다.

---

## 2. 1차 패치 범위

### 2.1 시험 상세 화면 재배치

- 상단에는 시험명, 학교/학년, 총평을 한 줄 요약 카드로 유지한다.
- `반 선택`을 시험 상세의 최상단 작업 영역으로 올린다.
- `전체 응시자`를 상담 흐름용 `학생 선택` compact grid로 바꿔 반 선택 바로 아래에 둔다.
- 문항 분석 상태, 전체 정답률, 단원 분포, 난도 분포는 `시험 대시보드 보기` 접힘 영역으로 이동한다.

### 2.2 학생 카드 compact grid

- 학생 선택 화면의 세로 리스트를 compact grid로 변경한다.
- 데스크톱 기준 5열, 좁은 화면에서는 자동으로 2열 수준까지 줄어들도록 `repeat(auto-fit, minmax(...))` 기반으로 처리한다.
- 카드에는 시험명 반복을 제거하고 `체크박스 + 이름 + 점수/오답 + 보기`만 둔다.

### 2.3 상세/간단 리포트 레이어 분리

- 기존 `reportCenterBuildSchoolExamCounselReport()`는 수정/저장이 가능한 상담 편집 카드로 유지한다.
- 신규 상세 리포트 함수:
  - `reportCenterBuildSchoolExamDetailedParentReport(studentId, archiveFile)`
  - 실제 오답 문항 카드(`reportCenterBuildQuestionReviewCardsForReport`)를 기본 포함한다.
- 신규 간단 리포트 함수:
  - `reportCenterBuildSchoolExamSimpleParentReport(studentId, archiveFile)`
  - 카톡/짧은 상담용 문구를 한 장 요약으로 제공한다.
- 학생별 보기의 기본 노출 순서는 `상세 리포트 -> 간단 리포트 접힘 -> 상담 리포트 수정 카드 -> 선생님용 상세 분석`으로 둔다.

---

## 3. 제외 범위

- `exam_question_reviews` 컬럼 확장
- 프리미엄 AI payload/endpoint 신규 설계
- 학교시험 학생별 AI 저장 구조 추가
- 실제 API 배포 및 운영 DB migration

위 항목은 2차 이후 루프로 분리한다.

---

## 4. 검증 계획

- `node --check`로 `report-center.js`, `report-print.js` 문법 확인
- 기존 리포트센터 통합 테스트 실행
- 학교시험 상담 리포트 테스트 갱신 및 실행
- 신규 화면 문자열 계약 확인:
  - `시험 대시보드 보기`
  - `상세 학부모 리포트`
  - `간단 리포트`
  - compact grid 스타일

---

## 5. 결과 기록

| 항목 | 상태 |
|------|------|
| 시험 상세 화면에서 `반 선택`을 상단 작업 영역으로 이동 | 완료 |
| `학생 선택` compact grid를 시험 상세에 배치 | 완료 |
| 문항 분석/정답률/분포를 `시험 대시보드 보기` 접힘 영역으로 이동 | 완료 |
| 학생 선택 화면 카드 compact grid 전환 | 완료 |
| 학생 카드 시험명 반복 제거 | 완료 |
| `reportCenterBuildSchoolExamDetailedParentReport` 추가 | 완료 |
| `reportCenterBuildSchoolExamSimpleParentReport` 추가 | 완료 |
| 학생별 화면 기본 순서를 상세 리포트 중심으로 변경 | 완료 |
| 기존 상담 리포트 수정/저장 흐름 유지 | 완료 |

검증:

- `node --check apmath/js/report-center.js` PASS
- `node --check apmath/js/report-print.js` PASS
- `node tests/apmath-report-center-unified-entry.test.mjs` PASS
- `node tests/report-center-exam-dashboard.test.mjs` PASS
- `node tests/report-center-student-view.test.mjs` PASS
- `node tests/report-school-exam-counsel.test.mjs` PASS
- `node tests/report-school-exam-edit.test.mjs` PASS
- `node tests/exam-question-review-card.test.mjs` PASS
- `node tests/report-center-shell.test.mjs` PASS

남은 범위:

- 실제 문항 원문 자동 fetch를 상세 리포트 진입 시점에 선로딩하는 작업
- 프리미엄 분석을 학교시험 분석 archive/student 단위로 이식하는 작업
- `exam_question_reviews` 구조화 컬럼 확장 및 migration
