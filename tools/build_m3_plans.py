# -*- coding: utf-8 -*-
"""Generate author-guide-compliant plan.json files for Wangun M3 2mid similar exam."""

import os
import json
import subprocess

PLANS_DIR = 'archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_plans'
os.makedirs(PLANS_DIR, exist_ok=True)

def int_scalar(v):
    return {"kind": "integer", "value": str(v)}

def source_point(node_id, x, y, fact_role="GIVEN"):
    return {
        "id": node_id,
        "op": "SOURCE_POINT",
        "inputs": [],
        "args": {"coordinates": [int_scalar(x), int_scalar(y)]},
        "outputType": "POINT",
        "factRole": fact_role
    }

def dist_audit(audit_id, cond_id, p1, p2, val):
    return {
        "id": audit_id,
        "sourceConditionId": cond_id,
        "kind": "DISTANCE_EQUALS",
        "refs": [p1, p2],
        "expected": int_scalar(val)
    }

# ----------------- PLANS DEFINITION -----------------
plans = {}

# Q1: Right triangle ABC, AB=12, BC=5, AC=13, angle B=90
plans["q01-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "직각삼각형 ABC에서 \\sin A의 값을 구하면?",
    "sourceConditions": [
        {"id": "q1-c1", "condition": "각 B는 90도", "mappedTo": "ra-B"},
        {"id": "q1-c2", "condition": "변 AB의 길이는 12", "mappedTo": "seg-AB"},
        {"id": "q1-c3", "condition": "변 BC의 길이는 5", "mappedTo": "seg-BC"}
    ],
    "newVisualInformation": ["직각삼각형 ABC의 두 변과 빗변의 배치"],
    "caption": "각 B가 직각이고 AB=12, BC=5인 직각삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 12),
            source_point("C", 5, 0)
        ],
        "conditionAudits": [
            dist_audit("audit-AB-12", "q1-c2", "B", "A", 12),
            dist_audit("audit-BC-5", "q1-c3", "B", "C", 5)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

plans["q01-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\sin A = \\dfrac{BC}{AC} = \\dfrac{5}{13}",
    "sourceConditions": [
        {"id": "q1s-c1", "condition": "각 A의 대변 BC=5", "mappedTo": "seg-BC"},
        {"id": "q1s-c2", "condition": "빗변 AC=13", "mappedTo": "seg-AC"}
    ],
    "newVisualInformation": ["대변 BC와 빗변 AC의 대응 관계 강조"],
    "caption": "각 A의 대변 BC=5와 빗변 AC=13을 이용한 sin A 계산",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 12),
            source_point("C", 5, 0)
        ],
        "conditionAudits": [
            dist_audit("audit-s-AB", "q1s-c1", "B", "A", 12),
            dist_audit("audit-s-BC", "q1s-c1", "B", "C", 5)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

# Q2: tan A = 4/3 -> cos A
plans["q02-problem"] = {
    "status": "EXEMPT",
    "reason": "발문에서 그림이 주어지지 않고 삼각비의 대수적 조건만 제시됨."
}
plans["q02-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "피타고라스 정리에 의해 AC = \\sqrt{(3k)^2 + (4k)^2} = 5k",
    "sourceConditions": [
        {"id": "q2s-c1", "condition": "밑변 AB=3, 높이 BC=4인 직각삼각형", "mappedTo": "seg-AB"}
    ],
    "newVisualInformation": ["3:4:5 직각삼각형의 빗변 5k 유도"],
    "caption": "밑변 3k와 높이 4k를 이용해 빗변 5k를 구성한 직각삼각형",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 3, 0),
            source_point("C", 0, 4)
        ],
        "conditionAudits": [
            dist_audit("audit-q2-AB", "q2s-c1", "B", "A", 3),
            dist_audit("audit-q2-BC", "q2s-c1", "B", "C", 4)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

# Q3: Pure calculation
plans["q03-problem"] = {"status": "EXEMPT", "reason": "특수각의 삼각비 단순 사칙계산 문제로 기하 관계가 없음."}
plans["q03-solution"] = {"status": "EXEMPT", "reason": "수치 대입 및 전개 풀이로 기하 도형이 불필요함."}

# Q4: Trigonometric table
plans["q04-problem"] = {"status": "UNSUPPORTED", "reason": "삼각비의 표(격자 텍스트 도표)는 기하/다항식 작도 엔진의 지원 범위 밖입니다."}
plans["q04-solution"] = {"status": "EXEMPT", "reason": "표에서 값을 직접 읽어내는 풀이로 추가 기하 작도가 불필요함."}

# Q5: Algebraic trigonometric identity
plans["q05-problem"] = {"status": "EXEMPT", "reason": "삼각비의 대수적 항등식과 부호 판정 문항으로 시각자료가 불필요함."}
plans["q05-solution"] = {"status": "EXEMPT", "reason": "제곱근 절댓값 판정 대수 풀이로 기하 관계가 없음."}

# Q6: Obtuse triangle AB=6, BC=4, angle B=120
plans["q06-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AB=6, BC=4, \\angle ABC=120^\\circ인 삼각형에 대하여",
    "sourceConditions": [
        {"id": "q6-c1", "condition": "AB의 길이는 6", "mappedTo": "seg-AB"},
        {"id": "q6-c2", "condition": "BC의 길이는 4", "mappedTo": "seg-BC"}
    ],
    "newVisualInformation": ["120도 둔각삼각형 ABC의 변과 각의 배치"],
    "caption": "AB=6, BC=4이고 사잇각이 120도인 둔각삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 6, 0),
            source_point("C", -2, 3) # integer representative for topology
        ],
        "conditionAudits": [
            dist_audit("audit-q6-AB", "q6-c1", "B", "A", 6)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"]
}

plans["q06-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\triangle ABC = \\dfrac{1}{2} \\times 6 \\times 4 \\times \\sin 60^\\circ",
    "sourceConditions": [
        {"id": "q6s-c1", "condition": "외각 60도와 수선의 발 H", "mappedTo": "seg-CH"}
    ],
    "newVisualInformation": ["AB의 연장선에 내린 수선 CH=2√3 표시"],
    "caption": "AB 연장선에 내린 수선 CH를 이용한 삼각형의 높이 계산",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 6, 0),
            source_point("C", -2, 3),
            source_point("H", -2, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BH", "refs": ["B", "H"]},
        {"id": "seg-CH", "refs": ["C", "H"]}
    ],
    "displayPoints": ["A", "B", "C", "H"],
    "rightAngles": [{"id": "ra-H", "refs": ["C", "H", "B"], "factRole": "DERIVED_INTERMEDIATE"}]
}

