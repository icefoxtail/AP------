# 21 순천여고 고2 수학II Q19 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob 6cc6649228f234957774cdc9c1ccedf196037d86; source-exact.js 43099 bytes, SHA-256 8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b. item.json은 sourcePath와 ordinal 19만으로 결속한다. 원문 식별에 없는 sourceQid/questionNumber는 요구하거나 덧붙이지 않았다.

## 원문 문항 (정확 문자열)

```text
그림과 같이 네 점 $(0,0),(0,1),(1,0),(1,1)$을 꼭짓점으로 하는 정사각형 내부를 두 곡선 $y=kx^2$, $y=\dfrac{1}{3}x^2$로 나누는 세 부분의 넓이를 각각 $S_1,S_2,S_3$이라 하자. $S_1,S_2,S_3$이 이 순서대로 등차수열을 이룰 때, 양수 $k$의 값은? [4.5점]
```

## 원문 선택지 (정확 문자열)

```text
$\dfrac{6}{5}$ / $\dfrac{16}{45}$ / $\dfrac{121}{12}$ / $\dfrac{49}{16}$ / $\dfrac{36}{25}$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
정사각형 넓이에서 S_1+S_2+S_3=1이다. 등차수열 조건은 S_1+S_3=2S_2이므로 3S_2=1, S_2=1/3이다.

S_3=∫_0^1 (1/3)x^2 dx=1/9.
y=kx^2는 위변 y=1과 x=1/√k에서 만난다. 따라서
S_2=∫_0^{1/√k}(k-1/3)x^2dx+∫_{1/√k}^1(1-(1/3)x^2)dx
=8/9-2/(3√k).
S_2=1/3을 대입하면 √k=6/5, k=36/25이다. 정답은 ⑤이다.
```

## 원본 시각 자료 이력

source-question-evidence.json의 image는 assets/images/21_순천여고_2학기_기말_고2_수학II/q19.png이며 visualDisposition은 null이다. image 자산은 수정하지 않고 그대로 보존한다.

## 초안 설명

정사각형 [0,1]×[0,1]과 실제 영역 S1/S2/S3를 표시한다. S2는 x=5/6에서 윗 경계가 바뀌는 두 개의 맞닿은 fill 조각으로 표현하고 같은 S2로 표시한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 독립 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일 외에는 수정하지 않았다. 원격 쓰기 0회.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **TECHNICAL_HOLD_PRODUCTION_SPEC_MISMATCH / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=FAIL; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=FAIL; viewport.for_spec=NOT_RUN; engine_axis_tick_guard=NOT_RUN; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
fit_overview/specFor는 통과했지만 생성된 CURVE_f/g/top 태그를 실제 semantic_model이 거절했다. 입력에 branch 필드는 없으므로 원본 입력을 임의 바꾸거나 생성 spec/엔진/검증기를 수정하지 않았다. 원래 다중곡선 주입력은 기술 보류이며 별도 대안은 아직 이 결과에 포함하지 않는다. 하위 viewport/tick 검사는 NOT_RUN이다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.


## 별도 대안 검사 결과 연결

원래 다중곡선 입력은 변경하지 않고 보존했다. 별도 preparation-21-suncheongirls-math2/alternatives/q19-piecewise 입력은 2026-11-08T21-35-20-669Z에 한 차례 검사했으나 fit_overview에서 GRAPH_REGION_DOMAIN_INVALID:S2b로 실패했다. 별도 대안의 spec/semantic/좌표/viewport 단계는 NOT_RUN이며, 주입력과 대안 모두 기술 보류다. 원래 실패 및 입력을 지우거나 대안의 결과로 대체하지 않았다.
