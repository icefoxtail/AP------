

```
{"stem": "25_연향중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/25_연향중_2학기_중간_중3_수학.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림의 직각삼각형 \$ABC\$(\$\\angle B=90^\\circ\$)에서 \$AB=4\$, \$AC=6\$이고 변 \$BC\$의 중점을 \$D\$라 하자. \$\\angle BAD=x\$일 때, \$\\sin x\$의 값은?

### 선지

① \$\\dfrac{\\sqrt{105}}{19}\$ ② \$\\dfrac{\\sqrt{105}}{20}\$ ③ \$\\dfrac{\\sqrt{105}}{21}\$ ④ \$\\dfrac{\\sqrt{105}}{22}\$ ⑤ \$\\dfrac{\\sqrt{105}}{23}\$

### 정답

③

### 해설

\$\\angle B=90^\\circ\$, \$AB=4\$, \$AC=6\$이므로 피타고라스 정리에 의해 \$\$ BC \= \\sqrt{6^2-4^2} \= \\sqrt{20} \= 2\\sqrt{5} \$\$ 점 \$D\$는 \$BC\$의 중점이므로 \$BD=\\sqrt{5}\$이다. 직각삼각형 \$ABD\$에서 \$AD \= \\sqrt{AB^2+BD^2} \= \\sqrt{4^2+(\\sqrt{5})^2} \= \\sqrt{21}\$이므로 \$\$ \\sin x \= \\dfrac{BD}{AD} \= \\dfrac{\\sqrt{5}}{\\sqrt{21}} \= \\dfrac{\\sqrt{105}}{21} \$\$ 따라서 정답은 ③이다.

```
{"kind": "geometry", "caption": "∠B=90°, AB=4, AC=6인 직각삼각형 ABC와 BC의 중점 D (∠BAD=x)", "viewBox": [0, 0, 260, 190], "vertices": {"B": [40, 150], "C": [220, 150], "A": [40, 40], "D": [130, 150]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"], ["A", "D"]], "rightAngles": [["A", "B", "C"]], "labels": {"AB": "4", "AC": "6", "x": "∠BAD"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "중점", "quote": "중점을 $D$", "src": "stem"}], "condition": [{"term": "길이", "quote": "$AB=4$, $AC=6$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "$\\sin x$의 값", "src": "stem"}], "method": [{"term": "유리화", "quote": "\\dfrac{\\sqrt{5}}{\\sqrt{21}} = \\dfrac{\\sqrt{105}}{21}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

\$\\angle A+\\angle B=90^\\circ\$인 직각삼각형 \$ABC\$에서 \$4\\sin A=-\\sin A+3\$일 때, \$\\tan A\\times\\dfrac{1}{\\cos B}+\\tan A\\times\\sin A\$의 값은?

### 선지

① \$\\dfrac{17}{10}\$ ② \$\\dfrac{19}{10}\$ ③ \$\\dfrac{13}{10}\$ ④ \$\\dfrac{21}{20}\$ ⑤ \$\\dfrac{23}{20}\$

### 정답

①

### 해설

\$4\\sin A=-\\sin A+3\$에서 \$5\\sin A=3\$이므로 \$\\sin A=\\dfrac{3}{5}\$이다. \$A\$는 예각이므로 \$\\cos A=\\dfrac{4}{5}\$, \$\\tan A=\\dfrac{3}{4}\$이고, \$\\angle A+\\angle B=90^\\circ\$이므로 \$\\cos B=\\sin A=\\dfrac{3}{5}\$이다. 따라서 \$\$ \\tan A\\cdot\\dfrac{1}{\\cos B}+\\tan A\\cdot\\sin A \= \\dfrac{3}{4}\\cdot\\dfrac{5}{3}+\\dfrac{3}{4}\\cdot\\dfrac{3}{5} \= \\dfrac{5}{4}+\\dfrac{9}{20} \= \\dfrac{34}{20} \= \\dfrac{17}{10} \$\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.1, "crossConcepts": ["CC_COMPLEMENTARY_ANGLE_TRIG", "CC_TRIG_RATIO_DEFINITIONS"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "각", "quote": "$\\angle A+\\angle B=90^\\circ$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "$4\\sin A=-\\sin A+3$", "src": "stem"}], "goal": [{"term": "합", "quote": "\\tan A\\times\\dfrac{1}{\\cos B}+\\tan A\\times\\sin A", "src": "stem"}], "method": [{"term": "예각", "quote": "$A$는 예각", "src": "solution"}, {"term": "대입", "quote": "\\dfrac{3}{4}\\cdot\\dfrac{5}{3}+\\dfrac{3}{4}\\cdot\\dfrac{3}{5}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\angle B=30^\\circ\$, \$\\angle C=90^\\circ\$인 직각삼각형 \$ABC\$에서 \$\\dfrac{1}{1-\\tan A}+\\dfrac{1}{1+\\tan A}\$의 값은?

### 선지

① \$-3\$ ② \$-\\sqrt{3}\$ ③ \$-\\dfrac{\\sqrt{3}}{3}\$ ④ \$1\$ ⑤ \$-1\$

### 정답

⑤

### 해설

\$\\angle A \= 180^\\circ \- 30^\\circ \- 90^\\circ \= 60^\\circ\$이므로 \$\\tan A \= \\tan 60^\\circ \= \\sqrt{3}\$이다. 두 분수를 통분하여 정리하면 \$\$ \\dfrac{1}{1-\\tan A}+\\dfrac{1}{1+\\tan A} \= \\dfrac{(1+\\tan A)+(1-\\tan A)}{1-\\tan^2 A} \= \\dfrac{2}{1-3} \= \\dfrac{2}{-2} \= \-1 \$\$ 따라서 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "∠B=30°, ∠C=90°인 직각삼각형 ABC", "viewBox": [0, 0, 260, 170], "vertices": {"B": [30, 140], "C": [220, 140], "A": [220, 30]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"B": "30°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_TRIG_RATIO", "CC_ALGEBRAIC_FRACTION_SIMPLIFY"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "각", "quote": "$\\angle B=30^\\circ$, $\\angle C=90^\\circ$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "\\tan A = \\tan 60^\\circ = \\sqrt{3}", "src": "solution"}], "goal": [{"term": "합", "quote": "\\dfrac{1}{1-\\tan A}+\\dfrac{1}{1+\\tan A}", "src": "stem"}], "method": [{"term": "대입", "quote": "\\dfrac{2}{1-3}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

\$\\sin(2x-15^\\circ)=\\dfrac{\\sqrt{2}}{2}\$일 때, \$\\angle x\$의 크기는? (단, \$10^\\circ \< \\angle x \< 50^\\circ\$이다.)

### 선지

① \$25^\\circ\$ ② \$30^\\circ\$ ③ \$35^\\circ\$ ④ \$40^\\circ\$ ⑤ \$45^\\circ\$

### 정답

②

### 해설

\$10^\\circ \< x \< 50^\\circ\$이므로 \$5^\\circ \< 2x-15^\\circ \< 85^\\circ\$이다. 이 범위에서 \$\\sin 45^\\circ \= \\dfrac{\\sqrt{2}}{2}\$이므로 \$\$ 2x \- 15^\\circ \= 45^\\circ \\implies 2x \= 60^\\circ \\implies x \= 30^\\circ \$\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.2, "crossConcepts": ["CC_TRIG_RATIO"], "conditions": ["COND_RESTRICTED_INTERVAL"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "\\sin(2x-15^\\circ)=\\dfrac{\\sqrt{2}}{2}", "src": "stem"}], "condition": [{"term": "예각", "quote": "$10^\\circ < \\angle x < 50^\\circ$", "src": "stem"}], "goal": [{"term": "각", "quote": "$\\angle x$의 크기", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\sin 45^\\circ = \\dfrac{\\sqrt{2}}{2}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 반지름의 길이가 \$1\$이고 중심각의 크기가 \$40^\\circ\$인 부채꼴 \$AOB\$에서 \$AH \\perp OB\$일 때, 선분 \$BH\$의 길이는?

### 선지

① \$\\sin 40^\\circ\$ ② \$\\cos 40^\\circ\$ ③ \$1-\\sin 40^\\circ\$ ④ \$1-\\cos 40^\\circ\$ ⑤ \$\\tan 40^\\circ\$

### 정답

④

### 해설

\$OA=OB=1\$이고 \$AH \\perp OB\$이므로 직각삼각형 \$AOH\$에서 \$\$ \\cos 40^\\circ \= \\dfrac{OH}{OA} \= OH \$\$ 따라서 \$BH \= OB \- OH \= 1 \- \\cos 40^\\circ\$이므로 정답은 ④이다.

```
{"kind": "geometry", "caption": "반지름 1, 중심각 40°인 부채꼴 AOB와 수선 AH", "viewBox": [0, 0, 240, 190], "vertices": {"O": [40, 155], "B": [200, 155], "A": [162, 52], "H": [162, 155]}, "segments": [["O", "B"], ["O", "A"], ["A", "H"]], "arcs": [{"center": "O", "radius": 160, "startAngle": 0, "endAngle": 40}], "rightAngles": [["A", "H", "O"]], "labels": {"OA": "1", "O": "40°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "각을 이용한 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.3, "crossConcepts": ["CC_UNIT_QUARTER_CIRCLE", "CC_TRIG_RATIO_DEFINITIONS"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "부채꼴", "quote": "부채꼴 $AOB$", "src": "stem"}, {"term": "반지름", "quote": "반지름의 길이가 $1$", "src": "stem"}], "condition": [{"term": "중심각", "quote": "중심각의 크기가 $40^\\circ$", "src": "stem"}], "goal": [{"term": "길이", "quote": "선분 $BH$의 길이", "src": "stem"}], "method": [{"term": "차", "quote": "OB - OH = 1 - \\cos 40^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

\$\\tan x=\\sqrt{3}\$이고 \$\\sin y=\\dfrac{1}{2}\$일 때, \$\\cos(x-y)\$의 값은? (단, \$0^\\circ \< \\angle x \< 90^\\circ\$, \$0^\\circ \< \\angle y \< 90^\\circ\$이다.)

### 선지

① \$\\dfrac{\\sqrt{3}}{2}\$ ② \$\\dfrac{\\sqrt{2}}{2}\$ ③ \$\\dfrac{1}{2}\$ ④ \$0\$ ⑤ \$1\$

### 정답

①

### 해설

\$x\$, \$y\$가 모두 예각이므로 \$\\tan 60^\\circ=\\sqrt{3}\$에서 \$x=60^\\circ\$, \$\\sin 30^\\circ=\\dfrac{1}{2}\$에서 \$y=30^\\circ\$이다. 따라서 \$x-y=30^\\circ\$이므로 \$\\cos(x-y) \= \\cos 30^\\circ \= \\dfrac{\\sqrt{3}}{2}\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.8, "crossConcepts": ["CC_TRIG_RATIO"], "conditions": ["COND_RESTRICTED_INTERVAL"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "$\\tan x=\\sqrt{3}$이고 $\\sin y=\\dfrac{1}{2}$", "src": "stem"}], "condition": [{"term": "예각", "quote": "$0^\\circ < \\angle x < 90^\\circ$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "\\cos(x-y)", "src": "stem"}], "method": [{"term": "차", "quote": "x-y=30^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

다음 보기의 삼각비의 값을 작은 것부터 차례로 나열한 것은?

\<보기\> ㄱ. \$\\sin 45^\\circ\$　ㄴ. \$\\tan 70^\\circ\$　ㄷ. \$\\cos 65^\\circ\$　ㄹ. \$\\tan 45^\\circ\$　ㅁ. \$\\sin 80^\\circ\$

### 선지

① ㄱ\-ㄷ-ㅁ-ㄹ-ㄴ ② ㄷ\-ㅁ-ㄱ-ㄹ-ㄴ ③ ㄷ\-ㄱ-ㅁ-ㄹ-ㄴ ④ ㄷ\-ㄱ-ㄹ-ㅁ-ㄴ ⑤ ㄱ\-ㅁ-ㄷ-ㄹ-ㄴ

### 정답

③

### 해설

각 삼각비의 대소를 비교하면 다음과 같다.

- ㄷ: \$\\cos 65^\\circ \< \\cos 45^\\circ \= \\dfrac{\\sqrt{2}}{2}\$  
- ㄱ: \$\\sin 45^\\circ \= \\dfrac{\\sqrt{2}}{2}\$  
- ㅁ: \$45^\\circ \< 80^\\circ \< 90^\\circ\$이므로 \$\\dfrac{\\sqrt{2}}{2} \< \\sin 80^\\circ \< 1\$  
- ㄹ: \$\\tan 45^\\circ \= 1\$  
- ㄴ: \$70^\\circ \> 45^\\circ\$이므로 \$\\tan 70^\\circ \> \\tan 45^\\circ \= 1\$ 따라서 작은 것부터 나열하면 ㄷ\-ㄱ-ㅁ-ㄹ-ㄴ이므로 정답은 ③이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_TRIG_RATIO_ORDER"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "삼각비의 값", "src": "stem"}], "condition": [{"term": "예각", "quote": "$45^\\circ < 80^\\circ < 90^\\circ$", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "작은 것부터 차례로 나열", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos 65^\\circ < \\cos 45^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q08

- 형식: 객관식  
- 배점: 3

### 발문

다음 삼각비의 표를 이용하여 \$\\tan x^\\circ=0.2493\$, \$\\cos 15^\\circ=y\$일 때, \$x+y\$의 값을 구하면?

| 각도 | \$\\sin\$ | \$\\cos\$ | \$\\tan\$ |
| :---: | :---: | :---: | :---: |
| \$14^\\circ\$ | \$0.2419\$ | \$0.9703\$ | \$0.2493\$ |
| \$15^\\circ\$ | \$0.2588\$ | \$0.9659\$ | \$0.2679\$ |
| \$16^\\circ\$ | \$0.2756\$ | \$0.9613\$ | \$0.2867\$ |

### 선지

① \$13.9659\$ ② \$14.9659\$ ③ \$14.9703\$ ④ \$15.9659\$ ⑤ \$15.9613\$

### 정답

②

### 해설

표에서 \$\\tan 14^\\circ \= 0.2493\$이므로 \$x=14\$이다. 또 \$\\cos 15^\\circ \= 0.9659\$이므로 \$y=0.9659\$이다. 따라서 \$x+y \= 14 \+ 0.9659 \= 14.9659\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.3, "crossConcepts": ["CC_TRIG_TABLE_LOOKUP"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "삼각비의 표", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "$\\tan x^\\circ=0.2493$, $\\cos 15^\\circ=y$", "src": "stem"}], "goal": [{"term": "합", "quote": "$x+y$의 값", "src": "stem"}], "method": [{"term": "합", "quote": "14 + 0.9659 = 14.9659", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\angle C=90^\\circ\$, \$AB=8\$, \$\\angle B=32^\\circ\$인 직각삼각형 \$ABC\$에서 \$a+b\$의 값은? (단, \$\\sin 32^\\circ=0.53\$, \$\\cos 32^\\circ=0.85\$, \$\\tan 32^\\circ=0.62\$로 계산한다.)

### 선지

① \$10.96\$ ② \$10.98\$ ③ \$11.00\$ ④ \$11.02\$ ⑤ \$11.04\$

### 정답

⑤

### 해설

빗변이 \$AB=8\$이고 \$\\angle B=32^\\circ\$이므로 \$\$ a \= 8\\sin 32^\\circ \= 8\\times 0.53 \= 4.24, \\qquad b \= 8\\cos 32^\\circ \= 8\\times 0.85 \= 6.80 \$\$ 따라서 \$a+b \= 4.24 \+ 6.80 \= 11.04\$이므로 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "∠C=90°, AB=8, ∠B=32°, AC=a, BC=b인 직각삼각형 ABC", "viewBox": [0, 0, 260, 170], "vertices": {"B": [30, 140], "C": [210, 140], "A": [210, 35]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"AB": "8", "AC": "a", "BC": "b", "B": "32°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.1, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=8$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=32^\\circ$", "src": "stem"}], "goal": [{"term": "합", "quote": "$a+b$의 값", "src": "stem"}], "method": [{"term": "삼각비", "quote": "8\\sin 32^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 지면에 수직으로 서 있는 건물로부터 \$40,\\mathrm{m}\$ 떨어진 지점에서 건물의 꼭대기를 올려다본 각의 크기가 \$42^\\circ\$이다. 사람의 눈높이가 \$1.6,\\mathrm{m}\$일 때, 이 건물의 높이는? (단, \$\\sin 42^\\circ=0.67\$, \$\\cos 42^\\circ=0.74\$, \$\\tan 42^\\circ=0.90\$으로 계산한다.)

### 선지

① \$34.6,\\mathrm{m}\$ ② \$35.6,\\mathrm{m}\$ ③ \$36.6,\\mathrm{m}\$ ④ \$37.6,\\mathrm{m}\$ ⑤ \$38.6,\\mathrm{m}\$

### 정답

④

### 해설

눈높이에서 건물 꼭대기까지의 높이를 \$h,\\mathrm{m}\$라 하면 수평거리가 \$40,\\mathrm{m}\$이므로 \$\$ \\tan 42^\\circ \= \\dfrac{h}{40} \\implies h \= 40\\times 0.90 \= 36,\\mathrm{m} \$\$ 건물의 전체 높이는 눈높이 \$1.6,\\mathrm{m}\$를 더하여 \$36 \+ 1.6 \= 37.6,\\mathrm{m}\$이다. 따라서 정답은 ④이다.

```
{"kind": "geometry", "caption": "40m 떨어진 지점에서 눈높이 1.6m, 올려다본 각 42°로 건물 높이 측정", "viewBox": [0, 0, 270, 190], "vertices": {"P": [40, 140], "Q": [210, 140], "R": [210, 35]}, "segments": [["P", "Q"], ["Q", "R"], ["P", "R"]], "rightAngles": [["P", "Q", "R"]], "labels": {"PQ": "40m", "P": "42°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.2, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_TRIG_MEASUREMENT"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "$40\\,\\mathrm{m}$ 떨어진", "src": "stem"}, {"term": "각", "quote": "$42^\\circ$", "src": "stem"}], "condition": [{"term": "높이", "quote": "눈높이가 $1.6\\,\\mathrm{m}$", "src": "stem"}], "goal": [{"term": "높이", "quote": "건물의 높이", "src": "stem"}], "method": [{"term": "합", "quote": "36 + 1.6 = 37.6", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q11

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림과 같이 \$AB=6,\\mathrm{cm}\$, \$BC=12,\\mathrm{cm}\$, \$\\angle B=60^\\circ\$인 \$\\triangle ABC\$의 넓이는?

### 선지

① \$18\\sqrt{3},\\mathrm{cm}^2\$ ② \$18\\sqrt{2},\\mathrm{cm}^2\$ ③ \$20\\sqrt{3},\\mathrm{cm}^2\$ ④ \$24\\sqrt{3},\\mathrm{cm}^2\$ ⑤ \$36\\sqrt{3},\\mathrm{cm}^2\$

### 정답

①

### 해설

\$A\$에서 \$BC\$에 내린 수선의 길이를 \$h\$라 하면 \$\$ h \= AB\\sin 60^\\circ \= 6\\times\\dfrac{\\sqrt{3}}{2} \= 3\\sqrt{3},\\mathrm{cm} \$\$ 따라서 \$\\triangle ABC\$의 넓이는 \$\\dfrac{1}{2}\\times 12\\times 3\\sqrt{3} \= 18\\sqrt{3},\\mathrm{cm}^2\$이므로 정답은 ①이다.

```
{"kind": "geometry", "caption": "AB=6cm, BC=12cm, ∠B=60°인 △ABC", "viewBox": [0, 0, 260, 180], "vertices": {"B": [35, 145], "C": [225, 145], "A": [90, 45]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"]], "labels": {"AB": "6cm", "BC": "12cm", "B": "60°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.9, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=6\\,\\mathrm{cm}$, $BC=12\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=60^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이", "src": "stem"}], "method": [{"term": "삼각비", "quote": "AB\\sin 60^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q12

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 반지름의 길이가 \$6,\\mathrm{cm}\$인 원 \$O\$에 내접하는 \$\\triangle ABC\$에서 \$\\widehat{AB}:\\widehat{BC}:\\widehat{CA}=3:4:2\$일 때, \$\\triangle ABO\$의 넓이는?

### 선지

① \$6\\sqrt{3},\\mathrm{cm}^2\$ ② \$8\\sqrt{3},\\mathrm{cm}^2\$ ③ \$9\\sqrt{3},\\mathrm{cm}^2\$ ④ \$12\\sqrt{3},\\mathrm{cm}^2\$ ⑤ \$18\\sqrt{3},\\mathrm{cm}^2\$

### 정답

③

### 해설

한 원에서 호의 길이의 비는 중심각의 크기의 비와 같으므로 \$\$ \\angle AOB \= 360^\\circ \\times \\dfrac{3}{3+4+2} \= 120^\\circ \$\$ 점 \$O\$에서 \$AB\$에 내린 수선의 발을 \$M\$이라 하면 \$OA=OB=6,\\mathrm{cm}\$이므로 \$\\angle AOM=60^\\circ\$이다. \$\$ OM \= 6\\cos 60^\\circ \= 3,\\mathrm{cm}, \\qquad AM \= 6\\sin 60^\\circ \= 3\\sqrt{3},\\mathrm{cm} \$\$ 따라서 \$AB \= 2AM \= 6\\sqrt{3},\\mathrm{cm}\$이므로 \$\\triangle ABO\$의 넓이는 \$\\dfrac{1}{2}\\times 6\\sqrt{3}\\times 3 \= 9\\sqrt{3},\\mathrm{cm}^2\$이다. 정답은 ③이다.

```
{"kind": "geometry", "caption": "반지름 6cm인 원 O에 내접하는 △ABC (호 AB:BC:CA=3:4:2)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [41, 70], "B": [179, 70], "C": [140, 184]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"], ["O", "A"], ["O", "B"]], "labels": {"OA": "6cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.4, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG", "CC_CIRCLE_PROPERTIES"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "호", "quote": "$\\widehat{AB}:\\widehat{BC}:\\widehat{CA}=3:4:2$", "src": "stem"}], "condition": [{"term": "반지름", "quote": "반지름의 길이가 $6\\,\\mathrm{cm}$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ABO$의 넓이", "src": "stem"}], "method": [{"term": "중심각", "quote": "중심각의 크기의 비", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q13

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 \$AB=6\\sqrt{2}\$, \$BC=16\$, \$CD=8\$, \$\\angle ABC=45^\\circ\$, \$\\angle ACD=30^\\circ\$인 사각형 \$ABCD\$의 넓이는?

### 선지

① \$4(6+\\sqrt{34})\$ ② \$4(12+\\sqrt{34})\$ ③ \$8(6+\\sqrt{34})\$ ④ \$4(12+\\sqrt{17})\$ ⑤ \$8(12+\\sqrt{34})\$

### 정답

②

### 해설

\$A\$에서 \$BC\$에 내린 수선의 발을 \$H\$라 하면 \$AB=6\\sqrt{2}\$, \$\\angle ABC=45^\\circ\$이므로 \$AH=BH=6\$이다. \$BC=16\$이므로 \$HC=16-6=10\$이고, 직각삼각형 \$AHC\$에서 \$AC=\\sqrt{6^2+10^2}=\\sqrt{136}=2\\sqrt{34}\$이다. \$\\triangle ABC\$의 넓이는 \$\\dfrac{1}{2}\\times 16\\times 6 \= 48\$이다. \$\\triangle ACD\$의 넓이는 \$\\dfrac{1}{2}\\times AC\\times CD\\times\\sin 30^\\circ \= \\dfrac{1}{2}\\times 2\\sqrt{34}\\times 8\\times\\dfrac{1}{2} \= 4\\sqrt{34}\$이다. 따라서 사각형 \$ABCD\$의 넓이는 \$48 \+ 4\\sqrt{34} \= 4(12+\\sqrt{34})\$이므로 정답은 ②이다.

```
{"kind": "geometry", "caption": "AB=6√2, BC=16, CD=8, ∠ABC=45°, ∠ACD=30°인 사각형 ABCD", "viewBox": [0, 0, 270, 200], "vertices": {"B": [30, 165], "C": [230, 165], "A": [105, 90], "D": [220, 35]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]], "labels": {"AB": "6√2", "BC": "16", "CD": "8", "B": "45°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.1, "crossConcepts": ["CC_QUADRILATERAL_AREA_TRIG", "CC_AUXILIARY_ALTITUDE"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사각형", "quote": "사각형 $ABCD$", "src": "stem"}, {"term": "길이", "quote": "$AB=6\\sqrt{2}$, $BC=16$, $CD=8$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle ABC=45^\\circ$, $\\angle ACD=30^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "사각형 $ABCD$의 넓이", "src": "stem"}], "method": [{"term": "수선", "quote": "내린 수선의 발을 $H$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림의 원 \$O\$에서 \$AB \\perp OM\$이고 \$OA=8,\\mathrm{cm}\$, \$OM=3,\\mathrm{cm}\$일 때, 현 \$AB\$의 길이는?

### 선지

① \$8,\\mathrm{cm}\$ ② \$10,\\mathrm{cm}\$ ③ \$2\\sqrt{35},\\mathrm{cm}\$ ④ \$4\\sqrt{13},\\mathrm{cm}\$ ⑤ \$2\\sqrt{55},\\mathrm{cm}\$

### 정답

⑤

### 해설

원의 중심에서 현에 내린 수선은 현을 이등분하므로 \$AM=BM\$이다. 직각삼각형 \$OAM\$에서 \$AM \= \\sqrt{8^2-3^2} \= \\sqrt{55},\\mathrm{cm}\$이므로 \$\$ AB \= 2AM \= 2\\sqrt{55},\\mathrm{cm} \$\$ 따라서 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "원 O에서 AB⊥OM, OA=8cm, OM=3cm", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "M": [110, 140], "A": [36, 140], "B": [184, 140]}, "segments": [["A", "B"], ["O", "M"], ["O", "A"]], "rightAngles": [["O", "M", "A"]], "labels": {"OA": "8cm", "OM": "3cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "길이", "quote": "$OA=8\\,\\mathrm{cm}$, $OM=3\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "$AB \\perp OM$", "src": "stem"}], "goal": [{"term": "현", "quote": "현 $AB$의 길이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $OAM$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$\\widehat{AB}\$는 원의 일부분이다. \$CD\$가 현 \$AB\$의 수직이등분선이고 \$AD=6\$, \$CD=3\$일 때, 이 원의 반지름의 길이는?

### 선지

① \$6\$ ② \$\\dfrac{13}{2}\$ ③ \$7\$ ④ \$\\dfrac{15}{2}\$ ⑤ \$8\$

### 정답

④

### 해설

\$CD\$는 현 \$AB\$의 수직이등분선이므로 원의 중심 \$O\$는 직선 \$CD\$ 위에 있다. 반지름을 \$r\$이라 하면 \$OC=r\$, \$OD=r-3\$이다. 직각삼각형 \$OAD\$에서 피타고라스 정리에 의해 \$\$ r^2 \= (r-3)^2 \+ 6^2 \\implies r^2 \= r^2 \- 6r \+ 9 \+ 36 \\implies 6r \= 45 \\implies r \= \\dfrac{15}{2} \$\$ 따라서 정답은 ④이다.

```
{"kind": "geometry", "caption": "호 AB와 현 AB의 수직이등분선 CD (AD=6, CD=3)", "viewBox": [0, 0, 240, 170], "vertices": {"A": [40, 130], "B": [200, 130], "D": [120, 130], "C": [120, 70]}, "segments": [["A", "B"], ["C", "D"]], "rightAngles": [["C", "D", "B"]], "labels": {"AD": "6", "CD": "3"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "현의 수직이등분선과 중심"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "호", "quote": "$\\widehat{AB}$는 원의 일부분", "src": "stem"}, {"term": "수직이등분선", "quote": "현 $AB$의 수직이등분선", "src": "stem"}], "condition": [{"term": "길이", "quote": "$AD=6$, $CD=3$", "src": "stem"}], "goal": [{"term": "반지름", "quote": "반지름의 길이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $OAD$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 반지름의 길이가 \$6,\\mathrm{cm}\$인 원 \$O\$ 위의 한 점이 원의 중심 \$O\$에 오도록 접었을 때, 접히는 선분 \$AB\$의 길이는?

### 선지

① \$6\\sqrt{2},\\mathrm{cm}\$ ② \$6\\sqrt{3},\\mathrm{cm}\$ ③ \$8\\sqrt{2},\\mathrm{cm}\$ ④ \$9,\\mathrm{cm}\$ ⑤ \$10,\\mathrm{cm}\$

### 정답

②

### 해설

원 위의 점을 \$P\$라 하면 \$OP=6,\\mathrm{cm}\$이고, 접는 선 \$AB\$는 \$OP\$의 수직이등분선이다. \$AB\$와 \$OP\$의 교점을 \$M\$이라 하면 \$OM=3,\\mathrm{cm}\$, \$OA=6,\\mathrm{cm}\$이므로 \$\$ AM \= \\sqrt{6^2-3^2} \= 3\\sqrt{3},\\mathrm{cm} \$\$ 따라서 \$AB \= 2AM \= 6\\sqrt{3},\\mathrm{cm}\$이므로 정답은 ②이다.

```
{"kind": "geometry", "caption": "반지름 6cm인 원 O의 둘레 위의 점이 중심 O에 오도록 접은 현 AB", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [41, 150], "B": [179, 150]}, "segments": [["A", "B"]], "labels": {"O": "중심"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.1, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_PAPER_FOLDING_SIMILARITY"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "반지름", "quote": "반지름의 길이가 $6\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수직이등분선", "quote": "$OP$의 수직이등분선", "src": "solution"}], "goal": [{"term": "길이", "quote": "선분 $AB$의 길이", "src": "stem"}], "method": [{"term": "현", "quote": "접는 선 $AB$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q17

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림과 같이 원 \$O\$의 두 현 \$AB\$, \$AC\$가 원의 중심 \$O\$로부터 같은 거리에 있다. \$\\angle MON=124^\\circ\$일 때, \$\\angle B\$의 크기는?

### 선지

① \$62^\\circ\$ ② \$64^\\circ\$ ③ \$66^\\circ\$ ④ \$68^\\circ\$ ⑤ \$70^\\circ\$

### 정답

①

### 해설

중심에서 같은 거리에 있는 두 현의 길이는 같으므로 \$AB=AC\$이고, \$\\triangle ABC\$는 이등변삼각형이다. \$OM \\perp AB\$, \$ON \\perp AC\$이므로 사각형 \$AMON\$에서 \$\$ \\angle A \= 360^\\circ \- 90^\\circ \- 90^\\circ \- 124^\\circ \= 56^\\circ \$\$ 따라서 \$\\angle B \= \\dfrac{180^\\circ \- 56^\\circ}{2} \= 62^\\circ\$이므로 정답은 ①이다.

```
{"kind": "geometry", "caption": "원 O의 중심에서 같은 거리에 있는 두 현 AB, AC (∠MON=124°)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [110, 30], "B": [50, 163], "C": [170, 163], "M": [80, 96.5], "N": [140, 96.5]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"], ["O", "M"], ["O", "N"]], "rightAngles": [["O", "M", "A"], ["O", "N", "A"]], "labels": {"O": "124°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE"], "conditions": ["COND_TRIANGLE_SIDES"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "현", "quote": "두 현 $AB$, $AC$", "src": "stem"}, {"term": "거리", "quote": "같은 거리", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle MON=124^\\circ$", "src": "stem"}], "goal": [{"term": "각", "quote": "$\\angle B$의 크기", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "$\\triangle ABC$는 이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$PA\$, \$PB\$는 반지름의 길이가 \$3,\\mathrm{cm}\$인 원 \$O\$의 접선이고 두 점 \$A\$, \$B\$는 접점이다. \$\\angle APB=60^\\circ\$일 때, 사각형 \$APBO\$의 넓이는?

### 선지

① \$3\\sqrt{3},\\mathrm{cm}^2\$ ② \$4\\sqrt{3},\\mathrm{cm}^2\$ ③ \$6\\sqrt{3},\\mathrm{cm}^2\$ ④ \$9\\sqrt{3},\\mathrm{cm}^2\$ ⑤ \$12\\sqrt{3},\\mathrm{cm}^2\$

### 정답

④

### 해설

\$OA \\perp PA\$, \$OB \\perp PB\$이고 \$\\angle APO=30^\\circ\$이므로 직각삼각형 \$AOP\$에서 \$\$ \\tan 30^\\circ \= \\dfrac{OA}{PA} \= \\dfrac{3}{PA} \\implies PA \= 3\\sqrt{3},\\mathrm{cm} \$\$ 사각형 \$APBO\$는 합동인 두 직각삼각형 \$AOP\$, \$BOP\$로 이루어져 있으므로 넓이는 \$\$ 2\\times\\left(\\dfrac{1}{2}\\times 3\\times 3\\sqrt{3}\\right) \= 9\\sqrt{3},\\mathrm{cm}^2 \$\$ 따라서 정답은 ④이다.

```
{"kind": "geometry", "caption": "반지름 3cm인 원 O의 접선 PA, PB (∠APB=60°)", "viewBox": [0, 0, 240, 200], "circles": [{"center": "O", "radius": 55}], "vertices": {"O": [160, 100], "P": [50, 100], "A": [132.5, 52.4], "B": [132.5, 147.6]}, "segments": [["P", "A"], ["P", "B"], ["O", "A"], ["O", "B"]], "rightAngles": [["O", "A", "P"], ["O", "B", "P"]], "labels": {"OA": "3cm", "P": "60°"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "반지름", "quote": "반지름의 길이가 $3\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle APB=60^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "사각형 $APBO$의 넓이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $AOP$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$AT\$, \$AT'\$, \$BC\$는 원 \$O\$의 접선이고 세 점 \$T\$, \$T'\$, \$E\$는 접점이다. \$AO=13,\\mathrm{cm}\$, \$OT=5,\\mathrm{cm}\$일 때, \$\\triangle ABC\$의 둘레의 길이는?

### 선지

① \$16,\\mathrm{cm}\$ ② \$18,\\mathrm{cm}\$ ③ \$20,\\mathrm{cm}\$ ④ \$22,\\mathrm{cm}\$ ⑤ \$24,\\mathrm{cm}\$

### 정답

⑤

### 해설

\$OT \\perp AT\$이므로 직각삼각형 \$AOT\$에서 \$AT \= \\sqrt{13^2-5^2} \= 12,\\mathrm{cm}\$이다. 접선의 성질에 의해 \$AT=AT'=12\$, \$BT=BE\$, \$CT'=CE\$이므로 \$\\triangle ABC\$의 둘레의 길이는 \$\$ AB+BC+CA \= (AB+BT)+(AC+CT') \= AT+AT' \= 12+12 \= 24,\\mathrm{cm} \$\$ 따라서 정답은 ⑤이다.

```
{"kind": "geometry", "caption": "원 O의 접선 AT, AT', BC (AO=13cm, OT=5cm)", "viewBox": [0, 0, 260, 200], "circles": [{"center": "O", "radius": 50}], "vertices": {"O": [175, 100], "A": [35, 100], "T": [156, 54], "T2": [156, 146], "B": [110, 72], "C": [110, 128], "E": [125, 100]}, "segments": [["A", "T"], ["A", "T2"], ["B", "C"], ["O", "A"], ["O", "T"]], "rightAngles": [["O", "T", "A"]], "labels": {"AO": "13cm", "OT": "5cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$AO=13\\,\\mathrm{cm}$, $OT=5\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "세 점 $T$, $T'$, $E$는 접점", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\triangle ABC$의 둘레의 길이", "src": "stem"}], "method": [{"term": "접선", "quote": "접선의 성질", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림에서 \$DA\$, \$CB\$, \$CD\$는 지름이 \$AB\$인 반원 \$O\$의 접선이고 세 점 \$A\$, \$B\$, \$E\$는 접점이다. \$AO=6,\\mathrm{cm}\$, \$DC=16,\\mathrm{cm}\$일 때, 사각형 \$ABCD\$의 둘레의 길이는?

### 선지

① \$40,\\mathrm{cm}\$ ② \$42,\\mathrm{cm}\$ ③ \$44,\\mathrm{cm}\$ ④ \$46,\\mathrm{cm}\$ ⑤ \$48,\\mathrm{cm}\$

### 정답

③

### 해설

\$AO=6,\\mathrm{cm}\$이므로 반원의 지름 \$AB=12,\\mathrm{cm}\$이다. 접선의 길이는 같으므로 \$DA=DE\$, \$CB=CE\$이고, 따라서 \$AD+BC=DE+CE=DC=16,\\mathrm{cm}\$이다. 그러므로 사각형 \$ABCD\$의 둘레의 길이는 \$\$ AB \+ (AD \+ BC) \+ CD \= 12 \+ 16 \+ 16 \= 44,\\mathrm{cm} \$\$ 따라서 정답은 ③이다.

```
{"kind": "geometry", "caption": "지름 AB인 반원 O의 접선 DA, CB, CD (AO=6cm, DC=16cm)", "viewBox": [0, 0, 260, 190], "vertices": {"A": [40, 155], "B": [220, 155], "O": [130, 155], "D": [40, 95], "C": [220, 35]}, "segments": [["A", "B"], ["A", "D"], ["B", "C"], ["D", "C"]], "arcs": [{"center": "O", "radius": 90, "startAngle": 0, "endAngle": 180}], "rightAngles": [["D", "A", "B"], ["C", "B", "A"]], "labels": {"AO": "6cm", "DC": "16cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "반원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$AO=6\\,\\mathrm{cm}$, $DC=16\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "지름", "quote": "지름이 $AB$인 반원", "src": "stem"}], "goal": [{"term": "길이", "quote": "사각형 $ABCD$의 둘레의 길이", "src": "stem"}], "method": [{"term": "합", "quote": "AD+BC=DE+CE=DC", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

\[서술형\] 다음 그림과 같이 \$EF=6,\\mathrm{cm}\$, \$FG=8,\\mathrm{cm}\$, \$AE=6,\\mathrm{cm}\$인 직육면체 \$ABCD-EFGH\$에서 \$\\angle AGE=x\$라 할 때, \$\\cos x\$의 값을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{5\\sqrt{34}}{34}\$

### 해설

밑면 \$EFGH\$의 가로와 세로가 각각 \$6,\\mathrm{cm}\$, \$8,\\mathrm{cm}\$이므로 \$\$ EG \= \\sqrt{6^2+8^2} \= 10,\\mathrm{cm} \$\$ \$AE=6,\\mathrm{cm}\$이고 \$AE \\perp EG\$이므로 직각삼각형 \$AEG\$에서 \$\$ AG \= \\sqrt{10^2+6^2} \= \\sqrt{136} \= 2\\sqrt{34},\\mathrm{cm} \$\$ 따라서 \$\$ \\cos x \= \\dfrac{EG}{AG} \= \\dfrac{10}{2\\sqrt{34}} \= \\dfrac{5\\sqrt{34}}{34} \$\$ 이다.

```
{"kind": "geometry", "caption": "EF=6cm, FG=8cm, AE=6cm인 직육면체에서 ∠AGE=x", "viewBox": [0, 0, 260, 200], "vertices": {"E": [40, 145], "F": [150, 145], "G": [210, 110], "H": [100, 110], "A": [40, 65], "B": [150, 65], "C": [210, 30], "D": [100, 30]}, "segments": [["E", "F"], ["F", "G"], ["G", "H"], ["H", "E"], ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "E"], ["B", "F"], ["C", "G"], ["D", "H"], ["E", "G"], ["A", "G"]], "labels": {"EF": "6cm", "FG": "8cm", "AE": "6cm", "x": "∠AGE"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "길이", "quote": "$EF=6\\,\\mathrm{cm}$, $FG=8\\,\\mathrm{cm}$, $AE=6\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle AGE=x$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "$\\cos x$의 값", "src": "stem"}], "method": [{"term": "유리화", "quote": "\\dfrac{10}{2\\sqrt{34}} = \\dfrac{5\\sqrt{34}}{34}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[서술형\] 좌표평면 위의 세 점 \$A(4, 5)\$, \$B(-2, 1)\$, \$C(2, \-2)\$를 꼭짓점으로 하는 \$\\triangle ABC\$에 대하여 \$\\tan B\$의 값을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{17}{6}\$

### 해설

두 점 사이의 거리 공식에 의해 \$\$ AB^2 \= (4+2)^2+(5-1)^2 \= 52, \\quad BC \= \\sqrt{(2+2)^2+(-2-1)^2} \= 5, \\quad AC^2 \= (4-2)^2+(5+2)^2 \= 53 \$\$ \$A\$에서 직선 \$BC\$에 내린 수선의 발을 \$H\$라 하고 \$BH=t\$, \$AH=h\$라 하면 두 직각삼각형 \$ABH\$, \$ACH\$에서 \$\$ h^2 \+ t^2 \= 52, \\qquad h^2 \+ (5-t)^2 \= 53 \$\$ 두 식을 빼면 \$t^2 \- (5-t)^2 \= \-1\$, 즉 \$10t \- 25 \= \-1\$이므로 \$t \= \\dfrac{12}{5}\$이다. \$\$ h^2 \= 52 \- \\left(\\dfrac{12}{5}\\right)^2 \= \\dfrac{1156}{25} \\implies h \= \\dfrac{34}{5} \$\$ 따라서 \$\\tan B \= \\dfrac{AH}{BH} \= \\dfrac{34/5}{12/5} \= \\dfrac{17}{6}\$이다.

```
{"kind": "geometry", "caption": "좌표평면 위의 세 점 A(4,5), B(-2,1), C(2,-2)를 꼭짓점으로 하는 △ABC", "viewBox": [0, 0, 240, 220], "vertices": {"B": [50, 120], "C": [140, 180], "A": [185, 40]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"]], "labels": {"A": "(4,5)", "B": "(-2,1)", "C": "(2,-2)"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.3, "crossConcepts": ["CC_COORDINATE_TRIG", "CC_AUXILIARY_ALTITUDE"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "거리", "quote": "두 점 사이의 거리", "src": "solution"}], "condition": [{"term": "수선", "quote": "수선의 발을 $H$", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "$\\tan B$의 값", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "두 직각삼각형 $ABH$, $ACH$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[서술형\] 다음 그림에서 원 \$O\$는 \$\\angle B=90^\\circ\$인 직각삼각형 \$ABC\$의 내접원이고, 세 점 \$D\$, \$E\$, \$F\$는 접점이다. \$AF=6,\\mathrm{cm}\$, \$CF=9,\\mathrm{cm}\$일 때, \$\\triangle ABC\$에서 원 \$O\$를 제외한 색칠한 부분의 넓이를 구하시오.

### 선지

없음

### 정답

\$(54-9\\pi),\\mathrm{cm}^2\$

### 해설

한 점에서 원에 그은 두 접선의 길이는 같으므로 \$AD=AF=6,\\mathrm{cm}\$, \$CE=CF=9,\\mathrm{cm}\$이다. 내접원의 반지름의 길이를 \$r,\\mathrm{cm}\$라 하면 \$\\angle B=90^\\circ\$이므로 \$BDOE\$는 한 변이 \$r\$인 정사각형이 되어 \$BD=BE=r\$이다. 따라서 \$AB=6+r\$, \$BC=9+r\$, \$AC=6+9=15\$이므로 직각삼각형 \$ABC\$에서 \$\$ (6+r)^2 \+ (9+r)^2 \= 15^2 \\implies 2r^2 \+ 30r \- 108 \= 0 \\implies r^2 \+ 15r \- 54 \= 0 \$\$ \$(r-3)(r+18)=0\$이고 \$r\>0\$이므로 \$r=3\$이다. 따라서 \$AB=9,\\mathrm{cm}\$, \$BC=12,\\mathrm{cm}\$이므로 \$\\triangle ABC\$의 넓이는 \$\\dfrac{1}{2}\\times 9\\times 12 \= 54,\\mathrm{cm}^2\$, 원 \$O\$의 넓이는 \$9\\pi,\\mathrm{cm}^2\$이다. 그러므로 색칠한 부분의 넓이는 \$(54-9\\pi),\\mathrm{cm}^2\$이다.

```
{"kind": "geometry", "caption": "∠B=90°인 직각삼각형 ABC의 내접원 O (접점 D, E, F; AF=6cm, CF=9cm)", "viewBox": [0, 0, 240, 200], "circles": [{"center": "O", "radius": 36}], "vertices": {"B": [45, 165], "C": [189, 165], "A": [45, 57], "O": [81, 129]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"]], "rightAngles": [["A", "B", "C"]], "labels": {"AF": "6cm", "CF": "9cm"}}
```

```
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.8, "crossConcepts": ["CC_INSCRIBED_CIRCLE", "CC_CIRCLE_TANGENT_LENGTH"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AF=6\\,\\mathrm{cm}$, $CF=9\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "세 점 $D$, $E$, $F$는 접점", "src": "stem"}], "goal": [{"term": "넓이", "quote": "색칠한 부분의 넓이", "src": "stem"}], "method": [{"term": "정사각형", "quote": "정사각형이 되어", "src": "solution"}, {"term": "반지름", "quote": "내접원의 반지름의 길이", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```

