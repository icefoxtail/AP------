# 22 금당고 고2 수학II Q01 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 1, questionNumber 1. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images는 빈 배열이다.

시각화 계획: 원함수의 수학적 정의역은 R로 보존한다. [0,1]은 평균값 정리를 검토하는 닫힌구간이며, 끝점 A=(0,−1), B=(1,0), 할선 y=x−1, c=1/2에서 실제 접점 C=(1/2,−3/4)와 접선 y=x−5/4를 표시한다. C가 실제 접점임을 명시하고 좌표는 coordinateLeader로 연결한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
1. 함수 $f(x)=x^2-1$에 대하여 닫힌구간 $[0, 1]$에서 평균값 정리를 만족시키는 실수 $c$의 값은? [4.0점]
```

원문 정답 (선택지 인덱스): 3 (③)

원문 해설 (정확 인용):

```text
평균값 정리는 연속·미분가능한 함수에서 $f'(c)=\dfrac{f(1)-f(0)}{1-0}$을 만족하는 $0<c<1$이 존재한다는 정리입니다. 다항함수이므로 적용할 수 있습니다.
$f(1)=0$, $f(0)=-1$이어서 평균변화율은 $\dfrac{0-(-1)}{1}=1$입니다.
$f'(x)=2x$이므로 $2c=1$, 즉 $c=\dfrac12$입니다. $0<\frac12<1$도 확인됩니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `f89671d774b35945b27d48978f2da67173d84eca0e1c2c25336a35e91fcb5ec2`
- plan.json: `d95c38c870266268b74b5437dd0135922a368d6f2be621489bbae405b2b1f9f9`
- publish.json: `adc700ef5ecefc2807ef448d6728447a464ee768daf1410c469010f34ef0b242`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
