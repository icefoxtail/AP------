BRANCH DRAFT. 3종 초안은 작업 브랜치에 보존됨. 사용자 지시: 기존 구형 그림도 새 엔진 교체 대상으로 계획. 세로축은 f/100의 수치로 명시한 그래프이며 f 자체와 혼동 금지. 원문·기존 q16-solution.svg 및 OPEN_LAYOUT 이력 보존. 소유·시도 UNKNOWN; 공식 validator·렌더 NOT_RUN; 구현자 미인계. 기존 승인 거절된 별도 작업 재시도 금지.


## Exact-coordinate representation correction

ROOT의 최신 계획을 그대로 보존했다. requiredPoints의 분수·근호 문자열을 그리기용 유한 JSON 숫자로 바꾸고 graphPlan.exactCoordinates에 양 좌표의 원래 정확식을 함께 보존했다. 계수·함수·정의역·표시 범위·sourceQuote·다른 필드는 변경하지 않았다. 아래 숫자는 그리기용 좌표이며 정확 라벨을 근삿값으로 바꾼 것이 아니다.
- C: exactCoordinates ["8", "-128/25"]; numeric drawing position [8.0, -5.12].

phase2.mjs blob 983e492c0661b93ea7e8188fad33061a0d103b36 L791–809의 exactCoordinates 및 finite requiredPoints 규칙을 대조했다. 제한된 정적 대조에서 정확식 일치, 수치 오차의 절대 1e-9 및 상대 1e-9 기준, 곡선 위 점 오차 1e-8 기준을 확인했다. 이것은 공식 validator나 렌더·배치·학생 화면 검수가 아니다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 OPEN·HOLD·실패·가독성·답 노출·소유 UNKNOWN 이력은 유지하며 READY 또는 게시 완료를 주장하지 않는다.
