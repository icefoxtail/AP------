# B03 candidate: truth range for a universal quadratic proposition

## Identity and provenance

- draftCandidateId: ALITE-25PAL-B03-Q14-P01
- sourceQid: 14
- sourceQidField: literal window.questionBank[].id
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creator route: gpt-6-luna / max
- status: CREATE_DRAFT; independent review NOT_TESTED; browser render NOT_TESTED

## Full student prompt

실수 \(a\)에 대하여 명제

\[
\text{“모든 실수 }x\text{에 대하여 }x^2-2ax+a+3\ge0\text{이다.”}
\]

가 참이 되도록 하는 실수 \(a\)의 범위를 고르시오.

① \(a\le\dfrac{1-\sqrt{13}}2\) 또는 \(a\ge\dfrac{1+\sqrt{13}}2\)  
② \(\dfrac{1-\sqrt{13}}2\le a\le\dfrac{1+\sqrt{13}}2\)  
③ \(\dfrac{1-\sqrt{13}}2<a<\dfrac{1+\sqrt{13}}2\)  
④ \(\dfrac{-1-\sqrt{13}}2\le a\le\dfrac{-1+\sqrt{13}}2\)  
⑤ 모든 실수 \(a\)

Student response format: five-choice, single correct answer.

Student figures: none.

## Exact answer

②

## Detailed student solution

왼쪽 식을 완전제곱식으로 고치면

\[
x^2-2ax+a+3=(x-a)^2-a^2+a+3
\]

이다. \((x-a)^2\ge0\)이고 \(x=a\)일 때 \(0\)이 되므로, 이 식의 최솟값은 \(-a^2+a+3\)이다.

모든 실수 \(x\)에 대하여 식이 \(0\) 이상이려면 최솟값도 \(0\) 이상이어야 한다. 따라서

\[
-a^2+a+3\ge0
\iff a^2-a-3\le0
\]

이다. 방정식 \(a^2-a-3=0\)의 두 근은

\[
a=\frac{1-\sqrt{13}}2,\qquad a=\frac{1+\sqrt{13}}2
\]

이다. 이차식 \(a^2-a-3\)은 위로 볼록하므로 \(0\) 이하인 \(a\)의 범위는 두 근 사이이며, 등호도 허용한다. 따라서

\[
\frac{1-\sqrt{13}}2\le a\le\frac{1+\sqrt{13}}2
\]

이고 정답은 ②이다.

## Primary curriculum and RPM lookup

- Primary L1: 집합과 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L2: 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L3: 명제와 조건, L3-2.3.1 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Primary L4: 명제의 참·거짓, L4-2.3.1.2 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Exact lookup path: docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학2.md, section L2-2.3 and RPM L1/L4 draft matrix row for 2022 / high / 공통수학2 / 집합과 명제 / 명제 / 명제와 조건 / 명제의 참·거짓.
- RPM-first alternatives reviewed: 역·이·대우 / 명제 변환 describes the source-adjacent quantifier-negation route, not the direct truth test asked here. 필요조건·충분조건 / 매개변수 is not selected because this item contains no relation between two conditions.
- Extension disposition: no extension proposed. The current 명제의 참·거짓 draft row covers the truth of a universally quantified proposition. No extension is passed as canonical.
- Curriculum scope: H1, 2022 공통수학2, 2학기 중간. Completing the square and finding the minimum of a quadratic are prior high-school-1 techniques. No calculus or later-grade method is used.

## Cross-concept, condition, integration

- CrossConcept: 이차식의 완전제곱식과 최솟값, used as a prior high-school-1 algebra technique to decide the proposition.
- Condition: COND_RANGE; the proposition is true on a derived parameter interval.
- Integration: SEQUENTIAL — complete the square, apply the universal quantifier through the minimum, then solve a quadratic parameter inequality.

## Difficulty author-lock

- Source difficulty: level 중; bucket 3.
- Independently judged actual level: 중.
- Independently judged actual difficultyBucket: 3.
- Confidence: high.
- Reason: the item combines a universal truth condition, a quadratic minimum, and an inclusive parameter range. Completing the square makes the decisive step direct; there is no branching into separate parameter cases.

## Blueprint and duplicate disposition

- Semantic blueprint: direct truth of a parameterized universal quadratic inequality, decided by its global minimum.
- Decisive-step signature: rewrite as \((x-a)^2+(-a^2+a+3)\); universal nonnegativity is equivalent to the minimum \(-a^2+a+3\ge0\).
- Disposition: ACCEPT_DISTINCT within B03.
- Distinction from source q14: the source asks when the negation of a universal strict-negative claim is true, changing it to an existential nonnegative claim and testing a maximum. This candidate asks when a universal nonnegative claim itself is true and tests a minimum. The quantifier goal, extremum, and equality boundary are different.
- Number-only or sign-only instance: no.
- Misconception-based distractors:
  - ① reverses the interval solution after obtaining \(a^2-a-3\le0\).
  - ③ excludes endpoint values even though the minimum may equal zero.
  - ④ changes the sign of the linear term while completing the square.
  - ⑤ assumes the positive coefficient of \(x^2\) alone guarantees nonnegativity for every parameter.
- Intended answer position: ②. The interval options distinguish inequality-direction and endpoint errors; no order-locked format applies.

## Visual asset and review status

- Visual necessity: none; completing the square fully exposes the global minimum.
- Visual specification: not required.
- Asset path / SHA-256: not applicable.
- Render status: NOT_RUN. No browser render is claimed.
- Independent math review: NOT_TESTED.
