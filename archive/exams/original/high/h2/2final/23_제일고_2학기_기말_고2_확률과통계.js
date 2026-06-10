window.examTitle = "23_제일고_2학기_기말_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-01",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같이 합동인 정육각형 7개를 붙여 만든 도형의 각 면에 다른 색이 오도록 7가지 색으로 구분하여 칠하는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.) (3.8점)",
    "image": "assets/images/23_제일고_2학기_기말_고2_확률과통계/q1.png",
    "choices": [
      "120",
      "160",
      "210",
      "420",
      "840"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 서로 다른 7가지 색을 7개의 정육각형에 칠한 뒤, 회전하여 일치하는 경우를 같은 것으로 본다.\\n조건 정리: 도형은 한가운데 정육각형 1개와 둘레 정육각형 6개로 이루어져 있고, 회전 대칭은 6가지이다.\\n정석 풀이: 먼저 7개의 위치에 서로 다른 7가지 색을 칠하는 경우의 수는 $7!$이다. 이때 도형을 회전하여 일치하는 것은 같은 것으로 보므로, 같은 칠하기가 회전 6가지씩 중복 계산된다. 따라서 경우의 수는 $\\dfrac{7!}{6}=\\dfrac{5040}{6}=840$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-01",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "4명의 학생이 각자 택시, 시내버스, 자전거 중에서 한 가지 교통수단을 이용하여 소풍 장소에 모일 때, 교통수단을 택하는 경우의 수는? (3.7점)",
    "choices": [
      "${}_{4}P_{3}$",
      "${}_{4}C_{3}$",
      "${}_{4}H_{3}$",
      "$4^3$",
      "$3^4$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 학생이 독립적으로 3가지 교통수단 중 하나를 선택한다.\\n조건 정리: 학생은 4명이고, 각 학생마다 가능한 선택은 택시, 시내버스, 자전거의 3가지이다.\\n정석 풀이: 첫 번째 학생은 3가지, 두 번째 학생도 3가지, 세 번째 학생도 3가지, 네 번째 학생도 3가지 중 하나를 고를 수 있다. 곱의 법칙에 의해 전체 경우의 수는 $3\\times3\\times3\\times3=3^4$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "확률의 뜻과 활용",
    "originalCategory": "확률의 뜻과 활용",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "한 개의 동전을 4번 던질 때, 앞면이 3번 나올 확률을 구하면? (3.7점)",
    "choices": [
      "$\\dfrac{1}{2}$",
      "$\\dfrac{1}{3}$",
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{8}$",
      "$\\dfrac{1}{16}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 동전 4번 중 앞면이 3번 나오는 경우를 이항분포로 계산한다.\\n조건 정리: 한 번 던질 때 앞면이 나올 확률은 $\\dfrac{1}{2}$이고, 4번 중 3번 앞면이 나와야 한다.\\n정석 풀이: 앞면이 나오는 3번의 위치를 정하는 경우의 수는 ${}_{4}C_{3}=4$이다. 각 경우의 확률은 $\\left(\\dfrac{1}{2}\\right)^3\\left(\\dfrac{1}{2}\\right)=\\left(\\dfrac{1}{2}\\right)^4$이다. 따라서 확률은 ${}_{4}C_{3}\\left(\\dfrac{1}{2}\\right)^4=4\\cdot\\dfrac{1}{16}=\\dfrac{1}{4}$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 4,
    "level": "하",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "이산확률변수 $X$의 확률분포표가 다음과 같을 때, $P(X^2=1)$의 값을 구하면? (3.7점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$X$</th><td>$-1$</td><td>$0$</td><td>$1$</td><td>합계</td></tr><tr><th>$P(X=x)$</th><td>$\\dfrac{1}{5}$</td><td>$\\dfrac{3}{5}$</td><td>$\\dfrac{1}{5}$</td><td>$1$</td></tr></tbody></table></div>",
    "choices": [
      "$\\dfrac{1}{5}$",
      "$\\dfrac{2}{5}$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{4}{5}$",
      "1"
    ],
    "answer": "②",
    "solution": "[키포인트] $X^2=1$이 되는 $X$의 값은 $-1$과 $1$이다.\\n조건 정리: 확률분포표에서 $P(X=-1)=\\dfrac{1}{5}$, $P(X=1)=\\dfrac{1}{5}$이다.\\n정석 풀이: $X^2=1$은 $X=-1$ 또는 $X=1$일 때 성립한다. 두 사건은 동시에 일어날 수 없으므로 확률을 더하면 된다. 따라서 $P(X^2=1)=P(X=-1)+P(X=1)=\\dfrac{1}{5}+\\dfrac{1}{5}=\\dfrac{2}{5}$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 5,
    "level": "하",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "확률변수 $Z$가 표준정규분포 $N(0,1)$을 따를 때, 다음 표준정규분포표를 이용하여 $P(Z\\le 0.5)$의 값을 구하면? (3.7점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr><tr><td>$0.5$</td><td>$0.19$</td></tr><tr><td>$1.0$</td><td>$0.34$</td></tr><tr><td>$1.5$</td><td>$0.43$</td></tr><tr><td>$2.0$</td><td>$0.48$</td></tr><tr><td>$2.5$</td><td>$0.49$</td></tr></tbody></table></div>",
    "choices": [
      "0.69",
      "0.84",
      "0.93",
      "0.98",
      "0.99"
    ],
    "answer": "①",
    "solution": "[키포인트] 표준정규분포는 평균 0을 기준으로 좌우 대칭이므로 $P(Z\\le0)=0.5$이다.\\n조건 정리: 표에서 $P(0\\le Z\\le0.5)=0.19$이다.\\n정석 풀이: $P(Z\\le0.5)=P(Z\\le0)+P(0\\le Z\\le0.5)$이다. 표준정규분포의 대칭성으로 $P(Z\\le0)=0.5$이고, 표에서 $P(0\\le Z\\le0.5)=0.19$이므로 $P(Z\\le0.5)=0.5+0.19=0.69$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "10원짜리 동전 5개를 동시에 던져서 앞면이 나오는 동전을 모두 가지기로 할 때, 가질 수 있는 금액을 확률변수 $X$라고 하자. $X$의 평균을 구하면? (3.8점)",
    "choices": [
      "5",
      "10",
      "15",
      "20",
      "25"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 각 동전이 기여하는 금액의 기댓값을 구한 뒤 5개를 더한다.\\n조건 정리: 동전 하나가 앞면이면 10원을 얻고, 뒷면이면 0원을 얻는다. 앞면이 나올 확률은 $\\dfrac{1}{2}$이다.\\n정석 풀이: 동전 하나에서 얻는 금액의 기댓값은 $10\\cdot\\dfrac{1}{2}+0\\cdot\\dfrac{1}{2}=5$원이다. 동전이 5개이므로 전체 금액 $X$의 평균은 $5\\times5=25$원이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-01",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "땅콩 맛 아이스크림, 바닐라 맛 아이스크림, 초콜릿 맛 아이스크림 중에서 중복을 허용하여 5개를 주문할 때, 땅콩 맛 아이스크림이 포함되는 모든 경우의 수를 구하면? (4점)",
    "choices": [
      "15",
      "21",
      "27",
      "30",
      "35"
    ],
    "answer": "①",
    "solution": "[키포인트] 중복을 허용하여 3가지 맛에서 5개를 고르되, 땅콩 맛이 적어도 1개 포함되어야 한다.\\n조건 정리: 땅콩, 바닐라, 초콜릿 맛의 개수를 각각 $x,y,z$라 하면 $x+y+z=5$이고 $x\\ge1$이다.\\n정석 풀이: 땅콩 맛이 적어도 1개 포함되어야 하므로 $x_1=x-1$로 두면 $x_1\\ge0$이고 $x_1+y+z=4$가 된다. 음이 아닌 정수해의 개수는 ${}_{4+3-1}C_{3-1}={}_{6}C_{2}=15$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-02",
    "standardUnit": "이항정리",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "$\\left(-x+\\dfrac{2}{x^2}\\right)^5$의 전개식에서 $x^2$의 계수를 구하면? (4점)",
    "choices": [
      "8",
      "10",
      "16",
      "20",
      "24"
    ],
    "answer": "②",
    "solution": "[키포인트] 이항정리의 일반항에서 $x$의 지수가 2가 되는 항을 찾는다.\\n조건 정리: 일반항은 ${}_{5}C_{k}(-x)^{5-k}\\left(\\dfrac{2}{x^2}\\right)^k$이다.\\n정석 풀이: 일반항의 $x$의 지수는 $(5-k)-2k=5-3k$이다. 이 값이 2가 되어야 하므로 $5-3k=2$, 즉 $k=1$이다. 따라서 해당 항의 계수는 ${}_{5}C_{1}(-1)^4\\cdot2=5\\cdot2=10$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "확률의 뜻과 활용",
    "originalCategory": "확률의 뜻과 활용",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "5번의 경기 중에서 3번을 먼저 이기는 사람이 최종 우승하는 체스 대회의 결승에 A와 B 두 사람이 진출하였다. A가 첫 번째 경기를 이겼을 때, A가 최종 우승할 확률을 구하면? (단, A가 B를 이길 확률은 $\\dfrac{2}{3}$이고, 비기는 경우는 없다.) (4점)",
    "choices": [
      "$\\dfrac{4}{9}$",
      "$\\dfrac{8}{9}$",
      "$\\dfrac{4}{27}$",
      "$\\dfrac{5}{27}$",
      "$\\dfrac{8}{27}$"
    ],
    "answer": "②",
    "solution": "[키포인트] A가 이미 1승을 했으므로, 남은 최대 4경기에서 A가 2번 이상 이기면 최종 우승한다.\\n조건 정리: 한 경기에서 A가 이길 확률은 $\\dfrac{2}{3}$, B가 이길 확률은 $\\dfrac{1}{3}$이다.\\n정석 풀이: 남은 4경기에서 A가 2승 이상 하는 확률을 구하면 된다. 따라서 확률은 ${}_{4}C_{2}\\left(\\dfrac{2}{3}\\right)^2\\left(\\dfrac{1}{3}\\right)^2+{}_{4}C_{3}\\left(\\dfrac{2}{3}\\right)^3\\left(\\dfrac{1}{3}\\right)+\\left(\\dfrac{2}{3}\\right)^4=\\dfrac{24}{81}+\\dfrac{32}{81}+\\dfrac{16}{81}=\\dfrac{72}{81}=\\dfrac{8}{9}$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "어느 과일 가게에 감귤 제품은 A 농장과 B 농장에서 각각 전체 제품의 $60\\%$, $40\\%$가 생산되고, 두 감귤 농장 A, B에서 생산된 감귤을 무게에 따라 분류하는데 잘못 분류할 비율은 각각 $2\\%$, $3\\%$라고 한다. 그 과일 가게의 감귤 제품 중에서 임의로 한 개를 택하였더니 잘못 분류된 감귤일 때, 그 감귤이 A 농장에서 생산되었을 확률을 구하면? (4점)",
    "choices": [
      "$\\dfrac{1}{2}$",
      "$\\dfrac{1}{3}$",
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{5}$",
      "$\\dfrac{2}{5}$"
    ],
    "answer": "①",
    "solution": "[키포인트] 잘못 분류된 감귤 중에서 A 농장 제품일 조건부확률을 베이즈 정리로 구한다.\\n조건 정리: $P(A)=0.6$, $P(B)=0.4$, $P(\\text{오분류}\\mid A)=0.02$, $P(\\text{오분류}\\mid B)=0.03$이다.\\n정석 풀이: 전체 오분류 확률은 $0.6\\cdot0.02+0.4\\cdot0.03=0.012+0.012=0.024$이다. 따라서 오분류된 감귤이 A 농장에서 생산되었을 확률은 $\\dfrac{0.6\\cdot0.02}{0.024}=\\dfrac{0.012}{0.024}=\\dfrac{1}{2}$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "두 사건 $A$, $B$가 서로 독립일 때, 다음 <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $A\\ne\\varnothing$, $B\\ne\\varnothing$) (4.1점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td>ㄱ. $P(A\\cup B)=P(A)+P(B)$</td></tr><tr><td>ㄴ. $P(A\\cap B^c)=P(A)P(B^c)$</td></tr><tr><td>ㄷ. $P(A^c\\mid B)=1-P(A)$</td></tr><tr><td>ㄹ. $P(A\\mid B)=P(B\\mid A)$</td></tr></tbody></table></div>",
    "choices": [
      "ㄱ, ㄹ",
      "ㄴ, ㄹ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "④",
    "solution": "[키포인트] 독립인 두 사건에서는 여사건과의 독립도 함께 성립한다.\\n조건 정리: $A$와 $B$가 독립이면 $P(A\\cap B)=P(A)P(B)$이고, $A$와 $B^c$도 독립이다.\\n정석 풀이: ㄱ은 일반적으로 $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$이므로 항상 참이 아니다. ㄴ은 $A$와 $B^c$가 독립이므로 $P(A\\cap B^c)=P(A)P(B^c)$가 되어 참이다. ㄷ은 독립성에 의해 $P(A^c\\mid B)=P(A^c)=1-P(A)$이므로 참이다. ㄹ은 $P(A\\mid B)=P(A)$, $P(B\\mid A)=P(B)$인데 두 값이 항상 같지는 않으므로 거짓이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "감나무 5000그루를 재배하는 어느 과수원의 나무 1그루당 감의 수확량은 평균이 20kg, 표준편차가 3.5kg인 정규분포를 따른다고 한다. 다음 표준정규분포표를 이용하여 이 과수원의 감나무 중에서 감의 수확량이 27kg 이상인 나무는 몇 그루인가? (4점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr><tr><td>$0.5$</td><td>$0.19$</td></tr><tr><td>$1.0$</td><td>$0.34$</td></tr><tr><td>$1.5$</td><td>$0.43$</td></tr><tr><td>$2.0$</td><td>$0.48$</td></tr><tr><td>$2.5$</td><td>$0.49$</td></tr></tbody></table></div>",
    "choices": [
      "50그루",
      "100그루",
      "150그루",
      "200그루",
      "250그루"
    ],
    "answer": "②",
    "solution": "[키포인트] 27kg을 표준화한 뒤 오른쪽 꼬리확률을 구한다.\\n조건 정리: 평균은 20kg, 표준편차는 3.5kg이다.\\n정석 풀이: $z=\\dfrac{27-20}{3.5}=2$이다. 표에서 $P(0\\le Z\\le2)=0.48$이므로 $P(Z\\ge2)=0.5-0.48=0.02$이다. 전체 5000그루 중 해당되는 나무의 수는 $5000\\times0.02=100$그루이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "어느 농구 선수의 자유투 성공률이 0.8라고 한다. 이 농구 선수가 자유투를 400번 시도할 때, 성공한 횟수가 $k$번 이상일 확률이 0.07이라고 한다. 다음 표준정규분포표를 이용하여 상수 $k$의 값을 구하면? (4점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr><tr><td>$0.5$</td><td>$0.19$</td></tr><tr><td>$1.0$</td><td>$0.34$</td></tr><tr><td>$1.5$</td><td>$0.43$</td></tr><tr><td>$2.0$</td><td>$0.48$</td></tr><tr><td>$2.5$</td><td>$0.49$</td></tr></tbody></table></div>",
    "choices": [
      "324",
      "328",
      "332",
      "336",
      "340"
    ],
    "answer": "③",
    "solution": "[키포인트] 이항분포를 정규분포로 근사하여 오른쪽 꼬리확률 0.07에 해당하는 값을 찾는다.\\n조건 정리: $X\\sim B(400,0.8)$이므로 평균은 $400\\cdot0.8=320$, 표준편차는 $\\sqrt{400\\cdot0.8\\cdot0.2}=8$이다.\\n정석 풀이: 성공 횟수가 $k$번 이상일 확률이 0.07이므로, 왼쪽 누적확률은 약 0.93이다. 표에서 $P(0\\le Z\\le1.5)=0.43$이므로 $P(Z\\le1.5)=0.93$이다. 따라서 $\\dfrac{k-320}{8}=1.5$로 보고 $k=320+12=332$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "정규분포 $N(80,100)$을 따르는 모집단에서 크기가 $n$인 표본을 임의추출할 때, 표본평균 $\\overline{X}$에 대하여 $P(78\\le\\overline{X}\\le82)=0.68$이다. 다음 표준정규분포표를 이용하여 $n$의 값을 구하면? (4.1점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr><tr><td>$0.5$</td><td>$0.19$</td></tr><tr><td>$1.0$</td><td>$0.34$</td></tr><tr><td>$1.5$</td><td>$0.43$</td></tr><tr><td>$2.0$</td><td>$0.48$</td></tr><tr><td>$2.5$</td><td>$0.49$</td></tr></tbody></table></div>",
    "choices": [
      "4",
      "9",
      "16",
      "25",
      "36"
    ],
    "answer": "④",
    "solution": "[키포인트] 표본평균의 표준편차는 모집단의 표준편차를 $\\sqrt{n}$으로 나눈 값이다.\\n조건 정리: 모집단의 표준편차는 10이고, 표본평균의 표준편차는 $\\dfrac{10}{\\sqrt{n}}$이다.\\n정석 풀이: $P(78\\le\\overline{X}\\le82)=0.68$이므로 평균 80을 중심으로 양쪽 폭 2에 대한 확률이다. 따라서 한쪽 확률은 0.34이고, 표에서 $P(0\\le Z\\le1)=0.34$이므로 표준화 값은 1이다. 즉 $\\dfrac{2}{10/\\sqrt{n}}=1$이므로 $\\sqrt{n}=5$, $n=25$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "정규분포를 따르는 모집단에서 크기가 81인 표본을 임의추출하여 모평균을 추정하였더니 신뢰구간의 길이가 10이었다. 같은 신뢰도로 모평균을 추정할 때, 신뢰구간의 길이가 6이 되게 하려면 표본의 크기가 얼마여야 하는지 구하면? (4.1점)",
    "choices": [
      "121",
      "144",
      "169",
      "196",
      "225"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 같은 신뢰도에서는 신뢰구간의 길이가 $\\dfrac{1}{\\sqrt{n}}$에 비례한다.\\n조건 정리: 처음 표본 크기는 81이고, 신뢰구간의 길이는 10이다. 새 신뢰구간의 길이는 6이어야 한다.\\n정석 풀이: 같은 신뢰도와 같은 모집단 표준편차에서는 $L\\propto\\dfrac{1}{\\sqrt{n}}$이다. 따라서 $\\dfrac{6}{10}=\\dfrac{\\sqrt{81}}{\\sqrt{n}}=\\dfrac{9}{\\sqrt{n}}$이다. 양변을 정리하면 $\\sqrt{n}=15$, $n=225$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "어느 공장에서 생산되는 배터리의 수명은 평균이 $m$시간, 표준편차가 30시간인 정규분포를 따른다고 한다. 이 공장에서 생산된 배터리 중에서 36개를 임의추출하여 구한 수명의 평균이 800시간이었다. 모평균 $m$에 대한 신뢰도 $\\alpha\\%$의 신뢰구간이 $791\\le m\\le809$(단위: 시간)일 때, $\\alpha$의 값을 다음 표준정규분포표를 이용하여 구하면? (4.1점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr><tr><td>$1.4$</td><td>$0.42$</td></tr><tr><td>$1.6$</td><td>$0.45$</td></tr><tr><td>$1.8$</td><td>$0.46$</td></tr><tr><td>$2.0$</td><td>$0.48$</td></tr><tr><td>$2.2$</td><td>$0.49$</td></tr></tbody></table></div>",
    "choices": [
      "84",
      "90",
      "92",
      "96",
      "98"
    ],
    "answer": "③",
    "solution": "[키포인트] 신뢰구간의 반길이를 표본평균의 표준오차로 나누어 표준정규분포의 $z$값을 찾는다.\\n조건 정리: 표본 크기는 36, 모집단 표준편차는 30이므로 표준오차는 $\\dfrac{30}{\\sqrt{36}}=5$이다. 신뢰구간의 반길이는 $809-800=9$이다.\\n정석 풀이: $z=\\dfrac{9}{5}=1.8$이다. 표에서 $P(0\\le Z\\le1.8)=0.46$이므로 중앙 신뢰확률은 $2\\times0.46=0.92$이다. 따라서 신뢰도는 $92\\%$이고 $\\alpha=92$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "순열과 조합",
    "originalCategory": "순열과 조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-01",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "content": "서로 다른 3개의 가방과 똑같은 3개의 리본, 똑같은 3개의 인형이 있다. 각 가방에 1개의 리본과 1개의 인형을 달려고 한다. 각 가방에서 리본을 인형보다 먼저 단다고 할 때, 3개의 가방에 리본과 인형을 다는 순서를 정하는 모든 경우의 수를 구하면? (단, 각 가방에서 리본과 인형을 연속하여 달지 않아도 된다.) (4.3점)",
    "choices": [
      "27",
      "36",
      "81",
      "90",
      "160"
    ],
    "answer": "④",
    "solution": "[키포인트] 각 가방마다 리본을 먼저 달고 그 뒤에 인형을 달아야 하는 선후 관계가 있다.\\n조건 정리: 가방 3개에 대해 각각 리본 달기와 인형 달기, 총 6개의 작업이 있으며 각 가방마다 리본 작업이 인형 작업보다 앞서야 한다.\\n정석 풀이: 6개의 작업을 일렬로 배열하면 $6!$가지가 있다. 그런데 각 가방마다 리본과 인형의 선후는 둘 중 1가지 순서만 허용되고, 전체 배열에서는 각 쌍마다 2가지 순서가 똑같이 나타난다. 따라서 가능한 순서의 수는 $\\dfrac{6!}{2^3}=\\dfrac{720}{8}=90$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "확률의 뜻과 활용",
    "originalCategory": "확률의 뜻과 활용",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "도형",
      "표"
    ],
    "wide": false,
    "content": "다음 그림과 같이 한 변의 길이가 1인 정사각형 ABCD의 꼭짓점 A에서 출발하여 변을 따라 움직이는 점 P가 있다. 주사위를 한 번 던질 때마다 다음과 같은 규칙에 따라 움직인다.\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td>(가) 나오는 눈의 수가 3의 배수이면 시곗바늘이 도는 방향과 반대인 방향으로 1만큼 움직인다.</td></tr><tr><td>(나) 나오는 눈의 수가 3의 배수가 아니면 시곗바늘이 도는 방향으로 1만큼 움직인다.</td></tr></tbody></table></div>\\n주사위를 4번 던질 때, 점 A를 출발한 점 P가 다시 점 A로 되돌아올 확률을 구하면? (4.3점)",
    "image": "assets/images/23_제일고_2학기_기말_고2_확률과통계/q18.png",
    "choices": [
      "$\\dfrac{1}{81}$",
      "$\\dfrac{16}{81}$",
      "$\\dfrac{17}{81}$",
      "$\\dfrac{24}{81}$",
      "$\\dfrac{41}{81}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 정사각형의 둘레를 따라 4번 움직인 뒤 출발점으로 돌아오려면 반시계 방향 이동 횟수가 짝수여야 한다.\\n조건 정리: 3의 배수는 3, 6이므로 반시계 방향으로 움직일 확률은 $\\dfrac{2}{6}=\\dfrac{1}{3}$이고, 시계 방향으로 움직일 확률은 $\\dfrac{4}{6}=\\dfrac{2}{3}$이다.\\n정석 풀이: 반시계 방향 이동 횟수를 $k$라 하면, 시계 방향 이동 횟수는 $4-k$이다. 정사각형에서 4번 이동 후 다시 A로 돌아오려면 $k=0,2,4$인 경우이다. 따라서 확률은 $\\left(\\dfrac{2}{3}\\right)^4+{}_{4}C_{2}\\left(\\dfrac{1}{3}\\right)^2\\left(\\dfrac{2}{3}\\right)^2+\\left(\\dfrac{1}{3}\\right)^4=\\dfrac{16}{81}+\\dfrac{24}{81}+\\dfrac{1}{81}=\\dfrac{41}{81}$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "표준편차가 $\\sigma$인 정규분포를 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 구한 모평균 $m$에 대한 신뢰도 $\\alpha\\%$의 신뢰구간은 $a\\le m\\le b$이다. <보기>에서 옳은 것만을 있는 대로 고른 것은? (4.3점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td>ㄱ. $n$의 값이 일정하고 $\\alpha$의 값이 커지면, $b-a$의 값은 커진다.</td></tr><tr><td>ㄴ. $n$의 값이 작아지고 $\\alpha$의 값이 커지면, $b-a$의 값은 작아진다.</td></tr><tr><td>ㄷ. $n$의 값이 작아지고 $\\alpha$의 값이 작아지면, $b-a$의 값은 작아진다.</td></tr></tbody></table></div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ"
    ],
    "answer": "①",
    "solution": "[키포인트] 신뢰구간의 길이는 신뢰수준에 해당하는 $z$값에 비례하고, 표본 크기의 제곱근에 반비례한다.\\n조건 정리: 신뢰구간의 길이 $b-a$는 $2z\\dfrac{\\sigma}{\\sqrt{n}}$ 꼴이다.\\n정석 풀이: ㄱ은 $n$이 일정할 때 신뢰도 $\\alpha$가 커지면 $z$값이 커져 신뢰구간의 길이도 커지므로 참이다. ㄴ은 $n$이 작아지면 길이가 커지고 $\\alpha$가 커져도 길이가 커지므로 작아진다는 말은 거짓이다. ㄷ은 $n$이 작아지면 길이는 커지지만 $\\alpha$가 작아지면 길이는 작아지므로 두 변화가 동시에 있을 때 반드시 작아진다고 할 수 없어 거짓이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "표"
    ],
    "wide": false,
    "content": "어느 공장에서 생산되는 제품 1개의 무게는 정규분포 $N(m,10^2)$을 따른다고 한다. 이 공장에서 생산된 제품 중에서 크기가 $n$인 표본을 임의추출하여 구한 표본평균 $\\overline{X}$에 대하여 $P(m\\le\\overline{X}\\le m+2)=0.34$일 때, $\\sigma(\\overline{X})$의 값을 다음 표준정규분포표를 이용하여 구하면? (4.3점)",
    "image": "assets/images/23_제일고_2학기_기말_고2_확률과통계/q20.png",
    "choices": [
      "0.5",
      "1",
      "1.5",
      "2",
      "2.5"
    ],
    "answer": "④",
    "solution": "[키포인트] $P(m\\le\\overline{X}\\le m+2)=0.34$를 표준정규분포의 $P(0\\le Z\\le z)$와 대응시킨다.\\n조건 정리: $\\overline{X}$의 평균은 $m$이고 표준편차는 $\\sigma(\\overline{X})$이다. 표에서 $P(0\\le Z\\le1)=0.34$이다.\\n정석 풀이: $P(m\\le\\overline{X}\\le m+2)=0.34$이므로 표준화하면 $P\\left(0\\le Z\\le\\dfrac{2}{\\sigma(\\overline{X})}\\right)=0.34$이다. 표에서 이때의 표준화 값은 1이므로 $\\dfrac{2}{\\sigma(\\overline{X})}=1$이다. 따라서 $\\sigma(\\overline{X})=2$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 1] 두 사건 $A$, $B$에 대하여 $P(B\\mid A)=\\dfrac{2}{5}$, $P(A^c)=\\dfrac{1}{4}$일 때, $P(A\\cap B)$의 값을 구하는 과정을 서술하시오. (6점, 부분 점수 있음.)",
    "choices": [],
    "answer": "$\\dfrac{3}{10}$",
    "solution": "[키포인트] 조건부확률의 정의 $P(B\\mid A)=\\dfrac{P(A\\cap B)}{P(A)}$를 이용한다.\\n조건 정리: $P(A^c)=\\dfrac{1}{4}$이므로 $P(A)=1-\\dfrac{1}{4}=\\dfrac{3}{4}$이다.\\n정석 풀이: 조건부확률의 정의에 의해 $P(B\\mid A)=\\dfrac{P(A\\cap B)}{P(A)}$이다. 주어진 값 $P(B\\mid A)=\\dfrac{2}{5}$와 $P(A)=\\dfrac{3}{4}$를 대입하면 $P(A\\cap B)=P(A)P(B\\mid A)=\\dfrac{3}{4}\\cdot\\dfrac{2}{5}=\\dfrac{6}{20}=\\dfrac{3}{10}$이다.\\n따라서 구하는 값은 $\\dfrac{3}{10}$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "content": "[서술형 2] 표준편차가 $\\sigma$인 정규분포를 따르는 모집단에서 크기가 $n$인 표본을 임의 추출하여 추정한 모평균 $m$에 대한 신뢰도 95%의 신뢰구간이 $22.16\\le m\\le37.84$이다. 같은 표본을 이용하여 추정한 모평균 $m$의 신뢰도 99%의 신뢰구간을 구하는 과정을 서술하시오. (단, $P(|Z|\\le1.96)=0.95$, $P(|Z|\\le2.58)=0.99$) (7점, 부분 점수 있음.)",
    "choices": [],
    "answer": "$19.68\\le m\\le40.32$",
    "solution": "[키포인트] 같은 표본에서는 표준오차가 같으므로, 95% 신뢰구간의 반길이로 표준오차를 구한 뒤 99% 반길이를 계산한다.\\n조건 정리: 95% 신뢰구간의 중심은 $\\dfrac{22.16+37.84}{2}=30$이고 반길이는 $37.84-30=7.84$이다.\\n정석 풀이: 95% 신뢰구간에서 $1.96\\times\\text{표준오차}=7.84$이므로 표준오차는 $\\dfrac{7.84}{1.96}=4$이다. 신뢰도 99%에서는 $z=2.58$이므로 반길이는 $2.58\\times4=10.32$이다. 따라서 99% 신뢰구간은 $30-10.32\\le m\\le30+10.32$, 즉 $19.68\\le m\\le40.32$이다.\\n따라서 구하는 신뢰구간은 $19.68\\le m\\le40.32$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-06",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "표"
    ],
    "wide": false,
    "content": "[서술형 3] 상자 A에는 숫자 1, 2가 하나씩 적혀 있는 2개의 공이 들어 있고, 상자 B에는 숫자 3, 4, 5가 하나씩 적혀 있는 3개의 공이 들어 있다. 다음의 시행을 3번 반복하여 확인한 세 개의 수의 평균을 $\\overline{X}$라 하자. 표본평균 $\\overline{X}$의 평균과 분산을 구하는 과정을 서술하시오. (7점, 부분 점수 있음.)",
    "image": "assets/images/23_제일고_2학기_기말_고2_확률과통계/q23.png",
    "choices": [],
    "answer": "$E(\\overline{X})=\\dfrac{11}{4}$, $V(\\overline{X})=\\dfrac{97}{144}$",
    "solution": "[키포인트] 한 번의 시행에서 얻는 수의 평균과 분산을 먼저 구하고, 독립인 3번의 평균에 대한 성질을 이용한다.\\n조건 정리: 상자 A를 고를 확률은 $\\dfrac{1}{2}$이고 A에서 1, 2가 나올 확률은 각각 $\\dfrac{1}{2}$이므로 전체 확률은 각각 $\\dfrac{1}{4}$이다. 상자 B를 고를 확률은 $\\dfrac{1}{2}$이고 B에서 3, 4, 5가 나올 확률은 각각 $\\dfrac{1}{3}$이므로 전체 확률은 각각 $\\dfrac{1}{6}$이다.\\n정석 풀이: 한 번의 시행에서 얻는 값을 $X$라 하면 $E(X)=1\\cdot\\dfrac{1}{4}+2\\cdot\\dfrac{1}{4}+3\\cdot\\dfrac{1}{6}+4\\cdot\\dfrac{1}{6}+5\\cdot\\dfrac{1}{6}=\\dfrac{11}{4}$이다. 또한 $E(X^2)=1^2\\cdot\\dfrac{1}{4}+2^2\\cdot\\dfrac{1}{4}+3^2\\cdot\\dfrac{1}{6}+4^2\\cdot\\dfrac{1}{6}+5^2\\cdot\\dfrac{1}{6}=\\dfrac{115}{12}$이다. 따라서 $V(X)=E(X^2)-\\{E(X)\\}^2=\\dfrac{115}{12}-\\left(\\dfrac{11}{4}\\right)^2=\\dfrac{97}{48}$이다. 세 번의 독립시행의 평균 $\\overline{X}$에 대하여 $E(\\overline{X})=E(X)=\\dfrac{11}{4}$이고, $V(\\overline{X})=\\dfrac{V(X)}{3}=\\dfrac{97}{144}$이다.\\n따라서 구하는 값은 $E(\\overline{X})=\\dfrac{11}{4}$, $V(\\overline{X})=\\dfrac{97}{144}$이다."
  }
];
