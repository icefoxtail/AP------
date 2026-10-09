# B05_Q18_C01_CENTROID_AREA_SIDE_RECOVERY

## Draft and source
- draftCandidateId: B05_Q18_C01_CENTROID_AREA_SIDE_RECOVERY
- sourceQid: 18
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSha1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSha256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- source-qid disposition: SOURCE_EXPANSION_DONE for the explored centroid/angle-bisector/area structures; independent review remains pending.

## Student prompt and choices

좌표평면 위의 세 점 $A(0,0)$, $B(t,0)$, $C(0,6)$ ($t>0$)를 꼭짓점으로 하는 삼각형 $ABC$가 있다. 삼각형 $ABC$의 내심을 $I$라 하고, 직선 $AI$가 선분 $BC$와 만나는 점을 $H$라 하자. 삼각형 $ABC$의 무게중심을 $G$라 할 때, 삼각형 $GHC$의 넓이가 $2$이다. $t$의 값은?

① $\dfrac34$  
② $\dfrac65$  
③ $3$  
④ $4$  
⑤ $1+\sqrt{13}$

## Exact answer
- Mathematical answer: t=3
- answer: ③

## Detailed student solution
$AI$는 $\angle A$의 이등분선이므로 각의 이등분선 정리에 따라
$BH:HC=AB:AC=t:6$이다. 따라서
$\dfrac{HC}{BC}=\dfrac{6}{t+6}$이다.

삼각형 $ABC$의 넓이는 $\dfrac12\cdot t\cdot6=3t$이다. 무게중심 $G$와 변 $BC$가 만드는 삼각형은 원래 삼각형 넓이의 $\dfrac13$이므로
$[GBC]=t$이다. $GHC$와 $GBC$는 밑변이 각각 $HC$, $BC$이고 같은 높이를 가지므로
$\dfrac{[GHC]}{[GBC]}=\dfrac{HC}{BC}=\dfrac{6}{t+6}$이다. 따라서
$[GHC]=\dfrac{6t}{t+6}$이다.

주어진 넓이가 2이므로
$\dfrac{6t}{t+6}=2$,
$6t=2t+12$,
$4t=12$,
$t=3$이다. 조건 $t>0$도 만족하므로 정답은 ③이다.

## Canonical Primary curriculum and RPM lookup
- Course: 2022 / high / 공통수학2
- Primary L1: 도형의 방정식
- Primary L2: 평면좌표
- Canonical unit: H22-C2-01, order 1
- RPM source record: RPM_H22_C2
- Primary L3: 삼각형의 무게중심, H22-C2 / 공통수학2 / 도형의 방정식 / 평면좌표 / 삼각형의 무게중심; record status CANONICAL_DRAFT.
- Primary L4: 좌표 도형 활용; exact lookup in the current canonical master, status CANONICAL_DRAFT.
- Supporting RPM structure: segment ratio/internal division is used for HC/BC, but the ratio is derived from the incenter's angle bisector, not a coordinate section formula. No separate primary L3 is claimed.
- No new canonical RPM identity is asserted.

## Blueprint exploration before production
- RPM-first lookup covered L3 삼각형의 무게중심 / L4 좌표 도형 활용 and the supporting H1 internal-division record; lower-scope lookup confirmed the angle-bisector and centroid-area facts used in the chain.
- The source-style forward task with fixed vertices and a requested area is a duplicate if only the coordinates or values change. Replacing a point-to-line-distance solution with an area-ratio solution alone is method-only and does not create a blueprint.
- The accepted target instead reverses the relation: a given GHC area determines the unknown side length t. Distance-formula L4 records are not primary here because no distance is needed. No additional EXT L4 is proposed; the existing coordinate-figure application record is the closest exact RPM lookup.
## CrossConcept, Condition, and Integration
- CrossConcept: (1) 2022 / middle / M2-2 / 삼각형의 성질 / 삼각형의 성질 / 각의 이등분선 / 각의 이등분선 성질; and (2) 2022 / middle / M2-2 / 도형의 닮음과 피타고라스 정리 / 삼각형의 무게중심 / 넓이와 무게중심 / 넓이 분할. Both are prior-scope RPM CANONICAL_DRAFT records; no H1 RPM key is claimed for them.
- Condition: The given area of GHC is used to recover the variable side length t.
- Integration: SEQUENTIAL; prior-scope angle-bisector ratio → division of the opposite side → centroid area relation → rational condition on t.

## Independent difficulty assessment
- difficultyLabel: 상
- difficultyBucket: 4
- difficultyConfidence: medium
- difficultyBoundaryFlag: B34
- difficultyBasis: The student must combine an angle-bisector ratio, centroid area, a shared-altitude area ratio, and reverse algebraic recovery. Every step is within previously learned geometry or current plane-coordinate scope.

## Blueprint disposition and duplicate rationale
- blueprintFingerprint: ANGLE_BISECTOR_CENTROID_SUBAREA_TO_RECOVER_BASE_LENGTH
- CREATE disposition: ACCEPT under existing RPM L4 coordinate-figure application; independent review is pending.
- Unique semantic blueprint count for this candidate: one existing-RPM-backed blueprint fingerprint.
- Numeric instance count: one.
- Duplicate rationale: Recomputing the area for a fixed coordinate triangle, even by an area-ratio solution instead of point-to-line distance, is a method-only/numeric variant of the source and is not treated as a new blueprint. This candidate reverses the target: the subtriangle area condition recovers an unknown side length.

## Misconception-based distractors and answer position
- ① 3/4: use the whole area [ABC]=3t instead of the centroid subtriangle area [GBC]=t, then apply HC/BC.
- ② 6/5: use [GBC]=2/3[ABC] rather than 1/3[ABC].
- ③ 3: correct angle-bisector ratio, centroid-area ratio, and algebra.
- ④ 4: treat the angle bisector AI as a median and set HC/BC=1/2.
- ⑤ 1+√13: reverse the angle-bisector ratio, using HC/BC=t/(t+6); solve t²/(t+6)=2 and retain the positive root.
- Planned answer position: ③.
- Placement rationale: The numerical answers appear in increasing order, with the correct value naturally in the middle. There is no forced-answer-position reordering.

## Visual necessity and render status
- Problem visual: NOT_REQUIRED; the coordinates, axes-aligned side lengths, incenter, angle-bisector intersection, and area condition are all explicit.
- Visual spec: none.
- Asset path/hash: none / N/A.
- Problem or solution SVG produced: no.
- Actual browser render: NOT_RUN; no render pass is claimed.
- Self-check: Area and ratio calculation and uniqueness for t>0 were checked by the creator only.