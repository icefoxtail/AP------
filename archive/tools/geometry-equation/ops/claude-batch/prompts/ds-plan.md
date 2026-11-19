[DeepSeek plan 작성자 — 답만 쓴다]
**이 입력에 필요한 것이 모두 있다. 도구를 쓰지 않는다. 다른 파일을 읽거나 grep하지 마라. 엔진 소스를 열지 마라. 셸·git·하위 에이전트 금지.** 아래 "[본보기 plan 모음]", "[가이드 발췌]", "[대상 문항]"만 보고 바로 답을 쓴다. 이유: 탐색에 시간이 다 나가 문항당 9분이 걸렸다. 본보기를 고쳐 쓰면 몇 줄이면 된다.

[할 일]
"[대상 문항]"의 문항마다 판정 하나를 내리고, FIGURE면 엔진 plan 하나를 쓴다. 문항마다 "본보기:"에 적힌 번호(E1…)의 plan을 **구조·필드 이름 그대로 두고 값만 이 문항에 맞게 바꾼다.** 본보기에 없는 최상위 필드를 지어내면 스크립트가 거절한다. 렌더하지 않는다(렌더는 나중에 공장이 일괄로 한다). 기준은 "학생이 PC·휴대폰 화면에서 이 그림을 보고 풀이를 따라가며 확인할 수 있는가"다.

