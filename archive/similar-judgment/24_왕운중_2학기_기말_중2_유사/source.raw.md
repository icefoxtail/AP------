```json:exam
{
  "stem": "24_왕운중_2학기_기말_중2_유사",
  "sourceArchiveFile": "original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.js",
  "examFolder": "2final",
  "grade": "중2",
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
흰 공 $3$개, 검은 공 $4$개, 파란 공 $5$개가 들어 있는 주머니에서 공 한 개를 임의로 꺼낼 때, 검은 공을 꺼낼 확률은?
### 선지
① $\dfrac{1}{6}$ ② $\dfrac{1}{4}$ ③ $\dfrac{1}{3}$ ④ $\dfrac{5}{12}$ ⑤ $\dfrac{1}{2}$
### 정답
③
### 해설
주머니에 들어 있는 전체 공의 개수는
$$
3 + 4 + 5 = 12	ext{개}
$$
모든 공을 꺼낼 가능성은 같고 검은 공은 $4$개이므로, 검은 공을 꺼낼 확률은
$$
rac{4}{12} = rac{1}{3}
$$
따라서 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "동등가능한 경우의 수를 이용한 기본 확률 계산 문항"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY_BASIC_DEFINITION",
  "primaryMethod": "전체 공의 수 12개 중 검은 공 4개의 비율 4/12=1/3을 계산한다.",
  "decisiveStep": "4/12=1/3을 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 뜻",
    "l4": "동등가능한 경우"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "기본적인 사건의 경우의 수와 전체 경우의 수의 비로 확률을 구하는 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "전체 개수와 특정 사건 개수의 비를 바로 구하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [],
    "goal": [
      "확률"
    ],
    "method": [
      "확률"
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
세 변의 길이가 각각 다음과 같이 주어졌을 때, 직각삼각형인 것은?
### 선지
① $5m\,cm, 12m\,cm, 13m\,cm$ ② $3m\,cm, 5m\,cm, 6m\,cm$ ③ $4m\,cm, 6m\,cm, 8m\,cm$ ④ $7m\,cm, 9m\,cm, 11m\,cm$ ⑤ $8m\,cm, 10m\,cm, 14m\,cm$
### 정답
①
### 해설
삼각형의 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으면 피타고라스 정리의 역에 의해 직각삼각형이다.
각 선지를 검토하면 다음과 같다.
$$
egin{aligned}
	ext{① } &5^2 + 12^2 = 25 + 144 = 169 = 13^2 \quad (	ext{직각삼각형}) \
	ext{② } &3^2 + 5^2 = 9 + 25 = 34 
e 36 = 6^2 \
	ext{③ } &4^2 + 6^2 = 16 + 36 = 52 
e 64 = 8^2 \
	ext{④ } &7^2 + 9^2 = 49 + 81 = 130 
e 121 = 11^2 \
	ext{⑤ } &8^2 + 10^2 = 64 + 100 = 164 
e 196 = 14^2
\end{aligned}
$$
따라서 직각삼각형인 것은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "피타고라스 정리의 역을 이용한 직각삼각형 판정 선지 검토 문항"
}
```
```json:meta
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-07",
  "subUnitKey": "M2-07-PYTHAGOREAN_THEOREM",
  "conceptClusterKey": "PYTHAGOREAN_CONVERSE_TEST",
  "primaryMethod": "가장 긴 변 13의 제곱 169와 나머지 두 변의 제곱합 25+144=169가 일치함을 확인한다.",
  "decisiveStep": "5^2+12^2=13^2임을 확인한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "피타고라스 정리",
    "l3": "피타고라스 정리의 역",
    "l4": "직각삼각형 판정"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PYTHAGORAS_APPLICATION",
    "templateKey": "TPL_RIGHT_TRIANGLE_DETERMINATION",
    "why": "세 변의 길이로부터 직각삼각형 여부를 판정하는 대표 기본 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "제곱 계산을 통해 피타고라스 정리의 역을 확인하는 1단계 기초 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "변"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "피타고라스정리"
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
주머니 속에 빨간 공 $3$개와 초록 공 $5$개가 들어 있다. 이 주머니에서 한 개의 공을 임의로 꺼낼 때, 다음 설명 중 옳은 것은?
### 선지
① 노란 공이 나올 확률은 $\dfrac{1}{8}$이다.
② 빨간 공이 나올 확률은 $\dfrac{5}{8}$이다.
③ 초록 공이 나올 확률은 $1$이다.
④ 빨간 공 또는 초록 공이 나올 확률은 $\dfrac{1}{2}$이다.
⑤ 초록 공이 나올 확률은 빨간 공이 나올 확률보다 크다.
### 정답
⑤
### 해설
주머니에 들어 있는 전체 공의 개수는 $3 + 5 = 8$개이다.
각 선지를 검토하면 다음과 같다.
$$
egin{aligned}
	ext{① } &	ext{노란 공은 주머니에 없으므로 나올 확률은 } 0	ext{이다. (거짓)} \
	ext{② } &	ext{빨간 공이 나올 확률은 } rac{3}{8}	ext{이다. (거짓)} \
	ext{③ } &	ext{초록 공이 나올 확률은 } rac{5}{8}	ext{이다. (거짓)} \
	ext{④ } &	ext{모든 공이 빨간 공 또는 초록 공이므로 반드시 일어나는 사건의 확률은 } 1	ext{이다. (거짓)} \
	ext{⑤ } &	ext{초록 공이 나올 확률 } rac{5}{8}	ext{는 빨간 공이 나올 확률 } rac{3}{8}	ext{보다 크다. (참)}
\end{aligned}
$$
따라서 옳은 것은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단일 시행 확률의 기본 성질 및 대소 비교 선지 검토 문항"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "CONDITION",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY_COMPARISON_STATEMENT",
  "primaryMethod": "전체 8개 중 빨간 공 확률 3/8, 초록 공 확률 5/8를 구해 각 선지의 참·거짓을 판정한다.",
  "decisiveStep": "5/8 > 3/8임을 확인하여 ⑤를 정답으로 확정한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 뜻과 성질",
    "l4": "확률의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 정의와 성질을 이용해 진술의 참·거짓을 판별하는 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "확률의 기본 성질을 읽고 대소를 비교하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [],
    "goal": [
      "판정"
    ],
    "method": [
      "확률"
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
현우네 반 학생 $32$명 중에서 안경을 쓴 학생이 $12$명이라고 한다. 이 $32$명의 학생 중에서 한 명을 임의로 뽑을 때, 안경을 쓰지 않은 학생이 뽑힐 확률은?
### 선지
① $\dfrac{3}{8}$ ② $\dfrac{5}{8}$ ③ $\dfrac{11}{16}$ ④ $\dfrac{3}{4}$ ⑤ $\dfrac{13}{16}$
### 정답
②
### 해설
안경을 쓰지 않은 학생 수는 전체 학생 수에서 안경을 쓴 학생 수를 뺀 것이므로
$$
32 - 12 = 20	ext{명}
$$
따라서 안경을 쓰지 않은 학생이 뽑힐 확률은
$$
rac{20}{32} = rac{5}{8}
$$
(또는 여사건의 확률에 의해 $1 - \dfrac{12}{32} = 1 - \dfrac{3}{8} = \dfrac{5}{8}$)
따라서 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "여사건의 원리를 이용한 기본 확률 계산 문항"
}
```
```json:meta
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "COMPLEMENT_PROBABILITY_BASIC",
  "primaryMethod": "안경을 쓰지 않은 학생 20명을 구하여 20/32=5/8를 계산한다.",
  "decisiveStep": "20/32=5/8를 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 계산",
    "l4": "어떤 사건이 일어나지 않을 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_CALCULATION",
    "templateKey": "TPL_PROBABILITY_COMPLEMENT",
    "why": "여사건의 확률 또는 직접 여집합의 원소 수를 세어 확률을 구하는 기본 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여사건의 개수를 구하여 확률의 정의에 대입하는 1단계 기초 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "여사건"
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
$	riangle ABC$에서 변 $AC$의 중점을 $E$라 하고, 중선 $BE$ 위의 점 $G$가 $	riangle ABC$의 무게중심이다. $\overline{BG}=8m\,cm$일 때, 선분 $\overline{GE}$의 길이는?
### 선지
① $2m\,cm$ ② $\dfrac{5}{2}m\,cm$ ③ $3m\,cm$ ④ $4m\,cm$ ⑤ $\dfrac{9}{2}m\,cm$
### 정답
④
### 해설
삼각형의 무게중심은 각 중선을 꼭짓점으로부터 $2:1$로 나눈다.
선분 $\overline{BE}$는 꼭짓점 $B$에서 대변의 중점 $E$를 이은 중선이므로
$$
egin{aligned}
\overline{BG} : \overline{GE} &= 2 : 1 \
\overline{GE} &= rac{1}{2}\overline{BG} \
&= rac{1}{2} 	imes 8 \
&= 4m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{GE}$의 길이는 $4m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "삼각형의 무게중심에 의한 중선 2:1 내분 성질 기본 계산 문항"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-TRIANGLE_CENTROID",
  "conceptClusterKey": "CENTROID_MEDIAN_BASIC_RATIO",
  "primaryMethod": "무게중심 성질 BG:GE=2:1로부터 GE=8/2=4를 계산한다.",
  "decisiveStep": "8/2=4 cm를 계산한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 무게중심",
    "l4": "중선과 무게중심"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_CENTROID",
    "templateKey": "TPL_TRIANGLE_CENTROID_SEGMENT_RATIO",
    "why": "무게중심의 중선 2:1 분할비를 계산하는 대표 기본 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_MIDPOINT"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무게중심의 2:1 정의를 직접 사용하여 길이를 구하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "삼각형",
      "중점"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "무게중심"
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
$	riangle ABC$에서 두 변 $AB, AC$의 중점을 각각 $D, E$라 하고, 점 $G$를 $	riangle ABC$의 무게중심이라 하자. 삼각형 $DCE$의 넓이가 $15$일 때, 삼각형 $GBC$의 넓이는?
### 선지
① $16$ ② $18$ ③ $20$ ④ $22$ ⑤ $24$
### 정답
③
### 해설
점 $D, E$는 각각 변 $AB, AC$의 중점이므로 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이다.
$	riangle ADE \sim 	riangle ABC$이고 닮음비는 $1:2$이므로 넓이의 비는
$$
S_{	riangle ADE} = rac{1}{4} S_{	riangle ABC}
$$
선분 $\overline{CD}$는 $	riangle ABC$의 중선이므로 $S_{	riangle ADC} = \dfrac{1}{2}S_{	riangle ABC}$이다.
점 $E$가 선분 $\overline{AC}$의 중점이므로
$$
S_{	riangle DCE} = rac{1}{2} S_{	riangle ADC} = rac{1}{4} S_{	riangle ABC}
$$
$S_{	riangle DCE} = 15$이므로 $	riangle ABC$의 전체 넓이는
$$
S_{	riangle ABC} = 4 	imes 15 = 60
$$
점 $G$는 $	riangle ABC$의 무게중심이므로 점 $G$와 세 꼭짓점을 연결하여 생기는 세 삼각형의 넓이는 서로 같다.
$$
egin{aligned}
S_{	riangle GBC} &= rac{1}{3} S_{	riangle ABC} \
&= rac{1}{3} 	imes 60 \
&= 20
\end{aligned}
$$
따라서 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "중점 분할 삼각형 넓이와 무게중심 3등분 넓이 성질 연계 계산 문항"
}
```
```json:meta
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-TRIANGLE_CENTROID",
  "conceptClusterKey": "CENTROID_MIDPOINT_AREA_LINK",
  "primaryMethod": "DCE의 넓이가 전체의 1/4임을 이용해 전체 넓이 60을 구하고 무게중심 성질로 GBC=60/3=20을 구한다.",
  "decisiveStep": "전체 넓이 60에서 GBC=20을 계산한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 무게중심",
    "l4": "무게중심과 삼각형의 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_CENTROID",
    "templateKey": "TPL_TRIANGLE_CENTROID_AREA_RATIO",
    "why": "중점 연결 도형의 넓이로부터 전체 넓이를 역산하고 무게중심 분할 넓이를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_MIDPOINT_THEOREM",
    "CC_AREA_RATIO"
  ],
  "conditionKeys": [
    "COND_MIDPOINT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중점 넓이비 1/4과 무게중심 넓이비 1/3을 2단계로 연계하는 정규 난이도",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "중점"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "무게중심",
      "닮음비"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
$	riangle ABC$의 두 변 $AB, AC$ 위의 점 $D, E$에 대하여 $\overline{DE} \parallel \overline{BC}$이다. $\overline{AB}=18m\,cm$, $\overline{BD}=6m\,cm$, $\overline{AE}=10m\,cm$일 때, 선분 $\overline{EC}$의 길이는?
### 선지
① $5m\,cm$ ② $6m\,cm$ ③ $7m\,cm$ ④ $8m\,cm$ ⑤ $9m\,cm$
### 정답
①
### 해설
점 $D$가 변 $\overline{AB}$ 위의 점이므로
$$
\overline{AD} = \overline{AB} - \overline{BD} = 18 - 6 = 12m\,cm
$$
$\overline{DE} \parallel \overline{BC}$이므로 삼각형에서 평행선과 선분의 길이의 비 성질에 따라
$$
egin{aligned}
\overline{AD} : \overline{BD} &= \overline{AE} : \overline{EC} \
12 : 6 &= 10 : \overline{EC} \
2 : 1 &= 10 : \overline{EC} \
2 	imes \overline{EC} &= 10 \
\overline{EC} &= 5m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{EC}$의 길이는 $5m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "삼각형에서 평행선 사이의 선분의 길이의 비 비례식 계산 문항"
}
```
```json:meta
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
  "conceptClusterKey": "TRIANGLE_PARALLEL_SEGMENT_RATIO",
  "primaryMethod": "AD=18-6=12를 구하고 평행선 비례식 AD:DB=AE:EC로부터 12:6=10:EC를 풀어 EC=5를 계산한다.",
  "decisiveStep": "2·EC=10에서 EC=5 cm를 계산한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "평행선 사이의 선분의 길이의 비",
    "l4": "삼각형에서 평행선과 선분의 길이의 비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PARALLEL_SEGMENT_RATIO",
    "templateKey": "TPL_PARALLEL_SEGMENT_RATIO_GENERAL",
    "why": "삼각형의 한 변에 평행한 선분이 다른 두 변을 나눌 때의 선분비 계산 기본 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_PARALLEL"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "선분의 차로 한 구간을 구한 후 기본 평행선 비례식을 푸는 정규 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "선분"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "닮음비"
    ],
    "condition": [
      "평행"
    ]
  },
  "hold": ""
}
```

