window.examTitle = "23_팔마고_1학기_기말_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "이산확률변수 $X$의 확률질량함수가\\n$P(X=x) = {}_{100}C_{x} \\\\left(\\\\dfrac{1}{5}\\\\right)^x \\\\left(\\\\dfrac{4}{5}\\\\right)^{100-x}$ ($x=0, 1, 2, \\\\cdots, 100$)\\n일 때, $X$의 분산은?",
    "choices": [
      "16",
      "20",
      "25",
      "50",
      "80"
    ],
    "answer": "①",
    "solution": "[키포인트] 확률변수 $X$가 이항분포 $B(n, p)$를 따를 때, 분산은 $V(X) = np(1-p)$이다.\\n정석 풀이: 확률질량함수의 형태로부터 확률변수 $X$는 독립시행의 횟수가 $100$이고 어떤 사건이 일어날 확률이 $\\\\dfrac{1}{5}$인 이항분포를 따름을 알 수 있다. 즉, $X \\\\sim B\\\\left(100, \\\\dfrac{1}{5}\\\\right)$이므로 이항분포의 분산 공식을 적용하면\\n$V(X) = np(1-p) = 100 \\\\times \\\\dfrac{1}{5} \\\\times \\\\left(1 - \\\\dfrac{1}{5}\\\\right) = 100 \\\\times \\\\dfrac{1}{5} \\\\times \\\\dfrac{4}{5} = 16$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$가 이항분포 $B\\\\left(18, \\\\dfrac{1}{3}\\\\right)$를 따를 때, 확률변수 $Y=3X+2$의 평균 $E(Y)$의 값은?",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "④",
    "solution": "[키포인트] 이항분포의 기댓값 $E(X) = np$와 확률변수의 변환 공식 $E(aX+b) = aE(X)+b$를 이용한다.\\n정석 풀이: $X \\\\sim B\\\\left(18, \\\\dfrac{1}{3}\\\\right)$이므로 $X$의 평균 $E(X)$는 $E(X) = 18 \\\\times \\\\dfrac{1}{3} = 6$이다.\\n확률변수 $Y=3X+2$의 평균 $E(Y)$의 성질에 대입하면\\n$E(Y) = E(3X+2) = 3E(X) + 2 = 3 \\\\times 6 + 2 = 20$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$에 대하여 $E(X)=\\\\dfrac{1}{2}$, $\\\\sigma(X)=2$일 때, $E(-4X+1)+\\\\sigma(-4X+1)$의 값은?",
    "choices": [
      "6",
      "7",
      "8",
      "15",
      "16"
    ],
    "answer": "②",
    "solution": "[키포인트] 확률변수의 선형 변환 공식 $E(aX+b) = aE(X)+b$와 $\\\\sigma(aX+b) = |a|\\\\sigma(X)$를 이용한다.\\n정석 풀이: 각각의 변환 성질을 분리하여 성분별로 계산을 전개한다.\\n1단계: $E(-4X+1) = -4E(X) + 1 = -4 \\\\times \\\\dfrac{1}{2} + 1 = -2 + 1 = -1$이다.\\n2단계: $\\\\sigma(-4X+1) = |-4|\\\\sigma(X) = 4 \\\\times 2 = 8$이다.\\n3단계: 두 구한 값의 최종 합산은 $-1 + 8 = 7$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "상자에 1, 1, 2, 3이 각각 적힌 4개의 공이 들어 있다. 이 상자에서 2개의 공을 임의추출하여 공에 적힌 숫자의 평균을 $\\\\bar{X}$라고 하자. $E(\\\\bar{X})$의 값은?",
    "choices": [
      "\\\\dfrac{1}{3}",
      "\\\\dfrac{5}{3}",
      "\\\\dfrac{6}{5}",
      "\\\\dfrac{5}{4}",
      "\\\\dfrac{7}{4}"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 표본평균 $\\\\bar{X}$의 기댓값 $E(\\\\bar{X})$는 표본의 크기 $n$에 관계없이 항상 모평균 $m$과 같다.\\n정석 풀이: 모집단의 구성 원소가 $\\\\{1, 1, 2, 3\\\\}$이므로 이 집단의 모평균 $m$을 계산하면\\n$m = E(X) = \\\\dfrac{1 + 1 + 2 + 3}{4} = \\\\dfrac{7}{4}$이다.\\n표본평균의 기댓값은 언제나 모평균과 일치하므로 $E(\\\\bar{X}) = m = \\\\dfrac{7}{4}$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "이산확률변수 $X$의 확률분포가 아래의 표와 같을 때, $X$의 분산 $V(X)$의 값은?\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$X$</th><th>0</th><th>1</th><th>2</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$\\\\dfrac{1}{6}$</td><td>$\\\\dfrac{2}{3}$</td><td>$\\\\dfrac{1}{6}$</td><td>1</td></tr></tbody></table></div>",
    "choices": [
      "\\\\dfrac{1}{3}",
      "\\\\dfrac{1}{2}",
      "\\\\dfrac{2}{3}",
      "1",
      "\\\\dfrac{3}{2}"
    ],
    "answer": "①",
    "solution": "[키포인트] 이산확률변수의 분산 공식 $V(X) = E(X^2) - \\\\{E(X)\\\\}^2$을 적용하여 계산한다.\\n정석 풀이:\\n1단계: 주어진 확률분포표로부터 평균 $E(X)$를 구하면\\n$E(X) = 0 \\\\times \\\\dfrac{1}{6} + 1 \\\\times \\\\dfrac{2}{3} + 2 \\\\times \\\\dfrac{1}{6} = 0 + \\\\dfrac{2}{3} + \\\\dfrac{1}{3} = 1$이다.\\n2단계: 제곱의 평균 $E(X^2)$을 구하면\\n$E(X^2) = 0^2 \\\\times \\\\dfrac{1}{6} + 1^2 \\\\times \\\\dfrac{2}{3} + 2^2 \\\\times \\\\dfrac{1}{6} = 0 + \\\\dfrac{2}{3} + \\\\dfrac{4}{6} = \\\\dfrac{4}{3}$이다.\\n3단계: 분산 공식을 적용하여 정산하면\\n$V(X) = E(X^2) - \\\\{E(X)\\\\}^2 = \\\\dfrac{4}{3} - 1^2 = \\\\dfrac{1}{3}$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PR-02",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "A, B 두 배구팀이 5차전의 경기를 갖는데 먼저 3승을 하는 팀이 우승한다고 한다. A팀이 매 경기를 승리할 확률이 $\\\\dfrac{1}{3}$이고 2차전까지의 경기 결과 A팀이 1승 1패하였다면 A팀이 우승할 확률은? (단, 매 경기에 무승부는 없다.)",
    "choices": [
      "\\\\dfrac{5}{27}",
      "\\\\dfrac{7}{27}",
      "\\\\dfrac{1}{3}",
      "\\\\dfrac{11}{27}",
      "\\\\dfrac{13}{27}"
    ],
    "answer": "②",
    "solution": "[키포인트] 이미 고정된 경기 상황을 제외하고, 앞으로 거두어야 할 승수를 기준으로 사건을 분류하여 독립시행의 확률을 적용한다.\\n정석 풀이: 현재 A팀은 1승 1패인 상태이므로, 최종 우승을 차지하려면 앞으로 남은 3경기(3, 4, 5차전) 중에서 2승을 추가로 더 거두어야 한다. A팀이 우승이 확정되는 시점별로 사건을 나눈다.\\n케이스 1) 4차전에서 우승이 최종 확정되는 경우 (3차전 승, 4차전 승):\\n$\\\\dfrac{1}{3} \\\\times \\\\dfrac{1}{3} = \\\\dfrac{1}{9} = \\\\dfrac{3}{27}$\\n케이스 2) 5차전에서 우승이 최종 확정되는 경우 (3, 4차전 중 1승 1패를 하고 5차전 승):\\n{}_{2}C_{1} \\\\left(\\\\dfrac{1}{3}\\\\right)^1 \\\\left(\\\\dfrac{2}{3}\\\\right)^1 \\\\times \\\\dfrac{1}{3} = 2 \\\\times \\\\dfrac{2}{9} \\\\times \\\\dfrac{1}{3} = \\\\dfrac{4}{27}$\\n따라서 A팀이 우승하게 될 총 확률은 두 확률의 합이므로\\n\\\\dfrac{3}{27} + \\\\dfrac{4}{27} = \\\\dfrac{7}{27}$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PR-02",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 P가 원점 O에 놓여 있다. 점 P는 한 개의 주사위를 던져 4의 약수의 눈이 나오면 양의 방향으로 2만큼, 4의 약수가 아닌 눈이 나오면 음의 방향으로 1만큼 이동한다. 주사위를 4번 던질 때, 점 P의 좌표가 양수일 확률은?",
    "choices": [
      "\\\\dfrac{5}{8}",
      "\\\\dfrac{11}{16}",
      "\\\\dfrac{13}{16}",
      "\\\\dfrac{21}{32}",
      "\\\\dfrac{35}{64}"
    ],
    "answer": "②",
    "solution": "[키포인트] 특정 사건이 일어나는 독립시행의 횟수를 변수로 설정하여 점 P의 좌표 식을 수립한다.\\n정석 풀이: 주사위를 한 번 던질 때 4의 약수(\\\\{1, 2, 4\\\\})의 눈이 나올 확률은 $p = \\\\dfrac{3}{6} = \\\\dfrac{1}{2}$이고, 4의 약수가 아닌 눈이 나올 확률은 $q = 1 - \\\\dfrac{1}{2} = \\\\dfrac{1}{2}$이다. 주사위를 총 4번 던지는 과정 중 4의 약수의 눈이 나오는 횟수를 $X$라 하면, 4의 약수가 아닌 눈이 나오는 횟수는 $4-X$가 된다. 이때 점 P의 최종 좌표 위치는\\n$2X - 1(4-X) = 3X - 4$\\n최종 좌표가 양수여야 하므로 조건 부등식을 세우면\\n$3X - 4 \\\\gt 0 \\\\implies X \\\\gt \\\\dfrac{4}{3}$\\n이때 시행 횟수 $X$는 정수이므로 가능한 $X$의 값은 2, 3, 4이다. 각 확률을 구하면\\n- $X=2$: {}_{4}C_{2} \\\\left(\\\\dfrac{1}{2}\\\\right)^2 \\\\left(\\\\dfrac{1}{2}\\\\right)^2 = 6 \\\\times \\\\dfrac{1}{16} = \\\\dfrac{6}{16}$\\n- $X=3$: {}_{4}C_{3} \\\\left(\\\\dfrac{1}{2}\\\\right)^3 \\\\left(\\\\dfrac{1}{2}\\\\right)^1 = 4 \\\\times \\\\dfrac{1}{16} = \\\\dfrac{4}{16}$\\n- $X=4$: {}_{4}C_{4} \\\\left(\\\\dfrac{1}{2}\\\\right)^4 = 1 \\\\times \\\\dfrac{1}{16} = \\\\dfrac{1}{16}$\\n따라서 점 P의 좌표가 양수일 총 확률은 이들의 합이므로\\n\\\\dfrac{6 + 4 + 1}{16} = \\\\dfrac{11}{16}$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(m, \\\\sigma^2)$을 따르고 $P(X \\\\le 17) = P(X \\\\ge 23)$일 때, $m \\\\times P(X \\\\ge m)$의 값은?",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "③",
    "solution": "[키포인트] 정규분포 확률밀도함수의 완전 대칭 성질을 이용해 평균 $m$을 구한다.\\n정석 풀이: 정규분포 곡선은 평균 $m$에 대하여 좌우가 완전히 대칭인 종 모양이다. 조건에서 $P(X \\\\le 17) = P(X \\\\ge 23)$이 성립하므로, 두 경계값인 17과 23의 정중앙에 대칭축인 평균 $m$이 위치해야 한다.\\n$m = \\\\dfrac{17 + 23}{2} = 20$\\n연속확률변수가 정규분포를 따를 때, 대칭축인 평균 이상일 확률은 항상 전체 넓이의 절반인 $0.5$이다. 즉, $P(X \\\\ge m) = \\\\dfrac{1}{2}$이 성립한다. 구하고자 하는 연산 값은\\n$m \\\\times P(X \\\\ge m) = 20 \\\\times \\\\dfrac{1}{2} = 10$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "확률변수 $X$가 정규분포 $N(50, 4)$를 따를 때, 함수 $F(x) = P(X \\\\le x)$에 대하여 오른쪽 표준정규분포표를 이용하여 $F(52) - F(47)$의 값을 구한 것은?\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    "choices": [
      "0.6247",
      "0.6687",
      "0.7745",
      "0.8185",
      "0.9104"
    ],
    "answer": "③",
    "solution": "[키포인트] 정규분포의 표준화 변환 공식 $Z = \\\\dfrac{X - m}{\\\\sigma}$를 사용하여 표준정규분포 변수로 고친다.\\n정석 풀이: 조건에서 모평균 $m = 50$, 분산이 4이므로 표준편차 $\\\\sigma = \\\\sqrt{4} = 2$이다. 구하고자 하는 식은 $F(52) - F(47) = P(47 \\\\le X \\\\le 52)$와 같다. 양 끝 경계에 대해 표준화를 수행하면\\n$X = 47 \\\\implies Z = \\\\dfrac{47 - 50}{2} = -1.5$\\n$X = 52 \\\\implies Z = \\\\dfrac{52 - 50}{2} = 1.0$\\n따라서 주어지거나 유도된 확률값은\\n$P(-1.5 \\\\le Z \\\\le 1.0) = P(-1.5 \\\\le Z \\\\le 0) + P(0 \\\\le Z \\\\le 1.0) = P(0 \\\\le Z \\\\le 1.5) + P(0 \\\\le Z \\\\le 1.0)$이다. 표에서 수치를 대입하면\\n$0.4332 + 0.3413 = 0.7745$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "어느 영화에 대한 관람객의 평점은 모평균이 $m$점, 모표준편차가 5점인 정규분포를 따른다고 한다. 모평균 $m$을 신뢰도 95%로 추정할 때, 신뢰구간의 길이가 2 이하가 되기 위한 표본의 크기 $n$의 최솟값은? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z| \\\\le 1.96) = 0.95$로 계산한다.)",
    "choices": [
      "9",
      "10",
      "11",
      "96",
      "97"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 모평균 추정에서의 신뢰구간의 길이 공식 $L = 2k \\\\dfrac{\\\\sigma}{\\\\sqrt{n}}$을 수립하여 푼다.\\n정석 풀이: 조건에서 모표준편차 $\\\\sigma = 5$이고 신뢰도 95%에 대응하는 신뢰상수 $k = 1.96$이다. 신뢰구간의 길이 공식을 적용하면\\n$L = 2 \\\\times 1.96 \\\\times \\\\dfrac{5}{\\\\sqrt{n}} = \\\\dfrac{19.6}{\\\\sqrt{n}}$\\n이 길이가 2 이하가 되어야 하므로 부등식을 작성하면\\n$\\\\dfrac{19.6}{\\\\sqrt{n}} \\\\le 2 \\\\implies \\\\sqrt{n} \\\\ge 9.8$\\n양변을 제곱하여 정리하면 $n \\\\ge (9.8)^2 = 96.04$가 된다. 표본의 크기 $n$은 반드시 자연수 구조여야 하므로 만족하는 자연수 $n$의 최솟값은 97이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "조건부확률",
    "originalCategory": "조건부확률",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-PR-02",
    "standardUnit": "조건부확률",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "복수정답"
    ],
    "wide": false,
    "content": "공사건이 아닌 두 사건 $A$, $B$가 서로 독립일 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은?\\n\\n<보기>\\nㄱ. $P(B|A^C) = P(B)$\\nㄴ. $P(A^C \\\\cup B^C) = 1 - P(A)P(B)$\\nㄷ. $P(A \\\\cup B) - P(B) = P(A)P(B^C)$",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 두 사건이 독립일 때 성립하는 정의 $P(A \\\\cap B) = P(A)P(B)$와 여사건의 성질을 연동한다.\\n정석 풀이:\\nㄱ. 두 사건 $A, B$가 독립이면 그 여사건인 $A^C$와 $B$도 서로 독립이다. 따라서 조건부확률에서 원인 사건의 발생 여부는 결과에 영향을 주지 못하므로 $P(B|A^C) = P(B)$가 성립한다. (참)\\nㄴ. 드모르간의 법칙에 의해 $A^C \\\\cup B^C = (A \\\\cap B)^C$가 성립한다. 따라서 여사건의 확률에 의해 $P(A^C \\\\cup B^C) = 1 - P(A \\\\cap B)$이다. $A, B$가 독립이므로 이를 대입하면 $1 - P(A)P(B)$가 유도된다. (참)\\nㄷ. 좌변의 식을 합사건 확률 법칙을 통해 정리하면 $P(A \\\\cup B) - P(B) = \\\\{P(A) + P(B) - P(A \\\\cap B)\\\\} - P(B) = P(A) - P(A \\\\cap B)$이다. $A, B$가 독립이므로 $P(A) - P(A)P(B) = P(A)\\\\{1 - P(B)\\\\} = P(A)P(B^C)$가 되어 우변 식과 동일해진다. (참)\\n따라서 ㄱ, ㄴ, ㄷ 모두 옳으므로 정답은 ⑤이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "복수정답"
    ],
    "wide": false,
    "content": "연속확률변수 $X$의 확률밀도함수가 $f(x) = k|x| + k$ ($-1 \\\\le x \\\\le 2$)일 때, 확률 $P(0 \\\\le X \\\\le 1)$의 값은? (단, $k \\\\ne 0$)",
    "choices": [
      "3/11",
      "4/11",
      "5/11",
      "6/11",
      "7/11"
    ],
    "answer": "①",
    "solution": "[키포인트] 연속확률변수의 확률밀도함수가 갖는 전 구간 면적의 총합은 항상 1임을 이용한다.\\n정석 풀이:\\n1단계: 전 구간인 $-1$부터 $2$까지의 정적분(혹은 기하적 넓이)이 1임을 세운다.\\n$\\\\int_{-1}^{2} (k|x| + k) dx = 1$\\n절댓값 기호 내부 부호에 따라 구간을 분리하여 적분하면\\n$\\\\int_{-1}^{0} k(-x+1) dx + \\\\int_{0}^{2} k(x+1) dx = 1$\\n$k \\\\left[ -\\\\dfrac{1}{2}x^2 + x \\\\right]_{-1}^{0} + k \\\\left[ \\\\dfrac{1}{2}x^2 + x \\\\right]_{0}^{2} = 1$\\n$k \\\\left( 0 - \\\\left(-\\\\dfrac{1}{2}-1\\\\right) \\\\right) + k (2+2-0) = 1 \\\\implies \\\\dfrac{3}{2}k + 4k = 1 \\\\implies \\\\dfrac{11}{2}k = 1$\\n따라서 미지수 상수는 $k = \\\\dfrac{2}{11}$이다.\\n2단계: 구하고자 하는 특정 범위의 확률 $P(0 \\\\le X \\\\le 1)$을 정적분으로 구하면\\n$P(0 \\\\le X \\\\le 1) = \\\\int_{0}^{1} \\\\dfrac{2}{11}(x+1) dx = \\\\dfrac{2}{11} \\\\left[ \\\\dfrac{1}{2}x^2 + x \\\\right]_{0}^{1} = \\\\dfrac{2}{11} \\\\times \\\\dfrac{3}{2} = \\\\dfrac{3}{11}$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "동전 1개를 던져서 앞면이 나오면 3점을 얻고, 뒷면이 나오면 1점을 잃는 게임을 하였다. 동전 1개를 100번 던진 후, 최종 점수가 120점 이상이 될 확률을 오른쪽 표준정규분포표를 이용하여 구한 것은?\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    "choices": [
      "0.9332",
      "0.8413",
      "0.3413",
      "0.1587",
      "0.0228"
    ],
    "answer": "④",
    "solution": "[키포인트] 시행 횟수 $n$이 충분히 크므로 독립시행의 이항분포를 정규분포로 근사시켜 표준화한다.\\n정석 풀이: 동전 1개를 100번 던지는 시행에서 앞면이 발생하는 횟수를 확률변수 $X$라 정의하자. $X$는 이항분포 $B\\\\left(100, \\\\dfrac{1}{2}\\\\right)$를 정교하게 따른다. 이때 뒷면이 발생하는 횟수는 $100-X$이므로 최종 점수 변수 성립 식은 다음과 같다.\\n점수 $= 3X - 1(100-X) = 4X - 100$\\n최종 점수가 120점 이상이 될 확률 영역 조건은\\n$4X - 100 \\\\ge 120 \\\\implies 4X \\\\ge 220 \\\\implies X \\\\ge 55$\\n확률변수 $X$의 근사적 분포 요소를 구하면, 평균 $m = 100 \\\\times \\\\dfrac{1}{2} = 50$, 분산 $\\\\sigma^2 = 100 \\\\times \\\\dfrac{1}{2} \\\\times \\\\dfrac{1}{2} = 25 = 5^2$이므로 $X$는 정규분포 $N(50, 5^2)$을 근사적으로 추종한다. 이 조건을 기준으로 표준화를 수행하면\\n$Z = \\\\dfrac{55 - 50}{5} = 1.0$\\n따라서 최종 목표 확률은 $P(Z \\\\ge 1.0) = 0.5 - P(0 \\\\le Z \\\\le 1.0) = 0.5 - 0.3413 = 0.1587$이 된다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 14,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "어느 고등학교 학생들을 대상으로 학교생활에 대한 만족도를 조사하였더니 전체 학생 중에서 80%가 만족한다고 응답하였다. 이 학교 학생 400명을 임의로 택하였을 때, 학교생활에 만족한다고 응답한 학생이 324명 이상 $k$명 이하일 확률이 0.2857이다. 이때, 오른쪽 표준정규분포표를 이용하여 상수 $k$의 값을 구한 것은?\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    "choices": [
      "328",
      "332",
      "336",
      "340",
      "344"
    ],
    "answer": "③",
    "solution": "[키포인트] 만족하는 표본 학생 수의 분포를 이항분포의 정규분포 근사를 동원해 표준화 변수로 치환한다.\\n정석 풀이: 만족한다고 응답한 학생의 수를 확률변수 $X$라 명명하면, $X$는 이항분포 $B(400, 0.8)$을 성실히 따르게 된다. 기댓값과 분산을 구하면 $E(X) = 400 \\\\times 0.8 = 320$, $V(X) = 400 \\\\times 0.8 \\\\times 0.2 = 64 = 8^2$이 성립하므로, $X$는 근사적으로 정규분포 $N(320, 8^2)$에 수렴한다. 조건의 확률식 $P(324 \\\\le X \\\\le k) = 0.2857$에서 각 한계점을 표준화하면\\n$X = 324 \\\\implies Z = \\\\dfrac{324 - 320}{8} = 0.5$\\n$X = k \\\\implies Z = z_k = \\\\dfrac{k - 320}{8}$\\n전개하면 $P(0.5 \\\\le Z \\\\le z_k) = P(0 \\\\le Z \\\\le z_k) - P(0 \\\\le Z \\\\le 0.5) = 0.2857$ 구조를 형성한다. 표에서 $P(0 \\\\le Z \\\\le 0.5) = 0.1915$이므로\\n$P(0 \\\\le Z \\\\le z_k) = 0.2857 + 0.1915 = 0.4772$로 정리된다. 표에서 확률 면적 $0.4772$에 일치하는 경계 $z$값은 $2.0$이므로\\n$z_k = \\\\dfrac{k - 320}{8} = 2.0 \\\\implies k - 320 = 16 \\\\implies k = 336$이다.\\n따라서 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "정규분포 $N(m, 1)$을 따르는 모집단에서 표본 100개를 임의추출하여 표본평균을 측정하였더니 10이었다. 모평균 $m$에 대한 신뢰도 $\\\\alpha\\\\%$의 신뢰구간이 $9.9 \\\\le m \\\\le 10.1$일 때, 오른쪽 표준정규분포표를 이용하여 상수 $\\\\alpha$의 값을 구한 것은?\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    "choices": [
      "68.26",
      "77.45",
      "81.85",
      "86.64",
      "95.44"
    ],
    "answer": "①",
    "solution": "[키포인트] 신뢰구간 형태의 대칭 반경 $\\\\bar{X} \\\\pm k \\\\dfrac{\\\\sigma}{\\\\sqrt{n}}$ 구조에서 신뢰상수 $k$를 도출한다.\\n정석 풀이: 추출 조사 결과 표본평균 $\\\\bar{X} = 10$, 모표준편차 $\\\\sigma = 1$, 표본의 총량 $n = 100$이다. 모평균의 신뢰구간 상한 조건식을 확인하면\\n$\\\\bar{X} + k \\\\dfrac{\\\\sigma}{\\\\sqrt{n}} = 10.1 \\\\implies 10 + k \\\\times \\\\dfrac{1}{\\\\sqrt{100}} = 10.1$\\n$10 + \\\\dfrac{k}{10} = 10.1 \\\\implies \\\\dfrac{k}{10} = 0.1 \\\\implies k = 1.0$\\n구해진 신뢰상수 $k=1.0$을 기초로 한 표준정규분포 상의 대응 확률 범위를 확인하면 $P(-1.0 \\\\le Z \\\\le 1.0) = 2 \\\\times P(0 \\\\le Z \\\\le 1.0)$이다. 표의 데이터 수치를 대입하면\\n$2 \\\\times 0.3413 = 0.6826$\\n이를 신뢰도 지표인 백분율로 환산 표현하면 $68.26\\\\%$이므로 상수 $\\\\alpha = 68.26$이다.\\n따라서 정답은 ①이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "어느 자격시험에 응시한 수험생의 점수는 정규분포 $N(70, \\\\sigma^2)$을 따른다고 한다. 이 자격시험에서 상위 15%에 해당되는 점수가 75.2점일 때, 상위 10%에 해당되는 점수를 $x$라 하자. $\\\\sigma + x$의 값은? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0 \\\\le Z \\\\le 1.04) = 0.35$, $P(0 \\\\le Z \\\\le 1.28) = 0.4$로 계산한다.)",
    "choices": [
      "79.2",
      "80.3",
      "80.9",
      "81.4",
      "82.1"
    ],
    "answer": "④",
    "solution": "[키포인트] 비율 분포 경계를 표준정규분포 축의 $z$값 조건으로 정렬하여 필요한 미지수를 순차 연산한다.\\n정석 풀이:\\n1단계: 상위 15% 조건은 $P(X \\\\ge 75.2) = 0.15 \\\\implies P(0 \\\\le Z \\\\le z_1) = 0.35$ 관계를 띄므로 단서 조건 조항에 의해 표준화 경계값은 $1.04$가 매칭된다. 표준화 변환식에 대입하면\\n$\\\\dfrac{75.2 - 70}{\\\\sigma} = 1.04 \\\\implies \\\\dfrac{5.2}{\\\\sigma} = 1.04 \\\\implies \\\\sigma = 5$가 유도된다.\\n2단계: 상위 10% 조건은 $P(X \\\\ge x) = 0.10 \\\\implies P(0 \\\\le Z \\\\le z_2) = 0.40$ 관계를 형성하므로 단서 조건 조항에 의거하여 표준화 경계값은 $1.28$이 지정된다. 대입하면\\n$\\\\dfrac{x - 70}{5} = 1.28 \\\\implies x - 70 = 6.4 \\\\implies x = 76.4$이다.\\n3단계: 최종 요구하는 산출 연산은\\n$\\\\sigma + x = 5 + 76.4 = 81.4$이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "연속확률변수 $X$가 정규분포 $N(k, 5^2)$을 따르는 함수 $f(k) = P(0 \\\\le X \\\\le 10)$에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?\\n\\n<보기>\\nㄱ. $f(0) = f(10)$\\nㄴ. 임의의 실수 $k$에 대하여 $f(k) = f(5-k)$이다.\\nㄷ. 함수 $f(k)$는 $k=5$일 때 최댓값을 갖는다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "[키포인트] 정규분포 함수 대칭축의 변동에 따른 일정 구간 길이 영역 안에서의 확률 적분 면적 변화를 가늠한다.\\n정석 풀이:\\nㄱ. $f(0)$은 축 위치가 $0$일 때의 구간 $[0, 10]$의 면적이므로 표준화 시 $P(0 \\\\le Z \\\\le 2)$이다. $f(10)$은 축 위치가 $10$일 때의 구간 $[0, 10]$ 면적이므로 표준화 시 $P(-2 \\\\le Z \\\\le 0) = P(0 \\\\le Z \\\\le 2)$가 되어 완벽히 일치하므로 참이다. (참)\\nㄴ. 확률 적분 대상 구간인 $[0, 10]$의 정중앙 지점은 $5$이다. 따라서 확률 함수 $f(k)$는 대칭축 위치인 평균 $k=5$를 정중앙 대칭축으로 가지는 구조를 만족하므로 선대칭 관계는 $f(k) = f(10-k)$여야 한다. 따라서 명제는 거짓이다. (거짓)\\nㄷ. 관측 구간의 물리적 길이($10$)가 상수로 묶여 있으므로, 정규분포 곡선의 정점부(평균 $k$)가 고정구간 한가운데인 $5$에 정렬하여 정위치할 때 면적 적분값이 가장 극대화된다. 따라서 $k=5$에서 최댓값을 가진다는 참이다. (참)\\n따라서 최종 결론상 옳은 선지는 ㄱ, ㄷ 구조이다.\\n따라서 정답은 ④이다."
  },
  {
    "id": 18,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "표"
    ],
    "wide": false,
    "content": "어느 공장에서 생산하는 칫솔 한 개의 무게는 평균이 $20\\\\text{g}$이고 표준편차가 $4\\\\text{g}$인 정규분포를 따른다고 한다. 이 공장에서 판매하는 칫솔 한 상자에는 이 공장에서 임의추출한 칫솔 4개가 들어 있고 무게의 합이 $x\\\\text{g}$ 미만이면 불량품으로 판정한다고 한다. 이 공장에서 판매하는 칫솔 상자 1개를 임의로 선택할 때, 선택한 한 상자가 불량품으로 판정될 확률이 0.0228이다. 오른쪽 표준정규분포표를 이용하여 $x$의 값을 구한 것은? (단, 칫솔 상자의 무게는 고려하지 않는다.)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    "choices": [
      "56",
      "64",
      "72",
      "78",
      "85"
    ],
    "answer": "②",
    "solution": "[키포인트] 임의추출한 확률변수의 합 $S_n$에 대한 고유 정규분포 조합을 산출하여 표준화 연산을 완수한다.\\n정석 풀이: 개별 칫솔 1개의 무게 성분을 확률변수 $X$라 지칭하면 $X \\\\sim N(20, 4^2)$을 따른다. 추출 표본의 수 $n=4$이므로 4개 칫솔 무게의 총합을 새로운 통계 변수 $S$라고 수립하면 $S = X_1 + X_2 + X_3 + X_4$이다. $S$의 평균과 분산 기초 성질을 정리하면\\n$E(S) = 4 \\\\times 20 = 80$\\n$V(S) = 4 \\\\times 4^2 = 64 = 8^2$\\n이로 인해 무게합 변수는 정규분포 $N(80, 8^2)$의 거동을 보인다. 조건에서 상자가 불량품으로 최종 격하 판정될 확률 지표가 $0.0228$이므로 식을 연립하면 $P(S \\\\lt x) = 0.0228$ 구조이다. 해당 변수를 표준정규화식으로 변환하면\\n$P\\\\left(Z \\\\lt \\\\dfrac{x - 80}{8}\\\\right) = 0.0228$\\n표의 단서 정보에 따르면 $P(0 \\\\le Z \\\\le 2.0) = 0.4772$이므로 하방 하위 경계 꼬리 면적이 $0.0228$이 성립하는 대칭점의 기하적 대응 한계 위치는 $-2.0$이다.\\n$\\\\dfrac{x - 80}{8} = -2.0 \\\\implies x - 80 = -16 \\\\implies x = 64$이다.\\n따라서 정답은 ②이다."
  },
  {
    "id": 19,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "기출"
    ],
    "wide": false,
    "content": "어느 과수원에서 수확한 수박의 무게는 정규분포 $N(3m, 15^2)$을 따르고, 멜론의 무게는 정규분포 $N(m, 9^2)$을 따른다고 한다. 이 과수원에서 수확한 수박과 멜론 중에서 임의로 9개씩 택할 때, 택한 수박 9개의 평균 무게가 $k$ 이상일 확률과 멜론 9개의 평균 무게가 $k$ 이하일 확률이 같다. 이때, $\\\\dfrac{k}{m}$의 값은? (단, $m, k$는 0보다 큰 실수이다.)",
    "choices": [
      "1/2",
      "1",
      "5/4",
      "3/2",
      "7/4"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 서로 다른 두 표본평균 $\\\\bar{X}$와 $\\\\bar{Y}$의 정규분포를 별도로 도출하여 각각 표준화 변환을 수행한다.\\n정석 풀이: 수박의 모집단 확률변수를 $X$, 멜론의 모집단 확률변수를 $Y$라 명명하고 추출 표본수 $n=9$에 입각한 각각의 독립적 표본평균 변수의 확률수렴 형태를 정산한다.\\n$\\\\bar{X} \\\\sim N\\\\left(3m, \\\\left(\\\\dfrac{15}{\\\\sqrt{9}}\\\\right)^2\\\\right) = N(3m, 5^2)$\\n$\\\\bar{Y} \\\\sim N\\\\left(m, \\\\left(\\\\dfrac{9}{\\\\sqrt{9}}\\\\right)^2\\\\right) = N(m, 3^2)$\\n조건에서 명시한 등식 확률 관계 구조인 $P(\\\\bar{X} \\\\ge k) = P(\\\\bar{Y} \\\\le k)$에 표준화 식을 연립하여 적어주면\\n$P\\\\left(Z \\\\ge \\\\dfrac{k - 3m}{5}\\\\right) = P\\\\left(Z \\\\le \\\\dfrac{k - m}{3}\\\\right)$\\n표준정규분포 곡선의 기하 대칭 원리상 한쪽 방향의 이상 영역 넓이와 반대 방향의 이하 영역 넓이가 정합하려면 두 유도된 경계 좌표값의 크기가 같고 부호가 반대여야 하므로, 대수적 합산 수치는 $0$이 성립해야만 한다.\\n$\\\\dfrac{k - 3m}{5} + \\\\dfrac{k - m}{3} = 0 \\\\implies 3(k - 3m) + 5(k - m) = 0$\\n$3k - 9m + 5k - 5m = 0 \\\\implies 8k = 14m \\\\implies \\\\dfrac{k}{m} = \\\\dfrac{14}{8} = \\\\dfrac{7}{4}$이다.\\n따라서 정답은 ⑤이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
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
    "content": "[서답형(서술형) 1] [총 7점]\\n한 쪽 면에만 1, 2, 3, 4의 숫자가 하나씩 적혀 있는 4장의 카드가 숫자가 보이지 않도록 놓여 있다. 이 4장의 카드에서 임의로 한 장씩 카드를 뒤집어 카드에 적힌 수를 확인할 때, 처음으로 짝수가 적혀 있는 카드를 뒤집을 때까지 뒤집은 카드의 총 개수를 확률변수 $X$라 하자. 다음 물음에 답하시오. (단, 뒤집은 카드는 다시 뒤집지 않는다.)\\n\\n(1) 위 확률분포표에 제시된 $b, c$의 값을 구하고, 그 풀이 과정을 서술하시오. [3점]\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$X$</th><th>1</th><th>2</th><th>3</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$a$</td><td>$b$</td><td>$c$</td><td>1</td></tr></tbody></table></div>",
    "choices": [],
    "answer": "b=1/3, c=1/6",
    "solution": "[키포인트] 비복원 순차 추출 조건에서 조건부 확률곱 정리를 적용하여 개별 확률 변수 항목의 대응 확률을 구한다.\\n정석 풀이: 전체 수 구성원 \\\\{1, 2, 3, 4\\\\} 내부에서 홀수 카드는 2장, 짝수 카드는 2장 분배되어 있다. 시행 회차별로 비복원 확률 연산을 전개한다.\\n- $X=1$ 확률 $a$: 최초 첫 시행회차에 단번에 짝수가 뽑히는 상황이므로 $a = \\\\dfrac{2}{4} = \\\\dfrac{1}{2}$이다.\\n- $X=2$ 확률 $b$: 첫 번째 시도에는 홀수가 집계되고 두 번째 시도에 연속해서 짝수가 집계되는 비복원 조건부 확률이므로 $b = \\\\dfrac{2}{4} \\\\times \\\\dfrac{2}{3} = \\\\dfrac{1}{3}$이다.\\n- $X=3$ 확률 $c$: 첫 번째 및 두 번째 시도에 연달아 홀수들만 제거된 후 세 번째에 짝수가 집계되는 흐름이므로 $c = \\\\dfrac{2}{4} \\\\times \\\\dfrac{1}{3} \\\\times \\\\dfrac{2}{2} = \\\\dfrac{1}{6}$이다.\\n따라서 서술형 조건을 거쳐 최종 산출되는 값은 $b = \\\\dfrac{1}{3}$, $c = \\\\dfrac{1}{6}$이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
    "standardUnit": "확률분포",
    "standardUnitOrder": 5,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형"
    ],
    "wide": false,
    "content": "[서답형(서술형) 1]의 소문항 (2)\\n(2) $V(X)$의 값을 구하고, 그 풀이과정을 서술하시오. [4점]",
    "choices": [],
    "answer": "5/9",
    "solution": "[키포인트] 전 단계에서 수립된 이산확률변수 $X$의 확률 질량 데이터 분포를 기반으로 분산 유도 정석 공식을 수행한다.\\n정석 풀이: 전항 소문항 유도 결과에 기반해 확률변수 $X$의 이산 확률은 $P(X=1)=\\\\dfrac{1}{2}$, $P(X=2)=\\\\dfrac{1}{3}$, $P(X=3)=\\\\dfrac{1}{6}$의 변량 분포를 취한다.\\n1단계: 대수적 평균 $E(X)$의 총합을 구하면\\n$E(X) = 1 \\\\times \\\\dfrac{1}{2} + 2 \\\\times \\\\dfrac{1}{3} + 3 \\\\times \\\\dfrac{1}{6} = \\\\dfrac{1}{2} + \\\\dfrac{2}{3} + \\\\dfrac{1}{2} = \\\\dfrac{5}{3}$이다.\\n2단계: 변량 제곱에 대한 기댓값 $E(X^2)$ 총합을 유도하면\\n$E(X^2) = 1^2 \\\\times \\\\dfrac{1}{2} + 2^2 \\\\times \\\\dfrac{1}{3} + 3^2 \\\\times \\\\dfrac{1}{6} = \\\\dfrac{1}{2} + \\\\dfrac{4}{3} + \\\\dfrac{9}{6} = \\\\dfrac{10}{3}$이다.\\n3단계: 최종 분산식 연산 관계식에 결과 수치들을 대입 및 정리하면\\n$V(X) = E(X^2) - \\\\{E(X)\\\\}^2 = \\\\dfrac{10}{3} - \\\\left(\\\\dfrac{5}{3}\\\\right)^2 = \\\\dfrac{10}{3} - \\\\dfrac{25}{9} = \\\\dfrac{30 - 25}{9} = \\\\dfrac{5}{9}$이다.\\n따라서 구하는 최종 분산의 값은 $\\\\dfrac{5}{9}$이다."
  },
  {
    "id": 22,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
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
    "content": "[서답형(서술형) 2] [총 7점]\n확률변수 $X$의 확률질량함수가 $P(X=x)=p_x$ ($x=1,2,3,4$)이고 $p_{x+1}-p_x = \dfrac{x}{30}$ ($x=1,2,3$)을 만족한다. 다음 물음에 답하시오.\n\n(1) $P(X=1)=p_1$의 값을 구하고, 그 풀이과정을 서술하시오. [4점]",
    "choices": [],
    "answer": "1/6",
    "solution": "[키포인트] 확률의 총합이 1이라는 조건을 이용하여 $p_1, p_2, p_3, p_4$를 하나의 변수 $p_1$로 나타낸 뒤 방정식을 세운다.\n정석 풀이: 주어진 조건 $p_{x+1}-p_x = \dfrac{x}{30}$에 $x=1,2,3$을 차례로 대입한다.\n$p_2 = p_1 + \dfrac{1}{30}$\n$p_3 = p_2 + \dfrac{2}{30} = p_1 + \dfrac{3}{30}$\n$p_4 = p_3 + \dfrac{3}{30} = p_1 + \dfrac{6}{30}$\n확률질량함수의 전체 확률의 합은 1이므로 다음 식이 성립한다.\n$p_1 + \left(p_1 + \dfrac{1}{30}\right) + \left(p_1 + \dfrac{3}{30}\right) + \left(p_1 + \dfrac{6}{30}\right) = 1$\n$4p_1 + \dfrac{10}{30} = 1$\n$4p_1 + \dfrac{1}{3} = 1 \implies 4p_1 = \dfrac{2}{3}$\n$p_1 = \dfrac{2}{3} \div 4 = \dfrac{2}{3} \times \dfrac{1}{4} = \dfrac{1}{6}$\n따라서 구하는 값은 $\dfrac{1}{6}$이다."
  },
  {
    "id": 23,
    "level": "중",
    "category": "확률분포",
    "originalCategory": "확률분포",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-02",
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
    "content": "[서답형(서술형) 2]의 소문항 (2)\n(2) $P(X^2-5X+6 \le 0)$의 값을 구하고, 그 풀이과정을 서술하시오. [3점]",
    "choices": [],
    "answer": "7/15",
    "solution": "[키포인트] 부등식 $X^2-5X+6 \le 0$을 만족하는 $X$의 범위를 찾고, 앞 문항에서 구한 $p_1=\dfrac{1}{6}$을 이용하여 필요한 확률을 더한다.\n정석 풀이: 먼저 부등식을 인수분해하면 다음과 같다.\n$X^2 - 5X + 6 \le 0 \implies (X - 2)(X - 3) \le 0 \implies 2 \le X \le 3$\n확률변수 $X$는 $1,2,3,4$의 값을 가지므로 구하는 확률은 다음과 같다.\n$P(X^2-5X+6 \le 0) = P(2 \le X \le 3) = p_2 + p_3$\n앞 문항에서 $p_1 = \dfrac{1}{6}$이고, 주어진 조건에 의해\n$p_2 = p_1 + \dfrac{1}{30} = \dfrac{1}{6} + \dfrac{1}{30} = \dfrac{5}{30} + \dfrac{1}{30} = \dfrac{6}{30} = \dfrac{1}{5}$\n$p_3 = p_1 + \dfrac{3}{30} = \dfrac{1}{6} + \dfrac{3}{30} = \dfrac{5}{30} + \dfrac{3}{30} = \dfrac{8}{30} = \dfrac{4}{15}$\n따라서\n$P(2 \le X \le 3) = \dfrac{1}{5} + \dfrac{4}{15} = \dfrac{3}{15} + \dfrac{4}{15} = \dfrac{7}{15}$\n따라서 구하는 값은 $\dfrac{7}{15}$이다."
  },
  {
    "id": 24,
    "level": "중",
    "category": "통계적 추정",
    "originalCategory": "통계적 추정",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H15-ST-03",
    "standardUnit": "통계적 추정",
    "standardUnitOrder": 6,
    "questionType": "서술형",
    "layoutTag": "grid",
    "tags": [
      "기출",
      "서술형",
      "표"
    ],
    "wide": false,
    "content": "[서답형(서술형) 3] [총 6점]\\n정규분포 $N(m, \\\\sigma^2)$을 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 그 표본평균을 $\\\\bar{X}$라 하자. 모평균 $m$의 신뢰도 95%의 신뢰구간을 $a \\\\le m \\\\le b$라 할 때, $b-a = 23.52$이다. 오른쪽 표준정규분포표를 이용하여 물음에 답하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때 $P(0 \\\\le Z \\\\le 1.96) = 0.4750$, $P(0 \\\\le Z \\\\le 2.0) = 0.4772$로 계산한다.)\\n\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0 \\\\le Z \\\\le z)$</th></tr></thead><tbody><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>1.96</td><td>0.4750</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>\\n\\n(1) 표본평균의 표준편차 $\\\\sigma(\\\\bar{X})$의 값을 구하고, 그 풀이 과정을 서술하시오. [3.5점]",
    "choices": [],
    "answer": "6",
    "solution": "[키포인트] 모평균 추정에서의 신뢰구간의 길이 공식 $b-a = 2k \\\\dfrac{\\\\sigma}{\\\\sqrt{n}}$과 표본평균 표준편차 공식 $\\\\sigma(\\\\bar{X}) = \\\\dfrac{\\\\sigma}{\\\\sqrt{n}}$의 대수적 연계성을 활용한다.\\n정석 풀이: 신뢰도 95% 조건의 모평균 추정 조건이 성립하므로, 첨부 분포 수표 상의 수치 근거 $P(0 \\\\le Z \\\\le 1.96) = 0.4750$ 조항을 통해 대응하는 양측 신뢰상수 값은 $k = 1.96$임을 명확히 판별할 수 있다. 신뢰구간의 전체 물리적 길이에 관한 연산 식 구조를 구성하면 다음과 같다.\\n$b-a = 2 \\\\times 1.96 \\\\times \\\\dfrac{\\\\sigma}{\\\\sqrt{n}} = 23.52$\\n이때 식 내부의 핵심 인자인 $\\\\dfrac{\\\\sigma}{\\\\sqrt{n}}$ 성분은 유도 규칙 정의상 표본평균의 고유 표준편차 변량 지표인 $\\\\sigma(\\\\bar{X})$와 동치 관계이다. 이를 대치하여 단순화 수식을 수립하면\\n$2 \\\\times 1.96 \\\\times \\\\sigma(\\\\bar{X}) = 23.52 \\\\implies 3.92 \\\\times \\\\sigma(\\\\bar{X}) = 23.52$\\n최종 대수 연산을 정산하면 $\\\\sigma(\\\\bar{X}) = \\\\dfrac{23.52}{3.92} = 6$이 성립된다.\\n따라서 구하는 값은 6이다."
  }
];
