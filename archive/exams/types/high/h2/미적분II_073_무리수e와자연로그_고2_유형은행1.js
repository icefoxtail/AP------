window.examTitle = "미적분II_073_무리수e와자연로그_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(1+3x)^{2/x}$의 값은?",
    "choices": [
      "$e^2$",
      "$e^3$",
      "$e^6$",
      "$e^8$",
      "$e^9$"
    ],
    "answer": "③",
    "solution": "지수 꼴의 극한이므로 $(1+3x)^{2/x}=\\{(1+3x)^{1/(3x)}\\}^{6}$으로 변형한다(지수법칙).\n$t=3x$로 놓으면 $x\\to0$일 때 $t\\to0$이고, 지수는 $\\frac{2}{x}=\\frac{6}{t}$이다.\n따라서 $(1+3x)^{2/x}=(1+t)^{6/t}=\\{(1+t)^{1/t}\\}^6$이다.\n기본 극한 $\\lim_{t\\to0}(1+t)^{1/t}=e$를 적용하면 극한값은 $e^6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$k=\\lim_{x\\to-\\infty}(1-\\frac3x)^{-2x}$일 때 $\\ln k$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$t=-\\frac3x$로 놓으면 $x\\to-\\infty$일 때 $t\\to0^+$이다(치환).\n이때 $x=-\\frac3t$이므로 지수는 $-2x=\\frac6t$이다.\n따라서 $k=\\lim_{t\\to0^+}(1+t)^{6/t}=\\lim_{t\\to0^+}\\{(1+t)^{1/t}\\}^6$이다.\n기본 극한 $\\lim_{t\\to0}(1+t)^{1/t}=e$에 의해 $k=e^6$이다.\n$\\ln k=\\ln e^6=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "양수 $a,b$에 대하여 $A=\\lim_{x\\to0}(1+ax)^{2b/x}$, $B=\\lim_{x\\to\\infty}(1-\\frac bx)^{2ax}$일 때 항상 성립하는 관계는?",
    "choices": [
      "$A=B$",
      "$AB=1$",
      "$AB=e$",
      "$A=B^2$",
      "$A^2=B$"
    ],
    "answer": "②",
    "solution": "$A$는 $x\\to0$이므로 기본 극한 $\\lim_{x\\to0}(1+ax)^{1/(ax)}=e$를 이용한다.\n$A=\\lim_{x\\to0}\\{(1+ax)^{1/(ax)}\\}^{2ab}=e^{2ab}$이다(지수법칙).\n$B$는 $x\\to\\infty$이므로 $t=-\\frac bx$로 놓으면 $t\\to0$이고 $2ax=-\\frac{2ab}{t}$이다.\n따라서 $B=\\lim_{t\\to0}(1+t)^{-2ab/t}=e^{-2ab}$이다.\n그러면 $AB=e^{2ab}\\cdot e^{-2ab}=e^0=1$이다(지수법칙).\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\{(1+\\frac1{2x})(1+\\frac1{4x})\\}^{8x}$의 값은?",
    "choices": [
      "$e$",
      "$e^2$",
      "$e^3$",
      "$e^4$",
      "$e^6$"
    ],
    "answer": "⑤",
    "solution": "주어진 식을 $\\{(1+\\frac1{2x})^{8x}\\}\\{(1+\\frac1{4x})^{8x}\\}$로 나누어 본다(지수법칙).\n첫 인수는 $\\lim_{x\\to\\infty}(1+\\frac1{2x})^{2x\\cdot4}=e^4$이다(기본 극한).\n둘째 인수는 $\\lim_{x\\to\\infty}(1+\\frac1{4x})^{4x\\cdot2}=e^2$이다(기본 극한).\n두 극한값을 곱하면 $e^4\\cdot e^2=e^6$이다(극한의 곱에 관한 성질).\n주의: 각 인수의 지수를 $8x$로 맞출 때 $2x\\cdot4$, $4x\\cdot2$처럼 정확히 나누어야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$a=\\lim_{x\\to\\infty} x\\ln(1-\\frac2x)$, $b=\\lim_{x\\to\\infty} x\\{\\ln(x+5)-\\ln x\\}$일 때 $a+b$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$a$의 식은 $x\\ln(1-\\frac2x)=\\ln(1-\\frac2x)^x$이다(로그의 성질).\n$t=-\\frac2x$로 놓으면 $t\\to0$이고 $x=-\\frac2t$이므로 $a=\\lim_{t\\to0}-\\frac2t\\ln(1+t)=-\\ln\\{(1+t)^{2/t}\\}$이다.\n기본 극한 $(1+t)^{1/t}\\to e$에 의해 $a=-\\ln e^2=-2$이다.\n$b=\\lim_{x\\to\\infty}x\\ln\\frac{x+5}{x}=\\lim_{x\\to\\infty}\\ln(1+\\frac5x)^x$이다(로그의 성질).\n$s=\\frac5x$로 놓으면 $s\\to0$이고 $x=\\frac5s$이므로 $b=\\ln\\{(1+s)^{5/s}\\}=\\ln e^5=5$이다.\n따라서 $a+b=-2+5=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{n\\to\\infty}\\left\\{\\frac13\\prod_{k=n}^{3n-2}(1+\\frac1k)\\right\\}^{n}$의 값은?",
    "choices": [
      "$e^{-1/3}$",
      "$e^{-1/6}$",
      "$e^0$",
      "$e^{1/6}$",
      "$e^{1/3}$"
    ],
    "answer": "①",
    "solution": "$\\prod_{k=n}^{3n-2}(1+\\frac1k)=\\prod_{k=n}^{3n-2}\\frac{k+1}{k}$로 고친다.\n이것은 $\\frac{n+1}{n}\\cdot\\frac{n+2}{n+1}\\cdots\\frac{3n-1}{3n-2}$이므로 망원곱으로 약분된다.\n따라서 곱은 $\\frac{3n-1}{n}=3-\\frac1n$이다.\n그러면 $\\frac13\\prod_{k=n}^{3n-2}(1+\\frac1k)=\\frac13(3-\\frac1n)=1-\\frac1{3n}$이다.\n구하는 극한은 $\\lim_{n\\to\\infty}(1-\\frac1{3n})^n$이다.\n$t=\\frac1{3n}$으로 놓으면 $t\\to0^+$이고 $n=\\frac1{3t}$이므로 $(1-t)^{1/(3t)}=\\{(1-t)^{1/t}\\}^{1/3}$이다.\n기본 극한 $(1-t)^{1/t}\\to e^{-1}$에 의해 극한은 $e^{-1/3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$f(k)=\\lim_{x\\to\\infty}(1+\\frac{2k-1}{x})^x$일 때 $\\sum_{k=1}^{8}\\ln f(k)$는?",
    "choices": [
      "$48$",
      "$56$",
      "$64$",
      "$72$",
      "$80$"
    ],
    "answer": "③",
    "solution": "$f(k)$는 $x\\to\\infty$일 때 기본 극한 $(1+\\frac{c}{x})^x\\to e^c$를 이용한다.\n$c=2k-1$로 두면 $f(k)=e^{2k-1}$이다.\n따라서 $\\ln f(k)=\\ln e^{2k-1}=2k-1$이다(로그의 성질).\n$\\sum_{k=1}^{8}\\ln f(k)=\\sum_{k=1}^{8}(2k-1)=1+3+5+\\cdots+15$이다.\n등차수열의 합 공식 $S_n=\\frac{n(a+l)}{2}$에 $n=8$, $a=1$, $l=15$를 대입하면 $\\frac{8\\cdot16}{2}=64$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-145",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
