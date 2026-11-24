window.examTitle = "미적분II_157_미분계수와역함수의미분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$의 역함수를 $g$라 하자. $\\lim_{x\\to7}\\frac{f(x)-4}{x-7}=\\frac13$일 때 $g(4)-g'(4)$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "분모 $x-7\\to0$이고 몫의 극한이 유한하므로 분자도 $0$으로 간다(극한의 성질).\n$\\lim_{x\\to7}(f(x)-4)=0$이고 $f$는 미분가능하므로 연속, 따라서 $f(7)=4$이다.\n$f(7)=4$를 대입하면 미분계수의 정의 $f'(7)=\\lim_{x\\to7}\\frac{f(x)-f(7)}{x-7}$로부터 $f'(7)=\\frac13$이다.\n역함수의 정의 $f(g(x))=x$에서 $g(4)=7$이다.\n역함수의 미분법 $g'(4)=\\frac1{f'(7)}$에 대입하면 $g'(4)=\\frac1{1/3}=3$이다.\n따라서 $g(4)-g'(4)=7-3=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 가역함수 $f$가 $\\lim_{x\\to2}\\frac{f(x)-5}{x-2}=8$을 만족한다. 역함수 $g$에 대하여 $[g(x)]^3$의 $x=5$에서의 미분계수는?",
    "choices": [
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$"
    ],
    "answer": "③",
    "solution": "$x\\to2$에서 분모 $x-2\\to0$이고 몫이 유한하므로 $\\lim_{x\\to2}(f(x)-5)=0$이다.\n$f$의 연속성으로 $f(2)=5$이고, 미분계수의 정의로 $f'(2)=8$이다.\n역함수의 정의로 $g(5)=2$이다.\n역함수의 미분법 $g'(5)=\\frac1{f'(2)}=\\frac18$이다.\n합성함수의 미분법으로 $\\frac{d}{dx}[g(x)]^3=3[g(x)]^2g'(x)$이다.\n$x=5$를 대입하면 $3\\cdot g(5)^2\\cdot g'(5)=3\\cdot2^2\\cdot\\frac18$이다.\n$=3\\cdot4\\cdot\\frac18=\\frac{12}{8}=\\frac32$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=x^4+5x-2$ ($x\\ge0$)의 역함수를 $g$라 하자. $\\lim_{h\\to0}\\frac{g(4+h)-1}{h}$의 값은?",
    "choices": [
      "$\\frac{1}{9}$",
      "$\\frac{2}{9}$",
      "$\\frac{1}{3}$",
      "$\\frac{4}{9}$",
      "$\\frac{5}{9}$"
    ],
    "answer": "①",
    "solution": "$f(1)=1^4+5\\cdot1-2=1+5-2=4$이므로 역함수의 정의로 $g(4)=1$이다.\n분자의 $1$을 $g(4)$로 바꾸면 $\\lim_{h\\to0}\\frac{g(4+h)-g(4)}{h}$이고 이는 미분계수의 정의로 $g'(4)$이다.\n다항함수의 미분법으로 $f'(x)=4x^3+5$이므로 $f'(1)=4+5=9$이다.\n역함수의 미분법 $g'(4)=\\frac1{f'(1)}=\\frac19$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 가역함수 $f$의 역함수 $g$가 $\\lim_{x\\to6}\\frac{x-6}{g(x)-2}=4$를 만족한다. $f(2)+2f'(2)$의 값은?",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "③",
    "solution": "주어진 극한값 $4\\ne0$이므로 몫의 역수를 취하면 $\\lim_{x\\to6}\\frac{g(x)-2}{x-6}=\\frac14$이다.\n분모 $x-6\\to0$이고 몫이 유한하므로 분자도 $0$으로 가고, $g$의 연속성으로 $g(6)=2$이다.\n미분계수의 정의로 $g'(6)=\\frac14$이다.\n역함수의 정의로 $f(2)=6$이다.\n역함수의 미분법 $f'(2)=\\frac1{g'(6)}=\\frac1{1/4}=4$이다.\n따라서 $f(2)+2f'(2)=6+2\\cdot4=6+8=14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 5,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 가역함수 $f$의 역함수를 $g$라 하자. $\\lim_{x\\to3}\\frac{f(x)-7}{x-3}=\\frac25$일 때 $\\lim_{x\\to7}\\frac{g(x)-3}{x-7}$의 값은?",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "④",
    "solution": "분모 $x-3\\to0$이고 몫이 유한하므로 $\\lim_{x\\to3}(f(x)-7)=0$이고 연속성으로 $f(3)=7$이다.\n미분계수의 정의로 $f'(3)=\\frac25$이다.\n역함수의 정의로 $g(7)=3$이므로 $g(7)-3=0$이다.\n따라서 $\\lim_{x\\to7}\\frac{g(x)-3}{x-7}=\\lim_{x\\to7}\\frac{g(x)-g(7)}{x-7}=g'(7)$이다(미분계수의 정의).\n역함수의 미분법 $g'(7)=\\frac1{f'(3)}=\\frac1{2/5}=\\frac52$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 6,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$의 역함수 $g$도 미분가능하다. $f(3)=4$이고 $\\lim_{n\\to\\infty}n[g(4+\\frac3n)-g(4-\\frac2n)]=\\frac{5}{12}$일 때 $f'(3)$의 값은?",
    "choices": [
      "$10$",
      "$11$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "answer": "③",
    "solution": "$g(4)$를 더하고 빼면 극한 안의 식은 $n\\left[g\\left(4+\\frac3n\\right)-g(4)\\right]-n\\left[g\\left(4-\\frac2n\\right)-g(4)\\right]$이다.\n증분으로 나누고 곱하면 $3\\cdot\\frac{g(4+3/n)-g(4)}{3/n}+2\\cdot\\frac{g(4-2/n)-g(4)}{-2/n}$이다.\n$\\frac3n\\to0,\\ -\\frac2n\\to0$이므로 미분계수의 정의로 극한은 $3g'(4)+2g'(4)=5g'(4)$이다.\n$5g'(4)=\\frac5{12}$이므로 $g'(4)=\\frac1{12}$이다.\n$f(3)=4$이므로 역함수의 정의로 $g(4)=3$이고, 역함수의 미분법으로 $f'(3)=\\frac1{g'(4)}=\\frac1{1/12}=12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 가역함수 $f$는 홀함수이고 $\\lim_{x\\to2}\\frac{f(x)-5}{x-2}=\\frac34$이다. 역함수 $g$에 대해 $g'(-5)$의 값은?",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{5}{3}$"
    ],
    "answer": "④",
    "solution": "분모 $x-2\\to0$이고 몫이 유한하므로 $\\lim_{x\\to2}(f(x)-5)=0$이고 연속성으로 $f(2)=5$이다.\n미분계수의 정의로 $f'(2)=\\frac34$이다.\n$f$가 홀함수이므로 $f(-2)=-f(2)=-5$이다.\n$f(-x)=-f(x)$의 양변을 미분하면(합성함수의 미분법) $-f'(-x)=-f'(x)$, 즉 $f'(-x)=f'(x)$이다.\n따라서 $f'(-2)=f'(2)=\\frac34$이다.\n역함수의 정의로 $g(-5)=-2$이고, 역함수의 미분법 $g'(-5)=\\frac1{f'(-2)}=\\frac1{3/4}=\\frac43$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\sqrt{8x-7}$의 역함수를 $g$라 하자. $g(a)=2$이고 $\\lim_{x\\to a}\\frac{g(x)-2}{x-a}=b$이면 $a+b$의 값은?",
    "choices": [
      "$\\frac{11}{4}$",
      "$3$",
      "$\\frac{13}{4}$",
      "$\\frac{7}{2}$",
      "$\\frac{15}{4}$"
    ],
    "answer": "⑤",
    "solution": "$g(a)=2$에서 역함수의 정의로 $f(2)=a$이고 $f(2)=\\sqrt{16-7}=\\sqrt9=3$이므로 $a=3$이다.\n$g(a)=2$이므로 주어진 극한은 $\\lim_{x\\to a}\\frac{g(x)-g(a)}{x-a}=g'(a)$, 즉 $b=g'(3)$이다.\n합성함수의 미분법으로 $f'(x)=\\frac{8}{2\\sqrt{8x-7}}=\\frac4{\\sqrt{8x-7}}$이다.\n$x=2$를 대입하면 $f'(2)=\\frac4{\\sqrt{16-7}}=\\frac43$이다.\n역함수의 미분법으로 $b=g'(3)=\\frac1{f'(2)}=\\frac1{4/3}=\\frac34$이다.\n따라서 $a+b=3+\\frac34=\\frac{12}4+\\frac34=\\frac{15}4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 9,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=x^3+4x-1$의 역함수 $g$가 $\\lim_{h\\to0}\\frac{\\sum_{k=1}^{n}g(-1+kh)-ng(-1)}{h}=9$를 만족한다. 자연수 $n$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "②",
    "solution": "$f(0)=0+0-1=-1$이므로 역함수의 정의로 $g(-1)=0$이다.\n다항함수의 미분법으로 $f'(x)=3x^2+4$이고 $f'(0)=4$이다.\n역함수의 미분법으로 $g'(-1)=\\frac1{f'(0)}=\\frac14$이다.\n극한 안의 식을 정리하면 $\\sum_{k=1}^{n}\\frac{g(-1+kh)-g(-1)}{h}=\\sum_{k=1}^{n}k\\cdot\\frac{g(-1+kh)-g(-1)}{kh}$이다.\n$h\\to0$일 때 $kh\\to0$이므로 미분계수의 정의로 $\\frac{g(-1+kh)-g(-1)}{kh}\\to g'(-1)$이다.\n따라서 극한값은 $\\sum_{k=1}^{n}k\\cdot\\frac14=\\frac14\\cdot\\frac{n(n+1)}2=\\frac{n(n+1)}8$이다.\n$\\frac{n(n+1)}8=9$이므로 $n(n+1)=72$, $n^2+n-72=(n-8)(n+9)=0$이다.\n$n$은 자연수이므로 $n=8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=x^3+2x-1$의 역함수를 $g$라 하자. $\\lim_{x\\to2}\\frac{f(x)g(x)-11}{x-2}$의 값은?",
    "choices": [
      "$\\frac{81}{5}$",
      "$\\frac{83}{5}$",
      "$17$",
      "$\\frac{87}{5}$",
      "$\\frac{89}{5}$"
    ],
    "answer": "①",
    "solution": "$f(1)=1+2-1=2$이므로 역함수의 정의로 $g(2)=1$이다.\n$f(2)=8+4-1=11$이므로 $f(2)g(2)=11\\cdot1=11$이다.\n분자 $f(x)g(x)-11$은 $x=2$에서 $0$이므로 주어진 극한은 $x=2$에서 $(fg)(x)$의 미분계수 $(fg)'(2)$이다.\n다항함수의 미분법으로 $f'(x)=3x^2+2$이므로 $f'(2)=12+2=14$이다.\n또 $f'(1)=3+2=5$이고 역함수의 미분법으로 $g'(2)=\\frac1{f'(1)}=\\frac15$이다.\n곱의 미분법으로 $(fg)'(2)=f'(2)g(2)+f(2)g'(2)=14\\cdot1+11\\cdot\\frac15$이다.\n$=14+\\frac{11}5=\\frac{70}5+\\frac{11}5=\\frac{81}5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_PRODUCT_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 11,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 가역함수 $f$가 $\\lim_{x\\to2}\\frac{f(x)-4}{x-2}=\\frac13$, $\\lim_{x\\to4}\\frac{f(x)-7}{x-4}=\\frac12$를 만족한다. 역함수 $g$에 대해 $\\lim_{x\\to7}\\frac{g(g(x))-2}{x-7}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "분모가 $0$으로 가고 몫이 유한하므로 각 극한에서 분자는 $0$으로 간다.\n연속성으로 $f(2)=4$, $f(4)=7$이다.\n미분계수의 정의로 $f'(2)=\\frac13$, $f'(4)=\\frac12$이다.\n역함수의 정의로 $g(4)=2$, $g(7)=4$이고 $g(g(7))=g(4)=2$이다.\n분자 $g(g(x))-2$는 $x=7$에서 $0$이므로 주어진 극한은 $(g\\circ g)'(7)$이다.\n역함수의 미분법으로 $g'(4)=\\frac1{f'(2)}=3$, $g'(7)=\\frac1{f'(4)}=2$이다.\n합성함수의 미분법으로 $(g\\circ g)'(7)=g'(g(7))g'(7)=g'(4)g'(7)$이다.\n$=3\\cdot2=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 12,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 증가함수 $f$가 $\\lim_{x\\to3}\\frac{f(x)-5}{x-3}=2$와 $\\lim_{x\\to5}\\frac{f(x)-8}{x-5}=4$를 만족한다. 역함수 $g$에 대해 $h(x)=g(g(x))$라 하면 $h'(8)$의 값은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{8}$",
      "$\\frac{1}{2}$",
      "$\\frac{5}{8}$"
    ],
    "answer": "①",
    "solution": "각 몫의 극한이 유한하고 분모가 $0$으로 가므로 분자는 $0$으로 간다.\n연속성으로 $f(3)=5$, $f(5)=8$이다.\n미분계수의 정의로 $f'(3)=2$, $f'(5)=4$이다.\n역함수의 정의로 $g(5)=3$, $g(8)=5$이고 $h(8)=g(g(8))=g(5)=3$이다.\n역함수의 미분법으로 $g'(5)=\\frac1{f'(3)}=\\frac12$, $g'(8)=\\frac1{f'(5)}=\\frac14$이다.\n합성함수의 미분법으로 $h'(x)=g'(g(x))g'(x)$이다.\n$x=8$을 대입하면 $h'(8)=g'(g(8))g'(8)=g'(5)\\cdot\\frac14=\\frac12\\cdot\\frac14=\\frac18$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_STRICT_MONOTONE_VALUES"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 13,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "모든 실수에서 $f'(x)>0$이고 $\\lim_{x\\to3}\\frac{f(x)-6}{x^2-9}=2$이다. $f$의 역함수를 $g$라 할 때 $H(x)=x^2g(x)$의 $x=6$에서의 미분계수는?",
    "choices": [
      "$36$",
      "$39$",
      "$42$",
      "$45$",
      "$48$"
    ],
    "answer": "②",
    "solution": "분모 $x^2-9\\to0$이고 몫이 유한하므로 분자도 $0$으로 가고, 연속성으로 $f(3)=6$이다.\n분모를 인수분해하면 $\\frac{f(x)-6}{x^2-9}=\\frac{f(x)-6}{(x-3)(x+3)}=\\frac1{x+3}\\cdot\\frac{f(x)-6}{x-3}$이다.\n$\\frac{f(x)-6}{x-3}=\\frac{f(x)-f(3)}{x-3}\\to f'(3)$이고 $\\frac1{x+3}\\to\\frac16$이므로 곱의 극한으로 $\\frac16 f'(3)=2$이다.\n따라서 $f'(3)=12$이다.\n역함수의 정의로 $g(6)=3$이고, 역함수의 미분법으로 $g'(6)=\\frac1{f'(3)}=\\frac1{12}$이다.\n곱의 미분법으로 $H'(x)=2xg(x)+x^2g'(x)$이다.\n$x=6$을 대입하면 $H'(6)=12\\cdot3+36\\cdot\\frac1{12}=36+3=39$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_PRODUCT_RULE"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
