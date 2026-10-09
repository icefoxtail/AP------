# B05_Q09_C01_CENTROID_RATIO_RECOVERY

## Draft and source
- draftCandidateId: B05_Q09_C01_CENTROID_RATIO_RECOVERY
- sourceQid: 9
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSha1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSha256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- Source-figure review: archive/assets/images/25_팔마고_2학기_중간_고1_기출/q09.png was opened at original 389x362 resolution; SHA-256 2C82FBFCE30952D66A417B721553A7F0D4D2F6EC13856BDD554BE0EF375EFFC8. The diagram shows O, A, B and the three edge-division points; this candidate states every incidence and ratio in text, so it does not require that figure.
- source-qid disposition: SOURCE_EXPANSION_DONE for the explored coordinate-division/centroid structures; independent review remains pending.

## Student prompt and choices

좌표평면 위의 세 점 $A(0,0)$, $B(6,0)$, $C(0,9)$를 꼭짓점으로 하는 삼각형 $ABC$가 있다. 점 $P,Q,R$를 각각 선분 $AB$, $BC$, $CA$ 위에 잡아
$AP:PB=BQ:QC=2:1$, $CR:RA=k:1$ ($k>0$)이 되게 한다. 삼각형 $PQR$의 무게중심과 삼각형 $ABC$의 무게중심이 일치할 때, $k$의 값은?

① $\dfrac12$  
② $\dfrac32$  
③ $3$  
④ $8$  
⑤ $2$

## Exact answer
- Mathematical answer: k=2
- answer: ⑤

## Detailed student solution
$AP:PB=2:1$이므로 $P=(4,0)$이다. $BQ:QC=2:1$이므로
$Q=\left(\dfrac{1\cdot6+2\cdot0}{3},\dfrac{1\cdot0+2\cdot9}{3}\right)=(2,6)$이다.

$CR:RA=k:1$에서 $R$은 $C$에서 $A$ 쪽으로 전체 선분의 $\dfrac{k}{k+1}$만큼 이동한 점이다. 따라서
$R=\left(0,\dfrac{9}{k+1}\right)$이다. 원래 삼각형의 무게중심은
$G=\left(\dfrac{0+6+0}{3},\dfrac{0+0+9}{3}\right)=(2,3)$이고, $PQR$의 무게중심은
$G'=\left(\dfrac{4+2+0}{3},\dfrac{0+6+\frac{9}{k+1}}{3}\right)
=\left(2,2+\dfrac{3}{k+1}\right)$이다.

두 무게중심이 일치하므로
$2+\dfrac{3}{k+1}=3$이다. 따라서 $k+1=3$, $k=2$이다. $k>0$에서 이 해는 허용되며 유일하다.

## Canonical Primary curriculum and RPM lookup
- Course: 2022 / high / 공통수학2
- Primary L1: 도형의 방정식
- Primary L2: 평면좌표
- Canonical unit: H22-C2-01, order 1
- RPM source record: RPM_H22_C2
- Primary L3: 삼각형의 무게중심, H22-C2 / 공통수학2 / 도형의 방정식 / 평면좌표 / 삼각형의 무게중심; record status CANONICAL_DRAFT.
- Primary L4: 좌표 도형 활용; exact lookup in the current canonical master, status CANONICAL_DRAFT.
- Supporting L3/L4: 선분의 내분·외분 / 내분점; exact lookup in the current canonical master, status CANONICAL_DRAFT. This is supporting structure under the same H22-C2-01, not a separate primary unit.
- No new canonical RPM identity is asserted.

## Blueprint exploration before production
- RPM-first lookup covered L3 선분의 내분·외분 / L4 내분점 and L3 삼각형의 무게중심 / L4 좌표로 무게중심·좌표 도형 활용. The accepted blueprint combines the two in sequence and reverses the target to recover an unknown directed ratio from centroid coincidence.
- The source-style task with all three ratios fixed and the centroid directly calculated is a duplicate blueprint; changing only coordinates, signs, labels, or the common fixed ratio remains a numeric instance.
- L4 외분점 was excluded: all candidate points lie on the triangle sides, and the 2022 Common Math 2 master marks that record RPM_EXTENDED_CANDIDATE with defaultSelectable=false. Distance L3 candidates were also excluded because no distance is used.
## CrossConcept, Condition, and Integration
- CrossConcept: None; the task remains within the plane-coordinate division and centroid records.
- Condition: Coincidence of the two centroids is the given condition used to recover the unknown directed edge-division ratio.
- Integration: SEQUENTIAL; find division-point coordinates, then compare the two centroid coordinate averages to recover k.

## Independent difficulty assessment
- difficultyLabel: 상
- difficultyBucket: 4
- difficultyConfidence: medium
- difficultyBoundaryFlag: B34
- difficultyBasis: Three directed division descriptions must be translated consistently, then a centroid equality is converted into a one-variable condition. The arithmetic is simple, but the reverse target adds a meaningful reasoning step.

## Blueprint disposition and duplicate rationale
- blueprintFingerprint: CENTROID_PRESERVATION_TO_RECOVER_UNKNOWN_CYCLIC_EDGE_RATIO
- CREATE disposition: ACCEPT under existing RPM L4 coordinate-figure application; independent review is pending.
- Unique semantic blueprint count for this candidate: one existing-RPM-backed blueprint fingerprint.
- Numeric instance count: one.
- Duplicate rationale: A direct request to calculate the centroid from three already fixed division ratios, as in the source, is a duplicate blueprint; changing only coordinates, signs, names, or the common ratio does not create another type. This candidate changes the target to recover an unknown ratio from centroid coincidence, so it is not counted as a number-only variant of the source task.

## Misconception-based distractors and answer position
- ① 1/2: reverse the endpoint weights in the internal-division formula, using the coefficient k on C instead of on A.
- ② 3/2: misread CR:RA=k:1 as CR/CA=1/k, giving R_y=9(1-1/k).
- ③ 3: use 9/k for the R coordinate, omitting the total ratio k+1.
- ④ 8: average P_y and Q_y but fail to divide R_y by 3 in the centroid formula.
- ⑤ 2: correct directed-division and centroid-equality calculation.
- Planned answer position: ⑤.
- Placement rationale: The four positions before the answer correspond in order to four distinct modeled errors (weight reversal, midpoint substitution, omitted total ratio, omitted centroid averaging). They are not random distractors or numeric variants.

## Visual necessity and render status
- Problem visual: NOT_REQUIRED; the coordinates, side incidences, and directed ratios are fully stated.
- Visual spec: none.
- Asset path/hash: none / N/A.
- Problem or solution SVG produced: no.
- Actual browser render: NOT_RUN; no render pass is claimed.
- Self-check: Directed ratios, both centroid coordinates, and uniqueness were checked by the creator only.