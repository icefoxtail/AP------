

```
{
  "stem": "25_동산중_2학기_기말_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js",
  "examFolder": "2final",
  "grade": "중1",
  "curriculum": "2022",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

곱셈 기호와 나눗셈 기호를 생략하여 나타낸 식으로 옳은 것은? \[3점\]

### 선지

① \$a \\times a \\times a \\times a \= a^4\$ ② \$(-3) \\times x \= x \- 3\$ ③ \$p \\div 5 \= 5p\$ ④ \$(x \+ 3\) \\times 2 \= 2x \+ 3\$ ⑤ \$y \\times (-1) \= y \- 1\$

### 정답

①

### 해설

곱셈 기호와 나눗셈 기호의 생략 규칙에 따라 각 보기를 확인한다. \$\$\\begin{aligned} \\text{① } & a \\times a \\times a \\times a \= a^4\\text{ (참)} \\ \\text{② } & (-3) \\times x \= \-3x\\text{ (거짓)} \\ \\text{③ } & p \\div 5 \= \\dfrac{p}{5}\\text{ (거짓)} \\ \\text{④ } & (x \+ 3\) \\times 2 \= 2(x \+ 3\) \= 2x \+ 6\\text{ (거짓)} \\ \\text{⑤ } & y \\times (-1) \= \-y\\text{ (거짓)} \\end{aligned}\$\$ 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "곱셈·나눗셈 기호 생략 규칙 대조 진술 판별 문항"
}
```

```
{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "거듭제곱과 수와 문자의 곱셈 규칙을 적용하여 a를 4번 곱한 식이 a^4임을 확인한다.",
  "decisiveStep": "같은 문자의 곱은 거듭제곱으로 나타내는 원리 식별",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "문자의 사용",
    "l4": "곱셈·나눗셈 기호 생략"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_OPERATION_NOTATION",
    "why": "곱셈과 나눗셈 기호의 생략 규칙 적용 여부를 묻는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기호 생략 및 거듭제곱의 기본 정의를 직접 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "문자식"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "곱셈",
      "나눗셈",
      "거듭제곱"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

초콜릿 \$x\$개를 \$4\$명의 학생에게 똑같이 나누어 주었더니 \$3\$개가 남았다. 한 학생이 받는 초콜릿의 개수를 문자를 사용한 식으로 나타낸 것은? \[4점\]

### 선지

① \$\\left(\\dfrac{x}{4} \+ 3\\right)\$개 ② \$\\left(\\dfrac{x \- 3}{4}\\right)\$개 ③ \$\\left(\\dfrac{x \+ 3}{4}\\right)\$개 ④ \$(4x \+ 3)\$개 ⑤ \$\\left(\\dfrac{x}{4} \- 3\\right)\$개

### 정답

②

### 해설

전체 \$x\$개 중 남은 \$3\$개를 제외하면 실제로 \$4\$명에게 똑같이 나누어 준 초콜릿의 개수는 \$\$\\begin{aligned} (x \- 3)\\text{ (개)} \\end{aligned}\$\$ 이 초콜릿을 \$4\$명에게 똑같이 나누어 주므로 한 학생이 받는 초콜릿의 개수는 \$\$\\begin{aligned} (x \- 3\) \\div 4 &= \\dfrac{x \- 3}{4}\\text{ (개)} \\end{aligned}\$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "잉여 수량 배분 문제의 문자식 모델링 대수 문항"
}
```

```
{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "전체 x개에서 나머지 3개를 뺀 (x-3)개를 4로 나누어 분수식 (x-3)/4를 구성한다.",
  "decisiveStep": "나머지 3개를 뺀 수량을 분자로 두는 분수식 구성",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "문자의 사용",
    "l4": "문자로 수량 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "why": "문장으로 주어진 나눗셈과 나머지 수량 관계를 문자로 나타내는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "잉여를 제외하고 균등 분배하는 과정을 문자로 모델링하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "문자식"
    ],
    "goal": [
      "관계식"
    ],
    "method": [
      "나눗셈",
      "차"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

\$x \= 3\$일 때, 식 \$4x \- 5\$의 값은? \[3점\]

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

③

### 해설

주어진 식 \$4x \- 5\$의 \$x\$ 자리에 \$3\$을 대입하여 계산한다. \$\$\\begin{aligned} 4x \- 5 &= 4 \\times 3 \- 5 \\ &= 12 \- 5 \\ &= 7 \\end{aligned}\$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "단항 수치 대입 일차식의 값 계산 문항"
}
```

```
{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "x=3을 식 4x-5에 대입하여 12-5=7을 계산한다.",
  "decisiveStep": "x에 3 대입 및 사칙계산",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "식의 값",
    "l4": "대입하여 식의 값 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LITERAL_EXPRESSION_EVALUATION",
    "templateKey": "TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION",
    "why": "문자에 특정 수를 대입하여 일차식의 값을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수를 일차식에 단순 대입하여 계산하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차식",
      "값"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "사칙계산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

\$a \= \-3, b \= \-2\$일 때, \$-a^2 \- \\dfrac{6}{b}\$의 값은? \[4점\]

### 선지

① \$-12\$ ② \$-10\$ ③ \$-8\$ ④ \$-6\$ ⑤ \$-4\$

### 정답

④

### 해설

주어진 식에 \$a \= \-3, b \= \-2\$를 대입한다. 거듭제곱과 나눗셈을 먼저 계산하면 \$\$\\begin{aligned} \-a^2 \- \\dfrac{6}{b} &= \-(-3)^2 \- \\dfrac{6}{-2} \\ &= \-9 \- (-3) \\ &= \-9 \+ 3 \\ &= \-6 \\end{aligned}\$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "음수 거듭제곱 및 분수 복합 대입 식의 값 계산 문항"
}
```

