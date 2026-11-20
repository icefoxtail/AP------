```json:exam
{"stem": "24_왕운중_2학기_중간_중2_유사", "sourceArchiveFile": "original/middle/m2/2mid/24_왕운중_2학기_중간_중2_수학.js", "examFolder": "2mid", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-17"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는? [3점]
### 선지
① $56^\circ$ ② $62^\circ$ ③ $64^\circ$ ④ $68^\circ$ ⑤ $72^\circ$
### 정답
②
### 해설
$\overline{AB}=\overline{AC}$이므로 $\angle B=\angle C$이다. $\angle B+\angle C=180^\circ-56^\circ=124^\circ$ $\therefore \angle C=124^\circ\div 2=62^\circ$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_BASE_ANGLE", "primaryMethod": "이등변삼각형의 두 밑각이 같음을 이용해 180도에서 꼭짓각 56도를 뺀 뒤 2로 나누어 각 C를 구한다.", "decisiveStep": "(180도 - 56도) / 2 = 62도를 계산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "이등변삼각형의 꼭짓각으로 밑각 계산"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형의 두 밑각의 크기가 같다는 성질을 바로 적용해 각을 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["이등변삼각형", "각"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}

```

## Q02
- 형식: 객관식
- 배점: 3
### 발문
점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle OBC=22^\circ$, $\angle OCA=44^\circ$일 때, $\angle BAO$의 크기는? [3점]
### 선지
① $18^\circ$ ② $20^\circ$ ③ $22^\circ$ ④ $24^\circ$ ⑤ $26^\circ$
### 정답
④
### 해설
외심 $O$에서 세 꼭짓점까지의 거리는 같으므로 $\overline{OA}=\overline{OB}=\overline{OC}$이다. $\angle OCB=\angle OBC=22^\circ$, $\angle OAC=\angle OCA=44^\circ$이고 $\angle BAO=\angle ABO=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(x+44^\circ)+(x+22^\circ)+(22^\circ+44^\circ)=180^\circ$ $2x+132^\circ=180^\circ \implies 2x=48^\circ \implies x=24^\circ$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_THREE_ANGLES", "primaryMethod": "외심의 세 반지름이 같아 생기는 세 이등변삼각형의 밑각을 모아 내각의 합 180도 방정식으로 각 BAO를 구한다.", "decisiveStep": "2(x + 22 + 44) = 180 방정식에서 x = 24도를 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "외심의 위치·각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심의 세 이등변삼각형 밑각 합 성질 적용"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심에서 세 꼭짓점까지의 거리 같음으로 세 이등변삼각형을 찾아 내각의 합을 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q03
- 형식: 객관식
- 배점: 3
### 발문
점 $I$는 $\triangle ABC$의 내심이다. $\angle ABI=29^\circ$, $\angle ICB=38^\circ$일 때, $\angle IBC$의 크기는? [3점]
### 선지
① $29^\circ$ ② $31^\circ$ ③ $33^\circ$ ④ $38^\circ$ ⑤ $67^\circ$
### 정답
①
### 해설
내심 $I$는 삼각형의 세 내각의 이등분선의 교점이므로 $BI$는 $\angle B$를 이등분한다. $\therefore \angle IBC=\angle ABI=29^\circ$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_ANGLE_BISECTOR", "primaryMethod": "내심이 세 내각의 이등분선의 교점이라는 정의를 적용해 각 IBC = 각 ABI = 29도를 바로 구한다.", "decisiveStep": "각 IBC = 각 ABI임을 파악하고 불필요한 조건 각 ICB = 38도를 거르는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심의 각 이등분선 정의 직접 적용"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내심의 정의만으로 답을 바로 구하는 1단계 기본 문항이다.", "level": "하", "item4slot": {"given": ["삼각형", "내심"], "goal": ["각"], "method": ["각이등분선"], "condition": []}, "hold": ""}

```

## Q04
- 형식: 객관식
- 배점: 3
### 발문
평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자. $\overline{AC}=14$, $\overline{BO}=9$, $\overline{OC}=x$, $\overline{OD}=y$일 때, $x+y$의 값은? [3점]
### 선지
① $12$ ② $14$ ③ $16$ ④ $18$ ⑤ $23$
### 정답
③
### 해설
평행사변형의 두 대각선은 서로를 이등분하므로 $x=\overline{OC}=\dfrac{1}{2}\overline{AC}=\dfrac{1}{2}\times 14=7$ $y=\overline{OD}=\overline{BO}=9$ $\therefore x+y=7+9=16$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_DIAGONAL_SUM", "primaryMethod": "평행사변형의 두 대각선이 서로를 이등분함을 이용해 x = 14/2 = 7, y = 9를 구해 합산한다.", "decisiveStep": "OC = AC/2 = 7, OD = BO = 9를 각각 구해 더하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "평행사변형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 대각선 이등분 성질 적용"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_DIAGONALS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형 대각선의 중점 성질을 바로 적용해 두 길이를 구하고 더하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["합"], "method": ["중점"], "condition": []}, "hold": ""}

```

