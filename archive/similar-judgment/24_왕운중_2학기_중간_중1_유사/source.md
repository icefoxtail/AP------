```json:exam
{
  "stem": "24_왕운중_2학기_중간_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2mid/24_왕운중_2학기_중간_중1_기출.js",
  "examFolder": "2mid",
  "grade": "중1",
  "curriculum": "2015",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 그림에서 두 직선 $l, m$이 한 점에서 만난다. 직선 $m$과 직선 $l$이 이루는 각이 $65^\circ$이고, 표시된 두 직선이 서로 수직일 때, $\angle x + \angle y$의 크기는? [3점]
### 선지
① $140^\circ$ ② $150^\circ$ ③ $160^\circ$ ④ $170^\circ$ ⑤ $180^\circ$
### 정답
①
### 해설
평각과 직각의 성질을 이용하여 $\angle x$와 $\angle y$를 구한다.


직선 $l$ 위에서 $65^\circ$와 $\angle x$는 한 직선을 이루는 평각이므로 $\begin{aligned} \angle x &= 180^\circ - 65^\circ \ &= 115^\circ \end{aligned}$


표시된 두 사선이 서로 수직($90^\circ$)이므로 $\begin{aligned} \angle y &= 90^\circ - 65^\circ \ &= 25^\circ \end{aligned}$


따라서 구하는 두 각의 합은 $\begin{aligned} \angle x + \angle y &= 115^\circ + 25^\circ \ &= 140^\circ \end{aligned}$


따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "두 직선 l, m과 수직 사선, 각 65도, x, y가 표시된 각 다이어그램"
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
  "primaryMethod": "평각 성질 x=180-65=115도와 직각 성질 y=90-65=25도를 각각 구하여 합 140도를 계산한다.",
  "decisiveStep": "x=115도, y=25도 산출 및 덧셈",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "각",
    "l4": "평각과 직각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_INTERSECTING_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_TRANSFER",
    "why": "평각과 직각의 관계로부터 미지각을 분할하여 합을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평각 180도와 직각 90도의 감산 과정을 연결하여 미지각 합을 구하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "각"
    ],
    "goal": [
      "평각",
      "각"
    ],
    "method": [
      "사칙연산"
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
다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는? [4점]
### 선지
① $15$ ② $18$ ③ $20$ ④ $24$ ⑤ $30$
### 정답
①
### 해설
선분은 서로 다른 두 점을 양 끝점으로 하여 유일하게 결정되며, 점들의 일직선 배치 여부와 무관하게 두 점을 선택하는 경우의 수와 같다.


$6$개의 점 중에서 서로 다른 두 점을 택하는 방법의 수는 $\begin{aligned} \dfrac{6 \times 5}{2} &= 15\text{개} \end{aligned}$


따라서 만들 수 있는 서로 다른 선분의 개수는 $15$이다.


따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "반원의 호와 지름 위에 6개의 점 A~F가 놓인 기하 다이어그램"
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
  "primaryMethod": "서로 다른 6개의 점에서 두 점을 택하는 조합 공식 6*5/2=15로 선분의 개수를 구한다.",
  "decisiveStep": "6 × 5 / 2 = 15 계산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "직선·반직선·선분의 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT",
    "templateKey": "TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_SEGMENT_COUNT",
    "why": "주어진 점들로부터 만들어지는 서로 다른 선분의 개수를 세는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "선분의 결정 조건을 조합 연산으로 직접 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "점"
    ],
    "goal": [
      "선분",
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
다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다. $\overline{AD}=4,\mathrm{cm}$, $\overline{BC}=8,\mathrm{cm}$일 때, 꼭짓점 $D$와 변 $BC$ 사이의 거리는? [4점]
### 선지
① $3,\mathrm{cm}$ ② $4,\mathrm{cm}$ ③ $5,\mathrm{cm}$ ④ $6,\mathrm{cm}$ ⑤ $7,\mathrm{cm}$
### 정답
③
### 해설
점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이이므로, 점 $D$와 변 $BC$ 사이의 거리는 사다리꼴의 높이 $h,\mathrm{cm}$와 같다.


사다리꼴의 넓이 공식에 의하여 $\begin{aligned} \dfrac{(\overline{AD} + \overline{BC}) \times h}{2} &= 30 \ \dfrac{(4 + 8) \times h}{2} &= 30 \ 6h &= 30 \ h &= 5,\mathrm{cm} \end{aligned}$


따라서 점 $D$와 변 $BC$ 사이의 거리는 $5,\mathrm{cm}$이다.


따라서 정답은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "사다리꼴 ABCD와 윗변 4, 아랫변 8, 수선의 발 높이가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
  "conceptClusterKey": "PLANE_FIGURE_MEASURE",
  "primaryMethod": "점과 직선 사이의 거리가 사다리꼴의 높이임을 파악하고 넓이 공식 (4+8)*h/2=30에서 h=5를 구한다.",
  "decisiveStep": "6h = 30에서 h = 5 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "평면도형의 성질",
    "l3": "다각형",
    "l4": "사다리꼴의 넓이와 거리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRAPEZOID_AREA",
    "templateKey": "TPL_M1_TRAPEZOID_AREA_CORE",
    "why": "사다리꼴의 넓이와 점-직선 거리 개념을 결합하여 높이를 역산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "점과 직선 사이의 거리 정의를 사다리꼴 넓이 공식에 대입하여 일차방정식으로 해결하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "사다리꼴",
      "길이"
    ],
    "goal": [
      "거리"
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
- 배점: 5
### 발문
다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다. 다음 설명 중 옳지 않은 것은? [5점]
### 선지
① $\overline{AE} = \overline{ED}$ ② $\overline{CD} = \dfrac{1}{4}\overline{AB}$ ③ $\overline{EC} : \overline{CD} = 1 : 2$ ④ $\overline{AD} = \dfrac{3}{5}\overline{AB}$ ⑤ $\overline{AB} = 16,\mathrm{cm}$일 때, $\overline{EC} = 2,\mathrm{cm}$이다.
### 정답
④
### 해설
선분 $AB$의 전체 길이를 $L$이라 하고 각 부분 선분의 길이를 $L$로 나타낸다.


$\begin{aligned} \text{점 } C\text{는 } \overline{AB}\text{의 중점이므로: } & \overline{AC} = \overline{CB} = \dfrac{1}{2}L \ \text{점 } D\text{는 } \overline{CB}\text{의 중점이므로: } & \overline{CD} = \overline{DB} = \dfrac{1}{4}L \ \text{선분 } AD\text{의 길이는: } & \overline{AD} = \overline{AC} + \overline{CD} = \dfrac{1}{2}L + \dfrac{1}{4}L = \dfrac{3}{4}L \ \text{점 } E\text{는 } \overline{AD}\text{의 중점이므로: } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L \ \text{선분 } EC\text{의 길이는: } & \overline{EC} = \overline{AC} - \overline{AE} = \dfrac{1}{2}L - \dfrac{3}{8}L = \dfrac{1}{8}L \end{aligned}$


보기를 판정하면 다음과 같다. $\begin{aligned} \text{① } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L\text{ (참)} \ \text{② } & \overline{CD} = \dfrac{1}{4}L = \dfrac{1}{4}\overline{AB}\text{ (참)} \ \text{③ } & \overline{EC} : \overline{CD} = \dfrac{1}{8}L : \dfrac{1}{4}L = 1 : 2\text{ (참)} \ \text{④ } & \overline{AD} = \dfrac{3}{4}\overline{AB}\text{이므로 } \dfrac{3}{5}\overline{AB}\text{는 옳지 않다. (거짓)} \ \text{⑤ } & \overline{AB} = 16,\mathrm{cm}\text{이면 } \overline{EC} = \dfrac{1}{8} \times 16 = 2,\mathrm{cm}\text{ (참)} \end{aligned}$


따라서 옳지 않은 것은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "선분 AB 위의 점 C, D, E와 중점 관계가 표시된 1차원 선분 다이어그램"
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
  "primaryMethod": "전체 길이를 L로 두고 각 중점 분할을 분수로 표현하여 AD=3/4*AB임을 도출하고 보기 ④를 기각한다.",
  "decisiveStep": "AD = 3/4 L 판별 및 3/5 L 기각",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "선분의 내분과 중점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SEGMENT_LENGTH_RELATIONS",
    "templateKey": "TPL_M1_SEGMENT_LENGTH_RELATIONS_CHAINED_MIDPOINT",
    "why": "선분의 다중 연쇄 중점 분할 관계에서 각 부분의 비율과 길이를 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "3개의 중점 관계를 단계별 분수로 정밀하게 환산하여 비율 진위를 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "선분",
      "중점"
    ],
    "goal": [
      "비율",
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
- 배점: 3
### 발문
다음 삼각기둥 $ABC-DEF$에서 모서리 $DF$와 한 점에서 만나는 모서리와 모서리 $AB$와 꼬인 위치에 있는 모서리를 순서대로 바르게 짝지은 것은? [3점]
### 선지
① 모서리 $DE$, 모서리 $EF$ ② 모서리 $AB$, 모서리 $CF$ ③ 모서리 $EF$, 모서리 $AD$ ④ 모서리 $CF$, 모서리 $DE$ ⑤ 모서리 $BE$, 모서리 $DE$
### 정답
①
### 해설
삼각기둥의 꼭짓점과 모서리의 연결 관계를 분석한다.


$\begin{aligned} \text{1. } & \text{모서리 } DF\text{와 한 점에서 만나는 모서리: 꼭짓점 } D\text{ 또는 } F\text{를 공유하는 모서리이다.} \ & \text{점 } D\text{에서 만남: } \overline{AD}, \overline{DE} \ & \text{점 } F\text{에서 만남: } \overline{CF}, \overline{EF} \ & \text{따라서 } \overline{DE}\text{는 } \overline{DF}\text{와 한 점 } D\text{에서 만난다.} \ \text{2. } & \text{모서리 } AB\text{와 꼬인 위치에 있는 모서리: 만나지도 않고 평행하지도 않은 모서리이다.} \ & \overline{AB}\text{와 만나는 모서리: } \overline{AC}, \overline{BC}, \overline{AD}, \overline{BE} \ & \overline{AB}\text{와 평행한 모서리: } \overline{DE} \ & \text{남은 모서리(꼬인 위치): } \overline{CF}, \overline{DF}, \overline{EF} \ & \text{따라서 } \overline{EF}\text{는 } \overline{AB}\text{와 꼬인 위치에 있다.} \end{aligned}$


따라서 바르게 짝지은 것은 모서리 $DE$, 모서리 $EF$이다.


따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "삼각기둥 ABC-DEF의 꼭짓점과 모서리가 표시된 입체도형 다이어그램"
}

```


