# 학교시험 학부모 상세 리포트 고도화 결과

## 1. 작업 요약
- STEP 1: 학교시험 상세 출력 전용 shell/header/CSS를 분리하고 print mode 정리 함수를 추가했습니다.
- STEP 2: 학부모용 오답 문항 카드와 원문/선택지/해석/계획 구조를 추가했습니다.
- STEP 3: 문항별 학부모 상담 문장을 정답률, 오류 tag, 단원 키워드 기반으로 고도화했습니다.
- STEP 4: 학부모 상세 리포트 오답 문항을 쉬운 실수 3개 + 고난도 2개 중심으로 최대 5개만 노출하도록 제한했습니다.
- STEP 5: 학생 상세 화면에 문항 원문/서버 저장/AI 적용 상태 badge를 추가하고 저장 및 AI sync toast를 분리했습니다.
- STEP 6: HTML 하니스와 덤프 파일을 생성하고 전체 회귀 테스트를 통과시켰습니다.

## 2. 수정 파일
- apmath/js/report-center.js
- tests/report-school-exam-detail-print.test.mjs
- tests/report-parent-question-card.test.mjs
- tests/report-parent-question-narrative.test.mjs
- tests/report-school-exam-detail-report.test.mjs
- tests/report-school-exam-status-badges.test.mjs
- tests/report-student-report-sync.test.mjs
- tests/report-school-exam-edit.test.mjs
- tests/build-school-exam-parent-report-harness.mjs
- tests/fixtures/apmath-surface-report.json
- reports/loop-c-school-exam-parent-detail-dump.html
- reports/loop-c-school-exam-parent-print-dump.html

## 3. 개선된 사용 경험
- 출력 문서의 기존 평가 리포트 header 충돌을 제거했습니다.
- 학부모용 문항 카드에서 해석, 오답 의미, 다음 수업 계획이 실제 문항보다 먼저 보입니다.
- 쉬운 문항 오답은 계산/검산 실수로, 최상위 문항은 고난도 대비로 안내합니다.
- 오답이 많아도 PDF가 과도하게 길어지지 않도록 우선 5문항만 노출하고 나머지는 수업 확인 문구로 안내합니다.
- 학생 상세 화면에서 서버 저장본, 로컬 임시 저장, 문항 원문 로드, 프리미엄 분석 적용 여부를 바로 확인할 수 있습니다.

## 4. 검증 결과
- node tests/report-school-exam-detail-print.test.mjs: pass
- node tests/report-parent-question-card.test.mjs: pass
- node tests/report-parent-question-narrative.test.mjs: pass
- node tests/report-school-exam-detail-report.test.mjs: pass
- node tests/report-school-exam-status-badges.test.mjs: pass
- node tests/report-exam-archive-ai.test.mjs: pass
- node tests/report-student-report-sync.test.mjs: pass
- node tests/report-exam-analysis-print.test.mjs: pass
- node tests/report-exam-analysis-table.test.mjs: pass
- node tests/report-center-exam-dashboard.test.mjs: pass
- node tests/report-school-exam-counsel.test.mjs: pass
- node tests/report-school-exam-edit.test.mjs: pass
- node tests/report-parent-safe-comment.test.mjs: pass
- node tests/report-math-normalize.test.mjs: pass
- node tests/report-review-schema.test.mjs: pass
- node tests/report-pdf-dedup.test.mjs: pass
- node tests/apmath-global-surface.test.js: pass
- node --check apmath/js/report-center.js: pass
- node tests/build-school-exam-parent-report-harness.mjs: pass

## 5. 남은 리스크
- 실제 브라우저 PDF 인쇄 미리보기에서 긴 문항/이미지 포함 케이스는 추가 육안 확인이 필요합니다.
- AI 문항 분석 문장은 실제 운영 데이터로 학부모 톤을 한 번 더 샘플링하면 좋습니다.

## 6. 배포 전 확인
- Git status: main ahead of origin/main, CODEX_TASK.md는 작업 전부터 수정 상태로 남겨두었습니다.
- 최근 commit hash: git log 기준 최종 STEP 6 commit 확인
- main...origin/main: ahead 6, behind 0