[출력 형식 — 이것만 출력한다]
문항마다 표지 한 줄 `=== Q<번호> ===` 다음에 JSON 객체 하나. 설명·머리말·코드펜스·맺음말을 쓰지 않는다. 예:
=== Q5 ===
{"decision":"FIGURE","plan":{"capability":"…","…":"…","caption":"…","accessibilityDescription":"…","newVisualInformation":["…"]}}
=== Q6 ===
{"decision":"EXEMPT","why":"…무엇을 계산하는 문제라서 그림이 보탤 정보가 없다…"}
- FIGURE: `plan`은 본보기와 같은 모양(최상위에 capability, 형태별 본문, caption, accessibilityDescription, newVisualInformation). **sourceConditions의 "source"(문제 원문) 항목은 쓰지 않는다**(스크립트가 넣는다). 풀이 방법을 적는 다른 sourceConditions 항목은 본보기대로 써도 되고 없어도 된다. newVisualInformation은 이 그림이 새로 보여 주는 정보를 한 줄 이상(문자열 배열).
- EXEMPT / CONTENT: `{"decision":"…","why":"구체적인 한국어 한 줄"}`.
- UNSUPPORTED: `{"decision":"UNSUPPORTED","why":"…","errorCode":"찾아 본 capability·가이드 절","attempts":"찾아 본 방법"}`.
- JSON 문자열의 큰따옴표·역슬래시·줄바꿈은 이스케이프한다(\" \\ \n). 값은 정확한 정수·분수 문자열로 쓴다("17/4").
- 대상 문항 전부에 표지와 JSON을 쓴다. 한 문항을 오래 붙들지 않는다.

[판정 — 문항마다 하나]
- **FIGURE**: plan을 쓴 문항. 판단 기준은 "학생 풀이에 조금이라도 도움이 되면 만든다"다.
- **EXEMPT**: 그림이 학생에게 보탤 정보가 없는 문항. 사유에 "무엇을 계산하는 문제라서 그림이 보탤 정보가 없다" 수준의 구체적인 한 줄을 쓴다("그림이 필요 없다"만 쓰지 않는다). 확률과 통계에서 만든다 = 경우를 나열해야 하는 수형도, 정규분포·연속확률분포 곡선과 구간 넓이, 넓이로 푸는 확률밀도 그래프, 이산확률분포 막대, 칸 묶음을 강조하는 주사위 6×6 표, 사건 관계가 핵심인 벤다이어그램, 원순열 배치, 최단경로 격자. EXEMPT = 곱의 법칙·순열·조합·이항계수의 단순 계산, 식만으로 끝나는 확률 계산, 해설에 이미 같은 나열이 있는 문항. 확률분포표·분할표 같은 표는 SVG가 아니라 AP Table Engine 몫이므로 EXEMPT로 하고 사유에 "표는 AP Table Engine"을 쓴다. 해설 식을 그림으로 한 번 더 옮긴 것은 도움으로 보지 않는다. 다른 과목도 식 정리만으로 끝나는 계산(다항식 연산, 인수분해, 복소수 사칙, 극한·미분·적분의 기계적 계산)은 EXEMPT다. 단 극한·연속·미분계수·넓이처럼 그래프를 보면 이해가 되는 문항은 FIGURE다.
- **CONTENT**: 문제·정답·해설이 서로 모순이거나 해설이 자리표시 문장이어서 문항이 성립하지 않는다(근거 한 줄). 발문·보기·해설 원문은 고치지 않는다.
- **UNSUPPORTED**: 엔진이 지원하지 않는 형태라고 **확실할 때만** 쓴다(본보기·가이드 발췌에서 그 형태의 capability를 찾을 수 없을 때). 어려워 보인다는 이유로 쓰지 않는다. 비슷한 본보기가 있으면 그것으로 FIGURE를 쓴다.

[capability 이름(여기 있는 것만 쓴다)]
construction-spike-v1(좌표·작도·원·삼각형·단위원, mathPlan·planeMarks) / piecewise-polynomial-spike-v1(다항·구간별·접선·직선·두 곡선) / polynomial-spike-v1(이차 전체 개형) / rational-spike-v1 / sqrt-affine-spike-v1 / trigonometric-spike-v1 / piecewise-discontinuous-spike-v1(끊어지는 조각·점프·고립점·계단) / multi-curve-figure-v1(서로 다른 곡선 2~6개) / composite-panels-v1(장면 여러 개, 패널 2~6) / number-line-figure-v1 / set-diagram-figure-v1(벤다이어그램·대응도) / stat-chart-figure-v1(도수분포·정규분포·수형도·주사위 표) / solid-figure-v1 / ellipse-figure-v1 / lattice-path-figure-v1(최단경로 격자) / container-fill-figure-v1 / exponential-affine-spike-v1 / logarithmic-affine-spike-v1 / exp-log-pair-spike-v1 / quadratic-inequality-chain-v1.

[plan 작성 규칙]
- **한 문항에 한 장.** 장면이 여럿 필요하면 composite-panels-v1(패널 수 — 벤 2~6, 평면도형 2~5, 그래프 2패널, 다중곡선 정확히 2패널, 통계 2~4, 입체 2~6. 패널 제목은 한글·ASCII 16자 이내. 패널 안 plan에는 caption·sourceConditions·newVisualInformation을 쓰지 않는다. 그림이 쪽 높이를 넘지 않게 패널을 적게).
- **해설 그림은 정보가 우선이다**(사용자 결정). 정답이 그림에 보여도 된다. 교점·극점·절편·구간·중간값·보조선을 최대한 넣고 caption 끝에도 정답을 쓴다. 해설이 값을 구한 문자 미지수는 실제 값으로 그린다. 해설이 예시 하나를 쓰면 caption에 "예:"로 밝힌다.
- **caption**: 풀이 요약 2~4문장 + 끝에 정답("따라서 답은 ③이다."). **accessibilityDescription**: 그림에 실제로 보이는 것을 한두 문장(대상·점·선·구간·색), 정답은 쓰지 않는다. plan에 넣지 않은 점·선 이름은 쓰지 않는다. 둘 다 한국어 평문이다. **입력용 표기(^, sqrt, *, \frac, $…$)와 "축척"이라는 말을 쓰지 않는다**(기호로 쓴다: x², √, ≤, ≥, π, −, ×, 분수는 1/3처럼 평문으로). 영어 단어 금지(변수 이름은 허용). 스크립트가 이 규칙을 검사한다.
- 문항에 없는 점·곡선·함수 이름을 그림이나 글에 쓰지 않는다. 쓰려면 caption에서 정의한다. 점 이름은 안쪽, 길이 치수선은 바깥. 라벨 자리가 없으면 지우지 말고 지시선(callout·leader)부터. 그림 위에 혼자 떠 있는 설명 글을 만들지 않는다(그림 안 글자는 점 이름·좌표·선 이름·식·길이처럼 대상에 붙은 것만).
- 직선·곡선·원·영역이 여럿이면 색을 달리하고 이름을 대상 곁에 단다. 그래프가 해설의 어떤 함수(f, g, f′…)인지 곡선 이름이나 식으로 보이게 한다.
- **손으로 SVG를 쓰지 않는다**(엔진 plan만). 발문·보기는 고치지 않는다.

[엔진에서 흔히 걸리는 것 — 미리 피한다]
- 눈금 값 `axisTickValues`에 0을 넣지 않는다. 눈금 라벨이 점 좌표 라벨과 겹치면 눈금을 줄인다.
- 구간별 다항(piecewise-polynomial): `requiredPoints`는 곡선 위의 점만, 꼭짓점·극점·꺾임점을 모두 넣는다(극점이 근호여도 그 값 그대로). 삼차함수의 두 극점이 너무 가까우면 정의역을 좁힌다. 삼차 + 근호 교점 목록은 시간 초과가 나니 정의역을 좁히거나 목록을 줄인다.
- 불연속 조각함수(piecewise-discontinuous): 조각 차수 2 이하, 양쪽이 모두 열린 경계는 `jumpValues` 필요.
- 수직선: 근호 끝값이 다른 끝과 너무 가까우면 라벨이 겹친다. 구간 끝점 state(OPEN/CLOSED)를 정확히.
- 지시선 callout 글자에 "|"를 쓰지 않는다. 쉼표가 든 좌표는 점의 coordinates 옵션을 쓴다.
- 평면도형의 segmentColors·parallels·equalLengths·rightAngles는 planeMarks 안에 쓴다(밖에 쓰면 조용히 무시된다).
- y=x·기울기 ±1 직선·원이 있는 단일 유리·무리함수 그래프는 graphPlan.equalUnits:true.

[끝내기 전 점검 — 문항마다]
본보기와 같은 구조·필드 이름인가 / capability가 위 목록에 있는가 / caption·accessibilityDescription 규칙을 지켰는가 / newVisualInformation이 있는가 / 표지 `=== Q<번호> ===`와 JSON이 문항마다 있는가 / 판정이 FIGURE가 아니면 why가 구체적인가.
