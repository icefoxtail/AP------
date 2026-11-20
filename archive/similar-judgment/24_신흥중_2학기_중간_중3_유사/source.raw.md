{"stem": "24_신흥중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-18"}
Q01
* 형식: 객관식
* 배점: 3
발문
다음 직각삼각형 $ABC$($\angle C=90^\circ, AB=13, AC=12, BC=5$)에서 옳지 않은 것을 모두 고르면? (정답 2개)
선지
① $\sin A=\dfrac{5}{13}$ ② $\cos A=\dfrac{13}{12}$ ③ $\tan A=\dfrac{5}{12}$ ④ $\sin B=\dfrac{5}{13}$ ⑤ $\cos B=\dfrac{5}{13}$
정답
②, ④
해설
$\angle C=90^\circ$이므로 빗변은 $AB=13$이다. 각 $A$에 대하여 $\sin A=\dfrac{5}{13}$, $\cos A=\dfrac{12}{13}$, $\tan A=\dfrac{5}{12}$이므로 ②는 옳지 않다. 각 $B$에 대하여 $\sin B=\dfrac{12}{13}$, $\cos B=\dfrac{5}{13}$이므로 ④도 옳지 않다. 따라서 옳지 않은 것은 ②, ④이다.


{"kind": "geometry", "caption": "∠C=90°, AB=13, AC=12, BC=5인 직각삼각형 ABC", "viewBox": [0, 0, 260, 170], "vertices": {"A": [30, 140], "C": [210, 140], "B": [210, 45]}, "segments": [["A", "C"], ["C", "B"], ["A", "B"]], "rightAngles": [["A", "C", "B"]], "labels": {"AB": "13", "AC": "12", "BC": "5"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "AB=13, AC=12, BC=5", "src": "stem"}], "condition": [{"term": "각", "quote": "\\angle C=90^\\circ", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "옳지 않은 것", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos A=\\dfrac{12}{13}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q02
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 직각변의 길이가 $5$, $12$인 직각삼각형에서 $\sin x + \cos y$의 값은?
선지
① $\dfrac{13}{12}$ ② $\dfrac{15}{13}$ ③ $\dfrac{17}{13}$ ④ $\dfrac{19}{13}$ ⑤ $\dfrac{24}{13}$
정답
③
해설
큰 직각삼각형의 빗변의 길이는 $\sqrt{5^2+12^2}=13$이다. $\sin x = \dfrac{12}{13}$이고, 서로 수직인 두 직선이 이루는 예각의 크기는 같으므로 $y=x$이다. 따라서 $\cos y = \cos x = \dfrac{5}{13}$이므로 $$ \sin x + \cos y = \dfrac{12}{13} + \dfrac{5}{13} = \dfrac{17}{13} $$ 정답은 ③이다.


{"kind": "geometry", "caption": "직각변 5, 12인 직각삼각형과 내부 수선 (∠x, ∠y)", "viewBox": [0, 0, 260, 180], "vertices": {"A": [40, 145], "B": [220, 145], "C": [40, 45], "D": [130, 145], "E": [110, 84]}, "segments": [["A", "B"], ["A", "C"], ["B", "C"], ["D", "E"]], "rightAngles": [["B", "A", "C"], ["B", "E", "D"]], "labels": {"AB": "12", "AC": "5"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_TRIANGLE_SIMILARITY"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형", "src": "stem"}, {"term": "길이", "quote": "길이가 $5$, $12$", "src": "stem"}], "condition": [{"term": "예각", "quote": "예각의 크기는 같으므로 $y=x$", "src": "solution"}], "goal": [{"term": "합", "quote": "$\\sin x + \\cos y$의 값", "src": "stem"}], "method": [{"term": "합", "quote": "\\dfrac{12}{13} + \\dfrac{5}{13} = \\dfrac{17}{13}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q03
* 형식: 객관식
* 배점: 3
발문
$2\sin 45^\circ + \tan 45^\circ - 3\sin 0^\circ + 2\cos 90^\circ$의 값은?
선지
① $\sqrt{2}+1$ ② $\sqrt{2}-1$ ③ $-\sqrt{2}+1$ ④ $\sqrt{2}$ ⑤ $2\sqrt{2}+1$
정답
①
해설
$\sin 45^\circ=\dfrac{\sqrt{2}}{2}$, $\tan 45^\circ=1$, $\sin 0^\circ=0$, $\cos 90^\circ=0$이므로 $$ 2\times\dfrac{\sqrt{2}}{2} + 1 - 3\times 0 + 2\times 0 = \sqrt{2}+1 $$ 따라서 정답은 ①이다.


"NONE"

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_TRIG_RATIO", "CC_ARITHMETIC_SIMPLIFICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "2\\sin 45^\\circ + \\tan 45^\\circ", "src": "stem"}], "condition": [{"term": "대입", "quote": "2\\times\\dfrac{\\sqrt{2}}{2} + 1", "src": "solution"}], "goal": [{"term": "합", "quote": "값은", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\sin 45^\\circ=\\dfrac{\\sqrt{2}}{2}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q04
* 형식: 객관식
* 배점: 5
발문
다음 그림과 같이 $y$절편이 $6$이고, $x$축과 이루는 예각의 크기가 $30^\circ$이며 오른쪽 아래로 향하는 직선의 방정식을 구하면?
선지
① $x+\sqrt{3}y-6=0$ ② $\sqrt{3}x+y-6=0$ ③ $x-\sqrt{3}y+6\sqrt{3}=0$ ④ $x+\sqrt{3}y-6\sqrt{3}=0$ ⑤ $\sqrt{3}x+3y-6=0$
정답
④
해설
오른쪽 아래로 향하므로 기울기는 음수이고, 절댓값은 $\tan 30^\circ=\dfrac{\sqrt{3}}{3}$이다. 기울기가 $-\dfrac{\sqrt{3}}{3}$, $y$절편이 $6$이므로 직선의 방정식은 $y=-\dfrac{\sqrt{3}}{3}x+6$이다. 양변에 $\sqrt{3}$을 곱하여 정리하면 $x+\sqrt{3}y-6\sqrt{3}=0$이다. 정답은 ④이다.


{"kind": "geometry", "caption": "y절편이 6이고 x축과 30°를 이루며 내려가는 직선", "viewBox": [0, 0, 240, 200], "vertices": {"O": [50, 155], "X": [210, 155], "Y": [50, 65]}, "segments": [["O", "X"], ["O", "Y"], ["X", "Y"]], "labels": {"Y": "6", "X": "30°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_LINE_SLOPE_TANGENT"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직선", "quote": "$y$절편이 $6$", "src": "stem"}, {"term": "예각", "quote": "예각의 크기가 $30^\\circ$", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "\\tan 30^\\circ=\\dfrac{\\sqrt{3}}{3}", "src": "solution"}], "goal": [{"term": "직선", "quote": "직선의 방정식", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\tan 30^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q05
* 형식: 객관식
* 배점: 4
발문
$45^\circ < x < 90^\circ$일 때, $\sqrt{(\sin x+\cos x)^2}+\sqrt{(\sin x-\cos x)^2}$을 간단히 하면?
선지
① $2\cos x$ ② $2\sin x$ ③ $0$ ④ $-2\cos x$ ⑤ $-2\sin x$
정답
②
해설
$45^\circ < x < 90^\circ$에서는 $\sin x > \cos x > 0$이므로 $$ |\sin x+\cos x| + |\sin x-\cos x| = (\sin x+\cos x) + (\sin x-\cos x) = 2\sin x $$ 따라서 정답은 ②이다.


"NONE"

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_RADICAL_SQUARE_ABSOLUTE_VALUE", "CC_TRIG_RATIO_ORDER"], "conditions": ["COND_RESTRICTED_INTERVAL"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "예각", "quote": "$45^\\circ < x < 90^\\circ$", "src": "stem"}, {"term": "제곱근", "quote": "\\sqrt{(\\sin x+\\cos x)^2}", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "\\sin x > \\cos x > 0", "src": "solution"}], "goal": [{"term": "합", "quote": "간단히 하면", "src": "stem"}], "method": [{"term": "차", "quote": "\\sin x-\\cos x", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q06
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 $\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$일 때, $\tan 50^\circ - \cos 40^\circ$의 값은?
선지
① $0.3258$ ② $0.3858$ ③ $0.4058$ ④ $0.4158$ ⑤ $0.4258$
정답
⑤
해설
$\tan 50^\circ = 1.1918$, $\cos 40^\circ = 0.7660$이므로 $$ \tan 50^\circ - \cos 40^\circ = 1.1918 - 0.7660 = 0.4258 $$ 따라서 정답은 ⑤이다.


{"kind": "geometry", "caption": "반지름 1인 사분원에서 40°, 50°의 삼각비", "viewBox": [0, 0, 220, 220], "vertices": {"O": [40, 180], "A": [180, 180], "B": [40, 40], "P": [147, 90]}, "segments": [["O", "A"], ["O", "B"], ["O", "P"]], "arcs": [{"center": "O", "radius": 140, "startAngle": 0, "endAngle": 90}], "labels": {"O": "40°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_UNIT_QUARTER_CIRCLE", "CC_ARITHMETIC_SIMPLIFICATION"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사분원", "quote": "반지름의 길이가 $1$인 사분원", "src": "stem"}], "condition": [{"term": "삼각비", "quote": "$\\tan 50^\\circ = 1.1918$, $\\cos 40^\\circ = 0.7660$", "src": "stem"}], "goal": [{"term": "차", "quote": "\\tan 50^\\circ - \\cos 40^\\circ", "src": "stem"}], "method": [{"term": "차", "quote": "1.1918 - 0.7660 = 0.4258", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q07
* 형식: 객관식
* 배점: 4
발문
이차방정식 $5x^2-9x+4=0$의 한 근을 $\sin a^\circ$라 할 때, $\cos a^\circ \times \tan a^\circ$의 값을 구하면? (단, $0^\circ < a^\circ < 90^\circ$)
선지
① $\dfrac{4}{5}$ ② $1$ ③ $\dfrac{3}{5}$ ④ $\dfrac{3}{4}$ ⑤ $\dfrac{12}{25}$
정답
①
해설
$5x^2-9x+4 = (5x-4)(x-1) = 0$이므로 $x=\dfrac{4}{5}$ 또는 $x=1$이다. $0^\circ < a^\circ < 90^\circ$이므로 $0 < \sin a^\circ < 1$이고, 따라서 $\sin a^\circ = \dfrac{4}{5}$이다. $$ \cos a^\circ \times \tan a^\circ = \cos a^\circ \times \dfrac{\sin a^\circ}{\cos a^\circ} = \sin a^\circ = \dfrac{4}{5} $$ 따라서 정답은 ①이다.


"NONE"

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_TRIG_RATIO_DEFINITIONS", "CC_ARITHMETIC_SIMPLIFICATION"], "conditions": ["COND_RESTRICTED_INTERVAL"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각비", "quote": "\\sin a^\\circ", "src": "stem"}], "condition": [{"term": "예각", "quote": "$0^\\circ < a^\\circ < 90^\\circ$", "src": "stem"}], "goal": [{"term": "곱", "quote": "\\cos a^\\circ \\times \\tan a^\\circ", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\cos a^\\circ \\times \\dfrac{\\sin a^\\circ}{\\cos a^\\circ}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q08
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 $\angle C=90^\circ$, $\angle ABC=30^\circ$, $\angle AEC=60^\circ$이고 $\overline{BE}=8$일 때, $\overline{EC}$의 길이 $x$의 값은?
선지
① $2$ ② $3$ ③ $4$ ④ $2\sqrt{3}$ ⑤ $6$
정답
③
해설
$BC = 8+x$이고 직각삼각형 $ABC$, $AEC$에서 $$ AC = (8+x)\tan 30^\circ = \dfrac{8+x}{\sqrt{3}}, \qquad AC = x\tan 60^\circ = x\sqrt{3} $$ 따라서 $\dfrac{8+x}{\sqrt{3}} = x\sqrt{3} \implies 8+x = 3x \implies x=4$이다. 정답은 ③이다.


{"kind": "geometry", "caption": "∠C=90°, ∠ABC=30°, ∠AEC=60°, BE=8, EC=x", "viewBox": [0, 0, 270, 180], "vertices": {"B": [30, 145], "E": [160, 145], "C": [225, 145], "A": [225, 32]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"], ["E", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"BE": "8", "EC": "x", "B": "30°", "E": "60°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "길이", "quote": "$\\overline{BE}=8$", "src": "stem"}, {"term": "각", "quote": "$\\angle ABC=30^\\circ$, $\\angle AEC=60^\\circ$", "src": "stem"}], "condition": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "solution"}], "goal": [{"term": "길이", "quote": "$\\overline{EC}$의 길이 $x$", "src": "stem"}], "method": [{"term": "삼각비", "quote": "x\\tan 60^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q09
* 형식: 객관식
* 배점: 4
발문
다음 $\triangle ABC$에서 $BC=10,\mathrm{cm}$, $\angle B=30^\circ$, $\angle C=105^\circ$일 때, $\triangle ABC$의 넓이는?
선지
① $25(\sqrt{3}+1),\mathrm{cm}^2$ ② $\dfrac{25(\sqrt{3}-1)}{2},\mathrm{cm}^2$ ③ $25\sqrt{3},\mathrm{cm}^2$ ④ $\dfrac{25(\sqrt{3}+1)}{2},\mathrm{cm}^2$ ⑤ $50(\sqrt{3}+1),\mathrm{cm}^2$
정답
④
해설
$\angle A = 180^\circ - 30^\circ - 105^\circ = 45^\circ$이다. $C$에서 $AB$에 내린 수선의 발을 $D$라 하면 직각삼각형 $BCD$에서 $$ CD = 10\sin 30^\circ = 5,\mathrm{cm}, \qquad BD = 10\cos 30^\circ = 5\sqrt{3},\mathrm{cm} $$ $\triangle ACD$는 $\angle A=45^\circ$인 직각이등변삼각형이므로 $AD=CD=5,\mathrm{cm}$이다. 따라서 $AB = 5 + 5\sqrt{3},\mathrm{cm}$이고 $\triangle ABC$의 넓이는 $$ \dfrac{1}{2}\times (5+5\sqrt{3})\times 5 = \dfrac{25(\sqrt{3}+1)}{2},\mathrm{cm}^2 $$ 정답은 ④이다.


{"kind": "geometry", "caption": "BC=10cm, ∠B=30°, ∠C=105°인 △ABC", "viewBox": [0, 0, 270, 170], "vertices": {"B": [30, 140], "A": [230, 140], "C": [155, 68]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"]], "labels": {"BC": "10cm", "B": "30°", "C": "105°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.3, "crossConcepts": ["CC_AUXILIARY_ALTITUDE", "CC_TRIANGLE_AREA_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$BC=10\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle B=30^\\circ$, $\\angle C=105^\\circ$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이", "src": "stem"}], "method": [{"term": "수선", "quote": "내린 수선의 발을 $D$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q10
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 $20,\mathrm{m}$ 떨어진 두 지점 $B$, $C$에서 탑의 꼭대기 $A$ 지점을 올려본 각의 크기가 각각 $60^\circ$, $45^\circ$일 때, 이 탑의 높이 $\overline{AH}$를 구하는 과정이다. (가)~(마)에 들어갈 식이 알맞게 짝지어진 것은?


$\triangle ABH$에서 $\tan 60^\circ = \dfrac{\text{(가)}}{\overline{BH}}$이므로 $\overline{BH} = \text{(나)}$ $\triangle AHC$에서 $\tan 45^\circ = 1$이므로 $\overline{CH} = \text{(다)}$ $\overline{BH}+\overline{CH}=20$이므로 $\overline{AH} = \dfrac{20\sqrt{3}}{\text{(라)}} = \text{(마)}$
선지
① (가): $\overline{AB}$ ② (나): $\dfrac{\overline{AH}}{\sqrt{3}}$ ③ (다): $\dfrac{\overline{AH}}{\sqrt{3}}$ ④ (라): $\sqrt{3}-1$ ⑤ (마): $30+10\sqrt{3}$
정답
②
해설
$\triangle ABH$에서 $\tan 60^\circ = \dfrac{\overline{AH}}{\overline{BH}} = \sqrt{3}$이므로 (가)는 $\overline{AH}$, (나)는 $\dfrac{\overline{AH}}{\sqrt{3}}$이다. $\triangle AHC$에서 $\overline{CH}=\overline{AH}$이므로 (다)는 $\overline{AH}$이다. $\dfrac{\overline{AH}}{\sqrt{3}}+\overline{AH}=20 \implies \overline{AH}=\dfrac{20\sqrt{3}}{\sqrt{3}+1}=30-10\sqrt{3}$이므로 (라)는 $\sqrt{3}+1$, (마)는 $30-10\sqrt{3}$이다. 따라서 옳게 짝지어진 것은 ②이다.


{"kind": "geometry", "caption": "20m 떨어진 B, C에서 탑 꼭대기 A를 올려본 각 60°, 45°", "viewBox": [0, 0, 270, 190], "vertices": {"B": [30, 155], "C": [240, 155], "H": [107, 155], "A": [107, 22]}, "segments": [["B", "C"], ["A", "B"], ["A", "C"], ["A", "H"]], "rightAngles": [["A", "H", "C"]], "labels": {"BC": "20m", "B": "60°", "C": "45°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "$20\\,\\mathrm{m}$ 떨어진", "src": "stem"}, {"term": "각", "quote": "각각 $60^\\circ$, $45^\\circ$", "src": "stem"}], "condition": [{"term": "높이", "quote": "높이 $\\overline{AH}$", "src": "stem"}], "goal": [{"term": "삼각비", "quote": "알맞게 짝지어진 것은", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\tan 60^\\circ = \\dfrac{\\overline{AH}}{\\overline{BH}}", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q11
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 민지가 연을 올려본각의 크기가 $35^\circ$이고 민지의 손에서 연까지의 거리는 $50,\mathrm{m}$이다. 지면에서 민지의 손까지의 높이가 $1.5,\mathrm{m}$일 때, 지면에서 연까지의 높이는 반올림하여 소수점 아래 첫째 자리까지 구하면? (단, $\sin 35^\circ=0.5736$, $\cos 35^\circ=0.8192$, $\tan 35^\circ=0.7002$)
선지
① $28.7,\mathrm{m}$ ② $29.2,\mathrm{m}$ ③ $29.7,\mathrm{m}$ ④ $30.0,\mathrm{m}$ ⑤ $30.2,\mathrm{m}$
정답
⑤
해설
손에서 연까지의 높이 차는 $50\sin 35^\circ = 50\times 0.5736 = 28.68,\mathrm{m}$이다. 지면에서 손까지의 높이 $1.5,\mathrm{m}$를 더하면 $28.68 + 1.5 = 30.18,\mathrm{m}$이다. 소수점 아래 첫째 자리까지 반올림하면 $30.2,\mathrm{m}$이므로 정답은 ⑤이다.


{"kind": "geometry", "caption": "올려본 각 35°, 연줄 길이 50m, 손 높이 1.5m", "viewBox": [0, 0, 260, 190], "vertices": {"P": [40, 140], "Q": [210, 140], "K": [210, 35]}, "segments": [["P", "Q"], ["Q", "K"], ["P", "K"]], "rightAngles": [["P", "Q", "K"]], "labels": {"PK": "50m", "P": "35°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.3, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_TRIG_MEASUREMENT"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "거리는 $50\\,\\mathrm{m}$", "src": "stem"}, {"term": "각", "quote": "$35^\\circ$", "src": "stem"}], "condition": [{"term": "높이", "quote": "손까지의 높이가 $1.5\\,\\mathrm{m}$", "src": "stem"}], "goal": [{"term": "높이", "quote": "연까지의 높이", "src": "stem"}], "method": [{"term": "합", "quote": "28.68 + 1.5 = 30.18", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q12
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같은 직각삼각형 $ABC$($\angle C=90^\circ, AB=7, \angle B=38^\circ$)에 대하여 $\overline{AC}$의 길이로 옳은 것을 모두 고르면? (정답 2개)
선지
① $7\sin 38^\circ$ ② $7\cos 38^\circ$ ③ $7\tan 38^\circ$ ④ $7\cos 52^\circ$ ⑤ $7\sin 52^\circ$
정답
①, ④
해설
$\angle A = 90^\circ - 38^\circ = 52^\circ$이다. $\angle B=38^\circ$를 기준으로 $\overline{AC}=7\sin 38^\circ$이고, $\angle A=52^\circ$를 기준으로 $\overline{AC}=7\cos 52^\circ$이다. 따라서 옳은 것은 ①, ④이다.


{"kind": "geometry", "caption": "∠C=90°, AB=7, ∠B=38°인 직각삼각형 ABC", "viewBox": [0, 0, 260, 170], "vertices": {"B": [30, 140], "C": [210, 140], "A": [210, 35]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"]], "rightAngles": [["B", "C", "A"]], "labels": {"AB": "7", "B": "38°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.0, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형 $ABC$", "src": "stem"}, {"term": "길이", "quote": "AB=7", "src": "stem"}], "condition": [{"term": "각", "quote": "\\angle B=38^\\circ", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\overline{AC}$의 길이", "src": "stem"}], "method": [{"term": "삼각비", "quote": "7\\sin 38^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q13
* 형식: 객관식
* 배점: 4
발문
다음 그림의 $\triangle ABC$에서 $\angle A$의 이등분선이 $\overline{BC}$와 만나는 점을 $P$라 하자. $\angle A=120^\circ$, $\overline{AB}=6$, $\overline{AC}=12$일 때, $\overline{AP}$의 길이는?
선지
① $4$ ② $3$ ③ $\dfrac{7}{2}$ ④ $\dfrac{9}{2}$ ⑤ $5$
정답
①
해설
$\angle BAP=\angle PAC=60^\circ$이고, $\triangle ABC$의 넓이는 $$ \triangle ABC = \dfrac{1}{2}\times 6\times 12\times\sin 60^\circ = 18\sqrt{3} $$ $\overline{AP}=x$라 하면 $\triangle ABC = \triangle ABP + \triangle APC$이므로 $$ \dfrac{1}{2}\times 6\times x\times\sin 60^\circ + \dfrac{1}{2}\times 12\times x\times\sin 60^\circ = 18\sqrt{3} \implies \dfrac{9\sqrt{3}}{2}x = 18\sqrt{3} \implies x = 4 $$ 따라서 정답은 ①이다.


{"kind": "geometry", "caption": "∠A=120°, AB=6, AC=12인 △ABC와 ∠A의 이등분선 AP", "viewBox": [0, 0, 260, 170], "vertices": {"A": [100, 35], "B": [40, 140], "C": [230, 140], "P": [103, 140]}, "segments": [["A", "B"], ["B", "C"], ["A", "C"], ["A", "P"]], "labels": {"AB": "6", "AC": "12", "A": "120°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.7, "crossConcepts": ["CC_TRIANGLE_AREA_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "삼각형", "quote": "$\\triangle ABC$", "src": "stem"}, {"term": "길이", "quote": "$\\overline{AB}=6$, $\\overline{AC}=12$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle A=120^\\circ$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\overline{AP}$의 길이", "src": "stem"}], "method": [{"term": "넓이", "quote": "\\triangle ABC = \\triangle ABP + \\triangle APC", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q14
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 $\triangle ABC$가 원 $O$에 내접하고, $\overline{OM}\perp\overline{AB}$, $\overline{ON}\perp\overline{AC}$일 때, 다음 중 옳지 않은 것은?
선지
① $\overline{AB}=2\overline{BM}$ ② $\overline{AC}=2\overline{CN}$ ③ $\overline{BC}=2\overline{MN}$ ④ $\overline{AB}=\overline{AC}$ ⑤ $\overline{MN}\parallel\overline{BC}$
정답
④
해설
$OM \perp AB$, $ON \perp AC$이므로 $M$, $N$은 각각 $AB$, $AC$의 중점이다. 따라서 삼각형의 중점 연결 정리에 의해 $\overline{MN}\parallel\overline{BC}$, $\overline{BC}=2\overline{MN}$이 성립한다. 그러나 $\overline{OM}=\overline{ON}$이라는 조건이 없으므로 $\overline{AB}=\overline{AC}$가 항상 성립하지는 않는다. 따라서 옳지 않은 것은 ④이다.


{"kind": "geometry", "caption": "원 O에 내접하는 △ABC와 현 AB, AC에 내린 수선 OM, ON", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [95, 31], "B": [41, 150], "C": [185, 138], "M": [68, 90.5], "N": [140, 84.5]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"], ["O", "M"], ["O", "N"], ["M", "N"]], "rightAngles": [["O", "M", "A"], ["O", "N", "A"]]}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.6, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditions": [], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$에 내접", "src": "stem"}, {"term": "수선", "quote": "\\overline{OM}\\perp\\overline{AB}", "src": "stem"}], "condition": [{"term": "중점", "quote": "각각 $AB$, $AC$의 중점", "src": "solution"}], "goal": [{"term": "현", "quote": "옳지 않은 것은", "src": "stem"}], "method": [{"term": "중점", "quote": "중점 연결 정리", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q15
* 형식: 객관식
* 배점: 3
발문
다음 그림에서 원 $O$의 중심에서 두 현까지의 거리가 모두 $3,\mathrm{cm}$이고 아래 현의 절반의 길이가 $6,\mathrm{cm}$일 때, 위 현의 길이 $x$의 값은?
선지
① $10,\mathrm{cm}$ ② $12,\mathrm{cm}$ ③ $14,\mathrm{cm}$ ④ $15,\mathrm{cm}$ ⑤ $16,\mathrm{cm}$
정답
②
해설
중심에서 현에 내린 수선은 현을 이등분하므로 아래 현의 길이는 $6+6=12,\mathrm{cm}$이다. 한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 $x=12,\mathrm{cm}$이다. 정답은 ②이다.


{"kind": "geometry", "caption": "원 O의 중심에서 거리 3cm인 두 현 (아래 현 절반 6cm, 위 현 x)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "M": [110, 145], "N": [110, 75]}, "segments": [["O", "M"], ["O", "N"]], "labels": {"OM": "3cm", "ON": "3cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 1, "difficultyScore": 1.5, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "거리", "quote": "거리가 모두 $3\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "현", "quote": "절반의 길이가 $6\\,\\mathrm{cm}$", "src": "stem"}], "goal": [{"term": "현", "quote": "현의 길이 $x$", "src": "stem"}], "method": [{"term": "현", "quote": "두 현의 길이는 같으므로", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q16
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 점 $O$를 중심으로 하는 두 원에서 작은 원의 접선이 큰 원과 만나는 두 점을 각각 $A$, $B$라 하자. 두 원의 넓이의 차가 $49\pi,\mathrm{cm}^2$일 때, $\overline{AB}$의 길이는?
선지
① $12,\mathrm{cm}$ ② $13,\mathrm{cm}$ ③ $14,\mathrm{cm}$ ④ $15,\mathrm{cm}$ ⑤ $16,\mathrm{cm}$
정답
③
해설
큰 원과 작은 원의 반지름을 각각 $R$, $r$이라 하면 $\pi R^2 - \pi r^2 = 49\pi$, 즉 $R^2 - r^2 = 49$이다. 접점 $M$에 대하여 $OM \perp AB$이므로 직각삼각형 $OMA$에서 $AM^2 = R^2 - r^2 = 49$, $AM = 7,\mathrm{cm}$이다. 따라서 $AB = 2AM = 14,\mathrm{cm}$이므로 정답은 ③이다.


{"kind": "geometry", "caption": "동심원에서 작은 원에 접하는 큰 원의 현 AB (넓이 차 49πcm²)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}, {"center": "O", "radius": 48}], "vertices": {"O": [110, 110], "M": [110, 158], "A": [46, 158], "B": [174, 158]}, "segments": [["A", "B"], ["O", "M"], ["O", "A"]], "rightAngles": [["O", "M", "A"]]}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.0, "crossConcepts": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "두 원", "src": "stem"}, {"term": "접선", "quote": "작은 원의 접선", "src": "stem"}], "condition": [{"term": "넓이", "quote": "넓이의 차가 $49\\pi\\,\\mathrm{cm}^2$", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\overline{AB}$의 길이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $OMA$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q17
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 직선 $PA$는 원 $O$의 접선이고 점 $A$는 접점이다. $\overline{PA}=8\sqrt{3},\mathrm{cm}$, $\overline{PB}=8,\mathrm{cm}$이고 세 점 $P$, $B$, $O$가 한 직선 위에 있을 때, $\overline{BO}$의 길이는?
선지
① $4,\mathrm{cm}$ ② $5,\mathrm{cm}$ ③ $6,\mathrm{cm}$ ④ $7,\mathrm{cm}$ ⑤ $8,\mathrm{cm}$
정답
⑤
해설
$BO=AO=r,\mathrm{cm}$라 하면 $PO = 8+r$이다. 접점 $A$에서 $OA \perp PA$이므로 직각삼각형 $PAO$에서 $$ (8+r)^2 = (8\sqrt{3})^2 + r^2 \implies 64+16r+r^2 = 192+r^2 \implies 16r = 128 \implies r = 8 $$ 따라서 $BO=8,\mathrm{cm}$이므로 정답은 ⑤이다.


{"kind": "geometry", "caption": "원 O의 접선 PA=8√3cm와 할선 P-B-O (PB=8cm)", "viewBox": [0, 0, 250, 190], "circles": [{"center": "O", "radius": 55}], "vertices": {"O": [165, 100], "B": [110, 100], "P": [35, 100], "A": [141, 51]}, "segments": [["P", "A"], ["P", "O"], ["O", "A"]], "rightAngles": [["O", "A", "P"]], "labels": {"PA": "8√3cm", "PB": "8cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.7, "crossConcepts": ["CC_CIRCLE_TANGENT_PROPERTY", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$\\overline{PA}=8\\sqrt{3}\\,\\mathrm{cm}$, $\\overline{PB}=8\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "점 $A$는 접점", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\overline{BO}$의 길이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $PAO$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q18
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 원 $O$는 사각형 $ABHD$의 네 변과 접한다. 직사각형 $ABCD$에서 $\overline{AB}=10,\mathrm{cm}$, $\overline{BC}=16,\mathrm{cm}$일 때, $\triangle CDH$의 둘레의 길이는?
선지
① $32,\mathrm{cm}$ ② $30,\mathrm{cm}$ ③ $34,\mathrm{cm}$ ④ $36,\mathrm{cm}$ ⑤ $38,\mathrm{cm}$
정답
①
해설
원의 지름이 $AB=10,\mathrm{cm}$이므로 반지름은 $5,\mathrm{cm}$이다. $AD$, $AB$, $BC$, $DH$와 원 $O$의 접점을 각각 $E$, $F$, $G$, $I$라 하면 $AF=AE=5$, $BF=BG=5$이다. $DE = 16-5 = 11$이므로 $DI=11$이고, $GH=HI=x$라 하면 $DH=11+x$, $HC=16-(5+x)=11-x$이다. 따라서 $\triangle CDH$의 둘레의 길이는 $10 + (11+x) + (11-x) = 32,\mathrm{cm}$이다. 정답은 ①이다.


{"kind": "geometry", "caption": "직사각형 ABCD(AB=10cm, BC=16cm) 안에서 사각형 ABHD에 내접하는 원 O", "viewBox": [0, 0, 260, 180], "circles": [{"center": "O", "radius": 55}], "vertices": {"A": [40, 35], "B": [40, 145], "C": [220, 145], "D": [220, 35], "O": [95, 90], "H": [140, 145]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "H"]], "labels": {"AB": "10cm", "BC": "16cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 3.8, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH", "CC_RECTANGLE_INSCRIBED_CIRCLE_TANGENT"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "사각형", "quote": "직사각형 $ABCD$", "src": "stem"}, {"term": "길이", "quote": "$\\overline{AB}=10\\,\\mathrm{cm}$, $\\overline{BC}=16\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "외접", "quote": "네 변과 접한다", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\triangle CDH$의 둘레의 길이", "src": "stem"}], "method": [{"term": "접점", "quote": "접점을 각각 $E$, $F$, $G$, $I$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q19
* 형식: 객관식
* 배점: 5
발문
다음 그림은 원 $O$의 원주 위의 한 점이 원의 중심 $O$에 겹쳐지도록 현 $AB$를 접는 선으로 하여 접은 것이다. 원 위의 한 점 $P$에 대하여 $\overline{AP}=6$, $\overline{BP}=5$일 때, $\triangle PAB$의 넓이는?
선지
① $15$ ② $\dfrac{15\sqrt{2}}{2}$ ③ $\dfrac{15\sqrt{3}}{2}$ ④ $15\sqrt{3}$ ⑤ $30$
정답
③
해설
중심 $O$에 겹쳐지는 점을 $Q$라 하면 $\triangle AOQ$, $\triangle BOQ$는 정삼각형이므로 $\angle AOB=120^\circ$이다. 원주각은 중심각의 절반이므로 $\angle APB=60^\circ$이다. 따라서 $\triangle PAB$의 넓이는 $\dfrac{1}{2}\times 6\times 5\times\sin 60^\circ = \dfrac{15\sqrt{3}}{2}$이므로 정답은 ③이다.


{"kind": "geometry", "caption": "원주 위의 점이 중심 O에 겹치도록 접은 현 AB와 원 위의 점 P (AP=6, BP=5)", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [41, 150], "B": [179, 150], "P": [125, 32]}, "segments": [["A", "B"], ["A", "P"], ["B", "P"]], "labels": {"AP": "6", "BP": "5"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원주각", "l3": "원주각과 중심각", "l4": "중심각과 원주각"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.2, "crossConcepts": ["CC_PAPER_FOLDING_SIMILARITY", "CC_TRIANGLE_AREA_TRIG"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_ANGLE_RELATIONS", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "길이", "quote": "$\\overline{AP}=6$, $\\overline{BP}=5$", "src": "stem"}], "condition": [{"term": "현", "quote": "현 $AB$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle PAB$의 넓이", "src": "stem"}], "method": [{"term": "원주각", "quote": "원주각은 중심각의 절반", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q20
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 $\triangle ABC$는 $\angle C=90^\circ$, $\overline{BC}=8,\mathrm{cm}$, $\overline{AC}=6,\mathrm{cm}$인 직각삼각형이고 원 $O$는 $\triangle ABC$의 내접원이다. 원 $O$의 반지름의 길이는?
선지
① $1,\mathrm{cm}$ ② $2,\mathrm{cm}$ ③ $\dfrac{5}{2},\mathrm{cm}$ ④ $3,\mathrm{cm}$ ⑤ $\dfrac{7}{2},\mathrm{cm}$
정답
②
해설
$AB = \sqrt{6^2+8^2} = 10,\mathrm{cm}$이고, $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 6\times 8 = 24,\mathrm{cm}^2$이다. 내접원의 반지름을 $r,\mathrm{cm}$라 하면 $\dfrac{1}{2}r(6+8+10) = 24 \implies 12r = 24 \implies r = 2,\mathrm{cm}$이다. 정답은 ②이다.


{"kind": "geometry", "caption": "∠C=90°, BC=8cm, AC=6cm인 직각삼각형 ABC의 내접원 O", "viewBox": [0, 0, 240, 190], "circles": [{"center": "O", "radius": 36}], "vertices": {"C": [45, 155], "B": [189, 155], "A": [45, 47], "O": [81, 119]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"]], "rightAngles": [["A", "C", "B"]], "labels": {"BC": "8cm", "AC": "6cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.3, "crossConcepts": ["CC_INSCRIBED_CIRCLE", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "직각삼각형", "quote": "직각삼각형이고", "src": "stem"}, {"term": "길이", "quote": "$\\overline{BC}=8\\,\\mathrm{cm}$, $\\overline{AC}=6\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "각", "quote": "$\\angle C=90^\\circ$", "src": "stem"}], "goal": [{"term": "반지름", "quote": "반지름의 길이", "src": "stem"}], "method": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이는", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q21
* 형식: 서답형
* 배점: 6
발문
[서술형 1] 다음 그림과 같이 한 변의 길이가 $12,\mathrm{cm}$인 정사각형 $ABCD$에서 $\overline{CD}$ 위의 한 점 $E$에 대하여 $\overline{BE}$를 한 변으로 하는 정사각형 $BEFG$를 그렸더니 $\angle ABE=60^\circ$가 되었다. 두 정사각형이 겹치는 색칠한 부분의 넓이를 구하는 과정과 답을 쓰시오.
선지
없음
정답
$(192-56\sqrt{3}),\mathrm{cm}^2$
해설
$\angle EBC = 90^\circ - 60^\circ = 30^\circ$이므로 직각삼각형 $BCE$에서 $CE = 12\tan 30^\circ = 4\sqrt{3},\mathrm{cm}$이고, $DE = 12 - 4\sqrt{3},\mathrm{cm}$이다. $EF$와 $AD$의 교점을 $H$라 하면 $\angle DEH = 30^\circ$이므로 직각삼각형 $DHE$에서 $HD = \dfrac{12-4\sqrt{3}}{\sqrt{3}} = 4\sqrt{3}-4,\mathrm{cm}$이다. $\triangle BCE = \dfrac{1}{2}\times 12\times 4\sqrt{3} = 24\sqrt{3}$, $\triangle EHD = \dfrac{1}{2}(12-4\sqrt{3})(4\sqrt{3}-4) = 32\sqrt{3}-48$이다. 따라서 색칠한 부분의 넓이는 $12^2 - 24\sqrt{3} - (32\sqrt{3}-48) = (192-56\sqrt{3}),\mathrm{cm}^2$이다.


{"kind": "geometry", "caption": "한 변 12cm 정사각형 ABCD와 정사각형 BEFG (∠ABE=60°)", "viewBox": [0, 0, 260, 220], "vertices": {"A": [40, 40], "B": [40, 180], "C": [180, 180], "D": [180, 40], "E": [180, 99], "H": [133, 40]}, "segments": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"], ["E", "H"]], "labels": {"AB": "12cm", "B": "60°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "rpmPathStatus": "mapped", "difficultyBucket": 4, "difficultyScore": 4.2, "crossConcepts": ["CC_TRIG_RATIO_APPLICATION", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "정사각형", "quote": "정사각형 $ABCD$", "src": "stem"}, {"term": "각", "quote": "$\\angle ABE=60^\\circ$", "src": "stem"}], "condition": [{"term": "길이", "quote": "한 변의 길이가 $12\\,\\mathrm{cm}$", "src": "stem"}], "goal": [{"term": "넓이", "quote": "색칠한 부분의 넓이", "src": "stem"}], "method": [{"term": "직각삼각형", "quote": "직각삼각형 $BCE$", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q22
* 형식: 서답형
* 배점: 5
발문
[서술형 2] 다음 그림과 같이 $16,\mathrm{m}$ 떨어진 두 지점 $B$와 $D$에서 건물의 꼭대기 $A$ 지점을 올려다본 각의 크기가 각각 $30^\circ$, $45^\circ$이다. 이 건물의 높이 $\overline{AC}$를 구하는 과정과 답을 쓰시오.
선지
없음
정답
$8(\sqrt{3}+1),\mathrm{m}$
해설
건물의 높이를 $AC=x,\mathrm{m}$라 하면 $\triangle ADC$에서 $\tan 45^\circ = \dfrac{x}{DC} = 1$이므로 $DC=x$이다. $BC = 16+x$이므로 $\triangle ABC$에서 $\tan 30^\circ = \dfrac{x}{16+x} = \dfrac{1}{\sqrt{3}}$이다. $(\sqrt{3}-1)x = 16 \implies x = \dfrac{16}{\sqrt{3}-1} = 8(\sqrt{3}+1),\mathrm{m}$이다.


{"kind": "geometry", "caption": "16m 떨어진 두 지점 B, D에서 건물 꼭대기 A를 올려본 각 30°, 45°", "viewBox": [0, 0, 270, 180], "vertices": {"B": [30, 145], "D": [140, 145], "C": [230, 145], "A": [230, 55]}, "segments": [["B", "C"], ["C", "A"], ["B", "A"], ["D", "A"]], "rightAngles": [["A", "C", "B"]], "labels": {"BD": "16m", "B": "30°", "D": "45°"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "rpmPath": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "rpmPathStatus": "mapped", "difficultyBucket": 3, "difficultyScore": 3.2, "crossConcepts": ["CC_ELEVATION_ANGLE", "CC_RADICAL_RATIONALIZATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "거리", "quote": "$16\\,\\mathrm{m}$ 떨어진", "src": "stem"}, {"term": "각", "quote": "각각 $30^\\circ$, $45^\\circ$", "src": "stem"}], "condition": [{"term": "높이", "quote": "높이 $\\overline{AC}$", "src": "stem"}], "goal": [{"term": "높이", "quote": "건물의 높이 $\\overline{AC}$", "src": "stem"}], "method": [{"term": "삼각비", "quote": "\\tan 30^\\circ", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q23
* 형식: 서답형
* 배점: 5
발문
[서술형 3] 다음 그림의 원 $O$에서 $\overline{OL}=\overline{OM}=\overline{ON}$이고 $\overline{AB}=8,\mathrm{cm}$일 때, $\triangle ABC$의 넓이를 구하는 과정과 답을 쓰시오. (단, $L, M, N$은 중심 $O$에서 세 변에 내린 수선의 발이다.)
선지
없음
정답
$16\sqrt{3},\mathrm{cm}^2$
해설
$\overline{OL}=\overline{OM}=\overline{ON}$이므로 중심에서 같은 거리에 있는 세 현의 길이는 같아 $AB=BC=CA=8,\mathrm{cm}$인 정삼각형이다. 정삼각형의 높이는 $h = \sqrt{8^2 - 4^2} = 4\sqrt{3},\mathrm{cm}$이므로 $$ \triangle ABC = \dfrac{1}{2}\times 8\times 4\sqrt{3} = 16\sqrt{3},\mathrm{cm}^2 $$ 이다.


{"kind": "geometry", "caption": "원 O에 내접하는 △ABC에서 OL=OM=ON, AB=8cm", "viewBox": [0, 0, 220, 220], "circles": [{"center": "O", "radius": 80}], "vertices": {"O": [110, 110], "A": [110, 30], "B": [41, 150], "C": [179, 150], "M": [75, 90], "L": [110, 150], "N": [145, 90]}, "segments": [["A", "B"], ["B", "C"], ["C", "A"], ["O", "L"], ["O", "M"], ["O", "N"]], "rightAngles": [["O", "L", "B"], ["O", "M", "A"], ["O", "N", "C"]], "labels": {"AB": "8cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.5, "crossConcepts": ["CC_CIRCLE_CHORD_DISTANCE", "CC_RADICAL_GEOMETRIC_APPLICATION"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "원", "quote": "원 $O$", "src": "stem"}, {"term": "길이", "quote": "$\\overline{AB}=8\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "수선", "quote": "내린 수선의 발", "src": "stem"}], "goal": [{"term": "넓이", "quote": "$\\triangle ABC$의 넓이", "src": "stem"}], "method": [{"term": "현", "quote": "세 현의 길이는 같아", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
Q24
* 형식: 서답형
* 배점: 5
발문
[서술형 4] 다음 그림에서 $\overrightarrow{AD}$, $\overrightarrow{AE}$, $\overline{BC}$는 원 $O$의 접선이고 세 점 $D$, $E$, $F$는 접점이다. $\overline{AE}=14,\mathrm{cm}$일 때, $\triangle ABC$의 둘레의 길이를 구하는 과정과 답을 쓰시오.
선지
없음
정답
$28,\mathrm{cm}$
해설
원 밖의 한 점에서 원에 그은 두 접선의 길이는 같으므로 $AD=AE=14,\mathrm{cm}$, $BD=BF$, $CE=CF$이다. 따라서 $\triangle ABC$의 둘레의 길이는 $$ AB+BC+CA = (AB+BF)+(CF+AC) = (AB+BD)+(CE+AC) = AD+AE = 14+14 = 28,\mathrm{cm} $$ 이다.


{"kind": "geometry", "caption": "원 O의 접선 AD, AE, BC (접점 D, E, F; AE=14cm)", "viewBox": [0, 0, 260, 200], "circles": [{"center": "O", "radius": 50}], "vertices": {"O": [175, 100], "A": [35, 100], "D": [156, 54], "E": [156, 146], "B": [110, 72], "C": [110, 128], "F": [125, 100]}, "segments": [["A", "D"], ["A", "E"], ["B", "C"]], "labels": {"AE": "14cm"}}

{"curriculum": "2015", "grade": "중3", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_PROPERTY", "rpmPath": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "rpmPathStatus": "mapped", "difficultyBucket": 2, "difficultyScore": 2.4, "crossConcepts": ["CC_CIRCLE_TANGENT_LENGTH"], "conditions": ["COND_POSITIVE"], "ptTplCandidate": {"primaryTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "confidence": 0.92}, "item4slot": {"given": [{"term": "접선", "quote": "원 $O$의 접선", "src": "stem"}, {"term": "길이", "quote": "$\\overline{AE}=14\\,\\mathrm{cm}$", "src": "stem"}], "condition": [{"term": "접점", "quote": "세 점 $D$, $E$, $F$는 접점", "src": "stem"}], "goal": [{"term": "길이", "quote": "$\\triangle ABC$의 둘레의 길이", "src": "stem"}], "method": [{"term": "접선", "quote": "두 접선의 길이는 같으므로", "src": "solution"}]}, "hold": false, "holdReason": null, "newKeyProposals": []}
