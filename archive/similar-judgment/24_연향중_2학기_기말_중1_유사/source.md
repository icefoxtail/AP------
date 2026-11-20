```json:exam
{
  "stem": "24_연향중_2학기_기말_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2final/24_연향중_2학기_기말_중1_기출.js",
  "examFolder": "2final",
  "grade": "중1",
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
다각형의 성질에 대한 설명으로 옳지 않은 것은? [4점]


### 선지
① 모든 변의 길이가 같은 다각형은 항상 정다각형이다. ② $n$각형의 외각의 크기의 합은 항상 $360^\circ$이다. ③ 삼각형의 세 내각의 크기의 합은 $180^\circ$이다. ④ 삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다. ⑤ 다각형의 한 꼭짓점에서 내각과 외각의 크기의 합은 $180^\circ$이다.


### 정답
①


### 해설
다각형의 기본 성질을 하나씩 확인하자.


한 꼭짓점에서 내각과 외각의 크기의 합은
$$\begin{aligned}
\text{내각} + \text{외각} &= 180^\circ
\end{aligned}$$
이므로 항상 $180^\circ$이다.
또한 모든 다각형의 외각의 크기의 합은 변의 개수와 관계없이 항상 $360^\circ$이다.
삼각형의 세 내각의 크기의 합은 $180^\circ$이고, 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다.


한편, 정다각형은 모든 변의 길이가 같고 모든 내각의 크기도 같아야 한다.
모든 변의 길이가 같더라도 마름모처럼 내각의 크기가 서로 다를 수 있으므로 항상 정다각형인 것은 아니다.


따라서 옳지 않은 것은 ①이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "다각형의 기본 정의 및 외각·내각 성질에 대한 진위 판정 문항"
}
```


```json:meta
{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "정다각형의 정의는 변의 길이와 내각의 크기가 모두 같아야 함을 상기하여 변의 길이만 같은 마름모의 반례로 옳지 않은 진술을 판별한다.",
  "decisiveStep": "정다각형 정의에서 내각의 크기 일치 조건 누락 확인",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형",
    "l4": "다각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_PROPERTY_JUDGMENT",
    "templateKey": "TPL_M1_POLYGON_PROPERTY_JUDGMENT_DEFINITION_AUDIT",
    "why": "다각형과 정다각형의 정의 및 내각·외각 성질을 검토하는 기본 진위형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다각형의 정의 조건을 정밀하게 판별하는 1단계 개념 검증 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다각형",
      "정다각형",
      "삼각형"
    ],
    "goal": [
      "성질"
    ],
    "method": [
      "내각",
      "외각"
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
정팔각형의 한 내각의 크기는? [3점]


### 선지
① $108^\circ$ ② $120^\circ$ ③ $128^\circ$ ④ $130^\circ$ ⑤ $135^\circ$


### 정답
⑤


### 해설
정팔각형의 내각의 크기의 총합은
$$\begin{aligned}
(8-2) \times 180^\circ &= 6 \times 180^\circ \\
&= 1080^\circ
\end{aligned}$$
정팔각형은 $8$개의 내각의 크기가 모두 같으므로 한 내각의 크기는
$$\begin{aligned}
\dfrac{1080^\circ}{8} &= 135^\circ
\end{aligned}$$
따라서 정답은 ⑤이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "정다각형 한 내각의 크기 계산 기본 수식 문항"
}
```


```json:meta
{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "정팔각형의 내각의 크기의 총합 1080도를 꼭짓점 수 8로 나누어 한 내각의 크기 135도를 구한다.",
  "decisiveStep": "내각합 공식 (8-2)×180도 산출 및 8등분",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "정다각형의 한 내각의 크기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REGULAR_POLYGON_ANGLE",
    "templateKey": "TPL_M1_REGULAR_POLYGON_ANGLE_INTERIOR_FORMULA",
    "why": "정다각형 내각 총합을 꼭짓점 수로 나누어 한 내각을 구하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다각형의 내각합 공식을 적용하는 1단계 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "정다각형"
    ],
    "goal": [
      "내각"
    ],
    "method": [
      "내각"
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
다음 그림과 같은 오각형에서 네 외각의 크기가 각각 $65^\circ, 75^\circ, 80^\circ, 60^\circ$일 때, 나머지 한 외각 $\angle x$의 크기는? [3점]


### 선지
① $75^\circ$ ② $80^\circ$ ③ $85^\circ$ ④ $90^\circ$ ⑤ $95^\circ$


### 정답
②


### 해설
모든 다각형의 외각의 크기의 합은 항상 $360^\circ$이다.
주어진 네 외각의 크기의 합을 구하면
$$\begin{aligned}
65^\circ + 75^\circ + 80^\circ + 60^\circ &= 280^\circ
\end{aligned}$$
따라서 나머지 한 외각 $\angle x$의 크기는
$$\begin{aligned}
\angle x &= 360^\circ - 280^\circ \\
&= 80^\circ
\end{aligned}$$
따라서 정답은 ②이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "다섯 개의 외각이 표시된 오각형 다이어그램"
}
```


```json:meta
{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "오각형의 모든 외각의 합이 360도임을 이용하여 알려진 네 외각의 합 280도를 빼서 x=80도를 구한다.",
  "decisiveStep": "외각의 총합 360도에서 280도를 감산",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "다각형의 외각의 크기의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_EXTERIOR_SUM",
    "templateKey": "TPL_M1_POLYGON_EXTERIOR_SUM_UNKNOWN_EXTERIOR",
    "why": "외각의 총합 360도에서 나머지 외각들의 합을 제하여 미지 외각을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외각의 합 불변 성질을 이용하여 미지의 각을 구하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다각형",
      "외각"
    ],
    "goal": [
      "외각"
    ],
    "method": [
      "외각"
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
원형 탁자에 $10$명의 학생이 둘러앉아 있다. 각 학생은 자신과 양옆의 두 학생을 제외한 모든 학생과 서로 한 번씩 악수를 하려고 한다. 악수를 모두 몇 번 하게 되는지 구하면? [4점]


### 선지
① $20$번 ② $25$번 ③ $30$번 ④ $35$번 ⑤ $40$번


### 정답
④


### 해설
한 학생이 악수할 수 있는 학생의 수는 자기 자신과 양옆의 두 학생을 제외하므로
$$\begin{aligned}
10 - 3 &= 7\text{명}
\end{aligned}$$
이다.
$10$명의 학생이 각각 $7$명과 악수한다고 세면
$$\begin{aligned}
10 \times 7 &= 70\text{번}
\end{aligned}$$
이지만, 한 번의 악수를 두 학생이 서로 한 번씩 세었으므로 $2$로 나눈다.
$$\begin{aligned}
\dfrac{10 \times 7}{2} &= 35\text{번}
\end{aligned}$$
이는 십각형의 대각선의 개수를 구하는 공식 $\dfrac{n(n-3)}{2}$에 $n=10$을 대입한 것과 같다.


따라서 정답은 ④이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "다각형의 대각선의 개수 공식을 실생활 악수 상황에 적용한 문항"
}
```