```
{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "음수 a=-3의 제곱 -(-3)^2=-9와 6/(-2)=-3을 각각 구해 -9-(-3)=-6을 도출한다.",
  "decisiveStep": "-(-3)^2=-9의 부호 처리 및 -(-3)=+3 변환",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "식의 값",
    "l4": "대입하여 식의 값 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LITERAL_EXPRESSION_EVALUATION",
    "templateKey": "TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION",
    "why": "음수의 거듭제곱과 분수 대입 시 부호 연산을 점검하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱 앞 부호 처리와 음수 나눗셈의 부호 변화를 함께 다루는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "값"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "거듭제곱",
      "사칙계산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 3

### 발문

식 \$2x \- 5\$에 대한 설명으로 옳은 것은? \[3점\]

### 선지

① 항은 \$2x\$와 \$5\$로 \$2\$개이다. ② \$x\$의 계수는 없다. ③ 상수항은 \$5\$이다. ④ 단항식이다. ⑤ 일차식이다.

### 정답

⑤

### 해설

식 \$2x \- 5\$의 구조를 파악한다. \$\$\\begin{aligned} \\text{항} &: 2x, \-5 \\ x\\text{의 계수} &: 2 \\ \\text{상수항} &: \-5 \\ \\text{차수} &: 1\\text{ (일차식)} \\end{aligned}\$\$ 각 선지의 진술을 판별하면 \$\$\\begin{aligned} \\text{① } & \\text{항은 } 2x\\text{와 } \-5\\text{이므로 거짓이다.} \\ \\text{② } & x\\text{의 계수는 } 2\\text{이므로 거짓이다.} \\ \\text{③ } & \\text{상수항은 } \-5\\text{이므로 거짓이다.} \\ \\text{④ } & \\text{항이 } 2\\text{개인 다항식이므로 거짓이다.} \\ \\text{⑤ } & \\text{차수가 } 1\\text{인 다항식이므로 일차식이다. (참)} \\end{aligned}\$\$ 따라서 옳은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "일차식의 항, 계수, 상수항 개념 식별 진술 감사 문항"
}
```

```
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "식 2x-5의 최고차항의 차수가 1임을 판별하여 일차식임을 확인한다.",
  "decisiveStep": "다항식의 차수가 1인 일차식 정의 대조",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "일차식",
    "l4": "일차식과 계수·상수항"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EXPRESSION_STRUCTURE",
    "templateKey": "TPL_M1_LINEAR_EXPRESSION_TERM_COEFFICIENT_AUDIT",
    "why": "다항식의 항, 상수항, 계수 및 일차식 정의 진술을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차식 구성요소의 정의를 직접 대조하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차식"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "항",
      "계수",
      "상수항"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 3

### 발문

다음은 다항식 \$3x \+ 2 \+ 2x \- 7\$을 간단히 하는 과정에 대한 설명이다. ㉠\~㉢에 들어갈 것으로 옳은 것은? \[3점\]

• \$3x \+ 2 \+ 2x \- 7\$에서 \$3x\$와 ㉠, \$+2\$와 ㉡은 동류항이므로 간단히 정리하면 ㉢이다.

### 선지

① ㉠ \$+2x\$, ㉡ \$-7\$, ㉢ \$5x \- 5\$ ② ㉠ \$+2x\$, ㉡ \$-7\$, ㉢ \$5x \- 9\$ ③ ㉠ \$+2x\$, ㉡ \$-7\$, ㉢ \$x \- 5\$ ④ ㉠ \$-7\$, ㉡ \$+2x\$, ㉢ \$5x \- 5\$ ⑤ ㉠ \$-7\$, ㉡ \$+2x\$, ㉢ \$5x \+ 9\$

### 정답

①

### 해설

문자와 차수가 같은 항을 동류항이라 한다. \$\$\\begin{aligned} 3x\\text{의 동류항} &: \+2x\\text{ (㉠)} \\ \+2\\text{의 동류항(상수항)} &: \-7\\text{ (㉡)} \\end{aligned}\$\$ 동류항끼리 묶어서 덧셈과 뺄셈을 하면 \$\$\\begin{aligned} 3x \+ 2 \+ 2x \- 7 &= (3x \+ 2x) \+ (2 \- 7\) \\ &= 5x \- 5\\text{ (㉢)} \\end{aligned}\$\$ 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "동류항 짝짓기 및 일차식 덧셈·뺄셈 빈칸 추론 문항"
}
```

```
{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "3x와 2x를 묶고 2와 -7을 묶어 5x-5로 정리한다.",
  "decisiveStep": "동류항 분류 및 계수·상수항 덧셈(5x-5) 도출",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "일차식",
    "l4": "동류항 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EXPRESSION_STRUCTURE",
    "templateKey": "TPL_M1_LINEAR_EXPRESSION_LIKE_TERMS",
    "why": "동류항의 정의와 계수 합산을 빈칸 짝짓기로 평가하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동류항을 묶어 일차식을 정리하는 1단계 기본 연산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차식"
    ],
    "goal": [
      "동류항",
      "값"
    ],
    "method": [
      "동류항",
      "사칙계산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

\$(5 \- 2x) \- (-4x \- 3)\$을 계산한 식은? \[4점\]

### 선지

① \$2x \+ 2\$ ② \$2x \+ 8\$ ③ \$-6x \+ 2\$ ④ \$-6x \+ 8\$ ⑤ \$6x \+ 8\$

### 정답

②

### 해설

괄호 앞의 뺄셈 기호를 괄호 안의 각 항에 분배하여 부호를 바꾼다. \$\$\\begin{aligned} (5 \- 2x) \- (-4x \- 3\) &= 5 \- 2x \+ 4x \+ 3 \\ &= (-2x \+ 4x) \+ (5 \+ 3\) \\ &= 2x \+ 8 \\end{aligned}\$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "괄호 분배 및 부호 변화를 포함한 일차식의 뺄셈 계산 문항"
}
```

```
{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "뺄셈 괄호를 풀어 5-2x+4x+3으로 만든 뒤 동류항을 모아 2x+8을 구한다.",
  "decisiveStep": "뺄셈 기호 분배에 따른 부호 반전(-(-4x-3) = +4x+3)",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "일차식의 계산",
    "l4": "괄호가 있는 일차식 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EXPRESSION_STRUCTURE",
    "templateKey": "TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE",
    "why": "괄호가 포함된 두 일차식의 뺄셈 연산 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호 분배와 동류항 계산의 표준 절차를 묻는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차식"
    ],
    "goal": [
      "일차식"
    ],
    "method": [
      "동류항",
      "분배법칙",
      "사칙계산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

\$(12x \- 18\) \\div \\left(-\\dfrac{3}{2}\\right)\$을 계산한 식은? \[4점\]

### 선지

① \$-8x \- 12\$ ② \$8x \- 12\$ ③ \$-8x \+ 12\$ ④ \$-6x \+ 9\$ ⑤ \$6x \- 9\$

### 정답

③

### 해설

분수의 나눗셈은 역수의 곱셈으로 바꾸어 분배법칙을 적용한다. \$\$\\begin{aligned} (12x \- 18\) \\div \\left(-\\dfrac{3}{2}\\right) &= (12x \- 18\) \\times \\left(-\\dfrac{2}{3}\\right) \\ &= 12x \\times \\left(-\\dfrac{2}{3}\\right) \- 18 \\times \\left(-\\dfrac{2}{3}\\right) \\ &= \-8x \+ 12 \\end{aligned}\$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "분수 나눗셈의 역수 곱셈 변환 및 분배법칙 계산 문항"
}
```

