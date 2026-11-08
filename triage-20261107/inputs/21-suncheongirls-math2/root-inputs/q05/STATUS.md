# 21 순천여고 고2 수학II Q05 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 5, questionNumber 5. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `(source image field absent)`.

도식 요약: p(x)=−3x⁴+4x³의 정지변곡점 O=(0,0), 전역 극댓점 M=(1,1), 다른 영점 A=(4/3,0)을 표시한다. 양끝에서 p(x)→−∞이므로 전역 최댓값은 1이고 조건은 k≥1이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
모든 실수 $x$에 대하여 부등식 $-3x^4+4x^3\le k$가 성립하도록 하는 정수 $k$의 최솟값은? [3.9점]
```

원문 선택지 (정확 문자열):

```text
["$-1$", "$0$", "$1$", "$2$", "$3$"]
```

원문 정답 (정확 문자열):

```text
③
```

원문 해설 (정확 인용):

```text
p(x)=-3x^4+4x^3라 두면
p'(x)=-12x^3+12x^2=12x^2(1-x).

x<1에서는 증가하고 x>1에서는 감소한다.
또 p(x)→-∞ (x→±∞)이므로 최댓값은
p(1)=-3+4=1.

모든 x에서 p(x)≤k가 되려면 k≥1이다.
정수 k의 최솟값은 1이므로 정답은 ③이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
동결 SHA-256:
- `item.json`: `52287db967d2812475b90653981d1dfcfa2cb7bff47713d8e74baf20505f6c98`
- `plan.json`: `c2fdbdb52226473a7514d72eff5a272688e8266f13dfcd1e15e010647ba58686`
- `publish.json`: `c222a17913ed55a56a8169bdd3f99cb4e344b71d1dca66b19d35d5a952b76169`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
