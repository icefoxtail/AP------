# AP Math / Wangji OS Docs

이 폴더는 AP Math OS와 왕지교육 OS 작업자가 프로젝트를 이해하기 위해 들어오는 문서 진입점이다.

## 1. 처음 읽을 문서

1. `00_READ_ME_FIRST.md`
2. `MASTER_RULEBOOK.md`
3. `MASTER_CURRENT_PROGRESS.md`
4. `MASTER_NEXT_WORK.md`

위 4개 문서는 현재 기준이다. 과거 결과 보고서나 archived 문서보다 항상 우선한다.

## 2. 실제 작업 전 읽을 문서

1. `.agent/BOOT.md`
2. `.agent/SKILLS_INDEX.md`
3. `.agent/DOMAIN_LOCK_POLICY.md`
4. `03_DOMAIN_INDEX.md`
5. 작업 도메인에 맞는 `domains/*.md`
6. 현재 구현 확인이 필요한 경우 `implemented/*.md`
7. 다음 작업이나 우선순위가 필요한 경우 `plans/*.md`
8. Codex 실행 규칙이 필요한 경우 `codex/*.md`

## 3. 폴더별 역할

| 경로 | 역할 |
|---|---|
| `domains/` | AP Math, 학생, 반, 리포트, 시간표, 수납, 학부모 연락 등 도메인별 정책과 설계 |
| `implemented/` | 현재 구현 상태, API 흐름, DB, Worker route, UI 노출, regression risk 지도 |
| `plans/` | 앞으로 진행할 roadmap, next plan, phase plan |
| `codex/` | Codex 실행 규칙, 결과 보고 규칙, 리뷰팩/검수 규칙 |
| `agent-skills/` | AP 루트 agent SOP |
| `guides/` | 사용법, 설계 가이드, reference, 보조 구조 문서 |
| `reports/` | 현재 참고 가치가 있는 분석 보고서 |
| `archive/` | 완료/과거/검수 요청/legacy 문서 |
| `_index/` | 문서 구조와 이동 이력 |

## 4. 특정 작업별 추가 문서 위치

- 도메인 작업: `domains/`
- 구현 현황 확인: `implemented/`
- 향후 작업 계획: `plans/`
- Codex 작업/검수 규칙: `codex/`
- 문서 관리/SOP: `agent-skills/`
- 디자인, reference, 운영 가이드: `guides/`
- 분석 보고서: `reports/`
- 과거 결과와 완료 문서: `archive/`

## 5. Archive 문서를 읽는 기준

`archive/` 문서는 과거 근거다. 현재 기준은 `MASTER_RULEBOOK.md`, `MASTER_CURRENT_PROGRESS.md`, `MASTER_NEXT_WORK.md`, 그리고 관련 `domains/`, `implemented/`, `plans/` 문서다.

archive 문서를 현재 기준처럼 사용하지 않는다. archive 문서를 근거로 삼아야 하면 현재 기준 문서와 충돌하지 않는지 먼저 확인한다.

## 6. 문서 이동 전 확인

문서를 새로 만들거나 옮기기 전에는 다음을 확인한다.

1. `docs/_index/DOCS_STRUCTURE.md`
2. `docs/_index/ARCHIVE_INDEX.md`
3. `docs/08_DOCUMENT_UPDATE_RULE.md`
4. `docs/agent-skills/ap-docs-maintenance-sop.md`

문서 구조를 바꾼 작업은 3대 기준 문서와 `CODEX_RESULT.md`에 반영한다.
