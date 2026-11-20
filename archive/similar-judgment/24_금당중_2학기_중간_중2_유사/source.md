```json:exam
{"stem": "24_금당중_2학기_중간_중2_유사", "sourceArchiveFile": "original/middle/m2/2mid/24_금당중_2학기_중간_중2_수학.js", "examFolder": "2mid", "grade": "중2", "curriculum": "2015", "questionCount": 25, "totalScore": 100, "generatedAt": "2026-11-16"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
$\triangle ABC \sim \triangle DEF$이고 닮음비가 $2 : 1$이다. $\overline{BC} = 18\text{ cm}$, $\overline{CA} = 16\text{ cm}$, $\overline{DE} = 7\text{ cm}$일 때, $\triangle DEF$의 둘레의 길이는?
### 선지
① $21\text{ cm}$ ② $22\text{ cm}$ ③ $24\text{ cm}$ ④ $26\text{ cm}$ ⑤ $28\text{ cm}$
### 정답
③
### 해설
$\triangle ABC$와 $\triangle DEF$의 닮음비가 $2 : 1$이므로 $\overline{EF} = \dfrac{1}{2}\overline{BC} = \dfrac{1}{2} \times 18 = 9\text{ cm}$ $\overline{DF} = \dfrac{1}{2}\overline{CA} = \dfrac{1}{2} \times 16 = 8\text{ cm}$ $\therefore (\triangle DEF\text{의 둘레}) = 7 + 9 + 8 = 24\text{ (cm)}$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-SIMILAR_PERIMETER", "primaryMethod": "닮음비 2:1을 적용해 EF = 9cm, DF = 8cm를 구하고 DE = 7cm와 더해 둘레 24cm를 계산한다.", "decisiveStep": "대응변 BC와 CA를 각각 2로 나누어 EF = 9, DF = 8을 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "닮음비"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "닮음비로 삼각형 둘레의 길이 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_RATIO", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 닮음비로 대응변의 길이를 바로 구해 둘레를 합산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["삼각형", "비율"], "goal": ["길이"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q02
- 형식: 객관식
- 배점: 4
### 발문
다음 중 항상 닮은 도형이라고 할 수 없는 것은?
### 선지
① 반지름의 길이가 다른 두 원 ② 한 내각의 크기가 같은 두 이등변삼각형 ③ 중심각의 크기가 같은 두 부채꼴 ④ 한 예각의 크기가 같은 두 직각삼각형 ⑤ 한 모서리의 길이가 다른 두 정사면체
### 정답
②
### 해설
② 두 이등변삼각형에서 한 내각이 ^\circ 때 하나는 꼭짓각(^\circ, 70^\circ, 70^\circ$)이고 다른 하나는 밑각(^\circ, 40^\circ, 40^\circ$)이면 세 각이 다를 수 있으므로 항상 닮은 도형이 아니다. ①, ③, ④, ⑤는 모두 항상 닮은 도형이다. $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-NOT_ALWAYS_SIMILAR", "primaryMethod": "한 내각만 같은 두 이등변삼각형은 꼭짓각과 밑각이 엇갈릴 수 있어 닮음이 아닐 수 있음을 판별한다.", "decisiveStep": "한 내각이 같은 이등변삼각형에서 꼭짓각 대 밑각 반례를 찾는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "대응변·대응각"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "항상 닮은 도형이 아닌 조건 판별 키가 선택표에 없음"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "주어진 조건만으로 항상 닮음이 결정되는 도형과 반례가 존재하는 도형을 구분하는 1단계 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q03
- 형식: 객관식
- 배점: 3
### 발문
$\triangle ABC$에서 점 $M$은 변 $AB$의 중점이고, 점 $M$을 지나고 변 $BC$에 평행한 직선이 변 $AC$와 만나는 점을 $N$이라 하자. $\overline{AB} = 9\text{ cm}$, $\overline{BC} = 13\text{ cm}$, $\overline{AM} = x\text{ cm}$, $\overline{MN} = y\text{ cm}$일 때, $x + y$의 값은?
### 선지
① $11$ ② $9$ ③ $10$ ④ $12$ ⑤ $13$
### 정답
①
### 해설
$M$은 $\overline{AB}$의 중점이므로 $x = \overline{AM} = \dfrac{1}{2}\overline{AB} = \dfrac{9}{2}$ 삼각형의 중점연결정리에 의해 $y = \overline{MN} = \dfrac{1}{2}\overline{BC} = \dfrac{13}{2}$ $\therefore x + y = \dfrac{9}{2} + \dfrac{13}{2} = \dfrac{22}{2} = 11$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-PARALLEL_SEGMENT_RATIO", "conceptClusterKey": "M2-06-MIDPOINT_THEOREM_SUM", "primaryMethod": "중점 조건으로 x = 9/2, 삼각형의 중점연결정리로 y = 13/2를 구해 두 값을 더한다.", "decisiveStep": "MN = BC/2 = 13/2를 중점연결정리로 바로 구해 9/2와 더하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "평행선과 선분의 길이의 비", "l3": "삼각형과 평행선", "l4": "기본 비례"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "삼각형 중점연결정리 두 선분 길이 합 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중점과 삼각형의 중점연결정리를 바로 적용해 두 길이의 합을 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["삼각형", "중점", "평행"], "goal": ["합"], "method": ["중점연결정리"], "condition": []}, "hold": ""}

```

