# 22_효천고_2학기_기말_고2_수학II Q20

f(x)=(x−2)^2−1, 대칭축 2, 근 1·3, 꼭짓점 (2,−1)을 나타내고 [1,3]의 음수 영역과 [3,5]의 양수 영역을 따로 색칠한다. 절댓값 넓이 8과 부호 있는 적분 16/3을 구분한다.

- 상태: 작업용 로컬 초안. 원본 출처, 문항 메타데이터, 정답·해설, 기존 그림과 이력은 변경하지 않았다.
- 출처: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js`, ordinal `20`. 원문은 로컬 `preparation-22-hyocheon-math2/source-exact.js`에서 그대로 인용했다.
- 계획의 핵심 원문 인용: `따라서 $a=2$, $k=1$, $f(x)=(x-2)^2-1$이다.`
- 사용자 요청 사유: 풀이 이해에 도움이 되는 함수 그래프를 준비한다.
- 검수 상태: 원문·정답·해설을 source-exact.js와 대조했다. 순수 로컬 JSON·정확 산술 점검 PASS (2026-11-09). 캡처된 graph_framing.fit_overview의 순수 프레임 계산 PASS (마지막 축 눈금 정리 전; Q04/Q14의 곡선·영역은 그대로). 전체 엔진 입력검증, render/engine.prepare/build, independent math review, visual review, student-facing approval, remote preservation/publication 및 ownership sign-off는 NOT_RUN.

## 원문 문항 (source-exact.js 그대로)

```text
20. 최고차항의 계수가 1이고 서로 다른 두 근을 갖는 이차함수 $f(x)$가 상수 $a(0 < a < 5)$에 대하여 다음 조건을 만족시킨다. [5.5점]

(가) 임의의 실수 $t$에 대하여
$\int_0^t f(x)dx = \int_{2a-t}^{2a} f(x)dx$이다.
(나) $0 < k < a$인 실수 $k$에 대하여 $f(k)=0$
(다) $\int_a^5 f(x)dx = 6$, $\int_a^5 |f(x)|dx = \frac{22}{3}$

이때, $\int_k^5 |f(x)|dx$의 값은?
```

## 정답 (source-exact.js 그대로)

```text
④
```

## 해설 (source-exact.js 그대로)

```text
(가)의 두 정적분을 $t$로 미분하면 $f(t)=f(2a-t)$이므로 이차함수의 대칭축은 $x=a$이다. 최고차항 계수가 1이고 두 근이 있으므로 $f(x)=(x-a)^2-d^2$ ($d>0$)로 쓸 수 있다. (나)의 $0<k<a$인 근은 $k=a-d$이다.
$L=5-a>0$이라 두면 (다)에서 $\int_0^L(u^2-d^2)du=6$이다.
절댓값 적분과 보통 적분의 차는 $a$부터 $a+d$까지 음수인 부분의 넓이 두 배다. 따라서
$\frac{22}{3}-6=2\int_0^d(d^2-u^2)du=2(d^3-d^3/3)=\frac{4d^3}{3}$이다.
$4/3=4d^3/3$에서 $d=1$이다.
$\int_0^L(u^2-1)du=L^3/3-L=6$이므로 $L^3-3L=18$, $L=3$이다. 따라서 $a=2$, $k=1$, $f(x)=(x-2)^2-1$이다.
$\int_k^5|f(x)|dx=\int_1^3[-f(x)]dx+\int_3^5 f(x)dx$이다. $u=x-2$로 바꾸면
$\int_{-1}^1(1-u^2)du=4/3$, $\int_1^3(u^2-1)du=20/3$이므로 합은 $8$이다. 정답은 ④이다.

[다른 보기 확인]
① 왼쪽 음수 구간의 절댓값 기여를 누락한 값이다.
② 주어진 ∫_a^5 |f|=22/3을 구하는 적분과 혼동한 값이다.
③ k부터 a까지의 넓이 2/3을 빠뜨린 값이다.
⑤ 음수 부분을 두 번 더하는 계산이다.
```

## 후보·검사 이력

- 첫 후보에는 적분 상한 x=5의 점이 없어 순수 `fit_overview`가 `[3,5]` 영역에 `GRAPH_REGION_DOMAIN_INVALID:positive-part`를 반환했다. f(5)=8이므로 실제 적분 경계점 (5,8)을 required point로 추가했다. 수정 후보의 순수 `fit_overview` 계산은 통과했고 `axisRatio=1`을 반환했다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `fc697271bb171b37f250e072325b2252cd4d2ae4c76a774c949de3a17bd09b95`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
