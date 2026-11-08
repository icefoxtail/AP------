# 21 순천여고 고2 수학II Q15 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob 6cc6649228f234957774cdc9c1ccedf196037d86; source-exact.js 43099 bytes, SHA-256 8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b. item.json은 sourcePath와 ordinal 15만으로 결속한다. 원문 식별에 없는 sourceQid/questionNumber는 요구하거나 덧붙이지 않았다.

## 원문 문항 (정확 문자열)

```text
이차함수 $y=f(x)$의 그래프와 직선 $y=g(x)$가 아래 그림과 같이 서로 다른 두 점에서 만날 때, $\displaystyle\int_{-2}^3 g(x)\,dx-\int_{-2}^3 f(x)\,dx$의 값은? [4.1점]
```

## 원문 선택지 (정확 문자열)

```text
$\dfrac{50}{9}$ / $\dfrac{25}{3}$ / $\dfrac{26}{3}$ / $\dfrac{17}{4}$ / $\dfrac{5}{3}$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
교점의 x좌표는 그래프에서 -1,3이고 f(0)=0, g(0)=2이다.
h(x)=f(x)-g(x)는 두 근이 -1,3인 이차식이므로
h(x)=k(x+1)(x-3).

h(0)=-2=-3k에서 k=2/3이다.
따라서 ∫_-2^3(g-f)dx=-(2/3)∫_-2^3(x+1)(x-3)dx
=-(2/3)(-25/3)=50/9.
정답은 ①이다. 원본 곡선·빗금은 표시 흔적과 겹쳐 source-image HOLD로 보존한다.
```

## 원본 시각 자료 이력

source-question-evidence.json의 image는 assets/images/21_순천여고_2학기_기말_고2_수학II/q15.png이고 visualDisposition은 null이다. 원문 해설은 “원본 곡선·빗금은 표시 흔적과 겹쳐 source-image HOLD로 보존한다.”라고 명시한다. 이 HOLD를 유지하며 보조 그림으로 원본 자산을 대체하지 않는다.

## 초안 설명

그림은 보조 차 함수 h=f−g만 나타낸다. 원문에서 식을 주지 않은 f,g 곡선은 만들지 않는다. 원본 image와 source-image HOLD 이력은 보존한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 독립 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일 외에는 수정하지 않았다. 원격 쓰기 0회.
## 2026-11-08T21-13-58-934Z frozen input run and correction

The frozen input run passed Q15 source binding, parse, and publish checks, then production fit_overview failed with GRAPH_REGION_DOMAIN_INVALID:L; specFor and formal rendering were NOT_RUN. The left fill region L begins at the requested integral endpoint x=−2, while the overview domain derived from the previously marked points did not reach that boundary.

Minimal local correction: added the genuine point E=(−2,10/3), since h(−2)=f(−2)−g(−2)=10/3 for h=f−g=(2/3)(x+1)(x−3); pinned its exact coordinates as [−2,10/3] and added its leader. This is an actual endpoint of the requested integration interval, not a dummy framing point. No curve, region boundary, integral sign, item, or publish text changed. The original image and source-image HOLD remain preserved.

Sign convention retained: ∫ from −2 to 3 h(x)dx=−50/9, whereas the requested ∫ from −2 to 3 (g−f)dx=+50/9. The point correction is unverified: post-correction input checks NOT_RUN, render NOT_RUN, visual review NOT_RUN, and independent math review NOT_RUN. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.



## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-25-47-694Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
첫 실제 실패와 변경 전 네 파일은 preparation-21-suncheongirls-math2/corrections/before/에 보존했다. 필요한 입력만 최소 정정하고 한 차례 재검사했다.
원본 필기 겹침 source-image HOLD는 해소되지 않았다. h=f−g의 적분은 −50/9이고 발문이 요구하는 g−f의 적분은 +50/9이다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
