# REPORT_AI_DOMAIN

## A. 정책

- 기본 리포트를 갈아엎지 않는다.
- 학부모 문장에 내부 시스템 표현, 코드, DB 용어, 부정확한 진단을 노출하지 않는다.
- AI provider fallback이 있어도 결과 정규화와 fallback 품질을 검수한다.

## B. 현재 구현 구조

- frontend: `apmath/js/report.js`, `apmath/js/student.js` 상담 요약
- route: `routes/reports-ai.js`
- proxy: `report-ai-proxy/api/report-analysis.js`
- DB: `exam_sessions`, `wrong_answers`, `exam_blueprints`, `consultations`
- archive fetch: report center가 archive question bank를 fetch/parse하는 흐름 확인

## C. 데이터/API 흐름

report UI가 학생/시험/오답/teacherMemo context를 만들고 `ai/report-analysis` 또는 상담 요약 API를 호출한다. route는 Gemini/proxy/OpenAI/fallback 계열을 정규화해 응답한다.

## D. 회귀 위험

- 학부모 문장 시작/어조 품질 저하
- question text에 코드/HTML/내부 표현 노출
- AI 실패 시 화면 전체 실패
- archive/mixed question detail 매핑 깨짐

## E. 추가 계획

리포트 문구 품질 기준, provider fallback 정책, teacherMemo 반영 기준, 오답 분석 기준을 별도 검수 round로 보강한다.

## F. 작업 후 업데이트 규칙

리포트 변경 시 `CURRENT_API_FLOW_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `REPORT_AI_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