## Q04
- 형식: 객관식
- 배점: 3
### 발문
두 삼각기둥 $ABC\text{-}DEF$와 $GHI\text{-}JKL$은 서로 닮은 도형이고, 모서리 $EF$에 대응하는 모서리가 $KL$이다. $\overline{EF} = 3\text{ cm}$, $\overline{KL} = 6\text{ cm}$이고 작은 삼각기둥의 부피가 $15\text{ cm}^3$일 때, 큰 삼각기둥의 부피는?
### 선지
① $30\text{ cm}^3$ ② $60\text{ cm}^3$ ③ $90\text{ cm}^3$ ④ $120\text{ cm}^3$ ⑤ $135\text{ cm}^3$
### 정답
④
### 해설
두 삼각기둥의 닮음비는 $\overline{EF} : \overline{KL} = 3 : 6 = 1 : 2$이다. 부피의 비는 $1^3 : 2^3 = 1 : 8$이므로 $\therefore (\text{큰 삼각기둥의 부피}) = 15 \times 8 = 120\text{ (cm}^3\text{)}$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-PRISM_VOLUME_RATIO", "primaryMethod": "닮음비 3:6 = 1:2를 세제곱해 부피비 1:8을 구하고 15 × 8 = 120을 계산한다.", "decisiveStep": "부피의 비가 닮음비의 세제곱 1 : 8임을 적용하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮음의 활용", "l4": "넓이·부피 비"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "닮은 삼각기둥 부피 비 계산 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_AREA_VOLUME", "CC_VOLUME_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "닮음비의 세제곱이 부피의 비임을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["각기둥", "부피"], "goal": ["부피"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q05
- 형식: 객관식
- 배점: 4
### 발문
$\triangle ABC$에서 두 점 $D$, $E$는 각각 변 $AB$, 변 $AC$의 연장선(점 $B$, $C$의 바깥쪽) 위의 점이고 $\overline{BC} \parallel \overline{DE}$이다. $\overline{AD} = 15\text{ cm}$, $\overline{BD} = 5\text{ cm}$, $\overline{DE} = 12\text{ cm}$, $\overline{CE} = 4\text{ cm}$일 때, $\triangle ABC$의 둘레의 길이는?
### 선지
① $22\text{ cm}$ ② $23\text{ cm}$ ③ $24\text{ cm}$ ④ $25\text{ cm}$ ⑤ $26\text{ cm}$
### 정답
⑤
### 해설
$\overline{AB} = \overline{AD} - \overline{BD} = 15 - 5 = 10\text{ cm}$ $\overline{BC} \parallel \overline{DE}$이므로 $\triangle ABC \sim \triangle ADE$이고 닮음비는 $\overline{AB} : \overline{AD} = 10 : 15 = 2 : 3$이다. $\overline{BC} = 12 \times \dfrac{2}{3} = 8\text{ cm}$ $\dfrac{\overline{AC}}{\overline{AC} + 4} = \dfrac{2}{3} \implies 3\overline{AC} = 2\overline{AC} + 8 \implies \overline{AC} = 8\text{ cm}$ $\therefore (\triangle ABC\text{의 둘레}) = 10 + 8 + 8 = 26\text{ (cm)}$ $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-PARALLEL_SEGMENT_RATIO", "conceptClusterKey": "M2-06-PARALLEL_TRI_PERIMETER", "primaryMethod": "AB = 15 - 5 = 10으로 닮음비 2:3을 구해 BC = 8과 방정식 AC/(AC+4) = 2/3에서 AC = 8을 구한다.", "decisiveStep": "닮음비 2 : 3을 이용해 BC = 8과 AC : CE = 2 : 1에서 AC = 8을 각각 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "평행선과 선분의 길이의 비", "l3": "삼각형과 평행선", "l4": "기본 비례"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "삼각형 평행선 닮음비로 둘레 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLEL_LINES_RATIO", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선 닮음비를 구해 미지의 두 변 BC와 AC를 비례식으로 찾아 둘레를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "평행"], "goal": ["길이"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q06
- 형식: 객관식
- 배점: 4
### 발문
$\triangle ABC$에서 변 $AB$ 위의 점 $D$, 변 $AC$ 위의 두 점 $F$, $E$가 꼭짓점 $A$로부터 $A$, $F$, $E$, $C$의 순서로 놓여 있고 $\overline{DE} \parallel \overline{BC}$, $\overline{DF} \parallel \overline{BE}$이다. $\overline{AF} = 8$, $\overline{FE} = 4$일 때, $\overline{EC}$의 길이는?
### 선지
① $4$ ② $6$ ③ $8$ ④ $9$ ⑤ $10$
### 정답
②
### 해설
$\overline{DF} \parallel \overline{BE}$이므로 $\overline{AD} : \overline{DB} = \overline{AF} : \overline{FE} = 8 : 4 = 2 : 1$ $\overline{DE} \parallel \overline{BC}$이므로 $\overline{AE} : \overline{EC} = \overline{AD} : \overline{DB} = 2 : 1$ $\overline{AE} = 8 + 4 = 12$이므로 $12 : \overline{EC} = 2 : 1 \implies \overline{EC} = 6$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-PARALLEL_SEGMENT_RATIO", "conceptClusterKey": "M2-06-DOUBLE_PARALLEL_RATIO", "primaryMethod": "DF ∥ BE에서 AD:DB = 8:4 = 2:1을 얻고 DE ∥ BC로 AE:EC = 2:1에 대입해 EC = 6을 구한다.", "decisiveStep": "두 평행선이 공유하는 선분비 AD : DB = 2 : 1을 매개로 연결하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "평행선과 선분의 길이의 비", "l3": "비례 활용", "l4": "미지 길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "이중 평행선 선분비 전이 길이 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLEL_LINES_RATIO"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "두 평행선 조건에서 공통 변의 길이 비 AD:DB를 매개로 다른 변의 길이를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "평행"], "goal": ["길이"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
$\triangle ABC$의 세 중선 $AD$, $BE$, $CF$의 교점인 무게중심을 $G$라 할 때, 다음 중 옳지 않은 것을 모두 고르면? (정답 2개)
### 선지
① $\overline{GA} : \overline{GB} = 1 : 1$ ② $\overline{AG} = 2\overline{GD}$ ③ $\square AFGE = \triangle GBC$ ④ $\triangle ABC = 6\triangle GBD$ ⑤ $\overline{GF} = \dfrac{1}{3}\overline{CG}$
### 정답
①, ⑤
### 해설
무게중심 $G$는 각 중선을 꼭짓점으로부터 $2 : 1$로 나눈다. ① $\overline{GA}$와 $\overline{GB}$는 서로 다른 중선 위의 선분이므로 일반적으로 같지 않다. (거짓) ② $\overline{AG} : \overline{GD} = 2 : 1$이므로 $\overline{AG} = 2\overline{GD}$이다. (참) ③, ④ 세 중선은 삼각형을 넓이가 같은 $6$개의 작은 삼각형으로 나누므로 $\square AFGE = \triangle GBC = \dfrac{1}{3}\triangle ABC$이고 $\triangle ABC = 6\triangle GBD$이다. (참) ⑤ $\overline{CG} : \overline{GF} = 2 : 1$이므로 $\overline{GF} = \dfrac{1}{2}\overline{CG}$이다. (거짓) $\therefore$ ①, ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_CENTROID", "conceptClusterKey": "M2-06-CENTROID_PROPS_NOT", "primaryMethod": "무게중심의 2:1 내분 성질과 넓이 6등분 성질로 ②, ③, ④를 확인하고 ①, ⑤를 거짓으로 고른다.", "decisiveStep": "CG : GF = 2 : 1이므로 GF가 CG의 1/3이 아니라 1/2임을 가리는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "삼각형의 무게중심", "l3": "중선과 무게중심", "l4": "2:1 비"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "삼각형 무게중심 길이 비와 넓이 분할 복수정답 판별 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무게중심의 길이 2:1 비와 넓이 6등분 성질을 선지별로 정확히 대조하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "무게중심"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q08
- 형식: 객관식
- 배점: 4
### 발문
$\triangle ABC$의 무게중심을 $G$, 중선 $AD$와 변 $BC$의 교점을 $D$, 선분 $DC$의 중점을 $E$라 하자. 점 $E$를 지나고 선분 $DA$에 평행한 직선이 변 $AC$와 만나는 점을 $F$라 할 때, $\overline{AG} = 16\text{ cm}$이면 $\overline{EF}$의 길이는?
### 선지
① $8\text{ cm}$ ② $9\text{ cm}$ ③ $10\text{ cm}$ ④ $12\text{ cm}$ ⑤ $16\text{ cm}$
### 정답
④
### 해설
$\overline{AG} : \overline{GD} = 2 : 1$이고 $\overline{AG} = 16\text{ cm}$이므로 $\overline{GD} = 8\text{ cm}$, 따라서 $\overline{AD} = 16 + 8 = 24\text{ cm}$ $\triangle ADC$에서 $E$는 $\overline{DC}$의 중점이고 $\overline{EF} \parallel \overline{DA}$이므로 $F$는 $\overline{AC}$의 중점이다. $\therefore \overline{EF} = \dfrac{1}{2}\overline{AD} = \dfrac{1}{2} \times 24 = 12\text{ (cm)}$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_CENTROID", "conceptClusterKey": "M2-06-CENTROID_MIDPOINT_LEN", "primaryMethod": "무게중심 2:1 비로 AD = 24를 구한 뒤 ΔADC에서 중점연결정리로 EF = AD/2 = 12를 계산한다.", "decisiveStep": "AG = 16에서 GD = 8, AD = 24를 먼저 구하고 EF = AD/2를 적용하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "삼각형의 무게중심", "l3": "중선과 무게중심", "l4": "좌표·길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "무게중심 2:1과 중점연결정리 결합 길이 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLEL_LINES_RATIO"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무게중심의 2:1 비로 중선 전체 길이를 구한 뒤 삼각형의 중점연결정리를 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "무게중심", "중점"], "goal": ["길이"], "method": ["중점연결정리"], "condition": []}, "hold": ""}

```

## Q09
- 형식: 객관식
- 배점: 4
### 발문
$\triangle ABC$의 무게중심을 $G$, 두 변 $AB$, $AC$의 중점을 각각 $D$, $E$라 하자. $\triangle ADE$의 넓이가 $36\text{ cm}^2$일 때, $\triangle GDE$의 넓이는?
### 선지
① $12\text{ cm}^2$ ② $9\text{ cm}^2$ ③ $10\text{ cm}^2$ ④ $15\text{ cm}^2$ ⑤ $18\text{ cm}^2$
### 정답
①
### 해설
$\triangle ABC$의 높이를 $h$라 하면 중점연결정리에 의해 $\overline{DE} \parallel \overline{BC}$이고 $A$에서 $\overline{DE}$까지의 거리는 $\dfrac{h}{2}$이다. 무게중심 $G$에서 $\overline{BC}$까지의 거리는 $\dfrac{h}{3}$이므로 $G$에서 $\overline{DE}$까지의 거리는 $\dfrac{h}{2} - \dfrac{h}{3} = \dfrac{h}{6}$이다. $\triangle ADE$와 $\triangle GDE$는 밑변 $DE$가 같으므로 넓이의 비는 높이의 비 $\dfrac{h}{2} : \dfrac{h}{6} = 3 : 1$이다. $\therefore \triangle GDE = 36 \times \dfrac{1}{3} = 12\text{ (cm}^2\text{)}$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_CENTROID", "conceptClusterKey": "M2-06-CENTROID_MIDLINE_AREA", "primaryMethod": "중점연결선 DE와 무게중심 G의 높이 비 h/2 : h/6 = 3 : 1을 이용해 ΔGDE = 36/3 = 12를 구한다.", "decisiveStep": "G에서 DE까지의 거리가 전체 높이 h의 1/2 - 1/3 = 1/6임을 파악하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "삼각형의 무게중심", "l3": "넓이와 무게중심", "l4": "무게중심을 이용한 복합도형"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "중점연결선과 무게중심이 만드는 삼각형 넓이 비 키가 선택표에 없음"}, "crossConceptKeys": ["CC_AREA_RATIO"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중점연결정리와 무게중심 2:1 내분비를 높이 비(3:1)로 환산해 넓이를 구하는 3단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "무게중심", "중점", "넓이"], "goal": ["넓이"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AB} = 12\text{ cm}$, $\overline{BC} = 15\text{ cm}$인 직사각형 $ABCD$에서 변 $CD$ 위의 점 $E$를 잡아 $\overline{BE}$를 접는 선으로 하여 꼭짓점 $C$가 변 $AD$ 위의 점 $C'$에 오도록 접었을 때, $\overline{DC'}$의 길이는?
### 선지
① $4\text{ cm}$ ② $5\text{ cm}$ ③ $6\text{ cm}$ ④ $7\text{ cm}$ ⑤ $9\text{ cm}$
### 정답
③
### 해설
접기 전후 대응변의 길이가 같으므로 $\overline{BC'} = \overline{BC} = 15\text{ cm}$ 직각삼각형 $ABC'$에서 피타고라스 정리에 의해 $\overline{AC'}^2 + 12^2 = 15^2 \implies \overline{AC'} = 9\text{ cm}$ $\therefore \overline{DC'} = \overline{AD} - \overline{AC'} = 15 - 9 = 6\text{ (cm)}$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-07", "subUnitKey": "M2-07-PYTHAGOREAN_APPLICATION", "conceptClusterKey": "M2-07-RECT_FOLD_PYTHAGORAS", "primaryMethod": "접은 변 BC' = 15와 AB = 12로 직각삼각형 ABC'에 피타고라스 정리를 적용해 AC' = 9를 구하고 15 - 9 = 6을 계산한다.", "decisiveStep": "BC' = BC = 15를 빗변으로 하는 직각삼각형 ABC'에서 AC' = 9를 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "피타고라스 정리", "l3": "도형에의 활용", "l4": "평면도형 길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직사각형 접기 피타고라스 정리 선분 길이 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_GEOMETRIC_FOLDING", "CC_RECTANGLE_PROPERTIES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "종이접기 길이 보존 성질과 피타고라스 정리를 결합해 남은 변 길이를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직사각형"], "goal": ["길이"], "method": ["피타고라스정리"], "condition": []}, "hold": ""}

```

## Q11
- 형식: 객관식
- 배점: 4
### 발문
$\angle B = 90^\circ$인 직각삼각형 $ABC$에서 $\overline{AC} = 17\text{ cm}$, $\overline{AB} = 8\text{ cm}$, $\overline{BC} = x\text{ cm}$이다. 또 변 $BC$를 한 변으로 하고 $\angle BCD = 90^\circ$인 직각삼각형 $BCD$에서 $\overline{BD} = 25\text{ cm}$, $\overline{CD} = y\text{ cm}$일 때, $x + y$의 값은?
### 선지
① $27$ ② $29$ ③ $31$ ④ $33$ ⑤ $35$
### 정답
⑤
### 해설
$\triangle ABC$에서 $x^2 + 8^2 = 17^2 \implies x^2 = 289 - 64 = 225 \implies x = 15$ $\triangle BCD$에서 $y^2 + 15^2 = 25^2 \implies y^2 = 625 - 225 = 400 \implies y = 20$ $\therefore x + y = 15 + 20 = 35$ $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-07", "subUnitKey": "M2-07-PYTHAGOREAN_THEOREM", "conceptClusterKey": "M2-07-DOUBLE_PYTHAGORAS_SUM", "primaryMethod": "ΔABC에서 피타고라스 정리로 x = 15를 구한 뒤 ΔBCD에 다시 적용해 y = 20을 구하고 합산한다.", "decisiveStep": "첫째 직각삼각형에서 구한 x = 15를 둘째 직각삼각형의 한 변으로 넘기는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "피타고라스 정리", "l3": "피타고라스 정리", "l4": "직각삼각형의 변 길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "이어진 두 직각삼각형 피타고라스 정리 변 합산 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "공통 변을 공유하는 두 직각삼각형에 피타고라스 정리를 두 번 연속 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형"], "goal": ["합"], "method": ["피타고라스정리"], "condition": []}, "hold": ""}

