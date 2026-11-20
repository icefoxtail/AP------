```json:exam
{"stem": "24_매산중_2학기_중간_중2_유사", "sourceArchiveFile": "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js", "examFolder": "2mid", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-16"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
$\triangle ABC$에서 $\overline{AB}=\overline{AC}$이고, $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자. $\overline{BC}=24\text{ cm}$이고 $\overline{BD}=x\text{ cm}$, $\angle ADC=y^\circ$일 때, $x+y$의 값은? [3점]
### 선지
① $98$ ② $100$ ③ $102$ ④ $104$ ⑤ $106$
### 정답
③
### 해설
$\triangle ABD$와 $\triangle ACD$에서 $\overline{AB}=\overline{AC}$, $\angle BAD=\angle CAD$, $\overline{AD}$는 공통이므로 $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다. 따라서 $\overline{BD}=\overline{CD}=\dfrac{1}{2}\overline{BC}=\dfrac{1}{2}\times 24=12\text{ cm}$이므로 $x=12$이다. 또 $\angle ADB=\angle ADC$이고 $\angle ADB+\angle ADC=180^\circ$이므로 $\angle ADC=90^\circ$, 즉 $y=90$이다. $\therefore x+y=12+90=102$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_BISECTOR", "primaryMethod": "이등변삼각형의 꼭짓각 이등분선이 밑변을 수직이등분함을 이용해 BD = 12와 각 ADC = 90도를 구한다.", "decisiveStep": "BC = 24를 이등분해 x = 12를 구하고 수직 조건으로 y = 90을 확정하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "꼭짓각의 이등분선"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_VERTEX_BISECTOR", "why": "이등변삼각형 꼭짓각 이등분선 성질 적용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형의 꼭짓각 이등분선 성질을 바로 적용해 길이와 각을 합산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["합"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q02
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 변 $BC$의 연장선 위의 한 점 $D$에 대하여 $\angle ACD=112^\circ$일 때, $\angle A$의 크기는? [4점]
### 선지
① $34^\circ$ ② $38^\circ$ ③ $42^\circ$ ④ $44^\circ$ ⑤ $48^\circ$
### 정답
④
### 해설
$\angle ACB=180^\circ-\angle ACD=180^\circ-112^\circ=68^\circ$ $\overline{AB}=\overline{AC}$이므로 $\angle ABC=\angle ACB=68^\circ$ $\therefore \angle A=180^\circ-(68^\circ+68^\circ)=44^\circ$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_EXTERIOR_ANGLE", "primaryMethod": "외각 112도에서 밑각 C = 68도를 구한 뒤 이등변삼각형의 두 밑각이 같음을 이용해 꼭짓각 A를 구한다.", "decisiveStep": "180도 - 112도 = 68도로 밑각을 구하고 180도에서 두 밑각의 합을 빼는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "이등변삼각형 밑각과 꼭짓각 관계 적용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "보각 관계로 밑각을 구하고 삼각형 내각의 합으로 꼭짓각을 계산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["이등변삼각형", "외각"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}

```

