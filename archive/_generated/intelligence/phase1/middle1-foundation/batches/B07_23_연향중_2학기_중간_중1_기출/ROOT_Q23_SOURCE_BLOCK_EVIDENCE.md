# B07 #23 — root direct source consistency audit

- UID: `qid_v1_6305db876ddf39640d44ae07abbf7aa2ac6c519cb285c3e66c839b03e33901fe`
- Source: `original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js#23`
- Image dependency: none. Root source/solution read: yes. Protected source mutation: none.

Part (b) gives a realizable triangle GHI by `GH=3`, `HI=6`, and included `∠H=45°`. It also purports to give triangle JKL with `JK=6`, `∠K=45°`, and opposite side `LJ=3`. That second triangle is **not constructible**: draw the 45° ray KL from K and fix J at distance 6 on the other ray KJ. The perpendicular distance from J to ray KL is `6 sin 45° = 3√2 > 3`, so a circle centered at J with radius LJ=3 does not intersect the ray. Equivalently, the sine law would require `sin L=JK·sin K/LJ=√2>1`.

Thus the archived explanation's claim that (b) is an SSA case allowing different triangles is false for these actual numbers. The answer label `(b)` is not a valid response to a request for **two triangles that are not always congruent** when one of the purported triangles cannot exist. This is a material source/data defect, not a mere omitted solution step. Preserve the question and its protected fields. If independent A/B/C review concurs, leave semantic `HOLD`, record `SOURCE_BLOCKED`, exclude this UID from M1 taxonomy promotion and metadata writeback, and count it explicitly in the 737 UID closure.
