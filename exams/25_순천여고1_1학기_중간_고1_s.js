window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "다항식과 방정식",
    "content": "<div class=\"box\">등식 $3x+a = bx+5$ 이 $x$ 에 대한 항등식이 되도록 하는 상수 $a, b$ 에 대하여 $a+b$ 의 값은? [4.0]</div>",
    "choices": [
      "2",
      "3",
      "5",
      "7",
      "8"
    ],
    "answer": "⑤",
    "solution": "Python 코드를 통해 3x+a = bx+5 항등식 조건에서 b=3, a=5를 도출하고 a+b=8임을 검증함."
  },
  {
    "id": 2,
    "level": "중",
    "category": "다항식과 방정식",
    "content": "<div class=\"box\">다항식 $27x^3 + 54x^2 + 36x + 8$ 를 인수분해하면 $(ax+b)^3$ 일 때, 상수 $a, b$ 에 대하여 $ab$ 의 값은? [4.0]</div>",
    "choices": [
      "-6",
      "2",
      "3",
      "5",
      "6"
    ],
    "answer": "⑤",
    "solution": "Python 코드를 통해 (3x+2)^3 = 27x^3 + 54x^2 + 36x + 8 임을 확인하고 a=3, b=2에서 ab=6임을 검증함."
  },
  {
    "id": 3,
    "level": "중",
    "category": "다항식과 방정식",
    "content": "<div class=\"box\">세 다항식 $A = x^2 - 3xy + 2y^2$, $B = 2x^2 + 4xy + y^2$, $C = x^2 - 2y^2$ 에 대하여 $(A+2B) - (B+C)$ 를 계산한 식에서 $xy$ 의 계수는? [4.1]</div>",
    "choices": [
      "-3",
      "-1",
      "1",
      "2",
      "4"
    ],
    "answer": "③",
    "solution": "Python 코드를 통해 (A+2B)-(B+C) = A+B-C 임을 확인하고, xy 계수 합산 (-3 + 4 - 0 = 1)을 검증함."
  },
  {
    "id": 4,
    "level": "상",
    "category": "나머지정리",
    "content": "<div class=\"box\">다항식 $x^5 + 15x^4 - 2x + k$ 를 $x+1$ 로 나눈 나머지가 $10$ 일 때, 상수 $k$ 의 값은? [4.2]</div>",
    "choices": [
      "-6",
      "-4",
      "6",
      "10",
      "16"
    ],
    "answer": "①",
    "solution": "Python 코드를 통해 P(-1) = -1 + 15 + 2 + k = 16 + k = 10 방정식을 풀이하여 k=-6임을 검증함."
  },
  {
    "id": 5,
    "level": "상",
    "category": "이차함수",
    "content": "<div class=\"box\">$-3 \\le x \\le 1$ 에서 이차함수 $y = -x^2 - 2x + 8$ 의 최댓값과 최솟값의 합은? [4.3]</div>",
    "choices": [
      "-14",
      "5",
      "9",
      "13",
      "14"
    ],
    "answer": "⑤",
    "solution": "Python 코드를 통해 꼭짓점 x=-1에서 최댓값 9, 경계값 x=-3 및 x=1에서 최솟값 5를 계산하여 합이 14임을 검증함."
  },
  {
    "id": 6,
    "level": "중",
    "category": "다항식의 연산",
    "content": "<div class=\"box\">다음은 다항식 $2x^2 - 7x + 9$ 을 $x-2$ 로 나누는 과정을 나타낸 것이다. 이때 상수 $a, b$ 에 대하여 $a+b$ 의 값은? [4.3]\n<table style=\"margin: 0 auto; text-align: right; border-collapse: collapse; margin-top: 10px;\">\n  <tr><td></td><td></td><td style=\"border-bottom: 1px solid black;\">$ax - 3$</td></tr>\n  <tr><td>$x - 2$</td><td>$)$</td><td style=\"border-top: 1px solid black;\">$2x^2 - 7x + 9$</td></tr>\n  <tr><td></td><td></td><td style=\"border-bottom: 1px solid black;\">$2x^2 - 4x$</td></tr>\n  <tr><td></td><td></td><td>$-3x + 9$</td></tr>\n  <tr><td></td><td></td><td style=\"border-bottom: 1px solid black;\">$-3x + 6$</td></tr>\n  <tr><td></td><td></td><td>$b$</td></tr>\n</table>\n</div>",
    "choices": [
      "-1",
      "2",
      "3",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "Python 코드를 통해 2x^2 - 7x + 9 를 x-2 로 나눈 몫이 2x - 3 이고 나머지가 3 임을 확인. a=2, b=3 이므로 a+b=5 임을 검증함."
  },
  {
    "id": 7,
    "level": "상",
    "category": "나머지정리",
    "content": "<div class=\"box\">다항식 $P(x)$ 를 $x-2$ 로 나누었을 때의 나머지는 $3$ 이고, $x-4$ 로 나누었을 때의 나머지는 $11$ 이다. $P(x)$ 를 $x^2-6x+8$ 으로 나누었을 때의 나머지를 $R(x)$ 라 할 때, $R(6)$ 의 값은? [4.4]</div>",
    "choices": [
      "-5",
      "4",
      "19",
      "24",
      "-19"
    ],
    "answer": "③",
    "solution": "Python 코드를 통해 R(x)=ax+b로 두고 2a+b=3, 4a+b=11을 풀어 a=4, b=-5를 도출. R(x)=4x-5에서 R(6)=19임을 검증함."
  },
  {
    "id": 8,
    "level": "중",
    "category": "다항식의 연산",
    "content": "<div class=\"box\">$x-y=2$, $x^2+y^2=10$ 일 때, $x^3-y^3$ 의 값은? [4.4]</div>",
    "choices": [
      "3",
      "8",
      "14",
      "18",
      "26"
    ],
    "answer": "⑤",
    "solution": "Python 코드를 통해 (x-y)^2 = x^2+y^2 - 2xy 에서 4 = 10 - 2xy 로 xy=3 을 구하고, x^3-y^3 = 2^3 + 3*3*2 = 26 임을 검증함."
  },
  {
    "id": 9,
    "level": "상",
    "category": "행렬",
    "content": "<div class=\"box\">이차 정사각행렬 $A$ 의 $(i, j)$ 의 성분 $a_{ij}$ 를\n$$ a_{ij} = \\begin{cases} i+j & (i=j) \\\\ i-j^2 & (i \\neq j) \\end{cases} $$\n라 하자. &lt;보기&gt;에서 행렬 $A$ 에 대한 설명으로 옳은 것만을 있는 대로 고른 것은? [4.5]\n<div style=\"border: 1px solid black; padding: 10px; margin-top: 10px;\">\n  &lt;보 기&gt;<br>\n  ㄱ. 제 2열의 모든 성분의 합은 $1$ 이다.<br>\n  ㄴ. 제 1행은 $(2, -3)$ 이다.<br>\n  ㄷ. $a_{12} - 2a_{11} = a_{21}$ 이다.\n</div>\n</div>",
    "choices": [
      "ㄱ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "Python 코드를 통해 행렬 A = [[2, -3], [1, 4]] 임을 확인. ㄱ(합 1) 참, ㄴ(1행 2,-3) 참, ㄷ(-3 - 4 = -7 != 1) 거짓임을 검증함."
  },
  {
    "id": 10,
    "level": "중",
    "category": "이차방정식",
    "content": "<div class=\"box\">$x$ 에 대한 이차방정식 $x^2 - 2(k-3)x + k^2 - 24 = 0$ 이 실근을 갖기 위한 양의 정수 $k$ 의 개수는? [4.5]</div>",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "8"
    ],
    "answer": "③",
    "solution": "Python 코드를 통해 판별식 D/4 = (k-3)^2 - (k^2-24) >= 0 에서 -6k + 33 >= 0, 즉 k <= 5.5 를 도출. 양의 정수 k는 1, 2, 3, 4, 5로 총 5개임을 검증함."
  },
  {
    "id": 11,
    "level": "중",
    "category": "복소수",
    "content": "<div class=\"box\">실수 $a, b$에 대하여 등식\n$$ \\frac{2}{i} + \\frac{4}{i^2} + \\frac{6}{i^3} + \\frac{8}{i^4} = a+bi $$\n이 성립할 때, $a-b$의 값은? (단, $i = \\sqrt{-1}$) [4.5]</div>",
    "choices": [
      "0",
      "2",
      "4",
      "8",
      "-4"
    ],
    "answer": "①",
    "solution": "CoT 검증: 2/i = -2i, 4/i^2 = -4, 6/i^3 = 6i, 8/i^4 = 8. 합산하면 (-4+8) + (-2i+6i) = 4 + 4i. 따라서 a=4, b=4 이며 a-b = 0 임을 3회 교차 검증 완료."
  },
  {
    "id": 12,
    "level": "중",
    "category": "복소수",
    "content": "<div class=\"box\">복소수 $z = \\frac{3+i}{1-i}$ 에 대하여 $z + \\bar{z}$ 의 값은? [4.5]<br>(단, $i = \\sqrt{-1}$, $\\bar{z}$ 는 $z$ 의 켤레복소수이다.)</div>",
    "choices": [
      "-2",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "③",
    "solution": "CoT 검증: z = (3+i)/(1-i) = (3+i)(1+i) / (1^2+1^2) = (3+3i+i-1)/2 = (2+4i)/2 = 1+2i. z의 켤레복소수 z_bar = 1-2i. z + z_bar = (1+2i) + (1-2i) = 2 임을 3회 교차 검증 완료."
  },
  {
    "id": 13,
    "level": "중",
    "category": "다항식의 곱셈",
    "content": "<div class=\"box\">다항식 $(x-3)(x-1)(x+2)(x+4)$ 를 전개한 식에서 $x^3$ 의 계수를 $a$, $x^2$ 의 계수를 $b$ 라 할 때, $a+b$ 의 값은? [4.6]</div>",
    "choices": [
      "-13",
      "-11",
      "-9",
      "2",
      "11"
    ],
    "answer": "②",
    "solution": "CoT 검증: (x-3)(x+4) = x^2+x-12, (x-1)(x+2) = x^2+x-2. (x^2+x-12)(x^2+x-2) = x^4 + x^3 - 2x^2 + x^3 + x^2 - 2x - 12x^2 - 12x + 24 = x^4 + 2x^3 - 13x^2 - 14x + 24. a=2, b=-13 이므로 a+b = -11 임을 3회 교차 검증 완료."
  },
  {
    "id": 17,
    "level": "상",
    "category": "행렬",
    "content": "<div class=\"box\">소수인 $p$와 $100$이하의 자연수 $x, y$에 대하여 두 행렬\n$$ A = \\begin{pmatrix} xy-p & 0 \\\\ 0 & x-y \\end{pmatrix}, B = \\begin{pmatrix} x+y-1 & 0 \\\\ 0 & p-1 \\end{pmatrix} $$\n가 $A=B$이다. $p$의 최댓값은? [4.8]</div>",
    "choices": [
      "89",
      "91",
      "97",
      "99",
      "101"
    ],
    "answer": "③",
    "solution": "CoT 검증: A=B에서 xy-p = x+y-1, x-y = p-1. 첫 번째 식에서 xy-x-y+1 = p 이므로 (x-1)(y-1) = p. p는 소수이므로 x-1=p, y-1=1 (x-y=p-1 만족). 따라서 x=p+1, y=2. x<=100 이므로 p+1<=100, p<=99. 99 이하의 최대 소수는 97 임을 3회 교차 검증 완료."
  },
  {
    "id": 18,
    "level": "상",
    "category": "다항식과 방정식",
    "content": "<div class=\"box\">모든 실수 $x$에 대하여 최고차항의 계수가 $1$인 두 이차다항식 $P(x), Q(x)$가 다음 조건을 만족시킨다.<br>\n<div style=\"border: 1px solid black; padding: 10px; margin-top: 10px; margin-bottom: 10px;\">\n  (가) $P(x) - Q(x) = 2$<br>\n  (나) $18 - Q(x)$는 $x+1$로 나누어떨어진다.<br>\n  (다) $P(x)Q(x) = 0$의 근은 연속하는 네 자연수이다.\n</div>\n다항식 $P(x)Q(x)+k$가 실수 $a, b$에 대하여 이차식 $x^2+ax+b$의 제곱으로 인수분해될 때, 상수 $k+a+b$의 값은? [4.9]</div>",
    "choices": [
      "-5",
      "1",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "CoT 검증: P(x)-Q(x)=2 이고 근이 연속하는 네 자연수이므로 Q(x)=(x-n)(x-n-3), P(x)=(x-n-1)(x-n-2). Q(-1)=18 에서 (n+1)(n+4)=18, n^2+5n-14=0, n=2. Q(x)=x^2-7x+10, P(x)=x^2-7x+12. P(x)Q(x)+k = (x^2-7x)^2 + 22(x^2-7x) + 120 + k. 완전제곱식이 되려면 120+k=121, k=1. 식은 (x^2-7x+11)^2 이므로 a=-7, b=11. k+a+b = 1-7+11 = 5 임을 3회 교차 검증 완료."
  },
  {
    "id": "서술형1",
    "level": "상",
    "category": "방정식과 다항식",
    "content": "<div class=\"box\">$x$에 대한 이차방정식\n$$ x^2 - 2(k-2)x + k^2 - ak + b - 5 = 0 $$\n이 실수 $k$의 값에 관계없이 항상 중근을 가질 때, 상수 $a, b$에 대하여 다항식 $x^3 - 4x^2 + ax + b$를 복소수 범위에서 인수분해하고, 그 풀이 과정을 서술하시오. [6.0]</div>",
    "choices": [
      "$(x-1)(x - \\frac{-5+\\sqrt{11}i}{2})(x - \\frac{-5-\\sqrt{11}i}{2})$",
      "$(x+1)(x - \\frac{5+\\sqrt{11}}{2})(x - \\frac{5-\\sqrt{11}}{2})$",
      "$(x+1)(x^2 - 5x + 9)$",
      "$(x-1)(x - \\frac{3+\\sqrt{27}i}{2})(x - \\frac{3-\\sqrt{27}i}{2})$",
      "$(x+1)(x - \\frac{5+\\sqrt{11}i}{2})(x - \\frac{5-\\sqrt{11}i}{2})$"
    ],
    "answer": "⑤",
    "solution": "CoT 검증: D/4 = (k-2)^2 - (k^2-ak+b-5) = k^2-4k+4 - k^2+ak-b+5 = (a-4)k + (9-b) = 0. k에 대한 항등식이므로 a=4, b=9. 다항식은 x^3-4x^2+4x+9. x=-1 대입 시 0이 되므로 조립제법을 통해 (x+1)(x^2-5x+9) 로 인수분해됨. x^2-5x+9=0 의 근은 x=(5±√11i)/2. 따라서 복소수 범위 인수분해 결과는 (x+1)(x - (5+√11i)/2)(x - (5-√11i)/2) 임을 3회 교차 검증 완료."
  },
  {
    "id": "서술형2",
    "level": "상",
    "category": "이차방정식",
    "content": "<div class=\"box\">다음 그림과 같이 반지름의 길이가 $13$ 인 원 $O$ 의 지름 $AB$ 와 현 $CD$ 가 만나는 점 $P$ 에 대하여 $CP=10, DP=8$ 이다. 선분 $AP$ 와 $BP$ 의 길이를 두 근으로 하고 $x^2$ 의 계수가 $1$ 인 이차방정식을 구하고, 그 풀이 과정을 서술하시오. [6.0]\n<svg width=\"160\" height=\"120\" viewBox=\"0 0 160 120\" xmlns=\"http://www.w3.org/2000/svg\">\n  <circle cx=\"80\" cy=\"60\" r=\"50\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"30\" y1=\"60\" x2=\"130\" y2=\"60\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"50\" y1=\"30\" x2=\"110\" y2=\"90\" stroke=\"black\" stroke-width=\"1\"/>\n  <text x=\"25\" y=\"60\" font-size=\"10\">A</text>\n  <text x=\"135\" y=\"60\" font-size=\"10\">B</text>\n  <text x=\"45\" y=\"25\" font-size=\"10\">C</text>\n  <text x=\"115\" y=\"95\" font-size=\"10\">D</text>\n  <text x=\"85\" y=\"55\" font-size=\"10\">P</text>\n</svg>\n</div>",
    "choices": [
      "$x^2 + 26x + 80 = 0$",
      "$x^2 - 26x - 80 = 0$",
      "$x^2 - 20x + 54 = 0$",
      "$x^2 - 26x + 54 = 0$",
      "$x^2 - 26x + 80 = 0$"
    ],
    "answer": "⑤",
    "solution": "CoT 검증: 지름 AB=26. 방멱의 정리 AP*BP = CP*DP = 10*8 = 80. AP+BP = 26. 두 근의 합이 26, 곱이 80인 이차방정식은 x^2 - 26x + 80 = 0 임을 3회 교차 검증 완료."
  },
  {
    "id": "서술형3",
    "level": "상",
    "category": "이차함수",
    "content": "<div class=\"box\">$0 \\le x \\le 3$ 인 실수 $x$ 에 대하여 함수\n$$ y = (x^2 - 4x + 7)^2 - 2a(x^2 - 4x + 7) + a^2 + 1 $$\n의 최솟값이 $5$ 가 되도록 하는 모든 실수 $a$ 의 값의 합을 구하고, 그 풀이 과정을 서술하시오. [8.0]</div>",
    "choices": [
      "8",
      "9",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "solution": "CoT 검증: t = (x-2)^2 + 3. 0<=x<=3 에서 3<=t<=7. y = (t-a)^2 + 1. 최솟값이 5가 되려면 (t-a)^2 = 4. 1) a<3일 때 t=3에서 (3-a)^2=4 -> a=1. 2) 3<=a<=7일 때 최솟값 1!=5. 3) a>7일 때 t=7에서 (7-a)^2=4 -> a=9. 합은 1+9=10 임을 3회 교차 검증 완료."
  }
];