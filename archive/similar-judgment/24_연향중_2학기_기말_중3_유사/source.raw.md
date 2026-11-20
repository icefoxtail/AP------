{
  "stem": "24_연향중_2학기_기말_중3_유사",
  "sourceArchiveFile": "original/middle/m3/2final/24_연향중_2학기_기말_중3_기출.js",
  "examFolder": "2final",
  "grade": "중3",
  "curriculum": "2015",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
Q01
* 형식: 객관식
* 배점: 3
발문
다음 그림과 같이 반지름의 길이가 $7\rm,cm$인 원 $O$에서 길이가 $6\rm,cm$인 현 $\overline{AB}$가 있을 때, 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는? [3점]
선지
① $2\sqrt{7}\rm,cm$ ② $2\sqrt{10}\rm,cm$ ③ $3\sqrt{5}\rm,cm$ ④ $4\sqrt{3}\rm,cm$ ⑤ $7\rm,cm$
정답
②
해설
원의 중심에서 현에 내린 수선은 그 현을 수직이등분한다.


1단계: 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$이라 하면 $M$은 $\overline{AB}$의 중점이므로 $$\begin{aligned} \overline{AM} &= \dfrac{1}{2} \overline{AB} \ &= \dfrac{1}{2} \times 6 \ &= 3\rm,cm \end{aligned}$$


2단계: 직각삼각형 $OAM$에서 $\overline{OA}$는 원의 반지름이므로 $\overline{OA} = 7\rm,cm$이다. 피타고라스 정리에 의하여 $$\begin{aligned} \overline{OM}^2 &= \overline{OA}^2 - \overline{AM}^2 \ &= 7^2 - 3^2 \ &= 49 - 9 \ &= 40 \end{aligned}$$ 따라서 $\overline{OM} = \sqrt{40} = 2\sqrt{10}\rm,cm$이다.


따라서 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는 $2\sqrt{10}\rm,cm$이다. 따라서 정답은 ②이다.


{
  "status": "EXEMPT",
  "reason": "현의 수직이등분선과 반지름으로 구성된 직각삼각형 피타고라스 기본 계산 문항"
}

{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "현의 수직이등분 성질로 AM=3을 구하고 직각삼각형 OAM에서 OM=sqrt(49-9)=2sqrt(10)을 산출한다.",
  "decisiveStep": "피타고라스 정리 OM^2 = 7^2 - 3^2 = 40 적용",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 중심과 현의 수직이등분선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CHORD_DISTANCE_PYTHAGORAS",
    "templateKey": "TPL_M3_CHORD_HALF_RIGHT_TRIANGLE",
    "why": "원의 중심에서 현까지의 거리를 직각삼각형 피타고라스 정리로 구하는 표준형 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "현의 이등분 성질 파악 후 피타고라스 정리를 적용하는 2단계 기본 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "반지름",
      "현"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "피타고라스",
      "수직이등분"
    ],
    "condition": []
  },
  "hold": ""
}
Q02
* 형식: 객관식
* 배점: 3
발문
다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 접점이다. $\overline{OA} = 5\rm,cm$, $\overline{OP} = 9\rm,cm$일 때, 접선 $\overline{PB}$의 길이는? [3점]
선지
① $3\sqrt{6}\rm,cm$ ② $2\sqrt{13}\rm,cm$ ③ $7\rm,cm$ ④ $2\sqrt{14}\rm,cm$ ⑤ $4\sqrt{3}\rm,cm$
정답
④
해설
원의 접선은 접점을 지나는 반지름과 수직을 이룬다.


1단계: 점 $B$가 접점이므로 접선 $\overline{PB}$와 반지름 $\overline{OB}$는 수직이다. $$\angle OBP = 90^\circ$$


2단계: 원의 반지름의 길이는 일정하므로 $\overline{OB} = \overline{OA} = 5\rm,cm$이다. 직각삼각형 $OPB$에서 피타고라스 정리를 적용하면 다음과 같다. $$\begin{aligned} \overline{PB}^2 &= \overline{OP}^2 - \overline{OB}^2 \ &= 9^2 - 5^2 \ &= 81 - 25 \ &= 56 \end{aligned}$$ 따라서 $\overline{PB} = \sqrt{56} = 2\sqrt{14}\rm,cm$이다.


따라서 정답은 ④이다.


{
  "status": "EXEMPT",
  "reason": "원 외부의 점에서 그은 접선과 반지름의 수직 관계를 이용한 직각삼각형 피타고라스 계산 문항"
}

{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "접선과 반지름의 수직 성질로부터 직각삼각형 OPB를 세우고 PB=sqrt(81-25)=2sqrt(14)를 계산한다.",
  "decisiveStep": "직각삼각형 OPB에서 PB^2 = 9^2 - 5^2 = 56 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 접선의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_SEGMENT_LENGTH",
    "templateKey": "TPL_M3_TANGENT_RIGHT_TRIANGLE_PYTHAGORAS",
    "why": "접점 수직 조건을 이용하여 외부 점에서 접점까지의 거리를 계산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY",
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 수직 성질과 직각삼각형 피타고라스 1단계 연산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "반지름"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "피타고라스",
      "수직"
    ],
    "condition": []
  },
  "hold": ""
}
Q03
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 세 선분 $\overline{AD}, \overline{BC}, \overline{CD}$는 반지름의 길이가 $4\rm,cm$인 반원 $O$에 접하고 세 점 $A, B, E$는 접점이다. $\overline{CD} = 11\rm,cm$일 때, 사각형 $ABCD$의 둘레의 길이는? [4점]
선지
① $30\rm,cm$ ② $31\rm,cm$ ③ $32\rm,cm$ ④ $33\rm,cm$ ⑤ $34\rm,cm$
정답
①
해설
원 밖의 한 점에서 원에 그은 두 접선의 길이는 서로 같다.


1단계: 반원의 반지름이 $4\rm,cm$이므로 지름 $\overline{AB}$의 길이는 다음과 같다. $$\begin{aligned} \overline{AB} &= 2 \times 4 \ &= 8\rm,cm \end{aligned}$$


2단계: 점 $D$에서 반원에 그은 두 접선의 접점이 각각 $A, E$이므로 $\overline{DA} = \overline{DE}$이다. 점 $C$에서 반원에 그은 두 접선의 접점이 각각 $B, E$이므로 $\overline{CB} = \overline{CE}$이다. 따라서 다음 관계가 성립한다. $$\begin{aligned} \overline{AD} + \overline{BC} &= \overline{DE} + \overline{CE} \ &= \overline{CD} \ &= 11\rm,cm \end{aligned}$$


3단계: 사각형 $ABCD$의 둘레의 길이는 네 변의 길이의 합이므로 다음과 같다. $$\begin{aligned} \text{둘레} &= \overline{AB} + \overline{BC} + \overline{CD} + \overline{DA} \ &= \overline{AB} + (\overline{AD} + \overline{BC}) + \overline{CD} \ &= 8 + 11 + 11 \ &= 30\rm,cm \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "EXEMPT",
  "reason": "반원에 외접하는 사다리꼴의 접선 길이 치환 및 둘레 합산 대수 기하 문항"
}

{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "접선의 길이 성질 DA=DE, CB=CE로부터 AD+BC=CD=11을 얻고 지름 8과 합산하여 둘레 30을 구한다.",
  "decisiveStep": "AD + BC = CD = 11 치환 및 둘레 8 + 11 + 11 = 30 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 외접다각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_QUADRILATERAL_PERIMETER",
    "templateKey": "TPL_M3_SEMI_CIRCLE_CIRCUMSCRIBED_TRAPEZOID",
    "why": "반원에 접하는 사다리꼴의 둘레를 접선 길이 합등식으로 해결하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 접선의 길이 일치 관계를 윗변과 아랫변의 합에 대응시키는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "반원",
      "접선",
      "사다리꼴"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "접선의성질",
      "치환"
    ],
    "condition": []
  },
  "hold": ""
}
Q04
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고, 두 선분 $AD$와 $BC$의 연장선의 교점을 $P$라 하자. $\angle P = 40^\circ, \angle ABC = 105^\circ$일 때, $\angle PCD$의 크기는? [4점]
선지
① $55^\circ$ ② $60^\circ$ ③ $65^\circ$ ④ $70^\circ$ ⑤ $75^\circ$
정답
③
해설
원에 내접하는 사각형의 한 외각의 크기는 그 대내각의 크기와 같다.


1단계: 세 점 $P, B, C$가 한 직선 위에 있으므로 $\angle ABC = 105^\circ$에서 $$\begin{aligned} \angle ABP &= 180^\circ - \angle ABC \ &= 180^\circ - 105^\circ \ &= 75^\circ \end{aligned}$$


2단계: 삼각형 $PAB$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle PAB &= 180^\circ - (\angle P + \angle ABP) \ &= 180^\circ - (40^\circ + 75^\circ) \ &= 180^\circ - 115^\circ \ &= 65^\circ \end{aligned}$$


