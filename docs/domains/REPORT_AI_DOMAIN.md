# REPORT_AI_DOMAIN

## A. 정책

- 기본 리포트를 갈아엎지 않는다.
- 학부모 문장에 내부 시스템 표현, 코드, DB 용어, 부정확한 진단을 노출하지 않는다.
- AI provider fallback이 있어도 결과 정규화와 fallback 품질을 검수한다.

## B. 현재 구현 구조

- frontend: `apmath/index.html`이 `apmath/js/report-text.js` → `apmath/js/report-center.js` → `apmath/js/report-print.js`를 로드하며, 학생 상담 요약은 `apmath/js/student.js`가 담당한다.
- route: `routes/reports-ai.js`
- proxy: `report-ai-proxy/api/report-analysis.js`
- DB: `exam_sessions`, `wrong_answers`, `exam_blueprints`, `consultations`
- archive fetch: report center가 archive question bank를 fetch/parse하는 흐름 확인

## C. 데이터/API 흐름

report UI가 학생/시험/오답/teacherMemo context를 만들고 `ai/report-analysis` 또는 상담 요약 API를 호출한다. route는 Gemini/proxy/OpenAI/fallback 계열을 정규화해 응답한다.

리포트 평가 통계의 전체 기준은 담임/담당반이 아니라 같은 연도에 같은 `archive_file` 시험지를 본 같은 학년 전체 응시자 cohort다. `archive_file`이 없으면 `exam_title + exam_date + question_count`, 그다음 `exam_title + exam_date` 순서로 fallback한다. teacher 권한에서 전체 학년 학생 목록을 노출하지 않기 위해 `initial-data`는 `report_exam_cohort_stats` 통계 요약만 추가로 내려준다. cohort 집계는 학생 학년을 우선하고 반 학년은 fallback으로만 사용하며, 다중 반 연결로 같은 시험 세션이 여러 줄 조회되어도 `exam_sessions.id` 기준으로 한 번만 집계한다.

## C-1. 2026-08-24 cohort 검증 결과

- Worker cohort 함수는 실제 `index.js` 본문을 임시 실행 컨텍스트에서 검증했다. `archive_file + examYear + 학년`, 학생 학년 우선/반 학년 fallback, `exam_sessions.id` dedupe, rank, questionStats, 제목·날짜 fallback이 모두 기대값과 일치했다.
- report 관련 DOM/렌더·분석 테스트 31개가 모두 통과했다. `classAverage`는 cohort 전체 평균과 분리된 반 기준 값으로 유지된다.
- plain Node direct import는 `cloudflare:workers` loader 제약으로 막히지만, 해당 모듈만 loader stub으로 매핑한 실행에서는 기존 `tests/report-cohort-stats-worker.test.mjs`가 통과했다. 같은 loader로 실제 `index.js`의 `/api/initial-data` fetch를 mock D1에 연결해 `grade_archive_year`, 평균 82, cohort 3명, 3번 문항 오답 2명·정답률 33% payload도 확인했다.
- local `file://` 브라우저 접근은 Browser URL 정책에 의해 차단됐지만, 로컬 HTTP(`127.0.0.1:4173`)로 archive 엔진을 열어 `26_금당고_1학기_기말_고2_대수`의 exam/sol/ans를 확인했다. 표시 문항·정답 수는 21개로 DB `qCount=21`과 일치했고, 해설 21개 비공란·exam 이미지 6개 로드·수평 overflow·visible 오류·console error/warning 0건이었다. `wrangler.jsonc`에 `env.staging`이 없어 production endpoint를 staging으로 대체하지 않았지만, 기존 로그인 세션의 production live read-only에서 cohort 5명·전체 평균 78점·반 평균 78점을 확인했다. 같은 시험의 문항분석은 `0/-`·`분석 대기`·블루프린트 없음으로 남아 있다.
- 위 production 상태의 원인은 `initial-data`가 `report_exam_cohort_stats`만 반환하고 `exam_blueprints`는 반환하지 않으며, report center 시험 dashboard가 기존 `ensureBlueprintsForSessions`를 호출하지 않은 경로로 판정했다. `report-center.js`에 archive-scoped blueprint lazy-load, empty 응답 재요청 방지, 현재 navigation scope 확인 후 refresh를 추가했고 `node --check` 및 핵심 회귀 4개가 통과했다. 별도 staging target은 아직 없다.

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