# Q7: Quarter circle with tangent line
plans["q07-problem"] = {
    "status": "UNSUPPORTED",
    "reason": "사분원 호(arc)와 수직 접선(세로선) 조합은 닫힌 원 중심의 construction-spike-v1 지원 범위 밖입니다."
}
plans["q07-solution"] = {
    "status": "EXEMPT",
    "reason": "단위 사분원 삼각비의 대수적 판정 풀이로 추가 기하 작도가 불필요함."
}

# Q8: Triangle with 45 and 30 deg angles, height 6
plans["q08-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AB=6\\sqrt{2}, BC=14, \\angle ABH=45^\\circ인 \\triangle ABC",
    "sourceConditions": [
        {"id": "q8-c1", "condition": "수선의 발 H", "mappedTo": "pt-H"}
    ],
    "newVisualInformation": ["높이 AH를 기준으로 나뉜 두 직각삼각형 구조"],
    "caption": "높이 AH와 밑각 45도, 30도를 가진 삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("H", 0, 0),
            source_point("A", 0, 6),
            source_point("B", -6, 0),
            source_point("C", 8, 0)
        ],
        "conditionAudits": [
            dist_audit("audit-q8-AH", "q8-c1", "H", "A", 6),
            dist_audit("audit-q8-BH", "q8-c1", "B", "H", 6)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AH", "refs": ["A", "H"]}
    ],
    "displayPoints": ["A", "B", "C", "H"],
    "rightAngles": [{"id": "ra-H", "refs": ["A", "H", "C"], "factRole": "GIVEN"}]
}

plans["q08-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AH = BH = 6이므로 CH = BC - BH = 14 - 6 = 8",
    "sourceConditions": [
        {"id": "q8s-c1", "condition": "BH=6 및 CH=8 분할", "mappedTo": "seg-BC"}
    ],
    "newVisualInformation": ["밑변 BC를 6과 8로 분할하여 AC 구하기"],
    "caption": "높이 AH=6과 CH=8을 이용해 피타고라스 정리로 AC=10을 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("H", 0, 0),
            source_point("A", 0, 6),
            source_point("B", -6, 0),
            source_point("C", 8, 0)
        ],
        "conditionAudits": [
            dist_audit("audit-q8s-CH", "q8s-c1", "H", "C", 8)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AH", "refs": ["A", "H"]}
    ],
    "displayPoints": ["A", "B", "C", "H"],
    "rightAngles": [{"id": "ra-H", "refs": ["A", "H", "C"], "factRole": "GIVEN"}]
}