```

## Q12
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 미지수가 $2$개인 일차방정식인 것은?
### 선지
① $3x - 2y + 5$ ② $2x + 5y = 9$ ③ $x^2 - 4$ ④ $x^2 + y = 7$ ⑤ $3(x - 1) = x + 5$
### 정답
②
### 해설
① 등호가 없는 다항식이다. ② $2x + 5y - 9 = 0$으로 미지수가 $2$개인 일차방정식이다. ③ 등호가 없고 $x$의 차수가 $2$이다. ④ $x$의 차수가 $2$이므로 이차방정식이다. ⑤ $2x - 8 = 0$으로 미지수가 $1$개뿐이다. $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-LINEAR_EQ_SELECT", "primaryMethod": "등호 유무, 미지수 개수(2개), 최고차항 차수(1차)를 확인해 ② 2x + 5y = 9를 고른다.", "decisiveStep": "다항식(①), 이차식(③, ④), 일차일원방정식(⑤)을 제외하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식 고르기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지수가 2개인 일차방정식의 정의를 다섯 식에 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["조건"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q13
- 형식: 객관식
- 배점: 3
### 발문
일차방정식 $5x + 2y = 29$를 만족시키는 자연수 $x$와 $y$의 순서쌍 $(x, y)$의 개수는?
### 선지
① $1$ ② $2$ ③ $3$ ④ $4$ ⑤ $5$
### 정답
③
### 해설
$x$, $y$가 자연수이므로 $x = 1, 2, 3, 4, 5$를 차례로 대입하면 $x = 1 \implies 2y = 24 \implies y = 12$ (O) $x = 2 \implies 2y = 19$ (자연수 아님) $x = 3 \implies 2y = 14 \implies y = 7$ (O) $x = 4 \implies 2y = 9$ (자연수 아님) $x = 5 \implies 2y = 4 \implies y = 2$ (O) 따라서 만족하는 순서쌍은 $(1, 12)$, $(3, 7)$, $(5, 2)$의 $3$개이다. $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-NATURAL_PAIR_COUNT", "primaryMethod": "계수가 큰 x에 1부터 5까지 자연수를 대입해 y가 자연수가 되는 순서쌍 3개를 찾는다.", "decisiveStep": "2y가 짝수이므로 x가 홀수(1, 3, 5)일 때만 자연수 y가 나옴을 확인하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "자연수 순서쌍 해 개수 세기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수 조건을 만족하는 x를 순차 대입해 해의 개수를 세는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식"], "goal": ["개수"], "method": ["대입"], "condition": ["자연수"]}, "hold": ""}

```

