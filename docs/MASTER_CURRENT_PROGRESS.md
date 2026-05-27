# MASTER_CURRENT_PROGRESS

현재 구현과 문서 기준의 진행 상태를 한눈에 보는 문서다. 상세 근거는 `docs/implemented`, `docs/domains`, `docs/plans`, `docs/_index`에 둔다.

## 1. 상태값 기준

- 완료: 실제 코드 또는 기준 문서로 확인됨.
- 일부 완료: 제한된 범위에서만 구현됨.
- 진행 중: foundation 또는 workflow가 있으나 후속 보강 필요.
- 보류: 의도적으로 숨김 또는 승인 대기.
- 확인 필요: 문서에는 있으나 실제 파일까지 확인하지 못함.
- 금지: 승인 없이 구현/노출/실행 금지.

## 2. 현재 상태 요약

| 영역 | 현재 상태 | 근거 문서 | 비고 |
|---|---|---|---|
| docs 루트 구조 정리 | 진행 중 | `docs/_index/DOCS_STRUCTURE.md`, `docs/_index/ARCHIVE_INDEX.md` | 루트 문서 축소와 하위 폴더 이동 완료, 후속 검수 필요 |
| 3대 기준 문서 | 진행 중 | `MASTER_RULEBOOK.md`, `MASTER_CURRENT_PROGRESS.md`, `MASTER_NEXT_WORK.md` | 문서 구조 변경 반영 |
| domain 문서 | 진행 중 | `docs/domains/*.md` | 경로 유지 |
| implemented 문서 | 진행 중 | `docs/implemented/*.md` | root의 implemented index가 하위 폴더로 이동됨 |
| plan 문서 | 진행 중 | `docs/plans/*.md` | root의 planning rule과 Wangji roadmap이 하위 폴더로 이동됨 |
| Codex 규칙 문서 | 진행 중 | `docs/codex/*.md` | root의 Codex 실행/검수 규칙과 patch workflow가 하위 폴더로 이동됨 |
| guides / reports | 진행 중 | `docs/guides/*`, `docs/reports/*` | 디자인/reference/textbook/timetable/initial-data 보조 문서 분리 |
| archive 구조 | 진행 중 | `docs/archive/*`, `docs/_index/ARCHIVE_INDEX.md` | 완료/과거 결과 폴더 재배치 |
| AP Math 운영센터 | 진행 중 | `docs/implemented/CURRENT_FRONTEND_MAP.md`, `docs/domains/AP_MATH_DOMAIN.md` | 이번 작업에서 코드 검증 없음 |
| 학생/반 관리 | 진행 중 | `docs/domains/STUDENTS_CLASSES_DOMAIN.md` | 이번 작업에서 코드 검증 없음 |
| 리포트 AI / 평가리포트 | 진행 중 | `docs/domains/REPORT_AI_DOMAIN.md`, `docs/plans/REPORT_AI_NEXT_PLAN.md` | 이번 작업에서 코드 검증 없음 |
| CMath / EIE / 홈페이지 | 확인 필요 | `docs/plans/MASTER_ROADMAP.md`, domain docs | 별도 확인 필요 |

## 3. 문서 구조 정리 결과

- `docs/` 루트는 진입/3대 기준/정책/구조/도메인 인덱스/문서 업데이트 규칙 중심으로 정리했다.
- 보조 구조 문서는 `docs/guides/`, 현재 구현 상태는 `docs/implemented/`, 계획은 `docs/plans/`, Codex 규칙은 `docs/codex/`로 이동했다.
- 과거 결과와 완료 문서는 `docs/archive/` 하위 표준 폴더로 이동했다.
- 삭제한 문서는 없다.
- 이동 이력은 `docs/_index/ARCHIVE_INDEX.md`에 기록했다.

## 4. 확인 필요

- 이번 작업은 문서 구조 정리이며 `apmath/js`, Worker routes, schema, migrations 전체를 line-by-line 검증하지 않았다.
- archive 내부 과거 문서 본문의 과거 경로는 모두 고치지 않았다. 현재 진입 문서와 index의 경로를 우선 보정했다.
- 일부 하위 문서에는 과거 구조를 가리키는 문장이 남아 있을 수 있으며 후속 stale-doc 감사가 필요하다.

## 5. 근거 문서

- 문서 구조: `docs/_index/DOCS_STRUCTURE.md`
- 이동 이력: `docs/_index/ARCHIVE_INDEX.md`
- 루트 진입: `docs/README.md`, `docs/00_READ_ME_FIRST.md`
- 도메인 정책: `docs/domains/*.md`
- 현재 구현 지도: `docs/implemented/*.md`
- 다음 계획: `docs/plans/*.md`
- Codex workflow: `docs/codex/*.md`
