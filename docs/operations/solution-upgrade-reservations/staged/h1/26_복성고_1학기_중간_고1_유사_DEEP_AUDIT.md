# 26_복성고_1학기_중간_고1_유사 — 심층 수학·시각 감사

> 2026-11-22 KST. 이 파일은 현행 시험지 JS·연결 자산을 직접 읽고 판단한 **검수 영수증/수정 인계**이며 운영 소스 변경 기록이 아니다.

- 소스: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사.js`; Git blob `946b94c01accfd7623747189f9d5d661d34ec8a5`
- 원본 대조: `archive/exams/original/high/h1/1mid/26_복성고_1학기_중간_고1_기출.js`; Git blob `69cd59c4fb7988914c63025c6051d280773e4864`
- 범위: 전 24문항(발문·보기·정답·현재 해설), 기존 연결 이미지 8개 실제 SVG 렌더 및 시각 확인, 원본 기출 이미지 역할별 대조
- 수학 감사: KEEP 24 / UPGRADE 0 / HOLD 0 / UNREAD 0. 계산·그래프·조건의 결정 단계와 정답 번호/값을 확인함. 아래 근거는 해당 문항의 핵심 독립 산식이다.
- 기존 이미지: 8/8 참조 존재, 실제 렌더 오류 0, 눈에 띄는 수학적/표기적 불일치 발견 0. 기존 SVG를 학생 실기기/브라우저 전수검증한 것은 아님.
- **이미지 구성 누락**: 원본 기출 대비 10개 역할(4 문제, 6 해설)이 유사 JS에서 누락. 구형 `EXEMPT/UNSUPPORTED` 판단은 2026-11-20 유사 1:1 그림 상속 정책과 재대조 필요.
- 결과: `MATH_AUDIT_DRAFT_COMPLETE` / `LINKED_SVG_VISUAL_REVIEWED` / `IMAGE_PARITY_HOLD` / `ENGINE_NOT_RUN` / `STUDENT_CHROME_NOT_RUN` / `GOLDEN_NEGATIVE_NOT_RUN` / `MAIN_NOT_CHANGED`.

## 문항별 수학 판정 및 이미지 결속

| qid | 단원/범주 | 현행 정답 | 판정 | 핵심 검산 근거 | 연결 이미지 P/S | 원본 대비 누락 P/S |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | 이차함수와 직선의 교점 | ④ | KEEP | (가),(다)의 D≥0, (나)는 D=−7 | — | S |
| 02 | 다항식의 덧셈과 뺄셈 | ② | KEEP | 3A−2B=7x²−14x+29 | — | — |
| 03 | 전개식의 계수 | ③ | KEEP | (a,b)=(5,3) → a+3b=14 | — | — |
| 04 | 복소수의 연산 | ① | KEEP | 복소수 합 −4+3i → 크기제곱 25 | — | — |
| 05 | 곱셈공식과 대칭식 | ③ | KEEP | a+b+c=11, a²+b²+c²=45 → 겉넓이 76 | — | P,S |
| 06 | 항등식의 미정계수 | ② | KEEP | (a,b,c)=(1,2,2) → ab+c=4 | — | — |
| 07 | 직선과 이차함수의 위치 관계 | ④ | KEEP | −3<k<15/4 → 정수 6개 | — | S |
| 08 | 인수분해와 나머지 | ① | KEEP | 15¹⁰≡1 (mod7); 32≡4 → 월요일 | — | — |
| 09 | 구간에서의 이차함수 최댓값 | ③ | KEEP | h=−3(x−2/3)²+16/3 | S | — |
| 10 | 나머지정리와 중첩 나눗셈 | ⑤ | KEEP | R(2)=5,R(3)=16 → R(4)=27 | — | — |
| 11 | 모든 실수 매개변수에서 실근 조건 | ④ | KEEP | a=5,b≤100 → 최대 합 105 | — | S |
| 12 | 복소수의 거듭제곱의 주기 | ② | KEEP | 두 복소 거듭제곱이 각각 1 → n은 12의 배수 16개 | — | — |
| 13 | 조건으로 이차함수 구하기 | ① | KEEP | 꼭짓점 x=5, f(0)=16 | S | — |
| 14 | 조건이 있는 순열(음수의 제곱근) | ③ | KEEP | b>0,a<0:36개; b=0:15개 → 51 | — | P |
| 15 | 인수분해를 이용한 수의 곱셈 분해 | ④ | KEEP | 소인수분해 2⁵·3·17·83; 두 자리 쌍 4개 | — | — |
| 16 | 직각삼각형에 내접하는 직사각형의 최대 넓이 | ② | KEEP | 삼각형 최대 직사각형 넓이 αβ/4=7/4 | P,S | — |
| 17 | 켤레복소수와 이차방정식의 계수 | ⑤ | KEEP | a²=3,b²=1,n=4 → m²+n²=28 | S | — |
| 18 | 포물선과 직선으로 만든 도형의 넓이 | ① | KEEP | S1=3a²/2, S2=27+27a/2 → a=6 | S | P |
| 19 | 원과 정사각형, 이차방정식의 해와 식의 값 | ⑤ | KEEP | 반지름 8−2√6 → 식 38−12√6 → 합 26 | — | P,S |
| 20 | 인수분해를 이용한 다항식 결정 | ⑤ | KEEP | 가능한 접점 매개변수 k=±√5 → 곱 −5 | — | S |
| 21 | 근으로 이차방정식 만들기 | $6x^2-30x+25=0$ | KEEP | 새 근의 합 5, 곱 25/6 → 6x²−30x+25 | — | — |
| 22 | 구간에서 최댓값이 주어진 이차함수의 최솟값 | 8 | KEEP | a=9/4, 구간 최소 f(1)=8 | S | — |
| 23 | 구간의 최댓값·최솟값 조건으로 이차함수 구하기 | $\dfrac{29}{5}$ | KEEP | p=3,q=49/5 → f(5)=29/5 | S | — |
| 24 | 나눗셈 항등식과 차수 추론 | 196 | KEEP | f=2x²−8x−10, f(−2)²=196 | — | — |

## 원본 기출 이미지 대비 누락 역할

| qid | 역할 | 구형 계획 판정 | 현행 plan 경로 |
| --- | --- | --- | --- |
| 01 | 해설 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q01-solution.plan.json` |
| 05 | 문제 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q05-problem.plan.json` |
| 05 | 해설 | UNSUPPORTED | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q05-solution.plan.json` |
| 07 | 해설 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q07-solution.plan.json` |
| 11 | 해설 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q11-solution.plan.json` |
| 14 | 문제 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q14-problem.plan.json` |
| 18 | 문제 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q18-problem.plan.json` |
| 19 | 문제 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q19-problem.plan.json` |
| 19 | 해설 | UNSUPPORTED | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q19-solution.plan.json` |
| 20 | 해설 | EXEMPT | `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사_plans/q20-solution.plan.json` |

