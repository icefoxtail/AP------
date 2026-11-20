{
  "stem": "24_왕운중_2학기_기말_중1_유사",
  "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js",
  "examFolder": "2final",
  "grade": "중1",
  "curriculum": "2015",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
Q01
* 형식: 객관식
* 배점: 3
발문
다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다. $\angle A = 90^\circ, \angle B = 25^\circ, \angle D = 55^\circ$일 때, $\angle E = \angle x$의 크기는? [3점]
선지
① $60^\circ$ ② $65^\circ$ ③ $70^\circ$ ④ $75^\circ$ ⑤ $80^\circ$
정답
①
해설
왼쪽 직각삼각형 $ABC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 25^\circ \ &= 65^\circ \end{aligned}$$ 교점 $C$에서 서로 마주 보는 맞꼭지각의 크기는 서로 같으므로 $$\begin{aligned} \angle DCE &= \angle ACB = 65^\circ \end{aligned}$$ 오른쪽 삼각형 $CDE$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle x &= 180^\circ - 55^\circ - 65^\circ \ &= 60^\circ \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "UNSUPPORTED",
  "reason": "교점 C에서 맞꼭지각을 이루며 만나는 두 삼각형 다이어그램"
}

{
  "sourceQid": "1",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "직각삼각형 ABC에서 내각합으로 각 ACB=65도를 구하고, 맞꼭지각 성질로 각 DCE=65도를 얻은 뒤 삼각형 CDE의 내각합으로 x=60도를 도출한다.",
  "decisiveStep": "교점 C에서 맞꼭지각 각 DCE = 65도 산출 및 적용",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "삼각형·다각형의 각",
    "l4": "각의 크기 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_ANGLE_CONDITION",
    "templateKey": "TPL_M1_TRIANGLE_ANGLE_CONDITION_EXTERIOR_SUM",
    "why": "맞꼭지각과 삼각형 내각합을 연쇄 적용하여 각을 계산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_VERTICAL_ANGLES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "내각의 합과 맞꼭지각 성질을 2단계로 연계 계산하는 기본 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "각",
      "직각삼각형"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "맞꼭지각",
      "내각"
    ],
    "condition": []
  },
  "hold": ""
}
Q02
* 형식: 객관식
* 배점: 4
발문
다음 <조건>을 모두 만족시키는 다각형은? [4점]


• (가) 모든 변의 길이가 같고, 모든 내각의 크기가 같다. • (나) 한 내각의 크기와 그 내각과 이웃한 외각의 크기의 비가 $4 : 1$이다.
선지
① 정팔각형 ② 정십각형 ③ 정십이각형 ④ 정십오각형 ⑤ 정이십각형
정답
②
해설
정다각형의 한 꼭짓점에서 내각과 이웃한 외각의 크기의 합은 $180^\circ$이다. 내각과 외각의 크기의 비가 $4 : 1$이므로 한 외각의 크기는 다음과 같다. $$\begin{aligned} \text{한 외각의 크기} &= 180^\circ \times \dfrac{1}{4+1} \ &= 180^\circ \times \dfrac{1}{5} \ &= 36^\circ \end{aligned}$$ 정다각형의 모든 외각의 크기의 합은 항상 $360^\circ$이므로 변의 개수를 $n$이라 하면 $$\begin{aligned} n &= \dfrac{360^\circ}{36^\circ} \ &= 10 \end{aligned}$$ 따라서 구하는 다각형은 정십각형이다. 따라서 정답은 ②이다.


{
  "status": "EXEMPT",
  "reason": "정다각형 내각과 외각의 비를 이용한 대수 계산 문항으로 기하 작도 불필요"
}

{
  "sourceQid": "2",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "내각과 외각의 합 180도와 비 4:1로부터 외각 36도를 구하고 외각의 총합 360/36=10으로 정십각형을 판별한다.",
  "decisiveStep": "비 4:1로부터 외각 36도 및 변의 수 n=10 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "정다각형",
    "l4": "조건으로 정다각형 찾기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_REGULAR_POLYGON_ANGLE",
    "why": "정다각형의 내각과 외각의 비례 배분으로 외각을 구하고 변의 수를 도출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평각 180도의 비례배분과 외각합 360도 나눗셈의 2단계 기본 적용",
  "level": "중",
  "item4slot": {
    "given": [
      "정다각형",
      "내각",
      "외각"
    ],
    "goal": [
      "다각형"
    ],
    "method": [
      "비례배분",
      "외각"
    ],
    "condition": []
  },
  "hold": ""
}
Q03
* 형식: 객관식
* 배점: 3
발문
$n$각형의 내각의 크기와 외각의 크기의 총합이 $2160^\circ$일 때, 자연수 $n$의 값은? [3점]
선지
① $8$ ② $10$ ③ $12$ ④ $14$ ⑤ $16$
정답
③
해설
$n$각형의 $n$개의 꼭짓점 각각에서 내각과 외각의 크기의 합은 $180^\circ$이다. 따라서 $n$각형의 내각의 크기와 외각의 크기의 총합은 $180^\circ \times n$이므로 $$\begin{aligned} 180^\circ \times n &= 2160^\circ \ n &= \dfrac{2160^\circ}{180^\circ} \ &= 12 \end{aligned}$$ 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "다각형 꼭짓점당 내각과 외각의 합 공식에 기반한 대수 계산 문항"
}

{
  "sourceQid": "3",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "n각형의 꼭짓점마다 내각과 외각의 합이 180도임을 이용하여 180*n=2160에서 n=12를 구한다.",
  "decisiveStep": "내각과 외각의 총합 공식 180n=2160 수립 및 n=12 도출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "내각의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_INTERIOR_EXTERIOR_SUM",
    "why": "다각형의 내각과 외각의 합 관계식을 세워 변의 수를 결정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "꼭짓점당 평각 성질을 이용한 1차 방정식 기본 계산",
  "level": "하",
  "item4slot": {
    "given": [
      "다각형",
      "내각",
      "외각",
      "자연수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": []
  },
  "hold": ""
}
Q04
* 형식: 객관식
* 배점: 4
발문
다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는? [4점]
선지
① $100^\circ$ ② $110^\circ$ ③ $120^\circ$ ④ $130^\circ$ ⑤ $140^\circ$
정답
④
해설
꼭짓점 $A$의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} \angle A &= 180^\circ - (x + 10^\circ) = 170^\circ - x \end{aligned}$$ 꼭짓점 $B$의 내각의 크기는 외각 $120^\circ$의 보각이므로 $$\begin{aligned} \angle B &= 180^\circ - 120^\circ = 60^\circ \end{aligned}$$ 사각형의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle A + \angle B + \angle C + \angle D &= 360^\circ \ (170^\circ - x) + 60^\circ + 2x + 65^\circ &= 360^\circ \ x + 295^\circ &= 360^\circ \ x &= 65^\circ \end{aligned}$$ 따라서 $\angle C$의 크기는 $$\begin{aligned} \angle C &= 2x \ &= 2 \times 65^\circ \ &= 130^\circ \end{aligned}$$ 따라서 정답은 ④이다.


{
  "status": "UNSUPPORTED",
  "reason": "외각과 내각이 복합 표시된 사각형 ABCD 각 다이어그램"
}