```
{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "역수 -2/3를 각 항에 곱해 -8x+12를 산출한다.",
  "decisiveStep": "나눗셈을 역수의 곱으로 변환 후 각 항에 분배",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "일차식의 계산",
    "l4": "일차식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EXPRESSION_STRUCTURE",
    "templateKey": "TPL_M1_LINEAR_EXPRESSION_SCALAR_OPERATION",
    "why": "일차식과 유리수의 나눗셈을 역수 곱셈으로 처리하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음의 분수 나눗셈에서 역수 변환과 분배 부호 처리를 결합한 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차식"
    ],
    "goal": [
      "일차식"
    ],
    "method": [
      "나눗셈",
      "분배법칙",
      "곱셈"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 5

### 발문

\$\\dfrac{1}{3}(-x \- 2\) \- \\dfrac{2x \- 5}{6}\$를 계산한 식은? \[5점\]

### 선지

① \$-\\dfrac{2}{3}x \- \\dfrac{1}{6}\$ ② \$-\\dfrac{1}{2}x \+ \\dfrac{1}{6}\$ ③ \$-\\dfrac{2}{3}x \+ \\dfrac{7}{6}\$ ④ \$-\\dfrac{2}{3}x \+ \\dfrac{1}{6}\$ ⑤ \$-\\dfrac{4}{3}x \+ \\dfrac{1}{6}\$

### 정답

④

### 해설

분모의 최소공배수인 \$6\$으로 통분하여 동류항을 정리한다. \$\$\\begin{aligned} \\dfrac{1}{3}(-x \- 2\) \- \\dfrac{2x \- 5}{6} &= \\dfrac{-x \- 2}{3} \- \\dfrac{2x \- 5}{6} \\ &= \\dfrac{2(-x \- 2\) \- (2x \- 5)}{6} \\ &= \\dfrac{-2x \- 4 \- 2x \+ 5}{6} \\ &= \\dfrac{-4x \+ 1}{6} \\ &= \-\\dfrac{4}{6}x \+ \\dfrac{1}{6} \\ &= \-\\dfrac{2}{3}x \+ \\dfrac{1}{6} \\end{aligned}\$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "서로 다른 분모를 갖는 일차식의 통분 뺄셈 대수 계산 문항"
}
```

```
{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "분모 6으로 통분하여 분자 (-2x-4)-(2x-5)=-4x+1을 구하고 약분하여 -2/3x + 1/6을 완성한다.",
  "decisiveStep": "분자 뺄셈 시 -(2x-5)의 부호 처리 및 기약분수 약분",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "일차식의 계산",
    "l4": "일차식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EXPRESSION_STRUCTURE",
    "templateKey": "TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE",
    "why": "분수 형태 일차식의 통분과 뺄셈 괄호 처리를 평가하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "통분, 분자 부호 분배, 동류항 정리 및 분수 약분을 순차 적용하는 다단계 연산",
  "level": "중",
  "item4slot": {
    "given": [
      "일차식"
    ],
    "goal": [
      "일차식"
    ],
    "method": [
      "동류항",
      "사칙계산",
      "분배법칙"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 문장을 등식으로 바르게 나타낸 것은? \[4점\]

• 한 자루에 \$x\$원인 볼펜을 \$4\$자루 사고 \$10000\$원을 내었더니 거스름돈이 \$2800\$원이었다.

### 선지

① \$4x \- 10000 \= 2800\$ ② \$4x \+ 10000 \= 2800\$ ③ \$10000 \+ 4x \= 2800\$ ④ \$4x \= 12800\$ ⑤ \$10000 \- 4x \= 2800\$

### 정답

⑤

### 해설

볼펜 \$4\$자루의 총 가격은 \$\$\\begin{aligned} 4 \\times x \= 4x\\text{ (원)} \\end{aligned}\$\$ 거스름돈은 지불한 금액에서 물건의 가격을 뺀 값이므로 \$\$\\begin{aligned} (\\text{낸 돈}) \- (\\text{물건값}) &= (\\text{거스름돈}) \\ 10000 \- 4x &= 2800 \\end{aligned}\$\$ 따라서 바르게 나타낸 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "구매 금액과 거스름돈 관계의 일차방정식 모델링 문항"
}
```

```
{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION_WORD",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "낸 돈 10000에서 물건값 4x를 뺀 식을 거스름돈 2800과 같다고 등식화한다.",
  "decisiveStep": "지불액 - 구매액 = 거스름돈 등식 수립",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 활용",
    "l3": "생활 속 관계식",
    "l4": "요금·가격"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_MODELING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_MODEL_QUANTITY",
    "why": "일상생활 속 가격과 거스름돈 관계를 등식으로 표현하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본적인 일상 가격 관계를 일차방정식으로 직접 옮기는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "문자식"
    ],
    "goal": [
      "등식"
    ],
    "method": [
      "일차방정식",
      "관계식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 3

### 발문

다음 일차방정식 중 해가 \$x \= 2\$인 것은? \[3점\]

### 선지

① \$3x \- 2 \= 4\$ ② \$x \+ 3 \= 1\$ ③ \$2x \= \-4\$ ④ \$5 \- x \= 1\$ ⑤ \$-\\dfrac{x}{2} \= 1\$

### 정답

①

### 해설

각 일차방정식에 \$x \= 2\$를 대입하여 등식이 참이 되는지 확인한다. \$\$\\begin{aligned} \\text{① } & 3 \\times 2 \- 2 \= 6 \- 2 \= 4 \= (\\text{우변})\\text{ (참)} \\ \\text{② } & 2 \+ 3 \= 5 \\neq 1\\text{ (거짓)} \\ \\text{③ } & 2 \\times 2 \= 4 \\neq \-4\\text{ (거짓)} \\ \\text{④ } & 5 \- 2 \= 3 \\neq 1\\text{ (거짓)} \\ \\text{⑤ } & \-\\dfrac{2}{2} \= \-1 \\neq 1\\text{ (거짓)} \\end{aligned}\$\$ 따라서 해가 \$x \= 2\$인 방정식은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "해의 대입을 통한 참인 일차방정식 판별 문항"
}
```

