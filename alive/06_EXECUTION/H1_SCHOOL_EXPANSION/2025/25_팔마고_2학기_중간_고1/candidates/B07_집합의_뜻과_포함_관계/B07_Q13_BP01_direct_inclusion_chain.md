# B07 Q13 BP01 — 서로 다른 조건제시 집합의 포함 관계

- draftCandidateId: ALITE-PALMA25-H1-2MID-B07-Q13-BP01
- sourceQid: 13
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creatorRoute: gpt-6-luna/max
- candidateDisposition: ACCEPT — 기존 RPM L3/L4 경로에 속하는 CREATE 초안
- sourceDifficulty: level 상, bucket 4, confidence high
- targetDifficulty: level 중, bucket 3
- authorActualDifficulty: level 중, bucket 3, confidence high, boundary NONE
- independentDifficultyReview: NOT_TESTED

## Student-facing prompt and choices

정수 전체의 집합을 기준으로
\[
A=\{x\in\mathbb Z\mid x^2-5x+6=0\},\quad
B=\{x\in\mathbb Z\mid (x-1)(x-4)\le0\},\quad
C=\{x\in\mathbb Z\mid (x-2)(x-3)\le0\}
\]
라 하자. 다음 중 옳은 것은?

① \(A\)는 \(C\)의 진부분집합이다.

② \(A=C\)이고 \(A\)는 \(B\)의 진부분집합이다.

③ \(C\)는 \(A\)의 진부분집합이다.

④ \(B\subseteq A\)

⑤ \(A\)는 \(B\)의 진부분집합이고, \(B\)는 \(C\)의 진부분집합이다.

## Exact answer

②

## Detailed student solution

먼저
\[
x^2-5x+6=(x-2)(x-3)
\]
이므로 \(A=\{2,3\}\)이다.

\((x-1)(x-4)\le0\)은 \(1\le x\le4\)와 같으므로 정수 조건을 적용하면 \(B=\{1,2,3,4\}\)이다. 마찬가지로 \((x-2)(x-3)\le0\)에서 \(C=\{2,3\}\)이다.

따라서 \(A=C=\{2,3\}\)이고, \(1\in B\)이면서 \(1\notin A\)이므로 \(A\)는 \(B\)의 진부분집합이다. 정답은 ②이다.

## Primary and RPM lookup

- Course/curriculum: 2022 공통수학2, H1, target standardUnitKey H22-C2-05, subUnitKey H22-C2-05-CORE.
- Canonical Primary: L1 집합과 명제 → L2 집합의 뜻과 포함 관계.
- Exact RPM path: L3-2.1.3 집합의 포함 관계 → L4-2.1.3.1 두 집합의 포함.
- Current 2022 RPM course view status: L1/L2 RPM_VERIFIED; this L3/L4 row is labeled CANONICAL_DRAFT in the course view. This is an existing RPM path, not an extension proposal.
- RPM crosswalk: H1-RPM-235, CURRENT scope 공통수학2, DIRECT_ACTIVE; PT_SET_INCLUSION / TPL_INCLUSION_DIRECT; target curriculum binding ACTIVE.
- ProblemType and Template statuses: PT_SET_INCLUSION ACTIVE; TPL_INCLUSION_DIRECT ACTIVE in SETS_PROPOSITIONS.
- CrossConcept: none. Condition: COND_INTEGER (ACTIVE; it changes the set comparison by making \(A=C\)). IntegrationPattern: NONE.
- Curriculum gate: PASS on the author check. The item uses factorization, quadratic sign intervals, integer restriction, and finite-set inclusion.

## Blueprint, decisive step, and duplicate rationale

- Semantic blueprint: compare three condition-defined integer sets, including two equivalent descriptions, to identify equality and strict inclusion.
- Decisive-step signature: factor or sign-analyze each predicate, apply the integer domain, then compare the resulting rosters; the integer restriction is essential to \(A=C\).
- Distinction from source q13: the source counts individual subsets after restricting possible elements and imposing a product-sign condition. This candidate compares explicitly constructed sets and checks equality versus proper inclusion; it does not count candidate subsets.
- Duplicate rationale: replacing the integers or polynomial constants while retaining the same three-roster comparison is a parameter/numeric instance, not a different blueprint.
- Distinct from B07 Q13 BP02: BP02 finds the parameter interval that makes an inclusion true; this item has no free parameter and decides a fixed equality/inclusion chain.

## Misconception-based distractors

- ① and ③ treat equal sets \(A\) and \(C\) as a strict inclusion in one direction.
- ④ reverses the actual direction of containment and overlooks \(1\in B\setminus A\).
- ⑤ correctly sees \(A\subsetneq B\) but incorrectly claims \(B\subsetneq C\), despite \(1,4\in B\) and \(1,4\notin C\).

## Planned answer position

② was selected after the set comparison was fixed. The alternatives are relation statements, so there is no natural sorted order.

## Source qid 13 exploration and disposition

- The source L3/L4 path is subset count under a restricted divisor set and a positive-product condition. Changing only the divisor values, sign target, or an analogous one-set condition would preserve the same per-element subset-count blueprint; those are DUPLICATE / CONDITION_PATTERN_ONLY and were not produced.
- Direct inclusion of condition-defined sets: ACCEPT as this BP01.
- Parameterized inclusion condition: ACCEPT as B07 Q13 BP02 because the unknown is a range of \(t\), with strict-boundary analysis.
- Ordered pairs of subsets under inclusion and fixed cardinalities: ACCEPT as B07 Q13 BP03; its counted object is a pair of subsets, not one subset satisfying a product condition.
- Set-operation counting that would make 집합의 연산 the primary L2 is L3_DRIFT for this batch.
- No new L3 is proposed. Source qid disposition: SOURCE_EXPANSION_DONE. The distinct accepted paths above are complete; no mathematical source hold is claimed.

## Visual necessity and render status

- Visual necessity: NO; all set predicates are in the prompt.
- Visual spec/path/hash: N/A; no asset is planned or created.
- Render status: NOT_TESTED in a browser. No diagram render was required; actual MathJax/browser rendering was not performed.

## Creator self-check

The rosters are \(A=\{2,3\}\), \(B=\{1,2,3,4\}\), and \(C=\{2,3\}\), so only ② is true. This is creator self-check only; independent blind math review and browser render are NOT_TESTED.