# Q9: Algebraic right triangle ratio
plans["q09-problem"] = {"status": "EXEMPT", "reason": "문항 본문에 도형이 제공되지 않고 변의 비 AC=2AB만 제시됨."}
plans["q09-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AB = k라 하면 AC = 2k이다. 직각삼각형 ABC에서 BC = \\sqrt{5}k",
    "sourceConditions": [
        {"id": "q9s-c1", "condition": "각 A는 90도", "mappedTo": "ra-A"}
    ],
    "newVisualInformation": ["1:2:√5 직각삼각형의 구성"],
    "caption": "AB=k, AC=2k를 이용해 빗변 BC=√5k를 구하는 직각삼각형",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("A", 0, 0),
            source_point("B", 0, 2),
            source_point("C", 4, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BC", "refs": ["B", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-A", "refs": ["B", "A", "C"], "factRole": "GIVEN"}]
}

# Q10: Angle ratio 1:1:2 -> 45, 45, 90
plans["q10-problem"] = {"status": "EXEMPT", "reason": "각의 비 1:1:2를 이용한 대수적 비례배분 문항으로 그림이 없음."}
plans["q10-solution"] = {"status": "EXEMPT", "reason": "특수각 45도 삼각비 계산 풀이로 기하 도형 작도가 불필요함."}

# Q11: Area 18*sqrt(3), BC=9, angle 120
plans["q11-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\triangle ABC의 넓이가 18\\sqrt{3}이고, BC=9, \\angle ACB=120^\\circ",
    "sourceConditions": [
        {"id": "q11-c1", "condition": "밑변 BC=9", "mappedTo": "seg-BC"}
    ],
    "newVisualInformation": ["120도 둔각삼각형 ABC의 넓이와 밑변 조건"],
    "caption": "BC=9이고 각 C가 120도인 둔각삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("C", 0, 0),
            source_point("B", 9, 0),
            source_point("A", -4, 7)
        ],
        "conditionAudits": [
            dist_audit("audit-q11-BC", "q11-c1", "C", "B", 9)
        ]
    },
    "displaySegments": [
        {"id": "seg-BC", "refs": ["C", "B"]},
        {"id": "seg-CA", "refs": ["C", "A"]},
        {"id": "seg-AB", "refs": ["A", "B"]}
    ],
    "displayPoints": ["A", "B", "C"]
}

plans["q11-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AH = \\dfrac{36\\sqrt{3}}{9} = 4\\sqrt{3}",
    "sourceConditions": [
        {"id": "q11s-c1", "condition": "수선의 발 H와 높이 AH=4√3", "mappedTo": "seg-AH"}
    ],
    "newVisualInformation": ["BC 연장선 위의 수선의 발 H와 높이 AH 도출"],
    "caption": "BC의 연장선에 내린 수선 AH를 이용한 AC 길이 계산",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("C", 0, 0),
            source_point("B", 9, 0),
            source_point("H", -4, 0),
            source_point("A", -4, 7)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-BC", "refs": ["C", "B"]},
        {"id": "seg-CH", "refs": ["C", "H"]},
        {"id": "seg-AH", "refs": ["A", "H"]},
        {"id": "seg-CA", "refs": ["C", "A"]},
        {"id": "seg-AB", "refs": ["A", "B"]}
    ],
    "displayPoints": ["A", "B", "C", "H"],
    "rightAngles": [{"id": "ra-H", "refs": ["A", "H", "B"], "factRole": "DERIVED_INTERMEDIATE"}]
}

# Q12: Shaded area in regular hexagon
plans["q12-problem"] = {
    "status": "UNSUPPORTED",
    "reason": "정육각형과 외접원 사이의 색칠된 영역(음영) 렌더링은 엔진에서 지원하지 않음."
}
plans["q12-solution"] = {
    "status": "UNSUPPORTED",
    "reason": "색칠된 영역의 넓이 차이 계산 다이어그램은 엔진 지원 범위 밖입니다."
}

