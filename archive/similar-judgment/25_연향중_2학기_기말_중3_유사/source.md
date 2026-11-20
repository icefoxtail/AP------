

```
{
  "stem": "25_연향중_2학기_기말_중3_유사",
  "sourceArchiveFile": "original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js",
  "examFolder": "2final",
  "grade": "중3",
  "curriculum": "2015",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 점 \$O\$를 중심으로 하는 두 동심원에서 작은 원의 접선과 큰 원의 두 교점을 각각 \$A\$, \$B\$라 하자. \$\\overline{AB} \= 16,\\mathrm{cm}\$일 때, 두 원 사이의 색칠한 부분의 넓이는? \[4점\]

### 선지

① \$64\\pi,\\mathrm{cm}^2\$ ② \$68\\pi,\\mathrm{cm}^2\$ ③ \$72\\pi,\\mathrm{cm}^2\$ ④ \$76\\pi,\\mathrm{cm}^2\$ ⑤ \$80\\pi,\\mathrm{cm}^2\$

### 정답

①

### 해설

작은 원이 직선 \$AB\$와 만나는 접점을 \$M\$이라 하자. 원의 중심에서 접점에 그은 반지름은 접선과 수직이므로 \$\\overline{OM} \\perp \\overline{AB}\$이다. 큰 원에서 중심 \$O\$에서 현 \$AB\$에 내린 수선은 현을 이등분하므로 \$M\$은 \$\\overline{AB}\$의 중점이다. \$\$ \\begin{aligned} \\overline{AM} \= \\overline{BM} \= \\dfrac{\\overline{AB}}{2} \= \\dfrac{16}{2} \= 8,\\mathrm{cm} \\end{aligned} \$\$ 작은 원의 반지름의 길이를 \$r\$, 큰 원의 반지름의 길이를 \$R\$이라 하면 직각삼각형 \$OMA\$에서 피타고라스 정리에 의하여 \$\$ \\begin{aligned} R^2 &= r^2 \+ 8^2 \\ R^2 \- r^2 &= 64 \\end{aligned} \$\$ 색칠한 부분의 넓이는 큰 원의 넓이에서 작은 원의 넓이를 뺀 값이므로 \$\$ \\begin{aligned} \\pi R^2 \- \\pi r^2 &= \\pi(R^2 \- r^2) \\ &= 64\\pi,\\mathrm{cm}^2 \\end{aligned} \$\$ 따라서 정답은 ①이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "동심원과 현의 접선 및 직각삼각형 피타고라스 기하 작도"
}
```

```
{
  "sourceQid": "1",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "현의 중점 AM=8을 직각삼각형 OMA에 대입하여 R^2-r^2=64를 구하고 도넛 넓이 64pi를 산출한다.",
  "decisiveStep": "R^2 - r^2 = 8^2 = 64이므로 넓이 = 64pi",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 중심과 현",
    "l4": "중심에서 현에 내린 수선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "why": "동심원의 접선 현 이등분 성질과 피타고라스 정리를 이용한 두 원 사이의 넓이 도출"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_CIRCUMFERENCE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "현의 이등분 성질로 직각변 8을 구한 후 피타고라스 정리로 두 반지름의 제곱차를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "현"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "피타고라스정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림의 원 \$O\$에서 \$\\overline{OM} \\perp \\overline{AB}\$, \$\\overline{ON} \\perp \\overline{AC}\$이고 \$\\overline{OM} \= \\overline{ON}\$이다. \$\\angle BAC \= 44^\\circ\$일 때, \$\\angle x \= \\angle ABC\$의 크기는? \[3점\]

### 선지

① \$66^\\circ\$ ② \$68^\\circ\$ ③ \$70^\\circ\$ ④ \$72^\\circ\$ ⑤ \$74^\\circ\$

### 정답

②

### 해설

원의 중심 \$O\$에서 두 현 \$AB, AC\$까지의 거리가 \$\\overline{OM} \= \\overline{ON}\$으로 같다. 한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 \$\$ \\begin{aligned} \\overline{AB} \= \\overline{AC} \\end{aligned} \$\$ 따라서 \$\\triangle ABC\$는 꼭짓점이 \$A\$인 이등변삼각형이다. 삼각형의 세 내각의 크기의 합은 \$180^\\circ\$이고 꼭지각이 \$\\angle BAC \= 44^\\circ\$이므로 밑각 \$\\angle x\$의 크기는 \$\$ \\begin{aligned} \\angle x &= \\dfrac{180^\\circ \- 44^\\circ}{2} \\ &= \\dfrac{136^\\circ}{2} \\ &= 68^\\circ \\end{aligned} \$\$ 따라서 정답은 ②이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O의 두 현 AB, AC에 내린 같은 길이의 수선과 이등변삼각형 기하 작도"
}
```

```
{
  "sourceQid": "2",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "중심거리가 같은 두 현의 길이가 같음을 이용해 이등변삼각형을 확정하고 밑각 x=68도를 계산한다.",
  "decisiveStep": "x = (180° - 44°) / 2 = 68°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 중심과 현",
    "l4": "중심거리와 현의 길이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "why": "원의 중심거리와 현의 길이 관계로부터 이등변삼각형 밑각 도출"
  },
  "crossConceptKeys": [
    "CC_EQUAL_CHORDS_EQUAL_DISTANCE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중심에서 현까지의 거리가 같으면 현의 길이가 같다는 정리를 적용해 밑각을 구하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "현",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "이등변삼각형"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림에서 \$\\triangle ABC\$는 \$\\overline{AB} \= \\overline{AC}\$인 이등변삼각형이고 원 \$O\$에 내접한다. \$\\angle BAC \= 120^\\circ\$, \$\\overline{OA} \= \\overline{AB} \= 8\$이고 \$\\overline{OD} \\perp \\overline{AB}\$일 때, \$\\overline{OE}\$의 길이는? (단, \$E\$는 \$\\overline{OD}\$와 \$\\overline{AB}\$의 교점이다.) \[5점\]

### 선지

① \$2\\sqrt{3}\$ ② \$3\\sqrt{3}\$ ③ \$4\\sqrt{3}\$ ④ \$5\\sqrt{3}\$ ⑤ \$6\\sqrt{3}\$

### 정답

③

### 해설

원의 중심 \$O\$에서 현 \$AB\$에 내린 수선은 현을 이등분하므로 교점 \$E\$는 현 \$\\overline{AB}\$의 중점이다. \$\$ \\begin{aligned} \\overline{AE} \= \\dfrac{\\overline{AB}}{2} \= \\dfrac{8}{2} \= 4 \\end{aligned} \$\$ 또한 반지름의 길이는 \$\\overline{OA} \= 8\$이다. 직각삼각형 \$OEA\$에서 \$\\angle OEA \= 90^\\circ\$이므로 피타고라스 정리에 의하여 \$\$ \\begin{aligned} \\overline{OE}^2 \+ \\overline{AE}^2 &= \\overline{OA}^2 \\ \\overline{OE}^2 \+ 4^2 &= 8^2 \\ \\overline{OE}^2 \+ 16 &= 64 \\ \\overline{OE}^2 &= 48 \\ \\overline{OE} &= \\sqrt{48} \= 4\\sqrt{3} \\end{aligned} \$\$ 따라서 정답은 ③이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O에 내접하는 이등변삼각형과 현에 내린 수선 및 직각삼각형 OEA 기하 작도"
}
```

