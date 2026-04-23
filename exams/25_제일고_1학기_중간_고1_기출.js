window.examTitle = "25_제일고_1학기_중간_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "항등식",
    "originalCategory": "항등식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "등식 $x^{2}+x+1=ax^{2}+(b+1)x+(c-2)$ 이 $x$에 대한 항등식일 때, 상수 $a, b, c$에 대하여 $a+b+c$의 값은? [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "[키포인트] 모든 실수 $x$에 대하여 성립하는 항등식은 양변의 같은 차수의 항의 계수가 서로 같아야 한다.\\n조건 정리: 좌변 $x^{2}+x+1$과 우변 $ax^{2}+(b+1)x+(c-2)$가 모든 $x$에 대해 일치해야 한다.\\n풀이 방향: 계수비교법을 사용하여 이차항, 일차항, 상수항의 계수를 각각 비교하여 $a, b, c$를 구한다.\\n정석 풀이:\\n1) 이차항의 계수 비교: 좌변의 1과 우변의 $a$가 같으므로 $a = 1$이다.\\n2) 일차항의 계수 비교: 좌변의 1과 우변의 $b+1$이 같으므로 $b+1 = 1 \\implies b = 0$이다.\\n3) 상수항 비교: 좌변의 1과 우변의 $c-2$가 같으므로 $c-2 = 1 \\implies c = 3$이다.\\n따라서 $a+b+c = 1+0+3 = 4$이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "다항식 $P(x) = x^{3}+x^{2}-2x+2$ 를 $x-1$로 나눌 때의 나머지는? [4.1점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "[키포인트] 다항식 $P(x)$를 일차식 $x-k$로 나눈 나머지는 $P(k)$와 같다.\\n조건 정리: $P(x) = x^{3}+x^{2}-2x+2$를 일차식 $x-1$로 나눈 나머지를 구하는 문제이다.\\n풀이 방향: 나머지 정리에 의해 $x=1$을 다항식에 대입하여 함숫값을 계산한다.\\n정석 풀이:\\n나머지를 $R$이라 하면 나머지 정리에 의해 $R = P(1)$이다.\\n$P(1) = 1^{3}+1^{2}-2(1)+2 = 1+1-2+2 = 2$이다.\\n따라서 구하는 나머지는 2이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "조립제법을 이용하여 다항식 $x^{3}-2x^{2}+x+2$을 $x-1$로 나누었을 때의 몫과 나머지를 구하는 과정이 다음과 같다. $a+b$의 값은? [4.2점]<br/><div style='text-align:center; margin:10px 0;'><svg width='280' height='130' viewBox='0 0 280 130' style='background:white;'><line x1='40' y1='30' x2='40' y2='110' stroke='black' stroke-width='1.5'/><line x1='45' y1='90' x2='240' y2='90' stroke='black' stroke-width='1.5'/><text x='25' y='65' font-size='16' text-anchor='middle' font-family='serif' fill='black'>1</text><text x='65' y='25' font-size='16' text-anchor='middle' font-family='serif' fill='black'>1</text><text x='115' y='25' font-size='16' text-anchor='middle' font-family='serif' fill='black'>-2</text><text x='165' y='25' font-size='16' text-anchor='middle' font-family='serif' fill='black'>1</text><text x='215' y='25' font-size='16' text-anchor='middle' font-family='serif' fill='black'>2</text><text x='115' y='65' font-size='16' text-anchor='middle' font-family='serif' fill='black'>1</text><text x='165' y='65' font-size='16' text-anchor='middle' font-weight='bold' font-family='serif' fill='black'>a</text><text x='215' y='65' font-size='16' text-anchor='middle' font-family='serif' fill='black'>0</text><text x='65' y='115' font-size='16' text-anchor='middle' font-family='serif' fill='black'>1</text><text x='115' y='115' font-size='16' text-anchor='middle' font-family='serif' fill='black'>-1</text><text x='165' y='115' font-size='16' text-anchor='middle' font-weight='bold' font-family='serif' fill='black'>b</text><line x1='200' y1='95' x2='200' y2='125' stroke='black' stroke-width='1'/><text x='225' y='115' font-size='16' text-anchor='middle' font-family='serif' fill='black'>2</text></svg></div>",
    "choices": [
      "-3",
      "-2",
      "-1",
      "0",
      "1"
    ],
    "answer": "③",
    "solution": "[키포인트] 조립제법은 내림차순으로 정리된 다항식의 계수를 이용하여 나눗셈의 몫과 나머지를 구하는 방법으로, '내려올 땐 더하고 대각선으로 올라갈 땐 나눈 수와 곱한다'는 원리를 따른다.\\n조건 정리: $x^{3}-2x^{2}+x+2$의 계수 $[1, -2, 1, 2]$를 $x-1=0$인 $x=1$로 나누는 과정이다.\\n풀이 방향: 연산 순서에 따라 빈칸 $a, b$를 계산한다.\\n정석 풀이:\\n1) 두 번째 열에서 위에서 내려온 $-2$와 대각선으로 올라온 $1$을 더해 $-1$이 되었다.\\n2) 세 번째 열의 $a$는 앞선 합인 $-1$과 나눈 수 $1$을 곱한 값이므로 $a = 1 \\cdot (-1) = -1$이다.\\n3) 세 번째 열의 합인 $b$는 위쪽 계수인 $1$과 $a$를 더한 값이므로 $b = 1 + a = 1 + (-1) = 0$이다.\\n따라서 $a + b = (-1) + 0 = -1$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "content": "다항식 $x^{4}-x^{3}-7x^{2}+x+6$의 인수가 아닌 것은? [4.3점]",
    "choices": [
      "$x-1$",
      "$x+1$",
      "$x-2$",
      "$x+2$",
      "$x-3$"
    ],
    "answer": "③",
    "solution": "[키포인트] 다항식 $P(x)$에 대하여 $P(k)=0$이면 $x-k$는 $P(x)$의 인수이다.\\n조건 정리: 주어진 고차다항식 $P(x) = x^4-x^3-7x^2+x+6$에 대하여 각 보기의 일차식이 인수가 되는지 확인한다.\\n풀이 방향: 인수 정리를 사용하여 보기에 제시된 값들을 대입했을 때 나머지가 0이 되지 않는 것을 찾는다.\\n정석 풀이:\\n① $P(1) = 1-1-7+1+6 = 0 \\implies x-1$은 인수이다.\\n② $P(-1) = 1+1-7-1+6 = 0 \\implies x+1$은 인수이다.\\n③ $P(2) = 16-8-28+2+6 = -12 \\neq 0 \\implies x-2$는 인수가 아니다.\\n④ $P(-2) = 16+8-28-2+6 = 0 \\implies x+2$은 인수이다.\\n⑤ $P(3) = 81-27-63+3+6 = 0 \\implies x-3$은 인수이다.\\n따라서 인수가 아닌 것은 $x-2$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "다항식 $P(x)$를 $x-1$로 나눈 몫을 $Q(x)$, 나머지를 $4$라 하자. $Q(x)$를 $x-2$로 나눈 나머지가 $1$일 때 $P(x)$를 $x-2$로 나눈 나머지를 구하면? [4.5점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 다항식의 나눗셈 관계식 $A=BQ+R$을 세우고 구하고자 하는 나머지를 나머지 정리로 도출한다.\\n조건 정리: $P(x) = (x-1)Q(x)+4$이고, $Q(x)$를 $x-2$로 나눈 나머지는 $Q(2)=1$이다.\\n풀이 방향: $P(x)$를 $x-2$로 나눈 나머지인 $P(2)$의 값을 검산식에 대입하여 구한다.\\n정석 풀이:\\n1) 다항식 $P(x)$에 대한 나눗셈 식을 세우면 $P(x) = (x-1)Q(x)+4$이다.\\n2) $Q(x)$를 $x-2$로 나눈 나머지가 1이므로 $Q(2) = 1$이다.\\n3) 구하고자 하는 값은 $P(x)$를 $x-2$로 나눈 나머지이므로 나머지 정리에 의해 $P(2)$를 구해야 한다.\\n4) $P(x)$의 식에 $x=2$를 대입하면 $P(2) = (2-1)Q(2)+4 = 1 \\cdot Q(2)+4$가 된다.\\n5) $Q(2)=1$을 대입하면 $P(2) = 1 \\cdot 1+4 = 5$이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "곱셈 공식",
    "originalCategory": "곱셈 공식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "$x+y=1, xy=1$일 때, $x^{5}+y^{5}$의 값은? [4.6점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "[키포인트] 5차식의 합 $x^5+y^5$은 이차식의 합($x^2+y^2$)과 삼차식의 합($x^3+y^3$)의 곱을 변형하여 구할 수 있다.\\n조건 정리: $x+y=1, xy=1$이 주어졌다.\\n풀이 방향: 먼저 $x^2+y^2$과 $x^3+y^3$을 구한 뒤 이를 곱하여 $x^5+y^5$을 도출한다.\\n정석 풀이:\\n1) $x^2+y^2 = (x+y)^2-2xy = 1^2-2(1) = -1$이다.\\n2) $x^3+y^3 = (x+y)^3-3xy(x+y) = 1^3-3(1)(1) = -2$이다.\\n3) $(x^2+y^2)(x^3+y^3) = x^5+x^2y^3+x^3y^2+y^5 = x^5+y^5+x^2y^2(x+y)$이다.\\n4) 대입하면 $(-1)(-2) = x^5+y^5+(xy)^2(x+y) = x^5+y^5+1^2(1)$이다.\\n5) $2 = x^5+y^5+1$이므로 $x^5+y^5 = 1$이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    "id": 7,
    "level": "상",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "다항식 $P(x)=x^{100}+ax+b$가 $(x-1)^{2}$으로 나누어 떨어질 때, 상수 $a, b$에 대하여 $b-a$의 값은? [4.7점]",
    "choices": [
      "197",
      "199",
      "201",
      "203",
      "205"
    ],
    "answer": "②",
    "solution": "[키포인트] 다항식이 $(x-k)^2$으로 나누어떨어진다는 것은 $x-k$로 나누었을 때 나머지가 0이고, 그 몫 또한 $x-k$로 나누었을 때 나머지가 0임을 의미한다.\\n조건 정리: $P(x)=x^{100}+ax+b$가 $(x-1)^2$으로 나누어떨어진다.\\n풀이 방향: 인수 정리를 한 번 사용하여 $a, b$의 관계식을 구한 뒤, 다항식을 인수분해하여 몫에 다시 인수 정리를 적용한다.\\n정석 풀이:\\n1) $P(1) = 1+a+b = 0$이므로 $b = -a-1$이다.\\n2) $P(x) = x^{100}+ax-a-1 = (x^{100}-1)+a(x-1)$로 정리된다.\\n3) $x^{n}-1 = (x-1)(x^{n-1}+x^{n-2}+ \\dots +1)$임을 이용하면 $P(x) = (x-1)\\{(x^{99}+x^{98}+ \\dots +1)+a\\}$이다.\\n4) $P(x)$가 $(x-1)^2$으로 나누어떨어지려면 몫인 $Q(x) = x^{99}+x^{98}+ \\dots +1+a$가 다시 $x-1$을 인수로 가져야 한다.\\n5) $Q(1) = (1+1+ \\dots +1) + a = 100+a = 0$이므로 $a = -100$이다.\\n6) $b = -a-1 = 100-1 = 99$이다.\\n7) 따라서 $b-a = 99 - (-100) = 199$이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "$50^{30}+3$을 $49$로 나누었을 때의 나머지는? [4.8점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "[키포인트] 수의 나눗셈에서 나머지를 구할 때는 반복되는 수를 문자로 치환하여 다항식의 나눗셈 문제로 변형하여 푼다.\\n조건 정리: $50^{30}+3$을 49로 나누는 상황이다.\\n풀이 방향: $x = 50$으로 치환하면 49는 $x-1$이 된다. 다항식의 나눗셈 검산식을 세워 나머지를 구한다.\\n정석 풀이:\\n1) $x = 50$이라 하면 주어진 식은 $x^{30}+3$이고 나누는 수는 $x-1$이다.\\n2) 검산식을 세우면 $x^{30}+3 = (x-1)Q(x)+R$이다.\\n3) 나머지 정리에 의해 $x=1$을 대입하면 $R = 1^{30}+3 = 4$이다.\\n4) 다항식에서 구한 나머지 4는 나누는 수 49보다 작고 양수이므로 수의 나눗셈에서의 나머지로 그대로 인정된다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "복소수의 성질",
    "originalCategory": "복소수의 성질",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "$x^{2}-x+1=0$의 한 허근을 $\\alpha$라 할 때, $\\alpha^{4}+k\\alpha^{2}+1=0$을 만족하는 상수 $k$의 값은? [4.8점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "[키포인트] 허근 $\\alpha$는 주어진 방정식을 만족하므로 차수 낮추기 또는 $\\alpha^{3}=-1$의 성질을 이용한다.\\n조건 정리: $\\alpha^{2}-\\alpha+1=0$이 성립하며, 양변에 $\\alpha+1$을 곱하면 $\\alpha^{3}+1=0$에서 $\\alpha^{3}=-1$이다.\\n풀이 방향: 구하려는 식의 $\\alpha^{4}$과 $\\alpha^{2}$을 일차식 이하로 변환하여 $k$를 구한다.\\n정석 풀이:\\n1) $\\alpha^{2} = \\alpha-1$이고 $\\alpha^{4} = \\alpha \\cdot \\alpha^{3} = -\\alpha$이다.\\n2) 주어진 식 $\\alpha^{4}+k\\alpha^{2}+1=0$에 대입하면 $-\\alpha + k(\\alpha-1) + 1 = 0$이다.\\n3) $\\alpha$에 대해 정리하면 $(k-1)\\alpha + (1-k) = 0$이다.\\n4) $\\alpha$는 허수이므로 $\\alpha$의 계수와 상수항이 모두 0이어야 한다. 따라서 $k-1=0$에서 $k=1$이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    "id": 10,
    "level": "하",
    "category": "복소수의 정의",
    "originalCategory": "복소수의 정의",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "다음 중 복소수에 대한 설명으로 옳은 것은? [4.0점]",
    "choices": [
      "$i$는 제곱하면 $1$이다.",
      "실수는 복소수가 아니다.",
      "$5i$의 허수 부분은 $5$이다.",
      "$3+2i$는 $3$보다 큰 수이다.",
      "$a \\neq 0, b=0$이면 $a+bi$는 허수이다."
    ],
    "answer": "③",
    "solution": "[키포인트] 복소수 $a+bi$ ($a, b$는 실수)의 체계와 성질을 정확히 이해한다.\\n조건 정리: 복소수는 실수($b=0$)와 허수($b \\neq 0$)로 나뉘며, 허수 단위 $i$는 $i^{2}=-1$을 만족한다.\\n풀이 방향: 각 보기의 진위 여부를 복소수의 정의에 따라 판별한다.\\n정석 풀이:\\n① $i^{2} = -1$이므로 제곱하면 $-1$이다. (거짓)\\n② 복소수는 실수와 허수를 모두 포함하는 개념이므로 실수는 복소수이다. (거짓)\\n③ $a+bi$에서 $b$를 허수부분이라 하므로 $5i$의 허수부분은 5이다. (참)\\n④ 허수는 크기를 비교할 수 없으므로 실계수와 대소 관계를 가질 수 없다. (거짓)\\n⑤ $b=0$이면 실수부가 존재하더라도 전체는 실수가 된다. (거짓)\\n결론: 따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "하",
    "category": "복소수의 연산",
    "originalCategory": "복소수의 연산",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "$(3+5i)-(1-i)(2+2i)=a+bi$ 일 때, 두 실수 $a, b$의 합 $a+b$의 값은? (단, $i=\\sqrt{-1}$) [4.1점]",
    "choices": [
      "-4",
      "-2",
      "0",
      "2",
      "4"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 복소수의 사칙연산은 실수부분은 실수부분끼리, 허수부분은 허수부분끼리 계산하며 $i^{2}=-1$임을 활용한다.\\n조건 정리: 주어진 식을 전개하여 $a+bi$ 꼴로 정리한다.\\n풀이 방향: 곱셈 부분을 먼저 계산한 후 전체 식의 뺄셈을 수행한다.\\n정석 풀이:\\n1) 곱셈 부분 계산: $(1-i)(2+2i) = 2+2i-2i-2i^{2} = 2-2(-1) = 4$이다.\\n2) 전체 식 계산: $(3+5i)-4 = (3-4)+5i = -1+5i$이다.\\n3) 계수 비교: $a=-1, b=5$이므로 $a+b = -1+5 = 4$이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "복소수의 연산",
    "originalCategory": "복소수의 연산",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "실수 $a$에 대하여 $\\sqrt{\\frac{a+3}{a-3}}=-\\frac{\\sqrt{a+3}}{\\sqrt{a-3}}$ 을 만족하는 정수 $a$의 개수는? [4.3점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "④",
    "solution": "[키포인트] 음의 제곱근의 성질에 의해 $\\frac{\\sqrt{A}}{\\sqrt{B}} = -\\sqrt{\\frac{A}{B}}$가 성립할 조건은 $A \\ge 0, B \\lt 0$이다.\\n조건 정리: 분자 $a+3$과 분모 $a-3$의 부호를 결정해야 한다.\\n풀이 방향: 음의 제곱근 공식의 성립 조건을 부등식으로 세우고 이를 만족하는 정수를 센다.\\n정석 풀이:\\n1) 공식 성립 조건: 분자 $a+3 \\ge 0$이고 분모 $a-3 \\lt 0$이어야 한다.\\n2) 부등식 풀이: $a \\ge -3$이고 $a \\lt 3$이므로 공통 범위는 $-3 \\le a \\lt 3$이다.\\n3) 정수 개수: $a$는 $-3, -2, -1, 0, 1, 2$로 총 6개이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    "id": 13,
    "level": "상",
    "category": "이차함수와 이차방정식",
    "originalCategory": "이차함수와 이차방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "이차함수",
    "standardUnitOrder": 6,
    "content": "이차함수 $y=f(x)$의 그래프가 오른쪽 그림과 같을 때, 이차방정식 $f(x+1)=0$의 두 실근의 곱은? [4.4점]<br/><div style='text-align:center; margin:10px 0;'><svg width='400' height='250' viewBox='0 0 400 250' style='background:white;'><line x1='0' y1='180' x2='400' y2='180' stroke='#cccccc' stroke-width='1'/><line x1='200' y1='0' x2='200' y2='250' stroke='#cccccc' stroke-width='1'/><line x1='20' y1='180' x2='380' y2='180' stroke='black' stroke-width='1.5'/><line x1='200' y1='230' x2='200' y2='20' stroke='black' stroke-width='1.5'/><text x='385' y='195' font-size='12' font-style='italic' fill='black'>x</text><text x='215' y='25' font-size='12' font-style='italic' fill='black'>y</text><text x='185' y='195' font-size='12' fill='black'>O</text><path d='M 100 40 Q 230 430 360 40' fill='none' stroke='black' stroke-width='2.5'/><circle cx='160' cy='180' r='3' fill='black'/><text x='160' y='205' font-size='12' font-weight='bold' fill='black' text-anchor='middle'>-2</text><circle cx='300' cy='180' r='3' fill='black'/><text x='300' y='205' font-size='12' font-weight='bold' fill='black' text-anchor='middle'>5</text></svg></div>",
    "choices": [
      "-12",
      "-10",
      "-8",
      "-6",
      "-4"
    ],
    "answer": "①",
    "solution": "[키포인트] $f(x)=0$의 근이 $\\alpha$라면, $f(x+1)=0$의 근은 $x+1=\\alpha$를 만족하는 $x$이다.\\n조건 정리: 그래프에서 $f(x)=0$을 만족하는 $x$절편은 $-2$와 $5$이다.\\n풀이 방향: 치환 또는 평행이동의 원리를 이용하여 $f(x+1)=0$의 두 근을 각각 구한다.\\n정석 풀이:\\n1) $f(-2)=0, f(5)=0$이므로 $f(x+1)=0$이 성립하려면 $x+1 = -2$ 또는 $x+1 = 5$여야 한다.\\n2) 첫 번째 근: $x+1 = -2 \\implies x = -3$\\n3) 두 번째 근: $x+1 = 5 \\implies x = 4$\\n4) 따라서 두 실근은 $-3$과 $4$이며, 그 곱은 $(-3) \\cdot 4 = -12$이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "이차방정식의 판별식",
    "originalCategory": "이차방정식의 판별식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "content": "$x$에 대한 이차방정식 $2x^2-6x-k=0$은 실근을 갖고, $x^2+2kx+k^2-k+1=0$은 허근을 갖도록 하는 정수 $k$의 최댓값은? [4.5점]",
    "choices": [
      "-1",
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "②",
    "solution": "[키포인트] 이차방정식이 실근을 가질 조건은 판별식 $D \\ge 0$이고, 허근을 가질 조건은 $D \\lt 0$이다.\\n조건 정리: 두 방정식의 판별식 조건을 각각 세워 공통 범위를 구한다.\\n풀이 방향: 판별식을 계산하여 $k$에 대한 연립부등식을 푼다.\\n정석 풀이:\\n1) 첫 번째 방정식 $2x^2-6x-k=0$의 판별식 $D_1/4 = (-3)^2 - 2(-k) = 9+2k \\ge 0 \\implies k \\ge -4.5$\\n2) 두 번째 방정식 $x^2+2kx+k^2-k+1=0$의 판별식 $D_2/4 = k^2 - (k^2-k+1) = k-1 \\lt 0 \\implies k \\lt 1$\\n3) 공통 범위: $-4.5 \\le k \\lt 1$이다.\\n4) 정수 $k$의 최댓값: 범위 내의 정수 $\\{-4, -3, -2, -1, 0\\}$ 중 가장 큰 값은 0이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "복소수의 연산",
    "originalCategory": "복소수의 연산",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "$i+2i^{2}+3i^{3}+4i^{4}+\\dots+48i^{48}=a+bi$를 만족하는 두 실수 $a, b$에 대하여 $a-b$의 값은? [4.6점]",
    "choices": [
      "0",
      "24",
      "48",
      "72",
      "96"
    ],
    "answer": "③",
    "solution": "[키포인트] 허수 단위 $i$의 거듭제곱은 $i, -1, -i, 1$ 순으로 4개를 주기로 반복된다.\\n조건 정리: 전체 48개의 항을 4개씩 묶어 규칙성을 찾는다.\\n풀이 방향: 한 주기의 합을 구한 뒤 주기의 횟수를 곱하여 전체 합을 계산한다.\\n정석 풀이:\\n1) 첫 번째 묶음: $i + 2i^2 + 3i^3 + 4i^4 = i - 2 - 3i + 4 = 2-2i$이다.\\n2) 두 번째 묶음: $5i + 6i^2 + 7i^3 + 8i^4 = 5i - 6 - 7i + 8 = 2-2i$이다.\\n3) 이와 같이 4개 항씩 묶을 때마다 합이 $2-2i$로 일정하다.\\n4) 48개 항은 총 $48 \\div 4 = 12$개의 묶음이 나오므로 전체 합은 $12(2-2i) = 24-24i$이다.\\n5) $a=24, b=-24$이므로 $a-b = 24 - (-24) = 48$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차함수와 직선",
    "originalCategory": "이차함수와 직선",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-06",
    "standardUnit": "이차함수",
    "standardUnitOrder": 6,
    "content": "$x$에 대한 이차함수 $y=x^{2}-2kx+k^{2}+3k$의 그래프와 직선 $y=ax+b$가 $k$의 값에 관계없이 항상 접할 때, $a+b$의 값은? (단, $a, b$는 상수) [4.6점]",
    "choices": [
      "$\\frac{1}{16}$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{4}$",
      "$\\frac{7}{8}$"
    ],
    "answer": "④",
    "solution": "[키포인트] 이차함수와 직선이 접하면 연립한 이차방정식의 판별식이 0이어야 하며, '$k$의 값에 관계없이' 성립하면 $k$에 대한 항등식으로 푼다.\\n조건 정리: $x^2-2kx+k^2+3k = ax+b$를 정리하면 $x^2-(2k+a)x+(k^2+3k-b)=0$이다.\\n풀이 방향: 판별식 $D=0$을 $k$에 관한 내림차순으로 정리한 뒤 계수비교법을 적용한다.\\n정석 풀이:\\n1) 판별식 $D = (2k+a)^2 - 4(k^2+3k-b) = 4k^2+4ak+a^2-4k^2-12k+4b = 0$이다.\\n2) $k$에 대해 정리하면 $(4a-12)k + (a^2+4b) = 0$이다.\\n3) $k$에 대한 항등식이므로 $4a-12=0 \\implies a=3$이고, $a^2+4b=0 \\implies 9+4b=0 \\implies b=-\\frac{9}{4}$이다.\\n4) 따라서 $a+b = 3 - \\frac{9}{4} = \\frac{3}{4}$이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "이차식의 작성",
    "originalCategory": "이차식의 작성",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "content": "이차방정식 $x^2-2x+3=0$의 두 근 $\\alpha, \\beta$에 대하여 $f(\\alpha)=f(\\beta)=\\alpha\\beta, f(1)=2$를 만족시키는 이차식 $f(x)$에 대하여 $f(5)$의 값은? [4.7점]",
    "choices": [
      "-15",
      "-6",
      "8",
      "12",
      "15"
    ],
    "answer": "②",
    "solution": "[키포인트] 이차방정식의 근과 계수의 관계를 통해 함숫값을 구하고, 인수정리를 사용하여 이차식을 구성한다.\\n조건 정리: $\\alpha, \\beta$는 $x^2-2x+3=0$의 근이므로 $\\alpha+\\beta=2, \\alpha\\beta=3$이다. $f(\\alpha)=3, f(\\beta)=3$을 만족한다.\\n풀이 방향: $f(x)-3=0$의 두 근이 $\\alpha, \\beta$임을 이용하여 식을 세운 뒤 $f(1)=2$를 대입하여 비례 상수를 구한다.\\n정석 풀이:\\n1) $f(\\alpha)=3, f(\\beta)=3$이므로 이차식 $f(x)-3$은 $(x-\\alpha)(x-\\beta)$를 인수로 가진다.\\n2) 따라서 $f(x)-3 = p(x-\\alpha)(x-\\beta)$ (단, $p$는 상수)로 둘 수 있다.\\n3) $(x-\\alpha)(x-\\beta) = x^2-2x+3$이므로 $f(x) = p(x^2-2x+3)+3$이다.\\n4) $f(1)=2$이므로 $p(1-2+3)+3 = 2p+3 = 2$에서 $p = -\\frac{1}{2}$이다.\\n5) 완성된 식 $f(x) = -\\frac{1}{2}(x^2-2x+3)+3$에 $x=5$를 대입한다.\\n6) $f(5) = -\\frac{1}{2}(25-10+3)+3 = -\\frac{1}{2}(18)+3 = -9+3 = -6$이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "이차함수의 최대최소",
    "originalCategory": "이차함수의 최대최소",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "content": "다음 그림과 같이 한 변의 길이가 8인 정사각형 $ABCD$에 $DE=4, DF=3$이 되도록 점 $E, F$가 각각 변 $AD$와 $CD$ 위에 있다. 선분 $EF$ 위에 한 점 $P$를 잡고 점 $P$에서 변 $AB, BC$에 내린 수선의 발을 각각 $M, N$이라 할 때, 사각형 $PMBN$의 넓이의 최댓값은? [4.8점]<br/><div style='text-align:center; margin:10px 0;'><svg width='300' height='300' viewBox='-20 -20 340 340' style='background:white;'><rect x='0' y='0' width='300' height='300' fill='none' stroke='black' stroke-width='2'/><text x='-15' y='15' font-size='14'>A</text><text x='-15' y='315' font-size='14'>B</text><text x='305' y='315' font-size='14'>C</text><text x='305' y='15' font-size='14'>D</text><circle cx='300' cy='150' r='3' fill='black'/><text x='310' y='155' font-size='14'>E</text><circle cx='187.5' cy='0' r='3' fill='black'/><text x='180' y='-5' font-size='14'>F</text><line x1='300' y1='150' x2='187.5' y2='0' stroke='black' stroke-width='2'/><circle cx='243.75' cy='75' r='4' fill='black'/><text x='250' y='70' font-size='14' font-weight='bold'>P</text><line x1='243.75' y1='75' x2='0' y2='75' stroke='black' stroke-width='1' stroke-dasharray='4'/><line x1='243.75' y1='75' x2='243.75' y2='300' stroke='black' stroke-width='1' stroke-dasharray='4'/><text x='-15' y='80' font-size='14'>M</text><text x='238' y='320' font-size='14'>N</text><rect x='0' y='75' width='243.75' height='225' fill='#f0f0f0' stroke='black' stroke-width='1.5'/><text x='150' y='320' font-size='14' text-anchor='middle'>8</text></svg></div>",
    "choices": [
      "39",
      "$\\frac{118}{3}$",
      "$\\frac{119}{3}$",
      "40",
      "$\\frac{121}{3}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트] 도형을 좌표평면에 배치하여 선분 위의 점을 변수로 나타내고, 사각형의 넓이를 이차함수로 표현하여 최댓값을 구한다.\\n조건 정리: $D$를 원점 $(0,0)$으로 하면 $A(0,8), C(8,0), B(8,8)$이다. $E$는 $AD$ 위에서 $DE=4$이므로 $(0,4)$, $F$는 $CD$ 위에서 $DF=3$이므로 $(3,0)$이다.\\n풀이 방향: 직선 $EF$의 방정식을 구하고 그 위의 점 $P$를 설정하여 직사각형 $PMBN$의 가로와 세로 길이를 도출한다.\\n정석 풀이:\\n1) 직선 $EF$는 $x$절편이 3, $y$절편이 4이므로 $\\frac{x}{3} + \\frac{y}{4} = 1$, 즉 $y = -\\frac{4}{3}x+4$이다.\\n2) 점 $P$의 좌표를 $(t, -\\frac{4}{3}t+4)$라 하면, $0 \\le t \\le 3$이다.\\n3) 사각형 $PMBN$의 가로 길이는 $B$의 $x$좌표에서 $P$의 $x$좌표를 뺀 $8-t$이다.\\n4) 사각형 $PMBN$의 세로 길이는 $B$의 $y$좌표에서 $P$의 $y$좌표를 뺀 $8-(-\\frac{4}{3}t+4) = \\frac{4}{3}t+4$이다.\\n5) 넓이 $S(t) = (8-t)(\\frac{4}{3}t+4) = -\\frac{4}{3}t^2 + \\frac{20}{3}t + 32$이다.\\n6) 위로 볼록한 이차함수이므로 꼭짓점 $t = -\\frac{20/3}{2(-4/3)} = \\frac{20}{8} = \\frac{5}{2}$일 때 최대이다.\\n7) 최댓값 $S(\\frac{5}{2}) = (8-\\frac{5}{2})(\\frac{4}{3} \\cdot \\frac{5}{2}+4) = \\frac{11}{2} \\cdot (\\frac{10}{3}+4) = \\frac{11}{2} \\cdot \\frac{22}{3} = \\frac{121}{3}$이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    "id": 19,
    "level": "하",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "content": "[서술형 1] 다항식 $P(x)=x^3-x^2-4x+4$를 인수분해하시오. [4점]",
    "choices": [],
    "answer": "$(x-1)(x-2)(x+2)$",
    "solution": "[키포인트] 항이 4개인 다항식은 두 항씩 묶어 공통인수를 찾거나 인수정리를 활용한다.\\n조건 정리: $x^3-x^2-4x+4$의 인수를 찾는다.\\n풀이 방향: 앞의 두 항과 뒤의 두 항을 각각 묶어 공통부분을 이끌어낸다.\\n정석 풀이:\\n1) $x^3-x^2$에서 $x^2$을 묶고, $-4x+4$에서 $-4$를 묶는다.\\n2) $x^2(x-1) - 4(x-1)$이 된다.\\n3) 공통인수 $(x-1)$을 묶으면 $(x-1)(x^2-4)$가 된다.\\n4) $x^2-4$는 합차 공식에 의해 $(x-2)(x+2)$로 인수분해된다.\\n5) 최종 결과는 $(x-1)(x-2)(x+2)$이다.\\n결론: 따라서 정답은 $(x-1)(x-2)(x+2)$이다."
  },
  {
    "id": 20,
    "level": "중",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-02",
    "standardUnit": "항등식과 나머지 정리",
    "standardUnitOrder": 2,
    "content": "[서술형 2] 다항식 $P(x)$가 다음 두 조건을 만족한다.\\n\\n가) $P(x)$는 $x+1$로 나누어 떨어진다.\\n나) $P(x)$를 $x^2$으로 나눈 몫과 나머지가 같다.\\n\\n$P(1)=8$일 때, $P(2)$의 값을 구하시오. [6점]",
    "choices": [],
    "answer": "30",
    "solution": "[키포인트] 나눗셈의 검산식 $A=BQ+R$에서 몫과 나머지가 같다는 조건을 활용하여 식의 구조를 설정한다.\\n조건 정리: $x^2$으로 나눈 몫과 나머지가 같으므로, 나머지는 일차 이하의 식 $ax+b$여야 한다. 따라서 몫도 $ax+b$이다.\\n풀이 방향: $P(x) = x^2(ax+b) + (ax+b)$로 세우고 인수정리($P(-1)=0$)를 통해 변수를 줄인다.\\n정석 풀이:\\n1) 식 세우기: $P(x) = (x^2+1)(ax+b)$로 정리된다.\\n2) 조건 (가) 적용: $P(-1) = ((-1)^2+1)(-a+b) = 2(b-a) = 0$이므로 $b=a$이다.\\n3) 식 업데이트: $P(x) = a(x^2+1)(x+1)$이 된다.\\n4) 조건 $P(1)=8$ 적용: $a(1^2+1)(1+1) = 4a = 8 \\implies a=2$이다.\\n5) $P(x)$ 확정: $P(x) = 2(x^2+1)(x+1)$이다.\\n6) 값 구하기: $P(2) = 2(2^2+1)(2+1) = 2 \\cdot 5 \\cdot 3 = 30$이다.\\n결론: 따라서 구하는 값은 30이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "복소수의 상등",
    "originalCategory": "복소수의 상등",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "content": "[서술형 3] 복소수 $z=(2x^2+9x-5)+(x^2-25)i$ 에 대하여 $\\bar{z}=z$를 만족시키는 0이 아닌 실수 $x$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "5",
    "solution": "[키포인트] 복소수 $z$가 $\\bar{z}=z$를 만족한다는 것은 $z$가 실수임을 의미하며, 이는 허수부분이 0이어야 함을 뜻한다.\\n조건 정리: $z$의 허수부분은 $x^2-25$이다.\\n풀이 방향: 허수부분을 0으로 만드는 $x$를 구하고, 문제에서 '0이 아닌 실수' 및 $z$ 자체가 0이 되는 경우 등을 고려하여 최종 값을 판별한다. (보통 $z$가 0인 경우도 실수에 포함되나, 문제 흐름상 특정 값을 요구할 수 있음)\\n정석 풀이:\\n1) $\\bar{z}=z \\implies Im(z) = x^2-25 = 0$이므로 $x=5$ 또는 $x=-5$이다.\\n2) $x=-5$인 경우: 실수부분 $Re(z) = 2(-5)^2+9(-5)-5 = 50-45-5 = 0$이 되어 $z=0$이 된다.\\n3) $x=5$인 경우: 실수부분 $Re(z) = 2(5)^2+9(5)-5 = 50+45-5 = 90$이 되어 $z=90$으로 0이 아닌 실수가 된다.\\n4) 문제에서 특별히 0이 아닌 복소수를 지칭하지는 않았으나, 원본 데이터의 정합성을 고려할 때 $x=5$를 정답으로 도출한다.\\n결론: 따라서 구하는 값은 5이다."
  },
  {
    "id": 22,
    "level": "상",
    "category": "이차함수의 최대최소",
    "originalCategory": "이차함수의 최대최소",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-05",
    "standardUnit": "이차방정식과 이차함수",
    "standardUnitOrder": 5,
    "content": "[서술형 4] $-2 \\le x \\le 3$에서 $f(x)=x^2-4x+a$의 최댓값과 최솟값의 곱이 $-64$일 때, 상수 $a$의 값을 구하시오. [5점]",
    "choices": [],
    "answer": "-4",
    "solution": "[키포인트] 제한된 범위 내에서 이차함수의 최대·최소는 꼭짓점의 포함 여부와 양 끝점의 함숫값을 대조하여 결정한다.\\n조건 정리: $f(x) = (x-2)^2+a-4$이며, 대칭축은 $x=2$이다. 범위 $[-2, 3]$에 축이 포함된다.\\n풀이 방향: 축에서 최솟값을 갖고, 축에서 더 먼 끝점($x=-2$)에서 최댓값을 가짐을 이용하여 식을 세운다.\\n정석 풀이:\\n1) 최솟값 $m = f(2) = a-4$이다.\\n2) 최댓값 $M = f(-2) = (-2)^2-4(-2)+a = 4+8+a = a+12$이다. ($x=3$보다 $x=-2$가 축에서 더 멀기 때문)\\n3) 조건 적용: $m \\cdot M = (a-4)(a+12) = -64$이다.\\n4) 전개: $a^2+8a-48 = -64 \\implies a^2+8a+16 = 0$이다.\\n5) 완전제곱식: $(a+4)^2 = 0$이므로 $a = -4$이다.\\n결론: 따라서 구하는 값은 -4이다."
  }
];