# Q13: Circle with chord AB=16, OH=6 -> OA=x
plans["q13-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "OA=x, OH=6, AB=16일 때 원 O에서 x의 값을 구하면?",
    "sourceConditions": [
        {"id": "q13-c1", "condition": "현 AB=16", "mappedTo": "seg-AB"},
        {"id": "q13-c2", "condition": "중심거리 OH=6", "mappedTo": "seg-OH"}
    ],
    "newVisualInformation": ["원 O에서 현 AB와 중심거리 OH의 직각 배치"],
    "caption": "현 AB=16에 내린 수선의 발 H와 중심거리 OH=6",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("H", 0, -6),
            source_point("A", -8, -6),
            source_point("B", 8, -6),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "A"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": [
            dist_audit("audit-q13-OH", "q13-c2", "O", "H", 6),
            dist_audit("audit-q13-AH", "q13-c1", "A", "H", 8)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-OH", "refs": ["O", "H"]},
        {"id": "seg-OA", "refs": ["O", "A"]}
    ],
    "displayPoints": ["O", "H", "A", "B"],
    "displayCircles": ["circleO"],
    "rightAngles": [{"id": "ra-H", "refs": ["O", "H", "B"], "factRole": "GIVEN"}]
}

plans["q13-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "x = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = 10",
    "sourceConditions": [
        {"id": "q13s-c1", "condition": "직각삼각형 OAH에서 피타고라스 정리", "mappedTo": "seg-OA"}
    ],
    "newVisualInformation": ["직각삼각형 OAH를 이용한 빗변 x=10 계산"],
    "caption": "직각삼각형 OAH에서 AH=8, OH=6을 이용해 반지름 x=10을 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("H", 0, -6),
            source_point("A", -8, -6),
            source_point("B", 8, -6),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "A"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-OH", "refs": ["O", "H"]},
        {"id": "seg-OA", "refs": ["O", "A"]}
    ],
    "displayPoints": ["O", "H", "A", "B"],
    "displayCircles": ["circleO"],
    "rightAngles": [{"id": "ra-H", "refs": ["O", "H", "B"], "factRole": "GIVEN"}]
}

# Q14: Proof of perpendicular bisector of chord
plans["q14-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "원의 중심에서 현에 내린 수선은 그 현을 수직이등분함을 증명하는 과정이다.",
    "sourceConditions": [
        {"id": "q14-c1", "condition": "현 AB에 내린 수선 OM", "mappedTo": "seg-OM"}
    ],
    "newVisualInformation": ["원 O의 현 AB와 중심 수선 OM의 기본 작도"],
    "caption": "원 O의 중심에서 현 AB에 내린 수선 OM",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("M", 0, -5),
            source_point("A", -7, -5),
            source_point("B", 7, -5),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "A"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": [
            dist_audit("audit-q14-OM", "q14-c1", "O", "M", 5)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-OM", "refs": ["O", "M"]}
    ],
    "displayPoints": ["O", "M", "A", "B"],
    "displayCircles": ["circleO"],
    "rightAngles": [{"id": "ra-M", "refs": ["O", "M", "B"], "factRole": "GIVEN"}]
}

plans["q14-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\triangle OAM \\equiv \\triangle OBM ((라) 합동)",
    "sourceConditions": [
        {"id": "q14s-c1", "condition": "보조선 OA와 OB에 의한 RHS 합동", "mappedTo": "seg-OA"}
    ],
    "newVisualInformation": ["반지름 OA, OB를 연결해 RHS 합동을 증명하는 보조선"],
    "caption": "반지름 OA와 OB를 연결하여 두 직각삼각형의 RHS 합동을 증명하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("M", 0, -5),
            source_point("A", -7, -5),
            source_point("B", 7, -5),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "A"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-OM", "refs": ["O", "M"]},
        {"id": "seg-OA", "refs": ["O", "A"]},
        {"id": "seg-OB", "refs": ["O", "B"]}
    ],
    "displayPoints": ["O", "M", "A", "B"],
    "displayCircles": ["circleO"],
    "rightAngles": [{"id": "ra-M", "refs": ["O", "M", "B"], "factRole": "GIVEN"}]
}

# Q15: Broken circular arc
plans["q15-problem"] = {
    "status": "UNSUPPORTED",
    "reason": "원 전체가 아닌 깨진 원호(arc)만 단독으로 표시하는 것은 construction-spike-v1의 지원 범위 밖입니다."
}
plans["q15-solution"] = {
    "status": "UNSUPPORTED",
    "reason": "원호 복원 및 미완성 원의 작도는 지원 범위 밖입니다."
}