## Q14
- 형식: 객관식
- 배점: 4
### 발문
두 순서쌍 $(1, 3)$과 $\left(p, -\dfrac{1}{3}p\right)$가 모두 일차방정식 $ax + 3y = 12$의 해일 때, $a + p$의 값은? (단, $a$는 상수이다.)
### 선지
① $6$ ② $7$ ③ $8$ ④ $9$ ⑤ $12$
### 정답
④
### 해설
$(1, 3)$을 $ax + 3y = 12$에 대입하면 $a + 9 = 12 \implies a = 3$ $\left(p, -\dfrac{1}{3}p\right)$를 $3x + 3y = 12$에 대입하면 $3p + 3\left(-\dfrac{1}{3}p\right) = 12 \implies 3p - p = 12 \implies 2p = 12 \implies p = 6$ $\therefore a + p = 3 + 6 = 9$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-TWO_SOLS_PARAM_SUM", "primaryMethod": "해 (1, 3)을 대입해 a = 3을 먼저 구한 뒤 두 번째 해 (p, -p/3)을 대입해 p = 6을 구해 더한다.", "decisiveStep": "(1, 3)에서 a = 3을 확정하고 3p - p = 12에서 p = 6을 구하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 순서쌍 해를 대입해 계수와 좌표 합 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SUBSTITUTION_IN_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫 번째 해로 계수 a를 결정한 뒤 두 번째 문자 해를 대입해 p를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식", "순서쌍"], "goal": ["합"], "method": ["대입"], "condition": []}, "hold": ""}

