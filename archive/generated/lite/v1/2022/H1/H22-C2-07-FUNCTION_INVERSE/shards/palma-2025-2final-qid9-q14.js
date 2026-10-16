window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q14-A1",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "정의역과 공역이 모두 $0$을 제외한 실수 전체인 함수 $f(x)=\\dfrac4x$에 대한 설명으로 옳은 것만을 있는 대로 고른 것은?\nㄱ. $f^{-1}(x)=f(x)$이다.\nㄴ. $y=f(x)$는 제1사분면과 제3사분면을 지난다.\nㄷ. $y=f(x)$와 $y=f^{-1}(x)$의 서로 다른 교점은 $2$개이다.",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$f(f(x))=\\dfrac4{4/x}=x$이므로 역함수는 $f^{-1}(x)=\\dfrac4x$이다. ㄱ은 옳다.\n$x>0$이면 $4/x>0$, $x<0$이면 $4/x<0$이므로 그래프는 제1·3사분면을 지난다. ㄴ도 옳다.\n두 그래프는 완전히 같은 그래프이므로 교점은 무수히 많다. $f(x)=x$를 풀어 얻는 $x=\\pm2$는 그래프와 직선 $y=x$의 교점일 뿐이다. 따라서 ㄷ은 옳지 않다.\n따라서 옳은 것은 ㄱ, ㄴ이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-A1-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: A1",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE",
      "crossConceptKeys": [
        "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT: 두 그래프 f와 f⁻¹의 완전 일치와 직선 y=x 위 고정점의 개수를 분리하는 추가 판단.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "기본 그래프 대칭/역함수 결정 → 추가 계산 → 결론의 순차적 연계.",
        "learningLevel": "자기 역함수 구조, 사분면 부호, 완전 일치인 두 곡선과 대각선 고정점을 구분한다.",
        "assessmentBucket": "대각선 위 고정점 둘을 전체 그래프 교점 둘로 오인하는 함정이 있다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q14-A2",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "중",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "정의역과 공역이 모두 $0$을 제외한 실수 전체인 함수 $f(x)=-\\dfrac9x$에 대하여 옳은 것만을 있는 대로 고른 것은?\nㄱ. $f^{-1}=f$이다.\nㄴ. $y=f(x)$의 그래프는 원점에 대하여 대칭이다.\nㄷ. $y=f(x)$와 직선 $y=x$의 서로 다른 교점은 $2$개이다.",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$f(f(x))=-\\dfrac9{-9/x}=x$이므로 $f^{-1}=f$이다. ㄱ은 옳다.\n$f(-x)=-\\dfrac9{-x}=\\dfrac9x=-f(x)$이므로 점 $(x,f(x))$와 $(-x,-f(x))$가 함께 그래프 위에 있다. 그래프는 원점 대칭이고 ㄴ도 옳다.\n$-\\dfrac9x=x$라 하면 $x^2=-9$이므로 실수해가 없다. 따라서 ㄷ은 옳지 않다.\n그러므로 옳은 것은 ㄱ, ㄴ이고 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-A2-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: A2",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE",
      "crossConceptKeys": [
        "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT",
        "CC_FUNCTION_SYMMETRY"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 3,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT: 두 그래프 f와 f⁻¹의 완전 일치와 직선 y=x 위 고정점의 개수를 분리하는 추가 판단. / CC_FUNCTION_SYMMETRY: 함수의 f(-x)=-f(x) 관계를 계산해 원점대칭을 입증.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "부호가 음수여도 자기 역함수임을 판단하고 원점 대칭과 실수 고정점 부재를 구별한다.",
        "assessmentBucket": "세 판단의 방향이 다르고 음수의 제곱·근 존재에 대한 오류 위험이 있다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q14-A3",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\dfrac4x$의 그래프 위의 점 $P(1,4)$에 대응하는 역함수 $y=f^{-1}(x)$의 그래프 위의 점을 $Q$라 하자. 선분 $PQ$의 길이는?",
    "choices": [
      "$9$",
      "$6$",
      "$3\\sqrt2$",
      "$9\\sqrt2$",
      "$18$"
    ],
    "answer": "③",
    "solution": "함수의 그래프와 역함수의 그래프는 직선 $y=x$에 대하여 대칭이므로 $P(1,4)$에 대응하는 점은 $Q(4,1)$이다.\n두 점 사이의 거리 공식을 적용하면 $PQ=\\sqrt{(4-1)^2+(1-4)^2}=\\sqrt{9+9}=3\\sqrt2$이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-A3-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: A3",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_GEOMETRY",
      "crossConceptKeys": [
        "CC_DISTANCE_TWO_POINTS"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "TPL_INVERSE_GRAPH_GEOMETRY ACTIVE: 대칭으로 대응점을 복원한 후 거리/중점 조건에 사용.",
        "cross": "CC_DISTANCE_TWO_POINTS: y=x를 기준으로 대응하는 두 점의 좌표 차를 제곱합·근호로 계산.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "기본 그래프 대칭/역함수 결정 → 추가 계산 → 결론의 순차적 연계.",
        "learningLevel": "대칭 대응점의 좌표를 교환하고 거리 공식을 한 번 적용한다.",
        "assessmentBucket": "두 좌표를 정확히 바꾸는 절차만 있으면 조건 분기가 없다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q14-B1",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "정의역이 $x\\ne2$이고 치역이 $y\\ne1$인 함수 $f(x)=1+\\dfrac6{x-2}$의 그래프와 그 역함수의 그래프가 만나는 서로 다른 두 점의 $x$좌표의 합은?",
    "choices": [
      "$-4$",
      "$-1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$y=1+\\dfrac6{x-2}$에서 $x,y$를 바꾸고 정리하면 $f^{-1}(x)=2+\\dfrac6{x-1}$이다.\n두 그래프의 교점은 $1+\\dfrac6{x-2}=2+\\dfrac6{x-1}$을 만족한다. $x\\ne1,2$에서 분모를 없애면 $(x-1)(x-2)=6$이다.\n$x^2-3x-4=(x+1)(x-4)=0$이므로 $x=-1$ 또는 $x=4$이다. 두 값은 분모의 영점이 아니며 실제로 각 점에서 $f(x)=x$도 성립한다.\n따라서 두 교점의 $x$좌표의 합은 $-1+4=3$이고 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-B1-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: B1",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT",
      "crossConceptKeys": [
        "CC_QUADRATIC_EQUATION"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "CC_QUADRATIC_EQUATION: 원함수와 역함수의 공통점을 이차방정식으로 환원해 실근을 구함.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "기본 그래프 대칭/역함수 결정 → 추가 계산 → 결론의 순차적 연계.",
        "learningLevel": "함수와 역함수의 방정식을 구별하고 공통점 이차방정식을 풀어 근을 합한다.",
        "assessmentBucket": "두 식의 분모가 서로 다르며 이차방정식 실근·제외점을 함께 판단해야 한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q14-B2",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "상",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "$a\\ne0$일 때, 함수 $f(x)=3+\\dfrac{a}{x-1}$의 그래프와 그 역함수의 그래프가 정확히 한 점에서 만나도록 하는 실수 $a$의 값은?",
    "choices": [
      "$-1$",
      "$-2$",
      "$-4$",
      "$1$",
      "$4$"
    ],
    "answer": "①",
    "solution": "$f$의 역함수는 $f^{-1}(x)=1+\\dfrac a{x-3}$이다. $1\\ne3$, $a\\ne0$이므로 두 그래프는 완전히 일치하지 않는다.\n두 식을 같게 놓고 $x\\ne1,3$에서 정리하면 $(x-1)(x-3)=a$, 즉 $x^2-4x+3-a=0$이다.\n두 그래프가 정확히 한 점에서 만나려면 판별식 $D=(-4)^2-4(3-a)=4+4a$가 $0$이어야 한다. 따라서 $a=-1$이다.\n이때 중근 $x=2$는 분모의 영점이 아니고 $f(2)=2$이므로 교점 $(2,2)$ 하나가 실제 존재한다. 따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-B2-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: B2",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT",
      "crossConceptKeys": [
        "CC_DISCRIMINANT"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "INTERSECTION_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "CC_DISCRIMINANT: 두 그래프의 유일 공통점 조건을 판별식 D=0으로 해석.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "서로 다른 역함수 두 그래프의 공통점 한 개를 중근 조건으로 환원한다.",
        "assessmentBucket": "함수/역함수 완전 일치 여부와 중근 판별식, 분모 영점 제외를 병행한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q14-B3",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "$a$가 $-3\\le a\\le3$인 $0$이 아닌 정수일 때 함수 $f(x)=2+\\dfrac{a}{x-2}$의 역함수는 자기 자신이다. 이 중 $y=f(x)$와 직선 $y=x$가 서로 다른 두 점에서 만나는 $a$의 개수는?",
    "choices": [
      "$3$",
      "$1$",
      "$2$",
      "$0$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$f(x)=x$를 풀면 $2+\\dfrac a{x-2}=x$이므로 $(x-2)^2=a$이고 $x\\ne2$이다.\n$a>0$이면 $x=2\\pm\\sqrt a$가 서로 다른 두 실수이고, $a<0$이면 실근이 없다. $a=0$은 문제에서 제외했다.\n따라서 주어진 정수 $a=-3,-2,-1,1,2,3$ 중 $1,2,3$의 세 값만 조건을 만족한다.\n한편 모든 $a\\ne0$에서 $f^{-1}=f$라 하여 두 함수의 그래프가 완전히 일치하는 사실은 직선 $y=x$와의 교점 개수와 구별해야 한다.\n따라서 정답은 ①이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-B3-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: B3",
    "solutionImageCaption": "a=1인 실선과 a=−1인 점선 비교 (예시). 전체 a 값의 실수 근 판정은 해설 계산을 따른다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE",
      "crossConceptKeys": [
        "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT"
      ],
      "conditionKeys": [
        "COND_NONZERO",
        "COND_INTEGER",
        "COND_RANGE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "INTERSECTION_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-GRAPH-COINCIDENCE GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT: 두 그래프 f와 f⁻¹의 완전 일치와 직선 y=x 위 고정점의 개수를 분리하는 추가 판단.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건. COND_INTEGER : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건. COND_RANGE : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "두 그래프 자체의 일치와 y=x 고정점 개수를 구별하여 정수 매개변수의 부호별로 분기한다.",
        "assessmentBucket": "음수의 제곱 불가·정수 a와 실수 x 조건 차이를 동시에 관리한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q14-C1",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "실수 $b$와 양수 $a$에 대하여 $f(x)=b+\\dfrac a{x-b}$라 하자. 그래프 $y=f(x)$와 직선 $y=x$의 두 교점을 $P,Q$라 할 때, 선분 $PQ$의 중점이 $(2,2)$이고 $PQ=6\\sqrt2$이다. $a+b$의 값은?",
    "choices": [
      "$5$",
      "$8$",
      "$9$",
      "$11$",
      "$20$"
    ],
    "answer": "④",
    "solution": "$f(f(x))=x$이므로 $f$는 자기 자신이 역함수이다. 그러나 문제의 두 점은 두 일치하는 그래프 전체의 교점이 아니라 직선 $y=x$와의 교점이다.\n$f(x)=x$를 정리하면 $(x-b)^2=a$이므로 $P(b-\\sqrt a,b-\\sqrt a)$, $Q(b+\\sqrt a,b+\\sqrt a)$이다.\n중점은 $(b,b)=(2,2)$이므로 $b=2$이다.\n$PQ=\\sqrt{(2\\sqrt a)^2+(2\\sqrt a)^2}=2\\sqrt{2a}$이고 $2\\sqrt{2a}=6\\sqrt2$이므로 $\\sqrt a=3$, $a=9$이다.\n따라서 $a+b=9+2=11$이고 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-C1-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: C1",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "TPL_INVERSE_GRAPH_GEOMETRY",
      "crossConceptKeys": [
        "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT",
        "CC_DISTANCE_TWO_POINTS",
        "CC_MIDPOINT"
      ],
      "conditionKeys": [
        "COND_POSITIVE"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 4,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "TPL_INVERSE_GRAPH_GEOMETRY ACTIVE: 대칭으로 대응점을 복원한 후 거리/중점 조건에 사용.",
        "cross": "EXT-CROSS-H1-C2-07-GRAPH-COINCIDENCE-FIXED-POINT: 두 그래프 f와 f⁻¹의 완전 일치와 직선 y=x 위 고정점의 개수를 분리하는 추가 판단. / CC_DISTANCE_TWO_POINTS: y=x를 기준으로 대응하는 두 점의 좌표 차를 제곱합·근호로 계산. / CC_MIDPOINT: 두 고정점의 좌표 평균이 b임을 이용해 매개변수를 결정.",
        "condition": "COND_POSITIVE : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "자기 역함수인 그래프와 대각선 고정점을 구분하고 교점의 중점·거리로 매개변수 결정한다.",
        "assessmentBucket": "일치/교점 차이와 정해진 대각선 방향 거리, 두 조건의 연립을 정확히 통합해야 한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q14-C2",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "$a\\ne0$, $c\\ne1$인 실수 $a,c$에 대하여 $f(x)=c+\\dfrac a{x-1}$이라 하자. $y=f(x)$와 $y=f^{-1}(x)$의 그래프가 오직 점 $(2,2)$에서만 만날 때, $c-a$의 값은?",
    "choices": [
      "$-4$",
      "$2$",
      "$4$",
      "$3$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$f^{-1}(x)=1+\\dfrac a{x-c}$이고 $c\\ne1$이므로 두 그래프는 완전히 동일하지 않다.\n두 식의 공통점을 구하면 $(x-1)(x-c)=a$이므로 $x^2-(1+c)x+c-a=0$이다. 한 교점의 x좌표가 $2$이며 다른 교점이 없으므로 $x=2$가 중근이다.\n중근 두 개의 합이 $4$이므로 $1+c=4$에서 $c=3$이다. $x=2$를 대입하여 $a=(2-1)(2-3)=-1$을 얻는다.\n$a\\ne0$, $c\\ne1$이고 $x=2$는 두 분모의 영점이 아니므로 조건을 만족한다.\n따라서 $c-a=3-(-1)=4$이고 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-C2-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: C2",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT",
      "crossConceptKeys": [
        "CC_DISCRIMINANT",
        "CC_SIMULTANEOUS_EQUATION"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "INTERSECTION_BOUNDARY",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "CC_DISCRIMINANT: 두 그래프의 유일 공통점 조건을 판별식 D=0으로 해석. / CC_SIMULTANEOUS_EQUATION: 두 고정점/중근으로부터 계수에 관한 두 식을 얻어 연립.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "역함수의 공통점 한 개라는 조건을 중근으로 복원하여 서로 다른 두 계수를 정한다.",
        "assessmentBucket": "두 함수 일치 예외, 한 점=이중근, 근의 합·대입식의 연립, 제외점 검사를 결합한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q14-C3",
    "sourceQid": 14,
    "sourceUid": "qid_v1_cbcbb1d3488286a391a8387d4d050f788da9339e9a91f7755b8fd50970080985",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "PLUS_ONE",
    "level": "상",
    "category": "역함수의 그래프",
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
      "그래프"
    ],
    "wide": false,
    "content": "$a\\ne0$, $c\\ne1$인 실수 $a,c$에 대하여 $f(x)=c+\\dfrac a{x-1}$이라 하자. $y=f(x)$와 $y=f^{-1}(x)$의 그래프가 두 점 $(-1,-1)$, $(5,5)$에서 만날 때, $a+c$의 값은?",
    "choices": [
      "$-5$",
      "$4$",
      "$8$",
      "$12$",
      "$11$"
    ],
    "answer": "⑤",
    "solution": "$f^{-1}(x)=1+\\dfrac a{x-c}$이다. $c\\ne1$이므로 두 그래프가 완전히 겹치지는 않으며, 공통점의 x좌표는 $(x-1)(x-c)=a$를 만족한다.\n$x=-1$에서 $a=(-2)(-1-c)=2(c+1)$이다.\n$x=5$에서 $a=4(5-c)=20-4c$이다.\n따라서 $2c+2=20-4c$, $6c=18$, $c=3$이고 $a=2(c+1)=8$이다.\n$(x-1)(x-3)=8$은 $(x+1)(x-5)=0$과 같으므로 두 허용 점에서만 교점이 생긴다.\n따라서 $a+c=8+3=11$이고 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q14-C3-solution.svg",
    "solutionImageAlt": "함수의 그래프, 역함수의 그래프와 직선 y=x의 대칭·교점 구조: C3",
    "solutionImageCaption": "원함수·역함수의 그래프와 y=x 위 점을 구별하여 확인한다.",
    "solutionImageSize": "medium",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-256",
      "rpmL1": "함수",
      "rpmL2": "함수",
      "rpmL3": "역함수",
      "rpmL4": "그래프 대칭",
      "rpmMappingStatus": "DIRECT_ACTIVE",
      "rpmBindingEvidence": "2022 공통수학2 H1-RPM-256 → H22-C2-07-FUNCTION_INVERSE; ACTIVE PT_INVERSE_GRAPH/TPL_INVERSE_GRAPH_GEOMETRY. Generated template도 parent는 H1-RPM-256.",
      "problemTypeKey": "PT_INVERSE_GRAPH",
      "templateKey": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT",
      "crossConceptKeys": [
        "CC_QUADRATIC_EQUATION",
        "CC_SIMULTANEOUS_EQUATION"
      ],
      "conditionKeys": [
        "COND_NONZERO"
      ],
      "integrationPattern": "INTERDEPENDENT",
      "difficultyBucket": 5,
      "difficultyConfidence": "high",
      "difficultyBoundaryFlag": "NONE",
      "legacyLevelCompatibility": "UNKNOWN",
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN",
        "CONSUMER_INDEX_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q14은 f(x)=1/x의 자기역함수·두 그래프 겹침/대칭 판정이 핵심. 기존 RPM H1-RPM-256 (공통수학2/함수/역함수/그래프 대칭) DIRECT_ACTIVE 재사용.",
        "l4": "H1-RPM-256 L4 그래프 대칭; H1-RPM-255 역함숫값 또는 기존 Generated 점읽기/무리함수 교점 확장보다 실제 원본 평가 목표가 일치한다.",
        "pt": "PT_INVERSE_GRAPH ACTIVE. 두 역함수 그래프의 대칭과 공통점 또는 대응점이 최종 계산의 출발점이다.",
        "tpl": "EXT-TPL-H1-C2-07-INVERSE-INTERSECTION-FIXED-POINT GENERATED_ACTIVE: 기존 거리·넓이형 TPL_INVERSE_GRAPH_GEOMETRY와 다른 그래프 중첩/공통점 판단 문형.",
        "cross": "CC_QUADRATIC_EQUATION: 원함수와 역함수의 공통점을 이차방정식으로 환원해 실근을 구함. / CC_SIMULTANEOUS_EQUATION: 두 고정점/중근으로부터 계수에 관한 두 식을 얻어 연립.",
        "condition": "COND_NONZERO : 0 배제·정수·범위·양수 중 실제 해 존재 및 정의역을 제한하는 조건.",
        "integration": "역함수 그래프의 식·조건 및 보조 개념을 결합해 공통점/파라미터를 함께 판정.",
        "learningLevel": "서로 다른 역함수 두 그래프의 두 공통점을 이차식 조건으로 바꾸어 계수를 연립한다.",
        "assessmentBucket": "두 교점의 중복 없는 성립, 함수·역함수 구별, 근 조건과 계수 연립을 모두 검증한다.",
        "problemVisual": "EXEMPT: 모든 함수식·정의역·공역·수치·질문이 발문에 명시되어 그림 없이는 풀이 불가능한 조건이 없다.",
        "solutionVisual": "BENEFICIAL: 원함수·역함수·직선 y=x의 차이/겹침을 도형으로 설명할 교육적 효과가 있어 좌표에 근거한 SVG 제작.",
        "curriculum": "2022 공통수학2 역함수·유리함수/그래프, 공통수학1 이차방정식·판별식, 평면좌표의 중점·거리만 사용. 미분·벡터 등 교육과정 밖 방법 사용 없음.",
        "sourceOrigin": "원본 출처 2025 팔마고 2학기 기말 q14 H22-C2-07-FUNCTION_BASIC 불변. Generated는 핵심 실제 풀이에 맞춰 H22-C2-07-FUNCTION_INVERSE로 분류."
      }
    }
  }
];
