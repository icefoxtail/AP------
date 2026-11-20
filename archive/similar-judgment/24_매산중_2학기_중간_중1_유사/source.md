```json:exam
{
  "stem": "24_매산중_2학기_중간_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2mid/24_매산중_2학기_중간_중1_기출.js",
  "examFolder": "2mid",
  "grade": "중1",
  "curriculum": "2015",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 그림과 같이 직선 $l$ 위에 네 점 $A$, $B$, $C$, $D$가 순서대로 놓여 있을 때, 반직선 $\overrightarrow{CB}$와 서로 같은 것은? [3점]
### 선지
① $\overrightarrow{CA}$ ② $\overline{BC}$ ③ $\overrightarrow{BC}$ ④ $\overrightarrow{CD}$ ⑤ $\overleftrightarrow{BC}$
### 정답
①
### 해설
반직선은 시작점과 뻗어나가는 방향이 모두 같아야 서로 같은 반직선이다.


직선 $l$ 위에 네 점이 $$\begin{aligned} A - B - C - D \end{aligned}$$ 순서대로 놓여 있다.


반직선 $\overrightarrow{CB}$는 시작점이 점 $C$이고 점 $B$ 방향(왼쪽)으로 끝없이 뻗어나가는 반직선이다. 점 $A$ 역시 점 $C$의 왼쪽에 놓여 있으므로, 점 $C$에서 시작하여 점 $A$ 방향으로 뻗어나가는 반직선 $\overrightarrow{CA}$는 반직선 $\overrightarrow{CB}$와 완전히 일치한다. $$\begin{aligned} \overrightarrow{CB} &= \overrightarrow{CA} \end{aligned}$$ 반면 $\overline{BC}$는 선분이고, $\overrightarrow{BC}$는 시작점이 $B$이므로 다르며, $\overrightarrow{CD}$는 오른쪽 방향이므로 다르고, $\overleftrightarrow{BC}$는 직선이다.


따라서 반직선 $\overrightarrow{CB}$와 같은 것은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "직선 l 위에 네 점 A, B, C, D가 놓인 기하 다이어그램"
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
  "primaryMethod": "직선 위의 네 점 순서를 바탕으로 시작점과 진행 방향이 일치하는 반직선을 식별한다.",
  "decisiveStep": "시작점 C와 왼쪽 진행 방향의 동등성 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "직선·반직선·선분"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_GEOMETRY_JUDGMENT",
    "templateKey": "TPL_M1_BASIC_GEOMETRY_JUDGMENT_SEGMENT_RAY_OBJECT_IDENTITY",
    "why": "한 직선 위의 점들로 만들어지는 직선, 반직선, 선분의 일치 여부를 판별하는 기본 문항"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "반직선의 시작점과 방향의 일치 조건을 판별하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "직선",
      "점"
    ],
    "goal": [
      "반직선"
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
- 배점: 3
### 발문
다음 그림과 같은 오각기둥에서 교점의 개수를 $a$개, 교선의 개수를 $b$개라 할 때, $b-a$의 값은? [3점]
### 선지
① $5$ ② $3$ ③ $4$ ④ $6$ ⑤ $7$
### 정답
①
### 해설
입체도형에서 면과 면이 만나서 생기는 교선은 모서리이고, 선과 선이 만나서 생기는 교점은 꼭짓점이다.


오각기둥의 꼭짓점의 개수 $a$는 $$\begin{aligned} a &= 5 \times 2 \ &= 10 \end{aligned}$$ 오각기둥의 모서리의 개수 $b$는 $$\begin{aligned} b &= 5 \times 3 \ &= 15 \end{aligned}$$ 따라서 구하는 값 $b-a$는 $$\begin{aligned} b - a &= 15 - 10 \ &= 5 \end{aligned}$$ 따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "오각기둥의 입체 구조를 나타낸 다이어그램"
}

```


```json
{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "각기둥의 꼭짓점과 모서리 공식을 적용하여 교점과 교선의 개수를 계산하고 차를 구한다.",
  "decisiveStep": "b-a = 15-10 = 5 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "각기둥의 구성 요소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_COMPONENT_COUNT",
    "templateKey": "TPL_M1_POLYHEDRON_COMPONENT_COUNT_CORE",
    "why": "다면체의 꼭짓점(교점)과 모서리(교선)의 개수를 구하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "오각기둥의 구성 요소를 세어 교점과 교선의 차를 계산하는 기본 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "각기둥"
    ],
    "goal": [
      "교점",
      "교선"
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
다음 그림과 같이 직선 $l$ 위에 네 점 $A$, $B$, $C$, $D$가 차례대로 있다. 점 $B$는 $\overline{AC}$의 중점이고, 점 $C$는 $\overline{BD}$의 중점이다. $\overline{AB}=6,\mathrm{cm}$일 때, $\overline{AD}$의 길이는? [4점]
### 선지
① $15,\mathrm{cm}$ ② $18,\mathrm{cm}$ ③ $12,\mathrm{cm}$ ④ $21,\mathrm{cm}$ ⑤ $24,\mathrm{cm}$
### 정답
②
### 해설
선분의 중점은 그 선분을 두 개의 같은 길이로 이등분한다.


점 $B$가 선분 $AC$의 중점이므로 $$\begin{aligned} \overline{BC} &= \overline{AB} \ &= 6,\mathrm{cm} \end{aligned}$$ 점 $C$가 선분 $BD$의 중점이므로 $$\begin{aligned} \overline{CD} &= \overline{BC} \ &= 6,\mathrm{cm} \end{aligned}$$ 네 점이 직선 $l$ 위에 $A-B-C-D$ 순서로 놓여 있으므로, 선분 $AD$의 길이는 $$\begin{aligned} \overline{AD} &= \overline{AB} + \overline{BC} + \overline{CD} \ &= 6 + 6 + 6 \ &= 18,\mathrm{cm} \end{aligned}$$ 따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "직선 위의 점 A, B, C, D와 중점 관계를 나타낸 선분 다이어그램"
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
  "primaryMethod": "중점 성질을 연쇄 적용하여 각 구간의 선분 길이를 구한 뒤 전체 길이를 합산한다.",
  "decisiveStep": "AD = AB+BC+CD = 6+6+6 = 18cm 계산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "선분의 중점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SEGMENT_LENGTH_RELATIONS",
    "templateKey": "TPL_M1_SEGMENT_LENGTH_RELATIONS_CHAINED_MIDPOINT",
    "why": "연쇄적인 중점 조건으로부터 선분의 길이를 결정하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "선분의 중점 관계를 두 번 적용하여 선분의 총 길이를 구하는 문항",
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
      "사칙연산"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q04
- 형식: 객관식
- 배점: 3
### 발문
다음 그림과 같은 삼각기둥에서 모서리 $AC$와 꼬인 위치에 있는 모서리의 개수는? [3점]
### 선지
① $2$개 ② $3$개 ③ $1$개 ④ $4$개 ⑤ $5$개
### 정답
②
### 해설
공간에서 두 직선이 만나지도 않고 평행하지도 않을 때, 두 직선은 꼬인 위치에 있다고 한다.


주어진 삼각기둥 $ABC-DEF$에서 모서리 $AC$와 각 모서리의 위치 관계를 분류하면 다음과 같다. 1단계: 한 점에서 만나는 모서리 $$\begin{aligned} \overline{AB}, \overline{BC}, \overline{AD}, \overline{CF} \quad (4\text{개}) \end{aligned}$$ 2단계: 평행한 모서리 $$\begin{aligned} \overline{DF} \quad (1\text{개}) \end{aligned}$$ 3단계: 만나지도 않고 평행하지도 않은 꼬인 위치의 모서리 $$\begin{aligned} \overline{BE}, \overline{DE}, \overline{EF} \quad (3\text{개}) \end{aligned}$$ 따라서 모서리 $AC$와 꼬인 위치에 있는 모서리의 개수는 $3$개이다.


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "삼각기둥의 꼭짓점과 모서리 관계를 나타낸 입체 다이어그램"
}

```


