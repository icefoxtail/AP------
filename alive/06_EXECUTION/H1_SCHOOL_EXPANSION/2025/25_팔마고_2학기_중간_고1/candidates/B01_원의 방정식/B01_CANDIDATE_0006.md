# B01 candidate 0006

- **draftCandidateId:** ALITE-B01-2025PALMA-0006
- **sourceQid:** 22
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **CREATE disposition:** ACCEPT; draft only, independent review not tested

## Student prompt

점 \(A(0,0)\), \(B(6,0)\), \(C(2,4)\)를 꼭짓점으로 하는 삼각형의 외접원의 방정식을 풀이 과정과 함께 구하시오.

## Response contract

- **Format:** constructed response.
- **Required response:** circumcircle equation and readable derivation of its coefficients or center and radius.
- **Accepted equivalent forms:** \(x^2+y^2-6x-2y=0\) or \((x-3)^2+(y-1)^2=10\).
- **Answer position:** NOT_APPLICABLE.

## Exact answer

\[
x^2+y^2-6x-2y=0
\]
or equivalently
\[
(x-3)^2+(y-1)^2=10.
\]

## Detailed student solution

Let the circle be \(x^2+y^2+Dx+Ey+F=0\). Substituting \(A(0,0)\) gives \(F=0\). Substituting \(B(6,0)\) gives \(36+6D=0\), so \(D=-6\). Substituting \(C(2,4)\) gives \(20+2D+4E+F=0\), hence \(20-12+4E=0\) and \(E=-2\). Therefore the circumcircle is \(x^2+y^2-6x-2y=0\). Completing squares gives \((x-3)^2+(y-1)^2=10\).

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact RPM path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.1 원의 방정식 → L4-1.3.1.2 일반형에서 원 찾기.
- **Status:** L1/L2 are RPM_VERIFIED. Exact L3/L4 records are CANONICAL_DRAFT in the package; this is an exact lookup, not a claim of LOCKED promotion.
- **CrossConcept:** none. **Condition:** noncollinear point-incidence constraints; no separate key asserted. **IntegrationPattern:** SEQUENTIAL.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** solve the three linear coefficient constraints from three noncollinear point incidences in a general-form circle.
- **Difference from source q22:** source q22 first intersects three lines and uses a right angle and hypotenuse midpoint. This triangle is non-right; no diameter shortcut applies, so the circle's coefficients must be recovered from all three vertices.
- **Duplicate notes:** the right-triangle/diameter-midpoint construction is DUPLICATE of source q22. This three-constraint coefficient system differs from candidate 0002, which recovers one constant from a radius condition; the degrees of freedom and decisive-step graphs differ.

## Misconception-based response diagnostics

Constructed-response error patterns, not student-facing options: using the centroid \((8/3,4/3)\) as circumcenter; treating \(AB\) as a diameter and using midpoint \((3,0)\); sign error giving center \((3,-1)\); using \(10\) as the radius instead of radius-squared.

## Difficulty and visual status

- **Target:** level 중, bucket 3. **Author-estimated actual:** level 중, bucket 3; confidence medium, boundary NONE.
- **Rationale:** three point substitutions are required, but they form a linear system with clean arithmetic; this supports level 중, bucket 3.
- **Visual necessary:** no; the noncollinear vertex coordinates fully define the triangle. Spec: no figure.
- **Candidate asset path/SHA:** none/not applicable. Render: NOT_RENDERED.
- **Author self-check only:** independent math, Meta, render, and global duplicate review NOT_TESTED.
