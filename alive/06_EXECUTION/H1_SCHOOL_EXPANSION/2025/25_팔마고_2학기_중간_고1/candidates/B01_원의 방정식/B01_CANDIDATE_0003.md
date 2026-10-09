# B01 candidate 0003

- **draftCandidateId:** ALITE-B01-2025PALMA-0003
- **sourceQid:** 6
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **CREATE disposition:** ACCEPT; draft only, independent review not tested

## Student prompt

원 \(x^2+y^2=169\)과 직선 \(3x+4y+k=0\)이 서로 다른 두 점에서 만날 때, 두 교점 사이의 거리가 \(10\)보다 크도록 하는 정수 \(k\)의 개수는?

## Choices

① \(59\)  
② \(60\)  
③ \(118\)  
④ \(119\)  
⑤ \(120\)

## Exact answer

④ — \(119\)

## Detailed student solution

원의 중심은 \(O=(0,0)\), 반지름은 \(13\)이다. 중심에서 직선까지의 거리는
\[
d=\frac{|k|}{\sqrt{3^2+4^2}}=\frac{|k|}{5}.
\]
현의 길이는 \(2\sqrt{13^2-d^2}\)이므로
\[
2\sqrt{169-d^2}>10
\Longleftrightarrow d^2<144
\Longleftrightarrow \frac{|k|}{5}<12.
\]
따라서 \(|k|<60\), 즉 정수 \(k=-59,\ldots,0,\ldots,59\)이다. 개수는 \(59+1+59=119\)이다. 등호 경계 \(k=\pm60\)은 길이가 정확히 \(10\)이므로 제외된다.

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact RPM path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.2 원과 직선 → L4-1.3.2.2 현의 길이.
- **Status:** L1/L2 are RPM_VERIFIED. Exact L3/L4 records are CANONICAL_DRAFT in the package; this is an exact lookup, not a claim of LOCKED promotion.
- **CrossConcept:** none. **Condition keys:** COND_INTEGER, COND_RANGE. **IntegrationPattern:** SEQUENTIAL.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** convert a strict chord-length threshold into an open center-distance interval, then count the integer parameters.
- **Difference from source q6:** source q6 counts parameters for any circle-line intersection with an inclusive tangent boundary. This candidate uses the chord-length L4 and a strict boundary that changes the interval and count.
- **Duplicate notes:** the source existence/count version and a tangent-only equality variant are DUPLICATE/CONDITION_PATTERN_ONLY and not counted separately. Radius or coefficient changes alone are numeric instances.

## Misconception-based distractors

- ① \(59\): counts only positive integers \(1,\ldots,59\).
- ② \(60\): counts \(0,\ldots,59\), omitting negative values.
- ③ \(118\): counts both nonzero signs but omits \(0\).
- ⑤ \(120\): includes \(k=\pm60\) by replacing strict \(>\) with a non-strict boundary.
- ④ counts all integers strictly between \(-60\) and \(60\).

## Difficulty and answer position

- **Target:** level 중, bucket 3. **Author-estimated actual:** level 중, bucket 3; confidence medium, boundary NONE.
- **Rationale:** distance formula, chord relation, strict inequality, and symmetric integer count are all required.
- **Intended answer position:** ④. No order lock; position selected after the mathematics was fixed as part of the batch spread.

## Visual and review status

Visual necessary: no; equations fully specify the circle and line. Spec: no figure. Candidate asset path/SHA: none/not applicable. Render: NOT_RENDERED. Author self-check only; independent math, Meta, render, and global duplicate review: NOT_TESTED.
