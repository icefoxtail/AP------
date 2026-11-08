# 22 팔마고 고2 수학II Q15 입력 초안

원문 인용(정확, 문항):

```text
15. $\lim_{n \to \infty} \left\{ 2n \int_{1}^{\frac{n+1}{n}} (x^3-2x^2+3x+5)dx \right\}$의 값은? [4.6점]
```

원문 인용(정확, 정답):

```text
⑤
```

원문 인용(정확, 해설):

```text
$P(x)=x^3-2x^2+3x+5$라 두고 $F(x)=\int_1^xP(t)dt$라 하면 $F(1)=0$, $F'(1)=P(1)=1-2+3+5=7$이다.
주어진 식은 $2nF(1+1/n)=2\frac{F(1+1/n)-F(1)}{1/n}$이다.
$n\to\infty$이면 미분계수의 정의에 의해 $2F'(1)=2\cdot7=\boxed{14}$이다.
따라서 ⑤. ① $10$, ② $11$, ③ $12$, ④ $13$은 적분구간 길이 $1/n$과 앞의 계수 $2n$을 함께 처리한 극한값이 아니다.
```

표현 범위: 두 기호점은 [1,1+1/n]의 양 끝을 나타내며 그림에는 절대 위치가 아니라 폭 1/n만 표시한다. P(1)=7을 캡션에 연결해 2n 계수와 구간 폭 1/n의 곱에서 2배 평균값으로 이어지는 관계를 설명한다. n의 임의 수치 예시, 두 끝점의 임의 좌표 또는 P의 미제시 그래프는 추가하지 않는다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `f85df1c06c43d2c7151bffa1d4b9ae11b8759fec988e11bbc6b902543736b26d`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
