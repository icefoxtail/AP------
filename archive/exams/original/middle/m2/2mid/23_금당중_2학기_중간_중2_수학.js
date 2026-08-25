const UNIT_META = {
  "M2-03": { name: "연립일차방정식", order: 3 },
  "M2-04": { name: "일차함수와 그래프", order: 4 },
  "M2-06": { name: "도형의 닮음", order: 6 },
  "M2-07": { name: "피타고라스 정리", order: 7 }
};

function q(id, level, category, key, content, choices, answer, solution, image, extraTags = []) {
  const unit = UNIT_META[key];
  const questionType = choices.length ? "객관식" : "서술형";
  return {
    id,
    level,
    category,
    originalCategory: category,
    standardCourse: "중2 수학",
    standardUnitKey: key,
    standardUnit: unit.name,
    standardUnitOrder: unit.order,
    questionType,
    layoutTag: "grid",
    tags: [questionType, ...extraTags],
    wide: false,
    content,
    choices,
    answer,
    solution,
    ...(image ? { image: "assets/images/23_금당중_2학기_중간_중2_수학/" + image } : {})
  };
}

window.examTitle = "23_금당중_2학기_중간_중2_수학";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "미지수가 2개인 일차방정식으로 나타낼 수 없는 것은? [3점]",
    "choices": [
      "밑변의 길이가 $x$, 높이가 $y$인 삼각형의 넓이는 14이다.",
      "$x$살인 주호의 나이는 $y$살인 주현이의 나이보다 2살이 더 적다.",
      "2점짜리 문제 $x$개와 3점짜리 문제 $y$개를 합하여 얻은 점수는 16점이다.",
      "세 잎 클로버 $x$개와 네 잎 클로버 $y$개의 잎의 개수를 모두 합하면 41이다.",
      "1000원짜리 우유 $x$개와 700원짜리 빵 $y$개를 사고 지불한 금액이 3400원이다."
    ],
    "answer": "①",
    "solution": "[키포인트] 미지수끼리 곱한 항이 있으면 일차방정식이 아니다.\n①의 조건은 $\\dfrac{xy}{2}=14$, 즉 $xy=28$이다. 이 식에는 미지수의 곱 $xy$가 있으므로 미지수가 2개인 일차방정식이 아니다.\n②는 $x-y=-2$, ③은 $2x+3y=16$, ④는 $3x+4y=41$, ⑤는 $1000x+700y=3400$으로 모두 일차방정식이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 2,
    "level": "하",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "일차방정식 $2x+3y=12$를 만족시키는 자연수 $x$와 $y$의 순서쌍 $(x,y)$의 개수는? [3점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "[키포인트] $x,y$가 자연수이므로 두 수는 모두 양의 정수이다.\n$2x=12-3y$이고 $x>0$이므로 가능한 자연수 $y$는 $1,2,3$이다.\n$y=1$이면 $x=\\dfrac92$, $y=2$이면 $x=3$, $y=3$이면 $x=\\dfrac32$이다.\n자연수 순서쌍은 $(3,2)$ 한 개뿐이다.\n따라서 정답은 ①이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
    "subUnit": "연립일차방정식의 활용",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 3,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "두 순서쌍 $(-1,2)$와 $(p,-\\dfrac14p)$가 모두 일차방정식 $2x+ay=6$의 해일 때, $a+p$의 값을 구하면? (단, $a$는 수이다.) [4점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 순서쌍을 방정식에 각각 대입한다.\n$(-1,2)$를 대입하면 $2(-1)+2a=6$이므로 $2a=8$, $a=4$이다.\n$(p,-\\dfrac14p)$를 대입하면\n$2p+4\\left(-\\dfrac14p\\right)=6$이므로 $p=6$이다.\n따라서 $a+p=4+6=10$이므로 정답은 ⑤이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 4,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복수정답"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}3x+2y=4\\quad\\cdots\\text{㉠}\\\\5x-4y=3\\quad\\cdots\\text{㉡}\\end{cases}$에서 가감법을 이용하여 미지수 $x$ 또는 $y$를 없앨 때, 다음 중 필요한 식을 모두 고르면? (정답 2개) [4점]",
    "choices": [
      "㉠$\\times3+$㉡$\\times5$",
      "㉠$\\times2+$㉡",
      "㉠$\\times5+$㉡$\\times3$",
      "㉠$\\times5-$㉡$\\times3$",
      "㉠$\\times3-$㉡$\\times5$"
    ],
    "answer": "②, ④",
    "solution": "[키포인트] 없애려는 미지수의 계수를 서로 반대이거나 같게 만든다.\n②에서 ㉠에 2를 곱하면 $6x+4y=8$이다. 여기에 ㉡을 더하면 $11x=11$이 되어 $y$가 없어진다.\n④에서 ㉠에 5를 곱하면 $15x+10y=20$, ㉡에 3을 곱하면 $15x-12y=9$이다. 두 식을 빼면 $22y=11$이 되어 $x$가 없어진다.\n나머지 식에서는 $x$와 $y$ 중 어느 것도 없어지지 않는다.\n따라서 정답은 ②, ④이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 5,
    "level": "하",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}3x-(y+1)=3\\\\2x+5y=-3\\end{cases}$을 풀면? [4점]",
    "choices": [
      "$x=-1,\\ y=-1$",
      "$x=1,\\ y=1$",
      "$x=1,\\ y=-1$",
      "$x=-1,\\ y=1$",
      "$x=2,\\ y=1$"
    ],
    "answer": "③",
    "solution": "[키포인트] 괄호를 먼저 풀어 식을 간단히 한다.\n첫째 식은 $3x-y-1=3$, 즉 $3x-y=4$이다.\n이 식에 5를 곱하면 $15x-5y=20$이고, 둘째 식 $2x+5y=-3$과 더하면 $17x=17$이므로 $x=1$이다.\n$3x-y=4$에 $x=1$을 대입하면 $3-y=4$이므로 $y=-1$이다.\n따라서 정답은 ③이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 6,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}3(x+3)=11-(2y-x)\\\\x=2(y-4)\\end{cases}$의 해가 일차방정식 $kx+2y-2=0$을 만족시킬 때, 수 $k$의 값은? [4점]",
    "choices": [
      "-3",
      "-2",
      "1",
      "2",
      "3"
    ],
    "answer": "④",
    "solution": "[키포인트] 먼저 연립방정식의 해를 구한 뒤 그 값을 마지막 식에 대입한다.\n첫째 식을 정리하면 $3x+9=11-2y+x$이므로 $x+y=1$이다.\n둘째 식은 $x=2y-8$이므로 $(2y-8)+y=1$, $3y=9$에서 $y=3$, $x=-2$이다.\n$kx+2y-2=0$에 대입하면 $-2k+6-2=0$이므로 $-2k+4=0$, $k=2$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 7,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}y=x-2\\quad\\cdots\\text{㉠}\\\\x+3y=-5\\quad\\cdots\\text{㉡}\\end{cases}$에서 ㉠을 ㉡에 대입하여 $y$를 소거하면 $ax=1$일 때, 수 $a$의 값은? [4점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "②",
    "solution": "[키포인트] ㉠의 $y=x-2$를 ㉡의 $y$ 자리에 대입한다.\n$x+3(x-2)=-5$이므로 $x+3x-6=-5$이다.\n따라서 $4x=1$이므로 $a=4$이다.\n정답은 ②이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 8,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}\\dfrac{x}{6}-\\dfrac{x-y}{2}=\\dfrac13\\\\0.3(x+y)-0.1y=1\\end{cases}$의 해를 $x=\\alpha$, $y=\\beta$라 할 때, $\\alpha\\beta$의 값은? [4점]",
    "choices": [
      "-6",
      "-4",
      "4",
      "6",
      "8"
    ],
    "answer": "③",
    "solution": "[키포인트] 분수식과 소수식을 각각 정수 계수의 식으로 바꾼다.\n첫째 식에 6을 곱하면 $x-3(x-y)=2$, 즉 $-2x+3y=2$이다.\n둘째 식을 정리하면 $0.3x+0.2y=1$이고, 10을 곱하면 $3x+2y=10$이다.\n$-2x+3y=2$에 2를 곱하고 $3x+2y=10$에 3을 곱하면 각각 $-4x+6y=4$, $9x+6y=30$이다.\n두 식을 빼면 $13x=26$이므로 $x=2$, 이어서 $y=2$이다.\n따라서 $\\alpha\\beta=2\\times2=4$이므로 정답은 ③이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 9,
    "level": "상",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "연립방정식 $\\begin{cases}6x+(7-a)y=-2\\\\-bx+4ay=1\\end{cases}$의 해가 무수히 많을 때, $ab$의 값은? (단, $a,b$는 수이다.) [4점]",
    "choices": [
      "-6",
      "-3",
      "-1",
      "1",
      "3"
    ],
    "answer": "②",
    "solution": "[키포인트] 해가 무수히 많으려면 두 방정식이 완전히 같은 직선을 나타내야 한다.\n첫째 식의 상수항 $-2$를 둘째 식의 상수항 $1$로 만들려면 첫째 식에 $-\\dfrac12$을 곱해야 한다.\n그러면 $-3x-\\dfrac{7-a}{2}y=1$이므로 둘째 식 $-bx+4ay=1$과 계수를 비교한다.\n$-b=-3$에서 $b=3$이고, $4a=-\\dfrac{7-a}{2}$이다.\n$8a=-7+a$이므로 $7a=-7$, $a=-1$이다.\n따라서 $ab=(-1)\\times3=-3$이므로 정답은 ②이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 10,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "중국의 옛 수학책인 『구장산술(九章算術)』에는 오른쪽 자료와 같은 문제가 있다. 만약 동일한 가격으로 소 1마리와 양 2마리를 구입하여 지불한 금액을 $k$라 할 때, $21k$의 값을 구하면? [4점]",
    "choices": [
      "73",
      "74",
      "75",
      "76",
      "77"
    ],
    "answer": "②",
    "solution": "[키포인트] 소 한 마리의 값을 $x$냥, 양 한 마리의 값을 $y$냥이라 놓는다.\n문제의 조건에서 $5x+2y=10$, $2x+5y=8$이다.\n첫째 식에 5를 곱하고 둘째 식에 2를 곱하면 $25x+10y=50$, $4x+10y=16$이다.\n두 식을 빼면 $21x=34$이므로 $x=\\dfrac{34}{21}$이다.\n$2x+5y=8$에 대입하면 $y=\\dfrac{20}{21}$이다.\n$k=x+2y=\\dfrac{34}{21}+\\dfrac{40}{21}=\\dfrac{74}{21}$이므로 $21k=74$이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q10.png",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 11,
    "level": "중",
    "category": "일차함수",
    "originalCategory": "일차함수",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-04",
    "standardUnit": "일차함수와 그래프",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식"
    ],
    "wide": false,
    "content": "일차함수 $f(x)=\\dfrac13x-2$에 대하여 $f(-3)=a$, $f(b)=1$일 때, $a+b$의 값을 구하면? [4점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "④",
    "solution": "[키포인트] 함수값 조건을 각각 식에 대입한다.\n$a=f(-3)=\\dfrac13(-3)-2=-1-2=-3$이다.\n$f(b)=1$이므로 $\\dfrac13b-2=1$이다. 따라서 $\\dfrac13b=3$, $b=9$이다.\n그러므로 $a+b=-3+9=6$이다.\n따라서 정답은 ④이다.",
    "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
    "subUnit": "일차함수의 뜻과 그래프",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 12,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 $\\triangle ABC$에서 $\\angle A=\\angle DEC$이고 $\\overline{AD}=2$ cm, $\\overline{DC}=6$ cm, $\\overline{EC}=4$ cm일 때, $\\overline{BE}$의 길이는? [4점]",
    "choices": [
      "5 cm",
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 각이 각각 같은 삼각형의 닮음을 이용한다.\n$\\angle A=\\angle DEC$이고 $\\angle ACB=\\angle ECD$이므로 $\\triangle ABC\\sim\\triangle EDC$이다.\n$AC=AD+DC=2+6=8$ cm이고, 대응변의 비는 $AC:EC=8:4=2:1$이다.\n따라서 $BC:DC=2:1$이므로 $BC=2\\times6=12$ cm이다.\n$BE=BC-EC=12-4=8$ cm이므로 정답은 ④이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q12.png",
    "subUnitKey": "M2-06-SIMILAR_FIGURE",
    "subUnit": "도형의 닮음",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 13,
    "level": "중",
    "category": "피타고라스 정리",
    "originalCategory": "피타고라스 정리",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-07",
    "standardUnit": "피타고라스 정리",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "$\\angle A=90^\\circ$인 직각삼각형 $ABC$에서 $\\overline{AH}\\perp\\overline{BC}$이고, $\\overline{AB}=3$ cm, $\\overline{AC}=4$ cm일 때, $\\overline{AH}$의 길이는? [4점]",
    "choices": [
      "$\\dfrac{12}{5}$ cm",
      "$\\dfrac{17}{5}$ cm",
      "$\\dfrac{7}{3}$ cm",
      "$\\dfrac{10}{3}$ cm",
      "$\\dfrac{7}{2}$ cm"
    ],
    "answer": "①",
    "solution": "[키포인트] 피타고라스 정리로 빗변을 구하고, 삼각형의 넓이를 두 방법으로 나타낸다.\n$BC=\\sqrt{AB^2+AC^2}=\\sqrt{3^2+4^2}=5$ cm이다.\n직각삼각형의 넓이는 $\\dfrac12\\times3\\times4=6$ cm$^2$이다.\n또 밑변을 $BC$로 보면 넓이는 $\\dfrac12\\times5\\times AH$이다.\n따라서 $\\dfrac12\\times5\\times AH=6$이므로 $AH=\\dfrac{12}{5}$ cm이다.\n정답은 ①이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q13.png",
    "subUnitKey": "M2-07-PYTHAGOREAN_APPLICATION",
    "subUnit": "피타고라스 정리의 활용",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 14,
    "level": "중",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림에서 $\\overline{DE}\\parallel\\overline{BC}$이고 $\\overline{AB}=12$, $\\overline{AE}=6$, $\\overline{EC}=3$일 때, $\\overline{AD}$의 길이는? [4점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "③",
    "solution": "[키포인트] 평행선에 의해 생기는 닮은 삼각형의 대응변의 비를 이용한다.\n$AC=AE+EC=6+3=9$이다.\n$DE\\parallel BC$이므로 $\\triangle ADE\\sim\\triangle ABC$이다.\n따라서 $\\dfrac{AD}{AB}=\\dfrac{AE}{AC}=\\dfrac69=\\dfrac23$이다.\n$AD=12\\times\\dfrac23=8$이므로 정답은 ③이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q14.png",
    "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
    "subUnit": "평행선 사이의 선분의 길이의 비",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 15,
    "level": "하",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "$\\triangle ABC$에서 세 변 $\\overline{AB}$, $\\overline{BC}$, $\\overline{CA}$의 중점을 각각 $D,E,F$라고 하자. $\\overline{AB}=8$ cm, $\\overline{BC}=12$ cm, $\\overline{CA}=10$ cm일 때, $\\triangle DEF$의 둘레의 길이는? [3점]",
    "choices": [
      "9 cm",
      "12 cm",
      "13 cm",
      "15 cm",
      "21 cm"
    ],
    "answer": "④",
    "solution": "[키포인트] 삼각형의 두 변의 중점을 이은 선분의 길이는 나머지 한 변의 길이의 절반이다.\n$DE=\\dfrac12AC=5$ cm, $EF=\\dfrac12AB=4$ cm, $FD=\\dfrac12BC=6$ cm이다.\n따라서 $\\triangle DEF$의 둘레는 $5+4+6=15$ cm이다.\n정답은 ④이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q15.png",
    "subUnitKey": "M2-06-SIMILAR_FIGURE",
    "subUnit": "도형의 닮음",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 16,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "다음 $\\triangle ABC$에서 $\\overline{BM}=\\overline{CM}$, $\\overline{AN}=\\overline{MN}$이고, $\\overline{CD}\\parallel\\overline{ME}$, $\\overline{EM}=4$ cm일 때, $\\overline{CN}$의 길이는? [3점]",
    "choices": [
      "5 cm",
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm"
    ],
    "answer": "②",
    "solution": "[키포인트] 중점 조건과 평행선으로 생기는 길이의 비를 차례로 이용한다.\n$B=(0,0)$, $M=(1,0)$, $C=(2,0)$으로 놓고 $A=(u,v)$라 하자. $N$은 $AM$의 중점이므로 $N=\\left(\\dfrac{u+1}{2},\\dfrac v2\\right)$이다.\n직선 $CN$과 $AB$의 교점을 $D$라 하면 계산하여 $D=\\left(\\dfrac{2u}{3},\\dfrac{2v}{3}\\right)$을 얻는다. 따라서 직선 $CD$ 위에서 $CN:ND=3:1$, 즉 $CN=\\dfrac34CD$이다.\n또 $M$은 $BC$의 중점이고 $ME\\parallel CD$이므로 $\\triangle BCD$의 중점연결정리에 따라 $ME=\\dfrac12CD$이다.\n그러므로 $CN:ME=\\dfrac34:\\dfrac12=3:2$이다.\n$ME=4$ cm이므로 $CN=4\\times\\dfrac32=6$ cm이다.\n따라서 정답은 ②이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q16.png",
    "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
    "subUnit": "평행선 사이의 선분의 길이의 비",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 17,
    "level": "중",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림에서 $\\overline{AB}\\parallel\\overline{EF}\\parallel\\overline{DC}$일 때, $\\overline{EF}$의 길이는? [4점]",
    "choices": [
      "12 cm",
      "14 cm",
      "15 cm",
      "16 cm",
      "17 cm"
    ],
    "answer": "①",
    "solution": "[키포인트] 교차하는 두 선분과 평행선으로 생기는 닮음비를 이용한다.\n$AB\\parallel DC$이므로 $\\triangle ABE\\sim\\triangle CDE$이다.\n따라서 $BE:ED=AB:DC=21:28=3:4$이고, $BE:BD=3:(3+4)=3:7$이다.\n$EF\\parallel DC$이므로 $\\triangle BEF\\sim\\triangle BDC$이다.\n따라서 $\\dfrac{EF}{DC}=\\dfrac{BE}{BD}=\\dfrac37$이므로 $EF=28\\times\\dfrac37=12$ cm이다.\n정답은 ①이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q17.png",
    "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
    "subUnit": "평행선 사이의 선분의 길이의 비",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 18,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 그림에서 점 $G$는 $\\triangle ABC$의 무게중심이고, 점 $G'$은 $\\triangle GBC$의 무게중심이다. $\\triangle G'BD$의 넓이가 $6$ cm$^2$일 때, $\\triangle ABC$의 넓이는? [4점]",
    "choices": [
      "36 cm$^2$",
      "72 cm$^2$",
      "84 cm$^2$",
      "96 cm$^2$",
      "108 cm$^2$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 무게중심은 중선을 $2:1$로 나누므로 밑변에 대한 높이도 같은 비로 줄어든다.\n$D$는 $BC$의 중점이다. $G$는 $\\triangle ABC$의 무게중심이므로 $G$에서 $BC$까지의 높이는 $A$에서 $BC$까지의 높이의 $\\dfrac13$이다.\n또 $G'$은 $\\triangle GBC$의 무게중심이므로 $G'$에서 $BC$까지의 높이는 $G$에서 $BC$까지의 높이의 $\\dfrac13$, 즉 원래 높이의 $\\dfrac19$이다.\n$BD=\\dfrac12BC$이므로\n$[G'BD]=\\dfrac12\\times\\dfrac12BC\\times\\dfrac19h=\\dfrac1{18}[ABC]$이다.\n$[G'BD]=6$이므로 $[ABC]=18\\times6=108$ cm$^2$이다.\n따라서 정답은 ⑤이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q18.png",
    "subUnitKey": "M2-06-SIMILAR_FIGURE",
    "subUnit": "도형의 닮음",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 19,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "다음 그림에서 두 점 $G,G'$은 각각 $\\triangle ABC$, $\\triangle GBC$의 무게중심이다. $\\overline{GG'}=4$ cm일 때, $\\overline{AD}$의 길이는? [4점]",
    "choices": [
      "16 cm",
      "18 cm",
      "20 cm",
      "22 cm",
      "24 cm"
    ],
    "answer": "②",
    "solution": "[키포인트] 두 무게중심이 같은 중선 위에서 선분을 나누는 비를 이용한다.\n$G$는 $\\triangle ABC$의 무게중심이므로 $AG:GD=2:1$이다.\n$G'$은 $\\triangle GBC$의 무게중심이므로 $GG':G'D=2:1$이다.\n$GG'=4$ cm이므로 $G'D=2$ cm, 따라서 $GD=GG'+G'D=6$ cm이다.\n$AG:GD=2:1$이므로 $AG=12$ cm이다.\n따라서 $AD=AG+GD=12+6=18$ cm이므로 정답은 ②이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q19.png",
    "subUnitKey": "M2-06-SIMILAR_FIGURE",
    "subUnit": "도형의 닮음",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 20,
    "level": "중",
    "category": "피타고라스 정리",
    "originalCategory": "피타고라스 정리",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-07",
    "standardUnit": "피타고라스 정리",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "복수정답"
    ],
    "wide": false,
    "content": "삼각형의 세 변의 길이가 각각 다음과 같을 때, 직각삼각형인 것을 모두 고르면? (정답 2개) [4점]",
    "choices": [
      "4 cm, 6 cm, 8 cm",
      "5 cm, 12 cm, 13 cm",
      "7 cm, 14 cm, 25 cm",
      "8 cm, 12 cm, 15 cm",
      "12 cm, 16 cm, 20 cm"
    ],
    "answer": "②, ⑤",
    "solution": "[키포인트] 가장 긴 변의 제곱이 나머지 두 변의 제곱의 합과 같은지 확인한다.\n① $4^2+6^2=52\\ne64=8^2$이다.\n② $5^2+12^2=25+144=169=13^2$이므로 직각삼각형이다.\n③ $7+14<25$이므로 삼각형 자체가 만들어지지 않는다.\n④ $8^2+12^2=208\\ne225=15^2$이다.\n⑤ $12^2+16^2=144+256=400=20^2$이므로 직각삼각형이다.\n따라서 정답은 ②, ⑤이다.",
    "subUnitKey": "M2-07-PYTHAGOREAN_THEOREM",
    "subUnit": "피타고라스 정리",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 21,
    "level": "중",
    "category": "피타고라스 정리",
    "originalCategory": "피타고라스 정리",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-07",
    "standardUnit": "피타고라스 정리",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 그림은 $\\angle A=90^\\circ$인 직각삼각형 $ABC$의 세 변을 각각 지름으로 하는 반원을 그린 것이다. $\\overline{AB}=12$ cm이고 $\\overline{BC}=15$ cm일 때, 색칠한 부분의 넓이는? [4점]",
    "choices": [
      "36 cm$^2$",
      "48 cm$^2$",
      "54 cm$^2$",
      "64 cm$^2$",
      "84 cm$^2$"
    ],
    "answer": "③",
    "solution": "[키포인트] 피타고라스 정리에 의해 두 작은 반원의 넓이의 합은 빗변 위 큰 반원의 넓이와 같다.\n$AC=\\sqrt{BC^2-AB^2}=\\sqrt{15^2-12^2}=\\sqrt{81}=9$ cm이다.\n세 반원의 넓이는 지름의 제곱에 비례하고 $AB^2+AC^2=BC^2$이므로, 두 작은 반원의 넓이의 합은 큰 반원의 넓이와 같다.\n공통으로 겹치는 부분을 양쪽에서 빼면 색칠한 두 부분의 넓이의 합은 $\\triangle ABC$의 넓이와 같다.\n따라서 색칠한 부분의 넓이는 $\\dfrac12\\times12\\times9=54$ cm$^2$이다.\n정답은 ③이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q21.png",
    "subUnitKey": "M2-07-PYTHAGOREAN_APPLICATION",
    "subUnit": "피타고라스 정리의 활용",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 22,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형"
    ],
    "wide": false,
    "content": "[서술형 1] 오른쪽 그림에서 직사각형의 긴 변과 짧은 변의 길이를 연립방정식을 세워서 구하려고 한다. 직사각형의 긴 변과 짧은 변의 길이를 각각 $x$ cm와 $y$ cm라 하자. 다음 물음에 답하시오.<br>(1) [그림 1]을 보고 일차방정식을 작성하시오. [1점]<br>(2) [그림 2]를 보고 일차방정식을 작성하시오. [1점]<br>(3) (1)과 (2)에서 작성한 연립방정식을 풀고, 직사각형의 면적을 구하시오. [3점]",
    "choices": [],
    "answer": "$3x-2y=15$, $x+3y=16$, $21$ cm$^2$",
    "solution": "[키포인트] 그림의 전체 높이와 두 높이의 차를 긴 변 $x$, 짧은 변 $y$로 나타낸다.\n(1) [그림 1]에서 왼쪽 세로 높이는 $3x$, 오른쪽 두 직사각형의 높이는 $2y$이고 그 차가 15 cm이므로 $3x-2y=15$이다.\n(2) [그림 2]의 전체 높이는 긴 변 한 개와 짧은 변 세 개의 합이므로 $x+3y=16$이다.\n(3) $\\begin{cases}3x-2y=15\\\\x+3y=16\\end{cases}$에서 둘째 식에 3을 곱하면 $3x+9y=48$이다.\n이 식에서 첫째 식을 빼면 $11y=33$이므로 $y=3$이다. $x+3y=16$에 대입하면 $x=7$이다.\n직사각형의 면적은 $xy=7\\times3=21$ cm$^2$이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q22.png",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
    "subUnit": "연립일차방정식",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 23,
    "level": "중",
    "category": "연립방정식",
    "originalCategory": "연립방정식",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-03",
    "standardUnit": "연립일차방정식",
    "standardUnitOrder": 3,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 2] 강훈이는 시각 장애인과 함께하는 10 km 단축 마라톤 대회에 참가했다. 처음에는 분속 200 m로 일정하게 달렸지만 도중에 체력이 떨어져 급수대에서 5분간 휴식을 취하고 분속 100 m로 일정하게 달려서 1시간 30분 만에 완주하였다. 강훈이가 분속 200 m로 달린 거리를 구하려고 할 때, 아래의 물음에 답하시오.<br>(1) 문제의 뜻에 맞게 연립방정식을 작성하시오. [2점]<br>(2) (1)에서 작성한 연립방정식을 풀고, 분속 200 m로 달린 거리를 구하시오. [3점]",
    "choices": [],
    "answer": "$x+y=10000$, $\\dfrac{x}{200}+\\dfrac{y}{100}=85$, $3000$ m",
    "solution": "[키포인트] 두 속력으로 달린 거리의 합과 실제로 달린 시간의 합을 식으로 나타낸다.\n분속 200 m로 달린 거리를 $x$ m, 분속 100 m로 달린 거리를 $y$ m라 하자.\n전체 거리가 10 km, 즉 10000 m이므로 $x+y=10000$이다.\n전체 90분 중 5분을 쉬었으므로 달린 시간은 85분이다. 따라서 $\\dfrac{x}{200}+\\dfrac{y}{100}=85$이다.\n둘째 식에 200을 곱하면 $x+2y=17000$이다. 여기서 $x+y=10000$을 빼면 $y=7000$이고, $x=3000$이다.\n따라서 분속 200 m로 달린 거리는 3000 m이다.",
    "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
    "subUnit": "연립일차방정식의 활용",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 24,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형"
    ],
    "wide": false,
    "content": "[서술형 3] 다음 그림과 같은 $\\triangle ABC$에서 $\\overline{DE}\\parallel\\overline{BC}$, $\\overline{DF}\\parallel\\overline{BE}$일 때, $\\overline{EC}$의 길이를 구하시오. (단, $\\overline{AF}=8$ cm, $\\overline{FE}=6$ cm이다.) [5점]",
    "choices": [],
    "answer": "$\\dfrac{21}{2}$ cm",
    "solution": "[키포인트] 두 평행선에서 생기는 닮음비를 차례로 연결한다.\n$AE=AF+FE=8+6=14$ cm이다.\n$DF\\parallel BE$이므로 $\\triangle ADF\\sim\\triangle ABE$이다.\n따라서 $AD:AB=AF:AE=8:14=4:7$이다.\n또 $DE\\parallel BC$이므로 $\\triangle ADE\\sim\\triangle ABC$이고, $AE:AC=AD:AB=4:7$이다.\n그러므로 $AC=14\\times\\dfrac74=\\dfrac{49}{2}$ cm이다.\n$EC=AC-AE=\\dfrac{49}{2}-14=\\dfrac{21}{2}$ cm이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q24.png",
    "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
    "subUnit": "평행선 사이의 선분의 길이의 비",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  },
  {
    "id": 25,
    "level": "상",
    "category": "도형의 닮음",
    "originalCategory": "도형의 닮음",
    "standardCourse": "중2 수학",
    "standardUnitKey": "M2-06",
    "standardUnit": "도형의 닮음",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "도형"
    ],
    "wide": false,
    "content": "[서술형 4] 그림에서 점 $G$는 $\\triangle ABC$의 무게중심일 때, 다음 물음에 답하시오.<br>(1) $\\overline{AH}:\\overline{HG}:\\overline{GD}$를 구하시오. [2점]<br>(2) 삼각형의 넓이 $\\triangle AFE:\\triangle FGE:\\triangle GBC$를 간단한 자연수의 비로 나타내시오. [3점]",
    "choices": [],
    "answer": "$3:1:2$, $3:1:4$",
    "solution": "[키포인트] $F,E,D$는 각 변의 중점이고, 무게중심과 중점연결정리를 함께 이용한다.\n$G$는 무게중심이므로 $AG:GD=2:1$이다.\n$F,E$는 각각 $AB,AC$의 중점이므로 $FE\\parallel BC$이고, $H$는 $AD$의 중점이다. 따라서 $AH:HD=1:1$이다.\n$AD$를 6등분하면 $AH=3$, $AG=4$, $GD=2$에 해당하므로 $HG=AG-AH=1$이다.\n따라서 $AH:HG:GD=3:1:2$이다.\n전체 $\\triangle ABC$의 넓이를 12라 하자. $\\triangle AFE\\sim\\triangle ABC$이고 닮음비가 $1:2$이므로 $[AFE]=3$이다.\n$G$에서 $BC$까지의 높이는 전체 높이의 $\\dfrac13$이므로 $[GBC]=\\dfrac13[ABC]=4$이다.\n또 $FE=\\dfrac12BC$이고 $G$와 $FE$ 사이의 높이는 전체 높이의 $\\dfrac16$이므로 $[FGE]=1$이다.\n따라서 $[AFE]:[FGE]:[GBC]=3:1:4$이다.",
    "image": "assets/images/23_금당중_2학기_중간_중2_수학/q25.png",
    "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
    "subUnit": "평행선 사이의 선분의 길이의 비",
    "subUnitConfidence": "rule_inferred",
    "subUnitClassificationDepth": "complete_rule"
  }
];
