window.examTitle = "19_순천여고_2학기_기말_고2_수학II_ALIVE대체";
window.examDisplayTitle = "2019 순천여고 고2 2학기 기말 HOLD 대체 유사문항";
window.questionBank = [
  {
    "id": 21,
    "level": "상",
    "category": "정적분으로 나타낸 넓이",
    "originalCategory": "정적분",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-08",
    "standardUnit": "정적분",
    "standardUnitOrder": 8,
    "subUnitKey": "H15-M2-08-DEFINITE_INTEGRAL",
    "subUnit": "정적분",
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": ["정적분", "도형의 넓이"],
    "wide": false,
    "content": "[서술형3] 원 $C:x^2+(y-1)^2=1$과 포물선 $y=x^2$로 둘러싸인 두 부분의 넓이를 각각 $S_1,S_2$라 하자. $S_1+S_2$의 값을 구하고 그 과정을 서술하여라.",
    "choices": [],
    "image": "assets/images/19_순천여고_2학기_기말_고2_수학II_ALIVE대체/q21.svg",
    "answer": "$\\dfrac{\\pi}{2}-\\dfrac{4}{3}$",
    "solution": "두 곡선의 교점을 구하면 $x^2+(x^2-1)^2=1$에서 $x^2(x^2-1)=0$이므로 $x=-1,0,1$이다. 원의 아래쪽 반원은 $y=1-\\sqrt{1-x^2}$이고, $0\\le x\\le1$에서 포물선 $y=x^2$가 이 반원보다 위에 있다. 대칭성에 따라 두 영역 넓이의 합은 $2\\int_0^1\\{x^2-(1-\\sqrt{1-x^2})\\}\\,dx$이다. $\\int_0^1x^2dx=\\dfrac13$이고 $\\int_0^1\\sqrt{1-x^2}dx=\\dfrac{\\pi}{4}$이므로 합은 $2(\\dfrac13-1+\\dfrac{\\pi}{4})=\\dfrac{\\pi}{2}-\\dfrac43$. 따라서 정답은 $\\dfrac{\\pi}{2}-\\dfrac43$이다."
  }
];
