# 그림 이슈 보완 04

b의 소유 data-owner는 angleB로 맞지만 렌더 위치가 다른 교점에 가깝다는 혼동 위험은 소스좌표로 확인된다. 기하를 다시 만들지 않고 기존 angleB-label 배치/지시선 수정 계획만 작성했다. 구체적 겹침 판정과 글꼴 위치 확정은 집PC 실제 렌더에서 필요하다. 본 검토는 XML 소스 직접 검토이며 기존화면 직접확인 PASS라고 기록하지 않는다.

최신d701 원문·연결 problemPlan/solutionPlan·실제 SVG 소스를 직접 대조했다. 연결 problemPlan은 원점 하나뿐이며 solutionPlan은 EXEMPT이므로 기존 충분한 실행 계획의 중복 작성이 아니다. 소스 SVG/JS/엔진/원격/index 변경 없음. 실제 렌더 NOT_RUN, 기존 SVG 신규 변환도 하지 않았다.
