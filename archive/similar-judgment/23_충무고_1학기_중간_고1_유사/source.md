

```
{"stem": "23_충무고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 21, "totalScore": 100.0, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 4.4

### 발문

이차함수 \$y=-x^2-6x+2\$의 최댓값을 \$M\$, 이차함수 \$y=x^2-4x-3\$의 최솟값을 \$m\$이라 할 때, \$M+m\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

두 이차함수를 각각 완전제곱식으로 변형하면 \$y=-x^2-6x+2=-(x+3)^2+11\$이므로 최댓값은 \$M=11\$이다. \$y=x^2-4x-3=(x-2)^2-7\$이므로 최솟값은 \$m=-7\$이다. 따라서 \$M+m=11+(-7)=4\$이다. 그러므로 정답은 ③이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 포물선의 꼭짓점을 비교한다."
  },
  "solution": {
    "capability": "composite-panels-v1",
    "panels": [
      {
        "capability": "polynomial-spike-v1",
        "graphPlan": {
          "family": "polynomial",
          "coefficients": [
            "2",
            "-6",
            "-1"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          },
          "domain": [
            -7,
            1
          ],
          "viewport": [
            -7,
            1,
            -2,
            13
          ],
          "requiredPoints": [
            {
              "id": "M",
              "x": -3,
              "y": 11
            }
          ],
          "axisTickValues": {
            "x": [
              -3
            ],
            "y": [
              11
            ]
          }
        },
        "caption": "y=-(x+3)^2+11의 최댓값은 M=11"
      },
      {
        "capability": "polynomial-spike-v1",
        "graphPlan": {
          "family": "polynomial",
          "coefficients": [
            "-3",
            "-4",
            "1"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          },
          "domain": [
            -2,
            6
          ],
          "viewport": [
            -2,
            6,
            -9,
            5
          ],
          "requiredPoints": [
            {
              "id": "m",
              "x": 2,
              "y": -7
            }
          ],
          "axisTickValues": {
            "x": [
              2
            ],
            "y": [
              -7
            ]
          }
        },
        "caption": "y=(x-2)^2-7의 최솟값은 m=-7"
      }
    ],
    "caption": "두 이차함수의 꼭짓점에서 M=11, m=-7을 구한다."
  }
}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "두 이차함수를 각각 표준형으로 고쳐 꼭짓점에서 최댓값 M=11과 최솟값 m=-7을 구한다.", "decisiveStep": "위로 볼록·아래로 볼록 포물선을 완전제곱식으로 고쳐 M, m을 구하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 두 이차함수 표준형 변환 후 최대·최소 합산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수 두 개를 각각 완전제곱식으로 변형해 꼭짓점의 y좌표를 더하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2-6x+2$"}], "goal": [{"term": "합", "src": "stem", "quote": "$M+m$의 값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4.4

### 발문

이차함수 \$y=x^2+ax+b\$의 그래프와 \$x\$축이 만나는 두 점의 \$x\$좌표가 \$-2, 4\$일 때, 두 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$-10\$ ② \$-8\$ ③ \$-6\$ ④ \$6\$ ⑤ \$10\$

### 정답

①

### 해설

이차함수의 그래프가 \$x\$축과 만나는 두 점의 \$x\$좌표가 \$-2, 4\$이므로 이차방정식 \$x^2+ax+b=0\$의 두 근이 \$-2, 4\$이다. 근과 계수의 관계에 의하여 \$-a=-2+4=2 \\implies a=-2\$, \$b=(-2)\\cdot 4=-8\$ 따라서 \$a+b=-2+(-8)=-10\$이다. 그러므로 정답은 ①이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 x절편을 지나는 포물선을 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "-8",
        "-2",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -4,
        6
      ],
      "viewport": [
        -4,
        6,
        -10,
        6
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -2,
          "y": 0
        },
        {
          "id": "B",
          "x": 4,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          4
        ],
        "y": []
      }
    },
    "caption": "x축과 (-2, 0), (4, 0)에서 만나는 포물선 y=x^2-2x-8"
  }
}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "x축 교점 -2, 4를 이차방정식 x^2+ax+b=0의 두 근으로 보고 근과 계수의 관계로 a=-2, b=-8을 구한다.", "decisiveStep": "x절편을 방정식의 두 근으로 연결하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): x축 교점을 근으로 보고 근과 계수의 관계 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 x절편과 이차방정식의 근의 관계를 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+b$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "두 상수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.4

### 발문

\$x\$에 대한 이차방정식 \$x^2-2(k+2)x+k^2+16=0\$이 서로 다른 두 허근을 갖도록 하는 모든 자연수 \$k\$의 개수는?

### 선지

① \$1\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$2\$

### 정답

⑤

### 해설

이차방정식이 서로 다른 두 허근을 가지려면 판별식 \$D \< 0\$이어야 한다. \$\\frac{D}{4}=(k+2)^2-(k^2+16)=4k-12 \< 0 \\implies k \< 3\$ \$k\$는 자연수이므로 가능한 값은 \$1, 2\$의 \$2\$개이다. 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 D/4=4k-12<0에서 k<3을 얻고 자연수 조건으로 k=1, 2(2개)를 센다.", "decisiveStep": "판별식에서 k^2이 소거된 일차부등식 k<3의 자연수 해를 세는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 허근 조건 판별식 D/4<0 만족 자연수 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허근 조건 D<0을 계산해 자연수 개수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "개수", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2(k+2)x+k^2+16=0$"}], "goal": [{"term": "개수", "src": "stem", "quote": "모든 자연수 $k$의 개수는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D < 0$이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$"}]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$3x^3+4x^2-x-2\$를 인수분해하면 \$(x+a)^2(bx+c)\$일 때, \$a+b+c\$의 값은? (단, \$a, b, c\$는 상수이다.)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

\$P(x)=3x^3+4x^2-x-2\$라 하면 \$P(-1)=-3+4+1-2=0\$이므로 \$x+1\$이 인수이다. 조립제법으로 나누면 \$P(x)=(x+1)(3x^2+x-2)=(x+1)^2(3x-2)\$ 따라서 \$a=1\$, \$b=3\$, \$c=-2\$이므로 \$a+b+c=1+3+(-2)=2\$이다. 그러므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "인수정리 P(-1)=0으로 x+1을 찾고 조립제법으로 (x+1)^2(3x-2)로 인수분해해 a+b+c=2를 구한다.", "decisiveStep": "P(-1)=0을 찾아 조립제법으로 이차식을 분리한 뒤 완전제곱 인수를 확인하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 인수정리와 조립제법으로 삼차식 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리와 조립제법으로 삼차식을 인수분해하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $3x^3+4x^2-x-2$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면", "evidenceType": "NAMED"}, {"term": "조립제법", "src": "solution", "quote": "조립제법으로 나누면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b, c$는 상수이다."}]}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.4

### 발문

\$x-y=3\$, \$x^2+y^2=13\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$27\$ ② \$33\$ ③ \$39\$ ④ \$45\$ ⑤ \$51\$

### 정답

④

### 해설

\$(x-y)^2=x^2-2xy+y^2\$이므로 \$3^2=13-2xy \\implies 2xy=4 \\implies xy=2\$이다. 곱셈공식의 변형에 의하여 \$x^3-y^3=(x-y)^3+3xy(x-y)=3^3+3\\cdot 2\\cdot 3=27+18=45\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "(x-y)^2=x^2-2xy+y^2으로 xy=2를 구한 뒤 x^3-y^3=(x-y)^3+3xy(x-y)에 대입한다.", "decisiveStep": "xy=2를 먼저 역산하여 세제곱 차 변형 공식에 대입하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈공식 변형으로 xy 구한 뒤 x^3-y^3 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱셈공식 변형을 두 번 순차 적용하는 기본 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "값", "src": "stem", "quote": "$x-y=3$, $x^2+y^2=13$일 때"}], "goal": [{"term": "차", "src": "stem", "quote": "$x^3-y^3$의 값은?"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈공식의 변형에 의하여", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.4

### 발문

모든 실수 \$x\$에 대하여 \$(x^2+3x-4)^3=a\_6 x^6+a\_5 x^5+a\_4 x^4+\\cdots+a\_1 x+a\_0\$ 이 성립할 때, \$a\_0+a\_2+a\_4+a\_6\$의 값은?

### 선지

① \$-108\$ ② \$-54\$ ③ \$0\$ ④ \$54\$ ⑤ \$108\$

### 정답

①

### 해설

\$P(x)=(x^2+3x-4)^3\$이라 하자. \$x=1\$을 대입하면 \$P(1)=(1+3-4)^3=0=a\_0+a\_1+a\_2+\\cdots+a\_6\$ \$x=-1\$을 대입하면 \$P(-1)=(1-3-4)^3=(-6)^3=-216=a\_0-a\_1+a\_2-\\cdots+a\_6\$ 두 식을 더하면 \$2(a\_0+a\_2+a\_4+a\_6)=0+(-216)=-216\$이므로 \$a\_0+a\_2+a\_4+a\_6=-108\$이다. 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식에 x=1, x=-1을 대입한 P(1)=0, P(-1)=-216을 더해 2로 나누어 짝수 차수 계수 합을 구한다.", "decisiveStep": "수치대입법으로 P(1)과 P(-1)을 구해 홀수 차수를 소거하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식 수치대입 x=1, -1로 짝수 차수 계수 합 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B23", "difficultyReason": "항등식에서 짝수 차수 계수만 남기기 위해 x=+-1을 대입하여 연립해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여"}], "goal": [{"term": "합", "src": "stem", "quote": "$a_0+a_2+a_4+a_6$의 값은?"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "$x=1$을 대입하면", "evidenceType": "IMPLIED", "justification": "x=1과 x=-1을 대입하는 수치대입법을 사용함"}], "condition": []}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$(x^2+2x+1)(x+a)(x+b)\$의 전개식에서 \$x^3\$의 계수가 \$5\$이고, \$x^2\$의 계수가 \$11\$일 때, \$a^3+b^3\$의 값은? (단, \$a, b\$는 상수이다.) \[4.2점\]

### 선지

① \$-27\$ ② \$-18\$ ③ \$-9\$ ④ \$9\$ ⑤ \$18\$

### 정답

③

### 해설

\$(x+a)(x+b)=x^2+(a+b)x+ab\$이므로 \$(x^2+2x+1){x^2+(a+b)x+ab}\$ 에서 \$x^3\$의 계수는 \$(a+b)+2=5 \\implies a+b=3\$이고, \$x^2\$의 계수는 \$ab+2(a+b)+1=11 \\implies ab+6+1=11 \\implies ab=4\$이다. 따라서 \$a^3+b^3=(a+b)^3-3ab(a+b)=3^3-3\\cdot 4\\cdot 3=27-36=-9\$ 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "전개식 x^3, x^2 계수로 a+b=3, ab=4를 구하고 곱셈공식 변형으로 a^3+b^3=-9를 계산한다.", "decisiveStep": "전체 전개 없이 필요한 x^3, x^2 계수만 추출해 합과 곱을 구하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "고차식 전개"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-004(DIRECT_ACTIVE): 전개식 계수로 a+b, ab 구해 세제곱 합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B23", "difficultyReason": "다항식 계수 비교로 대칭식 a+b, ab를 구한 뒤 세제곱 합 공식에 대입해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x^2+2x+1)(x+a)(x+b)$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a^3+b^3$의 값은?"}], "method": [{"term": "계수비교", "src": "stem", "quote": "$x^3$의 계수가 $5$이고", "evidenceType": "IMPLIED", "justification": "전개식의 특정 차수 계수를 비교해 a+b와 ab를 구함"}, {"term": "곱셈공식", "src": "solution", "quote": "(a+b)^3-3ab(a+b)", "evidenceType": "IMPLIED", "justification": "세제곱 합 곱셈공식 변형을 적용함"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b$는 상수이다."}]}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$f(x)\$를 \$x-1\$로 나누었을 때의 나머지가 \$5\$이고, \$(x-2)^2\$으로 나누었을 때의 나머지가 \$3x-4\$이다. \$f(x)\$를 \$(x-1)(x-2)^2\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(1)\$의 값은?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

②

### 해설

\$f(x)\$를 \$(x-1)(x-2)^2\$으로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R(x)\$라 하면 \$f(x)=(x-1)(x-2)^2Q(x)+R(x)\$ 양변에 \$x=1\$을 대입하면 \$R(1)=f(1)\$이다. 한편 \$f(x)\$를 \$x-1\$로 나누었을 때의 나머지가 \$5\$이므로 나머지정리에 의하여 \$f(1)=5\$이다. 따라서 \$R(1)=5\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나눗셈 항등식 f(x)=(x-1)(x-2)^2Q(x)+R(x)에 x=1을 대입해 R(1)=f(1)=5를 바로 구한다.", "decisiveStep": "R(x) 전체를 구하지 않고 x=1 대입만으로 R(1)=f(1)을 얻는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나눗셈 항등식 수치대입 x=1로 R(1)=f(1) 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 항등식에 x=1을 대입하면 나머지 R(1)이 f(1)과 같음을 바로 파악할 수 있다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$R(1)$의 값은?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여 $f(1)=5$이다.", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 중 \$a^2+b^2+3c^2+2ab-4bc-4ca\$의 인수인 것은?

### 선지

① \$a-b+3c\$ ② \$a+b+2c\$ ③ \$a-b-3c\$ ④ \$a+b+c\$ ⑤ \$a+b-3c\$

### 정답

⑤

### 해설

주어진 식을 완전제곱식의 차로 변형하면 \$\\begin{aligned} a^2+b^2+3c^2+2ab-4bc-4ca &= (a^2+b^2+4c^2+2ab-4bc-4ca)-c^2 \\ &= (a+b-2c)^2-c^2 \\ &= (a+b-2c-c)(a+b-2c+c) \\ &= (a+b-3c)(a+b-c) \\end{aligned}\$ 따라서 인수인 것은 \$a+b-3c\$이고, 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "3c^2을 4c^2-c^2으로 쪼개어 (a+b-2c)^2-c^2으로 만들고 합차공식으로 인수분해한다.", "decisiveStep": "3c^2을 4c^2-c^2으로 분리해 세 항 완전제곱식을 완성하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 항 분리 후 완전제곱·합차공식 단계적 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상수항 계수를 분리해 완전제곱식의 차(합차공식)를 만드는 표준 인수분해 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "solution", "quote": "주어진 식을"}], "goal": [{"term": "인수", "src": "stem", "quote": "인수인 것은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식의 차로 변형하면", "evidenceType": "NAMED"}, {"term": "인수분해", "src": "solution", "quote": "(a+b-3c)(a+b-c)", "evidenceType": "IMPLIED", "justification": "합차공식으로 두 일차식의 곱으로 인수분해함"}], "condition": []}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.4

### 발문

\$x\$에 대한 이차방정식 \$x^2-(2ak+b)x+k^2+2ck+16=0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 가질 때, \$a+b+c\$의 값은? (단, \$a, b, c\$는 양의 실수이다.)

### 선지

① \$10\$ ② \$11\$ ③ \$12\$ ④ \$13\$ ⑤ \$14\$

### 정답

④

### 해설

주어진 이차방정식이 중근을 가지므로 판별식 \$D=0\$이어야 한다. \$\\begin{aligned} D &= (2ak+b)^2-4(k^2+2ck+16) \\ &= (4a^2-4)k^2+(4ab-8c)k+(b^2-64) \= 0 \\end{aligned}\$ 이 식이 실수 \$k\$의 값에 관계없이 항상 성립하므로 \$k\$에 대한 항등식이다. \$4a^2-4=0\$에서 \$a \> 0\$이므로 \$a=1\$ \$b^2-64=0\$에서 \$b \> 0\$이므로 \$b=8\$ \$4ab-8c=0\$에서 \$32-8c=0 \\implies c=4\$ 따라서 \$a+b+c=1+8+4=13\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "판별식 D=0을 k에 대한 내림차순 이차식으로 정리해 항등식 계수비교로 양수 a=1, b=8, c=4를 구한다.", "decisiveStep": "판별식 D를 k의 이차항·일차항·상수항으로 묶어 각 계수를 0으로 두는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 판별식 D=0을 k에 대한 항등식으로 계수비교"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "중근 조건(판별식)과 k에 대한 항등식 계수비교를 순차 결합해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(2ak+b)x+k^2+2ck+16=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 한다.", "evidenceType": "NAMED"}, {"term": "항등식", "src": "solution", "quote": "$k$에 대한 항등식이다.", "evidenceType": "NAMED"}], "condition": [{"term": "중근", "src": "stem", "quote": "항상 중근을 가질 때"}, {"term": "양수", "src": "stem", "quote": "$a, b, c$는 양의 실수이다."}]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.4

### 발문

복소수 \$z=\\frac{1+i}{1-i}\$에 대하여 \$f(n)=z^n\$이라 할 때, \$f(1)+f(2)+f(3)+\\cdots+f(n)=i\$를 만족시키는 \$80\$ 이하의 자연수 \$n\$의 개수는? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$20\$ ② \$19\$ ③ \$21\$ ④ \$24\$ ⑤ \$25\$

### 정답

①

### 해설

\$z=\\frac{1+i}{1-i}=\\frac{(1+i)^2}{(1-i)(1+i)}=\\frac{2i}{2}=i\$이다. 따라서 \$f(n)=i^n\$이므로 \$i, \-1, \-i, 1\$이 주기 \$4\$로 반복되고 연속한 \$4\$개 항의 합은 \$0\$이다. 그러므로 \$f(1)+f(2)+\\cdots+f(n)=i\$가 되려면 \$n\$을 \$4\$로 나누었을 때의 나머지가 \$1\$이어야 한다. \$80\$ 이하의 자연수 중 \$n=4m+1\$ (\$m\$은 \$0\$ 이상의 정수) 꼴은 \$1, 5, 9, \\ldots, 77\$로 모두 \$20\$개이다. 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 유리화로 z=i를 구하고 i^n의 4주기를 이용해 합이 i가 되는 조건 n=1 (mod 4)을 만족하는 80 이하 자연수 개수를 센다.", "decisiveStep": "z=i로 간단히 한 뒤 4개씩 합이 0임을 이용해 나머지가 1인 자연수를 세는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 분모 유리화 후 i^n 4주기로 자연수 개수 셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "복소수 분수 간단히 하기와 거듭제곱 주기성, 자연수 개수 세기를 연결해야 한다.", "level": "중", "item4slot": {"format": "개수", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\frac{1+i}{1-i}$"}], "goal": [{"term": "개수", "src": "stem", "quote": "자연수 $n$의 개수는?"}], "method": [{"term": "유리화", "src": "solution", "quote": "\\frac{(1+i)^2}{(1-i)(1+i)}=\\frac{2i}{2}=i", "evidenceType": "IMPLIED", "justification": "분모와 분자에 1+i를 곱해 복소수 나눗셈을 간단히 함"}, {"term": "거듭제곱", "src": "solution", "quote": "주기 $4$로 반복되고", "evidenceType": "IMPLIED", "justification": "i^n의 4주기 성질을 이용해 합이 i가 되는 n의 조건을 구함"}], "condition": [{"term": "자연수", "src": "stem", "quote": "$80$ 이하의 자연수 $n$"}]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

\$0\$이 아닌 두 실수 \$a, b\$에 대하여 \$\\frac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\frac{a}{b}}\$가 성립할 때, 항상 실근을 갖는 방정식만을 \<보기\>에서 있는 대로 고른 것은? \<보기\> ㄱ. \$x^2+ax+b=0\$ ㄴ. \$ax^2+x+b=0\$ ㄷ. \$ax^2+2ax-b=0\$

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

②

### 해설

\$0\$이 아닌 두 실수 \$a, b\$에 대하여 \$\\frac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\frac{a}{b}}\$가 성립하므로 \$a \> 0\$, \$b \< 0\$이다. ㄱ. \$x^2+ax+b=0\$의 판별식 \$D=a^2-4b\$에서 \$b \< 0\$이므로 \$-4b \> 0 \\implies D \> 0\$ (항상 실근 존재) ㄴ. \$ax^2+x+b=0\$의 판별식 \$D=1-4ab\$에서 \$a \> 0, b \< 0\$이므로 \$-4ab \> 0 \\implies D \> 0\$ (항상 실근 존재) ㄷ. \$ax^2+2ax-b=0\$의 판별식 \$\\frac{D}{4}=a^2+ab=a(a+b)\$는 \$a=1, b=-2\$일 때 음수가 되므로 항상 실근을 갖지는 않는다. 따라서 항상 실근을 갖는 것은 ㄱ, ㄴ이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "12", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "음수 제곱근 나눗셈 부호 조건에서 a>0, b<0을 판정한 뒤 ㄱ, ㄴ, ㄷ의 판별식 부호를 조사한다.", "decisiveStep": "sqrt(a)/sqrt(b)=-sqrt(a/b) 조건에서 a>0, b<0 부호를 확정하고 판별식 D>=0 여부를 판별하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 음수 제곱근 부호 판정 후 판별식 명제 검증"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "음수의 제곱근 나눗셈 부호 조건과 이차방정식 판별식 부호 판정을 결합한 합답형 문항이다.", "level": "상", "item4slot": {"format": "합답형", "slots": {"given": [{"term": "근호", "src": "stem", "quote": "$\\frac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\frac{a}{b}}$"}], "goal": [{"term": "실근", "src": "stem", "quote": "항상 실근을 갖는 방정식만을"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=a^2-4b$에서", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "$0$이 아닌 두 실수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.6

### 발문

이차방정식 \$2x^2-8x+1=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\frac{1}{\\alpha}, \\frac{1}{\\beta}\$을 두 근으로 하고 \$x^2\$의 계수가 \$-1\$인 이차식 \$f(x)\$에 대하여 이차함수 \$y=f(x)\$의 최댓값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

③

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=\\frac{1}{2}\$이다. 새로운 두 근의 합은 \$\\frac{1}{\\alpha}+\\frac{1}{\\beta}=\\frac{\\alpha+\\beta}{\\alpha\\beta}=\\frac{4}{\\frac{1}{2}}=8\$, 곱은 \$\\frac{1}{\\alpha\\beta}=2\$이다. 따라서 \$f(x)=-(x^2-8x+2)=-x^2+8x-2=-(x-4)^2+14\$이므로 최댓값은 \$14\$이다. 그러므로 정답은 ③이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 위로 볼록한 포물선의 꼭짓점을 보여준다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "-2",
        "8",
        "-1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        0,
        8
      ],
      "viewport": [
        0,
        8,
        -2,
        16
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 4,
          "y": 14
        }
      ],
      "axisTickValues": {
        "x": [
          4
        ],
        "y": [
          14
        ]
      }
    },
    "caption": "f(x)=-(x-4)^2+14는 꼭짓점 x=4에서 최댓값 14를 갖는다."
  }
}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 역수 근의 합 8, 곱 2를 구해 f(x)=-(x-4)^2+14를 세워 최댓값 14를 구한다.", "decisiveStep": "역수 두 근의 합·곱으로 이차식 f(x)를 세운 뒤 완전제곱식으로 최댓값을 구하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 근과 계수의 관계로 역수 근 이차함수 작성 및 최댓값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "이차방정식의 역수 근 작성을 거친 뒤 이차함수의 최댓값을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $2x^2-8x+1=0$"}], "goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "완전제곱식", "src": "solution", "quote": "-(x-4)^2+14", "evidenceType": "IMPLIED", "justification": "이차식을 표준형으로 변형해 꼭짓점에서 최댓값을 구함"}], "condition": []}}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 4.6

### 발문

모든 실수 \$x\$에 대하여 등식 \$4x^3-2x^2+3x+\\frac{1}{2}=a\\left(x-\\frac{1}{2}\\right)^3+b\\left(x-\\frac{1}{2}\\right)^2+c\\left(x-\\frac{1}{2}\\right)+d\$ 가 성립할 때, 상수 \$a, b, c, d\$에 대하여 \$ac+b+d\$의 값은?

### 선지

① \$14\$ ② \$16\$ ③ \$18\$ ④ \$20\$ ⑤ \$22\$

### 정답

⑤

### 해설

\$u=x-\\frac{1}{2}\$로 치환하면 \$x=u+\\frac{1}{2}\$이므로 좌변에 대입하여 정리하면 \$\\begin{aligned} 4\\left(u+\\frac{1}{2}\\right)^3-2\\left(u+\\frac{1}{2}\\right)^2+3\\left(u+\\frac{1}{2}\\right)+\\frac{1}{2} &= 4\\left(u^3+\\frac{3}{2}u^2+\\frac{3}{4}u+\\frac{1}{8}\\right)-2\\left(u^2+u+\\frac{1}{4}\\right)+3u+2 \\ &= 4u^3+4u^2+4u+2 \\end{aligned}\$ 계수를 비교하면 \$a=4, b=4, c=4, d=2\$이므로 \$ac+b+d=4\\cdot 4+4+2=22\$ 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "u=x-1/2로 치환하여 좌변을 u의 내림차순으로 전개하고 계수비교로 a=4, b=4, c=4, d=2를 구한다.", "decisiveStep": "u=x-1/2 치환으로 내림차순 계수를 한 번에 구하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 치환 후 내림차순 전개 계수비교"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "(x-1/2)의 거듭제곱 꼴 항등식 계수를 치환 전개로 정확히 계산해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 등식"}], "goal": [{"term": "값", "src": "stem", "quote": "$ac+b+d$의 값은?"}], "method": [{"term": "치환", "src": "solution", "quote": "$u=x-\\frac{1}{2}$로 치환하면", "evidenceType": "NAMED"}, {"term": "계수비교", "src": "solution", "quote": "계수를 비교하면 $a=4, b=4, c=4, d=2$이므로", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수 $a, b, c, d$에 대하여"}]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

좌표평면에서 두 이차함수 \$y=x^2\$, \$y=-\\frac{1}{2}x^2+3x\$의 그래프가 \$x\$축에 수직인 직선과 만나는 두 점을 각각 \$A, B\$라 하자. 점 \$C(k, 0)\$에 대하여 삼각형 \$ABC\$가 정삼각형이 되도록 하는 양수 \$k\$의 값이 \$a+b\\sqrt{3}\$일 때, \$a+b\$의 값은? (단, \$a, b\$는 유리수이다.)

### 선지

① \$24\$ ② \$26\$ ③ \$28\$ ④ \$30\$ ⑤ \$32\$

### 정답

④

### 해설

\$x\$축에 수직인 직선을 \$x=t\$라 하면 \$A(t, t^2)\$, \$B\\left(t, \-\\frac{1}{2}t^2+3t\\right)\$이다. 삼각형 \$ABC\$가 정삼각형이고 꼭짓점 \$C(k, 0)\$이 \$x\$축 위에 있으므로 선분 \$AB\$의 중점의 \$y\$좌표가 \$0\$이어야 한다. \$\\frac{t^2+\\left(-\\frac{1}{2}t^2+3t\\right)}{2}=0 \\implies \\frac{1}{2}t^2+3t=0 \\implies t(t+6)=0\$ \$t=0\$이면 \$A=B\$이므로 \$t=-6\$이다. 이때 \$A(-6, 36)\$, \$B(-6, \-36)\$이므로 \$\\overline{AB}=72\$이고, 정삼각형의 높이는 \$\\frac{\\sqrt{3}}{2}\\cdot 72=36\\sqrt{3}\$이다. \$k \> 0\$이므로 \$k=-6+36\\sqrt{3}\$이고 \$a=-6, b=36\$이므로 \$a+b=30\$이다. 따라서 정답은 ④이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 포물선과 정삼각형 ABC의 배치를 보여준다."
  },
  "solution": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "0",
            "0",
            "1"
          ]
        }
      ],
      "breakpoints": [],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "x^2",
      "referenceCurves": [
        {
          "id": "g",
          "family": "polynomial",
          "coefficients": [
            "0",
            "3",
            "-1/2"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          }
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -6,
          "y": 36
        },
        {
          "id": "B",
          "x": -6,
          "y": -36
        }
      ],
      "axisTickValues": {
        "x": [
          -6
        ],
        "y": []
      }
    },
    "caption": "x=-6에서 두 포물선 위의 점 A(-6, 36), B(-6, -36)과 x축 위의 점 C가 정삼각형을 이룬다."
  }
}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "정삼각형의 대칭성으로 AB의 중점이 x축 위(y=0)에 있음을 이용해 t=-6, AB=72를 구하고 높이 36*sqrt(3)을 더해 k를 구한다.", "decisiveStep": "C(k,0)이 x축 위에 있어 AB 중점의 y좌표가 0이어야 함을 세우는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 정삼각형 대칭성으로 포물선·정삼각형 좌표 결합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "두 이차함수의 세로 선분 조건에 정삼각형 대칭성과 높이를 결합해야 하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $y=x^2$, $y=-\\frac{1}{2}x^2+3x$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "정삼각형", "src": "stem", "quote": "삼각형 $ABC$가 정삼각형이 되도록", "evidenceType": "NAMED"}], "condition": [{"term": "양수", "src": "stem", "quote": "양수 $k$의 값이"}]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

\$0 \\le x \\le 1\$에서 이차함수 \$f(x)=-(x-a)^2+b\$의 최댓값이 \$5\$이다. 두 실수 \$a, b\$에 대하여 \$a+b\$의 최솟값을 \$k\$라 할 때, \$8k\$의 값은?

### 선지

① \$38\$ ② \$34\$ ③ \$36\$ ④ \$40\$ ⑤ \$42\$

### 정답

①

### 해설

위로 볼록한 포물선 \$f(x)=-(x-a)^2+b\$의 대칭축 \$x=a\$의 위치에 따라 최댓값이 달라진다. (i) \$a \< 0\$일 때, 최댓값은 \$f(0)=-a^2+b=5 \\implies b=a^2+5\$ \$a+b=a^2+a+5=\\left(a+\\frac{1}{2}\\right)^2+\\frac{19}{4}\$이므로 \$a=-\\frac{1}{2}\$일 때 최솟값 \$\\frac{19}{4}\$를 갖는다. (ii) \$0 \\le a \\le 1\$일 때, 최댓값은 \$f(a)=b=5\$이므로 \$a+b=a+5 \\ge 5\$ (iii) \$a \> 1\$일 때, 최댓값은 \$f(1)=-(1-a)^2+b=5 \\implies b=(a-1)^2+5\$ \$a+b=a^2-a+6 \> 6\$ 따라서 \$a+b\$의 최솟값은 \$k=\\frac{19}{4}\$이므로 \$8k=8\\cdot\\frac{19}{4}=38\$이다. 그러므로 정답은 ①이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 축이 구간 왼쪽에 있을 때의 그래프를 예시로 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "5",
        "-1",
        "-1"
      ],
      "sourceDomain": {
        "kind": "CLOSED_INTERVAL",
        "range": [
          0,
          1
        ]
      },
      "domain": [
        0,
        1
      ],
      "viewport": [
        -1,
        2,
        2,
        6
      ],
      "requiredPoints": [
        {
          "id": "M",
          "x": 0,
          "y": 5
        }
      ],
      "axisTickValues": {
        "x": [
          0,
          1
        ],
        "y": [
          5
        ]
      }
    },
    "caption": "예: a=-1/2, b=21/4일 때 구간 [0, 1]에서 x=0일 때 최댓값 5를 갖는다."
  }
}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 x=a의 위치를 a<0, 0<=a<=1, a>1 세 구간으로 나누어 b를 a로 표현하고 a+b의 전체 최솟값 19/4를 구한다.", "decisiveStep": "a<0 구간에서 나온 이차식 a^2+a+5의 최솟값 19/4가 다른 두 구간보다 작음을 비교하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 축 위치 3구간 분류 후 최솟값 함수의 최솟값 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "대칭축 위치에 따른 3가지 경우 분류 후 각 경우의 이차식 최솟값을 비교해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-(x-a)^2+b$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "$a+b$의 최솟값을 $k$라 할 때, $8k$의 값은?"}], "method": [{"term": "경우분류", "src": "solution", "quote": "위치에 따라 최댓값이 달라진다.", "evidenceType": "IMPLIED", "justification": "대칭축 a의 위치에 따라 세 구간으로 경우를 분류함"}], "condition": [{"term": "최댓값", "src": "stem", "quote": "최댓값이 $5$이다."}]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.6

### 발문

삼각형 \$ABC\$의 내심 \$I\$를 지나고 선분 \$BC\$에 평행한 직선이 두 선분 \$AB, AC\$와 만나는 점을 각각 \$D, E\$라 하자. \$\\overline{AI}=5\$이고 삼각형 \$ABC\$의 내접원의 반지름의 길이가 \$1\$이며 삼각형 \$ABC\$의 넓이가 \$6\\sqrt{6}\$일 때, \$\\triangle ADE\$의 넓이는 \$\\frac{b}{a}\\sqrt{6}\$이다. \$a+b\$의 값은? (단, \$a\$와 \$b\$는 서로소인 자연수이다.)

### 선지

① \$9\$ ② \$11\$ ③ \$13\$ ④ \$15\$ ⑤ \$17\$

### 정답

②

### 해설

내접원이 변 \$AB\$에 접하는 점을 \$F\$라 하면 \$\\overline{IF}=1\$이고 \$\\angle AFI=90^\\circ\$이므로 직각삼각형 \$AFI\$에서 \$\\overline{AF}=\\sqrt{\\overline{AI}^2-\\overline{IF}^2}=\\sqrt{5^2-1^2}=2\\sqrt{6}\$ 원 밖의 한 점에서 그은 두 접선의 길이가 같으므로 \$\\triangle ABC\$의 반둘레 \$s\$는 \$s=\\overline{AF}+\\overline{BC}=2\\sqrt{6}+\\overline{BC}\$이다. 삼각형의 넓이 공식 \$\\frac{1}{2}r(a+b+c)=rs\$에서 \$6\\sqrt{6}=1\\cdot(2\\sqrt{6}+\\overline{BC}) \\implies \\overline{BC}=4\\sqrt{6}\$이다. 점 \$A\$에서 변 \$BC\$에 내린 높이를 \$h\$라 하면 \$\\frac{1}{2}\\cdot 4\\sqrt{6}\\cdot h=6\\sqrt{6} \\implies h=3\$이다. \$DE \\parallel BC\$이고 \$I\$에서 \$BC\$까지의 거리가 \$1\$이므로 \$A\$에서 \$DE\$까지의 거리는 \$h-1=2\$이다. \$\\triangle ADE \\sim \\triangle ABC\$이고 닮음비가 \$2:3\$이므로 넓이비는 \$4:9\$이다. 따라서 \$\\triangle ADE\$의 넓이는 \$\\frac{4}{9}\\cdot 6\\sqrt{6}=\\frac{8}{3}\\sqrt{6}\$이므로 \$a=3, b=8\$, \$a+b=11\$이다. 그러므로 정답은 ②이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 내접원과 평행선 DE로 인한 닮음을 보여준다."
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mode": "PLANE_FIGURE_v1",
    "planeMarks": {
      "rightAngles": [
        {
          "vertex": "F",
          "rays": [
            "A",
            "I"
          ]
        }
      ],
      "lengths": [
        {
          "from": "A",
          "to": "I",
          "label": "5"
        },
        {
          "from": "I",
          "to": "F",
          "label": "1"
        }
      ]
    },
    "caption": "피타고라스 정리로 AF=2sqrt(6), 넓이로 BC=4sqrt(6)과 높이 3을 구해 닮음비 2:3을 적용한다."
  }
}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "직각삼각형 AFI에서 접선 길이 AF=2sqrt(6)을 구하고 내접원 넓이 공식으로 BC=4sqrt(6), 높이 3을 구해 닮음비 2:3을 적용한다.", "decisiveStep": "내접원 반둘레 관계 s=AF+BC로 BC 길이를 구해 닮음비 (h-r):h=2:3을 도출하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 내접원·직각삼각형 닮음비와 이차식 결합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B45", "difficultyReason": "피타고라스 정리, 내접원 접선 길이·넓이 공식, 평행선 삼각형 닮음비 제곱을 모두 연결해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$의 내심 $I$"}], "goal": [{"term": "넓이", "src": "stem", "quote": "$\\triangle ADE$의 넓이는"}], "method": [{"term": "접선", "src": "solution", "quote": "두 접선의 길이가 같으므로", "evidenceType": "NAMED"}, {"term": "닮음비", "src": "solution", "quote": "닮음비가 $2:3$이므로 넓이비는 $4:9$이다.", "evidenceType": "NAMED"}], "condition": [{"term": "서로소", "src": "stem", "quote": "서로소인 자연수이다."}]}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.4

### 발문

\$x\$에 대한 이차다항식 \$f(x)\$가 다음 조건을 만족시킬 때, \$g(x)\$를 \$x-3\$으로 나누었을 때의 나머지는? (가) \$x^3+4x^2+2x-3\$을 \$f(x)\$로 나누었을 때의 나머지는 \$g(x)\$이다. (나) \$x^3+4x^2+2x-3\$을 \$g(x)\$로 나누었을 때의 나머지는 \$f(x)-x^2-x\$이다.

### 선지

① \$-4\$ ② \$-5\$ ③ \$-6\$ ④ \$-7\$ ⑤ \$-8\$

### 정답

③

### 해설

\$P(x)=x^3+4x^2+2x-3\$이라 하자. \$f(x)\$가 이차식이므로 \$g(x)\$는 일차 이하의 다항식이고, 조건 (나)의 나머지 \$f(x)-x^2-x\$는 \$g(x)\$보다 차수가 낮아야 하므로 상수 \$c\$이다. 따라서 \$f(x)=x^2+x+c\$이다. \$P(x)\$를 \$f(x)=x^2+x+c\$로 직접 나누면 \$P(x)=(x+3)(x^2+x+c)-(c+1)(x+3)\$ 이므로 \$g(x)=-(c+1)(x+3)\$이다. 조건 (나)에서 \$P(x)\$를 \$g(x)\$로 나눈 나머지가 \$c\$이므로 \$x=-3\$을 대입하면 \$c=P(-3)=(-3)^3+4(-3)^2+2(-3)-3=-27+36-6-3=0\$ 따라서 \$g(x)=-(x+3)\$이므로 \$g(x)\$를 \$x-3\$으로 나눈 나머지는 \$g(3)=-(3+3)=-6\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "차수 비교로 f(x)=x^2+x+c를 확정하고 P(x)를 f(x)로 나눈 나머지 g(x)=-(c+1)(x+3)에서 P(-3)=c=0을 구한다.", "decisiveStep": "두 나눗셈의 차수 부등식 deg(f-x^2-x) < deg(g) < 2에서 f(x)-x^2-x=c(상수)를 도출하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 차수 비교 후 다항식 나눗셈 나머지 조건 풀이"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "다항식 나눗셈의 차수 조건을 연쇄 적용해 f(x)와 g(x)의 형태를 모두 역추적해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "이차다항식 $f(x)$"}], "goal": [{"term": "나머지", "src": "stem", "quote": "나머지는?"}], "method": [{"term": "차수", "src": "solution", "quote": "$g(x)$보다 차수가 낮아야 하므로", "evidenceType": "NAMED"}, {"term": "나머지정리", "src": "solution", "quote": "$x=-3$을 대입하면", "evidenceType": "IMPLIED", "justification": "x+3으로 나눈 상수 나머지를 P(-3)으로 구함"}], "condition": []}}, "hold": ""}
```