```json:meta
{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "십각형의 대각선의 개수 공식을 활용하여 10×(10-3)/2 = 35를 도출한다.",
  "decisiveStep": "악수 횟수를 십각형의 대각선 수로 모델링하여 중복을 2로 나눔",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 대각선",
    "l4": "대각선의 개수의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DIAGONAL_COUNT_APPLICATION",
    "templateKey": "TPL_M1_DIAGONAL_COUNT_APPLICATION_HANDSHAKE",
    "why": "양옆을 제외한 악수 모델을 n각형 대각선 공식으로 해결하는 전형적 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대각선 개수 공식을 실생활 상황으로 치환하여 계산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다각형"
    ],
    "goal": [
      "대각선"
    ],
    "method": [
      "대각선"
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
원과 부채꼴의 성질에 대한 설명으로 옳지 않은 것은? [4점]


### 선지
① 한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. ② 한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다. ③ 한 원에서 현의 길이는 중심각의 크기에 정비례한다. ④ 중심각의 크기가 $180^\circ$인 부채꼴은 활꼴이기도 하다. ⑤ 한 원에서 중심각의 크기가 같은 두 부채꼴의 넓이는 서로 같다.


### 정답
③


### 해설
원과 부채꼴의 성질을 하나씩 확인하자.


①, ②, ⑤ 한 원 또는 합동인 두 원에서 중심각의 크기가 같은 두 부채꼴의 호의 길이와 넓이는 각각 같고, 호의 길이와 부채꼴의 넓이는 중심각의 크기에 각각 정비례한다.
④ 중심각의 크기가 $180^\circ$인 반원은 부채꼴이면서 지름을 현으로 갖는 활꼴이기도 하다.


그러나 현의 길이는 중심각의 크기가 같으면 서로 같지만, 중심각의 크기가 $2$배, $3$배가 된다고 해서 현의 길이도 $2$배, $3$배가 되는 것은 아니므로 중심각의 크기에 정비례하지 않는다.


따라서 옳지 않은 것은 ③이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "원과 부채꼴, 현의 성질에 관한 개념 진위 판정 문항"
}
```


```json:meta
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "현의 길이는 중심각의 크기에 비례하지 않음을 개념적으로 판별한다.",
  "decisiveStep": "현의 길이의 중심각 비례 여부 확인",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "원과 부채꼴의 성질",
    "l4": "호와 현의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CIRCLE_SECTOR_PROPERTIES",
    "templateKey": "TPL_M1_CIRCLE_SECTOR_PROPERTIES_PROPORTIONALITY_AUDIT",
    "why": "호와 현, 부채꼴의 중심각 정비례 여부를 감별하는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "호와 현의 중심각 비례 차이를 명확히 구분하는 1단계 개념 검증 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "부채꼴",
      "호",
      "현",
      "활꼴"
    ],
    "goal": [
      "성질"
    ],
    "method": [
      "중심각"
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
한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다. 중심각의 크기가 $40^\circ$인 부채꼴의 넓이가 $8\rm\,cm^2$일 때, 넓이가 $24\rm\,cm^2$인 부채꼴의 중심각의 크기 $x^\circ$의 $x$의 값을 구하면? [3점]


### 선지
① $120$ ② $130$ ③ $140$ ④ $150$ ⑤ $160$


### 정답
①


### 해설
한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례하므로 비례식을 세우면 다음과 같다.
$$\begin{aligned}
8 : 24 &= 40 : x \\
1 : 3 &= 40 : x \\
x &= 3 \times 40 \\
&= 120
\end{aligned}$$
따라서 정답은 ①이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "부채꼴의 넓이와 중심각 크기의 정비례 관계를 이용한 일차방정식 비례식 문항"
}
```


```json:meta
{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "부채꼴의 넓이 비 8:24 = 1:3을 중심각 비 40:x에 적용하여 x=120을 계산한다.",
  "decisiveStep": "부채꼴 넓이와 중심각 정비례 비례식 수립",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "부채꼴의 호의 길이와 넓이",
    "l4": "중심각의 크기와 넓이의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SECTOR_AREA_ANGLE_PROPORTION",
    "templateKey": "TPL_M1_SECTOR_AREA_ANGLE_PROPORTION_RATIO_SOLVE",
    "why": "부채꼴 넓이와 중심각의 정비례식을 세워 미지 중심각을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부채꼴 넓이와 중심각의 정비례 관계를 단순 계산하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "부채꼴",
      "중심각"
    ],
    "goal": [
      "중심각"
    ],
    "method": [
      "정비례"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q07


- 형식: 객관식
- 배점: 5


### 발문
다음 그림과 같이 선분 $AB$를 지름으로 하는 반원을 점 $A$를 중심으로 하여 $45^\circ$만큼 회전이동시켰다. $\overline{AB} = 16\rm\,cm$일 때, 어두운 부분의 둘레의 길이는? [5점]


### 선지
① $10\pi + 8\rm\,cm$ ② $10\pi + 16\rm\,cm$ ③ $12\pi + 8\rm\,cm$ ④ $14\pi + 16\rm\,cm$ ⑤ $12\pi + 16\rm\,cm$


### 정답
⑤


### 해설
어두운 부분의 둘레는 회전된 반원의 호, 점 $A$를 중심으로 회전하며 생긴 바깥쪽 부채꼴의 호, 그리고 직선 선분 $\overline{AB}$로 이루어진다.


지름이 $16\rm\,cm$인 반원의 반지름은 $8\rm\,cm$이므로 반원의 호의 길이는
$$\begin{aligned}
\pi \times 8 &= 8\pi\rm\,cm
\end{aligned}$$
반지름이 $16\rm\,cm$이고 중심각의 크기가 $45^\circ$인 부채꼴의 호의 길이는
$$\begin{aligned}
2\pi \times 16 \times \dfrac{45}{360} &= 32\pi \times \dfrac{1}{8} \\
&= 4\pi\rm\,cm
\end{aligned}$$
직선 경계 선분 $\overline{AB}$의 길이는
$$\begin{aligned}
16\rm\,cm
\end{aligned}$$
따라서 어두운 부분의 둘레의 길이는
$$\begin{aligned}
8\pi + 4\pi + 16 &= 12\pi + 16\rm\,cm
\end{aligned}$$
따라서 정답은 ⑤이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "지름 16cm인 반원을 한 끝점을 중심으로 45도 회전시킨 도형 다이어그램"
}
```


