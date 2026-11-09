# EXT-20261109-b: MATH 지시선 글자 확장 + 곡선 이름 변수 `nameVariable` (엔진 확장, Sonnet 직접)

## 문제
1. `overlays.callouts[].text`가 MATH일 때 12자 이하·`[0-9A-Za-z=+-*/().^ ]`만 허용(`graph_framing.py` 3478, 관측기 `graph_observer.py` 3177). 좌표쌍 `(3,5)`, 아래첨자 `A_1`, 괄호 낀 분수 `y=(x+2)/(x-2)`는 거절되거나(`OVERLAY_CALLOUT_TEXT_INVALID`) 분수의 괄호가 그려지지 않아 글자 대조가 어긋났다(`OVERLAY_CALLOUT_TEXT_MISMATCH`). 수식 파서(`visual_engine/math_expression.py`)는 이미 `_`·`,`·분수를 처리한다.
2. 구간별 다항 그래프의 곡선 이름이 `g(x)`로 고정(`phase2.mjs` `piecewisePolynomialSpec`). y의 함수(확률밀도 g(y))는 맞지 않는다.

## 기존 규칙과 충돌
- 세로분수만 쓴다는 사용자 규칙: MATH는 이미 `/`를 세로분수로 조판. 충돌 없음.
- 관측기 글자 대조 `_ov_label_codes`는 `*/^`을 글리프 없는 기호로 건너뛴다. `_`도 건너뛰고(아래첨자 숫자는 그대로 글리프), 분수 분자·분모를 통째로 감싼 괄호는 그려지지 않으므로 대조 전에 뺀다. 일부만 감싼 괄호는 유지: `2(x+1)/3`, `2*(x+1)/3`, `x/(x-1)^2`, `-(x+1)/3`.
- 이 함수는 선 라벨·이름 라벨 대조에도 쓰인다. 기존에 통과하던 텍스트는 분수에 붙은 통째 괄호가 없었으니(있었으면 불일치였다) 결과가 같다.

## 기능별 설계
### 기능 1: MATH callout 글자 확장
- 필드: 기존 `overlays.callouts[{id,point,text,labelKind:'MATH'}]`, 글자 20자까지, `,`와 `_` 허용.
- 계산: 틀(`graph_framing.py`)과 관측기가 같은 패턴 `[0-9A-Za-z=+*/().^ ,_-]{1,20}`. 조판은 기존 수식 파서.
- 관측기: 최종 SVG 글리프 코드가 글자와 일치(`_`는 글리프 없음, 통째 분수 괄호는 제외).
- 거절: 패턴 밖은 `OVERLAY_CALLOUT_TEXT_INVALID`. 한글·그리스 문자·`′`·`√`는 기존대로 TEXT.
- 기본 종류(글꼴 통일, `briefs/engine-font-unify.md`): 한글·그리스 문자·`′`·`√`가 없으면 MATH(쉼표 좌표쌍 포함), 있으면 TEXT.

### 기능 2: `graphPlan.nameVariable` (piecewise-polynomial)
- 필드: `"nameVariable":"y"` (소문자 한 글자, `functionName`과 달라야 함). 곡선 이름·머리글 식이 `g(y)`.
- 계산: `phase2.mjs`가 이름 라벨 `functionName+'('+nameVariable+')'`.
- 관측기: `curve_name_audit`가 최종 SVG의 `main-curve-name` 글리프를 `g(y)` 글자와 대조(`NAME_VARIABLE_NAME_MISMATCH`).
- 거절: `PIECEWISE_POLY_NAME_VARIABLE_INVALID`. 가로축 글자는 따로 `axisTitles.x`로 쓴다.

## 샘플
- 골든 `item130ext1probdensity`(22 효천 확통 q24)에 `nameVariable:"y"` 적용(g(y)).
- 골든 `item131ext2callouts`: 같은 그림 위에 `(1,4/35)`(MATH 좌표쌍)·`P_2`(아래첨자) 지시선 라벨(회귀 전용 plan).

## 하지 않은 것
- (c) `PIECEWISE_DISCONTINUITY_UNDECLARED`(24 효천 고1 Q14, u=1/(x-2)): 유리함수 조각은 구간별 다항 패밀리 밖이라 별도 패밀리 확장이 필요. 다음 회차 후보.
