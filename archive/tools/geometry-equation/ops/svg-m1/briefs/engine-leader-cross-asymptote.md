# EXT-20261109-e: 점 지시선이 점근선(파선)을 가로지르기 (엔진 확장, Sonnet 직접)

## 문제
- 24 효천 고1 Q14: 교점 Q(7/5,2)의 좌표 지시선 자리를 못 찾음(`LAYOUT_INVENTORY_INCOMPLETE`). Q는 수직 점근선 x=1 바로 옆이라, 지시선이 점근선 파선을 가로지르지 않는 한 후보 자리가 없다.
- 지시선은 이미 축·눈금·안내선(guide)은 가로지를 수 있다(`label_layout.py` `leader_skip`, `verify-rendered-layout.mjs` LEADER_CROSSING 예외). 점근선만 빠져 있다.

## 설계
- 파선 점근선(`asymptote-*`, `rational-asymptote-*`)을 축·눈금·안내선과 같은 부류로 취급: 지시선이 가로질러도 된다. 곡선·직선·다른 라벨은 그대로 금지.
- 계산: 배치기(`label_layout.py`)의 `leader_skip`에 `LEADER_MAY_CROSS_ASYMPTOTE` 추가. 렌더 후 검사기(`verify-rendered-layout.mjs`)의 예외 정규식에 `^asymptote-|^rational-asymptote-` 추가.
- 관측기(`graph_observer.py`)는 이미 지시선–점근선 교차를 허용한다(수정 없음).
- 검사 완화 아님: 지시선이 곡선·글자·다른 지시선과 겹치는 검사는 그대로.
