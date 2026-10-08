# B05_Q04_C01_DISTANCE_SUM_MIN

## Draft and source
- draftCandidateId: B05_Q04_C01_DISTANCE_SUM_MIN
- sourceQid: 4
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSha1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSha256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- source-qid disposition: SOURCE_EXPANSION_DONE for exploration; candidate draft is an EXT_L4 proposal and remains non-consumer-selectable.

## Student prompt and choices

두 실수 $x,y$에 대하여
$\sqrt{(x+2)^2+(y-3)^2}+\sqrt{(x-4)^2+(y-11)^2}$의 최솟값은?

① $6$  
② $8$  
③ $14$  
④ $10$  
⑤ $100$

## Exact answer
- Mathematical answer: 10
- answer: ④

## Detailed student solution
점 $P=(x,y)$, $A=(-2,3)$, $B=(4,11)$로 놓으면 주어진 식은 $PA+PB$이다. 삼각형의 두 변의 길이의 합은 나머지 한 변의 길이보다 작지 않으므로
$PA+PB\ge AB$이다.

$AB=\sqrt{(4-(-2))^2+(11-3)^2}=\sqrt{6^2+8^2}=10$이므로 주어진 식은 항상 10 이상이다. $P$가 선분 $AB$ 위에 있으면 등호가 성립하고, 그런 점은 허용된 실수 $x,y$ 중에 실제로 존재한다. 따라서 최솟값은 10이며 정답은 ④이다.

## Canonical Primary curriculum and RPM lookup
- Course: 2022 / high / 공통수학2
- Primary L1: 도형의 방정식
- Primary L2: 평면좌표
- Canonical unit: H22-C2-01, order 1
- RPM source record: RPM_H22_C2
- Lookup-confirmed parent L3: 두 점 사이의 거리, H22-C2 / 공통수학2 / 도형의 방정식 / 평면좌표 / 두 점 사이의 거리; record status CANONICAL_DRAFT.
- Exact canonical comparators: L4 거리 공식 and L4 도형의 변 길이; both are CANONICAL_DRAFT in the current master. The current records describe pairwise distance/side-length use, but do not explicitly name the minimum of a two-distance sum or its equality set.

## Separate extension candidate
- candidateKind: EXT_L4_CANDIDATE
- proposedExtensionId: EXT-H1-H22-C2-01-DISTANCE-SUM-MIN-TRIANGLE-INEQUALITY
- proposed label: 두 점을 거치는 거리합의 최솟값과 등호 성립 자취
- proposed parent: RPM_H22_C2 / H22-C2-01 / 두 점 사이의 거리
- canonicalComparator: 거리 공식; 도형의 변 길이
- decisiveStepSignature: Interpret the two radical terms as distances from one free point to fixed endpoints, apply the triangle inequality, then characterize equality by the segment joining those endpoints.
- requiredConcepts: coordinate distance; triangle inequality for Euclidean distance.
- prerequisiteConcepts: elementary triangle inequality.
- curriculumScope: 2022 High-1 Common Math 2 plane coordinates; the problem uses only coordinate distance and a triangle inequality. The extension's separate curriculum/taxonomy review is pending.
- curriculumGateStatus: REVIEW_REQUIRED for the proposed extension; no canonical promotion or curriculum PASS is claimed.
- canonicalPromoted: false
- consumerSelectable: false
- reviewStatus: DISCOVERED_UNREVIEWED
- This is one draft instance of one proposed extension blueprint. Coordinate substitutions that preserve this minimum-sum/equality structure are numeric instances, not separate blueprints.

## Blueprint exploration before production
- RPM L3 두 점 사이의 거리 was queried first. L4 거리 공식 covers the fixed-endpoint distance calculation; L4 도형의 변 길이 also covers obtaining a segment length. Neither exact L4 label states minimizing PA+PB over a free P or the equality segment, so that semantic gap is recorded separately as the proposed EXT_L4 candidate below.
- RPM L3 선분의 내분·외분 and L3 삼각형의 무게중심 were checked as nearby same-unit structures and excluded because the problem has no division point or centroid.
- Coordinate/sign changes and asking only for the endpoint distance preserve the same minimum-sum/equality decision and are duplicates/instances, not additional blueprints.
## CrossConcept, Condition, and Integration
- CrossConcept: Triangle inequality is the real decisive geometric fact. No separate canonical RPM CrossConcept node is claimed; it is represented inside the proposed extension.
- Condition: None beyond unrestricted real coordinates.
- Integration: None; the extension stays within the two-point-distance structure.

## Independent difficulty assessment
- difficultyLabel: 중
- difficultyBucket: 2
- difficultyConfidence: high
- difficultyBoundaryFlag: NONE
- difficultyBasis: Two radicals must be recognized as distances, followed by one inequality and an equality-attainment check; arithmetic is direct.

## Blueprint disposition and duplicate rationale
- blueprintFingerprint: DISTANCE_SUM_MINIMUM_BY_TRIANGLE_INEQUALITY_WITH_SEGMENT_EQUALITY
- CREATE disposition: ACCEPT as a complete extension-candidate draft, pending independent review and extension review.
- Unique semantic blueprint count for this candidate: one proposed EXT_L4 blueprint; it is not a canonical RPM L4 count.
- Numeric instance count: one.
- Duplicate rationale: Replacing the endpoint coordinates or signs while keeping a free point and the objective PA+PB has the same decisive step and is only a numeric instance. The source's direct distance-sum structure is retained as one proposed extension example; no additional type is claimed.

## Misconception-based distractors and answer position
- ① 6: keep only the horizontal coordinate difference and ignore the vertical difference.
- ② 8: keep only the vertical coordinate difference and ignore the horizontal difference.
- ③ 14: add coordinate differences as a Manhattan distance instead of using Euclidean distance.
- ④ 10: correct Euclidean distance between the fixed endpoints.
- ⑤ 100: compute the squared distance and forget to take its square root.
- Planned answer position: ④.
- Placement rationale: The options are ordered by the underlying calculation/error family: horizontal component, vertical component, coordinatewise sum, correct Euclidean norm, squared norm. There is no value-order constraint.

## Visual necessity and render status
- Problem visual: NOT_REQUIRED; the formula defines both fixed points and the free point completely.
- Visual spec: none.
- Asset path/hash: none / N/A.
- Problem or solution SVG produced: no.
- Actual browser render: NOT_RUN; no render pass is claimed.
- Self-check: Arithmetic, equality condition, and all five choices were checked by the creator only.