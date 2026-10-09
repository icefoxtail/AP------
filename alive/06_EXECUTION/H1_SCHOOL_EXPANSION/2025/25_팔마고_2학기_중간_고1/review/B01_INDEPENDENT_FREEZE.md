# B01 Independent Blind Freeze

- Phase: REVIEW phase 1, independent student-facing solve only
- Student-only packet: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/candidates/B01_원의 방정식/review-blind/B01_STUDENT_ONLY.md`
- Packet SHA-256: `6ED435EEE52163422ED950875A910157575DE95B5195DF28B75926F4072FBB2F`
- The packet specifies no separate figure for item 0005; its circle equations and half-plane restrictions are the complete locus specification. No external visual asset was named.
- Answer/solution material was not consulted.

## ALITE-B01-2025PALMA-0001

**Independent answer:** ②, \(x^2+(y-5)^2=25\).

Because A and B have the same y-coordinate and are symmetric about the y-axis, the perpendicular bisector of AB is the y-axis. The center is \((0,c)\); being above segment AB requires \(c>1\). Radius 5 gives \(9+(c-1)^2=25\), so \(c=5\) or \(-3\), and the above-segment condition selects \(c=5\).

**Five-choice audit:** ① has center (0,1), whose distance to A and B is 3, not 5. ② has center (0,5), radius 5, passes through both endpoints, and is above AB. ③ has center (0,-3), radius 5 and passes through both points but is below AB. ④ has center (3,1), not on the y-axis and not at radius 5 from A. ⑤ has center (0,5) but radius \(\sqrt5\), not 5. Exactly one choice meets every condition.

**Ambiguity / visual dependence:** None. Coordinates and the center-side condition are explicit; no diagram is needed.

## ALITE-B01-2025PALMA-0002

**Independent answer:** ①, \(k=-3\).

Complete squares:
\[
x^2+y^2-6x+4y+k=(x-3)^2+(y+2)^2+k-13.
\]
Thus radius squared is \(13-k\). Setting this equal to \(4^2=16\) gives \(k=-3\).

**Five-choice audit:** ① gives radius squared 16. For ② \(k=3\), radius squared is 10; ③ \(k=-16\) gives 29; ④ \(k=13\) gives radius 0 (not radius 4); and ⑤ \(k=29\) gives a negative radius-squared constant, not a real circle. Exactly one value produces radius 4.

**Ambiguity / visual dependence:** None. The equation and target radius are explicit.

## ALITE-B01-2025PALMA-0003

**Independent answer:** ④, 119 integers.

The circle has radius 13. The distance from its center to \(3x+4y+k=0\) is \(|k|/5\). A chord at distance d from the center has length \(2\sqrt{13^2-d^2}\). For two distinct intersections with chord length greater than 10:
\[
2\sqrt{169-k^2/25}>10\iff169-k^2/25>25\iff |k|<60.
\]
This strict inequality also ensures the line is secant. The integers are -59 through 59 inclusive, totaling 119.

**Five-choice audit:** ① 59 counts only one of the two signed sides; ② 60 incorrectly includes a boundary count; ③ 118 misses one endpoint-side integer; ④ is the count from -59 through 59; ⑤ 120 corresponds to an incorrectly inclusive bound. Exactly one choice is correct.

**Ambiguity / visual dependence:** None. The line, circle, and strict chord threshold determine the result; no figure is required.

## ALITE-B01-2025PALMA-0004

**Independent answer:** ⑤, \(OT=5\sqrt5\).

For a circle centered at O with radius 5 and an external point T, the chord of contact PQ has perpendicular distance d from O satisfying \(OT\cdot d=5^2\) (equivalently, the polar/chord-of-contact equation is \(tx+2ty=25\)). Given \(d=\sqrt5\),
\[
OT=25/\sqrt5=5\sqrt5.
\]
Since \(OT=\sqrt5t\) and \(t>0\), this is consistent with \(t=5\) and T outside the circle.

**Five-choice audit:** ①, ②, ③, and ④ give lengths 5, \(5\sqrt2\), \(5\sqrt3\), and 10, none of which satisfies \(OT\cdot\sqrt5=25\). ⑤ gives \(5\sqrt5\), the unique required length.

**Ambiguity / visual dependence:** None. The center, radius, point coordinates, tangent construction, and chord distance suffice; no figure is required.

## ALITE-B01-2025PALMA-0005

**Independent answer:** ③, \(m>0\).

Parameterize the line by \((x,mx)\). On the full circle \(C_0\), every line through the origin has two distinct intersections because its radius is 4. For \(C_1\), substitution gives
\[
(x+2)^2+m^2x^2=4\iff x((1+m^2)x+4)=0,
\]
so one intersection is the origin and the other is \((-4/(1+m^2),-4m/(1+m^2))\). The nonzero point satisfies \(y\le0\) exactly when \(m\ge0\). For \(C_2\), the nonzero point is \((4/(1+m^2),4m/(1+m^2))\), satisfying \(y\ge0\) exactly when \(m\ge0\); its other intersection is also the origin.

When \(m>0\), the two nonzero arc points are distinct from each other, have distance \(4/\sqrt{1+m^2}<4\) from the origin, and so are distinct from both \(C_0\) intersections. The origin is shared by the two small arcs but is not on \(C_0\). Total: 2+2+2 minus the shared arc origin = 5 distinct points. At \(m=0\), the arc nonzero points are (-4,0) and (4,0), already the two intersections with \(C_0\), so there are only 3 distinct points. At \(m<0\), both nonzero small-circle points violate their respective half-plane restrictions; only the shared origin is added to the two \(C_0\) intersections, again giving 3. Therefore exactly \(m>0\) works.

**Five-choice audit:** ① \(m<0\) yields 3; ② includes \(m=0\), which yields 3; ③ is exactly the valid range; ④ includes negative slopes, which yield 3; ⑤ includes zero and negative slopes, which fail. Exactly one choice yields five distinct points.

**Ambiguity / visual dependence:** No separate figure is required. Each locus is fully specified by its equation and half-plane restriction. Counting distinct union points is essential: the origin is shared by the two small arcs, and when \(m=0\) their other intersections coincide with \(C_0\)'s endpoints. No ambiguity found.

## ALITE-B01-2025PALMA-0006

**Independent constructed response:** \((x-3)^2+(y-1)^2=10\).

The perpendicular bisector of AB, where A=(0,0) and B=(6,0), is \(x=3\); write the circumcenter as \((3,c)\). Equating squared distances to A and C=(2,4):
\[
9+c^2=1+(c-4)^2=17-8c+c^2,
\]
so \(c=1\). The center is (3,1), and its squared radius is \((3-0)^2+(1-0)^2=10\). Hence the circumcircle is \((x-3)^2+(y-1)^2=10\). The distances to B and C are also \(\sqrt{10}\).

**Response/cardinality audit:** Constructed response; no multiple-choice option count applies. The equation and readable derivation are given.

**Ambiguity / visual dependence:** None. Three noncollinear vertices determine a unique circumcircle; no figure is required.
