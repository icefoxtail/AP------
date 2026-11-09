# AP Math 해설 그림 SVG — 인계 문서 (Claude Code 오케스트레이터 → 다음 작업자, 최종 갱신 2026-11-01)

> **Codex 진입점(2026-11-04 사용자 지시):** [HANDOFF_SVG_CODEX.md](HANDOFF_SVG_CODEX.md)를 먼저 읽는다. Codex ROOT가 총괄하고 Terra가 시험지별 제작·수정, 별도 Sol이 독립 검수한다. 이번 Codex 라인에서는 DeepSeek·OpenCode를 사용하지 않는다. 아래 Claude·Sonnet 실행 지시와 Linux 명령은 그대로 적용하지 않으며, 공통 그림 기준과 인계 당시 현황은 계속 참고한다.

다음 작업자는 이 문서 하나로 이어서 일할 수 있다. **읽는 순서: §00(최신 현황) → §0 → §1 → §2(작업 방식) → §3(도구 복원) → §6(남은 일).** 나머지는 필요할 때 찾아본다. 2026-10-26판(Codex·opencode DeepSeek 방식)은 git 이력에 있다. 지금 방식은 이 문서다.

- 그림 작성 규칙 정본: `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`. 본문 `author-guide-body.md`와 계약을 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 합성한다. `tests/author-guide.test.mjs`가 동기화를 검사한다.
- 시험지 마감 원장: `archive/tools/geometry-equation/production/exam-figure-ledger.json`
- 캠페인 도구·지시서·현황 메모: `archive/tools/geometry-equation/ops/svg-m1/` (§3에서 `.tmp/svg-m1/`로 복원해서 쓴다)
- 엔진 정답지(골든): `archive/tools/geometry-equation/ops/golden.manifest.json` + `ops/golden/itemNN/`

