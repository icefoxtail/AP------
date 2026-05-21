# CLASS_DAILY_DOMAIN

## A. 정책

- 수업일지와 교재 진도는 선생님 현장 흐름을 우선한다.
- 기존 일지 문구와 결재/피드백 흐름을 임의 변경하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/classroom.js`, `apmath/js/dashboard.js`
- route: `routes/class-daily.js`, `routes/operations.js`
- DB: `daily_journals`, `class_textbooks`, `class_daily_records`, `class_daily_progress`

## C. 데이터/API 흐름

classroom은 반별 수업 기록과 교재 진도를 저장하고, dashboard는 일지 주간 matrix와 결재/피드백 흐름을 제공한다.

## D. 회귀 위험

- teacher_name scope 누락
- 일지 상태/결재 문구 변경
- class_daily_progress와 record_id 연결 누락

## E. 추가 계획

반별 진도/특이사항/선생님별 범위를 더 명확히 하고, dashboard 일지와 classroom 일지의 책임을 분리한다.

## F. 작업 후 업데이트 규칙

수업일지 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CLASS_DAILY_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