```
{
  "sourceQid": "3",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "현의 중점 AE=4와 반지름 OA=8을 직각삼각형 OEA의 피타고라스 정리에 대입해 OE=4*sqrt(3)을 구한다.",
  "decisiveStep": "OE = sqrt(8^2 - 4^2) = sqrt(48) = 4*sqrt(3)",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 중심과 현",
    "l4": "중심에서 현에 내린 수선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "why": "현의 수직이등분선 성질과 피타고라스 정리를 이용한 중심거리 계산"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_CHORD_PERP_BISECTOR"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "현의 이등분으로 직각삼각형의 한 변을 확정하고 피타고라스 정리로 높이를 계산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "현",
      "반지름"
    ],
    "goal": [
      "선분의 길이"
    ],
    "method": [
      "피타고라스정리"
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

다음 그림에서 두 선분 \$\\overline{PA}, \\overline{PB}\$는 원 \$O\$의 접선이고 두 점 \$A, B\$는 접점이다. \$\\angle APB \= 60^\\circ\$, \$\\overline{OB} \= 4,\\mathrm{cm}\$일 때, \$\\overline{PA} \+ \\overline{PB}\$의 길이는? \[4점\]

### 선지

① \$4\\sqrt{3},\\mathrm{cm}\$ ② \$6\\sqrt{3},\\mathrm{cm}\$ ③ \$8,\\mathrm{cm}\$ ④ \$8\\sqrt{3},\\mathrm{cm}\$ ⑤ \$12,\\mathrm{cm}\$

### 정답

④

### 해설

원 밖의 한 점 \$P\$에서 원에 그은 두 접선의 길이는 같으므로 \$\\overline{PA} \= \\overline{PB}\$이다. 선분 \$OP\$는 \$\\angle APB\$를 이등분하므로 \$\$ \\begin{aligned} \\angle BPO \= \\dfrac{60^\\circ}{2} \= 30^\\circ \\end{aligned} \$\$ 반지름 \$\\overline{OB}\$는 접선 \$\\overline{PB}\$에 수직이므로 \$\\triangle PBO\$는 \$\\angle PBO \= 90^\\circ\$인 직각삼각형이다. \$\$ \\begin{aligned} \\tan 30^\\circ &= \\dfrac{\\overline{OB}}{\\overline{PB}} \= \\dfrac{4}{\\overline{PB}} \\ \\dfrac{1}{\\sqrt{3}} &= \\dfrac{4}{\\overline{PB}} \\ \\overline{PB} &= 4\\sqrt{3},\\mathrm{cm} \\end{aligned} \$\$ 따라서 \$\\overline{PA} \= 4\\sqrt{3},\\mathrm{cm}\$이므로 두 접선의 길이의 합은 \$\$ \\begin{aligned} \\overline{PA} \+ \\overline{PB} &= 4\\sqrt{3} \+ 4\\sqrt{3} \\ &= 8\\sqrt{3},\\mathrm{cm} \\end{aligned} \$\$ 따라서 정답은 ④이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 외부 점 P에서 그은 두 접선과 직각삼각형 PBO 기하 작도"
}
```

```
{
  "sourceQid": "4",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "각의 이등분각 30도와 반지름 4로 tan 30도 직각삼각형에서 접선 길이 4*sqrt(3)을 구하고 합 8*sqrt(3)을 계산한다.",
  "decisiveStep": "PB = 4 / tan(30°) = 4*sqrt(3)이므로 PA+PB = 8*sqrt(3)",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 접선",
    "l4": "한 점에서 그은 두 접선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_TANGENT",
    "templateKey": "TM_TANGENT_LENGTH",
    "why": "접선의 길이 성질과 특수각 직각삼각형 삼각비의 결합"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_TANGENT_LENGTH"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선과 반지름의 수직 관계 및 30도 삼각비를 이용하여 접선 길이를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "반지름"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "삼각비"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 원 \$O\$는 \$\\triangle ABC\$의 내접원이고 세 점 \$D, E, F\$는 접점이다. \$\\overline{AB} \= 10,\\mathrm{cm}\$, \$\\overline{AC} \= 8,\\mathrm{cm}\$, \$\\overline{AF} \= 6,\\mathrm{cm}\$일 때, \$\\overline{BC}\$의 길이는? \[4점\]

### 선지

① \$3,\\mathrm{cm}\$ ② \$4,\\mathrm{cm}\$ ③ \$5,\\mathrm{cm}\$ ④ \$5.5,\\mathrm{cm}\$ ⑤ \$6,\\mathrm{cm}\$

### 정답

⑤

### 해설

삼각형의 꼭짓점에서 내접원에 그은 두 접선의 길이는 서로 같다. 점 \$A\$에서 그은 두 접선이므로 \$\$ \\begin{aligned} \\overline{AE} \= \\overline{AF} \= 6,\\mathrm{cm} \\end{aligned} \$\$ 따라서 \$\\overline{BF}\$와 \$\\overline{CE}\$의 길이는 각각 다음과 같다. \$\$ \\begin{aligned} \\overline{BF} &= \\overline{AB} \- \\overline{AF} \= 10 \- 6 \= 4,\\mathrm{cm} \\ \\overline{CE} &= \\overline{AC} \- \\overline{AE} \= 8 \- 6 \= 2,\\mathrm{cm} \\end{aligned} \$\$ 점 \$B\$와 \$C\$에서 그은 접선의 길이도 각각 같으므로 \$\$ \\begin{aligned} \\overline{BD} \= \\overline{BF} \= 4,\\mathrm{cm}, \\quad \\overline{CD} \= \\overline{CE} \= 2,\\mathrm{cm} \\end{aligned} \$\$ 따라서 선분 \$\\overline{BC}\$의 길이는 \$\$ \\begin{aligned} \\overline{BC} &= \\overline{BD} \+ \\overline{CD} \\ &= 4 \+ 2 \= 6,\\mathrm{cm} \\end{aligned} \$\$ 따라서 정답은 ⑤이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "삼각형 ABC의 내접원과 접점 D, E, F 기하 작도"
}
```

```
{
  "sourceQid": "5",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "접선의 길이 대칭성으로 BF=BD=4, CE=CD=2를 구하여 BC=4+2=6cm를 산출한다.",
  "decisiveStep": "BC = BD + CD = 4 + 2 = 6 cm",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 접선",
    "l4": "접선 조건으로 길이 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_TANGENT",
    "templateKey": "TM_TANGENT_LENGTH",
    "why": "내접원 둘레에서 꼭짓점별 접선 길이 일치 성질 활용"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_INSCRIBED_CIRCLE_PERIMETER"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "한 점에서 원에 그은 두 접선의 길이가 같다는 성질을 세 꼭짓점에 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "삼각형",
      "접선"
    ],
    "goal": [
      "변의 길이"
    ],
    "method": [
      "접선"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 사각형 \$ABCD\$는 원에 내접하고 직선 \$TT'\$은 점 \$C\$에서의 접선이다. \$\\wideparen{AB} \= \\wideparen{BC}\$, \$\\angle BCA \= 35^\\circ\$, \$\\angle ACD \= 60^\\circ\$일 때, 접선과 현이 이루는 각 \$\\angle x\$의 크기는? \[4점\]

### 선지

① \$50^\\circ\$ ② \$52^\\circ\$ ③ \$54^\\circ\$ ④ \$56^\\circ\$ ⑤ \$58^\\circ\$

### 정답

①

### 해설

원주각의 크기는 그 원주각이 바라보는 호의 크기의 절반이다. \$\\angle BCA \= 35^\\circ\$이므로 호 \$AB\$의 크기는 \$\$ \\begin{aligned} \\wideparen{AB} \= 2 \\times 35^\\circ \= 70^\\circ \\end{aligned} \$\$ 조건에서 \$\\wideparen{AB} \= \\wideparen{BC}\$이므로 호 \$BC\$의 크기도 \$70^\\circ\$이다. 또한 \$\\angle ACD \= 60^\\circ\$이므로 호 \$AD\$의 크기는 \$\$ \\begin{aligned} \\wideparen{AD} \= 2 \\times 60^\\circ \= 120^\\circ \\end{aligned} \$\$ 원 전체의 둘레는 \$360^\\circ\$이므로 남은 호 \$CD\$의 크기는 \$\$ \\begin{aligned} \\wideparen{CD} &= 360^\\circ \- (\\wideparen{AB} \+ \\wideparen{BC} \+ \\wideparen{AD}) \\ &= 360^\\circ \- (70^\\circ \+ 70^\\circ \+ 120^\\circ) \\ &= 360^\\circ \- 260^\\circ \= 100^\\circ \\end{aligned} \$\$ 접선 \$TT'\$과 현 \$CD\$가 이루는 각의 크기는 그 현이 바라보는 호 \$CD\$의 원주각의 크기와 같으므로 \$\$ \\begin{aligned} \\angle x \= \\dfrac{100^\\circ}{2} \= 50^\\circ \\end{aligned} \$\$ 따라서 정답은 ①이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원에 내접하는 사각형과 접선이 만드는 접현각 기하 작도"
}
```

