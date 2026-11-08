# 22 금당고 고2 수학II Q12 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 12, questionNumber 12. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images는 빈 배열이다.

시각화 계획: 그래프 대상은 원함수 f가 아니라 도함수 d(x)=f′(x)=3(x+2)²이다. d의 수학적 정의역은 R이고, [−3,1]은 원문에서 증가 여부를 검토하는 닫힌구간이다. 구간 양 끝 P=(−3,3), Q=(1,27)와 d가 내부에서 0에 닿는 점 M=(−2,0)를 정확히 표시한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
12. 함수 $f(x)=x^3+6x^2+kx-1$이 닫힌구간 $[-3, 1]$에서 증가하도록 하는 상수 $k$의 최솟값은? [4.8점]
```

원문 정답 (선택지 인덱스): 5 (⑤)

원문 해설 (정확 인용):

```text
닫힌구간에서 증가하려면 도함수가 그 구간에서 음수가 되지 않아야 합니다.
$f'(x)=3x^2+12x+k=3(x+2)^2+k-12$입니다.
$-3\le x\le1$에는 $x=-2$가 포함되고, $3(x+2)^2$의 최솟값은 $0$입니다. 따라서 $f'(x)\ge0$이려면 $k-12\ge0$, 즉 $k\ge12$여야 합니다.
$k=12$이면 $f'(x)=3(x+2)^2\ge0$으로 실제 증가하므로 최솟값은 $12$입니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `4342cbfc517278e3cd4b54b4de42d26c9c9a8a3412a0215fb2ae5d1d80371069`
- plan.json: `471595786675a4586cde5ebbdcce1c9a2429ec2413fb58b198e1f6aa77d1467e`
- publish.json: `2c8be14b76c12300daec0db4c4cd44c3fe05d90db4302349d5201c02a5c177e1`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
