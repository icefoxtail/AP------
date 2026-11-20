```json:exam
{
  "stem": "24_왕운중_2학기_기말_중3_유사",
  "sourceArchiveFile": "original/middle/m3/2final/24_왕운중_2학기_기말_중3_수학.js",
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
다음 그림과 같이 반지름의 길이가 $1$인 사분원을 이용하여 삼각비의 값을 구할 때, 보기에서 옳지 않은 것은? [4점]


### 선지
① $\sin 40^\circ = 0.77$ ② $\cos 40^\circ = 0.77$ ③ $\tan 40^\circ = 0.84$ ④ $\sin 50^\circ = 0.77$ ⑤ $\cos 50^\circ = 0.64$


### 정답
①


### 해설
반지름의 길이가 $1$인 사분원에서 중심각이 $40^\circ$일 때 삼각비의 기하학적 정의를 적용한다.


1단계: 사분원에서 중심 $O$를 시점으로 하고 $x$축의 양의 방향과 $40^\circ$의 각을 이루는 반직선이 호와 만나는 점의 좌표는 $(\cos 40^\circ, \sin 40^\circ)$이다. 그림에서 가로 좌표는 $0.77$, 세로 좌표는 $0.64$이므로 $$\cos 40^\circ = 0.77, \quad \sin 40^\circ = 0.64$$ 따라서 $\sin 40^\circ = 0.77$이라고 한 ①은 옳지 않다.


2단계: 점 $(1, 0)$에서의 접선과 반직선의 연장선이 만나는 점의 세로 좌표가 탄젠트이므로 $$\tan 40^\circ = 0.84$$


3단계: $50^\circ$는 $40^\circ$의 여각이므로 ($50^\circ = 90^\circ - 40^\circ$) $$\begin{aligned} \sin 50^\circ &= \cos 40^\circ = 0.77 \ \cos 50^\circ &= \sin 40^\circ = 0.64 \end{aligned}$$ 따라서 옳지 않은 것은 ①이다. 따라서 정답은 ①이다.
```json
{
  "status": "EXEMPT",
  "reason": "단위 사분원 상의 좌표와 삼각비 및 여각 관계 판별 문항"
}
```
```json
{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO",
  "conceptClusterKey": "TRIG_RATIO",
  "primaryMethod": "사분원에서 sin40도는 세로 좌표 0.64임을 대조하여 선지 1번의 오류를 판별한다.",
  "decisiveStep": "sin40도=0.64와 cos40도=0.77 식별",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 뜻",
    "l4": "사분원에서의 삼각비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TRIG_QUADRANT_UNIT_CIRCLE",
    "templateKey": "TPL_M3_TRIG_COORDINATE_READING",
    "why": "반지름 1인 사분원에서 좌표와 접선 길이로 삼각비를 판별하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사분원 기하 해석과 여각 관계를 함께 감사하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "사분원",
      "각도",
      "좌표"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "삼각비",
      "여각"
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
다음 삼각비와 실수의 대소 관계에 대한 설명 중 옳은 것은? [4점]


### 선지
① $\cos 20^\circ < \cos 30^\circ$ ② $\tan 45^\circ < \sin 45^\circ$ ③ $\sin 10^\circ < \sin 20^\circ$ ④ $\cos 0^\circ - \sin 90^\circ = 1$ ⑤ $\sqrt{(1 - \tan 60^\circ)^2} = 1 - \sqrt{3}$


### 정답
③


### 해설
삼각비의 각의 크기에 따른 증감 특성과 특수각의 값을 확인한다.


각 보기를 검토하면 다음과 같다. $$\begin{aligned} \text{① } & 0^\circ \le x \le 90^\circ\text{에서 각이 커질수록 코사인 값은 감소하므로 } \cos 20^\circ > \cos 30^\circ\text{이다. (거짓)} \ \text{② } & \tan 45^\circ = 1, \sin 45^\circ = \dfrac{\sqrt{2}}{2}\text{이므로 } \tan 45^\circ > \sin 45^\circ\text{이다. (거짓)} \ \text{③ } & 0^\circ \le x \le 90^\circ\text{에서 각이 커질수록 사인 값은 증가하므로 } \sin 10^\circ < \sin 20^\circ\text{이다. (참)} \ \text{④ } & \cos 0^\circ = 1, \sin 90^\circ = 1\text{이므로 } \cos 0^\circ - \sin 90^\circ = 1 - 1 = 0\text{이다. (거짓)} \ \text{⑤ } & \tan 60^\circ = \sqrt{3} > 1\text{이므로 } 1 - \tan 60^\circ = 1 - \sqrt{3} < 0\text{이다.} \ & \text{따라서 } \sqrt{(1 - \tan 60^\circ)^2} = |1 - \sqrt{3}| = \sqrt{3} - 1\text{이다. (거짓)} \end{aligned}$$ 따라서 옳은 것은 ③이다. 따라서 정답은 ③이다.
```json
{
  "status": "EXEMPT",
  "reason": "삼각비의 단조성, 특수각 값 및 제곱근 부호 판정 대수 문항"
}
```
```json
{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO",
  "conceptClusterKey": "TRIG_RATIO",
  "primaryMethod": "사인 함수의 단조증가 성질로부터 sin10도 < sin20도가 참임을 식별한다.",
  "decisiveStep": "사인 함수의 0~90도 단조증가성 확인",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 뜻",
    "l4": "삼각비의 대소 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TRIG_MONOTONICITY_COMPARISON",
    "templateKey": "TPL_M3_TRIG_MAGNITUDE_PROPERTY_AUDIT",
    "why": "각의 변화에 따른 삼각비의 대소 관계를 판정하는 개념 템플릿"
  },
  "crossConceptKeys": [
    "CC_SQUARE_ROOT_SIGN"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사인·코사인의 증감과 절댓값 근호 성질을 복합 대조하는 표준 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각비",
      "각"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "단조성",
      "특수각"
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
다음 삼각비의 표를 이용하여 $\sin 35^\circ + \cos 36^\circ$의 값을 구하면? [3점]


각도
  $35^\circ$
  $36^\circ$
  $37^\circ$
  사인($\sin$) $0.5736$
  $0.5878$
  $0.6018$
  코사인($\cos$) $0.8192$
  $0.8090$
  $0.7986$
  탄젠트($\tan$) $0.7002$
  $0.7265$
  $0.7536$


### 선지
① $1.2982$ ② $1.3255$ ③ $1.3526$ ④ $1.3714$ ⑤ $1.3826$


### 정답
⑤


### 해설
삼각비의 표에서 해당 각도의 값을 읽어 합을 계산한다.


1단계: 주어진 표에서 $\sin 35^\circ$와 $\cos 36^\circ$의 값을 찾으면 다음과 같다. $$\begin{aligned} \sin 35^\circ &= 0.5736 \ \cos 36^\circ &= 0.8090 \end{aligned}$$


2단계: 두 값의 합을 구하면 다음과 같다. $$\begin{aligned} \sin 35^\circ + \cos 36^\circ &= 0.5736 + 0.8090 \ &= 1.3826 \end{aligned}$$ 따라서 정답은 ⑤이다.
```json
{
  "status": "EXEMPT",
  "reason": "삼각비의 표 독해 및 소수 덧셈 단순 연산 문항"
}
```
```json
{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO",
  "conceptClusterKey": "TRIG_RATIO",
  "primaryMethod": "표에서 sin35=0.5736, cos36=0.8090을 찾아 더해 1.3826을 계산한다.",
  "decisiveStep": "표 수치 독해 후 소수 덧셈 0.5736 + 0.8090 = 1.3826 수행",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 뜻",
    "l4": "삼각비의 표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TRIG_TABLE_LOOKUP",
    "templateKey": "TPL_M3_TRIG_TABLE_ADDITION",
    "why": "삼각비의 표를 보고 필요한 값을 추출하여 연산하는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "표의 행과 열을 직접 교차 독해하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각비표"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "표읽기",
      "덧셈"
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
어떤 비행기가 지면과 $12^\circ$의 각을 이루면서 일정한 속력으로 올라간다. 이 비행기가 날아간 직선거리가 $2000\rm,m$일 때, 이 비행기의 지면으로부터의 높이는 몇 $\rm m$인가? [4점] (단, $\sin 12^\circ = 0.2079, \cos 12^\circ = 0.9781, \tan 12^\circ = 0.2126$으로 계산한다.)


### 선지
① $412.6\rm,m$ ② $415.8\rm,m$ ③ $425.2\rm,m$ ④ $978.1\rm,m$ ⑤ $1956.2\rm,m$


### 정답
②


### 해설
직각삼각형에서 빗변의 길이와 기준각의 사인을 이용하여 높이를 구한다.


1단계: 지면을 밑변으로 하고 비행기가 날아간 거리를 빗변($2000\rm,m$), 지면과의 각을 $12^\circ$로 하는 직각삼각형을 모델링한다.


2단계: 비행기의 지면으로부터의 높이를 $h\rm,m$라 하면 사인의 정의에 의하여 $$\sin 12^\circ = \dfrac{h}{2000}$$ 따라서 높이 $h$는 다음과 같다. $$\begin{aligned} h &= 2000 \times \sin 12^\circ \ &= 2000 \times 0.2079 \ &= 415.8\rm,m \end{aligned}$$ 따라서 정답은 ②이다.
```json
{
  "status": "EXEMPT",
  "reason": "빗변과 기준각 사인을 이용한 실생활 직각삼각형 높이 계산 문항"
}
```
```json
{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
  "conceptClusterKey": "TRIG_RATIO_APPLICATION",
  "primaryMethod": "h = 2000 * sin(12도) = 2000 * 0.2079 = 415.8m를 산출한다.",
  "decisiveStep": "높이 공식 h = 2000 * 0.2079 적용",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 활용",
    "l4": "거리와 높이의 측정"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TRIG_HEIGHT_MEASUREMENT",
    "templateKey": "TPL_M3_AIRPLANE_CLIMB_HEIGHT",
    "why": "경사각과 비행 거리로부터 사인을 이용해 고도를 구하는 실생활 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사인의 정의 식에 직접 수치를 대입하는 1단계 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거리",
      "각도",
      "삼각비"
    ],
    "goal": [
      "높이"
    ],
    "method": [
      "사인",
      "곱셈"
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
직각삼각형 $ABC$에서 밑변 $\overline{BC}$의 길이는 $25%$ 늘리고, 높이 $\overline{AB}$의 길이는 $x%$ 줄여서 새로운 직각삼각형 $A'BC'$을 만들었다. 삼각형 $A'BC'$의 넓이가 원래 삼각형 $ABC$의 넓이에 비해 $15%$ 줄었다고 할 때, $x$의 값을 구하면? [5점] (단, 점 $A'$는 변 $AB$ 위의 점이고, 점 $C'$는 변 $BC$의 연장선 위의 점이다.)


### 선지
① $26$ ② $28$ ③ $30$ ④ $32$ ⑤ $35$


### 정답
④


### 해설
두 변의 길이 변화율과 삼각형의 넓이 변화율 사이의 관계식을 세워 방정식을 푼다.


1단계: 원래 삼각형 $ABC$의 넓이를 $S$라 하면 $$S = \dfrac{1}{2} \overline{AB} \times \overline{BC}$$


2단계: 새로운 삼각형 $A'BC'$의 밑변과 높이는 다음과 같다. $$\begin{aligned} \overline{BC'} &= \overline{BC} \times (1 + 0.25) = 1.25\overline{BC} \ \overline{A'B} &= \overline{AB} \times \left(1 - \dfrac{x}{100}\right) \end{aligned}$$ 새로운 삼각형 $A'BC'$의 넓이 $S'$는 다음과 같다. $$\begin{aligned} S' &= \dfrac{1}{2} \overline{A'B} \times \overline{BC'} \ &= \dfrac{1}{2} \left{ \overline{AB} \times \left(1 - \dfrac{x}{100}\right) \right} \times (1.25\overline{BC}) \ &= 1.25 \left(1 - \dfrac{x}{100}\right) S \end{aligned}$$


3단계: 넓이가 $15%$ 줄었으므로 $S' = (1 - 0.15)S = 0.85S$이다. 따라서 다음 일차방정식이 성립한다. $$\begin{aligned} 1.25 \left(1 - \dfrac{x}{100}\right) &= 0.85 \ 1 - \dfrac{x}{100} &= \dfrac{0.85}{1.25} \ 1 - \dfrac{x}{100} &= \dfrac{85}{125} = \dfrac{17}{25} = 0.68 \ \dfrac{x}{100} &= 1 - 0.68 = 0.32 \ x &= 32 \end{aligned}$$ 따라서 정답은 ④이다.
```json
{
  "status": "EXEMPT",
  "reason": "삼각형 밑변과 높이의 백분율 변화에 따른 넓이 보존/감소 일차방정식 대수 문항"
}
```
```json
{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
  "conceptClusterKey": "TRIG_RATIO_APPLICATION",
  "primaryMethod": "1.25*(1-x/100)=0.85 방정식을 세워 1-x/100=0.68에서 x=32를 도출한다.",
  "decisiveStep": "방정식 1.25(1-x/100)=0.85 수립 및 x=32 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 활용",
    "l4": "도형의 넓이의 변화율"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TRIANGLE_AREA_PERCENT_CHANGE",
    "templateKey": "TPL_M3_TRIANGLE_DIMENSION_CHANGE_RATIO",
    "why": "삼각형의 밑변과 높이의 백분율 증감으로부터 미지수 감소율을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PERCENTAGE_RATE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도형의 넓이 공식과 백분율 증감 방정식을 결합하여 해결하는 응용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직각삼각형",
      "변화율",
      "넓이"
    ],
    "goal": [
      "변화율"
    ],
    "method": [
      "방정식",
      "비율"
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
다음 그림과 같이 $\overline{AB} = 6\rm,cm, \overline{BC} = 4\rm,cm, \angle B = 120^\circ$인 둔각삼각형 $ABC$에 대한 설명 중 옳은 것을 모두 고른 것은? [4점]


<보기> • ㄱ. $\triangle ABC$의 밑변을 $\overline{AB}$라 할 때, 높이는 $4\sin 60^\circ\rm,cm$이다. • ㄴ. $\triangle ABC$의 밑변을 $\overline{BC}$라 할 때, 높이는 $4\sin 60^\circ\rm,cm$이다. • ㄷ. $\triangle ABC$의 넓이는 $6\sqrt{3}\rm,cm^2$이다.


### 선지
① ㄱ, ㄷ ② ㄴ, ㄷ ③ ㄱ ④ ㄴ ⑤ ㄱ, ㄴ, ㄷ


### 정답
①


### 해설
둔각삼각형의 높이와 삼각비를 이용한 넓이 공식을 검증한다.


1단계: $\angle B = 120^\circ$이므로 꼭짓점 $B$에서의 외각의 크기는 다음과 같다. $$180^\circ - 120^\circ = 60^\circ$$


2단계: 각 보기의 진술을 검토한다. • ㄱ. 밑변을 $\overline{AB}$라 하면 점 $C$에서 직선 $AB$의 연장선에 내린 수선이 높이가 된다. 직각삼각형에서 높이는 $\overline{BC} \times \sin 60^\circ = 4\sin 60^\circ\rm,cm$이다. (ㄱ 참) • ㄴ. 밑변을 $\overline{BC}$라 하면 점 $A$에서 직선 $BC$의 연장선에 내린 수선이 높이가 된다. 직각삼각형에서 높이는 $\overline{AB} \times \sin 60^\circ = 6\sin 60^\circ\rm,cm$이다. 따라서 '$4\sin 60^\circ\rm,cm$'라고 한 ㄴ은 거짓이다. (ㄴ 거짓) • ㄷ. 두 변과 둔각이 주어졌을 때 삼각형의 넓이 공식에 의하여 $$\begin{aligned} \text{넓이} &= \dfrac{1}{2} \times \overline{AB} \times \overline{BC} \times \sin(180^\circ - 120^\circ) \ &= \dfrac{1}{2} \times 6 \times 4 \times \sin 60^\circ \ &= 12 \times \dfrac{\sqrt{3}}{2} \ &= 6\sqrt{3}\rm,cm^2 \quad (\text{ㄷ 참}) \end{aligned}$$


따라서 옳은 것은 ㄱ, ㄷ이다. 따라서 정답은 ①이다.
```json
{
  "status": "EXEMPT",
  "reason": "둔각삼각형의 밑변별 높이 정의와 삼각비 넓이 공식 판별 문항"
}
```
```json
{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
  "conceptClusterKey": "TRIG_RATIO_APPLICATION",
  "primaryMethod": "외각 60도로부터 밑변 AB 높이 4sin60도와 넓이 (1/2)*6*4*sin60도=6sqrt(3)의 참을 확인한다.",
  "decisiveStep": "밑변별 높이 표현(ㄱ 참, ㄴ 거짓) 및 넓이 6sqrt(3) 검증",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 활용",
    "l4": "둔각삼각형의 높이와 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_OBTUSE_TRIANGLE_AREA_HEIGHT",
    "templateKey": "TPL_M3_OBTUSE_TRIANGLE_MULTI_CLAIM_AUDIT",
    "why": "둔각삼각형의 두 변에 대응하는 높이와 넓이를 삼각비로 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑변의 선택에 따른 높이의 차이를 삼각비 공식과 대조하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "둔각삼각형",
      "변",
      "각"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "삼각비",
      "넓이",
      "높이"
    ],
    "condition": [
      "둔각"
    ]
  },
  "hold": ""
}
```
## Q07
- 형식: 객관식
- 배점: 3


### 발문
다음 그림과 같이 반지름의 길이가 $13\rm,cm$인 원 $O$에서 중심 $O$로부터 현 $\overline{AB}$에 내린 수선의 길이가 $5\rm,cm$일 때, 현 $\overline{AB}$의 길이는? [3점]


### 선지
① $16\rm,cm$ ② $18\rm,cm$ ③ $20\rm,cm$ ④ $22\rm,cm$ ⑤ $24\rm,cm$


### 정답
⑤


### 해설
원의 중심에서 현에 내린 수선은 그 현을 이등분한다.


1단계: 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$이라 하면 삼각형 $OAM$은 $\angle OMA = 90^\circ$인 직각삼각형이다. 반지름 $\overline{OA} = 13\rm,cm, \overline{OM} = 5\rm,cm$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{AM}^2 &= \overline{OA}^2 - \overline{OM}^2 \ &= 13^2 - 5^2 \ &= 169 - 25 \ &= 144 \end{aligned}$$ 길이는 양수이므로 $\overline{AM} = 12\rm,cm$이다.


2단계: 중심에서 내린 수선은 현을 이등분하므로 현 $\overline{AB}$의 길이는 다음과 같다. $$\begin{aligned} \overline{AB} &= 2 \times \overline{AM} \ &= 2 \times 12 \ &= 24\rm,cm \end{aligned}$$ 따라서 정답은 ⑤이다.
```json
{
  "status": "EXEMPT",
  "reason": "원 중심에서 현까지의 거리와 반지름으로 현의 길이를 구하는 피타고라스 기본 문항"
}
```
```json
{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "직각삼각형 OAM에서 AM=sqrt(169-25)=12를 구하고 2배하여 현의 길이 24를 산출한다.",
  "decisiveStep": "피타고라스 정리 AM=12 도출 및 현 길이 2*12=24 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "중심에서 현에 내린 수선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CHORD_LENGTH_CALCULATION",
    "templateKey": "TPL_M3_CHORD_PYTHAGOREAN_TRIPLE",
    "why": "피타고라스 정리를 이용하여 현의 전체 길이를 구하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "피타고라스 삼조(5-12-13)와 현의 이등분 성질을 직접 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "반지름",
      "거리"
    ],
    "goal": [
      "길이",
      "현"
    ],
    "method": [
      "피타고라스",
      "수직이등분"
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
다음은 '한 원에서 길이가 같은 두 현은 원의 중심으로부터 같은 거리에 있다'를 증명하는 과정이다. (가)에 들어갈 내용으로 가장 알맞은 것은? [4점]


<증명 과정> 원 $O$에서 길이가 같은 두 현 $\overline{AB}, \overline{CD}$에 중심 $O$에서 내린 수선의 발을 각각 $M, N$이라 하자. 원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ( 가 )이다. $\triangle OAM$과 $\triangle OCN$에서 $\angle OMA = \angle ONC = 90^\circ$ $\overline{OA} = \overline{OC}$ (원의 반지름) 이에 의하여 $\triangle OAM \equiv \triangle OCN$ (RHS 합동)이다. 따라서 $\overline{OM} = \overline{ON}$이다. 즉, 한 원에서 길이가 같은 두 현은 원의 중심으로부터 서로 같은 거리에 있다.


### 선지
① $\overline{OM} = \overline{ON}$이므로 $\overline{OA} = \overline{OC}$ ② $\overline{AM} = \dfrac{1}{2}\overline{AB}, \overline{CN} = \dfrac{1}{2}\overline{CD}$이므로 $\overline{AM} = \overline{CN}$ ③ $\angle OAM = \angle OCN$이므로 $\overline{OM} = \overline{ON}$ ④ $\overline{OA} = \overline{OC}$이므로 $\overline{AB} = \overline{CD}$ ⑤ $\angle AOM = \angle CON$이므로 $\overline{AM} = \overline{CN}$


### 정답
②


### 해설
직각삼각형의 합동(RHS) 조건을 만족하기 위한 대응변의 길이 관계를 증명 맥락에서 파악한다.


1단계: 증명의 목표는 두 직각삼각형 $OAM$과 $OCN$이 RHS 합동임을 보여 $\overline{OM} = \overline{ON}$을 도출하는 것이다. 이미 $\angle OMA = \angle ONC = 90^\circ$ (직각 R)과 $\overline{OA} = \overline{OC}$ (빗변 H)가 제시되어 있으므로, 합동을 완성하기 위해서는 직각변의 길이 $\overline{AM} = \overline{CN}$ (변 S)이 성립함을 밝혀야 한다.


2단계: 원의 중심에서 현에 내린 수선은 현을 이등분하므로 $$\overline{AM} = \dfrac{1}{2}\overline{AB}, \quad \overline{CN} = \dfrac{1}{2}\overline{CD}$$ 조건에서 $\overline{AB} = \overline{CD}$이므로 $$\overline{AM} = \overline{CN}$$ 따라서 (가)에 들어갈 내용은 '$\overline{AM} = \dfrac{1}{2}\overline{AB}, \overline{CN} = \dfrac{1}{2}\overline{CD}$이므로 $\overline{AM} = \overline{CN}$'이다. 따라서 정답은 ②이다.
```json
{
  "status": "EXEMPT",
  "reason": "현의 이등분 성질과 RHS 합동 논증 과정의 빈칸 추론 문항"
}
```
```json
{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "현의 이등분 성질로부터 AM=AB/2, CN=CD/2이므로 AM=CN임을 증명 빈칸에 대입한다.",
  "decisiveStep": "RHS 합동의 S 조건인 AM=CN 도출 문장 식별",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "중심거리와 현의 길이 증명"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CHORD_PROPERTY_PROOF_BLANK",
    "templateKey": "TPL_M3_RHS_CONGRUENCE_CHORD_PROOF",
    "why": "현의 길이와 중심거리 성질 증명에서 합동 조건을 완성하는 빈칸 템플릿"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_CONGRUENCE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수학적 연역 증명 흐름에서 RHS 합동 조건을 만족시키는 연결 고리를 찾는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "현",
      "증명"
    ],
    "goal": [
      "빈칸"
    ],
    "method": [
      "합동",
      "이등분",
      "논증"
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
다음 그림과 같이 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$, 선분 $\overline{OM}$의 연장선이 원과 만나는 점을 $C$라 하자. $\overline{AM} = 12\rm,cm, \overline{MC} = 4\rm,cm$이고 원의 반지름의 길이를 $x\rm,cm$라 할 때, $x$의 값을 구하기 위해 세울 수 있는 피타고라스 방정식으로 옳은 것은? [4점]


### 선지
① $x^2 = 4^2 + 12^2$ ② $(x - 4)^2 = x^2 + 12^2$ ③ $12^2 = (x - 4)^2 + 4^2$ ④ $x^2 = (x - 4)^2 + 12^2$ ⑤ $(12 - x)^2 = x^2 + 4^2$


### 정답
④


### 해설
직각삼각형 $OMA$에서 반지름 $x$에 대한 피타고라스 방정식을 세운다.


1단계: 선분 $\overline{OC}$는 원의 반지름이므로 $\overline{OC} = x\rm,cm$이다. 점 $M$이 선분 $\overline{OC}$ 위에 있고 $\overline{MC} = 4\rm,cm$이므로 $$\overline{OM} = \overline{OC} - \overline{MC} = x - 4$$


2단계: 점 $A$는 원 위의 점이므로 $\overline{OA} = x\rm,cm$이다. $\overline{OM} \perp \overline{AB}$이므로 삼각형 $OMA$는 $\angle OMA = 90^\circ$인 직각삼각형이다. 따라서 피타고라스 정리에 의하여 $$\begin{aligned} \overline{OA}^2 &= \overline{OM}^2 + \overline{AM}^2 \ x^2 &= (x - 4)^2 + 12^2 \end{aligned}$$ 따라서 정답은 ④이다.
```json
{
  "status": "EXEMPT",
  "reason": "현과 수선의 분할 길이로 직각삼각형 피타고라스 방정식을 수립하는 문항"
}
```
```json
{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "OM=x-4와 OA=x를 직각삼각형 OMA에 대입하여 x^2=(x-4)^2+12^2 방정식을 수립한다.",
  "decisiveStep": "직각삼각형 OMA 피타고라스 식 x^2 = (x-4)^2 + 12^2 식별",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 중심과 현의 길이의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CHORD_RADIUS_PYTHAGOREAN_EQUATION",
    "templateKey": "TPL_M3_CHORD_SAGITTA_RADIUS_FORMULA",
    "why": "현의 반길이와 화살(sagitta) 길이로부터 반지름 이차방정식을 세우는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도형 관계를 관찰하여 올바른 피타고라스 대수 방정식을 모델링하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "현",
      "수선",
      "반지름"
    ],
    "goal": [
      "방정식"
    ],
    "method": [
      "피타고라스",
      "모델링"
    ],
    "condition": []
  },
  "hold": ""
}
```
## Q10
- 형식: 객관식
- 배점: 5


### 발문
다음 그림과 같이 원 $O$가 직각사다리꼴 $ABCD$($\angle C = \angle D = 90^\circ$)의 각 변과 네 점에서 접하고 있다. $\overline{AB} = 10\rm,cm, \overline{BC} = 12\rm,cm$이고 사각형 $ABCD$의 넓이가 $72\rm,cm^2$일 때, 그림에 대한 설명 중 옳지 않은 것은? [5점]


### 선지
① 사각형 $ABCD$는 사다리꼴이다. ② 원 $O$의 반지름의 길이는 $4\rm,cm$이다. ③ 선분 $\overline{AD}$의 길이는 $5\rm,cm$이다. ④ 원 $O$의 넓이는 $16\pi\rm,cm^2$이다. ⑤ 사각형 $ABCD$의 둘레의 길이는 $36\rm,cm$이다.


### 정답
③


### 해설
원에 외접하는 사각형의 마주 보는 두 대변의 합이 같다는 성질을 이용하여 사다리꼴의 각 변의 길이를 구한다.


1단계: 원에 외접하는 사각형 $ABCD$에서 두 대변의 길이의 합은 서로 같으므로 $$\overline{AB} + \overline{CD} = \overline{AD} + \overline{BC}$$ $\overline{CD}$는 원 $O$의 지름이므로 $\overline{CD} = 2r$ (단, $r$은 원의 반지름)이다. $\overline{AB} = 10\rm,cm, \overline{BC} = 12\rm,cm$이므로 $$10 + 2r = \overline{AD} + 12 \implies \overline{AD} = 2r - 2$$


2단계: 직각사다리꼴 $ABCD$의 넓이는 다음과 같다. $$\begin{aligned} \text{넓이} &= \dfrac{(\overline{AD} + \overline{BC}) \times \overline{CD}}{2} \ 72 &= \dfrac{((2r - 2) + 12) \times 2r}{2} \ 72 &= (2r + 10)r \ 2r^2 + 10r - 72 &= 0 \ r^2 + 5r - 36 &= 0 \ (r + 9)(r - 4) &= 0 \end{aligned}$$ 반지름 $r > 0$이므로 $r = 4\rm,cm$이다. (② 참)


3단계: $r = 4$를 대입하면 각 변의 길이는 다음과 같다. • $\overline{CD} = 2r = 8\rm,cm$ • $\overline{AD} = 2(4) - 2 = 6\rm,cm$ 따라서 '$\overline{AD}$의 길이는 $5\rm,cm$이다'라고 한 ③은 옳지 않다. (③ 거짓)


4단계: 나머지 항목을 확인하면 다음과 같다. • 원 $O$의 넓이: $\pi r^2 = \pi \times 4^2 = 16\pi\rm,cm^2$ (④ 참) • 사각형 $ABCD$의 둘레: $10 + 12 + 8 + 6 = 36\rm,cm$ (⑤ 참) 따라서 옳지 않은 것은 ③이다. 따라서 정답은 ③이다.
```json
{
  "status": "EXEMPT",
  "reason": "원 외접사다리꼴 대변합 성질과 넓이 이차방정식 풀이를 통한 변의 길이 감사 문항"
}
```
```json
{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "외접사각형 대변합 성질로 AD=2r-2를 세우고 넓이 공식 r(2r+10)=72에서 r=4, AD=6을 구해 3번의 오류를 판정한다.",
  "decisiveStep": "이차방정식 r^2+5r-36=0에서 r=4 도출 및 AD=6 판정",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 외접다각형과 이차방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CIRCUMSCRIBED_TRAPEZOID_PROPERTIES",
    "templateKey": "TPL_M3_TANGENT_QUAD_AREA_QUADRATIC_RADIUS",
    "why": "외접사다리꼴의 대변 합등식과 넓이로부터 이차방정식으로 제원을 감사하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_QUADRATIC_EQUATION",
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외접사각형의 접선 대변합 정리와 사다리꼴 넓이 이차방정식을 결합하는 고난도 종합 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "외접사다리꼴",
      "변",
      "넓이"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "대변합",
      "이차방정식",
      "둘레"
    ],
    "condition": [
      "직각사다리꼴"
    ]
  },
  "hold": ""
}
```
## Q11
- 형식: 객관식
- 배점: 4


### 발문
다음 그림의 원 $O$에서 원주각 $\angle APB = 40^\circ$이고 호의 길이가 $\wideparen{AB} = \wideparen{BC}$일 때, $\angle a + \angle b$의 크기는? [4점] (단, $\angle b = \angle BOC$는 중심각이고, $\angle a$는 호 $\wideparen{ABC}$에 대한 원주각이다.)


### 선지
① $160^\circ$ ② $150^\circ$ ③ $140^\circ$ ④ $130^\circ$ ⑤ $120^\circ$


### 정답
①


### 해설
원주각과 중심각의 $2$배 관계 및 길이가 같은 호의 원주각 성질을 이용한다.


1단계: $\angle APB = 40^\circ$는 호 $\wideparen{AB}$에 대한 원주각이므로, 호 $\wideparen{AB}$에 대한 중심각 $\angle AOB$의 크기는 원주각의 $2$배이다. $$\angle AOB = 2 \times 40^\circ = 80^\circ$$


2단계: 조건에서 $\wideparen{AB} = \wideparen{BC}$이므로 호 $\wideparen{BC}$에 대한 중심각 $\angle b = \angle BOC$의 크기도 호 $\wideparen{AB}$의 중심각과 같다. $$\angle b = 80^\circ$$


3단계: 각 $\angle a$는 두 호를 합친 전체 호 $\wideparen{ABC}$에 대한 원주각이다. 호 $\wideparen{ABC}$의 중심각은 다음과 같다. $$\angle AOC = \angle AOB + \angle BOC = 80^\circ + 80^\circ = 160^\circ$$ 따라서 원주각 $\angle a$의 크기는 다음과 같다. $$\angle a = \dfrac{160^\circ}{2} = 80^\circ$$


4단계: 따라서 구하고자 하는 합의 값은 다음과 같다. $$\begin{aligned} \angle a + \angle b &= 80^\circ + 80^\circ \ &= 160^\circ \end{aligned}$$ 따라서 정답은 ①이다.
```json
{
  "status": "EXEMPT",
  "reason": "길이가 같은 두 호의 중심각 및 합성 호의 원주각 합산 각도 연산 문항"
}
```
```json
{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "원주각 40도로 호 AB 중심각 80도와 b=80도를 얻고 합성호 원주각 a=80도를 더해 160도를 구한다.",
  "decisiveStep": "중심각 b=80도 및 원주각 a=80도 산출 후 a+b=160도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각과 중심각의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_EQUAL_ARCS_ANGLE_RELATIONS",
    "templateKey": "TPL_M3_EQUAL_ARCS_CENTRAL_INSCRIBED_SUM",
    "why": "같은 길이의 호에서 중심각과 합성호 원주각의 합을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원주각과 중심각의 2배 관계 및 호의 덧셈 성질을 연계하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "호",
      "원주각",
      "중심각"
    ],
    "goal": [
      "합",
      "각"
    ],
    "method": [
      "원주각",
      "중심각"
    ],
    "condition": [
      "동일호"
    ]
  },
  "hold": ""
}
```
## Q12
- 형식: 객관식
- 배점: 4


### 발문
다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고 점 $P$는 원 $O$ 위의 점이다. 중심각 $\angle AOP = 80^\circ$일 때, $\angle x$의 크기는? [4점] (단, $\angle x = \angle OPB$이다.)


### 선지
① $30^\circ$ ② $32^\circ$ ③ $35^\circ$ ④ $38^\circ$ ⑤ $40^\circ$


### 정답
⑤


### 해설
반원에 대한 중심각과 이등변삼각형의 성질을 이용한다.


1단계: 선분 $\overline{AB}$가 원 $O$의 지름이므로 세 점 $A, O, B$는 한 직선 위에 있다. 따라서 중심각 $\angle POB$의 크기는 다음과 같다. $$\begin{aligned} \angle POB &= 180^\circ - \angle AOP \ &= 180^\circ - 80^\circ \ &= 100^\circ \end{aligned}$$


2단계: 선분 $\overline{OP}$와 $\overline{OB}$는 모두 원 $O$의 반지름이므로 $$\overline{OP} = \overline{OB}$$ 따라서 삼각형 $OPB$는 이등변삼각형이다.


3단계: 이등변삼각형 $OPB$의 꼭지각이 $\angle POB = 100^\circ$이므로 두 밑각의 크기는 서로 같다. $$\begin{aligned} \angle x &= \dfrac{180^\circ - \angle POB}{2} \ &= \dfrac{180^\circ - 100^\circ}{2} \ &= \dfrac{80^\circ}{2} \ &= 40^\circ \end{aligned}$$ 따라서 정답은 ⑤이다.
```json
{
  "status": "EXEMPT",
  "reason": "지름 평각 분할 중심각 및 반지름 이등변삼각형 밑각 계산 문항"
}
```
```json
{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "지름 평각에서 각 POB=100도를 얻고 이등변삼각형 OPB의 밑각 x=(180-100)/2=40도를 계산한다.",
  "decisiveStep": "각 POB=100도 산출 및 이등변삼각형 밑각 x=40도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "반원에 대한 원주각과 이등변삼각형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DIAMETER_ISOSCELES_ANGLE",
    "templateKey": "TPL_M3_CENTRAL_ANGLE_ISOSCELES_BASE_ANGLE",
    "why": "반원 지름과 반지름으로 만들어지는 이등변삼각형의 밑각을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIAMETER",
    "CC_ISOSCELES_TRIANGLE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평각 180도 감산과 이등변삼각형 밑각 공식을 순차 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "지름",
      "중심각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "평각",
      "이등변삼각형"
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
다음 그림에서 두 직선 $AD, AE$와 선분 $BC$가 각각 세 점 $D, E, F$에서 원 $O$에 접한다. 원 $O$의 반지름의 길이가 $6\rm,cm$이고 $\overline{AO} = 10\rm,cm$일 때, $\triangle ABC$의 둘레의 길이는? [4점]


### 선지
① $14\rm,cm$ ② $16\rm,cm$ ③ $18\rm,cm$ ④ $20\rm,cm$ ⑤ $22\rm,cm$


### 정답
②


### 해설
접선의 길이의 성질과 직각삼각형 피타고라스 정리를 이용한다.


1단계: 점 $D$가 접점이므로 반지름 $\overline{OD}$와 접선 $\overline{AD}$는 수직이다. $$\angle ADO = 90^\circ$$ 직각삼각형 $AOD$에서 $\overline{AO} = 10\rm,cm, \overline{OD} = 6\rm,cm$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{AD} &= \sqrt{\overline{AO}^2 - \overline{OD}^2} \ &= \sqrt{10^2 - 6^2} \ &= \sqrt{100 - 36} \ &= \sqrt{64} \ &= 8\rm,cm \end{aligned}$$


2단계: 원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 점 $A$에서 그은 접선에 대하여 $\overline{AD} = \overline{AE} = 8\rm,cm$이다. 점 $B$에서 그은 접선에 대하여 $\overline{BD} = \overline{BF}$, 점 $C$에서 그은 접선에 대하여 $\overline{CE} = \overline{CF}$이다. 따라서 선분 $\overline{BC}$는 다음과 같이 치환된다. $$\overline{BC} = \overline{BF} + \overline{CF} = \overline{BD} + \overline{CE}$$


3단계: 삼각형 $ABC$의 둘레의 길이는 다음과 같다. $$\begin{aligned} \text{둘레} &= \overline{AB} + \overline{BC} + \overline{CA} \ &= \overline{AB} + (\overline{BD} + \overline{CE}) + \overline{CA} \ &= (\overline{AB} + \overline{BD}) + (\overline{CA} + \overline{CE}) \ &= \overline{AD} + \overline{AE} \ &= 8 + 8 \ &= 16\rm,cm \end{aligned}$$ 따라서 정답은 ②이다.
```json
{
  "status": "EXEMPT",
  "reason": "피타고라스 정리 접선 길이 산출 및 접선 치환을 통한 외접삼각형 둘레 계산 문항"
}
```
```json
{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "피타고라스로 AD=8을 구하고 삼각형 둘레 = 2*AD = 16을 도출한다.",
  "decisiveStep": "직각삼각형 AOD에서 AD=8 계산 후 둘레 2*AD=16 적용",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 접선의 길이의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_TRIANGLE_PERIMETER",
    "templateKey": "TPL_M3_TANGENTS_INTERSECTING_TRANSVERSAL",
    "why": "외부 점에서 그은 두 접선과 접선 횡단선이 이루는 삼각형의 둘레를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY",
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "피타고라스 연산과 접선 길이 합등식을 결합하는 전형적 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "삼각형",
      "반지름"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "피타고라스",
      "접선의길이",
      "치환"
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
다음 그림과 같이 네 꼭짓점이 한 원 위에 있는 사각형 $ABCD$에서 네 호의 길이의 비가 $\wideparen{AD} : \wideparen{CD} : \wideparen{BC} : \wideparen{AB} = 4 : 3 : 5 : 6$일 때, 내각 $\angle D$의 크기는? [4점]


### 선지
① $95^\circ$ ② $100^\circ$ ③ $105^\circ$ ④ $110^\circ$ ⑤ $115^\circ$


### 정답
④


### 해설
호의 길이의 비로부터 중심각을 비례배분하고 원주각의 성질을 적용한다.


1단계: 네 호의 길이의 비의 총합을 구하면 다음과 같다. $$4 + 3 + 5 + 6 = 18$$ 원 전체 둘레의 중심각의 크기는 $360^\circ$이므로, 비례 상수 $1$에 해당하는 중심각의 크기는 다음과 같다. $$360^\circ \div 18 = 20^\circ$$


2단계: 내각 $\angle D$는 꼭짓점 $D$를 마주 보는 호, 즉 점 $D$를 포함하지 않는 호 $\wideparen{ABC}$에 대한 원주각이다. 호 $\wideparen{ABC}$는 호 $\wideparen{AB}$와 호 $\wideparen{BC}$의 합이므로 $$\text{비율의 합} = 6 + 5 = 11$$ 따라서 호 $\wideparen{ABC}$에 대한 중심각의 크기는 다음과 같다. $$11 \times 20^\circ = 220^\circ$$


3단계: 원주각의 크기는 같은 호에 대한 중심각의 크기의 절반이므로 $$\begin{aligned} \angle D &= \dfrac{220^\circ}{2} \ &= 110^\circ \end{aligned}$$ 따라서 정답은 ④이다.
```json
{
  "status": "EXEMPT",
  "reason": "원 둘레 호의 비례배분을 통한 대하는 호의 중심각 및 원주각 계산 문항"
}
```
```json
{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "비의 합 18로 호 ABC의 중심각 220도를 구하고 절반을 취해 원주각 D=110도를 산출한다.",
  "decisiveStep": "호 ABC 중심각 220도 산출 후 1/2로 110도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각의 크기와 호의 길이의 비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_INSCRIBED_QUAD_ARC_RATIO",
    "templateKey": "TPL_M3_CYCLIC_QUAD_ARC_PROPORTION_ANGLE",
    "why": "내접사각형 네 변의 호의 길이 비로부터 특정 내각을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INSCRIBED_QUAD"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "호의 비례배분 연산과 원주각 1/2 공식을 결합한 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "내접사각형",
      "호",
      "비례식"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "비례배분",
      "원주각",
      "중심각"
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
다음 그림에서 직선 $AT$는 원 $O$의 접선이고 점 $A$는 그 접점이다. 세 점 $A, B, C$가 원 $O$ 위의 점일 때, 그림에서 설명하고 있는 원의 성질로 옳은 것은? [4점]


### 선지
① 원의 중심에서 현에 내린 수선은 그 현을 이등분한다. ② 한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 $\dfrac{1}{2}$이다. ③ 원의 접선과 그 접점을 지나는 현이 이루는 각의 크기는 그 각의 내부에 있는 호에 대한 원주각의 크기와 같다. ④ 원에 내접하는 사각형의 마주 보는 두 대각의 크기의 합은 $180^\circ$이다. ⑤ 한 원에서 길이가 같은 두 현은 원의 중심으로부터 같은 거리에 있다.


### 정답
③


### 해설
접선과 현이 이루는 각(접현각)의 정리를 확인한다.


그림은 원의 접선 $AT$와 접점 $A$를 지나는 현 $AB$가 이루는 각 $\angle BAT$가 그 각의 내부에 포함된 호 $\wideparen{AB}$에 대한 원주각 $\angle ACB$와 크기가 같음을 나타내고 있다. 이 성질을 바르게 서술한 문장은 '원의 접선과 그 접점을 지나는 현이 이루는 각의 크기는 그 각의 내부에 있는 호에 대한 원주각의 크기와 같다.'이다. 따라서 정답은 ③이다.
```json
{
  "status": "EXEMPT",
  "reason": "접선과 현이 이루는 각의 성질을 표현한 수학적 정의 진술 선별 문항"
}
```
```json
{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "접선과 현이 이루는 각이 내부 호의 원주각과 일치한다는 정리 문장을 식별한다.",
  "decisiveStep": "접선과 현이 이루는 각의 성질 서술 선지 선택",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_CHORD_THEOREM_DEFINITION",
    "templateKey": "TPL_M3_GEOMETRY_THEOREM_STATEMENT_AUDIT",
    "why": "기하 다이어그램이 가리키는 원의 정리를 올바른 문장으로 식별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접현각 정리의 기본 정의 문장을 직접 대조하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "현",
      "원주각"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질",
      "정의"
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
다음 그림에서 직선 $AT$는 원 $O$의 접선이고 점 $A$는 접점이다. $\angle COA = 104^\circ$일 때, $\angle CAT = \angle x$의 크기를 구하면? [4점]


### 선지
① $52^\circ$ ② $54^\circ$ ③ $56^\circ$ ④ $58^\circ$ ⑤ $60^\circ$


### 정답
①


### 해설
접선과 반지름의 수직 관계 및 이등변삼각형의 성질을 이용한다.


1단계: 삼각형 $AOC$에서 선분 $\overline{OA}$와 $\overline{OC}$는 원 $O$의 반지름이므로 $$\overline{OA} = \overline{OC}$$ 따라서 삼각형 $AOC$는 이등변삼각형이다. 꼭지각 $\angle COA = 104^\circ$이므로 밑각 $\angle OAC$의 크기는 다음과 같다. $$\begin{aligned} \angle OAC &= \dfrac{180^\circ - 104^\circ}{2} \ &= \dfrac{76^\circ}{2} \ &= 38^\circ \end{aligned}$$


2단계: 직선 $AT$는 점 $A$에서의 접선이므로 반지름 $\overline{OA}$와 접선 $AT$는 수직이다. $$\angle OAT = 90^\circ$$ 따라서 구하고자 하는 각 $\angle x$의 크기는 다음과 같다. $$\begin{aligned} \angle x &= \angle OAT - \angle OAC \ &= 90^\circ - 38^\circ \ &= 52^\circ \end{aligned}$$ (참고: 접선과 현이 이루는 각의 성질에 의하여 $\angle x$는 호 $\wideparen{CA}$에 대한 원주각과 같으므로 $\dfrac{1}{2}\angle COA = \dfrac{104^\circ}{2} = 52^\circ$로도 즉시 구할 수 있다.) 따라서 정답은 ①이다.
```json
{
  "status": "EXEMPT",
  "reason": "접선 수직과 반지름 이등변삼각형 보각 또는 접현각 공식에 따른 단순 각도 계산 문항"
}
```
```json
{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "중심각 104도의 절반을 취하여 접현각 x=52도를 즉시 산출한다.",
  "decisiveStep": "x = 104도 / 2 = 52도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_CHORD_ANGLE_FROM_CENTRAL",
    "templateKey": "TPL_M3_CENTRAL_ANGLE_TO_TANGENT_CHORD",
    "why": "호의 중심각이 주어졌을 때 접선과 현이 이루는 각을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중심각의 절반이 접현각이라는 정리를 직접 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "중심각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "접현각",
      "중심각"
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
다음은 학생 $8$명이 지난 한 달 동안 관람한 영화의 편수를 조사하여 나타낸 자료이다. 이 자료의 중앙값을 구하면? [3점]


$$3, \quad 5, \quad 2, \quad 7, \quad 4, \quad 6, \quad 4, \quad 9 \quad (\text{단위: 편})$$


### 선지
① $4$편 ② $4.5$편 ③ $5$편 ④ $5.5$편 ⑤ $6$편


### 정답
②


### 해설
자료를 크기순으로 나열하고 짝수 개 자료의 중앙값 공식을 적용한다.


1단계: 주어진 $8$개의 자료를 작은 값부터 차례로 나열하면 다음과 같다. $$2, \quad 3, \quad 4, \quad 4, \quad 5, \quad 6, \quad 7, \quad 9$$


2단계: 자료의 개수가 $8$개(짝수 개)이므로 중앙값은 한가운데 있는 두 자료, 즉 $4$번째 자료($4$)와 $5$번째 자료($5$)의 평균이다. $$\begin{aligned} \text{중앙값} &= \dfrac{4 + 5}{2} \ &= \dfrac{9}{2} \ &= 4.5\text{편} \end{aligned}$$ 따라서 정답은 ②이다.
```json
{
  "status": "EXEMPT",
  "reason": "8개 수치 자료 크기순 정렬 및 가운데 두 값의 평균 중앙값 산출 문항"
}
```
```json
{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "자료를 정렬하여 4번째 값 4와 5번째 값 5의 평균 4.5편을 중앙값으로 산출한다.",
  "decisiveStep": "정렬 후 가운데 두 값의 평균 (4+5)/2=4.5 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "중앙값의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_MEDIAN_EVEN_COUNT",
    "templateKey": "TPL_M3_UNGROUPED_DATA_MEDIAN",
    "why": "짝수 개의 개별 변량 자료에서 정렬 후 중앙값을 구하는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자료 정렬 후 단순 평균을 내는 1단계 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자료",
      "변량"
    ],
    "goal": [
      "중앙값"
    ],
    "method": [
      "정렬",
      "평균"
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
어느 배구 팀 선수 $11$명의 체중의 평균은 $72\rm,kg$이고, 중앙값은 $70\rm,kg$이다. 이 팀에서 한 선수가 다른 팀으로 전출을 가고, 새로운 선수가 한 명 영입된 후에 선수 $11$명의 체중의 평균이 $74\rm,kg$이 되었다. 다음 설명 중 항상 옳은 것은? [5점] (단, 11명의 체중은 모두 다르다.)


### 선지
① 새로 영입된 선수의 체중은 반드시 $74\rm,kg$보다 무겁다. ② 전출을 간 선수의 체중이 새로 영입된 선수의 체중보다 무겁다. ③ 새로운 체중의 중앙값은 반드시 $72\rm,kg$보다 크다. ④ $11$명의 중앙값은 체중이 가벼운 순서대로 나열하였을 때 $7$번째 선수의 체중이다. ⑤ 전출을 간 선수의 체중이 $65\rm,kg$이었다면 새로 영입된 선수의 체중은 $87\rm,kg$이다.


### 정답
⑤


### 해설
평균의 변화로부터 전체 총합의 증감량을 계산하여 전출 선수와 영입 선수의 체중 차를 구한다.


1단계: 전체 인원수가 $11$명으로 동일하므로 체중의 총합의 변화는 다음과 같다. $$\begin{aligned} \text{처음 총합} &= 11 \times 72 = 792\rm,kg \ \text{나중 총합} &= 11 \times 74 = 814\rm,kg \ \text{총합의 증가량} &= 814 - 792 = 22\rm,kg \end{aligned}$$ 따라서 (새로 영입된 선수의 체중) - (전출 간 선수의 체중) = $22\rm,kg$이다.


2단계: 각 보기를 검토한다. • ① 전출 간 선수의 체중이 $50\rm,kg$이었다면 새로 온 선수는 $72\rm,kg$이어도 평균이 $74\rm,kg$가 되므로 반드시 $74\rm,kg$보다 무거워야 하는 것은 아니다. (거짓) • ② 새로 온 선수가 전출 간 선수보다 $22\rm,kg$ 더 무거우므로 옳지 않다. (거짓) • ③ 영입된 선수와 전출된 선수가 모두 중앙값($70\rm,kg$)보다 가벼운 쪽 또는 무거운 쪽에 위치할 경우 중앙값의 변화는 제한적이므로 반드시 $72\rm,kg$보다 커지는 것은 아니다. (거짓) • ④ $11$명(홀수 명)의 중앙값은 $\dfrac{11 + 1}{2} = 6$번째 선수의 체중이다. (거짓) • ⑤ 전출 간 선수의 체중이 $65\rm,kg$이었다면 새로 영입된 선수의 체중은 $65 + 22 = 87\rm,kg$이다. (참)


따라서 항상 옳은 것은 ⑤이다. 따라서 정답은 ⑤이다.
```json
{
  "status": "EXEMPT",
  "reason": "표본 교체에 따른 평균 총합 변화량 분석 및 대푯값 추론 문항"
}
```
```json
{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "총합 차이 11*(74-72)=22kg을 파악하여 65+22=87kg 진술의 정당성을 판별한다.",
  "decisiveStep": "총합 증가량 22kg 산출 및 65+22=87kg 부합성 확인",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "평균의 변화와 자료 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_MEAN_CHANGE_DATA_SWAP",
    "templateKey": "TPL_M3_DATA_REPLACEMENT_SUM_DELTA",
    "why": "자료 교체 시 평균 변화로부터 증감량을 분석하고 대푯값 성질을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균 변화에 따른 총합 델타 계산과 중앙값 순위 성질을 복합 추론하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평균",
      "인원수",
      "중앙값",
      "변화"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "총합",
      "변화량",
      "추론"
    ],
    "condition": [
      "상이변량"
    ]
  },
  "hold": ""
}
```
## Q19
- 형식: 객관식
- 배점: 4


### 발문
다음 표는 세 동아리 A, B, C 회원들의 수학 퀴즈 점수의 평균과 표준편차를 나타낸 것이다. 이때 점수가 가장 우수한 동아리와 점수가 가장 고른 동아리를 각각 바르게 짝지은 것은? [4점]


동아리
  A
  B
  C
  평균(점)
  $82$
  $88$
  $85$
  표준편차(점)
  $3$
  $6$
  $4$


### 선지
① 점수가 가장 우수한 동아리: A, 점수가 가장 고른 동아리: B ② 점수가 가장 우수한 동아리: A, 점수가 가장 고른 동아리: C ③ 점수가 가장 우수한 동아리: B, 점수가 가장 고른 동아리: A ④ 점수가 가장 우수한 동아리: B, 점수가 가장 고른 동아리: C ⑤ 점수가 가장 우수한 동아리: C, 점수가 가장 고른 동아리: A


### 정답
③


### 해설
평균과 표준편차의 통계적 의미를 해석하여 비교한다.


1단계: 점수가 가장 우수하다는 것은 평균 점수가 가장 높다는 것을 의미한다. 세 동아리의 평균 점수를 비교하면 다음과 같다. $$88\text{점 (B)} > 85\text{점 (C)} > 82\text{점 (A)}$$ 따라서 점수가 가장 우수한 동아리는 B이다.


2단계: 점수가 가장 고르다는 것은 변량들이 평균 주위에 밀집해 있어 산포도(표준편차)가 가장 작다는 것을 의미한다. 세 동아리의 표준편차를 비교하면 다음과 같다. $$3\text{점 (A)} < 4\text{점 (C)} < 6\text{점 (B)}$$ 따라서 점수가 가장 고른 동아리는 A이다.


3단계: 따라서 점수가 가장 우수한 동아리는 B, 점수가 가장 고른 동아리는 A이다. 따라서 정답은 ③이다.
```json
{
  "status": "EXEMPT",
  "reason": "평균의 대소(우수성) 및 표준편차의 최소(고름) 통계적 의미 해석 문항"
}
```
```json
{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "평균 최대치로 B를 우수한 집단으로, 표준편차 최소치로 A를 고른 집단으로 판정한다.",
  "decisiveStep": "평균 최대 B와 표준편차 최소 A 매칭",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "평균과 표준편차의 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_MEAN_SD_GROUP_COMPARISON",
    "templateKey": "TPL_M3_STATISTICS_TABLE_INTERPRETATION",
    "why": "집단별 평균과 표준편차 표를 보고 우수성과 산포도를 해석하는 표준 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균과 표준편차의 언어적 정의('우수하다', '고르다')를 정확히 연결하는 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "집단",
      "평균",
      "표준편차"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "비교",
      "해석"
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
다음은 학생 $5$명의 하루 물 섭취량에 대한 편차를 나타낸 자료이다. 이 자료의 표준편차를 구하면? [4점]


$$-4, \quad 3, \quad 2, \quad \square, \quad -5 \quad (\text{단위: 컵})$$


### 선지
① $3$컵 ② $\sqrt{10}$컵 ③ $2\sqrt{3}$컵 ④ $\sqrt{14}$컵 ⑤ $4$컵


### 정답
④


### 해설
편차의 총합은 $0$이라는 성질을 이용하여 미지의 편차를 구하고 표준편차를 계산한다.


1단계: 편차의 총합은 항상 $0$이므로 $\square$ 안의 편차를 $x$라 하면 $$\begin{aligned} (-4) + 3 + 2 + x + (-5) &= 0 \ x - 4 &= 0 \ x &= 4\text{컵} \end{aligned}$$ 따라서 $5$명의 편차는 각각 $-4, 3, 2, 4, -5$이다.


2단계: 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차제곱합} &= (-4)^2 + 3^2 + 2^2 + 4^2 + (-5)^2 \ &= 16 + 9 + 4 + 16 + 25 \ &= 70 \end{aligned}$$


3단계: 분산은 편차의 제곱의 평균이므로 $$\text{분산} = \dfrac{70}{5} = 14$$


4단계: 표준편차는 분산의 양의 제곱근이므로 다음과 같다. $$\text{표준편차} = \sqrt{14}\text{컵}$$ 따라서 정답은 ④이다.
```json
{
  "status": "EXEMPT",
  "reason": "편차합 0 공식으로 미지수 편차를 구하고 편차제곱평균으로 표준편차를 구하는 문항"
}
```
```json
{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "편차합 0으로 네모=4를 구하고 분산 70/5=14에서 표준편차 sqrt(14)를 산출한다.",
  "decisiveStep": "편차합 방정식으로 4 도출 후 sqrt(70/5)=sqrt(14) 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "편차와 표준편차의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DEVIATION_MISSING_STANDARD_DEVIATION",
    "templateKey": "TPL_M3_DEVIATION_ARRAY_TO_VARIANCE",
    "why": "누락된 편차를 복원하고 분산 및 표준편차를 도출하는 대표 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "편차합 성질 역산과 분산, 제곱근 계산의 3단계 프로세스를 수행하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "편차",
      "자료"
    ],
    "goal": [
      "표준편차"
    ],
    "method": [
      "편차합",
      "분산",
      "제곱근"
    ],
    "condition": []
  },
  "hold": ""
}
```
## Q21
- 형식: 서술형
- 배점: 7


### 발문
[서술형 1] 다음 그림과 같은 직사각형 $ABCD$에서 $\overline{AB} = 8\rm,cm, \overline{AD} = 17\rm,cm$이다. 선분 $\overline{AF}$를 접는 선으로 하여 꼭짓점 $D$가 변 $\overline{BC}$ 위의 점 $E$에 오도록 접었다. $\angle EAF = x^\circ$라 할 때, $\sin x^\circ$와 $\cos x^\circ$의 값을 각각 구하시오. (7점) (단, $\sin x^\circ, \cos x^\circ$의 값만 쓰면 부분 점수만 인정되므로 $\overline{BE}$의 길이를 구하는 과정을 포함한 전체 과정을 서술하시오.)
### 정답
\sin x^\circ = \dfrac{\sqrt{17}}{17}, \quad \cos x^\circ = \dfrac{4\sqrt{17}}{17}


### 해설
직사각형의 접기 성질과 피타고라스 정리를 이용하여 선분의 길이를 구하고 직각삼각형에서 삼각비를 계산한다.


1단계: 접었으므로 선분 $\overline{AE}$의 길이는 접히기 전의 변 $\overline{AD}$의 길이와 같다. $$\overline{AE} = \overline{AD} = 17\rm,cm$$ 직각삼각형 $ABE$에서 $\angle B = 90^\circ$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{BE} &= \sqrt{\overline{AE}^2 - \overline{AB}^2} \ &= \sqrt{17^2 - 8^2} \ &= \sqrt{289 - 64} \ &= \sqrt{225} \ &= 15\rm,cm \end{aligned}$$


2단계: 선분 $\overline{EC}$의 길이는 다음과 같다. $$\begin{aligned} \overline{EC} &= \overline{BC} - \overline{BE} \ &= 17 - 15 \ &= 2\rm,cm \end{aligned}$$ $\overline{EF} = \overline{DF} = y\rm,cm$라 두면 $\overline{FC} = \overline{CD} - \overline{DF} = 8 - y$이다. 직각삼각형 $EFC$에서 피타고라스 정리를 적용하면 $$\begin{aligned} \overline{EF}^2 &= \overline{EC}^2 + \overline{FC}^2 \ y^2 &= 2^2 + (8 - y)^2 \ y^2 &= 4 + 64 - 16y + y^2 \ 16y &= 68 \ y &= \dfrac{68}{16} = \dfrac{17}{4}\rm,cm \end{aligned}$$ 따라서 $\overline{EF} = \dfrac{17}{4}\rm,cm$이다.


3단계: 접은 각에 의하여 $\angle AEF = \angle ADF = 90^\circ$이다. 따라서 삼각형 $AFE$는 $\angle AEF = 90^\circ$인 직각삼각형이다. 피타고라스 정리에 의하여 빗변 $\overline{AF}$의 길이는 다음과 같다. $$\begin{aligned} \overline{AF} &= \sqrt{\overline{AE}^2 + \overline{EF}^2} \ &= \sqrt{17^2 + \left(\dfrac{17}{4}\right)^2} \ &= \sqrt{17^2 \left(1 + \dfrac{1}{16}\right)} \ &= 17 \times \dfrac{\sqrt{17}}{4} = \dfrac{17\sqrt{17}}{4}\rm,cm \end{aligned}$$


4단계: $\angle EAF = x^\circ$이므로 직각삼각형 $AFE$에서 삼각비의 정의에 의하여 $$\begin{aligned} \sin x^\circ &= \dfrac{\overline{EF}}{\overline{AF}} = \dfrac{\dfrac{17}{4}}{\dfrac{17\sqrt{17}}{4}} = \dfrac{1}{\sqrt{17}} = \dfrac{\sqrt{17}}{17} \ \cos x^\circ &= \dfrac{\overline{AE}}{\overline{AF}} = \dfrac{17}{\dfrac{17\sqrt{17}}{4}} = \dfrac{4}{\sqrt{17}} = \dfrac{4\sqrt{17}}{17} \end{aligned}$$ 따라서 구하는 값은 $\sin x^\circ = \dfrac{\sqrt{17}}{17}, \cos x^\circ = \dfrac{4\sqrt{17}}{17}$이다.
```json
{
  "status": "EXEMPT",
  "reason": "직사각형 종이 접기 모델링, 다단계 피타고라스 연립 및 삼각비 도출 서술 문항"
}
```
```json
{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-05",
  "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
  "conceptClusterKey": "TRIG_RATIO_APPLICATION",
  "primaryMethod": "BE=15를 구하고 삼각형 EFC에서 EF=17/4를 얻은 뒤 직각삼각형 AFE에서 sin x=sqrt(17)/17, cos x=4sqrt(17)/17을 계산한다.",
  "decisiveStep": "직각삼각형 ABE, EFC 피타고라스 연쇄 적용 후 직각삼각형 AFE에서 삼각비 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "삼각비",
    "l3": "삼각비의 활용",
    "l4": "도형의 접기와 삼각비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_RECTANGLE_FOLDING_TRIG_RATIO",
    "templateKey": "TPL_M3_PAPER_FOLDING_RIGHT_TRIANGLES_CHAIN",
    "why": "직사각형을 접었을 때 생기는 직각삼각형들의 피타고라스 연쇄로 각의 삼각비를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS",
    "CC_PAPER_FOLDING"
  ],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직사각형 종이 접기의 불변량과 피타고라스 방정식을 3단계로 연결하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "직사각형",
      "종이접기",
      "변"
    ],
    "goal": [
      "삼각비"
    ],
    "method": [
      "피타고라스",
      "방정식",
      "삼각비정의"
    ],
    "condition": [
      "접기불변"
    ]
  },
  "hold": ""
}
```
## Q22
- 형식: 서술형
- 배점: 7


### 발문
[서술형 2] 다음 그림에서 직선 $AT$는 원 $O$의 접선이고 네 점 $A, B, C, D$는 모두 원 $O$ 위의 점이다. 접선과 현 $AB$가 이루는 각 $\angle TAB = 65^\circ$이고 사각형 $ABCD$의 내각 $\angle DCB = 115^\circ$일 때, $\angle DBA = \angle x$의 크기를 구하는 과정과 답을 서술하시오. (7점)


### 정답
$50^\circ$


### 해설
접선과 현이 이루는 각의 성질과 원에 내접하는 사각형의 성질을 연계하여 서술한다.


1단계: 접선과 현이 이루는 각의 성질에 의하여 접선 $AT$와 현 $AB$가 이루는 각은 호 $\wideparen{AB}$에 대한 원주각 $\angle ADB$의 크기와 같다. $$\angle ADB = \angle TAB = 65^\circ$$


2단계: 사각형 $ABCD$는 원 $O$에 내접하므로 서로 마주 보는 두 대각의 크기의 합은 $180^\circ$이다. $$\begin{aligned} \angle DAB + \angle DCB &= 180^\circ \ \angle DAB &= 180^\circ - 115^\circ \ &= 65^\circ \end{aligned}$$


3단계: 삼각형 $DAB$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle x &= 180^\circ - (\angle ADB + \angle DAB) \ &= 180^\circ - (65^\circ + 65^\circ) \ &= 180^\circ - 130^\circ \ &= 50^\circ \end{aligned}$$ 따라서 구하는 각 $\angle DBA$의 크기는 $50^\circ$이다.
```json
{
  "status": "EXEMPT",
  "reason": "접현각 원주각 일치 및 내접사각형 대각합 180도 삼각형 내각합 연립 서술 문항"
}
```
```json
{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "접현각으로 각 ADB=65도를 구하고 내접사각형 대각합으로 각 DAB=65도를 얻어 삼각형 내각합으로 x=50도를 도출한다.",
  "decisiveStep": "각 ADB=65도 및 각 DAB=65도 산출 후 삼각형 내각합 180-130=50도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각과 내접사각형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_CHORD_CYCLIC_QUAD",
    "templateKey": "TPL_M3_TANGENT_CHORD_OPPOSITE_ANGLES_TRIANGLE",
    "why": "접현각과 내접사각형 대각의 합을 삼각형 내각합으로 종합하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY",
    "CC_INSCRIBED_QUAD"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선과 현의 성질, 내접사각형 대각합, 삼각형 내각합의 3단계를 순차적으로 논증하는 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "내접사각형",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "접현각",
      "대각합",
      "삼각형내각합"
    ],
    "condition": []
  },
  "hold": ""
}
```
## Q23
- 형식: 서술형
- 배점: 6


### 발문
[서술형 3] 다음은 학생 $10$명의 체력 검사에서 턱걸이 횟수를 조사하여 나타낸 자료이다. 이 자료의 평균이 $8$회일 때, $x$의 값을 구하고, 이 자료의 중앙값을 구하시오. (6점) ($x$ 구하는 과정: 3점, 자료를 나열하여 중앙값 구하는 과정: 3점)


$$x, \quad 9, \quad 10, \quad 5, \quad 7, \quad 7, \quad 8, \quad 6, \quad 11, \quad 10 \quad (\text{단위: 회})$$


### 정답
$x = 7$, 중앙값: $7.5$회


### 해설
평균으로부터 미지수 $x$를 구하고, 자료를 크기순으로 나열하여 중앙값을 서술한다.


1단계: $x$의 값 구하기 학생 $10$명의 턱걸이 횟수의 평균이 $8$회이므로 자료 전체의 총합은 다음과 같다. $$\text{총합} = 8 \times 10 = 80\text{회}$$ $x$를 제외한 나머지 $9$명의 턱걸이 횟수의 합을 구하면 $$9 + 10 + 5 + 7 + 7 + 8 + 6 + 11 + 10 = 73\text{회}$$ 따라서 다음 일차방정식이 성립한다. $$\begin{aligned} x + 73 &= 80 \ x &= 7\text{회} \end{aligned}$$


2단계: 자료를 나열하여 중앙값 구하기 구한 $x = 7$을 포함하여 $10$개의 자료를 작은 값부터 차례로 나열하면 다음과 같다. $$5, \quad 6, \quad 7, \quad 7, \quad 7, \quad 8, \quad 9, \quad 10, \quad 10, \quad 11$$ 자료의 개수가 $10$개(짝수 개)이므로 중앙값은 가운데 두 자료인 $5$번째 자료($7$)와 $6$번째 자료($8$)의 평균이다. $$\begin{aligned} \text{중앙값} &= \dfrac{7 + 8}{2} \ &= \dfrac{15}{2} \ &= 7.5\text{회} \end{aligned}$$ 따라서 $x = 7$이고, 중앙값은 $7.5$회이다.
```json
{
  "status": "EXEMPT",
  "reason": "평균 총합 일차방정식 미지수 계산 및 10개 자료 정렬 중앙값 서술 문항"
}
```
```json
{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "총합 80에서 x+73=80으로 x=7을 구하고 정렬된 자료의 5, 6번째 값 평균 7.5회를 중앙값으로 산출한다.",
  "decisiveStep": "총합 방정식으로 x=7 산출 및 정렬 후 중앙값 (7+8)/2=7.5 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "평균과 중앙값의 종합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_MEAN_SUM_TO_MEDIAN_STEPWISE",
    "templateKey": "TPL_M3_RECOVERY_THEN_SORT_MEDIAN",
    "why": "평균 총합으로부터 미지수를 구한 후 정렬하여 중앙값을 산출하는 서술형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균 공식 역산과 짝수 개 중앙값 계산의 2단계 표준 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료",
      "평균",
      "인원수"
    ],
    "goal": [
      "미지수",
      "중앙값"
    ],
    "method": [
      "방정식",
      "정렬",
      "평균"
    ],
    "condition": []
  },
  "hold": ""
}
```