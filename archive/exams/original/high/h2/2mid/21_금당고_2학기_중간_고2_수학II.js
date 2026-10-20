window.examTitle = "21_금당고_2학기_중간_고2_수학II";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "1. $\\lim_{x \\to 2} (x+5)$의 값을 구하시오. [3.8점]",
    "choices": [
      "3",
      "5",
      "7",
      "9",
      "11"
    ],
    "images": [],
    "answer": "③",
    "solution": "다항식은 연속이므로 $x$가 $2$에 가까워질 때 $x+5$에 $x=2$를 바로 대입한다.\n$\\displaystyle\\lim_{x\\to2}(x+5)=2+5=7$이다.\n보기의 $7$은 ③이고, 나머지 보기 $3,5,9,11$은 이 대입값과 다르다.\n따라서 정답은 ③이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "극한의 성질",
    "level": "하",
    "difficultyBucket": 1,
    "primaryMethod": "대입 극한",
    "decisiveStep": "x=2 직접 대입",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_DIRECT_SUBSTITUTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "metaProjectionStatus": "PROJECTION_REUSE_SEMANTIC_TEMPLATE_REVIEW",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "함수의 극한",
      "l4": "극한값 계산",
      "crosswalkRecordId": "H2-M2-RPM-002"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "FAMILY_ACTIVE",
    "sourceQid": 1,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "극한의 성질",
      "대수적 계산",
      "대입 극한"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "21019ae9ef1c5542da4460aea9447808cae8474c9e105be03161d8472762ac9a",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "대입 한 단계이며 다항식 연속성이 직접 적용된다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "2. 닫힌구간 $[0, 3]$에서 함수 $y=f(x)$의 그래프가 그림과 같을 때, $\\lim_{x \\to 2+} f(x-1)$의 값을 구하시오. [3.8점]\n<img src=\"assets/images/21_금당고_2학기_중간_고2_수학II/q02.png\" alt=\"21_금당고_2학기_중간_고2_수학II Q02\" />",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "5"
    ],
    "images": [
      "assets/images/21_금당고_2학기_중간_고2_수학II/q02.png"
    ],
    "answer": "①",
    "solution": "먼저 합성된 입력이 어느 방향에서 다가가는지 확인한다.\n$x\\to2+$이면 $x-1\\to1+$이다. 따라서 구하려는 값은 $f(x)$의 $x=1$에서의 **우극한**이다.\n그림에서 $(1,0)$은 채워진 점이고, $x>1$ 쪽 곡선은 그 점에서 시작하므로 $\\displaystyle\\lim_{u\\to1+}f(u)=0$이다.\n$(1,2)$의 빈 점은 왼쪽에서 접근할 때의 값으로, 이번 우극한과 구별해야 한다.\n따라서 정답은 $0$, ①이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "함수의 극한",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "합성 입력의 우측 접근",
    "decisiveStep": "x-1→1+",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_GRAPH_DIRECTION_READ",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "함수의 극한",
      "l4": "좌극한·우극한",
      "crosswalkRecordId": "H2-M2-RPM-001"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 2,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "함수의 극한",
      "좌극한·우극한",
      "합성 입력의 우측 접근"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "8c35ac6494115168804b72273471c3d400996dbf4b06ef5a752501523b91fb7a",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "합성 입력의 방향과 원본 그래프의 빈점/채운점 구분이 모두 필요하다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "3. 모든 실수 $x$에서 연속인 함수 $f(x)$가 $(x-3)f(x)=x^2+ax-6$을 만족시킬 때, $a$의 값은? [3.8점]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "images": [],
    "answer": "②",
    "solution": "모든 실수에서 $f$가 연속이므로 $x=3$에서도 $f(3)$은 유한하게 존재한다.\n주어진 $(x-3)f(x)=x^2+ax-6$에 $x=3$을 대입하면 왼쪽은 $0$이다.\n$0=3^2+3a-6=3+3a$이므로 $3a=-3$, $a=-1$이다.\n나머지 선택지는 $x=3$에서 오른쪽이 $0$이 되지 않으므로 조건을 만족하지 않는다.\n따라서 정답은 ②이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "연속 조건",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "연속식의 미정계수",
    "decisiveStep": "x=3에서 분자 소거",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_FACTOR_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE_SEMANTIC_TEMPLATE_REVIEW",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "연속 조건",
      "l4": "미정계수",
      "crosswalkRecordId": "H2-M2-RPM-009"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "FAMILY_ACTIVE",
    "sourceQid": 3,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "연속 조건",
      "미정계수",
      "연속식의 미정계수"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "0c4f0973eacacf8ba0415c4f0e18b60d99cc7955a95f3069caf851a2c253e1cb",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "전 실수 연속 조건을 특정 점의 인수 소거로 환원한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "4. 연속함수 $f(x)$에 대하여 $f(-2)=-1$, $f(-1)=1$, $f(0)=-3$, $f(1)=-2$일 때, 방정식 $f(x)=0$은 열린구간 $(-2, 1)$에서 적어도 몇 개의 실근을 갖는지 구하시오. [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "images": [],
    "answer": "②",
    "solution": "먼저 연속함수에 적용하는 **사잇값 정리**를 확인한다. 연속함수의 양 끝 함수값의 부호가 서로 다르면 그 사이에 함수값이 $0$인 점이 적어도 하나 존재한다.\n\n① $(-2,-1)$에서는 $f(-2)=-1<0$, $f(-1)=1>0$이므로 적어도 한 근이 있다.\n② $(-1,0)$에서는 $f(-1)=1>0$, $f(0)=-3<0$이므로 적어도 한 근이 있다.\n③ $(0,1)$에서는 양 끝값 $-3,-2$가 모두 음수이다. 이 구간에도 근이 있을 수 있지만, 주어진 정보만으로는 근이 반드시 있다고 할 수 없다.\n\n앞의 두 구간은 서로 겹치지 않고 공통 경계점 $-1$에서는 $f(-1)=1\\ne0$이므로 서로 다른 근 **적어도 2개**가 보장된다. 실제로 주어진 네 점을 순서대로 직선으로 이어 만든 연속함수는 첫째·둘째 구간에 각각 한 근만 가지므로 3개 이상을 반드시 보장할 수 없다.\n따라서 답은 $2$, ②이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "연속함수의 성질",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "사잇값 정리",
    "decisiveStep": "부호 변화 구간 2개",
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_MINIMUM_ROOT_COUNT",
    "crossConceptKeys": [
      "CC_INTERMEDIATE_VALUE_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "연속함수의 성질",
      "l4": "사잇값 정리",
      "crosswalkRecordId": "H2-M2-RPM-012"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 4,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "연속함수의 성질",
      "사잇값 정리",
      "사잇값 정리"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "aa3980d8daed5cf9e8079a427a069bc9a5060aacdbb0d382791039b6f14f5ef5",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "두 개의 서로 다른 부호변화 구간을 세며 불필요한 세 번째 근을 단정하지 않는다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "5. 함수 $f(x)=x^2-5x+4$에 대하여 $x$의 값이 $a$에서 $a+1$까지 변할 때의 평균변화율이 2일 때, 상수 $a$의 값을 구하시오. [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "images": [],
    "answer": "③",
    "solution": "평균변화율은 두 끝점에서의 함수값 차를 입력 변화량으로 나눈 것이다.\n$\\displaystyle\\frac{f(a+1)-f(a)}{(a+1)-a}=2$를 이용한다.\n$f(a+1)=(a+1)^2-5(a+1)+4=a^2-3a$,\n$f(a)=a^2-5a+4$이므로 차는 $2a-4$이다.\n$2a-4=2$에서 $2a=6$, $a=3$이다.\n따라서 정답은 ③이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "standardUnit": "미분",
    "subUnit": "미분계수",
    "level": "하",
    "difficultyBucket": 2,
    "primaryMethod": "평균변화율",
    "decisiveStep": "차분을 2a-4로 정리",
    "problemTypeKey": "PT_DERIVATIVE_RATE_RELATION",
    "templateKey": "TPL_AVERAGE_RATE_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "미분계수",
      "l4": "평균변화율·순간변화율",
      "crosswalkRecordId": "H2-M2-RPM-013"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 5,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "미분계수",
      "평균변화율·순간변화율",
      "평균변화율"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "7cd2481094005e179f6177bab1a8a91b054fee3931149ac0850fd64698134850",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "평균변화율의 분자 전개와 일차식 해석이 필요하다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "6. 함수 $f(x)=(x+1)(x^2-3x+4)$에 대하여 $f'(2)$의 값을 구하시오. [3.8점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "곱의 미분법을 적용한다. $u(x)=x+1$, $v(x)=x^2-3x+4$로 놓으면\n$f'(x)=u'(x)v(x)+u(x)v'(x)$이다.\n$u'(x)=1$, $v'(x)=2x-3$이므로\n$f'(2)=1\\cdot(4-6+4)+(2+1)(4-3)=2+3=5$이다.\n따라서 정답은 ⑤이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-04",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "standardUnit": "미분",
    "subUnit": "도함수",
    "level": "하",
    "difficultyBucket": 2,
    "primaryMethod": "곱의 미분법",
    "decisiveStep": "도함수 대입",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "도함수",
      "l4": "미분법",
      "crosswalkRecordId": "H2-M2-RPM-015"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 6,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "도함수",
      "미분법",
      "곱의 미분법"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "05bd1519a5cb8f02db30d3839febb97456f8b58f2dae3b0db527717fd406a5e2",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "곱의 미분법과 대입을 정확히 수행한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "7. 점 $(1, -1)$에서 곡선 $y=x^3-2x$에 그은 접선이 점 $(k, 2)$를 지날 때, $k$의 값을 구하시오. [4.0점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "images": [],
    "answer": "④",
    "solution": "접선의 기울기는 접점에서의 도함수값이다.\n$y=x^3-2x$를 미분하면 $y'=3x^2-2$이고 $x=1$에서 기울기는 $1$이다.\n접점 $(1,-1)$을 지나는 접선은 $y+1=1(x-1)$, 즉 $y=x-2$이다.\n점 $(k,2)$가 접선 위에 있으므로 $2=k-2$이고 $k=4$이다.\n따라서 정답은 ④이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-05",
    "subUnitKey": "H15-M2-05-TANGENT",
    "standardUnit": "미분",
    "subUnit": "접선",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "접선의 방정식",
    "decisiveStep": "접점 기울기와 지나가는 점",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "접선",
      "l4": "접선의 방정식",
      "crosswalkRecordId": "H2-M2-RPM-019"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 7,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "접선",
      "접선의 방정식",
      "접선의 방정식"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "35faf6b5ded86a269bbf09d733d361fca8f2b644c7bf7e6a63463491d9365b4c",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "도함수와 점-기울기식, 통과점 조건을 순차 적용한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "8. 함수 $f(x)=-2x^2+x+1$에 대하여 닫힌구간 $[1, 2]$에서 평균값 정리를 만족시키는 실수 $c$의 값을 구하시오. [4.0점]",
    "choices": [
      "$-\\frac{3}{2}$",
      "$-\\frac{1}{2}$",
      "0",
      "$\\frac{1}{2}$",
      "$\\frac{3}{2}$"
    ],
    "images": [],
    "answer": "⑤",
    "solution": "평균값 정리에 따라 $f'(c)=\\dfrac{f(2)-f(1)}{2-1}$을 만족하는 $c\\in(1,2)$가 존재한다.\n$f(1)=-2+1+1=0$, $f(2)=-8+2+1=-5$이므로 평균변화율은 $-5$이다.\n$f'(x)=-4x+1$이므로 $-4c+1=-5$, $c=\\dfrac32$이다.\n$1<\\dfrac32<2$로 구간 조건도 만족한다. 따라서 정답은 ⑤이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-06",
    "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION",
    "standardUnit": "미분",
    "subUnit": "평균값 정리 기초",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "평균값 정리",
    "decisiveStep": "구간 평균 기울기와 f′(c) 일치",
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "평균값 정리 기초",
      "l4": "변화율",
      "crosswalkRecordId": "H2-M2-RPM-021"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 8,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "평균값 정리 기초",
      "변화율",
      "평균값 정리"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "7ede58b1c9e5076f41a147728a295edab75e4958f1801ac8ece2a8c8ead7727d",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "평균값 정리의 c∈(1,2) 구간 검증까지 필요하다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "9. $\\lim_{x \\to 0} \\frac{\\sqrt{x-a+1}-b}{x}=1$일 때, 상수 $a, b$에 대하여 $a+b$의 값은? [4.0점]",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$\\frac{5}{4}$",
      "$\\frac{7}{4}$"
    ],
    "images": [],
    "answer": "④",
    "solution": "분모가 $x\\to0$에서 $0$이므로 극한이 유한한 $1$이 되려면 분자도 $0$으로 가야 한다. 따라서\n$\\sqrt{1-a}-b=0$, 즉 $b=\\sqrt{1-a}\\ge0$이다.\n\n이 조건을 이용해 분자를 유리화하면\n$\\displaystyle\\frac{\\sqrt{x-a+1}-b}{x}=\\frac{x+1-a-b^2}{x(\\sqrt{x-a+1}+b)}=\\frac{x}{x(\\sqrt{x-a+1}+b)}=\\frac1{\\sqrt{x-a+1}+b}$이다($x\\ne0$).\n\n만약 $b=0$이면 오른쪽은 $x\\to0+$에서 무한대로 커져 극한이 $1$이 될 수 없다. 따라서 $b>0$이고 극한은 $\\dfrac1{2b}=1$이다.\n$2b=1$에서 $b=\\dfrac12$, $b^2=1-a$에서 $a=1-\\dfrac14=\\dfrac34$이다.\n그러므로 $a+b=\\dfrac34+\\dfrac12=\\dfrac54$이며 보기 ④이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "극한의 성질",
    "level": "상",
    "difficultyBucket": 3,
    "primaryMethod": "유리화와 미정계수",
    "decisiveStep": "분자 소거와 1/(2b)",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "극한의 성질",
      "l4": "미정계수",
      "crosswalkRecordId": "H2-M2-RPM-004"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 9,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "극한의 성질",
      "미정계수",
      "유리화와 미정계수"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "f2fddce1e3d93568c2c1d36d24e4dc664f28e75f480e290c6d93357faacf02d4",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "분자 0 조건, 유리화, 계수 결정의 세 단계를 결합한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "10. 함수 $f(x)=x^4-2x^3+3x+4$에 대하여 $\\lim_{h \\to 0} \\frac{f(1+h)-f(1-h)}{2h}$의 값은? [4.0점]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "images": [],
    "answer": "④",
    "solution": "이 식은 $x=1$을 중심으로 양쪽에서 똑같은 거리 $h$만큼 떨어진 함수값의 차이다. 다항함수는 미분가능하므로 **미분계수의 정의**로 정리할 수 있다.\n\n$\\displaystyle\\frac{f(1+h)-f(1-h)}{2h}$\n$\\displaystyle=\\frac12\\left\\{\\frac{f(1+h)-f(1)}h+\\frac{f(1)-f(1-h)}h\\right\\}$이다.\n\n첫 번째 분수는 $h\\to0$일 때 $f'(1)$로 간다. 두 번째 분수는 $t=-h$로 놓으면 $\\dfrac{f(1+t)-f(1)}t$가 되므로 역시 $f'(1)$로 간다. 따라서 원래 극한은 $\\dfrac12\\{f'(1)+f'(1)\\}=f'(1)$이다.\n\n$f'(x)=4x^3-6x^2+3$이므로 $f'(1)=4-6+3=1$이다. 보기에서 $1$은 ④이다. 고등 수학II 범위의 미분계수 정의만 사용했으며 고차항 전개 공식을 가정하지 않았다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "standardUnit": "미분",
    "subUnit": "미분계수",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "대칭차분 극한",
    "decisiveStep": "f′(1)로 환원",
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "미분계수",
      "l4": "정의로 미분계수",
      "crosswalkRecordId": "H2-M2-RPM-014"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 10,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "미분계수",
      "정의로 미분계수",
      "대칭차분 극한"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "b853339a6ab4d8fcd5f5774d0fc6b88ba28472e8b60072dc2a6d6f81bc7195af",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "대칭차분을 미분계수로 해석해야 한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "11. 곡선 $y=-\\frac{1}{4}x^2$ 위의 점 $(2, -1)$에서의 접선과 $x$축, $y$축으로 둘러싸인 삼각형의 넓이는? [4.0점]",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{4}$",
      "$\\frac{3}{2}$",
      "$\\frac{5}{4}$"
    ],
    "images": [],
    "answer": "①",
    "solution": "곡선 $y=-\\dfrac14x^2$의 도함수는 $y'=-\\dfrac12x$이다.\n$x=2$에서 기울기는 $-1$이고 접점은 $(2,-1)$이므로 접선은\n$y+1=-(x-2)$, 즉 $y=-x+1$이다.\n$x$절편은 $(1,0)$, $y$절편은 $(0,1)$이다.\n두 좌표축과 접선이 만드는 직각삼각형의 넓이는 $\\dfrac12\\cdot1\\cdot1=\\dfrac12$이다.\n따라서 정답은 ①이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-05",
    "subUnitKey": "H15-M2-05-TANGENT",
    "standardUnit": "미분",
    "subUnit": "접선",
    "level": "중",
    "difficultyBucket": 2,
    "primaryMethod": "접선 절편 넓이",
    "decisiveStep": "접선 방정식→절편",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_LINE_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "접선",
      "l4": "접선의 방정식",
      "crosswalkRecordId": "H2-M2-RPM-019"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 11,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "접선",
      "접선의 방정식",
      "접선 절편 넓이"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "4e2d428461d56db5f688c4dfc7c77622a5425f46889fd700556173873187e18c",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "접선 미분·절편·삼각형 넓이의 세 개념을 연결한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "12. 다항함수 $f(x), g(x)$에 대하여 $\\lim_{x \\to 3} \\frac{f(x)-2}{x-3}=1$, $\\lim_{x \\to 3} \\frac{g(x)-1}{x-3}=2$일 때, 함수 $f(x)g(x)$의 $x=3$에서의 미분계수는? [4.2점]",
    "choices": [
      "3",
      "5",
      "7",
      "9",
      "11"
    ],
    "images": [],
    "answer": "②",
    "solution": "주어진 첫 번째 극한에서 분모 $x-3\\to0$인데 극한값은 $1$로 유한하다. 다항함수의 연속성 때문에 분자도 $0$으로 가야 하므로 $f(3)-2=0$, 즉 $f(3)=2$이다. 마찬가지로 두 번째 극한에서 $g(3)=1$이다.\n\n이제 식을 **미분계수의 정의**와 비교한다.\n$\\displaystyle f'(3)=\\lim_{x\\to3}\\frac{f(x)-f(3)}{x-3}=1$,\n$\\displaystyle g'(3)=\\lim_{x\\to3}\\frac{g(x)-g(3)}{x-3}=2$이다.\n\n구하는 값은 곱함수의 미분계수이므로 곱의 미분법을 사용한다.\n$\\displaystyle(fg)'(3)=f'(3)g(3)+f(3)g'(3)$\n$\\displaystyle=1\\cdot1+2\\cdot2=1+4=5$이다.\n따라서 정답은 $5$, ②이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-03",
    "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION",
    "standardUnit": "미분",
    "subUnit": "미분계수",
    "level": "중",
    "difficultyBucket": 3,
    "primaryMethod": "곱의 미분계수",
    "decisiveStep": "f(3),g(3),f′(3),g′(3)",
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_INFORMATION_SYSTEM",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "미분계수",
      "l4": "정의로 미분계수",
      "crosswalkRecordId": "H2-M2-RPM-014"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 12,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "미분계수",
      "정의로 미분계수",
      "곱의 미분계수"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "dbdaca38bbc289f8ce2056c62cff6279ebb82e895fbdb48e5abf0d11cab497de",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "두 개의 극한에서 함수값과 도함수를 추출한 뒤 곱의 미분법을 쓴다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "13. 자연수 $n$에 대하여 $\\lim_{x \\to n} \\frac{[x]^2+3x}{[x]}=k$일 때, $k+n$의 값을 구하시오. (단, $[x]$는 $x$보다 크지않은 최대의 정수) [4.2점]",
    "choices": [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    "images": [],
    "answer": "①",
    "solution": "$[x]$는 $x$ 이하의 최대 정수이므로 정수 경계 $n$에 접근할 때 **왼쪽과 오른쪽에서 값이 달라진다**. 양쪽 극한이 같아야 문제의 극한 $k$가 존재한다.\n\n$n\\ge2$라 하면 $x\\to n-$에서는 $[x]=n-1$이므로\n$\\displaystyle L_- =\\frac{(n-1)^2+3n}{n-1}=\\frac{n^2+n+1}{n-1}=n+2+\\frac3{n-1}$이다.\n반면 $x\\to n+$에서는 $[x]=n$이므로\n$\\displaystyle L_+=\\frac{n^2+3n}{n}=n+3$이다.\n\n$L_-=L_+$에서 $\\dfrac3{n-1}=1$, 따라서 $n-1=3$, $n=4$이다. 이때 $k=L_+=4+3=7$이므로 $k+n=7+4=11$이다.\n$n=1$의 왼쪽 근방에서는 $[x]=0$으로 원래 분모가 $0$이 되어 두 방향의 극한을 비교할 수 없으므로 이 경우는 제외한다. 정답은 ①이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "함수의 극한",
    "level": "상",
    "difficultyBucket": 4,
    "primaryMethod": "바닥함수의 양측 극한",
    "decisiveStep": "[x]=n-1,n 구분",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH",
    "crossConceptKeys": [
      "CC_GREATEST_INTEGER_FUNCTION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "함수의 극한",
      "l4": "좌극한·우극한",
      "crosswalkRecordId": "H2-M2-RPM-001"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 13,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "함수의 극한",
      "좌극한·우극한",
      "바닥함수의 양측 극한"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "117671efc9c32c73e9103c5e630a53cf1124dc425ccd1d877352d3b8f2076bdb",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "바닥함수의 좌우 서로 다른 정수값과 n=1 정의역 예외를 처리한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "14. 미분가능한 함수 $f(x)$가 모든 실수 $x, y$에 대하여 $f(x+y)=f(x)+f(y)+2xy+1$을 만족시키고 $f'(2)=2$일 때, $f'(3)$을 구하시오. [4.2점]",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "images": [],
    "answer": "①",
    "solution": "함수식 $f(x+y)=f(x)+f(y)+2xy+1$에서 $y$를 고정하고 $x$로 미분한다.\n왼쪽은 $f'(x+y)$, 오른쪽은 $f'(x)+2y$이므로\n$f'(x+y)=f'(x)+2y$이다.\n$x=2$, $y=1$을 대입하면 $f'(3)=f'(2)+2=2+2=4$이다.\n따라서 정답은 ①이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-04",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "standardUnit": "미분",
    "subUnit": "도함수",
    "level": "중",
    "difficultyBucket": 3,
    "primaryMethod": "함수방정식의 미분",
    "decisiveStep": "f′(x+y)=f′(x)+2y",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "도함수",
      "l4": "미분법",
      "crosswalkRecordId": "H2-M2-RPM-015"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 14,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "도함수",
      "미분법",
      "함수방정식의 미분"
    ],
    "layoutTag": "grid",
    "wide": false,
    "questionUid": "b6d08fc3835f0c729ba6750c30baac95fca74fb7a6048610eee59cc64bd37d9f",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "함수방정식을 미분한 뒤 변수 두 개를 특수화한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "15. 그림과 같이 곡선 $y=x^2$ 위의 점 $P(t, t^2)\\,(t>0)$에 대하여 $x$축 위의 점 $Q$, $y$축 위의 점 $R$가 다음 조건을 만족시킨다. [4.2점]\n\n(가) 삼각형 $POQ$는 $\\overline{PO}=\\overline{PQ}$인 이등변삼각형이다.\n(나) 삼각형 $PRO$는 $\\overline{RO}=\\overline{RP}$인 이등변삼각형이다.\n\n삼각형 $POQ$와 삼각형 $PRO$의 넓이를 각각 $S(t), T(t)$라 할 때, $\\lim_{t \\to 0+} 5 \\left(\\frac{T(t)-S(t)}{t}\\right)$의 값은? (단, $O$는 원점이다.)\n<img src=\"assets/images/21_금당고_2학기_중간_고2_수학II/q15.png\" alt=\"21_금당고_2학기_중간_고2_수학II Q15\" />",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "1",
      "$\\frac{5}{4}$"
    ],
    "images": [
      "assets/images/21_금당고_2학기_중간_고2_수학II/q15.png"
    ],
    "answer": "⑤",
    "solution": "그림의 $P$는 포물선 $y=x^2$ 위에 있으므로 $P=(t,t^2)$이다($t>0$). $Q=(q,0)$, $R=(0,r)$로 두고, 이등변삼각형의 **같은 길이 조건을 제곱한 거리식**으로 바꾼다.\n\n① $PO=PQ$에서\n$PO^2=t^2+t^4$, $PQ^2=(q-t)^2+t^4$이므로 $t^2=(q-t)^2$이다.\n따라서 $q=0$ 또는 $q=2t$이다. $q=0$이면 $Q=O$가 되어 삼각형이 만들어지지 않으므로 $q=2t$이다.\n$x$축 위 밑변 $OQ=2t$, 높이 $t^2$를 이용하면\n$\\displaystyle S(t)=\\frac12\\cdot2t\\cdot t^2=t^3$이다.\n\n② $RO=RP$에서\n$r^2=t^2+(r-t^2)^2=t^2+r^2-2rt^2+t^4$이다.\n$t>0$이므로 $2r=1+t^2$, 즉 $r=\\dfrac{1+t^2}2$이다.\n$y$축 위 밑변 $OR=r$, 높이 $t$를 이용하면\n$\\displaystyle T(t)=\\frac12\\cdot r\\cdot t=\\frac{t(1+t^2)}4$이다.\n\n③ 두 넓이의 차를 정리하면\n$\\displaystyle5\\frac{T(t)-S(t)}t=5\\left(\\frac{1+t^2}{4}-t^2\\right)=\\frac54-\\frac{15t^2}4$이다.\n따라서 $t\\to0+$일 때 극한은 $\\dfrac54$이며 정답은 ⑤이다. 원본 그림의 $OQ$와 $OR$가 각각 두 삼각형의 밑변임을 구분하는 것이 핵심이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "함수의 극한",
    "level": "상",
    "difficultyBucket": 4,
    "primaryMethod": "이등변삼각형 좌표모델 극한",
    "decisiveStep": "Q=(2t,0),R=(0,(1+t²)/2)",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_GEOMETRY_PARAMETERIZATION",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE_SEMANTIC_TEMPLATE_REVIEW",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "함수의 극한",
      "l4": "극한값 계산",
      "crosswalkRecordId": "H2-M2-RPM-002"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "FAMILY_ACTIVE",
    "sourceQid": 15,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "함수의 극한",
      "극한값 계산",
      "이등변삼각형 좌표모델 극한"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "d46d63b4ca75a3db0cdae9d5cdd079ec68f42a9ea15fe1a467ac391e4c369f7e",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "이등변 길이조건 두 개로 좌표를 결정하고 넓이 극한을 계산한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "서술형",
    "content": "[단답형 1] $x \\neq 2$인 모든 실수에서 정의된 함수 $f(x)$와 $g(x)$가\n$$\\lim_{x \\to 2} f(x) = \\infty, \\quad \\lim_{x \\to 2} \\{f(x)-2g(x)\\} = 1$$\n을 만족시킨다. 이때, $\\lim_{x \\to 2} \\frac{f(x)-4g(x)}{3f(x)-2g(x)}$의 값을 구하여라. [4.5점]",
    "choices": [],
    "images": [],
    "answer": "-1/2",
    "solution": "무한대로 발산하는 두 함수를 각각 따로 나누기보다 유한한 차를 새 문자로 둔다.\n$u(x)=f(x)-2g(x)$라 놓으면 $u(x)\\to1$이고 $2g=f-u$이다.\n분자는 $f-4g=f-2(f-u)=-f+2u$,\n분모는 $3f-2g=3f-(f-u)=2f+u$이다.\n따라서 원래 분수는 $\\dfrac{-f+2u}{2f+u}$이다.\n분자와 분모를 $f$로 나누면 $\\dfrac{-1+2u/f}{2+u/f}$이고,\n$f\\to+\\infty$, $u\\to1$이므로 $u/f\\to0$이다.\n구하는 극한은 $-\\dfrac12$이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "극한의 성질",
    "level": "중",
    "difficultyBucket": 3,
    "primaryMethod": "발산 함수의 비율",
    "decisiveStep": "u=f-2g 치환",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_ASYMPTOTIC_RELATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "극한의 성질",
      "l4": "대수적 계산",
      "crosswalkRecordId": "H2-M2-RPM-003"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 16,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "극한의 성질",
      "대수적 계산",
      "발산 함수의 비율"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "6594835435627f3f7513234290ba181e086e831adc69196435130e396e82ac88",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "발산함수의 선형관계를 소거한 뒤 최고차 성분 비율을 구한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "서술형",
    "content": "[단답형 2] 실수 $t$에 대하여 원 $(x-t)^2+y^2=4$가 두 직선 $3x+4y-8=0$, $4x-3y+6=0$과 만나는 서로 다른 점의 개수를 $f(t)$라 하자. 함수 $f(t)$가 $t=a$에서 불연속이라 할 때, 모든 $a$값의 합을 구하여라. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "7/3",
    "solution": "원의 중심은 $C=(t,0)$, 반지름은 $2$이다. 직선과 원의 교점 수는 중심에서 직선까지의 거리가 $2$보다 작은지(2점), 같은지(접점 1개), 큰지(0점)에 따라 달라진다.\n\n① 직선 $3x+4y-8=0$까지의 거리는 $\\dfrac{|3t-8|}{5}$이다. 접할 때 $|3t-8|=10$이므로 $t=6,-\\dfrac23$에서 교점 수가 달라진다.\n② 직선 $4x-3y+6=0$까지의 거리는 $\\dfrac{|4t+6|}{5}$이다. 접할 때 $|4t+6|=10$이므로 $t=1,-4$에서 교점 수가 달라진다.\n\n③ 그러나 문제는 **두 직선과 원이 만나는 서로 다른 점의 총개수**를 묻는다. 두 직선의 교점을 연립하면\n$3x+4y=8$, $4x-3y=-6$에서 $(x,y)=(0,2)$이다.\n이 공통점이 원 위에 있을 조건은 $(0-t)^2+2^2=4$, 즉 $t^2=0$이므로 $t=0$이다. $t=0$에서는 두 직선 모두 원을 서로 다른 두 점에서 가로지르지만, 그중 $(0,2)$가 겹쳐 총 4점이 아니라 3점이다. $0$의 바로 근처에서는 공통점이 원 위에 있지 않아 4점이므로 $t=0$에서도 $f(t)$가 불연속이다.\n\n따라서 불연속이 되는 서로 다른 $t$는 $-4,-\\dfrac23,0,1,6$이고, 합은\n$-4-\\dfrac23+0+1+6=\\dfrac73$이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-02",
    "subUnitKey": "H15-M2-02-CONTINUITY",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "연속의 뜻",
    "level": "상",
    "difficultyBucket": 4,
    "primaryMethod": "원-직선 접점 수의 불연속",
    "decisiveStep": "접선 조건 및 두 직선 공통점 중복",
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_COUNT_FUNCTION_DISCONTINUITY_FIND",
    "crossConceptKeys": [
      "CC_CIRCLE_TANGENCY",
      "CC_LINE_INTERSECTION",
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "CASE_BRANCH",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "연속의 뜻",
      "l4": "한 점에서의 연속",
      "crosswalkRecordId": "H2-M2-RPM-007"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 17,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "연속의 뜻",
      "한 점에서의 연속",
      "원-직선 접점 수의 불연속"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "ddb6d0b1eaf49e5e7db765d8a634ea22d2a6ed4db52378fddf5aafa03a2b003a",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "접점 네 개뿐 아니라 두 직선의 공통교점 중복까지 찾아야 한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "서술형",
    "content": "[단답형 3] 삼차함수 $f(x)=x^3+3x^2-9x$에 대하여 함수 $g(x)$를\n$$g(x) = \\begin{cases} f(x) & (x < a) \\\\ m-f(x) & (a \\le x < b) \\\\ n+f(x) & (x \\ge b) \\end{cases}$$\n로 정의한다. 함수 $g(x)$가 모든 실수 $x$에 대하여 미분가능하도록 하는 상수 $a, b, n, m$에 대하여 $a+b+n+m$의 값을 구하시오. [5.0점]",
    "choices": [],
    "images": [],
    "answer": "116",
    "solution": "조각함수가 모든 실수에서 미분가능하려면 각 다항식 구간 내부뿐 아니라 **경계 $a,b$에서 함수값과 좌우 기울기가 모두 일치**해야 한다.\n\n① $x=a$에서 왼쪽은 $f(x)$, 오른쪽은 $m-f(x)$이다. 좌우 미분계수가 같으려면 $f'(a)=-f'(a)$, 즉 $f'(a)=0$이다.\n② $x=b$에서 왼쪽은 $m-f(x)$, 오른쪽은 $n+f(x)$이다. 좌우 미분계수가 같으려면 $-f'(b)=f'(b)$, 즉 $f'(b)=0$이다.\n\n$f'(x)=3x^2+6x-9=3(x+3)(x-1)$이므로 가능한 경계는 $-3$과 $1$이다. 구간 순서 $a<b$에 따라 $a=-3$, $b=1$이다.\n\n③ 기울기만 맞으면 안 되고 **함수값도 이어져야** 한다. $a$에서 $f(a)=m-f(a)$이므로 $m=2f(-3)$이다.\n$f(-3)=-27+27+27=27$에서 $m=54$이다.\n$b$에서 $m-f(b)=n+f(b)$이므로 $n=m-2f(1)$이다.\n$f(1)=1+3-9=-5$에서 $n=54-2(-5)=64$이다.\n\n따라서 $a+b+n+m=-3+1+64+54=116$이다. 이 값들은 두 경계의 연속 조건과 미분계수 일치를 모두 만족한다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-04",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "standardUnit": "미분",
    "subUnit": "미분가능성과 연속",
    "level": "상",
    "difficultyBucket": 4,
    "primaryMethod": "구간별 함수의 미분가능 조건",
    "decisiveStep": "두 경계에서 f′=0",
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_DIFFERENTIABILITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "CASE_BRANCH",
    "metaProjectionStatus": "PROJECTION_BINDING_PENDING",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "미분가능성과 연속",
      "l4": "미분가능 조건",
      "crosswalkRecordId": "H2-M2-RPM-017"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_BINDING_GAP",
    "sourceQid": 18,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "미분가능성과 연속",
      "미분가능 조건",
      "구간별 함수의 미분가능 조건"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "9cb97ba851a1d9bed11322beacfab005f04bf0352c77c095c0648c7f0fa4494e",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "두 경계의 미분가능 조건과 연속 조건을 모두 연립한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": false
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "서술형",
    "content": "[단답형 4] 함수 $f(x)=|3x-9|$에 대하여 함수 $g(x)$는\n$$g(x) = \\begin{cases} \\frac{3}{2}f(x+k) & (x < 0) \\\\ f(x) & (x \\ge 0) \\end{cases}$$\n이고 $g(x)$는 $x=0$에서 연속이다. 최고차항의 계수가 1인 삼차함수 $h(x)$가 다음 조건을 만족시킬 때, 모든 $h(k)$의 값의 합을 구하시오. (단, $k>0$) [5.5점]\n\n(가) 함수 $g(x)h(x)$는 실수 전체의 집합에서 미분가능하다.\n(나) $h'(3)=15$",
    "choices": [],
    "images": [],
    "answer": "64",
    "solution": "먼저 $g$가 $x=0$에서 연속이라는 조건을 사용한다.\n$g(0)=f(0)=|{-9}|=9$이고, 왼쪽 극한은 $\\dfrac32f(k)=\\dfrac92|k-3|$이므로\n$\\dfrac92|k-3|=9$, $|k-3|=2$이다. $k>0$을 만족하는 후보는 $k=1,5$이다.\n\n이제 $g(x)h(x)$가 미분가능해야 하므로 **$g$의 기울기가 갑자기 바뀌는 점(뾰족점)**을 살핀다. $g$는 그 점에서 연속이므로, $g$의 좌우 기울기가 서로 다르면 곱의 좌우 미분계수가 같기 위해 $h$의 함수값이 $0$이어야 한다.\n\n① $x=0$: $k=1$이면 $g$의 왼쪽 기울기는 $-\\dfrac92$, 오른쪽은 $-3$이다. $k=5$이면 왼쪽 $\\dfrac92$, 오른쪽 $-3$이다. 어느 경우에도 다르므로 $h(0)=0$이다.\n② $x=3$: $g(x)=|3x-9|$의 뾰족점이므로 $h(3)=0$이다.\n③ $k=5$이면 왼쪽 구간의 $g(x)=\\dfrac92|x+2|$가 $x=-2$에서 뾰족하므로 추가로 $h(-2)=0$이어야 한다. $k=1$에서는 왼쪽 구간에 뾰족점이 없다.\n\n최고차항 계수가 $1$인 삼차함수에 $h(0)=h(3)=0$을 적용해\n$h(x)=x(x-3)(x-r)$로 놓는다.\n$x=3$에서 미분하면 $h'(3)=3(3-r)=15$이므로 $r=-2$이다.\n따라서 $h(x)=x(x-3)(x+2)$이고, $k=5$에서 필요한 $h(-2)=0$도 만족한다.\n\n$k=1$일 때 $h(1)=1\\cdot(-2)\\cdot3=-6$이고, $k=5$일 때 $h(5)=5\\cdot2\\cdot7=70$이다.\n두 값의 합은 $-6+70=64$이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-04",
    "subUnitKey": "H15-M2-04-DERIVATIVE",
    "standardUnit": "미분",
    "subUnit": "미분가능성과 연속",
    "level": "상",
    "difficultyBucket": 5,
    "primaryMethod": "절댓값 뾰족점의 미분가능성",
    "decisiveStep": "h(0)=h(3)=0, k=5에서 h(-2)=0 및 h′(3)=15",
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_FUNCTION",
      "CC_DIFFERENTIABILITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION",
      "COND_POSITIVE"
    ],
    "integrationPattern": "CASE_BRANCH",
    "metaProjectionStatus": "PROJECTION_BINDING_PENDING",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "미분가능성과 연속",
      "l4": "미분가능 조건",
      "crosswalkRecordId": "H2-M2-RPM-017"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_BINDING_GAP",
    "sourceQid": 19,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "미분가능성과 연속",
      "미분가능 조건",
      "절댓값 뾰족점의 미분가능성"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "6a43bc83a17a756fab85c2a2f81f7baad2e8ced2ff58d3279701705cae7ff9b0",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "연속인 두 k값과 0·3 두 비미분점, 삼차함수 근 구조를 종합한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": false
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "[서술형 1] 두 다항함수 $f(x), g(x)$에 대하여\n$$\\lim_{x \\to \\infty} \\frac{f(x)}{g(x)} = 2, \\quad \\lim_{x \\to \\infty} \\frac{f(x)-g(x)}{x-2} = 3$$\n을 만족한다. 다음 두 물음에 답하시오. [10.0점]\n\n1) $f(x), g(x)$의 두 다항함수의 차수와 최고차항의 계수를 구하는 과정을 서술하시오. [6.0점]\n2) $\\lim_{x \\to -2} \\frac{f(x)+g(x)}{x+2}$의 값이 존재할 때, 그 값을 구하는 과정을 서술하시오. [4.0점]",
    "choices": [],
    "images": [],
    "answer": "9",
    "solution": "1) **무한대에서의 두 극한으로 차수와 최고차항 계수 결정**\n$\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=2\\ne0$이므로 두 다항식의 차수가 같고 최고차항 계수의 비는 $2:1$이다. $g$의 최고차항 계수를 $A\\ne0$이라 하면 $f$의 최고차항 계수는 $2A$이다. 따라서 $f-g$의 최고차항 계수는 $2A-A=A\\ne0$이므로 $f-g$도 같은 차수이다.\n\n한편 $\\lim_{x\\to\\infty}\\dfrac{f(x)-g(x)}{x-2}=3$이 유한한 0 아닌 값이므로 $f-g$는 일차식이고 일차항 계수가 $3$이다. 따라서 $f,g$도 일차식이다.\n$g(x)=Ax+B$, $f(x)=2Ax+C$로 놓으면 $f-g=Ax+C-B$이므로 $A=3$이다.\n즉 $f(x)=6x+C$, $g(x)=3x+B$이고 두 함수의 최고차항 계수는 각각 $6,3$이다.\n\n2) **$x=-2$에서 유한 극한이 존재할 조건**\n$f(x)+g(x)=9x+B+C$이다. 분모 $x+2\\to0$이므로 유한한 극한이 존재하려면 분자도 $x=-2$에서 $0$이어야 한다.\n$-18+B+C=0$이므로 $B+C=18$이다.\n따라서 $f(x)+g(x)=9x+18=9(x+2)$이다. $x\\ne-2$에서 약분하면\n$\\displaystyle\\frac{f(x)+g(x)}{x+2}=9$이므로 구하는 극한은 $9$이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-01",
    "subUnitKey": "H15-M2-01-LIMIT",
    "standardUnit": "함수의 극한과 연속",
    "subUnit": "무한대에서의 극한",
    "level": "상",
    "difficultyBucket": 4,
    "primaryMethod": "무한대 다항식 차수",
    "decisiveStep": "일차항 계수와 유한극한 소거",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_POLYNOMIAL_RECONSTRUCTION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "무한대에서의 극한",
      "l4": "다항·유리함수",
      "crosswalkRecordId": "H2-M2-RPM-005"
    },
    "metaOwnerPack": "LIMIT_CONTINUITY",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 20,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "무한대에서의 극한",
      "다항·유리함수",
      "무한대 다항식 차수"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "c4f083d8c993dbd09befd44ba4cbf6254d8477f2f56b9a3ab20ffb98e8e31cb7",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "무한대에서 차수·계수 추출 후 다른 점의 유한극한 조건을 적용한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "[서술형 2] 최고차항의 계수가 1인 사차함수 $f(x)$에 대하여 네 개의 수 $f(-1), f(0), f(1), f(2)$가 이 순서대로 등차수열을 이루고, 곡선 $y=f(x)$ 위의 점 $(-1, f(-1))$에서의 접선과 점 $(2, f(2))$에서의 접선이 점 $(k, 0)$에서 만난다. $f(2k)=20$일 때, $f(6k)$의 값을 구하는 과정을 서술하시오. (단, $k$는 상수이다.) [10.0점]",
    "choices": [],
    "images": [],
    "answer": "88",
    "solution": "등차수열 조건을 먼저 식으로 바꾸어 사차함수의 미정계수를 줄이고, 두 접선의 교점을 이용해 나머지 계수를 결정한다.\n\n① $f(x)=x^4+Ax^3+Bx^2+Cx+D$라 놓는다. 네 값이 등차수열이므로 연속한 세 항에 대해\n$f(-1)-2f(0)+f(1)=0$, $f(0)-2f(1)+f(2)=0$이다.\n첫째 식을 전개하면 $2+2B=0$이므로 $B=-1$이다.\n둘째 식을 전개하면 $14+6A+2B=0$이므로 $14+6A-2=0$, $A=-2$이다.\n따라서 $f(x)=x^4-2x^3-x^2+Cx+D$이다.\n\n② $f'(x)=4x^3-6x^2-2x+C$이므로 $f'(-1)=C-8$, $f'(2)=C+4$이다.\n또 $f(-1)=2-C+D$, $f(2)=-4+2C+D$이다.\n따라서 $x=-1$에서의 접선은 $y=(C-8)(x+1)+2-C+D=(C-8)x+D-6$,\n$x=2$에서의 접선은 $y=(C+4)(x-2)-4+2C+D=(C+4)x+D-12$이다.\n\n③ 두 접선이 $(k,0)$에서 만난다는 조건으로 두 식의 오른쪽을 같게 하면\n$(C-8)k+D-6=(C+4)k+D-12$이므로 $12k=6$, $k=\\dfrac12$이다.\n교점의 $y$좌표가 $0$이므로 $(C-8)\\cdot\\dfrac12+D-6=0$, 즉 $D=10-\\dfrac C2$이다.\n\n④ $f(2k)=f(1)=20$을 대입하면 $1-2-1+C+D=20$, 즉 $C+D=22$이다.\n$D=10-\\dfrac C2$와 연립하면 $C=24$, $D=-2$이다.\n$6k=3$이므로 $f(6k)=f(3)=81-54-9+72-2=88$이다.\n따라서 구하는 값은 $88$이다.",
    "standardCourse": "수학II",
    "curriculum": "2015",
    "standardUnitKey": "H15-M2-05",
    "subUnitKey": "H15-M2-05-TANGENT",
    "standardUnit": "미분",
    "subUnit": "접선",
    "level": "상",
    "difficultyBucket": 5,
    "primaryMethod": "두 접선 교점 및 다항식 계수",
    "decisiveStep": "등차수열→접선 교점→f(2k)",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "DEEP_COMPOSITE",
    "metaProjectionStatus": "PROJECTION_REUSE",
    "rpmPrimaryPath": {
      "curriculum": "2015",
      "scope": "수학II",
      "l3": "접선",
      "l4": "접점 조건",
      "crosswalkRecordId": "H2-M2-RPM-020"
    },
    "metaOwnerPack": "DERIVATIVE",
    "metaBindingStatus": "DIRECT_ACTIVE",
    "sourceQid": 21,
    "provenance": {
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "examUid": "21_금당고_2학기_중간_고2_수학II",
      "sourceJsSha256": "4fbad9f09a603d81a89965301a68ae4198ce090b212e411620aaa0866cbc735f"
    },
    "tags": [
      "수학II",
      "접선",
      "접점 조건",
      "두 접선 교점 및 다항식 계수"
    ],
    "layoutTag": "wide",
    "wide": true,
    "questionUid": "2fdfb6eac7be78727cc2858bcb22f12742d3fd9c8a6dbfee2dc3735a51a023e1",
    "metaUidStatus": "LOCAL_DETERMINISTIC_UNREGISTERED",
    "difficultyReason": "등차수열 계수 제약·두 접선 교점·함수값 조건을 연쇄적으로 풀어야 한다.",
    "curriculumCrosswalk": {
      "source": "2015/H15/수학II",
      "historicalExamYear": 2021,
      "2022Equivalent": "2022 미적분Ⅰ 대응 단원 존재",
      "mappingStatus": "NOT_ASSERTED_AS_CANONICAL_FOR_2021"
    },
    "metaCanonicalBindingPass": true
  }
];