{
  "sourceQid": "4",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "외각 조건으로부터 꼭짓점 A, B의 내각을 표현하고 사각형 내각합 360도 방정식을 풀어 x=65도를 구한 뒤 각 C=2x=130도를 계산한다.",
  "decisiveStep": "사각형 내각의 합 방정식 x + 295 = 360 해결 및 2x 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "내각의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_INTERIOR_EXTERIOR_SUM",
    "why": "외각-내각 변환과 사각형 내각의 합 공식을 결합하여 각을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_STRAIGHT_ANGLE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외각을 내각 표현으로 바꾼 뒤 일차방정식을 세워 목표 각을 구하는 다단계 계산",
  "level": "중",
  "item4slot": {
    "given": [
      "사각형",
      "외각",
      "내각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "방정식",
      "공식",
      "내각"
    ],
    "condition": []
  },
  "hold": ""
}
Q05
* 형식: 객관식
* 배점: 4
발문
다음 중 옳지 않은 것은? [4점]
선지
① 팔각형의 내각의 크기의 합은 $1080^\circ$이다. ② 정육각형의 한 외각의 크기는 $60^\circ$이다. ③ 십이각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $9$개다. ④ 팔각형의 대각선의 개수는 $20$개다. ⑤ 십각형의 한 꼭짓점에서 대각선을 모두 그어서 만들 수 있는 삼각형의 개수는 $9$개다.
정답
⑤
해설
각 보기를 확인한다. $$\begin{aligned} \text{① } & n\text{각형의 내각의 합은 }(n-2) \times 180^\circ\text{이므로} \ & (8-2) \times 180^\circ = 6 \times 180^\circ = 1080^\circ\text{이다. (참)} \ \text{② } & \text{정}n\text{각형의 한 외각의 크기는 }\dfrac{360^\circ}{n}\text{이므로} \ & \dfrac{360^\circ}{6} = 60^\circ\text{이다. (참)} \ \text{③ } & n\text{각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 }n-3\text{개이므로} \ & 12 - 3 = 9\text{개이다. (참)} \ \text{④ } & n\text{각형의 대각선의 총 개수는 }\dfrac{n(n-3)}{2}\text{개이므로} \ & \dfrac{8 \times 5}{2} = 20\text{개이다. (참)} \ \text{⑤ } & n\text{각형의 한 꼭짓점에서 대각선을 모두 그어 만들 수 있는 삼각형의 개수는 }n-2\text{개이므로} \ & 10 - 2 = 8\text{개이다. }9\text{개라는 설명은 옳지 않다. (거짓)} \end{aligned}$$ 따라서 옳지 않은 것은 ⑤이다.


{
  "status": "EXEMPT",
  "reason": "다각형의 대각선, 내각, 외각 기본 성질 진술 판별 문항"
}

{
  "sourceQid": "5",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "다각형의 내각합, 정다각형 외각, 한 꼭짓점 대각선 수, 총 대각선 수, 분할 삼각형 수 공식을 각각 대조하여 5번의 n-2=8임을 판정한다.",
  "decisiveStep": "십각형의 한 꼭짓점 대각선 분할 삼각형 개수 공식 n-2=8 적용",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "삼각형·다각형의 각",
    "l4": "변·대각선 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT",
    "why": "다각형의 기본 공식(내각합, 외각, 대각선, 분할 삼각형) 진술을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다각형 관련 5가지 핵심 공식의 정확성을 개별 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다각형",
      "정다각형",
      "대각선"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}
Q06
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다. 이때 색칠한 부분의 둘레의 길이는? [4점]
선지
① $(4\pi + 24)\text{ cm}$ ② $(4\pi + 30)\text{ cm}$ ③ $(6\pi + 24)\text{ cm}$ ④ $(6\pi + 30)\text{ cm}$ ⑤ $(8\pi + 24)\text{ cm}$
정답
①
해설
정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 원호의 중심은 정육각형의 한 꼭짓점이므로 호의 반지름은 $6\text{ cm}$이고, 중심각은 $120^\circ$이다. 따라서 호의 길이는 $$\begin{aligned} 2\pi \times 6 \times \dfrac{120^\circ}{360^\circ} &= 12\pi \times \dfrac{1}{3} \ &= 4\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레는 정육각형의 변 $4$개와 이 원호 $1$개로 이루어져 있으므로 $$\begin{aligned} \text{둘레의 길이} &= 4 \times 6 + 4\pi \ &= (4\pi + 24)\text{ cm} \end{aligned}$$ 따라서 정답은 ①이다.


{
  "status": "UNSUPPORTED",
  "reason": "한 변이 6cm인 정육각형 내부에 꼭짓점 중심 반지름 6cm 원호가 포함된 복합 둘레 다이어그램"
}

{
  "sourceQid": "6",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "정육각형 내각 120도로부터 반지름 6cm 호의 길이 4pi를 구하고 직선 변 4개의 합 24cm와 더해 둘레 (4pi+24)cm를 완성한다.",
  "decisiveStep": "정육각형 내각 120도 계산 및 호 길이 4pi 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "복합도형",
    "l4": "부채꼴을 포함한 둘레"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER",
    "why": "정다각형의 내각을 중심각으로 갖는 부채꼴 호와 다각형 직선 변의 합성 둘레 계산 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다각형 내각 공식과 부채꼴 호의 길이 공식을 결합하여 경계를 합산하는 복합 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다각형",
      "변",
      "호",
      "반지름"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "공식",
      "호"
    ],
    "condition": []
  },
  "hold": ""
}
Q07
* 형식: 객관식
* 배점: 5
발문
다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는? [5점] (단, $\overline{AB}, \overline{CD}, \overline{EF}$는 원 $O$의 지름이다.)
선지
① $40\text{ cm}$ ② $50\text{ cm}$ ③ $60\text{ cm}$ ④ $70\text{ cm}$ ⑤ $80\text{ cm}$
정답
②
해설
세 선분 $\overline{AB}, \overline{CD}, \overline{EF}$는 모두 원 $O$의 지름이므로 교점 $O$에서 마주 보는 맞꼭지각의 크기는 서로 같다. 따라서 $\angle AOF, \angle DOB, \angle COE$의 반대편에 크기가 같은 각이 각각 하나씩 존재하므로 원 전체의 중심각 $360^\circ$에 대한 비의 총합은 $$\begin{aligned} 2 \times (13 + 11 + 6) &= 2 \times 30 \ &= 60 \end{aligned}$$ 호 $\overparen{DF}$에 대한 중심각 $\angle DOF$는 $\angle COE$와 맞꼭지각이므로 크기가 같다. $$\begin{aligned} \angle DOF &= \angle COE = 6\text{ (비율)} \end{aligned}$$ 따라서 호 $\overparen{DF}$의 길이는 원 전체 둘레의 $\dfrac{6}{60} = \dfrac{1}{10}$이다. 호 $\overparen{DF} = 5\text{ cm}$이므로 원 $O$의 둘레의 길이는 $$\begin{aligned} \text{원 } O\text{의 둘레} &= 5 \times \dfrac{60}{6} \ &= 5 \times 10 \ &= 50\text{ cm} \end{aligned}$$ 따라서 정답은 ②이다.


{
  "status": "UNSUPPORTED",
  "reason": "세 지름이 이루는 6개의 중심각과 호 DF가 표시된 원 O 다이어그램"
}