```
{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "x=2를 대입하여 좌변 3*2-2=4가 우변과 일치함을 판정한다.",
  "decisiveStep": "대입 후 등식 성립 검증",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 풀이",
    "l3": "등식과 방정식",
    "l4": "방정식의 해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_SOLVING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_SOLUTION_SUBSTITUTION",
    "why": "주어진 해를 일차방정식에 대입하여 참 거짓을 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "방정식의 해의 정의를 대입으로 확인하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식",
      "값"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "대입",
      "해"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

다음 일차방정식의 풀이 과정에서 (가), (나)에 이용된 등식의 성질 또는 변형을 \<보기\>에서 모두 골라 바르게 짝지은 것은? \[4점\]

\$\$4x \+ 3 \= 5 \\xrightarrow{(가)} 4x \= 5 \- 3 \\xrightarrow{} 4x \= 2 \\xrightarrow{(나)} x \= \\dfrac{1}{2}\$\$

\<보기\> ㄱ. 등식의 양변에서 같은 수를 빼어도 등식은 성립한다. ㄴ. 이항(등식의 어느 한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮김)을 하였다. ㄷ. 등식의 양변을 \$0\$이 아닌 같은 수로 나누어도 등식은 성립한다.

### 선지

① (가) ㄱ, (나) ㄴ ② (가) ㄱ, ㄴ, (나) ㄷ ③ (가) ㄱ, (나) ㄷ ④ (가) ㄱ, ㄴ, (나) ㄴ, ㄷ ⑤ (가) ㄴ, (나) ㄷ

### 정답

②

### 해설

식 변형의 각 단계에서 사용된 성질을 분석한다. \$\$\\begin{aligned} \\text{(가) } & 4x \+ 3 \= 5 \\rightarrow 4x \= 5 \- 3 \\ & \\text{양변에서 } 3\\text{을 뺀 것으로 볼 수 있으므로 ㄱ에 해당한다.} \\ & \\text{또한 좌변의 } \+3\\text{을 부호를 바꾸어 우변으로 넘긴 이항이므로 ㄴ에도 해당한다.} \\ \\text{(나) } & 4x \= 2 \\rightarrow x \= \\dfrac{1}{2} \\ & \\text{양변을 } 4\\text{로 나눈 것이므로 ㄷ에 해당한다.} \\end{aligned}\$\$ 따라서 (가)는 ㄱ, ㄴ이고 (나)는 ㄷ이므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "일차방정식 풀이 단계별 등식의 성질 및 이항 추론 문항"
}
```

```
{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "양변에서 3을 뺀 이항 과정(ㄱ, ㄴ)과 양변을 4로 나눈 과정(ㄷ)을 식별한다.",
  "decisiveStep": "이항과 등식의 뺄셈 성질의 동치성 및 나눗셈 성질 식별",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 풀이",
    "l3": "등식과 방정식",
    "l4": "등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_SOLVING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_TRANSFORMATION_AUDIT",
    "why": "방정식 풀이의 단계별 등식 성질 적용을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이항의 본질이 등식의 뺄셈 성질임을 이해하고 나눗셈 성질을 구별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "등식의성질",
      "이항"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

일차방정식 \$3(x \- 8\) \= \-5x\$의 해는? \[4점\]

### 선지

① \$x \= \-4\$ ② \$x \= \-3\$ ③ \$x \= 3\$ ④ \$x \= 4\$ ⑤ \$x \= 6\$

### 정답

③

### 해설

괄호를 풀고 \$x\$항을 좌변으로, 상수항을 우변으로 이항하여 푼다. \$\$\\begin{aligned} 3(x \- 8\) &= \-5x \\ 3x \- 24 &= \-5x \\ 3x \+ 5x &= 24 \\ 8x &= 24 \\ x &= 3 \\end{aligned}\$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "괄호 분배 및 이항을 통한 표준 일차방정식 풀이 문항"
}
```

```
{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "괄호를 풀어 3x-24=-5x로 전개한 뒤 8x=24에서 x=3을 구한다.",
  "decisiveStep": "동류항 이항 8x = 24 및 계수 나눗셈",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 풀이",
    "l3": "일차방정식의 풀이",
    "l4": "괄호·분수·소수가 있는 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_SOLVING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_DIRECT_SOLUTION",
    "why": "괄호가 포함된 일차방정식을 직접 해결하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "괄호 분배 후 기본 이항으로 해를 구하는 표준 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "분배법칙",
      "이항",
      "일차방정식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 5

### 발문

\$x\$에 대한 두 일차방정식 \$\$\\dfrac{1}{5}(-2x \- 8\) \= 0.6x \+ 0.4, \\quad 0.5(x \- 3a) \- \\dfrac{1}{2} \= \\dfrac{a(-x \+ 4)}{3}\$\$ 의 해가 서로 같을 때, 상수 \$a\$의 값은? \[5점\]

### 선지

① \$-\\dfrac{5}{7}\$ ② \$-\\dfrac{4}{7}\$ ③ \$-\\dfrac{1}{2}\$ ④ \$-\\dfrac{3}{7}\$ ⑤ \$-\\dfrac{2}{7}\$

### 정답

④

### 해설

첫 번째 일차방정식을 풀어 공통인 해 \$x\$를 구한다. 소수로 통일하여 정리하면 \$\$\\begin{aligned} \\dfrac{1}{5}(-2x \- 8\) &= 0.6x \+ 0.4 \\ \-0.4x \- 1.6 &= 0.6x \+ 0.4 \\ \-0.4x \- 0.6x &= 0.4 \+ 1.6 \\ \-x &= 2 \\ x &= \-2 \\end{aligned}\$\$ 두 방정식의 해가 같으므로 \$x \= \-2\$를 두 번째 일차방정식에 대입한다. \$\$\\begin{aligned} 0.5(-2 \- 3a) \- \\dfrac{1}{2} &= \\dfrac{a(-(-2) \+ 4)}{3} \\ \-1 \- 1.5a \- 0.5 &= \\dfrac{6a}{3} \\ \-1.5 \- 1.5a &= 2a \\ \-\\dfrac{3}{2} \- \\dfrac{3}{2}a &= 2a \\end{aligned}\$\$ 양변에 \$2\$를 곱하여 \$a\$에 관한 일차방정식을 풀면 \$\$\\begin{aligned} \-3 \- 3a &= 4a \\ 7a &= \-3 \\ a &= \-\\dfrac{3}{7} \\end{aligned}\$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "공통해 매개 연립 일차방정식 계수 역산 대수 문항"
}
```

