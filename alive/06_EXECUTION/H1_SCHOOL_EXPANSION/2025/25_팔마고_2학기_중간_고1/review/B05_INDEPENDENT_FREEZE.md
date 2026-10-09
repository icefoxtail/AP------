# B05 Independent Blind Freeze

- Phase: REVIEW phase 1, independent student-facing solve only
- Student-only packet: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/review-blind/B05_STUDENT_ONLY.md`
- Packet SHA-256: `1A80368C01179F117B77225A3DBF15AB9541AFEB775B5F4EACE128CC2CFC7593`
- The packet references no student-facing figure or visual asset. The Q09 coordinates and division ratios fully specify its geometry; Q18 is also completely specified by coordinates and definitions. No asset SHA applies.
- Answer/solution material was not consulted.

## B05_Q04_C01_DISTANCE_SUM_MIN

**Independent answer:** ④, 10.

The expression is the sum of distances from variable point \(X=(x,y)\) to fixed points \(U=(-2,3)\) and \(V=(4,11)\). By the triangle inequality, \(XU+XV\ge UV\). The fixed-point distance is
\[
UV=\sqrt{(4-(-2))^2+(11-3)^2}=\sqrt{36+64}=10.
\]
Equality is attainable for every X on the segment UV, so the minimum is 10.

**Five-choice audit:** ① 6 is the horizontal coordinate difference only. ② 8 is the vertical difference only. ③ 14 adds coordinate differences instead of taking Euclidean distance. ④ is the endpoint distance and the attainable minimum. ⑤ 100 is the squared endpoint distance, not the distance sum. Exactly one choice is correct.

**Ambiguity / visual dependence:** None. The expression determines the two fixed points and unrestricted X; no figure is required.

## B05_Q09_C01_CENTROID_RATIO_RECOVERY

**Independent answer:** ⑤, \(k=2\).

From \(AP:PB=2:1\), \(P=(4,0)\). From \(BQ:QC=2:1\), Q is two-thirds of the way from B to C, so \(Q=(2,6)\). Let \(R=(0,r)\). Since \(CR:RA=k:1\), \((9-r):r=k:1\), giving \(r=9/(k+1)\). Thus the centroid of PQR is
\[
\left(\frac{4+2+0}{3},\frac{0+6+9/(k+1)}3\right)=\left(2,2+\frac3{k+1}\right).
\]
The centroid of ABC is \((2,3)\). Equality of the y-coordinates gives \(2+3/(k+1)=3\), hence \(k=2\), valid for \(k>0\).

**Five-choice audit:** ① \(k=1/2\), ② \(k=3/2\), ③ \(k=3\), and ④ \(k=8\) do not satisfy \(3/(k+1)=1\). ⑤ \(k=2\) does. The five values are distinct and exactly one works.

**Ambiguity / visual dependence:** None in the supplied student packet. All three vertices, side division ratios, and the centroid condition are explicit; no figure or figure specification is referenced. The ratio \(CR:RA\) fixes R unambiguously on CA for positive k.

## B05_Q18_C01_CENTROID_AREA_SIDE_RECOVERY

**Independent answer:** ③, \(t=3\).

The incenter lies on the angle bisector AI, so by the angle-bisector theorem \(BH:HC=AB:AC=t:6\). With B=(t,0) and C=(0,6), this gives
\[
H=\left(\frac{6t}{t+6},\frac{6t}{t+6}\right).
\]
The centroid is \(G=(t/3,2)\). Using C as the origin for the area determinant,
\[
[ GHC ]=\frac12\left|\det\begin{pmatrix}6t/(t+6)&-36/(t+6)\\ t/3&-4\end{pmatrix}\right|=\frac{6t}{t+6}.
\]
Set this equal to 2: \(6t/(t+6)=2\), so \(t=3\), which satisfies \(t>0\).

**Five-choice audit:** ① \(t=3/4\) gives area \(2/3\); ② \(t=6/5\) gives area 1; ③ \(t=3\) gives area 2; ④ \(t=4\) gives area \(12/5\); ⑤ \(t=1+\sqrt{13}\) gives an area greater than 2 (indeed \(6t/(t+6)>2\) iff \(t>3\)). The options are distinct and only ③ satisfies the condition.

**Ambiguity / visual dependence:** None. For \(t>0\), the right triangle is nondegenerate, its incenter angle bisector meets BC at a unique H, and the area is fully determined by the coordinate data. No figure is required.