3단계: 사각형 $ABCD$가 원에 내접하므로 꼭짓점 $C$에서의 외각 $\angle PCD$의 크기는 그와 마주 보는 대내각 $\angle PAB$의 크기와 같다. $$\begin{aligned} \angle PCD &= \angle PAB \ &= 65^\circ \end{aligned}$$ 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "내접사각형의 외각과 대내각의 동치 성질 및 삼각형 내각합 각도 추론 문항"
}

{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "삼각형 PAB에서 각 PAB=180-(40+75)=65도를 구하고 내접사각형 외각 성질로 각 PCD=65도를 결정한다.",
  "decisiveStep": "내접사각형 외각-대내각 일치 관계 각 PCD = 각 PAB = 65도 적용",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각의 활용",
    "l4": "원에 내접하는 사각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_INSCRIBED_QUAD_EXTERIOR_ANGLE",
    "templateKey": "TPL_M3_INSCRIBED_QUAD_INTERSECTING_SECANTS",
    "why": "외부 교점 삼각형의 각도와 내접사각형의 외각-대내각 관계를 연립하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INSCRIBED_QUAD"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형 내각합과 내접사각형 대내각 정리를 순차 연계하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "사각형",
      "교점",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "내접사각형",
      "외각",
      "삼각형내각합"
    ],
    "condition": []
  },
  "hold": ""
}
Q05
* 형식: 객관식
* 배점: 5
발문
다음 그림에서 호 $\wideparen{AB}$는 깨진 원의 일부분이다. 현 $\overline{AB}$의 중점 $D$에 대하여 $\overline{AB} \perp \overline{CD}$이고, $\overline{AD} = \overline{BD} = 6\rm,cm, \overline{CD} = 2\rm,cm$일 때, 이 원의 반지름의 길이는? [5점]
선지
① $6\rm,cm$ ② $7\rm,cm$ ③ $8\rm,cm$ ④ $9\rm,cm$ ⑤ $10\rm,cm$
정답
⑤
해설
현의 수직이등분선은 그 원의 중심을 지난다.


1단계: 점 $D$는 현 $\overline{AB}$의 중점이고 $\overline{CD} \perp \overline{AB}$이므로 직선 $CD$는 현 $\overline{AB}$의 수직이등분선이다. 따라서 원래 원의 중심 $O$는 직선 $CD$ 위에 존재한다.


2단계: 원의 반지름의 길이를 $r\rm,cm$라 하자. 점 $C$는 원 위의 점이므로 $\overline{OC} = r\rm,cm$이다. $\overline{CD} = 2\rm,cm$이므로 선분 $\overline{OD}$의 길이는 다음과 같다. $$\overline{OD} = r - 2$$


3단계: 점 $A$ 역시 원 위의 점이므로 $\overline{OA} = r\rm,cm$이다. 직각삼각형 $ODA$에서 피타고라스 정리를 세우면 다음과 같다. $$\begin{aligned} \overline{OA}^2 &= \overline{OD}^2 + \overline{AD}^2 \ r^2 &= (r - 2)^2 + 6^2 \ r^2 &= (r^2 - 4r + 4) + 36 \ r^2 &= r^2 - 4r + 40 \ 4r &= 40 \ r &= 10\rm,cm \end{aligned}$$ 따라서 이 원의 반지름의 길이는 $10\rm,cm$이다. 따라서 정답은 ⑤이다.


{
  "status": "EXEMPT",
  "reason": "현의 수직이등분선 상의 중심 위치 설정 및 반지름 미지수 피타고라스 방정식 해결 문항"
}

{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "중심 O가 직선 CD 위에 있음을 이용해 r^2=(r-2)^2+6^2 방정식을 세워 r=10을 도출한다.",
  "decisiveStep": "이차항 소거 4r=40 풀이로 반지름 r=10 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 중심과 현의 길이의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_BROKEN_PLATE_RADIUS",
    "templateKey": "TPL_M3_CHORD_ALTITUDE_RADIUS_EQUATION",
    "why": "깨진 접시 현의 길이와 높이로부터 피타고라스 방정식으로 반지름을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기하적 모델링을 거쳐 일차방정식을 세워 미지수 반지름을 구하는 고배점 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "호",
      "현",
      "중점",
      "수선"
    ],
    "goal": [
      "반지름"
    ],
    "method": [
      "피타고라스",
      "방정식"
    ],
    "condition": []
  },
  "hold": ""
}
Q06
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 $\triangle ABC$의 내접원 $O$는 세 변 $AB, BC, CA$와 각각 세 점 $D, E, F$에서 접한다. $\angle A = 50^\circ, \angle B = 60^\circ$일 때, 접점 $E$에서 현 $EF$와 변 $BC$가 이루는 각 $\angle x$의 크기는? [4점]
선지
① $50^\circ$ ② $55^\circ$ ③ $60^\circ$ ④ $65^\circ$ ⑤ $70^\circ$
정답
②
해설
내접원의 중심과 접선 사이의 수직 관계 및 이등변삼각형의 성질을 이용한다.


1단계: 삼각형 $ABC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle C &= 180^\circ - (\angle A + \angle B) \ &= 180^\circ - (50^\circ + 60^\circ) \ &= 70^\circ \end{aligned}$$


2단계: 원 $O$가 변 $BC, AC$에 각각 점 $E, F$에서 접하므로 반지름과 접선은 수직이다. $$\overline{OE} \perp \overline{BC}, \quad \overline{OF} \perp \overline{AC}$$ 사각형 $OECF$의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle EOF &= 360^\circ - (90^\circ + 90^\circ + \angle C) \ &= 180^\circ - 70^\circ \ &= 110^\circ \end{aligned}$$


3단계: $\overline{OE} = \overline{OF}$는 원 $O$의 반지름이므로 삼각형 $OEF$는 이등변삼각형이다. $$\begin{aligned} \angle OEF &= \dfrac{180^\circ - 110^\circ}{2} \ &= 35^\circ \end{aligned}$$


4단계: $\overline{OE} \perp \overline{BC}$이므로 $\angle OEC = 90^\circ$이다. 따라서 각 $\angle x$의 크기는 다음과 같다. $$\begin{aligned} \angle x &= 90^\circ - \angle OEF \ &= 90^\circ - 35^\circ \ &= 55^\circ \end{aligned}$$ (참고: 접선과 현이 이루는 각의 성질에 의하여 $\angle x = \angle EDF = \dfrac{1}{2} \angle EOF = \dfrac{110^\circ}{2} = 55^\circ$로도 구할 수 있다.) 따라서 정답은 ②이다.


{
  "status": "EXEMPT",
  "reason": "내접원 접점 사각형 중심각 산출 및 접현각/이등변삼각형 각도 연산 문항"
}

{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "내각 C=70도에서 사각형 OECF의 중심각 EOF=110도를 구하고 접현각 성질로 x=110/2=55도를 도출한다.",
  "decisiveStep": "중심각 110도의 절반 취하여 접선과 현이 이루는 각 55도 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각의 활용",
    "l4": "접선과 현이 이루는 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_INSCRIBED_CIRCLE_CHORD_ANGLE",
    "templateKey": "TPL_M3_TRIANGLE_INCIRCLE_TANGENT_CHORD",
    "why": "내접원의 접점을 꼭짓점으로 하는 삼각형의 각을 접선과 현의 성질로 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼각형 내각합, 사각형 내각합, 이등변삼각형 성질을 단계별로 연결하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "내접원",
      "접점",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "내접원",
      "수직",
      "이등변삼각형"
    ],
    "condition": []
  },
  "hold": ""
}
Q07
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 그 접점이다. 선분 $\overline{AC}$는 원 $O$의 지름이고 $\angle BAC = 35^\circ$일 때, $\angle APB$의 크기는? [4점]
선지
① $70^\circ$ ② $72^\circ$ ③ $74^\circ$ ④ $76^\circ$ ⑤ $78^\circ$
정답
①
해설
지름에 대한 원주각과 중심각, 접선의 성질을 차례로 적용한다.


1단계: 선분 $\overline{AC}$는 원 $O$의 지름이므로 반원에 대한 원주각의 성질에 의하여 $$\angle ABC = 90^\circ$$ 직각삼각형 $ABC$에서 $\angle BAC = 35^\circ$이므로 $$\begin{aligned} \angle ACB &= 90^\circ - 35^\circ \ &= 55^\circ \end{aligned}$$


2단계: $\angle ACB$는 호 $\wideparen{AB}$에 대한 원주각이므로, 같은 호에 대한 중심각 $\angle AOB$의 크기는 원주각의 $2$배이다. $$\begin{aligned} \angle AOB &= 2 \times \angle ACB \ &= 2 \times 55^\circ \ &= 110^\circ \end{aligned}$$


3단계: 두 접선 $\overline{PA}, \overline{PB}$와 반지름은 접점에서 각각 수직이므로 사각형 $PAOB$에서 $$\angle PAO = 90^\circ, \quad \angle PBO = 90^\circ$$ 따라서 사각형의 내각의 합에 의하여 두 접선이 이루는 각 $\angle APB$의 크기는 다음과 같다. $$\begin{aligned} \angle APB &= 180^\circ - \angle AOB \ &= 180^\circ - 110^\circ \ &= 70^\circ \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "EXEMPT",
  "reason": "지름 원주각 90도, 호의 중심각 2배, 두 접선 사잇각 180-중심각 관계 연산 문항"
}

