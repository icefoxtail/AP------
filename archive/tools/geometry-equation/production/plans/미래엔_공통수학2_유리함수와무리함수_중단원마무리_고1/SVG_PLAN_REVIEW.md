# 미래엔 공통수학Ⅱ 유리함수와 무리함수 — 문제·해설 2축 판정 (q01–q08)

- 원문 JS: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_유리함수와무리함수_중단원마무리_고1/미래엔_공통수학2_유리함수와무리함수_중단원마무리_고1.js`.
- 이번 배치 **8문항/16축**; 잔여 q09–q11 후속. q06 문제에 있던 `q06.png`는 실물 확인(점근선 x=−2,y=−3, P(1,−2), 정답 계수 미노출) 후 유지.
- 신규 해설 **7개 plan / 5문항**(q02·q04의 각 두 소문항은 별도 그래프). 그래프를 그리라는 발문에 문제용 완성 그래프를 넣어 답을 노출하지 않는다.

| qid | 문제축/개별 근거 | 해설축/개별 근거 | capability | 계획 경로 | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 유리식 산술식만 제시 | EXEMPT — 인수분해·통분·약분으로 완결 | — | — | N/A | N/A |
| q02 | EXEMPT — 원문이 그래프를 그리도록 요구하므로 문제 그림 정답 비노출 | BENEFICIAL — 두 유리함수의 가지·점근선·축절편을 각각 정확히 나타냄 | rational-spike-v1 ×2 | `q02-solution-part1.plan.json`, `q02-solution-part2.plan.json` | PASS/PASS ×2 | PASS ×2: x=1,y=−3 및 x=−4,y=2, 절편 4개 |
| q03 | EXEMPT — 근호 포함 식의 계산 | EXEMPT — 곱셈공식·분모 유리화와 정의역 제시로 충분 | — | — | N/A | N/A |
| q04 | EXEMPT — 각 무리함수의 개형을 묻는 문제로 완성 그래프는 해설축 | BENEFICIAL — 두 시작점과 위/아래 진행 방향·정의역·치역 표시 | sqrt-affine-spike-v1 ×2 | `q04-solution-part1.plan.json`, `q04-solution-part2.plan.json` | PASS/PASS ×2 | PASS ×2: (2,3) ↑와 (−3,−2) ↓, 경계 및 표본점 |
| q05 | EXEMPT — 이동 전후 함수식과 벡터 미지 조건 완결 | BENEFICIAL — 원본과 이동 그래프·점근선 교점의 변위 비교 | multi-curve-figure-v1 | `q05-solution.plan.json` | PASS/PASS | PASS: S(−3,−1)→F(−2,−3), 벡터(1,−2), 각 유리식 일치 |
| q06 | REQUIRED — **기존 문제 PNG 유지**: 원 그래프·점근선·점(1,−2)이 그림에 들어 있음 | EXEMPT — 기존 문제 그래프에서 세 값을 직접 읽고 일차 계산하면 충분; 중복 해설 그래프 생략 | 기존 PNG | `q06.png`(원문에 유지) | N/A(신규 plan 없음) | EXISTING_PNG_REVIEWED |
| q07 | EXEMPT — f(3)=1, f=f⁻¹ 조건을 식으로 제시 | BENEFICIAL — 완성 함수와 y=x 대칭, (3,1)↔(1,3) 대응을 그래프에 표시 | multi-curve-figure-v1 | `q07-solution.plan.json` | PASS/PASS | PASS: f(x)=(−x+7)/(x+1), 점 2개·대칭축 y=x |
| q08 | EXEMPT — 초기 함수·평행이동·통과점만 제시 | BENEFICIAL — 이동 후 시작점과 통과점을 실제 무리곡선에 표시 | sqrt-affine-spike-v1 | `q08-solution.plan.json` | PASS/PASS | PASS: √(9x+18)+5, 시작(−2,5), P(−1,8), 정의역 x≥−2 |

- 공식 shallow/full: 각각 7/7 PASS. 독립 수치 계산과 표시 필드 대조 **DRAWN_FEATURE_PARITY 7/7 PASS**.
- q06 원본 PNG 관측: x=−2,y=−3 점근선, P(1,−2)의 점선, 정답 계수·합 미표시. 그림은 새로 만들지 않는다.
- 생성 SVG 실물 렌더/PNG/학생화면/A4 QA 및 JS 연결/게시 **NOT_RUN**.
