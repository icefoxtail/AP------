# B03 candidate: conjunction truth-set complement

## Identity and provenance

- draftCandidateId: ALITE-25PAL-B03-Q02-P01
- sourceQid: 2
- sourceQidField: literal window.questionBank[].id
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creator route: gpt-6-luna / max
- status: CREATE_DRAFT; independent review NOT_TESTED; browser render NOT_TESTED

## Full student prompt

실수 \(x\)에 대한 조건 \(p\)를

\[
p:\quad (-2\le x<4)\text{이고 }x^2\le9
\]

라고 하자. 다음 중 조건 \(\sim p\)와 동치인 것은?

① \(x<-2\) 또는 \(x>3\)  
② \(-2\le x\le3\)  
③ \(x\le-2\) 또는 \(x>3\)  
④ \(x<-2\) 또는 \(x\ge3\)  
⑤ \(x<-3\) 또는 \(x\ge4\)

Student response format: five-choice, single correct answer.

Student figures: none.

## Exact answer

①

## Detailed student solution

조건 \(p\)가 참이려면 두 부등식이 모두 성립해야 한다.

첫째 조건 \(-2\le x<4\)의 진리집합은 \([-2,4)\)이다. 둘째 조건은

\[
x^2\le9\iff -3\le x\le3
\]

이므로 진리집합은 \([-3,3]\)이다. 따라서 \(p\)의 진리집합은 두 구간의 교집합

\[
[-2,4)\cap[-3,3]=[-2,3]
\]

이다. \(\sim p\)는 이 구간에 속하지 않는 실수 전체이므로

\[
x<-2\quad\text{또는}\quad x>3
\]

이다. 양 끝점 \(-2\)와 \(3\)에서는 \(p\)가 참이므로 부정의 진리집합에는 들어가지 않는다. 따라서 정답은 ①이다.

## Primary curriculum and RPM lookup

- Primary L1: 집합과 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L2: 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L3: 명제와 조건, L3-2.3.1 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Primary L4: 진리집합, L4-2.3.1.1 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Exact lookup path: docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학2.md, section L2-2.3 and RPM L1/L4 draft matrix row for 2022 / high / 공통수학2 / 집합과 명제 / 명제 / 명제와 조건 / 진리집합.
- RPM-first alternatives reviewed: 역·이·대우 / 명제 변환 is a nearby draft path, but this problem does not transform an implication; 필요조건·충분조건 / 조건 관계 or 매개변수 has no implication-classification goal here.
- Extension disposition: no extension proposed. The existing truth-set draft path represents the actual operation; no L3/L4 extension is claimed as canonical.
- Curriculum scope: H1, 2022 공통수학2, 2학기 중간. Solving \(x^2\le9\) uses prior high-school-1 quadratic inequality knowledge. No later-grade concept is required.

## Cross-concept, condition, integration

- CrossConcept: 집합의 연산. The conjunction becomes an intersection of truth sets; its negation is the complement of that intersection.
- Condition: COND_RANGE; the truth set is controlled by interval endpoints.
- Integration: SEQUENTIAL — solve each condition, intersect the truth sets, then take the complement.

## Difficulty author-lock

- Source difficulty: level 하; bucket 1.
- Independently judged actual level: 중.
- Independently judged actual difficultyBucket: 2.
- Confidence: high.
- Reason: the student must solve one quadratic inequality, intersect two interval conditions, and complement the resulting interval while retaining both endpoint exclusions. The work is short and has no case split.

## Blueprint and duplicate disposition

- Semantic blueprint: composite conjunction → intersection of truth sets → complement of the intersection.
- Decisive-step signature: reduce \(A\land B\) to \(A\cap B=[-2,3]\), then form \(\mathbb R\setminus[-2,3]\).
- Disposition: ACCEPT_DISTINCT within B03.
- Distinction from the source: the source asks for the negation of one absolute-value inequality. This item requires two truth sets and an intersection before taking the complement.
- Distinction from B03_Q02_P02: this item starts from a conjunction and produces the two exterior rays; P02 starts from a disjunction and produces an interior gap plus a ray.
- Number-only or sign-only instance: no.
- Misconception-based distractors:
  - ② gives the truth set of \(p\) instead of its negation.
  - ③ includes \(-2\), even though \(p\) is true there.
  - ④ includes \(3\), even though \(p\) is true there.
  - ⑤ incorrectly requires both component conditions to be false; the negation of a conjunction is a disjunction of complements.
- Intended answer position: ①. The four distractors each correspond to a different logical or endpoint error; no order-locked format applies.

## Visual asset and review status

- Visual necessity: none; interval conditions are fully specified in text.
- Visual specification: not required.
- Asset path / SHA-256: not applicable.
- Render status: NOT_RUN. No browser render is claimed.
- Independent math review: NOT_TESTED.
