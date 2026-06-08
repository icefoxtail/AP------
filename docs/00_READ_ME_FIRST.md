# 00_READ_ME_FIRST

AP Math OS / 왕지교육 OS 작업자가 가장 먼저 읽는 문서다.

## 1. 전체 읽기 순서

1. `docs/MASTER_RULEBOOK.md`
2. `docs/MASTER_CURRENT_PROGRESS.md`
3. `docs/MASTER_NEXT_WORK.md`
4. `docs/README.md`
5. `docs/03_DOMAIN_INDEX.md`
6. 작업 도메인 문서: `docs/domains/*.md`
7. 현재 구현 상태 문서: `docs/implemented/*.md`
8. 다음 계획 문서: `docs/plans/*.md`
9. Codex 실행 문서: `docs/codex/*.md`
10. 문서 구조 문서: `docs/_index/DOCS_STRUCTURE.md`, `docs/_index/ARCHIVE_INDEX.md`

3대 기준 문서는 첫 고정 체크포인트다. 과거 결과 보고서, archive 문서, review request보다 우선한다.

## 1-1. 공유 정책 문서 위치

아래 문서들은 `AI_CENTER/wangji-wiki/raw/shared/`가 **정본**이다.
`docs/` 서브폴더에는 복사본을 두지 않는다. 수정 시 wangji-wiki 한 곳만 수정한다.

- 도메인 정책: `EIE_*`, `APMS_*`, `APMATH_*`, `WANGJI_*` 계열 정책/스펙 문서
- 구현 현황: `EIE_APMS_FEATURE_MATRIX`, `EIE_APMS_STATE_API_COMPAT_SPEC` 등
- 아카이브 라운드 결과: `APMS_ASSESSMENT_*`, `EIE_APMS_REBASE_*` 등

경로: `C:\Users\USER\Desktop\AI_CENTER\wangji-wiki\raw\shared\`

## 2. docs 루트에 남는 문서

`docs/` 루트에는 다음 통합 진입 문서만 둔다.

- `README.md`
- `00_READ_ME_FIRST.md`
- `MASTER_RULEBOOK.md`
- `MASTER_CURRENT_PROGRESS.md`
- `MASTER_NEXT_WORK.md`
- `01_PROJECT_POLICY.md`
- `02_SYSTEM_ARCHITECTURE.md`
- `03_DOMAIN_INDEX.md`
- `08_DOCUMENT_UPDATE_RULE.md`

그 외 문서는 역할에 맞는 하위 폴더에서 찾는다.

## 3. 하위 폴더에서 찾을 문서

| 찾는 내용 | 위치 |
|---|---|
| 도메인 정책/설계 | `docs/domains/` |
| 현재 구현 상태 | `docs/implemented/` |
| 다음 작업 계획 | `docs/plans/` |
| Codex 실행 규칙 | `docs/codex/` |
| agent SOP | `docs/agent-skills/` |
| 디자인/reference/운영 가이드 | `docs/guides/` |
| 분석 보고서 | `docs/reports/` |
| 완료/과거/검수 요청 문서 | `docs/archive/` |
| 문서 구조와 이동 이력 | `docs/_index/` |

## 4. 최상위 원칙

- AP Math OS를 갈아엎지 않고 왕지교육 OS의 하위 실행 모듈로 보존한다.
- 왕지교육 OS는 AP Math, 씨매쓰 초등, EIE 영어학원을 함께 담는 상위 운영층이다.
- 이미 존재하는 DB/API/foundation이라도 사용자 승인 없이 UI에 노출하지 않는다.
- 기존 UI 문구, 버튼명, 화면명, 메뉴명, 운영 용어는 사용자 명시 요청 없이는 바꾸지 않는다.
- 학생 포털은 시험지 직접 열기를 제공하지 않고, 일반 OMR 제출 완료 후 수정/재입력/재제출을 제공하지 않는다.
- 수납, 출납, 학부모 연락, 권한, 감사, 원장/admin 기능은 foundation 우선이며 UI 노출은 별도 승인 사항이다.
- 코드, DB, Worker route, frontend, 문서 구조를 수정한 작업은 관련 문서를 업데이트한다.

## 5. 구현 중 금지 사항

- 지시받지 않은 코드, UI, DB, migration, Worker route를 수정하지 않는다.
- 기존 dirty 파일을 정리하거나 되돌리지 않는다.
- `apmath/`, `archive/` 산출물, schema, migration, package 파일은 문서 정리 작업에서 건드리지 않는다.
- route 본문을 `index.js`에 크게 추가하지 않는다.
- review pack, patch zip, commit, push, deploy는 사용자 지시와 작업 규칙을 따른다.
- 명시 지시 없는 운영 API smoke, remote D1, 배포 반영은 하지 않는다.

## 6. 작업 후 문서 업데이트 규칙

- 문서 구조 변경: `MASTER_RULEBOOK.md`, `MASTER_CURRENT_PROGRESS.md`, `MASTER_NEXT_WORK.md`, `08_DOCUMENT_UPDATE_RULE.md`, `_index/*`, 관련 Codex 문서.
- DB/schema/migration 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_DB_MAP.md`, 관련 domain/plan, `CODEX_RESULT.md`.
- Worker route 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_API_FLOW_MAP.md`, 관련 domain, `CODEX_RESULT.md`.
- frontend 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_FRONTEND_MAP.md`, `CURRENT_UI_EXPOSURE_MAP.md`, 관련 domain, `CODEX_RESULT.md`.
- hidden foundation 노출: 사용자 승인 근거, `MASTER_RULEBOOK.md`, `MASTER_CURRENT_PROGRESS.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, 관련 domain.

## 7. 공통 기준

Codex, Gemini, Claude, ChatGPT, 사람 작업자는 실제 파일을 열어 확인한 내용만 현재 구현 상태로 기록한다.
확인하지 못한 파일은 `확인 필요`로 적고, 계획/추정은 현재 구현과 분리한다.
