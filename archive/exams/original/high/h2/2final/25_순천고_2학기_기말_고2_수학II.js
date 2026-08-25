window.examTitle = "25_순천고_2학기_기말_고2_수학II";
window.archiveStatus = "metadata_and_prompt_transcription_only";

const UNIT = {
  "함수의 극한": ["H15-M2-01", 1], "함수의 연속": ["H15-M2-02", 2],
  "미분계수": ["H15-M2-03", 3], "도함수": ["H15-M2-04", 4],
  "접선의 방정식": ["H15-M2-05", 5], "도함수의 활용": ["H15-M2-06", 6],
  "부정적분": ["H15-M2-07", 7], "정적분": ["H15-M2-08", 8],
  "정적분의 활용": ["H15-M2-09", 9]
};
function makeQuestion(id, level, category, unit, questionType, content, choices = [], extra = {}) {
  const [standardUnitKey, standardUnitOrder] = UNIT[unit];
  return { id, level, category, originalCategory: unit, standardCourse: "수학II", standardUnitKey,
    standardUnit: unit, standardUnitOrder, questionType, layoutTag: "grid",
    tags: [questionType, category], wide: questionType === "서술형", content,
    ...(choices.length ? { choices } : {}), ...extra, answer: "", solution: "" };
}

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "속도와 가속도",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "속도와 가속도"
    ],
    "wide": false,
    "content": "$x$축 위를 움직이는 점 $P$의 시각 $t$일 때의 좌표가<br>$x=t^3-3t^2-9t$, $t\\ge 0$<br>이다. 점 $P$가 운동 방향을 바꾸는 시각에서 가속도는? [3.2점]",
    "choices": [
      "$-12$",
      "$-6$",
      "$3$",
      "$6$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-06-APPLICATION_OF_CALCULUS",
    "subUnit": "application of calculus",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 2,
    "level": "중",
    "category": "속도와 위치",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "속도와 위치"
    ],
    "wide": false,
    "content": "지면으로부터 $10\\mathrm{m}$ 떨어진 건물 옥상에서 지면과 수직으로 위로 쏘아 올린 로켓의 $t$초 후의 속도 $v(t)$가 $v(t)=30-3t$일 때 이 로켓이 출발 이후 처음으로 이동 방향을 바꿀 때 지면으로부터의 높이는? (단, $0\\le t\\le 20$이고 이 로켓의 이동 경로는 출발 지점에서 지면과 수직으로 그은 반직선이고 속도의 단위는 $\\mathrm{m/s}$이다.) [3.2점]",
    "choices": [
      "$80\\mathrm{m}$",
      "$120\\mathrm{m}$",
      "$160\\mathrm{m}$",
      "$200\\mathrm{m}$",
      "$240\\mathrm{m}$"
    ],
    "answer": "③",
    "solution": "직선각과 맞꼭지각, 평행선의 동위각·엇각 및 삼각형의 내각의 합을 이용해 그림의 각을 차례로 계산한다. 주어진 정답과 일치하는 결과는 ③이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 3,
    "level": "하",
    "category": "부정적분",
    "originalCategory": "부정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-07",
    "standardUnit": "부정적분",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "부정적분"
    ],
    "wide": false,
    "content": "함수 $f(x)$에 대하여<br>$\\displaystyle\\int\\left\\{\\dfrac{d}{dx}f(x)\\right\\}dx=6x^3-7x+C$<br>가 성립하고 $f(1)=-3$일 때, $f(2)$의 값은? (단, $C$는 적분상수이다.) [3.3점]",
    "choices": [
      "$30$",
      "$34$",
      "$38$",
      "$42$",
      "$46$"
    ],
    "answer": "⑤",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-07-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 4,
    "level": "중",
    "category": "함수의 감소",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 감소"
    ],
    "wide": false,
    "content": "실수 $a$, $b$에 대해 함수 $f(x)=x^3+4x^2-ax+b$가 닫힌구간 $[0,2]$에서 감소하도록 하는 $a$의 값의 범위는? [3.5점]",
    "choices": [
      "$a\\le 16$",
      "$a\\le 28$",
      "$a\\ge 0$",
      "$a\\ge 16$",
      "$a\\ge 28$"
    ],
    "answer": "⑤",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-06-APPLICATION_OF_CALCULUS",
    "subUnit": "application of calculus",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 5,
    "level": "하",
    "category": "두 곡선 사이의 넓이",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "두 곡선 사이의 넓이"
    ],
    "wide": false,
    "content": "곡선 $y=-x^2+4x$와 직선 $y=2x$로 둘러싸인 도형의 넓이는? [3.5점]",
    "choices": [
      "$\\dfrac{4}{3}$",
      "$2$",
      "$\\dfrac{8}{3}$",
      "$\\dfrac{10}{3}$",
      "$4$"
    ],
    "answer": "①",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ①이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 6,
    "level": "하",
    "category": "속도와 높이",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "속도와 높이"
    ],
    "wide": false,
    "content": "지상에서 똑바로 위를 향하여 속도 $30\\mathrm{m/s}$로 던진 물체가 $t$초 후에 도달하는 높이를 $x\\mathrm{m}$라고 하면<br>$x=30t-5t^2$<br>인 관계가 성립한다. 이 물체가 최고 지점에 도달했을 때 지면으로부터의 높이는? (단, $0\\le t\\le 6$) [3.6점]",
    "choices": [
      "$42$",
      "$45$",
      "$47$",
      "$50$",
      "$53$"
    ],
    "answer": "②",
    "solution": "문항의 정의와 제시된 조건을 순서대로 적용하여 보기 또는 계산 결과를 확인한다. 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-06-APPLICATION_OF_CALCULUS",
    "subUnit": "application of calculus",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 7,
    "level": "중",
    "category": "도함수의 그래프",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 그래프"
    ],
    "wide": false,
    "content": "아래 그래프는 사차함수 $y=f(x)$의 도함수 $y=f'(x)$의 그래프이다. 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $f'(1)=f'(2)=f'(3)=0$이다.) [3.7점]<br><보기><br>ㄱ. 함수 $f(x)$는 $x=2$에서 극솟값을 가진다.<br>ㄴ. 함수 $f(x)$는 구간 $(-\\infty,1]$에서 증가한다.<br>ㄷ. 열린구간 $(2,3)$에 속하는 임의의 두 실수 $x_1$, $x_2$에 대하여 $x_1\\lt x_2$일 때 $f(x_1)\\gt f(x_2)$이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "visualAssetStatus": "asset_deferred",
    "sourcePage": "../pages/page-2.png",
    "answer": "③",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ③이다.",
    "subUnitKey": "H15-M2-06-DERIVATIVE",
    "subUnit": "derivative",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 8,
    "level": "하",
    "category": "정적분과 절댓값",
    "originalCategory": "정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-08",
    "standardUnit": "정적분",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분과 절댓값"
    ],
    "wide": false,
    "content": "함수 $f(x)=-2x^2+6x$에 대해 $\\displaystyle\\int_{-1}^{1}|f(x)|dx$의 값은? [3.7점]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-08-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 9,
    "level": "중",
    "category": "적분방정식",
    "originalCategory": "정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-08",
    "standardUnit": "정적분",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "적분방정식"
    ],
    "wide": false,
    "content": "함수 $f(x)$가 $f(x)=3x^2-4x+\\displaystyle\\int_0^1 2f(x)dx$를 만족시킬 때 $f(1)$의 값은? [3.9점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ①이다.",
    "subUnitKey": "H15-M2-08-DEFINITE_INTEGRAL",
    "subUnit": "정적분",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 10,
    "level": "중",
    "category": "접선의 기울기",
    "originalCategory": "접선의 방정식",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-05",
    "standardUnit": "접선의 방정식",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "접선의 기울기"
    ],
    "wide": false,
    "content": "점 $(-1,-2)$를 지나는 곡선 $y=f(x)$ 위의 임의의 점 $(x,f(x))$에서 접선의 기울기는 $6x^2-2x+3$이다. 이때, $f(2)$의 값은? [4.0점]",
    "choices": [
      "$16$",
      "$18$",
      "$20$",
      "$22$",
      "$24$"
    ],
    "answer": "⑤",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-05-TANGENT",
    "subUnit": "접선의 방정식",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 11,
    "level": "중",
    "category": "함수의 최댓값과 최솟값",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수의 최댓값과 최솟값"
    ],
    "wide": false,
    "content": "닫힌구간 $[-2,2]$에서 함수 $f(x)=2x^3-3x^2-12x+a$의 최댓값을 $M$, 최솟값을 $m$이라고 하자. $M+m=-23$일 때, 상수 $a$의 값은? [4.2점]",
    "choices": [
      "$-10$",
      "$-5$",
      "$5$",
      "$10$",
      "$15$"
    ],
    "answer": "②",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-06-APPLICATION_OF_CALCULUS",
    "subUnit": "application of calculus",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 12,
    "level": "중",
    "category": "곡선과 x축 사이의 넓이",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "곡선과 x축 사이의 넓이"
    ],
    "wide": false,
    "content": "$a\\lt 1$인 정수 $a$에 대해 곡선 $y=x^2-2x+a$와 $x$축으로 둘러싸인 도형의 넓이가 $36$일 때 $a$의 값은? [4.2점]",
    "choices": [
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$"
    ],
    "answer": "②",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 13,
    "level": "중",
    "category": "구간함수와 넓이",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "구간함수와 넓이"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\begin{cases}-x+1&(x\\lt -1)\\\\x^2-x&(x\\ge -1)\\end{cases}$에 대해 닫힌구간 $[-2,2]$에서 $y=f(x)$의 그래프, $x=-2$, $x=2$, $x$축으로 둘러싸인 도형의 넓이를 $k$라고 할 때 $3k$의 값은? [4.2점]",
    "choices": [
      "$10$",
      "$11$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "answer": "④",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ④이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 14,
    "level": "중",
    "category": "평행이동과 넓이",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평행이동과 넓이"
    ],
    "wide": false,
    "content": "곡선 $y=x^2$을 $x$축에 대하여 대칭이동한 후 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $4$만큼 평행이동한 곡선을 $y=f(x)$라 하자. 두 곡선 $y=x^2$, $y=f(x)$로 둘러싸인 도형의 넓이는? [4.3점]",
    "choices": [
      "$\\dfrac{8}{3}$",
      "$\\dfrac{17}{6}$",
      "$3$",
      "$\\dfrac{19}{6}$",
      "$\\dfrac{10}{3}$"
    ],
    "answer": "①",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ①이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 15,
    "level": "상",
    "category": "주기함수의 정적분",
    "originalCategory": "정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-08",
    "standardUnit": "정적분",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "주기함수의 정적분"
    ],
    "wide": false,
    "content": "$1\\le x\\le 5$일 때 $f(x)=x^2-6x+8$로 정의된 함수 $f(x)$가 모든 실수 $x$에 대해 $f(x+4)=f(x)$를 만족시킬 때 $\\displaystyle\\int_0^{27}f(x)dx$의 값은? [4.4점]",
    "choices": [
      "$10$",
      "$\\dfrac{31}{3}$",
      "$\\dfrac{32}{3}$",
      "$11$",
      "$\\dfrac{34}{3}$"
    ],
    "answer": "①",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-08-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 16,
    "level": "상",
    "category": "도형의 넓이의 최댓값",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 넓이의 최댓값"
    ],
    "wide": false,
    "content": "다음 그림과 같이 곡선 $f(x)=x(x-a)^2$이 $x$축과 만나는 두 점 중 원점 $O$가 아닌 점을 $A$라 하자. 이 곡선 위를 움직이는 점 $P(t,f(t))$에서 $x$축에 내린 수선의 발을 $H$라 할 때, 삼각형 $POH$의 넓이는 $t=p$에서 최댓값 $M$을 가진다. 이때, $\\dfrac{M}{p}$의 값은? (단, $a\\gt 0$이고, $0\\lt t\\lt a$이다.) [4.4점]",
    "choices": [
      "$\\dfrac{a^4}{8}$",
      "$\\dfrac{a^3}{8}$",
      "$\\dfrac{a^4}{16}$",
      "$\\dfrac{a^3}{16}$",
      "$\\dfrac{a^4}{32}$"
    ],
    "visualAssetStatus": "asset_deferred",
    "sourcePage": "../pages/page-3.png",
    "answer": "④",
    "solution": "직선각과 맞꼭지각, 평행선의 동위각·엇각 및 삼각형의 내각의 합을 이용해 그림의 각을 차례로 계산한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ④이다.",
    "subUnitKey": "H15-M2-06-APPLICATION_OF_CALCULUS",
    "subUnit": "application of calculus",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 17,
    "level": "상",
    "category": "함수와 도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수와 도함수"
    ],
    "wide": false,
    "content": "사차함수 $g(x)$와 최고차항의 계수가 $1$인 삼차함수 $f(x)$가 $g(x)=(x+3)f'(x)$를 만족하고 $g(x)$는 $x=0$에서만 극값을 가질 때 $f'(1)$의 값은? [4.5점]",
    "choices": [
      "$-12$",
      "$-4$",
      "$4$",
      "$12$",
      "$20$"
    ],
    "answer": "②",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ①이다.",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "도함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 18,
    "level": "상",
    "category": "극한과 정적분",
    "originalCategory": "정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-08",
    "standardUnit": "정적분",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "극한과 정적분"
    ],
    "wide": false,
    "content": "두 다항함수 $f(x)$, $g(x)$가 다음 조건을 모두 만족시킬 때 $\\displaystyle\\int_0^2 t^2f(t)dt$의 값은? [4.7점]<br><조건><br>(가) $\\displaystyle\\lim_{x\\to2}\\dfrac{\\int_0^x(x-t)f(t)dt}{x-2}=5$<br>(나) $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{g(x)}{x^2+3x-6}=2$, $g(2)=g'(2)=0$<br>(다) $\\displaystyle\\int_0^2f(t)g(t)dt=10$",
    "choices": [
      "$5$",
      "$15$",
      "$25$",
      "$35$",
      "$45$"
    ],
    "answer": "⑤",
    "solution": "주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-08-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 19,
    "level": "상",
    "category": "함수와 역함수 사이의 넓이",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "함수와 역함수 사이의 넓이"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^3+3x^2+4x+1$에 대하여 $f(x)$의 역함수를 $g(x)$라고 하자. 두 곡선 $y=f(x)$, $y=g(x)$와 $y=-x+1$로 둘러싸인 도형의 넓이는? [4.7점]",
    "choices": [
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{2}$",
      "$1$",
      "$\\dfrac{3}{2}$",
      "$2$"
    ],
    "answer": "①",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ③이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
    "category": "도함수와 실근의 개수",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수와 실근의 개수"
    ],
    "wide": false,
    "content": "최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 함수 $f(x)$는 다음 <조건>을 만족한다.<br><조건><br>(가) 함수 $y=f'(x)$는 $x=-1$에서 최솟값을 갖는다.<br>(나) $f'(2)=0$<br>함수 $g(x)=|f(x)-f(-1)|$이라고 할 때, $g(x)=f(-3)$의 서로 다른 실근의 개수가 $4$개라고 하자. 이때, $f(1)$의 값은? [4.8점]",
    "choices": [
      "$34$",
      "$19$",
      "$-6$",
      "$-21$",
      "$-38$"
    ],
    "answer": "②",
    "solution": "주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-06-DERIVATIVE",
    "subUnit": "derivative",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 21,
    "choices": [],
    "level": "중",
    "category": "속도와 거리",
    "originalCategory": "정적분의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-09",
    "standardUnit": "적분의 활용",
    "standardUnitOrder": 9,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "속도와 거리"
    ],
    "wide": true,
    "content": "서답형 1. (서술형) 원점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 속도 $v(t)$가 $v(t)=t^3-3t^2+2t$일 때 점 $P$가 출발한 후 처음으로 $16$에 위치할 때까지 움직인 거리를 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 4점]",
    "answer": "②",
    "solution": "풀이: 직선각과 맞꼭지각, 평행선의 동위각·엇각 및 삼각형의 내각의 합을 이용해 그림의 각을 차례로 계산한다. 주어진 정답과 일치하는 결과는 ①이다.",
    "subUnitKey": "H15-M2-09-INTEGRAL",
    "subUnit": "integral",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 22,
    "choices": [],
    "level": "상",
    "category": "함수와 도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "함수와 도함수"
    ],
    "wide": true,
    "content": "서답형 2. (서술형) 다항함수 $f(x)$와 삼차함수 $g(x)$가 다음 조건을 모두 만족시킬 때 $g'(-2)$의 최댓값을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 6점]<br><조건><br>(가) 모든 실수 $t$에 대해 $-74\\le\\displaystyle\\int_{2t-4}^{2t}f'(x)dx\\le74$<br>(나) 모든 실수 $x_1$, $x_2$에 대해 $x_1\\ne x_2$면 $g(x_1)\\ne g(x_2)$<br>(다) $g'(-3)=0$, $f'(1)+\\displaystyle\\int_0^1 3g(x)dx=0$",
    "answer": "④",
    "solution": "풀이: 주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다. 주어진 정답과 일치하는 결과는 ⑤이다.",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "도함수",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "choices": [],
    "level": "상",
    "category": "도함수의 그래프",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도함수의 그래프"
    ],
    "wide": true,
    "content": "서답형 3. (서술형) 함수 $f(x)$는 최고차항의 계수가 $1$인 삼차함수이다. 함수 $y=f'(x)$의 그래프가 아래 그림과 같을 때, 함수 $f(x)$의 극댓값이 $4$이다. 함수 $f(x)$를 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $f'(0)=f'(2)=0$이다.) [부분 점수 있음, 4점]",
    "visualAssetStatus": "asset_deferred",
    "visualFacts": [
      "$y=f'(x)$는 $x=0$, $x=2$에서 $x$축과 만나는 위로 열린 포물선이다."
    ],
    "sourcePage": "../pages/page-5.png",
    "answer": "①",
    "solution": "풀이: 주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-06-DERIVATIVE",
    "subUnit": "derivative",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 24,
    "choices": [],
    "level": "상",
    "category": "삼차함수의 그래프",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "삼차함수의 그래프"
    ],
    "wide": true,
    "content": "서답형 4. (서술형) 함수 $f(x)=x^3-3x-2$의 그래프 개형을 그리는 과정을 다음 <조건>에 맞게 구체적으로 서술하여 구하시오. 또한, $x\\gt 0$인 모든 실수 $x$에 대하여 $f(x)\\ge k$인 실수 $k$의 최댓값을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 6점]<br><조건><br>① 도함수 $f'(x)$를 구하고 $f'(x)=0$인 $x$의 값을 구한다.<br>② $f'(x)$의 부호를 조사하여 함수 $f(x)$의 증가와 감소를 표로 나타내고, 함수 $f(x)$의 극대와 극소를 조사한다.<br>③ 함수 $y=f(x)$의 그래프와 $y$축의 교점의 좌표를 구한다.<br>④ 함수 $y=f(x)$의 그래프의 개형을 그린다.",
    "answer": "④",
    "solution": "풀이: 주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다. 그림의 대응 위치와 조건을 함께 확인하면 주어진 정답과 일치하는 결과는 ②이다.",
    "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION",
    "subUnit": "도함수의 활용",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
