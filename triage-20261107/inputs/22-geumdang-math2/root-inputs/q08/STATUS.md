상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 문항 폴더에만 `item.json`, `plan.json`, `publish.json`, `STATUS.md`를 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 각 문항 번호. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes; Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`); 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images 배열은 `[]`. 별도 기존 SVG/history는 이 작성에서 수정하거나 삭제하지 않았다.; 원문 questionNumber 8.

시각화/부분 기능: f|[1,2]의 정확한 곡선, (1,1),(2,11), y=1,11 경계와 직사각형 내부 분할을 입력했다. rectangle area 10은 17/4+23/4로 정확히 분해된다. 원점 기준 밑 띠 1 및 가로 띠 10과 함께 적분값은 각각 21/4,63/4이며 합 21이다. 일반 삼차 역함수는 만들지 않았다. x=1,2 수직 경계와 원점 기준 띠는 별도 도형으로 표시되지 않아 캡션이 이를 설명한다. 그래프는 전체 역함수 설명이 아니라 원곡선 부분 도식이다.

원문 인용 (plan.sourceQuote와 동일, verbatim):

```text
8. 함수 $f(x)=x^3+3x-3$의 역함수를 $g(x)$라고 할 때,

$$\int_{1}^{2} f(x)dx + \int_{1}^{11} g(x)dx$$

의 값은? [4.2점]
```

원문 정답 필드 (verbatim):

```text
3
```

원문 해설 (verbatim):

```text
역함수의 식을 직접 구하려고 하면 삼차방정식을 풀어야 하므로 복잡해집니다. 여기서는 원함수와 역함수의 그래프가 서로 뒤집힌 관계라는 사실을 이용하여 두 정적분을 한꺼번에 계산합니다.
먼저 $f'(x)=3x^2+3>0$이므로 $f$는 증가함수이고 역함수 $g$가 존재합니다. 또한 $f(1)=1$, $f(2)=8+6-3=11$이므로 주어진 두 적분의 구간은 서로 대응합니다.
이제 일반적으로 증가함수 $y=f(x)$의 그래프를 직사각형 $a\le x\le b$, $f(a)\le y\le f(b)$ 안에 그려 봅시다. 그래프 아래쪽 넓이는 $\int_a^b\{f(x)-f(a)\}\,dx$이고, 그래프 위쪽 넓이는 가로 방향으로 세면 $\int_{f(a)}^{f(b)}\{g(y)-a\}\,dy$입니다. 두 부분을 합하면 직사각형 넓이 $(b-a)\{f(b)-f(a)\}$가 됩니다.
따라서 $\int_a^b f(x)\,dx+\int_{f(a)}^{f(b)}g(y)\,dy=bf(b)-af(a)$입니다. 이 식은 역함수의 부정적분 공식을 외우지 않고도 넓이로 이해할 수 있습니다.
$a=1$, $b=2$를 대입하면 구하는 값은 $2f(2)-1f(1)=2\cdot11-1\cdot1=21$입니다. 따라서 정답은 ③입니다.
```

기록: 원문 questionBank 항목, sourcePath, ordinal, 정확한 문항 인용·정답·해설을 대조하고 보존했다. 기존 SVG/history는 덮어쓰지 않았다. 이 작성은 새로운 입력 초안만 대상으로 한다.

미실행: JSON/계약 검사, 함수 입력 검사, render/prepare/build, SVG/PNG 출력, browser/visual review, 독립 전체 수학검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 효천 ref 거절은 blocked 상태 그대로이며 재시도·우회하지 않았다. 원격 쓰기, engine/source/assets/ledger 또는 다른 문항 변경, 테스트는 하지 않았다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
원곡선의 [1,2] 제한 도식과 작은 직사각형의 두 영역17/4·23/4를 표시한다. 넓이10과 보정 띠1·10을 구분해 적분합21을 설명한다. 역함수 곡선·별도 직사각형 경계와 보정 띠는 실제로 그렸다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
