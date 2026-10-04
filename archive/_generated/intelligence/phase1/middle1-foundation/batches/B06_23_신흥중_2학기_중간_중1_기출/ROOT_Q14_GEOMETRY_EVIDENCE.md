# B06 #14 — root direct equilateral-triangle evidence

- UID: `qid_v1_1e01b00ab530c126aa481fb9bcdddacd84d08ff2fb7bc1239a80662c9fb73337`
- Source: `original/middle/m1/2mid/23_신흥중_2학기_중간_중1_기출.js#14`
- Image: `assets/images/23_신흥중_2학기_중간_중1_기출/q14.png`, SHA-256 `fe72f43d78556dc0aa258e083432379d84ea75bd4094993784cfd59e0cdaec5f`
- Root source/image/solution read: yes. Protected source mutation: none.

The image places `D` on `BC`, `F` at `AC∩DE`, and shows equilateral `ABC` and `ADE` with the same clockwise orientation around `A`. Rotation by `60°` clockwise about `A` maps `B→C` and `D→E`. No fixed ratio between the side lengths of the two equilateral triangles is needed.

- ① The rotation maps segment `BD` to `CE`, hence `BD=CE`.
- ② It maps rays `AB→AC` and `AD→AE`, hence `∠DAB=∠EAC`.
- ⑤ Since `D` is on `BC`, `∠ABD=∠ABC=60°`; the rotated image of ray `BD` is `CE`, so `∠ACE=60°` too.
- ③ Write `u=∠BAD`. At A, `∠DAC=60°−u` because `∠BAC=60°`. In triangle `ADC`, `∠ACD=60°`, so `∠ADC=60°+u`. Also `∠ADE=60°`; ray `DF` lies on `DE` inside `∠ADC`, hence `∠FDC=∠ADC−∠ADE=u=∠BAD`.
- ④ `∠ADF=∠ADE=60°`, while `∠CDF=∠FDC=u`, which is not generally `60°` in the drawn interior configuration. Thus ④ is the false statement and the keyed answer is consistent.

The archived explanation asserts rotation/symmetry without these intermediate correspondences, but its conclusion is correct. C independently marked HOLD because it could not prove the F-related correspondence; this direct source/image proof permits semantic mapping with an explicit root override. Record abbreviated-solution quality HOLD if the batch's solution-quality policy requires the omitted derivation. No protected source field is changed.
