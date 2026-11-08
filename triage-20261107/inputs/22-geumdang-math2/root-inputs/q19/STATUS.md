상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 문항 폴더에만 `item.json`, `plan.json`, `publish.json`, `STATUS.md`를 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 각 문항 번호. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes; Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`); 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images 배열은 `[]`. 별도 기존 SVG/history는 이 작성에서 수정하거나 삭제하지 않았다.; 원문 questionNumber 19.

시각화/검수 상태: 세 교점과 두 극값의 정확한 근호 좌표, 곡선·직선과 두 넓이를 입력했다. 자동 프레이밍 가독성 상태는 **HOLD**로 유지하며 시각 검수는 **NOT_REVIEWED**이다. 입력이 검사에 통과하더라도 이 상태를 바꾸지 않는다.

원문 인용 (plan.sourceQuote와 동일, verbatim):

```text
[서술형1] 삼차함수 $f(x)=x^3-x$에 대하여 곡선 $y=f(x)$와 $x$축으로 둘러싸인 두 부분의 넓이의 합을 $S$라 하자. 곡선 $y=f(x)$와 직선 $y=mx$ ($m>0$)로 둘러싸인 두 부분의 넓이의 합을 $S(m)$이라 할 때, $\frac{S(m)}{S}=25$를 만족시키는 상수 $m$값을 구하는 과정을 서술하시오. [10.0점]
```

원문 정답 필드 (verbatim):

```text
4
```

원문 해설 (verbatim):

```text
먼저 두 영역의 넓이를 각각 식으로 나타내고 비율 조건을 적용합니다.
$f(x)=x^3-x=x(x-1)(x+1)$이므로 $x$축과의 교점은 $-1,0,1$입니다. 그래프는 원점 대칭이어서 양쪽 영역의 넓이가 같고, $0<x<1$에서 $f(x)<0$입니다.
$S=2\displaystyle\int_0^1(x-x^3)dx=2[\frac{x^2}{2}-\frac{x^4}{4}]_0^1=\frac12$입니다.
$y=x^3-x$와 $y=mx$의 교점은 $x^3-(m+1)x=0$, 즉 $x=0,\pm\sqrt{m+1}$입니다. $m>0$이므로 세 교점은 서로 다릅니다.
두 영역의 넓이의 합은 $S(m)=2\displaystyle\int_0^{\sqrt{m+1}}\big((m+1)x-x^3\big)dx$입니다.
$S(m)=2[\frac{m+1}{2}x^2-\frac14x^4]_0^{\sqrt{m+1}}=\frac{(m+1)^2}{2}$입니다.
따라서 $\dfrac{S(m)}S=(m+1)^2=25$이고, $m>0$이므로 $m+1=5$, $m=4$입니다.
```

기록: 원문 questionBank 항목, sourcePath, ordinal, 정확한 문항 인용·정답·해설을 대조하고 보존했다. 기존 SVG/history는 덮어쓰지 않았다. 이 작성은 새로운 입력 초안만 대상으로 한다.

미실행: JSON/계약 검사, 함수 입력 검사, render/prepare/build, SVG/PNG 출력, browser/visual review, 독립 전체 수학검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 효천 ref 거절은 blocked 상태 그대로이며 재시도·우회하지 않았다. 원격 쓰기, engine/source/assets/ledger 또는 다른 문항 변경, 테스트는 하지 않았다.


## 상위 담당자 최초 검사 결과 및 국소 보정

최초 검사에서 `PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:L`가 보고되었다. 교점의 x좌표와 넓이 계산은 맞지만, 직선 y=4x와 만나는 점의 y좌표를 0으로 두었던 입력 오류였다. L=(−√5,−4√5), R=(√5,4√5)로 고쳤고 원점, 교점 x좌표, 곡선, 영역 경계 및 넓이 계산은 보존했다. 자동 프레이밍 가독성은 계속 **HOLD**, 시각검수는 **NOT_REVIEWED**이다. 재검사나 렌더는 하지 않았다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T20-03-57-102Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
교점 y좌표 오기와 원래 실패본을 corrections/before/q19에 보존하고 정확한 ±4√5로 고쳤다. 과거 자동 프레이밍·가독성 HOLD 및 NOT_REVIEWED는 계속 유지한다. 입력 PASS로 가독성이 해결됐다고 표시하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
