# 22 팔마고 고2 수학II Q20 입력 초안

원문 인용(정확, 문항):

```text
서술형 1. 함수 $f(x)=x^3+ax^2+ax+1$이 열린구간 $(-2, 1)$에서 극댓값과 극솟값을 모두 갖도록 하는 실수 $a$의 값의 범위를 구하고, 그 풀이과정을 서술하시오. [6.0점]
```

원문 인용(정확, 정답):

```text
$(-1,0)\cup(3,4)$
```

원문 인용(정확, 해설):

```text
극댓값과 극솟값을 열린구간 $(-2,1)$ 안에서 모두 가지려면 도함수의 서로 다른 두 근이 이 구간의 내부에 있어야 한다.
$f'(x)=3x^2+2ax+a$는 위로 열린 이차식이다. 두 근이 $(-2,1)$에 있으려면 양 끝에서 $f'>0$, 꼭짓점이 구간 안, 판별식 $D>0$을 만족한다.
$f'(-2)=12-3a>0\Rightarrow a<4$,
$f'(1)=3+3a>0\Rightarrow a>-1$.
꼭짓점의 $x$좌표는 $-a/3$이므로 $-2<-a/3<1$, 즉 $-3<a<6$이다.
판별식 $D=(2a)^2-12a=4a(a-3)>0$이므로 $a<0$ 또는 $a>3$이다.
모든 조건을 교집합으로 묶으면 $-1<a<0$ 또는 $3<a<4$이다.
경계 $a=-1,4$에서는 한 극점이 열린구간 끝에 놓이고, $a=0,3$에서는 도함수가 중근을 가져 두 극값이 생기지 않는다.
따라서 $\boxed{(-1,0)\cup(3,4)}$이다.
```

표현 범위: 공통 수직선 위에 두 개의 열린 구간만 표시하여 네 경계값을 제외한다. 도함수 근 두 개가 x∈(−2,1)에 엄격히 들어와야 한다는 조건은 캡션으로 보존하고, x의 근 위치를 추측해 그리지 않는다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `82196d244b644f720f606c278ac4d8ff0ef08b681a581152eacdfadc1495d3d4`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
