# DOCS_STRUCTURE

## 1. 현재 docs 구조

```text
docs/
├─ README.md
├─ 00_READ_ME_FIRST.md
├─ MASTER_RULEBOOK.md
├─ MASTER_CURRENT_PROGRESS.md
├─ MASTER_NEXT_WORK.md
├─ 01_PROJECT_POLICY.md
├─ 02_SYSTEM_ARCHITECTURE.md
├─ 03_DOMAIN_INDEX.md
├─ 08_DOCUMENT_UPDATE_RULE.md
├─ domains/
├─ implemented/
├─ plans/
├─ codex/
├─ agent-skills/
├─ guides/
├─ reports/
├─ archive/
│  ├─ completed/
│  ├─ old-plans/
│  ├─ codex-results/
│  ├─ review-requests/
│  └─ legacy/
└─ _index/
   ├─ DOCS_STRUCTURE.md
   └─ ARCHIVE_INDEX.md
```

## 2. docs 루트에 남기는 문서와 이유

| 문서 | 이유 |
|---|---|
| `README.md` | docs 전체 진입 인덱스 |
| `00_READ_ME_FIRST.md` | 작업자 첫 읽기 순서 |
| `MASTER_RULEBOOK.md` | 최상위 정책과 금지 규칙 |
| `MASTER_CURRENT_PROGRESS.md` | 현재 상태 요약 |
| `MASTER_NEXT_WORK.md` | 다음 작업과 보류/금지 항목 |
| `01_PROJECT_POLICY.md` | 기존 프로젝트 정책 |
| `02_SYSTEM_ARCHITECTURE.md` | 기존 시스템 구조 |
| `03_DOMAIN_INDEX.md` | 도메인별 문서 라우팅 |
| `08_DOCUMENT_UPDATE_RULE.md` | 문서 업데이트 규칙 |

## 3. 하위 폴더 역할

| 폴더 | 역할 |
|---|---|
| `domains/` | 도메인별 정책, 설계, 위험 |
| `implemented/` | 현재 구현 상태와 실제 파일 기준 지도 |
| `plans/` | roadmap, next plan, phase plan |
| `codex/` | Codex 실행 규칙, 결과 보고, 리뷰/검수 규칙 |
| `agent-skills/` | AP 루트 agent SOP |
| `guides/` | 디자인, reference, 사용/운영 가이드 |
| `reports/` | 현재 참고 가치가 있는 분석 보고서 |
| `archive/completed/` | 완료된 phase, 완료 작업, closeout |
| `archive/old-plans/` | 현재 계획이 아닌 과거 계획 |
| `archive/codex-results/` | 과거 Codex 결과 보고 |
| `archive/review-requests/` | 과거 검수 요청서 |
| `archive/legacy/` | 현재 구조에서 직접 읽을 필요가 낮은 과거 문서 |
| `_index/` | 문서 구조와 이동 이력 |

## 4. 문서 추가 배치 기준

- 현재 정책과 금지 규칙은 루트 기준 문서에 추가한다.
- 도메인 세부 기준은 `domains/`에 추가한다.
- 실제 구현 상태 지도는 `implemented/`에 추가한다.
- 앞으로 할 일은 `plans/`에 추가한다.
- Codex 실행/보고/검수 규칙은 `codex/`에 추가한다.
- SOP는 `agent-skills/`에 추가한다.
- 분석 보고서는 `reports/`에 추가한다.
- 완료되었거나 과거 근거인 문서는 `archive/` 하위에 넣는다.

## 5. 문서 아카이브 기준

- 현재 기준으로 계속 읽어야 하는 문서는 archive로 보내지 않는다.
- 완료된 작업 결과, 과거 검수 요청, 과거 Codex 결과, 현재 계획과 맞지 않는 plan은 archive로 이동한다.
- 확실하지 않은 문서는 삭제하지 않고 `archive/legacy/` 또는 `확인 필요`로 둔다.
- 이동한 문서는 `docs/_index/ARCHIVE_INDEX.md`에 원래 경로와 새 경로를 기록한다.

## 6. 작업 후 문서 업데이트 기준

문서 구조가 바뀌면 다음 문서를 확인한다.

1. `docs/README.md`
2. `docs/00_READ_ME_FIRST.md`
3. `docs/MASTER_RULEBOOK.md`
4. `docs/MASTER_CURRENT_PROGRESS.md`
5. `docs/MASTER_NEXT_WORK.md`
6. `docs/08_DOCUMENT_UPDATE_RULE.md`
7. `docs/agent-skills/ap-docs-maintenance-sop.md`
8. `docs/_index/DOCS_STRUCTURE.md`
9. `docs/_index/ARCHIVE_INDEX.md`
