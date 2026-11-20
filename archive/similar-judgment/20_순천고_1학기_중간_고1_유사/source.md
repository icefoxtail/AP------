

```
{"stem": "20_순천고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/20_순천고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

두 다항식 \$A=x^2-2x+4\$, \$B=-3x^2+x-1\$에 대하여 \$2A-B\$를 구하면?

### 선지

① \$5x^2-3x+9\$ ② \$5x^2-5x+9\$ ③ \$5x^2-5x+7\$ ④ \$-x^2-5x+9\$ ⑤ \$-x^2-3x+7\$

### 정답

②

### 해설

\$2A \= 2(x^2-2x+4) \= 2x^2-4x+8\$이므로 \$\$ 2A-B \= (2x^2-4x+8)-(-3x^2+x-1) \= 2x^2-4x+8+3x^2-x+1 \= 5x^2-5x+9 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 이차다항식의 상수배와 뺄셈을 동류항 정리로 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$2A=2x^2-4x+8$을 먼저 계산한 뒤 $-B=3x^2-x+1$을 더해 동류항을 정리한다.", "decisiveStep": "$-B$에서 괄호 앞 음수 부호를 세 항 모두에 정확히 분배한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 다항식 2A-B의 덧셈·뺄셈에서 동류항 계수를 정리함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 상수배와 뺄셈을 동류항 정리로 바로 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=x^2-2x+4$"}], "method": [{"term": "동류항", "src": "solution", "quote": "2x^2-4x+8+3x^2-x+1", "evidenceType": "IMPLIED", "justification": "괄호를 푼 뒤 차수별 동류항 계수를 더함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=x^2-2x+4$"}], "condition": []}, "reasons": {"method": "2A를 계산 후 -B를 더해 동류항 정리함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

다음 그림과 같은 직육면체 모양의 상자가 있다. 이 상자의 겉넓이는 \$24,\\mathrm{cm}^2\$이고, 모든 모서리의 길이의 합은 \$28,\\mathrm{cm}\$이다. 이 상자의 대각선 \$AG\$의 길이를 구하면?

### 선지

① \$3,\\mathrm{cm}\$ ② \$4,\\mathrm{cm}\$ ③ \$\\sqrt{21},\\mathrm{cm}\$ ④ \$5,\\mathrm{cm}\$ ⑤ \$6,\\mathrm{cm}\$

### 정답

④

### 해설

직육면체의 가로, 세로, 높이를 각각 \$a, b, c\$라 하면 모든 모서리의 길이의 합은 \$4(a+b+c)=28\$이므로 \$a+b+c=7\$이고, 겉넓이는 \$2(ab+bc+ca)=24\$이다. 대각선 \$AG\$의 길이를 \$d\$라 하면 \$\$ d^2 \= a^2+b^2+c^2 \= (a+b+c)^2-2(ab+bc+ca) \= 7^2-24 \= 49-24 \= 25 \$\$ 이다. \$d\>0\$이므로 \$\\overline{AG}=5,\\mathrm{cm}\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 280", "elements": [{"type": "cuboid_3d", "id": "box_ABCDEFGH", "vertices": ["A", "B", "C", "D", "E", "F", "G", "H"], "diagonal": ["A", "G"]}, {"type": "label", "pos": [180, 240], "text": "$a$"}, {"type": "label", "pos": [290, 195], "text": "$b$"}, {"type": "label", "pos": [300, 110], "text": "$c$"}], "note": "꼭짓점 A에서 맞은편 꼭짓점 G까지의 공간대각선 AG가 표시된 직육면체 상자 도식"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$a+b+c=7$과 $2(ab+bc+ca)=24$를 곱셈 공식 변형 $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)$에 대입해 대각선 길이를 구한다.", "decisiveStep": "모서리 합과 겉넓이 조건에서 대각선 길이 제곱 $a^2+b^2+c^2=25$를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈 공식 변형으로 직육면체 대각선 길이 제곱을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직육면체의 모서리 합·겉넓이 조건에 세 항 합의 제곱 곱셈 공식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대각선", "src": "stem", "quote": "대각선 $AG$의 길이를"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(a+b+c)^2-2(ab+bc+ca)", "evidenceType": "IMPLIED", "justification": "세 수의 합의 제곱 곱셈 공식 변형으로 대각선 길이 제곱을 구함"}], "given": [{"term": "겉넓이", "src": "stem", "quote": "겉넓이는 $24\\,\\mathrm{cm}^2$이고"}], "condition": []}, "reasons": {"method": "모서리 합과 겉넓이에 곱셈 공식 변형을 적용해 대각선 길이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

등식 \$(a+b-4)x+ab-4=0\$이 \$x\$의 값에 관계없이 항상 성립할 때, \$a^3+b^3\$의 값은? (단, \$a, b\$는 상수)

### 선지

① \$16\$ ② \$20\$ ③ \$24\$ ④ \$28\$ ⑤ \$32\$

### 정답

①

### 해설

등식이 \$x\$에 대한 항등식이므로 \$a+b-4=0\$, \$ab-4=0\$, 즉 \$a+b=4\$, \$ab=4\$이다. 따라서 곱셈 공식의 변형에 의하여 \$\$ a^3+b^3 \= (a+b)^3-3ab(a+b) \= 4^3-3\\cdot 4\\cdot 4 \= 64-48 \= 16 \$\$ 이다. (또는 \$(a-b)^2=16-16=0\$에서 \$a=b=2\$이므로 \$2^3+2^3=16\$이다.)

```
{"status": "EXEMPT", "reason": "일차 항등식 조건으로 합과 곱을 구한 뒤 세제곱의 합을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식 조건에서 $a+b=4, ab=4$를 구한 뒤 곱셈 공식의 변형으로 $a^3+b^3$을 계산한다.", "decisiveStep": "$x$의 계수와 상수항을 $0$으로 놓아 $a+b=4, ab=4$를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 항등식 계수비교 후 곱셈 공식 변형으로 a^3+b^3을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차 항등식 계수 비교와 세제곱의 합 곱셈 공식을 연결하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "항등식", "src": "solution", "quote": "항등식이므로", "evidenceType": "NAMED"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $(a+b-4)x+ab-4=0$"}], "condition": []}, "reasons": {"method": "항등식 계수 조건으로 a+b, ab를 구해 a^3+b^3을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.1

### 발문

다음 중 \$x^3-(a-2)x^2-(3a+7)x+4a+4\$의 인수인 것은?

### 선지

① \$x-3a\$ ② \$x+3a\$ ③ \$x-a+1\$ ④ \$x+a+1\$ ⑤ \$x-a-1\$

### 정답

⑤

### 해설

\$P(x)=x^3-(a-2)x^2-(3a+7)x+4a+4\$라 두고 \$x=a+1\$을 대입하면 \$\$ \\begin{aligned} P(a+1) &= (a+1)^3-(a-2)(a+1)^2-(3a+7)(a+1)+4(a+1) \\ &= (a+1)^2{(a+1)-(a-2)}+(-3a-7+4)(a+1) \\ &= 3(a+1)^2-3(a+1)^2 \= 0 \\end{aligned} \$\$ 이다. 인수정리에 의하여 \$x-(a+1)=x-a-1\$은 \$P(x)\$의 인수이다.

```
{"status": "EXEMPT", "reason": "미지수 a가 포함된 삼차다항식에 인수정리를 적용해 일차인수를 판별하는 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "상수항 $4(a+1)$에서 $x=a+1$을 대입해 $P(a+1)=0$임을 보여 인수정리로 인수 $x-a-1$을 찾는다.", "decisiveStep": "$(a+1)$을 공통인수로 묶어 $3(a+1)^2-3(a+1)^2=0$을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "공통인수 묶기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-013(DIRECT_ACTIVE): 인수정리 및 공통인수 (x-a-1)로 다항식을 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 포함된 삼차식에서 $(a+1)$ 구조를 파악해 인수정리를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수인 것은?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "삼차식", "src": "stem", "quote": "x^3-(a-2)x^2-(3a+7)x+4a+4"}], "condition": []}, "reasons": {"method": "P(a+1)=0을 확인해 인수정리로 x-a-1이 인수임을 보임"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.9

### 발문

\$\\left(\\dfrac{1-i}{1+i}\\right)^{202}+\\left(\\dfrac{1+i}{1-i}\\right)^{202}\$을 간단히 하면? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-2i\$ ② \$-1\$ ③ \$-2\$ ④ \$0\$ ⑤ \$2\$

### 정답

③

### 해설

분모를 실수화하면 \$\$ \\dfrac{1-i}{1+i} \= \\dfrac{(1-i)^2}{(1+i)(1-i)} \= \\dfrac{-2i}{2} \= \-i, \\qquad \\dfrac{1+i}{1-i} \= \\dfrac{(1+i)^2}{2} \= i \$\$ 이다. \$i^4=1\$이고 \$202=4\\cdot 50+2\$이므로 \$\$ (-i)^{202}+i^{202} \= (-i)^2+i^2 \= \-1+(-1) \= \-2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 분모 실수화 후 i의 주기 4 성질로 202제곱 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$\\frac{1-i}{1+i}=-i, \\frac{1+i}{1-i}=i$로 간단히 한 뒤 $202=4\\cdot 50+2$를 이용해 $(-i)^2+i^2$을 계산한다.", "decisiveStep": "분모 실수화로 밑을 $-i, i$로 바꾸고 지수 $202$를 $4$로 나눈 나머지 $2$로 줄인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 복소수 분모 실수화 후 i의 거듭제곱 주기성으로 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분모 실수화와 $i$의 주기 $4$ 거듭제곱을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "\\dfrac{1-i}{1+i} = \\dfrac{(1-i)^2}{(1+i)(1-i)}"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 각각 -i, i로 간단히 한 뒤 거듭제곱을 계산함"}], "given": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "condition": []}, "reasons": {"method": "분모 실수화 후 i의 주기 4 성질로 (-i)^202+i^202를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.2

### 발문

방정식 \$x^3=-1\$의 한 허근이 \$\\omega\$일 때, 다음 중 옳지 않은 것은? (단, \$\\bar{\\omega}\$는 \$\\omega\$의 켤레복소수이다.)

### 선지

① \$\\omega^3=-1\$ ② \$\\omega+\\dfrac{1}{\\omega}=-1\$ ③ \$\\omega^2-\\omega+1=0\$ ④ \$\\omega+\\bar{\\omega}=1\$ ⑤ \$1-\\omega+\\omega^2-\\omega^3+\\cdots-\\omega^{15}=1\$

### 정답

②

### 해설

\$x^3+1=(x+1)(x^2-x+1)=0\$이고 \$\\omega\$는 허근이므로 \$\\omega^3=-1\$, \$\\omega^2-\\omega+1=0\$이다.

- ① \$\\omega^3=-1\$ (참)  
- ② \$\\omega^2-\\omega+1=0\$의 양변을 \$\\omega\$로 나누면 \$\\omega-1+\\dfrac{1}{\\omega}=0\$, 즉 \$\\omega+\\dfrac{1}{\\omega}=1\\ne \-1\$이다. (거짓)  
- ③ \$\\omega^2-\\omega+1=0\$ (참)  
- ④ \$\\omega, \\bar{\\omega}\$는 \$x^2-x+1=0\$의 두 근이므로 \$\\omega+\\bar{\\omega}=1\$이다. (참)  
- ⑤ \$1-\\omega+\\omega^2=0\$이고 \$(-1)^k\\omega^k\$가 주기 \$3\$ 부호 교대로 \$3\$항씩 합이 \$0\$이므로 앞의 \$15\$항 합은 \$0\$이고 마지막 항 \$-\\omega^{15}=-(-1)^5=1\$이다. (참) 따라서 옳지 않은 것은 ②이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 x^3=-1의 허근 성질 5가지를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$\\omega^3=-1, \\omega^2-\\omega+1=0$과 이차방정식 근과 계수의 관계를 이용해 다섯 보기의 참·거짓을 판별한다.", "decisiveStep": "②에서 $\\omega^2-\\omega+1=0$을 $\\omega$로 나누면 $\\omega+\\frac{1}{\\omega}=+1$이 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): 방정식 w^3=-1의 허근 성질과 치환·대칭식 관계를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$x^3=-1$의 허근 $\\omega$의 기본 성질과 거듭제곱 교대합을 판별하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근이 $\\omega$일 때"}], "method": [{"term": "인수분해", "src": "solution", "quote": "x^3+1=(x+1)(x^2-x+1)=0", "evidenceType": "IMPLIED", "justification": "x^3+1을 인수분해해 허근이 만족하는 이차식과 켤레근 성질을 적용함"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "방정식 $x^3=-1$"}], "condition": [{"term": "허근", "src": "stem", "quote": "한 허근이 $\\omega$일 때"}]}, "reasons": {"method": "x^3+1 인수분해와 허근 성질로 옳지 않은 보기 ②를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$x^2-2(k-2)x+k^2-8=0\$이 서로 다른 두 실근을 가질 때, 실수 \$k\$의 값의 범위는?

### 선지

① \$k\<3\$ ② \$k\\le 3\$ ③ \$k\>3\$ ④ \$k\<2\$ ⑤ \$k\>2\$

### 정답

①

### 해설

이차방정식이 서로 다른 두 실근을 가지므로 판별식 \$D\>0\$이어야 한다. \$\$ \\dfrac{D}{4} \= (k-2)^2-(k^2-8) \= k^2-4k+4-k^2+8 \= \-4k+12 \> 0 \$\$ 따라서 \$4k\<12\$이므로 \$k\<3\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 서로 다른 두 실근 조건 D>0으로 k의 범위를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=(k-2)^2-(k^2-8)=-4k+12>0$을 풀어 $k<3$을 구한다.", "decisiveStep": "$k^2$항이 소거되어 일차부등식 $-4k+12>0$으로 정리됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식 짝수 판별식 D/4>0으로 실근 조건을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "서로 다른 두 실근 조건에 판별식 $D>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2(k-2)x+k^2-8=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근을 가질 때"}]}, "reasons": {"method": "짝수 판별식 D/4>0을 풀어 k<3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2-2(a+k)x+k^2-6k-3a=0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 가질 때, 실수 \$a\$의 값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

④

### 해설

\$k\$의 값에 관계없이 항상 중근을 가지므로 판별식 \$\\dfrac{D}{4}=0\$이 \$k\$에 대한 항등식이어야 한다. \$\$ \\dfrac{D}{4} \= (a+k)^2-(k^2-6k-3a) \= (2a+6)k+(a^2+3a) \= 0 \$\$ 따라서 \$2a+6=0\$, \$a^2+3a=0\$이므로 \$a=-3\$이다.

```
{"status": "EXEMPT", "reason": "중근 판별식이 k에 대한 항등식이 되도록 실수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=(2a+6)k+(a^2+3a)=0$이 $k$에 대한 항등식이 되도록 $2a+6=0, a^2+3a=0$을 푼다.", "decisiveStep": "$k^2$이 소거된 일차 항등식 $(2a+6)k+(a^2+3a)=0$에서 두 계수를 모두 $0$으로 둔다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 판별식이 k에 대한 항등식이 되도록 계수비교법으로 a를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 판별식과 $k$에 대한 항등식 계수 비교를 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=0$이", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2(a+k)x+k^2-6k-3a=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "항상 중근을 가질 때"}]}, "reasons": {"method": "판별식 D/4=0을 k에 대한 항등식으로 풀어 a=-3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.6

### 발문

이차방정식 \$x^2+6x+4=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$(\\sqrt{\\alpha}+\\sqrt{\\beta})^2\$의 값은?

### 선지

① \$-2\$ ② \$-4\$ ③ \$-6\$ ④ \$-8\$ ⑤ \$-10\$

### 정답

⑤

### 해설

이차방정식 \$x^2+6x+4=0\$의 두 근은 \$x=-3\\pm\\sqrt{5}\$로 모두 음수이다. 근과 계수의 관계에 의하여 \$\\alpha+\\beta=-6\$, \$\\alpha\\beta=4\$이다. \$\\alpha\<0, \\beta\<0\$이므로 \$\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-\\sqrt{4}=-2\$이다. 따라서 \$\$ (\\sqrt{\\alpha}+\\sqrt{\\beta})^2 \= \\alpha+\\beta+2\\sqrt{\\alpha}\\sqrt{\\beta} \= \-6+2(-2) \= \-10 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 근이 모두 음수임을 확인하고 음수 제곱근 곱의 성질을 이용해 식의 값을 구하는 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha+\\beta=-6<0, \\alpha\\beta=4>0$으로 두 근이 모두 음수임을 확인한 뒤 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}$를 적용한다.", "decisiveStep": "$\\alpha<0, \\beta<0$일 때 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-2$의 부호를 정확히 처리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 두 근의 부호를 판정해 음수 제곱근 성질을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 부호 판정과 음수의 제곱근 곱셈 성질을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "음수", "src": "solution", "quote": "모두 음수이다"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+6x+4=0$"}], "condition": []}, "reasons": {"method": "두 근의 부호가 음수임을 확인해 음수 제곱근 곱의 부호를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q10

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$4x^2-x+1=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\dfrac{1}{\\alpha}\$, \$\\dfrac{1}{\\beta}\$을 두 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은?

