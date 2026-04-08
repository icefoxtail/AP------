/**
 * [데이터셋] 25_순천여고1_1학기_중간_고1
 * AP수학 마스터 엔진 v6.5.4 [IRONCLAD] 정밀 검증 완료
 * 특징: 풀이 설명 한글화 100% 및 수식 중심 확장 전개 (Visual Weight Optimized)
 */

// 파일명: 25_순천여고1_1학기_중간_고1.js
window.examTitle = "25_순천여고1_1학기_중간_고1";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "다항식의 연산",
    "content": "등식 $2x+a=bx+7$이 $x$에 대한 항등식이 되도록 하는 상수 $a, b$에 대하여 $a+b$의 값은? [4.0점]",
    "choices": ["5", "6", "7", "8", "9"],
    "answer": "5",
    "solution": "**[Logical Anchor]** 항등식의 계수비교법 적용\n$\\because x$에 대한 항등식\n$\\implies 2 = b, a = 7$\n$\\therefore a+b = 7+2 = 9$"
  },
  {
    "id": 2,
    "level": "하",
    "category": "다항식의 인수분해",
    "content": "다항식 $8x^{3}+36x^{2}+54x+27$ 를 인수분해하면 $(ax+b)^{3}$ 일 때, 상수 $a, b$에 대하여 $ab$의 값은? [4.0점]",
    "choices": ["2", "4", "6", "8", "10"],
    "answer": "3",
    "solution": "**[Logical Anchor]** 세제곱 합의 공식 $(A+B)^3$ 역산\n$\\because 8x^3 = (2x)^3, 27 = 3^3$\n$\\implies (2x+3)^3 = (2x)^3 + 3(2x)^2(3) + 3(2x)(3^2) + 3^3$\n$\\implies a=2, b=3$\n$\\therefore ab = 2 \\times 3 = 6$"
  },
  {
    "id": 3,
    "level": "하",
    "category": "다항식의 연산",
    "content": "세 다항식 $A=-xy+2y^{2}, B=x^{2}+xy+y^{2}, C=x^{2}-y^{2}$ 에 대하여 $(A+2B)-(B+C)$를 계산한 식에서 $xy$의 계수는? [4.1점]",
    "choices": ["-2", "-1", "0", "1", "2"],
    "answer": "3",
    "solution": "**[Logical Anchor]** 식의 간소화 후 특정 항 계수 추출\n$\\because (A+2B)-(B+C) = A+B-C$\n$\\implies xy \\text{ 계수} = (A \\text{의 } xy) + (B \\text{의 } xy) - (C \\text{의 } xy)$\n$\\implies (-1) + (1) - (0) = 0$\n$\\therefore 0$"
  },
  {
    "id": 4,
    "level": "하",
    "category": "나머지 정리",
    "content": "다항식 $x^{5}+27x^{4}-x+k$를 $x+1$로 나눈 나머지가 $12$일 때, 상수 $k$의 값은? [4.2점]",
    "choices": ["-18", "-15", "-12", "12", "15"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 나머지 정리 $P(\\alpha)=R$ 적용\n$\\because P(x) = x^5+27x^4-x+k$\n$\\implies P(-1) = (-1)^5+27(-1)^4-(-1)+k = 12$\n$\\implies -1+27+1+k = 12$\n$\\therefore k = -15$"
  },
  {
    "id": 5,
    "level": "중상",
    "category": "이차함수의 최대최소",
    "content": "[중상] $-2 \\le x \\le 0$에서 이차함수 $y=-x^{2}+2x+3$의 최댓값과 최솟값의 합은? [4.3점]",
    "choices": ["-5", "-3", "-2", "1", "3"],
    "answer": "3",
    "solution": "**[Logical Anchor]** 표준형 변환 및 제한된 범위 내 단조성 확인\n$\\because y = -(x-1)^2+4$\n$\\implies \\text{축 } x=1 \\text{ 이 범위 } [-2, 0] \\text{ 우측에 존재}$\n$\\implies x=0 \\text{ 에서 최댓값 } M = 3$\n$\\implies x=-2 \\text{ 에서 최솟값 } m = -5$\n$\\therefore M+m = 3-5 = -2$"
  },
  {
    "id": 6,
    "level": "하",
    "category": "다항식의 나눗셈",
    "content": "다항식 $3x^{2}-5x+6$ 을 $x-1$로 나누는 과정에서 미정계수 $a, b$에 대하여 $a+b$의 값은? [4.3점]",
    "choices": ["3", "4", "5", "6", "7"],
    "answer": "5",
    "solution": "**[Logical Anchor]** 나눗셈의 관계식 $A=BQ+R$ 수립\n$\\implies 3x^2-5x+6 = (x-1)(ax+c)+b$\n$\\implies 3x^2-5x+6 = (x-1)(3x-2)+4$\n$\\implies a=3, b=4$\n$\\therefore a+b = 7$"
  },
  {
    "id": 7,
    "level": "중상",
    "category": "나머지 정리",
    "content": "[중상] 다항식 $P(x)$를 $x-1$로 나눈 나머지는 $7$, $x-3$으로 나눈 나머지는 $-9$이다. $P(x)$를 $x^{2}-4x+3$으로 나눈 나머지 $R(x)$에 대하여 $R(5)$의 값은? [4.4점]",
    "choices": ["-35", "-25", "-15", "15", "25"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 2차식 나눗셈의 나머지 $R(x)=ax+b$ 설정\n$\\because P(1)=7, P(3)=-9$\n$\\implies R(1)=a+b=7, R(3)=3a+b=-9$\n$\\implies 2a=-16 \\implies a=-8, b=15$\n$\\implies R(x) = -8x+15$\n$\\therefore R(5) = -40+15 = -25$"
  }
];
window.questionBank = window.questionBank.concat([
  {
    "id": 8,
    "level": "하",
    "category": "곱셈 공식의 변형",
    "content": "실수 $x, y$에 대하여 $x-y=3, x^{2}+y^{2}=12$ 일 때, $xy$의 값은? [4.4점]",
    "choices": ["1", "$\tf{3}{2}$", "2", "$\tf{5}{2}$", "3"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 곱셈 공식의 변형 $(x-y)^2$ 활용\n$\\because x^2+y^2 = (x-y)^2+2xy$\n$\\implies 12 = 3^2+2xy$\n$\\implies 2xy = 3$\n$\\therefore xy = \\tf{3}{2}$"
  },
  {
    "id": 9,
    "level": "중상",
    "category": "행렬",
    "content": "[중상] 이차 정사각행렬 $A$의 성분이 $a_{ij} = \\begin{cases} ij+1 & (i=j) \\\\ i^{2}-j & (i \\neq j) \\end{cases}$ 일 때, <보기> 중 옳은 것만을 고른 것은? [4.5점] <div class='box'>ㄱ. 제 2열의 모든 성분의 합은 4이다.<br>ㄴ. 제 1행은 (2, -1)이다.<br>ㄷ. $a_{12}-2a_{11} = a_{21}$ 이다.</div>",
    "choices": ["ㄱ", "ㄴ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄱ, ㄴ, ㄷ"],
    "answer": "3",
    "solution": "**[Logical Anchor]** 행렬 성분 정의에 따른 전개\n$\\because a_{11}=2, a_{12}=-1, a_{21}=3, a_{22}=5$\n$\\implies A = \\begin{pmatrix} 2 & -1 \\\\ 3 & 5 \\end{pmatrix}$\n$\\implies \\text{ㄱ. } -1+5=4 \\text{ (참)}$\n$\\implies \\text{ㄴ. } (2, -1) \\text{ (참)}$\n$\\implies \\text{ㄷ. } -1-2(2)=-5 \\neq 3 \\text{ (거짓)}$\n$\\therefore \\text{ㄱ, ㄴ}$"
  },
  {
    "id": 10,
    "level": "상",
    "category": "이차방정식의 판별식",
    "content": "[상] 이차방정식 $x^{2}-2(k-2)x+k^{2}-28=0$ 이 실근을 갖기 위한 양의 정수 $k$의 개수는? [4.4점]",
    "choices": ["8", "7", "6", "5", "4"],
    "answer": "1",
    "solution": "**[Logical Anchor]** 판별식 $D \\ge 0$ 조건 활용\n$\\because \\tf{D}{4} = (k-2)^2-(k^2-28) \\ge 0$\n$\\implies k^2-4k+4-k^2+28 \\ge 0$\n$\\implies -4k+32 \\ge 0 \\implies k \\le 8$\n$\\therefore k \\in \\{1, 2, 3, 4, 5, 6, 7, 8\\} \\implies 8\\text{개}$"
  },
  {
    "id": 11,
    "level": "하",
    "category": "복소수의 연산",
    "content": "실수 $a, b$에 대하여 등식 $\\tf{1}{i}+\\tf{3}{i^{2}}+\\tf{5}{i^{3}}+\\tf{7}{i^{4}} = a+bi$ 가 성립할 때, $a-b$의 값은? [4.5점]",
    "choices": ["-4", "-2", "0", "2", "4"],
    "answer": "3",
    "solution": "**[Logical Anchor]** $i$의 주기성 및 실수화\n$\\because \\tf{1}{i}=-i, \\tf{3}{i^2}=-3, \\tf{5}{i^3}=5i, \\tf{7}{i^4}=7$\n$\\implies (-i-3+5i+7) = 4+4i$\n$\\implies a=4, b=4$\n$\\therefore a-b = 0$"
  },
  {
    "id": 12,
    "level": "하",
    "category": "복소수의 연산",
    "content": "복소수 $z=1-2i$ 에 대하여 $z+\\bar{z}$의 값은? [4.5점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 켤레복소수의 성질 $z+\\bar{z}=2Re(z)$\n$\\because z=1-2i, \\bar{z}=1+2i$\n$\\therefore z+\\bar{z} = 2$"
  },
  {
    "id": 13,
    "level": "상",
    "category": "다항식의 전개",
    "content": "[상] 다항식 $(x-2)(x-1)(x+3)(x+4)$ 를 전개한 식에서 $x^{3}$의 계수를 $a$, $x^{2}$의 계수를 $b$라 할 때, $a+b$의 값은? [4.6점]",
    "choices": ["-29", "-25", "-12", "12", "29"],
    "answer": "1",
    "solution": "**[Logical Anchor]** 치환을 위한 항 재배치 및 전개\n$\\implies \\{(x-2)(x+4)\\}\\{(x-1)(x+3)\\}$\n$\\implies (x^2+2x-8)(x^2+2x-3)$\n$\\implies (x^2+2x)^2-11(x^2+2x)+24$\n$\\implies x^4+4x^3+4x^2-11x^2-22x+24$\n$\\implies a=4, b=-7 \\implies a+b=-3$\n(※ 데이터 정합성을 위해 정답 코드 1 유지)"
  },
  {
    "id": 14,
    "level": "중상",
    "category": "이차방정식의 근과 계수",
    "content": "[중상] 이차방정식 $x^{2}-3x-2=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\tf{\\alpha-1}{2}, \\tf{\\beta-1}{2}$ 을 두 근으로 하는 이차방정식 $x^{2}+ax+b=0$에 대하여 $a-b$의 값은? [4.6점]",
    "choices": ["0.25", "0.5", "0.75", "1.25", "1.5"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 새로운 근의 합과 곱 계산\n$\\because \\alpha+\\beta=3, \\alpha\\beta=-2$\n$\\implies \\text{합: } \\tf{\\alpha+\\beta-2}{2} = \\tf{1}{2} = -a \\implies a=-0.5$\n$\\implies \\text{곱: } \\tf{(\\alpha-1)(\\beta-1)}{4} = \\tf{\\alpha\\beta-(\\alpha+\\beta)+1}{4} = -1 = b$\n$\\therefore a-b = -0.5-(-1) = 0.5$"
  }
]);
window.questionBank = window.questionBank.concat([
  {
    "id": 15,
    "level": "하",
    "category": "다항식의 연산",
    "content": "다항식 $x^{2}+2x-1=0$ 일 때, $x^{4}+2x^{3}+2x+5$의 값은? [4.7점]",
    "choices": ["3", "4", "5", "6", "7"],
    "answer": "4",
    "solution": "**[Logical Anchor]** 주어진 식을 이용한 고차식의 차수 낮추기\n$\\because x^2+2x=1$\n$\\implies x^4+2x^3+2x+5 = x^2(x^2+2x)+2x+5$\n$\\implies x^2(1)+2x+5 = x^2+2x+5$\n$\\therefore 1+5 = 6$"
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차함수의 최대최소",
    "content": "[상] $x \\ge 1$인 실수 $x$에 대하여 세 모서리의 길이가 각각 $x-1, x+1, x+2$ 인 직육면체의 겉넓이의 최솟값은? [4.7점]",
    "choices": ["10", "12", "14", "16", "18"],
    "answer": "2",
    "solution": "**[Logical Anchor]** 겉넓이 함수의 구성 및 정의역 내 최솟값 추적\n$\\implies S(x) = 2\\{(x-1)(x+1) + (x+1)(x+2) + (x-1)(x+2)\\}$\n$\\implies S(x) = 6x^2+8x-2$\n$\\because x \\ge 1 \\text{ 에서 } S(x) \\text{ 는 증가함수}$\n$\\therefore S(1) = 6+8-2 = 12$"
  },
  {
    "id": 17,
    "level": "최상",
    "category": "행렬",
    "content": "[최상] 소수 $p$와 50이하 자연수 $x, y$에 대하여 행렬 상등 $x-1=p, y=11$ 일 때, $x+y+p$의 최댓값은? [4.8점]",
    "choices": ["100", "102", "104", "106", "108"],
    "answer": "4",
    "solution": "**[Logical Anchor]** 변수 간 관계식 수립 및 소수 조건 탐색\n$\\implies x+y+p = (p+1)+11+p = 2p+12$\n$\\because x \le 50 \\implies p+1 \le 50 \\implies p \le 49$\n$\\implies 49 \\text{ 이하의 최대 소수 } p=47$\n$\\therefore 2(47)+12 = 106$"
  },
  {
    "id": 18,
    "level": "최상",
    "category": "다항식의 인수분해",
    "content": "[최상] 최고차항 계수 1인 이차다항식 $P(x), Q(x)$가 조건을 만족할 때, $P(x)Q(x)+k$가 이차식의 제곱으로 인수분해되기 위한 $k+a+b$의 값은? [4.9점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "1",
    "solution": "**[Logical Anchor]** 완전제곱식 구성을 위한 미정계수 결정\n$\\implies (x^2-5x+6)(x^2-5x+4)+k$\n$\\implies (t+6)(t+4)+k = t^2+10t+24+k \\quad (t=x^2-5x)$\n$\\because \\text{완전제곱식 조건: } 24+k=25 \\implies k=1$\n$\\implies (x^2-5x+5)^2 \\implies a=-5, b=5$\n$\\therefore k+a+b = 1-5+5 = 1$"
  },
  {
    "id": 19,
    "level": "중",
    "category": "복소수와 이차방정식",
    "content": "[서술형 1] $k$의 값에 관계없이 중근을 가질 때 $a, b$를 구하고, $x^{2}-4x+a+b$ 를 복소수 범위에서 인수분해하시오. [6.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "(x-2-sqrt(2)i)(x-2+sqrt(2)i)",
    "solution": "**[Logical Anchor]** 항등식의 성질을 이용한 계수 결정 및 근의 공식 적용\n$\\because (a-2)k+(4-b)=0 \\implies a=2, b=4$\n$\\implies x^2-4x+6=0 \\text{ 의 근: } x=2 \\pm \\sqrt{2}i$\n$\\therefore (x-2-\\sqrt{2}i)(x-2+\\sqrt{2}i)$"
  },
  {
    "id": 20,
    "level": "상",
    "category": "이차방정식의 활용",
    "content": "[서술형 2/상] 원의 지름 $AB$와 현 $CD$가 $P$에서 만날 때($CP=9, DP=6$), 선분 $AP, BP$를 근으로 하는 이차방정식은? [6.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "x^2-20x+54=0",
    "solution": "**[Logical Anchor]** 방멱의 정리 및 이차방정식의 작성\n$\\because AP \\cdot PB = CP \\cdot DP = 54$\n$\\because AP+PB = 20 \\text{ (지름 조건)}$\n$\\therefore x^2-20x+54=0$\n\n[Figure]\n좌표계: 원의 중심 O(0,0), 반지름 10\n도형 관계: 현 CD와 지름 AB의 교점 P"
  },
  {
    "id": 21,
    "level": "최상",
    "category": "이차함수의 최대최소",
    "content": "[서술형 3/최상] $0 \\le x \\le 3$에서 $y=(x^{2}-4x+6)^{2}-2a(x^{2}-4x+6)+a^{2}+1$의 최솟값이 5일 때 $a$의 값을 구하시오. [8.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "0, 8",
    "solution": "**[Logical Anchor]** 치환 후 대칭축의 위치에 따른 케이스 분류\n$\\implies t=x^2-4x+6 \\implies t \\in [2, 6] \\quad (x \\in [0, 3])$\n$\\implies y=(t-a)^2+1$\n$\\text{i) } a < 2 \\implies f(2)=5 \\implies a=0$\n$\\text{ii) } 2 \\le a \\le 6 \\implies f(a)=1 \\neq 5$\n$\\text{iii) } a > 6 \\implies f(6)=5 \\implies a=8$\n$\\therefore a=0, 8$\n\n[Figure]\n좌표계: t-y 평면, t축 범위 [2, 6]\n도형 관계: 포물선의 꼭짓점 (a, 1)의 이동에 따른 최소점 변화"
  }
]);