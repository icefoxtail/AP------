# 미래엔 공통수학Ⅱ 도형의 이동 중단원 마무리 — 2축 판정 (q01–q08)

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_도형의이동_중단원마무리_고1/미래엔_공통수학2_도형의이동_중단원마무리_고1.js`
- 범위: 11문항 중 q01–q08, **8문항·16축**. q09–q11은 후속 배치.
- 문제축 8개는 좌표·변환 규칙과 직선/원의 식이 본문에 완결되어 모두 EXEMPT. 정답 좌표·넓이는 문제 그림에 공개하지 않는다.

| qid | 문제 축 개별 판정 | 해설 축 개별 판정 | capability | 해설 plan | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 두 점의 좌표와 평행이동 벡터 미지수 조건 | EXEMPT — 성분 차 (−7,3)만 구하면 됨 | — | — | N/A |
| q02 | EXEMPT — 직선·원과 이동 벡터가 모두 식으로 제시 | EXEMPT — 두 식에 x−6,y+2를 대입하는 동일 규칙 반복 | — | — | N/A |
| q03 | EXEMPT — 원본 점과 대칭축 네 종류를 제시 | BENEFICIAL — 네 대칭의 부호/좌표 교환 결과를 같은 좌표축에 비교 | construction-spike-v1 | `q03-solution.plan.json` | PASS: (−4,3) → (−4,−3),(4,3),(4,−3),(3,−4) |
| q04 | EXEMPT — 원의 중심·반지름과 4가지 대칭 조건 제시 | EXEMPT — 네 중심 좌표의 부호 교체·자리 교환으로 충분, q03과 동일 시각 관계 중복 | — | — | N/A |
| q05 | EXEMPT — 한 점의 평행이동·직선 소속 조건 | EXEMPT — 이동 후 (2,−1)를 식에 대입하면 a=−5 | — | — | N/A |
| q06 | EXEMPT — 원의 식·순서 있는 두 이동 명시 | BENEFICIAL — 원의 중심을 첫 이동·대칭 순서로 따라가고 반지름을 보존함 | construction-spike-v1 | `q06-solution.plan.json` | PASS: (1,6) → (6,5) → (5,6), r=3 |
| q07 | EXEMPT — 원본 직선과 점·수직 조건이 주어짐 | BENEFICIAL — 반사 직선과 구해야 하는 직선의 기울기 관계를 표시 | multi-curve-figure-v1 | `q07-solution.plan.json` | PASS: −2×(1/2)=−1, 후자 (−2,3) 통과 |
| q08 | EXEMPT — A와 두 대칭으로 정해지는 B,C가 완결 | BENEFICIAL — 실제 꼭짓점과 밑변에 내린 높이·직각을 도형화 | construction-spike-v1 | `q08-solution.plan.json` | PASS: A(2,1), B(−2,−1), C(1,2), H(8/5,4/5), 넓이 3 |

- `plan-lint.cjs --shallow`: 4/4 PASS; full: 4/4 PASS.
- 대칭 규칙의 점 좌표/선분/라벨, 중간·최종 중심, 직선의 기울기, 수선과 직각 표식, 삼각형 면적을 독립 재계산하여 **DRAWN_FEATURE_PARITY 4/4 PASS**.
- 문제 정답 비노출, 기본 면 채움 없음. 출력 SVG 육안 QA는 후속 렌더 담당 작업.
