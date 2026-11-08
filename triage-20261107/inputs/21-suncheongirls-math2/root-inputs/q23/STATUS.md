# 21 순천여고 고2 수학II Q23 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 23, questionNumber 23. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `assets/images/21_순천여고_2학기_기말_고2_수학II/q23.png`.

도식 요약: 증감표 조건으로 a=2이다. g(x)=(x+1)³(3−x)=−x⁴+6x²+8x+3의 정지변곡점 O=(−1,0), 극댓점 M=(2,27), 영점 A=(3,0)을 나타낸다. g′=f이므로 [−1,3]에서 g의 총변화는 |27−0|+|0−27|=54이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
[서술형3] 최고차항의 계수가 $-4$인 삼차함수 $f(x)$에 대하여 함수 $g(x)=\displaystyle\int_{-1}^x f(t)\,dt$라 할 때, 다음 물음에 답하시오. (단, $a$는 $-1<a<3$인 상수이고 $b$는 상수이다.)
[증감표는 원본 이미지 참조]
위의 증감표를 활용하여 상수 $a$와 $\displaystyle\int_{-1}^3|g'(x)|\,dx$의 값을 각각 구하고 그 과정을 서술하시오. [총 7점] (각 값 2점, 과정 5점)
```

원문 선택지 (정확 문자열):

```text
[]
```

원문 정답 (정확 문자열):

```text
a=2, 54
```

원문 해설 (정확 인용):

```text
표에서 g'(x)=f(x)는 x=-1에서 부호가 바뀌지 않고 x=a에서 양수에서 음수로 바뀐다. 최고차항 계수가 -4이므로 f(x)=-4(x+1)^2(x-a)이다.

g(-1)=0, g(3)=0이므로
0=∫_-1^3f(t)dt=-4∫_-1^3(t+1)^2(t-a)dt.
적분값을 0으로 두면 a=2이다.

f(t)=-4(t+1)^2(t-2),
g(x)=∫_-1^x f(t)dt=(x+1)^3(3-x).
따라서 g(-1)=0,g(2)=27,g(3)=0이고
∫_-1^3|g'(x)|dx=|27-0|+|0-27|=54.
정답은 a=2, 54이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
동결 SHA-256:
- `item.json`: `83db0b0cf4361672f2a5408f77b762f0d6bf0b84c3ce10e18b9e9aba0daa0438`
- `plan.json`: `df3ad5a53c1cbd096defeae2fc7b248d68f2c6162900f02a8a6a0e0574e738dc`
- `publish.json`: `bf3a38c09d1bbcdfb638bca0810f92a2f93176006235ce14c43cee9d2e3cf1ac`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
