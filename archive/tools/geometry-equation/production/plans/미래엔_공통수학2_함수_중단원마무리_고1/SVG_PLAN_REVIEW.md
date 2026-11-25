# 미래엔 공통수학Ⅱ 함수 중단원 마무리 — SVG plan 검수

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_함수_중단원마무리_고1/미래엔_공통수학2_함수_중단원마무리_고1.js`
- 기준 main: `00f170df9377fe59a84a491afdfb204f9142580e`; 원문 SHA-256: `f69a0db910a68c2729655caa376c29e4deacdddfa7b2f05fc2ed0ef19c29c21f`.
- 범위: q01~q05 **5문항·10축**. q06~q11은 후속. q09 원본 `q09.png`은 이번에 변경하지 않음.

| qid | 문제축 판정·사유 | 해설축 판정·사유 | capability | 제작용 plan | lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — X, Y와 함수식 4개가 모두 주어짐; 대응도를 문제에 그리면 선택 답 노출 | BENEFICIAL — 조건을 만족하는 세 함수의 원소별 대응 방향을 나란히 보여 줌 | composite-panels-v1 / set-diagram-figure-v1 | `q01-solution.plan.json` | PASS/PASS | PASS: X,Y 및 9개 화살표 대응 |
| q02 | EXEMPT — 일대일·항등·상수 판별식 주어짐 | EXEMPT — 직선 기울기와 y=x, 상수식으로 분류 완결 | — | — | N/A | N/A |
| q03 | EXEMPT — f,g 및 합성 계산값 요청 | EXEMPT — 네 개의 대입·함수 합성 계산 반복 외 시각정보 없음 | — | — | N/A | N/A |
| q04 | EXEMPT — 일차함수와 역함숫값 두 개 | EXEMPT — 4a+6=2와 x=(y−6)/4의 일차식 역산 | — | — | N/A | N/A |
| q05 | EXEMPT — 정의역 {1,2}에서 f=g 조건 | EXEMPT — 두 함숫값 연립식만으로 a=3, b=−2 도출 | — | — | N/A | N/A |

## DRAWN_FEATURE_PARITY 독립 대조

- X=`[-1,0,1]`, Y=`[0,1,2,3]`가 **세 패널 각각** `diagram.columns`에 있다.
- ⑴ `x+2`: `−1→1, 0→2, 1→3`이 각 `arrows[].to.element` 1,2,3(0부터 센 색인)으로 표시된다.
- ⑶ `|x−1|`: `−1→2, 0→1, 1→0`이 to 2,1,0이다.
- ⑷ `3|x|`: `−1→3, 0→0, 1→3`이 to 3,0,3이다. 서로 다른 원소가 같은 y로 향해도 함수임을 보여 준다.
- ⑵ `x²−1`은 x=0에서 −1이 공역 Y 밖이라 **실패 함수를 올바른 대응도로 위조하지 않는다**. 그 이유는 caption과 기존 해설에 표시한다. 실제로 그려야 하는 9개 화살표는 모두 `arrows` 필드에 존재한다. 면 채움 없음.
- SVG 렌더/PNG/학생 화면/A4/JS 링크: **NOT_RUN**.

**집계:** 5문항 / 10축 판정 / 제작 plan 1 / shallow 1 PASS / full 1 PASS / parity 1 PASS / capability pending 0건.
