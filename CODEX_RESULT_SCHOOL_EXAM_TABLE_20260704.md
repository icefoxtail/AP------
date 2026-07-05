# 학교시험 분석표 테이블화 · 영속 저장 결과

작성일: 2026-07-05
작업 브랜치: local `main`

## STEP별 결과

| STEP | 변경 요약 | 검증 |
| --- | --- | --- |
| STEP 1 | L1 단원/난도 분포가 `standard_unit`, `question_level`을 우선 보도록 보정. 상세 인쇄의 해석 칸은 학부모 안전 short 코멘트를 우선 사용. | `node tests/report-center-exam-dashboard.test.mjs`, 전체 회귀 |
| STEP 2 | 기존 문항 분석 카드 벽글을 `aprc-qtable` 표로 교체. 행 펼침, 오답 학생 반별 그룹, 우리 반 정답률/수업 보강 마커, AI 뱃지 추가. | `node tests/report-exam-analysis-table.test.mjs`, 전체 회귀 |
| STEP 3 | 표 기반 A4 인쇄/PDF 문서, 전 행 펼침 인쇄, 원문/지도 포인트 옵션, MathJax 프린트 셸 추가. | `node tests/report-exam-analysis-print.test.mjs`, 전체 회귀 |
| STEP 4 | D1 `exam_student_reports` migration, `exam_question_reviews` 구조화 컬럼, `exams/student-reports` GET/POST, 리뷰 JSON 컬럼 발췌 저장 추가. | `node --check apmath/worker-backup/worker/routes/exams.js`, `node --check apmath/worker-backup/worker/index.js`, 전체 회귀 |
| STEP 5 | 상담 수정본과 학생별 프리미엄 AI 결과를 서버에 동기화. 재진입 로드 시 서버본 우선, 실패 시 로컬 폴백 유지. | `node tests/report-student-report-sync.test.mjs`, 전체 회귀 |
| STEP 6 | 시험지 단위 AI payload/요청/응답 파싱/빈 문항만 upsert/총평 보존 정책/서버 저장 시도 추가. | `node tests/report-exam-archive-ai.test.mjs`, 전체 회귀 |
| STEP 7 | 23문항 하니스와 표/인쇄 HTML 덤프 생성. page-break 마커와 표 인라인 스타일 스캔 통과. | `reports/loop-b-analysis-table-harness.html`, `reports/loop-b-analysis-table-dump.html`, `reports/loop-b-analysis-print-dump.html` |

## 최종 실행 명령

```text
node --check apmath/worker-backup/worker/routes/exams.js
node --check apmath/worker-backup/worker/index.js
node tests/report-exam-archive-ai.test.mjs
node tests/report-student-report-sync.test.mjs
node tests/report-exam-analysis-print.test.mjs
node tests/report-exam-analysis-table.test.mjs
node tests/report-exam-trend.test.mjs
node tests/exam-question-review-card.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
node tests/report-center-shell.test.mjs
node tests/report-center-exam-hub.test.mjs
node tests/report-center-exam-dashboard.test.mjs
node tests/report-center-student-view.test.mjs
node tests/report-school-exam-counsel.test.mjs
node tests/report-school-exam-edit.test.mjs
node tests/report-archive-image.test.mjs
node tests/apmath-report-center-unified-entry.test.mjs
node tests/report-parent-safe-comment.test.mjs
node tests/report-math-normalize.test.mjs
node tests/report-review-schema.test.mjs
node tests/report-pdf-dedup.test.mjs
```

결과: 모두 통과.

## 남은 리스크 / 사람 확인 항목

- Cloudflare Worker 배포와 D1 migration 적용은 별도 수동 작업 필요.
- 실제 AI 호출 품질, 태그 적합성, 문항별 문장 톤은 실데이터로 사람 검수 필요.
- 하니스는 육안 검수용이며 실제 브라우저 PDF 페이지 경계는 배포 환경/브라우저 프린트 엔진에서 최종 확인 필요.
