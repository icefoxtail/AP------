22 팔마고 고2 수학II Q09 입력 초안.

원문 바인딩: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js` ordinal 9; main commit `dce7678719f1a449ad3d26822614c953bf2c25b4`; exact source blob `22a11aa09876ce20f7135d11fb6079a7c496222a`.
시각화 사유: 수직선은 허용되는 매개변수 k의 정확한 범위 (0,2]를 나타내며, k=2 점을 경계 사례로 따로 표시한다.

원문 인용(정확, 문항):

9. $x \ge 0$일 때, 부등식 $2x^3-3kx^2+8 \ge 0$이 항상 성립하도록 하는 양수 $k$의 최댓값은? [4.2점]

원문 인용(정확, 정답): ②

원문 인용(정확, 해설):

$x\ge0$에서 $g(x)=2x^3-3kx^2+8$의 최솟값이 $0$ 이상이어야 한다.
$g'(x)=6x^2-6kx=6x(x-k)$이고 $k>0$이므로 $0<x<k$에서 감소, $x>k$에서 증가한다.
따라서 $x\ge0$의 최솟값은 $x=k$에서 $g(k)=2k^3-3k^3+8=8-k^3$이다.
$8-k^3\ge0$에서 $0<k\le2$이므로 최대는 $\boxed{2}$, 정답 ②이다.
① $1$도 조건을 만족하지만 최댓값이 아니다. ③ $3$, ④ $7$, ⑤ $5$는 $x=k$를 대입하면 음수가 되어 항상 성립하지 않는다.

수학 입력 요약: k>0일 때 g′(x)=6x(x−k)이므로 0<x<k에서 감소하고 x>k에서 증가한다. 따라서 x≥0에서 최솟값은 g(k)=8−k³이다. 8−k³≥0이므로 0<k≤2이고 최댓값은 k=2이다. 경계 k=2에서는 g(0)=8, g(2)=0이다.

검증 상태: DRAFT_ONLY. exact source 파일의 Git blob SHA-1은 `git hash-object --stdin`으로 예상값과 일치함을 확인했다. 원문 문항·정답·해설 인용은 source-exact.js의 해당 ordinal 레코드에서 직접 가져왔다.

정적 계약 보정: Q09 SET 행 라벨을 `허용 k`로 줄이고, 단일 점만 있는 중복 POINTS 행을 제거했다. 닫힌 오른쪽 끝점 2와 캡션으로 k=2 경계를 나타내며 수학은 바꾸지 않았다.

작성자 정적 검사: 여섯 문항 모두 item/plan/publish JSON 파싱 PASS, sourcePath/ordinal 바인딩 PASS, publish alt/caption nonempty PASS. 이는 capability 또는 수학적 검증을 뜻하지 않는다. pure graph_framing fit, capability/semantic 검사, 입력 수학 독립 점검은 NOT_RUN이며 독립 checker sweep 대기 중이다.

아직 수행하지 않은 단계: production engine validation, renderer/SVG/PNG, 브라우저·시각 검수, prepare/build/handoff, 독립 전체 수학 검토, 원격 보존·게시 확인 및 CI는 NOT_RUN. DRAFT_ONLY이며 READY 또는 게시 완료 판정이 아니다. 원본 시험지/해설/자산, engine, harness, ledger는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `0f027d2f2b26c1a2c2957b1347c7e6e6ae3f9836aa0de24758cccc32b8ea6365`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, expandNumberLineFigure=PASS, top_level_sourceQuote_policy=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- 첫 실제 검사에서 NUMBER_LINE_ROW_LABEL_INVALID가 발생했다. 라벨을 허용 k로 줄이고 경계를 중복 표시하던 단일 POINTS 행을 제거했다. 올바른 열린0·닫힌2 SET 행을 유지한 현재 입력의 재검사는 PASS다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
