

```
{"stem": "23_제일고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_제일고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100.0, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 4



### 발문



다항식 \$x^3-2x^2-3x+a\$가 \$x-1\$로 나누어떨어질 때, 상수 \$a\$의 값은?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



④



### 해설



\$P(x)=x^3-2x^2-3x+a\$라 하면 \$P(x)\$가 \$x-1\$로 나누어떨어지므로 인수정리에 의하여 \$P(1)=0\$이다. \$P(1)=1-2-3+a=a-4=0 \\implies a=4\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "1",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-02",
  "subUnitKey": "H15-SA-02-REMAINDER_FACTOR",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리 P(1)=0에 x=1을 대입하여 상수 a=4를 구한다.",
  "decisiveStep": "x-1로 나누어떨어짐을 P(1)=0으로 바꾸어 대입하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "인수정리",
    "l4": "미정계수 결정"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리 P(1)=0 대입으로 상수 a 구함"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수정리를 직접 대입해 일차방정식을 푸는 1단계 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "다항식",
          "src": "stem",
          "quote": "다항식 $x^3-2x^2-3x+a$"
        }
      ],
      "goal": [
        {
          "term": "상수",
          "src": "stem",
          "quote": "상수 $a$의 값은?"
        }
      ],
      "method": [
        {
          "term": "인수정리",
          "src": "solution",
          "quote": "인수정리에 의하여 $P(1)=0$이다.",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": "RPM_ONLY"
}
```

## Q02

- 형식: 객관식  
- 배점: 4.1



### 발문



다음은 다항식 \$x^3-3x+5\$를 \$x+2\$로 나누었을 때, 몫과 나머지를 조립제법을 이용하여 구하는 과정이다. 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

| \$a\$ | \$1\$ | \$b\$ | \$-3\$ | \$5\$ |
| :---- | :---- | :---- | :---- | :---- |
|  |  | \$-2\$ | \$4\$ | \$-2\$ |
|  | \$1\$ | \$-2\$ | \$1\$ | **\$c\$** |

## 

### 선지

 ① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$ 

### 정답

 ① 

### 해설

 \$x+2\$로 나누므로 조립제법 왼쪽의 수 \$a=-2\$이다. \$x^3-3x+5\$에서 \$x^2\$의 계수는 \$0\$이므로 \$b=0\$이다. 마지막 열에서 나머지는 \$c=5+(-2)=3\$이다. 따라서 \$a+b+c=-2+0+3=1\$이다. 그러므로 정답은 ①이다. ```json:plan
{ "status": "EXEMPT", "reason": "조립제법 과정은 발문 내 표로 제시되며 좌표나 기하 SVG가 필요하지 않다." }
```

```
:meta
{ "sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": null, "curriculum": "2015", "standardUnitKey": null, "subUnitKey": null, "conceptClusterKey": null, "primaryMethod": "조립제법 표에서 제수의 근 a=-2, 이차항 계수 b=0, 나머지 c=5-2=3을 읽어 합산한다.", "decisiveStep": "x^2항이 빠진 다항식에서 빈 자리 계수 b=0을 정확히 채우는 단계", "rpm": null, "ptTplCandidate": { "problemTypeKey": null, "templateKey": null, "why": "메타\_키선택표\_고1.json이 정본 폴더에 없어 선택표 기반 키를 확정할 수 없음" }, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법 표의 빈칸을 채우며 제수의 부호와 0 계수를 확인해야 하는 기본 문항이다.", "level": "중", "item4slot": { "format": "단일 정답", "slots": { "given": \[ { "term": "다항식", "src": "stem", "quote": "다항식 \$x^3-3x+5\$" } \], "goal": \[ { "term": "합", "src": "stem", "quote": "\$a+b+c\$의 값은?" } \], "method": \[ { "term": "조립제법", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "NAMED" } \], "condition": \[ { "term": "상수", "src": "stem", "quote": "상수 \$a, b, c\$에 대하여" } \] } }, "hold": "메타\_키선택표\_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate 비움; 원본 JS의 2022 개정 태그에도 불구하고 2023년 기출이므로 2015 개정 수학(상) 적용" }
```

## Q03



- 형식: 객관식  
- 배점: 4.2



### 발문



다음 복소수에 대한 설명 중 옳지 않은 것은? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$\\overline{3-4i}=3+4i\$ ② \$\\sqrt{-16}=4i\$ ③ \$\\frac{\\sqrt{12}}{\\sqrt{-3}}=\\sqrt{\\frac{12}{-3}}\$ ④ \$(2+i)(2-i)=5\$ ⑤ \$i^7=-i\$



### 정답



③



### 해설