```
{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "첫 식에서 x=-2를 도출한 뒤 둘째 식에 대입하여 a=-3/7을 연립 역산한다.",
  "decisiveStep": "공통해 x=-2 산출 및 a에 대한 일차방정식 7a=-3 해결",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 풀이",
    "l3": "해와 조건",
    "l4": "해가 주어진 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_SOLVING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_COEFFICIENT_RECOVERY",
    "why": "두 방정식의 공통 해 조건을 이용하여 미지 상수를 역산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수와 소수가 섞인 첫 방정식을 풀고 그 해를 미지수가 든 둘째 방정식에 대입하는 2단계 복합 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "일차방정식",
      "대입"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 3

### 발문

좌표평면 위의 네 점 \$A, B, C, D\$의 위치 설명 중 점의 좌표를 바르게 나타낸 것은? \[3점\]

• 점 \$A\$는 \$x\$축 위의 점으로 \$x\$좌표가 \$3\$이다. • 점 \$B\$는 \$y\$축 위의 점으로 \$y\$좌표가 \$-4\$이다. • 점 \$C\$는 제\$2\$사분면 위의 점으로 \$x\$좌표가 \$-2\$, \$y\$좌표가 \$5\$이다. • 점 \$D\$는 제\$4\$사분면 위의 점으로 \$x\$좌표가 \$4\$, \$y\$좌표가 \$-3\$이다.

### 선지

① \$A(0, 3)\$ ② \$B(-4, 0)\$ ③ \$C(2, \-5)\$ ④ \$C(5, \-2)\$ ⑤ \$D(4, \-3)\$

### 정답

⑤

### 해설

각 점의 위치에 대한 순서쌍 \$(x, y)\$를 구한다. \$\$\\begin{aligned} \\text{점 } A &: x\\text{축 위의 점이므로 } y \= 0 \\implies A(3, 0\) \\ \\text{점 } B &: y\\text{축 위의 점이므로 } x \= 0 \\implies B(0, \-4) \\ \\text{점 } C &: x \= \-2, y \= 5 \\implies C(-2, 5\) \\ \\text{점 } D &: x \= 4, y \= \-3 \\implies D(4, \-3) \\end{aligned}\$\$ 따라서 바르게 나타낸 것은 \$D(4, \-3)\$인 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "축 위의 점 및 사분면 점의 좌표 순서쌍 표현 일치 판별 문항"
}
```

```
{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-COORDINATE_PLANE",
  "conceptClusterKey": "COORDINATE_PLANE",
  "primaryMethod": "축 위의 점의 0좌표 성질과 순서쌍 (x, y) 정의를 대조하여 D(4, -3)의 정합성을 확인한다.",
  "decisiveStep": "순서쌍 표기법 (x, y) 대조",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "좌표평면",
    "l4": "점의 좌표 읽기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORDINATE_POINT_READING",
    "templateKey": "TPL_COORDINATE_POINT_READING_CORE",
    "why": "점의 기하적 위치 조건으로부터 좌표 순서쌍을 결정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "좌표축 및 사분면 위의 점의 좌표 표현을 확인하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "좌표평면"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "좌표",
      "사분면"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

좌표와 좌표평면에 대한 설명으로 옳은 것은? \[4점\]

### 선지

① 원점의 좌표는 \$O(0, 0)\$이다. ② 점 \$P(a, b)\$의 \$x\$좌표는 \$b\$이고 \$y\$좌표는 \$a\$이다. ③ \$x\$축 위에 있는 점은 \$x\$좌표가 항상 \$0\$이다. ④ \$y\$축 위에 있는 점은 제\$1\$사분면에 속한다. ⑤ \$x\$좌표가 음수이고 \$y\$좌표가 양수인 점은 제\$4\$사분면에 속한다.

### 정답

①

### 해설

좌표와 사분면의 기본 정의를 확인한다. \$\$\\begin{aligned} \\text{① } & \\text{원점의 좌표는 } (0, 0)\\text{이다. (참)} \\ \\text{② } & \\text{순서쌍 } (a, b)\\text{에서 } x\\text{좌표는 } a, y\\text{좌표는 } b\\text{이다. (거짓)} \\ \\text{③ } & x\\text{축 위의 점은 } y\\text{좌표가 } 0\\text{이다. (거짓)} \\ \\text{④ } & \\text{좌표축 위의 점은 어느 사분면에도 속하지 않는다. (거짓)} \\ \\text{⑤ } & x \< 0, y \> 0\\text{인 점은 제}2\\text{사분면에 속한다. (거짓)} \\end{aligned}\$\$ 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "좌표평면의 정의, 원점, 축, 사분면 성질 진술 감사 문항"
}
```

```
{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-COORDINATE_PLANE",
  "conceptClusterKey": "COORDINATE_PLANE",
  "primaryMethod": "원점 (0, 0)과 좌표축 위의 점의 성질을 대조하여 1번의 참을 판별한다.",
  "decisiveStep": "원점 정의 O(0, 0)의 참 판별",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "좌표평면",
    "l4": "점의 좌표 읽기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORDINATE_POINT_READING",
    "templateKey": "TPL_COORDINATE_POINT_READING_CLAIM_AUDIT",
    "why": "좌표와 사분면의 정의 진술들을 종합 검증하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사분면, 축의 성질, 원점 표기 등 복합 개념 진술을 감사하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "좌표평면"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "원점",
      "좌표축",
      "사분면"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

점 \$A(a, b)\$가 제\$2\$사분면 위의 점일 때, 점 \$B\\left(a \- b, \-\\dfrac{b}{a}\\right)\$는 제 몇 사분면 위의 점인가? \[4.5점\]

### 선지

① 제\$1\$사분면 ② 제\$2\$사분면 ③ 제\$3\$사분면 ④ 제\$4\$사분면 ⑤ 어느 사분면에도 속하지 않는다.

### 정답

②

### 해설

점 \$A(a, b)\$가 제\$2\$사분면 위의 점이므로 부호는 다음과 같다. \$\$\\begin{aligned} a &\< 0 \\ b &\> 0 \\end{aligned}\$\$ 점 \$B\$의 좌표 부호를 각각 조사하면 \$\$\\begin{aligned} x\\text{좌표} &: a \- b \< 0\\text{ (음수에서 양수를 빼므로 음수)} \\ y\\text{좌표} &: \\dfrac{b}{a} \< 0 \\implies \-\\dfrac{b}{a} \> 0\\text{ (양수)} \\end{aligned}\$\$ 따라서 점 \$B\$는 \$x\$좌표가 음수이고 \$y\$좌표가 양수이므로 제\$2\$사분면 위의 점이다. 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "사분면 부호 조건에 따른 변환 좌표의 사분면 결정 문항"
}
```

