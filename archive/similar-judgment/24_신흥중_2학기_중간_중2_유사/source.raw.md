{"stem": "24_신흥중_2학기_중간_중2_유사", "sourceArchiveFile": "original/middle/m2/2mid/24_신흥중_2학기_중간_중2_수학.js", "examFolder": "2mid", "grade": "중2", "curriculum": "2015", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-17"}
Q01
* 형식: 객관식
* 배점: 4
발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 변 $BC$의 연장선 위의 점 $D$에 대하여 $\angle ACD=122^\circ$일 때, $\angle A$의 크기는? [4점]
선지
① $58^\circ$ ② $61^\circ$ ③ $64^\circ$ ④ $68^\circ$ ⑤ $72^\circ$
정답
③
해설
$\angle ACB=180^\circ-\angle ACD=180^\circ-122^\circ=58^\circ$이다. $\overline{AB}=\overline{AC}$이므로 $\angle B=\angle ACB=58^\circ$이다. $\therefore \angle A=180^\circ-58^\circ-58^\circ=64^\circ$ $\therefore$ ③


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_EXTERIOR_ANGLE", "primaryMethod": "외각 122도로 밑각 C = 58도를 구하고 이등변삼각형의 두 밑각이 같음을 이용해 꼭짓각 A를 구한다.", "decisiveStep": "180도 - 122도 = 58도로 밑각을 구한 뒤 180도에서 두 밑각의 합 116도를 빼는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "이등변삼각형 밑각과 외각 관계 적용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외각과 이웃한 내각의 합이 180도임을 이용해 이등변삼각형의 꼭짓각을 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["이등변삼각형", "외각"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}
Q02
* 형식: 객관식
* 배점: 4
발문
다음은 두 내각의 크기가 같은 삼각형 $ABC$ ($\angle B=\angle C$)가 이등변삼각형임을 설명하는 과정이다. $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 할 때, ㉠~㉤에 들어갈 것으로 알맞지 않은 것은? (정답 2개) [4점]


$\triangle ABD$와 $\triangle ACD$에서 $\angle B=\angle C$, $\angle BAD=$ (㉠), $\angle ADB=180^\circ-\angle B-\angle BAD=180^\circ-\angle C-\angle CAD=$ (㉡)이다. 또한 (㉢)은 공통이므로 $\triangle ABD \equiv \triangle ACD$ ((㉣) 합동)이다. 따라서 $\overline{AB}=$ (㉤)이므로 $\triangle ABC$는 이등변삼각형이다.
선지
① ㉠ : $\angle B$ ② ㉡ : $\angle ADC$ ③ ㉢ : $\overline{AD}$ ④ ㉣ : RHS ⑤ ㉤ : $\overline{AC}$
정답
①, ④
해설
$\overline{AD}$가 $\angle A$의 이등분선이므로 $\angle BAD=\angle CAD$이다. 따라서 ㉠에 $\angle B$가 들어가는 것은 옳지 않다. ㉡은 $\angle ADC$, ㉢은 공통변 $\overline{AD}$가 맞다. 한 변 $\overline{AD}$와 그 양 끝각이 각각 같으므로 합동 조건은 ASA 합동이다. 따라서 ㉣에 RHS가 들어가는 것은 옳지 않다. 대응변에 의해 $\overline{AB}=\overline{AC}$이므로 ㉤은 맞다. $\therefore$ ①, ④


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "2", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_CONVERSE_PROOF", "primaryMethod": "두 내각이 같은 삼각형에서 꼭짓각 이등분선 AD를 그어 ASA 합동을 유도하는 증명 빈칸 5개를 검증한다.", "decisiveStep": "각 이등분 조건 ㉠ = 각 CAD와 합동 조건 ㉣ = ASA에서 틀린 보기 ①, ④를 가려내는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 판정", "l4": "두 각 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_CONVERSE", "why": "이등변삼각형 판정 증명 과정 빈칸 판별"}, "crossConceptKeys": ["CC_ISOSCELES_CONVERSE", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형 판정 증명의 각 단계와 합동 조건을 추적해 오답 빈칸 두 개를 찾는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "각이등분선"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}
Q03
* 형식: 객관식
* 배점: 4
발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 하고, 선분 $AD$ 위의 한 점 $P$를 잡을 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]
선지
① $\overline{BD}=\overline{CD}$ ② $\overline{PB}=\overline{PC}$ ③ $\angle PBD=\angle PCD$ ④ $\overline{AD}\perp\overline{BC}$ ⑤ $\overline{BP}=\overline{AP}$
정답
⑤
해설
$\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로 $\overline{BD}=\overline{CD}$이고 $\overline{AD}\perp\overline{BC}$이다. 또한 $\overline{PD}$는 공통, $\angle PDB=\angle PDC=90^\circ$, $\overline{BD}=\overline{CD}$이므로 $\triangle PBD \equiv \triangle PCD$ (SAS 합동)이다. 따라서 $\overline{PB}=\overline{PC}$, $\angle PBD=\angle PCD$가 항상 성립한다. 그러나 $\overline{BP}=\overline{AP}$는 점 $P$의 위치에 따라 달라지므로 항상 성립하지 않는다. $\therefore$ ⑤


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "3", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_AXIS_SYMMETRY", "primaryMethod": "꼭짓각 이등분선 위 점 P에 대한 대칭 합동 성질과 거리가 같지 않은 선분 BP = AP를 구별한다.", "decisiveStep": "대칭축 위 점 P에서 양 끝점 B, C까지의 거리는 같지만 꼭짓점 A까지의 거리는 다름을 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "꼭짓각의 이등분선"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_VERTEX_BISECTOR", "why": "이등변삼각형 대칭축 성질 판별"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_CONGRUENCE_SAS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "꼭짓각 이등분선 위의 임의의 점에 대해 성립하는 합동 성질과 거짓 명제를 판별하는 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}
Q04
* 형식: 객관식
* 배점: 4
발문
$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 하자. $\angle A=48^\circ$일 때, $\angle BDC$의 크기는? [4점]
선지
① $78^\circ$ ② $81^\circ$ ③ $84^\circ$ ④ $87^\circ$ ⑤ $90^\circ$
정답
②
해설
$\overline{AB}=\overline{AC}$이므로 $\angle B=\angle C=\dfrac{180^\circ-48^\circ}{2}=66^\circ$이다. $\overline{CD}$가 $\angle C$를 이등분하므로 $\angle BCD=\dfrac{66^\circ}{2}=33^\circ$이다. $\triangle BDC$에서 $\angle BDC=180^\circ-66^\circ-33^\circ=81^\circ$이다. $\therefore$ ②


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_BASE_BISECTOR", "primaryMethod": "꼭짓각 48도로 밑각 66도를 구한 뒤 각 C를 이등분해 삼각형 BDC의 내각의 합으로 각 BDC를 구한다.", "decisiveStep": "밑각 66도의 절반 33도를 구해 180도 - 66도 - 33도를 계산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "이등변삼각형 밑각과 각의 이등분선 결합"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "이등변삼각형의 밑각 계산과 각 이등분, 삼각형 내각의 합을 차례로 연결하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["각"], "method": ["내각"], "condition": []}, "hold": ""}
Q05
* 형식: 객관식
* 배점: 4
발문
선분 $BA$ 위에 점 $D$가 있고 선분 $BC$ 위에 점 $E$가 있으며 $\overline{BD}=\overline{DE}=\overline{EA}=\overline{AC}$이다. $\angle B=22^\circ$일 때, $\angle EAC$의 크기는? [4점]
선지
① $36^\circ$ ② $40^\circ$ ③ $44^\circ$ ④ $48^\circ$ ⑤ $52^\circ$
정답
④
해설
$\overline{BD}=\overline{DE}$이므로 $\angle BED=\angle B=22^\circ$이고, $\triangle BDE$의 외각 성질에 의해 $\angle EDA=22^\circ+22^\circ=44^\circ$이다. $\overline{DE}=\overline{EA}$이므로 $\angle DAE=\angle EDA=44^\circ$이다. $\triangle BAE$의 외각 성질에 의해 $\angle AEC=\angle B+\angle BAE=22^\circ+44^\circ=66^\circ$이다. $\overline{EA}=\overline{AC}$이므로 $\angle ECA=\angle AEC=66^\circ$이다. $\therefore \angle EAC=180^\circ-66^\circ-66^\circ=48^\circ$ $\therefore$ ④


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CHAIN_ISOSCELES_ANGLES", "primaryMethod": "연속된 세 이등변삼각형에서 외각 성질을 이용해 22도 -> 44도 -> 66도 순으로 각을 전파해 각 EAC를 구한다.", "decisiveStep": "삼각형 BAE의 외각 각 AEC = 22도 + 44도 = 66도를 구해 삼각형 EAC의 꼭짓각을 계산하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "밑각"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_BASE_ANGLES", "why": "연쇄 이등변삼각형과 외각 성질 반복 적용"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_ANGLE_RELATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 이등변삼각형을 거치며 외각 성질로 각을 연속 추적해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["이등변삼각형", "변"], "goal": ["각"], "method": ["외각"], "condition": []}, "hold": ""}
Q06
* 형식: 객관식
* 배점: 4
발문
다음 직각삼각형 (ㄱ)~(ㅂ) 중 서로 합동인 두 삼각형과 그 합동 조건이 바르게 짝지어진 것은? [4점]