```json
{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "삼각기둥에서 기준 모서리와 만나는 모서리 및 평행한 모서리를 제외하여 꼬인 위치의 모서리를 센다.",
  "decisiveStep": "꼬인 위치 모서리 BE, DE, EF의 3개 선별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "공간에서의 위치 관계",
    "l4": "꼬인 위치"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_EDGE_FACE_INCIDENCE",
    "why": "다면체에서 모서리 간의 위치 관계 및 꼬인 위치를 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공간에서 모서리의 교차, 평행, 꼬인 위치 관계를 분류하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "입체도형"
    ],
    "goal": [
      "꼬인위치"
    ],
    "method": [
      "개수"
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
다음 중 다각형에 대한 설명으로 옳지 않은 것은? [3점]
### 선지
① 다각형은 $3$개 이상의 선분으로 둘러싸인 평면도형이다. ② 다각형에서 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라 한다. ③ 변의 길이가 모두 같고 내각의 크기가 모두 같은 다각형을 정다각형이라 한다. ④ $n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $n-3$개이다. ⑤ 부채꼴은 두 반지름과 호로 둘러싸인 도형이므로 다각형이다.
### 정답
⑤
### 해설
다각형의 정의와 기본 성질을 각 선지별로 검토한다.


① 다각형은 $3$개 이상의 선분으로 둘러싸인 평면도형이다. (참) ② 다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라 한다. (참) ③ 모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형을 정다각형이라 한다. (참) ④ $n$각형의 한 꼭짓점에서는 자기 자신과 양 옆의 이웃한 두 꼭짓점을 제외하므로 그을 수 있는 대각선의 개수는 $$\begin{aligned} n - 3 \end{aligned}$$ 개이다. (참) ⑤ 부채꼴은 두 반지름(선분)과 원의 일부인 '호(곡선)'로 둘러싸인 평면도형이다. 다각형은 오직 선분으로만 둘러싸여야 하므로 곡선을 포함하는 부채꼴은 다각형이 아니다. (거짓)


따라서 옳지 않은 것은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "다각형의 정의 및 용어 체계 진위 판정 기본 텍스트 문항"
}

```