## Q08
- 형식: 객관식
- 배점: 4
### 발문
$500$원짜리 동전 $8$개와 $1000$원짜리 지폐 $6$장으로 $4000$원을 지불하는 방법의 수는? (단, 사용하는 동전이나 지폐의 개수에는 제한이 없으며, $0$개 사용해도 된다.)
### 선지
① $1$가지 ② $2$가지 ③ $3$가지 ④ $4$가지 ⑤ $5$가지
### 정답
⑤
### 해설
사용하는 $500$원짜리 동전의 개수를 $a$, $1000$원짜리 지폐의 장수를 $b$라 하자.
문제의 조건에 의해
$$
500a + 1000b = 4000 \quad (0 \le a \le 8, \; 0 \le b \le 6, \; a, b	ext{는 정수})
$$
양변을 $500$으로 나누면
$$
a + 2b = 8 \implies a = 8 - 2b
$$
$b$의 값에 따른 $a$의 값을 확인하면 다음과 같다.
$$
egin{aligned}
b = 0 &\implies a = 8 \quad (	ext{가능: } (8, 0)) \
b = 1 &\implies a = 6 \quad (	ext{가능: } (6, 1)) \
b = 2 &\implies a = 4 \quad (	ext{가능: } (4, 2)) \
b = 3 &\implies a = 2 \quad (	ext{가능: } (2, 3)) \
b = 4 &\implies a = 0 \quad (	ext{가능: } (0, 4))
\end{aligned}
$$
$b \ge 5$이면 $a < 0$이므로 불가능하다.
따라서 지불하는 방법의 수는 모두 $5$가지이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "동전과 지폐 개수 범위 제약 하에서 일차부정방정식 순서쌍을 구하는 문항"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_COUNTING",
  "conceptClusterKey": "MONEY_PAYMENT_DIOPHANTINE",
  "primaryMethod": "500a+1000b=4000을 a+2b=8로 약분한 뒤 0<=a<=8, 0<=b<=6 제약에서 순서쌍 5개를 열거한다.",
  "decisiveStep": "b in {0,1,2,3,4}의 5가지를 확인한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "경우의 수",
    "l3": "경우의 수",
    "l4": "돈을 지불하는 경우의 수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_CASES",
    "templateKey": "TPL_COUNTING_ORDERED_PAIRS",
    "why": "동전과 지폐를 이용한 금액 지불 방법의 수를 일차방정식 순서쌍으로 구하는 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "계수가 큰 미지수를 기준으로 정수해를 분류하는 전형적인 경우의 수 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "경우분류"
    ],
    "condition": [
      "순서쌍"
    ]
  },
  "hold": ""
}
```

## Q09
- 형식: 객관식
- 배점: 4
### 발문
$	riangle ABC$의 변 $BC$ 위의 점 $E$, 변 $AC$ 위의 점 $D$에 대하여 $ngle B = ngle CDE$이다. $\overline{BE}=5m\,cm$, $\overline{EC}=7m\,cm$, $\overline{CD}=6m\,cm$일 때, 선분 $\overline{AD}$의 길이는?
### 선지
① $7m\,cm$ ② $8m\,cm$ ③ $9m\,cm$ ④ $10m\,cm$ ⑤ $11m\,cm$
### 정답
②
### 해설
변 $\overline{BC}$의 전체 길이는
$$
\overline{BC} = \overline{BE} + \overline{EC} = 5 + 7 = 12m\,cm
$$
$	riangle ABC$와 $	riangle DEC$에서
$$
egin{aligned}
ngle C &	ext{는 공통} \
ngle B &= ngle CDE
\end{aligned}
$$
두 쌍의 대응각의 크기가 각각 같으므로
$$
	riangle ABC \sim 	riangle DEC \quad (	ext{AA 닮음})
$$
대응변의 길이의 비가 같으므로
$$
egin{aligned}
\overline{BC} : \overline{DC} &= \overline{AC} : \overline{EC} \
12 : 6 &= \overline{AC} : 7 \
2 : 1 &= \overline{AC} : 7 \
\overline{AC} &= 14m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{AD}$의 길이는
$$
egin{aligned}
\overline{AD} &= \overline{AC} - \overline{CD} \
&= 14 - 6 \
&= 8m\,cm
\end{aligned}
$$
따라서 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "공통각과 조건각에 의한 삼각형 AA 닮음 비례식 계산 문항"
}
```
```json:meta
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILAR_FIGURE",
  "conceptClusterKey": "AA_SIMILARITY_SEGMENT_DIFFERENCE",
  "primaryMethod": "공통각 ∠C와 ∠B=∠CDE로 △ABC∽△DEC를 보이고 BC:DC=AC:EC=2:1로부터 AC=14, AD=8을 구한다.",
  "decisiveStep": "AC=14에서 AD=14-6=8 cm를 계산한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 닮음",
    "l4": "AA"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_SIMILARITY",
    "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION",
    "why": "공통각을 포함한 두 삼각형의 AA 닮음비를 이용해 변의 길이를 구하는 대표 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "닮음인 두 삼각형을 찾고 대응변 비례식으로 전체 길이를 구한 뒤 차를 구함",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "각"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "닮음"
    ],
    "condition": [
      "대응변"
    ]
  },
  "hold": ""
}
```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
$ngle BAC = 90^\circ$인 직각삼각형 $ABC$의 꼭짓점 $A$에서 빗변 $\overline{BC}$에 내린 수선의 발을 $D$라 하자. $\overline{AD}=6m\,cm$, $\overline{CD}=4m\,cm$일 때, 선분 $\overline{BD}$의 길이는?
### 선지
① $6m\,cm$ ② $7m\,cm$ ③ $8m\,cm$ ④ $9m\,cm$ ⑤ $10m\,cm$
### 정답
④
### 해설
직각삼각형의 닮음에 의한 높이 공식에서
$$
\overline{AD}^2 = \overline{BD} 	imes \overline{CD}
$$
이 성립한다. 주어진 값을 대입하면
$$
egin{aligned}
6^2 &= \overline{BD} 	imes 4 \
36 &= 4 	imes \overline{BD} \
\overline{BD} &= 9m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{BD}$의 길이는 $9m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "직각삼각형 빗변 수선의 발 높이 제곱 공식 대수 계산 문항"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILAR_FIGURE",
  "conceptClusterKey": "RIGHT_TRIANGLE_ALTITUDE_SQUARE",
  "primaryMethod": "직각삼각형 사영 공식 AD^2=BD·CD에 6^2=4·BD를 대입하여 BD=9를 계산한다.",
  "decisiveStep": "36=4·BD에서 BD=9 cm를 계산한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 닮음",
    "l4": "직각삼각형의 닮음 공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_SIMILARITY",
    "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION",
    "why": "직각삼각형의 빗변에 내린 수선의 길이 공식을 적용하는 대표 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_PERPENDICULAR"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직각삼각형 닮음 공식을 직접 적용하는 표준 계산 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직각삼각형",
      "수선의발"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "닮음"
    ],
    "condition": [
      "직각"
    ]
  },
  "hold": ""
}
```

## Q11
- 형식: 객관식
- 배점: 4
### 발문
$1$부터 $25$까지의 자연수가 각각 적힌 $25$개의 공이 들어 있는 주머니에서 공 $1$개를 임의로 꺼낼 때, $4$의 배수 또는 $9$의 배수가 적힌 공이 나올 확률은?
### 선지
① $\dfrac{6}{25}$ ② $\dfrac{7}{25}$ ③ $\dfrac{8}{25}$ ④ $\dfrac{9}{25}$ ⑤ $\dfrac{2}{5}$
### 정답
③
### 해설
$1$부터 $25$까지의 자연수 중
$$
egin{aligned}
4	ext{의 배수: } &\{4, 8, 12, 16, 20, 24\} \implies 6	ext{개} \
9	ext{의 배수: } &\{9, 18\} \implies 2	ext{개}
\end{aligned}
$$
$4$와 $9$의 공배수는 $36$의 배수이므로 $1$부터 $25$ 사이에는 공배수가 없다.
따라서 두 사건은 동시에 일어나지 않는 배반사건이므로 조건을 만족하는 경우의 수는
$$
6 + 2 = 8
$$
전체 경우의 수는 $25$이므로 구하는 확률은
$$
rac{8}{25}
$$
따라서 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "배반사건인 배수 조건의 합의 법칙 확률 계산 문항"
}
```
```json:meta
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "MUTUALLY_EXCLUSIVE_PROBABILITY_SUM",
  "primaryMethod": "4의 배수 6개와 9의 배수 2개를 구하고 공배수가 없음을 확인하여 (6+2)/25=8/25를 계산한다.",
  "decisiveStep": "6+2=8에서 8/25를 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 계산",
    "l4": "사건 A 또는 사건 B가 일어날 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_CALCULATION",
    "templateKey": "TPL_PROBABILITY_SUM_RULE",
    "why": "동시에 일어나지 않는 두 사건의 확률을 합의 법칙으로 구하는 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "배수 조건을 만족하는 원소를 세고 배반사건 합의 법칙을 적용함",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "합의법칙",
      "배반사건"
    ],
    "condition": [
      "배수"
    ]
  },
  "hold": ""
}
```

