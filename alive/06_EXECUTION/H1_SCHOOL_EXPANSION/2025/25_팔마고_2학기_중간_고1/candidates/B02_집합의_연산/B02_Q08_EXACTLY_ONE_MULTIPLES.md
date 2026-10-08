# B02 Q08 — 정확히 하나의 배수 조건을 만족하는 원소 수

## Candidate identity and provenance

- draftCandidateId: ALITE-PALMA25-H1-2MID-B02-Q08-BP01
- sourceQid: 8
- sourceExam: 25_팔마고_2학기_중간_고1_기출
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- candidateStatus: DRAFT_CANDIDATE; independent review pending

## Student-facing prompt

전체집합 $U=\{1,2,\ldots,100\}$의 부분집합
$A=\{x\in U\mid 6\mid x\}$, $B=\{x\in U\mid 9\mid x\}$에 대하여
$A$와 $B$ 중 정확히 하나에 속하는 원소의 개수는?

## Choices

① $22$  
② $27$  
③ $5$  
④ $17$  
⑤ $11$

## Exact answer

④ (17개)

## Student solution

$100$ 이하의 $6$의 배수는 $16$개이고, $9$의 배수는 $11$개이다.
두 조건을 모두 만족하는 수는 $6$과 $9$의 최소공배수인 $18$의 배수이므로
$5$개이다.

따라서 $A$에만 속하는 수는 $16-5=11$개이고, $B$에만 속하는 수는
$11-5=6$개이다. 두 집합 중 정확히 하나에 속하는 수는 이 두 경우를
합한 $11+6=17$개이다. 정답은 ④이다.

## RPM Primary and metadata

- Canonical primary L1: 집합과 명제
- Canonical primary L2: 집합의 연산
- RPM L3/L4: 교집합과 합집합 → 원소 개수
- RPM taxonomy status: CANONICAL_DRAFT, current 2022 공통수학2 entry H1-RPM-238
- Standard unit: 공통수학2 / H22-C2-05; subUnitKey: H22-C2-05-CORE
- Exact active binding: PT_SET_CARDINALITY / TPL_OPERATION_CARDINALITY_COMPOSITE; crosswalk mappingStatus DIRECT_ACTIVE, bindingStatus ACTIVE
- CrossConcept: none claimed. The LCM calculation only identifies the intersection of the two divisibility-defined sets.
- Condition: none as a separate canonical condition key; the finite natural-number universe and divisibility predicates are stated in the prompt.
- Integration: none; the steps remain within set-cardinality counting.
- category: 집합
- tags: 집합의 연산, 원소의 개수, 배수, 공통배수

## Difficulty assessment

- level: 중
- targetDifficultyBucket: 2
- difficultyBucket: 2
- difficultyConfidence: high
- difficultyBoundaryFlag: NONE
- legacyLevelCompatibility: NORMAL
- author rationale: The required method is clear after reading “정확히 하나.” Count the two sets and their common multiples, then exclude the overlap from each side. There is one standard condition interpretation and no strategic branch; this is a straightforward standard application.
- Assessment is an author pass based on this candidate’s own prompt and solution; no independent difficulty review is claimed.

## Blueprint and duplicate rationale

- Blueprint fingerprint: H1-RPM-238 / exact-one membership in two divisibility sets / find the LCM-defined overlap, subtract it from each set, then add the two exclusive counts.
- Decisive step: distinguish “exactly one” from the union by removing the common multiples twice.
- Disposition: ACCEPT for this draft.
- This differs from source q8’s union count: source q8 counts common multiples once as members of the union; this candidate excludes the overlap from both exclusive parts. This changes the target membership condition and the overlap coefficient, rather than only changing numbers.
- Other explored structures: repeating the union count is DUPLICATE of source q8; counting neither condition is the same inclusion-exclusion count followed by a complement; one-sided difference would move the primary L3 to 여집합과 차집합 and was not accepted as a q8 continuation.
- Numeric-only siblings generated: 0.

## Distractors and answer placement

- ① 22: computes the union, counting students with both properties even though “exactly one” is asked.
- ② 27: adds the two set sizes without removing their common multiples.
- ③ 5: counts only numbers satisfying both divisibility conditions.
- ⑤ 11: counts only the 6-multiples outside the 9-multiples and omits the 9-only case.
- Intended answer position: ④. This was planned alongside the other B02 multiple-choice candidate, whose intended position is ②. No choice-order constraint applies; choices are not being mechanically shuffled.

## Visual asset

- visualNecessity: NOT_REQUIRED; divisibility sets and their cardinalities are fully specified symbolically.
- visualSpec: none.
- candidateAssetPath: none.
- candidateAssetSHA256: none.
- renderStatus: NOT_RUN; no visual asset is required.

## Creator self-check

The set counts are 16, 11, and 5; the exact-one count is 17. The four distractors represent distinct set-membership errors, and none equals the correct answer. This is creator self-check only. Independent blind review is NOT_TESTED.
