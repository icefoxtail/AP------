# 22 금당고 고2 수학II Q07 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 7, questionNumber 7. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images는 빈 배열이다.

시각화 계획: 적분으로 얻는 함수는 f(x)=x²−3x+C. 근의 곱 조건 C−2=−4에서 C=−2이다. y=2의 교점은 x=−1,4로 정확하고, 꼭짓점 (3/2,−17/4)와 T=(2,−4)를 함께 표시한다. 근삿값은 사용하지 않는다. f의 수학적 정의역은 R이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
7. 함수 $f(x)=\int \left\{ \frac{d}{dx}(x^2-3x+1) \right\} dx$에 대하여 방정식 $f(x)=2$의 모든 근의 곱이 -4일 때, $f(2)$의 값은? [4.2점]
```

원문 정답 (선택지 인덱스): 1 (①)

원문 해설 (정확 인용):

```text
부정적분의 적분상수는 조건으로 정합니다.
$\displaystyle f(x)=\int(2x-3)\,dx=x^2-3x+C$입니다.
$f(x)=2$는 $x^2-3x+(C-2)=0$입니다. 이차방정식의 두 근의 곱은 $C-2$이므로 $C-2=-4$, $C=-2$입니다.
따라서 $f(2)=4-6-2=-4$입니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `bf258f6cce236cecb1ab555a6e402cb3e52b9ec3eb1fd096907431e143e4d973`
- plan.json: `f8773f4bc9fbf64d73785dca0767b0ebaf579b760cd16498b0236c176bb25a60`
- publish.json: `95360efb95f1182317ddfc2c7830b8d9c255d204c9b33a99451e3b74cff27a39`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
