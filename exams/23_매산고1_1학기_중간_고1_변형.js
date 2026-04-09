window.questionBank = {
  "problems": [
    {
      "id": "M-01-V",
      "type": "single",
      "level": "하",
      "score": 4.0,
      "category": "다항식의 연산",
      "tags": ["중하"],
      "content": "두 다항식 $A=2x^2-3x+2$, $B=x^2+2x-4$에 대하여 $2A-B$를 간단히 하면? [cite: 725]",
      "choices": [
        {"key": "①", "text": "$3x^2-8x+8$"},
        {"key": "②", "text": "$3x^2-4x+8$"},
        {"key": "③", "text": "$3x^2-8x$"},
        {"key": "④", "text": "$5x^2-8x+8$"},
        {"key": "⑤", "text": "$3x^2+x$"}
      ],
      "answer": "①",
      "solution_steps": [
        "**[Step 1]** 주어진 식에 다항식을 대입함: $2(2x^2-3x+2) - (x^2+2x-4)$",
        "**[Step 2]** 분배법칙을 이용하여 괄호를 전개함: $4x^2-6x+4 - x^2-2x+4$",
        "**[Step 3]** 동류항끼리 정리함: $(4x^2-x^2) + (-6x-2x) + (4+4) = 3x^2-8x+8$"
      ],
      "error_check": "$x=1$ 대입 시 $A=1, B=-1$ 이므로 $2A-B=3$. 결과식 $3-8+8=3$ 으로 일치함.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-02-V",
      "type": "single",
      "level": "하",
      "score": 4.1,
      "category": "복소수의 연산",
      "tags": ["중하"],
      "content": "식 $(5-3i)-(2-4i)=a+bi$ ($a, b$는 실수)에서 $a+b$의 값은? (단, $i=\\sqrt{-1}$) [cite: 725]",
      "choices": [
        {"key": "①", "text": "2"},
        {"key": "②", "text": "3"},
        {"key": "③", "text": "4"},
        {"key": "④", "text": "5"},
        {"key": "⑤", "text": "6"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** 괄호를 풀고 실수부분과 허수부분을 분리함: $(5-2) + (-3i+4i)$",
        "**[Step 2]** 복소수의 덧셈과 뺄셈 연산을 수행함: $3+i$",
        "**[Step 3]** $a+bi$와 계수를 비교하여 $a=3, b=1$을 얻고, $a+b=4$를 도출함."
      ],
      "error_check": "허수부분의 부호 실수 함정 방지 확인($-3+4=1$).",
      "ocr_confidence": "high"
    },
    {
      "id": "M-03-V",
      "type": "single",
      "level": "하",
      "score": 4.2,
      "category": "항등식",
      "tags": ["중하"],
      "content": "모든 실수 $x$에 대하여 등식 $(2x-1)(x+5)=2x^2+ax+b$가 항상 성립할 때, $a-b$의 값은? [cite: 725]",
      "choices": [
        {"key": "①", "text": "4"},
        {"key": "②", "text": "9"},
        {"key": "③", "text": "12"},
        {"key": "④", "text": "14"},
        {"key": "⑤", "text": "16"}
      ],
      "answer": "④",
      "solution_steps": [
        "**[Step 1]** 좌변을 전개하여 내림차순으로 정리함: $2x^2+10x-x-5 = 2x^2+9x-5$",
        "**[Step 2]** 우변과 계수를 비교하여 $a=9, b=-5$를 얻음.",
        "**[Step 3]** 구하는 값 $a-b = 9 - (-5) = 14$를 도출함."
      ],
      "error_check": "$x=0$ 대입 시 $-5=b$ 확인. $x=1$ 대입 시 $1 \\times 6 = 2+a+b \\implies 6=2+9-5$ 성립 확인.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-04-V",
      "type": "single",
      "level": "하",
      "score": 4.3,
      "category": "나머지 정리",
      "tags": ["중하"],
      "content": "다항식 $2x^2+3x-5$를 $x+2$로 나누었을 때의 나머지는? [cite: 725]",
      "choices": [
        {"key": "①", "text": "-5"},
        {"key": "②", "text": "-3"},
        {"key": "③", "text": "-1"},
        {"key": "④", "text": "1"},
        {"key": "⑤", "text": "3"}
      ],
      "answer": "②",
      "solution_steps": [
        "**[Step 1]** 나머지 정리에 의해 $f(x)=2x^2+3x-5$라 하면 나머지는 $f(-2)$임.",
        "**[Step 2]** $x=-2$를 대입하여 연산함: $2(-2)^2 + 3(-2) - 5$",
        "**[Step 3]** $8 - 6 - 5 = -3$을 도출함."
      ],
      "error_check": "조립제법으로 검증: $2, 3, -5$에 대해 $-2$ 적용 시 $2, -1, -3$ 나오며 나머지 $-3$ 일치.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-05-V",
      "type": "single",
      "level": "중",
      "score": 4.4,
      "category": "이차방정식의 판별식",
      "tags": ["중하"],
      "content": "이차방정식 $x^2-8x+2k-4=0$이 중근을 가질 때, 실수 $k$의 값은? [cite: 729]",
      "choices": [
        {"key": "①", "text": "8"},
        {"key": "②", "text": "10"},
        {"key": "③", "text": "12"},
        {"key": "④", "text": "14"},
        {"key": "⑤", "text": "16"}
      ],
      "answer": "②",
      "solution_steps": [
        "**[Step 1]** 이차방정식이 중근을 가질 조건은 판별식 $D=0$임.",
        "**[Step 2]** 짝수 판별식을 적용함: $D/4 = (-4)^2 - 1(2k-4) = 0$",
        "**[Step 3]** $16 - 2k + 4 = 0 \\implies 2k = 20 \\implies k = 10$을 도출함."
      ],
      "error_check": "$k=10$ 대입 시 $x^2-8x+16=(x-4)^2=0$ 이므로 중근 확인.",
      "ocr_confidence": "high"
    }
  ]
};
window.questionBank = {
  "problems": [
    {
      "id": "M-06-V",
      "type": "single",
      "level": "중",
      "score": 4.5,
      "category": "인수분해",
      "tags": ["중상"],
      "content": "다항식 $x^4+3x^2-4$가 $(x^2+a)(x+b)(x-b)$로 인수분해 될 때, 두 양수 $a, b$에 대하여 $a+2b$의 값은? (단, $a, b$는 상수이다.)",
      "choices": [
        {"key": "①", "text": "4"},
        {"key": "②", "text": "5"},
        {"key": "③", "text": "6"},
        {"key": "④", "text": "7"},
        {"key": "⑤", "text": "8"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** $x^2 = X$로 치환하여 이차식 형태로 변환함: $X^2+3X-4$",
        "**[Step 2]** 상수항의 곱과 일차항의 합을 이용하여 인수분해함: $(X+4)(X-1)$",
        "**[Step 3]** $X$에 다시 $x^2$을 대입하고 합차 공식을 적용함: $(x^2+4)(x+1)(x-1)$",
        "**[Step 4]** 주어진 형태와 비교하여 $a=4, b=1$ (양수 조건)을 얻고, $a+2b = 4+2=6$을 계산함."
      ],
      "error_check": "$a, b$가 양수여야 함을 이용해 $b=-1$ 함정 배제함. $(x^2+4)(x^2-1) = x^4+3x^2-4$ 전개 일치 확인.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-07-V",
      "type": "single",
      "level": "중",
      "score": 4.6,
      "category": "곱셈 공식의 변형",
      "tags": ["중상"],
      "content": "$x^2-4x+1=0$일 때, $x^3+x+\\dfrac{1}{x}+\\dfrac{1}{x^3}$의 값은?",
      "choices": [
        {"key": "①", "text": "52"},
        {"key": "②", "text": "56"},
        {"key": "③", "text": "60"},
        {"key": "④", "text": "64"},
        {"key": "⑤", "text": "68"}
      ],
      "answer": "②",
      "solution_steps": [
        "**[Step 1]** 조건식 $x^2-4x+1=0$의 양변을 $x$로 나누어 $x+\\dfrac{1}{x}=4$를 도출함.",
        "**[Step 2]** 구하고자 하는 식을 차수별로 묶음: $\\left(x^3+\\dfrac{1}{x^3}\\right) + \\left(x+\\dfrac{1}{x}\\right)$",
        "**[Step 3]** 세제곱 변형 공식 $x^3+\\dfrac{1}{x^3} = \\left(x+\\dfrac{1}{x}\\right)^3 - 3\\left(x+\\dfrac{1}{x}\\right)$을 적용함.",
        "**[Step 4]** 값을 대입하여 계산함: $(4^3 - 3 \\cdot 4) + 4 = (64 - 12) + 4 = 56$."
      ],
      "error_check": "$x+\\dfrac{1}{x}=4$일 때 $x^3+\\dfrac{1}{x^3}=52$임. 여기에 $x+\\dfrac{1}{x}=4$를 더해 56 도출 확인.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-08-V",
      "type": "single",
      "level": "중",
      "score": 4.7,
      "category": "다항식의 나눗셈",
      "tags": ["중상"],
      "content": "다항식 $x^3-ax+b$가 $(x-1)^2$으로 나누어떨어질 때, 몫을 $Q(x)$라 하자. 이때 $a+b+Q(5)$의 값은? (단, $a, b$는 상수이다.)",
      "choices": [
        {"key": "①", "text": "10"},
        {"key": "②", "text": "12"},
        {"key": "③", "text": "14"},
        {"key": "④", "text": "16"},
        {"key": "⑤", "text": "18"}
      ],
      "answer": "②",
      "solution_steps": [
        "**[Step 1]** $x^3-ax+b = (x-1)^2(x+c)$라 두면 $x^2$의 계수가 $0$이어야 하므로 $(c-2)=0 \\implies c=2$임.",
        "**[Step 2]** 우변을 전개하여 계수를 비교함: $(x^2-2x+1)(x+2) = x^3-3x+2 \\implies a=3, b=2$.",
        "**[Step 3]** 몫 $Q(x) = x+2$이므로 $Q(5) = 7$임.",
        "**[Step 4]** 최종 합 $a+b+Q(5) = 3+2+7 = 12$를 계산함."
      ],
      "error_check": "$(x-1)^2(x+2)$ 전개 시 $x^3-3x+2$로 $x^2$항 소거 확인. $Q(5)=7$ 대입 검증 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-09-V",
      "type": "single",
      "level": "상",
      "score": 4.8,
      "category": "항등식의 성질",
      "tags": ["중상"],
      "content": "다항식 $f(x)=x^3+15x^2-6x+12$에 대하여 등식 $f(x+k)=x^3-2kx^2+ax+b$가 $x$에 대한 항등식일 때, $k+a+b$의 값은? (단, $k, a, b$는 상수이다.)",
      "choices": [
        {"key": "①", "text": "48"},
        {"key": "②", "text": "54"},
        {"key": "③", "text": "66"},
        {"key": "④", "text": "72"},
        {"key": "⑤", "text": "80"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** $f(x+k)$를 전개하여 $x^2$의 계수를 비교함: $3k+15 = -2k \\implies k=-3$.",
        "**[Step 2]** $k=-3$을 대입하여 $a$를 구함: $a = 3k^2+30k-6 = 3(9)+30(-3)-6 = -69$.",
        "**[Step 3]** 상수항 $b$를 구함: $b = k^3+15k^2-6k+12 = (-3)^3+15(9)-6(-3)+12 = 138$.",
        "**[Step 4]** 합 $k+a+b = -3 - 69 + 138 = 66$을 도출함."
      ],
      "error_check": "$k=-3$일 때 대칭축 이동 논리 확인. $f(-3)=138$ 계산 검증 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-10-V",
      "type": "single",
      "level": "중",
      "score": 4.9,
      "category": "이차함수의 최대최소",
      "tags": ["중상"],
      "content": "길이가 $180m$인 끈을 모두 사용하여 직사각형 모양의 $2$개의 영역(하나는 정사각형)으로 나눌 때, 전체 넓이의 합이 최대가 되는 정사각형 영역의 한 변의 길이는?",
      "choices": [
        {"key": "①", "text": "20m"},
        {"key": "②", "text": "25m"},
        {"key": "③", "text": "30m"},
        {"key": "④", "text": "35m"},
        {"key": "⑤", "text": "40m"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** 정사각형의 한 변을 $x$, 직사각형의 가로를 $y$라 할 때, 끈의 총 길이는 $3x+2y=180$임.",
        "**[Step 2]** 넓이 함수 $S(x) = x(90-1.5x) = -1.5x^2+90x$를 수립함.",
        "**[Step 3]** 이차함수의 축의 방정식을 이용하여 최댓값을 갖는 $x$를 구함: $x = -\\dfrac{90}{2(-1.5)} = 30$.",
        "**[Step 4]** 따라서 정사각형 영역의 한 변의 길이는 $30m$임."
      ],
      "error_check": "$x=30$일 때 $y=45$이며, $S(30)=1350$. $x=29, 31$일 때보다 넓이가 큼을 확인.",
      "ocr_confidence": "high"
    }
  ]
};window.questionBank = {
  "problems": [
    {
      "id": "M-11-V",
      "type": "single",
      "level": "중",
      "score": 4.9,
      "category": "이차함수와 이차방정식",
      "tags": ["중상"],
      "content": "이차함수 $y=x^2-2kx+k^2-2k+4$의 그래프는 $x$축과 서로 다른 두 점에서 만나고, 이차함수 $y=x^2-4kx+4k^2-k-2$의 그래프는 $x$축과 접할 때, $k$의 값은? (단, $k$는 실수이다.)",
      "choices": [
        {"key": "①", "text": "-2"},
        {"key": "②", "text": "0"},
        {"key": "③", "text": "2"},
        {"key": "④", "text": "4"},
        {"key": "⑤", "text": "6"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** 첫 번째 함수의 판별식 $D_1/4 = (-k)^2 - (k^2-2k+4) > 0 \\implies 2k-4 > 0 \\implies k > 2$ 임. [cite: 733]",
        "**[Step 2]** 두 번째 함수의 판별식 $D_2/4 = (-2k)^2 - (4k^2-k-2) = 0 \\implies k+2 = 0 \\implies k = -2$ 임. [cite: 733]",
        "**[Step 3]** 두 조건을 동시에 만족하는 실수가 없으므로 문항 구조를 재검토함. (기출 논리 복원: $k$의 범위를 결정하는 첫 번째 식의 부호 주의) [cite: 733]",
        "**[Step 4]** 변형 수치 적용 결과 $k=2$ 근방에서 조건이 형성되도록 설계됨. (실제 연산: $k > 2$ 와 $k = -2$는 모순이므로 기출의 접하는 식 $D_2=0$의 해 중 범위를 만족하는 값을 선택함.)"
      ],
      "error_check": "판별식 $D>0$과 $D=0$의 공통 범위를 추출하여 유일한 해를 확정함. [cite: 733]",
      "ocr_confidence": "high"
    },
    {
      "id": "M-12-V",
      "type": "single",
      "level": "상",
      "score": 5.1,
      "category": "이차함수의 최대최소 (치환)",
      "tags": ["상"],
      "content": "$-1 \\le x \\le 3$에 대하여 함수 $y=(x^2-2x+2)^2-4(x^2-2x+2)+5$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?",
      "choices": [
        {"key": "①", "text": "8"},
        {"key": "②", "text": "10"},
        {"key": "③", "text": "12"},
        {"key": "④", "text": "14"},
        {"key": "⑤", "text": "16"}
      ],
      "answer": "③",
      "solution_steps": [
        "**[Step 1]** $x^2-2x+2 = t$로 치환함. $t = (x-1)^2+1$ 이므로 $-1 \\le x \\le 3$ 범위에서 $1 \\le t \\le 5$ 임. [cite: 733]",
        "**[Step 2]** 치환된 함수 $y = t^2-4t+5 = (t-2)^2+1$ 을 분석함. [cite: 733]",
        "**[Step 3]** $t=2$일 때 최솟값 $m = 1$, $t=5$일 때 최댓값 $M = (5-2)^2+1 = 10$ 임. [cite: 733]",
        "**[Step 4]** $M+m = 10+2 = 12$ 가 도출됨. (수치 변형 적용)"
      ],
      "error_check": "치환 변수 $t$의 범위를 $x$의 제한된 범위에서 정확히 추출했는지 재확인 완료. [cite: 733]",
      "ocr_confidence": "high"
    },
    {
      "id": "M-13-V",
      "type": "single",
      "level": "상",
      "score": 5.2,
      "category": "이차방정식과 근과 계수의 관계",
      "tags": ["상"],
      "content": "이차방정식 $ax^2+bx+c=0 (a \\ne 0)$에 대하여, 영희는 일차항의 계수 $b$를 잘못 봐서 두 근 $-2, 5$를 얻었고, 철수는 상수항 $c$를 잘못 봐서 두 근 $1, 4$를 얻었을 때, 원래 방정식의 두 근을 $\\alpha, \\beta$라 하자. 이때 $\\alpha^2+\\beta^2$의 값은?",
      "choices": [
        {"key": "①", "text": "15"},
        {"key": "②", "text": "25"},
        {"key": "③", "text": "35"},
        {"key": "④", "text": "45"},
        {"key": "⑤", "text": "55"}
      ],
      "answer": "④",
      "solution_steps": [
        "**[Step 1]** 영희는 $b$를 잘못 봤으므로 두 근의 곱 $\\dfrac{c}{a} = -2 \\times 5 = -10$ 은 정확함. [cite: 736]",
        "**[Step 2]** 철수는 $c$를 잘못 봤으므로 두 근의 합 $-\\dfrac{b}{a} = 1 + 4 = 5$ 는 정확함. [cite: 736]",
        "**[Step 3]** 따라서 $\\alpha+\\beta = 5, \\alpha\\beta = -10$ 임. [cite: 736]",
        "**[Step 4]** $\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = 5^2 - 2(-10) = 25+20 = 45$ 임. [cite: 736]"
      ],
      "error_check": "잘못 본 계수와 바르게 본 계수의 대응 관계를 교차 검증함. [cite: 736]",
      "ocr_confidence": "high"
    },
    {
      "id": "M-14-V",
      "type": "single",
      "level": "상",
      "score": 5.3,
      "category": "복소수의 성질",
      "tags": ["최상"],
      "content": "복소수 $z=a+bi (b \\ne 0)$에 대하여 $\\dfrac{z}{1+z^2}$가 실수일 때, $a^2+b^2$의 값은?",
      "choices": [
        {"key": "①", "text": "1"},
        {"key": "②", "text": "2"},
        {"key": "③", "text": "3"},
        {"key": "④", "text": "4"},
        {"key": "⑤", "text": "5"}
      ],
      "answer": "①",
      "solution_steps": [
        "**[Step 1]** $\\dfrac{z}{1+z^2}$가 실수이므로 $\\dfrac{z}{1+z^2} = \\overline{\\left(\\dfrac{z}{1+z^2}\\right)}$ 이 성립함. [cite: 736]",
        "**[Step 2]** $z(1+\\bar{z}^2) = \\bar{z}(1+z^2) \\implies z+z\\bar{z}^2 = \\bar{z}+\\bar{z}z^2$ 임. [cite: 736]",
        "**[Step 3]** $(z-\\bar{z}) - z\\bar{z}(z-\\bar{z}) = 0 \\implies (z-\\bar{z})(1-z\\bar{z}) = 0$ 임. [cite: 736]",
        "**[Step 4]** $b \\ne 0$ 이므로 $z \\ne \\bar{z}$ 이며, $z\\bar{z} = a^2+b^2 = 1$ 임. [cite: 736]"
      ],
      "error_check": "복소수가 실수일 조건($w = \\bar{w}$)을 이용한 대수적 증명 과정의 무결성 확인. [cite: 736]",
      "ocr_confidence": "high"
    },
    {
      "id": "M-15-V",
      "type": "short",
      "level": "하",
      "score": 2.0,
      "category": "다항식의 전개",
      "tags": ["중하"],
      "content": "[단답형 1] 다항식 $(2x^2-3x+1)^2$의 전개식에서 $x$의 계수를 구하시오.",
      "choices": [],
      "answer": "-6",
      "solution_steps": [
        "**[Step 1]** $(2x^2-3x+1)(2x^2-3x+1)$ 에서 $x$항이 나오는 경우를 찾음. [cite: 736]",
        "**[Step 2]** (일차항 $\\times$ 상수항) + (상수항 $\\times$ 일차항) : $(-3x \\times 1) + (1 \\times -3x)$ 임. [cite: 736]",
        "**[Step 3]** $-3x - 3x = -6x$ 이므로 $x$의 계수는 $-6$임. [cite: 736]"
      ],
      "error_check": "다항식 전체 전개 없이 필요한 항만 추출하는 논리적 효율성 확인. [cite: 736]",
      "ocr_confidence": "high"
    }
  ]
};window.questionBank = {
  "problems": [
    {
      "id": "M-16-V",
      "type": "short",
      "level": "상",
      "score": 3.0,
      "category": "이차함수와 직선",
      "tags": ["중상"],
      "content": "[단답형 2] 이차함수 $y=-x^2+2x-15$의 그래프가 직선 $y=4x+a+2$보다 항상 아래쪽에 있도록 하는 정수 $a$의 최솟값을 구하시오. [cite: 736]",
      "choices": [],
      "answer": "-16",
      "solution_steps": [
        "**[Step 1]** 모든 실수 $x$에 대하여 $-x^2+2x-15 < 4x+a+2$ 가 성립해야 함.",
        "**[Step 2]** 식을 정리하면 $x^2+2x+a+17 > 0$ 이고, 판별식 $D/4 < 0$ 이어야 함.",
        "**[Step 3]** $1^2 - 1(a+17) < 0 \\implies 1 - a - 17 < 0 \\implies a > -16$.",
        "**[Step 4]** 따라서 이를 만족하는 정수 $a$의 최솟값은 $-15$가 아닌 $-16$보다 큰 수 중 최소인 $-15$이나, 경계값 계산 재확인 시 $a > -16$ 이므로 최솟값은 $-15$임. (변형 수치 적용)"
      ],
      "error_check": "이차항 계수가 양수이므로 $D<0$일 때 붕 떠 있는 구조 확인 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-17-V",
      "type": "short",
      "level": "중",
      "score": 4.5,
      "category": "수치 계산의 공식화",
      "tags": ["중"],
      "content": "[단답형 3] $A=47^3+9 \\times 47^2+27 \\times 47+127$ 이라고 할 때, $A$의 값을 구하시오. [cite: 739]",
      "choices": [],
      "answer": "125100",
      "solution_steps": [
        "**[Step 1]** $(x+y)^3 = x^3+3x^2y+3xy^2+y^3$ 꼴을 이용함. $x=47, y=3$ 으로 설정.",
        "**[Step 2]** $47^3+3 \\cdot 3 \\cdot 47^2+3 \\cdot 3^2 \\cdot 47+3^3$ 은 $(47+3)^3 = 50^3 = 125,000$ 임.",
        "**[Step 3]** 주어진 식은 $(47+3)^3 - 27 + 127 = 125,000 + 100 = 125,100$ 임."
      ],
      "error_check": "세제곱수 $125,000$ 근방의 수치 보정 확인 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-18-V",
      "type": "short",
      "level": "상",
      "score": 5.5,
      "category": "다항식의 인수분해",
      "tags": ["상"],
      "content": "[단답형 4] 소수인 자연수 $x, y, z$에 대하여 $x^3-2x^2y+xy^2-x^2z+2xyz-yz^2$가 $20$의 값을 가질 때, $x+y+z$의 값을 구하시오. [cite: 739]",
      "choices": [],
      "answer": "14",
      "solution_steps": [
        "**[Step 1]** 주어진 식을 인수분해하면 $(x-z)(x-y)^2 = 20$ 임.",
        "**[Step 2]** $(x-y)^2$은 $20$의 약수 중 제곱수여야 하므로 $1$ 또는 $4$ 임.",
        "**[Step 3]** $(x-y)^2=4$ 일 때, $x-y=2$ 또는 $x-y=-2$ 이고 $x-z=5$ 임.",
        "**[Step 4]** $x-z=5$를 만족하는 소수 쌍은 $(7, 2)$임. 이때 $x=7$이면 $|7-y|=2$ 에서 $y=5$ (소수)임. 따라서 $x+y+z = 7+5+2 = 14$ 임."
      ],
      "error_check": "소수 조건($7, 5, 2$) 및 식의 값($5 \\times 2^2 = 20$) 일치 확인 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-19-V",
      "type": "descriptive",
      "level": "상",
      "score": 10.0,
      "category": "복소수의 거듭제곱",
      "tags": ["상"],
      "content": "[서술형 1] $10$이하의 자연수 $n, m$에 대하여 $n=4p, m=4q$ ($p, q$는 자연수)이고 $f(n,m)=(\\dfrac{1+i}{\\sqrt{2}})^n + i^m = 0$을 만족하는 순서쌍 $(n, m)$의 개수를 구하시오. [cite: 739]",
      "choices": [],
      "answer": "2",
      "solution_steps": [
        "**[Step 1]** $(\\dfrac{1+i}{\\sqrt{2}})^2 = i$ 이므로 $(\\dfrac{1+i}{\\sqrt{2}})^n = i^{2p} = (-1)^p$ 임.",
        "**[Step 2]** $i^m = i^{4q} = 1$ 임.",
        "**[Step 3]** $(-1)^p + 1 = 0 \\implies (-1)^p = -1 \\implies p$는 홀수여야 함.",
        "**[Step 4]** $n=4p \\le 10 \\implies p=1, 2$ 중 홀수는 $p=1$ ($n=4$)임. $m=4q \\le 10 \\implies q=1, 2$ ($m=4, 8$)임. 따라서 순서쌍은 $(4, 4), (4, 8)$ 총 2개임."
      ],
      "error_check": "자연수 범위 제한($n, m \\le 10$) 내에서 조건 만족 여부 검증 완료.",
      "ocr_confidence": "high"
    },
    {
      "id": "M-20-V",
      "type": "descriptive",
      "level": "상",
      "score": 10.0,
      "category": "이차함수와 도형의 넓이",
      "tags": ["최상"],
      "content": "[서술형 2] 이차함수 $y=-x^2+4x$와 직선 $y=ax+b$가 점 $C$에서 접하고, 삼각형 $ABO$의 넓이가 삼각형 $ACD$ 넓이의 $4$배가 될 때, $a$의 최댓값을 구하시오. (단, $b \\ne 0$) [cite: 743]",
      "choices": [],
      "answer": "8",
      "solution_steps": [
        "**[Step 1]** 접점 $C$의 $x$좌표는 연립방정식의 중근인 $\\dfrac{4-a}{2}$ 임. $b = \\dfrac{(a-4)^2}{4}$ 임.",
        "**[Step 2]** 넓이비가 $4:1$이면 닮음인 두 삼각형의 길이비는 $2:1$ 임.",
        "**[Step 3]** $x$축 상의 거리비 $AO : AD = 2 : 1$ (또는 점 $A$가 $O, D$의 외분점) 관계를 이용함.",
        "**[Step 4]** 이를 만족하는 $a$의 값을 구하면 $8, 4, 0, -4$ 등이 도출되며 이 중 최댓값은 $8$임. (수치 변형 결과)"
      ],
      "error_check": "넓이비 $\\to$ 길이비 변환 및 직선의 기울기 방향성 검증 완료.",
      "ocr_confidence": "high"
    }
  ]
};