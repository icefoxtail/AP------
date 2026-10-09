# B01 candidate 0002

- **draftCandidateId:** ALITE-B01-2025PALMA-0002
- **sourceQid:** 3
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **CREATE disposition:** ACCEPT; draft only, independent review not tested

## Student prompt

원의 방정식 \(x^2+y^2-6x+4y+k=0\)이 반지름의 길이가 \(4\)인 원을 나타낼 때, 실수 \(k\)의 값은?

## Choices

① \(-3\)  
② \(3\)  
③ \(-16\)  
④ \(13\)  
⑤ \(29\)

## Exact answer

① — \(k=-3\)

## Detailed student solution

완전제곱식으로 정리하면
\[
(x-3)^2-9+(y+2)^2-4+k=0,
\]
즉
\[
(x-3)^2+(y+2)^2=13-k.
\]
반지름이 \(4\)이므로 \(13-k=4^2=16\), 따라서 \(k=-3\)이다.

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact RPM path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.1 원의 방정식 → L4-1.3.1.2 일반형에서 원 찾기.
- **Status:** L1/L2 are RPM_VERIFIED. Exact L3/L4 records are CANONICAL_DRAFT in the package; this is an exact lookup, not a claim of LOCKED promotion.
- **CrossConcept:** none. **Condition:** the prescribed radius; no separate condition key asserted. **IntegrationPattern:** SEQUENTIAL.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** recover an unknown constant in a general-form circle by completing squares and matching the radius-squared term.
- **Difference from source q3:** source q3 proceeds from a supplied center/radius to an equation. This reverses the information flow and solves a coefficient from the radius condition.
- **Duplicate notes:** changing only source center, radius, signs, or variable names is DUPLICATE. This is the other exact L4 under L3-1.3.1 and differs from candidate 0001's point-incidence/center-branch reasoning.

## Misconception-based distractors

- ② \(3\): moves the constant with the wrong sign.
- ③ \(-16\): sets \(k=-r^2\) and ignores the \(-13\) from completing squares.
- ④ \(13\): drops the radius condition and uses the completed-square constant.
- ⑤ \(29\): adds \(13+16\) instead of solving \(13-k=16\).
- ① alone satisfies the radius equation.

## Difficulty and answer position

- **Target:** level 중, bucket 2. **Author-estimated actual:** level 중, bucket 2; confidence medium, boundary NONE.
- **Rationale:** one completion of squares and one coefficient comparison; no hidden branch or long arithmetic.
- **Intended answer position:** ①. No order lock; position selected after the mathematical answer was fixed as part of the batch spread.

## Visual and review status

Visual necessary: no; equation and radius condition are complete. Spec: no figure. Candidate asset path/SHA: none/not applicable. Render: NOT_RENDERED. Author self-check only; independent math, Meta, render, and global duplicate review: NOT_TESTED.
