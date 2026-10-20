window.examTitle = "22_팔마고_1학기_기말_고2_수학I";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "다음 식을 간단히 하면? [3.5점]<br><br>$$\\sqrt{3}\\sin\\left(\\frac{5}{3}\\pi\\right) + \\sqrt{3}\\tan\\left(\\frac{7}{3}\\pi\\right) - 2\\cos\\left(\\frac{\\pi}{2}\\right)$$",
    "choices": [
      "$-\\frac{1}{2}$",
      "$0$",
      "$\\frac{3}{2}$",
      "$1$",
      "$\\sqrt{3}$"
    ],
    "answer": "③",
    "solution": "조건·목표: $\\sqrt3\\sin(5\\pi/3)+\\sqrt3\\tan(7\\pi/3)-2\\cos(\\pi/2)$를 계산한다.\n전략: 주기성과 단위원의 특수각 값을 각각 적용한다.\n풀이: $\\sin(5\\pi/3)=-\\sqrt3/2$, $\\tan(7\\pi/3)=\\tan(\\pi/3)=\\sqrt3$, $\\cos(\\pi/2)=0$. 따라서 $\\sqrt3(-\\sqrt3/2)+\\sqrt3(\\sqrt3)-0=-3/2+3=3/2$.\n보기 판단: ③ $3/2$만 일치한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수",
    "standardUnitKey": "H15-M1-05",
    "subUnitKey": "H15-M1-05-TRIGONOMETRIC_RELATION",
    "primaryMethod": "삼각함수 특수각",
    "decisiveStep": "sin5π/3=-√3/2, tan7π/3=√3",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수",
      "l3": "삼각함수의 성질",
      "l4": "삼각함수 관계",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-034",
      "crosswalk2022RecordId": "H2-M1-RPM-100",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-05",
        "subUnitKey": "H15-M1-05-TRIGONOMETRIC_RELATION"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 1,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "다음 그림과 같은 삼각형 $\\mathrm{ABC}$의 넓이는? [3.6점]<br><br><img src=\"assets/images/22_팔마고_1학기_기말_고2_수학I/q02.png\" class=\"question-img\">",
    "choices": [
      "$1$",
      "$\\sqrt{2}$",
      "$2$",
      "$3$",
      "$2\\sqrt{2}$"
    ],
    "answer": "④",
    "solution": "조건 확인: 그림에서 $AC=3$, $BC=2\\sqrt2$, 두 변 사이의 각 $\\angle ACB=45^\\circ$이다. 구하려는 것은 삼각형의 넓이이다.\n전략: 밑변을 $BC$로 놓으면 높이는 $AC\\sin45^\\circ$이다. 그래서 두 변과 끼인각을 알 때 $S=\\frac12 ab\\sin C$를 쓴다.\n계산: 높이 $h=3\\cdot\\frac{\\sqrt2}{2}=\\frac{3\\sqrt2}{2}$, 따라서\n$S=\\frac12\\cdot BC\\cdot h=\\frac12\\cdot2\\sqrt2\\cdot\\frac{3\\sqrt2}{2}=3$.\n확인: $45^\\circ$는 두 변이 이루는 각이며, 다른 각의 사인을 넣지 않는다. 보기 ①,②,③,⑤는 넓이 3과 다르다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "두 변과 끼인각 넓이",
    "decisiveStep": "(1/2)*3*2√2*sin45=3",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "삼각형의 넓이",
      "l4": "두 변과 끼인각",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-047",
      "crosswalk2022RecordId": "H2-M1-RPM-113",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": null,
        "subUnitKey": null
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-05",
        "subUnitKey": "H22-A-05-CORE"
      }
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
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "함수 $y = \\tan 2x$의 주기를 $a$, 점근선을 $x = b$라 할 때, $\\frac{b}{a}$의 값은? (단, $0 \\le x \\le \\frac{\\pi}{2}$) [3.7점]",
    "choices": [
      "$\\frac{\\pi}{8}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{\\pi}$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "조건·목표: $y=\\tan2x$의 주기 $a$와 $0\\le x\\le\\pi/2$에서의 점근선 $x=b$를 구한다.\n전략: $\\tan t$의 주기는 $\\pi$, 점근선은 $t=\\pi/2+k\\pi$이다.\n풀이: $2x$의 주기는 $\\pi$이므로 $a=\\pi/2$. 점근선은 $2x=\\pi/2+k\\pi$에서 $x=\\pi/4+k\\pi/2$. 주어진 구간 안에는 $b=\\pi/4$만 있다. 따라서 $b/a=(\\pi/4)/(\\pi/2)=1/2$.\n보기 판단: ② $1/2$만 일치한다. 정답 ②.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 그래프",
    "standardUnitKey": "H15-M1-06",
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "primaryMethod": "탄젠트 주기와 점근선",
    "decisiveStep": "a=π/2,b=π/4",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 그래프",
      "l3": "기본 그래프",
      "l4": "tan",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-038",
      "crosswalk2022RecordId": "H2-M1-RPM-104",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-06",
        "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_GRAPH"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 3,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP",
    "metaNullReason": "RPM crosswalk DIRECT_BINDING_GAP: ACTIVE candidate PT_FUNCTION_GRAPH_PROPERTIES/TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT in FUNCTIONS_GRAPHS, but exact 2015 수학I curriculum L1/L2 binding 0 across 11 ACTIVE owner packs. Do not project as bound or invent alias."
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "제2항이 8, 제6항이 24인 등차수열 $\\{a_n\\}$의 제10항의 값은? [3.8점]",
    "choices": [
      "$32$",
      "$34$",
      "$36$",
      "$40$",
      "$42$"
    ],
    "answer": "④",
    "solution": "조건·목표: $a_2=8$, $a_6=24$인 등차수열의 $a_{10}$을 구한다.\n전략: 항 번호가 4 차이이므로 $4d=a_6-a_2$이다.\n풀이: $4d=24-8=16$에서 $d=4$. 따라서 $a_{10}=a_6+4d=24+16=40$.\n보기 판단: ④ 40만 일치한다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE",
    "primaryMethod": "등차 일반항",
    "decisiveStep": "4d=16",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등차수열",
      "l4": "일반항",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-049",
      "crosswalk2022RecordId": "H2-M1-RPM-115",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 4,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "세 수 $a, 1, b$는 이 순서대로 등차수열을 이루고, 세 수 $a-b, 8, a+b$는 이 순서대로 등비수열을 이룰 때, $|a|+|b|$의 값은? [3.9점]",
    "choices": [
      "$18$",
      "$24$",
      "$28$",
      "$32$",
      "$36$"
    ],
    "answer": "④",
    "solution": "조건·목표: $a,1,b$가 등차이고 $a-b,8,a+b$가 등비일 때 $|a|+|b|$를 구한다.\n전략: 등차중항으로 합을, 등비중항으로 제곱식의 차를 얻는다.\n풀이: $a+b=2$. $(a-b)(a+b)=8^2=64$이므로 $a-b=32$. 연립하면 $a=17$, $b=-15$. 따라서 $|a|+|b|=17+15=32$.\n보기 판단: ④ 32만 일치한다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "등차·등비중항 결합",
    "decisiveStep": "a+b=2,a-b=32",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "수열의 활용",
      "l4": "조건으로 수열 결정",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-055",
      "crosswalk2022RecordId": "H2-M1-RPM-121",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-SEQUENCE_TERM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_APPLICATION"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 5,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "다음 중 함수 $y = -2\\cos(2x+\\pi) + 3$에 대한 설명으로 옳지 <u>않은</u> 것은? [3.9점]",
    "choices": [
      "주기는 $\\pi$이다.",
      "최댓값은 5, 최솟값은 1이다.",
      "그래프는 함수 $y=-2\\cos 2x$의 그래프를 $x$축의 방향으로 $-\\frac{\\pi}{2}$만큼, $y$축의 방향으로 3만큼 평행이동한 것과 같다.",
      "그래프는 직선 $x=\\frac{\\pi}{2}$에 대하여 대칭이다.",
      "그래프는 점 $(0, 1)$을 지난다."
    ],
    "answer": "⑤",
    "solution": "조건 확인: $y=-2\\cos(2x+\\pi)+3=2\\cos2x+3$이다. $\\cos(t+\\pi)=-\\cos t$를 먼저 적용하면 보기를 쉽게 판정할 수 있다.\n① $\\cos2x$의 주기는 $\\pi$이므로 참이다.\n② $-1\\le\\cos2x\\le1$이므로 $1\\le y\\le5$이다. 최솟값 1, 최댓값 5이므로 참이다.\n③ 원래 식을 $-2\\cos\\{2(x+\\pi/2)\\}+3$으로 쓰면 $y=-2\\cos2x$를 왼쪽 $\\pi/2$, 위쪽 3만큼 옮긴 그래프이므로 참이다.\n④ 대칭축을 직접 확인한다. $x=\\pi/2\\pm t$에서 $y=2\\cos(\\pi\\pm2t)+3=3-2\\cos2t$로 값이 같으므로 $x=\\pi/2$에 대하여 대칭이다. 참이다.\n⑤ $x=0$이면 $y=2\\cos0+3=5$이다. 따라서 $(0,1)$을 지난다는 설명은 거짓이다.\n결론: 옳지 않은 보기 하나는 ⑤이다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 그래프",
    "standardUnitKey": "H15-M1-06",
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "primaryMethod": "삼각함수 그래프 변환",
    "decisiveStep": "x=0에서 y=5",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 그래프",
      "l3": "그래프 변환",
      "l4": "주기·진폭",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-039",
      "crosswalk2022RecordId": "H2-M1-RPM-105",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-06",
        "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_GRAPH"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 6,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP",
    "metaNullReason": "RPM crosswalk DIRECT_BINDING_GAP: ACTIVE candidate PT_FUNCTION_GRAPH_TRANSFORM/TPL_FUNCTION_GRAPH_TRANSLATION in FUNCTIONS_GRAPHS, but exact 2015 수학I curriculum L1/L2 binding 0 across 11 ACTIVE owner packs. Do not project as bound or invent alias."
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "함수 $y = a\\cos b\\pi(x-2) + c$의 그래프가 다음 그림과 같을 때, $a+2b-c$의 값은? (단, $a>0, b>0, c>0$) [4.0점]<br><br><img src=\"assets/images/22_팔마고_1학기_기말_고2_수학I/q07.png\" class=\"question-img\">",
    "choices": [
      "$2$",
      "$1$",
      "$0$",
      "$-1$",
      "$-2$"
    ],
    "answer": "①",
    "solution": "그림 읽기: $x=2$에서 최고 높이 3, $x=0$과 $x=4$에서 최저 높이 $-1$이다. 점선은 최고·최저 높이를 나타낸다.\n진폭과 중심선: $a>0$이므로 $a=\\frac{3-(-1)}2=2$, $c=\\frac{3+(-1)}2=1$이다. 따라서 $y=2\\cos\\{b\\pi(x-2)\\}+1$이다.\n주기: 연속한 최저점의 $x$좌표가 0과 4이므로 주기는 $T=4$이다. $\\cos(b\\pi x)$의 주기는 $\\frac{2\\pi}{b\\pi}=\\frac2b$이므로 $\\frac2b=4$, $b=\\frac12$이다.\n그림 검산: $x=2$에서는 $\\cos0=1$로 $y=3$이고, $x=0,4$에서는 $\\cos(\\mp\\pi)=-1$로 $y=-1$이다.\n결론: $a+2b-c=2+1-1=2$. 보기 ①이다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 그래프",
    "standardUnitKey": "H15-M1-06",
    "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH",
    "primaryMethod": "진폭·주기·중심선",
    "decisiveStep": "a=2,b=1/2,c=1",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 그래프",
      "l3": "그래프 변환",
      "l4": "주기·진폭",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-039",
      "crosswalk2022RecordId": "H2-M1-RPM-105",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-06",
        "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_GRAPH"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 7,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP",
    "metaNullReason": "RPM crosswalk DIRECT_BINDING_GAP: ACTIVE candidate PT_FUNCTION_GRAPH_TRANSFORM/TPL_FUNCTION_GRAPH_TRANSLATION in FUNCTIONS_GRAPHS, but exact 2015 수학I curriculum L1/L2 binding 0 across 11 ACTIVE owner packs. Do not project as bound or invent alias."
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "$0 \\le x < 2\\pi$일 때, 방정식 $\\sin x = \\frac{1}{3}$의 두 근을 $\\alpha, \\beta$라고 하자. $\\sin\\left(\\frac{\\alpha+\\beta}{2} + \\frac{\\pi}{3}\\right)$의 값은? [4.1점]",
    "choices": [
      "$-\\frac{\\sqrt{3}}{2}$",
      "$-\\frac{1}{2}$",
      "$1$",
      "$\\frac{1}{2}$",
      "$\\frac{\\sqrt{3}}{2}$"
    ],
    "answer": "④",
    "solution": "조건·목표: $0\\le x<2\\pi$에서 $\\sin x=1/3$의 두 해 $\\alpha,\\beta$로 주어진 사인값을 구한다.\n전략: 양의 사인값의 두 해는 제1·2사분면에서 서로 보각이다.\n풀이: $\\alpha+\\beta=\\pi$이므로 $(\\alpha+\\beta)/2+\\pi/3=\\pi/2+\\pi/3=5\\pi/6$. 따라서 $\\sin(5\\pi/6)=1/2$.\n보기 판단: ④ $1/2$만 일치한다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수",
    "standardUnitKey": "H15-M1-07",
    "subUnitKey": "H15-M1-07-TRIGONOMETRIC_EQUATION",
    "primaryMethod": "삼각방정식의 두 해의 보각 관계",
    "decisiveStep": "0≤x<2π의 두 해는 α+β=π",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수",
      "l3": "삼각방정식·부등식",
      "l4": "주기 구간의 해",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-036",
      "crosswalk2022RecordId": "H2-M1-RPM-102",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-05",
        "subUnitKey": "H15-M1-05-TRIGONOMETRIC_RELATION"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 8,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I exact ACTIVE binding 0 across 11 packs; RPM semantic and current crosswalk independently checked; do not invent PT/TPL."
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "두 대각선이 이루는 각의 크기가 $\\frac{2}{3}\\pi$이고 넓이가 $4\\sqrt{3}$인 등변사다리꼴의 대각선의 길이는? [4.2점]",
    "choices": [
      "$3$",
      "$\\frac{4\\sqrt{3}}{3}$",
      "$4$",
      "$4\\sqrt{2}$",
      "$5$"
    ],
    "answer": "③",
    "solution": "조건 확인: 등변사다리꼴의 두 대각선 길이는 서로 같고, 그 사이 각은 $120^\\circ$이다. 넓이는 $4\\sqrt3$이다.\n전략: 대각선의 교점을 $O$라 하자. 사각형의 넓이는 교점에서 생기는 네 삼각형의 넓이를 더해 $\\frac12\\,AC\\cdot BD\\sin\\theta$로 쓸 수 있다. 실제로 $AO+OC=AC$, $BO+OD=BD$이고 각의 사인은 $\\sin\\theta$ 또는 $\\sin(180^\\circ-\\theta)$로 같다.\n계산: 두 대각선의 공통 길이를 $d>0$이라 하면\n$4\\sqrt3=\\frac12d^2\\sin120^\\circ=\\frac12d^2\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt3}{4}d^2$.\n따라서 $d^2=16$이고 길이는 양수이므로 $d=4$이다.\n결론: ③만 4와 일치한다. 각이 둔각이어도 사인값은 양수임에 주의한다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "대각선과 사인 넓이",
    "decisiveStep": "4√3=d²√3/4",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "삼각형의 넓이",
      "l4": "복합도형",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-048",
      "crosswalk2022RecordId": "H2-M1-RPM-114",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": null,
        "subUnitKey": null
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-05",
        "subUnitKey": "H22-A-05-CORE"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 9,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합 $S_n$이<br><br>$$S_n = 2n^2 - n + 8$$<br><br>일 때, $a_1 + a_3$의 값은? [4.3점]",
    "choices": [
      "$10$",
      "$11$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "④",
    "solution": "조건 확인: $S_n$은 첫째항부터 제$n$항까지의 합이다. 첫째항은 반드시 $a_1=S_1$이고, $n\\ge2$에서만 $a_n=S_n-S_{n-1}$을 쓴다.\n첫째항: $a_1=S_1=2(1)^2-1+8=9$.\n셋째항: $S_3=2(3)^2-3+8=23$, $S_2=2(2)^2-2+8=14$이므로 $a_3=S_3-S_2=23-14=9$.\n검산: $a_2=S_2-S_1=14-9=5$이고 $9+5+9=23=S_3$이다.\n결론: $a_1+a_3=9+9=18$, 보기 ④. $S_0$을 주어진 다항식에 대입해 $a_1$을 구하면 잘못되므로 주의한다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "부분합에서 항 추출",
    "decisiveStep": "a1=S1,a3=S3-S2",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "수열의 활용",
      "l4": "조건으로 수열 결정",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-055",
      "crosswalk2022RecordId": "H2-M1-RPM-121",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-SEQUENCE_TERM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_APPLICATION"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 10,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "등비수열 $\\{a_n\\}$에서<br><br>$$\\begin{aligned} a_1 + a_2 + a_3 + \\cdots + a_{10} &= 4 \\\\ a_{11} + a_{12} + a_{13} + \\cdots + a_{20} &= 36 \\end{aligned}$$<br><br>일 때, $a_1 + a_2 + a_3 + \\cdots + a_{30}$의 값은? [4.4점]",
    "choices": [
      "$268$",
      "$320$",
      "$364$",
      "$386$",
      "$402$"
    ],
    "answer": "③",
    "solution": "조건·목표: 등비수열의 첫 10항 합이 4, 다음 10항 합이 36일 때 첫 30항 합을 구한다.\n전략: 등비수열에서 같은 길이의 연속 구간합은 공통 비 $r^{10}$을 가진다.\n풀이: 둘째 구간합/첫째 구간합 $=36/4=9$이므로 $r^{10}=9$. 셋째 구간합은 $36\\cdot9=324$이다. 따라서 $S_{30}=4+36+324=364$.\n보기 판단: ③ 364만 일치한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비수열 블록 합",
    "decisiveStep": "연속 10항 블록 비 9",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "합",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-054",
      "crosswalk2022RecordId": "H2-M1-RPM-120",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-09",
        "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_BASIC"
      }
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
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "반지름의 길이가 4인 원에 내접하는 삼각형 $\\mathrm{ABC}$에서 $A=45^\\circ, B=60^\\circ$일 때, 선분 $\\mathrm{AB}$의 길이는? [4.4점]",
    "choices": [
      "$2\\sqrt{2} + 2\\sqrt{6}$",
      "$2\\sqrt{2} + \\sqrt{3}$",
      "$\\sqrt{2} + 2\\sqrt{3}$",
      "$4$",
      "$4\\sqrt{6} - \\sqrt{2}$"
    ],
    "answer": "①",
    "solution": "조건 확인: $A=45^\\circ$, $B=60^\\circ$, 외접원 반지름 $R=4$이다. $AB$는 각 $C$의 맞은편 변이다.\n전략: $C=180^\\circ-45^\\circ-60^\\circ=75^\\circ$이지만, 아직 배우지 않은 삼각함수 덧셈정리 없이 **사인법칙과 코사인법칙**만으로 $AB$를 구한다.\n① 사인법칙 $\\frac{BC}{\\sin A}=\\frac{CA}{\\sin B}=2R=8$에서\n$BC=8\\sin45^\\circ=4\\sqrt2$, $CA=8\\sin60^\\circ=4\\sqrt3$이다.\n② $AB=x>0$이라 놓고, 끼인각 $B=60^\\circ$에 코사인법칙을 쓴다. $CA^2=BC^2+AB^2-2\\cdot BC\\cdot AB\\cos B$이므로\n$48=32+x^2-2(4\\sqrt2)x\\cdot\\frac12=32+x^2-4\\sqrt2x$.\n③ $x^2-4\\sqrt2x-16=0$을 근의 공식으로 풀면\n$x=\\frac{4\\sqrt2\\pm\\sqrt{(4\\sqrt2)^2+64}}2=\\frac{4\\sqrt2\\pm4\\sqrt6}2=2\\sqrt2\\pm2\\sqrt6$.\n길이는 양수이므로 $x=2\\sqrt2+2\\sqrt6$만 가능하다.\n결론: 보기 ①이다. $75^\\circ$의 덧셈공식을 외우지 않아도 해결할 수 있다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "사인법칙으로 두 변→코사인법칙으로 AB",
    "decisiveStep": "48=32+x²-4√2x, x=2√2+2√6",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "코사인법칙",
      "l4": "변·각 계산",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-045",
      "crosswalk2022RecordId": "H2-M1-RPM-111",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": null,
        "subUnitKey": null
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-05",
        "subUnitKey": "H22-A-05-CORE"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 12,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I exact ACTIVE binding 0 across 11 packs; RPM semantic and current crosswalk independently checked; do not invent PT/TPL."
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "첫째항이 1, 공차가 1인 등차수열이 있다. 첫 번째 시행에서 이 수열의 짝수 번째 항을 지우고, 두 번째 시행에서 첫 번째 시행 후 남은 수열의 짝수 번째 항을 지운다. 이와 같은 시행을 반복할 때, 9번째 시행 후 남은 수열의 제2항의 값은? [4.5점]",
    "choices": [
      "$257$",
      "$258$",
      "$513$",
      "$514$",
      "$625$"
    ],
    "answer": "③",
    "solution": "조건 확인: 최초 수열은 $1,2,3,\\ldots$이다. 매 시행마다 현재 남아 있는 수열의 **짝수 번째 위치**를 지운다. 원래 수의 짝수 여부를 매번 검사하는 것이 아니다.\n한 번 시행: $1,3,5,\\ldots$가 남으므로 $j$번째 항은 $1+2(j-1)$이다.\n두 번 시행: 위 수열의 홀수 번째 항만 남아 $1,5,9,\\ldots$이고 $j$번째 항은 $1+4(j-1)$이다.\n반복 규칙: $k$번 시행 뒤 $j$번째 항이 $1+2^k(j-1)$이라 가정하자. 다음 시행 뒤 새 $j$번째 항은 이전 수열의 $(2j-1)$번째 항이므로\n$1+2^k\\{(2j-1)-1\\}=1+2^{k+1}(j-1)$이다. 따라서 간격이 매번 2배가 됨이 확인된다.\n9번째 시행 뒤 제2항은 $1+2^9(2-1)=1+512=513$이다.\n결론: ③ 513이다. 시행 횟수 9와 제2항의 위치 2를 혼동하지 않는다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "반복 소거 위치 패턴",
    "decisiveStep": "9회 뒤 원래 위치 1+512",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "수열의 활용",
      "l4": "귀납적 패턴",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-056",
      "crosswalk2022RecordId": "H2-M1-RPM-122",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-SEQUENCE_TERM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_APPLICATION"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_ITERATION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 13,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "태블릿PC를 구입하기 위하여 이달 초부터 매달 초에 일정한 금액을 적립하여 12개월 말까지 756000원을 마련하려고 한다. 월이율 $0.8\\%$, 1개월마다 복리로 적립할 때, 매달 초에 얼마씩 적립해야 하는가? (단, $1.008^{12} = 1.1$로 계산한다.) [4.5점]",
    "choices": [
      "$48000\\text{원}$",
      "$50000\\text{원}$",
      "$55000\\text{원}$",
      "$58000\\text{원}$",
      "$60000\\text{원}$"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 월초마다 같은 금액 $P$를 12번 넣고 매달 0.8% 복리로 12개월 말에 756000원을 만들려고 한다.\n전략: 첫 납입금은 12개월, 마지막 납입금은 1개월 이자가 붙는다. 공비 $r=1.008$인 등비합을 사용한다.\n풀이: $756000=P(r+r^2+\\cdots+r^{12})=P\\,r(r^{12}-1)/(r-1)$. $r^{12}=1.1$이므로 계수는 $1.008(0.1)/(0.008)=12.6$. 따라서 $P=756000/12.6=60000$원.\n보기 판단: ⑤ 60000원만 일치한다. 정답 ⑤.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비합 복리",
    "decisiveStep": "P*r(r^12-1)/(r-1)=756000",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "합",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-054",
      "crosswalk2022RecordId": "H2-M1-RPM-120",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-09",
        "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_BASIC"
      }
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
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "양수 $a$와 자연수 $n$에 대하여 $x$에 대한 이차방정식<br><br>$$ax^2 - n(n-1)x + n(n^2 - 5) = 0$$<br><br>의 두 근을 $a_n, b_n$이라 하자. $\\sum_{k=1}^{10} (a_k + b_k) = 33$일 때, $\\sum_{k=1}^{10} a_k b_k$의 값은? [4.5점]",
    "choices": [
      "$225$",
      "$250$",
      "$275$",
      "$300$",
      "$330$"
    ],
    "answer": "③",
    "solution": "조건 확인: $a>0$이고 각 $n$에 대한 이차방정식의 두 근을 $a_n,b_n$이라 한다. 두 근이 모두 실수일 필요는 없다. 근과 계수의 관계는 복소근에도 성립한다.\n전략: 두 근의 합 $a_n+b_n=\\frac{n(n-1)}a$로 미지수 $a$를 먼저 결정한 뒤, 두 근의 곱 $a_nb_n=\\frac{n(n^2-5)}a$를 합한다.\n① $\\sum_{n=1}^{10}(a_n+b_n)=\\frac1a\\sum_{n=1}^{10}(n^2-n)=\\frac{385-55}{a}=\\frac{330}{a}=33$이므로 $a=10$이다.\n② $\\sum_{n=1}^{10}a_nb_n=\\frac1{10}\\sum_{n=1}^{10}(n^3-5n)=\\frac1{10}(3025-5\\cdot55)=\\frac{2750}{10}=275$이다.\n③ 검산: 각 $n$의 두 근의 합과 곱은 근과 계수의 관계로 구하며, 이를 합한 결과가 조건과 일치한다.\n결론: $\\sum_{n=1}^{10}a_nb_n=275$이므로 정답은 ③이다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "근과 계수의 관계",
    "decisiveStep": "a=10, 근과 계수의 관계로 곱의 합 275",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "수열의 합",
      "l3": "합의 기호 Σ",
      "l4": "Σ 계산",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-057",
      "crosswalk2022RecordId": "H2-M1-RPM-123",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-10",
        "subUnitKey": "H15-M1-10-SEQUENCE_SUM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-07",
        "subUnitKey": "H22-A-07-SEQUENCE_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 15,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "정삼각형 $\\mathrm{ABC}$에서 변 $\\mathrm{BC}$의 삼등분점을 각각 $\\mathrm{P, Q}$라 하고 $\\angle\\mathrm{QAP} = \\theta$라고 할 때, $\\sin\\theta$의 값은? [4.6점]",
    "choices": [
      "$\\frac{\\sqrt{3}}{13}$",
      "$\\frac{2\\sqrt{3}}{13}$",
      "$\\frac{\\sqrt{13}}{14}$",
      "$\\frac{13}{14}$",
      "$\\frac{3\\sqrt{3}}{14}$"
    ],
    "answer": "⑤",
    "solution": "조건 확인: 정삼각형의 한 변을 1로 정해도 각 $\\theta=\\angle PAQ$는 바뀌지 않는다. $P,Q$는 $BC$를 세 등분하므로 $PQ=\\frac13$이다.\n전략: 정삼각형의 높이를 이용해 $AP=AQ$를 구한 다음, $\\triangle APQ$의 넓이를 두 방식으로 나타내어 $\\sin\\theta$를 구한다.\n① 정삼각형의 높이는 $\\frac{\\sqrt3}{2}$이다. 높이의 발은 $BC$의 중점이고, 중점에서 $P,Q$까지 수평 거리는 각각 $\\frac16$이다. 따라서 피타고라스 정리로\n$AP^2=AQ^2=(\\frac{\\sqrt3}{2})^2+(\\frac16)^2=\\frac34+\\frac1{36}=\\frac79$이다.\n② 밑변 $PQ=\\frac13$에 대한 높이는 $\\frac{\\sqrt3}{2}$이므로 $[APQ]=\\frac12\\cdot\\frac13\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt3}{12}$이다.\n③ 두 변과 끼인각을 이용하면 $[APQ]=\\frac12AP\\cdot AQ\\sin\\theta=\\frac12\\cdot\\frac79\\sin\\theta=\\frac7{18}\\sin\\theta$이다.\n따라서 $\\sin\\theta=\\frac{\\sqrt3}{12}\\cdot\\frac{18}7=\\frac{3\\sqrt3}{14}$이다.\n결론: 보기 ⑤이다. $AP\\cdot AQ=\\frac79$는 두 길이의 **곱**이며 $AP^2+AQ^2$가 아니다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "피타고라스 정리와 삼각형 넓이 사인식",
    "decisiveStep": "[APQ]=√3/12=(7/18)sinθ",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "삼각형의 넓이",
      "l4": "두 변과 끼인각",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-047",
      "crosswalk2022RecordId": "H2-M1-RPM-113",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": null,
        "subUnitKey": null
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-05",
        "subUnitKey": "H22-A-05-CORE"
      }
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
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I exact ACTIVE binding 0 across 11 packs; RPM semantic and current crosswalk independently checked; do not invent PT/TPL."
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "어느 지역의 $x$월의 월평균 기온 $T(x)^\\circ\\text{C}$가<br><br>$$T(x) = -6 + 12\\cos\\frac{\\pi}{6}(x-1) (^\\circ\\text{C})$$<br><br>이었을 때, 이 지역의 월평균 기온이 영하인 달은 모두 $m$월부터 $M$월까지이다. $M-m$의 값은? (단, $m, M$은 12이하의 자연수이다.) [4.6점]",
    "choices": [
      "$9$",
      "$8$",
      "$7$",
      "$6$",
      "$5$"
    ],
    "answer": "④",
    "solution": "조건·목표: $T(x)=-6+12\\cos\\{\\pi(x-1)/6\\}$가 영하인 달의 시작 $m$과 끝 $M$을 구한다.\n전략: $T(x)<0$은 $\\cos\\{\\pi(x-1)/6\\}<1/2$와 같다. $x=1,\\ldots,12$에서 코사인의 범위를 조사한다.\n풀이: $\\cos t<1/2$인 구간은 $\\pi/3<t<5\\pi/3$이다. 따라서 $\\pi/3<\\pi(x-1)/6<5\\pi/3$에서 $2<x-1<10$, 즉 $3<x<11$. 자연수 달은 $4,5,\\ldots,10$이므로 $m=4$, $M=10$, $M-m=6$. 경계인 3월·11월은 $T=0$이어서 포함하지 않는다.\n보기 판단: ④ 6만 일치한다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 그래프",
    "standardUnitKey": "H15-M1-07",
    "subUnitKey": "H15-M1-07-TRIGONOMETRIC_INEQUALITY",
    "primaryMethod": "코사인 부등식의 주기 구간 판정",
    "decisiveStep": "cos[π(x−1)/6]<1/2 ⇔ 3<x<11",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 그래프",
      "l3": "삼각방정식·부등식",
      "l4": "주기 구간의 해",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-036",
      "crosswalk2022RecordId": "H2-M1-RPM-102",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-06",
        "subUnitKey": "H15-M1-06-TRIGONOMETRIC_GRAPH"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_GRAPH"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 17,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I exact ACTIVE binding 0 across 11 packs; RPM semantic and current crosswalk independently checked; do not invent PT/TPL."
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "등차수열 $\\{a_n\\}$과 공비가 1보다 큰 등비수열 $\\{b_n\\}$이<br><br>$$a_2 + a_7 = 9, b_1 b_8 = 18, a_4 = b_4, a_5 = b_5$$<br><br>를 모두 만족시킬 때, $a_1 b_1$의 값은? [4.7점]",
    "choices": [
      "$-\\frac{9}{4}$",
      "$-\\frac{5}{4}$",
      "$-\\frac{5}{2}$",
      "$\\frac{5}{2}$",
      "$\\frac{9}{2}$"
    ],
    "answer": "①",
    "solution": "조건·목표: 등차수열 $a_n$과 공비 $r>1$인 등비수열 $b_n$의 관계에서 $a_1b_1$을 구한다.\n전략: $a_4=b_4$, $a_5=b_5$이므로 등차 공차 $d=b_5-b_4=b_4(r-1)$이다.\n풀이: $a_2=a_4-2d$, $a_7=a_4+3d$이므로 $a_2+a_7=2b_4+d=b_4(r+1)=9$. 또 $b_1b_8=b_1^2r^7=b_4^2r=18$. 따라서 $b_4=9/(r+1)$이고 $81r/(r+1)^2=18$, 즉 $2r^2-5r+2=(2r-1)(r-2)=0$. $r>1$이므로 $r=2$. $b_4=3$, $b_1=b_4/2^3=3/8$, $d=3$, $a_1=a_4-3d=3-9=-6$. 따라서 $a_1b_1=-6(3/8)=-9/4$.\n보기 판단: ① $-9/4$만 일치한다. 정답 ①.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "등차·등비 관계 연립",
    "decisiveStep": "r=2, a1=-6,b1=3/8",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "수열의 활용",
      "l4": "조건으로 수열 결정",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-055",
      "crosswalk2022RecordId": "H2-M1-RPM-121",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-SEQUENCE_TERM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_APPLICATION"
      }
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
    "sourceQid": 18,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "객관식",
    "content": "한 변의 길이가 1인 정삼각형 $\\mathrm{C}_1$이 있다. $\\mathrm{C}_1$의 세 변을 각각 삼등분하고, 가운데 선분 위에 다시 한 변의 길이가 $\\frac{1}{3}$인 작은 정삼각형들을 덧붙인 도형을 $\\mathrm{C}_2$라 한다. 이와 같은 방법으로 도형 $\\mathrm{C}_n$의 각 변을 삼등분하고 가운데 선분 위에 다시 정삼각형을 덧붙인 도형을 $\\mathrm{C}_{n+1}$이라 할 때, 도형 $\\mathrm{C}_n$의 둘레의 길이 $l_n$에 대하여 $l_1 + l_2 + l_3 + l_4 + l_5 = \\frac{k}{27}$이다. $k$의 값은? [4.8점]<br><br><img src=\"assets/images/22_팔마고_1학기_기말_고2_수학I/q19.png\" class=\"question-img\">",
    "choices": [
      "$611$",
      "$781$",
      "$826$",
      "$961$",
      "$1023$"
    ],
    "answer": "②",
    "solution": "조건·목표: 그림처럼 각 변의 가운데 1/3을 두 변으로 바꾸는 과정을 반복할 때 첫 다섯 도형의 둘레 합을 구한다.\n전략: 한 선분이 길이가 원래의 1/3인 선분 4개로 바뀌므로 둘레는 매번 $4/3$배가 된다.\n풀이: $l_1=3$, $l_n=3(4/3)^{n-1}$. 따라서 $\\sum_{n=1}^5l_n=3\\{(4/3)^5-1\\}/(4/3-1)=9(1024/243-1)=9(781/243)=781/27$. 따라서 $k=781$.\n보기 판단: ② 781만 일치한다. 정답 ②.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "코흐 둘레 등비합",
    "decisiveStep": "l_n=3(4/3)^(n-1)",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "합",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-054",
      "crosswalk2022RecordId": "H2-M1-RPM-120",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-09",
        "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 19,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "<서술형 1> 수열 $\\{a_n\\}$의 일반항이 $a_n = \\sum_{k=1}^n k^2$일 때, 다음 식의 값이 $\\frac{q}{p}$이다. $p+q$의 값을 구하고, 그 풀이과정을 서술하시오. (단, $p$와 $q$는 서로소인 자연수이다.) [6.0점]<br><br>$$\\frac{3}{a_1} + \\frac{5}{a_2} + \\frac{7}{a_3} + \\cdots + \\frac{17}{a_8}$$",
    "choices": [],
    "answer": "19",
    "solution": "조건 확인: $a_n=1^2+2^2+\\cdots+n^2$이고 분자는 차례로 $3,5,7,\\ldots,17$, 즉 제$n$항에서 $2n+1$이다.\n전략: 제곱합 공식 $a_n=\\frac{n(n+1)(2n+1)}6$을 분모에 대입하면 $2n+1$이 약분되어 이웃 항끼리 소거되는 꼴이 된다.\n① $\\frac{2n+1}{a_n}=\\frac{2n+1}{n(n+1)(2n+1)/6}=\\frac6{n(n+1)}=6(\\frac1n-\\frac1{n+1})$이다.\n② 처음 8항을 쓰면 $6\\{(1-\\frac12)+(\\frac12-\\frac13)+\\cdots+(\\frac18-\\frac19)\\}$이다. 중간의 $-\\frac12$와 $+\\frac12$, $-\\frac13$과 $+\\frac13$ 등이 모두 지워져 $6(1-\\frac19)=\\frac{16}3$만 남는다.\n③ $p,q$는 서로소 자연수이므로 기약분수 $\\frac qp=\\frac{16}3$에서 $p=3$, $q=16$이다. $\\gcd(3,16)=1$을 확인한다.\n결론: $p+q=3+16=\\boxed{19}$.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "제곱합과 망원급수",
    "decisiveStep": "(2n+1)/a_n=6/[n(n+1)]",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "수열의 합",
      "l3": "여러 가지 수열의 합",
      "l4": "부분분수·망원급수형",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-060",
      "crosswalk2022RecordId": "H2-M1-RPM-126",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-10",
        "subUnitKey": "H15-M1-10-SEQUENCE_SUM"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-07",
        "subUnitKey": "H22-A-07-SEQUENCE_SUM"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 20,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "<서술형 2> 첫째항이 $-30$, 공차가 4인 등차수열에서 첫째항부터 몇 번째 항까지의 합이 최소가 되는지 구하려고 한다. 다음 두 학생이 제시한 두가지 방법으로 각각 최솟값을 구하고, 두 학생이 제시한 풀이과정을 각각 서술하시오. [7.0점]<br><br>장미 : 음수인 항만을 더하면 되겠네!<br>혜진 : 제$n$항까지의 합을 구한 후 그 최솟값을 구하면 되겠네!",
    "choices": [],
    "answer": "8번째 항까지, 최솟값 -128",
    "solution": "조건·목표: 첫째항 $-30$, 공차 4인 등차수열의 부분합이 최소인 항 번호와 그 최솟값을 장미·혜진의 방법으로 각각 구한다.\n장미의 방법: $a_n=-30+4(n-1)=4n-34$. $a_8=-2<0$, $a_9=2>0$이므로 음수인 첫 8항까지 더할 때 합이 가장 작다. $S_8=8(-30-2)/2=-128$.\n혜진의 방법: $S_n=n\\{-60+4(n-1)\\}/2=2n(n-16)=2(n-8)^2-128$. 제곱은 0 이상이므로 자연수 $n=8$에서 최솟값은 $-128$이다.\n결론: 두 방법 모두 $\\boxed{8\\text{번째 항까지},\\ -128}$이다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE",
    "primaryMethod": "등차합 최소",
    "decisiveStep": "n=8,S8=-128",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등차수열",
      "l4": "합",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-051",
      "crosswalk2022RecordId": "H2-M1-RPM-117",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-08",
        "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-06",
        "subUnitKey": "H22-A-06-SEQUENCE_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 21,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; 11 ACTIVE pack bindings checked; exact 2015 수학I binding count 0."
  },
  {
    "id": 22,
    "questionNumber": 22,
    "questionType": "서술형",
    "content": "<서술형 3> $0 < \\theta < 2\\pi$에서 $x$에 대한 이차방정식<br><br>$$x^2 + 4(\\cos\\theta)x - 2\\sin\\theta + 4 = 0$$<br><br>이 실근을 갖도록 하는 $\\theta$의 범위를 구하고, 그 풀이과정을 서술하시오. [7.0점]",
    "choices": [],
    "answer": "0<\\theta\\le\\frac{\\pi}{6}\\ \\text{또는}\\ \\frac{5\\pi}{6}\\le\\theta\\le\\pi",
    "solution": "조건 확인: $0<\\theta<2\\pi$이고 $x$에 관한 이차방정식이 **적어도 한 실근**을 가져야 한다. 중근도 실근이므로 판별식 $D\\ge0$을 쓴다.\n① $D=(4\\cos\\theta)^2-4(4-2\\sin\\theta)=16\\cos^2\\theta-16+8\\sin\\theta$이다.\n$\\cos^2\\theta=1-\\sin^2\\theta$를 대입하면 $D=8\\sin\\theta-16\\sin^2\\theta=8\\sin\\theta(1-2\\sin\\theta)$이다.\n② $t=\\sin\\theta$라 놓으면 $t(1-2t)\\ge0$이다. 영점은 $t=0,\\frac12$이고 부호를 조사하면 $0\\le t\\le\\frac12$, 즉 $0\\le\\sin\\theta\\le\\frac12$이다.\n③ $0<\\theta<2\\pi$에서 사인이 음수가 아닌 곳은 $0<\\theta\\le\\pi$뿐이다. 그 안에서 $\\sin\\theta\\le\\frac12$인 구간은 $0<\\theta\\le\\frac\\pi6$ 또는 $\\frac{5\\pi}6\\le\\theta\\le\\pi$이다.\n④ 경계 확인: $\\theta=\\frac\\pi6,\\frac{5\\pi}6,\\pi$에서는 $D=0$으로 중근을 허용한다. $\\theta=0,2\\pi$는 처음 범위가 열린 구간이라 제외한다.\n결론: $\\boxed{0<\\theta\\le\\frac\\pi6\\ \\text{또는}\\ \\frac{5\\pi}6\\le\\theta\\le\\pi}$이다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수",
    "standardUnitKey": "H15-M1-07",
    "subUnitKey": "H15-M1-07-TRIGONOMETRIC_INEQUALITY",
    "primaryMethod": "판별식과 삼각부등식의 구간 분류",
    "decisiveStep": "D=8sinθ(1−2sinθ)≥0 ⇔ 0≤sinθ≤1/2",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수",
      "l3": "삼각방정식·부등식",
      "l4": "주기 구간의 해",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-036",
      "crosswalk2022RecordId": "H2-M1-RPM-102",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-05",
        "subUnitKey": "H15-M1-05-TRIGONOMETRIC_RELATION"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-04",
        "subUnitKey": "H22-A-04-TRIGONOMETRIC_BASIC"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 22,
    "provenance": {
      "examUid": "22_팔마고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "167d6583c89e8ada4027bfb3e6180baad59f0466dd4bc9cc7c4efc63cdb78f01",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I exact ACTIVE binding 0 across 11 packs; RPM semantic and current crosswalk independently checked; do not invent PT/TPL."
  }
];
