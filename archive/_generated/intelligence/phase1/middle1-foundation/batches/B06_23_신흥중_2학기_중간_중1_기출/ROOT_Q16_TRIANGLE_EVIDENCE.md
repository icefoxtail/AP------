# B06 #16 — root direct construction evidence

- UID: `qid_v1_91460875b8b6cb92937900a31440caa73b7d535b43d23ea67bb2556b593720cb`
- Source: `original/middle/m1/2mid/23_신흥중_2학기_중간_중1_기출.js#16`
- Source image dependency: none. Root source/solution read: yes.

Given `AC=5 cm` and `∠C=30°`, the options ask which **individual extra data** fix one triangle. `BC=6 cm` (ㄴ) supplies SAS with included `∠C`, so one triangle. `∠A=95°` (ㄷ) supplies the two angles adjacent to `AC`, so ASA. `∠B=55°` (ㄹ) gives `∠A=95°`; then `AC` lies between `∠A` and `∠C`, again fixing one triangle. Thus ㄴ, ㄷ, ㄹ and choice ⑤ are consistent.

`AB=3 cm` (ㄱ) is the ambiguous side-side-angle case. With `AC=5` and a `30°` ray from C, the perpendicular distance from A to that ray is `5 sin 30°=2.5 cm`, smaller than the radius `AB=3`. The circle centered at A with radius 3 crosses the ray twice because the perpendicular foot lies `5 cos 30°≈4.33 cm` from C and the two offsets are `sqrt(3²−2.5²)≈1.66 cm`, both giving positive BC lengths. The same conclusion follows by a standard compass construction without relying on trigonometry as a student method. ㄱ does not give uniqueness.

The archived solution calls `∠B=55°`, `∠C=30°` and side `AC` directly an ASA condition. Side `AC` is not included between B and C; one must first infer `∠A=95°` and then use the included `AC` between A and C. This is a small but real explanation defect; record `SOLUTION_REPAIR_REQUIRED` if the batch's quality gate treats inaccurate named criteria as repair. Preserve student-facing fields.
