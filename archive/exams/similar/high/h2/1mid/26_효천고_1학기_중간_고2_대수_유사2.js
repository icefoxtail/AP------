window.examTitle = "26_효천고_1학기_중간_고2_대수_유사2";
window.examDisplayTitle = "2026 효천고 고2 대수 1학기 중간 발전형 유사2";
window.questionBank = [
  {
    id: 1, category: "지수법칙의 역산", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$3^{x-1}\\times\\sqrt[3]{\\dfrac1{27}}=3^2$을 만족시키는 실수 $x$의 값은? [3.3점]",
    choices: ["$4$", "$5$", "$6$", "$7$", "$8$"], answer: "①",
    solution: "먼저 거듭제곱근을 지수로 나타낸다.\n$\\sqrt[3]{\\dfrac1{27}}=\\left(3^{-3}\\right)^{\\frac13}=3^{-1}$이다.\n따라서 주어진 등식은\n$3^{x-1}\\times3^{-1}=3^{x-2}=3^2$이다.\n밑이 같으므로 $x-2=2$이고, $x=4$이다.\n그러므로 정답은 ①이다.",
    points: 3.3, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-071", problemTypeKey: "PT_H22A_01_EXPONENT_LAWS", templateKey: "TPL_H22A_01_EXPONENT_LAWS_071", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 1, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 1, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q1"
  },
  {
    id: 2, category: "지수·로그 계산의 참거짓", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "다음 중 지수법칙 또는 로그의 성질을 적용한 등식으로 옳지 않은 것은? [3.4점]",
    choices: ["$(27^{\\frac23})^2=81$", "$4^{\\sqrt7+2}\\div4^{\\sqrt7-1}=64$", "$\\sqrt[3]{2^7\\times5^2}\\div\\sqrt[3]{2^4\\times5^2}=2$", "$\\log_2 7\\times\\log_7 16=4$", "$\\log_{\\frac13}9=2$"], answer: "⑤",
    solution: "각 등식의 양변을 따로 계산한다.\n① $27=3^3$이므로 $(27^{\\frac23})^2=3^4=81$이다.\n② 지수의 차가 $(\\sqrt7+2)-(\\sqrt7-1)=3$이므로 $4^3=64$이다.\n③ 같은 세제곱근끼리 나누면 $\\sqrt[3]{2^3}=2$이다.\n④ 로그의 연쇄법칙에 따라 $\\log_2 7\\times\\log_7 16=\\log_2 16=4$이다.\n⑤ $\\left(\\dfrac13\\right)^{-2}=9$이므로 $\\log_{\\frac13}9=-2$이다. $2$라는 등식은 옳지 않다.\n따라서 옳지 않은 것은 ⑤이다.",
    points: 3.4, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-071", problemTypeKey: "PT_H22A_01_EXPONENT_LAWS", templateKey: "TPL_H22A_01_EXPONENT_LAWS_071", crossConceptKeys: ["CC_LOG_RULES"], conditionKeys: [], integrationPattern: "CASE_BRANCH", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 2, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q2"
  },
  {
    id: 3, category: "상용로그로 소수점 역산", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$\\log2.5=0.3979$일 때, $\\log(10x)=2.3979$를 만족시키는 양수 $x$의 값은? [3.5점]",
    choices: ["$0.25$", "$2.5$", "$12.5$", "$25$", "$250$"], answer: "④",
    solution: "두 상용로그를 빼면\n$\\log(10x)-\\log2.5=2.3979-0.3979=2$이다.\n로그의 성질에 의해 $\\log\\dfrac{10x}{2.5}=2$이므로\n$\\dfrac{10x}{2.5}=10^2=100$이다.\n따라서 $10x=250$, $x=25$이다.\n그러므로 정답은 ④이다.",
    points: 3.5, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-078", problemTypeKey: "PT_H22A_01_COMMON_LOG", templateKey: "TPL_H22A_01_COMMON_LOG_078", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 1, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 3, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q3"
  },
  {
    id: 4, category: "호도법 역변환", standardCourse: "대수", standardUnitKey: "H22-A-04", standardUnit: "삼각함수", subUnitKey: "H22-A-04-TRIGONOMETRIC_BASIC", subUnit: "삼각함수의 기본", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "두 실수 $a$, $b$에 대하여 $a^\\circ=\\dfrac{2\\pi}{9}$, $45^\\circ=b\\pi$일 때, $ab$의 값은? [3.6점]",
    choices: ["$5$", "$10$", "$15$", "$20$", "$25$"], answer: "②",
    solution: "$180^\\circ=\\pi$라디안이므로 $a^\\circ=\\dfrac{2\\pi}{9}$에서\n$a=180\\times\\dfrac29=40$이다.\n또 $45^\\circ=\\dfrac{\\pi}{4}=b\\pi$이므로 $b=\\dfrac14$이다.\n따라서 $ab=40\\times\\dfrac14=10$이다.\n그러므로 정답은 ②이다.",
    points: 3.6, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-096", problemTypeKey: "PT_H22A_04_ANGLE_RADIAN", templateKey: "TPL_H22A_04_ANGLE_RADIAN_096", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 1, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 4, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q4"
  },
  {
    id: 5, category: "삼각함수 부호를 고려한 역산", standardCourse: "대수", standardUnitKey: "H22-A-04", standardUnit: "삼각함수", subUnitKey: "H22-A-04-TRIGONOMETRIC_BASIC", subUnit: "삼각함수의 기본", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$\\tan\\theta=-\\dfrac43$이고 $\\dfrac{3\\pi}{2}<\\theta<2\\pi$일 때, $\\sin\\theta$의 값은? [3.6점]",
    choices: ["$-\\dfrac45$", "$-\\dfrac35$", "$-\\dfrac12$", "$\\dfrac35$", "$\\dfrac45$"], answer: "①",
    solution: "$\\dfrac{3\\pi}{2}<\\theta<2\\pi$이므로 제4사분면에서 $\\sin\\theta<0$, $\\cos\\theta>0$이다.\n$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=-\\dfrac43$이므로 직각삼각형의 세 변 비를 $4:3:5$로 볼 수 있다.\n따라서 $|\\sin\\theta|=\\dfrac45$이고 부호는 음수이다.\n$\\sin\\theta=-\\dfrac45$이므로 정답은 ①이다.",
    points: 3.6, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-098", problemTypeKey: "PT_H22A_04_TRIG_DEFINITION", templateKey: "TPL_H22A_04_TRIG_DEFINITION_098", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 5, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q5"
  },
  {
    id: 6, category: "구의 겉넓이와 분수 지수", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "겉넓이가 $128\\pi$인 구의 반지름을 $\\sqrt[n]{2^m}$꼴로 나타내었다. 서로소인 자연수 $m,n$에 대하여 $m+n$의 값은? [3.7점]",
    choices: ["$5$", "$7$", "$8$", "$9$", "$11$"], answer: "②",
    solution: "반지름을 $r$이라 하면 구의 겉넓이에서\n$4\\pi r^2=128\\pi$이므로 $r^2=32=2^5$이다.\n$r>0$이므로 $r=2^{\\frac52}=\\sqrt[2]{2^5}$이다.\n$5$와 $2$는 서로소이므로 $m=5$, $n=2$이다.\n따라서 $m+n=7$이고 정답은 ②이다.",
    points: 3.7, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-067", problemTypeKey: "PT_H22A_01_ROOT_REAL", templateKey: "TPL_H22A_01_ROOT_REAL_067", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 6, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q6"
  },
  {
    id: 7, category: "유리수 지수와 자연수 조건", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "두 수 $16^{\\frac3{n-1}}$, $27^{\\frac4{n+1}}$이 모두 자연수가 되도록 하는 모든 정수 $n$의 값의 합은? [3.8점]",
    choices: ["$4$", "$6$", "$8$", "$10$", "$12$"], answer: "④",
    solution: "$16^{\\frac3{n-1}}=2^{\\frac{12}{n-1}}$, $27^{\\frac4{n+1}}=3^{\\frac{12}{n+1}}$이다.\n두 수가 자연수이려면 $\\dfrac{12}{n-1}$과 $\\dfrac{12}{n+1}$이 모두 음수가 아닌 정수여야 한다. 분모가 $0$일 수 없고 지수가 $0$일 수도 없으므로 $n>1$이다.\n$n-1$은 $12$의 양의 약수이다. 따라서 $n=2,3,4,5,7,13$이다.\n이 가운데 $n+1$도 $12$의 양의 약수인 값은 $n=2,3,5$이다.\n합은 $2+3+5=10$이므로 정답은 ④이다.",
    points: 3.8, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-069", problemTypeKey: "PT_H22A_01_EXPONENT_EXTENSION", templateKey: "TPL_H22A_01_EXPONENT_EXTENSION_069", crossConceptKeys: [], conditionKeys: [], integrationPattern: "CASE_BRANCH", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 7, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q7"
  },
  {
    id: 8, category: "로그 밑변환과 연쇄 곱", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$\\log_2 3=a$, $\\log_3 5=b$, $\\log_5 7=c$일 때, $\\log_{35}6$을 $a,b,c$로 나타낸 것은? [3.9점]",
    choices: ["$\\dfrac{1+a}{ab(1+bc)}$", "$\\dfrac{1+a}{ab+c}$", "$\\dfrac{1+ab}{ab(1+c)}$", "$\\dfrac{1+a}{abc}$", "$\\dfrac{1+a}{ab(1+c)}$"], answer: "⑤",
    solution: "밑을 $2$로 통일하면 $\\log_{35}6=\\dfrac{\\log_2 6}{\\log_2 35}$이다.\n분자는 $\\log_2 6=\\log_2 2+\\log_2 3=1+a$이다.\n분모의 각 로그는 $\\log_2 5=ab$, $\\log_2 7=abc$이므로\n$\\log_2 35=ab+abc=ab(1+c)$이다.\n따라서 $\\log_{35}6=\\dfrac{1+a}{ab(1+c)}$이고 정답은 ⑤이다.",
    points: 3.9, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-076", problemTypeKey: "PT_H22A_01_LOG_PROPERTIES", templateKey: "TPL_H22A_01_LOG_PROPERTIES_076", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 8, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q8"
  },
  {
    id: 9, category: "상용로그를 이용한 지수적 감소 시각", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "어떤 관측 장치의 신호 세기는 $4$시간마다 직전의 $80\\%$로 줄어든다. 처음 신호 세기의 $\\dfrac1{64}$ 이하가 되는 것은 최초로 몇 시간 후부터인가? [4점] (단, $\\log2=0.3010$, $\\log5=0.6990$으로 계산하며, 신호는 $4$시간 단위로 관측한다.)",
    choices: ["$48$시간", "$56$시간", "$64$시간", "$76$시간", "$80$시간"], answer: "④",
    solution: "$4$시간 간격을 $n$번 지난 뒤 남은 비율은 $0.8^n$이다.\n$0.8^n\\le\\dfrac1{64}$를 풀기 위해 상용로그를 취한다.\n$\\log0.8=2\\log2-\\log5=0.6020-0.6990=-0.0970$이고\n$\\log\\dfrac1{64}=-6\\log2=-1.8060$이다.\n따라서 $-0.0970n\\le-1.8060$이고 음수로 나눌 때 부등호 방향을 바꾸면 $n\\ge\\dfrac{1.8060}{0.0970}\\approx18.62$이다.\n$n$은 관측 횟수인 자연수이므로 최초는 $n=19$, 곧 $4\\times19=76$시간 후이다. 정답은 ④이다.",
    points: 4, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-077", problemTypeKey: "PT_H22A_01_COMMON_LOG", templateKey: "TPL_H22A_01_COMMON_LOG_077", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 9, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q9"
  },
  {
    id: 10, category: "삼각함수 합차와 사분면", standardCourse: "대수", standardUnitKey: "H22-A-04", standardUnit: "삼각함수", subUnitKey: "H22-A-04-TRIGONOMETRIC_BASIC", subUnit: "삼각함수의 기본", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$\\dfrac{3\\pi}{2}<\\theta<2\\pi$이고 $\\sin\\theta+\\cos\\theta=-\\dfrac12$일 때, $\\sin\\theta-\\cos\\theta$의 값은? [4.2점]",
    choices: ["$-\\dfrac{\\sqrt7}{2}$", "$-1$", "$-\\dfrac12$", "$0$", "$\\dfrac{\\sqrt7}{2}$"], answer: "①",
    solution: "주어진 식을 제곱하면\n$(\\sin\\theta+\\cos\\theta)^2=1+2\\sin\\theta\\cos\\theta=\\dfrac14$이다.\n따라서 $2\\sin\\theta\\cos\\theta=-\\dfrac34$이다.\n다른 차의 제곱은\n$(\\sin\\theta-\\cos\\theta)^2=1-2\\sin\\theta\\cos\\theta=1+\\dfrac34=\\dfrac74$이다.\n제4사분면에서는 $\\sin\\theta<0$, $\\cos\\theta>0$이므로 차는 음수이다.\n따라서 $\\sin\\theta-\\cos\\theta=-\\dfrac{\\sqrt7}{2}$이다. 정답은 ①이다.",
    points: 4.2, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-100", problemTypeKey: "PT_H22A_04_TRIG_PROPERTIES", templateKey: "TPL_H22A_04_TRIG_PROPERTIES_100", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 10, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q10"
  },
  {
    id: 11, category: "지수 공통값과 가중 곱", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "양수 $a,b,c$와 $0$이 아닌 실수 $x,y,z$가 $a^x=b^y=c^z=64$, $a^2bc=16$을 만족시킬 때, $\\dfrac2x+\\dfrac1y+\\dfrac1z$의 값은? [4.3점]",
    choices: ["$\\dfrac16$", "$\\dfrac13$", "$\\dfrac12$", "$\\dfrac35$", "$\\dfrac23$"], answer: "⑤",
    solution: "$a^x=b^y=c^z=64$이므로\n$a=64^{\\frac1x}$, $b=64^{\\frac1y}$, $c=64^{\\frac1z}$이다.\n이들을 $a^2bc=16$에 대입하면\n$64^{\\frac2x+\\frac1y+\\frac1z}=16$이다.\n$64=2^6$, $16=2^4$이므로\n$6\\left(\\dfrac2x+\\dfrac1y+\\dfrac1z\\right)=4$이다.\n따라서 구하는 값은 $\\dfrac46=\\dfrac23$이다. 정답은 ⑤이다.",
    points: 4.3, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-072", problemTypeKey: "PT_H22A_01_EXPONENT_LAWS", templateKey: "TPL_H22A_01_EXPONENT_LAWS_072", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 11, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q11"
  },
  {
    id: 12, category: "지수함수 점근선과 삼각형 넓이", standardCourse: "대수", standardUnitKey: "H22-A-02", standardUnit: "지수함수", subUnitKey: "H22-A-02-EXPONENTIAL_FUNCTION", subUnit: "지수함수", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$a>1$이고 곡선 $y=a^x-4$ 위의 제1사분면 점 $A$를 지나는 수직선이 $x$축과 만나는 점을 $B$, 점근선과 만나는 점을 $C$라 한다. $\\overline{AB}=3\\overline{BC}$이고 삼각형 $AOC$의 넓이가 $32$일 때, $a\\times\\overline{OB}$의 값은? (단, $O$는 원점이다.) [4.5점]",
    choices: ["$6$", "$8$", "$10$", "$12$", "$16$"], answer: "②",
    solution: "점근선은 $y=-4$이다. $A=(t,a^t-4)$라 두면 $B=(t,0)$, $C=(t,-4)$이고 $t>0$이다.\n$BC=4$, $AB=3BC=12$이므로 $a^t-4=12$, 즉 $a^t=16$이다.\n밑변 $AC=AB+BC=16$, 높이 $OB=t$이므로 삼각형 $AOC$의 넓이는 $\\dfrac12\\times16\\times t=32$이다.\n따라서 $t=4$, $a^4=16$이므로 $a=2$이다.\n구하는 값은 $a\\times OB=2\\times4=8$이다. 정답은 ②이다.",
    points: 4.5, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-080", problemTypeKey: "PT_FUNCTION_GRAPH_TRANSFORM", templateKey: "TPL_FUNCTION_GRAPH_TRANSLATION", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 12, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q12"
  },
  {
    id: 13, category: "로그가 자연수가 되는 조건", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "자연수 $n$에 대하여 $\\dfrac{\\log_3(3n)+1}{2}$의 값이 $4$ 이하의 자연수가 되도록 하는 모든 $n$의 값의 합은? [4.7점]",
    choices: ["$820$", "$821$", "$829$", "$901$", "$902$"], answer: "①",
    solution: "주어진 식의 값을 자연수 $m$이라 두면 $m=1,2,3,4$이다.\n$\\dfrac{\\log_3(3n)+1}{2}=m$에서\n$\\log_3(3n)=2m-1$이므로 $3n=3^{2m-1}$이다.\n양변을 $3$으로 나누면 $n=3^{2m-2}$이다.\n$m=1,2,3,4$에 따라 $n=1,9,81,729$이고 모두 자연수이다.\n합은 $1+9+81+729=820$이다. 정답은 ①이다.",
    points: 4.7, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-073", problemTypeKey: "PT_H22A_01_LOG_DEFINITION", templateKey: "TPL_H22A_01_LOG_DEFINITION_073", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 13, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q13"
  },
  {
    id: 14, category: "실근의 곱과 홀짝별 극값", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "한 자리 자연수 $n$에 대하여 방정식 $(x^n-2)(x^{2n}-8)=0$의 모든 서로 다른 실근의 곱을 $k$라 한다. $n+k$의 최댓값과 최솟값의 차가 $a+b2^c$이고 $a$는 자연수, $|b|=1$, $0<c<1$일 때, $a+b+c$의 값은? [4.8점]",
    choices: ["$\\dfrac{181}8$", "$\\dfrac{189}8$", "$\\dfrac{197}8$", "$\\dfrac{205}8$", "$\\dfrac{213}8$"], answer: "③",
    solution: "$x^{2n}=8$의 두 실근은 $\\pm2^{\\frac3{2n}}$이므로 그 곱은 $-2^{\\frac3n}$이다.\n$x^n=2$의 실근은 $n$이 홀수이면 $2^{\\frac1n}$ 하나, 짝수이면 $\\pm2^{\\frac1n}$ 두 개(곱은 $-2^{\\frac2n}$)이다.\n두 근 집합은 겹치지 않는다. 실제로 $x^n=2$라면 $x^{2n}=4\\ne8$이다.\n따라서 $k$는 홀수 $n$에서 $-2^{\\frac4n}$이고 짝수 $n$에서 $2^{\\frac5n}$이다.\n홀수의 경우 $n=1$에서 $n+k=1-16=-15$로 최소이다. $n\\ge3$에서는 $n-2^{\\frac4n}>n-4\\ge-1$이다.\n짝수 $n=2,4,6,8$에서는 $n+2^{\\frac5n}$을 비교한다. $n=8$에서 $8+2^{\\frac58}>8$, 다른 짝수 $n=2,4,6$에서는 각각 $2+2^{\\frac52}<8$, $4+2^{\\frac54}<8$, $6+2^{\\frac56}<8$이다. 홀수 $n\\le9$에서는 $n+k<n\\le9$이고 $n=9$일 때 $9-2^{\\frac49}<8$이므로 최댓값도 $n=8$에서 얻는다.\n최댓값과 최솟값의 차는 $(8+2^{\\frac58})-(-15)=23+2^{\\frac58}$이다.\n따라서 $a=23,b=1,c=\\dfrac58$이고 $a+b+c=\\dfrac{197}8$이다. 정답은 ③이다.",
    points: 4.8, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-068", problemTypeKey: "PT_H22A_01_ROOT_REAL", templateKey: "TPL_H22A_01_ROOT_REAL_068", crossConceptKeys: [], conditionKeys: [], integrationPattern: "CASE_BRANCH", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 14, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q14"
  },
  {
    id: 15, category: "로그함수 교점의 중점", standardCourse: "대수", standardUnitKey: "H22-A-03", standardUnit: "로그함수", subUnitKey: "H22-A-03-LOGARITHMIC_FUNCTION", subUnit: "로그함수", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "$a>0$에 대하여 두 곡선 $y=\\log_3\\left(-\\dfrac9x\\right)$, $y=\\log_3(x+4a)$가 서로 다른 두 점 $A,B$에서 만난다. 선분 $AB$의 중점이 직선 $x-2y+7=0$ 위에 있을 때, $a$의 값은? [4.8점]",
    choices: ["$1$", "$\\dfrac32$", "$2$", "$\\dfrac52$", "$3$"], answer: "④",
    solution: "두 로그함수의 교점에서는 진수가 같으므로 $-\\dfrac9x=x+4a$이다.\n따라서 $x^2+4ax+9=0$이다. 두 근을 $x_1,x_2$라 하면 $x_1+x_2=-4a$, $x_1x_2=9$이다.\n교점의 높이는 $y_1=\\log_3(-9/x_1)=\\log_3(-x_2)$, $y_2=\\log_3(-x_1)$이므로\n$y_1+y_2=\\log_3(x_1x_2)=\\log_3 9=2$이다.\n따라서 중점은 $(-2a,1)$이다. 직선에 대입하면 $-2a-2+7=0$이고 $a=\\dfrac52$이다.\n이때 이차방정식은 $x^2+10x+9=0$이고 두 근은 $-9,-1$로 서로 다른 음수이다. 두 로그의 진수 조건도 만족한다.\n그러므로 정답은 ④이다.",
    points: 4.8, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-094", problemTypeKey: "PT_FUNCTION_GRAPH_INTERSECTION", templateKey: "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 15, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q15"
  },
  {
    id: 16, category: "구간별 지수함수의 수평선 교점 수", standardCourse: "대수", standardUnitKey: "H22-A-02", standardUnit: "지수함수", subUnitKey: "H22-A-02-EXPONENTIAL_FUNCTION", subUnit: "지수함수", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "함수 $f(x)=\\begin{cases}2^x+4&(x>3)\\\\20-2^x&(x\\le3)\\end{cases}$에 대하여 방정식 $4^{f(x)}-5\\times2^{n+f(x)}+2^{2n+2}=0$의 서로 다른 실근이 정확히 $3$개가 되도록 하는 모든 자연수 $n$의 합은? [4.9점]",
    choices: ["$43$", "$46$", "$49$", "$52$", "$55$"], answer: "③",
    solution: "$t=2^{f(x)}$, $A=2^n$이라 두면 방정식은 $t^2-5At+4A^2=0$이다.\n$(t-A)(t-4A)=0$이므로 $f(x)=n$ 또는 $f(x)=n+2$이다.\n$x\\le3$에서 $f(x)=20-2^x$의 치역은 $[12,20)$이고, $x>3$에서 $f(x)=2^x+4$의 치역은 $(12,\\infty)$이다.\n따라서 수평선 $y=c$와의 교점 수는 $c<12$일 때 $0$, $c=12$일 때 $1$, $12<c<20$일 때 $2$, $c\\ge20$일 때 $1$이다.\n이제 서로 다른 두 값 $n,n+2$의 교점 수를 합한다. $n=12$이면 $1+2=3$개, $n=13,\\ldots,17$이면 $2+2=4$개, $n=18,19$이면 $2+1=3$개이다. 그 밖의 자연수에서는 $3$개가 될 수 없다.\n따라서 $n=12,18,19$이고 합은 $12+18+19=49$이다. 정답은 ③이다.",
    points: 4.9, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-082", problemTypeKey: "PT_H22A_02_EXP_EQUATION", templateKey: "TPL_H22A_02_EXP_EQUATION_082", crossConceptKeys: [], conditionKeys: [], integrationPattern: "DEEP_COMPOSITE", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 16, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q16"
  },
  {
    id: 17, category: "구간별 지수·로그함수의 일대일 대응", standardCourse: "대수", standardUnitKey: "H22-A-03", standardUnit: "로그함수", subUnitKey: "H22-A-03-LOGARITHMIC_FUNCTION", subUnit: "로그함수", subUnitClassificationDepth: "complete_category",
    questionType: "객관식", layoutTag: "grid", wide: false, tags: [],
    content: "실수 전체에서 정의되고 공역도 실수 전체인 함수 $f(x)=\\begin{cases}2^{-x-1}&(x<k)\\\\-\\log_2(x+1)-1&(x\\ge k)\\end{cases}$가 일대일 대응이다. 또 함수 $g(x)=\\begin{cases}\\log_2(3-x)+2&(x<-k)\\\\-2^{x-1}+2&(x\\ge-k)\\end{cases}$라 한다. $f(a)\\le b\\le g(a)$를 만족하는 정수 순서쌍 $(a,b)$의 개수는? (단, $-3\\le a\\le0$) [5점]",
    choices: ["$9$", "$11$", "$13$", "$15$", "$17$"], answer: "③",
    solution: "함수 $f$의 왼쪽 가지와 오른쪽 가지는 각각 감소한다.\n왼쪽 가지의 치역은 $(2^{-k-1},\\infty)$이고 오른쪽 가지의 치역은 $(-\\infty,-\\log_2(k+1)-1]$이다.\n두 치역이 겹치거나 빈틈이 생기지 않아야 일대일 대응이므로 경계값은 같다. 따라서\n$2^{-k-1}=-\\log_2(k+1)-1>0$이다.\n진수 조건과 부호를 함께 쓰면 $k+1>0$, $\\log_2(k+1)<-1$이고 $0<k+1<\\dfrac12$이다.\n즉 $-1<k<-\\dfrac12$이므로 $a=-3,-2,-1$에서는 $f$의 첫째 가지, $a=0$에서는 둘째 가지를 쓴다. 또한 $-k>\\dfrac12$이므로 이 네 정수 $a$는 모두 $g$의 첫째 가지를 쓴다.\n$a=-3$에서 $f(a)=4$, $g(a)=2+\\log_2 6$은 $4$와 $5$ 사이이므로 $b=4$ 한 개이다.\n$a=-2$에서 $f(a)=2$, $g(a)=2+\\log_2 5$는 $4$와 $5$ 사이이므로 $b=2,3,4$의 세 개이다.\n$a=-1$에서 $f(a)=1$, $g(a)=2+\\log_2 4=4$이므로 네 개이다.\n$a=0$에서 $f(a)=-1$, $g(a)=2+\\log_2 3$은 $3$과 $4$ 사이이므로 $b=-1,0,1,2,3$의 다섯 개이다.\n따라서 $1+3+4+5=13$개이고 정답은 ③이다.",
    points: 5, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-087", problemTypeKey: "PT_FUNCTION_GRAPH_PROPERTIES", templateKey: "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 17, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q17"
  },
  {
    id: 18, category: "사분면과 삼각함수의 부호", standardCourse: "대수", standardUnitKey: "H22-A-04", standardUnit: "삼각함수", subUnitKey: "H22-A-04-TRIGONOMETRIC_BASIC", subUnit: "삼각함수의 기본", subUnitClassificationDepth: "complete_category",
    questionType: "단답형", layoutTag: "grid", wide: false, tags: [],
    content: "$\\cos\\theta>0$, $\\tan\\theta<0$를 모두 만족하는 각 $\\theta$는 제 몇 사분면의 각인지 쓰시오. [3점]",
    choices: [], answer: "제4사분면",
    solution: "$\\cos\\theta>0$이면 각은 제1사분면 또는 제4사분면에 있다.\n$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}<0$이므로 사인과 코사인의 부호는 서로 다르다.\n이미 코사인은 양수이므로 사인은 음수이다.\n따라서 $\\theta$는 제4사분면의 각이다.",
    points: 3, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-097", problemTypeKey: "PT_H22A_04_TRIG_DEFINITION", templateKey: "TPL_H22A_04_TRIG_DEFINITION_097", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 1, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 18, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q18"
  },
  {
    id: 19, category: "로그의 값 대소 비교", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "단답형", layoutTag: "grid", wide: false, tags: [],
    content: "$P=\\log_a b$, $Q=\\log_b a$, $R=\\log_a(b^2)$, $S=\\log_{a^2}b$라고 하자. $a=\\dfrac1{32}$, $b=\\dfrac14$일 때, $P,Q,R,S$를 큰 것부터 차례로 쓰시오. [3점]",
    choices: [], answer: "$Q>R>P>S$",
    solution: "$a=2^{-5}$, $b=2^{-2}$이므로 밑변환에 따라\n$P=\\log_{2^{-5}}2^{-2}=\\dfrac25$이다.\n역수 관계에서 $Q=\\dfrac1P=\\dfrac52$이다.\n로그의 지수 법칙에 따라 $R=2P=\\dfrac45$, $S=\\dfrac P2=\\dfrac15$이다.\n따라서 $\\dfrac52>\\dfrac45>\\dfrac25>\\dfrac15$이고, 큰 것부터 $Q>R>P>S$이다.",
    points: 3, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-076", problemTypeKey: "PT_H22A_01_LOG_PROPERTIES", templateKey: "TPL_H22A_01_LOG_PROPERTIES_076", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 19, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q19"
  },
  {
    id: 20, category: "밑이 1보다 작은 로그부등식", standardCourse: "대수", standardUnitKey: "H22-A-03", standardUnit: "로그함수", subUnitKey: "H22-A-03-LOGARITHMIC_FUNCTION", subUnit: "로그함수", subUnitClassificationDepth: "complete_category",
    questionType: "서술형", layoutTag: "grid", wide: false, tags: [],
    content: "부등식 $\\log_{\\frac13}(7-2x)>-1$을 만족하는 모든 실수 $x$의 범위를 구하는 과정을 서술하시오. [5점]",
    choices: [], answer: "$2<x<\\dfrac72$",
    solution: "로그의 진수는 양수이므로 먼저 $7-2x>0$, 즉 $x<\\dfrac72$이다.\n$-1=\\log_{\\frac13}3$이므로 원래 부등식은 $\\log_{\\frac13}(7-2x)>\\log_{\\frac13}3$이다.\n밑 $\\dfrac13$은 $0$과 $1$ 사이이므로 로그함수는 감소한다. 따라서 진수의 부등호 방향을 바꾸어 $7-2x<3$이다.\n이를 정리하면 $-2x<-4$, $x>2$이다.\n정의역 조건과 합하면 $2<x<\\dfrac72$이다.",
    points: 5, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-091", problemTypeKey: "PT_H22A_03_LOG_INEQUALITY", templateKey: "TPL_H22A_03_LOG_INEQUALITY_091", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 20, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q20"
  },
  {
    id: 21, category: "지수방정식의 두 근의 비", standardCourse: "대수", standardUnitKey: "H22-A-02", standardUnit: "지수함수", subUnitKey: "H22-A-02-EXPONENTIAL_FUNCTION", subUnit: "지수함수", subUnitClassificationDepth: "complete_category",
    questionType: "서술형", layoutTag: "grid", wide: false, tags: [],
    content: "방정식 $5^{2x}-k\\times5^x+2k+24=0$의 서로 다른 두 실근의 비가 $1:2$일 때, 실수 $k$의 값을 구하는 과정을 서술하시오. [6점]",
    choices: [], answer: "$20$",
    solution: "$t=5^x$라 두면 $t>0$이고 방정식은 $t^2-kt+2k+24=0$이다.\n두 실근을 $u,2u$라 하면 $t$에 대한 두 근은 $r=5^u$와 $r^2=5^{2u}$이다.\n근과 계수의 관계에 따라 $r+r^2=k$, $r^3=2k+24$이다.\n첫째 식을 둘째 식에 대입하면 $r^3=2r+2r^2+24$이고\n$r^3-2r^2-2r-24=(r-4)(r^2+2r+6)=0$이다.\n$r>0$이고 $r^2+2r+6>0$이므로 $r=4$이다. 따라서 $k=r+r^2=4+16=20$이다.\n검산하면 이차방정식은 $(t-4)(t-16)=0$이고 두 실근은 $\\log_5 4$, $2\\log_5 4$이므로 실제 비가 $1:2$이다.",
    points: 6, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-082", problemTypeKey: "PT_H22A_02_EXP_EQUATION", templateKey: "TPL_H22A_02_EXP_EQUATION_082", crossConceptKeys: [], conditionKeys: [], integrationPattern: "INTERDEPENDENT", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 21, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q21"
  },
  {
    id: 22, category: "로그 부등식 조건 아래 대소 비교", standardCourse: "대수", standardUnitKey: "H22-A-01", standardUnit: "지수와 로그", subUnitKey: "H22-A-01-EXPONENT_LOG", subUnit: "지수와 로그", subUnitClassificationDepth: "complete_category",
    questionType: "서술형", layoutTag: "grid", wide: false, tags: [],
    content: "$P=\\log_a b$, $Q=\\log_b a$, $R=\\log_a(b^2)$, $S=\\log_{a^2}b$라고 하자. $0<b^3<a<b^2<1$을 만족하는 실수 $a,b$에 대하여 $P,Q,R,S$의 대소 관계를 구하는 과정을 서술하시오. [6점]",
    choices: [], answer: "$Q>R>P>S$",
    solution: "$b^2<1$이므로 $0<b<1$이고, $b^3<a<b^2$이므로 $0<a<1$이다.\n밑 $b$가 $0$과 $1$ 사이이므로 로그를 취할 때 부등호가 반대가 된다.\n$b^3<a<b^2$에서 $3>\\log_b a>2$이다.\n$P=\\log_a b=\\dfrac1{\\log_b a}$라 두면 $\\dfrac13<P<\\dfrac12$이다.\n그런데 $Q=\\dfrac1P$, $R=2P$, $S=\\dfrac P2$이므로\n$Q>2>1>2P>P>\\dfrac P2>0$이다.\n따라서 모든 조건에서 $Q>R>P>S$이다.",
    points: 6, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-076", problemTypeKey: "PT_H22A_01_LOG_PROPERTIES", templateKey: "TPL_H22A_01_LOG_PROPERTIES_076", crossConceptKeys: [], conditionKeys: [], integrationPattern: "SEQUENTIAL", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 22, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q22"
  },
  {
    id: 23, category: "역함수 대칭과 수직 밑변 삼각형", standardCourse: "대수", standardUnitKey: "H22-A-03", standardUnit: "로그함수", subUnitKey: "H22-A-03-LOGARITHMIC_FUNCTION", subUnit: "로그함수", subUnitClassificationDepth: "complete_category",
    questionType: "서술형", layoutTag: "grid", wide: false, tags: [],
    content: "기울기가 $-1$인 한 직선이 두 곡선 $y=4^x$, $y=\\log_4 x$와 만나는 점을 각각 $A,B$라 한다. $A$의 $x$좌표는 양수 $\\alpha$이다. 점 $A$를 지나는 수직선이 곡선 $y=\\log_4 x$와 만나는 점을 $C$라 하자. $\\overline{AB}=3\\sqrt2$, 삼각형 $ABC$의 넓이는 $6$이다. $\\alpha-\\log_4\\alpha$를 구하는 과정을 서술하시오. [7점]",
    choices: [], answer: "$1$",
    solution: "두 곡선 $y=4^x$, $y=\\log_4x$는 직선 $y=x$에 대하여 서로 대칭이다. 기울기가 $-1$인 직선도 이 대칭에 대해 그대로이므로\n$A=(\\alpha,4^\\alpha)$, $B=(4^\\alpha,\\alpha)$이다.\n$\\alpha>0$일 때 $4^\\alpha>\\alpha$이므로 두 점의 가로·세로 좌표 차는 각각 $d=4^\\alpha-\\alpha>0$이다.\n$AB=\\sqrt2d=3\\sqrt2$에서 $d=3$을 얻는다. 즉 $4^\\alpha-\\alpha=3$이다.\n$C$는 $x=\\alpha$와 로그함수의 교점이므로 $C=(\\alpha,\\log_4\\alpha)$이다.\n선분 $AC$는 수직이고 길이가 $4^\\alpha-\\log_4\\alpha$이며, 점 $B$에서 직선 $AC$까지의 수평 거리는 $d=3$이다.\n따라서 넓이 $6=\\dfrac12\\times AC\\times3$에서 $AC=4$이다.\n$4^\\alpha-\\log_4\\alpha=4$에서 $4^\\alpha-\\alpha=3$을 빼면 $\\alpha-\\log_4\\alpha=1$이다.\n실제로 $\\alpha=1$이면 $A=(1,4)$, $B=(4,1)$, $C=(1,0)$이므로 모든 주어진 길이와 넓이를 만족한다.",
    points: 7, curriculum: "2022", rpmPrimaryRecordId: "H2-M1-RPM-094", problemTypeKey: "PT_FUNCTION_GRAPH_INTERSECTION", templateKey: "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", crossConceptKeys: [], conditionKeys: [], integrationPattern: "INTERDEPENDENT", difficultyBucket: 4, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", sourceQid: 23, variationType: "EXAM_FOLLOWUP", provenance: "SIMILAR_OF:archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js#q23"
  }
];
