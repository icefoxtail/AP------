/**
 * 2025학년도 순천제일고등학교 1학년 1학기 중간고사 수학 데이터베이스
 * 제작자: AP수학학원 조수 제미나이
 * 엔진 버전: v6.5.4 [IRONCLAD] (Logic-First Protocol)
 * 보정 사항: 13번(그래프 정보 구체화), 20번(상수 및 정답 수치 정합성 확보)
 */
window.examTitle = "25_제일고1_1학기_중간_고1";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "항등식",
    "content": "등식 $x^{2}+x+1=ax^{2}+(b+1)x+(c-2)$ 이 $x$에 대한 항등식일 때, 상수 $a, b, c$에 대하여 $a+b+c$의 값은? [4.0점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 계수비교법을 통한 미정계수 결정\\n$\\because x$에 대한 항등식\\n$\\implies a = 1$\\n$\\implies b+1 = 1 \\implies b = 0$\\n$\\implies c-2 = 1 \\implies c = 3$\\n$\\therefore a+b+c = 1+0+3 = 4$"
  },
  {
    "id": 2,
    "level": "하",
    "category": "나머지 정리",
    "content": "다항식 $P(x) = x^{3}+x^{2}-2x+2$ 를 $x-1$로 나눌 때의 나머지는? [4.1점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 나머지 정리 $R = P(k)$ 적용\\n$\\because$ 나머지는 $P(1)$의 값과 같음\\n$\\implies P(1) = 1^{3}+1^{2}-2(1)+2 = 1+1-2+2$\\n$\\therefore P(1) = 2$"
  },
{
    "id": 3,
    "level": "하",
    "category": "나머지 정리",
    "content": "조립제법을 이용하여 다항식 $x^{3}-2x^{2}+x+2$을 $x-1$로 나누었을 때의 몫과 나머지를 구하는 과정이 다음과 같다. $a+b$의 값은? [4.2점]<br/><div style='text-align:center; margin:10px 0;'><svg width='280' height='130' viewBox='0 0 280 130' style='background:white;'><line x1='40' y1='30' x2='40' y2='110' stroke='black' stroke-width='1.5'/><line x1='45' y1='90' x2='240' y2='90' stroke='black' stroke-width='1.5'/><text x='25' y='65' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='65' y='25' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='115' y='25' font-size='16' text-anchor='middle' font-family='serif'>-2</text><text x='165' y='25' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='215' y='25' font-size='16' text-anchor='middle' font-family='serif'>2</text><text x='115' y='65' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='165' y='65' font-size='16' text-anchor='middle' font-weight='bold' font-family='serif'>a</text><text x='215' y='65' font-size='16' text-anchor='middle' font-family='serif'>0</text><text x='65' y='115' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='115' y='115' font-size='16' text-anchor='middle' font-family='serif'>-1</text><text x='165' y='115' font-size='16' text-anchor='middle' font-weight='bold' font-family='serif'>b</text><line x1='200' y1='95' x2='200' y2='125' stroke='black' stroke-width='1'/><text x='225' y='115' font-size='16' text-anchor='middle' font-family='serif'>2</text></svg></div>",
    "choices": ["-3", "-2", "-1", "0", "1"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 조립제법의 연산 구조 분석<br/><div style='text-align:center; margin:10px 0;'><svg width='280' height='130' viewBox='0 0 280 130' style='background:white;'><line x1='40' y1='30' x2='40' y2='110' stroke='black' stroke-width='1.5'/><line x1='45' y1='90' x2='240' y2='90' stroke='black' stroke-width='1.5'/><text x='25' y='65' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='65' y='25' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='115' y='25' font-size='16' text-anchor='middle' font-family='serif'>-2</text><text x='165' y='25' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='215' y='25' font-size='16' text-anchor='middle' font-family='serif'>2</text><text x='115' y='65' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='165' y='65' font-size='16' text-anchor='middle' font-weight='bold' text-decoration='underline' font-family='serif'>-1</text><text x='215' y='65' font-size='16' text-anchor='middle' font-family='serif'>0</text><text x='65' y='115' font-size='16' text-anchor='middle' font-family='serif'>1</text><text x='115' y='115' font-size='16' text-anchor='middle' font-family='serif'>-1</text><text x='165' y='115' font-size='16' text-anchor='middle' font-weight='bold' text-decoration='underline' font-family='serif'>0</text><line x1='200' y1='95' x2='200' y2='125' stroke='black' stroke-width='1'/><text x='225' y='115' font-size='16' text-anchor='middle' font-family='serif'>2</text></svg></div>$\\because$ $a$는 앞선 열의 합($-1$)과 제수($1$)의 곱임<br/>$\\implies a = (-1) \\times 1 = -1$<br/>$\\implies b = 1 + a = 1 + (-1) = 0$<br/>$\\therefore a+b = -1+0 = -1$"
  },
  {
    "id": 4,
    "level": "중",
    "category": "인수분해",
    "content": "다항식 $x^{4}-x^{3}-7x^{2}+x+6$의 인수가 아닌 것은? [4.3점]",
    "choices": ["$x-1$", "$x+1$", "$x-2$", "$x+2$", "$x-3$"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 인수 정리에 의한 인수 판정\\n$\\because P(x) = x^4-x^3-7x^2+x+6$\\n$\\implies P(1)=0, P(-1)=0, P(-2)=0, P(3)=0$\\n$\\text{iii) } P(2) = 16-8-28+2+6 = -12 \\neq 0$\\n$\\therefore x-2\\text{는 인수가 아님}$"
  },
  {
    "id": 5,
    "level": "중",
    "category": "나머지 정리",
    "content": "다항식 $P(x)$를 $x-1$로 나눈 몫을 $Q(x)$, 나머지를 $4$라 하자. $Q(x)$를 $x-2$로 나눈 나머지가 $1$일 때 $P(x)$를 $x-2$로 나눈 나머지를 구하면? [4.5점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 다항식의 나눗셈 검산식 활용\\n$\\because P(x) = (x-1)Q(x)+4$\\n$\\because Q(2) = 1$\\n$\\implies P(2) = (2-1)Q(2)+4 = 1 \\cdot 1+4$\\n$\\therefore P(2) = 5$"
  },
  {
    "id": 6,
    "level": "중",
    "category": "곱셈 공식",
    "content": "$x+y=1, xy=1$일 때, $x^{5}+y^{5}$의 값은? [4.6점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 차수 확장 공식 적용\\n$\\because x^2+y^2 = (x+y)^2-2xy = 1-2 = -1$\\n$\\because x^3+y^3 = (x+y)^3-3xy(x+y) = 1-3 = -2$\\n$\\implies x^5+y^5 = (x^2+y^2)(x^3+y^3)-x^2y^2(x+y)$\\n$\\therefore (-1)(-2)-(1)^2(1) = 2-1 = 1$"
  },
  {
    "id": 7,
    "level": "상",
    "category": "나머지 정리",
    "content": "다항식 $P(x)=x^{100}+ax+b$가 $(x-1)^{2}$으로 나누어 떨어질 때, 상수 $a, b$에 대하여 $b-a$의 값은? [4.7점]",
    "choices": ["197", "199", "201", "203", "205"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 조립제법 연속 적용을 통한 미정계수 결정\\n$\\because P(1) = 1+a+b = 0 \\implies b = -a-1$\\n$\\implies P(x) = x^{100}-1+a(x-1) = (x-1)(x^{99}+x^{98}+\\dots+1+a)$\\n$\\because (x-1)\\text{으로 한 번 더 나누어 떨어져야 함}$\\n$\\implies 100+a = 0 \\implies a = -100, b = 99$\\n$\\therefore b-a = 99-(-100) = 199$"
  },
  {
    "id": 8,
    "level": "중",
    "category": "나머지 정리",
    "content": "$50^{30}+3$을 $49$로 나누었을 때의 나머지는? [4.8점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 수의 나눗셈을 다항식의 나눗셈으로 치환\\n$\\because 50=x$ 로 치환하면 $49=x-1$\\n$\\implies x^{30}+3$ 을 $x-1$ 로 나눈 나머지는 $1^{30}+3=4$\\n$\\therefore$ 나머지는 $4$"
  },
  {
    "id": 9,
    "level": "중",
    "category": "복소수의 성질",
    "content": "[중] $x^{2}-x+1=0$의 한 허근을 $\\alpha$라 할 때, $\\alpha^{4}+k\\alpha^{2}+1=0$을 만족하는 상수 $k$의 값은? [4.8점]",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 허근의 차수 낮추기 및 복소수의 상등\\n$\\because \\alpha^2-\\alpha+1=0 \\implies \\alpha^2 = \\alpha-1, \\alpha^3 = -1$\\n$\\implies \\alpha^4+k\\alpha^2+1 = \\alpha(\\alpha^3)+k(\\alpha-1)+1$\\n$\\implies -\\alpha+k\\alpha-k+1 = (k-1)\\alpha + (1-k) = 0$\\n$\\therefore k=1$"
  },
  {
    "id": 10,
    "level": "하",
    "category": "복소수의 정의",
    "content": "다음 중 복소수에 대한 설명으로 옳은 것은? [4.0점]",
    "choices": ["$i$는 제곱하면 $1$이다.", "실수는 복소수가 아니다.", "$5i$의 허수 부분은 $5$이다.", "$3+2i$는 $3$보다 큰 수이다.", "$a \\neq 0, b=0$이면 $a+bi$는 허수이다."],
    "answer": "③",
    "solution": "**[Logical Anchor]** 복소수의 체계 및 성질 검증\\n$\\text{i) } i^2 = -1 \\text{ (거짓)}$\\n$\\text{ii) } \\text{실수 } \\subset \\text{ 복소수 (거짓)}$\\n$\\text{iii) } Im(5i) = 5 \\text{ (참)}$\\n$\\text{iv) } \\text{복소수는 대소 관계가 없음 (거짓)}$\\n$\\text{v) } b=0 \\text{ 이면 실수임 (거짓)}$"
  },
  {
    "id": 11,
    "level": "하",
    "category": "복소수의 연산",
    "content": "$(3+5i)-(1-i)(2+2i)=a+bi$ 일 때, 두 실수 $a, b$의 합 $a+b$의 값은? (단, $i=\\sqrt{-1}$) [4.1점]",
    "choices": ["-4", "-2", "0", "2", "4"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 복소수의 사칙연산과 상등\\n$\\implies (1-i)(2+2i) = 2(1-i)(1+i) = 2(1^2+1^2) = 4$\\n$\\implies (3+5i)-4 = -1+5i$\\n$\\because a=-1, b=5$\\n$\\therefore a+b = 4$"
  },
  {
    "id": 12,
    "level": "중",
    "category": "복소수의 연산",
    "content": "[중] 실수 $a$에 대하여 $\\sqrt{\\frac{a+3}{a-3}}=-\\frac{\\sqrt{a+3}}{\\sqrt{a-3}}$ 을 만족하는 정수 $a$의 개수는? [4.3점]",
    "choices": ["3", "4", "5", "6", "7"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 음의 제곱근의 성질(나눗셈) 적용\\n$\\because \\frac{\\sqrt{A}}{\\sqrt{B}} = -\\sqrt{\\frac{A}{B}} \\iff A \\ge 0, B < 0$\\n$\\implies a+3 \\ge 0 \\text{ 이고 } a-3 < 0$\\n$\\implies -3 \\le a < 3$\\n$\\therefore a \\in \\{-3, -2, -1, 0, 1, 2\\} \\implies 6\\text{개}$"
  },
{
    "id": 13,
    "level": "상",
    "category": "이차함수와 이차방정식",
    "content": "[상] 이차함수 $y=f(x)$의 그래프가 오른쪽 그림과 같을 때, 이차방정식 $f(x+1)=0$의 두 실근의 곱은? [4.4점]<br/><div style='text-align:center; margin:10px 0;'><svg width='300' height='200' viewBox='0 0 300 200' style='background:white;'><line x1='0' y1='140' x2='300' y2='140' stroke='#cccccc' stroke-width='1'/><line x1='150' y1='0' x2='150' y2='200' stroke='#cccccc' stroke-width='1'/><line x1='20' y1='140' x2='280' y2='140' stroke='black' stroke-width='1.5'/><line x1='150' y1='180' x2='150' y2='20' stroke='black' stroke-width='1.5'/><text x='285' y='155' font-size='12' font-style='italic'>x</text><text x='160' y='15' font-size='12' font-style='italic'>y</text><text x='135' y='155' font-size='12'>O</text><path d='M 70 40 Q 180 340 290 40' fill='none' stroke='black' stroke-width='2'/><circle cx='110' cy='140' r='3' fill='black'/><text x='100' y='130' font-size='12' font-weight='bold'>-2</text><circle cx='250' cy='140' r='3' fill='black'/><text x='255' y='130' font-size='12' font-weight='bold'>5</text></svg></div>",
    "choices": ["-12", "-10", "-8", "-6", "-4"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 함수의 평행이동과 근의 변화 분석\\n$\\because f(x)=0$ 의 근은 $x=-2, 5$ (그래프 참조)\\n$\\implies f(x+1)=0$ 의 근은 $x+1=-2, x+1=5$\\n$\\implies x=-3, 4$\\n$\\therefore (-3) \\times 4 = -12$"
  },
  {
    "id": 14,
    "level": "상",
    "category": "이차방정식의 판별식",
    "content": "[상] $x$에 대한 이차방정식 $2x^2-6x-k=0$은 실근을 갖고, $x^2+2kx+k^2-k+1=0$은 허근을 갖도록 하는 정수 $k$의 최댓값은? [4.5점]",
    "choices": ["-1", "0", "1", "2", "3"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 판별식 조건 만족 범위 산출\\n$\\because D_1/4 = 9-2(-k) \\ge 0 \\implies k \\ge -4.5$\\n$\\because D_2/4 = k^2-(k^2-k+1) < 0 \\implies k < 1$\\n$\\implies -4.5 \\le k < 1$\\n$\\therefore \\text{정수 } k \\text{ 의 최댓값은 } 0$"
  },
  {
    "id": 15,
    "level": "중",
    "category": "복소수의 연산",
    "content": "$i+2i^{2}+3i^{3}+4i^{4}+\\dots+48i^{48}=a+bi$를 만족하는 두 실수 $a, b$에 대하여 $a-b$의 값은? [4.6점]",
    "choices": ["0", "24", "48", "72", "96"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 복소수 수열의 주기적 합 계산\\n$\\because i^{n}$ 은 4개를 주기로 반복됨\\n$\\implies (i-2-3i+4) + (5i-6-7i+8) + \\dots$\\n$\\implies (2-2i) \\times (48 \\div 4) = 12(2-2i) = 24-24i$\\n$\\because a=24, b=-24$\\n$\\therefore a-b = 24-(-24) = 48$"
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차함수와 직선",
    "content": "[상] $x$에 대한 이차함수 $y=x^{2}-2kx+k^{2}+3k$의 그래프와 직선 $y=ax+b$가 $k$의 값에 관계없이 항상 접할 때, $a+b$의 값은? (단, $a, b$는 상수) [4.6점]",
    "choices": ["$\\frac{1}{16}$", "$\\frac{1}{8}$", "$\\frac{1}{4}$", "$\\frac{3}{4}$", "$\\frac{7}{8}$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 판별식 $D=0$이 $k$에 대한 항등식임을 이용\\n$\\implies x^{2}-(2k+a)x+(k^{2}+3k-b)=0$\\n$\\implies D = (2k+a)^{2}-4(k^{2}+3k-b) = 0$\\n$\\implies (4a-12)k + (a^{2}+4b) = 0$\\n$\\because 4a-12=0, a^{2}+4b=0 \\implies a=3, b=-\\frac{9}{4}$\\n$\\therefore a+b = 3-\\frac{9}{4} = \\frac{3}{4}$"
  },
  {
    "id": 17,
    "level": "중",
    "category": "이차식의 작성",
    "content": "[중] 이차방정식 $x^2-2x+3=0$의 두 근 $\\alpha, \\beta$에 대하여 $f(\\alpha)=f(\\beta)=\\alpha\\beta, f(1)=2$를 만족시키는 이차식 $f(x)$에 대하여 $f(5)$의 값은? [4.7점]",
    "choices": ["-15", "-6", "8", "12", "15"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 인수정리를 활용한 이차식 $f(x)$ 구성\\n$\\because \\alpha+\\beta=2, \\alpha\\beta=3$\\n$\\implies f(\\alpha)=3, f(\\beta)=3 \\implies f(x)-3 = p(x-\\alpha)(x-\\beta)$\\n$\\implies f(x) = p(x^2-2x+3)+3$\\n$\\because f(1) = 2p+3 = 2 \\implies p = -\\frac{1}{2}$\\n$\\therefore f(5) = -\\frac{1}{2}(25-10+3)+3 = -6$"
  },
  {
    "id": 18,
    "level": "상",
    "category": "이차함수의 최대최소",
    "content": "[상] 다음 그림과 같이 한 변의 길이가 8인 정사각형 $ABCD$에 $DE=4, DF=3$이 되도록 점 $E, F$가 각각 변 $AD$와 $CD$ 위에 있다. 선분 $EF$ 위에 한 점 $P$를 잡고 점 $P$에서 변 $AB, BC$에 내린 수선의 발을 각각 $M, N$이라 할 때, 사각형 $PMBN$의 넓이의 최댓값은? [4.8점]<br/><div style='text-align:center; margin:10px 0;'><svg width='300' height='300' viewBox='-20 -20 340 340' style='background:white;'><rect x='0' y='0' width='300' height='300' fill='none' stroke='black' stroke-width='2'/><text x='-15' y='15' font-size='14'>A</text><text x='-15' y='315' font-size='14'>B</text><text x='305' y='315' font-size='14'>C</text><text x='305' y='15' font-size='14'>D</text><circle cx='300' cy='150' r='3' fill='black'/><text x='310' y='155' font-size='14'>E</text><circle cx='187.5' cy='0' r='3' fill='black'/><text x='180' y='-5' font-size='14'>F</text><line x1='300' y1='150' x2='187.5' y2='0' stroke='black' stroke-width='2'/><circle cx='243.75' cy='75' r='4' fill='black'/><text x='250' y='70' font-size='14' font-weight='bold'>P</text><line x1='243.75' y1='75' x2='0' y2='75' stroke='black' stroke-width='1' stroke-dasharray='4'/><line x1='243.75' y1='75' x2='243.75' y2='300' stroke='black' stroke-width='1' stroke-dasharray='4'/><text x='-15' y='80' font-size='14'>M</text><text x='238' y='320' font-size='14'>N</text><rect x='0' y='75' width='243.75' height='225' fill='#f0f0f0' stroke='black' stroke-width='1.5'/><text x='150' y='320' font-size='14' text-anchor='middle'>8</text></svg></div>",
    "choices": ["39", "$\\frac{118}{3}$", "$\\frac{119}{3}$", "40", "$\\frac{121}{3}$"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 좌표평면 도입 및 이차함수 최대치 산출\\n$\\implies D(0,0), E(3,0), F(0,4)$ 로 설정 (직선 $EF: \\frac{x}{3} + \\frac{y}{4} = 1$)<br/>$\\implies P(t, 4 - \\frac{4}{3} t), \\text{ 사각형 가로 } = 8-t, \\text{ 세로 } = 4+\\frac{4}{3} t$\\n$\\implies S(t) = (8-t)(4+\\frac{4}{3} t) = -\\frac{4}{3}(t-\\frac{5}{2})^{2} + \\frac{121}{3}$<br/>$\\therefore$ 최댓값은 $\\frac{121}{3}$"
  },
  {
    "id": 19,
    "level": "하",
    "category": "인수분해",
    "content": "[서술형 1] 다항식 $P(x)=x^3-x^2-4x+4$를 인수분해하시오. [4점]",
    "answer": "(x-1)(x-2)(x+2)",
    "solution": "**[Logical Anchor]** 공통인수 묶기 또는 인수정리 적용\\n$\\implies x^2(x-1)-4(x-1)$\\n$\\implies (x^2-4)(x-1)$\\n$\\therefore (x-2)(x+2)(x-1)$"
  },
  {
  "id": 20,
  "level": "중",
  "tags": ["중"],
  "category": "나머지 정리",
  "content": "[서술형 2] 다항식 $P(x)$가 다음 두 조건을 만족한다.\\n\\n가) $P(x)$는 $x+1$로 나누어 떨어진다.\\n나) $P(x)$를 $x^2$으로 나눈 몫과 나머지가 같다.\\n\\n$P(1)=8$일 때, $P(2)$의 값을 구하시오. [6점]",
  "answer": "30",
  "solution": "**[Logical Anchor]** 검산식의 구조화와 인수정리의 결합\\n1. **[식의 구성]** 조건 (나)에서 몫과 나머지를 $ax+b$($a, b$는 상수)라 하면\\n$P(x) = x^2(ax+b) + (ax+b) = (x^2+1)(ax+b)$ 이다.\\n2. **[미정계수 결정]** 조건 (가)에서 $P(-1)=0$이므로\\n$P(-1) = ((-1)^2+1)(-a+b) = 2(b-a) = 0 \\implies a=b$\\n즉, $P(x) = a(x^2+1)(x+1)$ 이다.\\n3. **[최종 산출]** $P(1)=8$이므로 $a(1^2+1)(1+1) = 4a = 8 \\implies a=2$\\n따라서 $P(x) = 2(x^2+1)(x+1)$ 이며,\\n$P(2) = 2(2^2+1)(2+1) = 2 \\times 5 \\times 3 = 30$ 이다.",
  "error_check": {
    "substitution": "P(x)=2(x^2+1)(x+1)에 x=1 대입 시 2(2)(2)=8 성립 확인",
    "calculation": "P(-1)=2(2)(0)=0으로 조건 (가) 만족, x^2으로 나눌 시 몫과 나머지 모두 2x+2로 조건 (나) 만족",
    "result": "P(2)=30 산출 완료"
  }
  }
  ,
  {
    "id": 21,
    "level": "중",
    "category": "복소수의 상등",
    "content": "[서술형 3] 복소수 $z=(2x^2+9x-5)+(x^2-25)i$ 에 대하여 $\\bar{z}=z$를 만족시키는 0이 아닌 실수 $x$의 값을 구하시오. [5점]",
    "answer": "5",
    "solution": "**[Logical Anchor]** 실수 조건($Im(z)=0$) 및 영복소수 제외\\n$\\because \\bar{z}=z \\implies x^2-25=0 \\implies x=5, -5$\\n$\\text{ii) } x=-5 \\text{ 일 때 } Re(z) = 0 \\implies z=0$\\n$\\therefore x=5$"
  },
  {
    "id": 22,
    "level": "상",
    "category": "이차함수의 최대최소",
    "content": "[서술형 4] $-2 \\le x \\le 3$에서 $f(x)=x^2-4x+a$의 최댓값과 최솟값의 곱이 $-64$일 때, 상수 $a$의 값을 구하시오. [5점]",
    "answer": "-4",
    "solution": "**[Logical Anchor]** 제한된 범위 내 이차함수의 극값 계산\\n$\\because f(x) = (x-2)^2+a-4$\\n$\\implies m = f(2) = a-4, M = f(-2) = a+12$\\n$\\implies (a-4)(a+12) = -64 \\implies (a+4)^2 = 0$\\n$\\therefore a=-4$"
  }
];