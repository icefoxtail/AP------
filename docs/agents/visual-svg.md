# 문제·해설 그림 (Visual·SVG)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — 문제은행 전체 문제·해설 SVG 필요성 2축 전수판정 (2026-10-10 원장 지시)
- **문제은행의 모든 기출·ALIVE Generated·교재/유형/유사문항**에서 *문제용*과 *해설용* 시각자료의 필요성을 UID마다 **독립 판단**한다. 문자·수식만으로 문제를 풀 수 있어도 해설의 접선/교점/대칭/보조선/그래프/영역 관계를 학생에게 명확히 전달하는 SVG가 필요하면 반드시 제작한다. `VISUAL_OPTIONAL`도 실질 교육 효과가 있으면 ADD하며, 진짜 중복·장식은 근거 있는 EXEMPT.
- 기존 Visual 생성 스킬과 엔진을 재사용하고, source PNG 불변·교육과정·실제 primitive/렌더 검증을 유지한다. 기존 승인 문항의 품질 상태를 일괄 취소하지 말고 누락 UID의 시각 결함만 보강한다. 실측 누락률은 고유 UID × 문제/해설 전수조사 후 확정한다.
- 실행 정본: `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`. 문서 작성은 전수조사/SVG 생성/Chrome 완료가 아니다.

## CURRENT HARD — 문제은행 전 문항 문제·해설 SVG 필요시 의무 생성 (2026-10-10 형님 지시)
- **팔마고 한정 아님**. 기출·ALIVE Generated 후보/승인·교재/평가문항 등 실제 문제은행 모든 UID에 대해 **문제 그림과 해설 그림을 각각** 전수 triage한다. 텍스트만으로 풀이 가능하다는 이유로 해설 SVG를 자동 생략하지 않는다.
- 실제 결정적 교육 가치가 있는 REQUIRED/BENEFICIAL 해설 SVG 및 필수 문제 시각자료는 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, `도형추출.md`, 현존 `alive/engine/visual_renderer.py` 등 적절한 backend로 **생성/보강→actual geometry parity→학생용 참조→실제 렌더 증거**까지 완료한다. 충분한 원본 PNG/기존 검증 SVG를 무의미하게 중복 제작하지 않는다.
- SVG 필요인데 자산 없음/학생 UI 미연결/렌더 미검증이면 신규 RELEASE DONE 금지. 기존 승인본은 일괄 무효화하지 않고 UID별로 보강한다. 신규 엔진 중복 제작·미지원 renderer 지원 허위 주장 금지.
- **실행 정본:** [문제은행 전 문항 문제·해설 Visual/SVG 게이트 CURRENT](../../docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md). 이번 문서 반영은 POLICY_ONLY이며 전수조사·SVG 신규 제작/렌더 완료를 의미하지 않는다.

## SVG 해설 그림 엔진 라인 (2026-10-30)

해설 그림 SVG 엔진(`archive/tools/geometry-equation/`)과 기출 해설 그림 캠페인을 이어서 하는 실행자는 먼저 `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`를 끝까지 읽고 그 방식(메인 Claude는 오케스트레이터, 수정·검수는 서로 다른 Sonnet 서브에이전트, 도구는 `archive/tools/geometry-equation/ops/svg-m1/`을 `.tmp/svg-m1/`로 복원)과 남은 일 순서를 따른다. 그림 작성 규칙 정본은 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`. 2026-10-26판 opencode DeepSeek 방식은 끝났고 지금은 Sonnet 방식이다.

## 다른 AI 라인용 SVG 도형 엔진 작업 프롬프트 (2026-11-03, 사용자 지시)

Claude·GPT·Codex 어느 라인이든 기출·생성문항의 문제·해설 그림을 이 엔진으로 만들 때는 아래 블록을 그대로 작업 지시로 쓴다. 이유: 라인마다 그림 기준과 절차가 달라 엔진 밖 손그림·정답 노출·떠 있는 라벨이 반복됐고, 2026-11-02~03에 25·24 고1·고2 기말 303장을 이 절차로 만들어 기준이 굳었다.

```text
[SVG 도형 엔진으로 문제·해설 그림 만들기 — Claude·GPT·Codex 공통]

목표: 학생이 PC·휴대폰에서 보고 풀이를 따라갈 수 있는 해설(또는 문제) 그림을 저장소의 SVG 엔진으로 만든다. 손으로 SVG를 쓰지 않는다. 엔진 출력만 관측기가 식·라벨·눈금을 다시 대조해 주기 때문이다.

0. 먼저 읽기
   - archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md: §00(최신 현황), §1(사용자 지시), §2.2(파이프라인), §3(도구 복원)
   - archive/tools/geometry-equation/ops/svg-m1/briefs/plan.md와 plan-current.md(그림 규칙, plan-current가 우선)
   - 작성 지침은 ops/svg-m1/guide/guide-tips.md, guide-core.md, 그리고 형태별 발췌 하나(guide-plane / solid / stat / graph). plan 계약 전문은 production/AUTHOR_GUIDE.md다.
   - 비슷한 정답지 예시: ops/golden/<item>/plan.json(목록은 ops/golden.manifest.json)

