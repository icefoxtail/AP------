# SVG 플랜 원문 2축 전수 재점검 — 비상_공통수학2_유리함수와무리함수_중단원학습점검_고1

- 소스 시험지: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1.js` (12문항, 24축)
- 대상 변경: **본 폴더의 JSON 플랜과 검수 장부만**. 시험지 JS·기존 이미지 SVG/PNG·엔진 코드 미수정.
- 기준: 원본 발문·해설·기존 이미지 에셋을 기점으로 **선·점선·좌표/라벨·교차 관계·면 채움**을 1:1 수작업 대조. 흰색 배경/원판 fill은 플랜에서 의도하지 않음. 집합 증명의 교차영역 색칠만 필수이므로 보존.
- 검사: `plan-lint.cjs --shallow --jobs 4 <각 *.plan.json>` **7/7 OK**; `plan-lint.cjs --jobs 4 <각 *.plan.json>` **7/7 OK**. 2026-11-27, 지정 경로 명시적 열거(린터 폴더 자동탐색은 `*.plan.json` 이름을 제외하므로 파일 인자로 입력).
- **중요:** 본 담당은 plan-only 레인. SVG 렌더·PNG 육안검수·학생화면·A4·JS 자산 결속은 **NOT_RUN**. 따라서 아래의 “소스→필드 1:1”은 원문과 플랜의 정적 대응만 뜻하며, **실제 SVG DRAWN_FEATURE_PARITY 완료를 의미하지 않음**. 미지원 기능은 별도 **ENGINE_CAPABILITY_PENDING**으로 보류.
- 결과: 3축 정적 1:1, 2축 엔진 기능 대기, 19축 그림 불필요. 플랜 7개.

## 기존 자산 대조

- `q02_rational-graphs.svg`(해설): 흰 전면 배경과 촘촘한 `grid` 선 반복 확인. 각각의 유리함수/점근선 한 판씩 다시 계획하여 격자·면 채움 제외.
- `q04_radical-graphs.svg`(해설): 두 함수를 실제 시작점·증감방향·절편·정의역/치역 끝점으로 분리해 재설계.
- `q08_source-graph.png`(문항): **실제 원본 PNG 육안 확인**. 끝점 (3,−1), y절편 2, x=3·y=−1 점선, 문자식 `y=√(ax+b)+c`가 핵심.
- `q12_intersection-threshold.svg`(해설): 곡선과 `m=1,2` 두 직선의 겹침/분리 및 시작점의 정확한 위치를 재설계.

## 문항별 2축 판정

| 파일/qid | 축 | 판정 | capability | plan경로 (본 폴더 기준) | plan-lint | DRAWN_FEATURE_PARITY / 면제 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| q01 / `qid_v1_4880ea004b5cb34114e33a12a722e382174b022ecc5f3bf42c53be3fba2731aa` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 유리식 계산·인수분해만 수행 |
| q01 / `qid_v1_4880ea004b5cb34114e33a12a722e382174b022ecc5f3bf42c53be3fba2731aa` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 유리식 계산·인수분해만 수행 |
| q02 / `qid_v1_ef5ce8496953bfc7e7c0d407670ac6e7dd80c2a9b8c99c1f0a4792ec49bc6eab` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문이 직접 두 그래프를 그리라는 과제여서 문제축에 선행 그래프 제공 시 정답 노출 |
| q02 / `qid_v1_ef5ce8496953bfc7e7c0d407670ac6e7dd80c2a9b8c99c1f0a4792ec49bc6eab` | 해설 | PLAN_READY_STATIC | `rational/sqrt-spike-v1` | `q02-solution-part1.plan.json`, `q02-solution-part2.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q03 / `qid_v1_3a580cc27f9ec92871ef20bdcd8318d1ea12a005cab08ff1cbd99d3aa051ab18` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 근호식의 곱셈·통분 계산 |
| q03 / `qid_v1_3a580cc27f9ec92871ef20bdcd8318d1ea12a005cab08ff1cbd99d3aa051ab18` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 근호식의 곱셈·통분 계산 |
| q04 / `qid_v1_f8fc697c5f9a2fcfb1a118a862f460b005222944944b1b116df3b75155f5782c` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문이 직접 무리함수 그래프를 그리라는 과제 |
| q04 / `qid_v1_f8fc697c5f9a2fcfb1a118a862f460b005222944944b1b116df3b75155f5782c` | 해설 | PLAN_READY_STATIC | `rational/sqrt-spike-v1` | `q04-solution-part1.plan.json`, `q04-solution-part2.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q05 / `qid_v1_83e8723cc117b834dd6c48738db4d26b596db3e9eb2cd470a6e415dc24ea4168` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 두 점근선 비교로 이동량을 계산하는 대수 문제(원본 그림 없음) |
| q05 / `qid_v1_83e8723cc117b834dd6c48738db4d26b596db3e9eb2cd470a6e415dc24ea4168` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 두 점근선 비교로 이동량을 계산하는 대수 문제(원본 그림 없음) |
| q06 / `qid_v1_b9e9ae92aa6aa2aa8786a952c72ccc1ccd656f14c4e9e36306555cfa136f58fc` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 원점 통과 조건과 점근선 계수 비교의 대수 문제(원본 그림 없음) |
| q06 / `qid_v1_b9e9ae92aa6aa2aa8786a952c72ccc1ccd656f14c4e9e36306555cfa136f58fc` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 원점 통과 조건과 점근선 계수 비교의 대수 문제(원본 그림 없음) |
| q07 / `qid_v1_f7e953566c7697de2dfc51c06f8a52d2d17142aa47fa96ca77b6aa925d0c2544` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 양의 홀수 약수 세 개를 열거하는 정수 계산 |
| q07 / `qid_v1_f7e953566c7697de2dfc51c06f8a52d2d17142aa47fa96ca77b6aa925d0c2544` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 양의 홀수 약수 세 개를 열거하는 정수 계산 |
| q08 / `qid_v1_0efd7f6b48c53117c4416c3244747fb53d70081a821002caa5e67df1d9ae3b09` | 문항 | ENGINE_CAPABILITY_PENDING | `SYM_SQRT_LABEL_TEX` | `q08-problem.plan.json` | shallow **OK**, full **OK** | 부분일치 / SVG NOT_RUN |
| q08 / `qid_v1_0efd7f6b48c53117c4416c3244747fb53d70081a821002caa5e67df1d9ae3b09` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 문제축 제공 곡선을 풀이에서 대입하여 계수를 산출; 별도 새 그림은 동일 정보 반복 |
| q09 / `qid_v1_d03a7c164d39f75fd8e82c61a8582dadff5603e2130086b480ca8a10683af750` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 정의역 닫힌 구간에서 단조성을 쓰는 대수 계산 |
| q09 / `qid_v1_d03a7c164d39f75fd8e82c61a8582dadff5603e2130086b480ca8a10683af750` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 정의역 닫힌 구간에서 단조성을 쓰는 대수 계산 |
| q10 / `qid_v1_07bc04e0e6c36ccdf75c7ac5d6626ddcafd95dae7f17180926c720934d19f0e7` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 역함수 대응 f(1)=3을 식으로 치환하여 연립 |
| q10 / `qid_v1_07bc04e0e6c36ccdf75c7ac5d6626ddcafd95dae7f17180926c720934d19f0e7` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 역함수 대응 f(1)=3을 식으로 치환하여 연립 |
| q11 / `qid_v1_90beabb8e33f1068efd593cd02eedaca90aac60e54c1b2479dde764f8b6857cd` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문은 점 P와 수선의 발을 정의하지만 도형이 주어지지 않은 최솟값 계산 |
| q11 / `qid_v1_90beabb8e33f1068efd593cd02eedaca90aac60e54c1b2479dde764f8b6857cd` | 해설 | ENGINE_CAPABILITY_PENDING | `OVERLAY_SEGMENT_EXACT_SURD_LENGTH_LABEL` | `q11-solution.plan.json` | shallow **OK**, full **OK** | 부분일치 / SVG NOT_RUN |
| q12 / `qid_v1_b4f34f522998706606363615c0ee520174f3e68ed9219fb120fb9ebc219bc8fb` | 문항 | EXEMPT | 그림 불필요 | — | N/A | A,B를 식으로 제시, 문제축에서 경계 사례를 보여 주면 답이 노출됨 |
| q12 / `qid_v1_b4f34f522998706606363615c0ee520174f3e68ed9219fb120fb9ebc219bc8fb` | 해설 | PLAN_READY_STATIC | `multi-curve-figure-v1` | `q12-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |

## 결정적 소스 조건 → 실제 플랜 필드 매핑

- q02 해설: (1) y=1/(x−1)+2, x=1·y=2 점근선; (2) y=−2+3/(x+1), x=−1·y=−2 점근선; 양쪽 가지·축 라벨; 무격자·무바탕 — **정적 1:1**
- q04 해설: (1) (1,2)에서 오른쪽 아래·(5,0), x≥1,y≤2; (2) (2,−1)에서 왼쪽 위·(0,1), x≤2,y≥−1; 끝점/좌표 — **정적 1:1**
- q08 문항: 원본 PNG: 왼쪽 위 곡선, (0,2), 끝점 (3,−1), x=3/y=−1 점선·눈금은 계획됨. 원본 ‘y=√(ax+b)+c’가 엔진 ASCII ‘y=sqrt(ax+b)+c’로만 표기되어 수식 글리프 동등성 미충족 — **ENGINE_CAPABILITY_PENDING: `SYM_SQRT_LABEL_TEX`**
- q11 해설: P(2+√3,1+√3), x>2 곡선, 발 Q·R, 점선 PQ·PR 및 두 직각은 계획됨. 선분 위 정확한 길이 1+√3, 2+√3 라벨은 오버레이 엔진 미지원 — **ENGINE_CAPABILITY_PENDING: `OVERLAY_SEGMENT_EXACT_SURD_LENGTH_LABEL`**
- q12 해설: A: y=−√(x−3)+1 시작 (3,1), m=1 직선 y=x−2가 (3,1)에서 접속, m=2 직선 y=2x−2는 분리; 세 곡선/교점/라벨 — **정적 1:1**

