상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 문항 폴더에만 `item.json`, `plan.json`, `publish.json`, `STATUS.md`를 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 각 문항 번호. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes; Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`); 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images 배열은 `[]`. 별도 기존 SVG/history는 이 작성에서 수정하거나 삭제하지 않았다.; 원문 questionNumber 14.

시각화/부분 기능: 해 a=4의 두 원문 삼차곡선, (1,0),(3,18), x=2의 정확한 두 곡선값, 두 곡선 사이 넓이 4/3 및 모든 곡선의 극값 좌표를 입력했다. x=2 수직 분할선 자체는 계약 입력으로 표시되지 않아 캡션·점으로만 설명한다. 임의 도메인/확대 대체는 하지 않았다.

원문 인용 (plan.sourceQuote와 동일, verbatim):

```text
14. 두 곡선 $y=x^3-ax+3$, $y=x^3-x^2$으로 둘러싸인 부분을 $\mathrm{A}$라 하자. 직선 $x=2$이 도형 $\mathrm{A}$의 넓이를 이등분 할 때, 도형 $\mathrm{A}$의 넓이를 $\mathrm{S}$라 하자. $6\mathrm{S}$의 값은? [4.8점]
```

원문 정답 필드 (verbatim):

```text
2
```

원문 해설 (verbatim):

```text
두 곡선 사이의 세로 길이를 먼저 구합니다. 첫째 곡선에서 둘째 곡선을 빼면 $(x^3-ax+3)-(x^3-x^2)=x^2-ax+3$입니다. 두 곡선이 둘러싼 부분은 이 이차식이 $0$이 되는 두 교점 사이입니다.
이차함수 $y=x^2-ax+3$의 대칭축은 $x=\frac a2$입니다. 두 교점 사이에서는 곡선의 위아래 차의 절댓값도 이 대칭축을 기준으로 좌우 대칭입니다. 따라서 넓이를 절반으로 나누는 유일한 수직선은 대칭축이며, 문제의 $x=2$가 그 선이므로 $\frac a2=2$, $a=4$입니다.
이때 곡선의 차는 $x^2-4x+3=(x-1)(x-3)$이므로 두 교점의 $x$좌표는 $1$, $3$입니다. $1<x<3$에서는 $(x-1)(x-3)<0$이므로 실제 세로 길이는 그 부호를 바꾼 $-x^2+4x-3=1-(x-2)^2$입니다.
따라서 $S=\int_1^3\{1-(x-2)^2\}\,dx$입니다. $u=x-2$로 구간의 좌우 대칭을 표시하면 $S=\int_{-1}^{1}(1-u^2)\,du=[u-\frac{u^3}{3}]_{-1}^{1}=\frac43$입니다.
그러므로 $6S=6\cdot\frac43=8$이고 정답은 ②입니다.
```

기록: 원문 questionBank 항목, sourcePath, ordinal, 정확한 문항 인용·정답·해설을 대조하고 보존했다. 기존 SVG/history는 덮어쓰지 않았다. 이 작성은 새로운 입력 초안만 대상으로 한다.

미실행: JSON/계약 검사, 함수 입력 검사, render/prepare/build, SVG/PNG 출력, browser/visual review, 독립 전체 수학검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 효천 ref 거절은 blocked 상태 그대로이며 재시도·우회하지 않았다. 원격 쓰기, engine/source/assets/ledger 또는 다른 문항 변경, 테스트는 하지 않았다.


## 상위 담당자 최초 검사 결과 및 국소 보정

최초 검사에서 `PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION`가 보고되었다. 상위 담당자는 실제 `graph_framing.py`의 화면 픽셀 간 특성 간격 검사에서 나온 결과이며 수학 데이터 오류는 아니라고 확인했다. `graphPlan.axisScale`에 `{ "x": 1, "y": "1/4" }`만 추가했다. 화면에서는 y 1단위를 x 1단위의 1/4 길이로 그린다. 이는 표시 축척만 바꾸며 곡선·좌표·넓이 또는 검사 기준을 바꾸지 않는다. 렌더·재검사는 하지 않았다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T20-03-57-102Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 해상도 오류 이력을 보존했다. 모든 수학 데이터와 검증 기준은 유지하고 axisScale{x:1,y:"1/4"}를 명시해 재검했다. y단위 길이는 x단위 길이의1/4이며 입력 단계의4px 기준도 통과했다. x=2 분할선은 별도 도형으로 그리지 않고 설명에 남겼다. 시각 검수는 별도 미실행이다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
