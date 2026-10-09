# B01 candidate 0004

- **draftCandidateId:** ALITE-B01-2025PALMA-0004
- **sourceQid:** 12
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **CREATE disposition:** ACCEPT; draft only; extension taxonomy candidate remains unreviewed

## Student prompt

원의 방정식 \(x^2+y^2=25\)의 바깥에 있는 점 \(T(t,2t)\;(t>0)\)에서 이 원에 그은 두 접선이 원과 만나는 점을 각각 \(P,Q\)라 하자. 직선 \(PQ\)와 원의 중심 \(O\) 사이의 거리가 \(\sqrt5\)일 때, \(OT\)의 길이는?

## Choices

① \(5\)  
② \(5\sqrt2\)  
③ \(5\sqrt3\)  
④ \(10\)  
⑤ \(5\sqrt5\)

## Exact answer

⑤ — \(5\sqrt5\)

## Detailed student solution

접점 \(P=(u,v)\)에서 원에 그은 접선은 \(ux+vy=25\)이다. \(T=(t,2t)\)가 이 접선 위에 있으므로 \(ut+2vt=25\)이며, 접점 \(Q\)도 같은 관계를 만족한다. 따라서 두 접점은 직선 \(PQ:tx+2ty-25=0\) 위에 있다. 원점에서 이 직선까지의 거리는
\[
\frac{25}{\sqrt{t^2+(2t)^2}}=\frac{25}{t\sqrt5}.
\]
이를 \(\sqrt5\)와 같게 두면 \(t=5\)이다. 그러므로
\[
OT=\sqrt{5^2+10^2}=5\sqrt5.
\]
\(OT=5\sqrt5>5\)이므로 \(T\)는 실제로 원 밖에 있다.

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact primary path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.3 원의 접선.
- **L4 disposition:** exact lookup found L4-1.3.3.1 접점이 주어진 접선 and L4-1.3.3.2 기울기가 주어진 접선. Neither exactly represents recovering an external-point parameter from the distance to its two-contact chord. This is **EXT_L4_CANDIDATE**, proposed ID EXT-H1-2022-C2-CIRCLE-TANGENT-CONTACT-CHORD-INVERSE-001; not a canonical RPM L4.
- **Status:** parent L3 is CANONICAL_DRAFT; extension DISCOVERED_UNREVIEWED; canonicalPromoted=false; consumerSelectable=false.
- **CrossConcept:** none asserted; point-to-line distance is used as an operation inside the circle-tangent reasoning. **Condition:** \(t>0\) and the given distance equality; no unverified key asserted. **IntegrationPattern:** SEQUENTIAL.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** derive the contact-chord equation from the tangent-at-contact relation; invert its center-distance condition to recover the external-point parameter and \(OT\).
- **Canonical comparator:** known-contact-point tangents and known-slope tangents do not exactly cover this target.
- **Difference from source q12:** source q12 supplies the external point and asks for the contact-chord distance. This reverses the information flow: the distance is supplied and the point is recovered.
- **Duplicate notes:** changing only the source radius or coordinates while asking for center-to-contact-chord distance is DUPLICATE. The inverse parameter-recovery goal is the accepted extension blueprint.

## Misconception-based distractors

- ① reports the circle radius instead of \(OT\).
- ② drops the coefficient \(2\) and treats both coordinates as \(t\).
- ③ uses \(t^2+2t^2\) rather than squaring \(2t\) as \(4t^2\).
- ④ reports the coordinate \(2t\) instead of Euclidean distance.
- ⑤ uses both coordinates in the distance formula.

## Difficulty and answer position

- **Target:** level 상, bucket 4. **Author-estimated actual:** level 상, bucket 4; confidence medium, boundary NONE.
- **Rationale:** contact-chord derivation, line-distance inversion, and a final coordinate-distance recovery are required.
- **Intended answer position:** ⑤. No order lock; position selected after the mathematics was fixed as part of the batch spread.

## Visual and review status

Visual necessary: no; all objects and conditions are algebraic. Spec: no figure. Candidate asset path/SHA: none/not applicable. Render: NOT_RENDERED. Author self-check only; independent math, Meta, render, and extension taxonomy review: NOT_TESTED.
