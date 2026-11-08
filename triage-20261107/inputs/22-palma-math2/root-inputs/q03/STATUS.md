# 22 팔마고 고2 수학II Q03 입력 초안

원문 인용(정확, 문항):

```text
3. 함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같을 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [3.6점]

<보기>
ㄱ. $f(x)$는 닫힌구간 $[B, D]$에서 증가한다.
ㄴ. $f(x)$는 $x=D$에서 극대이다.
ㄷ. $f(x)$의 극값은 4개이다.
ㄹ. $f(x)$가 극소가 되는 $x$의 값은 $C$와 $G$이다.
```

원문 인용(정확, 정답):

```text
④
```

원문 인용(정확, 해설):

```text
도함수의 부호가 원함수의 증가·감소를 결정한다. 그림에서 $f'$는 $A,C,E,G$에서 $x$축을 통과한다.
부호 변화는 $A$에서 $+\to-$, $C$에서 $-\to+$, $E$에서 $+\to-$, $G$에서 $-\to+$이다.
따라서 $f$는 $A,E$에서 극대, $C,G$에서 극소이다.<br>ㄱ. $B$부터 $C$까지는 $f'<0$이므로 $[B,D]$ 전체에서 증가하지 않는다(거짓).<br>ㄴ. $D$에서는 $f'(D)>0$이므로 극대가 아니다(거짓).<br>ㄷ. 극값을 갖는 지점이 $A,C,E,G$의 네 곳이므로 참.<br>ㄹ. 극소 지점이 $C,G$이므로 참.
참인 것은 ㄷ, ㄹ이고 정답은 ④이다. ①·②·⑤는 거짓인 ㄱ을 포함하고, ③은 거짓인 ㄴ을 포함한다.
원본 PDF의 문자 A·C·E·G는 각 x절편을 가리키며, 글자 자체가 축 교점에서 왼쪽으로 배치된 것은 인쇄 라벨 위치이다.
```

표현 범위: 기호가 있는 A~G의 가로 순서를 보존하고, 좌표값은 표시하지 않는다. 소문자 a~g는 원본 대문자 A~G와 순서대로 대응한다. 도함수의 내부 부호 구간 A~C, C~E, E~G에 각각 −,+,−를 붙였다. 바깥쪽 + 부호와 극대·극소는 캡션에 기록했다. 원본에서 주어지지 않은 y값, 방정식, x좌표 또는 임의의 점 위치는 만들지 않는다.

검증 상태: 세 JSON 파일의 문법 파싱과 원문 바인딩 검사를 수행했다. item.json의 경로·ordinal, STATUS.md의 정확한 문항·정답·해설 인용이 로컬 source-exact.js와 일치했고, Q22 sourceQuote도 문항 원문과 일치했다. 이는 입력 파일 점검만 확인한 결과다. 복사된 number-line 순수 함수의 직접 import는 `preparation-22-hyocheon-math2/pipeline-core/canonical.mjs` 누락으로 함수 실행 전에 중단되어 number-line model/expand 검증은 NOT_RUN이다. Q22 solid plan validator도 NOT_RUN이다. engine/production validation, renderer, browser/visual QA, prepare/build, 원격 보존 및 handoff는 NOT_RUN이다. DRAFT_ONLY이며 개별 JSON/인용 점검을 넘어서는 PASS 또는 READY 판정이 아니다. 원본, engine, ledger, assets, 이전 drafts와 harness는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `811a47a009cd81317ae37a163211b4e8a750ac0a7f1b189bc8ca225bde48844c`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
