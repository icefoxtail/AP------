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

## Q19 별도 piecewise 대안 (원본 실패본 보존)

이 디렉터리는 원본 Q19 초안을 고친 것이 아니라, 허용된 별도 대안이다. 기존 `drafts/21-suncheongirls-math2-q19`와 `corrections/before/q19`는 수정하지 않았다. 원본의 독립 검사 기록 `checker/reports/q19-multicurve-semantic-diagnosis.md`에 따르면 2026-11-08T21-13-58-934Z 실행에서 원 입력의 fit/spec 생성은 통과했지만, 생성된 `FUNCTION_GRAPH` 객체의 `branch: "CURVE_f"`가 semantic validator에서 `INVALID_GRAPH_BRANCH_TAG`로 거부되었다. 이는 입력의 branch 값 오류가 아니라 multi-curve spec이 만든 태그와 validator 간 불일치였다. 해당 원본 실패 결과는 유지한다.

대안은 `piecewise-polynomial-spike-v1`의 정확한 다항 경계 표현만 사용한다. 주 함수 p는 원래 포물선 `36x²/25`의 단위정사각형 내부 구간 `[0,5/6]`에 한정한다. 참조 곡선 `roof`는 `[0,1]`에서 y=1인 정사각형 윗변이고, 참조 곡선 `gcurve`는 y=x²/3이다. S1은 roof와 p 사이 `[0,5/6]`, S2는 p와 gcurve 사이 `[0,5/6]` 및 roof와 gcurve 사이 `[5/6,1]`, S3는 gcurve와 x축 사이 `[0,1]`이다. S2 조각은 x=5/6에서 닿아 하나의 연결 영역을 이룬다. x=0과 y=0은 축, x=1은 실제 오른쪽 변 선분, y=1은 `[0,1]`로 한정된 윗변 참조곡선으로 표시하도록 입력했다. x>5/6의 원래 포물선 연장은 정사각형 밖이라 표시하지 않는다고 명시했다.

정확한 넓이 검산(입력 author test가 아님): S1=5/9. S2의 두 부분은 각각 415/1944와 233/1944이므로 합은 1/3. S3=1/9. 넓이 계산의 원문 인용은 아래의 원 해설 그대로 보존되어 있다.

원본 시각 자료 이력은 source-question-evidence.json에서 image `assets/images/21_순천여고_2학기_기말_고2_수학II/q19.png`, visualDisposition `null`로 기록되어 있다. 원본 이미지 및 visualDisposition을 바꾸지 않았다. 본 대안의 입력 검사, semantic 검사, 엔진 검사, 렌더, 시각 검토, 독립 수학 검토, publication, handoff는 모두 `NOT_RUN`; 대안은 `LOCAL_ONLY / DRAFT_ONLY / NOT_READY`이다. 검사 기준 또는 엔진 코드를 바꾸지 않았고, 원격 동작도 하지 않았다.


## 별도 대안 실제 입력 검사 결과

현재 별도 대안은 **TECHNICAL_HOLD / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**이다. 실행 2026-11-08T21-35-20-669Z에서 동결본 3개 JSON 및 검사 전후 SHA-256이 일치했고 sourcePath/ordinal19·원문 결속·JSON 파싱·publish 필드는 통과했다. 실제 fit_overview는 **FAIL: GRAPH_REGION_DOMAIN_INVALID:S2b**였다. 주함수의 입력 sourceDomain은 닫힌 [0,5/6]이며 S2b는 [5/6,1], S3는 [0,1]로 요청되었다. fit 결과가 생성되지 않아 fitted domain 보존 여부는 확인하지 못했다.

specFor, semantic/좌표/critical/viewport/눈금 검사는 NOT_RUN이다. 수학적으로 세 영역을 모두 표현하는 검증된 입력이라고 주장하지 않는다. 한 번 검사한 뒤 원본·대안을 더 수정하거나 재시도하지 않았다. 원래 다중곡선 입력의 INVALID_GRAPH_BRANCH_TAG도 별도로 보존했다. engine/spec/검증 기준 변경, prepare/build/render, 시각/독립 전체 수학 검토, CI, publication, handoff 및 원격 쓰기는 없다. 위에 복사된 주입력 검사 기록은 원래 다중곡선 초안의 이력이며 본 별도 대안의 PASS를 뜻하지 않는다.
