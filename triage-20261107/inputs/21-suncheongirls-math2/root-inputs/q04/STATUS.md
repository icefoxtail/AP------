# 21 순천여고 고2 수학II Q04 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 4, questionNumber 4. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `(source image field absent)`.

도식 요약: f(x)=−3x²+5x의 그래프에서 O=(0,0), A=(5/3,0), 꼭짓점 V=(5/6,25/12)를 표시한다. 원문의 적분은 대칭구간 [−2,2]의 부호 있는 정적분으로 −16이며, 5x의 홀함수 항은 상쇄된다. 이는 무부호 넓이와 구별한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
함수 $f(x)=-3x^2+5x$에 대하여 $\displaystyle\int_1^4 f(x)\,dx+\displaystyle\int_{-2}^1 f(x)\,dx-\displaystyle\int_2^4 f(x)\,dx$의 값은? [3.6점]
```

원문 선택지 (정확 문자열):

```text
["$-10$", "$-12$", "$-14$", "$-16$", "$-18$"]
```

원문 정답 (정확 문자열):

```text
④
```

원문 해설 (정확 인용):

```text
정적분의 구간을 이어 붙인다.
∫_1^4f(x)dx+∫_-2^1f(x)dx-∫_2^4f(x)dx
=∫_-2^2f(x)dx.

f(x)=-3x^2+5x에서 5x는 홀함수이므로 대칭 구간 적분은 0이다.
∫_-2^2 -3x^2dx=-[x^3]_-2^2=-16.
따라서 정답은 ④이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
동결 SHA-256:
- `item.json`: `5d97b6dc79ac45065b9b6398f1b3bcf50c2cb28c24b811190cc555a60cef5f3f`
- `plan.json`: `c28c2bb2629d8f00e337f6e2b68893e0d7d541d6b618449046d0089bea27125a`
- `publish.json`: `9a52f3986da769c102e221accacca3f0c11f05b2bfbb1e26349a47b703431240`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
