# 00_READ_ME_FIRST

이 문서는 AP Math OS / 왕지교육 OS 작업자가 가장 먼저 읽는 진입 문서다.

이번 문서 체계는 기존 AP Math 운영 자산을 보존하면서 왕지교육 상위 OS를 추가하기 위한 작업 순서를 고정한다. 기능 구현자는 정책, 도메인, 현재 구현 상태, 다음 계획, Codex 실행 규칙을 순서대로 확인한 뒤에만 작업한다.

## 1. 최상위 원칙

- AP Math OS는 갈아엎지 않고 왕지교육 OS의 핵심 모듈로 유지한다.
- 왕지교육 OS는 AP Math, 씨매쓰 초등, EIE 영어학원을 함께 얹는 상위 운영층이다.
- 이미 존재하는 DB/API/foundation이 있어도 사용자 승인 없이 UI에 노출하지 않는다.
- 기존 UI 문구, 버튼명, 화면명, 메뉴명, 운영 용어는 사용자가 명시하지 않으면 바꾸지 않는다.
- 학생 포털은 시험지 직접 열기를 제공하지 않고, OMR 제출 완료 후 수정/재입력/재제출을 제공하지 않는다.
- 수납, 출납, 학부모 연락, 권한, 감사, 원장/admin 기능은 foundation 우선이며 UI 노출은 별도 승인 사항이다.
- 코드, DB, Worker route, frontend를 수정한 작업은 반드시 관련 문서를 업데이트한다.

## 2. 전체 읽기 순서

1. `docs/00_READ_ME_FIRST.md`
2. `docs/01_PROJECT_POLICY.md`
3. `docs/02_SYSTEM_ARCHITECTURE.md`
4. `docs/03_DOMAIN_INDEX.md`
5. 작업 도메인 문서: `docs/domains/*.md`
6. 현재 구현 상태 문서: `docs/implemented/*.md`
7. 다음 계획 문서: `docs/plans/*.md`
8. Codex 실행 문서: `docs/codex/*.md`
9. 기존 기준 문서: `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`, `docs/WANGJI_OS_STRUCTURE.md`, `docs/WANGJI_OS_ROADMAP.md`

## 3. 작업 유형별 최소 4문서 규칙

| 작업 유형 | 반드시 읽을 문서 |
|---|---|
| 시간표 | `01_PROJECT_POLICY.md`, `domains/TIMETABLE_DOMAIN.md`, `implemented/CURRENT_FRONTEND_MAP.md`, `plans/TIMETABLE_NEXT_PLAN.md` |
| 수납/출납 | `01_PROJECT_POLICY.md`, `domains/BILLING_ACCOUNTING_DOMAIN.md`, `implemented/CURRENT_DB_MAP.md`, `plans/BILLING_ACCOUNTING_NEXT_PLAN.md` |
| 리포트/AI | `01_PROJECT_POLICY.md`, `domains/REPORT_AI_DOMAIN.md`, `implemented/CURRENT_API_FLOW_MAP.md`, `plans/REPORT_AI_NEXT_PLAN.md` |
| 학생 포털 | `01_PROJECT_POLICY.md`, `domains/STUDENT_PORTAL_DOMAIN.md`, `implemented/CURRENT_AUTH_PERMISSION_MAP.md`, `plans/STUDENT_PARENT_PORTAL_NEXT_PLAN.md` |
| OMR/아카이브 | `01_PROJECT_POLICY.md`, `domains/ARCHIVE_OMR_DOMAIN.md`, `implemented/CURRENT_REGRESSION_RISK_MAP.md`, `plans/ARCHIVE_OMR_NEXT_PLAN.md` |
| 반 화면 | `01_PROJECT_POLICY.md`, `domains/CLASSROOM_DOMAIN.md`, `implemented/CURRENT_FRONTEND_MAP.md`, `plans/CLASSROOM_NEXT_PLAN.md` |
| 학생/반 관리 | `01_PROJECT_POLICY.md`, `domains/STUDENTS_CLASSES_DOMAIN.md`, `implemented/CURRENT_WORKER_ROUTE_MAP.md`, `plans/TEACHER_MODE_NEXT_PLAN.md` |
| 학부모 연락 | `01_PROJECT_POLICY.md`, `domains/PARENT_CONTACT_DOMAIN.md`, `implemented/CURRENT_HIDDEN_FOUNDATION_MAP.md`, `plans/PARENT_CONTACT_NEXT_PLAN.md` |
| 문서 작업 | `00_READ_ME_FIRST.md`, `08_DOCUMENT_UPDATE_RULE.md`, `codex/CODEX_DOC_UPDATE_CHECKLIST.md`, `codex/CODEX_RESULT_RULE.md` |

## 4. 구현 전 금지 사항

- 작업 전 `git status --short`와 작업 범위를 확인한다.
- 지시받지 않은 코드, UI, DB, migration, Worker route를 수정하지 않는다.
- 기존 dirty 파일을 정리하거나 되돌리지 않는다.
- route 본문을 `index.js`에 직접 크게 추가하지 않는다. route 파일 분리를 우선한다.
- 검수요청서, 외부감사용 문서, 커밋, push, deploy는 사용자가 명시하지 않으면 하지 않는다.

## 5. 작업 후 업데이트 규칙

- DB/schema/migration 변경: `implemented/CURRENT_DB_MAP.md`, 해당 domain, 해당 plan, `CODEX_RESULT.md`
- Worker route 변경: `implemented/CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_API_FLOW_MAP.md`, 해당 domain, `CODEX_RESULT.md`
- frontend 화면 변경: `implemented/CURRENT_FRONTEND_MAP.md`, `CURRENT_UI_EXPOSURE_MAP.md`, 해당 domain, `CODEX_RESULT.md`
- 숨겨진 foundation 노출: 사용자 승인 근거, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, 해당 domain, `CODEX_RESULT.md`
- 정책 변경: `01_PROJECT_POLICY.md`, `08_DOCUMENT_UPDATE_RULE.md`, 관련 codex 문서

## 6. 공통 기준

Codex, Gemini, Claude, ChatGPT, 사람 작업자는 실제 파일을 열어 확인한 내용만 현재 구현 상태로 기록한다. 미확인 파일은 `확인 필요`로 적고, 계획/추정은 현재 구현과 분리한다.

