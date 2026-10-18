window.examTitle = "19_제일고_2학기_중간_고2_수학II";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "다음 중 수렴하지 않는 함수의 극한을 고르면? [3.6점]",
    "choices": [
      "$\\lim_{x \\to 4} \\sqrt{x}$",
      "$\\lim_{x \\to -3} \\frac{x^2-9}{x+3}$",
      "$\\lim_{x \\to -\\infty} \\frac{1}{|x+1|}$",
      "$\\lim_{x \\to 0} \\frac{x}{|x|}$",
      "$\\lim_{x \\to 0-} \\sqrt{-x}$"
    ],
    "images": [],
    "answer": "④",
    "solution": "각 극한이 존재하는지 좌극한과 우극한을 구별합니다.<br>① $\\lim_{x\\to4}\\sqrt{x}=2$입니다.<br>② $x\\ne-3$에서 $\\frac{x^2-9}{x+3}=x-3$이므로 극한은 $-6$입니다.<br>③ $x\\to-\\infty$이면 $|x+1|\\to\\infty$이므로 극한은 $0$입니다.<br>④ $x>0$일 때 $\\frac{x}{|x|}=1$, $x<0$일 때 $-1$입니다. 좌극한 $-1$과 우극한 $1$이 다르므로 두 쪽 극한은 존재하지 않습니다.<br>⑤ $x\\to0^-$에서 $-x\\to0^+$이므로 $\\sqrt{-x}\\to0$입니다.<br>따라서 수렴하지 않는 것은 ④입니다.\n<br><strong>보기별 확인</strong><br>① 극한값은 2로 존재합니다.<br>② 약분한 뒤 -6으로 수렴합니다.<br>③ 분모가 무한히 커져 0으로 수렴합니다.<br>⑤ 0의 왼쪽에서 제곱근값이 0으로 수렴합니다.<br>",
    "level": "하",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M2-01-LIMIT",
    "subUnit": "함수의 극한",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_LIMIT_EXISTENCE",
    "templateKey": "TPL_LIMIT_EXISTENCE_TEST",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH",
    "primaryMethod": "좌우극한 비교",
    "decisiveStep": "④의 좌극한 -1, 우극한 1",
    "sourceQid": 1,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "극한값은 2로 존재합니다."
      },
      {
        "choice": 2,
        "reason": "약분한 뒤 -6으로 수렴합니다."
      },
      {
        "choice": 3,
        "reason": "분모가 무한히 커져 0으로 수렴합니다."
      },
      {
        "choice": 5,
        "reason": "0의 왼쪽에서 제곱근값이 0으로 수렴합니다."
      }
    ],
    "questionUid": "qid_v1_d2715125fe312d321ddcdc2a223616cbbdce5414a5a500e01f340b09ad5c9e8a"
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "함수 $f(x)=\\frac{|x|-1}{2x+1}$에 대하여 $\\lim_{x \\to -\\infty} f(x)$의 값으로 알맞은 것은? [3.7점]",
    "choices": [
      "$-1$",
      "$-\\frac{1}{2}$",
      "$0$",
      "$\\frac{1}{2}$",
      "$1$"
    ],
    "images": [],
    "answer": "②",
    "solution": "$x\\to-\\infty$에서는 $x<0$이므로 $|x|=-x$입니다. 따라서<br>$$\\frac{|x|-1}{2x+1}=\\frac{-x-1}{2x+1}=\\frac{-1-1/x}{2+1/x}.$$<br>$x\\to-\\infty$에서 $1/x\\to0$이므로 극한은 $-\\frac12$입니다. 분자의 절댓값을 $x$로 바꾸면 부호가 틀리므로 주의합니다. 정답은 ②입니다.\n<br><strong>보기별 확인</strong><br>① -1은 분모의 최고차항 계수 2를 빠뜨린 값입니다.<br>③ 분자와 분모가 모두 일차식이라 0이 아닙니다.<br>④ 절댓값을 x로 놓아 부호를 바꾼 결과입니다.<br>⑤ 최고차항의 부호와 계수를 모두 무시했습니다.<br>",
    "level": "하",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M2-01-LIMIT",
    "subUnit": "함수의 극한",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "절댓값 부호 분리",
    "decisiveStep": "x<0에서 |x|=-x",
    "sourceQid": 2,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "-1은 분모의 최고차항 계수 2를 빠뜨린 값입니다."
      },
      {
        "choice": 3,
        "reason": "분자와 분모가 모두 일차식이라 0이 아닙니다."
      },
      {
        "choice": 4,
        "reason": "절댓값을 x로 놓아 부호를 바꾼 결과입니다."
      },
      {
        "choice": 5,
        "reason": "최고차항의 부호와 계수를 모두 무시했습니다."
      }
    ],
    "questionUid": "qid_v1_c2f6b81ce4ce6eb513e38c5edef17015cfd6cc1b3a43c19e9ab758ccb15b56dd"
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "다항함수 $f(x)$가\n$$\\lim_{x \\to \\infty} \\frac{f(x)-x^3}{x^2}=2, \\lim_{x \\to 0} \\frac{f(x)}{x}=-3$$\n을 만족시킬 때, $f(2)$의 값으로 알맞은 것은? [3.8점]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "첫 번째 극한이 유한한 $2$이므로 $f(x)$의 최고차항은 $x^3$이고 $x^2$의 계수는 $2$입니다. 따라서 $f(x)=x^3+2x^2+bx+c$로 놓습니다.<br>두 번째 극한 $\\lim_{x\\to0}f(x)/x=-3$이 유한하려면 $c=f(0)=0$이어야 합니다. 이때<br>$$\\frac{f(x)}x=x^2+2x+b\\longrightarrow b=-3.$$<br>따라서 $f(x)=x^3+2x^2-3x$이고 $f(2)=8+8-6=10$입니다. 정답은 ⑤입니다.\n<br><strong>보기별 확인</strong><br>① 계수 조건을 모두 대입한 10과 다릅니다.<br>② 상수항 0과 일차항 -3을 반영한 값이 아닙니다.<br>③ x²항의 기여 8을 빠뜨린 값입니다.<br>④ -3x항의 기여 -6을 빠뜨린 값입니다.<br>",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M2-01-LIMIT",
    "subUnit": "함수의 극한",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_POLYNOMIAL_RECONSTRUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "다항식 계수 복원",
    "decisiveStep": "무한대 극한의 최고차항 및 0에서 상수항 제거",
    "sourceQid": 3,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "계수 조건을 모두 대입한 10과 다릅니다."
      },
      {
        "choice": 2,
        "reason": "상수항 0과 일차항 -3을 반영한 값이 아닙니다."
      },
      {
        "choice": 3,
        "reason": "x²항의 기여 8을 빠뜨린 값입니다."
      },
      {
        "choice": 4,
        "reason": "-3x항의 기여 -6을 빠뜨린 값입니다."
      }
    ],
    "questionUid": "qid_v1_6034dad7e21960fc60badacd0ef0e6c4e4a1b76362582a72fc07b50d602ed9cb"
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "$\\lim_{x \\to 4} \\frac{a\\sqrt{x+5}+b}{x-4}=\\frac{1}{6}$일 때, $a+b$의 값으로 알맞은 것은? [3.9점]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "images": [],
    "answer": "①",
    "solution": "분모 $x-4$가 $0$으로 가는데 극한이 유한하므로 분자도 $0$으로 가야 합니다. $3a+b=0$, 즉 $b=-3a$입니다.<br>$$\\frac{a\\sqrt{x+5}+b}{x-4}=a\\frac{\\sqrt{x+5}-3}{x-4}=\\frac{a}{\\sqrt{x+5}+3}.$$<br>따라서 극한은 $a/6=1/6$이므로 $a=1$, $b=-3$입니다. $a+b=-2$이므로 정답은 ①입니다.\n<br><strong>보기별 확인</strong><br>② b=-3a와 a=1을 대입하면 -1이 아닙니다.<br>③ a+b=1-3이므로 0이 아닙니다.<br>④ a만 구하고 b를 더하지 않은 값입니다.<br>⑤ 분자 소거 조건을 무시한 값입니다.<br>",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M2-01-LIMIT",
    "subUnit": "함수의 극한",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "유리화와 분자 소거",
    "decisiveStep": "3a+b=0 및 a/6=1/6",
    "sourceQid": 4,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 2,
        "reason": "b=-3a와 a=1을 대입하면 -1이 아닙니다."
      },
      {
        "choice": 3,
        "reason": "a+b=1-3이므로 0이 아닙니다."
      },
      {
        "choice": 4,
        "reason": "a만 구하고 b를 더하지 않은 값입니다."
      },
      {
        "choice": 5,
        "reason": "분자 소거 조건을 무시한 값입니다."
      }
    ],
    "questionUid": "qid_v1_78025f09edf66a3c9db1547535834806c1ca217d19a0e2e03f3491da22c95bdb"
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "다항함수 $f(x)$가 $f(0)=k+2$, $f(1)=k-3$을 만족시킬 때, 주어진 조건만으로 방정식 $f(x)=x$가 열린구간 $(0,1)$에서 적어도 하나의 실근을 갖는다고 <strong>반드시 보장할 수 있는</strong> 정수 $k$의 개수를 구한 것은? [4.0점]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "<strong>① 주어진 조건을 근의 존재 조건으로 바꿉니다.</strong><br>$f(x)=x$의 근은 $g(x)=f(x)-x$의 근과 같습니다. 다항함수 $f$는 연속이므로 $g$도 $[0,1]$에서 연속입니다.<br>$$g(0)=f(0)-0=k+2,\\qquad g(1)=f(1)-1=(k-3)-1=k-4.$$<br><strong>② 사잇값 정리를 적용할 수 있는 경우를 찾습니다.</strong><br>$g(0)>0$이고 $g(1)<0$이면 $g$는 연속이므로 열린구간 $(0,1)$에서 반드시 $0$이 됩니다. 따라서<br>$$k+2>0,\\qquad k-4<0\\quad\\Longleftrightarrow\\quad -2<k<4.$$<br>정수 $k$는 $-1,0,1,2,3$의 <strong>5개</strong>입니다.<br><strong>③ 다른 정수에서 반드시 근이 생기는지 확인합니다.</strong><br>$k\\le-2$ 또는 $k\\ge4$라면 양 끝값의 부호가 서로 반대가 아닙니다. 이때 모든 다항함수에서 내부 근이 생긴다고 보장할 수는 없습니다. 실제로<br>$$g(x)=(k+2)(1-x)+(k-4)x=k+2-6x$$<br>로 잡고 $f(x)=x+g(x)=k+2-5x$로 놓으면 원문의 두 함수값 조건을 만족합니다. 그런데 $k\\le-2$이면 $g(x)<0$, $k\\ge4$이면 $g(x)>0$가 모든 $0<x<1$에서 성립하므로 내부 근이 없습니다.<br>따라서 <strong>모든 조건을 만족하는 다항함수에 대해 근의 존재가 보장되는</strong> 정수는 정확히 5개이고, 정답은 ⑤입니다.<br><strong>선지 확인:</strong> ①~④의 1~4개는 정수 $-1,0,1,2,3$을 모두 세지 않은 값입니다.",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_VALUE_EXISTENCE_INTERVAL",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "사잇값 정리와 반례 함수 구성으로 보장 조건 판정",
    "decisiveStep": "g(0)=k+2>0, g(1)=k-4<0 및 범위 밖 선형 반례",
    "sourceQid": 5,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "AUDITED_REPAIR",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "끝점 부호 조건만으로 전체 가능한 k가 1개라고 단정할 수 없습니다."
      },
      {
        "choice": 2,
        "reason": "연속함수 내부의 굴곡을 제한하지 않아 2개로 확정할 수 없습니다."
      },
      {
        "choice": 3,
        "reason": "끝점 부호 조건은 필요조건이 아니므로 3개로 확정할 수 없습니다."
      },
      {
        "choice": 4,
        "reason": "같은 이유로 4개로 확정할 수 없습니다."
      },
      {
        "choice": 5,
        "reason": "5개는 사잇값 정리로 보장되는 정수 수일 뿐, 원문이 묻는 가능한 정수의 전체 개수가 아닙니다."
      }
    ],
    "questionUid": "qid_v1_75176afd2909fbf06706be297ebf28164a878713c239506f3c44d7e0403c745c"
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "함수 $f(x)=\\frac{a}{x+1}$가 닫힌 구간 $[1, 2]$에서 최솟값 $-1$을 가질 때 최댓값으로 알맞은 것을 고르면? [4.1점]",
    "choices": [
      "$0$",
      "$-\\frac{1}{3}$",
      "$-\\frac{2}{3}$",
      "$-1$",
      "$-\\frac{4}{3}$"
    ],
    "images": [],
    "answer": "③",
    "solution": "<strong>① 최솟값의 부호로 매개변수의 부호를 정합니다.</strong><br>$1\\le x\\le2$에서 $2\\le x+1\\le3$이므로 분모는 항상 양수입니다. 최솟값이 $-1$이라는 것은 함수값 중 음수가 있다는 뜻이므로 $a\\lt 0$입니다. ($a\\ge0$이면 $a/(x+1)\\ge0$입니다.)<br><strong>② 증가하는 방향을 확인합니다.</strong><br>$1\\le x\\lt y\\le2$에 대해<br>$$f(y)-f(x)=\\frac{a}{y+1}-\\frac{a}{x+1}=\\frac{a(x-y)}{(x+1)(y+1)}\\gt 0.$$<br>분모는 양수이고 $a\\lt 0$, $x-y\\lt 0$이므로 분자가 양수입니다. 따라서 $f$는 $[1,2]$에서 증가하고 최솟값은 왼쪽 끝 $x=1$, 최댓값은 오른쪽 끝 $x=2$에서 갖습니다.<br><strong>③ 양 끝의 함수값을 구합니다.</strong><br>$$f(1)=\\frac a2=-1\\quad\\Longrightarrow\\quad a=-2,$$<br>$$\\max_{[1,2]}f(x)=f(2)=\\frac{-2}{2+1}=-\\frac23.$$<br>따라서 정답은 <strong>③</strong>입니다.<br><strong>보기 확인</strong><br>① $a\\lt 0$이므로 최댓값도 음수입니다. ② $-\\frac13$은 $a=-1$로 잘못 놓은 값입니다. ④ $-1$은 최댓값이 아니라 최솟값입니다. ⑤ $-\\frac43$은 $x=2$의 분모 $3$과 $a=-2$를 정확히 대입한 값이 아닙니다.",
    "level": "하",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_FUNCTION_EXTREMUM",
    "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "단조성과 구간 끝값",
    "decisiveStep": "a<0이므로 최솟값 x=1",
    "sourceQid": 6,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "함수값이 전 구간에서 음수이므로 0은 최댓값이 아닙니다."
      },
      {
        "choice": 2,
        "reason": "a=-1로 잘못 결정하면 나올 수 있는 값입니다."
      },
      {
        "choice": 4,
        "reason": "-1은 x=1에서의 최솟값입니다."
      },
      {
        "choice": 5,
        "reason": "구간 끝점을 바꾸거나 분모 3을 놓친 값입니다."
      }
    ],
    "questionUid": "qid_v1_8cac1be78ae440cc4f139f391098a06c4b970f87c0a5a64df8242fbdb582b91c"
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "다음 그림과 같이 함수 $y=\\sqrt{x}$의 그래프 위의 점 $P(t, \\sqrt{t})$에서 $x$축에 내린 수선의 발을 $Q$라 할 때, $\\lim_{t \\to \\infty} \\frac{\\overline{OP}-\\overline{PQ}}{\\overline{OQ}}$의 값을 구하면? (단, 점 $O$는 원점) [4.2점]\n<img src=\"assets/images/19_제일고_2학기_중간_고2_수학II/q07.png\" alt=\"19_제일고_2학기_중간_고2_수학II Q07\" />",
    "choices": [
      "$0$",
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$3$"
    ],
    "images": [
      "assets/images/19_제일고_2학기_중간_고2_수학II/q07.png"
    ],
    "answer": "③",
    "solution": "그림에서 $Q=(t,0)$이고 $t\\to\\infty$이므로 $t>0$입니다. 따라서 $\\overline{OQ}=t$, $\\overline{PQ}=\\sqrt t$, $\\overline{OP}=\\sqrt{t^2+t}$입니다(직각삼각형의 피타고라스 정리).<br>$$\\frac{\\overline{OP}-\\overline{PQ}}{\\overline{OQ}}=\\frac{\\sqrt{t^2+t}-\\sqrt t}{t}=\\sqrt{1+\\frac1t}-\\frac1{\\sqrt t}.$$<br>$t\\to\\infty$에서 첫 항은 $1$, 둘째 항은 $0$으로 가므로 극한은 $1$입니다. 정답은 ③입니다.\n<br><strong>보기별 확인</strong><br>① OP의 주항은 t이므로 분자/분모 비는 0이 아닙니다.<br>② OP/t의 극한 1을 1/2로 잘못 계산했습니다.<br>④ PQ/t는 0으로 가므로 3/2가 될 수 없습니다.<br>⑤ OP/t가 1로 수렴하므로 3이 아닙니다.<br>",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 극한",
    "originalCategory": "함수의 극한",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-01",
    "standardUnit": "함수의 극한",
    "standardUnitOrder": 1,
    "subUnitKey": "H15-M2-01-LIMIT",
    "subUnit": "함수의 극한",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_GEOMETRY_PARAMETERIZATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "직각삼각형 길이식과 무한대 극한",
    "decisiveStep": "OP=sqrt(t²+t)",
    "sourceQid": 7,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "OP의 주항은 t이므로 분자/분모 비는 0이 아닙니다."
      },
      {
        "choice": 2,
        "reason": "OP/t의 극한 1을 1/2로 잘못 계산했습니다."
      },
      {
        "choice": 4,
        "reason": "PQ/t는 0으로 가므로 3/2가 될 수 없습니다."
      },
      {
        "choice": 5,
        "reason": "OP/t가 1로 수렴하므로 3이 아닙니다."
      }
    ],
    "questionUid": "qid_v1_a852d5677c8417730eba4dc50d8462e3f0b3d585e22a7c17a2032aaccceb0fe4"
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "닫힌구간 $[0, 6]$에서\n$$f(x)=\\begin{cases} 2x-1 & (0 \\le x \\le 2) \\\\ a(x-2)^2+b & (2 < x \\le 6) \\end{cases}$$\n로 정의되고, 모든 실수 $x$에 대하여 $f(x)=f(x+6)$를 만족시키는 함수 $f(x)$가 실수 전체의 집합에서 연속일 때, $f(46)$의 값은? [4.3점]",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "images": [],
    "answer": "③",
    "solution": "주기가 $6$이므로 $f(46)=f(46-42)=f(4)$입니다. 먼저 구간 경계에서 연속 조건을 사용합니다.<br>$x=2$에서 왼쪽 식의 값은 $2\\cdot2-1=3$이므로 오른쪽 식의 극한 $b$와 같아야 합니다. 따라서 $b=3$입니다.<br>또한 주기성과 연속성으로 $f(6)=f(0)=-1$입니다. $x=6$의 두 번째 식을 적용하면 $16a+b=-1$, 따라서 $16a+3=-1$, $a=-1/4$입니다.<br>이제 $4$는 두 번째 구간에 있으므로 $f(4)=a(4-2)^2+b=(-1/4)\\cdot4+3=2$입니다. 정답은 ③입니다.\n<br><strong>보기별 확인</strong><br>① x=2의 연속성에서 b=3을 적용해야 합니다.<br>② f(4)=4a+b에 a=-1/4를 대입하면 3/2가 아닙니다.<br>④ 주기 경계 f(6)=f(0)을 적용하지 않은 값입니다.<br>⑤ b=3만 사용하고 a(4-2)²를 빠뜨린 값입니다.<br>",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "주기와 경계 연속 조건",
    "decisiveStep": "f(6)=f(0)=-1",
    "sourceQid": 8,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE_WITH_Q08_TRANSCRIPTION_REPAIR",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "x=2의 연속성에서 b=3을 적용해야 합니다."
      },
      {
        "choice": 2,
        "reason": "f(4)=4a+b에 a=-1/4를 대입하면 3/2가 아닙니다."
      },
      {
        "choice": 4,
        "reason": "주기 경계 f(6)=f(0)을 적용하지 않은 값입니다."
      },
      {
        "choice": 5,
        "reason": "b=3만 사용하고 a(4-2)²를 빠뜨린 값입니다."
      }
    ],
    "questionUid": "qid_v1_380031b6b5ee2ee6b5321c2ea2eba0cd74f9547cb080896f2861d5e4a48660e9"
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "함수\n$$f(x)=\\begin{cases} \\frac{\\sqrt{x+7}-3}{x-2} & (x \\ne 2) \\\\ a & (x = 2) \\end{cases}$$\n가 $x=2$에서 연속일 때, 상수 $a$의 값을 구하면? [4.4점]",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{3}$",
      "$1$",
      "$3$",
      "$6$"
    ],
    "images": [],
    "answer": "①",
    "solution": "$x\\ne2$에서 분모와 분자에 공액인 $\\sqrt{x+7}+3$을 곱하면<br>$$\\frac{\\sqrt{x+7}-3}{x-2}=\\frac{x+7-9}{(x-2)(\\sqrt{x+7}+3)}=\\frac1{\\sqrt{x+7}+3}.$$<br>따라서 $\\lim_{x\\to2}f(x)=1/(3+3)=1/6$입니다. $x=2$에서 연속이려면 함수값 $a$가 이 극한과 같아야 하므로 $a=1/6$, 정답은 ①입니다.\n<br><strong>보기별 확인</strong><br>② 유리화 분모의 극한은 6이지 3이 아닙니다.<br>③ 0/0 꼴을 1로 간주하면 안 됩니다.<br>④ 분모를 무시한 값입니다.<br>⑤ 유리화한 분모 6의 역수를 취해야 합니다.<br>",
    "level": "하",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_FUNCTION_BRANCH_SELECTION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "NONE",
    "primaryMethod": "유리화와 연속성",
    "decisiveStep": "x=2의 함수값=극한",
    "sourceQid": 9,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 2,
        "reason": "유리화 분모의 극한은 6이지 3이 아닙니다."
      },
      {
        "choice": 3,
        "reason": "0/0 꼴을 1로 간주하면 안 됩니다."
      },
      {
        "choice": 4,
        "reason": "분모를 무시한 값입니다."
      },
      {
        "choice": 5,
        "reason": "유리화한 분모 6의 역수를 취해야 합니다."
      }
    ],
    "questionUid": "qid_v1_a99835e4b250297f06963a39638daa75e76ae0e38b4c34db972f10f2ad886248"
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "곡선 $y=f(x)$ 위의 점 $(2, f(2))$에서의 접선과 수직인 직선의 기울기가 $-\\frac{1}{3}$일 때, $\\lim_{h \\to 0} \\frac{f(2-3h)-f(2)}{2h}$의 값을 구하면? [4.5점]",
    "choices": [
      "$-2$",
      "$2$",
      "$-\\frac{9}{2}$",
      "$\\frac{9}{2}$",
      "$6$"
    ],
    "images": [],
    "answer": "③",
    "solution": "접선의 기울기를 $m$이라 하면 수직인 직선의 기울기는 $-1/m=-1/3$이므로 $m=f'(2)=3$입니다.<br>$u=-3h$로 치환하면 $h\\to0$일 때 $u\\to0$이고<br>$$\\frac{f(2-3h)-f(2)}{2h}=-\\frac32\\frac{f(2+u)-f(2)}u.$$<br>마지막 분수의 극한은 $f'(2)=3$이므로 전체 극한은 $-\\frac32\\cdot3=-\\frac92$입니다. 정답은 ③입니다.\n<br><strong>보기별 확인</strong><br>① 법선과 접선의 기울기 관계를 반영하지 않았습니다.<br>② h에 곱해진 -3/2를 빠뜨렸습니다.<br>④ 치환 u=-3h의 음수 부호를 빠뜨렸습니다.<br>⑤ f'(2)=3에 계수 -3/2를 적용하지 않았습니다.<br>",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "미분계수",
    "originalCategory": "미분계수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "subUnit": "미분계수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "접선/법선 기울기와 미분계수",
    "decisiveStep": "f'(2)=3, 차분극한 계수 -3/2",
    "sourceQid": 10,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "법선과 접선의 기울기 관계를 반영하지 않았습니다."
      },
      {
        "choice": 2,
        "reason": "h에 곱해진 -3/2를 빠뜨렸습니다."
      },
      {
        "choice": 4,
        "reason": "치환 u=-3h의 음수 부호를 빠뜨렸습니다."
      },
      {
        "choice": 5,
        "reason": "f'(2)=3에 계수 -3/2를 적용하지 않았습니다."
      }
    ],
    "questionUid": "qid_v1_66503d2b235064dd6692dd4ecbea05b09b6d51b48a283fb1c0b9e96f8a9b47a2"
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "실수 전체에서 정의된 함수 $f(x), g(x)$에 대하여 다음 중 옳은 설명을 모두 고르면? [4.5점]\n<table style=\"border: 1px solid #000; width: 100%; border-collapse: collapse; margin: 10px 0;\"><tr><td style=\"padding: 10px;\"><보기><br>ㄱ. $f(x), g(x)$가 $x=a$에서 연속이면 $\\frac{f(x)}{g(x)+1}$는 $x=a$에서 연속이다.<br>ㄴ. $f(x)$이 연속함수이면 $\\{f(x)\\}^3$도 연속함수이다.<br>ㄷ. 함수 $f(x)$에 대하여 $\\frac{3}{f(x)}$이 연속함수이면 $1-2f(x)$도 연속함수이다.<br>ㄹ. 함수 $f(x), g(x)$에 대하여 $f(x), f(x)g(x)$이 연속이면 $g(x)$도 연속이다.</td></tr></table>",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ"
    ],
    "images": [],
    "answer": "④",
    "solution": "ㄱ. $g(a)=-1$이면 분모 $g(a)+1=0$이므로 연속이 보장되지 않습니다. 예를 들어 $g(x)=-1$이면 식 자체가 정의되지 않습니다. 거짓입니다.<br>ㄴ. 연속함수의 거듭제곱은 연속이므로 $\\{f(x)\\}^3$도 연속입니다. 참입니다.<br>ㄷ. $h(x)=3/f(x)$가 실수 전체에서 연속이면 $h(x)$는 $0$이 되지 않습니다. 따라서 $f(x)=3/h(x)$가 연속이고 $1-2f(x)$도 연속입니다. 참입니다.<br>ㄹ. $f(x)=0$이면 $f(x)$와 $f(x)g(x)$는 $g$가 불연속이어도 모두 $0$으로 연속일 수 있습니다. 거짓입니다.<br>옳은 것은 ㄴ, ㄷ이므로 정답은 ④입니다.\n<br><strong>보기별 확인</strong><br>① ㄱ은 분모가 0일 수 있어 거짓입니다.<br>② ㄴ만 고르면 참인 ㄷ을 빠뜨립니다.<br>③ ㄱ이 거짓이므로 ㄱ·ㄴ 조합도 틀립니다.<br>⑤ ㄹ은 f≡0 반례 때문에 거짓입니다.<br>",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_CONTINUOUS_OPERATION_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH",
    "primaryMethod": "연속함수 연산의 반례·정리",
    "decisiveStep": "분모 0 및 영함수 반례",
    "sourceQid": 11,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "ㄱ은 분모가 0일 수 있어 거짓입니다."
      },
      {
        "choice": 2,
        "reason": "ㄴ만 고르면 참인 ㄷ을 빠뜨립니다."
      },
      {
        "choice": 3,
        "reason": "ㄱ이 거짓이므로 ㄱ·ㄴ 조합도 틀립니다."
      },
      {
        "choice": 5,
        "reason": "ㄹ은 f≡0 반례 때문에 거짓입니다."
      }
    ],
    "questionUid": "qid_v1_89951939292f86c31bac3d040d817ddc64068920d68f4e53bfb3eb49effbe26f"
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(1)$의 값을 구하면? [4.6점]\n<table style=\"border: 1px solid #000; width: 100%; border-collapse: collapse; margin: 10px 0;\"><tr><td style=\"padding: 10px;\">(가) $\\lim_{x \\to \\infty} \\frac{f(x)-3x}{4x^3-2x-1} = \\frac{1}{2}$<br>(나) $\\lim_{x \\to 1} \\frac{f'(x-1)-5}{x-1} = 4$<br>(다) $f(0) = -5$</td></tr></table>",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "images": [],
    "answer": "④",
    "solution": "(가)에서 분모 최고차항은 $4x^3$입니다. 극한이 $1/2$이므로 $f(x)$는 삼차이고 최고차항 계수는 $2$입니다. $f(x)=2x^3+ax^2+bx+c$로 놓습니다.<br>(다)에서 $c=-5$입니다. 또 $f'(x)=6x^2+2ax+b$입니다.<br>(나)의 분모 $x-1$이 $0$으로 가는데 극한이 유한하려면 $f'(0)-5=b-5=0$, 따라서 $b=5$입니다. $t=x-1$로 치환하면<br>$$\\lim_{t\\to0}\\frac{f'(t)-5}{t}=\\lim_{t\\to0}(6t+2a)=2a=4,$$<br>따라서 $a=2$입니다. 그러므로 $f(1)=2+2+5-5=4$, 정답은 ④입니다.\n<br><strong>보기별 확인</strong><br>① 계수 b=5와 a=2를 모두 반영해야 합니다.<br>② 최고차항 2x³과 이차항 2x²를 누락한 값입니다.<br>③ f(1)=2+2+5-5를 재계산하면 3이 아닙니다.<br>⑤ 상수항 -5를 더하는 단계가 빠졌습니다.<br>",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "미분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION",
    "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "최고차항 및 미분계수 조건",
    "decisiveStep": "b=5, 2a=4",
    "sourceQid": 12,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "계수 b=5와 a=2를 모두 반영해야 합니다."
      },
      {
        "choice": 2,
        "reason": "최고차항 2x³과 이차항 2x²를 누락한 값입니다."
      },
      {
        "choice": 3,
        "reason": "f(1)=2+2+5-5를 재계산하면 3이 아닙니다."
      },
      {
        "choice": 5,
        "reason": "상수항 -5를 더하는 단계가 빠졌습니다."
      }
    ],
    "questionUid": "qid_v1_dd57928f094cfc43a3796bdc462c83294711e2504472129c8656dde8eefa734b"
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "실수 전체에서 미분가능한 함수 $f(x)$가 모든 실수 $x, y$에 대하여\n$$f(x+y)=f(x)+f(y)-7xy, f'(0)=3$$\n일 때 $f'(3)$의 값을 구하면? [4.7점]",
    "choices": [
      "$24$",
      "$16$",
      "$4$",
      "$-6$",
      "$-18$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "모든 $x,y$에서 $f(x+y)=f(x)+f(y)-7xy$입니다. 양변을 $x$에 대해 미분하면 $f'(x+y)=f'(x)-7y$입니다(여기서 $y$는 상수).<br>$x=0$을 대입하면 $f'(y)=f'(0)-7y=3-7y$입니다.<br>따라서 $f'(3)=3-21=-18$이므로 정답은 ⑤입니다. 또는 $f(x)=3x-\\frac72x^2$를 직접 얻어 확인할 수 있습니다.\n<br><strong>보기별 확인</strong><br>① -7xy의 미분은 -7y이므로 도함수가 양수 24가 되지 않습니다.<br>② f'(3)=3-21이므로 16이 아닙니다.<br>③ -7x를 빠뜨리고 3만 쓰면 안 됩니다.<br>④ x=3에서 -7x=-21을 적용하면 -6이 아닙니다.<br>",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "미분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION",
    "templateKey": "TPL_DERIVATIVE_RELATION_FUNCTION_DETERMINE",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "함수방정식 미분",
    "decisiveStep": "f'(y)=3-7y",
    "sourceQid": 13,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "-7xy의 미분은 -7y이므로 도함수가 양수 24가 되지 않습니다."
      },
      {
        "choice": 2,
        "reason": "f'(3)=3-21이므로 16이 아닙니다."
      },
      {
        "choice": 3,
        "reason": "-7x를 빠뜨리고 3만 쓰면 안 됩니다."
      },
      {
        "choice": 4,
        "reason": "x=3에서 -7x=-21을 적용하면 -6이 아닙니다."
      }
    ],
    "questionUid": "qid_v1_746ffa27115ca31351b2ee75f309f617cd9cce3099f537b0725f2a52bb018cea"
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "삼차함수 $f(x)$가 $f(0)=-2$, $f(2)=f(4)=f(6)=6$일 때, $f'(8)$의 값을 구하면? [4.9점]",
    "choices": [
      "$6$",
      "$\\frac{19}{3}$",
      "$\\frac{20}{3}$",
      "$7$",
      "$\\frac{22}{3}$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "$f(2)=f(4)=f(6)=6$이므로 삼차함수 $f(x)-6$은 $2,4,6$을 근으로 갖습니다. 따라서<br>$$f(x)=6+a(x-2)(x-4)(x-6).$$<br>$f(0)=-2$를 대입하면 $-2=6+a(-2)(-4)(-6)=6-48a$이므로 $a=1/6$입니다.<br>곱의 미분법을 적용하면<br>$$f'(8)=\\frac16\\{(8-4)(8-6)+(8-2)(8-6)+(8-2)(8-4)\\}$$<br>$$=\\frac16(8+12+24)=\\frac{22}{3}.$$<br>정답은 ⑤입니다.\n<br><strong>보기별 확인</strong><br>① f-6의 세 근 2,4,6을 모두 사용해야 합니다.<br>② 곱의 미분법의 세 항 중 일부를 빠뜨린 값입니다.<br>③ f'(8)=44/6이므로 20/3이 아닙니다.<br>④ 44/6은 7과 같지 않습니다.<br>",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "미분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION",
    "templateKey": "TPL_STRUCTURAL_FUNCTION_DETERMINE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "동일 함수값의 인수구조",
    "decisiveStep": "f-6=a(x-2)(x-4)(x-6)",
    "sourceQid": 14,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "f-6의 세 근 2,4,6을 모두 사용해야 합니다."
      },
      {
        "choice": 2,
        "reason": "곱의 미분법의 세 항 중 일부를 빠뜨린 값입니다."
      },
      {
        "choice": 3,
        "reason": "f'(8)=44/6이므로 20/3이 아닙니다."
      },
      {
        "choice": 4,
        "reason": "44/6은 7과 같지 않습니다."
      }
    ],
    "questionUid": "qid_v1_d31c7bcf91ffa1ac47c75722270bb8bac8f5371c7d96ba9dd0af59f9b065c744"
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "두 함수 $f(x), g(x)$의 그래프가 다음 그림과 같을 때, 옳은 것만을 [보기]에서 있는 대로 고른 것은? [5.0점]\n<img src=\"assets/images/19_제일고_2학기_중간_고2_수학II/q15.png\" alt=\"19_제일고_2학기_중간_고2_수학II Q15\" />\n<table style=\"border: 1px solid #000; width: 100%; border-collapse: collapse; margin: 10px 0;\"><tr><td style=\"padding: 10px;\"><보기><br>ㄱ. $\\lim_{x \\to -1} g(f(x)) = 1$<br>ㄴ. 방정식 $f(x)+g(x)-\\frac{1}{2}=0$의 해가 $(0, 2)$에서 적어도 하나 존재한다.<br>ㄷ. 함수 $\\lim_{x \\to -1} f(x)g(x)$가 존재하지 않는다.</td></tr></table>",
    "choices": [
      "ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "images": [
      "assets/images/19_제일고_2학기_중간_고2_수학II/q15.png"
    ],
    "answer": "②",
    "solution": "<strong>먼저 그림의 열린 점과 닫힌 점을 구별합니다.</strong><br>$f$의 그래프에서 $x=-1$의 닫힌 점은 $(-1,1)$이고 오른쪽에서 다가가는 가지의 열린 점은 $(-1,-1)$입니다. $g$의 그래프에서 $x=1$의 닫힌 점은 $(1,1)$, 왼쪽 가지의 열린 점은 $(1,-1)$입니다. 열린 점의 높이를 해당 $x$에서의 실제 함수값으로 착각하면 안 됩니다.<br><strong>ㄱ. 합성함수의 좌우극한</strong><br>$x\\to-1^-$이면 $f(x)=1$이므로 $g(f(x))=g(1)=1$입니다. 반면 $x\\to-1^+$이면 $f(x)\\to-1^+$이고, 그림에서 $g(t)\\to-1$ $(t\\to-1^+)$이므로 $g(f(x))\\to-1$입니다.<br>$$\\lim_{x\\to-1^-}g(f(x))=1\\ne-1=\\lim_{x\\to-1^+}g(f(x)).$$<br>따라서 두 쪽 극한이 존재하지 않아 ㄱ은 <strong>거짓</strong>입니다.<br><strong>ㄴ. 사잇값 정리로 근의 존재 확인</strong><br>$h(x)=f(x)+g(x)-\\frac12$로 놓습니다. 그림에서 $0\\le x\\lt 1$의 두 그래프는 각각 이어져 있으므로 $h$는 이 구간에서 연속입니다. $x=0$에서 $f(0)=0$, $g(0)=1$이므로<br>$$h(0)=0+1-\\frac12=\\frac12\\gt 0.$$<br>한편 $x\\to1^-$이면 $f(x)\\to1$, $g(x)\\to-1$이므로<br>$$\\lim_{x\\to1^-}h(x)=1-1-\\frac12=-\\frac12\\lt 0.$$<br>따라서 $1$보다 조금 작은 어떤 $r\\in(0,1)$에서 $h(r)\\lt 0$입니다. 연속함수 $h$에 사잇값 정리를 $[0,r]$에서 적용하면 $0\\lt c\\lt r\\lt 1$인 $c$에 대해 $h(c)=0$입니다. 이 근은 분명 $(0,2)$ 안에 있으므로 ㄴ은 <strong>참</strong>입니다. (그래프가 정확히 어떤 이차식인지 추측할 필요는 없습니다.)<br><strong>ㄷ. 곱의 좌우극한</strong><br>$x\\to-1^-$에서 $f(x)\\to1$, $g(x)\\to-1$이므로 곱은 $-1$로 갑니다. $x\\to-1^+$에서는 $f(x)\\to-1$, $g(x)\\to-1$이므로 곱은 $1$로 갑니다. 좌우극한이 다르므로 ㄷ은 <strong>참</strong>입니다.<br>따라서 참인 것은 <strong>ㄴ, ㄷ</strong>이고 정답은 <strong>②</strong>입니다.<br><strong>보기 확인</strong><br>①은 ㄷ을 빠뜨렸고, ③·④·⑤는 거짓인 ㄱ을 포함합니다.",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_CONTINUOUS_OPERATION_JUDGMENT",
    "crossConceptKeys": [
      "CC_INTERMEDIATE_VALUE_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH",
    "primaryMethod": "그래프 좌우극한과 사잇값 정리",
    "decisiveStep": "합성 극한과 곱의 좌우극한",
    "sourceQid": 15,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "ㄴ은 참이지만 ㄷ도 참이므로 빠뜨렸습니다."
      },
      {
        "choice": 3,
        "reason": "ㄱ은 합성함수의 좌우극한이 달라 거짓입니다."
      },
      {
        "choice": 4,
        "reason": "ㄱ이 거짓이고 ㄴ이 참이므로 틀립니다."
      },
      {
        "choice": 5,
        "reason": "ㄱ이 거짓이므로 세 주장 모두 참은 아닙니다."
      }
    ],
    "questionUid": "qid_v1_8544a2e893e0447f3afc699ae18ec3c0736d032689433b7b97c739e7d64c9f77"
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "집합 $X=\\{x|0 \\le x \\le 2\\}$에서 $X$로의 함수 $f(x)=2|x-1|$일 때, 열린구간 $(0, 2)$에서 함수 $(f \\circ f \\circ f)(x)$이 미분가능하지 않는 실수 $x$의 개수를 $a$, 열린구간 $(0, 2)$에서 미분가능하지 않는 모든 실수 $x$의 값의 합을 $b$라고 할 때, 바르게 짝지어진 것을 고르면? [5.1점]",
    "choices": [
      "$a=1, b=3$",
      "$a=3, b=3$",
      "$a=3, b=7$",
      "$a=7, b=3$",
      "$a=7, b=7$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "<strong>① 합성함수의 꺾이는 점이 어디에서 생기는지 찾습니다.</strong><br>$f(x)=2|x-1|$는 입력이 $1$을 지날 때 식의 기울기가 바뀝니다. 세 번 합성한<br>$$F(x)=f(f(f(x)))=2\\left|2\\left|2|x-1|-1\\right|-1\\right|$$<br>에서는 $x$ 자체가 $1$인 곳뿐 아니라 $f(x)=1$, $f(f(x))=1$인 곳에서도 바깥 절댓값의 꺾임이 생길 수 있습니다.<br><strong>② 세 단계의 후보를 빠짐없이 계산합니다.</strong><br>첫째, $x=1$에서 $f$가 꺾입니다.<br>둘째, $f(x)=1$이면<br>$$2|x-1|=1\\ \\Longleftrightarrow\\ |x-1|=\\frac12\\ \\Longleftrightarrow\\ x=\\frac12,\\frac32.$$<br>셋째, $f(f(x))=1$이면<br>$$2|f(x)-1|=1\\ \\Longleftrightarrow\\ f(x)=\\frac12\\ \\text{또는}\\ \\frac32.$$<br>이를 $f(x)=2|x-1|$에 다시 대입하면<br>$$|x-1|=\\frac14\\ \\text{또는}\\ \\frac34,$$<br>$$x=\\frac14,\\frac34,\\frac54,\\frac74.$$<br>따라서 후보는 크기순으로 $\\frac14,\\frac12,\\frac34,1,\\frac54,\\frac32,\\frac74$의 <strong>7개</strong>이며 모두 열린구간 $(0,2)$에 있습니다.<br><strong>③ 후보가 실제로 모두 미분불가능한지 확인합니다.</strong><br>각 절댓값은 꺾이는 점을 제외하면 기울기가 $+2$ 또는 $-2$인 일차식입니다. 따라서 $F$는 위 일곱 점 사이의 여덟 열린구간에서 기울기가 $\\pm2\\cdot2\\cdot2=\\pm8$인 일차식입니다. 직접 대입하면 $x=0,\\frac14,\\frac12,\\frac34,1,\\frac54,\\frac32,\\frac74,2$에서 $F(x)$의 값은 차례로 $2,0,2,0,2,0,2,0,2$입니다. 따라서 각 인접 구간의 기울기는 $-8,+8,-8,+8,-8,+8,-8,+8$이고, 일곱 경계마다 좌우 기울기가 서로 다릅니다. <strong>일곱 후보 모두 실제 미분불가능점</strong>이며 그 밖의 열린구간에서는 일차식이므로 추가 꺾임이 없습니다.<br><strong>④ 개수와 합</strong><br>$$a=7,$$<br>$$b=\\left(\\frac14+\\frac74\\right)+\\left(\\frac12+\\frac32\\right)+\\left(\\frac34+\\frac54\\right)+1=2+2+2+1=7.$$<br>따라서 $a=7$, $b=7$이므로 정답은 <strong>⑤</strong>입니다. 해설 그래프의 빨간 점은 위 일곱 꺾임이고, $0,2$는 열린구간의 끝점이므로 세지 않습니다.<br><strong>보기 확인</strong><br>①·②·③은 일곱 꺾임을 모두 세지 못했고, ④는 꺾임의 합을 잘못 구했습니다.",
    "level": "상",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "미분계수",
    "originalCategory": "미분계수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "subUnit": "미분계수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "그래프"
    ],
    "wide": false,
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_NONDIFFERENTIABILITY_STRUCTURE",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_ITERATION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "반복합성 꺾임의 역상",
    "decisiveStep": "f²(x)=1의 4개 해",
    "sourceQid": 16,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "EXACT_ACTIVE_BINDING_FOUND_CROSSWALK_STALE",
    "distractorAnalysis": [
      {
        "choice": 1,
        "reason": "f²(x)=1의 네 역상과 f(x)=1의 두 역상을 빠뜨렸습니다."
      },
      {
        "choice": 2,
        "reason": "미분불가능점이 3개가 아니라 7개입니다."
      },
      {
        "choice": 3,
        "reason": "a가 3이 아니라 7입니다."
      },
      {
        "choice": 4,
        "reason": "일곱 점의 합은 3이 아니라 7입니다."
      }
    ],
    "solutionImage": "assets/solutions/19_제일고_2학기_중간_고2_수학II/q16_iteration_kinks.svg",
    "questionUid": "qid_v1_bbcc5921ec16e4a68f58738001d3aa9476b394f6c7cbc10c564c7f6b1b38eef9",
    "rpmL3": "미분가능성과 연속",
    "rpmL4": "그래프에서 판정"
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "다항함수 $f(x)$에 대하여 $f(-1)=-2$, $f'(-1)=2$일 때 $\\lim_{x \\to -1} \\frac{f(x)-2x}{x+1}$을 구하면? [5.3점]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "images": [],
    "answer": "①",
    "solution": "$f(-1)-2(-1)=-2+2=0$이므로 분자와 분모가 모두 $0$으로 갑니다. 분자를 미분계수 꼴로 바꾸면<br>$$\\frac{f(x)-2x}{x+1}=\\frac{f(x)-f(-1)}{x-(-1)}-2\\frac{x+1}{x+1}.$$<br>따라서 극한은 $f'(-1)-2=2-2=0$입니다. 정답은 ①입니다.\n<br><strong>보기별 확인</strong><br>② 분자에 포함된 -2x의 미분 기여 -2를 빼야 합니다.<br>③ f'(-1)=2만 쓰고 -2를 빠뜨렸습니다.<br>④ 분모 x+1은 미분계수의 차분 분모입니다.<br>⑤ f'(-1)-2=0이므로 4가 아닙니다.<br>",
    "level": "하",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "미분계수",
    "originalCategory": "미분계수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "subUnit": "미분계수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "차분극한의 미분계수 변형",
    "decisiveStep": "f'(-1)-2",
    "sourceQid": 17,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 2,
        "reason": "분자에 포함된 -2x의 미분 기여 -2를 빼야 합니다."
      },
      {
        "choice": 3,
        "reason": "f'(-1)=2만 쓰고 -2를 빠뜨렸습니다."
      },
      {
        "choice": 4,
        "reason": "분모 x+1은 미분계수의 차분 분모입니다."
      },
      {
        "choice": 5,
        "reason": "f'(-1)-2=0이므로 4가 아닙니다."
      }
    ],
    "questionUid": "qid_v1_f4b3303f0034dff45c7efae732fe061eb0fdb69ac8bef853cc88588352ee6908"
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "정의역 $1 < x < 10$에 대하여 함수 $y=[\\log_{n+1} x]$의 불연속점의 개수를 $a_n$이라고 정의하자.\n$a_1+a_2+\\cdots+a_9$의 값으로 알맞은 것을 고른 것은? (단, $[x]$는 $x$를 넘지 않는 최대 정수) [5.4점]",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "images": [],
    "answer": "①",
    "solution": "<strong>① 가우스기호가 뛰는 순간을 찾습니다.</strong><br>$b=n+1$이라 놓으면 $b=2,3,\\ldots,10$입니다. $b\\gt 1$이므로 $\\log_b x$는 $x$가 증가할 때 연속적으로 증가합니다. 정수 $m$을 통과할 때 $[\\log_b x]$의 값은 $m-1$에서 $m$으로 뛰므로, 불연속점은<br>$$\\log_b x=m\\ \\Longleftrightarrow\\ x=b^m\\qquad(m\\text{은 정수})$$<br>입니다. 정의역이 $1\\lt x\\lt 10$이므로 $m\\ge1$이고 $1\\lt b^m\\lt 10$을 만족하는 거듭제곱만 셉니다. $x=1$과 $x=10$은 포함하지 않습니다.<br><strong>② 밑별로 실제 점을 나열합니다.</strong><br>$b=2$일 때 $2,4,8$이므로 $a_1=3$입니다.<br>$b=3$일 때 $3,9$이므로 $a_2=2$입니다.<br>$b=4$일 때 $4$만 들어가므로 $a_3=1$입니다. ($4^2=16$은 범위 밖입니다.)<br>$b=5,6,7,8,9$일 때에는 각각 밑 자체만 들어가므로 $a_4=a_5=a_6=a_7=a_8=1$입니다.<br>$b=10$일 때 처음 뛰는 점 $x=10$부터 정의역 밖이므로 $a_9=0$입니다.<br><strong>③ 합산</strong><br>$$a_1+a_2+\\cdots+a_9=3+2+1+(1+1+1+1+1)+0=11.$$<br>따라서 정답은 <strong>①</strong>입니다.<br><strong>보기 확인</strong><br>②~⑤는 $x=10$을 포함하거나 $2,3$의 여러 거듭제곱을 빠뜨리는 등의 경우에 생길 수 있습니다. 각 점은 같은 $b$에 대해 서로 다르고, 밑이 달라지면 별개의 $a_n$에 세는 것이므로 합에서 빼지 않습니다.",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_COUNT_FUNCTION_DISCONTINUITY_FIND",
    "crossConceptKeys": [
      "CC_GREATEST_INTEGER_FUNCTION"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH",
    "primaryMethod": "바닥함수 점프의 거듭제곱 조건",
    "decisiveStep": "1<(n+1)^m<10",
    "sourceQid": 18,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "distractorAnalysis": [
      {
        "choice": 2,
        "reason": "n=9의 밑 10은 x=10이 제외되어 0개입니다."
      },
      {
        "choice": 3,
        "reason": "밑 2와 3의 거듭제곱 개수를 각각 3,2로 세어야 합니다."
      },
      {
        "choice": 4,
        "reason": "밑 4는 4만 포함하고 16은 범위 밖입니다."
      },
      {
        "choice": 5,
        "reason": "모든 n에 같은 개수의 점프가 있는 것은 아닙니다."
      }
    ],
    "questionUid": "qid_v1_2da45846ebea34471d70deb322e997312efab0b6fd2c5e0e2787dbeebfd6df2b"
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "서술형",
    "content": "[서술형 1] 함수\n$$f(x)=\\begin{cases} x^2-x-2 & (x \\le 2) \\\\ x-2 & (x > 2) \\end{cases}$$\n에 대하여 $x=2$에서의 연속성 [3.0점]과 미분가능성 [2.0점]을 조사하여라. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "연속, 미분가능하지 않음",
    "solution": "<strong>[1] $x=2$에서의 연속성 (3점)</strong><br>경계 $x=2$는 첫 번째 식에 포함되므로<br>$$f(2)=2^2-2-2=0.$$<br>왼쪽에서는 $x^2-x-2=(x-2)(x+1)$, 오른쪽에서는 $x-2$를 사용합니다. 따라서<br>$$\\lim_{x\\to2^-}f(x)=0,\\qquad\\lim_{x\\to2^+}f(x)=0.$$<br>두 극한과 실제 함수값 $f(2)$가 모두 $0$이므로 <strong>$x=2$에서 연속</strong>입니다.<br><strong>[2] $x=2$에서의 미분가능성 (2점)</strong><br>연속이라고 해서 반드시 미분가능한 것은 아닙니다. 정의에 따라 좌우 차분몫을 직접 비교합니다.<br>$h\\lt 0$이면 $2+h\\le2$이므로<br>$$\\frac{f(2+h)-f(2)}h=\\frac{(2+h)^2-(2+h)-2-0}{h}=\\frac{3h+h^2}{h}=3+h\\longrightarrow3.$$<br>$h\\gt 0$이면 $2+h\\gt 2$이므로<br>$$\\frac{f(2+h)-f(2)}h=\\frac{(2+h-2)-0}{h}=\\frac hh=1\\longrightarrow1.$$<br>좌미분계수는 $3$, 우미분계수는 $1$로 서로 다르므로 <strong>$x=2$에서 미분가능하지 않습니다.</strong><br><strong>결론:</strong> 연속이지만 미분가능하지 않습니다.",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "미분계수",
    "originalCategory": "미분계수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-03",
    "standardUnit": "미분계수",
    "standardUnitOrder": 3,
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "subUnit": "미분계수",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "CASE_BRANCH",
    "primaryMethod": "경계 연속성과 좌우미분계수",
    "decisiveStep": "좌미분 3, 우미분 1",
    "sourceQid": 19,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "EXACT_ACTIVE_BINDING_FOUND_CROSSWALK_STALE",
    "questionUid": "qid_v1_9db35dafd4afe35acdd96753af6ee152bd1cfc77a7254c7d952666d19bdd14d1",
    "rpmL3": "미분계수",
    "rpmL4": "정의로 미분계수"
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "[서술형 2] 모든 실수 $x$에서 연속인 함수 $f(x)$가\n$$(x^2-1)f(x)=x^3+2x^2-x-2$$\n을 만족시킬 때, $f(-1)+f(1)$의 값을 구하여라. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "4",
    "solution": "우변을 묶어 인수분해하면<br>$$x^3+2x^2-x-2=x^2(x+2)-(x+2)=(x^2-1)(x+2).$$<br>$x\\ne\\pm1$에서는 $(x^2-1)f(x)=(x^2-1)(x+2)$의 양변을 $x^2-1$로 나누어 $f(x)=x+2$입니다.<br>$f$가 모든 실수에서 연속이므로 $x=-1,1$에서도 주변의 극한값과 함수값이 같아야 합니다. 따라서 $f(-1)=1$, $f(1)=3$입니다.<br>구하는 값은 $1+3=4$입니다. $x=\\pm1$을 원래 식에 직접 대입하면 $0=0$만 얻으므로 연속 조건이 결정적입니다.",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_FACTOR_CONDITION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "primaryMethod": "인수분해와 연속 확장",
    "decisiveStep": "f=x+2 (x≠±1)",
    "sourceQid": 20,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "questionUid": "qid_v1_c3fea7e44dc76483111b7aa5f8900684c11e44efec00e8f776aa2b62bcc15260"
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "[서술형 3] 연속함수 $f(x)$가 $f(-2)=-2, f(-1)=-4, f(0)=3, f(1)=0$를 만족시킨다. 열린구간 $(-2, 1)$에서 방정식 $x^2 f(x)=3x-1$이 적어도 몇 개의 실근을 가지는지 풀이과정과 답을 구하시오. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "2",
    "solution": "방정식의 근을 세려면 양변을 한쪽으로 모은 연속함수<br>$$h(x)=x^2f(x)-3x+1$$<br>의 영점을 찾으면 됩니다. $f$가 연속이므로 $h$도 연속입니다.<br><strong>① 네 점에서 부호를 계산합니다.</strong><br>$$h(-2)=4(-2)+6+1=-1,\\qquad h(-1)=1(-4)+3+1=0,$$<br>$$h(0)=0+0+1=1,\\qquad h(1)=1\\cdot0-3+1=-2.$$<br><strong>② 서로 다른 근이 반드시 두 개 존재함을 보입니다.</strong><br>$h(-1)=0$이고 $-1\\in(-2,1)$이므로 $x=-1$이 한 근입니다. 또 $h(0)=1\\gt 0$, $h(1)=-2\\lt 0$이므로 사잇값 정리에 의해 $0\\lt c\\lt 1$에서 $h(c)=0$인 $c$가 존재합니다. $c\\gt 0$이므로 $c\\ne-1$입니다. 따라서 <strong>적어도 두 근</strong>이 반드시 있습니다.<br><strong>③ 그 이상을 반드시 보장할 수는 없는 이유</strong><br>추가 근을 강제하려면 다른 구간에서 부호가 바뀌거나 새로운 영점 조건이 있어야 합니다. 실제로 주어진 네 값을 지나도록 $[-2,1]$에서<br>$$f(x)=\\begin{cases}-2x-6&(-2\\le x\\le-1),\\\\7x+3&(-1\\lt x\\le0),\\\\3-3x&(0\\lt x\\le1)\\end{cases}$$<br>로 정하면 $f(-2)=-2$, $f(-1)=-4$, $f(0)=3$, $f(1)=0$이고 경계에서도 이어져 연속입니다(구간 밖으로도 연속하게 연장할 수 있습니다). 이때<br>$-2\\lt x\\lt -1$에서는 $h(x)=-(x+1)\\{2(x+1)^2-3\\}\\lt 0$이고,<br>$-1\\lt x\\lt 0$에서는 $h(x)=(x+1)(7x^2-4x+1)\\gt 0$입니다. 두 번째 이차식은 $7(x-\\frac27)^2+\\frac37\\gt 0$이기 때문입니다.<br>$0\\lt x\\lt 1$에서는 $h(x)=-3x^3+3x^2-3x+1$이며<br>$$h'(x)=-3(3x^2-2x+1)\\lt 0$$<br>이므로 $h$는 엄격히 감소합니다. $h(0)=1$, $h(1)=-2$이므로 이 구간의 근은 정확히 하나입니다. 따라서 이 예에서는 $-1$과 $(0,1)$의 한 근만 있어, 주어진 조건으로 세 근 이상을 보장할 수 없습니다.<br><strong>결론:</strong> 반드시 존재하는 실근의 최소 개수는 <strong>$2$개</strong>입니다.",
    "level": "상",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "함수의 연속",
    "originalCategory": "함수의 연속",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-02",
    "standardUnit": "함수의 연속",
    "standardUnitOrder": 2,
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "subUnit": "함수의 연속",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_MINIMUM_ROOT_COUNT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "연속함수 사잇값과 확정 근",
    "decisiveStep": "h(-1)=0, h(0)>0>h(1)",
    "sourceQid": 21,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "questionUid": "qid_v1_636368cd39706a78806ac32aaaf69e5646c855fbe5f125dc12c735475c626017"
  },
  {
    "id": 22,
    "questionNumber": 22,
    "questionType": "서술형",
    "content": "[서술형 4] 다음은 모든 양의 정수 $n$에 대하여 등식 $(x^n)'=nx^{n-1}$이 성립함을 수학적 귀납법으로 증명한 과정이다. [5.0점]\n<table style=\"border: 1px solid #000; width: 100%; border-collapse: collapse; margin: 10px 0;\"><tr><td style=\"padding: 10px;\">( i ) $n=1$일 때<br>$f(x)=x$에 대하여 $(x)'=f'(x)=$ (가)<br>따라서 $n=1$일 때 주어진 등식은 성립한다.<br>( ii ) $n=k(k \\ge 1)$일 때 주어진 등식이 성립한다고 가정하자. 즉, (나) 이다.<br>$n=k+1$일 때, $(x^{k+1})'=(x^k \\times x)'=$ (다)<br>따라서 $n=k+1$일 때도 주어진 등식은 성립한다.<br>( i ), ( ii )에 의하여 모든 양의 정수 $n$에 대하여 등식 $(x^n)'=nx^{n-1}$이 성립한다.</td></tr></table>\n(1) 도함수의 정의를 이용하여 (가)를 바르게 서술하여라. [2.0점]\n(2) (나)를 바르게 서술하여라. [1.0점]\n(3) 함수의 곱의 미분법을 이용하여 (다)를 바르게 서술하여라. [2.0점]",
    "choices": [],
    "images": [],
    "answer": "(가) 1; (나) (x^k)'=kx^{k-1}; (다) (k+1)x^k",
    "solution": "(1) $f(x)=x$이면 도함수의 정의에 따라<br>$$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h=\\lim_{h\\to0}\\frac{(x+h)-x}{h}=\\lim_{h\\to0}1=1.$$<br>따라서 (가)는 $1$입니다.<br>(2) $n=k$일 때 성립한다고 가정하는 등식은 $(x^k)'=kx^{k-1}$이므로 이것이 (나)입니다.<br>(3) 곱의 미분법 $(uv)'=u'v+uv'$에 $u=x^k$, $v=x$를 적용하면<br>$$(x^{k+1})'=(x^k\\cdot x)'=(x^k)'x+x^k(x)'=kx^{k-1}x+x^k=(k+1)x^k.$$<br>따라서 (다)는 $kx^k+x^k=(k+1)x^k$입니다. $n=1$의 시작과 $k\\to k+1$의 귀납 단계가 모두 성립합니다.",
    "level": "중",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "category": "도함수",
    "originalCategory": "도함수",
    "standardCourse": "수학II",
    "standardUnitKey": "H15-M2-04",
    "standardUnit": "도함수",
    "standardUnitOrder": 4,
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "subUnit": "미분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "layoutTag": "grid",
    "tags": [
      "서술형"
    ],
    "wide": false,
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "primaryMethod": "도함수 정의와 수학적 귀납법",
    "decisiveStep": "곱의 미분법으로 k→k+1",
    "sourceQid": 22,
    "sourceExamUid": "19_제일고_2학기_중간_고2_수학II",
    "provenance": "ORIGINAL_SOURCE",
    "metaProjectionStatus": "PROJECTION_REUSE_CANDIDATE",
    "questionUid": "qid_v1_d2df31447b7972404057b51c3008aeba41bf482ddefea3cc477991a52287f8a7"
  }
];
window.examData = { examTitle: window.examTitle, questions: window.questionBank };