각 보기를 확인하면 ① \$\\overline{3-4i}=3+4i\$ (참) ② \$\\sqrt{-16}=4i\$ (참) ③ \$\\frac{\\sqrt{12}}{\\sqrt{-3}}=\\frac{2\\sqrt{3}}{i\\sqrt{3}}=\\frac{2}{i}=-2i\$인 반면 \$\\sqrt{\\frac{12}{-3}}=\\sqrt{-4}=2i\$이므로 두 값은 같지 않다. (거짓) ④ \$(2+i)(2-i)=4-i^2=5\$ (참) ⑤ \$i^7=i^4\\cdot i^3=-i\$ (참) 따라서 옳지 않은 것은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "3",
  "variationType": "CONCEPT",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-04",
  "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "다섯 선지의 복소수 연산과 음수 제곱근 나눗셈 부호 규칙을 대조하여 오류 선지 ③을 찾는다.",
  "decisiveStep": "분모만 음수인 제곱근 나눗셈에서 음의 부호가 튀어나옴을 확인하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "복소수",
    "l3": "i의 거듭제곱",
    "l4": "주기성"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT",
    "templateKey": "TPL_H1_COMPLEX_I_PERIOD",
    "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 복소수 연산과 음수 제곱근 나눗셈 부호 판별"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레복소수·거듭제곱·음수 제곱근의 나눗셈 부호 규칙을 판별하는 개념 문항이다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "복소수",
          "src": "stem",
          "quote": "복소수에 대한"
        }
      ],
      "goal": [
        {
          "term": "진리값",
          "src": "stem",
          "quote": "옳지 않은 것은?"
        }
      ],
      "method": [
        {
          "term": "허수단위",
          "src": "stem",
          "quote": "$i=\\sqrt{-1}$",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 4.4



### 발문



\$x+y=2\$, \$xy=-3\$일 때, \$x^2+y^2\$의 값은?



### 선지



① \$8\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$



### 정답



②



### 해설



곱셈공식의 변형에 의하여 \$x^2+y^2=(x+y)^2-2xy=2^2-2(-3)=4+6=10\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "4",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-01",
  "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC",
  "conceptClusterKey": null,
  "primaryMethod": "곱셈공식 변형 x^2+y^2=(x+y)^2-2xy에 x+y=2, xy=-3을 대입한다.",
  "decisiveStep": "(x+y)^2-2xy에 음수 곱 xy=-3을 대입해 부호를 정확히 계산하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "다항식의 연산",
    "l3": "다항식의 곱셈",
    "l4": "곱셈공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC",
    "templateKey": "TPL_H1_FORMULA_SYMMETRIC",
    "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈공식 변형으로 x^2+y^2 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 대칭식 곱셈공식 변형에 바로 대입하는 1단계 문항이다.",
  "level": "하",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "값",
          "src": "stem",
          "quote": "$x+y=2$, $xy=-3$일 때"
        }
      ],
      "goal": [
        {
          "term": "합",
          "src": "stem",
          "quote": "$x^2+y^2$의 값은?"
        }
      ],
      "method": [
        {
          "term": "곱셈공식",
          "src": "solution",
          "quote": "곱셈공식의 변형에 의하여",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 4.4



### 발문



\$i+2i^2+3i^3+\\cdots+24i^{24}\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$10-10i\$ ② \$10+10i\$ ③ \$12+12i\$ ④ \$6-6i\$ ⑤ \$12-12i\$



### 정답



⑤



### 해설



\$i\$의 거듭제곱은 주기가 \$4\$이므로 \$4\$개의 항씩 묶어 계산하면 \$j=0, 1, 2, 3, 4, 5\$에 대하여 \$\\begin{aligned} (4j+1)i^{4j+1}+(4j+2)i^{4j+2}+(4j+3)i^{4j+3}+(4j+4)i^{4j+4} &= (4j+1)i-(4j+2)-(4j+3)i+(4j+4) \\ &= 2-2i \\end{aligned}\$ 이러한 묶음이 \$6\$개 있으므로 구하는 합은 \$6(2-2i)=12-12i\$ 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "5",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-04",
  "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "i의 거듭제곱 4주기를 이용해 연속한 4개 항의 합이 2-2i로 일정함을 보이고 6묶음을 곱한다.",
  "decisiveStep": "4k+1~4k+4 항의 합이 k에 무관하게 2-2i임을 일반화하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "복소수",
    "l3": "i의 거듭제곱",
    "l4": "주기성"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT",
    "templateKey": "TPL_H1_COMPLEX_I_PERIOD",
    "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i 거듭제곱 4주기 합=2-2i 활용"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "계수가 등차수열로 커지는 i의 거듭제곱 합을 4개씩 묶어 규칙을 찾아야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "허수단위",
          "src": "stem",
          "quote": "$i=\\sqrt{-1}$"
        }
      ],
      "goal": [
        {
          "term": "복소수",
          "src": "stem",
          "quote": "$i+2i^2+3i^3+\\cdots+24i^{24}$의 값은?"
        }
      ],
      "method": [
        {
          "term": "거듭제곱",
          "src": "solution",
          "quote": "$i$의 거듭제곱은 주기가 $4$이므로",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4.5



### 발문



복소수 \$z=(x+3)+(2x-3)i\$에 대하여 \$z^2\$이 순허수가 되도록 하는 모든 실수 \$x\$의 값의 합은? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$6\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$9\$



### 정답



①



### 해설



\$z=a+bi\$ (\$a=x+3, b=2x-3\$)라 하면 \$z^2=(a^2-b^2)+2abi\$이다. \$z^2\$이 순허수가 되려면 \$a^2-b^2=0\$이고 \$2ab \\neq 0\$, 즉 \$\|a\|=\|b\| \\neq 0\$이어야 한다. \$(x+3)^2=(2x-3)^2 \\implies x+3=\\pm(2x-3)\$ (i) \$x+3=2x-3 \\implies x=6\$ (이때 \$a=9, b=9\$이므로 \$z^2\$은 순허수) (ii) \$x+3=-(2x-3) \\implies 3x=0 \\implies x=0\$ (이때 \$a=3, b=-3\$이므로 \$z^2\$은 순허수) 따라서 모든 실수 \$x\$의 값의 합은 \$6+0=6\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "6",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-04",
  "subUnitKey": "H15-SA-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "z^2이 순허수일 조건 |Re(z)|=|Im(z)|!=0을 풀어 x=0, 6을 구하고 합산한다.",
  "decisiveStep": "z^2=(a^2-b^2)+2abi가 순허수일 때 a=b 또는 a=-b의 두 경우를 모두 푸는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "복소수",
    "l3": "i의 거듭제곱",
    "l4": "복소수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION",
    "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT",
    "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): z^2 순허수 조건 |Re(z)|=|Im(z)|!=0 풀이"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "복소수의 제곱이 순허수가 될 조건을 실수부·허수부의 절댓값 일치로 연결해야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "복소수",
          "src": "stem",
          "quote": "복소수 $z=(x+3)+(2x-3)i$"
        }
      ],
      "goal": [
        {
          "term": "합",
          "src": "stem",
          "quote": "모든 실수 $x$의 값의 합은?"
        }
      ],
      "method": [
        {
          "term": "순허수",
          "src": "stem",
          "quote": "$z^2$이 순허수가 되도록",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "실수",
          "src": "stem",
          "quote": "실수 $x$"
        }
      ]
    }
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4.6



### 발문



다항식 \$2x^3-kx^2-ax+kb\$가 실수 \$k\$의 값에 관계없이 항상 \$x+1\$로 나누어떨어질 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



③



### 해설