## Q03
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AB}$의 양 끝 점 $A$, $B$에서 $\overline{AB}$의 중점 $M$을 지나는 직선 $l$에 내린 수선의 발을 각각 $D$, $C$라 하자. $\overline{BC}=14\text{ cm}$, $\angle DAM=58^\circ$일 때, $\overline{AD}=x\text{ cm}$, $\angle BMC=y^\circ$라 하면 $x+y$의 값은? [4점]
### 선지
① $46$ ② $48$ ③ $50$ ④ $52$ ⑤ $72$
### 정답
①
### 해설
$\triangle AMD$와 $\triangle BMC$에서 $\angle ADM=\angle BCM=90^\circ$, $\overline{AM}=\overline{BM}$, $\angle AMD=\angle BMC$ (맞꼭지각)이므로 $\triangle AMD \equiv \triangle BMC$ (RHA 합동)이다. 따라서 $\overline{AD}=\overline{BC}=14\text{ cm}$이므로 $x=14$이다. $\triangle AMD$에서 $\angle AMD=180^\circ-90^\circ-58^\circ=32^\circ$이고 맞꼭지각에 의해 $\angle BMC=32^\circ$이므로 $y=32$이다. $\therefore x+y=14+32=46$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RIGHT_TRIANGLE_RHA", "primaryMethod": "중점과 맞꼭지각 조건으로 두 직각삼각형의 RHA 합동을 보여 AD = 14를 구하고, 내각의 합으로 y = 32를 구한다.", "decisiveStep": "RHA 합동으로 x = 14를 확정하고 직각삼각형의 나머지 예각 32도를 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE", "why": "직각삼각형 RHA 합동 조건 적용"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "RHA 합동 조건을 도출한 뒤 대응변과 맞꼭지각을 연결해 합산하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형", "중점", "수선"], "goal": ["합"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q04
- 형식: 객관식
- 배점: 4
### 발문
점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle AOB=116^\circ$일 때, $\angle ACB$의 크기는? [4점]
### 선지
① $54^\circ$ ② $58^\circ$ ③ $62^\circ$ ④ $64^\circ$ ⑤ $68^\circ$
### 정답
②
### 해설
$\overline{OA}=\overline{OB}$이므로 $\angle OAB=\angle OBA=\dfrac{180^\circ-116^\circ}{2}=32^\circ$이다. $\overline{OA}=\overline{OC}$, $\overline{OB}=\overline{OC}$이므로 $\angle OAC=\angle OCA=a$, $\angle OBC=\angle OCB=b$라 하면 $\triangle ABC$의 세 내각의 합에서 $(32^\circ+a)+(32^\circ+b)+(a+b)=180^\circ$ $64^\circ+2(a+b)=180^\circ$, $2(a+b)=116^\circ$, $\therefore a+b=58^\circ$ $\therefore \angle ACB=a+b=58^\circ$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_ANGLE", "primaryMethod": "외심 O에서 세 꼭짓점까지의 거리가 같음을 이용해 세 이등변삼각형의 밑각 관계를 세우고 내각의 합으로 각 ACB를 구한다.", "decisiveStep": "각 OAB = 32도를 구한 뒤 삼각형 내각의 합으로 2(a + b) = 116도를 유도하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "외심의 위치·각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심과 세 꼭짓점 거리 같음 성질 적용"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심에서 세 꼭짓점까지의 반지름이 같음을 이용해 두 밑각의 합을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q05
- 형식: 객관식
- 배점: 4
### 발문
점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 할 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]
### 선지
① $\overline{OB}=\overline{OC}$ ② $\overline{AD}=\overline{BD}$ ③ $\angle OAC=\angle OCA$ ④ $\triangle OCF \equiv \triangle OAF$ ⑤ $\overline{OD}=\overline{OE}$
### 정답
⑤
### 해설
① $\overline{OB}$, $\overline{OC}$는 외접원의 반지름이므로 항상 같다. ②, ④ $\triangle OAD \equiv \triangle OBD$, $\triangle OCF \equiv \triangle OAF$ (RHS 합동)이므로 $\overline{AD}=\overline{BD}$이고 합동이 성립한다. ③ $\overline{OA}=\overline{OC}$인 이등변삼각형이므로 $\angle OAC=\angle OCA$이다. ⑤ $\overline{OD}$와 $\overline{OE}$는 외심에서 서로 다른 두 변까지의 거리이므로 항상 같다고 할 수 없다(세 변까지의 거리가 같은 것은 내심이다). $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "5", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_PROPERTY", "primaryMethod": "외심에서 세 꼭짓점까지의 거리와 세 변의 수직이등분선 성질을 확인하고 내심 성질과 구분한다.", "decisiveStep": "외심에서 세 변까지의 거리 OD와 OE가 일반적으로 같지 않음을 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "수직이등분선과 외심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심의 기본 성질과 수직이등분선 판별"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_RIGHT_TRIANGLE_CONGRUENCE_RHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심의 정의와 합동 성질을 다섯 선지에서 대조해 내심 성질과의 혼동을 가려내는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심", "수선"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q06
- 형식: 객관식
- 배점: 4
### 발문
점 $I$가 $\triangle ABC$의 내심이고 $\angle ACI=28^\circ$, $\angle BIC=118^\circ$일 때, $\angle IBC$의 크기는? [4점]
### 선지
① $34^\circ$ ② $32^\circ$ ③ $30^\circ$ ④ $28^\circ$ ⑤ $26^\circ$
### 정답
①
### 해설
내심 $I$는 세 내각의 이등분선의 교점이므로 $\angle ICB=\angle ACI=28^\circ$이다. $\triangle BIC$에서 $\angle IBC+28^\circ+118^\circ=180^\circ$ $\therefore \angle IBC=180^\circ-146^\circ=34^\circ$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_ANGLE", "primaryMethod": "내심이 각의 이등분선 교점이므로 각 ICB = 28도를 얻고, 삼각형 BIC의 내각의 합으로 각 IBC를 구한다.", "decisiveStep": "각 ICB = 28도를 확인한 뒤 180도 - 118도 - 28도로 각 IBC를 계산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심의 각의 이등분선 성질 적용"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내심의 각 이등분 정의를 바로 적용해 삼각형 BIC의 나머지 한 각을 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["삼각형", "내심"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}

```

## Q07
- 형식: 객관식
- 배점: 4
### 발문
점 $I$가 $\triangle ABC$의 내심이고, 점 $I$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{ID}=7\text{ cm}$, $\angle IBC=36^\circ$, $\angle ICB=29^\circ$일 때, $\overline{IE}=y\text{ cm}$, $\angle BIC=x^\circ$라 하면 $x+y$의 값은? [4점]
### 선지
① $115$ ② $119$ ③ $122$ ④ $125$ ⑤ $129$
### 정답
③
### 해설
내심 $I$에서 삼각형의 세 변까지의 거리는 모두 같으므로 $y=\overline{IE}=\overline{ID}=7$이다. $\triangle BIC$에서 $x=180-36-29=115$이다. $\therefore x+y=115+7=122$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_DISTANCE_ANGLE", "primaryMethod": "내심에서 세 변까지의 거리가 같아 y = 7임을 구하고, 삼각형 BIC의 내각의 합으로 x = 115를 구해 더한다.", "decisiveStep": "내심의 거리 성질로 y = 7을 확정하고 180 - 36 - 29 = 115와 합산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "내심과 거리"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심에서 세 변까지의 거리와 각 성질 적용"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "내심의 거리 성질과 삼각형 내각의 합을 각각 바로 적용해 더하는 기초 결합 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "내심", "수선"], "goal": ["합"], "method": ["내각"], "condition": []}, "hold": ""}

```

