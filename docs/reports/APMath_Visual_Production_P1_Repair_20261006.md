# Phase 0–2 P1 핀포인트 수정 — 2026-10-06

검토 대상 `93b0f36ee0c77548201e45cc0551f92e82d2455a`, 동일 branch에서 수정.
fetch한 main은 `b9a5f2d4239c33ba003b134b1511d73425f434b0`. 기존 기준 main 대비
검토한 geometry/provider/canonical/UID 의존 경로의 main diff는 없었다.
main merge/rebase, Phase 3 확장, production exam JS/SVG 변경은 수행하지 않는다.

## 반영

1. 실제 UID CLI는 `--source-registry`의 bound parent/current registry를
   `resolveQuestion()`으로 읽는다. 원본 byte SHA/ACTIVE mapping/ordinal을 검사한다.
   registry가 없으면 INPUT_REQUIRED. 파일명 검색은 명시적 `--experimental-locator`
   전용이며 EXPERIMENTAL_LOCATOR_COMPLETE까지만 가능하다. 엔진이 ACTIVE registry를
   자체 생성하던 코드는 제거했고, 이전 엔진 scoped registry도 authority 입력으로 거부한다.
2. Solution과 source condition을 각각 source-only context에서 먼저 판정하고
   immutable BLIND_FREEZE를 파일로 commit한다. readBoundFile로 동결본을 다시 읽은
   다음 별도 compare context에 stored answer/solution 또는 proposedPlan을 공개한다.
   missing image, blind FAIL, freeze 실패에는 compare를 실행하지 않는다.
   compare가 원 답/조건 inventory를 바꾸면 lineage 검증에서 거부한다.
3. verifiedSolutionPolicySha256와 verificationInputSha256를 receipt/plan에 결속한다.
   source bytes/student fields/image/answer/solution/policy/provider closure가 변경되거나
   과거 unblinded receipt이면 fresh blind+compare가 필수다. 현재 fingerprint를 붙이는
   것으로 이전 verification 자격을 승격하지 않는다. Source review도 동일 lineage를 검사한다.
4. Cindy input을 Number로 바꾸기 전에 BigInt로 보수적 범위를 검사한다. 2^53 초과
   integer와 민감한 rational/취소식은 UNSUPPORTED이며 exact snapshot을 함께 검사하므로
   producer/observer의 double이 동일하게 반올림되어 delta 0인 경우도 PASS할 수 없다.
   numeric peer임을 receipt에 명시한다.

## 변경 검증 범위

`p1-boundaries.test.mjs`는 실제 UID CLI bypass, current/retired/stale registry,
opaque canonical UID의 filename 독립성, source-only 전달, physical freeze-before-disclose,
blind/freeze/image 실패 시 compare 금지, legacy/변조 decision 거부,
answer/source/solution/verifier/provider 변경 invalidation,
unsafe integer/rational 및 동일 double의 delta-zero false PASS를 검사한다.

실제 provider/Archive 재실행은 geometry 효천고 q1과 graph 연향중 q10의
**EXPERIMENTAL_LOCATOR** 경로만 검증한다. Canonical authority fixture를 실제 승인된
registry처럼 만들지 않았다. 원문→blind freeze→compare의 raw receipt와 실제 capture를
새 generated result에 보존한다. 실제 parent/current registry를 받은 canonical UID
closure는 별도 실행이 필요하며 이전 3/3을 그 결과로 주장하지 않는다.

검증 수치는 최종 응답과 로컬 test log에 따른다. 원격 CI 독립 재실행은 주장하지 않는다.
Full overlay의 actual Archive만 해당하며 medium/current size 정책 전체나
qualification/Seal/ACTIVE 검증으로 확대하지 않는다.

## 실제 수정 검증 결과

- Node geometry/provider: **101/101 PASS** (기존 94 + P1 경계 7).
- Python geometry: **130/130 PASS**.
- git diff whitespace 검사 PASS.
- Geometry/Graph 실제 provider + Archive 재실행: 각 `EXPERIMENTAL_LOCATOR_COMPLETE`,
  actual Archive PASS. Solution 및 조건의 SOURCE_ONLY freeze, 이후 compare,
  최신 verification/source policy lineage 검증이 각각 true였다.
- Geometry result:
  `archive/_generated/geometry-visual-engine/production/stages/RESULT/263df6e73924aa89db74eb67b1c362b153fd72ae63395f932de5234e717df189/result.json`
- Graph result:
  `archive/_generated/geometry-visual-engine/production/stages/RESULT/69f46bec6bfbd4f66bfab3c2bb480b9d16a8ca66ebee7a1b7412f9c334ef664f/result.json`

Locator 실행의 비영(非零) CLI exit는 canonical 완료 권한이 없다는 뜻이다.
원본 byte/capture 물리 검증 PASS를 canonical UID closure PASS로 바꾸지 않는다.
실제 current/parent registry 없이 default UID를 실행한 경우 INPUT_REQUIRED를
반환하는 negative도 실제 CLI를 통해 확인했다.
