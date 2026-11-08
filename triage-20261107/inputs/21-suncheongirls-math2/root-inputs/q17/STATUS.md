# 21 순천여고 고2 수학II Q17 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 17, questionNumber 17. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `assets/images/21_순천여고_2학기_기말_고2_수학II/q17.png`.

도식 요약: f(x)=x³−3x²+1의 그래프에서 극댓점 M=(0,1), 극솟점 m=(2,−3)을 표시한다. F′(2)=∫₀²f(t)dt=−2이므로 물은 접선의 기울기는 −2이다. 정확한 좌표를 확인할 수 없는 x절편이나 넓이 영역은 별도로 표시하지 않는다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 함수 $F(x)=\displaystyle\int_0^x(x-t)f(t),dt$라 하자. 함수 $y=f(x)$의 그래프가 아래 그림과 같을 때, 함수 $y=F(x)$의 그래프 위의 점 $(2,F(2))$에서의 접선의 기울기는? [4.5점]
```

원문 선택지 (정확 문자열):

```text
["$-2$", "$-1$", "$0$", "$1$", "$2$"]
```

원문 정답 (정확 문자열):

```text
①
```

원문 해설 (정확 인용):

```text
f(x)=x^3+Ax^2+Bx+C라 두면 그래프의 극점이 x=0,2이므로
f'(x)=3x(x-2), A=-3, B=0이다.
f(0)=1에서 C=1이므로 f(x)=x^3-3x^2+1이다.

F(x)=∫_0^x(x-t)f(t)dt를 미분하면 F'(x)=∫_0^xf(t)dt이다.
F'(2)=∫_0^2(t^3-3t^2+1)dt=[t^4/4-t^3+t]_0^2=-2.
따라서 접선의 기울기는 -2, 정답은 ①이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
Q17 주의: 원문 그래프와 해설이 확정하는 함수 및 두 극점만 입력했다. 정확값이 주어지지 않은 x절편 수치나 적분 음영 영역을 지어내지 않았다. 전체 다항식은 정확하며 ALL_REALS 도메인을 보존했다.

동결 SHA-256:
- `item.json`: `c259165d72430b214531e5c3414aa3f800f276ad18d7ea56d952f4421d2111fd`
- `plan.json`: `252c4ce8c6aa891b652f171b563b709ec1c90ead77616a7a621daca8557500c3`
- `publish.json`: `019380ffa1f9a5a2b8cd10eb84ad46f2879a865cbeaefc04c5af2541a63491bb`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=PASS; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