## Q08
- 형식: 객관식
- 배점: 5
### 발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $I$는 내심이고, 점 $O$는 외심이다. $\angle A=84^\circ$일 때, $\angle IBO$의 크기는? [5점]
### 선지
① $12^\circ$ ② $14^\circ$ ③ $16^\circ$ ④ $18^\circ$ ⑤ $20^\circ$
### 정답
④
### 해설
$\overline{AB}=\overline{AC}$이므로 $\angle ABC=\dfrac{180^\circ-84^\circ}{2}=48^\circ$이다. $BI$는 $\angle B$의 이등분선이므로 $\angle IBC=\dfrac{1}{2}\angle ABC=24^\circ$이다. 한편 $\overline{AB}=\overline{AC}$, $\overline{OB}=\overline{OC}$, $\overline{AO}$는 공통이므로 $\triangle AOB \equiv \triangle AOC$ (SSS 합동)이고 $\angle BAO=\dfrac{1}{2}\angle A=42^\circ$이다. $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle BAO=42^\circ$이고, $\angle OBC=48^\circ-42^\circ=6^\circ$이다. $\therefore \angle IBO=\angle IBC-\angle OBC=24^\circ-6^\circ=18^\circ$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_CIRCUMCENTER_ANGLE", "primaryMethod": "이등변삼각형의 밑각 48도에서 내심 각 IBC = 24도와 외심 각 OBC = 6도를 각각 구해 차를 계산한다.", "decisiveStep": "외심 성질로 각 ABO = 42도를 구해 각 OBC = 6도를 얻고 각 IBC = 24도에서 빼는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외접원·내접원 활용", "l4": "외심·내심을 이용한 복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_COMBINED", "why": "이등변삼각형에서 외심과 내심의 각 관계 결합"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_INCENTER", "CC_TRIANGLE_CIRCUMCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형 위에서 내심의 각 이등분과 외심의 합동·반지름 성질을 모두 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["이등변삼각형", "내심", "외심"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q09
- 형식: 객관식
- 배점: 3
### 발문
평행사변형 $ABCD$에서 $\overline{AD}=x\text{ cm}$, $\overline{BC}=9\text{ cm}$, $\angle C=65^\circ$, $\angle D=y^\circ$일 때, $x$, $y$의 값은? [3점]
### 선지
① $x=7,\ y=115$ ② $x=9,\ y=115$ ③ $x=9,\ y=65$ ④ $x=9,\ y=125$ ⑤ $x=11,\ y=115$
### 정답
②
### 해설
평행사변형에서 마주 보는 변의 길이는 같으므로 $x=\overline{AD}=\overline{BC}=9$이다. 이웃한 두 내각의 합은 $180^\circ$이므로 $y=180-65=115$이다. $\therefore x=9,\ y=115$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_SIDE_ANGLE", "primaryMethod": "평행사변형의 대변의 길이가 같음과 이웃한 두 내각의 합이 180도임을 적용한다.", "decisiveStep": "BC = 9에서 x = 9를, 180 - 65 = 115에서 y = 115를 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형의 변과 각 성질 적용"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형의 기본 성질만으로 미지수 x와 y를 바로 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["평행사변형"], "goal": ["값"], "method": ["대입"], "condition": []}, "hold": ""}

```

## Q10
- 형식: 객관식
- 배점: 4
### 발문
다음 조건을 만족시키는 사각형 $ABCD$ 중 평행사변형이 아닌 것은? [4점]
### 선지
① $\overline{AB}=\overline{DC}=7\text{ cm}$, $\overline{AD}=\overline{BC}=5\text{ cm}$ ② $\angle BAC=\angle DCA=35^\circ$, $\angle BCA=\angle DAC=45^\circ$ ③ 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, $\overline{AO}=\overline{CO}=4\text{ cm}$, $\overline{BO}=\overline{DO}=6\text{ cm}$ ④ $\overline{AD}\parallel\overline{BC}$, $\overline{AD}=\overline{BC}=8\text{ cm}$ ⑤ $\angle A=62^\circ$, $\angle B=118^\circ$
### 정답
⑤
### 해설
① 두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다. ② 엇각의 크기가 같으므로 $\overline{AB}\parallel\overline{DC}$, $\overline{AD}\parallel\overline{BC}$이어서 평행사변형이다. ③ 두 대각선이 서로를 이등분하므로 평행사변형이다. ④ 한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다. ⑤ 이웃한 두 각의 합이 $62^\circ+118^\circ=180^\circ$이므로 $\overline{AD}\parallel\overline{BC}$이지만, 나머지 한 쌍의 대변 $\overline{AB}$, $\overline{DC}$가 평행하다고 단정할 수 없으므로 사다리꼴일 수 있어 평행사변형이 아니다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "10", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_CRITERIA", "primaryMethod": "평행사변형이 되는 5가지 조건을 대조해 이웃한 두 각의 합이 180도인 조건만으로는 한 쌍만 평행한 사다리꼴 반례가 있음을 판별한다.", "decisiveStep": "각 A + 각 B = 180도 조건이 한 쌍의 대변 평행만 보장함을 판별하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_CRITERIA", "why": "평행사변형 판정 조건과 반례 구별"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_COUNTEREXAMPLE_CONDITION", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "엇각·대변·대각선 조건을 모두 판정한 뒤 이웃한 각의 보각 조건의 반례를 구별하는 문항이다.", "level": "상", "item4slot": {"given": ["사각형", "각", "변"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q11
- 형식: 객관식
- 배점: 4
### 발문
마름모 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\overline{OB}=13\text{ cm}$, $\overline{OD}=(2x+5)\text{ cm}$, $\angle OBC=32^\circ$, $\angle DAC=y^\circ$일 때, $x+y$의 값은? [4점]
### 선지
① $58$ ② $62$ ③ $64$ ④ $68$ ⑤ $72$
### 정답
②
### 해설
마름모의 두 대각선은 서로를 이등분하므로 $\overline{OD}=\overline{OB}=13\text{ cm}$이다. $2x+5=13 \implies 2x=8 \implies x=4$ 또 대각선 $BD$는 $\angle B$를 이등분하므로 $\angle B=2\times 32^\circ=64^\circ$이다. $\angle A=180^\circ-64^\circ=116^\circ$이고, 대각선 $AC$는 $\angle A$를 이등분하므로 $y=\dfrac{116}{2}=58$이다. $\therefore x+y=4+58=62$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RHOMBUS_DIAGONAL_ANGLE", "primaryMethod": "마름모의 대각선이 서로를 이등분함과 각 꼭짓각을 이등분함을 이용해 x = 4와 y = 58을 구한다.", "decisiveStep": "2x + 5 = 13에서 x = 4를 구하고 이웃각 합 180도로 각 A = 116도를 거쳐 y = 58을 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "마름모의 대각선 이등분 및 각 이등분 성질 적용"}, "crossConceptKeys": ["CC_RHOMBUS_PROPERTIES", "CC_DIAGONALS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대각선 이등분 방정식과 마름모의 내각 이등분 성질을 함께 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["마름모", "대각선"], "goal": ["합"], "method": ["방정식"], "condition": []}, "hold": ""}

```