## Q19

- 형식: 서술형  
- 배점: 6

### 발문

등식 \$(2x+y)-(x-3y)i=5+i\$를 만족시키는 두 실수 \$x, y\$에 대하여 \$x+y\$의 값을 구하는 과정을 서술하시오. (단, \$i=\\sqrt{-1}\$이다.) \[6점\]

### 선지

없음

### 정답

\$3\$

### 해설

\$x, y\$가 실수이므로 복소수가 서로 같을 조건에 의하여 \$2x+y=5\$, \$-(x-3y)=1 \\implies \-x+3y=1\$ 두 식을 연립하여 풀면 \$7y=7 \\implies y=1\$, \$x=2\$이다. 따라서 \$x+y=2+1=3\$이다.

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "복소수의 상등 조건으로 실수부 2x+y=5와 허수부 -x+3y=1을 연립해 x=2, y=1을 구한다.", "decisiveStep": "복소수가 서로 같을 조건으로 실수부·허수부 연립일차방정식을 세우는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022(DIRECT_ACTIVE): 복소수 상등 조건으로 실수부·허수부 연립"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 상등 조건을 적용해 일차연립방정식을 푸는 기본 서술형 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "등식", "src": "stem", "quote": "등식 $(2x+y)-(x-3y)i=5+i$"}], "goal": [{"term": "합", "src": "stem", "quote": "$x+y$의 값을 구하는 과정을 서술하시오."}], "method": [{"term": "연립방정식", "src": "solution", "quote": "두 식을 연립하여 풀면", "evidenceType": "IMPLIED", "justification": "실수부·허수부 비교로 얻은 두 일차방정식을 연립함"}], "condition": [{"term": "실수", "src": "stem", "quote": "두 실수 $x, y$에 대하여"}]}}, "hold": ""}
```

## Q20

- 형식: 서술형  
- 배점: 7

### 발문

이차방정식 \$x^2+x+1=0\$의 두 근 \$\\alpha, \\beta\$에 대하여 이차함수 \$f(x)=x^2+px+q\$가 \$f(-\\alpha-1)=-3\\alpha\$, \$f(\\beta^2)=-3\\beta\$를 만족시킬 때, \$f(2)\$의 값을 구하는 과정을 서술하시오. \[7점\]

### 선지

없음

### 정답

\$16\$

### 해설

\$x^2+x+1=0\$의 두 근이 \$\\alpha, \\beta\$이므로 근과 계수의 관계에 의하여 \$\\alpha+\\beta=-1\$, \$\\alpha\\beta=1\$이고, \$\\alpha^2+\\alpha+1=0\$, \$\\beta^2+\\beta+1=0\$이다. 따라서 \$-\\alpha-1=\\alpha^2=\\beta\$, \$\\beta^2=\\alpha\$이므로 주어진 조건은 \$f(\\beta)=-3\\alpha\$, \$f(\\alpha)=-3\\beta\$ 이때 \$\\alpha=-1-\\beta\$, \$\\beta=-1-\\alpha\$를 대입하면 \$f(\\beta)=3\\beta+3\$, \$f(\\alpha)=3\\alpha+3\$ 즉, 최고차항의 계수가 \$1\$인 이차식 \$f(x)-3x-3\$은 \$\\alpha, \\beta\$를 두 근으로 가지므로 \$f(x)-3x-3=x^2+x+1 \\implies f(x)=x^2+4x+4\$ 따라서 \$f(2)=2^2+4\\cdot 2+4=16\$이다.

```
"NONE"
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "alpha^2+alpha+1=0과 alpha+beta=-1로 조건을 f(alpha)=3alpha+3, f(beta)=3beta+3으로 변형해 f(x)-3x-3=x^2+x+1을 세운다.", "decisiveStep": "f(alpha)=3alpha+3, f(beta)=3beta+3으로부터 방정식 f(x)-3x-3=x^2+x+1을 작성하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): 허근 방정식 차수 낮추기와 인수정리 결합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "두 근의 대칭성과 이차방정식 성질로 문자 통일 후 인수정리 꼴 방정식을 세워야 한다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+x+1=0$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$f(2)$의 값을 구하는 과정을 서술하시오."}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "인수정리", "src": "solution", "quote": "$\\alpha, \\beta$를 두 근으로 가지므로", "evidenceType": "IMPLIED", "justification": "f(x)-3x-3=0의 두 근이 alpha, beta임을 이용해 식을 세움"}], "condition": []}}, "hold": ""}
```

## Q21

- 형식: 서술형  
- 배점: 7

### 발문

세 실수 \$a, b, k\$에 대하여 \$k \\le x \\le k+2\$에서 이차함수 \$f(x)=x^2+ax+b\$의 최댓값을 \$M(k)\$, 최솟값을 \$m(k)\$라 하자. \$M(k)=\\begin{cases} f(k) & (k \\le 0\) \\ f(k+2) & (k \> 0\) \\end{cases}\$이고 \$m(k)\$의 최솟값이 \$3\$일 때, 곡선 \$y=m(k)\$와 직선 \$y=4k+t\$가 오직 한 점에서만 만나도록 하는 실수 \$t\$의 값을 구하는 과정을 서술하시오. \[7점\]

### 선지

없음

### 정답

\$-5\$

### 해설

\$M(k)\$가 \$k=0\$에서 바뀌므로 \$k=0\$일 때 구간 \$\[0, 2\]\$의 양 끝점 함숫값이 같아 축은 중점 \$x=1\$이다. 즉 \$-\\frac{a}{2}=1 \\implies a=-2\$이고, \$f(x)=(x-1)^2+b-1\$이다. \$m(k)\$의 최솟값이 \$3\$이므로 \$b-1=3 \\implies b=4\$이다. 따라서 \$m(k)=\\begin{cases} (k+1)^2+3 & (k \< \-1) \\ 3 & (-1 \\le k \\le 1\) \\ (k-1)^2+3 & (k \> 1\) \\end{cases}\$ \$g(k)=m(k)-4k\$라 하면 곡선과 직선의 교점은 \$g(k)=t\$의 실근과 같고 \$g(k)=\\begin{cases} (k-1)^2+3 & (k \< \-1) \\ 3-4k & (-1 \\le k \\le 1\) \\ (k-3)^2-5 & (k \> 1\) \\end{cases}\$

- \$k \< \-1\$: \$g(k) \> 7\$  
- \$-1 \\le k \\le 1\$: \$g(k)\$는 \$7\$부터 \$-1\$까지 감소  
- \$k \> 1\$: \$g(k)=(k-3)^2-5\$는 \$k=3\$에서 최솟값 \$-5\$를 가짐 따라서 \$g(k)=t\$가 오직 하나의 실근을 갖도록 하는 \$t\$의 값은 오른쪽 구간의 꼭짓점 높이인 \$t=-5\$뿐이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 조각함수 g(k)와 수평선 y=t의 교점을 보여준다."
  },
  "solution": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "4",
            "-2",
            "1"
          ]
        },
        {
          "coefficients": [
            "3",
            "-4",
            "0"
          ]
        },
        {
          "coefficients": [
            "4",
            "-6",
            "1"
          ]
        }
      ],
      "breakpoints": [
        {
          "x": "-1",
          "y": "7"
        },
        {
          "x": "1",
          "y": "-1"
        }
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "m(k)-4k",
      "referenceLines": [
        {
          "id": "t",
          "slope": "0",
          "intercept": "-5"
        }
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 3,
          "y": -5
        }
      ],
      "axisTickValues": {
        "x": [
          -1,
          1,
          3
        ],
        "y": [
          -5,
          -1,
          7
        ]
      }
    },
    "caption": "g(k)=m(k)-4k의 그래프와 직선 y=-5가 점 (3, -5) 한 점에서 만난다."
  }
}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "M(k)의 경계 k=0에서 축 x=1을 구하고 m(k)의 최솟값 3으로 f(x)를 확정한 뒤 g(k)=m(k)-4k의 교점 개수를 분석해 t=-5를 구한다.", "decisiveStep": "조각별 최솟값 함수 m(k)를 세운 뒤 g(k)=m(k)-4k로 치환해 수평선 y=t와의 교점이 1개인 위치를 찾는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 이동 구간 최대·최소 함수와 직선 교점 개수 분석"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B45", "difficultyReason": "구간 이동 이차함수의 최댓값·최솟값 조각함수를 세우고 직선과의 유일 교점 조건을 그래프 개형으로 판별하는 최고난도 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+ax+b$"}], "goal": [{"term": "값", "src": "stem", "quote": "실수 $t$의 값을 구하는 과정을 서술하시오."}], "method": [{"term": "축", "src": "solution", "quote": "축은 중점 $x=1$이다.", "evidenceType": "NAMED"}, {"term": "경우분류", "src": "solution", "quote": "오직 하나의 실근을 갖도록", "evidenceType": "IMPLIED", "justification": "k<-1, -1<=k<=1, k>1 세 구간으로 나누어 g(k)=t의 근 개수를 판정함"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "$m(k)$의 최솟값이 $3$일 때"}]}}, "hold": ""}
```

