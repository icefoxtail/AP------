# B02 Independent Blind Freeze

- Phase: REVIEW phase 1, independent student-facing solve only
- Student-only packet: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/review-blind/B02_STUDENT_ONLY.md`
- Packet SHA-256: `C02BBD18313D768B215A39A77664020AE1B738861A3E3CAAA8F7DC178EF5FC24`
- Required Q10 figure: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/candidates/B02_집합의_연산/visuals/B02_Q10_VENN.svg`
- Q10 SVG SHA-256: `C8AD60988107F1C78766B72E46411A1EB7F08DCDF30B9790FF0F3A45CE421920`
- Answer/solution material was not consulted.

## ALITE-PALMA25-H1-2MID-B02-Q08-BP01

**Independent answer:** ④, 17.

There are \(\lfloor100/6\rfloor=16\) multiples of 6 and \(\lfloor100/9\rfloor=11\) multiples of 9 in U. Their intersection consists of multiples of \(\mathrm{lcm}(6,9)=18\), of which there are \(\lfloor100/18\rfloor=5\). The number in exactly one set is \((16-5)+(11-5)=17\).

**Five-choice audit:** ① 22 is the union count \(16+11-5\), not exactly one. ② 27 double-counts the overlap by adding the set sizes. ③ 5 is the intersection size. ④ is the symmetric-difference count 17. ⑤ 11 counts only B, without excluding its overlap with A. Exactly one choice is correct.

**Ambiguity / visual dependence:** None. Set membership and U are explicit; no figure is referenced.

## ALITE-PALMA25-H1-2MID-B02-Q10-BP01

**Independent answer:** ②, \(B\cap(A\cup C)\).

I inspected the specified SVG before solving this item. It shows U as the rectangle; A is the left circle, B the right circle, and C the lower circle. The gray shape is a B-circle fill clipped by a mask that is white in A and C and black elsewhere. Thus the visible shaded portion is the part of B lying in A or C, including the triple-overlap portion: \(B\cap(A\cup C)\). The parts of B outside both A and C are unshaded.

**Five-choice audit:** ① \((A\cup C)\cap B^C\) selects portions of A or C outside B, the opposite side of the B boundary. ② selects exactly the shaded portion. ③ includes C portions outside B and is not limited to B. ④ selects portions in C and A-or-B, including regions outside the shaded target. ⑤ selects only the triple intersection and omits the shaded pairwise-overlap portions. Exactly one choice matches the figure.

**Ambiguity / visual dependence:** Figure-dependent. The actual SVG mask and region shading were inspected; labels are A, B, C, U, with no extra region labels. The image is clear enough to identify the shaded region as \(B\cap(A\cup C)\). No ambiguity found.

## ALITE-PALMA25-H1-2MID-B02-Q20-BP01

**Independent constructed response:** Maximum 26 students; minimum 2 students.

Let \(I=|A\cap B|\). Then \(|A\triangle B|=|A|+|B|-2I=34-2I\), the number applying to exactly one program. Since there are 30 students, \(I\ge18+16-30=4\); also \(I\le\min(18,16)=16\). Therefore the maximum occurs at \(I=4\), giving 26, and the minimum at \(I=16\), giving 2.

Both endpoints are feasible. For \(I=4\): A-only=14, B-only=12, both=4, neither=0, totaling 30. For \(I=16\): A-only=2, B-only=0, both=16, neither=12, totaling 30. These satisfy the stated A/B totals and attain the claimed exact-one counts.

**Response/cardinality audit:** Constructed response; no MC option count applies. Both requested extrema and feasible Venn-region configurations are given.

**Ambiguity / visual dependence:** None. A Venn model is useful but not required; no student figure is referenced. The 30-student universe and both program totals determine the feasible intersection range.