{
  "sourceQid": "7",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "세 지름의 맞꼭지각 대칭으로 원 전체 비 60을 구하고 맞꼭지각 각 DOF=6으로부터 호 DF가 원 둘레의 1/10임을 이용해 둘레 50cm를 도출한다.",
  "decisiveStep": "맞꼭지각 각 DOF = 각 COE = 6비율 및 호 대 둘레 비 1/10 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "원과 부채꼴의 기본",
    "l4": "중심각·호·현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
    "why": "맞꼭지각과 중심각-호의 길이 비례관계를 이용해 원 둘레를 역산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_VERTICAL_ANGLES"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "맞꼭지각의 대칭성으로 전체 중심각 비를 구성하고 호의 비례식으로 둘레를 역산하는 상급 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "중심각",
      "호",
      "비"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "맞꼭지각",
      "공식",
      "호"
    ],
    "condition": []
  },
  "hold": ""
}
Q08
* 형식: 객관식
* 배점: 5
발문
영수가 다음 그림과 같은 정오각형 $ABCDE$에 대하여 탐구한 결과 발표한 내용이다. 옳지 않은 것은? [5점] (단, 점 $F$는 대각선 $AC$와 대각선 $BE$의 교점이다.)
선지
① 정오각형의 한 내각의 크기는 $108^\circ$이다. ② 정오각형의 한 외각의 크기는 $72^\circ$이다. ③ 대각선 $AC$와 $BE$의 교점 $F$에 대하여 $\angle BFC = 80^\circ$이다. ④ 삼각형 $ABC$는 이등변삼각형이다. ⑤ 선분 $CF$와 선분 $EF$의 길이는 같다.
정답
③
해설
정오각형 $ABCDE$의 각 성질을 점검한다. 정오각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(5-2) \times 180^\circ}{5} &= 108^\circ\text{ (① 참)} \end{aligned}$$ 한 외각의 크기는 $$\begin{aligned} \dfrac{360^\circ}{5} &= 72^\circ\text{ (② 참)} \end{aligned}$$ 삼각형 $ABC$에서 $\overline{AB} = \overline{BC}$이므로 삼각형 $ABC$는 이등변삼각형이다. (④ 참) 따라서 밑각의 크기는 $$\begin{aligned} \angle BCA &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 마찬가지로 삼각형 $ABE$에서 $\overline{AB} = \overline{AE}$이므로 $$\begin{aligned} \angle ABE &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 따라서 $\angle CBF$의 크기는 $$\begin{aligned} \angle CBF &= \angle ABC - \angle ABE = 108^\circ - 36^\circ = 72^\circ \end{aligned}$$ 삼각형 $BFC$에서 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle BFC &= 180^\circ - \angle CBF - \angle BCF \ &= 180^\circ - 72^\circ - 36^\circ \ &= 72^\circ \end{aligned}$$ 따라서 $\angle BFC = 80^\circ$라고 한 ③의 설명은 옳지 않다. 또한 대각선 $BE = AC$이고 $\overline{BF} = \overline{AF}$이므로 $\overline{CF} = \overline{EF}$이다. (⑤ 참) 따라서 정답은 ③이다.


{
  "status": "UNSUPPORTED",
  "reason": "정오각형 ABCDE에 두 대각선 AC, BE의 교점 F와 각들이 표시된 다이어그램"
}

{
  "sourceQid": "8",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "정오각형의 내각 108도와 이등변삼각형 밑각 36도를 이용해 각 CBF=72도, 각 BCF=36도를 구하고 각 BFC=72도임을 확인하여 80도인 3번을 판별한다.",
  "decisiveStep": "삼각형 BFC에서 내각합으로 각 BFC = 72도 계산",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "정다각형",
    "l4": "정다각형의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYGON_ANGLE_AND_COUNT",
    "templateKey": "TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT",
    "why": "정오각형 대각선 교점에서의 각과 선분 성질 진술을 감사하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ISOSCELES_TRIANGLE"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다각형 내각과 대각선이 만드는 이등변삼각형의 밑각을 연쇄 추적해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다각형",
      "대각선",
      "각"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질",
      "내각"
    ],
    "condition": []
  },
  "hold": ""
}
Q09
* 형식: 객관식
* 배점: 4
발문
다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다. 이때 $\angle x$의 크기는? [4점]
선지
① $90^\circ$ ② $95^\circ$ ③ $100^\circ$ ④ $105^\circ$ ⑤ $110^\circ$
정답
④
해설
정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 정팔각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(8-2) \times 180^\circ}{8} &= \dfrac{6 \times 180^\circ}{8} \ &= 135^\circ \end{aligned}$$ 두 정다각형이 한 변을 공유하므로 공유한 변의 꼭짓점에서 세 각의 합은 한 바퀴 $360^\circ$를 이룬다. $$\begin{aligned} 120^\circ + 135^\circ + \angle x &= 360^\circ \ 255^\circ + \angle x &= 360^\circ \ \angle x &= 360^\circ - 255^\circ \ &= 105^\circ \end{aligned}$$ 따라서 정답은 ④이다.


{
  "status": "UNSUPPORTED",
  "reason": "한 변을 공유한 정육각형과 정팔각형의 꼭짓점에서 생기는 외측 각 x 다이어그램"
}

{
  "sourceQid": "9",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "정육각형 내각 120도와 정팔각형 내각 135도를 각각 구하고 꼭짓점 한 바퀴 360도에서 감산하여 x=105도를 구한다.",
  "decisiveStep": "꼭짓점 세 각의 합 360도에서 두 내각의 합 255도 감산",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "다각형의 내각과 외각",
    "l4": "정다각형의 각"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE",
    "templateKey": "TPL_M1_REGULAR_POLYGON_COMPOSITE_ANGLE_REGULAR_POLYGON_ANGLE_CHASE",
    "why": "결합된 두 정다각형의 내각 공식과 한 점 둘레각 360도를 이용하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "서로 다른 두 정다각형의 내각을 각각 구한 뒤 360도에서 여각을 도출하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다각형",
      "내각",
      "변"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "내각"
    ],
    "condition": []
  },
  "hold": ""
}
Q10
* 형식: 객관식
* 배점: 5
발문
다음 그림은 두 반원 $O', O''$을 큰 원 $O$의 반원에 꼭 맞게 놓은 것이다. 반원 $O'$와 $O''$의 반지름의 길이가 각각 $5\text{ cm}, 3\text{ cm}$일 때, 색칠한 부분의 둘레의 길이는? [5점] (단, 점 $O, O', O''$은 한 직선 상에 있다.)
선지
① $16\pi\text{ cm}$ ② $(16\pi + 16)\text{ cm}$ ③ $24\pi\text{ cm}$ ④ $(24\pi + 8)\text{ cm}$ ⑤ $(24\pi + 16)\text{ cm}$
정답
⑤
해설
두 작은 반원 $O', O''$의 반지름이 각각 $5\text{ cm}, 3\text{ cm}$이므로 지름의 길이는 각각 $10\text{ cm}, 6\text{ cm}$이다. 큰 원 $O$의 지름은 두 작은 반원의 지름의 합과 같으므로 $$\begin{aligned} \text{큰 원의 지름} &= 10 + 6 = 16\text{ cm} \ \text{큰 원의 반지름} &= 8\text{ cm} \end{aligned}$$ 큰 원의 둘레의 길이는 $$\begin{aligned} 2\pi \times 8 &= 16\pi\text{ cm} \end{aligned}$$ 두 작은 반원의 호의 길이의 합은 $$\begin{aligned} \pi \times 5 + \pi \times 3 &= 8\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레에는 큰 원의 둘레 전체($16\pi$), 두 작은 반원의 호($8\pi$), 그리고 직선 부분인 두 반원의 지름 선분($10 + 6 = 16\text{ cm}$)이 모두 포함된다. 따라서 색칠한 부분의 둘레의 길이는 $$\begin{aligned} \text{둘레의 길이} &= 16\pi + 8\pi + (10 + 6) \ &= (24\pi + 16)\text{ cm} \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "UNSUPPORTED",
  "reason": "큰 원 반원 내부에 두 작은 반원이 배치된 복합 곡선 둘레 다이어그램"
}

