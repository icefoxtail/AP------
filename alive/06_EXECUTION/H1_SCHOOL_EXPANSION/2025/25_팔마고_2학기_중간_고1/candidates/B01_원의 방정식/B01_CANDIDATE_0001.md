# B01 candidate 0001

- **draftCandidateId:** ALITE-B01-2025PALMA-0001
- **sourceQid:** 3
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **CREATE disposition:** ACCEPT; draft only, independent review not tested

## Student prompt

서로 다른 두 점 \(A(-3,1)\), \(B(3,1)\)을 지나는 원의 중심은 \(y\)축 위에 있고 선분 \(AB\)보다 위쪽에 있다. 이 원의 반지름의 길이가 \(5\)일 때, 이 원의 방정식은?

## Choices

① \(x^2+(y-1)^2=25\)  
② \(x^2+(y-5)^2=25\)  
③ \(x^2+(y+3)^2=25\)  
④ \((x-3)^2+(y-1)^2=25\)  
⑤ \(x^2+(y-5)^2=5\)

## Exact answer

② — \(x^2+(y-5)^2=25\)

## Detailed student solution

중심을 \(C=(0,c)\)라 두면 \(A\)와 중심 사이의 거리가 \(5\)이므로
\[
(-3)^2+(1-c)^2=25.
\]
따라서 \((1-c)^2=16\), 즉 \(c=5\) 또는 \(c=-3\)이다. 선분 \(AB\)는 \(y=1\) 위에 있고 중심은 그 위쪽이므로 \(c>1\); 따라서 \(c=5\)이다. \(B\)는 \(A\)를 \(y\)축에 대하여 대칭이동한 점이므로 중심이 \(y\)축 위에 있을 때 \(B\)까지의 거리도 \(5\)이다. 중심 \((0,5)\), 반지름 \(5\)를 원의 표준형에 대입하면 \(x^2+(y-5)^2=25\)이다.

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact RPM path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.1 원의 방정식 → L4-1.3.1.1 중심과 반지름.
- **Status:** L1/L2 are RPM_VERIFIED. Exact L3/L4 records are CANONICAL_DRAFT in the package; this is an exact lookup, not a claim of LOCKED promotion.
- **CrossConcept:** none. **Condition:** choose the center branch satisfying \(c>1\); no machine key asserted. **IntegrationPattern:** CASE_BRANCH.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** recover the unknown center from symmetric point incidence, a fixed radius, and an above/below condition; use the side condition to select between the two algebraic center candidates.
- **Difference from source q3:** source q3 supplies center and radius and directly writes standard form. Here center is unknown and a two-root branch must be resolved first.
- **Duplicate notes:** direct substitution of a supplied center/radius, or changing only coordinates/signs, is DUPLICATE. The second exact L4 under this same L3, general-form recovery, is candidate 0002 and is not merged with this blueprint.

## Misconception-based distractors

- ① uses the chord line \(y=1\) as the center ordinate.
- ③ selects the lower center \(c=-3\), ignoring “above”.
- ④ treats endpoint \(B\)'s \(x\)-coordinate as the center's \(x\)-coordinate.
- ⑤ uses \(r\) rather than \(r^2\) on the right side.
- ② is the only equation with the recovered center and squared radius.

## Difficulty and answer position

- **Target:** level 중, bucket 2. **Author-estimated actual:** level 중, bucket 2; confidence medium, boundary NONE.
- **Rationale:** the student must resolve two center candidates before using the standard equation; the arithmetic stays short.
- **Intended answer position:** ②. No order lock; position selected after the mathematical answer was fixed as part of the batch spread.

## Visual and review status

Visual necessary: no; coordinates fully specify the geometry. Spec: no figure. Candidate asset path/SHA: none/not applicable. Render: NOT_RENDERED. Author self-check only; independent math, Meta, render, and global duplicate review: NOT_TESTED.