```
{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-COORDINATE_PLANE",
  "conceptClusterKey": "COORDINATE_PLANE",
  "primaryMethod": "a<0, b>0로부터 a-b<0이고 -b/a>0임을 추론하여 점 B가 제2사분면임을 도출한다.",
  "decisiveStep": "a-b의 부호(음수)와 -b/a의 부호(양수) 판정",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "좌표평면",
    "l4": "점의 좌표 읽기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORDINATE_POINT_READING",
    "templateKey": "TPL_COORDINATE_POINT_READING_QUADRANT_SIGN_TRANSFORM",
    "why": "문자의 사분면 부호 조건으로부터 변형된 순서쌍의 사분면을 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호의 뺄셈과 나눗셈 규칙을 적용하여 사분면을 결정하는 2단계 추론",
  "level": "중",
  "item4slot": {
    "given": [
      "좌표평면",
      "사분면"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "사분면",
      "좌표"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 3

### 발문

어느 자전거가 출발하여 일정한 속력으로 달리다가 속력을 점점 줄여서 멈추었다. 이 자전거의 시간에 따른 속력의 변화를 나타낸 그래프의 모양으로 가장 적절한 것은? \[3점\]

### 선지

① 처음부터 끝까지 계속 증가하는 직선 모양 ② 점점 증가하다가 일정하게 유지되는 모양 ③ 일정하게 유지되다가 점점 감소하여 \$0\$이 되는 모양 ④ 증가하다가 감소하고 다시 증가하는 모양 ⑤ 처음부터 끝까지 일정한 속력을 유지하는 수평선 모양

### 정답

③

### 해설

시간의 흐름에 따른 속력의 변화 과정을 분석한다. \$\$\\begin{aligned} \\text{1단계(일정한 속력)} &: \\text{시간이 지나도 속력이 변하지 않으므로 수평선이다.} \\ \\text{2단계(속력을 줄임)} &: \\text{시간이 지남에 따라 속력이 감소하므로 우하향 선분이다.} \\ \\text{3단계(멈춤)} &: \\text{속력이 } 0\\text{이 되어 시간축에 도달한다.} \\end{aligned}\$\$ 따라서 일정하게 유지되다가 점점 감소하여 \$0\$이 되는 모양이 가장 적절하다. 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "실생활 운동 상황(일정 속력 후 감속 정지)의 그래프 개형 매칭 문항"
}
```

```
{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-GRAPH_RELATION",
  "conceptClusterKey": "GRAPH_RELATION",
  "primaryMethod": "일정한 속력(수평선)과 감속(우하향) 구간의 연결 개형을 식별한다.",
  "decisiveStep": "상황별 구간 특성(수평 -> 감소) 분할 매칭",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "그래프",
    "l4": "상황을 그래프로 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONTEXT_GRAPH_INTERPRETATION",
    "templateKey": "TPL_M1_CONTEXT_GRAPH_INTERPRETATION_CONTEXT_TO_SPEED_GRAPH",
    "why": "문장으로 주어진 속력 변화 상황을 그래프 개형과 일치시키는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "속력의 변화와 그래프 기울기 사이의 관계를 파악하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "속력",
      "시간"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "그래프",
      "해석"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

다음은 어느 놀이공원 대관람차의 시간에 따른 지면으로부터의 높이 변화를 나타낸 그래프에 대한 설명이다. 옳지 않은 것은? \[4점\] (단, 관람차는 지면에서 출발하여 최고 높이 \$40\\text{ m}\$까지 올라간 후 다시 내려오기를 반복하며, 최고점은 출발 후 \$15\$분, \$45\$분, \$75\$분에 도달한다.)

### 선지

① 관람차가 가장 높이 올라갔을 때의 높이는 \$40\\text{ m}\$이다. ② 관람차가 출발 후 \$15\$분에 처음으로 최고 높이에 도달한다. ③ 관람차가 한 바퀴를 완전히 회전하는 데 걸리는 시간은 \$30\$분이다. ④ 관람차가 시작 지점에서 최고 높이까지 올라가는 데 걸리는 시간은 \$30\$분이다. ⑤ 운행을 시작하고 \$60\$분 동안 최고 높이에 도달하는 횟수는 \$2\$번이다.

### 정답

④

### 해설

관람차의 주기적 높이 변화를 분석한다. \$\$\\begin{aligned} \\text{최고 높이} &: 40\\text{ m} \\ \\text{최고점 도달 시각} &: 15\\text{분}, 45\\text{분}, 75\\text{분} \\ \\text{1회전 주기} &: 45 \- 15 \= 30\\text{ (분)} \\end{aligned}\$\$ 각 선지의 진술을 판별하면 \$\$\\begin{aligned} \\text{① } & \\text{최고 높이는 } 40\\text{ m이다. (참)} \\ \\text{② } & \\text{출발 후 } 15\\text{분에 처음 최고점에 도달한다. (참)} \\ \\text{③ } & \\text{최고점 사이의 간격이 } 30\\text{분이므로 한 바퀴 회전 시간은 } 30\\text{분이다. (참)} \\ \\text{④ } & \\text{시작 지점(지면)에서 최고 높이까지 올라가는 데 걸리는 시간은 } 15\\text{분이다.} \\ & \\text{따라서 } 30\\text{분이라고 한 설명은 옳지 않다. (거짓)} \\ \\text{⑤ } & 60\\text{분 동안 최고점에 도달하는 시각은 } 15\\text{분과 } 45\\text{분의 } 2\\text{번이다. (참)} \\end{aligned}\$\$ 따라서 옳지 않은 것은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "주기적 실생활 그래프(관람차 높이)의 해석 및 진술 감사 문항"
}
```

```
{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-GRAPH_RELATION",
  "conceptClusterKey": "GRAPH_RELATION",
  "primaryMethod": "주기 30분과 0에서 최고점 도달 시간 15분을 구별하여 4번의 오류를 식별한다.",
  "decisiveStep": "회전 주기(30분)와 반주기 상승 시간(15분) 구별",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "그래프",
    "l4": "그래프 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONTEXT_GRAPH_INTERPRETATION",
    "templateKey": "TPL_M1_CONTEXT_GRAPH_INTERPRETATION_PERIODIC_GRAPH_CLAIMS",
    "why": "주기성을 가지는 상황 그래프의 수치를 해석하고 진술을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "주기 그래프에서 최고점, 주기, 소요 시간을 정확히 읽어내야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "시간"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "그래프",
      "해석"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 4

### 발문

다음 중 \$x\$와 \$y\$ 사이의 관계가 정비례하는 것은? \[4점\]

### 선지

① 올해 \$13\$살인 학생의 \$x\$년 후의 나이 \$y\$살 ② 둘레의 길이가 \$20\\text{ cm}\$인 직사각형의 가로 \$x\\text{ cm}\$와 세로 \$y\\text{ cm}\$ ③ 넓이가 \$36\\text{ cm}^2\$인 직사각형의 가로 \$x\\text{ cm}\$와 세로 \$y\\text{ cm}\$ ④ 총 \$60\\text{ L}\$의 물이 들어 있는 물탱크에서 매분 \$x\\text{ L}\$씩 물을 뺄 때 남은 물의 양 \$y\\text{ L}\$ ⑤ 한 자루에 \$800\$원인 색연필 \$x\$자루의 가격 \$y\$원

### 정답

⑤

### 해설

정비례 관계는 두 변수 \$x, y\$ 사이에 \$y \= ax\$ (\$a \\neq 0\$)의 관계식이 성립하는 것이다. 각 보기의 관계식을 세우면 다음과 같다. \$\$\\begin{aligned} \\text{① } & y \= 13 \+ x\\text{ (정비례 아님)} \\ \\text{② } & 2(x \+ y) \= 20 \\implies y \= 10 \- x\\text{ (정비례 아님)} \\ \\text{③ } & xy \= 36 \\implies y \= \\dfrac{36}{x}\\text{ (반비례)} \\ \\text{④ } & y \= 60 \- x\\text{ (정비례 아님)} \\ \\text{⑤ } & y \= 800x\\text{ (}y \= ax\\text{ 꼴이므로 정비례)} \\end{aligned}\$\$ 따라서 정비례하는 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "실생활 수량 관계식 구성을 통한 정비례 관계 판별 문항"
}
```