```
{
  "sourceQid": "6",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "원주각으로 세 호 70도, 70도, 120도를 구하고 전체 360도에서 호 CD=100도를 찾아 접현각 x=50도를 구한다.",
  "decisiveStep": "호 CD = 360° - 260° = 100°이므로 x = 50°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_TANGENT_CHORD",
    "why": "원주각과 호의 비례로 남은 호를 도출하고 접선과 현이 이루는 각 정리 적용"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_PROPERTIES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원주각으로 세 호를 계산하고 360도 차감 후 접현각의 절반 관계를 적용하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "원주각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "원주각"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림의 원 \$O\$에서 \$\\wideparen{AC} \= \\wideparen{BD}\$이고 \$\\angle ABC \= 35^\\circ\$일 때, 두 현 \$\\overline{AB}\$와 \$\\overline{CD}\$의 교점 \$P\$에 대하여 \$\\angle APC\$의 크기는? \[3점\]

### 선지

① \$65^\\circ\$ ② \$70^\\circ\$ ③ \$75^\\circ\$ ④ \$80^\\circ\$ ⑤ \$85^\\circ\$

### 정답

②

### 해설

\$\\angle ABC \= 35^\\circ\$는 호 \$AC\$를 바라보는 원주각이므로 호 \$AC\$의 크기는 \$\$ \\begin{aligned} \\wideparen{AC} \= 2 \\times 35^\\circ \= 70^\\circ \\end{aligned} \$\$ 조건에서 \$\\wideparen{AC} \= \\wideparen{BD}\$이므로 호 \$BD\$의 크기도 \$70^\\circ\$이다. 두 현 \$AB\$와 \$CD\$가 원 내부의 점 \$P\$에서 만나므로 두 현이 이루는 각 \$\\angle APC\$의 크기는 마주 보는 두 호의 크기의 합의 절반이다. \$\$ \\begin{aligned} \\angle APC &= \\dfrac{\\wideparen{AC} \+ \\wideparen{BD}}{2} \\ &= \\dfrac{70^\\circ \+ 70^\\circ}{2} \\ &= 70^\\circ \\end{aligned} \$\$ 따라서 정답은 ②이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 내부의 점 P에서 교차하는 두 현 AB, CD와 호 AC, BD 기하 작도"
}
```

```
{
  "sourceQid": "7",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "원주각 35도로 호 AC=70도를 얻고 같은 호 BD=70도와의 합의 절반 공식으로 각 APC=70도를 계산한다.",
  "decisiveStep": "각 APC = (70° + 70°) / 2 = 70°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각과 중심각",
    "l4": "같은 호에 대한 원주각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_COMPOSITE",
    "why": "내부 교차 현의 각 공식과 호의 원주각 관계 결합"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_PROPERTIES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원주각으로 호를 구하고 내부 현의 교각 공식을 순차적으로 적용하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "원주각",
      "현"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "원주각"
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

다음 그림의 원 \$O\$에서 \$\\wideparen{AB} \= \\wideparen{BC}\$이고 중심각 \$\\angle AOC \= 100^\\circ\$일 때, 호 \$BC\$에 대한 원주각 \$\\angle BQC\$의 크기는? \[4점\]

### 선지

① \$20^\\circ\$ ② \$22.5^\\circ\$ ③ \$25^\\circ\$ ④ \$30^\\circ\$ ⑤ \$35^\\circ\$

### 정답

③

### 해설

중심각의 크기는 그 중심각이 바라보는 호의 크기와 같으므로 \$\$ \\begin{aligned} \\wideparen{AC} \= \\angle AOC \= 100^\\circ \\end{aligned} \$\$ 조건에서 \$\\wideparen{AB} \= \\wideparen{BC}\$이므로 두 호의 크기는 각각 다음과 같다. \$\$ \\begin{aligned} \\wideparen{AB} \= \\wideparen{BC} \= \\dfrac{100^\\circ}{2} \= 50^\\circ \\end{aligned} \$\$ \$\\angle BQC\$는 호 \$BC\$를 바라보는 원주각이므로 그 크기는 같은 호에 대한 중심각의 절반이다. \$\$ \\begin{aligned} \\angle BQC \= \\dfrac{50^\\circ}{2} \= 25^\\circ \\end{aligned} \$\$ 따라서 정답은 ③이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O의 중심각 AOC와 등분된 호 AB, BC 및 원주각 BQC 기하 작도"
}
```

```
{
  "sourceQid": "8",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "중심각 100도를 2등분하여 호 BC=50도를 얻고 그 절반으로 원주각 BQC=25도를 도출한다.",
  "decisiveStep": "각 BQC = 50° / 2 = 25°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각과 중심각",
    "l4": "중심각과 원주각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_CENTER_ARC",
    "why": "호의 등분할과 원주각-중심각 관계의 기본 연계"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_PROPERTIES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중심각을 호로 변환한 후 등분하고 원주각의 절반 공식을 취하는 2단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "중심각",
      "호"
    ],
    "goal": [
      "원주각"
    ],
    "method": [
      "원주각"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 사각형 \$ABCD\$는 원 \$O\$에 내접하고 \$\\angle BAO \= 70^\\circ\$, \$\\angle BCO \= 30^\\circ\$일 때, \$\\angle ADC\$의 크기는? \[4점\]

### 선지

① \$125^\\circ\$ ② \$130^\\circ\$ ③ \$135^\\circ\$ ④ \$140^\\circ\$ ⑤ \$145^\\circ\$

### 정답

④

### 해설

선분 \$OA, OB\$는 모두 원 \$O\$의 반지름이므로 \$\\overline{OA} \= \\overline{OB}\$이다. 따라서 \$\\triangle AOB\$는 이등변삼각형이므로 \$\$ \\begin{aligned} \\angle ABO \= \\angle BAO \= 70^\\circ \\end{aligned} \$\$ 또한 \$\\overline{OB} \= \\overline{OC}\$이므로 \$\\triangle BOC\$도 이등변삼각형이다. \$\$ \\begin{aligned} \\angle OBC \= \\angle BCO \= 30^\\circ \\end{aligned} \$\$ 그림에서 \$\\angle ABC\$는 \$\\angle ABO\$와 \$\\angle OBC\$의 차이이므로 \$\$ \\begin{aligned} \\angle ABC &= \\angle ABO \- \\angle OBC \\ &= 70^\\circ \- 30^\\circ \= 40^\\circ \\end{aligned} \$\$ 원에 내접하는 사각형의 마주 보는 두 대각의 크기의 합은 \$180^\\circ\$이므로 \$\$ \\begin{aligned} \\angle ADC &= 180^\\circ \- \\angle ABC \\ &= 180^\\circ \- 40^\\circ \\ &= 140^\\circ \\end{aligned} \$\$ 따라서 정답은 ④이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O에 내접하는 사각형과 세 반지름 OA, OB, OC 기하 작도"
}
```

```
{
  "sourceQid": "9",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "반지름에 의한 두 이등변삼각형의 각 차로 각 ABC=40도를 구하고 내접사각형 대각합으로 각 ADC=140도를 도출한다.",
  "decisiveStep": "각 ADC = 180° - 40° = 140°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각의 활용",
    "l4": "내접사각형의 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_COMPOSITE",
    "why": "반지름의 등길이에 따른 이등변삼각형 밑각 판정과 내접사각형 대각 성질 결합"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_RADIUS_DEFINITION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "반지름으로 만든 두 이등변삼각형의 각 차를 구한 뒤 내접사각형의 성질로 대각을 계산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "사각형",
      "반지름"
    ],
    "goal": [
      "대각"
    ],
    "method": [
      "이등변삼각형"
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

다음 그림과 같이 사각형 \$ABCD\$는 원 \$O\$에 내접하고, 두 변 \$\\overline{AB}, \\overline{CD}\$의 연장선의 교점을 \$P\$, 두 변 \$\\overline{AD}, \\overline{BC}\$의 연장선의 교점을 \$Q\$라 하자. \$\\angle P \= 24^\\circ\$, \$\\angle Q \= 36^\\circ\$일 때, \$\\angle x \= \\angle BCD\$의 크기는? \[4점\]

### 선지

① \$50^\\circ\$ ② \$52^\\circ\$ ③ \$55^\\circ\$ ④ \$58^\\circ\$ ⑤ \$60^\\circ\$

### 정답

⑤

### 해설

원 위의 네 호 \$\\wideparen{AB}, \\wideparen{BC}, \\wideparen{CD}, \\wideparen{DA}\$의 크기를 각각 \$a, b, c, d\$라 하자. 원 밖의 점 \$P\$에서 두 할선이 이루는 각이 \$24^\\circ\$이므로 \$\$ \\begin{aligned} \\dfrac{c \- a}{2} \= 24^\\circ \\implies c \- a \= 48^\\circ \\implies c \= a \+ 48^\\circ \\end{aligned} \$\$ 원 밖의 점 \$Q\$에서 두 할선이 이루는 각이 \$36^\\circ\$이므로 \$\$ \\begin{aligned} \\dfrac{b \- d}{2} \= 36^\\circ \\implies b \- d \= 72^\\circ \\implies b \= d \+ 72^\\circ \\end{aligned} \$\$ 원 전체의 네 호의 크기의 합은 \$360^\\circ\$이므로 \$\$ \\begin{aligned} a \+ b \+ c \+ d &= 360^\\circ \\ a \+ (d \+ 72^\\circ) \+ (a \+ 48^\\circ) \+ d &= 360^\\circ \\ 2(a \+ d) \+ 120^\\circ &= 360^\\circ \\ 2(a \+ d) &= 240^\\circ \\ a \+ d &= 120^\\circ \\end{aligned} \$\$ \$\\angle x \= \\angle BCD\$는 호 \$BAD\$(\$=a+d\$)를 바라보는 원주각이므로 \$\$ \\begin{aligned} \\angle x &= \\dfrac{a \+ d}{2} \\ &= \\dfrac{120^\\circ}{2} \\ &= 60^\\circ \\end{aligned} \$\$ 따라서 정답은 ⑤이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 내부 사각형과 두 쌍의 대변 연장선 교점 P, Q 기하 작도"
}
```