## Q12
- 형식: 객관식
- 배점: 4
### 발문
두 대각선의 교점이 $O$인 평행사변형 $ABCD$가 직사각형이 되는 조건으로 옳지 않은 것은? [4점]
### 선지
① $\angle ABC=90^\circ$ ② $\overline{OA}=\overline{OB}$ ③ $\overline{AC}=\overline{BD}$ ④ $\overline{AC}\perp\overline{BD}$ ⑤ $\angle BAD=\angle CDA$
### 정답
④
### 해설
① 한 내각이 $90^\circ$인 평행사변형은 직사각형이다. ② $\overline{OA}=\overline{OB}$이면 $\overline{AC}=2\overline{OA}=2\overline{OB}=\overline{BD}$이므로 직사각형이다. ③ 두 대각선의 길이가 같은 평행사변형은 직사각형이다. ④ 두 대각선이 수직인 평행사변형은 마름모가 되는 조건이므로 항상 직사각형이 되지는 않는다. ⑤ $\angle BAD+\angle CDA=180^\circ$이고 두 각이 같으므로 모두 $90^\circ$가 되어 직사각형이다. $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "12", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_TO_RECTANGLE", "primaryMethod": "평행사변형이 직사각형이 되는 조건과 마름모가 되는 조건을 다섯 선지에서 구분한다.", "decisiveStep": "대각선 수직 조건 AC perpendicular BD가 마름모 조건임을 판별하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "조건으로 사각형 판정"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "평행사변형에서 직사각형으로의 전환 조건 판별"}, "crossConceptKeys": ["CC_RECTANGLE_PROPERTIES", "CC_RHOMBUS_PROPERTIES", "CC_QUADRILATERAL_HIERARCHY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "OA = OB나 이웃각 같음 등 동치 조건을 직사각형 성질로 환원해 마름모 조건과 구별하는 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q13
- 형식: 객관식
- 배점: 4
### 발문
정사각형 $ABCD$에서 변 $AD$ 위의 점 $E$와 변 $BC$ 위의 점 $F$를 $\overline{AE}=\overline{CF}$가 되도록 잡고, 대각선 $AC$와 두 선분 $BE$, $DF$의 교점을 각각 $G$, $H$라 하자. $\angle AHD=73^\circ$일 때, $\angle ABE$의 크기는? [4점]
### 선지
① $28^\circ$ ② $30^\circ$ ③ $32^\circ$ ④ $35^\circ$ ⑤ $38^\circ$
### 정답
①
### 해설
$\triangle ABE$와 $\triangle CDF$에서 $\overline{AB}=\overline{CD}$, $\angle BAE=\angle DCF=90^\circ$, $\overline{AE}=\overline{CF}$이므로 $\triangle ABE \equiv \triangle CDF$ (SAS 합동)이다. 정사각형의 대각선 $AC$는 꼭짓각을 이등분하므로 $\angle HCD=45^\circ$이다. $\angle CHD=180^\circ-\angle AHD=180^\circ-73^\circ=107^\circ$이다. $\triangle CHD$에서 $\angle CDH=180^\circ-107^\circ-45^\circ=28^\circ$이다. $\therefore \angle ABE=\angle CDF=\angle CDH=28^\circ$ $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-SQUARE_CONGRUENCE_ANGLE", "primaryMethod": "정사각형에서 SAS 합동인 두 직각삼각형 ABE와 CDF를 찾고, 삼각형 CHD의 내각의 합으로 각 CDF = 28도를 구한다.", "decisiveStep": "각 CHD = 107도와 대각선 각 HCD = 45도를 이용해 각 CDH = 28도를 구하고 합동으로 옮기는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "각 사각형의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "정사각형의 대각선 각과 삼각형 합동 결합"}, "crossConceptKeys": ["CC_SQUARE_PROPERTIES", "CC_TRIANGLE_CONGRUENCE_SAS", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정사각형의 대각선 이등분 각 45도, 보각, SAS 합동을 순차적으로 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["정사각형", "대각선"], "goal": ["각"], "method": ["합동"], "condition": []}, "hold": ""}

```

## Q14
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AD}\parallel\overline{BC}$인 등변사다리꼴 $ABCD$에서 변 $CB$의 연장선 위에 $\overline{AE}\parallel\overline{DB}$가 되도록 점 $E$를 잡았다. $\angle BCA=39^\circ$일 때, $\angle AEB$의 크기는? [4점]
### 선지
① $35^\circ$ ② $37^\circ$ ③ $39^\circ$ ④ $41^\circ$ ⑤ $43^\circ$
### 정답
③
### 해설
$\overline{AD}\parallel\overline{EB}$이고 $\overline{AE}\parallel\overline{DB}$이므로 $\square ADBE$는 평행사변형이고, 따라서 $\overline{AE}=\overline{DB}$이다. 등변사다리꼴에서 두 대각선의 길이는 같으므로 $\overline{DB}=\overline{AC}$이다. 즉 $\overline{AE}=\overline{AC}$이므로 $\triangle AEC$는 이등변삼각형이다. $\therefore \angle AEB=\angle ACE=\angle BCA=39^\circ$ $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_TRAPEZOID_PARALLEL", "primaryMethod": "보조선 AE와 DB의 평행으로 평행사변형 ADBE를 만들고 등변사다리꼴의 대각선 길이 같음을 연결해 이등변삼각형 AEC를 찾는다.", "decisiveStep": "AE = DB = AC로부터 삼각형 AEC가 이등변삼각형임을 도출하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사다리꼴", "l4": "등변사다리꼴"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "등변사다리꼴 대각선과 평행사변형 성질 결합"}, "crossConceptKeys": ["CC_ISOSCELES_TRAPEZOID", "CC_PARALLELOGRAMS", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "평행사변형 판정, 등변사다리꼴 대각선 성질, 이등변삼각형 밑각을 연쇄적으로 추론하는 문항이다.", "level": "상", "item4slot": {"given": ["등변사다리꼴", "평행"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음 보기 중 항상 닮은 두 도형을 모두 고른 것은? [4점]


ㄱ. 두 정사각형   ㄴ. 두 이등변삼각형   ㄷ. 두 구 ㄹ. 두 평행사변형   ㅁ. 두 직각삼각형   ㅂ. 두 정육각형
### 선지
① ㄱ, ㄴ, ㄷ ② ㄱ, ㄷ, ㄹ ③ ㄴ, ㄷ, ㅂ ④ ㄷ, ㄹ, ㅁ ⑤ ㄱ, ㄷ, ㅂ
### 정답
⑤
### 해설
ㄱ. 두 정사각형은 네 각이 모두 $90^\circ$이고 변의 길이의 비가 일정하므로 항상 닮은 도형이다. ㄷ. 두 구는 모양이 하나로 정해지므로 항상 닮은 도형이다. ㅂ. 두 정육각형은 변의 개수가 같은 정다각형이므로 항상 닮은 도형이다. ㄴ, ㄹ, ㅁ은 각의 크기가 다를 수 있어 항상 닮은 도형이 아니다. 따라서 항상 닮은 두 도형은 ㄱ, ㄷ, ㅂ이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-ALWAYS_SIMILAR_FIGURES", "primaryMethod": "변의 개수가 같은 정다각형과 구가 항상 닮음임을 확인하고 반례가 있는 도형을 제외한다.", "decisiveStep": "정사각형·구·정육각형을 항상 닮은 도형으로 선별하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "대응변·대응각"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_RATIO", "why": "항상 닮은 도형의 조건 판별"}, "crossConceptKeys": ["CC_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "평면도형과 입체도형 중 항상 닮은 도형을 정의에 따라 분류하는 문항이다.", "level": "중", "item4slot": {"given": ["정사각형", "구", "정육각형"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}

```

## Q16
- 형식: 객관식
- 배점: 4
### 발문
서로 닮은 두 정사각뿔 $A$, $B$에서 밑면의 한 변의 길이가 각각 $6\text{ cm}$, $15\text{ cm}$일 때, 두 정사각뿔 $A$와 $B$의 닮음비는? [4점]
### 선지
① $1 : 3$ ② $2 : 3$ ③ $3 : 5$ ④ $2 : 5$ ⑤ $3 : 4$
### 정답
④
### 해설
닮은 두 입체도형의 닮음비는 대응하는 모서리의 길이의 비와 같으므로 $6 : 15 = 2 : 5$ $\therefore$ ④



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-SOLID_SIMILARITY_RATIO", "primaryMethod": "닮은 두 정사각뿔의 대응하는 밑변 길이의 비 6 : 15를 가장 간단한 자연수의 비로 약분한다.", "decisiveStep": "6 : 15를 3으로 나누어 2 : 5로 기약비율을 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "닮음비"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_RATIO", "why": "닮은 입체도형의 닮음비 계산"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 대응 모서리 길이의 비를 약분해 닮음비를 바로 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["각뿔"], "goal": ["비율"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q17
- 형식: 객관식
- 배점: 4
### 발문
$\square ABCD \sim \square EFGH$이고 $\overline{AB}=20\text{ cm}$, $\overline{BC}=24\text{ cm}$, $\overline{FG}=18\text{ cm}$, $\angle A=75^\circ$, $\angle B=95^\circ$, $\angle C=80^\circ$일 때, $\overline{EF}$의 길이와 $\angle H$의 크기를 차례로 구하면? [4점]
### 선지
① $12\text{ cm},\ 110^\circ$ ② $15\text{ cm},\ 110^\circ$ ③ $15\text{ cm},\ 100^\circ$ ④ $16\text{ cm},\ 110^\circ$ ⑤ $16\text{ cm},\ 105^\circ$
### 정답
②
### 해설
두 사각형의 닮음비는 $\overline{BC}:\overline{FG}=24:18=4:3$이다. $\overline{AB}:\overline{EF}=4:3$이므로 $20:\overline{EF}=4:3 \implies \overline{EF}=20\times\dfrac{3}{4}=15\text{ cm}$이다. $\square ABCD$의 네 내각의 합은 $360^\circ$이므로 $\angle D=360^\circ-(75^\circ+95^\circ+80^\circ)=110^\circ$이다. 대응각의 크기는 같으므로 $\angle H=\angle D=110^\circ$이다. $\therefore 15\text{ cm},\ 110^\circ$ $\therefore$ ②



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-SIMILAR_FIGURES", "conceptClusterKey": "M2-06-SIMILAR_QUAD_SIDE_ANGLE", "primaryMethod": "대응변 BC와 FG로 닮음비 4:3을 구해 EF = 15를 계산하고, 사각형 내각의 합으로 각 D = 각 H = 110도를 구한다.", "decisiveStep": "닮음비 4:3으로 EF = 15를 구하고 360도에서 세 각을 빼 각 H = 110도를 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮은 도형", "l4": "닮음비"}, "ptTplCandidate": {"problemTypeKey": "PT_SIMILAR_FIGURES", "templateKey": "TPL_SIMILAR_FIGURES_RATIO", "why": "닮은 사각형의 대응변 비와 대응각 성질 적용"}, "crossConceptKeys": ["CC_SIMILAR_FIGURES_RATIO", "CC_ANGLE_RELATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대응변의 길이 비례와 사각형 내각의 합을 각각 적용해 대응변과 대응각을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["사각형", "각", "길이"], "goal": ["길이", "각"], "method": ["비례식"], "condition": []}, "hold": ""}

