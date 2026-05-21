# 02_SYSTEM_ARCHITECTURE

## 1. 구조 결론

왕지교육 OS는 AP Math OS를 갈아엎는 프로젝트가 아니다.

```text
왕지교육 OS = 상위 운영층
AP Math OS = 기존 핵심 모듈 유지
씨매쓰 초등 = 신규 학원 모듈
EIE 영어학원 = 신규 학원 모듈
```

## 2. 현재 확인한 실제 경로

- frontend 핵심: `apmath/index.html`, `apmath/app.js`, `apmath/js/*.js`
- 학생 포털: `apmath/student/index.html`
- 플래너: `apmath/planner/index.html`
- 숙제 사진 제출: `apmath/homework/index.html`
- OMR/check: `check/index.html`, `check/check.js`
- archive/mixed engine: `archive/engine.html`, `archive/mixed_engine.html`
- Worker: `apmath/worker-backup/worker/index.js`
- Worker routes: `apmath/worker-backup/worker/routes/*.js`
- DB schema: `apmath/worker-backup/worker/schema.sql`
- migrations: `apmath/worker-backup/worker/migrations/*.sql`
- Worker config: `apmath/worker-backup/worker/wrangler.jsonc`
- report AI proxy: `report-ai-proxy/api/report-analysis.js`

## 3. 계층

| 계층 | 역할 | 확인된 파일 |
|---|---|---|
| AP Math 운영 UI | 선생님/관리자 운영 화면 | `apmath/index.html`, `apmath/js/core.js`, `dashboard.js`, `classroom.js`, `student.js`, `management.js` |
| 학생/학부모 접점 | 학생 포털, 플래너, 숙제 사진, OMR | `apmath/student/index.html`, `apmath/planner/index.html`, `apmath/homework/index.html`, `check/check.js` |
| 문제/OMR/리포트 | archive, mixed engine, report center, AI 분석 | `archive/*.html`, `apmath/js/qr-omr.js`, `apmath/js/report.js`, `routes/reports-ai.js` |
| Worker API | 인증, initial-data, 도메인 route 위임 | `apmath/worker-backup/worker/index.js`, `routes/*.js` |
| DB/Foundation | D1 schema와 migration | `schema.sql`, `migrations/*.sql` |
| AI proxy | 외부 AI report proxy | `report-ai-proxy` |

## 4. 공통 운영층

공통 운영층은 다음 기능을 foundation으로 가진다.

- 학생/반/수강/enrollment
- 시간표 staging/version/conflict
- 수납/청구/결제/출납/회계
- 학부모 연락처/동의/message log
- 상담/운영 메모/학원 일정/시험 일정
- 직원/권한/감사/개인정보 접근 로그

## 5. 학원별 특화 기능

- AP Math: 문제은행, archive engine, OMR, QR, 리포트, 플래너, classroom, 교재 오답, 기존 바닐라 JS 운영 화면
- 씨매쓰 초등: 아직 구체 구현 확인 필요. 공통 학생/반/수납/상담 foundation을 재사용하는 방향이다.
- EIE 영어학원: 아직 구체 구현 확인 필요. 공통 운영층 위의 학원별 특화 기능으로 분리한다.

## 6. 신규 SaaS/상위 운영층과 기존 APMS

기존 APMS는 독립 실행 가능한 하위 앱/모듈로 보존한다. 상위 운영층은 기존 파일을 임의 개편하지 않고, 필요한 경우 foundation을 별도 route/UI로 단계적으로 연결한다.