{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "지름 원주각으로 각 ACB=55도를 구하고 중심각 AOB=110도로부터 각 APB=180-110=70도를 계산한다.",
  "decisiveStep": "원주각 55도로부터 중심각 110도 산출 후 180도 보각 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각과 접선의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DIAMETER_INSCRIBED_TANGENT_ANGLE",
    "templateKey": "TPL_M3_DIAMETER_SUBTENDED_TWO_TANGENTS",
    "why": "지름 원주각과 두 접선 사잇각 공식을 결합하여 해결하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIAMETER",
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "반원 직각 성질과 접선 사각형의 보각 관계를 순차 연결하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "지름",
      "접선",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "원주각",
      "중심각",
      "보각"
    ],
    "condition": []
  },
  "hold": ""
}
Q08
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 선분 $\overline{PT}$는 원 $O$의 접선이고 점 $T$는 접점이다. $\angle TPO = 30^\circ$이고 선분 $\overline{PO}$가 원 $O$와 만나는 점을 $A$라 할 때 $\overline{PA} = 8\rm,cm$이다. 이때 접선 $\overline{PT}$의 길이는? [4점]
선지
① $6\sqrt{2}\rm,cm$ ② $6\sqrt{3}\rm,cm$ ③ $7\sqrt{3}\rm,cm$ ④ $8\sqrt{2}\rm,cm$ ⑤ $8\sqrt{3}\rm,cm$
정답
⑤
해설
직각삼각형의 특수각의 삼각비와 원의 반지름의 성질을 이용한다.


1단계: 선분 $\overline{PT}$는 접선이고 점 $T$는 접점이므로 반지름 $\overline{OT}$와 수직이다. $$\angle PTO = 90^\circ$$ 따라서 삼각형 $POT$는 $\angle TPO = 30^\circ, \angle PTO = 90^\circ$인 직각삼각형이다.


2단계: 직각삼각형에서 $30^\circ$의 대변은 빗변의 절반이므로 $$\overline{OT} = \overline{OP} \times \sin 30^\circ = \dfrac{1}{2} \overline{OP}$$ 원 $O$의 반지름의 길이를 $r$이라 하면 $\overline{OT} = r$이고, 점 $A$가 원 위의 점이므로 $\overline{OA} = r$이다. 선분 $\overline{OP}$는 다음과 같이 나타낼 수 있다. $$\overline{OP} = \overline{PA} + \overline{OA} = 8 + r$$ 따라서 등식을 세우면 다음과 같다. $$\begin{aligned} r &= \dfrac{1}{2}(8 + r) \ 2r &= 8 + r \ r &= 8\rm,cm \end{aligned}$$ 그러므로 $\overline{OP} = 8 + 8 = 16\rm,cm$이고 $\overline{OT} = 8\rm,cm$이다.


3단계: 직각삼각형 $POT$에서 피타고라스 정리 또는 삼각비를 이용하여 $\overline{PT}$의 길이를 구한다. $$\begin{aligned} \overline{PT} &= \overline{OP} \times \cos 30^\circ \ &= 16 \times \dfrac{\sqrt{3}}{2} \ &= 8\sqrt{3}\rm,cm \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "EXEMPT",
  "reason": "접선 직각삼각형 30도 특수각 비율과 반지름 분할 관계식 연립 문항"
}

{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "30도 직각삼각형에서 r=(8+r)/2로 반지름 r=8을 구하고 PT=16*cos30도=8sqrt(3)을 계산한다.",
  "decisiveStep": "빗변-대변 비율 방정식 r=(8+r)/2 풀이 및 삼각비 적용",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 접선과 삼각비"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_TANGENT_SPECIAL_ANGLE_LENGTH",
    "templateKey": "TPL_M3_TANGENT_30_DEGREE_RADIUS_EQUATION",
    "why": "30도 특수각 직각삼각형에서 반지름 방정식을 세워 접선 길이를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TRIG_SPECIAL_ANGLES",
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "특수각 삼각비와 원의 반지름 관계식을 연립하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "접선",
      "각",
      "선분"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "삼각비",
      "방정식",
      "반지름"
    ],
    "condition": []
  },
  "hold": ""
}
Q09
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 원 $I$는 $\angle C = 90^\circ$인 직각삼각형 $ABC$의 내접원이고, 세 점 $D, E, F$는 각각 변 $AB, BC, CA$와의 접점이다. $\overline{AB} = 20\rm,cm, \overline{AC} = 12\rm,cm$일 때, 내접원 $I$의 넓이는? [4점]
선지
① $12\pi\rm,cm^2$ ② $14\pi\rm,cm^2$ ③ $16\pi\rm,cm^2$ ④ $18\pi\rm,cm^2$ ⑤ $20\pi\rm,cm^2$
정답
③
해설
직각삼각형의 변의 길이와 내접원의 반지름 사이의 관계식을 이용한다.


1단계: 직각삼각형 $ABC$에서 빗변이 $\overline{AB} = 20\rm,cm$이고 $\overline{AC} = 12\rm,cm$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{BC} &= \sqrt{\overline{AB}^2 - \overline{AC}^2} \ &= \sqrt{20^2 - 12^2} \ &= \sqrt{400 - 144} \ &= \sqrt{256} \ &= 16\rm,cm \end{aligned}$$


2단계: 내접원의 반지름의 길이를 $r\rm,cm$라 하자. 점 $C$가 직각이므로 사각형 $IECF$는 한 변의 길이가 $r$인 정사각형이다. 따라서 $\overline{CE} = \overline{CF} = r$이다. 접선의 길이는 같으므로 $$\overline{AD} = \overline{AF} = 12 - r, \quad \overline{BD} = \overline{BE} = 16 - r$$ 빗변 $\overline{AB}$는 다음과 같다. $$\begin{aligned} \overline{AB} &= \overline{AD} + \overline{BD} \ 20 &= (12 - r) + (16 - r) \ 20 &= 28 - 2r \ 2r &= 8 \ r &= 4\rm,cm \end{aligned}$$ (공식 $r = \dfrac{a + b - c}{2} = \dfrac{12 + 16 - 20}{2} = 4\rm,cm$)


3단계: 따라서 내접원 $I$의 넓이는 다음과 같다. $$\begin{aligned} \text{넓이} &= \pi r^2 \ &= \pi \times 4^2 \ &= 16\pi\rm,cm^2 \end{aligned}$$ 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "피타고라스 정리로 직각삼각형 변을 구하고 내접원 반지름 공식 및 원의 넓이를 계산하는 문항"
}

{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "피타고라스 정리로 BC=16을 구하고 내접원 반지름 r=(12+16-20)/2=4를 도출하여 넓이 16pi를 계산한다.",
  "decisiveStep": "내접원 반지름 r=4 산출 및 넓이 pi*r^2 = 16pi 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "직각삼각형의 내접원의 반지름"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_INCIRCLE_RIGHT_TRIANGLE_AREA",
    "templateKey": "TPL_M3_RIGHT_TRIANGLE_INCIRCLE_RADIUS",
    "why": "직각삼각형의 세 변으로부터 내접원의 반지름과 넓이를 구하는 대표 템플릿"
  },
  "crossConceptKeys": [
    "CC_PYTHAGORAS",
    "CC_INCIRCLE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "피타고라스 정리와 직각삼각형 내접원 반지름 공식을 연계하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직각삼각형",
      "내접원",
      "변"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "피타고라스",
      "내접원반지름",
      "원넓이"
    ],
    "condition": []
  },
  "hold": ""
}
Q10
* 형식: 객관식
* 배점: 4
발문
다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고, 반원 위의 호가 $\wideparen{AC} = \wideparen{CD} = \wideparen{DE} = \wideparen{EF} = \wideparen{FB}$로 $5$등분되어 있다. 호 $\wideparen{DE}$를 바라보는 원주각을 $\angle x$, 호 $\wideparen{CD}$를 바라보는 원주각을 $\angle y$라 할 때, $\angle x + \angle y$의 크기는? [4점]
선지
① $30^\circ$ ② $32^\circ$ ③ $34^\circ$ ④ $36^\circ$ ⑤ $38^\circ$
정답
④
해설
호의 길이와 중심각, 원주각의 비례 관계를 이용한다.


1단계: 선분 $\overline{AB}$가 지름이므로 반원의 중심각의 크기는 $180^\circ$이다. 호 $AB$가 $5$개의 같은 길이의 호로 나누어져 있으므로, 한 호에 대한 중심각의 크기는 다음과 같다. $$\begin{aligned} 180^\circ \div 5 &= 36^\circ \end{aligned}$$


2단계: 원주각의 크기는 같은 호에 대한 중심각의 크기의 절반이다. 호 $\wideparen{DE}$의 중심각이 $36^\circ$이므로 원주각 $\angle x$의 크기는 다음과 같다. $$\angle x = \dfrac{36^\circ}{2} = 18^\circ$$ 마찬가지로 호 $\wideparen{CD}$의 중심각도 $36^\circ$이므로 원주각 $\angle y$의 크기는 다음과 같다. $$\angle y = \dfrac{36^\circ}{2} = 18^\circ$$