{
  "sourceQid": "10",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "큰 원 둘레 16pi, 두 작은 반원 호 8pi, 그리고 직선 지름 선분 16cm를 각각 합산하여 둘레 (24pi+16)cm를 완성한다.",
  "decisiveStep": "둘레에 직선 지름 선분 16cm가 포함됨을 인식하고 곡선과 직선을 누락 없이 합산",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "복합도형",
    "l4": "부채꼴을 포함한 둘레"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER",
    "why": "원과 반원들의 복합 경계선(호와 지름 선분)을 합산하여 둘레를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "큰 원 둘레, 작은 반원 호, 직선 지름 선분을 구별하여 모두 더해야 하는 복합 경계 계산",
  "level": "중",
  "item4slot": {
    "given": [
      "원",
      "반원",
      "반지름"
    ],
    "goal": [
      "둘레"
    ],
    "method": [
      "공식",
      "호"
    ],
    "condition": []
  },
  "hold": ""
}
Q11
* 형식: 객관식
* 배점: 3
발문
다음 설명 중 옳지 않은 것은? [3점]
선지
① 정팔면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다. ② 다각형인 면으로만 둘러싸인 입체도형을 다면체라고 한다. ③ 정이십면체의 면의 모양은 정삼각형이다. ④ 정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 $5$가지뿐이다. ⑤ 정육면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다.
정답
①
해설
각 보기를 확인한다. $$\begin{aligned} \text{① } & \text{정팔면체의 한 꼭짓점에 모인 면의 개수는 }4\text{개이다. }3\text{개라는 설명은 옳지 않다. (거짓)} \ \text{② } & \text{다면체의 정의는 다각형인 면으로만 둘러싸인 입체도형이다. (참)} \ \text{③ } & \text{정이십면체의 모든 면은 서로 합동인 정삼각형이다. (참)} \ \text{④ } & \text{정다면체는 }5\text{가지뿐이다. (참)} \ \text{⑤ } & \text{정육면체의 한 꼭짓점에 모인 면의 개수는 }3\text{개이다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ①이다.


{
  "status": "EXEMPT",
  "reason": "정다면체 및 다면체의 정의와 성질 진술 판별 문항"
}

{
  "sourceQid": "11",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "정팔면체의 한 꼭짓점에 모이는 면의 수가 4개임을 확인하여 3개로 서술된 1번의 오류를 판정한다.",
  "decisiveStep": "정팔면체의 꼭짓점당 면의 개수가 4개임을 판별",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "다면체와 회전체",
    "l3": "정다면체",
    "l4": "정다면체의 종류"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT",
    "why": "정다면체의 꼭짓점, 면 구성 성질 진술을 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다면체 5종의 꼭짓점별 면 개수 및 정의를 비교 판별하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "정다면체",
      "다면체"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}
Q12
* 형식: 객관식
* 배점: 4
발문
다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은? [4점] (단, 회전축 $l$에서 직사각형의 안쪽 변까지의 거리는 $2\text{ cm}$, 직사각형의 가로는 $2\text{ cm}$, 세로는 $6\text{ cm}$이다.)
선지
① $72\pi\text{ cm}^2,; 96\pi\text{ cm}^3$ ② $96\pi\text{ cm}^2,; 72\pi\text{ cm}^3$ ③ $96\pi\text{ cm}^2,; 96\pi\text{ cm}^3$ ④ $108\pi\text{ cm}^2,; 72\pi\text{ cm}^3$ ⑤ $120\pi\text{ cm}^2,; 96\pi\text{ cm}^3$
정답
②
해설
직사각형을 직선 $l$을 축으로 하여 1회전 시키면 가운데가 뚫린 속 빈 원기둥이 생긴다. 회전축에서 직사각형까지의 거리가 $2\text{ cm}$이므로 안쪽 반지름은 $2\text{ cm}$이고, 직사각형의 가로가 $2\text{ cm}$이므로 바깥쪽 반지름은 $2 + 2 = 4\text{ cm}$이다. 높이는 $6\text{ cm}$이다.


먼저 부피를 구하면 다음과 같다. $$\begin{aligned} \text{부피} &= \pi \times (4^2 - 2^2) \times 6 \ &= \pi \times (16 - 4) \times 6 \ &= 72\pi\text{ cm}^3 \end{aligned}$$


겉넓이는 바깥쪽 옆넓이, 안쪽 옆넓이, 그리고 위아래 두 도넛 모양(고리 모양) 밑면의 넓이의 합이다. $$\begin{aligned} \text{바깥쪽 옆넓이} &= 2\pi \times 4 \times 6 = 48\pi\text{ cm}^2 \ \text{안쪽 옆넓이} &= 2\pi \times 2 \times 6 = 24\pi\text{ cm}^2 \ \text{두 밑면의 넓이} &= 2 \times \pi \times (4^2 - 2^2) = 2 \times 12\pi = 24\pi\text{ cm}^2 \ \text{겉넓이} &= 48\pi + 24\pi + 24\pi = 96\pi\text{ cm}^2 \end{aligned}$$ 따라서 겉넓이와 부피는 순서대로 $96\pi\text{ cm}^2, 72\pi\text{ cm}^3$이다. 따라서 정답은 ②이다.


{
  "status": "UNSUPPORTED",
  "reason": "회전축 l과 떨어진 직사각형 회전체 3D 투영 및 단면 치수 다이어그램"
}

{
  "sourceQid": "12",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "바깥 반지름 4, 안쪽 반지름 2, 높이 6인 속 빈 원기둥의 부피 72pi와 바깥·안쪽 옆면 및 고리 밑면을 더한 겉넓이 96pi를 계산한다.",
  "decisiveStep": "속 빈 원기둥의 겉넓이(바깥옆면+안쪽옆면+두 고리밑면=96pi) 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 겉넓이와 부피",
    "l3": "기둥의 겉넓이와 부피",
    "l4": "원기둥"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "why": "회전축과 떨어진 직사각형의 회전체(속 빈 원기둥)의 겉넓이와 부피를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "안쪽과 바깥쪽 반지름을 설정하고 부피와 4개 면의 겉넓이를 각각 정확히 산출해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "회전체",
      "직사각형",
      "원기둥"
    ],
    "goal": [
      "겉넓이",
      "부피"
    ],
    "method": [
      "공식"
    ],
    "condition": []
  },
  "hold": ""
}
Q13
* 형식: 객관식
* 배점: 4
발문
다음 <보기> 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자른 단면의 모양이 올바르게 짝지어진 것만을 있는 대로 고른 것은? [4점]


• ㄱ. 원뿔 - 이등변삼각형 • ㄴ. 구 - 원 • ㄷ. 원기둥 - 사다리꼴 • ㄹ. 원뿔대 - 사다리꼴 • ㅁ. 반구 - 직사각형
선지
① ㄱ, ㄷ ② ㄴ, ㄹ ③ ㄱ, ㄴ, ㄹ ④ ㄱ, ㄷ, ㅁ ⑤ ㄴ, ㄷ, ㄹ
정답
③
해설
회전축을 포함하는 평면으로 자른 단면의 모양을 각 회전체별로 확인한다. $$\begin{aligned} \text{ㄱ. 원뿔} &: \text{이등변삼각형 (참)} \ \text{ㄴ. 구} &: \text{원 (참)} \ \text{ㄷ. 원기둥} &: \text{직사각형 (사다리꼴이라는 설명은 거짓)} \ \text{ㄹ. 원뿔대} &: \text{등변사다리꼴 (참)} \ \text{ㅁ. 반구} &: \text{반원 (직사각형이라는 설명은 거짓)} \end{aligned}$$ 따라서 올바르게 짝지어진 것은 ㄱ, ㄴ, ㄹ이다. 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "회전체 축단면 기하적 형태 진술 검토 문항"
}

{
  "sourceQid": "13",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "5가지 대표 회전체의 축을 포함하는 단면 모양을 각각 대조하여 참인 항목 ㄱ, ㄴ, ㄹ을 선별한다.",
  "decisiveStep": "원기둥(직사각형), 반구(반원)의 축단면을 정확히 검증하여 거짓 항목 제거",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "다면체와 회전체",
    "l3": "회전체",
    "l4": "회전체의 단면"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_ROTATION_SOLID_PROPERTIES",
    "templateKey": "TPL_M1_ROTATION_SOLID_PROPERTIES_CLAIM_AUDIT",
    "why": "회전체를 축을 포함하는 평면으로 자른 단면 모양 진술들을 종합 검증하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "회전체별 축단면 기하 형상을 직관적으로 식별하는 기본 판정 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "회전체",
      "단면"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}
