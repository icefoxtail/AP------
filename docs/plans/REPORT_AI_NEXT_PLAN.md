# REPORT_AI_NEXT_PLAN

## 1. 현재 상태

`apmath/index.html`의 `report-text.js`, `report-center.js`, `report-print.js`, `student.js`, Worker의 `routes/reports-ai.js`, `report-ai-proxy`가 리포트/상담 AI 흐름을 구성한다.

평가 리포트의 전체 통계는 같은 연도에 같은 `archive_file` 시험지를 본 같은 학년 전체 cohort 기준으로 보정되어 있으며, teacher 권한에서는 개인정보 목록 대신 `initial-data.report_exam_cohort_stats` summary를 사용한다. `archive_file`이 없으면 제목+날짜+문항 수, 제목+날짜 순서로 fallback한다.

### 1-1. 2026-08-24 cohort 검증 상태

정적·로직 검증은 완료했다. Worker 실제 함수 본문에서 archive 연도·학년 scope, 학년 fallback, session dedupe, rank, questionStats, identity fallback을 확인했고, report 관련 DOM/렌더·분석 테스트 31개가 통과했다. plain Node direct import는 `cloudflare:workers` loader 제약이지만 해당 모듈만 loader stub으로 매핑하면 기존 Worker 테스트가 통과하며, 실제 `index.js` `/api/initial-data` fetch도 mock D1에서 cohort payload를 반환했다. local `file://` 브라우저 접근은 정책상 차단됐지만 로컬 HTTP에서 대표 archive의 exam/sol/ans smoke를 통과했고, production live read-only에서 cohort 5명·평균 78점·반 평균 78점을 확인했다. `initial-data`의 blueprint 미전달과 report center lazy loader 미호출을 원인으로 판정해 archive-scoped lazy load·refresh 보정을 넣고 핵심 회귀 4개를 재실행했다. Wrangler 설정에 별도 `env.staging`은 없으며, 실제 staging payload는 target 확보 후 재확인한다.

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
6. 같은 연도/같은 시험지/같은 학년 cohort summary 회귀 검수 (정적·mock D1·로컬 HTTP archive smoke·production summary·blueprint lazy-load 경로 보정 완료, 별도 staging target 확인 대기)

## 5. 작업 후 업데이트 문서

`REPORT_AI_DOMAIN.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`
