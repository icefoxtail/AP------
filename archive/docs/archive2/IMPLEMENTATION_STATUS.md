# JS아카이브 2.0 Implementation Status

이 파일은 Phase 0 문서 봉인 시점의 초기 상태 기록이다. 계획 문서의 목표를
구현 완료로 계산하지 않으며, 실제 근거는 `BASELINE.md`를 따른다.

## Audit Base HEAD

`91b8657e41098b5ab41c2bef1dbfb7ee1b292825`

2026-09-16 Phase 0 audit을 처음 시작할 때의 기준점이다. 이 SHA는 감사의
출발점을 뜻하며, 현재 문서가 가리키는 원격 문서 HEAD와 혼동하지 않는다.

## Phase 0 Seal Commit

`29e2b300aff38d428f6d5ad9b5f299f929afa4e7`

Phase 0 정본 문서 봉인과 최초 baseline commit이다. 이 commit에서
`README.md`, `BASELINE.md`, `IMPLEMENTATION_STATUS.md`가 추가되었고,
`CONTRACTS.md`와 `STUDIO_PLAN.md`의 실제 배포 unique caveat가 반영되었다.

## Current Verified Documentation HEAD

`29e2b300aff38d428f6d5ad9b5f299f929afa4e7`

Archive 2.0 장기 작업 branch를 생성하기 직전에 실제 `origin/main`에서
재확인한 현재 원격 문서 HEAD다. 이번 branch의 첫 P1 문서 commit은 이 기준점
위에만 쌓이며 `main`에는 merge/push하지 않는다.

## Current Phase

**Phase 0 — canonical document seal + actual code/DB/API baseline audit**

## Phase 0 result

**COMPLETE (audit/document scope)**

문서 정본 읽기, 실제 Archive/Worker/DB/API 구조 확인, qid 안정성 및 assignment
question coverage 측정, legacy history 분류, 브라우저 회귀 baseline, 배포
parity caveat 기록을 완료했다. Production feature code, migration, schema,
API, UI는 변경하지 않았다.

## completed

- `MASTERPLAN.md`, `CONTRACTS.md`, `TAXONOMY.md`, `STUDIO_PLAN.md` 전체를 읽고 Authority 관계를 고정했다.
- `README.md`의 정확한 읽기 순서, Authority mapping, 기존 시스템 중복 생성 금지 원칙을 작성했다.
- `BASELINE.md`의 15개 필수 감사 섹션을 작성했다.
- 현재 local archive 462 exams / 11,226 questions와 qid 계산 결과 11,226 unique를 확인했다.
- remote assignment 162 rows, recipients 970, exclusions 93, effective recipients 877을 확인했다.
- normal/MIXED assignment expected 4,138문항 중 현재 UID 근거 3,407문항(82.3%)과 731 gap을 기록했다.
- qid sidecar의 current h2 200문항 누락, remote blueprint 157 blank identity, legacy alias 272 occurrence를 기록했다.
- recipient history를 pre-boundary 695 rows=`LEGACY_INFERRED`, post-boundary same-day 267 rows=`VERIFIED` 계열, delayed 8 rows=`UNRESOLVED`로 분리 기록했다.
- 정상 문제지/해설/정답, existing MIXED, single-source Unit Past, replacement/undo, school/year flow를 브라우저에서 확인했다.
- Unit Past multi-source preview loader failure와 embedded header stale result을 regression baseline으로 남겼다.
- canonical docs와 실제 remote uniqueness 차이를 근거 기반으로 `CONTRACTS.md`와 `STUDIO_PLAN.md`에 최소 caveat로 반영했다.

## unresolved

- `class_exam_assignment_questions` table와 write/read/history query가 아직 없다.
- assignment create 응답의 id가 client 후속 exclusion 흐름에 일관되게 전달되지 않는다.
- 731 assignment question UID gap, 272 path alias, 157 blank blueprint identity, 7 legacy MIXED payload가 해결되지 않았다.
- remote D1 archive-backed logical identity 9 duplicate groups와 partial unique index 부재가 남아 있다.
- deployed `exam_sessions`/assessment snapshot schema와 source `schema.sql`/migration ledger 사이 drift가 남아 있다.
- current sessions는 531 = result item 있음 242 + 없음 289이고, result-session 전체 246은 current 242 + orphan session 4로 별도 분모다. `assessment_result_items`에는 question UID가 없고 orphan result rows는 96이다.
- Unit Past multi-source isolated loading과 header propagation이 production-ready가 아니다.
- selected test 4건의 fixture/version/generated-artifact failure 및 Wrangler dry-run의 `@cloudflare/puppeteer` dependency blocker가 남아 있다.
- true cold-cache/API performance budget은 아직 측정하지 않았다.

## next recommended Phase

**Phase 1A — assignment ↔ canonical questionUid bridge contract and read-only
legacy reconciliation**

Phase 1A는 이미 확보한 baseline/identity policy/known-gap inventory를 기반으로
read-only reconciliation, bridge design, parity fixture를 수행한다. Phase 1A
결과가 확정되고 `BASELINE.md` §15의 Phase 1B HARD Gate를 통과하기 전에는
student-facing history exclusion, series 무중복, 대량 assignment write를
production rollout하지 않는다.

## Last verified HEAD

`29e2b300aff38d428f6d5ad9b5f299f929afa4e7`

Phase 0 seal 직후이자 이번 장기 branch를 생성하기 직전에
`origin/main`에서 검증한 문서 HEAD다. 이번 branch의 새 commit SHA와
`main` 미변경 여부는 최종 보고서에서 다시 확인한다.