Q14
* 형식: 객관식
* 배점: 5
발문
삼각기둥의 전개도가 [그림 1]과 같다. 삼각기둥의 겉넓이가 [그림 2]와 같이 밑면이 사다리꼴인 사각기둥의 겉넓이의 $\dfrac{1}{2}$배일 때, 사각기둥의 높이는? [5점] (단, [그림 1]의 밑면은 세 변의 길이가 각각 $3\text{ cm}, 4\text{ cm}, 5\text{ cm}$인 직각삼각형이고 삼각기둥의 높이는 $8\text{ cm}$이다. [그림 2]의 밑면인 사다리꼴은 평행한 두 변의 길이가 $2\text{ cm}, 6\text{ cm}$, 높이가 $3\text{ cm}$, 다른 한 빗변의 길이가 $5\text{ cm}$인 사다리꼴이다.)
선지
① $6\text{ cm}$ ② $8\text{ cm}$ ③ $10\text{ cm}$ ④ $12\text{ cm}$ ⑤ $14\text{ cm}$
정답
④
해설
[그림 1]의 삼각기둥 밑면은 두 변이 $3\text{ cm}, 4\text{ cm}$인 직각삼각형이므로 $$\begin{aligned} \text{삼각기둥 밑넓이} &= \dfrac{1}{2} \times 3 \times 4 = 6\text{ cm}^2 \ \text{삼각기둥 밑면 둘레} &= 3 + 4 + 5 = 12\text{ cm} \end{aligned}$$ 삼각기둥의 높이가 $8\text{ cm}$이므로 겉넓이는 $$\begin{aligned} \text{삼각기둥 겉넓이} &= 2 \times 6 + 12 \times 8 \ &= 12 + 96 \ &= 108\text{ cm}^2 \end{aligned}$$ 삼각기둥의 겉넓이가 사각기둥 겉넓이의 $\dfrac{1}{2}$배이므로 $$\begin{aligned} \text{사각기둥 겉넓이} &= 108 \times 2 = 216\text{ cm}^2 \end{aligned}$$ [그림 2]의 사각기둥 밑면 사다리꼴의 넓이와 둘레는 $$\begin{aligned} \text{사각기둥 밑넓이} &= \dfrac{(2 + 6) \times 3}{2} = 12\text{ cm}^2 \ \text{사각기둥 밑면 둘레} &= 2 + 3 + 6 + 5 = 16\text{ cm} \end{aligned}$$ 사각기둥의 높이를 $h$라 하면 $$\begin{aligned} 2 \times 12 + 16 \times h &= 216 \ 24 + 16h &= 216 \ 16h &= 192 \ h &= 12\text{ cm} \end{aligned}$$ 따라서 정답은 ④이다.


{
  "status": "UNSUPPORTED",
  "reason": "직각삼각형 밑면 삼각기둥 전개도와 사다리꼴 밑면 사각기둥 입체도형 비교 다이어그램"
}

{
  "sourceQid": "14",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "삼각기둥 겉넓이 108cm²를 구하고 2배인 사각기둥 겉넓이 216cm²로부터 24+16h=216을 풀어 높이 h=12cm를 도출한다.",
  "decisiveStep": "사각기둥 겉넓이 방정식 16h = 192 해결 및 높이 12cm 산출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 겉넓이와 부피",
    "l3": "기둥의 겉넓이와 부피",
    "l4": "각기둥"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "why": "기둥의 전개도 및 겉넓이 관계식으로부터 미지수 높이를 역산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 기둥의 전개도 겉넓이를 각각 계산하고 배수 관계 일차방정식을 풀어내는 다단계 응용",
  "level": "중",
  "item4slot": {
    "given": [
      "각기둥",
      "전개도",
      "사다리꼴",
      "직각삼각형"
    ],
    "goal": [
      "높이"
    ],
    "method": [
      "겉넓이",
      "방정식"
    ],
    "condition": []
  },
  "hold": ""
}
Q15
* 형식: 객관식
* 배점: 4
발문
다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다. 원기둥의 밑면의 반지름의 길이를 $r$이라 할 때, 원기둥의 부피, 구의 부피, 원뿔의 부피의 비는? [4점]
선지
① 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $1 : 2 : 3$ ② 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $2 : 3 : 1$ ③ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $3 : 1 : 2$ ④ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $2 : 1 : 3$ ⑤ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $3 : 2 : 1$
정답
⑤
해설
구와 원뿔이 원기둥에 꼭 맞게 들어 있으므로 원기둥의 밑면의 반지름은 $r$, 높이는 구의 지름과 같으므로 $2r$이다. 각 입체도형의 부피를 구하면 다음과 같다. $$\begin{aligned} \text{원기둥의 부피} &= \pi r^2 \times 2r = 2\pi r^3 \ \text{구의 부피} &= \dfrac{4}{3}\pi r^3 \ \text{원뿔의 부피} &= \dfrac{1}{3}\pi r^2 \times 2r = \dfrac{2}{3}\pi r^3 \end{aligned}$$ 세 부피의 비를 구하면 $$\begin{aligned} \text{원기둥} : \text{구} : \text{원뿔} &= 2\pi r^3 : \dfrac{4}{3}\pi r^3 : \dfrac{2}{3}\pi r^3 \ &= 2 : \dfrac{4}{3} : \dfrac{2}{3} \ &= 6 : 4 : 2 \ &= 3 : 2 : 1 \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "UNSUPPORTED",
  "reason": "원기둥에 내접하는 구와 원뿔의 부피 관계 다이어그램"
}

{
  "sourceQid": "15",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원기둥(2pi*r^3), 구((4/3)pi*r^3), 원뿔((2/3)pi*r^3)의 부피 공식을 적용해 3:2:1의 정수비를 도출한다.",
  "decisiveStep": "세 입체도형의 부피를 (2/3)pi*r^3으로 나누어 3:2:1 정수비 도출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 겉넓이와 부피",
    "l3": "구",
    "l4": "구의 부피"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_STANDARD_MEASURE",
    "why": "기본 회전체 3종(원기둥, 구, 원뿔)의 부피 공식 대입 및 연비 계산 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "내접 기하 관계(높이=2r)를 적용하고 세 부피 공식의 연비를 정수비로 정리하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원기둥",
      "구",
      "원뿔",
      "반지름"
    ],
    "goal": [
      "비"
    ],
    "method": [
      "부피",
      "공식"
    ],
    "condition": [
      "접함"
    ]
  },
  "hold": ""
}
Q16
* 형식: 객관식
* 배점: 3
발문
다음은 모든 면이 합동인 다각형으로 이루어진 입체도형을 설명한 것이다. 이 중 정다면체가 아닌 것은? [3점]
선지
① 모든 면이 합동인 정사각형 6개이며, 어떤 꼭짓점에는 3개, 다른 꼭짓점에는 4개씩 모인다. ② 모든 면이 합동인 정삼각형 4개이고, 각 꼭짓점에 3개씩 모인다. ③ 모든 면이 합동인 정사각형 6개이고, 각 꼭짓점에 3개씩 모인다. ④ 모든 면이 합동인 정삼각형 8개이고, 각 꼭짓점에 4개씩 모인다. ⑤ 모든 면이 합동인 정오각형 12개이고, 각 꼭짓점에 3개씩 모인다.
정답
①
해설
정다면체가 되기 위한 조건은 다음 두 가지를 모두 만족해야 한다.


1. 모든 면이 서로 합동인 정다각형이어야 한다.
2. 각 꼭짓점에 모인 면의 개수가 모두 같아야 한다.


①의 경우 면이 모두 합동인 정사각형이라 하더라도, 꼭짓점마다 모인 면의 개수가 $3$개 또는 $4$개로 서로 다르므로 정다면체의 조건을 만족하지 않는다. ②~⑤는 각각 정사면체, 정육면체, 정팔면체, 정십이면체에 해당하여 모두 정다면체이다. 따라서 정다면체가 아닌 것은 ①이다.


{
  "status": "EXEMPT",
  "reason": "정다면체 정의 충족 조건 판별 문항"
}

