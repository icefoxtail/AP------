# B06_Q05_C02 — 교점에서 시작하는 평행선 방정식

- draftCandidateId: B06_Q05_C02_INTERSECTION_PARALLEL_LINE
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

두 직선 $\ell_1:2x+y=7$, $\ell_2:x-y=2$의 교점을 $P$라 하자. 직선 $m:3x-2y+1=0$에 평행하고 $P$를 지나는 직선의 방정식은?

① $2x+3y-9=0$  
② $3x-2y-7=0$  
③ $3x-2y+1=0$  
④ $3x-2y-21=0$  
⑤ $2x-3y-3=0$

## Exact answer and detailed student solution

$3x-2y-7=0$, choice ②.

From $x-y=2$, $y=x-2$. Substitution into $2x+y=7$ gives $3x=9$, so $P=(3,1)$.

The line $m:3x-2y+1=0$ is $y=\dfrac32x+\dfrac12$, so its slope is $\dfrac32$. A parallel line through $P$ is
\[
y-1=\dfrac32(x-3).
\]
Rearranging gives $3x-2y-7=0$. This is the unique line with that slope through $P$.

## Meta and curriculum proposal

- Primary L1/L2: 도형의 방정식 → 직선의 방정식.
- Target: 2022 공통수학2, H22-C2-02, subUnitKey H22-C2-02-LINE_EQUATION.
- Primary course L3/L4 proposal: L3-1.2.1 직선의 방정식 → L4-1.2.1.1 한 점과 기울기.
- Supporting course L3/L4 proposals: L3-1.2.2 두 직선의 위치 관계 → L4-1.2.2.1 평행 and L4-1.2.2.3 교점.
- Exact RPM-first lookup: these exact course paths occur in the 2022 공통수학2 course document and RPM Primary L1/L4 matrix. L1/L2 are RPM_VERIFIED; L3/L4 are CANONICAL_DRAFT, so this remains a CREATE proposal for independent review, not an RPM-locked assignment.
- Current active crosswalk: primary 한 점과 기울기 → PT_LINE_EQUATION / TPL_LINE_POINT_SLOPE, DIRECT_ACTIVE with ACTIVE H22-C2-02-LINE_EQUATION binding. Supporting parallel and 교점 paths also exist as DIRECT_ACTIVE with ACTIVE H22-C2-02-RELATION bindings; only the primary projection is proposed here.
- CrossConcept: none; all mathematics is within this L1/L2. Condition: intersection-defined point, with no separate canonical Condition key asserted. IntegrationPattern: SEQUENTIAL (solve point, transfer parallel direction, form equation).
- Candidate kind: RPM_EXISTING; no extension L3/L4 candidate or registry change.
- Curriculum: PASS for H1 2022 공통수학2; uses linear systems, slope, and parallel lines.
- Tags: 객관식, 평행, 교점, 한 점과 기울기.

## Independent difficulty and distractors

- Author estimate from this completed prompt: bucket 3/5, 중, medium confidence, boundary NONE. The student links a solved intersection to a parallel-line construction; no difficult algebra or case split. This does not reuse source q5's difficulty.
- ① uses the negative reciprocal slope. ③ copies m and misses P. ④ reads $x-y=2$ as $x+y=2$, gets the false point $(5,-3)$, then translates the slope. ⑤ uses slope $\dfrac23$ instead of $\dfrac32$.
- Intended answer position: ②. No ordering constraint. Across the two B06 MC candidates, C01→④ and C02→②; current histogram ④=1, ②=1. With two items, each is 50%, a small-sample distribution warning for the whole-exam pool.

## Visual necessity and self-check boundary

No student figure is necessary; all lines and conditions are stated algebraically. Visual spec/path/hash: none / none / none. Render: NOT_RUN; no visual render required. Author self-check covered intersection, slope, line equation, exact answer, and distractor calculations. Independent answer review has not run.
