# B06_Q23_C01 — 매개변수 교점과 두 직선까지의 같은 거리

- draftCandidateId: B06_Q23_C01_PARAMETER_INTERSECTION_EQUIDISTANCE
- batchId: B06; sourceQid: 23 (literal window.questionBank[].id)
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSha1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSha256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- generatedBy: gpt-6-luna / max
- candidateStatus: CREATE_DRAFT; independentReview: NOT_RUN; renderStatus: NOT_RUN

## Source and blueprint disposition

Source q23 is constructed response and has no student question figure. Its written solution turns two fixed-distance conditions into two pairs of parallel lines, identifies four intersections as a parallelogram, and finds its area. The source audit lists its SVG only as solutionImage. That SVG is not used here and is not a student visual dependency.

| Blueprint | Exact course L3/L4 path | Disposition |
|---|---|---|
| A point on a parameterized line is equidistant from two fixed lines | L3-1.2.3 점과 직선 사이의 거리 / L4-1.2.3.1 거리 공식; supporting L3-1.2.2 두 직선의 위치 관계 / L4-1.2.2.3 교점 | ACCEPT — this candidate. First find the moving intersection, then equate two point-line distance formulas and solve the resulting absolute-value cases. It does not form four distance-locus intersections or compute area. |
| Two fixed-distance loci become parallel-line pairs; find area/minimum distance | L3-1.2.3 / L4-1.2.3.2 도형의 넓이·최소거리 | DUPLICATE — this is the source q23 blueprint. Changing coefficients, values, or labels alone would be a numeric/surface instance. |
| A standalone line intersection without a distance condition | L3-1.2.2 / L4-1.2.2.3 교점 | DUPLICATE — the intersection is a required support step inside the accepted distance blueprint. |

Source-qid close: SOURCE_EXPANSION_DONE for both L4s under the source distance L3; the related intersection path is used as a support step. One distinct accepted blueprint is complete for q23. No extension L3/L4 is indicated by exact current-scope paths. Numeric-only variants: 0; unresolved holds: none.

## Student-facing question

실수 $t$에 대하여 직선 $\ell_t:y=2x+t$와 직선 $m:x+y=6$의 교점을 $P_t$라 하자. 점 $P_t$에서 직선 $n_1:3x-4y+10=0$, $n_2:4x+3y=0$까지의 거리가 서로 같을 때, 가능한 모든 $t$의 값을 풀이 과정과 함께 구하시오.

## Constructed-response contract

서술형이다. 가능한 모든 실수 $t$를 빠짐없이 제시하고, 먼저 $P_t$를 구한 다음 두 점-직선 거리식을 세우고 절댓값의 경우를 나누어 풀이한다. Student figure: none. Proposed 6-point rubric: intersection (2), both distance expressions (2), complete sign-case analysis and all solutions (2).

## Exact answer and detailed student solution

Answer: $t=-10$ 또는 $t=\dfrac{15}{2}$, 즉 $t\in\left\{-10,\dfrac{15}{2}\right\}$.

Let $P_t=(x,y)$. From $y=2x+t$ and $x+y=6$,
\[
3x+t=6,\qquad x=\dfrac{6-t}{3},\qquad y=6-x=\dfrac{12+t}{3}.
\]

The normal-vector lengths for both $n_1$ and $n_2$ are $5$. For $n_1$,
\[
\begin{aligned}
3x-4y+10
&=(6-t)-\dfrac{48+4t}{3}+10\\
&=\dfrac{18-3t-48-4t+30}{3}
=-\dfrac{7t}{3}.
\end{aligned}
\]
Thus $d(P_t,n_1)=\dfrac{7|t|}{15}$.

For $n_2$,
\[
4x+3y
=\dfrac{24-4t+36+3t}{3}
=\dfrac{60-t}{3},
\]
so $d(P_t,n_2)=\dfrac{|60-t|}{15}$.

Equating the distances gives
\[
7|t|=|60-t|.
\]
If $t<0$, then $|t|=-t$ and $|60-t|=60-t$, so
\[
-7t=60-t,\qquad t=-10.
\]
If $0\le t\le60$, then
\[
7t=60-t,\qquad t=\dfrac{15}{2}.
\]
If $t>60$, then $7t=t-60$, which would give $t=-10$ and contradict $t>60$. Therefore the complete solution set is
\[
t=-10,\quad \dfrac{15}{2}.
\]
Both values satisfy the original distance equality.

## Meta and curriculum proposal

- Primary L1/L2: 도형의 방정식 → 직선의 방정식.
- Target: 2022 공통수학2, H22-C2-02, subUnitKey H22-C2-02-RELATION.
- Primary course L3/L4 proposal: L3-1.2.3 점과 직선 사이의 거리 → L4-1.2.3.1 거리 공식.
- Supporting course L3/L4 proposal: L3-1.2.2 두 직선의 위치 관계 → L4-1.2.2.3 교점.
- Exact RPM-first lookup: these paths occur in the current 2022 공통수학2 course document and RPM Primary matrix. L1/L2 are RPM_VERIFIED; L3/L4 are CANONICAL_DRAFT, so the mapping is a CREATE proposal pending independent review.
- Current active crosswalk: 거리 공식 → PT_POINT_LINE_DISTANCE / TPL_POINT_LINE_DISTANCE_DIRECT, DIRECT_ACTIVE with ACTIVE H22-C2-02-RELATION binding. Supporting 교점 is also DIRECT_ACTIVE with the same exact unit binding.
- CrossConcept: none asserted; intersection and both distances are within the assigned L1/L2. Condition: equal distances from $P_t$ to $n_1$ and $n_2$; no independent canonical Condition key asserted. IntegrationPattern: SEQUENTIAL (parameterized intersection, two distance formulas, absolute-value cases).
- Candidate kind: RPM_EXISTING; no extension L3/L4 candidate or registry mutation.
- Curriculum: PASS for H1 2022 공통수학2; uses only linear systems, point-line distance, and absolute values. The written solution does not rely on angle-bisector facts.
- Tags: 서술형, 직선의 방정식, 두 직선의 교점, 점과 직선 사이의 거리, 절댓값, 매개변수.

## Independent difficulty estimate

Author estimate from the finished prompt and shortest valid solution: bucket 4/5, level 상, medium confidence, boundary NONE. Students retain a parameter through a linear intersection, form and equate two distances, then check sign intervals. This resembles the source's multistep workload without copying its four-locus parallelogram-area structure; it does not copy source q23's difficulty label.

## Visual necessity and self-check boundary

No student figure is necessary because the line equations, parameter, and equality condition are explicit. Source q23 solution-only SVG is unused. Visual spec/path/hash: none / none / none. Render: NOT_RUN. Author self-check recomputed the intersection, both denominators and signed numerators, each sign case, and both valid parameter values. Independent review is NOT_RUN.