```json:meta
{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "반원호 8pi, 부채꼴 호 4pi, 직선 경계 16을 각각 구하여 합산함으로써 둘레 12pi+16을 구한다.",
  "decisiveStep": "반원 호와 회전 부채꼴 호, 직선 성분을 구분하여 합산",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "부채꼴의 호의 길이와 넓이",
    "l4": "색칠한 부분의 둘레"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_ROTATED_FIGURE_PERIMETER",
    "templateKey": "TPL_M1_ROTATED_FIGURE_PERIMETER_SEMICIRCLE_ARC_SUM",
    "why": "회전이동한 반원과 부채꼴의 둘레 경계를 분할 합산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "회전이동 도형의 호 2개와 직선 경계를 복합 분석하여 둘레를 구하는 3단계 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "부채꼴",
      "호"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "호",
      "길이"
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
다면체에 대한 설명으로 옳지 않은 것은? [4점]


### 선지
① $n$각기둥의 모서리의 개수는 $3n$개이다. ② 각뿔대의 두 밑면은 서로 평행하고 항상 합동이다. ③ 사각뿔대의 옆면의 모양은 사다리꼴이다. ④ 정팔면체의 한 꼭짓점에 모이는 면의 개수는 $4$개이다. ⑤ 육각뿔의 면의 개수는 $7$개이므로 칠면체이다.


### 정답
②


### 해설
다면체의 성질을 하나씩 확인하자.


① $n$각기둥의 모서리는 위 밑면 $n$개, 아래 밑면 $n$개, 옆모서리 $n$개이므로 총 $3n$개이다.
③ 각뿔대의 옆면은 모두 사다리꼴이다.
④ 정팔면체는 정삼각형 $8$개로 이루어져 있으며, 각 꼭짓점에 모이는 면의 개수는 $4$개이다.
⑤ 육각뿔은 밑면 $1$개와 옆면 $6$개로 이루어져 면의 개수가 $7$개이므로 칠면체이다.


각뿔대는 각뿔을 밑면에 평행한 평면으로 잘라서 생기는 입체도형이므로, 두 밑면은 서로 평행하고 닮은 도형이지만 일반적으로 크기가 다르므로 합동이 아니다.


따라서 옳지 않은 것은 ②이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "각기둥, 각뿔, 각뿔대, 정다면체의 구성 요소 및 성질에 대한 개념 판정 문항"
}
```


```json:meta
{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "각뿔대의 정의상 두 밑면은 평행하지만 크기가 달라 합동이 될 수 없음을 판별한다.",
  "decisiveStep": "각뿔대 밑면의 합동성 부정",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "각뿔대의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_PROPERTY_AUDIT",
    "templateKey": "TPL_M1_POLYHEDRON_PROPERTY_AUDIT_PRISM_PYRAMID_FRUSTUM",
    "why": "각기둥, 각뿔대, 정다면체의 면·모서리·합동성 성질을 종합 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "각뿔대 밑면의 평행과 합동 차이를 식별하는 기본 개념 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다면체",
      "각기둥",
      "각뿔대",
      "정다면체"
    ],
    "goal": [
      "성질"
    ],
    "method": [
      "합동"
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
다음 조건을 모두 만족하는 다면체의 이름은? [4점]


(가) 두 밑면은 서로 평행하지만 합동은 아니고, 옆면은 모두 사다리꼴이다.
(나) 모서리의 개수는 $21$개이다.


### 선지
① 칠각뿔 ② 칠각기둥 ③ 팔각뿔대 ④ 칠각뿔대 ⑤ 육각뿔대


### 정답
④


### 해설
조건 (가)에서 두 밑면이 평행하고 옆면이 사다리꼴이므로 이 다면체는 각뿔대이다.


$n$각뿔대의 모서리의 개수는
$$\begin{aligned}
3n &= 21 \\
n &= 7
\end{aligned}$$
이므로 밑면은 칠각형이다.


따라서 구하는 다면체는 칠각뿔대이다.
정답은 ④이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "조건에 따른 다면체의 모서리 수 역산 및 명칭 판별 문항"
}
```


```json:meta
{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "조건 (가)로 각뿔대임을 특정하고, 모서리 수 3n=21에서 n=7을 구하여 칠각뿔대를 판별한다.",
  "decisiveStep": "각뿔대 모서리 공식 3n=21을 통한 밑면 다각형 차수 n=7 결정",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "다면체의 결정"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_IDENTIFY_POLYHEDRON_CONDITIONS",
    "templateKey": "TPL_M1_IDENTIFY_POLYHEDRON_CONDITIONS_EDGE_COUNT",
    "why": "옆면 형태 조건과 모서리 방정식 3n=k를 연립하여 다면체를 특정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "각뿔대의 형태 조건과 모서리 개수를 연계하여 입체를 특정하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다면체",
      "각뿔대"
    ],
    "goal": [
      "다면체"
    ],
    "method": [
      "모서리"
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
다음 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 잘랐을 때 생기는 단면의 모양이 바르게 짝 지어진 것은? [4점]


### 선지
① 원기둥 - 사다리꼴 ② 원뿔 - 직각삼각형 ③ 원뿔대 - 등변사다리꼴 ④ 구 - 타원 ⑤ 반구 - 삼각형


### 정답
③


### 해설
회전체를 회전축을 포함하는 평면으로 잘랐을 때 생기는 단면의 모양은 회전축에 대하여 선대칭도형이다.
각 회전체의 회전축을 포함하는 단면을 살펴보면 다음과 같다.
$$\begin{aligned}
\text{원기둥} &\rightarrow \text{직사각형} \\
\text{원뿔} &\rightarrow \text{이등변삼각형} \\
\text{원뿔대} &\rightarrow \text{등변사다리꼴} \\
\text{구} &\rightarrow \text{원} \\
\text{반구} &\rightarrow \text{반원}
\end{aligned}$$
따라서 바르게 짝 지어진 것은 ③이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "회전체의 회전축을 포함하는 평면으로 자른 단면의 형태 판정 문항"
}
```


```json:meta
{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원뿔대를 회전축을 포함하는 평면으로 자르면 등변사다리꼴이 됨을 선대칭성으로 확인한다.",
  "decisiveStep": "원뿔대의 축 포함 단면이 등변사다리꼴임을 식별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "회전체",
    "l4": "회전체의 단면"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REVOLUTION_BODY_SECTION",
    "templateKey": "TPL_M1_REVOLUTION_BODY_SECTION_AXIS_PLANE_MATCH",
    "why": "회전축을 포함하는 평면으로 자른 단면의 선대칭 형태를 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "회전체의 기본 단면 형태를 회전축 포함 평면 기준으로 판별하는 1단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "회전체",
      "원기둥",
      "원뿔",
      "원뿔대",
      "구"
    ],
    "goal": [
      "단면"
    ],
    "method": [
      "회전축"
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
회전축 $l$에서 일정한 거리만큼 떨어져 있는 직사각형을 회전축 $l$을 중심으로 하여 $1$회전 시킬 때 생기는 회전체에 대한 설명으로 옳은 것은? [4점]


### 선지
① 회전축에 수직인 평면으로 자른 단면은 가운데가 뚫린 고리(원환) 모양이다. ② 회전축을 포함하는 평면으로 자른 단면은 하나의 온전한 직사각형이다. ③ 밑면은 속이 꽉 찬 원판 모양이다. ④ 회전축에 수직인 평면으로 자른 단면의 경계는 $1$개의 원이다. ⑤ 생기는 회전체는 원뿔대이다.


### 정답
①


### 해설
직사각형이 회전축 $l$에서 일정한 거리만큼 떨어져 있으면, 이를 $1$회전 시킬 때 가운데가 원기둥 모양으로 비어 있는 원기둥(구멍 뚫린 원기둥)이 만들어진다.


이 회전체를 회전축에 수직인 평면으로 자르면 가운데에 작은 원 모양의 구멍이 뚫린 고리 모양(원환 모양)이 된다.
이 고리 모양 단면의 경계는 바깥쪽 원과 안쪽 원의 $2$개이다.
또한 회전축을 포함하는 평면으로 자르면 회전축의 양쪽에 대칭인 두 개의 직사각형이 나타난다.


따라서 옳은 설명은 ①이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "축에서 떨어진 평면도형의 회전체 및 수직 단면의 기하학적 형태 판정 문항"
}
```


