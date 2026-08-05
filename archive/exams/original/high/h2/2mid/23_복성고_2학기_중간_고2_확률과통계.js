window.examTitle = "23_복성고_2학기_중간_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "확률의 곱셈정리",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "독립사건",
      "주사위",
      "동전"
    ],
    "wide": false,
    "content": "한 개의 주사위와 한 개의 동전을 동시에 던질 때, 주사위는 $3$의 배수의 눈이 나오고 동전은 앞면이 나올 확률을 구하시오. [3.9점]",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac13$",
      "$\\dfrac14$",
      "$\\dfrac15$",
      "$\\dfrac16$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 서로 영향을 주지 않는 두 시행에서 두 사건이 동시에 일어날 확률은 각 사건의 확률을 곱하여 구한다.\n조건 정리: 주사위의 눈은 $1,2,3,4,5,6$이고, 그중 $3$의 배수는 $3,6$의 $2$개이다. 동전의 앞면이 나올 확률은 $\\dfrac12$이다.\n풀이 방향: 주사위에서 $3$의 배수가 나올 확률과 동전에서 앞면이 나올 확률을 각각 구해 곱한다.\n정석 풀이: 주사위가 $3$의 배수의 눈이 나올 확률은 $\\dfrac26=\\dfrac13$이다. 주사위와 동전의 결과는 서로 독립이므로 구하는 확률은 $\\dfrac13\\times\\dfrac12=\\dfrac16$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 2,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조건부확률",
      "주사위"
    ],
    "wide": false,
    "content": "한 개의 주사위를 두 번 던질 때, 첫 번째 나온 수가 두 번째 나온 수보다 큰 사건을 $A$, 눈의 합이 짝수일 사건을 $B$라 할 때, $P(B\\mid A)$의 값을 구하시오. [4.1점]",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac13$",
      "$\\dfrac14$",
      "$\\dfrac25$",
      "$\\dfrac56$"
    ],
    "answer": "④",
    "solution": "[키포인트] 조건부확률은 조건을 만족하는 경우만 새로운 전체 경우로 보고 계산한다.\n조건 정리: 두 눈을 순서쌍 $(a,b)$로 나타내면 사건 $A$는 $a\\gt b$이고, 사건 $B$는 $a+b$가 짝수인 경우이다.\n풀이 방향: 사건 $A$의 경우의 수와 $A\\cap B$의 경우의 수를 각각 센다.\n정석 풀이: $a\\gt b$인 순서쌍은 서로 다른 두 눈을 골라 큰 수를 첫 번째에 놓는 경우이므로 $\\binom62=15$가지이다. 이 가운데 합이 짝수가 되려면 두 눈이 모두 홀수이거나 모두 짝수여야 한다. 모두 홀수인 경우는 $(3,1),(5,1),(5,3)$의 $3$가지이고, 모두 짝수인 경우는 $(4,2),(6,2),(6,4)$의 $3$가지이다. 따라서 $A\\cap B$는 $6$가지이므로 $P(B\\mid A)=\\dfrac6{15}=\\dfrac25$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "독립시행의 확률",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "독립시행",
      "동전"
    ],
    "wide": false,
    "content": "$5$개의 동전을 동시에 던질 때, 앞면이 $2$개 이하로 나올 확률을 구하시오. [4.3점]",
    "choices": [
      "$\\dfrac12$",
      "$\\dfrac13$",
      "$\\dfrac14$",
      "$\\dfrac15$",
      "$\\dfrac16$"
    ],
    "answer": "①",
    "solution": "[키포인트] 공정한 동전 $5$개의 앞면 개수 분포는 $2.5$를 중심으로 대칭이다.\n조건 정리: 앞면의 개수를 $X$라 하면 $X=0,1,2,3,4,5$이고 $P(X=k)=\\binom5k\\left(\\dfrac12\\right)^5$이다.\n풀이 방향: $X\\le2$와 $X\\ge3$의 확률이 대칭으로 같다는 점을 이용한다.\n정석 풀이: $\\binom5k=\\binom5{5-k}$이므로 $P(X=0)=P(X=5)$, $P(X=1)=P(X=4)$, $P(X=2)=P(X=3)$이다. 따라서 $P(X\\le2)=P(X\\ge3)$이고 두 사건은 서로 여사건이므로 각각의 확률은 $\\dfrac12$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "확률의 계산",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "순열",
      "중복순열",
      "생일"
    ],
    "wide": false,
    "content": "$1$년을 $365$일이라 할 때 그해에 $2$학년 $8$반 한 학급 학생 $21$명의 생일이 모두 서로 다를 확률을 구하시오. [4점]",
    "choices": [
      "$\\dfrac{344}{365}$",
      "$1-\\left(\\dfrac1{365}\\right)^{21}$",
      "$\\dfrac{21}{365!}$",
      "$\\dfrac{{}_{365}\\mathrm C_{21}}{{}_{365}\\mathrm P_{21}}$",
      "$\\dfrac{{}_{365}\\mathrm P_{21}}{{}_{365}\\Pi_{21}}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 전체 생일 배정은 중복을 허용하고, 생일이 모두 다른 경우는 중복을 허용하지 않는다.\n조건 정리: 학생 $21$명 각각의 생일은 $365$일 중 하나이다.\n풀이 방향: 전체 경우의 수와 생일이 모두 다른 경우의 수를 각각 구해 비를 취한다.\n정석 풀이: 전체 생일 배정의 경우의 수는 중복순열 ${}_{365}\\Pi_{21}=365^{21}$이다. 생일이 모두 다른 경우에는 $365$일 중 서로 다른 $21$일을 학생 순서에 맞게 배정하므로 경우의 수는 ${}_{365}\\mathrm P_{21}$이다. 따라서 구하는 확률은 $\\dfrac{{}_{365}\\mathrm P_{21}}{{}_{365}\\Pi_{21}}$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "여사건의 확률",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여사건",
      "조합",
      "공"
    ],
    "wide": false,
    "content": "흰 공이 $3$개, 검은 공이 $n$개가 들어 있는 주머니에서 $2$개의 공을 동시에 꺼낼 때, 검은 공이 적어도 하나 나올 확률은 $\\dfrac7{10}$이다. 이때, $n$의 값을 구하시오. [4.2점]",
    "choices": [
      "2",
      "3",
      "5",
      "7",
      "10"
    ],
    "answer": "①",
    "solution": "[키포인트] 검은 공이 적어도 하나 나오는 사건의 여사건은 흰 공만 $2$개 나오는 사건이다.\n조건 정리: 전체 공은 $n+3$개이고, 그중 흰 공은 $3$개이다.\n풀이 방향: 여사건의 확률로 방정식을 세운다.\n정석 풀이: 흰 공만 $2$개 나올 확률은 $\\dfrac{\\binom32}{\\binom{n+3}2}$이다. 따라서 $1-\\dfrac{\\binom32}{\\binom{n+3}2}=\\dfrac7{10}$이므로 $\\dfrac3{\\binom{n+3}2}=\\dfrac3{10}$이다. 이에 따라 $\\binom{n+3}2=10$이고 $\\dfrac{(n+3)(n+2)}2=10$이다. 자연수 $n$에 대하여 $(n+3)(n+2)=20$을 만족하는 값은 $n=2$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "조합을 이용한 확률",
    "originalCategory": "확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-03",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "조합",
      "이웃하지 않는 선택"
    ],
    "wide": false,
    "content": "순천 복성고등학교에서는 어느 해의 $1$월부터 $12$월까지의 $12$달에서 임의로 $3$개의 달을 택하여 자연 보호 활동을 하기로 하였다. $3$달 중에서 어느 두 달도 연속되지 않을 확률을 구하시오. [4.5점]",
    "choices": [
      "$\\dfrac35$",
      "$\\dfrac79$",
      "$\\dfrac6{11}$",
      "$\\dfrac34$",
      "$\\dfrac45$"
    ],
    "answer": "③",
    "solution": "[키포인트] $n$개 중 서로 이웃하지 않게 $r$개를 고르는 경우의 수는 $\\binom{n-r+1}{r}$이다.\n조건 정리: $12$달 중 $3$달을 순서 없이 택하며, 선택한 달 사이에 적어도 한 달씩 간격이 있어야 한다.\n풀이 방향: 전체 선택 수와 연속되지 않게 선택하는 경우의 수를 비교한다.\n정석 풀이: 전체 경우의 수는 $\\binom{12}3=220$이다. 서로 연속되지 않게 $3$달을 택하는 경우의 수는 $\\binom{12-3+1}3=\\binom{10}3=120$이다. 따라서 구하는 확률은 $\\dfrac{120}{220}=\\dfrac6{11}$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 7,
    "level": "하",
    "category": "확률변수의 분산",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "표",
      "확률분포",
      "분산",
      "일차변환"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q7.png",
    "content": "확률변수 $X$의 확률분포는 다음과 같다.\n확률변수 $7X$의 분산 $V(7X)$의 값을 구하시오. [4.5점]",
    "choices": [
      "14",
      "21",
      "28",
      "35",
      "42"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 $V(X)$를 구한 뒤 $V(aX)=a^2V(X)$를 적용한다.\n조건 정리: 표에서 $P(X=0)=\\dfrac27$, $P(X=1)=\\dfrac37$, $P(X=2)=\\dfrac27$이다.\n풀이 방향: $E(X)$와 $E(X^2)$을 계산하여 $V(X)=E(X^2)-\\{E(X)\\}^2$를 구한다.\n정석 풀이: $E(X)=0\\times\\dfrac27+1\\times\\dfrac37+2\\times\\dfrac27=1$이고, $E(X^2)=0^2\\times\\dfrac27+1^2\\times\\dfrac37+2^2\\times\\dfrac27=\\dfrac{11}7$이다. 따라서 $V(X)=\\dfrac{11}7-1^2=\\dfrac47$이고 $V(7X)=7^2V(X)=49\\times\\dfrac47=28$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "평균과 분산",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "평균",
      "분산",
      "자료의 결합"
    ],
    "wide": false,
    "content": "$\\displaystyle\\sum_{i=1}^{20}x_i=30$, $\\displaystyle\\sum_{i=1}^{20}x_i^2=100$, $\\displaystyle\\sum_{i=1}^{30}y_i=70$, $\\displaystyle\\sum_{i=1}^{30}y_i^2=150$일 때, $50$개의 변량 $x_1,x_2,x_3,\\ldots,x_{20},y_1,y_2,\\ldots,y_{30}$의 평균과 분산을 구하시오. [4.3점]",
    "choices": [
      "$m=2,\\ \\sigma^2=1$",
      "$m=3,\\ \\sigma^2=1$",
      "$m=4,\\ \\sigma^2=1$",
      "$m=2,\\ \\sigma^2=2$",
      "$m=2,\\ \\sigma^2=3$"
    ],
    "answer": "①",
    "solution": "[키포인트] 두 자료를 합치면 자료의 개수, 합, 제곱의 합을 각각 더하여 평균과 분산을 계산한다.\n조건 정리: 합친 자료는 $50$개이고 전체 합은 $30+70=100$, 제곱의 합은 $100+150=250$이다.\n풀이 방향: 평균 $m$과 제곱의 평균을 구한 뒤 $\\sigma^2=\\dfrac1N\\sum z_i^2-m^2$을 적용한다.\n정석 풀이: 평균은 $m=\\dfrac{100}{50}=2$이다. 제곱의 평균은 $\\dfrac{250}{50}=5$이므로 분산은 $\\sigma^2=5-2^2=1$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "이항분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이항분포",
      "평균",
      "표준편차"
    ],
    "wide": false,
    "content": "확률변수 $X$가 이항분포 $B(n,p)$를 따르고 $E(X)=20$, $\\sigma(X)=4$일 때, $B(n,p)$를 구하시오. [4.5점]",
    "choices": [
      "$B\\left(40,\\dfrac12\\right)$",
      "$B\\left(60,\\dfrac13\\right)$",
      "$B\\left(80,\\dfrac14\\right)$",
      "$B\\left(100,\\dfrac15\\right)$",
      "$B\\left(120,\\dfrac16\\right)$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포에서 $E(X)=np$, $V(X)=np(1-p)$이다.\n조건 정리: $E(X)=20$이고 $\\sigma(X)=4$이므로 $V(X)=16$이다.\n풀이 방향: 평균과 분산의 식을 나누어 $p$를 먼저 구한다.\n정석 풀이: $np=20$, $np(1-p)=16$이다. 두 식을 나누면 $1-p=\\dfrac{16}{20}=\\dfrac45$이므로 $p=\\dfrac15$이다. 이어서 $n=20\\div\\dfrac15=100$이다. 따라서 $B(n,p)=B\\left(100,\\dfrac15\\right)$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "확률변수의 평균",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "표",
      "확률분포",
      "평균"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q10.png",
    "content": "확률변수 $X$의 확률분포는 다음과 같다.\n확률변수 $5X+3$의 평균 $E(5X+3)$을 구하시오. [4.3점]",
    "choices": [
      "17",
      "18",
      "19",
      "20",
      "21"
    ],
    "answer": "①",
    "solution": "[키포인트] 확률의 총합으로 $p$를 구한 뒤 $E(aX+b)=aE(X)+b$를 이용한다.\n조건 정리: $X=1,2,3,4,5$일 확률은 차례로 $\\dfrac3{10},p,\\dfrac1{10},p,p$이다.\n풀이 방향: 확률의 합이 $1$이라는 조건과 평균의 선형성을 차례로 적용한다.\n정석 풀이: $\\dfrac3{10}+p+\\dfrac1{10}+p+p=1$에서 $3p=\\dfrac6{10}$이므로 $p=\\dfrac15$이다. 따라서 $E(X)=1\\times\\dfrac3{10}+2\\times\\dfrac15+3\\times\\dfrac1{10}+4\\times\\dfrac15+5\\times\\dfrac15=\\dfrac{14}5$이다. 그러므로 $E(5X+3)=5E(X)+3=5\\times\\dfrac{14}5+3=17$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "정규분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프",
      "정규분포",
      "평균",
      "표준편차"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q11.png",
    "content": "정규분포 $N(0,1)$을 따르는 확률변수 $X$의 확률밀도함수의 그래프는 실선으로, 정규분포 $N\\left(3,\\dfrac14\\right)$을 따르는 확률변수 $Y$의 확률밀도함수의 그래프는 점선으로 나타낼 때, 다음 중 두 그래프의 개형으로 옳은 것을 고르시오. [4점]",
    "choices": [
      "왼쪽 위 그래프",
      "오른쪽 위 그래프",
      "왼쪽 가운데 그래프",
      "오른쪽 가운데 그래프",
      "왼쪽 아래 그래프"
    ],
    "answer": "②",
    "solution": "[키포인트] 정규분포 곡선의 중심은 평균이고, 표준편차가 작을수록 곡선은 더 좁고 높아진다.\n조건 정리: 실선의 평균과 표준편차는 각각 $0,1$이고, 점선의 평균과 표준편차는 각각 $3,\\dfrac12$이다.\n풀이 방향: 점선이 실선보다 어느 쪽에 위치하는지와 폭·높이를 함께 비교한다.\n정석 풀이: 점선의 평균 $3$은 실선의 평균 $0$보다 크므로 점선의 중심은 실선의 중심보다 오른쪽에 있어야 한다. 또한 점선의 표준편차 $\\dfrac12$은 실선의 표준편차 $1$보다 작으므로 점선은 실선보다 폭이 좁고 꼭대기가 높아야 한다. 이 두 조건을 모두 만족하는 그래프는 ②이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 12,
    "level": "하",
    "category": "이항분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이항분포",
      "평균",
      "복원추출"
    ],
    "wide": false,
    "content": "주머니에 빨간 공, 파란 공 $100$개가 들어 있다. 이 주머니에서 임의로 공 $1$개를 꺼내어 색을 확인하고 주머니에 다시 넣는 시행을 $50$번 반복하였다. 빨간 공이 나오는 횟수의 평균이 $10$일 때, 파란 공의 개수를 구하시오. [3.9점]",
    "choices": [
      "90",
      "80",
      "60",
      "50",
      "25"
    ],
    "answer": "②",
    "solution": "[키포인트] 복원추출을 반복할 때 빨간 공이 나온 횟수는 이항분포를 따르며 평균은 $np$이다.\n조건 정리: 시행 횟수는 $50$이고 빨간 공이 나올 확률을 $p$라 하면 평균은 $50p=10$이다.\n풀이 방향: 빨간 공의 비율을 구하여 전체 $100$개 중 빨간 공과 파란 공의 개수를 계산한다.\n정석 풀이: $50p=10$에서 $p=\\dfrac15$이다. 따라서 빨간 공은 $100\\times\\dfrac15=20$개이고, 파란 공은 $100-20=80$개이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "정규분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "표",
      "정규분포",
      "표준화",
      "백분율"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q13.png",
    "content": "주봉이 농장에서 생산되는 사과의 무게는 평균이 $750$g, 표준편차가 $100$g인 정규분포를 따른다고 한다. 무게가 $850$g 이상인 사과를 최상품이라고 할 때, 이 농장에서 생산된 최상품 사과는 전체의 $a\\%$이다. 아래쪽 표준정규분포표를 이용하여 구한 $a$의 값을 구하시오. [4.5점]",
    "choices": [
      "34",
      "16",
      "13",
      "7",
      "3"
    ],
    "answer": "②",
    "solution": "[키포인트] 기준 무게를 표준화한 뒤 평균 오른쪽 꼬리 확률을 구한다.\n조건 정리: 사과의 무게 $X$는 $N(750,100^2)$을 따르고, 최상품은 $X\\ge850$인 경우이다.\n풀이 방향: $850$g의 표준점수를 구하고 표의 $P(0\\le Z\\le1)=0.3413$을 이용한다.\n정석 풀이: $850$g의 표준점수는 $z=\\dfrac{850-750}{100}=1$이다. 따라서 $P(X\\ge850)=P(Z\\ge1)=0.5-0.3413=0.1587$이다. 백분율로 나타내면 $15.87\\%$이므로 정수로 근사한 $a$의 값은 $16$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "정규분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "표",
      "정규분포",
      "평균",
      "분산",
      "표준화"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q14.png",
    "content": "확률변수 $X$가 정규분포 $N(m,\\sigma^2)$을 따르고 다음 조건을 만족시킨다.\n$P(X\\le68)$의 값을 아래쪽 표를 이용하여 구하시오. [5점]",
    "choices": [
      "0.9104",
      "0.9332",
      "0.9544",
      "0.9772",
      "0.9938"
    ],
    "answer": "④",
    "solution": "[키포인트] 정규분포의 대칭 조건으로 평균을 구하고, $E(X^2)=V(X)+\\{E(X)\\}^2$으로 분산을 구한다.\n조건 정리: $P(X\\ge64)=P(X\\le56)$이고 $E(X^2)=3616$이다.\n풀이 방향: 먼저 평균 $m$과 표준편차 $\\sigma$를 구한 뒤 $68$을 표준화한다.\n정석 풀이: 정규분포는 평균을 중심으로 대칭이므로 $64$와 $56$이 평균에서 같은 거리에 있다. 따라서 $m=\\dfrac{64+56}{2}=60$이다. 또 $3616=E(X^2)=V(X)+m^2=\\sigma^2+3600$이므로 $\\sigma^2=16$, $\\sigma=4$이다. $68=60+2\\sigma$이므로 표에서 $P(60\\le X\\le68)=0.4772$이다. 따라서 $P(X\\le68)=0.5+0.4772=0.9772$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 15,
    "level": "상",
    "category": "이항분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "표",
      "이항분포",
      "대칭성",
      "이차모멘트"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q15.png",
    "content": "이산확률변수 $X$가 다음 (가), (나) 조건을 모두 만족시킨다. 옳은 것만을 [보기]에서 고르시오. [5점]",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포의 평균과 분산으로 $n,p$를 구한 뒤 각 명제를 판정한다.\n조건 정리: $X\\sim B(n,p)$이고 $E(X)=30$, $V(X)=15$이다.\n풀이 방향: $np=30$, $np(1-p)=15$에서 $n,p$를 정하고 ㄱ, ㄴ, ㄷ을 확인한다.\n정석 풀이: 두 식을 나누면 $1-p=\\dfrac12$이므로 $p=\\dfrac12$이고, $n=60$이다. 따라서 $X\\sim B\\left(60,\\dfrac12\\right)$이다. ㄱ에서 $E(X^2)=V(X)+\\{E(X)\\}^2=15+30^2=915$이므로 거짓이다. ㄴ은 이항확률변수 $X$가 $0$부터 $60$까지의 값을 가지므로 확률의 총합이 $1$이어서 참이다. ㄷ은 $p=\\dfrac12$일 때 $P(X=k)=P(X=60-k)$이므로 $P(X=2)=P(X=58)$이어서 참이다. 따라서 옳은 것은 ㄴ, ㄷ이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "연속확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "그래프",
      "확률밀도함수",
      "넓이"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q16.png",
    "content": "확률변수 $X$가 갖는 값의 범위가 $-a\\le X\\le2a$이고, $X$의 확률밀도함수의 그래프는 오른쪽 그림과 같다. $P(0\\le X\\le a)$의 값을 구하시오. (단, $a\\gt0$) [5점]",
    "choices": [
      "$\\dfrac14$",
      "$\\dfrac13$",
      "$\\dfrac12$",
      "$\\dfrac23$",
      "$\\dfrac34$"
    ],
    "answer": "③",
    "solution": "[키포인트] 확률은 확률밀도함수 그래프 아래의 넓이이며, 전체 넓이는 $1$이다.\n조건 정리: 전체 그래프는 꼭짓점이 $(-a,0)$, $(0,a)$, $(2a,0)$인 삼각형이다.\n풀이 방향: 전체 삼각형 넓이와 $0\\le x\\le a$ 구간의 사다리꼴 넓이의 비를 구한다.\n정석 풀이: 전체 삼각형의 밑변은 $3a$, 높이는 $a$이므로 넓이는 $\\dfrac12\\times3a\\times a=\\dfrac32a^2$이다. $x=a$에서 높이는 직선의 선형성에 의해 $\\dfrac a2$이다. 따라서 $0\\le x\\le a$ 부분의 넓이는 평행한 두 변의 길이가 $a,\\dfrac a2$이고 폭이 $a$인 사다리꼴의 넓이이므로 $\\dfrac12\\left(a+\\dfrac a2\\right)a=\\dfrac34a^2$이다. 확률은 전체 넓이에 대한 비와 같으므로 $P(0\\le X\\le a)=\\dfrac{(3/4)a^2}{(3/2)a^2}=\\dfrac12$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "확률변수의 평균",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "비복원추출",
      "평균",
      "공"
    ],
    "wide": false,
    "content": "흰 공 $6$개와 검은 공 $2$개가 들어 있는 주머니에서 임의로 $3$개의 공을 동시에 꺼낼 때, 나온 흰 공의 개수를 $X$라 한다. 이때, $X$의 평균은? [5점]",
    "choices": [
      "$\\dfrac{13}{4}$개",
      "$\\dfrac94$개",
      "$\\dfrac54$개",
      "$\\dfrac74$개",
      "$\\dfrac14$개"
    ],
    "answer": "②",
    "solution": "[키포인트] 비복원추출에서 특정 종류가 뽑힌 개수의 평균은 표본의 크기와 전체 중 해당 종류의 비율의 곱이다.\n조건 정리: 전체 공은 $8$개이고 그중 흰 공은 $6$개이며, 동시에 $3$개를 뽑는다.\n풀이 방향: 각 추출 위치에서 흰 공이 나오는지 나타내는 지시변수를 이용한다.\n정석 풀이: 세 추출 위치에서 흰 공이 나올 확률은 각각 $\\dfrac68$이다. 선형성에 의해 흰 공 개수의 평균은 $E(X)=3\\times\\dfrac68=\\dfrac{18}8=\\dfrac94$개이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 18,
    "level": "중",
    "category": "정규분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정규분포",
      "표준화",
      "확률의 일치"
    ],
    "wide": false,
    "content": "주봉이 과수원에서 생산하는 사과의 무게는 평균이 $86$, 표준편차가 $15$인 정규분포를 따르고, 양현이 과수원에서 생산하는 사과의 무게는 평균이 $88$, 표준편차가 $10$인 정규분포를 따른다고 한다. 주봉이 과수원에서 임의로 선택한 사과의 무게가 $98$ 이하일 확률과 양현이 과수원에서 임의로 선택한 사과의 무게가 $a$ 이하일 확률이 같을 때, $a$의 값을 구하시오. (단, 사과의 무게의 단위는 g이다.) [5점]",
    "choices": [
      "82",
      "86",
      "90",
      "94",
      "96"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 서로 다른 정규분포에서 누적확률이 같으면 대응하는 표준점수가 같다.\n조건 정리: 첫 사과 무게를 $X\\sim N(86,15^2)$, 둘째 사과 무게를 $Y\\sim N(88,10^2)$라 한다.\n풀이 방향: $X=98$의 표준점수와 $Y=a$의 표준점수를 같게 놓는다.\n정석 풀이: $X=98$의 표준점수는 $\\dfrac{98-86}{15}=\\dfrac{12}{15}=0.8$이다. 누적확률이 같으려면 $\\dfrac{a-88}{10}=0.8$이어야 한다. 따라서 $a-88=8$이므로 $a=96$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "이항분포의 정규근사",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "표",
      "이항분포",
      "정규근사",
      "표준화"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q19.png",
    "content": "[서술형 1] $\\displaystyle\\sum_{k=351}^{369}{}_{400}\\mathrm C_k\\left(\\dfrac9{10}\\right)^k\\left(\\dfrac1{10}\\right)^{400-k}$의 값을 아래쪽 표준정규분포표를 이용하고 표준정규분포곡선을 그려서 구하시오. [10점]",
    "choices": [],
    "answer": "$0.8664$",
    "solution": "[키포인트] 주어진 합을 이항확률변수의 구간확률로 해석한 뒤 정규분포로 근사한다.\n조건 정리: $X\\sim B\\left(400,\\dfrac9{10}\\right)$라 하면 주어진 합은 $P(351\\le X\\le369)$이다.\n풀이 방향: $X$의 평균과 표준편차를 구하고 두 경계값을 표준화하여 표준정규분포곡선에서 중앙 구간을 표시한다.\n정석 풀이: $E(X)=400\\times\\dfrac9{10}=360$이고 $V(X)=400\\times\\dfrac9{10}\\times\\dfrac1{10}=36$이므로 $\\sigma(X)=6$이다. 따라서 $X$를 $N(360,6^2)$으로 근사한다. $351$과 $369$의 표준점수는 각각 $-1.5$, $1.5$이다. 표준정규분포곡선에서 $-1.5\\le Z\\le1.5$인 중앙 부분을 표시하면, 표에서 $P(0\\le Z\\le1.5)=0.4332$이므로 $P(-1.5\\le Z\\le1.5)=2\\times0.4332=0.8664$이다.\n따라서 구하는 값은 $0.8664$이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "정규분포의 활용",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "서술형",
      "표",
      "정규분포",
      "표준화",
      "등수",
      "백분위"
    ],
    "wide": false,
    "image": "assets/images/23_복성고_2학기_중간_고2_확률과통계/q20.png",
    "content": "[서술형 2] 중간고사 시험에서 수학 성적이 평균 $70$점, 표준편차 $10$점인 정규분포를 따를 때, 아래쪽 표준정규분포표를 이용하고 표준정규분포곡선을 그려서 구하시오.\n(1) 수험생이 $1000$명이면 $90$점 받은 학생은 약 몇 등인가? [5점]\n(2) 수험생이 $500$명이면 $100$등인 학생은 약 몇 점인가? [5점]",
    "choices": [],
    "answer": "(1) 약 $20$등, (2) 약 $78.4$점",
    "solution": "[키포인트] 등수는 오른쪽 꼬리확률로, 특정 등수의 점수는 상위 비율에 해당하는 표준점수로 구한다.\n조건 정리: 시험 점수 $X$는 $N(70,10^2)$을 따른다.\n풀이 방향: (1)은 $90$점보다 높은 비율을 구하고, (2)는 상위 $20\\%$에 해당하는 표준점수를 표에서 찾는다.\n정석 풀이: (1) $90$점의 표준점수는 $z=\\dfrac{90-70}{10}=2$이다. 표준정규분포곡선에서 $z=2$ 오른쪽 부분을 표시하면, 표에서 $P(0\\le Z\\le2)=0.48$이므로 $P(Z\\ge2)=0.5-0.48=0.02$이다. 따라서 $1000\\times0.02=20$명이 $90$점 이상에 해당하므로 약 $20$등이다.\n(2) $500$명 중 $100$등은 상위 $\\dfrac{100}{500}=0.20$에 해당한다. 표준정규분포곡선에서 오른쪽 꼬리넓이가 $0.20$이면 $P(0\\le Z\\le z)=0.30$이고, 표에서 $z=0.84$이다. 따라서 점수는 $70+10\\times0.84=78.4$점이다.\n따라서 구하는 값은 (1) 약 $20$등, (2) 약 $78.4$점이다."
  }
];
