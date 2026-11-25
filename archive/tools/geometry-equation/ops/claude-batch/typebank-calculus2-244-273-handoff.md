# 고2 유형은행 미적분Ⅱ 244/q01–273/q03: 20문항 plan·DRAWN_FEATURE_PARITY 인계

- 기준: 2026-11-26(KST). 직전 PR #3113의 241/q06 다음부터, archive/exams/types/high/h2/에서 실제 [그림: …] 문항을 파일 번호·qid 오름차순 20개 선정했다.
- 범위: 원본 JS 10종, 문제 그림 20문항. 244(1), 258(2), 264(4), 265(1), 266(1), 267(5), 269(1), 270(1), 271(1), 273(3).
- 이 배치에 추가한 파일은 production/plans 아래 새 문제용 JSON 20개 및 이 인계 문서 1개뿐이다. 원본 JS·시험지·교과서·해설·엔진·손 SVG/PNG 수정 없음.
- 공식 plan-lint.cjs --shallow: OK 20/20, --jobs 2 (full): OK 20/20. 원문 sourceQuote 정확 일치 20/20; 실제 필드 경로 49개, 명시된 ENGINE_CAPABILITY_PENDING 경로 25개 검수.
- **DRAWN_FEATURE_PARITY = PASS 2 / ENGINE_CAPABILITY_PENDING 18.** 실제 렌더 capability 13개(완전 2, 부분 11), status:UNSUPPORTED만 기록한 상태 전용 JSON 7개. 후자 7개는 실행 가능한 plan이 아니다. full lint OK는 SVG 제작이나 그림 완성 증거가 아니다.
- 렌더 / SVG 독립 픽셀 관측 / PNG / 학생 화면 / A4 / JS 연결 / 게시 = 모두 NOT_RUN, SVG_TO_CREATE. 이 판정은 오직 원문→선언된 drawable 필드의 수학적 1:1 대조다.

## 문항별 결과