3단계: 따라서 두 각의 크기의 합은 다음과 같다. $$\begin{aligned} \angle x + \angle y &= 18^\circ + 18^\circ \ &= 36^\circ \end{aligned}$$ 따라서 정답은 ④이다.


{
  "status": "EXEMPT",
  "reason": "반원 호의 등분할에 따른 개별 중심각 계산 및 원주각 합산 문항"
}

{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "반원 180도를 5등분하여 호당 중심각 36도와 원주각 18도를 얻고 x+y=36도를 도출한다.",
  "decisiveStep": "등분 호 중심각 36도 산출 및 원주각 합 18도 + 18도 = 36도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각의 크기와 호의 길이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_EQUAL_ARCS_INSCRIBED_ANGLE_SUM",
    "templateKey": "TPL_M3_SEMI_CIRCLE_ARC_PARTITION_ANGLE",
    "why": "반원 둘레를 등분할한 호들의 원주각의 합을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIAMETER"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "반원 중심각 등분할과 원주각 1/2 공식을 단순 결합하는 기본 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "지름",
      "호",
      "등분"
    ],
    "goal": [
      "합",
      "각"
    ],
    "method": [
      "원주각",
      "비례배분"
    ],
    "condition": []
  },
  "hold": ""
}
Q11
* 형식: 객관식
* 배점: 5
발문
다음 그림에서 원 $O$는 $\triangle ABC$의 외접원이고, 선분 $\overline{AQ}$는 원 $O$의 지름이다. 꼭짓점 $A$에서 변 $\overline{BC}$에 내린 수선의 발을 $H$라 하자. $\overline{AB} = 12, \overline{AC} = 8, \overline{CH} = 4$일 때, 원 $O$의 반지름의 길이는? [5점]
선지
① $4\sqrt{3}$ ② $\dfrac{9\sqrt{3}}{2}$ ③ $5\sqrt{3}$ ④ $\dfrac{11\sqrt{3}}{2}$ ⑤ $6\sqrt{3}$
정답
①
해설
외접원의 지름에 대한 원주각과 삼각형의 닮음을 결합하여 외접원의 지름을 구한다.


1단계: 직각삼각형 $AHC$에서 $\overline{AC} = 8, \overline{CH} = 4$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{AH} &= \sqrt{\overline{AC}^2 - \overline{CH}^2} \ &= \sqrt{8^2 - 4^2} \ &= \sqrt{64 - 16} \ &= \sqrt{48} \ &= 4\sqrt{3} \end{aligned}$$


2단계: 점 $Q$와 점 $C$를 선분으로 잇는다. $\overline{AQ}$가 원 $O$의 지름이므로 지름에 대한 원주각에 의하여 $$\angle ACQ = 90^\circ$$ 또 $\overline{AH} \perp \overline{BC}$이므로 $\angle AHB = 90^\circ$이다. 호 $\wideparen{AC}$에 대한 원주각의 크기는 같으므로 $$\angle ABH = \angle ABC = \angle AQC$$ 따라서 두 직각삼각형은 두 각의 크기가 같으므로 닮음이다. $$\triangle ABH \sim \triangle AQC \quad (\text{AA 닮음})$$


3단계: 두 닮은 삼각형의 대응변의 길이의 비는 같으므로 $$\begin{aligned} \dfrac{\overline{AB}}{\overline{AQ}} &= \dfrac{\overline{AH}}{\overline{AC}} \ \dfrac{12}{\overline{AQ}} &= \dfrac{4\sqrt{3}}{8} \ \dfrac{12}{\overline{AQ}} &= \dfrac{\sqrt{3}}{2} \ \sqrt{3} \overline{AQ} &= 24 \ \overline{AQ} &= \dfrac{24}{\sqrt{3}} = 8\sqrt{3} \end{aligned}$$


4단계: 선분 $\overline{AQ}$는 원 $O$의 지름이므로 반지름의 길이는 다음과 같다. $$\begin{aligned} R &= \dfrac{\overline{AQ}}{2} \ &= \dfrac{8\sqrt{3}}{2} \ &= 4\sqrt{3} \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "EXEMPT",
  "reason": "외접원 지름 작도 후 AA 직각삼각형 닮음비 적용 외접원 반지름 산출 기하 문항"
}

{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "AH=4sqrt(3)을 구하고 삼각형 ABH와 AQC의 닮음비 12:AQ=4sqrt(3):8에서 지름 AQ=8sqrt(3), 반지름 4sqrt(3)을 도출한다.",
  "decisiveStep": "닮음비 12:AQ = sqrt(3):2 수립 및 반지름 4sqrt(3) 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각과 삼각형의 닮음"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_CIRCUMCIRCLE_DIAMETER_SIMILARITY",
    "templateKey": "TPL_M3_ALTITUDE_CIRCUMCIRCLE_DIAMETER_RATIO",
    "why": "수선의 높이와 외접원 지름을 연결하는 AA 닮음 표준형 템플릿"
  },
  "crossConceptKeys": [
    "CC_SIMILARITY",
    "CC_DIAMETER",
    "CC_PYTHAGORAS"
  ],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "피타고라스 연산, 원주각 일치 발견, AA 닮음비 유도를 통합적으로 수행해야 하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "외접원",
      "지름",
      "삼각형",
      "수선"
    ],
    "goal": [
      "반지름"
    ],
    "method": [
      "닮음",
      "피타고라스",
      "원주각"
    ],
    "condition": []
  },
  "hold": ""
}
Q12
* 형식: 객관식
* 배점: 3
발문
다음 각 자료 중에서 중앙값이 평균보다 자료 전체의 중심적인 경향을 더 잘 나타낸다고 볼 수 있는 것은? [3점]
선지
① $2, 4, 6, 8, 10, 12$ ② $5, 5, 5, 7, 7, 7$ ③ $3, 5, 5, 6, 50, 2, 2$ ④ $0.4, 0.6, 0.8, 0.5, 0.7, 0.3$ ⑤ $-1.5, -0.8, 0.2, 0.5, -0.4, 1.0$
정답
③
해설
자료에 극단적인 값(이상치)이 포함되어 있을 때 평균은 그 값에 크게 영향을 받아 전체 자료의 대표성을 잃게 되므로, 극단값의 영향을 받지 않는 중앙값이 대푯값으로 적절하다.


각 보기를 검토하면 다음과 같다. • ①, ②, ④, ⑤의 자료는 변량들이 특정 구간에 고르게 분포되어 있거나 대칭성을 띠므로 평균이 자료의 대푯값으로 적절하다. • ③의 자료 $3, 5, 5, 6, 50, 2, 2$에는 다른 값들에 비해 현저하게 큰 극단값 $50$이 포함되어 있다. 자료의 합을 구하면 $2 + 2 + 3 + 5 + 5 + 6 + 50 = 73$이 되어 평균은 $\dfrac{73}{7} \approx 10.43$으로 대부분의 자료($2\sim 6$)보다 훨씬 커진다. 반면 자료를 크기순으로 나열했을 때의 중앙값은 $5$로, 자료 대부분이 모여 있는 중심 위치를 매우 잘 반영한다.


따라서 중앙값이 평균보다 자료의 중심적 경향을 더 잘 나타내는 것은 ③이다. 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "자료의 극단치(이상치) 존재에 따른 대푯값(중앙값 vs 평균) 적합성 판별 문항"
}

{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "자료 3에 포함된 극단치 50이 평균을 왜곡함을 파악하여 중앙값 적합 자료로 판정한다.",
  "decisiveStep": "극단값 50의 존재로 인한 평균 왜곡 및 중앙값(5)의 대표성 식별",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "대푯값의 특성과 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_OUTLIER_REPRESENTATIVE_SELECTION",
    "templateKey": "TPL_M3_OUTLIER_MEDIAN_OVER_MEAN",
    "why": "극단값이 존재하는 데이터셋에서 중앙값의 비교우위를 판별하는 개념 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "극단값의 유무를 대조하여 중앙값의 필요성을 판별하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자료",
      "대푯값"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "중앙값",
      "평균",
      "이상치"
    ],
    "condition": [
      "극단값"
    ]
  },
  "hold": ""
}
Q13
* 형식: 객관식
* 배점: 4
발문
다음 표는 어느 중학교 학생 $40$명의 일주일 동안의 독서 시간을 조사하여 나타낸 것이다. 독서 시간의 중앙값을 $a$시간, 최빈값을 $b$시간이라 할 때, $a + b$의 값은? [4점]


독서 시간(시간)
	$3$
	$4$
	$5$
	$6$
	$7$
	합계
	학생 수(명)
	$4$
	$12$
	$8$
	$13$
	$3$
	$40$
	선지
① $9$ ② $9.5$ ③ $10$ ④ $10.5$ ⑤ $11$
정답
⑤
해설
도수분포표에서 누적도수를 이용하여 중앙값과 최빈값을 구한다.


