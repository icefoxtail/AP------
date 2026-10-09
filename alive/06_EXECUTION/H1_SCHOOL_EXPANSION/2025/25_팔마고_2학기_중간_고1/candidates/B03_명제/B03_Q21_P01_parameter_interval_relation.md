# B03 candidate: parameterized interval containment and condition relation

## Identity and provenance

- draftCandidateId: ALITE-25PAL-B03-Q21-P01
- sourceQid: 21
- sourceQidField: literal window.questionBank[].id
- sourcePath: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- sourceGitBlobSHA1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- sourceFileSHA256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- creator route: gpt-6-luna / max
- status: CREATE_DRAFT; independent review NOT_TESTED; browser render NOT_TESTED

## Full student prompt

실수 \(x\)와 실수 \(a\)에 대하여 두 조건 \(p,q\)를

\[
p:\quad x^2-6x+8\le0,\qquad q:\quad |x-a|<2
\]

라고 하자.

1) 두 조건 \(p,q\)의 진리집합을 각각 구하시오. [2점]  
2) \(p\)가 \(q\)이기 위한 충분조건이지만 필요조건은 아니도록 하는 실수 \(a\)의 범위를 구하고, 그 이유를 서술하시오. [3점]

[총 5점]

Student response format: constructed response. Part 1 must express both truth sets in interval notation. Part 2 must give the exact range of \(a\), show that \(p\Rightarrow q\), and provide a value of \(x\) (or an equivalent argument) showing that \(q\Rightarrow p\) is false.

Student figures: none.

## Exact answer

1) \(P=[2,4]\), \(Q=(a-2,a+2)\).  
2) \(2<a<4\).

## Detailed student solution

1) 인수분해하면

\[
x^2-6x+8=(x-2)(x-4)
\]

이다. 따라서 \((x-2)(x-4)\le0\)을 만족하는 범위는 \(2\le x\le4\)이고,

\[
P=[2,4]
\]

이다. \(|x-a|<2\)는

\[
-2<x-a<2\iff a-2<x<a+2
\]

이므로

\[
Q=(a-2,a+2)
\]

이다.

2) \(p\)가 \(q\)이기 위한 충분조건이라는 말은 \(p\Rightarrow q\), 즉 \(P\subseteq Q\)라는 뜻이다. \(P=[2,4]\)의 양 끝점도 \(Q=(a-2,a+2)\)에 들어가야 하므로

\[
a-2<2,\qquad 4<a+2
\]

이어야 한다. 이를 풀면 \(a<4\), \(a>2\)이므로 \(2<a<4\)이다.

이 범위에서 \(q\)가 \(p\)이기 위한 충분조건은 아님을 보이자. \(x=\dfrac a2\)로 두면

\[
|x-a|=\left|\frac a2-a\right|=\frac a2<2
\]

이므로 \(q\)는 참이다. 반면 \(2<a<4\)이므로 \(x=\dfrac a2<2\)이고, 따라서 \(x\notin[2,4]=P\)이다. 즉 \(p\)는 거짓이다. 그러므로 \(q\Rightarrow p\)는 거짓이며 \(p\)는 \(q\)이기 위한 충분조건이지만 필요조건은 아니다. 정답은 \(2<a<4\)이다.

## Primary curriculum and RPM lookup

- Primary L1: 집합과 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L2: 명제 — RPM Primary v1.0 matrix status RPM_VERIFIED.
- Primary L3: 필요조건·충분조건, L3-2.3.3 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Primary L4: 매개변수, L4-2.3.3.2 — exact 2022 공통수학2 course-document match, status CANONICAL_DRAFT.
- Exact lookup path: docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학2.md, section L2-2.3 and RPM L1/L4 draft matrix row for 2022 / high / 공통수학2 / 집합과 명제 / 명제 / 필요조건·충분조건 / 매개변수.
- RPM-first alternatives reviewed: 명제와 조건 / 진리집합 describes the interval representation but not the target classification; 필요조건·충분조건 / 조건 관계 is the unparameterized neighbor, while this item asks for a parameter range within that relation.
- Extension disposition: no extension proposed. The exact existing 매개변수 draft row under 필요조건·충분조건 fits the goal; it is recorded as CANONICAL_DRAFT, not as a verified or promoted L4.
- Curriculum scope: H1, 2022 공통수학2, 2학기 중간. Factoring a quadratic and solving an absolute-value inequality use prior high-school-1 material. No later-grade concept is required.

## Cross-concept, condition, integration

- CrossConcept: 집합의 포함 관계. Implication is checked as inclusion between the truth sets \(P,Q\).
- Condition: COND_RANGE; the moving open interval produces a strict parameter range.
- Integration: SEQUENTIAL — find \(P,Q\), translate implication into set inclusion, solve endpoint inequalities, then refute the reverse implication with a witness.

## Difficulty author-lock

- Source difficulty: level 중; bucket 3.
- Independently judged actual level: 중.
- Independently judged actual difficultyBucket: 3.
- Confidence: high.
- Reason: the response requires interval conversion, a parameterized containment test with open endpoints, and a concrete witness for the failed reverse implication. The witness \(x=a/2\) follows directly from the derived range.

## Blueprint and duplicate disposition

- Semantic blueprint: classify a parameterized condition relation by interval containment, with a constructive counterexample for the failed converse.
- Decisive-step signature: \(P=[2,4]\subset(a-2,a+2)=Q\) gives \(2<a<4\); \(x=a/2\in Q\setminus P\) proves the reverse implication false.
- Disposition: ACCEPT_DISTINCT within B03.
- Distinction from source q21: the source has fixed truth sets and defines a third condition by \(\sim p\), then classifies that condition relative to \(q\). This candidate moves one truth set with \(a\), solves a strict interval-containment range, and constructs a parameter-dependent counterexample.
- Number-only or sign-only instance: no.
- Misconception-based distractors: not applicable to student choices because this is constructed response. The solution rubric should flag (a) reversing \(p\Rightarrow q\) into \(Q\subseteq P\), (b) including \(a=2\) or \(a=4\) despite the open endpoints of \(Q\), and (c) claiming “not necessary” without showing a case where \(q\) is true and \(p\) is false.
- Intended answer position: not applicable; constructed response.

## Visual asset and review status

- Visual necessity: none; interval notation and endpoint inequalities suffice.
- Visual specification: not required.
- Asset path / SHA-256: not applicable.
- Render status: NOT_RUN. No browser render is claimed.
- Independent math review: NOT_TESTED.