```

## Q18
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 변 $AD$ 위의 점 $E$에 대하여 선분 $BE$와 대각선 $AC$의 교점을 $F$라 하자. $\overline{AF}=8\text{ cm}$, $\overline{CF}=12\text{ cm}$, $\overline{BC}=30\text{ cm}$일 때, $\overline{ED}$의 길이는? [4점]
### 선지
① $6\text{ cm}$ ② $7\text{ cm}$ ③ $8\text{ cm}$ ④ $9\text{ cm}$ ⑤ $10\text{ cm}$
### 정답
⑤
### 해설
$\overline{AD}\parallel\overline{BC}$이므로 $\angle FAE=\angle FCB$ (엇각), $\angle AFE=\angle CFB$ (맞꼭지각)이다. 따라서 $\triangle AFE \sim \triangle CFB$ (AA 닮음)이고 닮음비는 $\overline{AF}:\overline{CF}=8:12=2:3$이다. $\overline{AE}:\overline{BC}=2:3$이므로 $\overline{AE}=30\times\dfrac{2}{3}=20\text{ cm}$이다. 평행사변형에서 $\overline{AD}=\overline{BC}=30\text{ cm}$이므로 $\overline{ED}=\overline{AD}-\overline{AE}=30-20=10\text{ cm}$이다. $\therefore$ ⑤



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_SIMILARITY", "conceptClusterKey": "M2-06-PARALLELOGRAM_HOURGLASS_SIMILARITY", "primaryMethod": "평행사변형의 평행 성질로 삼각형 AFE와 CFB의 AA 닮음비 2:3을 구해 AE = 20을 얻고 AD에서 뺀다.", "decisiveStep": "AA 닮음비 2:3으로 AE = 20을 구한 뒤 AD = 30에서 빼 ED = 10을 구하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "삼각형의 닮음", "l4": "AA"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_SIMILARITY", "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION", "why": "평행사변형 내부 모래시계형 AA 닮음 활용"}, "crossConceptKeys": ["CC_TRIANGLE_SIMILARITY_AA", "CC_PARALLELOGRAMS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형에서 엇각과 맞꼭지각으로 AA 닮음을 찾고 대변 길이에서 차를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["길이"], "method": ["닮음"], "condition": []}, "hold": ""}

```

