# 미래엔 대수 지수함수와 로그함수 중단원마무리 — 이번 배치 2축 판정

- source JS: `archive/exams/textbooks/미래엔_대수/미래엔_대수_지수함수와로그함수_중단원마무리_고2/미래엔_대수_지수함수와로그함수_중단원마무리_고2.js`
- source Git blob: `b58ebea53776c382d2d58ee835fb828b3be891ec`
- coverage: q01–q06 (6문항·12축 판정). q07–q15는 이번 25문항 배치 밖이며 미판정이다.
- 모든 제작 plan: 공식 `plan-lint.cjs --shallow` 및 full **PASS**. 렌더·PNG·학생화면·A4 **NOT_RUN**.

| qid | 문제축 판정 및 사유 | 해설축 판정 및 사유 |
| --- | --- | --- |
| q01 | EXEMPT — 두 함수의 식만 주고 그래프를 직접 그리라고 하므로 문제에 완성 그래프를 미리 보여 주면 답을 노출 | REQUIRED — 각 그래프의 방향·점근선·기준점을 실제 제시: `q01-solution.plan.json` |
| q02 | EXEMPT — 수 비교 대상이 두 식으로 제시 | EXEMPT — 밑을 같게 하여 단조성만 판단 |
| q03 | EXEMPT — 지수·로그 방정식 네 개의 순수 계산 | EXEMPT — 같은 밑의 지수 비교와 로그 역연산으로 완결 |
| q04 | EXEMPT — 네 지수·로그 부등식의 순수 계산 | EXEMPT — 진수 조건·단조성·부등호 방향을 식으로 판단 |
| q05 | EXEMPT — 평행이동과 원점 통과 조건이 문자로 완결; 이동량 m은 미지 | BENEFICIAL — 원함수·이동함수·원점 관계: `q05-solution.plan.json` |
| q06 | EXEMPT — k가 미지인 그래프를 발문에 새로 그리면 경계값을 암시 | BENEFICIAL — k=−5일 때 x>0의 제1사분면 비통과: `q06-solution.plan.json` |

## DRAWN_FEATURE_PARITY

| qid/축 | 조건 → 실제 그려지는 필드 | sourceVsPlan | featureParity |
| --- | --- | --- | --- |
| 01/해설 | ⑴ y=−5ˣ → 첫 패널 `EXPONENTIAL` A=−1/base=5와 (0,−1) 점, y=0 점근선; ⑵ y=log₂(−x) → 둘째 패널 `LOGARITHMIC` k=−1, 점 (−1,0),(−2,1), x=0 점근선 | REVIEWED | PASS |
| 05/해설 | 원함수 y=2ˣ → `curves[base]`; x방향 +3·y방향 −1/8 → `curves[moved].shiftX=3`, C=−1/8; 원점 통과 → `points[O]` | REVIEWED | PASS |
| 06/해설 | y=(1/5)^(x−1)+k → `curves[f]` base=1/5, shiftX=1; 경계 k=−5 → C=−5, (0,0) → `points[O]`, x>0 감소곡선 | REVIEWED | PASS |

PASS는 원문·해설 대비 플랜의 곡선·점·값·방향 필드 검증이다. 실제 SVG·PNG 및 학생화면/A4 검수는 별도로 **NOT_RUN**.