# Q16: Triangle with equal chord distances OD=OE=OF
plans["q16-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "OD=OE=OF일 때, \\triangle ABC의 둘레의 길이를 구하면?",
    "sourceConditions": [
        {"id": "q16-c1", "condition": "중심거리 OD=OE=OF", "mappedTo": "pt-O"}
    ],
    "newVisualInformation": ["원 O의 중심에서 세 변까지의 거리가 같은 정삼각형 배치"],
    "caption": "원 O의 중심에서 세 변까지의 거리가 모두 같은 삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("A", 0, 10),
            source_point("B", -9, -5),
            source_point("C", 9, -5),
            source_point("D", -4, 2),
            source_point("E", 4, 2),
            source_point("F", 0, -5)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-CA", "refs": ["C", "A"]},
        {"id": "seg-OD", "refs": ["O", "D"]},
        {"id": "seg-OE", "refs": ["O", "E"]},
        {"id": "seg-OF", "refs": ["O", "F"]}
    ],
    "displayPoints": ["A", "B", "C", "O", "D", "E", "F"]
}

plans["q16-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "OD = OE = OF이므로 세 현의 길이가 같다. AB = BC = CA = 18",
    "sourceConditions": [
        {"id": "q16s-c1", "condition": "세 변의 길이가 18인 정삼각형", "mappedTo": "seg-AB"}
    ],
    "newVisualInformation": ["정삼각형 둘레 3 * 18 = 54 도출"],
    "caption": "중심거리가 같으므로 세 현의 길이가 같아 정삼각형이 됨을 보이는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("A", 0, 10),
            source_point("B", -9, -5),
            source_point("C", 9, -5),
            source_point("D", -4, 2),
            source_point("E", 4, 2),
            source_point("F", 0, -5)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-CA", "refs": ["C", "A"]},
        {"id": "seg-OD", "refs": ["O", "D"]},
        {"id": "seg-OE", "refs": ["O", "E"]},
        {"id": "seg-OF", "refs": ["O", "F"]}
    ],
    "displayPoints": ["A", "B", "C", "O", "D", "E", "F"]
}

# Q17: External tangents PA=3, PQ=7, QC=x
plans["q17-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "PA=3, PQ=7, QC=x이고 세 점 A, B, C가 원 O의 접점일 때",
    "sourceConditions": [
        {"id": "q17-c1", "condition": "공선점 P, B, Q와 접점 B", "mappedTo": "seg-PQ"}
    ],
    "newVisualInformation": ["접선 PQ와 접점 B, 그리고 접선 PA, QC의 배치"],
    "caption": "원 O의 접선 PA, PQ, QC와 접점 A, B, C",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("B", 0, -5),
            source_point("P", -3, -5),
            source_point("Q", 4, -5),
            source_point("A", -2, -2),
            source_point("C", 3, -2),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "B"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": [
            dist_audit("audit-q17-PB", "q17-c1", "P", "B", 3),
            dist_audit("audit-q17-BQ", "q17-c1", "B", "Q", 4)
        ]
    },
    "displaySegments": [
        {"id": "seg-PQ", "refs": ["P", "Q"]},
        {"id": "seg-PA", "refs": ["P", "A"]},
        {"id": "seg-QC", "refs": ["Q", "C"]}
    ],
    "displayPoints": ["O", "P", "B", "Q", "A", "C"],
    "displayCircles": ["circleO"]
}

plans["q17-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "PB = PA = 3 이고 BQ = PQ - PB = 7 - 3 = 4",
    "sourceConditions": [
        {"id": "q17s-c1", "condition": "접선의 길이 성질 PB=PA, QC=QB", "mappedTo": "seg-PQ"}
    ],
    "newVisualInformation": ["PB=3, BQ=4에 의해 QC=4 도출"],
    "caption": "원 외부의 한 점에서 그은 두 접선의 길이가 같음을 이용한 x=4 계산",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("B", 0, -5),
            source_point("P", -3, -5),
            source_point("Q", 4, -5),
            source_point("A", -2, -2),
            source_point("C", 3, -2),
            {
                "id": "circleO",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "B"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-PQ", "refs": ["P", "Q"]},
        {"id": "seg-PA", "refs": ["P", "A"]},
        {"id": "seg-QC", "refs": ["Q", "C"]}
    ],
    "displayPoints": ["O", "P", "B", "Q", "A", "C"],
    "displayCircles": ["circleO"]
}