```
{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-GRAPH_RELATION",
  "conceptClusterKey": "GRAPH_RELATION",
  "primaryMethod": "각 보기를 y=f(x) 식으로 세워 y=800x가 정비례 y=ax 형태임을 확인한다.",
  "decisiveStep": "y=ax 꼴의 정비례 표준형 식별",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "정비례와 반비례",
    "l3": "정비례",
    "l4": "정비례 관계식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION",
    "templateKey": "TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CORE",
    "why": "주어진 실생활 상황에서 정비례 관계식을 세우고 분류하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문장제 조건을 관계식으로 변환하고 정비례 정의와 대조하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "관계식"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "정비례",
      "관계식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q21

- 형식: 객관식  
- 배점: 4.5

### 발문

정비례 관계 \$y \= ax\$의 그래프와 반비례 관계 \$y \= \\dfrac{b}{x}\$의 그래프가 점 \$(-4, 3)\$에서 만날 때, 상수 \$a, b\$에 대하여 \$ab\$의 값은? \[4.5점\]

### 선지

① \$9\$ ② \$12\$ ③ \$15\$ ④ \$-9\$ ⑤ \$-12\$

### 정답

①

### 해설

교점 \$(-4, 3)\$은 정비례와 반비례 그래프 위의 점이므로 두 식에 각각 대입한다. \$y \= ax\$에 \$x \= \-4, y \= 3\$을 대입하면 \$\$\\begin{aligned} 3 &= a \\times (-4) \\ a &= \-\\dfrac{3}{4} \\end{aligned}\$\$ \$y \= \\dfrac{b}{x}\$에 \$x \= \-4, y \= 3\$을 대입하면 \$\$\\begin{aligned} 3 &= \\dfrac{b}{-4} \\ b &= 3 \\times (-4) \\ &= \-12 \\end{aligned}\$\$ 따라서 \$ab\$의 값은 \$\$\\begin{aligned} ab &= \\left(-\\dfrac{3}{4}\\right) \\times (-12) \\ &= 9 \\end{aligned}\$\$ 따라서 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "정비례·반비례 동시 교점 대입을 통한 미지계수 곱 계산 대수 문항"
}
```

