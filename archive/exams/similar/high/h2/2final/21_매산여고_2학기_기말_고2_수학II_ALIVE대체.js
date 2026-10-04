window.examTitle = "21_매산여고_2학기_기말_고2_수학II_ALIVE대체";
window.examDisplayTitle = "2021 매산여고 고2 2학기 기말 HOLD 대체 유사문항";
window.questionBank = [
  {
    "id": 6,
    "level": "중",
    "category": "속도와 이동 거리",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION",
    "subUnit": "도함수의 활용",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": ["속도와 가속도", "그래프"],
    "wide": false,
    "content": "원점을 출발하여 수직선 위를 $9$초 동안 움직이는 점 $P$의 시각 $t$초에서의 속도 $v(t)$의 그래프가 그림과 같을 때, 점 $P$의 운동에 대한 설명 중 옳은 것을 모두 고르면?\nㄱ. 출발 후 $9$초 동안 운동 방향이 두 번 바뀐다.\nㄴ. $t=3$에서 $t=6$까지 움직인 거리는 $\\dfrac52$이다.\nㄷ. $t=1$일 때와 $t=3$일 때의 속력은 서로 같다.",
    "choices": ["ㄱ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"],
    "image": "assets/images/21_매산여고_2학기_기말_고2_수학II_ALIVE대체/q6.svg",
    "answer": "⑤",
    "solution": "그래프는 $0<t<4$에서 $v(t)>0$, $4<t<8$에서 $v(t)<0$, $8<t<9$에서 $v(t)>0$이므로 운동 방향은 $t=4,8$에서 두 번 바뀐다. 따라서 ㄱ은 참이다. $t=3$부터 $4$까지의 이동 거리는 밑변 $1$, 높이 $1$인 삼각형의 넓이 $\\dfrac12$이고, $4$부터 $6$까지는 밑변 $2$, 높이 $2$인 삼각형의 넓이 $2$이므로 이동 거리는 $\\dfrac52$이다. ㄴ도 참이다. 그래프에서 $v(1)=v(3)=1$이므로 두 속력은 같다. ㄷ도 참이다. 따라서 옳은 것은 ㄱ, ㄴ, ㄷ이고 정답은 ⑤이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "입체도형의 부피",
    "originalCategory": "도함수의 활용",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION",
    "subUnit": "도함수의 활용",
    "questionType": "단답형",
    "layoutTag": "grid",
    "tags": ["입체도형", "부피"],
    "wide": false,
    "content": "그림과 같이 밑면의 반지름의 길이가 $8$, 높이가 $12$인 원뿔의 내부에 밑면이 정사각형인 직육면체를 내접시켰다. 직육면체의 부피가 $72$이고 높이가 $4$보다 클 때, 직육면체 밑면의 한 변의 길이를 구하여라. (그림은 모양만 나타낸 것이며 길이의 비를 정확히 나타내지 않는다.)",
    "choices": [],
    "image": "assets/images/21_매산여고_2학기_기말_고2_수학II_ALIVE대체/q20.svg",
    "answer": "$2\\sqrt{2}$",
    "solution": "직육면체의 높이를 $h$라 하면 원뿔의 밑면에서 높이 $h$인 단면의 반지름은 닮음비에 의해 $8(1-\\dfrac{h}{12})$이다. 정사각형 밑면의 한 변을 $s$라 할 때, 원에 내접한 정사각형이므로 $s=\\sqrt2\\cdot8(1-\\dfrac{h}{12})$이다. 따라서 부피 조건은 $s^2h=128h(1-\\dfrac{h}{12})^2=72$, 즉 $h(1-\\dfrac{h}{12})^2=\\dfrac{9}{16}$이다. 이를 정리하면 $(h-9)(h^2-15h+9)=0$이다. 이차식의 두 근은 $\\dfrac{15\\pm3\\sqrt{21}}{2}$이다. 그중 $0<h<12$인 작은 근은 $4$보다 작으므로, 조건 $h>4$를 만족하는 해는 $h=9$뿐이다. 그러므로 $s=8\\sqrt2(1-\\dfrac{9}{12})=2\\sqrt2$."
  }
];
