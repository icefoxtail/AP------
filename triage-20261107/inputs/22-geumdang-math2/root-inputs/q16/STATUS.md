# 22 금당고 고2 수학II Q16 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 16, questionNumber 16. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes), Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문은 `assets/images/22_금당고_2학기_기말_고2_수학II/q16.png`를 참조한다. 해당 원본 PNG는 보존되며 변경하지 않았다.

시각화 계획: 원문에서 유도되는 f(x)=x(x−α)²와 구분하여, 이 도식은 α=6을 대입해 얻은 g(x)=x²(x−6)²만 그린다. g의 두 최솟점 A=(0,0), B=(6,0), 극댓점 M=(3,81), 계산점 T=(1,25)를 coordinateLeader로 표시한다. 원문 f PNG를 대체하지 않고 g를 f라고 부르지 않는다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
16. 최고차항의 계수가 1인 삼차함수 $f(x)$가 $f(0)=0$, $f(\alpha)=0$, $f'(\alpha)=0$이고 함수 $g(x)$가 다음 조건을 만족시킬 때, $g\left(\frac{\alpha}{6}\right)$의 값은? (단, $\alpha$는 양수이다.) [4.8점]

<img src="assets/images/22_금당고_2학기_기말_고2_수학II/q16.png" style="max-width:300px; display:block; margin:10px auto;" />

(가) $g'(x) = f(x) + xf'(x)$
(나) $g(x)$의 극댓값이 81이고 극솟값이 0이다.
```

원문 정답 (선택지 인덱스): 3 (③)

원문 해설 (정확 인용):

```text
최고차항의 계수가 $1$이고 $f(0)=0$, $f(\alpha)=f'(\alpha)=0$이므로 $0$은 근, $\alpha$는 중근입니다. 따라서 $f(x)=x(x-\alpha)^2$입니다.
$g'(x)=f(x)+xf'(x)=\{xf(x)\}'$이므로 $g(x)=xf(x)+C=x^2(x-\alpha)^2+C$입니다.
$g'(x)=2x(x-\alpha)(2x-\alpha)$이므로 극점은 $0,\alpha/2,\alpha$입니다. $\alpha>0$에서 $0,\alpha$는 극솟점, $\alpha/2$는 극댓점입니다.
극솟값이 $0$이므로 $C=0$입니다. 극댓값 $81$은 $g(\alpha/2)=\frac{\alpha^4}{16}=81$이므로 $\alpha^4=1296=6^4$, $\alpha=6$입니다.
따라서 $g(\alpha/6)=g(1)=1^2(1-6)^2=25$입니다.
```

검증 실행 상태: 입력 JSON/계약 검사, graph framing, semantic validation, renderer/prepare/build, 독립 전체 수학 검토, 시각 검수 및 게시 검수는 모두 **NOT_RUN**이다. 이 작성자는 요청대로 검사를 실행하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격 쓰기, 엔진/원본/assets/ledger 변경, 이전 패키지 변경을 하지 않았다.

JSON 동결 SHA256:
- item.json: `69138da0950d2da78a4a1b0d05db8689dda475ab73d3704d8bad57070179927e`
- plan.json: `39569c2b850cea5f1fe87ca28d225b365bc8f4a1e5a8e9fdb6813e560efb2057`
- publish.json: `180480525886f138feac0eb7f69e9c70072cbbcb55ccc8298af0590ae552625b`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