```
{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-GRAPH_RELATION",
  "conceptClusterKey": "GRAPH_RELATION",
  "primaryMethod": "교점 (-4, 3)을 각각 대입하여 a=-3/4, b=-12를 구하고 곱하여 ab=9를 산출한다.",
  "decisiveStep": "교점 대입으로 a, b 계산 및 두 상수의 곱셈",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "정비례와 반비례",
    "l3": "관계 해석",
    "l4": "그래프에서 식 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PROPORTION_PARAMETER_EVALUATION",
    "templateKey": "TPL_M1_PROPORTION_PARAMETER_EVALUATION_TWO_GRAPH_CONSTANTS",
    "why": "두 그래프의 공통 교점을 대입하여 비례 상수를 연립 도출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정비례와 반비례 식에 공통 좌표를 대입하여 두 상수를 각각 구하고 곱하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정비례",
      "반비례",
      "좌표"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "대입",
      "곱셈"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[서·논술형 1\] 다음 표는 두 식품 \$P\$와 \$Q\$의 \$100\\text{ g}\$당 단백질 함유량을 나타낸 것이다.

\$\$\\begin{array}{c\|c} \\hline \\text{식품} & 100\\text{ g당 단백질 양} \\ \\hline P & 320\\text{ mg} \\ Q & 240\\text{ mg} \\ \\hline \\end{array}\$\$

(1) 식품 \$P\$를 \$x\\text{ g}\$, 식품 \$Q\$를 \$y\\text{ g}\$ 섭취하였을 때 섭취한 총 단백질의 양을 \$x, y\$를 사용한 식으로 나타내시오. (2) 식품 \$P\$를 \$250\\text{ g}\$, 식품 \$Q\$를 \$200\\text{ g}\$ 섭취하였을 때 섭취한 총 단백질의 양을 구하는 과정을 자세히 서술하시오. (단, 답에 단위를 반드시 쓰시오.) \[7점\]

### 선지

없음

### 정답

(1) \$(3.2x \+ 2.4y)\\text{ mg}\$ (2) \$1280\\text{ mg}\$

### 해설

식품 \$100\\text{ g}\$당 함유량을 기준으로 \$1\\text{ g}\$당 단백질의 양을 구한다. \$\$\\begin{aligned} \\text{식품 } P\\text{의 } 1\\text{ g당 단백질 양} &: \\dfrac{320}{100} \= 3.2\\text{ (mg)} \\ \\text{식품 } Q\\text{의 } 1\\text{ g당 단백질 양} &: \\dfrac{240}{100} \= 2.4\\text{ (mg)} \\end{aligned}\$\$ (1) 식품 \$P\$를 \$x\\text{ g}\$, 식품 \$Q\$를 \$y\\text{ g}\$ 섭취할 때의 총 단백질의 양은 \$\$\\begin{aligned} (3.2x \+ 2.4y)\\text{ mg} \\end{aligned}\$\$ (2) \$x \= 250, y \= 200\$을 위 식에 대입하여 계산하면 \$\$\\begin{aligned} 3.2 \\times 250 \+ 2.4 \\times 200 &= 800 \+ 480 \\ &= 1280\\text{ (mg)} \\end{aligned}\$\$ 따라서 구하는 답은 (1) \$(3.2x \+ 2.4y)\\text{ mg}\$, (2) \$1280\\text{ mg}\$이다.

```
{
  "status": "EXEMPT",
  "reason": "단위 환산 및 다변수 일차식 구성과 수치 대입 서술형 문항"
}
```

```
{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-ALGEBRAIC_EXPRESSION",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "1g당 함량 3.2mg, 2.4mg으로 식 3.2x+2.4y를 세우고 x=250, y=200을 대입해 1280mg을 서술한다.",
  "decisiveStep": "100g당 수치를 1g당 비율로 환산하여 대입 계산",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "문자의 사용과 식의 계산",
    "l3": "문자의 사용",
    "l4": "문자로 수량 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION",
    "templateKey": "TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION",
    "why": "자료의 비율 환산식을 문자로 표현하고 대입하여 값을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단위당 비율 환산 후 다변수 일차식 작성 및 대입 연산을 서술하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "문자식",
      "비율"
    ],
    "goal": [
      "문자식",
      "식의값"
    ],
    "method": [
      "대입",
      "사칙계산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[서·논술형 2\] 집에서 도서관까지 가는데 시속 \$45\\text{ km}\$인 버스를 타고 가는 것이 시속 \$15\\text{ km}\$인 자전거를 타고 가는 것보다 \$40\$분 일찍 도착한다. 집과 도서관 사이의 거리를 구하는 과정을 다음 단계에 따라 자세히 서술하시오. \[7점\]

(1) 미지수 정하기 (2) 일차방정식 세우기 (3) 일차방정식 풀기 (4) 문제의 답 구하기

### 선지

없음

### 정답

\$15\\text{ km}\$

### 해설

(1) 미지수 정하기: 집과 도서관 사이의 거리를 \$x\\text{ km}\$라 하자. (\$x \> 0\$)

(2) 일차방정식 세우기: 자전거로 갈 때 걸린 시간은 \$\\dfrac{x}{15}\$시간이고, 버스로 갈 때 걸린 시간은 \$\\dfrac{x}{45}\$시간이다. \$40\$분은 시간 단위로 환산하면 \$\\dfrac{40}{60} \= \\dfrac{2}{3}\$시간이므로 \$\$\\begin{aligned} \\dfrac{x}{15} \- \\dfrac{x}{45} \= \\dfrac{2}{3} \\end{aligned}\$\$

(3) 일차방정식 풀기: 양변에 분모의 최소공배수인 \$45\$를 곱하여 정리하면 \$\$\\begin{aligned} 3x \- x &= \\dfrac{2}{3} \\times 45 \\ 2x &= 30 \\ x &= 15 \\end{aligned}\$\$

(4) 문제의 답 구하기: 따라서 집과 도서관 사이의 거리는 \$15\\text{ km}\$이다.

```
{
  "status": "EXEMPT",
  "reason": "속력·시간·거리 관계의 일차방정식 단계별 서술형 문항"
}
```

```
{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-03",
  "subUnitKey": "M1-03-LINEAR_EQUATION_WORD",
  "conceptClusterKey": "ALGEBRAIC_EXPRESSION",
  "primaryMethod": "거리 x에 대해 x/15 - x/45 = 2/3의 시간차 방정식을 세워 x=15km를 서술한다.",
  "decisiveStep": "분 단위 40분을 2/3시간으로 환산 및 시간차 방정식 2x=30 해결",
  "rpm": {
    "majorUnit": "문자와 식",
    "midUnit": "일차방정식의 활용",
    "l3": "속력·시간·거리",
    "l4": "거리 관계식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_LINEAR_EQUATION_MODELING",
    "templateKey": "TPL_M1_LINEAR_EQUATION_MODEL_RATE",
    "why": "속력과 시간차 조건을 이용하여 거리를 구하는 일차방정식 활용 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "시간차를 이용한 일차방정식 모델링, 단위 환산, 분수방정식 해결을 4단계로 작성하는 서술형",
  "level": "중",
  "item4slot": {
    "given": [
      "속력",
      "시간"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "일차방정식",
      "거리식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q24

- 형식: 서답형  
- 배점: 6

### 발문

\[서·논술형 3\] 다음은 두 사람 민수와 지호가 직선 코스에서 걷기 운동을 할 때, 출발한 지 \$x\$분 후의 이동 거리 \$y\\text{ km}\$의 변화를 나타낸 그래프에 대한 설명이다. 그래프를 보고 알 수 있는 사실을 서로 다른 관점에서 두 가지 서술하시오. \[6점\] (단, 시간과 거리 정보를 구체적으로 포함하여 서술하시오.)

• 민수는 원점 \$(0, 0)\$에서 출발하여 일정한 속력으로 걸어 \$30\$분 후 \$2\\text{ km}\$ 지점에 도착한다. • 지호는 민수가 출발한 지 \$10\$분 후인 \$(10, 0)\$에서 출발하여 \$40\$분 후인 \$x \= 40\$분에 \$3\\text{ km}\$ 지점에 도달한다.

### 선지

없음

### 정답

(1) 지호는 민수가 출발한 지 \$10\$분 뒤에 출발하였다. (2) 민수는 출발 후 \$30\$분 동안 \$2\\text{ km}\$를 이동하였다.

### 해설

시간과 거리의 관계 그래프에서 각 인물의 출발 시각과 도달 지점을 좌표로 해석한다. \$\$\\begin{aligned} \\text{민수의 이동} &: \\text{원점 }(0, 0)\\text{에서 출발하여 }(30, 2)\\text{를 지나므로 } 30\\text{분 동안 } 2\\text{ km}\\text{를 이동하였다.} \\ \\text{지호의 이동} &: x\\text{축 위의 점 }(10, 0)\\text{에서 출발하므로 민수보다 } 10\\text{분 늦게 출발하였고, } x \= 40\\text{분에 } 3\\text{ km}\\text{에 도달하였다.} \\end{aligned}\$\$ 따라서 그래프를 통해 알 수 있는 구체적 사실은 다음과 같다. (1) 지호는 민수가 출발한 지 \$10\$분 뒤에 출발하였다. (2) 민수는 출발 후 \$30\$분 동안 \$2\\text{ km}\$를 이동하였다.

```
{
  "status": "EXEMPT",
  "reason": "시간-거리 다중 운동 그래프의 출발 시각 및 이동 거리 서술형 해석 문항"
}
```

```
{
  "sourceQid": "24",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2022",
  "standardUnitKey": "M1-04",
  "subUnitKey": "M1-04-GRAPH_RELATION",
  "conceptClusterKey": "GRAPH_RELATION",
  "primaryMethod": "그래프의 시작점 좌표와 도착점 좌표를 읽어 출발 시간차 10분과 민수의 이동거리 2km를 서술한다.",
  "decisiveStep": "좌표 (10, 0)과 (30, 2)로부터 시간 및 거리 수치 서술",
  "rpm": {
    "majorUnit": "좌표평면과 그래프",
    "midUnit": "좌표와 그래프",
    "l3": "그래프",
    "l4": "그래프 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONTEXT_GRAPH_INTERPRETATION",
    "templateKey": "TPL_M1_CONTEXT_GRAPH_INTERPRETATION_DISTANCE_TIME_FACT_AUDIT",
    "why": "거리-시간 그래프의 정량적 좌표로부터 사실을 도출하여 기술하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프의 절편과 경유 좌표를 해석하여 두 가지 사실을 언어화하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "시간",
      "거리"
    ],
    "goal": [
      "해석"
    ],
    "method": [
      "해석",
      "좌표"
    ],
    "condition": []
  },
  "hold": ""
}
```

