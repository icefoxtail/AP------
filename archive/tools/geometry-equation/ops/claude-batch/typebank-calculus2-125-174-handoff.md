# 고2 유형은행 미적분Ⅱ 125–174 기하·그래프 그림 20문항 plan 인계

- 범위: `archive/exams/types/high/h2/`의 미적분Ⅱ 실제 `[그림:]` 다음 20개. 기존 116–119 묶음 이후, 120–124에는 해당 그림 없음. 번호상 빈 구간은 원문에 그림 지시가 없어서 건너뜀.
- 선별: 125/q07·q10·q11, 129/q09, 137/q06, 148/q04, 151/q01–02, 152/q04, 155/q02–04, 165/q17, 166/q07, 171/q01·03·04, 172/q08, 173/q05, 174/q03 (20문항/13파일).
- 기준: 최신 main `1e4b4d26`에 작업 중 재동기화(기존 `c6068ea6` 이후 #3105·#3106은 시험/교과서로 이번 유형은행 변경과 겹치지 않음). 열린 유형은행/미적분 관련 PR 검색 시 0건.
- 산출물: `production/plans/<원본 JS stem>/qNN-problem.plan.json` 20개. 원본 JS·시험지·교과서·수작업 SVG 변경 0개.
- 검증: 공식 `plan-lint.cjs --shallow` **20/20 OK, FAIL 0, SKIP 0**, 공식 `plan-lint.cjs --jobs 2` **20/20 OK, FAIL 0, SKIP 0**. 다만 `status=UNSUPPORTED` 4개는 lint의 허용 형식 통과이지 실제 렌더 가능 판정이 아님.
- 독립 원문→필드 검수: **12 DRAWN_FEATURE_PARITY PASS, 8 ENGINE_CAPABILITY_PENDING**. 원문 `[그림:]` 구절 전문 일치·JS SHA-256 일치, 조건 `mappedTo` 실제 키 존재, 도형 점/길이/직교/기울기/곡선값과 누락 기능을 사례별 교차검증.
- 엔진의 브라우저 최종 SVG·PNG 렌더, 눈으로 확인하는 출판 지면 검수는 **NOT_RUN**. `plan-lint OK`를 SVG 시각 검수 통과로 간주하지 않음.

## 문항별 검수 표

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| [미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js/q07](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js) | 원·두 동경 | PARTIAL | `construction-spike-v1` | [q07](../../production/plans/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q07-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js/q10](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js) | 직사각형·수선 | SUPPORTED | `construction-spike-v1` | [q10](../../production/plans/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q10-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js/q11](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js) | 직각삼각형 | SUPPORTED | `construction-spike-v1` | [q11](../../production/plans/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q11-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_129_합성함수의미분법2_고2_유형은행1.js/q09](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_129_합성함수의미분법2_고2_유형은행1.js) | f,g 꺾은선 | SUPPORTED | `piecewise-polynomial-spike-v1` | [q09](../../production/plans/미적분II_129_합성함수의미분법2_고2_유형은행1/q09-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_137_삼각함수의합성함수미분법2_고2_유형은행1.js/q06](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_137_삼각함수의합성함수미분법2_고2_유형은행1.js) | 원·현·θ | SUPPORTED | `construction-spike-v1` | [q06](../../production/plans/미적분II_137_삼각함수의합성함수미분법2_고2_유형은행1/q06-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_148_사이클로이드_고2_유형은행1.js/q04](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_148_사이클로이드_고2_유형은행1.js) | 사이클로이드·구름원 | UNSUPPORTED | `UNSUPPORTED` | [q04](../../production/plans/미적분II_148_사이클로이드_고2_유형은행1/q04-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_151_음함수미분법의활용_고2_유형은행1.js/q01](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_151_음함수미분법의활용_고2_유형은행1.js) | 시선각·높이 | SUPPORTED | `construction-spike-v1` | [q01](../../production/plans/미적분II_151_음함수미분법의활용_고2_유형은행1/q01-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_151_음함수미분법의활용_고2_유형은행1.js/q02](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_151_음함수미분법의활용_고2_유형은행1.js) | 사다리·직각 | SUPPORTED | `construction-spike-v1` | [q02](../../production/plans/미적분II_151_음함수미분법의활용_고2_유형은행1/q02-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_152_음함수로나타낸곡선의접선의방정식_고2_유형은행1.js/q04](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_152_음함수로나타낸곡선의접선의방정식_고2_유형은행1.js) | 근호곡선·접선·음영 | UNSUPPORTED | `UNSUPPORTED` | [q04](../../production/plans/미적분II_152_음함수로나타낸곡선의접선의방정식_고2_유형은행1/q04-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_155_역함수에서의미분계수_고2_유형은행1.js/q02](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_155_역함수에서의미분계수_고2_유형은행1.js) | 역함수·오목 증가 | SUPPORTED | `piecewise-polynomial-spike-v1` | [q02](../../production/plans/미적분II_155_역함수에서의미분계수_고2_유형은행1/q02-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_155_역함수에서의미분계수_고2_유형은행1.js/q03](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_155_역함수에서의미분계수_고2_유형은행1.js) | 역함수·볼록 증가 | SUPPORTED | `multi-curve-figure-v1` | [q03](../../production/plans/미적분II_155_역함수에서의미분계수_고2_유형은행1/q03-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_155_역함수에서의미분계수_고2_유형은행1.js/q04](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_155_역함수에서의미분계수_고2_유형은행1.js) | 역함수·오목 증가 | SUPPORTED | `multi-curve-figure-v1` | [q04](../../production/plans/미적분II_155_역함수에서의미분계수_고2_유형은행1/q04-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_165_이계도함수의항등식_고2_유형은행1.js/q17](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_165_이계도함수의항등식_고2_유형은행1.js) | f,g 꺾은선 | SUPPORTED | `piecewise-polynomial-spike-v1` | [q17](../../production/plans/미적분II_165_이계도함수의항등식_고2_유형은행1/q17-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_166_접점이주어진경우의접선의방정식_고2_유형은행1.js/q07](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_166_접점이주어진경우의접선의방정식_고2_유형은행1.js) | 사인 반주기 | SUPPORTED | `trigonometric-spike-v1` | [q07](../../production/plans/미적분II_166_접점이주어진경우의접선의방정식_고2_유형은행1/q07-problem.plan.json) | shallow/full OK | PASS |
| [미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js/q01](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js) | 로그·직선·삼각형 | PARTIAL | `logarithmic-affine-spike-v1` | [q01](../../production/plans/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1/q01-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js/q03](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js) | 탄젠트·점근선 | UNSUPPORTED | `UNSUPPORTED` | [q03](../../production/plans/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1/q03-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js/q04](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js) | 쌍곡코사인형·직선 | UNSUPPORTED | `UNSUPPORTED` | [q04](../../production/plans/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1/q04-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1.js/q08](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1.js) | 로그·접선·절편 | PARTIAL | `logarithmic-affine-spike-v1` | [q08](../../production/plans/미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1/q08-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_173_함수y=eˣy=lnx의접선의방정식_고2_유형은행1.js/q05](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_173_함수y=eˣy=lnx의접선의방정식_고2_유형은행1.js) | 지수·로그·대칭 | PARTIAL | `exp-log-pair-spike-v1` | [q05](../../production/plans/미적분II_173_함수y=eˣy=lnx의접선의방정식_고2_유형은행1/q05-problem.plan.json) | shallow/full OK | ENGINE_CAPABILITY_PENDING |
| [미적분II_174_두접선이이루는예각의크기_고2_유형은행1.js/q03](https://github.com/icefoxtail/AP------/blob/main/archive/exams/types/high/h2/미적분II_174_두접선이이루는예각의크기_고2_유형은행1.js) | 포물선·접선·이등변 | SUPPORTED | `multi-curve-figure-v1` | [q03](../../production/plans/미적분II_174_두접선이이루는예각의크기_고2_유형은행1/q03-problem.plan.json) | shallow/full OK | PASS |

## 미지원·미완 필드 (전부 원문에서 별도로 판독)

| 파일/qid | ENGINE_CAPABILITY_PENDING 필드와 근거 |
|---|---|
| 125/q07 | 일반식 좌표 P=(2cosα,2sinα), Q=(2cosβ,2sinβ)의 점 옆 기호 좌표 표시. 정확한 대표점·원·각만 지원. |
| 148/q04 | 사이클로이드의 매개변수 곡선과 π 좌표의 회전 원·P를 한 그림에 정확히 구성하는 엔진 기능 부재. status=UNSUPPORTED. |
| 152/q04 | y=(3−√x)²는 지원되는 affine-sqrt 계열 밖이므로 원곡선·접선·△OAB 음영 결합 불가. status=UNSUPPORTED. |
| 171/q01 | 로그 자동 프레임이 A(-3,0), B(0,3), y=x+3까지 확장되지 않음. P(e,1) 초월 좌표와 △ABP 미완. |
| 171/q03 | 0<x<π/2에서 점근선을 끝점으로 하는 tan 단일 가지 구간을 엔진이 거절; 원문 P(π/6,1/√3)도 초월 좌표. status=UNSUPPORTED. |
| 171/q04 | e^x+e^(−x) 합곡선 지원 부재로 A,B,P와 삼각형의 실제 경계가 미구현. status=UNSUPPORTED. |
| 172/q08 | 로그 자동 프레임 밖인 P(-1,0) x절편만 미구현. 곡선·a=1 접선·A·접점은 정확. |
| 173/q05 | 정확한 두 역함수 곡선과 y=x는 그리되, 초월수 2e인 A(1,2e),B(2e,1) 및 △OAB는 미구현. |

## 원본 증거·진실성 경계

1. 각 plan에는 원본의 `[그림: ...]`을 변형하지 않은 `sourceQuote`와 원문 그림 요소마다 `sourceConditions[].condition` → 실제 필드(`mappedTo`) 또는 `ENGINE_CAPABILITY_PENDING`을 기록했다. 미구현을 근사 곡선으로 속이지 않았다.
2. `155/q02–04`의 일반 함수 f는 식이 주어지지 않아, 원문 점·증가성·도함수 순서를 만족하는 정확한 대표 다항함수를 썼으며 원문의 유일한 함수라는 주장은 하지 않는다. `174/q03`은 이등변 기하를 충족하는 정확한 접선 두 개의 작도 좌표만 사용했다.
3. `129/q09`과 `165/q17`은 두 꺾은선의 분기별 일차식과 각 꼭짓점·교점을 별도 검산했다. `125/q10–11`, `137/q06`, `151/q01–02`는 실제 수선과 거리, 원의 소속을 교차검산했다.
4. 미지원 4개는 `status:"UNSUPPORTED"`와 `reason:"ENGINE_CAPABILITY_PENDING: ..."`인 진실성 보존 plan이며, 구현 가능성이 확인된 것처럼 렌더 결과를 주장하지 않는다. 나머지 4개 PARTIAL은 보존한 요소와 미보존 요소를 분리했다.

### 원본 JS SHA-256

| 원본 파일 | SHA-256 |
|---|---|
| `archive/exams/types/high/h2/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1.js` | `6797cf79a2c7f03583fb96bb60c41d35eacd0c523dcf0f98d3281dd852f20714` |
| `archive/exams/types/high/h2/미적분II_129_합성함수의미분법2_고2_유형은행1.js` | `29b3456fa53812dbc5437702f3ab4950ffc634412e9c49d35a06fd1c8f1fcebe` |
| `archive/exams/types/high/h2/미적분II_137_삼각함수의합성함수미분법2_고2_유형은행1.js` | `876affc1208a953732b58192fc8ba4d08e1be58852c3552dc9d6ea09d5bf87b6` |
| `archive/exams/types/high/h2/미적분II_148_사이클로이드_고2_유형은행1.js` | `597f949ff8c1f2163cfc8e74bb61c1d9d91dd22d5753246fe7bb4da5d98013da` |
| `archive/exams/types/high/h2/미적분II_151_음함수미분법의활용_고2_유형은행1.js` | `98727c701a3e3effc76a8451ab099667664fc9e66b2825f66204700e005bf19d` |
| `archive/exams/types/high/h2/미적분II_152_음함수로나타낸곡선의접선의방정식_고2_유형은행1.js` | `6022b320427e8d8f55a93c4fa49712de17cc0571c196f9c6a415be4344c98f93` |
| `archive/exams/types/high/h2/미적분II_155_역함수에서의미분계수_고2_유형은행1.js` | `fe6bc9f626605dc46584b4369be7416d6c1145ae7dd3740369aca45cbcc97913` |
| `archive/exams/types/high/h2/미적분II_165_이계도함수의항등식_고2_유형은행1.js` | `770a782347fc07531fc053720133d7b72de5116d5cddb91515f490675845674e` |
| `archive/exams/types/high/h2/미적분II_166_접점이주어진경우의접선의방정식_고2_유형은행1.js` | `e789b48c159e17301a1d3dbe64d63a2eafefae14724c6d8bde46a045ab039be6` |
| `archive/exams/types/high/h2/미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1.js` | `3a3ea035f5aa445ac17f57b96c832dc77b048cd8e15b53caa03e879359d37575` |
| `archive/exams/types/high/h2/미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1.js` | `e663c9f13ca0eb7ec5ca3c4c2c017ddcdb16171380cda50b765dd0e02be941ff` |
| `archive/exams/types/high/h2/미적분II_173_함수y=eˣy=lnx의접선의방정식_고2_유형은행1.js` | `9e8eab43dff56429927f4ee40c8fb198d641e5818b9ef52f0ec24ed9ef634e55` |
| `archive/exams/types/high/h2/미적분II_174_두접선이이루는예각의크기_고2_유형은행1.js` | `ae48e6f3a1dd7603bfb11106262da2d5de2d2e8b3cdef38abb055a6f13cd2a2e` |

**다음 커서:** `미적분II_174_두접선이이루는예각의크기_고2_유형은행1.js/q04`부터. 다음 작업에서도 실제 `[그림:]`만 20–30문항 단위로 이어가기.
