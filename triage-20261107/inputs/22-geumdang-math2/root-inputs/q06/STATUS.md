# 22 금당고 고2 수학II Q06 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 6, questionNumber 6. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images는 빈 배열이다.

시각화 계획: 원함수 f(x)=x³+3x²−14의 정의역은 R이다. f′(x)=3x(x+2)에서 x=−2는 극대, x=0은 극소이다. 원문 조건을 대입해 a=−14이며 좌표 M=(−2,−10), N=(0,−14)를 coordinateLeader로 표시한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
6. 함수 $f(x)=x^3+3x^2+a$이 극솟값 -14를 가질 때, 상수 $a$의 값은? [4.2점]
```

원문 정답 (선택지 인덱스): 2 (②)

원문 해설 (정확 인용):

```text
극솟값은 도함수 부호가 음수에서 양수로 바뀌는 지점의 함수값입니다.
$f'(x)=3x^2+6x=3x(x+2)$이므로 임계점은 $x=-2,0$입니다.
$x<-2$에서 $f'>0$, $-2<x<0$에서 $f'<0$, $x>0$에서 $f'>0$이므로 $x=0$에서 극솟값을 갖습니다.
$f(0)=a=-14$이므로 $a=-14$입니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `5a8143fb1a77a76c231e392b96b3b1ed555efd48cad62ec523ec69c02399dcd5`
- plan.json: `67f976ef905907c18c3e759b8142a9ea9d0c270804001a3a183fffd5462a6ee5`
- publish.json: `3328cfc35a784ab06c8d791f752b0d81e7444bf2e486cd656ef0b075ba118fac`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