## Q12
- 형식: 객관식
- 배점: 4
### 발문
남학생 $5$명, 여학생 $3$명 중에서 동아리 대표 $2$명을 뽑는 경우의 수는?
### 선지
① $28$ ② $32$ ③ $36$ ④ $42$ ⑤ $56$
### 정답
①
### 해설
전체 학생 수는
$$
5 + 3 = 8	ext{명}
$$
자격이 같은 대표 $2$명을 뽑는 경우의 수는 순서를 고려하지 않고 $8$명 중에서 $2$명을 택하는 조합의 수와 같다.
$$
egin{aligned}
(	ext{경우의 수}) &= rac{8 	imes 7}{2 	imes 1} \
&= 28
\end{aligned}
$$
따라서 구하는 경우의 수는 $28$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "자격이 같은 대표 2명을 선출하는 조합 공식 계산 문항"
}
```
```json:meta
{
  "sourceQid": 12,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_COUNTING",
  "conceptClusterKey": "COMBINATION_REPRESENTATIVES",
  "primaryMethod": "전체 8명 중 자격이 같은 2명을 뽑는 조합 공식 (8×7)/(2×1)=28을 적용한다.",
  "decisiveStep": "56/2=28을 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "경우의 수",
    "l3": "경우의 수",
    "l4": "대표를 뽑는 경우의 수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_CASES",
    "templateKey": "TPL_COUNTING_COMBINATION",
    "why": "자격이 같은 대표를 선출하는 조합의 수를 구하는 대표 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "전체 인원을 합산한 뒤 대표 선출 조합 공식을 적용하는 정규 문항",
  "level": "중",
  "item4slot": {
    "given": [],
    "goal": [
      "개수"
    ],
    "method": [
      "조합"
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
$0, 1, 2, 3, 4, 5, 6$의 숫자가 각각 적힌 $7$장의 카드 중에서 서로 다른 $2$장을 뽑아 만들 수 있는 두 자리 자연수의 개수는?
### 선지
① $28$ ② $30$ ③ $32$ ④ $35$ ⑤ $36$
### 정답
⑤
### 해설
두 자리 자연수를 만들 때
십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5, 6$의 $6$가지이다.
일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지 $6$장의 카드 중 하나가 올 수 있으므로 $6$가지이다.
곱의 법칙에 의해 만들 수 있는 두 자리 자연수의 개수는
$$
6 	imes 6 = 36
$$
따라서 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "0을 포함한 숫자 카드 비복원추출 두 자리 순열 형성 문항"
}
```
```json:meta
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_COUNTING",
  "conceptClusterKey": "PERMUTATION_DIGIT_ZERO_INCLUDED",
  "primaryMethod": "십의 자리 6가지(0 제외), 일의 자리 6가지(남은 카드)로 곱의 법칙 6×6=36을 계산한다.",
  "decisiveStep": "6×6=36을 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "경우의 수",
    "l3": "여러 가지 경우의 수",
    "l4": "0을 포함하는 자연수의 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_CASES",
    "templateKey": "TPL_COUNTING_PERMUTATION",
    "why": "0을 포함하는 숫자 카드로 자연수를 만들 때의 순열 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "십의 자리에 0이 올 수 없음을 고려하여 순열을 적용함",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "순열"
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
$1$개의 동전을 $5$번 던질 때, 적어도 한 번은 앞면이 나올 확률은?
### 선지
① $\dfrac{15}{16}$ ② $\dfrac{31}{32}$ ③ $\dfrac{7}{8}$ ④ $\dfrac{29}{32}$ ⑤ $1$
### 정답
②
### 해설
'적어도 한 번은 앞면이 나온다'는 사건의 여사건은 '$5$번 모두 뒷면이 나온다'는 사건이다.
동전을 $5$번 던질 때 일어날 수 있는 모든 경우의 수는
$$
2^5 = 32	ext{가지}
$$
$5$번 모두 뒷면이 나오는 경우는 $(	ext{뒤}, 	ext{뒤}, 	ext{뒤}, 	ext{뒤}, 	ext{뒤})$의 $1$가지이므로 그 확률은
$$
P(	ext{모두 뒷면}) = rac{1}{32}
$$
따라서 여사건의 확률에 의해 구하는 확률은
$$
egin{aligned}
P &= 1 - P(	ext{모두 뒷면}) \
&= 1 - rac{1}{32} \
&= rac{31}{32}
\end{aligned}
$$
따라서 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "독립시행 동전 던지기에서 적어도 한 번 사건의 여사건 확률 계산 문항"
}
```
```json:meta
{
  "sourceQid": 14,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "AT_LEAST_ONCE_COIN_FLIP",
  "primaryMethod": "모두 뒷면이 나올 확률 (1/2)^5=1/32의 여사건 공식 1-1/32=31/32를 계산한다.",
  "decisiveStep": "1 - 1/32 = 31/32를 계산한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 계산",
    "l4": "적어도 ~일 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_CALCULATION",
    "templateKey": "TPL_PROBABILITY_COMPLEMENT",
    "why": "동전 던지기에서 '적어도 한 번' 사건의 확률을 여사건으로 구하는 대표 유형"
  },
  "crossConceptKeys": [
    "CC_INDEPENDENT_EVENTS"
  ],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여사건 공식을 정확히 인지하고 거듭제곱 분모를 계산함",
  "level": "중",
  "item4slot": {
    "given": [],
    "goal": [
      "확률"
    ],
    "method": [
      "여사건",
      "독립사건"
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
그림과 같이 $\overline{AB} \parallel \overline{EF} \parallel \overline{DC}$이고, 선분 $BC$ 위에 점 $F$가 있다. $\overline{AB}=12m\,cm$, $\overline{DC}=8m\,cm$일 때, 선분 $\overline{EF}$의 길이는?
### 선지
① $\dfrac{21}{5}m\,cm$ ② $\dfrac{22}{5}m\,cm$ ③ $\dfrac{23}{5}m\,cm$ ④ $\dfrac{24}{5}m\,cm$ ⑤ $5m\,cm$
### 정답
④
### 해설
$\overline{AB} \parallel \overline{DC}$이므로 엇각과 맞꼭지각에 의해
$$
	riangle ABE \sim 	riangle CDE \quad (	ext{AA 닮음})
$$
대응변의 길이의 비는
$$
\overline{BE} : \overline{ED} = \overline{AB} : \overline{DC} = 12 : 8 = 3 : 2
$$
따라서 선분 $\overline{BE}$와 $\overline{BD}$의 길이의 비는
$$
\overline{BE} : \overline{BD} = 3 : (3 + 2) = 3 : 5
$$
$	riangle BDC$에서 $\overline{EF} \parallel \overline{DC}$이므로 $	riangle BEF \sim 	riangle BDC$이고
$$
egin{aligned}
\overline{EF} : \overline{DC} &= \overline{BE} : \overline{BD} \
\overline{EF} : 8 &= 3 : 5 \
5 	imes \overline{EF} &= 24 \
\overline{EF} &= rac{24}{5}m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{EF}$의 길이는 $\dfrac{24}{5}m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "평행선 사이의 교차 닮음과 삼각형 평행선 선분비를 연계한 조화평균형 길이 계산 문항"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
  "conceptClusterKey": "PARALLEL_CROSSED_SEGMENT_RATIO",
  "primaryMethod": "△ABE∽△CDE로부터 BE:ED=3:2를 구하고 △BEF∽△BDC에서 EF=8×(3/5)=24/5를 계산한다.",
  "decisiveStep": "5·EF=24에서 EF=24/5 cm를 도출한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "평행선 사이의 선분의 길이의 비",
    "l4": "평행선과 선분의 길이의 비의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PARALLEL_SEGMENT_RATIO",
    "templateKey": "TPL_PARALLEL_SEGMENT_RATIO_GENERAL",
    "why": "사다리꼴 대각선 교점에서 밑변에 평행한 선분의 길이를 구하는 대표 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_SIMILARITY"
  ],
  "conditionKeys": [
    "COND_PARALLEL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "닮은 두 삼각형의 비례 관계를 2단계로 연쇄 적용하여 선분의 길이를 구함",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "선분"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "닮음비"
    ],
    "condition": [
      "평행"
    ]
  },
  "hold": ""
}
```

## Q16
- 형식: 객관식
- 배점: 5
### 발문
$A$ 주머니에는 빨간 공 $3$개와 파란 공 $4$개가 들어 있고, $B$ 주머니에는 빨간 공 $5$개와 파란 공 $2$개가 들어 있다. 두 주머니 $A, B$에서 각각 공을 한 개씩 임의로 꺼낼 때, 두 공의 색깔이 서로 다를 확률은?
### 선지
① $\dfrac{24}{49}$ ② $\dfrac{25}{49}$ ③ $\dfrac{26}{49}$ ④ $\dfrac{27}{49}$ ⑤ $\dfrac{4}{7}$
### 정답
③
### 해설
두 주머니 $A, B$에서 꺼낸 공의 색깔이 다를 경우는 두 가지 배반사건으로 나뉜다.
첫째, 주머니 $A$에서 빨간 공, 주머니 $B$에서 파란 공을 꺼낼 확률:
$$
P_1 = rac{3}{7} 	imes rac{2}{7} = rac{6}{49}
$$
둘째, 주머니 $A$에서 파란 공, 주머니 $B$에서 빨간 공을 꺼낼 확률:
$$
P_2 = rac{4}{7} 	imes rac{5}{7} = rac{20}{49}
$$
두 사건은 동시에 일어날 수 없으므로, 구하는 확률은 합의 법칙에 의해
$$
egin{aligned}
P &= P_1 + P_2 \
&= rac{6}{49} + rac{20}{49} \
&= rac{26}{49}
\end{aligned}
$$
따라서 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "두 독립 주머니에서 색이 다른 공을 꺼내는 배반사건 합의 법칙 확률 계산 문항"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "TWO_BAGS_DIFFERENT_COLOR_PROBABILITY",
  "primaryMethod": "P(빨, 파)=6/49와 P(파, 빨)=20/49를 더하여 26/49를 계산한다.",
  "decisiveStep": "6/49 + 20/49 = 26/49를 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 계산",
    "l4": "서로 다른 색을 뽑을 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_CALCULATION",
    "templateKey": "TPL_PROBABILITY_SUM_RULE",
    "why": "두 주머니에서 서로 다른 대상을 뽑는 확률을 곱의 법칙과 합의 법칙으로 해결하는 유형"
  },
  "crossConceptKeys": [
    "CC_INDEPENDENT_EVENTS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경우를 2가지로 나누어 각각 곱셈 후 덧셈을 수행하는 정규 난이도",
  "level": "중",
  "item4slot": {
    "given": [],
    "goal": [
      "확률"
    ],
    "method": [
      "독립사건",
      "합의법칙"
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
주사위 한 개를 두 번 던져 첫 번째 나온 눈의 수를 $a$, 두 번째 나온 눈의 수를 $b$라고 할 때, 다음 두 조건을 동시에 만족시킬 확률은?
<조건>
(가) $a 
e b$
(나) 두 직선 $y = 3x + 2$와 $y = ax + b$는 한 점에서 만난다.
### 선지
① $\dfrac{25}{36}$ ② $\dfrac{13}{18}$ ③ $\dfrac{7}{9}$ ④ $\dfrac{29}{36}$ ⑤ $\dfrac{5}{6}$
### 정답
①
### 해설
주사위를 두 번 던져 나오는 순서쌍 $(a, b)$의 전체 경우의 수는 $6 	imes 6 = 36$가지이다.
조건 (가)에 의해 $a 
e b$이어야 하므로, 같은 눈이 나오는 $6$가지 $(1, 1), (2, 2), \dots, (6, 6)$을 제외하면
$$
36 - 6 = 30	ext{가지}
$$
조건 (나)에서 두 직선 $y = 3x + 2$와 $y = ax + b$가 한 점에서 만나려면 두 직선의 기울기가 달라야 한다.
$$
a 
e 3
$$
따라서 (가)를 만족하는 $30$가지 중에서 기울기가 $3$인 경우, 즉 $a = 3$이고 $b 
e 3$인 경우를 제외해야 한다.
$a = 3$일 때 가능한 순서쌍은
$$
(3, 1), \quad (3, 2), \quad (3, 4), \quad (3, 5), \quad (3, 6) \implies 5	ext{가지}
$$
따라서 두 조건 (가), (나)를 동시에 만족시키는 경우의 수는
$$
30 - 5 = 25	ext{가지}
$$
구하는 확률은
$$
rac{25}{36}
$$
따라서 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "두 일차함수 직선의 위치 관계 조건과 주사위 눈 제약 조건 결합 확률 문항"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "CONDITION",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "LINEAR_SYSTEM_INTERSECTION_PROBABILITY",
  "primaryMethod": "a!=b인 30가지 중 기울기가 같은 a=3인 5가지를 제외하여 25/36을 계산한다.",
  "decisiveStep": "30-5=25에서 확률 25/36을 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 뜻",
    "l4": "경우의 수를 이용한 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "일차함수 그래프의 위치 관계(평행 조건)를 확률 계산과 결합한 응용 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_FUNCTION_PARALLEL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직선이 한 점에서 만날 조건(기울기 다름)을 주사위 조건에 맞추어 여집합으로 차감해야 함",
  "level": "상",
  "item4slot": {
    "given": [
      "주사위",
      "직선"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "여사건",
      "기울기"
    ],
    "condition": [
      "순서쌍"
    ]
  },
  "hold": ""
}
```

