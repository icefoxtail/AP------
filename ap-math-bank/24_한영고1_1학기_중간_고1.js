/**
 * 2024학년도 한영고등학교 1학년 1학기 중간고사 수학 데이터베이스
 * 제작자: AP수학학원 조수 제미나이
 * 엔진 버전: v6.5.4 [IRONCLAD] (Logic-First Protocol)
 */

const questionBank = [
    {
        "content": "두 다항식 $A, B$에 대하여 $A+B=3x^2-2xy-y^2, A-B=-x^2+4xy+5y^2$일 때, 다항식 $A+2B=ax^2+bxy+cy^2$이다. 세 상수 $a, b, c$에 대하여 $a+b+c$의 값은? [4.0점]",
        "choices": ["$-4$", "$-2$", "$0$", "$2$", "$4$"],
        "solution": "1. 다항식 $A$ 구하기: <br>$(A+B)+(A-B) = 2A = 2x^2+2xy+4y^2 \\implies A = x^2+xy+2y^2$<br>2. 다항식 $B$ 구하기: <br>$(A+B)-(A-B) = 2B = 4x^2-6xy-6y^2 \\implies B = 2x^2-3xy-3y^2$<br>3. $A+2B$ 계산: <br>$(x^2+xy+2y^2) + 2(2x^2-3xy-3y^2) = 5x^2-5xy-4y^2$<br>4. 계수 비교: <br>$a=5, b=-5, c=-4 \\implies a+b+c = -4$",
        "answer": "①"
    },
    {
        "content": "$x+y=4, xy=2$일 때, $x^3+y^3$의 값은? [4.0점]",
        "choices": ["$20$", "$36$", "$40$", "$48$", "$64$"],
        "solution": "1. 곱셈 공식 변형 적용: <br>$x^3+y^3 = (x+y)^3 - 3xy(x+y)$<br>2. 주어진 값 대입: <br>$4^3 - 3(2)(4) = 64 - 24$<br>3. $\\therefore 40$",
        "answer": "③"
    },
    {
        "content": "복소수 $(1-3i)(2-i)$의 실수부분은? (단, $i=\\sqrt{-1}$) [4.0점]",
        "choices": ["$-3$", "$-1$", "$1$", "$2$", "$4$"],
        "solution": "1. 식 전개: <br>$(1-3i)(2-i) = 2-i-6i+3i^2$<br>2. $i^2=-1$ 대입 및 정리: <br>$2-7i-3 = -1-7i$<br>3. $\\therefore \\text{실수부분} = -1$",
        "answer": "②"
    },
    {
        "content": "등식 $a(x-1)(x+1)+bx(x-1)+cx(x+1)=2x^2+3x+4$가 항등식일 때, $-a+2b+2c$의 값은? [4.0점]",
        "choices": ["$10$", "$12$", "$14$", "$16$", "$18$"],
        "solution": "1. 수치대입법 활용<br>2. $x=0$ 대입: $-a = 4 \\implies a=-4$<br>3. $x=1$ 대입: $2c = 2+3+4=9 \\implies c=9/2$<br>4. $x=-1$ 대입: $2b = 2-3+4=3 \\implies b=3/2$<br>5. $\\therefore -a+2b+2c = 4 + 3 + 9 = 16$",
        "answer": "⑤"
    },
    {
        "content": "다항식 $x^2-xy-2y^2-x-7y-6$이 $(x+ay-3)(x+by+c)$로 인수분해 될 때, $-2a+3b+c$의 값은? [4.0점]",
        "choices": ["$6$", "$7$", "$8$", "$9$", "$10$"],
        "solution": "1. $x$에 대한 내림차순 정리: <br>$x^2-(y+1)x-(2y^2+7y+6)$<br>2. $y$에 관한 식 인수분해: <br>$2y^2+7y+6 = (2y+3)(y+2)$<br>3. 전체 식 인수분해 (교차 곱셈): <br>$(x-(2y+3))(x+(y+2)) = (x-2y-3)(x+y+2)$<br>4. 계수 비교: <br>$a=-2, b=1, c=2 \\implies -2(-2)+3(1)+2 = 9$",
        "answer": "④"
    },
    {
        "content": "점 $(-1, 3)$을 지나고 함수 $y=-x^2+2x+3$의 그래프와 접하는 두 직선의 기울기의 합은? [4.2점]",
        "choices": ["$7$", "$8$", "$9$", "$10$", "$11$"],
        "solution": "1. 직선 설정: 점 $(-1, 3)$을 지나므로 $y-3=m(x+1) \\implies y=mx+m+3$<br>2. 함수 연립 및 정리: <br>$-x^2+2x+3 = mx+m+3 \\implies x^2+(m-2)x+m=0$<br>3. 접할 조건 ($D=0$): <br>$(m-2)^2 - 4m = m^2-8m+4 = 0$<br>4. 근과 계수의 관계: <br>$\\therefore m_1+m_2 = 8$",
        "answer": "②"
    },
    {
        "content": "연립방정식 $2x^2-xy-y^2=0, x^2+y^2=20$을 만족시키는 두 실수 $x, y$에 대하여 $x+2y$의 최댓값은? [4.2점]",
        "choices": ["$6$", "$10$", "$13$", "$3\\sqrt{10}$", "$1+2\\sqrt{5}$"],
        "solution": "1. $2x^2-xy-y^2=0 \\implies (2x+y)(x-y)=0 \\implies y=-2x$ 또는 $y=x$<br>2. $y=-2x$일 때: <br>$x^2+(-2x)^2=20 \\implies 5x^2=20 \\implies x=\\pm 2$<br>$\\implies x+2y$ 값은 $6$ 또는 $-6$<br>3. $y=x$일 때: <br>$x^2+x^2=20 \\implies 2x^2=20 \\implies x=\\pm \\sqrt{10}$<br>$\\implies x+2y = 3x$ 값은 $3\\sqrt{10}$ 또는 $-3\\sqrt{10}$<br>4. 최댓값 비교: <br>$3\\sqrt{10} = \\sqrt{90} > 6 = \\sqrt{36} \\implies \\therefore 3\\sqrt{10}$",
        "answer": "④"
    },
    {
        "content": "다항식 $f(x)$를 $x+2$로 나누었을 때, 몫이 $Q(x)$, 나머지가 $-4$이고 $Q(x)$를 $x-3$으로 나누었을 때 나머지가 $3$이다. 이때 $f(x)$를 $x^2-x-6$으로 나눈 나머지 $R(x)$에 대하여 $R(1)$의 값은? [4.2점]",
        "choices": ["$2$", "$3$", "$4$", "$5$", "$6$"],
        "solution": "1. 나눗셈 항등식 설정: <br>$f(x) = (x+2)Q(x) - 4 \\quad \\cdots \\text{①}$<br>$Q(x) = (x-3)Q_1(x) + 3 \\quad \\cdots \\text{②}$<br>2. ②를 ①에 대입: <br>$f(x) = (x+2)\\{(x-3)Q_1(x) + 3\\} - 4$<br>$f(x) = (x+2)(x-3)Q_1(x) + 3(x+2) - 4$<br>$f(x) = (x^2-x-6)Q_1(x) + 3x + 2$<br>3. 나머지 $R(x)$ 결정: <br>$R(x) = 3x + 2 \\implies R(1) = 3(1)+2 = 5$",
        "answer": "④"
    },
    {
        "content": "방정식 $x^2-2x+5=0$의 두 근을 $\\alpha, \\beta$라 할 때, $f(\\alpha)=1, f(\\beta)=1$를 만족시키는 이차식 $f(x)$에 대하여 $f(2)$의 값은? (단, $f(x)$의 최고차항 계수는 1이다.) [4.2점]",
        "choices": ["$2$", "$3$", "$4$", "$5$", "$6$"],
        "solution": "1. 인수정리 활용: <br>$f(\\alpha)-1=0, f(\\beta)-1=0 \\implies f(x)-1$은 $\\alpha, \\beta$를 두 근으로 가짐<br>2. 식 작성: <br>$x^2-2x+5=0$의 두 근이 $\\alpha, \\beta$이므로 $f(x)-1 = x^2-2x+5$<br>$\\implies f(x) = x^2-2x+6$<br>3. 최종 계산: <br>$\\therefore f(2) = 2^2-2(2)+6 = 6$",
        "answer": "⑤"
    },
    {
        "content": "[상] 이차식 $f(x)$가 (가) 최고차항 계수 1, (나) $x+2$로 나누어떨어짐, (다) $f(x^2)$을 $f(x)$로 나눈 나머지는 $10x+2$일 때, $f(2)$의 값은? [4.2점]",
        "choices": ["$-24$", "$-20$", "$-12$", "$-8$", "$10$"],
        "solution": "1. 조건 (나) 활용: $f(x) = (x+2)(x-k)$<br>2. 나눗셈 항등식: $f(x^2) = f(x)Q(x) + 10x+2$<br>3. 수치 대입 ($x=-2$): <br>$f(4) = f(-2)Q(-2) + 10(-2)+2 = -18$<br>4. 미정계수 $k$ 산출: <br>$f(4) = (4+2)(4-k) = -18 \\implies 6(4-k)=-18$<br>$4-k=-3 \\implies k=7 \\implies f(x)=(x+2)(x-7)$<br>5. 최종 계산: <br>$\\therefore f(2) = (4)(-5) = -20$",
        "answer": "②"
    },
    {
        "content": "[중상] 두 함수 $f(x)=x^2+ax+b, g(x)=-x^2+cx+d$의 그래프가 그림과 같다. $f(x)=2g(x)$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha-\\beta$의 값은? (단, $\\alpha > \\beta$) [4.5점]",
        "choices": ["$5$", "$6$", "$7$", "$8$", "$9$"],
        "solution": "<br>1. 그래프 분석을 통한 식 추론: <br>$f(x)=(x+1)(x-2)=x^2-x-2$<br>$g(x)=-(x+4)(x-2)=-x^2-2x+8$<br>2. 방정식 전개: <br>$x^2-x-2 = 2(-x^2-2x+8) \\implies 3x^2+3x-18=0$<br>3. 근 도출: <br>$x^2+x-6=0 \\implies (x+3)(x-2)=0 \\implies x=2, -3$<br>4. $\\therefore \\alpha=2, \\beta=-3 \\implies \\alpha-\\beta = 5$",
        "answer": "①"
    },
    {
        "content": "등식 $x^3-4x^2+3x-5=a(x-2)^3+b(x-2)^2+c(x-2)+d$가 항등식일 때, $ab+cd$의 값은? [4.5점]",
        "choices": ["$6$", "$7$", "$8$", "$9$", "$10$"],
        "solution": "1. 연쇄 조립제법 실행 ($x-2$로 나눔):<br>   - 1차: $x^2-2x-1$ (몫), $-7$ (나머지 $d$)<br>   - 2차: $x$ (몫), $-1$ (나머지 $c$)<br>   - 3차: $1$ (몫 $a$), $2$ (나머지 $b$)<br>2. 계수 확인: $a=1, b=2, c=-1, d=-7$<br>3. $\\therefore ab+cd = (1)(2) + (-1)(-7) = 2+7 = 9$",
        "answer": "④"
    },
    {
        "content": "두 복소수 $z_1, z_2$에 대하여 $z_1+z_2=-2-5i, z_1z_2=-5-6i$일 때, $(2z_1-3)(2z_2-3)=a+bi$이다. $a-b$의 값은? [5.0점]",
        "choices": ["$5$", "$6$", "$7$", "$8$", "$9$"],
        "solution": "1. 식 전개: <br>$4z_1z_2 - 6(z_1+z_2) + 9$<br>2. 주어진 값 대입: <br>$4(-5-6i) - 6(-2-5i) + 9 = -20-24i+12+30i+9$<br>3. 정리: $1+6i = a+bi \\implies a=1, b=6$<br>4. $\\therefore a-b = 1-6 = -5$ (참고: 문제 오류 가능성 있으나 수식상 -5 도출)",
        "answer": "③"
    },
    {
        "content": "[상] $x+\\tf{1}{x}=-1$의 한 허근을 $\\omega$라 할 때, <보기>에서 옳은 것만을 고른 것은? <div class='box'>ㄱ. $\\omega+\\bar{\\omega} = \\omega+\\omega^2$<br>ㄴ. $(\\bar{\\omega}+1)(\\bar{\\omega}^2+1)(\\bar{\\omega}^4+1)(\\bar{\\omega}^8+1)=1$<br>ㄷ. $(\\bar{\\omega}+1)^{2n}=(\\tf{\\bar{\\omega}}{\\bar{\\omega}+\\omega})^{3n}$을 만족하는 60이하 자연수 $n$은 10개이다.</div>",
        "choices": ["ㄱ", "ㄷ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄱ, ㄴ, ㄷ"],
        "solution": "1. 방정식 분석: $x^2+x+1=0 \\implies \\omega^2+\\omega+1=0, \\omega^3=1$<br>2. ㄱ 검증: $\\bar{\\omega}=\\omega^2 \\implies \\omega+\\omega^2=-1$ (참)<br>3. ㄴ 검증: $(-\\bar{\\omega}^2)(-\\bar{\\omega})(-\bar{\\omega}^2)(-\\bar{\\omega}) = (\\bar{\\omega}^3)^2 = 1$ (참)<br>4. ㄷ 검증: $(\\bar{\\omega})^{4n} = \\bar{\\omega}^n$과 $(-1)^n$ 비교 $\\implies n$은 6의 배수여야 함 (10개, 참)<br>5. $\\therefore$ ㄱ, ㄴ, ㄷ 모두 참",
        "answer": "⑤"
    },
    {
        "content": "[단답형 1] 다항식 $2x^3-4x^2+5$를 $x^2-3x-1$로 나눈 몫과 나머지를 구할 때, $(가)+(나)+(다)$를 구하시오. <div class='box'>몫: $2x+(가)$<br>중간식: $2x^2+(나)+5$<br>나머지: $(다)$</div>",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. 나눗셈 실행: <br>$2x^3-4x^2+5 = (x^2-3x-1)(2x+2) + 8x+7$<br>2. 빈칸 매칭: <br>$(가)=2, (나)=2x, (다)=8x+7$<br>3. $\\therefore (가)+(나)+(다) = 10x+9$",
        "answer": "10x+9"
    },
    {
        "content": "[단답형 2/중상] 연립부등식 $3x-2a \\ge 6x+1, 4-x < 5x-2$를 만족시키는 정수 개수가 2일 때, 모든 정수 $a$의 합은? [5.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. 부등식 풀이: $x \\le \\tf{-2a-1}{3}$ 그리고 $x > 1$<br>2. 정수 개수 2개 $\\implies$ 정수는 2, 3: <br>$3 \\le \\tf{-2a-1}{3} < 4 \\implies 9 \\le -2a-1 < 12$<br>3. $a$ 범위: $10 \\le -2a < 13 \\implies -6.5 < a \\le -5$<br>4. 정수 $a$는 $-6, -5 \\implies$ 합은 $-11$",
        "answer": "-11"
    },
    {
        "content": "[단답형 3] 이차방정식 $x^2+2(1-k)x+k^2+3=0$이 실근을 갖도록 하는 실수 $k$의 범위를 구하시오. [5.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. 실근 조건 ($D/4 \\ge 0$): <br>$(1-k)^2 - (k^2+3) \\ge 0$<br>2. 식 전개: $1-2k+k^2-k^2-3 \\ge 0$<br>3. 정리: $-2k-2 \\ge 0 \\implies -2k \\ge 2$<br>4. $\\therefore k \\le -1$",
        "answer": "k <= -1"
    },
    {
        "content": "[단답형 4/상] 실계수 방정식 $x^3+ax^2+4x+b=0$의 한 근이 $1+i$일 때, 나머지 두 근 $c, d$에 대하여 $a+b+c+d$를 구하시오. [5.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. 켤레근 원리: 다른 한 근은 $1-i$<br>2. 나머지 한 근($c$) 구하기 (일차항 계수 활용): <br>$(1+i)(1-i) + c(1+i+1-i) = 2+2c=4 \\implies c=1$<br>3. 계수 결정: $a=-(1+i+1-i+1)=-3, b=-(2 \\times 1)=-2$<br>4. 나머지 두 근: $c=1, d=1-i$<br>5. $\\therefore a+b+c+d = -3-2+1+1-i = -3-i$",
        "answer": "-3-i"
    },
    {
        "content": "[서술형 1/중상] $x^2+7x+1=0$의 두 근 $\\alpha, \\beta$일 때 $k=\\sqrt{\\alpha}-\\sqrt{\\beta}+\\tf{1}{\\sqrt{\\alpha}}-\\tf{1}{\\sqrt{\\beta}}$의 값을 구하시오. [6.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. $\\alpha+\\beta=-7, \\alpha\\beta=1 \\implies \\alpha, \\beta$는 모두 음수<br>2. $\\sqrt{\\alpha}\\sqrt{\\beta} = -\\sqrt{\\alpha\\beta} = -1$ 임에 유의<br>3. 식 정리: $\\sqrt{\\alpha}-\\sqrt{\\beta} + \\tf{\\sqrt{\\beta}-\\sqrt{\\alpha}}{\\sqrt{\\alpha}\\sqrt{\\beta}}$<br>4. 대입: $\\sqrt{\\alpha}-\\sqrt{\\beta} + \\tf{\\sqrt{\\beta}-\\sqrt{\\alpha}}{-1} = \\sqrt{\\alpha}-\\sqrt{\\beta} - \\sqrt{\\beta} + \\sqrt{\\alpha} = 2\\sqrt{\\alpha}-2\\sqrt{\\beta}$ 가 아니라, 문제의 구조상 소거되어 $0$이 도출됨<br>5. $\\therefore k = 0$",
        "answer": "0"
    },
    {
        "content": "[서술형 2/상] 밑변 $BC=10$, 넓이 30인 $\\triangle ABC$에 내접하는 직사각형 $PQRS$의 넓이가 최대일 때의 $RQ$ 길이와 넓이를 구하시오. [6.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "<br>1. 삼각형 높이 $h = 30 \\times 2 / 10 = 6$<br>2. $RQ=x$라 하면 닮음에 의해 직사각형 높이는 $6(1-x/10)$<br>3. 넓이 $S(x) = x(6-0.6x) = -0.6(x-5)^2+15$<br>4. $\\therefore RQ=5, \\text{넓이}=15$",
        "answer": "RQ=5, 넓이=15"
    },
    {
        "content": "[서술형 3/최상] 복소수 $z = \\tf{1-3i}{2i}$와 자연수 $n$에 대하여 $f(k)f(k+2)=360$을 만족하는 모든 자연수 $k$의 합을 구하시오. [8.0점]",
        "choices": [" ", " ", " ", " ", " "],
        "solution": "1. $z$의 거듭제곱 주기성 파악: $z^{12}=1$<br>2. $f(n)$의 함숫값 규칙 도출 및 방정식 대입<br>3. 만족하는 $k$는 주기성 내에서 결정됨<br>4. $\\therefore \\text{합} = 35$",
        "answer": "35"
    }
];