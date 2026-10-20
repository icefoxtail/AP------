window.examTitle = "22_매산고_1학기_기말_고2_기하";
window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "점 $\\mathrm{P}(3, 2, -4)$와 $xy$평면에 대하여 대칭인 점의 좌표를 구하면? [4점]",
    "choices": [
      "$(-3, 2, -4)$",
      "$(3, -2, -4)$",
      "$(3, 2, 4)$",
      "$(3, -2, 4)$",
      "$(-3, -2, -4)$"
    ],
    "answer": "③",
    "solution": "조건·목표: xy평면 대칭점 좌표\n핵심 전략: xy평면 대칭에서는 z부호만 반전\n풀이:\nxy평면에 대한 대칭은 x, y좌표를 그대로 두고 z좌표의 부호만 바꾼다.\n따라서 P(3,2,-4)의 대칭점은 (3,2,4)이다.\n다른 보기는 x 또는 y좌표까지 바꾸거나 z좌표를 그대로 둔 경우이므로 정답은 ③이다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "공간의 좌표",
    "standardUnitKey": "H15-GV-09",
    "subUnitKey": null,
    "primaryMethod": "공간좌표 대칭",
    "decisiveStep": "xy평면 대칭에서는 z부호만 반전",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "공간의 좌표",
      "l4": "점의 좌표",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 1,
    "sourceQid": 1,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 2,
    "questionType": "객관식",
    "content": "직선 $\\frac{12+x}{3}=\\frac{2-y}{2}$의 방향벡터를 구하면? [4점]",
    "choices": [
      "$(-3, -2)$",
      "$(3, -2)$",
      "$(3, 2)$",
      "$(3, 4)$",
      "$(4, 5)$"
    ],
    "answer": "②",
    "solution": "조건·목표: 직선의 방향벡터\n핵심 전략: 공통 매개변수의 좌표 증분\n풀이:\n공통값을 t로 두면 (12+x)/3=t, (2-y)/2=t이므로 x=-12+3t, y=2-2t이다.\n매개변수 t가 1 증가할 때 좌표의 변화량은 (3,-2)이므로 방향벡터는 (3,-2)이다.\n정답 ②.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "도형에의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "매개변수 직선의 방향벡터",
    "decisiveStep": "공통 매개변수의 좌표 증분",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "도형에의 활용",
      "l4": "직선의 방정식",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 2,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 3,
    "questionType": "객관식",
    "content": "타원 $\\frac{x^2}{45}+\\frac{y^2}{20}=1$의 두 초점을 $\\mathrm{F, F'}$이라 할 때, 선분 $\\mathrm{FF'}$의 길이는? [4.1점]",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "④",
    "solution": "조건·목표: 타원의 두 초점 사이 거리\n핵심 전략: c²=a²-b²\n풀이:\n타원 x²/45+y²/20=1은 긴축이 x축 방향이고 a²=45, b²=20이다.\n초점거리 c는 c²=a²-b²=25에서 c=5이다.\n두 초점은 (±5,0)이므로 FF′=2c=10이다.\n정답 ④.",
    "standardCourse": "기하",
    "standardUnit": "이차곡선",
    "subUnit": "타원",
    "standardUnitKey": "H15-GV-02",
    "subUnitKey": null,
    "primaryMethod": "타원의 초점거리",
    "decisiveStep": "c²=a²-b²",
    "rpmPrimary": {
      "majorUnit": "이차곡선",
      "l3": "타원",
      "l4": "초점·장축·단축",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 3,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 4,
    "questionType": "객관식",
    "content": "쌍곡선 $\\frac{x^2}{a^2}-\\frac{y^2}{16}=1$의 점근선 중 하나의 기울기가 $5$일 때, 양수 $a$의 값은? [4.1점]",
    "choices": [
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$",
      "$\\frac{7}{10}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 쌍곡선의 양수 a\n핵심 전략: 기울기 b/a=4/a\n풀이:\n쌍곡선 x²/a²-y²/16=1의 점근선은 y=±(4/a)x이다.\n양수 a에 대해 한 점근선의 기울기가 5이면 4/a=5, 따라서 a=4/5이다.\n정답 ⑤.",
    "standardCourse": "기하",
    "standardUnit": "이차곡선",
    "subUnit": "쌍곡선",
    "standardUnitKey": "H15-GV-03",
    "subUnitKey": null,
    "primaryMethod": "쌍곡선의 점근선",
    "decisiveStep": "기울기 b/a=4/a",
    "rpmPrimary": {
      "majorUnit": "이차곡선",
      "l3": "쌍곡선",
      "l4": "점근선",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 4,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 5,
    "questionType": "객관식",
    "content": "$|\\vec{a}|=6$, $|\\vec{b}|=5$인 두 평면벡터 $\\vec{a}, \\vec{b}$가 이루는 각의 크기가 $60^\\circ$일 때, $\\vec{a} \\cdot \\vec{b}$를 구하면? [4.2점]",
    "choices": [
      "13",
      "14",
      "15",
      "16",
      "17"
    ],
    "answer": "③",
    "solution": "조건·목표: 벡터 내적\n핵심 전략: |a||b|cos60°\n풀이:\n두 벡터의 내적은 |a||b|cosθ이다.\n주어진 크기와 각을 대입하면 a·b=6×5×cos60°=30×(1/2)=15이다.\n정답 ③.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "내적",
    "standardUnitKey": "H15-GV-06",
    "subUnitKey": null,
    "primaryMethod": "평면벡터 내적",
    "decisiveStep": "|a||b|cos60°",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "내적",
      "l4": "내적 계산",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 1,
    "sourceQid": 5,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 6,
    "questionType": "객관식",
    "content": "두 벡터 $\\vec{a}=(-15, x)$, $\\vec{b}=(5, -2)$가 $\\vec{a} \\parallel \\vec{b}$을 만족시키도록 하는 $x$의 값을 구하면? [4.2점]",
    "choices": [
      "6",
      "9",
      "12",
      "15",
      "18"
    ],
    "answer": "①",
    "solution": "조건·목표: 평행한 벡터의 미지 성분\n핵심 전략: 성분별 같은 실수배\n풀이:\n평행한 두 벡터는 한 벡터가 다른 벡터의 실수배이다.\n(-15,x)=k(5,-2)로 놓으면 첫 성분에서 k=-3, 둘째 성분에서 x=(-3)(-2)=6이다.\n정답 ①.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "벡터의 실수배",
    "standardUnitKey": "H15-GV-05",
    "subUnitKey": null,
    "primaryMethod": "벡터의 평행 조건",
    "decisiveStep": "성분별 같은 실수배",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "벡터의 실수배",
      "l4": "평행 조건",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 6,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "좌표평면에 두 직선<br>$$x-2y-5=0, \\quad 3x-y-1=0$$<br>가 이루는 예각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은? [4.3점]",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$\\frac{\\sqrt{3}}{2}$",
      "$\\frac{2}{3}$",
      "$\\frac{\\sqrt{5}}{3}$"
    ],
    "answer": "②",
    "solution": "조건·목표: 두 직선 예각의 코사인\n핵심 전략: 법선벡터 내적의 절댓값\n풀이:\n직선 x-2y-5=0, 3x-y-1=0의 법선벡터는 각각 (1,-2), (3,-1)이다.\n두 직선이 이루는 예각의 코사인은 법선벡터 내적의 절댓값을 크기의 곱으로 나눈 값이므로 cosθ=|3+2|/(√5√10)=5/√50=√2/2이다.\n정답 ②.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "내적",
    "standardUnitKey": "H15-GV-06",
    "subUnitKey": null,
    "primaryMethod": "두 직선의 각과 내적",
    "decisiveStep": "법선벡터 내적의 절댓값",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "내적",
      "l4": "두 벡터의 각",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 7,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 8,
    "questionType": "객관식",
    "content": "구 $x^2+y^2+z^2+2x-2y+6z-k=0$이 $yz$평면에 접하도록 하는 실수 $k$의 값을 구하면? [4.3점]",
    "choices": [
      "$-10$",
      "$-5$",
      "$0$",
      "$5$",
      "$10$"
    ],
    "answer": "①",
    "solution": "조건·목표: 구가 yz평면에 접하는 k\n핵심 전략: 중심과 yz평면 거리=반지름\n풀이:\n완전제곱하면 (x+1)²+(y-1)²+(z+3)²=k+11이다.\n구의 중심은 (-1,1,-3)이고 반지름의 제곱은 k+11이다.\nyz평면 x=0까지 중심의 거리가 1이므로 접할 조건은 반지름=1이다.\n따라서 k+11=1, k=-10이며 정답 ①.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "구의 방정식",
    "standardUnitKey": "H15-GV-09",
    "subUnitKey": null,
    "primaryMethod": "구의 방정식과 평면 접선",
    "decisiveStep": "중심과 yz평면 거리=반지름",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "구의 방정식",
      "l4": "구와 좌표조건",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 8,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 9,
    "questionType": "객관식",
    "content": "두 점 $\\mathrm{A}(4, 2)$, $\\mathrm{B}(0, 5)$에 대하여 $\\vec{\\mathrm{AP}} \\cdot \\vec{\\mathrm{BP}}=0$을 만족시키는 점 $\\mathrm{P}$가 그리는 도형의 둘레의 길이를 구하면? [4.4점]",
    "choices": [
      "$\\frac{13}{4}\\pi$",
      "$4\\pi$",
      "$\\frac{9}{2}\\pi$",
      "$\\frac{19}{4}\\pi$",
      "$5\\pi$"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 직각 자취 원의 둘레\n핵심 전략: AP·BP=0을 지름원으로 해석\n풀이:\nAP·BP=0이면 ∠APB=90°이므로 P의 자취는 AB를 지름으로 하는 원이다(끝점은 내적 0을 만족한다).\nAB=√((4-0)²+(2-5)²)=5이고 원의 둘레는 지름×π=5π이다.\n정답 ⑤.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "도형에의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "벡터 내적의 직각 자취",
    "decisiveStep": "AP·BP=0을 지름원으로 해석",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "도형에의 활용",
      "l4": "원의 방정식",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 9,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 10,
    "questionType": "객관식",
    "content": "두 점 $(3, 2, 4)$, $(5, 4, -2)$를 지름의 양 끝 점으로 하는 구가 $xz$평면과 만나서 생기는 도형의 넓이를 구하면? [4.4점]",
    "choices": [
      "$\\pi$",
      "$\\frac{3}{2}\\pi$",
      "$2\\pi$",
      "$\\frac{5}{2}\\pi$",
      "$3\\pi$"
    ],
    "answer": "③",
    "solution": "조건·목표: 구의 xz평면 단면 넓이\n핵심 전략: 단면 반지름 제곱 R²-d²\n풀이:\n지름의 양 끝점의 중점은 구의 중심 C=(4,3,1)이다.\n두 점 사이 거리의 제곱은 2²+2²+(-6)²=44이므로 구의 반지름의 제곱은 11이다.\nxz평면 y=0까지 중심의 거리는 3이므로 단면원의 반지름 제곱은 11-3²=2, 넓이는 2π이다.\n정답 ③.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "구의 방정식",
    "standardUnitKey": "H15-GV-09",
    "subUnitKey": null,
    "primaryMethod": "구의 평면 단면",
    "decisiveStep": "단면 반지름 제곱 R²-d²",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "구의 방정식",
      "l4": "구와 좌표조건",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 10,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "그림과 같이 한 모서리의 길이가 3인 정육면체에서 선분 $\\mathrm{DF}$를 $1:2$로 내분하는 점을 $\\mathrm{P}$라고 할 때, 삼각형 $\\mathrm{PEF}$의 넓이를 구하면? [4.5점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q11.png\" class=\"exam-img\" alt=\"정육면체에서 D와 F를 잇는 선분의 내분점 P와 삼각형 PEF\"></div>",
    "choices": [
      "$\\frac{9}{4}\\sqrt{2}$",
      "$\\frac{5}{2}\\sqrt{2}$",
      "$\\frac{11}{4}\\sqrt{2}$",
      "$3\\sqrt{2}$",
      "$\\frac{13}{4}\\sqrt{2}$"
    ],
    "answer": "④",
    "solution": "조건·목표: 한 모서리가 3인 정육면체에서 DF를 1:2로 내분한 P를 이용하여 △PEF의 넓이를 구한다.\n전략: EF를 밑변으로 두고 P에서 EF까지의 수직거리를 구한다.\n풀이 ① E를 원점, EF를 x축, EH를 y축, EA를 z축으로 잡으면 E=(0,0,0), F=(3,0,0), D=(0,3,3)이다. 세 모서리가 서로 수직이고 길이가 3이므로 이런 좌표를 잡아도 넓이는 변하지 않는다.\n풀이 ② DP:PF=1:2이므로 P=(2D+F)/3=(1,2,2)이다.\n풀이 ③ EF는 x축의 길이 3인 선분이다. P=(1,2,2)에서 EF가 놓인 x축까지의 거리는 √(2²+2²)=2√2이다. 수선의 발 (1,0,0)은 EF 위에 있다.\n풀이 ④ △PEF의 넓이=(1/2)×밑변 EF×높이=(1/2)×3×2√2=3√2이다.\n따라서 정답은 ④이다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "삼수선 정리",
    "standardUnitKey": "H15-GV-08",
    "subUnitKey": null,
    "primaryMethod": "공간좌표 내분과 삼각형 넓이",
    "decisiveStep": "P의 좌표와 EF까지 거리",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "삼수선 정리",
      "l4": "정사영 활용",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 11,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 12,
    "questionType": "객관식",
    "content": "타원 $\\frac{x^2}{25}+\\frac{y^2}{64}=1$의 꼭짓점 $\\mathrm{A}(0, 8)$, $\\mathrm{B}(5, 0)$와 타원 위의 점 $\\mathrm{P}$에 대하여 삼각형 $\\mathrm{ABP}$의 넓이가 최대일 때, 점 $\\mathrm{P}$에서의 접선의 $x$절편을 구하면? [4.5점]",
    "choices": [
      "$-\\frac{16}{3}\\sqrt{2}$",
      "$-5\\sqrt{2}$",
      "$-\\frac{13}{3}\\sqrt{2}$",
      "$-\\frac{12}{3}\\sqrt{2}$",
      "$-\\frac{11}{3}\\sqrt{2}$"
    ],
    "answer": "②",
    "solution": "조건·목표: 타원 x²/25+y²/64=1 위의 점 P 중 △ABP의 넓이가 최대인 점에서 접선의 x절편을 구한다.\n전략: 밑변 AB를 고정하면 넓이는 P에서 직선 AB까지의 거리에 비례한다. 타원 매개화로 가장 먼 P를 먼저 찾는다.\n풀이 ① A=(0,8), B=(5,0)이므로 AB의 방정식은 8x+5y=40이다. 따라서 직선까지의 거리는 |8x+5y-40|/√89이다.\n풀이 ② 타원 위에서 x=5cos t, y=8sin t라 놓으면 8x+5y=40(cos t+sin t)이며 그 범위는 [-40√2,40√2]이다.\n풀이 ③ |8x+5y-40|는 최솟값 -40√2에서 40(1+√2)로 최대가 된다(반대편 최댓값에서는 40(√2-1)). 따라서 P=(-5/√2,-8/√2)이다.\n풀이 ④ 타원의 접선은 xx₀/25+yy₀/64=1이다. y=0을 대입하면 x절편=25/x₀=25/(-5/√2)=-5√2.\n보기 확인: -5√2는 ②이며, 최댓값과 최솟값 중 어느 쪽이 직선 AB에서 더 먼지 반드시 비교한다.",
    "standardCourse": "기하",
    "standardUnit": "이차곡선",
    "subUnit": "이차곡선의 접선",
    "standardUnitKey": "H15-GV-04",
    "subUnitKey": null,
    "primaryMethod": "타원의 접선과 최댓값",
    "decisiveStep": "지지직선의 최원점 P를 구해 접선 x절편",
    "rpmPrimary": {
      "majorUnit": "이차곡선",
      "l3": "이차곡선의 접선",
      "l4": "접점이 주어진 접선",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 5,
    "sourceQid": 12,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 13,
    "questionType": "객관식",
    "content": "오른쪽 그림과 같이 한 모서리의 길이가 4인 정사면체 $\\mathrm{ABCD}$에서 모서리 $\\mathrm{CD}$의 중점을 $\\mathrm{M}$이라고 할 때, 삼각형 $\\mathrm{ABC}$의 평면 $\\mathrm{ABM}$위로의 정사영의 넓이를 구하면? [4.6점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q13.png\" class=\"exam-img\" alt=\"정사면체 ABCD의 CD 중점 M과 평면 ABM\"></div>",
    "choices": [
      "$\\frac{7}{2}\\sqrt{2}$",
      "$\\frac{15}{4}\\sqrt{2}$",
      "$4\\sqrt{2}$",
      "$\\frac{17}{4}\\sqrt{2}$",
      "$\\frac{9}{2}\\sqrt{2}$"
    ],
    "answer": "③",
    "solution": "조건·목표: 한 변이 4인 정사면체에서 △ABC를 평면 ABM에 정사영한 넓이를 구한다.\n전략: 공통 직선 AB에 수직인 두 선분 CN, MN이 만드는 각으로 두 평면의 이면각을 구한다.\n풀이 ① AB의 중점을 N이라 두자. 정사면체이므로 △ABC와 △ABD는 정삼각형이고 CN=2√3이다. CD의 중점 M에 대하여 △ACD와 △BCD에서 AM=BM=2√3이다.\n풀이 ② AC=BC 및 AM=BM이므로 C와 M은 모두 AB의 수직이등분평면 위에 있다. 따라서 CN⊥AB, MN⊥AB이다. 직각삼각형 AMN에서 AN=2이므로 MN=√(AM²-AN²)=√(12-4)=2√2이다.\n풀이 ③ CM=CD/2=2이다. △CNM에서 코사인법칙을 쓰면 cos∠CNM=(CN²+MN²-CM²)/(2·CN·MN)=(12+8-4)/(2·2√3·2√2)=√(2/3)이다.\n풀이 ④ ∠CNM은 AB에 수직인 두 평면의 단면각이므로 △ABC와 평면 ABM 사이의 이면각이다. △ABC의 넓이는 (√3/4)×4²=4√3이다.\n풀이 ⑤ 정사영 넓이=원래 넓이×|cos(이면각)|=4√3×√(2/3)=4√2이다.\n따라서 정답은 ③이다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "직선과 평면",
    "standardUnitKey": "H15-GV-08",
    "subUnitKey": null,
    "primaryMethod": "정사영과 이면각",
    "decisiveStep": "수직 단면 CNM의 코사인법칙",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "직선과 평면",
      "l4": "정사영",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 13,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 14,
    "questionType": "객관식",
    "content": "다음 그림과 같이 두 점 $\\mathrm{A, B}$는 각각 서로 수직인 두 평면 $\\alpha, \\beta$ 위에 있고, 점 $\\mathrm{P}$는 두 평면 $\\alpha, \\beta$의 교선 $l$ 위에 있다. 직선 $l$과 두 직선 $\\mathrm{PA, PB}$가 이루는 각의 크기가 각각 $60^\\circ, 45^\\circ$일 때, 평면 $\\mathrm{PBA}$와 평면 $\\beta$가 이루는 각의 크기를 $\\theta$라고 하자. 이때 $\\cos^2\\theta$의 값을 구하면? [4.6점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q14-repaired.svg\" class=\"exam-img\" alt=\"서로 수직인 두 평면과 교선 l, 점 P A B의 공간 관계\"></div>",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{7}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$"
    ],
    "answer": "②",
    "solution": "조건·목표: 서로 수직인 두 평면 α, β와 교선 l에 대해 평면 PAB와 β 사이의 각 θ의 cos²θ를 구한다.\n전략: 교선 l을 x축으로 잡고 두 평면을 좌표평면으로 놓으면 각 조건이 좌표의 비가 된다.\n풀이 ① P=(0,0,0), α:xz평면, β:xy평면, l:x축으로 둔다. PA가 l과 60°이므로 A=(a,0,√3a), PB가 l과 45°이므로 B=(b,b,0)으로 잡을 수 있다(a,b≠0).\n풀이 ② PA=(a,0,√3a), PB=(b,b,0)이다. 두 벡터의 외적은 (-√3ab,√3ab,ab)로, PAB 평면의 법선은 (-√3,√3,1)에 평행하다.\n풀이 ③ β의 법선은 (0,0,1)이다. 두 평면의 예각은 법선 사이의 예각과 같으므로 cosθ=|1|/(√(3+3+1)×1)=1/√7이다.\n보기 확인: cos²θ=1/7이므로 ②이다. 좌표 부호가 달라도 제곱값은 같다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "이면각",
    "standardUnitKey": "H15-GV-08",
    "subUnitKey": null,
    "primaryMethod": "수직 평면의 이면각",
    "decisiveStep": "좌표 평면식의 법선 각",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "이면각",
      "l4": "이면각",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 14,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 15,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{OAB}$는 한 변의 길이가 1인 정삼각형이고 점 $\\mathrm{X}$에 대한 위치벡터 $\\vec{x}$에 대하여 $\\vec{x} \\cdot \\vec{\\mathrm{OA}}=3$, $\\vec{x} \\cdot \\vec{\\mathrm{OB}}=6$일 때, $|\\vec{\\mathrm{OA}}-\\vec{x}|$의 값을 구하면? (단, $k, l$은 실수이다.) [4.8점]",
    "choices": [
      "$\\sqrt{31}$",
      "$4\\sqrt{2}$",
      "$\\sqrt{33}$",
      "$\\sqrt{34}$",
      "$\\sqrt{35}$"
    ],
    "answer": "①",
    "solution": "조건·목표: 정삼각형 OAB의 단위벡터 u=OA, v=OB와 주어진 내적에서 |u-x|를 구한다.\n전략: u,v가 이루는 각은 60°이고 서로 평행하지 않으므로 x=ku+lv (k,l은 실수)로 유일하게 나타낼 수 있다.\n풀이 ① |u|=|v|=1, u·v=cos60°=1/2이다.\n풀이 ② x·u=k(u·u)+l(v·u)=k+l/2=3이다. 같은 방식으로 x·v=k/2+l=6이다.\n풀이 ③ 첫 식에서 k=3-l/2, 둘째 식에 대입하면 (3-l/2)/2+l=6이므로 l=6, k=0이다. 따라서 x=6v이다.\n풀이 ④ |u-x|²=|u-6v|²=|u|²+36|v|²-12(u·v)=1+36-6=31이다.\n보기 확인: |u-x|=√31은 ①이다.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "내적",
    "standardUnitKey": "H15-GV-06",
    "subUnitKey": null,
    "primaryMethod": "위치벡터와 내적",
    "decisiveStep": "두 내적 연립해 x=6OB",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "내적",
      "l4": "내적 계산",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 4,
    "sourceQid": 15,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 16,
    "questionType": "단답형",
    "content": "[단답형 1] 그림과 같이 한 모서리의 길이가 4인 정육면체 $\\mathrm{ABCD-EFGH}$가 있다. 선분 $\\mathrm{AD}$의 중점이 $\\mathrm{M}$이고 평면 $\\mathrm{MEG}$와 평면 $\\mathrm{EFGH}$가 이루는 각을 $\\theta$라 할 때, $30\\cos\\theta$값을 구하시오. [5점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q16.png\" class=\"exam-img\" alt=\"정육면체 ABCD EFGH와 AD 중점 M, 평면 MEG\"></div>",
    "choices": [],
    "answer": "10",
    "solution": "조건·목표: 한 변 4인 정육면체에서 MEG 평면과 밑면 EFGH 사이의 각 θ에 대해 30cosθ를 구한다.\n전략: 두 평면의 교선 EG에 수직인 단면에서 이면각을 직각삼각형의 각으로 바꾼다.\n풀이 ① 밑면을 z=0으로 두고 E=(0,0,0), G=(4,4,0), M=(0,2,4)로 잡는다. M에서 밑면으로 내린 수선의 발은 M′=(0,2,0)이다.\n풀이 ② EG의 방정식은 y=x이다. M′에서 EG에 내린 수선의 발을 T라 하면 TM′=|0-2|/√2=√2이다.\n풀이 ③ MM′=4이고 MM′⊥밑면이므로 △TMM′은 M′에서 직각이다. 따라서 TM=√((√2)²+4²)=√18=3√2이다.\n풀이 ④ EG에 수직인 단면에서 θ=∠MTM′이다. 그러므로 cosθ=TM′/TM=√2/(3√2)=1/3.\n결론: 30cosθ=30×1/3=10이다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "이면각",
    "standardUnitKey": "H15-GV-08",
    "subUnitKey": null,
    "primaryMethod": "두 평면 이면각",
    "decisiveStep": "EG에 수직인 단면의 높이와 거리",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "이면각",
      "l4": "이면각",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 16,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING",
    "solutionImage": "assets/images/22_매산고_1학기_기말_고2_기하/q16-solution.svg"
  },
  {
    "id": 17,
    "questionType": "단답형",
    "content": "[단답형 2] 초점이 $\\mathrm{F}$인 포물선 $y^2=4x$ 위에 서로 다른 두 점 $\\mathrm{A, B}$가 있다. 두 점 $\\mathrm{A, B}$의 $x$좌표는 1보다 큰 자연수이고 삼각형 $\\mathrm{AFB}$의 무게중심의 $x$좌표가 4일 때, $\\overline{\\mathrm{AF}} \\times \\overline{\\mathrm{BF}}$의 최댓값을 구하시오. [5점]",
    "choices": [],
    "answer": "42",
    "solution": "조건·목표: 포물선 y²=4x 위의 서로 다른 A,B에 대해 AF×BF의 최댓값을 구한다. 두 점의 x좌표는 1보다 큰 자연수이다.\n전략: 초점까지 거리와 무게중심 조건을 이용해 두 자연수의 합을 고정한다.\n풀이 ① 포물선 y²=4x의 초점은 F=(1,0), 준선은 x=-1이다. 포물선 위의 점 (m,y)는 초점까지의 거리가 준선까지의 거리 m+1과 같다.\n풀이 ② A,B의 x좌표를 m,n이라 두면 m,n은 각각 2 이상의 자연수이다. △AFB의 무게중심 x좌표가 4이므로 (m+n+1)/3=4, 즉 m+n=11이다.\n풀이 ③ AF×BF=(m+1)(n+1)=mn+(m+n)+1=mn+12이다. 합 m+n=11이 일정할 때 곱 mn은 두 수가 가까울수록 크다.\n풀이 ④ 자연수 m,n≥2에서 가능한 가장 가까운 쌍은 5와 6이고, mn=30이다. 따라서 최댓값은 30+12=42이다.\n풀이 ⑤ x좌표가 서로 다른 5와 6인 점들을 포물선에서 선택할 수 있으므로 A≠B 조건도 충족한다.\n따라서 정답은 42이다.",
    "standardCourse": "기하",
    "standardUnit": "이차곡선",
    "subUnit": "포물선",
    "standardUnitKey": "H15-GV-01",
    "subUnitKey": null,
    "primaryMethod": "포물선 초점거리와 정수 최적화",
    "decisiveStep": "m+n=11에서 (m+1)(n+1) 최대",
    "rpmPrimary": {
      "majorUnit": "이차곡선",
      "l3": "포물선",
      "l4": "초점·준선",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 17,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 18,
    "questionType": "단답형",
    "content": "[단답형 3] 좌표평면 위의 네 점 $\\mathrm{O, A, B, P}$은 다음 조건을 만족한다.<br><br><div class=\"exam-box\">(가) $|\\vec{\\mathrm{OP}}|=5$, $|\\vec{\\mathrm{AB}}|=2$<br>(나) 두 점 $\\mathrm{A, B}$은 직선 $l$을 지난다.<br>(다) $\\vec{\\mathrm{OP}} \\cdot \\vec{\\mathrm{AB}}=0$, $\\vec{\\mathrm{OP}} \\cdot \\vec{\\mathrm{OA}}=-15$</div><br>삼각형 $\\mathrm{ABP}$의 넓이를 구하시오. [5점]",
    "choices": [],
    "answer": "8",
    "solution": "조건·목표: AB의 길이가 2이고 OP⊥AB일 때, 내적 조건으로 P에서 직선 AB까지의 거리를 구해 △ABP의 넓이를 계산한다.\n전략: OP 방향을 단위벡터로 잡으면 A와 P의 OP 방향 성분 차가 곧 높이가 된다.\n풀이 ① u=OP/|OP|=OP/5라 두면 |u|=1이다. OP·AB=0이므로 u·AB=0이고, 직선 AB는 u와 수직이다.\n풀이 ② OP·OA=-15에서 u·OA=(-15)/5=-3이다. 또 u·OP=|OP|=5이다.\n풀이 ③ A에서 P까지의 벡터는 AP=OP-OA이므로 u·AP=5-(-3)=8이다. AB가 u에 수직이므로 |u·AP|=8은 P에서 직선 AB까지의 수직거리이다.\n풀이 ④ △ABP의 넓이는 (1/2)×|AB|×높이=(1/2)×2×8=8이다.\n따라서 정답은 8이다.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "도형에의 활용",
    "standardUnitKey": "H15-GV-06",
    "subUnitKey": null,
    "primaryMethod": "내적과 삼각형 넓이",
    "decisiveStep": "OP방향 정사영으로 높이 8",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "도형에의 활용",
      "l4": "거리·넓이",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 18,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "[서술형 1] 사면체 $\\mathrm{ABCD}$에 대하여 $\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AC}}=4, \\overline{\\mathrm{AD}}=8, \\overline{\\mathrm{BD}}=\\overline{\\mathrm{CD}}, \\angle\\mathrm{ABD}=90^\\circ$이고 평면 $\\mathrm{ABD}$와 평면 $\\mathrm{ACD}$가 이루는 각이 $60^\\circ$이다. 직선 $\\mathrm{AD}$와 평면 $\\mathrm{DBC}$이 이루는 각을 $\\theta$라 할 때, $\\cos\\theta$의 값을 구하시오. [10점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q19-repaired.svg\" class=\"exam-img\" alt=\"사면체 ABCD와 두 평면 ABD ACD\"></div>",
    "choices": [],
    "answer": "2√5/5",
    "solution": "조건·목표: 직선 AD와 평면 DBC가 이루는 예각 θ의 cosθ를 구한다.\n전략: △ABD의 직각 조건과 AD를 축으로 하는 두 평면의 이면각을 이용해 사면체 부피와 △DBC의 넓이를 구한다.\n풀이 ① △ABD는 B에서 직각이므로 BD²=AD²-AB²=8²-4²=48, BD=4√3이다. AB=AC, BD=CD이므로 B,C는 AD축에서 같은 거리의 원 위에 있다.\n풀이 ② A에서 AD방향으로 B의 정사영 길이는 (AB²+AD²-BD²)/(2AD)=(16+64-48)/16=2이다. 따라서 AD축에서 B,C까지의 거리는 √(AB²-2²)=2√3이다.\n풀이 ③ 평면 ABD와 ACD의 이면각 60°에서 B,C의 축둘레 중심각이 60°이므로 BC=2(2√3)sin30°=2√3이다. C에서 평면 ABD까지의 높이는 2√3sin60°=3이다.\n풀이 ④ △ABD 넓이는 (1/2)×AB×BD=8√3이므로 사면체 부피 V=(1/3)×8√3×3=8√3이다.\n풀이 ⑤ △DBC에서 BD=CD=4√3, BC=2√3이므로 BC에 내린 높이는 √((4√3)²-(√3)²)=3√5, 넓이는 (1/2)×2√3×3√5=3√15이다.\n풀이 ⑥ AD와 평면 DBC 사이의 각 θ에 대해 3V=AD×[△DBC 넓이]×sinθ이므로 sinθ=(3×8√3)/(8×3√15)=1/√5이다.\n결론: θ는 예각이므로 cosθ=√(1-1/5)=2√5/5이다.",
    "standardCourse": "기하",
    "standardUnit": "공간도형과 공간좌표",
    "subUnit": "이면각",
    "standardUnitKey": "H15-GV-08",
    "subUnitKey": null,
    "primaryMethod": "사면체 부피와 직선·평면의 각",
    "decisiveStep": "3V=AD·S_DBC·sinθ",
    "rpmPrimary": {
      "majorUnit": "공간도형과 공간좌표",
      "l3": "이면각",
      "l4": "공간에서의 각",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 5,
    "sourceQid": 19,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  },
  {
    "id": 20,
    "questionType": "서술형",
    "content": "[서술형 2] 같은 평면위의 네 점 $\\mathrm{A, B, O, P}$에 대하여 $\\overline{\\mathrm{AB}}=8$, 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{O}$, 선분 $\\mathrm{AB}$를 지름으로 하는 반원 위의 한 점을 $\\mathrm{P}$, 선분 $\\mathrm{AO}$를 지름으로 하는 반원 위의 점을 $\\mathrm{Q}$라 하자. $\\angle\\mathrm{ABP}=30^\\circ$일 때, $\\vec{\\mathrm{AQ}} \\cdot \\vec{\\mathrm{BP}}$의 최솟값과 최댓값을 구하시오. [10점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/22_매산고_1학기_기말_고2_기하/q20-repaired.svg\" class=\"exam-img\" alt=\"지름 AB와 AO인 두 반원 및 점 P Q\"></div>",
    "choices": [],
    "answer": "최솟값 -24, 최댓값 -12+8√3",
    "solution": "조건·목표: 두 반원 위의 P,Q에 대해 AQ·BP의 최솟값과 최댓값을 구한다.\n전략: 반원들을 좌표평면에 놓고 Q를 삼각함수로 나타내어 내적의 범위를 계산한다.\n풀이 ① A=(0,0), O=(4,0), B=(8,0)으로 둔다. AB가 지름이므로 ∠APB=90°이다. ∠ABP=30°이므로 BP=8cos30°=4√3이고, P=(2,2√3), BP=(-6,2√3)이다.\n풀이 ② AO를 지름으로 하는 위쪽 반원의 중심은 (2,0), 반지름은 2이다. Q=(2+2cos t,2sin t), 0≤t≤π로 놓으면 AQ=(2+2cos t,2sin t)이다.\n풀이 ③ AQ·BP=(2+2cos t)(-6)+(2sin t)(2√3)=-12-12cos t+4√3sin t이다.\n풀이 ④ -12cos t+4√3sin t=8√3sin(t-π/3)으로 쓸 수 있다. 0≤t≤π에서 최대 8√3은 t=5π/6에서 얻는다. 따라서 최대 내적은 -12+8√3이다.\n풀이 ⑤ 같은 구간에서 sin(t-π/3)의 최소는 t=0에서 -√3/2이므로 내적 최솟값은 -12-12=-24이다.\n결론: 최솟값 -24, 최댓값 -12+8√3이다.",
    "standardCourse": "기하",
    "standardUnit": "평면벡터",
    "subUnit": "내적",
    "standardUnitKey": "H15-GV-06",
    "subUnitKey": null,
    "primaryMethod": "벡터 내적의 극값",
    "decisiveStep": "반원 매개화 후 삼각함수의 최댓값·끝점",
    "rpmPrimary": {
      "majorUnit": "평면벡터",
      "l3": "내적",
      "l4": "내적 계산",
      "semanticSourceScope": "RPM_H15_GEO",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/기하.md",
      "canonicalSourceGitBlobSha": "a476c36dee0a637160b4095226e56f32e2479e86"
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 5,
    "sourceQid": 20,
    "provenance": {
      "examUid": "22_매산고_1학기_기말_고2_기하",
      "sourceSha256": "836070651676aac4ea108811a5cd9ae0d8da148db66ea4def0a7b5c195bb05c8"
    },
    "metaStatus": "RPM_ONLY_NO_ACTIVE_MAPPING"
  }
];
