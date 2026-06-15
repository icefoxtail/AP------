window.examTitle = "25_금당고_1학기_기말_고2_수학I";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "등차수열",
    originalCategory: "등차수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-08",
    standardUnit: "등차수열",
    standardUnitOrder: 8,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "여섯 개의 수 $1, 3, x, 7, y, 11$이 순서대로 등차수열을 이룰 때, $y-x$의 값은?",
    choices: [
    "1",
    "2",
    "3",
    "4",
    "6"
  ],
    answer: "④",
    solution: "[키포인트] 등차수열의 정의를 이용하여 미지수의 값을 구한다.\\n조건 정리: 수열 $1, 3, x, 7, y, 11$이 등차수열을 이룬다.\\n풀이 방향: 인접한 두 항의 차이를 통해 공차를 구하고, 이를 이용해 $x$와 $y$의 값을 구한다.\\n정석 풀이: 첫째항이 1이고 둘째항이 3이므로 공차 $d$는 $3 - 1 = 2$이다.\\n따라서 등차수열의 각 항을 구하면 다음과 같다.\\n$x = 3 + 2 = 5$\\n$y = 7 + 2 = 9$\\n따라서 $y - x = 9 - 5 = 4$이다.\\n따라서 정답은 ④이다."
  },
  {
    id: 2,
    level: "하",
    category: "등차수열",
    originalCategory: "등차수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-08",
    standardUnit: "등차수열",
    standardUnitOrder: 8,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "`다음 등차수열의 제10항은?\n<div class=\"note-box\">$2, 5, 8, 11, ⋯$</div>`",
    choices: [
    "21",
    "23",
    "25",
    "27",
    "29"
  ],
    answer: "⑤",
    solution: "[키포인트] 등차수열의 일반항 공식을 이용하여 특정 항의 값을 구한다.\\n조건 정리: 등차수열 $2, 5, 8, 11, \\cdots$의 제10항을 구해야 한다.\\n풀이 방향: 첫째항과 공차를 찾아 일반항 $a_n = a_1 + (n-1)d$에 대입한다.\\n정석 풀이: 주어진 등차수열의 첫째항은 $a_1 = 2$이고, 공차는 $d = 5 - 2 = 3$이다.\\n등차수열의 일반항 $a_n$은 다음과 같다.\\n$a_n = 2 + (n-1) \\times 3 = 3n - 1$\\n따라서 제10항 $a_{10}$의 값은 다음과 같다.\\n$a_{10} = 3 \\times 10 - 1 = 29$\\n따라서 정답은 ⑤이다."
  },
  {
    id: 3,
    level: "하",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "첫째항이 2, 공비가 3인 등비수열의 첫째항부터 제5항까지의 합은?",
    choices: [
    "240",
    "241",
    "242",
    "243",
    "244"
  ],
    answer: "③",
    solution: "[키포인트] 등비수열의 합 공식을 이용하여 첫째항부터 제5항까지의 합을 구한다.\\n조건 정리: 첫째항 $a = 2$, 공비 $r = 3$인 등비수열의 첫째항부터 제5항까지의 합 $S_5$를 구한다.\\n풀이 방향: 등비수열의 합 공식 $S_n = \\dfrac{a(r^n - 1)}{r - 1}$에 주어진 값을 대입한다.\\n정석 풀이: 첫째항 $a = 2$, 공비 $r = 3$, 항의 개수 $n = 5$이므로 등비수열의 합 공식에 대입하면 다음과 같다.\\n$S_5 = \\dfrac{2 \\times (3^5 - 1)}{3 - 1} = \\dfrac{2 \\times (243 - 1)}{2} = 242$\\n따라서 정답은 ③이다."
  },
  {
    id: 4,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "$\\triangle ABC$에서 $a=\\sqrt{6}$, $A=\\dfrac{\\pi}{3}$, $B=\\dfrac{\\pi}{4}$ 일 때, $b$의 값과 외접원의 반지름의 길이 $R$의 값을 알맞게 짝지은 것은?",
    choices: [
    "$b=1, R=\\sqrt{2}$",
    "$b=2, R=\\sqrt{2}$",
    "$b=4, R=2\\sqrt{2}$",
    "$b=6, R=\\sqrt{2}$",
    "$b=8, R=2\\sqrt{2}$"
  ],
    answer: "②",
    solution: "[키포인트] 사인법칙을 이용하여 삼각형의 변의 길이와 외접원의 반지름의 길이를 구한다.\\n조건 정리: $\\triangle ABC$에서 $a = \\sqrt{6}$, $A = \\dfrac{\\pi}{3}$, $B = \\dfrac{\\pi}{4}$이다.\\n풀이 방향: 사인법칙 $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = 2R$을 이용하여 $b$와 $R$의 값을 각각 구한다.\\n정석 풀이: 사인법칙에 의해 다음이 성립한다.\\n$\\dfrac{\\sqrt{6}}{\\sin\\dfrac{\\pi}{3}} = 2R \\implies \\dfrac{\\sqrt{6}}{\\dfrac{\\sqrt{3}}{2}} = 2R \\implies 2\\sqrt{2} = 2R \\implies R = \\sqrt{2}$\\n또한, $\\dfrac{b}{\\sin B} = 2R$이므로 다음이 성립한다.\\n$\\dfrac{b}{\\sin\\dfrac{\\pi}{4}} = 2\\sqrt{2} \\implies \\dfrac{b}{\\dfrac{\\sqrt{2}}{2}} = 2\\sqrt{2} \\implies b = 2\\sqrt{2} \\times \\dfrac{\\sqrt{2}}{2} = 2$\\n따라서 $b = 2$, $R = \\sqrt{2}$이다.\\n따라서 정답은 ②이다."
  },
  {
    id: 5,
    level: "중",
    category: "삼각함수의 뜻과 값",
    originalCategory: "삼각함수의 뜻과 값",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-05",
    standardUnit: "삼각함수의 뜻과 값",
    standardUnitOrder: 5,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "$\\triangle ABC$에서 $a=7$, $b=3$, $c=8$ 일 때, $\\cos A$의 값은?",
    choices: [
    "$\\dfrac{1}{2}$",
    "$\\dfrac{\\sqrt{2}}{2}$",
    "$\\dfrac{\\sqrt{3}}{2}$",
    "$-\\dfrac{\\sqrt{2}}{2}$",
    "$-\\dfrac{1}{2}$"
  ],
    answer: "①",
    solution: "[키포인트] 코사인법칙을 이용하여 삼각형의 한 각의 코사인값을 구한다.\\n조건 정리: $\\triangle ABC$에서 $a = 7$, $b = 3$, $c = 8$이다.\\n풀이 방향: 코사인법칙 $\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}$에 세 변의 길이를 대입한다.\\n정석 풀이: 코사인법칙 공식에 주어진 변의 길이를 대입하면 다음과 같다.\\n$\\cos A = \\dfrac{3^2 + 8^2 - 7^2}{2 \\times 3 \times 8} = \\dfrac{9 + 64 - 49}{48} = \\dfrac{24}{48} = \\dfrac{1}{2}$\\n따라서 정답은 ①이다."
  },
  {
    id: 6,
    level: "하",
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
    content: "삼각형 $ABC$에서 $\\overline{AC}=12$, $\\overline{BC}=8$, $\\angle C=\\dfrac{\\pi}{6}$ 일 때, 삼각형 $ABC$의 넓이는?",
    choices: [
    "16",
    "18",
    "20",
    "22",
    "24"
  ],
    answer: "⑤",
    solution: "[키포인트] 두 변의 길이와 그 끼인각의 크기가 주어졌을 때 삼각형의 넓이 공식을 이용한다.\\n조건 정리: $\\overline{AC} = 12$, $\\overline{BC} = 8$, $\\angle C = \\dfrac{\\pi}{6}$이다.\\n풀이 방향: 삼각형의 넓이 공식 $S = \\dfrac{1}{2}ab\\sin C$에 주어진 값을 대입한다.\\n정석 풀이: 두 변의 길이와 끼인각의 크기를 공식에 대입하면 다음과 같다.\\n$S = \\dfrac{1}{2} \\times 12 \\times 8 \\times \\sin\\dfrac{\\pi}{6} = 48 \\times \\dfrac{1}{2} = 24$\\n따라서 정답은 ⑤이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q6.png"
  },
  {
    id: 7,
    level: "중",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "두 수열 $\\{a_n\\}, \\{b_n\\}$에 대하여 $\\sum_{k=1}^{30}(3a_k-b_k-1)=10$, $\\sum_{k=1}^{30}(2a_k+b_k)=35$ 일 때, $\\sum_{k=1}^{30}b_k$의 값은?",
    choices: [
    "5",
    "6",
    "7",
    "8",
    "9"
  ],
    answer: "①",
    solution: "[키포인트] 시그마의 성질을 이용하여 연립방정식을 세우고 원하는 시그마 값을 구한다.\\n조건 정리: $\\sum_{k=1}^{30}(3a_k - b_k - 1) = 10$, $\\sum_{k=1}^{30}(2a_k + b_k) = 35$이다.\\n풀이 방향: 시그마의 선형성을 이용해 식을 분리한 후, $\\sum_{k=1}^{30} a_k$와 $\\sum_{k=1}^{30} b_k$를 미지수로 하는 연립방정식을 푼다.\\n정석 풀이: $A = \\sum_{k=1}^{30} a_k$, $B = \\sum_{k=1}^{30} b_k$라 하자.\\n첫 번째 식을 정리하면 다음과 같다.\\n$3A - B - \\sum_{k=1}^{30} 1 = 10 \\implies 3A - B - 30 = 10 \\implies 3A - B = 40$  (1)\\n두 번째 식을 정리하면 다음과 같다.\\n$2A + B = 35$  (2)\\n(1)번 식과 (2)번 식을 더하면 다음과 같다.\\n$5A = 75 \\implies A = 15$\\n$A = 15$를 (2)번 식에 대입하면 다음과 같다.\\n$2 \\times 15 + B = 35 \\implies 30 + B = 35 \\implies B = 5$\\n따라서 $\\sum_{k=1}^{30} b_k = 5$이다.\\n따라서 정답은 ①이다."
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
    "도형"
  ],
    wide: false,
    content: "다음 그림과 같이 높이가 9인 원기둥이 있다. 윗면의 원의 둘레에 세 점 $A, B, C$를 잡아 삼각형 $ABC$를 만들었더니 $c=5$, $A=70^{\\circ}$, $B=50^{\\circ}$ 였다. 원기둥의 부피는?",
    choices: [
    "55$\\pi$",
    "60$\\pi$",
    "65$\\pi$",
    "70$\\pi$",
    "75$\\pi$"
  ],
    answer: "⑤",
    solution: "[키포인트] 사인법칙으로 원의 반지름을 구한 뒤 원기둥의 부피를 계산한다.\n조건 정리: 원기둥의 높이는 9이고, 윗면 원에 내접한 삼각형 $ABC$에서 $c=5$, $A=70^{\\circ}$, $B=50^{\\circ}$이다.\n풀이 방향: $C=60^{\\circ}$를 구한 뒤 사인법칙 $\\dfrac{c}{\\sin C}=2R$로 밑면의 반지름 $R$을 구한다.\n정석 풀이: 삼각형의 내각의 합에서 $C=180^{\\circ}-70^{\\circ}-50^{\\circ}=60^{\\circ}$이다. 사인법칙에 의해 $\\dfrac{5}{\\sin60^{\\circ}}=2R$이므로 $\\dfrac{5}{\\dfrac{\\sqrt{3}}{2}}=2R$이다. 따라서 $R=\\dfrac{5}{\\sqrt{3}}$이다. 원기둥의 밑면의 넓이는 $\\pi R^2=\\pi\\left(\\dfrac{5}{\\sqrt{3}}\\right)^2=\\dfrac{25}{3}\\pi$이고, 높이가 9이므로 부피는 $\\dfrac{25}{3}\\pi\\times9=75\\pi$이다.\n따라서 정답은 ⑤이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q8.png"
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
    tags: [],
    wide: false,
    content: "세 변의 길이가 $13, 14, 15$인 $\\triangle ABC$의 내접원의 반지름의 길이는?",
    choices: [
    "4",
    "6",
    "8",
    "10",
    "12"
  ],
    answer: "①",
    solution: "[키포인트] 헤론의 공식과 $S=rs$를 이용하여 내접원의 반지름을 구한다.\n조건 정리: 삼각형의 세 변의 길이는 $13,14,15$이고, 내접원의 반지름을 구해야 한다.\n풀이 방향: 반둘레 $s$와 넓이 $S$를 구한 뒤 $S=rs$에 대입한다.\n정석 풀이: 반둘레는 $s=\\dfrac{13+14+15}{2}=21$이다. 헤론의 공식에 의해 넓이는 $S=\\sqrt{21(21-13)(21-14)(21-15)}=\\sqrt{21\\times8\\times7\\times6}=84$이다. 삼각형의 넓이는 $S=rs$이므로 $84=21r$이다. 따라서 내접원의 반지름은 $r=4$이다.\n따라서 정답은 ①이다."
  },
  {
    id: 10,
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
    content: "다음 그림과 같이 한 변의 길이가 8인 정육각형에서 변 $EF$의 중점을 $M$이라 하자. $\\angle AMF=\\theta$라 할 때, $7\\cos\\theta$의 값은?",
    choices: [
    "$\\sqrt{7}$",
    "$2\\sqrt{7}$",
    "$3\\sqrt{7}$",
    "$4\\sqrt{7}$",
    "$5\\sqrt{7}$"
  ],
    answer: "②",
    solution: "[키포인트] 정육각형의 한 내각이 $120^{\\circ}$임을 이용해 코사인법칙을 두 번 적용한다.\n조건 정리: 정육각형 $ABCDEF$의 한 변의 길이는 8이고, $M$은 $EF$의 중점이므로 $AF=8$, $FM=4$, $\\angle AFM=120^{\\circ}$이다.\n풀이 방향: 먼저 $AM$의 길이를 구한 뒤, 삼각형 $AFM$에서 $\\angle AMF=\\theta$에 대한 코사인값을 구한다.\n정석 풀이: 코사인법칙에 의해 $AM^2=AF^2+FM^2-2\\cdot AF\\cdot FM\\cos120^{\\circ}$이다. 따라서 $AM^2=8^2+4^2-2\\cdot8\\cdot4\\left(-\\dfrac{1}{2}\\right)=64+16+32=112$이므로 $AM=4\\sqrt{7}$이다. 다시 삼각형 $AFM$에서 $AF^2=AM^2+FM^2-2\\cdot AM\\cdot FM\\cos\\theta$이므로 $64=112+16-2\\cdot4\\sqrt{7}\\cdot4\\cos\\theta$이다. 따라서 $32\\sqrt{7}\\cos\\theta=64$이고 $\\cos\\theta=\\dfrac{2}{\\sqrt{7}}$이다. 그러므로 $7\\cos\\theta=7\\cdot\\dfrac{2}{\\sqrt{7}}=2\\sqrt{7}$이다.\n따라서 정답은 ②이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q10.png"
  },
  {
    id: 11,
    level: "중",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "$\\sum_{k=1}^{10}(k+1)^2 - \\sum_{k=1}^{10}k(k-2)$의 값은?",
    choices: [
    "225",
    "230",
    "235",
    "240",
    "245"
  ],
    answer: "②",
    solution: "[키포인트] 시그마의 성질을 이용하여 식을 단순화한 후 자연수의 거듭제곱의 합 공식을 적용한다.\\n조건 정리: $\\sum_{k=1}^{10}(k+1)^2 - \\sum_{k=1}^{10}k(k-2)$의 값을 구한다.\\n풀이 방향: 두 시그마의 일반항을 결합하여 일차식 형태로 정리한 후 합을 구한다.\\n정석 풀이: 두 시그마를 합치면 다음과 같이 일반항이 정리된다.\\n$(k+1)^2 - k(k-2) = (k^2 + 2k + 1) - (k^2 - 2k) = 4k + 1$\\n따라서 주어진 식은 다음과 같이 계산된다.\\n$\\sum_{k=1}^{10} (4k + 1) = 4 \\sum_{k=1}^{10} k + \\sum_{k=1}^{10} 1 = 4 \\times \\dfrac{10 \\times 11}{2} + 10 = 220 + 10 = 230$\\n따라서 정답은 ②이다."
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
    tags: [],
    wide: false,
    content: "모든 항이 양수인 등비수열 $\\{a_n\\}$에 대하여 $\\dfrac{a_2 a_6}{a_5}=8$, $a_3+a_7=24$ 일 때, $a_{11}$의 값은?",
    choices: [
    "64",
    "32",
    "16",
    "8",
    "4"
  ],
    answer: "②",
    solution: "[키포인트] 등비수열의 일반항 공식을 세우고 주어진 관계식을 연립하여 특정 항의 값을 구한다.\\n조건 정리: 모든 항이 양수인 등비수열 $\\{a_n\\}$에 대하여 $\\dfrac{a_2 a_6}{a_5} = 8$, $a_3 + a_7 = 24$이다.\\n풀이 방향: 첫째항 $a$와 공비 $r$을 이용하여 식을 표현한 후, 공비와 첫째항을 차례로 구한다.\\n정석 풀이: 등비수열의 일반항 $a_n = ar^{n-1}$을 첫 번째 조건식에 대입하면 다음과 같다.\\n$\\dfrac{ar \\times ar^5}{ar^4} = 8 \\implies ar^2 = 8$  (1)\\n두 번째 조건식에 대입하면 다음과 같다.\\n$ar^2 + ar^6 = 24 \\implies ar^2(1 + r^4) = 24$\\n(1)번 식의 $ar^2 = 8$을 대입하면 다음과 같다.\\n$8(1 + r^4) = 24 \\implies 1 + r^4 = 3 \\implies r^4 = 2$\\n구하고자 하는 제11항 $a_{11}$의 값은 다음과 같다.\\n$a_{11} = ar^{10} = ar^2 \\times (r^4)^2 = 8 \\times 2^2 = 8 \\times 4 = 32$\\n따라서 정답은 ②이다."
  },
  {
    id: 13,
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
    content: "그림과 같이 반지름의 길이가 $R$인 원 $O$에 내접하는 삼각형 $ABC$가 있다. $\\overline{AB}=5$, $\\overline{AC}=6$, $\\cos A = \\dfrac{3}{5}$일 때, $32R$의 값은?",
    choices: [
    "40",
    "60",
    "80",
    "100",
    "120"
  ],
    answer: "④",
    solution: "[키포인트] 코사인법칙으로 삼각형의 한 변의 길이를 구한 후, 사인법칙을 통해 외접원의 반지름을 구한다.\\n조건 정리: 원 $O$에 내접하는 삼각형 $ABC$에서 $\\overline{AB} = 5$, $\\overline{AC} = 6$, $\\cos A = \\dfrac{3}{5}$이다.\\n풀이 방향: 코사인법칙으로 변 $BC$의 길이를 구하고, $\\sin A$의 값을 찾아 사인법칙으로 외접원의 반지름 $R$을 계산한다.\\n정석 풀이: 코사인법칙에 의해 변 $BC$의 길이는 다음과 같다.\\n$\\overline{BC}^2 = \\overline{AB}^2 + \\overline{AC}^2 - 2 \\times \\overline{AB} \\times \\overline{AC} \\times \\cos A$\\n$\\overline{BC}^2 = 5^2 + 6^2 - 2 \\times 5 \\times 6 \\times \\dfrac{3}{5} = 25 + 36 - 36 = 25 \\implies \\overline{BC} = 5$\\n모든 각이 양의 사인이므로 $\\sin A = \\sqrt{1 - \\cos^2 A} = \\sqrt{1 - \\left(\\dfrac{3}{5}\\right)^2} = \\dfrac{4}{5}$이다.\\n사인법칙에 의해 다음이 성립한다.\\n$\\dfrac{\\overline{BC}}{\\sin A} = 2R \\implies \\dfrac{5}{4/5} = 2R \\implies 2R = \\dfrac{25}{4} \\implies R = \\dfrac{25}{8}$\\n따라서 구하고자 하는 값 $32R$은 다음과 같다.\\n$32R = 32 \\times \\dfrac{25}{8} = 100$\\n따라서 정답은 ④이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q13.png"
  },
  {
    id: 14,
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
    "도형"
  ],
    wide: false,
    content: "아래 그림과 같이 가로와 세로의 길이가 각각 $n, \\sqrt{3}n$인 직사각형의 두 대각선을 그어 생긴 삼각형을 $A_n$이라 하자. 이 삼각형 $A_n$에 외접하는 원의 넓이를 $a_n$이라 할 때, $\\sum_{k=1}^{10}a_k = \\dfrac{p}{3}\\pi$이다. 상수 $p$의 값은?",
    choices: [
    "155",
    "165",
    "385",
    "1155",
    "3025"
  ],
    answer: "③",
    solution: "[키포인트] 각 그림에서 생기는 삼각형 $A_n$이 한 변의 길이가 $n$인 정삼각형임을 이용한다.\n조건 정리: 직사각형의 가로는 $n$, 세로는 $\\sqrt{3}n$이고, 두 대각선으로 생긴 삼각형 $A_n$의 외접원의 넓이를 $a_n$이라 한다.\n풀이 방향: 삼각형 $A_n$의 외접원 반지름을 구하여 $a_n$을 $n$에 대한 식으로 나타낸 뒤 $\\sum_{k=1}^{10}a_k$를 계산한다.\n정석 풀이: 직사각형의 대각선의 길이는 $\\sqrt{n^2+(\\sqrt{3}n)^2}=2n$이다. 두 대각선의 교점에서 각 꼭짓점까지의 거리는 $n$이므로, 그림의 삼각형 $A_n$은 세 변의 길이가 모두 $n$인 정삼각형이다. 정삼각형의 한 내각은 $60^{\\circ}$이므로 사인법칙에서 $\\dfrac{n}{\\sin60^{\\circ}}=2R_n$이다. 따라서 $R_n=\\dfrac{n}{\\sqrt{3}}$이고 $a_n=\\pi R_n^2=\\dfrac{n^2}{3}\\pi$이다. 그러므로 $\\sum_{k=1}^{10}a_k=\\dfrac{\\pi}{3}\\sum_{k=1}^{10}k^2=\\dfrac{\\pi}{3}\\cdot\\dfrac{10\\cdot11\\cdot21}{6}=\\dfrac{385}{3}\\pi$이다. 따라서 $p=385$이다.\n따라서 정답은 ③이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q14.png"
  },
  {
    id: 15,
    level: "상",
    category: "수열의 합",
    originalCategory: "수열의 합",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-10",
    standardUnit: "수열의 합",
    standardUnitOrder: 10,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "모든 항이 양수인 등차수열 $\\{a_n\\}$이 $\\sqrt{3a_1}=\\sqrt{a_9}$, $\\sum_{k=1}^{12}\\dfrac{1}{\\sqrt{a_{k+1}}+\\sqrt{a_k}}=\\dfrac{2}{5}$를 만족시킬 때, $a_1$의 값은?",
    choices: [
    "50",
    "100",
    "150",
    "200",
    "250"
  ],
    answer: "②",
    solution: "[키포인트] 등차수열의 조건식으로부터 첫째항과 공차의 관계를 파악하고 유리화를 통해 시그마를 계산한다.\\n조건 정리: 모든 항이 양수인 등차수열 $\\{a_n\\}$에 대하여 $\\sqrt{3a_1} = \\sqrt{a_9}$이고, $\\sum_{k=1}^{12} \\dfrac{1}{\\sqrt{a_{k+1}} + \\sqrt{a_k}} = \\dfrac{2}{5}$이다.\\n풀이 방향: 첫 번째 식에서 첫째항과 공차의 관계를 구하고, 두 번째 식의 일반항을 분모의 유리화를 통해 정리한 후 대입한다.\\n정석 풀이: 첫 번째 조건식의 양변을 제곱하면 $3a_1 = a_9$이다. 등차수열의 일반항을 대입하면 다음과 같다.\\n$3a_1 = a_1 + 8d \\implies 2a_1 = 8d \\implies a_1 = 4d$\\n두 번째 시그마 식의 일반항을 분모의 유리화를 통해 정리하면 다음과 같다.\\n$\\dfrac{1}{\\sqrt{a_{k+1}} + \\sqrt{a_k}} = \\dfrac{\\sqrt{a_{k+1}} - \\sqrt{a_k}}{a_{k+1} - a_k} = \\dfrac{\\sqrt{a_{k+1}} - \\sqrt{a_k}}{d}$\\n이를 시그마에 대입하여 전개하면 소거 형태가 된다.\\n$\\dfrac{1}{d} \\sum_{k=1}^{12} (\\sqrt{a_{k+1}} - \\sqrt{a_k}) = \\dfrac{1}{d} (\\sqrt{a_{13}} - \\sqrt{a_1}) = \\dfrac{2}{5}$\\n수열의 일반항을 공차 $d$로 표현하면 $a_1 = 4d$, $a_{13} = a_1 + 12d = 4d + 12d = 16d$이므로 대입하면 다음과 같다.\\n$\\dfrac{1}{d} (\\sqrt{16d} - \\sqrt{4d}) = \\dfrac{1}{d} (4\\sqrt{d} - 2\\sqrt{d}) = \\dfrac{2\\sqrt{d}}{d} = \\dfrac{2}{\\sqrt{d}} = \\dfrac{2}{5}$\\n따라서 $\\sqrt{d} = 5 \\implies d = 25$이다.\\n첫째항 $a_1 = 4d = 4 \\times 25 = 100$이다.\\n따라서 정답은 ②이다."
  },
  {
    id: 16,
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
    content: "반지름의 길이가 $2\\sqrt{7}$인 원에 내접하고 $\\angle A=\\dfrac{\\pi}{3}$인 삼각형 $ABC$가 있다. 점 $A$를 포함하지 않는 호 $BC$ 위의 점 $D$에 대하여 $\\sin(\\angle BCD)=\\dfrac{2\\sqrt{7}}{7}$일 때, $\\overline{BD}-\\overline{CD}$의 값은?",
    choices: [
    "2",
    "4",
    "6",
    "8",
    "10"
  ],
    answer: "③",
    solution: "[키포인트] 같은 원 위의 점으로 이루어진 삼각형에 사인법칙과 코사인법칙을 적용한다.\n조건 정리: 원의 반지름은 $2\\sqrt{7}$이고, $\\angle A=\\dfrac{\\pi}{3}$, $\\sin(\\angle BCD)=\\dfrac{2\\sqrt{7}}{7}$이다.\n풀이 방향: 먼저 $BC$와 $BD$를 사인법칙으로 구하고, 삼각형 $BCD$에서 코사인법칙으로 $CD$를 구한다.\n정석 풀이: 삼각형 $ABC$에서 $BC$는 $\\angle A$의 대변이므로 $\\dfrac{BC}{\\sin(\\pi/3)}=2R=4\\sqrt{7}$이다. 따라서 $BC=4\\sqrt{7}\\cdot\\dfrac{\\sqrt{3}}{2}=2\\sqrt{21}$이다. 삼각형 $BCD$도 같은 원에 내접하므로 사인법칙에 의해 $\\dfrac{BD}{\\sin(\\angle BCD)}=4\\sqrt{7}$이다. 따라서 $BD=4\\sqrt{7}\\cdot\\dfrac{2\\sqrt{7}}{7}=8$이다. 사각형 $ABDC$는 원에 내접하므로 $\\angle BDC=\\pi-\\angle BAC=\\pi-\\dfrac{\\pi}{3}=\\dfrac{2\\pi}{3}$이다. 코사인법칙을 삼각형 $BCD$에 적용하면 $(2\\sqrt{21})^2=8^2+CD^2-2\\cdot8\\cdot CD\\cos\\dfrac{2\\pi}{3}$이다. 즉 $84=64+CD^2+8CD$이므로 $CD^2+8CD-20=0$이고, 길이는 양수이므로 $CD=2$이다. 따라서 $BD-CD=8-2=6$이다.\n따라서 정답은 ③이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q16.png"
  },
  {
    id: 17,
    level: "상",
    category: "수학적 귀납법",
    originalCategory: "수학적 귀납법",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-11",
    standardUnit: "수학적 귀납법",
    standardUnitOrder: 11,
    questionType: "객관식",
    layoutTag: "grid",
    tags: [
    "표"
  ],
    wide: false,
    content: "모든 항이 자연수이고 다음 조건을 만족하는 수열 $\\{a_n\\}$에 대하여, 가능한 모든 $a_1$의 값의 합은?\\n(가) 모든 자연수 $n$에 대하여 <div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td rowspan=\"2\">$a_{n+1}=$</td><td>$\\dfrac{a_n}{4}$</td><td>($a_n$이 4의 배수인 경우)</td></tr><tr><td>$a_n+3$</td><td>($a_n$이 4의 배수가 아닌 경우)</td></tr></tbody></table></div>이다.\\n(나) $n \\ge p$인 모든 자연수 $n$에 대하여 $a_{n+3}=a_n$이 성립하는 자연수 $p$의 최솟값은 3이다.",
    choices: [
    "166",
    "188",
    "210",
    "232",
    "254"
  ],
    answer: "⑤",
    solution: "[키포인트] 점화식의 3주기 순환 구조를 먼저 찾고, 주기가 시작되는 위치 조건으로 $a_1$을 역추적한다.\n조건 정리: $a_n$이 4의 배수이면 다음 항은 $\\dfrac{a_n}{4}$이고, 4의 배수가 아니면 다음 항은 $a_n+3$이다. 또한 $a_{n+3}=a_n$이 모든 $n\\ge p$에서 성립하는 $p$의 최솟값은 3이다.\n풀이 방향: 점화식으로 생기는 최소 주기 3의 순환을 찾은 뒤, 그 순환이 정확히 $a_3$부터 시작하도록 $a_1$을 거꾸로 찾는다.\n정석 풀이: 점화식에 따라 $2\\to5\\to8\\to2$가 되므로 $2,5,8$은 최소 주기 3의 순환을 이룬다. 따라서 $a_3$부터는 이 순환의 한 항이어야 한다.\n$a_3=2$이면 $a_2=8$이고 $a_1$은 $5$ 또는 $32$이다. 이 경우 각각 주기가 $a_1$ 또는 $a_2$부터 시작하므로 $p$의 최솟값이 3이 되지 않는다.\n$a_3=5$이면 $a_2=20$ 또는 $2$이다. $a_2=20$일 때 $a_1=17$ 또는 $80$이고, 이 두 경우는 주기가 정확히 $a_3$부터 시작한다. $a_2=2$일 때는 더 이른 위치에서 주기가 시작되어 제외된다.\n$a_3=8$이면 $a_2=32$ 또는 $5$이다. $a_2=32$일 때 $a_1=29$ 또는 $128$이고, 이 두 경우는 주기가 정확히 $a_3$부터 시작한다. $a_2=5$일 때는 더 이른 위치에서 주기가 시작되어 제외된다.\n따라서 가능한 $a_1$의 값은 $17,80,29,128$이고, 그 합은 $17+80+29+128=254$이다.\n따라서 정답은 ⑤이다."
  },
  {
    id: 18,
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
    content: "그림과 같이 선분 $AB$를 지름으로 하는 반원의 호 $AB$ 위에 두 점 $C, D$가 있다. 선분 $AB$의 중점 $O$에 대하여 두 선분 $AD, CO$가 점 $E$에서 만나고, $\\angle CEA=\\dfrac{3}{4}\\pi$, $\\overline{ED}=3\\sqrt{2}$, $\\overline{CE}=4$이다. $\\overline{AC}^2-\\overline{CD}^2$의 값은?",
    choices: [
    "40",
    "50",
    "60",
    "70",
    "80"
  ],
    answer: "④",
    solution: "[키포인트] 먼저 $CD$와 반지름을 구한 뒤, $E$를 포함한 두 삼각형에서 코사인법칙을 연결한다.\n조건 정리: $CE=4$, $ED=3\\sqrt{2}$, $\\angle CEA=\\dfrac{3\\pi}{4}$이고, $A,E,D$는 한 직선 위에 있으며 $C,E,O$도 한 직선 위에 있다.\n풀이 방향: $\\triangle CED$에서 $CD$를 구하고, $\\triangle OCD$에서 반지름 $OC$를 구한 뒤, $\\triangle AEO$와 $\\triangle AEC$를 이용하여 $AC^2$을 구한다.\n정석 풀이: $A,E,D$가 한 직선 위에 있으므로 $\\angle CED=\\pi-\\dfrac{3\\pi}{4}=\\dfrac{\\pi}{4}$이다. 삼각형 $CED$에서 코사인법칙을 쓰면 $CD^2=4^2+(3\\sqrt{2})^2-2\\cdot4\\cdot3\\sqrt{2}\\cos\\dfrac{\\pi}{4}=16+18-24=10$이다. 따라서 $CD=\\sqrt{10}$이다.\n또한 삼각형 $CED$에서 $ED^2=CE^2+CD^2-2\\cdot CE\\cdot CD\\cos\\angle ECD$이므로 $18=16+10-8\\sqrt{10}\\cos\\angle ECD$이다. 따라서 $\\cos\\angle ECD=\\dfrac{\\sqrt{10}}{10}$이다. 점 $O,E,C$가 한 직선 위에 있으므로 $\\angle OCD=\\angle ECD$이고, $OC=OD$이다. 이등변삼각형 $OCD$에서 $\\cos\\angle OCD=\\dfrac{CD/2}{OC}$이므로 $\\dfrac{\\sqrt{10}}{10}=\\dfrac{\\sqrt{10}/2}{OC}$이다. 따라서 $OC=5$이다.\n$CE=4$이므로 $OE=OC-CE=1$이다. $\\angle AEO=\\pi-\\angle CEA=\\dfrac{\\pi}{4}$이고 $OA=5$이므로, 삼각형 $AEO$에서 $5^2=AE^2+1^2-2\\cdot AE\\cdot1\\cos\\dfrac{\\pi}{4}$이다. 이를 풀면 $AE=4\\sqrt{2}$이다.\n이제 삼각형 $AEC$에서 코사인법칙을 적용하면 $AC^2=AE^2+CE^2-2\\cdot AE\\cdot CE\\cos\\dfrac{3\\pi}{4}=32+16+32=80$이다. 따라서 $AC^2-CD^2=80-10=70$이다.\n따라서 정답은 ④이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q18.png",
    imageSize: "half"
  },
  {
    id: 19,
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
    content: "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라고 하자. $S_n = n^2 + 2n + 3$일 때, $a_1 + a_3 + a_5$의 값을 풀이과정과 함께 상세하게 서술하시오.",
    choices: [],
    answer: "24",
    solution: "[키포인트] 수열의 합과 일반항 사이의 관계 $a_n = S_n - S_{n-1}$을 이용하여 일반항을 구한다.\\n조건 정리: 첫째항부터 제$n$항까지의 합 $S_n = n^2 + 2n + 3$이다.\\n풀이 방향: $n=1$일 때와 $n \\ge 2$일 때를 나누어 일반항 $a_n$을 구한 후 각각의 항의 값을 더한다.\\n정석 풀이:\\n$n=1$일 때, $a_1 = S_1 = 1^2 + 2 \\times 1 + 3 = 6$이다.\\n$n \\ge 2$일 때, 일반항 $a_n$은 다음과 같다.\\n$a_n = S_n - S_{n-1} = (n^2 + 2n + 3) - ((n-1)^2 + 2(n-1) + 3)$\\n$a_n = (n^2 + 2n + 3) - (n^2 - 2n + 1 + 2n - 2 + 3) = 2n + 1$\\n따라서 구한 수열의 항의 값은 다음과 같다.\\n$a_1 = 6$\\n$a_3 = 2 \\times 3 + 1 = 7$\\n$a_5 = 2 \\times 5 + 1 = 11$\\n따라서 $a_1 + a_3 + a_5 = 6 + 7 + 11 = 24$이다.\\n따라서 구하는 값은 24이다."
  },
  {
    id: 20,
    level: "상",
    category: "삼각방정식과 삼각부등식",
    originalCategory: "삼각방정식과 삼각부등식",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-07",
    standardUnit: "삼각방정식과 삼각부등식",
    standardUnitOrder: 7,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형"
  ],
    wide: false,
    content: "집합 $A = \\{x \\mid 2\\cos^2\\dfrac{\\pi x}{2} > 1 - \\cos\\dfrac{\\pi x}{2}\\}$에 대하여 실수 전체의 집합에서 정의된 함수 $f(x) = \\begin{cases} 2 & (x \\in A) \\\\ 0 & (x \\notin A) \\end{cases}$가 있다. $\\sum_{k=1}^{n} k f(k) = 440$을 만족시키는 자연수 $n$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값을 풀이과정과 함께 상세하게 서술하시오.",
    choices: [],
    answer: "83",
    solution: "[키포인트] 삼각부등식을 풀어 $f(k)=2$가 되는 자연수 $k$의 주기를 찾는다.\n조건 정리: $A=\\{x\\mid 2\\cos^2\\dfrac{\\pi x}{2}>1-\\cos\\dfrac{\\pi x}{2}\\}$이고, $f(x)=2$는 $x\\in A$일 때, $f(x)=0$은 $x\\notin A$일 때이다.\n풀이 방향: $t=\\cos\\dfrac{\\pi x}{2}$로 치환하여 부등식을 풀고, 자연수 $k$에서 $f(k)$가 2가 되는 항만 합한다.\n정석 풀이: 부등식은 $2\\cos^2\\dfrac{\\pi x}{2}+\\cos\\dfrac{\\pi x}{2}-1>0$이다. $t=\\cos\\dfrac{\\pi x}{2}$라 하면 $(2t-1)(t+1)>0$이고, $-1\\le t\\le1$이므로 $t>\\dfrac{1}{2}$이다. 즉 $\\cos\\dfrac{\\pi x}{2}>\\dfrac{1}{2}$이다. 자연수 $k$에 대해 값을 대입하면 $k$가 4의 배수일 때만 $\\cos\\dfrac{\\pi k}{2}=1$이 되어 조건을 만족하므로 $f(k)=2$이다.\n따라서 $\\sum_{k=1}^{n}kf(k)=2(4+8+12+\\cdots+4r)=8(1+2+\\cdots+r)$가 된다. 이 값이 440이므로 $8\\cdot\\dfrac{r(r+1)}{2}=440$이고 $r(r+1)=110$이다. 따라서 $r=10$이다. 마지막으로 더해진 4의 배수는 $4\\cdot10=40$이다. 그러므로 $n$의 최솟값은 40이고, 다음 4의 배수인 44가 포함되기 전까지 값이 유지되므로 최댓값은 43이다. 따라서 $M+m=43+40=83$이다.\n따라서 구하는 값은 83이다."
  },
  {
    id: 21,
    level: "상",
    category: "등비수열",
    originalCategory: "등비수열",
    standardCourse: "수학I",
    standardUnitKey: "H15-M1-09",
    standardUnit: "등비수열",
    standardUnitOrder: 9,
    questionType: "서술형",
    layoutTag: "grid",
    tags: [
    "서술형",
    "도형"
  ],
    wide: false,
    content: "아래 그림과 같이 $\\angle ABC=90^{\\circ}$인 직각삼각형 $ABC$에 대하여, 세 정사각형 $ABED, BCGF, ACHI$는 서로 겹치지 않는다. 선분 $AC$의 길이가 1이고 세 선분 $EF, DI, GH$의 길이가 순서대로 등비수열을 이룬다. 세 삼각형 $BEF, ADI, CGH$의 넓이를 각각 $S_1, S_2, S_3$이라 할 때, $(S_1+S_2+S_3)^2=p+q\\sqrt{21}$이다. $p^2+32q^2$의 값을 풀이과정과 함께 상세하게 서술하시오. (단, 모든 점은 같은 평면 위에 있고, $p,q$는 유리수이다.)",
    choices: [],
    answer: "27",
    solution: "[키포인트] 직각삼각형의 두 변을 문자로 두고, 등비중항 조건을 길이식으로 바꾸어 푼다.\n조건 정리: $\\angle ABC=90^{\\circ}$이고 $AC=1$이다. 세 선분 $EF,DI,GH$의 길이가 순서대로 등비수열을 이룬다.\n풀이 방향: $BC=a$, $AB=b$로 두어 $a^2+b^2=1$을 세우고, $EF,DI,GH$의 길이를 $a,b$로 표현한 뒤 등비중항 조건을 이용한다.\n정석 풀이: $BC=a$, $AB=b$라 하면 피타고라스 정리에 의해 $a^2+b^2=1$이다. 그림의 세 정사각형과 직각삼각형의 배치를 이용하면 $EF=\\sqrt{a^2+b^2}=1$, $DI=\\sqrt{a^2+4b^2}$, $GH=\\sqrt{4a^2+b^2}$이다. 세 길이 $EF,DI,GH$가 이 순서대로 등비수열이므로 $DI^2=EF\\cdot GH$이다. 따라서 $a^2+4b^2=\\sqrt{4a^2+b^2}$이다.\n$b^2=1-a^2$을 대입하면 $a^2+4(1-a^2)=\\sqrt{4a^2+1-a^2}$, 즉 $4-3a^2=\\sqrt{3a^2+1}$이다. 양변을 제곱하면 $(4-3a^2)^2=3a^2+1$이므로 $9a^4-27a^2+15=0$, 즉 $3a^4-9a^2+5=0$이다. $0<a^2<1$이므로 $a^2=\\dfrac{9-\\sqrt{21}}{6}$이고 $b^2=1-a^2=\\dfrac{\\sqrt{21}-3}{6}$이다.\n세 삼각형 $BEF,ADI,CGH$의 넓이는 각각 $\\dfrac{ab}{2}$이므로 $S_1+S_2+S_3=\\dfrac{3ab}{2}$이다. 따라서 $(S_1+S_2+S_3)^2=\\dfrac{9a^2b^2}{4}$이다. 여기서 $a^2b^2=\\dfrac{9-\\sqrt{21}}{6}\\cdot\\dfrac{\\sqrt{21}-3}{6}=\\dfrac{\\sqrt{21}-4}{3}$이므로 $(S_1+S_2+S_3)^2=\\dfrac{9}{4}\\cdot\\dfrac{\\sqrt{21}-4}{3}=-3+\\dfrac{3}{4}\\sqrt{21}$이다. 따라서 $p=-3$, $q=\\dfrac{3}{4}$이다.\n그러므로 $p^2+32q^2=(-3)^2+32\\left(\\dfrac{3}{4}\\right)^2=9+18=27$이다.\n따라서 구하는 값은 27이다.",
    image: "assets/images/25_금당고_1학기_기말_고2_수학I/q21.png",
    imageSize: "large"
  }
];
