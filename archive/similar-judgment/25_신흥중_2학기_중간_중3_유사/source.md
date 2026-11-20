

```
{"stem": "25_신흥중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/25_신흥중_2학기_중간_중3_수학.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

다음 직각삼각형 \$DEF\$에서 옳지 않은 것은?

### 선지

① \$\\sin D=\\dfrac{p}{r}\$ ② \$\\cos D=\\dfrac{r}{q}\$ ③ \$\\sin E=\\dfrac{q}{r}\$ ④ \$\\tan D=\\dfrac{p}{q}\$ ⑤ \$\\tan E=\\dfrac{q}{p}\$

### 정답

②

### 해설

직각은 꼭짓점 \$F\$에 있으므로 빗변은 \$DE=r\$이다. 각 \$D\$를 기준으로 보면 대변은 \$EF=p\$, 이웃한 변은 \$DF=q\$이므로 \$\$ \\sin D=\\dfrac{p}{r}, \\quad \\cos D=\\dfrac{q}{r}, \\quad \\tan D=\\dfrac{p}{q} \$\$ 각 \$E\$를 기준으로 보면 대변은 \$DF=q\$, 이웃한 변은 \$EF=p\$이므로 \$\$ \\sin E=\\dfrac{q}{r}, \\quad \\tan E=\\dfrac{q}{p} \$\$ 따라서 \$\\cos D=\\dfrac{r}{q}\$라고 한 ②가 옳지 않다.

```
{"kind": "geometry", "caption": "직각삼각형 DEF (∠F=90°, DE=r, EF=p, DF=q)", "viewBox": [0, 0, 260, 190], "vertices": {"D": [40, 150], "F": [210, 150], "E": [210, 40]}, "segments": [["D", "F"], ["F", "E"], ["D", "E"]], "rightAngles": [["D", "F", "E"]], "labels": {"DF": "q", "EF": "p", "DE": "r"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $DEF$", "src": "stem"}, {"term": "삼각비", "quote": "빗변은 $DE=r$", "src": "solution"}], "condition": [{"term": "각", "quote": "직각은 꼭짓점 $F$", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "옳지 않은 것은", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos D=\\dfrac{q}{r}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

다음 중 계산 결과가 가장 큰 것은?

### 선지

① \$\\sin 30^\\circ \\div \\cos 60^\\circ\$ ② \$\\tan 45^\\circ \\times \\sin 60^\\circ\$ ③ \$\\cos 30^\\circ \\times \\tan 30^\\circ\$ ④ \$\\tan 60^\\circ \\div \\sin 30^\\circ\$ ⑤ \$\\sin 90^\\circ \+ \\cos 0^\\circ \- \\tan 0^\\circ\$

### 정답

④

### 해설

특수각의 삼각비 값을 각각 대입하여 계산한다. \$\$ \\begin{aligned} ①; \\sin 30^\\circ \\div \\cos 60^\\circ &= \\dfrac{1}{2} \\div \\dfrac{1}{2} \= 1 \\ ②; \\tan 45^\\circ \\times \\sin 60^\\circ &= 1 \\times \\dfrac{\\sqrt{3}}{2} \= \\dfrac{\\sqrt{3}}{2} \\ ③; \\cos 30^\\circ \\times \\tan 30^\\circ &= \\dfrac{\\sqrt{3}}{2} \\times \\dfrac{\\sqrt{3}}{3} \= \\dfrac{1}{2} \\ ④; \\tan 60^\\circ \\div \\sin 30^\\circ &= \\sqrt{3} \\div \\dfrac{1}{2} \= 2\\sqrt{3} \\ ⑤; \\sin 90^\\circ \+ \\cos 0^\\circ \- \\tan 0^\\circ &= 1 \+ 1 \- 0 \= 2 \\end{aligned} \$\$ \$2\\sqrt{3}=\\sqrt{12}\>\\sqrt{4}=2\$이므로 계산 결과가 가장 큰 것은 ④이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_TRIG_RATIO", "CC_ARITHMETIC_SIMPLIFICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "특수각의 삼각비", "src": "solution"}], "condition": [{"term": "대입", "quote": "대입하여", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "계산 결과가 가장 큰 것은", "src": "stem"}], "method": [{"term": "대입", "quote": "각각 대입하여 계산한다", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

\$45^\\circ \< x \< 90^\\circ\$일 때, 다음 식을 간단히 하면? \$\$\\sqrt{(1-\\tan x)^2}+\\sqrt{(1+\\tan x)^2}\$\$

### 선지

① \$2\\tan x\$ ② \$-2\\tan x\$ ③ \$2\$ ④ \$-2\$ ⑤ \$0\$

### 정답

①

### 해설

\$45^\\circ \< x \< 90^\\circ\$이면 \$\\tan x \> 1\$이므로 \$\$ 1-\\tan x \< 0, \\qquad 1+\\tan x \> 0 \$\$ 이다. 근호 안의 제곱을 절댓값으로 정리하면 \$\$ \\begin{aligned} \\sqrt{(1-\\tan x)^2}+\\sqrt{(1+\\tan x)^2} &= \|1-\\tan x\|+\|1+\\tan x\| \\ &= (\\tan x \- 1\) \+ (1 \+ \\tan x) \\ &= 2\\tan x \\end{aligned} \$\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_RADICAL_SQUARE_ABSOLUTE_VALUE", "CC_RADICAL_SIMPLIFICATION"], "conditions": ["COND_INEQUALITY_CONSTRAINT"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "예각", "quote": "$45^\\circ < x < 90^\\circ$", "src": "stem"}, {"term": "제곱근", "quote": "\\sqrt{(1-\\tan x)^2}", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "\\tan x > 1", "src": "solution"}], "goal": [{"term": "제곱근", "quote": "간단히 하면", "src": "stem"}], "method": [{"term": "차", "quote": "|1-\\tan x|+|1+\\tan x|", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 반지름의 길이가 \$1\$인 사분원과 \$\\triangle ABC\$, \$\\triangle ADE\$를 그렸다. \$DE=1.3764\$일 때, 아래의 삼각비의 표를 이용하여 \$\\cos y^\\circ\$의 값을 구하면?

| 각도 | \$\\sin\$ | \$\\cos\$ | \$\\tan\$ |
| :---: | :---: | :---: | :---: |
| \$36^\\circ\$ | \$0.5878\$ | \$0.8090\$ | \$0.7265\$ |
| \$37^\\circ\$ | \$0.6018\$ | \$0.7986\$ | \$0.7536\$ |
| \$53^\\circ\$ | \$0.7986\$ | \$0.6018\$ | \$1.3270\$ |
| \$54^\\circ\$ | \$0.8090\$ | \$0.5878\$ | \$1.3764\$ |

### 선지

① \$0.5878\$ ② \$0.7265\$ ③ \$0.8090\$ ④ \$0.7986\$ ⑤ \$0.6018\$

### 정답

③

### 해설

사분원의 반지름의 길이가 \$1\$이므로 \$AD=1\$이다. 직각삼각형 \$ADE\$에서 \$\$ \\tan x^\\circ \= \\dfrac{DE}{AD} \= \\dfrac{1.3764}{1} \= 1.3764 \$\$ 삼각비의 표에서 \$\\tan 54^\\circ \= 1.3764\$이므로 \$x=54\$이다. 한편 \$BC \\parallel DE\$이고 \$AD \\perp DE\$이므로 직각삼각형 \$ADE\$에서 \$\$ y^\\circ \= \\angle AED \= 90^\\circ \- 54^\\circ \= 36^\\circ \$\$ 따라서 \$\\cos y^\\circ \= \\cos 36^\\circ \= 0.8090\$이므로 정답은 ③이다.

```
{"kind": "geometry", "caption": "반지름 1인 사분원과 직각삼각형 ABC, ADE (∠EAD=x°, ∠ACB=y°, DE=1.3764)", "viewBox": [0, 0, 260, 220], "vertices": {"A": [40, 190], "B": [135, 190], "C": [135, 60], "D": [190, 190], "E": [190, 25]}, "segments": [["A", "D"], ["D", "E"], ["A", "E"], ["B", "C"]], "arcs": [{"center": "A", "radius": 150, "startAngle": 0, "endAngle": 90}], "rightAngles": [["A", "B", "C"], ["A", "D", "E"]], "labels": {"AD": "1", "DE": "1.3764", "x": "∠EAD", "y": "∠ACB"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_TRIG_TABLE_LOOKUP", "CC_UNIT_QUARTER_CIRCLE"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사분원", "quote": "반지름의 길이가 $1$인 사분원", "src": "stem"}, {"term": "길이", "quote": "$DE=1.3764$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "삼각비의 표", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "\\cos y^\\circ", "src": "stem"}], "method": [{"term": "동위각", "quote": "$BC \\parallel DE$", "src": "solution"}, {"term": "예각", "quote": "90^\\circ - 54^\\circ = 36^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 한 모서리의 길이가 \$6,\\mathrm{cm}\$인 정사면체 \$ABCD\$의 꼭짓점 \$A\$에서 밑면 \$BCD\$에 내린 수선의 발 \$H\$는 \$\\triangle BCD\$의 무게중심이다. \$\\angle ADH=x^\\circ\$라 할 때, \$\\cos x^\\circ\$의 값은?

### 선지

① \$\\dfrac{\\sqrt{2}}{3}\$ ② \$\\dfrac{\\sqrt{2}}{2}\$ ③ \$\\dfrac{\\sqrt{6}}{3}\$ ④ \$\\dfrac{1}{3}\$ ⑤ \$\\dfrac{\\sqrt{3}}{3}\$

### 정답

⑤

### 해설

밑면 \$BCD\$는 한 변의 길이가 \$6,\\mathrm{cm}\$인 정삼각형이다. 변 \$BC\$의 중점을 \$M\$이라 하면 \$CM=3,\\mathrm{cm}\$이므로 정삼각형의 높이 \$DM\$은 \$\$ DM \= \\sqrt{6^2-3^2} \= 3\\sqrt{3},\\mathrm{cm} \$\$ 점 \$H\$는 \$\\triangle BCD\$의 무게중심이므로 중선 \$DM\$을 꼭짓점 \$D\$로부터 \$2:1\$로 나눈다. \$\$ DH \= \\dfrac{2}{3}DM \= \\dfrac{2}{3}\\times 3\\sqrt{3} \= 2\\sqrt{3},\\mathrm{cm} \$\$ \$AH\$는 밑면에 수직이므로 직각삼각형 \$ADH\$에서 \$\$ \\cos x^\\circ \= \\dfrac{DH}{AD} \= \\dfrac{2\\sqrt{3}}{6} \= \\dfrac{\\sqrt{3}}{3} \$\$ 따라서 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "한 모서리 6cm인 정사면체 ABCD와 밑면 무게중심 H (∠ADH=x°)", "viewBox": [0, 0, 260, 240], "vertices": {"A": [130, 30], "B": [50, 170], "C": [155, 210], "D": [220, 155], "H": [142, 178], "M": [102, 190]}, "segments": [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["C", "D"], ["B", "D"], ["A", "H"], ["D", "M"]], "rightAngles": [["A", "H", "D"]], "labels": {"AD": "6cm", "x": "∠ADH"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.3, "crossConcepts": ["CC_RADICAL_GEOMETRIC_APPLICATION", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "정사면체", "quote": "정사면체 $ABCD$", "src": "stem"}, {"term": "무게중심", "quote": "$\\triangle BCD$의 무게중심", "src": "stem"}], "condition": [{"term": "수선", "quote": "내린 수선의 발 $H$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "\\cos x^\\circ", "src": "stem"}], "method": [{"term": "중점", "quote": "중점을 $M$", "src": "solution"}, {"term": "삼각비", "quote": "\\dfrac{DH}{AD}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같은 직각삼각형 \$ABC\$에서 \$AB \\perp CD\$, \$BC \\perp DE\$이고, \$AB=12,\\mathrm{cm}\$, \$\\angle ABC=30^\\circ\$일 때, \$BE\$의 길이는?

### 선지

① \$4\\sqrt{3},\\mathrm{cm}\$ ② \$\\dfrac{9\\sqrt{3}}{2},\\mathrm{cm}\$ ③ \$5\\sqrt{3},\\mathrm{cm}\$ ④ \$\\dfrac{9\\sqrt{2}}{2},\\mathrm{cm}\$ ⑤ \$6\\sqrt{2},\\mathrm{cm}\$

### 정답

②

### 해설

직각삼각형 \$ABC\$에서 \$\\angle C=90^\\circ\$이므로 \$\$ BC \= AB\\cos 30^\\circ \= 12\\times\\dfrac{\\sqrt{3}}{2} \= 6\\sqrt{3},\\mathrm{cm} \$\$ \$AB \\perp CD\$이므로 직각삼각형 \$BCD\$에서 \$\\angle CBD=30^\\circ\$이다. \$\$ BD \= BC\\cos 30^\\circ \= 6\\sqrt{3}\\times\\dfrac{\\sqrt{3}}{2} \= 9,\\mathrm{cm} \$\$ 또 \$BC \\perp DE\$이므로 직각삼각형 \$BDE\$에서도 \$\\angle DBE=30^\\circ\$이다. \$\$ BE \= BD\\cos 30^\\circ \= 9\\times\\dfrac{\\sqrt{3}}{2} \= \\dfrac{9\\sqrt{3}}{2},\\mathrm{cm} \$\$ 따라서 정답은 ②이다.

```
{"kind": "geometry", "caption": "직각삼각형 ABC에서 AB=12cm, ∠ABC=30°, AB⊥CD, BC⊥DE", "viewBox": [0, 0, 280, 190], "vertices": {"B": [30, 150], "A": [240, 150], "C": [188, 60], "D": [188, 150], "E": [148, 82]}, "segments": [["B", "A"], ["A", "C"], ["B", "C"], ["C", "D"], ["D", "E"]], "rightAngles": [["A", "C", "B"], ["C", "D", "B"], ["D", "E", "B"]], "labels": {"AB": "12cm", "B": "30°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.8, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=12\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle ABC=30^\\circ$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$BE$의 길이", "src": "stem"}], "method": [{"term": "삼각비", "quote": "BD\\cos 30^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

일차방정식 \$3x-4y+12=0\$의 그래프가 \$x\$축과 이루는 예각의 크기를 \$a^\\circ\$라 할 때, \$\\sin a^\\circ \+ \\cos a^\\circ\$의 값은?

### 선지

① \$\\dfrac{4}{5}\$ ② \$1\$ ③ \$\\dfrac{6}{5}\$ ④ \$\\dfrac{7}{5}\$ ⑤ \$\\dfrac{8}{5}\$

### 정답

④

### 해설

일차방정식을 \$y\$에 관하여 정리하면 \$\$ y \= \\dfrac{3}{4}x \+ 3 \$\$ 이므로 직선의 기울기는 \$\\dfrac{3}{4}\$이다. 따라서 \$\\tan a^\\circ \= \\dfrac{3}{4}\$이다. 밑변의 길이가 \$4\$, 높이가 \$3\$인 직각삼각형에서 빗변의 길이는 \$\\sqrt{4^2+3^2}=5\$이므로 \$\$ \\sin a^\\circ \= \\dfrac{3}{5}, \\qquad \\cos a^\\circ \= \\dfrac{4}{5} \$\$ 이다. 그러므로 \$\$ \\sin a^\\circ \+ \\cos a^\\circ \= \\dfrac{3}{5} \+ \\dfrac{4}{5} \= \\dfrac{7}{5} \$\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_LINE_SLOPE_TANGENT", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "예각", "quote": "예각의 크기를 $a^\\circ$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "\\tan a^\\circ = \\dfrac{3}{4}", "src": "solution"}], "goal": [{"term": "합", "quote": "\\sin a^\\circ + \\cos a^\\circ", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형에서 빗변의 길이는", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\triangle ABC\$에서 \$AB=6,\\mathrm{cm}\$, \$AC=8,\\mathrm{cm}\$, \$\\angle B=60^\\circ\$일 때, \$BC\$의 길이는?

### 선지

① \$(3+\\sqrt{37}),\\mathrm{cm}\$ ② \$(3+\\sqrt{35}),\\mathrm{cm}\$ ③ \$(4+\\sqrt{37}),\\mathrm{cm}\$ ④ \$(3+3\\sqrt{3}),\\mathrm{cm}\$ ⑤ \$(6+\\sqrt{37}),\\mathrm{cm}\$

### 정답

①

### 해설

꼭짓점 \$A\$에서 변 \$BC\$에 내린 수선의 발을 \$H\$라 하자. 직각삼각형 \$ABH\$에서 \$\$ \\begin{aligned} BH &= AB\\cos 60^\\circ \= 6\\times\\dfrac{1}{2} \= 3,\\mathrm{cm} \\ AH &= AB\\sin 60^\\circ \= 6\\times\\dfrac{\\sqrt{3}}{2} \= 3\\sqrt{3},\\mathrm{cm} \\end{aligned} \$\$ 직각삼각형 \$AHC\$에서 피타고라스 정리에 의해 \$\$ HC \= \\sqrt{AC^2-AH^2} \= \\sqrt{8^2-(3\\sqrt{3})^2} \= \\sqrt{64-27} \= \\sqrt{37},\\mathrm{cm} \$\$ 따라서 \$BC \= BH \+ HC \= (3+\\sqrt{37}),\\mathrm{cm}\$이므로 정답은 ①이다.

```
{"kind": "geometry", "caption": "△ABC에서 AB=6cm, AC=8cm, ∠B=60°", "viewBox": [0, 0, 260, 190], "vertices": {"B": [35, 150], "C": [225, 150], "A": [100, 45]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"]], "labels": {"AB": "6cm", "AC": "8cm", "B": "60°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_AUXILIARY_ALTITUDE", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=6\\,\\mathrm{cm}$, $AC=8\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=60^\\circ$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$BC$의 길이", "src": "stem"}], "method": [{"term": "수선", "quote": "수선의 발을 $H$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다음 \$\\triangle ABC\$에서 \$AB=4\\sqrt{3}\$, \$BC=9\$, \$\\angle B=60^\\circ\$일 때, \$\\triangle ABC\$의 넓이는?

### 선지

① \$18\$ ② \$18\\sqrt{3}\$ ③ \$24\$ ④ \$24\\sqrt{3}\$ ⑤ \$27\$

### 정답

⑤

### 해설

두 변 \$AB\$, \$BC\$의 길이와 그 끼인각 \$B\$의 크기가 주어졌으므로 \$\\triangle ABC\$의 넓이는 \$\$ \\begin{aligned} \\triangle ABC &= \\dfrac{1}{2}\\times AB\\times BC\\times\\sin B \\ &= \\dfrac{1}{2}\\times 4\\sqrt{3}\\times 9\\times\\sin 60^\\circ \\ &= \\dfrac{1}{2}\\times 4\\sqrt{3}\\times 9\\times\\dfrac{\\sqrt{3}}{2} \\ &= 27 \\end{aligned} \$\$ 따라서 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "△ABC에서 AB=4√3, BC=9, ∠B=60°", "viewBox": [0, 0, 260, 180], "vertices": {"B": [40, 145], "C": [220, 145], "A": [105, 40]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"]], "labels": {"AB": "4√3", "BC": "9", "B": "60°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.2, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=4\\sqrt{3}$, $BC=9$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=60^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\sin 60^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q10

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 정사각형 \$ABCD\$에서 두 점 \$E\$, \$F\$는 각각 변 \$AD\$, \$CD\$의 중점이다. \$\\angle EBF=x^\\circ\$라 할 때, \$\\sin x\$의 값은?

### 선지

① \$\\dfrac{2}{5}\$ ② \$\\dfrac{1}{2}\$ ③ \$\\dfrac{3}{5}\$ ④ \$\\dfrac{3}{4}\$ ⑤ \$\\dfrac{4}{5}\$

### 정답

③

### 해설

정사각형 \$ABCD\$의 한 변의 길이를 \$2\$라 두면 \$AE=ED=CF=FD=1\$이다. 직각삼각형 \$ABE\$, \$BCF\$에서 피타고라스 정리에 의해 \$\$ BE \= BF \= \\sqrt{2^2+1^2} \= \\sqrt{5} \$\$ 정사각형 \$ABCD\$의 넓이에서 세 직각삼각형 \$ABE\$, \$EDF\$, \$BCF\$의 넓이를 빼면 \$\$ \\triangle EBF \= 4 \- \\dfrac{1}{2}(2\\times 1\) \- \\dfrac{1}{2}(1\\times 1\) \- \\dfrac{1}{2}(2\\times 1\) \= \\dfrac{3}{2} \$\$ 한편 \$\\triangle EBF\$의 넓이는 \$\\dfrac{1}{2}\\times BE\\times BF\\times\\sin x\$이므로 \$\$ \\dfrac{1}{2}\\times\\sqrt{5}\\times\\sqrt{5}\\times\\sin x \= \\dfrac{3}{2} \\implies \\dfrac{5}{2}\\sin x \= \\dfrac{3}{2} \$\$ 따라서 \$\\sin x \= \\dfrac{3}{5}\$이므로 정답은 ③이다.

```
{"kind": "geometry", "caption": "정사각형 ABCD와 AD, CD의 중점 E, F (∠EBF=x°)", "viewBox": [0, 0, 220, 220], "vertices": {"A": [40, 40], "B": [40, 180], "C": [180, 180], "D": [180, 40], "E": [110, 40], "F": [180, 110]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"], ["B", "F"], ["E", "F"]], "labels": {"x": "∠EBF"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.1, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "정사각형", "quote": "정사각형 $ABCD$", "src": "stem"}, {"term": "중점", "quote": "각각 변 $AD$, $CD$의 중점", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle EBF=x^\\circ$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "\\sin x", "src": "stem"}], "method": [{"term": "넓이", "quote": "넓이에서", "src": "solution"}, {"term": "삼각비", "quote": "\\sin x", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q11

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 \$\\angle B=75^\\circ\$이고, 밑변 \$BC\$의 길이가 \$6\\sqrt{2}\$인 이등변삼각형 \$ABC\$(\$AB=AC\$)에서 \$AB\$의 길이는?

### 선지

① \$6+3\\sqrt{3}\$ ② \$6+6\\sqrt{3}\$ ③ \$12\\sqrt{2}\$ ④ \$6+6\\sqrt{2}\$ ⑤ \$12+3\\sqrt{3}\$

### 정답

②

### 해설

\$AB=AC\$이므로 \$\\angle C=75^\\circ\$, \$\\angle A=30^\\circ\$이다. 꼭짓점 \$A\$에서 \$BC\$에 내린 수선의 발을 \$D\$라 하면 \$BD=3\\sqrt{2}\$, \$\\angle BAD=15^\\circ\$이다. 선분 \$AD\$ 위에 \$DE=BD=3\\sqrt{2}\$가 되도록 점 \$E\$를 잡으면 \$\\triangle BDE\$는 직각이등변삼각형이므로 \$\$ \\angle DBE=45^\\circ, \\quad BE=3\\sqrt{2}\\times\\sqrt{2}=6, \\quad \\angle ABE=75^\\circ-45^\\circ=30^\\circ \$\$ 또 \$\\angle AEB=180^\\circ-45^\\circ=135^\\circ\$이다. 꼭짓점 \$A\$에서 \$BE\$의 연장선에 내린 수선의 발을 \$F\$라 하자. \$\\angle AEF=45^\\circ\$이므로 직각삼각형 \$AEF\$에서 \$AF=EF\$이다. 직각삼각형 \$ABF\$에서 \$\\angle ABF=30^\\circ\$이므로 \$AB=2AF\$, \$BF=\\sqrt{3}AF\$이다. \$BF=BE+EF=6+AF\$이므로 \$\$ \\sqrt{3}AF \= 6 \+ AF \\implies (\\sqrt{3}-1)AF \= 6 \\implies AF \= \\dfrac{6}{\\sqrt{3}-1} \= 3(\\sqrt{3}+1) \$\$ 따라서 \$AB \= 2AF \= 6+6\\sqrt{3}\$이므로 정답은 ②이다.

```
{"kind": "geometry", "caption": "AB=AC인 이등변삼각형 ABC (∠B=75°, BC=6√2)", "viewBox": [0, 0, 220, 240], "vertices": {"A": [110, 25], "B": [55, 205], "C": [165, 205]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"]], "labels": {"BC": "6√2", "B": "75°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.3, "crossConcepts": ["CC_AUXILIARY_ALTITUDE", "CC_TRIG_RATIO"], "conditions": ["COND_TRIANGLE_SIDES"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "이등변삼각형", "quote": "이등변삼각형 $ABC$", "src": "stem"}, {"term": "각", "quote": "$\\angle B=75^\\circ$", "src": "stem"}], "condition": [{"term": "길이", "quote": "밑변 $BC$의 길이가 $6\\sqrt{2}$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$AB$의 길이", "src": "stem"}], "method": [{"term": "수선", "quote": "수선의 발을 $F$", "src": "solution"}, {"term": "유리화", "quote": "\\dfrac{6}{\\sqrt{3}-1}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\angle A=90^\\circ\$, \$\\angle B=30^\\circ\$, \$AC=5,\\mathrm{m}\$인 직각삼각형 \$ABC\$의 꼭짓점 \$A\$에서 \$BC\$에 내린 수선의 발을 \$D\$라 할 때, 옳지 않은 것은?

### 선지

① \$AD=AC\\sin 60^\\circ\$ ② \$CD=AC\\cos 60^\\circ\$ ③ \$BD=AB\\cos 30^\\circ\$ ④ \$CD=AD\\tan 60^\\circ\$ ⑤ \$BC=10,\\mathrm{m}\$

### 정답

④

### 해설

\$\\angle A=90^\\circ\$, \$\\angle B=30^\\circ\$이므로 \$\\angle C=60^\\circ\$이다. 직각삼각형 \$ABC\$에서 \$BC \= \\dfrac{AC}{\\sin 30^\\circ} \= \\dfrac{5}{1/2} \= 10,\\mathrm{m}\$이므로 ⑤는 옳다. 직각삼각형 \$ACD\$에서 \$AD=AC\\sin 60^\\circ\$, \$CD=AC\\cos 60^\\circ\$이므로 ①, ②는 옳다. 직각삼각형 \$ABD\$에서 \$BD=AB\\cos 30^\\circ\$이므로 ③도 옳다. 그러나 직각삼각형 \$ACD\$에서 \$\\tan 60^\\circ \= \\dfrac{AD}{CD}\$이므로 \$CD \= \\dfrac{AD}{\\tan 60^\\circ}\$이다. 따라서 옳지 않은 것은 ④이다.

```
{"kind": "geometry", "caption": "∠A=90°, ∠B=30°, AC=5m인 직각삼각형 ABC와 수선의 발 D", "viewBox": [0, 0, 270, 170], "vertices": {"B": [30, 140], "C": [240, 140], "A": [187, 49], "D": [187, 140]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"], ["A", "D"]], "rightAngles": [["B", "A", "C"], ["A", "D", "C"]], "labels": {"AC": "5m", "B": "30°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AC=5\\,\\mathrm{m}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "내린 수선의 발을 $D$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "옳지 않은 것은", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\dfrac{AD}{\\tan 60^\\circ}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q13

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림의 원 \$O\$에서 반지름의 길이 \$x\$의 값은?

### 선지

① \$10\$ ② \$9\$ ③ \$11\$ ④ \$12\$ ⑤ \$14\$

### 정답

①

### 해설

원의 중심 \$O\$에서 현에 내린 수선은 그 현을 이등분한다. 현의 길이가 \$12,\\mathrm{cm}\$이므로 현의 절반의 길이는 \$6,\\mathrm{cm}\$이다. 중심에서 현까지의 거리가 \$8,\\mathrm{cm}\$이므로 반지름 \$x\$를 빗변으로 하는 직각삼각형에서 \$\$ x^2 \= 6^2 \+ 8^2 \= 36 \+ 64 \= 100 \$\$ \$x\>0\$이므로 \$x=10\$이다. 따라서 정답은 ①이다.

```
{"kind": "geometry", "caption": "원 O에서 현의 길이 12cm, 중심과의 거리 8cm, 반지름 x", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [62, 174], "B": [158, 174], "M": [110, 174]}, "segments": [["A", "B"], ["O", "M"], ["O", "A"]], "rightAngles": [["O", "M", "B"]], "labels": {"AB": "12cm", "OM": "8cm", "OA": "x"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "현", "quote": "현의 길이가 $12\\,\\mathrm{cm}$", "src": "solution"}], "condition": [{"term": "거리", "quote": "중심에서 현까지의 거리가 $8\\,\\mathrm{cm}$", "src": "solution"}], "goal": [{"term": "반지름", "quote": "반지름의 길이 $x$", "src": "stem"}], "method": [{"term": "수선", "quote": "현에 내린 수선", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림의 원 \$O\$에서 \$OD \\perp AB\$, \$OE \\perp BC\$, \$OF \\perp AC\$이고 \$OD=OE=OF\$이다. \$BC=6\\sqrt{3},\\mathrm{cm}\$일 때, 원 \$O\$의 넓이는?

### 선지

① \$18\\pi,\\mathrm{cm}^2\$ ② \$24\\pi,\\mathrm{cm}^2\$ ③ \$27\\pi,\\mathrm{cm}^2\$ ④ \$32\\pi,\\mathrm{cm}^2\$ ⑤ \$36\\pi,\\mathrm{cm}^2\$

### 정답

⑤

### 해설

원의 중심에서 같은 거리에 있는 현의 길이는 같다. \$OD=OE=OF\$이므로 \$AB=BC=CA=6\\sqrt{3},\\mathrm{cm}\$이고, \$\\triangle ABC\$는 정삼각형이다. 정삼각형 \$ABC\$의 높이는 \$\$ 6\\sqrt{3}\\times\\dfrac{\\sqrt{3}}{2} \= 9,\\mathrm{cm} \$\$ 점 \$O\$는 정삼각형 \$ABC\$의 무게중심과 같으므로 반지름 \$OB\$의 길이는 \$\$ OB \= \\dfrac{2}{3}\\times 9 \= 6,\\mathrm{cm} \$\$ 따라서 원 \$O\$의 넓이는 \$\\pi\\times 6^2 \= 36\\pi,\\mathrm{cm}^2\$이므로 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "원 O에 내접하는 △ABC에서 OD=OE=OF, BC=6√3cm", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [110, 30], "B": [41, 150], "C": [179, 150], "D": [75, 90], "E": [110, 150], "F": [145, 90]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"], ["O", "D"], ["O", "E"], ["O", "F"]], "rightAngles": [["O", "D", "A"], ["O", "E", "B"], ["O", "F", "C"]], "labels": {"BC": "6√3cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_TRIANGLE_SIDES"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "현", "quote": "$BC=6\\sqrt{3}\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "거리", "quote": "$OD=OE=OF$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "원 $O$의 넓이", "src": "stem"}], "method": [{"term": "무게중심", "quote": "무게중심과 같으므로", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$AB \\perp OC\$이고 교점이 \$M\$일 때, \$AM=8,\\mathrm{cm}\$, \$CM=4,\\mathrm{cm}\$이면 \$OA\$의 길이는?

### 선지

① \$8,\\mathrm{cm}\$ ② \$9,\\mathrm{cm}\$ ③ \$10,\\mathrm{cm}\$ ④ \$11,\\mathrm{cm}\$ ⑤ \$12,\\mathrm{cm}\$

### 정답

③

### 해설

원 \$O\$의 반지름의 길이를 \$r,\\mathrm{cm}\$라 하면 \$OA=OC=r\$이고 \$OM=r-4\$이다. 직각삼각형 \$OMA\$에서 피타고라스 정리에 의해 \$\$ \\begin{aligned} r^2 &= (r-4)^2 \+ 8^2 \\ r^2 &= r^2 \- 8r \+ 16 \+ 64 \\ 8r &= 80 \\ r &= 10 \\end{aligned} \$\$ 따라서 \$OA=10,\\mathrm{cm}\$이므로 정답은 ③이다.

```
{"kind": "geometry", "caption": "원 O에서 AB⊥OC (교점 M), AM=8cm, CM=4cm", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "C": [110, 190], "M": [110, 158], "A": [46, 158], "B": [174, 158]}, "segments": [["A", "B"], ["O", "C"], ["O", "A"]], "rightAngles": [["O", "M", "A"]], "labels": {"AM": "8cm", "CM": "4cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$의 반지름", "src": "solution"}, {"term": "길이", "quote": "$AM=8\\,\\mathrm{cm}$, $CM=4\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "$AB \\perp OC$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$OA$의 길이", "src": "stem"}], "method": [{"term": "반지름", "quote": "반지름의 길이를 $r\\,\\mathrm{cm}$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 점 \$I\$는 \$\\triangle ABC\$의 내심이며 원의 중심이다. \$DE=8,\\mathrm{cm}\$일 때, \$FG+HJ\$의 값은?

### 선지

① \$14,\\mathrm{cm}\$ ② \$16,\\mathrm{cm}\$ ③ \$18,\\mathrm{cm}\$ ④ \$20,\\mathrm{cm}\$ ⑤ \$24,\\mathrm{cm}\$

### 정답

②

### 해설

점 \$I\$는 \$\\triangle ABC\$의 내심이므로 세 변 \$AB\$, \$BC\$, \$CA\$까지의 거리가 모두 같다. 따라서 세 현 \$DE\$, \$FG\$, \$HJ\$는 원의 중심 \$I\$에서 각각 같은 거리에 있다. 원의 중심에서 같은 거리에 있는 현의 길이는 같으므로 \$\$ DE \= FG \= HJ \= 8,\\mathrm{cm} \$\$ 그러므로 \$FG \+ HJ \= 8 \+ 8 \= 16,\\mathrm{cm}\$이다. 정답은 ②이다.

```
{"kind": "geometry", "caption": "△ABC의 내심 I를 중심으로 하는 원이 세 변을 잘라 만든 현 DE, FG, HJ", "viewBox": [0, 0, 240, 210], "circles": [{"center": "I", "radius": 65}], "vertices": {"I": [120, 125], "A": [120, 35], "B": [40, 175], "C": [200, 175]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"]], "labels": {"DE": "8cm", "I": "내심"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원의 중심", "src": "stem"}, {"term": "현", "quote": "$DE=8\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "거리", "quote": "세 변 $AB$, $BC$, $CA$까지의 거리가 모두 같다", "src": "solution"}], "goal": [{"term": "합", "quote": "$FG+HJ$의 값", "src": "stem"}], "method": [{"term": "현", "quote": "현의 길이는 같으므로", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 두 직선 \$PA\$, \$PB\$가 원 \$O\$의 접선이고 두 점 \$A\$, \$B\$가 접점일 때, \$\\angle APB=44^\\circ\$이면 \$\\angle PAB\$의 크기는?

### 선지

① \$58^\\circ\$ ② \$62^\\circ\$ ③ \$66^\\circ\$ ④ \$68^\\circ\$ ⑤ \$72^\\circ\$

### 정답

④

### 해설

원 밖의 한 점 \$P\$에서 원에 그은 두 접선의 길이는 같으므로 \$PA=PB\$이다. 따라서 \$\\triangle PAB\$는 이등변삼각형이고, \$\\angle PAB \= \\angle PBA\$이다. \$\\angle APB=44^\\circ\$이므로 \$\$ \\angle PAB \= \\dfrac{180^\\circ \- 44^\\circ}{2} \= \\dfrac{136^\\circ}{2} \= 68^\\circ \$\$ 따라서 정답은 ④이다.

```
{"kind": "geometry", "caption": "원 O 밖의 점 P에서 그은 두 접선 PA, PB (∠APB=44°)", "viewBox": [0, 0, 240, 200], "circles": [{"center": "O", "radius": 65}], "vertices": {"O": [150, 100], "P": [30, 100], "A": [125, 40], "B": [125, 160]}, "segments": [["P", "A"], ["P", "B"], ["A", "B"]], "labels": {"P": "44°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.8, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH"], "conditions": ["COND_TRIANGLE_SIDES"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "접점", "quote": "두 점 $A$, $B$가 접점", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle APB=44^\\circ$", "src": "stem"}], "goal": [{"term": "각", "quote": "$\\angle PAB$의 크기", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "$\\triangle PAB$는 이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 원 \$O\$는 직사각형 \$ABCD\$의 세 변 \$AB\$, \$AD\$, \$BC\$와 접하고, \$AB=6\$, \$AD=9\$이다. \$DE\$가 원 \$O\$의 접선일 때, \$\\triangle DEC\$의 넓이는?

### 선지

① \$\\dfrac{27}{2}\$ ② \$12\$ ③ \$\\dfrac{25}{2}\$ ④ \$14\$ ⑤ \$\\dfrac{29}{2}\$

### 정답

①

### 해설

원 \$O\$는 직사각형의 두 변 \$AD\$, \$BC\$에 접하므로 지름은 \$AB=6\$, 반지름은 \$3\$이다. \$AD\$, \$BC\$, \$DE\$와 원 \$O\$의 접점을 각각 \$U\$, \$V\$, \$T\$라 하면 \$AU=BV=3\$이므로 \$\$ DT \= DU \= AD \- AU \= 9 \- 3 \= 6 \$\$ \$EC=x\$라 하면 \$BE=9-x\$이므로 \$\$ ET \= EV \= BE \- BV \= (9-x)-3 \= 6-x \$\$ 따라서 \$DE \= DT \+ TE \= 6 \+ (6-x) \= 12-x\$이다. 직각삼각형 \$DEC\$에서 피타고라스 정리에 의해 \$\$ (12-x)^2 \= 6^2 \+ x^2 \\implies 144 \- 24x \+ x^2 \= 36 \+ x^2 \\implies 24x \= 108 \\implies x \= \\dfrac{9}{2} \$\$ 그러므로 \$\\triangle DEC\$의 넓이는 \$\\dfrac{1}{2}\\times 6\\times \\dfrac{9}{2} \= \\dfrac{27}{2}\$이다. 정답은 ①이다.

```
{"kind": "geometry", "caption": "직사각형 ABCD(AB=6, AD=9)의 세 변에 접하는 원 O와 접선 DE", "viewBox": [0, 0, 260, 180], "circles": [{"center": "O", "radius": 60}], "vertices": {"A": [40, 30], "B": [40, 150], "C": [220, 150], "D": [220, 30], "O": [100, 90], "E": [130, 150]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "E"]], "labels": {"AB": "6", "AD": "9"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.0, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사각형", "quote": "직사각형 $ABCD$", "src": "stem"}, {"term": "접선", "quote": "$DE$가 원 $O$의 접선", "src": "stem"}], "condition": [{"term": "길이", "quote": "$AB=6$, $AD=9$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle DEC$의 넓이", "src": "stem"}], "method": [{"term": "접점", "quote": "접점을 각각 $U$, $V$, $T$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$\\triangle ABC\$는 \$\\angle C=90^\\circ\$, \$BC=8,\\mathrm{cm}\$, \$AC=6,\\mathrm{cm}\$인 직각삼각형이고, 원 \$O\$는 \$\\triangle ABC\$의 내접원이다. 세 접점을 각각 \$D\$, \$E\$, \$F\$라 할 때, 원 \$O\$의 반지름의 길이는?

### 선지

① \$1,\\mathrm{cm}\$ ② \$\\dfrac{3}{2},\\mathrm{cm}\$ ③ \$\\dfrac{5}{3},\\mathrm{cm}\$ ④ \$\\dfrac{7}{4},\\mathrm{cm}\$ ⑤ \$2,\\mathrm{cm}\$

### 정답

⑤

### 해설

피타고라스 정리에 의해 빗변의 길이는 \$\$ AB \= \\sqrt{6^2+8^2} \= 10,\\mathrm{cm} \$\$ 원 \$O\$의 반지름의 길이를 \$r,\\mathrm{cm}\$라 하자. \$\\triangle ABC\$의 넓이는 \$\\dfrac{1}{2}\\times 6\\times 8 \= 24,\\mathrm{cm}^2\$이고, 둘레의 길이는 \$6+8+10=24,\\mathrm{cm}\$이므로 \$\$ \\dfrac{1}{2}\\times r\\times (6+8+10) \= 24 \\implies 12r \= 24 \\implies r \= 2 \$\$ 따라서 원 \$O\$의 반지름의 길이는 \$2,\\mathrm{cm}\$이므로 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "∠C=90°, BC=8cm, AC=6cm인 직각삼각형 ABC의 내접원 O", "viewBox": [0, 0, 240, 190], "circles": [{"center": "O", "radius": 36}], "vertices": {"C": [45, 155], "B": [189, 155], "A": [45, 47], "O": [81, 119]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"]], "rightAngles": [["A", "C", "B"]], "labels": {"BC": "8cm", "AC": "6cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.4, "crossConcepts": ["CC_INSCRIBED_CIRCLE", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형이고", "src": "stem"}, {"term": "길이", "quote": "$BC=8\\,\\mathrm{cm}$, $AC=6\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "세 접점을 각각 $D$, $E$, $F$", "src": "stem"}], "goal": [{"term": "반지름", "quote": "반지름의 길이", "src": "stem"}], "method": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이는", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q20

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$DA\$, \$EB\$, \$DE\$는 지름이 \$AB\$인 반원 \$O\$의 접선이고, \$A\$, \$B\$, \$C\$는 접점이다. 점 \$C\$에서 \$AB\$에 내린 수선의 발을 \$F\$라 하자. \$DA=4,\\mathrm{cm}\$, \$EB=12,\\mathrm{cm}\$일 때, \$CF\$의 길이는?

### 선지

① \$5,\\mathrm{cm}\$ ② \$\\dfrac{11}{2},\\mathrm{cm}\$ ③ \$6,\\mathrm{cm}\$ ④ \$\\dfrac{13}{2},\\mathrm{cm}\$ ⑤ \$7,\\mathrm{cm}\$

### 정답

③

### 해설

점 \$D\$에서 반원에 그은 두 접선의 길이는 같으므로 \$DC=DA=4,\\mathrm{cm}\$이다. 마찬가지로 점 \$E\$에서도 \$CE=EB=12,\\mathrm{cm}\$이므로 \$DC:CE \= 4:12 \= 1:3\$이다. \$CF=x,\\mathrm{cm}\$라 하고, 점 \$C\$를 지나 \$AB\$와 평행한 직선을 그어 선분 \$AD\$의 연장선과 \$EB\$와 만나는 점을 잡으면 닮음인 두 직각삼각형이 생긴다. \$\$ DC : CE \= (x-4) : (12-x) \$\$ 이므로 \$1:3 \= (x-4):(12-x)\$이다. \$\$ 3(x-4) \= 12-x \\implies 4x \= 24 \\implies x \= 6 \$\$ 따라서 \$CF=6,\\mathrm{cm}\$이므로 정답은 ③이다.

```
{"kind": "geometry", "caption": "지름 AB인 반원 O의 접선 DA=4cm, EB=12cm, DE(접점 C)와 수선 CF", "viewBox": [0, 0, 260, 190], "vertices": {"A": [40, 155], "B": [220, 155], "O": [130, 155], "D": [40, 105], "E": [220, 35], "C": [85, 87], "F": [85, 155]}, "segments": [["A", "B"], ["A", "D"], ["B", "E"], ["D", "E"], ["C", "F"]], "arcs": [{"center": "O", "radius": 90, "startAngle": 0, "endAngle": 180}], "rightAngles": [["D", "A", "B"], ["E", "B", "A"], ["C", "F", "B"]], "labels": {"DA": "4cm", "EB": "12cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.8, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_TRIANGLE_SIMILARITY"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "반원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$DA=4\\,\\mathrm{cm}$, $EB=12\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "내린 수선의 발을 $F$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$CF$의 길이", "src": "stem"}], "method": [{"term": "닮음", "quote": "닮음인 두 직각삼각형", "src": "solution"}, {"term": "비례식", "quote": "$1:3 = (x-4):(12-x)$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 1\] 다음 직각삼각형 \$ABC\$(\$\\angle C=90^\\circ\$)에서 \$AC=4,\\mathrm{cm}\$, \$\\tan A=2\$일 때, \$\\cos A\$의 값을 구하는 과정과 답을 쓰시오.

### 선지

없음

### 정답

\$\\dfrac{\\sqrt{5}}{5}\$

### 해설

\$\\angle C=90^\\circ\$인 직각삼각형 \$ABC\$에서 \$\$ \\tan A \= \\dfrac{BC}{AC} \= 2 \$\$ \$AC=4,\\mathrm{cm}\$이므로 \$\\dfrac{BC}{4}=2\$, 즉 \$BC=8,\\mathrm{cm}\$이다. 피타고라스 정리에 의해 빗변 \$AB\$의 길이는 \$\$ AB \= \\sqrt{AC^2+BC^2} \= \\sqrt{4^2+8^2} \= \\sqrt{80} \= 4\\sqrt{5},\\mathrm{cm} \$\$ 따라서 \$\$ \\cos A \= \\dfrac{AC}{AB} \= \\dfrac{4}{4\\sqrt{5}} \= \\dfrac{\\sqrt{5}}{5} \$\$ 이다.

```
{"kind": "geometry", "caption": "∠C=90°, AC=4cm, tan A=2인 직각삼각형 ABC", "viewBox": [0, 0, 240, 190], "vertices": {"A": [40, 155], "C": [130, 155], "B": [130, 35]}, "segments": [["A", "C"], ["C", "B"], ["A", "B"]], "rightAngles": [["A", "C", "B"]], "labels": {"AC": "4cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.3, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AC=4\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "$\\tan A=2$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "$\\cos A$의 값", "src": "stem"}], "method": [{"term": "유리화", "quote": "\\dfrac{4}{4\\sqrt{5}} = \\dfrac{\\sqrt{5}}{5}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

\[서술형 2\] 다음 그림과 같이 두 지점 \$A\$와 \$B\$에서 하늘에 떠 있는 열기구 \$C\$를 올려본 각의 크기가 각각 \$45^\\circ\$와 \$60^\\circ\$이다. 두 지점 \$A\$와 \$B\$ 사이의 거리가 \$60,\\mathrm{m}\$일 때, 지면에서 열기구까지의 높이를 구하는 과정과 답을 쓰시오.

### 선지

없음

### 정답

\$(90-30\\sqrt{3}),\\mathrm{m}\$

### 해설

열기구의 위치 \$C\$에서 선분 \$AB\$에 내린 수선의 발을 \$H\$라 하고, 높이 \$CH\$를 \$h,\\mathrm{m}\$라 하자. 직각삼각형 \$ACH\$에서 \$\\tan 45^\\circ \= \\dfrac{CH}{AH} \= 1\$이므로 \$AH \= h\$이다. 직각삼각형 \$BCH\$에서 \$\\tan 60^\\circ \= \\dfrac{CH}{BH} \= \\sqrt{3}\$이므로 \$BH \= \\dfrac{h}{\\sqrt{3}}\$이다. \$AH \+ BH \= AB \= 60\$이므로 \$\$ h \+ \\dfrac{h}{\\sqrt{3}} \= 60 \\implies (\\sqrt{3}+1)h \= 60\\sqrt{3} \$\$ 양변을 \$\\sqrt{3}+1\$로 나누어 분모를 유리화하면 \$\$ h \= \\dfrac{60\\sqrt{3}}{\\sqrt{3}+1} \= \\dfrac{60\\sqrt{3}(\\sqrt{3}-1)}{(\\sqrt{3}+1)(\\sqrt{3}-1)} \= 30\\sqrt{3}(\\sqrt{3}-1) \= 90-30\\sqrt{3} \$\$ 따라서 지면에서 열기구까지의 높이는 \$(90-30\\sqrt{3}),\\mathrm{m}\$이다.

```
{"kind": "geometry", "caption": "두 지점 A, B(거리 60m)에서 열기구 C를 올려본 각 45°, 60°", "viewBox": [0, 0, 270, 190], "vertices": {"A": [30, 155], "B": [240, 155], "C": [163, 22], "H": [163, 155]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"], ["C", "H"]], "rightAngles": [["C", "H", "B"]], "labels": {"AB": "60m", "A": "45°", "B": "60°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.8, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "거리가 $60\\,\\mathrm{m}$", "src": "stem"}, {"term": "각", "quote": "각각 $45^\\circ$와 $60^\\circ$", "src": "stem"}], "condition": [{"term": "수선", "quote": "내린 수선의 발을 $H$", "src": "solution"}], "goal": [{"term": "높이", "quote": "열기구까지의 높이", "src": "stem"}], "method": [{"term": "유리화", "quote": "분모를 유리화하면", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q23

- 형식: 서답형  
- 배점: 4

### 발문

\[서술형 3\] 다음은 원 모양의 도자기 접시가 세 조각으로 깨진 것이다. 세 학생이 원의 중심을 찾아 깨지기 전의 접시 모양을 복원하려고 한다. 아래의 세 학생 중에서 옳게 말한 사람을 찾고, 원의 중심을 찾는 방법을 설명하시오. 민호: 조각 ①은 너무 작아서 중심을 찾을 수 없어. 지아: 중심은 조각 ② 안에 들어 있으니까 조각 ②가 꼭 있어야 해. 서윤: 세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.

### 선지

없음

### 정답

서윤

### 해설

옳게 말한 학생은 **서윤**이다. 원의 현의 수직이등분선은 항상 원의 중심을 지난다. 깨진 조각 중 어느 하나라도 원호의 일부가 남아 있으므로, 그 호 위에서 서로 다른 세 점 \$A\$, \$B\$, \$C\$를 잡고 두 현 \$AB\$, \$BC\$를 긋는다. 현 \$AB\$의 수직이등분선과 현 \$BC\$의 수직이등분선을 작도하여 연장하면, 두 수직이등분선이 만나는 교점이 깨지기 전 원의 중심이 된다. 중심이 조각 바깥에 있더라도 수직이등분선을 연장하면 교점을 구할 수 있으므로 어느 조각을 이용해도 중심을 찾을 수 있다.

```
{"kind": "geometry", "caption": "세 조각 ①, ②, ③으로 깨진 원형 도자기 접시", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110]}, "segments": [], "labels": {"1": "조각 ①", "2": "조각 ②", "3": "조각 ③"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "현의 수직이등분선과 중심"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_CIRCLE_CENTER_CONSTRUCTION", "CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 모양", "src": "stem"}, {"term": "호", "quote": "원호의 일부", "src": "solution"}], "condition": [{"term": "현", "quote": "두 현 $AB$, $BC$", "src": "solution"}], "goal": [{"term": "원", "quote": "원의 중심을 찾는 방법", "src": "stem"}], "method": [{"term": "수직이등분선", "quote": "현의 수직이등분선", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 4\] 다음 그림에서 두 반직선 \$PA\$, \$PB\$는 원 \$O\$의 접선이고 두 점 \$A\$, \$B\$는 각각 그 접점이다. \$\\angle APB=60^\\circ\$, \$PA=3\\sqrt{3},\\mathrm{cm}\$일 때, 어두운 부분(사각형 \$PAOB\$에서 부채꼴 \$AOB\$를 제외한 부분)의 넓이를 구하는 과정과 답을 쓰시오.

### 선지

없음

### 정답

\$(9\\sqrt{3}-3\\pi),\\mathrm{cm}^2\$

### 해설

접선과 반지름은 접점에서 수직이므로 \$\\angle OAP=\\angle OBP=90^\\circ\$이다. 두 직각삼각형 \$OAP\$, \$OBP\$는 \$OA=OB\$, \$OP\$가 공통이므로 합동이고 \$\\angle APO=\\dfrac{1}{2}\\angle APB=30^\\circ\$이다. 직각삼각형 \$OAP\$에서 반지름 \$OA\$의 길이는 \$\$ OA \= PA\\tan 30^\\circ \= 3\\sqrt{3}\\times\\dfrac{\\sqrt{3}}{3} \= 3,\\mathrm{cm} \$\$ 사각형 \$PAOB\$에서 \$\\angle AOB \= 360^\\circ \- 90^\\circ \- 90^\\circ \- 60^\\circ \= 120^\\circ\$이다. 사각형 \$PAOB\$의 넓이는 \$\$ 2\\times\\triangle OAP \= 2\\times\\left(\\dfrac{1}{2}\\times 3\\sqrt{3}\\times 3\\right) \= 9\\sqrt{3},\\mathrm{cm}^2 \$\$ 부채꼴 \$AOB\$의 넓이는 \$\$ \\pi\\times 3^2\\times\\dfrac{120^\\circ}{360^\\circ} \= 3\\pi,\\mathrm{cm}^2 \$\$ 따라서 어두운 부분의 넓이는 \$(9\\sqrt{3}-3\\pi),\\mathrm{cm}^2\$이다.

```
{"kind": "geometry", "caption": "원 O의 접선 PA, PB (∠APB=60°, PA=3√3cm)와 사각형 PAOB에서 부채꼴 AOB를 제외한 어두운 부분", "viewBox": [0, 0, 240, 200], "circles": [{"center": "O", "radius": 55}], "vertices": {"O": [160, 100], "P": [50, 100], "A": [132.5, 52.4], "B": [132.5, 147.6]}, "segments": [["P", "A"], ["P", "B"], ["O", "A"], ["O", "B"]], "rightAngles": [["O", "A", "P"], ["O", "B", "P"]], "labels": {"P": "60°", "PA": "3√3cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.4, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_CIRCLE_SECTOR_AREA"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$PA=3\\sqrt{3}\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle APB=60^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "어두운 부분(사각형 $PAOB$에서 부채꼴 $AOB$를 제외한 부분)의 넓이", "src": "stem"}], "method": [{"term": "부채꼴", "quote": "부채꼴 $AOB$의 넓이", "src": "solution"}, {"term": "사각형", "quote": "사각형 $PAOB$의 넓이", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

