

```
{"stem": "25_삼산중_2학기_중간_중2_유사", "sourceArchiveFile": "original/middle/m2/2mid/25_삼산중_2학기_중간_중2_수학.js", "examFolder": "2mid", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

점 \$I\$가 \$\\triangle ABC\$의 내심이고 \$\\angle A \= 70^\\circ\$, \$\\angle ICB \= 23^\\circ\$이다. 점 \$I\$에서 변 \$BC\$에 내린 수선의 발을 \$D\$라 할 때 \$\\overline{ID} \= 5\\text{ cm}\$이다. \$\\angle IBD\$의 크기와 점 \$I\$에서 변 \$AB\$에 이르는 거리를 바르게 짝지은 것은?

### 선지

① \$32^\\circ,\\ 4\\text{ cm}\$ ② \$28^\\circ,\\ 5\\text{ cm}\$ ③ \$32^\\circ,\\ 5\\text{ cm}\$ ④ \$34^\\circ,\\ 5\\text{ cm}\$ ⑤ \$32^\\circ,\\ 6\\text{ cm}\$

### 정답

③

### 해설

점 \$I\$는 내심이므로 \$\\overline{CI}\$는 \$\\angle C\$를 이등분하여 \$\\angle C \= 2 \\times 23^\\circ \= 46^\\circ\$ \$\\angle B \= 180^\\circ \- (70^\\circ \+ 46^\\circ) \= 64^\\circ\$ \$\\overline{BI}\$는 \$\\angle B\$를 이등분하므로 \$\\angle IBD \= \\dfrac{64^\\circ}{2} \= 32^\\circ\$ 내심에서 세 변까지의 거리는 모두 같으므로 점 \$I\$에서 변 \$AB\$에 이르는 거리는 \$\\overline{ID} \= 5\\text{ cm}\$이다. \$\\therefore\$ ③

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_ANGLE_DIST", "primaryMethod": "내심 각 이등분으로 ∠C = 46°, ∠B = 64°의 절반 32°를 구하고 세 변까지 거리가 같아 5cm임을 찾는다.", "decisiveStep": "∠C = 2×23° = 46°에서 ∠B = 64°를 구해 절반 32°를 얻고 거리 5cm와 짝짓는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "내심과 거리"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "내심의 각 이등분과 변까지 거리 일치 동시 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내심의 두 기본 성질(각의 이등분선, 세 변까지의 거리 일치)을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["내심", "수선의발"], "goal": ["각", "거리"], "method": ["내각"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

점 \$O\$가 예각삼각형 \$ABC\$의 외심이고, 점 \$O\$에서 세 변 \$AB\$, \$BC\$, \$CA\$에 내린 수선의 발을 각각 \$D\$, \$E\$, \$F\$라 할 때, \$\\triangle OAD\$와 항상 합동인 삼각형은?

### 선지

① \$\\triangle OBD\$ ② \$\\triangle OAF\$ ③ \$\\triangle OCF\$ ④ \$\\triangle OCE\$ ⑤ \$\\triangle OBE\$

### 정답

①

### 해설

점 \$O\$는 외심이므로 \$\\overline{OA} \= \\overline{OB}\$이고 \$\\angle ODA \= \\angle ODB \= 90^\\circ\$, \$\\overline{OD}\$는 공통이다. 따라서 \$\\triangle OAD \\equiv \\triangle OBD\$ (\$\\text{RHS}\$ 합동)이다. \$\\therefore\$ ①

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_CONGRUENT_PAIR", "primaryMethod": "외심 성질 OA = OB와 수선 OD 공통, 직각으로 ΔOAD ≡ ΔOBD(RHS 합동)를 찾는다.", "decisiveStep": "외심에서 수선의 발 D를 내렸을 때 변 AB를 공유하는 ΔOBD와 RHS 합동임을 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "수직이등분선과 외심"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "외심 수선의 발이 만드는 합동 삼각형 쌍 찾기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_RIGHT_TRIANGLE_CONGRUENCE_RHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심의 꼭짓점 거리 일치와 수직이등분선 성질로 합동 삼각형을 바로 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["외심", "수선의발"], "goal": ["합동"], "method": ["합동조건"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

다음 \$6\$개의 직각삼각형 ㄱ\~ㅂ 중에서 서로 합동인 것끼리 짝짓고, 그 합동 조건과 바르게 연결한 것은? ㄱ. 빗변의 길이가 \$6\\text{ cm}\$이고, 한 내각의 크기가 \$35^\\circ\$인 직각삼각형 ㄴ. 빗변의 길이가 \$6\\text{ cm}\$이고, 한 직각변의 길이가 \$4\\text{ cm}\$인 직각삼각형 ㄷ. 직각을 낀 두 변의 길이가 각각 \$4\\text{ cm}\$, \$5\\text{ cm}\$인 직각삼각형 ㄹ. 빗변의 길이가 \$6\\text{ cm}\$이고, 한 내각의 크기가 \$55^\\circ\$인 직각삼각형 ㅁ. 빗변의 길이가 \$7\\text{ cm}\$이고, 한 직각변의 길이가 \$4\\text{ cm}\$인 직각삼각형 ㅂ. 직각을 낀 두 변의 길이가 각각 \$3\\text{ cm}\$, \$5\\text{ cm}\$인 직각삼각형

### 선지

① (ㄱ, ㄴ), \$\\text{RHS}\$ 합동 ② (ㄴ, ㅁ), \$\\text{RHS}\$ 합동 ③ (ㄷ, ㅂ), \$\\text{SAS}\$ 합동 ④ (ㄱ, ㄷ), \$\\text{ASA}\$ 합동 ⑤ (ㄱ, ㄹ), \$\\text{RHA}\$ 합동

### 정답

⑤

### 해설

ㄱ의 두 예각은 \$35^\\circ\$, \$55^\\circ\$이고 ㄹ의 두 예각은 \$55^\\circ\$, \$35^\\circ\$이다. 두 직각삼각형 ㄱ과 ㄹ은 빗변의 길이가 \$6\\text{ cm}\$로 같고 한 예각의 크기가 같으므로 \$\\text{RHA}\$ 합동이다. \$\\therefore\$ ⑤

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-FIND_CONGRUENT_RIGHT_TRI", "primaryMethod": "ㄱ의 나머지 예각 90° - 35° = 55°를 구해 빗변 6cm인 ㄹ과 RHA 합동임을 찾는다.", "decisiveStep": "ㄱ의 35°와 ㄹ의 55°가 여각 관계로 같은 예각 쌍임을 확인하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "여러 직각삼각형 중 합동 쌍과 합동 조건 연결 키가 선택표에 없음"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "직각삼각형의 나머지 예각을 구해 빗변과 예각이 같은 RHA 합동 쌍을 찾는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["직각삼각형"], "goal": ["합동"], "method": ["합동조건"], "condition": []}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

\$\\angle A \= 90^\\circ\$인 직각이등변삼각형 \$ABC\$(\$\\overline{AB} \= \\overline{AC}\$)에서 꼭짓점 \$A\$를 지나고 변 \$BC\$와 만나지 않는 직선 \$l\$을 긋고, 두 점 \$B\$, \$C\$에서 직선 \$l\$에 내린 수선의 발을 각각 \$D\$, \$E\$라 하자. \$\\overline{BD} \= 5\\text{ cm}\$, \$\\overline{CE} \= 6\\text{ cm}\$일 때, \$\\triangle ABD \\equiv \\triangle CAE\$의 합동 조건과 \$\\overline{DE}\$의 길이를 바르게 짝지은 것은?

### 선지

① \$\\text{RHS},\\ 11\\text{ cm}\$ ② \$\\text{RHA},\\ 11\\text{ cm}\$ ③ \$\\text{SAS},\\ 11\\text{ cm}\$ ④ \$\\text{RHA},\\ 10\\text{ cm}\$ ⑤ \$\\text{RHS},\\ 10\\text{ cm}\$

### 정답

②

### 해설

\$\\angle ADB \= \\angle CEA \= 90^\\circ\$, \$\\overline{AB} \= \\overline{AC}\$이고 \$\\angle DAB \+ \\angle EAC \= 90^\\circ\$, \$\\angle DAB \+ \\angle ABD \= 90^\\circ \\implies \\angle ABD \= \\angle CAE\$ 따라서 \$\\triangle ABD \\equiv \\triangle CAE\$ (\$\\text{RHA}\$ 합동)이다. \$\\overline{AD} \= \\overline{CE} \= 6\\text{ cm}\$, \$\\overline{AE} \= \\overline{BD} \= 5\\text{ cm}\$이므로 \$\\therefore \\overline{DE} \= \\overline{DA} \+ \\overline{AE} \= 6 \+ 5 \= 11\\text{ (cm)}\$ \$\\therefore\$ ②

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RIGHT_ISOSCELES_LINE_RHA", "primaryMethod": "직선 l 위에서 여각 관계로 ∠ABD = ∠CAE를 보여 RHA 합동을 확인하고 DE = BD + CE = 11cm를 구한다.", "decisiveStep": "∠DAB + ∠EAC = 90°에서 ∠ABD = ∠CAE를 도출해 RHA 합동을 확정하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHA"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직각이등변삼각형 꼭짓점 통과 직선 수선 RHA 합동 키가 선택표에 없음"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각이등변삼각형에서 직선 l에 내린 두 수선 삼각형의 RHA 합동 조건과 대응변 합을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직각이등변삼각형", "수선의발"], "goal": ["합동", "길이"], "method": ["합동조건"], "condition": []}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

예각삼각형 \$ABC\$의 내심 \$I\$에서 세 변 \$AB\$, \$BC\$, \$CA\$에 내린 수선의 발을 각각 \$D\$, \$E\$, \$F\$라 하자. \$\\angle AID : \\angle BIE : \\angle CIF \= 4 : 5 : 6\$일 때, \$\\angle ABC\$의 크기는?

### 선지

① \$48^\\circ\$ ② \$52^\\circ\$ ③ \$56^\\circ\$ ④ \$60^\\circ\$ ⑤ \$64^\\circ\$

### 정답

④

### 해설

\$\\angle AID \= 90^\\circ \- \\dfrac{1}{2}\\angle A\$, \$\\angle BIE \= 90^\\circ \- \\dfrac{1}{2}\\angle B\$, \$\\angle CIF \= 90^\\circ \- \\dfrac{1}{2}\\angle C\$이므로 \$\\angle AID \+ \\angle BIE \+ \\angle CIF \= 270^\\circ \- \\dfrac{1}{2}(\\angle A \+ \\angle B \+ \\angle C) \= 270^\\circ \- 90^\\circ \= 180^\\circ\$ 비가 \$4 : 5 : 6\$이므로 \$\\angle BIE \= 180^\\circ \\times \\dfrac{5}{4 \+ 5 \+ 6} \= 180^\\circ \\times \\dfrac{5}{15} \= 60^\\circ\$ \$90^\\circ \- \\dfrac{1}{2}\\angle ABC \= 60^\\circ \\implies \\dfrac{1}{2}\\angle ABC \= 30^\\circ \\implies \\angle ABC \= 60^\\circ\$ \$\\therefore\$ ④

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_PERP_ANGLE_RATIO", "primaryMethod": "∠AID + ∠BIE + ∠CIF = 180°를 4:5:6으로 비례배분해 ∠BIE = 60°를 구한 뒤 ∠ABC를 역산한다.", "decisiveStep": "세 직각삼각형의 내각 성질로 ∠AID + ∠BIE + ∠CIF = 180°임을 유도하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "내심 수선 각 비례배분으로 원래 삼각형 내각 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_RATIO_AND_PROPORTION"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 내심 수선각의 합이 180°임을 보인 뒤 비례배분하고 다시 절반각 관계로 역산하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["내심", "수선의발", "비율"], "goal": ["각"], "method": ["비례식", "내각"], "condition": []}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 5

### 발문

원 \$I\$는 \$\\triangle ABC\$의 내접원이고 세 변 \$AB\$, \$BC\$, \$CA\$와의 접점이 각각 \$D\$, \$E\$, \$F\$일 때, 다음 \<보기\> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. \$\\overline{BD} \= \\overline{BE}\$ ㄴ. 점 \$I\$는 \$\\triangle ABC\$의 내심이다. ㄷ. 점 \$I\$는 \$\\triangle DEF\$의 외심이다. ㄹ. \$\\overline{AI} \= \\overline{CI}\$

### 선지

① ㄱ, ㄴ, ㄷ ② ㄱ, ㄴ ③ ㄴ, ㄹ ④ ㄱ, ㄷ, ㄹ ⑤ ㄴ, ㄷ, ㄹ

### 정답

①

### 해설

ㄱ. 점 \$B\$에서 원 \$I\$에 그은 두 접선의 길이는 같으므로 \$\\overline{BD} \= \\overline{BE}\$이다. (참) ㄴ. 원 \$I\$가 \$\\triangle ABC\$의 세 변에 접하므로 중심 \$I\$는 \$\\triangle ABC\$의 내심이다. (참) ㄷ. 세 점 \$D\$, \$E\$, \$F\$는 원 \$I\$ 위의 점이므로 \$\\overline{ID} \= \\overline{IE} \= \\overline{IF}\$가 되어 점 \$I\$는 \$\\triangle DEF\$의 외심이다. (참) ㄹ. \$\\overline{AI} \= \\overline{CI}\$는 일반적으로 성립하지 않는다. (거짓) \$\\therefore\$ ①

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCIRCLE_TANGENT_CIRCUM", "primaryMethod": "내접원의 접선 길이 일치(ㄱ), 내심 정의(ㄴ), 접점 삼각형의 외심(ㄷ)을 확인해 ㄹ을 거짓으로 가른다.", "decisiveStep": "ID = IE = IF(내접원의 반지름)이므로 점 I가 ΔDEF의 외심이 됨을 확인하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "내심과 거리"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "내접원과 접점 삼각형 외심 관계 합답형 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_TRIANGLE_CIRCUMCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내접원의 접선 성질과 내심·외심 정의를 결합해 4개 명제의 참거짓을 판별하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["내심"], "goal": ["판정"], "method": ["외심"], "condition": []}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

\$\\overline{AB} \= \\overline{AC}\$인 이등변삼각형 \$ABC\$에서 \$\\angle A\$의 이등분선과 변 \$BC\$의 교점을 \$D\$라 하고, 선분 \$AD\$ 위의 점 \$P\$를 잡을 때, 다음 \<보기\> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. \$\\angle PDC \= 90^\\circ\$ ㄴ. \$\\triangle BPC\$는 이등변삼각형이다. ㄷ. \$\\angle ACP \= \\angle PCD\$이면 점 \$P\$는 \$\\triangle ABC\$의 내심이다.

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄴ, ㄷ ④ ㄱ, ㄷ ⑤ ㄴ, ㄷ

### 정답

③

### 해설

ㄱ. 이등변삼각형의 꼭짓각 \$A\$의 이등분선은 밑변 \$BC\$를 수직이등분하므로 \$\\angle PDC \= 90^\\circ\$이다. (참) ㄴ. \$AD\$는 \$\\overline{BC}\$의 수직이등분선이므로 \$\\overline{PB} \= \\overline{PC}\$가 되어 \$\\triangle BPC\$는 이등변삼각형이다. (참) ㄷ. \$AP\$가 \$\\angle A\$를 이등분하고 \$CP\$가 \$\\angle C\$를 이등분하므로 두 내각의 이등분선의 교점 \$P\$는 \$\\triangle ABC\$의 내심이다. (참) \$\\therefore\$ ③

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_BISECTOR_PT_P", "primaryMethod": "꼭짓각 이등분선 AD가 밑변의 수직이등분선임을 이용해 ㄱ, ㄴ과 내심 조건 ㄷ이 모두 참임을 판별한다.", "decisiveStep": "AD가 ∠A를 이등분하고 CP가 ∠C를 이등분하면 교점 P가 내심이 됨을 확인하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "꼭짓각의 이등분선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "이등변삼각형 꼭짓각 이등분선 위 점 P 성질 합답형 키가 선택표에 없음"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_INCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형의 수직이등분선 성질과 내심의 정의를 결합해 3개 보기를 판별하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["판정"], "method": ["수직이등분선"], "condition": []}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

다음 \<보기\> 중에서 사각형 \$ABCD\$가 평행사변형인 것만을 있는 대로 고른 것은? (단, 점 \$O\$는 두 대각선의 교점이다.) 〈보기〉 ㄱ. \$\\overline{AB} \= \\overline{BC} \= 6\\text{ cm},\\ \\overline{CD} \= \\overline{DA} \= 8\\text{ cm}\$ ㄴ. \$\\overline{AD} \\parallel \\overline{BC},\\ \\angle OAD \= \\angle ODA\$ ㄷ. \$\\angle ABD \= \\angle BDC,\\ \\angle ACB \= \\angle DAC\$ ㄹ. \$\\overline{AB} \= \\overline{CD},\\ \\angle ABC \+ \\angle BCD \= 180^\\circ\$

### 선지

① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ

### 정답

⑤

### 해설

ㄱ. 이웃한 두 쌍의 변이 각각 같은 연꼴이므로 평행사변형이 아니다. ㄴ. \$\\overline{AD} \\parallel \\overline{BC}\$와 \$\\overline{OA} \= \\overline{OD}\$만으로는 평행사변형임을 보장하지 못한다. ㄷ. 엇각이 각각 같으므로 \$\\overline{AB} \\parallel \\overline{CD}\$, \$\\overline{AD} \\parallel \\overline{BC}\$가 되어 평행사변형이다. ㄹ. \$\\angle ABC \+ \\angle BCD \= 180^\\circ\$이므로 \$\\overline{AB} \\parallel \\overline{CD}\$이고 \$\\overline{AB} \= \\overline{CD}\$이므로 평행사변형이다. \$\\therefore\$ ⑤

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_COND_MULTI", "primaryMethod": "각 보기의 엇각·동측내각 조건을 평행으로 환산해 평행사변형 5가지 조건과 대조하여 ㄷ, ㄹ을 고른다.", "decisiveStep": "ㄹ의 ∠ABC + ∠BCD = 180°가 AB ∥ CD를 뜻해 한 쌍 대변 평행·일치 조건이 성립함을 확인하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 판정 조건 합답형 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "엇각과 동측내각 합 조건을 평행 관계로 변환해 평행사변형 판정 조건을 확인하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["사각형"], "goal": ["판정"], "method": ["평행사변형", "엇각"], "condition": []}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

평행사변형 \$ABCD\$에서 \$\\angle CAD\$의 이등분선과 변 \$BC\$의 연장선이 만나는 점을 \$E\$라 하자. \$\\angle B \= 72^\\circ\$, \$\\angle ACD \= 44^\\circ\$일 때, \$\\angle E\$의 크기는?

### 선지

① \$28^\\circ\$ ② \$32^\\circ\$ ③ \$34^\\circ\$ ④ \$36^\\circ\$ ⑤ \$40^\\circ\$

### 정답

②

### 해설

평행사변형에서 이웃한 두 각의 합은 \$180^\\circ\$이므로 \$\\angle BCD \= 180^\\circ \- 72^\\circ \= 108^\\circ\$ \$\\angle ACB \= \\angle BCD \- \\angle ACD \= 108^\\circ \- 44^\\circ \= 64^\\circ\$ \$\\overline{AD} \\parallel \\overline{BC}\$이므로 엇각으로 \$\\angle CAD \= \\angle ACB \= 64^\\circ\$ \$\\overline{AE}\$가 \$\\angle CAD\$의 이등분선이므로 \$\\angle DAE \= \\dfrac{64^\\circ}{2} \= 32^\\circ\$ \$\\overline{AD} \\parallel \\overline{BE}\$이므로 엇각으로 \$\\therefore \\angle E \= \\angle DAE \= 32^\\circ\$ \$\\therefore\$ ②

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_EXT_BISECTOR", "primaryMethod": "∠BCD = 108°에서 ∠ACB = 64°를 구한 뒤 엇각과 각의 이등분선을 이용해 ∠E = 32°를 계산한다.", "decisiveStep": "∠ACB = 64°를 구해 엇각 ∠CAD = 64°의 절반 32°를 ∠E로 옮기는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 대각선 반각 이등분선과 연장선 교점 각 키가 선택표에 없음"}, "crossConceptKeys": ["CC_ALTERNATE_INTERIOR_ANGLES", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "평행사변형의 이웃각 합과 두 번의 평행선 엇각, 각의 이등분선을 연결하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "각이등분선"], "goal": ["각"], "method": ["엇각"], "condition": []}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 5

### 발문

마름모 \$ABCD\$에서 \$\\overline{AC} \= 16\\text{ cm}\$, \$\\overline{BD} \= 15\\text{ cm}\$이고, 변 \$BC\$ 위의 점 \$P\$에 대하여 \$\\overline{BP} : \\overline{PC} \= 2 : 3\$일 때, \$\\triangle DBP\$의 넓이는?

### 선지

① \$18\\text{ cm}^2\$ ② \$20\\text{ cm}^2\$ ③ \$22\\text{ cm}^2\$ ④ \$24\\text{ cm}^2\$ ⑤ \$30\\text{ cm}^2\$

### 정답

④

### 해설

마름모 \$ABCD\$의 넓이는 \$\\dfrac{1}{2} \\times 16 \\times 15 \= 120\\text{ (cm}^2\\text{)}\$ 대각선 \$BD\$는 마름모의 넓이를 이등분하므로 \$\\triangle BCD \= \\dfrac{1}{2} \\times 120 \= 60\\text{ (cm}^2\\text{)}\$ \$\\triangle DBP\$와 \$\\triangle DPC\$는 높이가 같고 밑변의 비가 \$\\overline{BP} : \\overline{PC} \= 2 : 3\$이므로 \$\\therefore \\triangle DBP \= 60 \\times \\dfrac{2}{2 \+ 3} \= 24\\text{ (cm}^2\\text{)}\$ \$\\therefore\$ ④

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RHOMBUS_RATIO_AREA", "primaryMethod": "마름모 넓이 120의 절반 ΔBCD = 60에 밑변 비 2:3을 적용해 ΔDBP = 24를 구한다.", "decisiveStep": "ΔBCD = 60을 밑변 비 2 : 3으로 비례배분해 60 × 2/5 = 24를 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "마름모 대각선 넓이와 변 내분비 삼각형 넓이 키가 선택표에 없음"}, "crossConceptKeys": ["CC_RHOMBUS_PROPERTIES", "CC_AREA_RATIO"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "마름모 넓이 공식과 높이가 같은 삼각형의 밑변 비 넓이 분할을 차례로 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["마름모", "비율"], "goal": ["넓이"], "method": ["공식", "비례식"], "condition": []}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

반지름의 길이가 \$7\\text{ cm}\$인 원 \$O\$의 중심 \$O\$를 한 꼭짓점으로 하고, 꼭짓점 \$B\$가 원 \$O\$ 위에 있는 직사각형 \$OABC\$에서 대각선 \$\\overline{AC}\$의 길이는?

### 선지

① \$7\\text{ cm}\$ ② \$3.5\\text{ cm}\$ ③ \$5\\text{ cm}\$ ④ \$10\\text{ cm}\$ ⑤ \$14\\text{ cm}\$

### 정답

①

### 해설

점 \$B\$는 반지름의 길이가 \$7\\text{ cm}\$인 원 \$O\$ 위의 점이므로 \$\\overline{OB} \= 7\\text{ cm}\$이다. 직사각형 \$OABC\$의 두 대각선의 길이는 같으므로 \$\\overline{AC} \= \\overline{OB} \= 7\\text{ cm}\$이다. \$\\therefore\$ ①

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RECT_IN_CIRCLE_DIAG", "primaryMethod": "원 O 위의 점 B까지의 거리 OB가 원의 반지름 7cm임과 직사각형 대각선 길이 일치를 연결한다.", "decisiveStep": "OB가 원의 반지름이고 직사각형의 대각선 AC = OB임을 파악하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "원 위의 점을 꼭짓점으로 하는 직사각형 대각선 길이 키가 선택표에 없음"}, "crossConceptKeys": ["CC_RECTANGLE_PROPERTIES", "CC_DIAGONALS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원의 반지름과 직사각형 두 대각선 길이 일치 성질을 바로 연결하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["직사각형", "대각선"], "goal": ["길이"], "method": ["등식의성질"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

사각형을 분류하는 순서도에서 조건 (가)에 ‘예’이면 평행사변형·직사각형·마름모·정사각형으로 이어지고, 이 네 사각형을 조건 (나)로 나누어 ‘예’이면 직사각형·정사각형, ‘아니오’이면 평행사변형·마름모로 분류된다. 또 조건 (가)에 ‘아니오’인 사각형을 조건 (다)로 나누어 ‘예’이면 사다리꼴, ‘아니오’이면 그 외의 사각형으로 분류된다. (가), (나), (다)에 들어갈 알맞은 조건을 \<보기\>에서 고른 것은? 〈보기〉 ㄱ. 두 대각선의 길이가 같은가? ㄴ. 두 대각선이 서로 다른 것을 이등분하는가? ㄷ. 한 쌍의 대변이 평행한가?

### 선지

① (가) ㄱ, (나) ㄴ, (다) ㄷ ② (가) ㄴ, (나) ㄱ, (다) ㄷ ③ (가) ㄱ, (나) ㄷ, (다) ㄴ ④ (가) ㄴ, (나) ㄷ, (다) ㄱ ⑤ (가) ㄷ, (나) ㄱ, (다) ㄴ

### 정답

②

### 해설

평행사변형·직사각형·마름모·정사각형은 모두 두 대각선이 서로 다른 것을 이등분하므로 (가)는 ㄴ이다. 이 중 직사각형과 정사각형은 두 대각선의 길이가 같으므로 (나)는 ㄱ이다. 평행사변형이 아닌 사각형 중 사다리꼴을 구분하는 조건은 한 쌍의 대변이 평행한지 여부이므로 (다)는 ㄷ이다. \$\\therefore\$ ②

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-QUAD_FLOWCHART_CLASSIFY", "primaryMethod": "분류 결과 도형 집합을 보고 대각선 이등분(가=ㄴ), 대각선 길이 일치(나=ㄱ), 한 쌍 평행(다=ㄷ)을 역으로 찾는다.", "decisiveStep": "평행사변형·직사각형·마름모·정사각형 공통 성질로 (가) = ㄴ을 먼저 확정하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "성질 비교"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "사각형 분류 순서도 조건 매칭 키가 선택표에 없음"}, "crossConceptKeys": ["CC_QUADRILATERAL_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사각형의 포함 관계와 대각선·평행 성질을 분류 기준에 맞게 연결하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["사각형"], "goal": ["조건"], "method": ["분류"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

\$\\overline{BD} \= 14\\text{ cm}\$인 정사각형 \$ABCD\$의 두 대각선의 교점을 \$O\$라 하고, 대각선 \$AC\$ 위의 한 점 \$P\$에 대하여 \$\\overline{AO} \= x\\text{ cm}\$, \$\\angle DPO \= 58^\\circ\$, \$\\angle PDC \= y^\\circ\$라 할 때, \$x \+ y\$의 값은?

### 선지

① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$

### 정답

⑤

### 해설

정사각형의 두 대각선은 길이가 같고 서로 다른 것을 수직이등분하므로 \$x \= \\overline{AO} \= \\dfrac{1}{2}\\overline{AC} \= \\dfrac{1}{2}\\overline{BD} \= 7\$ \$\\triangle DOP\$에서 \$\\angle DOP \= 90^\\circ\$, \$\\angle DPO \= 58^\\circ\$이므로 \$\\angle ODP \= 90^\\circ \- 58^\\circ \= 32^\\circ\$ 정사각형의 대각선 \$BD\$는 \$\\angle ADC \= 90^\\circ\$를 이등분하므로 \$\\angle ODC \= 45^\\circ\$ 따라서 \$y \= \\angle PDC \= 45^\\circ \- 32^\\circ \= 13\$ \$\\therefore x \+ y \= 7 \+ 13 \= 20\$ \$\\therefore\$ ⑤

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-SQUARE_DIAG_LEN_ANGLE", "primaryMethod": "정사각형 대각선 수직이등분으로 x = 7과 ∠ODP = 32°를 구하고 45° - 32° = 13을 더한다.", "decisiveStep": "∠DOP = 90°에서 ∠ODP = 32°를 구한 뒤 ∠ODC = 45°에서 빼서 y = 13을 얻는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정사각형 대각선 반쪽 길이와 내부 각도 합산 키가 선택표에 없음"}, "crossConceptKeys": ["CC_SQUARE_PROPERTIES", "CC_DIAGONALS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정사각형 대각선의 길이 일치·수직이등분·내각 이등분 성질을 함께 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["정사각형", "대각선"], "goal": ["합"], "method": ["내각"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

평행사변형 \$ABCD\$에서 두 변 \$AB\$, \$CD\$의 중점을 각각 \$M\$, \$N\$이라 하자. \$\\angle BNC \= 46^\\circ\$, \$\\angle ADM \= 22^\\circ\$일 때, \$\\angle BMD\$의 크기는?

### 선지

① \$118^\\circ\$ ② \$126^\\circ\$ ③ \$134^\\circ\$ ④ \$136^\\circ\$ ⑤ \$144^\\circ\$

### 정답

③

### 해설

평행사변형 \$ABCD\$에서 \$\\overline{AB} \= \\overline{CD}\$, \$\\overline{AD} \= \\overline{BC}\$, \$\\angle A \= \\angle C\$이다. \$M\$, \$N\$은 각각 \$\\overline{AB}\$, \$\\overline{CD}\$의 중점이므로 \$\\overline{AM} \= \\overline{CN}\$이다. 따라서 \$\\triangle AMD \\equiv \\triangle CNB\$ (\$\\text{SAS}\$ 합동)이므로 \$\\angle AMD \= \\angle CNB \= 46^\\circ\$ \$A\$, \$M\$, \$B\$가 한 직선 위에 있으므로 \$\\therefore \\angle BMD \= 180^\\circ \- 46^\\circ \= 134^\\circ\$ \$\\therefore\$ ③

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_MIDPOINT_SAS", "primaryMethod": "ΔAMD ≡ ΔCNB(SAS 합동)로 ∠AMD = 46°를 구한 뒤 평각 180°에서 빼서 ∠BMD = 134°를 계산한다.", "decisiveStep": "중점 조건 AM = CN과 대변·대각 일치로 ΔAMD ≡ ΔCNB(SAS 합동)를 보이는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 중점 SAS 합동으로 외각 구하기 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_TRIANGLE_CONGRUENCE_SAS"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형의 대변·대각 성질로 SAS 합동을 증명한 뒤 보각을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "중점"], "goal": ["각"], "method": ["합동조건", "평각"], "condition": []}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

민수는 \$50\$원, \$100\$원, \$500\$원짜리 동전을 각각 \$5\$개씩 갖고 있다. 가게에서 \$700\$원짜리 빵을 살 때, 거스름돈 없이 그 값을 지불하는 모든 방법의 수는?

### 선지

① \$1\$가지 ② \$2\$가지 ③ \$3\$가지 ④ \$4\$가지 ⑤ \$5\$가지

### 정답

④

### 해설

\$50\$원, \$100\$원, \$500\$원짜리 동전의 개수를 각각 \$x\$, \$y\$, \$z\$개라 하면 \$50x \+ 100y \+ 500z \= 700 \\implies x \+ 2y \+ 10z \= 14\$ (\$0 \\le x, y, z \\le 5\$) (1) \$z \= 0\$일 때: \$x \+ 2y \= 14 \\implies (x, y) \= (4, 5)\$의 \$1\$가지 (\$y \\le 5\$, \$x \\le 5\$) (2) \$z \= 1\$일 때: \$x \+ 2y \= 4 \\implies (x, y) \= (4, 0), (2, 1), (0, 2)\$의 \$3\$가지 따라서 구하는 방법의 수는 \$1 \+ 3 \= 4\$가지이다. \$\\therefore\$ ④

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-COIN_PAYMENT_WAYS", "primaryMethod": "500원 동전 개수 z = 0, 1로 경우를 나누어 각 동전 5개 이하 조건을 만족하는 순서쌍 (x, y)를 센다.", "decisiveStep": "z = 0일 때 x ≤ 5 제한 때문에 (6, 4)가 제외되고 (4, 5)만 가능함을 걸러내는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "합의 법칙과 곱의 법칙", "l4": "중복 없이 세기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "개수 상한이 있는 동전 지불 방법의 수 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": ["COND_UPPER_BOUND"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "가장 큰 단위의 동전부터 경우를 나누고 보유 개수 상한(5개) 조건을 확인해 세는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["조건"], "goal": ["개수"], "method": ["분류"], "condition": ["정수"]}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

\$0\$, \$1\$, \$2\$, \$3\$, \$4\$, \$5\$, \$6\$이 각각 하나씩 적힌 카드 \$7\$장이 있다. 이 중에서 두 장을 뽑아 두 자리 자연수를 만들 때, 만들 수 있는 두 자리 자연수 중에서 \$2\$의 배수의 개수는?

### 선지

① \$18\$개 ② \$21\$개 ③ \$22\$개 ④ \$24\$개 ⑤ \$25\$개

### 정답

②

### 해설

\$2\$의 배수가 되려면 일의 자리 숫자가 \$0\$, \$2\$, \$4\$, \$6\$ 중 하나여야 한다. (1) 일의 자리가 \$0\$인 경우: 십의 자리는 \$1, 2, 3, 4, 5, 6\$의 \$6\$가지 (2) 일의 자리가 \$2\$, \$4\$, \$6\$ 중 하나인 경우: 십의 자리는 \$0\$과 일의 자리 숫자를 제외한 \$5\$가지씩이므로 \$3 \\times 5 \= 15\$가지 따라서 \$6 \+ 15 \= 21\$개이다. \$\\therefore\$ ②

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-TWO_DIGIT_EVEN_COUNT", "primaryMethod": "일의 자리가 0인 경우(6개)와 2, 4, 6인 경우(각 5개)로 나누어 십의 자리에 0이 못 오는 조건을 적용해 합산한다.", "decisiveStep": "일의 자리가 0일 때와 0이 아닌 짝수(2, 4, 6)일 때를 분리해 세는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "배열과 선택", "l4": "순서가 있는 경우"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "0 포함 카드 두 자리 짝수 개수 세기 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": ["COND_DIVISIBILITY", "COND_DISTINCT_DIGITS"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0을 포함한 숫자 카드로 짝수 두 자리 수를 만들 때 일의 자리 0 포함 여부에 따라 경우를 나누는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["조건"], "goal": ["개수"], "method": ["분류"], "condition": ["짝수"]}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 3

### 발문

두 사람이 가위바위보를 한 번 할 때, 첫 번째 사람이 지지 않는 경우의 수는?

### 선지

① \$6\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$9\$

### 정답

①

### 해설

첫 번째 사람이 이기는 경우는 (가위, 보), (바위, 가위), (보, 바위)의 \$3\$가지이고, 비기는 경우는 (가위, 가위), (바위, 바위), (보, 보)의 \$3\$가지이다. 따라서 첫 번째 사람이 지지 않는 경우의 수는 \$3 \+ 3 \= 6\$이다. \$\\therefore\$ ①

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-RPS_NOT_LOSE", "primaryMethod": "첫 번째 사람이 이기는 3가지와 비기는 3가지를 합하여 6가지를 구한다.", "decisiveStep": "지지 않는 경우가 이기는 경우(3)와 비기는 경우(3)의 합임을 확인하는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "합의 법칙과 곱의 법칙", "l4": "중복 없이 세기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "가위바위보 특정 결과 경우의 수 세기 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 사람의 가위바위보에서 이기거나 비기는 경우를 바로 세어 더하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["조건"], "goal": ["개수"], "method": ["분류"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 3

### 발문

처음 만난 다섯 명의 학생이 서로 한 번씩 악수를 할 때, 악수의 총 횟수는?

### 선지

① \$5\$회 ② \$6\$회 ③ \$8\$회 ④ \$10\$회 ⑤ \$20\$회

### 정답

④

### 해설

\$5\$명 중에서 악수할 \$2\$명을 순서 없이 뽑는 경우의 수와 같으므로 \$\\dfrac{5 \\times 4}{2} \= 10\$회 \$\\therefore\$ ④

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-HANDSHAKE_COUNT", "primaryMethod": "5명 중 2명을 순서 없이 고르는 경우의 수 5×4/2 = 10을 계산한다.", "decisiveStep": "악수는 순서가 없으므로 5×4를 2로 나누는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "배열과 선택", "l4": "순서가 없는 경우"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "악수 총 횟수(대표 2명 뽑기) 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순서 없는 2명 선택 공식을 바로 적용해 악수 횟수를 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["조건"], "goal": ["개수"], "method": ["공식"], "condition": []}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

어느 반에서 남학생 후보 \$5\$명과 여학생 후보 \$3\$명 중에서 대표를 뽑으려 한다. 다음 두 상황의 경우의 수를 각각 구하여 합한 값은? (1) 남학생 후보 또는 여학생 후보 중에서 \$1\$명을 대표로 뽑는 경우의 수 (2) 후보들 중에서 남학생 대표 \$1\$명, 여학생 대표 \$1\$명을 뽑는 경우의 수

### 선지

① \$19\$ ② \$21\$ ③ \$23\$ ④ \$25\$ ⑤ \$27\$

### 정답

③

### 해설

(1) 합의 법칙에 의하여 \$5 \+ 3 \= 8\$가지 (2) 곱의 법칙에 의하여 \$5 \\times 3 \= 15\$가지 따라서 두 경우의 수의 합은 \$8 \+ 15 \= 23\$이다. \$\\therefore\$ ③

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-SUM_AND_PRODUCT_RULE", "primaryMethod": "(1)은 합의 법칙 5 + 3 = 8, (2)는 곱의 법칙 5 × 3 = 15로 구해 두 값을 더한다.", "decisiveStep": "(1) '또는' 1명 선택에는 합의 법칙, (2) 동시 1명씩 선택에는 곱의 법칙을 구분 적용하는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "합의 법칙과 곱의 법칙", "l4": "단계별 선택"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "합의 법칙과 곱의 법칙 결과 합산 비교 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대표 뽑기에서 합의 법칙과 곱의 법칙을 각각 바로 적용해 합산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["조건"], "goal": ["합"], "method": ["분류"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4

### 발문

집에서 학교까지 가는 길은 \$3\$가지, 학교에서 도서관까지 가는 길은 \$4\$가지, 집에서 학교를 거치지 않고 도서관으로 바로 가는 길은 \$3\$가지가 있다. 집에서 출발하여 도서관으로 가는 모든 경우의 수는? (단, 같은 지점을 두 번 이상 지나지 않는다.)

### 선지

① \$10\$가지 ② \$11\$가지 ③ \$12\$가지 ④ \$14\$가지 ⑤ \$15\$가지

### 정답

⑤

### 해설

(1) 학교를 거쳐 도서관으로 가는 경우: \$3 \\times 4 \= 12\$가지 (2) 집에서 도서관으로 바로 가는 경우: \$3\$가지 두 경우는 동시에 일어나지 않으므로 전체 경우의 수는 \$12 \+ 3 \= 15\$가지이다. \$\\therefore\$ ⑤

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-ROUTE_COUNTING", "primaryMethod": "학교 경유 3×4 = 12가지와 직행 3가지를 합의 법칙으로 더해 15가지를 구한다.", "decisiveStep": "경유 경로의 곱의 법칙(12)과 직행 경로(3)를 합의 법칙으로 합치는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "도형·경로", "l4": "최단경로"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "경유 경로와 직행 경로 경우의 수 합산 키가 선택표에 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱의 법칙과 합의 법칙을 차례로 적용해 경로의 수를 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["조건"], "goal": ["개수"], "method": ["분류"], "condition": []}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

\$\\overline{AB} \= \\overline{BC}\$인 이등변삼각형 \$ABC\$에서 \$\\angle C\$의 이등분선과 변 \$AB\$의 교점을 \$D\$라고 하자. \$\\overline{BD} \= 7\\text{ cm}\$, \$\\angle DBC \= 36^\\circ\$일 때, 다음 물음에 답하시오. (1) 이등변삼각형이 되는 조건을 한 문장으로 서술하시오. (2) (1)의 내용을 이용하여 \$\\overline{AC}\$의 길이를 구하는 과정을 서술하시오.

### 선지

없음

### 정답

(1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다. (2) \$7\\text{ cm}\$

### 해설

(1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다. (2) \$\\overline{AB} \= \\overline{BC}\$이고 \$\\angle B \= \\angle DBC \= 36^\\circ\$이므로 \$\\angle A \= \\angle ACB \= \\dfrac{180^\\circ \- 36^\\circ}{2} \= 72^\\circ\$ \$\\overline{CD}\$가 \$\\angle ACB\$의 이등분선이므로 \$\\angle BCD \= \\angle ACD \= 36^\\circ\$ \$\\triangle BCD\$에서 \$\\angle B \= \\angle BCD \= 36^\\circ\$이므로 \$\\overline{CD} \= \\overline{BD} \= 7\\text{ cm}\$ \$\\triangle ACD\$에서 \$\\angle ADC \= 180^\\circ \- (72^\\circ \+ 36^\\circ) \= 72^\\circ\$이므로 \$\\angle A \= \\angle ADC \= 72^\\circ\$ \$\\therefore \\overline{AC} \= \\overline{CD} \= 7\\text{ cm}\$

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-36_72_72_ISOSCELES", "primaryMethod": "36°-72°-72° 이등변삼각형 성질로 ΔBCD와 ΔACD가 모두 이등변삼각형임을 보여 AC = CD = BD = 7cm를 구한다.", "decisiveStep": "∠A = ∠ADC = 72°임을 확인해 AC = CD = 7cm로 연결하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 판정", "l4": "두 각 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "36-72-72 이등변삼각형 각 이등분선 변 길이 서술 키가 선택표에 없음"}, "crossConceptKeys": ["CC_ISOSCELES_CONVERSE", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "이등변삼각형이 되는 조건을 서술하고 연쇄 두 삼각형의 각을 구해 변 길이를 옮기는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["길이"], "method": ["내각"], "condition": []}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 4

### 발문

다음 (1), (2)의 조건을 만족시키는 사각형 \$ABCD\$가 평행사변형이 되는 이유를 각각 서술하시오. (단, 점 \$O\$는 두 대각선 \$AC\$, \$BD\$의 교점이며 평행사변형이 되는 조건으로 답한다.) (1) \$\\overline{OA} \= \\overline{OC} \= 5\\text{ cm}\$, \$\\overline{OB} \= \\overline{OD} \= 6\\text{ cm}\$ (2) \$\\overline{AB} \= \\overline{CD} \= 7\\text{ cm}\$, \$\\overline{AD} \= \\overline{BC} \= 9\\text{ cm}\$

### 선지

없음

### 정답

(1) 두 대각선이 서로 다른 것을 이등분한다. (2) 두 쌍의 대변의 길이가 각각 같다.

### 해설

(1) 두 대각선 \$AC\$와 \$BD\$가 교점 \$O\$에서 서로 다른 것을 이등분(\$\\overline{OA} \= \\overline{OC}\$, \$\\overline{OB} \= \\overline{OD}\$)하므로 평행사변형이다. (2) 두 쌍의 대변의 길이가 각각 같으므로(\$\\overline{AB} \= \\overline{CD}\$, \$\\overline{AD} \= \\overline{BC}\$) 평행사변형이다.

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_REASON_WRITE", "primaryMethod": "주어진 길이 등식을 평행사변형이 되는 조건인 대각선 이등분과 두 쌍 대변 길이 일치로 서술한다.", "decisiveStep": "(1) OA=OC, OB=OD가 대각선 이등분, (2) AB=CD, AD=BC가 대변 길이 일치임을 서술하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "대각선 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 판정 조건 서술형 키가 선택표에 없음"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제시된 변과 대각선 조건에 대응하는 평행사변형 판정 조건을 바로 서술하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["사각형", "대각선"], "goal": ["조건"], "method": ["평행사변형"], "condition": []}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

한 개의 주사위를 두 번 던져서 첫 번째에 나온 눈의 수를 \$a\$, 두 번째에 나온 눈의 수를 \$b\$라 하자. 직선 \$y \= ax \+ b\$가 점 \$(-1, 3)\$을 지나는 경우를 모두 나열하고 모든 경우의 수를 구하시오.

### 선지

없음

### 정답

\$(1, 4), (2, 5), (3, 6)\$, \$3\$가지

### 해설

직선 \$y \= ax \+ b\$가 점 \$(-1, 3)\$을 지나므로 \$3 \= \-a \+ b \\implies b \= a \+ 3\$ \$a\$, \$b\$는 \$1\$ 이상 \$6\$ 이하의 자연수이므로 \$a \= 1\$일 때 \$b \= 4\$ \$a \= 2\$일 때 \$b \= 5\$ \$a \= 3\$일 때 \$b \= 6\$ \$a \\ge 4\$일 때 \$b \\ge 7\$이므로 주사위 눈의 범위를 벗어난다. 따라서 \$(a, b)\$는 \$(1, 4)\$, \$(2, 5)\$, \$(3, 6)\$의 \$3\$가지이다.

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-08", "subUnitKey": "M2-08-PROBABILITY_COUNTING", "conceptClusterKey": "M2-08-DICE_LINE_POINT", "primaryMethod": "점 (-1, 3)을 직선 y = ax + b에 대입해 b = a + 3을 얻고 1 ≤ a, b ≤ 6인 순서쌍 3개를 찾는다.", "decisiveStep": "b = a + 3에서 a = 1, 2, 3일 때만 b ≤ 6을 만족함을 확인하는 단계", "rpm": {"majorUnit": "확률", "midUnit": "경우의 수", "l3": "합의 법칙과 곱의 법칙", "l4": "중복 없이 세기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주사위 눈 일차함수 지나는 점 경우의 수 키가 선택표에 없음"}, "crossConceptKeys": ["CC_POINT_SUBSTITUTION", "CC_LINEAR_FUNCTIONS"], "conditionKeys": ["COND_UPPER_BOUND"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점의 좌표를 일차함수 식에 대입한 뒤 주사위 눈 범위(1~6)에 맞는 순서쌍을 나열하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수"], "goal": ["개수"], "method": ["대입"], "condition": ["자연수"]}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 6

### 발문

지수는 지도에서 한 직선 위에 있지 않은 세 지점(우체국, 서점, 공원)으로부터 같은 거리에 있는 지점에 약속 장소를 정하려고 한다. 지도에 표시된 도서관, 시청, 미술관 중 도서관이 세 지점을 꼭짓점으로 하는 삼각형의 세 변의 수직이등분선의 교점 위에 있을 때, 다음 물음에 답하시오. (1) 지수가 찾는 약속 장소는 어디인지 쓰시오. (2) 그 지점에 해당하는 수학 용어를 쓰고, 그 지점을 작도할 때 필요한 각도·방법과 그 수학 용어와 관련된 성질을 \$1\$가지 서술하시오.

### 선지

없음

### 정답

(1) 도서관, (2) 외심, \$90^\\circ\$로 세 변의 수직이등분선을 작도하며 외심에서 삼각형의 세 꼭짓점까지의 거리는 같다.

### 해설

(1) 세 지점으로부터 같은 거리에 있는 점은 삼각형의 외심이므로 도서관이다. (2) 수학 용어는 외심이다. 각 변의 중점을 지나고 변과 \$90^\\circ\$를 이루는 수직이등분선을 작도하여 그 교점을 찾는다. 외심에서 삼각형의 세 꼭짓점까지의 거리는 모두 같다.

```
{"exempt": true, "reason": "STRICT_VARIANT"}
```

```
{"sourceQid": "24", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_REAL_LIFE", "primaryMethod": "세 지점(꼭짓점)으로부터 같은 거리에 있는 점이 외심임을 파악하고 90° 수직이등분선 작도와 성질을 서술한다.", "decisiveStep": "세 꼭짓점에서 같은 거리 조건을 외심의 정의와 90° 수직이등분선 작도로 연결하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "수직이등분선과 외심"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "실생활 지도 외심 위치 찾기와 작도·성질 서술 키가 선택표에 없음"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "실생활 상황에서 외심의 정의와 작도 방법(90° 수직이등분선), 성질을 서술하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["수직이등분선"], "goal": ["외심"], "method": ["외심"], "condition": []}, "hold": ""}
```