\$P(x)=2x^3-kx^2-ax+kb\$라 하면 \$x+1\$로 항상 나누어떨어지므로 인수정리에 의하여 \$P(-1)=0\$이다. \$P(-1)=-2-k+a+kb=(a-2)+k(b-1)=0\$ 이 등식이 실수 \$k\$의 값에 관계없이 항상 성립해야 하므로 \$k\$에 대한 항등식이다. 따라서 \$a-2=0\$, \$b-1=0\$이므로 \$a=2\$, \$b=1\$이다. 그러므로 \$a+b=2+1=3\$이다. 따라서 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "7",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-02",
  "subUnitKey": "H15-SA-02-REMAINDER_FACTOR",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리 P(-1)=0을 k에 대해 정리해 (a-2)+k(b-1)=0을 얻고 k 항등식 계수비교로 a=2, b=1을 구한다.",
  "decisiveStep": "P(-1)=0 식을 k에 대한 내림차순으로 묶어 항등식 조건을 적용하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "인수정리",
    "l4": "미정계수 결정"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리 P(-1)=0을 k에 대한 항등식으로 풀이"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수정리와 k에 대한 항등식 조건을 순차 결합하여 두 상수를 결정해야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "다항식",
          "src": "stem",
          "quote": "다항식 $2x^3-kx^2-ax+kb$"
        }
      ],
      "goal": [
        {
          "term": "합",
          "src": "stem",
          "quote": "$a+b$의 값은?"
        }
      ],
      "method": [
        {
          "term": "인수정리",
          "src": "solution",
          "quote": "인수정리에 의하여 $P(-1)=0$이다.",
          "evidenceType": "NAMED"
        },
        {
          "term": "항등식",
          "src": "solution",
          "quote": "$k$에 대한 항등식이다.",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "항상성립",
          "src": "stem",
          "quote": "실수 $k$의 값에 관계없이 항상"
        }
      ]
    }
  },
  "hold": "RPM_ONLY"
}
```

## Q08

- 형식: 객관식  
- 배점: 4.7



### 발문



다항식 \$x^4+3x^3-2x^2+3x+1\$이 두 이차다항식의 곱으로 인수분해될 때, 두 이차다항식의 합은?



### 선지



① \$2x^2+2x+2\$ ② \$2x^2+3x+2\$ ③ \$2x^2-3x+2\$ ④ \$2x^2+4x+2\$ ⑤ \$x^2+3x+2\$



### 정답



②



### 해설



주어진 상반다항식의 최고차항의 계수와 상수항이 모두 \$1\$이고 계수가 대칭이므로 \$(x^2+ax+1)(x^2+bx+1)\$의 꼴로 놓고 전개하면 \$(x^2+ax+1)(x^2+bx+1)=x^4+(a+b)x^3+(ab+2)x^2+(a+b)x+1\$ 계수를 비교하면 \$a+b=3\$, \$ab+2=-2 \\implies ab=-4\$이다. 따라서 \${a, b}={4, \-1}\$이므로 두 이차다항식은 \$x^2+4x+1\$, \$x^2-x+1\$이다. 구하는 두 다항식의 합은 \$(x^2+4x+1)+(x^2-x+1)=2x^2+3x+2\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "8",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-03",
  "subUnitKey": "H15-SA-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "대칭 사차식을 (x^2+ax+1)(x^2+bx+1)로 놓고 계수비교로 a+b=3, ab=-4를 구해 두 이차식의 합을 계산한다.",
  "decisiveStep": "상반다항식 계수 대칭을 이용해 (x^2+ax+1)(x^2+bx+1) 꼴로 설정하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "공통인수",
    "l4": "단계적 인수분해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 대칭 사차식 미정계수 인수분해"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상반다항식의 인수분해 구조를 파악하고 계수비교로 두 인수를 구해야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "다항식",
          "src": "stem",
          "quote": "다항식 $x^4+3x^3-2x^2+3x+1$"
        }
      ],
      "goal": [
        {
          "term": "합",
          "src": "stem",
          "quote": "두 이차다항식의 합은?"
        }
      ],
      "method": [
        {
          "term": "인수분해",
          "src": "stem",
          "quote": "인수분해될 때",
          "evidenceType": "NAMED"
        },
        {
          "term": "계수비교",
          "src": "solution",
          "quote": "계수를 비교하면 $a+b=3$",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 4.8



### 발문



\$x^2-x-1=0\$을 만족시키는 실수 \$x\$에 대하여 \$\\frac{x^4+2x^3-x^2-x+2}{x+1}\$의 값은?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



⑤



### 해설



\$x^2=x+1\$을 이용하여 고차항의 차수를 낮추면 \$x^3=x\\cdot x^2=x(x+1)=x^2+x=(x+1)+x=2x+1\$ \$x^4=x\\cdot x^3=x(2x+1)=2x^2+x=2(x+1)+x=3x+2\$ 이를 분자에 대입하면 \$\\begin{aligned} x^4+2x^3-x^2-x+2 &= (3x+2)+2(2x+1)-(x+1)-x+2 \\ &= 3x+2+4x+2-x-1-x+2 \\ &= 5x+5=5(x+1) \\end{aligned}\$ 따라서 \$\\frac{5(x+1)}{x+1}=5\$이다. (단, \$x=-1\$은 \$x^2-x-1=0\$을 만족하지 않으므로 \$x+1 \\neq 0\$) 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "9",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-07",
  "subUnitKey": "H15-SA-07-HIGHER_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "x^2=x+1로 x^3=2x+1, x^4=3x+2를 차례로 차수 낮추어 분자 5(x+1)을 구하고 분모 x+1을 약분한다.",
  "decisiveStep": "이차방정식 x^2=x+1을 이용해 삼차·사차항을 일차식으로 차수 하강하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "여러 가지 방정식",
    "l3": "삼차·사차방정식",
    "l4": "치환형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION",
    "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION",
    "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): 이차방정식 차수 내림으로 고차식 분수 약분"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차식을 이용한 고차식의 차수 하강 후 분모 인수와 약분됨을 발견해야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "이차방정식",
          "src": "stem",
          "quote": "$x^2-x-1=0$"
        }
      ],
      "goal": [
        {
          "term": "식의값",
          "src": "stem",
          "quote": "$\\frac{x^4+2x^3-x^2-x+2}{x+1}$의 값은?"
        }
      ],
      "method": [
        {
          "term": "대입",
          "src": "solution",
          "quote": "이를 분자에 대입하면",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "실수",
          "src": "stem",
          "quote": "실수 $x$에 대하여"
        }
      ]
    }
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4.1



### 발문



좌표평면 위의 두 점 \$A(-2, 4)\$, \$B(4, \-2)\$를 이은 선분 \$AB\$의 길이는?



### 선지



① \$4\\sqrt{2}\$ ② \$5\\sqrt{2}\$ ③ \$6\$ ④ \$6\\sqrt{2}\$ ⑤ \$8\$



### 정답



④



### 해설



두 점 사이의 거리 공식에 의하여 \$\\overline{AB}=\\sqrt{{4-(-2)}^2+(-2-4)^2}=\\sqrt{6^2+(-6)^2}=\\sqrt{72}=6\\sqrt{2}\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "10",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-09",
  "subUnitKey": "H15-SA-09-COORDINATE_METRIC",
  "conceptClusterKey": null,
  "primaryMethod": "두 점 사이의 거리 공식 sqrt((x2-x1)^2+(y2-y1)^2)에 A(-2,4), B(4,-2)를 대입한다.",
  "decisiveStep": "좌표 차 6, -6을 제곱해 합한 72를 6*sqrt(2)로 간단히 하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "평면좌표",
    "l3": "두 점 사이의 거리",
    "l4": "거리 공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORD_DISTANCE",
    "templateKey": "TPL_COORD_DISTANCE_DIRECT",
    "why": "high1.json H1-RPM-053(DIRECT_ACTIVE): 두 점 사이의 거리 공식 직접 적용"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "좌표평면 위 두 점 사이의 거리 공식을 직접 적용하는 1단계 문항이다.",
  "level": "하",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "점",
          "src": "stem",
          "quote": "두 점 $A(-2, 4)$, $B(4, -2)$"
        }
      ],
      "goal": [
        {
          "term": "길이",
          "src": "stem",
          "quote": "선분 $AB$의 길이는?"
        }
      ],
      "method": [
        {
          "term": "거리",
          "src": "solution",
          "quote": "두 점 사이의 거리 공식에 의하여",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4.2



### 발문



다음 중 직선 \$3x-6y+2=0\$에 평행한 직선의 방정식은?



### 선지



① \$x-y+2=0\$ ② \$-2x+4y+3=0\$ ③ \$2x+y-1=0\$ ④ \$6x+3y-4=0\$ ⑤ \$x+2y-5=0\$



### 정답



②



### 해설



주어진 직선 \$3x-6y+2=0\$을 정리하면 \$y=\\frac{1}{2}x+\\frac{1}{3}\$이므로 기울기는 \$\\frac{1}{2}\$이다. 보기 ②의 직선 \$-2x+4y+3=0\$을 정리하면 \$y=\\frac{1}{2}x-\\frac{3}{4}\$이므로 기울기가 \$\\frac{1}{2}\$로 같고 \$y\$절편이 다르므로 평행하다. 따라서 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "11",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR",
  "conceptClusterKey": null,
  "primaryMethod": "3x-6y+2=0의 기울기 1/2을 구하고 각 보기를 표준형으로 고쳐 기울기가 1/2이고 y절편이 다른 ②를 찾는다.",
  "decisiveStep": "x, y 계수의 비가 같고 상수항 비가 다른 평행 조건을 확인하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "두 직선의 위치 관계",
    "l4": "평행"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LINE_RELATION",
    "templateKey": "TPL_RELATION_PARALLEL_PARAMETER",
    "why": "high1.json H1-RPM-061(DIRECT_ACTIVE): 두 직선의 평행 조건(기울기 같고 y절편 다름)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직선의 일반형에서 기울기를 읽어 평행한 직선을 판별하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "직선",
          "src": "stem",
          "quote": "직선 $3x-6y+2=0$"
        }
      ],
      "goal": [
        {
          "term": "평행",
          "src": "stem",
          "quote": "평행한 직선의 방정식은?"
        }
      ],
      "method": [
        {
          "term": "기울기",
          "src": "solution",
          "quote": "기울기는 $\\frac{1}{2}$이다.",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 4.3



### 발문



수직선 위의 두 점 \$A(-2)\$, \$B(8)\$을 이은 선분 \$AB\$를 \$2:3\$으로 내분하는 점을 \$P\$, \$1:3\$으로 외분하는 점을 \$Q\$라 할 때, 두 점 \$P, Q\$ 사이의 거리는?



### 선지



① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$



### 정답



⑤



### 해설



점 \$P\$는 선분 \$AB\$를 \$2:3\$으로 내분하므로 \$P=\\frac{2\\cdot 8+3(-2)}{2+3}=\\frac{16-6}{5}=2\$ 점 \$Q\$는 선분 \$AB\$를 \$1:3\$으로 외분하므로 \$Q=\\frac{1\\cdot 8-3(-2)}{1-3}=\\frac{8+6}{-2}=-7\$ 따라서 두 점 \$P, Q\$ 사이의 거리는 \$\|2-(-7)\|=9\$이다. 그러므로 정답은 ⑤이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 수직선 위 내분점과 외분점의 위치를 제시한다."
  },
  "solution": {
    "capability": "number-line-figure-v1",
    "numberLine": {
      "axisVariable": false,
      "rows": [
        {
          "kind": "POINTS",
          "band": false,
          "points": [
            {
              "id": "Q",
              "value": "-7"
            },
            {
              "id": "A",
              "value": "-2"
            },
            {
              "id": "P",
              "divides": {
                "from": "A",
                "to": "B",
                "ratio": [
                  "2",
                  "3"
                ]
              }
            },
            {
              "id": "B",
              "value": "8"
            }
          ],
          "spans": [
            {
              "from": "Q",
              "to": "P",
              "label": "9",
              "style": "BRACE",
              "side": "BELOW"
            }
          ]
        }
      ]
    },
    "caption": "내분점 P(2)와 외분점 Q(-7) 사이의 거리는 9이다."
  }
}
```