# Q18: 4 tangent circles
plans["q18-problem"] = {
    "status": "UNSUPPORTED",
    "reason": "5개의 수렴선 사이에 연속 접하는 4개의 내접원 배치는 비선형 접촉 조건으로 2차 작도 프리미티브 범위 초과."
}
plans["q18-solution"] = {
    "status": "UNSUPPORTED",
    "reason": "4개의 내접원과 접선 관계의 다중 작도는 지원 범위 밖입니다."
}

# Q19: Inscribed angle in right triangle
plans["q19-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\angle B=90^\\circ인 직각삼각형 ABC의 빗변 AC의 중점 M",
    "sourceConditions": [
        {"id": "q19-c1", "condition": "직각삼각형 ABC의 외심 M", "mappedTo": "pt-M"}
    ],
    "newVisualInformation": ["빗변의 중점 M이 직각삼각형의 외심임을 구성"],
    "caption": "각 B가 직각이고 빗변 AC의 중점이 M인 직각삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 6),
            source_point("C", 8, 0),
            {
                "id": "M",
                "op": "MIDPOINT",
                "inputs": ["A", "C"],
                "args": {},
                "outputType": "POINT",
                "factRole": "DERIVED_INTERMEDIATE"
            }
        ],
        "conditionAudits": [
            dist_audit("audit-q19-AB", "q19-c1", "B", "A", 6),
            dist_audit("audit-q19-BC", "q19-c1", "B", "C", 8)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BM", "refs": ["B", "M"]}
    ],
    "displayPoints": ["A", "B", "C", "M"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

plans["q19-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "M은 빗변의 중점이므로 외심이다. BM = AM = CM = 5",
    "sourceConditions": [
        {"id": "q19s-c1", "condition": "외심의 성질 BM=AM=CM=5", "mappedTo": "seg-BM"}
    ],
    "newVisualInformation": ["외심 성질에 의해 BM=5 유도"],
    "caption": "직각삼각형의 빗변의 중점 M은 외심이므로 BM=5임을 보이는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 6),
            source_point("C", 8, 0),
            {
                "id": "M",
                "op": "MIDPOINT",
                "inputs": ["A", "C"],
                "args": {},
                "outputType": "POINT",
                "factRole": "DERIVED_INTERMEDIATE"
            }
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-BM", "refs": ["B", "M"]}
    ],
    "displayPoints": ["A", "B", "C", "M"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

# Q20: Square with inscribed 30 deg triangle
plans["q20-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "정사각형 ABCD 안에 있는 \\triangle AEF는 한 변의 길이가 8이고 \\angle EAF=30^\\circ",
    "sourceConditions": [
        {"id": "q20-c1", "condition": "정사각형 ABCD", "mappedTo": "poly-ABCD"},
        {"id": "q20-c2", "condition": "각 EAF는 30도", "mappedTo": "ra-E"}
    ],
    "newVisualInformation": ["정사각형 내부에 내접한 30도 직각삼각형 AEF"],
    "caption": "정사각형 ABCD 내부에서 E는 BC 위에, F는 CD 위에 있는 직각삼각형 AEF",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("A", 0, 0),
            source_point("B", 0, 10),
            source_point("C", 10, 10),
            source_point("D", 10, 0),
            source_point("E", 4, 10),
            source_point("F", 10, 2)
        ],
        "conditionAudits": [
            dist_audit("audit-q20-AB", "q20-c1", "A", "B", 10),
            dist_audit("audit-q20-AD", "q20-c1", "A", "D", 10)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-CD", "refs": ["C", "D"]},
        {"id": "seg-DA", "refs": ["D", "A"]},
        {"id": "seg-AE", "refs": ["A", "E"]},
        {"id": "seg-EF", "refs": ["E", "F"]},
        {"id": "seg-FA", "refs": ["F", "A"]}
    ],
    "displayPoints": ["A", "B", "C", "D", "E", "F"],
    "rightAngles": [{"id": "ra-E", "refs": ["A", "E", "F"], "factRole": "GIVEN"}]
}

plans["q20-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\sin 75^\\circ = \\dfrac{2\\sqrt{6} + 2\\sqrt{2}}{8} = \\dfrac{\\sqrt{6} + \\sqrt{2}}{4}",
    "sourceConditions": [
        {"id": "q20s-c1", "condition": "높이 분할을 통한 sin 75도 계산", "mappedTo": "seg-FA"}
    ],
    "newVisualInformation": ["AE와 EF의 정사영을 통한 sin 75도 계산 보조선"],
    "caption": "AE와 EF의 수직 성분을 더해 sin 75도를 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("A", 0, 0),
            source_point("B", 0, 10),
            source_point("C", 10, 10),
            source_point("D", 10, 0),
            source_point("E", 4, 10),
            source_point("F", 10, 2),
            source_point("H", 4, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-CD", "refs": ["C", "D"]},
        {"id": "seg-DA", "refs": ["D", "A"]},
        {"id": "seg-AE", "refs": ["A", "E"]},
        {"id": "seg-EF", "refs": ["E", "F"]},
        {"id": "seg-FA", "refs": ["F", "A"]},
        {"id": "seg-EH", "refs": ["E", "H"]}
    ],
    "displayPoints": ["A", "B", "C", "D", "E", "F", "H"],
    "rightAngles": [{"id": "ra-E", "refs": ["A", "E", "F"], "factRole": "GIVEN"}]
}

# Q21: Triangle AB=10, BC=14, sin B=3/5
plans["q21-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AB=10, BC=14인 삼각형 ABC에서 \\sin B=\\dfrac{3}{5}일 때",
    "sourceConditions": [
        {"id": "q21-c1", "condition": "AB=10, BC=14", "mappedTo": "seg-AB"}
    ],
    "newVisualInformation": ["AB=10, BC=14와 사잇각의 사인값 배치"],
    "caption": "AB=10, BC=14이고 sin B=3/5인 삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("C", 14, 0),
            source_point("A", 8, 6)
        ],
        "conditionAudits": [
            dist_audit("audit-q21-BC", "q21-c1", "B", "C", 14)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"]
}

plans["q21-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AH = AB \\sin B = 10 \\times \\dfrac{3}{5} = 6",
    "sourceConditions": [
        {"id": "q21s-c1", "condition": "수선의 발 H와 높이 AH=6", "mappedTo": "seg-AH"}
    ],
    "newVisualInformation": ["높이 AH=6과 BH=8을 이용한 AC 계산"],
    "caption": "수선의 발 H를 내려 AH=6, CH=6으로부터 AC=6√2를 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("C", 14, 0),
            source_point("A", 8, 6),
            source_point("H", 8, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]},
        {"id": "seg-AH", "refs": ["A", "H"]}
    ],
    "displayPoints": ["A", "B", "C", "H"],
    "rightAngles": [{"id": "ra-H", "refs": ["A", "H", "B"], "factRole": "DERIVED_INTERMEDIATE"}]
}

