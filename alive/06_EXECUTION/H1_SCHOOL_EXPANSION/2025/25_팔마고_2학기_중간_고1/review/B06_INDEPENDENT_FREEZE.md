# B06 Independent Blind Freeze

- Phase: REVIEW phase 1, independent student-facing solve only
- Student-only packet: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/review-blind/B06_STUDENT_ONLY.md`
- Packet SHA-256: `5CE5A428520C0CF35A3A8F59DCAED984F7C66FA59FFE09C101C546CAB41E652B`
- All three packet items specify no student-facing figures; no visual asset hash applies.
- Answer/solution material was not consulted.

## B06_Q05_C01_TWO_POINT_LINE_INTERSECTION

**Independent answer:** ④, \(P=(4/3,5/3)\).

The line through A(-2,5) and B(4,-1) has slope -1 and equation \(x+y=3\). The second line is \(y=2x-1\). Solving gives \(3x=4\), so \(x=4/3\) and \(y=5/3\).

**Five-choice audit:** ① satisfies \(x+y=3\) but has \(2x-y=2\), not 1. ② fails \(x+y=3\). ③ satisfies \(2x-y=1\) but fails \(x+y=3\). ④ satisfies both equations. ⑤ satisfies \(x+y=3\) but has \(2x-y=-1\). Exactly one choice is correct.

**Ambiguity / visual dependence:** None. Both lines and their defining data are explicit; no figure is specified.

## B06_Q05_C02_INTERSECTION_PARALLEL_LINE

**Independent answer:** ②, \(3x-2y-7=0\).

From \(x-y=2\), \(y=x-2\). Substitution in \(2x+y=7\) gives \(x=3,y=1\). A line parallel to \(3x-2y+1=0\) has form \(3x-2y+c=0\). Passing through (3,1) gives \(9-2+c=0\), hence \(c=-7\).

**Five-choice audit:** ① passes through (3,1) but has a different normal vector/slope. ② is parallel and passes through P. ③ has the required direction but does not pass through P. ④ also has the direction but not P. ⑤ passes through P but has a different direction. Exactly one choice meets both conditions.

**Ambiguity / visual dependence:** None. The equations determine P and the required direction; no figure is specified.

## B06_Q23_C01_PARAMETER_INTERSECTION_EQUIDISTANCE

**Independent constructed response:** \(t=-10\) or \(t=15/2\).

Intersect \(y=2x+t\) with \(x+y=6\):
\[
P_t=\left(\frac{6-t}{3},\frac{12+t}{3}\right).
\]
The normal vectors of \(n_1\) and \(n_2\) both have length 5. Substitution gives
\[
3x-4y+10=-\frac{7t}{3},\qquad 4x+3y=\frac{60-t}{3},
\]
so the two distances are \(7|t|/15\) and \(|60-t|/15\). Equating them gives \(7|t|=|60-t|\).

Absolute-value cases:
- If \(t<0\), then \(-7t=60-t\), giving \(t=-10\), valid.
- If \(0\le t\le60\), then \(7t=60-t\), giving \(t=15/2\), valid.
- If \(t>60\), then \(7t=t-60\), which gives \(t=-10\), inconsistent with the case.

Thus the complete solution set is \(\{-10,15/2\}\). At the two solutions the common distances are respectively \(14/3\) and \(7/2\), which provides a direct check.

**Response/cardinality audit:** Constructed response; no MC option count applies. Both real solutions and all three requested derivation components (intersection, both distances, absolute-value cases) are supplied.

**Ambiguity / visual dependence:** None. All lines and distance conditions are explicit; no figure is referenced.
