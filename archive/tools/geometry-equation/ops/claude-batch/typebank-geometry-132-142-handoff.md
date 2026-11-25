# 고2 유형은행 기하 132–142 문제 그림 plan 인계 — 2026-11-25

## 기준과 실제 작업 범위

- 저장소 `icefoxtail/AP------`; 시작 최신 `main`: `312fb4f9409bf0b8fd391b3739d8dce61ba46b1a` (직전 운영 병합 `32438323065029948863763e46e306bf10ef8b1e` 이후 5커밋, 신규 기하 plan 중복 없음). GitHub 열린 PR 검색 `기하 유형은행`·`typebank`에서 이번 대상과 겹치는 PR 없음.
- PR 작성 직전 갱신된 `main`은 `2b1535ce71bd2456796ecf580dd3b85e2afcee42`; 추가된 커밋은 중3 왕운중 기말 유사문항 파일만 변경했으며 본 21개 파일과 경로 중복이 없다. 이 최신 `main`의 트리를 기준으로 업로드한다.
- 고2 유형은행 `archive/exams/types/high/h2/`의 기하만 담당. 미적분Ⅱ·시험지·유사문항·교과서·문제집·원본 유형은행 JS에는 손대지 않음. 직전 인계 `typebank-geometry-123-132-handoff.md`가 지정한 `132-q04`부터 시작.
- `[그림: ...]`이 있는 문항을 실제 qid 순으로 **20개** 선택: `132-q04..q10` 7개, `133-q01..q05` 5개, `140-q03..q05` 3개, `141-q01,q03` 2개, `142-q01..q03` 3개. 기하 134–139에는 `[그림:]` 문항이 없어서 추가 그림 plan 불필요.
- 원본 JS blob SHA:
  - `기하_132_내적의최대최소-내적의정의를이용하는경우_고2_유형은행1.js` `a78f731c8b482726221b1ce4fd3a7249649a8ef2`
  - `기하_133_내적의최대최소-벡터를분해하여구하는경우_고2_유형은행1.js` `35f0b6a33ba68ca620f69a529bfb6793c65b295e`
  - `기하_140_평면의결정조건_고2_유형은행1.js` `1791c4885be390dec1975f70a6e373ca93fb0f24`
  - `기하_141_평면의개수_고2_유형은행1.js` `24a720dabd2c8fc2ecf12859b4a69a654f0f6c2b`
  - `기하_142_공간에서위치관계_고2_유형은행1.js` `b5a93ccb6e3d841f21e028c92511ac78ca1dba55`
- 산출: `archive/tools/geometry-equation/production/plans/<원본 JS exact stem>/qNN-problem.plan.json` **20건**과 이 인계 MD **1건**. 모든 plan에 `sourceQuote`·`caption`·`accessibilityDescription`·`sourceConditions[].mappedTo`·`newVisualInformation` 기록.

## 검수·정확도

- **DRAWN_FEATURE_PARITY 필드 수준 20/20 REVIEWED/PASS**: 원문 도형의 반지름·원과 원호의 방향·선분·점·직각·각도·내분점·다각형·입체 종류·꼭짓점 대응·가려진 모서리 표현을 실제 plan 입력과 1:1 대조했다. 원본 `[그림:]`에 없는 대각선·최적 위치·최종 정답 숫자를 학생용 도형에 임의 강조하지 않았다.
- 독립 `SymPy` 정확 계산 **20/20 PASS**: 12개 평면/원 도형의 실제 좌표·내적·원호 위치·극값, 8개 입체의 좌표 공간 관계·평행/꼬임·결정 평면 개수 등을 별도 재구성해 검증. 원본 정답·해설과 대조했으며 발견한 수학적 불일치 없음.
- 별도 필드 매핑 검사: **20개 JSON, sourceConditions 54행, mappedTo 참조 126건 전부 실재**.
- 저장소 공식 `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow`: **20 OK, 0 FAIL, 0 SKIP**.
- 같은 공식 `plan-lint.cjs` **full**: **20 OK, 0 FAIL, 0 SKIP** (모델·spec·라벨 심화 검사). 기준 main과 같은 공식 엔진, SHA가 잠긴 NotoSansKR.ttf 및 기존 격리 설치 의존성의 읽기 전용 재사용; 엔진 수정/임의 플랜 통과 처리 없음.
- **ENGINE_CAPABILITY_PENDING=0**, **SOURCE_DESCRIPTION_CONFLICT=0**. 위 `DRAWN_FEATURE_PARITY=PASS`는 **원문→계획 필드 단계의 판정**으로, 실제 최종 SVG의 화살촉·글꼴·레이아웃 시각 검증을 뜻하지 않는다.
- 실제 SVG/PNG 생성, 390px 학생 화면 검수, A4 인쇄, 이미지 게시/JS 연결: **NOT_RUN / SVG_TO_CREATE**.

