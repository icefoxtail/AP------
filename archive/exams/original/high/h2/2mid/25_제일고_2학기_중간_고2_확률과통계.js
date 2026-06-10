window.examTitle = "25_제일고_2학기_중간_고2_확률과통계";

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
    "content": "확률변수 $X$의 확률질량함수가 $P(X=x)=a$ $(x=1,2,4)$, $P(X=3)=\\dfrac{1}{4}$일 때, $a$의 값은?",
    "choices": [
      "$\\dfrac{1}{4}$",
      "$\\dfrac{3}{8}$",
      "$\\dfrac{1}{2}$",
      "$\\dfrac{5}{8}$",
      "$\\dfrac{3}{4}$"
    ],
    "answer": "①",
    "solution": "[키포인트] 확률질량함수의 전체 확률의 합은 $1$이다.\n조건 정리: $X$가 $1,2,4$일 때의 확률은 각각 $a$이고, $X=3$일 때의 확률은 $\\dfrac{1}{4}$이다.\n풀이 방향: 가능한 모든 값의 확률을 더해 $1$이 되도록 식을 세운다.\n정석 풀이: 전체 확률의 합은 $a+a+\\dfrac{1}{4}+a=1$이다. 따라서 $3a+\\dfrac{1}{4}=1$이고, $3a=\\dfrac{3}{4}$이므로 $a=\\dfrac{1}{4}$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 2,
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
    "content": "확률변수 $X$의 확률분포가 다음 표와 같다. $E(X)$의 값은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q2.png",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "[키포인트] 확률변수의 평균은 각 값에 그 확률을 곱해 모두 더한 값이다.\n조건 정리: $X=1,2,3,4,5$가 모두 같은 확률 $\\dfrac{1}{5}$로 나타난다.\n풀이 방향: $E(X)=\\sum xP(X=x)$를 이용한다.\n정석 풀이: $E(X)=1\\cdot\\dfrac{1}{5}+2\\cdot\\dfrac{1}{5}+3\\cdot\\dfrac{1}{5}+4\\cdot\\dfrac{1}{5}+5\\cdot\\dfrac{1}{5}$이다. 따라서 $E(X)=\\dfrac{1+2+3+4+5}{5}=\\dfrac{15}{5}=3$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 3,
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
    "content": "확률변수 $X$가 이항분포 $B(125,\\dfrac{1}{5})$를 따를 때, $E(X)+V(X)$의 값은?",
    "choices": [
      "$25$",
      "$30$",
      "$35$",
      "$40$",
      "$45$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 이항분포 $B(n,p)$에서는 $E(X)=np$, $V(X)=np(1-p)$이다.\n조건 정리: $n=125$, $p=\\dfrac{1}{5}$이다.\n풀이 방향: 평균과 분산을 각각 구한 뒤 더한다.\n정석 풀이: $E(X)=125\\cdot\\dfrac{1}{5}=25$이다. 또 $V(X)=125\\cdot\\dfrac{1}{5}\\cdot\\dfrac{4}{5}=20$이다. 따라서 $E(X)+V(X)=25+20=45$이다.\n따라서 정답은 ⑤이다."
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(10,4^2)$을 따를 때, 아래 표준정규분포표를 이용하여 $P(8\\le X\\le 14)$의 값을 구한 것은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q4.png",
    "choices": [
      "$0.5328$",
      "$0.6247$",
      "$0.6687$",
      "$0.7745$",
      "$0.8185$"
    ],
    "answer": "①",
    "solution": "[키포인트] 정규분포 확률은 표준화하여 표준정규분포표와 연결한다.\n조건 정리: 평균은 $10$, 표준편차는 $4$이다.\n풀이 방향: $Z=\\dfrac{X-10}{4}$로 표준화한다.\n정석 풀이: $X=8$일 때 $Z=\\dfrac{8-10}{4}=-0.5$이고, $X=14$일 때 $Z=\\dfrac{14-10}{4}=1$이다. 따라서 $P(8\\le X\\le 14)=P(-0.5\\le Z\\le 1)$이다. 표준정규분포의 대칭성을 이용하면 $P(-0.5\\le Z\\le 1)=P(0\\le Z\\le 0.5)+P(0\\le Z\\le 1)=0.1915+0.3413=0.5328$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 5,
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
    "content": "확률변수 $X$의 확률분포를 표로 나타내면 다음과 같다. $P(X\\le 3)=\\dfrac{7}{10}$일 때, $P(X^2-7X+12\\le 0)$의 값은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q5.png",
    "choices": [
      "$\\dfrac{3}{10}$",
      "$\\dfrac{2}{5}$",
      "$\\dfrac{1}{2}$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{7}{10}$"
    ],
    "answer": "③",
    "solution": "[키포인트] 먼저 미지의 확률을 구한 뒤 부등식이 성립하는 $X$의 값을 찾는다.\n조건 정리: $P(X=1)=\\dfrac{1}{5}$, $P(X=2)=a$, $P(X=3)=\\dfrac{3}{10}$, $P(X=4)=b$, $P(X=5)=\\dfrac{1}{10}$이고 $P(X\\le 3)=\\dfrac{7}{10}$이다.\n풀이 방향: $P(X\\le3)$로 $a$를 구하고, 전체 확률의 합으로 $b$를 구한 뒤 조건을 만족하는 확률을 더한다.\n정석 풀이: $P(X\\le3)=\\dfrac{1}{5}+a+\\dfrac{3}{10}=\\dfrac{7}{10}$이므로 $a=\\dfrac{1}{5}$이다. 전체 확률의 합이 $1$이므로 $\\dfrac{1}{5}+\\dfrac{1}{5}+\\dfrac{3}{10}+b+\\dfrac{1}{10}=1$에서 $b=\\dfrac{1}{5}$이다. 또 $X^2-7X+12=(X-3)(X-4)$이므로 $X^2-7X+12\\le0$은 $3\\le X\\le4$일 때 성립한다. 따라서 구하는 확률은 $P(X=3)+P(X=4)=\\dfrac{3}{10}+\\dfrac{1}{5}=\\dfrac{1}{2}$이다.\n따라서 정답은 ③이다."
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
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "연속확률변수 $X$의 확률밀도함수가 $f(x)=\\dfrac{a}{2}x$ $(0\\le x\\le6)$일 때, $P(1\\le X\\le3)$의 값을 구하면? 단, $a$는 상수이다.",
    "choices": [
      "$\\dfrac{1}{9}$",
      "$\\dfrac{2}{9}$",
      "$\\dfrac{1}{3}$",
      "$\\dfrac{4}{9}$",
      "$\\dfrac{5}{9}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 확률밀도함수의 전체 넓이는 $1$이고, 구간 확률은 해당 구간의 넓이다.\n조건 정리: $f(x)=\\dfrac{a}{2}x$이고 정의역은 $0\\le x\\le6$이다.\n풀이 방향: 먼저 전체 적분값이 $1$이 되도록 $a$를 구한 뒤, $1\\le X\\le3$에서 적분한다.\n정석 풀이: $\\int_0^6 \\dfrac{a}{2}x\\,dx=1$이므로 $\\dfrac{a}{2}\\cdot\\dfrac{6^2}{2}=1$이다. 따라서 $9a=1$이고 $a=\\dfrac{1}{9}$이다. 그러므로 $f(x)=\\dfrac{x}{18}$이다. 구하는 확률은 $P(1\\le X\\le3)=\\int_1^3\\dfrac{x}{18}\\,dx=\\left[\\dfrac{x^2}{36}\\right]_1^3=\\dfrac{9-1}{36}=\\dfrac{2}{9}$이다.\n따라서 정답은 ②이다."
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
    "content": "두 확률변수 $X,Y$가 각각 정규분포 $N(15,3^2)$, $N(24,5^2)$을 따르고, $P(12\\le X\\le21)=P(a\\le Y\\le29)$일 때, 실수 $a$의 값을 구하면?",
    "choices": [
      "$10$",
      "$11$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 정규분포의 구간 확률이 같도록 각각 표준화한다.\n조건 정리: $X$는 평균 $15$, 표준편차 $3$이고, $Y$는 평균 $24$, 표준편차 $5$이다.\n풀이 방향: $12\\le X\\le21$을 표준정규분포 구간으로 바꾸고, 같은 넓이가 되도록 $Y$의 하한을 정한다.\n정석 풀이: $X=12$이면 $Z=\\dfrac{12-15}{3}=-1$, $X=21$이면 $Z=\\dfrac{21-15}{3}=2$이다. 따라서 $P(12\\le X\\le21)=P(-1\\le Z\\le2)$이다. 이 넓이는 평균을 기준으로 왼쪽 $1$, 오른쪽 $2$만큼의 넓이이다. $Y$에서 $29$는 $\\dfrac{29-24}{5}=1$이므로 오른쪽 끝은 $Z=1$이다. 같은 넓이를 만들려면 왼쪽 끝은 $Z=-2$가 되어야 한다. 따라서 $\\dfrac{a-24}{5}=-2$이고 $a=14$이다.\n따라서 정답은 ⑤이다."
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
      "기출"
    ],
    "wide": false,
    "content": "$1$이 적혀 있는 구슬이 $1$개, $2$가 적혀 있는 구슬이 $2$개, $3$이 적혀 있는 구슬이 $3$개가 들어 있는 주머니가 있다. 이 주머니에서 구슬 $2$개를 동시에 꺼낼 때, 두 개의 구슬에 적혀 있는 수의 곱을 확률변수 $X$라 하자. $E(-3X+8)$의 값은?",
    "choices": [
      "$-8$",
      "$-5$",
      "$-2$",
      "$1$",
      "$4$"
    ],
    "answer": "①",
    "solution": "[키포인트] 선형변환의 평균은 $E(aX+b)=aE(X)+b$를 이용한다.\n조건 정리: 주머니 안의 수는 $1,2,2,3,3,3$이고, 두 구슬의 수의 곱이 $X$이다.\n풀이 방향: 먼저 두 수의 곱의 평균 $E(X)$를 구한 뒤 $E(-3X+8)$을 계산한다.\n정석 풀이: 두 구슬을 순서 있게 뽑는다고 생각하면 전체 경우는 $6\\cdot5$가지이다. 수들의 합은 $1+2+2+3+3+3=14$이고, 제곱의 합은 $1^2+2^2+2^2+3^2+3^2+3^2=36$이다. 서로 다른 두 위치를 뽑아 곱하는 평균은 $E(X)=\\dfrac{14^2-36}{6\\cdot5}=\\dfrac{160}{30}=\\dfrac{16}{3}$이다. 따라서 $E(-3X+8)=-3E(X)+8=-3\\cdot\\dfrac{16}{3}+8=-8$이다.\n따라서 정답은 ①이다."
  },
  {
    "id": 9,
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
      "도형"
    ],
    "wide": false,
    "content": "아래 그림과 같이 직선 사이의 간격이 $1$인 가로 방향의 평행선 $3$개와 세로 방향의 평행선 $3$개가 각각 수직으로 만난다. 이 직선으로 만들어지는 직사각형의 넓이를 확률변수 $X$라 할 때, $V(-9X+5)$의 값은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q9.png",
    "choices": [
      "$64$",
      "$66$",
      "$68$",
      "$70$",
      "$72$"
    ],
    "answer": "③",
    "solution": "[키포인트] 직사각형의 가로 길이와 세로 길이를 각각 선택한 뒤 넓이의 분포를 만든다.\n조건 정리: 가로 방향 선 $3$개 중 $2$개, 세로 방향 선 $3$개 중 $2$개를 골라 직사각형을 만든다. 선 사이 간격은 모두 $1$이다.\n풀이 방향: 가능한 가로 길이와 세로 길이는 각각 $1$ 또는 $2$이고, 넓이 $X$의 분포를 구한다.\n정석 풀이: $3$개의 평행선 중 두 선을 고르는 방법은 $3$가지이다. 그중 간격이 $1$인 경우는 $2$가지, 간격이 $2$인 경우는 $1$가지이다. 따라서 넓이 $1$은 $2\\cdot2=4$가지, 넓이 $2$는 $2\\cdot1+1\\cdot2=4$가지, 넓이 $4$는 $1\\cdot1=1$가지이다. 전체는 $9$가지이므로 $E(X)=\\dfrac{4\\cdot1+4\\cdot2+1\\cdot4}{9}=\\dfrac{16}{9}$이고, $E(X^2)=\\dfrac{4\\cdot1^2+4\\cdot2^2+1\\cdot4^2}{9}=4$이다. 따라서 $V(X)=4-\\left(\\dfrac{16}{9}\\right)^2=\\dfrac{68}{81}$이다. 선형변환에 의해 $V(-9X+5)=(-9)^2V(X)=81\\cdot\\dfrac{68}{81}=68$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 10,
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
    "content": "한 개의 주사위를 $30$번 던질 때, $5$의 약수의 눈의 수가 나오는 횟수를 확률변수 $X$라 하자. $\\dfrac{P(X=1)}{P(X=0)}$의 값은?",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 이항분포에서 인접한 확률의 비를 이용하면 계산이 간단하다.\n조건 정리: 주사위에서 $5$의 약수는 $1,5$이므로 한 번에 성공할 확률은 $p=\\dfrac{2}{6}=\\dfrac{1}{3}$이다. 따라서 $X\\sim B(30,\\dfrac{1}{3})$이다.\n풀이 방향: $P(X=1)$과 $P(X=0)$을 각각 이항분포 공식으로 나타내어 나눈다.\n정석 풀이: $P(X=1)={}_{30}C_1\\left(\\dfrac{1}{3}\\right)\\left(\\dfrac{2}{3}\\right)^{29}$이고, $P(X=0)=\\left(\\dfrac{2}{3}\\right)^{30}$이다. 따라서 $\\dfrac{P(X=1)}{P(X=0)}=30\\cdot\\dfrac{1}{3}\\cdot\\dfrac{3}{2}=15$이다.\n따라서 정답은 ⑤이다."
  },
  {
    "id": 11,
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
      "그래프"
    ],
    "wide": false,
    "content": "그림에서 세 곡선 $A,B,C$는 각각 정규분포를 따르는 세 확률변수 $X_A,X_B,X_C$의 확률밀도함수의 그래프이다. $X_A,X_B,X_C$의 평균을 각각 $m_A,m_B,m_C$, 표준편차를 $\\sigma_A,\\sigma_B,\\sigma_C$라 할 때, 대소를 올바르게 비교한 것은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q11.png",
    "choices": [
      "평균 $m_A>m_B>m_C$, 표준편차 $\\sigma_A>\\sigma_B>\\sigma_C$",
      "평균 $m_B>m_A>m_C$, 표준편차 $\\sigma_B<\\sigma_A<\\sigma_C$",
      "평균 $m_B>m_A>m_C$, 표준편차 $\\sigma_B>\\sigma_A>\\sigma_C$",
      "평균 $m_A<m_B<m_C$, 표준편차 $\\sigma_B<\\sigma_A<\\sigma_C$",
      "평균 $m_A<m_B<m_C$, 표준편차 $\\sigma_B>\\sigma_A>\\sigma_C$"
    ],
    "answer": "④",
    "solution": "[키포인트] 정규분포 그래프의 중심은 평균이고, 그래프가 좁고 높을수록 표준편차가 작다.\n조건 정리: 그래프 $A$는 왼쪽, $B$는 가운데, $C$는 오른쪽에 중심이 있다. 또 $B$가 가장 좁고 높으며, $C$가 가장 넓고 낮다.\n풀이 방향: 중심의 좌우 위치로 평균의 대소를 정하고, 퍼진 정도로 표준편차의 대소를 정한다.\n정석 풀이: 정규분포의 평균은 그래프의 중심 위치이다. 따라서 왼쪽부터 $A,B,C$이므로 $m_A<m_B<m_C$이다. 표준편차는 그래프가 퍼진 정도를 나타내므로 가장 좁은 $B$의 표준편차가 가장 작고, 가장 넓은 $C$의 표준편차가 가장 크다. 따라서 $\\sigma_B<\\sigma_A<\\sigma_C$이다.\n따라서 정답은 ④이다."
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
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$의 확률질량함수가 $P(X=x)={}_{625}C_x\\left(\\dfrac{1}{5}\\right)^x\\left(\\dfrac{4}{5}\\right)^{625-x}$ $(x=0,1,\\cdots,625)$일 때, $P(X=105)+P(X=106)+\\cdots+P(X=140)$의 값을 아래 표준정규분포표를 이용하여 구한 것은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q12.png",
    "choices": [
      "$0.6687$",
      "$0.7745$",
      "$0.8185$",
      "$0.9104$",
      "$0.9332$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포를 정규분포로 근사할 때 평균과 표준편차를 먼저 구한다.\n조건 정리: $X\\sim B(625,\\dfrac{1}{5})$이므로 평균은 $np$, 분산은 $np(1-p)$이다.\n풀이 방향: 이항분포를 평균 $125$, 표준편차 $10$인 정규분포로 근사하고, $105\\le X\\le140$을 표준화한다.\n정석 풀이: $E(X)=625\\cdot\\dfrac{1}{5}=125$이고, $V(X)=625\\cdot\\dfrac{1}{5}\\cdot\\dfrac{4}{5}=100$이므로 표준편차는 $10$이다. 따라서 $X=105$는 $Z=\\dfrac{105-125}{10}=-2$, $X=140$은 $Z=\\dfrac{140-125}{10}=1.5$에 대응한다. 그러므로 구하는 값은 $P(-2\\le Z\\le1.5)=P(0\\le Z\\le2)+P(0\\le Z\\le1.5)=0.4772+0.4332=0.9104$이다.\n따라서 정답은 ④이다."
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(m,4^2)$을 따를 때, 모든 실수 $k$에 대하여 $P(X\\le k)=P(X\\ge 40-k)$를 만족한다고 한다. 아래 표준정규분포표를 이용하여 $P(14\\le X\\le16)$의 값을 구하면?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q13.png",
    "choices": [
      "$0.0443$",
      "$0.0919$",
      "$0.1359$",
      "$0.1498$",
      "$0.2857$"
    ],
    "answer": "②",
    "solution": "[키포인트] 정규분포의 대칭축은 평균이다.\n조건 정리: 모든 실수 $k$에 대해 $P(X\\le k)=P(X\\ge40-k)$가 성립한다.\n풀이 방향: 두 경계 $k$와 $40-k$의 가운데가 평균이므로 평균 $m$을 먼저 구한다.\n정석 풀이: 정규분포는 평균을 중심으로 대칭이다. $P(X\\le k)$와 $P(X\\ge40-k)$가 모든 $k$에서 같으려면 $k$와 $40-k$가 평균을 기준으로 서로 대칭이어야 한다. 따라서 평균은 $m=20$이다. 표준편차는 $4$이므로 $X=14$는 $Z=\\dfrac{14-20}{4}=-1.5$, $X=16$은 $Z=\\dfrac{16-20}{4}=-1$이다. 따라서 $P(14\\le X\\le16)=P(-1.5\\le Z\\le-1)=P(1\\le Z\\le1.5)=0.4332-0.3413=0.0919$이다.\n따라서 정답은 ②이다."
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
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $W,X,Y$가 각각 정규분포 $N(80,10^2)$, $N(200,30^2)$, $N(180,15^2)$을 따를 때, $a=P(W\\ge70)$, $b=P(X\\ge215)$, $c=P(Y\\ge210)$이라 하자. $a,b,c$ 중 값이 큰 값부터 차례대로 나열한 것은?",
    "choices": [
      "$a,b,c$",
      "$a,c,b$",
      "$b,a,c$",
      "$c,a,b$",
      "$c,b,a$"
    ],
    "answer": "①",
    "solution": "[키포인트] 서로 다른 정규분포라도 표준화하면 같은 표준정규분포에서 비교할 수 있다.\n조건 정리: $a,b,c$는 각각 오른쪽 꼬리 확률이다.\n풀이 방향: 각 경계값을 표준점수로 바꾸어 오른쪽 확률의 크기를 비교한다.\n정석 풀이: $a=P(W\\ge70)$에서 표준점수는 $\\dfrac{70-80}{10}=-1$이므로 $a=P(Z\\ge-1)$이다. $b=P(X\\ge215)$에서 표준점수는 $\\dfrac{215-200}{30}=0.5$이므로 $b=P(Z\\ge0.5)$이다. $c=P(Y\\ge210)$에서 표준점수는 $\\dfrac{210-180}{15}=2$이므로 $c=P(Z\\ge2)$이다. 오른쪽 꼬리 확률은 기준 표준점수가 작을수록 크므로 $a>b>c$이다.\n따라서 정답은 ①이다."
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
      "기출"
    ],
    "wide": false,
    "content": "아버지, 어머니, 아들 $1$명, 딸 $2$명으로 이루어진 $5$명의 가족을 일렬로 세울 때, 어머니와 이웃한 딸의 수를 확률변수 $X$라 하자. $\\sigma(X)$의 값은?",
    "choices": [
      "$\\dfrac{2}{5}$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{4}{5}$",
      "$1$",
      "$\\dfrac{6}{5}$"
    ],
    "answer": "②",
    "solution": "[키포인트] 어머니의 위치에 따라 이웃한 자리의 수가 달라지므로 위치별로 나누어 확률분포를 만든다.\n조건 정리: $X$는 어머니 바로 옆에 있는 딸의 수이므로 $0,1,2$ 중 하나이다.\n풀이 방향: 어머니가 끝자리인지, 가운데 쪽인지에 따라 이웃한 자리 $2$개 중 딸이 몇 명 들어가는지 센다.\n정석 풀이: 어머니가 양 끝에 설 확률은 $\\dfrac{2}{5}$이다. 이때 이웃한 자리는 하나뿐이므로 $X=1$일 확률은 $\\dfrac{2}{4}$, $X=0$일 확률은 $\\dfrac{2}{4}$이다. 어머니가 끝이 아닌 자리에 설 확률은 $\\dfrac{3}{5}$이고, 이때 이웃한 자리 두 곳에 딸 $2$명이 들어가는 수를 세면 $P(X=0)=\\dfrac{1}{6}$, $P(X=1)=\\dfrac{4}{6}$, $P(X=2)=\\dfrac{1}{6}$이다. 이를 합치면 $P(X=0)=\\dfrac{3}{10}$, $P(X=1)=\\dfrac{3}{5}$, $P(X=2)=\\dfrac{1}{10}$이다. 따라서 $E(X)=0\\cdot\\dfrac{3}{10}+1\\cdot\\dfrac{3}{5}+2\\cdot\\dfrac{1}{10}=\\dfrac{4}{5}$이고, $E(X^2)=0+1\\cdot\\dfrac{3}{5}+4\\cdot\\dfrac{1}{10}=1$이다. 그러므로 $V(X)=1-\\left(\\dfrac{4}{5}\\right)^2=\\dfrac{9}{25}$이고 $\\sigma(X)=\\dfrac{3}{5}$이다.\n따라서 정답은 ②이다."
  },
  {
    "id": 16,
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
      "도형"
    ],
    "wide": false,
    "content": "숫자 $1,1,2,2,4$가 하나씩 적혀 있는 $5$장의 카드가 있다. 이 $5$장의 카드를 모두 한 번씩 사용하여 일렬로 임의로 나열할 때, 양 끝에 놓인 카드에 적혀 있는 두 수의 곱을 확률변수 $X$라 하자. $E(10X-5)$의 값은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q16.png",
    "choices": [
      "$26$",
      "$29$",
      "$32$",
      "$35$",
      "$38$"
    ],
    "answer": "③",
    "solution": "[키포인트] 양 끝 카드의 곱은 전체 카드 중 서로 다른 두 위치의 수를 뽑아 곱하는 평균으로 구할 수 있다.\n조건 정리: 카드에 적힌 수는 $1,1,2,2,4$이다.\n풀이 방향: 먼저 양 끝 수의 곱의 평균 $E(X)$를 구한 뒤 선형변환 평균을 적용한다.\n정석 풀이: 다섯 카드의 수의 합은 $1+1+2+2+4=10$이고, 제곱의 합은 $1^2+1^2+2^2+2^2+4^2=26$이다. 순서 있는 두 끝자리를 생각하면 가능한 경우는 $5\\cdot4$가지이고, 곱의 평균은 $E(X)=\\dfrac{10^2-26}{5\\cdot4}=\\dfrac{74}{20}=\\dfrac{37}{10}$이다. 따라서 $E(10X-5)=10E(X)-5=10\\cdot\\dfrac{37}{10}-5=32$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 17,
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
    "content": "어느 고등학교 전교생 $800$명의 몸무게를 측정했을 때, 평균이 $65kg$이고 표준편차가 $5kg$인 정규분포를 따른다고 한다. 몸무게가 제일 많이 나가는 사람부터 일련번호를 결정한다고 할 때, $240$번 학생의 몸무게는 몇 $kg$인지 구한 것은? 단, 표준정규분포를 따르는 확률변수 $Z$에 대하여 $P(0\\le Z\\le0.52)=0.20$이고 모든 학생은 몸무게가 다르다.",
    "choices": [
      "$64.8kg$",
      "$65.9kg$",
      "$66.4kg$",
      "$66.8kg$",
      "$67.6kg$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 위에서부터 $240$번째라는 말은 오른쪽 꼬리 확률이 $\\dfrac{240}{800}$이라는 뜻이다.\n조건 정리: 몸무게 $W$는 평균 $65$, 표준편차 $5$인 정규분포를 따른다.\n풀이 방향: $240$번째 학생보다 무거운 비율을 오른쪽 꼬리 확률로 해석한다.\n정석 풀이: 전체 $800$명 중 위에서 $240$번째이므로 그 학생 이상의 비율은 $\\dfrac{240}{800}=0.3$이다. 따라서 $P(W\\ge w)=0.3$이고 $P(W\\le w)=0.7$이다. 표준정규분포에서 $P(0\\le Z\\le0.52)=0.20$이므로 $P(Z\\le0.52)=0.70$이다. 따라서 $\\dfrac{w-65}{5}=0.52$이고 $w=65+2.6=67.6$이다.\n따라서 정답은 ⑤이다."
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
      "기출",
      "표"
    ],
    "wide": false,
    "content": "어느 농구선수의 자유투 성공 확률은 $0.6$이다. 이 선수가 자유투를 $150$번 시도할 때, 성공한 횟수가 $a$번 이하일 확률은 $0.8413$이라고 한다. 자연수 $a$의 값을 아래 표준정규분포표를 이용하여 구한 것은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q18.png",
    "choices": [
      "$90$",
      "$92$",
      "$94$",
      "$96$",
      "$98$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포를 정규분포로 근사하여 표준정규분포표의 확률과 대응시킨다.\n조건 정리: 성공 횟수 $X$는 $B(150,0.6)$을 따른다.\n풀이 방향: 평균과 표준편차를 구한 뒤 $P(X\\le a)=0.8413$에 해당하는 표준점수를 찾는다.\n정석 풀이: $E(X)=150\\cdot0.6=90$이고, $V(X)=150\\cdot0.6\\cdot0.4=36$이므로 표준편차는 $6$이다. $0.8413=0.5+0.3413$이므로 표에서 해당 표준점수는 $1.0$이다. 따라서 $\\dfrac{a-90}{6}=1$로 보고 $a=96$이다.\n따라서 정답은 ④이다."
  },
  {
    "id": 19,
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
    "content": "확률변수 $W$가 정규분포 $N(1,4^2)$을 따를 때, 곡선 $y=x^2+Wx+1$과 직선 $y=x+W$가 만날 확률을 아래 표준정규분포표를 이용하여 구한 것은?",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q19.png",
    "choices": [
      "$0.4772$",
      "$0.5328$",
      "$0.6587$",
      "$0.8085$",
      "$0.8664$"
    ],
    "answer": "③",
    "solution": "[키포인트] 두 그래프가 만나는 조건은 이차방정식의 실근 존재 조건으로 바꾼다.\n조건 정리: 교점의 $x$좌표는 $x^2+Wx+1=x+W$를 만족해야 한다.\n풀이 방향: 이 식을 이차방정식으로 정리하고 판별식이 $0$ 이상이 되는 $W$의 범위를 구한다.\n정석 풀이: 두 식을 같게 놓으면 $x^2+Wx+1=x+W$이므로 $x^2+(W-1)x+(1-W)=0$이다. 실수 교점이 있으려면 판별식이 $0$ 이상이어야 한다. 판별식은 $(W-1)^2-4(1-W)=(W-1)(W+3)$이다. 따라서 $(W-1)(W+3)\\ge0$이므로 $W\\le-3$ 또는 $W\\ge1$이다. 이제 $W\\sim N(1,4^2)$이므로 $W=-3$은 $Z=\\dfrac{-3-1}{4}=-1$, $W=1$은 $Z=0$에 대응한다. 따라서 구하는 확률은 $P(Z\\le-1)+P(Z\\ge0)=0.1587+0.5=0.6587$이다.\n따라서 정답은 ③이다."
  },
  {
    "id": 20,
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
    "content": "$500$원짜리 동전 $2$개와 $100$원짜리 동전 $2$개를 사용하여 다음 시행을 한다.<br><div class=\"note-box\">동전 $4$개를 동시에 한 번 던졌을 때 앞면이 나온 $500$원짜리 동전의 개수와 앞면이 나온 $100$원짜리 동전의 개수가 서로 같으면 $2$점을 얻고, 서로 다르면 $1$점을 잃는다.</div><br>이 시행을 $40$회 반복한 후 얻는 점수의 합을 확률변수 $X$라 할 때, $E(X)$의 값은?",
    "choices": [
      "$-4$",
      "$-1$",
      "$2$",
      "$5$",
      "$8$"
    ],
    "answer": "④",
    "solution": "[키포인트] 한 번의 시행에서 얻는 점수의 평균을 구한 뒤 $40$배한다.\n조건 정리: $500$원짜리 동전의 앞면 개수와 $100$원짜리 동전의 앞면 개수가 같으면 $2$점, 다르면 $-1$점이다.\n풀이 방향: 두 종류의 동전에서 앞면 개수가 같은 확률을 먼저 구한다.\n정석 풀이: $500$원짜리 동전 두 개의 앞면 개수와 $100$원짜리 동전 두 개의 앞면 개수는 각각 $0,1,2$가 될 수 있다. 각 분포는 $\\dfrac{1}{4},\\dfrac{1}{2},\\dfrac{1}{4}$이다. 두 개수가 같을 확률은 $\\left(\\dfrac{1}{4}\\right)^2+\\left(\\dfrac{1}{2}\\right)^2+\\left(\\dfrac{1}{4}\\right)^2=\\dfrac{3}{8}$이다. 한 번 시행의 점수를 $Y$라 하면 $E(Y)=2\\cdot\\dfrac{3}{8}+(-1)\\cdot\\dfrac{5}{8}=\\dfrac{1}{8}$이다. $40$회 반복한 점수의 합이 $X$이므로 $E(X)=40E(Y)=5$이다.\n따라서 정답은 ④이다."
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
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형"
    ],
    "wide": false,
    "content": "흰 공 $2$개, 검은 공 $x$개가 들어 있는 주머니에서 임의로 $1$개의 공을 꺼내어 색을 확인하고 다시 넣는 시행을 $n$번 반복할 때, 검은 공이 나오는 횟수를 확률변수 $X$라 하자. 확률변수 $X$의 평균이 $15$, 표준편차가 $\\sqrt{6}$일 때, 두 자연수 $x$와 $n$을 구하시오.",
    "choices": [],
    "answer": "$x=3, n=25$",
    "solution": "[키포인트] 복원추출에서 검은 공이 나오는 횟수는 이항분포로 볼 수 있다.\n조건 정리: 검은 공이 나올 확률은 $p=\\dfrac{x}{x+2}$이고, $X\\sim B(n,p)$이다. 평균은 $15$, 표준편차는 $\\sqrt{6}$이다.\n풀이 방향: $E(X)=np$, $V(X)=np(1-p)$를 이용한다.\n정석 풀이: 평균이 $15$이므로 $np=15$이다. 표준편차가 $\\sqrt{6}$이므로 분산은 $6$이고, $np(1-p)=6$이다. $np=15$를 대입하면 $15(1-p)=6$이므로 $1-p=\\dfrac{2}{5}$, $p=\\dfrac{3}{5}$이다. 따라서 $\\dfrac{x}{x+2}=\\dfrac{3}{5}$이므로 $5x=3x+6$, $2x=6$, $x=3$이다. 또 $np=15$에서 $n\\cdot\\dfrac{3}{5}=15$이므로 $n=25$이다.\n따라서 구하는 값은 $x=3, n=25$이다."
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
      "서술형"
    ],
    "wide": false,
    "content": "두 집합 $A=\\{2,3,4\\}$, $B=\\{2,3\\}$에 대하여 집합 $A$의 모든 부분집합 중에서 임의로 한 개를 선택하고 집합 $B$의 모든 부분집합 중에서 임의로 한 개를 선택할 때, 선택한 두 집합의 교집합의 원소의 개수를 확률변수 $X$라 하자. 확률변수 $X$의 확률분포표를 만들고 평균을 구하는 과정을 구체적으로 서술하시오.",
    "choices": [],
    "answer": "$P(X=0)=\\dfrac{9}{16}, P(X=1)=\\dfrac{3}{8}, P(X=2)=\\dfrac{1}{16}, E(X)=\\dfrac{1}{2}$",
    "solution": "[키포인트] 교집합에 들어갈 수 있는 원소는 $2,3$뿐이며, 각 원소가 두 부분집합에 동시에 들어가는지 보면 된다.\n조건 정리: $A$의 부분집합은 $2^3=8$개, $B$의 부분집합은 $2^2=4$개이므로 전체 선택 경우는 $32$가지이다.\n풀이 방향: 원소 $2$와 $3$이 각각 두 집합에 모두 포함되는지에 따라 $X$의 값을 정한다.\n정석 풀이: 원소 $2$가 교집합에 들어가려면 선택한 $A$의 부분집합과 선택한 $B$의 부분집합에 모두 $2$가 들어가야 하므로 확률은 $\\dfrac{1}{2}\\cdot\\dfrac{1}{2}=\\dfrac{1}{4}$이다. 원소 $3$도 같은 방식으로 교집합에 들어갈 확률이 $\\dfrac{1}{4}$이다. 두 원소 $2,3$에 대해 서로 독립적으로 판단할 수 있으므로 $X$는 $2$번의 시행에서 성공확률이 $\\dfrac{1}{4}$인 이항분포와 같다. 따라서 $P(X=0)=\\left(\\dfrac{3}{4}\\right)^2=\\dfrac{9}{16}$, $P(X=1)={}_2C_1\\cdot\\dfrac{1}{4}\\cdot\\dfrac{3}{4}=\\dfrac{3}{8}$, $P(X=2)=\\left(\\dfrac{1}{4}\\right)^2=\\dfrac{1}{16}$이다. 평균은 $E(X)=0\\cdot\\dfrac{9}{16}+1\\cdot\\dfrac{3}{8}+2\\cdot\\dfrac{1}{16}=\\dfrac{1}{2}$이다.\n따라서 구하는 값은 $P(X=0)=\\dfrac{9}{16}, P(X=1)=\\dfrac{3}{8}, P(X=2)=\\dfrac{1}{16}, E(X)=\\dfrac{1}{2}$이다."
  },
  {
    "id": 23,
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
    "content": "원점 $O$를 출발하여 수직선 위를 움직이는 점 $A$가 있다. 한 개의 주사위를 사용하여 다음 시행을 한다.<br><div class=\"note-box\">주사위를 던져 나온 눈의 수가<br>$4$ 이하이면 점 $A$를 양의 방향으로 $2$만큼 이동시키고,<br>$5$ 이상이면 점 $A$를 음의 방향으로 $1$만큼 이동시킨다.</div><br>이 시행을 $450$번 반복하였을 때, 점 $A$의 위치가 $465$ 이하일 확률을 오른쪽 표준정규분포표를 이용하여 구하시오.",
    "image": "assets/images/25_제일고_2학기_중간_고2_확률과통계/q23.png",
    "choices": [],
    "answer": "$0.6915$",
    "solution": "[키포인트] 한 번의 이동량의 평균과 분산을 구한 뒤, $450$번의 합을 정규분포로 근사한다.\n조건 정리: 주사위 눈이 $4$ 이하이면 $+2$, $5$ 이상이면 $-1$만큼 이동한다. 따라서 한 번의 이동량을 $Y$라 하면 $P(Y=2)=\\dfrac{2}{3}$, $P(Y=-1)=\\dfrac{1}{3}$이다.\n풀이 방향: $450$번 후 위치의 평균과 표준편차를 구하고 $465$를 표준화한다.\n정석 풀이: $E(Y)=2\\cdot\\dfrac{2}{3}+(-1)\\cdot\\dfrac{1}{3}=1$이다. 또 $E(Y^2)=4\\cdot\\dfrac{2}{3}+1\\cdot\\dfrac{1}{3}=3$이므로 $V(Y)=3-1^2=2$이다. $450$번 반복 후 위치를 $S$라 하면 $E(S)=450\\cdot1=450$, $V(S)=450\\cdot2=900$이므로 표준편차는 $30$이다. 따라서 $P(S\\le465)=P\\left(Z\\le\\dfrac{465-450}{30}\\right)=P(Z\\le0.5)$이다. 표에서 $P(0\\le Z\\le0.5)=0.1915$이므로 $P(Z\\le0.5)=0.5+0.1915=0.6915$이다.\n따라서 구하는 값은 $0.6915$이다."
  }
];
