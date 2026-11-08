# 21 매산여고 고2 수학II Q18 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 전용 폴더에 item.json, plan.json, publish.json, STATUS.md만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal 18, questionNumber 18. 원문 preparation 복사본 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes), 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`, SHA256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`. 원문 visualDisposition은 `NO_ADDITIONAL_VISUAL_REQUIRED이며 기존 값과 이전 검수 기록을 변경하지 않았다.

도식 요약: p′(x)=4(x+1)(x−1)(x−3), 따라서 A=(−1,−9), B=(1,7), C=(3,−9)는 실제 극점이고 O=(0,0)이다. y=0의 네 교점 x=1−√7, 0, 2, 1+√7 및 y=7의 세 서로 다른 교점 x=1−2√2, 1, 1+2√2를 정확히 표시한다. 수평선 y=k가 0<k<7일 때 음의 교점 1개와 양의 교점 3개를 가지며, 정수 k는 1,2,3,4,5,6으로 6개다. k=0은 0이 근이고 k=7은 x=1에서 중근이므로 제외된다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
사차방정식 $x^4-4x^3-2x^2+12x-k=0$의 서로 다른 네 근 $\alpha,\beta,\gamma,\delta$에 대하여 $\alpha<0<\beta<\gamma<\delta$일 때, 모든 정수 $k$의 개수를 구하면? [4.3점]
```

원문 정답: ② ($6$ 선택지)

원문 해설 (정확 인용):

```text
$p(x)=x^4-4x^3-2x^2+12x$라 두고 $p(x)=k$의 교점을 살핀다.
$p'(x)=4(x+1)(x-1)(x-3)$
극값을 갖는 $x=-1,1,3$에서
$p(-1)=-9,\quad p(1)=7,\quad p(3)=-9$
또 $p(0)=0$이고 양끝에서 $p(x)\to\infty$이다.
음의 근이 하나이고 양의 근이 세 개가 되려면 수평선 $y=k$가 $x<0$에서 한 번, $x>0$에서 세 번 만나야 하므로
$0<k<7$이어야 한다. $k=0$은 근이 $0$이어서 조건에 맞지 않고, $k=7$은 중근이 생긴다.
가능한 정수는 $1,2,3,4,5,6$으로 모두 $6$개이다.
```

검증 실행 상태: 입력/계약 검사, 엔진 검사, 렌더, 시각 검사, 독립 전체 수학 검토, 게시 검수 및 인계는 모두 **NOT_RUN**이다. 이 작성자는 검사를 실행하거나 렌더하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격/엔진/원본/assets/ledger, Q01/Q03 실제 새 엔진 결과, 이전 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 이전 로컬 파일은 변경하지 않았다. Hyocheon ref는 사용·재시도·우회하지 않았다.

JSON 동결 SHA256:
- item.json: `a3d65f40b16f812a975d8bb35e7ccb5025faa2f0f616f36bb3b575f1512f36ed`
- plan.json: `3c25e62661321be862aaf15d6018e4dea13947f6a85344420ba632cfc5efd1e8`
- publish.json: `50a6ad09ae51ce8233cafbad1f52ff9124eb3f131c3f63e01f323e82f50c967f`

이 해시 이후 JSON은 수정하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
