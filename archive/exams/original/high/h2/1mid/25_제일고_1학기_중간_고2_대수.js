window.examTitle = "25_제일고_1학기_중간_고2_대수";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "지수함수의 성질",
    "originalCategory": "지수함수의 성질",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-02",
    "standardUnit": "지수함수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수",
      "지수",
      "함수",
      "그래프",
      "참거짓",
      "오류판별",
      "조건해석"
    ],
    "wide": false,
    "solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q1-solution.svg",
    "solutionImageAlt": "지수함수 y=a^x의 그래프가 y축과 만나는 점 (0,1)을 지나고 y=0을 수평점근선으로 가지며, 정의역이 실수 전체이고 치역이 y>0임을 정리해 보여준다.",
    "solutionImageCaption": "exp_basic",
    "solutionImageSize": "full",
    "solutionImageStatus": "asset_verified",
    "content": "지수함수 $y=a^{x}(a>0, a\\ne 1)$의 그래프의 성질로 옳지 않은 것은? (3점)",
    "choices": [
      "정의역은 실수 전체의 집합이다.",
      "치역은 양의 실수 전체의 집합이다.",
      "$a>1$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.",
      "$0<a<1$일 때, $x$의 값이 증가하면 $y$의 값은 감소한다.",
      "그래프는 점 $(0,1)$을 지나고, $y$축을 점근선으로 갖는다."
    ],
    "answer": "⑤",
    "solution": "<b>[논리 분석]</b> 지수함수의 기본 그래프 개형 및 점근선 분석\n이유: 지수함수 $y=a^x$는 $x$축($y=0$)을 점근선으로 가짐\n근거: $x$값이 한없이 작아지거나 커질 때 $y$값은 0에 수렴하지만 닿지 않음\n결론적으로 $y$축을 점근선으로 갖는다는 설명은 옳지 않음",
    "subUnitKey": "H22-A-02-EXPONENTIAL_FUNCTION",
    "subUnit": "지수함수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 2,
    "level": "하",
    "category": "로그함수의 평행이동",
    "originalCategory": "로그함수의 평행이동",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-03",
    "standardUnit": "로그함수",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": ["객관식","계수비교","로그함수","로그","함수","그래프","계산","개념"],
    "wide": false,
    "content": "함수 $y=\\log_{3}(x+1)-1$의 그래프는 $y=\\log_{3}x$의 그래프를 $x$축으로 $a$만큼, $y$축으로 $b$만큼 평행이동 한 것이다. $a+b$의 값은? (3점)",
    "choices": ["-2","-1","0","1","2"],
    "answer": "①",
    "solution": "<b>[논리 분석]</b> 평행이동 정의를 이용한 계수 비교\n이유: $y = \\log_3(x - (-1)) + (-1)$ 꼴로 변형됨\n근거: $x$축 이동량 $a=-1$, $y$축 이동량 $b=-1$임\n결론적으로 $a+b = -1 + (-1) = -2$",
    "subUnitKey": "H22-A-03-LOGARITHMIC_FUNCTION","subUnit": "로그함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 3,"level": "하","category": "로그방정식","originalCategory": "로그방정식","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","로그","지수","조건해석","개념"],"wide": false,
    "content": "방정식 $\\log_{4}(3x+10)=2\\log_{4}x$의 해는? (3.3점)","choices": ["-2","1","3","5","8"],"answer": "④","solution": "<b>[논리 분석]</b> 진수 조건 확인 및 로그 성질 적용\n이유: 진수 조건 $x>0$을 반드시 만족해야 함\n근거: $\\log_4(3x+10) = \\log_4 x^2$에서 $x^2-3x-10=0$이 도출됨\n정리하면 $(x-5)(x+2)=0$에서 $x=5$만 해로 인정됨","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 4,"level": "하","category": "거듭제곱근의 연산","originalCategory": "거듭제곱근의 연산","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","제곱근","근호","지수","계산","개념"],"wide": false,"content": "$\\frac{\\sqrt[4]{32}}{\\sqrt[4]{\\sqrt{4}}}$ 의 값은? (3.3점)","choices": ["$\\sqrt{2}$","2","$2\\sqrt{2}$","4","$4\\sqrt{2}$"],"answer": "②","solution": "<b>[논리 분석]</b> 거듭제곱근을 지수 법칙으로 변환하여 계산\n이유: 분자는 $2^{\\frac{5}{4}}$, 분모는 $\\sqrt[8]{2^2} = 2^{\\frac{1}{4}}$임\n근거: 나눗셈은 지수의 차이므로 $2^{\\frac{5}{4} - \\frac{1}{4}} = 2^1$\n결론적으로 2","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 5,"level": "중","category": "로그의 성질","originalCategory": "로그의 성질","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","상용로그","로그","조건해석","개념","응용"],"wide": false,"content": "$\\log 2=a, \\log 3=b$일 때, $\\log_{6}50$을 $a, b$에 대한 식으로 나타내면? (3.3점)","choices": ["$\\frac{a-b}{a+b}$","$\\frac{2-a}{a+b}$","$\\frac{2-a}{a-b}$","$\\frac{1-a}{a-b}$","$\\frac{1-a}{a+b}$"],"answer": "②","solution": "<b>[논리 분석]</b> 밑 변환 공식 및 상용로그 성질 활용\n이유: $\\log_6 50 = \\frac{\\log 50}{\\log 6}$으로 변환 가능함\n근거: $\\log 50 = 2 - \\log 2 = 2-a$이고 $\\log 6 = a+b$임\n결론적으로 $\\frac{2-a}{a+b}$","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 6,"level": "중","category": "삼각함수의 사분면","originalCategory": "삼각함수의 사분면","standardCourse": "대수","standardUnitKey": "H22-A-04","standardUnit": "삼각함수","standardUnitOrder": 4,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","삼각함수","함수","조건해석","계산"],"wide": false,"content": "다음을 만족시키는 $\\theta$와 같은 사분면에 속하는 각은? (3.3점)<br>$\\sin \\theta \\cos \\theta > 0, \\sin \\theta \\tan \\theta < 0$","choices": ["$-\\frac{9}{5}\\pi$","$-\\frac{1}{4}\\pi$","$\\frac{2}{3}\\pi$","$\\frac{4}{3}\\pi$","$\\frac{7}{4}\\pi$"],"answer": "④","solution": "<b>[논리 분석]</b> 삼각함수 부호를 통한 사분면 판정\n이유: $\\sin \\theta \\cos \\theta > 0$는 제1, 3사분면을 의미함\n근거: $\\sin \\theta \\tan \\theta = \\frac{\\sin^2 \\theta}{\\cos \\theta} < 0$에서 $\\cos \\theta < 0$이므로 제3사분면임\n결론적으로 제3사분면 각인 $\\frac{4}{3}\\pi$가 정답임","subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC","subUnit": "삼각함수의 기본","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate",
    "solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q6-solution.svg",
    "solutionImageAlt": "반지름 1인 단위원 위 제3사분면에 점 P가 있고, 원점에서 P로 향하는 동경과 P에서 x축으로 내린 점선, 각 θ가 표시되어 있다. P의 좌표가 적혀 있다.",
    "solutionImageCaption": "sinθcosθ>0이면 sinθ와 cosθ의 부호가 같으므로 θ는 제1사분면 또는 제3사분면의 각이다. sinθ tanθ=sin²θ/cosθ<0이면 cosθ<0이므로 제3사분면이다. 그림은 제3사분면의 한 예로 θ=4π/3(240°)의 동경과 점 P(−1/2, −√3/2)를 나타낸다. 4π/3가 제3사분면의 각이므로 답은 ④이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 7,"level": "중","category": "로그함수의 점근선","originalCategory": "로그함수의 점근선","standardCourse": "대수","standardUnitKey": "H22-A-03","standardUnit": "로그함수","standardUnitOrder": 3,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","로그함수","로그","함수","그래프","표해석","좌표","대입"],"wide": false,"solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q7-solution.svg","solutionImageAlt": "로그함수 y=log₃(x−1)의 수직점근선 x=1과, x축 위의 점 (1,0)을 지나는 지수함수 y=2⁻ˣ+t의 그래프를 함께 그려 t=−1/2임을 보여준다.","solutionImageCaption": "log_line","solutionImageSize": "full","solutionImageStatus": "asset_verified","content": "함수 $y=\\log_{3}(x-1)$의 점근선과 함수 $y=2^{-x}+t$의 그래프가 만나는 점이 $x$축 위에 있을 때, 상수 $t$의 값은? (4점)","choices": ["1","$\\frac{1}{2}$","$-\\frac{1}{2}$","-1","-2"],"answer": "③","solution": "<b>[논리 분석]</b> 점근선 방정식 산출 및 교점 좌표 대입\n이유: $\\log_3(x-1)$의 점근선은 진수가 0인 $x=1$임\n근거: $x$축 위에서의 교점은 $(1, 0)$이므로 이를 $y=2^{-x}+t$에 대입함\n정리하면 $0 = \\frac{1}{2} + t$에서 $t = -\\frac{1}{2}$","subUnitKey": "H22-A-03-LOGARITHMIC_FUNCTION","subUnit": "로그함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 8,"level": "중","category": "지수 법칙의 응용","originalCategory": "지수 법칙의 응용","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","로그","지수","대입","조건해석","계산","응용"],"wide": false,"content": "$4^{\\frac{1}{a}}=25^{\\frac{1}{b}}=k$이고 $a+b=\\frac{1}{3}$일 때, $\\log k$의 값은? (4.1점)","choices": ["3","4","5","6","7"],"answer": "④","solution": "<b>[논리 분석]</b> 밑이 동일한 지수식으로 변형 및 조건 대입\n이유: $k^a = 4, k^b = 25$에서 $k^{a+b} = 100$이 성립함\n근거: $k^{\\frac{1}{3}} = 10^2$이므로 $k = 10^6$임\n결론적으로 $\\log 10^6 = 6$","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 9,"level": "중","category": "로그함수의 평행이동과 대칭이동","originalCategory": "로그함수의 평행이동과 대칭이동","standardCourse": "대수","standardUnitKey": "H22-A-03","standardUnit": "로그함수","standardUnitOrder": 3,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","지수함수","로그함수","로그","지수","함수","그래프","조건해석"],"wide": false,"content": "다음 중 함수 $y=\\log_{3}x$ 의 그래프를 평행이동 또는 대칭이동하여 겹쳐지지 않는 것은? (4.1점)","choices": ["$y=3^{2x}-1$","$y=(\\frac{1}{3})^{x-1}$","$y=\\log_{3}9x$","$y=\\log_{\\frac{1}{3}}x$","$y=\\log_{3}(x+1)$"],"answer": "①","solution": "<b>[논리 분석]</b> 로그함수와 지수함수의 평행이동 및 대칭이동 조건 분석\n이유: $y=\\log_{3}x$와 포개어지려면 밑이 $3$ 또는 $\\frac{1}{3}$이어야 하며, 지수함수 형태일 경우 역함수 관계를 통해 밑이 $3$ 또는 $\\frac{1}{3}$인 형태여야 함\n근거: ① $y=3^{2x}-1 = 9^{x}-1$은 밑이 $9$이므로 평행이동이나 대칭이동으로 밑이 $3$인 로그함수와 겹칠 수 없음\n결론적으로 ①이 겹쳐지지 않음","subUnitKey": "H22-A-03-LOGARITHMIC_FUNCTION","subUnit": "로그함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate",
    "solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q9-solution.svg",
    "solutionImageAlt": "해설 그림: 오른쪽으로 완만히 올라가는 파란 로그 곡선 f와 같은 모양으로 위에 놓인 초록 곡선 h, 왼쪽 아래에서 가파르게 올라오는 주황 지수 곡선 g가 있다. 점 P, Q의 좌표가 표시되어 있다.",
    "solutionImageCaption": "f는 y=log₃x, h는 y=log₃9x=log₃x+2이고 g는 y=3²ˣ−1=9ˣ−1의 그래프이다. h는 f를 y축 방향으로 2만큼 평행이동한 것이라 점 P(1, 0)이 Q(1, 2)로 옮겨져 포개진다. g의 역함수는 밑이 9인 로그함수여서 밑이 3인 f를 평행이동·대칭이동해도 g와 겹치지 않는다. 따라서 답은 ①이다.",
    "solutionImageSize": "full",
    "solutionImageScale": 80
  },
  {
    "id": 10,"level": "중","category": "로그의 정의","originalCategory": "로그의 정의","standardCourse": "대수","standardUnitKey": "H22-A-03","standardUnit": "로그함수","standardUnitOrder": 3,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","판별식","로그","부등식","정수조건","범위","개수세기","조건해석"],"wide": false,"content": "모든 실수 $x$ 에 대하여 $\\log_{a}(x^{2}+ax+2a)$ 의 값이 존재하도록 하는 모든 정수 $a$ 의 개수는? (4.2점)","choices": ["4개","5개","6개","7개","8개"],"answer": "③","solution": "<b>[논리 분석]</b> 로그의 밑과 진수 조건 수립 및 절대부등식 판정\n이유: 밑 조건 $a>0, a\\neq 1$과 진수 조건 $x^{2}+ax+2a>0$이 모든 실수 $x$에 대해 성립해야 함\n근거: 이차부등식이 항상 성립하려면 판별식 $D = a^{2}-8a < 0$이어야 하므로 $0 < a < 8$임\n정리하면 범위 내 정수 $a$는 $1, 2, 3, 4, 5, 6, 7$이며 이 중 $a\\neq 1$이므로 $2, 3, 4, 5, 6, 7$의 6개임","subUnitKey": "H22-A-03-LOGARITHMIC_FUNCTION","subUnit": "로그함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 11,"level": "중","category": "지수와 로그의 대수 비교","originalCategory": "지수와 로그의 대수 비교","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","제곱근","근호","로그","지수","참거짓","계산"],"wide": false,"content": "다음 수 중 가장 큰 수를 $A$, 가장 작은 수를 $B$ 라고 할 때, $\\log_{2}\\frac{A}{B}$ 의 값으로 옳은 것은? (4.2점)<br>$\\frac{1}{\\sqrt[3]{8}}$, $\\frac{1}{\\sqrt[4]{16}}$, $0.125^{\\frac{2}{3}}$, $(\\frac{1}{32})^{0.3}$, $\\sqrt[5]{0.5^{4}}$","choices": ["$\\frac{2}{3}$","$\\frac{3}{4}$","$\\frac{5}{6}$","$\\frac{4}{3}$","$\\frac{3}{2}$"],"answer": "④","solution": "<b>[논리 분석]</b> 거듭제곱의 밑을 통일하여 지수 크기 비교\n이유: 각 수를 밑 $2$인 지수 형태로 변환하면 $2^{-\\frac{2}{3}}, 2^{-1}, 2^{-2}, 2^{-1.5}, 2^{-0.8}$임\n근거: 지수를 비교하면 $-\\frac{2}{3}$가 가장 크고 $-2$가 가장 작으므로 $A=2^{-\\frac{2}{3}}, B=2^{-2}$임\n결론적으로 $\\log_{2}\\frac{2^{-\\frac{2}{3}}}{2^{-2}} = -\\frac{2}{3} - (-2) = \\frac{4}{3}$임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 12,"level": "중","category": "부채꼴의 호의 길이와 넓이","originalCategory": "부채꼴의 호의 길이와 넓이","standardCourse": "대수","standardUnitKey": "H22-A-04","standardUnit": "삼각함수","standardUnitOrder": 4,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","이차함수","최대최소","삼각함수","함수","도형","원","넓이"],"wide": false,"content": "둘레의 길이가 16인 부채꼴 중에서 그 넓이가 최대인 부채꼴의 반지름의 길이는? (4.2점)","choices": ["4","5","6","7","8"],"answer": "①","solution": "<b>[논리 분석]</b> 부채꼴의 둘레 조건을 이용한 넓이 함수 최대값 탐색\n이유: $2r+l=16 \\implies l=16-2r$이고, 넓이 $S = \\frac{1}{2}rl = \\frac{1}{2}r(16-2r) = 8r-r^{2}$임\n근거: 이차함수 $S = -(r-4)^{2}+16$은 $r=4$일 때 최대값을 가짐\n결론적으로 반지름의 길이는 4임","subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC","subUnit": "삼각함수의 기본","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate",
    "solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q12-solution.svg",
    "solutionImageAlt": "해설 그림: r가 0에서 8 사이일 때 위로 볼록한 포물선 S가 그려져 있고 꼭짓점 V의 좌표가 표시되어 있다.",
    "solutionImageCaption": "S는 반지름 r에 따른 부채꼴의 넓이이다. 둘레가 16이면 호의 길이는 l=16−2r이므로 S=(1/2)r(16−2r)=−(r−4)²+16이다. 그래프의 꼭짓점 V(4, 16)에서 넓이가 최대이므로 반지름은 4이고 이때 호의 길이는 8이다. 따라서 답은 ①이다.",
    "solutionImageSize": "full"
  },
  {
    "id": 13,
    "level": "중",
    "category": "지수함수와 로그함수의 관계",
    "originalCategory": "지수함수와 로그함수",
    "standardCourse": "대수",
    "standardUnitKey": "H22-A-01",
    "standardUnit": "지수와 로그",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수",
      "로그함수",
      "로그",
      "지수",
      "함수",
      "도형",
      "원"
    ],
    "wide": false,
    "solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q13-restored-solution.svg",
    "solutionImageAlt": "원점 위에서 세로축을 지나고 가로축 아래의 수평점근선에 가까워지는 감소 지수함수의 그래프.",
    "solutionImageCaption": "양의 y절편과 음의 수평점근선을 갖는 감소 지수함수",
    "solutionImageSize": "full",
    "solutionImageStatus": "asset_verified",
    "content": "1이 아닌 두 양수 $a, b$에 대하여 두 함수 $y=\\log_a x$와 $y=\\log_b x$의 그래프가 다음 그림과 같을 때, 함수 $y=\\left(\\dfrac{a}{b}\\right)^x-b^a$의 그래프의 개형으로 가장 알맞은 것은? (4.2점)<br><img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4.svg\" alt=\"점 (1, 0)에서 만나는 두 감소 로그함수. x가 1보다 큰 쪽에서 밑이 a인 곡선이 밑이 b인 곡선보다 위에 있다.\" style=\"width:285px;max-width:100%;height:auto;\">",
    "choices": [
      "<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-1.svg\" alt=\"증가하고 y축을 원점 위에서 지나는 그래프\" style=\"width:130px;max-width:100%;height:auto;\">",
      "<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-2.svg\" alt=\"증가하고 y축을 원점 아래에서 지나는 그래프\" style=\"width:130px;max-width:100%;height:auto;\">",
      "<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-3.svg\" alt=\"감소하고 원점을 지나는 그래프\" style=\"width:130px;max-width:100%;height:auto;\">",
      "<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-4.svg\" alt=\"감소하고 y축을 원점 아래에서 지나는 그래프\" style=\"width:130px;max-width:100%;height:auto;\">",
      "<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-5.svg\" alt=\"감소하고 y축을 원점 위에서 지나는 그래프\" style=\"width:130px;max-width:100%;height:auto;\">"
    ],
    "answer": "⑤",
    "solution": "두 로그함수의 그래프가 모두 감소하므로 $0<a<1$, $0<b<1$이다. $x>1$에서 $\\log_a x>\\log_b x$이므로 $\\dfrac{1}{\\ln a}>\\dfrac{1}{\\ln b}$이다. $\\ln a$와 $\\ln b$가 모두 음수이므로 $\\ln a<\\ln b$, 즉 $a<b$이다.\n\n따라서 $0<\\dfrac ab<1$이므로 $y=\\left(\\dfrac ab\\right)^x-b^a$의 그래프는 감소한다. 또 $0<b^a<1$이므로 $y$절편은 $1-b^a>0$이고, 수평점근선은 $y=-b^a<0$이다.\n\n원점 위에서 $y$축을 지나며 $x$가 커질수록 $x$축 아래의 수평점근선에 가까워지는 그래프는 ⑤이다.",
    "subUnitKey": "H22-A-01-LOGARITHMIC_FUNCTION",
    "subUnit": "로그함수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 14,"level": "중","category": "로그의 실생활 응용","originalCategory": "로그의 실생활 응용","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","제곱근","근호","로그","실생활","조건해석","계산","응용"],"wide": false,"content": "층간소음은 소리의 세기에 따른 소리의 크기로 측정할 수 있다. 소리의 세기가 $I$ W/m$^2$일 때, 소리의 크기 $D$ dB는 $D = 10 \\log \\frac{I}{10^{-12}}$라고 한다. 스피커 음악 소리의 크기는 85dB이고 망치질 소리의 크기는 60dB일 때, 스피커 음악의 소리의 세기는 망치질 소리의 세기의 몇 배인가? (4.3점)","choices": ["$\\sqrt{10}$","10","$10\\sqrt{10}$","100","$100\\sqrt{10}$"],"answer": "⑤","solution": "<b>[논리 분석]</b> 로그 방정식의 차를 이용한 세기 비율 계산\n이유: $85 = 10 \\log \\frac{I_{1}}{10^{-12}}, 60 = 10 \\log \\frac{I_{2}}{10^{-12}}$이므로 두 식을 빼면 $25 = 10 \\log \\frac{I_{1}}{I_{2}}$임\n근거: $\\log \\frac{I_{1}}{I_{2}} = 2.5 \\implies \\frac{I_{1}}{I_{2}} = 10^{2.5} = 10^{2}\\cdot 10^{0.5} = 100\\sqrt{10}$임\n결론적으로 스피커 음악 세기는 망치질 세기의 $100\\sqrt{10}$배임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 15,"level": "상","category": "이차방정식과 로그","originalCategory": "이차방정식과 로그","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","계수비교","이차방정식","판별식","근과계수","로그","지수","조건해석"],"wide": false,"content": "$a>2$ 인 상수 $a$ 에 대하여 두 수 $\\log_{2}a, \\log_{a}8$ 이 $x$ 에 대한 이차방정식 $x^2-4x+k=0$ 의 두 실근일 때, $a+k$ 의 값은? (4.4점)","choices": ["11","12","13","14","15"],"answer": "①","solution": "<b>[논리 분석]</b> 근과 계수의 관계 및 밑 변환 공식을 이용한 미지수 결정\n이유: 두 근의 합 $\\log_{2}a + \\log_{a}8 = \\log_{2}a + \\frac{3}{\\log_{2}a} = 4$임\n근거: $\\log_{2}a = t$라 하면 $t^{2}-4t+3=0$에서 $t=1, 3$인데 $a>2$이므로 $t=3$임\n정리하면 $a=2^{3}=8$이고, 두 근의 곱 $k = \\log_{2}a \\times \\frac{3}{\\log_{2}a} = 3$이므로 $a+k=11$임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 16,"level": "중","category": "삼각함수 사이의 관계","originalCategory": "삼각함수 사이의 관계","standardCourse": "대수","standardUnitKey": "H22-A-04","standardUnit": "삼각함수","standardUnitOrder": 4,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","제곱근","근호","삼각함수","함수","조건해석","계산","응용"],"wide": false,"content": "$\\theta$ 가 제1사분면의 각이고 $\\sin\\theta - \\cos\\theta = \\frac{\\sqrt{3}}{3}$ 일 때, $\\tan\\theta + \\frac{1}{\\tan\\theta}$ 의 값은? (4.4점)","choices": ["1","2","3","4","5"],"answer": "③","solution": "<b>[논리 분석]</b> 삼각함수의 합/차와 탄젠트 역수의 관계 활용\n이유: $\\tan\\theta + \\frac{1}{\\tan\\theta} = \\frac{\\sin\\theta}{\\cos\\theta} + \\frac{\\cos\\theta}{\\sin\\theta} = \\frac{\\sin^{2}\\theta+\\cos^{2}\\theta}{\\sin\\theta\\cos\\theta} = \\frac{1}{\\sin\\theta\\cos\\theta}$임\n근거: 주어진 식을 제곱하면 $1-2\\sin\\theta\\cos\\theta = \\frac{3}{9} = \\frac{1}{3} \\implies \\sin\\theta\\cos\\theta = \\frac{1}{3}$임\n결론적으로 구하는 값은 $\\frac{1}{\\frac{1}{3}} = 3$임","subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC","subUnit": "삼각함수의 기본","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 17,"level": "상","category": "거듭제곱근의 정의","originalCategory": "거듭제곱근의 정의","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","제곱근","근호","지수","자연수조건","개수세기","조건해석","계산"],"wide": false,"content": "자연수 $n(n \\ge 2)$ 에 대하여 $n^2-3n$의 $n$제곱근 중 실수인 것의 개수를 $f(n)$이라 하자. $f(2)+f(3)+f(4)+f(5)+f(6)$의 값은? (4.5점)","choices": ["2","3","4","5","6"],"answer": "⑤","solution": "<b>[논리 분석]</b> 실수인 거듭제곱근의 개수 판정\n이유: $n$이 짝수일 때 $a>0$이면 2개, $a=0$이면 1개, $a<0$이면 0개임. $n$이 홀수일 때 $a$의 부호와 상관없이 항상 1개임\n근거: $f(2)$는 $(-2)$의 2제곱근(0개), $f(3)$은 $0$의 3제곱근(1개), $f(4)$는 $4$의 4제곱근(2개), $f(5)$는 $10$의 5제곱근(1개), $f(6)$은 $18$의 6제곱근(2개)임\n결론적으로 $0+1+2+1+2 = 6$","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 18,"level": "중","category": "지수함수의 그래프와 교점","originalCategory": "지수함수와 로그함수","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","지수함수","로그함수","로그","지수","연립방정식","함수","그래프"],"wide": false,"solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q18-solution.svg","solutionImageAlt": "지수함수 y=t·2ˣ가 y=2⁻ˣ와 만나는 점 P, y=−2ˣ+4와 만나는 점 Q를 표시하고, P와 Q의 x좌표 비가 1:2일 때 t=1/3임을 보여준다.","solutionImageCaption": "exp_three_curves","solutionImageSize": "full","solutionImageStatus": "asset_verified","content": "함수 $y = t \\cdot 2^x$ ($0 < t < 1$)의 그래프가 두 함수 $y = 2^{-x}$, $y = -2^x + 4$의 그래프와 만나는 점을 각각 P, Q라 하자.\\n점 P와 점 Q의 $x$좌표의 비가 $1:2$일 때, $t$의 값은? (4.6점)\\n<img src=\"assets/images/25_제일고_1학기_중간_고2_대수/q18-problem-engine-v3.svg\" alt=\"세 지수함수와 교점 P, Q가 표시된 그래프\" style=\"width:355px;max-width:100%;height:auto;\">","choices": ["① $\\frac{1}{9}$","② $\\frac{1}{5}$","③ $\\frac{1}{4}$","④ $\\frac{1}{3}$","⑤ $\\frac{1}{2}$"],"answer": "④","solution": "세 지수함수의 교점 $P$와 $Q$의 $x$좌표 비율을 이용하여 연립방정식을 세우고 미지수 $t$를 구한다.\\n1. 좌표 설정: 점 $P$의 $x$좌표를 $k$ ($k>0$)라 하면, 점 $Q$의 $x$좌표는 $2k$이다.\\n2. 함숫값 관계식\\n점 $P$: $y=t \\cdot 2^x$와 $y=2^{-x}$의 교점이므로 $t \\cdot 2^k = 2^{-k}$ 이다. 이를 정리하면 $t = 2^{-2k} = \\frac{1}{2^{2k}}$ 이다.\\n점 $Q$: $y=t \\cdot 2^x$와 $y=-2^x+4$의 교점이므로 $t \\cdot 2^{2k} = -2^{2k} + 4$ 이다.\\n3. 연립 및 계산: 점 $P$에서 얻은 $2^{2k} = \\frac{1}{t}$을 점 $Q$의 식에 대입하면 $t \\cdot \\frac{1}{t} = -\\frac{1}{t} + 4$ 이 된다.\\n$1 = -\\frac{1}{t} + 4 \\implies \\frac{1}{t} = 3 \\implies t = \\frac{1}{3}$ 이다.\\n따라서 정답은 ④이다.","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 19,"level": "중","category": "로그부등식의 풀이","originalCategory": "지수함수와 로그함수","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","이차함수","지수함수","로그함수","로그","지수","부등식","함수"],"wide": false,"solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q19-solution-v2.svg","solutionImageAlt": "해설 그림: 아래로 볼록한 포물선 f와 가로선 y=8이 있고, 포물선이 가로축과 만나는 두 점 A, B와 가로선과 만나는 두 점 C, D의 좌표가 표시되어 있다.","solutionImageCaption": "f는 f(x)=(x−2)(x−4)의 그래프로 x절편 A(2, 0), B(4, 0)과 y절편 C(0, 8)을 지난다. 진수 조건 f(x)>0에서 x<2 또는 x>4이고, log₂f(x)≤3에서 f(x)≤8이므로 직선 y=8 아래인 0≤x≤6이다. 두 범위의 공통부분은 0≤x<2 또는 4<x≤6이고 정수는 0, 1, 5, 6이다. 따라서 답은 ②이다.","solutionImageSize": "full","solutionImageStatus": "asset_verified","content": "이차함수 $y = f(x)$의 그래프가 다음 그림과 같이 세 점 $(2, 0)$, $(4, 0)$, $(0, 8)$을 지난다. 부등식 $\\log_2 f(x) \\le 3$을 만족시키는 정수 $x$의 개수는? (4.6점)\\n<svg width=\"200\" height=\"180\" viewBox=\"0 0 200 180\" xmlns=\"http://www.w3.org/2000/svg\">\\n  <line x1=\"20\" y1=\"130\" x2=\"180\" y2=\"130\" stroke=\"black\" stroke-width=\"1\" marker-end=\"url(#arrow)\"/>\\n  <line x1=\"50\" y1=\"160\" x2=\"50\" y2=\"20\" stroke=\"black\" stroke-width=\"1\" marker-end=\"url(#arrow)\"/>\\n  <path d=\"M 40.0,17.5 L 42.73,26.88 L 45.47,35.9 L 48.2,44.53 L 50.94,52.79 L 53.67,60.68 L 56.41,68.2 L 59.14,75.34 L 61.88,82.11 L 64.61,88.5 L 67.35,94.52 L 70.08,100.16 L 72.82,105.43 L 75.55,110.33 L 78.29,114.86 L 81.02,119.0 L 83.76,122.78 L 86.49,126.18 L 89.22,129.21 L 91.96,131.86 L 94.69,134.14 L 97.43,136.05 L 100.16,137.58 L 102.9,138.74 L 105.63,139.52 L 108.37,139.93 L 111.1,139.97 L 113.84,139.63 L 116.57,138.92 L 119.31,137.83 L 122.04,136.38 L 124.78,134.54 L 127.51,132.33 L 130.24,129.75 L 132.98,126.8 L 135.71,123.47 L 138.45,119.77 L 141.18,115.69 L 143.92,111.24 L 146.65,106.41 L 149.39,101.22 L 152.12,95.64 L 154.86,89.7 L 157.59,83.38 L 160.33,76.68 L 163.06,69.61 L 165.8,62.17 L 168.53,54.35 L 171.27,46.16 L 174.0,37.6\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/>\\n  <text x=\"40\" y=\"55\" font-size=\"12px\">8</text>\\n  <text x=\"85\" y=\"145\" font-size=\"12px\">2</text>\\n  <text x=\"125\" y=\"145\" font-size=\"12px\">4</text>\\n  <text x=\"35\" y=\"145\" font-size=\"12px\">O</text>\\n  <text x=\"175\" y=\"145\" font-size=\"12px\">x</text>\\n  <text x=\"55\" y=\"25\" font-size=\"12px\">y</text>\\n  <text x=\"145\" y=\"45\" font-size=\"12px\">y=f(x)</text>\\n  <defs>\\n    <marker id=\"arrow\" markerWidth=\"10\" markerHeight=\"10\" refX=\"0\" refY=\"3\" orient=\"auto\">\\n      <path d=\"M0,0 L0,6 L6,3 z\" fill=\"black\"/>\\n    </marker>\\n  </defs>\\n</svg>","choices": ["① 3","② 4","③ 5","④ 6","⑤ 7"],"answer": "②","solution": "그래프의 정보를 통해 이차함수의 식을 구하고, 로그의 진수 조건과 부등식의 성질을 연립하여 해를 구한다.\\n1. 이차함수의 식 구하기: $x$절편이 $2$와 $4$이므로 $f(x) = a(x-2)(x-4)$라 할 수 있다. 점 $(0, 8)$을 지나므로 $f(0) = a(-2)(-4) = 8a = 8 \\implies a = 1$. 따라서 $f(x) = (x-2)(x-4) = x^2-6x+8$이다.\\n2. 로그의 진수 조건: 로그의 진수는 양수여야 하므로 $f(x) > 0 \\implies (x-2)(x-4) > 0$. 따라서 $x < 2$ 또는 $x > 4$이다.\\n3. 로그부등식 풀이: $\\log_2 f(x) \\le 3 \\implies f(x) \\le 2^3 = 8$이다. $x^2-6x+8 \\le 8 \\implies x^2-6x \\le 0 \\implies x(x-6) \\le 0$. 따라서 $0 \\le x \\le 6$이다.\\n4. 최종 범위 및 정수 개수: 진수 조건과 부등식의 해의 공통 범위는 $0 \\le x < 2$ 또는 $4 < x \\le 6$이다. 이를 만족시키는 정수 $x$는 $0, 1, 5, 6$으로 총 4개이다.\\n따라서 정답은 ②이다.","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 20,"level": "상","category": "지수함수의 활용","originalCategory": "지수함수의 활용","standardCourse": "대수","standardUnitKey": "H22-A-02","standardUnit": "지수함수","standardUnitOrder": 2,"questionType": "객관식","layoutTag": "grid","tags": ["객관식","지수함수","지수","함수","도형","삼각형","사각형","넓이"],"wide": false,"solutionImage": "assets/images/25_제일고_1학기_중간_고2_대수/q20-solution-v2.svg","solutionImageAlt": "해설 그림: 오른쪽 위로 올라가는 파란 지수 곡선 f와 아래쪽에서 올라오는 주황 곡선 g가 있고, 네 점 A, B, C, D를 이은 평행사변형이 색칠되어 있다. 대각선 AC는 점선이고 네 점의 좌표가 표시되어 있다.","solutionImageCaption": "f는 y=2ˣ⁻³+1, g는 y=−8/2ˣ+1의 그래프이고 A, B는 f 위의 점, C, D는 g 위의 점이다. 무게중심 조건에서 x좌표의 합 xA+xB+xD=11, xA+xB+xC=8이므로 xD−xC=3이고 평행사변형 조건에서 xB−xA=−3이다. 이를 곡선 위 점의 조건에 넣어 A(5, 5), B(2, 3/2), C(1, −3), D(4, 1/2)을 얻는다. 넓이는 10이고 답은 ④이다.","solutionImageSize": "full","solutionImageStatus": "asset_verified","content": "함수 $y=2^{x-3}+1$의 그래프 위의 두 점 $A, B$와 함수 $y=-\\frac{8}{2^x}+1$의 그래프 위의 두 점 $C, D$가 다음 조건을 만족시킨다.<br>(가) 사각형 $ABCD$는 평행사변형이다.<br>(나) 삼각형 $ABD$의 무게중심의 $x$좌표는 $\\frac{11}{3}$이고, 삼각형 $ABC$의 무게중심의 $x$좌표는 $\\frac{8}{3}$이다.<br>사각형 $ABCD$의 넓이로 옳은 것은? (단, 선분 $AC$는 평행사변형 $ABCD$의 대각선이다.) (5점)<br>","choices": ["4","6","8","10","12"],"answer": "④","solution": "<b>[논리 분석]</b> 무게중심 좌표와 평행사변형의 평행이동 성질 활용\n이유: $x_A+x_B+x_D=11, x_A+x_B+x_C=8$에서 $x_D-x_C=3$임. 평행사변형 조건에서 $x_B-x_A=x_C-x_D=-3$임\n근거: $x_B=x_A-3, x_D=x_C+3$ 대입 및 $y$좌표 차이 동일성$(y_A-y_B = y_D-y_C)$ 이용 시 $x_A=5, x_C=1$ 도출\n결론적으로 $A(5,5), B(2,1.5), C(1,-3), D(4,0.5)$ 좌표 확정 후 넓이 계산 시 10","subUnitKey": "H22-A-02-EXPONENTIAL_FUNCTION","subUnit": "지수함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate",
    "solutionImageScale": 80
  },
  {
    "id": 21,"level": "중","category": "지수 법칙","originalCategory": "지수 법칙","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "서술형","layoutTag": "grid","tags": ["서술형","제곱근","근호","지수","조건해석","계산"],"wide": false,"content": "[서술형 1]<br>$a^2+a^{-2}$의 값을 구하시오.(6점, 부분점수 있음)<br>(※ 1보다 큰 양수 $a$에 대하여 $a^{\\frac{1}{2}}+a^{-\\frac{1}{2}}=\\sqrt{7}$ 일 때, 다음 물음에 답하시오.)","choices": [],"answer": "23","solution": "<b>[논리 분석]</b> 지수식의 제곱 변형\n이유: $(a^{\\frac{1}{2}}+a^{-\\frac{1}{2}})^2 = a+a^{-1}+2=7$이므로 $a+a^{-1}=5$임\n근거: $a^2+a^{-2} = (a+a^{-1})^2-2 = 25-2=23$임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 22,"level": "중","category": "지수 법칙","originalCategory": "지수 법칙","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "서술형","layoutTag": "grid","tags": ["서술형","제곱근","근호","지수","조건해석","계산"],"wide": false,"content": "[서술형 2]<br>$a-a^{-1}$의 값을 구하시오.(4점, 부분점수 있음)<br>(※ 1보다 큰 양수 $a$에 대하여 $a^{\\frac{1}{2}}+a^{-\\frac{1}{2}}=\\sqrt{7}$ 일 때, 다음 물음에 답하시오.)","choices": [],"answer": "$\\sqrt{21}$","solution": "<b>[논리 분석]</b> 곱셈 공식의 변형 및 부호 판단\n이유: $(a-a^{-1})^2 = (a+a^{-1})^2-4 = 21$임\n근거: $a>1$이므로 $a-a^{-1}>0$임. 따라서 $\\sqrt{21}$임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 23,"level": "상","category": "로그함수의 역함수","originalCategory": "로그함수의 역함수","standardCourse": "대수","standardUnitKey": "H22-A-03","standardUnit": "로그함수","standardUnitOrder": 3,"questionType": "서술형","layoutTag": "grid","tags": ["서술형","로그함수","로그","지수","함수","조건해석","계산"],"wide": false,"content": "[서술형 3]<br>함수 $y=\\log_{2}(x-1)$의 역함수를 $f(x)$라 할 때,<br>방정식 $f(2x)+f(x+2)-47=0$의 실수해를 $\\alpha$라 하자.<br>$f(\\alpha)$의 값을 구하고 그 과정을 서술하시오. (5점, 부분점수 있음)","choices": [],"answer": "6","solution": "<b>[논리 분석]</b> 역함수 산출 및 지수방정식 치환 풀이\n이유: $f(x)=2^x+1$임. 방정식은 $(2^{2x}+1)+(2^{x+2}+1)-47=0$임\n근거: $2^{2x}+4 \\cdot 2^x-45=0 \\implies (2^x+9)(2^x-5)=0$에서 $2^x=5$임\n결론적으로 $f(\\alpha)=2^\\alpha+1=6$","subUnitKey": "H22-A-03-LOGARITHMIC_FUNCTION","subUnit": "로그함수","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  },
  {
    "id": 24,"level": "상","category": "로그와 이차방정식","originalCategory": "로그와 이차방정식","standardCourse": "대수","standardUnitKey": "H22-A-01","standardUnit": "지수와 로그","standardUnitOrder": 1,"questionType": "서술형","layoutTag": "grid","tags": ["서술형","이차방정식","판별식","로그","범위","조건해석","계산"],"wide": false,"content": "[서술형 4]<br>$x$에 대한 이차방정식<br>$(\\log a+2)x^2-2(\\log a)x+1=0$이 실근을 갖도록 하는 실수 $a$의<br>값의 범위를 구하고 그 과정을 서술하시오. (5점, 부분점수 있음)","choices": [],"answer": "$0 < a \\le \\frac{1}{10}$ (단, $a \\neq \\frac{1}{100}$) 또는 $a \\ge 100$","solution": "<b>[논리 분석]</b> 이차방정식 조건 및 판별식 범위 산출\n이유: 이차방정식 조건 $\\log a \\neq -2 \\implies a \\neq \\frac{1}{100}$. 판별식 $\\frac{D}{4} = (\\log a)^2-(\\log a+2) \\ge 0$\n근거: $(\\log a-2)(\\log a+1) \\ge 0 \\implies \\log a \\ge 2$ 또는 $\\log a \\le -1$\n결론적으로 $0 < a \\le \\frac{1}{10}$ (단, $a \\neq \\frac{1}{100}$) 또는 $a \\ge 100$임","subUnitKey": "H22-A-01-EXPONENT_LOG","subUnit": "지수와 로그","subUnitConfidence": "candidate_evidence","subUnitClassificationDepth": "complete_candidate"
  }
];