{
  "sourceQid": "16",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "정다면체의 필수 조건인 '각 꼭짓점에 모인 면의 개수가 같아야 한다'를 위배한 1번을 식별한다.",
  "decisiveStep": "꼭짓점마다 모인 면의 개수가 다르면 정다면체가 아님을 판정",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "다면체와 회전체",
    "l3": "정다면체",
    "l4": "정다면체의 종류"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS",
    "templateKey": "TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT",
    "why": "정다면체의 두 가지 정의 조건 충족 여부를 판정하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정다면체의 정의에서 꼭짓점 조건의 필수성을 정확히 이해해야 하는 개념 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "정다면체",
      "다면체"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "성질"
    ],
    "condition": []
  },
  "hold": ""
}
Q17
* 형식: 객관식
* 배점: 4
발문
다음 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다. 다음 중 옳지 않은 것은? [4점]


봉사활동 시간 (시간) | A반 상대도수 | B반 상대도수 0 이상 ~ 2 미만 | 0.10 | 0.15 2 ~ 4 | 0.25 | 0.20 4 ~ 6 | 0.35 | 0.25 6 ~ 8 | 0.20 | 0.30 8 ~ 10 | 0.10 | 0.10 합계 | 1.00 | 1.00
선지
① A반과 B반의 상대도수의 총합은 각각 1로 서로 같다. ② A반에서 봉사활동 시간이 4시간 이상 6시간 미만인 계급의 상대도수는 0.25이다. ③ B반에서 봉사활동 시간이 6시간 이상 8시간 미만인 계급의 상대도수는 0.30이다. ④ 봉사활동 시간이 8시간 이상 10시간 미만인 계급의 상대도수는 두 반 모두 0.10이다. ⑤ 봉사활동 시간이 6시간 이상인 학생의 비율은 B반이 A반보다 더 높다.
정답
②
해설
표를 보고 각 보기를 확인한다. $$\begin{aligned} \text{① } & \text{상대도수의 총합은 전체 인원과 관계없이 항상 }1\text{로 서로 같다. (참)} \ \text{② } & A\text{반에서 }4\text{시간 이상 }6\text{시간 미만인 계급의 상대도수는 }0.35\text{이다.} \ & 0.25\text{는 }B\text{반의 상대도수이므로 옳지 않다. (거짓)} \ \text{③ } & B\text{반에서 }6\text{시간 이상 }8\text{시간 미만인 계급의 상대도수는 }0.30\text{이다. (참)} \ \text{④ } & 8\text{시간 이상 }10\text{시간 미만인 계급의 상대도수는 두 반 모두 }0.10\text{이다. (참)} \ \text{⑤ } & 6\text{시간 이상인 학생의 상대도수의 합은 다음과 같다.} \ & A\text{반: } 0.20 + 0.10 = 0.30 \ & B\text{반: } 0.30 + 0.10 = 0.40 \ & 0.40 > 0.30\text{이므로 }B\text{반이 }A\text{반보다 비율이 더 높다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ②이다.


{
  "status": "EXEMPT",
  "reason": "상대도수 분포표 비교 판독 문항"
}

{
  "sourceQid": "17",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "상대도수 분포표에서 A반 4~6시간 상대도수가 0.35임을 읽고 0.25로 잘못 진술된 2번을 선별한다.",
  "decisiveStep": "A반의 해당 계급 상대도수 0.35와 선지 진술 0.25의 불일치 판정",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "자료 해석",
    "l4": "그래프 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_DISTRIBUTION_GRAPH_COMPARISON",
    "why": "두 집단의 상대도수 분포표에서 계급별 상대도수 및 누적 비율을 비교 감사하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 집단의 상대도수 표를 비교 대조하고 구간 합산 비율을 판별하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표",
      "상대도수",
      "계급"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "해석"
    ],
    "condition": [
      "집단"
    ]
  },
  "hold": ""
}
Q18
* 형식: 객관식
* 배점: 3
발문
어느 자료에서 상대도수가 $0.05$인 계급의 도수가 $2$명일 때, 도수가 $a$명인 계급의 상대도수는 $0.25$이고, 도수가 $14$명인 계급의 상대도수는 $b$이다. 이때 $a, b$의 값으로 옳은 것은? [3점]
선지
① $a = 8, ; b = 0.35$ ② $a = 10, ; b = 0.3$ ③ $a = 10, ; b = 0.35$ ④ $a = 12, ; b = 0.35$ ⑤ $a = 12, ; b = 0.4$
정답
③
해설
상대도수가 $0.05$인 계급의 도수가 $2$명이므로 전체 학생 수는 $$\begin{aligned} \text{전체 도수} &= \dfrac{\text{도수}}{\text{상대도수}} \ &= \dfrac{2}{0.05} \ &= 40\text{ (명)} \end{aligned}$$ 상대도수가 $0.25$인 계급의 도수 $a$는 $$\begin{aligned} a &= 40 \times 0.25 \ &= 10\text{ (명)} \end{aligned}$$ 도수가 $14$명인 계급의 상대도수 $b$는 $$\begin{aligned} b &= \dfrac{14}{40} \ &= 0.35 \end{aligned}$$ 따라서 $a = 10, b = 0.35$이다. 따라서 정답은 ③이다.


{
  "status": "EXEMPT",
  "reason": "상대도수 정의식을 이용한 전체 도수 역산 및 도수·상대도수 상호 계산 문항"
}

{
  "sourceQid": "18",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "도수 2와 상대도수 0.05로부터 전체 40명을 구하고 a=40*0.25=10, b=14/40=0.35를 계산한다.",
  "decisiveStep": "전체 도수 40명 산출 및 a=10, b=0.35 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "상대도수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION",
    "why": "상대도수와 도수로 전체 인원을 복원한 뒤 미지수 도수 및 상대도수를 구하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상대도수=도수/전체도수 공식을 역산 및 순산으로 연계 적용하는 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "도수",
      "상대도수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "상대도수"
    ],
    "condition": []
  },
  "hold": ""
}
Q19
* 형식: 객관식
* 배점: 4
발문
다음 상대도수의 분포표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다. $A+B+C$의 값은? [4점]


성공한 횟수(회) | 학생 수(명) | 상대도수 0 이상 ~ 10 미만 | 6 | A 10 ~ 20 | 15 | 0.3 20 ~ 30 | B | 0.24 30 ~ 40 | | 40 ~ 50 | | 합계 | C | 1
선지
① $50.12$ ② $60.12$ ③ $62.02$ ④ $62.12$ ⑤ $65.12$
정답
④
해설
$10\text{회 이상 }20\text{회 미만}$ 계급의 학생 수가 $15$명이고 상대도수가 $0.3$이므로 전체 학생 수 $C$는 다음과 같다. $$\begin{aligned} C &= \dfrac{15}{0.3} \ &= 50\text{ (명)} \end{aligned}$$ $0\text{회 이상 }10\text{회 미만}$ 계급의 학생 수가 $6$명이므로 상대도수 $A$는 $$\begin{aligned} A &= \dfrac{6}{50} \ &= 0.12 \end{aligned}$$ $20\text{회 이상 }30\text{회 미만}$ 계급의 상대도수가 $0.24$이므로 학생 수 $B$는 $$\begin{aligned} B &= 50 \times 0.24 \ &= 12\text{ (명)} \end{aligned}$$ 따라서 $A + B + C$의 값은 $$\begin{aligned} A + B + C &= 0.12 + 12 + 50 \ &= 62.12 \end{aligned}$$ 따라서 정답은 ④이다.


{
  "status": "EXEMPT",
  "reason": "상대도수 분포표 빈칸 복원 대수 문항"
}