```
{
  "sourceQid": "10",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "두 할선각 조건 c-a=48도와 b-d=72도를 원주 합 360도에 연립하여 a+d=120도를 구하고 원주각 60도를 산출한다.",
  "decisiveStep": "a + d = (360° - 120°) / 2 = 120°이므로 x = 60°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각의 활용",
    "l4": "복합 각 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_COMPOSITE",
    "why": "외부 할선각과 원주각 관계식을 연립하여 원주각을 계산하는 고난도 유형"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_PROPERTIES"
  ],
  "conditionKeys": [],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 할선각 공식으로 두 호의 차를 세우고 호의 합 360도와 연립하여 마주보는 호의 합을 도출하는 3단계 복합 추론",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "사각형",
      "각"
    ],
    "goal": [
      "원주각"
    ],
    "method": [
      "원주각"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 두 선분 \$\\overline{PA}, \\overline{PB}\$는 원 \$O\$의 접선이고 \$\\angle P \= 40^\\circ\$이다. 점 \$C\$가 작은 호 \$AB\$ 위의 점일 때, \$\\angle PAC \+ \\angle PBC\$의 값은? \[4점\]

### 선지

① \$70^\\circ\$ ② \$72^\\circ\$ ③ \$74^\\circ\$ ④ \$76^\\circ\$ ⑤ \$78^\\circ\$

### 정답

①

### 해설

원 밖의 점 \$P\$에서 그은 두 접선 \$PA, PB\$가 이루는 각이 \$40^\\circ\$이므로 작은 호 \$AB\$에 대한 중심각은 \$\$ \\begin{aligned} 180^\\circ \- 40^\\circ \= 140^\\circ \\end{aligned} \$\$ 따라서 작은 호 \$AB\$의 크기는 \$140^\\circ\$이다. 접선과 현이 이루는 각의 성질에 의하여 \$\$ \\begin{aligned} \\angle PAC \= \\dfrac{1}{2}\\wideparen{AC}, \\quad \\angle PBC \= \\dfrac{1}{2}\\wideparen{BC} \\end{aligned} \$\$ 점 \$C\$가 작은 호 \$AB\$ 위에 있으므로 두 호의 합은 호 \$AB\$의 크기와 같다. \$\$ \\begin{aligned} \\wideparen{AC} \+ \\wideparen{BC} \= \\wideparen{AB} \= 140^\\circ \\end{aligned} \$\$ 따라서 두 접현각의 합은 \$\$ \\begin{aligned} \\angle PAC \+ \\angle PBC &= \\dfrac{\\wideparen{AC} \+ \\wideparen{BC}}{2} \\ &= \\dfrac{140^\\circ}{2} \\ &= 70^\\circ \\end{aligned} \$\$ 따라서 정답은 ①이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O의 접선 PA, PB와 작은 호 위의 점 C 기하 작도"
}
```