```json:meta
{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "축에서 떨어진 직사각형을 회전하면 가운데가 뚫린 원기둥이 되며, 수직 단면은 고리 모양임을 판정한다.",
  "decisiveStep": "가운데가 빈 회전체의 수직 단면이 고리 모양임을 식별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "회전체",
    "l4": "회전체의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REVOLUTION_BODY_PROPERTIES",
    "templateKey": "TPL_M1_REVOLUTION_BODY_PROPERTIES_HOLLOW_CYLINDER",
    "why": "회전축과 이격된 도형의 회전체가 갖는 단면 및 기하학적 특성을 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "회전축과의 이격 거리에 따른 중공형 회전체 단면의 형태를 판별하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "회전체",
      "원기둥"
    ],
    "goal": [
      "단면"
    ],
    "method": [
      "회전축"
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
다음 그림과 같이 사다리꼴을 밑면으로 하는 사각기둥이 있다. 밑면인 사다리꼴의 윗변의 길이가 $4\rm\,cm$, 아랫변의 길이가 $8\rm\,cm$, 높이가 $5\rm\,cm$이고, 사각기둥의 높이가 $10\rm\,cm$일 때, 이 사각기둥의 부피는? [4점]


### 선지
① $240\rm\,cm^3$ ② $260\rm\,cm^3$ ③ $270\rm\,cm^3$ ④ $280\rm\,cm^3$ ⑤ $300\rm\,cm^3$


### 정답
⑤


### 해설
기둥의 부피는 $(\text{밑넓이}) \times (\text{높이})$이다.
밑면인 사다리꼴의 넓이는
$$\begin{aligned}
\dfrac{(4 + 8) \times 5}{2} &= \dfrac{12 \times 5}{2} \\
&= 30\rm\,cm^2
\end{aligned}$$
사각기둥의 높이가 $10\rm\,cm$이므로 부피는
$$\begin{aligned}
30 \times 10 &= 300\rm\,cm^3
\end{aligned}$$
따라서 정답은 ⑤이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "밑면이 사다리꼴인 사각기둥의 입체 다이어그램"
}
```


```json:meta
{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "사다리꼴 밑넓이 30cm^2를 구한 후 기둥의 높이 10cm를 곱해 부피 300cm^3을 계산한다.",
  "decisiveStep": "사다리꼴 밑넓이 산출 후 기둥 높이 승산",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 부피",
    "l4": "기둥의 부피"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PRISM_VOLUME",
    "templateKey": "TPL_M1_PRISM_VOLUME_TRAPEZOID_BASE",
    "why": "사다리꼴 밑넓이를 계산하여 기둥 부피 공식에 적용하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사다리꼴 넓이와 기둥 부피 공식을 연계 적용하는 2단계 계산 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "각기둥",
      "부피"
    ],
    "goal": [
      "부피"
    ],
    "method": [
      "부피"
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
다음 그림과 같이 가운데가 원기둥 모양으로 뚫려 있는 입체도형이 있다. 안쪽 원의 반지름의 길이가 $3\rm\,cm$, 바깥쪽 원의 반지름의 길이가 $6\rm\,cm$, 입체도형의 높이가 $8\rm\,cm$일 때, 이 입체도형의 겉넓이는? [4점]


### 선지
① $192\pi\rm\,cm^2$ ② $198\pi\rm\,cm^2$ ③ $204\pi\rm\,cm^2$ ④ $216\pi\rm\,cm^2$ ⑤ $228\pi\rm\,cm^2$


### 정답
②


### 해설
구멍 뚫린 원기둥의 겉넓이는 바깥쪽 옆넓이, 안쪽 옆넓이, 그리고 위아래 두 밑면(고리 모양)의 넓이의 합이다.


바깥쪽 옆넓이는
$$\begin{aligned}
2\pi \times 6 \times 8 &= 96\pi\rm\,cm^2
\end{aligned}$$
안쪽 옆넓이는
$$\begin{aligned}
2\pi \times 3 \times 8 &= 48\pi\rm\,cm^2
\end{aligned}$$
위아래 두 밑면의 넓이의 합은
$$\begin{aligned}
2 \times \pi(6^2 - 3^2) &= 2 \times \pi(36 - 9) \\
&= 2 \times 27\pi \\
&= 54\pi\rm\,cm^2
\end{aligned}$$
따라서 이 입체도형의 겉넓이는
$$\begin{aligned}
96\pi + 48\pi + 54\pi &= 198\pi\rm\,cm^2
\end{aligned}$$
따라서 정답은 ②이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "가운데가 원기둥 모양으로 뚫려 있는 원기둥 입체 다이어그램"
}
```


```json:meta
{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "바깥 옆넓이 96pi, 안쪽 옆넓이 48pi, 두 밑면 고리 넓이 54pi를 각각 계산하여 합산한다.",
  "decisiveStep": "안팎 옆넓이 및 두 밑면 고리 넓이의 3분할 합산",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 겉넓이",
    "l4": "원기둥의 겉넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CYLINDER_SURFACE_AREA",
    "templateKey": "TPL_M1_CYLINDER_SURFACE_AREA_HOLLOW",
    "why": "가운데가 뚫린 원기둥의 안팎 옆면과 고리형 밑면을 분할 합산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "안팎의 옆넓이와 고리 모양 밑면 2개의 넓이를 단계별로 합산하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원기둥",
      "겉넓이"
    ],
    "goal": [
      "겉넓이"
    ],
    "method": [
      "겉넓이"
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
다음 두 종류의 원뿔 모양의 컵 A, B가 있다. 컵 A는 밑면의 반지름의 길이가 $4\rm\,cm$, 높이가 $9\rm\,cm$이고, 컵 B는 밑면의 반지름의 길이가 $8\rm\,cm$, 높이가 $9\rm\,cm$이다. 두 컵에 가득 담을 수 있는 물의 양에 대한 설명 중 옳은 것은? [4점]


### 선지
① 컵 A에 담을 수 있는 물의 양이 컵 B보다 $2$배 많다. ② 컵 A에 담을 수 있는 물의 양이 컵 B보다 $4$배 많다. ③ 컵 A와 컵 B에 담을 수 있는 물의 양이 같다. ④ 컵 B에 담을 수 있는 물의 양이 컵 A보다 $4$배 많다. ⑤ 컵 B에 담을 수 있는 물의 양이 컵 A보다 $2$배 많다.


### 정답
④


### 해설
원뿔의 부피는 $\dfrac{1}{3}\pi r^2 h$이다.


컵 A에 담을 수 있는 물의 양(부피)은
$$\begin{aligned}
\dfrac{1}{3}\pi \times 4^2 \times 9 &= 48\pi\rm\,cm^3
\end{aligned}$$
컵 B에 담을 수 있는 물의 양(부피)은
$$\begin{aligned}
\dfrac{1}{3}\pi \times 8^2 \times 9 &= 192\pi\rm\,cm^3
\end{aligned}$$
두 컵의 부피의 비를 구하면
$$\begin{aligned}
\dfrac{192\pi}{48\pi} &= 4
\end{aligned}$$
따라서 컵 B에 담을 수 있는 물의 양이 컵 A보다 $4$배 많다.
정답은 ④이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "원뿔의 부피 공식을 활용한 두 컵의 용량 배수 비교 문항"
}
```


