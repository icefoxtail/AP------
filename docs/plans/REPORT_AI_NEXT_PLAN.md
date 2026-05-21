# REPORT_AI_NEXT_PLAN

## 1. 현재 상태

`report.js`, `student.js`, `reports-ai.js`, `report-ai-proxy`가 리포트/상담 AI 흐름을 구성한다.

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

## 5. 작업 후 업데이트 문서

`REPORT_AI_DOMAIN.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`

