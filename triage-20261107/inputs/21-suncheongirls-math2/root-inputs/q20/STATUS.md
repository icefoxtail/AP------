# 21 순천여고 고2 수학II Q20 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob 6cc6649228f234957774cdc9c1ccedf196037d86; source-exact.js 43099 bytes, SHA-256 8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b. item.json은 sourcePath와 ordinal 20만으로 결속한다. 원문 식별에 없는 sourceQid/questionNumber는 요구하거나 덧붙이지 않았다.

## 원문 문항 (정확 문자열)

```text
함수 $f(x)=|x^3-3x+k|$에 대하여 방정식 $f'(x)(x+2)=f(x)$를 만족시키는 서로 다른 두 실근을 $\alpha,\beta$라 하자. $f'(\alpha)=f'(\beta)$일 때, $\alpha+\beta$의 값은? (단, $\alpha<\beta$, $k$는 음의 상수이다.) [4.5점]
```

## 원문 선택지 (정확 문자열)

```text
$-2-\sqrt{11}$ / $-3+\sqrt{7}$ / $0$ / $3-\sqrt{13}$ / $3+\sqrt{17}$
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
서로 다른 두 근 α, β에서 식을 정리한다.
u(x)=x^3-3x+k라 두면 u(x)≠0일 때
f'(x)=sgn(u(x))(3x^2-3)이다.
주어진 식은 부호에 관계없이
(3x^2-3)(x+2)=x^3-3x+k
2x^3+6x^2-6=k가 된다.
H(x)=2x^3+6x^2-6이라 두면 H(α)=H(β)=k이다.
H'(x)=6x(x+2), H(-2)=2, H(0)=-6이다.
k<-6이면 근이 하나이고, k=-6이면 두 근 -3,0에서 f'값이 -24,3으로 다르다.

이제 -6<k<0을 본다. H(x)=k는 세 근을 갖는다.
H(x)=k인 근에서는 k를 대입하여
u(x)=3(x+2)(x^2-1)을 얻는다.
k=-2이면 근은 -1,-1±√3이다. 이때 f'값은 0,-9-6√3,-9+6√3으로 서로 다르다.
-6<k<-2이면 세 근에서 u의 부호가 모두 음수이다.
이 경우 f'(α)=f'(β)는 α^2=β^2를 뜻한다.
서로 다른 근이므로 β=-α여야 하지만
H(α)-H(-α)=4α^3≠0이므로 불가능하다.

-2<k<0이면 세 근은 각각 (-∞,-2),(-2,-1),(0,1)에 놓이고 u의 부호는 음수, 양수, 음수이다.
따라서 미분값이 같은 두 근의 u 부호는 서로 다르다.
f'(α)=f'(β)에서 α^2-1=-(β^2-1)이므로
α^2+β^2=2이다.

s=α+β, r=αβ라 두자.
α≠β이고 H(α)=H(β)이므로
0=(H(α)-H(β))/(α-β)
=2(α^2+αβ+β^2)+6(α+β).
따라서 r=s^2+3s이다.
α^2+β^2=s^2-2r=2를 대입하면
s^2+6s+2=0이다.
s=-3±√7이다.

s=-3-√7이면 두 근의 판별식 s^2-4r=-3s(s+4)<0이므로 실근 쌍이 아니다.
따라서 s=-3+√7이다.
이때 r=7-3√7<0이고 판별식은 6(√7-2)>0이다.
두 근은 각각 (-2,-1),(0,1)에 놓여 u의 부호가 서로 다르다.
남은 H의 근은 -√7이며, 세 근의 곱으로 k=36-14√7이 되어 -2<k<0이다.
따라서 조건을 만족하는 두 근이 실제로 존재하고
α+β=-3+√7이다. 정답은 ②이다.
```

## 원본 시각 자료 이력

원문 문항 및 preparation-21-suncheongirls-math2/source-question-evidence.json에서 image, solutionImage, visualDisposition이 모두 null이다. 보존하거나 대체할 원본 이미지 자산은 이 문항에 없다.

## 초안 설명

H는 원문 절댓값 함수가 아니라 풀이에서 얻은 보조 다항식이다. 극값 두 점과 수평선 높이 k를 정확히 나타내고, 해설에서 정확히 주어진 제3근 −√7을 표시한다. 선택된 α,β의 개별 근 좌표를 소수로 바꾸지 않고 원 해설의 구간과 정확한 합 −3+√7을 캡션에 둔다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 독립 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일 외에는 수정하지 않았다. 원격 쓰기 0회.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