### 선지

① \$x^2+x-4=0\$ ② \$x^2-4x+1=0\$ ③ \$x^2-x+4=0\$ ④ \$x^2+x+4=0\$ ⑤ \$x^2-\\dfrac{1}{4}x+1=0\$

### 정답

③

### 해설

이차방정식 \$4x^2-x+1=0\$에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=\\dfrac{1}{4}\$, \$\\alpha\\beta=\\dfrac{1}{4}\$이다. 새 이차방정식의 두 근 \$\\dfrac{1}{\\alpha}, \\dfrac{1}{\\beta}\$의 합과 곱은 \$\$ \\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta} \= \\dfrac{\\alpha+\\beta}{\\alpha\\beta} \= 1, \\qquad \\dfrac{1}{\\alpha}\\cdot\\dfrac{1}{\\beta} \= \\dfrac{1}{\\alpha\\beta} \= 4 \$\$ 이다. 따라서 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$x^2-x+4=0\$이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 역수 근의 합과 곱을 구해 이차방정식을 작성하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha+\\beta=\\frac{1}{4}, \\alpha\\beta=\\frac{1}{4}$에서 역수 근의 합 $1$과 곱 $4$를 구해 $x^2-(\\text{합})x+(\\text{곱})=0$을 세운다.", "decisiveStep": "$\\frac{1}{\\alpha}+\\frac{1}{\\beta}=\\frac{\\alpha+\\beta}{\\alpha\\beta}$로 통분해 합 $1$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 주어진 두 근의 역수를 근으로 하는 이차방정식을 구성함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계를 이용해 역수 근을 갖는 이차방정식을 작성하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "계수가 $1$인 이차방정식은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $4x^2-x+1=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 역수 근의 합과 곱을 구해 이차방정식을 작성함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q11

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=x^2-4x+a\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나도록 하는 실수 \$a\$의 값의 범위는?