{
  "sourceQid": "19",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_ORGANIZATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "도수 15와 상대도수 0.3으로 전체 도수 C=50을 구하고 A=6/50=0.12, B=50*0.24=12를 복원해 합 62.12를 계산한다.",
  "decisiveStep": "전체 도수 C=50 복원 및 A=0.12, B=12 산출 후 총합 계산",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "도수분포",
    "l4": "도수분포표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_FREQUENCY_DISTRIBUTION_READING",
    "templateKey": "TPL_M1_FREQUENCY_DISTRIBUTION_READING_MULTI_CELL_RECONSTRUCTION",
    "why": "혼합 도수·상대도수 표에서 전체 도수를 복원하고 여러 누락 셀을 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상대도수 표의 전체 도수 복원과 도수·상대도수 상호 변환을 다단계로 수행하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "도수분포표",
      "도수",
      "상대도수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "상대도수"
    ],
    "condition": []
  },
  "hold": ""
}
Q20
* 형식: 객관식
* 배점: 5
발문
다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은? [5점] (단, 원뿔대의 윗면의 반지름의 길이는 $4\text{ cm}$, 아랫면의 반지름의 길이는 $8\text{ cm}$, 모선의 길이는 $10\text{ cm}$이다.)
선지
① $\dfrac{1}{2}$ ② $1$ ③ $\dfrac{3}{2}$ ④ $\dfrac{5}{3}$ ⑤ $2$
정답
⑤
해설
원뿔대의 옆면은 큰 부채꼴에서 작은 부채꼴을 잘라낸 모양이므로 옆넓이는 $$\begin{aligned} \text{원뿔대 옆넓이} &= \pi \times (8 + 4) \times 10 \ &= 120\pi\text{ cm}^2 \end{aligned}$$ 원뿔대의 두 밑면(윗면과 아랫면)의 넓이의 합은 $$\begin{aligned} \text{두 밑면의 넓이의 합} &= \pi \times 8^2 + \pi \times 4^2 \ &= 64\pi + 16\pi \ &= 80\pi\text{ cm}^2 \end{aligned}$$ 따라서 원뿔대의 겉넓이 $S_1$은 $$\begin{aligned} S_1 &= 120\pi + 80\pi \ &= 200\pi\text{ cm}^2 \end{aligned}$$ 반지름이 $5\text{ cm}$인 구의 겉넓이 $S_2$는 $$\begin{aligned} S_2 &= 4\pi \times 5^2 \ &= 100\pi\text{ cm}^2 \end{aligned}$$ 따라서 구하는 비율은 $$\begin{aligned} \dfrac{S_1}{S_2} &= \dfrac{200\pi}{100\pi} \ &= 2 \end{aligned}$$ 따라서 정답은 ⑤이다.


{
  "status": "UNSUPPORTED",
  "reason": "윗면 반지름 4, 아랫면 반지름 8, 모선 10인 원뿔대와 반지름 5인 구 다이어그램"
}

{
  "sourceQid": "20",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원뿔대 옆넓이 120pi와 두 밑면 80pi로 S1=200pi를 구하고, 구 겉넓이 S2=100pi로부터 S1/S2=2를 산출한다.",
  "decisiveStep": "원뿔대 겉넓이 S1=200pi 및 구 겉넓이 S2=100pi 산출 후 비율 계산",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 겉넓이와 부피",
    "l3": "구",
    "l4": "구의 겉넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_FRUSTUM_SURFACE",
    "why": "원뿔대의 겉넓이와 구의 겉넓이를 각각 구해 비를 도출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원뿔대 옆넓이 전개도 공식과 두 밑면, 구의 겉넓이 공식을 종합 적용하는 고난도 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "원뿔대",
      "구",
      "반지름",
      "모선"
    ],
    "goal": [
      "비"
    ],
    "method": [
      "겉넓이",
      "공식"
    ],
    "condition": []
  },
  "hold": ""
}
Q21
* 형식: 서답형
* 배점: 4
발문
[서술형 1] 아래 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오. [4점] ($\angle x$의 크기를 구하는 과정: 2점, $\angle x$의 크기: 2점)
선지
없음
정답
$117^\circ$
해설
삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다. 왼쪽 아래 꼭짓점의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} 180^\circ - (x + 10^\circ) &= 170^\circ - x \end{aligned}$$ 꼭대기 외각 $\angle x$는 이웃하지 않는 두 내각 $(170^\circ - x)$와 $64^\circ$의 합과 같으므로 $$\begin{aligned} x &= (170^\circ - x) + 64^\circ \ x &= 234^\circ - x \ 2x &= 234^\circ \ x &= 117^\circ \end{aligned}$$ 따라서 $\angle x$의 크기는 $117^\circ$이다.


{
  "status": "UNSUPPORTED",
  "reason": "외각 x와 x+10도, 내각 64도가 표시된 삼각형 각 다이어그램"
}

{
  "sourceQid": "21",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-POLYGON_CIRCLE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "이웃한 내각 170-x를 구하고 한 외각은 이웃하지 않는 두 내각의 합이라는 성질로 x=(170-x)+64를 풀어 x=117도를 도출한다.",
  "decisiveStep": "외각 정리 방정식 2x = 234 해결 및 x=117도 산출",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "다각형",
    "l3": "삼각형·다각형의 각",
    "l4": "각의 크기 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_TRIANGLE_ANGLE_CONDITION",
    "templateKey": "TPL_M1_TRIANGLE_ANGLE_CONDITION_EXTERIOR_SUM",
    "why": "삼각형의 외각 정리와 일차방정식을 결합하여 미지각을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_STRAIGHT_ANGLE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외각과 내각의 보각 관계를 세우고 외각 정리 일차방정식을 푸는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "삼각형",
      "외각",
      "내각"
    ],
    "goal": [
      "각"
    ],
    "method": [
      "방정식",
      "외각"
    ],
    "condition": []
  },
  "hold": ""
}
Q22
* 형식: 서답형
* 배점: 6
발문
[서술형 2] 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오. [6점] (단, 부채꼴 $P$의 반지름은 $2\text{ cm}$, 중심각은 $60^\circ$, 부채꼴 $Q$의 반지름은 $4\text{ cm}$, 중심각은 $60^\circ$, 부채꼴 $R$의 반지름은 $6\text{ cm}$, 중심각은 $120^\circ$이다.) ($P$를 구하는 과정: 1점, $Q, R$을 구하는 과정: 3점, $R - Q + P$의 값: 2점)
선지
없음
정답
$10\pi\text{ cm}^2$
해설
부채꼴 $P$의 반지름은 $2\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} P &= \pi \times 2^2 \times \dfrac{60^\circ}{360^\circ} \ &= 4\pi \times \dfrac{1}{6} \ &= \dfrac{2}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $Q$의 반지름은 $4\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} Q &= \pi \times 4^2 \times \dfrac{60^\circ}{360^\circ} \ &= 16\pi \times \dfrac{1}{6} \ &= \dfrac{8}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $R$의 반지름은 $6\text{ cm}$, 중심각은 $120^\circ$이므로 넓이는 $$\begin{aligned} R &= \pi \times 6^2 \times \dfrac{120^\circ}{360^\circ} \ &= 36\pi \times \dfrac{1}{3} \ &= 12\pi\text{ cm}^2 \end{aligned}$$ 따라서 $R - Q + P$의 값은 $$\begin{aligned} R - Q + P &= 12\pi - \dfrac{8}{3}\pi + \dfrac{2}{3}\pi \ &= 12\pi - \dfrac{6}{3}\pi \ &= 12\pi - 2\pi \ &= 10\pi\text{ cm}^2 \end{aligned}$$ 따라서 정답은 $10\pi\text{ cm}^2$이다.


{
  "status": "UNSUPPORTED",
  "reason": "등변사다리꼴 ADCB의 세 꼭짓점에서 확장된 부채꼴 P, Q, R 다이어그램"
}

