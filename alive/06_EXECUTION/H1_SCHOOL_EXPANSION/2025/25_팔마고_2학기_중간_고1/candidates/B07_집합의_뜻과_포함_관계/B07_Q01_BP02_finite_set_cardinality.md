# B07 Q01 BP02 — 조건제시법으로 정의된 유한집합의 원소 수

- draftCandidateId: ALITE-PALMA25-H1-2MID-B07-Q01-BP02
- sourceQid: 1
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creatorRoute: gpt-6-luna/max
- candidateDisposition: ACCEPT — 기존 RPM L3/L4 경로에 속하는 CREATE 초안
- sourceDifficulty: level 하, bucket 1, confidence high
- targetDifficulty: level 하, bucket 1
- authorActualDifficulty: level 중, bucket 2, confidence high, boundary NONE
- independentDifficultyReview: NOT_TESTED

## Student-facing prompt and choices

정수 전체의 집합을 기준으로
\[
A=\{x\in\mathbb Z\mid (x+2)^2(x-1)(x-4)=0\}
\]
라 하자. 집합 \(A\)의 원소의 개수는?

① \(1\)

② \(2\)

③ \(3\)

④ \(4\)

⑤ \(7\)

## Exact answer

③

## Detailed student solution

곱이 \(0\)이므로
\[
(x+2)^2(x-1)(x-4)=0
\]
의 해는 \(x=-2,1,4\)이다. 따라서
\[
A=\{-2,1,4\}.
\]
\(x=-2\)는 식에서 중근으로 나타나지만 집합에는 같은 원소를 한 번만 기록한다. 그러므로 \(|A|=3\)이고 정답은 ③이다.

## Primary and RPM lookup

- Course/curriculum: 2022 공통수학2, H1, target standardUnitKey H22-C2-05, subUnitKey H22-C2-05-CORE.
- Canonical Primary: L1 집합과 명제 → L2 집합의 뜻과 포함 관계.
- Exact RPM path: L3-2.1.1 집합과 원소 → L4-2.1.1.2 유한집합 원소 개수.
- Current 2022 RPM course view status: L1/L2 RPM_VERIFIED; this L3/L4 row is labeled CANONICAL_DRAFT in the course view. This is an existing RPM path, not an extension proposal.
- RPM crosswalk: H1-RPM-232, CURRENT scope 공통수학2, DIRECT_ACTIVE; PT_SET_CARDINALITY / TPL_SET_CARDINALITY_DIRECT; target curriculum binding ACTIVE.
- ProblemType and Template statuses: PT_SET_CARDINALITY ACTIVE; TPL_SET_CARDINALITY_DIRECT ACTIVE in SETS_PROPOSITIONS.
- CrossConcept: none. Condition: COND_INTEGER (ACTIVE; the negative root is retained by the stated domain). IntegrationPattern: NONE.
- Curriculum gate: PASS on the author check. Only factorization and distinct-element counting are used.

## Blueprint, decisive step, and duplicate rationale

- Semantic blueprint: find the cardinality of a finite condition-defined set when the defining equation has a repeated root.
- Decisive-step signature: solve the factored zero-product condition, form the set of distinct integer values, then count the set elements rather than polynomial root multiplicities.
- Distinction from source q1: source q1 compares objective and subjective verbal criteria; this item requires an explicit algebraic set representation and distinct-value cardinality.
- Duplicate rationale: changing only the polynomial constants or names while keeping the same root-and-cardinality task is a numeric/surface instance, not a new blueprint.
- Distinct from B07 Q01 BP01: BP01 requires object-level subset checking with a nested set element; this candidate requires solving an equation and de-duplicating a repeated root.

## Misconception-based distractors

- ① counts only the root from the squared factor and misses the other factors.
- ② drops the negative root by treating the stated integer domain as if it were a positive-number domain.
- ④ counts \(-2\) twice because it is a repeated root, confusing multiplicity with distinct set elements.
- ⑤ counts every integer from \(-2\) through \(4\), mistaking a finite root set for an interval.

## Planned answer position

③ follows the natural increasing order of the numerical choices \(1,2,3,4,7\); the numeric order is kept for readability.

## Visual necessity and render status

- Visual necessity: NO; factorized expression and domain are complete in text.
- Visual spec/path/hash: N/A; no asset is planned or created.
- Render status: NOT_TESTED in a browser. No diagram render was required; actual MathJax/browser rendering was not performed.

## Creator self-check

The distinct solution set is exactly \(\{-2,1,4\}\); therefore exactly three elements. This is creator self-check only; independent blind math review and browser render are NOT_TESTED.