## Q19
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AB}=18\text{ cm}$, $\overline{BC}=21\text{ cm}$인 직사각형 $ABCD$에서 변 $BC$ 위에 $\overline{BE}:\overline{CE}=4:3$이 되도록 점 $E$를 정하고, 변 $AB$ 위에 $\angle DEF=90^\circ$가 되도록 점 $F$를 정하자. $\overline{AD}$의 연장선과 $\overline{EF}$의 연장선의 교점을 $H$라 할 때, $\overline{AH}$의 길이는? [4점]
### 선지
① $24\text{ cm}$ ② $20\text{ cm}$ ③ $21\text{ cm}$ ④ $22\text{ cm}$ ⑤ $25\text{ cm}$
### 정답
①
### 해설
$\overline{BC}=21\text{ cm}$이고 $\overline{BE}:\overline{CE}=4:3$이므로 $\overline{BE}=21\times\dfrac{4}{7}=12\text{ cm}$, $\overline{CE}=21\times\dfrac{3}{7}=9\text{ cm}$이다. $\triangle CDE$와 $\triangle BFE$에서 $\angle DCE=\angle FBE=90^\circ$이고, $\angle DEC+\angle FEB=90^\circ$이므로 $\angle CDE=\angle FEB$이다. 따라서 $\triangle CDE \sim \triangle BFE$ (AA 닮음)이다. $\overline{CD}:\overline{BE}=\overline{CE}:\overline{BF} \implies 18:12=9:\overline{BF} \implies \overline{BF}=6\text{ cm}$이다. 따라서 $\overline{AF}=\overline{AB}-\overline{BF}=18-6=12\text{ cm}$이다. $\overline{AH}\parallel\overline{BE}$이므로 $\triangle AFH \sim \triangle BFE$ (AA 닮음)이고, $\overline{AH}:\overline{BE}=\overline{AF}:\overline{BF} \implies \overline{AH}:12=12:6 \implies \overline{AH}=24\text{ cm}$이다. $\therefore$ ①



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_SIMILARITY", "conceptClusterKey": "M2-06-RECTANGLE_DOUBLE_SIMILARITY", "primaryMethod": "비례배분으로 BE = 12, CE = 9를 구한 뒤 직각 삼각형 CDE와 BFE의 AA 닮음으로 BF = 6을 구하고, 이어 삼각형 AFH와 BFE의 닮음으로 AH를 구한다.", "decisiveStep": "BF = 6과 AF = 12를 구한 뒤 삼각형 AFH와 BFE의 닮음비 2:1을 적용하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮음의 활용", "l4": "길이"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_SIMILARITY", "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION", "why": "직사각형 내부 연쇄 AA 닮음 적용"}, "crossConceptKeys": ["CC_TRIANGLE_SIMILARITY_AA", "CC_RECTANGLE_PROPERTIES", "CC_RATIO_AND_PROPORTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "선분 비례배분 후 서로 다른 두 쌍의 AA 닮음을 순차적으로 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["직사각형", "비율"], "goal": ["길이"], "method": ["닮음"], "condition": []}, "hold": ""}

```

## Q20
- 형식: 객관식
- 배점: 5
### 발문
정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와 변 $AB$ 위의 점 $E$에 대하여 $\angle ADE=60^\circ$이고 $\overline{BD}:\overline{DC}=3:1$일 때, $\overline{AE}:\overline{EB}$는? [5점]
### 선지
① $10 : 3$ ② $11 : 3$ ③ $13 : 3$ ④ $14 : 3$ ⑤ $15 : 4$
### 정답
③
### 해설
정삼각형 $ABC$에서 $\angle B=\angle C=60^\circ$이다. $\angle BAD=\alpha$라 하면 $\angle CAD=60^\circ-\alpha$이다. $\triangle ABD$의 외각 성질에 의해 $\angle ADC=\angle B+\angle BAD=60^\circ+\alpha$이다. 또 $\triangle ADE$의 외각 성질과 $\angle ADE=60^\circ$에서 $\angle BED=\angle EAD+\angle ADE=\alpha+60^\circ$이다. 따라서 $\angle EBD=\angle DCA=60^\circ$, $\angle BED=\angle CDA=60^\circ+\alpha$이므로 $\triangle EBD \sim \triangle DCA$ (AA 닮음)이다. $\overline{BD}:\overline{DC}=3:1$이므로 $\overline{DC}=1$, $\overline{BD}=3$으로 놓으면 $\overline{CA}=\overline{AB}=4$이다. $\overline{EB}:\overline{DC}=\overline{BD}:\overline{CA} \implies \overline{EB}:1=3:4 \implies \overline{EB}=\dfrac{3}{4}$이다. $\overline{AE}=4-\dfrac{3}{4}=\dfrac{13}{4}$이므로 $\overline{AE}:\overline{EB}=\dfrac{13}{4}:\dfrac{3}{4}=13:3$이다. $\therefore$ ③



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_SIMILARITY", "conceptClusterKey": "M2-06-EQUILATERAL_60_AA_SIMILARITY", "primaryMethod": "정삼각형의 외각과 60도 조건으로 삼각형 EBD와 DCA의 AA 닮음을 증명하고, 변의 비 3:1로 EB와 AE를 구한다.", "decisiveStep": "각 BED = 각 CDA = 60도 + alpha를 유도해 삼각형 EBD ~ DCA를 찾는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "삼각형의 닮음", "l4": "AA"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_SIMILARITY", "templateKey": "TPL_TRIANGLE_SIMILARITY_CRITERIA", "why": "정삼각형 내부 60도 조건을 이용한 AA 닮음 도출"}, "crossConceptKeys": ["CC_TRIANGLE_SIMILARITY_AA", "CC_ANGLE_RELATIONS", "CC_RATIO_AND_PROPORTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B34", "difficultyReason": "문자를 도입해 외각의 합으로 숨은 AA 닮음을 증명한 뒤 비례식으로 변의 비를 계산하는 문항이다.", "level": "상", "item4slot": {"given": ["정삼각형", "각", "비율"], "goal": ["비율"], "method": ["닮음"], "condition": []}, "hold": ""}

```