{
  "sourceQid": "22",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-06",
  "subUnitKey": "M1-06-PLANE_FIGURE_MEASURE",
  "conceptClusterKey": "POLYGON_CIRCLE",
  "primaryMethod": "부채꼴 넓이 공식을 적용해 P=(2/3)pi, Q=(8/3)pi, R=12pi를 각각 구하고 결합식 R-Q+P=10pi를 서술한다.",
  "decisiveStep": "세 부채꼴 넓이의 정확한 산출 및 결합 연산 R-Q+P = 10pi 완성",
  "rpm": {
    "majorUnit": "평면도형",
    "midUnit": "원과 부채꼴",
    "l3": "부채꼴의 넓이",
    "l4": "중심각을 이용한 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS",
    "templateKey": "TPL_CIRCLE_ANGLE_SECTOR_MEASURE",
    "why": "중심각과 반지름이 각각 주어진 여러 부채꼴의 넓이를 계산하고 사칙 결합하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 부채꼴의 반지름과 중심각을 대입해 넓이를 분수 형태로 구하고 정확히 결합 연산하는 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "부채꼴",
      "반지름",
      "중심각",
      "사다리꼴"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "공식",
      "넓이"
    ],
    "condition": []
  },
  "hold": ""
}
Q23
* 형식: 서답형
* 배점: 6
발문
[서술형 3] 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다. 쇠공 3개만 모두 꺼내고 난 후 원기둥에 남아있는 물의 높이를 구하시오. (단, 통의 두께는 생각하지 않는다.) [6점] (물의 부피를 구하는 과정: 3점, 원기둥에 남아있는 물의 높이를 구하는 과정: 2점, 원기둥에 남아있는 물의 높이: 1점)
선지
없음
정답
$8\text{ cm}$
해설
쇠공의 반지름은 원기둥 밑면의 반지름과 같으므로 $4\text{ cm}$이고, 쇠공 $1$개의 지름은 $8\text{ cm}$이다. 쇠공 $3$개가 원기둥에 꼭 맞게 들어 있으므로 원기둥의 높이는 쇠공 $3$개의 지름의 합과 같다. $$\begin{aligned} \text{원기둥의 높이} &= 3 \times 8 = 24\text{ cm} \end{aligned}$$ 원기둥 통의 전체 부피는 $$\begin{aligned} V_{\text{원기둥}} &= \pi \times 4^2 \times 24 \ &= 16\pi \times 24 \ &= 384\pi\text{ cm}^3 \end{aligned}$$ 쇠공 $3$개의 부피의 합은 $$\begin{aligned} V_{\text{쇠공}} &= 3 \times \left(\dfrac{4}{3}\pi \times 4^3\right) \ &= 4\pi \times 64 \ &= 256\pi\text{ cm}^3 \end{aligned}$$ 남은 공간에 채워진 물의 부피는 원기둥 부피에서 쇠공의 부피를 뺀 값이므로 $$\begin{aligned} V_{\text{물}} &= 384\pi - 256\pi \ &= 128\pi\text{ cm}^3 \end{aligned}$$ 쇠공을 모두 꺼낸 후 물은 밑넓이가 $\pi \times 4^2 = 16\pi\text{ cm}^2$인 원기둥을 채우므로, 남아있는 물의 높이를 $h$라 하면 $$\begin{aligned} 16\pi \times h &= 128\pi \ h &= \dfrac{128\pi}{16\pi} \ &= 8\text{ cm} \end{aligned}$$ 따라서 남아있는 물의 높이는 $8\text{ cm}$이다.


{
  "status": "UNSUPPORTED",
  "reason": "원기둥 통 내부에 세로로 배치된 3개의 구와 물의 수위 변화 비교 다이어그램"
}

{
  "sourceQid": "23",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-07",
  "subUnitKey": "M1-07-SOLID_FIGURE_MEASURE",
  "conceptClusterKey": "SOLID_FIGURE",
  "primaryMethod": "원기둥 부피 384pi에서 공 3개 부피 256pi를 빼 물의 부피 128pi를 구하고 밑넓이 16pi로 나누어 높이 8cm를 서술한다.",
  "decisiveStep": "물의 부피 128pi 산출 및 밑넓이 16pi 나눗셈으로 높이 8cm 도출",
  "rpm": {
    "majorUnit": "입체도형",
    "midUnit": "입체도형의 겉넓이와 부피",
    "l3": "기둥의 겉넓이와 부피",
    "l4": "원기둥"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_SOLID_FIGURE_MEASURE",
    "templateKey": "TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION",
    "why": "공을 꺼낸 후 남은 액체의 부피 보존으로 수위를 역산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기하적 내접 조건(높이=24) 설정, 입체 부피 차 계산, 수위 역산의 3단계 서술형",
  "level": "중",
  "item4slot": {
    "given": [
      "원기둥",
      "구",
      "반지름"
    ],
    "goal": [
      "높이"
    ],
    "method": [
      "부피",
      "공식"
    ],
    "condition": [
      "접함"
    ]
  },
  "hold": ""
}
Q24
* 형식: 서답형
* 배점: 4
발문
[서술형 4] 다음은 어떤 학급 학생들의 수학 점수를 나타낸 상대도수의 분포표의 일부이다. 여학생 수가 25명, 남학생 수가 15명일 때, 이 학급 전체 학생에 대한 90점 이상 100점 미만인 계급의 상대도수를 구하시오. [4점] (여학생, 남학생 해당 계급의 도수를 구하는 과정: 각 1점, 전체 학생에 대한 해당 계급의 상대도수를 구하는 과정: 2점)


계급(점) | 여학생 상대도수 | 남학생 상대도수 (생 략) | | 90 ~ 100 | 0.12 | 0.20 합 계 | 1 | 1
선지
없음
정답
$0.15$
해설
여학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 25 \times 0.12 &= 3\text{ (명)} \end{aligned}$$ 남학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 15 \times 0.20 &= 3\text{ (명)} \end{aligned}$$ 따라서 학급 전체에서 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 3 + 3 &= 6\text{ (명)} \end{aligned}$$ 학급 전체 학생 수는 $$\begin{aligned} 25 + 15 &= 40\text{ (명)} \end{aligned}$$ 그러므로 전체 학생에 대한 해당 계급의 상대도수는 $$\begin{aligned} \text{상대도수} &= \dfrac{6}{40} \ &= 0.15 \end{aligned}$$ 따라서 정답은 $0.15$이다.


{
  "status": "EXEMPT",
  "reason": "두 집단 상대도수로부터 전체 상대도수 통합 산출 대수 문항"
}

{
  "sourceQid": "24",
  "variationType": "STRICT_VARIANT",
  "standardCourse": "중1",
  "courseKey": "MID-MATH-1",
  "curriculum": "2015",
  "standardUnitKey": "M1-08",
  "subUnitKey": "M1-08-DATA_INTERPRETATION",
  "conceptClusterKey": "DATA_INTERPRETATION",
  "primaryMethod": "여학생 해당 도수 3명과 남학생 해당 도수 3명을 각각 구하고 전체 40명으로 나누어 상대도수 6/40=0.15를 서술한다.",
  "decisiveStep": "각 집단 도수(3명, 3명) 복원 및 전체 인원 40명 대비 상대도수 0.15 산출",
  "rpm": {
    "majorUnit": "통계",
    "midUnit": "자료의 정리와 해석",
    "l3": "상대도수",
    "l4": "상대도수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M1_DATA_CATEGORY_PERCENTAGE",
    "templateKey": "TPL_M1_DATA_CATEGORY_PERCENTAGE_GROUP_COUNT_COMPARISON",
    "why": "두 집단의 상대도수와 인원으로 각각 실제 인원을 복원하여 전체 통합 비율을 계산하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "집단별 도수를 구한 뒤 전체 인원에 대한 새로운 상대도수를 산출하는 서술형",
  "level": "하",
  "item4slot": {
    "given": [
      "도수분포표",
      "상대도수",
      "도수"
    ],
    "goal": [
      "상대도수"
    ],
    "method": [
      "상대도수"
    ],
    "condition": [
      "집단"
    ]
  },
  "hold": ""
}
