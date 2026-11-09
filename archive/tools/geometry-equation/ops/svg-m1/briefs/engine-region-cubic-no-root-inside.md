# EXT-20261109-f: 구간별 다항 영역 색칠, 기약 삼차 조각의 구간 밖 근 때문에 거절되던 것 (엔진 확장, Sonnet 직접)

## 문제
- 22 금당 수II Q18: 세 구간 f(조각 2는 `1/3-x/2+x³/3`) 아래 넓이(적분 -1~3)를 `graphPlan.regions`로 칠하려 하면 `PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`.
- 원인: `_pp_region_crossings`가 경계 차이 다항식의 실근을 **직선 전체에서** 닫힌 꼴로 구하려 한다. 조각 2의 차이(위 경계 f, 아래 x축)는 기약 삼차이고 그 실근(약 -1.2)은 이 조각의 구간 [0,1] **밖**이라 필요 없는데도 거절된다.

## plan만 바꿔 시도한 결과(수정 전 엔진)
- 전체 구간 영역 `{upper:f, lower:axis, from:-1, to:3}` → `PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`.
- 조각 경계로 쪼갠 영역 3개(-1~0, 0~1, 1~3) → 같은 코드. 조각 2를 빼면 넓이가 완전하지 않아 쓸 수 없다.

## 설계
- `_pp_region_crossings`: 닫힌 꼴 근을 못 구하면(`ROOT_NOT_CLOSED_FORM`) **유리수 계수·유리수 끝점**일 때만 SymPy 스투름(`Poly.count_roots`)으로 열린 구간 (start,end) 안의 실근 수를 정확히 센다. 끝점이 근이 아니고 구간 안 근이 0이면 통과, 있으면 `GRAPH_REGION_BOUNDARIES_CROSS`. 조건이 안 맞으면 원래 오류 그대로.
- 관측기는 영역 채움 다각형을 수치 표본으로 독립 검사하니 변경 없음.
- 검사 완화 아님: 구간 안에 경계가 교차하는 영역은 그대로 거절한다.
