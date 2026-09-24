# B06 #17 — root direct image and solution audit

- UID: `qid_v1_a7d01443ac0a2cdb46267328dd93f01f0b54c93ac012191db7569d44a14050d8`
- Source: `original/middle/m1/2mid/23_신흥중_2학기_중간_중1_기출.js#17`
- Image: `assets/images/23_신흥중_2학기_중간_중1_기출/q17.png`, SHA-256 `a145eb6cc2d35554ab53a92056c2b00f0d5f5a1de14f3eb506ddaa27090c57e9`
- Root source/image/solution read: yes. Protected source mutation: none.

The reference triangle has base `5` between marked base angles `30°` and `70°`; its third angle is `80°`. Option ⑤ depicts the same base `5` with `70°` at the right end and `80°` at the apex, so its left base angle is `30°`. It therefore has the same base and both adjacent angles as the reference and is congruent by ASA. Choice ⑤ and the source answer are consistent. Option ③ also shows angles `30°` and `80°`, but its labeled side `5` is **between those two angles**, opposite the remaining `70°` angle. The reference side `5` is between `30°` and `70°`, opposite `80°`. Equal angle triples with these different corresponding side placements do not establish congruence; only ⑤ has the matching side incidence.

The archived solution instead calls `5` the included side between the `70°` and `80°` pair. It is not: that included side would be the right slanted edge. The solution reaches the right choice through a false angle-side incidence statement. Preserve source fields and mark this UID `SOLUTION_REPAIR_REQUIRED`. B's HOLD records the defect; A's sourceIssue omitted it. The semantic type can be mapped after a correct source-grounded method replaces the faulty solution step.
