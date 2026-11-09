# EXT-20261109-a: 축 눈금 라벨 분수를 세로분수로 (엔진 확장, Sonnet 직접)

## 문제
- `graphPlan.axisTickValues`에 `"2/5"`, `"4/35"` 같은 분수 문자열을 쓰면 눈금 글자가 빗금 분수 `2/5`로 나온다(`visual_engine/engine.py` `fraction_text`가 글자는 분수로 만들지만 `TICK_LABEL`의 `tex`가 없어 typeset이 `label.text`를 그대로 TeX로 조판).
- 사용자 규칙: SVG 분수는 세로분수만, 빗금 금지. 좌표 띠·좌표 라벨은 이미 세로분수다.
- 후보 1(확률밀도처럼 납작한 그래프의 세로 확대)은 **이미 지원**: `graphPlan.axisScale:{"x":1,"y":10}` (piecewise-polynomial·multi-curve). 22 효천 확통 기말 Q24 g(y)를 plan만으로 렌더해 확인(골든 `item119ext1`). 코드 변경 없음, 가이드에 사용법·확률밀도 예를 보강한다.

## 기존 규칙과 충돌
- 검사기: `verify-rendered-layout.mjs`는 `tickDisplayValue`("2/5")를 분수로 읽어 `tickValue`와 대조하고, 글꼴이 FROZEN_OUTLINE이면 글자 일치 검사를 건너뛴다. 세로분수는 FROZEN_OUTLINE 조각이므로 충돌 없음.
- `label_layout.py`는 `label.text == tickDisplayValue`를 요구 → 그대로 둔다(tex만 추가).
- 눈금 π 라벨(`tickPiLabels`)은 건드리지 않는다.

## 설계 (기능 1개)
- 필드: 새 필드 없음. `axisTickValues`의 분수 문자열이 자동으로 세로분수가 된다.
- 계산: `engine.py` 눈금 라벨 생성에서 `text`가 `-?\d+/\d+`이면 `label['tex']='\frac{a}{b}'`(음수는 앞에 `-`). typeset 두 곳(`phase2.mjs`, `construction-candidate-svg-v1.mjs`)은 이미 `label.math`이면 `label.tex||label.text`를 쓴다.
- 관측기: 기존 눈금 관측(소유 눈금·값 일치·겹침·가시성)이 그대로 최종 SVG에서 확인. 분수 조각이 눈금 곁에 놓이는지는 배치 검사가 확인.
- 거절: 새 오류 코드 없음. 조각이 놓일 자리가 없으면 기존 `LAYOUT_INVENTORY_INCOMPLETE`/눈금 지시선 폴백.

## 샘플
- 22 효천고 2학기 기말 고2 확률과통계 Q24 g(y) (골든 `item119ext1`): axisScale y:10, 눈금 y: 4/35, 2/5.
