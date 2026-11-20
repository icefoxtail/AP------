```json:exam
{
  "stem": "24_연향중_2학기_중간_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2mid/24_연향중_2학기_중간_중1_기출.js",
  "examFolder": "2mid",
  "grade": "중1",
  "curriculum": "2015",
  "questionCount": 22,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 4
### 발문
다음 기본도형에 대한 설명으로 옳은 것은? [4점]
### 선지
① 직선 $l$ 위의 서로 다른 두 점을 지나는 직선은 무수히 많다. ② 삼각형의 꼭짓점은 선과 선이 만나는 교점으로 $4$개이다. ③ 점, 선, 면은 입체도형과 평면도형을 구성하는 기본 요소이다. ④ 직육면체에서 면과 면이 만나서 생기는 교선의 개수는 $8$개이다. ⑤ 선분 $AB$의 연장선 위에 있는 점 $M$에 대하여 $\overline{AM}=\overline{MB}$이면 점 $M$을 선분 $AB$의 중점이라 한다.
### 정답
③
### 해설
기본도형의 구성 요소와 정의를 하나씩 확인한다.


$\begin{aligned} \text{① } & \text{서로 다른 두 점을 지나는 직선은 오직 하나뿐이다. (거짓)} \ \text{② } & \text{삼각형의 꼭짓점(교점)은 } 3\text{개이다. (거짓)} \ \text{③ } & \text{점, 선, 면은 모든 도형을 이루는 기본 요소이다. (참)} \ \text{④ } & \text{직육면체의 교선(모서리)의 개수는 } 12\text{개이다. (거짓)} \ \text{⑤ } & \text{중점 } M\text{은 선분 } AB\text{ '위'의 점이어야 하므로 연장선 위의 점은 중점이 될 수 없다. (거짓)} \end{aligned}$


따라서 옳은 것은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "기본도형의 개념 및 용어 정의에 대한 진위 판정 문항"
}

```


```json
{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "점, 선, 면의 정의와 교점, 교선의 개수를 기본 입체/평면도형과 대조하여 참인 진술을 판별한다.",
  "decisiveStep": "도형의 기본 요소인 점, 선, 면 정의 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "점, 선, 면"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_GEOMETRY_JUDGMENT",
    "templateKey": "TPL_M1_BASIC_GEOMETRY_JUDGMENT_BASIC_TERM_CLAIM_AUDIT",
    "why": "기본도형의 용어 정의와 교점, 교선의 성질을 묻는 기본 판별형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본도형의 정의와 용어 지식을 직접 대조하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "직육면체",
      "삼각형"
    ],
    "goal": [
      "교점",
      "교선"
    ],
    "method": [
      "정의"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q02
- 형식: 객관식
- 배점: 4
### 발문
어느 세 점도 한 직선 위에 있지 않은 서로 다른 다섯 점 $A$, $B$, $C$, $D$, $E$가 있다. 이 점들 중 두 점을 골라 만들 수 있는 서로 다른 반직선의 개수는? [4점]
### 선지
① $8$개 ② $10$개 ③ $12$개 ④ $15$개 ⑤ $20$개
### 정답
⑤
### 해설
반직선은 시작점과 뻗어나가는 방향(지나는 다른 한 점)에 의해 결정된다.


$\begin{aligned} \text{시작점이 될 수 있는 점의 개수} &= 5\text{개} \ \text{각 시작점에서 그을 수 있는 다른 방향의 점} &= 4\text{개} \ \text{구하는 반직선의 총 개수} &= 5 \times 4 \ &= 20\text{개} \end{aligned}$


따라서 정답은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "한 원 또는 평면 위의 5개 점에서 만들어지는 반직선의 개수를 구하는 조합 문항"
}

```


```json
{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "어느 세 점도 일직선 위에 있지 않은 5개 점에서 시작점 5개와 방향점 4개의 곱으로 반직선의 개수 20개를 계산한다.",
  "decisiveStep": "5 × 4 = 20개 산출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "직선·반직선·선분"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT",
    "templateKey": "TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_MULTI_OBJECT_COUNT",
    "why": "점들의 위치 조건에서 만들 수 있는 반직선의 개수를 세는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "시작점과 방향점의 순서쌍 개념을 적용하여 반직선 수를 곱의 법칙으로 구하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "점"
    ],
    "goal": [
      "반직선",
      "개수"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q03
- 형식: 객관식
- 배점: 4
### 발문
다음 그림과 같이 두 직선이 한 점에서 만날 때, 맞꼭지각의 크기가 각각 $2x+10^\circ$와 $70^\circ$이고, $70^\circ$와 이웃한 한 각의 크기가 $y^\circ$이다. 이때 $x+y$의 값은? [4점]
### 선지
① $120$ ② $130$ ③ $150$ ④ $140$ ⑤ $160$
### 정답
④
### 해설
맞꼭지각의 크기는 서로 같으므로 $\begin{aligned} 2x + 10 &= 70 \ 2x &= 60 \ x &= 30 \end{aligned}$


한 직선 위에서 이웃한 두 각의 합은 평각인 $180^\circ$이므로 $\begin{aligned} y + 70 &= 180 \ y &= 110 \end{aligned}$


따라서 구하는 $x+y$의 값은 $\begin{aligned} x + y &= 30 + 110 \ &= 140 \end{aligned}$


따라서 정답은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "두 직선이 한 점에서 교차하며 맞꼭지각 2x+10도, 70도와 이웃각 y도가 표시된 각 다이어그램"
}

```