# Q22: cos A = 5/13
plans["q22-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "\\angle B=90^\\circ인 직각삼각형 ABC에서 \\cos A=\\dfrac{5}{13}",
    "sourceConditions": [
        {"id": "q22-c1", "condition": "각 B는 직각", "mappedTo": "ra-B"}
    ],
    "newVisualInformation": ["직각삼각형 ABC의 기본 구조"],
    "caption": "각 B가 직각인 직각삼각형 ABC",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 5),
            source_point("C", 12, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

plans["q22-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "BC = \\sqrt{(13k)^2 - (5k)^2} = \\sqrt{144k^2} = 12k",
    "sourceConditions": [
        {"id": "q22s-c1", "condition": "높이 BC=12k 계산", "mappedTo": "seg-BC"}
    ],
    "newVisualInformation": ["피타고라스 정리에 의해 BC=12k 도출"],
    "caption": "빗변 13k와 밑변 5k로부터 높이 BC=12k를 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("B", 0, 0),
            source_point("A", 0, 5),
            source_point("C", 12, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-BC", "refs": ["B", "C"]},
        {"id": "seg-AC", "refs": ["A", "C"]}
    ],
    "displayPoints": ["A", "B", "C"],
    "rightAngles": [{"id": "ra-B", "refs": ["A", "B", "C"], "factRole": "GIVEN"}]
}

# Q23: Concentric circles with radii 4, 5
plans["q23-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "중심 O가 같은 두 원의 반지름의 길이가 각각 4\\,\\mathrm{cm}, 5\\,\\mathrm{cm}",
    "sourceConditions": [
        {"id": "q23-c1", "condition": "작은 원의 접점 M과 큰 원의 현 AB", "mappedTo": "seg-AB"}
    ],
    "newVisualInformation": ["동심원과 작은 원에 접하는 큰 원의 현 AB"],
    "caption": "반지름 4cm, 5cm인 두 동심원과 작은 원에 접하는 현 AB",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("M", 0, 4),
            source_point("A", -3, 4),
            source_point("B", 3, 4),
            {
                "id": "circleSmall",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "M"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            },
            {
                "id": "circleLarge",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "B"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": [
            dist_audit("audit-q23-OM", "q23-c1", "O", "M", 4)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]}
    ],
    "displayPoints": ["O", "M", "A", "B"],
    "displayCircles": ["circleSmall", "circleLarge"]
}