```json
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "삼각기둥에서 꼭짓점을 공유하는 만나는 모서리와 평면을 공유하지 않는 꼬인 위치 모서리를 분류한다.",
  "decisiveStep": "DF와 만나는 DE, AB와 꼬인 위치인 EF 짝 식별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "입체도형에서 모서리의 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_SKEW_EDGE_RELATION",
    "why": "각기둥 입체도형에서 교차 모서리와 꼬인 위치 모서리를 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "입체도형의 겨냥도를 바탕으로 공간 위치 관계의 정의를 적용하는 기본 판별 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "각기둥"
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

## Q06
- 형식: 객관식
- 배점: 5
### 발문
서로 다른 세 직선 $l, m, n$과 서로 다른 세 평면 $P, Q, R$에 대한 다음 보기의 설명 중 옳은 것만을 모두 고른 것은? [5점]


ㄱ. $l \parallel m$이고 $l \parallel n$이면 $m \parallel n$이다. ㄴ.$P \perp Q$이고 $Q \perp R$이면 $P \parallel R$이다. ㄷ.$P \parallel Q$이고 $l \perp P$이면 $l \perp Q$이다.
### 선지
① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ
### 정답
④
### 해설
공간에서의 직선과 평면의 위치 관계를 직육면체 모델로 판정한다.


$\begin{aligned} \text{ㄱ. } & \text{한 직선에 평행한 서로 다른 두 직선은 같은 방향을 가지므로 항상 서로 평행하다. } (m \parallel n)\text{ (참)} \ \text{ㄴ. } & \text{한 평면에 수직인 두 평면은 평행할 수도 있지만 직육면체의 한 모퉁이처럼 서로 수직으로 만날 수도 있다. (거짓)} \ \text{ㄷ. } & \text{평행한 두 평면 중 한 평면에 수직인 직선은 다른 평면과도 반드시 수직으로 만난다. } (l \perp Q)\text{ (참)} \end{aligned}$


따라서 옳은 것은 ㄱ, ㄷ이다.


따라서 정답은 ④이다.



```json
{
  "status": "EXEMPT",
  "reason": "공간에서 직선과 평면의 위치 관계 명제에 대한 진위 판정 문항"
}