```json:meta
{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원뿔의 부피 공식을 이용하여 컵 A(48pi)와 컵 B(192pi)의 부피를 구하고 4배임을 판별한다.",
  "decisiveStep": "원뿔 부피 공식을 적용한 두 용기 부피비 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 부피",
    "l4": "원뿔의 부피"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONE_VOLUME_RATIO",
    "templateKey": "TPL_M1_CONE_VOLUME_RATIO_CYLINDER_VESSEL_COMPARE",
    "why": "두 원뿔의 반지름과 높이를 부피 공식에 대입하여 용량 배수를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원뿔 부피 공식을 각각 대입하여 배수 관계를 파악하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원뿔",
      "부피"
    ],
    "goal": [
      "부피"
    ],
    "method": [
      "부피"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q15


- 형식: 객관식
- 배점: 5


### 발문
반지름의 길이가 $r$인 큰 쇠구슬 $1$개를 녹여서 반지름의 길이가 $\dfrac{r}{3}$인 작은 쇠구슬 $a$개를 만들었다. 큰 쇠구슬 $1$개의 겉넓이와 작은 쇠구슬 $a$개의 겉넓이의 합의 비가 $1 : b$일 때, $a + b$의 값은? [5점]


### 선지
① $24$ ② $27$ ③ $30$ ④ $33$ ⑤ $36$


### 정답
③


### 해설
구의 부피는 $\dfrac{4}{3}\pi r^3$이다.
반지름이 $r$인 구의 부피는 반지름이 $\dfrac{r}{3}$인 작은 구의 부피의
$$\begin{aligned}
r^3 \div \left(\dfrac{r}{3}\right)^3 &= 27\text{배}
\end{aligned}$$
이므로 작은 쇠구슬의 개수는
$$\begin{aligned}
a &= 27
\end{aligned}$$
이다.


구의 겉넓이는 $4\pi r^2$이다.
큰 쇠구슬의 겉넓이는 $4\pi r^2$이고, 작은 쇠구슬 $1$개의 겉넓이는
$$\begin{aligned}
4\pi \left(\dfrac{r}{3}\right)^2 &= \dfrac{4}{9}\pi r^2
\end{aligned}$$
이므로 작은 쇠구슬 $27$개의 겉넓이의 합은
$$\begin{aligned}
27 \times \dfrac{4}{9}\pi r^2 &= 12\pi r^2
\end{aligned}$$
이다. 따라서 큰 구와 작은 구 $27$개의 겉넓이의 비는
$$\begin{aligned}
4\pi r^2 : 12\pi r^2 &= 1 : 3
\end{aligned}$$
이므로
$$\begin{aligned}
b &= 3
\end{aligned}$$
이다.
따라서 구하는 값은
$$\begin{aligned}
a + b &= 27 + 3 \\
&= 30
\end{aligned}$$
따라서 정답은 ③이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "구의 부피 및 겉넓이 공식의 닮음비/거듭제곱비 연계 계산 문항"
}
```


```json:meta
{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "반지름 1/3 축소에 따른 부피비 27배로 a=27을 구하고, 겉넓이 합 12pi*r^2로부터 b=3을 도출하여 a+b=30을 계산한다.",
  "decisiveStep": "구의 부피 세제곱비(a=27) 및 겉넓이 제곱비 누적(b=3) 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 부피와 겉넓이",
    "l4": "구의 부피와 겉넓이의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SPHERE_VOLUME_SURFACE_RELATION",
    "templateKey": "TPL_M1_SPHERE_VOLUME_SURFACE_RELATION_SUBDIVISION",
    "why": "구의 부피 세제곱비로 개수를 구하고 겉넓이 제곱비 합을 연계 도출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구의 부피와 겉넓이 공식을 연립하여 비례 관계와 개수를 다단계 추론하는 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "구",
      "부피",
      "겉넓이"
    ],
    "goal": [
      "부피",
      "겉넓이"
    ],
    "method": [
      "부피",
      "겉넓이"
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
다음 그림과 같은 직각사다리꼴을 직선 $l, m, n$을 회전축으로 하여 각각 $1$회전 시킬 때 생기는 회전체의 부피를 각각 $a, b, c$라고 하자. 윗변의 길이가 $3\rm\,cm$, 아랫변의 길이가 $6\rm\,cm$, 높이가 $4\rm\,cm$이고, $l$은 높이인 변을 포함하는 직선, $m$은 아랫변을 포함하는 직선, $n$은 윗변을 포함하는 직선일 때, $a, b, c$의 대소 관계를 바르게 나타낸 것은? [5점]


### 선지
① $a \gt b \gt c$ ② $a \gt c \gt b$ ③ $b \gt a \gt c$ ④ $b \gt c \gt a$ ⑤ $c \gt a \gt b$


### 정답
①


### 해설
직각사다리꼴의 빗변을 연장하여 각 회전체의 모양을 분석하자.
윗변과 아랫변의 길이의 비가 $3 : 6 = 1 : 2$이므로, 빗변을 연장해 만들어지는 큰 원뿔의 높이는 $4 \times 2 = 8\rm\,cm$이고, 잘라낸 작은 원뿔의 높이는 $4\rm\,cm$이다.


(1) 직선 $l$을 축으로 $1$회전 할 때 생기는 회전체는 원뿔대이므로 부피 $a$는
$$\begin{aligned}
a &= \dfrac{1}{3}\pi \times 6^2 \times 8 - \dfrac{1}{3}\pi \times 3^2 \times 4 \\
&= 96\pi - 12\pi \\
&= 84\pi\rm\,cm^3
\end{aligned}$$


(2) 직선 $m$을 축으로 $1$회전 할 때 생기는 회전체는 밑면의 반지름이 $4\rm\,cm$, 높이가 $6\rm\,cm$인 원기둥에서 밑면의 반지름이 $4\rm\,cm$, 높이가 $3\rm\,cm$인 원뿔을 파낸 모양이므로 부피 $b$는
$$\begin{aligned}
b &= \pi \times 4^2 \times 6 - \dfrac{1}{3}\pi \times 4^2 \times 3 \\
&= 96\pi - 16\pi \\
&= 80\pi\rm\,cm^3
\end{aligned}$$


(3) 직선 $n$을 축으로 $1$회전 할 때 생기는 회전체는 밑면의 반지름이 $4\rm\,cm$, 높이가 $3\rm\,cm$인 원기둥에 밑면의 반지름이 $4\rm\,cm$, 높이가 $3\rm\,cm$인 원뿔이 붙은 모양이므로 부피 $c$는
$$\begin{aligned}
c &= \pi \times 4^2 \times 3 + \dfrac{1}{3}\pi \times 4^2 \times 3 \\
&= 48\pi + 16\pi \\
&= 64\pi\rm\,cm^3
\end{aligned}$$


따라서 $a, b, c$의 크기를 비교하면
$$\begin{aligned}
a > b > c
\end{aligned}$$
이므로 정답은 ①이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "직각사다리꼴과 세 회전축 l, m, n이 표시된 다이어그램"
}
```