## Q05
- 형식: 객관식
- 배점: 3
### 발문
크기에 관계없이 언제나 서로 닮은 도형의 쌍은? [3점]
### 선지
① 두 이등변삼각형 ② 두 직사각형 ③ 두 마름모 ④ 두 사다리꼴 ⑤ 두 정사면체
### 정답
⑤
### 해설
① 두 이등변삼각형은 꼭짓각의 크기가 다를 수 있다. ② 두 직사각형은 가로와 세로의 비가 다를 수 있다. ③ 두 마름모는 한 내각의 크기가 다를 수 있다. ④ 두 사다리꼴은 각의 크기와 변의 비가 다를 수 있다. ⑤ 두 정사면체는 모든 면이 정삼각형인 정다면체이므로 언제나 서로 닮은 도형이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "5", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-ALWAYS_SIMILAR_SOLID", "primaryMethod": "다섯 도형 쌍 중 크기와 상관없이 모양이 하나로 결정되는 정사면체를 찾는다.", "decisiveStep": "모서리 길이만으로 모양이 유일하게 결정되는 정다면체(정사면체)를 선별하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "대응변·대응각"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_RATIO", "why": "항상 닮은 도형 판별"}, "crossConceptKeys": ["CC_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항상 닮은 도형의 정의에 따라 정다면체를 바로 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["도형"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q06
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하자. $\angle AEB=61^\circ$일 때, $\angle C$의 크기는? [4점]
### 선지
① $118^\circ$ ② $122^\circ$ ③ $124^\circ$ ④ $128^\circ$ ⑤ $132^\circ$
### 정답
②
### 해설
$\overline{AD}\parallel\overline{BC}$이므로 $\angle DAE=\angle AEB=61^\circ$ (엇각)이다. $\overline{AE}$가 $\angle A$의 이등분선이므로 $\angle A=2\angle DAE=2\times 61^\circ=122^\circ$이다. 평행사변형에서 대각의 크기는 같으므로 $\angle C=\angle A=122^\circ$이다. $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_BISECTOR_OPPOSITE_ANGLE", "primaryMethod": "평행선 엇각으로 각 DAE = 61도를 구하고 2배하여 각 A = 각 C = 122도를 계산한다.", "decisiveStep": "엇각 각 DAE = 61도에서 각 A = 122도를 얻고 대각 같음으로 각 C를 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 엇각과 각 이등분선 성질 적용"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_ALTERNATE_INTERIOR_ANGLES", "CC_ANGLE_BISECTOR_PARALLEL"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "엇각, 각 이등분, 평행사변형 대각 같음 성질을 순차 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "각이등분선"], "goal": ["각"], "method": ["엇각"], "condition": []}, "hold": ""}

```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $35^\circ$인 직각삼각형과 합동인 도형은? [4점]
### 선지
① 직각을 낀 한 변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형 ② 빗변의 길이가 $8\text{ cm}$이고 다른 한 변의 길이가 $5\text{ cm}$인 직각삼각형 ③ 빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형 ④ 세 내각의 크기가 $35^\circ$, $55^\circ$, $90^\circ$인 직각삼각형 ⑤ 직각을 낀 두 변의 길이가 각각 $5\text{ cm}$, $8\text{ cm}$인 직각삼각형
### 정답
③
### 해설
주어진 직각삼각형의 나머지 한 예각의 크기는 $90^\circ-35^\circ=55^\circ$이다. 따라서 빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형은 빗변의 길이와 한 예각의 크기가 각각 같으므로 RHA 합동이다. $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RIGHT_TRIANGLE_RHA_CHOICE", "primaryMethod": "주어진 직각삼각형의 다른 예각 90도 - 35도 = 55도를 구해 빗변 8cm와 함께 RHA 합동인 조건을 찾는다.", "decisiveStep": "나머지 예각 55도를 구해 빗변 8cm, 예각 55도 조건을 RHA 합동으로 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE", "why": "직각삼각형 RHA 합동 조건 판별"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직접 주어진 예각이 아닌 나머지 예각 55도로 환산해 RHA 합동인 선지를 찾는 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q08
- 형식: 객관식
- 배점: 4
### 발문
서로 닮은 두 원뿔 $A$, $B$의 밑면의 반지름의 길이의 비가 $3:5$일 때, 두 원뿔 $A$, $B$의 부피의 비는? [4점]
### 선지
① $3 : 5$ ② $6 : 10$ ③ $9 : 25$ ④ $27 : 125$ ⑤ $9 : 125$
### 정답
④
### 해설
서로 닮은 두 입체도형의 닮음비가 $3:5$이므로 부피의 비는 $3^3:5^3=27:125$이다. $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-CONE_VOLUME_RATIO", "primaryMethod": "닮은 두 입체도형의 부피의 비가 닮음비의 세제곱임을 적용해 3^3 : 5^3을 구한다.", "decisiveStep": "닮음비 3:5를 세제곱해 27:125를 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮음의 활용", "l4": "넓이·부피 비"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_AREA_VOLUME", "why": "닮은 입체도형의 부피 비 계산"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_AREA_VOLUME", "CC_VOLUME_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "닮은 입체도형의 부피 비 공식을 바로 적용하는 1단계 문항이다.", "level": "중", "item4slot": {"given": ["원뿔", "비율"], "goal": ["비율"], "method": ["닮음"], "condition": []}, "hold": ""}

```

## Q09
- 형식: 객관식
- 배점: 4
### 발문
정십각형 $ABCDEFGHIJ$에서 두 대각선 $AC$와 $BJ$의 교점을 $P$라 할 때, $\angle CPJ$의 크기는? [4점]
### 선지
① $144^\circ$ ② $136^\circ$ ③ $135^\circ$ ④ $126^\circ$ ⑤ $108^\circ$
### 정답
①
### 해설
정십각형의 한 내각의 크기는 $\dfrac{180^\circ\times(10-2)}{10}=144^\circ$이다. $\triangle ABC$에서 $\overline{AB}=\overline{BC}$이므로 $\angle BAC=\dfrac{180^\circ-144^\circ}{2}=18^\circ$이다. 같은 방법으로 $\triangle ABJ$에서 $\overline{AB}=\overline{AJ}$이므로 $\angle ABJ=18^\circ$이다. 따라서 $\triangle ABP$에서 $\angle APB=180^\circ-(18^\circ+18^\circ)=144^\circ$이고, 맞꼭지각에 의해 $\angle CPJ=\angle APB=144^\circ$이다. $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-REGULAR_DECAGON_DIAGONAL_ANGLE", "primaryMethod": "정십각형의 한 내각 144도를 구하고 두 이등변삼각형 ABC, ABJ의 밑각 18도를 이용해 교각을 구한다.", "decisiveStep": "각 BAP = 각 ABP = 18도로부터 각 APB = 144도를 구해 맞꼭지각으로 옮기는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "정다각형 내 이등변삼각형 밑각 성질 활용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_ANGLE_RELATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정십각형의 한 내각 공식과 두 개의 이등변삼각형 밑각, 맞꼭지각을 결합해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["정다각형", "대각선"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
직사각형 $ABCD$에서 $\angle ACB=34^\circ$일 때, $\angle BDC$의 크기는? [4점]
### 선지
① $34^\circ$ ② $46^\circ$ ③ $52^\circ$ ④ $54^\circ$ ⑤ $56^\circ$
### 정답
⑤
### 해설
직사각형 $ABCD$에서 $\overline{AB}=\overline{DC}$, $\overline{BC}$는 공통, $\angle ABC=\angle DCB=90^\circ$이므로 $\triangle ABC \equiv \triangle DCB$ (SAS 합동)이다. 따라서 $\angle DBC=\angle ACB=34^\circ$이다. $\triangle DBC$에서 $\angle BCD=90^\circ$이므로 $\angle BDC=180^\circ-90^\circ-34^\circ=56^\circ$이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RECTANGLE_DIAGONAL_ANGLE", "primaryMethod": "직사각형에서 삼각형 ABC와 DCB의 합동으로 각 DBC = 34도를 얻고 직각삼각형 내각의 합으로 각 BDC를 구한다.", "decisiveStep": "각 DBC = 34도를 구해 90도 - 34도 = 56도를 계산하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "직사각형의 대각선과 합동 성질 적용"}, "crossConceptKeys": ["CC_RECTANGLE_PROPERTIES", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "직사각형의 두 직각삼각형 합동과 내각의 합을 차례로 적용해 각을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["직사각형", "대각선"], "goal": ["각"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q11
- 형식: 객관식
- 배점: 4
### 발문
마름모 $ABCD$의 두 대각선의 길이가 $\overline{AC}=10\text{ cm}$, $\overline{BD}=14\text{ cm}$일 때, 마름모 $ABCD$의 넓이는? [4점]
### 선지
① $56\text{ cm}^2$ ② $60\text{ cm}^2$ ③ $70\text{ cm}^2$ ④ $84\text{ cm}^2$ ⑤ $140\text{ cm}^2$
### 정답
③
### 해설
마름모의 넓이는 두 대각선의 길이의 곱의 $\dfrac{1}{2}$이므로 $\dfrac{1}{2}\times 10\times 14=70\text{ cm}^2$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RHOMBUS_AREA_FORMULA", "primaryMethod": "마름모의 넓이 공식 (1/2) * AC * BD에 대각선 길이 10과 14를 대입한다.", "decisiveStep": "(1/2) * 10 * 14 = 70을 계산하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "각 사각형의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "마름모 넓이 공식 직접 적용"}, "crossConceptKeys": ["CC_RHOMBUS_PROPERTIES", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "마름모의 두 대각선 길이로부터 넓이 공식을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["마름모", "대각선"], "goal": ["넓이"], "method": ["넓이"], "condition": []}, "hold": ""}

