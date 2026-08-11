window.examTitle = "25_제일고_2학기_중간_고1_기출";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "원소와부분집합"
  ],
    wide: false,
    content: "집합 $A=\\{1,2,\\{1\\}\\}$일 때 다음 중 옳지 않은 것은? [4.0점]",
    choices: [
    "$1\\in A$",
    "$1\\subset A$",
    "$\\{1\\}\\in A$",
    "$\\{1\\}\\subset A$",
    "$\\{\\{1\\}\\}\\subset A$"
  ],
    answer: "②",
    solution: "[키포인트] 원소 관계와 부분집합 관계를 구분한다.\n조건 정리: 집합 $A$의 원소는 $1$, $2$, $\\{1\\}$이다.\n풀이 방향: 각 보기에서 왼쪽 대상이 $A$의 원소인지, 또는 집합으로서 $A$의 부분집합인지 확인한다.\n정석 풀이: ① $1$은 $A$의 원소이므로 참이다. ② $1$은 집합이 아니므로 $1\\subset A$라고 쓸 수 없어 거짓이다. ③ $\\{1\\}$은 $A$의 원소이므로 참이다. ④ 집합 $\\{1\\}$의 유일한 원소 $1$이 $A$에 속하므로 $\\{1\\}\\subset A$이다. ⑤ 집합 $\\{\\{1\\}\\}$의 유일한 원소 $\\{1\\}$이 $A$에 속하므로 $\\{\\{1\\}\\}\\subset A$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 2,
    level: "하",
    category: "함수",
    originalCategory: "함수",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-07",
    standardUnit: "함수",
    standardUnitOrder: 7,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "그래프"
  ],
    wide: false,
    content: "다음 중 함수의 그래프가 될 수 없는 것은? [4.1점]",
    choices: [],
    answer: "②",
    solution: "[키포인트] 함수의 그래프는 하나의 $x$값에 두 개 이상의 $y$값이 대응하면 안 된다.\n조건 정리: 각 그래프에 수직선을 그었을 때 교점이 두 개 이상 생기는지 확인한다.\n풀이 방향: 다섯 그래프에 수직선 판정법을 적용한다.\n정석 풀이: ①, ③, ④, ⑤는 각 $x$값에 대응하는 점이 많아야 하나이므로 함수의 그래프가 될 수 있다. ②의 원은 원의 내부에 있는 여러 $x$값에서 수직선과 두 점에서 만나므로 하나의 $x$값에 두 $y$값이 대응한다.\n따라서 정답은 ②이다.",
    image: "assets/images/25_제일고_2학기_중간_고1_기출/q02.png",
    imageSize: "tall"
  },
  {
    id: 3,
    level: "하",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "부분집합"
  ],
    wide: false,
    content: "집합 $\\{a,b,c,d,e,f\\}$의 부분집합 중 $a$, $b$를 모두 포함하지 않은 진부분집합의 개수는? [4.2점]",
    choices: [
    "14",
    "15",
    "16",
    "17",
    "18"
  ],
    answer: "③",
    solution: "[키포인트] $a$, $b$를 제외한 네 원소의 포함 여부만 결정한다.\n조건 정리: $a$, $b$는 포함하지 않고 $c$, $d$, $e$, $f$는 각각 포함하거나 포함하지 않을 수 있다.\n풀이 방향: 네 원소로 만들 수 있는 부분집합의 개수를 구한다.\n정석 풀이: $c$, $d$, $e$, $f$의 각 원소마다 포함 여부가 두 가지이므로 부분집합의 개수는 $2^4=16$이다. 이 집합들은 모두 원래 집합에서 $a$, $b$가 빠져 있으므로 진부분집합이다.\n따라서 정답은 ③이다."
  },
  {
    id: 4,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "집합의연산"
  ],
    wide: false,
    content: "다음 보기의 집합이 나타내는 영역이 다른 하나는? [4.3점]",
    choices: [
    "$(X-Y)\\cap Z^C$",
    "$X\\cap(Y\\cup Z)^C$",
    "$(X\\cap Y^C)\\cap Z^C$",
    "$X-(Y\\cup Z)$",
    "$X\\cap(Y^C\\cup Z)$"
  ],
    answer: "⑤",
    solution: "[키포인트] 차집합과 드모르간의 법칙을 이용하여 각 식을 같은 꼴로 정리한다.\n조건 정리: $X-Y=X\\cap Y^C$이고 $(Y\\cup Z)^C=Y^C\\cap Z^C$이다.\n풀이 방향: ①부터 ④까지를 교집합과 여집합으로 나타내어 비교한다.\n정석 풀이: ①은 $X\\cap Y^C\\cap Z^C$이다. ②는 $X\\cap(Y\\cup Z)^C=X\\cap Y^C\\cap Z^C$이다. ③도 $X\\cap Y^C\\cap Z^C$이다. ④는 $X-(Y\\cup Z)=X\\cap(Y\\cup Z)^C=X\\cap Y^C\\cap Z^C$이다. 그러나 ⑤는 $X\\cap(Y^C\\cup Z)$이므로 앞의 네 식과 다르다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 5,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "집합의연산",
    "보기"
  ],
    wide: false,
    content: "다음 전체집합 $U$의 부분집합 $A$, $B$에 대하여 보기의 성질 중 옳은 것만을 있는 대로 고른 것은? [4.5점]<br><div class=\"note-box\"><div style=\"text-align:center;font-weight:600;margin-bottom:4px;\">&lt;보기&gt;</div>ㄱ. $A-B=A\\cup B^C$<br>ㄴ. $A\\cap(A\\cup B)=A\\cup(A\\cap B)$<br>ㄷ. $(A\\cup B)^C=A^C\\cap B^C$<br>ㄹ. $A\\subset B$이면 $A\\cup B^C=U$</div>",
    choices: [
    "ㄱ, ㄴ",
    "ㄱ, ㄷ",
    "ㄱ, ㄹ",
    "ㄴ, ㄷ",
    "ㄴ, ㄹ"
  ],
    answer: "④",
    solution: "[키포인트] 집합의 기본 법칙을 이용하여 각 명제의 참과 거짓을 판단한다.\n조건 정리: 차집합은 교집합으로 바꾸고, 흡수법칙과 드모르간의 법칙을 확인한다.\n풀이 방향: ㄱ부터 ㄹ까지 하나씩 판정한다.\n정석 풀이: ㄱ에서 $A-B=A\\cap B^C$이므로 거짓이다. ㄴ에서 $A\\cap(A\\cup B)=A$이고 $A\\cup(A\\cap B)=A$이므로 참이다. ㄷ은 드모르간의 법칙이므로 참이다. ㄹ은 $A\\subset B$이더라도 $B-A$에 속하는 원소는 $A\\cup B^C$에 속하지 않으므로 일반적으로 $U$가 되지 않는다. 따라서 옳은 것은 ㄴ, ㄷ이다.\n따라서 정답은 ④이다."
  },
  {
    id: 6,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "원소의개수"
  ],
    wide: false,
    content: "전체집합 $U$의 부분집합 $A$, $B$에 대하여 $n(U)=30$, $n(A)=20$, $n(B)=15$일 때, $n(A^C\\cup B^C)$의 최댓값은? [4.6점]",
    choices: [
    "5",
    "10",
    "15",
    "20",
    "25"
  ],
    answer: "⑤",
    solution: "[키포인트] 드모르간의 법칙으로 합집합을 교집합의 여집합으로 바꾼다.\n조건 정리: $A^C\\cup B^C=(A\\cap B)^C$이므로 $n(A^C\\cup B^C)=30-n(A\\cap B)$이다.\n풀이 방향: $n(A\\cap B)$의 최솟값을 구한다.\n정석 풀이: $n(A\\cap B)\\ge n(A)+n(B)-n(U)=20+15-30=5$이다. 따라서 교집합의 원소 수의 최솟값은 $5$이고, 이때 $n(A^C\\cup B^C)=30-5=25$로 최대가 된다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 7,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "부분집합",
    "경우의수"
  ],
    wide: false,
    content: "집합 $A=\\{1,2,3,4,5,6\\}$의 부분집합 중 원소의 개수가 $3$개인 모든 부분집합의 모든 원소들의 총합은? [4.7점]",
    choices: [
    "210",
    "220",
    "230",
    "240",
    "250"
  ],
    answer: "①",
    solution: "[키포인트] 각 원소가 세 원소짜리 부분집합에 몇 번씩 포함되는지 센다.\n조건 정리: 특정 원소 하나를 고정하면 나머지 다섯 원소 중 두 원소를 더 선택한다.\n풀이 방향: 한 원소의 등장 횟수에 전체 원소의 합을 곱한다.\n정석 풀이: 각 원소는 ${}_5C_2=10$개의 부분집합에 포함된다. 따라서 모든 부분집합의 모든 원소들의 총합은 $(1+2+3+4+5+6)\\times10=21\\times10=210$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 8,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "집합",
    "집합의연산",
    "보기"
  ],
    wide: false,
    content: "전체집합 $U=\\{1,2,3,4,5\\}$의 두 부분집합 $A$, $B$가 다음 조건을 만족시킬 때, 집합 $B$의 모든 원소의 합의 최댓값은? [4.8점]<br><div class=\"note-box\">(가) 집합 $A$의 모든 원소는 소수이다.<br>(나) 두 집합 $A$, $B$는 서로소이다.<br>(다) $n(A\\cup B)=5$, $n(B)=3$이다.</div>",
    choices: [
    "8",
    "9",
    "10",
    "11",
    "12"
  ],
    answer: "③",
    solution: "[키포인트] $A$와 $B$가 서로소이고 합집합이 전체집합이므로 두 집합은 $U$를 나누어 가진다.\n조건 정리: $B$의 원소는 세 개이고, 그 합을 최대화해야 한다.\n풀이 방향: $U$에서 가장 큰 세 원소를 $B$에 넣을 수 있는지 확인한다.\n정석 풀이: $B=\\{3,4,5\\}$로 두면 $A=\\{1,2\\}$가 되어 두 집합은 서로소이고 $A\\cup B=U$이다. 또한 $A$의 원소 중 $2$는 소수이지만 $1$은 소수가 아니므로 이 선택은 조건 (가)를 만족하지 않는다. 따라서 $A$는 소수로만 이루어져야 하며, 두 원소인 $A$를 $\\{2,3\\}$으로 두면 $B=\\{1,4,5\\}$이고 합은 $10$이다. 다른 가능한 두 원소의 소수 집합은 $\\{2,5\\}$ 또는 $\\{3,5\\}$이며 각각 $B$의 합은 $8$, $7$이다. 따라서 최댓값은 $10$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 9,
    level: "중",
    category: "함수",
    originalCategory: "함수",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-07",
    standardUnit: "함수",
    standardUnitOrder: 7,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "함수",
    "함수의개수"
  ],
    wide: false,
    content: "두 집합 $X=\\{1,2,3,4\\}$, $Y=\\{1,2,3,4,5,6\\}$에 대하여 $f(3)=4$일 때, $f(1)\\lt f(2)\\lt f(3)\\lt f(4)$를 만족시키는 함수의 개수는? [4.8점]",
    choices: [
    "6",
    "7",
    "8",
    "9",
    "10"
  ],
    answer: "①",
    solution: "[키포인트] $f(3)=4$를 기준으로 앞의 두 함수값과 뒤의 한 함수값을 선택한다.\n조건 정리: $f(1)$, $f(2)$는 $1,2,3$ 중 서로 다른 두 값을 증가하는 순서로 가져야 하고, $f(4)$는 $5,6$ 중 하나이다.\n풀이 방향: 앞의 두 값의 선택 수와 마지막 값의 선택 수를 곱한다.\n정석 풀이: $f(1)\\lt f(2)\\lt4$가 되도록 $1,2,3$ 중 두 값을 고르는 방법은 ${}_3C_2=3$가지이다. $f(4)\\gt4$이므로 $f(4)$는 $5$, $6$ 중 하나로 $2$가지이다. 따라서 함수의 개수는 $3\\times2=6$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 10,
    level: "하",
    category: "평면좌표",
    originalCategory: "평면좌표",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-01",
    standardUnit: "평면좌표",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "평면좌표",
    "삼각형"
  ],
    wide: false,
    content: "세 점 $A(1,2)$, $B(3,0)$, $C(-1,-2)$를 꼭짓점으로 하는 삼각형 $ABC$는 어떤 삼각형인가? [4.0점]",
    choices: [
    "정삼각형",
    "둔각삼각형",
    "$\\overline{AB}=\\overline{BC}$인 이등변삼각형",
    "$\\overline{BC}=\\overline{CA}$인 이등변삼각형",
    "$\\angle C=90^\\circ$인 직각삼각형"
  ],
    answer: "④",
    solution: "[키포인트] 세 변의 길이의 제곱을 각각 계산하여 비교한다.\n조건 정리: 거리 공식에서 제곱근을 취하기 전의 값을 비교하면 된다.\n풀이 방향: $AB^2$, $BC^2$, $CA^2$를 구한다.\n정석 풀이: $AB^2=(3-1)^2+(0-2)^2=8$이다. $BC^2=(-1-3)^2+(-2-0)^2=20$이고, $CA^2=(1+1)^2+(2+2)^2=20$이다. 따라서 $BC=CA$이다.\n따라서 정답은 ④이다."
  },
  {
    id: 11,
    level: "하",
    category: "평면좌표",
    originalCategory: "평면좌표",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-01",
    standardUnit: "평면좌표",
    standardUnitOrder: 1,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "평면좌표",
    "무게중심"
  ],
    wide: false,
    content: "서로 다른 세 점 $A(2,4)$, $B$, $C$에 대하여 삼각형 $ABC$의 무게중심은 원점 $O$이다. 삼각형 $OBC$의 무게중심 좌표를 $(a,b)$라 할 때, $a+b$의 값은? [4.1점]",
    choices: [
    "$-3$",
    "$-2$",
    "$-1$",
    "$0$",
    "$1$"
  ],
    answer: "②",
    solution: "[키포인트] 삼각형 $ABC$의 무게중심이 원점이라는 조건으로 $B+C$의 좌표합을 구한다.\n조건 정리: $A+B+C=(0,0)$이므로 $B+C=(-2,-4)$이다.\n풀이 방향: 삼각형 $OBC$의 세 꼭짓점 좌표를 평균낸다.\n정석 풀이: 삼각형 $OBC$의 무게중심은 $\\left(\\dfrac{0+B_x+C_x}{3},\\dfrac{0+B_y+C_y}{3}\\right)=\\left(-\\dfrac23,-\\dfrac43\\right)$이다. 따라서 $a+b=-\\dfrac23-\\dfrac43=-2$이다.\n따라서 정답은 ②이다."
  },
  {
    id: 12,
    level: "중",
    category: "직선의 방정식",
    originalCategory: "직선의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-02",
    standardUnit: "직선의 방정식",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "직선의방정식",
    "그래프"
  ],
    wide: false,
    content: "세 실수 $a$, $b$, $c$에 대하여 직선 $ax+by+c=0$이 다음 그림과 같을 때, 직선 $cx+by+a=0$의 개형으로 알맞은 것은? [4.3점]",
    choices: [],
    answer: "④",
    solution: "[키포인트] 주어진 직선의 기울기와 $y$절편의 부호로 $a/b$, $c/b$의 부호를 판단한다.\n조건 정리: 주어진 직선은 기울기가 양수이고 $y$절편이 음수이다.\n풀이 방향: 새 직선의 기울기 $-c/b$와 $y$절편 $-a/b$의 부호를 구한다.\n정석 풀이: $-a/b\\gt0$이므로 $a/b\\lt0$이고, $-c/b\\lt0$이므로 $c/b\\gt0$이다. 새 직선 $cx+by+a=0$의 기울기는 $-c/b\\lt0$이고 $y$절편은 $-a/b\\gt0$이다. 따라서 기울기가 음수이고 $y$절편이 양수인 직선이다.\n따라서 정답은 ④이다.",
    image: "assets/images/25_제일고_2학기_중간_고1_기출/q12.png",
    imageSize: "tall"
  },
  {
    id: 13,
    level: "중",
    category: "원의 방정식",
    originalCategory: "원의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-03",
    standardUnit: "원의 방정식",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "원의방정식",
    "접선"
  ],
    wide: false,
    content: "원 $(x-2)^2+(y+4)^2=10$과 직선 $x+3y+k=0$이 접하도록 하는 모든 실수 $k$의 곱은? [4.4점]",
    choices: [
    "$-20$",
    "$-10$",
    "$0$",
    "$10$",
    "$20$"
  ],
    answer: "③",
    solution: "[키포인트] 원의 중심에서 직선까지의 거리가 반지름과 같아야 한다.\n조건 정리: 원의 중심은 $(2,-4)$이고 반지름은 $\\sqrt{10}$이다.\n풀이 방향: 점과 직선 사이의 거리 공식으로 $k$를 구한다.\n정석 풀이: 중심에서 직선까지의 거리는 $\\dfrac{|2+3(-4)+k|}{\\sqrt{1^2+3^2}}=\\dfrac{|k-10|}{\\sqrt{10}}$이다. 접하므로 $\\dfrac{|k-10|}{\\sqrt{10}}=\\sqrt{10}$이고, $|k-10|=10$이다. 따라서 $k=0$ 또는 $k=20$이므로 모든 $k$의 곱은 $0$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 14,
    level: "중",
    category: "직선의 방정식",
    originalCategory: "직선의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-02",
    standardUnit: "직선의 방정식",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "직선의방정식",
    "수직"
  ],
    wide: false,
    content: "두 직선 $(a-2)x-(a-3)y+7=0$, $(a^2-3a)x-y+5=0$이 서로 수직이 되도록 하는 모든 실수 $a$값의 곱은? [4.5점]",
    choices: [
    "1",
    "2",
    "3",
    "4",
    "5"
  ],
    answer: "③",
    solution: "[키포인트] 두 직선 $A_1x+B_1y+C_1=0$, $A_2x+B_2y+C_2=0$이 수직이면 $A_1A_2+B_1B_2=0$이다.\n조건 정리: 첫째 직선의 계수는 $A_1=a-2$, $B_1=3-a$이고 둘째 직선은 $A_2=a(a-3)$, $B_2=-1$이다.\n풀이 방향: 수직 조건을 계수에 적용하고 인수분해한다.\n정석 풀이: $(a-2)a(a-3)+(3-a)(-1)=0$이다. 이를 정리하면 $(a-3)\\{a(a-2)+1\\}=0$, 즉 $(a-3)(a-1)^2=0$이다. 따라서 $a=1$ 또는 $a=3$이고, 모든 값의 곱은 $1\\times3=3$이다.\n따라서 정답은 ③이다."
  },
  {
    id: 15,
    level: "상",
    category: "직선의 방정식",
    originalCategory: "직선의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-02",
    standardUnit: "직선의 방정식",
    standardUnitOrder: 2,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "직선의방정식",
    "닮음",
    "도형"
  ],
    wide: false,
    content: "다음 그림과 같이 세 점 $A(2,5)$, $B(-1,-1)$, $C(6,-8)$을 꼭짓점으로 하는 삼각형 $ABC$가 있다. 선분 $AB$ 위의 한 점 $D$와 선분 $AC$ 위의 한 점 $E$에 대하여 선분 $DE$가 선분 $BC$와 평행하고 삼각형 $ADE$와 삼각형 $ABC$의 넓이의 비가 $1:9$일 때, 직선 $DE$의 방정식이 $y=ax+b$이다. 이때 $a+b$의 값은? [4.6점]",
    choices: [
    "2",
    "3",
    "4",
    "5",
    "6"
  ],
    answer: "②",
    solution: "[키포인트] 넓이비로 닮음비를 구한 뒤 내분점 공식으로 $D$, $E$의 좌표를 구한다.\n조건 정리: $DE\\parallel BC$이므로 삼각형 $ADE$와 삼각형 $ABC$는 닮음이고, 넓이비가 $1:9$이므로 닮음비는 $1:3$이다.\n풀이 방향: $AD:DB=AE:EC=1:2$를 이용하여 두 내분점의 좌표를 구한다.\n정석 풀이:\n$D$는 선분 $AB$를 $1:2$로 내분하므로\n$D\\left(\\dfrac{2\\cdot2+1\\cdot(-1)}{3},\\dfrac{2\\cdot5+1\\cdot(-1)}{3}\\right)=(1,3)$이다.\n$E$는 선분 $AC$를 $1:2$로 내분하므로\n$E\\left(\\dfrac{2\\cdot2+1\\cdot6}{3},\\dfrac{2\\cdot5+1\\cdot(-8)}{3}\\right)=\\left(\\dfrac{10}{3},\\dfrac{2}{3}\\right)$이다.\n직선 $DE$의 기울기는\n$\\dfrac{\\frac23-3}{\\frac{10}{3}-1}=-1$이다.\n점 $(1,3)$을 지나므로 직선의 방정식은 $y=-x+4$이다.\n따라서 $a=-1$, $b=4$이므로 $a+b=3$이다.\n따라서 정답은 ②이다.",
    image: "assets/images/25_제일고_2학기_중간_고1_기출/q15.png"
  },
  {
    id: 16,
    level: "상",
    category: "원의 방정식",
    originalCategory: "원의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-03",
    standardUnit: "원의 방정식",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "원의방정식",
    "무게중심",
    "넓이",
    "보기"
  ],
    wide: false,
    content: "두 직선 $l_1:3x+y+3=0$, $l_2:x-3y-9=0$의 교점을 $A$, 두 직선 $l_1$, $l_2$가 $x$축과 만나는 점을 각각 $B$, $C$라 하자. 제1사분면에 있는 점 $P$와 삼각형 $ABC$의 외접원 위의 점 $Q$가 다음 조건을 만족시킨다. 이때 $P(a,b)$라 하면 $a+b$의 값은? [4.6점]<br><div class=\"note-box\">(가) 점 $Q$는 삼각형 $PBC$의 무게중심이다.<br>(나) 삼각형 $PBC$의 넓이는 삼각형 $ABC$의 넓이의 $3$배이다.</div>",
    choices: [
    "5",
    "10",
    "15",
    "20",
    "25"
  ],
    answer: "⑤",
    solution: "[키포인트] $A$, $B$, $C$를 구하여 외접원의 방정식과 넓이 조건을 함께 이용한다.\n조건 정리: 두 직선은 서로 수직이므로 삼각형 $ABC$는 $A$에서 직각인 직각삼각형이다.\n풀이 방향: 먼저 $A$, $B$, $C$와 외접원을 구하고, 넓이 조건으로 $b$, 무게중심 조건으로 $Q$를 나타낸다.\n정석 풀이: 두 직선의 교점은 $A=(0,-3)$이고, $x$축과의 교점은 $B=(-1,0)$, $C=(9,0)$이다. 삼각형 $ABC$의 넓이는 $\\dfrac12\\times10\\times3=15$이다. 삼각형 $PBC$의 넓이가 $45$이므로 $\\dfrac12\\times10\\times b=45$에서 $b=9$이다. 직각삼각형 $ABC$의 외접원은 지름이 $BC$이므로 중심은 $(4,0)$, 반지름은 $5$이다. $Q$는 삼각형 $PBC$의 무게중심이므로 $Q=\\left(\\dfrac{a-1+9}{3},\\dfrac{9}{3}\\right)=\\left(\\dfrac{a+8}{3},3\\right)$이다. $Q$가 외접원 위에 있으므로 $\\left(\\dfrac{a+8}{3}-4\\right)^2+3^2=25$이다. 따라서 $(a-4)^2=144$이고 $a=16$ 또는 $a=-8$이다. $P$는 제1사분면에 있으므로 $a=16$이다. 따라서 $a+b=16+9=25$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 17,
    level: "상",
    category: "원의 방정식",
    originalCategory: "원의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-03",
    standardUnit: "원의 방정식",
    standardUnitOrder: 3,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "원의방정식",
    "정사각형",
    "도형"
  ],
    wide: false,
    content: "다음 그림에서 사각형 $ABCD$는 정사각형이고, $A(5,4)$, $B(2,8)$이다. 선분 $CD$를 지름으로 하는 원의 방정식이 $(x-a)^2+(y-b)^2=c^2$일 때, 상수 $a$, $b$, $c$에 대하여 $a+b+c$의 값은? (단, $C$, $D$는 제1사분면 위의 점이다.) [4.7점]",
    choices: [
    "19",
    "20",
    "21",
    "22",
    "23"
  ],
    answer: "①",
    solution: "[키포인트] 선분 $AB$에 수직이고 길이가 같은 변의 좌표 변화량을 구한다.\n조건 정리: $A(5,4)$에서 $B(2,8)$로 갈 때 $x$좌표는 $-3$, $y$좌표는 $4$만큼 변하고, $AB=5$이다.\n풀이 방향: 정사각형의 다른 두 변은 $AB$에 수직이고 길이가 $5$이며, $C$, $D$가 제1사분면에 놓이는 방향을 선택한다.\n정석 풀이:\n수직인 변의 좌표 변화량을 $(p,q)$라 하면\n$-3p+4q=0$, $p^2+q^2=25$를 만족한다.\n이를 만족하는 값은 $(p,q)=(4,3)$ 또는 $(-4,-3)$이다.\n$C$, $D$가 제1사분면에 있으므로 $(4,3)$을 선택한다.\n따라서\n$C=(2+4,8+3)=(6,11)$,\n$D=(5+4,4+3)=(9,7)$이다.\n선분 $CD$의 중점은\n$\\left(\\dfrac{6+9}{2},\\dfrac{11+7}{2}\\right)=\\left(\\dfrac{15}{2},9\\right)$이고,\n$CD=5$이므로 반지름은 $\\dfrac52$이다.\n따라서 $a=\\dfrac{15}{2}$, $b=9$, $c=\\dfrac52$이므로\n$a+b+c=19$이다.\n따라서 정답은 ①이다.",
    image: "assets/images/25_제일고_2학기_중간_고1_기출/q17.png"
  },
  {
    id: 18,
    level: "상",
    category: "도형의 이동",
    originalCategory: "도형의 이동",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-04",
    standardUnit: "도형의 이동",
    standardUnitOrder: 4,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "도형의이동",
    "대칭이동",
    "접기",
    "도형"
  ],
    wide: false,
    content: "다음 그림과 같이 한 변의 길이가 $16$인 정사각형 $OABC$ 모양의 종이를 점 $O$가 원점에, 두 점 $A$, $C$가 각각 $x$축, $y$축 위에 있도록 좌표평면 위에 놓았다. 두 점 $D$, $E$는 각각 두 선분 $OC$, $AB$를 $3:1$로 내분하는 점이고, 선분 $OA$ 위의 점 $F$에 대하여 $\\overline{OF}=5$이다. 선분 $OC$ 위의 점 $P$와 선분 $AB$ 위의 점 $Q$에 대하여 선분 $PQ$를 접는 선으로 하여 종이를 접었더니 점 $O$는 선분 $BC$ 위의 점 $O'$로, 점 $F$는 선분 $DE$ 위의 점 $F'$로 옮겨졌다. 이때 좌표평면에서 직선 $PQ$의 방정식은 $y=mx+n$이다. 두 수의 곱 $mn$의 값은? (단, $m$, $n$은 상수이고, 종이의 두께는 고려하지 않는다.) [4.8점]",
    choices: [
    "$-\\dfrac{25}{2}$",
    "$-10$",
    "$-\\dfrac{15}{2}$",
    "$-5$",
    "$-\\dfrac52$"
  ],
    answer: "④",
    solution: "[키포인트] 종이를 접는 선은 원래 점과 옮겨진 점을 잇는 선분의 수직이등분선이다.\n조건 정리: $O'=(u,16)$, $F'=(v,12)$라 하고 접는 선을 $y=mx+n$이라 둔다.\n풀이 방향: 선분 $OO'$와 $FF'$가 접는 선에 수직이고, 두 선분의 중점이 접는 선 위에 있다는 조건을 각각 사용한다.\n정석 풀이:\n선분 $OO'$의 기울기는 $\\dfrac{16}{u}$이므로 접는 선의 기울기와의 곱이 $-1$이다.\n따라서 $m\\cdot\\dfrac{16}{u}=-1$에서 $u=-16m$이다.\n선분 $OO'$의 중점은 $(-8m,8)$이고 이 점이 $y=mx+n$ 위에 있으므로\n$8=-8m^2+n$,\n즉 $n=8+8m^2$이다.\n\n또 선분 $FF'$의 기울기는 $\\dfrac{12}{v-5}$이므로\n$m\\cdot\\dfrac{12}{v-5}=-1$에서 $v=5-12m$이다.\n선분 $FF'$의 중점은 $(5-6m,6)$이고 이 점도 접는 선 위에 있으므로\n$6=m(5-6m)+n$이다.\n$n=8+8m^2$을 대입하면\n$6=5m-6m^2+8+8m^2$,\n$2m^2+5m+2=0$이다.\n따라서 $m=-\\dfrac12$ 또는 $m=-2$이다.\n\n$m=-2$이면 $n=40$이어서 접는 선이 선분 $OC$와 만나지 않으므로 조건에 맞지 않는다.\n따라서 $m=-\\dfrac12$, $n=10$이고\n$mn=-5$이다.\n따라서 정답은 ④이다.",
    image: "assets/images/25_제일고_2학기_중간_고1_기출/q18.png"
  },
  {
    id: 19,
    level: "하",
    category: "함수",
    originalCategory: "함수",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-07",
    standardUnit: "함수",
    standardUnitOrder: 7,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "함수",
    "함수의개수"
  ],
    wide: false,
    content: "1. 집합 $X=\\{1,2,3\\}$에서 집합 $Y=\\{1,2,3\\}$로의 함수 중에서 상수함수의 개수를 $a$, 항등함수의 개수를 $b$, 일대일대응의 개수를 $c$라 할 때, $a+b+c$의 값을 구하는 과정을 서술하시오. [4점]",
    choices: [],
    answer: "$10$",
    solution: "[키포인트] 상수함수, 항등함수, 일대일대응의 개수를 각각 구한다.\n조건 정리: 정의역과 공역의 원소 수는 모두 $3$이다.\n풀이 방향: 세 종류의 함수 개수를 독립적으로 계산한 뒤 더한다.\n정석 풀이: 상수함수는 세 정의역 원소의 함숫값이 모두 같은 경우이므로 공역의 한 원소를 고르는 $3$가지가 있다. 항등함수는 각 원소를 자기 자신으로 보내는 함수 하나뿐이므로 $1$가지이다. 일대일대응은 공역의 세 원소를 정의역의 세 원소에 순서 있게 대응시키는 경우이므로 $3!=6$가지이다. 따라서 $a+b+c=3+1+6=10$이다.\n따라서 구하는 값은 $10$이다."
  },
  {
    id: 20,
    level: "하",
    category: "평면좌표",
    originalCategory: "평면좌표",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-01",
    standardUnit: "평면좌표",
    standardUnitOrder: 1,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "평면좌표",
    "거리",
    "내분점"
  ],
    wide: false,
    content: "2. 두 점 $A(1,3)$, $B(3,6)$의 두 점 사이의 거리를 구하고, 선분 $AB$를 $2:1$로 내분하는 점 $P$의 좌표를 구하시오. [4점]",
    choices: [],
    answer: "두 점 사이의 거리: $\\sqrt{13}$, $P\\left(\\dfrac73,5\\right)$",
    solution: "[키포인트] 거리 공식과 내분점 공식을 차례로 적용한다.\n조건 정리: $A(1,3)$, $B(3,6)$이고 $AP:PB=2:1$이다.\n풀이 방향: 먼저 $AB$를 구하고, 내분점은 반대편 비를 좌표에 곱하여 더한다.\n정석 풀이: $AB=\\sqrt{(3-1)^2+(6-3)^2}=\\sqrt{4+9}=\\sqrt{13}$이다. $AP:PB=2:1$이므로 $P=\\left(\\dfrac{1\\cdot1+2\\cdot3}{3},\\dfrac{1\\cdot3+2\\cdot6}{3}\\right)=\\left(\\dfrac73,5\\right)$이다.\n따라서 두 점 사이의 거리는 $\\sqrt{13}$이고, $P\\left(\\dfrac73,5\\right)$이다."
  },
  {
    id: 21,
    level: "중",
    category: "집합",
    originalCategory: "집합",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-05",
    standardUnit: "집합",
    standardUnitOrder: 5,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "집합",
    "집합의연산",
    "경우의수"
  ],
    wide: false,
    content: "3. 전체집합 $U$는 $10$ 이하의 자연수 전체의 집합이고, $P$는 $10$ 이하의 소수 전체의 집합이다. $n(X-P)\\cdot n(X\\cup P^C)=14$를 만족시키는 $U$의 부분집합 $X$의 개수를 구하는 과정을 서술하시오. [6점]",
    choices: [],
    answer: "$60$",
    solution: "[키포인트] $X$를 $P$에 속하는 부분과 $P^C$에 속하는 부분으로 나누어 원소 수를 나타낸다.\n조건 정리: $P=\\{2,3,5,7\\}$이고 $P^C=\\{1,4,6,8,9,10\\}$이다.\n풀이 방향: $a=n(X\\cap P^C)$, $b=n(X\\cap P)$로 두고 주어진 식을 정리한다.\n정석 풀이: $X-P=X\\cap P^C$이므로 $n(X-P)=a$이다. 또한 $X\\cup P^C$는 $P^C$의 여섯 원소와 $X\\cap P$의 $b$개 원소로 이루어지므로 $n(X\\cup P^C)=6+b$이다. 따라서 $a(6+b)=14$이다. $0\\le a\\le6$, $0\\le b\\le4$이므로 가능한 경우는 $a=2$, $b=1$뿐이다. $P^C$의 여섯 원소 중 두 원소를 고르는 방법은 ${}_6C_2=15$가지이고, $P$의 네 원소 중 한 원소를 고르는 방법은 ${}_4C_1=4$가지이다. 따라서 $X$의 개수는 $15\\times4=60$이다.\n따라서 구하는 값은 $60$이다."
  },
  {
    id: 22,
    level: "중",
    category: "원의 방정식",
    originalCategory: "원의 방정식",
    standardCourse: "공통수학2",
    standardUnitKey: "H22-C2-03",
    standardUnit: "원의 방정식",
    standardUnitOrder: 3,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "원의방정식",
    "두원의위치관계"
  ],
    wide: false,
    content: "4. 원 $(x-3)^2+(y-4)^2=16$ 위의 임의의 점 $P$에 대하여 $\\overline{OP}$의 거리가 정수가 되는 점 $P$의 개수를 구하시오. (이때, 점 $O$는 원점이다.) [6점]",
    choices: [],
    answer: "$16$",
    solution: "[키포인트] 원점에서 점 $P$까지의 거리를 반지름으로 하는 원과 주어진 원의 교점 개수를 센다.\n조건 정리: 주어진 원의 중심은 $C(3,4)$이고 $OC=5$, 반지름은 $4$이다.\n풀이 방향: $OP=d$라 두고 두 원이 만나는 정수 $d$의 범위와 교점 개수를 조사한다.\n정석 풀이: 점 $P$가 주어진 원 위를 움직일 때 $OP$의 최솟값은 $5-4=1$, 최댓값은 $5+4=9$이다. 따라서 가능한 정수 $d$는 $1,2,\\ldots,9$이다. $d=1$일 때 두 원은 내접하고 한 점에서 만나며, $d=9$일 때 두 원은 외접하고 한 점에서 만난다. $2\\le d\\le8$인 일곱 정수에 대해서는 $|5-4|\\lt d\\lt5+4$이므로 두 원이 서로 다른 두 점에서 만난다. 따라서 점 $P$의 개수는 $1+7\\times2+1=16$이다.\n따라서 구하는 값은 $16$이다."
  }
];
