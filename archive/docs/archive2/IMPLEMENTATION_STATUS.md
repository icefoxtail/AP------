# JS아카이브 2.0 Implementation Status

이 파일은 Phase 0 문서 봉인 시점의 초기 상태 기록이다. 계획 문서의 목표를
구현 완료로 계산하지 않으며, 실제 근거는 `BASELINE.md`를 따른다.

## Current main HEAD

`91b8657e41098b5ab41c2bef1dbfb7ee1b292825`

위 SHA는 2026-09-16 Phase 0 audit을 시작할 때의 최신 `main`/`origin/main`
기준점이다. 문서 봉인 후 push된 최종 commit SHA는 작업 종료 보고서에 별도로
기록한다.

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
- pre-boundary recipient history 122 assignments를 `LEGACY_INFERRED`, delayed snapshot 1 assignment를 `UNRESOLVED`로 기록했다.
- 정상 문제지/해설/정답, existing MIXED, single-source Unit Past, replacement/undo, school/year flow를 브라우저에서 확인했다.
- Unit Past multi-source preview loader failure와 embedded header stale result을 regression baseline으로 남겼다.
- canonical docs와 실제 remote uniqueness 차이를 근거 기반으로 `CONTRACTS.md`와 `STUDIO_PLAN.md`에 최소 caveat로 반영했다.

## unresolved

- `class_exam_assignment_questions` table와 write/read/history query가 아직 없다.
- assignment create 응답의 id가 client 후속 exclusion 흐름에 일관되게 전달되지 않는다.
- 731 assignment question UID gap, 272 path alias, 157 blank blueprint identity, 7 legacy MIXED payload가 해결되지 않았다.
- remote D1 archive-backed logical identity 9 duplicate groups와 partial unique index 부재가 남아 있다.
- deployed `exam_sessions`/assessment snapshot schema와 source `schema.sql`/migration ledger 사이 drift가 남아 있다.
- `assessment_result_items`에는 question UID가 없고, 96 orphan rows와 session/result coverage 차이가 있다.
- Unit Past multi-source isolated loading과 header propagation이 production-ready가 아니다.
- selected test 4건의 fixture/version/generated-artifact failure 및 Wrangler dry-run의 `@cloudflare/puppeteer` dependency blocker가 남아 있다.
- true cold-cache/API performance budget은 아직 측정하지 않았다.

## next recommended Phase

**Phase 1 — assignment ↔ canonical questionUid bridge contract and read-only
legacy reconciliation**

첫 단계는 migration candidate/report와 parity/idempotency fixture다. 그 결과가
확정되기 전에는 student-facing history exclusion, series 무중복, 대량
assignment write를 production rollout하지 않는다. 자세한 진입 조건은
`BASELINE.md` §15를 따른다.

## Last verified HEAD

`91b8657e41098b5ab41c2bef1dbfb7ee1b292825`

Phase 0 read-only audit 완료 시점에 검증한 기준 HEAD다. 최종 documentation-only
commit과 remote parity는 작업 종료 시점의 최종 보고서에서 다시 확인한다.
