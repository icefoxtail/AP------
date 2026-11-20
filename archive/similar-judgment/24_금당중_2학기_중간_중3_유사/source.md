```json:exam
{"stem": "24_금당중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-18"}
```
## Q01
- 형식: 객관식
- 배점: 3


### 발문
다음 그림과 같이 $\angle A$의 크기가 같은 세 직각삼각형 $ABC$, $ADE$, $AFG$($\angle B=\angle D=\angle F=90^\circ$)가 있다. 다음 중 옳지 않은 것은?


### 선지
① $\dfrac{BC}{AC}=\dfrac{DE}{AE}$ ② $\cos A=\dfrac{AC}{AB}$ ③ $\sin A=\dfrac{FG}{AG}$ ④ $\dfrac{AB}{AC}=\dfrac{AF}{AG}$ ⑤ $\tan A=\dfrac{DE}{AD}$


### 정답
②


### 해설
세 직각삼각형 $ABC$, $ADE$, $AFG$는 모두 $\angle A$를 공유하므로 닮음이고 대응변의 길이의 비가 같다. $\triangle ABC$에서 $\angle A$의 빗변은 $AC$, 이웃한 변은 $AB$이므로 $\cos A = \dfrac{AB}{AC}$이다. 따라서 $\cos A = \dfrac{AC}{AB}$라고 한 ②가 옳지 않다.
```json
{"kind": "geometry", "caption": "∠A를 공유하는 세 직각삼각형 ABC, ADE, AFG", "viewBox": [0, 0, 270, 190], "vertices": {"A": [30, 155], "B": [100, 155], "C": [100, 115], "D": [165, 155], "E": [165, 78], "F": [235, 155], "G": [235, 38]}, "segments": [["A", "F"], ["A", "G"], ["B", "C"], ["D", "E"], ["F", "G"]], "rightAngles": [["A", "B", "C"], ["A", "D", "E"], ["A", "F", "G"]]}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.8, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_TRIANGLE_SIMILARITY"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "세 직각삼각형 $ABC$", "src": "stem"}, {"term": "각", "quote": "$\\angle A$의 크기", "src": "stem"}], "condition": [{"term": "닮음", "quote": "닮음이고", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "옳지 않은 것은", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos A = \\dfrac{AB}{AC}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q02
- 형식: 객관식
- 배점: 3


### 발문
다음 그림과 같이 $\angle C=90^\circ$, $AB=5$, $BC=\sqrt{11}$인 직각삼각형 $ABC$에서 $\cos B\times\tan B$의 값은?


### 선지
① $\dfrac{\sqrt{11}}{5}$ ② $\dfrac{11}{25}$ ③ $\dfrac{3}{5}$ ④ $\dfrac{4}{5}$ ⑤ $\dfrac{\sqrt{14}}{5}$


### 정답
⑤


### 해설
피타고라스 정리에 의해 $$ AC = \sqrt{AB^2 - BC^2} = \sqrt{5^2 - (\sqrt{11})^2} = \sqrt{25-11} = \sqrt{14} $$ 따라서 $\cos B = \dfrac{BC}{AB} = \dfrac{\sqrt{11}}{5}$, $\tan B = \dfrac{AC}{BC} = \dfrac{\sqrt{14}}{\sqrt{11}}$이므로 $$ \cos B \times \tan B = \dfrac{\sqrt{11}}{5} \times \dfrac{\sqrt{14}}{\sqrt{11}} = \dfrac{\sqrt{14}}{5} $$ 따라서 정답은 ⑤이다.
```json
{"kind": "geometry", "caption": "∠C=90°, AB=5, BC=√11인 직각삼각형 ABC", "viewBox": [0, 0, 260, 180], "vertices": {"B": [35, 145], "C": [200, 145], "A": [200, 40]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"AB": "5", "BC": "√11"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.2, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=5$, $BC=\\sqrt{11}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle C=90^\\circ$", "src": "stem"}], "goal": [{"term": "곱", "quote": "$\\cos B\\times\\tan B$의 값", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos B = \\dfrac{BC}{AB}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q03
- 형식: 객관식
- 배점: 4


### 발문
다음 중 계산이 옳은 것은?


### 선지
① $\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{6}$ ② $\sin 0^\circ + \cos 90^\circ = 1$ ③ $2\sin 30^\circ \times \sin 45^\circ = \sqrt{2}$ ④ $\tan 45^\circ \div \sin 60^\circ = \dfrac{\sqrt{3}}{2}$ ⑤ $\cos 0^\circ \times \cos 45^\circ = 1$


### 정답
①


### 해설
특수각의 삼각비 값을 각각 대입하면


* ① $\cos 30^\circ - \tan 30^\circ = \dfrac{\sqrt{3}}{2} - \dfrac{\sqrt{3}}{3} = \dfrac{\sqrt{3}}{6}$(옳음) * ②$\sin 0^\circ + \cos 90^\circ = 0 + 0 = 0$
* ③ $2\times\dfrac{1}{2}\times\dfrac{\sqrt{2}}{2} = \dfrac{\sqrt{2}}{2}$
* ④ $1\div\dfrac{\sqrt{3}}{2} = \dfrac{2\sqrt{3}}{3}$
* ⑤ $1\times\dfrac{\sqrt{2}}{2} = \dfrac{\sqrt{2}}{2}$ 따라서 옳은 것은 ①이다.
```json
"NONE"
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_TRIG_RATIO", "CC_ARITHMETIC_SIMPLIFICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "특수각의 삼각비", "src": "solution"}], "condition": [{"term": "대입", "quote": "대입하면", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "계산이 옳은 것은", "src": "stem"}], "method": [{"term": "차", "quote": "\\dfrac{\\sqrt{3}}{2} - \\dfrac{\\sqrt{3}}{3} = \\dfrac{\\sqrt{3}}{6}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q04
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $OB=0.68$이다. 아래 삼각비의 표를 이용하여 $\cos 43^\circ$의 값을 구하면?


각도
  $\sin$
  $\cos$
  $\tan$
  $46^\circ$
  $0.72$
  $0.69$
  $1.04$
  $47^\circ$
  $0.73$
  $0.68$
  $1.07$
  $48^\circ$
  $0.74$
  $0.67$
  $1.11$


### 선지
① $0.67$ ② $0.68$ ③ $0.69$ ④ $0.73$ ⑤ $0.74$


### 정답
④


### 해설
사분원의 반지름의 길이가 $1$이므로 $OA=1$이고, $\cos x = \dfrac{OB}{OA} = 0.68$이다. 표에서 $\cos 47^\circ = 0.68$이므로 $x=47^\circ$이다. $43^\circ + 47^\circ = 90^\circ$이므로 $\cos 43^\circ = \sin 47^\circ = 0.73$이다. 정답은 ④이다.
```json
{"kind": "geometry", "caption": "반지름 1인 사분원에서 OB=0.68, ∠AOB=x", "viewBox": [0, 0, 220, 220], "vertices": {"O": [40, 180], "B": [135, 180], "A": [135, 76]}, "segments": [["O", "B"], ["A", "B"], ["O", "A"]], "arcs": [{"center": "O", "radius": 140, "startAngle": 0, "endAngle": 90}], "rightAngles": [["O", "B", "A"]], "labels": {"OA": "1", "OB": "0.68", "O": "x"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_UNIT_QUARTER_CIRCLE", "CC_TRIG_TABLE_LOOKUP", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사분원", "quote": "반지름의 길이가 $1$인 사분원", "src": "stem"}, {"term": "길이", "quote": "$OB=0.68$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "삼각비의 표", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "\\cos 43^\\circ", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos 43^\\circ = \\sin 47^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q05
- 형식: 객관식
- 배점: 4


### 발문
예각 $A$에 대하여 $\tan A=3$일 때, $\cos A - \sin A$의 값은?


### 선지
① $-\dfrac{\sqrt{10}}{5}$ ② $-\dfrac{\sqrt{10}}{10}$ ③ $-\dfrac{\sqrt{10}}{5}$ ④ $\dfrac{\sqrt{10}}{5}$ ⑤ $\dfrac{2\sqrt{10}}{5}$


### 정답
③


### 해설
$\tan A = 3$이므로 밑변의 길이가 $1$, 높이가 $3$인 직각삼각형을 생각하면 빗변의 길이는 $\sqrt{1^2+3^2}=\sqrt{10}$이다. 따라서 $\cos A = \dfrac{1}{\sqrt{10}}$, $\sin A = \dfrac{3}{\sqrt{10}}$이므로 $$ \cos A - \sin A = \dfrac{1-3}{\sqrt{10}} = -\dfrac{2}{\sqrt{10}} = -\dfrac{\sqrt{10}}{5} $$ 따라서 정답은 ③이다.
```json
"NONE"
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.3, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "예각", "quote": "예각 $A$", "src": "stem"}, {"term": "삼각비", "quote": "$\\tan A=3$", "src": "stem"}], "condition": [{"term": "직각삼각형", "quote": "직각삼각형을 생각하면", "src": "solution"}], "goal": [{"term": "차", "quote": "\\cos A - \\sin A", "src": "stem"}], "method": [{"term": "유리화", "quote": "-\\dfrac{2}{\\sqrt{10}} = -\\dfrac{\\sqrt{10}}{5}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q06
- 형식: 객관식
- 배점: 4


### 발문
다음 그림에서 $AB=\sqrt{3}$, $\angle ABC=\angle BCD=90^\circ$, $\angle A=60^\circ$, $\angle D=45^\circ$일 때, $BD$의 길이는?


### 선지
① $3$ ② $3\sqrt{2}$ ③ $3\sqrt{3}$ ④ $4\sqrt{2}$ ⑤ $6$


### 정답
②


### 해설
직각삼각형 $ABC$에서 $\tan 60^\circ = \dfrac{BC}{AB} = \dfrac{BC}{\sqrt{3}} = \sqrt{3}$이므로 $BC=3$이다. 직각삼각형 $BCD$는 $\angle D=45^\circ$인 직각이등변삼각형이므로 $BC=CD=3$이고, $$ BD = \sqrt{3^2+3^2} = 3\sqrt{2} $$ 따라서 정답은 ②이다.
```json
{"kind": "geometry", "caption": "∠ABC=∠BCD=90°, AB=√3, ∠A=60°, ∠D=45°인 도형", "viewBox": [0, 0, 270, 190], "vertices": {"A": [40, 150], "B": [120, 150], "C": [120, 45], "D": [225, 45]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"], ["C", "D"], ["B", "D"]], "rightAngles": [["A", "B", "C"], ["B", "C", "D"]], "labels": {"AB": "√3", "A": "60°", "D": "45°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "길이", "quote": "$AB=\\sqrt{3}$", "src": "stem"}, {"term": "각", "quote": "$\\angle A=60^\\circ$, $\\angle D=45^\\circ$", "src": "stem"}], "condition": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "solution"}], "goal": [{"term": "길이", "quote": "$BD$의 길이", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "직각이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q07
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 한 모서리의 길이가 $12$인 정사면체 $ABCD$의 꼭짓점 $A$에서 밑면 $BCD$에 내린 수선의 발 $H$는 $\triangle BCD$의 무게중심이고, $M$은 변 $BC$의 중점이다. 다음 중 옳은 것은?


### 선지
① $AH=4\sqrt{6}$ ② $MC=6\sqrt{3}$ ③ $MD=12\sqrt{3}$ ④ $MH=4\sqrt{3}$ ⑤ $\tan(\angle ADH)=2$


### 정답
①


### 해설
밑면 $BCD$는 한 변의 길이가 $12$인 정삼각형이므로 $MC=6$, $MD=\sqrt{12^2-6^2}=6\sqrt{3}$이다. 무게중심 $H$는 중선 $MD$를 $2:1$로 나누므로 $DH=4\sqrt{3}$, $MH=2\sqrt{3}$이다. 직각삼각형 $ADH$에서 $$ AH = \sqrt{AD^2 - DH^2} = \sqrt{12^2 - (4\sqrt{3})^2} = \sqrt{144-48} = \sqrt{96} = 4\sqrt{6} $$ 따라서 옳은 것은 ①이다.
```json
{"kind": "geometry", "caption": "한 모서리 12인 정사면체 ABCD와 무게중심 H, 중점 M", "viewBox": [0, 0, 260, 240], "vertices": {"A": [130, 30], "B": [50, 170], "C": [155, 210], "D": [220, 155], "H": [142, 178], "M": [102, 190]}, "segments": [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["C", "D"], ["B", "D"], ["A", "H"], ["D", "M"]], "rightAngles": [["A", "H", "D"]], "labels": {"AD": "12"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.4, "crossConcepts": ["CC_RADICAL_GEOMETRIC_APPLICATION", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "정사면체", "quote": "정사면체 $ABCD$", "src": "stem"}, {"term": "무게중심", "quote": "$\\triangle BCD$의 무게중심", "src": "stem"}], "condition": [{"term": "중점", "quote": "$M$은 변 $BC$의 중점", "src": "stem"}], "goal": [{"term": "높이", "quote": "옳은 것은", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $ADH$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q08
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같은 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=75^\circ$, $\angle C=60^\circ$일 때, $AB$의 길이는?


### 선지
① $5\sqrt{2},\mathrm{cm}$ ② $5\sqrt{3},\mathrm{cm}$ ③ $10,\mathrm{cm}$ ④ $10\sqrt{2},\mathrm{cm}$ ⑤ $5\sqrt{6},\mathrm{cm}$


### 정답
⑤


### 해설
$\angle A = 180^\circ - 75^\circ - 60^\circ = 45^\circ$이다. 꼭짓점 $B$에서 $AC$에 내린 수선의 발을 $D$라 하면 직각삼각형 $BCD$에서 $$ BD = BC\sin 60^\circ = 10\times\dfrac{\sqrt{3}}{2} = 5\sqrt{3},\mathrm{cm} $$ 직각삼각형 $ABD$에서 $\angle A=45^\circ$이므로 직각이등변삼각형이 되어 $$ AB = BD\sqrt{2} = 5\sqrt{6},\mathrm{cm} $$ 따라서 정답은 ⑤이다.
```json
{"kind": "geometry", "caption": "BC=10cm, ∠B=75°, ∠C=60°인 △ABC", "viewBox": [0, 0, 260, 190], "vertices": {"B": [45, 155], "C": [185, 155], "A": [135, 35]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"]], "labels": {"BC": "10cm", "B": "75°", "C": "60°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_AUXILIARY_ALTITUDE", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$BC=10\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=75^\\circ$, $\\angle C=60^\\circ$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$AB$의 길이", "src": "stem"}], "method": [{"term": "수선", "quote": "내린 수선의 발을 $D$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q09
- 형식: 객관식
- 배점: 4


### 발문
직각삼각형 $ABC$($\angle C=90^\circ$)에서 점 $I$는 내심이고 $\angle BIC=120^\circ$일 때, $\sin A : \cos A : \tan A$는?


### 선지
① $1:\sqrt{3}:2\sqrt{3}$ ② $\sqrt{3}:2:1$ ③ $\sqrt{3}:2:3$ ④ $\sqrt{3}:1:2\sqrt{3}$ ⑤ $2:\sqrt{3}:1$


### 정답
④


### 해설
$I$는 내심이므로 $\angle IBC=\dfrac{\angle B}{2}$, $\angle ICB=\dfrac{90^\circ}{2}=45^\circ$이다. $\triangle BIC$에서 $\dfrac{\angle B}{2} + 45^\circ + 120^\circ = 180^\circ$이므로 $\dfrac{\angle B}{2}=15^\circ$, 즉 $\angle B=30^\circ$이고 $\angle A=60^\circ$이다. 따라서 $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$, $\tan 60^\circ = \sqrt{3}$이므로 $$ \sin A : \cos A : \tan A = \dfrac{\sqrt{3}}{2} : \dfrac{1}{2} : \sqrt{3} = \sqrt{3} : 1 : 2\sqrt{3} $$ 따라서 정답은 ④이다.
```json
{"kind": "geometry", "caption": "∠C=90°인 직각삼각형 ABC의 내심 I (∠BIC=120°)", "viewBox": [0, 0, 260, 180], "vertices": {"C": [45, 145], "B": [215, 145], "A": [45, 45], "I": [85, 110]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"], ["B", "I"], ["C", "I"]], "rightAngles": [["A", "C", "B"]], "labels": {"I": "120°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.3, "crossConcepts": ["CC_TRIG_RATIO", "CC_INSCRIBED_CIRCLE"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "각", "quote": "$\\angle BIC=120^\\circ$", "src": "stem"}], "condition": [{"term": "각", "quote": "\\angle A=60^\\circ", "src": "solution"}], "goal": [{"term": "삼각비", "quote": "\\sin A : \\cos A : \\tan A", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\sin 60^\\circ = \\dfrac{\\sqrt{3}}{2}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q10
- 형식: 객관식
- 배점: 4


### 발문
다음 그림에서 $\angle ACB=90^\circ$, $AB=6\sqrt{2},\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle ABC=45^\circ$, $\angle DAC=60^\circ$일 때, 사각형 $ABCD$의 넓이는?


### 선지
① $(18+3\sqrt{3}),\mathrm{cm}^2$ ② $(18+6\sqrt{3}),\mathrm{cm}^2$ ③ $(18+12\sqrt{3}),\mathrm{cm}^2$ ④ $(36+6\sqrt{3}),\mathrm{cm}^2$ ⑤ $(18\sqrt{2}+6\sqrt{3}),\mathrm{cm}^2$


### 정답
②


### 해설
$\triangle ABC$는 $\angle ACB=90^\circ$, $\angle ABC=45^\circ$인 직각이등변삼각형이므로 $AC=BC=6,\mathrm{cm}$이다. 따라서 $\triangle ABC = \dfrac{1}{2}\times 6\times 6 = 18,\mathrm{cm}^2$이다. $\triangle ACD$에서 $AC=6,\mathrm{cm}$, $AD=4,\mathrm{cm}$, $\angle DAC=60^\circ$이므로 $$ \triangle ACD = \dfrac{1}{2}\times 6\times 4\times\sin 60^\circ = 6\sqrt{3},\mathrm{cm}^2 $$ 그러므로 사각형 $ABCD$의 넓이는 $(18+6\sqrt{3}),\mathrm{cm}^2$이다. 정답은 ②이다.
```json
{"kind": "geometry", "caption": "∠ACB=90°, AB=6√2cm, AD=4cm, ∠ABC=45°, ∠DAC=60°인 사각형 ABCD", "viewBox": [0, 0, 260, 200], "vertices": {"C": [140, 165], "B": [40, 165], "A": [140, 65], "D": [225, 115]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]], "rightAngles": [["A", "C", "B"]], "labels": {"AB": "6√2cm", "AD": "4cm", "B": "45°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_QUADRILATERAL_AREA_TRIG", "CC_TRIANGLE_AREA_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사각형", "quote": "사각형 $ABCD$", "src": "stem"}, {"term": "길이", "quote": "$AB=6\\sqrt{2}\\,\\mathrm{cm}$, $AD=4\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle ABC=45^\\circ$, $\\angle DAC=60^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "사각형 $ABCD$의 넓이", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "직각이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q11
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 두 직각삼각형 $ABC$($\angle B=90^\circ, \angle ACB=60^\circ$)와 $ADE$($\angle D=90^\circ, \angle AED=45^\circ$)가 겹쳐져 있다. $AC=AE=8,\mathrm{cm}$일 때, 겹쳐진 부분인 $\triangle ADF$의 넓이는?


### 선지
① $\dfrac{8\sqrt{3}}{3},\mathrm{cm}^2$ ② $4\sqrt{3},\mathrm{cm}^2$ ③ $\dfrac{16\sqrt{3}}{3},\mathrm{cm}^2$ ④ $6\sqrt{3},\mathrm{cm}^2$ ⑤ $8\sqrt{3},\mathrm{cm}^2$


### 정답
③


### 해설
$\triangle ADE$는 빗변이 $AE=8,\mathrm{cm}$인 직각이등변삼각형이므로 $AD=\dfrac{8}{\sqrt{2}}=4\sqrt{2},\mathrm{cm}$이다. $\triangle ABC$에서 $\angle A=30^\circ$이므로 직각삼각형 $ADF$에서 $DF = AD\tan 30^\circ = 4\sqrt{2}\times\dfrac{\sqrt{3}}{3} = \dfrac{4\sqrt{6}}{3},\mathrm{cm}$이다. 따라서 $\triangle ADF$의 넓이는 $$ \dfrac{1}{2}\times 4\sqrt{2}\times\dfrac{4\sqrt{6}}{3} = \dfrac{16\sqrt{3}}{3},\mathrm{cm}^2 $$ 따라서 정답은 ③이다.
```json
{"kind": "geometry", "caption": "겹쳐진 두 직각삼각형 ABC(∠ACB=60°)와 ADE(∠AED=45°), AC=AE=8cm", "viewBox": [0, 0, 260, 190], "vertices": {"A": [40, 155], "D": [155, 155], "E": [155, 40], "B": [139, 98], "C": [180, 122], "F": [155, 89]}, "segments": [["A", "D"], ["D", "E"], ["A", "E"], ["A", "B"], ["B", "C"], ["A", "C"]], "rightAngles": [["A", "D", "E"], ["A", "B", "C"]], "labels": {"AC": "8cm", "AE": "8cm"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.6, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "두 직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AC=AE=8\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "\\angle ACB=60^\\circ", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ADF$의 넓이", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "직각이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q12
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 $120,\mathrm{m}$ 떨어진 두 지점 $A$, $B$에서 탑의 꼭대기 $C$ 지점을 올려본각의 크기가 각각 $60^\circ$와 $45^\circ$일 때, 이 탑의 높이는?


### 선지
① $60(3-\sqrt{3}),\mathrm{m}$ ② $60(3+\sqrt{3}),\mathrm{m}$ ③ $40(3-\sqrt{3}),\mathrm{m}$ ④ $40(3+\sqrt{3}),\mathrm{m}$ ⑤ $60\sqrt{3},\mathrm{m}$


### 정답
①


### 해설
탑의 발을 $D$, 높이를 $CD=h,\mathrm{m}$라 하면 $AD=\dfrac{h}{\sqrt{3}}$, $DB=h$이다. $AD + DB = 120$이므로 $$ \dfrac{h}{\sqrt{3}} + h = 120 \implies (1+\sqrt{3})h = 120\sqrt{3} \implies h = \dfrac{120\sqrt{3}}{\sqrt{3}+1} = 60\sqrt{3}(\sqrt{3}-1) = 60(3-\sqrt{3}) $$ 따라서 탑의 높이는 $60(3-\sqrt{3}),\mathrm{m}$이므로 정답은 ①이다.
```json
{"kind": "geometry", "caption": "120m 떨어진 두 지점 A, B에서 탑 꼭대기 C를 올려본 각 60°, 45°", "viewBox": [0, 0, 270, 190], "vertices": {"A": [30, 155], "B": [240, 155], "D": [107, 155], "C": [107, 22]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"], ["C", "D"]], "rightAngles": [["C", "D", "B"]], "labels": {"AB": "120m", "A": "60°", "B": "45°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.4, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "$120\\,\\mathrm{m}$ 떨어진", "src": "stem"}, {"term": "각", "quote": "각각 $60^\\circ$와 $45^\\circ$", "src": "stem"}], "condition": [{"term": "높이", "quote": "높이를 $CD=h\\,\\mathrm{m}$", "src": "solution"}], "goal": [{"term": "높이", "quote": "탑의 높이", "src": "stem"}], "method": [{"term": "합", "quote": "AD + DB = 120", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q13
- 형식: 객관식
- 배점: 5


### 발문
한 변의 길이가 $6$인 정사각형 $ABCD$의 두 변 $AD$, $CD$의 중점을 각각 $M$, $N$이라 하고 $\angle MBN=x^\circ$라 할 때, $\cos x^\circ$의 값은?


### 선지
① $\dfrac{2}{5}$ ② $\dfrac{3}{5}$ ③ $\dfrac{3\sqrt{34}}{34}$ ④ $\dfrac{5\sqrt{34}}{34}$ ⑤ $\dfrac{4}{5}$


### 정답
⑤


### 해설
$AM=MD=DN=NC=3$이므로 $BM=BN=\sqrt{6^2+3^2}=3\sqrt{5}$이다. 정사각형의 넓이 $36$에서 세 직각삼각형 $ABM$, $MDN$, $BCN$의 넓이 $9$, $\dfrac{9}{2}$, $9$를 빼면 $$ \triangle BMN = 36 - 9 - \dfrac{9}{2} - 9 = \dfrac{27}{2} $$ $\triangle BMN = \dfrac{1}{2}\times BM\times BN\times\sin x^\circ = \dfrac{45}{2}\sin x^\circ = \dfrac{27}{2}$이므로 $\sin x^\circ = \dfrac{3}{5}$이다. $x^\circ$는 예각이므로 $\cos x^\circ = \dfrac{4}{5}$이다. 정답은 ⑤이다.
```json
{"kind": "geometry", "caption": "한 변 6인 정사각형 ABCD와 AD, CD의 중점 M, N (∠MBN=x°)", "viewBox": [0, 0, 220, 220], "vertices": {"A": [40, 40], "B": [40, 180], "C": [180, 180], "D": [180, 40], "M": [110, 40], "N": [180, 110]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "M"], ["B", "N"], ["M", "N"]], "labels": {"AB": "6", "x": "∠MBN"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.1, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "정사각형", "quote": "정사각형 $ABCD$", "src": "stem"}, {"term": "중점", "quote": "중점을 각각 $M$, $N$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle MBN=x^\\circ$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "$\\cos x^\\circ$의 값", "src": "stem"}], "method": [{"term": "넓이", "quote": "정사각형의 넓이", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q14
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 원 $O$의 지름 $AB$와 현 $CD$가 점 $M$에서 수직으로 만난다. $AM=12,\mathrm{cm}$, $MB=4,\mathrm{cm}$일 때, 현 $CD$의 길이는?


### 선지
① $4\sqrt{3},\mathrm{cm}$ ② $8\sqrt{3},\mathrm{cm}$ ③ $6\sqrt{3},\mathrm{cm}$ ④ $4\sqrt{5},\mathrm{cm}$ ⑤ $8\sqrt{5},\mathrm{cm}$


### 정답
②


### 해설
지름 $AB = 12 + 4 = 16,\mathrm{cm}$이므로 원 $O$의 반지름은 $8,\mathrm{cm}$이다. $AO=8,\mathrm{cm}$, $AM=12,\mathrm{cm}$이므로 $OM = 12 - 8 = 4,\mathrm{cm}$이다. 직각삼각형 $OMC$에서 $CM = \sqrt{8^2-4^2} = 4\sqrt{3},\mathrm{cm}$이므로 $CD = 2CM = 8\sqrt{3},\mathrm{cm}$이다. 정답은 ②이다.
```json
{"kind": "geometry", "caption": "원 O의 지름 AB와 수직인 현 CD (AM=12cm, MB=4cm)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [30, 110], "B": [190, 110], "M": [150, 110], "C": [150, 41], "D": [150, 179]}, "segments": [["A", "B"], ["C", "D"], ["O", "C"]], "rightAngles": [["O", "M", "C"]], "labels": {"AM": "12cm", "MB": "4cm"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "지름", "quote": "지름 $AB$", "src": "stem"}, {"term": "길이", "quote": "$AM=12\\,\\mathrm{cm}$, $MB=4\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "현", "quote": "현 $CD$", "src": "stem"}], "goal": [{"term": "현", "quote": "현 $CD$의 길이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $OMC$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q15
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $CD$에 이르는 거리가 같고 $CD=8,\mathrm{cm}$, $\angle BAO=30^\circ$일 때, 원 $O$의 반지름의 길이는?


### 선지
① $4,\mathrm{cm}$ ② $2\sqrt{3},\mathrm{cm}$ ③ $4\sqrt{3},\mathrm{cm}$ ④ $\dfrac{8\sqrt{3}}{3},\mathrm{cm}$ ⑤ $\dfrac{4\sqrt{3}}{3},\mathrm{cm}$


### 정답
④


### 해설
중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=CD=8,\mathrm{cm}$이다. $O$에서 $AB$에 내린 수선의 발을 $P$라 하면 $AP=4,\mathrm{cm}$이다. 직각삼각형 $AOP$에서 $\cos 30^\circ = \dfrac{4}{AO} = \dfrac{\sqrt{3}}{2}$이므로 $AO = \dfrac{8}{\sqrt{3}} = \dfrac{8\sqrt{3}}{3},\mathrm{cm}$이다. 따라서 정답은 ④이다.
```json
{"kind": "geometry", "caption": "원 O의 중심에서 같은 거리인 두 현 AB, CD=8cm (∠BAO=30°)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [41, 150], "B": [179, 150], "P": [110, 150]}, "segments": [["A", "B"], ["O", "P"], ["O", "A"]], "rightAngles": [["O", "P", "A"]], "labels": {"CD": "8cm", "A": "30°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE", "CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "현", "quote": "두 현 $AB$와 $CD$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle BAO=30^\\circ$", "src": "stem"}], "goal": [{"term": "반지름", "quote": "반지름의 길이", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos 30^\\circ = \\dfrac{4}{AO}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q16
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 원 $O$의 중심에서 두 현 $AB$와 $AC$에 이르는 거리가 같고 $\angle A=50^\circ$일 때, $\angle B$의 크기 $x$는?


### 선지
① $65^\circ$ ② $60^\circ$ ③ $70^\circ$ ④ $75^\circ$ ⑤ $80^\circ$


### 정답
①


### 해설
중심에서 같은 거리에 있는 두 현의 길이는 같으므로 $AB=AC$이고 $\triangle ABC$는 이등변삼각형이다. $\angle A=50^\circ$이므로 $x = \dfrac{180^\circ - 50^\circ}{2} = 65^\circ$이다. 정답은 ①이다.
```json
{"kind": "geometry", "caption": "원 O의 중심에서 같은 거리인 두 현 AB, AC (∠A=50°, ∠B=x)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [110, 30], "B": [50, 163], "C": [170, 163]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"]], "labels": {"A": "50°", "B": "x"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE"], "conditions": ["COND_TRIANGLE_SIDES"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "현", "quote": "두 현 $AB$와 $AC$", "src": "stem"}, {"term": "거리", "quote": "거리가 같고", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle A=50^\\circ$", "src": "stem"}], "goal": [{"term": "각", "quote": "$\\angle B$의 크기 $x$", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "$\\triangle ABC$는 이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q17
- 형식: 객관식
- 배점: 4


### 발문
다음 그림에서 $PA$, $PQ$, $QC$는 지름이 $AC$인 반원 $O$의 접선이고, 세 점 $A$, $B$, $C$는 그 접점이다. $\angle POQ = x$의 크기를 구하는 과정에서 (가), (나), (다)에 알맞은 것을 차례로 쓴 것은?


$\triangle OAP \equiv \triangle OBP$이므로 $\angle AOP =$ (가) $= \dfrac{1}{2}\angle AOB$ 마찬가지로 $\angle BOQ = \angle COQ =$ (나) $\angle BOC$ 따라서 $x = \angle BOP + \angle BOQ = \dfrac{1}{2}(\angle AOB + \angle BOC) =$ (다)


### 선지
① $\angle BOP,\ \dfrac{1}{3},\ 60^\circ$ ② $\angle COQ,\ \dfrac{1}{2},\ 90^\circ$ ③ $\angle BOP,\ \dfrac{1}{2},\ 90^\circ$ ④ $\angle COQ,\ \dfrac{1}{3},\ 60^\circ$ ⑤ $\angle BOQ,\ \dfrac{1}{2},\ 90^\circ$


### 정답
③


### 해설
$\triangle OAP \equiv \triangle OBP$이므로 $\angle AOP = \angle BOP = \dfrac{1}{2}\angle AOB$이다. 따라서 (가)는 $\angle BOP$이다. 마찬가지로 $\angle BOQ = \angle COQ = \dfrac{1}{2}\angle BOC$이므로 (나)는 $\dfrac{1}{2}$이다. $\angle AOB + \angle BOC = 180^\circ$이므로 $x = \dfrac{1}{2}\times 180^\circ = 90^\circ$이다. 따라서 (다)는 $90^\circ$이고 정답은 ③이다.
```json
{"kind": "geometry", "caption": "반원 O의 접선 PA, PQ, QC (접점 A, B, C)와 ∠POQ=x", "viewBox": [0, 0, 260, 190], "vertices": {"A": [40, 155], "C": [220, 155], "O": [130, 155], "P": [40, 95], "Q": [220, 35], "B": [85, 76]}, "segments": [["A", "C"], ["A", "P"], ["C", "Q"], ["P", "Q"], ["O", "P"], ["O", "Q"], ["O", "B"]], "arcs": [{"center": "O", "radius": 90, "startAngle": 0, "endAngle": 180}], "rightAngles": [["P", "A", "O"], ["Q", "C", "O"]]}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "반원 $O$의 접선", "src": "stem"}, {"term": "접점", "quote": "세 점 $A$, $B$, $C$는 그 접점", "src": "stem"}], "condition": [{"term": "각", "quote": "\\angle AOB + \\angle BOC = 180^\\circ", "src": "solution"}], "goal": [{"term": "각", "quote": "\\angle POQ = x$의 크기", "src": "stem"}], "method": [{"term": "각", "quote": "\\angle BOP = \\dfrac{1}{2}\\angle AOB", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q18
- 형식: 객관식
- 배점: 5


### 발문
다음 그림과 같이 원 $O$는 직사각형 $ABCD$의 세 변 $AB$, $AD$, $BC$와 접한다. $DE$가 원 $O$의 접선이고 $DC=8,\mathrm{cm}$, $DE=10,\mathrm{cm}$일 때, $BE$의 길이는?


### 선지
① $3,\mathrm{cm}$ ② $4,\mathrm{cm}$ ③ $5,\mathrm{cm}$ ④ $8,\mathrm{cm}$ ⑤ $6,\mathrm{cm}$


### 정답
⑤


### 해설
직각삼각형 $DCE$에서 $DC=8,\mathrm{cm}$, $DE=10,\mathrm{cm}$이므로 $CE=\sqrt{10^2-8^2}=6,\mathrm{cm}$이다. 원의 반지름의 길이는 $\dfrac{8}{2}=4,\mathrm{cm}$이다. 직사각형의 가로 길이를 $BC=AD=w$라 하면 접선의 성질에 의해 $DI = w-4$, $EI = BE-4 = (w-6)-4 = w-10$이다. $DE = DI + EI = (w-4)+(w-10) = 10$이므로 $2w = 24$, $w = 12,\mathrm{cm}$이다. 따라서 $BE = BC - CE = 12 - 6 = 6,\mathrm{cm}$이므로 정답은 ⑤이다.
```json
{"kind": "geometry", "caption": "직사각형 ABCD의 세 변에 접하는 원 O와 접선 DE (DC=8cm, DE=10cm)", "viewBox": [0, 0, 260, 180], "circles": [{"center": "O", "radius": 60}], "vertices": {"A": [40, 30], "B": [40, 150], "C": [220, 150], "D": [220, 30], "O": [100, 90], "E": [130, 150]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "E"]], "labels": {"DC": "8cm", "DE": "10cm"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.9, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_RECTANGLE_INSCRIBED_CIRCLE_TANGENT"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사각형", "quote": "직사각형 $ABCD$", "src": "stem"}, {"term": "접선", "quote": "$DE$가 원 $O$의 접선", "src": "stem"}], "condition": [{"term": "길이", "quote": "$DC=8\\,\\mathrm{cm}$, $DE=10\\,\\mathrm{cm}$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$BE$의 길이", "src": "stem"}], "method": [{"term": "반지름", "quote": "원의 반지름의 길이", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q19
- 형식: 객관식
- 배점: 4


### 발문
다음 그림에서 두 직선 $PA$, $PB$는 원 $O$의 접선이고 두 점 $A$, $B$는 그 접점이다. $PA=4\sqrt{3},\mathrm{cm}$, $OA=4,\mathrm{cm}$일 때, 다음 중 옳은 것은?


### 선지
① $PB=4,\mathrm{cm}$ ② $PO=8\sqrt{3},\mathrm{cm}$ ③ $\angle APB=30^\circ$ ④ 색칠한 부분의 넓이 $= \left(16\sqrt{3}-\dfrac{16\pi}{3}\right),\mathrm{cm}^2$ ⑤ 부채꼴 $OAB$의 넓이 $= 16\pi,\mathrm{cm}^2$


### 정답
④


### 해설
$PO = \sqrt{4^2+(4\sqrt{3})^2} = 8,\mathrm{cm}$이고 $\sin\angle APO = \dfrac{4}{8} = \dfrac{1}{2}$이므로 $\angle APO=30^\circ$, $\angle APB=60^\circ$, $\angle AOB=120^\circ$이다. 사각형 $PAOB$의 넓이는 $2\times\dfrac{1}{2}\times 4\times 4\sqrt{3} = 16\sqrt{3},\mathrm{cm}^2$, 부채꼴 $OAB$의 넓이는 $\pi\times 4^2\times\dfrac{120^\circ}{360^\circ} = \dfrac{16\pi}{3},\mathrm{cm}^2$이다. 따라서 색칠한 부분의 넓이는 $\left(16\sqrt{3}-\dfrac{16\pi}{3}\right),\mathrm{cm}^2$이므로 정답은 ④이다.
```json
{"kind": "geometry", "caption": "원 O의 접선 PA, PB (PA=4√3cm, OA=4cm)", "viewBox": [0, 0, 240, 200], "circles": [{"center": "O", "radius": 55}], "vertices": {"O": [160, 100], "P": [50, 100], "A": [132.5, 52.4], "B": [132.5, 147.6]}, "segments": [["P", "A"], ["P", "B"], ["O", "A"], ["O", "B"]], "rightAngles": [["O", "A", "P"], ["O", "B", "P"]], "labels": {"PA": "4√3cm", "OA": "4cm"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_CIRCLE_SECTOR_AREA"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$PA=4\\sqrt{3}\\,\\mathrm{cm}$, $OA=4\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "두 점 $A$, $B$는 그 접점", "src": "stem"}], "goal": [{"term": "넓이", "quote": "옳은 것은", "src": "stem"}], "method": [{"term": "부채꼴", "quote": "부채꼴 $OAB$의 넓이", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q20
- 형식: 객관식
- 배점: 4


### 발문
다음 그림과 같이 중심이 같은 두 원에서 큰 원의 길이가 $6$인 현이 작은 원에 접하면서 작은 원을 따라 한 바퀴 돌았을 때, 현이 지나간 부분의 넓이는?


### 선지
① $3\pi$ ② $6\pi$ ③ $9\pi$ ④ $12\pi$ ⑤ $36\pi$


### 정답
③


### 해설
큰 원의 반지름을 $R$, 작은 원의 반지름을 $r$이라 하자. 길이가 $6$인 현의 절반의 길이는 $3$이므로 피타고라스 정리에 의해 $R^2 - r^2 = 3^2 = 9$이다. 따라서 현이 지나간 도넛 모양 부분의 넓이는 $\pi R^2 - \pi r^2 = \pi(R^2 - r^2) = 9\pi$이다. 정답은 ③이다.
```json
{"kind": "geometry", "caption": "동심원에서 작은 원에 접하는 큰 원의 길이 6인 현", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}, {"center": "O", "radius": 45}], "vertices": {"O": [110, 110], "A": [44, 155], "B": [176, 155]}, "segments": [["A", "B"]], "labels": {"AB": "6"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.1, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "중심이 같은 두 원", "src": "stem"}, {"term": "현", "quote": "길이가 $6$인 현", "src": "stem"}], "condition": [{"term": "반지름", "quote": "큰 원의 반지름을 $R$", "src": "solution"}], "goal": [{"term": "넓이", "quote": "지나간 부분의 넓이", "src": "stem"}], "method": [{"term": "차", "quote": "\\pi(R^2 - r^2) = 9\\pi", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q21
- 형식: 서답형
- 배점: 5


### 발문
[서술형 1] 다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ$)에서 $AB=10$, $\angle B=32^\circ$일 때, $x+y$의 값을 구하시오. (단, $\sin 32^\circ=0.53$, $\cos 32^\circ=0.85$, $\tan 32^\circ=0.62$로 계산하시오.)
### 선지
없음


### 정답
$13.8$


### 해설
빗변이 $AB=10$이고 $\angle B=32^\circ$이므로 $$ x = AC = 10\sin 32^\circ = 10\times 0.53 = 5.3, \qquad y = BC = 10\cos 32^\circ = 10\times 0.85 = 8.5 $$ 따라서 $x+y = 5.3 + 8.5 = 13.8$이다.
```json
{"kind": "geometry", "caption": "∠C=90°, AB=10, ∠B=32°, AC=x, BC=y인 직각삼각형 ABC", "viewBox": [0, 0, 260, 170], "vertices": {"B": [30, 140], "C": [210, 140], "A": [210, 35]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"AB": "10", "AC": "x", "BC": "y", "B": "32°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$AB=10$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=32^\\circ$", "src": "stem"}], "goal": [{"term": "합", "quote": "$x+y$의 값", "src": "stem"}], "method": [{"term": "삼각비", "quote": "10\\sin 32^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q22
- 형식: 서답형
- 배점: 5


### 발문
[서술형 2] 다음 직각삼각형 $ABC$($\angle ACB=90^\circ$)에서 점 $D$는 변 $BC$ 위의 점이고 $BD=4$, $\angle ABC=15^\circ$, $\angle ADC=30^\circ$일 때, $\tan 15^\circ$의 값을 구하시오.
### 선지
없음


### 정답
$2-\sqrt{3}$


### 해설
$\angle ADB = 180^\circ - 30^\circ = 150^\circ$이므로 $\triangle ABD$에서 $\angle BAD = 180^\circ - 15^\circ - 150^\circ = 15^\circ$이다. 따라서 $\triangle ABD$는 이등변삼각형이므로 $AD = BD = 4$이다. 직각삼각형 $ACD$에서 $\angle ADC=30^\circ$이므로 $$ AC = 4\sin 30^\circ = 2, \qquad CD = 4\cos 30^\circ = 2\sqrt{3} $$ 따라서 $BC = BD + CD = 4 + 2\sqrt{3}$이므로 $$ \tan 15^\circ = \dfrac{AC}{BC} = \dfrac{2}{4+2\sqrt{3}} = \dfrac{1}{2+\sqrt{3}} = 2-\sqrt{3} $$ 이다.
```json
{"kind": "geometry", "caption": "∠ACB=90°, BD=4, ∠ABC=15°, ∠ADC=30°인 직각삼각형 ABC", "viewBox": [0, 0, 270, 170], "vertices": {"B": [30, 140], "D": [135, 140], "C": [230, 140], "A": [230, 85]}, "segments": [["B", "C"], ["C", "A"], ["A", "B"], ["A", "D"]], "rightAngles": [["A", "C", "B"]], "labels": {"BD": "4", "B": "15°", "D": "30°"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.7, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "$BD=4$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle ABC=15^\\circ$, $\\angle ADC=30^\\circ$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "$\\tan 15^\\circ$의 값", "src": "stem"}], "method": [{"term": "이등변삼각형", "quote": "$\\triangle ABD$는 이등변삼각형", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q23
- 형식: 서답형
- 배점: 5


### 발문
[서술형 3] 다음 그림은 원 모양의 접시가 세 조각으로 깨진 것이다. 세 학생 A, B, C가 원의 중심을 찾아 깨지기 전의 접시 모양을 복원하려고 한다. 옳게 말한 학생을 찾고, 원의 중심을 찾는 방법을 설명하시오. 학생 A: 조각 ①은 너무 작아서 중심을 찾을 수 없어. 학생 B: 중심이 들어 있는 가장 큰 조각 ②만 있어야 중심을 찾을 수 있어. 학생 C: 세 조각 중 어느 조각을 이용하더라도 원의 중심을 찾을 수 있어.
### 선지
없음
### 정답
학생 C


### 해설
옳게 말한 학생은 학생 C이다. 한 조각의 원호 위에서 서로 다른 세 점 $P$, $Q$, $R$을 잡아 두 현 $PQ$, $QR$을 긋는다. 현 $PQ$의 수직이등분선과 현 $QR$의 수직이등분선은 모두 원래 원의 중심을 지나므로, 두 수직이등분선을 연장하여 만나는 교점이 원의 중심이 된다.
```json
{"kind": "geometry", "caption": "세 조각으로 깨진 원형 접시", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110]}, "segments": [], "labels": {"1": "조각 ①", "2": "조각 ②", "3": "조각 ③"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "현의 수직이등분선과 중심"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_CIRCLE_CENTER_CONSTRUCTION", "CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 모양", "src": "stem"}, {"term": "호", "quote": "원호 위에서", "src": "solution"}], "condition": [{"term": "현", "quote": "두 현 $PQ$, $QR$", "src": "solution"}], "goal": [{"term": "원", "quote": "원의 중심을 찾는 방법", "src": "stem"}], "method": [{"term": "수직이등분선", "quote": "두 수직이등분선", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```
## Q24
- 형식: 서답형
- 배점: 5


### 발문
[서술형 4] 다음 그림과 같이 중심 $O$가 같고 반지름의 길이가 서로 다른 두 원에서 $AB \perp OM$, $OA=8,\mathrm{cm}$, $OM=4,\mathrm{cm}$, $DB=\sqrt{3},\mathrm{cm}$일 때, 두 원 사이의 어두운 고리 부분의 넓이를 구하시오.
### 선지
없음


### 정답
$21\pi,\mathrm{cm}^2$


### 해설
$AB \perp OM$이므로 $M$은 현 $AB$의 중점이고 $AM=MB$이다. 직각삼각형 $OAM$에서 $AM = \sqrt{8^2 - 4^2} = \sqrt{48} = 4\sqrt{3},\mathrm{cm}$이므로 $MB=4\sqrt{3},\mathrm{cm}$이다. 점 $D$가 선분 $MB$ 위에 있으므로 $MD = MB - DB = 4\sqrt{3} - \sqrt{3} = 3\sqrt{3},\mathrm{cm}$이다. 직각삼각형 $OMD$에서 작은 원의 반지름의 제곱은 $$ OD^2 = OM^2 + MD^2 = 4^2 + (3\sqrt{3})^2 = 16 + 27 = 43 $$ 따라서 어두운 부분의 넓이는 $\pi \times OA^2 - \pi \times OD^2 = (64 - 43)\pi = 21\pi,\mathrm{cm}^2$이다.
```json
{"kind": "geometry", "caption": "동심원에서 AB⊥OM, OA=8cm, OM=4cm, DB=√3cm", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}, {"center": "O", "radius": 65}], "vertices": {"O": [110, 110], "M": [110, 150], "A": [41, 150], "B": [179, 150], "D": [161, 150]}, "segments": [["A", "B"], ["O", "M"], ["O", "A"], ["O", "D"]], "rightAngles": [["O", "M", "A"]], "labels": {"OA": "8cm", "OM": "4cm", "DB": "√3cm"}}
```
```json
{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.8, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "두 원", "src": "stem"}, {"term": "길이", "quote": "$OA=8\\,\\mathrm{cm}$, $OM=4\\,\\mathrm{cm}$, $DB=\\sqrt{3}\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "$AB \\perp OM$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "어두운 고리 부분의 넓이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $OMD$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
```