| 원문 파일/qid | 축 | 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 244_정적분의부분적분법/q01 | 증가곡선·넓이 20 | SUPPORTED | piecewise-polynomial-spike-v1 | [JSON](../../production/plans/미적분II_244_정적분의부분적분법_고2_유형은행1/q01-problem.plan.json) | OK/OK | PASS |
| 258_구분구적법/q01 | y=3x²·오른쪽 끝 직사각형 | PARTIAL | piecewise-polynomial-spike-v1 | [JSON](../../production/plans/미적분II_258_구분구적법_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 258_구분구적법/q02 | y=x²·오른쪽 끝 직사각형 | PARTIAL | piecewise-polynomial-spike-v1 | [JSON](../../production/plans/미적분II_258_구분구적법_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 264_정적분과급수의활용/q01 | 직선·폭 3 직사각형 | PARTIAL | piecewise-polynomial-spike-v1 | [JSON](../../production/plans/미적분II_264_정적분과급수의활용_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 264_정적분과급수의활용/q02 | 직각삼각형·n등분 평행선 | PARTIAL | construction-spike-v1 | [JSON](../../production/plans/미적분II_264_정적분과급수의활용_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 264_정적분과급수의활용/q03 | 반원·호 n등분·삼각형 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_264_정적분과급수의활용_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 264_정적분과급수의활용/q04 | 지수곡선·가변 직각삼각형 | PARTIAL | exponential-affine-spike-v1 | [JSON](../../production/plans/미적분II_264_정적분과급수의활용_고2_유형은행1/q04-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 265_곡선과x축으로둘러싸인넓이/q09 | 이차분모 유리곡선·두 영역 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_265_곡선과x축으로둘러싸인넓이_고2_유형은행1/q09-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 266_곡선과y축으로둘러싸인도형의넓이/q04 | ln(x+e²)·양옆 두 영역 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_266_곡선과y축으로둘러싸인도형의넓이_고2_유형은행1/q04-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 267_두곡선으로둘러싸인도형의넓이/q02 | cos x·sin 2x·교차 영역 | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 267_두곡선으로둘러싸인도형의넓이/q03 | 삼각곡선 두 개·S1/S2 | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 267_두곡선으로둘러싸인도형의넓이/q08 | 8x/(x²+4)·직선 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1/q08-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 267_두곡선으로둘러싸인도형의넓이/q09 | 2eˣ·xeˣ·두 영역 | PARTIAL | exponential-affine-spike-v1 | [JSON](../../production/plans/미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1/q09-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 267_두곡선으로둘러싸인도형의넓이/q10 | (cos x)ln x·−sin x/x | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1/q10-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 269_로그함수로둘러싸인두곡선사이의넓이/q03 | 두 로그곡선·A/B | PARTIAL | multi-curve-figure-v1 | [JSON](../../production/plans/미적분II_269_로그함수로둘러싸인두곡선사이의넓이_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 270_세곡선으로둘러싸인도형의넓이/q01 | 3/x·두 직선·닫힌 영역 | SUPPORTED | multi-curve-figure-v1 | [JSON](../../production/plans/미적분II_270_세곡선으로둘러싸인도형의넓이_고2_유형은행1/q01-problem.plan.json) | OK/OK | PASS |
| 271_곡선과접선으로둘러싸인도형의넓이/q06 | 2x sin x·접선·빗금 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_271_곡선과접선으로둘러싸인도형의넓이_고2_유형은행1/q06-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273_두도형의넓이가서로같은경우/q01 | cos(πx/3)·y=k·두 영역 | UNSUPPORTED | 상태 전용 ENGINE_CAPABILITY_PENDING | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273_두도형의넓이가서로같은경우/q02 | √(2x)·y=4·x=a | PARTIAL | multi-curve-figure-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273_두도형의넓이가서로같은경우/q03 | √(x+4)·y=2·x=k | PARTIAL | multi-curve-figure-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |

## 수학 조건 독립 대조와 원문-필드 매핑

- sourceConditions의 mappedTo는 모두 실존 graphPlan/mathPlan 표시 필드 또는 구체 ENGINE_CAPABILITY_PENDING 사유에 연결된다. 캡션·설명·status 필드만 있고 보이는 획·점·면이 없으면 패리티 PASS가 아니다.
- **244/q01 PASS**: 원문의 함수는 식이 유일하지 않아 대표 f(x)=(3x²−2x+15)/8을 채택. f(1)=2, f(5)=10, 적분 ∫₁⁵ f=20, f′(x)=(3x−1)/4>0을 직접 검산했다. regions[0]는 1≤x≤5에서 곡선과 x축 사이 실제 채움 필드. 문제의 구하는 값은 그림에 쓰지 않음.
- **258/q01·02 PARTIAL**: 원문 n분할의 한 예 n=2를 정확히 선언. q01은 분점 0, 1/2, 1에 오른쪽 높이 3/4, 3; q02는 분점 0, 3/2, 3에 높이 9/4, 9다. 실제 overlays.polygons 두 개를 채움. 3개 이상은 공식 lint의 OVERLAY_TOO_MANY:polygons로 거절되어 대표 n=2로 변경했다. 가변 n과 기호 분점 눈금은 미해결.
- **264/q01·02·04 PARTIAL**: q01은 예 n+k=2에서 A(2,4), B(2,0), 가로 5−2=3인 사각형. q02는 A(0,3), B(0,0), C(1,0), n=4의 세 BC 평행선 및 양 변 3,1. 직각은 좌표에서 성립하지만 construction의 planeMarks.rightAngles가 MARK_FIELD_UNKNOWN으로 거절되어 B의 직각 네모는 미지원으로 남겼다. q04는 y=2eˣ과 분점만 정확히 그리며 초월값 2e^(3/2)의 삼각형 polygon은 미지원.
- **267/q02·03·09 PARTIAL**: 두 삼각곡선 중 cos x만 정확한 π 구간으로 선언했고 sin 2x·교차영역은 임의 다항식으로 대체하지 않았다. q09는 첫 곡선 2eˣ과 x=3 경계만 정확. 곱지수 xeˣ·영역 A/B는 기능 누락.
- **269/q03 PARTIAL**: 대표 b=2, a=4, p=2, q=4는 1<b<a 및 1<p<q를 정확히 만족한다. 두 LOGARITHMIC 곡선은 실제 필드로 그리지만 현재 이 kind는 regions의 경계로 쓰지 못하므로 A/B 면색과 내부 글자는 미지원이다. 이 대표값을 일반 답으로 간주하지 않는다.
- **270/q01 PASS**: 양의 교점은 3/x=3x의 x=1과 3/x=x/3의 x=3. O(0,0), A(1,3), B(3,1) 그리고 정확한 두 부분 [0,1]의 직선-직선, [1,3]의 유리곡선-직선 면을 같은 LIGHT로 표시. 적분 넓이 답 3ln3은 표시하지 않음.
- **273/q02·03 PARTIAL**: √(2x)=4 교점은 (8,4), √(x+4)=2 교점은 (0,2). 미지 a,k의 답 18,5를 문제 그림에 쓰지 않기 위해 x=a, x=k의 위치만 대표 a=12,k=2로 그린다. 이 대표값들은 동일 넓이를 만족하지 않으므로 원문 A=B를 주장하거나 거짓 면색을 넣지 않았다. A=B는 ENGINE_CAPABILITY_PENDING이다.

### ENGINE_CAPABILITY_PENDING 세부 내역

| 문항 | 정확히 부족한 엔진 기능 |
|---|---|
| 258/q01·02 | 임의 n개 구분구적 직사각형과 xk=k/n 또는 3k/n 기호 분점 |
| 264/q01 | n+k 기호 A/B 좌표 |
| 264/q02 | construction 직각 사각형 표식과 n등분 가변 반복 |
| 264/q03 | 윗반원 호·호의 n등분점 Pk·ABPk 색칠 |
| 264/q04 | e의 초월 좌표 꼭짓점을 지나는 삼각형 polygon과 n기호 분점 |
| 265/q09 | 분모가 이차인 정확 유리곡선 (2x−2)/(x²−2x+2) 및 A/B 영역 |
| 266/q04 | ln(x+e²) 초월 평행이동·y=1~3 사이 좌우 두 면 |
| 267/q02·03 | 서로 다른 주기의 cos x·sin 2x를 한 축에 그리고 교점 기준 면을 색칠 |
| 267/q08 | 8x/(x²+4)와 직선 사이 두 대칭 면 |
| 267/q09 | xeˣ 곱지수 곡선·공통교점·A/B 면 |
| 267/q10 | (cos x)ln x 및 −sin x/x의 정확한 두 곡선과 면 |
| 269/q03 | 두 LOGARITHMIC 곡선을 그대로 영역 채움 경계로 사용 |
| 271/q06 | 2x sin x·그 접선·빗금 영역 |
| 273/q01 | cos(πx/3)의 [0,1]은 1/6주기여서 엔진 최소 1/4주기 제한에 걸림, 미지 k의 두 동등 넓이 |
| 273/q02·03 | 답을 노출하지 않고 미지 a/k를 유지하며 동일 넓이 A=B인 두 면을 표현 |

## 원본 JS SHA-256 (모두 미수정)

| 번호 | SHA-256 |
|---|---|
| 244 | a0c59136b089503396f479e9c86ad474c885a41cd7368982b99775291fd39b1a |
| 258 | 8db9902ec6280523c177945c1204eeb5743b06ddabec213f194c1ac9a26f4349 |
| 264 | 6fdc4f3bdd8e61a982db318da61eb774e9470cab64ece7993bf766923048a802 |
| 265 | bcbdf950a087df215981371bc50fc98b4eb818157ecd1e8155270b402d408b53 |
| 266 | 0b11ead706d96449976efccc77a15d1640b4f73b142d995b4da98006d836b377 |
| 267 | 8f37edbb9ed186f7b5c1eb94a4486ae2f63b729071835710eee89a3fbf2f8b95 |
| 269 | 44982daf27f82ca9e2ab559c57ddb0d568fd3fead52d19705a306f8815f472cb |
| 270 | dc0360f6dcce3c12e33130413de5f11a4a6183c44696daa61f68db0a64547221 |
| 271 | ebc62c651edfb29621de50e25b6d2efc3c4de5177c8818a587d2fe7c2d3c563f |
| 273 | e03ed5263b05860ce00252fce2ee81bfba12c3c272414e88009d5c7811f4cc7f |

## 다음 작업

1. 다음 미작성 그림은 미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1.js의 **q04**다. 다음 차수도 연속된 그림 문항 20~30개만 진행한다.
2. 엔진 담당에게 위 18개의 ENGINE_CAPABILITY_PENDING을 기능 종류별로 전달한다. 상태 전용 7개는 렌더 플랜이 아니다.
3. 엔진 확장 뒤 실제 drawable field 보강과 full lint→SVG 독립 관측→PNG→학생 화면→A4 검수를 거쳐 별도 JS 연결·게시한다. PR/main 병합만으로 시각 완료·학생 출고라고 하지 않는다.
