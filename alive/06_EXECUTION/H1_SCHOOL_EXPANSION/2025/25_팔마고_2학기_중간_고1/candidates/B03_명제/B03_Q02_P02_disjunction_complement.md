# B03 candidate: disjunction truth-set complement

## Identity and provenance

- draftCandidateId: ALITE-25PAL-B03-Q02-P02
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
p:\quad (x\le-2)\text{ 또는 }|x-1|\le1
\]

라고 하자. 다음 중 조건 \(\sim p\)와 동치인 것은?

① \(-2\le x<0\) 또는 \(x>2\)  
② \(-2<x\le0\) 또는 \(x>2\)  
③ \(x\le-2\) 또는 \(0\le x\le2\)  
④ \(-2<x<0\) 또는 \(x\ge2\)  
⑤ \(-2<x<0\) 또는 \(x>2\)

Student response format: five-choice, single correct answer.

Student figures: none.

## Exact answer

⑤

## Detailed student solution

\(|x-1|\le1\)을 풀면

\[
-1\le x-1\le1\iff 0\le x\le2
\]

이다. 따라서 조건 \(p\)의 진리집합은

\[
(-\infty,-2]\cup[0,2]
\]

이다. \(\sim p\)의 진리집합은 이 합집합에 속하지 않는 실수의 집합이다. 두 구간 사이의 빈 부분과 오른쪽 바깥 부분을 쓰면

\[
(-2,0)\cup(2,\infty)
\]

이므로 조건으로는 \(-2<x<0\) 또는 \(x>2\)이다. \(x=-2,0,2\)에서는 \(p\)가 참이므로 이 세 점은 부정의 진리집합에 포함되지 않는다. 따라서 정답은 ⑤이다.

## Primary curriculum and RPM lookup

- Primary L1: 집합과 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L2: 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L3: 명제와 조건, L3-2.3.1 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Primary L4: 진리집합, L4-2.3.1.1 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Exact lookup path: docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학2.md, section L2-2.3 and RPM L1/L4 draft matrix row for 2022 / high / 공통수학2 / 집합과 명제 / 명제 / 명제와 조건 / 진리집합.
- RPM-first alternatives reviewed: 역·이·대우 / 명제 변환 is adjacent but does not describe an implication transformation; 필요조건·충분조건 / 조건 관계 or 매개변수 has no implication-classification goal here.
- Extension disposition: no extension proposed. The existing truth-set draft path represents the actual operation; no L3/L4 extension is claimed as canonical.
- Curriculum scope: H1, 2022 공통수학2, 2학기 중간. Solving a linear absolute-value inequality is within the expected prior knowledge. No later-grade concept is required.

## Cross-concept, condition, integration

- CrossConcept: 집합의 연산. The disjunction becomes a union of truth sets, and the negation is the intersection of their complements.
- Condition: COND_RANGE; endpoint inclusion determines the answer.
- Integration: SEQUENTIAL — solve each component condition, form the union, then complement the union.

## Difficulty author-lock

- Source difficulty: level 하; bucket 1.
- Independently judged actual level: 중.
- Independently judged actual difficultyBucket: 2.
- Confidence: high.
- Reason: the student solves one absolute-value inequality, represents a union of disjoint intervals, and applies the complement rule with three boundary points. There is no parameter or case split.

## Blueprint and duplicate disposition

- Semantic blueprint: disjunction → union of truth sets → complement, expressed as the intersection of component complements.
- Decisive-step signature: reduce \(A\lor B\) to \((-\infty,-2]\cup[0,2]\), then form \(\mathbb R\setminus(A\cup B)=(-2,0)\cup(2,\infty)\).
- Disposition: ACCEPT_DISTINCT within B03.
- Distinction from the source: the source has a single absolute-value condition; this item requires the complement of a union and yields a bounded gap plus a ray.
- Distinction from B03_Q02_P01: the connective and set operation are different. P01 intersects component truth sets before complementing; P02 unions them and takes the intersection of their complements.
- Number-only or sign-only instance: no.
- Misconception-based distractors:
  - ① includes \(-2\), where \(p\) is true.
  - ② includes \(0\), where the absolute-value condition is true.
  - ③ repeats the truth set of \(p\) without negating it.
  - ④ includes \(2\), where \(p\) is true.
- Intended answer position: ⑤. The alternatives diagnose the three endpoint errors and the failure to negate; no order-locked format applies.

## Visual asset and review status

- Visual necessity: none; the truth sets are intervals derived directly from text.
- Visual specification: not required.
- Asset path / SHA-256: not applicable.
- Render status: NOT_RUN. No browser render is claimed.
- Independent math review: NOT_TESTED.