1단계: 전체 학생 수가 $40$명(짝수)이므로 중앙값은 자료를 작은 값부터 차례로 나열했을 때 $20$번째와 $21$번째 값의 평균이다. 독서 시간별 누적도수를 계산하면 다음과 같다. • $3$시간 이하: $4$명 • $4$시간 이하: $4 + 12 = 16$명 • $5$시간 이하: $16 + 8 = 24$명 따라서 $17$번째부터 $24$번째까지의 자료의 값은 모두 $5$시간이다. 그러므로 $20$번째 자료와 $21$번째 자료의 값은 둘 다 $5$시간이다. $$\begin{aligned} a &= \dfrac{5 + 5}{2} \ &= 5\text{시간} \end{aligned}$$


2단계: 최빈값은 도수(학생 수)가 가장 큰 변량이다. 학생 수가 $13$명으로 가장 많은 독서 시간은 $6$시간이므로 $$b = 6\text{시간}$$


3단계: 따라서 구하고자 하는 $a + b$의 값은 다음과 같다. $$\begin{aligned} a + b &= 5 + 6 \ &= 11 \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "EXEMPT",
  "reason": "도수분포표 누적도수로부터 중앙값 및 최대도수 최빈값 계산 문항"
}

{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "누적도수로 20, 21번째 값 5시간(a=5)을 찾고 최대도수 13명의 6시간(b=6)을 더해 11을 구한다.",
  "decisiveStep": "누적도수 구간으로 중앙값 a=5 특정 및 b=6 합산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "도수분포표에서의 중앙값과 최빈값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_FREQUENCY_TABLE_MEDIAN_MODE",
    "templateKey": "TPL_M3_CUMULATIVE_FREQUENCY_MEDIAN_MODE_SUM",
    "why": "도수분포표에서 누적도수를 이용해 중앙값과 최빈값을 산출하는 표준형 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "누적도수 집계를 통해 짝수 개 중앙값과 최빈값을 차례로 도출하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표",
      "학생수",
      "변량"
    ],
    "goal": [
      "합",
      "대푯값"
    ],
    "method": [
      "중앙값",
      "최빈값",
      "누적도수"
    ],
    "condition": []
  },
  "hold": ""
}
Q14
* 형식: 객관식
* 배점: 4
발문
어느 음악 동호회 회원 $4$명의 나이를 작은 순서대로 나열하면 $22, x, 30, 30$ (단위: 살)이다. 이 회원들의 평균 나이가 $27$살일 때, 나이의 중앙값은? [4점]
선지
① $27$살 ② $28$살 ③ $28.5$살 ④ $29$살 ⑤ $29.5$살
정답
②
해설
평균으로부터 미지수 $x$를 구하고 중앙값의 정의를 적용한다.


1단계: 회원 수가 $4$명이고 평균 나이가 $27$살이므로, $4$명의 나이의 총합은 다음과 같다. $$\begin{aligned} \text{총합} &= 27 \times 4 \ &= 108\text{살} \end{aligned}$$


2단계: 주어진 나이의 합으로 방정식을 세우면 다음과 같다. $$\begin{aligned} 22 + x + 30 + 30 &= 108 \ x + 82 &= 108 \ x &= 26\text{살} \end{aligned}$$ $x = 26$은 $22 \le 26 \le 30$을 만족하므로 크기순으로 나열된 $4$명의 나이는 $22, 26, 30, 30$이다.


3단계: 자료가 $4$개(짝수 개)이므로 중앙값은 가운데 두 자료인 $26$과 $30$의 평균이다. $$\begin{aligned} \text{중앙값} &= \dfrac{26 + 30}{2} \ &= \dfrac{56}{2} \ &= 28\text{살} \end{aligned}$$ 따라서 정답은 ②이다.


{
  "status": "EXEMPT",
  "reason": "평균 총합 일차방정식으로 미지수 나이를 구한 뒤 짝수 개 중앙값 계산 대수 문항"
}

{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "총합 108에서 x=26을 구하고 가운데 두 값 26과 30의 평균 28살을 중앙값으로 산출한다.",
  "decisiveStep": "x=26 산출 후 중앙값 (26+30)/2=28 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "평균과 중앙값의 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_MEAN_TO_MEDIAN_RECOVERY",
    "templateKey": "TPL_M3_SUM_EQUATION_THEN_MEDIAN",
    "why": "평균으로부터 미지의 변량을 특정하고 중앙값을 산출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균 공식 역산과 짝수 개 중앙값 정의를 순차 적용하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료",
      "평균",
      "인원수"
    ],
    "goal": [
      "중앙값"
    ],
    "method": [
      "방정식",
      "평균",
      "중앙값"
    ],
    "condition": [
      "순서"
    ]
  },
  "hold": ""
}
Q15
* 형식: 객관식
* 배점: 5
발문
다음은 학생 $8$명이 체력 검사에서 실시한 턱걸이 횟수를 조사한 자료이다. 이 자료에 대한 설명 중 옳지 않은 것은? [5점] (단위: 회)


$$8, 5, 11, 7, 13, 6, 9, 5$$
선지
① 평균은 $8$회이다. ② 편차의 제곱의 합은 $58$이다. ③ 분산은 $\dfrac{29}{4}$이다. ④ 평균보다 큰 값의 변량은 $4$개이다. ⑤ 표준편차는 $\dfrac{\sqrt{29}}{2}$회이다.
정답
④
해설
평균, 편차, 분산, 표준편차를 순차적으로 계산하고 각 보기를 검증한다.


1단계: $8$개 자료의 총합은 다음과 같다. $$8 + 5 + 11 + 7 + 13 + 6 + 9 + 5 = 64$$ 따라서 평균은 다음과 같다. $$\text{평균} = \dfrac{64}{8} = 8\text{회} \quad (\text{① 참})$$


2단계: 평균 $8$회보다 큰 값을 갖는 변량을 찾으면 다음과 같다. $$9, 11, 13$$ 따라서 평균보다 큰 값의 변량은 $3$개이다. 그러므로 '$4$개이다'라고 한 ④는 옳지 않다. (④ 거짓)


3단계: 각 변량의 편차(변량 - 평균)를 구하면 각각 다음과 같다. $$0, -3, 3, -1, 5, -2, 1, -3$$ 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차제곱합} &= 0^2 + (-3)^2 + 3^2 + (-1)^2 + 5^2 + (-2)^2 + 1^2 + (-3)^2 \ &= 0 + 9 + 9 + 1 + 25 + 4 + 1 + 9 \ &= 58 \quad (\text{② 참}) \end{aligned}$$


4단계: 분산과 표준편차를 구하면 다음과 같다. $$\begin{aligned} \text{분산} &= \dfrac{58}{8} = \dfrac{29}{4} \quad (\text{③ 참}) \ \text{표준편차} &= \sqrt{\dfrac{29}{4}} = \dfrac{\sqrt{29}}{2}\text{회} \quad (\text{⑤ 참}) \end{aligned}$$ 따라서 옳지 않은 것은 ④이다. 따라서 정답은 ④이다.


{
  "status": "EXEMPT",
  "reason": "자료의 평균, 편차제곱합, 분산, 표준편차 및 변량 개수 판별 감사 문항"
}

{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "평균 8회를 구하고 8보다 큰 변량이 9, 11, 13의 3개임을 확인하여 선지 4번의 오류를 식별한다.",
  "decisiveStep": "평균 초과 변량이 3개임을 카운팅하여 4번 진술(4개) 오류 판정",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "분산과 표준편차의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_VARIANCE_PROPERTY_AUDIT",
    "templateKey": "TPL_M3_STATISTICS_MULTI_CLAIM_AUDIT",
    "why": "데이터셋의 대푯값과 산포도 관련 5가지 진술의 참거짓을 종합 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균, 편차, 분산, 표준편차의 계산 과정을 종합적으로 확인하는 5점 배점 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자료",
      "변량"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "평균",
      "편차",
      "분산",
      "표준편차"
    ],
    "condition": []
  },
  "hold": ""
}
Q16
* 형식: 객관식
* 배점: 4
발문
다음 표는 어느 치과에서 환자 $5$명의 접수 후 대기 시간에 대한 편차를 조사하여 나타낸 것이다. 대기 시간의 평균이 $16$분일 때, 환자 B의 대기 시간을 구하면? [4점]


환자
	A
	B
	C
	D
	E
	편차(분)
	$8$
	$x$
	$4$
	$-6$
	$-3$
	선지
① $9$분 ② $10$분 ③ $11$분 ④ $12$분 ⑤ $13$분
정답
⑤
해설
편차의 총합은 항상 $0$이라는 성질을 이용하여 미지수 $x$를 구한다.


1단계: 편차의 합은 항상 $0$이므로 다음 등식이 성립한다. $$\begin{aligned} 8 + x + 4 + (-6) + (-3) &= 0 \ x + 3 &= 0 \ x &= -3\text{분} \end{aligned}$$ 따라서 환자 B의 편차는 $-3$분이다.


