# 22_효천고_2학기_기말_고2_수학II Q24

원문 그림의 f′만 정확히 표시하고, 근 −3·−1, 꼭짓점 (−2,6), [−3,−1]의 양의 적분 8, [−1,0]의 음의 적분 −8을 보여준다. 원문에 별도로 정의된 f·g의 그래프는 추가하지 않는다.

- 상태: 작업용 로컬 초안. 원본 출처, 문항 메타데이터, 정답·해설, 기존 그림과 이력은 변경하지 않았다.
- 출처: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js`, ordinal `24`. 원문은 로컬 `preparation-22-hyocheon-math2/source-exact.js`에서 그대로 인용했다.
- ROOT가 원본 이미지 q24.png를 직접 확인했으며, 이 초안은 해당 그림을 대체하거나 수정하지 않는다.
- 계획의 핵심 원문 인용: `f'(x)=-6(x+3)(x+1)`
- 사용자 요청 사유: 풀이 이해에 도움이 되는 함수 그래프를 준비한다.
- 검수 상태: 원문·정답·해설을 source-exact.js와 대조했다. 순수 로컬 JSON·정확 산술 점검 PASS (2026-11-09). 캡처된 graph_framing.fit_overview의 순수 프레임 계산 PASS (마지막 축 눈금 정리 전; Q04/Q14의 곡선·영역은 그대로). 전체 엔진 입력검증, render/engine.prepare/build, independent math review, visual review, student-facing approval, remote preservation/publication 및 ownership sign-off는 NOT_RUN.

## 원문 문항 (source-exact.js 그대로)

```text
서술형 4. 최고차항의 계수가 $k(k<0)$인 이차함수 $f'(x)$의 그래프가 다음 그림과 같다.

이때, 실수 전체의 집합에서 정의된 함수
$g(x) = \begin{cases} f(x) & (x < -3) \\ \int_0^x |f'(t)|dt & (x \ge -3) \end{cases}$
이 다음 조건을 만족시킨다.

(가) $g(-3)=-16$, $g(a)=-8$
(나) 함수 $g(x)$는 실수 전체의 집합에서 연속이다.
(다) 함수 $g(x)$는 극솟값을 갖는다.

$\int_a^2 \{f(x)+g(x)\}dx$의 값을 구하는 과정을 서술하시오. (단, $a > -3$) [6.0점]
```

## 정답 (source-exact.js 그대로)

```text
-48
```

## 해설 (source-exact.js 그대로)

```text
그림에서 $f'(x)$는 아래로 열린 이차함수이고 영점은 $x=-3$, $x=a$이며 $-3<a<0$이다. 따라서 $f'(x)=k(x+3)(x-a)$ ($k<0$)이다.
$x\ge-3$에서 $g(x)=\int_0^x|f'(t)|dt$이므로
$g(-3)=-16$은 $\int_{-3}^0|f'(t)|dt=16$이라는 뜻이고, $g(a)=-8$은 $\int_a^0|f'(t)|dt=8$이라는 뜻이다.
따라서 $\int_{-3}^a f'(t)dt=8$, $-\int_a^0 f'(t)dt=8$이다. 각각 적분하면
$-k(a+3)^3/6=8$, $-ka^2(a+9)/6=8$이다.
두 식의 우변이 모두 $8$이므로 $(a+3)^3=a^2(a+9)$이다. 전개하면 $a^3+9a^2+27a+27=a^3+9a^2$이고, 따라서 $27(a+1)=0$, 즉 $a=-1$이다. 첫 식에 대입하면 $-k\cdot8/6=8$, $k=-6$이다.
$f'(x)=-6(x+3)(x+1)$이므로 $f(x)=-2x^3-12x^2-18x+C$이다.
(나) 연속성으로 $f(-3)=g(-3)=-16$이다. 다항식의 $x=-3$ 대입값은 $C$이므로 $C=-16$이다.
$-3<x<-1$에서는 $f'>0$이므로 $g'=f'$, $-1<x$에서는 $f'<0$이므로 $g'=-f'$이다. 특히 $g(-1)=-8=f(-1)$이고 $x\ge-1$에서 $g(x)=-f(x)-16$이다.
따라서 구하는 적분은 $\int_{a}^{2}(f(x)+g(x))dx=\int_{-1}^{2}(-16)dx=-16\cdot3=-48$이다.
(다)의 극솟값은 $x=-3$에서 왼쪽 $f'<0$, 오른쪽 $|f'|\ge0$이므로 실제로 성립한다.
```

## 후보·검사 이력

- x=0은 음수 부호 있는 적분 영역의 경계이며, f′(0)=−18은 원문에 주어진 도함수식에서 정확히 나온다. (0,−18)을 required point로 포함해 해당 경계가 정확히 표시되도록 했다. 캡처된 `graph_framing.fit_overview`의 순수 계산은 통과했고 `axisRatio=1`을 반환했다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `57bd704240c0725d47003f54f684cc101c19e0d72e4a6772bd3599b8717c0a27`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