```json
{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "맞꼭지각의 성질 2x+10=70에서 x=30을 구하고 평각의 성질 y=180-70=110을 구하여 합 140을 계산한다.",
  "decisiveStep": "x=30, y=110 도출 및 합산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "각",
    "l4": "맞꼭지각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_INTERSECTING_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_EQUATION",
    "why": "맞꼭지각과 평각의 일차방정식을 풀어 미지각의 합을 구하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "맞꼭지각의 일치와 평각 180도의 관계식을 연립하여 두 미지수를 각각 구하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "각"
    ],
    "goal": [
      "맞꼭지각",
      "평각"
    ],
    "method": [
      "일차방정식"
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
다음 그림에서 점 $M$은 선분 $AB$의 중점이고, 점 $N$은 선분 $AM$의 중점이다. $\overline{AB}=24,\mathrm{cm}$일 때, 선분 $NM$의 길이는? [4점]
### 선지
① $4,\mathrm{cm}$ ② $6,\mathrm{cm}$ ③ $8,\mathrm{cm}$ ④ $10,\mathrm{cm}$ ⑤ $12,\mathrm{cm}$
### 정답
②
### 해설
선분의 중점은 주어진 선분의 길이를 정확히 이등분한다.


점 $M$이 선분 $AB$의 중점이므로 $\begin{aligned} \overline{AM} &= \dfrac{1}{2}\overline{AB} \ &= \dfrac{1}{2} \times 24 \ &= 12,\mathrm{cm} \end{aligned}$


점 $N$이 선분 $AM$의 중점이므로 선분 $NM$의 길이는 $\begin{aligned} \overline{NM} &= \dfrac{1}{2}\overline{AM} \ &= \dfrac{1}{2} \times 12 \ &= 6,\mathrm{cm} \end{aligned}$


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "선분 AB 위에 점 M, N이 위치하고 중점 관계가 표시된 1차원 선분 다이어그램"
}

```


```json
{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "선분의 중점 관계를 순차적으로 적용하여 AM=12cm, NM=6cm를 산출한다.",
  "decisiveStep": "24cm를 2단계로 연속 반분하여 6cm 산출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "선분의 중점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SEGMENT_LENGTH_RELATIONS",
    "templateKey": "TPL_M1_SEGMENT_LENGTH_RELATIONS_CHAINED_MIDPOINT",
    "why": "선분의 연쇄 중점 성질을 이용해 부분 선분의 길이를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중점 정의를 2회 순차 적용하는 1단계 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "선분",
      "중점"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q05
- 형식: 객관식
- 배점: 5
### 발문
공간에서 서로 다른 직선 $l, m, n$과 서로 다른 평면 $P, Q, R$의 위치 관계에 대한 설명으로 항상 옳은 것은? [5점]
### 선지
① $l \parallel m$이고 $m \parallel n$이면 $l \parallel n$이다. ② $l \perp P$이고 $m \perp P$이면 $l \perp m$이다. ③ $P \perp Q$이고 $Q \perp R$이면 $P \parallel R$이다. ④ $l \parallel P$이고 $m \parallel P$이면 $l \parallel m$이다. ⑤ $l \perp m$이고 $m \perp n$이면 $l \parallel n$이다.
### 정답
①
### 해설
공간에서의 위치 관계를 직육면체의 모서리와 면을 모델로 검증한다.


$\begin{aligned} \text{① } & \text{한 직선에 평행한 서로 다른 두 직선은 항상 서로 평행하다. } (l \parallel m, m \parallel n \implies l \parallel n)\text{ (항상 참)} \ \text{② } & \text{한 평면에 수직인 서로 다른 두 직선은 서로 평행하다. } (l \parallel m)\text{ (거짓)} \ \text{③ } & \text{한 평면에 수직인 두 평면은 만날 수도 있다. (예: 직육면체의 인접한 두 옆면은 밑면에 모두 수직이지만 만남) (거짓)} \ \text{④ } & \text{한 평면에 평행한 두 직선은 한 점에서 만나거나 꼬인 위치일 수 있다. (거짓)} \ \text{⑤ } & \text{한 직선에 수직인 두 직선은 꼬인 위치이거나 한 점에서 만날 수 있다. (거짓)} \end{aligned}$


따라서 항상 옳은 것은 ①이다.



```json
{
  "status": "EXEMPT",
  "reason": "공간에서 직선과 평면의 위치 관계 명제에 대한 진위 판정 문항"
}

```


```json
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "공간에서 직선 간 평행의 추이성을 참으로 식별하고 직육면체 반례로 나머지 명제를 기각한다.",
  "decisiveStep": "직선 평행 관계의 추이성 성립 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "공간에서의 위치 관계",
    "l4": "직선과 평면의 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SPATIAL_LINE_PLANE_RELATIONS",
    "templateKey": "TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_CLAIM_AUDIT",
    "why": "공간에서 직선과 평면의 평행·수직 공리 및 위치 관계 진위를 검토하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직육면체 공간 모델을 활용하여 다양한 위치 관계의 참·거짓을 반례로 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "평면"
    ],
    "goal": [
      "위치관계"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q06
- 형식: 객관식
- 배점: 5
### 발문
다음 그림에서 두 직선 $l, m$이 서로 평행할 때, $\angle x + \angle y$의 크기는? [5점]
### 선지
① $150^\circ$ ② $160^\circ$ ③ $170^\circ$ ④ $180^\circ$ ⑤ $190^\circ$
### 정답
⑤
### 해설
두 꺾인 점을 지나며 두 직선 $l, m$에 평행한 보조선을 각각 긋는다.


가운데 선분이 보조선과 이루는 예각의 크기를 $\alpha$라 하자. 평행선의 엇각과 동위각의 성질에 의하여 $\begin{aligned} \angle x &= 145^\circ - \alpha \ \angle y &= \alpha + 45^\circ \end{aligned}$


두 각의 합을 구하면 $\begin{aligned} \angle x + \angle y &= (145^\circ - \alpha) + (\alpha + 45^\circ) \ &= 145^\circ + 45^\circ \ &= 190^\circ \end{aligned}$


따라서 정답은 ⑤이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "평행선 l, m 사이에 두 번 꺾인 선과 각 x, y가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "평행한 보조선을 두 꺾인 점에 그어 엇각의 매개변수 알파를 상쇄시켜 x+y=190도를 구한다.",
  "decisiveStep": "보조선에 의한 매개각 상쇄로 145도+45도=190도 산출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "동위각과 엇각",
    "l4": "평행선에서 꺾인 선의 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_BENT_LINE",
    "why": "평행선 사이 다중 꺾인 선에서 보조선을 작도하여 각의 합을 도출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 개의 평행 보조선을 도입하고 매개변수 상쇄를 통해 각의 합을 구하는 응용 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "엇각"
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
정육면체의 전개도를 접어 정육면체를 완성하였을 때, 모서리 $AB$와 꼬인 위치에 있는 모서리가 아닌 것은? [5점]
### 선지
① $\overline{CD}$ ② $\overline{DM}$ ③ $\overline{DE}$ ④ $\overline{EL}$ ⑤ $\overline{EF}$
### 정답
③
### 해설
전개도를 접었을 때 만나는 점과 모서리를 정육면체 겨냥도 위에 대응시킨다.


모서리 $\overline{AB}$와의 위치 관계를 분류하면 다음과 같다. $\begin{aligned} \text{만나는 모서리: } & \overline{BM}, \overline{BC}, \overline{AL}, \overline{AF} \ \text{평행한 모서리: } & \overline{ML}, \overline{DE}, \overline{CF} \ \text{꼬인 위치의 모서리: } & \overline{CD}, \overline{DM}, \overline{EF}, \overline{EL} \end{aligned}$


따라서 모서리 $\overline{DE}$는 모서리 $\overline{AB}$와 평행하므로 꼬인 위치에 있지 않다.


따라서 정답은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "정육면체의 전개도와 꼭짓점 알파벳 라벨이 표시된 전개도 다이어그램"
}

