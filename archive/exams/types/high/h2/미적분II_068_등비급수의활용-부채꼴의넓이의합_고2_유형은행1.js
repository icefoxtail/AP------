window.examTitle = "미적분II_068_등비급수의활용-부채꼴의넓이의합_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "반지름 $3$인 원에서 한 점을 시작으로 반시계 방향으로 이동하며 중심각이 $\\pi/3,\\pi/9,\\pi/27,\\ldots$인 연속한 부채꼴을 만든다. 부채꼴의 넓이의 합은?\\n[그림: 중심 $O$인 반지름 $3$의 원에서 오른쪽 수평 반지름을 그린 뒤 반시계로 $60^\\circ$, 이어 $20^\\circ$ 회전한 반지름을 그린다.]",
    "choices": [
      "$\\frac{5\\pi}{4}$",
      "$\\frac{7\\pi}{4}$",
      "$\\frac{9\\pi}{4}$",
      "$\\frac{11\\pi}{4}$",
      "$\\frac{13\\pi}{4}$"
    ],
    "answer": "③",
    "solution": "반지름 $r=3$, 중심각 $\\theta_n=\\frac{\\pi}{3}\\left(\\frac13\\right)^{n-1}$인 부채꼴의 넓이는 $S_n=\\frac12 r^2\\theta_n$이다.\n$S_n=\\frac12\\cdot 3^2\\cdot\\frac{\\pi}{3}\\left(\\frac13\\right)^{n-1}=\\frac{3\\pi}{2}\\left(\\frac13\\right)^{n-1}$이다.\n중심각이 첫째항 $\\frac{\\pi}{3}$, 공비 $\\frac13$인 등비수열이므로 넓이도 첫째항 $\\frac{3\\pi}{2}$, 공비 $\\frac13$인 등비수열이다.\n등비급수의 합 공식 $\\sum_{n=1}^{\\infty}ar^{n-1}=\\frac{a}{1-r}$을 쓴다.\n$\\sum S_n=\\frac{\\frac{3\\pi}{2}}{1-\\frac13}=\\frac{\\frac{3\\pi}{2}}{\\frac23}=\\frac{3\\pi}{2}\\cdot\\frac32=\\frac{9\\pi}{4}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "image": "assets/images/미적분II_068_등비급수의활용-부채꼴의넓이의합_고2_유형은행1/q1-problem.svg",
    "imageAlt": "반지름 3인 원에서 60°, 이어 20°씩 회전한 세 반지름과 두 부채꼴 호.",
    "imageCaption": "반지름 3인 원에서 60°, 이어 20°씩 회전한 세 반지름과 두 부채꼴 호.",
    "imageSize": "full"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "직각삼각형 $AB_1C_1$에서 $\\angle C_1=90^\\circ$, $\\angle B_1=60^\\circ$, $B_1C_1=8$이다. $B_1$을 중심으로 반지름 $B_1C_1$인 부채꼴을 그려 빗변 $AB_1$과 만나는 점을 $C_2$라 한다. $C_2$에서 빗변에 내린 수직선이 $AC_1$과 만나는 점을 $B_2$라 한다. 남은 직각삼각형 $AB_2C_2$에서 같은 과정을 반복할 때 부채꼴 넓이의 합은?\\n[그림: $B_1=(0,0),C_1=(8,0),A=(8,8\\sqrt3)$를 잇는다. $C_2=(4,4\\sqrt3)$에서 $AB_1$에 수직인 선을 그려 $AC_1$과의 교점을 $B_2$로 표시한다. $B_1$ 중심의 첫 호를 그린다.]",
    "choices": [
      "$10\\pi$",
      "$12\\pi$",
      "$14\\pi$",
      "$16\\pi$",
      "$18\\pi$"
    ],
    "answer": "④",
    "solution": "삼각형 $AB_1C_1$에서 $\\angle A=180^\\circ-90^\\circ-60^\\circ=30^\\circ$이다.\n$\\angle B_1=60^\\circ$이고 $B_1C_1=8$이므로 $AB_1=\\frac{B_1C_1}{\\cos60^\\circ}=\\frac{8}{1/2}=16$이다.\n$B_1C_2=B_1C_1=8$이므로 $AC_2=AB_1-B_1C_2=16-8=8$이다.\n직각삼각형 $AC_2B_2$에서 $\\angle A=30^\\circ$, $AC_2=8$이므로 $B_2C_2=AC_2\\tan30^\\circ=8\\cdot\\frac{1}{\\sqrt3}=\\frac{8}{\\sqrt3}$이다.\n첫 부채꼴은 중심 $B_1$, 반지름 $8$, 중심각 $60^\\circ=\\frac{\\pi}{3}$이므로 넓이는 $\\frac12\\cdot8^2\\cdot\\frac{\\pi}{3}=\\frac{32\\pi}{3}$이다.\n같은 과정을 반복하면 반지름이 매번 $\\frac{1}{\\sqrt3}$배가 되므로 닮음에 의해 넓이는 매번 $\\left(\\frac{1}{\\sqrt3}\\right)^2=\\frac13$배가 된다.\n따라서 부채꼴 넓이의 합은 첫째항 $\\frac{32\\pi}{3}$, 공비 $\\frac13$인 등비급수이고, 등비급수의 합 공식으로 $\\frac{\\frac{32\\pi}{3}}{1-\\frac13}=\\frac{\\frac{32\\pi}{3}}{\\frac23}=16\\pi$이다.\n주의: 다음 부채꼴의 반지름은 $B_2C_2$이고 $AC_2$가 아니다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_068_등비급수의활용-부채꼴의넓이의합_고2_유형은행1/q2-problem.svg",
    "imageAlt": "직각삼각형 B₁C₁A, 빗변 위 C₂에서 AC₁으로 내린 수선 C₂B₂와 B₁ 중심 호 C₁C₂.",
    "imageCaption": "직각삼각형 B₁C₁A, 빗변 위 C₂에서 AC₁으로 내린 수선 C₂B₂와 B₁ 중심 호 C₁C₂.",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "수직선 위의 $O_n=(2n,0)$을 중심으로 반지름 $2$인 원을 각각 그린다. 첫 두 원의 교점을 $P_1,Q_1$이라 한다. $O_{n+2}$에서 $P_n,Q_n$으로 향하는 반직선이 $O_{n+2}$ 중심인 원과 만나는 점을 $P_{n+1},Q_{n+1}$이라 한다. 중심이 $O_{n+1}$인 작은 부채꼴 $P_nO_{n+1}Q_n$의 넓이의 합은?\\n[그림: 중심이 $(2,0),(4,0),(6,0),(8,0)$인 반지름 $2$의 원을 그린다. 첫 교점 $(3,\\pm\\sqrt3)$에서 $(6,0)$으로 선분을 그려 새 원과 만나는 점을 표시한다.]",
    "choices": [
      "$\\frac{4\\pi}{3}$",
      "$\\frac{5\\pi}{3}$",
      "$\\frac{6\\pi}{3}$",
      "$\\frac{7\\pi}{3}$",
      "$\\frac{8\\pi}{3}$"
    ],
    "answer": "⑤",
    "solution": "$O_nO_{n+1}=2$이고 두 원의 반지름이 모두 $2$이므로 삼각형 $O_nO_{n+1}P_n$은 정삼각형이다.\n따라서 $\\angle P_nO_{n+1}O_n=60^\\circ$이고, 대칭인 $Q_n$에 대하여 $\\alpha_n=\\angle P_nO_{n+1}Q_n$이라 하면 $\\alpha_1=2\\cdot60^\\circ=120^\\circ=\\frac{2\\pi}{3}$이다.\n일반적으로 대칭성에 의해 $\\angle O_nO_{n+1}P_n=\\frac{\\alpha_n}{2}$이다.\n삼각형 $O_{n+1}O_{n+2}P_n$에서 $O_{n+1}O_{n+2}=O_{n+1}P_n=2$이므로 이등변삼각형이다.\n그 꼭짓각은 $\\angle O_{n+2}O_{n+1}P_n=180^\\circ-\\frac{\\alpha_n}{2}$이므로 밑각은 $\\frac{180^\\circ-\\left(180^\\circ-\\frac{\\alpha_n}{2}\\right)}{2}=\\frac{\\alpha_n}{4}$이다.\n$P_{n+1}$은 반직선 $O_{n+2}P_n$ 위에 있으므로 $\\angle O_{n+1}O_{n+2}P_{n+1}=\\frac{\\alpha_n}{4}$이고, 대칭성에 의해 $\\alpha_{n+1}=2\\cdot\\frac{\\alpha_n}{4}=\\frac{\\alpha_n}{2}$이다.\n첫 부채꼴의 넓이는 $\\frac12\\cdot2^2\\cdot\\frac{2\\pi}{3}=\\frac{4\\pi}{3}$이다.\n중심각이 매번 $\\frac12$배이므로 넓이도 매번 $\\frac12$배가 되고, 등비급수의 합 공식에 의해 $\\frac{\\frac{4\\pi}{3}}{1-\\frac12}=\\frac{8\\pi}{3}$이다.\n주의: 모든 부채꼴의 반지름은 $2$로 일정하고 중심각만 반으로 줄어든다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_068_등비급수의활용-부채꼴의넓이의합_고2_유형은행1/q3-problem.svg",
    "imageAlt": "x축 위 중심 (2,0),(4,0),(6,0),(8,0), 반지름2의 원 4개와 첫 교점·연속 교점.",
    "imageCaption": "x축 위 중심 (2,0),(4,0),(6,0),(8,0), 반지름2의 원 4개와 첫 교점·연속 교점.",
    "imageSize": "full"
  },
  {
    "id": 4,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$AB=3,BC=6,\\angle ABC=60^\\circ$인 삼각형에서 $D\\in AB,E\\in BC,F\\in AC$를 잡아 $BDFE$가 마름모가 되게 한다. 마름모에서 $B$ 중심, 반지름 $BE$인 부채꼴 밖의 부분을 색칠한다. 삼각형 $FEC$에서 $E$를 새 $B$로 삼아 같은 과정을 반복할 때 색칠한 넓이의 총합은?\\n[그림: $B=(0,0),C=(6,0),A=(3/2,3\\sqrt3/2)$를 잇는다. $D=(1,\\sqrt3),E=(2,0),F=(3,\\sqrt3)$인 마름모와 $B$ 중심의 호 $DE$를 그린다. $FEC$ 안에 다음 마름모를 그린다.]",
    "choices": [
      "$\\frac25(3\\sqrt3-\\pi)$",
      "$\\frac35(3\\sqrt3-\\pi)$",
      "$\\frac45(3\\sqrt3-\\pi)$",
      "$(3\\sqrt3-\\pi)$",
      "$\\frac65(3\\sqrt3-\\pi)$"
    ],
    "answer": "⑤",
    "solution": "마름모의 한 변을 $x=BE$라 하면 $BD=FE=x$이고 $BD\\parallel FE$이므로 $FE\\parallel AB$이다.\n$E\\in BC$에서 $CE=BC-BE=6-x$이고, $FE\\parallel AB$이므로 삼각형 $CFE$는 삼각형 $CBA$와 닮음이다.\n닮음비에서 $\\frac{FE}{AB}=\\frac{CE}{CB}$이므로 $\\frac{x}{3}=\\frac{6-x}{6}$이다.\n이를 풀면 $6x=3(6-x)=18-3x$에서 $9x=18$, 즉 $x=2$이다.\n마름모의 넓이는 두 변과 끼인각 $60^\\circ$를 이용하여 $x^2\\sin60^\\circ=2^2\\cdot\\frac{\\sqrt3}{2}=2\\sqrt3$이다.\n$\\angle DBE=60^\\circ$, 반지름 $BE=2$인 부채꼴의 넓이는 $\\frac12\\cdot2^2\\cdot\\frac{\\pi}{3}=\\frac{2\\pi}{3}$이다.\n첫 번째로 색칠하는 넓이는 마름모에서 이 부채꼴을 뺀 값이므로 $2\\sqrt3-\\frac{2\\pi}{3}=\\frac{2}{3}(3\\sqrt3-\\pi)$이다.\n남은 삼각형 $FEC$는 삼각형 $ABC$와 닮음이고 닮음비가 $\\frac{CE}{CB}=\\frac{6-2}{6}=\\frac23$이다.\n따라서 다음 단계부터 색칠하는 넓이는 매번 $\\left(\\frac23\\right)^2=\\frac49$배가 된다.\n색칠한 넓이의 총합은 첫째항 $\\frac{2}{3}(3\\sqrt3-\\pi)$, 공비 $\\frac49$인 등비급수이므로 $\\frac{\\frac{2}{3}(3\\sqrt3-\\pi)}{1-\\frac49}=\\frac{\\frac{2}{3}(3\\sqrt3-\\pi)}{\\frac59}=\\frac65(3\\sqrt3-\\pi)$이다.\n주의: 부채꼴은 마름모 내부의 중심각 $60^\\circ$ 조각이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE",
    "image": "assets/images/미적분II_068_등비급수의활용-부채꼴의넓이의합_고2_유형은행1/q4-problem.svg",
    "imageAlt": "삼각형 ABC에서 BDFE 마름모, B 중심 호 DE, FEC 내부의 다음 마름모와 색칠.",
    "imageCaption": "삼각형 ABC에서 BDFE 마름모, B 중심 호 DE, FEC 내부의 다음 마름모와 색칠.",
    "imageSize": "full"
  }
];