2단계: 편차의 정의는 (변량) - (평균)이므로 $$\text{변량} = \text{평균} + \text{편차}$$ 대기 시간의 평균이 $16$분이므로 환자 B의 대기 시간은 다음과 같다. $$\begin{aligned} \text{B의 대기 시간} &= 16 + (-3) \ &= 13\text{분} \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "EXEMPT",
  "reason": "편차의 합이 0임을 이용한 미지수 편차 산출 및 변량 역산 대수 문항"
}

{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "편차합 0으로부터 x=-3을 구하고 평균 16에 편차 -3을 더해 B의 대기시간 13분을 계산한다.",
  "decisiveStep": "편차합 방정식 x+3=0에서 x=-3 도출 및 16+(-3)=13 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "편차의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DEVIATION_SUM_ZERO",
    "templateKey": "TPL_M3_DEVIATION_TABLE_VARIABLE_RECOVERY",
    "why": "편차의 총합이 0임을 이용하여 표의 미지수와 해당 변량을 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "편차합 0의 기본 성질을 적용하는 1단계 대수 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "편차표",
      "평균"
    ],
    "goal": [
      "변량"
    ],
    "method": [
      "편차합",
      "방정식"
    ],
    "condition": []
  },
  "hold": ""
}
Q17
* 형식: 객관식
* 배점: 4
발문
다음 두 조건을 모두 만족시키는 상수 $a, b$에 대하여 $a + b$의 값은? [4점]


• (가) $5$개의 변량 $6, 9, 14, 16, a$의 중앙값은 $9$이다. • (나) $5$개의 변량 $3, 16, a, b, 15$의 중앙값은 $13$이고, 평균은 $b - 2$이다.
선지
① $21$ ② $22$ ③ $23$ ④ $24$ ⑤ $25$
정답
①
해설
중앙값의 순위 조건과 평균의 정의를 연립하여 $a, b$를 구한다.


1단계: 조건 (가)에서 $a$를 제외한 $4$개의 자료는 $6, 9, 14, 16$이다. $5$개 자료의 중앙값이 $9$가 되려면 자료를 크기순으로 나열했을 때 $3$번째 자료가 $9$이어야 한다. 이미 $9$보다 큰 자료가 $14, 16$의 $2$개 있으므로, $a$는 $9$ 이하이어야 한다. $$a \le 9$$


2단계: 조건 (나)의 자료는 $3, 16, a, b, 15$이다. $a \le 9$이므로 $5$개의 자료 중 $3, a$는 $13$보다 작고, $15, 16$은 $13$보다 크다. 따라서 $5$개 자료의 정중앙인 $3$번째 자료는 반드시 $b$이어야 한다. 중앙값이 $13$이라고 하였으므로 $$b = 13$$


3단계: 조건 (나)에서 평균은 $b - 2 = 13 - 2 = 11$이다. $5$개 자료의 총합은 다음과 같다. $$\text{총합} = 11 \times 5 = 55$$ 따라서 다음 일차방정식이 성립한다. $$\begin{aligned} 3 + 16 + a + 13 + 15 &= 55 \ a + 47 &= 55 \ a &= 8 \end{aligned}$$ $a = 8$은 $a \le 9$를 만족한다.


4단계: 따라서 구하고자 하는 $a + b$의 값은 다음과 같다. $$\begin{aligned} a + b &= 8 + 13 \ &= 21 \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "EXEMPT",
  "reason": "중앙값 순서 부등식 조건 분석 및 평균 일차방정식 연립 대수 추론 문항"
}

{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "a<=9 조건으로부터 b=13을 특정하고 평균 11의 총합 방정식 a+47=55에서 a=8을 얻어 21을 구한다.",
  "decisiveStep": "a<=9 조건으로 b=13 결정 후 총합 55에서 a=8 산출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "대푯값",
    "l4": "중앙값과 평균의 연립 추론"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_DUAL_CONDITION_MEDIAN_MEAN",
    "templateKey": "TPL_M3_TWO_DATASET_MEDIAN_RANK_INFERENCE",
    "why": "두 데이터셋의 중앙값 순서 관계와 평균을 결합하여 두 변수를 결정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 영역 추론과 평균 일차방정식을 다단계로 연계하는 복합 추론 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "자료",
      "중앙값",
      "평균"
    ],
    "goal": [
      "합",
      "변수"
    ],
    "method": [
      "부등식",
      "추론",
      "방정식"
    ],
    "condition": [
      "순위"
    ]
  },
  "hold": ""
}
Q18
* 형식: 객관식
* 배점: 4
발문
※ 다음 산점도는 학생 $15$명의 국어 수행평가에서 말하기 점수($x$점)와 쓰기 점수($y$점)를 각각 $10$점 만점으로 조사하여 나타낸 것이다. [18-19]


• 산점도의 점 $(x, y)$ $15$개: $(4, 5), (5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (7, 8),$ $(8, 6), (8, 7), (8, 8), (8, 9), (9, 8), (9, 9), (10, 9)$


위 산점도에서 쓰기 점수($y$점)의 최빈값을 구하면? [4점]
선지
① $7$점 ② $8$점 ③ $8.5$점 ④ $9$점 ⑤ $10$점
정답
②
해설
산점도의 세로축 좌표(쓰기 점수 $y$)의 빈도를 세어 최빈값을 구한다.


1단계: 주어진 $15$개의 점에 대하여 쓰기 점수 $y$의 값을 정리하면 다음과 같다. • $y = 5$점: $(4, 5), (6, 5)$ $\implies 2$명 • $y = 6$점: $(5, 6), (7, 6), (8, 6)$ $\implies 3$명 • $y = 7$점: $(6, 7), (7, 7), (8, 7)$ $\implies 3$명 • $y = 8$점: $(7, 8), (7, 8), (8, 8), (9, 8)$ $\implies 4$명 • $y = 9$점: $(8, 9), (9, 9), (10, 9)$ $\implies 3$명


2단계: 학생 수가 가장 많은 점수는 $8$점($4$명)이다. 따라서 쓰기 점수의 최빈값은 $8$점이다. 따라서 정답은 ②이다.


{
  "status": "EXEMPT",
  "reason": "산점도 격자점의 세로축 좌표 빈도수 집계 및 최빈값 도출 문항"
}

{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_DATA_INTERPRETATION",
  "conceptClusterKey": "STATISTICS_DATA_INTERPRETATION",
  "primaryMethod": "산점도의 y좌표 빈도를 집계하여 8점이 4명으로 가장 많음을 확인하고 최빈값 8점을 결정한다.",
  "decisiveStep": "y=8에 대응하는 점 4개 확인 및 최빈값 8점 판정",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "상관관계",
    "l3": "산점도와 상관관계",
    "l4": "산점도에서의 대푯값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_SCATTER_PLOT_MODE",
    "templateKey": "TPL_M3_SCATTER_COORDINATE_FREQUENCY_MODE",
    "why": "산점도의 한 축 좌표들의 빈도를 세어 최빈값을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SCATTER_PLOT"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "산점도에서 세로선 또는 가로선 상의 점의 개수를 세어 최빈값을 찾는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "산점도",
      "변량"
    ],
    "goal": [
      "최빈값"
    ],
    "method": [
      "빈도",
      "해석"
    ],
    "condition": []
  },
  "hold": ""
}
Q19
* 형식: 객관식
* 배점: 4
발문
[18-19 공통자료] 위 산점도에서 말하기 점수($x$점)와 쓰기 점수($y$점)가 모두 $8$점 이상인 학생은 몇 명인가? [4점]
선지
① $2$명 ② $3$명 ③ $4$명 ④ $5$명 ⑤ $6$명
정답
④
해설
산점도에서 영역 부등식 $x \ge 8$과 $y \ge 8$을 동시에 만족하는 점의 개수를 센다.


1단계: 주어진 $15$개의 점 $(x, y)$ 중 $x \ge 8$이고 $y \ge 8$인 점을 찾는다. • $(8, 8)$: $x = 8 \ge 8, y = 8 \ge 8$ (만족) • $(8, 9)$: $x = 8 \ge 8, y = 9 \ge 8$ (만족) • $(9, 8)$: $x = 9 \ge 8, y = 8 \ge 8$ (만족) • $(9, 9)$: $x = 9 \ge 8, y = 9 \ge 8$ (만족) • $(10, 9)$: $x = 10 \ge 8, y = 9 \ge 8$ (만족)


2단계: 나머지 점들을 확인하면 다음과 같다. • $(8, 6), (8, 7)$은 $y < 8$이므로 만족하지 않는다. • $x < 8$인 나머지 점들은 모두 조건을 만족하지 않는다.


따라서 두 점수가 모두 $8$점 이상인 학생은 정확히 $5$명이다. 따라서 정답은 ④이다.


{
  "status": "EXEMPT",
  "reason": "산점도에서 두 변량의 연립 부등식 x>=8, y>=8 영역에 속하는 점의 개수 산출 문항"
}

