# 21 순천여고 고2 수학II Q13 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob 6cc6649228f234957774cdc9c1ccedf196037d86; source-exact.js 43099 bytes, SHA-256 8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b. item.json은 sourcePath와 ordinal 13만으로 결속한다. 원문 식별에 없는 sourceQid/questionNumber는 요구하거나 덧붙이지 않았다.

## 원문 문항 (정확 문자열)

```text
모든 실수 $x$에서 연속인 함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 아래 그림과 같이 $y$축에 대칭인 이차함수의 그래프와 직선의 일부로 나타내어진다. 함수 $y=f(x)$의 그래프가 $(2,3)$을 지날 때, $f(-1)f(3)$의 값은? [4.1점]
```

## 원문 선택지 (정확 문자열)

```text
$-3$ / $-2$ / $0$ / $2$ / $5$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
그래프의 이차함수 부분은 $y$축 대칭이고 꼭짓점이 $(0,-1)$이므로
$f′(x)=ax^2-1\quad(x\le1)$로 둘 수 있다.
그래프가 $(1,2)$를 지나므로 $2=a-1$, 따라서 $a=3$이다.
직선 부분은 $y=2$이므로 $f′(x)=2\quad(x\ge1)$이다.

원시함수 $x^3-x$를 이용하면
$\displaystyle\int_{-1}^{1}(3x^2-1)\,dx$
$=[x^3-x]_{-1}^{1}$
$=(1-1)-((-1)^3-(-1))=0$이다.
따라서
$\displaystyle f(2)-f(-1)=\int_{-1}^{2}f′(x)\,dx=0+\int_1^2 2\,dx=2$
이므로 $f(-1)=1$이다.

또
$\displaystyle f(3)=f(2)+\int_2^3 2\,dx=3+2=5$이다.
따라서 $f(-1)f(3)=1\cdot5=5$이고 정답은 ⑤이다.
```

## 원본 시각 자료 이력

source-question-evidence.json의 image는 assets/images/21_순천여고_2학기_기말_고2_수학II/q13.png이며 visualDisposition은 null이다. image 자산은 수정하지 않고 그대로 보존한다.

## 초안 설명

도함수의 source graph를 그대로 두 조각의 정확한 다항식으로 나타낸다. (0,−1)과 (1,2)는 도함수의 실제 최솟점과 접합점이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 독립 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일 외에는 수정하지 않았다. 원격 쓰기 0회.
## 2026-11-08T21-13-58-934Z frozen input run and correction

The frozen input run passed Q13 source binding, parse, fit_overview, specFor, source-domain preservation, semantic validation, critical construction, and viewport. The production axis tick guard failed with INVALID_AXIS_TICK_VALUE:x because x tick 0 was not accepted. Formal rendering remained NOT_RUN.

Minimal local correction: removed only x-axis tick 0. The exact derivative pieces, breakpoint, required points, sourceDomain, y ticks, and all other inputs are unchanged. This is an unverified correction: post-correction input checks NOT_RUN, render NOT_RUN, visual review NOT_RUN, and independent math review NOT_RUN. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.



## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-25-47-694Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
첫 실제 실패와 변경 전 네 파일은 preparation-21-suncheongirls-math2/corrections/before/에 보존했다. 필요한 입력만 최소 정정하고 한 차례 재검사했다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
