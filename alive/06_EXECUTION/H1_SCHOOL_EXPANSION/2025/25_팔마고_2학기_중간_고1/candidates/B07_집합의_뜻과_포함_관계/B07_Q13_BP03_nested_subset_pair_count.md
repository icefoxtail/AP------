# B07 Q13 BP03 — 포함 조건을 만족하는 부분집합 순서쌍

- draftCandidateId: ALITE-PALMA25-H1-2MID-B07-Q13-BP03
- sourceQid: 13
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creatorRoute: gpt-6-luna/max
- candidateDisposition: ACCEPT — 기존 RPM L3/L4 경로 및 ACTIVE subset-pair template을 사용하는 CREATE 초안
- sourceDifficulty: level 상, bucket 4, confidence high
- targetDifficulty: level 중, bucket 2
- authorActualDifficulty: level 중, bucket 2, confidence medium, boundary NONE
- independentDifficultyReview: NOT_TESTED

## Student-facing prompt and choices

집합 \(S=\{a,b,c,d\}\)의 부분집합 \(A,B\)에 대하여
\[
A\subseteq B,\qquad |A|=1,\qquad |B|=3
\]
을 만족시키는 순서쌍 \((A,B)\)의 개수는?

① \(12\)

② \(4\)

③ \(6\)

④ \(24\)

⑤ \(81\)

## Exact answer

①

## Detailed student solution

먼저 \(B\)는 \(S\)의 원소 세 개를 고르는 집합이므로 \(\binom43=4\)가지이다. \(B\)를 하나 정하면 \(A\)는 그 세 원소 중 한 원소를 고르는 부분집합이므로 \(3\)가지이다. 따라서
\[
4\cdot3=12
\]
개의 순서쌍 \((A,B)\)가 있다. \(A\)와 \(B\)의 크기가 다르므로 각 경우 \(A\subseteq B\)는 자동으로 진부분집합 관계이지만, 문제의 포함 조건은 모두 만족한다. 정답은 ①이다.

## Primary and RPM lookup

- Course/curriculum: 2022 공통수학2, H1, target standardUnitKey H22-C2-05, subUnitKey H22-C2-05-CORE.
- Canonical Primary: L1 집합과 명제 → L2 집합의 뜻과 포함 관계.
- Exact RPM path: L3-2.1.2 부분집합 → L4-2.1.2.2 부분집합의 개수.
- Current 2022 RPM course view status: L1/L2 RPM_VERIFIED; this L3/L4 row is labeled CANONICAL_DRAFT in the course view. This is an existing RPM path, not an extension proposal.
- RPM crosswalk: H1-RPM-234 is CURRENT and DIRECT_ACTIVE for PT_SUBSET_COUNT with target curriculum binding ACTIVE; its listed default template is TPL_SUBSET_COUNT_POWERSET_BASIC.
- Candidate template: TPL_RELATED_SUBSET_PAIR_COUNT is ACTIVE in SETS_PROPOSITIONS and its parent is PT_SUBSET_COUNT. The H1 crosswalk does not list this pair-count template as its default row, so no candidate-specific crosswalk mapping is claimed; template-level compatibility remains PROJECTION_BINDING_PENDING for review.
- CrossConcept: none. Condition: none. IntegrationPattern: SEQUENTIAL, because A is selected first and B is then completed subject to A and the stated sizes.
- Curriculum gate: PASS on the author check. The item uses finite subsets, cardinality, and a two-stage count within the target L2.

## Blueprint, decisive step, and duplicate rationale

- Semantic blueprint: count ordered pairs of nested subsets with fixed, unequal cardinalities.
- Decisive-step signature: choose \(B\) first, then choose \(A\) among the three members of \(B\); equivalently choose the singleton \(A\), then two additional members for \(B\).
- Distinction from source q13: q13 counts one subset whose allowed integer members and product sign are constrained. Here the counted object is an ordered pair of subsets, and the decisive structure is a relation-constrained pair count under fixed cardinalities.
- Duplicate rationale: changing only the four labels or replacing \(S\) by another set of the same size is a surface/numeric instance. Changing to another one-subset sign, sum, or product condition remains the source's subset-condition count pattern and is not a new blueprint.
- Distinct from B07 Q13 BP01 and BP02: BP01 compares fixed set rosters; BP02 finds a parameter range; this candidate counts ordered subset pairs.

## Misconception-based distractors

- ② counts the four possible choices of \(B\) but omits the choice of \(A\) within \(B\).
- ③ chooses two elements from all four as though they alone determined the pair, omitting the choice and role of \(A\).
- ④ orders the two members added to \(B\), even though a subset does not order its elements.
- ⑤ counts every nested pair \(A\subseteq B\) by assigning each element one of three roles, but ignores \(|A|=1\) and \(|B|=3\).

## Planned answer position

① was planned after the count was fixed. The number choices are deliberately not sorted so the distractors can represent distinct counting errors. B07's five correct-answer positions are ④, ③, ②, ⑤, ①, one each.

## Visual necessity and render status

- Visual necessity: NO; the finite set and the pair constraints are explicit.
- Visual spec/path/hash: N/A; no asset is planned or created.
- Render status: NOT_TESTED in a browser. No diagram render was required; actual MathJax/browser rendering was not performed.

## Creator self-check

There are four choices for \(B\), and for each fixed \(B\) there are three singleton choices for \(A\), giving exactly 12 ordered pairs. This is creator self-check only; independent blind math review and browser render are NOT_TESTED.