```

## Q12
- 형식: 객관식
- 배점: 4
### 발문
점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $F$, $D$라 하자. $\overline{AC}=11\text{ cm}$, $\overline{AF}=4\text{ cm}$, $\overline{DC}=6\text{ cm}$일 때, $\triangle ABC$의 둘레의 길이는? [4점]
### 선지
① $28\text{ cm}$ ② $31\text{ cm}$ ③ $33\text{ cm}$ ④ $35\text{ cm}$ ⑤ $38\text{ cm}$
### 정답
②
### 해설
외심에서 각 변에 내린 수선은 그 변을 이등분하므로 $\overline{AB}=2\overline{AF}=2\times 4=8\text{ cm}$, $\overline{BC}=2\overline{DC}=2\times 6=12\text{ cm}$이다. $\therefore (\triangle ABC\text{의 둘레})=8+12+11=31\text{ cm}$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_PERIMETER", "primaryMethod": "외심이 세 변의 수직이등분선의 교점임을 이용해 AB = 8, BC = 12를 구하고 AC = 11과 더해 둘레를 구한다.", "decisiveStep": "AF = 4와 DC = 6을 각각 2배하여 삼각형 세 변의 합을 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "수직이등분선과 외심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심의 수직이등분선 성질로 삼각형 둘레 계산"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "외심에서 변에 내린 수선이 변을 이등분한다는 성질을 바로 적용해 둘레를 구하는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심", "수선"], "goal": ["길이"], "method": ["수직이등분선"], "condition": []}, "hold": ""}

```

