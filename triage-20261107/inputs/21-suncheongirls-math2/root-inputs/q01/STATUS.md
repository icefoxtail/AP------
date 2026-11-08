# 21 순천여고 고2 수학II Q01 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 1, questionNumber 1. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `(source image field absent)`.

도식 요약: p(x)=x³−12x의 극댓점 M=(−2,16), 극솟점 m=(2,−16)을 나타낸다. y=−k가 세 서로 다른 교점을 갖는 조건은 −16<−k<16, 즉 −16<k<16이다. 정수 끝값은 −15와 15이므로 합은 0이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
방정식 $x^3-12x+k=0$이 서로 다른 세 실근을 갖도록 하는 정수 $k$의 최댓값을 $m$, 최솟값을 $n$이라 할 때, $n+m$의 값은? [3.6점]
```

원문 선택지 (정확 문자열):

```text
["$0$", "$1$", "$2$", "$3$", "$4$"]
```

원문 정답 (정확 문자열):

```text
①
```

원문 해설 (정확 인용):

```text
함수 p(x)=x^3-12x의 극값으로 세 실근 조건을 찾는다.
p'(x)=3x^2-12=3(x-2)(x+2)

극댓값과 극솟값은 p(-2)=16, p(2)=-16이다.
따라서 p(x)=-k가 서로 다른 세 실근을 가지려면
-16<-k<16, 즉 -16<k<16이어야 한다.

정수 k의 범위는 -15≤k≤15이다.
m=15, n=-15

그러므로 n+m=0이고 정답은 ①이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
동결 SHA-256:
- `item.json`: `bee3f33406baa5a776f315c9b703c61096b81d57b4bc25a6054cbb4bc8c0aa52`
- `plan.json`: `2ae5715d50bd809414f9d35d399054f53c1b35cf1885af2d24c8b0e94da5eb0b`
- `publish.json`: `54e9ddf6690e023e666470e015c35e3f79520193f5cc44dceb4ddc9549460aa9`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=PASS; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