{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_DATA_INTERPRETATION",
  "conceptClusterKey": "STATISTICS_DATA_INTERPRETATION",
  "primaryMethod": "x>=8 및 y>=8 조건을 동시에 만족하는 5개 격자점을 선별하여 인원수 5명을 구한다.",
  "decisiveStep": "조건 만족 점 (8,8), (8,9), (9,8), (9,9), (10,9) 5개 식별",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "상관관계",
    "l3": "산점도와 상관관계",
    "l4": "산점도에서의 영역별 빈도 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_SCATTER_PLOT_INEQUALITY_COUNT",
    "templateKey": "TPL_M3_SCATTER_TWO_VARIABLE_THRESHOLD_COUNT",
    "why": "산점도에서 두 변량의 임계값 이상인 점의 개수를 세는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SCATTER_PLOT"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 영역에 해당하는 점의 개수를 직접 카운팅하는 1단계 해석 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "산점도",
      "조건"
    ],
    "goal": [
      "인원수"
    ],
    "method": [
      "부등식",
      "카운팅"
    ],
    "condition": [
      "이상"
    ]
  },
  "hold": ""
}
Q20
* 형식: 객관식
* 배점: 4
발문
다음 산점도는 학생 $15$명의 음악 실기 점수($x$점)와 미술 실기 점수($y$점)를 조사하여 나타낸 것이다. 음악 점수보다 미술 점수가 더 높은 학생의 비율은? [4점]


• 산점도의 점 $(x, y)$ $15$개: $(5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (8, 6), (8, 7),$ $(8, 8), (8, 9), (9, 7), (9, 9), (9, 10), (10, 8), (10, 10)$
선지
① $\dfrac{1}{5}$ ② $\dfrac{4}{15}$ ③ $\dfrac{1}{3}$ ④ $\dfrac{2}{5}$ ⑤ $\dfrac{7}{15}$
정답
③
해설
산점도에서 직선 $y = x$를 기준으로 위쪽에 위치하는 점의 비율을 구한다.


1단계: 음악 실기 점수를 $x$, 미술 실기 점수를 $y$라 할 때, 음악 점수보다 미술 점수가 더 높다는 조건은 다음과 같다. $$y > x$$ 즉, 산점도에서 기준 직선 $y = x$보다 위쪽에 위치하는 점을 찾으면 된다.


2단계: 주어진 $15$개의 점 중 $y > x$를 만족하는 점은 다음과 같다. • $(6, 7)$: $7 > 6$ • $(7, 8)$: $8 > 7$ • $(8, 9)$: $9 > 8$ • $(9, 10)$: $10 > 9$ • $(6, 8)$... 어, 위 목록 중: $(6, 7) \implies 7 > 6$ (만족) $(7, 8) \implies 8 > 7$ (만족) $(8, 9) \implies 9 > 8$ (만족) $(9, 10) \implies 10 > 9$ (만족) 그 외에 $y > x$인 점이 하나 더 있어야 5명이 된다! 점 목록을 다시 점검하자: $(5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (8, 6), (8, 7), (8, 8), (8, 9), (9, 7), (9, 9), (9, 10), (10, 8), (10, 10)$ 여기서 $y > x$인 점: $(5, 6): 6 > 5$ $(6, 7): 7 > 6$ $(7, 8): 8 > 7$ $(8, 9): 9 > 8$ $(9, 10): 10 > 9$ 정확히 $5$명! 나머지 $10$명: $y = x$: $(7, 7), (8, 8), (9, 9), (10, 10)$ (4명) $y < x$: $(6, 5), (7, 6), (8, 6), (8, 7), (9, 7), (10, 8)$ (6명) 총합 $5 + 4 + 6 = 15$명!


3단계: 전체 학생 수는 $15$명이므로 구하는 비율은 다음과 같다. $$\begin{aligned} \text{비율} &= \dfrac{5}{15} \ &= \dfrac{1}{3} \end{aligned}$$ 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "산점도에서 직선 y=x 상방 영역 점의 개수 집계 및 비율 산출 문항"
}

{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_DATA_INTERPRETATION",
  "conceptClusterKey": "STATISTICS_DATA_INTERPRETATION",
  "primaryMethod": "기준 직선 y=x 위쪽 영역의 점 5개를 식별하여 전체 15명 중 비율 5/15=1/3을 도출한다.",
  "decisiveStep": "y>x 만족 점 5개 식별 후 5/15=1/3 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "상관관계",
    "l3": "산점도와 상관관계",
    "l4": "산점도에서의 비율 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_SCATTER_DIAGONAL_RATIO",
    "templateKey": "TPL_M3_SCATTER_Y_GREATER_THAN_X_PROPORTION",
    "why": "산점도에서 대각선 y=x 기준 상방 점의 비율을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SCATTER_PLOT"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대각선 경계선을 기준으로 부등식 영역을 해석하고 비율을 분수로 나타내는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "산점도",
      "변량"
    ],
    "goal": [
      "비율"
    ],
    "method": [
      "부등식",
      "해석",
      "비율"
    ],
    "condition": [
      "대소관계"
    ]
  },
  "hold": ""
}
Q21
* 형식: 서술형
* 배점: 7
발문
서술형1. 다음 그림과 같이 한 변의 길이가 $12\rm,cm$인 정사각형 $ABCD$에서 원 $O$가 두 변 $AB, AD$에 접하고 나머지 두 변 $BC, DC$와 각각 두 점에서 만난다. 원 $O$와 변 $\overline{BC}$의 두 교점을 $P, Q$라 하자. $\overline{BP} = 2\rm,cm, \overline{PC} = 10\rm,cm$일 때, 선분 $\overline{PQ}$의 길이를 구하는 과정과 답을 서술하시오. (7점)
정답
$24 - 8\sqrt{3}\rm,cm$
해설
정사각형의 접선 성질과 현의 수직이등분 성질을 직각삼각형 피타고라스 정리와 연립하여 서술한다.


1단계: 정사각형 $ABCD$의 한 변의 길이는 $\overline{BC} = \overline{BP} + \overline{PC} = 2 + 10 = 12\rm,cm$이다. 원 $O$의 반지름의 길이를 $r\rm,cm$라 하고, 원의 중심 $O$에서 현 $\overline{PQ}$에 내린 수선의 발을 $M$이라 하자.


2단계: 원 $O$가 정사각형의 두 변 $\overline{AB}, \overline{AD}$에 접하므로 원의 중심 $O$의 좌표를 점 $B$를 원점으로 하여 잡으면 $O(r, 12 - r)$이다. 따라서 $\overline{BM} = r$이고, 중심 $O$에서 변 $\overline{BC}$까지의 거리는 $\overline{OM} = 12 - r$이다. 점 $P$에 대하여 $\overline{BP} = 2$이므로 선분 $\overline{PM}$의 길이는 다음과 같다. $$\overline{PM} = \overline{BM} - \overline{BP} = r - 2$$


3단계: 점 $P$는 원 $O$ 위의 점이므로 $\overline{OP} = r$이다. 직각삼각형 $OMP$에서 피타고라스 정리에 의하여 $$\begin{aligned} \overline{OP}^2 &= \overline{OM}^2 + \overline{PM}^2 \ r^2 &= (12 - r)^2 + (r - 2)^2 \ r^2 &= (144 - 24r + r^2) + (r^2 - 4r + 4) \ r^2 &= 2r^2 - 28r + 148 \ r^2 - 28r + 148 &= 0 \end{aligned}$$ 근의 공식에 의하여 $r$의 값을 구하면 $$\begin{aligned} r &= -(-14) \pm \sqrt{(-14)^2 - 148} \ &= 14 \pm \sqrt{196 - 148} \ &= 14 \pm \sqrt{48} \ &= 14 \pm 4\sqrt{3} \end{aligned}$$ 원의 반지름 $r$은 정사각형의 한 변의 길이($12\rm,cm$)보다 작아야 하므로 $$r = 14 - 4\sqrt{3}\rm,cm$$


4단계: 원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 점 $M$은 현 $\overline{PQ}$의 중점이다. 따라서 $\overline{PQ}$의 길이는 다음과 같다. $$\begin{aligned} \overline{PQ} &= 2 \times \overline{PM} \ &= 2(r - 2) \ &= 2((14 - 4\sqrt{3}) - 2) \ &= 2(12 - 4\sqrt{3}) \ &= 24 - 8\sqrt{3}\rm,cm \end{aligned}$$ 따라서 구하는 선분 $\overline{PQ}$의 길이는 $24 - 8\sqrt{3}\rm,cm$이다.


{
  "status": "EXEMPT",
  "reason": "정사각형 내접-할선 원의 중심 좌표화, 현의 이등분 및 피타고라스 이차방정식 서술 문항"
}

