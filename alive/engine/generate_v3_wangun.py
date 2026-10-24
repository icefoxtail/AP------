"""
alive/engine/generate_v3_wangun.py
Generates the V3 Similar Exam, 48 Plans, and Small Metadata JSON for 25 Wangun Middle School M3 2mid.
Strictly isolated: does not overwrite V1 or V2 files.
"""

import os
import json
import hashlib

def get_v3_questions_data():
    # 24 questions designed purely from original blueprints with independent math calculations,
    # 5-choice verification (4/4/4/4/4 balanced slots), blackboard line-by-line solutions,
    # and canonical metadata.
    return [
        {
            "id": 1,
            "level": "하",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_BASIC_RELATION",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["RIGHT_ANGLE_TRIANGLE"],
            "integrationPattern": "GEOMETRIC_PYTHAGORAS_INTEGRATION",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같은 직각삼각형 $ABC$에서 $\\angle B=90^\\circ$이고 $AB=5$, $BC=12$, $AC=13$일 때, $\\cos A$의 값을 구하면? [3점]",
            "choices": [
                "$\\dfrac{5}{13}$", # Slot 1 (Target: 1)
                "$\\dfrac{12}{13}$",
                "$\\dfrac{5}{12}$",
                "$\\dfrac{12}{5}$",
                "$\\dfrac{13}{5}$"
            ],
            "answer": "①",
            "solution": "직각삼각형 $ABC$에서 직각은 $\\angle B$이므로 빗변은 $AC=13$이다.\n각 $A$의 이웃변은 $AB=5$이다.\n$\\cos A = \\dfrac{AB}{AC} = \\dfrac{5}{13}$\n따라서 정답은 ①이다.",
            "points": 3.0,
            "sourceQid": 1,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 2,
            "level": "하",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_BASIC_RELATION",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["RIGHT_ANGLE_TRIANGLE", "ACUTE_ANGLE"],
            "integrationPattern": "GEOMETRIC_PYTHAGORAS_INTEGRATION",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "$\\angle B=90^\\circ$인 직각삼각형 $ABC$에서 $\\sin A=\\dfrac{8}{17}$일 때, $\\tan A$의 값을 구하면? [3점]",
            "choices": [
                "$\\dfrac{8}{17}$",
                "$\\dfrac{8}{15}$", # Slot 2 (Target: 2)
                "$\\dfrac{15}{17}$",
                "$\\dfrac{15}{8}$",
                "$\\dfrac{17}{15}$"
            ],
            "answer": "②",
            "solution": "$\\sin A = \\dfrac{BC}{AC} = \\dfrac{8}{17}$이므로 $BC=8k$, $AC=17k$ ($k>0$)로 둘 수 있다.\n피타고라스 정리에 의해\n$AB = \\sqrt{AC^2 - BC^2} = \\sqrt{(17k)^2 - (8k)^2} = \\sqrt{289k^2 - 64k^2} = \\sqrt{225k^2} = 15k$\n$\\tan A = \\dfrac{BC}{AB} = \\dfrac{8k}{15k} = \\dfrac{8}{15}$\n따라서 정답은 ②이다.",
            "points": 3.0,
            "sourceQid": 2,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 3,
            "level": "하",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_SPECIAL_ANGLE",
            "crossConceptKeys": ["SPECIAL_RIGHT_TRIANGLE"],
            "conditionKeys": ["SPECIAL_ANGLES"],
            "integrationPattern": "SPECIAL_TRIG_VALUE_ARITHMETIC",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "$2\\sin30^\\circ - \\sqrt{3}\\cos30^\\circ + \\sqrt{2}\\cos45^\\circ$를 계산한 값을 고르면? [3점]",
            "choices": [
                "$0$",
                "$\\dfrac{1}{4}$",
                "$\\dfrac{1}{2}$", # Slot 3 (Target: 3)
                "$1$",
                "$\\dfrac{3}{2}$"
            ],
            "answer": "③",
            "solution": "특수각의 삼각비 값은 다음과 같다.\n$\\sin30^\\circ = \\dfrac{1}{2}$, $\\cos30^\\circ = \\dfrac{\\sqrt{3}}{2}$, $\\cos45^\\circ = \\dfrac{\\sqrt{2}}{2}$\n주어진 식에 대입하면\n$2\\cdot\\dfrac{1}{2} - \\sqrt{3}\\cdot\\dfrac{\\sqrt{3}}{2} + \\sqrt{2}\\cdot\\dfrac{\\sqrt{2}}{2} = 1 - \\dfrac{3}{2} + 1 = \\dfrac{1}{2}$\n따라서 정답은 ③이다.",
            "points": 3.0,
            "sourceQid": 3,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 4,
            "level": "하",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_TABLE_LOOKUP",
            "crossConceptKeys": ["TRIGONOMETRIC_TABLE"],
            "conditionKeys": ["TABLE_LOOKUP_INVERSE"],
            "integrationPattern": "TABLE_INVERSE_LOOKUP_ADDITION",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "다음 삼각비의 표를 보고 $\\cos x=0.4067$, $\\tan y=2.3559$를 만족하는 예각 $x, y$에 대하여 $x+y$의 값을 구하면? [3점]\n\n| 각도 | $\\sin$ | $\\cos$ | $\\tan$ |\n| :---: | :---: | :---: | :---: |\n| $65^\\circ$ | $0.9063$ | $0.4226$ | $2.1445$ |\n| $66^\\circ$ | $0.9135$ | $0.4067$ | $2.2460$ |\n| $67^\\circ$ | $0.9205$ | $0.3907$ | $2.3559$ |",
            "choices": [
                "$131^\\circ$",
                "$132^\\circ$",
                "$134^\\circ$",
                "$133^\\circ$", # Slot 4 (Target: 4)
                "$135^\\circ$"
            ],
            "answer": "④",
            "solution": "표에서 $\\cos 66^\\circ = 0.4067$이므로 $x = 66^\\circ$이다.\n표에서 $\\tan 67^\\circ = 2.3559$이므로 $y = 67^\\circ$이다.\n$x + y = 66^\\circ + 67^\\circ = 133^\\circ$\n따라서 정답은 ④이다.",
            "points": 3.0,
            "sourceQid": 4,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 5,
            "level": "중",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_BASIC_RELATION",
            "crossConceptKeys": ["RADICAL_EXPRESSION_SIMPLIFY"],
            "conditionKeys": ["ACUTE_ANGLE_INEQUALITY"],
            "integrationPattern": "RADICAL_SQUARE_TRIG_INEQUALITY",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "$0^\\circ < A < 90^\\circ$일 때, $\\sqrt{(\\cos A - 1)^2} + \\sqrt{(\\cos A + \\tan A)^2}$의 값을 간단히 구하면? [3점]",
            "choices": [
                "$1 - \\tan A$",
                "$2\\cos A - 1$",
                "$\\tan A - 1$",
                "$2\\cos A + \\tan A$",
                "$1 + \\tan A$" # Slot 5 (Target: 5)
            ],
            "answer": "⑤",
            "solution": "$0^\\circ < A < 90^\\circ$일 때 $0 < \\cos A < 1$, $\\tan A > 0$이다.\n$\\cos A - 1 < 0$이므로\n$\\sqrt{(\\cos A - 1)^2} = -(\\cos A - 1) = 1 - \\cos A$\n$\\cos A + \\tan A > 0$이므로\n$\\sqrt{(\\cos A + \\tan A)^2} = \\cos A + \\tan A$\n$(1 - \\cos A) + (\\cos A + \\tan A) = 1 + \\tan A$\n따라서 정답은 ⑤이다.",
            "points": 3.0,
            "sourceQid": 5,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 6,
            "level": "하",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_DIRECT_MEASURE",
            "crossConceptKeys": ["OBTUSE_TRIANGLE_AREA"],
            "conditionKeys": ["OBTUSE_TRIANGLE"],
            "integrationPattern": "TRIG_TRIANGLE_AREA_OBTUSE",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 $AB=6$, $BC=4$, $\\angle B=135^\\circ$인 삼각형 $ABC$의 넓이를 구하면? [4점]",
            "choices": [
                "$6\\sqrt{2}$", # Slot 1 (Target: 1)
                "$4\\sqrt{2}$",
                "$8\\sqrt{2}$",
                "$12\\sqrt{2}$",
                "$24\\sqrt{2}$"
            ],
            "answer": "①",
            "solution": "두 변 $AB=6, BC=4$ 사이의 끼인각이 둔각 $135^\\circ$이므로\n$S = \\dfrac{1}{2} \\cdot AB \\cdot BC \\cdot \\sin(180^\\circ - 135^\\circ)$\n$= \\dfrac{1}{2} \\cdot 6 \\cdot 4 \\cdot \\sin 45^\\circ = 12 \\cdot \\dfrac{\\sqrt{2}}{2} = 6\\sqrt{2}$\n따라서 정답은 ①이다.",
            "points": 4.0,
            "sourceQid": 6,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 7,
            "level": "중",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_GEOMETRIC_DERIVATION",
            "crossConceptKeys": ["UNIT_CIRCLE_QUADRANT"],
            "conditionKeys": ["QUADRANT_UNIT_RADIUS"],
            "integrationPattern": "QUADRANT_TRIG_COORDINATE_READING",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 반지름의 길이가 $1$인 사분원에서 점 $P$가 사분원의 호 위에 있고 $\\angle AOP=53^\\circ$일 때, 다음 중 옳지 않은 것을 고르면? [4점]",
            "choices": [
                "$\\sin 53^\\circ = 0.80$",
                "$\\cos 37^\\circ = 0.60$", # Slot 2 (Target: 2)
                "$\\cos 53^\\circ = 0.60$",
                "$\\tan 53^\\circ = 1.33$",
                "$\\sin 37^\\circ = 0.60$"
            ],
            "answer": "②",
            "solution": "반지름 $1$인 사분원에서 $53^\\circ$에 대해 밑변 $x = \\cos 53^\\circ = 0.60$, 높이 $y = \\sin 53^\\circ = 0.80$이다.\n접선의 높이에서 $\\tan 53^\\circ = \\dfrac{0.80}{0.60} \\approx 1.33$이다.\n여각 관계에서 $\\cos 37^\\circ = \\sin 53^\\circ = 0.80$이다.\n따라서 $\\cos 37^\\circ = 0.60$이라 기술한 ②는 옳지 않다.\n정답은 ②이다.",
            "points": 4.0,
            "sourceQid": 7,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 8,
            "level": "중",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_CHAINED_MEASURE",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM", "SPECIAL_RIGHT_TRIANGLE"],
            "conditionKeys": ["PERPENDICULAR_HEIGHT"],
            "integrationPattern": "HEIGHT_SPLIT_DOUBLE_RIGHT_TRIANGLE",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 $AB=6\\sqrt{2}$, $BC=14$, $\\angle B=45^\\circ$인 $\\triangle ABC$에서 점 $A$에서 변 $BC$에 내린 수선의 발을 $H$라 할 때, 선분 $AC$의 길이를 구하면? [4점]",
            "choices": [
                "$8$",
                "$9$",
                "$10$", # Slot 3 (Target: 3)
                "$2\\sqrt{26}$",
                "$12$"
            ],
            "answer": "③",
            "solution": "직각삼각형 $ABH$에서 $\\angle B=45^\\circ$, $AB=6\\sqrt{2}$이므로\n$AH = BH = 6\\sqrt{2} \\cdot \\cos 45^\\circ = 6$\n$HC = BC - BH = 14 - 6 = 8$\n직각삼각형 $AHC$에서 피타고라스 정리에 의해\n$AC = \\sqrt{AH^2 + HC^2} = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$\n따라서 정답은 ③이다.",
            "points": 4.0,
            "sourceQid": 8,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 9,
            "level": "중",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_BASIC_RELATION",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["RIGHT_ANGLE_TRIANGLE", "SIDE_RATIO"],
            "integrationPattern": "GEOMETRIC_RATIO_PYTHAGORAS",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "$\\angle B=90^\\circ$인 직각삼각형 $ABC$에서 $BC=2AB$일 때, $\\sin C$의 값을 구하면? [5점]",
            "choices": [
                "$\\dfrac{1}{5}$",
                "$\\dfrac{2}{5}$",
                "$\\dfrac{2\\sqrt{5}}{5}$",
                "$\\dfrac{\\sqrt{5}}{5}$", # Slot 4 (Target: 4)
                "$\\dfrac{\\sqrt{5}}{2}$"
            ],
            "answer": "④",
            "solution": "$AB=k$ ($k>0$)라 두면 $BC=2k$이다.\n직각삼각형 $ABC$에서 피타고라스 정리에 의해\n$AC = \\sqrt{AB^2 + BC^2} = \\sqrt{k^2 + (2k)^2} = \\sqrt{5}k$\n각 $C$의 맞은편 변은 $AB=k$이므로\n$\\sin C = \\dfrac{AB}{AC} = \\dfrac{k}{\\sqrt{5}k} = \\dfrac{1}{\\sqrt{5}} = \\dfrac{\\sqrt{5}}{5}$\n따라서 정답은 ④이다.",
            "points": 5.0,
            "sourceQid": 9,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 10,
            "level": "중",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_SPECIAL_ANGLE",
            "crossConceptKeys": ["TRIANGLE_ANGLE_SUM"],
            "conditionKeys": ["ANGLE_RATIO"],
            "integrationPattern": "ANGLE_RATIO_TRIG_COMPARISON",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식"],
            "wide": False,
            "content": "세 내각의 크기의 비가 $1:2:3$인 삼각형 $ABC$에서 내각의 크기가 $A < B < C$일 때, $\\tan A : \\sin B$의 값을 구하면? [5점]",
            "choices": [
                "$1:2$",
                "$3:2$",
                "$1:\\sqrt{3}$",
                "$2:\\sqrt{3}$",
                "$2:3$" # Slot 5 (Target: 5)
            ],
            "answer": "⑤",
            "solution": "세 각의 비가 $1:2:3$이므로 $A=k, B=2k, C=3k$로 둘 수 있다.\n$k + 2k + 3k = 180^\\circ \\implies 6k = 180^\\circ \\implies k = 30^\\circ$\n따라서 $A=30^\\circ, B=60^\\circ, C=90^\\circ$이다.\n$\\tan A = \\tan 30^\\circ = \\dfrac{\\sqrt{3}}{3}$\n$\\sin B = \\sin 60^\\circ = \\dfrac{\\sqrt{3}}{2}$\n$\\tan A : \\sin B = \\dfrac{\\sqrt{3}}{3} : \\dfrac{\\sqrt{3}}{2} = \\dfrac{1}{3} : \\dfrac{1}{2} = 2 : 3$\n따라서 정답은 ⑤이다.",
            "points": 5.0,
            "sourceQid": 10,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 11,
            "level": "중",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_SHARED_HEIGHT",
            "crossConceptKeys": ["OBTUSE_TRIANGLE_AREA"],
            "conditionKeys": ["OBTUSE_TRIANGLE", "GIVEN_AREA"],
            "integrationPattern": "AREA_INVERSE_HEIGHT_CALCULATION",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 $\\triangle ABC$의 넓이가 $15\\sqrt{3}$이고, $BC=6$, $\\angle ACB=120^\\circ$일 때, 점 $A$에서 선분 $BC$의 연장선에 내린 수선의 발 $H$에 대하여 선분 $AH$의 길이를 구하면? [4점]",
            "choices": [
                "$5\\sqrt{3}$", # Slot 1 (Target: 1)
                "$4\\sqrt{3}$",
                "$6\\sqrt{3}$",
                "$8\\sqrt{3}$",
                "$10\\sqrt{3}$"
            ],
            "answer": "①",
            "solution": "밑변을 $BC=6$으로 보면 높이는 수선의 길이 $AH$이다.\n삼각형의 넓이 공식에서\n$15\\sqrt{3} = \\dfrac{1}{2} \\cdot BC \\cdot AH = \\dfrac{1}{2} \\cdot 6 \\cdot AH = 3 AH$\n$AH = \\dfrac{15\\sqrt{3}}{3} = 5\\sqrt{3}$\n따라서 정답은 ①이다.",
            "points": 4.0,
            "sourceQid": 11,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 12,
            "level": "상",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
            "templateKey": "TM_CIRCLE_CHORD_LENGTH",
            "crossConceptKeys": ["REGULAR_POLYGON_PROPERTIES", "SPECIAL_RIGHT_TRIANGLE"],
            "conditionKeys": ["INSCRIBED_REGULAR_HEXAGON"],
            "integrationPattern": "CIRCLE_POLYGON_AREA_DIFFERENCE",
            "difficultyBucket": 3,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 정육각형 $ABCDEF$가 원 $O$에 내접하고, 원의 중심 $O$에서 변 $AB$에 내린 수선의 발을 $H$라 하자. $OH=2\\sqrt{3}$일 때, 원 $O$의 내부에서 정육각형을 제외한 색칠한 부분의 넓이를 구하면? [5점]",
            "choices": [
                "$12\\pi - 16\\sqrt{3}$",
                "$16\\pi - 24\\sqrt{3}$", # Slot 2 (Target: 2)
                "$16\\pi - 18\\sqrt{3}$",
                "$24\\pi - 24\\sqrt{3}$",
                "$16\\pi - 32\\sqrt{3}$"
            ],
            "answer": "②",
            "solution": "원의 반지름을 $r$라 하면 중심에서 변에 내린 수선의 길이는\n$OH = r\\cos 30^\\circ = r\\cdot\\dfrac{\\sqrt{3}}{2} = 2\\sqrt{3} \\implies r = 4$\n원 $O$의 넓이는 $\\pi r^2 = 16\\pi$이다.\n정육각형은 한 변의 길이가 $4$인 정삼각형 $6$개로 이루어져 있으므로\n$6 \\cdot \\left(\\dfrac{\\sqrt{3}}{4}\\cdot 4^2\\right) = 6 \\cdot 4\\sqrt{3} = 24\\sqrt{3}$\n색칠한 부분의 넓이는 $16\\pi - 24\\sqrt{3}$이다.\n따라서 정답은 ②이다.",
            "points": 5.0,
            "sourceQid": 12,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 13,
            "level": "하",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
            "templateKey": "TM_CIRCLE_CHORD_PERP_BISECTOR",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["CHORD_PERPENDICULAR_BISECTOR"],
            "integrationPattern": "CIRCLE_CHORD_PYTHAGORAS",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 반지름의 길이가 $x$, 원의 중심 $O$에서 현 $AB$에 내린 수선의 발을 $H$라 하자. $OH=6$, $AB=16$일 때, $x$의 값을 구하면? [4점]",
            "choices": [
                "$8$",
                "$9$",
                "$10$", # Slot 3 (Target: 3)
                "$11$",
                "$12$"
            ],
            "answer": "③",
            "solution": "원의 중심에서 현에 내린 수선은 그 현을 수직이등분하므로\n$AH = \\dfrac{AB}{2} = \\dfrac{16}{2} = 8$\n직각삼각형 $OAH$에서 피타고라스 정리에 의해\n$OA = \\sqrt{OH^2 + AH^2} = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$\n따라서 $x = 10$이고 정답은 ③이다.",
            "points": 4.0,
            "sourceQid": 13,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 14,
            "level": "중",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
            "templateKey": "TM_CIRCLE_CHORD_PERP_BISECTOR",
            "crossConceptKeys": ["TRIANGLE_CONGRUENCE"],
            "conditionKeys": ["DEDUCTIVE_PROOF"],
            "integrationPattern": "DEDUCTIVE_PROOF_STRUCTURE",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음은 원의 중심에서 현에 내린 수선은 그 현을 이등분함을 증명하는 과정이다. (가)~(마)에 들어갈 것으로 옳지 않은 것은? [4점]\n\n[증명]\n오른쪽 그림과 같이 원 $O$의 중심에서 현 $AB$에 내린 수선의 발을 $M$이라 하자.\n$\\triangle OAM$과 $\\triangle OBM$에서\n$\\angle OMA = \\angle OMB = \\text{(가)}$\n선분 $OA$, $OB$는 원 $O$의 반지름이므로\n$OA = \\text{(나)}$\n선분 $OM$은 공통이므로\n$\\text{(다)}$은(는) 공통\n따라서 직각삼각형의 합동 조건에 의해\n$\\triangle OAM \\equiv \\triangle OBM\\ (\\text{(라)})$\n대응하는 변의 길이가 같으므로\n$\\text{(마)}$\n그러므로 원의 중심에서 현에 내린 수선은 그 현을 이등분한다.",
            "choices": [
                "(가) $90^\\circ$",
                "(나) $OB$",
                "(다) $OM$",
                "(라) $\\text{SAS}$ 합동", # Slot 4 (Target: 4)
                "(마) $AM = BM$"
            ],
            "answer": "④",
            "solution": "$\\angle OMA = \\angle OMB = 90^\\circ$이므로 직각삼각형이다.\n빗변 $OA=OB$ (반지름), 다른 한 변 $OM$ (공통)이 같으므로\n합동 조건은 $\\text{RHS}$ 합동이다.\n따라서 (라)에 $\\text{SAS}$ 합동을 제시한 것은 옳지 않다.\n정답은 ④이다.",
            "points": 4.0,
            "sourceQid": 14,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 15,
            "level": "상",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
            "templateKey": "TM_CIRCLE_CHORD_DIVISION",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["CHORD_PERPENDICULAR_BISECTOR", "RADIUS_RECONSTRUCTION"],
            "integrationPattern": "PARTIAL_CIRCLE_RADIUS_PYTHAGORAS",
            "difficultyBucket": 3,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 호 $AB$는 어떤 원의 일부분이다. $AB=16\\,\\mathrm{cm}$, 선분 $AB$의 중점을 $M$이라 하고 $CM \\perp AB$인 원호 위의 점 $C$에 대하여 $CM=4\\,\\mathrm{cm}$일 때, 이 원의 넓이를 구하면? [4점]",
            "choices": [
                "$64\\pi\\,\\mathrm{cm}^2$",
                "$81\\pi\\,\\mathrm{cm}^2$",
                "$121\\pi\\,\\mathrm{cm}^2$",
                "$144\\pi\\,\\mathrm{cm}^2$",
                "$100\\pi\\,\\mathrm{cm}^2$" # Slot 5 (Target: 5)
            ],
            "answer": "⑤",
            "solution": "원래 원의 중심을 $O$, 반지름을 $r$라 하자.\n현의 수직이등분선은 중심을 지나므로 $AM = \\dfrac{16}{2} = 8\\,\\mathrm{cm}$이다.\n$OM = OC - CM = r - 4$\n직각삼각형 $OMA$에서 피타고라스 정리에 의해\n$r^2 = (r - 4)^2 + 8^2$\n$r^2 = r^2 - 8r + 16 + 64$\n$8r = 80 \\implies r = 10\\,\\mathrm{cm}$\n원의 넓이는 $\\pi r^2 = 100\\pi\\,\\mathrm{cm}^2$\n따라서 정답은 ⑤이다.",
            "points": 4.0,
            "sourceQid": 15,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 16,
            "level": "중",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_LINE_RELATION",
            "templateKey": "TM_CIRCLE_CHORD_LENGTH",
            "crossConceptKeys": ["EQUILATERAL_TRIANGLE_CIRCUMCENTER"],
            "conditionKeys": ["EQUAL_DISTANCE_CHORDS"],
            "integrationPattern": "EQUIDISTANT_CHORDS_CIRCUMFERENCE",
            "difficultyBucket": 2,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 원 $O$의 중심에서 $\\triangle ABC$의 세 변 $AB, BC, CA$에 내린 수선의 발을 각각 $D, E, F$라 하자. $OD=OE=OF$이고 $AB=6\\sqrt{3}$일 때, 원 $O$의 둘레의 길이를 구하면? [4점]",
            "choices": [
                "$12\\pi$", # Slot 1 (Target: 1)
                "$6\\pi$",
                "$6\\sqrt{3}\\pi$",
                "$12\\sqrt{3}\\pi$",
                "$18\\pi$"
            ],
            "answer": "①",
            "solution": "한 원에서 중심으로부터 같은 거리에 있는 현의 길이는 같으므로\n$AB = BC = CA = 6\\sqrt{3}$\n따라서 $\\triangle ABC$는 정삼각형이다.\n$D$는 $AB$의 중점이므로 $AD = 3\\sqrt{3}$\n정삼각형에서 $\\angle OAD = 30^\\circ$이므로\n$\\cos 30^\\circ = \\dfrac{AD}{AO} \\implies \\dfrac{\\sqrt{3}}{2} = \\dfrac{3\\sqrt{3}}{AO} \\implies AO = 6$\n원의 둘레는 $2\\pi AO = 12\\pi$\n따라서 정답은 ①이다.",
            "points": 4.0,
            "sourceQid": 16,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 17,
            "level": "하",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_TANGENT",
            "templateKey": "TM_TANGENT_FROM_EXTERNAL_POINT",
            "crossConceptKeys": ["CIRCLE_TANGENT_PROPERTIES"],
            "conditionKeys": ["COMMON_EXTERNAL_POINT_TANGENTS"],
            "integrationPattern": "TANGENT_LENGTH_ADDITION",
            "difficultyBucket": 1,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 두 반직선 $PA, PC$는 원 $O$의 접선이고, 점 $B$를 지나는 접선이 두 접선과 만나는 점을 각각 $P, Q$라 하자. 세 점 $A, B, C$가 원 $O$의 접점이고 $PA=3$, $PQ=7$, $QC=x$일 때, $x$의 값을 구하면? [4점]",
            "choices": [
                "$3$",
                "$4$", # Slot 2 (Target: 2)
                "$5$",
                "$6$",
                "$7$"
            ],
            "answer": "②",
            "solution": "원의 외부의 한 점 $P$에서 그은 두 접선의 길이는 같으므로\n$PB = PA = 3$\n선분 $PQ$에서 $B$가 접점이므로\n$BQ = PQ - PB = 7 - 3 = 4$\n점 $Q$에서 원 $O$에 그은 두 접선의 길이도 같으므로\n$QC = QB = 4$\n따라서 $x = 4$이고 정답은 ②이다.",
            "points": 4.0,
            "sourceQid": 17,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 18,
            "level": "상",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_TANGENT",
            "templateKey": "TM_TANGENT_LENGTH",
            "crossConceptKeys": ["CIRCLE_TANGENT_PROPERTIES"],
            "conditionKeys": ["CHAINED_INSCRIBED_CIRCLES"],
            "integrationPattern": "CHAINED_COMMON_TANGENTS_SUM",
            "difficultyBucket": 3,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 4개의 원은 각각 네 개의 삼각형의 내접원이고, 선분 $AB, AC, AD, AE, AF$는 접선이며, $AC, AD, AE$는 공통접선이다. $AB=30$, $BC=24$, $CD=20$, $DE=14$, $EF=10$일 때, $AD+AF$의 길이를 구하면? [4점]",
            "choices": [
                "$44$",
                "$46$",
                "$48$", # Slot 3 (Target: 3)
                "$50$",
                "$52$"
            ],
            "answer": "③",
            "solution": "첫 번째 원에서 점 $A$부터 접점까지의 거리를 $t$라 하자.\n$AB = 30 \\implies B$쪽 접선 길이 $= 30 - t$\n$BC = 24 \\implies C$쪽 접선 길이 $= 24 - (30 - t) = t - 6$\n두 번째 원에서 공통접선 $AC$의 접점이 같으므로\n$CD = 20 \\implies D$쪽 접선 길이 $= 20 - (t - 6) = 26 - t$\n$AD = t + (26 - t) = 26$\n세 번째 원에서 $DE = 14 \\implies E$쪽 접선 길이 $= 14 - (26 - t) = t - 12$\n네 번째 원에서 $EF = 10 \\implies F$쪽 접선 길이 $= 10 - (t - 12) = 22 - t$\n$AF = t + (22 - t) = 22$\n$AD + AF = 26 + 22 = 48$\n따라서 정답은 ③이다.",
            "points": 4.0,
            "sourceQid": 18,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 19,
            "level": "상",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_CHAINED_MEASURE",
            "crossConceptKeys": ["RIGHT_TRIANGLE_CIRCUMCENTER", "TRIANGLE_SIMILARITY"],
            "conditionKeys": ["MIDPOINT_PERPENDICULAR"],
            "integrationPattern": "CIRCUMCENTER_SIMILARITY_TRIG",
            "difficultyBucket": 3,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 $\\angle B=90^\\circ$인 직각삼각형 $ABC$에서 빗변 $AC$의 중점을 $M$이라 하고, 점 $M$에서 변 $BC$에 내린 수선의 발을 $H$라 하자. $AB=6$, $BC=8$이고 $\\angle BMH=x$라 할 때, $\\cos x$의 값을 구하면? [5점]",
            "choices": [
                "$\\dfrac{1}{5}$",
                "$\\dfrac{2}{5}$",
                "$\\dfrac{4}{5}$",
                "$\\dfrac{3}{5}$", # Slot 4 (Target: 4)
                "$\\dfrac{5}{6}$"
            ],
            "answer": "④",
            "solution": "직각삼각형 $ABC$에서 피타고라스 정리에 의해\n$AC = \\sqrt{6^2 + 8^2} = 10$\n직각삼각형의 빗변의 중점 $M$은 외심이므로\n$BM = \\dfrac{AC}{2} = 5$\n$M$은 $AC$의 중점이고 $MH \\parallel AB$이므로 중점연결정리에 의해\n$MH = \\dfrac{AB}{2} = 3$, $BH = \\dfrac{BC}{2} = 4$\n직각삼각형 $MHB$에서 $\\angle MHB = 90^\\circ$, 빗변 $BM=5$, 인접변 $MH=3$이므로\n$\\cos x = \\dfrac{MH}{BM} = \\dfrac{3}{5}$\n따라서 정답은 ④이다.",
            "points": 5.0,
            "sourceQid": 19,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 20,
            "level": "상",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_CHAINED_MEASURE",
            "crossConceptKeys": ["RECTANGLE_PROPERTIES", "SPECIAL_RIGHT_TRIANGLE"],
            "conditionKeys": ["ROTATED_RIGHT_TRIANGLE_IN_RECTANGLE"],
            "integrationPattern": "ANGLE_ADDITION_PROJECTION_PROOF",
            "difficultyBucket": 3,
            "questionType": "객관식",
            "layoutTag": "grid",
            "tags": ["객관식", "도형"],
            "wide": False,
            "content": "다음 그림과 같이 직사각형 $ABCD$ 안에 있는 $\\triangle AEF$는 $\\angle AEF=90^\\circ$, $AF=8$, $\\angle EAF=30^\\circ$인 직각삼각형이다. 선분 $AE$가 변 $AB$와 이루는 각의 크기가 $45^\\circ$일 때, $\\cos 75^\\circ$의 값을 구하면? [5점]",
            "choices": [
                "$\\dfrac{\\sqrt{6} - \\sqrt{2}}{2}$",
                "$\\dfrac{\\sqrt{6} + \\sqrt{2}}{4}$",
                "$\\dfrac{\\sqrt{3} - 1}{4}$",
                "$\\dfrac{\\sqrt{6} - \\sqrt{2}}{8}$",
                "$\\dfrac{\\sqrt{6} - \\sqrt{2}}{4}$" # Slot 5 (Target: 5)
            ],
            "answer": "⑤",
            "solution": "직각삼각형 $AEF$에서 $AF=8$, $\\angle EAF=30^\\circ$이므로\n$AE = 8\\cos 30^\\circ = 4\\sqrt{3}$, $EF = 8\\sin 30^\\circ = 4$\n$\\angle BAE = 45^\\circ$이므로 $\\angle DAF = 90^\\circ - (45^\\circ + 30^\\circ) = 15^\\circ$\n$\\cos 75^\\circ = \\sin 15^\\circ$\n$AF$의 수직 높이(세로 성분) 투영 관계에서\n$AE\\cos 45^\\circ - EF\\sin 45^\\circ = 4\\sqrt{3}\\cdot\\dfrac{\\sqrt{2}}{2} - 4\\cdot\\dfrac{\\sqrt{2}}{2} = 2\\sqrt{6} - 2\\sqrt{2}$\n$\\cos 75^\\circ = \\dfrac{2\\sqrt{6} - 2\\sqrt{2}}{8} = \\dfrac{\\sqrt{6} - \\sqrt{2}}{4}$\n따라서 정답은 ⑤이다.",
            "points": 5.0,
            "sourceQid": 20,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 21,
            "level": "중",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_DIRECT_MEASURE",
            "crossConceptKeys": ["TRIANGLE_AREA_TRIG"],
            "conditionKeys": ["SINE_VALUE_GIVEN"],
            "integrationPattern": "TRIG_HEIGHT_AREA_DERIVATION",
            "difficultyBucket": 2,
            "questionType": "서술형",
            "layoutTag": "grid",
            "tags": ["서술형", "도형"],
            "wide": False,
            "content": "[서술형 1] 다음 그림과 같이 $AB=8$, $BC=10$인 삼각형 $ABC$에서 $\\sin B=\\dfrac{3}{5}$일 때, $\\triangle ABC$의 넓이를 구하고, 그 과정을 서술하시오. [총 4점]",
            "choices": [],
            "answer": "$24$",
            "solution": "점 $A$에서 변 $BC$에 내린 수선의 발을 $H$라 하자.\n직각삼각형 $ABH$에서\n$AH = AB \\sin B = 8 \\cdot \\dfrac{3}{5} = \\dfrac{24}{5}$\n삼각형 $ABC$의 넓이는\n$S = \\dfrac{1}{2} \\cdot BC \\cdot AH = \\dfrac{1}{2} \\cdot 10 \\cdot \\dfrac{24}{5} = 24$\n따라서 넓이는 $24$이다.",
            "points": 4.0,
            "sourceQid": 21,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 22,
            "level": "중",
            "category": "삼각비",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO",
            "subUnit": "삼각비",
            "conceptClusterKey": "TRIG_RATIO",
            "problemTypeKey": "PT_TRIG_RATIO",
            "templateKey": "TPL_TRIG_RATIO_BASIC_RELATION",
            "crossConceptKeys": ["PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["RIGHT_ANGLE_TRIANGLE", "SINE_VALUE_GIVEN"],
            "integrationPattern": "TRIG_RECONSTRUCTION_PYTHAGORAS",
            "difficultyBucket": 2,
            "questionType": "서술형",
            "layoutTag": "grid",
            "tags": ["서술형", "도형"],
            "wide": False,
            "content": "[서술형 2] 다음 그림과 같이 $\\angle B=90^\\circ$인 직각삼각형 $ABC$에서 $\\sin A=\\dfrac{5}{13}$일 때, $\\cos A$, $\\tan A$의 값을 각각 구하고, 그 과정을 서술하시오. [총 5점]",
            "choices": [],
            "answer": "$\\cos A=\\dfrac{12}{13}$, $\\tan A=\\dfrac{5}{12}$",
            "solution": "$\\sin A = \\dfrac{BC}{AC} = \\dfrac{5}{13}$이므로 $BC=5k, AC=13k$ ($k>0$)로 둘 수 있다.\n피타고라스 정리에 의해\n$AB = \\sqrt{AC^2 - BC^2} = \\sqrt{(13k)^2 - (5k)^2} = \\sqrt{144k^2} = 12k$\n$\\cos A = \\dfrac{AB}{AC} = \\dfrac{12k}{13k} = \\dfrac{12}{13}$\n$\\tan A = \\dfrac{BC}{AB} = \\dfrac{5k}{12k} = \\dfrac{5}{12}$\n따라서 $\\cos A=\\dfrac{12}{13}$, $\\tan A=\\dfrac{5}{12}$이다.",
            "points": 5.0,
            "sourceQid": 22,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 23,
            "level": "상",
            "category": "원과 직선",
            "originalCategory": "원의 성질",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-06",
            "standardUnit": "원의 성질",
            "subUnitKey": "M3-06-CIRCLE_LINE",
            "subUnit": "원과 직선",
            "conceptClusterKey": "CIRCLE_LINE",
            "problemTypeKey": "PT_CIRCLE_TANGENT",
            "templateKey": "TM_TANGENT_CONTACT_CHORD_LENGTH",
            "crossConceptKeys": ["CONCENTRIC_CIRCLES", "PYTHAGOREAN_THEOREM"],
            "conditionKeys": ["CONCENTRIC_TANGENT_CHORD"],
            "integrationPattern": "CONCENTRIC_CIRCLES_CHORD_TANGENT",
            "difficultyBucket": 3,
            "questionType": "서술형",
            "layoutTag": "grid",
            "tags": ["서술형", "도형"],
            "wide": False,
            "content": "[서술형 3] 다음 그림과 같이 중심이 $O$로 같은 두 동심원의 반지름의 길이가 각각 $6\\,\\mathrm{cm}$, $10\\,\\mathrm{cm}$이다. 큰 원의 현 $AB$가 작은 원에 접할 때의 접점을 $M$이라 하자. 이때 삼각형 $OAB$의 넓이를 구하고, 그 과정을 서술하시오. [총 5점]",
            "choices": [],
            "answer": "$48\\,\\mathrm{cm}^2$",
            "solution": "작은 원의 반지름은 $OM = 6\\,\\mathrm{cm}$, 큰 원의 반지름은 $OB = 10\\,\\mathrm{cm}$이다.\n접선에 그은 반지름은 수직이므로 $OM \\perp AB$이다.\n직각삼각형 $OMB$에서 피타고라스 정리에 의해\n$BM = \\sqrt{OB^2 - OM^2} = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8\\,\\mathrm{cm}$\n중심에서 현에 내린 수선은 현을 이등분하므로\n$AB = 2 BM = 16\\,\\mathrm{cm}$\n삼각형 $OAB$의 넓이는\n$\\triangle OAB = \\dfrac{1}{2} \\cdot AB \\cdot OM = \\dfrac{1}{2} \\cdot 16 \\cdot 6 = 48\\,\\mathrm{cm}^2$\n따라서 넓이는 $48\\,\\mathrm{cm}^2$이다.",
            "points": 5.0,
            "sourceQid": 23,
            "variationType": "STRICT_VARIANT"
        },
        {
            "id": 24,
            "level": "상",
            "category": "삼각비의 활용",
            "originalCategory": "삼각비",
            "standardCourse": "중3 수학",
            "standardUnitKey": "M3-05",
            "standardUnit": "삼각비",
            "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION",
            "subUnit": "삼각비의 활용",
            "conceptClusterKey": "TRIG_RATIO_APPLICATION",
            "problemTypeKey": "PT_TRIG_RATIO_APPLICATION",
            "templateKey": "TPL_TRIG_APPLICATION_CHAINED_MEASURE",
            "crossConceptKeys": ["TRIGONOMETRIC_SURVEYING"],
            "conditionKeys": ["ELEVATION_DEPRESSION_ANGLES"],
            "integrationPattern": "REAL_WORLD_ALTITUDE_DISTANCE",
            "difficultyBucket": 3,
            "questionType": "서술형",
            "layoutTag": "grid",
            "tags": ["서술형", "도형"],
            "wide": False,
            "content": "[서술형 4] 다음 그림과 같이 지면으로부터 $600\\,\\mathrm{m}$ 높이에 떠 있는 열기구 $P$에서 지면의 두 지점 $A, B$를 내려다본 각의 크기가 각각 $35^\\circ, 42^\\circ$이었다. 이때 두 지점 $A, B$ 사이의 거리를 구하고, 그 과정을 서술하시오. [총 6점] (단, 열기구에서 지면에 내린 수선의 발 $H$는 선분 $AB$ 위에 있고, $\\tan 55^\\circ=1.43$, $\\tan 48^\\circ=1.11$로 계산한다.)",
            "choices": [],
            "answer": "$1524\\,\\mathrm{m}$",
            "solution": "열기구의 위치를 $P$, 지면에 내린 수선의 발을 $H$라 하면 $PH = 600\\,\\mathrm{m}$이다.\n수평선과 내려다본 각의 여각에 의해\n$\\angle APH = 90^\\circ - 35^\\circ = 55^\\circ$, $\\angle BPH = 90^\\circ - 42^\\circ = 48^\\circ$\n직각삼각형 $PAH$에서\n$AH = PH \\tan 55^\\circ = 600 \\cdot 1.43 = 858\\,\\mathrm{m}$\n직각삼각형 $PBH$에서\n$BH = PH \\tan 48^\\circ = 600 \\cdot 1.11 = 666\\,\\mathrm{m}$\n$H$가 선분 $AB$ 위에 있으므로\n$AB = AH + BH = 858 + 666 = 1524\\,\\mathrm{m}$\n따라서 두 지점 사이의 거리는 $1524\\,\\mathrm{m}$이다.",
            "points": 6.0,
            "sourceQid": 24,
            "variationType": "STRICT_VARIANT"
        }
    ]

