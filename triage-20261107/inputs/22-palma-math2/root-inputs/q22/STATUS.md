# 22 팔마고 고2 수학II Q22 입력 초안

원문 인용(정확, 문항):

```text
서술형 3. 어느 박람회에 원기둥을 직접 만들어 보는 체험관이 있다. 이 체험관에서는 겉넓이가 $k$로 일정하면서 부피가 최대인 원기둥을 만드는 행사를 열었다. 이때, 부피가 최대인 원기둥의 밑면의 반지름의 길이와 높이의 비를 가장 작은 자연수의 비로 나타내고, 그 풀이과정을 서술하시오. [7.0점]
```

원문 인용(정확, 정답):

```text
1:2
```

원문 인용(정확, 해설):

```text
밑면의 반지름을 $r>0$, 높이를 $h>0$이라 하자. 원기둥의 겉넓이는 윗면·아랫면 두 원과 옆면을 합한
$2\pi r^2+2\pi rh=k$이다.
이를 높이에 대하여 풀면 $h=\frac{k-2\pi r^2}{2\pi r}$이다.
부피는 $V=\pi r^2h=\frac{k}{2}r-\pi r^3$이고 $0<r<\sqrt{k/(2\pi)}$이다.
$V'(r)=\frac{k}{2}-3\pi r^2$이므로 최대 부피의 후보는 $r^2=\frac{k}{6\pi}$이다.
$V'$는 그보다 작은 $r$에서 양수, 큰 $r$에서 음수이므로 이 점에서 최대이다.
$k=6\pi r^2$를 겉넓이 식에 대입하면 $6\pi r^2=2\pi r^2+2\pi rh$, 따라서 $h=2r$.
따라서 반지름:높이의 가장 작은 자연수 비는 $\boxed{1:2}$이다.
```

표현 범위: 최적 사례 하나만을 반지름 r, 높이 2r로 나타낸 비례도이며, 그림 내부의 단위 비율은 절대 길이나 k의 수치를 뜻하지 않는다. 모든 원기둥이 이 비율이라는 일반화는 하지 않는다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `800ea99e16728de9b2f527b496c02a930a715f0a2946686ce667bf4581a132eb`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, solveSolidFigure=PASS, solidFigureSpec=PASS, expandSolidFigure=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
