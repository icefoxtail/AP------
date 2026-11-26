window.examTitle = "기하_027_타원의정의의활용-중점연결정리_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 두 초점이 $\\mathrm{F}(5, 0), \\mathrm{F}'(-5, 0)$인 타원 위의 한 점 $\\mathrm{P}$에 대하여 원점 $\\mathrm{O}$에서 선분 $\\mathrm{PF}'$에 내린 수선의 발을 $\\mathrm{H}$라 하자. 점 $\\mathrm{H}$가 선분 $\\mathrm{PF}'$의 중점이고 $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{OH}} = 2$일 때, 이 타원의 단축의 길이는? [그림: 좌표평면 위에 두 초점 $\\mathrm{F}(5, 0), \\mathrm{F}'(-5, 0)$을 갖는 타원이 그려져 있고, 제$2$사분면 위의 타원 상의 점 $\\mathrm{P}$에서 초점 $\\mathrm{F}'$과 $\\mathrm{F}$를 각각 잇는 선분이 그어져 있다. 원점 $\\mathrm{O}$에서 선분 $\\mathrm{PF}'$에 내린 수선의 발 $\\mathrm{H}$가 선분 $\\mathrm{PF}'$의 중점임이 직각 표시와 길이 같음 기호로 나타나 있다.]",
    "choices": [
      "$2\\sqrt{6}$",
      "$3\\sqrt{6}$",
      "$4\\sqrt{6}$",
      "$5\\sqrt{6}$",
      "$6\\sqrt{6}$"
    ],
    "answer": "③",
    "solution": "두 초점 $\\mathrm{F}(5, 0), \\mathrm{F}'(-5, 0)$에 대하여 원점 $\\mathrm{O}(0, 0)$은 선분 $\\mathrm{F}'\\mathrm{F}$의 중점이다.\n삼각형의 중점연결 정리에 의해 $\\triangle \\mathrm{PF}'\\mathrm{F}$에서 점 $\\mathrm{H}$가 $\\overline{\\mathrm{PF}'}$의 중점이므로 $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}}$이고 $\\overline{\\mathrm{PF}} = 2\\overline{\\mathrm{OH}}$이다.\n조건에서 원점 $\\mathrm{O}$에서 내린 수선의 발이 $\\mathrm{H}$이므로 $\\overline{\\mathrm{OH}} \\perp \\overline{\\mathrm{PF}'}$이고, $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}}$에 의해 $\\overline{\\mathrm{PF}} \\perp \\overline{\\mathrm{PF}'}$이다.\n따라서 $\\angle \\mathrm{F}'\\mathrm{PF} = 90^\\circ$이므로 $\\triangle \\mathrm{PF}'\\mathrm{F}$는 빗변이 $\\overline{\\mathrm{F}'\\mathrm{F}} = 2 \\times 5 = 10$인 직각삼각형이다.\n조건 $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{OH}} = 2$에 $\\overline{\\mathrm{OH}} = \\frac{1}{2}\\overline{\\mathrm{PF}}$를 대입하면 $\\overline{\\mathrm{PF}'} - \\frac{1}{2}\\overline{\\mathrm{PF}} = 2$에서 $\\overline{\\mathrm{PF}} = 2\\overline{\\mathrm{PF}'} - 4$이다.\n피타고라스 정리에 의해 직각삼각형 $\\mathrm{PF}'\\mathrm{F}$에서 $(\\overline{\\mathrm{PF}'})^2 + (\\overline{\\mathrm{PF}})^2 = (\\overline{\\mathrm{F}'\\mathrm{F}})^2 = 10^2 = 100$이다.\n$\\overline{\\mathrm{PF}} = 2\\overline{\\mathrm{PF}'} - 4$를 대입하여 정리하면 $(\\overline{\\mathrm{PF}'})^2 + (2\\overline{\\mathrm{PF}'} - 4)^2 = 5(\\overline{\\mathrm{PF}'})^2 - 16\\overline{\\mathrm{PF}'} + 16 = 100$이다.\n이항하여 인수분해하면 $5(\\overline{\\mathrm{PF}'})^2 - 16\\overline{\\mathrm{PF}'} - 84 = (\\overline{\\mathrm{PF}'} - 6)(5\\overline{\\mathrm{PF}'} + 14) = 0$이다.\n길이는 양수이므로 $\\overline{\\mathrm{PF}'} = 6$이고, $\\overline{\\mathrm{PF}} = 2(6) - 4 = 8$이다.\n타원의 정의에 의해 장축의 길이는 $2a = \\overline{\\mathrm{PF}'} + \\overline{\\mathrm{PF}} = 6 + 8 = 14$이므로 $a = 7$이다.\n타원의 성질 $b^2 = a^2 - c^2$에 $a = 7, c = 5$를 대입하면 $b^2 = 7^2 - 5^2 = 49 - 25 = 24$에서 $b = \\sqrt{24} = 2\\sqrt{6}$이다.\n따라서 단축의 길이는 $2b = 2 \\times 2\\sqrt{6} = 4\\sqrt{6}$이다.\n주의: 중점연결 정리로 $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}}$임을 찾아내어야 $\\triangle \\mathrm{PF}'\\mathrm{F}$가 직각삼각형임을 알 수 있다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_FOCAL",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_BISECTOR"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/기하_027_타원의정의의활용-중점연결정리_고2_유형은행1/q1-problem.svg",
    "imageAlt": "타원의 초점 F(5,0), F′(-5,0)과 제2사분면 P, PF′의 중점 H에 내린 수선 OH를 나타낸 도형",
    "imageCaption": "타원의 초점 F(5,0), F′(-5,0)과 제2사분면 P, PF′의 중점 H에 내린 수선 OH를 나타낸 도형",
    "imageSize": "full"
  },
  {
    "id": 2,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{F}(4, 0), \\mathrm{F}'(-4, 0)$을 초점으로 하는 타원 위의 한 점 $\\mathrm{P}$에 대하여 원점 $\\mathrm{O}$에서 선분 $\\mathrm{PF}$와 선분 $\\mathrm{PF}'$에 내린 수선의 발을 각각 $\\mathrm{H}$와 $\\mathrm{I}$라 하자. 점 $\\mathrm{H}$와 점 $\\mathrm{I}$가 각각 선분 $\\mathrm{PF}$와 선분 $\\mathrm{PF}'$의 중점이고 사각형 $\\mathrm{OHPI}$의 넓이가 $7$일 때, 이 타원의 장축의 길이를 $l$이라 하자. $l^2$의 값은? (단, $\\overline{\\mathrm{OH}} \\neq \\overline{\\mathrm{OI}}$) [그림: 좌표평면 위에 두 초점 $\\mathrm{F}(4, 0), \\mathrm{F}'(-4, 0)$을 갖는 타원이 있고, 제$1$사분면 위의 타원 상의 점 $\\mathrm{P}$에서 두 초점 $\\mathrm{F, F}'$을 잇는 선분이 그려져 있다. 선분 $\\mathrm{PF}$의 중점 $\\mathrm{H}$와 선분 $\\mathrm{PF}'$의 중점 $\\mathrm{I}$에 원점 $\\mathrm{O}$에서 각각 수선의 발을 내려 사각형 $\\mathrm{OHPI}$가 직사각형을 이루고 있다.]",
    "choices": [
      "100",
      "120",
      "140",
      "160",
      "180"
    ],
    "answer": "②",
    "solution": "두 초점 $\\mathrm{F}(4, 0), \\mathrm{F}'(-4, 0)$에 대하여 원점 $\\mathrm{O}(0, 0)$은 선분 $\\mathrm{F}'\\mathrm{F}$의 중점이고 $\\overline{\\mathrm{F}'\\mathrm{F}} = 8$이다.\n삼각형의 중점연결 정리에 의해 $\\triangle \\mathrm{PF}'\\mathrm{F}$에서 점 $\\mathrm{H}$는 $\\overline{\\mathrm{PF}}$의 중점이므로 $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}'}$이고 $\\overline{\\mathrm{OH}} = \\frac{1}{2}\\overline{\\mathrm{PF}'}$이다.\n삼각형의 중점연결 정리에 의해 $\\triangle \\mathrm{PF}'\\mathrm{F}$에서 점 $\\mathrm{I}$는 $\\overline{\\mathrm{PF}'}$의 중점이므로 $\\overline{\\mathrm{OI}} \\parallel \\overline{\\mathrm{PF}}$이고 $\\overline{\\mathrm{OI}} = \\frac{1}{2}\\overline{\\mathrm{PF}}$이다.\n$\\overline{\\mathrm{OH}} \\perp \\overline{\\mathrm{PF}}$이고 $\\overline{\\mathrm{OI}} \\parallel \\overline{\\mathrm{PF}}$이므로 $\\overline{\\mathrm{OH}} \\perp \\overline{\\mathrm{OI}}$이며, 사각형 $\\mathrm{OHPI}$는 네 내각이 모두 $90^\\circ$인 직사각형이다.\n직사각형 $\\mathrm{OHPI}$의 넓이는 $\\overline{\\mathrm{OH}} \\times \\overline{\\mathrm{OI}} = 7$이므로 $(\\frac{1}{2}\\overline{\\mathrm{PF}'})(\\frac{1}{2}\\overline{\\mathrm{PF}}) = \\frac{1}{4}(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF}'}) = 7$에서 $\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF}'} = 28$이다.\n직사각형에서 $\\angle \\mathrm{HPI} = 90^\\circ$이므로 $\\triangle \\mathrm{PF}'\\mathrm{F}$는 $\\angle \\mathrm{F}'\\mathrm{PF} = 90^\\circ$인 직각삼각형이다.\n피타고라스 정리에 의해 직각삼각형 $\\mathrm{PF}'\\mathrm{F}$에서 $(\\overline{\\mathrm{PF}})^2 + (\\overline{\\mathrm{PF}'})^2 = (\\overline{\\mathrm{F}'\\mathrm{F}})^2 = 8^2 = 64$이다.\n타원의 정의에 의해 장축의 길이는 $l = \\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF}'}$이다.\n곱셈공식의 변형에 의해 $l^2 = (\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF}'})^2 = (\\overline{\\mathrm{PF}})^2 + (\\overline{\\mathrm{PF}'})^2 + 2(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF}'})$이다.\n구한 값을 대입하면 $l^2 = 64 + 2 \\times 28 = 64 + 56 = 120$이다.\n주의: $\\overline{\\mathrm{OH}} \\neq \\overline{\\mathrm{OI}}$ 조건은 $(\\overline{\\mathrm{PF}} - \\overline{\\mathrm{PF}'})^2 = 64 - 56 = 8 > 0$으로 성립하며, 점 $\\mathrm{P}$가 타원의 꼭짓점이 아님을 보장한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_FOCAL",
    "crossConceptKeys": [
      "CC_RECTANGLE_PROPERTIES",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/기하_027_타원의정의의활용-중점연결정리_고2_유형은행1/q2-problem.svg",
    "imageAlt": "타원의 두 초점 F(4,0), F′(-4,0)과 제1사분면 P, 두 수선의 발 H·I로 이루어진 직사각형 OHPI",
    "imageCaption": "타원의 두 초점 F(4,0), F′(-4,0)과 제1사분면 P, 두 수선의 발 H·I로 이루어진 직사각형 OHPI",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{F}(6, 0), \\mathrm{F}'(-6, 0)$을 초점으로 하는 타원 위의 서로 다른 두 점 $\\mathrm{P, Q}$에 대하여 원점 $\\mathrm{O}$에서 선분 $\\mathrm{PF}$와 선분 $\\mathrm{QF}'$에 내린 수선의 발을 각각 $\\mathrm{H}$와 $\\mathrm{I}$라 하자. 점 $\\mathrm{H}$와 점 $\\mathrm{I}$가 각각 선분 $\\mathrm{PF}$와 선분 $\\mathrm{QF}'$의 중점이고 $\\overline{\\mathrm{OH}} \\times \\overline{\\mathrm{OI}} = 12$일 때, 이 타원의 장축의 길이를 $l$이라 하자. $l^2$의 값은? (단, $\\overline{\\mathrm{OH}} \\neq \\overline{\\mathrm{OI}}$) [그림: 좌표평면 위에 두 초점 $\\mathrm{F}(6, 0), \\mathrm{F}'(-6, 0)$을 갖는 타원이 그려져 있고, 제$1$사분면 위의 점 $\\mathrm{P}$와 제$4$사분면 위의 점 $\\mathrm{Q}$가 타원 위에 있다. 원점 $\\mathrm{O}$에서 선분 $\\mathrm{PF}$에 내린 수선의 발 $\\mathrm{H}$가 선분 $\\mathrm{PF}$의 중점이고, 원점 $\\mathrm{O}$에서 선분 $\\mathrm{QF}'$에 내린 수선의 발 $\\mathrm{I}$가 선분 $\\mathrm{QF}'$의 중점임이 직각 표시와 길이 같음 기호로 표시되어 있다.]",
    "choices": [
      "180",
      "200",
      "220",
      "240",
      "260"
    ],
    "answer": "④",
    "solution": "두 초점 $\\mathrm{F}(6, 0), \\mathrm{F}'(-6, 0)$에 대하여 원점 $\\mathrm{O}(0, 0)$은 선분 $\\mathrm{F}'\\mathrm{F}$의 중점이고 $\\overline{\\mathrm{F}'\\mathrm{F}} = 12$이다.\n삼각형의 중점연결 정리에 의해 $\\triangle \\mathrm{PF}'\\mathrm{F}$에서 $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}'}$이고 $\\overline{\\mathrm{OH}} = \\frac{1}{2}\\overline{\\mathrm{PF}'}$이다.\n조건 $\\overline{\\mathrm{OH}} \\perp \\overline{\\mathrm{PF}}$와 $\\overline{\\mathrm{OH}} \\parallel \\overline{\\mathrm{PF}'}$에 의해 $\\overline{\\mathrm{PF}'} \\perp \\overline{\\mathrm{PF}}$이므로 피타고라스 정리에 의해 $(\\overline{\\mathrm{PF}})^2 + (\\overline{\\mathrm{PF}'})^2 = (\\overline{\\mathrm{F}'\\mathrm{F}})^2 = 12^2 = 144$이다.\n마찬가지로 $\\triangle \\mathrm{QF}'\\mathrm{F}$에서 중점연결 정리에 의해 $\\overline{\\mathrm{OI}} \\parallel \\overline{\\mathrm{QF}}$이고 $\\overline{\\mathrm{OI}} = \\frac{1}{2}\\overline{\\mathrm{QF}}$이다.\n조건 $\\overline{\\mathrm{OI}} \\perp \\overline{\\mathrm{QF}'}$와 $\\overline{\\mathrm{OI}} \\parallel \\overline{\\mathrm{QF}}$에 의해 $\\overline{\\mathrm{QF}} \\perp \\overline{\\mathrm{QF}'}$이므로 피타고라스 정리에 의해 $(\\overline{\\mathrm{QF}})^2 + (\\overline{\\mathrm{QF}'})^2 = 144$이다.\n두 점 $\\mathrm{P, Q}$는 모두 타원 위의 점이면서 지름이 $\\overline{\\mathrm{F}'\\mathrm{F}}$인 원 위의 점이므로, 두 초점까지의 거리의 쌍은 대칭성에 의해 같은 두 양수 $d_1, d_2$로 결정된다.\n경우 나누기:\n(i) 만약 $\\overline{\\mathrm{PF}'} = \\overline{\\mathrm{QF}}$이면 $\\overline{\\mathrm{OH}} = \\frac{1}{2}\\overline{\\mathrm{PF}'} = \\frac{1}{2}\\overline{\\mathrm{QF}} = \\overline{\\mathrm{OI}}$가 되어 $\\overline{\\mathrm{OH}} \\neq \\overline{\\mathrm{OI}}$라는 조건에 모순이다.\n(ii) 따라서 ${\\overline{\\mathrm{PF}}, \\overline{\\mathrm{PF}'}} = \\{d_1, d_2\\}$에서 $\\overline{\\mathrm{PF}'} = d_2$라 하면 $\\overline{\\mathrm{QF}} = d_1$이어야 하므로 $\\overline{\\mathrm{OH}} = \\frac{1}{2}d_2, \\overline{\\mathrm{OI}} = \\frac{1}{2}d_1$이다.\n조건 $\\overline{\\mathrm{OH}} \\times \\overline{\\mathrm{OI}} = 12$에 대입하면 $(\\frac{1}{2}d_2)(\\frac{1}{2}d_1) = \\frac{1}{4}d_1 d_2 = 12$에서 $d_1 d_2 = 48$이다.\n타원의 정의에 의해 장축의 길이는 $l = d_1 + d_2$이므로 곱셈공식에 의해 $l^2 = (d_1 + d_2)^2 = (d_1^2 + d_2^2) + 2d_1 d_2$이다.\n$d_1^2 + d_2^2 = 144$와 $d_1 d_2 = 48$을 대입하면 $l^2 = 144 + 2 \\times 48 = 144 + 96 = 240$이다.\n주의: $\\overline{\\mathrm{OH}} \\neq \\overline{\\mathrm{OI}}$ 조건으로부터 $d_1 \\neq d_2$임을 확인해야 하며, 실제로 $(d_1 - d_2)^2 = 144 - 96 = 48 > 0$으로 잘 정의된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_FOCAL",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_BISECTOR"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/기하_027_타원의정의의활용-중점연결정리_고2_유형은행1/q3-problem.svg",
    "imageAlt": "초점 F(6,0), F′(-6,0)인 타원과 위쪽 P·아래쪽 Q에서의 중점 수선 OH·OI",
    "imageCaption": "초점 F(6,0), F′(-6,0)인 타원과 위쪽 P·아래쪽 Q에서의 중점 수선 OH·OI",
    "imageSize": "full"
  }
];
