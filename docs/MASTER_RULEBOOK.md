# MASTER_RULEBOOK

AP Math OS / 왕지교육 OS 작업자가 가장 먼저 확인하는 고정 룰북이다.

## 1. 상태값

상태값은 아래 6개만 사용한다.

- 완료: 실제 코드 또는 기준 문서로 확인된 상태.
- 일부 완료: 일부 범위만 구현되었거나 제한된 조건에서만 동작하는 상태.
- 진행 중: foundation, API, UI 흐름이 있으나 후속 보강이 필요한 상태.
- 보류: 의도적으로 숨겼거나 사용자 승인 전까지 노출하지 않는 상태.
- 확인 필요: 문서에는 있으나 실제 파일까지 검증하지 못한 상태.
- 금지: 명시 승인 없이는 구현, 노출, 실행하면 안 되는 상태.

## 2. 공통 원칙

- 요청받은 범위만 수행한다.
- 기존 dirty 파일은 사용자 작업물로 간주하고 임의로 되돌리거나 정리하지 않는다.
- AP Math OS는 왕지교육 OS의 하위 실행 모듈로 보존한다.
- 기존 UI 문구, 버튼명, 화면명, 메뉴명, 운영 용어는 사용자 요청 없이 바꾸지 않는다.
- DB/API/foundation이 존재해도 사용자 승인 없이 기본 UI에 노출하지 않는다.
- `git add`, `git commit`, `git push`, deploy, remote D1, production smoke는 명시 지시 없이는 금지한다.
- review pack과 patch zip은 `C:\Users\USER\Downloads`에 생성하고 zip entries를 확인한다.

## 3. docs 루트 기준

`docs/` 루트에는 통합 진입 문서만 둔다.

- `docs/README.md`
- `docs/00_READ_ME_FIRST.md`
- `docs/MASTER_RULEBOOK.md`
- `docs/MASTER_CURRENT_PROGRESS.md`
- `docs/MASTER_NEXT_WORK.md`
- `docs/01_PROJECT_POLICY.md`
- `docs/02_SYSTEM_ARCHITECTURE.md`
- `docs/03_DOMAIN_INDEX.md`
- `docs/08_DOCUMENT_UPDATE_RULE.md`

과거 결과, 완료 문서, 검수 요청서, 세부 map, plan, SOP, reference는 루트에 두지 않는다.

## 4. 문서 배치 원칙

| 위치 | 넣는 문서 |
|---|---|
| `docs/domains/` | 도메인별 정책, 설계, 기능 기준 |
| `docs/implemented/` | 현재 구현 상태, route/API/DB/UI map |
| `docs/plans/` | 앞으로 할 일, roadmap, next plan |
| `docs/codex/` | Codex 실행/보고/검수 규칙 |
| `docs/agent-skills/` | agent skill / SOP |
| `docs/guides/` | 사용법, 디자인, reference, 운영 가이드 |
| `docs/reports/` | 현재 참고할 분석 보고서 |
| `docs/archive/completed/` | 완료된 phase와 closeout |
| `docs/archive/old-plans/` | 현재 계획이 아닌 과거 plan |
| `docs/archive/codex-results/` | 과거 Codex 결과 |
| `docs/archive/review-requests/` | 과거 검수 요청서 |
| `docs/archive/legacy/` | 직접 읽을 필요가 낮은 과거 문서 |
| `docs/_index/` | 구조 설명과 이동 이력 |

삭제하지 않는다. 확실하지 않은 문서는 archive 또는 확인 필요로 둔다.

## 5. Archive 해석 원칙

- archive 문서는 과거 근거이며 현재 기준이 아니다.
- 현재 기준은 3대 기준 문서, `03_DOMAIN_INDEX.md`, 관련 `domains/`, `implemented/`, `plans/` 문서다.
- archive 문서를 현재 기준처럼 인용해야 할 때는 현재 기준 문서와 충돌하지 않는지 확인한다.
- archive 내부 과거 경로는 무리하게 모두 고치지 않는다. 현재 진입 문서와 index의 경로를 우선 보정한다.

## 6. UI 문구와 운영 용어 보존

- AP Math 운영 용어는 정책이다.
- `숙제`, `OMR`, `제출 완료`, `중등부`, `고등부`, `전체 보기`, `내 반 보기`, `선생님 화면`, `원장/admin` 같은 현장 용어를 임의로 바꾸지 않는다.
- 새 문구가 필요하면 기존 운영 용어와 충돌하지 않게 작성한다.
- 문서 정리만으로 UI 문구를 바꾸는 것은 금지한다.

## 7. Hidden Foundation 노출 금지

- route, table, helper, modal foundation이 있다는 이유만으로 화면에 꺼내지 않는다.
- 수납/출납/회계, 학부모 메시지, 수신동의 상세, 감사 로그, 개인정보 접근 로그, staff permission, foundation sync, 원장/admin 요약은 승인 전까지 보류 상태다.
- 문서에는 foundation으로 기록할 수 있지만 visible card/button/panel로 만들 수는 없다.

## 8. 학생 포털 / OMR 정책

- 학생 포털은 배정 확인과 허용된 OMR 연결까지만 제공한다.
- 학생에게 시험지 원본 경로, archive 파일 경로, raw question bank를 노출하지 않는다.
- 일반 시험 OMR 제출 완료 후 학생 수정, 재입력, 재제출 버튼을 만들지 않는다.
- 교재/수업자료 OMR은 별도 정책이며, 일반 시험 OMR 금지를 약화하지 않는다.

## 9. 작업 완료 시 문서 업데이트 원칙

모든 작업 종료 시 아래 3대 기준 문서 업데이트 필요 여부를 판단한다.

- `docs/MASTER_RULEBOOK.md`: 고정 정책, 금지, 운영 규칙, 문서 workflow가 바뀐 경우.
- `docs/MASTER_CURRENT_PROGRESS.md`: 현재 상태, 완료/일부 완료/진행 중/보류/확인 필요 상태, 근거가 바뀐 경우.
- `docs/MASTER_NEXT_WORK.md`: 다음 작업, 보류 항목, 우선순위, 완료 기준이 바뀐 경우.

업데이트하지 않는 기준 문서가 있으면 `CODEX_RESULT.md`에 이유를 적는다.

## 10. 상세 근거 문서

- 진입: `docs/00_READ_ME_FIRST.md`, `docs/README.md`
- 정책: `docs/01_PROJECT_POLICY.md`, `docs/guides/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 구조: `docs/02_SYSTEM_ARCHITECTURE.md`, `docs/_index/DOCS_STRUCTURE.md`
- 도메인 색인: `docs/03_DOMAIN_INDEX.md`
- 문서 업데이트: `docs/08_DOCUMENT_UPDATE_RULE.md`
- 현재 구현: `docs/implemented/*.md`
- 도메인: `docs/domains/*.md`
- 다음 계획: `docs/plans/*.md`
- Codex 규칙: `docs/codex/*.md`
- archive 이동 이력: `docs/_index/ARCHIVE_INDEX.md`
- 루트 agent layer: `.agent/BOOT.md`, `.agent/SKILLS_INDEX.md`, `.agent/DOMAIN_LOCK_POLICY.md`
