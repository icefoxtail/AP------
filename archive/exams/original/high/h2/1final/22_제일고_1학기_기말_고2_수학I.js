window.examTitle = "22_제일고_1학기_기말_고2_수학I";
window.questionBank = [
  {
    "id": 1,
    "questionNumber": 1,
    "questionType": "객관식",
    "content": "공차가 2인 등차수열 $\\{a_n\\}$에 대하여 $a_1 + a_6 = a_{11}$일 때, $a_1$의 값은? [3.7점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 공차가 2이고 $a_1+a_6=a_{11}$인 등차수열의 첫째항을 구한다.\n전략: $a_n=a_1+(n-1)d$에 $d=2$를 대입한다.\n풀이: $a_6=a_1+10$, $a_{11}=a_1+20$이므로 $a_1+(a_1+10)=a_1+20$. 따라서 $a_1=10$이다.\n보기 판단: 2, 4, 6, 8은 위 등식에 대입하면 좌우가 다르다. 정답 ⑤.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE",
    "primaryMethod": "등차수열 일반항",
    "decisiveStep": "항 번호의 차로 a6,a11을 a1로 표현",
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
    "sourceQid": 1,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 2,
    "questionNumber": 2,
    "questionType": "객관식",
    "content": "세 수 $\\frac{1}{\\alpha}, 9, \\frac{1}{\\beta}$는 순서대로 등차수열을 이루고 세 수 $\\alpha, \\frac{1}{3}, \\beta$는 순서대로 등비수열을 이룰 때, $\\alpha+\\beta$의 값은? [3.8점]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "①",
    "solution": "조건·목표: 세 수 $1/\\alpha,9,1/\\beta$가 등차수열이고, $\\alpha,1/3,\\beta$가 등비수열이다. $\\alpha+\\beta$를 구한다.\n전략: 등비수열의 가운데 항은 양끝 항의 곱으로, 등차수열의 가운데 항은 양끝 항의 합으로 연결된다. 두 조건을 동시에 사용한다.\n① 등비중항: $(1/3)^2=\\alpha\\beta$이므로 $\\alpha\\beta=1/9\\ne0$. 따라서 $\\alpha,\\beta$는 모두 0이 아니어서 역수 계산이 가능하다.\n② 등차중항: $2\\times9=1/\\alpha+1/\\beta=(\\alpha+\\beta)/(\\alpha\\beta)$.\n③ 앞에서 얻은 곱을 대입하면 $18=(\\alpha+\\beta)/(1/9)=9(\\alpha+\\beta)$이므로 $\\alpha+\\beta=18/9=2$.\n보기 판단: 계산된 합은 2 하나뿐이므로 ①이다. 등차조건만으로 합을 결정하려 하면 곱 정보가 빠진다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비중항과 등차중항 결합",
    "decisiveStep": "곱과 역수 합을 연결하여 합 계산",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "중항",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-053",
      "crosswalk2022RecordId": "H2-M1-RPM-119",
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
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 2,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 3,
    "questionNumber": 3,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 하자. $S_n = 3n^2 - 4n + 2$일 때, $a_1 + a_{11}$의 값은? [3.9점]",
    "choices": [
      "58",
      "59",
      "60",
      "61",
      "62"
    ],
    "answer": "③",
    "solution": "조건·목표: $S_n=3n^2-4n+2$일 때 $a_1+a_{11}$을 구한다.\n전략: 첫째항은 $S_1$, 둘째항 이후는 $a_n=S_n-S_{n-1}$로 구한다. $S_0$을 공식에 무리하게 대입하지 않는다.\n풀이: $a_1=S_1=3-4+2=1$. $a_{11}=S_{11}-S_{10}=(363-44+2)-(300-40+2)=321-262=59$. 따라서 $a_1+a_{11}=60$.\n보기 판단: ③ 60만 일치한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "부분합에서 일반항 추출",
    "decisiveStep": "a1=S1, a11=S11-S10 분리",
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
    "sourceQid": 3,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 4,
    "questionNumber": 4,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{A} = 60^\\circ, \\angle \\mathrm{C} = 75^\\circ$이고, $\\overline{\\mathrm{BC}} = 4\\sqrt{3}$일 때, 선분 $\\mathrm{AC}$의 길이와 외접원의 반지름의 길이 $R$의 값의 곱은? [4.0점]",
    "choices": [
      "$8\\sqrt{2}$",
      "$8\\sqrt{3}$",
      "$16\\sqrt{2}$",
      "$16\\sqrt{3}$",
      "$16\\sqrt{6}$"
    ],
    "answer": "③",
    "solution": "조건·목표: $A=60^\\circ$, $C=75^\\circ$, $BC=4\\sqrt3$에서 $AC\\cdot R$을 구한다.\n전략: $B=180^\\circ-A-C=45^\\circ$이고 사인법칙 $a/\\sin A=b/\\sin B=2R$을 사용한다.\n풀이: $2R=(4\\sqrt3)/(\\sqrt3/2)=8$이므로 $R=4$. $AC=b=2R\\sin45^\\circ=8\\cdot\\sqrt2/2=4\\sqrt2$. 따라서 $AC\\cdot R=16\\sqrt2$.\n보기 판단: ③의 $16\\sqrt2$만 일치한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "사인법칙",
    "decisiveStep": "2R=a/sin A와 AC=2R sin B",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "사인법칙",
      "l4": "외접원 반지름",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-043",
      "crosswalk2022RecordId": "H2-M1-RPM-109",
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
    "sourceQid": 4,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 5,
    "questionNumber": 5,
    "questionType": "객관식",
    "content": "삼각형 $\\mathrm{ABC}$에서 $\\sin A = \\sin B \\cos C$가 성립할 때, 이 삼각형은 어떤 삼각형인가? [4.0점]",
    "choices": [
      "$A=90^\\circ$인 직각삼각형",
      "$B=90^\\circ$인 직각삼각형",
      "$C=90^\\circ$인 직각삼각형",
      "$a=c$인 이등변삼각형",
      "$b=c$인 이등변삼각형"
    ],
    "answer": "②",
    "solution": "조건·목표: 삼각형 $ABC$에서 $\\sin A=\\sin B\\cos C$일 때 어느 각이 직각인지 판정한다. $a=BC$, $b=CA$, $c=AB$라 두자.\n전략: 삼각함수 덧셈정리를 쓰지 않고, 수학Ⅰ에서 다루는 사인법칙과 코사인법칙으로 변의 관계를 만든다.\n① 삼각형의 내각이므로 $\\sin B>0$이다. 주어진 식을 $\\sin B$로 나누면 $\\sin A/\\sin B=\\cos C$.\n② 사인법칙 $a/\\sin A=b/\\sin B$에 의해 $a/b=\\sin A/\\sin B=\\cos C$, 즉 $a=b\\cos C$이다.\n③ 코사인법칙을 각 $C$에 적용하면 $c^2=a^2+b^2-2ab\\cos C$. 여기에 $b\\cos C=a$를 넣어 $c^2=a^2+b^2-2a^2=b^2-a^2$를 얻는다.\n④ 따라서 $a^2+c^2=b^2$. 피타고라스 정리의 역에 의해 길이 $b$의 대각인 $B$가 $90^\\circ$이다.\n보기 판단: ②가 맞다. 직각은 $B$이며, $A$ 또는 $C$가 직각이라는 ①·③과 이등변이라는 ④·⑤는 이 결론과 다르다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "사인법칙·코사인법칙으로 직각 판정",
    "decisiveStep": "a=b cos C를 코사인법칙에 대입해 a²+c²=b²",
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
    "sourceQid": 5,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "R2 actual canonical master: 2015 수학I 사인·코사인법칙 exact H15 L1/L2 없음; 2022 H22-A-05 존재하나 2015 기출에 역투영 금지. ACTIVE 11 binding packs exact H15-M1 0. RPM semantic H2-M1-RPM-045 retained.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_H15_L1_L2_ACTIVE_BINDING_GAP"
  },
  {
    "id": 6,
    "questionNumber": 6,
    "questionType": "객관식",
    "content": "등차수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 하자. $S_{10} = 40, S_{40} = 10$일 때, $8a_2$의 값은? [4.3점]",
    "choices": [
      "39",
      "40",
      "41",
      "42",
      "43"
    ],
    "answer": "①",
    "solution": "조건·목표: $S_{10}=40$, $S_{40}=10$에서 $8a_2$를 구한다.\n전략: 등차수열의 합 $S_n=n\\{2a_1+(n-1)d\\}/2$로 두 미지수를 정한다.\n풀이: $2a_1+9d=8$, $2a_1+39d=1/2$이므로 $30d=-15/2$, $d=-1/4$. $2a_1=8+9/4=41/4$이므로 $a_1=41/8$, $a_2=41/8-1/4=39/8$. 따라서 $8a_2=39$.\n보기 판단: ① 39만 일치한다. 정답 ①.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE",
    "primaryMethod": "등차수열 합 연립",
    "decisiveStep": "S10,S40에서 d,a1 도출",
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
    "sourceQid": 6,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 7,
    "questionNumber": 7,
    "questionType": "객관식",
    "content": "첫째항이 7인 등비수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 하자. $\\frac{S_9 - S_5}{S_6 - S_2} = 2$일 때, $a_{10}$의 값은? [4.4점]",
    "choices": [
      "28",
      "35",
      "42",
      "52",
      "56"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 첫째항이 7인 등비수열에서 $(S_9-S_5)/(S_6-S_2)=2$일 때 $a_{10}$을 구한다.\n전략: 부분합 차를 항의 합으로 풀어 쓰면, 분자와 분모가 정확히 세 칸 이동한 네 항씩의 묶음이다.\n① $S_9-S_5=a_6+a_7+a_8+a_9$, $S_6-S_2=a_3+a_4+a_5+a_6$.\n② 공비를 $r$라 하면 $a_{j+3}=r^3a_j$이므로 분자의 네 항은 분모의 대응 항에 각각 $r^3$을 곱한 것이다. 분모는 주어진 분수에서 0이 아니므로 약분할 수 있다.\n③ 따라서 $(S_9-S_5)/(S_6-S_2)=r^3=2$. 공비 $r$ 자체를 구할 필요는 없다.\n④ $a_{10}=a_1r^9=7(r^3)^3=7\\times2^3=56$.\n보기 판단: ⑤ 56이다. $S_9-S_5$에 $a_5$를 포함하거나 이동 칸 수를 4로 세면 오답이 된다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비수열 부분합 차",
    "decisiveStep": "두 4항 블록의 r³ 비",
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
    "sourceQid": 7,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 8,
    "questionNumber": 8,
    "questionType": "객관식",
    "content": "모든 항이 양수이고 $a_1 = \\frac{1}{6}, a_2 + a_3 = 2$인 등비수열 $\\{a_n\\}$에 대하여 $a_n > 100$을 만족시키는 자연수 $n$의 최솟값은? [4.4점]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "solution": "조건·목표: 모든 항이 양수인 등비수열에서 $a_1=1/6$, $a_2+a_3=2$이고 $a_n>100$인 최소 $n$을 구한다.\n전략: 양수 공비 $r$를 먼저 정한 뒤 부등식의 경계 두 항을 비교한다.\n풀이: $(r+r^2)/6=2$이므로 $r^2+r-12=(r-3)(r+4)=0$. 양수 조건으로 $r=3$. 따라서 $a_n=3^{n-1}/6$이고 $a_n>100\\iff 3^{n-1}>600$. $3^5=243<600<729=3^6$이므로 최소 $n=7$.\n보기 판단: ③ 7만 부등식의 최소 자연수 조건을 만족한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비수열 일반항과 부등식",
    "decisiveStep": "양수 공비 r=3 및 경계 3^5,3^6",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "일반항",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-052",
      "crosswalk2022RecordId": "H2-M1-RPM-118",
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
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 8,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 9,
    "questionNumber": 9,
    "questionType": "객관식",
    "content": "모든 항이 양수인 수열 $a_1, a_2, a_3, \\cdots, a_{10}$이 다음 조건을 만족시킨다.<br><br>(가) $\\frac{a_2}{a_1} = \\frac{a_4}{a_3} = \\frac{a_6}{a_5} = \\frac{a_8}{a_7} = \\frac{a_{10}}{a_9} = 3$<br>(나) $a_{2n-1} = 3n-2$ ($n=1, 2, 3, 4, 5$)<br><br>첫째항부터 제 $n$항까지의 합 $S_n$에 대하여 $S_{10}$의 값은? [4.5점]",
    "choices": [
      "100",
      "110",
      "125",
      "140",
      "165"
    ],
    "answer": "④",
    "solution": "조건·목표: 홀수 번째 항 $a_{2n-1}=3n-2$, 짝수 번째 항은 바로 앞 항의 3배다. $S_{10}$을 구한다.\n전략: 다섯 쌍 $(a_{2n-1},a_{2n})$의 합으로 묶는다.\n풀이: $a_{2n}=3(3n-2)$이므로 한 쌍의 합은 $4(3n-2)$. 따라서 $S_{10}=4\\sum_{n=1}^5(3n-2)=4(3\\cdot15-10)=4\\cdot35=140$.\n보기 판단: ④ 140만 일치한다. 정답 ④.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "수열의 쌍 묶기",
    "decisiveStep": "a(2n)=3a(2n-1)로 5쌍 합",
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
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 9,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 10,
    "questionNumber": 10,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$에 대하여 수열 $\\{32^{a_n}\\}$이 공비가 2인 등비수열일 때, $a_{30} - a_{10}$의 값은? [5.1점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "16"
    ],
    "answer": "②",
    "solution": "조건·목표: $32^{a_n}$이 공비 2인 등비수열일 때 $a_{30}-a_{10}$을 구한다.\n전략: 밑 $32=2^5$를 이용하여 연속 지수의 차를 구한다.\n풀이: $32^{a_{n+1}}/32^{a_n}=2$이므로 $2^{5(a_{n+1}-a_n)}=2^1$. 따라서 $a_{n+1}-a_n=1/5$. 10번째부터 30번째까지 20번 증가하므로 $a_{30}-a_{10}=20/5=4$.\n보기 판단: ② 4만 일치한다. 정답 ②.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "지수법칙으로 공차 추론",
    "decisiveStep": "32=2^5에서 a차이 1/5",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "등차수열과 등비수열",
      "l3": "등비수열",
      "l4": "일반항",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-052",
      "crosswalk2022RecordId": "H2-M1-RPM-118",
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
    "sourceQid": 10,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 11,
    "questionNumber": 11,
    "questionType": "객관식",
    "content": "우주는 마라톤 대회에 출전하기 위해 매주 일요일마다 달리기를 하기로 하였다. 첫 번째 일요일에 $5\\text{ km}$를 달리기로 하고, 달릴 거리를 매주 일주일 전 보다 $10\\%$씩 늘려 나갈 계획이다. 이때, 달릴 거리의 총합이 처음으로 $400\\text{ km}$ 이상이 되는 날은 몇 번째 일요일인가? (단, $\\log 3=0.4771, \\log 1.1=0.0414$로 계산한다.) [5.2점]",
    "choices": [
      "15",
      "18",
      "19",
      "22",
      "24"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 첫 주 5 km, 이후 매주 10%씩 늘릴 때 누적 거리가 처음 400 km 이상인 일요일을 찾는다.\n전략: 매주 달리는 거리는 공비 $1.1>1$인 등비수열이다. 누적합은 계속 증가하므로 $S_n\\ge400$을 만족하는 가장 작은 자연수 $n$만 찾으면 된다.\n① $n$주까지의 합은 $S_n=5(1+1.1+\\cdots+1.1^{n-1})=5(1.1^n-1)/(1.1-1)=50(1.1^n-1)$.\n② $50(1.1^n-1)\\ge400\\iff 1.1^n\\ge9$.\n③ $1.1>1$이므로 상용로그를 취해도 부등호 방향이 유지된다. $n\\log1.1\\ge\\log9=2\\log3=0.9542$.\n④ $n\\ge0.9542/0.0414\\approx23.05$. 따라서 정수 $n=23$은 부족하고 $n=24$는 충족한다. 등비합이 단조 증가하므로 더 이른 주가 조건을 만족할 수 없다.\n보기 판단: ⑤ 24번째 일요일이다. $n$을 단순 반올림하여 23으로 답하지 않고 '처음 이상'이라는 경계를 올림 처리한다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비급수 누적합과 로그",
    "decisiveStep": "1.1^n>=9의 최초 자연수",
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
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 11,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 12,
    "questionNumber": 12,
    "questionType": "객관식",
    "content": "$\\sum_{k=1}^{10} (k^2+4) - \\sum_{l=5}^{10} (l^2+3)$의 값은? [4.4점]",
    "choices": [
      "47",
      "50",
      "52",
      "56",
      "61"
    ],
    "answer": "③",
    "solution": "조건·목표: 두 시그마 합의 차를 계산한다.\n전략: $k=5$부터 10까지의 제곱항을 소거하고 상수항의 차를 합한다.\n풀이: $\\sum_{k=1}^{10}(k^2+4)-\\sum_{k=5}^{10}(k^2+3)=\\sum_{k=1}^{4}(k^2+4)+\\sum_{k=5}^{10}1$. 첫 합은 $(1+4+9+16)+4\\cdot4=46$, 둘째 합은 6이므로 결과는 $52$.\n보기 판단: ③ 52만 일치한다. 정답 ③.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "시그마의 공통 구간 소거",
    "decisiveStep": "1..4의 제곱항과 5..10 상수차",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "수열의 합",
      "l3": "합의 기호 Σ",
      "l4": "성질",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-058",
      "crosswalk2022RecordId": "H2-M1-RPM-124",
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
    "integrationPattern": "NONE",
    "level": "하",
    "difficultyBucket": 2,
    "sourceQid": 12,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 13,
    "questionNumber": 13,
    "questionType": "객관식",
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 하자. $S_n = n^2 + 2n$일 때, $\\sum_{k=1}^{15} \\frac{1}{a_k a_{k+1}}$의 값은? [4.5점]",
    "choices": [
      "$\\frac{8}{17}$",
      "$\\frac{10}{17}$",
      "$\\frac{2}{33}$",
      "$\\frac{5}{33}$",
      "$\\frac{7}{34}$"
    ],
    "answer": "④",
    "solution": "조건·목표: $S_n=n^2+2n$인 수열에서 $\\sum_{k=1}^{15}1/(a_ka_{k+1})$을 구한다.\n전략: 먼저 부분합의 차로 일반항을 얻은 다음, 인접한 두 항의 곱을 두 분수의 차로 바꾸면 가운데 항들이 소거된다.\n① $S_1=3$이고, $k\\ge2$에서 $a_k=S_k-S_{k-1}=(k^2+2k)-((k-1)^2+2(k-1))=2k+1$. 이 식은 $k=1$에서도 $3$이므로 모든 자연수에 적용된다.\n② $a_k=2k+1$, $a_{k+1}=2k+3$이므로 $1/(a_ka_{k+1})=1/((2k+1)(2k+3))$.\n③ $1/(2k+1)-1/(2k+3)=2/((2k+1)(2k+3))$이므로 한 항은 이 차의 $1/2$이다.\n④ 따라서 전체 합은 $\\frac12[(\\frac13-\\frac15)+(\\frac15-\\frac17)+\\cdots+(\\frac1{31}-\\frac1{33})]=\\frac12(\\frac13-\\frac1{33})=\\frac12\\cdot\\frac{10}{33}=\\frac5{33}$.\n보기 판단: ④이다. 마지막 분모는 $k=15$의 $2k+3=33$이고, 첫 분모는 3임을 확인한다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "부분분수 망원합",
    "decisiveStep": "a_k=2k+1, 분수 차로 소거",
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
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 13,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 14,
    "questionNumber": 14,
    "questionType": "객관식",
    "content": "공차가 3인 등차수열 $\\{a_n\\}$이 모든 자연수 $n$에 대하여<br><br>${a_{n+1}}^2 = {a_n}^2 + 6(3n-1)$<br><br>을 만족시킨다. 등차수열 $\\{a_n\\}$의 첫째항부터 제 10항까지의 합은? [4.4점]",
    "choices": [
      "140",
      "130",
      "120",
      "110",
      "100"
    ],
    "answer": "①",
    "solution": "조건·목표: 공차 3인 등차수열이 $a_{n+1}^2=a_n^2+6(3n-1)$을 만족할 때 첫 10항의 합을 구한다.\n전략: $a_{n+1}=a_n+3$을 대입하고 제곱의 차를 인수분해한다.\n풀이: $(a_n+3)^2-a_n^2=6a_n+9=6(3n-1)$이므로 $a_n=3n-5/2$. 따라서 $a_1=1/2$, $a_{10}=55/2$. $S_{10}=10(a_1+a_{10})/2=5(56/2)=140$.\n보기 판단: ① 140만 일치한다. 정답 ①.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-ARITHMETIC_SEQUENCE",
    "primaryMethod": "등차 일반항과 제곱차",
    "decisiveStep": "6a_n+9=6(3n-1)",
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
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 14,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 15,
    "questionNumber": 15,
    "questionType": "객관식",
    "content": "아래의 그림과 같이 두 직선 $y=2x$와 $y=\\frac{1}{2}x$가 이루는 예각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은? [4.6점]<br><br><img src=\"assets/images/22_제일고_1학기_기말_고2_수학I/q15.png\" class=\"question-img\">",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$\\frac{2}{\\sqrt{5}}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "⑤",
    "solution": "조건·목표: 그림에서 두 직선 $y=2x$, $y=x/2$ 사이의 예각 $\\theta$에 대한 $\\cos\\theta$를 구한다.\n전략: 기울기의 각도 공식 대신, 두 직선 위에 각각 격자점 $P(1,2)$, $Q(2,1)$을 잡아 삼각형 $OPQ$의 변을 구하고 코사인법칙을 쓴다.\n① 원점 $O(0,0)$과 두 점은 그림의 양의 방향 두 반직선 위에 있다. 따라서 $\\angle POQ=\\theta$이고 예각이다.\n② $OP=\\sqrt{1^2+2^2}=\\sqrt5$, $OQ=\\sqrt{2^2+1^2}=\\sqrt5$, $PQ=\\sqrt{(2-1)^2+(1-2)^2}=\\sqrt2$.\n③ 코사인법칙 $PQ^2=OP^2+OQ^2-2(OP)(OQ)\\cos\\theta$에 대입하면 $2=5+5-10\\cos\\theta$.\n④ 따라서 $10\\cos\\theta=8$, $\\cos\\theta=4/5$. 이 값은 양수이고 1보다 작아 그림의 예각 조건과도 맞는다.\n보기 판단: ⑤ $4/5$이다. 두 직선의 기울기 2와 $1/2$를 코사인 값으로 착각하면 안 된다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "코사인법칙",
    "decisiveStep": "두 직선의 점으로 삼각형 구성",
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
    "sourceQid": 15,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 16,
    "questionNumber": 16,
    "questionType": "객관식",
    "content": "어떤 건강음료 전문점의 10일 동안의 건강음료 판매량을 조사하였다. 첫째 날은 모두 $5^4\\text{리터}$가 판매되었고, 둘째 날부터는 매일 오전에는 전날 판매량의 $20\\%$의 양이, 오후에는 전날 판매량의 $35\\%$의 양이, 야간에는 전날 판매량의 $25\\%$의 양이 판매되었다. $n$째 날에 판매되는 건강음료의 판매량을 $a_n$이라 할 때, $a_n$과 $a_{n+1}$ 사이의 관계식은 $a_{n+1} = k a_n$ ($n \\le 9$)이다. 다섯째 날까지의 모든 판매량은 $5^5 - m^5$일 때, 두 상수 $k, m$에 대하여 $\\frac{20k}{m}$의 값은? [4.7점]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "②",
    "solution": "조건·목표: 전날 판매량의 20%, 35%, 25%를 각각 판매할 때 $k$, 다섯째 날까지의 합에서 $m$을 구한다.\n전략: 하루 판매량은 전날의 세 비율의 합이므로 등비수열이 된다.\n풀이: $k=0.20+0.35+0.25=0.80=4/5$. $a_1=5^4$이므로 $S_5=5^4\\{1-(4/5)^5\\}/(1-4/5)=5^5-4^5$. 따라서 $m=4$이고 $20k/m=20(4/5)/4=4$.\n보기 판단: ② 4만 일치한다. 정답 ②.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-09",
    "subUnitKey": "H15-M1-09-GEOMETRIC_SEQUENCE",
    "primaryMethod": "등비수열 합",
    "decisiveStep": "k=4/5, S5=5^5-4^5",
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
    "sourceQid": 16,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 17,
    "questionNumber": 17,
    "questionType": "객관식",
    "content": "$n \\ge 2$인 모든 자연수 $n$에 대하여<br>$1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + \\frac{1}{n^2} < 2 - \\frac{1}{n}$이 성립함을 보이는 과정이다.<br><br>***************************************************<br>$1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + \\frac{1}{n^2} < 2 - \\frac{1}{n} \\cdots\\cdots\\text{①}$<br><br>(ⅰ) $n=2$일 때,<br>$(\\text{좌변}) = 1 + \\frac{1}{2^2} = \\frac{5}{4}$<br>$(\\text{우변}) = 2 - \\frac{1}{2} = \\frac{3}{2}$<br>따라서 $n=2$일 때 ①이 성립한다.<br><br>(ⅱ) $n=k (k \\ge 2)$일 때 ①이 성립한다고 가정하면<br>$1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + \\frac{1}{k^2} < 2 - \\frac{1}{k}$<br>$n=k+1$일 때,<br>$1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + (\\text{가})$<br>$= (1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + \\frac{1}{k^2}) + (\\text{가})$<br>$< 2 - \\frac{1}{k} + (\\text{가})$<br>이 때 $k \\ge 2$이므로<br>$\\{2 - \\frac{1}{k} + (\\text{가})\\} - (\\text{나}) = (\\text{다}) < 0$<br>에서 $2 - \\frac{1}{k} + (\\text{가}) < (\\text{나})$<br>즉, $1 + \\frac{1}{2^2} + \\frac{1}{3^2} + \\cdots + (\\text{가}) < (\\text{나})$<br>따라서 $n=k+1$일 때도 ①이 성립한다.<br>(ⅰ)과 (ⅱ)에 의하여 $n \\ge 2$인 모든 자연수 $n$에 대하여 ①이 성립한다.<br>***************************************************<br>(가), (나), (다)에 맞는 식을 각각 $f(k), g(k), h(k)$라 할 때, $f(1)+g(1)+h(1)$의 값은? [4.8점]",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "1",
      "$\\frac{3}{2}$",
      "2"
    ],
    "answer": "④",
    "solution": "조건·목표: 수학적 귀납법으로 $1+1/2^2+\\cdots+1/n^2<2-1/n$ ($n\\ge2$)을 증명할 때 빈칸 $(가)=f(k)$, $(나)=g(k)$, $(다)=h(k)$를 정하고 $f(1)+g(1)+h(1)$을 구한다.\n전략: $k$에서 $k+1$로 갈 때 더해지는 항, 새 목표의 우변, 두 우변의 차를 차례로 적는다.\n① 시작 $n=2$: $1+1/4=5/4<3/2=2-1/2$이므로 성립한다.\n② $n=k$에서 성립한다고 가정하면 $\\sum_{j=1}^{k}1/j^2<2-1/k$. $n=k+1$의 좌변은 기존 합에 $1/(k+1)^2$을 더한 것이므로 $(가)=f(k)=1/(k+1)^2$.\n③ 새 목표의 우변은 $(나)=g(k)=2-1/(k+1)$이다.\n④ 귀납가정으로 얻은 상한과 목표의 차는\n$h(k)=[2-1/k+1/(k+1)^2]-[2-1/(k+1)]$\n$=-1/k+1/(k+1)+1/(k+1)^2=-1/[k(k+1)^2]<0$ ($k\\ge2$).\n따라서 실제 합은 더 작은 상한 $g(k)$보다도 작다. 시작과 귀납단계가 모두 성립한다.\n⑤ 함수식을 $k=1$에 대입하면 $f(1)=1/4$, $g(1)=3/2$, $h(1)=-1/4$. 합은 $3/2$이다. $k=1$은 귀납단계의 가정 범위는 아니지만 함수값 계산에는 사용할 수 있다.\n보기 판단: ④ $3/2$이다.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수학적 귀납법",
    "standardUnitKey": "H15-M1-11",
    "subUnitKey": "H15-M1-11-MATHEMATICAL_INDUCTION",
    "primaryMethod": "귀납법 부등식",
    "decisiveStep": "차 h(k)=-1/[k(k+1)^2]<0",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "수학적 귀납법",
      "l3": "수학적 귀납법",
      "l4": "부등식·나눗셈 증명",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-066",
      "crosswalk2022RecordId": "H2-M1-RPM-132",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-11",
        "subUnitKey": "H15-M1-11-MATHEMATICAL_INDUCTION"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-08",
        "subUnitKey": "H22-A-08-CORE"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 17,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 18,
    "questionNumber": 18,
    "questionType": "객관식",
    "content": "자연수 $n$에 대하여 함수 $f(n)$을<br><br>$f(n) = \\begin{cases} n^2 & (n\\text{이 홀수인 경우}) \\\\ -n^2 & (n\\text{이 짝수인 경우}) \\end{cases}$<br><br>라 하고 $a_n = f(n) + f(n+1)$이라 하자. 수열 $\\{a_n\\}$에 대하여 $\\sum_{k=1}^{100} a_k$의 값은? [5.3점]",
    "choices": [
      "100",
      "110",
      "125",
      "140",
      "165"
    ],
    "answer": "①",
    "solution": "조건·목표: 홀수 $n$에서 $f(n)=n^2$, 짝수에서 $f(n)=-n^2$이고 $a_n=f(n)+f(n+1)$일 때 $\\sum_{k=1}^{100}a_k$를 구한다.\n전략: $f$를 그대로 전개하는 대신 연속한 두 $a$를 묶어 망원형 차이를 만든다.\n풀이: $a_{2j-1}=(2j-1)^2-(2j)^2=-4j+1$, $a_{2j}=-(2j)^2+(2j+1)^2=4j+1$. 따라서 $a_{2j-1}+a_{2j}=2$이고 $j=1,\\ldots,50$의 50쌍을 더하면 $100$이다.\n보기 판단: ① 100만 일치한다. 정답 ①.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수열의 합",
    "standardUnitKey": "H15-M1-10",
    "subUnitKey": "H15-M1-10-SEQUENCE_SUM",
    "primaryMethod": "홀짝 짝짓기",
    "decisiveStep": "a(2j-1)+a(2j)=2",
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
    "conditionKeys": [
      "COND_PARITY_POSITION"
    ],
    "integrationPattern": "NONE",
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 18,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 19,
    "questionNumber": 19,
    "questionType": "서술형",
    "content": "<서술형 1> 등차수열 $\\{a_n\\}$에 대하여 $b_1=-3$이고 공비가 1이 아닌 등비수열 $\\{b_n\\}$이 $a_1=b_2, a_2=b_1, a_3=b_3$을 만족시킨다. $a_{12}$를 구하시오. [6.0점]",
    "choices": [],
    "answer": "-93",
    "solution": "조건·목표: $b_1=-3$, 공비 $r\\ne1$인 등비수열과 등차수열의 대응 $a_1=b_2$, $a_2=b_1$, $a_3=b_3$에서 $a_{12}$를 구한다.\n전략: 등차수열의 중항 조건 $a_1+a_3=2a_2$를 등비수열로 옮긴다.\n풀이: $b_2=-3r$, $b_3=-3r^2$이므로 $-3r-3r^2=2(-3)$. 즉 $r^2+r-2=(r-1)(r+2)=0$. $r\\ne1$이므로 $r=-2$. 따라서 $a_1=b_2=6$, $a_2=b_1=-3$이므로 공차는 $-9$이다. $a_{12}=6+11(-9)=-93$.\n결론: $\\boxed{-93}$.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "등차수열과 등비수열",
    "standardUnitKey": "H15-M1-08",
    "subUnitKey": "H15-M1-08-SEQUENCE_TERM",
    "primaryMethod": "등차중항과 등비공비",
    "decisiveStep": "r²+r-2=0, r=-2",
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
    "level": "상",
    "difficultyBucket": 4,
    "sourceQid": 19,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 20,
    "questionNumber": 20,
    "questionType": "서술형",
    "content": "<서술형 2> $a_1=1$인 수열 $\\{a_n\\}$의 첫째항부터 제 $n$항까지의 합을 $S_n$이라 할 때, 모든 자연수 $n$에 대하여<br><br>$\\frac{S_{n+1}}{S_n} = \\frac{1}{5}$<br><br>을 만족시킨다. $\\frac{a_9}{S_{10}}$의 값을 구하시오. [7.0점]",
    "choices": [],
    "answer": "-20",
    "solution": "조건·목표: $a_1=1$이고 모든 자연수 $n$에 대해 $S_{n+1}/S_n=1/5$일 때 $a_9/S_{10}$을 구한다.\n전략: $S_1=a_1=1$이고 부분합 자체가 공비 $1/5$인 등비수열이다. 항은 인접 부분합의 차다.\n풀이: $S_n=(1/5)^{n-1}$. $a_9=S_9-S_8=1/5^8-1/5^7=-4/5^8$. $S_{10}=1/5^9$이므로 $a_9/S_{10}=(-4/5^8)/(1/5^9)=-20$.\n결론: $\\boxed{-20}$.",
    "standardCourse": "수학I",
    "standardUnit": "수열",
    "subUnit": "수학적 귀납법",
    "standardUnitKey": "H15-M1-11",
    "subUnitKey": "H15-M1-11-MATHEMATICAL_INDUCTION",
    "primaryMethod": "부분합의 등비 점화",
    "decisiveStep": "a9=S9-S8",
    "rpmPrimary": {
      "majorUnit": "수열",
      "midUnit": "수학적 귀납법",
      "l3": "수열의 귀납적 정의",
      "l4": "점화식으로 항 구하기",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-063",
      "crosswalk2022RecordId": "H2-M1-RPM-129",
      "canonicalSourcePath": "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
      "canonicalSourceGitBlobSha": "9d7f5ff25c317d6a985a8674eeea676c69336691",
      "crosswalkSourcePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json",
      "crosswalkSourceGitBlobSha": "3d6bfbbd2db63ab6001f937ae04755bb47adde29"
    },
    "curriculumCrosswalk": {
      "H15": {
        "course": "수학I",
        "standardUnitKey": "H15-M1-11",
        "subUnitKey": "H15-M1-11-MATHEMATICAL_INDUCTION"
      },
      "H22": {
        "course": "대수",
        "standardUnitKey": "H22-A-08",
        "subUnitKey": "H22-A-08-CORE"
      }
    },
    "problemTypeKey": null,
    "templateKey": null,
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "level": "중",
    "difficultyBucket": 3,
    "sourceQid": 20,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  },
  {
    "id": 21,
    "questionNumber": 21,
    "questionType": "서술형",
    "content": "<서술형 3> 그림과 같이 $\\angle\\mathrm{DAB} = \\angle\\mathrm{BCD} = \\frac{\\pi}{2}$이고 $\\overline{\\mathrm{AD}}=1$인 사각형 $\\mathrm{ABCD}$가 있다. 점 $\\mathrm{A}$에서 선분 $\\mathrm{BC}$에 내린 수선의 발을 $\\mathrm{E}$, 선분 $\\mathrm{BD}$와 선분 $\\mathrm{AE}$의 교점을 $\\mathrm{F}$라 할 때, $\\angle\\mathrm{ABE} = \\frac{\\pi}{4}, \\angle\\mathrm{BDA} = \\frac{\\pi}{3}$이다. 삼각형 $\\mathrm{ABF}$와 삼각형 $\\mathrm{AFD}$의 외접원의 반지름의 길이를 각각 구하시오. [7.0점]<br><br><img src=\"assets/images/22_제일고_1학기_기말_고2_수학I/q21.png\" class=\"question-img\">",
    "choices": [],
    "answer": "\\frac{3\\sqrt{2}-\\sqrt{6}}{2},\\ \\frac{\\sqrt{6}-\\sqrt{2}}{2}",
    "solution": "조건·목표: 그림의 $\\angle DAB=\\angle BCD=90^\\circ$, $AD=1$, $\\angle ABE=45^\\circ$, $\\angle BDA=60^\\circ$와 $F=BD\\cap AE$를 이용하여 두 삼각형 $ABF$, $AFD$의 외접원 반지름을 구한다.\n전략: 공통 도형인 직각삼각형 $ABD$의 변을 먼저 구하고, 수선 $AE\\perp BE$에서 $F$를 지나는 각을 찾아 각 삼각형에 사인법칙 $a/\\sin A=2R$을 적용한다.\n① $\\triangle ABD$는 $A=90^\\circ$, $D=60^\\circ$, $B=30^\\circ$이다. $AD=1$이 $30^\\circ$의 대변이므로 $BD=2$, $AB=\\sqrt3$이다.\n② $AE\\perp BE$이고 $\\angle ABE=45^\\circ$이므로 직각삼각형 $ABE$에서 $\\angle BAE=45^\\circ$. $F$는 $AE$ 위에 있어 $\\angle BAF=45^\\circ$. 또한 $AB\\perp AD$이므로 $\\angle FAD=90^\\circ-45^\\circ=45^\\circ$.\n③ 그림에서 $F$는 $BD$ 위에 있다. 따라서 $\\angle ABF=\\angle ABD=30^\\circ$, $\\angle ADF=\\angle ADB=60^\\circ$. 삼각형의 내각 합으로 $\\angle AFB=180^\\circ-45^\\circ-30^\\circ=105^\\circ$, $\\angle AFD=180^\\circ-45^\\circ-60^\\circ=75^\\circ$.\n④ 정확한 값 $\\sin75^\\circ=(\\sqrt6+\\sqrt2)/4$를 기하적으로 확인할 수 있다. 서로 수직인 길이 1의 두 변으로 만든 직각이등변삼각형을 밑변이 수평선과 $30^\\circ$가 되게 놓으면 대각선이 $75^\\circ$를 이룬다. 대각선 길이는 $\\sqrt2$, 그 수직 높이는 $\\sin30^\\circ+\\cos30^\\circ=(1+\\sqrt3)/2$이므로 그 비가 $(\\sqrt6+\\sqrt2)/4$이다. $\\sin105^\\circ=\\sin75^\\circ$이다.\n⑤ $\\triangle ABF$에서 변 $AB$는 각 $AFB$의 대변이다. $2R_{ABF}=AB/\\sin105^\\circ=\\sqrt3/[(\\sqrt6+\\sqrt2)/4]$. 따라서 $R_{ABF}=2\\sqrt3/(\\sqrt6+\\sqrt2)=(3\\sqrt2-\\sqrt6)/2$.\n⑥ $\\triangle AFD$에서 변 $AD$는 각 $AFD$의 대변이다. $2R_{AFD}=AD/\\sin75^\\circ=1/[(\\sqrt6+\\sqrt2)/4]$. 따라서 $R_{AFD}=2/(\\sqrt6+\\sqrt2)=(\\sqrt6-\\sqrt2)/2$.\n결론: $\\boxed{R_{ABF}=(3\\sqrt2-\\sqrt6)/2,\\quad R_{AFD}=(\\sqrt6-\\sqrt2)/2}$. 두 반지름 모두 양수이며 그림의 각과 대응 변을 혼동하지 않았다.",
    "standardCourse": "수학I",
    "standardUnit": "삼각함수",
    "subUnit": "삼각함수의 활용",
    "standardUnitKey": null,
    "subUnitKey": null,
    "primaryMethod": "사인법칙과 각 추적",
    "decisiveStep": "AB=√3, ∠AFB=105°, ∠AFD=75°",
    "rpmPrimary": {
      "majorUnit": "삼각함수",
      "midUnit": "삼각함수의 활용",
      "l3": "사인법칙",
      "l4": "외접원 반지름",
      "semanticSourceScope": "RPM_H15_M1",
      "crosswalkRecordId": "H2-M1-RPM-043",
      "crosswalk2022RecordId": "H2-M1-RPM-109",
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
    "difficultyBucket": 5,
    "sourceQid": 21,
    "provenance": {
      "examUid": "22_제일고_1학기_기말_고2_수학I",
      "campaign": "HIGH_DYNAMIC_INTAKE_20261017",
      "sourceSha256": "623065d5426c53bca8f4c98bb0730dc499b4a3fa6db7b178131e9981e23b8d76",
      "originalSourceOnly": true
    },
    "metaStatus": "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
    "metaNullReason": "2015 수학I RPM crosswalk RPM_ONLY; GLOBAL ACTIVE 11 packs total 756 binding rows, exact standardCourse 수학I count=0; no invented key.",
    "metaLookupStatus": "SEMANTIC_LOOKUP_DONE_ACTIVE_BINDING_GAP"
  }
];