```


```json
{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "공간에서 직선 평행의 추이성(ㄱ)과 평행면의 수직선 성질(ㄷ)을 검증하고 직육면체 모델로 ㄴ의 반례를 제시한다.",
  "decisiveStep": "ㄱ 참, ㄴ 거짓(직육면체 모퉁이면), ㄷ 참 판정",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "공간에서의 위치 관계",
    "l4": "직선과 평면의 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SPATIAL_LINE_PLANE_RELATIONS",
    "templateKey": "TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_CLAIM_AUDIT",
    "why": "공간에서 직선과 평면의 위치 관계 명제들의 참/거짓을 종합 판별하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직육면체 모델을 활용하여 다중 명제의 반례와 공리를 정확히 대조해야 하는 문항",
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

## Q07
- 형식: 객관식
- 배점: 5
### 발문
선분 $PO$와 평행한 선분 $AB$가 그려진 직사각형 모양의 종이를 선분 $QR$를 접는 선으로 하여 다음 그림과 같이 접었다. $\angle PQR = 120^\circ$일 때, $\angle a$와 $\angle b$의 크기를 바르게 짝지은 것은? [5점]
### 선지
① $\angle a = 50^\circ, \angle b = 60^\circ$ ② $\angle a = 60^\circ, \angle b = 60^\circ$ ③ $\angle a = 60^\circ, \angle b = 50^\circ$ ④ $\angle a = 70^\circ, \angle b = 60^\circ$ ⑤ $\angle a = 60^\circ, \angle b = 70^\circ$
### 정답
②
### 해설
평행선의 동측내각 및 접힌 각의 대칭성을 이용한다.


$\overline{PO} \parallel \overline{AB}$이므로 접는 선 $QR$이 직선 $PO$와 이루는 각 $\angle PQR = 120^\circ$의 보각은 $\begin{aligned} \angle b &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$


종이를 접으면 접는 선 $QR$을 대칭축으로 하여 대칭 이동하므로, 접힌 직선과 원래 직선이 이루는 각 $\angle a$는 $\begin{aligned} \angle a &= 180^\circ - 2 \times \angle b \ &= 180^\circ - 2 \times 60^\circ \ &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$


따라서 $\angle a = 60^\circ, \angle b = 60^\circ$이다.


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "PO // AB인 직사각형 종이를 QR로 접어 각 120도, a, b가 표시된 기하 다이어그램"
}

