window.examTitle = "23_팔마고_1학기_기말_고2_확률과통계";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "이산확률변수 $X$의 확률질량함수가\n$P(X=x) = {}_{100}C_{x} \\left(\\dfrac{1}{5}\\right)^x \\left(\\dfrac{4}{5}\\right)^{100-x}$ \n($x=0, 1, 2, \\cdots, 100$)\n일 때, $X$의 분산은?",
    choices: [
    "16",
    "20",
    "25",
    "50",
    "80"
  ],
    answer: "①",
    solution: "[키포인트] 확률변수 $X$가 이항분포 $B(n,p)$를 따를 때, 분산은 $V(X)=np(1-p)$이다.\n조건 정리: 주어진 확률질량함수는 $n=100$, $p=\\dfrac{1}{5}$인 이항분포의 꼴이다.\n풀이 방향: 이항분포의 분산 공식에 $n$과 $p$를 대입한다.\n정석 풀이: $X\\sim B\\left(100,\\dfrac{1}{5}\\right)$이므로 $V(X)=100\\times\\dfrac{1}{5}\\times\\left(1-\\dfrac{1}{5}\\right)=100\\times\\dfrac{1}{5}\\times\\dfrac{4}{5}=16$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 2,
    level: "하",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "확률변수 $X$가 이항분포 $B\\left(18, \\dfrac{1}{3}\\right)$를 따를 때, 확률변수 $Y=3X+2$의 평균 $E(Y)$의 값은?",
    choices: [
    "14",
    "16",
    "18",
    "20",
    "22"
  ],
    answer: "④",
    solution: "[키포인트] 이항분포의 평균 $E(X)=np$와 선형변환의 평균 $E(aX+b)=aE(X)+b$를 이용한다.\n조건 정리: $X\\sim B\\left(18,\\dfrac{1}{3}\\right)$이고 $Y=3X+2$이다.\n풀이 방향: 먼저 $E(X)$를 구한 뒤 $E(Y)$에 대입한다.\n정석 풀이: $E(X)=18\\times\\dfrac{1}{3}=6$이다. 따라서 $E(Y)=E(3X+2)=3E(X)+2=3\\times6+2=20$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 3,
    level: "하",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "확률변수 $X$에 대하여 $E(X)=\\dfrac{1}{2}$, $\\sigma(X)=2$일 때, $E(-4X+1)+\\sigma(-4X+1)$의 값은?",
    choices: [
    "6",
    "7",
    "8",
    "15",
    "16"
  ],
    answer: "②",
    solution: "[키포인트] 평균은 $E(aX+b)=aE(X)+b$, 표준편차는 $\\sigma(aX+b)=|a|\\sigma(X)$를 이용한다.\n조건 정리: $E(X)=\\dfrac{1}{2}$, $\\sigma(X)=2$이다.\n풀이 방향: 평균과 표준편차를 각각 구한 뒤 더한다.\n정석 풀이: $E(-4X+1)=-4E(X)+1=-4\\times\\dfrac{1}{2}+1=-1$이다. 또 $\\sigma(-4X+1)=|-4|\\sigma(X)=4\\times2=8$이다. 따라서 $E(-4X+1)+\\sigma(-4X+1)=-1+8=7$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 4,
    level: "중",
    category: "통계적 추정",
    originalCategory: "통계적 추정",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-06",
    standardUnit: "통계적 추정",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "상자에 1, 1, 2, 3이 각각 적힌 4개의 공이 들어 있다. 이 상자에서 2개의 공을 임의추출하여 공에 적힌 숫자의 평균을 $\\bar{X}$라고 하자. $E(\\bar{X})$의 값은?",
    choices: [
    "$\\dfrac{1}{3}$",
    "$\\dfrac{5}{3}$",
    "$\\dfrac{6}{5}$",
    "$\\dfrac{5}{4}$",
    "$\\dfrac{7}{4}$"
  ],
    answer: "⑤",
    solution: "[키포인트] 표본평균의 기댓값은 모평균과 같다.\n조건 정리: 모집단은 $\\{1,1,2,3\\}$이고 표본평균을 $\\bar{X}$라 한다.\n풀이 방향: 모집단의 평균을 계산하여 $E(\\bar{X})$로 사용한다.\n정석 풀이: 모집단의 평균은 $\\dfrac{1+1+2+3}{4}=\\dfrac{7}{4}$이다. 표본평균의 기댓값은 모평균과 같으므로 $E(\\bar{X})=\\dfrac{7}{4}$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 5,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "이산확률변수 $X$의 확률분포가 아래의 표와 같을 때, $X$의 분산 $V(X)$의 값은?\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$X$</th><th>0</th><th>1</th><th>2</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$\\dfrac{1}{6}$</td><td>$\\dfrac{2}{3}$</td><td>$\\dfrac{1}{6}$</td><td>1</td></tr></tbody></table></div>",
    choices: [
    "$\\dfrac{1}{3}$",
    "$\\dfrac{1}{2}$",
    "$\\dfrac{2}{3}$",
    "1",
    "$\\dfrac{3}{2}$"
  ],
    answer: "①",
    solution: "[키포인트] 분산은 $V(X)=E(X^2)-\\{E(X)\\}^2$으로 구한다.\n조건 정리: $X=0,1,2$일 확률은 각각 $\\dfrac{1}{6},\\dfrac{2}{3},\\dfrac{1}{6}$이다.\n풀이 방향: $E(X)$와 $E(X^2)$을 각각 계산한다.\n정석 풀이: $E(X)=0\\times\\dfrac{1}{6}+1\\times\\dfrac{2}{3}+2\\times\\dfrac{1}{6}=1$이다. 또 $E(X^2)=0^2\\times\\dfrac{1}{6}+1^2\\times\\dfrac{2}{3}+2^2\\times\\dfrac{1}{6}=\\dfrac{2}{3}+\\dfrac{4}{6}=\\dfrac{4}{3}$이다. 따라서 $V(X)=\\dfrac{4}{3}-1^2=\\dfrac{1}{3}$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 6,
    level: "중",
    category: "조건부확률",
    originalCategory: "조건부확률",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-04",
    standardUnit: "조건부확률",
    standardUnitOrder: 4,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "A, B 두 배구팀이 5차전의 경기를 갖는데 먼저 3승을 하는 팀이 우승한다고 한다. A팀이 매 경기를 승리할 확률이 $\\dfrac{1}{3}$이고 2차전까지의 경기 결과 A팀이 1승 1패하였다면 A팀이 우승할 확률은? (단, 매 경기에 무승부는 없다.)",
    choices: [
    "$\\dfrac{5}{27}$",
    "$\\dfrac{7}{27}$",
    "$\\dfrac{1}{3}$",
    "$\\dfrac{11}{27}$",
    "$\\dfrac{13}{27}$"
  ],
    answer: "②",
    solution: "[키포인트] 현재 1승 1패이므로 남은 경기에서 A팀이 2승을 먼저 더 얻는 경우를 센다.\n조건 정리: A팀의 한 경기 승률은 $\\dfrac{1}{3}$이고, 현재 A팀은 1승 1패이다.\n풀이 방향: 4차전에서 끝나는 경우와 5차전에서 끝나는 경우로 나눈다.\n정석 풀이: 3차전과 4차전을 A팀이 모두 이기면 우승하므로 확률은 $\\left(\\dfrac{1}{3}\\right)^2=\\dfrac{1}{9}=\\dfrac{3}{27}$이다. 5차전에서 우승하려면 3,4차전에서 1승 1패를 하고 5차전을 이겨야 하므로 확률은 ${}_{2}C_{1}\\times\\dfrac{1}{3}\\times\\dfrac{2}{3}\\times\\dfrac{1}{3}=\\dfrac{4}{27}$이다. 따라서 전체 확률은 $\\dfrac{3}{27}+\\dfrac{4}{27}=\\dfrac{7}{27}$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 7,
    level: "중",
    category: "확률의 뜻과 활용",
    originalCategory: "확률의 뜻과 활용",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-03",
    standardUnit: "확률의 뜻과 활용",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "수직선 위를 움직이는 점 P가 원점 O에 놓여 있다. 점 P는 한 개의 주사위를 던져 4의 약수의 눈이 나오면 양의 방향으로 2만큼, 4의 약수가 아닌 눈이 나오면 음의 방향으로 1만큼 이동한다. 주사위를 4번 던질 때, 점 P의 좌표가 양수일 확률은?",
    choices: [
    "$\\dfrac{5}{8}$",
    "$\\dfrac{11}{16}$",
    "$\\dfrac{13}{16}$",
    "$\\dfrac{21}{32}$",
    "$\\dfrac{35}{64}$"
  ],
    answer: "②",
    solution: "[키포인트] 4의 약수가 나오는 횟수를 두고 최종 좌표가 양수가 되는 조건을 찾는다.\n조건 정리: 4의 약수는 $1,2,4$이므로 한 번에 양의 방향으로 갈 확률은 $\\dfrac{1}{2}$이다.\n풀이 방향: 4번 중 양의 방향으로 움직인 횟수를 $X$라 두고 $3X-4>0$을 만족하는 경우를 센다.\n정석 풀이: 4의 약수가 나온 횟수를 $X$라 하면 4의 약수가 아닌 눈이 나온 횟수는 $4-X$이고, 최종 좌표는 $2X-(4-X)=3X-4$이다. 양수 조건은 $3X-4>0$이므로 $X\\ge2$이다. 따라서 구하는 확률은 $P(X=2)+P(X=3)+P(X=4)$이고, $X\\sim B\\left(4,\\dfrac{1}{2}\\right)$이므로 $\\dfrac{{}_{4}C_{2}+{}_{4}C_{3}+{}_{4}C_{4}}{2^4}=\\dfrac{6+4+1}{16}=\\dfrac{11}{16}$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 8,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "확률변수 $X$가 정규분포 $N(m, \\sigma^2)$을 따르고 $P(X \\le 17) = P(X \\ge 23)$일 때, $m \\times P(X \\ge m)$의 값은?",
    choices: [
    "8",
    "9",
    "10",
    "11",
    "12"
  ],
    answer: "③",
    solution: "[키포인트] 정규분포는 평균을 중심으로 대칭이다.\n조건 정리: $P(X\\le17)=P(X\\ge23)$이다.\n풀이 방향: 17과 23이 평균을 중심으로 대칭인 두 값이므로 평균 $m$을 구한다.\n정석 풀이: 정규분포의 대칭성에 의해 $17$과 $23$의 중점이 평균이므로 $m=\\dfrac{17+23}{2}=20$이다. 또 평균 이상일 확률은 $P(X\\ge m)=\\dfrac{1}{2}$이다. 따라서 $m\\times P(X\\ge m)=20\\times\\dfrac{1}{2}=10$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 9,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "확률변수 $X$가 정규분포 $N(50,4)$를 따를 때, 함수 $F(x)=P(X\\le x)$에 대하여 오른쪽 표준정규분포표를 이용하여 $F(52)-F(47)$의 값을 구한 것은?\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    choices: [
    "0.6247",
    "0.6687",
    "0.7745",
    "0.8185",
    "0.9104"
  ],
    answer: "③",
    solution: "[키포인트] $F(52)-F(47)=P(47\\le X\\le52)$로 바꾸고 표준화한다.\n조건 정리: $X\\sim N(50,4)$이므로 평균은 $50$, 표준편차는 $2$이다.\n풀이 방향: 두 경계값 47, 52를 각각 표준화한 뒤 표의 값을 더한다.\n정석 풀이: $Z=\\dfrac{X-50}{2}$이다. $X=47$일 때 $Z=-1.5$, $X=52$일 때 $Z=1.0$이다. 따라서 $P(47\\le X\\le52)=P(-1.5\\le Z\\le1.0)=P(0\\le Z\\le1.5)+P(0\\le Z\\le1.0)=0.4332+0.3413=0.7745$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 10,
    level: "중",
    category: "통계적 추정",
    originalCategory: "통계적 추정",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-06",
    standardUnit: "통계적 추정",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "어느 영화에 대한 관람객의 평점은 모평균이 $m$점, 모표준편차가 5점인 정규분포를 따른다고 한다. 모평균 $m$을 신뢰도 95%로 추정할 때, 신뢰구간의 길이가 2 이하가 되기 위한 표본의 크기 $n$의 최솟값은? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(|Z|\\le1.96)=0.95$로 계산한다.)",
    choices: [
    "9",
    "10",
    "11",
    "96",
    "97"
  ],
    answer: "⑤",
    solution: "[키포인트] 모평균 신뢰구간의 길이는 $2\\times1.96\\times\\dfrac{\\sigma}{\\sqrt{n}}$이다.\n조건 정리: 모표준편차는 $5$, 신뢰도 95%의 신뢰상수는 $1.96$이다.\n풀이 방향: 신뢰구간의 길이가 2 이하가 되도록 부등식을 세운다.\n정석 풀이: 신뢰구간의 길이는 $2\\times1.96\\times\\dfrac{5}{\\sqrt n}=\\dfrac{19.6}{\\sqrt n}$이다. $\\dfrac{19.6}{\\sqrt n}\\le2$이므로 $\\sqrt n\\ge9.8$, 즉 $n\\ge96.04$이다. 따라서 자연수 $n$의 최솟값은 $97$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 11,
    level: "중",
    category: "조건부확률",
    originalCategory: "조건부확률",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-04",
    standardUnit: "조건부확률",
    standardUnitOrder: 4,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "복수정답"
  ],
    wide: false,
    content: "공사건이 아닌 두 사건 $A$, $B$가 서로 독립일 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. $P(B|A^C)=P(B)$\nㄴ. $P(A^C\\cup B^C)=1-P(A)P(B)$\nㄷ. $P(A\\cup B)-P(B)=P(A)P(B^C)$",
    choices: [
    "ㄱ",
    "ㄱ, ㄴ",
    "ㄱ, ㄷ",
    "ㄴ, ㄷ",
    "ㄱ, ㄴ, ㄷ"
  ],
    answer: "⑤",
    solution: "[키포인트] 독립사건에서는 $P(A\\cap B)=P(A)P(B)$이고 여사건과도 독립성이 유지된다.\n조건 정리: $A$와 $B$는 공사건이 아니고 서로 독립이다.\n풀이 방향: ㄱ, ㄴ, ㄷ을 각각 독립성과 드모르간 법칙, 합사건 공식으로 판정한다.\n정석 풀이: ㄱ은 $A$와 $B$가 독립이면 $A^C$와 $B$도 독립이므로 $P(B|A^C)=P(B)$가 되어 참이다. ㄴ은 $A^C\\cup B^C=(A\\cap B)^C$이므로 $P(A^C\\cup B^C)=1-P(A\\cap B)=1-P(A)P(B)$가 되어 참이다. ㄷ은 $P(A\\cup B)-P(B)=P(A)+P(B)-P(A\\cap B)-P(B)=P(A)-P(A)P(B)=P(A)P(B^C)$가 되어 참이다. 따라서 ㄱ, ㄴ, ㄷ 모두 옳다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 12,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "복수정답"
  ],
    wide: false,
    content: "연속확률변수 $X$의 확률밀도함수가 $f(x)=k|x|+k$ ($-1\\le x\\le2$)일 때, 확률 $P(0\\le X\\le1)$의 값은? (단, $k\\ne0$)",
    choices: [
    "$\\dfrac{3}{11}$",
    "$\\dfrac{4}{11}$",
    "$\\dfrac{5}{11}$",
    "$\\dfrac{6}{11}$",
    "$\\dfrac{7}{11}$"
  ],
    answer: "①",
    solution: "[키포인트] 확률밀도함수의 전체 넓이는 1이다.\n조건 정리: $f(x)=k|x|+k$이고 정의역은 $-1\\le x\\le2$이다.\n풀이 방향: 전체 구간의 적분값을 1로 두어 $k$를 구한 뒤 $0\\le X\\le1$의 확률을 계산한다.\n정석 풀이: $-1\\le x\\le0$에서는 $|x|=-x$, $0\\le x\\le2$에서는 $|x|=x$이다. 따라서 $\\int_{-1}^{0}k(-x+1)dx+\\int_{0}^{2}k(x+1)dx=1$이다. 첫 적분값은 $\\dfrac{3}{2}k$, 두 번째 적분값은 $4k$이므로 $\\dfrac{11}{2}k=1$, 즉 $k=\\dfrac{2}{11}$이다. 따라서 $P(0\\le X\\le1)=\\int_0^1\\dfrac{2}{11}(x+1)dx=\\dfrac{2}{11}\\left[\\dfrac{x^2}{2}+x\\right]_0^1=\\dfrac{3}{11}$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 13,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "동전 1개를 던져서 앞면이 나오면 3점을 얻고, 뒷면이 나오면 1점을 잃는 게임을 하였다. 동전 1개를 100번 던진 후, 최종 점수가 120점 이상이 될 확률을 오른쪽 표준정규분포표를 이용하여 구한 것은?\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    choices: [
    "0.9332",
    "0.8413",
    "0.3413",
    "0.1587",
    "0.0228"
  ],
    answer: "④",
    solution: "[키포인트] 앞면의 횟수를 이항분포로 두고 정규분포로 근사한다.\n조건 정리: 앞면 횟수 $X$는 $B\\left(100,\\dfrac{1}{2}\\right)$를 따른다.\n풀이 방향: 점수 조건을 $X$의 조건으로 바꾸고 표준화한다.\n정석 풀이: 앞면이 $X$번 나오면 뒷면은 $100-X$번 나오므로 최종 점수는 $3X-(100-X)=4X-100$이다. $4X-100\\ge120$에서 $X\\ge55$이다. $X$는 평균 $50$, 표준편차 $5$인 정규분포로 근사할 수 있으므로 $Z=\\dfrac{55-50}{5}=1.0$이다. 따라서 $P(X\\ge55)\\approx P(Z\\ge1.0)=0.5-0.3413=0.1587$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 14,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "어느 고등학교 학생들을 대상으로 학교생활에 대한 만족도를 조사하였더니 전체 학생 중에서 80%가 만족한다고 응답하였다. 이 학교 학생 400명을 임의로 택하였을 때, 학교생활에 만족한다고 응답한 학생이 324명 이상 $k$명 이하일 확률이 0.2857이다. 이때, 오른쪽 표준정규분포표를 이용하여 상수 $k$의 값을 구한 것은?\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    choices: [
    "328",
    "332",
    "336",
    "340",
    "344"
  ],
    answer: "③",
    solution: "[키포인트] 이항분포를 정규분포로 근사하고 표준정규분포표의 넓이를 이용한다.\n조건 정리: 만족한다고 응답한 학생 수를 $X$라 하면 $X\\sim B(400,0.8)$이다.\n풀이 방향: $X$의 평균과 표준편차를 구한 뒤 $324$와 $k$를 표준화한다.\n정석 풀이: $E(X)=400\\times0.8=320$, $V(X)=400\\times0.8\\times0.2=64$이므로 표준편차는 $8$이다. $324$를 표준화하면 $Z=\\dfrac{324-320}{8}=0.5$이다. 조건은 $P(0.5\\le Z\\le z_k)=0.2857$이다. 표에서 $P(0\\le Z\\le0.5)=0.1915$이므로 $P(0\\le Z\\le z_k)=0.2857+0.1915=0.4772$이다. 따라서 $z_k=2.0$이고 $\\dfrac{k-320}{8}=2$이므로 $k=336$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 15,
    level: "중",
    category: "통계적 추정",
    originalCategory: "통계적 추정",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-06",
    standardUnit: "통계적 추정",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "정규분포 $N(m,1)$을 따르는 모집단에서 표본 100개를 임의추출하여 표본평균을 측정하였더니 10이었다. 모평균 $m$에 대한 신뢰도 $\\alpha\\%$의 신뢰구간이 $9.9\\le m\\le10.1$일 때, 오른쪽 표준정규분포표를 이용하여 상수 $\\alpha$의 값을 구한 것은?\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    choices: [
    "68.26",
    "77.45",
    "81.85",
    "86.64",
    "95.44"
  ],
    answer: "①",
    solution: "[키포인트] 신뢰구간의 반지름으로 신뢰상수 $k$를 구한다.\n조건 정리: 표본평균은 $10$, 모표준편차는 $1$, 표본 크기는 $100$이다.\n풀이 방향: $10\\pm k\\dfrac{1}{\\sqrt{100}}$의 구간이 $9.9\\le m\\le10.1$임을 이용한다.\n정석 풀이: 신뢰구간의 반지름은 $0.1$이므로 $k\\dfrac{1}{10}=0.1$이다. 따라서 $k=1.0$이다. 신뢰도는 $P(-1\\le Z\\le1)=2P(0\\le Z\\le1)=2\\times0.3413=0.6826$이다. 백분율로 나타내면 $68.26\\%$이므로 $\\alpha=68.26$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 16,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "어느 자격시험에 응시한 수험생의 점수는 정규분포 $N(70,\\sigma^2)$을 따른다고 한다. 이 자격시험에서 상위 15%에 해당되는 점수가 75.2점일 때, 상위 10%에 해당되는 점수를 $x$라 하자. $\\sigma+x$의 값은? (단, $Z$가 표준정규분포를 따르는 확률변수일 때, $P(0\\le Z\\le1.04)=0.35$, $P(0\\le Z\\le1.28)=0.4$로 계산한다.)",
    choices: [
    "79.2",
    "80.3",
    "80.9",
    "81.4",
    "82.1"
  ],
    answer: "④",
    solution: "[키포인트] 상위 비율을 표준정규분포의 오른쪽 꼬리 넓이로 바꾸어 표준화한다.\n조건 정리: 평균은 $70$이고, 상위 15% 점수는 $75.2$이다.\n풀이 방향: 상위 15%로 $\\sigma$를 구하고, 상위 10%로 $x$를 구한다.\n정석 풀이: 상위 15%이면 평균부터 해당 점수까지의 넓이는 $0.35$이므로 표준화 값은 $1.04$이다. 따라서 $\\dfrac{75.2-70}{\\sigma}=1.04$에서 $\\sigma=5$이다. 상위 10%이면 평균부터 해당 점수까지의 넓이는 $0.4$이므로 표준화 값은 $1.28$이다. 따라서 $\\dfrac{x-70}{5}=1.28$에서 $x=76.4$이다. 그러므로 $\\sigma+x=5+76.4=81.4$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 17,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "연속확률변수 $X$가 정규분포 $N(k,5^2)$을 따르는 함수 $f(k)=P(0\\le X\\le10)$에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?\n\n<보기>\nㄱ. $f(0)=f(10)$\nㄴ. 임의의 실수 $k$에 대하여 $f(k)=f(5-k)$이다.\nㄷ. 함수 $f(k)$는 $k=5$일 때 최댓값을 갖는다.",
    choices: [
    "ㄱ",
    "ㄴ",
    "ㄱ, ㄴ",
    "ㄱ, ㄷ",
    "ㄴ, ㄷ"
  ],
    answer: "④",
    solution: "[키포인트] 구간 $[0,10]$의 중심은 $5$이므로 평균 $k$가 이 중심에서 얼마나 떨어졌는지를 본다.\n조건 정리: $X\\sim N(k,5^2)$이고 $f(k)=P(0\\le X\\le10)$이다.\n풀이 방향: 정규분포의 대칭성과 구간 중심을 이용하여 ㄱ, ㄴ, ㄷ을 판정한다.\n정석 풀이: ㄱ에서 평균이 $0$일 때 구간 $[0,10]$은 평균 오른쪽으로 $0$부터 $10$까지이고, 평균이 $10$일 때 구간 $[0,10]$은 평균 왼쪽으로 $-10$부터 $0$까지이므로 대칭성에 의해 $f(0)=f(10)$이다. ㄴ은 대칭 중심이 $5$이므로 $f(k)=f(10-k)$가 성립해야 하며, $f(k)=f(5-k)$는 일반적으로 성립하지 않는다. ㄷ은 정규분포의 중심이 구간 $[0,10]$의 중심인 $5$와 일치할 때 해당 구간에 들어갈 확률이 최대이므로 참이다. 따라서 옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ④이다."
  },
  {
    id: 18,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출",
    "표"
  ],
    wide: false,
    content: "어느 공장에서 생산하는 칫솔 한 개의 무게는 평균이 $20\\text{g}$이고 표준편차가 $4\\text{g}$인 정규분포를 따른다고 한다. 이 공장에서 판매하는 칫솔 한 상자에는 이 공장에서 임의추출한 칫솔 4개가 들어 있고 무게의 합이 $x\\text{g}$ 미만이면 불량품으로 판정한다고 한다. 이 공장에서 판매하는 칫솔 상자 1개를 임의로 선택할 때, 선택한 한 상자가 불량품으로 판정될 확률이 0.0228이다. 오른쪽 표준정규분포표를 이용하여 $x$의 값을 구한 것은? (단, 칫솔 상자의 무게는 고려하지 않는다.)\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>0.5</td><td>0.1915</td></tr><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>",
    choices: [
    "56",
    "64",
    "72",
    "78",
    "85"
  ],
    answer: "②",
    solution: "[키포인트] 4개 칫솔 무게의 합은 정규분포를 따르며 평균과 분산은 각각 더해진다.\n조건 정리: 칫솔 한 개의 무게는 $N(20,4^2)$을 따르고, 한 상자에는 4개가 들어 있다.\n풀이 방향: 4개 무게의 합 $S$의 분포를 구한 뒤 왼쪽 꼬리확률 $0.0228$에 해당하는 값을 찾는다.\n정석 풀이: $S=X_1+X_2+X_3+X_4$라 하면 $E(S)=4\\times20=80$, $V(S)=4\\times4^2=64$이므로 $S\\sim N(80,8^2)$이다. $P(S<x)=0.0228$이고 표에서 $P(0\\le Z\\le2.0)=0.4772$이므로 왼쪽 꼬리 $0.0228$에 해당하는 표준화 값은 $-2.0$이다. 따라서 $\\dfrac{x-80}{8}=-2$이고 $x=64$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 19,
    level: "중",
    category: "통계적 추정",
    originalCategory: "통계적 추정",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-06",
    standardUnit: "통계적 추정",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "기출"
  ],
    wide: false,
    content: "어느 과수원에서 수확한 수박의 무게는 정규분포 $N(3m,15^2)$을 따르고, 멜론의 무게는 정규분포 $N(m,9^2)$을 따른다고 한다. 이 과수원에서 수확한 수박과 멜론 중에서 임의로 9개씩 택할 때, 택한 수박 9개의 평균 무게가 $k$ 이상일 확률과 멜론 9개의 평균 무게가 $k$ 이하일 확률이 같다. 이때, $\\dfrac{k}{m}$의 값은? (단, $m,k$는 0보다 큰 실수이다.)",
    choices: [
    "$\\dfrac{1}{2}$",
    "1",
    "$\\dfrac{5}{4}$",
    "$\\dfrac{3}{2}$",
    "$\\dfrac{7}{4}$"
  ],
    answer: "⑤",
    solution: "[키포인트] 두 표본평균의 분포를 각각 구하고 같은 확률 조건을 표준화한다.\n조건 정리: 수박 표본평균은 평균 $3m$, 표준편차 $5$이고, 멜론 표본평균은 평균 $m$, 표준편차 $3$이다.\n풀이 방향: 두 확률의 경계 표준화 값이 서로 반대가 되도록 식을 세운다.\n정석 풀이: 수박 9개의 표본평균을 $\\bar X$, 멜론 9개의 표본평균을 $\\bar Y$라 하면 $\\bar X\\sim N(3m,5^2)$, $\\bar Y\\sim N(m,3^2)$이다. 조건은 $P(\\bar X\\ge k)=P(\\bar Y\\le k)$이므로 $\\dfrac{k-3m}{5}$와 $\\dfrac{k-m}{3}$은 부호가 반대이고 절댓값이 같아야 한다. 따라서 $\\dfrac{k-3m}{5}+\\dfrac{k-m}{3}=0$이다. 정리하면 $3(k-3m)+5(k-m)=0$, $8k=14m$이므로 $\\dfrac{k}{m}=\\dfrac{7}{4}$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 20,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "기출",
    "서술형",
    "표"
  ],
    wide: false,
    content: "[서답형(서술형) 1] [총 7점]\n한 쪽 면에만 1, 2, 3, 4의 숫자가 하나씩 적혀 있는 4장의 카드가 숫자가 보이지 않도록 놓여 있다. 이 4장의 카드에서 임의로 한 장씩 카드를 뒤집어 카드에 적힌 수를 확인할 때, 처음으로 짝수가 적혀 있는 카드를 뒤집을 때까지 뒤집은 카드의 총 개수를 확률변수 $X$라 하자. 다음 물음에 답하시오. (단, 뒤집은 카드는 다시 뒤집지 않는다.)\n\n(1) 위 확률분포표에 제시된 $b,c$의 값을 구하고, 그 풀이 과정을 서술하시오. [3점]\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$X$</th><th>1</th><th>2</th><th>3</th><th>합계</th></tr></thead><tbody><tr><td>$P(X=x)$</td><td>$a$</td><td>$b$</td><td>$c$</td><td>1</td></tr></tbody></table></div>",
    choices: [],
    answer: "b=$\\dfrac{1}{3}$, c=$\\dfrac{1}{6}$",
    solution: "[키포인트] 처음으로 짝수가 나올 때까지 뒤집은 카드 수를 비복원 추출 확률로 계산한다.\n조건 정리: 홀수 카드는 $1,3$의 2장, 짝수 카드는 $2,4$의 2장이다.\n풀이 방향: $X=2$와 $X=3$이 되는 순서를 각각 따져 확률을 구한다.\n정석 풀이: $X=2$는 첫 번째에 홀수가 나오고 두 번째에 짝수가 나오는 경우이므로 $b=\\dfrac{2}{4}\\times\\dfrac{2}{3}=\\dfrac{1}{3}$이다. $X=3$은 첫 번째와 두 번째에 모두 홀수가 나오고 세 번째에 짝수가 나오는 경우이므로 $c=\\dfrac{2}{4}\\times\\dfrac{1}{3}\\times\\dfrac{2}{2}=\\dfrac{1}{6}$이다.\n따라서 구하는 값은 $b=\\dfrac{1}{3}$, $c=\\dfrac{1}{6}$이다."
  },
  {
    id: 21,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "기출",
    "서술형"
  ],
    wide: false,
    content: "(2) $V(X)$의 값을 구하고, 그 풀이과정을 서술하시오. [4점]",
    choices: [],
    answer: "$\\dfrac{5}{9}$",
    solution: "[키포인트] 앞 문항에서 구한 확률분포를 이용하여 $E(X)$와 $E(X^2)$를 구한다.\n조건 정리: $P(X=1)=\\dfrac{1}{2}$, $P(X=2)=\\dfrac{1}{3}$, $P(X=3)=\\dfrac{1}{6}$이다.\n풀이 방향: 분산 공식 $V(X)=E(X^2)-\\{E(X)\\}^2$을 적용한다.\n정석 풀이: $E(X)=1\\times\\dfrac{1}{2}+2\\times\\dfrac{1}{3}+3\\times\\dfrac{1}{6}=\\dfrac{5}{3}$이다. 또 $E(X^2)=1^2\\times\\dfrac{1}{2}+2^2\\times\\dfrac{1}{3}+3^2\\times\\dfrac{1}{6}=\\dfrac{10}{3}$이다. 따라서 $V(X)=\\dfrac{10}{3}-\\left(\\dfrac{5}{3}\\right)^2=\\dfrac{30}{9}-\\dfrac{25}{9}=\\dfrac{5}{9}$이다.\n따라서 구하는 값은 $\\dfrac{5}{9}$이다."
  },
  {
    id: 22,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "기출",
    "서술형",
    "표"
  ],
    wide: false,
    content: "[서답형(서술형) 2] [총 7점]\n확률변수 $X$의 확률질량함수가 $P(X=x)=p_x$ ($x=1,2,3,4$)이고 $p_{x+1}-p_x=\\dfrac{x}{30}$ ($x=1,2,3$)을 만족한다. 다음 물음에 답하시오.\n\n(1) $P(X=1)=p_1$의 값을 구하고, 그 풀이과정을 서술하시오. [4점]",
    choices: [],
    answer: "$\\dfrac{1}{6}$",
    solution: "[키포인트] 확률의 총합이 1이라는 조건을 이용하여 모든 $p_x$를 $p_1$으로 나타낸다.\n조건 정리: $p_{x+1}-p_x=\\dfrac{x}{30}$이고 $x=1,2,3$이다.\n풀이 방향: $p_2,p_3,p_4$를 $p_1$으로 표현한 뒤 $p_1+p_2+p_3+p_4=1$을 이용한다.\n정석 풀이: $p_2=p_1+\\dfrac{1}{30}$, $p_3=p_2+\\dfrac{2}{30}=p_1+\\dfrac{3}{30}$, $p_4=p_3+\\dfrac{3}{30}=p_1+\\dfrac{6}{30}$이다. 전체 확률의 합이 1이므로 $p_1+\\left(p_1+\\dfrac{1}{30}\\right)+\\left(p_1+\\dfrac{3}{30}\\right)+\\left(p_1+\\dfrac{6}{30}\\right)=1$이다. 따라서 $4p_1+\\dfrac{10}{30}=1$, $4p_1=\\dfrac{2}{3}$이므로 $p_1=\\dfrac{1}{6}$이다.\n따라서 구하는 값은 $\\dfrac{1}{6}$이다."
  },
  {
    id: 23,
    level: "중",
    category: "확률분포",
    originalCategory: "확률분포",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-05",
    standardUnit: "확률분포",
    standardUnitOrder: 5,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "기출",
    "서술형",
    "표"
  ],
    wide: false,
    content: "(2) $P(X^2-5X+6\\le0)$의 값을 구하고, 그 풀이과정을 서술하시오. [3점]",
    choices: [],
    answer: "$\\dfrac{7}{15}$",
    solution: "[키포인트] 부등식을 만족하는 $X$의 값을 찾고 해당 확률을 더한다.\n조건 정리: $X$는 $1,2,3,4$의 값을 가지며, 앞 문항에서 $p_1=\\dfrac{1}{6}$이다.\n풀이 방향: $X^2-5X+6\\le0$을 인수분해하여 가능한 $X$를 찾는다.\n정석 풀이: $X^2-5X+6=(X-2)(X-3)$이므로 $(X-2)(X-3)\\le0$에서 $2\\le X\\le3$이다. 따라서 구하는 확률은 $P(2\\le X\\le3)=p_2+p_3$이다. $p_2=p_1+\\dfrac{1}{30}=\\dfrac{1}{6}+\\dfrac{1}{30}=\\dfrac{1}{5}$이고, $p_3=p_1+\\dfrac{3}{30}=\\dfrac{1}{6}+\\dfrac{3}{30}=\\dfrac{4}{15}$이다. 그러므로 $p_2+p_3=\\dfrac{1}{5}+\\dfrac{4}{15}=\\dfrac{7}{15}$이다.\n따라서 구하는 값은 $\\dfrac{7}{15}$이다."
  },
  {
    id: 24,
    level: "중",
    category: "통계적 추정",
    originalCategory: "통계적 추정",
    standardCourse: "확률과 통계",
    standardUnitKey: "H15-PS-06",
    standardUnit: "통계적 추정",
    standardUnitOrder: 6,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "기출",
    "서술형",
    "표"
  ],
    wide: false,
    content: "[서답형(서술형) 3] [총 6점]\n정규분포 $N(m,\\sigma^2)$을 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 그 표본평균을 $\\bar{X}$라 하자. 모평균 $m$의 신뢰도 95%의 신뢰구간을 $a\\le m\\le b$라 할 때, $b-a=23.52$이다. 오른쪽 표준정규분포표를 이용하여 물음에 답하시오. (단, $Z$가 표준정규분포를 따르는 확률변수일 때 $P(0\\le Z\\le1.96)=0.4750$, $P(0\\le Z\\le2.0)=0.4772$로 계산한다.)\n\n<div class=\"question-table-wrap\"><table class=\"question-table\"><thead><tr><th>$z$</th><th>$P(0\\le Z\\le z)$</th></tr></thead><tbody><tr><td>1.0</td><td>0.3413</td></tr><tr><td>1.5</td><td>0.4332</td></tr><tr><td>1.96</td><td>0.4750</td></tr><tr><td>2.0</td><td>0.4772</td></tr></tbody></table></div>\n표본평균의 표준편차 $\\sigma(\\bar{X})$의 값을 구하고, 그 풀이 과정을 서술하시오. [3.5점]",
    choices: [],
    answer: "6",
    solution: "[키포인트] 신뢰구간의 길이 $b-a=2\\times1.96\\times\\sigma(\\bar X)$를 이용한다.\n조건 정리: 신뢰도 95%의 신뢰상수는 $1.96$이고, 신뢰구간의 길이는 $23.52$이다.\n풀이 방향: 신뢰구간 길이 공식에서 표본평균의 표준편차 $\\sigma(\\bar X)$를 구한다.\n정석 풀이: 모평균의 95% 신뢰구간 길이는 $2\\times1.96\\times\\dfrac{\\sigma}{\\sqrt n}$이다. 여기서 $\\dfrac{\\sigma}{\\sqrt n}=\\sigma(\\bar X)$이므로 $2\\times1.96\\times\\sigma(\\bar X)=23.52$이다. 따라서 $3.92\\sigma(\\bar X)=23.52$이고, $\\sigma(\\bar X)=\\dfrac{23.52}{3.92}=6$이다.\n따라서 구하는 값은 6이다."
  }
];