미연결 역할을 단순히 `VISUAL_PASS`로 합치지 않는다. 결함·엔진 지원 제약·학생 관점 인수조건 및 정확한 재생성 위치는 [SVG 엔진 수정 실행 플랜](H1_1MID_SIMILAR_BATCH6_SVG_ENGINE_REPAIR_EXECUTION_PLAN_20261122.md)에 기록한다. 해설 텍스트 및 정답이 맞더라도 원본 이미지가 있던 1:1 유사에서는 그림 상속 정책을 별도로 충족해야 한다.

## 제한 및 후속 인계

- 이 감사는 현행 JS 및 관련 SVG/PNG의 스냅숏 검수다. source JS, 원본 이미지, 엔진, 원본 기출, `main` 및 승인 기록을 바꾸지 않았다.
- `EXEMPT`나 `UNSUPPORTED`는 기존 제작 당시 기록으로 인용한 것이고, 이번 신규 승인 결론이 아니다. 필요한 그림은 전용 Codex SVG 엔진 작업자가 원본/유사 조건에 맞게 재생성·검산·시각 재검수한 뒤 JS에 연결한다.
- 연결 이미지 실물 렌더 QA는 PyMuPDF + SVG 내 class 보정 로컬 복제본으로 수행했다. CSS 선종/브라우저별 표현 완전 동일성을 보증하지 않는다.