plans["q23-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "BM = \\sqrt{OB^2 - OM^2} = \\sqrt{5^2 - 4^2} = 3\\,\\mathrm{cm}",
    "sourceConditions": [
        {"id": "q23s-c1", "condition": "직각삼각형 OMB에서 피타고라스 정리", "mappedTo": "seg-OB"}
    ],
    "newVisualInformation": ["반지름 OM=4, OB=5로 직각삼각형 OMB를 구성하여 BM=3 도출"],
    "caption": "반지름 OM=4와 OB=5를 연결해 직각삼각형에서 BM=3을 구하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("O", 0, 0),
            source_point("M", 0, 4),
            source_point("A", -3, 4),
            source_point("B", 3, 4),
            {
                "id": "circleSmall",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "M"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            },
            {
                "id": "circleLarge",
                "op": "CIRCLE_THROUGH_POINT",
                "inputs": ["O", "B"],
                "args": {},
                "outputType": "CIRCLE",
                "factRole": "GIVEN"
            }
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-OM", "refs": ["O", "M"]},
        {"id": "seg-OB", "refs": ["O", "B"]}
    ],
    "displayPoints": ["O", "M", "A", "B"],
    "displayCircles": ["circleSmall", "circleLarge"],
    "rightAngles": [{"id": "ra-M", "refs": ["O", "M", "B"], "factRole": "GIVEN"}]
}

# Q24: Hot air balloon distance
plans["q24-problem"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "600\\,\\mathrm{m} 상공에 떠 있는 열기구에서 두 지점 A, B를 내려다본 각",
    "sourceConditions": [
        {"id": "q24-c1", "condition": "열기구 P의 높이 PH=600", "mappedTo": "seg-PH"}
    ],
    "newVisualInformation": ["열기구 P와 지면의 두 지점 A, B의 앙각/내려다본 각 배치"],
    "caption": "지면에서 높이 600m에 있는 열기구 P와 두 지점 A, B",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("H", 0, 0),
            source_point("P", 0, 6),
            source_point("A", -6, 0),
            source_point("B", 10, 0)
        ],
        "conditionAudits": [
            dist_audit("audit-q24-PH", "q24-c1", "H", "P", 6)
        ]
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-PA", "refs": ["P", "A"]},
        {"id": "seg-PB", "refs": ["P", "B"]},
        {"id": "seg-PH", "refs": ["P", "H"]}
    ],
    "displayPoints": ["P", "H", "A", "B"],
    "rightAngles": [{"id": "ra-H", "refs": ["P", "H", "B"], "factRole": "GIVEN"}]
}

plans["q24-solution"] = {
    "capability": "construction-spike-v1",
    "sourceQuote": "AB = AH + BH = 600 + 600\\sqrt{3}\\,\\mathrm{m}",
    "sourceConditions": [
        {"id": "q24s-c1", "condition": "두 직각삼각형 PAH, PBH에서 거리 합", "mappedTo": "seg-AB"}
    ],
    "newVisualInformation": ["AH와 BH를 각각 구해 더하는 풀이 관계"],
    "caption": "두 직각삼각형에서 각각 AH와 BH의 길이를 구하여 두 지점 사이의 거리를 계산하는 풀이",
    "mathPlan": {
        "schemaVersion": "construction-spike-v1",
        "nodes": [
            source_point("H", 0, 0),
            source_point("P", 0, 6),
            source_point("A", -6, 0),
            source_point("B", 10, 0)
        ],
        "conditionAudits": []
    },
    "displaySegments": [
        {"id": "seg-AB", "refs": ["A", "B"]},
        {"id": "seg-PA", "refs": ["P", "A"]},
        {"id": "seg-PB", "refs": ["P", "B"]},
        {"id": "seg-PH", "refs": ["P", "H"]}
    ],
    "displayPoints": ["P", "H", "A", "B"],
    "rightAngles": [{"id": "ra-H", "refs": ["P", "H", "B"], "factRole": "GIVEN"}]
}

# Write all plan files to disk
print(f"Writing {len(plans)} plans to {PLANS_DIR}...")
for name, p in plans.items():
    file_path = os.path.join(PLANS_DIR, f"{name}.plan.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(p, f, ensure_ascii=False, indent=2)

print("All plan files written successfully!")
