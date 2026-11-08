# 21 매산여고 고2 수학II Q21

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 폴더에 item/plan/publish 초안과 이 상태 기록만 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 21; 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`; 정확 원문 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes, SHA-256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`). 로컬 원문 크기와 SHA-256을 대조했다. sourcePath/ordinal은 item.json에 기록했다.

원문 문항 (source-exact.js의 content, 정확 인용):

```text
[주관식3 (서술형)] 함수 $f(x)=\displaystyle\int_x^1(2t^3-6t^2)\,dt$일 때, 다음 물음에 답하여라. [총 7점](부분점수 없음.)
1) 함수 $f'(x)$를 구하여라. (2점)
2) 함수 $f(x)=\displaystyle\int_x^1(2t^3-6t^2)\,dt$의 극댓값을 구하여라. (3점)
3) $y=f'(x)$와 $x$축으로 둘러싸인 도형의 넓이를 구하여라. (2점)
```

원문 정답 필드 (정확 인용): `1) $-2x^3+6x^2$; 2) $12$; 3) $\dfrac{27}{2}$`

원문 해설 (source-exact.js의 solution, 정확 인용):

```text
1) 적분의 아래끝이 $x$이므로 미분할 때 부호가 붙는다.
$f'(x)=-(2x^3-6x^2)=-2x^3+6x^2$

2) $f'(x)=-2x^2(x-3)$이다. $x<3$에서 양수이고 $x>3$에서 음수이므로 $x=3$에서 극댓값을 갖는다.
$f(3)=\displaystyle\int_3^1(2t^3-6t^2)\,dt=12$

3) $f'(x)$는 $x=0,3$에서 $x$축과 만나고 $0\le x\le3$에서 음수는 아니다.
$\displaystyle\text{넓이}=\int_0^3(-2x^3+6x^2)\,dx=[-\frac12x^4+2x^3]_0^3=\frac{27}{2}$이다.
```

시각화 사유 및 범위: 원문 visualDisposition `NO_ADDITIONAL_VISUAL_REQUIRED` 이력은 원문에서 변경하지 않았다. 풀이 관계를 보조하는 선택적 함수 그림 초안을 별도로 제안한다. 표시된 곡선은 원함수 f가 아니라 y=f′(x)=−2x³+6x²이다. x=0에서 접하고 x=3에서 축을 가로지르며 실제 둘러싸인 영역 [0,3]만 표시한다.

검사 기록: 문항 21의 questionBank ordinal, 문항 본문, 정답 및 해설을 로컬 원문에서 읽었다. 계산과 입력 계약은 초안 단계에서 작성했으며 independent checker는 실행하지 않았다.

미실행: 독립 입력 checker, author tests, fit/semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q01/Q03 실제 엔진 결과, 과거 `NO_ADDITIONAL_VISUAL_REQUIRED` 이력, 이전 392개 로컬 파일과 기존 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 SHA-256

- item.json: `cfa87f6ea0479a7dd4b14803f50e24fe95c2762c7ef9e521daf32bb54fc92fbd`
- plan.json: `c0f2021efdd89006c5182be62d05b2f6221ef2c690d901916db083bdb112c903`
- publish.json: `681744118bb26875201e7327f9c56c09cc0b484f2d832e5f5426f86d89170cf7`


## 첫 동결 입력 검사 결과 및 최소 수정

실행 근거: `preparation-21-maesangirls-math2/checker/reports/run-summary-2026-11-08T20-28-38-433Z.json` 및 같은 실행의 node 결과. 첫 동결 입력 검사에서 Q21의 source/input binding, JSON 구문, `fit_overview`는 PASS였고 `specFor`의 첫 오류는 정확히 **`AXIS_TITLE_INVALID:y`**였다. 실패 값은 `axisTitles.y = "y=f′(x)"`이며 U+2032 PRIME 문자가 10자 이내 제목에서 허용되지 않는다. 허용 제목 패턴은 한글/ASCII 문자·숫자와 ` ()·/.,%-`뿐이다.

최소 수정: plan.json의 `graphPlan.axisTitles.y`만 **`f의 도함수`**로 바꿨다(허용 문자, 6자). 학생용 캡션과 publish 캡션의 `y=f′(x)=−2x³+6x²`는 그대로 유지해 원함수가 아닌 도함수 그래프임을 분명히 한다. publish.json과 item.json은 바꾸지 않았다. 수정 전 정확 복사본은 `preparation-21-maesangirls-math2/corrections/before/q21/plan.json`, `preparation-21-maesangirls-math2/corrections/before/q21/publish.json`, `preparation-21-maesangirls-math2/corrections/before/q21/STATUS.md`에 보존했다.

수정 후 상태: 이 제목 수정 후 checker를 재실행하지 않았다. 따라서 수정본의 `specFor`/전체 checker 상태는 **NOT_RUN**, 통과 주장 없음. 그 외 semantic, coordinate/viewport, engine.prepare/build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff도 NOT_RUN이다. 첫 실행의 FAIL 기록은 보존한다.

정확한 수정 전 백업 SHA-256: plan.json `c0f2021efdd89006c5182be62d05b2f6221ef2c690d901916db083bdb112c903`, publish.json `681744118bb26875201e7327f9c56c09cc0b484f2d832e5f5426f86d89170cf7`, STATUS.md `f073a2b4dace6a7b771fd0ec6b3a0a6eba1385b63292e3eadce3f926b2e2f465`.

수정본 JSON SHA-256: item.json `cfa87f6ea0479a7dd4b14803f50e24fe95c2762c7ef9e521daf32bb54fc92fbd`, plan.json `5904410ffb6e954f6079defdbbf5839d9c2c0b9480865deb5474d4ad9693164d`, publish.json `681744118bb26875201e7327f9c56c09cc0b484f2d832e5f5426f86d89170cf7`.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-41-33-295Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
첫 실패와 변경 전 파일은 preparation-21-maesangirls-math2/corrections/before/에 보존했다. 라벨 문법만 정정한 최신 item/plan/publish 3파일이 재검사 동결 SHA-256 및 검사 전후 SHA-256과 모두 일치했다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
