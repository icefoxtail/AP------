## q8
원그림에 직접 주어진 수직선 A0 B1 C2만 SOURCE_POINT GIVEN으로 유지. 단위 정사각형 꼭짓점 D/F/E는 평행이동, P/Q는 BD/BE를 반지름으로 하는 원과 원래 수직선의 교점을 좌우 branch로 선택. p,q 원시좌표 제거.
## q11
왼쪽 위 꼭짓점을 정규화 원점으로 잡음. 주어진 첫 변2, 면적3배에서 유도한 변2√3,6,6√3을 정확 평행이동량으로 사용. 각 아래 오른쪽 꼭짓점은 두 변의 벡터합. 일치하는 인접 위 꼭짓점은 두 번의 점대칭으로 복제해 원시좌표를 넣지 않음. PLANE_FIGURE_v1은 NORMALIZATION_ORIGIN을 거절하고 SOURCE_POINT를 요구하므로, 단 하나의 시작 꼭짓점(0,0)은 임의 평행이동 자유도를 고정한 배치 앵커로 사용한다. 원문이 좌표0을 주었다는 뜻이 아니며 모든 길이와 위치관계는 뒤따르는 파생 연산에서 생성한다.
## q17
예시 x2,y1을 기존 visible caption에 유지. 원점은 정규화; 전체 넓이(x²+3xy+y²)+x²=15 및 세로3에서 가로5를 유도한 평행이동으로 외곽 작도. 대각선 중점M에서 반변1씩 이동해 중앙 정사각형을 생성. 가로5는 출력 길이 라벨로 노출하지 않음. PLANE_FIGURE_v1은 NORMALIZATION_ORIGIN을 거절하고 SOURCE_POINT를 요구하므로, 단 하나의 시작 꼭짓점(0,0)은 임의 평행이동 자유도를 고정한 배치 앵커로 사용한다. 원문이 좌표0을 주었다는 뜻이 아니며 모든 길이와 위치관계는 뒤따르는 파생 연산에서 생성한다.
## q22
자연수 제약으로x10, 넓이36/4에서 유도한 변6/2를 평행이동량으로 사용. P만 정규화 원점이고 Q/W/R/T는 변 이동, V/S/U는 벡터합. 정사각형·공유변 관계를 연산으로 보존하며 B넓이8 미표시. PLANE_FIGURE_v1은 NORMALIZATION_ORIGIN을 거절하고 SOURCE_POINT를 요구하므로, 단 하나의 시작 꼭짓점(0,0)은 임의 평행이동 자유도를 고정한 배치 앵커로 사용한다. 원문이 좌표0을 주었다는 뜻이 아니며 모든 길이와 위치관계는 뒤따르는 파생 연산에서 생성한다.

## 검증과 제한
- 이전 plan의 모든 점과 수정 plan의 동명 점 좌표를 각각 construction worker로 계산 후 1e-9 기준 대조: 4/4 PASS, 차이 없음.
- planeMarkSpec 및 기존 직각 dot product 검증: 4/4 PASS.
- 기존 표시 라벨·caption·hiddenAnswerValues·정답 숨김은 변경하지 않았음. 단 sourceConditions에 연산·배치 앵커 근거를 추가함.
- source 원문·엔진·원격 미변경. 전체 브라우저 렌더 NOT_RUN. 독립감사에서 정규화 앵커의 author 계약 적합성 확인 전 저장하지 않음.


# 독립검수 PASS
공식조건binding→construction→spec4/4PASS. 전후모든동명점 exact scalar를SymPy기호식으로비교하여차0(4/4PASS), mathPlan/sourceConditions외표시필드완전동일. 원점한개는원문좌표사실이아닌평행이동게이지고정임을명시했고나머지점은모두파생연산이므로계약타당. 원문좌표A0/B1/C2만남긴Q8도적합. 전체렌더NOT_RUN유지. 결과audit/r-exact-validation.json 및r-provenance-validation.json.
