# B02 Q20 — 정확히 한 프로그램 신청 인원의 범위

## Candidate identity and provenance

- draftCandidateId: ALITE-PALMA25-H1-2MID-B02-Q20-BP01
- sourceQid: 20
- sourceExam: 25_팔마고_2학기_중간_고1_기출
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- sourceTextProvenance: The original q20 says “마팔고,” a school-name typo. The generated wording does not repeat it and uses a generic class context.
- candidateStatus: DRAFT_CANDIDATE; independent review pending

## Student-facing prompt

한 학년 학생 30명을 대상으로 방과 후 프로그램 A와 B의 신청 여부를 조사했다.
A를 신청한 학생은 18명, B를 신청한 학생은 16명이다. 두 프로그램 중 정확히
하나만 신청한 학생 수의 최댓값과 최솟값을 각각 구하고, 각 끝값이 가능한
이유를 서술하시오.

## Response contract

최댓값 __명, 최솟값 __명. 풀이 과정과 두 끝값이 실제로 가능함을 함께 서술한다.

## Exact answer

최댓값 26명, 최솟값 2명.

## Student solution

두 프로그램을 모두 신청한 학생 수를 $x$명이라 하자. 적어도 한 프로그램을
신청한 학생 수는 $18+16-x=34-x$명이다. 전체 학생이 30명이므로
$34-x\le30$, 즉 $x\ge4$이다. 한편 두 프로그램을 모두 신청한 학생은
B 신청자 16명을 넘을 수 없으므로 $x\le16$. 따라서 $4\le x\le16$이다.

정확히 하나만 신청한 학생 수는
$(18-x)+(16-x)=34-2x$명이다. 이 수는 $x$가 커질수록 작아지므로 최댓값은
$x=4$일 때 $34-8=26$명이고, 최솟값은 $x=16$일 때 $34-32=2$명이다.

두 끝값도 모두 가능하다.
- $x=4$이면 A만 신청한 학생 14명, B만 신청한 학생 12명, 둘 다 신청한
  학생 4명, 아무 프로그램도 신청하지 않은 학생 0명으로 전체 30명이 된다.
- $x=16$이면 A만 신청한 학생 2명, B만 신청한 학생 0명, 둘 다 신청한
  학생 16명, 아무 프로그램도 신청하지 않은 학생 12명으로 전체 30명이 된다.

따라서 최댓값은 26명, 최솟값은 2명이다.

## RPM Primary and metadata

- Canonical primary L1: 집합과 명제
- Canonical primary L2: 집합의 연산
- RPM L3/L4: 교집합과 합집합 → 원소 개수
- RPM taxonomy status: CANONICAL_DRAFT, current 2022 공통수학2 entry H1-RPM-238
- Standard unit: 공통수학2 / H22-C2-05; subUnitKey: H22-C2-05-CORE
- Exact active binding: PT_SET_CARDINALITY / TPL_OPERATION_CARDINALITY_COMPOSITE; crosswalk mappingStatus DIRECT_ACTIVE, bindingStatus ACTIVE
- CrossConcept: none; all conditions and calculations belong to two-set cardinality.
- Condition: none as a separate canonical condition key; the finite universe and the two set sizes are given directly.
- Integration: none; the solution uses one set-cardinality relationship with an extremal objective.
- category: 집합
- tags: 집합의 연산, 교집합, 원소의 개수, 대칭차, 최댓값, 최솟값

## Difficulty assessment

- level: 중
- targetDifficultyBucket: 3
- difficultyBucket: 3
- difficultyConfidence: medium
- difficultyBoundaryFlag: B23
- legacyLevelCompatibility: NORMAL
- author rationale: The student must first derive the feasible interval for the unknown overlap, then express the exact-one count as a decreasing function of that overlap and reverse the endpoints. Both endpoint arrangements must be verified. The structure requires a direction choice beyond direct substitution, but the solution remains a standard two-set cardinality model.
- Assessment is an author pass based on this candidate’s own prompt and solution; no independent difficulty review is claimed. The B23 boundary is retained for independent recheck.

## Blueprint and duplicate rationale

- Blueprint fingerprint: H1-RPM-238 / extremize symmetric-difference cardinality with fixed set sizes and finite universe / bound the unknown intersection, express exact-one count as 34−2x, reverse the endpoints, and certify both extremal arrangements.
- Decisive step: recognize that the exact-one count decreases as overlap increases, so the lower feasible overlap gives the maximum and the upper feasible overlap gives the minimum.
- Disposition: ACCEPT for this draft.
- The source q20 directly asks for the lower and upper feasible values of the intersection. This candidate asks for the range of the symmetric difference; it needs a new objective expression and reverses the endpoints. This is a distinct reasoning graph, not a numerical or wording instance of the source.
- Other explored structures: asking for the intersection range again is DUPLICATE of the source; the number in neither program is a direct affine complement of the same union bound and was not treated as another blueprint.
- Numeric-only siblings generated: 0.

## Distractors and answer placement

Not applicable; this is a constructed-response candidate and has no multiple-choice answer position.

## Visual asset

- visualNecessity: NOT_REQUIRED; the four Venn regions are completely determined algebraically and the response requires no diagram reading.
- visualSpec: none.
- candidateAssetPath: none.
- candidateAssetSHA256: none.
- renderStatus: NOT_RUN; no visual asset is required.

## Creator self-check

From 4≤x≤16, the exact-one count 34−2x ranges from 2 to 26, and the nonnegative region counts exhibit both endpoints. The response values and solution agree. This is creator self-check only. Independent blind review is NOT_TESTED.