1. 준비(새 환경에서 한 번, 저장소 루트에서)
   mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/
   export PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python
   export GEOMETRY_BROWSER_EXECUTABLE=<Chromium 경로>

2. 문항 하나 처리
   a. packet을 만든다(.tmp/svg-m1에서): node make-packet.mjs <시험지 JS 저장소 상대경로> packets/<시험지>.json --with-existing
   b. 문제 그림, 문제, 정답, 해설을 직접 읽는다. 해설이 쓰는 방법(보조선, 닮음, 넓이 옮기기, 대칭, 경계 사례)과 그림에 넣을 중간값 목록을 먼저 정한다.
   c. AUTHOR_GUIDE 계약대로 item.json과 plan.json을 쓴다. 같은 형태의 정답지 plan 구조를 재사용한다.
   d. 렌더(저장소 루트): node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out <out폴더>
      결과가 ARCHIVE_BOUND여야 한다. 렌더는 문항당 5번 이내, 한 번에 하나씩 한다. 부하가 높으면 기다린다.
   e. figure.png를 직접 보고 3번 기준으로 확인한다.
   f. publish.json을 쓴다: {"alt": 그림 설명, "caption": 풀이 요약 + 끝에 정답, "size": "medium" 또는 "full"}

3. 판정 기준(학생 기준, 모두 지킨다)
   - 정답(구하는 값, 보기 번호, 서술형 소문항 답)은 caption 끝에만 둔다. 그림 안에는 풀이 핵심 단계의 중간값만 넣는다.
   - 정답 값과 같은 점근선 값이나 좌표는 숨긴다(hideLabels). 범위·최솟값 문제의 경계 곡선·직선은 풀이 핵심이라 그린다.
   - 라벨은 이름 붙인 대상 곁에 둔다. 떠 있으면 지시선(callout, leader)을 먼저 쓰고, 필수 라벨을 지워서 통과시키지 않는다.
   - 점 이름은 선 안쪽, 길이 치수선은 바깥(짧은 것 안, 긴 것 밖)에 둔다.
   - 같은 각·길이, 평행, 대응변, 같은 넓이는 같은 색으로 묶는다(핵심 2~3개, 주로 BLUE·WARM).
   - y=x 대칭, 정사각형, 기울기가 중요하면 가로·세로 눈금을 같게 한다(equalUnits, multi-curve는 기본이 같은 눈금).
   - 해설이 쓰는 교점은 그림 창 안에 있어야 한다. 곡선이 해설의 어느 함수(f, g, f⁻¹…)인지 그림에서 보여야 한다.
   - 입력용 표기(^, sqrt, *, ^c, f^-1)를 쓰지 않는다. 수식 필드로 위첨자·근호를 쓰고, 글자만 받는 곳은 같은 뜻의 식으로 바꾼다.
   - 문제 그림의 점 이름과 배치를 따른다. 작은 패널 여러 개보다 큰 그림 하나를 쓴다.
   - 예시 값으로 그린 그림은 caption에 "예:"라고 밝힌다. 근사로 만든 좌표값은 그림에 쓰지 않는다.

4. 막히면
   - 지시선 → plan 구조 바꾸기 순서로 시도한다. 그래도 안 되면 UNSUPPORTED로 두고, 빠진 엔진 기능을 정확히 적는다(ops/svg-m1/gaps.md 후보).
   - 엔진 코드 수정은 이 프롬프트 범위 밖이다. 별도 지시서(ops/svg-m1/briefs/engine-*.md 형식), 별도 작업 공간, 다른 검수자, 정답지 표본 비교를 거친다.
   - 문제 그림과 해설·정답이 서로 맞지 않으면(CONTENT) 그리지 않는다. 문제 기준으로 다시 계산한 정답과 근거를 보고한다.

5. 검수와 게시
   - 다른 AI 인스턴스가 ops/svg-m1/briefs/review1.md로 그림과 publish.json을 검수해 PASS한 것만 게시한다.
   - 게시는 .tmp/svg-m1/pubflow.py로 한다(HANDOFF §00 "시험지 하나 처리 절차"). 이미 그림이 있는 문항을 교체할 때는 rows에 "replace": true를 넣는다.
   - 게시 뒤 더 쓰이지 않는 옛 그림은 정리한다. 커밋에는 운영물만 넣고, 증거와 렌더 출력은 넣지 않는다.
   - 원본 시험지·공유 데이터 고정값 규칙(docs/agents/common.md)을 지킨다. 병합 전에 PR CI가 전부 녹색인지 확인한다.

6. 브라우저 렌더를 돌릴 수 없는 라인
   - item.json, plan.json, publish.json 초안까지만 만들고, 렌더·검수·게시는 실행 가능한 라인에 넘긴다.
   - 렌더하지 않은 그림을 PASS로 적지 않는다(NOT_RUN).

보고: 시험지·문항별 상태(ARCHIVE_BOUND / FAILED / UNSUPPORTED)와 렌더 수, 확인한 PNG 경로, CONTENT, 엔진 공백, 사용자 결정이 필요한 것.
```
