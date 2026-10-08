# B07 Q01 BP01 — 중첩 원소가 있는 부분집합 판정

- draftCandidateId: ALITE-PALMA25-H1-2MID-B07-Q01-BP01
- sourceQid: 1
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creatorRoute: gpt-6-luna/max
- candidateDisposition: ACCEPT — 기존 RPM L3/L4 경로에 속하는 CREATE 초안
- sourceDifficulty: level 하, bucket 1, confidence high
- targetDifficulty: level 중, bucket 2
- authorActualDifficulty: level 중, bucket 2, confidence medium, boundary NONE
- independentDifficultyReview: NOT_TESTED

## Student-facing prompt and choices

집합 \(A=\{1,\{2,3\},4\}\)에 대하여 다음 중 \(A\)의 부분집합인 것은?

① \(\{1,2\}\subseteq A\)

② \(\{3,4\}\subseteq A\)

③ \(\{2,3\}\subseteq A\)

④ \(\{\{2,3\}\}\subseteq A\)

⑤ \(\{\{1\},4\}\subseteq A\)

## Exact answer

④

## Detailed student solution

집합 \(A\)의 원소는 \(1\), 집합 \(\{2,3\}\), \(4\)이다. \(\{2,3\}\) 자체가 \(A\)의 원소이지, \(2\)와 \(3\)이 각각 \(A\)의 원소인 것은 아니다.

부분집합이 되려면 후보 집합의 모든 원소가 \(A\)의 원소여야 한다. ④의 원소는 \(\{2,3\}\) 하나이고, 이것은 \(A\)의 원소이므로 ④만 부분집합이다. ①에는 \(A\)의 원소가 아닌 \(2\), ②에는 \(3\), ③에는 \(2\)와 \(3\), ⑤에는 \(A\)의 원소가 아닌 \(\{1\}\)이 들어 있다.

따라서 정답은 ④이다.

## Primary and RPM lookup

- Course/curriculum: 2022 공통수학2, H1, target standardUnitKey H22-C2-05, subUnitKey H22-C2-05-CORE.
- Canonical Primary: L1 집합과 명제 → L2 집합의 뜻과 포함 관계.
- Exact RPM path: L3-2.1.2 부분집합 → L4-2.1.2.1 부분집합 판정.
- Current 2022 RPM course view status: L1/L2 RPM_VERIFIED; this L3/L4 row is labeled CANONICAL_DRAFT in the course view. This is an existing RPM path, not an extension proposal.
- RPM crosswalk: H1-RPM-233, CURRENT scope 공통수학2, DIRECT_ACTIVE; PT_SUBSET_JUDGMENT / TPL_SUBSET_DIRECT; target curriculum binding ACTIVE.
- ProblemType and Template statuses: PT_SUBSET_JUDGMENT ACTIVE; TPL_SUBSET_DIRECT ACTIVE in SETS_PROPOSITIONS.
- CrossConcept: none. Condition: none. IntegrationPattern: NONE.
- Curriculum gate: PASS on the author check. The item uses only rostered sets, element membership, and subset judgment in the target L2. It does not require a visual or a later-course theorem.

## Blueprint, decisive step, and duplicate rationale

- Semantic blueprint: judge subsethood when one displayed member of the reference set is itself a set.
- Decisive-step signature: read the outer-level elements of \(A\) exactly; then check each candidate subset member against those three objects without flattening \(\{2,3\}\).
- Distinction from source q1: q1 asks whether a verbal collection has an unambiguous membership criterion. This item instead tests literal object membership while deciding a subset relation; changing the student names or adjectives in q1 would remain a duplicate.
- Duplicate rationale: another “which collection is a set?” prompt is DUPLICATE. A routine numerical rewrite of this nested-membership test is a numeric instance, not another blueprint.
- Distinct from B07 Q01 BP02: BP02 solves a condition-defined set and counts its distinct values; this item tests nested element/subset structure.

### Source qid 1 exploration and disposition

- Original “clear criterion versus subjective description” structure: DUPLICATE if only the verbal examples are replaced.
- Roster/condition set membership and finite-set cardinality: ACCEPT as B07 Q01 BP02, whose decisive step is solving the set predicate and counting distinct values.
- Nested element versus subset judgment: ACCEPT as this blueprint.
- Set operations would shift the primary L2 to 집합의 연산. Parameterized inclusion is not source-derived from q1’s set-definition decision and is assigned to the more relevant q13 seed.
- Source qid disposition: SOURCE_EXPANSION_DONE. The two worthwhile q1 paths are complete; no source-level or candidate-level HOLD is claimed.

## Misconception-based distractors

- ① treats \(2\), which occurs inside the nested element \(\{2,3\}\), as an outer-level member of \(A\).
- ② makes the analogous flattening error for \(3\).
- ③ treats both inner numbers as outer-level members.
- ⑤ confuses the member \(1\) with the different object \(\{1\}\).

## Planned answer position

④ was selected after the mathematics was fixed. The set-valued choices have no natural sorted order. Across the five B07 MCQs, the planned key positions are ④, ③, ②, ⑤, ①, one each.

## Visual necessity and render status

- Visual necessity: NO; the complete set is stated in the prompt.
- Visual spec/path/hash: N/A; no asset is planned or created.
- Render status: NOT_TESTED in a browser. No diagram render was required; actual MathJax/browser rendering was not performed.

## Creator self-check

Manual membership check gives exactly one true choice, ④. The solution and distractor rationales match the displayed objects. This is creator self-check only; independent blind math review and browser render are NOT_TESTED.

