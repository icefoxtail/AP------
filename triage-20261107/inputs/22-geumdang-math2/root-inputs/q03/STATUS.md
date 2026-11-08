# 22 금당고 고2 수학II Q03 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · SOLUTION-ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다. 기존 answer-exposure **HOLD를 유지**하며 도식은 풀이 전용이다. 질문면/문항 이미지로는 사용하지 않는다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 3, questionNumber 3. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images는 빈 배열이다.

시각화 계획: f(x)=x²−2x+2=(x−1)²+1을 정의역 R에서 표시한다. A=(0,2), B=(1,1)은 각각 초기조건점과 실제 최솟점이며, B가 f(1)=1을 나타낸다. 풀이에만 사용하고 질문 쪽에는 노출하지 않는다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
3. 함수 $f(x)$가 $f'(x)=2x-2$를 만족시키고 $f(0)=2$일 때, $f(1)$의 값은? [4.0점]
```

원문 정답 (선택지 인덱스): 4 (④)

원문 해설 (정확 인용):

```text
도함수를 알면 부정적분으로 원래 함수를 구하고, 주어진 함수값으로 적분상수를 정합니다.
$f'(x)=2x-2$이므로 $f(x)=x^2-2x+C$입니다.
$f(0)=C=2$에서 $f(x)=x^2-2x+2$이고,
$f(1)=1-2+2=1$입니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `a160a8ac8ee73e4a35d5ef7740079516a7bf34f126a7707cff58417b188fad99`
- plan.json: `3798714cf5d5d9721f33208c7f7374aa59e96aa325a2c36085cb5b8fa52c386b`
- publish.json: `d11505c03dbcf7bd7796034cf25f21f3f2b2a4eb6377c6168960e8c6e7a20c22`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
답 노출 보류를 해소했다고 표시하지 않는다. 이 도식은 SOLUTION-ONLY이며 질문면·발문 그림으로 게시해서는 안 된다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
