# B07 #20 — root direct M1 geometry proof

- UID: `qid_v1_56f87fcf14af7ab287a95d89b4c77abbb8d815221cd55bce76e560b88b8cb16f`
- Source: `original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js#20`
- Image: `assets/images/23_연향중_2학기_중간_중1_기출/q20.png`, SHA-256 `9e9a38e714300f9b1543e569f3d325707b34df352393fb00361ec429b25a2471`
- Root source/image/solution read: yes. Protected source mutation: none.

The archived explanation obtains choice ④, `∠BAE=35°`, through the sine law and trigonometric ratios, which are outside this M1 basic-figure method. The same result follows from a square rotation and SAS congruence using only elementary geometry:

1. Rotate `△ABE` by `90°` about `A` so `B` maps to `D`. Let `G` be the image of `E`. Because E lies on BC, G lies on the extension of CD beyond D. Rotation gives `AG=AE`.
2. The square angle `∠BAD=90°` and the given `∠EAF=45°` imply `∠GAF=45°` as well: the ray `AG` is ray `AE` rotated by 90° across AD. With `AF` common and `AG=AE`, triangles `GAF` and `EAF` are congruent by SAS.
3. Hence `∠AFG=∠AFE=80°`. Since `G,D,F` are collinear on the right side's extension, `∠AFD=80°`.
4. Right triangle ADF has `∠FAD=10°`. Around A, `∠BAE+∠EAF+∠FAD=90°`, so `∠BAE=90°−45°−10°=35°`.

This proves the keyed answer independently without sine law or trigonometric ratios. The semantic type can stay in M1 basic figures as a rotated-triangle congruence application if A/B/C evidence supports it. The archived explanation should remain on `SOLUTION_REPAIR_REQUIRED` because it depends on an out-of-curriculum method; the protected source text is not edited in this Meta Foundation task. An active `CC_SINE_LAW` is not needed for the decisive M1 solution and should not be attached merely because the archive explanation used it.