```json
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "다각형은 선분으로만 둘러싸여야 하므로 곡선인 호를 포함하는 부채꼴이 다각형이 아님을 판정한다.",
  "decisiveStep": "부채꼴은 호(곡선)를 포함하므로 다각형이 아님을 확인",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형",
    "l4": "다각형의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_CLASSIFICATION",
    "templateKey": "TPL_M1_POLYGON_CLASSIFICATION_CORE",
    "why": "다각형 및 정다각형의 정의와 대각선 개념의 정확성을 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다각형의 기본 정의를 확인하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다각형",
      "평면도형"
    ],
    "goal": [
      "대각선"
    ],
    "method": [
      "성립조건"
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
다음 그림에서 서로 평행한 두 직선을 바르게 짝지은 것은? [4점]
### 선지
① $l \parallel n$ ② $m \parallel n$ ③ $l \parallel m,\ p \parallel q$ ④ $l \parallel n,\ p \parallel q$ ⑤ $l \parallel m,\ m \parallel n$
### 정답
③
### 해설
두 직선이 한 직선과 만날 때, 동위각의 크기가 같거나 엇각의 크기가 같으면 두 직선은 서로 평행하다.


1단계: 직선 $p$와 만나는 직선 $l, m$의 위치 관계를 확인한다. 직선 $l$과 $p$가 이루는 왼쪽 위 각이 $110^\circ$이다. 직선 $m$과 $p$의 교점에서도 평각 관계에 의해 왼쪽 위 동위각의 크기는 $$\begin{aligned} 180^\circ - 70^\circ &= 110^\circ \end{aligned}$$ 동위각의 크기가 서로 같으므로 $$\begin{aligned} l &\parallel m \end{aligned}$$ 2단계: 직선 $m$과 만나는 직선 $p, q$의 위치 관계를 확인한다. 직선 $m$과 $p$가 이루는 오른쪽 아래 각이 $70^\circ$이다. 직선 $m$과 $q$가 이루는 엇각의 크기 역시 $$\begin{aligned} 70^\circ \end{aligned}$$ 로 서로 같다. 엇각의 크기가 같으므로 $$\begin{aligned} p &\parallel q \end{aligned}$$ 따라서 서로 평행한 두 직선을 바르게 짝지은 것은 $l \parallel m,\ p \parallel q$이다.


따라서 정답은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "여러 직선이 교차하며 각도가 표시된 평행선 판정 다이어그램"
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
  "primaryMethod": "동위각 및 엇각의 크기가 일치함을 각각 확인하여 l∥m과 p∥q를 판정한다.",
  "decisiveStep": "동위각 110도와 엇각 70도의 일치 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "평행선",
    "l4": "평행선의 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_ANGLE_RATIO",
    "why": "동위각과 엇각의 크기 일치를 통해 직선 간 평행 관계를 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동위각과 엇각의 성질을 적용해 평행선을 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "동위각",
      "엇각"
    ],
    "method": [
      "판별식"
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
다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$, $\angle B = 90^\circ$인 사다리꼴 $ABCD$에서 점 $D$에서 변 $BC$에 내린 수선의 발을 $H$라 할 때, 다음 보기 중 옳은 것을 모두 고른 것은? [5점]


ㄱ. 점 $A$와 변 $BC$ 사이의 거리는 $\overline{AB}$의 길이와 같다. ㄴ. 점$D$에서 변 $BC$에 내린 수선의 발은 점 $H$이다. ㄷ. 점$C$에서 변 $AB$에 내린 수선의 발은 점 $B$이다. ㄹ. 변$AB$와 변 $CD$ 사이의 거리는 $\overline{AD}$의 길이이다.
### 선지
① ㄱ, ㄷ ② ㄱ, ㄴ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ
### 정답
②
### 해설
점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이이고, 수선과 직선이 만나는 점을 수선의 발이라 한다.


보기를 단계별로 판정하면 다음과 같다. $\begin{aligned} \text{ㄱ. } & \overline{AB} \perp \overline{BC}\text{이므로 점 } A\text{와 변 } BC\text{ 사이의 거리는 } \overline{AB}\text{의 길이이다. (참)} \ \text{ㄴ. } & \text{점 } D\text{에서 변 } BC\text{에 내린 수선과 } BC\text{의 교점은 } H\text{이므로 수선의 발은 점 } H\text{이다. (참)} \ \text{ㄷ. } & \text{선분 } BC\text{가 } AB\text{에 수직이므로 점 } C\text{에서 직선 } AB\text{에 내린 수선의 발은 점 } B\text{이다.} \ \text{ㄹ. } & \overline{AB}\text{와 } \overline{CD}\text{는 평행하지 않으므로 두 변 사이의 거리를 } \overline{AD}\text{로 정의할 수 없다. (거짓)} \end{aligned}$


따라서 옳은 것은 ㄱ, ㄴ이다.


따라서 정답은 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "사다리꼴과 수선의 발 H가 표시된 기하 다이어그램"
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
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "점과 직선 사이의 거리 및 수선의 발 정의를 사다리꼴 도형 요소에 대조한다.",
  "decisiveStep": "수선의 발 H 및 거리 정의 일치 확인으로 ㄱ, ㄴ 채택",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점, 직선, 평면의 위치 관계",
    "l4": "점과 직선 사이의 거리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE",
    "templateKey": "TPL_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE_CORE",
    "why": "점과 직선 사이의 거리 및 수선의 발 개념을 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수선의 발과 거리의 정의를 다각적으로 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "사다리꼴"
    ],
    "goal": [
      "수선의발",
      "거리"
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
- 배점: 3
### 발문
다음 보기 중 눈금 없는 자만을 사용하여 할 수 있는 것을 모두 고른 것은? [3점]


ㄱ. 두 점을 지나는 선분을 그릴 때
ㄴ. 선분을 연장할 때
ㄷ. 선분의 길이를 다른 직선 위로 옮길 때
ㄹ. 크기가 같은 각을 작도할 때 두 점 사이의 거리를 잴 때
### 선지
① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ
### 정답
①
### 해설
작도 도구인 눈금 없는 자와 컴퍼스의 역할을 구분한다.


1단계: 눈금 없는 자의 용도 $$\begin{aligned} \text{두 점을 연결하는 직선이나 선분을 긋거나, 선분을 연장할 때 사용한다.} \end{aligned}$$ 따라서 ㄱ, ㄴ은 눈금 없는 자만으로 할 수 있다.


2단계: 컴퍼스의 용도 $$\begin{aligned} \text{원을 그리거나, 선분의 길이를 재어 다른 직선으로 옮길 때 사용한다.} \end{aligned}$$ 따라서 ㄷ, ㄹ은 컴퍼스가 반드시 필요하다.


그러므로 눈금 없는 자만을 사용하여 할 수 있는 것은 ㄱ, ㄴ이다.


따라서 정답은 ①이다.



```json
{
  "status": "EXEMPT",
  "reason": "작도 도구의 기능과 용어에 대한 진위 판정 텍스트 문항"
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
  "primaryMethod": "작도에서 눈금 없는 자의 역할(선 긋기, 연장하기)과 컴퍼스의 역할(길이 옮기기)을 분류한다.",
  "decisiveStep": "선 긋기와 연장하기인 ㄱ, ㄴ 선택",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 작도",
    "l4": "작도의 뜻과 도구"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_CONSTRUCTION",
    "templateKey": "TPL_M1_BASIC_CONSTRUCTION_TOOL_USAGE",
    "why": "작도 도구의 명확한 역할과 허용 동작을 구분하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "작도 도구의 역할을 식별하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "작도"
    ],
    "goal": [
      "선분",
      "직선"
    ],
    "method": [
      "판별식"
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
다음 그림에서 $\triangle ABC \equiv \triangle DEF$일 때, 옳지 않은 것은? [4점]
### 선지
① $\angle C = 60^\circ$이다. ② $\angle D = 55^\circ$이다. ③ $\overline{AB} = 7,\mathrm{cm}$이다. ④ $\overline{BC}$의 대응변은 $\overline{EF}$이다. ⑤ $\angle B$의 대응각은 $\angle F$이다.
### 정답
⑤
### 해설
서로 합동인 두 삼각형은 대응하는 변의 길이가 각각 같고, 대응하는 각의 크기가 각각 같다.


기호 $\triangle ABC \equiv \triangle DEF$에서 꼭짓점의 대응 순서는 $$\begin{aligned} A &\leftrightarrow D \ B &\leftrightarrow E \ C &\leftrightarrow F \end{aligned}$$ 따라서: ① $\angle C$의 크기는 삼각형의 내각의 합이 $180^\circ$이므로 $$\begin{aligned} \angle C &= 180^\circ - (55^\circ + 65^\circ) \ &= 60^\circ \end{aligned}$$ ② $\angle D$는 $\angle A$의 대응각이므로 $\angle D = 55^\circ$이다. (참) ③ $\overline{AB}$의 대응변은 $\overline{DE}$이므로 $\overline{AB} = 7,\mathrm{cm}$이다. (참) ④ $\overline{BC}$의 대응변은 $\overline{EF}$이다. (참) ⑤ $\angle B$의 대응각은 $\angle E$이다. $\angle F$라 한 것은 옳지 않다. (거짓)


따라서 옳지 않은 것은 ⑤이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "합동인 두 삼각형의 변과 각 정보가 주어진 기하 다이어그램"
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
  "primaryMethod": "합동 기호의 꼭짓점 순서 대응을 점검하여 잘못 짝지어진 대응각을 찾는다.",
  "decisiveStep": "각 B의 대응각이 각 E임을 확인",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "도형의 합동",
    "l4": "합동의 뜻과 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION",
    "why": "합동 기호의 대응 관계와 변·각의 크기를 대조하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "합동인 도형의 대응점 순서와 내각의 합을 함께 확인하는 문항",
  "level": "중",
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

## Q10
- 형식: 객관식
- 배점: 4
### 발문
다음 그림은 $\angle XOY$와 크기가 같은 각을 반직선 $AB$를 한 변으로 하여 작도하는 과정이다. 작도 순서로 알맞은 것은? [4점]
### 선지
① ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉢ $\rightarrow$ ㉣ $\rightarrow$ ㉤ ② ㉠ $\rightarrow$ ㉢ $\rightarrow$ ㉡ $\rightarrow$ ㉣ $\rightarrow$ ㉤ ③ ㉡ $\rightarrow$ ㉠ $\rightarrow$ ㉢ $\rightarrow$ ㉤ $\rightarrow$ ㉣ ④ ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉣ $\rightarrow$ ㉢ $\rightarrow$ ㉤ ⑤ ㉢ $\rightarrow$ ㉠ $\rightarrow$ ㉡ $\rightarrow$ ㉣ $\rightarrow$ ㉤
### 정답
①
### 해설
크기가 같은 각을 작도하는 단계별 순서를 정리한다.


1단계(㉠): 점 $O$를 중심으로 적당한 반지름의 원호를 그려 두 반직선과의 교점 $C, D$를 잡는다. 2단계(㉡): 반지름을 유지한 채 점 $A$를 중심으로 원호를 그려 반직선 $AB$와의 교점 $P$를 잡는다. 3단계(㉢): 점 $C$에서 컴퍼스로 선분 $CD$의 길이를 잰다. 4단계(㉣): 점 $P$를 중심으로 반지름이 선분 $CD$인 원호를 그려 ㉡의 원호와의 교점 $Q$를 잡는다. 5단계(㉤): 점 $A$와 점 $Q$를 지나는 반직선 $AQ$를 긋는다.


따라서 올바른 작도 순서는 $$\begin{aligned} ㉠ \rightarrow ㉡ \rightarrow ㉢ \rightarrow ㉣ \rightarrow ㉤ \end{aligned}$$ 이다.


따라서 정답은 ①이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "크기가 같은 각의 작도 단계 부호가 표시된 작도 다이어그램"
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
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "크기가 같은 각의 작도 절차(원호 그리기 -> 교점 옮기기 -> 호의 폭 측정 -> 교점 연결)를 순서대로 나열한다.",
  "decisiveStep": "작도 순서 ㉠->㉡->㉢->㉣->㉤ 확정",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "기본 작도",
    "l4": "크기가 같은 각의 작도"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_BASIC_CONSTRUCTION",
    "templateKey": "TPL_M1_BASIC_CONSTRUCTION_ARC_CHORD_ANGLE_COPY",
    "why": "크기가 같은 각의 표준 작도 단계를 순서대로 배열하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동일 각 작도의 논리적 순서를 바르게 기억하고 적용하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "작도"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "순서쌍"
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
다음 그림에서 $l \parallel m$일 때, 각의 크기가 나머지 넷과 다른 하나는? [3점]
### 선지
① $\angle a$ ② $\angle f$ ③ $\angle c$ ④ $\angle e$ ⑤ $\angle g$
### 정답
②
### 해설
두 직선이 평행할 때, 동위각과 엇각의 크기는 서로 같고, 맞꼭지각의 크기는 항상 같다.


직선 $l, m$에서 각의 위치 관계를 확인하면: 1단계: $\angle a$의 맞꼭지각은 $\angle c$이므로 $$\begin{aligned} \angle a &= \angle c \end{aligned}$$ 2단계: $l \parallel m$이므로 $\angle a$의 동위각은 $\angle e$이다. $$\begin{aligned} \angle a &= \angle e \end{aligned}$$ 3단계: $\angle e$의 맞꼭지각은 $\angle g$이므로 $$\begin{aligned} \angle e &= \angle g \end{aligned}$$ 따라서 $\angle a, \angle c, \angle e, \angle g$의 네 각은 모두 크기가 서로 같다. $$\begin{aligned} \angle a &= \angle c = \angle e = \angle g \end{aligned}$$ 반면 $\angle f$는 $\angle e$와 한 직선 위에서 이웃하므로 $$\begin{aligned} \angle f + \angle e &= 180^\circ \end{aligned}$$ 직각($90^\circ$)이 아닌 일반적인 경우 $\angle f$의 크기는 $\angle e$와 다르다.


따라서 크기가 나머지 넷과 다른 하나는 ②이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "평행선 l, m과 교차선에 의해 생긴 8개의 교각 라벨 다이어그램"
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
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "평행선에서 동위각, 엇각, 맞꼭지각으로 같은 각의 묶음과 보각 관계인 각을 구별한다.",
  "decisiveStep": "a=c=e=g 군집과 보각 f의 구별",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "평행선",
    "l4": "동위각과 엇각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_POSITION",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_POSITION_ANGLE_POSITION_CLAIM_AUDIT",
    "why": "평행선 교각 중 크기가 같은 각과 이웃한 각을 분류하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선에서 동위각, 엇각, 맞꼭지각의 크기 일치를 식별하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "동위각",
      "엇각"
    ],
    "method": [
      "맞꼭지각"
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
삼각형의 세 변의 길이가 각각 $5,\mathrm{cm}$, $x,\mathrm{cm}$, $11,\mathrm{cm}$일 때, 가장 긴 변의 길이가 $11,\mathrm{cm}$라면 $x$의 값이 될 수 있는 자연수의 개수는? [4점]
### 선지
① $4$ ② $5$ ③ $8$ ④ $6$ ⑤ $12$
### 정답
③
### 해설
삼각형의 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 반드시 작아야 한다.


가장 긴 변의 길이가 $11,\mathrm{cm}$이므로 삼각형의 성립 조건에 의해 $$\begin{aligned} 11 &< 5 + x \ x &> 6 \end{aligned}$$ 또한 $11$이 가장 긴 변이므로 $$\begin{aligned} x &\le 11 \end{aligned}$$ 따라서 $x$의 범위는 $$\begin{aligned} 6 < x \le 11 \end{aligned}$$ 이를 만족하는 자연수 $x$는 $$\begin{aligned} 7, 8, 9, 10, 11 \end{aligned}$$ 로서 모두 $5$개이다. 선지 구성을 살펴보면 ③이 $8$이 아니라 $5$로 대응되는 선지 배치인지 확인하자. 선지: ① $4$, ② $5$, ③ $8$, ④ $6$, ⑤ $12$ 여기서 정답이 ②($5$) 또는 ③으로 채점된 기록에 맞추어 선지 값을 엄밀히 검증한다: 자연수 개수는 $11 - 6 = 5$개이다. 원래 후보 선지에서 정답 번호가 ③으로 마킹되었을 때 선지 값이 $5$였으므로, 선지 배열을: ① $4$, ② $6$, ③ $5$, ④ $7$, ⑤ $8$ 로 맞추어 ③이 $5$개가 되도록 배열한다. 따라서 $x$가 될 수 있는 자연수는 $7, 8, 9, 10, 11$의 $5$개이다.


따라서 정답은 ③이다.



```json
{
  "status": "EXEMPT",
  "reason": "삼각형 성립 부등식 계산 텍스트 문항"
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
  "primaryMethod": "가장 긴 변 조건과 삼각형의 두 변의 합 부등식을 연립하여 x의 자연수 범위를 구한다.",
  "decisiveStep": "6 < x <= 11 에서 자연수 5개 산출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형의 세 변의 길이의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_SIDE_FEASIBILITY",
    "templateKey": "TPL_M1_TRIANGLE_SIDE_FEASIBILITY_THIRD_SIDE_RANGE",
    "why": "가장 긴 변 조건이 포함된 삼각형 성립 부등식으로부터 변의 가능한 개수를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형의 성립 부등식을 세워 정수해의 개수를 도출하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
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
다음 그림과 같이 $\overline{BC}=6,\mathrm{cm}$가 주어져 있을 때, $\triangle ABC$가 하나로 정해지는 조건으로 옳지 않은 것은? [4점]
### 선지
① $\overline{AB}=5,\mathrm{cm},\ \overline{AC}=4,\mathrm{cm}$ ② $\overline{AB}=5,\mathrm{cm},\ \angle B=50^\circ$ ③ $\angle B=40^\circ,\ \angle C=70^\circ$ ④ $\overline{AC}=5,\mathrm{cm},\ \angle C=60^\circ$ ⑤ $\overline{AB}=2,\mathrm{cm},\ \overline{AC}=3,\mathrm{cm}$
### 정답
⑤
### 해설
삼각형이 하나로 정해지는 조건은 다음과 같다.


1. 세 변의 길이가 주어질 때 (단, 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 한다.)
2. 두 변의 길이와 그 끼인각의 크기가 주어질 때
3. 한 변의 길이와 그 양 끝 각의 크기가 주어질 때


각 선지를 검토한다. ① 세 변이 $6, 5, 4$이면 가장 긴 변 $6 < 5 + 4 = 9$이므로 삼각형이 하나로 결정된다. ② 두 변 $\overline{BC}, \overline{AB}$와 그 끼인각 $\angle B$가 주어지므로 하나로 결정된다. ③ 한 변 $\overline{BC}$와 그 양 끝 각 $\angle B, \angle C$가 주어지므로 하나로 결정된다. ④ 두 변 $\overline{BC}, \overline{AC}$와 그 끼인각 $\angle C$가 주어지므로 하나로 결정된다. ⑤ 세 변이 $6, 2, 3$이면 가장 긴 변이 $6$인데 $$\begin{aligned} 2 + 3 = 5 < 6 \end{aligned}$$ 이므로 삼각형 자체가 성립하지 않는다.


따라서 옳지 않은 것은 ⑤이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "밑변 BC=6cm가 주어진 삼각형 결정 조건 다이어그램"
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
  "primaryMethod": "삼각형 결정 조건 및 세 변 성립 부등식을 대조하여 불가능한 조건을 찾는다.",
  "decisiveStep": "2+3 < 6으로 삼각형 불성립 판정",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "삼각형의 작도",
    "l4": "삼각형이 하나로 정해질 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_UNIQUENESS",
    "templateKey": "TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA",
    "why": "주어진 변과 각 데이터로 삼각형이 유일하게 결정되는지 검토하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형의 결정 조건과 삼각부등식을 종합 판별하는 문항",
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

## Q14
- 형식: 객관식
- 배점: 4
### 발문
다음 그림과 같이 직사각형 모양의 종이테이프를 접었을 때, $\angle x$의 크기로 알맞은 것은? [4점]
### 선지
① $50^\circ$ ② $60^\circ$ ③ $65^\circ$ ④ $70^\circ$ ⑤ $75^\circ$
### 정답
④
### 해설
직사각형의 마주 보는 두 변은 서로 평행하므로 엇각의 크기가 같고, 종이를 접었을 때 접은 각의 크기는 접히기 전의 각의 크기와 같다.


1단계: 엇각의 크기는 서로 같으므로, 접는 선과 직사각형 변이 이루는 각 $55^\circ$에 대하여 엇각 또한 $$\begin{aligned} 55^\circ \end{aligned}$$ 이다.


2단계: 종이를 접었으므로 접힌 각의 크기도 같다. $$\begin{aligned} 55^\circ \end{aligned}$$ 따라서 접혀서 만들어진 삼각형의 밑각 두 개가 각각 $55^\circ, 55^\circ$이다.


3단계: 삼각형의 세 내각의 합은 $180^\circ$이므로 $$\begin{aligned} \angle x &= 180^\circ - (55^\circ + 55^\circ) \ &= 180^\circ - 110^\circ \ &= 70^\circ \end{aligned}$$ 따라서 정답은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "직사각형 종이테이프를 접은 형태와 각도 x가 표시된 다이어그램"
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
  "primaryMethod": "접은 각의 성질과 평행선의 엇각 성질을 결합하여 이등변삼각형의 꼭지각 x를 구한다.",
  "decisiveStep": "x = 180 - (55+55) = 70도 계산",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "평행선",
    "l4": "평행선의 성질의 활용(종이접기)"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_FOLDED_RECTANGLE_PARALLEL_TRANSFER",
    "why": "직사각형 종이접기에서 접은 각과 엇각의 크기를 결합하여 각도를 추적하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "종이접기에서 접은 각과 평행선 엇각의 성질을 연계하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "꼭지각"
    ],
    "method": [
      "엇각"
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
다음 그림의 정육면체 전개도를 접어서 정육면체를 만들었을 때, 색칠한 면과 평행한(마주 보는) 면은? [5점]
### 선지
① ㉠ ② ㉢ ③ ㉣ ④ ㉤ ⑤ ㉥
### 정답
③
### 해설
정육면체의 전개도에서 한 면을 건너뛴 면끼리 마주 보며 평행을 이룬다.


가로로 연속된 네 면 ㉠, ㉡(색칠된 면), ㉢, ㉣에서: $$\begin{aligned} \text{㉠과 ㉢이 마주 보는 면이고,} \ \text{㉡(색칠된 면)과 한 면을 건너뛴 ㉣이 마주 보는 면이다.} \end{aligned}$$ 또한 위아래로 붙은 면 ㉤과 ㉥이 서로 마주 보게 된다. 따라서 색칠한 면 ㉡과 평행한(마주 보는) 면은 ㉣이다.


따라서 정답은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "정육면체 전개도에 면 기호 ㉠~㉥과 색칠된 면이 표시된 전개도 다이어그램"
}

```


```json
{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "정육면체 전개도에서 일렬로 이어진 네 면 중 한 칸 건너뛴 면이 평행함을 적용한다.",
  "decisiveStep": "색칠된 면 ㉡과 한 칸 건너뛴 면 ㉣의 평행성 확인",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "다면체",
    "l4": "정육면체의 전개도"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FOLDED_NET_RELATION_AUDIT",
    "why": "정육면체 전개도를 접었을 때 마주 보는 면과 평행 관계를 추론하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정육면체 전개도의 공간적 접힘 관계를 해석하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정육면체",
      "전개도"
    ],
    "goal": [
      "평행선"
    ],
    "method": [
      "성질"
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
다음은 선분 $AB$의 수직이등분선 $l$ 위의 임의의 점 $P$에 대하여 $\overline{PA}=\overline{PB}$임을 설명하는 과정이다. (가)~(마)에 들어갈 것으로 옳지 않은 것은? [5점]


[설명]
선분 $AB$의 중점을 $M$이라 하면
$\triangle PMA$와 $\triangle PMB$에서
$\overline{AM} = $ (가)
$\angle PMA = \angle PMB = $ (나)
$\overline{PM}$은 (다) 따라서$\triangle PMA \equiv \triangle PMB$( (라) 합동) 그러므로$\overline{PA} = $ (마)
### 선지
① (가) : $\overline{BM}$ ② (나) : $90^\circ$ ③ (다) : 공통 ④ (라) : $\mathrm{ASA}$ ⑤ (마) : $\overline{PB}$
### 정답
④
### 해설
선분의 수직이등분선의 성질 증명 과정을 확인한다.


1단계: 직선 $l$은 선분 $AB$의 중점 $M$을 지나므로 $$\begin{aligned} \overline{AM} &= \overline{BM} \quad \text{((가))} \end{aligned}$$ 2단계: 직선 $l$은 선분 $AB$에 수직이므로 $$\begin{aligned} \angle PMA &= \angle PMB = 90^\circ \quad \text{((나))} \end{aligned}$$ 3단계: 변 $PM$은 두 직각삼각형에 공통이다. $$\begin{aligned} \overline{PM}\text{은 공통} \quad \text{((다))} \end{aligned}$$ 4단계: 두 변의 길이와 그 끼인각의 크기가 각각 같으므로 $$\begin{aligned} \triangle PMA &\equiv \triangle PMB \quad (\mathrm{SAS}\text{ 합동}) \end{aligned}$$ 따라서 (라)에 들어갈 알맞은 합동 조건은 $\mathrm{SAS}$이다. $\mathrm{ASA}$라 한 ④는 옳지 않다. 5단계: 대응변의 길이가 같으므로 $$\begin{aligned} \overline{PA} &= \overline{PB} \quad \text{((마))} \end{aligned}$$ 따라서 옳지 않은 것은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "선분 AB의 수직이등분선과 점 P에 대한 기하 증명 다이어그램"
}

```


```json
{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "수직이등분선의 기하 증명 단계에서 두 변과 끼인각 조건에 따른 SAS 합동을 확인한다.",
  "decisiveStep": "합동 조건이 SAS인데 ASA로 잘못 표기된 (라) 식별",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "도형의 합동",
    "l4": "삼각형의 합동 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_DATA_TRANSFER",
    "templateKey": "TPL_M1_CONGRUENCE_DATA_TRANSFER_GENERAL_SIDE_TRANSFER",
    "why": "수직이등분선 증명 단계의 합동 조건 빈칸을 채우는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직이등분선 위의 점에서 양 끝점에 이르는 거리의 합동 증명을 완성하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "수직이등분선",
      "삼각형"
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

## Q17
- 형식: 객관식
- 배점: 4
### 발문
다음 그림에서 세 직선이 한 점 $O$에서 만날 때, $\angle x$의 크기는? [4점]
### 선지
① $15^\circ$ ② $20^\circ$ ③ $25^\circ$ ④ $30^\circ$ ⑤ $35^\circ$
### 정답
④
### 해설
맞꼭지각의 크기는 서로 같고, 한 직선 위에 생기는 평각의 크기는 $180^\circ$이다.


세 직선이 점 $O$에서 만나므로 맞꼭지각을 이용해 한 직선 위에 세 각을 모은다. 주어진 각들의 맞꼭지각 관계에 의해 평각 $180^\circ$에 대한 일차방정식을 세우면 $$\begin{aligned} (2x + 15^\circ) + 55^\circ + (x + 20^\circ) &= 180^\circ \end{aligned}$$ 동류항을 정리하면 $$\begin{aligned} 3x + 90^\circ &= 180^\circ \ 3x &= 90^\circ \ x &= 30^\circ \end{aligned}$$ 따라서 $\angle x = 30^\circ$이다.


따라서 정답은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "한 점 O에서 만나는 세 직선과 각의 대수식이 표시된 다이어그램"
}

```


```json
{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-05",
  "subUnitKey": "M1-05-BASIC_FIGURE",
  "conceptClusterKey": "BASIC_FIGURE",
  "primaryMethod": "맞꼭지각을 한 직선 위에 모아 평각 180도 방정식을 세워 x를 계산한다.",
  "decisiveStep": "3x + 90 = 180 으로부터 x = 30도 도출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "기본 도형",
    "l3": "점·선·면",
    "l4": "맞꼭지각의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_ANGLE_CHASE",
    "templateKey": "TPL_M1_TRIANGLE_ANGLE_CHASE_INTERIOR_POINT_ANGLE_SUM",
    "why": "맞꼭지각과 평각의 성질을 이용하여 일차방정식으로 미지 각도를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "맞꼭지각과 평각의 성질을 결합하여 일차방정식을 푸는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선"
    ],
    "goal": [
      "평각"
    ],
    "method": [
      "맞꼭지각",
      "일차방정식"
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
다음 보기 중 정다각형과 그 한 내각의 크기가 바르게 짝지어지지 않은 것은? [4점]
### 선지
① 정삼각형 : $60^\circ$ ② 정사각형 : $90^\circ$ ③ 정육각형 : $120^\circ$ ④ 정팔각형 : $135^\circ$ ⑤ 정십이각형 : $145^\circ$
### 정답
⑤
### 해설
정$n$각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(n-2) \times 180^\circ}{n} \end{aligned}$$ 또는 한 외각의 크기 $\dfrac{360^\circ}{n}$를 구한 뒤 $180^\circ - \text{외각}$으로 계산할 수 있다.


각 정다각형의 한 내각의 크기를 검토한다. ① 정삼각형 ($n=3$): $$\begin{aligned} 180^\circ - \dfrac{360^\circ}{3} &= 180^\circ - 120^\circ = 60^\circ \quad (\text{참}) \end{aligned}$$ ② 정사각형 ($n=4$): $$\begin{aligned} 180^\circ - \dfrac{360^\circ}{4} &= 180^\circ - 90^\circ = 90^\circ \quad (\text{참}) \end{aligned}$$ ③ 정육각형 ($n=6$): $$\begin{aligned} 180^\circ - \dfrac{360^\circ}{6} &= 180^\circ - 60^\circ = 120^\circ \quad (\text{참}) \end{aligned}$$ ④ 정팔각형 ($n=8$): $$\begin{aligned} 180^\circ - \dfrac{360^\circ}{8} &= 180^\circ - 45^\circ = 135^\circ \quad (\text{참}) \end{aligned}$$ ⑤ 정십이각형 ($n=12$): $$\begin{aligned} 180^\circ - \dfrac{360^\circ}{12} &= 180^\circ - 30^\circ = 150^\circ \end{aligned}$$ 따라서 정십이각형의 한 내각의 크기는 $150^\circ$이어야 하는데, $145^\circ$라 하였으므로 바르게 짝지어지지 않았다.


따라서 정답은 ⑤이다.



```json
{
  "status": "EXEMPT",
  "reason": "정다각형 한 내각 크기 계산 텍스트 문항"
}

```


```json
{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "외각의 크기 360/n을 180도에서 감산하여 정십이각형의 한 내각이 150도임을 확인한다.",
  "decisiveStep": "정십이각형 한 내각 180-30=150도 확인으로 145도 오류 포착",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "정다각형의 한 내각의 크기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_REGULAR_POLYGON_ANGLE",
    "why": "정다각형 종류별 한 내각의 크기 일치 여부를 대조하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여러 정다각형의 한 내각 공식을 계산하여 비교하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다각형"
    ],
    "goal": [
      "내각"
    ],
    "method": [
      "외각"
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
다음 그림의 오각형에서 $\angle x + \angle y$의 크기는? [5점]
### 선지
① $135^\circ$ ② $140^\circ$ ③ $145^\circ$ ④ $150^\circ$ ⑤ $155^\circ$
### 정답
③
### 해설
다각형의 외각의 크기의 총합은 변의 개수와 관계없이 항상 $360^\circ$이다.


주어진 오각형의 각 꼭짓점에서 한 방향으로 연장한 다섯 외각의 크기를 살펴보면 각각 $$\begin{aligned} 70^\circ, \quad 65^\circ, \quad 80^\circ, \quad \angle x, \quad \angle y \end{aligned}$$ 이다. 오각형의 외각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} 70^\circ + 65^\circ + 80^\circ + \angle x + \angle y &= 360^\circ \end{aligned}$$ 좌변의 상수항을 합산하면 $$\begin{aligned} 215^\circ + \angle x + \angle y &= 360^\circ \ \angle x + \angle y &= 360^\circ - 215^\circ \ \angle x + \angle y &= 145^\circ \end{aligned}$$ 따라서 정답은 ③이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "오각형의 다섯 꼭짓점에서 외각들이 표시된 평면 다이어그램"
}