> **2026-10-31 이후 엔진 빈틈 완성 라인(G1~G11).** 사용자 지시: 엔진 부족한 부분을 실제 기출 샘플로 하나씩 완성하고, 완성한 샘플 그림은 시험지에 게시까지 한다. 고등 우선, 샘플은 최신 연도(26→25→24). Sonnet 작업자는 한 번에 하나(토큰 절약), 보고는 변경 하나가 끝날 때 한 번.
> - **엔진 지시서를 쓰기 전에 `ops/svg-m1/BRIEF_RULES.md`(실패 기록과 지시서 규칙)를 반드시 읽고 `ops/svg-m1/briefs/engine-gap-template.md`로 쓴다.** 남은 한계는 "한계"로 끝내지 말고 후속 묶음으로 이어서 맡긴다.
> - 빈틈 목록·샘플: `ops/svg-m1/gaps.md` 아래 G1~G11 절. 진행(2026-11-01): G7·G7b·G7c·G9·G1·G5·G5b·G6·G6b·G6c·G11·G3·G2(a·b·c)·G4a main 반영(#1065~)과 샘플 게시. 남은 빈틈: §00 참고. G4 공간도형(고2, L) → G8 속 빈 원기둥·원뿔대 전개도(중1, M) → G10 내접 혼합 입체(중1, L).
> - Linux 클라우드 컨테이너에서 렌더 의존성 복원: `GEOMETRY_PYTHON=python3 node archive/tools/geometry-equation/production/setup-spikes.mjs`(→ `.tmp/apmath-visual-engine/dependencies`), Chrome은 `GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`. 첫 엔진 병합 전 main으로 정답지 전체를 렌더해 기준(`.tmp/svg-m1/golden-main/`)을 만든다(약 70분).
> - 정답지 회귀는 평소 표본, 전체는 main PR 직전·공용 파일 수동 충돌 병합 때만(§00, BRIEF_RULES 규칙 10). G3 지시서 `ops/svg-m1/briefs/engine-g3-vectors.md`.
> - G11 지시서·검수 지시서 예: `ops/svg-m1/briefs/engine-g11-callout-coord-angle.md`, `ops/svg-m1/briefs/review-g11.md`.
> - Windows PC에서 도구 복원 시: `/home/user/AP------` 경로를 실제 체크아웃 경로로, `python3`를 `python`으로 바꾸고, Chrome은 설치된 것(`channel:'chrome'`), playwright는 `.tmp/apmath-visual-engine/dependencies/node_modules/playwright`를 직접 require, 동적 import 경로는 `file:///C:/...`.

---

## 00. 최신 현황과 다음 할 일 (2026-11-03, 먼저 읽기)

### 2026-11-09 엔진 확장 회차 a(별도 Sonnet 라인, 브랜치 engine/ext-20261109-a)
- **축 눈금 분수 세로분수:** `axisTickValues`의 분수 문자열(`"2/5"`, `"4/35"`)이 빗금이 아니라 세로분수로 그려진다(`visual_engine/engine.py` 눈금 라벨 `tex`). 확률밀도처럼 납작한 그래프의 세로 확대는 새 기능 없이 기존 `graphPlan.axisScale:{"x":1,"y":10}`로 된다(골든 `item130ext1probdensity`, 22 효천 확통 기말 q24; 사용법은 가이드 G18c 덧붙임 아래 단락). 지시서 `ops/svg-m1/briefs/engine-tick-fraction-stacked.md`.

### 2026-11-09 엔진 확장 회차 b(브랜치 engine/ext-20261109-b)
- **MATH 지시선 글자 확장:** `overlays.callouts` MATH 글자 20자, 쉼표·아래첨자 `A_1`·`/` 분수(통째 괄호는 세로분수에서 생략). 관측기 `_ov_label_codes`가 `_`와 통째 분수 괄호를 건너뜀(골든 `item131ext2callouts`).
- **글꼴 통일(사용자 최우선 지시):** 한글 없는 축 이름(`y`·`g(y)`·`y(km)`)·곡선 이름(`f(x)`)·지시선 글자는 수식 글꼴, 한글이 있으면 한글 글꼴. 전수 조사표와 남은 TEXT 라벨은 `ops/svg-m1/briefs/engine-font-unify.md`. 골든 `item62j`의 y축 이름만 글꼴이 바뀜(나머지 글 조각·선 바이트 동일).
- **곡선 이름 변수 `nameVariable`**(구간별 다항): `g(y)`(골든 `item130ext1probdensity`). 남은 것: 유리함수 조각 구간 불연속(`PIECEWISE_DISCONTINUITY_UNDECLARED`, 24 효천 고1 Q14)은 패밀리 확장 필요. 지시서 `ops/svg-m1/briefs/engine-callout-math-namevariable.md`.

### 2026-11-09 엔진 확장 회차 d(브랜치 engine/ext-20261109-d)
- 한글+영문 혼합 축 이름(`x(분)`)이 변수만 수식 글꼴(`typography.mjs` MIXED), 통계 패널의 영문 축 이름·범례·계열 이름이 수식 글꼴. 24 효천 고1 q14(절댓값 유리함수)는 새 패밀리 없이 `multi-curve` `RATIONAL abs:true`로 그려짐(골든 `item134ext4q14abs`). `GEOMETRY_WORKER_TIMEOUT_MS`는 0 초과 600000 이하만 사용. 설계표 `briefs/engine-font-unify.md` 4회차.

### 2026-11-09 엔진 확장 회차 f(브랜치 engine/ext-20261109-f, 지시선·plan으로 안 풀리는 것만)
- 구간별 다항 `regions`가 기약 삼차 조각의 구간 **밖** 실근 때문에 `PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`으로 거절되던 것을, 구간 안 실근 수를 스투름으로 세어 0이면 통과하게 함(`graph_framing.py` `_pp_real_roots_inside`, 22 금당 수II q18, 골든 `item138ext6q18cubicarea`, 지시서 `briefs/engine-region-cubic-no-root-inside.md`). 나머지(q02·q19·q21·COORDINATE_LEADER_PANEL_CONFLICT)는 plan 수정으로 풀려 엔진 변경 없이 AUTHOR_GUIDE에 사용법만 남김(골든 `item139ext6q21hidelabels`).

### 2026-11-09 엔진 확장 회차 e(브랜치 engine/ext-20261109-e, 생산 라인 UNSUPPORTED 대상)
- 점 지시선이 점근선(`asymptote-*`·`rational-asymptote-*`)을 가로질러도 된다(`label_layout.py` `LEADER_MAY_CROSS_ASYMPTOTE`, `verify-rendered-layout.mjs` 예외). 24 효천 고1 Q14 교점 `(7/5,2)` 지시선이 놓임(골든 `item136ext5q14crossing`). 20 매산고 확통 Q05 확률밀도는 기존 `axisScale`+문자열 눈금으로 됨(골든 `item137ext5q05density`, 엔진 변경 없음). 지시서 `ops/svg-m1/briefs/engine-leader-cross-asymptote.md`.

### 2026-11-09 엔진 확장 회차 c(브랜치 engine/ext-20261109-c)
- 지시선 글자의 그리스 문자·`′`·`√`도 수식 글꼴(수식 파서 `√`·`′`, 관측기 글리프 대조 보강, 골든 `item132ext3greek`). 대응도·벤다이어그램의 집합·원소 이름(`A`, `10`, `AB`, `f(x)`)도 수식 글꼴(`set-diagram-v1.mjs` `labelMath`). 통계 패널 영어 라벨과 구간 불연속 선언(유리 조각)은 남음(`briefs/engine-font-unify.md` 3회차 표). 렌더 중 `WORKER_TIMEOUT`이 나면 `GEOMETRY_WORKER_TIMEOUT_MS=90000`.

### 2026-11-02~03 세션: 25·24 2학기 기말 묶음 ①~④ 끝 (사용자 지시 "고2 각 과목별까지")
- **끝낸 묶음:** ① 25 중2 + 24 중1·중2, ② 25·24 중3(#1230), ③ 25·24 고1(11개 시험지), ④ 25·24 고2 수학II·확률과통계(11개). ③④는 22개 시험지 중 16개 CLOSED, 해설 그림 PUBLISHED 303·EXEMPT 192·OPEN 6. 1~4차로 나눠 게시했다(검수 FAIL은 엔진을 넓힌 뒤 다시 그림).
- **엔진 묶음(모두 이 PR):** G17 대응도 부호 있는 수·열 원소 수 차이·화살표 이름/색·합성 경로, 벤 서로소·3단 포함(item112g17) / G18a 음수 계수 유리함수 틀, multi-curve에 유리·무리·직선·역함수(inverseOf), hideLabels·formulaTex, 구간 강조(item113g18a) / G19 정규분포 문제 표 값 라벨(source TABLE), 좁은 꼬리 지시선 라벨, 정규곡선 합성 패널, σ 비 10, 수직선 소수(item114g19) / G18b 등축척 equalUnits, 무리함수 overlay 직선·점, callout 6개·√·그리스 문자, multi-curve 라벨을 자기 곡선·점근선 옆에(item115g18b) / G18c multi-curve 영역 색칠(between·under·halfPlane)·절댓값 곡선·axisScale 틀과 분수 눈금·callout 지시선 축 통과·셋째 곡선 라벨 탐색·라벨 탐색 가속 12s→0.6s(item116g18c). 정답지 표본 합집합 44개: 기존 39개 main과 바이트 동일, 새 5개 렌더 통과.
- **남은 OPEN 6:** 24 효천고 고1 q14(점근선 라벨이 점 좌표처럼 읽힘), 25 제일고 고2 확통 q22(3갈래 수형도 라벨 겹침), 25 강남여고 고2 수학II q13(referenceCurves 이름 지시선), 25 제일고 고2 수학II q14(referenceLines 라벨 자리), 25 매산고 고2 q16(사차 큰 극값), 25 매산여고 고2 q23(3·4차 p+q√r). 상세·후보는 `ops/svg-m1/gaps.md` "G18c 이후 남은 공백".
- **고친 데이터:** 25 순천고 고1 q23 SVG desc의 `<` 이스케이프, 25 강남여고 고2 확통 solutionImage 경로 `archive/assets/`→`assets/`, 같은 시험지 q7 해설 문장. 25 매산고 고2 수학II q10 발문("x≥1일 때 … 모든 실수 x에서")은 모호하지만 해설·정답이 x≥1 기준으로 일관돼 두었다(`.tmp/svg-m1/data-issues.md`).
- **가이드 발췌 고침:** `ops/svg-m1/slice.py`의 graph 발췌가 3-2·3-14·3-50만 담아 작업자가 multi-curve(3-40)·두 함수(3-6)·영역(3-6-영역) 절을 못 봤다. graph에 3-3~3-7·3-13·3-15·3-40, plane에 3-9-색·3-17·3-45, stat에 3-12를 넣었다. 엔진 병합마다 `slice.py`로 `ops/svg-m1/guide`와 `.tmp/svg-m1/guide`를 둘 다 재생성한다.
- **판단 기준(메인, 2026-11-03):** 범위·최솟값 문제의 경계 곡선·직선(k=−1, k=−2와 접선 등)은 풀이 핵심 단계라 그림에 둔다. 정답 값 자체(점근선 값이 곧 답, 교점이 곧 답)만 숨긴다(hideLabels). 이유: 경계를 숨기면 해설 그림이 풀이를 보여 주지 못한다.
- **다음 할 일:** ⑤ 23 중1·중2 → ⑥ 23 중3·고1 → ⑦ 23 고2, 그다음 G14(중1 위치관계). 엔진 공백은 쌓이는 대로 G18d 등 작은 묶음으로 바로 넓힌다(사용자 지시 2026-11-02).
- **나중 후보(사용자 대화 2026-11-03): 문항 그림 "문항 모드".** 문항 생성(ALIVE Generated·유사문항)에서도 이 엔진으로 문제 그림을 만든다. 본문 수치와 그림 불일치를 plan 식·관측기 대조로 막고, 문항·해설 그림을 같은 plan에서 만들어 이름·좌표를 일치시킨다. 챙길 것: 정답·풀이 실마리 누출 금지, "그림은 정확하지 않다"용 비율 옵션, 흑백 인쇄 스타일, 원본 문제 그림 배치 따르기. 설계 메모 `ops/svg-m1/notes/DESIGN-question-mode.md`(사용자가 확장 때 기억하라고 지시).


### 이번 세션(2026-10-31~11-01)에 끝낸 것 — 모두 main 반영
| 묶음 | 엔진 | 게시한 해설 그림 |
|---|---|---|
| G11 (#1094·#1095) | 좌표 그림 끌어내기, 각 끌어내기 호 비례·각 치수선, 좁은 꼭짓점 경로 라벨 | 25 팔마고 고1 q9, 26 왕운중 중2 q8 |
| G3 (#1099) | 벡터 이름 `vec(a)`, `planeMarks.vectors`, `vectorOps`(합·차·실수배) | 23 매산고 기하 q5·q12, 15 강남여고 q10 |
| G2a (#1110) | `conic` 포물선(초점·준선·교점·수선의 발) | 26 제일고 q2, 26 매산고 q15 |
| G2b·G2c (#1120) | 쌍곡선·점근선, 접선 판별식·외부 점 접선, 원·타원·`conics` 곡선 2개·곡선 이름 | 26 매산고 q13, 26 제일고 q12, 26 금당고 q13 |
| 중간값 복원 (#1125) | conic 점 좌표 라벨 `coordinates:true` | 위 그림 9장을 해설 중간값 넣어 다시 그림(정답은 캡션) |
| G12 (#1173) | 그래프 `overlays.callouts`(점에서 지시선 라벨, 한글 가능, 4개까지), `requiredPoints[].marker:"NONE"`, 선·다각형·곡선 색(BLUE·WARM), 분수 길이, 점 이름 `(2,k)`, `nameLabel{at,side}`, `axisVariable`. 정답지 140개 바이트 동일, 새 정답지 item103g12~106g12 | 매산여고 고1·금당고 기하·금당고 미적분I, 제일고 미적분I q11 등 7장 재렌더 |
| G13 (2026-11-02, 이 PR) | G13a 그래프 `overlays.rightAngles`·`angles`·`equalAngles`(정확한 수직·같은 각만, 같은 단위 그래프), `graphPlan.verticalAsymptoteLabelAt`(TOP/BOTTOM_LEFT/RIGHT·NONE), 근호 길이 라벨 관측 수정; G13b Venn `sets[].count/countUnit`·`universe`·`countStyle`, composite-panels-v1 안 Venn 패널 2~4개; G13c 조각 그래프 12조각·overlays 점 12, 수형도 확률 1 단일 가지, `planeMarks.arcs[].color`. 정답지 item107g13b·108g13c·109g13a | 강남여고 고1 q15·16·20, 팔마고 고1 q20, 매산여고 고1 q11·13, 팔마고 고2 미적분I q15·20, 순천고 확통 q20·23, 강남여고 고2 미적분I q8·16·20, 매산고 고2 미적분I q15 |
| G4a | 입체 보조점 `divide`·`midpoint`·`centroid`·`footOnLine`·`projection`(한도 10) | 22 매산고 기말 기하 q11 (q13은 기존 단면 그림이 더 명확해 유지) |

### 바뀐 규칙 (반드시 따른다)
- **그림 안에는 풀이 핵심 단계에 꼭 필요한 중간값만, 정답은 캡션(과 alt)에 따로**(§1 규칙 5, BRIEF_RULES 11). 너무 많은 정보 금지. 최종 정리는 메인이 PNG를 보고 판단.
- **정답지 회귀 기준(사용자 결정 2026-11-02, BRIEF_RULES 10):** 작업자는 표본(바뀐 코드가 그리는 항목 10개 안팎 + 새 항목). 묶음을 합친 뒤에는 각 묶음 표본의 합집합만 합친 코드로 한 번(30~40개, 약 25분, `ITEMS="..." full-golden.sh origin/main <절대경로 out>`). **전체 회귀는 하지 않는다**(사용자 요청 또는 렌더러 공용부를 옵트인 아닌 방식으로 바꿨을 때만). 이유: 전체 회귀는 매번 모두 통과했고 70~100분만 들었다는 사용자 지적.
- **생산 순서(사용자 지시 2026-11-01, 앞서 적은 "두 줄 체제·병렬 5~7"을 대신함):** 해설 그림은 **2026년 시험지부터 최신 학기 역순으로 시험지 하나씩** 마무리한다(2학기 중간 → 1학기 기말 → 1학기 중간, 학년 섞음; 한 시험지 안의 plan 묶음 2~3개는 동시에). 막히는 문항은 그 자리에서 작은 엔진 묶음으로 고쳐 그 시험지를 닫는다. 남은 G 라인은 시험지에서 필요해질 때 한다. 장기 작업이다. 이유: 시험지 단위로 확실히 끝내고, 엔진은 실제 막힌 문항으로 넓히는 편이 낭비가 적다.
- **관계는 색으로 묶는다(사용자 지시 2026-11-01, 적극 권장).** 같은 크기의 각, 같은 길이의 선분, 평행선, 닮음·합동의 대응변, 넓이가 같은 영역, 합동인 도형은 C1 색 묶음으로 같은 색을 준다: 영역 `fill`(BLUE·WARM·GREEN·ROSE·VIOLET)과 `equalAreas`, 각 `equalAngles[].color`·`angles[].color`, 선분 `segmentColors`·`equalLengths[].color`·`parallels[].color`(가이드 3-9-색 절). 묶음은 핵심 2~3개, 주로 BLUE·WARM. 기준은 화면(폰·패드·모니터)에서 또렷하게 보이는 것이다(학생은 폰에서 확대해 본다; 인쇄는 부차). 이유: 해설 그림의 핵심은 "어느 것과 어느 것이 같은가"이고, 색으로 묶으면 한눈에 보인다(26 신흥중 q8 나비 날개).
- **중복 금지(사용자 지시 2026-11-01):** 시험지마다 시작 전에 `python3 .tmp/svg-m1/exam-status.py <시험지 이름>`으로 원장 상태, 이미 해설 그림이 있는 문항, 최근 3주 커밋(다른 세션 작업)을 본다. CLOSED는 건너뛰고, 이미 그림이 있는 문항은 아래 "기존 그림 올리기"로 판정한다. 다른 세션이 원장에 적지 않고 게시한 그림도 있다(예: 26 매산고 2학기 중간 미적분I q15). 이유: 같은 그림을 두 번 만들지 않는다.
- **기존 그림 올리기(사용자 지시 2026-11-01):** 연도 순서대로 가면서 그 연도의 기존 해설 그림도 새 기준(중간값·색 묶음·풀이 방식·끌어내기)으로 올린다. 아주 옛 연도는 약해도 두고 나중에 고친다. 메인이 시험지의 기존 SVG를 모두 모아 문제 그림 옆에 놓고(`pairsheet.py`) 직접 본 뒤, 괜찮은 문항은 통과시키고 약하거나 틀린 문항만 작업자에게 다시 그리게 한다(교체는 rows에 `"replace":true`). 출처로 기본값을 정한다: 채팅에서 사용자가 자주 검수한 그림(고1 도형의 방정식·원의 방정식 골든 표본 등)은 기본 유지, AI 자동화 라인에서 만든 그림은 새 기준으로 엄격히 본다. 이유: 자동화 라인 그림은 중간값·풀이 방식이 빠진 것이 많고(26 신흥중에서 확인), 사용자 검수 그림은 이미 기준에 가깝다. 그래도 전부 한 번은 본다.
- **헷갈리는 점·빠진 라벨은 지시선부터(사용자 지시 2026-11-01).** 점을 지우거나 값을 캡션으로 미루거나 엔진 대기로 넘기기 전에, 그 점에서 지시선을 빼 라벨을 단다(극점 "극대"·"극소", f(a), (2,k) 등). 이유: 웬만한 경우는 지시선으로 해결된다. 지시선으로도 안 될 때만 엔진 확장 후보로 적는다.
- **점 이름은 안쪽, 길이 치수선은 바깥(사용자 지시 2026-11-02).** 한 선분·직선 위에 점 이름과 길이 치수선이 함께 있으면 점 이름을 선 바로 곁(안쪽)에 붙이고, 치수선은 그보다 바깥에 둔다. 치수선이 여러 개면 짧은 것이 안쪽, 긴 것이 바깥으로 층층이(offset을 점점 크게) 놓고 서로 겹치지 않게 한다. 가능하면 이름은 선의 한쪽, 치수선은 반대쪽에 모은다. 점 이름이 치수선 바깥에 있거나 치수선과 선 사이에 이름이 끼어 어느 것이 이름이고 길이인지 헷갈리면 실패다. 이유: 26 강남여고 고1 q15 중심선 패널에서 O₂·Q가 "9" 치수선 바깥에 놓여 학생이 헷갈린다는 사용자 지적. 지시서 반영: `briefs/plan-current.md` 9, `review1.md`, `deepseek-addendum.md` 11.
- **입력용 표기 금지(사용자 지시 2026-11-02).** 학생이 보는 글자(패널 제목·라벨·원소 글자·캡션)에 `^c`, `^2`, `sqrt`, `*` 같은 입력용 표기를 그대로 쓰지 않는다. 수식 필드(math)로 위첨자·근호를 제대로 쓰고, 그 자리가 글자(text)만 받으면 같은 뜻의 식으로 바꾼다(예: A∩Bᶜ → A−B). 이유: 26 강남여고 고1 q16 패널 제목 "A∩B^c"를 학생이 B의 여집합으로 읽기 어렵다는 사용자 지적.
- **지금 엔진으로 그리지 않은 해설 그림은 웬만하면 다시 그린다(사용자 지시 2026-11-02).** 옛 자동화 카드형 그림(그림 안 정답, 떠 있는 글상자, 비율 안 맞는 장식 도형)은 학생에게 허접하다는 지적. 찾는 법: 시험지 JS가 참조하는 `*-solution*.svg` 앞 4000자에 ` data-` 속성이 하나도 없으면 엔진 밖 그림이다(엔진 출력은 단일·합성 모두 data- 속성이 있다). 2026-11-02 기준 247개 시험지·1239장. 기존 그림 재검 때 pairsheet로 보되, 엔진 밖 그림은 KEEP보다 REPLACE를 기본으로 한다(그림이 필요 없는 문항이면 EXEMPT로 빼고 옛 그림 제거).
- **연속 진행(사용자 지시 2026-11-02):** 시험지가 끝나면 사용자 지시를 기다리지 않고 다음 시험지(아래 "다음 할 일" 순서)로 이어 간다. 엔진 대기 문항은 막지 말고 원장 OPEN_UNSUPPORTED로 남긴 채 다음 시험지로 간다. 엔진 확장 후보(G13 등)가 충분히 쌓이면 그때 한 번 사용자에게 "이 묶음을 해도 되는가"를 묻고, 승인받은 뒤 엔진 작업을 한다. 이유: 시험지 생산은 메인이 자율로, 시간이 큰 엔진 확장은 사용자가 정한다.
- **시간 보고:** 시험지마다 시작(packet 생성)부터 CLOSED까지 걸린 시간과 단계별 시간을 보고하고 `timing.jsonl`에 남긴다. 엔진 확장 시간은 따로 적는다.
- **메인(오케스트레이터)이 할 일**은 루트 `CLAUDE.md` "메인이 할 일" 7가지와 §2.1. 핵심: 보고를 믿지 말고 PNG를 직접 보고 해설·정답과 대조, 융통성 있게 판단, 지시가 바뀌면 진행 중 작업자와 문서에 즉시 반영.

### 일하는 순서 (이번 세션에서 굳어진 방식)
1. 읽기 전용 조사(Explore, `model: sonnet`) — 코드 위치·기존 규칙 충돌·최신 샘플.
2. 메인이 샘플 문항의 solution을 직접 읽어 **핵심 중간값 목록**을 뽑고, `briefs/engine-gap-template.md` 형식으로 지시서(`.tmp/svg-m1/briefs/`)를 쓴다. 예: `ops/svg-m1/briefs/engine-g4a-solid-space-points.md`.
3. 수정 작업자(`model: sonnet`, `isolation: worktree`). 작업자 브랜치에서 엔진 커밋 + 게시 커밋까지 하게 하면 PR이 하나로 준다.
4. 메인이 PNG를 직접 본다 → 부족하면 같은 작업자에게 SendMessage.
5. 다른 Sonnet 검수자(바뀐 부분만, 정답지 표본 2~6개).
6. 메인이 `ccr-…`(지정 작업 브랜치)로 작업자 브랜치를 merge → push → PR → 바로 merge → main readback.

### 시험지별 진행 (2026 2학기 중간, 2026-11-01 기준)
- CLOSED: 신흥중 중2(#1155), 삼산중 중3(#1159, q19 정답 ①→④), 팔마중 중3(#1162, q8 해설 수정), 순천여고 고2 미적분I(#1163·#1173), 제일고 고2 미적분I(#1165·#1173), 제일고 고2 확통(#1167), 왕운중 중3(#1171, q16 정답 ③→①), 금당고 고2 미적분I(#1173).
- 거의 끝(엔진 대기만 남음): 효천고 고2 미적분I(#1170; q7 세로 점근선 라벨·y축 이름, q21 UNSUPPORTED), 매산여고 고1(#1173; q11 집합 composite UNSUPPORTED, q13 집합 개수 보류, q2·q18 기존 그림 유지), 금당고 고2 기하(#1173; q5 이차곡선 라벨 자리 보류, q19 기존 그림 유지), 팔마고 고1(9장 게시, q17·18·21 교체; q20 벤다이어그램 집합별 개수 라벨 엔진 대기, 원장 OPEN_UNSUPPORTED), 강남여고 고2 미적분I(9장 게시, q16·20·25 교체; q8 세로 점근선 라벨·q12 5차 곡선 엔진 대기), 매산고 고2 미적분I(10장 게시, q15 교체; q20 무리수 기울기 접선 식 라벨 숨김 엔진 대기), 팔마고 고2 미적분I(4장, q20 교체; q15 주기 꺾은선 조각 10개 엔진 대기).
- CLOSED 추가(2026-11-02): 순천고 고2 확통(q20·23 G13 재작도), 팔마고 고1(q20 Venn 개수), 매산여고 고1(q11·13 Venn), 강남여고 고1 공통수학2(q15·16·20), 팔마고 고2 미적분I(q15 12조각).
- G13 뒤 남은 엔진 대기: 강남여고 고2 미적분I q12(5차 곡선), 매산고 고2 미적분I q20(무리수 접선 확대 패널·callout √; 기존 그림 유지). 효천고 고2 미적분I q7은 `verticalAsymptoteLabelAt`으로 이제 그릴 수 있다(다음에 처리).
- 기존 그림 재검: 강남여고 고1 공통수학2(옛 자동화 그림 17장 교체+q21 추가, q1·q2 유지; q15 작은 원 라벨·q16 집합 composite 엔진 대기).
- 26 왕의중 중2: 원본 문제 그림이 없어 데이터 대기.
- 시험지당 시간: 새로 그리는 시험지 20~30분, 기존 그림을 대부분 교체하는 시험지 40~50분. 기록은 `timing.jsonl`(`.tmp/svg-m1/`).

### 다음 할 일 (권장 순서)
- **순서 변경(사용자 지시 2026-11-02):** 2학기 기말고사가 다가오므로 **2학기 기말 시험지를 최신 연도부터** 업그레이드한다: 25 → 24 → 23, 각 연도 안에서 중1 → 중2 → 중3 → 고1 → 고2. 시험지마다 그림 빠진 문항 판정과 엔진 밖 옛 그림 교체를 함께 한다(2026-11-02 기준 25: 31개 시험지·옛 그림 98장, 24: 17개·107장, 23: 29개·82장). 진행 중이던 26 금당고 고1은 마치고 넘어간다. 그다음이 중1 위치관계 업그레이드(G14: 입체 모서리·연장 직선 색 `segments[].color`·`space.lines[].color`, 입체 패널 제목, 진위형 EXEMPT 7문항 되살리기와 26 신흥 q17 등 약한 반례 그림 교체; 조사 `.tmp/svg-m1/surveys/m1-position-relations.md`, 실험실 `apmath/playground/next/labs/g7-spatial.html` 색 규약 l 노랑·m 보라·n 분홍·P 초록). 이유: 시험 대비 수요가 큰 곳부터, 위치관계는 계획만 두고 뒤로(사용자).
- **그림 형태별로 묶어 맡기기(사용자 지시 2026-11-02):** 여러 시험지를 한꺼번에 판정한 뒤, 단원이 아니라 **그림 형태**(입체·평면 작도·좌표 그래프·통계 차트·수직선·집합 등 capability 기준)로 문항을 모아 같은 작업자에게 한 번에 맡긴다. 문제 그림이 없는 좌표 그래프·수직선 묶음은 DeepSeek, 문제 그림을 봐야 하는 묶음은 Sonnet. 게시는 pubflow에 여러 시험지를 함께 넘긴다. 이유: 같은 형태는 plan 구조·필드·함정이 같아 한 작업자가 이어서 하면 빠르고 결과가 고르다(사용자).
- **정답·해설 오류는 보류하지 않고 고친다(사용자 지시 2026-11-02):** 판정·그림 작업에서 저장 정답이나 해설이 문제 그림·본문과 맞지 않으면(CONTENT) 원본 확인을 기다리지 말고 문제 그림·본문 기준으로 정답을 정확히 구해 정답·해설을 고치고 해설 그림까지 새로 그린다. 고친 근거(그림에서 읽은 값, 계산)를 커밋 본문과 data-issues에 남긴다. 보기 중 답이 없거나 둘 이상이면 고치지 말고 그 사실을 보고한다. 이유: 학생이 틀린 정답·해설로 공부하게 두지 않는다(사용자).
- **한 묶음 약 10개 시험지, 연도 섞기 허용(사용자 지시 2026-11-02):** 한 학년·연도의 시험지가 적으면 연도별로 끊지 말고 같은 학년의 25·24(필요하면 23)를 합쳐 약 10개 시험지씩 한 묶음으로 판정·작업·게시한다. 순서: ① 25 중2 4 + 24 중1 4 + 24 중2 2 ② 25 중3 5 + 24 중3 4 ③ 25 고1 6 + 24 고1 5 ④ 25 고2 9 + 24 고2 2 ⑤ 23 중1 3 + 23 중2 5 ⑥ 23 중3 5 + 23 고1 3 ⑦ 23 고2 13. 이유: 시험지 하나씩(120~134분)보다 형태별 7개 묶음(53장 약 66분)이 빨랐고, 묶음이 작으면 게시·검사 고정 비용이 커진다(사용자).
- **(끝남 2026-11-03) 2026-11-02 밤 목표(사용자 지시): ③ 고1·④ 고2(과목별 전부)까지 마치고 쉰다.** ⑤~⑦(23년)은 그다음. 이유: 사용자가 오늘 밤 종료 지점을 고2로 정했다.
1. (끝남) 2026 2학기 중간, 기존 그림이 일부 있는 시험지.
2. **엔진 밖 옛 그림 교체(위 규칙):** 2026부터 — 금당고 고1(13, 진행 중), 매산고 고1(14), 복성고 고1(14), 강남여고 고2 대수 1학기 2차(q12·20), 금당고 고2 기하 q19, 금당고 고2 미적분I q3·q10, 동산중 중2 1학기 중간(q19·20·24), 왕운중 중3 1학기 중간 c q13. 그다음 2025 이전은 최신 학기 역순.
3. 그다음 2026 1학기 기말 → 1학기 중간 → 2025 …
4. **(G13 끝남, 2026-11-02; 지시선으로 풀리는 문항은 먼저 빼고 했다.) 다음 묶음 후보는 `gaps.md` "G13 이후 남은 공백"; 쌓이면 사용자에게 먼저 묻는다.** 옛 후보 목록: — 2026-11-02 추가 후보: 그래프 직각·같은 각 호(강남 미적분 q16·20, 매산 미적분 q15), 그래프 세로 점근선 라벨 위치(강남 미적분 q8), 무리수 기울기 접선 식 라벨 숨김(매산 미적분 q20), 5차/주기 꺾은선 조각 수(강남 미적분 q12, 팔마 미적분 q15), 수형도 확률 1 단일 가지, 호 색(순천 확통 q20), 지시선이 축과 겹칠 때 자리 찾기·근호 길이 라벨(강남 고1 q20, 팔마 미적분 q20), 작은 원 주변 라벨(강남 고1 q15), 벤다이어그램 개수 라벨·여러 패널(팔마 고1 q20, 강남 고1 q16, 매산여고 q11·13). 이차곡선 색·치수선·라벨 자리(`ELLIPSE_LABEL_NO_ROOM`)·그림 창(`ELLIPSE_FIGURE_TOO_LARGE`), 집합 composite 패널·다색·개수(벤다이어그램 집합별·전체 개수 라벨 `sets[].countLabel`: 26 팔마고 고1 q20, 매산여고 고1 q13), 그래프 세로 점근선 라벨, callout 텍스트의 →, 입체 라벨 앵커. 끝나면 위 보류 문항을 다시 그린다. 상세는 `gaps.md` "G12 이후 남은 그래프·집합 공백".
5. 예전 계획의 G4b(평면 α·β)·G4c(이면각)·G4d·G8·G10·G2 잔여는 시험지에서 막힐 때 한다(조사 결과는 `gaps.md` G4 절, 설계 메모 `ops/svg-m1/notes/`).

### 시험지 하나 처리 절차 (도구는 `.tmp/svg-m1/`, §3으로 복원)
1. `python3 exam-status.py <시험지>` — 원장 상태·기존 그림·최근 커밋.
2. 기존 그림이 있으면 `pairsheet.py`로 문제 그림 옆에 놓고 메인이 본다 → 괜찮은 것은 원장에 PUBLISHED(기존 경로·reason), 약한 것만 다시.
3. packet 생성 → 분류·plan 작업자(지시서 `briefs/plan-current.md`, 규칙 1~8) → 렌더(`render-plan.mjs`) → 메인이 PNG를 해설·정답과 대조 → 다른 Sonnet 검수(바뀐 문항만).
4. `python3 pubflow.py "<제목>" "<본문>" EXAM:review.json:rows.json` (rows `[{"ord","A":png,"replace":true}]`; 교체 시 replace) → 지정 브랜치 push → PR → 바로 머지 → main readback.
5. 엔진을 바꾼 PR은 머지 직전에 묶음 표본의 합집합만 합친 코드로 한 번 비교(`ITEMS="..." full-golden.sh origin/main <절대경로 out>`, 출력 경로는 반드시 절대경로 — 상대경로면 모든 항목이 BASE_FAILED로 헛돈다). 전체 회귀는 하지 않는다(위 규칙).
- `pubflow.py`는 현재 브랜치로 push한다(`git push -u origin HEAD`). 커밋의 세션 주소는 환경변수 `CLAUDE_SESSION_URL`로 준다.
- 메인의 진행 메모는 `.tmp/svg-m1/runs/STATE.md`(git 제외)에 두고, 시험지가 끝날 때 이 절을 함께 고친다. 컨테이너가 바뀌면 STATE.md는 사라지므로 이 절이 기준이다.

### 알려진 미해결
- `archive/data/svg-accessibility-manifest.v1.json`·`svg-accessibility-index.js`에 교체 전 옛 해설 SVG 경로가 남아 있다(자동 생성 파일로 추정, 테스트는 통과). 26 매산고 q13 옛 `q13-solution.svg`는 이 참조 때문에 지우지 않았다. 재생성 방법 확인 필요.
- 26 금당고 q13에 옛 `solutionImageStatus` 필드와 `q13-solution.png`가 남아 있다.

### 이번 세션 함정
- 원격 작업 브랜치에 `Archive Registration Sync` 워크플로가 생성 파일 커밋을 올려 push가 거절되면 `git merge origin/<브랜치>` 후 생성 파일 충돌은 `git checkout --ours`(워크플로가 다시 만든다). 이력 재작성 금지.
- 사용량 한도·컨테이너 재시작으로 작업자가 끊기면 워크트리가 남아 있으니 같은 작업자에게 SendMessage로 이어서.
- `ops/tools/hints.mjs` 문자열의 작은따옴표는 `\'` 이스케이프(한 번 main에서 문법 오류가 났다). 수정 후 `node -e "import('./archive/tools/geometry-equation/ops/tools/hints.mjs')"`.
- 지시서에 쓴 기하 사실이 틀릴 수 있다(G4a: 정사면체에서 C의 평면 ABM 위 정사영은 M 자체). 작업자 보고의 "지시서와 다른 점"을 꼭 읽는다.

---

## 0. 한 줄 요약

- **해설 그림 게시:** 중1 기출 2학기 26개 시험지, 중2 기출 2026·2025년 25개 시험지(그림 236개), 고등 143개 시험지를 해설 그림으로 마감했다(원장 `CLOSED`, §5).
- **엔진 확장:** E1~E37로 중학교 평면·좌표·입체·수직선·통계와 정규분포를 그리고, 이어 G 라인(G1·G5·G6·G7·G9 계열, 좌표 그림 끌어내기·각 끌어내기 보강 G11, 평면벡터 G3, 이차곡선 포물선·쌍곡선·타원·접선 G2a~c, 입체 보조점 G4a 등)을 더했다(§00 표, §4.1).
- **남은 일:** 두 줄 체제로 진행한다(§6). 엔진 줄은 G4b 평면 α·β → G4c 이면각 → G4 후속 → G4d 좌표공간 → G8·G10 → G2 남은 것(§00 다음 할 일). 생산 줄은 중2 2024→2023 이전, 중1 미결, 중3, 고등 나머지.

---

## 1. 사용자 지시 (누적, 반드시 지킬 것)

1. **보고는 한국어.** 결과 그림은 사용자에게 보여 준다.
2. **기출만** 대상이다(`archive/exams/original/**`). 문제 그림 자체가 빠진 문항(NO_SOURCE_FIGURE)은 엔진 일이 아니므로 보고만 한다.
3. **최신 연도부터** 한다(26 → 25 → 24 → 23 …).
4. **시험지 단위로 마감한다.**
   - 막힌 문항을 해결한다. 엔진이 못 그리면 기록만 하지 말고 엔진을 확장한다.
   - 게시 → 원장 `CLOSED` → 다음 시험지 순서로 간다.
   - 마감한 시험지는 다시 하지 않는다.
5. **그림 안에는 꼭 필요한 중간값만, 정답은 캡션에 따로(2026-11-01 사용자 지시, 이전 "정답 금지" 폐지).**
   - 해설 그림은 학생이 보고 확인하는 자료다. 해설의 풀이 중간값(길이·좌표·계수·기울기·교점·각)중 풀이의 핵심 단계에 **꼭 필요한 것만** 그림 안에 넣는다. 정보가 많아 그림이 복잡해지면 안 된다. 나머지 값은 캡션으로. 정답(구하는 값)은 그림 안에 넣지 않고 **캡션(과 alt)에 따로** 적는다.
   - 작업자·검수자는 해설에 나온 값을 "정답 노출"이라는 이유로 지우지 않는다. 어떤 값을 넣고 뺄지는 기계적인 규칙이 아니라, 메인이 마지막에 그림을 직접 보고 한 번 더 판단해 정리한다.
   - 문자 미지수는 해설이 값을 구하면 그 실제 값으로 그린다(예시 값 "한 예" 그림 금지). 해설에서도 끝까지 문자인 경우만 문자 이름으로 둔다.
6. **라벨·치수선이 실패하거나 오독될 때는 그 선분·각을 끌어내 따로 크게 그리는 방법을 먼저 쓴다(적극 권장, 2026-10-30).**
   - 엔진 필드는 `planeMarks.callouts`(E37)이다. 입체는 합성 패널로 하고, 같은 점 이름으로 잇는다.
   - 라벨을 지우거나 캡션으로 빼는 것보다 이것이 먼저다.
7. **완료 기준은 "학생이 화면에서 보고 이해할 수 있는가"이다**(CLAUDE.md). 수치 완벽주의는 피한다.
8. **엔진 원칙.**
   - 가짜 지원을 하지 않는다. 못 그리면 오류 코드로 거절한다.
   - 독립 관측기는 같은 입력에서 따로 계산해 최종 SVG를 검사한다.
   - 관측기·테스트를 약하게 만들어 통과시키지 않는다.
   - 기존 정답지 SVG는 바이트 동일을 유지한다. 바뀌면 옵트인 필드로 만든다.
9. **원본 내용 오류는 고친다.** 근거가 확실한 것만 고치고, 불확실하면 `content-queue.md`·`data-issues.md`에 남긴다.
10. **일정 기록:** 시험지별 소요 시간을 `timing.jsonl`(도구 `fixest.py`, `timing-report.py`)에 남긴다.
11. **main 반영:** 작업 브랜치에서 PR을 만들어 바로 머지하고 readback한다. 운영은 main에서 한다.

## 2. 작업 방식 (CLAUDE.md: 메인은 오케스트레이터만)

### 2.1 역할
- **메인(오케스트레이터):** 계획·지시서·결과 확인·병합·게시만 한다. 코드는 직접 고치지 않는다.
- **수정은 Sonnet 서브에이전트가 한다.** Agent 도구에 `model: "sonnet"`을 쓰고, 엔진 작업자는 `isolation: "worktree"`로 띄운다.
  - 그림 plan·fixup 작업자는 `.tmp/svg-m1/runs/` 아래 폴더에만 쓰므로 워크트리가 필요 없다.
- **검수는 다른 Sonnet 인스턴스가 한다.** PASS한 것만 합치거나 게시한다. FAIL이면 같은 수정 에이전트에게 SendMessage로 돌려보낸다.
- **메인이 직접 하는 확인(SVG 라인, 루트 CLAUDE.md "메인이 할 일"의 구체판):**
  1. 묶음 시작: 읽기 전용 조사 → `BRIEF_RULES.md`대로 지시서(기능별 설계, 충돌 연결, 샘플별 해설 중간값 목록) → 작업자.
  2. 작업자 보고 후: 문항마다 **PNG를 직접 보고 시험지 solution·answer와 대조**한다. 학생이 풀이를 따라갈 중간값이 충분한지, 정답은 캡션에 있는지, 라벨이 읽히는지, 기존 그림보다 나은지 메인이 판단한다. 부족하면 같은 작업자에게 돌려보낸다.
  3. 검수 PASS 뒤에도 교체·게시 여부는 메인이 정한다(PASS는 필요조건).
  4. 병합: 엔진·게시·문서를 PR 하나로 묶고, 병합 뒤 main을 읽어 확인한다. 정답지는 표본(규칙 10).

- **그림 작업자 병행: Sonnet + opencode DeepSeek(사용자 지시 2026-11-02):** 바꾸는 것이 아니라 **함께 쓴다.** OpenCode Go 사용량이 남아 있으면 4단계(plan·렌더) 묶음 일부를 DeepSeek(`opencode run`)에 나눠 맡기고 나머지는 Sonnet이 한다. 한도가 다 되면 Sonnet만 쓴다. 어느 쪽이 그렸든 메인 PNG 확인과 Sonnet 검수는 그대로 둔다. 같은 지시서(`plan.md`·`plan-current.md`)를 `opencode run`에 넘기고 산출물도 `runs/` 안으로 같다. 준비(2026-11-02 설정 완료): 환경의 Network secrets에 Bearer 시크릿(허용 웹사이트 `opencode.ai`, 경로 `/inference/go/`, 헤더 `Authorization: Bearer <OpenCode Go 키>`)이 있어 프록시가 키를 붙인다(이번 세션에서도 바로 적용됐다). 컨테이너에서는 `npm i -g opencode-ai@1.19.5` 후 `OPENCODE_API_KEY=proxy-injected opencode run -m opencode-go/deepseek-v4.1-flash "<지시>"`로 부른다(키 값은 아무거나, 진짜 키는 프록시가 넣는다). 다른 모델: `opencode-go/deepseek-v4-pro`. curl로 직접 부르면 `x-opencode-session` 헤더가 필요하다(CLI는 알아서 넣는다). **주의(2026-11-02 실측):** 저장소 폴더(`/home/user/AP------`) 안에서 `opencode run`을 실행하면 시작 단계(`init`)에서 멈출 수 있다(첫 실행은 통과, 두 번째는 20분 정지). 저장소 밖 폴더에서는 바로 동작하지만, 그러려면 opencode 설정에 `external_directory`·`edit`·`bash` 허용이 필요하고 사용자가 2026-11-02 이 설정을 허용했다. 새 컨테이너에서는 `~/.config/opencode/opencode.json`에 `{"snapshot":false,"autoupdate":false,"permission":{"edit":"allow","bash":"allow","webfetch":"deny","external_directory":"allow"}}`를 쓰고, `mkdir -p /tmp/claude-0/oc-work && cd /tmp/claude-0/oc-work`에서 `opencode run`을 백그라운드로 돌린다(지시서에 절대경로와 '`cd /home/user/AP------ &&`로 명령 시작'을 적는다). **배분(사용자 결정 2026-11-02):** DeepSeek(`deepseek-v4.1-flash`)는 ① 문제 그림이 없는 좌표·그래프 문항(식·좌표가 글에 다 있는 미적분·수학I·도형의 방정식)의 plan·렌더, ② 고칠 내용이 정해진 수정(라벨·곡선 교체 등)을 맡는다. 문제 그림을 봐야 하는 문항(평면·격자·입체), 분류(triage), 검수, 엔진 확장은 Sonnet이 한다(DeepSeek는 이미지를 못 본다). 지시서에 '정답이 드러나는 예시 값 금지'와 그림에 넣을 중간값 목록을 분명히 쓴다(매산고 q12 반려 원인). 모델은 `deepseek-v4.1-flash`만 쓴다(사용자: 이것으로 충분). **최대 활용(사용자 지시 2026-11-02):** OpenCode Go 한도가 남아 있는 동안은 DeepSeek를 먼저 쓴다. 이미지가 필요 없는 plan 묶음은 모두 DeepSeek에 주고(동시 3개까지, 각자 다른 `runs/` 폴더), 정해진 수정(fixup)도 DeepSeek에 준다. Sonnet은 문제 그림을 봐야 하는 문항, 분류, 검수, DeepSeek가 두 번 막힌 문항만 맡는다. 이유: Claude 사용량을 아끼고 DeepSeek 품질이 그래프 문항에 충분했다. **DeepSeek 지시서는 더 꼼꼼히(사용자 지시 2026-11-02):** plan.md·plan-current.md에 더해 `briefs/deepseek-addendum.md`(실제 반려 결함 점검표: 정답 노출 예시값, 떠 있는 글자, 좌표 띠 라벨, publish.json 누락, 납작한 그림 등)를 반드시 함께 주고, TARGETS에 그림 안 텍스트 목록을 구체적으로 쓴다. 이유: 그림을 못 보는 DeepSeek는 렌더가 통과해도 화면 결함을 스스로 못 잡았다. PNG는 메인이 본다. 첫 시험지 결과: DeepSeek 4문항 중 메인 확인 반려 0, Sonnet 검수 FAIL 1(q12 정답이 드러나는 곡선 선택). 2026-10-26판에서 이 방식을 끝낸 것은 품질 때문이 아니라 그때 Claude Code 사용량 한도가 다 됐기 때문이었다(사용자 기억). 전환한 첫 시험지는 검수 반려율을 보고 계속 쓸지 정한다.

### 2.2 그림 파이프라인 (지시서는 `ops/svg-m1/briefs/`)

| 단계 | 지시서 | 내용 |
|---|---|---|
| 1 문제 묶음 | — | `node .tmp/svg-m1/make-packet.mjs <시험 js> .tmp/svg-m1/packets/<시험>.json --with-existing` |
| 2 분류 | `triage.md` | 문항마다 FIGURE / REPLACE / KEEP / EXEMPT / UNSUPPORTED → `runs/triage-<시험>.json` |
| 3 분할 | `split-targets.py` | 분류 결과를 평면·좌표·입체·통계 묶음(plan 작업자 하나당 3~6문항)으로 나눈다 |
| 4 그리기 | `plan.md` | plan.json → `render-plan.mjs` → ARCHIVE_BOUND면 svg2png로 PNG, publish.json(alt·caption) |
| 5 검토 | `review1.md`(새 그림), `review.md`(A/B 블라인드) | PASS/FAIL. 교체는 **A PASS이고 better=A**일 때만(TIE면 원장 OPEN일 때만) |
| 6 보정 | `fixup.md` | FAIL 지적만 최소 수정 → 재검토 |
| 7 게시 | `pubflow.py` | 아래 명령. JS 반영 → 렌더 확인 → 게이트 테스트 → 원장 → 커밋·push |
| 내용 검사 | `content-check.md` | 답·해설 오류 확인 |
| 엔진 확장 | `engine-common.md` + `engine-eNN-*.md` | 워크트리에서 기능 하나씩 커밋. 관측기·테스트·가이드·정답지 항목까지 |
| 엔진 병합 | `merge.md` | cherry-pick → 충돌 해소 → 관련 테스트 → 정답지 표본 회귀(전체는 main PR 직전·공용 파일 수동 충돌 병합 때만, 바이트 동일) → PASS면 메인이 rebase·push |
| 표본 조사 | `survey.md` | 남은 학년 표본으로 그림 필요율·그릴 수 있는 비율 추정 |

- **렌더:** `cd /home/user/AP------ && node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`. 결과는 `out/figure-result.json`의 `status`.
- **게시:** `python3 .tmp/svg-m1/pubflow.py "<커밋 제목>" "<본문>" <시험>:<review.json>:<rows.json> [...]`
  - 경로는 `runs/` 기준이다.
  - rows는 `[{"ord":N,"A":"<png 절대경로>"}]`이고, **이미 그림이 있는 문항을 교체할 때는 `"replace":true`**를 넣는다(없으면 publish.mjs가 HAS_EXISTING_SOLUTION_IMAGE_FIELDS로 건너뛰고 pubflow가 멈춘다).
  - 시험지마다 `runs/ledger-spec-<시험>.json`이 없으면 triage에서 만든다. 문항을 EXEMPT로 돌릴 때는 `exempt_override`를 쓴다.
- **엔진 확장 묶음 하나**는 Sonnet 작업자 1명이 1~2시간이 걸린다. 병합 검수는 표본 회귀면 짧고, 전체 회귀(정답지 전체 렌더, 70~100분)는 §00 기준에 해당할 때만 한다. 병합은 한 번에 하나씩 순서대로 한다. 끝난 묶음 여러 개를 한 번에 cherry-pick 검수하면 시간이 준다.

### 2.3 동시 실행·환경
- **CPU:** 4개다. 렌더가 많은 에이전트는 5~7개까지 돌린다. 부하가 높으면 Chrome 준비 실패(`QUESTION_IMAGE_READINESS_INCOMPLETE`)가 난다 → 부하가 7 아래로 내려간 뒤 단독 재시도한다.
- **디스크:** 병합이 끝난 워크트리는 곧바로 `git worktree remove --force`로 지우고 브랜치도 지운다. 잠겨 있으면 먼저 `git worktree unlock`.
- **Python 의존성:** `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`. 엔진 워크트리에는 `.tmp/apmath-visual-engine`을 심볼릭 링크로 건다.

## 3. 도구 복원 (새 컨테이너에서 처음 한 번)

```bash
mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/
```

- `.tmp/`는 git에서 제외된다. 지시서·스크립트는 절대경로 `/home/user/AP------/.tmp/svg-m1/...`를 쓴다(저장소를 `/home/user/AP------`에 둔다는 전제).
- `runs/`(작업 산출물·검토 JSON)와 `packets/`는 저장소에 없다. 증거물이라 커밋하지 않는다. 필요하면 다시 만든다.
- 각 파일의 역할은 `ops/svg-m1/README.md`에 있다.
- `publish.mjs`는 따옴표 없는 `id:` 키를 쓰는 시험지 JS도 처리하도록 고친 판이다.

## 4. 엔진 현황

### 4.1 확장 묶음 (E1~E37, G 라인 모두 main 반영)
- **평면:**
  - E1 이름 없는 점
  - E7 치수선·경로 합·지시선
  - E8·E10·E11 TEXT 라벨·단위·강조·호 라벨
  - E12 각 라벨 배치·∠A·각 색·기울어진 길이
  - E32 좁은 영역 지시선·치수선 여러 단(offset AUTO)·호 TEXT 라벨·경로 전체 눈금·반각과 전체각·labelAt
  - **E37 선분·각 끌어내기 `planeMarks.callouts`(SEGMENT/ANGLE)·`pathLabels[].anchor/side`**
- **좌표·그래프:**
  - E9 반비례
  - E13·E22 격자점·창·확대·가파른 직선 라벨
  - E30 기타
  - E31 직선 식 라벨 넓은 자리·labelAt·기호식 text, 분수 좌표 라벨, 숨긴 점 좌표, 사분면, 평행 표식, lineBarrier, 정의역 제한 직선
- **입체:**
  - E2·E3 전개도 강조·세기 번호
  - E4·E5·E6 잘린 입체·합성 패널·여러 이름
  - E27·E28 구 부분·이름 없는 면·원뿔대
  - E28b·E29 정다면체·쌍뿔
  - E28c 라벨 완화·3꼭짓점 자르기·구
  - E33 쌓기·축 밖 구·높이 표기
- **수직선:**
  - E21 한글 이름·잘게 나누기·값 숨김
  - E34 행 라벨·점 모양·거리 괄호
  - E35 컴퍼스 작도 `numberLine.constructions`·surd 값·값 없는 문자 점
- **통계:**
  - E14 줄기와 잎
  - E26 도수분포 다각형·계급 합·미상 계급
  - E34 범례·점도표
  - E36 정규분포 곡선 `normal.curves`·넓이 `shades`·`areaLabels`·산점도 기준선·영역
- **용기:** E15 물 채우기 + 높이 그래프
- **G 라인(2026-10-31~11-01, 상세·필드는 `ops/svg-m1/gaps.md`):**
  - G1·G5·G5b·G6·G6b·G6c·G7·G7b·G7c·G9: 입체 보조점·삼차 색칠 영역·그래프와 원·불연속 함수 둘·도로망 경로(필드는 `gaps.md` 각 절과 AUTHOR_GUIDE)
  - G11 좌표(축 있는) 그림 callout 끌어내기, ANGLE callout 호 비례·각 치수선, 좁은 꼭짓점 경로 라벨
  - G3 벡터: 라벨 `vec(a)`, `planeMarks.vectors`(from→to 화살표, `labelAt`·`side`, 좌표 `components`), `planeMarks.vectorOps`(SUM·DIFF·SCALE `k`)
  - G2a~c 이차곡선 `conic`(포물선·초점·준선·교점·수선의 발, 쌍곡선·점근선, 접선 판별식·외부 점 접선, 원·타원), `conics` 곡선 2개, 곡선 이름, 점 좌표 라벨 `coordinates:true`
  - G4a 입체 보조점 `solids[].points[].at`의 `divide`(`external` 외분)·`midpoint`·`centroid`·`footOnLine`·`projection`(한도 10)

### 4.2 검증 기준 (2026-10-30, E37 병합 시점의 값. 최신 수치는 직전 병합 보고 기준)
- **정답지:** 109개(item29 포함) 모두 ARCHIVE_BOUND, 기존 항목 바이트 동일.
- **Python:** `PYTHONPATH=… python3 -m unittest discover -s archive/tools/geometry-equation/tests` 966개 중 실패 1개(`test_graph_spike` 반복근, 원래 있던 것).
- **Node 원래 실패**(기준 트리에서도 같음):
  - `construction-candidate-svg-v1` 14개
  - `past-exam-visual-adapter` 4개(INVALID_EXAM_UID)
  - archive-cancel-recovery 1개, axis-overlap-segment 2개, cubic-quartic-archive-publication 1개, offline-archive-runtime 1개, rational-linear-over-linear-archive 1개, trigonometric-archive 1개
  - 이 밖의 실패는 새로 생긴 것으로 본다.

### 4.3 엔진 빈틈 (다음 확장 후보, 상세는 `ops/svg-m1/gaps.md`, 순서는 §00 다음 할 일)
- **해결됨:** 이차곡선 포물선·타원·쌍곡선(G2a~c), 입체 보조점 이름·수선의 발·정사영 점(G4a), E37 한계 중 좌표 그림 callout·각 호 비례·각 치수선(G11), 벡터(G3), 삼차 이상 색칠 영역·두 곡선 사이(G5·G5b), 불연속 함수 둘·접근 방향 표시(G7·G7b·G7c), 그래프와 원(G6·G6b·G6c), G1, 도로망 최단 경로(G9). `gaps.md`에 G5·G7 후속 잔여는 적혀 있지 않다.
- **남음:**
  1. 공간도형: 평면 α·β·교선·삼수선(G4b), 이면각·직선과 평면의 각(G4c), 입체 모서리 바깥 치수선·라벨 지시선·solid 기본 제목 끄기(G4 후속), 좌표공간 x·y·z(G4d).
  2. 전개도·입체: 속 빈 원기둥·원뿔대 전개도(G8, 설계 메모 `ops/svg-m1/notes/DESIGN-hollow-cylinder-and-frustum-net.txt`), 내접 혼합 입체(G10).
  3. G2 남은 것: 곡선 3개 이상, 두 곡선의 공통 접선, 쌍곡선 준선.
  4. 입체 고정 YAW 28°라 정사각뿔 앞 옆모서리가 높이선과 겹친다(끌어낸 직각삼각형 패널로 우회).
  5. pathLabels anchor가 꼭짓점 근처에서 LAYOUT_INVENTORY_INCOMPLETE가 날 수 있다(E37).

## 5. 진행 현황 (원장 `exam-figure-ledger.json` 다시 센 값, 2026-11-01)

| 학년 | 시험지(원본) | 원장 등록 | CLOSED | 미결 |
|---|---|---|---|---|
| 중1 | 44 | 36 | 26 | 10개 시험지·12문항(내용 문제·재 plan 대상) |
| 중2 | 138 | 27 (2026·2025 전부) | 25 | 2개 시험지·9문항(26_왕의중 2학기 중간 8문항은 원본 그림 없음, 25_연향중 1학기 중간 q14) |
| 중3 | 198 | 0 | 0 | 전부 |
| 고등 | 487 | 145 | 143 | 2개 시험지·5문항(25_매산여고 2학기 중간 고1 4문항, 25_효천고 2학기 중간 고1 1문항) |

- 원장 합계: 208개 등록, CLOSED 194, OPEN 14. 원장 자체의 `updated`는 2026-10-29이다(G 라인 샘플 게시는 원장 등록 시험지와 별개로 시험지 JS에 직접 게시했다).
- 처리 속도는 16시간에 그림 약 790개(Sonnet 병렬 5~7)였다.
- 단계별 평균은 plan 13.5분/묶음, 검토 3.5분, 엔진 묶음 1~2시간이다.

## 6. 남은 일 (두 줄 체제, 사용자 결정 2026-11-01)

두 줄은 서로 기다리지 않고 따로 돌린다. 이유: 남은 그림 약 4,200개를 한 명씩 하면 몇 주가 걸리고, 중학교 쪽 엔진은 거의 갖춰졌다.

### 엔진 줄 (작업자 한 명, 순서대로. 순서와 샘플은 §00 "다음 할 일")
G4b 평면 α·β → G4c 이면각 → G4 후속(바깥 치수선·제목 끄기) → G4d 좌표공간 → G8 속 빈 원기둥·원뿔대 전개도 → G10 내접 혼합 입체 → G2 남은 것(곡선 3개 이상·공통 접선·쌍곡선 준선). 공간좌표(G4d)는 `gaps.md`에서 확인해 이어 붙인다. 지시서는 `BRIEF_RULES.md`와 `briefs/engine-gap-template.md`.

### 생산 줄 (병렬 5~7개, 엔진 변경 없이 plan → 검토 → 게시)
1. **중2 2024 → 2023 → 그 이전**(원장에 없는 시험지 약 110개). §2.2 파이프라인을 시험지 2~4개씩 묶어 돌린다.
2. **중1 미결 12문항:** 원장의 `OPEN_*` reason에 적힌 엔진(E23·E26c·E26d·E28d·E29·E30)은 대부분 이미 들어왔다. 다시 plan → 검토 → 게시한다. `25_왕의중 2학기 기말 q19`는 원본 히스토그램 내용 문제(OPEN_CONTENT)이다. 속 빈 원기둥은 G8을 기다린다.
3. **중3** (표본 조사: 문항의 43%가 그림 필요, 95%를 지금 그릴 수 있음, 시험지당 8.4개, 약 1,570개). 먼저 `24_연향중 2학기 기말 중3` 해설의 `$` 짝 오류를 고쳐야 그 시험지가 렌더된다.
4. **고1 나머지·고2** (고2 표본: 38%가 그림 필요). 이차곡선·벡터·입체 보조점은 G2·G3·G4a로 이미 그릴 수 있고, 평면 α·β·이면각·좌표공간 문항은 엔진 줄 G4b~d를 기다린다.
5. **원본 자료 문제**(`ops/svg-m1/data-issues.md`)를 사용자에게 원문 확인을 받는다.
   - 26_왕의중 2학기 중간 문제 그림 8개 없음
   - 22_순천고 2학기 중간 고2 확통 q17 그림 파일 없음(그 시험지 전체 렌더 실패)
   - 루트 `assets/images`에만 있는 참조 약 125개
   - 수치 불일치 몇 건
- **전체 추정**(`ops/svg-m1/reports/estimate-after-survey.md`): 남은 약 610개 시험지, 그림 약 4,200개(3,300~5,000). 시간당 50~65개 기준 연속 75~100시간, 달력 5~7일.

## 7. 함정·교훈

- **`out/` 삭제:** 같은 plan을 다시 렌더할 때는 먼저 `out/`을 지운다(POLICY_PROVENANCE_MISMATCH).
- **중간값 삭제 사고(2026-11-01):** G2 교체 때 작업자·검수자가 PF=6·8, 교점 좌표, a·b 값 같은 중간값을 "정답 노출"로 보고 지웠고 메인도 해설과 대조하지 않았다. 메인은 게시 전에 해설(solution)을 직접 읽고 중간값이 그림에 다 있는지 확인한다.
- **문자 계수 직선:** 대표 위치 하나로 그리고 "a에 관계없이 P를 지난다"처럼 캡션에서 한 예시임을 밝힌다(25_왕의중 q17).
- **입체 높이 h:** 앞 옆모서리 바깥에 붙으면 모서리 길이로 읽힌다 → 끌어낸 단면 패널(같은 점 이름 O·H·M)과 캡션 정의.
- **pubflow가 중간에 멈추면:** 반쯤 적용된 JS(`git checkout`)와 새 svg를 되돌린 뒤 다시 돌린다.
- **엔진 병합 충돌:**
  - `golden.manifest.json`·`hints.mjs`는 `resolve-engine-conflicts.py`로 합집합한다.
  - `semantic_model.py` FIELDS는 `sm_resolve.py`로 합집합한다.
  - `author-guide-body.md`는 손으로 양쪽을 살린다.
  - `AUTHOR_GUIDE.md`는 theirs로 받고 재생성한다.
- **정답지 항목 이름:** 묶음마다 겹치지 않게 한다(item63e33a, item29b, item31a, item36a, item80~83 등).
- **정답지 비교 기준:** 저장소에 기준 SVG가 있는 항목은 46개뿐이다. 나머지 63개는 직전 병합 렌더와 바이트 비교를 해 왔다. 새 컨테이너에서는 첫 엔진 병합 전에 현재 main으로 manifest 전 항목을 한 번 렌더해 `.tmp/svg-m1/golden-out/`을 채우고, 그것을 기준으로 쓴다(`golden-one.sh`의 `WT`·`OUT`·`REFDIR` 환경변수).
- **PR 생성 파일:** 시험지 JS·자산을 바꾼 PR은 archive2 등록 생성 파일(catalog·source-verification·runtime-bridge-receipt)이 오래된 상태라 `node tools/run-tests.js`의 `meta-foundation-derivative-runtime`이 실패한다. main으로 가는 PR에서는 `Archive Registration Sync` 워크플로가 생성 파일을 다시 만들어 PR 브랜치에 push하므로 직접 만들지 않는다.
- **컨테이너·한도:** 컨테이너 재시작이나 사용량 한도로 끊기면 SendMessage로 같은 에이전트를 이어서 쓴다. 워크트리는 남아 있다.

## 8. 내용 수정·정책 기록 (이번 캠페인)

- **정답 수정:** 23_연향중 2학기 기말 중1 q17 ③→②, 23_왕운중 q23.
- **문제 문구:** 26_팔마중 q16.
- **해설 깨진 줄:** 25_연향중 2학기 중간 중2 q21(`\ne0$이다.` 줄 삭제).
- **답 보류(AMBIGUOUS):** 25_왕의중 q19, 26_동산중 q20(`ops/svg-m1/content-queue.md`).
- **정책 면제:** 25_왕운중 1학기 중간 중2 q23은 구하는 답이 수직선 그림 자체여서 해설 그림을 EXEMPT로 했다(사용자 확인 필요 시 그림은 다시 그릴 수 있음).
- **기존 정답 노출 교체:** 교체 과정에서 기존 게시본의 정답 노출을 고쳤다. 23_금당중 기말 q11·q13·q20·q21, 24_왕운중 기말 q14.
