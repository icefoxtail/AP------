```json:exam
{
  "stem": "26_신흥중_2학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/2mid/26_신흥중_2학기_중간_중2_기출.js",
  "examFolder": "2mid",
  "grade": "중2",
  "curriculum": "2022",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 $\overline{BC}$의 교점을 $D$라 하자. $\angle BAD = 35^\circ$일 때, $\angle C$의 크기는? [3점]
### 선지
① $50^\circ$
② $55^\circ$
③ $60^\circ$
④ $65^\circ$
⑤ $70^\circ$
### 정답
②
### 해설
선분 $AD$가 $\angle A$의 이등분선이므로
$$
\angle A = 2 \times 35^\circ = 70^\circ
$$
이등변삼각형 $ABC$에서 $\overline{AB} = \overline{AC}$이므로 두 밑각의 크기는 서로 같다.
$$
\angle B = \angle C
$$
삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle C = \frac{180^\circ - 70^\circ}{2} = \frac{110^\circ}{2} = 55^\circ
$$
따라서 정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "ISOSCELES_ANGLE_BISECTOR_CALCULATION",
  "primaryMethod": "꼭지각의 이등분선 성질로 꼭지각을 구한 후 이등변삼각형의 두 밑각 크기가 같음을 이용한다.",
  "decisiveStep": "각A = 70도 계산 후 밑각 C = (180 - 70)/2 = 55도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "이등변삼각형",
    "l4": "이등변삼각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ISOSCELES_ANGLE",
    "templateKey": "TPL_ISOSCELES_ANGLE_BISECTOR",
    "why": "이등변삼각형의 꼭지각 이등분선과 밑각의 성질을 이용한 각도 계산 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_ANGLE_SUM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이등변삼각형의 기본 정의와 성질을 이용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "이등변삼각형",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q02
- 형식: 객관식
- 배점: 3
### 발문
사각형 $ABCD$와 사각형 $EFGH$가 서로 닮은 도형이고, 대응하는 변의 길이의 비는 $\overline{AB} : \overline{EF} = 3 : 4$이다. $\overline{BC} = 15\text{ cm}$일 때, 변 $BC$에 대응하는 변 $FG$의 길이는? [3점]
### 선지
① $16\text{ cm}$
② $17\text{ cm}$
③ $18\text{ cm}$
④ $20\text{ cm}$
⑤ $22\text{ cm}$
### 정답
④
### 해설
두 닮은 사각형 $ABCD$와 $EFGH$에서 대응하는 변의 길이의 비는 일정하다.
$$
\overline{AB} : \overline{EF} = \overline{BC} : \overline{FG}
$$
주어진 값을 대입하면
$$
3 : 4 = 15 : \overline{FG}
$$
외항의 곱과 내항의 곱은 같으므로
$$
3 \times \overline{FG} = 4 \times 15 = 60
$$
$$
\overline{FG} = 20\text{ (cm)}
$$
따라서 정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILARITY_BASIC",
  "conceptClusterKey": "SIMILAR_POLYGON_CORRESPONDING_SIDES",
  "primaryMethod": "닮음비 3:4를 이용하여 대응변의 비례식을 세우고 미지의 길이를 구한다.",
  "decisiveStep": "3 : 4 = 15 : FG 비례식으로부터 FG = 20 산출",
  "rpm": {
    "majorUnit": "도형의 닮음",
    "midUnit": "도형의 닮음",
    "l3": "닮은 도형",
    "l4": "평면도형에서의 닮음의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SIMILARITY_RATIO_SIDES",
    "templateKey": "TPL_POLYGON_SIMILARITY_SIDE_LENGTH",
    "why": "닮음비를 이용해 미지의 대응변 길이를 구하는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_RATIO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "닮음비의 정의에 따른 단순 비례식 풀이 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "사각형",
      "닮음"
    ],
    "goal": [
      "비례식"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q03
- 형식: 객관식
- 배점: 3
### 발문
평행사변형 $ABCD$에서 이웃하는 두 내각의 크기의 비가 $\angle B : \angle C = 2 : 3$일 때, $\angle A$의 크기는? [3점]
### 선지
① $108^\circ$
② $112^\circ$
③ $116^\circ$
④ $120^\circ$
⑤ $124^\circ$
### 정답
①
### 해설
평행사변형에서 이웃하는 두 내각의 크기의 합은 $180^\circ$이다.
$$
\angle B + \angle C = 180^\circ
$$
$\angle B : \angle C = 2 : 3$이므로 비례배분에 의해 $\angle C$의 크기를 구한다.
$$
\angle C = 180^\circ \times \frac{3}{2 + 3} = 180^\circ \times \frac{3}{5} = 108^\circ
$$
평행사변형에서 마주 보는 두 대각의 크기는 서로 같으므로
$$
\angle A = \angle C = 108^\circ
$$
따라서 정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLELOGRAM_ADJACENT_OPPOSITE_ANGLES",
  "primaryMethod": "이웃하는 두 내각의 합이 180도임을 이용하여 대각의 크기를 구한다.",
  "decisiveStep": "각C = 180 * 3/5 = 108도 구한 후 대각 각A = 108도 도출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "평행사변형",
    "l4": "평행사변형의 대각의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PARALLELOGRAM_ANGLES",
    "templateKey": "TPL_PARALLELOGRAM_ANGLE_RATIO",
    "why": "평행사변형의 내각 비례 배분 및 대각의 성질을 적용하는 유형"
  },
  "crossConceptKeys": [
    "CC_RATIO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행사변형의 이웃각 합 180도와 대각 일치 성질을 이용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "평행사변형",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q04
- 형식: 객관식
- 배점: 3
### 발문
직사각형 $ABCD$에서 두 대각선의 교점을 $O$라 하자. 대각선 $\overline{BD} = 16\text{ cm}$이고, $\overline{AB} = 10\text{ cm}$일 때, $\triangle OAB$의 둘레의 길이는? [3점]
### 선지
① $22\text{ cm}$
② $24\text{ cm}$
③ $26\text{ cm}$
④ $28\text{ cm}$
⑤ $30\text{ cm}$
### 정답
③
### 해설
직사각형의 두 대각선은 길이가 서로 같고, 서로 다른 것을 이등분한다.
$$
\overline{AC} = \overline{BD} = 16\text{ (cm)}
$$
대각선의 교점 $O$에 대하여
$$
\overline{OA} = \overline{OB} = \frac{1}{2} \times 16 = 8\text{ (cm)}
$$
따라서 $\triangle OAB$의 둘레의 길이는
$$
\overline{OA} + \overline{OB} + \overline{AB} = 8 + 8 + 10 = 26\text{ (cm)}
$$
정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "RECTANGLE_DIAGONAL_BISECTION_PERIMETER",
  "primaryMethod": "직사각형의 두 대각선 길이가 같고 서로 이등분함을 이용하여 삼각형 둘레를 구한다.",
  "decisiveStep": "OA = OB = 8 구한 후 둘레 8 + 8 + 10 = 26 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "여러 가지 사각형",
    "l4": "직사각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RECTANGLE_DIAGONAL",
    "templateKey": "TPL_RECTANGLE_DIAGONAL_TRIANGLE_PERIMETER",
    "why": "직사각형 대각선 성질로 분할된 삼각형 둘레를 구하는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_PERIMETER"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직사각형의 대각선 기본 성질을 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "직사각형",
      "대각선"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q05
- 형식: 객관식
- 배점: 3
### 발문
$\triangle ABC$에서 $\angle B = 40^\circ, \angle C = 70^\circ$이고, 두 변의 길이가 $\overline{AB} = 2x + 1$, $\overline{BC} = x + 6$일 때, $x$의 값은? [3점]
### 선지
① 1
② 2
③ 3
④ 4
⑤ 5
### 정답
⑤
### 해설
삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle A = 180^\circ - (40^\circ + 70^\circ) = 180^\circ - 110^\circ = 70^\circ
$$
$\angle A = \angle C = 70^\circ$이므로 $\triangle ABC$는 두 내각의 크기가 같은 이등변삼각형이다.
따라서 두 각의 대변의 길이가 서로 같다.
$$
\overline{AB} = \overline{BC}
$$
주어진 식을 대입하면
$$
2x + 1 = x + 6 \implies x = 5
$$
따라서 정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "ISOSCELES_TRIANGLE_CONVERSE_EQUAL_SIDES",
  "primaryMethod": "내각의 합으로 제3의 각을 구해 이등변삼각형임을 확인하고 대변 일차방정식을 푼다.",
  "decisiveStep": "각A = 70도 확인 후 2x + 1 = x + 6에서 x = 5 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "이등변삼각형",
    "l4": "이등변삼각형이 될 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ISOSCELES_CONDITION",
    "templateKey": "TPL_ISOSCELES_ANGLE_TO_EQUAL_SIDES",
    "why": "두 각이 같음을 확인하여 이등변삼각형의 변의 일차방정식을 푸는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "내각 합 연산 후 이등변삼각형 판정과 일차방정식 해결을 결합한 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "이등변삼각형",
      "각"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "이항",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
점 $I$가 $\triangle ABC$의 내심일 때, $\angle ABI = 35^\circ$, $\angle BCI = 20^\circ$이다. 이때 $\angle BAC$의 크기는? [4점]
### 선지
① $65^\circ$
② $70^\circ$
③ $75^\circ$
④ $80^\circ$
⑤ $85^\circ$
### 정답
②
### 해설
내심 $I$는 삼각형의 세 내각의 이등분선이 만나는 점이다.
따라서 선분 $BI, CI$는 각각 $\angle B, \angle C$를 이등분한다.
$$
\angle B = 2 \times \angle ABI = 2 \times 35^\circ = 70^\circ
$$
$$
\angle C = 2 \times \angle BCI = 2 \times 20^\circ = 40^\circ
$$
삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle BAC = 180^\circ - (\angle B + \angle C) = 180^\circ - (70^\circ + 40^\circ) = 70^\circ
$$
따라서 정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "INCENTER_ANGLE_BISECTORS_VERTEX_ANGLE",
  "primaryMethod": "내심이 각의 이등분선의 교점임을 이용하여 두 내각을 구하고 나머지 꼭지각을 구한다.",
  "decisiveStep": "각B=70도, 각C=40도 산출 후 각BAC = 180 - 110 = 70도 계산",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "삼각형의 내심과 외심",
    "l4": "삼각형의 내심의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INCENTER_ANGLES",
    "templateKey": "TPL_INCENTER_ANGLE_DETERMINATION",
    "why": "내심의 각 이등분선 성질을 이용한 내각 계산 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_ANGLE_SUM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "내심의 정의에 따라 각의 배수를 구하고 내각 합으로 꼭지각을 찾는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "내심"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
점 $O$가 $\triangle ABC$의 외심이고 $\angle OAC = 40^\circ$, $\angle OBC = 25^\circ$일 때, $\angle ACB$의 크기는? [4점]
### 선지
① $65^\circ$
② $70^\circ$
③ $75^\circ$
④ $80^\circ$
⑤ $85^\circ$
### 정답
①
### 해설
외심 $O$에서 삼각형의 세 꼭짓점에 이르는 거리는 모두 같다.
$$
\overline{OA} = \overline{OB} = \overline{OC}
$$
1. $\triangle AOC$에서 $\overline{OA} = \overline{OC}$이므로 이등변삼각형이다.
$$
\angle OCA = \angle OAC = 40^\circ
$$
2. $\triangle BOC$에서 $\overline{OB} = \overline{OC}$이므로 이등변삼각형이다.
$$
\angle OCB = \angle OBC = 25^\circ
$$
3. 점 $O$가 $\angle ACB$의 내부에 있으므로
$$
\angle ACB = \angle OCA + \angle OCB = 40^\circ + 25^\circ = 65^\circ
$$
따라서 정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "CIRCUMCENTER_RADIUS_ISOSCELES_ANGLES",
  "primaryMethod": "외심에서 꼭짓점에 이르는 거리가 같아 생기는 이등변삼각형들의 밑각 합을 구한다.",
  "decisiveStep": "각OCA = 40도, 각OCB = 25도로부터 각ACB = 65도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "삼각형의 내심과 외심",
    "l4": "삼각형의 외심의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CIRCUMCENTER_ANGLES",
    "templateKey": "TPL_CIRCUMCENTER_ANGLE_SUM",
    "why": "외심의 꼭짓점 거리 동등성 및 이등변삼각형 밑각 합을 이용하는 유형"
  },
  "crossConceptKeys": [
    "CC_ISOSCELES_TRIANGLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외심의 성질로 생기는 두 이등변삼각형의 밑각을 합산하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "외심"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
직각삼각형 $ABC$ ($\angle B = 90^\circ$)에서 세 점 $B, D, C$가 한 직선 위에 있고 $\overline{AD} \parallel \overline{EC}$이다. $\overline{AB} = 14\text{ cm}$, $\overline{BD} = 8\text{ cm}$, $\overline{DC} = 12\text{ cm}$일 때, 사각형 $ABDE$의 넓이는? [4점]
### 선지
① $134\text{ cm}^2$
② $136\text{ cm}^2$
③ $138\text{ cm}^2$
④ $140\text{ cm}^2$
⑤ $142\text{ cm}^2$
### 정답
④
### 해설
$\overline{AD} \parallel \overline{EC}$이므로 밑변 $\overline{AD}$를 공유하는 두 삼각형 $\triangle ADE$와 $\triangle ADC$는 높이가 같아 넓이가 같다.
$$
\triangle ADE = \triangle ADC
$$
사각형 $ABDE$의 넓이는 두 삼각형의 넓이의 합으로 나눌 수 있으므로
$$
\text{사각형 } ABDE = \triangle ABD + \triangle ADE = \triangle ABD + \triangle ADC = \triangle ABC
$$
점 $B, D, C$가 한 직선 위에 있으므로
$$
\overline{BC} = \overline{BD} + \overline{DC} = 8 + 12 = 20\text{ (cm)}
$$
$\angle B = 90^\circ$이므로 직각삼각형 $ABC$의 넓이는
$$
\triangle ABC = \frac{1}{2} \times \overline{AB} \times \overline{BC} = \frac{1}{2}         imes 14 \times 20 = 140\text{ (cm}^2\text{)}
$$
따라서 사각형 $ABDE$의 넓이는 $140\text{ cm}^2$이다.
정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION",
  "primaryMethod": "평행선 사이의 밑변이 같은 삼각형의 넓이 변환(등적변형)을 이용하여 사각형을 삼각형으로 바꾼다.",
  "decisiveStep": "[ABDE] = [ABC] = 1/2 * 14 * 20 = 140 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "평행선과 넓이",
    "l4": "평행선과 삼각형의 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EQUAL_AREA_PARALLEL",
    "templateKey": "TPL_QUADRILATERAL_AREA_EQUAL_TRANSFORMATION",
    "why": "평행선의 성질을 이용한 다각형의 등적변형 및 넓이 계산 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_AREA"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "등적변형의 보조선 원리를 파악하여 직각삼각형의 넓이로 치환해야 하는 상위 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행",
      "사각형"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
마름모 $ABCD$에서 두 대각선의 교점을 $O$라 하자. $\overline{AO} = 10\text{ cm}$, $\overline{BO} = 15\text{ cm}$이고, 변 $AB$ 위의 점 $E$에 대하여 $\overline{AE} : \overline{EB} = 2 : 1$일 때, $\triangle EBD$의 넓이는? [4점]
### 선지
① $40\text{ cm}^2$
② $45\text{ cm}^2$
③ $50\text{ cm}^2$
④ $55\text{ cm}^2$
⑤ $60\text{ cm}^2$
### 정답
③
### 해설
마름모의 두 대각선은 서로를 수직이등분한다.
$$
\overline{BD} = 2 \times \overline{BO} = 2 \times 15 = 30\text{ (cm)}
$$
선분 $AO$는 $\overline{BD}$에 수직이므로 $\triangle ABD$의 밑변을 $\overline{BD}$로 볼 때 높이는 $\overline{AO} = 10\text{ cm}$이다.
$$
\triangle ABD = \frac{1}{2} \times \overline{BD} \times \overline{AO} = \frac{1}{2} \times 30 \times 10 = 150\text{ (cm}^2\text{)}
$$
점 $E$가 변 $AB$ 위에 있고 $\overline{AE} : \overline{EB} = 2 : 1$이므로
$$
\overline{EB} : \overline{AB} = 1 : (2 + 1) = 1 : 3
$$
두 삼각형 $\triangle EBD$와 $\triangle ABD$는 밑변 $\overline{BD}$를 공유하므로 넓이의 비는 높이의 비인 $\overline{EB} : \overline{AB}$와 같다.
$$
\triangle EBD = \frac{1}{3} \times \triangle ABD = \frac{1}{3} \times 150 = 50\text{ (cm}^2\text{)}
$$
따라서 정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "RHOMBUS_DIAGONAL_AREA_SEGMENT_RATIO",
  "primaryMethod": "대각선 수직이등분 성질로 삼각넓이를 구한 후 선분 분할비로 부분 넓이를 계산한다.",
  "decisiveStep": "[ABD] = 150 산출 후 비례배분 150 * 1/3 = 50 도출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "여러 가지 사각형",
    "l4": "마름모의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RHOMBUS_AREA_RATIO",
    "templateKey": "TPL_RHOMBUS_SIDE_RATIO_TRIANGLE_AREA",
    "why": "마름모의 대각선 성질과 삼각형 높이 비를 결합한 넓이 계산 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_AREA"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "마름모 대각선 수직이등분과 높이 비례식을 순차적으로 적용하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "마름모",
      "대각선"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 $\angle B$의 이등분선이 변 $AD$와 만나는 점을 $F$, 변 $CD$의 연장선과 만나는 점을 $E$라 하자. $\overline{AB} = 10\text{ cm}$, $\overline{AD} = 15\text{ cm}$일 때, 선분 $DE$의 길이는? [4점]
### 선지
① $1\text{ cm}$
② $2\text{ cm}$
③ $3\text{ cm}$
④ $4\text{ cm}$
⑤ $5\text{ cm}$
### 정답
⑤
### 해설
1. 평행사변형에서 $\overline{AD} \parallel \overline{BC}$이므로 엇각의 크기는 같다.
$$
\angle AFB = \angle FBC
$$
선분 $BF$가 $\angle B$의 이등분선이므로 $\angle ABF = \angle FBC$이다.
따라서 $\angle ABF = \angle AFB$이므로 $\triangle ABF$는 이등변삼각형이다.
$$
\overline{AF} = \overline{AB} = 10\text{ (cm)}
$$
2. $\overline{AD} = 15\text{ cm}$이므로
$$
\overline{FD} = \overline{AD} - \overline{AF} = 15 - 10 = 5\text{ (cm)}
$$
3. $\overline{AB} \parallel \overline{DE}$이므로 두 삼각형 $\triangle ABF$와 $\triangle DEF$는 닮음이다 (AA 닮음).
$$
\triangle ABF \sim \triangle DEF
$$
대응변의 길이의 비는 같으므로
$$
\overline{AB} : \overline{DE} = \overline{AF} : \overline{FD}
$$
$$
10 : \overline{DE} = 10 : 5 \implies \overline{DE} = 5\text{ (cm)}
$$
따라서 정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLELOGRAM_ANGLE_BISECTOR_SIMILARITY",
  "primaryMethod": "평행선과 각 이등분선으로 이등변삼각형을 찾고 평행선 닮음비를 적용하여 선분 길이를 구한다.",
  "decisiveStep": "AF = 10, FD = 5 구한 뒤 닮음비 10:5에서 DE = 5 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "평행사변형",
    "l4": "평행사변형의 성질의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PARALLELOGRAM_BISECTOR",
    "templateKey": "TPL_PARALLELOGRAM_ANGLE_BISECTOR_SIMILARITY",
    "why": "평행사변형 각 이등분선과 맞꼭지각/엇각 닮음을 결합한 응용 유형"
  },
  "crossConceptKeys": [
    "CC_ISOSCELES_TRIANGLE",
    "CC_SIMILAR_TRIANGLES"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이등변삼각형 발견과 모래시계형 닮음비의 2단계 기하적 추론을 요구하는 상위 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행사변형",
      "닮음"
    ],
    "goal": [
      "비례식"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
두 삼각형 $ABC$와 $DEF$가 서로 닮은 도형이고, 대응하는 변의 길이의 비가 $\overline{AB} : \overline{DE} = 3 : 4$이다. $\triangle ABC$의 넓이가 $36\text{ cm}^2$일 때, $\triangle DEF$의 넓이는? [4점]
### 선지
① $60\text{ cm}^2$
② $64\text{ cm}^2$
③ $68\text{ cm}^2$
④ $72\text{ cm}^2$
⑤ $76\text{ cm}^2$
### 정답
②
### 해설
두 닮은 평면도형에서 넓이의 비는 닮음비의 제곱의 비와 같다.
닮음비가 $3 : 4$이므로 넓이의 비는
$$
3^2 : 4^2 = 9 : 16
$$
삼각형 $DEF$의 넓이를 $S$라 하면
$$
36 : S = 9 : 16
$$
외항의 곱과 내항의 곱을 비교하면
$$
9S = 36 \times 16 \implies S = 4 \times 16 = 64\text{ (cm}^2\text{)}
$$
따라서 $\triangle DEF$의 넓이는 $64\text{ cm}^2$이다.
정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILARITY_BASIC",
  "conceptClusterKey": "SIMILAR_FIGURES_AREA_RATIO",
  "primaryMethod": "닮음비 m:n으로부터 넓이의 비 m^2:n^2을 구하고 비례식을 세운다.",
  "decisiveStep": "넓이비 9:16 적용하여 S = 36 * 16/9 = 64 산출",
  "rpm": {
    "majorUnit": "도형의 닮음",
    "midUnit": "도형의 닮음",
    "l3": "닮은 도형의 성질",
    "l4": "닮은 평면도형의 넓이의 비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SIMILAR_AREA_RATIO",
    "templateKey": "TPL_SIMILAR_TRIANGLES_AREA_RATIO",
    "why": "닮음비의 제곱이 넓이비가 됨을 이용하는 대표 유형"
  },
  "crossConceptKeys": [
    "CC_RATIO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "닮음비와 넓이비의 제곱 관계를 적용하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "닮음"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
그림과 같이 세 점 $A, B, C$가 순서대로 변 위에 있고 $\overline{AD} = \overline{DB} = \overline{BC}$이다. $\angle ADE = 84^\circ$일 때, $\angle ACD$의 크기는? [4점]
### 선지
① $22^\circ$
② $24^\circ$
③ $26^\circ$
④ $28^\circ$
⑤ $30^\circ$
### 정답
④
### 해설
구하고자 하는 각의 크기를 $\angle ACD = x$라 하자.
1. $\triangle BCD$에서 $\overline{BC} = \overline{BD}$이므로 이등변삼각형이다.
$$
\angle BDC = \angle BCD = x
$$
삼각형의 외각의 성질에 의하여
$$
\angle ABD = \angle BCD + \angle BDC = x + x = 2x
$$
2. $\triangle ADB$에서 $\overline{AD} = \overline{DB}$이므로 이등변삼각형이다.
$$
\angle BAD = \angle ABD = 2x
$$
3. $\triangle ACD$에서 외각 $\angle ADE$의 크기는 이웃하지 않는 두 내각의 크기의 합과 같다.
$$
\angle ADE = \angle CAD + \angle ACD = 2x + x = 3x
$$
조건에서 $\angle ADE = 84^\circ$이므로
$$
3x = 84^\circ \implies x = 28^\circ
$$
따라서 $\angle ACD = 28^\circ$이다.
정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 12,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "CHAINED_ISOSCELES_EXTERIOR_ANGLE",
  "primaryMethod": "연쇄 이등변삼각형에서 외각의 성질을 단계적으로 적용하여 3x = 84도를 푼다.",
  "decisiveStep": "외각 성질 누적 각ADE = 3x = 84도로부터 x = 28도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "이등변삼각형",
    "l4": "이등변삼각형의 성질의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ISOSCELES_CHAIN_ANGLES",
    "templateKey": "TPL_ISOSCELES_EXTERIOR_ANGLE_SUM",
    "why": "연속된 이등변삼각형에서 외각을 전파시켜 각도를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_EXTERIOR_ANGLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외각 성질을 2차례 연속 적용하여 관계식을 수립해야 하는 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "이등변삼각형",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 $\overline{AB} = 15\text{ cm}$, $\overline{AD} = 22\text{ cm}$이다. $\angle A$의 이등분선과 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하고, 점 $B, F, E, C$가 순서대로 놓여 있을 때, 선분 $FE$의 길이는? [4점]
### 선지
① $8\text{ cm}$
② $9\text{ cm}$
③ $10\text{ cm}$
④ $11\text{ cm}$
⑤ $12\text{ cm}$
### 정답
①
### 해설
평행사변형의 대변의 길이는 같으므로
$$
\overline{BC} = \overline{AD} = 22\text{ (cm)}, \quad \overline{CD} = \overline{AB} = 15\text{ (cm)}
$$
1. $\overline{AD} \parallel \overline{BC}$이고 선분 $AE$가 $\angle A$의 이등분선이므로 엇각에 의해
$$
\angle BAE = \angle EAD = \angle AEB
$$
따라서 $\triangle ABE$는 이등변삼각형이다.
$$
\overline{BE} = \overline{AB} = 15\text{ (cm)}
$$
2. 마찬가지로 선분 $DF$가 $\angle D$의 이등분선이므로 엇각에 의해 $\triangle DCF$는 이등변삼각형이다.
$$
\overline{CF} = \overline{CD} = 15\text{ (cm)}
$$
3. 점 $B, F, C$가 한 직선 위에 있으므로
$$
\overline{BF} = \overline{BC} - \overline{CF} = 22 - 15 = 7\text{ (cm)}
$$
점 $B, F, E$가 순서대로 놓여 있으므로
$$
\overline{FE} = \overline{BE} - \overline{BF} = 15 - 7 = 8\text{ (cm)}
$$
따라서 정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLELOGRAM_DUAL_ANGLE_BISECTORS_OVERLAP",
  "primaryMethod": "두 각 이등분선에 의해 생기는 두 이등변삼각형의 밑변을 구하고 겹치는 길이를 계산한다.",
  "decisiveStep": "BE = 15, BF = 7 산출 후 FE = 15 - 7 = 8 도출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "평행사변형",
    "l4": "평행사변형의 성질의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PARALLELOGRAM_DUAL_BISECTORS",
    "templateKey": "TPL_PARALLELOGRAM_OVERLAPPING_SEGMENT",
    "why": "두 내각의 이등분선이 만드는 이등변삼각형의 겹침 길이를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_ISOSCELES_TRIANGLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선과 각 이등분선의 대칭적 성질을 선분 연산에 적용하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "평행사변형",
      "이등변삼각형"
    ],
    "goal": [
      "사칙연산"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
여러 가지 사각형 사이의 관계에서 한 단계 더 특별한 사각형이 되기 위한 추가 조건으로 옳은 것은? [4점]
### 선지
① 평행사변형이 직사각형이 되려면 두 대각선이 서로 수직이어야 한다.
② 평행사변형이 마름모가 되려면 한 내각의 크기가 $90^\circ$이어야 한다.
③ 마름모가 정사각형이 되려면 두 대각선의 길이가 같아야 한다.
④ 사다리꼴이 평행사변형이 되려면 한 쌍의 대변의 길이가 같아야 한다.
⑤ 직사각형이 정사각형이 되려면 두 대각선이 서로 다른 것을 이등분해야 한다.
### 정답
③
### 해설
여러 가지 사각형의 정의와 대각선의 성질을 비교한다.
① 평행사변형의 두 대각선이 서로 수직이면 직사각형이 아니라 마름모가 된다. (거짓)
② 평행사변형의 한 내각의 크기가 $90^\circ$이면 마름모가 아니라 직사각형이 된다. (거짓)
③ 마름모는 네 변의 길이가 같고 대각선이 수직이등분한다. 여기에 '두 대각선의 길이가 같다'는 직사각형의 성질이 추가되면 네 각도 모두 같아져 정사각형이 된다. (참)
④ 사다리꼴에서 평행하지 않은 한 쌍의 대변의 길이가 같으면 등변사다리꼴이 될 수 있으므로 평행사변형이 되지 않는다. (거짓)
⑤ 직사각형은 이미 두 대각선이 서로 다른 것을 이등분하므로, 이 조건만으로 정사각형이 되지 않는다. (거짓)


따라서 옳은 것은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 14,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "SPECIAL_QUADRILATERAL_INCLUSION_CONDITIONS",
  "primaryMethod": "각 사각형의 정의와 대각선 성질을 비교하여 상위 사각형으로의 전이 조건을 판별한다.",
  "decisiveStep": "마름모에 대각선 길이 일치 조건 추가 시 정사각형 성립 확인",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "여러 가지 사각형",
    "l4": "여러 가지 사각형 사이의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_QUADRILATERAL_HIERARCHY",
    "templateKey": "TPL_QUADRILATERAL_TRANSFORMATION_CONDITIONS",
    "why": "사각형의 포함 관계와 변환 추가 조건을 판정하는 유형"
  },
  "crossConceptKeys": [
    "CC_RHOMBUS",
    "CC_SQUARE"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사각형의 대각선 성질 상호 호환성을 정확히 이해해야 하는 개념 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "마름모",
      "직사각형",
      "정사각형"
    ],
    "goal": [
      "대각선"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음 중 사각형 $ABCD$가 항상 평행사변형이 된다고 할 수 없는 조건은? (단, 점 $O$는 두 대각선의 교점이다.) [4점]
### 선지
① $\overline{AB} \parallel \overline{DC},\; \overline{AD} \parallel \overline{BC}$
② $\angle A = \angle C,\; \angle B = \angle D$
③ $\overline{AB} = \overline{DC},\; \overline{AD} = \overline{BC}$
④ $\overline{OA} = \overline{OC},\; \overline{OB} = \overline{OD}$
⑤ $\overline{AD} \parallel \overline{BC},\; \overline{AB} = \overline{DC}$
### 정답
⑤
### 해설
평행사변형이 되기 위한 5가지 조건은 다음과 같다.
1. 두 쌍의 대변이 각각 평행하다. (①)
2. 두 쌍의 대각의 크기가 각각 같다. (②)
3. 두 쌍의 대변의 길이가 각각 같다. (③)
4. 두 대각선이 서로 다른 것을 이등분한다. (④)
5. 한 쌍의 대변이 평행하고 그 길이가 같다.


⑤의 경우 한 쌍의 대변($\overline{AD}, \overline{BC}$)이 평행하지만, 길이가 같은 변은 다른 한 쌍($\overline{AB}, \overline{DC}$)이다.
이 조건은 평행하지 않은 두 변의 길이가 같은 등변사다리꼴도 만족하므로 항상 평행사변형이 되는 것은 아니다.


따라서 정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLELOGRAM_DETERMINATION_COUNTEREXAMPLE",
  "primaryMethod": "평행사변형의 5대 결정조건을 대조하고 등변사다리꼴 반례를 판별한다.",
  "decisiveStep": "한 쌍 평행, 다른 한 쌍 등장 조건은 등변사다리꼴 반례 존재 확인",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "평행사변형",
    "l4": "평행사변형이 되는 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PARALLELOGRAM_CONDITIONS",
    "templateKey": "TPL_PARALLELOGRAM_CRITERIA_AUDIT",
    "why": "평행사변형이 되기 위한 조건과 등변사다리꼴 반례를 감별하는 유형"
  },
  "crossConceptKeys": [
    "CC_TRAPEZOID"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행사변형 조건의 대표적 오답 함정을 판정하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "사각형",
      "평행사변형"
    ],
    "goal": [
      "평행사변형"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q16
- 형식: 객관식
- 배점: 5
### 발문
다음 보기에서 옳은 것만을 있는 대로 고른 것은? [5점]


$$
\begin{aligned}
&\text{ㄱ. 두 대각선이 서로 수직인 평행사변형은 마름모이다.} \\
&\text{ㄴ. 두 대각선의 길이가 같은 평행사변형은 직사각형이다.} \\
&\text{ㄷ. 이웃하는 두 변의 길이가 같은 직사각형은 정사각형이다.} \\
&\text{ㄹ. 두 대각선이 서로 수직인 사각형은 마름모이다.}
\end{aligned}
$$
### 선지
① ㄱ, ㄴ
② ㄱ, ㄴ, ㄷ
③ ㄱ, ㄷ, ㄹ
④ ㄴ, ㄷ, ㄹ
⑤ ㄱ, ㄴ, ㄷ, ㄹ
### 정답
②
### 해설
보기의 각 명제를 판별한다.
ㄱ. 평행사변형의 두 대각선이 서로 수직이면 네 변의 길이가 같아지므로 마름모가 된다. (참)
ㄴ. 평행사변형의 두 대각선의 길이가 같으면 네 내각의 크기가 모두 $90^\circ$가 되므로 직사각형이다. (참)
ㄷ. 직사각형의 이웃하는 두 변의 길이가 같으면 네 변의 길이가 모두 같아지므로 정사각형이다. (참)
ㄹ. 두 대각선이 서로 수직이더라도 서로를 이등분하지 않으면 마름모가 아니다 (예: 연꼴 또는 대각선이 수직으로 교차하는 일반 사각형). 따라서 거짓이다.


따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.
정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "QUADRILATERAL_PROPERTIES_TRUTH_VERIFICATION",
  "primaryMethod": "사각형의 대각선 성질 및 변/각 조건에 따른 도형 분류의 참/거짓을 종합 검증한다.",
  "decisiveStep": "ㄹ의 반례(연꼴) 확인 및 ㄱ, ㄴ, ㄷ의 참 판정",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "여러 가지 사각형",
    "l4": "여러 가지 사각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_QUADRILATERAL_PROPOSITIONS",
    "templateKey": "TPL_QUADRILATERAL_TRUTH_TABLE",
    "why": "다양한 사각형 명제의 참과 거짓을 종합 판정하는 복합 합답형 유형"
  },
  "crossConceptKeys": [
    "CC_RHOMBUS",
    "CC_RECTANGLE",
    "CC_SQUARE"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여러 사각형의 대각선 성질과 정의를 다각도로 비교 검증해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "평행사변형",
      "마름모",
      "직사각형",
      "정사각형"
    ],
    "goal": [
      "대각선"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q17
- 형식: 객관식
- 배점: 5
### 발문
점 $I$는 $\triangle ABC$의 내심이다. $\triangle ABC$의 세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$일 때, $\angle BIC$의 크기는? [5점]
### 선지
① $105^\circ$
② $110^\circ$
③ $115^\circ$
④ $120^\circ$
⑤ $125^\circ$
### 정답
①
### 해설
삼각형의 세 내각의 크기의 합은 $180^\circ$이다.
$\angle A : \angle B : \angle C = 1 : 2 : 3$이므로 비례배분에 의해 $\angle A$의 크기를 구한다.
$$
\angle A = 180^\circ \times \frac{1}{1 + 2 + 3} = 180^\circ \times \frac{1}{6} = 30^\circ
$$
내심 $I$에서 두 꼭짓점 $B, C$를 잇는 각 $\angle BIC$의 크기는 다음과 같다.
$$
\angle BIC = 90^\circ + \frac{1}{2}\angle A
$$
$\angle A = 30^\circ$를 대입하면
$$
\angle BIC = 90^\circ + \frac{1}{2} \times 30^\circ = 90^\circ + 15^\circ = 105^\circ
$$
따라서 정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "INCENTER_ANGLE_FORMULA_FROM_ANGLE_RATIO",
  "primaryMethod": "내각 비례배분으로 꼭지각 A를 구한 후 공식 각BIC = 90 + A/2를 적용한다.",
  "decisiveStep": "각A = 30도 도출 후 각BIC = 90 + 15 = 105도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "삼각형의 내심과 외심",
    "l4": "삼각형의 내심의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INCENTER_BIC_ANGLE",
    "templateKey": "TPL_INCENTER_ANGLE_FORMULA_CALCULATION",
    "why": "비례배분과 내심 공식 각BIC = 90 + A/2를 결합한 유형"
  },
  "crossConceptKeys": [
    "CC_RATIO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비례배분과 기본 내심 공식을 바로 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "내심"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
$\triangle ABC$에서 $\angle A = 70^\circ$이고, 점 $O$가 $\triangle ABC$의 외심일 때, $\angle BOC$의 크기는? [5점]
### 선지
① $110^\circ$
② $120^\circ$
③ $130^\circ$
④ $140^\circ$
⑤ $150^\circ$
### 정답
④
### 해설
삼각형의 외심 $O$에서 두 꼭짓점 $B, C$를 잇는 중심각 $\angle BOC$의 크기는 꼭지각 $\angle A$의 크기의 $2$배이다.
$$
\angle BOC = 2\angle A
$$
주어진 조건에서 $\angle A = 70^\circ$이므로
$$
\angle BOC = 2 \times 70^\circ = 140^\circ
$$
따라서 정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "CIRCUMCENTER_CENTRAL_ANGLE_RELATION",
  "primaryMethod": "외심의 성질인 각BOC = 2각A 공식을 적용하여 각의 크기를 구한다.",
  "decisiveStep": "각BOC = 2 * 70 = 140도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "삼각형의 내심과 외심",
    "l4": "삼각형의 외심의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CIRCUMCENTER_BOC_ANGLE",
    "templateKey": "TPL_CIRCUMCENTER_DOUBLE_ANGLE",
    "why": "외심의 각BOC = 2각A 관계를 이용하는 유형"
  },
  "crossConceptKeys": [
    "CC_CIRCUMCENTER"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외심의 중심각과 원주각 성질을 적용하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "외심"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q19
- 형식: 객관식
- 배점: 5
### 발문
원뿔 모양의 그릇에 일정한 속력으로 물을 채우고 있다. 물의 높이가 전체 높이의 $\dfrac{1}{2}$이 될 때까지 물을 채우는 데 $5$분이 걸렸다면, 이 그릇에 물을 가득 채울 때까지 앞으로 몇 분이 더 걸리겠는가? (단, 그릇의 두께는 생각하지 않는다.) [5점]
### 선지
① $25\text{분}$
② $30\text{분}$
③ $35\text{분}$
④ $40\text{분}$
⑤ $45\text{분}$
### 정답
③
### 해설
1. 물이 채워진 작은 원뿔과 전체 원뿔은 서로 닮은 입체도형이다.
물의 높이가 전체 높이의 $\dfrac{1}{2}$이므로 닮음비는
$$
1 : 2
$$
2. 닮은 입체도형에서 부피의 비는 닮음비의 세제곱의 비와 같다.
$$
1^3 : 2^3 = 1 : 8
$$
3. 현재 채워진 물의 부피는 전체 부피의 $\dfrac{1}{8}$이므로, 앞으로 더 채워야 하는 물의 부피는 전체의
$$
8 - 1 = 7\text{배}
$$
이다.
4. 물을 채우는 속력이 일정하므로 걸리는 시간은 채우는 부피에 정비례한다.
따라서 앞으로 더 걸리는 시간은
$$
5 \times 7 = 35\text{ (분)}
$$
정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILARITY_BASIC",
  "conceptClusterKey": "SIMILAR_SOLID_VOLUME_RATIO_WATER_TIME",
  "primaryMethod": "닮음비 1:2로부터 부피비 1:8을 도출하고 잔여 부피 7배에 필요한 추가 시간을 계산한다.",
  "decisiveStep": "부피비 1:8에서 잔여비 7배 확인 후 5 * 7 = 35분 산출",
  "rpm": {
    "majorUnit": "도형의 닮음",
    "midUnit": "도형의 닮음",
    "l3": "닮은 도형의 성질",
    "l4": "닮은 입체도형의 부피의 비의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SIMILAR_VOLUME_TIME",
    "templateKey": "TPL_CONE_WATER_FILLING_TIME",
    "why": "입체도형 닮음의 부피비 세제곱 법칙을 시간 계산에 적용하는 심화 유형"
  },
  "crossConceptKeys": [
    "CC_VOLUME_RATIO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부피비의 3제곱 관계와 전체-현재의 잔여 비율 계산을 결합한 변별력 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원뿔",
      "닮음"
    ],
    "goal": [
      "부피"
    ],
    "method": [
      "비례식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q20
- 형식: 객관식
- 배점: 5
### 발문
정사각형 $ABCD$의 꼭짓점 $B$를 지나는 직선과 변 $CD$가 만나는 점을 $E$라 하자. 두 꼭짓점 $A, C$에서 직선 $BE$에 내린 수선의 발을 각각 $F, G$라 할 때, $\overline{AF} = 15\text{ cm}$, $\overline{CG} = 9\text{ cm}$이다. 점 $B, F, G$가 순서대로 놓여 있을 때, $\triangle AFG$의 넓이는? [5점]
### 선지
① $27\text{ cm}^2$
② $30\text{ cm}^2$
③ $36\text{ cm}^2$
④ $40\text{ cm}^2$
⑤ $45\text{ cm}^2$
### 정답
⑤
### 해설
1. 직각삼각형 $ABF$와 $BCG$의 합동 증명:
정사각형 $ABCD$이므로
$$
\overline{AB} = \overline{BC}, \quad \angle ABC = 90^\circ
$$
$\overline{AF} \perp \overline{BE}$, $\overline{CG} \perp \overline{BE}$이므로
$$
\angle AFB = \angle BGC = 90^\circ
$$
직각삼각형 $ABF$에서 $\angle BAF + \angle ABF = 90^\circ$이다.
또한 $\angle ABC = 90^\circ$이므로 $\angle CBG + \angle ABF = 90^\circ$이다.
따라서
$$
\angle BAF = \angle CBG
$$
빗변의 길이가 같고 한 예각의 크기가 같으므로
$$
\triangle ABF \cong \triangle BCG \quad (\text{RHA 합동})
$$


2. 선분 $FG$의 길이 계산:
합동인 두 삼각형의 대응변의 길이는 같으므로
$$
\overline{BF} = \overline{CG} = 9\text{ (cm)}, \quad \overline{BG} = \overline{AF} = 15\text{ (cm)}
$$
세 점 $B, F, G$가 순서대로 놓여 있으므로
$$
\overline{FG} = \overline{BG} - \overline{BF} = 15 - 9 = 6\text{ (cm)}
$$


3. $\triangle AFG$의 넓이:
$\overline{AF} \perp \overline{FG}$이므로
$$
\triangle AFG = \frac{1}{2} \times \overline{FG} \times \overline{AF} = \frac{1}{2} \times 6 \times 15 = 45\text{ (cm}^2\text{)}
$$
따라서 정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "SQUARE_RIGHT_TRIANGLES_RHA_CONGRUENCE",
  "primaryMethod": "정사각형 꼭짓점에서 내린 수선으로 RHA 합동을 증명하고 밑변 길이를 구해 삼각형 넓이를 계산한다.",
  "decisiveStep": "합동으로 BF=9, BG=15 도출 후 FG=6, [AFG]=1/2*6*15=45 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "직각삼각형의 합동 조건",
    "l4": "직각삼각형의 합동 조건의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RIGHT_TRIANGLE_CONGRUENCE",
    "templateKey": "TPL_SQUARE_INTERNAL_RIGHT_TRIANGLES_AREA",
    "why": "정사각형 내부 직각삼각형의 RHA 합동을 이용한 넓이 도출 심화 유형"
  },
  "crossConceptKeys": [
    "CC_RHA_CONGRUENCE",
    "CC_SQUARE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직각삼각형 RHA 합동 증명과 선분 차이를 통한 넓이 계산의 다단계 복합 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "정사각형",
      "합동"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q21
- 형식: 서술형
- 배점: 5
### 발문
[서술형 1] $\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB, AC$에 내린 수선의 발을 각각 $D, E$라 하자. $\overline{DM} = \overline{EM}$이고 $\angle A = 72^\circ$일 때, $\angle BMD$의 크기를 구하고, 그 풀이 과정을 서술하시오. [5점]
### 정답
$36^\circ$
### 해설
[풀이 과정]
1단계: 직각삼각형의 합동 증명
점 $M$이 선분 $BC$의 중점이므로
$$
\overline{BM} = \overline{CM}
$$
$\overline{MD} \perp \overline{AB}$, $\overline{ME} \perp \overline{AC}$이므로
$$
\angle BDM = \angle CEM = 90^\circ
$$
조건에서 $\overline{DM} = \overline{EM}$이다.
직각삼각형 $BDM$과 직각삼각형 $CEM$에서
- 빗변의 길이가 같다: $\overline{BM} = \overline{CM}$
- 한 직각변의 길이가 같다: $\overline{DM} = \overline{EM}$
따라서 두 직각삼각형은 합동이다 (RHS 합동).
$$
\triangle BDM \cong \triangle CEM \quad (\text{RHS 합동})
$$


2단계: 밑각 $\angle B$의 크기 구하기
합동인 두 삼각형에서 대응각의 크기는 서로 같으므로
$$
\angle B = \angle C
$$
따라서 $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이다.
$\angle A = 72^\circ$이므로
$$
\angle B = \frac{180^\circ - 72^\circ}{2} = \frac{108^\circ}{2} = 54^\circ
$$


3단계: $\angle BMD$의 크기 구하기
직각삼각형 $BDM$에서 세 내각의 합은 $180^\circ$이므로
$$
\angle BMD = 180^\circ - \angle BDM - \angle B = 180^\circ - 90^\circ - 54^\circ = 36^\circ
$$
따라서 구하는 각의 크기는 $36^\circ$이다.


답: 36°
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "RHS_CONGRUENCE_ISOSCELES_ANGLE_PROOF",
  "primaryMethod": "중점 수선으로부터 RHS 합동을 증명하여 이등변삼각형 밑각을 구한 후 직각삼각형 내각을 계산한다.",
  "decisiveStep": "RHS 합동으로 각B=54도 도출 후 각BMD = 90 - 54 = 36도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "직각삼각형의 합동 조건",
    "l4": "RHS 합동의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RHS_CONGRUENCE_PROOF",
    "templateKey": "TPL_RHS_ISOSCELES_ANGLE_DERIVATION",
    "why": "RHS 합동 증명과 이등변삼각형 성질을 결합한 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_RHS_CONGRUENCE",
    "CC_ISOSCELES_TRIANGLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직각삼각형 합동 조건 서술과 이등변삼각형 유도 과정을 단계별로 작성해야 하는 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "이등변삼각형",
      "합동"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 7
### 발문
[서술형 2] 마름모 $ABCD$에서 대각선 $AC$의 중점을 $O$라 하고, 변 $AB$ 위의 점 $E$와 변 $CD$ 위의 점 $F$에 대하여 선분 $EF$가 점 $O$를 지나며 $\overline{AC} = \overline{EF}$를 만족한다. $\angle EAO = 50^\circ$일 때, 다음 물음에 답하고 그 풀이 과정을 서술하시오. [총 7점]
(1) 사각형 $AECF$가 직사각형인 이유를 서술하시오. [5점]
(2) $\angle CEF$의 크기를 구하시오. [2점]
### 정답
(1) 풀이 참조 / (2) $40^\circ$
### 해설
[풀이 과정]
(1) 사각형 $AECF$가 직사각형인 이유:
1. 마름모 $ABCD$에서 대변이 평행하므로 $\overline{AB} \parallel \overline{CD}$이며, 따라서 $\overline{AE} \parallel \overline{CF}$이다.
2. 점 $O$는 선분 $AC$의 중점이므로 $\overline{AO} = \overline{CO}$이다.
3. $\overline{AE} \parallel \overline{CF}$에 의해 엇각의 크기가 같으므로 $\angle OAE = \angle OCF$이다.
또한 맞꼭지각의 크기가 같으므로 $\angle AOE = \angle COF$이다.
따라서 한 변의 길이와 그 양 끝 각의 크기가 각각 같으므로
$$
\triangle AOE \cong \triangle COF \quad (\text{ASA 합동})
$$
합동이므로 대응변 $\overline{OE} = \overline{OF}$이다.
4. 사각형 $AECF$에서 두 대각선 $AC, EF$가 점 $O$에서 서로 다른 것을 이등분하므로 사각형 $AECF$는 평행사변형이다.
5. 문제의 조건에서 두 대각선의 길이가 $\overline{AC} = \overline{EF}$로 같으므로, 사각형 $AECF$는 두 대각선의 길이가 같은 평행사변형, 즉 직사각형이다.


(2) $\angle CEF$의 크기 구하기:
사각형 $AECF$가 직사각형이므로
$$
\angle AEC = 90^\circ
$$
직사각형의 두 대각선은 길이가 같고 서로를 이등분하므로
$$
\overline{OA} = \overline{OE}
$$
따라서 $\triangle AOE$는 이등변삼각형이므로
$$
\angle AEF = \angle EAO = 50^\circ
$$
그러므로 구하는 각의 크기는
$$
\angle CEF = \angle AEC - \angle AEF = 90^\circ - 50^\circ = 40^\circ
$$
이다.


답: (1) 풀이 참조, (2) 40°
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES",
  "conceptClusterKey": "PARALLELOGRAM_TO_RECTANGLE_DIAGONAL_PROOF",
  "primaryMethod": "합동으로 평행사변형임을 증명한 뒤 대각선의 길이가 같음을 적용하여 직사각형임을 논증하고 각을 구한다.",
  "decisiveStep": "ASA 합동 -> 평행사변형 -> 대각선 길이 일치로 직사각형 증명 후 90 - 50 = 40도 산출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "사각형의 성질",
    "l3": "여러 가지 사각형",
    "l4": "직사각형이 되는 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RECTANGLE_PROOF",
    "templateKey": "TPL_QUADRILATERAL_PROPERTIES_STEPWISE_PROOF",
    "why": "평행사변형 조건과 직사각형 조건의 단계적 증명을 요구하는 고난도 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_PARALLELOGRAM",
    "CC_RECTANGLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "엄밀한 합동 증명, 평행사변형 판정, 직사각형 판정의 3단계 논증 과정을 완성해야 하는 최고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "마름모",
      "직사각형",
      "합동"
    ],
    "goal": [
      "대각선",
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 8
### 발문
[서술형 3] 삼각형 $ABC$의 외심을 $O$라 하고, 삼각형 $ABO$의 외심과 내심을 각각 점 $O', I$라 하자. 선분 $AI, AO, AC$가 순서대로 놓여 있고 $\angle OAC = x$, $\angle BAI = y$일 때, 다음 물음에 답하고 그 과정을 서술하시오. [총 8점]
(1) $\angle IAC$의 크기를 $x, y$를 사용하여 나타내시오. [4점]
(2) $\angle IAO' = 15^\circ$일 때, $y$의 값을 구하시오. [4점]
### 정답
(1) $x + y$ / (2) $35^\circ$
### 해설
[풀이 과정]
(1) $\angle IAC$의 크기 나타내기:
점 $I$는 $\triangle ABO$의 내심이므로 선분 $AI$는 $\angle BAO$의 이등분선이다.
따라서
$$
\angle BAI = \angle IAO = y
$$
선분 $AI, AO, AC$가 순서대로 놓여 있으므로 $\angle IAC$는 $\angle IAO$와 $\angle OAC$의 합이다.
$$
\angle IAC = \angle IAO + \angle OAC = y + x = x + y
$$


(2) $y$의 값 구하기:
1. 점 $O$는 $\triangle ABC$의 외심이므로 $\overline{OA} = \overline{OB}$이다.
따라서 $\triangle AOB$는 이등변삼각형이다.
$\angle BAO = 2y$이므로
$$
\angle ABO = \angle BAO = 2y
$$
$$
\angle AOB = 180^\circ - 4y
$$
2. 점 $O'$는 $\triangle ABO$의 외심이므로 $\overline{O'A} = \overline{O'B} = \overline{O'O}$이다.
점 $O'$는 선분 $AB$의 수직이등분선이자 꼭지각 $\angle AOB$의 이등분선 위에 놓인다.
$$
\angle BOO' = \frac{1}{2}\angle AOB = \frac{180^\circ - 4y}{2} = 90^\circ - 2y
$$
$\triangle OBO'$에서 $\overline{O'B} = \overline{O'O}$이므로 이등변삼각형이고
$$
\angle OBO' = \angle BOO' = 90^\circ - 2y
$$
따라서
$$
\angle ABO' = \angle ABO - \angle OBO' = 2y - (90^\circ - 2y) = 4y - 90^\circ
$$
3. $\triangle ABO'$에서 $\overline{O'A} = \overline{O'B}$이므로 이등변삼각형이다.
$$
\angle BAO' = \angle ABO' = 4y - 90^\circ
$$
4. $\angle IAO'$의 크기는 $\angle BAO'$와 $\angle BAI$의 차이이므로
$$
\angle IAO' = \angle BAO' - \angle BAI = (4y - 90^\circ) - y = 3y - 90^\circ
$$
조건에서 $\angle IAO' = 15^\circ$이므로
$$
3y - 90^\circ = 15^\circ \implies 3y = 105^\circ \implies y = 35^\circ
$$
따라서 $y$의 값은 $35^\circ$이다.


답: (1) x + y, (2) 35°
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-05",
  "subUnitKey": "M2-05-TRIANGLE_PROPERTIES",
  "conceptClusterKey": "NESTED_CIRCUMCENTER_INCENTER_ANGLES",
  "primaryMethod": "외심과 내심의 정의에 따른 각 이등분 및 이등변삼각형 밑각 관계를 연쇄적으로 수립하여 방정식을 푼다.",
  "decisiveStep": "각IAO prime = 3y - 90 = 15도로부터 3y = 105, y = 35도 도출",
  "rpm": {
    "majorUnit": "도형의 성질",
    "midUnit": "삼각형의 성질",
    "l3": "삼각형의 내심과 외심",
    "l4": "내심과 외심의 성질의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_NESTED_CENTERS_ANGLES",
    "templateKey": "TPL_INCENTER_CIRCUMCENTER_NESTED_EQUATION",
    "why": "삼각형 내심과 외심이 중첩된 도형에서 각도 대수 방정식을 수립하는 최고난도 유형"
  },
  "crossConceptKeys": [
    "CC_CIRCUMCENTER",
    "CC_INCENTER"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외심과 내심의 기하학적 성질을 4단계에 걸쳐 추론해야 하는 변별력 최고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "삼각형",
      "외심",
      "내심"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```