## Q13
- 형식: 객관식
- 배점: 4
### 발문
사각형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 다음 조건 중 $\square ABCD$가 평행사변형이 되지 않는 것은? [4점]
### 선지
① $\angle A=\angle B$, $\angle C=\angle D$ ② $\triangle ABC \equiv \triangle CDA$ ③ $\overline{OA}=\overline{OC}$, $\overline{OB}=\overline{OD}$ ④ $\angle A=\angle C$, $\overline{AB}\parallel\overline{DC}$ ⑤ $\overline{AB}=\overline{DC}$, $\angle BAC=\angle DCA$
### 정답
①
### 해설
① 이웃한 두 각씩 크기가 같은 조건만으로는 등변사다리꼴이 될 수 있으므로 평행사변형이라 할 수 없다. ② 합동에 의해 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{DA}$이므로 평행사변형이다. ③ 두 대각선이 서로를 이등분하므로 평행사변형이다. ④ $\overline{AB}\parallel\overline{DC}$이면 $\angle A+\angle D=180^\circ$이고 $\angle A=\angle C$이므로 $\angle C+\angle D=180^\circ$가 되어 $\overline{AD}\parallel\overline{BC}$이므로 평행사변형이다. ⑤ 엇각이 같으므로 $\overline{AB}\parallel\overline{DC}$이고 $\overline{AB}=\overline{DC}$이므로 평행사변형이다. $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "13", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_CRITERIA_COUNTER", "primaryMethod": "다섯 조건을 평행사변형 판정 조건으로 환원해 보고 이웃각 같음 조건의 등변사다리꼴 반례를 찾는다.", "decisiveStep": "각 A = 각 B, 각 C = 각 D가 등변사다리꼴에서도 성립함을 판별하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_CRITERIA", "why": "평행사변형 판정 조건 및 반례 판별"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_COUNTEREXAMPLE_CONDITION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합동·엇각·대각선 조건이 평행사변형을 보장함을 확인하고 이웃각 같음 조건의 반례를 가려내는 문항이다.", "level": "중", "item4slot": {"given": ["사각형"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q14
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 변 $BC$의 중점을 $M$이라 하고, 직선 $AM$과 직선 $DC$의 교점을 $E$라 하자. $\triangle DME$의 넓이가 $24\text{ cm}^2$일 때, 사각형 $ABMD$의 넓이는? [4점]
### 선지
① $24\text{ cm}^2$ ② $28\text{ cm}^2$ ③ $30\text{ cm}^2$ ④ $32\text{ cm}^2$ ⑤ $36\text{ cm}^2$
### 정답
⑤
### 해설
$\overline{AB}\parallel\overline{CE}$이므로 $\angle ABM=\angle ECM$이고 $\overline{BM}=\overline{CM}$, $\angle AMB=\angle EMC$이므로 $\triangle ABM \equiv \triangle ECM$ (ASA 합동)이다. 따라서 $\overline{AM}=\overline{ME}$, $\overline{CE}=\overline{AB}=\overline{CD}$이다. $M$이 $\overline{AE}$의 중점이므로 $\triangle DMA=\triangle DME=24\text{ cm}^2$이고 $\triangle ADE=48\text{ cm}^2$이다. $C$가 $\overline{DE}$의 중점이므로 $\triangle ADC=\dfrac{1}{2}\triangle ADE=24\text{ cm}^2$이고 $\square ABCD=48\text{ cm}^2$이다. $\triangle MCD=\dfrac{1}{2}\triangle BCD=\dfrac{1}{4}\square ABCD=12\text{ cm}^2$이므로 $\square ABMD=48-12=36\text{ cm}^2$이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_MIDPOINT_AREA", "primaryMethod": "삼각형 ABM과 ECM의 ASA 합동으로 중점 관계를 찾고, 삼각형 DME 넓이 24로부터 평행사변형 전체 넓이 48을 거쳐 사각형 ABMD를 구한다.", "decisiveStep": "ASA 합동으로 AM = ME, CD = CE를 얻어 사각형 ABMD가 전체 넓이의 3/4임을 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "넓이와 활용", "l4": "분할도형"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 연장선 합동과 중선 넓이 분할 결합"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_AREA_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합동으로 두 선분의 중점 조건을 도출한 뒤 여러 삼각형의 넓이 비를 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["평행사변형", "중점", "넓이"], "goal": ["넓이"], "method": ["합동", "비례배분"], "condition": []}, "hold": ""}

```

## Q15
- 형식: 객관식
- 배점: 4
### 발문
점 $O$를 중심으로 하는 두 동심원에서 작은 원 위의 점 $P$와 큰 원 위의 점 $Q$가 반직선 $OP$ 위에 있고 $\overline{OP}:\overline{PQ}=1:3$이다. 큰 원과 작은 원 사이의 도넛 모양 부분 (가)와 작은 원 (나)의 넓이의 비는? [4점]
### 선지
① $8 : 1$ ② $9 : 1$ ③ $12 : 1$ ④ $15 : 1$ ⑤ $16 : 1$
### 정답
④
### 해설
$\overline{OP}=r$라 하면 $\overline{PQ}=3r$이므로 큰 원의 반지름은 $\overline{OQ}=r+3r=4r$이다. (가)의 넓이는 $\pi(4r)^2-\pi r^2=15\pi r^2$, (나)의 넓이는 $\pi r^2$이다. $\therefore (\text{가}):(\text{나})=15\pi r^2:\pi r^2=15:1$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-CONCENTRIC_CIRCLE_AREA_RATIO", "primaryMethod": "반지름 비 1:4를 이용해 큰 원 넓이 16pi r^2에서 작은 원 넓이 pi r^2을 뺀 고리 넓이 비를 구한다.", "decisiveStep": "큰 원 반지름을 r + 3r = 4r로 구해 (16 - 1) : 1 = 15 : 1을 계산하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮음의 활용", "l4": "넓이·부피 비"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_AREA_VOLUME", "why": "동심원의 반지름 비와 고리 넓이 비 계산"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_AREA_VOLUME"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분 길이 비 OP:PQ = 1:3으로부터 큰 원 반지름을 4r로 구해 넓이 차의 비를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["원", "비율"], "goal": ["비율"], "method": ["넓이"], "condition": []}, "hold": ""}

```

## Q16
- 형식: 객관식
- 배점: 5
### 발문
$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=20\text{ cm}$, $\overline{BC}=16\text{ cm}$, $\overline{AC}=12\text{ cm}$이다. 외접원의 반지름의 길이를 $r_1\text{ cm}$, 내접원의 반지름의 길이를 $r_2\text{ cm}$라 할 때, $r_1-r_2$의 값은? [5점]
### 선지
① $6$ ② $4$ ③ $5$ ④ $7$ ⑤ $8$
### 정답
①
### 해설
직각삼각형의 외심은 빗변의 중점이므로 $r_1=\dfrac{20}{2}=10$이다. $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 12\times 16=96\text{ cm}^2$이고, $\dfrac{1}{2}r_2(12+16+20)=96 \implies 24r_2=96 \implies r_2=4$이다. $\therefore r_1-r_2=10-4=6$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMRADIUS_INRADIUS_DIFF", "primaryMethod": "빗변의 절반으로 외접원 반지름 r1 = 10을 구하고, 삼각형 넓이와 둘레로 내접원 반지름 r2 = 4를 구해 뺀다.", "decisiveStep": "r1 = 20/2 = 10과 24 * r2 = 96에서 r2 = 4를 구해 차를 계산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외접원·내접원 활용", "l4": "반지름·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_COMBINED", "why": "직각삼각형의 외접원·내접원 반지름 동시 계산"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_TRIANGLE_INCENTER", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형의 외접원 반지름 성질과 내접원 반지름 넓이 공식을 함께 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형", "외심", "내심"], "goal": ["차"], "method": ["넓이"], "condition": []}, "hold": ""}

```

## Q17
- 형식: 객관식
- 배점: 5
### 발문
정사각형 $ABCD$의 외부에 $\overline{AB}=\overline{AP}$가 되도록 점 $P$를 잡았다. 반직선 $DP$가 $\overline{DA}$와 대각선 $DB$ 사이에 있고 $\angle PDB=21^\circ$일 때, $\angle PBA$의 크기는? [5점]
### 선지
① $65^\circ$ ② $69^\circ$ ③ $71^\circ$ ④ $73^\circ$ ⑤ $75^\circ$
### 정답
②
### 해설
정사각형에서 $\angle ADB=45^\circ$이므로 $\angle PDA=45^\circ-21^\circ=24^\circ$이다. $\overline{AP}=\overline{AB}=\overline{AD}$이므로 $\triangle APD$는 이등변삼각형이고 $\angle APD=\angle PDA=24^\circ$이다. 따라서 $\angle PAD=180^\circ-24^\circ-24^\circ=132^\circ$이다. $\angle DAB=90^\circ$이므로 $\angle PAB=132^\circ-90^\circ=42^\circ$이다. $\overline{AP}=\overline{AB}$이므로 $\triangle APB$에서 $\angle PBA=\dfrac{180^\circ-42^\circ}{2}=69^\circ$이다. $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-SQUARE_ISOSCELES_ANGLES", "primaryMethod": "정사각형 대각선 45도에서 각 PDA = 24도를 구하고, 두 이등변삼각형 APD, APB의 밑각 성질을 차례로 적용한다.", "decisiveStep": "각 PAD = 132도에서 90도를 빼 각 PAB = 42도를 구하고 밑각 PBA를 계산하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "각 사각형의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "정사각형 대각선 각과 이등변삼각형 연쇄 각 계산"}, "crossConceptKeys": ["CC_SQUARE_PROPERTIES", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정사각형의 대각선 각 45도, 두 이등변삼각형의 꼭짓각·밑각 변환을 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["정사각형", "대각선"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q18
- 형식: 객관식
- 배점: 5
### 발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $O$는 외심, 점 $I$는 내심이고 $\angle OAC=22^\circ$일 때, $\angle OCI$의 크기는? [5점]
### 선지
① $6^\circ$ ② $8^\circ$ ③ $10^\circ$ ④ $12^\circ$ ⑤ $14^\circ$
### 정답
④
### 해설
$\overline{OA}=\overline{OC}$이므로 $\angle OCA=\angle OAC=22^\circ$이다. 외심 $O$는 이등변삼각형 $ABC$의 꼭짓각 $A$의 이등분선 위에 있으므로 $\angle A=2\times 22^\circ=44^\circ$이다. 따라서 $\angle ACB=\dfrac{180^\circ-44^\circ}{2}=68^\circ$이다. 내심 $I$는 $\angle C$를 이등분하므로 $\angle ACI=\dfrac{68^\circ}{2}=34^\circ$이다. $\therefore \angle OCI=\angle ACI-\angle OCA=34^\circ-22^\circ=12^\circ$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_OCI_ANGLE", "primaryMethod": "이등변삼각형 대칭축 위의 외심 각 OAC = 22도로부터 꼭짓각 A = 44도와 밑각 C = 68도를 구한 뒤 내심 반각과 뺀다.", "decisiveStep": "밑각 C = 68도의 절반 각 ACI = 34도에서 각 OCA = 22도를 빼는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외접원·내접원 활용", "l4": "외심·내심을 이용한 복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_COMBINED", "why": "이등변삼각형에서 외심·내심 각 차이 계산"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_CIRCUMCENTER", "CC_TRIANGLE_INCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형의 대칭축 위 외심 성질과 내심 각 이등분 성질을 모두 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["이등변삼각형", "외심", "내심"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q19
- 형식: 객관식
- 배점: 5
### 발문
평행사변형 $ABCD$에서 변 $AB$의 중점을 $M$이라 하고, 꼭짓점 $D$에서 선분 $CM$에 내린 수선의 발을 $P$라 하자. $\angle CDP=16^\circ$, $\angle BCM=24^\circ$일 때, $\angle ABC$의 크기는? [5점]
### 선지
① $74^\circ$ ② $76^\circ$ ③ $78^\circ$ ④ $80^\circ$ ⑤ $82^\circ$
### 정답
⑤
### 해설
$\triangle DCP$에서 $\angle DPC=90^\circ$이므로 $\angle DCP=180^\circ-90^\circ-16^\circ=74^\circ$이다. 따라서 $\angle BCD=\angle BCM+\angle DCP=24^\circ+74^\circ=98^\circ$이다. 평행사변형에서 이웃한 두 내각의 합은 $180^\circ$이므로 $\angle ABC=180^\circ-98^\circ=82^\circ$이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_PERPENDICULAR_ANGLE", "primaryMethod": "직각삼각형 DCP에서 각 DCP = 74도를 구해 각 BCD = 98도를 얻고 이웃각 합 180도로 각 ABC를 구한다.", "decisiveStep": "각 BCD = 24도 + 74도 = 98도를 구해 180도에서 빼는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 이웃각 합과 직각삼각형 각 계산 결합"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "수선의 발 직각삼각형에서 내각을 구한 뒤 평행사변형 이웃각의 합 180도를 적용하는 문항이다.", "level": "상", "item4slot": {"given": ["평행사변형", "수선"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}

```

## Q20
- 형식: 객관식
- 배점: 5
### 발문
$\overline{AB}=\overline{AC}=\overline{CD}=\overline{CE}$, $\overline{DE}=\overline{FE}$이고 세 점 $B$, $A$, $D$와 세 점 $B$, $C$, $E$, 세 점 $A$, $D$, $F$가 각각 한 직선 위에 차례로 놓여 있다. $\angle EDF=71^\circ$일 때, $\angle ABC$의 크기는? [5점]
### 선지
① $34^\circ$ ② $36^\circ$ ③ $38^\circ$ ④ $40^\circ$ ⑤ $42^\circ$
### 정답
③
### 해설
$\angle ABC=x$라 하면 $\overline{AB}=\overline{AC}$이므로 $\angle ACB=x$, $\angle CAD=2x$이다. $\overline{AC}=\overline{CD}$이므로 $\angle CDA=2x$, $\angle ACD=180^\circ-4x$이다. $\angle ACE=180^\circ-x$이므로 $\angle DCE=(180^\circ-x)-(180^\circ-4x)=3x$이다. $\overline{CD}=\overline{CE}$이므로 $\angle CDE=\dfrac{180^\circ-3x}{2}=90^\circ-\dfrac{3}{2}x$이다. 세 점 $A$, $D$, $F$가 한 직선 위에 있으므로 $\angle CDA+\angle CDE+\angle EDF=180^\circ$에서 $2x+\left(90^\circ-\dfrac{3}{2}x\right)+71^\circ=180^\circ \implies \dfrac{1}{2}x=19^\circ \implies x=38^\circ$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-MULTI_ISOSCELES_LINEAR_EQUATION", "primaryMethod": "밑각을 x로 두고 연속된 세 이등변삼각형의 각을 x로 표현한 뒤 일직선 위 각의 합 180도 방정식을 푼다.", "decisiveStep": "각 CDA = 2x와 각 CDE = 90 - (3/2)x를 구해 2x + 90 - (3/2)x + 71 = 180 방정식을 세우는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "연쇄 이등변삼각형의 문자 식 세우기 및 일차방정식 풀이"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_ALGEBRAIC_MODELING", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B34", "difficultyReason": "세 이등변삼각형의 각을 문자 x로 연쇄 표현하고 평각 방정식을 세워야 하는 고난도 문항이다.", "level": "상", "item4slot": {"given": ["이등변삼각형", "각"], "goal": ["각"], "method": ["방정식"], "condition": []}, "hold": ""}

```

## Q21
- 형식: 서답형
- 배점: 4
### 발문
[서술형 1] 직선 $l$이 $\angle BAC=90^\circ$, $\overline{AB}=\overline{AC}$인 직각이등변삼각형 $ABC$의 꼭짓점 $A$를 지나고(단, 직선 $l$은 변 $BC$와 만나지 않음), 두 꼭짓점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자. 합동인 두 삼각형을 찾아 합동 기호로 나타내고 [2점], 합동인 이유를 서술하시오. [2점] [총 4점]
### 선지
없음
### 정답
$\triangle ABD \equiv \triangle CAE$ (RHA 합동)
### 해설
$\triangle ABD$와 $\triangle CAE$에서 $\angle ADB=\angle CEA=90^\circ$이고 빗변 $\overline{AB}=\overline{CA}$이다. 또 $\angle DAB+\angle CAE=90^\circ$이고 $\angle DAB+\angle ABD=90^\circ$이므로 $\angle ABD=\angle CAE$이다. 따라서 빗변의 길이와 한 예각의 크기가 각각 같으므로 $\triangle ABD \equiv \triangle CAE$ (RHA 합동)이다.



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "21", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RIGHT_ISOSCELES_LINE_RHA", "primaryMethod": "직각이등변삼각형에서 직선 l에 내린 수선으로 생긴 두 직각삼각형의 빗변 같음과 여각 관계를 이용해 RHA 합동을 증명한다.", "decisiveStep": "각 DAB + 각 CAE = 90도로부터 각 ABD = 각 CAE를 유도해 RHA 합동을 보이는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE", "why": "직각이등변삼각형과 외부 직선 수선 RHA 합동 증명"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "빗변의 길이 같음과 90도 여각 관계로 한 예각이 같음을 보여 RHA 합동을 서술하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형", "이등변삼각형", "수선"], "goal": ["합동"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q22
- 형식: 서답형
- 배점: 5
### 발문
[서술형 2] $\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자. $\triangle ABC$의 둘레의 길이가 $31\text{ cm}$이고 $\triangle ADE$의 둘레의 길이가 $22\text{ cm}$일 때, $\overline{BC}$의 길이를 구하고 [2점] 그 과정을 서술하시오. [3점] [총 5점]
### 선지
없음
### 정답
$9\text{ cm}$
### 해설
$I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다. $\overline{DE}\parallel\overline{BC}$이므로 엇각에 의해 $\angle DIB=\angle IBC=\angle DBI$, $\angle EIC=\angle ICB=\angle ECI$이다. 따라서 $\overline{DB}=\overline{DI}$, $\overline{EC}=\overline{EI}$이므로 $\triangle ADE$의 둘레는 $\overline{AD}+\overline{DI}+\overline{IE}+\overline{AE}=\overline{AB}+\overline{AC}=22\text{ cm}$이다. $\therefore \overline{BC}=(\triangle ABC\text{의 둘레})-(\overline{AB}+\overline{AC})=31-22=9\text{ cm}$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_PARALLEL_BASE_LENGTH", "primaryMethod": "내심과 평행선 엇각으로 이등변삼각형 두 개를 찾아 삼각형 ADE의 둘레가 AB + AC와 같음을 보이고 전체 둘레에서 뺀다.", "decisiveStep": "DE = BD + CE로부터 AB + AC = 22임을 이끌어내어 BC = 31 - 22 = 9를 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심과 평행선으로 이루어진 둘레 성질 서술"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_ALTERNATE_INTERIOR_ANGLES", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형 판정을 통해 삼각형 ADE의 둘레가 AB + AC로 전환됨을 논리적으로 서술해야 하는 문항이다.", "level": "상", "item4slot": {"given": ["삼각형", "내심", "평행"], "goal": ["길이"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q23
- 형식: 서답형
- 배점: 5
### 발문
[서술형 3] 점 $I$가 $\triangle ABC$의 내심이고 $\angle BIC=124^\circ$일 때, $\angle A$의 크기 $x$를 구하고 [2점] 그 과정을 서술하시오. [3점] [총 5점]
### 선지
없음
### 정답
$68^\circ$
### 해설
내심 $I$의 각 성질에 의해 $\angle BIC=90^\circ+\dfrac{1}{2}\angle A$이다. $124^\circ=90^\circ+\dfrac{1}{2}x \implies \dfrac{1}{2}x=34^\circ \implies x=68^\circ$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_BIC_FORMULA", "primaryMethod": "내심의 각 공식 각 BIC = 90 + (1/2)각 A에 124도를 대입해 x를 구한다.", "decisiveStep": "124 = 90 + x/2 방정식에서 x = 68도를 푸는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심의 각 BIC 공식 적용"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "내심의 각 공식을 바로 적용해 미지각을 구하는 기본 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "내심"], "goal": ["각"], "method": ["방정식"], "condition": []}, "hold": ""}

```

## Q24
- 형식: 서답형
- 배점: 6
### 발문
[서술형 4] $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자. $\overline{AB}=10$, $\overline{AC}=6$이고 $\triangle ABC$의 넓이가 $24$일 때, 직각삼각형의 합동 조건을 활용하여 $\overline{DC}$의 길이를 구하고 [2점] 그 과정을 서술하시오. [4점] [총 6점]
### 선지
없음
### 정답
$3$
### 해설
$\triangle ABC$의 넓이에서 $\dfrac{1}{2}\times 6\times\overline{BC}=24 \implies \overline{BC}=8$이다. 점 $D$에서 $\overline{AB}$에 내린 수선의 발을 $E$라 하면 $\triangle ACD$와 $\triangle AED$에서 $\angle ACD=\angle AED=90^\circ$, $\overline{AD}$는 공통, $\angle CAD=\angle EAD$이므로 $\triangle ACD \equiv \triangle AED$ (RHA 합동)이다. 따라서 $\overline{AE}=\overline{AC}=6$, $\overline{DE}=\overline{DC}$이므로 $\overline{BE}=10-6=4$이다. $\overline{DC}=\overline{DE}=t$라 하면 $\overline{BD}=8-t$이고, 직각삼각형 $BDE$에서 피타고라스 정리에 의해 $(8-t)^2=4^2+t^2 \implies 64-16t+t^2=16+t^2 \implies 16t=48 \implies t=3$ $\therefore \overline{DC}=3$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RHA_PYTHAGORAS_SEGMENT", "primaryMethod": "넓이로 BC = 8을 구하고 수선의 발 E를 내려 RHA 합동으로 AE = 6, DE = DC = t를 얻은 뒤 직각삼각형 BDE에 피타고라스 정리를 적용한다.", "decisiveStep": "(8 - t)^2 = 4^2 + t^2 방정식을 세워 t = 3을 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE", "why": "각 이등분선 RHA 합동과 피타고라스 정리 결합"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA", "CC_ALGEBRAIC_MODELING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "보조선 수선의 발을 내려 RHA 합동을 보인 뒤 피타고라스 정리로 이차항이 소거되는 방정식을 풀어야 하는 문항이다.", "level": "상", "item4slot": {"given": ["직각삼각형", "각이등분선", "넓이"], "goal": ["길이"], "method": ["합동", "피타고라스정리"], "condition": []}, "hold": ""}

```
