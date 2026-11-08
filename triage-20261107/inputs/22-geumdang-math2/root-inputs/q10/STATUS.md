# 22 금당고 고2 수학II Q10 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 item/plan/publish 초안과 상태 기록만 저장했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 10, questionNumber 10; 기준 main `a28bec278aada73e6c39de89174738839205b902`; 정확 원문은 `preparation-22-geumdang-math2/source-exact.js` (55589 bytes, SHA-256 `7976919115b09bf20645122426e8f81c0f34bac2ace9a91a6b272ed9adeaa620`, Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`). 원본 이미지가 있는 Q11은 원문 Q11 PNG를 그대로 보존했다.

시각화 사유: 사용자는 풀이에서 함수 관계가 이해에 도움이 되면 시각 자료로 보조하고, 함수 좌표 라벨은 정확한 실제 점을 기준으로 배치하기를 원했다. 이 초안은 지원되는 도식으로 그 사유를 반영하되, 계약에서 지원하지 않는 도메인·점·함수 모양을 추정하지 않는다.

원문 문항 (source-exact.js의 content 정확 인용):

```text
10. 일차함수 $f(x)$에 대하여

$$\int_{-2}^{2} f(x)dx = -8, \quad \int_{-2}^{2} x f(x)dx = 16$$

일 때, 정적분 $\int_{-2}^{2} x^2 f(x)dx$의 값은? [4.2점]
```

원문 정답 필드 (정확 인용): `1`

선택지 정답 (정확 인용): `$-\frac{32}{3}$`

원문 해설 (정확 인용):

```text
일차함수를 $f(x)=ax+b$로 놓고 정적분 조건에서 계수를 정합니다. $[-2,2]$에서 홀함수의 적분은 $0$임을 이용하면 계산이 짧아집니다.
$\displaystyle\int_{-2}^2 f(x)dx=\int_{-2}^2(ax+b)dx=4b=-8$이므로 $b=-2$입니다.
$\displaystyle\int_{-2}^2 xf(x)dx=\int_{-2}^2(ax^2+bx)dx=a\cdot\frac{16}{3}=16$이므로 $a=3$입니다.
구하는 적분은 $\displaystyle\int_{-2}^2 x^2(3x-2)dx=3\int_{-2}^2x^3dx-2\int_{-2}^2x^2dx=0-2\cdot\frac{16}{3}=-\frac{32}{3}$입니다.
```

시각 계획 요약: 정확한 피적분함수 g(x)=x²f(x)=3x³−2x²를 대칭구간 [−2,2]에 표시한다. 함수 이름을 원문 f와 혼동하지 않도록 한다.

검사 기록: 원문 questionBank 항목 10를 직접 읽고 ordinal/questionNumber를 대조했다. 문항, 정답 필드, 선택지 정답, 해설을 원문 그대로 보존했다. 

미실행: author tests, 입력 계약/graph framing, semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 source/engine/assets/ledger 변경은 하지 않았다. Q05/Q09/Q18과 모든 기존 로컬 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 해시

이 세 JSON 파일을 작성 직후 동결했다. 이후 변경하지 않는다.

- item.json SHA-256: `0410e64f43654c955901e3349d5c04217d57d45ce966623c57f911022ef696a4`
- plan.json SHA-256: `4aad20355accc04e9493adfede19c982ac280b1742741c8cb232c9bacddfdd64`
- publish.json SHA-256: `6c3cfc7f7ca091b309372e0f3dd1f4792cf9d82c5132ee72b679367472684bf7`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 3개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
