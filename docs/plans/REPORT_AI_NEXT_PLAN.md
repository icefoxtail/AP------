# REPORT_AI_NEXT_PLAN

## 1. 현재 상태

`report.js`, `student.js`, `reports-ai.js`, `report-ai-proxy`가 리포트/상담 AI 흐름을 구성한다.

평가 리포트의 전체 통계는 같은 `archive_file` 시험지를 본 같은 학년 전체 cohort 기준으로 보정되어 있으며, teacher 권한에서는 개인정보 목록 대신 `initial-data.report_exam_cohort_stats` summary를 사용한다. `archive_file`이 없으면 제목+날짜+문항 수, 제목+날짜 순서로 fallback한다.

## 2. 최종 목표

학부모에게 안전한 문장, 선생님 메모 반영, 오답 분석, provider fallback을 안정화한다.

## 3. 절대 금지/보류

- 내부 시스템 표현 노출 금지
- 기본 리포트 전면 교체 금지
- AI 실패 시 전체 리포트 실패 금지

## 4. Phase 구조

1. 현재 payload/response 실사
2. 학부모 문구 금지 표현 목록
3. fallback 정규화
4. archive/mixed question detail 검수
5. print/PDF 검수
6. 같은 시험지/같은 학년 cohort summary 회귀 검수

## 5. 작업 후 업데이트 문서

`REPORT_AI_DOMAIN.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`
