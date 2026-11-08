# 22_효천고_2학기_기말_고2_수학II Q14

0≤x≤15/2 적분 구간에만 홀수·짝수 n 식을 여덟 개 이차 조각으로 정확히 표시한다. 정수 경계는 모두 0이며, 7.5는 적분 상한이지 함수의 전체 끝점이 아니다. 다른 구간 모양은 만들지 않는다.

- 상태: 작업용 로컬 초안. 원본 출처, 문항 메타데이터, 정답·해설, 기존 그림과 이력은 변경하지 않았다.
- 출처: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js`, ordinal `14`. 원문은 로컬 `preparation-22-hyocheon-math2/source-exact.js`에서 그대로 인용했다.
- 계획의 핵심 원문 인용: `각 정수 구간을 $u=x-(n-1)$로 옮기면 $0\le u<1$이다.`
- 사용자 요청 사유: 풀이 이해에 도움이 되는 함수 그래프를 준비한다.
- 검수 상태: 원문·정답·해설을 source-exact.js와 대조했다. 순수 로컬 JSON·정확 산술 점검 PASS (2026-11-09). 캡처된 graph_framing.fit_overview의 순수 프레임 계산 PASS (마지막 축 눈금 정리 전; Q04/Q14의 곡선·영역은 그대로). 전체 엔진 입력검증, render/engine.prepare/build, independent math review, visual review, student-facing approval, remote preservation/publication 및 ownership sign-off는 NOT_RUN.

## 원문 문항 (source-exact.js 그대로)

```text
14. 실수 전체의 집합에서 연속인 함수 $f(x)$와 자연수 $n$에 대하여 $n-1 \le x < n$일 때,
$f(x) = \begin{cases} 3(x-n+1)(x-n) & (n=1, 3, 5, 7\text{일 때}) \\ -3(x-n+1)(x-n) & (n=2, 4, 6, 8\text{일 때}) \end{cases}$
라고 정의하자. $\int_0^{\frac{15}{2}} f(x)dx$의 값은? [4.3점]
```

## 정답 (source-exact.js 그대로)

```text
②
```

## 해설 (source-exact.js 그대로)

```text
각 정수 구간을 $u=x-(n-1)$로 옮기면 $0\le u<1$이다.
홀수 $n$에서 $f=3u(u-1)$이고 한 구간의 적분은 $\int_0^1 3(u^2-u)du=3(1/3-1/2)=-1/2$이다.
짝수 $n$에서는 부호가 반대이므로 한 구간 적분이 $+1/2$이다.
$0$부터 $7$까지의 일곱 구간은 $-,+,-,+,-,+,-$ 순서라 합이 $-1/2$이다.
남은 $7$부터 $15/2=7.5$까지는 $n=8$인 짝수 구간의 절반이다. $\int_0^{1/2}3u(1-u)du=3[u^2/2-u^3/3]_0^{1/2}=3(1/8-1/24)=1/4$이다.
따라서 전체는 $-1/2+1/4=-1/4$이다. 정답은 ②이다.

[다른 보기 확인]
① 마지막 절반 구간 적분을 절반보다 작게 계산한 값이다.
③ 마지막 구간을 완전 구간으로 잘못 취급한 값이다.
④ 7개 완전 구간만 계산하면 -1/2이다.
⑤ 짝수 구간의 양수 기여를 누락하면 안 된다.
```

## 후보·검사 이력

- 캡처된 `graph_framing.py`에서 실제 구현 상한은 12개 조각이다. 8개의 원문 식 조각으로 구성한 후보는 순수 `fit_overview` 계산을 통과했고 `axisRatio=1`을 반환했다. 외부 구간으로 곡선을 잇지 않았다.
- 마지막 입력은 실제 원점 O=(0,0)을 required point와 coordinateLeader로 표시하고, 엔진 가드가 거부하는 축의 0 눈금은 제거했다.
- 기존 production input-checker 실행 기록: 이 실패 후보에서는 `INVALID_AXIS_TICK_VALUE:x`가 x축 0 눈금에서 반환됐다. fit_overview, phase2.specFor, semantic_model.validate, coordinate-label/critical construction, viewport 및 fitted/spec tick equality는 통과했다. 최종 입력은 x/y 0 눈금을 제거했다. O=(0,0)만 실제 끝점 requiredPoint+coordinateLeader로 라벨한다. v1..v8의 분수 좌표는 정확한 꼭짓점 검수용 bare markers이며 좌표 라벨이나 leader를 임의로 추가하지 않는다. 최종 checker 재실행은 담당 checker에 남긴다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `cb484b00c92c44ff61f5467b2f7049f17275e37757d27f1e2f82bb46df3b8751`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- 이전 후보의 0 눈금은 실제 guard에서 INVALID_AXIS_TICK_VALUE:x로 실패했다. 0 눈금 제거 후 현재 파일을 재검사하여 guard PASS를 확인했다. 이전 실패는 삭제하지 않았다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