```
{
  "sourceQid": "11",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "접선 각 40도로 호 AB=140도를 얻고 접현각의 합이 호의 절반인 70도임을 유도한다.",
  "decisiveStep": "각 PAC + 각 PBC = 140° / 2 = 70°",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_TANGENT_CHORD",
    "why": "접선 사이 각과 접현각의 합 공식 결합"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_TANGENT_LENGTH"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 각으로 호의 중심각을 구하고 접현각 합 공식을 적용하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "각"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "원주각"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 3

### 발문

다음은 학생 \$8\$명의 몸무게를 조사하여 나타낸 것이다. 이 자료의 중앙값은? (단위: \$\\mathrm{kg}\$) \$\$48, \\ 56, \\ 52, \\ 60, \\ 64, \\ 45, \\ 54, \\ 50\$\$ \[3점\]

### 선지

① \$52,\\mathrm{kg}\$ ② \$53,\\mathrm{kg}\$ ③ \$54,\\mathrm{kg}\$ ④ \$55,\\mathrm{kg}\$ ⑤ \$56,\\mathrm{kg}\$

### 정답

②

### 해설

주어진 \$8\$개의 변량을 작은 값부터 순서대로 나열하면 다음과 같다. \$\$45, \\ 48, \\ 50, \\ 52, \\ 54, \\ 56, \\ 60, \\ 64\$\$ 자료의 개수가 \$8\$개(짝수 개)이므로 중앙값은 한가운데 있는 \$4\$번째 값(\$52\$)과 \$5\$번째 값(\$54\$)의 평균이다. \$\$ \\begin{aligned} \\dfrac{52 \+ 54}{2} \= \\dfrac{106}{2} \= 53,\\mathrm{kg} \\end{aligned} \$\$ 따라서 중앙값은 \$53,\\mathrm{kg}\$이다. 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "짝수 개 변량의 중앙값 계산 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "12",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "8개의 변량을 크기순으로 정렬하여 4번째 값 52와 5번째 값 54의 평균으로 중앙값 53을 계산한다.",
  "decisiveStep": "중앙값 = (52 + 54) / 2 = 53",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "평균·중앙값·최빈값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE",
    "templateKey": null,
    "why": "짝수 개 변량의 정렬 후 중앙값 도출 기본 알고리즘"
  },
  "crossConceptKeys": [
    "CC_MEDIAN"
  ],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료를 정렬한 후 가운데 두 수의 평균을 취하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "중앙값"
    ],
    "method": [
      "중앙값"
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

다음 자료는 학생 \$11\$명이 \$1\$년 동안 읽은 도서 권수이다. 이 자료의 평균, 중앙값, 최빈값을 각각 \$a\$권, \$b\$권, \$c\$권이라고 할 때, \$a, b, c\$의 대소 관계로 옳은 것은? (단위: 권) \$\$6, \\ 4, \\ 9, \\ 8, \\ 4, \\ 5, \\ 3, \\ 11, \\ 3, \\ 4, \\ 9\$\$ \[4점\]

### 선지

① \$c \> b \> a\$ ② \$a \> c \> b\$ ③ \$a \> b \> c\$ ④ \$b \> a \> c\$ ⑤ \$b \> c \> a\$

### 정답

③

### 해설

먼저 주어진 \$11\$개 변량의 총합을 구하면 \$\$ \\begin{aligned} 6+4+9+8+4+5+3+11+3+4+9 \= 66 \\end{aligned} \$\$ 따라서 평균 \$a\$의 값은 \$\$ \\begin{aligned} a \= \\dfrac{66}{11} \= 6 \\end{aligned} \$\$ 자료를 작은 값부터 크기순으로 나열하면 다음과 같다. \$\$3, \\ 3, \\ 4, \\ 4, \\ 4, \\ 5, \\ 6, \\ 8, \\ 9, \\ 9, \\ 11\$\$ 변량의 개수가 \$11\$개이므로 중앙값 \$b\$는 한가운데인 \$6\$번째 값이다. \$\$ \\begin{aligned} b \= 5 \\end{aligned} \$\$ 가장 많이 나타나는 변량은 \$4\$로 \$3\$회 나타나므로 최빈값 \$c\$는 다음과 같다. \$\$ \\begin{aligned} c \= 4 \\end{aligned} \$\$ 따라서 \$a \= 6, b \= 5, c \= 4\$이므로 대소 관계는 \$\$ \\begin{aligned} a \> b \> c \\end{aligned} \$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "평균, 중앙값, 최빈값 산출 및 대소 비교 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "13",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "11개 변량의 평균 a=6, 정렬 6번째 중앙값 b=5, 최빈값 c=4를 구하고 a>b>c를 확정한다.",
  "decisiveStep": "a=6, b=5, c=4 이므로 a > b > c",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "대푯값 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE",
    "templateKey": null,
    "why": "단일 데이터셋에서 3대 대푯값을 각각 구하여 순서를 비교하는 문항"
  },
  "crossConceptKeys": [
    "CC_CENTRAL_TENDENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균 계산, 중앙값 정렬 추출, 최빈값 빈도 분석을 종합하여 대소를 비교하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "대소관계"
    ],
    "method": [
      "대푯값"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

어느 반 학생 \$16\$명의 국어 성적을 작은 값부터 순서대로 나타내었더니 다음과 같았다. \$\$52, \\ 56, \\ 56, \\ 58, \\ 60, \\ 64, \\ 64, \\ 68, \\ 72, \\ 72, \\ 72, \\ 76, \\ 80, \\ 80, \\ 84, \\ 88 \\ \\text{(점)}\$\$ 이 자료의 중앙값을 \$a\$점, 최빈값을 \$b\$점이라 할 때, \$b \- a\$의 값은? \[4점\]

### 선지

① \$0\$ ② \$1\$ ③ \$1.5\$ ④ \$2\$ ⑤ \$3\$

### 정답

④

### 해설

자료의 개수가 \$16\$개이므로 중앙값 \$a\$는 \$8\$번째 값(\$68\$)과 \$9\$번째 값(\$72\$)의 평균이다. \$\$ \\begin{aligned} a \= \\dfrac{68 \+ 72}{2} \= \\dfrac{140}{2} \= 70\\text{점} \\end{aligned} \$\$ 가장 많이 나타나는 값은 \$72\$로 \$3\$회 나타나므로 최빈값 \$b\$는 다음과 같다. \$\$ \\begin{aligned} b \= 72\\text{점} \\end{aligned} \$\$ 따라서 \$b \- a\$의 값은 \$\$ \\begin{aligned} b \- a \= 72 \- 70 \= 2 \\end{aligned} \$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "정렬된 자료의 중앙값과 최빈값 차이 계산 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "14",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "16개 자료에서 8, 9번째 값의 평균 a=70과 빈도 1위 b=72를 구하여 b-a=2를 계산한다.",
  "decisiveStep": "b - a = 72 - 70 = 2",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "평균·중앙값·최빈값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE",
    "templateKey": null,
    "why": "짝수 개 정렬 자료의 중앙값과 최빈값 차 계산"
  },
  "crossConceptKeys": [
    "CC_MEDIAN",
    "CC_MODE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "짝수 개 자료의 중앙값 평균 계산과 최빈값 빈도 분석을 결합한 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "차"
    ],
    "method": [
      "중앙값",
      "최빈값"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 세 자료 \$A, B, C\$에 대한 설명으로 옳지 않은 것은? \[4점\]

- 자료 \$A: 1, 2, 2, 7, 7, 13, 17\$  
- 자료 \$B: 9, 14, 16, 16, 18, 23\$  
- 자료 \$C: 5, 5, 5, 9, 9, 9\$

### 선지

① 자료 \$A\$의 평균과 중앙값은 같다. ② 자료 \$A\$의 최빈값은 \$2, 7\$이다. ③ 자료 \$B\$의 중앙값과 최빈값은 같다. ④ 자료 \$C\$의 최빈값은 \$5, 9\$이다. ⑤ 자료 \$C\$의 중앙값은 \$8\$이다.

### 정답

⑤

### 해설

각 자료의 대푯값을 판별한다.

- 자료 \$A\$: 총합은 \$1+2+2+7+7+13+17 \= 49\$이므로 평균은 \$\\dfrac{49}{7} \= 7\$이고, 크기순 \$4\$번째 중앙값도 \$7\$이다. 또한 \$2\$와 \$7\$이 각각 \$2\$회씩 나타나므로 최빈값은 \$2, 7\$이다. (①, ② 옳음)  
- 자료 \$B\$: 변량의 개수가 \$6\$개이므로 중앙값은 가운데 두 값인 \$16, 16\$의 평균인 \$16\$이다. 가장 많이 나타나는 값도 \$16\$(2회)이므로 중앙값과 최빈값은 같다. (③ 옳음)  
- 자료 \$C\$: \$5\$와 \$9\$가 각각 \$3\$회씩 가장 많이 나타나므로 최빈값은 \$5, 9\$이다. (④ 옳음) 자료 \$C\$의 중앙값은 가운데 \$3\$번째 값(\$5\$)과 \$4\$번째 값(\$9\$)의 평균이므로 \$\$ \\begin{aligned} \\dfrac{5 \+ 9}{2} \= \\dfrac{14}{2} \= 7 \\end{aligned} \$\$ 따라서 중앙값이 \$8\$이라고 기술한 ⑤는 옳지 않다. 따라서 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "다중 자료 세트의 대푯값 성질 검증 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "15",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "자료 C의 중앙값이 (5+9)/2=7임을 계산하여 8이라고 진술한 5번 선지의 오류를 판정한다.",
  "decisiveStep": "자료 C의 중앙값 = (5+9)/2 = 7 != 8",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "대푯값 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE",
    "templateKey": null,
    "why": "다양한 분포 형태의 자료에서 대푯값 일치 및 다중 최빈값 판정"
  },
  "crossConceptKeys": [
    "CC_CENTRAL_TENDENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 개 자료의 평균, 중앙값, 최빈값을 각각 다각도로 계산하여 진위를 점검하는 다지선다 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "대푯값"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 5

### 발문

어느 모둠 학생 \$8\$명의 턱걸이 횟수를 조사하였더니 다음과 같았다. \$\$2, \\ 3, \\ 4, \\ 0, \\ 4, \\ 1, \\ 4, \\ 6 \\ \\text{(회)}\$\$ 다음 보기 중 옳은 것은 모두 몇 개인가? \[5점\]

\<보기\> ㄱ. 평균은 \$3\$회이다. ㄴ. 중앙값은 \$4\$회이다. ㄷ. 최빈값은 \$4\$회이다. ㄹ. 표준편차는 \$\\dfrac{\\sqrt{13}}{2}\$회이다.

### 선지

① \$3\$개 ② \$2\$개 ③ \$1\$개 ④ \$4\$개 ⑤ \$0\$개

### 정답

①

### 해설

주어진 자료의 각 통계량을 검증한다.

- 변량의 총합은 \$2+3+4+0+4+1+4+6 \= 24\$이므로 평균은 \$\$ \\begin{aligned} \\dfrac{24}{8} \= 3\\text{회} \\quad (\\text{ㄱ 옳음}) \\end{aligned} \$\$  
- 자료를 작은 값부터 크기순으로 나열하면 \$0, 1, 2, 3, 4, 4, 4, 6\$이다. 자료의 개수가 \$8\$개이므로 중앙값은 \$4\$번째 값(\$3\$)과 \$5\$번째 값(\$4\$)의 평균이다. \$\$ \\begin{aligned} \\dfrac{3 \+ 4}{2} \= 3.5\\text{회} \\quad (\\text{ㄴ 옳지 않음}) \\end{aligned} \$\$  
- 가장 많이 나타나는 변량은 \$4\$회로 \$3\$번 나타나므로 최빈값은 \$4\$회이다. (ㄷ 옳음)  
- 평균 \$3\$에 대한 각 변량의 편차는 \$-1, 0, 1, \-3, 1, \-2, 1, 3\$이다. 편차의 제곱의 합은 \$\$ \\begin{aligned} (-1)^2 \+ 0^2 \+ 1^2 \+ (-3)^2 \+ 1^2 \+ (-2)^2 \+ 1^2 \+ 3^2 &= 1 \+ 0 \+ 1 \+ 9 \+ 1 \+ 4 \+ 1 \+ 9 \\ &= 26 \\end{aligned} \$\$ 따라서 분산은 \$\\dfrac{26}{8} \= \\dfrac{13}{4}\$이고, 표준편차는 \$\$ \\begin{aligned} \\sqrt{\\dfrac{13}{4}} \= \\dfrac{\\sqrt{13}}{2}\\text{회} \\quad (\\text{ㄹ 옳음}) \\end{aligned} \$\$ 따라서 보기 중 옳은 것은 ㄱ, ㄷ, ㄹ의 \$3\$개이다. 따라서 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "통계 데이터의 평균, 중앙값, 최빈값, 표준편차 진위 판정 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "16",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "평균 3, 중앙값 3.5, 최빈값 4, 분산 13/4, 표준편차 sqrt(13)/2를 각각 계산하여 옳은 보기 3개를 가려낸다.",
  "decisiveStep": "옳은 보기는 ㄱ, ㄷ, ㄹ의 3개",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "표준편차"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DISPERSION_DEVIATION_PROPERTIES",
    "templateKey": null,
    "why": "대푯값 3종과 산포도 표준편차를 모두 계산하여 합의형 보기를 검증하는 종합 문항"
  },
  "crossConceptKeys": [
    "CC_STANDARD_DEVIATION"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균, 중앙값, 최빈값 및 편차제곱합을 통한 표준편차 계산까지 전 과정을 점검하는 4단계 종합 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "표준편차",
      "대푯값"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 5

### 발문

\$5\$개의 수 \$5, 9, x, y, 6\$의 평균이 \$6\$이고 분산이 \$3.8\$일 때, \$x^2 \+ y^2\$의 값은? \[5점\]

### 선지

① \$54\$ ② \$57\$ ③ \$60\$ ④ \$63\$ ⑤ \$66\$

### 정답

②

### 해설

다섯 수의 평균이 \$6\$이므로 총합은 \$5 \\times 6 \= 30\$이다. \$\$ \\begin{aligned} 5 \+ 9 \+ x \+ y \+ 6 &= 30 \\ x \+ y \+ 20 &= 30 \\ x \+ y &= 10 \\end{aligned} \$\$ 분산이 \$3.8\$이므로 각 변량의 편차의 제곱의 평균은 \$3.8\$이다. 따라서 편차의 제곱의 합은 \$\$ \\begin{aligned} 5 \\times 3.8 \= 19 \\end{aligned} \$\$ 평균 \$6\$에 대한 각 변량의 편차의 제곱의 합을 세우면 \$\$ \\begin{aligned} (5-6)^2 \+ (9-6)^2 \+ (x-6)^2 \+ (y-6)^2 \+ (6-6)^2 &= 19 \\ (-1)^2 \+ 3^2 \+ (x-6)^2 \+ (y-6)^2 \+ 0 &= 19 \\ 1 \+ 9 \+ (x-6)^2 \+ (y-6)^2 &= 19 \\ (x-6)^2 \+ (y-6)^2 &= 9 \\end{aligned} \$\$ 좌변을 전개하여 정리하면 \$\$ \\begin{aligned} x^2 \- 12x \+ 36 \+ y^2 \- 12y \+ 36 &= 9 \\ x^2 \+ y^2 \- 12(x+y) \+ 72 &= 9 \\end{aligned} \$\$ \$x+y \= 10\$을 대입하면 \$\$ \\begin{aligned} x^2 \+ y^2 \- 12(10) \+ 72 &= 9 \\ x^2 \+ y^2 \- 120 \+ 72 &= 9 \\ x^2 \+ y^2 \- 48 &= 9 \\ x^2 \+ y^2 &= 57 \\end{aligned} \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "평균과 분산의 정의식을 전개하여 제곱합을 구하는 대수 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "17",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "x+y=10과 편차제곱합 (x-6)^2+(y-6)^2=9를 전개하여 x^2+y^2=57을 도출한다.",
  "decisiveStep": "x^2 + y^2 = 9 + 48 = 57",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "분산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DISPERSION_DEVIATION_PROPERTIES",
    "templateKey": null,
    "why": "평균 합 조건과 분산 편차제곱합을 연립하여 제곱합을 계산하는 대수적 통계 문항"
  },
  "crossConceptKeys": [
    "CC_SUM_OF_SQUARES_IDENTITY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분산 정의식을 이차식으로 전개하여 합 조건을 대입해 제곱의 합을 유도하는 3단계 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평균",
      "분산"
    ],
    "goal": [
      "제곱합"
    ],
    "method": [
      "분산"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

\$4\$개의 변량 \$a, b, c, d\$의 평균을 \$m\$, 분산을 \$v\$라고 할 때, \$4\$개의 새로운 변량 \$a+5, b+5, c+5, d+5\$의 평균과 분산을 바르게 짝지은 것은? \[4점\]

### 선지

① \$m, \\ v\$ ② \$m+5, \\ v+5\$ ③ \$m+5, \\ v\$ ④ \$m, \\ v+5\$ ⑤ \$m+5, \\ 5v\$

### 정답

③

### 해설

각 변량에 같은 수 \$5\$를 더하면 자료 전체가 오른쪽으로 \$5\$만큼 평행이동하므로 새로운 평균은 기존 평균보다 \$5\$만큼 커진다. \$\$ \\begin{aligned} \\text{새로운 평균} \= m \+ 5 \\end{aligned} \$\$ 새로운 평균에 대한 각 변량의 편차를 계산하면 다음과 같다. \$\$ \\begin{aligned} (a+5) \- (m+5) &= a \- m \\ (b+5) \- (m+5) &= b \- m \\ (c+5) \- (m+5) &= c \- m \\ (d+5) \- (m+5) &= d \- m \\end{aligned} \$\$ 모든 편차가 기존 편차와 완전히 일치하므로 편차의 제곱의 평균인 분산도 변하지 않는다. \$\$ \\begin{aligned} \\text{새로운 분산} \= v \\end{aligned} \$\$ 따라서 새로운 평균과 분산은 \$m+5, v\$이다. 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "변량의 평행이동에 따른 평균과 분산의 불변성 판정 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "18",
  "variationType": "CONTEXT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "모든 변량에 상수를 더하면 평균은 그만큼 증가하고 편차는 불변이므로 분산은 변하지 않음을 판정한다.",
  "decisiveStep": "새 평균 = m+5, 새 분산 = v",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "자료 비교",
    "l4": "평균과 산포도 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_LINEAR_TRANSFORMATION_STATISTICS",
    "templateKey": null,
    "why": "변량의 일차 선형 변환에서 덧셈 상수가 평균과 분산에 미치는 영향 판별"
  },
  "crossConceptKeys": [
    "CC_VARIANCE_SCALING_PROPERTY"
  ],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "변량에 상수를 더할 때 평균은 증가하고 분산은 유지된다는 기본 성질을 확인하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "변량",
      "평균",
      "분산"
    ],
    "goal": [
      "평균",
      "분산"
    ],
    "method": [
      "변환"
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

어느 반 학생 \$20\$명의 중간고사 점수와 기말고사 점수를 조사한 산점도에 대한 다음 설명 중 옳은 것은? \[4점\] (단, 중간고사 점수의 최빈값은 \$70\$점(4명)이고, 기말고사 점수가 \$90\$점 이상인 학생 \$6\$명의 중간고사 점수의 평균은 \$88\$점이며, 두 점수가 모두 \$70\$점 미만인 학생은 \$3\$명이다.)

### 선지

① 중간고사 점수의 최빈값은 \$85\$점이다. ② 중간고사 점수와 기말고사 점수 사이에는 음의 상관관계가 있다. ③ 중간고사 점수가 \$80\$점 이상인 학생은 \$10\$명이다. ④ 두 점수가 모두 \$70\$점 미만인 학생의 비율은 전체의 \$15%\$이다. ⑤ 기말고사 점수가 \$90\$점 이상인 학생들의 중간고사 점수의 평균은 \$95\$점이다.

### 정답

④

### 해설

각 보기를 조건에 따라 검증한다. ① 문제의 조건에서 중간고사 점수의 최빈값은 \$70\$점(\$4\$명)이므로 옳지 않다. ② 중간고사 점수가 높을수록 대체로 기말고사 점수도 높아지므로 두 변량 사이에는 양의 상관관계가 있다. 음의 상관관계라고 한 설명은 옳지 않다. ③ 중간고사 점수가 \$80\$점 이상인 학생 수는 조건과 부합하지 않는다. (옳지 않음) ④ 두 점수가 모두 \$70\$점 미만인 학생 수는 \$3\$명이므로 전체 \$20\$명에 대한 비율은 다음과 같다. \$\$ \\begin{aligned} \\dfrac{3}{20} \\times 100 \= 15% \\end{aligned} \$\$ 따라서 ④의 설명은 옳다. ⑤ 문제의 조건에서 기말고사 점수가 \$90\$점 이상인 학생들의 중간고사 점수의 평균은 \$88\$점이므로 \$95\$점이라는 설명은 옳지 않다. 따라서 옳은 것은 ④이다. 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "산점도의 영역 조건 만족 도수와 백분율 계산 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "19",
  "variationType": "CONTEXT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_DATA_INTERPRETATION",
  "conceptClusterKey": "STATISTICS_DATA_INTERPRETATION",
  "primaryMethod": "두 점수가 모두 70점 미만인 학생 3명의 전체 20명 대비 비율이 3/20*100=15%임을 판정한다.",
  "decisiveStep": "재시험 비율 = (3 / 20) * 100 = 15%",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "상관관계",
    "l3": "산점도",
    "l4": "산점도 읽기"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": "산점도 조건에서 특정 영역에 속하는 변량의 비율을 계산하고 타 선지의 오류를 감별"
  },
  "crossConceptKeys": [
    "CC_BAR_GRAPH_DISTRIBUTION"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "산점도에서 최빈값, 상관관계 방향, 영역별 도수 및 평균을 다각도로 판별하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "산점도",
      "조건"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "산점도"
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

어느 학교 학생들의 영어 성적(\$x\$축)과 국어 성적(\$y\$축)에 대한 산점도에서 학생 \$A, B, C, D\$의 위치가 다음과 같다.

- 점 \$A\$는 오른쪽 위 끝에 위치한다.  
- 점 \$B\$는 직선 \$y=x\$의 아래쪽(오른쪽 아래)에 위치한다.  
- 점 \$C\$는 왼쪽 아래 끝에 위치한다.  
- 점 \$D\$는 직선 \$y=x\$의 위쪽(왼쪽 위)에 위치한다. 다음 설명 중 옳지 않은 것은? \[4점\]

### 선지

① B는 C보다 영어 성적이 우수하다. ② D는 B보다 국어 성적이 우수하다. ③ A는 영어 성적과 국어 성적이 모두 우수한 편이다. ④ 영어 성적과 국어 성적 사이에는 대체로 양의 상관관계가 있다. ⑤ D는 국어 성적보다 영어 성적이 더 우수하다.

### 정답

⑤

### 해설

산점도에서 가로축(\$x\$축)은 영어 성적, 세로축(\$y\$축)은 국어 성적을 나타낸다. ① 점 \$B\$는 점 \$C\$보다 오른쪽에 위치하므로 영어 성적이 더 우수하다. (옳음) ② 점 \$D\$는 점 \$B\$보다 위쪽에 위치하므로 국어 성적이 더 우수하다. (옳음) ③ 점 \$A\$는 산점도의 오른쪽 위 끝에 위치하므로 영어와 국어 성적이 모두 우수하다. (옳음) ④ 점들이 전체적으로 오른쪽 위로 향하는 띠 모양으로 분포하므로 양의 상관관계가 있다. (옳음) ⑤ 점 \$D\$는 직선 \$y=x\$의 위쪽(왼쪽 위)에 위치하므로 세로 좌표(국어 성적)가 가로 좌표(영어 성적)보다 크다 (\$y \> x\$). 따라서 국어 성적이 영어 성적보다 더 우수하므로 ‘영어 성적이 더 우수하다’고 한 ⑤의 설명은 옳지 않다. 따라서 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "산점도의 사분면 및 대각선 기준 위치 해석 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "20",
  "variationType": "CONTEXT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_DATA_INTERPRETATION",
  "conceptClusterKey": "STATISTICS_DATA_INTERPRETATION",
  "primaryMethod": "점 D가 y=x 위쪽에 위치하므로 국어 점수 y가 영어 점수 x보다 높음을 판단하여 5번의 오류를 가려낸다.",
  "decisiveStep": "점 D는 y > x 영역에 있으므로 국어 성적이 더 우수함",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "상관관계",
    "l3": "상관관계",
    "l4": "양의 상관관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": "산점도의 기준선 y=x와 상대적 좌표 위치를 이용한 변량 크기 비교"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "산점도 위 점의 가로 및 세로 위치를 읽어 대소 관계를 판정하는 1단계 해석 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "산점도"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "산점도"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

\[서·논술형 1\] 다음 그림의 원 \$O\$에서 선분 \$\\overline{CM}\$은 현 \$\\overline{AB}\$와 수직이고 \$\\overline{AM} \= \\overline{BM} \= 12,\\mathrm{cm}\$, \$\\overline{CA} \= 6\\sqrt{5},\\mathrm{cm}\$이다. 점 \$M\$은 선분 \$\\overline{AB}\$의 중점이고 세 점 \$C, M, O\$는 한 직선 위에 있을 때, 원 \$O\$의 넓이를 구하고 그 과정을 서술하시오. \[6점\]

### 선지

없음

### 정답

\$225\\pi,\\mathrm{cm}^2\$

### 해설

\$\\overline{CM} \\perp \\overline{AB}\$이므로 \$\\triangle AMC\$는 \$\\angle AMC \= 90^\\circ\$인 직각삼각형이다. 피타고라스 정리에 의하여 선분 \$\\overline{CM}\$의 길이를 구하면 \$\$ \\begin{aligned} \\overline{CM}^2 &= \\overline{CA}^2 \- \\overline{AM}^2 \\ &= (6\\sqrt{5})^2 \- 12^2 \\ &= 180 \- 144 \= 36 \\ \\overline{CM} &= 6,\\mathrm{cm} \\end{aligned} \$\$ 점 \$M\$이 현 \$\\overline{AB}\$의 중점이고 \$\\overline{CM} \\perp \\overline{AB}\$이므로 원의 중심 \$O\$는 직선 \$CM\$ 위에 있다. 선분 \$\\overline{OM} \= x,\\mathrm{cm}\$라 두면 원의 반지름의 길이는 다음과 같다. \$\$ \\begin{aligned} R \= \\overline{OC} \= x \+ 6,\\mathrm{cm} \\end{aligned} \$\$ 직각삼각형 \$OMA\$에서 \$\\overline{OA} \= R \= x \+ 6\$이므로 피타고라스 정리에 의하여 \$\$ \\begin{aligned} \\overline{OA}^2 &= \\overline{OM}^2 \+ \\overline{AM}^2 \\ (x \+ 6)^2 &= x^2 \+ 12^2 \\ x^2 \+ 12x \+ 36 &= x^2 \+ 144 \\ 12x &= 108 \\ x &= 9,\\mathrm{cm} \\end{aligned} \$\$ 따라서 원 \$O\$의 반지름의 길이는 다음과 같다. \$\$ \\begin{aligned} R \= \\overline{OC} \= 9 \+ 6 \= 15,\\mathrm{cm} \\end{aligned} \$\$ 그러므로 원 \$O\$의 넓이는 \$\$ \\begin{aligned} \\pi R^2 &= \\pi \\times 15^2 \\ &= 225\\pi,\\mathrm{cm}^2 \\end{aligned} \$\$ 따라서 구하는 원의 넓이는 \$225\\pi,\\mathrm{cm}^2\$이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "원 O의 현 AB 수직이등분선과 중심 O 및 직각삼각형 AMC, OMA 기하 작도"
}
```