## Q21
- 형식: 서답형
- 배점: 5
### 발문
[서답형 1] [서술형][수준별 1-①] $\angle B=26^\circ$이고 $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\overline{AC}=\overline{CD}$가 되도록 $\overline{BA}$의 연장선 위에 점 $D$를 잡았다. $\overline{BC}$의 연장선 위의 한 점을 $E$라고 할 때, $\angle DCE$의 크기를 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 1-②] $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$ 모양의 종이를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $E$를 잇는 선분 $DE$를 접는 선으로 하여 점 $A$와 점 $B$가 겹치도록 접었다. $\angle EBC=21^\circ$일 때, $\angle A$의 크기를 구하는 풀이과정과 답을 쓰시오. [5점]
### 선지
없음
### 정답
(1) $78^\circ$ (2) $46^\circ$
### 해설
(1) $\overline{AB}=\overline{AC}$이므로 $\angle BCA=\angle ABC=26^\circ$이고 $\angle BAC=180^\circ-26^\circ\times 2=128^\circ$이다. $B$, $A$, $D$가 한 직선 위에 있으므로 $\angle CAD=180^\circ-128^\circ=52^\circ$이다. $\overline{AC}=\overline{CD}$이므로 $\angle CDA=\angle CAD=52^\circ$이다. $\triangle BCD$의 외각 성질에 의해 $\angle DCE=\angle CBD+\angle BDC=26^\circ+52^\circ=78^\circ$이다. (2) $\angle A=x$라 하면 $\overline{EA}=\overline{EB}$이므로 $\angle ABE=\angle EAB=x$이다. 따라서 $\angle ABC=\angle ABE+\angle EBC=x+21^\circ$이다. 한편 $\overline{AB}=\overline{AC}$이므로 $\angle ABC=\dfrac{180^\circ-x}{2}$이다. $x+21^\circ=\dfrac{180^\circ-x}{2} \implies 2x+42^\circ=180^\circ-x \implies 3x=138^\circ \implies x=46^\circ$이다. $\therefore$ (1) $78^\circ$, (2) $46^\circ$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_EXTERIOR_FOLDING", "primaryMethod": "수준별 (1)은 연쇄 이등변삼각형과 외각 성질을, (2)는 종이접기 합동 EA = EB와 방정식을 이용해 각을 구한다.", "decisiveStep": "(1) 외각 성질로 각 DCE = 26 + 52를 구하고 (2) x + 21 = (180 - x)/2 방정식을 세우는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "이등변삼각형의 밑각·외각 및 접기 성질 활용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_GEOMETRIC_FOLDING", "CC_ALGEBRAIC_MODELING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외각과 연쇄 이등변삼각형 각 추적 또는 종이접기 조건을 일차방정식으로 모델링해야 하는 서술형 문항이다.", "level": "상", "item4slot": {"given": ["이등변삼각형", "접기"], "goal": ["각"], "method": ["방정식"], "condition": []}, "hold": ""}

```

## Q22
- 형식: 서답형
- 배점: 5
### 발문
[서답형 2] [서술형][수준별 2-①] 점 $I$가 $\triangle ABC$의 내심이고 $\angle IAB=x^\circ$, $\angle IBC=28^\circ$, $\angle ICA=34^\circ$일 때, $x$의 값을 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 2-②] 세 점 $A$, $B$, $C$가 점 $O$를 중심으로 하는 원 위에 있고, 점 $O$는 $\triangle ABC$의 내부에 있다. $\angle BAO=26^\circ$, $\angle BCO=19^\circ$, $\overline{OC}=6\text{ cm}$일 때, 호 $AC$와 현 $AC$로 둘러싸인 부분(부채꼴 $OAC$에서 $\triangle OAC$를 제외한 부분)의 넓이를 구하는 풀이과정과 답을 쓰시오. [5점]
### 선지
없음
### 정답
(1) $28$ (2) $(9\pi-18)\text{ cm}^2$
### 해설
(1) 내심 $I$는 세 내각의 이등분선의 교점이므로 $\angle A=2x^\circ$, $\angle B=2\times 28^\circ=56^\circ$, $\angle C=2\times 34^\circ=68^\circ$이다. $2x+56+68=180 \implies 2x=56 \implies x=28$ (2) $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle BAO=26^\circ$, $\angle AOB=180^\circ-26^\circ\times 2=128^\circ$이다. $\overline{OB}=\overline{OC}$이므로 $\angle OBC=\angle BCO=19^\circ$, $\angle BOC=180^\circ-19^\circ\times 2=142^\circ$이다. 따라서 $\angle AOC=360^\circ-128^\circ-142^\circ=90^\circ$이다. 부채꼴 $OAC$의 넓이는 $\pi\times 6^2\times\dfrac{90}{360}=9\pi\text{ cm}^2$, $\triangle OAC$의 넓이는 $\dfrac{1}{2}\times 6\times 6=18\text{ cm}^2$이다. 따라서 구하는 부분의 넓이는 $(9\pi-18)\text{ cm}^2$이다. $\therefore$ (1) $28$, (2) $(9\pi-18)\text{ cm}^2$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_CIRCUMCENTER_SECTOR", "primaryMethod": "수준별 (1)은 내심의 각 이등분 성질을, (2)는 외심에서 이등변삼각형으로 중심각 AOC = 90도를 구해 부채꼴에서 삼각형 넓이를 뺀다.", "decisiveStep": "(2)에서 각 AOB = 128도와 각 BOC = 142도로부터 중심각 AOC = 90도를 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외접원·내접원 활용", "l4": "반지름·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_SEMANTIC", "why": "내심 각 성질 및 외접원 반지름·부채꼴 넓이 결합"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_TRIANGLE_CIRCUMCENTER", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "외심 성질로 두 중심각을 구해 중심각 AOC = 90도를 도출한 뒤 부채꼴과 삼각형 넓이의 차를 구하는 문항이다.", "level": "상", "item4slot": {"given": ["내심", "원", "반지름"], "goal": ["값", "넓이"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}

```

