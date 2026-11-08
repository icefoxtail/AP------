원문·정답·해설과 기존 해설 SVG를 직접 읽었다. 기존 삼각형 그림은 보존하고 넓이 함수의 증가·감소를 보조하는 별도 초안을 계획했다. 그래프의 열린 문제 범위는 캡션에 명시한다. 사용자의 함수 시각화 지시 반영.

BRANCH DRAFT. ROOT 작성 입력 3종을 작업 브랜치에 보존한 미검증 초안이다. 현재 외부 로컬 소유·누적 시도는 UNKNOWN. 공식 validator·렌더·실제 그림 검수 NOT_RUN이며 READY_FOR_RENDER가 아니다. 지정 구현자 중단 지시를 유지하여 미인계 상태로 둔다. 원문·기존 그림·판정표·원장·기존 승인 및 시도 이력을 변경하지 않는다.


## Exact-coordinate representation correction

ROOT의 최신 계획을 그대로 보존했다. requiredPoints의 분수·근호 문자열을 그리기용 유한 JSON 숫자로 바꾸고 graphPlan.exactCoordinates에 양 좌표의 원래 정확식을 함께 보존했다. 계수·함수·정의역·표시 범위·sourceQuote·다른 필드는 변경하지 않았다. 아래 숫자는 그리기용 좌표이며 정확 라벨을 근삿값으로 바꾼 것이 아니다.
- M: exactCoordinates ["4/3", "16/27"]; numeric drawing position [1.3333333333333333, 0.5925925925925926].

phase2.mjs blob 983e492c0661b93ea7e8188fad33061a0d103b36 L791–809의 exactCoordinates 및 finite requiredPoints 규칙을 대조했다. 제한된 정적 대조에서 정확식 일치, 수치 오차의 절대 1e-9 및 상대 1e-9 기준, 곡선 위 점 오차 1e-8 기준을 확인했다. 이것은 공식 validator나 렌더·배치·학생 화면 검수가 아니다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 OPEN·HOLD·실패·가독성·답 노출·소유 UNKNOWN 이력은 유지하며 READY 또는 게시 완료를 주장하지 않는다.
