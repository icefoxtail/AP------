window.examTitle = "21_팔마고_1학기_중간_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "다음은 다항식의 나눗셈에 관한 지은이와 서진이의 대화이다. (가), (나), (다)에 들어갈 식으로 옳은 것을 고르시오. (4.6점)\n\n지은: 다항식 $P(x)=x^3-2x^2+3x+1$을 $x^2-x+1$로 나누었을 때 몫은 (가)이고 나머지는 (나)야.\n\n서진: 그럼 $P(x)$를 $x-1$로 나누면 몫은 (다)이고 나머지는 3이겠네.\n\n지은: 그래 맞아.",
    "choices": [
      "$x-1,\\;x-2,\\;x^2-x+1$",
      "$x-1,\\;x+2,\\;x^2-x+2$",
      "$x+1,\\;x-2,\\;x^2+x-2$",
      "$x+1,\\;-3,\\;x^2-x+2$",
      "$x-1,\\;x+2,\\;x^2-x-2$"
    ],
    "tags": [
      "객관식",
      "다항식의 나눗셈",
      "몫과 나머지"
    ],
    "answer": "②",
    "solution": "먼저 $P(x)$를 $x^2-x+1$로 나눈 몫과 나머지를 확인한다.\n\n$(x-1)(x^2-x+1)+(x+2)$\n$=x^3-2x^2+2x-1+x+2$\n$=x^3-2x^2+3x+1=P(x)$이다.\n\n따라서 첫 번째 나눗셈의 몫은 $x-1$, 나머지는 $x+2$이므로 $(가)=x-1$, $(나)=x+2$이다.\n\n이번에는 $P(x)$를 $x-1$로 나눈다.\n\n$(x-1)(x^2-x+2)+3$\n$=x^3-2x^2+3x-2+3$\n$=x^3-2x^2+3x+1=P(x)$이다.\n\n따라서 두 번째 나눗셈의 몫은 $x^2-x+2$, 나머지는 $3$이다. 그러므로 $(다)=x^2-x+2$이고, 보기에서 이에 해당하는 것은 ②이다.",
    "level": "중",
    "category": "다항식의 나눗셈",
    "originalCategory": "다항식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "layoutTag": "grid",
    "wide": false,
    "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION",
    "subUnit": "다항식의 나눗셈",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_DIVISION",
    "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL"
  ,
    "rpmPrimary": {
      "recordId": "H1-RPM-006",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "다항식의 연산",
      "L3": "다항식의 나눗셈",
      "L4": "몫과 나머지",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "두 번의 표준 나눗셈과 몫·나머지 확인이 필요하지만 풀이법이 바로 정해지고 비정형 조건 선택은 없다.",
    "sourceToMetaStatus": "CONFIRMED"
  
},
  {
    "id": 2,
    "questionType": "객관식",
    "content": "식 $\\dfrac{(2021+\\sqrt{2022})^3+(2021-\\sqrt{2022})^3}{2021}$의 값을 $A$라 할 때, 자연수 $A$의 일의 자리의 수를 구하시오. (4.9점)",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "tags": [
      "객관식",
      "곱셈공식",
      "대칭식"
    ],
    "answer": "③",
    "solution": "$u=2021$, $v=\\sqrt{2022}$라 두면 분자의 두 항은 $(u+v)^3+(u-v)^3$ 꼴이다.\n\n$(u+v)^3=u^3+3u^2v+3uv^2+v^3$,\n\n$(u-v)^3=u^3-3u^2v+3uv^2-v^3$이므로, 더하면 홀수 차수의 $v$ 항이 없어져\n\n$(u+v)^3+(u-v)^3=2u^3+6uv^2$이다.\n\n$v^2=2022$를 대입하면\n\n$A=\\dfrac{2\\cdot2021^3+6\\cdot2021\\cdot2022}{2021}$\n$=2\\cdot2021^2+6\\cdot2022$이다.\n\n일의 자리만 계산하기 위해 $2021$의 일의 자리는 $1$, $2022$의 일의 자리는 $2$임을 이용하면\n\n$A$의 일의 자리 $=2\\cdot1^2+6\\cdot2$의 일의 자리\n$=14$의 일의 자리\n$=4$이다.\n\n따라서 정답은 ③이다.",
    "level": "중",
    "category": "곱셈공식과 대칭식",
    "originalCategory": "다항식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "layoutTag": "grid",
    "wide": false,
    "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC",
    "subUnit": "다항식의 기본 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC",
    "templateKey": "TPL_H1_FORMULA_SYMMETRIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "NONE",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL"
  ,
    "rpmPrimary": {
      "recordId": "H1-RPM-003",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "다항식의 연산",
      "L3": "다항식의 곱셈",
      "L4": "곱셈공식",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "짝을 이룬 세제곱 합 공식이라는 익숙한 한 번의 변형 뒤 단위 자리 계산을 한다; 전략 선택 부담은 낮다.",
    "sourceToMetaStatus": "CONFIRMED",
    "conditionReason": "문제에서 A를 자연수로 지정하고 그 십진 일의 자리 값을 묻는다; active condition registry의 자연수 조건을 적용."
  
},
  {
    "id": 3,
    "questionType": "객관식",
    "content": "모든 실수 $x$에 대하여 등식 $2x^2+ax-6=(bx+3)(x+c)$이 성립할 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값을 고르시오. (4.2점)",
    "choices": [
      "$-3$",
      "$-1$",
      "0",
      "2",
      "4"
    ],
    "tags": [
      "객관식",
      "항등식",
      "계수비교"
    ],
    "answer": "②",
    "solution": "우변을 전개하면\n\n$(bx+3)(x+c)=bx^2+(bc+3)x+3c$이다.\n\n이 식이 모든 실수 $x$에 대하여 성립하므로 같은 차수의 계수를 비교한다.\n\n$x^2$의 계수에서 $b=2$,\n\n상수항에서 $3c=-6$이므로 $c=-2$이다.\n\n$x$의 계수에서\n\n$a=bc+3=2\\cdot(-2)+3=-1$이다.\n\n따라서 $a+b+c=-1+2-2=-1$이고, 정답은 ②이다.",
    "level": "하",
    "category": "항등식과 계수비교",
    "originalCategory": "다항식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "layoutTag": "grid",
    "wide": false,
    "subUnitKey": "H15-SA-02-IDENTITY",
    "subUnit": "항등식과 계수비교",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT",
    "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL"
  ,
    "rpmPrimary": {
      "recordId": "H1-RPM-007",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "항등식과 나머지정리",
      "L3": "항등식",
      "L4": "미정계수법",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "한 번 전개한 뒤 계수 비교만 수행하는 직접 적용형이며 별도 전략 선택이 없다.",
    "sourceToMetaStatus": "CONFIRMED"
  
},
  {
    "id": 4,
    "questionType": "객관식",
    "content": "다항식 $P(x)$를 $(x-1)^2$으로 나누었을 때 나머지는 $x-4$이고, $x-2$로 나누었을 때 나머지는 2이다. $P(x)$를 $(x-1)^2(x-2)$로 나누었을 때의 나머지를 $R(x)$라 할 때, $R(3)$의 값을 구하시오. (4.7점)",
    "choices": [
      "7",
      "9",
      "13",
      "15",
      "17"
    ],
    "tags": [
      "객관식",
      "나머지정리",
      "합성 제수"
    ],
    "answer": "④",
    "solution": "$(x-1)^2(x-2)$로 나눈 나머지 $R(x)$의 차수는 3보다 작으므로 $R(x)$는 이차 이하의 다항식이다.\n\n$(x-1)^2$으로 나눈 나머지가 $x-4$이므로 $R(x)-(x-4)$는 $(x-1)^2$의 배수이다. 두 다항식의 차수가 2 이하이므로 어떤 상수 $k$에 대하여\n\n$R(x)=x-4+k(x-1)^2$로 쓸 수 있다.\n\n또 $P(x)$와 $R(x)$의 차는 $(x-1)^2(x-2)$의 배수이므로 $x=2$를 대입하면 $P(2)=R(2)$이다. $x-2$로 나눈 나머지가 2이므로 $R(2)=2$이고,\n\n$-2+k=2$,\n$k=4$이다.\n\n따라서\n\n$R(3)=3-4+4(3-1)^2$\n$=-1+16$\n$=15$이다.\n\n정답은 ④이다.",
    "level": "중",
    "category": "나머지정리",
    "originalCategory": "다항식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "layoutTag": "grid",
    "wide": false,
    "subUnitKey": "H15-SA-02-REMAINDER_FACTOR",
    "subUnit": "나머지정리와 인수정리",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_REMAINDER_THEOREM",
    "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL"
  ,
    "rpmPrimary": {
      "recordId": "H1-RPM-010",
      "mappingStatus": "FAMILY_ACTIVE",
      "L1": "다항식",
      "L2": "항등식과 나머지정리",
      "L3": "나머지정리",
      "L4": "고차식 조건",
      "projectionStatus": "REUSE",
      "templateSelectionReason": "고차식 조건에 따라 합성 제수의 나머지 다항식을 구성하는 decisive step이므로 등록 후보 TPL_H1_REMAINDER_COMPOSITE_DIVISOR를 선택."
    },
    "difficultyReason": "나머지 다항식의 형태를 구성하고 두 divisor 조건을 연결해 매개변수를 구해야 하므로 표준 유형 안에서 풀이 구조 선택이 필요하다.",
    "sourceToMetaStatus": "CONFIRMED"
  
},
  {
    "id": 5,
    "questionType": "객관식",
    "content": "다항식 $f(x)=x^4+ax^2+b$가 다음 조건을 모두 만족시킬 때, 상수 $a,b$에 대하여 $2a+b$의 값을 구하시오. (4.6점)\n\n(가) $f(x)$는 $x-3$으로 나누어떨어진다.\n\n(나) $x^2-3$은 $f(x)$의 인수이다.",
    "choices": [
      "$-3$",
      "$-1$",
      "0",
      "1",
      "3"
    ],
    "tags": [
      "객관식",
      "인수분해",
      "인수정리"
    ],
    "answer": "⑤",
    "solution": "$x^2-3$이 $f(x)$의 인수이므로 $f(x)=(x^2-3)(x^2+px+q)$로 둘 수 있다. 이를 전개했을 때 $x^3$의 계수는 $p$인데, $f(x)=x^4+ax^2+b$에는 $x^3$항이 없으므로 $p=0$이다. 따라서\n\n$f(x)=(x^2-3)(x^2+q)$이다.\n\n또 $x-3$이 $f(x)$의 인수이므로 인수정리에 의해 $f(3)=0$이다.\n\n$0=(3^2-3)(3^2+q)$,\n$0=6(9+q)$이므로 $q=-9$이다.\n\n전개하면\n\n$f(x)=(x^2-3)(x^2-9)$\n$=x^4-12x^2+27$이다.\n\n따라서 $a=-12$, $b=27$이고\n\n$2a+b=2(-12)+27=3$이다.\n\n정답은 ⑤이다.",
    "level": "중",
    "category": "인수분해의 활용",
    "originalCategory": "인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "layoutTag": "grid",
    "wide": false,
    "subUnitKey": "H15-SA-03-FACTORIZATION",
    "subUnit": "인수분해",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL"
  ,
    "rpmPrimary": {
      "recordId": "H1-RPM-020",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "인수분해",
      "L3": "인수분해의 활용",
      "L4": "조건식",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "인수 구조를 이용해 quotient 형태를 정하고 명시된 인수 조건으로 계수를 정하는 전형적 2조건 풀이이며 비정형 분기는 없다.",
    "sourceToMetaStatus": "CONFIRMED"
  
},
  {
    "id": 6,
    "questionType": "객관식",
    "content": "이차함수 $f(x)=x^2+5x+2$와 서로 다른 두 실수 $a,b;(a<b)$가 $f(a)=b$, $f(b)=a$를 만족시킬 때, 함수 $y=(x-a)(x-b)$는 $x=\\alpha$일 때 최솟값 $\\beta$를 갖는다고 한다. $\\alpha\\beta$의 값을 구하시오. (4.9점)",
    "choices": [
      "$-6$",
      "$-3$",
      "$-1$",
      "3",
      "8"
    ],
    "tags": [
      "객관식",
      "이차함수"
    ],
    "answer": "4",
    "solution": "두 조건을 빼면 $a+b$가 바로 나타난다.\n\n$f(a)=b$, $f(b)=a$이므로\n$b-a=f(a)-f(b)$이다.\n\n$f(x)=x^2+5x+2$를 대입하면\n$b-a=(a^2+5a+2)-(b^2+5b+2)$이다.\n\n차의 제곱 공식으로 묶으면\n$b-a=(a-b)(a+b+5)$이다.\n\n$a-b=-(b-a)$이므로\n$b-a=-(b-a)(a+b+5)$이다.\n\n$a<b$이므로 $b-a>0$이고, 따라서 $b-a\\ne 0$이다.\n양변을 $b-a$로 나누면\n$1=-(a+b+5)$이다.\n따라서 $a+b=-6$이다.\n\n$b=-6-a$를 $b=f(a)$에 대입하면\n$-6-a=a^2+5a+2$이다.\n모든 항을 한쪽으로 모으면\n$a^2+6a+8=0$이다.\n인수분해하면\n$(a+2)(a+4)=0$이다.\n따라서 $a=-2$ 또는 $a=-4$이다.\n\n$a=-2$이면 $b=-4$여서 $a<b$를 만족하지 않는다.\n$a=-4$이면 $b=-2$이고 $a<b$를 만족한다.\n그러므로 $a=-4$, $b=-2$이다.\n\n이제 꼭짓점의 가로좌표와 최솟값을 구한다.\n$y=(x-a)(x-b)=(x+4)(x+2)$이다.\n전개하면\n$y=x^2+6x+8$이다.\n완전제곱식으로 바꾸면\n$y=(x+3)^2-1$이다.\n제곱항은 $x=-3$일 때 $0$이 되므로\n$\\alpha=-3$, $\\beta=-1$이다.\n$\\alpha\\beta=(-3)(-1)$이다.\n$\\alpha\\beta=3$이므로 정답은 ④이다.",
    "solutionImage": "assets/images/21_팔마고_1학기_중간_고1_기출/21_팔마고_1학기_중간_고1_기출_q06_solution.svg",
    "solutionImageAlt": "포물선 y=(x+3)²−1에서 두 근 (-4, 0), (-2, 0)과 최솟점 (-3, -1)을 표시한 그래프",
    "solutionImageCaption": "두 근의 중점 x=-3에서 최솟값 -1을 가지므로 α=-3, β=-1이다.",
    "solutionImageSize": "medium"
  ,
    "level": "상",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION",
    "subUnit": "이차함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_EXTREMA",
    "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-037",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식과 이차함수",
      "L3": "최대·최소",
      "L4": "구간 최대·최소",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "두 순환 조건을 빼서 a+b를 얻고, a<b로 두 근의 순서를 골라낸 뒤 완전제곱으로 최솟값의 좌표와 값을 구한다. 연결 전략이 필요하다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "이차함수의 활용",
    "originalCategory": "이차함수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "a<b는 두 해의 순서를 고르고 b−a≠0을 보이는 결정 조건이다. 현행 H1 Condition registry에 정확한 두 변수 순서 key가 없어 COND_RANGE/COND_NONZERO를 대신 붙이지 않았다.",
    "evidenceDebt": [
      {
        "field": "conditionKeys",
        "status": "EVIDENCE_DEBT",
        "reason": "원문 조건 a<b는 해의 순서 선택과 b−a≠0에 결정적이다. 현행 canonical condition_registry.json에 pairwise-order key가 없다. 기존 key를 오용하거나 원본 기출에 새 Generated key를 만들지 않았다.",
        "evidenceSource": "archive/data/meta-foundation/canonical/condition_registry.json"
      }
    ]
  
},
  {
    "id": 7,
    "questionType": "객관식",
    "content": "$z=\\dfrac{2+i}{1-i}$일 때, $2z^3-z+3$의 값을 구하시오. (단, $i=\\sqrt{-1}$이다.) (4.9점)",
    "choices": [
      "$-4+6i$",
      "$-4-6i$",
      "$4+6i$",
      "$4-6i$",
      "$i$"
    ],
    "tags": [
      "객관식",
      "복소수의 계산"
    ],
    "answer": "2",
    "solution": "분모를 실수로 만들기 위해 켤레복소수 $1+i$를 곱한다.\n\n$z=\\dfrac{2+i}{1-i}$이다.\n\n$z=\\dfrac{(2+i)(1+i)}{(1-i)(1+i)}$이다.\n분모를 계산하면\n$(1-i)(1+i)=1-i^2=2$이다.\n분자를 전개하면\n$(2+i)(1+i)=2+2i+i+i^2$이다.\n$i^2=-1$을 대입하면 분자는 $1+3i$이다.\n따라서\n$z=\\dfrac{1+3i}{2}$이다.\n\n$i^2=-1$을 이용해 제곱하면\n$z^2=\\left(\\dfrac{1+3i}{2}\\right)^2$이다.\n$z^2=\\dfrac{1+6i+9i^2}{4}$이다.\n$z^2=\\dfrac{-8+6i}{4}$이다.\n따라서 $z^2=\\dfrac{-4+3i}{2}$이다.\n\n세제곱은 $z^2$에 $z$를 곱한다.\n$z^3=\\dfrac{(-4+3i)(1+3i)}{4}$이다.\n분자를 전개하면 $-4-12i+3i+9i^2$이다.\n$i^2=-1$을 대입하면 $z^3=\\dfrac{-13-9i}{4}$이다.\n\n이제 주어진 식에 대입한다.\n$2z^3-z+3=2\\cdot\\dfrac{-13-9i}{4}-\\dfrac{1+3i}{2}+3$이다.\n$2z^3-z+3=\\dfrac{-13-9i}{2}-\\dfrac{1+3i}{2}+3$이다.\n$2z^3-z+3=\\dfrac{-14-12i}{2}+3$이다.\n$2z^3-z+3=-7-6i+3$이다.\n$2z^3-z+3=-4-6i$이므로 정답은 ②이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
    "subUnit": "복소수의 계산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_OPERATION",
    "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-023",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "복소수",
      "L3": "복소수의 연산",
      "L4": "사칙연산",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "복소수 나눗셈의 분모 유리화 뒤 제곱·세제곱을 직접 전개하고 값을 대입한다. 풀이 방법이 곧바로 정해지는 표준 연산 문제이다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "복소수의 계산",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false
  
},
  {
    "id": 8,
    "questionType": "객관식",
    "content": "복소수 $z=a+bi$ ($a,b$는 0이 아닌 실수)에 대하여 $z^2-z$가 실수일 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은? (단, $i=\\sqrt{-1}$이고, $\\overline{z}$는 $z$의 켤레복소수이다.) (4.8점)\n\n<보기>\n\nㄱ. $\\overline{z^2-z}$는 실수이다.\n\nㄴ. $z+\\overline{z}=1$\n\nㄷ. $z\\overline{z}\\leq\\dfrac{1}{4}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "tags": [
      "객관식",
      "복소수"
    ],
    "answer": "3",
    "solution": "$z=a+bi$에서\n$z^2-z=(a+bi)^2-(a+bi)$\n$=(a^2-b^2-a)+(2ab-b)i$이다.\n\n$z^2-z$가 실수이므로 허수 부분이 $0$이다.\n$2ab-b=b(2a-1)=0$이고, 주어진 조건에서 $b\\ne0$이므로\n$a=\\dfrac12$이다.\n\n이제 보기의 세 명제를 확인한다.\n\nㄱ. $z^2-z$가 실수이므로 그 켤레복소수 $\\overline{z^2-z}$도 실수이다. 참.\n\nㄴ. $z+\\overline z=(a+bi)+(a-bi)=2a=1$. 참.\n\nㄷ. $z\\overline z=a^2+b^2=\\dfrac14+b^2>\\dfrac14$이다. 따라서 $z\\overline z\\le\\dfrac14$는 거짓이다.\n\n참인 것은 ㄱ, ㄴ이므로 정답은 ③이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_NUMBER_OPERATION",
    "subUnit": "복소수의 계산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION",
    "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": null,
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "복소수",
      "L3": "복소수 조건과 방정식",
      "L4": "실수·순허수 조건",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "복소수식의 실수 조건을 허수 부분의 방정식으로 바꾸고, 도출한 값으로 세 명제를 검토한다. 조건 해석과 논리 판정이 필요하다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "복소수의 계산",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "주어진 b≠0이 허수 부분 b(2a−1)=0에서 a=1/2를 결정한다. a≠0은 주어졌지만 결정 과정에는 쓰이지 않는다.",
    "evidenceDebt": [
      {
        "field": "rpmPrimary.recordId",
        "status": "EVIDENCE_DEBT",
        "reason": "H1 runtime taxonomyRows에는 현재 L3/L4와 PT/TPL의 2015/수학(상) active row가 있으나, high1.json의 H1-RPM record 중 정확히 같은 L3/L4를 가진 ID가 없다. H1-RPM-026은 L3가 i의 거듭제곱이어서 이 문항에 붙이지 않았다.",
        "evidenceSource": "archive/data/meta-foundation/runtime/h1-foundation-v1.json; archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
      }
    ]
  
},
  {
    "id": 9,
    "questionType": "객관식",
    "content": "다음 중 복소수의 범위에서 이차방정식의 인수분해가 바르게 이루어진 것을 고르시오. (4.5점)",
    "choices": [
      "$2x^2-3x+4=(x-\\dfrac{3+\\sqrt{23}i}{4})(x-\\dfrac{3-\\sqrt{23}i}{4})$",
      "$x^2-4x+5=(x-2-i)(x-2+i)$",
      "$x^2-2x+4=(x+1-\\sqrt{3}i)(x+1+\\sqrt{3}i)$",
      "$3x^2+2x+2=3(x+1-\\dfrac{1}{\\sqrt{5}}i)(x+1+\\dfrac{1}{\\sqrt{5}}i)$",
      "$x^2-6x+1=(x+3-2\\sqrt{2})(x-3+2\\sqrt{2})$"
    ],
    "tags": [
      "객관식",
      "복소수",
      "이차방정식의 인수분해"
    ],
    "answer": "2",
    "solution": "각 보기의 곱을 확인해 주어진 이차식과 계수를 비교한다.\n\n① 오른쪽 식은 두 일차식의 곱이므로 최고차항의 계수가 $1$이다. 왼쪽의 최고차항 계수는 $2$이므로 같지 않다.\n\n② $(x-2-i)(x-2+i)=(x-2)^2+1=x^2-4x+5$이므로 왼쪽 식과 같다.\n\n③ $(x+1-\\sqrt3i)(x+1+\\sqrt3i)=(x+1)^2+3=x^2+2x+4$이다. $x$의 계수가 다르다.\n\n④ $3(x+1-\\dfrac{i}{\\sqrt5})(x+1+\\dfrac{i}{\\sqrt5})$\n$=3\\left((x+1)^2+\\dfrac15\\right)$\n$=3x^2+6x+\\dfrac{18}{5}$이므로 주어진 식과 다르다.\n\n⑤ 오른쪽 식은\n$(x+(3-2\\sqrt2))(x-(3-2\\sqrt2))$\n$=x^2-(3-2\\sqrt2)^2$이므로 $x$의 계수가 $0$이다. 왼쪽의 $x$의 계수는 $-6$이다.\n\n따라서 바르게 인수분해한 것은 ②이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_ROOT",
    "subUnit": "복소수와 이차방정식",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION",
    "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-031",
      "mappingStatus": "DIRECT_BINDING_GAP",
      "L1": "방정식과 부등식",
      "L2": "이차방정식",
      "L3": "복소수 근",
      "L4": "허근",
      "projectionStatus": "PROJECTION_BINDING_PENDING"
    },
    "difficultyReason": "다섯 선택지의 계수와 켤레인수 곱을 확인한다. 익숙한 곱셈공식이지만 여러 식을 비교해야 한다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "복소수와 이차방정식",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false,
    "evidenceDebt": [
      {
        "field": "rpmPrimary.projectionStatus",
        "status": "EVIDENCE_DEBT",
        "reason": "정확한 H1-RPM-031은 복소수 근/허근 family지만 high1.json의 bindingStatus가 MISSING(DIRECT_BINDING_GAP)이다. 글로벌 PT/TPL key는 존재하므로 보존하되 2015 binding reuse를 주장하지 않는다.",
        "evidenceSource": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json; archive/data/meta-foundation/canonical/packs/h1-foundation/taxonomy.json"
      }
    ]
  
},
  {
    "id": 10,
    "questionType": "객관식",
    "content": "실수 $a,b$에 대하여 $\\dfrac{1}{i}+\\dfrac{2}{i^2}+\\dfrac{3}{i^3}+\\dfrac{4}{i^4}+\\cdots+\\dfrac{2020}{i^{2020}}+\\dfrac{2021}{i^{2021}}=a+bi$일 때, $a+b$의 값을 구하시오. (4.5점)",
    "choices": [
      "$-2$",
      "$-1$",
      "0",
      "1",
      "2"
    ],
    "tags": [
      "객관식",
      "복소수의 거듭제곱"
    ],
    "answer": "2",
    "solution": "$i^4=1$이므로 $1/i^k$의 값은 네 항마다 반복된다.\n$1/i=-i$, $1/i^2=-1$, $1/i^3=i$, $1/i^4=1$이다.\n\n$k=4n+1,4n+2,4n+3,4n+4$인 네 항을 묶는다.\n$\\dfrac{4n+1}{i^{4n+1}}+\\dfrac{4n+2}{i^{4n+2}}+\\dfrac{4n+3}{i^{4n+3}}+\\dfrac{4n+4}{i^{4n+4}}$\n$=-(4n+1)i-(4n+2)+(4n+3)i+(4n+4)$이다.\n실수 부분과 허수 부분을 각각 모으면\n$=\\bigl(-(4n+2)+(4n+4)\\bigr)+\\bigl(-(4n+1)+(4n+3)\\bigr)i$이다.\n따라서 네 항의 합은 $2+2i$이다.\n\n$2020=4\\cdot505$이므로 네 항 묶음은 $505$개이다.\n처음 $2020$항의 합은\n$505(2+2i)=1010+1010i$이다.\n\n$2021\\equiv1\\pmod4$이므로 마지막 항은\n$\\dfrac{2021}{i^{2021}}=-2021i$이다.\n주어진 합은\n$1010+1010i-2021i=1010-1011i$이다.\n따라서 $a=1010$, $b=-1011$이고\n$a+b=1010-1011$이다.\n따라서 $a+b=-1$이고 정답은 ②이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
    "subUnit": "복소수의 계산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT",
    "templateKey": "TPL_H1_COMPLEX_I_PERIOD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-025",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "복소수",
      "L3": "i의 거듭제곱",
      "L4": "주기성",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "i의 4주기를 이용해 2020항을 505묶음으로 나누고 마지막 항을 따로 처리한다. 주기와 잔여항을 함께 추적해야 한다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "복소수의 계산",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false
  
},
  {
    "id": 11,
    "questionType": "객관식",
    "content": "오른쪽 그림과 같이 이차함수 $y=x^2+mx+3$의 그래프와 직선 $y=2x+n$의 두 교점의 $x$좌표가 각각 1, 4일 때, 실수 $m-n$의 값을 구하시오. (4.6점)",
    "choices": [
      "$-4$",
      "$-2$",
      "0",
      "2",
      "4"
    ],
    "tags": [
      "객관식",
      "이차함수",
      "그래프"
    ],
    "image": "assets/images/21_팔마고_1학기_중간_고1_기출/q11.png",
    "answer": "2",
    "solution": "두 그래프의 교점에서는 두 함수의 값이 같으므로\n$x^2+mx+3=2x+n$,\n즉 $x^2+(m-2)x+(3-n)=0$이다.\n\n이 이차방정식의 두 근은 교점의 $x$좌표인 $1,4$이다. 근의 합과 곱을 비교하면\n$1+4=-(m-2)$이므로 $m=-3$,\n$1\\cdot4=3-n$이므로 $n=-1$이다.\n\n따라서\n$m-n=-3-(-1)=-2$.\n\n정답은 ②이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION",
    "subUnit": "이차방정식과 이차함수의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": null,
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식과 이차함수",
      "L3": "이차함수의 그래프와 교점",
      "L4": "교점 좌표와 그래프·도형 관계",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "교점 조건을 근을 갖는 이차방정식으로 바꾸고 근의 합·곱으로 두 매개변수를 정한다. 그래프 조건과 계수 관계를 잇는 단계가 필요하다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "이차방정식과 이차함수의 관계",
    "originalCategory": "이차방정식",
    "layoutTag": "grid",
    "wide": false,
    "evidenceDebt": [
      {
        "field": "rpmPrimary.recordId",
        "status": "EVIDENCE_DEBT",
        "reason": "H1 runtime taxonomy의 2015/수학(상) exact row는 교점 좌표와 그래프 관계 및 현재 PT/TPL을 active/selectable로 제공한다. high1.json에는 이 exact L3/L4 recordId가 없고 H1-RPM-033은 x축 교점, H1-RPM-035는 교점 개수로 범위가 달라 어느 쪽도 exact ID로 가장하지 않았다.",
        "evidenceSource": "archive/data/meta-foundation/runtime/h1-foundation-v1.json; archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
      }
    ]
  
},
  {
    "id": 12,
    "questionType": "객관식",
    "content": "$a\\leq0$일 때, 다음 식을 간단히 하시오. (4.6점)\n\n$\\dfrac{\\sqrt{2a}\\sqrt{-2a}+\\sqrt{-2a}\\sqrt{-2a}}{2a}+\\dfrac{\\sqrt{a}}{\\sqrt{-a}}-\\dfrac{\\sqrt{a^2}}{\\sqrt{(-a)^2}}$",
    "choices": [
      "$-2$",
      "$-i+1$",
      "0",
      "$i$",
      "2"
    ],
    "tags": [
      "객관식",
      "복소수",
      "제곱근"
    ],
    "answer": "1",
    "solution": "먼저 식이 정의되는 범위를 확인한다.\n$a=0$이면 분모 $2a$와 $\\sqrt{-a}$가 모두 $0$이므로 식이 정의되지 않는다.\n주어진 조건 $a\\le0$에서 실제 계산 범위는 $a<0$이다.\n\n$a<0$일 때 음수의 제곱근과 절댓값은\n$\\sqrt{2a}=i\\sqrt{-2a}$,\n$\\sqrt a=i\\sqrt{-a}$,\n$\\sqrt{a^2}=|a|=-a$,\n$\\sqrt{(-a)^2}=|-a|=-a$이다.\n\n첫째 분수의 첫 곱을 바꾸면\n$\\sqrt{2a}\\sqrt{-2a}=i\\sqrt{-2a}\\sqrt{-2a}$이다.\n제곱으로 묶으면\n$=i\\bigl(\\sqrt{-2a}\\bigr)^2$이다.\n$\\bigl(\\sqrt{-2a}\\bigr)^2=-2a$이므로\n$=-2ai$이다.\n또 다른 곱은\n$\\sqrt{-2a}\\sqrt{-2a}=\\bigl(\\sqrt{-2a}\\bigr)^2$이다.\n$=-2a$이다.\n따라서 첫째 분수는\n$\\dfrac{-2ai-2a}{2a}$이다.\n$a\\ne0$이므로 약분하면\n$-i-1$이다.\n\n둘째 분수는\n$\\dfrac{\\sqrt a}{\\sqrt{-a}}=\\dfrac{i\\sqrt{-a}}{\\sqrt{-a}}=i$이다.\n셋째 분수는\n$\\dfrac{\\sqrt{a^2}}{\\sqrt{(-a)^2}}=\\dfrac{-a}{-a}=1$이다.\n\n세 부분을 합치면\n$(-i-1)+i-1$이다.\n허수 부분이 없어지고 실수 부분은 $-1-1=-2$이므로\n전체 값은 $-2$이다.\n따라서 정답은 ①이다."
  ,
    "level": "상",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
    "subUnit": "복소수의 계산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_OPERATION",
    "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION",
    "crossConceptKeys": [
      "CC_RADICAL_EXPRESSION"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-023",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "복소수",
      "L3": "복소수의 연산",
      "L4": "사칙연산",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "복소수 제곱근의 부호 변환, 분모의 정의 가능성, √(a²)=|a| 처리를 모두 구분해야 한다. a=0 경계를 놓치면 풀이가 성립하지 않는다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "복소수의 계산",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "원문은 a≤0을 준다. a=0이면 2a와 √(−a)가 분모에서 0이 되어 식이 정의되지 않으므로 실제 계산 범위는 a<0이며, 이를 확인한 뒤 √(2a)=i√(−2a)를 쓴다."
  
},
  {
    "id": 13,
    "questionType": "객관식",
    "content": "$n$이 자연수일 때, $\\left(\\dfrac{1+i}{\\sqrt{2}}\\right)^{2n}-\\left(\\dfrac{\\sqrt{2}}{1-i}\\right)^{2n}$을 간단히 하면? (4.2점)",
    "choices": [
      "$2i$",
      "2",
      "0",
      "$-2$",
      "$-2i$"
    ],
    "tags": [
      "객관식",
      "복소수의 거듭제곱"
    ],
    "answer": "3",
    "solution": "두 밑을 같게 만들 수 있는지 확인한다. 둘째 밑의 분모를 유리화하면\n$\\dfrac{\\sqrt2}{1-i}\n=\\dfrac{\\sqrt2(1+i)}{(1-i)(1+i)}\n=\\dfrac{1+i}{\\sqrt2}$이다.\n\n따라서 두 밑이 같으므로\n$\\left(\\dfrac{1+i}{\\sqrt2}\\right)^{2n}\n-\\left(\\dfrac{\\sqrt2}{1-i}\\right)^{2n}=0$이다.\n\n정답은 ③이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
    "subUnit": "복소수의 계산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_COMPLEX_OPERATION",
    "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "NONE",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-023",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "복소수",
      "L3": "복소수의 연산",
      "L4": "사칙연산",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "한 번의 분모 유리화로 두 밑이 같음을 확인하면 거듭제곱을 계산하지 않고 바로 소거된다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "복소수의 계산",
    "originalCategory": "복소수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "n이 자연수이므로 두 밑의 2n제곱이 정의되는 정수 거듭제곱이다."
  
},
  {
    "id": 14,
    "questionType": "단답형",
    "content": "단답형 1. 세 다항식 $A=-x^2+x-2$, $B=x^2+x+3$, $C=-2x^2-3x+1$에 대하여 $(A+2B)-(C-B)+2C$를 계산하시오. (3점)",
    "choices": [],
    "tags": [
      "단답형",
      "다항식의 연산"
    ],
    "answer": "$x+8$",
    "solution": "괄호 앞의 빼기 기호를 먼저 분배한다.\n$(A+2B)-(C-B)+2C=A+2B-C+B+2C=A+3B+C$.\n\n세 다항식을 대입해 동류항끼리 모으면\n$(-x^2+x-2)+3(x^2+x+3)+(-2x^2-3x+1)$\n$=(-1+3-2)x^2+(1+3-3)x+(-2+9+1)$\n$=x+8$.\n\n정답은 $x+8$이다."
  ,
    "level": "하",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC",
    "subUnit": "다항식의 기본 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION",
    "templateKey": "TPL_H1_POLY_OPERATION_DIRECT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-002",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "다항식의 연산",
      "L3": "다항식의 덧셈과 뺄셈",
      "L4": "다항식의 덧셈·뺄셈",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "괄호 앞 부호를 처리한 뒤 같은 차수의 계수만 더하는 직접 계산형이다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "다항식의 기본 연산",
    "originalCategory": "다항식의 연산",
    "layoutTag": "grid",
    "wide": false
  
},
  {
    "id": 15,
    "questionType": "단답형",
    "content": "단답형 2. 자연수 $n$에 대하여 가로의 길이가 $n^3+6n^2+11n+6$, 세로의 길이가 $n^2+5n+6$인 직사각형 모양의 바닥이 있다. 한 변의 길이가 $n+2$인 정사각형 모양의 타일로 이 바닥 전체를 겹치지 않게 빈틈없이 깔려고 한다. 이때 필요한 타일의 개수를 구하시오. (타일의 개수를 인수분해한 식으로 나타내시오.) (5점)",
    "choices": [],
    "tags": [
      "단답형",
      "다항식의 인수분해",
      "문장제"
    ],
    "answer": "$(n+1)(n+3)^2$",
    "solution": "타일 한 변이 $n+2$이므로 가로와 세로가 각각 $n+2$의 배수인지 확인한다.\n\n가로 길이를 묶어 인수분해한다.\n$n^3+6n^2+11n+6$\n$=n^3+3n^2+3n^2+9n+2n+6$이다.\n$=n^2(n+3)+3n(n+3)+2(n+3)$이다.\n$=(n+3)(n^2+3n+2)$이다.\n따라서 $n^3+6n^2+11n+6=(n+1)(n+2)(n+3)$이다.\n\n세로 길이는\n$n^2+5n+6=n^2+2n+3n+6$이다.\n$=n(n+2)+3(n+2)$이므로\n$n^2+5n+6=(n+2)(n+3)$이다.\n\n가로 방향 타일 수는\n$\\dfrac{(n+1)(n+2)(n+3)}{n+2}=(n+1)(n+3)$이다.\n세로 방향 타일 수는\n$\\dfrac{(n+2)(n+3)}{n+2}=n+3$이다.\n$n$이 자연수이므로 두 수는 모두 자연수여서 타일을 빈틈없이 배열할 수 있다.\n\n전체 타일 수는 두 방향의 타일 수를 곱한 값이다.\n$(n+1)(n+3)(n+3)=(n+1)(n+3)^2$이다.\n따라서 필요한 타일은 $(n+1)(n+3)^2$개이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-SA-03-FACTORIZATION",
    "subUnit": "인수분해",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "crossConceptKeys": [
      "CC_AREA"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-014",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "인수분해",
      "L3": "공통인수",
      "L4": "단계적 인수분해",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "세제곱식·이차식의 단계적 인수분해 후 타일 한 변에 대한 두 길이의 몫을 구하고 행·열 수를 곱한다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "n은 자연수이므로 두 방향 타일 수가 자연수가 되어 빈틈없이 정수 개의 정사각형 타일로 채워진다."
  
},
  {
    "id": 16,
    "questionType": "단답형",
    "content": "단답형 3. 이차방정식 $x^2+(a+2)x+2a=0$의 한 근이 1일 때, 다른 한 근을 $\\alpha$라 하자. $a+\\alpha$의 값을 구하시오. (4점)",
    "choices": [],
    "tags": [
      "단답형",
      "이차방정식"
    ],
    "answer": "$-3$",
    "solution": "두 근을 $1$과 $\\alpha$라 두면 근의 합과 곱에 따라\n$1+\\alpha=-(a+2)$,\n$\\alpha=2a$이다.\n\n둘째 식을 첫째 식에 대입하면\n$1+2a=-(a+2)$,\n$3a=-3$이므로 $a=-1$이다.\n따라서 $\\alpha=2a=-2$이고,\n$a+\\alpha=-1+(-2)=-3$이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-06",
    "standardUnit": "이차방정식의 근과 계수",
    "standardUnitOrder": 6,
    "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION",
    "subUnit": "근과 계수의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION",
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-029",
      "mappingStatus": "DIRECT_BINDING_GAP",
      "L1": "방정식과 부등식",
      "L2": "이차방정식",
      "L3": "근과 계수의 관계",
      "L4": "근의 합·곱",
      "projectionStatus": "PROJECTION_BINDING_PENDING"
    },
    "difficultyReason": "알려진 한 근으로 근의 합·곱 식을 각각 세워 계수와 다른 근을 결정하는 표준 2관계 풀이이다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "근과 계수의 관계",
    "originalCategory": "이차방정식의 근과 계수",
    "layoutTag": "grid",
    "wide": false,
    "evidenceDebt": [
      {
        "field": "rpmPrimary.projectionStatus",
        "status": "EVIDENCE_DEBT",
        "reason": "H1-RPM-029 has DIRECT_BINDING_GAP and bindingStatus MISSING for the H15-SA-06 root-coefficient subunit. The semantic row remains exact, but the source-to-PT/TPL binding is not claimed as reused.",
        "evidenceSource": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
      },
      {
        "field": "templateKey",
        "status": "EVIDENCE_DEBT",
        "reason": "Active TPL_H1_VIETA_SYMMETRIC_VALUE is defined for symmetric expressions; this target is a mixed coefficient/root sum, and the other active Viète template concerns transformed roots. No template is assigned by guess.",
        "evidenceSource": "archive/data/meta-foundation/canonical/packs/h1-foundation/taxonomy.json"
      }
    ]
  
},
  {
    "id": 17,
    "questionType": "단답형",
    "content": "단답형 4. $x$에 대한 이차방정식 $x^2-(2a+2+m)x+a^2+4a-n=0$이 실수 $a$의 값에 관계없이 항상 중근을 가질 때, 실수 $m,n$에 대하여 $m+n$의 값을 구하시오. (4점)",
    "choices": [],
    "tags": [
      "단답형",
      "이차방정식",
      "중근"
    ],
    "answer": "$-2$",
    "solution": "모든 실수 $a$에서 중근을 가지므로 판별식 $\\Delta$는 모든 $a$에서 $0$이어야 한다.\n\n$\\Delta=(2a+2+m)^2-4(a^2+4a-n)$이다.\n첫째 제곱을 전개하면\n$\\Delta=4a^2+4(m+2)a+(m+2)^2-4(a^2+4a-n)$이다.\n나머지 괄호를 전개하면\n$\\Delta=4a^2+4(m+2)a+(m+2)^2-4a^2-16a+4n$이다.\n동류항을 모으면\n$\\Delta=4(m-2)a+(m+2)^2+4n$이다.\n\n이 일차식이 모든 $a$에서 $0$이므로 $a$의 계수와 상수항이 각각 $0$이다.\n$4(m-2)=0$이므로 $m=2$이다.\n$(m+2)^2+4n=0$에 $m=2$를 대입하면\n$16+4n=0$이다.\n$4n=-16$이므로 $n=-4$이다.\n따라서 $m+n=2+(-4)=-2$이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-SA-05-DISCRIMINANT",
    "subUnit": "판별식과 근의 조건",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT",
    "templateKey": "TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": null,
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식",
      "L3": "이차방정식의 근과 판별식",
      "L4": "매개변수와 무관한 판별식 조건",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "모든 실수 a에서 중근이 되어야 하므로 판별식이 a의 항등식이 된다. 전개한 뒤 두 계수를 소거한다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "판별식과 근의 조건",
    "originalCategory": "이차방정식",
    "layoutTag": "grid",
    "wide": false,
    "evidenceDebt": [
      {
        "field": "rpmPrimary.recordId",
        "status": "EVIDENCE_DEBT",
        "reason": "H1 runtime taxonomy has the exact 2015/수학(상) parameter-independent discriminant row and active PT/TPL; high1.json H1-RPM-028 is bound to the broader root-existence template, not this exact parameter-identity template. No record ID is substituted.",
        "evidenceSource": "archive/data/meta-foundation/runtime/h1-foundation-v1.json; archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
      }
    ]
  
},
  {
    "id": 18,
    "questionType": "단답형",
    "content": "단답형 5. 이차함수 $y=x^2+2x+5$의 그래프 위의 점 $(0,5)$에서 이 그래프에 접하는 직선의 방정식이 $y=ax+b$일 때, $a-b$의 값을 구하시오. (단, $a,b$는 상수이다.) (4점)",
    "choices": [],
    "tags": [
      "단답형",
      "이차함수",
      "접선"
    ],
    "answer": "$-3$",
    "solution": "접선은 그래프 위의 점 $(0,5)$를 지나므로 $y$절편은 $b=5$이다.\n\n포물선과 직선 $y=ax+5$의 교점에서는\n$x^2+2x+5=ax+5$,\n즉 $x^2+(2-a)x=0$,\n$x(x+2-a)=0$이다.\n\n주어진 점의 $x$좌표는 $0$이다. 이 점에서 접하려면 교점 방정식이 $x=0$을 중근으로 가져야 하므로 두 번째 인수도 $x=0$에서 $0$이어야 한다.\n$2-a=0$이므로 $a=2$이다.\n\n따라서 $a-b=2-5=-3$이다.",
    "solutionImage": "assets/images/21_팔마고_1학기_중간_고1_기출/21_팔마고_1학기_중간_고1_기출_q18_solution.svg",
    "solutionImageAlt": "포물선 y=x²+2x+5와 접선 y=2x+5가 점 (0,5)에서 만나는 그래프",
    "solutionImageCaption": "직선은 포물선과 (0,5) 한 점에서 만나므로 접선이다. 이 직선의 기울기는 a=2, y절편은 b=5이다.",
    "solutionImageSize": "medium"
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION",
    "subUnit": "이차방정식과 이차함수의 관계",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-036",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식과 이차함수",
      "L3": "직선과 포물선",
      "L4": "접선 조건",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "접점을 이용해 y절편을 먼저 얻고, 교점 이차방정식의 중근 조건으로 기울기를 정하는 직접 적용형이다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "이차방정식과 이차함수의 관계",
    "originalCategory": "이차방정식",
    "layoutTag": "grid",
    "wide": false
  
},
  {
    "id": 19,
    "questionType": "서술형",
    "content": "서술형 1. 삼각형 $ABC$의 세 변의 길이를 $a,b,c$라고 하자. 등식 $a^4+b^4-c^4+2a^2b^2=0$이 성립할 때, 삼각형 $ABC$는 어떤 삼각형인지 말하시오. (7점)",
    "choices": [],
    "tags": [
      "서술형",
      "다항식의 인수분해",
      "삼각형"
    ],
    "answer": "직각삼각형 ($\\angle C=90^\\circ$)",
    "solution": "주어진 식의 앞 세 항은 완전제곱으로 묶을 수 있다.\n$a^4+b^4-c^4+2a^2b^2=0$\n$\\Longleftrightarrow (a^2+b^2)^2-c^4=0$\n$\\Longleftrightarrow (a^2+b^2-c^2)(a^2+b^2+c^2)=0$.\n\n$a,b,c$는 삼각형의 변의 길이이므로 모두 양수이다. 따라서 $a^2+b^2+c^2>0$이고, 첫째 인수가 $0$이어야 한다.\n$a^2+b^2=c^2$.\n\n피타고라스 정리의 역에 따라 변 $c$의 맞은편 각 $C$가 직각이다. 따라서 삼각형 $ABC$는 $C$가 직각인 직각삼각형이다.",
    "solutionImage": "assets/images/21_팔마고_1학기_중간_고1_기출/21_팔마고_1학기_중간_고1_기출_q19_solution.svg",
    "solutionImageAlt": "변 a와 b가 C에서 직각으로 만나고, 그 맞은편 빗변이 c인 삼각형 ABC",
    "solutionImageCaption": "a²+b²=c²이므로 ∠C=90°이고, 변 c가 빗변이다. 도형은 관계를 보여 주는 모식도이다.",
    "solutionImageSize": "medium"
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-SA-03-FACTORIZATION",
    "subUnit": "인수분해",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-016",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "다항식",
      "L2": "인수분해",
      "L3": "인수분해 공식",
      "L4": "합과 차",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "차의 제곱으로 인수분해하고 변의 양수 조건으로 올바른 인수를 0으로 둔 뒤 삼각형의 종류로 해석한다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "a,b,c는 삼각형의 변의 길이이므로 양수이다. 따라서 a²+b²+c²>0이고 두 번째 인수는 0이 될 수 없다."
  
},
  {
    "id": 20,
    "questionType": "서술형",
    "content": "서술형 2. 이차함수 $y=f(x)$가 다음 조건을 모두 만족시킬 때, 함수 $y=f(x)$의 그래프와 $x$축의 교점의 $x$좌표들의 합을 구하시오. (7점)\n\n(가) 모든 실수 $x$에 대하여 $f(2-x)=f(2+x)$이다.\n\n(나) $x$의 값의 범위가 $1\\leq x\\leq 5$일 때, 함수 $y=f(x)$의 최댓값은 8, 최솟값은 $-10$이다.\n\n(다) 이차함수 $y=f(x)$의 그래프와 직선 $y=4x+2$는 접한다.",
    "choices": [],
    "tags": [
      "서술형",
      "이차함수",
      "최대최소",
      "접선"
    ],
    "answer": "$4$",
    "solution": "조건 (가)는 대칭축이 $x=2$라는 뜻이다.\n따라서 $f(x)=p(x-2)^2+q$로 둘 수 있고, 이차함수이므로 $p\\ne0$이다.\n\n구간 $[1,5]$에서 꼭짓점 $x=2$는 구간 안에 있다.\n끝점까지의 거리는 $|1-2|=1$, $|5-2|=3$이므로 $x=5$가 더 멀다.\n\n먼저 $p>0$인 경우를 나눈다.\n꼭짓점에서 최솟값을 가지므로 $q=-10$이다.\n더 먼 끝점 $x=5$에서 최댓값을 가지므로 $q+9p=8$이다.\n$-10+9p=8$이다.\n$9p=18$이므로 $p=2$이다.\n이 경우 $(p,q)=(2,-10)$이다.\n\n다음으로 $p<0$인 경우를 나눈다.\n꼭짓점에서 최댓값을 가지므로 $q=8$이다.\n더 먼 끝점 $x=5$에서 최솟값을 가지므로 $q+9p=-10$이다.\n$8+9p=-10$이다.\n$9p=-18$이므로 $p=-2$이다.\n이 경우 $(p,q)=(-2,8)$이다.\n\n조건 (다)에서 직선과 포물선은 한 점에서 만나므로 교점 방정식은 중근을 가진다.\n따라서 교점 방정식의 판별식은 $0$이다.\n$p(x-2)^2+q=4x+2$이다.\n$px^2-4px+4p+q=4x+2$이다.\n$px^2-(4p+4)x+(4p+q-2)=0$이다.\n\n이 이차방정식의 판별식은\n$\\Delta=(4p+4)^2-4p(4p+q-2)$이다.\n$=16p^2+32p+16-16p^2-4pq+8p$이다.\n$=40p+16-4pq$이다.\n\n$(p,q)=(2,-10)$이면\n$\\Delta=40(2)+16-4(2)(-10)=176\\ne0$이다.\n따라서 이 경우에는 접하지 않는다.\n\n$(p,q)=(-2,8)$이면\n$\\Delta=40(-2)+16-4(-2)(8)=0$이다.\n따라서 접하는 함수는 $f(x)=-2(x-2)^2+8$이다.\n\n$x$축과 만나는 점에서는 $f(x)=0$이다.\n$-2(x-2)^2+8=0$이다.\n$(x-2)^2=4$이다.\n$x-2=2$ 또는 $x-2=-2$이다.\n따라서 $x=4$ 또는 $x=0$이고, 두 $x$좌표의 합은 $4$이다.",
    "solutionImage": "assets/images/21_팔마고_1학기_중간_고1_기출/21_팔마고_1학기_중간_고1_기출_q20_solution.svg",
    "solutionImageAlt": "구간 [1,5]에서 포물선 y=−2(x−2)²+8과 직선 y=4x+2, 최댓점 (2,8), 최솟점 (5,−10), 접점 (1,6), x절편 0과 4를 나타낸 그래프",
    "solutionImageCaption": "축 x=2와 구간 끝점에서 최댓값·최솟값을 확인하고, 직선은 (1,6)에서 접한다. 포물선의 x절편은 0과 4이다.",
    "solutionImageSize": "large"
  ,
    "level": "상",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION",
    "subUnit": "이차함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_EXTREMA",
    "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL",
    "crossConceptKeys": [
      "CC_DISCRIMINANT",
      "CC_FUNCTION_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 5,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": "H1-RPM-037",
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식과 이차함수",
      "L3": "최대·최소",
      "L4": "구간 최대·최소",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "대칭축, 구간 끝점, 위·아래로 열린 포물선의 두 후보를 나눈 뒤 접선 판별식으로 하나를 고르고 근의 합까지 구한다.",
    "sourceToMetaStatus": "CONFIRMED",
    "category": "이차함수의 활용",
    "originalCategory": "이차함수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "x의 구간 [1,5]와 대칭축 x=2의 상대 위치가 최댓값·최솟값을 정하므로 범위 조건이 결정적이다."
  
},
  {
    "id": 21,
    "questionType": "서술형",
    "content": "서술형 3. 이차함수 $y=x^2+ax-a-2$의 그래프는 $a$의 값에 관계없이 항상 점 $P$를 지난다. 점 $P$가 이 이차함수 그래프의 꼭짓점일 때, 이 이차함수의 그래프가 $x$축과 만나는 점의 $x$좌표를 $\\alpha,\\beta$라 하면 $a-\\alpha+\\beta$의 값을 구하시오. (단, $\\alpha>\\beta$) (6점)",
    "choices": [],
    "tags": [
      "서술형",
      "이차함수",
      "x절편"
    ],
    "answer": "$-4$",
    "solution": "식을 매개변수 $a$가 보이도록 고쳐 쓴다.\n$y=x^2-2+a(x-1)$이다.\n같은 점 $P=(x,y)$가 모든 $a$에서 그래프 위에 있으려면 $a$의 계수 $x-1$이 $0$이어야 한다.\n$x-1=0$이므로 $x=1$이다.\n이때 $y=1^2-2$이다.\n따라서 $y=-1$이고 $P=(1,-1)$이다.\n\n이차함수의 대칭축은\n$x=-\\dfrac a2$이다.\n점 $P$가 꼭짓점이므로 꼭짓점의 가로좌표가 $1$이다.\n$-\\dfrac a2=1$이다.\n양변에 $2$를 곱하면 $-a=2$이다.\n따라서 $a=-2$이다.\n\n$a=-2$를 원래 함수에 대입하면\n$y=x^2-2x$이다.\n인수분해하면\n$y=x(x-2)$이다.\n따라서 두 $x$절편은 $0$과 $2$이다.\n$\\alpha>\\beta$이므로 $\\alpha=2$, $\\beta=0$이다.\n\n$a-\\alpha+\\beta=-2-2+0=-4$이다."
  ,
    "level": "중",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION",
    "subUnit": "이차함수의 활용",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "problemTypeKey": "PT_H1_QUADRATIC_RECONSTRUCTION",
    "templateKey": "TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimary": {
      "recordId": null,
      "mappingStatus": "DIRECT_ACTIVE",
      "L1": "방정식과 부등식",
      "L2": "이차방정식",
      "L3": "조건을 이용한 이차함수 결정",
      "L4": "근·축·꼭짓점으로 이차함수 결정",
      "projectionStatus": "REUSE"
    },
    "difficultyReason": "a의 계수 소거로 공통점을 찾고 꼭짓점 좌표로 매개변수를 정한 뒤 두 근의 순서를 적용한다. 세 가지 표준 관계를 연결해야 한다.",
    "sourceToMetaStatus": "EVIDENCE_DEBT",
    "category": "이차함수의 활용",
    "originalCategory": "이차함수",
    "layoutTag": "grid",
    "wide": false,
    "conditionReason": "α>β는 두 x절편을 α와 β에 순서대로 대응시켜 최종식을 결정한다. 현재 Condition registry에는 이 두 변수 순서 관계에 정확히 해당하는 key가 없다.",
    "evidenceDebt": [
      {
        "field": "rpmPrimary.recordId",
        "status": "EVIDENCE_DEBT",
        "reason": "H1 runtime taxonomy has the exact 2015/수학(상) root-axis-vertex reconstruction row and active PT/TPL; the exact L3/L4 row has no matching record ID in the H15 high1 crosswalk. No H1-RPM ID is invented.",
        "evidenceSource": "archive/data/meta-foundation/runtime/h1-foundation-v1.json; archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
      },
      {
        "field": "conditionKeys",
        "status": "EVIDENCE_DEBT",
        "reason": "The source condition α>β is required to assign the larger and smaller roots. The active Condition registry has no exact pairwise-order key; no approximate range/nonzero key is substituted.",
        "evidenceSource": "archive/data/meta-foundation/canonical/condition_registry.json"
      }
    ]
  
}
];