## Q18
- 형식: 객관식
- 배점: 5
### 발문
평행사변형 $ABCD$의 두 변 $AD$와 $BC$의 삼등분점을 각각 $E, F$와 $G, H$라 하자 (점의 순서는 $A-E-F-D$, $B-G-H-C$). 선분 $GF$와 선분 $AH$의 교점을 $P$, 선분 $GF$와 대각선 $AC$의 교점을 $Q$라 하자. 삼각형 $APQ$의 넓이가 $3$일 때, 평행사변형 $ABCD$의 넓이는?
### 선지
① $36$ ② $42$ ③ $45$ ④ $48$ ⑤ $54$
### 정답
⑤
### 해설
평행사변형 $ABCD$의 전체 넓이를 $S$, 높이를 $h$라 하자.
$\overline{AF} = \dfrac{2}{3}\overline{AD}$이고 $\overline{GC} = \dfrac{2}{3}\overline{BC}$이며 $\overline{AD} = \overline{BC}$이므로
$$
\overline{AF} = \overline{GC}, \quad \overline{AF} \parallel \overline{GC}
$$
따라서 사각형 $AFGC$는 평행사변형이고, 두 대각선 $AC$와 $FG$는 서로를 이등분하므로 점 $Q$는 대각선 $\overline{AC}$의 중점이다.
$$
\overline{AQ} = rac{1}{2}\overline{AC}
$$
$	riangle AGC$에서 $\overline{GQ}$는 중선이고, $\overline{GH} = \overline{HC}$이므로 $\overline{AH}$도 중선이다.
따라서 교점 $P$는 $	riangle AGC$의 무게중심이다.
무게중심의 성질에 의해
$$
\overline{AP} : \overline{PH} = 2 : 1 \implies rac{\overline{AP}}{\overline{AH}} = rac{2}{3}
$$
공통각 $A$를 갖는 두 삼각형 $	riangle APQ$와 $	riangle AHC$의 넓이의 비는
$$
rac{S_{	riangle APQ}}{S_{	riangle AHC}} = rac{\overline{AP}}{\overline{AH}} 	imes rac{\overline{AQ}}{\overline{AC}} = rac{2}{3} 	imes rac{1}{2} = rac{1}{3}
$$
한편 $	riangle AHC$의 밑변 $\overline{HC} = \dfrac{1}{3}\overline{BC}$이므로
$$
S_{	riangle AHC} = rac{1}{2} 	imes \overline{HC} 	imes h = rac{1}{2} 	imes rac{1}{3}\overline{BC} 	imes h = rac{1}{6} S
$$
따라서 $	riangle APQ$의 넓이는
$$
S_{	riangle APQ} = rac{1}{3} S_{	riangle AHC} = rac{1}{3} 	imes rac{1}{6}S = rac{1}{18}S
$$
$S_{	riangle APQ} = 3$이므로 평행사변형 $ABCD$의 넓이 $S$는
$$
S = 18 	imes 3 = 54
$$
따라서 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "평행사변형 내 부분 평행사변형 대각선 및 중선 무게중심 넓이비 종합 심화 문항"
}
```
```json:meta
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILAR_FIGURE",
  "conceptClusterKey": "PARALLELOGRAM_TRIPLE_DIVISION_CENTROID",
  "primaryMethod": "Q가 AC의 중점, P가 △AGC의 무게중심임을 밝혀 APQ의 넓이가 전체의 1/18임을 도출하고 S=18×3=54를 구한다.",
  "decisiveStep": "S_APQ = S/18에서 S = 54를 도출한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 무게중심",
    "l4": "평행사변형과 무게중심의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_CENTROID",
    "templateKey": "TPL_PARALLELOGRAM_CENTROID_AREA",
    "why": "평행사변형에서 무게중심과 중점을 활용하여 부분 넓이 비율을 구하는 심화 유형"
  },
  "crossConceptKeys": [
    "CC_AREA_RATIO",
    "CC_TRIANGLE_MEDIAN"
  ],
  "conditionKeys": [
    "COND_PARALLEL"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부분 평행사변형 발견, 무게중심 판정, 선분비의 곱에 의한 넓이비 축소의 4단계를 종합해야 하는 최고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "평행사변형"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "무게중심",
      "닮음비"
    ],
    "condition": [
      "대각선",
      "평행"
    ]
  },
  "hold": ""
}
```

## Q19
- 형식: 객관식
- 배점: 5
### 발문
한 변의 길이가 $1$인 정삼각형 $ABC$와 한 변의 길이가 $1$인 정사각형 $BDEC$가 변 $BC$를 공유하고 있다. 서로 다른 $2$개의 주사위를 동시에 던져 나온 두 눈의 수의 합만큼 두 점 $P, Q$가 각각 움직인다. 점 $P$는 꼭짓점 $B$에서 출발하여 시계 반대 방향($B 	o C 	o A 	o B$)으로 정삼각형의 변 위를 움직이고, 점 $Q$는 꼭짓점 $C$에서 출발하여 시계 반대 방향($C 	o B 	o D 	o E 	o C$)으로 정사각형의 변 위를 움직인다. 두 점 $P, Q$가 같은 꼭짓점에서 만나게 될 확률은?
### 선지
① $\dfrac{1}{6}$ ② $\dfrac{7}{36}$ ③ $\dfrac{2}{9}$ ④ $\dfrac{1}{4}$ ⑤ $\dfrac{5}{18}$
### 정답
②
### 해설
두 주사위 눈의 수의 합을 $s$라 하면 $2 \le s \le 12$이다.
두 도형이 만나는 꼭짓점은 공통변 $\overline{BC}$의 양 끝점인 $B$와 $C$뿐이다.
점 $P$의 위치 (둘레 $3$, 출발점 $B$):
$$
s \equiv 0 \pmod 3 \implies B, \quad s \equiv 1 \pmod 3 \implies C, \quad s \equiv 2 \pmod 3 \implies A
$$
점 $Q$의 위치 (둘레 $4$, 출발점 $C$):
$$
s \equiv 0 \pmod 4 \implies C, \quad s \equiv 1 \pmod 4 \implies B, \quad s \equiv 2 \pmod 4 \implies D, \quad s \equiv 3 \pmod 4 \implies E
$$
두 점이 만나려면 둘 다 점 $B$에 있거나 둘 다 점 $C$에 있어야 한다.
첫째, 점 $B$에서 만나는 경우:
$$
s \equiv 0 \pmod 3 \quad 	ext{이고} \quad s \equiv 1 \pmod 4
$$
$2 \le s \le 12$인 정수 중 이를 만족하는 수는 $s = 9$이다.
두 눈의 합이 $9$인 순서쌍은 $(3, 6), (4, 5), (5, 4), (6, 3)$의 $4$가지이다.
둘째, 점 $C$에서 만나는 경우:
$$
s \equiv 1 \pmod 3 \quad 	ext{이고} \quad s \equiv 0 \pmod 4
$$
$2 \le s \le 12$인 정수 중 이를 만족하는 수는 $s = 4$이다.
두 눈의 합이 $4$인 순서쌍은 $(1, 3), (2, 2), (3, 1)$의 $3$가지이다.
두 경우는 동시에 일어날 수 없으므로 만나는 전체 경우의 수는
$$
4 + 3 = 7	ext{가지}
$$
전체 경우의 수는 $6 	imes 6 = 36$가지이므로 구하는 확률은
$$
rac{7}{36}
$$
따라서 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "정삼각형과 정사각형 둘레 모듈로 주기성과 두 주사위 눈의 합 순서쌍 일치 확률 문항"
}
```
```json:meta
{
  "sourceQid": 19,
  "variationType": "CONTEXT",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_COUNTING",
  "conceptClusterKey": "DUAL_POLYGON_PERIODIC_WALK",
  "primaryMethod": "공통꼭짓점 B(s=9, 4가지)와 C(s=4, 3가지)에서 만나는 조건을 주기성으로 찾아 (4+3)/36=7/36을 계산한다.",
  "decisiveStep": "s=9(4가지)와 s=4(3가지)를 합산하여 7/36을 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 뜻",
    "l4": "경우의 수를 이용한 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "서로 다른 주기를 갖는 두 다각형 위의 동점 이동을 연립하여 만날 확률을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_DICE_OUTCOMES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형(주기 3)과 사각형(주기 4)의 합동식을 연립하여 가능한 합을 구해야 하는 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "정삼각형",
      "정사각형",
      "주사위"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "합의법칙"
    ],
    "condition": [
      "순서쌍"
    ]
  },
  "hold": ""
}
```