```
"NONE"
```

```
{
  "sourceQid": "12",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-09",
  "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "내분점 공식으로 P=2, 외분점 공식으로 Q=-7을 각각 계산한 뒤 차의 절댓값 |2-(-7)|=9를 구한다.",
  "decisiveStep": "외분점 공식 분모 (1-3)의 부호를 실수 없이 계산해 Q=-7을 얻는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "평면좌표",
    "l3": "선분의 내분·외분",
    "l4": "외분점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORD_SECTION",
    "templateKey": "TPL_SECTION_EXTERNAL",
    "why": "high1.json H1-RPM-056(DIRECT_BINDING_GAP): 내분점과 외분점 공식 적용 후 거리 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직선 위 내분점과 외분점 공식을 각각 정확히 적용해 두 점 사이 거리를 구해야 한다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "선분",
          "src": "stem",
          "quote": "선분 $AB$를"
        }
      ],
      "goal": [
        {
          "term": "거리",
          "src": "stem",
          "quote": "두 점 $P, Q$ 사이의 거리는?"
        }
      ],
      "method": [
        {
          "term": "내분",
          "src": "solution",
          "quote": "점 $P$는 선분 $AB$를 $2:3$으로 내분하므로",
          "evidenceType": "IMPLIED",
          "justification": "내분점 공식을 적용해 P=2를 구함"
        },
        {
          "term": "외분",
          "src": "solution",
          "quote": "점 $Q$는 선분 $AB$를 $1:3$으로 외분하므로",
          "evidenceType": "IMPLIED",
          "justification": "외분점 공식을 적용해 Q=-7을 구함"
        }
      ],
      "condition": []
    }
  },
  "hold": "BINDING_GAP"
}
```

## Q13

- 형식: 객관식  
- 배점: 4.4



### 발문



두 직선 \$l:x+y-2=0\$, \$m:x-2y-8=0\$의 교점을 \$C\$라 하자. 점 \$C\$를 지나고 직선 \$3x-y+5=0\$과 평행한 직선의 방정식은?



### 선지



① \$3x-y-10=0\$ ② \$3x-y-12=0\$ ③ \$3x-y+14=0\$ ④ \$3x-y-14=0\$ ⑤ \$3x+y-10=0\$



### 정답



④



### 해설