```


```json
{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "평행선의 평각 성질 b=180-120=60도를 구하고 접힘의 선대칭 성질 a=180-2b=60도를 산출한다.",
  "decisiveStep": "b=60도 도출 후 a=180-2*60=60도 계산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "동위각과 엇각",
    "l4": "종이접기와 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MOVE_FOLDING_REFLECTION",
    "templateKey": "TPL_MOVE_FOLDING_REFLECTION_CORE",
    "why": "직사각형 종이접기에서 평행선의 각과 대칭 각을 연계하여 미지각을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "종이접기의 대칭성과 평행선의 엇각을 입체적으로 재해석하여 두 각을 동시에 해결하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행선"
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

## Q08
- 형식: 객관식
- 배점: 4
### 발문
다음 그림 중 두 직선 $l, m$에 대하여 $l \parallel m$이 되는 것은? [4점]
### 선지
① 엇각의 크기가 각각 $65^\circ, 70^\circ$로 주어진 그림 ② 동위각의 크기가 각각 $115^\circ, 120^\circ$로 주어진 그림 ③ 같은 쪽에 있는 두 내각의 크기의 합이 $110^\circ + 70^\circ = 180^\circ$인 그림 ④ 맞꼭지각이 아닌 두 각의 합이 $175^\circ$인 그림 ⑤ 동위각의 크기가 각각 $80^\circ, 85^\circ$로 주어진 그림
### 정답
③
### 해설
평행선이 되기 위한 필요충분조건은 동위각의 크기가 같거나, 엇각의 크기가 같거나, 같은 쪽에 있는 두 내각(동측내각)의 크기의 합이 $180^\circ$이어야 한다.


$\begin{aligned} \text{① } & \text{엇각의 크기가 } 65^\circ \ne 70^\circ\text{이므로 평행하지 않다.} \ \text{② } & \text{동위각의 크기가 } 115^\circ \ne 120^\circ\text{이므로 평행하지 않다.} \ \text{③ } & \text{같은 쪽 두 내각의 크기의 합이 } 110^\circ + 70^\circ = 180^\circ\text{이므로 두 직선은 평행하다. (참)} \ \text{④ } & \text{동측내각의 합이 } 180^\circ\text{가 아니므로 평행하지 않다.} \ \text{⑤ } & \text{동위각의 크기가 } 80^\circ \ne 85^\circ\text{이므로 평행하지 않다.} \end{aligned}$


따라서 $l \parallel m$인 것은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "두 직선 l, m과 한 직선이 만나 생기는 각들의 수치가 제시된 5개의 판정 다이어그램"
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
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "동측내각의 크기의 합이 180도일 때 두 직선이 평행하다는 판정 조건을 적용한다.",
  "decisiveStep": "110도 + 70도 = 180도 성립 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "동위각과 엇각",
    "l4": "두 직선이 평행할 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_CONVERSE_ANGLE_CHECK",
    "why": "각의 관계로부터 평행선 여부를 판정하는 표준 역추론 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선의 역 성질(동측내각의 합=180도)을 5개 보기에서 대조하여 식별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "각"
    ],
    "goal": [
      "평행선"
    ],
    "method": [
      "성립조건"
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
다음 중 삼각형 $ABC$가 오직 하나로만 결정되는 조건은? [4점]
### 선지
① $\angle A = 50^\circ, \angle B = 60^\circ, \angle C = 70^\circ$ ② $\overline{AB} = 3,\mathrm{cm}, \overline{BC} = 4,\mathrm{cm}, \overline{CA} = 8,\mathrm{cm}$ ③ $\overline{AC}$의 대각의 크기가 $100^\circ$이고 $\angle A = 40^\circ$ ④ $\overline{AB} = 5,\mathrm{cm}, \overline{BC} = 6,\mathrm{cm}, \angle A = 45^\circ$ ⑤ $\angle B$의 대변의 길이가 $6,\mathrm{cm}$이고 $\angle A = 40^\circ, \angle C = 60^\circ$
### 정답
⑤
### 해설
삼각형의 유일 결정 조건을 각 보기별로 검토한다.


$\begin{aligned} \text{① } & \text{세 각의 크기만 주어지면 모양은 같으나 크기가 다른 삼각형이 무수히 많이 작도된다. (결정 안 됨)} \ \text{② } & 3 + 4 = 7 < 8\text{이므로 가장 긴 변이 나머지 두 변의 합보다 커서 삼각형 자체가 만들어지지 않는다. (불가능)} \ \text{③ } & \overline{AC}\text{의 대각은 } \angle B\text{이므로 두 각만 주어진 상태이고 변의 길이가 없어 크기가 정해지지 않는다. (결정 안 됨)} \ \text{④ } & \overline{AB}, \overline{BC}\text{의 끼인각은 } \angle B\text{인데 끼인각이 아닌 } \angle A\text{가 주어졌으므로 하나로 결정되지 않는다. (결정 안 됨)} \ \text{⑤ } & \angle B\text{의 대변은 } \overline{AC} = 6,\mathrm{cm}\text{이고, 양 끝 각 } \angle A = 40^\circ, \angle C = 60^\circ\text{가 주어졌으므로 ASA 조건에 의해 오직 하나로 결정된다. (결정됨)} \end{aligned}$


따라서 오직 하나로 결정되는 조건은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "삼각형 결정 조건 및 성립 조건 종합 판정 문항"
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
  "primaryMethod": "대변 대각의 명칭을 변환하여 한 변과 양 끝 각(ASA)이 주어진 ⑤번을 유일 결정으로 판정한다.",
  "decisiveStep": "B의 대변 AC=6cm 및 양 끝각 A, C 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형이 하나로 정해지는 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA",
    "why": "다양한 변과 각의 조건에서 삼각형의 유일 결정을 판별하는 대표 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대변-대각의 용어 변환과 삼각부등식 성립 여부를 동시에 검증해야 하는 문항",
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

## Q10
- 형식: 객관식
- 배점: 4
### 발문
직선 $m$에 평행하면서 한 점 $P$를 지나는 직선을 작도하는 과정에서 사용되는 성질과 단계에 대한 설명 중 옳지 않은 것은? [4점]
### 선지
① 컴퍼스로 같은 반지름의 호를 그려 선분의 길이가 같도록 한다. ② 엇각 또는 동위각의 크기가 같으면 두 직선이 평행하다는 성질을 이용한다. ③ 작도 결과 점 $P$를 지나는 직선 $l$은 직선 $m$과 평행하게 된다. ④ 작도 순서는 각의 크기를 잰 후 보조선을 긋는 순서로 진행된다. ⑤ 눈금 없는 자는 두 점을 연결하여 직선을 완성할 때 사용된다.
### 정답
④
### 해설
평행선 작도의 올바른 절차와 사용 원리를 검토한다.


$\begin{aligned} \text{1. } & \text{평행선 작도는 점 } P\text{를 지나 직선 } m\text{과 만나는 보조선을 '먼저' 그어야 교점이 생기므로, 보조선을 긋기 전에 각의 크기를 먼저 잴 수 없다.} \ \text{2. } & \text{따라서 작도 순서가 '각의 크기를 잰 후 보조선을 긋는다'고 설명한 ④는 명백히 옳지 않다.} \ \text{3. } & \text{나머지 보기는 컴퍼스의 길이 복사 기능, 엇각/동위각의 평행 판정 성질, 자의 용도를 바르게 기술하고 있다.} \end{aligned}$


따라서 옳지 않은 것은 ④이다.



```json
{
  "status": "EXEMPT",
  "reason": "평행선 작도의 논리적 인과관계 및 작도 원리에 대한 진위 판별 문항"
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
  "primaryMethod": "평행선 작도의 선행 필수 단계인 보조선 작도가 각 복사보다 앞서야 함을 지적한다.",
  "decisiveStep": "보조선 선행 원칙 위배 식별",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 도형의 작도",
    "l4": "평행선의 작도"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_CONVERSE_ANGLE_CHECK",
    "why": "평행선 작도의 원리와 단계별 필수 요건을 점검하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "작도 절차의 기하학적 인과관계를 바르게 이해하고 있는지 묻는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "작도",
      "평행선"
    ],
    "goal": [
      "엇각"
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
- 배점: 3
### 발문
다음 중 작도에서 컴퍼스만을 사용하여 수행하는 역할로 가장 알맞은 것은? [3점]
### 선지
① 각도기를 대어 각의 크기를 잰다. ② 주어진 선분의 길이를 재어서 다른 곳으로 옮긴다. ③ 서로 다른 두 점을 곧게 연결하여 선분을 긋는다. ④ 주어진 선분의 양쪽 끝으로 연장선을 긋는다. ⑤ 선의 두께를 일정하게 맞춘다.
### 정답
②
### 해설
작도 도구의 정의와 역할을 판정한다.


작도에서는 눈금 없는 자와 컴퍼스만을 사용한다. $\begin{aligned} \text{눈금 없는 자의 역할: } & \text{두 점을 연결하는 선분을 긋거나 선분을 연장할 때 사용한다.} \ \text{컴퍼스의 역할: } & \text{원을 그리거나, 주어진 선분의 길이를 재어서 다른 선분이나 직선 위로 옮길 때 사용한다.} \end{aligned}$


따라서 컴퍼스의 올바른 용도는 ②이다.



```json
{
  "status": "EXEMPT",
  "reason": "작도 도구인 컴퍼스의 용도를 묻는 개념 문항"
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
  "primaryMethod": "컴퍼스의 본질적 용도인 선분의 길이 이동과 원 작도 기능을 대조한다.",
  "decisiveStep": "선분 길이 재어 옮기기 역할 식별",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 도형의 작도",
    "l4": "작도의 뜻과 도구"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_CONSTRUCTION",
    "templateKey": "TPL_M1_BASIC_CONSTRUCTION_TOOL_USAGE",
    "why": "작도 도구(컴퍼스)의 표준 용도를 평가하는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "작도 도구의 정의를 직접 대조하는 1단계 기본 문항",
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

## Q12
- 형식: 객관식
- 배점: 5
### 발문
둘레의 길이가 $36,\mathrm{cm}$이고, 세 변의 길이가 각각 $a,\mathrm{cm}, a,\mathrm{cm}, b,\mathrm{cm}$인 이등변삼각형이 있다. $b$의 값이 두 자리 자연수일 때, 만들 수 있는 서로 다른 삼각형의 개수는? (단, $a, b$는 서로 다른 자연수이다.) [5점]
### 선지
① $1$개 ② $2$개 ③ $3$개 ④ $4$개 ⑤ $5$개
### 정답
③
### 해설
둘레의 길이와 삼각부등식 성질을 만족하는 자연수 순서쌍 $(a, b)$를 구한다.


둘레의 길이가 $36,\mathrm{cm}$이므로 $\begin{aligned} 2a + b &= 36 \ 2a &= 36 - b \end{aligned}$


삼각형이 성립하기 위해서는 가장 긴 변이 나머지 두 변의 합보다 작아야 하므로 $\begin{aligned} b &< a + a \ b &< 2a \ b &< 36 - b \ 2b &< 36 \ b &< 18 \end{aligned}$


$a = \dfrac{36 - b}{2}$가 자연수이어야 하므로 $b$는 짝수이어야 하고, $b$는 두 자리 자연수이므로 가능한 값은 $\begin{aligned} b \in {10, 12, 14, 16} \end{aligned}$


각 경우의 $a$를 구하고 $a \ne b$ 조건을 검증한다. $\begin{aligned} b = 10 \implies a = 13 \quad (a \ne b, \text{가능}) \ b = 12 \implies a = 12 \quad (a = b\text{이므로 제외}) \ b = 14 \implies a = 11 \quad (a \ne b, \text{가능}) \ b = 16 \implies a = 10 \quad (a \ne b, \text{가능}) \end{aligned}$


따라서 가능한 삼각형의 개수는 $3$개이다.


따라서 정답은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "정수 조건과 삼각부등식을 결합한 경우의 수 계산 문항"
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
  "primaryMethod": "2a+b=36과 b<18 부등식을 세우고 b=10, 14, 16 (b=12 정삼각형 제외) 3개를 구한다.",
  "decisiveStep": "b<18에서 짝수 후보 추출 및 a=b=12 제외",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형의 세 변의 길이 사이의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_SIDE_FEASIBILITY",
    "templateKey": "TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES",
    "why": "고정 둘레 조건에서 삼각부등식과 정수 제한조건을 연계하여 삼각형의 개수를 세는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NATURAL_NUMBER",
    "COND_RANGE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 범위 유도, 정수 짝수성 분석, 정삼각형 제외 예외 처리를 종합 수행하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "이등변삼각형",
      "길이"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "부등식"
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
서로 다른 여섯 개의 삼각형 중에서 한 변의 길이가 $5,\mathrm{cm}$이고 그 양 끝 각이 각각 $55^\circ, 65^\circ$인 삼각형과 한 변의 길이가 $5,\mathrm{cm}$이고 두 각이 $55^\circ, 60^\circ$인 삼각형이 있다. 이 두 삼각형이 서로 합동임을 바르게 나타낸 것은? [4점]
### 선지
① 합동이며, ASA 합동이다. ② 합동이며, SAS 합동이다. ③ 합동이며, SSS 합동이다. ④ 두 변의 길이가 같지 않으므로 합동이 아니다. ⑤ 합동 여부를 알 수 없다.
### 정답
①
### 해설
삼각형의 세 내각의 크기의 합은 $180^\circ$임을 이용하여 숨은 각을 구한다.


$\begin{aligned} \text{첫 번째 삼각형의 세 각: } & 55^\circ, 65^\circ, 180^\circ - (55^\circ + 65^\circ) = 60^\circ \ \text{두 번째 삼각형의 세 각: } & 55^\circ, 60^\circ, 180^\circ - (55^\circ + 60^\circ) = 65^\circ \end{aligned}$


따라서 두 번째 삼각형에서도 길이가 $5,\mathrm{cm}$인 변의 양 끝 각은 $55^\circ$와 $65^\circ$이다. 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 $\begin{aligned} \text{두 삼각형은 서로 합동이며, 합동 조건은 ASA 합동이다.} \end{aligned}$


따라서 정답은 ①이다.



```json
{
  "status": "EXEMPT",
  "reason": "내각합 180도로 숨은 양 끝 각을 계산하여 ASA 합동을 판정하는 문항"
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
  "primaryMethod": "내각합 180도에서 나머지 각 65도를 찾아 길이가 5cm인 변의 양 끝각 55도, 65도 일치(ASA)를 증명한다.",
  "decisiveStep": "180 - (55+60) = 65도 도출 및 ASA 판정",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 합동",
    "l4": "삼각형의 합동 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION",
    "why": "삼각형의 내각합과 한 변-양 끝각 정보를 연계하여 ASA 합동을 선별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 각의 합 180도를 통해 제시되지 않은 각을 복원하고 양 끝각 조건을 검증하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "각"
    ],
    "goal": [
      "합동"
    ],
    "method": [
      "내각"
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
사각형 $ABCD$의 두 대각선 $AC$와 $BD$가 점 $O$에서 서로를 수직이등분하고 있다. $\overline{AO}=3,\mathrm{cm}, \overline{BO}=4,\mathrm{cm}$일 때, 다음 설명 중 옳지 않은 것은? [4점]
### 선지
① $\overline{AB} = 5,\mathrm{cm}$이다. ② $\triangle BCD$의 넓이는 $12,\mathrm{cm}^2$이다. ③ $\overline{AB} \parallel \overline{CD}$이다. ④ 사각형 $ABCD$의 네 변의 길이는 모두 같다. ⑤ $\triangle OBC \equiv \triangle OAD$이다.
### 정답
⑤
### 해설
두 대각선이 서로를 수직이등분하므로 사각형 $ABCD$는 마름모이다.


$\begin{aligned} \text{1. } & \overline{AO} = \overline{OC} = 3,\mathrm{cm}, \overline{BO} = \overline{OD} = 4,\mathrm{cm}, \angle AOB = 90^\circ \ & \text{직각삼각형 } OAB\text{에서 } \overline{AB} = \sqrt{3^2 + 4^2} = 5,\mathrm{cm}\text{ (참)} \ \text{2. } & \triangle BCD\text{의 밑변 } \overline{BD} = 8,\mathrm{cm}, \text{높이 } \overline{OC} = 3,\mathrm{cm}\text{이므로} \ & \text{넓이} = \dfrac{1}{2} \times 8 \times 3 = 12,\mathrm{cm}^2\text{ (참)} \ \text{3. } & \text{마름모는 평행사변형이므로 마주 보는 두 변은 평행하다. } (\overline{AB} \parallel \overline{CD})\text{ (참)} \ \text{4. } & \text{마름모의 네 변의 길이는 } 5,\mathrm{cm}\text{로 모두 같다. (참)} \ \text{5. } & \triangle OBC\text{와 합동인 삼각형은 대응점 순서대로 } \triangle ODA\text{이어야 한다. } (\triangle OBC \equiv \triangle ODA) \ & \triangle OBC \equiv \triangle OAD\text{로 표기하면 } \overline{OB} = \overline{OA}\text{가 되어 거짓이다. (거짓)} \end{aligned}$


따라서 옳지 않은 것은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "대각선이 수직이등분하는 사각형의 성질 및 합동 대응점 순서 판별 문항"
}

```


```json
{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "대각선 수직이등분 성질에서 마름모를 식별하고 합동 기호의 알파벳 대응 순서 오류를 적발한다.",
  "decisiveStep": "대응점 순서 △OBC ≡ △ODA 확인",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 성질",
    "l4": "마름모의 대각선 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_QUADRILATERAL_PROPERTIES",
    "templateKey": "TPL_QUADRILATERAL_PROPERTIES",
    "why": "마름모 대각선의 수직이등분 조건에서 기하적 진위를 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "마름모의 기하학적 성질과 합동 기호 작성 규칙(대응점 일치)을 정밀하게 대조하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "대각선",
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

## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음은 어느 중학교 학생들의 턱걸이 횟수를 조사하여 나타낸 히스토그램이다. 턱걸이를 $5$번째로 많이 한 학생이 속하는 계급은? [4점]
### 선지
① $14$회 이상 $16$회 미만 ② $12$회 이상 $14$회 미만 ③ $10$회 이상 $12$회 미만 ④ $8$회 이상 $10$회 미만 ⑤ $6$회 이상 $8$회 미만
### 정답
②
### 해설
변량의 값이 큰 계급부터 도수를 차례대로 누적한다.


$\begin{aligned} 14\text{회 이상 } 16\text{회 미만: } & 1\text{명 (누적 } 1\text{명)} \ 12\text{회 이상 } 14\text{회 미만: } & 5\text{명 (누적 } 1 + 5 = 6\text{명)} \end{aligned}$


따라서 $2$번째부터 $6$번째로 턱걸이를 많이 한 학생은 모두 $12\text{회 이상 } 14\text{회 미만}$ 계급에 속한다. 그러므로 $5$번째로 많이 한 학생이 속하는 계급은 $12\text{회 이상 } 14\text{회 미만}$이다.


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "턱걸이 횟수 계급과 학생 수가 막대로 표현된 히스토그램 다이어그램"
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
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "히스토그램의 최고 계급부터 도수를 누적하여 5번째 학생이 포함되는 계급을 식별한다.",
  "decisiveStep": "상위 1명+5명=6명 누적 구간 파악",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "히스토그램·도수분포다각형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
    "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
    "why": "히스토그램에서 순위 조건에 해당하는 계급을 누적 도수로 찾는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "히스토그램의 도수를 역방향으로 누적하여 특정 순위의 계급을 찾는 기본 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "히스토그램"
    ],
    "goal": [
      "계급",
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

## Q16
- 형식: 객관식
- 배점: 3
### 발문
※ (16~17) 다음은 어느 학급 학생 $25$명의 신발 크기를 조사하여 나타낸 줄기와 잎 그림이다. 물음에 답하시오.


줄기: $20, 21, 22, 23, 24, 25$ ($20|0$은 $200\,\mathrm{mm}$)
$20 \mid 0 \quad 0 \quad 5 \quad 5$
$21 \mid 0 \quad 0 \quad 0 \quad 5 \quad 5 \quad 5$
$22 \mid 0 \quad 0 \quad 5 \quad 5 \quad 5$
$23 \mid 0 \quad 0 \quad 0 \quad 5 \quad 5$
$24 \mid 0 \quad 5 \quad 5 \quad 5$
$25 \mid 0$


신발 크기가 큰 쪽에서부터 $8$번째인 학생의 신발 크기는? [3점]
### 선지
① $220,\mathrm{mm}$ ② $225,\mathrm{mm}$ ③ $230,\mathrm{mm}$ ④ $235,\mathrm{mm}$ ⑤ $240,\mathrm{mm}$
### 정답
③
### 해설
줄기와 잎 그림에서 가장 큰 값부터 역순으로 세어 $8$번째 변량을 찾는다.


$\begin{aligned} 250,\mathrm{mm}: & \quad 1\text{명 (누적 } 1\text{명)} \ 245,\mathrm{mm}: & \quad 3\text{명 (누적 } 4\text{명)} \ 240,\mathrm{mm}: & \quad 1\text{명 (누적 } 5\text{명)} \ 235,\mathrm{mm}: & \quad 2\text{명 (누적 } 7\text{명)} \ 230,\mathrm{mm}: & \quad 3\text{명 (누적 } 10\text{명)} \end{aligned}$


상위 $7$명 다음의 $8$번째 학생은 $230,\mathrm{mm}$의 첫 번째 잎에 해당한다. 따라서 신발 크기가 $8$번째로 큰 학생의 신발 크기는 $230,\mathrm{mm}$이다.


따라서 정답은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "줄기와 잎 그림에서 순위에 해당하는 변량 값을 찾는 문항"
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
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "큰 변량부터 250(1), 245(3), 240(1), 235(2)로 7명을 확인하고 8번째 값 230mm를 도출한다.",
  "decisiveStep": "상위 7명 카운트 후 8번째 230mm 지정",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "자료에서 정보 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_ORDER_AND_VALUE",
    "templateKey": "TPL_M1_DATA_ORDER_AND_VALUE_CORE",
    "why": "줄기와 잎 그림에서 특정 순위의 변량 값을 정확히 읽는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "줄기와 잎 그림에서 잎을 큰 순서대로 계수하여 8번째 값을 읽는 문항",
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

## Q17
- 형식: 객관식
- 배점: 3
### 발문
위 16번의 자료에서 신발 크기가 $220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만인 학생은 전체의 몇 $%$인가? [3점]
### 선지
① $35%$ ② $40%$ ③ $45%$ ④ $50%$ ⑤ $55%$
### 정답
②
### 해설
주어진 구간에 속하는 학생 수를 세어 전체에 대한 백분율을 계산한다.


$220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만에 속하는 잎의 개수를 세면 $\begin{aligned} \text{줄기 } 22: & \quad 0, 0, 5, 5, 5 \implies 5\text{명} \ \text{줄기 } 23: & \quad 0, 0, 0, 5, 5 \implies 5\text{명} \ \text{해당 구간의 총 학생 수} &= 5 + 5 = 10\text{명} \end{aligned}$


전체 학생 수가 $25$명이므로 백분율을 구하면 $\begin{aligned} \dfrac{10}{25} \times 100 &= 40% \end{aligned}$


따라서 정답은 ②이다.



```json
{
  "status": "EXEMPT",
  "reason": "줄기와 잎 그림에서 구간 도수의 백분율을 계산하는 문항"
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
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "220~240 구간의 잎 10개를 세고 전체 25명에 대해 10/25*100=40%를 계산한다.",
  "decisiveStep": "10 / 25 * 100 = 40% 산출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "자료에서 정보 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_CORE",
    "why": "특정 구간에 속하는 자료의 비율을 백분율로 산출하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료에서 구간 도수를 세고 백분율 공식을 적용하는 1단계 계산 문항",
  "level": "중",
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

## Q18
- 형식: 객관식
- 배점: 4
### 발문
다음은 어느 학급 학생 $30$명의 수학 성적을 조사하여 나타낸 도수분포표이다. 다음 설명 중 옳지 않은 것은? [4점]


$\begin{array}{|c|c|} \hline \text{성적}(\text{점}) & \text{학생 수}(\text{명}) \\ \hline 50^{\text{이상}} \sim 60^{\text{미만}} & 4 \\ 60 \sim 70 & 5 \\ 70 \sim 80 & 7 \\ 80 \sim 90 & 8 \\ 90 \sim 100 & 6 \\ \hline \text{합계} & 30 \\ \hline \end{array}$
### 선지
① 계급의 크기는 $10$점이다. ② 계급의 개수는 $5$개이다. ③ 성적이 $70$점 이상 $80$점 미만인 계급의 도수는 $7$명이다. ④ 성적이 $70$점 미만인 학생은 전체의 $30%$이다. ⑤ 성적이 $9$번째로 높은 학생이 속하는 계급의 도수는 $7$명이다.
### 정답
⑤
### 해설
도수분포표의 각 항목과 보기를 검토한다.


$\begin{aligned} \text{① } & \text{계급의 크기는 구간의 너비이므로 } 60 - 50 = 10\text{점이다. (참)} \ \text{② } & \text{계급은 } 5\text{개이다. (참)} \ \text{③ } & 70 \sim 80\text{점 계급의 도수는 } 7\text{명이다. (참)} \ \text{④ } & 70\text{점 미만인 학생 수는 } 4 + 5 = 9\text{명이고, } \dfrac{9}{30} \times 100 = 30%\text{이다. (참)} \ \text{⑤ } & \text{성적이 가장 높은 계급 } (90 \sim 100\text{점})에 } 6\text{명이 속하므로, 상위 } 9\text{번째 학생은 그다음 계급인 } 80 \sim 90\text{점 계급에 속한다.} \ & \text{이 계급의 도수는 } 8\text{명이므로, } 7\text{명이라고 기술한 것은 옳지 않다. (거짓)} \end{aligned}$


따라서 옳지 않은 것은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "도수분포표의 계급 크기, 개수, 도수, 백분율, 순위 계급 진위 판정 문항"
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
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "상위 6명이 90~100점 계급이므로 9번째 학생이 속하는 계급은 80~90점(도수 8명)임을 밝혀 ⑤를 기각한다.",
  "decisiveStep": "상위 9번째 학생의 계급 도수가 8명임을 확인",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF",
    "why": "도수분포표의 계급 요소와 누적 순위 계급 도수를 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도수분포표의 기본 용어와 상위 순위 누적 도수를 대조하여 오류를 찾는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표"
    ],
    "goal": [
      "계급",
      "도수"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q19
- 형식: 객관식
- 배점: 5
### 발문
다음은 학생 $40$명의 영어 성적을 조사하여 나타낸 도수분포다각형이다. 각 계급별 도수가 $50\sim60$점: $2$명, $60\sim70$점: $7$명, $70\sim80$점: $15$명, $80\sim90$점: $9$명, $90\sim100$점: $7$명일 때, 하위 $25%$에 속하는 학생들에게 보충 수업을 실시하려고 한다. 보충 수업 대상에서 확실히 제외되기 위해 적어도 몇 점 이상을 받아야 하는가? [5점]
### 선지
① $50$점 ② $60$점 ③ $70$점 ④ $80$점 ⑤ $90$점
### 정답
④
### 해설
하위 인원수를 누적하여 커트라인이 속하는 계급을 파악한다.


전체 $40$명의 하위 $25%$에 해당하는 인원수는 $\begin{aligned} 40 \times 0.25 &= 10\text{명} \end{aligned}$


낮은 점수부터 도수를 누적하면 $\begin{aligned} 50 \sim 60\text{점: } & 2\text{명} \ 60 \sim 70\text{점: } & 7\text{명} \implies 70\text{점 미만 누적 } 2 + 7 = 9\text{명} \ 70 \sim 80\text{점: } & 15\text{명} \implies 80\text{점 미만 누적 } 9 + 15 = 24\text{명} \end{aligned}$


하위 $10$번째 학생은 $70 \sim 80$점 계급에 포함된다. 따라서 $70$점 이상 $80$점 미만을 받으면 점수에 따라 하위 $10$명(보충 수업 대상)에 포함될 수 있으므로, 보충 수업 대상에서 확실히 벗어나기 위해서는 적어도 $80$점 이상을 받아야 한다.


따라서 정답은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "영어 성적 계급과 점들이 선분으로 연결된 도수분포다각형 다이어그램"
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
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "하위 25%인 10명이 70~80점 계급에 걸치므로 확실한 제외를 위한 최소 점수를 계급 상한인 80점으로 도출한다.",
  "decisiveStep": "하위 10번째가 속한 70~80점 계급 상한인 80점 판정",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "히스토그램·도수분포다각형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF",
    "why": "도수분포에서 특정 누적 비율 기준을 벗어나기 위한 경계값을 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "누적 비율 계산과 계급 내 불확실성을 고려하여 확실한 안전 점수를 도출하는 응용 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "도수분포다각형"
    ],
    "goal": [
      "계급값",
      "도수"
    ],
    "method": [
      "백분율",
      "사칙연산"
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
다음은 학생 $50$명이 지난 $1$년 동안 저축한 금액을 조사하여 나타낸 도수분포다각형인데, $4$만 원 이상 $5$만 원 미만인 부분이 찢어져서 보이지 않는다. 다음 설명 중 옳은 것은? [4점]
### 선지
① 계급의 개수는 $8$개이다. ② $4$만 원 이상 $5$만 원 미만인 계급의 도수는 $9$명이다. ③ $4$만 원 이상인 학생 수는 $31$명이다. ④ $3$만 원 미만인 학생 수는 $3$만 원 이상인 학생 수의 $9$배이다. ⑤ $3$만 원 미만인 학생은 전체의 $10\%$이다.
### 정답
⑤
### 해설
그래프에서 확인할 수 있는 자료를 바탕으로 보기를 검증한다.


전체 학생 수는 $50$명이다. 그래프에서 $3$만 원 미만인 계급의 도수를 합산하면 $\begin{aligned} 1\text{만} \sim 2\text{만 원: } & 2\text{명} \ 2\text{만} \sim 3\text{만 원: } & 3\text{명} \ \text{합계: } & 2 + 3 = 5\text{명} \end{aligned}$


전체 $50$명에 대한 백분율을 계산하면 $\begin{aligned} \dfrac{5}{50} \times 100 &= 10% \end{aligned}$


따라서 옳은 설명은 “$3$만 원 미만인 학생은 전체의 $10%$이다.”이다.


따라서 정답은 ⑤이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "저축 금액 도수분포다각형의 한 계급 부분이 찢겨진 손상 그래프 다이어그램"
}

```


```json
{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "3만원 미만의 온전한 두 계급 도수 2명+3명=5명을 합산하고 5/50*100=10%임을 입증한다.",
  "decisiveStep": "5 / 50 * 100 = 10% 확인",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "자료에서 정보 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY",
    "why": "일부가 훼손된 도수분포다각형에서 온전한 구간의 비율을 바르게 추론하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프의 훼손 부위에 구애받지 않고 온전한 구간의 데이터를 선별하여 백분율을 도출하는 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "도수분포다각형"
    ],
    "goal": [
      "백분율",
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

## Q21
- 형식: 서답형
- 배점: 6
### 발문
다음 그림에서 $\angle AOB$가 평각이고 $\angle AOC = 90^\circ$이다. $\angle COD = \dfrac{1}{3}\angle AOD$이고, $\angle DOE = \dfrac{4}{5}\angle EOB$일 때, $\angle COE$의 크기를 구하고 그 풀이 과정을 서술하시오. [6점]
### 선지
없음
### 정답
$65^\circ$
### 해설
$\angle AOB = 180^\circ$이고 $\angle AOC = 90^\circ$이다.


$\angle COD = x^\circ$라 하면 $\angle AOD = 90^\circ + x$이다. 문제의 조건 $\angle COD = \dfrac{1}{3}\angle AOD$에 의하여 $\begin{aligned} x &= \dfrac{1}{3}(90 + x) \ 3x &= 90 + x \ 2x &= 90 \ x &= 45^\circ \end{aligned}$


따라서 $\angle COD = 45^\circ$이므로 $\angle DOB$의 크기는 $\begin{aligned} \angle DOB &= 180^\circ - \angle AOD \ &= 180^\circ - (90^\circ + 45^\circ) \ &= 45^\circ \end{aligned}$


다음으로 $\angle DOE = y^\circ$라 하면 $\angle EOB = 45^\circ - y$이다. 조건 $\angle DOE = \dfrac{4}{5}\angle EOB$에 의하여 $\begin{aligned} y &= \dfrac{4}{5}(45 - y) \ 5y &= 180 - 4y \ 9y &= 180 \ y &= 20^\circ \end{aligned}$


따라서 $\angle DOE = 20^\circ$이다. 구하는 $\angle COE$의 크기는 $\begin{aligned} \angle COE &= \angle COD + \angle DOE \ &= 45^\circ + 20^\circ \ &= 65^\circ \end{aligned}$


답: $65^\circ$



```json
{
  "status": "UNSUPPORTED",
  "reason": "평각 AOB 위에 직각 AOC와 반직선 OD, OE가 분할된 각 다이어그램"
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
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "x=1/3(90+x)에서 COD=45도를 구하고 y=4/5(45-y)에서 DOE=20도를 구해 COE=65도를 산출한다.",
  "decisiveStep": "방정식으로 x=45도, y=20도 도출 후 합산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "각",
    "l4": "평각과 각의 비례 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_INTERSECTING_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO",
    "why": "평각 내 분할된 각의 비율 관계를 일차방정식으로 풀어 각을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2개의 독립된 일차방정식을 세워 미지각을 각각 구한 후 합성하는 정통 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "각"
    ],
    "goal": [
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

## Q22
- 형식: 서답형
- 배점: 7
### 발문
다음은 어느 학급 학생 $25$명이 지난 $1$년 동안 관람한 영화 편수를 조사하여 나타낸 도수분포표이다. $6$편 이상의 영화를 관람한 학생이 전체의 $32%$일 때, $A, B$의 값과 $4$편 미만의 영화를 관람한 학생은 전체의 몇 $%$인지 구하고, 그 과정을 서술하시오. [7점]


$\begin{array}{|c|c|} \hline \text{영화 편수}(\text{편}) & \text{학생 수}(\text{명}) \\ \hline 0^{\text{이상}} \sim 2^{\text{미만}} & 4 \\ 2 \sim 4 & A \\ 4 \sim 6 & 3 \\ 6 \sim 8 & B \\ 8 \sim 10 & 2 \\ \hline \text{합계} & 25 \\ \hline \end{array}$
### 선지
없음
### 정답
$A=10, B=6, 56%$
### 해설
1. 전체 $25$명의 $32%$에 해당하는 학생 수를 구한다. $\begin{aligned} 25 \times 0.32 &= 8\text{명} \end{aligned}$


$6$편 이상 관람한 학생은 $6 \sim 8$편 계급과 $8 \sim 10$편 계급의 도수의 합이므로 $\begin{aligned} B + 2 &= 8 \ B &= 6 \end{aligned}$


2. 전체 도수의 합이 $25$명이므로 $\begin{aligned} 4 + A + 3 + B + 2 &= 25 \ 4 + A + 3 + 6 + 2 &= 25 \ A + 15 &= 25 \ A &= 10 \end{aligned}$


3. $4$편 미만의 영화를 관람한 학생 수는 $0 \sim 2$편 계급과 $2 \sim 4$편 계급의 합이므로 $\begin{aligned} 4 + A &= 4 + 10 \ &= 14\text{명} \end{aligned}$


따라서 $4$편 미만인 학생의 백분율은 $\begin{aligned} \dfrac{14}{25} \times 100 &= 56% \end{aligned}$


답: $A = 10, B = 6, 56%$



```json
{
  "status": "EXEMPT",
  "reason": "도수분포표의 누적 백분율 조건으로부터 미지수 A, B 및 구간 백분율을 도출하는 서술형 문항"
}

```


```json
{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_ORGANIZATION",
  "primaryMethod": "25*0.32=8에서 B=6을 구하고 합계 25에서 A=10을 구한 후 14/25*100=56%를 산출한다.",
  "decisiveStep": "B=6, A=10 도출 및 14명 백분율 56% 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT",
    "why": "도수분포표의 비율 조건에서 복수의 미지 도수를 복원하고 백분율을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상위 비율로 B를 결정하고 총합으로 A를 결정한 후 구간 백분율을 단계별로 서술하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표"
    ],
    "goal": [
      "도수",
      "백분율"
    ],
    "method": [
      "사칙연산",
      "비율"
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
다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다. $\angle BED=56^\circ, \angle BAC=34^\circ$일 때, 삼각형의 합동을 이용하여 선분 $CD$의 길이를 구하고 그 풀이 과정을 서술하시오. [7점]
### 선지
없음
### 정답
$3,\mathrm{cm}$
### 해설
$\triangle ABC$와 $\triangle BDE$에서 각의 크기를 계산한다.


$\triangle ABC$에서 $\angle ABC = 90^\circ, \angle BAC = 34^\circ$이므로 $\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 34^\circ \ &= 56^\circ \end{aligned}$


$\triangle BDE$에서 $\angle BDE = 90^\circ, \angle BED = 56^\circ$이므로 $\begin{aligned} \angle DBE &= 180^\circ - 90^\circ - 56^\circ \ &= 34^\circ \end{aligned}$


따라서 $\triangle ACB$와 $\triangle BED$에서 $\begin{aligned} \angle BAC &= \angle DBE = 34^\circ \ \angle ACB &= \angle BED = 56^\circ \ \overline{AC} &= \overline{BE} \quad (\text{주어진 조건}) \end{aligned}$ 이므로 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같다. $\begin{aligned} \therefore \triangle ACB \equiv \triangle BED \quad (\text{ASA 합동}) \end{aligned}$


합동인 두 삼각형에서 대응변의 길이는 서로 같으므로 $\begin{aligned} \overline{BD} &= \overline{AB} = 7,\mathrm{cm} \ \overline{BC} &= \overline{DE} = 4,\mathrm{cm} \end{aligned}$


따라서 선분 $CD$의 길이는 $\begin{aligned} \overline{CD} &= \overline{BD} - \overline{BC} \ &= 7 - 4 \ &= 3,\mathrm{cm} \end{aligned}$


답: $3,\mathrm{cm}$



```json
{
  "status": "UNSUPPORTED",
  "reason": "직각삼각형 ABC와 BDE가 선분 BCD 위에 놓여 합동 관계를 이루는 기하 다이어그램"
}

```


```json
{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "직각삼각형 내각합으로 56도, 34도를 유도하여 ASA 합동을 밝히고 BD(7)-BC(4)=3cm를 산출한다.",
  "decisiveStep": "△ACB ≡ △BED (ASA) 증명 및 CD = 7 - 4 = 3cm 계산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 합동",
    "l4": "삼각형의 합동 조건의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE",
    "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE",
    "why": "직각삼각형의 여각 관계를 통해 ASA 합동을 보이고 대응변의 차로 선분 길이를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직각삼각형의 여각 성질로 양 끝각 일치를 증명하고 대응변의 차를 구하는 종합 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "합동"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "내각",
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}

```