## 문항별 수학 검산과 시각 필드 대조

모든 항목의 축은 `PROBLEM_VISUAL(문제 그림)`, 판정은 `sourceVsPlan=REVIEWED`, `DRAWN_FEATURE_PARITY=PASS`, `plan-lint shallow/full=PASS/PASS`다. 아래 qid 경로는 모두 `production/plans/기하_<유형번호>_<원본 stem>/qNN-problem.plan.json`이다.

| 파일/qid | capability | 원문→필드에서 확인한 실제 도형 조건 | 독립 정답 확인 |
|---|---|---|---|
| 132-q04 | construction-spike-v1 | 반지름2 전체 원, 서로 다른 원주점 A,B,C, 현 AB·AC | 내적 최솟값 −2 |
| 132-q05 | construction-spike-v1 | 중심 O·반지름3 원, 길이4 현 AB, 원주 이동점 P | 최댓값 20 |
| 132-q06 | construction-spike-v1 | 한 변6 정삼각형, 수선 AH·직각 H, 그 위의 P | 최솟값 3 |
| 132-q07 | construction-spike-v1 | AB8·BC6 직각삼각형, AB 위 P | 최솟값 6 |
| 132-q08 | construction-spike-v1 | 한 변4 마름모, DC 위 P; 도출된 60°는 라벨로 노출하지 않음 | 넓이 8√3 |
| 132-q09 | construction-spike-v1 | AB6·AD4·∠DAB60° 평행사변형, DC 위 P | M+m=60 |
| 132-q10 | construction-spike-v1 | 중심 간 거리2·반지름2 두 원과 교점 A,B, 첫 원 오른쪽 호 P·둘째 원 왼쪽 호 Q | M+m=−2 |
| 133-q01 | construction-spike-v1 | 직사각형 AB3·AD4, CD를 지름으로 오른쪽 **반원만**, 호 위 P | 최솟값 16 |
| 133-q02 | construction-spike-v1 | 직사각형 AB4·AD2√5, 오른쪽 CD 반원과 아래쪽 BC 반원, 대표 P | 최댓값 40 |
| 133-q03 | construction-spike-v1 | 한 변6 정삼각형, BC 지름의 전체 원, A 반대편 아래 호 P | M+m=27 |
| 133-q04 | construction-spike-v1 | 한 변7 정사각형, B·D 쪽에 각각 두 변과 접하는 반지름3 원, P·Q | 최댓값 16 |
| 133-q05 | construction-spike-v1 | 정삼각형과 AC 지름 원 O, BC 위 D, ∠DAB30°, 원주 이동점 X | p+q=17 |
| 140-q03 | solid-figure-v1 | 삼각기둥 윗면 ABC·아랫면 DEF, AD·BE·CF 옆모서리 | 꼬인 AC·BE, 정답 ④ |
| 140-q04 | solid-figure-v1 | 직육면체 윗면 ABCD·아랫면 EFGH, 대응 옆모서리 | BD·EG 꼬임, 정답 ② |
| 140-q05 | solid-figure-v1 | 정육면체 ABCD-EFGH의 8꼭짓점과 12모서리 | 7평면 |
| 141-q01 | solid-figure-v1 | 평면 α 위 A,B,C, 밖 D, AD 내부점 P | 서로 다른 5평면 |
| 141-q03 | solid-figure-v1 | 정사각뿔·삼각기둥·정팔면체 세 입체를 동등한 눈금으로 나란히 | 7/11/11평면, ㄴ·ㄷ(④) |
| 142-q01 | solid-figure-v1 | 대응 모서리 평행한 ABC-DEF 삼각기둥 | AD∥BE, 정답 ③ |
| 142-q02 | solid-figure-v1 | 정삼각형 밑면·직사각형 옆면 ABC-DEF 직삼각기둥 | BC 꼬임3, AD 꼬임2, 합5 |
| 142-q03 | solid-figure-v1 | 정사각형 BCDE 밑면과 꼭짓점 A의 사각뿔 | a=1,b=2,c=1, 합4 |

## 후속

1. 후속 SVG/PNG 담당자가 공식 엔진으로 렌더하고 점·라벨·원호·가림선의 실물 parity, 390px 및 A4를 정식 검수해야 한다. 본 배치의 PASS는 이 완료를 의미하지 않는다.
2. **다음 미작성 그림은 `기하 142-q04`**. 새 작업 시작 전 최신 `main`·PR 재확인. 기하 끝나기 전 미적분Ⅱ로 넘어가지 않는다.
3. 원본 JS·해설·정답·게시 자산은 그대로 유지한다.