## Q20
- 형식: 객관식
- 배점: 5
### 발문
$ngle A = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=6m\,cm$, $\overline{BC}=10m\,cm$이고, $ngle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자. 점 $D$에서 빗변 $BC$에 내린 수선의 발을 $E$, 점 $E$를 지나고 선분 $BD$에 평행한 직선이 변 $AC$와 만나는 점을 $F$, 점 $F$에서 변 $BC$에 내린 수선의 발을 $G$라 할 때, 선분 $\overline{FG}$의 길이는?
### 선지
① $1m\,cm$ ② $\dfrac{9}{10}m\,cm$ ③ $\dfrac{11}{10}m\,cm$ ④ $\dfrac{6}{5}m\,cm$ ⑤ $\dfrac{7}{5}m\,cm$
### 정답
④
### 해설
직각삼각형 $ABC$에서 피타고라스 정리에 의해
$$
\overline{AC} = \sqrt{10^2 - 6^2} = 8m\,cm
$$
$\overline{BD}$가 $ngle B$의 이등분선이므로 각의 이등분선의 성질에 의해
$$
egin{aligned}
\overline{AD} : \overline{DC} &= \overline{AB} : \overline{BC} = 6 : 10 = 3 : 5 \
\overline{AD} &= 8 	imes rac{3}{3+5} = 3m\,cm \
\overline{DC} &= 8 	imes rac{5}{3+5} = 5m\,cm
\end{aligned}
$$
$	riangle ABD$와 $	riangle EBD$에서 $ngle A = ngle DEB = 90^\circ$, $ngle ABD = ngle EBD$, $\overline{BD}$는 공통이므로
$$
	riangle ABD \equiv 	riangle EBD \quad (	ext{RHA 합동})
