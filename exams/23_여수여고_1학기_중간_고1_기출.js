window.examTitle = "23_여수여고_1학기_중간_고1_기출";

window.questionBank = [
  {
    "id": "1",
    "level": "하",
    "content": "두 다항식 $A=x^3-2x^2+3x-4$, $B=2x^3-x^2-4x+5$에 대하여 다항식 $A-B$를 간단히 한 것은? [3.8점]",
    "choices": [
      "$-x^3-3x^2-x-9$",
      "$-x^3-x^2+7x-9$",
      "$-x^3-x^2-x+1$",
      "$3x^3-3x^2-x-9$",
      "$3x^3-3x^2+7x+1$"
    ],
    "answer": "②",
    "category": "다항식의 연산",
    "originalCategory": "다항식의 연산",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<b>[Logical Anchor]</b> 다항식의 뺄셈 시 괄호를 사용하여 부호 실수를 원천 차단함.\\n$A - B = (x^3 - 2x^2 + 3x - 4) - (2x^3 - x^2 - 4x + 5)$\\n괄호를 전개하여 모든 항의 부호를 결정함.\\n$\\implies x^3 - 2x^2 + 3x - 4 - 2x^3 + x^2 + 4x - 5$\\n차수가 같은 동류항끼리 재배열하여 정리함.\\n$i)  x^3 항:  x^3 - 2x^3 = -x^3$\\n$ii)  x^2 항:  -2x^2 + x^2 = -x^2$\\n$iii)  x 항:  3x + 4x = 7x$\\n$iv) 상수항:  -4 - 5 = -9$\\n$\\therefore -x^3 - x^2 + 7x - 9$"
  },
  {
    "id": "2",
    "level": "하",
    "content": "모든 실수 $x$에 대하여 등식 $2x^2-3x+4=a(x-1)(x-2)+b(x-1)+c$가 성립할 때, $a+b+c$의 값은? [3.8점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "④",
    "category": "항등식",
    "originalCategory": "항등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> $x$에 어떤 값을 대입해도 성립하는 항등식의 성질을 이용하여 미정계수를 도출함.\\n$i)  x=1  대입 (b, a 소거)$\\n$2(1)^2 - 3(1) + 4 = c \\implies 2 - 3 + 4 = c \\implies c = 3$\\n$ii)  x=2  대입 (a 소거)$\\n$2(2)^2 - 3(2) + 4 = b(2-1) + c$\\n$8 - 6 + 4 = b + 3 \\implies 6 = b + 3 \\implies b = 3$\\n$iii) 최고차항 계수 비교$\\n좌변의 $x^2$ 계수는 $2$, 우변의 $x^2$ 계수는 $a$임.\\n$\\therefore a = 2$\\n최종 합 구하기: $a+b+c = 2 + 3 + 3 = 8$\\n$\\therefore 8$"
  },
  {
    "id": "3",
    "level": "하",
    "content": "$(2-i)^2 - \\frac{10}{3+i} = a+bi$ 일 때, $a+b$의 값은? [3.9점]",
    "choices": [
      "-3",
      "-1",
      "0",
      "1",
      "3"
    ],
    "answer": "①",
    "category": "복소수의 연산",
    "originalCategory": "복소수의 연산",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "<b>[Logical Anchor]</b> 곱셈 공식과 분모의 실수화를 단계별로 적용함.\\n$i) 앞부분 전개:  (2-i)^2$\\n$\\implies 2^2 - 2(2)(i) + i^2 = 4 - 4i - 1 = 3 - 4i$\\n$ii) 뒷부분 실수화:  \\frac{10}{3+i}$\\n$\\frac{10(3-i)}{(3+i)(3-i)} = \\frac{10(3-i)}{9 - i^2} = \\frac{10(3-i)}{10} = 3 - i$\\n$iii) 식의 결합$\\n$(3 - 4i) - (3 - i) = 3 - 4i - 3 + i = -3i$\\n$\\because a = 0, b = -3$ 이므로\\n$\\therefore a + b = -3$"
  },
  {
    "id": "4",
    "level": "하",
    "content": "이차방정식 $x^2-4x+2=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\frac{\\beta}{\\alpha} + \\frac{\\alpha}{\\beta}$의 값은? [4.0점]",
    "choices": [
      "-6",
      "-3",
      "2",
      "3",
      "6"
    ],
    "answer": "⑤",
    "category": "근과 계수의 관계",
    "originalCategory": "근과 계수의 관계",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "<b>[Logical Anchor]</b> 통분 후 곱셈 공식의 변형을 통해 합과 곱의 형태로 변환함.\\n근과 계수의 관계에 의하여: $\\alpha+\\beta=4, \\alpha\\beta=2$\\n$i) 식의 통분$\\n$\\frac{\\beta}{\\alpha} + \\frac{\\alpha}{\\beta} = \\frac{\\alpha^2 + \\beta^2}{\\alpha\\beta}$\\n$ii) 분자의 변형$\\n$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 4^2 - 2(2) = 12$\\n$iii) 최종 값 대입$\\n$\\frac{12}{2} = 6$\\n$\\therefore 6$"
  },
  {
    "id": "5",
    "level": "하",
    "content": "다항식 $P(x)$를 $x^2-x-2$로 나누었을 때의 나머지가 $2x-3$이다. $P(x)$를 $x-2$로 나누었을 때의 나머지는? [4.1점]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "④",
    "category": "나머지정리",
    "originalCategory": "나머지정리",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> 검산식을 세워 인수를 파악한 뒤 나머지 정리를 적용함.\\n$P(x) = (x^2 - x - 2)Q(x) + 2x - 3$\\n나누는 식을 인수분해함.\\n$\\implies P(x) = (x-2)(x+1)Q(x) + 2x - 3$\\n$P(x)$를 $x-2$로 나눈 나머지는 나머지 정리에 의해 $P(2)$의 값과 같음.\\n$P(2) = (2-2)(2+1)Q(2) + 2(2) - 3$\\n$\\implies 0 + 4 - 3 = 1$\\n$\\therefore 1$"
  },
  {
    "id": "6",
    "level": "하",
    "content": "다항식 $x^3+ax^2+bx+c$를 $x^2+1$로 나누었을 때의 몫이 $x+1$이고 나머지가 2이다. $a+b+c$의 값은? [4.2점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "category": "다항식의 나눗셈",
    "originalCategory": "다항식의 나눗셈",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<b>[Logical Anchor]</b> 나눗셈의 검산식은 항상 항등식임을 이용하여 계수를 비교함.\\n$x^3 + ax^2 + bx + c = (x^2 + 1)(x + 1) + 2$\\n우변을 분배법칙으로 전개함.\\n$\\implies x^2(x + 1) + 1(x + 1) + 2$\\n$\\implies x^3 + x^2 + x + 1 + 2$\\n$\\implies x^3 + x^2 + x + 3$\\n좌변의 각 항과 비교함.\\n$a = 1, \\ b = 1, \\ c = 3$\\n$\\therefore a + b + c = 1 + 1 + 3 = 5$"
  },
  {
    "id": "7",
    "level": "중",
    "content": "$0$이 아닌 복소수 $z=a+bi$ 와 그 켤레복소수 $\\bar{z}$에 대하여 <보기>에서 옳은 것만을 고른 것은? [4.3점]\\nㄱ. $z\\bar{z}=0$이면 $z=0$이다.\\nㄴ. $z=\\bar{z}$이면 $z$는 실수이다.\\nㄷ. $z^2 < 0$이면 $z$는 순허수이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "category": "복소수의 성질",
    "originalCategory": "복소수의 성질",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "<b>[Logical Anchor]</b> 복소수 판별은 $z=a+bi$ (a, b는 실수) 대입을 통해 수식으로 증명함.\\nㄱ. $z\\bar{z} = (a+bi)(a-bi) = a^2 + b^2 = 0$\\n$\\because a, b$가 실수이므로 $a=0, b=0$ 임. $\\therefore z=0$ (참)\\nㄴ. $a+bi = a-bi \\implies 2bi = 0 \\implies b=0$\\n허수부분이 $0$이므로 $z$는 실수임. (참)\\nㄷ. $z^2 = (a+bi)^2 = a^2 - b^2 + 2abi < 0$\\n음의 실수가 되려면 허수부분 $2ab=0$ 이고 실수부분 $a^2-b^2 < 0$ 이어야 함.\\n$a, b$ 중 하나가 $0$이어야 하는데 $a^2-b^2 < 0$ 을 만족하려면 $a=0$ 이어야 함.\\n$\\because a=0, b \\ne 0$ 이므로 $z=bi$ 인 순허수임. (참)\\n$\\therefore$ ㄱ, ㄴ, ㄷ"
  },
  {
    "id": "8",
    "level": "상",
    "content": "이차방정식 $x^2-2(k-a)x+k^2-4k+b=0$이 실수 $k$의 값에 관계없이 항상 중근을 가질 때, $a+b$의 값은? [4.4점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "③",
    "category": "이차방정식과 항등식",
    "originalCategory": "이차방정식과 항등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "<b>[Logical Anchor]</b> 중근 조건($D=0$)을 먼저 적용한 후, $k$에 대한 항등식 성질을 적용함.\\n<b>i) 중근 조건 (판별식)</b>\\n$\\ tf{D}{4} = (k-a)^2 - (k^2 - 4k + b) = 0$\\n$k^2 - 2ak + a^2 - k^2 + 4k - b = 0$\\n$k^2$을 소거하고 $k$에 대해 정리함.\\n<b>ii) $k$에 대한 항등식 정리</b>\\n$(4 - 2a)k + (a^2 - b) = 0$\\n$k$의 값에 관계없이 항상 성립하므로 각 계수가 $0$이어야 함.\\n$4 - 2a = 0 \\implies a = 2$\\n$a^2 - b = 0 \\implies 2^2 - b = 0 \\implies b = 4$\\n$\\therefore a + b = 2 + 4 = 6$"
  },
  {
    "id": "9",
    "level": "상",
    "content": "다항식 $P(x)$를 $2x-1$로 나누었을 때의 몫이 $Q(x)$, 나머지가 $R$이다. 다항식 $xP(x)$를 $x-\\frac{1}{2}$로 나누었을 때의 몫과 나머지는? [4.5점]",
    "choices": [
      "$2xQ(x)+R, \\ tf{1}{2}R$",
      "$xQ(x)+R, \\ tf{1}{2}R$",
      "$xQ(x)+\\ tf{1}{2}R, R$",
      "$2xQ(x)+\\ tf{1}{2}R, \\ tf{1}{2}R$",
      "$2xQ(x)+R, R$"
    ],
    "answer": "①",
    "category": "다항식의 나눗셈 변형",
    "originalCategory": "다항식의 나눗셈 변형",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<b>[Logical Anchor]</b> 나머지의 차수 조정을 위해 1차식을 다시 1차식으로 나누는 과정이 필수임.\\n$P(x) = (2x-1)Q(x) + R$\\n$xP(x) = x(2x-1)Q(x) + Rx$\\n$= 2x(x-\\frac{1}{2})Q(x) + Rx$\\n여기서 $Rx = R(x-\\frac{1}{2}) + \\frac{1}{2}R$ 이므로 대입함.\\n$= 2x(x-\\frac{1}{2})Q(x) + R(x-\\frac{1}{2}) + \\frac{1}{2}R$\\n$= (x-\\frac{1}{2})\\{2xQ(x) + R\\} + \\frac{1}{2}R$\\n$\\therefore$ 몫: $2xQ(x)+R$, 나머지: $\\frac{1}{2}R$"
  },
  {
    "id": "10",
    "level": "중",
    "content": "$-1 \\le x \\le 2$에서 이차함수 $y=-x^2+2x+k$의 최댓값이 5일 때, 이 함수의 최솟값은? [4.5점]",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "②",
    "category": "이차함수 최대최소",
    "originalCategory": "이차함수 최대최소",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "<b>[Logical Anchor]</b> 축의 위치를 파악하여 최댓값과 최솟값이 발생하는 지점을 결정함.\\n$y = -(x^2 - 2x) + k = -(x-1)^2 + k + 1$\\n축은 $x=1$이며 범위 $[-1, 2]$ 내에 포함됨.\\n<b>i) 최댓값 활용</b>\\n위로 볼록한 그래프이므로 꼭짓점에서 최대임.\\n$k + 1 = 5 \\implies k = 4$\\n완전한 식: $y = -(x-1)^2 + 5$\\n<b>ii) 최솟값 도출</b>\\n축 $x=1$에서 가장 먼 경계값 $x=-1$을 대입함.\\n$m = f(-1) = -(-1-1)^2 + 5 = -4 + 5 = 1$\\n$\\therefore 1$"
  },
  {
    "id": "11",
    "level": "중",
    "content": "복소수 $z=\\frac{1+i}{\\sqrt{2}}$에 대하여 $z^n=1$이 되도록 하는 자연수 $n$의 최솟값은? [4.6점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "④",
    "category": "복소수의 주기성",
    "originalCategory": "복소수의 주기성",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "<b>[Logical Anchor]</b> 거듭제곱을 통해 값이 순환하는 규칙성을 찾음.\\n$z^2 = (\\frac{1+i}{\\sqrt{2}})^2 = \\frac{1+2i-1}{2} = i$\\n$z^4 = (z^2)^2 = i^2 = -1$\\n$z^8 = (z^4)^2 = (-1)^2 = 1$\\n$\\because z^n = 1$ 을 만족하는 최초의 자연수 $n$ 은 $8$임.\\n$\\therefore 8$"
  },
  {
    "id": "12",
    "level": "중",
    "content": "이차방정식 $x^2-x-1=0$의 두 근을 $\\alpha, \\beta$라 하자. $f(\\alpha)=1, f(\\beta)=1, f(0)=3$을 만족시키는 이차식 $f(x)$에 대하여 $f(2)$의 값은? [4.6점]",
    "choices": [
      "-4",
      "-3",
      "-2",
      "-1",
      "0"
    ],
    "answer": "④",
    "category": "이차방정식의 작성",
    "originalCategory": "이차방정식의 작성",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "<b>[Logical Anchor]</b> $f(x)-1=0$ 의 두 근이 $\\alpha, \\beta$ 임을 이용하여 식을 세움.\\n$f(\\alpha)-1=0, \\ f(\\beta)-1=0$\\n$\\implies f(x)-1 = a(x-\\alpha)(x-\\beta) = a(x^2 - x - 1)$\\n$f(x) = a(x^2 - x - 1) + 1$\\n$f(0) = a(-1) + 1 = 3 \\implies -a = 2 \\implies a = -2$\\n완성된 식: $f(x) = -2(x^2 - x - 1) + 1 = -2x^2 + 2x + 3$\\n$f(2) = -2(4) + 2(2) + 3 = -8 + 4 + 3 = -1$\\n$\\therefore -1$"
  },
  {
    "id": "13",
    "level": "중",
    "content": "다항식 $P(x)$를 $x^2-1$로 나누었을 때의 나머지가 $2x+3$이고, $x^2-4$로 나누었을 때의 나머지가 $x-1$이다. $P(x)$를 $x^2-3x+2$로 나누었을 때의 나머지 $R(3)$의 값은? [4.7점]",
    "choices": [
      "-4",
      "-3",
      "-2",
      "1",
      "2"
    ],
    "answer": "②",
    "category": "나머지정리",
    "originalCategory": "나머지정리",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> 필요한 함숫값을 각각 추출하여 연립방정식으로 나머지를 구함.\\n<b>i) 함숫값 추출</b>\\n$P(x) = (x-1)(x+1)Q_1(x) + 2x+3 \\implies P(1) = 5$\\n$P(x) = (x-2)(x+2)Q_2(x) + x-1 \\implies P(2) = 1$\\n<b>ii) 검산식 및 나머지 설정</b>\\n$P(x) = (x-1)(x-2)Q_3(x) + ax+b$\\n$P(1) = a + b = 5$\\n$P(2) = 2a + b = 1$\\n<b>iii) 연립방정식 풀이</b>\\n$a = -4, \\ b = 9 \\implies R(x) = -4x + 9$\\n$R(3) = -4(3) + 9 = -3$\\n$\\therefore -3$"
  },
  {
    "id": "14",
    "level": "중",
    "content": "최고차항의 계수가 1인 삼차다항식 $f(x)$가 $f(1)=1, f(2)=2, f(3)=3$을 만족시킬 때, $f(4)$의 값은? [4.8점]",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "category": "나머지정리 응용",
    "originalCategory": "나머지정리 응용",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> 규칙성 $f(x)=x$를 파악하여 새로운 다항식 $g(x)=f(x)-x$를 정의함.\\n$f(1)-1=0, \\ f(2)-2=0, \\ f(3)-3=0$\\n$g(x) = f(x) - x$ 라 하면 $g(1)=g(2)=g(3)=0$ 임.\\n$g(x)$는 최고차항 계수가 $1$인 3차식이므로\\n$g(x) = (x-1)(x-2)(x-3)$\\n$f(x) = (x-1)(x-2)(x-3) + x$\\n$f(4) = (3)(2)(1) + 4 = 10$\\n$\\therefore 10$"
  },
  {
    "id": "15",
    "level": "중",
    "content": "이차함수 $y=x^2-ax+b$와 직선 $y=2x-1$이 만나는 두 점의 $x$좌표의 합이 4, 곱이 2일 때, $a+b$의 값은? [4.9점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "②",
    "category": "이차함수와 직선",
    "originalCategory": "이차함수와 직선",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "<b>[Logical Anchor]</b> 두 식을 연립하여 만든 방정식의 실근이 교점의 $x$좌표와 같음.\\n$x^2 - ax + b = 2x - 1$\\n$x^2 - (a + 2)x + (b + 1) = 0$\\n근과 계수의 관계에 의하여:\\n$합:  a + 2 = 4 \\implies a = 2$\\n$곱:  b + 1 = 2 \\implies b = 1$\\n$\\therefore a + b = 3$"
  },
  {
    "id": "16",
    "level": "중",
    "content": "모든 실수 $x$에 대하여 $x^4-3x^3+x^2-2x+5 = (x-2)^4+a(x-2)^3+b(x-2)^2+c(x-2)+d$ 가 성립할 때, $a+b+c+d$의 값은? [5.0점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "category": "항등식 수치대입",
    "originalCategory": "항등식 수치대입",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> 연속 조립제법 대신 수치대입법을 사용하여 계산 시간을 단축함.\\n우변의 형태에서 $a, b, c, d$ 계수만 남기기 위해 $x-2=1$ 인 $x=3$ 을 대입함.\\n$i) 좌변:  3^4 - 3(3^3) + 3^2 - 2(3) + 5 = 81 - 81 + 9 - 6 + 5 = 8$\\n$ii) 우변:  (3-2)^4 + a(3-2)^3 + b(3-2)^2 + c(3-2) + d = 1 + a + b + c + d$\\n$8 = 1 + a + b + c + d$\\n$\\therefore a + b + c + d = 7$"
  },
  {
    "id": "17",
    "level": "하",
    "content": "부피가 $x^3+5x^2+8x+4$이고 높이가 $x+1$인 직육면체 밑면의 한 변의 길이는? (단, 밑면은 정사각형) [5.1점]",
    "choices": [
      "$x-2$",
      "$x-1$",
      "$x+1$",
      "$x+2$",
      "$x+3$"
    ],
    "answer": "④",
    "category": "다항식의 나눗셈 활용",
    "originalCategory": "다항식의 나눗셈 활용",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<b>[Logical Anchor]</b> 부피를 높이로 나누어 밑넓이를 구한 뒤 인수를 확인함.\\n$x^3 + 5x^2 + 8x + 4$ 를 $x + 1$ 로 나눔.\\n$x=-1$ 로 조립제법 시행:\\n$1 \\quad 5 \\quad 8 \\quad 4 \\quad | \\quad -1$\\n$\\implies 1 \\quad 4 \\quad 4, \\ R=0$\\n밑넓이 $= x^2 + 4x + 4 = (x + 2)^2$\\n$\\because$ 밑면이 정사각형이므로 한 변의 길이는 $x+2$ 임.\\n$\\therefore x + 2$"
  },
  {
    "id": "18",
    "level": "중",
    "content": "이차방정식 $x^2-ax+b=0$의 한 근이 $1+2i$일 때, $x^2-bx+a=0$의 두 근의 합은? (단, $a, b$는 실수) [5.2점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "category": "켤레근의 성질",
    "originalCategory": "켤레근의 성질",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "<b>[Logical Anchor]</b> 실계수 이차방정식에서 한 허근이 존재하면 그 켤레복소수도 반드시 근임.\\n다른 한 근은 $1-2i$ 이다.\\n$i) 원래 식 계수 도출$\\n합: $(1+2i) + (1-2i) = a \\implies a = 2$\\n곱: $(1+2i)(1-2i) = b \\implies b = 1 - 4i^2 = 5$\\n<b>ii) 새로운 방정식 적용</b>\\n$x^2 - 5x + 2 = 0$ 의 두 근의 합을 구함.\\n$\\therefore 5$"
  },
  {
    "id": "19",
    "level": "상",
    "content": "[서술형 1] $f(x)$를 $x^2+1$로 나누면 나머지가 $x+1$, $x-1$로 나누면 나머지가 4이다. $(x^2+1)(x-1)$로 나누었을 때의 나머지 $R(x)$를 구하시오. [6.0점]",
    "choices": [
      " "
    ],
    "answer": "$x^2+x+2$",
    "category": "나머지정리 킬러",
    "originalCategory": "나머지정리 킬러",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<b>[Logical Anchor]</b> 3차 나머지 $R(x)$를 2차 나눗셈의 결과로 치환하여 미지수를 줄임.\\n$f(x) = (x^2+1)(x-1)Q(x) + a(x^2+1) + x+1$\\n$f(1) = 2a + 2 = 4 \\implies a = 1$\\n$R(x) = 1(x^2+1) + x + 1 = x^2 + x + 2$\\n$\\therefore x^2+x+2$"
  },
  {
    "id": "20",
    "level": "상",
    "content": "[서술형 2] $y=x^2-4x+k$의 그래프가 $x$축과 만나는 두 점 사이의 거리가 $2\\sqrt{3}$일 때, $k$의 값을 구하시오. [6.0점]",
    "choices": [
      " "
    ],
    "answer": "①",
    "category": "이차방정식 두 근의 차",
    "originalCategory": "이차방정식 두 근의 차",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "<b>[Logical Anchor]</b> 교점 사이의 거리는 두 실근의 차 $|\\alpha - \\beta|$ 와 같음.\\n$\\alpha + \\beta = 4, \\ \\alpha\\beta = k$\\n$(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta = (2\\sqrt{3})^2$\\n$16 - 4k = 12$\\n$4k = 4 \\implies k = 1$\\n$\\therefore 1$"
  },
  {
    "id": "21",
    "level": "상",
    "content": "[서술형 3] 복소수 $z=a+bi (a, b \\ne 0)$가 $z^2+\\bar{z}^2=0$을 만족시킬 때, $\\frac{z}{\\bar{z}} + \\frac{\\bar{z}}{z}$의 값을 구하시오. [7.0점]",
    "choices": [
      " "
    ],
    "answer": "0",
    "category": "복소수의 성질",
    "originalCategory": "복소수의 성질",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "<b>[Logical Anchor]</b> 통분을 통해 주어진 조건식의 형태를 유도함.\\n구하고자 하는 식: $\\frac{z^2 + \\bar{z}^2}{z\\bar{z}}$\\n조건에서 $z^2 + \\bar{z}^2 = 0$ 이라 하였으므로\\n$\\frac{0}{z\\bar{z}} = 0$\\n$\\therefore 0$"
  },
  {
    "id": "22",
    "level": "상",
    "content": "[서술형 4] 둘레가 24인 직사각형 넓이가 최대일 때의 넓이와 가로, 세로 길이를 구하시오. [7.0점]",
    "choices": [
      " "
    ],
    "answer": "36, 6, 6",
    "category": "이차함수 활용",
    "originalCategory": "이차함수 활용",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "<b>[Logical Anchor]</b> 가로+세로=12 임을 이용하여 이차함수의 최대를 찾음.\\n가로 $x$, 세로 $12-x$ ($0 < x < 12$)\\n$S = x(12-x) = -x^2 + 12x = -(x-6)^2 + 36$\\n축 $x=6$ 일 때 최대 $36$ 임.\\n$\\therefore$ 넓이: $36$, 가로: $6$, 세로: $6$"
  }
];
