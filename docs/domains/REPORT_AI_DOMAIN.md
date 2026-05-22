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

리포트 평가 통계의 전체 기준은 담임/담당반이 아니라 같은 연도에 같은 `archive_file` 시험지를 본 같은 학년 전체 응시자 cohort다. `archive_file`이 없으면 `exam_title + exam_date + question_count`, 그다음 `exam_title + exam_date` 순서로 fallback한다. teacher 권한에서 전체 학년 학생 목록을 노출하지 않기 위해 `initial-data`는 `report_exam_cohort_stats` 통계 요약만 추가로 내려준다. cohort 집계는 학생 학년을 우선하고 반 학년은 fallback으로만 사용하며, 다중 반 연결로 같은 시험 세션이 여러 줄 조회되어도 `exam_sessions.id` 기준으로 한 번만 집계한다.

## D. 회귀 위험

- 학부모 문장 시작/어조 품질 저하
- question text에 코드/HTML/내부 표현 노출
- AI 실패 시 화면 전체 실패
- archive/mixed question detail 매핑 깨짐
- 같은 시험지를 여러 반이 본 경우 전체 평균/등수/문항 정답률이 담당반 기준으로 좁혀지는 회귀

## E. 추가 계획

리포트 문구 품질 기준, provider fallback 정책, teacherMemo 반영 기준, 오답 분석 기준을 별도 검수 round로 보강한다.

## F. 작업 후 업데이트 규칙

리포트 변경 시 `CURRENT_API_FLOW_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `REPORT_AI_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.