```

## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음 연립방정식 중에서 해가 $x = 2$, $y = -1$인 것은?
### 선지
① $\begin{cases} 3x + 2y = 4 \ x - 3y = 5 \end{cases}$ ② $\begin{cases} x + y = 3 \ x - y = 1 \end{cases}$ ③ $\begin{cases} 2x - y = 3 \ 3x + y = 7 \end{cases}$ ④ $\begin{cases} x + 2y = 4 \ 2x - y = 3 \end{cases}$ ⑤ $\begin{cases} 3x - y = 5 \ x + y = 0 \end{cases}$
### 정답
①
### 해설
$x = 2$, $y = -1$을 ①에 대입하면 $3(2) + 2(-1) = 6 - 2 = 4$, $2 - 3(-1) = 2 + 3 = 5$로 두 식이 모두 성립한다. $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-CHECK_SYSTEM_SOL", "primaryMethod": "x = 2, y = -1을 각 연립방정식의 두 식에 모두 대입해 등식이 모두 성립하는 ①을 고른다.", "decisiveStep": "①의 두 식 3(2)+2(-1)=4, 2-3(-1)=5가 모두 참임을 확인하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 해를 갖는 연립방정식 고르기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SUBSTITUTION_IN_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 해 (2, -1)을 각 선지의 두 방정식에 대입해 성립 여부를 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식", "순서쌍"], "goal": ["판정"], "method": ["대입"], "condition": []}, "hold": ""}

```

## Q16
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 2(x + 3) = 9 - (y - x) \ 4x - 3 = 2x - 3y + 4 \end{cases}$을 풀면?
### 선지
① $x = -2,\ y = 1$ ② $x = 1,\ y = 2$ ③ $x = 2,\ y = -1$ ④ $x = -1,\ y = 2$ ⑤ $x = 2,\ y = 1$
### 정답
⑤
### 해설
첫째 식을 정리하면 $2x + 6 = 9 - y + x \implies x + y = 3$ 둘째 식을 정리하면 $4x - 3 = 2x - 3y + 4 \implies 2x + 3y = 7$ 첫째 식 $\times 2$: $2x + 2y = 6$ $(2x + 3y) - (2x + 2y) = 7 - 6 \implies y = 1$ $x + 1 = 3 \implies x = 2$ $\therefore x = 2,\ y = 1$ $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-BRACKET_SYSTEM_SOL", "primaryMethod": "괄호와 동류항을 정리해 x + y = 3, 2x + 3y = 7로 만든 뒤 가감법으로 해 (2, 1)을 구한다.", "decisiveStep": "괄호를 풀어 표준형 x + y = 3, 2x + 3y = 7을 세운 뒤 2배하여 빼는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "괄호가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "괄호가 있는 연립일차방정식 풀이 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "괄호를 전개하고 이항하여 표준형으로 정리한 뒤 가감법으로 푸는 2단계 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["가감법"], "condition": []}, "hold": ""}

