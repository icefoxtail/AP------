# 19 순천여고 고2 수학II Q18 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; source `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`); 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; `item.json`은 `sourcePath`와 `ordinal: 18`로 결속한다. 소유자는 UNKNOWN. 사용자가 전한 작성 이유는 함수의 시각적 표현이 이해에 도움이 된다는 것이다. 원본 문항·자산·기존 이력은 보존했다.

## 원문 문항 (정확 문자열)

~~~text
실수 전체 집합에서 연속인 함수 $f(x)$가 다음 조건을 만족시킨다.
(가) $\displaystyle\int_0^4\dfrac{1}{6}f(t),dt=a$
(나) $f(x)=|x-2|+\dfrac{1}{6}\displaystyle\int_0^4 xf(t),dt$
(다) $g(k)$는 두 곡선 $y=xf(x)-k$, $y=ax^2$의 교점의 개수이다. (단, $k$는 실수)
함수 $g(x)(x^2+bx+c)$가 실수 전체 집합에서 연속일 때, $a+b+c$의 값을 구하면? (단, $a,b,c$는 상수이다.) [5점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-6$ / $-5$ / $-4$ / $-3$ / $-2$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
$I=\displaystyle\int_0^4f(t)\,dt$라 두면 첫 조건에서 $I=6a$이다.
두 번째 조건은
$f(x)=|x-2|+ax$
가 된다.
이를 적분하면
$6a=\int_0^4|x-2|\,dx+a\int_0^4x\,dx$
$6a=4+8a$
$a=-2$
따라서 $f(x)=|x-2|-2x$이다.
교점 조건을 정리하면
$k=xf(x)+2x^2$
$x<2$에서 $k=2x-x^2$이고, $x\ge2$에서 $k=x^2-2x$이다.
두 식을 각 구간에서 풀어 교점 수를 세면
$k<0$일 때 $g(k)=1$
$k=0$일 때 $g(k)=2$
$0<k<1$일 때 $g(k)=3$
$k=1$일 때 $g(k)=2$
$k>1$일 때 $g(k)=1$
이다.
$k=0$에서 $g$의 좌우 극한은 $1,3$이므로 곱이 연속이려면 $p(0)=0$이어야 한다. $k=1$에서도 좌우 극한은 $3,1$이므로 $p(1)=0$이어야 한다. 여기서 $p(k)=k^2+bk+c$이다.
$c=0$, $1+b+c=0$이므로 $b=-1$이다.
$a+b+c=-2-1+0=-3$
따라서 구하는 값은 $-3$이다.
~~~

## 도식 초안

그래프는 원래 `f(x)=|x−2|−2x`가 아니라, 교점 방정식을 `H(x)=xf(x)+2x²=k`로 정리해 얻는 보조 함수 `H(x)=x|x−2|`만 표시한다. 원문의 분기 `x<2`와 `x≥2`를 정확히 유지하며 오른쪽 가지가 x=2를 포함한다. 두 곡선 조각은 (2,0)에서 이어지고 그 교점은 중복 계산하지 않는다. 수평선 y=0, y=1의 실제 교점을 표시해 g(k)의 변화 경계를 설명한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 pending; render, full math review, visual review, CI, publication, handoff는 NOT_RUN. 준비된 네 파일은 item.json, plan.json, publish.json, STATUS.md뿐이다. source/assets/기존 history/ledger/queue, 보호된 문항 및 다른 draft는 수정하지 않았다. 원격 쓰기와 렌더는 수행하지 않았다.


## 실제 입력 검사 기록 2026-11-08T23-36-32-215Z

이 문항의 현재 3 JSON과 고정 검사본의 SHA256이 일치하며, 검사 전후 바이트가 유지됐다. 아래 실제 실행한 입력 경로만 PASS이다.

- frozen_snapshot_binding: PASS
- item_source_binding: PASS
- source_exact_binding: PASS
- publish_fields: PASS
- fit_overview: PASS
- specFor: PASS
- source_domain_preserved_during_fit: PASS
- semantic_model.validate: PASS
- exact_coordinate_per_coordinate_label: NOT_APPLICABLE_NO_COORDINATE_LABEL
- axis_title_plain_max10: PASS
- engine_critical_construction: PASS
- viewport.for_spec: PASS
- engine_axis_tick_guard: PASS
- fit_spec_tick_static_match: PASS

전체 독립 수학 검토와 원본 이미지 독립 재검수, engine.prepare/build/render, SVG/PNG 시각 확인, 배치·가독성 최종 검수, CI, 게시, 구현 인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY를 유지한다. 입력 PASS는 그림 완성이나 게시 완료가 아니다. 전체 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-input-only/reports/.