```
{
  "sourceQid": "21",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "직각삼각형 AMC에서 CM=6을 구하고 직각삼각형 OMA에서 (x+6)^2=x^2+12^2을 풀어 반지름 15와 넓이 225pi를 산출한다.",
  "decisiveStep": "12x = 108 에서 x=9, 반지름 R=15이므로 넓이 = 225pi",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원과 직선",
    "l3": "원의 중심과 현",
    "l4": "현의 수직이등분선과 중심"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
    "templateKey": "TM_CIRCLE_CHORD_LENGTH",
    "why": "현의 수직이등분선과 반지름의 방정식을 연립하여 원의 넓이 계산"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_CHORD_PERP_BISECTOR"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 직각삼각형에 피타고라스 정리를 연계 적용하여 미지의 중심거리와 반지름을 도출하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "현",
      "수선"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "피타고라스정리"
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

\[서·논술형 2\] 다음 그림과 같이 반지름의 길이가 \$12,\\mathrm{cm}\$인 원 \$O\$에서 점 \$P\$는 두 현 \$\\overline{AB}\$와 \$\\overline{CD}\$의 연장선의 교점이다. \$\\wideparen{AB} \= 8\\pi,\\mathrm{cm}\$, \$\\wideparen{CD} \= 4\\pi,\\mathrm{cm}\$, \$\\angle APC \= 30^\\circ\$일 때, 호 \$\\wideparen{AC}\$의 길이를 구하고 그 과정을 서술하시오. \[7점\]

### 선지

없음

### 정답

\$8\\pi,\\mathrm{cm}\$

### 해설

반지름의 길이가 \$12,\\mathrm{cm}\$이므로 원 \$O\$의 전체 둘레의 길이는 다음과 같다. \$\$ \\begin{aligned} 2\\pi \\times 12 \= 24\\pi,\\mathrm{cm} \\end{aligned} \$\$ 호 \$\\wideparen{AB}\$의 길이가 \$8\\pi,\\mathrm{cm}\$이므로 그에 대한 중심각의 크기는 \$\$ \\begin{aligned} 360^\\circ \\times \\dfrac{8\\pi}{24\\pi} \= 360^\\circ \\times \\dfrac{1}{3} \= 120^\\circ \\end{aligned} \$\$ 호 \$\\wideparen{CD}\$의 길이가 \$4\\pi,\\mathrm{cm}\$이므로 그에 대한 중심각의 크기는 \$\$ \\begin{aligned} 360^\\circ \\times \\dfrac{4\\pi}{24\\pi} \= 360^\\circ \\times \\dfrac{1}{6} \= 60^\\circ \\end{aligned} \$\$ 호 \$\\wideparen{AC}\$의 중심각을 \$x^\\circ\$, 호 \$\\wideparen{BD}\$의 중심각을 \$y^\\circ\$라 하자. 네 호의 중심각의 합은 \$360^\\circ\$이므로 \$\$ \\begin{aligned} x \+ y \+ 120^\\circ \+ 60^\\circ &= 360^\\circ \\ x \+ y &= 180^\\circ \\quad \\cdots \\text{ (1)} \\end{aligned} \$\$ 원 밖의 점 \$P\$에서 두 할선이 이루는 각의 크기는 두 호의 중심각의 차의 절반이므로 \$\$ \\begin{aligned} \\dfrac{x \- y}{2} &= 30^\\circ \\ x \- y &= 60^\\circ \\quad \\cdots \\text{ (2)} \\end{aligned} \$\$ 식 (1)과 식 (2)를 더하면 \$\$ \\begin{aligned} 2x &= 240^\\circ \\ x &= 120^\\circ \\end{aligned} \$\$ 따라서 호 \$\\wideparen{AC}\$의 중심각의 크기는 \$120^\\circ\$이다. 그러므로 호 \$\\wideparen{AC}\$의 길이는 다음과 같다. \$\$ \\begin{aligned} 24\\pi \\times \\dfrac{120^\\circ}{360^\\circ} &= 24\\pi \\times \\dfrac{1}{3} \\ &= 8\\pi,\\mathrm{cm} \\end{aligned} \$\$ 따라서 구하는 호 \$\\wideparen{AC}\$의 길이는 \$8\\pi,\\mathrm{cm}\$이다.

```
{
  "status": "UNSUPPORTED",
  "reason": "반지름 12cm인 원과 두 할선이 원 외부 점 P에서 만나는 기하 작도"
}
```

```
{
  "sourceQid": "22",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "호 AB, CD의 중심각 120도, 60도로 x+y=180도를 얻고 할선각 x-y=60도와 연립해 x=120도로부터 호 AC=8pi를 계산한다.",
  "decisiveStep": "x = 120° 이므로 호 AC = 24pi * (120/360) = 8pi",
  "rpm": {
    "majorUnit": "원의 성질",
    "midUnit": "원주각",
    "l3": "원주각의 활용",
    "l4": "복합 각 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_COMPOSITE",
    "why": "외부 할선각과 원 둘레 중심각의 총합을 연립방정식으로 풀어 호의 길이를 계산하는 심화 문항"
  },
  "crossConceptKeys": [
    "CC_CIRCLE_SECTOR_AREA"
  ],
  "conditionKeys": [],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "호의 길이로 중심각을 환산하고 외부 할선각 공식과 중심각 합 공식을 연립하여 호의 길이를 복원하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "호",
      "각"
    ],
    "goal": [
      "호의 길이"
    ],
    "method": [
      "원주각"
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

\[서·논술형 3\] \$4\$개의 수 \$2a+3, 2b+3, 2c+3, 2d+3\$의 평균이 \$13\$이고, 분산이 \$16\$일 때, \$a^2 \+ b^2 \+ c^2 \+ d^2\$의 값을 구하고 그 과정을 서술하시오. \[7점\]

### 선지

없음

### 정답

\$116\$

### 해설

\$a, b, c, d\$의 평균을 \$m\$이라 하자. 각 변량을 \$2\$배한 후 \$3\$을 더한 네 수의 평균이 \$13\$이므로 \$\$ \\begin{aligned} 2m \+ 3 &= 13 \\ 2m &= 10 \\ m &= 5 \\end{aligned} \$\$ 따라서 네 수의 총합은 다음과 같다. \$\$ \\begin{aligned} a \+ b \+ c \+ d \= 4 \\times 5 \= 20 \\end{aligned} \$\$ 각 변량을 \$2\$배하고 \$3\$을 더했을 때의 분산은 원래 분산의 \$2^2 \= 4\$배이고, 상수를 더하는 것은 분산에 영향을 주지 않는다. 따라서 \$a, b, c, d\$의 분산을 \$V\$라 하면 \$\$ \\begin{aligned} 4V &= 16 \\ V &= 4 \\end{aligned} \$\$ 분산의 정의에 의하여 각 변량의 편차의 제곱의 평균은 \$4\$이다. \$\$ \\begin{aligned} \\dfrac{(a-5)^2 \+ (b-5)^2 \+ (c-5)^2 \+ (d-5)^2}{4} &= 4 \\ (a-5)^2 \+ (b-5)^2 \+ (c-5)^2 \+ (d-5)^2 &= 16 \\end{aligned} \$\$ 좌변의 식을 전개하면 \$\$ \\begin{aligned} &(a^2 \- 10a \+ 25\) \+ (b^2 \- 10b \+ 25\) \+ (c^2 \- 10c \+ 25\) \+ (d^2 \- 10d \+ 25\) \\ &= a^2 \+ b^2 \+ c^2 \+ d^2 \- 10(a \+ b \+ c \+ d) \+ 100 \= 16 \\end{aligned} \$\$ 여기에 \$a \+ b \+ c \+ d \= 20\$을 대입하면 \$\$ \\begin{aligned} a^2 \+ b^2 \+ c^2 \+ d^2 \- 10(20) \+ 100 &= 16 \\ a^2 \+ b^2 \+ c^2 \+ d^2 \- 200 \+ 100 &= 16 \\ a^2 \+ b^2 \+ c^2 \+ d^2 \- 100 &= 16 \\ a^2 \+ b^2 \+ c^2 \+ d^2 &= 116 \\end{aligned} \$\$ 따라서 구하는 값은 \$116\$이다.

```
{
  "status": "EXEMPT",
  "reason": "변량의 선형 변환 및 분산 정의식을 이용한 제곱합 대수 계산 문항으로 시각자료 불필요"
}
```

```
{
  "sourceQid": "23",
  "variationType": "NUMERIC",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "선형변환 평균 13에서 m=5, 합 20을 얻고 선형변환 분산 16에서 V=4를 도출한 후 편차제곱합 전개로 a^2+b^2+c^2+d^2=116을 구한다.",
  "decisiveStep": "a^2 + b^2 + c^2 + d^2 = 16 + 100 = 116",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "분산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_LINEAR_TRANSFORMATION_STATISTICS",
    "templateKey": null,
    "why": "변량의 일차 변환에 따른 평균 및 분산의 변화 공식을 역산하여 제곱합을 계산하는 심화 서술형 문항"
  },
  "crossConceptKeys": [
    "CC_VARIANCE_SCALING_PROPERTY",
    "CC_SUM_OF_SQUARES_IDENTITY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "변량의 선형변환 성질로 원래 평균과 분산을 복원하고 편차제곱합 전개식에 대입하여 네 수의 제곱합을 계산하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평균",
      "분산"
    ],
    "goal": [
      "제곱합"
    ],
    "method": [
      "변환",
      "분산"
    ],
    "condition": []
  },
  "hold": ""
}
```