```

## Q17
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} x + 3y = 7 \ 4x - ay = 10 \end{cases}$의 해가 일차방정식 $2x - y = 0$을 만족시킬 때, 상수 $a$의 값은?
### 선지
① $-4$ ② $-3$ ③ $-2$ ④ $2$ ⑤ $3$
### 정답
②
### 해설
$2x - y = 0$에서 $y = 2x$를 $x + 3y = 7$에 대입하면 $x + 6x = 7 \implies 7x = 7 \implies x = 1$, $y = 2$ 해 $(1, 2)$를 $4x - ay = 10$에 대입하면 $4(1) - 2a = 10 \implies -2a = 6 \implies a = -3$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-COMMON_SOL_THREE_EQ", "primaryMethod": "a가 없는 두 식 x + 3y = 7과 2x - y = 0을 연립해 해 (1, 2)를 구한 뒤 4x - ay = 10에 대입한다.", "decisiveStep": "미정계수 a가 없는 두 식을 먼저 연립해 (1, 2)를 구하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "세 일차방정식 공통해로 계수 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_COMMON_SOLUTION", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "계수가 주어진 두 식을 연립해 해를 구하고 나머지 식에 대입해 상수를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식", "일차방정식"], "goal": ["상수"], "method": ["대입법", "대입"], "condition": []}, "hold": ""}

```

## Q18
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 0.3x + 0.1y = 1.2 \ \dfrac{1}{3}x - \dfrac{1}{6}y = \dfrac{1}{2} \end{cases}$의 해가 $(a, b)$일 때, $a + b$의 값은?
### 선지
① $4$ ② $5$ ③ $6$ ④ $7$ ⑤ $8$
### 정답
③
### 해설
첫째 식 $\times 10$: $3x + y = 12$ 둘째 식 $\times 6$: $2x - y = 3$ 두 식을 더하면 $5x = 15 \implies x = 3$ $3(3) + y = 12 \implies y = 3$ 따라서 $(a, b) = (3, 3)$이므로 $a + b = 3 + 3 = 6$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-DECIMAL_FRAC_SYSTEM", "primaryMethod": "첫째 식에 10, 둘째 식에 6을 곱해 3x + y = 12, 2x - y = 3으로 만든 뒤 더해 해 (3, 3)을 구한다.", "decisiveStep": "소수 식에 10, 분수 식에 최소공배수 6을 곱해 정수 계수 식으로 바꾸는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "소수·분수 계수 연립방정식 해의 합 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_DECIMAL_COEFFICIENTS", "CC_FRACTION_COEFFICIENTS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "소수와 분수 계수를 정수로 환산한 뒤 가감법으로 해를 구해 합산하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["합"], "method": ["가감법"], "condition": []}, "hold": ""}

```

## Q19
- 형식: 객관식
- 배점: 4
### 발문
민호와 준서가 가위바위보를 하여 이긴 사람은 $2$계단 올라가고, 진 사람은 $1$계단 내려가기로 하였다. 그 결과 처음의 위치보다 민호는 $7$계단 올라가 있고 준서는 $2$계단 내려가 있었다. 두 사람이 가위바위보를 한 전체 횟수는? (단, 비긴 경우는 없었다.)
### 선지
① $5$ ② $3$ ③ $4$ ④ $6$ ⑤ $7$
### 정답
①
### 해설
민호가 이긴 횟수를 $w$, 진 횟수를 $l$이라 하면 준서는 $l$번 이기고 $w$번 졌으므로 $\begin{cases} 2w - l = 7 \ 2l - w = -2 \end{cases}$ 둘째 식에서 $w = 2l + 2$를 첫째 식에 대입하면 $2(2l + 2) - l = 7 \implies 3l + 4 = 7 \implies 3l = 3 \implies l = 1$ $w = 2(1) + 2 = 4$ $\therefore (\text{전체 횟수}) = w + l = 4 + 1 = 5$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-STAIR_RPS_WORD", "primaryMethod": "민호의 승·패 횟수 w, l이 준서의 패·승 횟수와 같음을 이용해 2w - l = 7, 2l - w = -2를 연립해 푼다.", "decisiveStep": "비김이 없으므로 한 사람의 승리 횟수가 상대방의 패배 횟수와 같음을 식으로 세우는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "두 수 관계"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "가위바위보 계단 오르내리기 연립방정식 활용 키가 선택표에 없음"}, "crossConceptKeys": ["CC_INVERSE_WIN_LOSS_RELATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "가위바위보의 승패 반전 관계를 미지수 두 개로 식을 세워 전체 경기 수를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["조건"], "goal": ["합"], "method": ["대입법"], "condition": []}, "hold": ""}

```

## Q20
- 형식: 객관식
- 배점: 5
### 발문
연립방정식 $\begin{cases} ax - by = 5 \ bx + ay = 5 \end{cases}$를 푸는데 잘못하여 $a$, $b$를 서로 바꾸어 놓고 풀었더니 $x = 1$, $y = -2$를 얻었다. 처음 연립방정식의 해는? (단, $a$와 $b$는 상수이다.)
### 선지
① $x = 0,\ y = 2$ ② $x = 1,\ y = -2$ ③ $x = -1,\ y = 2$ ④ $x = 1,\ y = 2$ ⑤ $x = -1,\ y = -2$
### 정답
④
### 해설
$a$, $b$를 바꾸어 놓은 식 $\begin{cases} bx - ay = 5 \ ax + by = 5 \end{cases}$에 $x = 1$, $y = -2$를 대입하면 $\begin{cases} b + 2a = 5 \ a - 2b = 5 \end{cases}$ 첫째 식 $\times 2$: $4a + 2b = 10$, 둘째 식과 더하면 $5a = 15 \implies a = 3$, $b = -1$ 처음 연립방정식은 $\begin{cases} 3x + y = 5 \ -x + 3y = 5 \end{cases}$이다. 첫째 식에서 $y = 5 - 3x$를 둘째 식에 대입하면 $-x + 3(5 - 3x) = 5 \implies -10x = -10 \implies x = 1$, $y = 2$ $\therefore x = 1,\ y = 2$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SWAPPED_COEFF_SYSTEM", "primaryMethod": "a, b를 바꾼 식에 (1, -2)를 대입해 a = 3, b = -1을 복원한 뒤 원래 연립방정식을 다시 풀어 (1, 2)를 구한다.", "decisiveStep": "바꾼 식에서 얻은 연립방정식으로 a = 3, b = -1을 먼저 구하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "계수 a, b를 바꾸어 푼 연립방정식 바른 해 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_COEFFICIENT_SWAP", "CC_ERROR_CORRECTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "잘못 푼 식에서 계수 a, b에 대한 연립방정식을 풀어 계수를 복원한 뒤 원래 식을 다시 푸는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["연립방정식", "순서쌍"], "goal": ["해"], "method": ["가감법", "대입"], "condition": []}, "hold": ""}