```json:meta
{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "직선 l, m, n 회전체의 부피를 각각 84pi, 80pi, 64pi로 계산하여 대소 관계 a>b>c를 확정한다.",
  "decisiveStep": "세 회전축에 따른 원기둥과 원뿔의 결합 및 감산 체적 계산",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 부피",
    "l4": "회전체의 부피의 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REVOLUTION_BODY_VOLUME_COMPARISON",
    "templateKey": "TPL_M1_REVOLUTION_BODY_VOLUME_COMPARISON_TRAPEZOID_AXES",
    "why": "사다리꼴의 세 변을 축으로 한 회전체 부피를 각각 적분/기하식으로 계산하여 대소를 비교하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 회전축에 따른 회전체의 합성 부피를 각각 계산하여 대소를 비교하는 고난도 3단계 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "회전체",
      "사다리꼴",
      "부피"
    ],
    "goal": [
      "부피"
    ],
    "method": [
      "부피"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q17


- 형식: 객관식
- 배점: 4


### 발문
다음 상대도수의 분포표는 민우네 반 학생 $50$명의 일주일 동안의 독서 시간을 조사하여 나타낸 것이다. 독서 시간이 $4$시간 이상 $6$시간 미만인 학생 수는? [4점]


<div class="question-table-wrap"><div>독서 시간</div><table><thead><tr><th>독서 시간(시간)</th><th>상대도수</th></tr></thead><tbody><tr><td>$0$ 이상 ~ $2$ 미만</td><td>$0.12$</td></tr><tr><td>$2$ ~ $4$</td><td>$0.24$</td></tr><tr><td>$4$ ~ $6$</td><td></td></tr><tr><td>$6$ ~ $8$</td><td>$0.26$</td></tr><tr><td>$8$ ~ $10$</td><td>$0.10$</td></tr><tr><td>합계</td><td>$1$</td></tr></tbody></table></div>


### 선지
① $10$명 ② $11$명 ③ $12$명 ④ $13$명 ⑤ $14$명


### 정답
⑤


### 해설
상대도수의 총합은 항상 $1$이다.
알려진 네 계급의 상대도수의 합을 구하면
$$\begin{aligned}
0.12 + 0.24 + 0.26 + 0.10 &= 0.72
\end{aligned}$$
따라서 독서 시간이 $4$시간 이상 $6$시간 미만인 계급의 상대도수는
$$\begin{aligned}
1 - 0.72 &= 0.28
\end{aligned}$$
전체 학생 수가 $50$명이므로 이 계급의 학생 수는
$$\begin{aligned}
50 \times 0.28 &= 14\text{명}
\end{aligned}$$
따라서 정답은 ⑤이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "상대도수 분포표의 합 1 성질을 이용한 특정 계급 도수 역산 문항"
}
```


```json:meta
{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-STATISTICS",
  "conceptClusterKey": "STATISTICS",
  "primaryMethod": "상대도수의 합이 1임을 이용하여 빈칸의 상대도수 0.28을 구하고 전체 도수 50을 곱해 14명을 계산한다.",
  "decisiveStep": "미지의 상대도수 0.28 산출 후 전체 도수 50과의 곱셈",
  "rpm": {
    "majorUnit": "자료의 정리와 해석",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "상대도수와 도수의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_RELATIVE_FREQ_FIND_FREQUENCY",
    "templateKey": "TPL_M1_RELATIVE_FREQ_FIND_FREQUENCY_SUM_ONE",
    "why": "상대도수 총합 1을 활용해 빈칸 상대도수를 채우고 전체 도수를 곱해 빈칸 도수를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상대도수 총합이 1임을 활용하여 특정 계급의 실제 도수를 산출하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "상대도수",
      "도수분포표"
    ],
    "goal": [
      "도수"
    ],
    "method": [
      "상대도수"
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
다음 그림은 어느 중학교 남학생 $200$명과 여학생 $160$명의 일주일 동안 운동 시간을 조사하여 상대도수의 분포를 함께 나타낸 그래프이다. 보기 중 옳은 것만을 있는 대로 고른 것은? [4점]


<보기>
ㄱ. 여학생의 상대도수가 가장 큰 계급은 $4$시간 이상 $6$시간 미만이다.
ㄴ. 운동 시간이 $6$시간 이상 $8$시간 미만인 학생 수는 여학생이 남학생보다 적다.
ㄷ. 전체적으로 남학생이 여학생보다 운동 시간이 많은 편이다.
(단, $6$시간 이상 $8$시간 미만의 상대도수는 남학생이 $0.25$, 여학생이 $0.30$이고, 그래프에서 남학생의 분포는 여학생보다 전반적으로 오른쪽으로 치우쳐 있다.)


### 선지
① ㄱ ② ㄴ, ㄷ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ


### 정답
②


### 해설
보기를 하나씩 확인하자.


ㄱ. 여학생 그래프에서 가장 높은 점은 상대도수가 $0.30$인 $6$시간 이상 $8$시간 미만 계급에 위치한다. 따라서 ㄱ은 옳지 않다.


ㄴ. $6$시간 이상 $8$시간 미만인 계급의 학생 수는
$$\begin{aligned}
\text{남학생} &= 200 \times 0.25 = 50\text{명} \\
\text{여학생} &= 160 \times 0.30 = 48\text{명}
\end{aligned}$$
이므로 여학생($48$명)이 남학생($50$명)보다 적다. 따라서 ㄴ은 옳다.


ㄷ. 남학생의 상대도수 분포 그래프가 여학생보다 대체로 오른쪽에 위치하므로, 전체적으로 남학생이 여학생보다 운동 시간이 많은 편이라고 할 수 있다. 따라서 ㄷ은 옳다.


따라서 옳은 것은 ㄴ, ㄷ이므로 정답은 ②이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "남학생 200명과 여학생 160명의 상대도수 분포 꺾은선 그래프 다이어그램"
}
```


```json:meta
{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-STATISTICS",
  "conceptClusterKey": "STATISTICS",
  "primaryMethod": "상대도수 정점 계급 판별, 각 집단 실제 도수 50명과 48명 계산 비교, 분포 위치 비교로 ㄴ, ㄷ을 채택한다.",
  "decisiveStep": "전체 도수가 다른 두 집단에서 실제 도수 계산 비교(50>48)",
  "rpm": {
    "majorUnit": "자료의 정리와 해석",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "두 집단의 상대도수의 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_RELATIVE_FREQ_TWO_GROUPS_COMPARISON",
    "templateKey": "TPL_M1_RELATIVE_FREQ_TWO_GROUPS_COMPARISON_STATEMENT_AUDIT",
    "why": "두 집단의 상대도수 분포 그래프에서 도수 및 분포 경향성을 비교 평가하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상대도수 그래프를 해석하여 실제 도수와 집단 간 경향성을 복합 비교하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "상대도수",
      "도수"
    ],
    "goal": [
      "도수",
      "상대도수"
    ],
    "method": [
      "상대도수"
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
**[19~20] 다음 상대도수의 분포표는 현우네 중학교 $1$학년 학생들의 하루 스마트폰 사용 시간을 조사하여 나타낸 것이다. 물음에 답하시오.**


<div class="question-table-wrap"><div>스마트폰 사용 시간</div><table><thead><tr><th>사용 시간(분)</th><th>학생 수(명)</th><th>상대도수</th></tr></thead><tbody><tr><td>$0$ 이상 ~ $30$ 미만</td><td>$A$</td><td>$0.15$</td></tr><tr><td>$30$ ~ $60$</td><td>$18$</td><td>$B$</td></tr><tr><td>$60$ ~ $90$</td><td>$24$</td><td>$0.40$</td></tr><tr><td>$90$ ~ $120$</td><td>$C$</td><td>$D$</td></tr><tr><td>$120$ ~ $150$</td><td>$3$</td><td>$0.05$</td></tr><tr><td>합계</td><td>$E$</td><td>$1$</td></tr></tbody></table></div>


위 표에서 $A, B, C, D, E$의 값 중 옳지 않은 것은? [4점]


### 선지
① $A = 9$ ② $B = 0.30$ ③ $C = 6$ ④ $D = 0.15$ ⑤ $E = 60$


### 정답
④


### 해설
$60$분 이상 $90$분 미만인 계급에서 학생 수가 $24$명이고 상대도수가 $0.40$이므로 전체 학생 수 $E$는
$$\begin{aligned}
E &= \dfrac{24}{0.40} \\
&= 60\text{명}
\end{aligned}$$
따라서 각 미지수의 값을 구하면 다음과 같다.
$$\begin{aligned}
A &= 60 \times 0.15 = 9 \\
B &= \dfrac{18}{60} = 0.30
\end{aligned}$$
상대도수의 총합은 $1$이므로 계급 $90$분 이상 $120$분 미만의 상대도수 $D$는
$$\begin{aligned}
D &= 1 - (0.15 + 0.30 + 0.40 + 0.05) \\
&= 1 - 0.90 \\
&= 0.10
\end{aligned}$$
따라서 $C$의 값은
$$\begin{aligned}
C &= 60 \times 0.10 = 6
\end{aligned}$$
따라서 $D = 0.15$라고 한 ④가 옳지 않다.
정답은 ④이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "도수와 상대도수 표의 미지수를 총도수 식과 합 1 성질로 산출하는 문항"
}
```