### 선지

① \$a\<4\$ ② \$a\\le 4\$ ③ \$a=4\$ ④ \$a\>4\$ ⑤ \$a\>-4\$

### 정답

①

### 해설

이차함수 \$y=x^2-4x+a\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나려면 이차방정식 \$x^2-4x+a=0\$의 판별식 \$D\>0\$이어야 한다. \$\$ \\dfrac{D}{4} \= (-2)^2-a \= 4-a \> 0 \\implies a \< 4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차함수의 x축 두 교점 조건을 판별식 D>0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x^2-4x+a=0$의 짝수 판별식 $\\frac{D}{4}=4-a>0$을 풀어 $a<4$를 구한다.", "decisiveStep": "서로 다른 두 교점 조건을 판별식 $D>0$으로 바로 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 이차함수 그래프와 x축의 서로 다른 두 교점 조건 D>0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 교점 조건에 판별식 $D>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $a$의 값의 범위는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+a$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값의 범위"}]}, "reasons": {"method": "짝수 판별식 D/4>0을 풀어 a<4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=x^2+5x\$의 그래프와 직선 \$y=x+k\$가 접하도록 하는 상수 \$k\$의 값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

③

### 해설

두 그래프가 접하므로 연립방정식 \$x^2+5x=x+k\$, 즉 \$x^2+4x-k=0\$이 중근을 가져야 한다. 판별식 \$\\dfrac{D}{4}=0\$에서 \$\$ \\dfrac{D}{4} \= 2^2-(-k) \= 4+k \= 0 \\implies k \= \-4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차함수와 직선의 접점 조건을 판별식 D=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2+4x-k=0$의 짝수 판별식 $\\frac{D}{4}=4+k=0$을 풀어 $k=-4$를 구한다.", "decisiveStep": "두 식을 같게 놓아 정리한 뒤 접할 조건 $D=0$을 바로 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 포물선과 직선이 접할 조건 D=0을 적용해 k를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접점 조건에 판별식 $D=0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=0$에서", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+5x$"}], "condition": [{"term": "접함", "src": "stem", "quote": "직선 $y=x+k$가 접하도록"}]}, "reasons": {"method": "연립방정식의 판별식 D/4=0을 풀어 k=-4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=x^2-6x+4\$의 최솟값은?

### 선지

① \$-7\$ ② \$-5\$ ③ \$-3\$ ④ \$-1\$ ⑤ \$1\$

### 정답

②

### 해설

주어진 식을 완전제곱식으로 변형하면 \$\$ y \= x^2-6x+4 \= (x^2-6x+9)-9+4 \= (x-3)^2-5 \$\$ 이다. 모든 실수 \$x\$에 대하여 \$(x-3)^2\\ge 0\$이므로 \$x=3\$일 때 최솟값은 \$-5\$이다.

```
{"status": "EXEMPT", "reason": "이차함수를 표준형으로 변형해 최솟값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=x^2-6x+4$를 완전제곱식 $y=(x-3)^2-5$로 고쳐 꼭짓점의 $y$좌표 $-5$를 읽는다.", "decisiveStep": "$(x-3)^2-5$로 변형해 최솟값이 $-5$임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 이차함수를 완전제곱식 표준형으로 변형해 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 표준형 변형으로 최솟값을 바로 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+4$"}], "condition": []}, "reasons": {"method": "이차함수를 완전제곱식으로 변형해 최솟값 -5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

\$x^2+y^2=9\$를 만족시키는 실수 \$x, y\$에 대하여 \$4x+y^2\$의 최댓값과 최솟값을 각각 \$M, m\$이라 할 때, \$M+m\$의 값은?

### 선지

① \$-3\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$3\$

### 정답

④

### 해설

\$x^2+y^2=9\$에서 \$y^2=9-x^2\\ge 0\$이므로 \$-3\\le x\\le 3\$이다. 이를 \$4x+y^2\$에 대입하면 \$\$ 4x+y^2 \= 4x+(9-x^2) \= \-x^2+4x+9 \= \-(x-2)^2+13 \$\$ 이다. 구간 \$-3\\le x\\le 3\$에 꼭짓점 \$x=2\$가 포함되므로 최댓값은 \$M=13\$이다. 구간의 양 끝값은 \$x=-3\$일 때 \$-(-3-2)^2+13=-12\$, \$x=3\$일 때 \$-(3-2)^2+13=12\$이므로 최솟값은 \$m=-12\$이다. 따라서 \$M+m=13+(-12)=1\$이다.

```
{"status": "EXEMPT", "reason": "원 위의 점 조건에서 y^2=9-x^2과 정의역 -3<=x<=3을 얻어 이차함수의 최대·최소를 구하는 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y^2=9-x^2$ ($-3\\le x\\le 3$)을 대입해 $-(x-2)^2+13$으로 고친 뒤 제한 범위에서 최댓값과 최솟값을 구한다.", "decisiveStep": "실수 조건 $y^2\\ge 0$에서 숨겨진 범위 $-3\\le x\\le 3$을 반드시 추출해 최솟값을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 실수 조건 y^2>=0에서 x 범위를 추출해 이차함수 최댓값·최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수 조건 $y^2\\ge 0$에서 $x$의 범위를 도출해 이차함수의 최대·최소를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값을 각각 $M, m$이라 할 때"}], "method": [{"term": "치환", "src": "solution", "quote": "4x+y^2 = 4x+(9-x^2)", "evidenceType": "IMPLIED", "justification": "y^2=9-x^2을 대입하고 실수 조건에서 얻은 x 범위로 최대·최소를 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "만족시키는 실수 $x, y$에 대하여"}], "condition": [{"term": "범위", "src": "solution", "quote": "-3\\le x\\le 3"}]}, "reasons": {"method": "y^2=9-x^2 대입과 실수 범위 -3<=x<=3 도출로 최대·최소 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$a\$의 값은?

(가) 최고차항의 계수 \$a\$는 양수이다. (나) 함수 \$y=f(x)\$의 그래프와 직선 \$y=-2ax-2\$가 만나는 두 점의 \$x\$좌표는 \$2\$와 \$4\$이다. (다) \$2\\le x\\le 6\$에서 \$f(x)\$의 최솟값은 \$-26\$이다.

### 선지

① \$1\$ ② \$\\dfrac{3}{2}\$ ③ \$2\$ ④ \$\\dfrac{5}{2}\$ ⑤ \$3\$

### 정답

⑤

### 해설

조건 (가), (나)에 의해 \$f(x)-(-2ax-2)=a(x-2)(x-4)\$이므로 \$\$ f(x) \= a(x^2-6x+8)-2ax-2 \= a(x^2-8x+8)-2 \= a(x-4)^2-8a-2 \$\$ 이다. \$a\>0\$이고 \$2\\le x\\le 6\$에 꼭짓점 \$x=4\$가 포함되므로 \$f(x)\$의 최솟값은 \$-8a-2\$이다. 조건 (다)에서 \$-8a-2=-26\$이므로 \$8a=24 \\implies a=3\$이다.

```
{"status": "READY", "pattern": "piecewise-polynomial-spike-v1", "viewBox": "0 0 360 280", "elements": [{"type": "curve", "id": "parabola_f", "expr": "3*(x-4)**2 - 26", "domain": [0.5, 7.5], "label": "$y=f(x)$"}, {"type": "line", "id": "line_secant", "expr": "-6*x - 2", "domain": [0.5, 6], "label": "$y=-2ax-2$"}, {"type": "point", "coords": [2, -14], "label": "$2$", "projX": true}, {"type": "point", "coords": [4, -26], "label": "$4$", "projX": true}], "note": "x=4를 축으로 하는 아래로 볼록 이차함수 y=f(x)와 직선 y=-2ax-2가 x=2, 4에서 만나는 그래프 개형"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)+2ax+2=a(x-2)(x-4)$로 이차함수 식을 세워 표준형 $a(x-4)^2-8a-2$로 정리한 뒤 최솟값 $-26$으로 $a$를 구한다.", "decisiveStep": "교점 조건에서 $f(x)$의 축이 $x=4$임을 도출해 구간 $[2, 6]$의 최솟값이 꼭짓점 값임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 교점 조건으로 이차함수 축을 구한 뒤 제한 구간 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 함수의 교점 조건으로 이차함수를 인수 꼴로 설정하고 제한 범위 최솟값으로 $a$를 결정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "$f(x)$의 최솟값은 $-26$이다"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$", "evidenceType": "IMPLIED", "justification": "교점 방정식으로 f(x)를 세우고 완전제곱식으로 정리해 최솟값 조건을 적용함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": [{"term": "양수", "src": "stem", "quote": "계수 $a$는 양수이다"}]}, "reasons": {"method": "교점 식으로 f(x)를 작성하고 표준형 최솟값으로 a=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 3.8

### 발문

연립방정식 \$\\begin{cases}x-y=-3\\x^2+y^2=29\\end{cases}\$의 해를 \$x=a, y=b\$라 할 때, 가능한 모든 해 \$(a, b)\$에 대하여 \$a+b\$의 값들의 합은?

### 선지

① \$0\$ ② \$2\$ ③ \$7\$ ④ \$-7\$ ⑤ \$14\$

### 정답

①

### 해설

\$x-y=-3\$에서 \$y=x+3\$을 \$x^2+y^2=29\$에 대입하면 \$\$ x^2+(x+3)^2 \= 29 \\implies 2x^2+6x-20 \= 0 \\implies x^2+3x-10 \= (x+5)(x-2) \= 0 \$\$ 이다. 따라서 \$x=2\$일 때 \$y=5\$ (\$a+b=7\$), \$x=-5\$일 때 \$y=-2\$ (\$a+b=-7\$)이므로 가능한 모든 \$a+b\$의 합은 \$7+(-7)=0\$이다.

```
{"status": "EXEMPT", "reason": "일차·이차 연립방정식을 대입법으로 풀어 모든 해의 a+b 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$y=x+3$을 $x^2+y^2=29$에 대입해 두 해 $(2, 5), (-5, -2)$를 구하고 각 해의 $a+b$를 합산한다.", "decisiveStep": "이차연립방정식의 두 순서쌍을 모두 구해 $a+b$의 값 $7$과 $-7$을 더한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "high1.json H1-RPM-041(DIRECT_ACTIVE): 일차식과 이차식의 연립방정식을 대입법으로 풀어 해를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식과 이차식의 연립방정식을 대입법으로 바로 푸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식"}], "method": [{"term": "대입", "src": "solution", "quote": "x^2+y^2=29$에 대입하면", "evidenceType": "NAMED"}], "given": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식"}], "condition": []}, "reasons": {"method": "y=x+3 대입으로 두 해를 구해 a+b의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 3.8

### 발문

부등식 \$\|x+2\|+\|x-4\|\<8\$을 만족하는 정수 \$x\$의 최솟값을 \$a\$, 최댓값을 \$b\$라 할 때, \$a+b\$의 값은?

### 선지

① \$0\$ ② \$2\$ ③ \$4\$ ④ \$6\$ ⑤ \$8\$

### 정답

②

### 해설

절댓값 안이 \$0\$이 되는 \$x=-2, 4\$를 기준으로 구간을 나누어 풀면

- \$x\<-2\$일 때: \$-(x+2)-(x-4)=-2x+2\<8 \\implies x\>-3\$, 즉 \$-3\<x\<-2\$  
- \$-2\\le x\\le 4\$일 때: \$(x+2)-(x-4)=6\<8\$ (항상 성립)  
- \$x\>4\$일 때: \$(x+2)+(x-4)=2x-2\<8 \\implies x\<5\$, 즉 \$4\<x\<5\$ 따라서 부등식의 해는 \$-3\<x\<5\$이고, 정수 \$x\$는 \$-2, \-1, 0, 1, 2, 3, 4\$이므로 \$a=-2, b=4\$에서 \$a+b=2\$이다.

```
{"status": "EXEMPT", "reason": "두 절댓값의 합 부등식을 구간을 나누어 풀어 정수 최대·최소 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$x=-2, 4$를 경계로 $3$개 구간에서 일차부등식을 풀어 해 $-3<x<5$를 구한다.", "decisiveStep": "가운데 구간 $-2\\le x\\le 4$에서 상수 $6<8$이 항상 성립함을 확인해 세 구간을 합친다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 절댓값 기호를 포함한 일차부등식을 구간별로 나누어 해를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 기호 두 개를 포함한 일차부등식을 구간 분할로 푸는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $x$의 최솟값을 $a$"}], "method": [{"term": "절댓값", "src": "solution", "quote": "절댓값 안이 $0$이 되는 $x=-2, 4$를 기준으로", "evidenceType": "IMPLIED", "justification": "절댓값 기호 내부의 영점을 기준으로 구간을 나누어 부등식을 풂"}], "given": [{"term": "부등식", "src": "stem", "quote": "부등식 $|x+2|+|x-4|<8$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $x$의 최솟값"}]}, "reasons": {"method": "구간 분할로 |x+2|+|x-4|<8을 풀어 정수 최대·최소 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

부등식 \$x+5\>\\sqrt{(2x-1)^2}\$의 해는?

### 선지

① \$-\\dfrac{5}{3}\<x\<6\$ ② \$-\\dfrac{4}{3}\<x\<5\$ ③ \$-1\<x\<6\$ ④ \$-\\dfrac{4}{3}\<x\<6\$ ⑤ \$\\dfrac{1}{2}\<x\<6\$

### 정답

④

### 해설

\$\\sqrt{(2x-1)^2}=\|2x-1\|\$이므로 주어진 부등식은 \$\|2x-1\|\<x+5\$이다. 따라서 \$-(x+5)\<2x-1\<x+5\$를 풀면 \$\$ \-(x+5)\<2x-1 \\implies 3x\>-4 \\implies x\>-\\dfrac{4}{3} \$\$ \$\$ 2x-1\<x+5 \\implies x\<6 \$\$ 이므로 해는 \$-\\dfrac{4}{3}\<x\<6\$이다.

```
{"status": "EXEMPT", "reason": "제곱근 안의 제곱을 절댓값으로 바꾼 뒤 일차부등식 연립으로 해를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$\\sqrt{(2x-1)^2}=|2x-1|$로 바꾸어 $|2x-1|<x+5$, 즉 $-(x+5)<2x-1<x+5$를 푼다.", "decisiveStep": "$\\sqrt{A^2}=|A|$ 항등식을 적용해 절댓값 부등식으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 근호 식을 절댓값 부등식으로 변환해 해의 범위를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$\\sqrt{A^2}=|A|$ 성질과 절댓값 포함 일차부등식을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "부등식", "src": "stem", "quote": "부등식 $x+5>\\sqrt{(2x-1)^2}$의 해"}], "method": [{"term": "절댓값", "src": "solution", "quote": "\\sqrt{(2x-1)^2}=|2x-1|", "evidenceType": "IMPLIED", "justification": "제곱의 제곱근을 절댓값으로 고쳐 양방향 일차부등식을 풂"}], "given": [{"term": "부등식", "src": "stem", "quote": "부등식 $x+5>\\sqrt{(2x-1)^2}$"}], "condition": []}, "reasons": {"method": "sqrt((2x-1)^2)=|2x-1| 변환 후 절댓값 부등식을 풂"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

연립부등식 \$\\begin{cases}-3x\<6\\x^2+4x+3\\le 0\\end{cases}\$의 해가 \$a\<x\\le b\$일 때, \$a+b\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

③

### 해설

첫째 부등식 \$-3x\<6\$에서 \$x\>-2\$이다. 둘째 부등식 \$x^2+4x+3=(x+1)(x+3)\\le 0\$에서 \$-3\\le x\\le \-1\$이다. 두 해의 공통부분은 \$-2\<x\\le \-1\$이므로 \$a=-2, b=-1\$이고 \$a+b=-3\$이다.

```
{"status": "EXEMPT", "reason": "일차부등식과 이차부등식의 연립 해를 구해 경계값 합을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$-3x<6$의 해 $x>-2$와 $(x+1)(x+3)\\le 0$의 해 $-3\\le x\\le -1$의 공통부분을 구한다.", "decisiveStep": "음수 $-3$으로 나눌 때 부등호 방향이 바뀌어 $x>-2$가 됨을 정확히 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "그래프를 이용한 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-047(DIRECT_ACTIVE): 연립부등식에서 일차부등식과 이차부등식의 공통 해를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차부등식과 인수분해 가능한 이차부등식의 연립 해를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "연립부등식", "src": "stem", "quote": "연립부등식"}], "method": [{"term": "이차부등식", "src": "solution", "quote": "x^2+4x+3=(x+1)(x+3)\\le 0", "evidenceType": "IMPLIED", "justification": "일차부등식과 인수분해된 이차부등식의 해의 공통부분을 구함"}], "given": [{"term": "연립부등식", "src": "stem", "quote": "연립부등식"}], "condition": []}, "reasons": {"method": "일차·이차부등식을 각각 풀어 공통범위 -2<x<=-1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

어느 수제 자동차공장에서 수출계약을 맺은 자동차를 생산하기 위해 하루에 \$6\$대씩 만들면 \$35\$일이 걸리고, 하루에 \$8\$대씩 만들면 \$26\$일이 걸린다. 하루에 \$10\$대씩 만들면 며칠이 걸리는가?

### 선지

① \$18\$일 ② \$19\$일 ③ \$20\$일 ④ \$22\$일 ⑤ \$21\$일

### 정답

⑤

### 해설

계약한 자동차의 수를 자연수 \$N\$이라 하면

- 하루에 \$6\$대씩 \$35\$일이 걸리므로 \$6\\cdot 34 \< N \\le 6\\cdot 35 \\implies 204 \< N \\le 210\$  
- 하루에 \$8\$대씩 \$26\$일이 걸리므로 \$8\\cdot 25 \< N \\le 8\\cdot 26 \\implies 200 \< N \\le 208\$ 두 범위의 공통부분에서 \$204 \< N \\le 208\$, 즉 \$205 \\le N \\le 208\$이다. 하루에 \$10\$대씩 \$20\$일간 만들면 \$200\$대로 부족하고, \$21\$일간 만들면 \$210\$대까지 생산 가능하므로 계약량을 완성하는 데 \$21\$일이 걸린다.

```
{"status": "EXEMPT", "reason": "작업 일수 조건을 연립 일차부등식으로 세워 자연수 범위에서 소요일수를 구하는 실생활 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "총 생산량 $N$의 범위를 $6\\cdot 34<N\\le 6\\cdot 35$와 $8\\cdot 25<N\\le 8\\cdot 26$으로 세워 연립한 뒤 $10$으로 나눈 올림 일수를 구한다.", "decisiveStep": "$35$일째에 완성되므로 $34$일치 초과, $35$일치 이하라는 엄밀한 부등식을 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "정수해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER", "why": "high1.json H1-RPM-046(DIRECT_ACTIVE): 문장제 조건을 연립일차부등식으로 세워 정수해를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "작업 소요일수 문장제를 연립일차부등식으로 번역해 정수 범위를 좁히는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "solution", "quote": "자연수 $N$이라 하면"}], "method": [{"term": "연립부등식", "src": "solution", "quote": "두 범위의 공통부분에서 $204 < N \\le 208$", "evidenceType": "IMPLIED", "justification": "각 작업 속도의 소요일수로 N에 대한 두 부등식을 세워 연립함"}], "given": [{"term": "부등식", "src": "solution", "quote": "6\\cdot 34 < N \\le 6\\cdot 35"}], "condition": [{"term": "자연수", "src": "solution", "quote": "자연수 $N$이라 하면"}]}, "reasons": {"method": "작업 일수 조건으로 연립부등식을 세워 N의 범위와 소요일수 21일을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

다항식 \$P(x)\$를 \$x-2\$로 나누었을 때의 나머지가 \$5\$이고, \$x-5\$로 나누었을 때의 나머지가 \$11\$일 때, \$P(x)\$를 \$(x-2)(x-5)\$로 나누었을 때의 나머지를 구하시오.

### 선지

없음

### 정답

\$2x+1\$

### 해설

\$P(x)\$를 이차식 \$(x-2)(x-5)\$로 나눈 나머지 \$R(x)\$는 일차 이하의 다항식이므로 \$R(x)=ax+b\$ (\$a, b\$는 상수)라 놓자. 나머지정리에 의하여 \$P(2)=5\$, \$P(5)=11\$이고, \$P(x)=(x-2)(x-5)Q(x)+ax+b\$에 대입하면 \$\$ 2a+b=5, \\qquad 5a+b=11 \$\$ 이다. 두 식을 빼면 \$3a=6\$에서 \$a=2\$이고, \$b=5-2a=1\$이다. 따라서 구하는 나머지는 \$2x+1\$이다.

```
{"status": "EXEMPT", "reason": "이차식으로 나눈 나머지를 ax+b로 두고 나머지정리 두 조건을 연립하는 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지를 $ax+b$로 놓고 $P(2)=5, P(5)=11$을 대입해 얻은 연립방정식 $2a+b=5, 5a+b=11$을 푼다.", "decisiveStep": "제수가 이차식이므로 나머지를 일차 이하 식 $ax+b$로 설정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 이차식으로 나눈 나머지를 ax+b로 두고 나머지정리를 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식으로 나눈 나머지를 $ax+b$로 두어 나머지정리로 결정하는 기본 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지를 구하시오"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여 $P(2)=5$, $P(5)=11$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나머지를 ax+b로 두고 나머지정리 P(2)=5, P(5)=11을 연립함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

함수 \$f(x)=\|x^2+2x-8\|\$의 그래프와 직선 \$y=-2x+k\$가 서로 다른 네 점에서 만나도록 하는 실수 \$k\$의 값의 범위를 구하시오.

### 선지

없음

### 정답

\$4\<k\<8\$

### 해설

두 그래프의 교점의 \$x\$좌표는 \$\|x^2+2x-8\|=-2x+k\$, 즉 \$k=\|x^2+2x-8\|+2x\$의 실근과 같다. \$x^2+2x-8=(x+4)(x-2)\$이므로 \$x=-4, 2\$를 기준으로 구간을 나누면

- \$x\\le \-4\$ 또는 \$x\\ge 2\$일 때: \$k=x^2+4x-8=(x+2)^2-12\$ (\$x\\le \-4\$에서 \$x=-4\$일 때 \$k=-8\$이고 감소, \$x\\ge 2\$에서 \$x=2\$일 때 \$k=4\$이고 증가)  
- \$-4\\le x\\le 2\$일 때: \$k=-x^2+8\$ (양 끝점 \$x=-4\$에서 \$k=-8\$, \$x=2\$에서 \$k=4\$, 꼭짓점 \$x=0\$에서 최댓값 \$8\$) 서로 다른 네 점에서 만나려면 \$x\\le \-4\$와 \$x\\ge 2\$에서 각각 \$1\$개씩, \$-4\<x\<2\$에서 서로 다른 \$2\$개의 교점이 생겨야 하므로 \$4\<k\<8\$이다.

```
{"status": "EXEMPT", "reason": "절댓값 이차함수와 직선의 교점 개수를 k=|x^2+2x-8|+2x의 구간별 그래프 경계값으로 분석하는 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$k=|x^2+2x-8|+2x$로 분리해 $x=-4, 2$를 경계로 구간별 증감과 꼭짓점 최댓값 $8$, 경계값 $4$를 구해 네 교점 범위를 정한다.", "decisiveStep": "경계 $x=2$의 높이 $4$와 가운데 구간 꼭짓점 최댓값 $8$ 사이에서 교점이 $4$개가 됨을 판정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 절댓값 이차함수 그래프와 직선의 교점 개수 조건을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 이차함수 방정식을 $k=g(x)$로 분리해 구간별 그래프와 수평선의 교점 개수를 판정하는 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위를 구하시오"}], "method": [{"term": "절댓값", "src": "stem", "quote": "함수 $f(x)=|x^2+2x-8|$", "evidenceType": "IMPLIED", "justification": "절댓값 내부 식의 부호가 바뀌는 x=-4, 2를 기준으로 k=|x^2+2x-8|+2x를 구간별 분석함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "함수 $f(x)=|x^2+2x-8|$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값의 범위"}]}, "reasons": {"method": "k=|x^2+2x-8|+2x의 구간별 경계값 4와 최댓값 8로 네 교점 범위를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

이차방정식 \$x^2-6x+k-1=0\$의 서로 다른 두 실근이 모두 \$-1\$보다 크도록 하는 실수 \$k\$의 값의 범위를 구하시오.

### 선지

없음

### 정답

\$-6\<k\<10\$

### 해설

\$t=x+1\$로 치환하면 \$x=t-1\$이고, \$x\>-1\$은 \$t\>0\$과 같다. 주어진 방정식에 대입하면 \$\$ (t-1)^2-6(t-1)+k-1 \= t^2-8t+k+6 \= 0 \$\$ 이다. 이 이차방정식이 서로 다른 두 양수 근을 가지면 되므로

1) 판별식 \$\\dfrac{D}{4} \= (-4)^2-(k+6) \= 10-k \> 0 \\implies k \< 10\$  
2) 두 근의 합 \$= 8 \> 0\$ (항상 성립)  
3) 두 근의 곱 \$= k+6 \> 0 \\implies k \> \-6\$ 따라서 구하는 실수 \$k\$의 값의 범위는 \$-6\<k\<10\$이다.

```
{"status": "EXEMPT", "reason": "근의 분리 문제를 t=x+1 치환을 통해 두 양수 근 조건으로 변환해 푸는 서술형 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$t=x+1$로 평행이동해 $t^2-8t+k+6=0$의 두 근이 모두 양수일 조건($D>0$, 합$>0$, 곱$>0$)을 연립한다.", "decisiveStep": "$x>-1$ 조건을 $t=x+1>0$으로 치환해 두 근의 합·곱 부호 판정으로 단순화한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "근의 위치와 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-048(DIRECT_ACTIVE): 근의 위치 조건 x>-1을 치환해 판별식·합·곱 조건을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 치환을 이용해 이차방정식의 근의 분리를 두 양수 근 조건으로 해결하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위를 구하시오"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4} = (-4)^2-(k+6) = 10-k > 0", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+k-1=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근이 모두 $-1$보다 크도록"}]}, "reasons": {"method": "t=x+1 치환 후 판별식과 두 근의 합·곱 조건으로 -6<k<10을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

