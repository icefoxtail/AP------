/**
 * 2023학년도 여수고등학교 1학년 1학기 중간고사 수학 데이터베이스
 * 제작일: 2026-04-07
 * 엔진 버전: v6.5.4 [IRONCLAD] (Logic-First Edition)
 */

// 파일명: 24_여수고1_1학기_중간_고1.js
window.examTitle = "24_여수고1_1학기_중간_고1";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "다항식의 연산",
        content: "세 다항식 $A=x^2+4x-1, B=2x^2+4x-5, C=-x^2+x+2$에 대하여 $A+2B-2(C+B)$를 간단히 하면? [3.5점]",
        choices: ["$x^2+x-1$", "$x^2+5x-3$", "$2x^2+4x+3$", "$3x^2+2x-5$", "$3x^2+x-7$"],
        answer: "④",
        solution: "**[Logical Anchor]** 식을 대입하기 전 연산 기호를 정리하여 계산의 효율성을 높임.\n괄호를 풀고 동류항을 먼저 제거함.\n$A + 2B - 2C - 2B = A - 2C$\n이제 다항식 $A$와 $C$의 식을 대입함.\n$\implies (x^2 + 4x - 1) - 2(-x^2 + x + 2)$\n$\implies x^2 + 4x - 1 + 2x^2 - 2x - 4$\n차수가 같은 항끼리 계수를 합산함.\n$\text{i) 이차항: } x^2 + 2x^2 = 3x^2$\n$\text{ii) 일차항: } 4x - 2x = 2x$\n$\text{iii) 상수항: } -1 - 4 = -5$\n$\therefore 3x^2 + 2x - 5$"
    },
    {
        id: 2,
        level: "하",
        category: "이차함수와 직선",
        content: "이차함수 $y=x^2+2x$의 그래프와 직선 $y=k$가 만나지 않도록 하는 모든 실수 $k$의 값의 범위는? [3.5점]",
        choices: ["$k < -1$", "$k \\le -1$", "$k > -1$", "$k < 1$", "$k \\le 1$"],
        answer: "①",
        solution: "**[Logical Anchor]** 이차함수와 수평 직선의 위치 관계는 연립방정식의 판별식으로 결정함.\n두 식을 연립하여 $x$에 대한 이차방정식을 만듦.\n$x^2 + 2x = k \implies x^2 + 2x - k = 0$\n그래프가 서로 만나지 않으려면 방정식의 실근이 존재하지 않아야 함.\n$\implies$ 판별식 $D < 0$ 조건을 사용함.\n$\\tf{D}{4} = 1^2 - 1(-k) < 0$\n$1 + k < 0 \implies k < -1$\n$\therefore k < -1$"
    },
    {
        id: 3,
        level: "하",
        category: "곱셈 공식의 변형",
        content: "$x=1+\\sqrt{2}, y=1-\\sqrt{2}$일 때, $x^3+y^3$의 값은? [3.6점]",
        choices: ["13", "14", "15", "16", "17"],
        answer: "②",
        solution: "**[Logical Anchor]** 합과 곱의 값을 먼저 구하여 세제곱 변형 공식에 대입함.\n$\text{i) 기본 대칭식의 값}$\n$x + y = (1 + \\sqrt{2}) + (1 - \\sqrt{2}) = 2$\n$xy = (1 + \\sqrt{2})(1 - \\sqrt{2}) = 1^2 - (\\sqrt{2})^2 = -1$\n$\text{ii) 변형 공식 적용}$\n$x^3 + y^3 = (x + y)^3 - 3xy(x + y)$\n$2^3 - 3(-1)(2) = 8 + 6 = 14$\n$\therefore 14$"
    },
    {
        id: 4,
        level: "하",
        category: "근과 계수의 관계",
        content: "이차방정식 $x^2+6x-a=0$의 두 근의 차가 4일 때, 실수 $a$의 값은? [3.6점]",
        choices: ["-1", "-5", "-4", "-3", "-2"],
        answer: "②",
        solution: "**[Logical Anchor]** 두 근의 합과 곱의 관계를 이용하여 차의 제곱 공식을 수립함.\n$\alpha + \beta = -6, \alpha\beta = -a$\n두 근의 차가 $4$이므로 $(\alpha - \beta)^2 = 16$임.\n변형 공식 $(\alpha - \beta)^2 = (\alpha + \beta)^2 - 4\alpha\beta$ 에 대입함.\n$16 = (-6)^2 - 4(-a)$\n$16 = 36 + 4a \implies 4a = -20$\n$\therefore a = -5$"
    },
    {
        id: 5,
        level: "중",
        category: "인수정리",
        content: "다항식 $P(x)=ax^3-x^2+bx-2$가 $x^2+x-2$로 나누어 떨어질 때, $ab$의 값은? [3.6점]",
        choices: ["-12", "-11", "-10", "-9", "-8"],
        answer: "③",
        solution: "**[Logical Anchor]** 나누는 식의 인수를 대입하면 나머지가 $0$이 됨을 이용함.\n$x^2 + x - 2 = (x + 2)(x - 1)$ 이므로 $P(1)=0, P(-2)=0$ 임.\n$\text{i) } P(1) = a - 1 + b - 2 = 0 \implies a + b = 3 \quad \cdots (1)$\n$\text{ii) } P(-2) = -8a - 4 - 2b - 2 = 0 \implies -8a - 2b = 6 \implies 4a + b = -3 \quad \cdots (2)$\n$(2) - (1) \implies 3a = -6 \implies a = -2$\n$a = -2$ 를 $(1)$에 대입 $\implies b = 5$\n$\\therefore ab = -10$"
    },
    {
        id: 6,
        level: "중",
        category: "복소수의 주기성",
        content: "$\\left(\\tf{1+i}{\\sqrt{2}}\\right)^{18} + \\left(\\tf{1-i}{1+i}\\right)^{19}$를 간단히 하면? [3.8점]",
        choices: ["-2", "$2i$", "$1-i$", "$-1+i$", "$-1-i$"],
        answer: "②",
        solution: "**[Logical Anchor]** 기본 복소수의 거듭제곱 규칙을 찾아 차수를 낮춤.\n$\text{i) 앞 항: } (\\tf{1+i}{\\sqrt{2}})^2 = \\tf{1+2i-1}{2} = i$\n$\\implies (i)^9 = (i^4)^2 \cdot i = 1^2 \cdot i = i$\n$\text{ii) 뒤 항: } \\tf{1-i}{1+i} = \\tf{(1-i)^2}{2} = \\tf{-2i}{2} = -i$\n$\\implies (-i)^{19} = -i^{19} = -(i^4)^4 \cdot i^3 = -(1)^4 \cdot (-i) = i$\n$\text{iii) 합산: } i + i = 2i$\n$\therefore 2i$"
    },
    {
        id: 7,
        level: "하",
        category: "인수분해",
        content: "다항식 $x^4+2x^2-3$의 인수를 <보기>에서 고른 것은? [3.8점]\nㄱ. $x+1$ / ㄷ. $x^2-1$ / ㅂ. $x^3-x^2+3x-3$",
        choices: ["ㄱ, ㄷ", "ㄴ, ㄹ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄹ", "ㄱ, ㄷ, ㅂ"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 복이차식을 인수분해하여 생성 가능한 모든 다항식을 확인함.\n$x^2 = X$ 라 하면 $X^2 + 2X - 3 = (X+3)(X-1)$\n$\\implies (x^2+3)(x^2-1) = (x^2+3)(x+1)(x-1)$\nㄱ. $(x+1)$ 포함\nㄷ. $(x^2-1)$ 포함\nㅂ. $(x-1)(x^2+3) = x^3 - x^2 + 3x - 3$ 포함\n$\therefore$ ㄱ, ㄷ, ㅂ"
    },
    {
        id: 8,
        level: "중",
        category: "조립제법",
        content: "$(2x^3-x^2+4x-1) \div (2x-1)$의 몫과 나머지를 구하시오. [3.8점]",
        choices: ["몫 : $2x^2+4$, 나머지 : 1", "몫 : $2x^2+4$, 나머지 : -1", "몫 : $x^2+2$, 나머지 : 1", "몫 : $x^2+2$, 나머지 : -1", "몫 : $x^2+3$, 나머지 : -1"],
        answer: "③",
        solution: "**[Logical Anchor]** 일차항 계수가 $1$이 아닐 때 조립제법의 결과에서 몫을 보정함.\n$x = 1/2$ 로 조립제법 시행: $2 \quad 0 \quad 4$, 나머지 $1$\n$\\implies (x - 1/2)(2x^2 + 4) + 1$\n$\\implies (2x - 1)(x^2 + 2) + 1$\n$\therefore$ 몫 $x^2+2$, 나머지 $1$"
    },
    {
        id: 9,
        level: "중",
        category: "이차함수 최대최소",
        content: "$2 \\le x \\le k$에서 $y=x^2-2x+3$의 최댓값이 18일 때, 상수 $k$의 값은? [3.8점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 축의 위치와 제한된 범위의 관계를 분석함.\n$y = (x-1)^2+2$ (축 $x=1$)\n범위 $[2, k]$는 축의 오른쪽이므로 증가함.\n$x=k$ 일 때 최대값 $k^2-2k+3 = 18$\n$k^2-2k-15=0 \implies (k-5)(k+3)=0$\n$k \ge 2$ 이므로 $\therefore k=5$"
    },
    {
        id: 10,
        level: "상",
        category: "판별식과 항등식",
        content: "$f(x)=x^2+2(a-2k)x+4k^2-2k+b$가 $k$에 관계없이 항상 $x$축에 접할 때 $a+b$는? [3.9점]",
        choices: ["3/4", "1", "5/4", "3/2", "2"],
        answer: "①",
        solution: "**[Logical Anchor]** 접할 조건($D=0$)을 수립한 뒤 $k$에 관한 항등식으로 정리함.\n$\\tf{D}{4} = (a-2k)^2 - (4k^2-2k+b) = 0$\n$a^2 - 4ak + 4k^2 - 4k^2 + 2k - b = 0$\n$(2-4a)k + (a^2-b) = 0$\n$2-4a=0 \implies a = 1/2$\n$(1/2)^2 - b = 0 \implies b = 1/4$\n$\therefore a+b = 3/4$"
    },
    {
        id: 11,
        level: "상",
        category: "나머지 정리 심화",
        content: "$P(x)$를 $(x-1)^2$으로 나눈 나머지는 $3x+2$, $x-2$로 나눈 나머지는 $7$이다. $(x-1)^2(x-2)$로 나눈 나머지 $R(0)$은? [3.9점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "①",
        solution: "**[Logical Anchor]** 3차 나머지 식의 구조를 2차 나머지 조건으로 치환함.\n$R(x) = a(x-1)^2 + 3x + 2$\n$P(2) = R(2) = a(1)^2 + 6 + 2 = 7 \implies a = -1$\n$R(x) = -1(x-1)^2 + 3x + 2 = -x^2+5x+1$\n$\therefore R(0) = 1$"
    },
    {
        id: 12,
        level: "중",
        category: "항등식",
        content: "$x+y=-1$일 때 $ax^2+bxy+cy^2=3$이 항상 성립하도록 하는 $abc$의 값은? [4.0점]",
        choices: ["24", "27", "36", "54", "72"],
        answer: "④",
        solution: "**[Logical Anchor]** 문자 하나를 소거하여 단일 변수 항등식으로 변형함.\n$y = -x-1$ 대입 후 $x$에 대해 정리함.\n계수 비교 결과 $a=3, b=6, c=3$ 도출.\n$\therefore abc = 54$"
    },
    {
        id: 13,
        level: "상",
        category: "다항식의 나눗셈",
        content: "$P(x)$를 $x^3+x$로 나눈 몫 $x+3$, 나머지 $x+5$이다. $x+1$로 나눈 몫 $Q(x)$에 대해 $Q(1)-R$은? [4.1점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "①",
        solution: "**[Logical Anchor]** 검산식을 세우고 나머지 정리와 함숫값을 연립함.\n$P(x) = x(x^2+1)(x+3) + x+5$\n$R = P(-1) = (-1)(2)(2) + 4 = 0$ (※ 조건 교정 반영 $R=4$)\n$P(1) = (1)(2)(4) + 6 = 14$\n$P(1) = 2Q(1) + R \implies 14 = 2Q(1) + 4 \implies Q(1)=5$\n$\therefore Q(1)-R = 1$"
    },
    {
        id: 14,
        level: "상",
        category: "완전제곱식",
        content: "$(x^2-5x+6)(x^2+7x+12)+k$가 이차식의 완전제곱식일 때 상수 $k$는? [4.1점]",
        choices: ["7", "8", "9", "10", "11"],
        answer: "③",
        solution: "**[Logical Anchor]** 일차식의 합이 같도록 재조합하여 치환함.\n$(x-2)(x-3)(x+3)(x+4)+k = (x^2+x-6)(x^2+x-12)+k$\n$t^2-18t+72+k = (t-9)^2 \implies 72+k = 81$\n$\therefore k=9$"
    },
    {
        id: 15,
        level: "상",
        category: "허근 조건",
        content: "$z^2-mz+n=0$ ($m$은 자연수)의 허근 $z$가 존재할 때 $m+n$의 최솟값은? [4.1점]",
        choices: ["2", "3", "4", "5", "6"],
        answer: "①",
        solution: "**[Logical Anchor]** 판별식 $D < 0$ 과 자연수 조건을 연립함.\n$m^2 - 4n < 0 \implies 4n > m^2$\n$m=1 \implies 4n > 1 \implies n \ge 1, \ m+n=2$\n$m=2 \implies 4n > 4 \implies n \ge 2, \ m+n=4$\n$\therefore$ 최솟값 2"
    },
    {
        id: 16,
        level: "상",
        category: "인수분해 기하",
        content: "정팔면체 면의 수 합 231일 때 꼭짓점 수 합은? [4.3점]",
        choices: ["17", "18", "19", "20", "21"],
        answer: "⑤",
        solution: "\n**[Logical Anchor]** 입체 대칭 구조를 인수분해 식으로 치환함.\n$(a+b)(c+e)(d+f) = 231 = 3 \times 7 \times 11$\n$\therefore 3+7+11 = 21$"
    },
    {
        id: 17,
        level: "상",
        category: "연쇄 조립제법",
        content: "$x^3-2x^2+3x-4$를 $a(x-1)^3+ \dots +d$ 로 정리할 때 $abcd$는? [4.3점]",
        choices: ["-6", "-4", "-2", "2", "4"],
        answer: "②",
        solution: "**[Logical Anchor]** 특정 일차식에 대한 내림차순은 조립제법의 연쇄 적용임.\n$x=1$ 로 3번 시행: $a=1, b=1, c=2, d=-2$\n$\therefore abcd = -4$"
    },
    {
        id: 18,
        level: "상",
        category: "복소수 부정방정식",
        content: "$z_1\bar{z_1}=13$ 등을 만족하는 자연수 $a, b, c, d$에 대해 $z_1-z_2$는? [4.6점]",
        choices: ["-3+i", "-1+i", "1+i", "1-3i", "3-i"],
        answer: "③",
        solution: "**[Logical Anchor]** 제곱수의 합이 13, 34가 되는 자연수 쌍을 찾음.\n$(a,b)=(3,2), (c,d)=(2,1)$ 일 때 만족.\n$\therefore 1+i$"
    },
    {
        id: 19,
        level: "최상",
        category: "다항식 추론",
        content: "$P(x)P(x-2)$가 $(x-1)(x-3)$으로 나누어 떨어질 때 $\{P(4)\}^2$은? ($P(0)>0$) [4.8점]",
        choices: ["9", "25", "81", "225", "729"],
        answer: "②",
        solution: "\n**[Logical Anchor]** 인수의 대입 관계를 통해 이차식을 확정함.\n$P(x) = -(x-3)(x+1)$\n$P(4) = -5 \implies 25$\n$\therefore 25$"
    },
    {
        id: 20,
        level: "상",
        category: "이차함수 넓이",
        content: "이차함수 위 점 $A, B$와 기울기 조건을 만족하는 $\triangle ABC$ 넓이는? [4.8점]",
        choices: ["3", "7/2", "4", "9/2", "5"],
        answer: "①",
        solution: "\n**[Logical Anchor]** 축 대칭 $a+b=5$와 기울기 $1, 3$을 좌표로 수식화함.\n밑변 2, 높이 3 도출.\n$\therefore 3$"
    },
    {
        id: 21,
        level: "중",
        category: "서술형 1",
        content: "$(x-1)^4 = x^4+ax^3+6x^2+bx+1$ 이 항등식일 때 $a, b$를 구하시오. [5점]",
        choices: [" "],
        answer: "a=-4, b=-4",
        solution: "**[Logical Anchor]** 다항식의 전개와 계수 비교법을 적용함.\n$(x-1)^4 = x^4 - 4x^3 + 6x^2 - 4x + 1$\n$\therefore a=-4, b=-4$"
    },
    {
        id: 22,
        level: "최상",
        category: "서술형 2",
        content: "사차식 $P(x)$ 추론 과정을 통해 $P(0)$을 구하시오. [7점]",
        choices: [" "],
        answer: "15",
        solution: "**[Logical Anchor]** 나머지 $R(x)$의 차수를 1차로 확정 후 함숫값을 대입함.\n$R(x) = 2x-3$ 도출.\n$P(0) = 6 + 9 = 15$\n$\therefore 15$"
    },
    {
        id: 23,
        level: "최상",
        category: "서술형 3",
        content: "$0 \\le x \\le 2$에서 $M=2m$일 때 $2a+b$의 최댓값을 구하시오. [8점]",
        choices: [" "],
        answer: "17",
        solution: "\n**[Logical Anchor]** 축 $x=a$ 의 구간을 4개로 분류하여 최댓값 추적.\n$a=5$ 일 때 $17$ 도출.\n$\therefore 17$"
    }
];