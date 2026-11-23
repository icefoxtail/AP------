# 문제·해설 그림 (Visual·SVG)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## 정본 — 새 SVG는 무조건 엔진으로 만든다 (2026-11-19 사용자 지시)

- 문제 그림이든 해설 그림이든, 기출·유사·교재·유형·생성 문항 어느 것이든 **새로 만들거나 다시 만드는 SVG는 전부 저장소의 SVG 엔진(`archive/tools/geometry-equation/`, 작성 규칙 정본 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`)으로 만든다.** 손으로 쓴 SVG, 스크립트로 직접 조립한 SVG, 다른 도구가 낸 SVG는 넣지 않는다. 문항 수리·원문 복원·메타 작업처럼 그림이 본업이 아닌 작업에서 그림이 필요해져도 같다.
- 엔진이 그 그림을 지원하지 못하면 손으로 그려 메우지 않는다. 지시선·라벨 등 기존 옵션으로 시도한 증거와 함께 "엔진 미지원"으로 보고하고, 그 문항은 그림 보류로 남긴다(엔진 확장은 엔진 라인의 일).
- **제작 방식(현행, 2026-11-19 사용자 지시):** 규모에 따라 둘로 나눈다. ① **대규모 그림 캠페인**(시험지 여러 개의 해설·문제 그림을 한꺼번에 만드는 SVG 라인)은 효율을 위해 딥시크가 엔진으로 초안을 만들고 Sonnet이 검수·마감 한 번 하고 메인이 PNG 표본을 본다(① 전용 지시문: `archive/tools/geometry-equation/ops/claude-batch/prompts/ds-exam-draft.md`, `archive/tools/geometry-equation/ops/claude-batch/prompts/sonnet-exam-impl.md`). ② **그 밖의 작업에서 생기는 그림**(문항 수리, 원문 복원, 유사문제 반입의 최종 검수 등 몇 장~수십 장)은 Sonnet이 엔진으로 직접 만들고, 메인이 PNG를 눈으로 검수해 마감한다. 어느 쪽이든 엔진으로만 만든다. SVG 담당은 Claude SVG 라인 하나다(2026-11-17). 아래의 루나 구현·루나 검수 절차는 과거 이력이다. 이유: 초안을 싼 모델에 나누는 것은 양이 많을 때만 이득이고, 적은 양은 단계를 줄이는 편이 빠르고 정확하다.
- **대량 그림(수백 장 이상)은 DeepSeek 일괄 파이프라인으로 한다 (2026-11-23 사용자: "앞으로는 딥시크한테 시키고").** 도구: 집 PC `D:/AP-svg-factory/labor/ds/`(README.md에 파일별 역할; 저장소 밖). 방식: 그림 종류별로 묶어 한 DeepSeek 호출에 8~20키(`write-plans.mjs`, 변형 `#low`), 동시 호출은 워크스페이스 공용 한도라 라인 합계 8 안팎, 렌더는 모델 없이 `render.mjs`가 엔진 `render-plan.mjs`를 일괄 호출(슬롯 1~2), 실패분만 DeepSeek 되돌림, 반입 전 Sonnet 검수·수리 1회(문제 그림 정답 노출·발문과 다른 값이 약 30% 나왔다). 안티그래비티·루나 같은 모델이 키마다 plan·렌더를 손으로 도는 방식은 쓰지 않는다. 위 ①의 시험지별 `ds-launch-exam.sh` 흐름도 대량에는 쓰지 않는다. 이유: 같은 날 키 단위 수작업은 몇 시간에 30~40키, 일괄 파이프라인은 시간당 300~400키가 통과했다.
- **면 채움은 기본 없음(흰 바탕) (2026-11-23 사용자 재지적).** 도형 안을 색으로 칠하는 것은 발문·해설이 묻는 넓이나 "색칠한/어두운/빗금 친 부분", 겹친 영역·두 도형(원래·이동 등) 구분처럼 꼭 필요할 때만 한다. 여러 선·곡선을 선 색으로 구분하는 것은 그대로 한다(선 색과 면 채움은 별개). 원문은 아래 "품질이 낮은 기존 그림의 SVG 교체" 절의 바탕 흰색 항목이다. 이유: "선·영역은 색으로 구분" 지시가 면 채움으로 과하게 퍼져 중2·중3 기출에 원·삼각형 안을 연한 색으로 칠한 그림이 1,300여 개 생겼다. 예외(원장님 2026-11-23): plan 없는 기존 중2·중3 기출 그림의 면 채움 제거는 이번 한정으로 엔진 재렌더 대신 fill 속성만 none으로 바꾸는 스크립트를 허용한다(좌표·선·글자 불변, 색칠·넓이·겹침·이동 문항은 제외).
- 작업 지시서에는 "그림은 엔진으로만 만든다"를 적고, 검수와 메인은 받은 그림이 엔진 산출물인지(plan·렌더 기록) 확인한 뒤에 보여 주거나 병합한다.
- 스캔에서 깨끗하게 잘라 넣는 원본 그림(PNG)은 이 규칙의 대상이 아니다. 아래 19행의 "엔진 표식의 부재만으로 교체 필요를 판정하지 않는다"는 이미 있는 그림에 대한 규칙이고, 새로 만드는 그림에는 이 절이 적용된다.
- 이유: 원문 수리 작업에서 작업자가 그림 9장을 스크립트로 직접 조립해, 도수분포다각형에 점이 없고 선·글자 품질이 엔진 그림과 달랐다. 엔진 출력만 관측기가 식·라벨·눈금을 다시 대조하고, 학생이 보는 그림의 모양이 한결같아진다.

## CURRENT HARD — 문제은행 전체 문제·해설 SVG 필요성 2축 전수판정 (2026-10-10 원장 지시)
- **문제은행의 모든 기출·ALIVE Generated·교재/유형/유사문항**에서 *문제용*과 *해설용* 시각자료의 필요성을 UID마다 **독립 판단**한다. 문자·수식만으로 문제를 풀 수 있어도 해설의 접선/교점/대칭/보조선/그래프/영역 관계를 학생에게 명확히 전달하는 SVG가 필요하면 반드시 제작한다. `VISUAL_OPTIONAL`도 실질 교육 효과가 있으면 ADD하며, 진짜 중복·장식은 근거 있는 EXEMPT.
- 기존 Visual 생성 스킬과 엔진을 재사용하고, source PNG 불변·교육과정·실제 primitive/렌더 검증을 유지한다. 기존 승인 문항의 품질 상태를 일괄 취소하지 말고 누락 UID의 시각 결함만 보강한다. 실측 누락률은 고유 UID × 문제/해설 전수조사 후 확정한다.
- 실행 정본: `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`. 문서 작성은 전수조사/SVG 생성/Chrome 완료가 아니다.
- **유사(1:1 변형) 시험지 그림은 판정하지 않는다:** 원본 기출·기존 유사의 같은 번호 문항에 있던 문제/해설 그림과 새 시험지의 `[그림: …]` 자리표시를 그대로 만들 목록으로 쓰고, 같은 종류면 원본 plan을 복사해 이 문항의 숫자·조건만 바꿔 렌더한다. 원본·기존 유사에 그림 자료가 없을 때만 일반 판정 규칙을 쓴다.
- 이유: 유사는 원본 구성을 따르므로 그림 필요도 같고, 다시 판정하면 느리다(사용자 2026-11-20).

## CURRENT HARD — 문제은행 전 문항 문제·해설 SVG 필요시 의무 생성 (2026-10-10 형님 지시)
- **팔마고 한정 아님**. 기출·ALIVE Generated 후보/승인·교재/평가문항 등 실제 문제은행 모든 UID에 대해 **문제 그림과 해설 그림을 각각** 전수 triage한다. 텍스트만으로 풀이 가능하다는 이유로 해설 SVG를 자동 생략하지 않는다.
- 실제 결정적 교육 가치가 있는 REQUIRED/BENEFICIAL 해설 SVG 및 필수 문제 시각자료는 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, `도형추출.md`, 현존 `alive/engine/visual_renderer.py` 등 적절한 backend로 **생성/보강→actual geometry parity→학생용 참조→실제 렌더 증거**까지 완료한다. 충분한 원본 PNG/기존 검증 SVG를 무의미하게 중복 제작하지 않는다.
- SVG 필요인데 자산 없음/학생 UI 미연결/렌더 미검증이면 신규 RELEASE DONE 금지. 기존 승인본은 일괄 무효화하지 않고 UID별로 보강한다. 신규 엔진 중복 제작·미지원 renderer 지원 허위 주장 금지.
- **실행 정본:** [문제은행 전 문항 문제·해설 Visual/SVG 게이트 CURRENT](../../docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md). 이번 문서 반영은 POLICY_ONLY이며 전수조사·SVG 신규 제작/렌더 완료를 의미하지 않는다.

## 품질이 낮은 기존 그림의 SVG 교체

- 수학적으로 정확하고 실제 학생 화면·인쇄에서 현행 엔진 수준으로 읽히는 기존 SVG는 유지한다. 생성 plan·영수증·파일 이력·렌더러 서명은 제작 경로를 확인하는 근거다. 엔진 표식의 부재만으로 수동 제작이나 교체 필요를 판정하지 않는다.
- 최종 PC·모바일·인쇄에서 눈금과 좌표가 어느 축·점에 속하는지, 함수 이름·점·치수의 위치와 정렬이 자연스러운지 확인한다. 그래프가 y축 오른쪽에 집중되면 눈금 숫자는 공간이 허용되는 한 왼쪽에 맞춘다. 한 그림에 함수가 함께 있는 경우, 같은 축에서 읽어야 할 관계와 비교 구조를 보존한다.
- 현행 JS에 연결된 문제·해설 그림이 흐리거나 잘려 필수 길이·각·눈금·라벨을 읽기 어렵거나, 학생 화면에서 선·영역을 구별하기 어려우면 기존 엔진으로 SVG를 새로 만들어 교체한다. 현행 JS 문제·보기·정답·해설과 연결 자산에서 확인한 정보만 사용하고, 확인할 수 없는 값은 짐작해서 채우지 않는다.
- 문제 그림은 문제 자리, 해설 그림은 해설 자리에 유지한다. 해당 슬롯의 표시 크기·레이아웃 규격을 따르고 종횡비, 수학적 관계, 라벨의 의미를 확인한다. 문제 그림에 풀이 보조선·답을 새로 노출하지 않는다. 교체 자산은 새 경로에 두고 대상 JS 참조만 바꿔 다른 참조와 기존 자산을 보존한다.
- 그림 표시 크기 기본은 large와 full 사이다(2026-11-17 사용자 지시). 문제 그림은 폭 90%·높이 240px(`tall`만 280px), 해설 그림은 칸 폭 90%·높이 340px(휴대폰 92%·340px) 이내로 가운데 정렬하고, 저장된 `large`·`full`·`tall` 값도 이 상한이다. 크게 보여야 하는 그림만 데이터에 `imageSizeOverride: "full"|"tall"`(문제), `solutionImageSizeOverride: "full"`(해설)을 적는다. 이유: `tall`·해설 `full`이 단 폭을 꽉 채우고 높이 제한이 없어 그림이 너무 컸다. 그림 엔진은 실제 표시 크기로 라벨 글자를 정하므로 새 상한에서 라벨이 작게 읽히는 그림은 재생성하거나 override를 준다(표시된 글자가 11 CSS px 아래여도 거절되지 않는다: 바로 아래 2026-11-23 결정).
- **표시된 글자 크기 하한은 해제했다 (2026-11-23 사용자 결정: "그림 속 글자가 11픽셀보다 작아지면 해제해버리자. 애들이 알아서 크기 확대해서 보겠지." 같은 취지의 2026-11-18 결정: 만들 때는 글자 제약을 두고, 엔진이 렌더될 때는 풀어 버린다).** 제작 때 글자 제약은 그대로다: 그림 원본(SVG 단위) 글자 `fontPx >= 11`(타입세터·`DISPLAY_ENVELOPE_LABEL_INVENTORY_INVALID`·정책 최소 기본 글자 20)과 렌더 레이아웃 검사의 저자 글자 검사(`PUBLICATION_FONT_BELOW_11_CSS_PX`는 원본 글자가 11 미만이거나, 그림 안의 외곽선이 줄어 실제 그려진 글자[효과 글자 ÷ 루트 표시 배율]가 11 미만일 때만. 그림 전체가 쪽에서 축소되어 작게 보이는 것은 해당 없음). 풀린 것은 "그림이 칸에 축소되어 놓였을 때 화면에 보이는 글자가 11(11.25) CSS px 아래면 불합격" 하나다: `display-envelope.mjs`(정책 `REQUESTED_PROFILE_FONT_SCALE` 거절, 크기 등급 자동 상향, `FONT_FLOOR_FAIL`, `ACTUAL_FONT_BELOW_ENVELOPE_FLOOR`), `construction-candidate-svg-v1.mjs`의 `FONT_BELOW_FLOOR`, `verify-rendered-layout.mjs`의 표시 글자 검사, 게시 검사(`ops/svg-m1/verify-publication-fonts.mjs`, `pubflow.py`), `audit-slice.mjs` `FONT_GATE`, 합성 그림 크기 lint(`plan-lint.cjs`의 폭 828·높이 820 규칙). 단 **자동 확대(`solutionImageScale` 탐색)는 유지**한다: 기본 표시에서 글자가 하한 아래로 보이면(정책에 `displayTextBelow11px`) 후보 배율을 작은 것부터 재 측정해 글자가 11.25 이상이 되는 첫 배율을 고르고, 어느 것도 안 되면 가장 큰 배율(단 폭이 허용하는 최대 정수 %까지)을 쓴다(`construction-archive-capture-v1.mjs`의 `selectSolutionImageScale`). 없어진 것은 "안 되면 거절"뿐이다(원장님 뜻은 "불합격시키지 말자"이지 "더 작게"가 아니다). 하한 아래로 보이는 그림은 실패가 아니라 정보 `displayTextBelow11px: true`(증거 JSON·정책·레이아웃 결과에 그 경우에만 키가 붙는다)로 기록된다. 글자 크기 측정값 자체가 없거나 유한하지 않으면 여전히 실패한다. 이유: 학생이 패드·휴대폰에서 그림을 확대해 볼 수 있고, 해설 그림 표시 비율을 단 폭의 80%로 정한 뒤 이 하한이 넓은 그림을 일괄 거절했다. 아래 2026-11-19 항목과 AUTHOR_GUIDE의 "글자 11px·`REQUESTED_PROFILE_FONT_SCALE` 거절" 서술은 이 결정 이전의 경위이며, 크기 등급은 이제 글자 하한 때문에 올라가지 않는다(요청 등급이 그대로 계획 등급이다).
- **A4 해설 그림 측정 기준 (2026-11-19, 글자 하한 부분은 위 2026-11-23 결정으로 해제).** A4(PC 쪽 보기·인쇄·PDF)는 해설 그림을 단 폭의 60%(약 190px)로 보인다(`archive/figure-size.css`, 2026-11-18 사용자 결정). 이 크기로는 가로 약 540 SVG 단위를 넘는 그림이 라벨 11.25 CSS px를 지키려면 기본 글자가 상한 32를 넘어, 측정이 `UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE`로 거절했다(지금은 거절하지 않고 기본 글자를 상한 32에 둔 채 `displayTextBelow11px`로 기록하며, 아래 `solutionImageScale` 탐색은 그 표시를 계기로 계속 돈다). 엔진(`construction-archive-capture-v1.mjs`의 `measureArchiveTypographyPolicy`)이 이 거절을 만나면 문항 필드 `solutionImageScale`(단 폭 대비 %, 5 단위, 보통 85~90)을 정해 같은 Archive에서 다시 측정하고, 캡처도 그 값을 넣은 시험지로 한다. `render-plan`의 `*-result.json`에 `solutionImageScale`이 있으면 게시 도구(`ops/svg-m1/publish-exam.py` → `publish.mjs`, `ops/tools/publish-figures.mjs`)가 `solutionImageSize` 옆에 시험지 JS 문항 필드로 적는다. 값이 있는 그림은 반드시 그 값과 함께 게시한다. 이 값이 필요한 그림도 단 폭 전체(약 298px)까지 키워 기본 글자 32 이하로 맞출 수 있는 가로(약 790 SVG 단위, 합성은 패널 384 두 개)까지만 통과하고, 그보다 넓으면 캔버스를 줄인다. 휴대폰은 이 값을 읽지 않고(옛 자연 폭 규칙, 단 폭의 약 90%) 글자 기본 크기를 "휴대폰 375px에서 라벨 10px 이상"이 되도록(`phoneMinimumBaseFontPx`) 정책 최소값으로 올려 맞춘다. 이유: 표시 크기는 사용자 결정이라 런타임을 되돌리지 않고, 넓은 그림 렌더가 일괄 거절되던 것을 그림 하나 단위 크기 덮어쓰기로 푼다. 글자 배율 상한(32)을 올리면 그림은 커지지 않고 글자만 비대해진다.
- 그림과 보기의 바탕은 흰색을 기본으로 한다. 원문이 지정한 색칠 영역이나 풀이에서 영역을 비교하는 데 필요한 부분에만 면색을 쓴다. 도형 윤곽과 단독 그래프의 선은 검정을 기본으로 한다. 여러 함수·선분을 구분하거나 같은 길이·각을 대응시킬 때 필요한 만큼 색을 쓰고, 눈금·호·선 모양도 함께 적용한다. 이유는 대비를 유지해 학생이 핵심 선과 표시를 한눈에 읽을 수 있게 하기 위해서다.
- 색은 관계를 구분하는 데만 쓴다. 중요한 선은 실선·점선·굵기나 직접 라벨로, 영역(채움이 필요한 경우에 한해)은 경계선·면 채움·무늬로도 구분해 색을 구별하기 어려워도 읽을 수 있게 한다. 휴대폰과 태블릿의 실제 학생 화면에서 확대 없이 수치·라벨·경계가 읽히고 겹치거나 잘리지 않는지 확인한 뒤 독립 검수를 거쳐 출고한다.
- 이유: 흐린 그림을 확대해야 하는 부담을 줄이고, 화면 크기나 색 구분에 관계없이 학생이 풀이에 필요한 정보를 읽을 수 있도록 한다.

## SVG 해설 그림 엔진 라인 (2026-10-30)

해설 그림 SVG 엔진(`archive/tools/geometry-equation/`)과 기출 해설 그림 캠페인의 기존 현황·공통 품질 기준은 `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`를 읽는다. 그림 작성 규칙 정본은 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`다.

- 엔진 결함 수리는 사례가 아니라 결함 종류 단위로, 공통 층에 기능 추가로 넣고 다른 종류 1개로 확장을 확인한다(이유: 2026-11-22 사용자, 같은 결함이 그림 종류마다 되풀이됨).

### 게시 관문은 점수로 (원장님 2026-11-23, 1단계 기준표)

- 원장님 결정 원문: "겹침 같은 걸 다 실패로 처리하지 말고, 학생이 봤을 때 최소한 읽히면 통과. 100점짜리가 아니라 90점짜리 SVG."
- **관측은 그대로, 게시 관문만 점수로 판단한다.** 관측기(검사)는 지금처럼 모든 결함을 찾아 기록하고 약화·삭제하지 않는다. 점수는 "찾은 결함이 게시를 막는가"만 정한다.
- 기준표는 한 곳이다: `archive/tools/geometry-equation/ops/score/score-table.json`(코드 → 막음/감점/엔진 대기/판정 불능, 정도→감점 함수)과 `score.mjs`(채점)·`rescore.mjs`(저장된 결과를 다시 렌더 없이 채점). 합격선은 90점이고 같은 코드가 여러 번이면 상한 없이 누적한다.
- 코드는 네 갈래다. 감점(품질 판정: 겹침·근접·멂·촘촘함), 엔진 대기(자리를 못 찾아 그림이 없는 `*_NO_ROOM`·`*_NO_PLACE`·`*LABEL_TOO_LARGE`·`LAYOUT_INVENTORY_INCOMPLETE`: 엔진이 차선 자리에 놓아야 풀림), 판정 불능(`WORKER_TIMEOUT`·`*PREFLIGHT_FAIL`·`*DISPLAY_ENVELOPE*`: 점수로 덮지 않는다), 막음.
- **막음(0점, 총점과 무관):** 틀린 값, 문제 그림에 정답 노출, 필수 값 누락, 깨짐·빈 그림, 라벨이 엉뚱한 대상을 가리킴(소속 오류), viewBox 밖 잘림, 라벨이 다른 라벨·도형에 절반 이상 가림, 값 숫자를 못 읽을 만큼 겹침. 표에 없는 코드는 막음으로 본다.
- **기준표 v2 (원장님 2026-11-23: "최대한 많이 통과시키고 추후 다시 작업하든지 써 보든지"):** 정도 숫자가 없는 감점 코드의 고정 감점을 6에서 3으로 낮췄다(가벼운 흠 3건까지 90점 통과). 합격선·막음 규칙은 그대로다. 영수증의 `tableVersion`으로 어느 기준표로 채점했는지 알 수 있어, 나중에 낮은 점수(v1 점수·경계)부터 다시 렌더·재채점할 수 있다.
- 기준표는 `version`(영수증에 `tableVersion`으로 적는다)을 갖고, 필드·코드는 추가만 한다. 기준을 낮추려면 버전을 올리고 이유를 적는다.
- **2단계(2026-11-23):** 렌더 뒤 관측기가 그림을 실패시켜도 후보 SVG와 위반 목록 전체를 남긴다. 실패 결과 옆에 `<name>-candidate.svg`, 결과 JSON에 `violations`(코드·라벨 id·정도)와 `scoreGate`(`status` SCORED_PASS|FAIL_SCORE|BLOCK…, `score`, `deductions`, `tableVersion`)가 붙는다. 통과하는 그림의 SVG·결과는 그대로다(성공 결과에는 새 필드가 없다). `status`는 FAILED로 둔다: SCORED_PASS는 게시 관문이 받아 주는 후보라는 표시이고, 후보를 아카이브 캡처에 묶어 게시하는 단계는 다음 일이다. 정도 숫자는 관측기가 이미 계산하던 값을 위반 항목에 싣기만 한다(검사 로직 불변). 배치 단계에서 멈추는 코드(`STAT_*` 배치, `*_NO_ROOM` 등)는 후보가 없다(생성기가 차선 자리에 놓아야 풀린다).
- 표본 PNG는 아카이브 실제 표시 크기로 본다: A4 쪽 단 폭 316px(`archive/figure-size.css`의 `--ap-col-w`)에서 문제 그림 75%(`--ap-fig-q`)·해설 그림 80%(`--ap-fig-sol`), 휴대폰은 390px 폭. 값은 이 파일에서 직접 읽는다.
- 이유: 모든 겹침·근접을 실패로 두면 학생이 읽는 데 지장이 없는 그림까지 게시가 막혀 그림이 쌓인다(실패 213건 중 SVG가 남은 것은 0건).

### 해설 그림 장부 (2026-11-17)

- 장부는 시험지 하나에 파일 하나다: `archive/tools/geometry-equation/production/exam-figure-ledger/<archive/exams/original 아래 경로>.json`(머리는 `_meta.json`). 옛 한 파일 `exam-figure-ledger.json`은 없앴다. 읽기·쓰기는 `ops/svg-m1/figure_ledger.py`·`figure-ledger.cjs`와 그것을 쓰는 도구(`ledger-upsert.py` 등)로만 하고 손으로 고치지 않는다.
- 쓰기는 문항 단위다. 이미 PUBLISHED인 문항은 spec의 `published`·`exempt_override`·`demote`로 그 번호를 직접 넘길 때만 바뀐다. 일부 문항만 다시 게시해도 나머지 PUBLISHED는 그대로다. CLOSED는 모든 문항이 PUBLISHED/EXEMPT일 때만 저장된다.
- 서로 다른 시험지의 그림 PR은 장부에서 충돌하지 않으므로 순서를 기다리지 않고 각자 검수를 통과하면 병합한다(CI 녹색은 병합 조건이 아니다: common.md). 같은 시험지 파일이 충돌하면 main 판을 받고 그 시험지에 `ledger-upsert.py`를 다시 돌린다. 옛 한 파일을 고친 열린 PR은 `python archive/tools/geometry-equation/ops/svg-m1/figure_ledger.py port-ledger-change --base <갈라진 main 커밋> --head <브랜치>`로 옮긴다(PUBLISHED를 내리는 변경은 충돌로 멈춘다).
- 전체 요약 `production/exam-figure-queue.md`는 게시 때 고치지 않고, 필요할 때 `figure_ledger.py queue`로 다시 만든다.
- 이유: 한 파일 장부를 모든 그림 PR이 고쳐 서로 다른 시험지 PR도 하나씩만 병합됐고, 부분 게시가 기존 PUBLISHED를 OPEN으로 덮은 사고(22개 시험지 402문항, PR #1778로 복구)가 있었다.

### 현행 흐름 (2026-11-19) — ① 대규모 캠페인(SVG 라인)
1. **DeepSeek 초안**(`opencode-go/deepseek-v4.1-flash`, effort 설정 없음). 시험지 단위로 `ops/claude-batch/ds-launch-exam.sh <key> <시험지 JS>`를 띄운다(지시문 `prompts/ds-exam-draft.md`). 전 문항의 그림 필요 여부를 판정하고 item/plan/publish JSON을 쓰고 `node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <dir>`로 ARCHIVE_BOUND까지 렌더한 뒤, `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`으로 만든 PNG를 **직접 보고** 1차로 고친다. DeepSeek은 그림을 본다(2026-11-16 `opencode run -f <png>`로 정육각형 라벨 순서·대각선까지 읽음 확인). 실행 안에서 PNG를 못 열면 메모에 남기고 시각 판단은 Sonnet에 넘긴다.
2. **Sonnet 검수·마감은 한 번**(effort high, 지시문 `prompts/sonnet-exam-impl.md`). 원문·정답·해설과 PNG를 대조하고 plan을 고쳐 다시 렌더한다(손 SVG 금지). 최종 판정표와 기계 점검(ARCHIVE_BOUND, publish size = sizeClass, alt·caption 비어 있지 않음)을 낸다. 두 번째 Sonnet 검수는 두지 않는다. 메인이 PNG 표본에서 결함을 찾으면 메인이 직접 plan·publish를 고쳐 `render.mjs`로 다시 렌더한다(손 SVG 금지; 이유: 결함 하나에 지시서를 쓰고 Sonnet을 다시 돌리는 것보다 빠르다). 같은 묶음에 결함이 여럿이거나 같은 종류가 반복되면 지적 목록을 붙여 그 묶음을 Sonnet 검수·마감 단계로 돌려보낸다. `sonnet-final.md`는 과거(Sonnet B) 지시서다.
3. **메인이 PNG 표본을 확인한 뒤 게시하고 PR을 올린다.** 게시 도구는 `ops/svg-m1/publish-exam.py`·`pubflow.py`이고 사용법은 HANDOFF 문서 §3-2·§4다. 시험지 5개쯤을 PR 하나로 묶는다.
4. **엔진 미지원(손으로 메우지 않는다)은 백 개 중 한두 개가 정상이다.** 더 많으면 plan부터 의심한다. 손으로 그리지 않고, 지시선·패널·옵션으로 시도한 증거와 오류 코드를 붙여 UNSUPPORTED로 두고 그림은 보류한 뒤 `ops/claude-batch/ENGINE_GAPS*.md`에 남겨 엔진 라인으로 넘긴다. 큰 묶음(플랜이 많이 쌓인 경우)은 같은 단계를 묶어 돈다: 일괄 렌더 → 자동 관문 → Sonnet 모음 시트 눈 검수 → 실패분 처리(SPEC은 플랜 수리, ENGINE은 엔진 라인) → 게시.
5. **plan 사전검사:** plan을 쓴 뒤 렌더 전에 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json…>`로 검사하고 OK가 될 때까지 고친다(문항당 1초 안팎). 렌더 결과에 좌우되는 오류(라벨 배치, 표시 크기 일부)는 lint로 못 잡는다. 이유: 2026-11-20 렌더 실패 1,008개 중 863개가 렌더 없이 잡히는 plan 형식 오류였다.
6. **공장 동시 렌더:** 재사용 엔진(#2590 병합)부터 동시 4개가 기본이고 6개까지 새 실패가 0이었다(8코어 16스레드 PC). 다른 렌더가 함께 돌면 4로 둔다. 이유: 예전 상한 2는 4코어 PC와 매번 python·Chrome을 띄우던 엔진 기준이었다.
**② 문항 몇 개만 그릴 때(문항 수리·유사문제 반입 등, DeepSeek 없이 Sonnet 작업자가 직접)** 저장소 루트, 새 작업 트리 기준: `mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/` → `bash archive/tools/geometry-equation/ops/claude-batch/restore.sh`(`.tmp/work/`로 펼침) → 렌더 의존성(playwright가 든 node_modules)이 없으면 `GEOMETRY_NODE_MODULES` 지정 → 먼저 `AUTHOR_GUIDE.md`와 `.tmp/svg-m1/guide/`의 해당 형태 가이드를 읽고, 문항 폴더마다 `item.json`({"sourcePath": 시험지 JS 경로, "ordinal": 문항 id})·`plan.json`(`ops/golden/<item>/plan.json`이나 같은 형태의 통과 사례 `.tmp/work/runs/*/exam-rev/qNN/plan.json`을 본떠 값만 바꾼다)·`publish.json`(alt·caption·size=sizeClass) 작성 → `node .tmp/work/render.mjs --item item.json --plan plan.json --out <dir>`로 ARCHIVE_BOUND 확인 → `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`으로 PNG를 만들어 원문·정답·해설과 직접 대조 → PNG를 메인에게 제출(메인이 눈으로 검수·마감) → 통과분을 `make-dec-exam.cjs`·`build-pub.py`(BAD 없음)·`pubflow.py --batch`로 게시. 손 SVG 금지, 결함은 plan을 고쳐 재렌더.
**현행으로 살아 있는 품질 규칙:** y=x·기울기 ±1 직선·원이 있는 단일 유리·무리함수 그래프는 `equalUnits:true`를 쓰고 PNG를 정답·해설과 대조한다(눈금 비 차이로 45°보다 가파르게 그려진 그림이 검수를 통과해 사용자가 지적했다). 정해진 DeepSeek·Sonnet 단계 밖의 다른 모델·하위 에이전트에 구현·검수를 넘기지 않고, PNG는 직접 보고 판단한다. 이 흐름에서는 대기열 상태 줄·잠금 같은 라인 간 조율 문서를 쓰지 않는다. 옛 루나 구현·검수 절차(2026-11-04~08)는 git 이력에 있다.


## 확률과 통계 해설 그림 필요 판정 (2026-11-19, 사용자 지시)

확률과 통계도 "학생 풀이에 조금이라도 도움이 되면 만든다"는 기준을 따른다. 다만 해설 식을 그림으로 한 번 더 옮긴 것은 도움으로 보지 않는다.
- **만든다:**
  - 경우를 나열해 보여 줘야 하는 수형도(`stat-chart-figure-v1` TREE)
  - 정규분포·연속확률분포 곡선과 구간 넓이(NORMAL_CURVE)
  - 넓이로 푸는 확률밀도 그래프
  - 이산확률분포 막대
  - 칸 묶음을 강조하는 주사위 6×6 표
  - 사건 관계가 풀이의 핵심인 벤다이어그램
  - 원순열 배치, 최단경로 격자
- **EXEMPT:**
  - 곱의 법칙·순열·조합·이항계수의 단순 계산(4×3, 5×4, ₅P₂ 같은 것)
  - 식만으로 끝나는 확률 계산
  - 해설에 이미 같은 나열이 있는 문항

  사유에는 "무엇을 계산하는 문제라 그림이 보탤 정보가 없다"를 적는다.
- **확률분포표·분할표 같은 표**는 SVG로 그리지 않고, 해설 글 안에 AP Table Engine(HTML 표, [table-engine.md](table-engine.md))으로 넣는다.
- 이미 게시한 확통 그림은 이 절 때문에 되돌리거나 지우지 않는다. 새로 판정하고 만드는 문항에만 적용한다.
- 이유: 단순 계산 문항에도 해설 식과 같은 내용의 그림을 억지로 넣은 경우가 있었다. 다른 과목은 그래프·단위원·도형이 실제로 필요해서 이 문제가 확통에만 있다.

## 해설 그림 정보 우선 (2026-11-17, 사용자 결정)

해설 SVG는 학생이 그래프를 보고 이해해 마지막에 정답을 유추하게 돕는 것이라 풀이 과정 정보를 최대한 넣고, 정답이 그림에 있다는 이유로 반려하지 않는다(정답이 꼭 있을 필요도 없다). 문제 그림은 종전대로 정답·새 풀이 보조선을 노출하지 않는다. 이 절이 이전의 해설 그림 정답 숨김·정답 노출 FAIL 조항(공통 프롬프트, 고1 2학기 기말 경로, AUTHOR_GUIDE, ops 지시서·인계 문서)보다 우선한다. 이유: 학생 화면(`archive/engine.html`)은 [정답]을 맨 위에 보여 준 뒤 해설 그림을 붙이므로 정답을 숨겨도 막는 것이 없고 그림만 빈약해지며, 정답 관련 좌표·눈금·식을 모두 숨긴 사양 8개가 축 이름만 남아 렌더 관문에서 실패했다.

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
      결과가 ARCHIVE_BOUND여야 한다. 렌더 횟수에는 제한을 두지 않는다(사용자 지시 2026-11-07: 필요하면 충분히 여러 번 렌더한다. 횟수 한도는 품질을 막을 뿐 의미가 없다). 렌더는 한 번에 하나씩 한다. 부하가 높으면 기다린다.
   e. figure.png를 직접 보고 3번 기준으로 확인한다.
   f. publish.json을 쓴다: {"alt": 그림 설명, "caption": 풀이 요약 + 끝에 정답, "size": 렌더 결과 figure-result.json의 sizeClass와 같은 값}
   g. out/figure-solution.svg 루트에 role="img"와 깨지지 않은 <title>이 있는지 본다. plan의 한글 문자열은 UTF-8로 쓴다(깨진 글자가 그대로 SVG 제목이 된다). 합성 패널(composite-panels)·수직선·입체 출력도 엔진이 루트 role="img"·<title>·<desc>를 직접 쓴다(plan `caption`·선택 `accessibilityDescription`, 단일 그림과 같은 출처). 별도 보완 스크립트(a11y.sh·upgrade-svg-accessibility.mjs)는 이 엔진 이전에 만든 SVG에만 쓰며, 이미 들어 있으면 `METADATA_ALREADY_PRESENT`로 거절된다.

3. 판정 기준(학생 기준, 모두 지킨다)
   - 해설 그림: 풀이 과정의 정보(해설이 쓰는 교점·극점 좌표, 눈금, 곡선 식, 보조선, 중간값, 경계 곡선·직선)를 최대한 넣는다. 정답(구하는 값, 보기 번호, 서술형 소문항 답)은 그림에 있어도 없어도 된다. 정답이 보인다는 이유로 반려하지 않으며, 반려 사유는 과정이 빠졌거나 틀린 것이다. caption은 풀이 요약 + 끝에 정답이다("해설 그림 정보 우선" 절, 2026-11-17).
   - 문제 그림: 정답과 새 풀이 보조선을 노출하지 않는다(기존 규칙 유지).
   - 자리가 없을 때 hideLabels·좌표 띠 등으로 정리하는 것은 레이아웃 도구이지 정답 숨김용이 아니다.
   - 라벨은 이름 붙인 대상 곁에 둔다. 떠 있으면 지시선(callout, leader)을 먼저 쓰고, 필수 라벨을 지워서 통과시키지 않는다.
   - 점 이름은 선 안쪽, 길이 치수선은 바깥(짧은 것 안, 긴 것 밖)에 둔다.
   - 같은 각·길이, 평행, 대응변, 같은 넓이는 같은 색으로 묶는다(핵심 2~3개, 주로 BLUE·WARM).
   - y=x 대칭, 정사각형, 기울기가 중요하면 가로·세로 눈금을 같게 한다(equalUnits, multi-curve는 기본이 같은 눈금).
   - 해설이 쓰는 교점은 그림 창 안에 있어야 한다. 곡선이 해설의 어느 함수(f, g, f⁻¹…)인지 그림에서 보여야 한다.
   - 입력용 표기(^, sqrt, *, ^c, f^-1)를 쓰지 않는다. 수식 필드로 위첨자·근호를 쓰고, 글자만 받는 곳은 같은 뜻의 식으로 바꾼다.
   - 문제 그림의 점 이름과 배치를 따른다. 작은 패널 여러 개보다 큰 그림 하나를 쓴다(합동·닮음은 아래 예외).
   - 합동·닮음 해설 그림은 항상 두 그림을 함께 보인다: ① 문제 배치 그대로의 그림, ② 대응하는 두 도형을 떼어 같은 방향으로 나란히 펼친 그림(대응 꼭짓점 이름 유지). composite-panels-v1(평면도형 패널)로 한 장에 담고, 두 패널에서 같은 색·같은 눈금/호 표식 = 같은 대응이다. 휴대폰 폭에서 작으면 세로로 쌓는다. 문제 그림에서 이미 두 도형이 떨어져 같은 방향이면 ①로 충분하다. 엔진이 못 그리면 ②를 빼고 통과시키지 말고 UNSUPPORTED로 둔다. 이유(사용자 2026-11-10): 중등 학생은 겹치거나 꼭짓점을 공유한 도형을 펼쳐 보지 않으면 대응을 이해하지 못한다.
   - 예시 값으로 그린 그림은 caption에 "예:"라고 밝힌다. 근사로 만든 좌표값은 그림에 쓰지 않는다.
   - 유리함수·무리함수 단일 그래프(rational, sqrt-affine 등)는 기본 눈금 비가 달라 y=x가 45°보다 가파르게 그려진다. y=x·기울기 ±1 직선·원이 있으면 반드시 graphPlan.equalUnits:true를 쓰고 PNG에서 45°인지 본다.
   - 곡선이 여럿이면 각 곡선의 라벨을 실제 그 곡선 곁에 지시선으로 붙인다. 라벨 자리가 없다고 숨기거나 엔진 공백으로 넘기지 않는다.
   - 해설에 없는 보조 경로·예시 선을 함수 그래프와 같은 실선으로 그리지 않는다. 반복(합성) 경로는 세로·가로 선분을 끊김 없이 잇고, caption이 값으로 설명하는 점은 그림에서 그 값을 읽을 수 있게 한다(점 라벨·축 눈금 라벨).
   - caption·alt는 그림에 실제 보이는 이름·요소만 가리킨다("그림의 C"라고 쓰려면 그림에 C가 있어야 한다).
   - 그림은 고1 교육과정 안의 대상과 해설이 실제로 쓰는 방법만 그린다. 엔진이 못 그린다고 교육과정 밖 그래프(분모가 2차·3차인 유리함수 등)나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 검토한다. 치환 변수를 쓰면 문제 변수와 다른 이름을 쓴다.
   - 이유(2026-11-08 사용자·최종 검수 지적): y=x 반복 경로 그림이 눈금 비 차이로 가파르게 그려져 두 단계 검수를 통과했고, 라벨을 숨긴 곡선 4개·끊긴 반복 경로·교육과정 밖 4/t³ 그래프가 게시 직전까지 갔다.

4. 막히면
   - 지시선 → plan 구조 바꾸기 순서로 시도한다. 그래도 안 되면 UNSUPPORTED로 두고, 빠진 엔진 기능을 정확히 적는다(ops/svg-m1/gaps.md 후보).
   - 엔진 공백은 문항마다 고치지 않고 모아 두었다가 한 번에 설계한다(사용자 결정 2026-11-08, 설계는 Sonnet). 그동안 해당 문항은 OPEN으로 두거나 교육과정 안의 다른 그림으로 대신한다. 라벨 배치 문제는 공백이 아니라 지시선으로 먼저 푼다. 이유: 라벨 자리 문제 대부분이 지시선으로 해결됐고, 공백을 하나씩 고치면 엔진 변경이 잦아진다.
   - 엔진 코드 수정은 이 프롬프트 범위 밖이다. 별도 지시서(ops/svg-m1/briefs/engine-*.md 형식), 별도 작업 공간, 다른 검수자, 정답지 표본 비교를 거친다.
   - 문제 그림과 해설·정답이 서로 맞지 않으면(CONTENT) 그리지 않는다. 문제 기준으로 다시 계산한 정답과 근거를 보고한다.

5. 검수와 게시
   - 다른 AI 인스턴스가 ops/svg-m1/briefs/review1.md로 그림과 publish.json을 검수해 PASS한 것만 게시한다.
   - 게시는 .tmp/svg-m1/pubflow.py로 한다(HANDOFF §00 "시험지 하나 처리 절차"). 이미 그림이 있는 문항을 교체할 때는 rows에 "replace": true를 넣는다.
   - 게시 뒤 더 쓰이지 않는 옛 그림은 정리한다. 커밋에는 운영물만 넣고, 증거와 렌더 출력은 넣지 않는다.
   - 원본 시험지·공유 데이터 고정값 규칙(docs/agents/common.md)을 지킨다. 병합 뒤 main CI에서 내 변경이 만든 실패를 고친다(CI 녹색은 병합 조건이 아니다: common.md).

6. 브라우저 렌더를 돌릴 수 없는 라인
   - item.json, plan.json, publish.json 초안까지만 만들고, 렌더·검수·게시는 실행 가능한 라인에 넘긴다.
   - 렌더하지 않은 그림을 PASS로 적지 않는다(NOT_RUN).

보고: 시험지·문항별 상태(ARCHIVE_BOUND / FAILED / UNSUPPORTED)와 렌더 수, 확인한 PNG 경로, CONTENT, 엔진 공백, 사용자 결정이 필요한 것.
```
