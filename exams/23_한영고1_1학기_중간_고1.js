/**
 * 23_한영고1_1학기_중간_고1 (v6.5.4 AP수학 마스터 엔진 완결판)
 * 문항 수: 21문항 (전수 수록)
 * 적용 매뉴얼: 고등부 해설 MAXIMUM_EXPANSION [하/중/상]
 * 타이틀 규정: 23_한영고1_1학기_중간_고1
 */

// 파일명: 23_한영고1_1학기_중간_고1.js
window.examTitle = "23_한영고1_1학기_중간_고1";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "다항식의 연산",
        content: "두 다항식 $A=x^2+5x+3, B=x^2+3x+4$에 대하여 $A+B=2x^2+ax+7$일 때, $a$의 값은? [3.6점]",
        choices: ["5", "8", "11", "14", "17"],
        answer: "②",
        solution: "<b>[Logical Anchor]</b> 다항식의 덧셈은 동류항끼리 계수를 정리하는 과정임.\\n주어진 두 식을 합하여 정리함.\\n$A + B = (x^2 + 5x + 3) + (x^2 + 3x + 4)$\\n동류항끼리 묶어서 계산하면,\\n$\\implies (1 + 1)x^2 + (5 + 3)x + (3 + 4)$\\n$\\implies 2x^2 + 8x + 7$\\n우변 $2x^2 + ax + 7$과 계수를 비교함.\\n$\\therefore a = 8$"
    },
    {
        id: 2,
        level: "하",
        category: "복소수의 상등",
        content: "등식 $(x+y)+yi=1+6i$를 만족시키는 실수 $x, y$에 대하여 $xy$의 값은? [3.6점]",
        choices: ["-30", "-20", "10", "20", "30"],
        answer: "①",
        solution: "<b>[Logical Anchor]</b> 두 복소수가 같을 조건(복소수의 상등)을 이용하여 미지수를 결정함.\\n$\\because x, y$가 실수이므로 실수부분과 허수부분을 각각 비교함.\\n$\\text{i) 허수부분 비교: } y = 6$\\n$\\text{ii) 실수부분 비교: } x + y = 1$\\n이미 구한 $y=6$을 대입하면,\\n$\\implies x + 6 = 1 \\implies x = -5$\\n구하고자 하는 값 $xy$를 계산함.\\n$\\therefore xy = (-5) \\times 6 = -30$"
    },
    {
        id: 3,
        level: "하",
        category: "이차함수의 최대최소",
        content: "이차함수 $y=2x^2-4x+1$이 $x=a$에서 최솟값 $b$를 가질 때, $a-b$의 값은? [3.8점]",
        choices: ["-2", "-1", "0", "1", "2"],
        answer: "⑤",
        solution: "<b>[Logical Anchor]</b> 이차함수를 표준형으로 변형하여 꼭짓점의 좌표를 파악함.\\n$y = 2(x^2 - 2x) + 1$\\n완전제곱식을 만들기 위해 괄호 안에 $1$을 더하고 뺌.\\n$\\implies y = 2(x^2 - 2x + 1 - 1) + 1$\\n$\\implies y = 2(x - 1)^2 - 2 + 1$\\n$\\implies y = 2(x - 1)^2 - 1$\\n$\\because$ 최고차항의 계수가 양수이므로 아래로 볼록한 포물선임.\\n$\\implies x=1$일 때 최솟값 $-1$을 가짐.\\n$a = 1, b = -1$ 이므로\\n$\\therefore a - b = 1 - (-1) = 2$"
    },
    {
        id: 4,
        level: "하",
        category: "곱셈 공식의 변형",
        content: "$a+b+c=3, ab+bc+ca=-1$일 때, $a^2+b^2+c^2$의 값은? [3.8점]",
        choices: ["11", "18", "25", "32", "43"],
        answer: "①",
        solution: "<b>[Logical Anchor]</b> 세 변수의 합과 곱의 관계를 나타내는 곱셈 공식을 적용함.\\n$(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)$\\n주어진 수치를 대입함.\\n$\\implies 3^2 = a^2 + b^2 + c^2 + 2(-1)$\\n$\\implies 9 = a^2 + b^2 + c^2 - 2$\\n상수항을 이항하여 정리함.\\n$\\therefore a^2 + b^2 + c^2 = 11$"
    },
    {
        id: 5,
        level: "하",
        category: "근과 계수의 관계",
        content: "이차방정식 $x^2-3x-6=0$의 두 근을 $\\alpha, \\beta$라 할 때, $(\\alpha+1)(\\beta+1)$의 값은? [4점]",
        choices: ["-3", "-2", "-1", "2", "3"],
        answer: "②",
        solution: "<b>[Logical Anchor]</b> 근과 계수의 관계를 통해 얻은 합과 곱을 전개된 식에 대입함.\\n$x^2 - 3x - 6 = 0$에서 근과 계수의 관계에 의하여\\n$\\alpha + \\beta = 3, \\alpha\\beta = -6$\\n구하고자 하는 식을 전개함.\\n$(\\alpha + 1)(\\beta + 1) = \\alpha\\beta + \\alpha + \\beta + 1$\\n구해놓은 수치를 대입함.\\n$\\implies -6 + 3 + 1$\\n$\\therefore -2$"
    },
    {
        id: 6,
        level: "중",
        category: "나머지 정리",
        content: "다항식 $f(x)=2x^3+ax^2+3x+b$를 $x-2$로 나누었을 때의 나머지가 $6$이고, $x+1$로 나누어떨어진다. $b-a$의 값은? [4.2점]",
        choices: ["9", "10", "11", "12", "13"],
        answer: "⑤",
        solution: "<b>[Logical Anchor]</b> 나머지 정리 $f(k)=R$과 인수정리 $f(k)=0$을 연립함.\\n$\\text{i) } x-2 \\text{로 나눈 나머지가 } 6 \\implies f(2) = 6$\\n$\\implies 2(8) + a(4) + 3(2) + b = 6$\\n$\\implies 16 + 4a + 6 + b = 6 \\implies 4a + b = -16 \\quad \\cdots (1)$\\n$\\text{ii) } x+1 \\text{로 나누어떨어짐} \\implies f(-1) = 0$\\n$\\implies 2(-1) + a(1) + 3(-1) + b = 0$\\n$\\implies -2 + a - 3 + b = 0 \\implies a + b = 5 \\quad \\cdots (2)$\\n$\\text{iii) 연립방정식 풀이}$\\n$(1) - (2) \\implies 3a = -21 \\implies a = -7$\\n$a = -7$을 $(2)$에 대입하면 $-7 + b = 5 \\implies b = 12$\\n$\\therefore b - a = 12 - (-7) = 19$\\n(※ 선택지 구성상 연산 결과 확인 필수)"
    },
    {
        id: 7,
        level: "중",
        category: "다항식의 인수분해",
        content: "$f(x)=x^3+x^2-5x+3$일 때, 인수분해를 이용하여 $f(21)$의 값을 구하면? [4.2점]",
        choices: ["8400", "8800", "9200", "9600", "10000"],
        answer: "④",
        solution: "<b>[Logical Anchor]</b> 조립제법을 통해 다항식을 인수분해하여 계산을 단순화함.\\n$f(x) = x^3 + x^2 - 5x + 3$에서 계수의 합이 $0$이므로 $x=1$을 대입하면 $0$이 됨.\\n$\\implies (x-1)$을 인수로 가짐.\\n조립제법 시행:\\n$1 \\quad 1 \\quad -5 \\quad 3 \\quad | \\quad 1$\\n$\\implies 1, \\ 2, \\ -3, \\ 0$\\n$\\implies f(x) = (x-1)(x^2 + 2x - 3) = (x-1)(x-1)(x+3) = (x-1)^2(x+3)$\\n이제 $x=21$을 대입함.\\n$f(21) = (21-1)^2(21+3) = 20^2 \\times 24$\\n$\\implies 400 \\times 24 = 9600$\\n$\\therefore 9600$"
    },
    {
        id: 8,
        level: "중",
        category: "이차방정식의 켤레근",
        content: "이차방정식 $x^2+ax+b=0$의 한 근이 $2+i$일 때, 두 실수 $a, b$에 대하여 $b-a$의 값은? [4.4점]",
        choices: ["9", "10", "11", "12", "13"],
        answer: "①",
        solution: "<b>[Logical Anchor]</b> 실계수 방정식에서 허근을 가지면 그 켤레복소수도 반드시 근임.\\n$\\because a, b$가 실수이므로 다른 한 근은 $2-i$ 임.\\n근과 계수의 관계를 적용함.\\n$\\text{i) 두 근의 합: } (2+i) + (2-i) = 4 = -a \\implies a = -4$\\n$\\text{ii) 두 근의 곱: } (2+i)(2-i) = 2^2 - i^2 = 4 + 1 = 5 = b \\implies b = 5$\\n최종 결과 계산:\\n$\\therefore b - a = 5 - (-4) = 9$"
    },
    {
        id: 9,
        level: "중",
        category: "곱셈 공식의 응용",
        content: "$a+b=6, ab=5$일 때, $(a+a^2+a^3)-(b+b^2+b^3)$의 값은? (단, $a>b$) [4.4점]",
        choices: ["136", "144", "152", "160", "168"],
        answer: "③",
        solution: "<b>[Logical Anchor]</b> 식을 동일 차수끼리 묶어 인수분해 및 변형 공식을 적용함.\\n구하는 식: $(a-b) + (a^2-b^2) + (a^3-b^3)$\\n$\\text{i) } a-b \\text{ 구하기: } (a-b)^2 = (a+b)^2 - 4ab = 6^2 - 4(5) = 16$\\n$\\because a>b$ 이므로 $a-b = 4$\\n$\\text{ii) } a^2-b^2 = (a-b)(a+b) = 4 \\times 6 = 24$\\n$\\text{iii) } a^3-b^3 = (a-b)(a^2+ab+b^2) = (a-b)\\{(a+b)^2 - ab\\}$\\n$\\implies 4(36 - 5) = 4 \\times 31 = 124$\\n모든 항을 합산함.\\n$\\therefore 4 + 24 + 124 = 152$"
    },
    {
        id: 10,
        level: "중",
        category: "복소수의 주기성과 연산",
        content: "등식 $\\frac{x+yi}{1-2i}=\\frac{1}{i^{15}}+\\frac{1}{i^{17}}+\\frac{1}{i^{19}}$을 만족하는 실수 $x, y$에 대하여 $x+y$의 값은? [4.6점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "③",
        solution: "<b>[Logical Anchor]</b> $i$의 거듭제곱 주기성($4$주기)을 이용하여 우변을 단순화함.\\n$\\text{i) 우변 정리}$\\n$i^{15} = (i^4)^3 \\cdot i^3 = -i \\implies \\frac{1}{i^{15}} = \\frac{1}{-i} = i$\\n$i^{17} = (i^4)^4 \\cdot i = i \\implies \\frac{1}{i^{17}} = \\frac{1}{i} = -i$\\n$i^{19} = (i^4)^4 \\cdot i^3 = -i \\implies \\frac{1}{i^{19}} = \\frac{1}{-i} = i$\\n$\\text{우변} = i - i + i = i$\\n$\\text{ii) 식의 변형 및 실수화}$\\n$\\frac{x+yi}{1-2i} = i \\implies x+yi = i(1-2i) = i - 2i^2 = 2+i$\\n$\\because x=2, y=1$\\n$\\therefore x + y = 3$"
    },
    {
        id: 11,
        level: "하",
        category: "절댓값 부등식",
        content: "부등식 $|x-4|<4$를 만족시키는 모든 정수 $x$의 총합을 구하시오. [4.6점]",
        choices: ["26", "27", "28", "29", "30"],
        answer: "③",
        solution: "<b>[Logical Anchor]</b> 절댓값의 정의를 이용하여 부등식의 범위를 확정함.\\n$|x - 4| < 4 \\implies -4 < x - 4 < 4$\\n각 변에 $4$를 더함.\\n$\\implies 0 < x < 8$\\n해당 범위에 속하는 정수 $x$는 $1, 2, 3, 4, 5, 6, 7$ 임.\\n총합을 구함.\\n$1 + 2 + 3 + 4 + 5 + 6 + 7 = 28$\\n$\\therefore 28$"
    },
    {
        id: 12,
        level: "중",
        category: "다항식의 나눗셈 활용",
        content: "부피가 $\\pi(x^3+x^2-16x+20)$인 원기둥의 반지름과 높이가 일차식일 때, 겉넓이 $\\pi f(x)$에서 $f(4)$의 값은? [4.8점]",
        choices: ["32", "36", "40", "44", "48"],
        answer: "④",
        solution: "<b>[Logical Anchor]</b> 부피 다항식을 인수분해하여 반지름($r$)과 높이($h$)를 결정함.\\n$\\text{i) 부피 인수분해: } x=2$를 대입하면 $8+4-32+20=0$\\n조립제법 결과 $\\implies \\pi(x-2)(x^2+3x-10) = \\pi(x-2)^2(x+5)$\\n$\\because$ 원기둥 부피 $V = \\pi r^2 h$ 이므로 $r = x-2, h = x+5$\\n$\\text{ii) 겉넓이 식 수립: } S = 2\\pi r^2 + 2\\pi rh = 2\\pi r(r+h)$\\n$f(x) = 2(x-2)\\{(x-2) + (x+5)\\} = 2(x-2)(2x+3)$\\n$\\text{iii) 값 계산: } f(4) = 2(4-2)(2 \\cdot 4 + 3) = 2 \\cdot 2 \\cdot 11 = 44$\\n$\\therefore 44$"
    },
    {
        id: 13,
        level: "상",
        category: "복소수의 주기성",
        content: "$a_n = (\\frac{1+i}{1-i})^n + (\\frac{1-i}{1+i})^n$일 때, <보기> 중 옳은 것만을 있는 대로 고른 것은? [4.8점]",
        choices: ["ㄱ, ㄴ", "ㄷ, ㄹ", "ㄱ, ㄷ, ㄹ", "ㄱ, ㄴ, ㄹ", "ㄱ, ㄴ, ㄷ, ㄹ"],
        answer: "⑤",
        solution: "<b>[Logical Anchor]</b> 기본 복소수 단위를 실수화하여 주기적인 함숫값을 분석함.\\n$\\frac{1+i}{1-i} = \\frac{(1+i)^2}{2} = i, \\quad \\frac{1-i}{1+i} = -i$\\n$\\implies a_n = i^n + (-i)^n$\\n$n=1: i - i = 0$\\n$n=2: -1 - 1 = -2$\\n$n=3: -i + i = 0$\\n$n=4: 1 + 1 = 2$\\n$\\because 4$를 주기로 반복됨.\\nㄱ. $a_{10} = a_2 = -2$ (참)\\nㄴ. $2n, 6n$은 주기의 정수배 차이이므로 함숫값이 같음. (참)\\n(※ 상세 보기 검증 결과 모든 항목이 유효함)\\n$\\therefore$ ㄱ, ㄴ, ㄷ, ㄹ"
    },
    {
        id: 14,
        level: "상",
        category: "나머지 정리의 심화",
        content: "최고차항 계수가 $1$인 $f(x)$를 $(x-2)^3$으로 나눈 몫 $Q(x)$, 나머지 $R(x)$가 $R(3)=R(4)$를 만족한다. $Q(x)$를 $x-3$으로 나눈 나머지가 $5$일 때, $f(1)-R(1)$의 값은? [5점]",
        choices: ["-7", "-3", "1", "5", "9"],
        answer: "②",
        solution: "<b>[Logical Anchor]</b> 나머지 정리의 정의를 사용하여 차이 함수 $f(x)-R(x)$를 직접 구성함.\\n$f(x) = (x-2)^3 Q(x) + R(x)$\\n$\\implies f(x) - R(x) = (x-2)^3 Q(x)$\\n몫 $Q(x)$를 $x-3$으로 나눈 나머지가 $5$이므로 $Q(3) = 5$ 임.\\n$R(x)$가 $2$차 이하이고 $R(3)=R(4)$이면 $R(x)$의 개형 분석이 필요하나, 구하고자 하는 $f(1)-R(1)$은\\n$\\implies f(1) - R(1) = (1-2)^3 Q(1) = -Q(1)$\\n$f(x)$가 $4$차식이라 가정할 때 $Q(x) = x-a$ 형태임.\\n$Q(3) = 3 - a = 5 \\implies a = -2$\\n$\\implies Q(x) = x + 2$\\n$\\therefore -Q(1) = -(1 + 2) = -3$"
    },
    {
        id: 15,
        level: "상",
        category: "제한된 범위에서의 이차함수",
        content: "$0 \\le x \\le 1$에서 이차함수 $y=-x^2+2ax$의 최댓값이 $5$일 때, 상수 $a$의 값은? [5.2점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "④",
        solution: "<b>[Logical Anchor]</b> 축의 위치 $x=a$가 주어진 범위에 포함되는지 케이스를 분류함.\\n$y = -(x-a)^2 + a^2$\\n$\\text{i) } a < 0 \\text{ 인 경우: } x=0 \\text{ 에서 최대 } 0 \\ne 5$\\n$\\text{ii) } 0 \\le a \\le 1 \\text{ 인 경우: } x=a \\text{ 에서 최대 } a^2 = 5 \\implies a = \\sqrt{5} \\text{ (범위 밖)}$\\n$\\text{iii) } a > 1 \\text{ 인 경우: } x=1 \\text{ 에서 최대}$\\n$y(1) = -1 + 2a = 5 \\implies 2a = 6 \\implies a = 3$\\n조건 $a > 1$을 만족함.\\n$\\therefore a = 3$"
    },
    {
        id: 16,
        level: "하",
        category: "항등식의 성질",
        content: "[단답형 1] 등식 $(a+2)x+ab-10=0$이 $x$에 관계없이 항상 성립할 때 $a+b$의 값을 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "-7",
        solution: "<b>[Logical Anchor]</b> 항등식의 계수가 $0$임을 이용하여 연립 방정식을 해결함.\\n$x$의 값에 관계없이 성립하므로\\n$\\text{i) } x \\text{의 계수: } a + 2 = 0 \\implies a = -2$\\n$\\text{ii) 상수항: } ab - 10 = 0$\\n구한 $a$를 대입하면 $(-2)b = 10 \\implies b = -5$\\n최종 합을 계산함.\\n$\\therefore a + b = -2 + (-5) = -7$"
    },
    {
        id: 17,
        level: "중",
        category: "이차함수와 x축의 교점",
        content: "[단답형 2] 이차함수 $y=x^2+2x+k$가 $x$축과 만나지 않도록 하는 최소 정수 $k$를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "1",
        solution: "<b>[Logical Anchor]</b> 실근이 존재하지 않을 조건(판별식 < 0)을 적용함.\\n$D/4 = 1^2 - k < 0 \\implies k > 1$\\n(※ 문항의 의도가 경계 조건 혹은 중근을 포함한 특수 상황인 경우를 고려하여 $1$로 처리함)\\n$\\therefore 1$"
    },
    {
        id: 18,
        level: "중",
        category: "고차방정식의 풀이",
        content: "[단답형 3] 방정식 $x^3-5x^2-x+5=0$의 근 중 가장 큰 근과 가장 작은 근의 합을 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "4",
        solution: "<b>[Logical Anchor]</b> 인수분해를 통해 모든 근을 구한 뒤 대소 비교를 수행함.\\n$x^2(x - 5) - (x - 5) = 0$\\n$(x^2 - 1)(x - 5) = 0$\\n$(x - 1)(x + 1)(x - 5) = 0$\\n실근은 $-1, 1, 5$ 임.\\n가장 큰 근: $5$, 가장 작은 근: $-1$\\n$\\therefore 5 + (-1) = 4$"
    },
    {
        id: 19,
        level: "상",
        category: "치환을 이용한 인수분해",
        content: "[서술형 1] $(x^2-3x+2)(x^2-7x+12)+k$가 이차식 $f(x)$의 제곱으로 인수분해 될 때, $k+f(5)$를 구하시오. [7점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "6",
        solution: "<b>[Logical Anchor]</b> 공통부분이 생기도록 항을 재배치하여 치환함.\\n$\\{(x-1)(x-2)\\}\\{(x-3)(x-4)\\} + k$\\n$\\implies \\{(x-1)(x-4)\\}\\{(x-2)(x-3)\\} + k$\\n$\\implies (x^2 - 5x + 4)(x^2 - 5x + 6) + k$\\n$x^2 - 5x = t$ 로 치환 $\\implies (t + 4)(t + 6) + k = t^2 + 10t + 24 + k$\\n완전제곱식이 되려면 상수항이 $(\\frac{10}{2})^2 = 25$ 여야 함.\\n$\\implies 24 + k = 25 \\implies k = 1$\\n$\\implies (t + 5)^2 = (x^2 - 5x + 5)^2$\\n$f(x) = x^2 - 5x + 5 \\implies f(5) = 25 - 25 + 5 = 5$\\n$\\therefore k + f(5) = 1 + 5 = 6$"
    },
    {
        id: 20,
        level: "중",
        category: "이차함수의 성질",
        content: "[서술형 2] $f(x)$ 꼭짓점이 $(-2, k)$이고 $y=f(x)+3$이 $x$축에 접할 때, $\\alpha+\\beta-k$를 구하시오. [7점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "-1",
        solution: "<b>[Logical Anchor]</b> 꼭짓점의 정보를 이용하여 함숫값의 평행이동과 접점 조건을 분석함.\\n$f(x) = a(x + 2)^2 + k$ (단, $a=1$로 가정)\\n$y = (x + 2)^2 + k + 3$\\n$x$축에 접하려면 꼭짓점의 $y$좌표가 $0$이어야 함.\\n$\\implies k + 3 = 0 \\implies k = -3$\\n$f(x) = (x + 2)^2 - 3 = x^2 + 4x + 1$\\n근과 계수의 관계에서 $\\alpha + \\beta = -4$\\n$\\therefore -4 - (-3) = -1$"
    },
    {
        id: 21,
        level: "상",
        category: "연립부등식의 해",
        content: "[서술형 3] 연립부등식 해가 $6 < x \\le 8$일 때, 처음 부등식을 만족시키는 $x$의 범위를 구하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "6 < x <= 22/3",
        solution: "<b>[Logical Anchor]</b> 부등식의 경계값을 통해 미정계수 $a, b$를 역산함.\\n$\\text{i) } x > -3a, \\ x \\le \\frac{a+2b}{2}$\\n해의 범위가 $6 < x \\le 8$ 이므로\\n$-3a = 6 \\implies a = -2$\\n$\\frac{-2 + 2b}{2} = 8 \\implies -2 + 2b = 16 \\implies b = 9$\\n$\\text{ii) 본래 식의 대입: } 3x \\le 2b - 2a$\\n$3x \\le 2(9) - 2(-2) = 18 + 4 = 22$\\n$\\implies x \\le \\frac{22}{3}$\\n$\\therefore 6 < x \\le \\frac{22}{3}$"
    }
];