## 검수 범위와 승인 경계

1. 각 plan에는 `sourceConditions`의 수식·교점·영역 조건과 `mappedTo` 실제 필드, `newVisualInformation`, `caption`, `accessibilityDescription`가 있다. 수치·포함관계를 새로 추측해 넣지 않았고, 문제 그림에서는 답을 주는 계수값을 수식 라벨에 공개하지 않는다.
2. 기존 파일의 흰 사각형·흰 원판은 계획하지 않았고 불필요한 면 채움도 제거했다. **필요한 영역 색칠**은 집합 q07 증명에만 `diagram.shade`로 남겼다. 그 외의 얼굴/면은 기본 `NONE`.
3. 플랜 린트 통과만으로 실제 선/수식 조판·가림·지시선 접속·폰트/표시 크기를 합격으로 판정하지 않는다. 새 SVG 렌더 후 PNG와 원본을 비교해야 **DRAWN_FEATURE_PARITY 1:1**로 최종 승격할 수 있다. `ENGINE_CAPABILITY_PENDING` 항목은 기능 구현 없이는 승격 금지.
4. 필요 기능: multi-curve의 **기호 계수 무리함수 수식 √의 TeX 글리프 라벨**, 그래프 오버레이 선분에 **정확한 근호 합의 길이 라벨**.
