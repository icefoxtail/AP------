# B07 Independent Blind Freeze

- Phase: REVIEW phase 1, independent student-facing solve only
- Student-only packet: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/review-blind/B07_STUDENT_ONLY.md`
- Packet SHA-256: `F6EF6C51746DDF1B2674B1D7A315C2063694F0DFD7E1F80406F5FE48401294C5`
- Each of the five prompts explicitly says no student visual is required; no asset hash applies.
- Answer/solution material was not consulted.

## ALITE-PALMA25-H1-2MID-B07-Q01-BP01

**Independent answer:** ④, \(\{\{2,3\}\}\subseteq A\).

The elements of \(A\) are the three objects \(1\), \(\{2,3\}\), and \(4\). For a set to be a subset of A, each of its elements must be one of those three objects. The sole element of \(\{\{2,3\}\}\) is the set \(\{2,3\}\), which is indeed an element of A.

**Five-choice audit:** ① contains element 2, not in A. ② contains 3, not in A. ③ has elements 2 and 3, neither of which is in A; the set \(\{2,3\}\) itself is an element of A but is not an element of this candidate subset. ④ has sole element \(\{2,3\}\in A\). ⑤ contains \(\{1\}\), which is not an element of A. The choices are distinct and only ④ is a subset.

**Ambiguity / visual dependence:** None. Nested braces are explicit and no figure is required.

## ALITE-PALMA25-H1-2MID-B07-Q01-BP02

**Independent answer:** ③, 3 elements.

The equation factors as \((x+2)^2(x-1)(x-4)=0\), so its integer solution set is \(A=\{-2,1,4\}\). The repeated root -2 is one set element, not two. Thus \(|A|=3\).

**Five-choice audit:** ① undercounts by treating only one distinct solution; ② misses one of the three distinct roots; ③ is the number of distinct integer roots; ④ counts the repeated root twice; ⑤ does not match the number of roots/solutions. The numerical choices are distinct and exactly one is correct.

**Ambiguity / visual dependence:** None. The domain is explicitly integers and set cardinality counts distinct values.

## ALITE-PALMA25-H1-2MID-B07-Q13-BP01

**Independent answer:** ②.

\(A=\{2,3\}\). The inequality defining B holds on \([1,4]\), so over integers \(B=\{1,2,3,4\}\). The inequality defining C holds on \([2,3]\), so over integers \(C=\{2,3\}\). Hence \(A=C\), and both are proper subsets of B.

**Five-choice audit:** ① is false because A and C are equal, not a proper containment. ② correctly states equality A=C and proper containment in B. ③ is false for the same equality reason. ④ reverses the containment: B contains elements outside A. ⑤ has the first relation correct but incorrectly claims B is a proper subset of C. Exactly one choice is true.

**Ambiguity / visual dependence:** None. The integer domain is explicit and all three truth sets follow from the factored inequalities.

## ALITE-PALMA25-H1-2MID-B07-Q13-BP02

**Independent answer:** ⑤, \(2<t<4\).

The integer solutions to \((x-2)(x-4)\le0\) are \(A=\{2,3,4\}\). For each x in A, \(|x-t|<2\) is equivalent to \(x-2<t<x+2\). Requiring this for 2, 3, and 4 gives respectively \((0,4)\), \((1,5)\), and \((2,6)\). Their intersection is \((2,4)\), with both endpoints excluded because the distance inequality is strict.

**Five-choice audit:** ① \((1,5)\) is too broad (e.g. t=1.5 fails for x=4). ② includes invalid endpoints t=2 and t=4. ③ is too broad (e.g. t=1 fails for x=4). ④ is too broad (e.g. t=5 fails for x=2). ⑤ is exactly the intersection. All answer ranges are distinct and only ⑤ works.

**Ambiguity / visual dependence:** None. The integer universe for A and strict inequality for B_t are explicit; no figure is required.

## ALITE-PALMA25-H1-2MID-B07-Q13-BP03

**Independent answer:** ①, 12 ordered pairs.

Choose B first: there are \(\binom43=4\) choices for its three elements, then \(\binom31=3\) choices for the one-element subset A within B. Thus there are \(4\cdot3=12\) ordered pairs. Equivalently, choose A in 4 ways and add two of the remaining three elements to form B in \(\binom32=3\) ways.

**Five-choice audit:** ① equals 12. ②=4 counts only the choice of B and omits A. ③=6 undercounts the ordered choices. ④=24 does not count the valid nested subset pairs. ⑤=81 counts an unrelated overlarge selection space. The listed values are distinct and only ① is the correct ordered-pair count.

**Ambiguity / visual dependence:** None. S has four named distinct elements and the size/subset constraints define the ordered-pair count.
