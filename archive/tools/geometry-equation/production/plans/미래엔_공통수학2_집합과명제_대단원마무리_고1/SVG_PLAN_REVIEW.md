# 미래엔 공통수학Ⅱ 집합과 명제 대단원 마무리 — SVG plan 검수

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_집합과명제_대단원마무리_고1/미래엔_공통수학2_집합과명제_대단원마무리_고1.js`
- 기준 main: `00f170df9377fe59a84a491afdfb204f9142580e`; 원문 SHA-256: `eaaf8758cf1bed5b797dfc1d20c6c146f5137804b31c8b0439637514c870b7f2`.
- 범위: q01~q17 **17문항·34축**. 문제 그림 신규 제작 0건, 해설 제작 3건, 해설 엔진 미지원 2건.
- `EXEMPT`는 그림 없이 발문/해설이 완결되는 개별 사유이며, `REQUIRED (existing)`은 현행 PNG가 이미 제공한다는 뜻이다.

| qid | 문제축 판정·사유 | 해설축 판정·사유 | capability | 제작용 plan | lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 명확한 집합의 정의 선택지 | EXEMPT — 판별 기준의 문장 비교만 필요 | — | — | N/A | N/A |
| q02 | EXEMPT — 15의 약수·원소/부분집합 표기 | EXEMPT — 원소 1,3,5,15를 열거하면 판정 완료 | — | — | N/A | N/A |
| q03 | EXEMPT — 두 집합의 원소식으로 조건 확정 | EXEMPT — 같은 집합 조건에서 a=1, b=2를 식으로 계산 | — | — | N/A | N/A |
| q04 | EXEMPT — A⊂X⊂B의 텍스트 조건 완결 | BENEFICIAL — 반드시 포함할 3·5와 선택 원소 1·7·9를 구획 | set-diagram-figure-v1 | `q04-solution.plan.json` | PASS/PASS | PASS: A⊂B, 원소 5개 소속 |
| q05 | EXEMPT — 홀수와 제곱근 상한만 명시 | EXEMPT — 21이라는 다음 홀수 경계의 부등식 계산 | — | — | N/A | N/A |
| q06 | EXEMPT — A·B·C 개별 원소가 미정, 임의 도식 금지 | BENEFICIAL — 확정된 D=A∪B, E=A∪C의 교집합을 표시 | set-diagram-figure-v1 | `q06-solution.plan.json` | PASS/PASS | PASS: D만 6, E만 1, 공통 3·9 |
| q07 | EXEMPT — n(B−A), n(A∩B), n(A∪B) 수치 완결 | BENEFICIAL — A−B/교집합/B−A의 인원수를 서로 다른 영역에 보여야 직관적 | ENGINE_CAPABILITY_PENDING | — | N/A | ENGINE_CAPABILITY_PENDING: 집합의 **영역별 개수 라벨** 지원 필요 |
| q08 | EXEMPT — p⇒q의 진리집합 보기 명시 | BENEFICIAL — P⊂Q의 방향과 여집합 포함 역전을 보여 줌 | set-diagram-figure-v1 | `q08-solution.plan.json` | PASS/PASS | PASS: P 안쪽, Q 바깥쪽, U |
| q09 | EXEMPT — 양수 x 전칭부등식 | EXEMPT — x→0+에서 경계 a≤5 도출로 충분 | — | — | N/A | N/A |
| q10 | EXEMPT — 조건문의 역과 대우를 묻는 보기 | EXEMPT — q⇒~p의 대우 p⇒~q는 논리 기호로 완결 | — | — | N/A | N/A |
| q11 | EXEMPT — a에 따라 바뀌는 두 진리집합의 식 | EXEMPT — a의 부호와 6≤a≤8의 대수 경우 나눔이 명료 | — | — | N/A | N/A |
| q12 | REQUIRED (existing) — 보기의 포함 관계를 읽는 `q12.png` 제공·유지 | EXEMPT — 기존 그림에 Q⊂P와 R=U−P가 이미 보이며 설명 반복 불필요 | 기존 PNG | — | N/A | EXISTING_ASSET (신규 plan 없음) |
| q13 | EXEMPT — p,q,r을 절댓값 등식으로 정의 | EXEMPT — 제곱하여 q⇔r을 보이고 대우를 판정 | — | — | N/A | N/A |
| q14 | EXEMPT — 양수의 곱 부등식 | EXEMPT — 20+64xy+1/(xy)에 산술·기하평균 적용 | — | — | N/A | N/A |
| q15 | EXEMPT — 동아리/성별 인원수 조건이 문장에 모두 있음 | BENEFICIAL — 교집합 총 10명과 성별 하위 집계(남 8·여 2)를 한 도식에 표시할 가치 | ENGINE_CAPABILITY_PENDING | — | N/A | ENGINE_CAPABILITY_PENDING: **집합 영역의 성별 하위 개수 라벨** 지원 필요 |
| q16 | EXEMPT — √3 무리수의 귀류법 증명 | EXEMPT — 3의 배수에 대한 정수론 논증에 도형 기여 없음 | — | — | N/A | N/A |
| q17 | EXEMPT — 양수 a,b에 대한 다항식 부등식 | EXEMPT — (a+b)(a−b)²≥0 인수분해 자체로 증명 완료 | — | — | N/A | N/A |

## DRAWN_FEATURE_PARITY 독립 대조

- **q04:** `diagram.subset=[A,B]`, 공통 원소 `3,5` 두 개와 B만의 원소 `1,7,9` 세 개를 서로 다른 소속 배열로 표시한다. 채움 없음. 값은 모두 실제 해설의 인수분해/홀수 조건에서 계산했다.
- **q06:** A·B·C의 불확정 영역은 전혀 꾸며내지 않았다. 풀이에서 정의한 D={3,6,9}, E={1,3,9}만 따로 배치하고, 교집합 `3,9`가 각각 `in:[D,E]`이므로 실제 그려진다. 채움 없음.
- **q08:** `diagram.subset=[P,Q]`는 p⇒q에 필요한 포함 방향이다. 원 안 원의 순서를 바꾸지 않았고 여집합의 역포함은 caption으로 설명한다. 채움 없음.
- **q07 엔진 간격:** 현재 `set-diagram-figure-v1`의 `sets[].count`는 집합 전체 개수를 이름 옆에만 붙인다. `elements[]`는 **유한 원소**이지 `A−B=9명` 같은 영역의 사람 수가 아니다. 총 합집합 20, 교집합 4, B−A 7 → A−B 9를 각 영역에 **의미가 정확한 카디널리티 라벨**로 그리는 범용 기능이 필요하다. 숫자를 원소로 위장하지 않는다.
- **q15 엔진 간격:** n(A∪B)=50, n(A∩B)=10, 남학생 중 교집합 8, 여학생 중 교집합 2다. 영역별 총원/성별 하위 통계 2층 표시 기능이 없고 A만·B만 각각의 크기는 미정이다. 미정 값을 만들지 않는다.
- 실제 SVG 렌더/PNG/학생 화면/A4/JS 링크: **NOT_RUN**. lint와 시각 완성은 별개다.

**집계:** 17문항 / 34축 판정 / 제작 plan 3 / shallow 3 PASS / full 3 PASS / parity 3 PASS / capability pending q07·q15 2건.
