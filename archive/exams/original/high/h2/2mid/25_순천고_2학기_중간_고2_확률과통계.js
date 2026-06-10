window.examTitle = "25_순천고_2학기_중간_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
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
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$가 이항분포 $B(100, \\dfrac{3}{5})$를 따를 때, $V(-2X+4)$의 값은?",
    "choices": [
      "$-96$",
      "$-48$",
      "$48$",
      "$96$",
      "$100$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포의 분산과 선형변환의 분산 공식을 함께 사용한다.\n조건 정리: $X\\sim B(100,\\dfrac{3}{5})$이므로 $n=100$, $p=\\dfrac{3}{5}$이다.\n풀이 방향: 먼저 $V(X)=np(1-p)$를 구하고, $V(aX+b)=a^2V(X)$를 적용한다.\n정석 풀이: $V(X)=100\\cdot\\dfrac{3}{5}\\cdot\\dfrac{2}{5}=24$이다. 따라서 $V(-2X+4)=(-2)^2V(X)=4\\cdot24=96$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 2,
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
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$에 대하여 $E(X)=7$, $V(X)=2$이고, 확률변수 $Y=aX+b$에 대하여 $E(Y)=0$, $V(Y)=2$이다. 이때 상수 $a$, $b$에 대하여 $ab$의 값은?",
    "choices": [
      "$-3$",
      "$-4$",
      "$-5$",
      "$-6$",
      "$-7$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 선형변환에서 평균은 $E(aX+b)=aE(X)+b$, 분산은 $V(aX+b)=a^2V(X)$이다.\n조건 정리: $E(X)=7$, $V(X)=2$, $E(Y)=0$, $V(Y)=2$이고 $Y=aX+b$이다.\n풀이 방향: 분산 조건으로 $a^2$를 먼저 구하고, 평균 조건으로 $b$를 구한다.\n정석 풀이: $V(Y)=V(aX+b)=a^2V(X)=2a^2$이다. 그런데 $V(Y)=2$이므로 $2a^2=2$, 즉 $a^2=1$이다. 또 $E(Y)=aE(X)+b=7a+b=0$이므로 $b=-7a$이다. 따라서 $ab=a(-7a)=-7a^2=-7$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 3,
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
      "기출",
      "도형"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같이 정육면체 두 개가 붙어 있다. 모서리를 따라 $A$지점에서 $L$지점으로 가는 최단 경로 중 $C$지점을 통과할 확률은?",
    "image": "assets/images/25_순천고_2학기_중간_고2_확률과통계/q3.png",
    "choices": [
      "$\\dfrac{1}{6}$",
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{3}$",
      "$\\dfrac{2}{5}$",
      "$\\dfrac{2}{3}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 최단 경로는 필요한 방향 이동의 순서를 배열하는 문제로 볼 수 있다.\n조건 정리: $A$에서 $L$까지는 가로 방향으로 $2$번, 깊이 방향으로 $1$번, 높이 방향으로 $1$번 이동해야 한다.\n풀이 방향: 전체 최단 경로 수와 $C$를 지나는 최단 경로 수를 각각 센다.\n정석 풀이: 전체 최단 경로 수는 네 번의 이동 중 같은 방향 이동 $2$번을 포함하므로 $\\dfrac{4!}{2!}=12$가지이다. $C$를 지나려면 $A$에서 $C$까지 가로 $1$번과 깊이 $1$번을 이동하므로 $2$가지이고, $C$에서 $L$까지 가로 $1$번과 높이 $1$번을 이동하므로 $2$가지이다. 따라서 $C$를 지나는 최단 경로 수는 $2\\cdot2=4$가지이다. 구하는 확률은 $\\dfrac{4}{12}=\\dfrac{1}{3}$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 4,
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
      "기출"
    ],
    "wide": false,
    "content": "한 개의 동전을 $8$번 던질 때, 앞면이 나오는 횟수를 $A$라 한다. $t$에 관한 이차방정식 $t^2-2(A-1)t+4A-4=0$이 중근을 갖게 될 확률은?",
    "choices": [
      "$\\dfrac{1}{8}$",
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{2}$",
      "$\\dfrac{2}{7}$",
      "$\\dfrac{2}{5}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 이차방정식이 중근을 가지려면 판별식이 $0$이어야 한다.\n조건 정리: $A$는 동전을 $8$번 던질 때 앞면이 나오는 횟수이므로 $A\\sim B(8,\\dfrac{1}{2})$이다.\n풀이 방향: 판별식 조건으로 가능한 $A$의 값을 구한 뒤 이항분포 확률을 계산한다.\n정석 풀이: 판별식은 $\\{-2(A-1)\\}^2-4(4A-4)=4(A-1)^2-16(A-1)=4(A-1)(A-5)$이다. 중근 조건은 $4(A-1)(A-5)=0$이므로 $A=1$ 또는 $A=5$이다. 따라서 구하는 확률은 $\\dfrac{{}_8C_1+{}_8C_5}{2^8}=\\dfrac{8+56}{256}=\\dfrac{1}{4}$이다.\n따라서 정답은 ②이다."
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "집에서 학교까지의 통학 시간을 $X$분이라고 하면 확률변수 $X$는 정규분포 $N(30,5^2)$을 따른다고 한다. 수업 시작 $40$분 전에 집에서 출발할 때, 지각할 확률을 오른쪽 표준정규분포표를 이용하여 구하면?<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr><tr><td>$2.5$</td><td>$0.4938$</td></tr></tbody></table>",
    "choices": [
      "$0.0062$",
      "$0.0228$",
      "$0.0668$",
      "$0.9332$",
      "$0.9772$"
    ],
    "answer": "②",
    "solution": "[키포인트] 지각은 통학 시간이 $40$분을 초과하는 사건이다.\n조건 정리: $X\\sim N(30,5^2)$이고 구하는 확률은 $P(X>40)$이다.\n풀이 방향: $Z=\\dfrac{X-30}{5}$로 표준화한다.\n정석 풀이: $X=40$일 때 $Z=\\dfrac{40-30}{5}=2$이다. 따라서 $P(X>40)=P(Z>2)$이다. 표에서 $P(0\\le Z\\le2)=0.4772$이므로 $P(Z>2)=0.5-0.4772=0.0228$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 6,
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
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(m,\\sigma^2)$을 따를 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은?<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">ㄱ. $P(m-\\sigma\\le X\\le m+\\sigma)=2P(m-\\sigma\\le X\\le m)$<br>ㄴ. 확률변수 $X$의 정규분포 곡선은 직선 $x=m$에 대하여 대칭이다.<br>ㄷ. 확률변수 $\\dfrac{X-m}{\\sigma}$은 표준정규분포 $N(0,1)$을 따른다.</div>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 정규분포는 평균을 중심으로 대칭이고, 표준화하면 표준정규분포가 된다.\n조건 정리: $X\\sim N(m,\\sigma^2)$이다.\n풀이 방향: 각 보기의 정규분포 성질을 하나씩 확인한다.\n정석 풀이: ㄱ은 평균 $m$을 중심으로 좌우가 대칭이므로 $m-\\sigma$부터 $m+\\sigma$까지의 확률은 왼쪽 절반의 두 배이다. ㄴ은 정규분포 곡선의 대칭축이 $x=m$이므로 참이다. ㄷ은 표준화한 확률변수 $\\dfrac{X-m}{\\sigma}$가 표준정규분포 $N(0,1)$을 따르므로 참이다. 따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 7,
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
      "기출"
    ],
    "wide": false,
    "content": "윷가락 한 개를 던질 때 평평한 면이 나올 확률은 $\\dfrac{3}{5}$이라고 한다. 윷가락 네 개를 동시에 던지는 시행을 $250$번 반복할 때, 평평한 면이 $2$번 나오는 횟수를 확률변수 $X$라고 하자. 이때 $E(X)$의 값은?",
    "choices": [
      "$\\dfrac{214}{5}$",
      "$\\dfrac{216}{5}$",
      "$\\dfrac{432}{5}$",
      "$47$",
      "$\\dfrac{864}{5}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 한 번의 시행에서 평평한 면이 정확히 $2$번 나올 확률을 먼저 구한다.\n조건 정리: 윷가락 하나에서 평평한 면이 나올 확률은 $\\dfrac{3}{5}$이고, 한 시행에서는 윷가락 $4$개를 던진다.\n풀이 방향: 한 시행의 성공확률을 구한 뒤 $250$번 반복한 이항분포의 평균을 구한다.\n정석 풀이: 한 시행에서 평평한 면이 정확히 $2$번 나올 확률은 ${}_4C_2\\left(\\dfrac{3}{5}\\right)^2\\left(\\dfrac{2}{5}\\right)^2=6\\cdot\\dfrac{9}{25}\\cdot\\dfrac{4}{25}=\\dfrac{216}{625}$이다. 따라서 $X\\sim B(250,\\dfrac{216}{625})$이고, $E(X)=250\\cdot\\dfrac{216}{625}=\\dfrac{432}{5}$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "이산확률변수 $X$의 확률분포를 표로 나타내면 다음과 같다. 다섯 개의 수 $a,b,c,d,e$가 이 순서대로 등차수열을 이루고 $E(X)=3$일 때, $V(X)$의 값은?<br><table class=\"question-table\"><thead><tr><th>$X$</th><th>$0$</th><th>$1$</th><th>$2$</th><th>$3$</th><th>$4$</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$a$</td><td>$b$</td><td>$c$</td><td>$d$</td><td>$e$</td><td>$1$</td></tr></tbody></table>",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "[키포인트] 확률들이 등차수열을 이루므로 첫째항과 공차로 두 조건을 세운다.\n조건 정리: 확률을 $a,a+r,a+2r,a+3r,a+4r$로 둘 수 있고, 확률의 합은 $1$, 평균은 $3$이다.\n풀이 방향: 확률의 합과 평균 조건으로 확률분포를 구한 뒤 분산을 계산한다.\n정석 풀이: 확률의 합에서 $5a+10r=1$이다. 평균 조건에서 $(a+r)+2(a+2r)+3(a+3r)+4(a+4r)=10a+30r=3$이다. 첫 식에서 $a=\\dfrac{1}{5}-2r$이고, 이를 평균 식에 대입하면 $2+10r=3$이므로 $r=\\dfrac{1}{10}$, $a=0$이다. 따라서 확률은 $0,\\dfrac{1}{10},\\dfrac{2}{10},\\dfrac{3}{10},\\dfrac{4}{10}$이다. $E(X^2)=1^2\\cdot\\dfrac{1}{10}+2^2\\cdot\\dfrac{2}{10}+3^2\\cdot\\dfrac{3}{10}+4^2\\cdot\\dfrac{4}{10}=10$이므로 $V(X)=10-3^2=1$이다.\n따라서 정답은 ①이다."
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
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "한 개의 주사위를 두 번 던져서 나오는 눈의 수를 차례로 $a,b$라 할 때, $|a-3|+|b-2|=3$이거나 $a=b$일 확률은?",
    "choices": [
      "$\\dfrac{2}{9}$",
      "$\\dfrac{1}{4}$",
      "$\\dfrac{5}{18}$",
      "$\\dfrac{11}{36}$",
      "$\\dfrac{1}{3}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 사건의 합집합 확률은 각 사건의 경우 수를 세고 교집합을 빼서 구한다.\n조건 정리: 전체 경우의 수는 $6\\cdot6=36$이다.\n풀이 방향: $|a-3|+|b-2|=3$인 경우, $a=b$인 경우, 두 조건을 동시에 만족하는 경우를 각각 센다.\n정석 풀이: $|a-3|+|b-2|=3$인 경우는 $8$가지이다. 또 $a=b$인 경우는 $6$가지이다. 두 조건을 동시에 만족하는 경우는 $(1,1)$, $(4,4)$의 $2$가지이다. 따라서 원하는 경우의 수는 $8+6-2=12$가지이고, 확률은 $\\dfrac{12}{36}=\\dfrac{1}{3}$이다.\n따라서 정답은 ⑤이다."
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
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "식문화 체험의 날에 어느 고등학교 전체 학생을 대상으로 점심과 저녁 식사를 제공하였다. 모든 학생들은 매 식사 때마다 양식과 한식 중 하나를 반드시 선택하였고, 전체 학생의 $40\\%$가 점심에 한식을 선택하였다. 점심에 양식을 선택한 학생의 $30\\%$는 저녁에도 양식을 선택하였고, 점심에 한식을 선택한 학생의 $60\\%$는 저녁에도 한식을 선택하였다. 이 고등학교 학생 중에서 임의로 선택한 한 명이 저녁에 양식을 선택한 학생일 때, 이 학생이 점심에 한식을 선택했을 확률은 $\\dfrac{q}{p}$이다. $p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.)",
    "choices": [
      "$25$",
      "$26$",
      "$50$",
      "$51$",
      "$52$"
    ],
    "answer": "①",
    "solution": "[키포인트] 조건부확률은 조건에 해당하는 전체 경우와 그중 원하는 경우를 구분한다.\n조건 정리: 점심에 한식을 선택한 비율은 $0.4$, 점심에 양식을 선택한 비율은 $0.6$이다. 점심 한식 학생이 저녁 양식을 선택할 확률은 $0.4$이다.\n풀이 방향: 저녁 양식을 선택한 학생 중 점심 한식을 선택한 학생의 비율을 구한다.\n정석 풀이: 점심 양식이면서 저녁 양식인 비율은 $0.6\\cdot0.3=0.18$이다. 점심 한식이면서 저녁 양식인 비율은 $0.4\\cdot0.4=0.16$이다. 따라서 저녁 양식 전체 비율은 $0.18+0.16=0.34$이다. 구하는 조건부확률은 $\\dfrac{0.16}{0.34}=\\dfrac{16}{34}=\\dfrac{8}{17}$이다. 그러므로 $p=17$, $q=8$이고 $p+q=25$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 11,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$가 평균이 $m$, 표준편차가 $2$인 정규분포를 따르고 $P(X\\le5)=0.0228$일 때, $P(4\\le X\\le11)$의 값을 오른쪽 표준정규분포표를 이용하여 구하면?<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr><tr><td>$2.5$</td><td>$0.4938$</td></tr></tbody></table>",
    "choices": [
      "$0.6826$",
      "$0.7745$",
      "$0.8185$",
      "$0.8351$",
      "$0.9104$"
    ],
    "answer": "④",
    "solution": "[키포인트] 먼저 $P(X\\le5)=0.0228$ 조건으로 평균 $m$을 찾는다.\n조건 정리: 표준편차는 $2$이고, $P(X\\le5)=0.0228$이다.\n풀이 방향: $0.0228=0.5-0.4772$이므로 표준점수 $-2$를 이용한다.\n정석 풀이: $P(X\\le5)=0.0228$이므로 $\\dfrac{5-m}{2}=-2$이다. 따라서 $m=9$이다. 이제 $X=4$일 때 $Z=\\dfrac{4-9}{2}=-2.5$, $X=11$일 때 $Z=\\dfrac{11-9}{2}=1$이다. 따라서 $P(4\\le X\\le11)=P(-2.5\\le Z\\le1)=0.4938+0.3413=0.8351$이다.\n따라서 정답은 ④이다."
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
      "기출",
      "그래프"
    ],
    "wide": false,
    "content": "연속확률변수 $X$가 갖는 값의 범위는 $0\\le X\\le b$이고, $X$의 확률밀도함수의 그래프가 그림과 같다. $\\dfrac{P(X\\ge a)}{P(X\\le a)}=\\dfrac{6}{7}$일 때, $2(a+b)$의 값은?",
    "image": "assets/images/25_순천고_2학기_중간_고2_확률과통계/q12.png",
    "choices": [
      "$15$",
      "$20$",
      "$25$",
      "$30$",
      "$35$"
    ],
    "answer": "②",
    "solution": "[키포인트] 확률밀도함수 그래프 아래 넓이의 비가 확률의 비이다.\n조건 정리: $P(X\\le a)$는 왼쪽 삼각형의 넓이, $P(X\\ge a)$는 오른쪽 삼각형의 넓이이다.\n풀이 방향: 두 넓이의 비가 $7:6$이고 전체 넓이가 $1$임을 이용한다.\n정석 풀이: $\\dfrac{P(X\\ge a)}{P(X\\le a)}=\\dfrac{6}{7}$이므로 $P(X\\le a)=\\dfrac{7}{13}$, $P(X\\ge a)=\\dfrac{6}{13}$이다. 왼쪽 넓이는 $\\dfrac{1}{2}\\cdot a\\cdot\\dfrac{4}{13}=\\dfrac{2a}{13}$이므로 $\\dfrac{2a}{13}=\\dfrac{7}{13}$, 따라서 $a=\\dfrac{7}{2}$이다. 오른쪽 넓이는 $\\dfrac{1}{2}(b-a)\\cdot\\dfrac{2}{b}=\\dfrac{b-a}{b}=\\dfrac{6}{13}$이다. 따라서 $\\dfrac{a}{b}=\\dfrac{7}{13}$이고 $b=\\dfrac{13}{2}$이다. 그러므로 $2(a+b)=2\\left(\\dfrac{7}{2}+\\dfrac{13}{2}\\right)=20$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 13,
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
      "기출"
    ],
    "wide": false,
    "content": "숫자 $0,1,2,3,4,5$ 중에서 서로 다른 $4$개를 택해 일렬로 나열하여 만들 수 있는 모든 네 자리의 자연수 중에서 임의로 하나를 택할 때, 택한 수가 $5$의 배수 또는 $3500$ 이상일 확률은?",
    "choices": [
      "$\\dfrac{16}{25}$",
      "$\\dfrac{33}{50}$",
      "$\\dfrac{67}{100}$",
      "$\\dfrac{17}{25}$",
      "$\\dfrac{18}{25}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 전체 네 자리 수에서 $5$의 배수인 경우와 $3500$ 이상인 경우의 합집합을 센다.\n조건 정리: 사용할 수 있는 숫자는 $0,1,2,3,4,5$이고 서로 다른 $4$개를 사용한다.\n풀이 방향: 전체 경우, $5$의 배수, $3500$ 이상, 두 조건의 교집합을 차례로 센다.\n정석 풀이: 전체 네 자리 자연수는 첫 자리에 $0$을 쓸 수 없으므로 $5\\cdot{}_5P_3=300$개이다. $5$의 배수는 끝자리가 $0$인 경우 $60$개, 끝자리가 $5$인 경우 $48$개로 모두 $108$개이다. $3500$ 이상인 수는 첫 자리가 $4$ 또는 $5$인 경우 $120$개, 첫 자리가 $3$이고 둘째 자리가 $5$인 경우 $12$개로 모두 $132$개이다. 두 조건을 동시에 만족하는 수는 $39$개이다. 따라서 원하는 경우의 수는 $108+132-39=201$개이고, 확률은 $\\dfrac{201}{300}=\\dfrac{67}{100}$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 14,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "두 확률변수 $X$, $Y$에 대하여 $Y=\\dfrac{1}{6}X-1$일 때, 확률변수 $Y$의 확률분포가 다음 표와 같다. 확률변수 $X^2$의 평균은?<br><table class=\"question-table\"><thead><tr><th>$Y$</th><th>$0$</th><th>$1$</th><th>$2$</th><th>$3$</th><th>합계</th></tr></thead><tbody><tr><td>$P(Y=y)$</td><td>$\\dfrac{11}{24}$</td><td>$\\dfrac{1}{4}$</td><td>$\\dfrac{1}{8}$</td><td>$\\dfrac{1}{6}$</td><td>$1$</td></tr></tbody></table>",
    "choices": [
      "$161$",
      "$168$",
      "$175$",
      "$182$",
      "$189$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] $Y=\\dfrac{1}{6}X-1$에서 $X=6(Y+1)$로 바꾼다.\n조건 정리: $X^2=36(Y+1)^2$이다.\n풀이 방향: $E(X^2)=36E((Y+1)^2)$를 확률분포표로 계산한다.\n정석 풀이: $E((Y+1)^2)=1^2\\cdot\\dfrac{11}{24}+2^2\\cdot\\dfrac{1}{4}+3^2\\cdot\\dfrac{1}{8}+4^2\\cdot\\dfrac{1}{6}$이다. 이를 계산하면 $\\dfrac{11}{24}+1+\\dfrac{9}{8}+\\dfrac{8}{3}=\\dfrac{126}{24}=\\dfrac{21}{4}$이다. 따라서 $E(X^2)=36\\cdot\\dfrac{21}{4}=189$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 15,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "서로 다른 주사위 $2$개를 동시에 던질 때, 나온 두 눈의 수의 곱이 홀수이면 수직선 위에서 오른쪽으로 $3$칸, 짝수이면 왼쪽으로 $1$칸 움직인다고 한다. 원점에서 출발하여 이 시행을 $48$번 반복할 때, 위치가 $-8$ 이상일 확률을 위의 표준정규분포표를 이용하여 구하면?<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>$\\dfrac{1}{3}$</td><td>$0.1293$</td></tr><tr><td>$\\dfrac{2}{3}$</td><td>$0.2454$</td></tr><tr><td>$\\dfrac{4}{3}$</td><td>$0.4082$</td></tr></tbody></table>",
    "choices": [
      "$0.2454$",
      "$0.4082$",
      "$0.6293$",
      "$0.7454$",
      "$0.9082$"
    ],
    "answer": "④",
    "solution": "[키포인트] 한 번 시행의 이동량의 평균과 분산을 구한 뒤 정규분포로 근사한다.\n조건 정리: 두 눈의 곱이 홀수일 확률은 두 주사위가 모두 홀수일 확률이므로 $\\dfrac{1}{4}$이다.\n풀이 방향: 한 번의 이동량을 $Y$라 두고 $48$번 합의 평균과 표준편차를 구한다.\n정석 풀이: $Y=3$일 확률은 $\\dfrac{1}{4}$, $Y=-1$일 확률은 $\\dfrac{3}{4}$이다. 따라서 $E(Y)=3\\cdot\\dfrac{1}{4}+(-1)\\cdot\\dfrac{3}{4}=0$이고, $E(Y^2)=9\\cdot\\dfrac{1}{4}+1\\cdot\\dfrac{3}{4}=3$이므로 $V(Y)=3$이다. $48$번 후 위치 $S$는 평균 $0$, 분산 $48\\cdot3=144$, 표준편차 $12$이다. $P(S\\ge-8)=P\\left(Z\\ge-\\dfrac{8}{12}\\right)=P(Z\\ge-\\dfrac{2}{3})=0.5+0.2454=0.7454$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "그래프"
    ],
    "wide": false,
    "content": "두 연속확률변수 $X$와 $Y$가 갖는 값의 범위는 $0\\le X\\le10$, $0\\le Y\\le10$이고, $X$와 $Y$의 확률밀도함수는 각각 $f(x)$, $g(x)$이다. 확률변수 $X$의 확률밀도함수 $f(x)$의 그래프는 그림과 같다. $0\\le x\\le10$인 모든 $x$에 대하여 $f(x)-f(10-x)=g(10-x)-g(x)$를 만족시킬 때, $P(0\\le Y\\le5)$의 값은? (단, $k$는 상수이다.)",
    "image": "assets/images/25_순천고_2학기_중간_고2_확률과통계/q16.png",
    "choices": [
      "$\\dfrac{1}{3}$",
      "$\\dfrac{2}{5}$",
      "$\\dfrac{7}{15}$",
      "$\\dfrac{8}{15}$",
      "$\\dfrac{3}{5}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 주어진 식은 $f(x)+g(x)$가 $x=5$를 기준으로 대칭임을 뜻한다.\n조건 정리: $f(x)-f(10-x)=g(10-x)-g(x)$이므로 $f(x)+g(x)=f(10-x)+g(10-x)$이다.\n풀이 방향: $f+g$의 전체 넓이는 $2$이고 대칭이므로 $0$부터 $5$까지의 넓이가 $1$임을 이용한다.\n정석 풀이: 먼저 $f(x)$의 전체 넓이가 $1$이어야 한다. 그래프에서 넓이는 왼쪽 삼각형 $\\dfrac{k}{2}$, 가운데 직사각형 $5k$, 오른쪽 삼각형 $2k$의 합이므로 $\\dfrac{k}{2}+5k+2k=\\dfrac{15}{2}k=1$이다. 따라서 $k=\\dfrac{2}{15}$이다. $0\\le x\\le5$에서 $f$의 넓이는 $\\dfrac{k}{2}+4k=\\dfrac{9}{2}k=\\dfrac{3}{5}$이다. 한편 $f(x)+g(x)$는 $x=5$를 기준으로 대칭이고 전체 넓이가 $2$이므로 $0$부터 $5$까지의 넓이는 $1$이다. 따라서 $P(0\\le Y\\le5)=\\int_0^5g(x)dx=1-\\int_0^5f(x)dx=1-\\dfrac{3}{5}=\\dfrac{2}{5}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "상",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-04",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "하나의 주머니와 두 상자 $A$, $B$가 있다. 주머니에는 숫자 $1,2,3,4$가 하나씩 적힌 $4$장의 카드가 들어 있고, 상자 $A$에는 흰 공과 검은 공이 각각 $10$개 이상 들어 있고, 상자 $B$는 비어 있다. 이 주머니와 두 상자 $A$, $B$를 사용하여 다음 시행을 한다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">주머니에서 임의로 한 장의 카드를 꺼내어 카드에 적힌 수를 확인한 후 다시 주머니에 넣는다.<br>확인한 수가 $1$이면 상자 $A$에 있는 흰 공 $1$개를 상자 $B$에 넣고,<br>확인한 수가 $2$ 또는 $3$이면 상자 $A$에 있는 흰 공 $1$개와 검은 공 $1$개를 상자 $B$에 넣고,<br>확인한 수가 $4$이면 상자 $A$에 있는 흰 공 $2$개와 검은 공 $1$개를 상자 $B$에 넣는다.</div>이 시행을 $5$번 반복한 후 상자 $B$에 들어 있는 공의 개수가 $10$개일 때, 상자 $B$에 들어 있는 흰 공의 개수가 $7$일 확률은?",
    "choices": [
      "$\\dfrac{5}{21}$",
      "$\\dfrac{2}{7}$",
      "$\\dfrac{7}{21}$",
      "$\\dfrac{8}{21}$",
      "$\\dfrac{3}{7}$"
    ],
    "answer": "①",
    "solution": "[키포인트] 전체 공의 개수가 $10$개가 되는 경우를 먼저 제한하고, 그중 흰 공이 $7$개인 경우를 찾는다.\n조건 정리: 카드 $1$은 공 $1$개, 카드 $2,3$은 공 $2$개, 카드 $4$는 공 $3$개를 상자 $B$에 넣는다.\n풀이 방향: $5$번 시행에서 카드 $1$, 카드 $2$ 또는 $3$, 카드 $4$가 나온 횟수를 각각 세어 조건부확률을 구한다.\n정석 풀이: 카드 $1$이 나온 횟수를 $n_1$, 카드 $2$ 또는 $3$이 나온 횟수를 $n_2$, 카드 $4$가 나온 횟수를 $n_4$라 하자. $n_1+n_2+n_4=5$이고 전체 공의 개수 조건은 $n_1+2n_2+3n_4=10$이다. 따라서 $n_2+2n_4=5$이다. 가능한 경우는 $(n_1,n_2,n_4)=(0,5,0),(1,3,1),(2,1,2)$이다. 흰 공의 개수는 $n_1+n_2+2n_4=5+n_4$이므로 흰 공이 $7$개이려면 $n_4=2$, 즉 $(2,1,2)$이어야 한다. 각 범주의 확률은 $\\dfrac{1}{4},\\dfrac{1}{2},\\dfrac{1}{4}$이므로 조건을 만족하는 전체 확률은 $\\dfrac{1}{32}+\\dfrac{5}{32}+\\dfrac{15}{256}=\\dfrac{63}{256}$이고, 흰 공이 $7$개인 경우의 확률은 $\\dfrac{15}{256}$이다. 따라서 조건부확률은 $\\dfrac{15/256}{63/256}=\\dfrac{5}{21}$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 18,
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
      "기출"
    ],
    "wide": false,
    "content": "좌표평면의 원점에 점 $P$가 있다. 한 개의 주사위를 사용하여 다음 시행을 한다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">주사위를 한 번 던져 나온 눈의 수가<br>$2$ 이하이면 점 $P$를 $x$축의 양의 방향으로 $3$만큼,<br>$3$ 이상이면 점 $P$를 $y$축의 양의 방향으로 $1$만큼 이동시킨다.</div>이 시행을 $45$번 반복하여 이동된 점 $P$와 직선 $3x+4y+5=0$ 사이의 거리를 확률변수 $X$라 하자. 이때, $X$의 평균은?",
    "choices": [
      "$52$",
      "$53$",
      "$54$",
      "$55$",
      "$56$"
    ],
    "answer": "①",
    "solution": "[키포인트] 이동 횟수를 하나의 확률변수로 두고 거리식을 평균으로 바꾼다.\n조건 정리: 주사위 눈이 $2$ 이하일 확률은 $\\dfrac{1}{3}$이고, 그 횟수를 $N$이라 하면 $N\\sim B(45,\\dfrac{1}{3})$이다.\n풀이 방향: $N$을 이용해 최종 좌표와 직선까지의 거리를 나타낸다.\n정석 풀이: $2$ 이하가 나온 횟수를 $N$이라 하면 최종 좌표는 $(3N,45-N)$이다. 직선 $3x+4y+5=0$까지의 거리는 $X=\\dfrac{|3(3N)+4(45-N)+5|}{5}=\\dfrac{5N+185}{5}=N+37$이다. 따라서 $E(X)=E(N)+37=45\\cdot\\dfrac{1}{3}+37=15+37=52$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 19,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(12,2^2)$을 따른다. $x$에 대한 이차방정식 $x^2-24x+a=0$이 서로 다른 두 실근 $\\alpha$, $\\beta$ $(\\alpha<\\beta)$를 갖고, $P(\\alpha\\le X\\le\\beta)=0.8664$를 만족시킬 때, 상수 $a$의 값을 오른쪽 표준정규분포표를 이용하여 구하면?<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr><tr><td>$2.5$</td><td>$0.4938$</td></tr></tbody></table>",
    "choices": [
      "$119$",
      "$128$",
      "$135$",
      "$140$",
      "$143$"
    ],
    "answer": "③",
    "solution": "[키포인트] 이차방정식의 두 근은 합이 $24$이므로 평균 $12$를 중심으로 대칭이다.\n조건 정리: $X\\sim N(12,2^2)$이고 $P(\\alpha\\le X\\le\\beta)=0.8664$이다.\n풀이 방향: $0.8664=2\\cdot0.4332$이므로 표준점수 $1.5$를 이용한다.\n정석 풀이: 두 근의 합은 $24$이므로 두 근의 중점은 $12$이다. $P(\\alpha\\le X\\le\\beta)=0.8664$는 평균을 중심으로 양쪽 표준점수 $1.5$까지의 확률이다. 표준편차가 $2$이므로 평균에서의 거리는 $1.5\\cdot2=3$이다. 따라서 두 근은 $9$, $15$이고, 곱은 $a=9\\cdot15=135$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "두 확률변수 $X$, $Y$가 각각 정규분포 $N(30,\\sigma^2)$, $N(m,\\sigma^2)$을 따르고, 다음 조건을 만족시킨다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">(가) $E(X^2)=916$ &nbsp;&nbsp; (나) $P(X\\ge26)+P(Y\\ge46)=1$</div>두 확률변수 $X$, $Y$의 확률밀도함수를 각각 $f(x)$, $g(x)$라 할 때, 두 상수 $a$, $b$ $(a<b)$에 대하여 $f(a)=g(a)=g(b)$이다. $P(a\\le Y\\le b)$의 값을 오른쪽 표준정규분포표를 이용하여 구하면?<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$0.5$</td><td>$0.1915$</td></tr><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr></tbody></table>",
    "choices": [
      "$0.6826$",
      "$0.7745$",
      "$0.8185$",
      "$0.8664$",
      "$0.9104$"
    ],
    "answer": "④",
    "solution": "[키포인트] 두 정규분포의 분산이 같으므로 두 밀도함수의 교점은 두 평균의 중점이다.\n조건 정리: $X\\sim N(30,\\sigma^2)$, $Y\\sim N(m,\\sigma^2)$이다.\n풀이 방향: $E(X^2)$로 $\\sigma$를 구하고, 확률 조건으로 $m$을 구한 뒤 $a,b$를 정한다.\n정석 풀이: $E(X^2)=V(X)+\\{E(X)\\}^2=\\sigma^2+30^2=916$이므로 $\\sigma^2=16$, $\\sigma=4$이다. $P(X\\ge26)=P\\left(Z\\ge\\dfrac{26-30}{4}\\right)=P(Z\\ge-1)=0.8413$이다. 따라서 $P(Y\\ge46)=1-0.8413=0.1587=P(Z\\ge1)$이므로 $\\dfrac{46-m}{4}=1$, 즉 $m=42$이다. $f(a)=g(a)$인 점은 두 평균 $30$, $42$의 중점이므로 $a=36$이다. 또 $g(a)=g(b)$이고 $g$는 평균 $42$를 중심으로 대칭이므로 $b=48$이다. 따라서 $P(a\\le Y\\le b)=P(36\\le Y\\le48)=P(-1.5\\le Z\\le1.5)=2\\cdot0.4332=0.8664$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 21,
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 확률변수 $X$가 다음 조건을 만족시킨다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">(가) $P(X=x)={}_nC_x\\dfrac{4^x}{5^n}$ $(x=0,1,2,\\cdots,n)$<br>(나) $\\displaystyle\\sum_{k=0}^{n} k\\,{}_nC_k\\dfrac{4^k}{5^n}=180$</div>$\\displaystyle\\sum_{k=174}^{n}{}_nC_k\\dfrac{4^k}{5^n}$의 값을 오른쪽 표준정규분포표를 이용하여 구하면? (단, $n>174$)<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$0.5$</td><td>$0.1915$</td></tr><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr></tbody></table>",
    "choices": [
      "$0.6915$",
      "$0.8413$",
      "$0.9104$",
      "$0.9332$",
      "$0.9772$"
    ],
    "answer": "②",
    "solution": "[키포인트] 주어진 확률질량함수는 성공확률이 $\\dfrac{4}{5}$인 이항분포이다.\n조건 정리: $X\\sim B(n,\\dfrac{4}{5})$이고 $E(X)=180$이다.\n풀이 방향: 평균으로 $n$을 구한 뒤 정규분포로 근사한다.\n정석 풀이: 이항분포의 평균은 $E(X)=n\\cdot\\dfrac{4}{5}$이므로 $\\dfrac{4n}{5}=180$, 따라서 $n=225$이다. 분산은 $225\\cdot\\dfrac{4}{5}\\cdot\\dfrac{1}{5}=36$이므로 표준편차는 $6$이다. 구하는 값은 $P(X\\ge174)$이고, 표준화하면 $Z=\\dfrac{174-180}{6}=-1$이다. 따라서 $P(X\\ge174)\\approx P(Z\\ge-1)=0.5+0.3413=0.8413$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형",
      "표"
    ],
    "wide": false,
    "content": "<서술형1> 평균이 $m$, 표준편차가 $4$인 정규분포를 따르는 확률변수 $X$의 확률밀도함수 $f(x)$가 다음 조건을 만족시킨다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">(가) $f(11)>f(21)$<br>(나) $f(5)<f(23)$</div>$m$이 자연수일 때, $P(11\\le X\\le23)$의 값을 오른쪽 표준정규분포표를 이용하여 구하시오. 서술형 답안지에 자세한 풀이와 함께 서술하시오.<br><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\le Z \\le z)$</th></tr></thead><tbody><tr><td>$0.5$</td><td>$0.1915$</td></tr><tr><td>$1.0$</td><td>$0.3413$</td></tr><tr><td>$1.5$</td><td>$0.4332$</td></tr><tr><td>$2.0$</td><td>$0.4772$</td></tr></tbody></table>",
    "choices": [],
    "answer": "$0.8185$",
    "solution": "[키포인트] 정규분포의 밀도함수 값은 평균에 가까울수록 크다.\n조건 정리: 평균은 $m$, 표준편차는 $4$이고, $f(11)>f(21)$, $f(5)<f(23)$이다.\n풀이 방향: 두 부등식으로 평균 $m$의 범위를 찾고, $m$이 자연수임을 이용한다.\n정석 풀이: $f(11)>f(21)$이려면 $11$이 $21$보다 평균 $m$에 더 가까워야 하므로 $m<16$이다. 또 $f(5)<f(23)$이려면 $23$이 $5$보다 평균 $m$에 더 가까워야 하므로 $m>14$이다. 따라서 $14<m<16$이고, $m$이 자연수이므로 $m=15$이다. 이제 $X\\sim N(15,4^2)$이므로 $11$의 표준점수는 $\\dfrac{11-15}{4}=-1$, $23$의 표준점수는 $\\dfrac{23-15}{4}=2$이다. 따라서 $P(11\\le X\\le23)=P(-1\\le Z\\le2)=0.3413+0.4772=0.8185$이다.\n따라서 구하는 값은 $0.8185$이다."
  },
  {
    "id": 23,
    "level": "상",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형"
    ],
    "wide": false,
    "content": "<서술형2> 정규분포를 따르는 두 확률변수 $X$, $Y$의 확률밀도함수를 각각 $f(x)$, $g(x)$라 할 때, 두 함수 $f(x)$, $g(x)$가 다음 조건을 만족시킨다.<div style=\"border:1px solid #555; padding:6px 8px; margin:6px 0;\">(가) $f(20)=g(20)$<br>(나) 모든 실수 $x$에 대하여 $f(x-2)=g(x+2)$</div>$P(15\\le X\\le18)=a$, $P(21\\le Y\\le25)=b$일 때, $P(19\\le X\\le21)$의 값을 $a$, $b$를 사용하여 나타내시오. 서술형 답안지에 자세한 풀이와 함께 서술하시오.",
    "choices": [],
    "answer": "$2a-b$",
    "solution": "[키포인트] 두 번째 조건은 $Y$의 분포가 $X$의 분포를 오른쪽으로 $4$만큼 평행이동한 것임을 뜻한다.\n조건 정리: $f(x-2)=g(x+2)$이므로 $g(t)=f(t-4)$이다. 따라서 $Y$의 평균은 $X$의 평균보다 $4$ 크다.\n풀이 방향: (가) 조건으로 $X$의 평균을 찾고, 주어진 확률 구간을 $X$ 기준으로 바꾼다.\n정석 풀이: $g(20)=f(16)$이므로 $f(20)=g(20)$은 $f(20)=f(16)$을 뜻한다. 정규분포의 밀도함수는 평균을 중심으로 대칭이므로 $X$의 평균은 $18$이다. 따라서 $Y$의 평균은 $22$이다. $P(15\\le X\\le18)=a$이고, 대칭성에 의해 $P(18\\le X\\le21)=a$이다. 또 $Y$는 $X$를 오른쪽으로 $4$만큼 이동한 분포이므로 $P(21\\le Y\\le25)=P(17\\le X\\le21)=b$이다. 따라서 $b=P(17\\le X\\le18)+P(18\\le X\\le21)$이고, $P(18\\le X\\le21)=a$이므로 $P(17\\le X\\le18)=b-a$이다. 대칭성에 의해 $P(18\\le X\\le19)=b-a$이다. 그러므로 $P(19\\le X\\le21)=P(18\\le X\\le21)-P(18\\le X\\le19)=a-(b-a)=2a-b$이다.\n따라서 구하는 값은 $2a-b$이다."
  },
  {
    "id": 24,
    "level": "상",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PS-05",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형"
    ],
    "wide": false,
    "content": "<서술형3> $1$부터 $5$까지 자연수가 각각 하나씩 적혀 있는 $5$개의 공이 들어 있는 주머니가 있다. 이 주머니에서 임의로 한 개의 공을 꺼내고 꺼낸 공을 다시 넣지 않을 때, $k$번째 꺼낸 공에 적혀 있는 수를 $a_k$라 하자. $\\displaystyle\\sum_{k=1}^{n}a_k$ $(n=1,2,\\cdots,5)$의 값이 처음으로 $5$의 배수가 되도록 하는 $n$의 값을 확률변수 $X$라 하자. $V(X)$의 값을 구하시오. 서술형 답안지에 자세한 풀이와 함께 서술하시오.",
    "choices": [],
    "answer": "$\\dfrac{118}{45}$",
    "solution": "[키포인트] 공을 꺼내는 순서는 $1,2,3,4,5$의 순열이고, 부분합이 처음으로 $5$의 배수가 되는 위치를 세면 된다.\n조건 정리: 전체 가능한 순서는 $5!=120$가지이다. 전체 합 $1+2+3+4+5=15$는 $5$의 배수이므로 $X$는 반드시 $1$부터 $5$ 사이의 값을 가진다.\n풀이 방향: $X=1,2,3,4,5$가 되는 순서의 수를 세어 확률분포를 만든 뒤 분산을 계산한다.\n정석 풀이: 직접 경우를 세면 $X=1$인 경우는 첫 공이 $5$인 경우이므로 $4!=24$가지이다. $X=2$인 경우는 처음 두 수의 합이 처음으로 $5$의 배수가 되는 경우로 $24$가지이다. $X=3$인 경우는 $8$가지, $X=4$인 경우는 $16$가지이다. 나머지는 $X=5$인 경우로 $120-24-24-8-16=48$가지이다. 따라서 확률분포는 $P(X=1)=\\dfrac{24}{120}$, $P(X=2)=\\dfrac{24}{120}$, $P(X=3)=\\dfrac{8}{120}$, $P(X=4)=\\dfrac{16}{120}$, $P(X=5)=\\dfrac{48}{120}$이다. 그러므로 $E(X)=\\dfrac{1\\cdot24+2\\cdot24+3\\cdot8+4\\cdot16+5\\cdot48}{120}=\\dfrac{10}{3}$이고, $E(X^2)=\\dfrac{1^2\\cdot24+2^2\\cdot24+3^2\\cdot8+4^2\\cdot16+5^2\\cdot48}{120}=\\dfrac{206}{15}$이다. 따라서 $V(X)=E(X^2)-\\{E(X)\\}^2=\\dfrac{206}{15}-\\left(\\dfrac{10}{3}\\right)^2=\\dfrac{118}{45}$이다.\n따라서 구하는 값은 $\\dfrac{118}{45}$이다."
  }
];
