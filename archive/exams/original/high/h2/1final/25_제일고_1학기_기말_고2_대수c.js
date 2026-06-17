window.examTitle = "25_제일고_1학기_기말_고2_수학I";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "절댓값",
    "계수비교",
    "삼각함수",
    "함수",
    "그래프",
    "조건해석",
    "계산"
  ],
    wide: false,
    content: "함수 $y = 2\\cos 2x$의 주기는?",
    choices: [
    "$\\pi$",
    "$2\\pi$",
    "$3\\pi$",
    "$4\\pi$",
    "$5\\pi$"
  ],
    answer: "①",
    solution: "[키포인트] $y=a\\cos bx$의 주기는 $\\dfrac{2\\pi}{|b|}$이다.\\n조건 정리: 주어진 함수는 $y=2\\cos 2x$이고, 코사인 안의 $x$의 계수는 $2$이다.\\n풀이 방향: 앞의 계수 $2$는 진폭만 바꾸므로 주기는 코사인 안쪽의 계수로 판단한다.\\n정석 풀이: 기본 함수 $\\cos x$는 $x$가 $2\\pi$만큼 변할 때 한 주기를 돈다. 그런데 $\\cos 2x$에서는 안쪽 각 $2x$가 $2\\pi$만큼 변해야 하므로 $2x$의 변화량이 $2\\pi$가 되어야 한다. 따라서 $x$의 한 주기 $T$는 $2T=2\\pi$를 만족하므로 $T=\\pi$이다.\\n따라서 정답은 ①이다."
  },
  {
    id: 2,
    level: "하",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "복소수",
    "삼각함수",
    "함수",
    "그래프",
    "정수조건",
    "조건해석",
    "식세우기"
  ],
    wide: false,
    content: "함수 $y = \\tan\\dfrac{3}{2}x$의 점근선의 방정식은? (단, $n$은 정수)",
    choices: [
    "$x = \\dfrac{n\\pi}{3}$",
    "$x = \\dfrac{2n\\pi}{3}$",
    "$x = \\dfrac{(2n+1)\\pi}{3}$",
    "$x = n\\pi + \\dfrac{1}{3}\\pi$",
    "$x = n\\pi + \\dfrac{2}{3}\\pi$"
  ],
    answer: "③",
    solution: "[키포인트] 탄젠트함수 $y=\\tan u$의 점근선은 $u=\\dfrac{\\pi}{2}+n\\pi$이다.\\n조건 정리: 주어진 함수는 $y=\\tan\\dfrac{3}{2}x$이고, 탄젠트 안쪽 각은 $\\dfrac{3}{2}x$이다.\\n풀이 방향: 탄젠트가 정의되지 않는 안쪽 각의 값을 먼저 세운 뒤, $x$에 대하여 정리한다.\\n정석 풀이: $y=\\tan u$의 점근선은 $u=\\dfrac{\\pi}{2}+n\\pi$이다. 여기서 $u=\\dfrac{3}{2}x$이므로 $\\dfrac{3}{2}x=\\dfrac{\\pi}{2}+n\\pi$이다. 양변에 $\\dfrac{2}{3}$을 곱하면 $x=\\dfrac{\\pi}{3}+\\dfrac{2n\\pi}{3}=\\dfrac{(2n+1)\\pi}{3}$이다.\\n따라서 정답은 ③이다."
  },
  {
    id: 3,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "도형"
  ],
    wide: false,
    content: "그림과 같이 $\\overline{AC} = 6\\sqrt{2}$, \\n$\\overline{BC} = a$, $A = 60^\\circ$, $B = 45^\\circ$인 $\\triangle ABC$의 외접원의 반지름의 길이가 $R$일 때, $a + R$의 값은?",
    choices: [
    "$6+6\\sqrt{2}$",
    "$6+6\\sqrt{3}$",
    "$18$",
    "$6+6\\sqrt{5}$",
    "$6+6\\sqrt{6}$"
  ],
    answer: "②",
    solution: "[키포인트] 사인법칙 $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = 2R$을 활용한다.\\n조건 정리: 대변과 대각의 매칭에 의해 $b = \\overline{AC} = 6\\sqrt{2}$, $B = 45^\\circ$, $A = 60^\\circ$이다.\\n정석 풀이:\\n1단계: 사인법칙을 이용하여 외접원의 반지름 $R$을 구한다.\\n$\\dfrac{b}{\\sin B} = 2R \\implies \\dfrac{6\\sqrt{2}}{\\sin 45^\\circ} = 2R$\\n$\\sin 45^\\circ = \\dfrac{\\sqrt{2}}{2}$이므로,\\n$2R = \\dfrac{6\\sqrt{2}}{\\dfrac{\\sqrt{2}}{2}} = 12 \\implies R = 6$\\n\\n2단계: 사인법칙을 이용하여 변 $a$의 길이를 구한다.\\n$\\dfrac{a}{\\sin A} = 2R \\implies \\dfrac{a}{\\sin 60^\\circ} = 12$\\n$\\sin 60^\\circ = \\dfrac{\\sqrt{3}}{2}$이므로,\\n$a = 12 \\times \\dfrac{\\sqrt{3}}{2} = 6\\sqrt{3}$\\n\\n3단계: $a+R$의 최종 합산값을 구한다.\\n$a + R = 6\\sqrt{3} + 6 = 6 + 6\\sqrt{3}$\\n따라서 정답은 ②이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q3.png"
  },
  {
    id: 4,
    level: "하",
    category: "등차수열",
    originalCategory: "등차수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-08",
    standardUnit: "등차수열",
    standardUnitOrder: 8,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "수열",
    "등차수열",
    "개수세기",
    "대입",
    "조건해석",
    "계산"
  ],
    wide: false,
    content: "등차수열 $\\{a_n\\}$에 대하여 $a_1 = 1$, $a_{10} = 25$일 때, $S_{10}$의 값은?",
    choices: [
    "110",
    "120",
    "130",
    "140",
    "150"
  ],
    answer: "③",
    solution: "[키포인트] 등차수열의 첫째항과 끝항을 알 때의 합 공식 $S_n = \\dfrac{n(a_1 + a_n)}{2}$을 적용한다.\\n조건 정리: 첫째항 $a_1 = 1$, 제10항 $a_{10} = 25$, 항의 개수 $n = 10$이다.\\n정석 풀이:\\n구하고자 하는 수열의 합 $S_{10}$은 공식에 의하여 다음과 같다.\\n$S_{10} = \\dfrac{10(a_1 + a_{10})}{2}$\\n준비된 조건을 대입하면,\\n$S_{10} = \\dfrac{10(1 + 25)}{2} = 5 \\times 26 = 130$\\n따라서 정답은 ③이다."
  },
  {
    id: 5,
    level: "하",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "인수분해",
    "전개",
    "계수비교",
    "이차방정식",
    "근과계수",
    "수열",
    "등비수열"
  ],
    wide: false,
    content: "세 수 $2$, $x$, $3x-4$가 이 순서대로 등비수열을 이룰 때, 가능한 $x$의 모든 값의 합을 구하면?",
    choices: [
    "2",
    "3",
    "4",
    "5",
    "6"
  ],
    answer: "⑤",
    solution: "[키포인트] 세 수 $a, b, c$가 이 순서대로 등비수열을 이루면 등비중항 성질인 $b^2 = ac$가 성립한다.\\n조건 정리: 세 수는 $2, x, 3x-4$이므로 등비중항은 $x$이다.\\n정석 풀이:\\n등비중항 관계식을 세우면 다음과 같다.\\n$x^2 = 2(3x - 4)$\\n우변을 전개한 후 좌변으로 이항하여 이차방정식을 정리한다.\\n$x^2 = 6x - 8 \\implies x^2 - 6x + 8 = 0$\\n이차방정식을 인수분해하면,\\n$(x - 2)(x - 4) = 0 \\implies x = 2 \\text{ 또는 } x = 4$\\n따라서 가능한 모든 $x$의 값의 합은 $2 + 4 = 6$이다.\\n\\n빠른 풀이 포인트: 근과 계수의 관계에 의하여 이차방정식 $x^2 - 6x + 8 = 0$의 두 근의 합은 $-\\dfrac{-6}{1} = 6$임을 즉시 구할 수 있다.\\n따라서 정답은 ⑤이다."
  },
  {
    id: 6,
    level: "하",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "수열",
    "시그마",
    "대입",
    "조건해석",
    "계산",
    "개념"
  ],
    wide: false,
    content: "두 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 $\\displaystyle\\sum_{k=1}^{10}a_k = 7$, $\\displaystyle\\sum_{k=1}^{10}(2a_k + b_k) = 38$일 때, $\\displaystyle\\sum_{k=1}^{10}b_k$의 값은?",
    choices: [
    "7",
    "14",
    "24",
    "28",
    "36"
  ],
    answer: "③",
    solution: "[키포인트] 시그마($\\sum$)의 선형성 성질인 $\\sum(cA_k + B_k) = c\\sum A_k + \\sum B_k$를 이용한다.\\n조건 정리: $\\displaystyle\\sum_{k=1}^{10}a_k = 7$이고, 전체 분리 가능한 복합 조건식은 $38$이다.\\n정석 풀이:\\n두 번째 조건식을 시그마의 성질을 이용하여 각각의 항으로 분리한다.\\n$\\displaystyle\\sum_{k=1}^{10}(2a_k + b_k) = 2\\sum_{k=1}^{10}a_k + \\sum_{k=1}^{10}b_k = 38$\\n첫 번째 조건인 $\\displaystyle\\sum_{k=1}^{10}a_k = 7$을 위 식에 대입한다.\\n$2 \\times 7 + \\sum_{k=1}^{10}b_k = 38$\\n$14 + \\sum_{k=1}^{10}b_k = 38$\\n상수항을 이항하여 최종 값을 구한다.\\n$\\displaystyle\\sum_{k=1}^{10}b_k = 38 - 14 = 24$\\n따라서 정답은 ③이다."
  },
  {
    id: 7,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "제곱근",
    "근호",
    "복소수",
    "삼각함수",
    "함수",
    "대입",
    "조건해석"
  ],
    wide: false,
    content: "$\\sin\\theta = \\dfrac{\\sqrt{5}}{5}$ $\\left(0 < \\theta < \\dfrac{\\pi}{2}\\right)$일 때, 다음 식의 값은?\\n$$\\frac{\\cos\\theta}{\\sin(\\pi - \\theta)} + \\frac{\\sin\\left(\\dfrac{\\pi}{2}+\\theta\\right)}{\\cos\\left(\\dfrac{\\pi}{2}-\\theta\\right)}$$",
    choices: [
    "$-4$",
    "$-\\dfrac{1}{4}$",
    "0",
    "$\\dfrac{1}{4}$",
    "4"
  ],
    answer: "⑤",
    solution: "[키포인트] 삼각함수의 각 변환 공식인 $\\sin(\\pi - \\theta) = \\sin\\theta$, $\\sin\\left(\\dfrac{\\pi}{2}+\\theta\\right) = \\cos\\theta$, $\\cos\\left(\\dfrac{\\pi}{2}-\\theta\\right) = \\sin\\theta$를 이용한다.\\n조건 정리: $\\theta$는 제1사분면의 각이므로 모든 삼각함수의 값은 양수이다.\\n정석 풀이:\\n1단계: 구하고자 하는 식의 각 변환을 적용하여 단순화한다.\\n$\\sin(\\pi - \\theta) = \\sin\\theta$\\n$\\sin\\left(\\dfrac{\\pi}{2}+\\theta\\right) = \\cos\\theta$\\n$\\cos\\left(\\dfrac{\\pi}{2}-\\theta\\right) = \\sin\\theta$\\n이를 주어진 식에 대입하면 다음과 같이 정리된다.\\n$\\dfrac{\\cos\\theta}{\\sin\\theta} + \\dfrac{\\cos\\theta}{\\sin\\theta} = 2\\dfrac{\\cos\\theta}{\\sin\\theta} = 2\\cot\\theta$\\n\\n2단계: $\\sin\\theta$ 값을 바탕으로 $\\cos\\theta$를 구한다.\\n$\\sin^2\\theta + \\cos^2\\theta = 1$이므로,\\n$\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - \\left(\\dfrac{\\sqrt{5}}{5}\\right)^2 = 1 - \\dfrac{5}{25} = \\dfrac{20}{25}$\\n$0 < \\theta < \\dfrac{\\pi}{2}$에서 $\\cos\\theta > 0$이므로,\\n$\\cos\\theta = \\dfrac{\\sqrt{20}}{5} = \\dfrac{2\\sqrt{5}}{5}$이다.\\n\\n3단계: 정리된 식에 값을 대입하여 계산한다.\\n$2\\dfrac{\\cos\\theta}{\\sin\\theta} = 2 \\times \\dfrac{\\dfrac{2\\sqrt{5}}{5}}{\\dfrac{\\sqrt{5}}{5}} = 2 \\times 2 = 4$\\n따라서 정답은 ⑤이다."
  },
  {
    id: 8,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "삼각함수",
    "함수",
    "도형",
    "삼각형",
    "넓이",
    "표해석",
    "조건해석"
  ],
    wide: false,
    content: "넓이가 54인 $\\triangle ABC$에서 $\\sin A : \\sin B : \\sin C = 3:4:5$일 때, $\\triangle ABC$의 둘레의 길이는?",
    choices: [
    "12",
    "24",
    "36",
    "48",
    "60"
  ],
    answer: "③",
    solution: "[키포인트] 사인법칙에 의해 삼각형의 세 사인값의 비는 세 변의 길이의 비와 같다. ($a:b:c = \\sin A : \\sin B : \\sin C$)\\n조건 정리: 변의 비가 $3:4:5$이므로 이 삼각형은 직각삼각형이다.\\n정석 풀이:\\n1단계: 세 변의 길이를 매개변수 $k$를 이용해 표현한다.\\n$a = 3k$, $b = 4k$, $c = 5k$ ($k > 0$)\\n피타고라스 정리 $(3k)^2 + (4k)^2 = (5k)^2$가 성립하므로, 가장 긴 변 $c$가 빗변이고 $a, b$가 두 직교하는 변인 직각삼각형이다.\\n\\n2단계: 넓이 조건을 이용하여 $k$의 값을 구한다.\\n$\\text{넓이} = \\dfrac{1}{2} \\times a \\times b = \\dfrac{1}{2} \\times 3k \\times 4k = 6k^2 = 54$\\n$k^2 = 9 \\implies k = 3$ ($k > 0$)\\n\\n3단계: 실제 변의 길이를 구하고 둘레의 길이를 계산한다.\\n$a = 9$, $b = 12$, $c = 15$\\n$\\text{둘레의 길이} = a + b + c = 9 + 12 + 15 = 36$\\n따라서 정답은 ③이다."
  },
  {
    id: 9,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "도형"
  ],
    wide: false,
    content: "아래 그림과 같이 한 지점 P에서 두 조각상 A, B까지의 거리와 두 조각상 A, B를 바라본 각의 크기를 측정하였더니 $\\overline{AP} = 4\\text{m}$, $\\overline{BP} = 6\\text{m}$, $\\angle APB = 60^\\circ$이었다. 두 조각상 A, B 사이의 거리는?",
    choices: [
    "$2\\sqrt{3}\\text{m}$",
    "$4\\text{m}$",
    "$2\\sqrt{5}\\text{m}$",
    "$2\\sqrt{6}\\text{m}$",
    "$2\\sqrt{7}\\text{m}$"
  ],
    answer: "⑤",
    solution: "[키포인트] 두 변과 그 끼인각이 주어졌으므로 코사인법칙 $c^2 = a^2 + b^2 - 2ab\\cos C$를 사용하여 마주 보는 대변의 길이를 구한다.\\n조건 정리: $\\triangle PAB$에서 $\\overline{AP}=4$, $\\overline{BP}=6$, 끼인각 $\\angle P = 60^\\circ$이다.\\n정석 풀이:\\n코사인법칙에 의하여 두 조각상 사이의 거리인 $\\overline{AB}$의 제곱은 다음과 같다.\\n$\\overline{AB}^2 = \\overline{AP}^2 + \\overline{BP}^2 - 2\\overline{AP}\\cdot\\overline{BP}\\cos 60^\\circ$\\n공식에 실제 수치를 대입한다.\\n$\\overline{AB}^2 = 4^2 + 6^2 - 2 \\times 4 \\times 6 \\times \\cos 60^\\circ$\\n$\\cos 60^\\circ = \\dfrac{1}{2}$이므로,\\n$\\overline{AB}^2 = 16 + 36 - 48 \\times \\dfrac{1}{2} = 52 - 24 = 28$\\n$\\overline{AB} > 0$이므로 제곱근을 취해 정리하면 다음과 같다.\\n$\\overline{AB} = \\sqrt{28} = 2\\sqrt{7}\\text{m}$\\n따라서 정답은 ⑤이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q9.png"
  },
  {
    id: 10,
    level: "중",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "그래프"
  ],
    wide: false,
    content: "양수 $a$, $b$, $c$에 대하여 함수 $y = a\\cos b(x-c)+1$의 그래프가 아래 그림과 같을 때, 상수 $a$, $b$, $c$에 대하여 $\\dfrac{abc}{\\pi}$의 최솟값은?",
    choices: [
    "$\\dfrac{1}{5}$",
    "$\\dfrac{1}{3}$",
    "$\\dfrac{1}{2}$",
    "1",
    "2"
  ],
    answer: "④",
    solution: "[키포인트] 삼각함수 $y = a\\cos b(x-c)+d$의 최댓값, 최솟값과 주기를 이용하여 미지수를 구한다.\\n조건 정리: 그래프에서 최댓값은 $3$, 최솟값은 $-1$이고, 양수 $a, b, c$ 조건을 가진다.\\n정석 풀이:\\n1단계: 최댓값과 최솟값을 이용하여 $a$의 값을 구한다.\\n양수 $a$에 대하여 최댓값은 $a + 1 = 3 \\implies a = 2$이다.\\n최솟값은 $-a + 1 = -2 + 1 = -1$이므로 그래프와 일치한다.\\n\\n2단계: 주기를 이용하여 $b$의 값을 구한다.\\n그래프에서 이웃한 두 마루(최댓값인 점)의 $x$좌표는 $\\dfrac{5}{8}\\pi$와 $\\dfrac{25}{8}\\pi$이다.\\n따라서 이 함수의 주기 $T$는 다음과 같다.\\n$T = \\dfrac{25}{8}\\pi - \\dfrac{5}{8}\\pi = \\dfrac{20}{8}\\pi = \\dfrac{5}{2}\\pi$\\n코사인함수의 주기 공식 $T = \\dfrac{2\\pi}{b}$ ($b>0$)에 대입하면,\\n$\\dfrac{2\\pi}{b} = \\dfrac{5}{2}\\pi \\implies b = \\dfrac{4}{5}$이다.\\n\\n3단계: 평행이동을 이용하여 양수 $c$의 최솟값을 구한다.\\n함수의 식은 $y = 2\\cos \\dfrac{4}{5}(x-c) + 1$이 된다.\\n$x = \\dfrac{5}{8}\\pi$에서 최댓값 $3$을 가지므로 코사인 내부의 값이 $2n\\pi$ ($n$은 정수)가 되어야 한다.\\n$\\dfrac{4}{5}\\left(\\dfrac{5}{8}\\pi - c\\right) = 2n\\pi \\implies \\dfrac{5}{8}\\pi - c = \\dfrac{5}{2}n\\pi \\implies c = \\dfrac{5}{8}\\pi - \\dfrac{5}{2}n\\pi$\\n$c$가 최소인 양수가 되려면 $n = 0$일 때이므로 $c = \\dfrac{5}{8}\\pi$이다.\\n\\n4단계: 구하고자 하는 식의 값을 계산한다.\\n$\\dfrac{abc}{\\pi} = \\dfrac{2 \\times \\dfrac{4}{5} \\times \\dfrac{5}{8}\\pi}{\\pi} = 1$\\n따라서 정답은 ④이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q10.png"
  },
  {
    id: 11,
    level: "중",
    category: "등차수열",
    originalCategory: "등차수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-08",
    standardUnit: "등차수열",
    standardUnitOrder: 8,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "수열",
    "등차수열",
    "자연수조건",
    "오류판별",
    "대입",
    "조건해석",
    "계산"
  ],
    wide: false,
    content: "공차가 0이 아닌 등차수열 $\\{a_n\\}$에 대하여 $a_3 - 2a_{15} = a_k - 3a_{20} = 0$일 때, 자연수 $k$의 값은?",
    choices: [
    "6",
    "7",
    "8",
    "9",
    "10"
  ],
    answer: "①",
    solution: "[키포인트] 등차수열의 일반항 $a_n = a_1 + (n-1)d$를 대입하여 연립 방정식을 푼다.\\n조건 정리: 공차 $d \\ne 0$이고 두 관계식이 모두 $0$을 만족한다.\\n정석 풀이:\\n1단계: 첫 번째 관계식 $a_3 - 2a_{15} = 0$을 첫째항 $a_1$과 공차 $d$로 나타낸다.\\n$(a_1 + 2d) - 2(a_1 + 14d) = 0$\\n$a_1 + 2d - 2a_1 - 28d = 0 \\implies -a_1 - 26d = 0 \\implies a_1 = -26d$\\n\\n2단계: 두 번째 관계식 $a_k - 3a_{20} = 0$에 일반항과 1단계의 결과를 대입한다.\\n$a_k = 3a_{20}$이므로,\\n$\\{a_1 + (k-1)d\\} = 3(a_1 + 19d)$\\n위 식에 $a_1 = -26d$를 대입하여 정리하면 다음과 같다.\\n$-26d + (k-1)d = 3(-26d + 19d)$\\n$(k - 27)d = 3(-7d) = -21d$\\n\\n3단계: 공차가 $0$이 아니므로 양변을 $d$로 나누어 $k$의 값을 구한다.\\n$k - 27 = -21 \\implies k = 6$\\n따라서 정답은 ①이다."
  },
  {
    id: 12,
    level: "중",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "도형"
  ],
    wide: false,
    content: "다음 그림과 같이 한 변의 길이가 1인 정사각형 모양의 종이가 있다. 첫 번째 시행에서 각 변의 중점을 이어서 만든 네 개의 정사각형 중에서 왼쪽 위의 정사각형을 색칠한다. 두 번째 시행에서 첫 번째 시행 후 남은 오른쪽 아래의 정사각형에서 같은 방법으로 정사각형을 색칠한다. 이와 같은 시행을 반복할 때, $n$번째 시행에서 색칠하는 정사각형의 넓이를 $a_n$이라 하자. 색칠한 정사각형의 넓이의 합 $\\displaystyle\\sum_{k=1}^{n}a_k$가 처음으로 $\\dfrac{21}{64}$보다 커지는 $n$은?",
    choices: [
    "3",
    "4",
    "5",
    "6",
    "7"
  ],
    answer: "②",
    solution: "[키포인트] 매 시행마다 색칠되는 정사각형의 넓이는 이전의 $\\dfrac{1}{4}$배가 된다.\\n조건 정리: 첫 번째 색칠 넓이는 $\\dfrac{1}{4}$이고, 이후 색칠 넓이는 공비가 $\\dfrac{1}{4}$인 등비수열이다.\\n풀이 방향: 색칠한 넓이의 누적합을 등비수열의 합으로 나타내고, 처음으로 $\\dfrac{21}{64}$보다 커지는 $n$을 찾는다.\\n정석 풀이: $a_1=\\dfrac{1}{4}$, 공비 $r=\\dfrac{1}{4}$이므로 $a_n=\\left(\\dfrac{1}{4}\\right)^n$이다. 따라서 $\\sum_{k=1}^{n}a_k=\\dfrac{\\dfrac{1}{4}\\{1-(\\dfrac{1}{4})^n\\}}{1-\\dfrac{1}{4}}=\\dfrac{1}{3}\\left(1-\\dfrac{1}{4^n}\\right)$이다. 이제 $\\dfrac{1}{3}\\left(1-\\dfrac{1}{4^n}\\right)>\\dfrac{21}{64}$를 풀면 $1-\\dfrac{1}{4^n}>\\dfrac{63}{64}$, 즉 $\\dfrac{1}{4^n}<\\dfrac{1}{64}=\\dfrac{1}{4^3}$이다. 따라서 $n>3$이므로 처음 만족하는 자연수는 $n=4$이다.\\n따라서 정답은 ②이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q12.png"
  },
  {
    id: 13,
    level: "중",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "수열",
    "등차수열",
    "등비수열",
    "표해석",
    "대입",
    "조건해석",
    "식세우기"
  ],
    wide: false,
    content: "공차가 2인 등차수열 $\\{a_n\\}$에 대하여 세 항 $a_3$, $a_5$, $a_{11}$이 이 순서대로 등비수열을 이룰 때, $a_{10}$의 값은?",
    choices: [
    "15",
    "16",
    "18",
    "20",
    "21"
  ],
    answer: "②",
    solution: "[키포인트] 등차수열의 일반항 조건을 등비중항 공식 $b^2 = ac$에 대입하여 첫째항을 구한다.\\n조건 정리: 공차 $d = 2$이고 세 항 $a_3, a_5, a_{11}$이 등비수열을 이룬다.\\n정석 풀이:\\n1단계: 세 항을 첫째항 $a_1$과 공차 $2$를 이용하여 표현한다.\\n$a_3 = a_1 + 4$\\n$a_5 = a_1 + 8$\\n$a_{11} = a_1 + 20$\\n\\n2단계: 등비중항 성질을 이용하여 방정식을 세우고 $a_1$을 구한다.\\n$(a_5)^2 = a_3 \\cdot a_{11} \\implies (a_1 + 8)^2 = (a_1 + 4)(a_1 + 20)$\\n$a_1^2 + 16a_1 + 64 = a_1^2 + 24a_1 + 80$\\n이항하여 정리하면,\\n$8a_1 = -16 \\implies a_1 = -2$\\n\\n3단계: 구하고자 하는 제10항 $a_{10}$의 값을 계산한다.\\n$a_{10} = a_1 + 9d = -2 + 9 \\times 2 = 16$\\n따라서 정답은 ②이다."
  },
  {
    id: 14,
    level: "중",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "수열",
    "시그마",
    "조건해석",
    "계산"
  ],
    wide: false,
    content: "$\\displaystyle\\sum_{k=1}^{9}\\left(\\frac{k}{k+1}+\\frac{k+1}{k}\\right) = \\frac{a}{10}$일 때, $a$의 값은?",
    choices: [
    "181",
    "189",
    "191",
    "199",
    "201"
  ],
    answer: "②",
    solution: "[키포인트] 각 항을 $2+\\dfrac{1}{k(k+1)}$로 바꾸면 가운데 항들이 소거된다.\\n조건 정리: 구할 합은 $\\sum_{k=1}^{9}\\left(\\dfrac{k}{k+1}+\\dfrac{k+1}{k}\\right)$이고, 결과를 $\\dfrac{a}{10}$과 비교한다.\\n풀이 방향: 일반항을 통분한 뒤 부분분수로 바꾸어 합을 계산한다.\\n정석 풀이: $\\dfrac{k}{k+1}+\\dfrac{k+1}{k}=\\dfrac{k^2+(k+1)^2}{k(k+1)}=\\dfrac{2k^2+2k+1}{k(k+1)}=2+\\dfrac{1}{k(k+1)}$이다. 또한 $\\dfrac{1}{k(k+1)}=\\dfrac{1}{k}-\\dfrac{1}{k+1}$이므로 전체 합은 $\\sum_{k=1}^{9}2+\\sum_{k=1}^{9}\\left(\\dfrac{1}{k}-\\dfrac{1}{k+1}\\right)$이다. 첫 번째 합은 $18$이고, 두 번째 합은 $1-\\dfrac{1}{10}=\\dfrac{9}{10}$이다. 따라서 전체 합은 $18+\\dfrac{9}{10}=\\dfrac{189}{10}$이므로 $a=189$이다.\\n따라서 정답은 ②이다."
  },
  {
    id: 15,
    level: "중",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "제곱근",
    "근호",
    "복소수",
    "삼각함수",
    "부등식",
    "함수",
    "그래프"
  ],
    wide: false,
    content: "$0 \\le x < 2\\pi$일 때, 두 부등식\\n$$\\sin x > \\frac{\\sqrt{2}}{2}, \\quad \\cos x < \\frac{1}{2}$$\\n을 동시에 만족시키는 $x$의 값의 범위는 $a\\pi < x < b\\pi$이다. $ab$의 값은?",
    choices: [
    "$\\dfrac{1}{4}$",
    "$\\dfrac{1}{2}$",
    "$\\dfrac{3}{4}$",
    "1",
    "$\\dfrac{5}{4}$"
  ],
    answer: "①",
    solution: "[키포인트] 각각의 삼각부등식을 기본 삼각함수 그래프의 경계값을 이용하여 푼 후 공통 범위를 구한다.\\n조건 정리: $x$의 전체 제한 범위는 $0 \\le x < 2\\pi$이다.\\n정석 풀이:\\n1단계: 첫 번째 부등식 $\\sin x > \\dfrac{\\sqrt{2}}{2}$의 해를 구한다.\\n$0 \\le x < 2\\pi$에서 $\\sin x = \\dfrac{\\sqrt{2}}{2}$가 되는 $x$는 $\\dfrac{\\pi}{4}$와 $\\dfrac{3}{4}\\pi$이다.\\n그래프에서 사인의 함숫값이 더 큰 영역이므로 해는 $\\dfrac{\\pi}{4} < x < \\dfrac{3}{4}\\pi$이다.\\n\\n2단계: 두 번째 부등식 $\\cos x < \\dfrac{1}{2}$의 해를 구한다.\\n$0 \\le x < 2\\pi$에서 $\\cos x = \\dfrac{1}{2}$이 되는 $x$는 $\\dfrac{\\pi}{3}$와 $\\dfrac{5}{3}\\pi$이다.\\n그래프에서 코사인의 함숫값이 더 작은 영역이므로 해는 $\\dfrac{\\pi}{3} < x < \\dfrac{5}{3}\\pi$이다.\\n\\n3단계: 두 부등식의 공통 범위를 수평선 상에서 구한다.\\n$\\dfrac{\\pi}{4} < \\dfrac{\\pi}{3}$이고 $\\dfrac{3}{4}\\pi < \\dfrac{5}{3}\\pi$이므로 공통 영역은 다음과 같다.\\n$\\dfrac{\\pi}{3} < x < \\dfrac{3}{4}\\pi \\implies \\dfrac{1}{3}\\pi < x < \\dfrac{3}{4}\\pi$\\n따라서 $a = \\dfrac{1}{3}$, $b = \\dfrac{3}{4}$이다.\\n\\n4단계: 구하고자 하는 $ab$의 값을 계산한다.\\n$ab = \\dfrac{1}{3} \\times \\dfrac{3}{4} = \\dfrac{1}{4}$\\n따라서 정답은 ①이다."
  },
  {
    id: 16,
    level: "중",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "그래프"
  ],
    wide: false,
    content: "그림과 같이 함수 $y = \\sin\\dfrac{k}{2}x$ $(x>0)$의 그래프와 직선 $y = a$ $(0 < a < 1)$의 교점의 $x$좌표 중 가장 작은 수를 $\\alpha$, 두 번째로 작은 수를 $\\beta$라 하고, 직선 $y = -a$의 교점의 $x$좌표 중 가장 작은 수를 $\\gamma$, 두 번째로 작은 수를 $\\delta$라 하자. $\\tan(\\alpha+\\beta+\\gamma+\\delta) = \\sqrt{3}$을 만족시키는 양수 $k$의 최댓값은?",
    choices: [
    "12",
    "16",
    "20",
    "24",
    "28"
  ],
    answer: "④",
    solution: "[키포인트] 사인 그래프의 대칭성을 이용하면 네 교점의 $x$좌표 합을 주기로 나타낼 수 있다.\\n조건 정리: $y=\\sin\\dfrac{k}{2}x$의 주기는 $T=\\dfrac{4\\pi}{k}$이다.\\n풀이 방향: $y=a$와 만나는 처음 두 점, $y=-a$와 만나는 처음 두 점은 각각 마루와 골을 기준으로 대칭임을 이용한다.\\n정석 풀이: $0<a<1$이므로 $y=a$와의 처음 두 교점 $\\alpha$, $\\beta$는 첫 번째 양의 반주기 안에서 마루 $x=\\dfrac{T}{4}$를 기준으로 대칭이다. 따라서 $\\dfrac{\\alpha+\\beta}{2}=\\dfrac{T}{4}$이므로 $\\alpha+\\beta=\\dfrac{T}{2}$이다. 또 $y=-a$와의 처음 두 교점 $\\gamma$, $\\delta$는 첫 번째 음의 반주기 안에서 골 $x=\\dfrac{3T}{4}$를 기준으로 대칭이다. 따라서 $\\dfrac{\\gamma+\\delta}{2}=\\dfrac{3T}{4}$이므로 $\\gamma+\\delta=\\dfrac{3T}{2}$이다. 그러므로 $\\alpha+\\beta+\\gamma+\\delta=2T=\\dfrac{8\\pi}{k}$이다. 주어진 조건에서 $\\tan\\dfrac{8\\pi}{k}=\\sqrt3$이므로 $\\dfrac{8\\pi}{k}=n\\pi+\\dfrac{\\pi}{3}$이다. 따라서 $k=\\dfrac{24}{3n+1}$이고, 양수 $k$가 최대가 되려면 양수인 분모 $3n+1$이 가장 작아야 한다. $n=0$일 때 $k=24$가 최대이다.\\n따라서 정답은 ④이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q16.png"
  },
  {
    id: 17,
    level: "상",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "도형"
  ],
    wide: false,
    content: "그림과 같이 선분 AB를 지름으로 하는 반원의 호 AB 위의 점 C에 대하여 호 BC의 사등분점 중 점 B에 가장 가까운 점을 D라 하고, 호 CD를 이등분하는 점을 E라 하자. $\\angle BAC = \\dfrac{\\pi}{3}$이고 $\\overline{CD}^2 = \\overline{CE}^2 + 9\\sqrt{2}$일 때, $\\overline{BC}^2$의 값은?",
    choices: [
    "18",
    "27",
    "32",
    "36",
    "48"
  ],
    answer: "②",
    solution: "[키포인트] 원주각과 중심각의 관계 및 원의 반지름 $R$을 이용한 현의 길이 공식 $2R\\sin\\dfrac{\\theta}{2}$를 활용한다.\\n조건 정리: 선분 $AB$가 지름이므로 반원의 중심을 $O$, 반지름을 $R$이라 하면 $AB=2R$이다. $\\angle BAC = \\dfrac{\\pi}{3}$이다.\\n풀이 방향: 각 호에 대응하는 중심각을 구하여 현 $\\overline{CD}$와 $\\overline{CE}$의 길이를 $R$에 대한 식으로 나타낸다.\\n정석 풀이:\\n1단계: 호 $BC$, 호 $CD$, 호 $CE$의 중심각을 각각 구한다.\\n$\\angle BAC = \\dfrac{\\pi}{3}$는 호 $BC$에 대한 원주각이므로, 호 $BC$의 중심각 $\\angle BOC = 2 \\times \\dfrac{\\pi}{3} = \\dfrac{2\\pi}{3}$ ($120^\\circ$)이다.\\n호 $BC$의 4등분점 중 $B$에 가장 가까운 점이 $D$이므로, 호 $BD$의 중심각은 $\\dfrac{1}{4} \\times \\dfrac{2\\pi}{3} = \\dfrac{\\pi}{6}$ ($30^\\circ$)이다.\\n따라서 호 $CD$의 중심각은 $\\dfrac{2\\pi}{3} - \\dfrac{\\pi}{6} = \\dfrac{\\pi}{2}$ ($90^\\circ$)이다.\\n점 $E$는 호 $CD$를 이등분하므로, 호 $CE$의 중심각은 $\\dfrac{1}{2} \\times \\dfrac{\\pi}{2} = \\dfrac{\\pi}{4}$ ($45^\\circ$)이다.\\n\\n2단계: 중심각을 이용하여 현의 길이 $\\overline{CD}$와 $\\overline{CE}$를 반지름 $R$로 표현한다.\\n중심각이 $\\theta$인 현의 길이는 $2R\\sin\\dfrac{\\theta}{2}$이다.\\n$\\overline{CD} = 2R\\sin\\dfrac{\\pi}{4} = 2R \\times \\dfrac{\\sqrt{2}}{2} = R\\sqrt{2} \\implies \\overline{CD}^2 = 2R^2$\\n$\\overline{CE} = 2R\\sin\\dfrac{\\pi}{8}$이므로 $\\overline{CE}^2 = 4R^2\\sin^2\\dfrac{\\pi}{8}$이다.\\n반각의 공식 $\\sin^2\\dfrac{\\theta}{2} = \\dfrac{1-\\cos\\theta}{2}$를 적용하면,\\n$\\sin^2\\dfrac{\\pi}{8} = \\dfrac{1-\\cos\\dfrac{\\pi}{4}}{2} = \\dfrac{1-\\dfrac{\\sqrt{2}}{2}}{2} = \\dfrac{2-\\sqrt{2}}{4}$\\n따라서 $\\overline{CE}^2 = 4R^2 \\times \\dfrac{2-\\sqrt{2}}{4} = R^2(2-\\sqrt{2})$이다.\\n\\n3단계: 주어진 관계식에 대입하여 $R^2$을 구한다.\\n$\\overline{CD}^2 = \\overline{CE}^2 + 9\\sqrt{2} \\implies 2R^2 = R^2(2-\\sqrt{2}) + 9\\sqrt{2}$\\n$2R^2 = 2R^2 - R^2\\sqrt{2} + 9\\sqrt{2} \\implies R^2\\sqrt{2} = 9\\sqrt{2} \\implies R^2 = 9$\\n\\n4단계: 구하고자 하는 $\\overline{BC}^2$의 값을 계산한다.\\n지름 $AB$에 대한 원주각 $\\angle ACB = \\dfrac{\\pi}{2}$이므로 $\\triangle ABC$는 직각삼각형이다.\\n$\\overline{BC} = AB\\sin\\dfrac{\\pi}{3} = 2R \\times \\dfrac{\\sqrt{3}}{2} = R\\sqrt{3}$\\n따라서 $\\overline{BC}^2 = 3R^2 = 3 \\times 9 = 27$이다.\\n결론: 따라서 정답은 ②이다.",
    image: "assets/images/25_제일고_1학기_기말_고2_수학I/q17.png"
  },
  {
    id: 18,
    level: "중",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "제곱근",
    "근호",
    "최대최소",
    "로그",
    "수열",
    "등차수열",
    "등비수열"
  ],
    wide: false,
    content: "1이 아닌 양의 실수 $a$, $b$, $c$가 순서대로 등비수열을 이룰 때, $\\langle$보기$\\rangle$에서 항상 옳은 것만을 모두 고른 것은? (4.7점)㉠ $a+c$의 최솟값은 $2b$이다.\\n\n㉡ $\\log_5 a$, $\\log_5 b$, $\\log_5 c$는 순서대로 등비수열을 이룬다.\\n\n㉢ $\\log_a x = \\log_b y = \\log_c z = 5$이면, $x$, $y$, $z$는 순서대로 등비수열을 이룬다.",
    choices: [
    "㉠",
    "㉡, ㉢",
    "㉠, ㉡",
    "㉠, ㉢",
    "㉠, ㉡, ㉢"
  ],
    answer: "④",
    solution: "[키포인트] 세 수 $a$, $b$, $c$가 순서대로 등비수열을 이룰 조건인 $b^2=ac$와 로그의 성질을 이용한다.\\n조건 정리: $a$, $b$, $c$는 1이 아닌 양의 실수이고, 순서대로 등비수열을 이루므로 $b^2=ac$이다.\\n정석 풀이:\\n㉠ $a>0$, $c>0$이므로 산술평균과 기하평균의 관계에 의해 $a+c \\ge 2\\sqrt{ac}$이다. 또 $ac=b^2$이고 $b>0$이므로 $\\sqrt{ac}=b$이다. 따라서 $a+c \\ge 2b$이고, 등호는 $a=c=b$일 때 성립하므로 최솟값은 $2b$이다. (참)\\n㉡ $\\log_5 a + \\log_5 c = \\log_5(ac)=\\log_5(b^2)=2\\log_5 b$이다. 따라서 $\\log_5 a$, $\\log_5 b$, $\\log_5 c$는 순서대로 등차수열을 이룬다. 항상 등비수열을 이루는 것은 아니다. (거짓)\\n㉢ $\\log_a x = \\log_b y = \\log_c z = 5$이면 $x=a^5$, $y=b^5$, $z=c^5$이다. $b^2=ac$의 양변을 5제곱하면 $b^{10}=a^5c^5$이므로 $(b^5)^2=a^5c^5$이다. 즉, $y^2=xz$이므로 $x$, $y$, $z$는 순서대로 등비수열을 이룬다. (참)\\n따라서 항상 옳은 것은 ㉠, ㉢이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    id: 19,
    level: "중",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "제곱근",
    "근호",
    "유리수",
    "분모유리화",
    "인수분해",
    "최대최소",
    "지수"
  ],
    wide: false,
    content: "첫째항이 2이고 공비가 음수인 등비수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하고, 수열 $\\{(a_n)^2\\}$의 첫째항부터 제$n$항까지의 합을 $T_n$이라 하자. $T_4 = 160$일 때, $S_4 = p + q\\sqrt{r}$이다. $\\dfrac{p}{q} + r$의 값을 구하면? (단, $p$, $q$, $r$은 유리수, $r$은 최솟값이다.)",
    choices: [
    "2",
    "3",
    "4",
    "5",
    "6"
  ],
    answer: "①",
    solution: "[키포인트] 원래의 등비수열과 각 항을 제곱한 수열의 첫째항 및 공비의 관계를 이용한다.\\n조건 정리: 수열 $\\{a_n\\}$의 첫째항 $a_1 = 2$, 공비 $R < 0$이라 하자. 항의 제곱 수열 $\\{a_n^2\\}$의 첫째항은 $a_1^2 = 4$, 공비는 $R^2$이 된다.\\n정석 풀이:\\n1단계: 제곱 수열의 합 $T_4$ 공식을 이용해 공비 $R$의 값을 구한다.\\n$T_4 = \\dfrac{4\\{(R^2)^4 - 1\\}}{R^2 - 1} = \\dfrac{4(R^8 - 1)}{R^2 - 1} = 160 \\implies \\dfrac{R^8 - 1}{R^2 - 1} = 40$\\n$R^2 = x$ ($x>0$)로 치환하면 $\\dfrac{x^4 - 1}{x - 1} = x^3 + x^2 + x + 1 = 40$이 된다.\\n$x^3 + x^2 + x - 39 = 0$\\n$x = 3$을 대입하면 $27 + 9 + 3 - 39 = 0$이므로 인수분해하면 $(x - 3)(x^2 + 4x + 13) = 0$이다.\\n$x > 0$이므로 $x = R^2 = 3$이다. 공비 $R$이 음수이므로 $R = -\\sqrt{3}$이다.\\n\\n2단계: 원래 수열의 합 $S_4$를 구한다.\\n$S_4 = \\dfrac{2\\{(-\\sqrt{3})^4 - 1\\}}{-\\sqrt{3} - 1} = \\dfrac{2(9 - 1)}{-(\\sqrt{3} + 1)} = \\dfrac{16}{-(\\sqrt{3} + 1)}$\\n분모를 유리화하면 다음과 같다.\\n$S_4 = \\dfrac{16(\\sqrt{3} - 1)}{-(\\sqrt{3} + 1)(\\sqrt{3} - 1)} = \\dfrac{16(\\sqrt{3} - 1)}{-(3 - 1)} = -8(\\sqrt{3} - 1) = 8 - 8\\sqrt{3}$\\n\\n3단계: 미지수 $p, q, r$을 비교하여 최종 식의 값을 계산한다.\\n$S_4 = 8 - 8\\sqrt{3}$에서 $p = 8$, $q = -8$, $r = 3$이다.\\n$\\dfrac{p}{q} + r = \\dfrac{8}{-8} + 3 = -1 + 3 = 2$\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 20,
    level: "상",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "객관식",
    "절댓값",
    "전개",
    "최대최소",
    "수열",
    "시그마",
    "범위",
    "조건해석"
  ],
    wide: false,
    content: "다음 조건을 만족하는 모든 수열 $\\{a_n\\}$에 대하여 $|a_5|$의 최댓값과 최솟값을 각각 $M$, $m$이라 할 때, $\\dfrac{M}{m}$의 값은?\n\\n<조건>\\n\n(가) $a_2 = 9$, $a_3 \\times a_4 > 0$\\n\n(나) 2이상의 모든 $n$에 대하여 $\\displaystyle\\sum_{k=1}^{n} a_k = 2|a_n|$",
    choices: [
    "3",
    "6",
    "9",
    "18",
    "27"
  ],
    answer: "⑤",
    solution: "[키포인트] 수열의 합과 일반항의 관계 $S_n - S_{n-1} = a_n$을 절대값 기호가 포함된 조건식에 적용하여 항 사이의 점화식을 유도한다.\\n조건 정리: $a_2 = 9$이므로 제2항까지의 누적합 $S_2$는 공식에 의해 고정된다.\\n풀이 방향: $n \\ge 3$일 때 $a_n$의 부호에 따라 전개되는 항의 비율 관계를 케이스별로 분리하여 $|a_5|$의 후보군을 도출한다.\\n정석 풀이:\\n1단계: 초기 조건 분석 및 $a_1$ 결정\\n$n=2$일 때 조건 (나)에 의해 $S_2 = a_1 + a_2 = 2|a_2|$가 성립한다.\\n$a_2 = 9$이므로 $a_1 + 9 = 2 \\times 9 = 18 \\implies a_1 = 9$이다.\\n\\n2단계: $n \\ge 3$일 때의 일반 점화식 유도\\n조건 (나)에서 $\\displaystyle\\sum_{k=1}^{n} a_k = 2|a_n|$이고 $\\displaystyle\\sum_{k=1}^{n-1} a_k = 2|a_{n-1}|$이다.\\n두 식을 변변 빼면 $a_n = 2|a_n| - 2|a_{n-1}| \\implies 2|a_{n-1}| = 2|a_n| - a_n$이 성립한다.\\n이때 $a_n$의 부호에 따라 다음 두 가지 경우로 나뉜다.\\nCASE 1) $a_n > 0$일 때: $2|a_{n-1}| = 2a_n - a_n = a_n \\implies a_n = 2|a_{n-1}|$\\nCASE 2) $a_n < 0$일 때: $2|a_{n-1}| = -2a_n - a_n = -3a_n \\implies a_n = -\\dfrac{2}{3}|a_{n-1}|$\\n결과적으로 각 항의 절대값은 다음과 같은 변환 규칙을 따른다.\\n$a_n > 0 \\implies |a_n| = 2|a_{n-1}|$\\n$a_n < 0 \\implies |a_n| = \\dfrac{2}{3}|a_{n-1}|$\\n\\n3단계: 조건 (가)를 만족하는 수열의 경로 분석\\n$|a_2| = 9$에서 시작한다.\\n조건 (가)에서 $a_3 \\times a_4 > 0$이므로 $a_3$와 $a_4$는 서로 같은 부호를 가져야 한다.\\n경로 A) $a_3 > 0$이고 $a_4 > 0$인 경우:\\n$|a_3| = 2|a_2| = 2 \\times 9 = 18 \\implies a_3 = 18$\\n$|a_4| = 2|a_3| = 2 \\times 18 = 36 \\implies a_4 = 36$\\n경로 B) $a_3 < 0$이고 $a_4 < 0$인 경우:\\n$|a_3| = \\dfrac{2}{3}|a_2| = \\dfrac{2}{3} \\times 9 = 6 \\implies a_3 = -6$\\n$|a_4| = \\dfrac{2}{3}|a_3| = \\dfrac{2}{3} \\times 6 = 4 \\implies a_4 = -4$\\n\\n4단계: $|a_5|$의 최댓값 $M$과 최솟값 $m$ 결정\\n$a_5$는 부호 제약이 없으므로 각 경로의 $|a_4|$ 결과값에서 증가(2배) 또는 감소($\\dfrac{2}{3}$배)가 모두 가능하다.\\n경로 A ($|a_4|=36$)에서 생성되는 값: $36 \\times 2 = 72$ 또는 $36 \\times \\dfrac{2}{3} = 24$\\n경로 B ($|a_4|=4$)에서 생성되는 값: $4 \\times 2 = 8$ 또는 $4 \\times \\dfrac{2}{3} = \\dfrac{8}{3}$\\n따라서 $|a_5|$의 최댓값 $M = 72$, 최솟값 $m = \\dfrac{8}{3}$이다.\\n\\n5단계: 최종 비율 계산\\n$\\dfrac{M}{m} = \\dfrac{72}{\\dfrac{8}{3}} = 72 \\times \\dfrac{3}{8} = 9 \\times 3 = 27$\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    id: 21,
    level: "중",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "※ 다음 조건을 만족시키는 두 실수 $\\alpha$, $\\beta$에 대하여 $\\dfrac{12}{\\pi}(\\beta-\\alpha)$의 최댓값을 구하려고 한다. 다음 물음에 답하시오.\\n(서술형 1~3, 총 10점, 각 문항별 부분 점수 있음.)\\n\\n$0 \\le x < 2\\pi$에서 함수\\n$$f(x)=\\cos^2\\left(\\dfrac{13}{12}\\pi-2x\\right)+\\cos\\left(2x-\\dfrac{7}{12}\\pi\\right)-1$$\\n은 $x=\\alpha$일 때 최댓값을 갖고, $x=\\beta$일 때 최솟값을 갖는다.\\n\\n<서술형 1>\\n$\\sin\\left(2x-\\dfrac{\\pi}{12}\\right)$를 $t$로 치환하여 함수 $f(x)$를 $t$에 대한 함수 $g(t)$로 나타내시오.\\n(단, 함수 $g(t)$의 정의역 즉, $t$의 범위도 함께 나타내기) (4점)",
    choices: [],
    answer: "$g(t)=-t^2+t$ (단, $-1 \\le t \\le 1$)",
    solution: "[키포인트] 삼각함수의 각 변환 관계를 파악하여 공통된 사인 함수식 구조로 치환한다.\\n조건 정리: 변환하고자 하는 목표 각도는 $\\theta=2x-\\dfrac{\\pi}{12}$이다.\\n정석 풀이:\\n$\\theta=2x-\\dfrac{\\pi}{12}$라 하자.\\n첫 번째 각도는\\n$\\dfrac{13}{12}\\pi-2x=\\pi-\\left(2x-\\dfrac{\\pi}{12}\\right)=\\pi-\\theta$이다.\\n따라서 $\\cos^2(\\pi-\\theta)=\\cos^2\\theta=1-\\sin^2\\theta$이다.\\n두 번째 각도는\\n$2x-\\dfrac{7}{12}\\pi=\\left(2x-\\dfrac{\\pi}{12}\\right)-\\dfrac{\\pi}{2}=\\theta-\\dfrac{\\pi}{2}$이다.\\n따라서 $\\cos\\left(\\theta-\\dfrac{\\pi}{2}\\right)=\\sin\\theta$이다.\\n그러므로\\n$f(x)=\\cos^2(\\pi-\\theta)+\\cos\\left(\\theta-\\dfrac{\\pi}{2}\\right)-1$\\n$=(1-\\sin^2\\theta)+\\sin\\theta-1=-\\sin^2\\theta+\\sin\\theta$이다.\\n이때 $t=\\sin\\theta=\\sin\\left(2x-\\dfrac{\\pi}{12}\\right)$로 놓으면\\n$g(t)=-t^2+t$이다.\\n또한 $0\\le x<2\\pi$에서 $2x-\\dfrac{\\pi}{12}$는 사인함수의 한 주기 이상을 포함하므로 $t$의 범위는 $-1\\le t\\le 1$이다.\\n결론: 따라서 $g(t)=-t^2+t$ (단, $-1\\le t\\le 1$)이다."
  },
  {
    id: 22,
    level: "상",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "※ 다음 조건을 만족시키는 두 실수 $\\alpha$, $\\beta$에 대하여 $\\dfrac{12}{\\pi}(\\beta-\\alpha)$의 최댓값을 구하려고 한다. 다음 물음에 답하시오.\\n(서술형 1~3, 총 10점, 각 문항별 부분 점수 있음.)\\n\\n$0 \\le x < 2\\pi$에서 함수\\n$$f(x)=\\cos^2\\left(\\dfrac{13}{12}\\pi-2x\\right)+\\cos\\left(2x-\\dfrac{7}{12}\\pi\\right)-1$$\\n은 $x=\\alpha$일 때 최댓값을 갖고, $x=\\beta$일 때 최솟값을 갖는다.\\n\\n<서술형 2>\\n$\\alpha$의 최솟값과 $\\beta$의 최댓값을 각각 구하시오. (4점)",
    choices: [],
    answer: "$\\alpha$의 최솟값: $\\dfrac{\\pi}{8}$, $\\beta$의 최댓값: $\\dfrac{43\\pi}{24}$",
    solution: "[키포인트] 치환된 이차함수의 최대·최소 조건으로부터 실제 삼각방정식의 해를 구하고 범위 내 극단값을 선별한다.\\n조건 정리: 서술형 1에 의해 $g(t)=-t^2+t=-\\left(t-\\dfrac{1}{2}\\right)^2+\\dfrac{1}{4}$ (단, $-1\\le t\\le 1$)이다.\\n정석 풀이:\\n1단계: 최댓값을 갖는 조건을 구한다.\\n$g(t)$는 $t=\\dfrac{1}{2}$에서 최댓값을 갖는다.\\n따라서 $\\sin\\left(2x-\\dfrac{\\pi}{12}\\right)=\\dfrac{1}{2}$이다.\\n$\\theta=2x-\\dfrac{\\pi}{12}$라 하면, $0\\le x<2\\pi$에서 가능한 $\\theta$의 값은\\n$\\theta=\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{13\\pi}{6},\\ \\dfrac{17\\pi}{6}$이다.\\n$2x=\\theta+\\dfrac{\\pi}{12}$이므로 $x$의 값은\\n$\\dfrac{\\pi}{8},\\ \\dfrac{11\\pi}{24},\\ \\dfrac{9\\pi}{8},\\ \\dfrac{35\\pi}{24}$이다.\\n따라서 $\\alpha$의 최솟값은 $\\dfrac{\\pi}{8}$이다.\\n\\n2단계: 최솟값을 갖는 조건을 구한다.\\n$-1\\le t\\le 1$에서 $g(t)=-t^2+t$는 $t=-1$에서 최솟값을 갖는다.\\n따라서 $\\sin\\left(2x-\\dfrac{\\pi}{12}\\right)=-1$이다.\\n$\\theta=2x-\\dfrac{\\pi}{12}$라 하면, 가능한 $\\theta$의 값은\\n$\\theta=\\dfrac{3\\pi}{2},\\ \\dfrac{7\\pi}{2}$이다.\\n$2x=\\theta+\\dfrac{\\pi}{12}$이므로 $x$의 값은\\n$\\dfrac{19\\pi}{24},\\ \\dfrac{43\\pi}{24}$이다.\\n따라서 $\\beta$의 최댓값은 $\\dfrac{43\\pi}{24}$이다.\\n결론: $\\alpha$의 최솟값은 $\\dfrac{\\pi}{8}$, $\\beta$의 최댓값은 $\\dfrac{43\\pi}{24}$이다."
  },
  {
    id: 23,
    level: "중",
    category: "삼각함수의 그래프",
    originalCategory: "삼각함수의 그래프",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-06",
    standardUnit: "삼각함수의 그래프",
    standardUnitOrder: 6,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "※ 다음 조건을 만족시키는 두 실수 $\\alpha$, $\\beta$에 대하여 $\\dfrac{12}{\\pi}(\\beta-\\alpha)$의 최댓값을 구하려고 한다. 다음 물음에 답하시오.\\n(서술형 1~3, 총 10점, 각 문항별 부분 점수 있음.)\\n\\n$0 \\le x < 2\\pi$에서 함수\\n$$f(x)=\\cos^2\\left(\\dfrac{13}{12}\\pi-2x\\right)+\\cos\\left(2x-\\dfrac{7}{12}\\pi\\right)-1$$\\n은 $x=\\alpha$일 때 최댓값을 갖고, $x=\\beta$일 때 최솟값을 갖는다.\\n\\n<서술형 3>\\n$\\dfrac{12}{\\pi}(\\beta-\\alpha)$의 최댓값을 구하시오. (2점)",
    choices: [],
    answer: "20",
    solution: "[키포인트] 서술형 2에서 구한 $\\alpha$의 최소 조건과 $\\beta$의 최대 조건을 활용하여 차이값의 최대 구조를 계산한다.\\n조건 정리: $\\dfrac{12}{\\pi}(\\beta-\\alpha)$를 최대로 만들려면 $\\beta$는 가능한 최댓값, $\\alpha$는 가능한 최솟값을 선택한다.\\n정석 풀이:\\n서술형 2에서 $\\alpha$의 최솟값은 $\\dfrac{\\pi}{8}$이고, $\\beta$의 최댓값은 $\\dfrac{43\\pi}{24}$이다.\\n따라서 $\\beta-\\alpha$의 최댓값은\\n$\\dfrac{43\\pi}{24}-\\dfrac{\\pi}{8}=\\dfrac{43\\pi}{24}-\\dfrac{3\\pi}{24}=\\dfrac{40\\pi}{24}=\\dfrac{5\\pi}{3}$이다.\\n그러므로\\n$\\dfrac{12}{\\pi}(\\beta-\\alpha)=\\dfrac{12}{\\pi}\\cdot\\dfrac{5\\pi}{3}=20$이다.\\n결론: 따라서 구하는 값은 20이다."
  },
  {
    id: 24,
    level: "중",
    category: "나머지 정리",
    originalCategory: "항등식과 나머지 정리",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-02",
    standardUnit: "항등식과 나머지 정리",
    standardUnitOrder: 2,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "\\n다항식 $x^{10}+x^9+\\cdots+x^2+x+1$을 $x-2$로 나눈 몫을 $Q(x)$라 할 때, $Q(x)$를 $x-1$로 나눈 나머지를 구하고 그 과정을 서술하시오.\\n(총 5점-부분점수 있음)",
    choices: [],
    answer: "2036",
    solution: "[키포인트] 다항식의 나눗셈 항등식 $P(x)=(x-a)Q(x)+R$과 나머지정리를 활용한다.\\n조건 정리: 주어진 다항식을 $P(x)=x^{10}+x^9+\\cdots+x+1$이라 하자. 항의 개수는 11개이다.\\n정석 풀이:\\n$P(x)$를 $x-2$로 나눈 몫이 $Q(x)$이므로\\n$P(x)=(x-2)Q(x)+P(2)$이다.\\n$Q(x)$를 $x-1$로 나눈 나머지는 나머지정리에 의해 $Q(1)$이다.\\n위 식에 $x=1$을 대입하면\\n$P(1)=(1-2)Q(1)+P(2)=-Q(1)+P(2)$이다.\\n따라서 $Q(1)=P(2)-P(1)$이다.\\n$P(1)=1^{10}+1^9+\\cdots+1+1=11$이다.\\n또 $P(2)=2^{10}+2^9+\\cdots+2+1=2^{11}-1=2047$이다.\\n따라서 $Q(1)=2047-11=2036$이다.\\n결론: 따라서 구하는 나머지는 2036이다."
  },
  {
    id: 25,
    level: "중",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "서술형 5\\n등식\\n$$1\\times n+2\\times(n-1)+3\\times(n-2)+\\cdots+(n-1)\\times2+n\\times1=\\dfrac{n(n+a)(n+b)}{6}$$\\n가 성립할 때, 상수 $a$, $b$를 구하고 그 과정을 서술하시오.\\n(총 5점-부분점수 있음)",
    choices: [],
    answer: "$a=1,\\ b=2$ 또는 $a=2,\\ b=1$",
    solution: "[키포인트] 좌변의 규칙적인 유한 합 구조를 일반항 $k(n-k+1)$로 설정하여 시그마 공식으로 합산한다.\\n조건 정리: 좌변의 제$k$번째 항은 $k\\times\\{n-(k-1)\\}=k(n-k+1)$로 나타낼 수 있다.\\n정석 풀이:\\n좌변을 시그마로 나타내면\\n$\\displaystyle\\sum_{k=1}^{n}k(n-k+1)$이다.\\n이를 전개하면\\n$\\displaystyle\\sum_{k=1}^{n}\\{(n+1)k-k^2\\}=(n+1)\\sum_{k=1}^{n}k-\\sum_{k=1}^{n}k^2$이다.\\n자연수의 합 공식을 대입하면\\n$(n+1)\\cdot\\dfrac{n(n+1)}{2}-\\dfrac{n(n+1)(2n+1)}{6}$\\n$=\\dfrac{n(n+1)}{6}\\{3(n+1)-(2n+1)\\}$\\n$=\\dfrac{n(n+1)}{6}(n+2)=\\dfrac{n(n+1)(n+2)}{6}$이다.\\n이 식이 $\\dfrac{n(n+a)(n+b)}{6}$과 같으므로 $n+a$, $n+b$는 각각 $n+1$, $n+2$이다.\\n따라서 $(a,b)=(1,2)$ 또는 $(2,1)$이다.\\n결론: 따라서 $a=1$, $b=2$ 또는 $a=2$, $b=1$이다."
  }
];