두 직선 \$l, m\$의 교점 \$C\$를 구하기 위해 연립하면 \$x+y=2\$, \$x-2y=8\$ 두 식을 빼면 \$3y=-6 \\implies y=-2\$, \$x=4\$이므로 \$C(4, \-2)\$이다. 직선 \$3x-y+5=0\$과 평행한 직선의 방정식을 \$3x-y+c=0\$ (\$c\$는 상수)이라 하고 점 \$C(4, \-2)\$를 대입하면 \$3\\cdot 4-(-2)+c=0 \\implies 14+c=0 \\implies c=-14\$ 따라서 구하는 직선의 방정식은 \$3x-y-14=0\$이다. 그러므로 정답은 ④이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 직선의 교점과 평행선을 보여준다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "nodes": [
        {
          "id": "l",
          "op": "SOURCE_LINE",
          "args": {
            "a": "1",
            "b": "1",
            "c": "-2"
          }
        },
        {
          "id": "m",
          "op": "SOURCE_LINE",
          "args": {
            "a": "1",
            "b": "-2",
            "c": "-8"
          }
        },
        {
          "id": "C",
          "op": "INTERSECTION",
          "inputs": [
            "l",
            "m"
          ],
          "args": {}
        },
        {
          "id": "p",
          "op": "SOURCE_LINE",
          "args": {
            "a": "3",
            "b": "-1",
            "c": "-14"
          }
        }
      ]
    },
    "lineLabels": {
      "l": "l: x+y-2=0",
      "m": "m: x-2y-8=0",
      "p": "3x-y-14=0"
    },
    "caption": "교점 C(4, -2)를 지나고 직선 3x-y+5=0과 평행한 직선 3x-y-14=0"
  }
}
```

```
"NONE"
```

```
{
  "sourceQid": "13",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR",
  "conceptClusterKey": null,
  "primaryMethod": "두 직선 l, m을 연립해 교점 C(4,-2)를 구한 뒤 3x-y+c=0에 대입해 c=-14를 구한다.",
  "decisiveStep": "교점 좌표를 평행한 직선 3x-y+c=0에 대입해 상수항 c를 결정하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "두 직선의 위치 관계",
    "l4": "교점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LINE_RELATION",
    "templateKey": "TPL_RELATION_MULTIPLE_POSITION",
    "why": "high1.json H1-RPM-063(DIRECT_ACTIVE): 두 직선의 교점 연립 후 다른 직선 대입"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "연립일차방정식으로 교점을 구한 뒤 평행선 방정식을 세워 대입하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "직선",
          "src": "stem",
          "quote": "두 직선 $l:x+y-2=0$, $m:x-2y-8=0$"
        }
      ],
      "goal": [
        {
          "term": "직선의방정식",
          "src": "stem",
          "quote": "직선의 방정식은?"
        }
      ],
      "method": [
        {
          "term": "연립방정식",
          "src": "solution",
          "quote": "교점 $C$를 구하기 위해 연립하면",
          "evidenceType": "IMPLIED",
          "justification": "두 직선 식을 연립방정식으로 풀어 교점을 구함"
        },
        {
          "term": "평행",
          "src": "stem",
          "quote": "평행한 직선의 방정식은?",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4.5



### 발문



두 점 \$A(-1, 2)\$, \$B(5, 6)\$을 지나는 직선에 수직인 직선의 방정식은?



### 선지



① \$2x+3y-1=0\$ ② \$3x-2y+4=0\$ ③ \$3x+2y-5=0\$ ④ \$2x-3y+7=0\$ ⑤ \$3x-2y-5=0\$



### 정답



③



### 해설



두 점 \$A(-1, 2)\$, \$B(5, 6)\$을 지나는 직선의 기울기는 \$\\frac{6-2}{5-(-1)}=\\frac{4}{6}=\\frac{2}{3}\$ 수직인 두 직선의 기울기의 곱은 \$-1\$이므로 구하는 직선의 기울기는 \$-\\frac{3}{2}\$이다. 보기 ③의 \$3x+2y-5=0\$을 정리하면 \$y=-\\frac{3}{2}x+\\frac{5}{2}\$이므로 기울기가 \$-\\frac{3}{2}\$이다. 따라서 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "14",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR",
  "conceptClusterKey": null,
  "primaryMethod": "두 점 A(-1,2), B(5,6)의 기울기 2/3을 구한 뒤 수직 조건으로 기울기 -3/2인 직선 ③을 고른다.",
  "decisiveStep": "기울기 곱이 -1임을 이용해 수직 기울기 -3/2를 구하고 보기와 대조하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "두 직선의 위치 관계",
    "l4": "수직"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LINE_RELATION",
    "templateKey": "TPL_RELATION_PERPENDICULAR_PARAMETER",
    "why": "high1.json H1-RPM-062(DIRECT_ACTIVE): 두 점 기울기 구해 수직인 직선 판별"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 점의 기울기를 구하고 수직 조건 m*m'=-1을 적용하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "점",
          "src": "stem",
          "quote": "두 점 $A(-1, 2)$, $B(5, 6)$"
        }
      ],
      "goal": [
        {
          "term": "직선의방정식",
          "src": "stem",
          "quote": "수직인 직선의 방정식은?"
        }
      ],
      "method": [
        {
          "term": "기울기",
          "src": "solution",
          "quote": "직선의 기울기는",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

```
"NONE"
```

## Q15

- 형식: 객관식  
- 배점: 4.6



### 발문



평행한 두 직선 \$3x-4y-2=0\$, \$-6x+8y+k=0\$ 사이의 거리가 \$3\$일 때, 모든 실수 \$k\$의 값의 합은?



### 선지



① \$4\$ ② \$8\$ ③ \$12\$ ④ \$16\$ ⑤ \$20\$



### 정답



②



### 해설



둘째 직선 \$-6x+8y+k=0\$의 양변을 \$-2\$로 나누면 \$3x-4y-\\frac{k}{2}=0\$ 평행한 두 직선 사이의 거리 공식에 의하여 \$\\frac{\\left\|-\\frac{k}{2}-(-2)\\right\|}{\\sqrt{3^2+(-4)^2}}=\\frac{\\left\|2-\\frac{k}{2}\\right\|}{5}=3\$ 따라서 \$\\left\|2-\\frac{k}{2}\\right\|=15\$이므로 \$2-\\frac{k}{2}=15 \\implies k=-26\$ 또는 \$2-\\frac{k}{2}=-15 \\implies k=34\$ 그러므로 모든 실수 \$k\$의 값의 합은 \$-26+34=8\$이다. 따라서 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "15",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-DISTANCE_ANGLE",
  "conceptClusterKey": null,
  "primaryMethod": "둘째 직선을 -2로 나누어 계수를 맞춘 뒤 평행선 거리 공식 |2-k/2|/5=3을 풀어 k=-26, 34를 구한다.",
  "decisiveStep": "두 직선의 x, y 계수를 3, -4로 통일한 뒤 절댓값 방정식 |2-k/2|=15의 두 해를 구하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "점과 직선 사이의 거리",
    "l4": "거리 공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_POINT_LINE_DISTANCE",
    "templateKey": "TPL_POINT_LINE_DISTANCE_DIRECT",
    "why": "high1.json H1-RPM-064(DIRECT_ACTIVE): 평행한 두 직선 사이의 거리 공식으로 k 구함"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직선 계수를 통일한 뒤 평행선 거리 공식과 절댓값 방정식을 함께 처리해야 한다.",
  "level": "상",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "직선",
          "src": "stem",
          "quote": "평행한 두 직선 $3x-4y-2=0$, $-6x+8y+k=0$"
        }
      ],
      "goal": [
        {
          "term": "합",
          "src": "stem",
          "quote": "모든 실수 $k$의 값의 합은?"
        }
      ],
      "method": [
        {
          "term": "평행",
          "src": "stem",
          "quote": "평행한 두 직선",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "거리",
          "src": "stem",
          "quote": "사이의 거리가 $3$일 때"
        }
      ]
    }
  },
  "hold": ""
}
```

```
"NONE"
```

## Q16

- 형식: 객관식  
- 배점: 4.7



### 발문



좌표평면 위의 두 점 \$A(3, 4)\$, \$B(8, \-6)\$에 대하여 \$\\angle AOB\$의 이등분선과 선분 \$AB\$의 교점의 좌표는? (단, \$O\$는 원점이다.)



### 선지



① \$\\left(\\frac{14}{3}, \\frac{2}{3}\\right)\$ ② \$\\left(\\frac{11}{2}, \-1\\right)\$ ③ \$\\left(\\frac{19}{3}, \-\\frac{8}{3}\\right)\$ ④ \$(5, 0)\$ ⑤ \$\\left(\\frac{13}{3}, \\frac{4}{3}\\right)\$



### 정답



①



### 해설



\$\\overline{OA}=\\sqrt{3^2+4^2}=5\$, \$\\overline{OB}=\\sqrt{8^2+(-6)^2}=\\sqrt{64+36}=10\$ 교점을 \$P\$라 하면 삼각형의 내각의 이등분선 정리에 의하여 \$\\overline{AP}:\\overline{PB}=\\overline{OA}:\\overline{OB}=5:10=1:2\$ 따라서 점 \$P\$는 선분 \$AB\$를 \$1:2\$로 내분하는 점이므로 \$P=\\left(\\frac{1\\cdot 8+2\\cdot 3}{1+2}, \\frac{1(-6)+2\\cdot 4}{1+2}\\right)=\\left(\\frac{14}{3}, \\frac{2}{3}\\right)\$ 그러므로 정답은 ①이다.

```
"NONE"
```

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 삼각형 OAB와 각 AOB의 이등분선을 제시한다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "nodes": [
        {
          "id": "O",
          "op": "SOURCE_POINT",
          "args": {
            "x": "0",
            "y": "0"
          }
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "args": {
            "x": "3",
            "y": "4"
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "args": {
            "x": "8",
            "y": "-6"
          }
        },
        {
          "id": "P",
          "op": "DIVISION_POINT",
          "inputs": [
            "A",
            "B"
          ],
          "args": {
            "m": "1",
            "n": "2",
            "mode": "INTERNAL"
          }
        },
        {
          "id": "OA",
          "op": "SEGMENT",
          "inputs": [
            "O",
            "A"
          ],
          "args": {}
        },
        {
          "id": "OB",
          "op": "SEGMENT",
          "inputs": [
            "O",
            "B"
          ],
          "args": {}
        },
        {
          "id": "AB",
          "op": "SEGMENT",
          "inputs": [
            "A",
            "B"
          ],
          "args": {}
        },
        {
          "id": "OP",
          "op": "SEGMENT",
          "inputs": [
            "O",
            "P"
          ],
          "args": {}
        }
      ]
    },
    "caption": "OA:OB=1:2이므로 각 AOB의 이등분선은 선분 AB를 1:2로 내분하는 점 P를 지난다."
  }
}
```

```
{
  "sourceQid": "16",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-09",
  "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "OA=5, OB=10을 구해 각의 이등분선 정리로 AP:PB=1:2를 얻고 내분점 공식으로 P(14/3, 2/3)을 구한다.",
  "decisiveStep": "각의 이등분선 정리를 적용해 내분비 OA:OB=1:2를 도출하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "평면좌표",
    "l3": "선분의 내분·외분",
    "l4": "내분점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORD_SECTION",
    "templateKey": "TPL_SECTION_INTERNAL",
    "why": "high1.json H1-RPM-055(DIRECT_BINDING_GAP): 각의 이등분선 길이 비와 내분점 공식 결합"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 선분의 길이를 구한 뒤 각의 이등분선 정리와 내분점 공식을 연쇄 적용해야 한다.",
  "level": "상",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [
        {
          "term": "점",
          "src": "stem",
          "quote": "두 점 $A(3, 4)$, $B(8, -6)$"
        }
      ],
      "goal": [
        {
          "term": "좌표",
          "src": "stem",
          "quote": "교점의 좌표는?"
        }
      ],
      "method": [
        {
          "term": "각의이등분선정리",
          "src": "solution",
          "quote": "이등분선 정리에 의하여",
          "evidenceType": "NAMED"
        },
        {
          "term": "내분",
          "src": "solution",
          "quote": "$1:2$로 내분하는 점이므로",
          "evidenceType": "IMPLIED",
          "justification": "내분점 공식으로 P의 좌표를 계산함"
        }
      ],
      "condition": []
    }
  },
  "hold": "BINDING_GAP"
}
```

## Q17

- 형식: 객관식  
- 배점: 4.7



### 발문



