# B06_Q05_C01 — 두 점으로 정한 직선과 교점

- draftCandidateId: B06_Q05_C01_TWO_POINT_LINE_INTERSECTION
- batchId: B06; sourceQid: 5 (literal window.questionBank[].id)
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSha1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSha256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- generatedBy: gpt-6-luna / max
- candidateStatus: CREATE_DRAFT; independentReview: NOT_RUN; renderStatus: NOT_RUN

## Source and blueprint exploration

Source q5 finds a segment midpoint and perpendicular slope, then writes the perpendicular-bisector equation. It has no student figure and no source HOLD.

| Blueprint | Exact course L3/L4 path | Disposition |
|---|---|---|
| Standalone point-and-slope line, same terminal construction as the source | L3-1.2.1 직선의 방정식 / L4-1.2.1.1 한 점과 기울기 | DUPLICATE — preserves the source's central line-construction step. |
| Form a line through two points, then find its intersection with another line | L3-1.2.1 / L4-1.2.1.2 두 점을 지나는 직선; supporting L3-1.2.2 / L4-1.2.2.3 교점 | ACCEPT — B06_Q05_C01_TWO_POINT_LINE_INTERSECTION. Direct line through the points, followed by a separate intersection system; source instead uses midpoint and negative reciprocal slope. |
| Find the intersection of two lines, then construct a parallel line through it | L3-1.2.1 / L4-1.2.1.1 한 점과 기울기; supporting L3-1.2.2 / L4-1.2.2.1 평행 and L4-1.2.2.3 교점 | ACCEPT — B06_Q05_C02_INTERSECTION_PARALLEL_LINE. The point is derived first and a parallel direction is then transported; distinct from the direct two-point line blueprint. |
| Perpendicular-line construction | L3-1.2.2 / L4-1.2.2.2 수직 | DUPLICATE — retains the source's defining perpendicular relation; coefficient changes are instances. |
| Standalone intersection with no line-construction goal | L3-1.2.2 / L4-1.2.2.3 교점 | DUPLICATE — the intersection step is already represented inside both accepted candidates. |

Source-qid close: SOURCE_EXPANSION_DONE for the examined line-equation and directly related line-relation structures. Two distinct accepted blueprints are complete for q5. No EXT L3/L4 is indicated by the exact current-scope lookup. Numeric-only variants: 0; unresolved holds: none.

## Student-facing question

두 점 $A(-2,5)$, $B(4,-1)$를 지나는 직선을 $\ell$이라 하자. 직선 $\ell$과 직선 $m:2x-y=1$의 교점을 $P=(p,q)$라 할 때, $P$의 좌표는?

① $\left(\dfrac53,\dfrac43\right)$  
② $\left(-\dfrac23,-\dfrac73\right)$  
③ $(8,15)$  
④ $\left(\dfrac43,\dfrac53\right)$  
⑤ $\left(\dfrac23,\dfrac73\right)$

## Exact answer and detailed student solution

**정답 ④** \(P=\left(\dfrac43,\dfrac53\right)\)

두 점 \(A(-2,5)\), \(B(4,-1)\)을 지나는 직선 \(\ell\)의 기울기는 \(\dfrac{-1-5}{4-(-2)}=-1\)이다. 따라서
\[y-5=-(x+2)\iff x+y=3.\]
이를 \(m:2x-y=1\)과 연립하면 \(3x=4\), 즉 \(x=\dfrac43\)이다. \(y=3-\dfrac43=\dfrac53\)이므로 교점은 \(P=\left(\dfrac43,\dfrac53\right)\)이다. 정답은 ④이다.

## Meta and curriculum proposal

- Primary L1/L2: 도형의 방정식 → 직선의 방정식.
- Target: 2022 공통수학2, H22-C2-02, subUnitKey H22-C2-02-RELATION.
- Primary course L3/L4 proposal: L3-1.2.2 두 직선의 위치 관계 → L4-1.2.2.3 교점.
- Supporting course L3/L4 proposal: L3-1.2.1 직선의 방정식 → L4-1.2.1.2 두 점을 지나는 직선.
- Exact RPM-first lookup: these exact course paths occur in the 2022 공통수학2 course document and the RPM Primary L1/L4 matrix. L1/L2 are RPM_VERIFIED; L3/L4 are CANONICAL_DRAFT, so this remains a CREATE proposal for independent review, not an RPM-locked assignment.
- Current active crosswalk: 교점 → PT_LINE_RELATION / TPL_RELATION_MULTIPLE_POSITION, DIRECT_ACTIVE with ACTIVE H22-C2-02-RELATION binding. Two points → PT_LINE_EQUATION / TPL_LINE_TWO_POINTS, DIRECT_ACTIVE with ACTIVE H22-C2-02-LINE_EQUATION binding.
- CrossConcept: none; both steps are within this L1/L2. Condition: no separate canonical Condition key asserted. IntegrationPattern: SEQUENTIAL (construct line, then find intersection).
- Candidate kind: RPM_EXISTING; no extension L3/L4 candidate or registry change.
- Curriculum: PASS for H1 2022 공통수학2; uses slope, line equations, and a linear system.
- Tags: 객관식, 두 점을 지나는 직선, 두 직선의 교점.

## Independent difficulty and distractors

- Author estimate from this completed prompt: bucket 3/5, 중, medium confidence, boundary NONE. Two standard steps must be linked; this does not reuse source q5's difficulty.
- ① reverses the coordinates. ② gives the point-line constant the wrong sign, obtaining $x+y=-3$. ③ computes the slope of AB as $+1$ instead of $-1$, obtaining $y=x+7$. ⑤ changes $2x-y=1$ to $y=2x+1$.
- Intended answer position: ④. No ordering constraint. Across the two B06 MC candidates, C01→④ and C02→②; current histogram ④=1, ②=1. With two items, each is 50%, a small-sample distribution warning for the whole-exam pool.

## Visual necessity and self-check boundary

No student figure is necessary; all coordinates and equations are explicit. Visual spec/path/hash: none / none / none. Render: NOT_RUN; no visual render required. Author self-check covered slope, intersection, answer, and distractor arithmetic. Independent answer review has not run.