$$
따라서 $\overline{DE} = \overline{AD} = 3m\,cm$이다.
직각삼각형 $CDE$에서 피타고라스 정리에 의해
$$
\overline{CE} = \sqrt{\overline{DC}^2 - \overline{DE}^2} = \sqrt{5^2 - 3^2} = 4m\,cm
$$
$\overline{EF} \parallel \overline{BD}$이므로 $	riangle CEF \sim 	riangle CBD$이고 닮음비는
$$
\overline{CE} : \overline{CB} = 4 : 10 = 2 : 5
$$
따라서 $\overline{CF} : \overline{CD} = 2 : 5$이다.
$\overline{FG} \perp \overline{BC}$이고 $\overline{DE} \perp \overline{BC}$이므로 $\overline{FG} \parallel \overline{DE}$이다.
$	riangle CGF \sim 	riangle CED$이고 닮음비는 $\overline{CF} : \overline{CD} = 2 : 5$이므로
$$
egin{aligned}
\overline{FG} : \overline{DE} &= 2 : 5 \
\overline{FG} : 3 &= 2 : 5 \
5 	imes \overline{FG} &= 6 \
\overline{FG} &= rac{6}{5}m\,cm
\end{aligned}
$$
따라서 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "직각삼각형 내각의 이등분선 정리, 직각삼각형 합동, 평행선 닮음비 연쇄 복합 문항"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-SIMILAR_FIGURE",
  "conceptClusterKey": "BISECTOR_PARALLEL_DOUBLE_SIMILARITY",
  "primaryMethod": "각의 이등분선비로 AD=3, DC=5, DE=3, CE=4를 구하고 평행선 닮음비 2:5로부터 FG=(2/5)·3=6/5를 계산한다.",
  "decisiveStep": "FG:3=2:5에서 FG=6/5 cm를 도출한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "삼각형의 내각의 이등분선",
    "l4": "내각의 이등분선과 선분의 길이의 비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TRIANGLE_SIMILARITY",
    "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION",
    "why": "각의 이등분선 정리와 평행선 닮음을 연계하여 변의 길이를 구하는 복합 심화 유형"
  },
  "crossConceptKeys": [
    "CC_ANGLE_BISECTOR_THEOREM",
    "CC_RIGHT_TRIANGLE_CONGRUENCE",
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [
    "COND_PERPENDICULAR",
    "COND_PARALLEL"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "각의 이등분선비, RHA 합동, 피타고라스 정리, 평행선 닮음비의 4단계 연쇄 추론 요구",
  "level": "상",
  "item4slot": {
    "given": [
      "직각삼각형",
      "각"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "이등분선",
      "합동",
      "닮음비"
    ],
    "condition": [
      "직각",
      "평행"
    ]
  },
  "hold": ""
}
```

## Q21
- 형식: 서답형
- 배점: 4
### 발문
[서술형 1] 사각형 $ABCD$에서 $ngle A = ngle C = 90^\circ$이고 $\overline{AB}=8m\,cm$, $\overline{AD}=4m\,cm$, $\overline{BC}=2m\,cm$, $\overline{CD}=xm\,cm$일 때, $x$의 값을 구하고 그 과정을 서술하시오. [4점]
### 선지
없음
### 정답
$2\sqrt{19}m\,cm$
### 해설
대각선 $\overline{BD}$를 그으면 $	riangle ABD$와 $	riangle BCD$는 각각 빗변이 $\overline{BD}$인 직각삼각형이다.
직각삼각형 $ABD$에서 피타고라스 정리에 의해
$$
egin{aligned}
\overline{BD}^2 &= \overline{AB}^2 + \overline{AD}^2 \
&= 8^2 + 4^2 \
&= 64 + 16 \
&= 80
\end{aligned}
$$
직각삼각형 $BCD$에서 피타고라스 정리에 의해
$$
\overline{BD}^2 = \overline{BC}^2 + \overline{CD}^2
$$
위에서 구한 $\overline{BD}^2 = 80$을 대입하면
$$
egin{aligned}
80 &= 2^2 + x^2 \
80 &= 4 + x^2 \
x^2 &= 76
\end{aligned}
$$
길이는 양수이므로
$$
x = \sqrt{76} = 2\sqrt{19}m\,cm
$$
따라서 $x$의 값은 $2\sqrt{19}m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "대각선을 빗변으로 공유하는 두 직각삼각형의 피타고라스 정리 서술형 계산 문항"
}
```
```json:meta
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-07",
  "subUnitKey": "M2-07-PYTHAGOREAN_APPLICATION",
  "conceptClusterKey": "SHARED_HYPOTENUSE_PYTHAGORAS",
  "primaryMethod": "공통 빗변 BD^2=8^2+4^2=80을 구하고 2^2+x^2=80에서 x=sqrt(76)=2sqrt(19)를 계산한다.",
  "decisiveStep": "x^2=76에서 x=2sqrt(19) cm를 도출한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "피타고라스 정리",
    "l3": "피타고라스 정리의 활용",
    "l4": "평면도형에서의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PYTHAGORAS_APPLICATION",
    "templateKey": "TPL_PYTHAGORAS_QUADRILATERAL",
    "why": "공통 빗변을 갖는 사각형에서 피타고라스 정리를 두 번 적용하는 대표 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_RIGHT_ANGLE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "보조선 대각선 BD를 긋고 두 직각삼각형의 피타고라스 정리를 연립하는 표준 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직각삼각형",
      "변"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "피타고라스정리"
    ],
    "condition": [
      "직각",
      "대각선"
    ]
  },
  "hold": ""
}
```

## Q22
- 형식: 서답형
- 배점: 5
### 발문
[서술형 2] 어느 지역에서 비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이고, 비가 오지 않은 다음 날 비가 올 확률은 $\dfrac{1}{3}$이라고 한다. 월요일에 비가 왔을 때, 이틀 후인 수요일에 비가 올 확률을 구하고 그 과정을 서술하시오. [5점]
### 선지
없음
### 정답
$\dfrac{37}{75}$
### 해설
월요일에 비가 왔으므로, 화요일의 날씨에 따라 다음의 두 가지 경우로 나누어 생각한다.
첫째, 화요일에 비가 오고, 수요일에도 비가 오는 경우:
비가 온 다음 날 비가 올 확률은 $\dfrac{3}{5}$이므로
$$
P_1 = rac{3}{5} 	imes rac{3}{5} = rac{9}{25}
$$
둘째, 화요일에 비가 오지 않고, 수요일에 비가 오는 경우:
비가 온 다음 날 비가 오지 않을 확률은 $1 - \dfrac{3}{5} = \dfrac{2}{5}$이고,
비가 오지 않은 다음 날 비가 올 확률은 $\dfrac{1}{3}$이므로
$$
P_2 = rac{2}{5} 	imes rac{1}{3} = rac{2}{15}
$$
두 경우는 동시에 일어날 수 없으므로, 수요일에 비가 올 확률은 합의 법칙에 의해
$$
egin{aligned}
P &= P_1 + P_2 \
&= rac{9}{25} + rac{2}{15} \
&= rac{27}{75} + rac{10}{75} \
&= rac{37}{75}
\end{aligned}
$$
따라서 수요일에 비가 올 확률은 $\dfrac{37}{75}$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "조건부 날씨 상태 전이에서 중간 단계 경우분류 및 곱·합의 법칙 서술 문항"
}
```
```json:meta
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "MARKOV_WEATHER_PROBABILITY",
  "primaryMethod": "화요일 비(3/5×3/5=9/25)와 화요일 맑음(2/5×1/3=2/15)으로 나누어 더해 37/75를 구한다.",
  "decisiveStep": "9/25 + 2/15 = 37/75를 계산한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 계산",
    "l4": "연속하여 일어나는 사건의 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_CALCULATION",
    "templateKey": "TPL_PROBABILITY_PRODUCT_RULE",
    "why": "날씨 전이 확률을 수형도 및 경우분류로 곱의 법칙과 합의 법칙을 적용하는 유형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중간 날의 날씨 두 가지 경우를 정확히 나누고 여사건과 조건 전이 확률을 연립 계산해야 함",
  "level": "중",
  "item4slot": {
    "given": [
      "확률"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "경우분류",
      "곱의법칙",
      "합의법칙"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q23
- 형식: 서답형
- 배점: 5
### 발문
[서술형 3] $0, 1, 2, 3, 4, 5$의 숫자가 각각 하나씩 적힌 $6$장의 카드 중에서 서로 다른 $2$장을 임의로 뽑아 두 자리 자연수를 만들 때, 그 수가 홀수일 확률을 구하고 그 과정을 서술하시오. [5점]
### 선지
없음
### 정답
$\dfrac{12}{25}$
### 해설
첫째, 만들 수 있는 두 자리 자연수의 전체 개수를 구한다.
십의 자리에는 $0$이 올 수 없으므로 올 수 있는 숫자는 $1, 2, 3, 4, 5$의 $5$가지이다.
일의 자리에는 십의 자리에 쓰인 숫자를 제외한 나머지 $5$장의 카드 중 하나가 올 수 있으므로 $5$가지이다.
따라서 전체 경우의 수는 곱의 법칙에 의해
$$
N = 5 	imes 5 = 25	ext{가지}
$$
둘째, 만든 두 자리 자연수가 홀수인 경우의 수를 구한다.
홀수가 되려면 일의 자리에 올 수 있는 숫자는 $1, 3, 5$의 $3$가지이다.
일의 자리의 숫자를 하나 정했을 때, 십의 자리에는 $0$과 이미 일의 자리에 쓰인 숫자를 제외해야 하므로 올 수 있는 숫자는
$$
6 - 2 = 4	ext{가지}
$$
따라서 홀수인 두 자리 자연수의 개수는 곱의 법칙에 의해
$$
3 	imes 4 = 12	ext{가지}
$$
셋째, 구하는 확률은
$$
P = rac{12}{25}
$$
따라서 구하는 확률은 $\dfrac{12}{25}$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "0을 포함한 숫자 카드의 비복원 두 자리 자연수 형성 및 홀수 조건 확률 서술 문항"
}
```
```json:meta
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-08",
  "subUnitKey": "M2-08-PROBABILITY_BASIC",
  "conceptClusterKey": "ODD_DIGIT_PERMUTATION_PROBABILITY",
  "primaryMethod": "전체 두 자리 자연수 5×5=25개를 구하고, 일의 자리 3가지×십의 자리 4가지=12개를 찾아 12/25를 계산한다.",
  "decisiveStep": "전체 25개와 홀수 12개에서 확률 12/25를 도출한다.",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률",
    "l3": "확률의 뜻",
    "l4": "경우의 수를 이용한 확률"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "0을 포함하는 카드로부터 홀수 자연수를 만드는 경우의 수를 세어 확률을 구하는 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_PERMUTATION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "십의 자리에 0 제외 조건과 일의 자리 홀수 조건을 정확히 서술하여 확률을 계산해야 함",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "순열"
    ],
    "condition": [
      "홀수"
    ]
  },
  "hold": ""
}
```

## Q24
- 형식: 서답형
- 배점: 6
### 발문
[서술형 4] 세 평행한 직선 $l, m, n$이 두 직선과 만나는 점을 각각 $A, B, C$와 $D, E, F$라 하자. $\overline{AB}=6m\,cm$, $\overline{BC}=9m\,cm$, $\overline{AD}=10m\,cm$, $\overline{CF}=25m\,cm$일 때, 선분 $\overline{BE}$의 길이를 구하고 그 과정을 서술하시오. [6점]
### 선지
없음
### 정답
$16m\,cm$
### 해설
점 $A$를 지나고 직선 $DF$에 평행한 직선을 그어 직선 $m, n$과 만나는 점을 각각 $E', F'$이라 하자.
$\overline{AD} \parallel \overline{E'E} \parallel \overline{F'F}$이고 $\overline{AF'} \parallel \overline{DF}$이므로 사각형 $ADE'E$와 사각형 $ADF'F$는 모두 평행사변형이다.
따라서 대변의 길이가 같으므로
$$
\overline{BE'} = \overline{CF'} = \overline{AD} = 10m\,cm
$$
선분 $\overline{F'F}$의 길이는
$$
\overline{F'F} = \overline{CF} - \overline{CF'} = 25 - 10 = 15m\,cm
$$
$	riangle ACF'$에서 $\overline{E'E} \parallel \overline{F'F}$이므로 삼각형에서 평행선 사이의 선분의 길이의 비 성질에 의해
$$
egin{aligned}
\overline{AB} : \overline{AC} &= \overline{E'E} : \overline{F'F} \
6 : (6 + 9) &= \overline{E'E} : 15 \
6 : 15 &= \overline{E'E} : 15 \
2 : 5 &= \overline{E'E} : 15 \
5 	imes \overline{E'E} &= 30 \
\overline{E'E} &= 6m\,cm
\end{aligned}
$$
따라서 구하는 선분 $\overline{BE}$의 길이는
$$
egin{aligned}
\overline{BE} &= \overline{BE'} + \overline{E'E} \
&= 10 + 6 \
&= 16m\,cm
\end{aligned}
$$
따라서 선분 $\overline{BE}$의 길이는 $16m\,cm$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "세 평행선 사이의 사다리꼴 보조선 평행사변형 분할과 삼각형 닮음비 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 24,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-06",
  "subUnitKey": "M2-06-PARALLEL_LENGTH_RATIO",
  "conceptClusterKey": "TRAPEZOID_PARALLEL_SEGMENT_CALCULATION",
  "primaryMethod": "보조선으로 평행사변형 BE'=10을 분할하고 삼각형 닮음비 6:15=E'E:15로부터 E'E=6을 얻어 BE=16을 구한다.",
  "decisiveStep": "E'E=6을 구해 BE=10+6=16 cm를 도출한다.",
  "rpm": {
    "majorUnit": "도형의 닮음과 피타고라스 정리",
    "midUnit": "도형의 닮음",
    "l3": "평행선 사이의 선분의 길이의 비",
    "l4": "사다리꼴에서 평행선과 선분의 길이의 비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PARALLEL_SEGMENT_RATIO",
    "templateKey": "TPL_PARALLEL_SEGMENT_RATIO_GENERAL",
    "why": "사다리꼴에서 보조선을 그어 평행선 사이의 선분 길이를 구하는 서술형 대표 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_SIMILARITY"
  ],
  "conditionKeys": [
    "COND_PARALLEL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "보조선 평행선을 도입하여 평행사변형과 삼각형으로 분할 후 비례식을 서술해야 함",
  "level": "상",
  "item4slot": {
    "given": [
      "사다리꼴",
      "선분"
    ],
    "goal": [
      "선분"
    ],
    "method": [
      "닮음비",
      "평행사변형"
    ],
    "condition": [
      "평행"
    ]
  },
  "hold": ""
}
```