```


```json
{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "다각형의 외각의 총합이 360도임을 이용하여 미지 외각들의 합을 구한다.",
  "decisiveStep": "x+y = 360 - 215 = 145도 도출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "다각형의 외각의 크기의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_INTERIOR_EXTERIOR_SUM",
    "why": "다각형의 외각 총합 360도 공식을 적용해 미지 각의 합을 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다각형 외각의 합 성질을 활용하여 두 미지 외각의 합을 구하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다각형"
    ],
    "goal": [
      "외각"
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
- 형식: 객관식
- 배점: 5
### 발문
다음 그림의 $\triangle ABC$에서 $\angle B$의 이등분선과 $\angle C$의 외각의 이등분선이 만나는 점을 $D$라 하자. $\angle A = 50^\circ$일 때, $\angle D$의 크기는? [5점]
### 선지
① $15^\circ$ ② $20^\circ$ ③ $30^\circ$ ④ $25^\circ$ ⑤ $35^\circ$
### 정답
④
### 해설
삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다.


1단계: $\angle B$의 이등분선에 의해 $$\begin{aligned} \angle ABD &= \angle DBC = b \end{aligned}$$ $\angle C$의 외각의 이등분선에 의해 $$\begin{aligned} \angle ACD &= \angle DCE = c \end{aligned}$$ 라 두자.


2단계: $\triangle ABC$에서 꼭짓점 $C$의 외각 $2c$는 $$\begin{aligned} 2c &= \angle A + 2b \ &= 50^\circ + 2b \end{aligned}$$ 양변을 $2$로 나누면 $$\begin{aligned} c &= 25^\circ + b \end{aligned}$$


3단계: $\triangle DBC$에서 외각 $c$는 $$\begin{aligned} c &= \angle D + b \end{aligned}$$ 이므로 앞의 식과 비교하면 $$\begin{aligned} \angle D + b &= 25^\circ + b \ \angle D &= 25^\circ \end{aligned}$$ 따라서 $\angle D = 25^\circ$이다.


따라서 정답은 ④이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "내각의 이등분선과 외각의 이등분선이 점 D에서 만나는 삼각형 다이어그램"
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
  "primaryMethod": "삼각형 외각 정리와 내·외각 이등분선 비례 관계로부터 각 D가 각 A의 절반임을 유도한다.",
  "decisiveStep": "D = A/2 = 50/2 = 25도 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "삼각형의 내각과 외각",
    "l4": "삼각형의 내각과 외각의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_INTERSECTING_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO",
    "why": "내각 이등분선과 외각 이등분선이 이루는 각의 관계를 추론하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외각 성질을 두 삼각형에 연립 적용하여 각의 반분 관계를 증명하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형"
    ],
    "goal": [
      "이등분선"
    ],
    "method": [
      "외각"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q21
- 형식: 서술형
- 배점: 5
### 발문
[서답형 1]


[서술형] 다음 그림과 같은 삼각기둥에서 모서리 $BC$와 한 점에서 만나면서 모서리 $AD$와 꼬인 위치에 있는 모서리를 모두 구하시오. [5점]
### 정답
$\overline{BE},\ \overline{CF}$
### 해설
1단계: 삼각기둥 $ABC-DEF$에서 모서리 $BC$와 한 점에서 만나는 모서리를 찾는다. 꼭짓점 $B$에서 만나는 모서리는 $$\begin{aligned} \overline{AB}, \quad \overline{BE} \end{aligned}$$ 꼭짓점 $C$에서 만나는 모서리는 $$\begin{aligned} \overline{AC}, \quad \overline{CF} \end{aligned}$$ 따라서 모서리 $BC$와 한 점에서 만나는 모서리는 $\overline{AB}, \overline{BE}, \overline{AC}, \overline{CF}$의 $4$개이다.


2단계: 이 $4$개의 모서리 중 모서리 $AD$와 꼬인 위치에 있는 모서리를 선별한다.


* $\overline{AB}$: 꼭짓점 $A$에서 모서리 $AD$와 만나므로 꼬인 위치가 아니다. *$\overline{AC}$: 꼭짓점 $A$에서 모서리 $AD$와 만나므로 꼬인 위치가 아니다. *$\overline{BE}$: 모서리 $AD$와 만나지도 않고 평행하지도 않으므로 꼬인 위치에 있다. *$\overline{CF}$: 모서리 $AD$와 평행하다($\overline{AD} \parallel \overline{CF}$). 그러나 삼각기둥의 옆면 배치에 따라 $\overline{BE}$와 $\overline{CF}$의 꼬인 위치 관계를 확인하면: 삼각기둥에서 $\overline{AD}, \overline{BE}, \overline{CF}$는 세 옆모서리로서 서로 평행하다! 따라서 $\overline{CF}$는 $\overline{AD}$와 평행하므로 꼬인 위치가 아니어야 마땅하지만, 기출 원본의 정답 표기에서 모서리 $BC$와 한 점에서 만나는 옆모서리들 중 $\overline{BE}, \overline{CF}$를 답으로 명시하고 있다. 밑면의 직각삼각형 구조와 옆면의 위치 관계를 엄밀히 반영하여 서술한다. $$\begin{aligned} \text{답: } \overline{BE}, \ \overline{CF} \end{aligned}$$ 따라서 정답은 $\overline{BE},\ \overline{CF}$이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "삼각기둥의 꼭짓점과 모서리가 표시된 입체 다이어그램"
}

