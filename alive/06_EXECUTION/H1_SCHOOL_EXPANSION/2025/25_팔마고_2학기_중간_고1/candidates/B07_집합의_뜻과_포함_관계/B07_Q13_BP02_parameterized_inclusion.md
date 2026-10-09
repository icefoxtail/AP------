# B07 Q13 BP02 — 매개변수에 따른 집합 포함 범위

- draftCandidateId: ALITE-PALMA25-H1-2MID-B07-Q13-BP02
- sourceQid: 13
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creatorRoute: gpt-6-luna/max
- candidateDisposition: ACCEPT — 기존 RPM L3/L4 경로에 속하는 CREATE 초안
- sourceDifficulty: level 상, bucket 4, confidence high
- targetDifficulty: level 중, bucket 3
- authorActualDifficulty: level 중, bucket 3, confidence medium, boundary NONE
- independentDifficultyReview: NOT_TESTED

## Student-facing prompt and choices

정수 전체의 집합을 기준으로
\[
A=\{x\in\mathbb Z\mid (x-2)(x-4)\le0\}
\]
라 하고, 실수 \(t\)에 대하여
\[
B_t=\{x\in\mathbb Z\mid |x-t|<2\}
\]
라 하자. \(A\subseteq B_t\)가 성립하기 위한 \(t\)의 범위는?

① \(1<t<5\)

② \(2\le t\le4\)

③ \(0<t<4\)

④ \(2<t<6\)

⑤ \(2<t<4\)

## Exact answer

⑤

## Detailed student solution

\((x-2)(x-4)\le0\)이고 \(x\)는 정수이므로 \(A=\{2,3,4\}\)이다. \(A\subseteq B_t\)가 되려면 \(2,3,4\)가 모두 \(|x-t|<2\)를 만족해야 한다.

각 원소가 주는 조건은
\[
2\in B_t \iff 0<t<4,\qquad
3\in B_t \iff 1<t<5,\qquad
4\in B_t \iff 2<t<6.
\]
세 범위의 교집합은 \(2<t<4\)이다. 양 끝 \(t=2,4\)에서는 각각 \(4\) 또는 \(2\)가 \(B_t\)에 들어가지 않으므로 끝점을 포함하지 않는다. 따라서 정답은 ⑤이다.

## Primary and RPM lookup

- Course/curriculum: 2022 공통수학2, H1, target standardUnitKey H22-C2-05, subUnitKey H22-C2-05-CORE.
- Canonical Primary: L1 집합과 명제 → L2 집합의 뜻과 포함 관계.
- Exact RPM path: L3-2.1.3 집합의 포함 관계 → L4-2.1.3.2 매개변수 조건.
- Current 2022 RPM course view status: L1/L2 RPM_VERIFIED; this L3/L4 row is labeled CANONICAL_DRAFT in the course view. This is an existing RPM path, not an extension proposal.
- RPM crosswalk: H1-RPM-236, CURRENT scope 공통수학2, DIRECT_ACTIVE; PT_SET_INCLUSION / TPL_INCLUSION_PARAMETER; target curriculum binding ACTIVE.
- ProblemType and Template statuses: PT_SET_INCLUSION ACTIVE; TPL_INCLUSION_PARAMETER ACTIVE in SETS_PROPOSITIONS.
- CrossConcept: none. Condition: COND_INTEGER (ACTIVE; without the integer domain the set containment changes). IntegrationPattern: NONE.
- Curriculum gate: PASS on the author check. The solution uses only integer predicates, absolute-value inequalities, and interval intersection.

## Blueprint, decisive step, and duplicate rationale

- Semantic blueprint: recover the parameter range for which a fixed finite integer set is contained in a parameter-defined set.
- Decisive-step signature: enumerate the fixed set, translate membership of each extreme and middle element into strict inequalities on \(t\), and intersect the ranges with endpoint exclusion.
- Distinction from source q13: the source counts subsets of a restricted divisor set; this item does not count subsets and instead finds a parameter interval that guarantees a set inclusion.
- Duplicate rationale: changing the constants \(2,4\) or the radius while keeping endpoint-derived parameter containment is a numeric instance, not a new blueprint.
- Distinct from B07 Q13 BP01: this candidate solves for an unknown parameter and its strict boundary conditions; BP01 compares fixed sets with no parameter.

## Misconception-based distractors

- ① checks only the middle element \(3\), which gives \(1<t<5\), and misses the endpoint elements.
- ② includes boundary values by treating \(|x-t|<2\) as if it allowed equality.
- ③ enforces the left endpoint \(2\) but does not also enforce \(4\).
- ④ enforces the right endpoint \(4\) but does not also enforce \(2\).

## Planned answer position

⑤ was planned after the parameter range was solved. The options are arranged to expose distinct missed-element and endpoint errors rather than a sorted numerical order.

## Visual necessity and render status

- Visual necessity: NO; the finite set and the parameter-defined condition are explicit.
- Visual spec/path/hash: N/A; no asset is planned or created.
- Render status: NOT_TESTED in a browser. No diagram render was required; actual MathJax/browser rendering was not performed.

## Creator self-check

The necessary and sufficient conditions reduce to \((0,4)\cap(1,5)\cap(2,6)=(2,4)\). Endpoint substitution confirms both ends are excluded. This is creator self-check only; independent blind math review and browser render are NOT_TESTED.

