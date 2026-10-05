# B05 #15 — root direct geometry evidence

- UID: `qid_v1_4877ea99dc183fe96916a71d6f790f3696d78b19d4218f08c7446b9a7d97552b`
- Source: `original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#15`
- Source fingerprint: `5fddf84a93fc4e72af81db75b137f4ce1ec7de9e078d764663cfbb7fb8264bab`
- Input bundle SHA: `43691c417980c43db9e50f839ba4ee40ea3ed7641c99f4b7ef8606d174a729a4`
- Image: `assets/images/23_금당중_2학기_중간_중1_기출/q15.png`, SHA-256 `2b9aaaf683ba78563412245540a33dce3b47622730340536dab765beb2bdebcd`
- Root source/image read: yes. Protected source mutation: none.

## Independent angle derivation from the fold geometry

Let `R` be the original lower-right corner of the rectangle, shown by the dotted bottom/right construction. Folding on `EF` sends `R` to `C`, so `EF` bisects the angle between the original downward ray `FR` and its image `FC`. The original bottom ray `ER` reflects to `EC`.

1. Triangle `CDF` is right at `D`. The given `∠DCF = 18°` gives `∠CFD = 72°`.
2. The angle from upward `FD` to downward `FR` is `180°`, so `∠CFR = 108°`. The fold ray `FE` bisects it into `54°` parts. Hence `EF` makes `36°` above the original horizontal bottom ray `ER`.
3. Reflecting horizontal `ER` across `EF` makes `EC` lie `72°` above that horizontal. Thus `∠CEF = 36°`. Since `CG` is the horizontal top edge, `∠GCE = 72°`.
4. The source gives `∠CGE = 50°`. Triangle `CGE` therefore gives `∠CEG = 180° − 50° − 72° = 58°`.
5. `∠CEG + ∠CEF = 58° + 36° = 94°`, matching the keyed result without using it as a premise.

The archived solution states reflection and rectangle-right-angle principles but skips these intermediate angles. A and C independently marked semantic HOLD because they could not reconstruct the angle transfer; B proposed the mapped item. Root direct-read evidence above reconstructs 94° without using the keyed result as a premise, so the scoped consensus may map the semantic type with an explicit root override. The omitted intermediate angles remain `SOLUTION_REPAIR_REQUIRED` in source quality. No student-facing field is altered.