```json:meta
{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-STATISTICS",
  "conceptClusterKey": "STATISTICS",
  "primaryMethod": "60~90분 계급의 도수 24와 상대도수 0.40으로 전체 E=60을 구하고, 각 미지수를 도출하여 D=0.10임을 검증한다.",
  "decisiveStep": "전체 도수 E=60 산출 및 미지 상대도수 D=0.10 계산",
  "rpm": {
    "majorUnit": "자료의 정리와 해석",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "상대도수의 분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_RELATIVE_FREQ_TABLE_VARIABLES",
    "templateKey": "TPL_M1_RELATIVE_FREQ_TABLE_VARIABLES_MULTI_SLOT",
    "why": "도수와 상대도수 표의 여러 미지수를 총도수 유도 후 연쇄 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도수와 상대도수의 상호 변환 관계를 이용하여 다수의 미지수를 완성하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수",
      "상대도수",
      "도수분포표"
    ],
    "goal": [
      "도수",
      "상대도수"
    ],
    "method": [
      "상대도수"
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
스마트폰 사용 시간이 $30$분 이상 $90$분 미만인 학생은 전체의 몇 $\%$인가? [4점]


### 선지
① $60\%$ ② $65\%$ ③ $70\%$ ④ $75\%$ ⑤ $80\%$


### 정답
③


### 해설
스마트폰 사용 시간이 $30$분 이상 $90$분 미만인 구간은 두 계급 '$30$분 이상 $60$분 미만'과 '$60$분 이상 $90$분 미만'을 포함한다.
두 계급의 상대도수의 합은
$$\begin{aligned}
0.30 + 0.40 &= 0.70
\end{aligned}$$
따라서 이 구간에 속하는 학생은 전체의
$$\begin{aligned}
0.70 \times 100\% &= 70\%
\end{aligned}$$
따라서 정답은 ③이다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "상대도수 합을 백분율로 환산하는 기본 통계 계산 문항"
}
```


```json:meta
{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-STATISTICS",
  "conceptClusterKey": "STATISTICS",
  "primaryMethod": "해당 두 계급의 상대도수 0.30과 0.40을 합하여 0.70을 얻고, 100을 곱해 70%를 구한다.",
  "decisiveStep": "구간 상대도수 합산 후 백분율(%) 환산",
  "rpm": {
    "majorUnit": "자료의 정리와 해석",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "상대도수와 비율"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_RELATIVE_FREQ_PERCENTAGE",
    "templateKey": "TPL_M1_RELATIVE_FREQ_PERCENTAGE_INTERVAL_SUM",
    "why": "구간에 속하는 계급들의 상대도수를 합산하여 백분율로 변환하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "특정 구간의 상대도수를 합하여 백분율로 환산하는 1단계 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "상대도수"
    ],
    "goal": [
      "상대도수"
    ],
    "method": [
      "상대도수"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q21


- 형식: 서술형
- 배점: 6


### 발문
서·논술형1. 아래 그림과 같이 중심각의 크기가 $120^\circ$이고 호의 길이가 $8\pi\rm\,cm$인 부채꼴의 넓이를 구하고 그 과정을 서술하시오. [6점]


### 정답
$48\pi\rm\,cm^2$


### 해설
부채꼴의 반지름의 길이를 $r\rm\,cm$라 하자.
호의 길이 공식을 세우면
$$\begin{aligned}
2\pi r \times \dfrac{120}{360} &= 8\pi \\
\dfrac{2}{3}\pi r &= 8\pi \\
r &= 8 \times \dfrac{3}{2} \\
&= 12\rm\,cm
\end{aligned}$$
따라서 부채꼴의 반지름의 길이는 $12\rm\,cm$이다.


이제 부채꼴의 넓이 $S$를 구하면
$$\begin{aligned}
S &= \dfrac{1}{2} l r \\
&= \dfrac{1}{2} \times 8\pi \times 12 \\
&= 48\pi\rm\,cm^2
\end{aligned}$$
(또는 넓이 공식 $S = \pi r^2 \times \dfrac{120}{360} = 144\pi \times \dfrac{1}{3} = 48\pi\rm\,cm^2$로 계산할 수도 있다.)


따라서 구하는 부채꼴의 넓이는 $48\pi\rm\,cm^2$이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "중심각 120도, 호의 길이 8pi cm인 부채꼴 다이어그램"
}
```