{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_LINE",
  "conceptClusterKey": "CIRCLE_LINE",
  "primaryMethod": "중심거리 OM=12-r과 PM=r-2로 피타고라스 이차방정식 r^2-28r+148=0을 풀어 r=14-4sqrt(3), PQ=24-8sqrt(3)을 도출한다.",
  "decisiveStep": "피타고라스 이차방정식 수립 및 근의 공식으로 r=14-4sqrt(3) 산출",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원과 직선",
    "l4": "원의 접선과 현의 길이의 종합 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_SQUARE_INSCRIBED_SECANT_CHORD",
    "templateKey": "TPL_M3_SQUARE_TANGENT_SECANT_QUADRATIC",
    "why": "정사각형에 접하면서 변과 만나는 원의 현 길이를 이차방정식으로 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_QUADRATIC_EQUATION",
    "CC_PYTHAGORAS",
    "CC_TANGENCY"
  ],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기하적 대칭성 모델링, 이차방정식 유도 및 무리수 근 판별까지 요구하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "정사각형",
      "원",
      "접선",
      "교점"
    ],
    "goal": [
      "길이",
      "현"
    ],
    "method": [
      "피타고라스",
      "이차방정식",
      "근의공식"
    ],
    "condition": [
      "범위"
    ]
  },
  "hold": ""
}
Q22
* 형식: 서술형
* 배점: 6
발문
서술형2. 다음 그림과 같이 원 $O$ 위의 네 점 $A, B, C, D$에 대하여 호의 길이가 $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이다. 두 선분 $\overline{AB}$와 $\overline{DC}$의 연장선의 교점을 $E$라 할 때 $\angle E = 36^\circ$이다. 두 현 $\overline{AC}$와 $\overline{BD}$의 교점을 $F$라 할 때, $\angle AFD$의 크기를 구하는 과정과 답을 서술하시오. (6점)
정답
$72^\circ$
해설
호의 중심각과 원주각의 관계를 미지수로 두고 삼각형의 내각의 합을 이용하여 서술한다.


1단계: 세 호 $\wideparen{AB}, \wideparen{BC}, \wideparen{CD}$의 길이가 같으므로, 각 호에 대한 원주각의 크기를 각각 $x^\circ$라 하자. 그러면 호에 대한 원주각의 크기에 의하여 $$\begin{aligned} \angle BAC &= \angle CAD = x^\circ \ \angle ADB &= \angle BDC = x^\circ \end{aligned}$$ 호 $\wideparen{BCD}$의 길이는 두 호의 합이므로 호 $\wideparen{BCD}$에 대한 원주각 $\angle BAD = 2x^\circ$이다.


2단계: 세 점 $E, A, B$가 한 직선 위에 있으므로 $$\begin{aligned} \angle EAD &= 180^\circ - \angle BAD \ &= 180^\circ - 2x^\circ \end{aligned}$$ 마찬가지로 세 점 $E, D, C$가 한 직선 위에 있고 호 $\wideparen{ABC}$에 대한 원주각 $\angle ADC = 2x^\circ$이므로 $$\begin{aligned} \angle ADE &= 180^\circ - \angle ADC \ &= 180^\circ - 2x^\circ \end{aligned}$$


3단계: 삼각형 $EAD$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle E + \angle EAD + \angle ADE &= 180^\circ \ 36^\circ + (180^\circ - 2x^\circ) + (180^\circ - 2x^\circ) &= 180^\circ \ 36^\circ + 360^\circ - 4x^\circ &= 180^\circ \ 4x &= 216 \ x &= 54 \end{aligned}$$ 따라서 한 호에 대한 원주각의 크기는 $54^\circ$이다.


4단계: 삼각형 $AFD$에서 $$\angle FAD = \angle CAD = x^\circ = 54^\circ, \quad \angle FDA = \angle BDA = x^\circ = 54^\circ$$ 삼각형 $AFD$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle AFD &= 180^\circ - (\angle FAD + \angle FDA) \ &= 180^\circ - (54^\circ + 54^\circ) \ &= 180^\circ - 108^\circ \ &= 72^\circ \end{aligned}$$ 따라서 구하는 각 $\angle AFD$의 크기는 $72^\circ$이다.


{
  "status": "EXEMPT",
  "reason": "동일 호 원주각 미지수화, 외각 삼각형 내각합 방정식 및 교각 계산 서술 문항"
}

{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-06",
  "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE",
  "conceptClusterKey": "CIRCLE_INSCRIBED_ANGLE",
  "primaryMethod": "호당 원주각 x에 대해 36+2(180-2x)=180에서 x=54도를 구하고 삼각형 AFD에서 각 AFD=180-108=72도를 도출한다.",
  "decisiveStep": "삼각형 EAD 내각합 방정식 4x=216 풀이 및 x=54도에서 72도 계산",
  "rpm": {
    "majorUnit": "기하",
    "midUnit": "원의 성질",
    "l3": "원주각",
    "l4": "원주각과 현의 연장선의 교각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_EQUAL_CHORD_EXTERIOR_ANGLE",
    "templateKey": "TPL_M3_CONSECUTIVE_EQUAL_ARCS_INTERSECTION",
    "why": "연속된 동일 호의 원주각과 연장선 교각을 연립하여 대각선 교각을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_INSCRIBED_QUAD"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원주각의 비례 표현과 두 삼각형의 내각합 관계를 연립하여 증명 서술하는 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "호",
      "교점",
      "각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "원주각",
      "내각합",
      "방정식"
    ],
    "condition": [
      "동일호"
    ]
  },
  "hold": ""
}
Q23
* 형식: 서술형
* 배점: 7
발문
서술형3. 양수 $a$에 대하여 다음 $5$개의 자료의 분산이 $6$일 때, 이 자료의 평균을 구하는 과정과 답을 서술하시오. (7점)


$$2, 2a, a-2, a+5, a$$
정답
$2 + \sqrt{2}$
해설
평균을 미지수 $a$로 나타내고 각 변량의 편차를 구하여 분산 공식으로 $a$를 구한다.


1단계: 주어진 $5$개의 자료 $2, 2a, a-2, a+5, a$의 총합을 구하면 다음과 같다. $$\begin{aligned} \text{총합} &= 2 + 2a + (a - 2) + (a + 5) + a \ &= 5a + 5 \end{aligned}$$ 따라서 자료의 평균은 다음과 같다. $$\begin{aligned} m &= \dfrac{5a + 5}{5} \ &= a + 1 \end{aligned}$$


2단계: 평균 $a + 1$에 대한 각 변량의 편차(변량 - 평균)를 구하면 다음과 같다. $$\begin{aligned} 2 - (a + 1) &= 1 - a \ 2a - (a + 1) &= a - 1 \ (a - 2) - (a + 1) &= -3 \ (a + 5) - (a + 1) &= 4 \ a - (a + 1) &= -1 \end{aligned}$$


3단계: 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차제곱합} &= (1 - a)^2 + (a - 1)^2 + (-3)^2 + 4^2 + (-1)^2 \ &= (a - 1)^2 + (a - 1)^2 + 9 + 16 + 1 \ &= 2(a - 1)^2 + 26 \end{aligned}$$


4단계: 자료의 분산이 $6$이므로 분산 공식에 대입하면 다음과 같다. $$\begin{aligned} \dfrac{2(a - 1)^2 + 26}{5} &= 6 \ 2(a - 1)^2 + 26 &= 30 \ 2(a - 1)^2 &= 4 \ (a - 1)^2 &= 2 \ a - 1 &= \pm\sqrt{2} \ a &= 1 \pm \sqrt{2} \end{aligned}$$ 조건에서 $a$는 양수이고 $1 - \sqrt{2} < 0$이므로 $$a = 1 + \sqrt{2}$$


5단계: 따라서 구하고자 하는 자료의 평균은 다음과 같다. $$\begin{aligned} \text{평균} &= a + 1 \ &= (1 + \sqrt{2}) + 1 \ &= 2 + \sqrt{2} \end{aligned}$$ 따라서 구하는 평균은 $2 + \sqrt{2}$이다.


{
  "status": "EXEMPT",
  "reason": "변수가 포함된 5개 변량의 평균 표현, 편차제곱합 계산 및 분산 이차방정식 서술 문항"
}

{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중3",
  "courseKey": "MID-MATH-3",
  "curriculum": "2015",
  "standardUnitKey": "M3-07",
  "subUnitKey": "M3-07-STATISTICS_REPRESENTATIVE",
  "conceptClusterKey": "STATISTICS_REPRESENTATIVE",
  "primaryMethod": "평균 a+1과 편차제곱합 2(a-1)^2+26을 세워 분산 방정식 2(a-1)^2+26=30에서 a=1+sqrt(2), 평균 2+sqrt(2)를 도출한다.",
  "decisiveStep": "분산 방정식 (a-1)^2=2 풀이 및 양수 조건으로 a=1+sqrt(2), 평균 2+sqrt(2) 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "대푯값과 산포도",
    "l3": "산포도",
    "l4": "분산의 계산과 식의 값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M3_VARIANCE_ALGEBRAIC_VARIABLE",
    "templateKey": "TPL_M3_VARIANCE_QUADRATIC_RECOVERY_MEAN",
    "why": "문자가 포함된 변량의 분산 방정식으로부터 변수를 구하고 평균을 도출하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_QUADRATIC_EQUATION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문자 변량의 평균식, 편차식 전개, 분산 방정식 풀이 및 무리수 평균 도출의 다단계 서술 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "변량",
      "분산",
      "양수조건"
    ],
    "goal": [
      "평균"
    ],
    "method": [
      "평균",
      "편차",
      "분산",
      "이차방정식"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": ""
}
