window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q11-A1",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^2-4x+a\\ (x\\ge2)$와 그 역함수의 그래프가 한 점에서 접할 때, 실수 $a$의 값은?",
    "choices": [
      "$\\dfrac{25}{4}$",
      "$4$",
      "$\\dfrac94$",
      "$7$",
      "$9$"
    ],
    "answer": "①",
    "solution": "$x\\ge2$에서 $f(x)=(x-2)^2+a-4$는 증가하므로 역함수가 존재한다.\n증가함수와 그 역함수의 그래프는 직선 $y=x$에 대칭이며, 공통점은 $y=x$ 위에 있다. 만약 $y=f(x)=f^{-1}(x)$인데 $x<y$라면 증가성에 의해 $f(x)<f(y)$, 즉 $y<x$가 되어 모순이다.\n접하는 조건은 $f(x)=x$가 중근을 갖는 것이다.\n$f(x)-x=x^2-5x+a=(x-\\dfrac52)^2+a-\\dfrac{25}{4}$이다.\n중근 조건에서 $a=\\dfrac{25}{4}$, 접점의 좌표는 $(\\dfrac52,\\dfrac52)$이다.\n$\\dfrac52\\ge2$이므로 함수와 역함수의 정의역을 모두 만족한다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-A1-solution.svg",
    "solutionImageAlt": "A1 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=x^2-4x+a\\ (x\\ge2)$와 그 역함수의 그래프가 한 점에서 접할 때, 실수 $a$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 25/4 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "중근 판별식과 정의역 조건을 연결한다.",
        "assessmentBucket": "부호와 1/4 보정항 오답이 있으며 경우 분기는 적다.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q11-A2",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^2-8x+a\\ (x\\ge4)$와 그 역함수의 그래프가 한 점에서 접하도록 하는 실수 $a$의 값은?",
    "choices": [
      "$\\dfrac{49}{4}$",
      "$16$",
      "$\\dfrac{81}{4}$",
      "$21$",
      "$25$"
    ],
    "answer": "③",
    "solution": "$x\\ge4$에서 $f(x)=(x-4)^2+a-16$은 증가하므로 역함수가 존재한다.\n함수와 역함수의 교점은 $y=x$ 위에 있으므로 접하는 경우 $f(x)=x$가 중근을 갖는다.\n$x^2-8x+a=x$에서 $x^2-9x+a=0$이다.\n판별식 $D=81-4a=0$이므로 $a=\\dfrac{81}{4}$이다.\n중근은 $x=\\dfrac92$이며 $\\dfrac92\\ge4$이다. $f(\\dfrac92)=\\dfrac92$이므로 역함수의 정의역에도 속한다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-A2-solution.svg",
    "solutionImageAlt": "A2 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=x^2-8x+a\\ (x\\ge4)$와 그 역함수의 그래프가 한 점에서 접하도록 하는 실수 $a$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 81/4 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "방정식 중근과 x≥4 확인을 구별한다.",
        "assessmentBucket": "제곱·분수 계산과 부호 함정이 있다.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q11-A3",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=(x-1)^2+b\\ (x\\ge1)$와 그 역함수의 그래프가 한 점에서 접할 때, $b$의 값은?",
    "choices": [
      "$\\dfrac34$",
      "$\\dfrac54$",
      "$1$",
      "$\\dfrac32$",
      "$2$"
    ],
    "answer": "②",
    "solution": "$x\\ge1$에서 $f$는 증가하므로 역함수가 존재한다. 공통점은 $y=x$ 위에 있고 접할 때 $f(x)=x$는 중근을 갖는다.\n$(x-1)^2+b=x$를 이항하면 $x^2-3x+1+b=0$이다.\n$(x-\\dfrac32)^2+b-\\dfrac54=0$이므로 중근 조건은 $b=\\dfrac54$이다.\n접점은 $(\\dfrac32,\\dfrac32)$이며 $\\dfrac32\\ge1$, $\\dfrac32\\ge b$이므로 두 그래프 모두 실제로 정의된다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-A3-solution.svg",
    "solutionImageAlt": "A3 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=(x-1)^2+b\\ (x\\ge1)$와 그 역함수의 그래프가 한 점에서 접할 때, $b$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 5/4 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "완전제곱과 중근의 의미를 해석한다.",
        "assessmentBucket": "1/4 보정항의 부호 및 끝점 혼동.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q11-B1",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=2(x-2)^2+b\\ (x\\ge2)$와 그 역함수의 그래프가 한 점에서 접할 때, $b$의 값은?",
    "choices": [
      "$\\dfrac{15}{8}$",
      "$2$",
      "$\\dfrac{33}{16}$",
      "$\\dfrac{17}{8}$",
      "$\\dfrac94$"
    ],
    "answer": "④",
    "solution": "$x\\ge2$에서 $f$는 증가하므로 역함수가 있다. 함수와 역함수의 접점은 $f(x)=x$의 중근에서 구한다.\n$2(x-2)^2+b=x$, 즉 $2x^2-9x+8+b=0$이다.\n판별식은 $D=81-8(8+b)=17-8b$이다.\n$D=0$에서 $b=\\dfrac{17}{8}$이고 중근은 $x=\\dfrac94$이다.\n$\\dfrac94\\ge2$이고 $f(\\dfrac94)=\\dfrac94\\ge b$이므로 두 함수의 정의역을 만족한다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-B1-solution.svg",
    "solutionImageAlt": "B1 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=2(x-2)^2+b\\ (x\\ge2)$와 그 역함수의 그래프가 한 점에서 접할 때, $b$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 17/8 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "최고차항 계수 2가 판별식에 주는 영향을 계산한다.",
        "assessmentBucket": "분수 17/8 계산과 끝점 함정.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q11-B2",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "상",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "양수 $p$에 대하여 $f(x)=x^2-2px+9\\ (x\\ge p)$의 그래프와 그 역함수의 그래프가 한 점에서 접할 때, $p$의 값은?",
    "choices": [
      "$-\\dfrac72$",
      "$2$",
      "$\\dfrac52$",
      "$3$",
      "$\\dfrac72$"
    ],
    "answer": "③",
    "solution": "$f(x)=(x-p)^2+9-p^2$이고 $x\\ge p$에서 증가하므로 역함수가 존재한다.\n접할 때 $f(x)=x$가 중근을 갖는다.\n$x^2-(2p+1)x+9=0$의 판별식을 $0$으로 놓으면 $(2p+1)^2-36=0$이다.\n$2p+1=\\pm6$에서 $p=\\dfrac52$ 또는 $p=-\\dfrac72$이다.\n$p>0$이므로 $p=\\dfrac52$만 남는다.\n중근은 $x=\\dfrac{2p+1}2=3$이며 $3\\ge\\dfrac52$이고 $f(3)=3$이므로 역함수 정의역에도 속한다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-B2-solution.svg",
    "solutionImageAlt": "B2 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_POSITIVE",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 양수 $p$에 대하여 $f(x)=x^2-2px+9\\ (x\\ge p)$의 그래프와 그 역함수의 그래프가 한 점에서 접할 때, $p$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_POSITIVE,COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 5/2 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "두 매개변수 근과 양수 조건을 대조해야 한다.",
        "assessmentBucket": "이차식의 매개변수, 부호조건, 정의역의 복합판정.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q11-B3",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "FOLLOWUP",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=3(x-1)^2+c\\ (x\\ge1)$와 그 역함수의 그래프가 한 점에서 접하도록 하는 실수 $c$의 값은?",
    "choices": [
      "$\\dfrac{11}{12}$",
      "$1$",
      "$\\dfrac43$",
      "$\\dfrac76$",
      "$\\dfrac{13}{12}$"
    ],
    "answer": "⑤",
    "solution": "$x\\ge1$에서 $f$는 증가한다. 따라서 역함수가 존재하며 접점은 $y=x$ 위에 있다.\n$f(x)=x$를 정리하면 $3x^2-7x+3+c=0$이다.\n판별식 $D=49-12(3+c)=13-12c=0$에서 $c=\\dfrac{13}{12}$이다.\n중근 $x=\\dfrac76$은 $x\\ge1$이고 $f(\\dfrac76)=\\dfrac76$이므로 역함수 정의역 조건도 만족한다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-B3-solution.svg",
    "solutionImageAlt": "B3 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=3(x-1)^2+c\\ (x\\ge1)$와 그 역함수의 그래프가 한 점에서 접하도록 하는 실수 $c$의 값은?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: 13/12 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "계수 3에 맞는 판별식 처리가 필요하다.",
        "assessmentBucket": "13−12c 수치 판단과 보정량 구별.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q11-C1",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "함수 $f(x)=(x-2)^2+a\\ (x\\ge2)$와 그 역함수의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a<2$",
      "$2\\le a\\le\\dfrac94$",
      "$2<a<\\dfrac94$",
      "$a<\\dfrac94$",
      "$2\\le a<\\dfrac94$"
    ],
    "answer": "⑤",
    "solution": "$x\\ge2$에서 함수가 증가하므로 역함수가 존재하며 공통점은 $y=x$ 위에 있다.\n$f(x)=x$에서 $x^2-5x+4+a=0$이고 판별식 $D=9-4a$이다.\n서로 다른 두 근을 갖는 조건은 $D>0$, 즉 $a<\\dfrac94$이다.\n두 근은 $\\dfrac{5\\pm\\sqrt{9-4a}}2$이다. 둘 다 정의역에 속하려면 작은 근 $\\dfrac{5-\\sqrt{9-4a}}2\\ge2$이어야 한다.\n$\\sqrt{9-4a}\\le1$이고 양변이 음이 아니므로 제곱하여 $a\\ge2$를 얻는다.\n$a=2$이면 근 $2,3$이 모두 포함되고, $a=9/4$는 중근이어서 제외한다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-C1-solution.svg",
    "solutionImageAlt": "C1 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "a=17/8인 예에서 두 교점의 위치를 확인한다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
      ],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "EXPLICIT_DOMAIN_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 함수 $f(x)=(x-2)^2+a\\ (x\\ge2)$와 그 역함수의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 $a$의 범위는?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT,CC_ROOT_INTERSECTION_COUNT_FUNCTION은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "CASE_BRANCH: 2<=a<9/4 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "판별식과 작은 근의 정의역을 동시에 적용한다.",
        "assessmentBucket": "두 경계의 포함 여부 및 이중 조건.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q11-C2",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "자연수 $a,b$는 각각 $1$ 이상 $5$ 이하이다. $f_t(x)=\\dfrac{(x-2)^2}{4}+t\\ (x\\ge2)$에 대하여 $f_a$와 역함수의 그래프는 서로 다른 두 점에서 만나고 $f_b$와 역함수의 그래프는 한 점에서 접한다. $(a,b)$는?",
    "choices": [
      "$(1,3)$",
      "$(2,2)$",
      "$(2,4)$",
      "$(2,3)$",
      "$(3,2)$"
    ],
    "answer": "④",
    "solution": "$x\\ge2$에서 각 $f_t$는 증가하므로 역함수가 존재한다. 두 그래프의 교점은 $f_t(x)=x$로 구한다.\n$\\dfrac{(x-2)^2}{4}+t=x$를 정리하면 $x^2-8x+4+4t=0$이다.\n판별식은 $D=16(3-t)$, 근은 $x=4\\pm2\\sqrt{3-t}$이다.\n서로 다른 두 교점은 $t<3$이고 작은 근까지 $x\\ge2$이어야 하므로 $4-2\\sqrt{3-t}\\ge2$에서 $t\\ge2$이다.\n따라서 $2\\le t<3$인 자연수 $a=2$뿐이다. 실제 두 교점은 $(2,2)$, $(6,6)$이다.\n접할 조건은 $D=0$에서 $b=3$이며 중근 $x=4\\ge2$이다.\n따라서 $(a,b)=(2,3)$이고 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-C2-solution.svg",
    "solutionImageAlt": "C2 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "a=2인 경우 두 교점; b=3의 접점은 학생 해설식에서 확인한다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
      ],
      "conditionKeys": [
        "COND_NATURAL_NUMBER",
        "COND_RANGE"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "EXPLICIT_DOMAIN_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 자연수 $a,b$는 각각 $1$ 이상 $5$ 이하이다. $f_t(x)=\\dfrac{(x-2)^2}{4}+t\\ (x\\ge2)$에 대하여 $f_a$와 역함수의 그래프는 서로 다른 두 점에서 만나고 $f_b$와 역함수의 그래프는 한 점에서 접한다. $(a,b)$는?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT,CC_ROOT_INTERSECTION_COUNT_FUNCTION은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_NATURAL_NUMBER,COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "CASE_BRANCH: (2,3) 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "자연수 2개를 두 교점과 접점으로 구분한다.",
        "assessmentBucket": "작은 근 정의역·자연수·중근 세 조건이 복합됨.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q11-C3",
    "sourceQid": 11,
    "sourceUid": "qid_v1_d570b59e309a32bed77776f5a7dabece82abf08717f24c9c4f182a635fa17383",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "중",
    "category": "함수와 역함수의 그래프",
    "originalCategory": "함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-07",
    "standardUnit": "함수",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
    "subUnit": "역함수",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "역함수",
      "그래프",
      "접점"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 $f(x)=(x-n)^2+a\\ (x\\ge n)$이라 하자. $f$와 역함수의 그래프가 점 $\\left(\\dfrac72,\\dfrac72\\right)$에서 접할 때, $(n,a)$는?",
    "choices": [
      "$(3,\\dfrac{13}{4})$",
      "$(3,3)$",
      "$(2,\\dfrac94)$",
      "$(3,\\dfrac72)$",
      "$(4,\\dfrac{17}{4})$"
    ],
    "answer": "①",
    "solution": "$x\\ge n$에서 $f$는 증가하므로 역함수가 존재한다. 접점이 주어졌으므로 $f(x)=x$는 해당 $x$에서 중근을 갖는다.\n$f(x)-x=(x-n)^2+a-x=(x-n-\\dfrac12)^2+a-n-\\dfrac14$이다.\n중근의 위치는 $x=n+\\dfrac12$이므로 $n+\\dfrac12=\\dfrac72$에서 자연수 $n=3$이다.\n상수항도 $0$이어야 하므로 $a=n+\\dfrac14=\\dfrac{13}{4}$이다.\n$\\dfrac72\\ge3$, $\\dfrac72\\ge\\dfrac{13}{4}$이며 $f(\\dfrac72)=\\dfrac72$이다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q11-C3-solution.svg",
    "solutionImageAlt": "C3 함수와 역함수의 y=x 대칭 및 실제 교점 또는 접점을 표시한 좌표 그래프",
    "solutionImageCaption": "중근에서 얻은 접점과 y=x 대칭을 나타낸다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "PRIMARY_L3_ANCHOR_SEPARATE_ACTIVE_PT_BINDING",
      "rpmBindingEvidence": "PT_INVERSE_GRAPH ACTIVE 및 H22-C2-07-FUNCTION_INVERSE curriculum binding, TPL_INVERSE_GRAPH_INTERSECTION ACTIVE; RPM exact DIRECT 상태는 독립 확정하지 않음.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_NATURAL_NUMBER",
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "DOMAIN_CHECK",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "H1-RPM-256 역함수의 그래프 대칭·접점/교점. 자연수 $n$에 대하여 $f(x)=(x-n)^2+a\\ (x\\ge n)$이라 하자. $f$와 역함수의 그래프가 점 $\\left(\\dfrac72,\\dfrac72\\right)$에서 접할 때, $(n,a)$는?",
        "l4": "역함수와 y=x 대칭, 중근·실근 및 정의역을 실제 풀이에 사용.",
        "pt": "ACTIVE PT_INVERSE_GRAPH: y=x 대칭으로 교점·접점 판정.",
        "tpl": "ACTIVE TPL_INVERSE_GRAPH_INTERSECTION: f(x)=x를 세우고 중근·근 개수·범위 판정.",
        "cross": "CC_DISCRIMINANT은 중근의 판별식 및 교점의 실근 판정을 위한 보조 개념이다.",
        "condition": "COND_NATURAL_NUMBER,COND_RANGE은 정의역과 양수/자연수 경계를 실제 후보 제거에 적용한다.",
        "integration": "SEQUENTIAL: (3,13/4) 도출 과정에서 그래프 대칭→중근/실근→범위 확인을 순차 또는 분기 적용.",
        "learningLevel": "접점 좌표에서 n을 역산해 상수항을 확정한다.",
        "assessmentBucket": "자연수 n과 함수·역함수 정의역을 확인한다.",
        "problemVisual": "발문에서 함수식·정의역·질문이 모두 주어지므로 문제 SVG는 답 암시만 늘려 EXEMPT.",
        "solutionVisual": "역함수 대칭과 접점/교점을 실제 점·곡선으로 보여 주는 해설 SVG 필요.",
        "curriculum": "공통수학2 함수·역함수 및 이미 학습한 판별식/완전제곱/이차방정식/범위만 사용, 미분 및 도함수 미사용."
      }
    }
  }
];
