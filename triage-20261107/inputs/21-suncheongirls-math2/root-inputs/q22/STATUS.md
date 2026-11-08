# 21 순천여고 고2 수학II Q22 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY · NOT_READY**. 이 작성 단계에서는 독립 입력 검수와 엔진 검사를 실행하지 않았다.

원문 결속: `archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 22, questionNumber 22. 원문 preparation 복사본 `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes), SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`, 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`. 원문 객체에 `visualDisposition` 메타데이터는 없으며 기존 원문 시각 이력을 수정하지 않았다. 원문 이미지 필드: `(source image field absent)`.

도식 요약: y축 대칭 사차함수 f(x)=x⁴−8x²+4의 극댓점 M=(0,4), 극솟점 A=(−2,−12), B=(2,−12), 요청된 점 P=(3,13)을 나타낸다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
[서술형2] 최고차항의 계수가 $1$인 사차함수 $f(x)$의 그래프가 $y$축에 대칭이다.
이 그래프가 $(0,4)$에서 극댓값을 갖고 $x=-2$, $x=2$에서 극솟값을 갖는다.
$f(x)$를 구하고 $f(3)$의 값을 구하는 과정을 서술하시오. [총 7점] (함수식 2점, 과정 5점)
```

원문 선택지 (정확 문자열):

```text
[]
```

원문 정답 (정확 문자열):

```text
$f(x)=x^4-8x^2+4$, $f(3)=13$
```

원문 해설 (정확 인용):

```text
짝함수이고 최고차항의 계수가 $1$인 사차함수이므로
$f(x)=x^4+ax^2+b$로 둔다.

극댓점이 $(0,4)$이므로
$f(0)=b=4$이다.

$x=2$가 극점이므로 $f′(2)=0$이다.
$f′(x)=4x^3+2ax$에서
$32+4a=0$, $a=-8$이다.

실제로 $f″(x)=12x^2-16$이므로
$f″(0)=-16<0$, $f″(\pm2)=32>0$이다.
따라서 $x=0$에서 극대, $x=\pm2$에서 극소가 된다.

$f(x)=x^4-8x^2+4$,
$f(3)=81-72+4=13$이다.
따라서 $f(x)=x^4-8x^2+4$이고 $f(3)=13$이다.
```

입력 범위와 주의점:

- 그래프 계수와 출처 근거는 정확한 원문 함수 및 해설에서만 취했다.
- 사용자가 승인한 네 파일만 이 문항 전용 로컬 초안 폴더에 기록했다. 입력/계약 검사, 렌더, 시각 검토, 독립 수학 검토, 게시와 인계는 모두 **NOT_RUN**이다. 초안은 READY가 아니다.
- 원문, 엔진, assets, ledger, 기존 패키지 및 다른 초안 폴더는 변경하지 않았고 원격 쓰기는 하지 않았다. Q08/Q16 보호 입력은 건드리지 않았다.
Q22 주의: 정확한 계수와 원문이 지정한 극점 및 f(3)만 입력했다. 별도 영점 좌표는 근삿값으로 기록하지 않았다. 전체 다항식은 정확하며 ALL_REALS 도메인을 보존했다.

동결 SHA-256:
- `item.json`: `07c0bcb52dc4a199e5e18fe8d5e820d0e8c0e9d08950af4718391ec83598f782`
- `plan.json`: `c02c365becf6effd106e3f7547bbcdc98d8fb895509d24356198622ffacb3c8f`
- `publish.json`: `9c94f773221d454c7ab4422c1f6e549e8d5fc1115f9f551406044b93c4989d44`

이 SHA-256 집합은 작성 산출물의 로컬 참조값이다. 파일은 현재 DRAFT_ONLY 상태로 동결했으며 검사 실행을 뜻하지 않는다.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
