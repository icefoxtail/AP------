window.examTitle = "22_제일고_1학기_중간_고2_수학I";
window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "다음 중 옳은 것은? [3.6점]",
    "choices": [
      "1의 세제곱근은 1이다.",
      "8의 세제곱근 중 실수인 것은 $\\pm 2$이다.",
      "$-5$의 네제곱근 중 실수인 것은 $\\pm\\sqrt[4]{5}$이다.",
      "$-7$의 세제곱근 중 실수인 것은 $\\sqrt[3]{-7}$이다.",
      "$(-3)^4$의 네제곱근 중 실수인 것은 $-3$이다."
    ],
    "answer": "④",
    "solution": "세제곱근·네제곱근은 '거듭제곱하면 원래 수가 되는 수'라는 뜻이다. 실수인 근의 개수와 전체 복소수 근의 개수를 구별한다.\n① $z^3=1$의 해는 $1$ 외에도 $(-1\\pm\\sqrt3 i)/2$가 있으므로 '1이다'라는 단정은 틀리다.\n② $z^3=8$의 실수해는 $2$ 하나이고 $-2$는 $(-2)^3=-8$이므로 틀리다.\n③ 실수의 네제곱은 음수가 될 수 없으므로 $z^4=-5$의 실수해는 없다.\n④ $z^3=-7$의 실수해는 정확히 $\\sqrt[3]{-7}$ 하나이므로 옳다.\n⑤ $z^4=(-3)^4=81$의 실수해는 $-3$과 $3$ 둘 다이므로 틀리다.\n따라서 정답은 ④이다.",
    "level": "하",
    "category": "지수의 뜻과 성질",
    "originalCategory": "지수의 뜻과 성질",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-01",
    "standardUnit": "지수의 뜻과 성질",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M1-01-EXPONENT",
    "subUnit": "지수의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "지수의 뜻과 성질",
      "거듭제곱근"
    ],
    "difficultyBucket": 2,
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "거듭제곱근",
    "decisiveStep": "실수인 n제곱근의 존재와 개수",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 1,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "정의역이 $\\{x|-1 \\le x \\le 3\\}$인 함수 $y=\\log_3(x^2-4x+31)$의 최솟값은? [3.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "밑 $3>1$인 로그함수는 진수가 커질수록 증가한다. 따라서 로그의 최솟값을 찾으려면 먼저 진수의 최솟값을 찾는다.\n$x^2-4x+31=(x-2)^2+27$이다. 정의역 $-1\\le x\\le3$에 $x=2$가 포함되므로 진수의 최솟값은 $27$이다. 진수는 이 구간에서 항상 양수라 로그가 정의된다.\n$y_{\\min}=\\log_3 27=3$이다. 정답은 ③이다.",
    "level": "하",
    "category": "로그함수",
    "originalCategory": "로그함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-04",
    "standardUnit": "로그함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION",
    "subUnit": "로그함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그함수",
      "로그함수의 최솟값"
    ],
    "difficultyBucket": 2,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_QUADRATIC_EXTREMUM"
    ],
    "primaryMethod": "로그함수의 최솟값",
    "decisiveStep": "완전제곱식으로 진수 최솟값을 찾음",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 2,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "세 수 $$A=2^{\\log_2 48 - \\log_2 12},\\quad B=\\left(\\log_3 35 - \\frac{1}{\\log_7 3}\\right)\\times\\log_5 9,\\quad C=\\log 50 + \\log 600 - \\log 0.03$$의 합 $A+B+C$의 값은? [3.8점]",
    "choices": [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    "answer": "②",
    "solution": "로그의 곱·몫 법칙과 밑 변환 공식을 각각 적용한다.\n$A=2^{\\log_2(48/12)}=2^{\\log_2 4}=4$.\n$\\frac1{\\log_7 3}=\\log_3 7$이므로 $B=(\\log_3 35-\\log_3 7)\\log_5 9=\\log_3 5\\cdot\\log_5 9=\\log_3 9=2$.\n상용로그는 밑이 $10$이므로 $C=\\log\\left(\\frac{50\\cdot600}{0.03}\\right)=\\log(10^6)=6$.\n따라서 $A+B+C=4+2+6=12$, 정답은 ②이다.",
    "level": "중",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그의 뜻과 성질",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그의 뜻과 성질",
      "로그 계산"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "로그 계산",
    "decisiveStep": "밑 변환 및 곱·몫 법칙",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 3,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "모든 실수 $x$에 대하여 $\\log_{|a+3|}(x^2+ax-a+3)$의 값이 정의되도록 하는 모든 정수 $a$의 값의 합은? [4.3점]",
    "choices": [
      "-9",
      "-7",
      "-5",
      "-3",
      "-1"
    ],
    "answer": "③",
    "solution": "모든 실수 $x$에서 로그가 정의되려면 (1) 밑 $|a+3|>0$, $|a+3|\\ne1$, (2) 진수 $x^2+ax-a+3>0$이 모든 $x$에서 성립해야 한다.\n진수를 완전제곱식으로 바꾸면 $(x+a/2)^2+3-a-a^2/4$이다. 모든 실수에서 양수가 되려면 최솟값이 $0$보다 커야 하므로 $a^2+4a-12<0$, 즉 $(a+6)(a-2)<0$이다. 따라서 $-6<a<2$.\n정수 후보는 $-5,-4,-3,-2,-1,0,1$이다. 밑 조건에서 $a=-3$은 밑 $0$, $a=-4,-2$는 밑 $1$이므로 제외한다.\n남는 값은 $-5,-1,0,1$이고 합은 $-5$. 정답은 ③이다.",
    "level": "중",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그함수",
      "로그 정의역 조건"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_INTEGER",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "CASE_BRANCH",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_DISCRIMINANT"
    ],
    "primaryMethod": "로그 정의역 조건",
    "decisiveStep": "모든 실수 진수 양수와 밑 예외 정수 필터",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 4,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "정의역이 $\\{x|x \\le 3\\}$인 함수 $y=2^{2x}-2^{x+1}+6$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은? [4.4점]",
    "choices": [
      "59",
      "60",
      "61",
      "62",
      "63"
    ],
    "answer": "①",
    "solution": "지수식을 다항식처럼 보기 위해 $t=2^x$로 치환한다. $x\\le3$이므로 $0<t\\le8$이다.\n$y=t^2-2t+6=(t-1)^2+5$이므로 $t=1$에서 최솟값 $m=5$이다.\n최댓값은 $t=8$에서 $64-16+6=54$이다. $t\\to0^+$일 때의 함수값은 $6$에 가까워질 뿐 $54$보다 크지 않다. 따라서 $M=54$.\n$M+m=54+5=59$, 정답은 ①이다.",
    "level": "중",
    "category": "지수함수",
    "originalCategory": "지수함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-03",
    "standardUnit": "지수함수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION",
    "subUnit": "지수함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "지수함수",
      "지수함수 최대·최소"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE",
    "problemTypeKey": "PT_FUNCTION_EXTREMUM",
    "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
    "crossConceptKeys": [
      "CC_QUADRATIC_EXTREMUM"
    ],
    "primaryMethod": "지수함수 최대·최소",
    "decisiveStep": "t=2^x 치환 후 이차식 최적화",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 5,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "광 통신에서는 광섬유를 통하여 신호를 먼 곳까지 보내는데 처음 신호의 세기를 $S_0$, 광섬유 $x\\mathrm{\\,km}$를 지난 후 신호의 세기를 $S$라고 하면 $$S=S_0\\left(\\frac{1}{4}\\right)^{\\frac{x}{3}}$$인 관계가 성립한다고 한다. 이 광섬유를 통하여 보내진 신호의 세기가 처음 신호의 세기의 $\\frac{1}{16}$이 되는 지점은 신호를 보낸 지점으로부터 몇 $\\mathrm{km}$ 떨어진 곳인가? [4.3점]",
    "choices": [
      "6",
      "12",
      "18",
      "24",
      "30"
    ],
    "answer": "①",
    "solution": "처음 세기에 대한 비율을 식으로 세운다. $S/S_0=(1/4)^{x/3}$이고 문제의 조건은 $S/S_0=1/16=(1/4)^2$이다.\n밑이 같고 $1/4\\ne1$이므로 지수가 같아야 한다. $x/3=2$에서 $x=6$이다.\n따라서 신호를 보낸 지점에서 $6\\,\\mathrm{km}$ 떨어져 있다. 정답은 ①이다.",
    "level": "하",
    "category": "지수함수",
    "originalCategory": "지수함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-03",
    "standardUnit": "지수함수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION",
    "subUnit": "지수함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "지수함수",
      "지수 감소 모델"
    ],
    "difficultyBucket": 2,
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "지수 감소 모델",
    "decisiveStep": "비율식을 같은 밑으로 변환",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 6,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "$100 \\le x < 1000$일 때, $\\log x^2 - \\log \\frac{1}{x^2}$의 값이 정수가 되도록 하는 모든 $x$값들의 곱은? [4.4점]",
    "choices": [
      "$10^{\\frac{13}{2}}$",
      "$10^{\\frac{15}{2}}$",
      "$10^{\\frac{17}{2}}$",
      "$10^{\\frac{19}{2}}$",
      "$10^{10}$"
    ],
    "answer": "④",
    "solution": "$x\\ge100>0$이므로 로그법칙을 사용할 수 있다.\n$\\log x^2-\\log(1/x^2)=\\log(x^4)=4\\log x$이다.\n$100\\le x<1000$에서 $2\\le\\log x<3$이므로 $8\\le4\\log x<12$. 정수가 되는 값은 $8,9,10,11$뿐이다.\n따라서 가능한 $x$는 $10^{8/4},10^{9/4},10^{10/4},10^{11/4}$이고, 그 곱은 $10^{(8+9+10+11)/4}=10^{19/2}$이다.\n정답은 ④이다.",
    "level": "중",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그의 뜻과 성질",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그의 뜻과 성질",
      "상용로그 정수 조건"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "상용로그 정수 조건",
    "decisiveStep": "로그 범위에서 정수 지수를 열거",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 7,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "어느 회사의 정수 필터는 정수 작업을 한 번 할 때마다 불순물 양의 $x\\%$를 제거 할 수 있다고 한다. 정수 작업을 10회 반복 실시하면 불순물의 양은 처음의 $10\\%$ 이하로 줄어든다고 할 때, 자연수 $x$의 최솟값은? (단, $\\log 7.95 = 0.9$로 계산한다.) [4.5점]",
    "choices": [
      "20",
      "21",
      "22",
      "23",
      "25"
    ],
    "answer": "②",
    "solution": "한 번 작업할 때 남는 불순물의 비율은 $1-x/100$이다. $0\\le x\\le100$ 범위에서 열 번 작업한 뒤의 비율은 $(1-x/100)^{10}$이다.\n조건은 $(1-x/100)^{10}\\le0.1$. 열제곱근을 취하면 $1-x/100\\le10^{-1/10}$이다.\n주어진 $\\log7.95=0.9$에서 $\\log0.795=-0.1$이므로 $10^{-1/10}=0.795$로 계산한다.\n$1-x/100\\le0.795$에서 $x\\ge20.5$. $x$가 자연수이므로 최솟값은 $21$이다. 정답은 ②이다.",
    "level": "중",
    "category": "지수함수",
    "originalCategory": "지수함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-03",
    "standardUnit": "지수함수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION",
    "subUnit": "지수함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "지수함수",
      "반복 감소 모델"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "지수부등식으로 반복 감소율 판정",
    "decisiveStep": "(1-x/100)^10<=0.1을 로그 근삿값으로 x>=20.5 판정",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 8,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "0이 아닌 세 실수 $a, b, c$에 대하여 $$\\frac{8}{a} + \\frac{6}{b} = \\frac{12}{c},\\quad 8^a = 81^b = x^c$$일 때, 양의 정수 $x$의 값은? [4.6점]",
    "choices": [
      "12",
      "18",
      "24",
      "30",
      "36"
    ],
    "answer": "⑤",
    "solution": "공통값을 $T=8^a=81^b=x^c$라고 두자. $a,b,c$가 모두 $0$이 아니고 $8,81>1$이므로 $T\\ne1$이다.\n양변에 자연로그를 취하면 $a=\\log T/\\log8$, $b=\\log T/\\log81$, $c=\\log T/\\log x$이다. (여기서 로그는 같은 밑이면 된다.)\n따라서 $\\frac8a+\\frac6b=\\frac{8\\log8+6\\log81}{\\log T}$이고 $\\frac{12}c=\\frac{12\\log x}{\\log T}$이다.\n$8\\log8+6\\log81=12\\log x$에서 $\\log x=\\frac23\\log8+\\frac12\\log81=\\log4+\\log9=\\log36$.\n그러므로 $x=36$, 정답은 ⑤이다.",
    "level": "상",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그의 뜻과 성질",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그의 뜻과 성질",
      "로그 밑 변환"
    ],
    "difficultyBucket": 4,
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "공통 거듭제곱의 로그 밑변환",
    "decisiveStep": "8log8+6log81=12logx에서 x=36",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 9,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.<br><br>(가) $f(x) = \\begin{cases} -2x & (-1 \\le x < 0) \\\\ 2x & (0 \\le x < 1) \\end{cases}$<br>(나) 모든 실수 $x$에 대하여 $f(x+2) = f(x)$이다.<br><br>자연수 $n$에 대하여 함수 $y=f(x)$의 그래프가 함수 $y=\\log_n x$의 그래프와 만나는 점의 개수가 48일 때, $n$의 값은? [5.1점]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "⑤",
    "solution": "$f(x+2)=f(x)$이므로 그래프는 주기가 $2$인 삼각파이고, 모든 $x$에서 $0\\le f(x)\\le2$이다. $x$가 짝수 정수이면 $f(x)=0$, 홀수 정수이면 $f(x)=2$이다.\n로그의 밑은 $n>0$, $n\\ne1$이어야 하므로 자연수 $n\\ge2$이다. $0<x<1$에서는 $\\log_n x<0\\le f(x)$라서 교점이 없고, $x>n^2$에서는 $\\log_n x>2\\ge f(x)$라서 교점이 없다.\n이제 $1\\le x\\le n^2$를 길이 $1$인 구간 $[1,2],[2,3],\\ldots,[n^2-1,n^2]$로 나눈다. 홀수 정수에서 삼각파의 높이는 $2$, 짝수 정수에서는 $0$이다. 반면 $1\\le x\\le n^2$에서 로그의 높이는 $0\\le\\log_n x\\le2$이고 연속적으로 증가한다. 따라서 각 구간의 양 끝에서 두 그래프의 위아래 관계가 뒤집혀 교점이 생긴다. 내려가는 구간에서는 한 함수는 감소, 다른 함수는 증가하므로 교점은 하나다. 올라가는 구간에서도 삼각파가 한 단위마다 $2$씩 상승하는 동안 로그의 상승폭은 그보다 작으므로 교점은 하나다.\n특히 끝점에서 중복 계산하지 않도록 확인하자. $x=1$에서는 $f(1)=2\\ne0=\\log_n1$이다. $n=7$이라면 $n^2=49$는 홀수이고 $f(49)=2=\\log_7 49$이므로 마지막 구간의 교점은 오른쪽 끝점에 정확히 하나 있다. 내부 정수 경계는 두 그래프의 높이가 같지 않아 중복되지 않는다.\n따라서 교점 수는 구간의 수 $n^2-1$과 같다. $n^2-1=48\\Rightarrow n^2=49$, 자연수 $n=7$이다. 정답은 ⑤이다.",
    "level": "상",
    "category": "로그함수",
    "originalCategory": "로그함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-04",
    "standardUnit": "로그함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH",
    "subUnit": "로그함수의 그래프",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그함수",
      "주기함수와 로그함수 교점"
    ],
    "difficultyBucket": 5,
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION",
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
    ],
    "primaryMethod": "주기함수와 로그함수 교점",
    "decisiveStep": "주기별 교점 수를 n² 경계까지 계수",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 10,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "$0 < a < b < 1$일 때, &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은? [5.2점]<br><b>&lt;보기&gt;</b><br>ㄱ. $\\log_{(b+1)}(a+1) > \\log_{(a+1)}(b+1)$<br>ㄴ. $\\log_a b > 1$<br>ㄷ. $\\log_a(a+1) > \\log_b(b+1)$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "$0<a<b<1$이므로 $1<a+1<b+1$이고 $\\log a<\\log b<0$이다. 밑이 $0$과 $1$ 사이인 로그는 감소한다는 점에 주의한다.\nㄱ. $1<a+1<b+1$이므로 $\\log_{b+1}(a+1)<1$이고 $\\log_{a+1}(b+1)>1$이다. 따라서 주어진 '>'는 거짓이다.\nㄴ. $a<b<1$이고 밑 $a$의 로그함수는 감소하므로 $\\log_a a=1>\\log_a b>\\log_a1=0$이다. 따라서 '$>1$'은 거짓이다.\nㄷ. 밑 변환으로 $\\log_a(a+1)=\\frac{\\log(1+a)}{\\log a}$, $\\log_b(b+1)=\\frac{\\log(1+b)}{\\log b}$이다. $0<\\log(1+a)<\\log(1+b)$이지만 $-\\log a>-\\log b>0$이므로 $\\frac{\\log(1+a)}{-\\log a}<\\frac{\\log(1+b)}{-\\log b}$이다. 두 값에 음수를 붙이면 부등호가 뒤집혀 $\\log_a(a+1)>\\log_b(b+1)$이므로 참이다.\n따라서 ㄷ만 옳고 정답은 ③이다.",
    "level": "상",
    "category": "로그의 뜻과 성질",
    "originalCategory": "로그의 뜻과 성질",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-02",
    "standardUnit": "로그의 뜻과 성질",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M1-02-LOGARITHM",
    "subUnit": "로그의 뜻과 성질",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그의 뜻과 성질",
      "로그 대소 비교"
    ],
    "difficultyBucket": 4,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY"
    ],
    "primaryMethod": "밑변환으로 로그 대소 비교",
    "decisiveStep": "음수 로그 분모를 양수로 바꾼 비율 비교 뒤 부등호 반전",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 11,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "$\\frac{\\pi}{2} \\le \\theta \\le \\frac{3\\pi}{2}$이고, 각 $\\theta$와 각 $6\\theta$를 나타내는 동경이 원점 대칭이 되도록 하는 $\\theta$의 개수는? [4.2점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "두 동경이 원점 대칭이라는 것은 두 각의 차가 홀수배 $\\pi$라는 뜻이다.\n$6\\theta=\\theta+(2k+1)\\pi$ ($k$는 정수)에서 $5\\theta=(2k+1)\\pi$, 즉 $\\theta=(2k+1)\\pi/5$이다.\n범위 $\\pi/2\\le\\theta\\le3\\pi/2$를 대입하면 $5/2\\le2k+1\\le15/2$. 가능한 홀수는 $3,5,7$이다.\n따라서 각의 개수는 $3$, 정답은 ③이다.",
    "level": "중",
    "category": "삼각함수의 뜻과 값",
    "originalCategory": "삼각함수의 뜻과 값",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-05",
    "standardUnit": "삼각함수의 뜻과 값",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-M1-05-TRIGONOMETRIC_DEFINITION",
    "subUnit": "삼각함수의 뜻과 값",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 뜻과 값",
      "동경 원점 대칭"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "동경 원점 대칭",
    "decisiveStep": "각 차이 홀수배 π를 범위에서 열거",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 12,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "둘레의 길이가 16인 부채꼴의 넓이가 최대일 때, 반지름 $r$과 중심각 $\\theta$에 대하여, $r+\\theta$의 값은? [4.1점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "②",
    "solution": "부채꼴의 호의 길이를 $l$이라 하면 둘레 조건은 $2r+l=16$이다. $l=r\\theta$이므로 $l=16-2r>0$, 즉 $0<r<8$이며 $\\theta=\\frac{16-2r}{r}=\\frac{16}{r}-2$이다.\n부채꼴 넓이는 $S=\\frac12rl=\\frac12r(16-2r)=8r-r^2=16-(r-4)^2$이다. 제곱은 항상 $0$ 이상이므로 $S$가 최대가 되는 것은 $r=4$일 때이고, 이는 $0<r<8$ 조건도 만족한다.\n이때 호의 길이 $l=16-2\\cdot4=8$, 중심각은 $\\theta=l/r=8/4=2$라디안이다. 따라서 $r+\\theta=4+2=6$, 정답은 ②이다.",
    "level": "중",
    "category": "삼각함수의 뜻과 값",
    "originalCategory": "삼각함수의 뜻과 값",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-05",
    "standardUnit": "삼각함수의 뜻과 값",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-M1-05-TRIGONOMETRIC_DEFINITION",
    "subUnit": "삼각함수의 뜻과 값",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 뜻과 값",
      "호도법 부채꼴 넓이"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_AREA"
    ],
    "primaryMethod": "호도법 부채꼴 넓이의 최댓값",
    "decisiveStep": "2r+l=16과 S=rl/2로 S=16-(r-4)^2 도출",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 13,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "원점 $O$와 점 $P(a, -4)$에 대하여 동경 $OP$가 나타내는 각의 크기를 $\\theta$라 할 때, $\\tan\\theta = -1$이다. $\\cos\\theta - \\sin\\theta$의 값은? (단, $a > 0$) [4점]",
    "choices": [
      "$-\\sqrt{2}$",
      "-2",
      "1",
      "2",
      "$\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "점 $P(a,-4)$가 제4사분면에 있고 $a>0$이다. $\\tan\\theta=\\frac{-4}{a}=-1$이므로 $a=4$이다.\n$OP=\\sqrt{4^2+(-4)^2}=4\\sqrt2$이므로 $\\cos\\theta=4/(4\\sqrt2)=1/\\sqrt2$, $\\sin\\theta=-4/(4\\sqrt2)=-1/\\sqrt2$이다.\n따라서 $\\cos\\theta-\\sin\\theta=2/\\sqrt2=\\sqrt2$, 정답은 ⑤이다.",
    "level": "하",
    "category": "삼각함수의 뜻과 값",
    "originalCategory": "삼각함수의 뜻과 값",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-05",
    "standardUnit": "삼각함수의 뜻과 값",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-M1-05-TRIGONOMETRIC_DEFINITION",
    "subUnit": "삼각함수의 뜻과 값",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 뜻과 값",
      "삼각함수 좌표값"
    ],
    "difficultyBucket": 2,
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "primaryMethod": "삼각함수 좌표값",
    "decisiveStep": "제4사분면에서 sin cos 부호 판정",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 14,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "$\\sin\\frac{7}{6}\\pi \\cos\\left(-\\frac{4}{3}\\pi\\right) + \\sin\\left(-\\frac{5}{3}\\pi\\right)\\tan\\frac{4}{3}\\pi$의 값은? [4.3점]",
    "choices": [
      "$-\\frac{5}{4}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{4}$",
      "$\\frac{7}{4}$",
      "2"
    ],
    "answer": "④",
    "solution": "각을 단위원의 기준각으로 바꾸어 부호를 판단한다.\n$\\sin(7\\pi/6)=-1/2$, $\\cos(-4\\pi/3)=\\cos(4\\pi/3)=-1/2$이므로 첫 곱은 $1/4$이다.\n$\\sin(-5\\pi/3)=\\sin(\\pi/3)=\\sqrt3/2$, $\\tan(4\\pi/3)=\\tan(\\pi/3)=\\sqrt3$이므로 둘째 곱은 $3/2$이다.\n합은 $1/4+3/2=7/4$이므로 정답은 ④이다.",
    "level": "중",
    "category": "삼각함수의 뜻과 값",
    "originalCategory": "삼각함수의 뜻과 값",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-05",
    "standardUnit": "삼각함수의 뜻과 값",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-M1-05-TRIGONOMETRIC_DEFINITION",
    "subUnit": "삼각함수의 뜻과 값",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 뜻과 값",
      "삼각함수 값"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "primaryMethod": "삼각함수 값",
    "decisiveStep": "기준각과 사분면 부호",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 15,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 16,
    "questionType": "객관식",
    "content": "함수 $f(x)=\\sin\\frac{\\pi}{2}x$ ($x \\ge 0$)의 그래프와 직선 $y=\\frac{2}{3}$가 만나는 점의 $x$좌표를 작은 것부터 차례대로 $\\alpha, \\beta, \\gamma$라 할 때, $f(\\alpha+\\beta+\\gamma+2) + f(\\beta+\\gamma-1)$의 값은? [5.2점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_제일고_1학기_중간_고2_수학I/q16.png\" class=\"exam-img\"></div>",
    "choices": [
      "$\\frac{5}{3}$",
      "2",
      "$\\frac{7}{3}$",
      "3",
      "$\\frac{11}{3}$"
    ],
    "answer": "①",
    "solution": "$f(x)=\\sin(\\pi x/2)$의 주기는 $4$이다. 그림의 첫 두 교점은 한 봉우리의 좌우에서 같은 높이를 가지므로 $\\alpha+\\beta=2$이다.\n세 번째 교점은 첫 교점에서 주기 $4$만큼 오른쪽이므로 $\\gamma=\\alpha+4$이다. 따라서 $\\beta+\\gamma=(2-\\alpha)+(\\alpha+4)=6$이다.\n$f(\\alpha+\\beta+\\gamma+2)=f(\\alpha+8)=f(\\alpha)=2/3$이고, $f(\\beta+\\gamma-1)=f(5)=\\sin(5\\pi/2)=1$이다.\n두 값을 더하면 $2/3+1=5/3$이므로 정답은 ①이다.",
    "level": "상",
    "category": "삼각함수의 그래프",
    "originalCategory": "삼각함수의 그래프",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-06",
    "standardUnit": "삼각함수의 그래프",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "subUnit": "삼각함수의 그래프",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 그래프",
      "주기 그래프 교점"
    ],
    "difficultyBucket": 4,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "primaryMethod": "주기 그래프 교점",
    "decisiveStep": "대칭·주기에서 교점 x좌표 합",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 16,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 17,
    "questionType": "객관식",
    "content": "그림은 함수 $y=a\\sin(bx-c)$의 그래프이다. $a > 0, b > 0, c > 0$일 때, $abc$의 최솟값은? [5점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_제일고_1학기_중간_고2_수학I/q17.png\" class=\"exam-img\"></div>",
    "choices": [
      "$\\pi$",
      "$2\\pi$",
      "$\\frac{2\\pi}{9}$",
      "$\\frac{\\pi}{9}$",
      "$\\frac{\\pi}{18}$"
    ],
    "answer": "④",
    "solution": "그래프의 최고 높이가 $3$, 최저 높이가 $-3$이므로 진폭은 $a=3$이다. 그림에 표시된 최고점 $x=11\\pi/6$에서 다음 최저점 $x=29\\pi/6$까지는 반주기이다.\n두 $x$좌표의 차는 $\\frac{29\\pi-11\\pi}{6}=3\\pi$이다. $y=a\\sin(bx-c)$의 주기는 $2\\pi/b$이므로 반주기는 $\\pi/b=3\\pi$, 따라서 $b=1/3$이다.\n최고점에서는 사인값이 $1$이므로 $bx-c=\\pi/2+2k\\pi$ ($k$는 정수)이다. $x=11\\pi/6$, $b=1/3$을 대입하면 $11\\pi/18-c=\\pi/2+2k\\pi$, 즉 $c=\\pi/9-2k\\pi$이다.\n$c>0$이므로 $k\\le0$이다. 가능한 값은 $\\pi/9,\\pi/9+2\\pi,\\ldots$이므로 가장 작은 양수 $c$는 $\\pi/9$이다. $a,b$는 그림에서 고정되므로 이 값에서 $abc$도 최소가 된다.\n$abc=3\\cdot\\frac13\\cdot\\frac\\pi9=\\frac\\pi9$이다. 정답은 ④이다.",
    "level": "상",
    "category": "삼각함수의 그래프",
    "originalCategory": "삼각함수의 그래프",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-06",
    "standardUnit": "삼각함수의 그래프",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "subUnit": "삼각함수의 그래프",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "삼각함수의 그래프",
      "삼각함수 그래프 변환"
    ],
    "difficultyBucket": 5,
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "primaryMethod": "삼각함수 그래프 변환",
    "decisiveStep": "최고점 최저점으로 진폭 주기 위상 복원",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 17,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 18,
    "questionType": "객관식",
    "content": "1보다 큰 실수 $a$에 대하여 함수 $y=a^x+3$의 그래프가 $y$축과 만나는 점을 $\\mathrm{A}$라 하고, 함수 $y=\\log_a(x-1)$의 그래프가 $x$축과 만나는 점을 $\\mathrm{B}$라 하자. 점 $\\mathrm{A}$를 지나고 $y$축에 수직인 직선이 함수 $y=\\log_a(x-1)$의 그래프와 만나는 점을 $\\mathrm{C}$, 점 $\\mathrm{B}$를 지나고 $x$축에 수직인 직선이 함수 $y=a^x+3$의 그래프와 만나는 점을 $\\mathrm{D}$라 하자. 사각형 $\\mathrm{ABCD}$의 넓이가 30일 때, $\\overline{\\mathrm{CD}}^2$의 값은? [5.3점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_제일고_1학기_중간_고2_수학I/q18.png\" class=\"exam-img\"></div>",
    "choices": [
      "67",
      "68",
      "69",
      "70",
      "71"
    ],
    "answer": "②",
    "solution": "두 그래프에서 먼저 네 꼭짓점의 좌표를 찾는다. $A$는 $x=0$에서 $a^0+3=4$이므로 $A=(0,4)$, $B$는 $\\log_a(x-1)=0$에서 $x-1=1$이므로 $B=(2,0)$이다.\n$C$는 $A$와 같은 높이 $y=4$에 있으므로 $\\log_a(x-1)=4\\Rightarrow x=1+a^4$, 즉 $C=(1+a^4,4)$이다. $D$는 $B$와 같은 $x=2$에 있으므로 $D=(2,a^2+3)$이다.\n그림에서 $AC$는 수평선분이고 길이는 $1+a^4$이다. 사각형 $ABCD$를 대각선 $AC$로 나누면 $\\triangle ABC$의 높이는 $4$, $\\triangle ACD$의 높이는 $(a^2+3)-4=a^2-1>0$이다. 따라서 사각형 넓이는\n$\\frac12(1+a^4)\\cdot4+\\frac12(1+a^4)(a^2-1)=\\frac12(1+a^4)(a^2+3)$이다.\n넓이가 $30$이므로 $(1+a^4)(a^2+3)=60$. $u=a^2>1$로 두면 $(1+u^2)(u+3)=60$이다. $u>1$에서 두 인수는 모두 양수이고 엄격히 증가하므로 해는 많아야 하나이다. $u=3$을 대입하면 $(1+9)(3+3)=60$이므로 유일한 해는 $u=3$이다.\n따라서 $C=(1+u^2,4)=(10,4)$, $D=(2,u+3)=(2,6)$이고, 피타고라스 정리로 $CD^2=(10-2)^2+(4-6)^2=64+4=68$이다. 정답은 ②이다.",
    "level": "상",
    "category": "로그함수",
    "originalCategory": "로그함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-04",
    "standardUnit": "로그함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH",
    "subUnit": "로그함수의 그래프",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "객관식",
      "로그함수",
      "지수·로그 그래프 도형"
    ],
    "difficultyBucket": 5,
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION",
    "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS",
    "crossConceptKeys": [
      "CC_AREA"
    ],
    "primaryMethod": "지수·로그 그래프 도형",
    "decisiveStep": "좌표 추출 후 사각형 넓이와 거리",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 18,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "※ 서술형 정답은 반드시 주어진 별도의 답안지나 답안지 뒷면의 [서술형 답란]에 검정 혹은 파란색 볼펜으로 기재합니다.<br><br>[서술형 1] $\\log_3(x-2) + \\log_3(x-4) \\le 1 + \\frac{3}{\\log_2 3}$을 만족시키는 모든 정수 $x$의 값의 합을 구하시오. [6점]",
    "choices": [],
    "answer": "26",
    "solution": "로그의 진수 조건부터 확인한다. $x-2>0$, $x-4>0$이므로 $x>4$이다.\n밑 변환 공식 $1/\\log_2 3=\\log_3 2$를 이용하면 오른쪽은 $1+3\\log_3 2=\\log_3 3+\\log_3 8=\\log_3 24$이다.\n왼쪽은 $\\log_3((x-2)(x-4))$이고 밑 $3>1$이므로 $(x-2)(x-4)\\le24$이다.\n$x^2-6x+8\\le24$에서 $(x-8)(x+2)\\le0$, 즉 $-2\\le x\\le8$이다. 진수 조건과 교집합은 $4<x\\le8$.\n정수해는 $5,6,7,8$이므로 합은 $5+6+7+8=26$이다.",
    "level": "중",
    "category": "로그함수",
    "originalCategory": "로그함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-04",
    "standardUnit": "로그함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION",
    "subUnit": "로그함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형",
      "로그함수",
      "로그부등식"
    ],
    "difficultyBucket": 3,
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_INEQUALITY_QUADRATIC"
    ],
    "primaryMethod": "로그부등식",
    "decisiveStep": "진수 조건·밑변환·정수해 교집합",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 19,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형 2] $0 < \\theta \\le 2\\pi$인 $\\theta$에 대하여 $\\sqrt{1-2\\sin\\theta\\cos\\theta} - \\sqrt{1-\\cos^2\\theta} = \\cos\\theta$를 만족시키는 모든 $\\theta$의 값의 범위가 $a\\pi \\le \\theta \\le b\\pi$일 때, $4(a+b)$의 값을 구하시오. (단, $a, b$는 상수이고, $\\theta \\ne \\frac{\\pi}{2}$이다.) [7점]",
    "choices": [],
    "answer": "13",
    "solution": "제곱근은 항상 음이 아닌 값을 뜻한다. $1-2\\sin\\theta\\cos\\theta=(\\sin\\theta-\\cos\\theta)^2$, $1-\\cos^2\\theta=\\sin^2\\theta$이므로 주어진 식은\n$|\\sin\\theta-\\cos\\theta|-|\\sin\\theta|=\\cos\\theta$이다. $0<\\theta\\le2\\pi$, $\\theta\\ne\\pi/2$ 조건을 끝까지 유지한다.\n① $\\sin\\theta\\ge0$인 경우: $|\\sin\\theta|=\\sin\\theta$이다. 만약 $\\sin\\theta-\\cos\\theta\\ge0$이면 좌변은 $-\\cos\\theta$이므로 $\\cos\\theta=0$이어야 한다. 이 구간의 후보 $\\theta=\\pi/2$는 제외된다. 반대로 $\\sin\\theta-\\cos\\theta<0$이면 좌변은 $\\cos\\theta-2\\sin\\theta$이므로 $\\sin\\theta=0$이어야 한다. $0<\\theta\\le2\\pi$에서 $\\theta=\\pi,2\\pi$를 확인하면 $\\pi$는 부호조건을 만족하지 않고 $2\\pi$는 원식을 만족한다.\n② $\\sin\\theta<0$인 경우: $|\\sin\\theta|=-\\sin\\theta$이므로 $|\\sin\\theta-\\cos\\theta|=\\cos\\theta-\\sin\\theta$이다. 이는 $\\cos\\theta-\\sin\\theta\\ge0$과 동치이다. $\\pi<\\theta<2\\pi$에서 $\\cos\\theta\\ge\\sin\\theta$가 되는 범위는 $5\\pi/4\\le\\theta<2\\pi$이다. 경계 $5\\pi/4$에서는 양변이 $0$으로 일치한다.\n①의 $2\\pi$를 합치면 해 전체는 $5\\pi/4\\le\\theta\\le2\\pi$이다. 따라서 $a=5/4$, $b=2$이고 $4(a+b)=4(5/4+2)=13$이다.",
    "level": "상",
    "category": "삼각방정식과 삼각부등식",
    "originalCategory": "삼각방정식과 삼각부등식",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-07",
    "standardUnit": "삼각방정식과 삼각부등식",
    "standardUnitOrder": 7,
    "subUnitKey": "H15-M1-07-TRIGONOMETRIC_EQUATION",
    "subUnit": "삼각방정식",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형",
      "삼각방정식과 삼각부등식",
      "삼각함수 절댓값 부등식"
    ],
    "difficultyBucket": 5,
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_INEQUALITY_ABSOLUTE_VALUE"
    ],
    "primaryMethod": "삼각함수 절댓값 방정식의 구간별 풀이",
    "decisiveStep": "sinθ와 sinθ-cosθ 부호 분리, θ=π/2 제외·2π 포함",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 20,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "[서술형 3] 양수 $a$에 대하여 세 점 $\\mathrm{P}(a-1, 2^{a-1})$, $\\mathrm{Q}(a, 4^a)$, $\\mathrm{R}(a+2, 2^{a+2})$을 꼭짓점으로 하는 삼각형 $\\mathrm{PQR}$의 넓이가 14일 때, $a$의 값을 구하시오. [7점]",
    "choices": [],
    "answer": "2",
    "solution": "세 점의 $x$좌표는 $a-1,a,a+2$로 차례대로 놓인다. 지수값을 $p=2^{a-1}$, $q=4^a=2^{2a}$, $r=2^{a+2}$라고 하자. 좌표는 $P=(a-1,p)$, $Q=(a,q)$, $R=(a+2,r)$이다.\n수직선을 내려 만든 사다리꼴 넓이의 차를 이용하면 세 점이 이루는 삼각형의 넓이는 $\\frac12|(r-p)-3(q-p)|=\\frac12|r+2p-3q|$이다. 여기서 $x_Q-x_P=1$, $x_R-x_P=3$인 사실을 사용했다. 행렬식이나 고학년 벡터는 필요 없다.\n$p=2^{a-1}$, $r=2^{a+2}=8\\cdot2^{a-1}$이므로 $r+2p=10\\cdot2^{a-1}=5\\cdot2^a$이다. 또 $q=2^{2a}$이다. 따라서 넓이 $14$ 조건은 $\\frac12|5\\cdot2^a-3\\cdot2^{2a}|=14$이다.\n$t=2^a$라 두면 $a>0$이므로 $t>1$이다. 식은 $|5t-3t^2|=28$이다. $5t-3t^2=28$이면 $3t^2-5t+28=0$인데 판별식 $25-336<0$이므로 실근이 없다. $5t-3t^2=-28$이면 $3t^2-5t-28=(3t+7)(t-4)=0$이다. $t>1$에서 가능한 것은 $t=4$뿐이다.\n$2^a=4=2^2$이므로 $a=2$이다. 실제로 이때 $P=(1,2)$, $Q=(2,16)$, $R=(4,16)$이므로 밑변 $QR=2$, 높이 $14$에서 넓이 $\\frac12\\cdot2\\cdot14=14$로 확인된다.",
    "level": "상",
    "category": "지수함수",
    "originalCategory": "지수함수",
    "standardCourse": "수학I",
    "standardUnitKey": "H15-M1-03",
    "standardUnit": "지수함수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION",
    "subUnit": "지수함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_documented",
    "layoutTag": "grid",
    "wide": false,
    "tags": [
      "서술형",
      "지수함수",
      "지수 좌표 삼각형 넓이"
    ],
    "difficultyBucket": 4,
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "primaryMethod": "지수함수 좌표 삼각형의 넓이",
    "decisiveStep": "수직 분할 넓이식 |5t-3t²|=28, t=2^a>1의 유일해",
    "metaProjectionStatus": "SEMANTIC_RPM_MAPPED_ACTIVE_EXACT_BINDING_UNRESOLVED",
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "22_제일고_1학기_중간_고2_수학I",
      "sourceQid": 21,
      "sourceOnlySha256": "a1f77104bb62161de578fefa269f3242cc742e968b9325a17ad990a9b109d30b"
    }
  }
];
