# B06 #25 — root direct image and solution audit

- UID: `qid_v1_bf6f71e848237887a135461e9cb5292a204545ac7e196eacc475b1b3025a7394`
- Source: `original/middle/m1/2mid/23_신흥중_2학기_중간_중1_기출.js#25`
- Image: `assets/images/23_신흥중_2학기_중간_중1_기출/q25.png`, SHA-256 `c7ecdf02283aacfb58f7f438410e879a6bcda3cd1a547f05c8bbac28cdb5df72`
- Root source/image/solution read: yes. Protected source mutation: none.

The question asks first for an ASA proof of `△BOH ≅ △COI`, then for the area of `OHCI`. The archived answer gives `16 cm²`; the archived solution asserts that `OHCI` is a square with side `4 cm`. That square assertion is false for a general rotation of the second square shown in the image: `OH` is slanted and `HC` is horizontal, so the angle at `H` is not generally `90°`; `OH` also need not be `4 cm`.

The numerical area remains `16 cm²` by a grade-appropriate area transfer. The proved congruence gives `area(△BOH)=area(△COI)`. Since H lies on BC, `area(△OBC)=area(△OBH)+area(△OHC)`. Diagonal OC partitions the asked quadrilateral, so `area(OHCI)=area(△OHC)+area(△OCI)=area(△OBC)`. The first square has `BC=8 cm`, and its center O is `4 cm` above BC, giving `area(△OBC)=8×4/2=16 cm²`.

As an independent coordinate check, place the first square's center at `O=(0,0)`, its bottom-right corner at `C=(4,-4)`, its bottom edge on `y=-4`, and its right edge on `x=4`. For a second-square rotation parameter `t` (the horizontal-to-vertical component ratio of its down-left edge), the intersections are `H=(-4t,-4)` and `I=(4,-4t)`. The rotation makes `OH` and `OI` equal. Shoelace area of quadrilateral `O-H-C-I` is

`1/2 | H×C + C×I | = 1/2 | (16t+16) + (16-16t) | = 16`.

Thus the source answer can remain; the item-specific explanation requires repair. A and B both accepted the incorrect square claim in their sourceIssue/decisive-step evidence, so the affected consensus UID must explicitly replace that step with equal-triangle area transfer and record `SOLUTION_REPAIR_REQUIRED`. This is a targeted worker-quality defect, not an alteration to student-facing source fields.
