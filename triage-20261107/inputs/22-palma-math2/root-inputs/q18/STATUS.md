# 22 팔마고 고2 수학II Q18 입력 초안

원문 인용(정확, 문항):

```text
18. 수직선 위를 움직이는 두 점 $\mathrm{A}, \mathrm{B}$의 시각 $t$에서의 위치를 각각 $f(t), g(t)$라 할 때, 두 함수 $y=f(t), y=g(t)$의 그래프가 다음과 같다. <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $f'(a)=f'(d)=0, g'(a)=g'(e)=0$) [4.8점]

<보기>
ㄱ. 두 점 $\mathrm{A}, \mathrm{B}$는 $d < t < e$에서 서로 같은 방향으로 움직인다.
ㄴ. 두 점 $\mathrm{A}, \mathrm{B}$는 $0 < t < 10$에서 두 번 만난다.
ㄷ. $t=a$에서 두 점 $\mathrm{A}, \mathrm{B}$의 가속도는 모두 음의 값을 갖는다.
```

원문 인용(정확, 정답):

```text
④
```

원문 인용(정확, 해설):

```text
위치 그래프의 기울기는 속도, 기울기의 변화율은 가속도를 뜻한다.<br>ㄱ. 그림에서 $f$는 $t=d$에서 극소, $g$는 $t=e$에서 극소이다. 따라서 $d<t<e$에서 $f'(t)>0$이지만 $g'(t)<0$이다. 두 점은 반대 방향으로 움직이므로 거짓이다.<br>ㄴ. 위치 그래프 $y=f(t)$와 $y=g(t)$는 $t=0,b,e$에서 만난다. 열린구간 $0<t<10$에 포함되는 것은 $t=b,e$의 두 번이므로 참이다.<br>ㄷ. $t=a$에서 두 위치 그래프는 모두 매끄러운 극대점이며 아래로 굽는다. 따라서 그림에 나타난 $f''(a)<0$, $g''(a)<0$로 두 가속도는 모두 음수이므로 참이다.<br>옳은 것은 ㄴ, ㄷ이므로 정답은 ④이다. ①·③·⑤는 거짓인 ㄱ을 포함하고 ②는 참인 ㄷ을 누락한다.
```

표현 범위: 수직선은 명시된 d<e 순서만 표시하고, 그 사이의 운동방향이 서로 반대임을 캡션형 구간표기로 나타낸다. 교점 b,e와 t=0 사실은 문장으로 보존하되, 미제공 시간좌표나 두 위치 곡선은 그리지 않는다. 매끄러운 극대라는 사실만으로 f″(a)<0 또는 g″(a)<0을 도출하지 않는다. 원본 풀이의 가속도 판단은 그림 의존 정보로 남긴다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `725be283d4b908ec58ad7d2f32cc8126752e4f2421b191d9ad58617724cc4e95`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