```

## Q21
- 형식: 객관식
- 배점: 4
### 발문
다음 <보기>의 함수 중 $f(2) = 5$를 만족시키는 것은? 〈보기〉 ㄱ. $f(x) = -2x + 1$  ㄴ. $f(x) = \dfrac{x + 8}{2}$ ㄷ. $f(x) = 3x - 1$  ㄹ. $f(x) = \dfrac{10}{x}$
### 선지
① ㄱ, ㄴ ② ㄴ, ㄷ ③ ㄴ, ㄹ ④ ㄷ, ㄹ ⑤ ㄴ, ㄷ, ㄹ
### 정답
⑤
### 해설
ㄱ. $f(2) = -2(2) + 1 = -3 \ne 5$ ㄴ. $f(2) = \dfrac{2 + 8}{2} = 5$ (O) ㄷ. $f(2) = 3(2) - 1 = 5$ (O) ㄹ. $f(2) = \dfrac{10}{2} = 5$ (O) $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNC_VALUE_CHECK", "primaryMethod": "네 함수식에 x = 2를 각각 대입해 함숫값이 5가 되는 ㄴ, ㄷ, ㄹ을 고른다.", "decisiveStep": "각 식에 x = 2를 대입해 계산 결과 5와 일치하는지 확인하는 단계", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "일차방정식의 그래프"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 함숫값을 만족시키는 함수식 고르기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 x = 2를 각 함수식에 바로 대입해 함숫값이 5인지 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["함수식"], "goal": ["판정"], "method": ["대입"], "condition": []}, "hold": ""}

```

## Q22
- 형식: 서답형
- 배점: 5
### 발문
직사각형 $ABCD$에서 대각선 $\overline{BD}$의 중점을 $O$라 하고, 점 $O$에서 $\overline{BD}$에 수직인 직선과 변 $AD$, 변 $BC$의 교점을 각각 $E$, $F$라고 하자. $\overline{BO} = 10\text{ cm}$, $\overline{BC} = 16\text{ cm}$, $\overline{DC} = 12\text{ cm}$일 때, 다음 물음에 답하시오. (1) $\overline{EO}$의 길이를 구하기 위한 닮음인 두 삼각형을 찾고 닮음 조건을 쓰시오. (2) (1)에서 찾은 두 닮은 삼각형의 닮음비를 쓰시오. (3) $\overline{EO}$의 길이를 구하시오.
### 선지
없음
### 정답
(1) $\triangle DOE \sim \triangle BCD$ ($\text{AA}$ 닮음), (2) $5 : 8$, (3) $\dfrac{15}{2}\text{ cm}$
### 해설
(1) $\triangle DOE$와 $\triangle BCD$에서 $\angle DOE = \angle BCD = 90^\circ$이고, $\overline{AD} \parallel \overline{BC}$이므로 엇각으로 $\angle ODE = \angle CBD$이다. 따라서 $\triangle DOE \sim \triangle BCD$ ($\text{AA}$ 닮음)이다. (2) $O$는 $\overline{BD}$의 중점이므로 $\overline{DO} = \overline{BO} = 10\text{ cm}$ 대응변 $\overline{DO} : \overline{BC} = 10 : 16 = 5 : 8$ (3) $\overline{EO} : \overline{DC} = 5 : 8 \implies \overline{EO} : 12 = 5 : 8 \implies \overline{EO} = 12 \times \dfrac{5}{8} = \dfrac{15}{2}\text{ (cm)}$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_SIMILARITY", "conceptClusterKey": "M2-06-RECT_DIAG_PERP_AA", "primaryMethod": "ΔDOE ~ ΔBCD(AA 닮음)를 찾고 닮음비 DO:BC = 10:16 = 5:8을 이용해 EO = 12×5/8를 구한다.", "decisiveStep": "엇각 ∠ODE = ∠CBD와 직각 일치로 ΔDOE ~ ΔBCD(AA 닮음)를 짝짓는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "삼각형의 닮음", "l4": "AA"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직사각형 대각선 수직이등분선 AA 닮음 선분 길이 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_SIMILARITY_AA", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직사각형에서 대각선 수직선으로 생긴 두 삼각형의 AA 닮음을 찾고 닮음비로 선분 길이를 구하는 3단계 문항이다.", "level": "중", "item4slot": {"given": ["직사각형", "대각선", "중점"], "goal": ["닮음", "길이"], "method": ["비례식", "엇각"], "condition": []}, "hold": ""}