```json:meta
{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "호의 길이 공식으로부터 반지름 r=12cm를 구하고, 부채꼴 넓이 공식 S=1/2*l*r에 대입하여 48pi cm^2를 도출한다.",
  "decisiveStep": "호의 길이로 반지름 r=12cm 계산 및 넓이 공식 적용",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "부채꼴의 호의 길이와 넓이",
    "l4": "호의 길이와 중심각을 이용한 넓이 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SECTOR_RADIUS_AND_AREA_DESCRIPTIVE",
    "templateKey": "TPL_M1_SECTOR_RADIUS_AND_AREA_DESCRIPTIVE_ARC_FORMULA",
    "why": "호의 길이 공식으로 반지름을 구하고 넓이 공식으로 전개하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "호의 길이 공식을 역산하여 반지름을 구하고 넓이를 산출하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부채꼴",
      "중심각",
      "호"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "호",
      "넓이"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q22


- 형식: 서술형
- 배점: 6


### 발문
서·논술형2. 정다면체의 정의와 종류($5$가지)를 쓰고, 정육면체의 모든 꼭짓점을 잘라내어 정삼각형과 정팔각형으로 둘러싸이게 만든 깎은 정육면체가 정다면체가 아닌 이유를 구체적으로 서술하시오. [6점]


### 정답
정다면체는 모든 면이 서로 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 모두 같은 다면체이다. 정다면체의 종류는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 5가지이다. 깎은 정육면체는 면이 정삼각형과 정팔각형의 서로 다른 두 종류의 다각형으로 이루어져 있어 모든 면이 서로 합동인 정다각형이라는 조건을 만족하지 않으므로 정다면체가 아니다.


### 해설
(1) 정다면체의 정의:
모든 면이 서로 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 모두 같은 다면체이다.


(2) 정다면체의 종류:
정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 $5$가지이다.


(3) 깎은 정육면체가 정다면체가 아닌 이유:
정다면체가 되기 위해서는 모든 면이 서로 합동인 정다각형이어야 한다.
그러나 깎은 정육면체는 면이 정삼각형과 정팔각형의 두 종류로 이루어져 있으므로, 모든 면이 서로 합동이라는 조건을 만족하지 않는다.
따라서 깎은 정육면체는 정다면체가 아니다.


```json:plan
{
  "status": "EXEMPT",
  "reason": "정다면체의 2가지 정의 요건 기술 및 준정다면체의 비적합 사유 서술 문항"
}
```


```json:meta
{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "정다면체의 정의 2가지 조건과 5가지 종류를 서술하고, 정삼각형과 정팔각형이 섞여 모든 면이 합동이 아님을 지적한다.",
  "decisiveStep": "면의 합동성 결여(정삼각형과 정팔각형 혼재)를 통한 정다면체 부정",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "정다면체의 정의와 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REGULAR_POLYHEDRON_DEFINITION_DESCRIPTIVE",
    "templateKey": "TPL_M1_REGULAR_POLYHEDRON_DEFINITION_DESCRIPTIVE_TRUNCATED",
    "why": "정다면체 2대 요건 및 5종류를 서술하고 준정다면체의 반례 이유를 논증하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다면체의 정의 요건 2가지와 5가지 명칭, 비적합 사유를 서술 논증하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다면체",
      "다면체"
    ],
    "goal": [
      "정다면체"
    ],
    "method": [
      "정다각형",
      "합동"
    ],
    "condition": []
  },
  "hold": ""
}
```


## Q23


- 형식: 서술형
- 배점: 8


### 발문
서·논술형3. 다음 그림과 같이 윗변의 길이가 $4\rm\,cm$, 아랫변의 길이가 $8\rm\,cm$, 옆면의 모선의 길이가 $6\rm\,cm$인 사다리꼴을 직선 $l$을 회전축으로 하여 $1$회전 시킬 때 생기는 회전체에 대하여, 전개도에 나타나는 각 부분의 치수(두 밑면의 반지름, 옆면 부채꼴의 안쪽 및 바깥쪽 반지름, 중심각)를 구체적으로 쓰고, 이 회전체의 겉넓이를 구하는 과정을 단계별로 서술하시오. [8점]


### 정답
전개도는 반지름이 각각 $4\rm\,cm, 8\rm\,cm$인 두 원과 안쪽반지름 $6\rm\,cm$, 바깥반지름 $12\rm\,cm$, 중심각 $240^\circ$인 고리 모양의 부채꼴로 이루어지며, 겉넓이는 $152\pi\rm\,cm^2$이다.


### 해설
사다리꼴을 직선 $l$을 축으로 $1$회전 시키면 두 밑면의 반지름이 각각 $4\rm\,cm, 8\rm\,cm$이고 모선의 길이가 $6\rm\,cm$인 원뿔대가 된다.


(1) 전개도의 구성과 치수:
사다리꼴의 빗변을 위로 연장하여 만들어지는 작은 원뿔과 큰 원뿔의 닮음비는 밑면의 반지름의 비와 같으므로
$$\begin{aligned}
4 : 8 &= 1 : 2
\end{aligned}$$
따라서 잘라낸 작은 원뿔의 모선의 길이는 $6\rm\,cm$이고, 큰 원뿔의 모선의 길이는
$$\begin{aligned}
6 + 6 &= 12\rm\,cm
\end{aligned}$$
옆면의 전개도는 안쪽 반지름이 $6\rm\,cm$, 바깥쪽 반지름이 $12\rm\,cm$인 고리 모양의 부채꼴이다.
이 부채꼴의 중심각의 크기를 $\theta$라 하면, 바깥쪽 호의 길이는 아랫면의 원둘레와 같으므로
$$\begin{aligned}
2\pi \times 12 \times \dfrac{\theta}{360^\circ} &= 2\pi \times 8 \\
\dfrac{\theta}{360^\circ} &= \dfrac{8}{12} = \dfrac{2}{3} \\
\theta &= 240^\circ
\end{aligned}$$
따라서 전개도는 반지름이 각각 $4\rm\,cm, 8\rm\,cm$인 두 밑면 원과, 안쪽 반지름 $6\rm\,cm$, 바깥쪽 반지름 $12\rm\,cm$, 중심각 $240^\circ$인 고리 모양의 부채꼴로 이루어진다.


(2) 겉넓이 계산:
고리 모양 부채꼴의 넓이(옆넓이)는
$$\begin{aligned}
\pi(12^2 - 6^2) \times \dfrac{240}{360} &= \pi(144 - 36) \times \dfrac{2}{3} \\
&= 108\pi \times \dfrac{2}{3} \\
&= 72\pi\rm\,cm^2
\end{aligned}$$
두 밑면의 넓이의 합은
$$\begin{aligned}
\pi \times 8^2 + \pi \times 4^2 &= 64\pi + 16\pi \\
&= 80\pi\rm\,cm^2
\end{aligned}$$
따라서 회전체의 전체 겉넓이는
$$\begin{aligned}
72\pi + 80\pi &= 152\pi\rm\,cm^2
\end{aligned}$$
구하는 겉넓이는 $152\pi\rm\,cm^2$이다.


```json:plan
{
  "status": "UNSUPPORTED",
  "reason": "원뿔대의 회전축 및 전개도 치수 다이어그램"
}
```


```json:meta
{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원뿔대의 모선 닮음비 1:2로 전개도 모선 6cm, 12cm 및 중심각 240도를 산출하고, 옆넓이 72pi와 두 밑넓이 80pi를 합산하여 겉넓이 152pi cm^2를 구한다.",
  "decisiveStep": "원뿔대 전개도 부채꼴 중심각 240도 및 옆넓이 72pi, 두 밑넓이 80pi 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "입체도형의 겉넓이",
    "l4": "원뿔대의 겉넓이와 전개도"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONE_FRUSTUM_NET_AND_SURFACE_AREA_DESCRIPTIVE",
    "templateKey": "TPL_M1_CONE_FRUSTUM_NET_AND_SURFACE_AREA_DESCRIPTIVE_STEP_BY_STEP",
    "why": "원뿔대 전개도의 모선 치수 및 중심각을 단계별로 도출하고 옆넓이와 밑넓이를 합산하여 겉넓이를 완성하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원뿔대 전개도의 각 치수와 중심각 산출, 부채꼴 고리 넓이와 두 밑넓이의 합산을 종합 서술하는 고난도 3단계 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원뿔대",
      "회전체",
      "전개도"
    ],
    "goal": [
      "겉넓이",
      "전개도"
    ],
    "method": [
      "겉넓이",
      "중심각"
    ],
    "condition": []
  },
  "hold": ""
}
```