(ㄱ) 빗변 $7\text{ cm}$, 한 직각변 $4\text{ cm}$ (ㄴ) 빗변 $7\text{ cm}$, 한 예각 $35^\circ$ (ㄷ) 두 직각변 $4\text{ cm}$, $5\text{ cm}$ (ㄹ) 빗변 $8\text{ cm}$, 한 예각 $35^\circ$ (ㅁ) 한 직각변 $4\text{ cm}$, 한 예각 $55^\circ$ (ㅂ) 빗변 $7\text{ cm}$, 한 직각변 $4\text{ cm}$
선지
① (ㄱ)과 (ㅂ) : RHS 합동 ② (ㄱ)과 (ㄷ) : SAS 합동 ③ (ㄴ)과 (ㄹ) : RHA 합동 ④ (ㄴ)과 (ㅂ) : RHS 합동 ⑤ (ㄷ)과 (ㅁ) : ASA 합동
정답
①
해설
(ㄱ)과 (ㅂ)은 모두 직각삼각형이면서 빗변의 길이가 $7\text{ cm}$, 다른 한 변의 길이가 $4\text{ cm}$로 각각 같으므로 RHS 합동이다. 나머지 쌍은 빗변 또는 대응하는 변·각이 일치하지 않으므로 합동이라 할 수 없다. $\therefore$ ①


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-RIGHT_TRIANGLE_CONGRUENCE_MATCH", "primaryMethod": "주어진 직각삼각형들의 빗변, 직각변, 예각 조건을 대조해 빗변과 한 변이 같은 (ㄱ)과 (ㅂ)의 RHS 합동을 찾는다.", "decisiveStep": "빗변 7cm와 한 직각변 4cm가 일치하는 (ㄱ)과 (ㅂ)을 RHS 합동으로 연결하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHS"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE", "why": "직각삼각형 RHS 합동 조건 판별"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHS", "CC_RIGHT_TRIANGLE_CONGRUENCE_RHA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "여러 직각삼각형 조건 중에서 빗변과 변·각 조건을 정확히 대조해 합동 쌍과 조건을 찾는 문항이다.", "level": "중", "item4slot": {"given": ["직각삼각형"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}
Q07
* 형식: 객관식
* 배점: 5
발문
$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB$, $AC$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{MD}=\overline{ME}$이고 $\angle B=38^\circ$일 때, $\triangle BMD$와 합동인 삼각형과 그 합동 조건으로 옳은 것은? [5점]
선지
① $\triangle CME$, RHA 합동 ② $\triangle AME$, ASA 합동 ③ $\triangle CME$, RHS 합동 ④ $\triangle MDE$, RHS 합동 ⑤ $\triangle AME$, RHA 합동
정답
③
해설
$\triangle BMD$와 $\triangle CME$에서 $\angle BDM=\angle CEM=90^\circ$이고, 점 $M$이 변 $BC$의 중점이므로 빗변 $\overline{MB}=\overline{MC}$이며, $\overline{MD}=\overline{ME}$이다. 따라서 빗변의 길이와 다른 한 변의 길이가 각각 같으므로 $\triangle BMD \equiv \triangle CME$ (RHS 합동)이다. $\therefore$ ③


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-MIDPOINT_RHS_CONGRUENCE", "primaryMethod": "변 BC의 중점 조건 MB = MC와 수선 조건 MD = ME를 결합해 삼각형 BMD와 CME의 RHS 합동을 판별한다.", "decisiveStep": "빗변 MB = MC와 직각변 MD = ME로 RHS 합동을 확정하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 성질", "l3": "직각삼각형의 합동", "l4": "RHS"}, "ptTplCandidate": {"problemTypeKey": "PT_RIGHT_TRIANGLE_CONGRUENCE", "templateKey": "TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE", "why": "중점과 수선 조건을 이용한 RHS 합동 판정"}, "crossConceptKeys": ["CC_RIGHT_TRIANGLE_CONGRUENCE_RHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수선의 발로 직각을 확인하고 중점의 빗변 조건과 MD = ME를 연결해 RHS 합동을 판별하는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "중점", "수선"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}
Q08
* 형식: 객관식
* 배점: 4
발문
삼각형의 외심과 내심에 대한 다음 설명 중 옳지 않은 것은? (정답 2개) [4점]
선지
① 정삼각형의 외심과 내심은 일치한다. ② 이등변삼각형의 외심은 항상 삼각형의 내부에 있다. ③ 삼각형의 세 내각의 이등분선의 교점에서 세 변까지의 거리는 같다. ④ 둥근 접시의 깨진 조각 일부만 남았을 때, 호 위의 세 점을 잡아 만든 삼각형의 외심을 구하면 원래 원의 중심을 찾을 수 있다. ⑤ 삼각형의 세 꼭짓점에서 같은 거리에 있는 지점을 찾을 때는 내심을 이용한다.
정답
②, ⑤
해설
① 정삼각형은 외심과 내심이 일치한다. ② 둔각이등변삼각형의 외심은 삼각형의 외부에 있으므로 항상 내부에 있다는 설명은 옳지 않다. ③ 세 내각의 이등분선의 교점은 내심이며 세 변까지의 거리가 같다. ④ 원 위의 세 점을 꼭짓점으로 하는 삼각형의 외심이 원래 원의 중심이다. ⑤ 세 꼭짓점에서 같은 거리에 있는 지점은 외심이므로 내심을 이용한다는 설명은 옳지 않다. $\therefore$ ②, ⑤


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "8", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_CIRCUMCENTER_CONCEPT", "primaryMethod": "외심과 내심의 정의, 위치, 응용 성질을 5개 선지에서 대조해 옳지 않은 명제 2개를 고른다.", "decisiveStep": "둔각이등변삼각형 외심의 외부 위치와 세 꼭짓점 등거리점이 외심임을 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "외심의 위치·각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_COMBINED", "why": "외심과 내심의 성질·위치 비교 판별"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_TRIANGLE_INCENTER", "CC_COUNTEREXAMPLE_CONDITION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심의 삼각형 종류별 위치와 내심·외심의 거리 성질 차이를 모두 판별해야 하는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심", "내심"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}
Q09
* 형식: 객관식
* 배점: 4
발문
점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $AC$, $BC$에 내린 수선의 발을 각각 $M$, $L$, $N$이라 할 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]
선지
① $\overline{OM}=\overline{ON}$ ② $\overline{AM}=\overline{BM}$ ③ $\angle OAL=\angle OCL$ ④ $\overline{OB}=\overline{OC}$ ⑤ $\triangle OBN \equiv \triangle OCN$
정답
①
해설
② $\overline{OM}\perp\overline{AB}$이므로 외심의 성질에 의해 $\overline{AM}=\overline{BM}$이다. ③, ④ $\overline{OA}=\overline{OB}=\overline{OC}$이므로 $\triangle OAC$는 이등변삼각형이고 $\angle OAL=\angle OCL$이다. ⑤ 직각삼각형 $OBN$과 $OCN$에서 $\overline{OB}=\overline{OC}$, $\overline{ON}$은 공통이므로 RHS 합동이다. ① $\overline{OM}$과 $\overline{ON}$은 서로 다른 두 변 $AB$, $BC$까지의 거리이므로 항상 같다고 할 수 없다. $\therefore$ ①


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "9", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_PERPENDICULAR", "primaryMethod": "외심에서 세 변에 내린 수선의 발 M, L, N에 대한 이등분·합동 성질을 확인하고 변까지의 거리 같음을 배제한다.", "decisiveStep": "외심에서 서로 다른 변까지의 거리 OM과 ON이 일반적으로 같지 않음을 판별하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "수직이등분선과 외심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심의 수직이등분선과 RHS 합동 성질 판별"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_RIGHT_TRIANGLE_CONGRUENCE_RHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심의 수직이등분선과 삼각형 합동 성질 중 내심 성질과 혼동되는 보기를 가려내는 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심", "수선"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}
Q10
* 형식: 객관식
* 배점: 5
발문
둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여 꼭짓점 $A$의 반대쪽에 있다. $\angle ABC=24^\circ$, $\angle OBC=14^\circ$일 때, $\angle BAC$의 크기는? [5점]
선지
① $98^\circ$ ② $100^\circ$ ③ $102^\circ$ ④ $104^\circ$ ⑤ $108^\circ$
정답
④
해설
외심 $O$가 변 $BC$의 반대쪽에 있으므로 $\angle ABO=\angle ABC+\angle OBC=24^\circ+14^\circ=38^\circ$이다. $\overline{OA}=\overline{OB}$이므로 $\angle BAO=\angle ABO=38^\circ$이다. $\angle ACB=c$라 하면 $\angle ACO=c+14^\circ$이고, $\overline{OA}=\overline{OC}$이므로 $\angle OAC=c+14^\circ$이다. 따라서 $\angle BAC=38^\circ+(c+14^\circ)=c+52^\circ$이다. $\triangle ABC$에서 $(c+52^\circ)+24^\circ+c=180^\circ \implies 2c=104^\circ \implies c=52^\circ$이다. $\therefore \angle BAC=52^\circ+52^\circ=104^\circ$ $\therefore$ ④


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-OBTUSE_CIRCUMCENTER_ANGLE", "primaryMethod": "둔각삼각형 외부에 있는 외심 O에서 OA = OB = OC인 세 이등변삼각형과 미지수 c를 이용해 각 BAC를 구한다.", "decisiveStep": "각 BAO = 38도와 각 OAC = c + 14도를 합해 삼각형 내각의 합 방정식 2c + 76 = 180을 푸는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "외심의 위치·각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "둔각삼각형 외부 외심의 각 계산"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_ISOSCELES_TRIANGLES", "CC_ALGEBRAIC_MODELING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외심이 삼각형 외부에 있을 때 각의 합·차 방향을 정확히 세우고 미지수로 연립해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["삼각형", "외심"], "goal": ["각"], "method": ["방정식"], "condition": []}, "hold": ""}
Q11
* 형식: 객관식
* 배점: 5
발문
$\overline{AC}=\overline{BC}$인 이등변삼각형 $ABC$에서 $\angle C=52^\circ$이고 외심을 $O$, 내심을 $I$라 할 때, 다음 중 옳은 것은? [5점]
선지
① $\angle OCB=20^\circ$ ② $\angle IBC=32^\circ$ ③ $\angle B=52^\circ$ ④ $\angle OBC=32^\circ$ ⑤ $\angle IBO=12^\circ$
정답
②
해설
$\overline{AC}=\overline{BC}$이므로 $\angle A=\angle B=\dfrac{180^\circ-52^\circ}{2}=64^\circ$이다. 내심 $I$는 각의 이등분선 교점이므로 $\angle IBC=\dfrac{1}{2}\angle B=32^\circ$이다. 한편 $\angle AOB=2\angle C=104^\circ$이고 $\overline{OA}=\overline{OB}$이므로 $\angle OBA=\dfrac{180^\circ-104^\circ}{2}=38^\circ$이다. 따라서 $\angle OBC=64^\circ-38^\circ=26^\circ$, $\angle OCB=26^\circ$, $\angle IBO=32^\circ-26^\circ=6^\circ$이다. $\therefore$ ②


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_CIRCUM_INCENTER", "primaryMethod": "이등변삼각형의 밑각 64도를 구한 뒤 내심의 각 이등분 성질로 각 IBC = 32도를 계산하고 나머지 선지를 검증한다.", "decisiveStep": "밑각 B = 64도의 절반으로 각 IBC = 32도를 확정하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외접원·내접원 활용", "l4": "외심·내심을 이용한 복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CENTERS_COMBINED", "why": "이등변삼각형에서 외심·내심 각 계산"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_INCENTER", "CC_TRIANGLE_CIRCUMCENTER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형의 밑각과 내심·외심 각 성질을 차례로 확인해 옳은 선지를 고르는 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "외심", "내심"], "goal": ["판정"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}
Q12
* 형식: 객관식
* 배점: 4
발문
다음 각 사각형의 뜻으로 옳지 않은 것은? (정답 2개) [4점]
선지
① 사다리꼴 : 한 쌍의 대변이 평행한 사각형 ② 마름모 : 네 변의 길이가 같은 사각형 ③ 평행사변형 : 두 쌍의 대변의 길이가 각각 같은 사각형 ④ 직사각형 : 네 내각의 크기가 모두 같은 사각형 ⑤ 등변사다리꼴 : 두 대각선의 길이가 같은 사각형
정답
③, ⑤
해설
①, ②, ④는 각 사각형의 정확한 뜻(정의)이다. ③ 평행사변형의 뜻은 두 쌍의 대변이 각각 평행한 사각형이며, 두 쌍의 대변의 길이가 각각 같다는 것은 평행사변형의 성질이다. ⑤ 등변사다리꼴의 뜻은 아랫변의 양 끝각의 크기가 같은 사다리꼴이며, 두 대각선의 길이가 같아도 사다리꼴이 아닐 수 있다. $\therefore$ ③, ⑤


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "12", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-QUADRILATERAL_DEFINITIONS", "primaryMethod": "여러 사각형의 정의(뜻)와 성질·충분조건을 구분하여 정의가 아닌 진술 2개를 고른다.", "decisiveStep": "평행사변형의 평행 조건 누락과 등변사다리꼴의 사다리꼴 전제 누락을 판별하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "성질 비교"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_SPECIAL_QUADRILATERALS", "why": "사각형의 정의와 성질 구별"}, "crossConceptKeys": ["CC_QUADRILATERAL_CLASSIFICATION", "CC_PARALLELOGRAMS", "CC_ISOSCELES_TRAPEZOID"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사각형의 정의와 성질의 차이를 정확히 구분해 두 개의 오답 정의를 가려내는 문항이다.", "level": "중", "item4slot": {"given": ["사각형"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}
Q13
* 형식: 객관식
* 배점: 4
발문
평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\angle OAD=\angle ODA$일 때, 다음 중 항상 옳은 것은? [4점]
선지
① $\overline{AB}=\overline{BC}$ ② $\overline{AC}\perp\overline{BD}$ ③ $\overline{AD}=\overline{BD}$ ④ $\angle ABD=\angle CBD$ ⑤ $\overline{AC}=\overline{BD}$
정답
⑤
해설
$\angle OAD=\angle ODA$이므로 $\triangle OAD$는 이등변삼각형이고 $\overline{OA}=\overline{OD}$이다. 평행사변형의 두 대각선은 서로를 이등분하므로 $\overline{AC}=2\overline{OA}$, $\overline{BD}=2\overline{OD}$이다. $\therefore \overline{AC}=\overline{BD}$ $\therefore$ ⑤


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "13", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_DIAGONAL_RECTANGLE", "primaryMethod": "밑각이 같은 삼각형 OAD에서 OA = OD를 얻고 평행사변형의 대각선 이등분 성질로 AC = BD를 유도한다.", "decisiveStep": "OA = OD와 AC = 2OA, BD = 2OD를 결합해 AC = BD를 도출하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "평행사변형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 대각선 이등분과 이등변삼각형 판정 결합"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_DIAGONALS", "CC_ISOSCELES_CONVERSE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형 판정으로 OA = OD를 이끌어낸 뒤 평행사변형의 대각선 이등분 성질을 연결하는 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["판정"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}
Q14
* 형식: 객관식
* 배점: 4
발문
평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\overline{AB}=7\text{ cm}$, $\overline{AC}=10\text{ cm}$, $\overline{BD}=16\text{ cm}$일 때, $\triangle ABO$의 둘레의 길이는? [4점]
선지
① $18\text{ cm}$ ② $20\text{ cm}$ ③ $22\text{ cm}$ ④ $24\text{ cm}$ ⑤ $26\text{ cm}$
정답
②
해설
평행사변형의 두 대각선은 서로를 이등분하므로 $\overline{AO}=\dfrac{1}{2}\overline{AC}=5\text{ cm}$, $\overline{BO}=\dfrac{1}{2}\overline{BD}=8\text{ cm}$이다. $\therefore (\triangle ABO\text{의 둘레})=7+5+8=20\text{ cm}$ $\therefore$ ②


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_DIAGONAL_PERIMETER", "primaryMethod": "평행사변형의 대각선 이등분 성질로 AO = 5, BO = 8을 구해 AB = 7과 더해 둘레를 계산한다.", "decisiveStep": "두 대각선 길이 10과 16을 각각 반으로 나누어 삼각형 세 변의 합을 구하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "평행사변형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 대각선 이등분 성질로 둘레 계산"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대각선의 중점 성질을 바로 적용해 삼각형 둘레를 계산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["길이"], "method": ["합"], "condition": []}, "hold": ""}
Q15
* 형식: 객관식
* 배점: 4
발문
$\overline{AB}=9\text{ cm}$, $\overline{AD}=13\text{ cm}$인 평행사변형 $ABCD$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $F$, $\angle D$의 이등분선과 변 $BC$의 교점을 $E$라 할 때, $\overline{BF}+\overline{CF}+\overline{EF}$의 길이는? [4점]
선지
① $16\text{ cm}$ ② $17\text{ cm}$ ③ $18\text{ cm}$ ④ $19\text{ cm}$ ⑤ $20\text{ cm}$
정답
③
해설
$\overline{AD}\parallel\overline{BC}$이므로 $\angle FAD=\angle AFB$ (엇각)이고, $\angle BAF=\angle FAD$이므로 $\angle BAF=\angle AFB$이다. 따라서 $\overline{BF}=\overline{AB}=9\text{ cm}$이다. 같은 방법으로 $\overline{CE}=\overline{CD}=\overline{AB}=9\text{ cm}$이다. $\overline{BC}=\overline{AD}=13\text{ cm}$이므로 $\overline{CF}=\overline{BC}-\overline{BF}=13-9=4\text{ cm}$이다. 또 $\overline{EF}=\overline{CE}-\overline{CF}=9-4=5\text{ cm}$이다. $\therefore \overline{BF}+\overline{CF}+\overline{EF}=9+4+5=18\text{ cm}$ $\therefore$ ③


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_ANGLE_BISECTOR", "primaryMethod": "평행선 엇각과 각 이등분 조건으로 두 이등변삼각형 BF = 9, CE = 9를 찾고 선분 차로 CF와 EF를 구한다.", "decisiveStep": "BF = CE = 9에서 CF = 13 - 9 = 4, EF = 9 - 4 = 5를 순차 계산하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 각의 이등분선과 엇각 성질 결합"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_ANGLE_BISECTOR_PARALLEL", "CC_ISOSCELES_CONVERSE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "평행사변형에서 양쪽 각 이등분선으로 생기는 이등변삼각형 두 개와 겹치는 선분 길이를 구하는 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "각이등분선"], "goal": ["길이"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}
Q16
* 형식: 객관식
* 배점: 4
발문
다음은 $\square ABCD$에서 $\overline{AD}\parallel\overline{BC}$이고 $\overline{AD}=\overline{BC}$일 때, $\square ABCD$가 평행사변형임을 설명하는 과정이다. ㉠~㉤에 들어갈 것으로 알맞지 않은 것은? [4점]