## Q23
- 형식: 서답형
- 배점: 5
### 발문
[서답형 3] [서술형][수준별 3-①] 마름모 $ABCD$에서 두 대각선의 교점을 $O$라 하자. $\overline{AO}=12\text{ cm}$, $\overline{BO}=7\text{ cm}$일 때, 마름모 $ABCD$의 넓이를 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 3-②] 마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:2$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=20\text{ cm}$일 때, $\triangle DBP$의 넓이를 구하는 풀이과정과 답을 쓰시오. [5점]
### 선지
없음
### 정답
(1) $168\text{ cm}^2$ (2) $42\text{ cm}^2$
### 해설
(1) 마름모의 두 대각선은 서로를 이등분하므로 $\overline{AC}=2\times 12=24\text{ cm}$, $\overline{BD}=2\times 7=14\text{ cm}$이다. 따라서 마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 24\times 14=168\text{ cm}^2$이다. (2) 마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 14\times 20=140\text{ cm}^2$이다. 대각선 $BD$는 마름모의 넓이를 이등분하므로 $\triangle DBC=\dfrac{1}{2}\times 140=70\text{ cm}^2$이다. $\triangle DBP$와 $\triangle DPC$는 높이가 같으므로 넓이의 비는 밑변의 비 $\overline{BP}:\overline{PC}=3:2$와 같다. 따라서 $\triangle DBP=70\times\dfrac{3}{3+2}=70\times\dfrac{3}{5}=42\text{ cm}^2$이다. $\therefore$ (1) $168\text{ cm}^2$, (2) $42\text{ cm}^2$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RHOMBUS_AREA_RATIO", "primaryMethod": "마름모의 넓이 공식을 적용하고 (2)에서는 대각선으로 절반을 나눈 뒤 밑변의 비 3:2로 삼각형 DBP의 넓이를 배분한다.", "decisiveStep": "(2)에서 삼각형 DBC 넓이 70에 밑변 비율 3/5을 곱해 42를 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "넓이와 활용", "l4": "분할도형"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "마름모의 넓이와 높이가 같은 삼각형 넓이 비 결합"}, "crossConceptKeys": ["CC_RHOMBUS_PROPERTIES", "CC_AREA_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "마름모 넓이 공식과 높이가 같은 삼각형의 밑변 비례 분할을 순차 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["마름모", "대각선", "비율"], "goal": ["넓이"], "method": ["비례배분"], "condition": []}, "hold": ""}

```

## Q24
- 형식: 서답형
- 배점: 5
### 발문
[서답형 4][서술형] $\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자. $\overline{AB}=20\text{ cm}$, $\overline{BH}=16\text{ cm}$일 때, $\overline{CH}$의 길이를 구하는 풀이과정과 답을 쓰시오. [5점]
### 선지
없음
### 정답
$9\text{ cm}$
### 해설
$\triangle ABH$와 $\triangle CBA$에서 $\angle AHB=\angle CAB=90^\circ$, $\angle B$는 공통이므로 $\triangle ABH \sim \triangle CBA$ (AA 닮음)이다. 대응변의 길이의 비에서 $\overline{BH}:\overline{BA}=\overline{BA}:\overline{BC}$이므로 $16:20=20:\overline{BC} \implies 16\overline{BC}=400 \implies \overline{BC}=25\text{ cm}$이다. $\therefore \overline{CH}=\overline{BC}-\overline{BH}=25-16=9\text{ cm}$ $\therefore 9\text{ cm}$



```json
{"exempt": true, "reason": "STRICT_VARIANT"}

```


```json
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-06", "subUnitKey": "M2-06-TRIANGLE_SIMILARITY", "conceptClusterKey": "M2-06-RIGHT_TRIANGLE_PROJECTION", "primaryMethod": "직각삼각형 ABH와 CBA의 AA 닮음 비례식 BH : BA = BA : BC로 빗변 BC = 25를 구한 뒤 BH = 16을 뺀다.", "decisiveStep": "16 : 20 = 20 : BC에서 BC = 25를 구하고 BC - BH = 9를 계산하는 단계", "rpm": {"majorUnit": "도형의 닮음과 피타고라스 정리", "midUnit": "도형의 닮음", "l3": "닮음의 활용", "l4": "길이"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_SIMILARITY", "templateKey": "TPL_TRIANGLE_SIMILARITY_APPLICATION", "why": "직각삼각형 빗변 수선 닮음 공식 활용"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_SIMILARITY", "CC_TRIANGLE_SIMILARITY_AA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형의 닮음으로 빗변 BC의 길이를 구한 뒤 부분 선분 BH를 빼 CH를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형", "수선"], "goal": ["길이"], "method": ["닮음"], "condition": []}, "hold": ""}

```
