# B02 Q10 — 두 겹친 교집합 영역을 합집합으로 읽기

## Candidate identity and provenance

- draftCandidateId: ALITE-PALMA25-H1-2MID-B02-Q10-BP01
- sourceQid: 10
- sourceExam: 25_팔마고_2학기_중간_고1_기출
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- sourceVisualOpened: archive/assets/images/25_팔마고_2학기_중간_고1_기출/q10.png
- sourceVisualSHA256: FAF23A3E032087CAE6FB7FA5F08D14F7F385700E1F40E4C1EA75CCD35DE05037
- sourceVisualObservation: The source diagram shades the part in A and B but outside C, i.e. A∩B∩C^C.
- candidateStatus: DRAFT_CANDIDATE; independent review pending

## Student-facing prompt

다음 벤다이어그램의 색칠한 부분을 나타내는 집합은? (단, $U$는 전체집합이다.)

## Choices

① $(A\cup C)\cap B^C$  
② $B\cap(A\cup C)$  
③ $(A\cap B)\cup C$  
④ $(A\cup B)\cap C$  
⑤ $A\cap B\cap C$

## Exact answer

②

## Student solution

그림에서 색칠한 부분은 $B$ 안에 있으면서 $A$ 또는 $C$에도 속하는 영역이다.
따라서 먼저 $A\cup C$로 “$A$ 또는 $C$”를 나타내고, 그중 $B$에 속하는
부분을 취하면 $B\cap(A\cup C)$이다.

이 식은 $(A\cap B)\cup(B\cap C)$와도 같다. 두 교집합의 공통 부분인
$A\cap B\cap C$는 합집합에서 한 번만 포함된다. 그러므로 정답은 ②이다.

## RPM Primary and metadata

- Canonical primary L1: 집합과 명제
- Canonical primary L2: 집합의 연산
- RPM L3/L4: 교집합과 합집합 → 집합 연산
- RPM taxonomy status: CANONICAL_DRAFT, current 2022 공통수학2 entry H1-RPM-237
- Standard unit: 공통수학2 / H22-C2-05; subUnitKey: H22-C2-05-CORE
- Exact active binding: PT_SET_OPERATION / TPL_DIRECT_MIXED_OPERATION; crosswalk mappingStatus DIRECT_ACTIVE, bindingStatus ACTIVE
- CrossConcept: none claimed; all operations are within one set-operation target.
- Condition: none; the membership relation is given by the diagram.
- Integration: none; the decisive reading is one compound set operation.
- category: 집합
- tags: 집합의 연산, 교집합, 합집합, 벤다이어그램

## Difficulty assessment

- level: 중
- targetDifficultyBucket: 2
- difficultyBucket: 2
- difficultyConfidence: high
- difficultyBoundaryFlag: NONE
- legacyLevelCompatibility: NORMAL
- author rationale: The student must identify membership in B and in at least one of A or C, then translate that directly into one intersection with one union. The three-set overlap is visible; no case split or hidden condition is needed.
- Assessment is an author pass based on this candidate’s own prompt and solution; no independent difficulty review is claimed.

## Blueprint and duplicate rationale

- Blueprint fingerprint: H1-RPM-237 / Venn-region to set expression / aggregate the two pairwise-overlap regions involving B as one union, with the triple-overlap region included once.
- Decisive step: read “in B and in A or C” as B∩(A∪C), rather than selecting only one atomic region or the triple intersection.
- Disposition: ACCEPT for this draft.
- The source q10 shades one atomic region, A∩B outside C. This candidate shades the three atomic regions that lie in B and in A or C: the A∩B-only part, the triple intersection, and the B∩C-only part. The decisive representation therefore combines two pairwise intersections and handles their overlap once; it is not a numeric, sign, or label change.
- Other explored structures: a new single-cell shade/read prompt would duplicate the source structure; a nested De Morgan simplification would move the primary L3 to 집합의 연산법칙 and was not used for this q10 seed.
- Numeric-only siblings generated: 0.

## Distractors and answer placement

- ① $(A\cup C)\cap B^C$: selects the A-or-C portion outside B instead of the shaded overlap inside B.
- ③ $(A\cap B)\cup C$: includes all of C, including points outside B.
- ④ $(A\cup B)\cap C$: selects the regions in C and misplaces the required B membership.
- ⑤ $A\cap B\cap C$: keeps only the triple intersection.
- Intended answer position: ②. Together with q8, the two multiple-choice answers occupy ④ and ②; neither is position-locked.

## Visual asset

- visualNecessity: REQUIRED; the regions and their overlap are the mathematical input.
- visualSpec: U is a rectangle containing three overlapping circles labeled A, B, and C. Shade the part of B that is also in A or C: the A∩B-only sector, the A∩B∩C sector, and the B∩C-only sector. Leave every other region unshaded.
- candidateAssetPath: alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/candidates/B02_집합의_연산/visuals/B02_Q10_VENN.svg
- candidateAssetSHA256: C8AD60988107F1C78766B72E46411A1EB7F08DCDF30B9790FF0F3A45CE421920
- candidateAssetBytes: 1183
- renderStatus: NOT_RUN; the SVG has not been checked in the actual exam renderer or browser.

## Creator self-check

The shaded predicate is exactly B∩(A∪C). The four distractor predicates are not equivalent to it for arbitrary subsets A, B, and C. This is creator self-check only. Independent blind review and actual render are NOT_TESTED.

