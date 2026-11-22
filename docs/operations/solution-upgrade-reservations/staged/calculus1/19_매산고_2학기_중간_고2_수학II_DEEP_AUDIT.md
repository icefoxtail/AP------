# 2019 매산고 2학기 중간 고2 수학II — 심층감사 진행 중

- lane: lane10 / calculus1 (2015 수학II)
- sourcePath: `archive/exams/original/high/h2/2mid/19_매산고_2학기_중간_고2_수학II.js`
- sourceRef: main / blob `612069d00d46c48bdaef4ad16e811ca1d477092a`
- status: **IN_PROGRESS**; nextQid: **Q04**; completed audits: **3**; remaining: **Q04–Q20 이상 (원본 분모 전체 확정 대기)**.
- 이전 장부 기준 이 회차 5장 목표, 현재 완결 **0/5**. 공유 claim 생략 (사용자 지시).
- 필독: HARNESS_CURRENT, GLOBAL_QUEUE_CURRENT, DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT, docs-manifest 및 core 문서 일부 원격 본문 조회. core 전수 읽기, Golden/Negative, preflight, SVG/학생 렌더: **NOT_RUN**.
- 원본 그림 Q13 PNG 등 시각 확인 **NOT_RUN**. 다음 실행에서 원본 전체 및 이미지 확인 필요.
- 모든 UPGRADE 작성 및 EXAM_AUDIT_COMPLETE: **NOT_DONE**. JS/SVG/main 미변경.

## Q01 — KEEP (READ_EVIDENCED)
- 원문: `lim_{x→3}(x²−x−6)/(x−3)`; 보기 1,2,3,4,5; answer ⑤.
- 기존 solution 원문 핵심: `x^2-x-6=(x-3)(x+2)`; `\dfrac{(x-3)(x+2)}{x-3}=x+2`; `\lim_{x\to3}(x+2)=5`.
- 독립 검산: `x²−x−6=(x−3)(x+2)`, 따라서 x≠3에서 몫=x+2, 극한=5.
- KEEP 이유: 인수분해, x≠3 약분 조건, 대입이 모두 원문 풀이에 있으며 정의되지 않은 점의 극한도 구별한다. 그림 없음.

## Q02 — KEEP (READ_EVIDENCED)
- 원문: `f(x)=(x²+4x+4)/(x²−9)`의 불연속 x값의 합; 보기 −9,−3,0,3,9; answer ③.
- 기존 solution 원문 핵심: `x^2-9=(x-3)(x+3)`; `x=3$에서 $25$, $x=-3$에서 $1`; `3+(-3)=0`.
- 독립 검산: 분모 0인 x=±3에서 분자 (x+2)²는 각각 25,1로 0이 아니다. 두 지점 모두 불연속이며 합 0.
- KEEP 이유: 두 분모 영점의 비소거를 실제 수치로 확인하고 분자의 영점 −2를 배제하는 설명이 있다. 그림 없음.

## Q03 — KEEP (READ_EVIDENCED)
- 원문: `f(x)=x³−x+2`, x=1 순간변화율; 보기 1,2,3,4,5; answer ②.
- 기존 solution 원문 핵심: `\lim_{h\to0}\dfrac{f(1+h)-f(1)}{h}=f'(1)`; `f'(x)=3x^2-1`; `f'(1)=3\cdot1^2-1=2`.
- 독립 검산: 도함수 3x²−1에 x=1 대입 → 2. 미분계수 정의와 결과가 일치.
- KEEP 이유: 순간변화율 정의에서 도함수와 대입까지 연결되며 상수항 미분 0도 설명한다. 그림 없음.

## 재개
- **Q04부터 원본 content/choices/answer/solution을 문항별로 직접 읽고 독립 검산**. 이미지 있는 문항은 원본 실물 확인, 미확인 시 HOLD.
- 원본 분모 및 모든 qid 확정 후 문항별 근거 기록, 모든 UPGRADE 학생용 풀이 완성, 커밋/readback 뒤에만 완료 승격.