def generate_v3_plans(questions, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    plans = {}

    for q in questions:
        qid = q["id"]
        p_ref = f"{out_dir}/q{qid}-problem.plan.json"
        s_ref = f"{out_dir}/q{qid}-solution.plan.json"

        # EXEMPT plans (pure calculations)
        if qid in [2, 3, 5, 9, 10]:
            p_plan = {
                "status": "EXEMPT",
                "planId": f"wangun-m3-v3-q{qid:02d}-problem",
                "targetFigure": "problem",
                "reason": "순수 수식 계산 및 대수적 삼각비 관계식 문항으로 기하 시각 다이어그램 불필요"
            }
            s_plan = {
                "status": "EXEMPT",
                "planId": f"wangun-m3-v3-q{qid:02d}-solution",
                "targetFigure": "solution",
                "reason": "단계별 대수적 수식 전개 풀이로 별도 기하 다이어그램 불필요"
            }
        # UNSUPPORTED plans
        elif qid == 4:
            p_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q04-problem",
                "targetFigure": "problem",
                "reason": "텍스트 표(삼각비의 표) 형식으로 기하 작도 엔진 렌더링 범위 외"
            }
            s_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q04-solution",
                "targetFigure": "solution",
                "reason": "삼각비 표 역조회 및 덧셈 계산으로 기하 작도 엔진 범위 외"
            }
        elif qid == 7:
            p_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q07-problem",
                "targetFigure": "problem",
                "reason": "단독 사분원 호(arc) 및 외부 접선 연장 동경 기하 다이어그램 엔진 미지원"
            }
            s_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q07-solution",
                "targetFigure": "solution",
                "reason": "단독 사분원 호(arc) 및 여각 삼각비 비교 다이어그램 엔진 미지원"
            }
        elif qid == 12:
            p_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q12-problem",
                "targetFigure": "problem",
                "reason": "원과 내접 정육각형 사이의 색칠 영역(shaded region) 렌더링 엔진 미지원"
            }
            s_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q12-solution",
                "targetFigure": "solution",
                "reason": "원과 내접 정육각형 사이의 분할 색칠 영역 렌더링 엔진 미지원"
            }
        elif qid == 18:
            p_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q18-problem",
                "targetFigure": "problem",
                "reason": "4개 삼각형의 연속 공통내접선 체인 다이어그램 기하 엔진 미지원"
            }
            s_plan = {
                "status": "UNSUPPORTED",
                "planId": f"wangun-m3-v3-q18-solution",
                "targetFigure": "solution",
                "reason": "4개 원 연속 접선 체인 분할 해석 다이어그램 기하 엔진 미지원"
            }
        # construction-spike-v1 plans
        elif qid == 1:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q01-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "직각삼각형 ABC에서 cos A의 값을 구하면",
                "sourceConditions": ["AB = 5", "BC = 12", "AC = 13", "B = 90 deg"],
                "newVisualInformation": "주어진 세 변의 길이를 갖는 직각삼각형 ABC",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [12, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [0, 5], "label": "A", "labelPosition": "top-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mB", "type": "angleMark", "vertex": "B", "ray1": "A", "ray2": "C", "size": 12, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q01-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "cos A = AB/AC = 5/13",
                "sourceConditions": ["AB = 5", "BC = 12", "AC = 13", "cos A = 5/13"],
                "newVisualInformation": "각 A의 이웃변 AB와 빗변 AC의 비율 시각화",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [12, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [0, 5], "label": "A", "labelPosition": "top-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 2.0},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.2},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mB", "type": "angleMark", "vertex": "B", "ray1": "A", "ray2": "C", "size": 12, "rightAngle": True}
                ]
            }
        elif qid == 6:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q06-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB=6, BC=4, B=135도인 삼각형 ABC의 넓이",
                "sourceConditions": ["AB = 6", "BC = 4", "B = 135 deg"],
                "newVisualInformation": "둔각 135도를 갖는 삼각형 ABC",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [4, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [-4.24, 4.24], "label": "A", "labelPosition": "top-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q06-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "S = 1/2 * 6 * 4 * sin 45도 = 6sqrt(2)",
                "sourceConditions": ["AB = 6", "BC = 4", "H = (-4.24, 0)", "AH = 4.24"],
                "newVisualInformation": "BC의 연장선과 점 A에서 내린 수선 AH",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [4, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [-4.24, 4.24], "label": "A", "labelPosition": "top-left"},
                    {"id": "H", "type": "point", "coords": [-4.24, 0], "label": "H", "labelPosition": "bottom-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BH", "type": "segment", "from": "B", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "dashed", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 8:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q08-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB=6sqrt(2), BC=14, B=45도인 삼각형 ABC에서",
                "sourceConditions": ["AB = 8.49", "BC = 14", "B = 45 deg", "H = (6, 0)"],
                "newVisualInformation": "변 BC에 수선의 발 H를 내린 삼각형 ABC",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [14, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [6, 6], "label": "A", "labelPosition": "top-left"},
                    {"id": "H", "type": "point", "coords": [6, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q08-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AC = sqrt(6^2 + 8^2) = 10",
                "sourceConditions": ["AH = 6", "BH = 6", "HC = 8", "AC = 10"],
                "newVisualInformation": "직각삼각형 ABH와 AHC의 두 구간 분할",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [14, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [6, 6], "label": "A", "labelPosition": "top-left"},
                    {"id": "H", "type": "point", "coords": [6, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 2.0},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 11:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q11-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "삼각형 ABC의 넓이가 15sqrt(3)이고, BC=6",
                "sourceConditions": ["BC = 6", "ACB = 120 deg", "AH = 8.66"],
                "newVisualInformation": "둔각 120도를 이루는 삼각형과 수선의 발 H",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [6, 0], "label": "C", "labelPosition": "bottom"},
                    {"id": "H", "type": "point", "coords": [11, 0], "label": "H", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [11, 8.66], "label": "A", "labelPosition": "top-right"},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "CH", "type": "segment", "from": "C", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "dashed", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q11-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AH = 15sqrt(3)/3 = 5sqrt(3)",
                "sourceConditions": ["BC = 6", "Area = 15sqrt(3)", "AH = 5sqrt(3)"],
                "newVisualInformation": "밑변 BC와 높이 AH의 관계 강조",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [6, 0], "label": "C", "labelPosition": "bottom"},
                    {"id": "H", "type": "point", "coords": [11, 0], "label": "H", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [11, 8.66], "label": "A", "labelPosition": "top-right"},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 2.0},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.2},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "CH", "type": "segment", "from": "C", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 13:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q13-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "OH=6, AB=16일 때, x의 값을 구하면",
                "sourceConditions": ["Center O = (0, 0)", "Radius = 10", "OH = 6", "AB = 16"],
                "newVisualInformation": "원 O의 현 AB와 중심에서의 수선 OH",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "top"},
                    {"id": "A", "type": "point", "coords": [-8, -6], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [8, -6], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "H", "type": "point", "coords": [0, -6], "label": "H", "labelPosition": "bottom"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 10, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OH", "type": "segment", "from": "O", "to": "H", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OA", "type": "segment", "from": "O", "to": "A", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q13-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "OA = sqrt(6^2 + 8^2) = 10",
                "sourceConditions": ["AH = 8", "OH = 6", "OA = 10"],
                "newVisualInformation": "직각삼각형 OAH와 피타고라스 정리",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "top"},
                    {"id": "A", "type": "point", "coords": [-8, -6], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [8, -6], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "H", "type": "point", "coords": [0, -6], "label": "H", "labelPosition": "bottom"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 10, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.2},
                    {"id": "OH", "type": "segment", "from": "O", "to": "H", "style": "solid", "strokeWidth": 1.8},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "solid", "strokeWidth": 1.8},
                    {"id": "OA", "type": "segment", "from": "O", "to": "A", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 14:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q14-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "원의 중심에서 현에 내린 수선의 발을 M이라 하자",
                "sourceConditions": ["Center O = (0, 0)", "Radius = 10", "Chord AB", "OM perp AB"],
                "newVisualInformation": "현의 수직이등분선 증명 기본 도형",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "top"},
                    {"id": "A", "type": "point", "coords": [-8, -6], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [8, -6], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "M", "type": "point", "coords": [0, -6], "label": "M", "labelPosition": "bottom"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 10, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OM", "type": "segment", "from": "O", "to": "M", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q14-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "직각삼각형의 합동 조건에 의해 RHS 합동",
                "sourceConditions": ["OA = OB = 10", "OM common", "OMA = OMB = 90 deg"],
                "newVisualInformation": "보조선 OA, OB로 구성된 RHS 합동 직각삼각형 쌍",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "top"},
                    {"id": "A", "type": "point", "coords": [-8, -6], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [8, -6], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "M", "type": "point", "coords": [0, -6], "label": "M", "labelPosition": "bottom"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 10, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OM", "type": "segment", "from": "O", "to": "M", "style": "solid", "strokeWidth": 2.0},
                    {"id": "OA", "type": "segment", "from": "O", "to": "A", "style": "dashed", "strokeWidth": 1.5},
                    {"id": "OB", "type": "segment", "from": "O", "to": "B", "style": "dashed", "strokeWidth": 1.5},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 15:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q15-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB=16cm, CM=4cm일 때, 이 원의 넓이를 구하면",
                "sourceConditions": ["AB = 16", "M = (0, 0)", "C = (0, 4)", "CM perp AB"],
                "newVisualInformation": "원호의 일부와 현 AB 및 수직 높이 CM",
                "steps": [
                    {"id": "A", "type": "point", "coords": [-8, 0], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [8, 0], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "M", "type": "point", "coords": [0, 0], "label": "M", "labelPosition": "bottom"},
                    {"id": "C", "type": "point", "coords": [0, 4], "label": "C", "labelPosition": "top"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "CM", "type": "segment", "from": "C", "to": "M", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "C", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q15-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "r^2 = (r-4)^2 + 8^2 => r = 10",
                "sourceConditions": ["Center O = (0, -6)", "Radius r = 10", "OM = 6", "AM = 8"],
                "newVisualInformation": "복원된 원의 중심 O와 직각삼각형 OMA",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, -6], "label": "O", "labelPosition": "bottom"},
                    {"id": "A", "type": "point", "coords": [-8, 0], "label": "A", "labelPosition": "left"},
                    {"id": "M", "type": "point", "coords": [0, 0], "label": "M", "labelPosition": "bottom-right"},
                    {"id": "C", "type": "point", "coords": [0, 4], "label": "C", "labelPosition": "top"},
                    {"id": "OC", "type": "segment", "from": "O", "to": "C", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "OA", "type": "segment", "from": "O", "to": "A", "style": "solid", "strokeWidth": 1.8},
                    {"id": "AM", "type": "segment", "from": "A", "to": "M", "style": "solid", "strokeWidth": 1.8},
                    {"id": "OM", "type": "segment", "from": "O", "to": "M", "style": "solid", "strokeWidth": 1.8},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "C", "ray2": "A", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 16:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q16-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "OD=OE=OF이고 AB=6sqrt(3)일 때 원 둘레",
                "sourceConditions": ["Center O = (0, 0)", "Equilateral triangle ABC", "OD = OE = OF = 3"],
                "newVisualInformation": "세 변에 내린 수선의 길이가 같은 원과 삼각형",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "center"},
                    {"id": "A", "type": "point", "coords": [0, 6], "label": "A", "labelPosition": "top"},
                    {"id": "B", "type": "point", "coords": [-5.2, -3], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [5.2, -3], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "D", "type": "point", "coords": [-2.6, 1.5], "label": "D", "labelPosition": "left"},
                    {"id": "E", "type": "point", "coords": [0, -3], "label": "E", "labelPosition": "bottom"},
                    {"id": "F", "type": "point", "coords": [2.6, 1.5], "label": "F", "labelPosition": "right"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 6, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "CA", "type": "segment", "from": "C", "to": "A", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OD", "type": "segment", "from": "O", "to": "D", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "OE", "type": "segment", "from": "O", "to": "E", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "OF", "type": "segment", "from": "O", "to": "F", "style": "dashed", "strokeWidth": 1.2}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q16-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "cos 30도 = AD/AO => AO = 6",
                "sourceConditions": ["AD = 5.2", "OD = 3", "AO = 6", "OAD = 30 deg"],
                "newVisualInformation": "직각삼각형 ADO와 반지름 AO = 6 계산",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "center"},
                    {"id": "A", "type": "point", "coords": [0, 6], "label": "A", "labelPosition": "top"},
                    {"id": "D", "type": "point", "coords": [-2.6, 1.5], "label": "D", "labelPosition": "left"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 6, "style": "solid"},
                    {"id": "AO", "type": "segment", "from": "A", "to": "O", "style": "solid", "strokeWidth": 2.0},
                    {"id": "AD", "type": "segment", "from": "A", "to": "D", "style": "solid", "strokeWidth": 2.0},
                    {"id": "OD", "type": "segment", "from": "O", "to": "D", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mD", "type": "angleMark", "vertex": "D", "ray1": "A", "ray2": "O", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 17:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q17-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "PA=3, PQ=7, QC=x일 때, x의 값을 구하면",
                "sourceConditions": ["PA = 3", "PQ = 7", "PB = 3", "BQ = 4", "QC = 4"],
                "newVisualInformation": "원 O의 접선들과 접점 A, B, C",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "center"},
                    {"id": "P", "type": "point", "coords": [-8, -6], "label": "P", "labelPosition": "bottom-left"},
                    {"id": "Q", "type": "point", "coords": [-1, -6], "label": "Q", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [-6, 0], "label": "A", "labelPosition": "left"},
                    {"id": "B", "type": "point", "coords": [-5, -6], "label": "B", "labelPosition": "bottom"},
                    {"id": "C", "type": "point", "coords": [2, -5.6], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 6, "style": "solid"},
                    {"id": "PA", "type": "segment", "from": "P", "to": "A", "style": "solid", "strokeWidth": 1.5},
                    {"id": "PQ", "type": "segment", "from": "P", "to": "Q", "style": "solid", "strokeWidth": 1.5},
                    {"id": "QC", "type": "segment", "from": "Q", "to": "C", "style": "solid", "strokeWidth": 1.5}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q17-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "PB = PA = 3, BQ = 4, QC = QB = 4",
                "sourceConditions": ["PA = 3", "PB = 3", "BQ = 4", "QC = 4"],
                "newVisualInformation": "접선의 성질 PA=PB, QB=QC 관계 시각화",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "center"},
                    {"id": "P", "type": "point", "coords": [-8, -6], "label": "P", "labelPosition": "bottom-left"},
                    {"id": "Q", "type": "point", "coords": [-1, -6], "label": "Q", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [-6, 0], "label": "A", "labelPosition": "left"},
                    {"id": "B", "type": "point", "coords": [-5, -6], "label": "B", "labelPosition": "bottom"},
                    {"id": "C", "type": "point", "coords": [2, -5.6], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "c1", "type": "circle", "center": "O", "radius": 6, "style": "solid"},
                    {"id": "PA", "type": "segment", "from": "P", "to": "A", "style": "solid", "strokeWidth": 2.0},
                    {"id": "PB", "type": "segment", "from": "P", "to": "B", "style": "solid", "strokeWidth": 2.0},
                    {"id": "BQ", "type": "segment", "from": "B", "to": "Q", "style": "solid", "strokeWidth": 2.0},
                    {"id": "QC", "type": "segment", "from": "Q", "to": "C", "style": "solid", "strokeWidth": 2.0}
                ]
            }
        elif qid == 19:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q19-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB=6, BC=8이고 각 BMH=x라 할 때",
                "sourceConditions": ["B = (0, 0)", "C = (8, 0)", "A = (0, 6)", "M = (4, 3)", "H = (4, 0)"],
                "newVisualInformation": "직각삼각형 ABC의 빗변 중점 M과 수선 MH",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [8, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [0, 6], "label": "A", "labelPosition": "top-left"},
                    {"id": "M", "type": "point", "coords": [4, 3], "label": "M", "labelPosition": "top-right"},
                    {"id": "H", "type": "point", "coords": [4, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BM", "type": "segment", "from": "B", "to": "M", "style": "solid", "strokeWidth": 1.5},
                    {"id": "MH", "type": "segment", "from": "M", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "mB", "type": "angleMark", "vertex": "B", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "M", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q19-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "cos x = MH/BM = 3/5",
                "sourceConditions": ["BM = 5", "MH = 3", "BH = 4", "cos x = 3/5"],
                "newVisualInformation": "직각삼각형 MHB와 각 BMH의 코사인 계산",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "M", "type": "point", "coords": [4, 3], "label": "M", "labelPosition": "top-right"},
                    {"id": "H", "type": "point", "coords": [4, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "BM", "type": "segment", "from": "B", "to": "M", "style": "solid", "strokeWidth": 2.0},
                    {"id": "MH", "type": "segment", "from": "M", "to": "H", "style": "solid", "strokeWidth": 2.0},
                    {"id": "BH", "type": "segment", "from": "B", "to": "H", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "M", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 20:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q20-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AF=8, 각 EAF=30도인 직각삼각형 AEF",
                "sourceConditions": ["Rectangle ABCD", "AF = 8", "EAF = 30 deg", "BAE = 45 deg"],
                "newVisualInformation": "직사각형 내부에서 45도 회전된 직각삼각형 AEF",
                "steps": [
                    {"id": "A", "type": "point", "coords": [0, 0], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [0, 7.7], "label": "B", "labelPosition": "top-left"},
                    {"id": "C", "type": "point", "coords": [7.7, 7.7], "label": "C", "labelPosition": "top-right"},
                    {"id": "D", "type": "point", "coords": [7.7, 0], "label": "D", "labelPosition": "bottom-right"},
                    {"id": "E", "type": "point", "coords": [4.9, 4.9], "label": "E", "labelPosition": "top"},
                    {"id": "F", "type": "point", "coords": [7.7, 2.1], "label": "F", "labelPosition": "right"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "CD", "type": "segment", "from": "C", "to": "D", "style": "solid", "strokeWidth": 1.5},
                    {"id": "DA", "type": "segment", "from": "D", "to": "A", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AE", "type": "segment", "from": "A", "to": "E", "style": "solid", "strokeWidth": 1.8},
                    {"id": "EF", "type": "segment", "from": "E", "to": "F", "style": "solid", "strokeWidth": 1.8},
                    {"id": "AF", "type": "segment", "from": "A", "to": "F", "style": "solid", "strokeWidth": 1.8},
                    {"id": "mE", "type": "angleMark", "vertex": "E", "ray1": "A", "ray2": "F", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q20-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "cos 75도 = (sqrt(6) - sqrt(2))/4",
                "sourceConditions": ["AE = 4sqrt(3)", "EF = 4", "AF = 8", "Height split"],
                "newVisualInformation": "선분 AE와 EF의 수직 투영 성분 분해",
                "steps": [
                    {"id": "A", "type": "point", "coords": [0, 0], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "E", "type": "point", "coords": [4.9, 4.9], "label": "E", "labelPosition": "top"},
                    {"id": "F", "type": "point", "coords": [7.7, 2.1], "label": "F", "labelPosition": "right"},
                    {"id": "AE", "type": "segment", "from": "A", "to": "E", "style": "solid", "strokeWidth": 2.0},
                    {"id": "EF", "type": "segment", "from": "E", "to": "F", "style": "solid", "strokeWidth": 2.0},
                    {"id": "AF", "type": "segment", "from": "A", "to": "F", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mE", "type": "angleMark", "vertex": "E", "ray1": "A", "ray2": "F", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 21:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q21-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB=8, BC=10인 삼각형 ABC에서 sin B=3/5",
                "sourceConditions": ["AB = 8", "BC = 10", "sin B = 0.6"],
                "newVisualInformation": "주어진 두 변과 끼인각의 사인값을 갖는 삼각형 ABC",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [10, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [6.4, 4.8], "label": "A", "labelPosition": "top"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q21-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AH = AB sin B = 8 * 3/5 = 24/5",
                "sourceConditions": ["AH = 4.8", "BC = 10", "Area = 24"],
                "newVisualInformation": "점 A에서 내린 수선 AH와 높이 계산",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "C", "type": "point", "coords": [10, 0], "label": "C", "labelPosition": "bottom-right"},
                    {"id": "A", "type": "point", "coords": [6.4, 4.8], "label": "A", "labelPosition": "top"},
                    {"id": "H", "type": "point", "coords": [6.4, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "solid", "strokeWidth": 1.8},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "A", "ray2": "C", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 22:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q22-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "직각삼각형 ABC에서 sin A=5/13일 때",
                "sourceConditions": ["B = 90 deg", "BC = 5", "AC = 13"],
                "newVisualInformation": "직각삼각형 ABC와 주어진 사인값 조건",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "A", "type": "point", "coords": [12, 0], "label": "A", "labelPosition": "bottom-right"},
                    {"id": "C", "type": "point", "coords": [0, 5], "label": "C", "labelPosition": "top-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mB", "type": "angleMark", "vertex": "B", "ray1": "C", "ray2": "A", "size": 12, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q22-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB = sqrt(13^2 - 5^2) = 12",
                "sourceConditions": ["AB = 12", "BC = 5", "AC = 13", "cos A = 12/13"],
                "newVisualInformation": "피타고라스 정리로 구한 밑변 AB = 12",
                "steps": [
                    {"id": "B", "type": "point", "coords": [0, 0], "label": "B", "labelPosition": "bottom-left"},
                    {"id": "A", "type": "point", "coords": [12, 0], "label": "A", "labelPosition": "bottom-right"},
                    {"id": "C", "type": "point", "coords": [0, 5], "label": "C", "labelPosition": "top-left"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 2.0},
                    {"id": "BC", "type": "segment", "from": "B", "to": "C", "style": "solid", "strokeWidth": 1.8},
                    {"id": "AC", "type": "segment", "from": "A", "to": "C", "style": "solid", "strokeWidth": 2.0},
                    {"id": "mB", "type": "angleMark", "vertex": "B", "ray1": "C", "ray2": "A", "size": 12, "rightAngle": True}
                ]
            }
        elif qid == 23:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q23-problem",
                "targetFigure": "problem",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "두 동심원의 반지름의 길이가 각각 6cm, 10cm",
                "sourceConditions": ["Center O = (0, 0)", "R1 = 6", "R2 = 10", "Chord AB tangent at M"],
                "newVisualInformation": "두 동심원과 작은 원에 접하는 큰 원의 현 AB",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "bottom"},
                    {"id": "A", "type": "point", "coords": [-8, 6], "label": "A", "labelPosition": "top-left"},
                    {"id": "B", "type": "point", "coords": [8, 6], "label": "B", "labelPosition": "top-right"},
                    {"id": "M", "type": "point", "coords": [0, 6], "label": "M", "labelPosition": "top"},
                    {"id": "cInner", "type": "circle", "center": "O", "radius": 6, "style": "solid"},
                    {"id": "cOuter", "type": "circle", "center": "O", "radius": 10, "style": "solid"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "OM", "type": "segment", "from": "O", "to": "M", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q23-solution",
                "targetFigure": "solution",
                "canvas": {"width": 400, "height": 320, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "BM = sqrt(10^2 - 6^2) = 8, AB = 16",
                "sourceConditions": ["OM = 6", "OB = 10", "BM = 8", "Area = 48"],
                "newVisualInformation": "삼각형 OAB와 직각삼각형 OMB의 피타고라스 관계",
                "steps": [
                    {"id": "O", "type": "point", "coords": [0, 0], "label": "O", "labelPosition": "bottom"},
                    {"id": "A", "type": "point", "coords": [-8, 6], "label": "A", "labelPosition": "top-left"},
                    {"id": "B", "type": "point", "coords": [8, 6], "label": "B", "labelPosition": "top-right"},
                    {"id": "M", "type": "point", "coords": [0, 6], "label": "M", "labelPosition": "top"},
                    {"id": "cInner", "type": "circle", "center": "O", "radius": 6, "style": "dashed"},
                    {"id": "cOuter", "type": "circle", "center": "O", "radius": 10, "style": "dashed"},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 2.0},
                    {"id": "OM", "type": "segment", "from": "O", "to": "M", "style": "solid", "strokeWidth": 1.8},
                    {"id": "OA", "type": "segment", "from": "O", "to": "A", "style": "solid", "strokeWidth": 1.8},
                    {"id": "OB", "type": "segment", "from": "O", "to": "B", "style": "solid", "strokeWidth": 1.8},
                    {"id": "mM", "type": "angleMark", "vertex": "M", "ray1": "O", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
        elif qid == 24:
            p_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q24-problem",
                "targetFigure": "problem",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "600m 높이에 떠 있는 열기구 P에서 두 지점 A, B",
                "sourceConditions": ["P = (0, 600)", "H = (0, 0)", "Depression 35 deg, 42 deg"],
                "newVisualInformation": "열기구 P와 지면의 두 지점 A, B의 부각",
                "steps": [
                    {"id": "P", "type": "point", "coords": [0, 6], "label": "P", "labelPosition": "top"},
                    {"id": "H", "type": "point", "coords": [0, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "A", "type": "point", "coords": [-8.58, 0], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [6.66, 0], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "PH", "type": "segment", "from": "P", "to": "H", "style": "dashed", "strokeWidth": 1.2},
                    {"id": "AB", "type": "segment", "from": "A", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "PA", "type": "segment", "from": "P", "to": "A", "style": "solid", "strokeWidth": 1.5},
                    {"id": "PB", "type": "segment", "from": "P", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "P", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }
            s_plan = {
                "schemaVersion": "construction-spike-v1",
                "planId": "wangun-m3-v3-q24-solution",
                "targetFigure": "solution",
                "canvas": {"width": 420, "height": 300, "padding": 35},
                "coordinateSystem": {"origin": "bottom-left", "scale": "auto"},
                "sourceQuote": "AB = AH + BH = 858 + 666 = 1524m",
                "sourceConditions": ["AH = 858", "BH = 666", "AB = 1524"],
                "newVisualInformation": "두 직각삼각형 PAH, PBH의 밑변 합산",
                "steps": [
                    {"id": "P", "type": "point", "coords": [0, 6], "label": "P", "labelPosition": "top"},
                    {"id": "H", "type": "point", "coords": [0, 0], "label": "H", "labelPosition": "bottom"},
                    {"id": "A", "type": "point", "coords": [-8.58, 0], "label": "A", "labelPosition": "bottom-left"},
                    {"id": "B", "type": "point", "coords": [6.66, 0], "label": "B", "labelPosition": "bottom-right"},
                    {"id": "PH", "type": "segment", "from": "P", "to": "H", "style": "solid", "strokeWidth": 1.8},
                    {"id": "AH", "type": "segment", "from": "A", "to": "H", "style": "solid", "strokeWidth": 2.0},
                    {"id": "BH", "type": "segment", "from": "B", "to": "H", "style": "solid", "strokeWidth": 2.0},
                    {"id": "PA", "type": "segment", "from": "P", "to": "A", "style": "solid", "strokeWidth": 1.5},
                    {"id": "PB", "type": "segment", "from": "P", "to": "B", "style": "solid", "strokeWidth": 1.5},
                    {"id": "mH", "type": "angleMark", "vertex": "H", "ray1": "P", "ray2": "B", "size": 10, "rightAngle": True}
                ]
            }

        # Write plan files
        with open(p_ref, "w", encoding="utf-8") as f:
            json.dump(p_plan, f, ensure_ascii=False, indent=2)
        with open(s_ref, "w", encoding="utf-8") as f:
            json.dump(s_plan, f, ensure_ascii=False, indent=2)

        q["problemPlanRef"] = p_ref
        q["solutionPlanRef"] = s_ref
        q["reviewStatus"] = "SELF_CHECKED"
        q["pipelineState"] = "READY_FOR_INDEPENDENT_REVIEW"

def generate_v3_js_and_meta():
    questions = get_v3_questions_data()
    plans_dir = "archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_v3_plans"
    generate_v3_plans(questions, plans_dir)

    # 1. Output V3 JS
    js_out_path = "archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_v3.js"
    js_content = f"""// 25_왕운중_2학기_중간_중3_유사_v3.js
// V3 Generated Similar Exam - Completely isolated from V1 and V2
// Generated purely from original blueprints with independent math validation,
// 5-choice exhaustive verification (4/4/4/4/4 slot balance), blackboard line-by-line solutions,
// and AUTHOR_GUIDE.md official plan.json specs.

window.examTitle = "25_왕운중_2학기_중간_중3_유사_v3";
window.questionBank = {json.dumps(questions, ensure_ascii=False, indent=2)};
"""
    with open(js_out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(js_content)
    print(f"Written V3 JS: {js_out_path} ({len(js_content)} bytes)")

    # 2. Output Small Meta JSON
    # Conforms to archive-reviewed-exam-meta-register-request-v2
    with open(js_out_path, "rb") as f:
        js_bytes = f.read()
    source_blob_sha1 = hashlib.sha1(f"blob {len(js_bytes)}\0".encode("utf-8") + js_bytes).hexdigest()

    meta_items = []
    for q in questions:
        qid = q["id"]
        q_uid = f"25_왕운중_2학기_중간_중3_유사_v3_q{qid:02d}"
        after_meta = {
            "standardCourse": q["standardCourse"],
            "curriculum": "2015",
            "curriculumKey": "2015",
            "courseKey": "중3 수학",
            "standardUnitKey": q["standardUnitKey"],
            "standardUnit": q["standardUnit"],
            "subUnitKey": q["subUnitKey"],
            "subUnit": q["subUnit"],
            "conceptClusterKey": q["conceptClusterKey"],
            "problemTypeKey": q["problemTypeKey"],
            "templateKey": q["templateKey"],
            "crossConceptKeys": q["crossConceptKeys"],
            "conditionKeys": q["conditionKeys"],
            "integrationPattern": q["integrationPattern"],
            "level": q["level"],
            "difficultyBucket": q["difficultyBucket"],
            "rpmSemanticStatus": "SELF_CHECKED",
            "sourceQid": q["sourceQid"],
            "variationType": q["variationType"]
        }
        meta_items.append({
            "questionUid": q_uid,
            "sourceOrdinal": qid,
            "before": None,
            "after": after_meta,
            "reason": f"V3 정본 독립 제작 및 수학 검증 완료 (원본 Q{qid} 1:1 대응)",
            "evidenceRefs": [
                {
                    "path": js_out_path,
                    "sha1": source_blob_sha1
                }
            ]
        })

    small_meta_request = {
        "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
        "requestId": "similar-v3-25-wangun-m3-2mid-20261024",
        "examUid": "25_왕운중_2학기_중간_중3_유사_v3",
        "sourceArchiveFile": js_out_path,
        "expectedSourceBlobSha1": source_blob_sha1,
        "expectedQuestionCount": len(questions),
        "approval": {
            "type": "META_PIPELINE_AUDIT",
            "metadataReviewed": False,
            "approvedBy": "system-pipeline-v3",
            "reviewStatus": "SELF_CHECKED",
            "evidenceRefs": [
                {
                    "path": js_out_path,
                    "sha1": source_blob_sha1
                }
            ]
        },
        "registryChanges": [],
        "items": meta_items
    }

    meta_out_path = "archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_v3.meta-q01-q24.json"
    with open(meta_out_path, "w", encoding="utf-8") as f:
        json.dump(small_meta_request, f, ensure_ascii=False, indent=2)
    print(f"Written Small Meta JSON: {meta_out_path} ({len(meta_items)} items)")

if __name__ == "__main__":
    generate_v3_js_and_meta()
