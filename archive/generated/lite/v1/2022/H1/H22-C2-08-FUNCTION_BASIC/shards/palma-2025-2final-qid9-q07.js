window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-PALMA25-2FINAL-Q07-A1",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "A1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값"
    ],
    "wide": false,
    "content": "정의역이 $0\\le  x\\le 4$인 유리함수 $f(x)=\\dfrac{5x+k}{x+1}$의 최댓값이 $3$일 때, 실수 $k$의 값은?",
    "choices": [
      "$-5$",
      "$-8$",
      "$-17$",
      "$-3$",
      "$3$"
    ],
    "answer": "①",
    "solution": "분모 $x+1$은 주어진 구간에서 양수이다. 먼저 함수를 $f(x)=5+\\dfrac{k-5}{x+1}$로 나타낸다.\n최댓값이 $3$이므로 구간의 모든 $x$에서 $f(x)\\le 3<5$이다. 따라서 $k-5<0$이다.\n이때 $x$가 증가하면 양수 $x+1$이 커지고 음수인 $\\dfrac{k-5}{x+1}$은 증가한다. 그러므로 $f$는 주어진 구간에서 증가한다.\n최댓값은 오른쪽 끝점 $x=4$에서 가지므로 $f(4)=\\dfrac{20+k}{5}=3$이다.\n$20+k=15$에서 $k=-5$이고, 이때 $f(0)=-5$, $f(4)=3$이다. 조건과 일치한다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "끝점 대응값을 비교하는 직접 유형, current ACTIVE TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: 수평점근선 5보다 낮은 최댓값 → 음의 분자 잔여항 → 증가 → 오른쪽 끝점 대입",
        "learningLevel": "하: 표준형의 부호로 단조성을 확인하고 끝점 한 곳을 대입하면 끝난다. 경우 분기가 없다.",
        "assessmentBucket": "2: 분모가 양수인 조건과 증가 여부 확인이 필요하지만, 매개변수의 부호는 최대값 3<5에서 바로 결정된다."
      }
    }
  },
  {
    "id": 2,
    "uid": "ALITE-PALMA25-2FINAL-Q07-A2",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "A2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최솟값"
    ],
    "wide": false,
    "content": "정의역이 $1\\le  x\\le 5$인 유리함수 $f(x)=\\dfrac{2x-k}{x+2}$의 최솟값이 $1$일 때, 실수 $k$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$3$"
    ],
    "answer": "②",
    "solution": "주어진 구간에서 $x+2>0$이다. 함수를 $f(x)=2-\\dfrac{k+4}{x+2}$로 고쳐 쓴다.\n최솟값이 $1$이므로 모든 $x$에서 $f(x)\\ge 1$이고, 특히 함수값은 $2$보다 작은 값 $1$을 갖는다. 따라서 $k+4>0$이다.\n$-\\dfrac{k+4}{x+2}$는 $x$가 커질수록 증가하므로 최솟값은 왼쪽 끝점 $x=1$에서 가진다.\n$f(1)=\\dfrac{2-k}{3}=1$이므로 $2-k=3$, $k=-1$이다.\n이때 $f(1)=1$, $f(5)=\\dfrac{11}{7}>1$이므로 최솟값 조건을 만족한다.\n따라서 정답은 ②이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "끝점 대응값을 비교하는 직접 유형, current ACTIVE TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: 최솟값 1<2 → 분수 계수 부호 → 증가 → 왼쪽 끝점에서 k",
        "learningLevel": "하: 최솟값이 수평기준 2보다 낮다는 사실로 증가 방향이 곧바로 결정된다.",
        "assessmentBucket": "2: 분자의 마이너스와 왼쪽 끝점의 대응을 틀릴 여지는 있으나 계산은 일차식이다."
      }
    }
  },
  {
    "id": 3,
    "uid": "ALITE-PALMA25-2FINAL-Q07-A3",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "A3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "STRICT_VARIANT",
    "level": "하",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값"
    ],
    "wide": false,
    "content": "정의역이 $1\\le  x\\le 5$인 유리함수 $f(x)=\\dfrac{5x+k}{x+3}$의 최댓값이 $4$일 때, 실수 $k$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$11$",
      "$15$",
      "$32$"
    ],
    "answer": "①",
    "solution": "분모는 정의역에서 항상 양수이고 $f(x)=5+\\dfrac{k-15}{x+3}$이다.\n최댓값 $4$가 수평기준 $5$보다 작으므로 $k-15<0$이다.\n음수인 $\\dfrac{k-15}{x+3}$은 $x$가 증가할수록 $0$에 가까워지며 증가하므로 $f$도 증가한다.\n따라서 $x=5$에서 최댓값을 가진다. $\\dfrac{25+k}{8}=4$이므로 $25+k=32$, $k=7$이다.\n이때 $f(1)=\\dfrac{12}{4}=3$이고 $f(5)=\\dfrac{32}{8}=4$이므로 조건을 만족한다.\n따라서 정답은 ①이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 3,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "끝점 대응값을 비교하는 직접 유형, current ACTIVE TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: 최댓값4<기준5 → 증가 → x5 대입 → k7",
        "learningLevel": "하: 기준값 5와 최대값 4의 비교로 증가 방향이 결정되고 한 끝점의 식만 푼다.",
        "assessmentBucket": "3: 분자 $5x$와 분모 $x+3$를 동시에 처리해야 하고, 정수계수 계산/끝점 선택에서 실수가 비교적 쉽다. 사고 깊이 자체는 '하'로 유지한다."
      }
    }
  },
  {
    "id": 4,
    "uid": "ALITE-PALMA25-2FINAL-Q07-B1",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "B1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "하",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최솟값"
    ],
    "wide": false,
    "content": "정의역이 $0\\le  x\\le 4$인 유리함수 $f(x)=\\dfrac{3x+k}{x+2}$의 최솟값이 $5$일 때, 실수 $k$의 값은?",
    "choices": [
      "$-7$",
      "$8$",
      "$10$",
      "$16$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "함수를 $f(x)=3+\\dfrac{k-6}{x+2}$로 나타내면 분모 $x+2$는 구간에서 양수이다.\n최솟값이 $5>3$이므로 $k-6>0$이어야 한다. 이때 양수인 $\\dfrac{k-6}{x+2}$는 분모가 커질수록 작아진다.\n따라서 $f(x)$는 감소하고 최솟값은 $x=4$에서 가진다.\n$\\dfrac{12+k}{6}=5$에서 $12+k=30$, $k=18$이다.\n이때 $f(0)=9$, $f(4)=5$이므로 실제 최솟값이 $5$이다.\n따라서 정답은 ⑤이다.",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 2,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "끝점 대응값을 비교하는 직접 유형, current ACTIVE TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: 최솟값5>기준3 → 감소 → 오른쪽 끝점에 대입",
        "learningLevel": "하: 수평기준 3보다 큰 최솟값이므로 감소 방향이 직접 정해지고 한 끝점 식만 계산한다. B 슬롯이라는 이유로 중으로 올리지 않았다.",
        "assessmentBucket": "2: 감소·최솟값 위치가 명확하며 복합 경우 분기가 없다."
      }
    }
  },
  {
    "id": 5,
    "uid": "ALITE-PALMA25-2FINAL-Q07-B2",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "B2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값",
      "최솟값",
      "그래프"
    ],
    "wide": false,
    "content": "정의역이 $0\\le  x\\le 4$인 유리함수 $f(x)=\\dfrac{3x+k}{x+2}$에서 $k>6$이다. 최댓값과 최솟값의 차이가 $3$일 때, 실수 $k$의 값은?",
    "choices": [
      "$-3$",
      "$3$",
      "$9$",
      "$12$",
      "$15$"
    ],
    "answer": "⑤",
    "solution": "함수를 $f(x)=3+\\dfrac{k-6}{x+2}$로 나타내자. $k>6$이므로 $k-6>0$이다.\n주어진 구간에서 $x+2$가 증가할수록 분수항은 감소한다. 따라서 최대는 $x=0$, 최소는 $x=4$에서 갖는다.\n최댓값은 $f(0)=\\dfrac{k}{2}$이고 최솟값은 $f(4)=\\dfrac{12+k}{6}$이다.\n두 값의 차가 $3$이므로 $\\dfrac{k}{2}-\\dfrac{12+k}{6}=3$이다.\n$\\dfrac{3k-(12+k)}{6}=3$에서 $2k-12=18$, $k=15$이다.\n$15>6$이고 실제 최댓값은 $\\dfrac{15}{2}$, 최솟값은 $\\dfrac92$이므로 차는 $3$이다.\n따라서 정답은 ⑤이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q07-B2-solution.svg",
    "solutionImageAlt": "B2: 구간 위 유리함수의 최대·최소 판단과 끝점·조건을 보여주는 해설 시각자료",
    "solutionImageCaption": "같은 그래프에서 두 끝점의 높이 차이를 직접 표시하면 최대·최소 차와 증가/감소의 연결이 명확해진다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 4,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "매개변수에 따른 극값 조건의 방정식·분기·약수 필터를 이용, current ACTIVE TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: k>6 → 감소 확인 → 두 끝점 값 → 차 방정식 → k15",
        "learningLevel": "중: k>6을 써서 감소 방향을 먼저 결정한 뒤 최대·최소를 각각 구하고 차의 방정식을 세워야 한다.",
        "assessmentBucket": "4: 계수 부호, 최대·최소 순서, 끝점 값 차의 상수항 이항을 모두 맞춰야 한다."
      }
    }
  },
  {
    "id": 6,
    "uid": "ALITE-PALMA25-2FINAL-Q07-B3",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "B3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "EXAM_FOLLOWUP",
    "level": "중",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값",
      "최솟값",
      "표"
    ],
    "wide": false,
    "content": "정수 $k$가 $0\\le  k\\le 5$일 때, 정의역이 $0\\le  x\\le 3$인 함수 $f(x)=\\dfrac{2x+k}{x+1}$의 최솟값은 $1$ 이상이고 최댓값은 $3$ 이하이다. 이를 만족하는 $k$의 개수는?",
    "choices": [
      "$1$",
      "$3$",
      "$2$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "주어진 함수는 $f(x)=2+\\dfrac{k-2}{x+1}$이고 $0\\le  x\\le 3$에서 분모가 양수이다.\n$k>2$이면 감소하고, $k<2$이면 증가하며, $k=2$이면 항상 $2$이다. 따라서 모든 경우 최댓값·최솟값은 두 끝점의 함수값에서 결정된다.\n양 끝점은 $f(0)=k$, $f(3)=\\dfrac{6+k}{4}$이다.\n최솟값이 $1$ 이상이고 최댓값이 $3$ 이하라는 것은 두 끝점의 값이 모두 $1$ 이상 $3$ 이하라는 뜻이다.\n먼저 $1\\le  f(0)=k\\le 3$이므로 정수 후보는 $k=1,2,3$이다.\n이때 $f(3)$은 각각 $\\dfrac74$, $2$, $\\dfrac94$로 모두 $1$ 이상 $3$ 이하이다. $k=2$일 때의 상수함수도 조건을 만족한다.\n따라서 가능한 $k$는 $1,2,3$의 세 개이다.\n따라서 정답은 ②이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q07-B3-solution.svg",
    "solutionImageAlt": "B3: 구간 위 유리함수의 최대·최소 판단과 끝점·조건을 보여주는 해설 시각자료",
    "solutionImageCaption": "k=0~5의 두 끝점 함수값과 제외 이유를 나란히 보여주는 경우표는 상수함수 경계 및 조건 누락을 학습시키는 새 정보다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE",
        "COND_INTEGER",
        "COND_FUNCTION_VALUE_CONSTRAINT"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 3,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "매개변수에 따른 극값 조건의 방정식·분기·약수 필터를 이용, current ACTIVE TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE, COND_INTEGER, COND_FUNCTION_VALUE_CONSTRAINT: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "CASE_BRANCH: 단조 또는 상수 → 모든 x의 조건을 끝점 2개로 환원 → k1,2,3 전수",
        "learningLevel": "중: k=2의 상수함수 경계와 증가·감소 방향을 함께 고려하되, 결국 두 끝점 부등식으로 정리할 수 있다.",
        "assessmentBucket": "3: 0≤k≤5의 작은 정수 범위, 두 끝점 검사 및 경계 k=2의 포함 여부가 핵심이다. 여러 단계라도 직접 열거 가능해 4/5로 올리지 않았다."
      }
    }
  },
  {
    "id": 7,
    "uid": "ALITE-PALMA25-2FINAL-Q07-C1",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "C1",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "중",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값",
      "최솟값",
      "그래프"
    ],
    "wide": false,
    "content": "정의역이 $-2\\le  x\\le 0$ 또는 $3\\le  x\\le 6$인 유리함수 $f(x)=1+\\dfrac{12}{x-2}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은?",
    "choices": [
      "$13$",
      "$15$",
      "$17$",
      "$18$",
      "$19$"
    ],
    "answer": "④",
    "solution": "정의역은 두 구간으로 나누어져 있고, 점근선 $x=2$는 어느 구간에도 포함되지 않는다.\n$x\\ne2$에서 $f(x)=1+\\dfrac{12}{x-2}$이며, 각 구간 안에서는 $x$가 증가하면 $\\dfrac{12}{x-2}$가 감소한다.\n첫째 구간 $-2\\le  x\\le 0$에서 $f(-2)=1+\\dfrac{12}{-4}=-2$, $f(0)=1+\\dfrac{12}{-2}=-5$이다.\n둘째 구간 $3\\le  x\\le 6$에서 $f(3)=1+\\dfrac{12}{1}=13$, $f(6)=1+\\dfrac{12}{4}=4$이다.\n네 끝점 값 $-2,-5,13,4$를 비교하면 최댓값은 $M=13$, 최솟값은 $m=-5$이다.\n따라서 $M-m=13-(-5)=18$이다.\n따라서 정답은 ④이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q07-C1-solution.svg",
    "solutionImageAlt": "C1: 구간 위 유리함수의 최대·최소 판단과 끝점·조건을 보여주는 해설 시각자료",
    "solutionImageCaption": "수직점근선을 사이에 둔 두 떨어진 구간과 최솟값·최댓값의 위치를 그림으로 보여주면 선택 착각을 예방한다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 4,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "끝점 대응값을 비교하는 직접 유형, current ACTIVE TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "CASE_BRANCH: 정의역 두 구간 분리 → 네 끝점 값 → 전체 최대/최소 → 차",
        "learningLevel": "중: 정의역이 둘로 끊기므로 한 구간의 끝점 비교가 아니라 네 끝점 함수값을 모아 비교해야 한다.",
        "assessmentBucket": "4: 수직점근선 좌우의 분수 부호, 두 구간 각각의 감소 방향, 최댓값·최솟값 선택을 연달아 처리한다. 미적분 없이 해법은 명료해 상은 아니다."
      }
    }
  },
  {
    "id": 8,
    "uid": "ALITE-PALMA25-2FINAL-Q07-C2",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "C2",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "상",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값",
      "최솟값",
      "그래프"
    ],
    "wide": false,
    "content": "정의역이 $0\\le  x\\le 4$인 유리함수 $f(x)=\\dfrac{ax+b}{x+1}$의 최솟값이 $2$, 최댓값이 $6$이다. $a>3$일 때, $a+b$의 값은? (단, $a,b$는 실수이다.)",
    "choices": [
      "$7$",
      "$\\dfrac{15}{2}$",
      "$9$",
      "$\\dfrac{21}{2}$",
      "$11$"
    ],
    "answer": "③",
    "solution": "주어진 함수는 $f(x)=a+\\dfrac{b-a}{x+1}$이다. 따라서 함수는 증가·감소 또는 상수 중 하나이며, 최댓값과 최솟값은 구간의 두 끝점에서 결정된다.\n두 끝점은 $f(0)=b$, $f(4)=\\dfrac{4a+b}{5}$이다. 최솟값 $2$와 최댓값 $6$이 서로 다르므로 두 끝점 값의 순서를 나누어야 한다.\n첫째, $f(0)=2$, $f(4)=6$이면 $b=2$, $\\dfrac{4a+2}{5}=6$이다. $4a+2=30$에서 $a=7$이며 $a>3$을 만족한다.\n둘째, $f(0)=6$, $f(4)=2$이면 $b=6$, $\\dfrac{4a+6}{5}=2$이다. $4a+6=10$에서 $a=1$이므로 $a>3$을 만족하지 않아 제외한다.\n따라서 $a=7$, $b=2$이고 $a+b=9$이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q07-C2-solution.svg",
    "solutionImageAlt": "C2: 구간 위 유리함수의 최대·최소 판단과 끝점·조건을 보여주는 해설 시각자료",
    "solutionImageCaption": "두 단조 방향의 다른 그래프를 실선·점선으로 비교하면 동일한 최대·최솟값에서 a>3이 결정적이라는 사실을 보여준다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
      "crossConceptKeys": [],
      "conditionKeys": [
        "COND_RANGE",
        "COND_FUNCTION_VALUE_CONSTRAINT"
      ],
      "integrationPattern": "CASE_BRANCH",
      "difficultyBucket": 4,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "매개변수에 따른 극값 조건의 방정식·분기·약수 필터를 이용, current ACTIVE TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
        "cross": "별도 교과 개념 결합 없이 유리함수와 구간 끝점 비교·기본 대수연산만으로 해결; 근거 없는 추가 CrossConcept 없음.",
        "condition": "COND_RANGE, COND_FUNCTION_VALUE_CONSTRAINT: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "CASE_BRANCH: 증가/감소 양쪽 끝점 대응 두 경우 → 각 a,b → a>3 제외 → 합",
        "learningLevel": "상: 최댓값 6과 최솟값 2가 두 끝점 중 어느 쪽에 대응하는지 두 경우를 세우고 a>3으로 한 경우를 제거해야 한다.",
        "assessmentBucket": "4: 경우를 반대로 설정한 오답 7의 위험이 크지만 연립은 일차계산이며 경계값의 연속적인 추적은 요구하지 않는다."
      }
    }
  },
  {
    "id": 9,
    "uid": "ALITE-PALMA25-2FINAL-Q07-C3",
    "sourceQid": 7,
    "sourceUid": "qid_v1_f198ca07a6b64efe0d09bf19a92bdfb7f33378e8b20bb1e45d280e29d0b9d442",
    "slot": "C3",
    "provenance": "ALIVE_GENERATED",
    "modeCandidate": "TYPE_BANK",
    "level": "상",
    "category": "유리함수의 최대·최소",
    "originalCategory": "유리함수",
    "standardCourse": "공통수학2",
    "standardUnitKey": "H22-C2-08",
    "standardUnit": "유리함수",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
    "subUnit": "함수의 뜻과 그래프",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "유리함수",
      "정의역",
      "최댓값",
      "최솟값",
      "표"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 정의역이 $n\\le  x\\le  n+3$인 함수 $f(x)=2+\\dfrac{12}{x+1}$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M$이 $6$ 이하의 정수이고 $m\\ge 3$이 되도록 하는 $n$의 개수는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$6$"
    ],
    "answer": "③",
    "solution": "자연수 $n$에 대해 정의역 전체에서 $x+1>0$이다. 분자가 양수인 $\\dfrac{12}{x+1}$는 $x$가 커질수록 감소하므로 $f$도 감소한다.\n따라서 $M=f(n)=2+\\dfrac{12}{n+1}$, $m=f(n+3)=2+\\dfrac{12}{n+4}$이다.\n$M$이 정수이려면 $\\dfrac{12}{n+1}$이 양의 정수이어야 하므로 $n+1$은 $12$의 양의 약수이다.\n또 $M\\le 6$에서 $\\dfrac{12}{n+1}\\le 4$이므로 $n+1\\ge 3$이다.\n$12$의 약수 중 $3$ 이상인 것은 $3,4,6,12$이므로 우선 $n=2,3,5,11$이다.\n나머지 조건 $m\\ge 3$을 적용하면 $2+\\dfrac{12}{n+4}\\ge 3$, 즉 $\\dfrac{12}{n+4}\\ge 1$이다.\n$n+4>0$이므로 $n+4\\le 12$, 곧 $n\\le 8$이다. 따라서 후보 $2,3,5,11$ 중 $11$을 제외한다.\n$n=2,3,5$에서는 $m=4,\\dfrac{26}{7},\\dfrac{10}{3}$으로 모두 $3$ 이상이므로 가능한 $n$은 세 개이다.\n따라서 정답은 ③이다.",
    "solutionImage": "assets/generated-lite/qid9/ALITE-PALMA25-2FINAL-Q07-C3-solution.svg",
    "solutionImageAlt": "C3: 구간 위 유리함수의 최대·최소 판단과 끝점·조건을 보여주는 해설 시각자료",
    "solutionImageCaption": "약수 후보 n=2,3,5,11과 최솟값 필터 결과를 표로 표시하여 이중 조건의 단계별 제외 근거를 직접 보여준다.",
    "solutionImageSize": "full",
    "meta": {
      "primaryRpmL3Id": "H1-RPM-264",
      "rpmL1": "함수",
      "rpmL2": "유리함수",
      "rpmL3": "유리함수의 활용",
      "rpmL4": "유리함수의 최대·최소",
      "rpmMappingStatus": "RPM_ONLY",
      "rpmBindingEvidence": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json H1-RPM-264 RPM_ONLY; PT_FUNCTION_EXTREMUM and template separately ACTIVE in FUNCTIONS_GRAPHS bindings H22-C2-08",
      "problemTypeKey": "PT_FUNCTION_EXTREMUM",
      "templateKey": "TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
      "crossConceptKeys": [
        "CC_NUMBER_DIVISOR_MULTIPLE"
      ],
      "conditionKeys": [
        "COND_RANGE",
        "COND_INTEGER",
        "COND_FUNCTION_VALUE_CONSTRAINT"
      ],
      "integrationPattern": "SEQUENTIAL",
      "difficultyBucket": 5,
      "metadataDebt": [
        "ACTUAL_BROWSER_NOT_RUN"
      ],
      "reasons": {
        "rpm": "원본 q07과 같이 제한된 정의역에서 유리함수의 끝점·증가/감소에 따른 최댓값·최솟값을 판단하는 단계가 반드시 필요하다.",
        "l4": "RPM L4 최대·최소는 실제 구간 끝점 극값·최소/최대 조건의 정의에 적용됨. RPM_ONLY를 DIRECT_ACTIVE로 승격하지 않음.",
        "pt": "PT_FUNCTION_EXTREMUM ACTIVE/H22-C2-08 binding: 구간 위 함수의 최대/최소 또는 그 조건을 문항의 본질적 목표로 이용.",
        "tpl": "매개변수에 따른 극값 조건의 방정식·분기·약수 필터를 이용, current ACTIVE TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL",
        "cross": "핵심 풀이 감소 → M/m 끝점 분리 → M 정수 약수 후보 → M≤6 → m≥3 필터에서 CC_NUMBER_DIVISOR_MULTIPLE가 추가로 필요; 정본 ACTIVE concept registry 대조.",
        "condition": "COND_RANGE, COND_INTEGER, COND_FUNCTION_VALUE_CONSTRAINT: 실제 풀이에서 닫힌 구간/정수/최댓값·최솟값 제한을 적용함.",
        "integration": "SEQUENTIAL: 감소 → M/m 끝점 분리 → M 정수 약수 후보 → M≤6 → m≥3 필터",
        "learningLevel": "상: 구간 끝점 최대·최소 식을 구한 후 정수성으로 약수 후보를 만든 다음 두 번째 부등식으로 후보를 걸러야 한다.",
        "assessmentBucket": "5: 12의 약수 조건·최댓값의 등호 허용·최솟값의 추가 범위·자연수 조건의 네 층을 누락 없이 결합해야 한다."
      }
    }
  }
];
