# 22 팔마고 고2 수학II Q21 입력 초안

원문 인용(정확, 문항):

```text
서술형 2. $x \ge a$에서 $f(x) \ge 0$인 연속함수 $f(x)$에 대하여 다음 그림과 같은 영역의 넓이를 $S(x)$라 하자.
$f(a)=10$이고, $F'(x)=f(x)$일 때, $\lim_{x \to a} \frac{2S(x)}{x-a}$의 값을 구하고, 그 풀이과정을 서술하시오. [7.0점]
```

원문 인용(정확, 정답):

```text
20
```

원문 인용(정확, 해설):

```text
그림의 음영은 $x=a$부터 $x$까지 곡선 $y=f(t)$와 $t$축 사이의 넓이이다. $f(t)\ge0$이므로
$S(x)=\int_a^x f(t)dt=F(x)-F(a)$이다.
주어진 극한을 정리하면
$\lim_{x\to a^+}\frac{2S(x)}{x-a}=2\lim_{x\to a^+}\frac{F(x)-F(a)}{x-a}$.
$F'(a)=f(a)=10$이고 연속이므로 오른쪽 미분계수도 10이다.
따라서 극한은 $2\cdot10=\boxed{20}$이다. $S(a)=0$이고 $x\ge a$라는 정의역 때문에 $a$의 오른쪽에서 접근한다.
```

표현 범위: 값 없는 a,x 기호점은 a<x의 순서와 상징 폭 x−a만 나타낸다. 함수의 구체적 곡선이나 좌표는 추정하지 않는다. 캡션은 연속성으로 평균 높이가 f(a)=10에 접근한다는 관계와 그 두 배 극한을 적는다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `7f4262142f6a1964b16ee99cb43aaa7334c5097b2af86e82cf59365c1b23bfb7`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