두 점 \$A(4, k+2)\$, \$B(k, \-2)\$에 대하여 선분 \$AB\$의 길이가 최소가 되도록 하는 \$k\$와 그때의 선분 \$AB\$의 길이를 순서쌍으로 나타낸 것은?



### 선지



① \$(1, \\sqrt{34})\$ ② \$(-1, \\sqrt{34})\$ ③ \$(2, 6)\$ ④ \$(0, 4\\sqrt{2})\$ ⑤ \$(4, 4\\sqrt{2})\$



### 정답



④



### 해설



선분 \$AB\$의 길이의 제곱은 \$\\begin{aligned} \\overline{AB}^2 &= (k-4)^2+{-2-(k+2)}^2 \\ &= (k-4)^2+(k+4)^2 \\ &= 2k^2+32 \\end{aligned}\$ \$k\$는 실수이므로 \$2k^2+32\$는 \$k=0\$일 때 최솟값 \$32\$를 갖는다. 따라서 \$\\overline{AB}\$의 최솟값은 \$\\sqrt{32}=4\\sqrt{2}\$이므로 구하는 순서쌍은 \$(0, 4\\sqrt{2})\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
"NONE"
```

```
{
  "sourceQid": "17",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-09",
  "subUnitKey": "H15-SA-09-COORDINATE_METRIC",
  "conceptClusterKey": null,
  "primaryMethod": "거리 제곱 AB^2=(k-4)^2+(k+4)^2=2k^2+32로 정리해 k=0에서 최솟값 4*sqrt(2)를 구한다.",
  "decisiveStep": "두 점 거리 제곱식을 k에 대한 이차식으로 정리해 꼭짓점 k=0에서 최솟값을 구하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "평면좌표",
    "l3": "두 점 사이의 거리",
    "l4": "거리 공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORD_DISTANCE",
    "templateKey": "TPL_COORD_DISTANCE_DIRECT",
    "why": "high1.json H1-RPM-053(DIRECT_ACTIVE): 두 점 거리 제곱 이차식 최솟값 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "좌표 거리의 최솟값을 제곱식의 이차함수 최솟값으로 전환해 풀어야 한다.",
  "level": "상",
  "item4slot": {
    "format": "순서쌍",
    "slots": {
      "given": [
        {
          "term": "점",
          "src": "stem",
          "quote": "두 점 $A(4, k+2)$, $B(k, -2)$"
        }
      ],
      "goal": [
        {
          "term": "최솟값",
          "src": "stem",
          "quote": "길이가 최소가 되도록"
        }
      ],
      "method": [
        {
          "term": "거리",
          "src": "solution",
          "quote": "선분 $AB$의 길이의 제곱은",
          "evidenceType": "IMPLIED",
          "justification": "두 점 사이의 거리 제곱 공식을 k의 식으로 세움"
        },
        {
          "term": "이차식",
          "src": "solution",
          "quote": "2k^2+32",
          "evidenceType": "IMPLIED",
          "justification": "이차식의 최솟값이 k=0에서 발생함을 이용함"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4.8



### 발문



두 직선 \$2x-y-3=0\$, \$x-2y+3=0\$이 이루는 각을 이등분하는 직선의 방정식을 모두 고르면?



### 선지



① \$x+y-6=0\$ ② \$x+y+6=0\$ ③ \$x-y=0\$ ④ \$x-y-2=0\$ ⑤ \$2x+y-3=0\$



### 정답



①, ③



### 해설



각의 이등분선 위의 임의의 점 \$(x, y)\$에서 두 직선까지의 거리가 같으므로 \$\\frac{\|2x-y-3\|}{\\sqrt{2^2+(-1)^2}}=\\frac{\|x-2y+3\|}{\\sqrt{1^2+(-2)^2}}\$ 양변의 분모가 \$\\sqrt{5}\$로 같으므로 \$\|2x-y-3\|=\|x-2y+3\|\$, 즉 \$2x-y-3=\\pm(x-2y+3)\$ (i) \$2x-y-3=x-2y+3 \\implies x+y-6=0\$ (①) (ii) \$2x-y-3=-(x-2y+3) \\implies 3x-3y=0 \\implies x-y=0\$ (③) 따라서 정답은 ①, ③이다.

```
"NONE"
```

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 직선과 두 개의 각의 이등분선을 제시한다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "nodes": [
        {
          "id": "l",
          "op": "SOURCE_LINE",
          "args": {
            "a": "2",
            "b": "-1",
            "c": "-3"
          }
        },
        {
          "id": "m",
          "op": "SOURCE_LINE",
          "args": {
            "a": "1",
            "b": "-2",
            "c": "3"
          }
        },
        {
          "id": "b1",
          "op": "SOURCE_LINE",
          "args": {
            "a": "1",
            "b": "1",
            "c": "-6"
          }
        },
        {
          "id": "b2",
          "op": "SOURCE_LINE",
          "args": {
            "a": "1",
            "b": "-1",
            "c": "0"
          }
        }
      ]
    },
    "lineLabels": {
      "b1": "x+y-6=0",
      "b2": "x-y=0"
    },
    "caption": "두 직선 2x-y-3=0, x-2y+3=0의 각의 이등분선은 x+y-6=0과 x-y=0이다."
  }
}
```

```
{
  "sourceQid": "18",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-DISTANCE_ANGLE",
  "conceptClusterKey": null,
  "primaryMethod": "두 직선까지의 거리 공식 |2x-y-3|/sqrt(5)=|x-2y+3|/sqrt(5)에서 +,- 두 경우의 이등분선 x+y-6=0, x-y=0을 구한다.",
  "decisiveStep": "두 직선까지의 거리가 같음을 절댓값 등식으로 세워 두 직선을 모두 구하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "점과 직선 사이의 거리",
    "l4": "거리 공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_POINT_LINE_DISTANCE",
    "templateKey": "TPL_POINT_LINE_DISTANCE_DIRECT",
    "why": "high1.json H1-RPM-064(DIRECT_ACTIVE): 점과 직선 사이 거리 등식으로 각의 이등분선 구함"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자취의 방정식 개념과 점과 직선 사이의 거리 공식을 결합해 두 개의 이등분선을 모두 찾아야 한다.",
  "level": "상",
  "item4slot": {
    "format": "복수 정답",
    "slots": {
      "given": [
        {
          "term": "직선",
          "src": "stem",
          "quote": "두 직선 $2x-y-3=0$, $x-2y+3=0$"
        }
      ],
      "goal": [
        {
          "term": "직선의방정식",
          "src": "stem",
          "quote": "이등분하는 직선의 방정식을"
        }
      ],
      "method": [
        {
          "term": "이등분선",
          "src": "stem",
          "quote": "각을 이등분하는",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q19

- 형식: 서술형  
- 배점: 4



### 발문



다항식 \$x^3-3x^2-4x+12\$를 인수분해하는 과정을 서술하시오. \[4점\]



### 선지



없음



### 정답



\$(x+2)(x-2)(x-3)\$



### 해설



\$P(x)=x^3-3x^2-4x+12\$라 하자. \$P(2)=8-12-8+12=0\$이므로 인수정리에 의하여 \$x-2\$가 \$P(x)\$의 인수이다. 조립제법으로 \$P(x)\$를 \$x-2\$로 나누면 \$P(x)=(x-2)(x^2-x-6)\$ 여기서 \$x^2-x-6=(x+2)(x-3)\$이므로 \$x^3-3x^2-4x+12=(x+2)(x-2)(x-3)\$

```
"NONE"
```

```
"NONE"
```

```
{
  "sourceQid": "19",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-03",
  "subUnitKey": "H15-SA-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리로 P(2)=0을 찾아 조립제법으로 (x-2)(x^2-x-6)을 얻고 이차식을 마저 인수분해한다.",
  "decisiveStep": "P(2)=0으로 일차인수 (x-2)를 찾아 삼차식을 이차식으로 차수 내리는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "공통인수",
    "l4": "단계적 인수분해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 인수정리와 조립제법으로 삼차식 인수분해"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수정리와 조립제법을 이용해 고차다항식을 일차식의 곱으로 인수분해하는 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "format": "서술",
    "slots": {
      "given": [
        {
          "term": "다항식",
          "src": "stem",
          "quote": "다항식 $x^3-3x^2-4x+12$"
        }
      ],
      "goal": [
        {
          "term": "인수분해",
          "src": "stem",
          "quote": "인수분해하는 과정을 서술하시오."
        }
      ],
      "method": [
        {
          "term": "인수정리",
          "src": "solution",
          "quote": "인수정리에 의하여 $x-2$가 $P(x)$의 인수이다.",
          "evidenceType": "NAMED"
        },
        {
          "term": "조립제법",
          "src": "solution",
          "quote": "조립제법으로 $P(x)$를 $x-2$로 나누면",
          "evidenceType": "NAMED"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q20

- 형식: 서술형  
- 배점: 5



### 발문



다항식 \$P(x)=x^3+ax^2+bx+3\$을 \$x-1\$로 나누었을 때의 나머지가 \$8\$, \$x+1\$로 나누었을 때의 나머지가 \$2\$이다. 이때 \$P(x)\$를 \$x^2-1\$로 나누었을 때의 나머지 \$R(x)\$를 구하는 과정을 서술하시오. \[5점\]



### 선지



없음



### 정답



\$R(x)=3x+5\$



### 해설



나머지정리에 의하여 \$P(1)=8\$, \$P(-1)=2\$이다. \$P(1)=1+a+b+3=8 \\implies a+b=4\$ \$P(-1)=-1+a-b+3=2 \\implies a-b=0\$ 두 식을 연립하면 \$a=2\$, \$b=2\$이므로 \$P(x)=x^3+2x^2+2x+3\$이다. \$P(x)\$를 \$x^2-1\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R(x)=mx+n\$ (\$m, n\$은 상수)이라 하면 \$P(x)=(x^2-1)Q(x)+mx+n\$ \$x=1\$을 대입하면 \$m+n=P(1)=8\$, \$x=-1\$을 대입하면 \$-m+n=P(-1)=2\$이므로 두 식을 연립하면 \$m=3\$, \$n=5\$이다. 따라서 구하는 나머지는 \$R(x)=3x+5\$이다.

```
"NONE"
```

```
"NONE"
```

```
{
  "sourceQid": "20",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-02",
  "subUnitKey": "H15-SA-02-REMAINDER_FACTOR",
  "conceptClusterKey": null,
  "primaryMethod": "나머지정리 P(1)=8, P(-1)=2로 a=2, b=2를 구하고 이차식 x^2-1로 나눈 일차 나머지 R(x)=3x+5를 결정한다.",
  "decisiveStep": "P(1), P(-1)의 값을 x^2-1=(x-1)(x+1) 나눗셈 항등식에 다시 대입해 R(x)=mx+n을 구하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "나머지정리",
    "l4": "고차식 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_REMAINDER_THEOREM",
    "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR",
    "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나머지정리 P(1), P(-1) 연립으로 이차식 나머지 구함"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나머지정리 연립방정식을 두 번 적용해 미정계수와 이차식 나눗셈 나머지를 구해야 한다.",
  "level": "상",
  "item4slot": {
    "format": "서술",
    "slots": {
      "given": [
        {
          "term": "다항식",
          "src": "stem",
          "quote": "다항식 $P(x)=x^3+ax^2+bx+3$"
        }
      ],
      "goal": [
        {
          "term": "나머지",
          "src": "stem",
          "quote": "나머지 $R(x)$를 구하는 과정을 서술하시오."
        }
      ],
      "method": [
        {
          "term": "나머지정리",
          "src": "solution",
          "quote": "나머지정리에 의하여 $P(1)=8$, $P(-1)=2$이다.",
          "evidenceType": "NAMED"
        },
        {
          "term": "연립방정식",
          "src": "solution",
          "quote": "두 식을 연립하면 $a=2$, $b=2$이므로",
          "evidenceType": "IMPLIED",
          "justification": "P(1)=8과 P(-1)=2 두 식을 연립방정식으로 풀어 a, b를 구함"
        }
      ],
      "condition": []
    }
  },
  "hold": ""
}
```

## Q21

- 형식: 서술형  
- 배점: 5



### 발문



두 직선 \$l:3x-4y+12=0\$, \$m:ax+3y-12=0\$이 서로 수직일 때, 두 직선 \$l, m\$의 교점을 지나고 두 직선과 \$x\$축이 이루는 삼각형의 넓이를 이등분하는 직선의 방정식을 구하는 과정을 서술하시오. \[5점\]



### 선지



없음



### 정답



\$24x-7y+12=0\$



### 해설



직선 \$l\$의 기울기는 \$\\frac{3}{4}\$, 직선 \$m\$의 기울기는 \$-\\frac{a}{3}\$이다. 두 직선이 서로 수직이므로 \$\\frac{3}{4}\\left(-\\frac{a}{3}\\right)=-1 \\implies a=4\$ 따라서 \$m:4x+3y-12=0\$이다. 두 직선 \$l, m\$과 \$x\$축의 교점을 각각 \$A, B\$, 두 직선 \$l, m\$의 교점을 \$C\$라 하자. \$y=0\$을 대입하면 \$A(-4, 0)\$, \$B(3, 0)\$이고, \$3x-4y=-12\$, \$4x+3y=12\$를 연립하면 \$C\\left(\\frac{12}{25}, \\frac{84}{25}\\right)\$이다. 꼭짓점 \$C\$를 지나고 \$\\triangle ABC\$의 넓이를 이등분하는 직선은 변 \$AB\$의 중점 \$M\$을 지나므로 \$M\\left(\\frac{-4+3}{2}, 0\\right)=M\\left(-\\frac{1}{2}, 0\\right)\$ 두 점 \$M\\left(-\\frac{1}{2}, 0\\right)\$, \$C\\left(\\frac{12}{25}, \\frac{84}{25}\\right)\$를 지나는 직선의 기울기는 \$\\frac{\\frac{84}{25}-0}{\\frac{12}{25}-\\left(-\\frac{1}{2}\\right)}=\\frac{\\frac{84}{25}}{\\frac{49}{50}}=\\frac{168}{49}=\\frac{24}{7}\$ 따라서 구하는 직선의 방정식은 \$y=\\frac{24}{7}\\left(x+\\frac{1}{2}\\right)\$, 즉 \$24x-7y+12=0\$이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 수직인 두 직선과 삼각형의 중선 그림을 제시한다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "nodes": [
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "args": {
            "x": "-4",
            "y": "0"
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "args": {
            "x": "3",
            "y": "0"
          }
        },
        {
          "id": "l",
          "op": "SOURCE_LINE",
          "args": {
            "a": "3",
            "b": "-4",
            "c": "12"
          }
        },
        {
          "id": "m",
          "op": "SOURCE_LINE",
          "args": {
            "a": "4",
            "b": "3",
            "c": "-12"
          }
        },
        {
          "id": "C",
          "op": "INTERSECTION",
          "inputs": [
            "l",
            "m"
          ],
          "args": {}
        },
        {
          "id": "M",
          "op": "MIDPOINT",
          "inputs": [
            "A",
            "B"
          ],
          "args": {}
        },
        {
          "id": "CM",
          "op": "JOIN",
          "inputs": [
            "C",
            "M"
          ],
          "args": {}
        }
      ]
    },
    "caption": "교점 C와 변 AB의 중점 M(-1/2, 0)을 잇는 직선 24x-7y+12=0이 삼각형 ABC의 넓이를 이등분한다."
  }
}
```

```
"NONE"
```

```
{
  "sourceQid": "21",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-10",
  "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR",
  "conceptClusterKey": null,
  "primaryMethod": "수직 조건으로 a=4를 구하고 교점 C(12/25, 84/25)와 x절편 중점 M(-1/2, 0)을 잇는 직선 24x-7y+12=0을 구한다.",
  "decisiveStep": "삼각형의 꼭짓점 C를 지나 넓이를 이등분하는 직선이 대변 AB의 중점 M을 지남을 이용하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "직선의 방정식",
    "l3": "두 직선의 위치 관계",
    "l4": "수직"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LINE_RELATION",
    "templateKey": "TPL_RELATION_PERPENDICULAR_PARAMETER",
    "why": "high1.json H1-RPM-062(DIRECT_ACTIVE): 직선 수직 조건과 교점·중점 잇는 직선 작성"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 직선의 수직 조건, 교점, x절편, 중점, 두 점을 지나는 직선을 모두 정확히 연쇄 계산해야 한다.",
  "level": "상",
  "item4slot": {
    "format": "서술",
    "slots": {
      "given": [
        {
          "term": "직선",
          "src": "stem",
          "quote": "두 직선 $l:3x-4y+12=0$, $m:ax+3y-12=0$"
        }
      ],
      "goal": [
        {
          "term": "직선의방정식",
          "src": "stem",
          "quote": "넓이를 이등분하는 직선의 방정식을 구하는 과정을 서술하시오."
        }
      ],
      "method": [
        {
          "term": "기울기",
          "src": "solution",
          "quote": "직선 $l$의 기울기는",
          "evidenceType": "NAMED"
        },
        {
          "term": "중점",
          "src": "solution",
          "quote": "변 $AB$의 중점 $M$을 지나므로",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "삼각형",
          "src": "stem",
          "quote": "삼각형의 넓이를"
        }
      ]
    }
  },
  "hold": ""
}
```

## Q22

- 형식: 서술형  
- 배점: 6



### 발문



\$\\overline{AB}=\\overline{AC}\$인 삼각형 \$ABC\$의 무게중심 \$G\$에 대하여 \$\\overline{AG}=\\frac{2\\sqrt{2}}{3}\$이다. 선분 \$AB\$를 \$3:2\$로 외분하는 점을 \$D(1, 5)\$, 선분 \$AC\$를 \$3:2\$로 외분하는 점을 \$E(5, 1)\$이라 할 때, 점 \$A\$의 좌표를 구하는 과정을 서술하시오. (단, 점 \$A\$는 제\$1\$사분면 위의 점이다.) \[6점\]



### 선지



없음



### 정답



\$(6, 6)\$



### 해설



점 \$D\$가 선분 \$AB\$를 \$3:2\$로 외분하므로 \$D=3B-2A \\implies B=\\frac{D+2A}{3}\$이고, 점 \$E\$가 선분 \$AC\$를 \$3:2\$로 외분하므로 \$E=3C-2A \\implies C=\\frac{E+2A}{3}\$이다. \$\\overline{AB}=\\overline{AC}\$이므로 \$\\overline{AD}=\\overline{AE}\$가 되어 점 \$A\$는 선분 \$DE\$의 수직이등분선 위에 있다. \$D(1, 5)\$, \$E(5, 1)\$의 중점을 \$H\$라 하면 \$H(3, 3)\$이고, 직선 \$DE\$의 기울기가 \$\\frac{1-5}{5-1}=-1\$이므로 수직이등분선의 방정식은 \$y-3=1(x-3)\$, 즉 \$y=x\$이다. 한편 변 \$BC\$의 중점을 \$M\$이라 하면 무게중심의 성질 \$\\overline{AG}:\\overline{GM}=2:1\$에서 \$\\overline{AM}=\\frac{3}{2}\\overline{AG}=\\sqrt{2}\$이다. 또한 \$M=\\frac{B+C}{2}=\\frac{4A+D+E}{6}=\\frac{2A+H}{3}\$이므로 \$M-A=\\frac{H-A}{3}\$이다. 따라서 \$\\overline{AH}=3\\overline{AM}=3\\sqrt{2}\$이다. 점 \$A\$가 직선 \$y=x\$ 위에 있으므로 \$A(t, t)\$ (\$t \> 0\$)라 하면 \$\\overline{AH}=\\sqrt{(t-3)^2+(t-3)^2}=3\\sqrt{2} \\implies 2(t-3)^2=18 \\implies (t-3)^2=9\$ \$t=6\$ 또는 \$t=0\$인데, 점 \$A\$는 제\$1\$사분면 위의 점이므로 \$t=6\$이다. 따라서 구하는 점 \$A\$의 좌표는 \$(6, 6)\$이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 선분 DE의 수직이등분선과 원 위의 점 A를 제시한다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "nodes": [
        {
          "id": "D",
          "op": "SOURCE_POINT",
          "args": {
            "x": "1",
            "y": "5"
          }
        },
        {
          "id": "E",
          "op": "SOURCE_POINT",
          "args": {
            "x": "5",
            "y": "1"
          }
        },
        {
          "id": "H",
          "op": "MIDPOINT",
          "inputs": [
            "D",
            "E"
          ],
          "args": {}
        },
        {
          "id": "DE",
          "op": "SEGMENT",
          "inputs": [
            "D",
            "E"
          ],
          "args": {}
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "args": {
            "x": "6",
            "y": "6"
          }
        },
        {
          "id": "HA",
          "op": "SEGMENT",
          "inputs": [
            "H",
            "A"
          ],
          "args": {}
        }
      ]
    },
    "caption": "DE의 중점 H(3, 3)에서 수직이등분선 y=x 위의 거리 3*sqrt(2)인 제1사분면의 점 A(6, 6)"
  }
}
```

```
"NONE"
```

```
{
  "sourceQid": "22",
  "variationType": "NUMERIC",
  "standardCourse": "수학(상)",
  "courseKey": "H15-SA",
  "curriculum": "2015",
  "standardUnitKey": "H15-SA-09",
  "subUnitKey": "H15-SA-09-TRIANGLE_CENTROID_AREA",
  "conceptClusterKey": null,
  "primaryMethod": "외분 관계로 B, C를 A, D, E로 표현해 A가 DE의 수직이등분선 y=x 위에 있음을 보이고, 무게중심 비로 AH=3*sqrt(2)를 구해 A(6,6)을 찾는다.",
  "decisiveStep": "M-A=(H-A)/3 관계를 도출해 AH=3*AM=3*sqrt(2)를 수직이등분선 y=x와 연립하는 단계",
  "rpm": {
    "majorUnit": "도형의 방정식",
    "midUnit": "평면좌표",
    "l3": "삼각형의 무게중심",
    "l4": "좌표 도형 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COORD_CENTROID",
    "templateKey": "TPL_CENTROID_APPLICATION",
    "why": "high1.json H1-RPM-058(DIRECT_ACTIVE): 외분 관계·수직이등분선·무게중심 비 결합"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외분점 벡터 관계, 이등변삼각형 수직이등분선, 무게중심 길이 비를 모두 결합하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "format": "서술",
    "slots": {
      "given": [
        {
          "term": "삼각형",
          "src": "stem",
          "quote": "삼각형 $ABC$의"
        }
      ],
      "goal": [
        {
          "term": "좌표",
          "src": "stem",
          "quote": "점 $A$의 좌표를 구하는 과정을 서술하시오."
        }
      ],
      "method": [
        {
          "term": "외분",
          "src": "solution",
          "quote": "선분 $AB$를 $3:2$로 외분하므로",
          "evidenceType": "IMPLIED",
          "justification": "외분점 공식으로 B, C를 A, D, E로 표현함"
        },
        {
          "term": "무게중심",
          "src": "stem",
          "quote": "무게중심 $G$에 대하여",
          "evidenceType": "NAMED"
        },
        {
          "term": "수직이등분선",
          "src": "solution",
          "quote": "수직이등분선 위에 있다.",
          "evidenceType": "NAMED"
        }
      ],
      "condition": [
        {
          "term": "사분면",
          "src": "stem",
          "quote": "제$1$사분면 위의 점이다."
        }
      ]
    }
  },
  "hold": ""
}
```

