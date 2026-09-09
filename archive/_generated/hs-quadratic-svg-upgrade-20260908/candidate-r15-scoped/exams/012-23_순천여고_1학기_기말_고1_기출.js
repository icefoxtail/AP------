window.examTitle = "23_순천여고_1학기_기말_고1_기출";
window.questionBank = [
  {
    "id": 7,
    "level": "중",
    "category": "수학(상)",
    "originalCategory": "수학(상)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-08",
    "standardUnit": "여러 가지 부등식",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "부등식 $x^2+2ax-a+6\\ge0$이 모든 실수 $x$에서 성립하도록 하는 실수 $a$의 최댓값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이차식이 모든 실수 $x$에서 $0$ 이상이 되려면 그래프가 $x$축보다 아래로 내려가지 않아야 한다.\n주어진 식은 $x$에 대한 이차식이고, $x^2$의 계수가 양수이므로 그래프는 위로 열린다.\n이 그래프가 모든 실수에서 $0$ 이상이 되려면 $x$축과 만나지 않거나 한 점에서만 만나야 한다.\n따라서 판별식이 $0$ 이하이어야 한다.\n판별식은 $(2a)^2-4\\cdot1\\cdot(-a+6)=4a^2+4a-24$이다.\n$4a^2+4a-24\\le0$이고, 양변을 $4$로 나누면 $a^2+a-6\\le0$이다.\n인수분해하면 $(a+3)(a-2)\\le0$이므로 $-3\\le a\\le2$이다.\n따라서 $a$의 최댓값은 $2$이므로 정답은 $\\boxed{\\text{④}}$이다.",
    "subUnitKey": "H15-SA-08-INEQUALITY_BASIC",
    "subUnit": "부등식의 풀이",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 20,
    "level": "상",
    "category": "수학(상)",
    "originalCategory": "수학(상)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "content": "아래 그림과 같이 이차함수 $y=ax^2$ $(a>0)$의 그래프와 직선 $y=2x+4$이 만나는 두 점의 $x$좌표를 각각 $\\alpha$, $\\beta$라 하자. 점 $B$에서 $x$축에 내린 수선의 발을 $H$, 점 $A$에서 선분 $BH$에 내린 수선의 발을 $C$라 하자. 삼각형 $ACB$의 넓이가 $9$일 때, $\\alpha^3+\\beta^3$의 값은? (단, $\\alpha<\\beta$)",
    "choices": [
      "$\\dfrac{11}{2}$",
      "$6$",
      "$\\dfrac{13}{2}$",
      "$7$",
      "$\\dfrac{15}{2}$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이차함수의 계수 $a$와 교점의 $x$좌표 $\\alpha$, $\\beta$를 구분하여 정리한다.\n직선 $y=2x+4$와 포물선 $y=ax^2$의 교점의 $x$좌표는\n$ax^2=2x+4$를 만족한다.\n즉 $ax^2-2x-4=0$의 두 근이 $\\alpha$, $\\beta$이다.\n따라서 이차방정식의 근과 계수의 관계에 의해\n$\\alpha+\\beta=\\dfrac{2}{a}$, $\\alpha\\beta=-\\dfrac{4}{a}$이다.\n두 식을 비교하면\n$\\alpha\\beta=-2(\\alpha+\\beta)$이다.\n이제 삼각형 $ACB$의 넓이를 이용한다.\n두 점 $A$, $B$는 모두 직선 $y=2x+4$ 위에 있으므로\n$A=(\\alpha,2\\alpha+4)$, $B=(\\beta,2\\beta+4)$이다.\n점 $B$에서 $x$축에 내린 수선은 $x=\\beta$이고, 점 $A$에서 선분 $BH$에 내린 수선의 발은\n$C=(\\beta,2\\alpha+4)$이다.\n따라서\n$AC=\\beta-\\alpha$,\n$BC=(2\\beta+4)-(2\\alpha+4)=2(\\beta-\\alpha)$이다.\n삼각형 $ACB$의 넓이는\n$\\dfrac12\\cdot AC\\cdot BC=\\dfrac12(\\beta-\\alpha)\\cdot2(\\beta-\\alpha)=(\\beta-\\alpha)^2$이다.\n넓이가 $9$이므로\n$(\\beta-\\alpha)^2=9$이고, $\\alpha<\\beta$이므로 $\\beta-\\alpha=3$이다.\n$s=\\alpha+\\beta$, $p=\\alpha\\beta$라 하자.\n그러면\n$(\\beta-\\alpha)^2=(\\alpha+\\beta)^2-4\\alpha\\beta$이므로\n$9=s^2-4p$이다.\n또 위에서 $p=-2s$이므로\n$9=s^2-4(-2s)=s^2+8s$이다.\n따라서\n$s^2+8s-9=0$\n$(s-1)(s+9)=0$이다.\n그런데 $p=-2s$이고 $a>0$에서 $p=\\alpha\\beta=-\\dfrac4a<0$이므로 $s$는 양수여야 한다.\n따라서 $s=\\alpha+\\beta=1$이고 $p=\\alpha\\beta=-2$이다.\n이제\n$\\alpha^3+\\beta^3=(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)$를 이용하면\n$\\alpha^3+\\beta^3=1^3-3(-2)\\cdot1=7$이다.\n따라서 정답은 $\\boxed{\\text{④}}$이다.",
    "image": "assets/images/23_순천여고_1학기_기말_고1_기출/q20.png",
    "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION",
    "subUnit": "이차방정식과 이차함수의 관계",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  },
  {
    "id": 23,
    "level": "상",
    "category": "수학(상)",
    "originalCategory": "수학(상)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "그래프"
    ],
    "wide": false,
    "content": "[서술형3] 아래 그림과 같이 직선 $x=t$ $(0<t<3)$이 두 이차함수 $y=\\dfrac13x^2+1$, $y=-(x-2)^2+5$의 그래프와 만나는 점을 각각 $P$, $Q$라 하자. 두 점 $A(0,1)$, $B(3,4)$에 대하여 사각형 $PAQB$의 넓이가 $t=a$일 때 최댓값 $b$를 가질 때, $a$, $b$의 값을 각각 구하시오.",
    "choices": [],
    "answer": "$a=\\dfrac32$, $b=\\dfrac92$",
    "solution": "[키포인트] 세로 길이 $PQ$를 $t$에 대한 식으로 구한 뒤, 사각형의 넓이를 이차식으로 나타내어 최댓값을 찾는다.\n직선 $x=t$가 위쪽 그래프 $y=-(x-2)^2+5$와 만나는 점을 $P$라 하면 $P$의 $y$좌표는 $-(t-2)^2+5=-t^2+4t+1$이다.\n또 아래쪽 그래프 $y=\\dfrac13x^2+1$과 만나는 점을 $Q$라 하면 $Q$의 $y$좌표는 $\\dfrac13t^2+1$이다.\n따라서 세로 길이 $PQ$는 $(-t^2+4t+1)-\\left(\\dfrac13t^2+1\\right)=-\\dfrac43t^2+4t$이다.\n사각형 $PAQB$는 삼각형 $APQ$와 삼각형 $PQB$로 나누어 생각할 수 있다.\n삼각형 $APQ$의 밑변을 $PQ$로 보면 높이는 점 $A$에서 직선 $x=t$까지의 거리이므로 $t$이다.\n삼각형 $PQB$의 밑변을 $PQ$로 보면 높이는 점 $B$에서 직선 $x=t$까지의 거리이므로 $3-t$이다.\n따라서 사각형의 넓이는 $\\dfrac12PQ\\cdot t+\\dfrac12PQ\\cdot(3-t)=\\dfrac32PQ$이다.\n즉 넓이를 $S$라 하면 $S=\\dfrac32\\left(-\\dfrac43t^2+4t\\right)=-2t^2+6t$이다.\n완전제곱식으로 고치면 $S=-2\\left(t-\\dfrac32\\right)^2+\\dfrac92$이다.\n따라서 $t=\\dfrac32$일 때 넓이가 최대이고, 최댓값은 $\\dfrac92$이다.\n그러므로 $\\boxed{a=\\dfrac32}$, $\\boxed{b=\\dfrac92}$이다.",
    "image": "assets/images/23_순천여고_1학기_기말_고1_기출/q23.png",
    "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION",
    "subUnit": "이차방정식과 이차함수의 관계",
    "subUnitConfidence": "category_or_cue_inferred",
    "subUnitClassificationDepth": "complete_category"
  }
];