$\triangle ABC$와 $\triangle CDA$에서 $\overline{BC}=$ (㉠), $\overline{AD}\parallel\overline{BC}$이므로 엇각으로 $\angle BCA=$ (㉡), (㉢)은 공통이므로 $\triangle ABC \equiv \triangle CDA$ (SAS 합동)이다. 따라서 $\angle BAC=$ (㉣)이므로 $\overline{AB}\parallel$ (㉤)이 되어 $\square ABCD$는 평행사변형이다.
선지
① ㉠ : $\overline{AB}$ ② ㉡ : $\angle DAC$ ③ ㉢ : $\overline{AC}$ ④ ㉣ : $\angle DCA$ ⑤ ㉤ : $\overline{CD}$
정답
①
해설
가정에서 $\overline{BC}=\overline{AD}$이므로 ㉠에 들어갈 것은 $\overline{AD}$이다. 따라서 $\overline{AB}$가 들어가는 ①은 알맞지 않다. ㉡은 엇각 $\angle DAC$, ㉢은 공통변 $\overline{AC}$, ㉣은 대응각 $\angle DCA$, ㉤은 $\overline{CD}$가 모두 옳다. $\therefore$ ①


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "16", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_CRITERIA_PROOF", "primaryMethod": "한 쌍의 대변이 평행하고 길이가 같을 때 평행사변형이 됨을 SAS 합동으로 증명하는 빈칸을 대조한다.", "decisiveStep": "가정 BC = AD로부터 ㉠에 AB가 아닌 AD가 들어가야 함을 판별하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_CRITERIA", "why": "평행사변형 판정 조건 증명 과정 판별"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_TRIANGLE_CONGRUENCE_SAS", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대응 꼭짓점 순서와 가정 조건을 따라 SAS 합동 증명 빈칸을 확인하는 문항이다.", "level": "중", "item4slot": {"given": ["사각형", "평행"], "goal": ["판정"], "method": ["합동"], "condition": []}, "hold": ""}
Q17
* 형식: 객관식
* 배점: 5
발문
다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면? (정답 2개) [5점]
선지
① $\overline{AB}=\overline{BC}=5\text{ cm}$, $\overline{CD}=\overline{DA}=7\text{ cm}$ ② $\overline{AD}=\overline{BC}=7\text{ cm}$, $\overline{AD}\parallel\overline{BC}$ ③ $\angle A=\angle B=105^\circ$, $\angle C=75^\circ$ ④ $\angle A+\angle B=180^\circ$, $\angle B+\angle C=180^\circ$ ⑤ 두 대각선의 교점 $O$에 대하여 $\overline{OA}=\overline{OB}$, $\overline{OC}=\overline{OD}$
정답
②, ④
해설
① 이웃한 두 변씩 길이가 같으므로 연꼴일 수 있어 평행사변형이 아니다. ② 한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다. ③ 사각형 내각의 합에 의해 $\angle D=75^\circ$이므로 두 쌍의 대각이 같지 않아 평행사변형이 아니다. ④ $\angle A+\angle B=180^\circ$, $\angle B+\angle C=180^\circ$에서 $\angle A=\angle C$이고 $\angle B=\angle D$이므로 두 쌍의 대각의 크기가 각각 같아 평행사변형이다. ⑤ 두 대각선이 서로를 이등분하는 조건이 아니므로 평행사변형이라 할 수 없다. $\therefore$ ②, ④


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_SUFFICIENT_CRITERIA", "primaryMethod": "다섯 조건 중 평행사변형을 보장하는 한 쌍 평행·길이 같음 조건과 두 쌍의 대각 같음 조건을 가려낸다.", "decisiveStep": "각 A + 각 B = 180도와 각 B + 각 C = 180도로부터 두 쌍의 대각이 같음을 추론하는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_CRITERIA", "why": "평행사변형 성립 조건 종합 판별"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_SUFFICIENT_CONDITIONS", "CC_COUNTEREXAMPLE_CONDITION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "변·각·대각선 조건의 함정 보기를 거르고 각의 합 조건으로부터 대각 같음을 추론해야 하는 문항이다.", "level": "상", "item4slot": {"given": ["사각형", "변", "각"], "goal": ["판정"], "method": ["분류"], "condition": []}, "hold": ""}
Q18
* 형식: 서답형
* 배점: 8
발문
[서술형 1] $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 두 밑각의 크기가 같음을 다음 순서에 따라 설명하시오. [8점] (1) 조건에 맞는 이등변삼각형 $ABC$에서 꼭짓각 $\angle A$의 이등분선을 그어 밑변 $BC$와 만나는 점을 $D$라 하자. [2점] (2) $\triangle ABD$와 $\triangle ACD$의 합동을 이용하여 $\angle B=\angle C$인 이유를 설명하시오. [6점]
선지
없음
정답
$\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로 $\angle B=\angle C$
해설
(1) $\overline{AB}=\overline{AC}$인 삼각형 $ABC$에서 $\angle A$의 이등분선 $\overline{AD}$를 그어 변 $BC$와의 교점을 $D$라 한다. (2) $\triangle ABD$와 $\triangle ACD$에서 $\overline{AB}=\overline{AC}$, $\angle BAD=\angle CAD$, $\overline{AD}$는 공통인 변이다. 따라서 두 변의 길이와 그 끼인각의 크기가 각각 같으므로 $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다. 합동인 두 삼각형의 대응각의 크기는 같으므로 $\angle ABD=\angle ACD$, 즉 $\angle B=\angle C$이다.


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "18", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_BASE_ANGLE_PROOF", "primaryMethod": "꼭짓각 이등분선 AD를 보조선으로 그어 삼각형 ABD와 ACD의 SAS 합동을 서술해 밑각 같음을 증명한다.", "decisiveStep": "AB = AC, 각 BAD = 각 CAD, AD 공통으로 SAS 합동을 확정하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "이등변삼각형", "l3": "이등변삼각형의 성질", "l4": "꼭짓각의 이등분선"}, "ptTplCandidate": {"problemTypeKey": "PT_ISOSCELES_TRIANGLE", "templateKey": "TPL_ISOSCELES_VERTEX_BISECTOR", "why": "이등변삼각형 두 밑각 같음의 SAS 합동 증명"}, "crossConceptKeys": ["CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_CONGRUENCE_SAS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "보조선을 설정하고 SAS 합동 조건 세 가지를 빠짐없이 서술해야 하는 표준 증명 문항이다.", "level": "중", "item4slot": {"given": ["이등변삼각형", "각이등분선"], "goal": ["증명"], "method": ["합동"], "condition": []}, "hold": ""}
Q19
* 형식: 서답형
* 배점: 5
발문
[서술형 2] 점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle B=62^\circ$일 때, $\angle AOC$의 크기를 구하는 풀이과정과 답을 쓰시오. [5점]
선지
없음
정답
$124^\circ$
해설
$\angle ABO=x$라 하면 $\overline{OA}=\overline{OB}$이므로 $\angle OAB=x$, $\angle AOB=180^\circ-2x$이다. $\angle OBC=62^\circ-x$이고 $\overline{OB}=\overline{OC}$이므로 $\angle BCO=62^\circ-x$, $\angle BOC=180^\circ-2(62^\circ-x)=56^\circ+2x$이다. 점 $O$ 둘레의 각의 합은 $360^\circ$이므로 $\angle AOC=360^\circ-(180^\circ-2x)-(56^\circ+2x)=124^\circ$ $\therefore 124^\circ$


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-CIRCUMCENTER_DOUBLE_ANGLE", "primaryMethod": "외심 O에서 세 꼭짓점까지의 거리가 같음을 이용해 두 이등변삼각형의 꼭짓각을 x로 나타내고 360도에서 빼 각 AOC를 구한다.", "decisiveStep": "각 AOB = 180 - 2x와 각 BOC = 56 + 2x를 합해 x를 소거하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "외심", "l4": "외심의 위치·각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_CIRCUMCENTER", "why": "외심 중심각 2배 관계 유도 및 계산"}, "crossConceptKeys": ["CC_TRIANGLE_CIRCUMCENTER", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지수 x를 도입해 두 이등변삼각형의 꼭짓각을 표현하고 360도 관계로 각 AOC를 유도하는 서술형 문항이다.", "level": "중", "item4slot": {"given": ["삼각형", "외심"], "goal": ["각"], "method": ["이등변삼각형"], "condition": []}, "hold": ""}
Q20
* 형식: 서답형
* 배점: 8
발문
[서술형 3] $\triangle ABC$의 내심 $I$에 대하여 $\overline{AI}$의 연장선이 변 $BC$와 만나는 점을 $D$, $\overline{BI}$의 연장선이 변 $AC$와 만나는 점을 $E$라 하자. $\angle ADB=76^\circ$, $\angle AEB=83^\circ$일 때, $\angle C$의 크기를 구하는 풀이과정과 답을 쓰시오. [8점]
선지
없음
정답
$46^\circ$
해설
내심 $I$는 각의 이등분선 교점이므로 $\angle BAI=\angle CAI=b$, $\angle ABI=\angle CBI=a$라 하자. $\triangle ABD$에서 $2a+b+76^\circ=180^\circ \implies 2a+b=104^\circ$ $\triangle ABE$에서 $a+2b+83^\circ=180^\circ \implies a+2b=97^\circ$ 두 식을 변끼리 더하면 $3(a+b)=201^\circ \implies a+b=67^\circ$이다. 따라서 $\angle A+\angle B=2(a+b)=134^\circ$이므로 $\angle C=180^\circ-134^\circ=46^\circ$ $\therefore 46^\circ$


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-TRIANGLE_PROPERTIES", "conceptClusterKey": "M2-05-INCENTER_SYSTEM_ANGLES", "primaryMethod": "내심의 각 이등분 성질로 반각 a, b를 두고 삼각형 ABD와 ABE의 내각의 합으로 연립일차방정식을 세워 각 C를 구한다.", "decisiveStep": "2a + b = 104도와 a + 2b = 97도를 더해 a + b = 67도를 구하는 단계", "rpm": {"majorUnit": "삼각형의 성질", "midUnit": "삼각형의 외심과 내심", "l3": "내심", "l4": "각의 이등분선과 내심"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIANGLE_CENTERS", "templateKey": "TPL_TRIANGLE_INCENTER", "why": "내심 반각 문자 설정과 연립방정식 결합"}, "crossConceptKeys": ["CC_TRIANGLE_INCENTER", "CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내심의 반각을 두 미지수로 두고 두 삼각형에서 연립일차방정식을 세워야 하는 3단계 서술형 문항이다.", "level": "상", "item4slot": {"given": ["삼각형", "내심"], "goal": ["각"], "method": ["연립방정식"], "condition": []}, "hold": ""}
Q21
* 형식: 서답형
* 배점: 7
발문
[서술형 4] 평행사변형 $ABCD$에서 대각선 $AC$를 그어 생기는 두 삼각형의 합동을 이용하여 두 쌍의 대변의 길이 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$가 각각 성립함을 설명하시오. [7점]
선지
없음
정답
$\triangle ABC \equiv \triangle CDA$ (ASA 합동)이므로 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$
해설
평행사변형 $ABCD$의 정의에 의해 $\overline{AB}\parallel\overline{DC}$, $\overline{AD}\parallel\overline{BC}$이다. $\triangle ABC$와 $\triangle CDA$에서 $\overline{AB}\parallel\overline{DC}$이므로 $\angle BAC=\angle DCA$ (엇각), $\overline{AD}\parallel\overline{BC}$이므로 $\angle BCA=\angle DAC$ (엇각), $\overline{AC}$는 공통인 변이다. 따라서 한 변의 길이와 그 양 끝각의 크기가 각각 같으므로 $\triangle ABC \equiv \triangle CDA$ (ASA 합동)이다. 합동인 두 삼각형의 대응변의 길이는 같으므로 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$이다.


{"exempt": true, "reason": "STRICT_VARIANT"}

{"sourceQid": "21", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_OPPOSITE_SIDES_PROOF", "primaryMethod": "평행사변형의 정의(두 쌍의 대변 평행)와 대각선 AC에 의한 엇각, 공통변을 이용해 ASA 합동을 서술한다.", "decisiveStep": "두 쌍의 엇각과 공통변 AC로 삼각형 ABC와 CDA의 ASA 합동을 보이는 단계", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": "TPL_QUADRILATERAL_PROPERTIES", "why": "평행사변형 대변 같음의 ASA 합동 증명"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선의 엇각 두 쌍과 공통변을 근거로 ASA 합동을 서술하는 표준 증명 문항이다.", "level": "중", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["증명"], "method": ["합동"], "condition": []}, "hold": ""}
