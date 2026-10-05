# CODEX LOOP 10 - 학교시험 일괄 출력 상세 리포트 전환

> 작성일: 2026-07-04  
> 대상: `apmath/js/report-center.js`, 관련 테스트  
> 목표: 반별 학생 선택 후 여러 명을 이어서 출력할 때도 기존 평가 리포트가 아니라 학교시험 상세 리포트 전용 문서를 사용한다.

---

## 1. 배경

Loop 9에서 단일 학생 `상세 리포트 출력`은 학교시험 상세 리포트 전용 출력 경로로 분리됐다. 하지만 반별 학생 선택 화면의 `선택 학생 리포트 이어서 출력`은 아직 `reportCenterBuildCleanPdfDocument()` 기반 평가 리포트를 반복 출력한다.

이번 루프는 일괄 출력도 단일 학생과 같은 상세 리포트 레이어를 사용하게 맞춘다.

---

## 2. 구현 범위

- `reportCenterBuildBatchPrintDocument(items, options = {})`
  - 기본은 학교시험 상세 리포트 문서 반복으로 전환
  - `options.reportKind === 'legacyExam'`일 때만 기존 평가 리포트 반복을 유지
- `reportCenterOpenBatchPrintView(...)`
  - async로 전환
  - 선택 학생별 archive question details를 출력 전 선로딩
  - 각 학생 문서에 `archiveDetails`를 넘겨 문항 원문/보기/정답/해설 병합
- 기존 page break class `report-center-batch-page` 유지

---

## 3. 제외 범위

- 일괄 출력 편집 모드
- 학생별 프리미엄 분석 일괄 생성
- 출력 CSS 고도화

---

## 4. 검증 계획

- `node --check apmath/js/report-center.js`
- `node tests/apmath-report-center-unified-entry.test.mjs`
- `node tests/report-school-exam-counsel.test.mjs`
- `node tests/report-center-student-view.test.mjs`
- `node tests/report-center-mathjax-preview.test.mjs`

---

## 5. 결과 기록

| 항목 | 상태 |
|------|------|
| `reportCenterBuildBatchPrintDocument` 기본 출력 문서를 학교시험 상세 리포트로 전환 | 완료 |
| `legacyExam` 옵션으로 기존 평가 리포트 반복 출력 경로 보존 | 완료 |
| `reportCenterOpenBatchPrintView` async 전환 | 완료 |
| 선택 학생별 archive question details 출력 전 선로딩 | 완료 |
| 학생별 원문 로드 실패 시 해당 학생만 fallback 처리 | 완료 |
| 학부모 상세 리포트 문항 카드를 `원문 + 문항 분석` 중심으로 축소 | 완료 |
| surface fixture 갱신 | 완료 |

검증:

- `node --check apmath/js/report-center.js` PASS
- `node tests/apmath-report-center-unified-entry.test.mjs` PASS
- `node tests/report-school-exam-counsel.test.mjs` PASS
- `node tests/report-center-student-view.test.mjs` PASS
- `node tests/report-center-mathjax-preview.test.mjs` PASS
- `node tests/report-center-exam-dashboard.test.mjs` PASS
- `node tests/report-school-exam-edit.test.mjs` PASS
- `node tests/report-archive-image.test.mjs` PASS
- `node tests/report-center-shell.test.mjs` PASS
- `node tests/apmath-global-surface.test.js` PASS
- `git diff --check` PASS

검수 중 보강:

- 다른 작업에서 추가된 archive preload 후 재렌더 로직에 race 가드를 추가했다. 선로딩 완료 시 현재 모달이 여전히 같은 학생/세션을 보고 있을 때만 재렌더한다.

남은 범위:

- 학교시험 상세/일괄 출력 전용 CSS 고도화
- 프리미엄 분석을 시험지 단위 문항 분석 생성까지 확장
- 학생별 프리미엄 분석 일괄 생성 버튼
