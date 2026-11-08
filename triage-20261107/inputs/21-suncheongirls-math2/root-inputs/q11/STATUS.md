# 21 순천여고 고2 수학II Q11 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob 6cc6649228f234957774cdc9c1ccedf196037d86; source-exact.js 43099 bytes, SHA-256 8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b. item.json은 sourcePath와 ordinal 11만으로 결속한다. 원문 식별에 없는 sourceQid/questionNumber는 요구하거나 덧붙이지 않았다.

## 원문 문항 (정확 문자열)

```text
원점을 출발하여 움직이는 두 점 $P,Q$의 시각 $t$에서의 속도는 각각 $V_1(t)=t^3-6t^2$, $V_2(t)=a$이다. $t>0$에서 두 점 $P,Q$의 속도가 같을 때가 오직 한 번이 되도록 하는 정수 $a$의 최솟값은? [3.9점]
```

## 원문 선택지 (정확 문자열)

```text
$3$ / $-12$ / $-32$ / $-64$ / $-128$
```

## 원문 정답 (정확 문자열)

```text
③
```

## 원문 해설 (정확 문자열)

```text
두 속도가 같은 조건은 t^3-6t^2=a, t>0이다.
p(t)=t^3-6t^2라 두면 p'(t)=3t(t-4).

p는 0<t<4에서 감소하고 t>4에서 증가하며, p(4)=-32, p(6)=0이다.
수평선 y=a가 양의 t에서 한 번만 만나는 가장 작은 정수 높이는 최솟값 a=-32이다.
따라서 정답은 ③이다.
```

## 원본 시각 자료 이력

source-question-evidence.json의 ordinal 11에서 image, solutionImage, visualDisposition이 모두 null이다. 보존하거나 대체할 원본 이미지 자산은 이 문항에 없다.

## 초안 설명

보조식 H(t)=t³−6t²의 정확한 삼차곡선을 선택한 유한 구간 0<t≤6에서만 표시한다. 원문의 실제 허용범위 t>0은 캡션에 유지한다. t=0은 OPEN으로 표시하고, 상단 표시 끝 t=6은 source domain의 끝이 아니다. t>6의 양의 시간 꼬리는 이 그림에서 생략했다. 해설의 H(6)=0과 H′(t)>0 for t>4로 그 꼬리가 y=−32에 다시 닿지 않음을 말로 분리한다.

## 보존한 초기 대안 이력

먼저 만든 보수적 numberline-only 대안의 정확한 item/plan/publish/STATUS 파일은 preparation-21-suncheongirls-math2/history/q11-initial-numberline/에 보존되어 있다. 당시 plan SHA-256은 9800184df6d46a5eb14c1f065a5cf7bb55ccf2479fc8982fa0e79703401d3f26; 그 대안도 DRAFT_ONLY / NOT_RUN이었고 렌더하거나 검사하지 않았다. 유한 INTERVAL 입력을 지원하는 piecewise polynomial 경로를 확인한 뒤 현재의 정확한 부분 곡선 초안으로 대체했다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 독립 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일 외에는 수정하지 않았다. 원격 쓰기 0회.
## 2026-11-08T21-13-58-934Z frozen input run and correction

The frozen input run passed Q11 source binding, parse, fit_overview, specFor, source-domain preservation, semantic validation, critical construction, and viewport. The production axis tick guard failed with INVALID_AXIS_TICK_VALUE:y because y tick 0 was not accepted. Formal rendering remained NOT_RUN.

Minimal local correction: removed only y-axis tick 0. The curve equation, required points, sourceDomain (0,6], other ticks, and all other inputs are unchanged. This is an unverified correction: post-correction input checks NOT_RUN, render NOT_RUN, visual review NOT_RUN, and independent math review NOT_RUN. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.



## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-25-47-694Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
첫 실제 실패와 변경 전 네 파일은 preparation-21-suncheongirls-math2/corrections/before/에 보존했다. 필요한 입력만 최소 정정하고 한 차례 재검사했다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
