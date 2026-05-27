# AP Docs Maintenance SOP

문서 전용 작업, rulebook 검토, domain map, plan 업데이트, 문서 구조 정리에 사용한다.

## 1. 시작 절차

1. `.agent/BOOT.md`를 읽는다.
2. `.agent/DOMAIN_LOCK_POLICY.md`를 읽는다.
3. `.agent/SKILLS_INDEX.md`를 읽는다.
4. `docs/README.md`를 읽는다.
5. `docs/00_READ_ME_FIRST.md`를 읽는다.
6. `docs/MASTER_RULEBOOK.md`를 읽는다.
7. `docs/MASTER_CURRENT_PROGRESS.md`를 읽는다.
8. `docs/MASTER_NEXT_WORK.md`를 읽는다.
9. `docs/_index/DOCS_STRUCTURE.md`가 있으면 읽는다.
10. 작업 관련 domain / implemented / plan / codex 문서를 읽는다.

읽지 않은 문서를 읽었다고 기록하지 않는다.

## 2. docs 루트 배치 규칙

`docs/` 루트에는 통합 진입 문서만 둔다.

- `README.md`
- `00_READ_ME_FIRST.md`
- `MASTER_RULEBOOK.md`
- `MASTER_CURRENT_PROGRESS.md`
- `MASTER_NEXT_WORK.md`
- `01_PROJECT_POLICY.md`
- `02_SYSTEM_ARCHITECTURE.md`
- `03_DOMAIN_INDEX.md`
- `08_DOCUMENT_UPDATE_RULE.md`

그 외 새 문서는 `docs/_index/DOCS_STRUCTURE.md` 기준으로 하위 폴더에 배치한다.

## 3. 문서 이동 규칙

- 삭제하지 않는다.
- 확실하지 않은 문서는 `archive/legacy/` 또는 `확인 필요`로 둔다.
- 이동한 문서는 `docs/_index/ARCHIVE_INDEX.md`에 기록한다.
- 현재 진입 문서, README, 3대 기준 문서, domain index의 참조 경로를 우선 보정한다.
- archive 내부 과거 문서 본문은 과거 맥락이므로 무리하게 모두 고치지 않는다.

## 4. 3대 기준 문서

- `docs/MASTER_RULEBOOK.md`: 고정 정책, 금지, 운영 규칙, 문서 workflow.
- `docs/MASTER_CURRENT_PROGRESS.md`: 현재 상태, 완료/일부 완료/진행 중/보류/확인 필요, 근거, 위험.
- `docs/MASTER_NEXT_WORK.md`: 다음 작업, 우선순위, 보류 항목, 금지 항목, 완료 기준.

문서 구조가 바뀌면 세 문서 모두 업데이트 여부를 판단한다.

## 5. 완료 체크

- `docs/` 루트에 핵심 진입 문서만 남았는지 확인한다.
- `docs/README.md`가 진입 역할을 하는지 확인한다.
- `docs/_index/DOCS_STRUCTURE.md`가 배치 기준을 설명하는지 확인한다.
- `docs/_index/ARCHIVE_INDEX.md`가 이동 이력을 담는지 확인한다.
- 삭제된 문서가 없는지 확인한다.
- 코드, schema, migration, package, UI가 수정되지 않았는지 확인한다.
- review pack을 생성하고 `LATEST_CODEX_REVIEW_PACK.txt`와 zip entries를 확인한다.

## 6. 금지

- 문서 작업으로 코드 파일을 수정하지 않는다.
- `apmath/`, Worker, schema, migration, package 파일을 건드리지 않는다.
- repository-level `archive/` 산출물을 건드리지 않는다.
- git add/commit/push, deploy, remote D1, production smoke는 하지 않는다.