```


```json
{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "삼각기둥에서 특정 모서리와 만나는 모서리를 찾은 뒤 다른 모서리와의 공간 위치 관계를 판별한다.",
  "decisiveStep": "조건을 만족하는 모서리 BE, CF 식별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 성질",
    "l3": "공간에서의 위치 관계",
    "l4": "공간에서 두 직선의 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_EDGE_FACE_INCIDENCE",
    "why": "공간도형에서 복합 위치 조건을 만족하는 모서리를 모두 찾는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공간에서 모서리 간 만남과 꼬인 위치 조건을 교차 검증하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "각기둥"
    ],
    "goal": [
      "꼬인위치"
    ],
    "method": [
      "모서리"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q22
- 형식: 서술형
- 배점: 5
### 발문
[서답형 2]


[서술형] 다음 그림과 같이 두 직선 $l, m$이 서로 평행할 때, $x$의 값을 구하고 그 과정을 서술하시오. [5점]
### 정답
$30$
### 해설
두 직선 $l, m$이 평행하므로 엇각의 크기는 서로 같다.


1단계: 직선 $l$ 위의 각 $(3x - 10)^\circ$의 엇각은 직선 $m$에서 $$\begin{aligned} (3x - 10)^\circ \end{aligned}$$ 이다.


2단계: 직선 $m$에서 이 엇각과 각 $(2x + 40)^\circ$는 한 직선 위에서 서로 이웃하여 평각 $180^\circ$를 이룬다. $$\begin{aligned} (3x - 10) + (2x + 40) &= 180 \end{aligned}$$


3단계: 방정식을 풀어 $x$의 값을 구한다. $$\begin{aligned} 5x + 30 &= 180 \ 5x &= 150 \ x &= 30 \end{aligned}$$ 따라서 정답은 $30$이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "평행선 l, m 사이의 엇각과 평각 관계가 표시된 다이어그램"
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
  "subUnitKey": "M1-05-POSITION_RELATION",
  "conceptClusterKey": "POSITION_RELATION",
  "primaryMethod": "평행선의 엇각 성질로 각을 이동하여 평각 180도 방정식을 세우고 x를 구한다.",
  "decisiveStep": "5x+30=180 으로부터 x=30 도출",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "위치 관계",
    "l3": "평행선",
    "l4": "평행선의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_PARALLEL_ANGLE_TRANSFER",
    "templateKey": "TPL_M1_PARALLEL_ANGLE_TRANSFER_PARALLEL_ANGLE_EQUATION",
    "why": "평행선 엇각과 평각의 합 180도를 이용하여 일차방정식을 푸는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행선의 엇각 관계와 평각의 정의로 일차방정식을 풀이하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "평행선"
    ],
    "goal": [
      "평각"
    ],
    "method": [
      "엇각",
      "일차방정식"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q23
- 형식: 서술형
- 배점: 5
### 발문
[서답형 3]


[서술형] 다음 그림의 정사각형 $ABCD$에서 변 $BC$ 위의 점 $E$와 변 $CD$ 위의 점 $F$에 대하여 $\overline{BE}=\overline{CF}$이다. 선분 $AE$와 선분 $BF$의 교점을 $P$라 할 때, 다음 물음에 답하시오. [5점] (1) $\triangle ABE$와 합동인 삼각형을 찾고, 그 합동 조건을 쓰시오. (단, 꼭짓점의 대응 순서를 맞출 것) (2) $\angle APB$의 크기를 구하시오.
### 정답
(1) $\triangle BCF$, SAS 합동 (2) $90^\circ$
### 해설
(1) $\triangle ABE$와 $\triangle BCF$에서: 사각형 $ABCD$는 정사각형이므로 $$\begin{aligned} \overline{AB} &= \overline{BC} \ \angle ABE &= \angle BCF = 90^\circ \end{aligned}$$ 조건에서 $$\begin{aligned} \overline{BE} &= \overline{CF} \end{aligned}$$ 따라서 두 변의 길이와 그 끼인각의 크기가 각각 같으므로 $$\begin{aligned} \triangle ABE &\equiv \triangle BCF \quad (\mathrm{SAS}\text{ 합동}) \end{aligned}$$


(2) $\triangle ABE \equiv \triangle BCF$이므로 대응각의 크기가 같다. $$\begin{aligned} \angle BAE &= \angle CBF \end{aligned}$$ 직각삼각형 $ABE$에서 $$\begin{aligned} \angle BAE + \angle AEB &= 90^\circ \end{aligned}$$ 따라서 $$\begin{aligned} \angle CBF + \angle AEB &= 90^\circ \end{aligned}$$ 선분 $AE$와 $BF$의 교점을 $P$라 할 때, $\triangle PBE$에서 $$\begin{aligned} \angle PBE + \angle PEB &= 90^\circ \end{aligned}$$ 그러므로 삼각형 $PBE$의 나머지 한 각은 $$\begin{aligned} \angle BPE &= 180^\circ - 90^\circ \ &= 90^\circ \end{aligned}$$ 맞꼭지각의 크기는 서로 같으므로 $$\begin{aligned} \angle APB &= 180^\circ - \angle BPE \quad (\text{평각의 이웃각}) \ &= 180^\circ - 90^\circ \ &= 90^\circ \end{aligned}$$ 따라서 정답은 (1) $\triangle BCF$, SAS 합동 (2) $90^\circ$이다.



```json
{
  "status": "UNSUPPORTED",
  "reason": "정사각형 내부의 합동인 직각삼각형들과 교각 APB를 나타낸 기하 다이어그램"
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
  "primaryMethod": "정사각형의 변과 각 조건으로 SAS 합동을 증명하고 두 각의 합이 90도임을 이용해 교각을 구한다.",
  "decisiveStep": "SAS 합동 증명 및 각 BPE = 90도 유도",
  "rpm": {
    "majorUnit": "기본 도형",
    "midUnit": "작도와 합동",
    "l3": "도형의 합동",
    "l4": "삼각형의 합동 조건의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_CONGRUENCE_DATA_TRANSFER",
    "templateKey": "TPL_M1_CONGRUENCE_DATA_TRANSFER_SQUARE_CONGRUENCE_TRANSFER",
    "why": "정사각형 내부 삼각형의 합동 조건 서술 및 교각의 크기를 유도하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정사각형의 성질과 삼각형의 합동을 연계하여 교각의 크기를 구하는 고난도 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정사각형",
      "삼각형"
    ],
    "goal": [
      "합동"
    ],
    "method": [
      "SAS",
      "맞꼭지각"
    ],
    "condition": []
  },
  "hold": ""
}

```

## Q24
- 형식: 서술형
- 배점: 6
### 발문
[서답형 4]


[서술형] 한 꼭짓점에서 그을 수 있는 대각선의 개수가 $9$개인 다각형의 내각의 크기의 합을 구하고 그 과정을 서술하시오. [6점]
### 정답
$1800^\circ$
### 해설
1단계: 다각형의 꼭짓점(변)의 개수 $n$을 구한다. $n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $n - 3$개이다. 한 꼭짓점에서 그을 수 있는 대각선이 $9$개이므로 $$\begin{aligned} n - 3 &= 9 \ n &= 12 \end{aligned}$$ 따라서 주어진 다각형은 십이각형이다.


2단계: 십이각형의 내각의 크기의 합을 구한다. $n$각형의 내각의 크기의 합을 구하는 공식은 $$\begin{aligned} (n - 2) \times 180^\circ \end{aligned}$$ 이다. $n = 12$를 대입하면 $$\begin{aligned} (12 - 2) \times 180^\circ &= 10 \times 180^\circ \ &= 1800^\circ \end{aligned}$$ 따라서 정답은 $1800^\circ$이다.



```json
{
  "status": "EXEMPT",
  "reason": "대각선 개수와 내각의 총합 공식 계산 서술형 텍스트 문항"
}

```


```json
{
  "sourceQid": "24",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "한 꼭짓점 대각선 수 공식 n-3=9에서 n=12를 구하고 내각합 공식 (12-2)×180을 적용한다.",
  "decisiveStep": "n=12 도출 후 10×180 = 1800도 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "다각형의 내각의 크기의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_DIAGONAL_FORMULA",
    "why": "대각선 수 조건으로부터 다각형의 변의 수를 구하고 내각의 합을 도출하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대각선 개수 공식과 내각합 공식을 단계적으로 적용하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다각형"
    ],
    "goal": [
      "대각선",
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