```

## Q23
- 형식: 서답형
- 배점: 5
### 발문
사다리꼴 $ABCD$에서 $\overline{AD} \parallel \overline{EF} \parallel \overline{BC}$이고 점 $E$는 변 $AB$ 위에, 점 $F$는 변 $DC$ 위에 있다. 선분 $EF$가 대각선 $BD$, 대각선 $AC$와 만나는 점을 각각 $P$, $Q$라 하자. $\overline{AE} = 6\text{ cm}$, $\overline{EB} = 3\text{ cm}$, $\overline{AD} = 9\text{ cm}$, $\overline{BC} = 18\text{ cm}$일 때, $\overline{PQ}$의 길이를 구하시오.
### 선지
없음
### 정답
$9\text{ cm}$
### 해설
$\triangle ABD$에서 $\overline{EP} \parallel \overline{AD}$이고 $\overline{BE} : \overline{BA} = 3 : (6 + 3) = 1 : 3$이므로 $\overline{EP} : \overline{AD} = 1 : 3 \implies \overline{EP} = 9 \times \dfrac{1}{3} = 3\text{ cm}$ $\triangle ABC$에서 $\overline{EQ} \parallel \overline{BC}$이고 $\overline{AE} : \overline{AB} = 6 : 9 = 2 : 3$이므로 $\overline{EQ} : \overline{BC} = 2 : 3 \implies \overline{EQ} = 18 \times \dfrac{2}{3} = 12\text{ cm}$ $\therefore \overline{PQ} = \overline{EQ} - \overline{EP} = 12 - 3 = 9\text{ (cm)}$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-PARALLEL_SEGMENT_RATIO", "conceptClusterKey": "M2-06-TRAPEZOID_DIAG_PQ", "primaryMethod": "ΔABD에서 BE:BA = 1:3으로 EP = 3을, ΔABC에서 AE:AB = 2:3으로 EQ = 12를 구해 차 EQ - EP = 9를 계산한다.", "decisiveStep": "PQ = EQ - EP로 분해하여 두 닮은 삼각형에서 각각의 길이를 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "평행선과 선분의 길이의 비", "l3": "평행선 사이 선분비", "l4": "사다리꼴"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "사다리꼴 평행선 두 대각선 사이 선분 PQ 길이 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRAPEZOID", "CC_PARALLEL_LINES_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "사다리꼴의 두 대각선으로 나뉜 두 삼각형에 평행선 길이 비를 각각 적용해 차를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["사각형", "평행", "대각선"], "goal": ["길이"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q24
- 형식: 서답형
- 배점: 5
### 발문
민지네 반은 학교 축제를 위해 기념품을 구입하려고 한다. 손거울 $15$개와 열쇠고리 $5$개의 가격은 $33000$원이고, 손거울 $12$개와 열쇠고리 $8$개의 가격은 $31200$원이다. (1) 손거울 $1$개와 열쇠고리 $1$개의 가격을 각각 $x$원, $y$원으로 놓고 문제의 뜻에 맞는 연립방정식을 세우시오. (2) (1)에서 세운 연립방정식을 풀고, 손거울 $1$개와 열쇠고리 $1$개의 가격을 각각 구하시오.
### 선지
없음
### 정답
(1) $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$, (2) 손거울 $1800$원, 열쇠고리 $1200$원
### 해설
(1) $\begin{cases} 15x + 5y = 33000 \ 12x + 8y = 31200 \end{cases}$ (2) 첫째 식을 $5$로 나누면 $3x + y = 6600$, 둘째 식을 $4$로 나누면 $3x + 2y = 7800$ $(3x + 2y) - (3x + y) = 7800 - 6600 \implies y = 1200$ $3x + 1200 = 6600 \implies 3x = 5400 \implies x = 1800$ 따라서 손거울 $1$개는 $1800$원, 열쇠고리 $1$개는 $1200$원이다.



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-WORD_UNIT_PRICE", "primaryMethod": "두 구매 조건으로 연립방정식을 세운 뒤 각각 5와 4로 약분해 3x + y = 6600, 3x + 2y = 7800을 가감법으로 푼다.", "decisiveStep": "두 식을 각각 5와 4로 약분하여 x의 계수 3을 바로 맞추는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "개수·가격"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 물건 묶음 가격으로 단가 구하기 연립방정식 키가 선택표에 없음"}, "crossConceptKeys": ["CC_UNIT_PRICE", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 물품의 개수와 총액 조건으로 연립방정식을 세우고 약분 후 가감법으로 푸는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["개수"], "goal": ["값"], "method": ["가감법"], "condition": []}, "hold": ""}

```

## Q25
- 형식: 서답형
- 배점: 5
### 발문
다음 네 일차방정식이 한 쌍의 공통인 해를 가질 때, 두 수 $a$, $b$에 대하여 물음에 답하시오. $$2x - 3y = 17, \qquad x - ay = 13, \qquad bx - y = 19, \qquad -3x + 2y = -18$$ (1) 공통인 해를 구하시오. (2) 두 수 $a$, $b$에 대하여 $ab$의 값을 구하시오.
### 선지
없음
### 정답
(1) $(4, -3)$, (2) $12$
### 해설
(1) $a$, $b$가 없는 두 식 $\begin{cases} 2x - 3y = 17 \ -3x + 2y = -18 \end{cases}$을 연립하면 첫째 식 $\times 2$: $4x - 6y = 34$, 둘째 식 $\times 3$: $-9x + 6y = -54$ 두 식을 더하면 $-5x = -20 \implies x = 4$ $2(4) - 3y = 17 \implies -3y = 9 \implies y = -3$ 따라서 공통인 해는 $(4, -3)$이다. (2) $(4, -3)$을 $x - ay = 13$에 대입하면 $4 + 3a = 13 \implies 3a = 9 \implies a = 3$ $(4, -3)$을 $bx - y = 19$에 대입하면 $4b + 3 = 19 \implies 4b = 16 \implies b = 4$ $\therefore ab = 3 \times 4 = 12$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "25", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-FOUR_EQ_COMMON_SOL", "primaryMethod": "상수 계수인 첫째·넷째 식을 연립해 공통해 (4, -3)을 구한 뒤 둘째·셋째 식에 대입해 a = 3, b = 4를 구한다.", "decisiveStep": "미정계수가 없는 두 식을 먼저 골라 가감법으로 공통해 (4, -3)을 구하는 단계", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "네 일차방정식 공통해로 두 미정계수 곱 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_COMMON_SOLUTION", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미정계수가 없는 두 식을 연립해 공통해를 구한 뒤 나머지 두 식에 대입해 계수를 결정하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식"], "goal": ["해", "값"], "method": ["가감법", "대입"], "condition": []}, "hold": ""}

```