```


```json
{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "전개도를 접어 정육면체를 구성한 후 모서리 AB와 평행한 모서리 DE를 꼬인 위치에서 제외한다.",
  "decisiveStep": "AB와 DE가 평행함을 식별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "정육면체의 전개도와 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FOLDED_NET_RELATION_AUDIT",
    "why": "정육면체 전개도를 접었을 때 특정 모서리와 꼬인 위치, 평행, 만남 관계를 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2차원 전개도를 3차원 입체로 공간 회전하여 꼭짓점 일치 및 평행 모서리를 파악해야 하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "정육면체",
      "전개도"
    ],
    "goal": [
      "꼬인위치"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q08
- 형식: 객관식
- 배점: 5
### 발문
다음 그림에서 두 직선 $l, m$이 서로 평행할 때, $\angle a + \angle b + \angle c + \angle d$의 크기는? [5점]
### 선지
① $115^\circ$ ② $125^\circ$ ③ $135^\circ$ ④ $140^\circ$ ⑤ $145^\circ$
### 정답
⑤
### 해설
꺾인 점마다 직선 $l, m$과 평행한 보조선을 차례대로 작도한다.


평행선에서의 엇각과 동위각의 성질을 이용해 각들을 하나의 평각 위에 연속하여 모으면 다음과 같은 관계식이 성립한다. $\begin{aligned} \angle a + \angle b + \angle c + \angle d + 35^\circ &= 180^\circ \ \angle a + \angle b + \angle c + \angle d &= 180^\circ - 35^\circ \ &= 145^\circ \end{aligned}$


따라서 정답은 ⑤이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "평행선 l, m 사이에 지그재그로 꺾인 선분들과 각 a, b, c, d 및 35도가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "모든 꺾인 점에 평행선을 그어 각 a, b, c, d와 35도를 평각 180도 위에 모아 145도를 구한다.",
  "decisiveStep": "180도 - 35도 = 145도 도출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "동위각과 엇각",
    "l4": "평행선에서 꺾인 선의 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_BENT_LINE",
    "why": "다중 꺾인 선에서 평행 보조선을 활용해 각의 합을 평각으로 귀착시키는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여러 개의 평행 보조선을 도입하여 각들을 한 점에서의 평각으로 누적 이송하는 응용 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "평각"
    ],
    "method": [
      "엇각",
      "사칙연산"
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
작도와 기본도형에 대한 설명으로 옳지 않은 것은? [4점]
### 선지
① 눈금 없는 자와 컴퍼스만을 사용하여 도형을 그리는 것을 작도라고 한다. ② 작도에서 선분의 길이를 다른 곳으로 옮길 때에는 눈금 없는 자를 사용한다. ③ $\triangle ABC$에서 변 $BC$와 마주 보는 각을 변 $BC$의 대각이라고 한다. ④ 삼각형의 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 항상 작아야 한다. ⑤ 두 변의 길이와 그 끼인각의 크기가 주어지면 삼각형은 오직 하나로 작도된다.
### 정답
②
### 해설
작도 도구의 역할과 삼각형의 작도 조건을 판정한다.


$\begin{aligned} \text{① } & \text{눈금 없는 자와 컴퍼스만을 사용하여 도형을 그리는 것이 작도의 정의이다. (참)} \ \text{② } & \text{선분의 길이를 재어서 다른 선분이나 직선 위로 옮길 때에는 컴퍼스를 사용한다. 눈금 없는 자는 두 점을 잇는 선분을 긋거나 선분을 연장할 때만 쓴다. (거짓)} \ \text{③ } & \text{대각과 대변의 정의는 올바르다. (참)} \ \text{④ } & \text{삼각형의 성립 조건: 가장 긴 변 } < \text{나머지 두 변의 합 (참)} \ \text{⑤ } & \text{SAS 조건에 의해 삼각형이 하나로 결정된다. (참)} \end{aligned}$


따라서 옳지 않은 것은 ②이다.



```json
{
  "status": "EXEMPT",
  "reason": "작도 도구(눈금 없는 자, 컴퍼스)의 정의 및 사용 목적 진위 판별 문항"
}

```


```json
{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "작도 도구의 고유 역할(길이 이동은 컴퍼스, 직선 긋기는 자)을 대조하여 틀린 진술을 찾는다.",
  "decisiveStep": "선분의 길이를 옮기는 도구는 컴퍼스임을 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 도형의 작도",
    "l4": "작도의 뜻과 도구"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_CONSTRUCTION",
    "templateKey": "TPL_M1_BASIC_CONSTRUCTION_TOOL_USAGE",
    "why": "작도 도구의 올바른 사용법과 작도의 기본 용어를 점검하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "작도 도구의 정의와 역할을 직접 묻는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "작도"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "정의"
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
다음 그림은 점 $P$를 지나고 직선 $l$에 평행한 직선을 작도하는 과정을 나타낸 것이다. 작도 순서를 바르게 나열한 것은? [4점]


㉠ 점 $P$를 지나는 직선을 그어 직선 $l$과의 교점 $O$를 잡는다. ㉡ 점$O$를 중심으로 원을 그려 직선과의 두 교점을 잡는다. ㉢ 점$P$를 중심으로 반지름이 같은 원을 그린다.
㉣ 컴퍼스로 각의 벌어진 거리를 잰다.
㉤ 잰 거리를 점 $P$쪽의 호 위에 옮겨 교점을 찾는다. ㉥ 점$P$와 교점을 잇는 직선을 긋는다.
### 선지
① ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉢ $\rightarrow$ ㉣ $\rightarrow$ ㉤ $\rightarrow$ ㉥ ② ㉠ $\rightarrow$ ㉢ $\rightarrow$ ㉡ $\rightarrow$ ㉤ $\rightarrow$ ㉣ $\rightarrow$ ㉥ ③ ㉢ $\rightarrow$ ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉣ $\rightarrow$ ㉤ $\rightarrow$ ㉥ ④ ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉣ $\rightarrow$ ㉢ $\rightarrow$ ㉤ $\rightarrow$ ㉥ ⑤ ㉡ $\rightarrow$ ㉠ $\rightarrow$ ㉢ $\rightarrow$ ㉣ $\rightarrow$ ㉤ $\rightarrow$ ㉥
### 정답
①
### 해설
동위각의 크기가 같음을 이용한 평행선 작도의 순서는 다음과 같다.


$\begin{aligned} \text{1단계 (㉠): } & \text{점 } P\text{를 지나 직선 } l\text{과 만나는 보조선을 긋는다.} \ \text{2단계 (㉡): } & \text{교점을 중심으로 적당한 반지름의 호를 그려 교점들을 잡는다.} \ \text{3단계 (㉢): } & \text{같은 반지름으로 점 } P\text{를 중심으로 호를 그린다.} \ \text{4단계 (㉣): } & \text{아래쪽 호에서 두 교점 사이의 거리를 컴퍼스로 잰다.} \ \text{5단계 (㉤): } & \text{위쪽 호 위에 그 거리를 옮겨 교점을 표시한다.} \ \text{6단계 (㉥): } & \text{점 } P\text{와 그 교점을 잇는 직선을 그어 평행선을 완성한다.} \end{aligned}$


따라서 올바른 순서는 ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉢ $\rightarrow$ ㉣ $\rightarrow$ ㉤ $\rightarrow$ ㉥이다.


따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "직선 l과 한 점 P, 평행선을 작도하는 보조선과 호 흔적이 기호 ㉠~㉥으로 표시된 작도 다이어그램"
}

```


```json
{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "동위각 복사 작도의 논리적 6단계를 순차적으로 대조하여 올바른 작도 순서를 판별한다.",
  "decisiveStep": "보조선 긋기 후 호 그리기와 거리 재기의 순서 확정",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 도형의 작도",
    "l4": "평행선의 작도"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_DIRECT_TRANSFER",
    "why": "동위각 작도를 이용한 평행선 작도의 표준 절차를 평가하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선 작도의 각 단계가 갖는 기하학적 인과관계를 바르게 이해해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "작도",
      "평행선"
    ],
    "goal": [
      "동위각"
    ],
    "method": [
      "정의"
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
다음 중 삼각형이 하나로 결정되지 않는 것은? [4점]
### 선지
① $a = 5,\mathrm{cm},\ b = 7,\mathrm{cm},\ \angle C = 45^\circ$ ② $a = 6,\mathrm{cm},\ \angle B = 50^\circ,\ \angle C = 70^\circ$ ③ $a = 8,\mathrm{cm},\ b = 10,\mathrm{cm},\ \angle A = 30^\circ$ ④ $a = 4,\mathrm{cm},\ b = 7,\mathrm{cm},\ c = 9,\mathrm{cm}$ ⑤ $a = 6,\mathrm{cm},\ b = 6,\mathrm{cm},\ c = 6,\mathrm{cm}$
### 정답
③
### 해설
삼각형이 하나로 결정되는 조건(SSS, SAS, ASA)을 검토한다.


$\begin{aligned} \text{① } & a, b\text{와 그 끼인각 } \angle C\text{가 주어졌으므로 SAS 조건에 의해 하나로 결정된다. (결정됨)} \ \text{② } & \text{한 변 } a\text{와 양 끝 각 } \angle B, \angle C\text{가 주어졌으므로 ASA 조건에 의해 하나로 결정된다. (결정됨)} \ \text{③ } & \text{두 변 } a, b\text{와 끼인각이 아닌 대각 } \angle A\text{가 주어지면 삼각형이 } 2\text{개 생기거나 결정되지 않을 수 있다. (결정되지 않음)} \ \text{④ } & \text{세 변의 길이 } 4, 7, 9\text{에서 } 4+7 = 11 > 9\text{이므로 삼각형이 성립하고 SSS로 결정된다. (결정됨)} \ \text{⑤ } & \text{세 변의 길이가 모두 같으므로 정삼각형으로 유일하게 결정된다. (결정됨)} \end{aligned}$


따라서 삼각형이 하나로 결정되지 않는 것은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "삼각형의 결정 조건에 대한 대수적 수치 진위 판별 문항"
}

```


```json
{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "두 변과 그 끼인각이 아닌 각이 주어진 경우 삼각형이 하나로 결정되지 않음을 식별한다.",
  "decisiveStep": "두 변과 비끼인각 조건의 불완전성 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형이 하나로 정해지는 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA",
    "why": "주어진 변과 각의 조건에서 삼각형이 유일하게 결정되는지 판별하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형의 합동 조건과 결정 조건의 필요충분 관계를 각 보기별로 엄밀히 대조하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "길이"
    ],
    "goal": [
      "삼각형이하나로결정"
    ],
    "method": [
      "성립조건"
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
두 삼각형이 $\triangle ABC \equiv \triangle DEF$일 때, 그림에 주어진 조건과 합동 기호의 대응 관계만으로 추가 계산 없이 바로 알 수 없는 것은? [3점]
### 선지
① $\overline{DE}$의 길이 ② $\overline{EF}$의 길이 ③ $\overline{DF}$의 길이 ④ $\angle D$의 크기 ⑤ $\angle F$의 크기
### 정답
②
### 해설
합동인 두 삼각형에서 서로 대응하는 변의 길이와 대응하는 각의 크기는 서로 같다.


$\triangle ABC \equiv \triangle DEF$이므로 꼭짓점의 대응 관계는 $\begin{aligned} A &\leftrightarrow D \ B &\leftrightarrow E \ C &\leftrightarrow F \end{aligned}$


따라서 $\begin{aligned} \overline{DE} &= \overline{AB} \ \overline{DF} &= \overline{AC} \ \angle D &= \angle A \ \angle F &= \angle C \end{aligned}$ 는 직접 대응으로 바로 알 수 있다. 반면 $\overline{EF}$는 $\overline{BC}$에 대응하는데, 그림에 $\overline{BC}$의 길이가 주어지지 않았으므로 추가 계산 없이 알 수 없다.


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "합동인 두 삼각형 ABC와 DEF의 대응점 및 변/각 수치가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "합동 기호의 꼭짓점 순서 대응 관계를 대조하여 정보가 누락된 변 EF를 판별한다.",
  "decisiveStep": "BC에 대응하는 EF의 미제시 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 합동",
    "l4": "합동인 도형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_DATA_TRANSFER",
    "templateKey": "TPL_M1_CONGRUENCE_DATA_TRANSFER_ORDERED_CORRESPONDENCE",
    "why": "합동 기호의 알파벳 순서 대응과 도형의 성질을 대조하는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도형 합동의 기본 정의와 대응점 일치 관계를 직접 묻는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "합동"
    ],
    "goal": [
      "대응변",
      "대응각"
    ],
    "method": [
      "성질"
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
삼각형의 세 변의 길이가 각각 $5,\mathrm{cm}$, $11,\mathrm{cm}$, $x,\mathrm{cm}$일 때, $x$의 값이 될 수 없는 것은? [4점]
### 선지
① $5$ ② $7$ ③ $9$ ④ $11$ ⑤ $13$
### 정답
①
### 해설
삼각형의 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 한다. 세 변의 길이가 $5, 11, x$일 때 $x$의 범위는 다음과 같다. $\begin{aligned} 11 - 5 &< x < 11 + 5 \ 6 &< x < 16 \end{aligned}$


보기 중에서 이 범위를 만족하지 않는 값은 $5$이다.


따라서 정답은 ①이다.



```json
{
  "status": "EXEMPT",
  "reason": "삼각형 세 변의 길이 부등식 범위 계산 문항"
}

```


```json
{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "삼각부등식 11-5 < x < 11+5에서 6 < x < 16을 유도하여 범위 밖의 x=5를 찾는다.",
  "decisiveStep": "부등식 범위 6 < x < 16 도출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형의 세 변의 길이 사이의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_SIDE_FEASIBILITY",
    "templateKey": "TPL_M1_TRIANGLE_SIDE_FEASIBILITY_THIRD_SIDE_RANGE",
    "why": "두 변의 길이가 주어졌을 때 셋째 변의 존재 범위를 삼각부등식으로 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_RANGE"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형의 세 변 성립 부등식을 1차원적으로 적용하는 1단계 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "길이"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "성립조건"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q14
- 형식: 객관식
- 배점: 5
### 발문
다음 그림과 같이 정삼각형 $ABC$의 한 변 $BC$의 연장선 위에 점 $D$를 잡고, 선분 $CD$를 한 변으로 하는 정삼각형 $ECD$를 그렸다. 선분 $BE$와 선분 $AD$의 교점을 $F$라 할 때, $\triangle ACD \equiv \triangle BCE$임을 증명할 수 있는 삼각형의 합동 조건은? [5점]
### 선지
① SSS 합동 ② SAS 합동 ③ ASA 합동 ④ RHS 합동 ⑤ RHA 합동
### 정답
②
### 해설
$\triangle ACD$와 $\triangle BCE$의 대응 요소를 검토한다.


$\begin{aligned} \text{1. } & \triangle ABC\text{가 정삼각형이므로 } \overline{AC} = \overline{BC}, \quad \angle ACB = 60^\circ \ \text{2. } & \triangle ECD\text{가 정삼각형이므로 } \overline{CD} = \overline{CE}, \quad \angle DCE = 60^\circ \ \text{3. } & \text{점 } B, C, D\text{가 일직선 위에 있으므로} \ & \angle ACD = 180^\circ - \angle ACB = 180^\circ - 60^\circ = 120^\circ \ & \angle BCE = 180^\circ - \angle DCE = 180^\circ - 60^\circ = 120^\circ \ & \therefore \angle ACD = \angle BCE \end{aligned}$


따라서 두 변의 길이가 각각 같고 그 끼인각의 크기가 서로 같으므로 $\begin{aligned} \triangle ACD \equiv \triangle BCE \quad (\text{SAS 합동}) \end{aligned}$


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "한 변이 연장된 두 정삼각형과 교점 F가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "정삼각형의 변과 180-60=120도의 끼인각 일치를 확인하여 SAS 합동을 증명한다.",
  "decisiveStep": "AC=BC, CD=CE 및 끼인각 120도 일치 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 합동",
    "l4": "삼각형의 합동 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION",
    "why": "도형 속에서 두 삼각형의 합동 조건을 찾고 근거를 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정삼각형 성질과 평각을 연계하여 두 변과 끼인각의 동등성을 도출해야 하는 증명형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정삼각형"
    ],
    "goal": [
      "합동"
    ],
    "method": [
      "SAS"
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
※ (15~17) 다음 표는 어느 학교 교사 $20$명의 나이를 조사한 원자료이다. 이 자료를 줄기와 잎 그림으로 정리할 때, 물음에 답하시오.


$48 \quad 42 \quad 56 \quad 39 \quad 47$
$34 \quad 25 \quad 37 \quad 32 \quad 49$
$40 \quad 31 \quad 28 \quad 27 \quad 43$
$24 \quad 46 \quad 53 \quad 23 \quad 34$


위 자료를 줄기와 잎 그림으로 나타낼 때, 줄기가 $2$인 잎의 셋째 수 $a$, 줄기가 $3$인 잎의 마지막 수 $b$, 줄기가 $4$인 잎의 넷째 수 $c$에 대하여 $a \times b - c$의 값은? [4점]
### 선지
① $28$ ② $32$ ③ $35$ ④ $39$ ⑤ $42$
### 정답
④
### 해설
원자료를 줄기별로 작은 수부터 크기순으로 정렬한다.


$\begin{aligned} \text{줄기 } 2\text{ (20대): } & 23, 24, 25, 27, 28 \implies \text{잎: } 3, 4, 5, 7, 8 \ & \text{셋째 잎 } a = 5 \ \text{줄기 } 3\text{ (30대): } & 31, 32, 34, 34, 37, 39 \implies \text{잎: } 1, 2, 4, 4, 7, 9 \ & \text{마지막 잎 } b = 9 \ \text{줄기 } 4\text{ (40대): } & 40, 42, 43, 46, 47, 48, 49 \implies \text{잎: } 0, 2, 3, 6, 7, 8, 9 \ & \text{넷째 잎 } c = 6 \end{aligned}$


따라서 구하는 식의 값을 계산하면 $\begin{aligned} a \times b - c &= 5 \times 9 - 6 \ &= 45 - 6 \ &= 39 \end{aligned}$


따라서 정답은 ④이다.



```json
{
  "status": "EXEMPT",
  "reason": "줄기와 잎 그림의 원자료 정렬 및 빈칸 미지수 계산 문항"
}

```


```json
{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "원자료 20개를 줄기별로 정렬하여 잎 a=5, b=9, c=6을 식별하고 5*9-6=39를 계산한다.",
  "decisiveStep": "크기순 잎 a=5, b=9, c=6 산출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_STEM_LEAF_PLACEHOLDER_EVALUATION",
    "templateKey": "TPL_M1_STEM_LEAF_PLACEHOLDER_EVALUATION_CORE",
    "why": "원자료를 줄기와 잎 그림으로 변환할 때 특정 위치의 잎을 추출하여 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료를 크기순으로 분류하고 순서 위치의 잎 값을 정확히 추출하여 연산하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "변량"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q16
- 형식: 객관식
- 배점: 4
### 발문
위 15번의 자료에서 나이가 $40$대인 교사는 전체의 몇 $%$인가? [4점]
### 선지
① $25%$ ② $28%$ ③ $30%$ ④ $32%$ ⑤ $35%$
### 정답
⑤
### 해설
나이가 $40$대인 교사의 인원수를 구하여 전체에 대한 백분율을 계산한다.


$\begin{aligned} \text{나이가 } 40\text{대인 교사: } & 40, 42, 43, 46, 47, 48, 49\text{의 } 7\text{명} \ \text{전체 교사 수: } & 20\text{명} \end{aligned}$


백분율을 구하면 $\begin{aligned} \dfrac{7}{20} \times 100 &= 7 \times 5 \ &= 35% \end{aligned}$


따라서 정답은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "특정 구간 인원수의 백분율 계산 문항"
}

```


```json
{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "40대 교사 7명을 세어 전체 20명에 대한 백분율 7/20*100=35%를 산출한다.",
  "decisiveStep": "7 / 20 * 100 = 35% 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "자료에서 정보 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_CORE",
    "why": "자료의 특정 구간 빈도를 전체 도수에 대한 비율 및 백분율로 환산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료에서 특정 계급의 도수를 세고 백분율 공식을 적용하는 1단계 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "백분율",
      "비율"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q17
- 형식: 객관식
- 배점: 3
### 발문
위 15번의 자료에서 나이가 가장 많은 교사와 가장 적은 교사의 나이의 합은? [3점]
### 선지
① $75$세 ② $77$세 ③ $79$세 ④ $81$세 ⑤ $83$세
### 정답
③
### 해설
원자료에서 최솟값과 최댓값을 찾아 합산한다.


$\begin{aligned} \text{가장 적은 나이(최솟값): } & 23\text{세} \ \text{가장 많은 나이(최댓값): } & 56\text{세} \end{aligned}$


두 나이의 합을 구하면 $\begin{aligned} 23 + 56 &= 79\text{세} \end{aligned}$


따라서 정답은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "자료의 양 끝 극값 식별 및 덧셈 계산 문항"
}

```


```json
{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "자료의 최솟값 23세와 최댓값 56세를 찾아 합 79세를 계산한다.",
  "decisiveStep": "23 + 56 = 79 도출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "자료에서 정보 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_EXTREME_VALUE_SUM",
    "templateKey": "TPL_M1_DATA_EXTREME_VALUE_SUM_CORE",
    "why": "자료의 극값(최댓값과 최솟값)을 읽어 합을 계산하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료의 최댓값과 최솟값을 직접 읽고 덧셈을 수행하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자료"
    ],
    "goal": [
      "변량"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q18
- 형식: 객관식
- 배점: 5
### 발문
※ (18~19) 다음 도수분포표는 어느 학급 학생 $40$명의 키를 조사하여 나타낸 것이다. 키가 $160,\mathrm{cm}$ 이상인 학생이 전체의 $20%$일 때, 물음에 답하시오.


$\begin{array}{|c|c|} \hline \text{키}(\mathrm{cm}) & \text{학생 수}(\text{명}) \\ \hline 130^{\text{이상}} \sim 140^{\text{미만}} & 5 \\ 140 \sim 150 & A \\ 150 \sim 160 & 13 \\ 160 \sim 170 & B \\ 170 \sim 180 & 3 \\ \hline \text{합계} & 40 \\ \hline \end{array}$


키가 $160,\mathrm{cm}$ 이상 $170,\mathrm{cm}$ 미만인 계급의 학생 수는? [5점]
### 선지
① $5$ ② $6$ ③ $7$ ④ $8$ ⑤ $9$
### 정답
①
### 해설
키가 $160,\mathrm{cm}$ 이상인 학생 수는 전체 $40$명의 $20%$이므로 $\begin{aligned} 40 \times 0.2 &= 8\text{명} \end{aligned}$


$160,\mathrm{cm}$ 이상인 계급은 $160 \sim 170,\mathrm{cm}$와 $170 \sim 180,\mathrm{cm}$이다. $170 \sim 180,\mathrm{cm}$ 계급의 학생 수가 $3$명이므로 $160 \sim 170,\mathrm{cm}$ 계급의 학생 수 $B$는 $\begin{aligned} B &= 8 - 3 \ &= 5\text{명} \end{aligned}$


따라서 정답은 ①이다.



```json
{
  "status": "EXEMPT",
  "reason": "도수분포표에서 백분율 조건을 이용한 빈칸 계급 도수 계산 문항"
}

```


```json
{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "전체 40명의 20%인 8명에서 170~180 계급 3명을 빼서 160~170 계급 도수 5명을 구한다.",
  "decisiveStep": "40 * 0.2 - 3 = 5 도출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
    "why": "도수분포표의 누적 비율 조건에서 특정 계급의 빈칸 도수를 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "백분율을 실제 도수로 환산하고 부분 계급의 도수를 차감하는 연계 계산 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표"
    ],
    "goal": [
      "도수",
      "계급"
    ],
    "method": [
      "사칙연산",
      "백분율"
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
위 18번의 도수분포표에서 키가 $150,\mathrm{cm}$ 미만인 학생 수는? [4점]
### 선지
① $13$ ② $15$ ③ $17$ ④ $19$ ⑤ $21$
### 정답
④
### 해설
전체 학생 수의 합계가 $40$명이므로 알려진 도수들을 합산한다.


$\begin{aligned} 130 \sim 140,\mathrm{cm}: & \quad 5\text{명} \ 150 \sim 160,\mathrm{cm}: & \quad 13\text{명} \ 160 \sim 170,\mathrm{cm}: & \quad 5\text{명} \ 170 \sim 180,\mathrm{cm}: & \quad 3\text{명} \end{aligned}$


따라서 $140 \sim 150,\mathrm{cm}$ 계급의 학생 수 $A$는 $\begin{aligned} A &= 40 - (5 + 13 + 5 + 3) \ &= 40 - 26 \ &= 14\text{명} \end{aligned}$


키가 $150,\mathrm{cm}$ 미만인 학생은 $130 \sim 140,\mathrm{cm}$와 $140 \sim 150,\mathrm{cm}$의 두 계급에 속하므로 $\begin{aligned} 5 + 14 &= 19\text{명} \end{aligned}$


따라서 정답은 ④이다.



```json
{
  "status": "EXEMPT",
  "reason": "도수분포표에서 총합으로 빈칸 도수를 구하고 특정 기준 미만의 누적 도수를 합산하는 문항"
}

```


```json
{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "총합 40명에서 나머지 도수를 빼서 140~150 계급의 14명을 구하고 150미만 학생 수 5+14=19명을 산출한다.",
  "decisiveStep": "빈칸 도수 14명 산출 및 5+14=19명 누적",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
    "why": "도수분포표의 합계 관계로부터 특정 계급 도수를 복원하고 구간 누적 도수를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "전체 합계에서 여집합 도수를 빼는 단계와 구간 합산 단계를 연결하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표"
    ],
    "goal": [
      "도수"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q20
- 형식: 서답형
- 배점: 6
### 발문
다음 그림과 같이 한 직선 위에 네 점 $A, B, C, D$가 순서대로 놓여 있다. $\overline{BD}=4\overline{AB}$이고 점 $C$는 선분 $AD$의 중점이다. $\overline{BC}=9,\mathrm{cm}$일 때, 선분 $AD$의 길이를 구하고 그 과정을 서술하시오. [6점]
### 선지
없음
### 정답
$30,\mathrm{cm}$
### 해설
선분 $AB$의 길이를 $x,\mathrm{cm}$라 하자.


$\overline{BD} = 4\overline{AB}$이므로 $\begin{aligned} \overline{BD} &= 4x,\mathrm{cm} \end{aligned}$


네 점이 한 직선 위에 순서대로 있으므로 선분 $AD$의 길이는 $\begin{aligned} \overline{AD} &= \overline{AB} + \overline{BD} \ &= x + 4x \ &= 5x,\mathrm{cm} \end{aligned}$


점 $C$가 선분 $AD$의 중점이므로 $\begin{aligned} \overline{AC} &= \dfrac{1}{2}\overline{AD} \ &= \dfrac{5}{2}x,\mathrm{cm} \end{aligned}$


따라서 선분 $BC$의 길이는 $\begin{aligned} \overline{BC} &= \overline{AC} - \overline{AB} \ &= \dfrac{5}{2}x - x \ &= \dfrac{3}{2}x,\mathrm{cm} \end{aligned}$


문제에서 $\overline{BC} = 9,\mathrm{cm}$이므로 $\begin{aligned} \dfrac{3}{2}x &= 9 \ x &= 9 \times \dfrac{2}{3} \ &= 6,\mathrm{cm} \end{aligned}$


따라서 선분 $AD$의 길이는 $\begin{aligned} \overline{AD} &= 5x \ &= 5 \times 6 \ &= 30,\mathrm{cm} \end{aligned}$


답: $30,\mathrm{cm}$



```json
{
  "status": "UNSUPPORTED",
  "reason": "한 직선 위의 네 점 A, B, C, D와 비율 관계 BD=4AB, 중점 C가 표시된 선분 다이어그램"
}

```


```json
{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "AB=x로 두고 BD=4x, AD=5x, AC=2.5x를 세워 BC=1.5x=9에서 x=6을 구한 후 AD=30cm를 계산한다.",
  "decisiveStep": "1.5x=9에서 x=6 산출 및 AD=5x=30 대입",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "선분의 내분과 중점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SEGMENT_LENGTH_RELATIONS",
    "templateKey": "TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT",
    "why": "선분의 비율 조건과 중점 조건을 결합하여 전체 길이를 서술형으로 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비례식을 미지수 x로 설정하고 중점 분할과 차를 연립하여 미지수를 해결하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "선분",
      "중점"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "일차방정식",
      "비율"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q21
- 형식: 서답형
- 배점: 7
### 발문
다음 그림에서 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AD} \parallel \overline{BC}$일 때, 대각선 $AC$에 의해 나누어지는 두 삼각형 $\triangle ABC$와 $\triangle CDA$가 서로 합동임을 평행선의 성질을 이용하여 증명하시오. (단, 평행사변형의 대변의 길이가 같음은 이용하지 마시오.) [7점]
### 선지
없음
### 정답
$\triangle ABC \equiv \triangle CDA$ (ASA 합동)
### 해설
$\triangle ABC$와 $\triangle CDA$에서 평행선의 성질을 적용한다.


$\begin{aligned} \text{1. } & \overline{AD} \parallel \overline{BC}\text{이고 선분 } AC\text{가 두 평행선과 만나므로 엇각의 크기는 서로 같다.} \ & \angle BCA = \angle DAC \quad \cdots\cdots \text{ (1)} \ \text{2. } & \overline{AB} \parallel \overline{DC}\text{이고 선분 } AC\text{가 두 평행선과 만나므로 엇각의 크기는 서로 같다.} \ & \angle BAC = \angle DCA \quad \cdots\cdots \text{ (2)} \ \text{3. } & \text{선분 } AC\text{는 두 삼각형에 공통인 변이다.} \ & \overline{AC} = \overline{CA} \quad \cdots\cdots \text{ (3)} \end{aligned}$


(1), (2), (3)에 의하여 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 $\begin{aligned} \triangle ABC \equiv \triangle CDA \quad (\text{ASA 합동}) \end{aligned}$


답: $\triangle ABC \equiv \triangle CDA$ (ASA 합동)



```json
{
  "status": "UNSUPPORTED",
  "reason": "평행사변형 ABCD와 대각선 AC, 엇각 쌍이 호로 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "평행선의 엇각 성질로 각 BCA=각 DAC, 각 BAC=각 DCA를 유도하고 공통변 AC를 결합하여 ASA 합동을 증명한다.",
  "decisiveStep": "엇각 2쌍과 공통변 AC에 의한 ASA 합동 판정",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 합동",
    "l4": "삼각형의 합동 조건의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION",
    "why": "평행선 조건에서 엇각과 공통변을 찾아 삼각형의 합동을 증명하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선의 위치 관계 성질과 삼각형의 합동 조건을 논리적으로 결합하여 완성하는 정통 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행선",
      "삼각형"
    ],
    "goal": [
      "합동"
    ],
    "method": [
      "합동조건",
      "엇각"
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
다음 그림과 같이 직사각형 모양의 종이테이프를 선분 $EF$를 접는 선으로 하여 접었을 때, $\angle EGF = 140^\circ$가 되었다. 이때 $\angle GFE$의 크기를 구하고, 그 풀이 과정을 서술하시오. [7점]
### 선지
없음
### 정답
$20^\circ$
### 해설
직사각형 종이를 접었으므로 접힌 각의 크기는 서로 같다. $\begin{aligned} \angle GEF &= \angle FEC \quad \cdots\cdots \text{ (1)} \end{aligned}$


직사각형의 마주 보는 두 변은 서로 평행하므로($\overline{AD} \parallel \overline{BC}$), 엇각의 크기는 서로 같다. $\begin{aligned} \angle GFE &= \angle FEC \quad \cdots\cdots \text{ (2)} \end{aligned}$


(1)과 (2)에 의하여 $\begin{aligned} \angle GEF &= \angle GFE \end{aligned}$ 이므로 $\triangle EGF$는 $\overline{GE} = \overline{GF}$인 이등변삼각형이다.


삼각형의 세 내각의 크기의 합은 $180^\circ$이므로 $\begin{aligned} \angle GEF + \angle GFE &= 180^\circ - \angle EGF \ &= 180^\circ - 140^\circ \ &= 40^\circ \end{aligned}$


$\angle GEF = \angle GFE$이므로 구하는 $\angle GFE$의 크기는 $\begin{aligned} \angle GFE &= \dfrac{40^\circ}{2} \ &= 20^\circ \end{aligned}$


답: $20^\circ$



```json
{
  "status": "UNSUPPORTED",
  "reason": "직사각형 종이테이프를 접은 형태와 꼭짓점 E, F, G 및 각 EGF=140도가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "접은 각과 평행선 엇각의 성질로 삼각형 EGF가 이등변삼각형임을 밝히고 (180-140)/2=20도를 구한다.",
  "decisiveStep": "이등변삼각형 성질 확인 및 밑각 20도 산출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "동위각과 엇각",
    "l4": "종이접기와 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MOVE_FOLDING_REFLECTION",
    "templateKey": "TPL_MOVE_FOLDING_REFLECTION_CORE",
    "why": "직사각형 종이접기에서 접힌 각과 엇각으로 이등변삼각형을 찾아 각을 구하는 대표 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "REINTERPRETATION",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "종이접기의 대칭성과 평행선의 엇각을 종합하여 이등변삼각형을 재해석하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행선",
      "삼각형"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "엇각",
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}

```
