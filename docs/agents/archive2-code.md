# Archive 2.0 화면·엔진 코드

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## Archive 2.0 코드 구현의 최우선 필수 조건

Archive 2.0의 화면, 검색·선택, 출력·미리보기, 저장·출제 연결, 공통 엔진 및 저장소 코드를 구현·수정할 때 반드시 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 먼저 읽고 따른다. 기능 추가·리팩터링·업데이트에도 동일하게 적용한다. 기능이 동작한다는 이유로 느린 클릭, 무응답, 빈 창, 저장소 의존 회귀를 허용하지 않는다.

- 원본 기출의 시험·해설·정답은 Archive 1의 `engine.html?data=exams/<file>&mode=exam|sol|ans` 직접 열기 경로를 유지한다. IndexedDB/localStorage에 원본 전체를 복사해야 열리는 구조로 되돌리지 않는다.
- 사용자의 클릭에 즉시 반응한다. 오래 걸리는 준비는 첫 화면 반응과 분리하고, 빈 화면이나 끝나지 않는 로딩으로 숨기지 않는다. 실제 아카이브 크기의 클릭 성능과 저장소 오류·용량 초과를 검증한다.
- 구현 완료·병합·MAIN_DONE 전에 `node tools/check-archive2-runtime.cjs`를 실행하고 결과를 확인한다. 해당 흐름을 바꿨다면 실제 Chrome 검증도 실행한다. 검증하지 않은 항목은 PASS로 기록하지 않는다.
- 이 검사를 생략·격리하거나 데이터 분모를 줄이고, 시간 상한·검증 조건을 완화하여 통과시키지 않는다. 구조 변경이 필요해도 기존 동작·응답성·내용 검증을 먼저 보존한다. 이 계약 자체의 변경은 명시적인 사용자 지시와 근거를 필요로 한다.
- 시험지 source만 수정하는 CREATE/R1/R2/R3 작업은 기존 시험지 품질 절차를 따른다. 런타임 흐름도 바꾸는 경우에는 이 계약을 함께 적용한다.

## 교사 화면 코드(`archive2-workspace*.js`) 파일 지도 (2026-11-19)

- 이유: 388KB 파일 하나를 고치는 PR이 한 번에 하나만 갈 수 있어 네 줄기(자료 로딩·저장/오류 문구·미리보기/인쇄·선정 결과 표시)가 서로 기다렸다. 함수 본문은 한 글자도 바꾸지 않고 파일만 나눴다(동작·출력 불변). 이 문서 아래 본문의 `archive2-workspace.js` 언급은 아래 표에서 그 함수가 있는 파일을 뜻한다.
- 일곱 파일은 `workspace.html`에 **core → find → compose → preview → save → recent → main** 순서로 로드하고, 모두 `window.Archive2Workspace` 하나를 공유한다(번들러·모듈 없음).

| 파일 | 담는 것 |
| --- | --- |
| `archive2-workspace-core.js` | 공용: `state`, `$ esc button`, API 클라이언트(`api`·`headers`), 필터·매칭 규칙, `showDialog`. 다른 파일을 부르지 않는 말단 |
| `archive2-workspace-find.js` | 자료 로딩 뒤 홈, 학교별 기출 찾기, 유사문제 목록, 자료 점검 |
| `archive2-workspace-compose.js` | 문제지 구성·선정·교체: 단원 트리, 빠른 평가, 선정 결과 표시, `generate/replace/prepare/request/review/seal` |
| `archive2-workspace-preview.js` | 미리보기·인쇄: `updatePreview/outputUrl/print/finalGate/download`, 원본 출력 |
| `archive2-workspace-save.js` | 저장·초안·출제 연결·오류 문구: `savePapers`, 초안 저장·복원, 저장본 수정, 출제 패널 열기, `status/teacherErrorMessage` |
| `archive2-workspace-recent.js` | 출제 내역 화면·취소·PDF 재시도 |
| `archive2-workspace.js` (main) | `render` 분기, URL 쓰기·읽기, **이벤트 리스너(클릭 처리기 포함)**, 부팅. 맨 마지막에 로드 |

- **이름 주고받기**: 각 파일은 끝에서 자기 최상위 이름을 `Object.assign(WS.api, {…})`로 내놓고, 다른 파일의 이름은 맨 위 `let …;`(헤더)와 `WS.links.push(…)`로 받는다. **다른 파일의 함수를 새로 부르면 그 파일 헤더 두 곳(let 목록·구조분해)에 이름을 더한다.** `tests/archive2-workspace-parts.test.js`가 빠뜨린 이름·주인 없는 이름·로드 순서·Pages 목록 누락을 잡는다.
- **여러 파일이 바꾸는 변수는 `V.이름`**(`WS.v`)이다(예: `V.previewTimer`, `V.classRows`). 새로 파일 사이에서 공유할 변경 가능한 변수가 생기면 `V`에 둔다.
- **캐시 버전**: 파일마다 자기 `?v=`를 두고 그 파일을 바꾼 PR만 올린다. 코드에서 이름을 새로 내놓거나 받으면 두 파일 모두 바뀌므로 둘 다 올린다. 새 파일은 `tools/archive-pages-release-manifest.json`에도 올린다.
- **compose의 "종이 만들기" 함수(`prepare/request/review/seal/pool/replace`)는 미리보기·저장도 부른다.** 서명을 바꿀 때는 호출하는 쪽 파일을 같이 고친다.
- **테스트는 파일 이름을 직접 읽지 않는다**: `tests/helpers/archive2-workspace-source.cjs`의 `readWorkspace()`(전체 텍스트), `loadWorkspace(ctx, 훅)`(vm에 올리고 훅 실행)을 쓴다. 판본 `?v=` 값은 고정하지 않는다.

## 시험지 보관함 "26년 2학기 기말 모의고사" (2026-11-19 사용자 요청)

- 원장·선생님이 학생에게 바로 출력하는 중1 2학기 기말 모의고사 1~5회(각 객관식 20 + 서술형 4)를 옛 원클릭 보관함(`archive/assessment/assessment-mvp.html`)의 맨 앞 탭에 둔다. 자료는 `archive/assessment/assessment-packs-2sem-final-mock.generated.js`(`window.APMATH_ASSESSMENT_PACKS_MOCK_2SEM_FINAL`)이고, `mixed_engine.html`의 `packId` 대체 경로가 이 파일도 읽는다. 진입은 APMS 기존 "시험지 보관함"(원장 대시보드 카드, 선생님 서랍)이며 첫 탭이 모의고사다. `?category=<탭 이름>`으로 탭을 지정할 수도 있다.
- 자료 파일은 손으로 고치지 않는다. 선정 목록(`archive/tools/assessment-mock/selection-m1-2final-mock.json`: 회차·번호·출처 파일·원 문항 번호·단원·세부 유형)을 고치고 `node archive/tools/assessment-mock/build-m1-2final-mock.cjs`로 원본 시험지 JS에서 다시 조립한다(`--check`는 일치 검사, `--tsv <경로>`는 목록 출력). 이유: 문항·정답·해설·그림 참조는 원본 그대로 복사해야 하고, 바뀌는 것은 서술형 앞머리의 원 시험지 번호 표기("[서술형3]" 등) 제거뿐이다.
- 선정 규칙: 2024·2025년 기출 우선(부족한 칸만 2023), 2026년 시험지 제외, 한 회차 안에 같은 세부 유형 없음, 한 회차 안 같은 시험지 최대 3문항, 5회 사이 문항 겹침 없음. `tests/assessment-mock-2sem-final-packs.test.js`가 결함 조건을 검사한다.

## 화면 디자인 (2026-11-10 사용자 결정)

- 화면 디자인은 `archive/DESIGN.md`를 따른다. 색·글꼴·모양은 `archive/archive2-tokens.css` 한 곳에서 정의하고, 화면 CSS에 색 숫자를 직접 쓰지 않는다. 메뉴는 `archive2-navigation.js`(PC 6칸 / 휴대폰 6칸)가 `workspace.html`과 `unit-past-exams.html`에 같이 그린다. 이유: 화면마다 모양이 달라 완성도가 낮아 보인다는 사용자 지적이 있었다.
- `apmath/DESIGN.md`는 APMS용이라 별개다.
- 출력 창(`engine.html`·`mixed_engine.html`) 위 조작줄은 `archive/archive2-output-bar.css`가 맡는다(화면 전용 `@media screen`, 토큰은 layer로 불러 종이 글꼴·바탕을 바꾸지 않는다, 웹 글꼴은 부르지 않는다). 자세한 규칙은 `archive/DESIGN.md` "출력 창 조작줄". 이유: 웹 글꼴이 늦게 도착하면 런타임이 종이를 다시 그리고, 토큰의 `:root` 글꼴·바탕이 종이에 번지면 인쇄가 바뀐다.
- 원본 기출 머리글 제목(시험지·해설·정답)은 읽기 쉬운 이름이다(`archive/exam-display-title.js`, 예: `2022 강남여고 고1 1학기 중간`). CI 출력 확인(`archive2-output-performance-browser.cjs`, `archive2-solution-loading-browser.cjs`)은 2026-11-18부터 현재 코드만 렌더해 오류·미렌더·시간을 본다. 기준 커밋과 쪽수·본문 해시·블록 좌표를 비교하는 장치(OUTPUT_PARITY, `archive2-output-comparison-references.json`, 릴리스 자격 게이트)는 뺐다. 이유: 렌더러·그림 크기 규칙을 일부러 바꿀 때마다 기준 커밋을 옮겨야 해서 모든 엔진 PR이 막혔다. 수동 비교가 필요하면 `ARCHIVE_PERFORMANCE_BASE_SHA`를 직접 줄 수 있고, 기준 쪽 서버만 시험지 JS 끝에 같은 해석 함수를 붙여 같은 제목을 받게 하는 `serve(..., { referenceDisplayTitle: true })`가 그대로 남아 있다.

## 시험지 끝 제출 QR (2026-11-01 사용자 결정)

- 제출 QR은 **기본 숨김**이고 선생님이 엔진의 `QR 출력 > 정답지 제출 QR`을 켰을 때(`showSubmitQr=1`)만 마지막 장에 그린다. 연결은 고장 난 `/check/`가 아니라 **학생 포털**(`apmath/student/?omr=1&exam&date&q&archiveFile`)이다. 이유: 시험지를 반에 출제하면 흐름이 자동으로 `submitQr=1`을 붙여 모든 시험지에 QR이 떴고, `/check/`는 배포에서 빈 화면이었다.
- `submitQr=1`은 이제 **반 출제 등록(블루프린트·출제이력) 신호**일 뿐 QR 표시와 무관하다. 둘을 다시 묶지 않는다(묶으면 출제 등록을 끄지 않고는 QR을 숨길 수 없다).
- `check/index.html`은 옛 인쇄 QR을 위해 학생 포털(`?omr=1`)로 넘기는 페이지로 남긴다. APMS의 QR 공유 카드(`apmath/js/qr-omr.js`)도 같은 학생 포털 주소를 만든다. 해설·포털 QR(`solQr`, `portalQr`)은 그대로다.

## 해설지 반폭 칸 넘침 처리 (2026-11-02 사용자 결정)

- 해설 상자가 83mm 반폭 칸을 가로로 넘쳐도 **자동으로 전폭 승격하지 않는다.** 먼저 `sol-fit-narrow`(줄바꿈·인라인 고정폭 이미지/표를 칸 폭에 맞춤)와 글자 단계 축소(`data-sol-fit` 1~4)로 칸 안에서 해결한다(`archive/layout-materializer.js` `fitSolutionToNarrowColumn`). 잘라 숨기는 `overflow:hidden`은 쓰지 않는다. 이유: 사용자 PC에서 4번 해설 하나가 2px 넘쳤다고 판정되어 그 쪽 전체가 1단이 되고 쪽 수가 늘었다(강남여고 고1 공통수학2).
- 어떤 수단으로도 안 맞을 때만 마지막 수단으로 그 상자를 전폭 승격하고 `[archive-solution]` 경고를 남긴다. 완전히 없애지 않는 이유: 인라인 `max-width:400px` 이미지가 있는 시험(강남여고 고2 대수, 순천여고 고1 공통수학2)에서 승격이 없으면 가로 넘침 게이트(S12)가 렌더 전체를 막아 해설지가 안 열린다.
- 명시적 전폭(`solutionImageLayout:'fullwidth'`)은 2026-11-18부터 배치에 쓰지 않는다(아래 "그림 크기는 단 폭 비율 하나").

## 문항 하나가 칸에 안 맞아도 시험지 전체를 막지 않는다 (2026-11-17)

- 시험지(`archive/exam-render-executor.js` `render`): 글자·그림을 가장 작은 단계(`fit-micro`)로 줄여도 칸 안에서 잘리는 문항(readiness와 같은 기준: 잘림 overflow + 스크롤 크기 > 칸 크기 + 3px)은 그 문항만 단계적으로 키워 다시 쪽 나누기를 한다. 순서: ① 같은 열에서 세로로 길게(칸 2개 높이 … 열 전체, `data-ap-fallback="tall-N"`) → ② 한 줄 전체 폭 칸(`row`) → ③ 쪽 전체(`page`, 진짜 특별한 경우만). 맞는 문항의 배치는 그대로이고, 넘치는 문항이 없으면 한 번만 배치한다. readiness 검사·허용값은 건드리지 않는다. 사용자 결정(2026-11-17): 쪽 전체는 특별한 경우만, 세로로 길게가 기본. 이유: 단원별 기출 「원의 성질 › 원과 직선 · 2단계 · 1권」에서 문항 하나(4번·41번)가 8~170px 넘쳐 `PDF readiness failed: content clipped`로 시험지 전체가 출력되지 않았다.
- 수식 공백(`mjx-stretchy-h > mjx-ext` 안 `mjx-spacer`)이 상자 오른쪽으로 몇 px 삐져나와 가로 넘침으로 잡히는 경우(향림중 5번)는 칸을 키우지 않고, 그 문항에 한해 `data-ap-mjx-clip`을 달아 `mixed_engine.html` CSS `[data-ap-mjx-clip] mjx-stretchy-h > mjx-ext { contain: paint }`로 처리한다(잘린 문항만, 폴백 단계보다 먼저 한 번). `overflow:clip/hidden`은 readiness가 잘림으로 보므로 쓰지 않는다. 전역 `contain: paint`는 쓰지 않는다. 이유: 처음에 전역으로 넣었더니 Chrome PDF 인쇄 픽셀 parity(Archive printed pixel parity)가 8건 깨졌다.
- 조건/보기 상자(`.box`)를 `display:block`으로 바꾸는 CSS는 전역으로 두지 않는다. 페이지 이미지 인쇄(html2canvas)의 `onclone`이 클론 문서에 `ap-h2c-clone` 클래스를 달 때만 적용한다. 이유: 전역 변경은 평소 Chrome PDF·화면의 줄 높이를 바꿔 인쇄 픽셀 parity를 깬다.
- 해설지(`archive/solution-render-executor.js` `renderSplitSolutionBox`): 첫 상자(문제 다시보기+그림+정답)의 풀이 조각 하나가 기존 `autoCompress`(글자 축소) 뒤에도 칸을 3px 넘게 잘라 먹으면(readiness 기준), 그 조각을 "{번호}. (이어짐)" 라벨이 붙은 다음 칸 이어짐 상자로 보낸다(머리가 칸에 들어갈 때만). 이어짐 라벨은 이 구제 경로로 만든 상자(와 그 뒤 이어지는 상자)에만 붙이고, 기존 경로로 잘 나오던 해설은 main과 DOM·높이가 그대로다. 이유: 같은 1권 해설지 4번이 칸보다 50px 커서 해설지 전체가 열리지 않았고, 처음 구현이 모든 이어짐 상자에 라벨을 달고 구제 전 축소 없이 쪼개 50문항 해설 parity(bodyHash·블록 높이)를 깼다. `mixed_engine.html`의 "상자 안 상자는 한 테두리" CSS도 기존 해설 블록 높이를 23~24px 줄여 같은 parity를 깨므로 이 변경에서 뺐다(필요하면 parity 기준 정정과 함께 따로 한다).
- 같은 흐름의 `renderComposed`(반 합성·클리닉 출력)와 권위 배치(`layout-authority`)는 이 폴백이 없다. 같은 증상이 나오면 같은 방식으로 옮긴다.

## 해설·정답 열람은 잠그지 않는다 (2026-11-10 사용자 결정)

- `engine.html`의 `qr=1`·`mode=`는 화면 구성용 값이며 열람 제한 장치가 아니다. 학생이 주소를 바꾸면 해설·정답이 열리지만, 이를 막는 잠금을 추가하지 않는다. 이유: 공부용으로 시험지를 받은 학생이 몇 문제 풀고 바로 확인하는 경우가 있어서다.
- 이 동작을 바꾸려면 사용자의 명시적인 지시가 필요하다.

## 해설 SVG는 라벨 크기 기준으로 표시 (2026-11-11 사용자 결정)

> 2026-11-18: A4 쪽 배치에서는 아래 계산(자연 폭 x 0.6, 칸 90%·340px)을 "그림 크기는 단 폭 비율 하나" 절의 규칙(해설 그림 60%)이 대체한다. 아래 계산은 휴대폰 읽기 배치와 오답 엔진에서만 쓰인다.

- 해설 그림이 `.svg`이면 저장된 `solutionImageSize`(small·medium·large·full)와 무관하게 **표시 폭 = 자연 폭 × k(k=0.6), 칸 폭이 상한, 높이 auto**로 보인다(자연 폭이 384 미만인 옛 수제 SVG는 1:1로 그려졌으므로 ×1, 칸 폭 상한만 적용. 상수 `SOLUTION_SVG_SCALED_MIN_WIDTH`). 스크립트는 `solution-render-executor.js`의 `applySolutionSvgDisplayWidth`이고, 해설 그림이 모두 불러와진 뒤 쪽 나누기 전에 `img` 폭을 정한다(추가 요청 없음). CSS(`engine.html`·`mixed_engine.html`·`apmath/wrong_print_engine.html`)에는 스크립트가 못 돌 때도 SVG가 105·145·180px 높이 상한에 눌리지 않게 하는 대비 규칙이 있다. 래스터(png/jpg)는 기존 상한(48%·105px / 72%·145px / 92%·180px)을 그대로 쓰고 `layout-fullwidth`(640px 상한)도 그대로다. 휴대폰(640px 이하)은 읽기 모드 CSS가 그대로 칸 폭으로 푼다. 저장된 크기 등급과 시험지 파일은 바꾸지 않는다.
- 이유: 라벨 글자가 화면에서 약 12 CSS px이어야 학생이 읽는다. 그림 엔진의 라벨 기본 글자는 20 SVG 단위이므로 20 × 0.6 = 12px이다. 게시된 medium 그림은 145px 상한에 눌려 라벨이 6~7px이었다(표본 40개 중 39개가 11px 미만). 그림이 화면에서 차지하는 크기는 **캔버스 크기**가 정하므로, 단순한 그림은 작은 캔버스로 그린다.
- 해설 그림이 문항 머리(번호·문제·정답)와 첫 해설 조각과 함께 한 칸에 들어가지 않으면, 그림을 머리에서 떼어 **해설 마지막 조각 뒤**로 옮겨 다음 칸·쪽으로 흘린다(`layout-materializer.js`의 `moveSolutionImageToTail`, 문항당 1회). 그래도 넘치면 기존처럼 `MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE`로 실패한다. 이유: 그림이 머리에 묶여 있어 긴 문제+큰 그림 문항이 쪽 나눔에 실패했고, 그 때문에 해설 그림을 게시에서 빼야 했다(2026-11-11 사용자 지적: 해설이 몇 쪽이든 그림을 빼지 않는다).
- 인쇄도 같은 A4 화면을 쓰므로 쪽 나누기가 함께 바뀐다(그림이 큰 시험은 쪽이 늘 수 있다). 사용자가 쪽 수보다 해설 가독성이 먼저라고 정했다. 화면 전용 CSS로 인쇄만 되돌리려 하지 않는다: 쪽 나누기는 화면에서 `scrollHeight`로 정하고 래스터·네이티브 인쇄가 그 화면을 찍는다.
- 그림 엔진은 이 실제 페이지로 크기 등급별 표시 크기를 재서 글자 크기를 정한다(`measureArchiveDisplayEnvelope`, `record-visual-browser-evidence.mjs`의 측정은 같은 `applySolutionSvgDisplayWidth`를 불러 쓴다). 새 규칙에서는 모든 등급이 같은 크기로 재져 요청 등급이 기본 글자 크기를 바꾸지 않는다. k·상한을 바꾸면 엔진 측정과 `tests/archive-solution-image.test.js`·`tests/archive-solution-svg-size.test.cjs`를 함께 확인한다.

## 그림 크기는 단 폭 비율 하나 (2026-11-18 사용자 결정, 2026-11-17의 large·full 규칙을 대체)

- 적용 범위는 **A4 쪽 배치** = PC 화면의 쪽 보기 + 인쇄 + PDF다. 인쇄는 화면에서 만든 쪽 DOM을 그대로 찍으므로 `@media print`가 아니라 "휴대폰이 아닌 모든 곳"(`@media not screen and (max-width: 640px)`)에 건다. **휴대폰 읽기 배치(<=640px 화면)는 옛 규칙(`engine.html`·`mixed_engine.html`의 등급 CSS, `archive2-preview-mobile.css`)이 그대로**다(학생이 확대해서 봄). 이유: 학생은 문제지를 거의 A4로 뽑아 푸는데 그림이 한 단 폭의 90%로 칸을 채워 풀이 쓸 자리가 없었고, 크기 규칙이 등급 클래스·인라인 max-width·선택지(규칙 없음)·해설 SVG x0.6·균등 칸 78%/150px로 흩어져 서로 다퉜다.
- 값과 규칙은 `archive/figure-size.css`(변수 `--ap-col-w` 83.65mm, `--ap-fig-q` 0.55, `--ap-fig-sol` 0.6, `--ap-fig-wide-w` 0.88, `--ap-fig-wide-h` 0.3)에 있고 숫자 하나만 바꾸면 된다. 규칙은 `@layer ap-figure-size`의 `!important`라서 해설 칸 맞춤(`sol-fit-narrow`)·인라인 `style="max-width:Npx"`·옛 등급보다 이긴다. 문제 그림(필드 그림, 본문 인라인 img·svg, 해설지의 문제 다시보기 그림)은 폭·높이 모두 단 폭의 55% 이하, 해설 그림(필드, 해설 본문 인라인)은 60% 이하다. 가로로 긴 그림(자연 폭:높이 >= 2:1)은 폭 88%·높이 30% 이하다. **묶음 그림은 줄이지 않고 단 폭 전체까지**: 선택지 안 그림, 한 문항 본문에 그림 2개 이상, 보기가 전부 비었거나 번호 기호뿐인데 그림이 있는 문항(보기 2개 이상), 보기 칸이 아예 없거나 빈 배열인데 답이 ①~⑤ 꼴이고 그림이 있으며 발문 글자에 ①·②가 함께 없는 객관식(2026-11-19 `emptyChoicesAreFigure`, 크기 판정 전용이라 문항 결속 `question-binding.js`와 무관), `choicesEmbeddedInImage === true`. 작성자가 정한 width가 있는 묶음 그림은 그 크기를 그대로 둔다.
- 그림 하나 덮어쓰기: 문항 필드 `imageScale`·`solutionImageScale`(단 폭 대비 %, 30~100), 본문 인라인 `<img data-scale="70">`. 범위 밖·숫자 아님은 무시하고, 있으면 위 기본값·가로로 긴 규칙·묶음 규칙보다 우선한다. 두 필드는 `render-state-normalizer.js`의 `RENDER_FIELDS`를 지난다.
- 가로로 긴지·묶음인지·배율은 CSS가 알 수 없어서 `archive/figure-size.js`(`APFigureSize.classify`)가 그림이 모두 불러와진 뒤 쪽 배치 측정 전에 한 번 `data-ap-fig`(wide|bundle|scaled)를 붙인다(`applyAutoImageSizeClasses`와 `applySolutionSvgDisplayWidth`가 부른다). 값은 이 파일에 쓰지 않는다. 보기가 그림인 문항은 박스를 만들 때 `data-ap-fig-bundle`을 붙인다.
- **옛 등급은 A4에서 크기에 영향이 없다**: `imageSize`·`imageSizeOverride`·`solutionImageSize`·`solutionImageSizeOverride`·`solutionImageLayout`는 데이터와 클래스는 그대로이고(휴대폰 규칙이 읽는다) 이 규칙이 읽지 않는다. 해설 SVG의 자연 폭 x0.6 인라인 width도 이 규칙이 켜진 화면에서는 넣지 않는다(`APFigureSize.isActive()`가 CSS 변수 `--ap-fig-sol` 유무로 판정, 휴대폰·오답 엔진은 옛 계산). 해설은 2단 안에서만 놓이고 `solutionImageLayout: "fullwidth"`로 쪽 전체 폭을 쓰지 않는다(`solution-render-executor.js`는 `APFigureSize`가 있을 때 무시, 오답 엔진은 옛 동작). 해설 칸 맞춤이 끝내 안 될 때의 마지막 수단 전폭 승격(위 "해설지 반폭 칸 넘침 처리")은 그대로다.
- **html2canvas(기본 인쇄 경로)는 `object-fit`을 지원하지 않고 그림을 CSS 상자 크기대로 늘려 그린다.** 그래서 폭과 높이 상한을 함께 걸고 object-fit으로 맞추는 방식을 쓰지 않는다. 줄일 그림은 `width:auto; height:auto` + `max-width`·`max-height`만 걸어 그림 상자 자체가 그림 비율을 지킨다(표본에서 상자 폭÷높이가 자연 비율과 ±2% 이내).
- 칸이 넘칠 때 `fitQuestionBox`가 붙이는 `img-fit-*`는 같은 비율에 0.85·0.7·0.55를 곱하는 변수(`--ap-fig-k`)로 바뀌었고, 균등 칸 엔진의 `images` 프로파일(옛 78%·150px)은 0.8을 곱한다(묶음 그림 제외). "단 폭"은 한 칸 안쪽 폭 83.65mm 상수로 둔다(측정용 staging과 최종 칸이 같은 크기를 쓰게). 전폭 칸에서도 같은 값이다.
- 오답 엔진(`apmath/wrong_print_engine.html`)과 편집기(`internal-review-engine.js`)의 크기 선택지, `generated-bank.html`은 이번 범위가 아니다.

## 모든 문항을 칸에 먼저 놓고, 안 들어가는 문항만 한 단 전체로 올린다 (2026-11-18 사용자 결정, 같은 날 앞선 "전폭 표시는 한 단 전체로 읽는다"를 대체)

- 배치는 "기본 칸(grid)"과 "한 단 전체(`subjective-2up`)" 둘뿐이고 기본은 2단 칸이다. 문제 모드 렌더 입구(`engine.html`·`mixed_engine.html`의 `renderExam`, `APRenderStateNormalizer.renderQuestionLayout`)는 시험지 데이터의 `layoutTag`(fullwidth·wide·full·subjective-2up·subjective-4up 등)와 `wide:true`를 처음 배치에서 **무시**한다(데이터는 고치지 않고 렌더용 사본만). 이유: 이 태그는 그림이 크던 시절 사람이 붙인 것이라 과해서, 짧은 보기 5개와 그림 하나뿐인 문항(금당중 중3 2학기 중간 23·24번)이 한 단을 통째로 차지했다. 해설 모드는 건드리지 않는다.
- 쪽당 4문항(`archive/equal-slot-engine.js`)에서는 `finalize`가 칸에 놓고 잰 뒤, 실효 글자 크기(글자 x 칸 배율)가 **10.8px(8.1pt, `MIN_EFFECTIVE_FONT_PX`) 미만**이 되는 문항만 한 단 전체(span 2)로 올려 쪽을 다시 만든다(`state.spans`, 최대 6회). 읽는 순서는 위 "번호 오름차순" 규칙 그대로이고, 한 단 전체는 통째로 빈 단 맨 위에 놓이며 연달아 나오면 한 쪽에 짝이 된다. 한 문항이 올라가도 시험지 전체가 옛 갈래로 넘어가지 않는다(예전에는 2up·wide가 하나라도 있으면 전체가 옛 갈래였다). 쪽을 다시 만들면 마지막 쪽 QR을 다시 달아야 해서 호출부가 `finalize(area, { afterRelayout })`로 넘긴다.
- 한 단 전체로도 안 맞으면 그림만 단계적으로 줄인다(`tight images`·`floor images` 프로파일, 하한은 단 폭의 35%). 그래도 안 맞으면 글자는 10.8px로 두고 `LAYOUT_OVERFLOW`를 감사 결과(`area.dataset.equalSlotAudit`의 `warnings`·`layoutOverflow`)와 console 경고에 남기고, 교사 화면(PC 화면 전용)에는 그 문항에 빨간 점선과 문구를 보인다(인쇄·PDF·인쇄 이미지에는 안 넣음). 세로로만 넘치는 문항은 글자 10.8px를 지키고, **가로로 넘치는 문항(칸보다 넓은 표·한 줄 긴 글)은 가로가 들어가는 배율까지만 줄인다**(`overflowReason: "width"`, 글자가 10.8px 밑이 될 수 있고 같은 LAYOUT_OVERFLOW로 보고). 이유: 가로 넘침은 렌더 공통 게이트 S12에 걸려 시험지가 통째로 안 열리고, 칸을 키워도(한 단 전체) 폭은 그대로다. 오른쪽 단으로 문항을 이어 쓰는 경로는 아직 없다.
- 작성자가 꼭 한 단 전체를 원하면 문항에 `layoutForce: "subjective-2up"`(렌더 전용 필드, `RENDER_FIELDS`·`RENDER_ONLY_FIELDS`)을 쓴다. 기존 데이터에는 없으므로 전부 자동 판정이다.
- 자동 승격과 글자 하한은 시험지 렌더(`APExamRenderExecutor.render`가 `autoPromote`를 켬)에만 있다. 반 합성·오답 엔진(`renderComposed`)과 쪽당 4문항이 아닌 시험지(옛 갈래: 칸을 넘치면 `fallbackLadder`로 그 문항만 키움)는 이전 동작이다. 아직 그대로인 것: 해설 쪽의 전폭 승격(맞춤 실패 마지막 수단), 옛 갈래의 `autoCompress` 글자 축소.
- 회귀 테스트: `tests/equal-slot-engine.test.js`(plan span·selectFit 하한), `tests/archive-layout-hint-demotion.test.js`(입구 정리).

## 연도는 항상 최신부터 (2026-11-10 사용자 결정)

- 문제지 만들기·단원별 기출·빠른 평가의 연도 순서는 **항상 최신 연도가 먼저**(2026 → 2025 → 2024 …)이고 연도를 알 수 없는 자료는 마지막이다(`Archive2Core.recencyRank` 한 곳). 이유: 26·27·28년 시험지가 계속 쌓이고, 수학도 출제 경향이 있어 최신 연도 기출을 먼저 풀어 보는 것이 학생에게 도움이 된다.
- 2026-10-29의 "완결된 최근 연도(2025, 2024 …)를 먼저, 올해 자료는 그다음" 결정을 **대체**한다. "올해 자료는 뒤로" 규칙을 다시 넣지 않는다.
- 단원별 기출은 먼저 최신 연도 순으로 문제지를 자르므로 **문제지 1이 가장 최신 연도**이고, **한 문제지 안에서는** 쉬운 단계부터(1→5→단계 미지정) 정리해 단계 제목을 붙인다(`buildStepPapers`). 한 시험(같은 원본 파일)은 한 문제지에 함께 두고 목표 50·최대 80문항 규칙은 그대로다.
- **자동 선정은 "같은 유형이면 최신 것"이다 (2026-11-18 사용자·관제 결정, `archive2-core.js` `selectBlueprint`).** 최신 연도부터 보되, 같은 유형을 겹쳐 넣기 전에 문제지에 아직 없는 유형을 이전 연도에서라도 먼저 채우고(유형 상한 1 → 2 → 3 … 순), 유형을 모르는 문항은 새 유형 다음(상한 2)에 들어간다. 유형이 하나뿐이면 그 유형 안에서 최신 연도가 먼저다. 요청 문항 수는 풀이 모자라지 않는 한 늘 채운다. 이유: 이전에는 연도 안에서만 유형을 분산해 고1 다항식+인수분해 20문항이 유형 6가지·중복 13문항·전부 2026년으로 나왔다.
- **원본–유사 짝은 한 문제지에 같이 넣지 않는다(교사가 직접 고른 고정 문항은 예외, 둘 다 고정하면 둘 다 남는다).** 짝 = 유사 세트의 n번 문항과, `archive2-similar.js`가 정한 그 세트의 원본 시험의 n번 문항(위치 기준: 같은 번호 문장 유사도 0.58, 무작위 위치 0.08). 한 원본에 유사 세트가 둘이면 셋 모두 한 가족이다. 가족당 하나만 자동으로 뽑고, 다른 방법으로 문항 수를 채울 수 없을 때만 마지막에 짝을 허용한다. 짝은 카탈로그 값이 아니라 선정 시점에 레코드에서 시험 행을 다시 만들어 `archive2-similar.js`로 계산한다(`familyResolver`, 시험 행 기반 계산과 전수 일치를 `tests/archive2-selection-pairs.test.js`가 확인). `archive2-similar.js`는 워크스페이스가 `archive2-core.js` 뒤에 부르는 전역이라 선정 때 찾고, 없으면 짝 규칙만 빠진다. `archive2-core.js`에 새 `require`를 넣지 않는다(Worker 번들 모듈 집합이 바뀌어 배포 검증이 걸린다). 연결 못 한 유사 세트(연도 없음 등)는 짝으로 보지 않는다. 교체(다른 문항으로 바꾸기)는 교사가 직접 고르는 경로라 건드리지 않았다.
- 이 순서가 바뀌면 문제지 구성과 `snapshotKey`가 달라진다. 이미 출제·저장한 문제지는 저장 당시 내용으로 고정되어 있어야 하므로, 번호나 키로 과거 출제를 다시 찾는 코드를 새로 만들지 않는다.

## 유사문제는 기출 옆에 (2026-11-10 사용자 요청)

- 유사문제 짝은 카탈로그에 필드가 없어 `archive/archive2-similar.js`의 규칙(이름 `<원본 identityTitle>_유사…` → 학교·학년·연도·학기·시험 종류가 같은 원본이 하나 → 과목으로 좁혀 하나)으로 **실행 시 한 번 계산**하며, **모호하면 연결하지 않는다**. 이유: 교사가 다른 시험의 유사문제를 학생에게 주는 일이 없는 편이 안전하다. 연결 못 한 세트는 `자료 점검` 맨 아래에 나온다.
- 학교별 기출은 기본이 "학교 기출"(`material=exam`)이고 "전체"는 주소에 `material=all`로 남는다. 시험 줄은 학교별 기출과 홈이 같은 함수(`examRowMarkup`)로 그린다.

## 원본 시험지 두 형식 (2026-11-10)

- 원본 시험지 JS는 `window.questionBank`(+`examTitle`) 형식과 `window.examData = {title, questions}`만 있는 형식이 있다. 엔진(`screen-runtime-adapter.js`의 원본 로더, `engine.html` 레거시 `init()`)은 **questionBank가 있으면 그것만 쓰고, 없을 때만** `examData.questions`·`examData.title`을 읽는다. 시험지 파일에 별칭 두 줄을 일일이 붙이지 않는다. 이유: 별칭을 붙이면 원본 해시 고정값이 깨지고, 별칭이 없는 36개는 학생 화면에서 `EMPTY_SOURCE_DATA`로 비어 보였다. 회귀 테스트: `tests/archive-examdata-source-fallback.test.js`.
- 어댑터는 시험지를 불러오기 전에 `questionBank`·`examData`·`examTitle`·`examDisplayTitle`을 지우고 불러온 뒤 원래대로 되돌린다. 연속으로 시험지를 열어도 앞 시험지의 문항이 남지 않게 하는 장치이니 이름 목록에서 빼지 않는다.

## 보관함·출제 내역 통합 (2026-11-10)

- 메뉴는 "보관함 · 출제 내역" 하나인데 화면은 두 개(`view=saved`, `view=recent`)를 오가야 해서, 교사가 "이 문제지를 어느 반에 언제 냈고 몇 명이 풀었나"를 보려면 제목으로 맞춰 봐야 했다. 이제 **보관함의 문제지 줄 안에 그 문제지의 출제 이력이 붙는다**(`archive2-library.js`의 `paperRowMarkup`, `issuesMarkup`). 줄 모양은 시험 줄과 같은 `.exam-row` 구성요소(`saved-row` 변형)이고 디자인은 `archive/DESIGN.md`의 "보관함 줄" 단락이다.
- **이력은 `GET /class-exam-assignments/recent-summary`를 목록당 한 번만 받아 `saved_paper_id`로 묶는다.** 목록을 먼저 그리고(이력 칸은 "출제 이력 확인 중…") 응답이 오면 칸만 제자리에서 채운다. 카드마다 서버를 부르지 않고, 더 불러오기는 이미 받은 이력을 쓴다(상태 필터를 바꾸면 새 목록이므로 한 번 다시 받고, 휴지통은 이력 요청을 하지 않는다). 최근 90일만 알 수 있으므로 이력이 없는 카드는 "아직 출제하지 않았습니다"가 아니라 "최근 90일 안에 출제한 기록이 없습니다"라고 쓰고, 응답이 1000건 상한에 걸리면 그 문구도 숨긴다. 실패해도 목록·버튼은 그대로 쓸 수 있고 칸에 `다시 시도`가 나온다. 늦게 온 응답은 `libraryViewVersion`·현재 목록 상태·요청 번호로 걸러 다른 화면을 덮지 않는다. 출제 대화상자가 닫히면 워크스페이스가 `Archive2Library.refreshHistory()`를 불러 새 출제를 반영한다.
- **최근 90일 한계:** 서버에 저장본별 필터가 없고(`recent-summary`는 날짜·학년·반·과목·제목만 받는다) 한 번에 최대 1000건이다. 그래서 `from`을 90일 전으로 주고, 화면에 "출제 이력은 최근 90일까지 보입니다"를 밝힌다(1000건이 꽉 차면 "일부는 보이지 않을 수 있습니다"를 덧붙인다). 정확한 전체 이력이 필요하면 서버에 `saved_paper_id` 필터가 있어야 한다.
- **Worker가 다시 배포되지 않게 `archive2-history.js`·`archive2-core.js`·`archive2-output*.js`를 건드리지 않았다.** 이 파일들이 main에 들어가면 `.github/workflows/apms-worker-deploy.yml`이 Worker를 자동 배포한다. `saved_paper_id`·`archive_file`은 `History.normalizeAssignments`가 버리므로 출제 내역 화면은 `state.recentAssignments`(원자료)에서 `recentSourceOf`로 읽는다. 이 필드를 정규화에 넣고 싶으면 Worker 재배포를 감수하는 별도 결정이 필요하다.
- **출제 내역 줄(`view=recent`)**: 같은 `.exam-row` 구성요소, 날짜순, 책등에 출제 월·일과 대상 학년. 출처 표시는 `saved_paper_id`가 있으면 "보관함 문제지"(눌러 보관함의 그 문제지로), 없고 `archive_file`이 `MIXED:`로 시작하면 "단원별 기출", 그 밖의 파일이면 "학교 기출"이다. 기간·학년·반·과목·검색 필터와 포커스·늦은 응답 무시 규칙은 그대로다.
- **학생별 확인**(`assignmentStatus`)은 출제 내역뿐 아니라 보관함 줄에서도 열린다(`isStatusView`). 보관함에서 열 때 `recentSelectedAssignmentId`를 비우는 이유: 이전 출제 내역 선택이 남아 있으면 응답이 현재 요청으로 인정되지 않았다.
- **로그인 판정은 `archive/archive2-session.js` 한 곳**(교사·관리자·owner 역할, id `t_admin`, 로그인 id `admin`)이고 왼쪽 메뉴와 단원별 기출이 같이 쓴다. 교사가 아닌 계정이 로그인돼 있으면 메뉴에 "선생님 계정으로 로그인해 주세요"가 나온다. 서버가 `owner`를 거부하는 곳이 있어도 판정을 좁히지 않는다(기존 동작 유지). 단원별 기출 페이지는 메뉴 자리 바로 뒤에 이 스크립트와 `archive2-navigation.js`를 `defer` 없이 불러(작은 파일이라 첫 화면부터 메뉴가 보인다) 메뉴가 먼저 붙고, 나머지 스크립트는 모두 `defer`이며 `DOMContentLoaded`에서 `init()`을 부른다.
- **로그인이 없을 때 화면(2026-11-10 조정)**: 교사 세션이 아니면(`teacherSessionOk`, 판정은 `archive2-session.js`) `view=saved`·`view=recent`는 API를 한 번도 부르지 않고 `data-login-notice` 안내 하나만 그린다(오류 아님, 알림·토스트 없음). 서버가 401/403을 줘도 같은 안내다. 그 밖의 오류는 본문에 한 번만 보이게 `error.archive2ShownInline`을 달아 `status()` 토스트가 같은 문장을 되풀이하지 않게 했다. 출제 이력 불러오기 실패·확인 중 문구는 카드마다가 아니라 목록 위 `data-history-note` 한 줄에만 둔다.
- 새 파일을 만들면 `tools/archive-pages-release-manifest.json`의 `archiveRootFiles`에 올려야 학생·교사 사이트에 배포된다.

## 화면 안 반에 출제 (2026-11-10)

- 보관함의 `출제`(2026-11-11 전에는 `반에 출제`), 상세 보기의 `출제`, 문제지 만들기에서 저장한 뒤의 `이 저장본 출제`/`n권 출제`는 옛 화면(`index.html`)을 iframe으로 다시 불러오던 모달 대신 **화면 안 패널**(`archive/archive2-assign.js` + `archive2-assign.css`, 전역 `Archive2Assign`)을 연다. 이유: 옛 모달은 느리고 보관함 목록을 가렸고, **열 때마다 새 `assignment_batch_id`를 만들어 같은 반·같은 날 중복 출제가 생길 수 있었다.** 진입은 `archive2-workspace.js`의 `openSavedPaperAssign`(= `window.Archive2WorkspaceSavedPaperIssue`)이고, 문제지 정보가 없으면(문제지 만들기 저장 직후) `GET /archive-saved-papers/{id}`로 한 권을 읽어 연다. 묶음(`n권 중 m권`)은 줄의 `더보기`의 `이 묶음 n권 모두 출제`가 `GET /archive-saved-papers/save-batches/{batchId}`로 권들을 받아(휴지통의 권은 뺀다) 한 패널에 넘긴다. 패널은 처음부터 문제지 여러 권을 받는다(`papers[]`).
- 모듈은 세 겹이다: DOM 없는 **상태 기계** `createModel`(테스트가 가짜 `request`를 꽂는다), 상태에서 HTML 문자열을 만드는 `render*`, `<dialog>`·포커스·닫기 잠금을 맡는 `open`. 요청은 `request(path, {method, body, headers, timeoutMs})`로만 나가고 workspace가 `api()`(4번째 인자 `{headers, timeoutMs}` 추가)에 이어 준다.
- **요청 본문·헤더는 옛 모달의 저장본 출제와 정확히 같다**: `POST /class-exam-assignments`, 헤더 `X-Archive2-Contract: archive2-v1`(+Authorization·Content-Type), 본문 `{contract_version, saved_paper_id, assignment_batch_id, class_id, student_ids, exam_date}`. 서버는 이 헤더가 있어야 저장본 경로(`exams.js:1791` → `routes/archive2.js` `handleArchive2`)로 간다. 반은 `GET /qr-classes`(서버가 담당 반만 준다), 명단은 `GET /class-exam-assignments/roster?class_id&exam_title&exam_date`로 옛 모달과 같은 방식이다. 출제일 기본은 옛 모달과 같은 한국 시간 오늘이고 날짜를 바꿀 수 있다(바꾸면 명단·"이미 냈습니다" 판정을 다시 한다). (문제지, 반) 조합은 **한 번에 하나씩 차례로** 보낸다(문제지 순서대로, 같은 권 안에서는 반 순서대로).
- **batch id를 성공 전까지 재사용하는 이유(중복 출제 방지)**: 서버의 쓰기 키는 `sha256([반, 출제일, "MIXED:archive2-saved-<문제지>-<batch id>"])`이다(`archive2.js:167`, `:373`). batch id가 바뀌면 다른 출제로 저장된다. 그래서 `(문제지, 반, 출제일)`마다 batch id를 한 번 만들어 `localStorage` `archive2.assign.batch.v1`에 보관하고(7일 지난 항목은 정리, 막혀 있으면 메모리로 대체), **서버가 성공(또는 502+출제 번호)을 확인해 줄 때까지 같은 값을 다시 쓴다**(패널을 닫았다 열어도, 새로고침해도). 성공하면 지운다. 요청을 보내기 직전 `sent`로 표시해 두므로 응답을 받기 전에 페이지가 닫혀도 다음에 "이전에 보낸 출제의 결과를 확인하지 못했습니다"가 반 줄에 나온다(다른 날짜의 미확인 건도 알린다).
- **서버 멱등 조건(서버 코드에서 확인)**: 같은 `(반, 출제일, batch id)`이면 서버는 기존 건을 찾아(`archive2.js:210`) (1) 취소된 건이면 409 "취소된 Assignment는 RETRY로…"(`:244`), (2) 학생 구성(`student_ids`)이 처음과 다르면 409 "고정 roster는 변경할 수 없습니다"(`:260`), (3) 제목·원본·qpp·문항이 다르면 409 "이미 배부된 시험입니다"(`:394`)이고, 모두 같으면 `ON CONFLICT(archive2_write_key)`(`:528`)로 **같은 건을 그대로 돌려준다**(응답에 `idempotent` 표시는 없다). 그래서 응답을 못 받은 건은 **같은 본문·같은 batch id로 다시 보내** 확인한다. 학생 구성을 바꿔 다시 보내면 409가 나고 패널은 "같은 번호로 이미 보낸 출제와 학생 구성이 다릅니다"로 알린다. 취소된 건과 같은 키(409)는 **자동으로 다시 보내지 않는다**: 교사가 일부러 취소한 출제일 수 있어서 그 건을 `취소된 출제` / "이 출제는 취소된 상태입니다."로 표시하고, 교사가 그 줄의 `새로 출제`를 직접 눌렀을 때만 번호를 버리고 새 batch id로 한 번 보낸다(`실패한 건 다시 시도`·`확인하기`에는 들어가지 않는다).
- **결과 상태**: `출제됨` / `이미 출제됨 (같은 건)`(돌려받은 건의 `created_at`이 이번 요청 시작보다 2분 넘게 앞일 때) / `PDF만 준비 실패`(**502 + `assignment.id`는 출제 성공**이다: 서버가 출제를 저장한 뒤 PDF만 실패하면 `archive2.js:665~677`에서 502와 `assignment`를 준다. 출제를 다시 보내지 않고 `POST /class-exam-assignments/{id}/pdf`만 다시 한다. 이 호출은 PDF가 또 실패해도 200이라 `assignment.pdf_status === "ready"`로 판정한다) / `실패`(400·403·404·409·503 등 서버가 거절: 만들어지지 않았다) / `결과 확인 필요`(응답이 없거나 시간 초과, 500·502(출제 번호 없음)·504: 서버에 저장됐는지 모른다. `확인하기`가 같은 본문·같은 batch id를 다시 보낸다) / `보내지 않음`(401로 멈춘 뒤 남은 건). **401이면 남은 건을 보내지 않고 멈추고** 로그인 안내(`../apmath/`)를 보인다. 이미 된 건은 결과표에 남고, 로그인한 뒤 `남은 건 이어서 출제`가 같은 batch id로 이어 보낸다. **서버 문장은 화면에 내지 않는다**(영문·코드형은 물론 한글이어도 "roster"·"Assignment" 같은 내부 용어가 섞인다): 알려진 문구만 교사 말로 바꾸고 그 밖에는 "출제하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요."를 낸다. 원문은 콘솔(`console.warn`)에만 남긴다. PDF 실패 사유도 원문 대신 "출제는 됐습니다. 출력용 PDF 준비가 늦어지고 있으니 PDF 다시 준비 버튼을 눌러 주세요."로 쓴다.
- **시간 제한**: 읽기(반·명단)는 `api()`와 같은 30초. 출제·PDF POST는 **150초**다. 서버가 한 요청 안에서 PDF를 만들고(`exam-pdf.js`: 페이지 열기 45초 + 렌더 완료 대기 45초 + PDF 출력·저장) 최악 약 2분이 걸리기 때문이다. 제한에 걸리면 실패가 아니라 `결과 확인 필요`다(위 멱등으로 확인).
- **진행 중 보호**: `출제하기`는 첫 호출이 동기적으로 잠가 이중 클릭에도 한 번만 시작한다. 진행 중에는 `닫기`·Esc(`cancel`)·바깥 누름·뒤로 가기(패널이 쌓아 둔 history 항목을 다시 쌓아 머문다; `workspace`의 `popstate` 처리기가 먼저 `Archive2Assign.handlePopState()`를 부른다)가 모두 "출제 중에는 닫을 수 없습니다"로 막히고 `beforeunload` 경고가 뜬다. 끝나면 닫을 수 있고 포커스가 원래 버튼으로 돌아온다. 끝나거나 닫을 때 `Archive2Library.refreshHistory()`로 보관함 줄의 출제 이력을 새로 고친다.
- **같은 반·같은 날 이미 낸 건**: 보관함이 가진 이력(`Archive2Library.currentHistory()`, 이력에는 `classId`가 들어간다)에서 같은 문제지·같은 반·같은 출제일의 취소되지 않은 출제가 있으면 반 줄에 "11월 10일에 이미 냈습니다."를 보인다(차단은 아니다). 한 권이면 반은 처음부터 체크 해제라 교사가 체크해야 포함되고, 여러 권이면 반을 체크해도 그 (문제지, 반)은 "출제 건 확인"에서 체크 해제로 시작한다. 다른 날짜의 이전 출제는 "11월 7일에 낸 적이 있습니다."만 알린다. 이력은 최근 90일까지만 있어 그보다 오래된 건은 알 수 없다.
- **학생 빠른 선택(옛 모달의 `이 시험 미응시자만`)**: `학생 고르기`를 펼친 안에 `전체` / `아직 안 본 학생만`이 있다(문제지가 한 권일 때만). roster 응답의 `already_submitted`(옛 모달이 쓰던 필드, 제목·출제일 기준)로 이미 응시한 학생을 빼며, 결석생에게 며칠 뒤 따로 낼 때 쓴다. 모두 응시했으면 버튼이 비활성이고 "모두 응시했습니다"가 보인다.
- **옛 모달에 있고 새 패널에 없는 것**: 학생 이름 검색(8명 초과)·선생님 필터(서버 `/qr-classes`가 이미 담당 반만 준다)·미리보기 토글·QR 인쇄 연결(저장본 출제는 옛 화면에서도 인쇄로 이어지지 않고 결과 화면에 머물렀다). 이유: 저장본 출제의 핵심(반·학생 선택, 같은 본문)만 남기고 결정 수를 줄였다. 출력 보기(시험지·해설·정답)는 결과표에서 그대로 열린다.
- **옛 iframe 경로가 남은 곳(2026-11-11 갱신)**: ① 단원별 기출의 `assignPaper`는 이제 패널이 있으면 패널로 간다(아래 "단원별 기출 출제도 같은 패널로"). 옛 iframe(`openReadyAssignment`)은 패널 스크립트가 없을 때와 `assign=legacy`일 때만 쓴다, ② 주소에 `assign=legacy`가 있으면 저장본(`openSavedPaperIssue`)도 원본(`openOriginalIssue`, 학교 기출·유사문제·홈)도 옛 iframe. ②는 새 패널에 문제가 생길 때 되돌릴 길이다. **`assign=legacy`는 페이지를 열 때 `state.assignLegacy`로 읽어 둔다**: 워크스페이스가 시작하면서 `routeUrl()`이 `replaceState`로 주소를 다시 쓰면 `location.search`에서 `assign`이 사라지므로(2026-11-11 실제 Chrome에서 발견, 그 전의 저장본 되돌림도 사실상 동작하지 않았다), `routeUrl()`·`openRouteInPage`·`openSavedPaperRevision`이 주소를 만들 때마다 `assign=legacy`를 붙여 새로고침·뒤로 가기·같은 페이지 메뉴 이동 뒤에도 유지한다. **유지되지 않는 경우**: 왼쪽 메뉴·링크가 `workspace.html?view=…`를 새 주소로 여는 전체 이동(`<a href>`)이면 사라진다. 그때는 주소에 다시 붙여야 한다. 회귀 테스트: `tests/archive2-assign-legacy-switch.test.js`(실제 workspace 스크립트가 주소를 다시 쓴 뒤에도 옛 경로로 가는지). 옛 iframe과 `archive2-entry.js`·`index.html`은 Archive 1.0도 쓰므로 지우거나 고치지 않았다.
- **버튼 이름(2026-11-11 사용자 결정)**: 줄·결과·하단 띠의 버튼은 `출제`(`저장하고 출제`·`저장한 문제지 출제`), **패널 제목만 `반에 출제`**, 패널 안 주 버튼은 `출제하기`. 스크린리더용 `aria-label`은 "… 반에 출제"로 풀어 쓴다. 문제지 만들기의 단원 고르기 머리말은 `출제 범위`가 아니라 `단원`이다. 이유: 버튼이 길어 줄에서 잘렸고, 열린 창의 제목이 하는 일을 알려 주면 충분하다. "출제 내역·이력·출제됨·출제일"은 그대로.

## 원본 시험지 출제도 같은 패널로 (2026-11-11)

- 학교별 기출 줄·유사문제 칸·유사 세트 대화상자·홈 줄의 `출제`(`source-issue`)는 `openOriginalAssign`(`archive2-workspace.js`)이 `Archive2Assign.open({items:[{kind:"original", …}], original:{indexVersion, loadQuestions}})`로 연다. 옛 iframe은 페이지 전체(`index.html`)를 다시 불러 느렸고 목록을 가렸다. 항목은 `{kind, file, title, identityTitle, grade, subject, count(=exam.qCount), sourceHash, settings(O.settings: 제목·쪽당 문항·QR)}`이고 `kind`가 없으면 저장본이다(기존 `papers[]` 호출은 그대로). 원본 문항은 옛 iframe이 부모에게서 받던 것과 같은 `Source.load(file, sourceHash)`(해시 검증)로 받는다: 패널을 열 때 미리 받고, 못 받았으면 출제 직전에 다시 받으며, 문항 수가 `count`와 다르면 **아무것도 보내지 않는다**. 카탈로그가 필요한 줄(해시·색인 버전)이므로 `CATALOG_FREE_ACTIONS`에 넣지 않았다: 준비 전에 누르면 기존 `deferUntilCatalog`가 준비 뒤 이어 준다.
- **요청 본문은 옛 구현이 보내는 것과 키 하나까지 같다**: `index.html registerIndexClassExamAssignment`의 원본 분기 payload(`class_id, exam_title, exam_date, question_count, archive_file("exams/<파일>"), source_type:"archive", mixed_payload_json:"", pdf_qpp, subject, grade_label, assignment_batch_id, target_scope`)에 `archive2-entry.js prepareArchive2OriginalAssignment`가 `contract_version, index_version, student_ids, original_payload_json{questions, meta{identityTitle, printHeaderOptions, qpp, includeQr}}`를 `Object.assign`으로 겹친 결과다(`originalBodyFor`가 그 순서로 만든다). 헤더 `X-Archive2-Contract: archive2-v1`이고 `saved_paper_id`가 없으므로 서버는 **원본 분기**(`exams.js:1791` → `archive2.js:93` `savedPaperMode=false`, `:104` `original=true`)로 처리한다. 대조 테스트(`tests/archive2-assign-original.test.js`)는 옛 `entry.js` 전체와 `index.html`의 요청 함수를 vm에서 그대로 실행해 키·값을 비교한다. 옛 구현과 다른 점은 `exam_date`(옛: 늘 오늘, 새: 패널에서 고른 날)뿐이다.
- **서버 원본 분기의 키·재전송·409(코드에서 확인)**: 쓰기 키 = `sha256([반, 출제일, "exams/<파일>"])`(`archive2.js:373-375`)이고 **`assignment_batch_id`는 읽지 않는다**(그 필드는 `:140`의 저장본 분기에서만 쓴다. 옛 구현이 보내던 값은 호환을 위해 그대로 보내되 서버는 무시한다). 같은 키의 기존 건을 `:213`에서 찾아 (1) 취소된 건이면 409 "취소된 Assignment는 RETRY로…"(`:244`), (2) 학생 구성(`student_ids`)이 처음과 다르면 409 "고정 roster는 변경할 수 없습니다"(`:260`), (3) 제목·파일·`pdf_qpp`·`original_payload_json`(제목·머리글 옵션·QR·**문항 내용 전체**)이 다르면 409 "이미 배부된 시험입니다"(`:376-394`), (4) 모두 같으면 `ON CONFLICT(archive2_write_key)`(`:535`)로 **같은 건을 그대로 돌려준다**. 502+`assignment.id`(PDF만 실패)는 저장본과 같다(`:666-677`). `index_version`은 첫 저장 때만 검증하고(`archive2-questions.js:93-96`, `validateOriginalSnapshot :664-718`) 문항 수·문항별 해시가 카탈로그와 다르면 409다. 본문 상한 900KB(`:54`, 넘으면 413).
- **그래서 `확인하기`는 저장본과 같은 방법**이다: 응답이 끊긴 건은 `결과 확인 필요`로 두고, `확인하기`가 **얼려 둔 같은 본문**(batch 이름·문항 포함, 제목·쪽당 문항·학생 구성은 그 사이 바꿀 수 없다)을 다시 보낸다. 서버가 같은 키·같은 내용이면 기존 건을 돌려주므로 중복이 생기지 않고, 못 받았던 건이면 그때 만들어진다. 출제 내역 조회로 바꾸지 않은 이유: recent-summary는 최근 90일·1000건 상한이라 오래된 날짜·많은 출제에서는 "없다"를 확인해 줄 수 없고, 같은 본문 재전송은 서버가 멱등을 보장하는 경로다. 패널을 닫았다 다시 열어도(같은 설정·같은 학생이면) 같은 본문이라 같은 건이 된다. 저장본의 `localStorage` batch id 보관은 원본에 쓰지 않는다: 번호를 만들지 않고 `sent` 표시(id `-`)만 남겨 반 줄에 "이전에 보낸 출제의 결과를 확인하지 못했습니다"를 낸다.
- **저장본과 다른 점**: ① 취소된 건과 같은 키(409)를 피할 번호가 없다 → `새로 출제`를 주지 않고 "취소된 상태라 같은 날짜로는 다시 낼 수 없습니다. 출제일을 바꿔 주세요."(이력에서 미리 알면 반 줄에도 알린다). ② 같은 반·같은 날·같은 시험을 학생 구성만 바꿔 다시 낼 수 없다(409 "학생 구성이 다릅니다. 출제일을 바꾸거나…"). 결석생에게는 다른 날짜로 낸다. ③ 같은 날 같은 반에 쪽당 문항 수를 바꿔 다시 내면 409(내용이 달라 출제할 수 없습니다). ④ 한 쪽 문항 수는 **항상 4문항으로 시작**하고(사용자 결정 2026-11-11: 거의 한 쪽에 4개만 쓴다) 출제일 아래 "한 쪽 4문항 · `바꾸기`" 한 줄로 접혀 있다. `바꾸기`(`aria-expanded`)를 누르면 4·6·8이 펼쳐지고 4가 아니면 줄이 "한 쪽 6문항"으로 강조된다. 옛 모달이 기억해 둔 값(`APMATH_ARCHIVE2_ORIGINAL_QPP`)은 읽지도 쓰지도 않는다(옛 화면은 그 기억값으로 열 수 있어 기본값이 다를 수 있다). ⑤ 출제일을 고를 수 있다(옛 구현은 늘 오늘).
- **이미 낸 건 경고**: 보관함 이력이 없으니 패널이 열릴 때 `GET /class-exam-assignments/recent-summary?limit=1000&from=<90일 전>`을 한 번 받고(`createRecentCache`, 같은 페이지에서 60초 재사용, 출제가 성공하면 비움), `archive_file`(NFC로 맞춤, `saved_paper_id` 없음)이 같은 건을 파일별로 묶어 저장본과 같은 경고·기본 제외를 적용한다. 실패하면 "이전 출제 기록을 확인하지 못했습니다. 출제는 할 수 있습니다." 한 줄만 낸다(서버가 같은 건은 같은 건으로 받으므로 안전). 이번 접속에서 방금 성공한 조합은 sessionStorage 기억(`archive2.assign.done.v1`)도 쓴다.
- **학생 고르기·`아직 안 본 학생만`**: roster의 `already_submitted`는 `exam_sessions.exam_title = 요청의 exam_title AND exam_date = 요청의 exam_date`로 판정된다(`exams.js:2064-2071`). 학생이 제출하면 세션 제목은 출제 때 저장된 `exam_title`(`student-portal.js:696,717,729`)이므로 **출제 때 보내는 제목과 같은 값**을 roster에 보낸다. 옛 모달은 `getIndexExamTitle(item)`(학교+과목 조합)을 보냈는데 그 값은 출제 제목(`O.displayTitle`)과 달라 원본 시험에서는 응시 여부가 거의 맞지 않았다. 새 패널은 둘을 같은 값으로 맞췄다.
- **옛 모달에 있었는데 새 패널에 없는 것**: 출력 설정 편집(시험지 제목·부제·오른쪽 표시·이름란·점수란·QR 포함)과 "시험지 확인" 미리보기, 학년 탭(반을 학년으로 묶어 보임), 학생 이름 검색, 선생님 필터, QR 인쇄 연결. 기본 설정(제목 = 표시 제목, 부제 = 과목, 이름란·점수란 켬, QR 끔)으로 낸다. 줄의 `시험지·해설·정답`으로 먼저 보고, 낸 뒤 결과표의 같은 버튼(`assignment-output-direct`, 옛 영수증이 쓰던 것과 같은 출제본 출력)으로 본다. 옛 영수증 상태(`state.originalReceipts`)는 옛 iframe 모달 안에서만 쓰이고 다른 화면 표시에는 연결이 없었다.
- 서버(Worker)는 바꾸지 않았다. `archive2-history.js`·`archive2-core.js`·`archive2-output*.js`·`apmath/worker-backup/`를 건드리면 main 병합 때 Worker가 자동 재배포된다.

## 단원별 기출 선택 규칙 (2026-11-10 사용자 결정)

- 단원별 기출(`unit-past-exams.html`)은 단원 × 난이도 1~5단계 표에서 **여러 단원 × 여러 단계를 한 번에** 고른다. 코드는 `UnitPastExamsCore.buildSelectionPapers(selection, { units, perCell, order })`와 `countGrid(units)`다. 이유: 교사가 학교별만큼 단원별로, 난이도별로 주는 일이 많은데 예전 3단계 진행은 단원 하나씩만 골랐고 칸별 문항 수도 고르기 전에는 안 보였다.
- 기본은 **고른 칸의 문항을 있는 만큼 전부** 넣는다. `칸마다 N문항`(1~50)은 선택 사항이다. **칸의 문항이 N보다 적으면 막지 않고 있는 만큼만** 넣고 `shortages`에 기록해 화면에 알린다. 이유: 예전 비슷한 기능은 10문제를 정했는데 모자라면 문제지가 아예 만들어지지 않아 쓰이지 않았다. 모자람을 오류로 되돌리지 않는다.
- N문항을 고르는 순서는 기존 `sortForSelection`(최신 연도 먼저 → 승인된 메타 먼저 → 시드 고정 무작위) 그대로다. 한 문항은 한 번만 들어간다.
- 한 권은 목표 50·최대 80문항으로 나누고 같은 원본 시험의 문항은 한 권에 둔다(`splitIntoPapers`). 이유: 문항이 50개를 넘으면 출력이 오래 걸린다. 문항 수를 정하지 않아도(전부 모드) 이 규칙이 권을 나눈다.
- 정리 순서(`order`): `recent`(기본)는 최신 연도순으로 권을 자르고 권 안은 단원 → 쉬운 단계, `unit`은 단원순으로 자르고 권 안은 단계 → 최신 연도, `step`은 쉬운 단계순으로 자르고 권 안은 단원 → 최신 연도다. `recent`에서는 문제지 1이 가장 최신 연도다("연도는 항상 최신부터" 유지). 권 안 구역 제목은 단원·단계가 바뀔 때 붙는다(단원이 하나면 단계 제목만). `unit`·`step`에서는 같은 시험이 단원(또는 단계)이 달라 다른 권에 갈 수 있다.
- 권 제목은 `명제 외 3단원 · 1~3단계 · 1권/4권`이고 `snapshotKey`는 선택·옵션·권 구성으로 정해지는 결정값(`unitpast_<scope>_multi-<해시>_<해시>`)이라 같은 선택이면 같다. 출력·출제는 기존 `printPaper`(시험지·해설·정답)·`assignPaper`를 그대로 부르며 새 출력 경로를 만들지 않았다.
- `유사문제` 탭과 `유사문제 먼저, 기출 다음` 탭은 **자리만** 있고 누를 수 없다(유사문제의 난이도 단계 표시 작업이 끝나면 연다). 여러 권을 한 번에 출제하거나 보관함에 저장하는 기능은 새 출제 패널과 함께 다음 단계에서 만든다.
- 집계표(`countGrid`)는 학년 자료가 준비될 때 한 번만 계산해 보관한다(렌더마다 2만여 문항을 돌지 않는다. 계약의 동기 500ms 상한). 마지막 선택(학년·과목·칸·옵션)은 localStorage `archive2.unitGrid.v1` 하나에 기억하며, 읽기·쓰기가 실패해도 화면은 정상 동작한다.

## 단원별 기출은 표 한 화면 (2026-11-16 사용자 결정)

- **표가 `unit-past-exams.html`의 유일한 화면이다.** 옛 3단계 화면(학년·과목·단원 카드, 세분 출제, 옛 모아뽑기·구성 화면, 옛 단계 진행 띠)과 그 코드·CSS·Font Awesome 링크는 지웠다. 이유: 표 아래 "세분 출제" 링크가 메뉴 없는 옛 화면으로 보내고 출제가 1.0 전체 페이지로 넘어갔다. 그 기능 중 소단원·유형 거르기는 아래 "단원 트리와 표 펼침·유형 거르기"로 표 안에 들어왔고, 학교·연도 모아뽑기는 표 안 조건 줄로 옮겼다(아래 "조건 줄").
- **옛 주소(`ready=1` 없음, `subUnit`·`blueprint`·`collection*` 같은 옛 값 포함)는 표로 열린다.** `grade`·`unit`(과목은 `course` 또는 옛 `semanticSubject`)만 이어받아 그 단원 행을 체크해 보여 주고, `gridSyncUrl`이 옛 값(`LEGACY_URL_PARAMS`)을 주소에서 지운다. `ready=1`은 더 이상 아무것도 바꾸지 않는다(1.0 "단원별 기출" 링크와 메뉴는 그대로 `ready=1`을 붙인다). `archive2-navigation.js`는 `ready`가 없어도 메뉴를 지우지 않는다.
- **지우지 않은 것**: ① 표의 "고치기"가 여는 "시험지 확인" 화면(미리보기·시험지 머리글 편집·문항 교체, `renderConfirmation`)은 기능 그대로이고 1b에서 새 모양으로 바꿨다. ② 출력(시험지·해설·정답)과 출제 패널 경로, `assign=legacy`일 때의 iframe 출제(`archive/index.html`의 `unitPastAssign` 처리). ③ `unit-past-exams-core.js`의 모아뽑기 계산(1c에서 표의 조건 줄이 같은 규칙을 쓴다)과 다른 core 함수.
- **옛 출력 전달 저장소(`mixedQuestions_`·`mixedMeta_`)와 `APMATH_UNIT_PAST_ASSIGN_`는 이 페이지가 더 쓰지 않는다**(문항은 출력 포장이나 출제 패널 본문으로 간다). `storeMixedPayload`는 `buildMixedMeta`로 이름을 바꿨다(meta만 만든다). `mixer.html`의 보관 규칙은 그대로다.
- 로그인이 없으면 새 틀 안에 "선생님 로그인이 필요합니다" 안내(로그인·다시 확인 두 버튼), 로딩 실패면 이유와 `다시 시도`(새로고침)만 나온다. 옛 화면으로 보내는 링크는 없다.
- 학년 버튼·탭·진행 줄·표 뼈대는 큰 자료를 해석하기 전에 그린다(아래 "첫 화면 먼저"). 회귀 테스트: `tests/archive-unit-past-exams-ui.test.js`·`-ui-runtime.test.js`·`archive2-navigation.test.cjs`, 실제 Chrome 확인은 `tools/check-archive-rpm-middle-browser.cjs`(옛 주소 열기 포함).

## 단원 트리와 표 펼침·유형 거르기 (2026-11-16, 계획 1b)

- **단원 목록은 `archive/archive2-unit-tree.js`(전역 `Archive2UnitTree`, node `require` 겸용) 한 곳에서 만든다.** 이유: 선생님은 교과서 목차대로(중1 "평면도형" 안의 "다각형", "원과 부채꼴") 고르고 싶어 하는데 표는 대단원뿐이었고, 문제지 만들기·빠른 평가도 같은 목록이 필요하다(계획 작업 3이 이 모듈을 연결한다). 표시와 선택에만 쓰며 문항의 값·정본 메타는 바꾸지 않는다.
- **API**: `createTree(profileId, units)` → `{ childrenOf(unitKey), hasChildren, childKeyOf(unitKey, record), childName, childRank, pathLabel(unitKey, childKey) }`(units는 `core.buildCatalog(...).units`처럼 `key, name, course, selectableRecords`가 있는 목록). `loadGroups()`(고등 묶음표를 비동기로 한 번 읽음, 실패하면 콘솔 경고 후 `null`, 고등은 대단원만 보임), `setGroups(doc)`, `parseCellKey`, `scopeKey`, `NONE_KEY`.
- **중등 판정(추정 매핑 없음)**: 대단원 24·중단원 54는 정본 `archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json`(생성물 `rpm-middle-toc.js`의 `parents(학년)`)를 목차 순서(`orderInUnit`) 그대로 쓰고, 문항이 0인 중단원도 흐린 0으로 보인다. 문항의 중단원 = 문항의 `rpmParentResolution`(없으면 `core.resolveRpmParent`)이 EXACT이고 `parent.unitKey`가 그 대단원일 때 `parent`의 L2. 판정이 OUT_OF_SCOPE·NOT_FOUND인 옛 2015 키 문항은 정본 `legacySubUnitMappings`(옛 소단원 키 → 중단원)가 **같은 대단원의 중단원 하나**로 정할 때만 그 중단원으로 접고, 둘 이상이거나 AMBIGUOUS면 접지 않는다. 정할 수 없으면 그 대단원 아래 "중단원 미지정" 한 줄이다. 칸 키는 정본 `parentKey`에서 만든 짧은 고정 키 `m<8자리 16진 해시>`다(목차 서수 `p1`·`p2`는 목차 순서가 바뀌면 옛 주소 뜻이 바뀌어 쓰지 않는다. 1c에서 바꿨고 main 배포 전이라 옛 `p#` 호환은 없다).
- **고등**: core 단원(표 행) 아래에 `archive/data/archive2-subunit-groups.json`의 묶음을 쓴다. 키는 `groupKey`에서 `SG:<과목>:<단원>:`을 뗀 값이고, 문항은 `core.getSubUnitKey(record)`로 묶음을 찾는다. 이름은 묶음표 그대로이며 영문·"핵심 개념" 이름, `unit_other`·`excluded` 묶음, 묶음표에 없는 키·빈 키는 "기타" 한 줄(맨 끝)로 모은다. `unit_general`은 "단원 일반"(기타 앞). 이동(`moved`) 묶음은 원래 단원에 두며 원래 단원 묶음과 이름이 겹치면 " (다른 단원 분류)"를 붙인다(결정 대기: metadata.md "이동 표시"). 묶음표에 교재 순서가 없어 정렬은 구역(`sections`) → 가나다순이다. 문항이 없는 묶음은 목록에서 뺀다.
- **표**: 단원 이름 옆 CSS 화살표 단추(`.ug-expand`, `aria-expanded`)로 펼치면 `.ug-subrow` 줄이 들여 쓰여 나온다(휴대폰도 카드 안 카드). 칸 키는 단원 전체 `단원|단계`, 중단원 `단원~중단원|단계`. 단원 전체 칸이 켜진 단계의 중단원 칸은 "이미 들어 있음"(`is-covered`)이고 누르면 단원 칸을 풀고 나머지 중단원 칸으로 갈라지며, 중단원 칸만 켜진 단원 칸은 `aria-pressed="mixed"`(점선)이다. 칸마다 N문항은 칸(단원 또는 중단원)마다 적용된다. 체크박스·"단계 버튼"은 단원 전체 칸만 다룬다.
- **유형 거르기(오른쪽 패널 "유형" 접이식)**: 고른 단원(체크했거나 칸을 고른 단원, 중단원 칸만 골랐으면 그 중단원)에 있는 유형만 보이고 기본은 전부 켜짐. 끄면 `core.countGrid`·`core.buildSelectionPapers`에 `excludedTypeKeys`로 넘겨 **표 숫자와 문제지를 같은 조건으로 다시 센다**. 뺄 유형 목록(`G.typeOff`)으로 표현해 단원을 바꿔도 새 유형은 켜진 채 나타난다. 키 없는 문항·유형 연결이 끊긴 문항은 "유형 미지정"(`core.NO_TYPE_KEY`, 중학교는 유형 채움이 7~16%라 맨 위에 항상 둔다). `filterUnitRecords`는 미지정 문항을 빼므로 쓰지 않는다.
- **선택 기억**: localStorage `archive2.unitGrid.v1`(v2)에 고른 칸·체크·펼침·뺀 유형을 저장하고, 주소에는 `sel`(칸)·`chk`(체크한 단원)·`notype`(뺀 유형)을 둔다. 주소에 있으면 저장값보다 우선이라 주소를 다시 열면 같은 선택이다. `snapshotKey`는 같은 조건이면 같고, 중단원(`subUnitKeys`)·남은 유형(`problemTypeKeys`)을 키에 넣되 안 쓰면 옛 키와 같다. 권 제목·요약표는 "평면도형 › 원과 부채꼴 · 2~4단계"처럼 중단원이 보인다.
- **권 고치기 화면**: 위 한 줄은 학년 · 과목 · 단원(중단원) · 단계 · 문항 수이고 "전체 아카이브 · 바로 쓰는 문제지" 같은 옛 말은 없다. 교체 후보는 **그 권을 만든 조건 안**에서 찾는다: 후보 난이도 거르기는 하·중·상이 아니라 그 권의 1~5단계(단계 미지정 열을 골랐을 때만 단계 미지정 문항 포함)이고, 뺀 유형을 따르며, 기본은 바꿀 문항과 같은 중단원·같은 단계(교사가 범위를 넓힐 수 있다). 이전에는 단계 미지정·소단원 없는 문항이 후보에서 늘 빠졌고 2단계 문항이 3단계로 바뀔 수 있었다.
- **옛 주소(`unit=`)로 열리면** 체크된 단원 행으로 스크롤하고 잠깐 강조한다(`.is-flash`).
- 회귀 테스트: `tests/archive2-unit-tree.test.js`(정본 중단원 모두·순서·중복 이름 0·한 문항 한 줄·고등 이름 규칙·묶음표 실패 시 경고·유형 거르기), `tests/archive-unit-past-exams-ui-runtime.test.js`(펼침·소단원 칸·유형 끄기·주소 복원).

## 조건 줄: 학교·연도·시험·학기와 학교별 권 (2026-11-16, 계획 1c)

- **왜**: 사용자 결정 - "학교별 연도별로 단원별 기출로 출제하면 해당 학교 시험이 전체적으로 어떤 형태인지 학생들이 알 수 있다. 화면이 복잡해지더라도 설계를 잘해서 활용". 1a에서 옛 세분 출제 화면과 함께 없앤 이 기능을 단원x단계 표 안에 새로 살렸다. 조건을 안 건드리면 화면·숫자·결과가 1b와 같다(전부 "전체"가 기본이고, core를 옵션 없이 부른 결과가 이전 커밋과 같음을 대조했다).
- **core(`unit-past-exams-core.js`)**: `createSourceFilter(universe, options)`(universe = 그 학년 문항 전부)가 `{ active, key, keep(record), yearsOf(schoolKey) }`를 만든다. 옵션은 `schoolKeys`, `yearMode`('all' | 'recent' | 'range'), `yearCount`(3|5), `yearFrom`·`yearTo`, `examType`('mid'|'final'), `semester`('1'|'2'), `group`('mixed'|'school')이고 `normalizeSourceOptions`가 바로잡는다. **"최근 N년"은 학교마다, 그 학년 전체 자동 선택 대상 문항(`universe`)에서 시험·학기를 먼저 거른 뒤 자료가 있는 최신 N개 연도**다(옛 모아뽑기 `resolveCollectionYearsBySchool`과 같은 규칙이며 달력의 최근 3년이 아니다. 단원·난이도 칸이 아니라 학교의 학년 전체 문항으로 연도를 정하므로, 표의 어느 칸을 골라도 같은 학교의 같은 N개 연도가 쓰인다). 학교를 안 골라도 학교마다 따로 센다. `countGrid(units, { sourceFilter })`와 `buildSelectionPapers(selection, { sourceFilter })`가 같은 `keep`을 쓰므로 표 숫자와 문제지가 같은 조건이다. 조건이 없으면(`active:false`) 두 함수 모두 조건을 모르던 때와 같다. `getSourceSchoolOptions(universe, options)`는 학교 고르기 목록(그 학년에 기출이 있는 학교, 학교를 뺀 나머지 조건으로 센 문항 수, 문항 많은 순). 기존 `buildCollectionPapers` 등 모아뽑기 함수와 `archive-unit-past-exams-collection` 테스트는 그대로다.
- **학교별 권**: `group:'school'`은 학교를 2곳 이상 골랐을 때만 뜻이 있다(`normalizeSourceOptions`가 아니면 'mixed'로 접는다). 학교마다 따로 목표 50·최대 80문항으로 나누고 권 번호도 학교 안에서 센다("1권/2권"). 권 제목은 `학교 · 연도범위 · [1학기 중간고사 ·] 단원 · 단계`(예: "순천고 · 2023~2025 · 이차방정식 · 1~3단계"), 섞기는 `A 외 1교 · 최근 3년 · ...`, 학교를 안 골랐으면 `최근 3년 · 중간고사 · ...`이다. 권 안은 정리 순서 설정(recent/unit/step)을 그대로 따라 단원 → 단계 → 연도(최신 먼저)다. **칸마다 N문항**은 학교별 권일 때 학교마다 N문항이며(한 학교가 칸을 차지하지 않게) 모자람 판정도 학교 수만큼(`cells[].wanted`) 본다. 권의 `snapshotKey`는 조건이 있으면 `collection:{source, group}`이 키에 들어가 조건이 다르면 같은 키가 되지 않고, 조건이 없으면 옛 키와 같다. 권에는 `school`·`schoolKey`(학교가 하나일 때)·`schools`·`sourceLabel`이 붙고 결과에는 `groupBy`·`sourceKey`·`sourceLabel`·`schools`가 있다.
- **화면(`unit-past-exams.js`)**: 상태 `G.src`(mode·schools·year·from·to·exam·semester·group)는 **학년과 따로 이어진다**. 표 숫자는 `entry.countCache`(조건·유형 조합별로 한 번만 센다)이고 `gridSrcChanged`가 숫자·표·요약·띠·유형·조건 줄을 다시 그린다(클릭당 10~30ms). 학교 고르기는 이름을 입력해 찾고(한 번에 8곳) Enter로 첫 항목을 고른다. 고른 학교는 칩이다. "전체 기출"을 누르면 고른 학교를 비운다. 결과 묶기 토글은 오른쪽 패널("문항 수 · 정리 순서" 접이식, 두 번째 학교를 고르면 펼쳐진다)과 휴대폰 시트 안에 같은 단추로 있다.
- **출처 표시**: 출력 엔진·Worker 재배포 파일은 고치지 않았다. 출력 문제지는 문항마다 출처를 따로 그리지 않는다. 단원별 기출 출력의 meta에는 `출처: 2025 · 순천고 · 1학기 중간 / ...`(`meta.sourceSummary`)가 실리지만, `archive/mixed_engine.html` 652행이 `AppState.key`가 `unitpast_`로 시작할 때만 이를 해설·정답 부제로 쓴다. 봉투 흐름에서는 key가 요청 UUID라 **지금은 화면에 보이지 않는다**("해설·정답 부제가 출처를 싣는다"는 이 문서의 이전 설명은 틀렸다). 출력 창 작업(계획 작업 5)에서 고칠 예정이다. 권 제목은 학교·연도 범위이고 `meta.school`도 채운다. 권 목록 줄에는 학교별 권이면 줄 제목에, 섞은 권이면 `원본 시험지 N개 · 학교·학교 연도` 요약이 있다(조건이 있을 때만). 문항마다 출처를 문제지 본문에 찍으려면 출력 엔진(`mixed_engine.html`)과 `archive2-output*.js`를 바꿔야 하므로 범위 밖이다(Worker 재배포 파일 포함).
- **주소·저장**: 주소 `sch`(학교 키 쉼표 목록), `yr`(`r3`·`r5`·`2022-2024`), `ex`(`mid`·`final`), `sm`(`1`·`2`), `grp`(`school`)와 localStorage `archive2.unitGrid.v1`(v3)의 `src`. 기본값이면 파라미터를 지운다. 주소에 하나라도 있으면 저장값보다 우선이고, 없으면 저장값을 쓴다.
- **휴대폰(700px 이하)**: 조건 줄은 `조건 2개 · 바꾸기`(조건이 없으면 `조건 없음 · 바꾸기`) 한 줄 단추이고 누르면 아래에서 올라오는 시트(`role="dialog"`, 닫기·바깥 누르기·Esc, 아래에 `이 조건으로 보기 · N문항` 고정)다. 시트 안 단추·입력은 모두 44px 이상이고 가로 스크롤이 없다. 규칙은 `archive/DESIGN.md` "조건 줄".
- **같이 고친 것(1b 검수 비차단 지적)**: 유형 거르기 위 `전체 켜기 · 전체 끄기`(`gridTypesOffAll`), 중등 중단원 칸 키를 정본 `parentKey` 기반 `m<해시>`로, `gridToggleCell`이 유형 거르기 중 나머지 소단원 칸을 켤 때 거른 숫자(`G.counts`) 기준으로.
- 회귀 테스트: `tests/archive-unit-past-exams-source.test.js`(실제 자료로 학교·연도·시험·학기 거르기 후 다른 학교·연도 문항 0, 학교별 권에 다른 학교 문항 0, 조건 없음 = 조건을 모르던 때와 같음, 조건이 다르면 권 키가 다름), `tests/archive-unit-past-exams-ui-runtime.test.js`(조건 줄·칩·묶기·주소/저장 복원·시트·유형 전체 끄기), `tests/archive2-unit-tree.test.js`(중단원 키).

## 첫 화면 먼저 (2026-11-10)

- **왜:** `workspace.html`을 열면 홈이 뜨기까지 약 16초 "불러오는 중"만 보였다. 원인은 네트워크가 아니라 CPU다(카탈로그 66.8MB를 받아 해시·파싱 → 해석 → 문항 색인). 그런데 홈·보관함·출제 내역은 카탈로그가 없어도 그릴 수 있다. 자료를 줄인 것이 아니라 **순서를 바꿨다.** 판정 기준: 교사가 열자마자 메뉴와 홈이 보이고, 아직 준비 안 된 기능은 "준비 중"임을 알 수 있으며, 준비가 끝나면 아무 조작 없이 이어진다.
- **먼저 그리는 것:** 홈(`view=home`), 보관함(`saved`), 출제 내역(`recent`: 목록은 서버에서 바로 받고, 시험 정보로 보강하는 학년·과목은 카탈로그가 오면 다시 계산). 홈에서 카탈로그를 읽는 두 곳(학교 칩, 최근 기출 줄)은 **같은 높이의 자리 표시**로 두고 준비가 끝나면 `fillHomeFromCatalog()`가 그 자리만 채운다(검색창 글자·포커스는 유지, 화면 전체를 다시 그리지 않는다). 그 밖의 화면(학교별 기출·문제지 만들기·빠른 평가·자료 점검)은 화면 이름 + 진행 표시(`preparingMarkup`)를 보이고 준비가 끝나면 `render()`가 저절로 그린다.
- **준비 전에 누르면:** 메뉴·학교 칩·검색·빠른 평가 버튼은 즉시 화면을 옮긴다(빠른 평가는 `location.href` 대신 `openRouteInPage`로 같은 페이지에서 옮긴다. 새로고침하면 받기·해시 확인·해석을 처음부터 다시 하기 때문). 카탈로그가 필요한 그 밖의 버튼은 `deferUntilCatalog`가 "자료를 준비하는 중입니다…"를 알리고 준비가 끝나면 같은 버튼을 다시 누른 것처럼 이어 준다(`replayDeferredClick`). 카탈로그가 필요 없는 동작은 `CATALOG_FREE_ACTIONS` 목록에 있다. 새 버튼을 홈·보관함·출제 내역에 넣으면 카탈로그가 필요한지 보고 이 목록에 넣을지 정한다.
- **검증은 그대로다.** `archive2-canonical.js`의 `loadInputBundle`(SHA-256 확인 → JSON.parse)을 한 줄도 바꾸지 않았다. 바꾼 것은 canonical에 넘기는 `fetcher`(`archive/archive2-boot.js`)뿐이다: ① reviewed-exam-meta를 canonical이 부르기 전에, 런타임 팩(`runtime/*-vN.json`)이 이름을 댄 67개만 미리 받기 시작한다(이름을 대지 않는 파일은 받지 않는다. 동시에 최대 6개. 실패하면 canonical이 평소 방식으로 한 번 더 받는다). ② 첫 화면을 그리기 전에는 받은 큰 파일을 canonical에 넘기지 않는다(내려받기는 계속). 첫 화면을 그려 다음 프레임이 지나면 열리고, 화면 코드가 실패해도 4초 뒤 저절로 열린다. 매니페스트(23KB)는 붙잡지 않는다. 이유: 받기 시작이 매니페스트에서 나뉘기 때문이다.
- **미룬 계산(필요한 화면에 들어갈 때 또는 한가할 때):** `ProblemBankMeta.buildIndex`(`ensureMetaIndex()`), 자료 점검 수치(`ensureHealthStats()`), 통합 단원 색인(`unifiedIndex()`, 원래 자료 점검 수치를 부르며 부팅 때 만들어졌다). 빠른 평가가 색인 없이 실행되는 길은 없다: 풀은 `quickPools()` 한 곳에서만 만들고 거기서 `ensureMetaIndex()`를 먼저 부르며, 빠른 평가 화면에 들어가려면 풀이 먼저 만들어진다. 학교별 기출은 카탈로그가 준비된 뒤에만 그린다(시험 목록과 검색어 대상인 문항 uid·L1~L4가 같은 카탈로그에서 나오므로 부분 표시를 하지 않는다. 시험 목록만 먼저 보이게 하려면 요약 산출물이 필요하다: 아래 다음 단계). 찾기·문제지 만들기·빠른 평가·자료 점검 화면은 화면을 그리기 직전 "문항 목록 정리 중"을 먼저 그린 뒤 색인을 만들고, 그 밖의 화면에서는 한가할 때(`requestIdleCallback`) 한 단계씩 미리 만든다.
- **진행 표시:** 맨 위 얇은 줄(`#boot-progress`, 화면에 고정이라 나타나고 사라져도 내용이 밀리지 않음) + 홈 기출 칸·준비 중 화면 안의 같은 진행(`data-boot-bar/label/count`). 문구는 "자료 받는 중 (3/25)" → "자료 확인 중" → "문항 목록 정리 중". 받은 파일 수와 실제로 끝난 단계에서만 움직이고(가짜 타이머 없음) 뒤로 가지 않는다. 화면 낭독기에는 단계 문구만 읽힌다(`aria-live="polite"`, 숫자는 `aria-hidden`). `prefers-reduced-motion`이면 움직임 없음. 실패하면 홈은 그대로 두고 기출 칸에 이유와 `다시 시도`(새로고침), 다른 화면은 본문에 같은 안내가 나온다.
- **계측:** `performance.measure` 이름 `archive2:boot:manifest · catalog-fetch · catalog-verify · reviewed-meta · resolve · index`(+`meta-index`), 표식 `archive2:boot:start · first-paint · ready`. 주소에 `?perf=1`을 붙이면 끝났을 때 콘솔에 표가 나온다(평소엔 조용). `catalog-verify`는 카탈로그를 다 받은 때부터 모든 파일의 해시 확인·해석이 끝난 때까지(다른 파일의 확인을 포함), `resolve`는 `resolveCatalog`와 자격 집계다.
- **남은 가장 긴 동기 구간(canonical 안이라 여기서 못 쪼갠다):** 이 PC 실측(2026-11-10, 같은 조건 3회): 가장 긴 것이 1.2~1.7초(카탈로그 66.8MB의 문자열 정리·인코딩·`JSON.parse`), 다음이 0.9~1.6초(`resolveCatalog`), 나머지는 0.3초 이하다. 준비가 끝난 뒤 한가할 때 만드는 문항 분류 색인(`buildIndex`)이 0.6~1.1초다. 모두 **첫 화면을 그린 뒤**에 실행되지만 그 동안 클릭이 밀린다(변경 전에는 4초짜리 한 덩어리가 있었다). 계약 §3의 "동기 500ms"는 선택·클릭 처리에 대한 조항이라 부팅 준비는 "긴 준비 작업은 첫 반응을 막지 않는다"(진행 표시 먼저)를 따른다. 이 구간을 없애려면 canonical을 고치거나(조각 처리) 아래 다음 단계가 필요하다.
- **다음 단계 후보:** ① 요약 산출물(`archive2-catalog-summary.json`: 시험 목록·분류·sourceHashes·health·시험별 검색어. manifest에 해시 등록, 번들은 뒤에서 검증) — 학교별 기출을 카탈로그 전에도 그릴 수 있다. ② 카탈로그 인코딩 v2(중복 생략 무손실, 66.8MB를 20MB대로). ③ Web Worker에서 받기·해시·파싱·해석(메인 스레드 동기 구간 제거. `loadVerifiedInput`/`resolveCatalog`이 canonical에 있어 canonical 수정이 필요). ④ Cache Storage(sha 키, 적중해도 sha 재검증).
- 새 코드는 시간 기준이 아니라 **순서·결함 조건**으로 검사한다: `tests/archive2-boot-order.test.js`(`check-archive2-runtime.cjs`에 포함). 이 PC는 CPU가 흔들려 시간 기준이 불안정하다.

- **단원별 기출 페이지도 같은 방식(2026-11-16)**: 메뉴 자리를 숨기지 않고(`archive2-shell archive2-unit-surface`가 정적 `<body>`에 있다) 메뉴 스크립트를 바로 붙인다. 정적 HTML은 새 머리글 + "불러오는 중" 한 줄뿐이다(옛 머리줄·돌아가기 버튼·빈 진행 띠·회색 상태 줄 없음). 무거운 스크립트는 `defer`로 두고, `question-index.js`(11.6MB)는 `<link rel="preload">`로 내려받기만 먼저 시작한 뒤 `unit-past-exams.js`가 표 뼈대(학년 버튼·탭·진행 줄·칸 자리 표시, 가짜 숫자 없음)를 그리고 `Archive2Boot.firstPaint()`를 부른 다음에 불러와 해석한다. 뼈대를 그린 직후 `firstPaint`를 부르지 않으면 안전 시간 4초까지 해석이 멈춘다. 표가 열리기 전에 누른 학년은 `state.pendingProfileId`로 기억했다가 표를 그릴 때 쓴다. 완료·실패는 `Boot.finish(false/true)`로 알린다.

## 문제지 만들기 한 화면 (2026-11-10)

- 화면 구성과 이유는 `archive/DESIGN.md`의 "문제지 만들기 한 화면"이다. 코드는 `archive/archive2-workspace.js`의 `renderCompose`가 왼쪽 `renderConditions`(학년·과목 `filterMarkup` primary, `renderScopes`, `renderComposition`)와 오른쪽 `renderResult`(`renderResultSummary` · `renderPaper` · `renderOutputSettings` · `renderResultFinish`), 하단 띠 `renderMobileActions`(`.cz-bar`)를 이어 붙인다. **재배치 원칙: 로직은 그대로, 마크업만 바꾼다.** `state`, `C.selectBlueprint`, `savePapers`, 초안 자동저장, 고정·교체와 `data-action` 이름, `#distribution`·`#count`, 하네스가 내보내는 함수명(`renderComposition`·`renderInspector` 등)은 그대로다. `.inspector`·`.mobile-actions`·검사 탭은 없어졌다.
- **조건을 바꿔도 자동으로 다시 뽑지 않는다.** 이유: 자동으로 뽑으면 교사가 고정·교체한 문항이 조건 클릭 한 번에 사라진다. 대신 `composeLiveMarkup`이 "지금 조건으로 N문항 가능 · 요청 M문항"을 항상 보인다(`renderComposition`이 이미 하던 후보 계산을 쓴다). 조건이 바뀌어 결과가 비워지면 `invalidate()`가 `state.composeStale`을 켜고 오른쪽이 "조건이 바뀌었습니다"를 보인다. 문항 수 입력·− / +는 전체를 다시 그리지 않고 `patchComposeLive`로 요약·버튼·오른쪽 안내·띠만 바꾼다(입력 중인 칸과 포커스를 지키고 조건 클릭 렌더가 500ms 계약을 넘지 않게).
- **모자라도 막지 않는다**(단원별 기출과 같은 원칙, 사용자 결정). `generate()`는 `selectBlueprint`의 `errors`만 거절로 다루고 `shortages`는 거절로 보지 않는다. 뽑힌 만큼으로 `req.rows[].count`를 줄이고 0인 행은 뺀 것을 `state.rows`로 둔다. 이렇게 해야 `C.review`가 "요청한 문항 수가 충족되지 않았습니다"(HARD_BLOCK)로 막지 않는다(`archive2-core.js`는 고치지 않았다). 모자란 행은 `state.composeShortage`(요청·넣은 수)에 두고 결과 위 `data-compose-shortage` 안내로 보인다. 뽑힌 문항이 0개일 때만 상태 줄로 알리고 아무것도 바꾸지 않는다(`rebuildUnissued`는 출제한 권을 보존해야 해서 예전처럼 부족하면 막는다).
- **저장하고 출제**(`saveAndAssign`, 버튼 글자는 2026-11-11부터 `저장하고 출제`, aria-label은 `저장하고 반에 출제`): 현재 편집본이 이미 저장되어 있으면(`currentSavedPaperIds`) 다시 저장하지 않고 그 저장본으로, 아니면 `savePapers()`를 부른 뒤 **저장이 확인되었을 때만**(`saveResultState === "SAVED"`이고 저장 서명이 현재 편집본과 같음) 출제 패널(`openSavedPaperAssign`)을 연다. 저장이 실패했거나 결과를 모르면(`RESULT_UNKNOWN`) 열지 않는다. 한 권이면 id만 넘겨 패널이 서버에서 읽고, 여러 권이면 `GET /archive-saved-papers/save-batches/{batch}`로 권 정보를 받아 **저장된 권 전체**를 `papers[]`로 한 패널에 넘긴다(하나라도 확인되지 않으면 일부만 열지 않고 알린다).
- **빠른 평가 가드**(`applyFiveMinuteViewGuard`)는 `FIVE_MINUTE_GUARD`의 선택자(`#distribution`, `#count`, `count-step`, 저장·저장하고 출제·백업·불러오기·새 작업 버튼, `[data-cz-empty-guide]`, `[data-cz-result-title]`, `.cz-more`)에 의존한다. 예전에는 `.inspector p.muted` 같은 선택자가 조용히 맞지 않게 될 수 있었고 테스트가 없었다. 마크업을 바꾸면 `tests/archive2-compose-one-screen.test.js`가 선택자가 마크업에 실제로 있는지 지킨다.
- **미리보기는 문제지 내용 서명(`previewSignature` = `prepareSignature` + 보는 권·출력 종류·영수증·카탈로그 판)이 바뀔 때만 다시 그린다.** 서명은 `#preview-host`의 `data-preview-signature`에 남고, `render()`는 `setContentKeepingPreview`로 같은 서명의 칸과 iframe을 그대로 둔 채 곁가지만 바꾼다(iframe은 DOM에서 빠졌다 들어오면 다시 불러오므로 칸에 이르는 조상은 유지). 그래서 인쇄·저장 성공/실패·상태줄 갱신은 iframe을 다시 만들지 않는다. 이유: 클릭할 때마다 미리보기가 "준비 중"으로 되돌아가 깜박이고 50문항을 다시 복원·검증했다. 같은 서명의 `prepare()`는 진행 중인 Promise를 같이 기다리고(복원 1회), 서명이 바뀌면 늦게 끝난 옛 준비는 결과를 버린다. 문항 교체·되돌리기는 `state.prepared`를 비우지 않아, 바뀐 문항만 `Source.restore`하고 나머지는 원본 파일 SHA·지문·UID를 다시 확인(`stillRestorable`)한 뒤 재사용한다. 확인이 어긋나면 그 문항은 처음부터 복원한다(재사용은 검증을 건너뛰는 길이 아니다). 테스트: `tests/archive2-preview-stable.test.cjs`.
- **조건을 바꿔 지워진 문제지는 한 단계 되살릴 수 있다**(`방금 문제지 되돌리기`, `data-compose-restore`). `invalidate()`가 선정 결과(문항·순서·rows·고정·교체 이력·준비된 문제지)를 compose 부품의 `lastCleared`에 한 개만 메모리에 둔다. 조건은 `invalidate()`가 불릴 때 이미 바뀌어 있으므로 main의 click/change/input 처리기가 이벤트 시작 때 `rememberComposeConditions()`로 바뀌기 전 조건을 적어 둔다. 초안·localStorage·서버 형식에는 쓰지 않는다. 새로 만들기(`generate`), 새 작업·다른 초안(`draftId`가 다름), 출제 시작, 카탈로그 변경, 결과가 다시 생기면 버린다. 이유: 고정·교체까지 손본 50문항이 조건 하나를 실수로 건드리면 통째로 사라졌다. 버튼 글은 `교체 되돌리기`(문항 하나)와 겹치지 않게 `방금 문제지 되돌리기`다. 테스트: `tests/archive2-compose-restore.test.js`.
- 미리보기는 접으면(`state.previewOpen`) 그리지 않는다. 숨은 iframe은 폭이 0이라 출력 엔진이 배치를 못 하기 때문이다. 출력 설정 접힘은 `toggle` 이벤트로 `state.outputSettingsOpen`에 기억한다.
- 뽑은 뒤 화면 상태 줄에는 "N문항 선택 · 중복 없음 · 처리 시간(ms)"을 내지 않는다. 오른쪽 결과 요약과 겹치고 처리 시간은 교사에게 필요 없어서다. 화면 읽기 프로그램용 숨은 live 영역(`data-cz-announce`)에만 "N문항을 선택했습니다."를 두고, 처리 시간은 콘솔과 `?perf=1`에서만 상태 줄에 보인다(오류는 그대로 보인다).
- **"모자라도 막지 않음"은 새로 만들 때만이다.** `문제지 만들기`와 `같은 조건으로 다시 뽑기`(`generate(false)`)는 지금 문항을 후보에서 빼지 않으므로 있는 만큼만 넣고 모자람을 알린다. `고정 외 다시 만들기`(`generate(true)`)는 지금 문항(고정 외)을 후보에서 빼고 뽑기 때문에 새 문항이 모자라면 결과가 조용히 줄어든다(6문항 → 3문항으로 줄고 되돌리기도 꺼진 일이 있었다). 그래서 결과가 지금보다 적으면 적용하지 않고 지금 문제지를 그대로 두며 결과 위에 한 줄(`state.composeNotice`, `data-compose-notice`)로 알린다.
- 조건이 바뀌어 결과가 비워지면 고정해 둔 문항 수를 `state.composeStalePins`에 두었다가 "고정해 둔 n문항도 함께 지워졌습니다"를 덧붙인다. 모자라게 뽑은 문제지의 모자람 정보(`composeShortage`)는 초안(`draft()`)에 함께 저장해 복원 때 안내가 사라지지 않게 한다(`validateDraftTypes`가 형식을 검사하고, 없는 이전 초안은 안내 없이 연다).
- 좁은 화면(<1100px)에서는 뽑은 뒤 `focusComposeResult()`가 결과 머리(`[data-cz-result-title]`)로 스크롤하고 포커스를 옮긴다(`prefers-reduced-motion`이면 부드러운 스크롤 없이 바로). 두 칸(PC)에서는 결과가 옆에 보이므로 하지 않는다.
- 같은 문항 구성을 고르는 `renderComposition()`은 `composeParts()`의 `amount`(단계·문항 수)와 `tail`(더 자세한 조건·요약·버튼)을 이어 붙인 것이고, `renderConditions()`는 둘 사이에 단원 목록을 넣는다.

## 단원별 기출 출제도 같은 패널로 (2026-11-11)

- 단원별 기출 `권 목록`의 권별 `출제`(2026-11-11 전에는 `반에 출제`)와 새 `전체 출제 (N권)`은 `unit-past-exams.js`의 `assignPaper`/`assignAllPapers` → `openAssignPanel`이 `Archive2Assign.open({items:[{kind:"unit", snapshotKey, title, identityTitle, grade, subject, count, ref}], unit:{load}, request, outputLinks:false})`로 연다. 이유: 교사는 단원별 기출을 가장 자주 쓰고 한 번에 50문항씩 여러 권을 만드는데, 옛 iframe은 권마다 모달을 열어 같은 반·날짜를 되풀이해 골라야 했다. `전체 출제`는 2권 이상이고 패널을 쓸 수 있을 때만 보인다. 옛 방식(`assign=legacy`·스크립트 없음)은 옛 iframe 경로 그대로고 `전체 출제`는 없다(옛 방식은 한 번에 한 권뿐이다). `고치기` 화면에서 연 `학생에게 출제`도 같은 패널로 간다.
- **요청 본문은 옛 모달이 보내던 것과 키·순서·값이 같다(헤더 없이)**: `POST /class-exam-assignments`, `X-Archive2-Contract` 없음, `{class_id, exam_title, exam_date, question_count, archive_file:"MIXED:<snapshotKey>", source_type:"mixed", mixed_payload_json(문자열 {questions, meta}), pdf_qpp, subject, grade_label, assignment_batch_id, target_scope}`, `student_ids` 없음(`unitBodyFor`, 테스트가 옛 `registerIndexClassExamAssignment`를 vm으로 실행해 대조). 이유: 서버의 계약 헤더 경로(`archive2-v1`)는 문항별 승인 대조를 통과할 필드가 없어 단원별 문제지를 받지 못한다. 서버는 바꾸지 않는다. `exam_date`와 `pdf_qpp`만 패널에서 고른 값이고(옛 경로는 늘 오늘), 쪽당 문항을 바꿨으면 `meta.qpp`도 같은 값으로 맞춘다. `exam_title`은 옛 경로와 같은 `identityTitle||title`이고 명단 조회도 같은 값이다.
- **헤더 없는 경로는 받는 사람을 항상 반 전체로 기록한다**(서버가 `student_ids`를 읽지 않는다). 그래서 학생을 일부만 고른 반은 POST 성공 **뒤 같은 작업 안에서** `POST /class-exam-assignments/exclude-students`(`assignment_id, class_id, student_ids(고르지 않은 학생 = 명단 − 선택), operation_identity(UUID), exam_title, exam_date, archive_file`)로 뺀다. 반 전체를 골랐으면 보내지 않고, 200명이 넘으면 나눠 보낸다(서버 한도). **제외가 실패하면 성공으로 표시하지 않는다**: 결과 줄은 `출제됨 · 학생 제외 실패`, "출제는 됐지만 고르지 않은 학생 N명을 빼지 못했습니다. 지금은 반 전체에게 보입니다."와 `다시 빼기`(제외 요청만 같은 `operation_identity`로 다시, 출제는 다시 보내지 않는다. 서버가 건·학생마다 이 번호로 멱등이다). 이 상태로 닫기·뒤로 가기를 하면 한 번 경고하고, 페이지를 떠나려 해도 `beforeunload`가 알린다. 이유: 일부 학생에게만 내려던 것이 반 전체에게 남는데 교사가 모르는 것이 가장 나쁜 사고다.
- **재전송·중복**: 같은 (반, 출제일, `MIXED:<키>`)는 서버가 새 건을 만들지 않고 기존 건을 갱신해 같은 assignment를 돌려준다(`exams.js` 헤더 없는 POST의 `existing` 분기). 그래서 같은 권을 같은 날 다시 눌러도, 응답이 끊겨 `확인하기`를 눌러도 **얼려 둔 같은 본문**을 보내면 새 건이 생기지 않는다. `확인하기`가 성공하면 이어서 제외 단계까지 간다. **취소된 건**: 이 분기는 기존 건이 취소됐는지 보지 않고 성공(200)으로 돌려주므로, 응답 `assignment.cancelled_at`이 있으면 성공이 아니라 `취소된 출제`로 표시하고(제외도 보내지 않는다) "…취소된 상태라 같은 날짜로는 다시 낼 수 없습니다. 출제일을 바꿔 주세요."를 보인다. `새로 출제`는 주지 않는다(batch id가 서버 키가 아니라 번호를 바꿔도 피할 수 없다).
- **여러 권**: (권 × 반)을 하나씩 순서대로 보내고(동시에 둘 이상 보내지 않는다) 결과 줄에 권 제목이 붙는다. 중간에 실패해도 다음 권은 계속 보내며, 실패·미전송만 `이어서 출제`로 다시 보낸다(이미 간 권은 다시 보내지 않는다). 로그인이 끝나면(401) 남은 권을 `보내지 않음`으로 두고 멈춘다.
- **전송 전 준비는 전부 성공해야 시작한다**(원본의 `prepareOriginals`와 같은 원칙): 이번에 낼 모든 권의 문항을 `unit.load(item)`(= `restorePaperQuestions` + `storeMixedPayload`, 옛 출력 포장은 만들지 않는다)으로 복원해 본문 문자열을 만들고, 하나라도 실패하거나 문자열이 **900000자**(서버 `normalizeMixedAssignmentPayload` 한도)를 넘으면 아무것도 보내지 않고 어느 권이 왜 안 되는지 알린다(`문제지가 너무 커서 낼 수 없습니다. 문항 수를 줄여 다시 만들어 주세요.`). 서버가 같은 이유로 400(`mixed_payload_json … required`)을 주면 같은 말로 바꿔 보인다. 패널을 열 때 한 권씩 미리 받아 둔다.
- **같은 날 이미 낸 건**: 원본과 같다. `recent-summary` 응답의 `archive_file`이 `MIXED:<키>`이고 `saved_paper_id`가 없는 줄을 같은 키로 묶는다(서버는 `archive_file`을 그대로 준다. 저장본 줄은 `saved_paper_id`가 있어 제외). 이력을 못 받아도 이번 접속에서 성공한 조합을 기억해 같은 경고를 낸다.
- **단원 페이지의 `request`**(`assignRequest`)는 `archive2-workspace.js api()`와 같은 방식이다(같은 서버 주소·세션 인증, 로그인이 없으면 요청 없이 `status=401`이라 패널이 로그인 안내를 그린다, 제한 시간이면 `timeout=true`). 비밀번호 입력·로그인 우회는 없다. 결과 줄의 출력 버튼(`assignment-output-direct`)은 단원 페이지에 처리기가 없어 `outputLinks:false`로 끈다. 뒤로 가기는 `popstate` 처리기가 먼저 `Archive2Assign.handlePopState()`를 부르고 아니면 기존 `restoreFromUrl`을 한다.
- 서버·`archive/index.html`·`archive2-entry.js`는 바꾸지 않았다. `unit-past-exams.html`이 `archive2-assign.css/js`를 읽고(`workspace.html`과 같은 `?v=`) 테스트는 `tests/archive2-assign-unit.test.js`다.
- **패널 버튼 모양은 패널이 스스로 갖는다**: 패널은 작업공간과 단원별 기출 두 화면에서 열리는데 단원 페이지는 `archive2.css`를 읽지 않아 버튼·입력이 브라우저 기본 회색으로 나왔다. `archive2-assign.css`가 `:where(dialog.assign-panel)` 범위로 작업공간의 최종 계산값과 같은 기본 모양(button·primary·small·aria-pressed·input·label·링크형 버튼)을 갖고, 단원 페이지의 `.unit-page button { font: inherit }`가 글자 크기·굵기를 덮지 않게 버튼 글자만 한 단계 높여 적는다. 두 화면에서 같은 패널의 버튼·입력 20곳의 계산 스타일(배경·글자색·테두리·둥근 정도·높이·글꼴)이 같음을 확인했다. `archive2.css` 전체를 단원 페이지에 더하지 않는다(단원 페이지 다른 모양이 바뀐다).

## 출제 내역·만들던 문제지에서 바로 지우기 (2026-11-11 사용자 요청)

- **출제 내역 줄의 `출제 취소`**: 잘못 낸 건·테스트 건을 APMS로 가지 않고 그 자리에서 멈춘다. 서버 `POST /class-exam-assignments/:id/cancel`을 부르고, 확인 대화상자를 거친다(되돌리는 경로가 없다).
- **삭제가 아니라 취소인 이유**: 서버는 Archive 2.0 확정 배부를 지우지 못하게 막는다(`DELETE /exam-sessions/by-exam`이 409). 취소는 행을 지우지 않고 `cancelled_at`만 남겨, 아직 안 푼 학생에게는 안 보이고 이미 제출한 기록은 남는다. 한 번 잘못 눌러도 학생 기록이 사라지지 않는다.
- **취소는 모든 출제에 열려 있다**: 전에는 보관함 저장본 출제만 취소할 수 있어 학교 기출·단원별 건은 지울 수도 멈출 수도 없었다. `routes/exams.js` 취소 경로의 저장본 전용 제한을 없앴다(기록 테이블의 `saved_paper_id`는 NULL 허용). 이 제한을 되살리지 말 것.
- **취소한 출제는 목록에서 기본으로 숨긴다**(`state.recentShowCancelled`, `취소한 출제 N건 보기`). 교사에게는 지운 것과 같아 보이게 하려는 것이다. 보관함 줄의 출제 이력은 지금처럼 "취소됨"으로 보인다.
- 취소한 뒤 같은 반·같은 날·같은 시험지로 다시 내면 서버가 취소된 건으로 답한다 → 출제 패널이 출제일을 바꾸라고 안내한다(기존 동작).
- **만들던 문제지 `삭제`**: 홈과 출제 내역 모두 `이어하기` 옆에 바로 보인다(더보기 안에 숨기지 않는다). 이 기기(localStorage)의 작업만 지우며 확인을 거친다. 지금 작업 중인 초안을 지우면 `resetWorkingDraft()`로 작업 상태도 비운다 — 안 비우면 자동 저장이 되살린다.
- PDF 준비 오류의 서버 원문(영어)은 `pdfErrorText()`로 교사용 문장으로 바꿔 보인다.
- 홈의 `생성문제` 칸은 열리는 화면 제목(`generated-bank.html` "모의고사 만들기")에 맞춰 `모의고사`라고 부른다. `유사문제`는 학교 기출 옆 유사 세트를 가리키는 말이라 쓰지 않는다.

## 남은 과제 (화면 마감 범위 밖, 2026-11-12 조사)

화면 마감 묶음은 아래를 하지 않았다. 조사 결과만 적어 두며, 하게 되면 이 절을 갱신한다. 행번호는 2026-11-12 기준이라 달라졌을 수 있다.

| # | 항목 | 크기 | 근거·막는 점 |
|---|---|---|---|
| L1 | 출제 패널 실제 서버 확인 | S | 가짜 API로만 검수(#1651·#1724·#1735). 원장님이 시험용 반으로 |
| L2 | 단원별 문제지 보관함 저장 | L·서버 | 권 최대 80문항 vs 서버 1~50(`apmath/worker-backup/worker/helpers/archive-saved-papers.js:267-268`), 묶음 8권·1.5MB·8MB |
| L3 | 단원별 기출 유사문제 탭 | M~L | 자리만(`unit-past-exams.js`의 `gridTabsHtml`). 유사문항 난이도 단계 38% → 자료 작업 먼저 |
| L4 | 자료 준비 시간 단축(7번 2단계) | L | 요약 산출물 없음(위 "첫 화면 먼저"). Web Worker안은 `archive2-canonical.js` 수정 → Worker 재배포 |
| L5 | 원본 출제 패널 출력 설정 편집·미리보기, 학생 검색·선생님 필터 | M | `archive/DESIGN.md` "알려진 남은 것", 위 "화면 안 반에 출제"·"원본 시험지 출제도 같은 패널로" |
| L6 | 출제 이력 90일·1000건 한계 | M·서버 | 위 "보관함·출제 내역 통합" |
| L7 | 고친 권이 표 선택 바꾸면 사라짐 | S~M | #1639 (`gridCommitEdit`은 권 목록으로 돌아갈 때만 쓴다) |
| L8 | 리뷰 보고서 비화면 항목: 백업 불러오기 XSS, 저장 미확정 시 출력 잠김, localStorage 누적(`mixer.html:2366`), 출제 창 카탈로그 재요청(`archive2-entry.js:42`), 반 명단 뒤바뀜, `#apmsess=`·`?assetBase=` 덮어쓰기, 초안 복원 거부, 캐시 버전 누락, CSP — 각각 처리 여부 재확인 필요 | S~M | 보고서 2026-11-10 |

**Worker 자동 재배포 파일** (main 병합 때 Worker가 다시 배포된다. 화면 마감 묶음은 원칙적으로 건드리지 않고, 건드리면 지시서에 명시하고 배포 결과를 확인한다): `apmath/worker-backup/**`, `archive/archive2-canonical.js`, `archive2-core.js`, `archive2-history.js`, `archive2-output-contract.js`, `archive2-output.js`, `mixer-selector.js`.

화면 마감 계획서는 단원별 기출 표 안에 소단원·유형 필터(1b)와 학교·연도 조건 줄(1c, 위 "조건 줄")을 넣었고, 메뉴 아래 도구 링크 숨기기, 빠른 평가 재설계, 단독 페이지(모의고사·평가 보관함·분석표) 새 디자인, 출력 창 조작줄, 잔여 정리, 390/1024/1440px 한 바퀴 점검 순으로 이어진다.

## 교사 화면에서 도구 링크 숨김과 휴대폰 빠른평가 (2026-11-16, 계획 작업 2)

- 메뉴 아래·홈 아래·`workspace.html`·`unit-past-exams.html` 어디에서도 `아카이브 1.0`(`index.html?legacy=1`), `자료 점검`(`workspace.html?view=health`), `유형·개념으로 문항 찾기`(`problem-bank-search.html`) 링크를 그리지 않는다(사용자 결정). **주소와 페이지·뷰는 그대로 살아 있어** 필요하면 직접 주소로 연다(`view=health`는 `WORKSPACE_VIEWS`·워크스페이스 라우트에 남아 있다). 이유: 선생님이 누르면 재설계 전 옛 화면, 개발자용 데이터 상태, 원시 키 검색으로 떨어졌다. 링크를 다시 넣지 않는다(`tests/archive2-navigation.test.cjs`·`archive2-home.test.cjs`가 "링크 없음 + 라우트 있음"을 검사한다).
- 자료 준비 실패 화면은 `다시 시도`(새로고침)만 보인다. 출제 대상 학생 대화상자(`targets()`)의 로그인 안내도 옛 아카이브 대신 `../apmath/` 로그인 링크로 바꿨다(그 대화상자를 여는 버튼은 지금 화면에 없다).
- 휴대폰 아래 메뉴는 6칸이다: `홈 / 학교별 / 단원별 / 만들기 / 빠른평가 / 보관함`. 빠른평가 칸은 사이드바와 같은 `view=five-minute`이고 5분 테스트·소단원·중단원·종합평가 화면에서 현재 칸이 된다(만들기는 `compose`일 때만). 칸 높이 60px, 글자 13px(340px 이하 12px), 6등분이라 390px에서 칸 폭 65px.

## 빠른 평가: 단원 트리 목록과 한 화면 (2026-11-16, 계획 작업 3a)

- 빠른 평가 4종(`workspace.html?view=five-minute|subunit-test|unit-test|monthly-test`)의 단원 목록은 단원별 기출 표와 **같은 공용 모듈 `archive/archive2-unit-tree.js`**로 만든다. 이름·순서·소속이 화면마다 달라지지 않게 하려는 것이다. 이유: 중등 "중단원 평가"가 대단원 목록이었고, 소단원 카드에 옛 2015 이름("이전 분류 · …")이 섞이고 중2·중3 정본 중단원이 없었으며, 고등은 묶음표를 안 읽어 중복·영문·"핵심 개념"·엉뚱한 소속이 보였다.
- 코드는 `archive2-quick-pools.js`: `buildPools`는 대단원(고등 단원) 풀만 만들고(옛 `pools.subunits`와 2015 "legacy" 풀은 없앴다), `buildScopes(pools, grade, subject, { index, metaByUid })`가 트리로 **고를 수 있는 범위(scope)** 를 만든다. 범위는 문항을 복사하지 않는 보기(view)이고 한 문항은 자기 대단원의 자식 하나에만 들어간다(자식 합계 = 대단원 합계). 트리가 정할 수 없는 문항("중단원 미지정"·"기타"·이동 묶음)은 대단원 안에만 남고 자기 범위로는 안 나온다(추정 매핑 없음). 정본 목차의 대단원은 문항이 0이어도 모두 나온다(`Unified.unitsForSubject`).
- 제품별로 고를 수 있는 것(`pickableGroups`): 5분 테스트·종합평가 = 대단원 전체 + 중단원(고등: 소단원 묶음), 소단원 평가 = 중단원(중등)/소단원 묶음(고등), 중단원 평가 = 중단원(중등)/단원(고등). "단원 미분류"는 소단원 평가를 뺀 모두에서 맨 끝 한 줄이다. 고등 묶음표(`archive2-subunit-groups.json`)를 아직 못 읽었으면(`groupsMissing`) 소단원 평가는 단원 단위로 보이고 이유를 한 줄로 알린다. 묶음표는 화면 시작 때 `quickLoadGroups()`가 한 번 요청하고 도착하면 다시 그린다.
- 중등에는 **중단원보다 잘게 나뉜 소단원 카드가 없다**: 옛 2015 소단원 카드(문항의 `subUnitKey`, 풀 키 `legacy:2015:…`)는 정본 `legacySubUnitMappings`가 같은 대단원의 중단원 하나로 정할 때만 그 중단원에 접힌다. 그래서 중등 소단원 평가와 중단원 평가의 선택 범위는 같은 중단원 목록이고, 차이는 문항 수(12·20)와 난이도 구성이다. 고등은 소단원 평가 = 묶음, 중단원 평가 = core 단원이다.
- 화면(`renderQuick`, 마크업 `.qk-*`는 `archive2.css`): 위 4종 전환(`qk-seg`)과 한 줄 설명 → 왼쪽 학년·과목 / 난이도 / 단원 목록, 오른쪽 "만들어질 평가"(`qk-result`: 고른 범위·문항 수·난이도 구성·`시험지 열기`). 범위를 누르면 **고르기만** 하고(`quick-pick`) `시험지 열기`(`quick-open-pick`, 종합평가는 `quick-open-selected`/`quick-open-all`)가 예전과 같은 `openQuickAssessment`로 출력 창(`mixed_engine.html?studio=1`, 출력·보관함 저장·반에 출제)을 연다. 풀 계산 규칙(문항 수, 난이도 구성, 균형 선택)은 그대로다. 문항이 모자란 범위는 목록 끝의 "문항이 모자란 중단원 N개" 한 줄로 접히고(`quick-short-toggle`) 펼치면 "2단계 문항 부족" 같은 짧은 문구로 보인다. 1100px 미만은 조건 위·결과 아래 한 줄이고 하단 고정 띠(`qk-bar`)가 `시험지 열기`를 맡으며 난이도는 "기본 · 1단계 4문항 … 바꾸기" 한 줄로 접힌다.
- 시험지 제목·`scopeKeys`는 범위 키(`u:<학년>:<과목>:<단원>` 또는 `…~<중단원 키>`)와 범위 이름을 쓴다. 이 값을 읽는 다른 코드는 없다(`scopeKeys`는 출력 창 meta에만 담긴다).
- 테스트: `tests/archive2-quick-pools.test.js`가 결함 조건을 본다 — 중등 중단원 목록 = 정본 L2(누락 0, 순서 일치), "이전 분류"·영문·"핵심 개념" 이름 0, 같은 대단원 안 중복 이름 0, 범위의 문항이 그 대단원 소속(다른 단원 0), 자식 합 = 대단원. "five-minute first render 500ms" 항목은 이 PC 부하에서 변경 전부터 느려(변경 전 0.9~1.1초, 변경 후 0.9~1.0초) 기준은 그대로 두고 전후만 같은 조건으로 비교했다.

## 빠른 평가 "진단평가" 상품과 출력 순서 (2026-11-19 사용자 결정)

- 진단평가는 신규 학생 첫 학부모 상담용이다. 결과표가 "단원 × 단계"와 단계별 성취를 보여 주므로 진단지는 ① 쉬운 단계부터 올라가고 ② 범위의 모든 단원이 들어가고 ③ 학부모에게 "실제 학교 기출"이라고 말할 수 있어야 한다. 이유: 학생이 어디서 막히는지를 단계·단원으로 읽는다.
- 상품은 `archive2-quick-pools.js` `PRODUCTS.diagnostic` 한 곳이다(수를 다른 곳에 두지 않는다). 24문항, 프리셋 3종 — 기초 1·2·3·4~5단계 5·5·10·4, 기본(선택값) 3·5·10·6, 심화 2·4·10·8. "진단평가는 기본적으로 어려운 형태로 나가는 게 중요"(사용자)라 기본이 기초보다 어렵다.
- 풀은 `Core.difficultyEligible` + **원본 기출만**(`original/`; 유사·교과서·유형·생성 제외 — 원본–유사 짝 문제를 구조로 없앤다). 4~5단계 칸은 5단계를 합친 진단평가 전용 풀이고(`mergeTop`), 다른 네 상품은 5단계를 계속 뺀다. **학기 단추 = 그 학기의 과목·단원 범위이지 시험지 학기가 아니다 (2026-11-20 사용자 결정: "과목이 우선", "학교마다 2학기 책인데 1학기에 나가는 경우도 있다")**. `buildPools`의 `semesterAllows`: 고2·고3은 문항을 학기로 거르지 않는다(단원 미분류도 과목이 정해져 있으니 과목 전체가 풀, 세 학기 단추의 문항 수가 같다), 고1도 풀은 안 자르고 화면이 학기 단추와 과목 단추를 짝짓는다(1학기 = 공통수학1, 2학기 = 공통수학2, `syncDiagnosticSemester`; 과목 단추가 우선, "1·2학기"는 과목 유지), 중등은 문항의 대단원이 속한 교재 학기(단원 표 `courseKey` M1-1·M1-2 …)로 가른다. 시험지 학기(`examAxis`)를 따르는 것은 과목 구분이 없는 중등의 단원 미분류 문항뿐이다. 고2·고3 문서·표시는 학기를 말하지 않는다("대수 전체"). 학기 단추 자체는 남겨 두었다(사용자 결정 대기). 학기 단추는 진단평가에만 있고 나머지 네 탭은 학기와 무관한 공용 풀을 쓴다(`quickState.semester`, 진단평가 전용 풀 캐시 `quickDiagCache`).
- 선정(`archive2-workspace-compose.js` `diagnosticSelection`): 고른 단원(고르지 않으면 학기 전체)마다 최소 문항 = floor(24 / 문항 있는 단원 수)와 3 중 작은 값, 남는 자리는 풀 크기 비례. 단계마다 단원을 돌려 가며(최소에 가장 못 미친 단원 먼저) 단원 × 단계 칸이 비지 않게 하고, 그 단원에 그 단계 문항이 없으면 건너뛴다. 유형(`metaFacetsOf().pt`, 문제지 만들기와 같은 출처)이 겹치면 벌점만 주고 빼지 않는다(유형 없는 문항도 풀에 남는다).
- **부족 단계 보충 (2026-11-20 사용자 결정)**: 원본 기출이 프리셋보다 모자란 단계만, 모자란 수만큼 같은 학년·같은 단원(학기가 정해진 유사 문항은 같은 학기)의 유형(`types/`)·유사(`similar/`) 문항으로 채운다(`PRODUCTS.diagnostic.fillFrom`, 풀의 `unit.fillBuckets`; 원본이 있는 단원에만 붙는다). 원본이 먼저이고, 단원을 돌려 가며 고르고, 이미 뽑힌 원본과 같은 시험의 원본–유사 짝(`Core.familyResolver`)은 다른 문항이 남아 있는 한 뺀다. 화면 결과 카드에 한 줄("4~5단계 2문항은 원본 기출이 모자라 유형·유사 문항으로 채웁니다."), 연 뒤 상태 줄에 실제 유형·유사 수를 보인다. 새 상태값·단추는 없다. 채워도 모자라면 기존 안내("N단계 M문항 필요 · K문항 가능", K는 원본+보충)를 그대로 쓴다. 조용히 다른 단계로 채우지 않는다.
- 정답·해설 빈 문항: 카탈로그에 그 값이 없어서 선정 단계에서는 거르지 못한다. 출력 준비(`Source.restore`) 뒤 정답이나 해설(글·그림)이 빈 문항이 있으면 **같은 단계의 안 뽑힌 문항(같은 단원 먼저)** 으로 바꾼다(`replaceBlankQuestions`). 바꿀 문항이 없으면 시험지를 만들지 않고 이유를 알린다. 이유: 상담용 시험지에 답이 없는 문항이 들어가면 안 된다.
- 출력 순서: 모든 빠른 평가 상품이 선정 직후 `Quick.orderByStep`으로 (기록된 난이도 단계, 단원 순서) 안정 정렬해서 낸다(`openQuickAssessment`). 선정된 문항 집합은 바뀌지 않고 순서만 명시적이다. 문항 순서는 `Source.restore` → 출력 봉투 → `mixed_engine`까지 그대로 유지된다.
- **A·B형 두 벌 (2026-11-20)**: "A·B형 두 벌" 체크 하나(`quickState.twoForms`, 열기 단추 옆과 하단 띠). B형(`diagnosticMirror`)은 A형과 단원 × 단계 칸별 문항 수가 같고 A형 문항을 쓰지 않는다. A형은 두 벌일 때 칸마다 절반까지만 먼저 가져가 B형 몫을 남기고(`pair`), B형은 칸에 안 쓴 원본이 없으면(A형이 모자란 단계의 원본을 다 가져간 경우) 같은 칸의 안 쓴 유형·유사로 채운다. 그래도 없는 칸만 A형 문항을 다시 쓰고, 상태 줄에 겹친 수를 적는다. B형은 A형을 만들고 난 뒤 A형의 최종 구성(빈 문항을 바꾼 뒤)을 기준으로 짠다. 정답·해설이 빈 문항은 `Source.restore` 뒤에야 알 수 있어, A형에서 빈 것으로 확인된 문항(`knownBlank`)은 B형 후보에서 처음부터 빠지고, B형 후보가 바닥나면 A형의 같은 단계 문항을 다시 쓴다(겹침으로 센다). B형만 실패하면 A형 창은 그대로 두고 B형 창만 닫으며 상태 줄에 "B형은 만들지 못했습니다"와 이유를 적는다. 상태 줄의 유형·유사 수는 벌마다("A형은 … B형은 …") 센다. 창은 클릭 안에서 둘을 연다(`window.open` 두 번). 둘째가 막히면 B형을 만들어 두고 "B형 열기" 단추로 연다(`quick-open-b`). 객관식 지정은 하지 않았다: 카탈로그 행에 문항 유형·보기가 없어 선정 때 알 수 없고(`Source.restore` 뒤에야 보인다), 보기가 없는 문항을 거르려면 선정 뒤 재선정이 필요해 단계·단원 구성 보장과 부딪힌다. 선정 난수는 `crypto.getRandomValues`라 seed 고정이 안 된다.

## 문제지 만들기: 대단원 → 중단원 2단 목록 (2026-11-16, 계획 작업 3b)

- 문제지 만들기 단원 목록은 단원별 기출·빠른 평가와 같은 공용 모듈 `archive2-unit-tree.js`로 대단원 아래 중단원(고등은 소단원 묶음)을 보여 준다. 이유: 세 화면의 단원 이름·순서·소속이 같아야 하고, 선생님은 교과서 목차대로 "원과 부채꼴"만 따로 내고 싶어 한다(학기 구분은 넣지 않는다). 문항을 어느 중단원에 넣는지는 빠른 평가와 같은 규칙(`Archive2QuickPools.wrapRecord` + `tree.childKeyOf`)을 그대로 쓴다. 새 규칙은 없다.
- 코드는 `archive2-workspace.js`: `composeTree`(학년 전체 문항으로 구조를 한 번 만들어 캐시, 조건은 숫자에만 반영, 고등 묶음표는 비동기), `unifiedScopeOptions`가 대단원 범위에 `children`(자식 범위: `scopeQuestionUids`·`paths`·`count`)을 붙이고, `pickedScopeNodes`/`selectedScopeOptions`가 대단원을 고르면 그 단원 전체, 아니면 고른 중단원들을 돌려준다. 자식은 `scopeOptions()` 배열(전체 선택·모두·연속 범위·초안 범위)에 넣지 않는다.
- **호환**: 대단원 키(`u:<학년>:<과목>:<단원>`)의 뜻은 바뀌지 않는다. 중단원 키는 `<대단원 키>~<안정 키>`로 더하며(중등 `m<8자리 해시>`는 정본 parentKey에서, 고등은 묶음 키, 정할 수 없는 문항은 `__none__`) 다시 계산해도 같다. 대단원 키와 그 자식 키가 함께 있으면 대단원이 우선이다. 예전 초안(대단원 키만)은 그대로 복원되고, 사라진 자식 키만 "새 단원 목록에 없어 제외" 안내로 떨어진다. 고등 묶음표를 아직 못 읽은 때는 자식 키를 버리지 않고 두었다가 읽으면 살아난다.
- 마크업 `scopeUnitMarkup`: 대단원 줄 끝 `data-action="scope-expand"` 단추(44px), 펼치면 `.scope-subs` 안에 `.scope-sub` 줄(0문항 `is-zero` 흐림·고를 수 없음, 대단원을 체크하면 `is-implied` "포함됨", 문항이 없는 "중단원 미지정"/"기타" 줄은 숨김). 펼침은 `state.scopeUnitOpen`(없으면 고른 자식이 있을 때만 펼침). `render()`는 목록 안쪽 스크롤 위치를 보존한다.
- `settleIndexesForView`가 문제지 만들기 화면에서도 기록된 메타 색인을 미리 만든다(빠른 평가와 같은 소속 판정에 필요). 메타 거르기(`composeMetaFacets`)는 고른 중단원의 문항을 따라간다.
- 테스트: `tests/archive2-compose-tree.test.js`가 결함 조건을 본다 — 중등 중단원 목록 = 정본 L2(누락 0, 순서 일치), 중단원 합 + 미지정 = 대단원 문항 수, 자식 키 안정, 옛 대단원 키 초안이 같은 문항 수로 복원, 중단원만 고르면 그 문항만, 메타 후보가 따라감, 마크업(접힘·0문항·포함됨).

## 원본 확인 파일 목록은 조각으로 (2026-11-17, 원본 출제 CI 상한 대응)

- 원본 하나를 확인할 때 Worker는 manifest + 최상위 index(`archive/data/archive2-source-verification-index-v2.json`, 약 3KB) + 해시 접두어 조각 1개(`archive/data/archive2-source-verification/index-v2/<0-f>.json`, 16개) + 시험지 조각 1개만 받는다. 이유: 통짜 index(`archive2-source-verification-index.json`)가 등록마다 커져 `tests/archive2-original-source-verification-shard.test.mjs`의 500,000 바이트 상한을 넘나들었다. 상한과 단언은 그대로 두고 구조로 풀었다.
- 해시 사슬: manifest → 최상위 index → 조각 → 시험지 조각. 한 단계가 늘어 대조는 더 강하다. 조각은 `sha256(sourceFile)` 첫 글자로 정하므로 새 시험지가 어느 조각에 가는지 빌더가 알아서 정한다(`archive/tools/build-archive2-catalog.mjs`가 재생성, 자동 등록기도 같은 빌더를 쓴다).
- 통짜 index는 지우지 않았다. 이미 배포된 옛 Worker가 읽고, 단체 출제(mixed) 조회가 아직 이것을 쓰기 때문이다. 빌더 주석 `COMPAT`에도 적었다. 옛 Worker가 계산하는 기준 버전에는 새 최상위 index가 들어가므로, 통짜 index·mixed 자료는 그 버전을 박아 만든다(순환 해시를 피하려고 최상위 index는 통짜 index와 자기 자신을 뺀 버전을 쓴다).
- 정리 순서: Worker 재배포가 확인되면 옛 Worker 호환 목적의 통짜 index 생성을 지운다. 그 전에 mixed 조회(`loadMixedVerificationRecords`)를 최상위 index 구조로 옮겨야 한다(그때는 순환 문제가 없어진다).

## 빈 풀이노트 인쇄 쪽 (2026-11-17)

- `archive/note-sheet.html`(+ `note-sheet.css` 화면, `note-sheet-paper.css` 종이, `note-sheet.js`)은 문제 없이 교재·쪽·번호 줄과 풀이 칸만 있는 A4 양식(풀이노트 2문항·4문항, 서술형 풀이노트 2문항, 다시 풀기 4문항)을 뽑는 단독 페이지다. 양식 선택(여러 개)·양식별 장수(1~30)·인쇄 버튼이 위에 있고 아래에 양식마다 한 장씩 축소 미리보기가 나온다. 인쇄할 때는 `#ns-print`에 고른 장수만큼 만들어 `@page { size: A4; margin: 0 }`로 쪽마다 한 장씩 나온다. 문항·카탈로그·저장소를 읽거나 쓰지 않는다. 이유: 선생님이 기존 문제집으로 수업할 때 학생이 풀이를 쓰는 양식을 아카이브에서 바로 뽑기 위해서다.
- 종이(`.ns-page` 안쪽)의 칸 이름·문구·치수·점 격자는 사용자가 시안으로 확정한 값이라 바꾸지 않는다. 종이 CSS는 인쇄 본문이라 화면 토큰을 쓰지 않고(색 숫자가 있다), 화면 조작 영역 CSS만 토큰을 쓴다. 모든 종이 규칙은 `.ns-page` 아래에 묶여 메뉴·조작 영역으로 새지 않는다.
- 들어가는 길: 메뉴 6개는 늘리지 않았고 홈 "빠른 평가" 칸과 `HOME_PRODUCT_REGISTRY`에도 넣지 않았다(평가가 아니라 양식이다). 대신 홈 맨 아래(휴대폰은 맨 끝)에 "수업 양식" 칸을 두고 `archive2-workspace.js`의 `HOME_FORMS` 목록으로 정적 링크(`<a href="note-sheet.html">`, 클릭 처리 코드·카탈로그 의존 없음)를 그린다. 나중에 다른 인쇄 양식이 생기면 `HOME_FORMS`에 한 줄만 더한다. 이 칸은 선생님 판별 없이 모두에게 보인다(홈의 다른 칸도 판별하지 않고, 빈 양식은 노출될 정보가 없다). 직접 주소로도 열린다.
- 확인 도구 주의: CDP `Page.printToPDF`를 base64 한 메시지로 받으면 PDF가 약 5MB를 넘을 때 응답이 오지 않아 멈춘 것처럼 보인다(8장 이상). `transferMode: "ReturnAsStream"` + `IO.read`로 받는다. 30장 PDF는 약 13MB다(점 격자 배경 때문에 쪽당 약 0.4~0.8MB).

## 시험지 쪽 안 읽는 순서는 번호 오름차순 (2026-11-18 사용자 결정)

- 한 쪽 안의 읽는 순서(왼쪽 단 위→아래, 오른쪽 단 위→아래)는 항상 문항 번호 오름차순이다. 칸 배정은 **열 우선·단조 증가**: 마지막에 놓은 칸 뒤만 쓰고, 한 단 전체를 쓰는 `subjective-2up`은 통째로 빈 단의 맨 위에만 놓는다(현재 단에 문항이 있으면 다음 단, 오른쪽 단도 못 쓰면 다음 쪽). 뒤 문항은 앞의 빈 칸을 채우지 않으므로 빈 자리와 쪽 수 증가는 감수한다. 코드는 두 벌이고 같은 규칙이다: `archive/layout-authority.js` `planLegacyProductionLayout`의 `findSlot`(원본 열기 쪽 배치 계획)과 `archive/exam-render-executor.js` `buildSlotPages`의 `findSlot`/`commitSlot`(문제지 만들기·단원별 기출·서버 PDF). 특수 칸이 없는 쪽의 번호순 ceil(n/2) 균등 분할은 그대로다. 회귀 테스트: `tests/exam-layout-reading-order.test.js`.
- 이유: 일반 문항 사이에 서술형이 끼면 행 우선 배정이 서술형 아래 빈 칸을 뒤 문항으로 채워 21→23→22로 읽혔다(동산중 1학기 중간 중3 6쪽 등). 사용자: "그냥 번호 순대로 가게", "쪽수는 전혀 고려 대상이 아니야". `subjective-4up`(데이터 0건)은 쪽당 6·8문항에서 배치가 달라질 수 있다(번호순은 유지).

## 시험지 문자열 처리는 공용 파일 하나 (2026-11-18, 렌더러 모듈화 첫 조각)

- `engine.html`(원본 시험지)과 `mixed_engine.html`(문제지 만들기·단원별 기출)이 같은 이름의 문자열 함수를 따로 복사해 두어, 한쪽만 고친 사고가 쌓여 같은 문항이 화면마다 다르게 나왔다(보기 값이 틀리게 나옴, `$<br>$` 글자 노출, 발문 중간 [보기] 상자, 표 안 `<보기>` 소실). 이제 `wrapLatex`·`normalizeSolutionLineBreaks`·`extractChoice`·`stripChoicePrefix`·`detectChoiceRenderMode`·`renderChoicesHTML`·`protectRenderSegments`·`normalizeViewBlocks`·`formatGridAnswer`(와 이들이 부르는 `normalizeHangulStatementBreaks`·`normalizeConditionMarkerBreaks`)는 `archive/render-text.js`(`APRenderText`) 한 곳에만 있고, 두 HTML에는 같은 이름의 한 줄 위임만 남는다. 이 함수를 고칠 때는 `render-text.js`만 고친다. DOM·window·MathJax에 닿는 코드를 넣지 않는다(표 엔진만 `globalThis.ApTableEngine`을 호출 시점에 읽고, 보기 변환은 `renderChoicesHTML(q, { formatChoice })` 훅으로 받는다).
- `wrapLatex`는 engine 방식(표·`question-table-wrap`을 통째로 보호, 리터럴 `\n`은 TeX 명령이 아님)에 mixed가 지켜 오던 것을 더했다: 보호한 블록 안에서도 한글 `<이름표>`와 수식 안 `<`·`>`는 글자로, `$` 없는 TeX 명령은 수식으로 바꾼다(`repairStructuralBlock`). 그리고 수식 밖 TeX 명령 바로 뒤의 `__HTMLTAG_n__` 표지를 하위 첨자로 먹지 않는다(`wrapBareLatex`).
- 회귀 테스트: `tests/archive-render-text-shared.test.js`(사고별 실제 문항 표본 + 두 HTML에 본문 복사가 없는지 구조 검사). 오답 엔진(`apmath/wrong_print_engine.html`)은 아직 자기 복사본을 가진다.

## 렌더 엔진 파일을 바이트·해시로 고정하는 검사 금지 (2026-11-18 사용자 결정)

- 렌더 엔진 파일(`archive/engine.html`, `mixed_engine.html`, `apmath/wrong_print_engine.html`, 이들이 싣는 `archive/*.js|css`·`archive/css|js/`·학생 내비 CSS/JS)의 현재 바이트·git blob·sha256·줄수·크기를 고정 상수와 비교해 다르면 실패하는 검사를 만들지 않는다. 승인 기록(영수증·픽스처)은 "그 판본으로 승인했다"는 과거 기록으로 두고 기록 안의 해시는 그 시점 git 객체와만 대조한다. 현재 엔진이 그 판본과 같아야 한다는 요구는 두지 않는다. 대신 문항 수, 렌더 준비 완료, 수식 오류 0, 넘침 없음 같은 결함 조건을 검사한다. 글꼴·벤더 라이브러리·원본 시험지·그림 자산의 바이트 고정은 이 규칙의 대상이 아니다.
- 이유: 인쇄 눌림 핫픽스의 `?v=` 한 줄까지 CI를 깨뜨려 엔진을 고칠 때마다 known-failure가 쌓였다. 사용자: "이런 거 없애버려. 쓸데없는 거다. 이런 것 때문에 계속 문제가 생기는 거야."

## 계속 바뀌는 원본·자료를 과거 기록과 비교해 실패시키는 검사 금지 (2026-11-18 사용자 결정)

- 계속 바뀌는 원본 시험지·자료의 현재 바이트·blob·sha·판본을 과거 기록(영수증·4칸 파일·고정 상수)과 비교해 다르면 실패하는 검사를 만들지 않는다. 결함 조건(누락·중복·깨진 참조·수식 오류·넘침 0 등)과 설계상 불변인 것(봉인 문서 해시, 크로스워크 추가만, 4칸 사전 번호, 발급된 영수증 자체의 무결성)만 검사한다. 영수증이 옛 원본에 대한 것이면 재등록 대기로 세고 실패로 치지 않는다(`tests/helpers/source-changed-since-review.cjs`).
- 이유: 다른 세션의 정상 수정이 이런 비교를 깨 main CI가 막히고 known-failure 목록이 쌓였다. 사용자: "변할 수 있는 것들에 대한 검사들은 다 없애버려", "계속 변하는 아카이브랑 자료들인데 CI 때문에 작업들이 늘어지면 과감히 정리해야 됨".

## 옛 믹서(`archive/mixer.html`) 진입 링크 숨김 (2026-11-18 사용자 결정)

- `archive/index.html`의 "믹서 출제" 버튼은 "문제지 만들기"(`workspace.html?view=compose`)로 바꿨고, 리포트센터(`apmath/js/report-center.js`)의 "믹서 열기" 버튼과 MIXED 출제물의 열기 링크(믹서 주소)는 없앴다. `mixer.html`·`mixer-selector.js`는 다른 화면이 모듈을 쓰고 저장된 주소로 열 수 있어 지우지 않았다.
- 이유: 아카이브 난이도는 정수 1~5만 쓰는데, 옛 믹서는 상/중/하 필터를 쓰는 유일한 화면이다. 고치지 않고 입구를 숨기며(옛 화면 제거 계획과 같은 방향), 같은 기능은 문제지 만들기가 제공한다.

## 기준 시험지로 다시 만들기: 선정 모듈 (2026-11-20, 화면 연결 전 본체)

- `archive/archive2-derive.js`(브라우저·node 겸용 순수 함수)가 "같은 유형 / 다른 유형" × "기본 / 응용 / 심화"로 기준 시험지(빠른 평가·저장 문제지·출제본·학교 기출·교과서 단원)에서 한 벌을 다시 뽑는다. 화면은 아직 부르지 않는다(`?v=` 변경 없음). 진입: `buildDeriveIndex(records, {unified?, projectionPolicy, manifest, isBlank?})`로 색인을 한 번 만들고, `deriveFromPaper(baseItems, {typeMode, level, sources, exclude, seed, includeBlank}, index)` → `{items, perItem[{baseUid, pickedUid, rung, hintOnly, levelDelta, relaxed}], summary}`.
- 문항 층 사다리: 세부 유형(templateKey, 없으면 metaHintTPL) → 유형(problemTypeKey / metaHintPT) → L4·conceptClusterKey → 소단원(subUnitKey) → 대단원(통합 단원 층 `unitKey`) → 범위 안 그 밖(`none`). 같은 칸 안에서 정식 일치가 힌트 일치보다 앞서고 힌트 일치는 `hintOnly`로 기록한다. CrossConcept·Condition은 같은 칸 안 동점 깨기 가산점이다.
- 시험지 층: 난이도 목표(same = 기준 분포, up-some = 5가 아닌 문항의 절반쯤 +1, up-one = 전부 +1, 5는 5)를 맞춘다. 세부 유형 칸에서만 ±1을 허용하고 누적 편차가 줄어드는 쪽을 택해 전체에서 상쇄한다. 같은 원본 파일 몰림은 감점한다.
- 필수 경계: 기준 문항들이 놓인 (학년·통합 과목)과 그 안에서 기준이 덮는 통합 대단원(시험 범위) 집합 밖은 어느 단에서도 뽑지 않는다. **교육과정(2015/2022)은 경계가 아니다**: 통합 단원 층이 같은 단원에 놓은 2015·2022 문항(고1 수학(상)(하)↔공통수학1·2, 고2·고3 대응 과목, 중등 2015/2022)은 모두 후보다(사용자 2026-11-20, 학교는 대수·수학I을 한 시험 범위로 본다). 이유: 교육과정으로 나누면 2015 시험지는 2022 문항을 쓰지 못해 후보가 반토막이 난다. 후보가 없어도 문항 수를 유지하려고 범위 안 다른 단원에서 `none`으로 채우고, 범위 안에 아무것도 없으면 빈 자리로 두고 `summary.shortfall`에 알린다.
- 제외: 기준 문항 자체와 `exclude`로 받은 UID만. **기준 문항의 유사 사본은 제외하지 않는다**(사용자 2026-11-20 정정, 같은 세부 유형 칸의 정상 후보). 이유: 학생이 풀어 본 유형을 다시 풀어도 괜찮다.
- 다른 유형 모드: 기준에 나온 세부 유형(없으면 유형)을 피하고 같은 단원·난이도 구성을 유지한다. 모자라면 자기 문항의 유형만 피하도록 완화한다. 완화하면 시험지 안 다른 문항과 유형이 겹칠 수 있고(그 문항 자신의 유형은 피한다), `relaxed`·`summary.notes`에 그렇게 기록한다.
- 빈 문항 제외: 정답이 없거나 해설·해설 그림이 모두 없는 문항(빠른 진단평가의 빈 문항 제외와 같은 기준, `isBlankQuestion`)은 기본 후보에서 뺀다. `buildDeriveIndex`의 `isBlank(record)`로 판정을 받고(카탈로그에는 정답·해설이 없어 호출자가 원문을 읽어 준다; node 쪽은 `archive/tools/derive-blank-check.cjs`), `includeBlank: true`로 포함할 수 있다. `isBlank`를 주지 않으면 빈 문항을 가리지 않는다(`index.blankKnown=false`). 이유: 교과서 문항 상당수가 정답·해설이 없어 그대로 뽑으면 학생이 풀 수 없는 시험지가 된다.
- 출처(`sources`): all / school(학교 기출) / similar(유사) / textbook(출판사별 `publisher`) / workbook(교재·유형: `types/`와 백발백중). 판정은 기존 `Archive2Output.materialKind`와 `textbooks/<폴더>` 폴더 표(textbook-source-manifest-v1.json의 folders)를 그대로 쓰고, 새 판정 규칙을 만들지 않았다(교재 구분만 `WORKBOOK_PUBLISHERS`).
- 같은 seed + 같은 입력 → 같은 결과(후보별 (seed, uid) 해시로 동점 처리, 입력 순서 무관). summary 문구는 단 이름("같은 세부 유형·같은 유형·같은 개념·같은 단원")과 "기준보다 쉬움·같음·어려움"뿐이고 내부 키 이름은 넣지 않는다. 일치율은 `summary.match`: `templateFormal`(세부 유형, 정식만) · `template`(정식+힌트) · `type`(유형) · `level`(난이도) · `unit` · `hintRate`(힌트로 고른 비율) · `noTypeInfoRate`(기준 문항 중 유형 정보 없는 비율). 유형 정보(세부 유형·유형)가 없는 기준 문항은 해당 유형 일치율의 분모에서 빼고 그 비율을 `noTypeInfoRate`로 따로 낸다. 여러 지표를 평균한 한 숫자는 만들지 않는다(어느 지표가 약한지 가려지기 때문).
- 읽는 필드는 정본 필드뿐이다(사본 필드 `rpmPrimary*` 안 읽음): questionUid, sourceFile, contentType, problemTypeKey, templateKey, metaHintPT/TPL, difficultyBucket, L4, conceptClusterKey, subUnitKey, crossConceptKeys, conditionKeys와 통합 단원 층의 배치.
- 부족 주문서: `node archive/tools/derive-coverage-report.mjs --out <저장소 밖 폴더>`가 원본 시험지 전체에 same 유형 × (same, up-one)을 돌려 (과정, 세부 유형, 목표 난이도)별 "후보가 모자란 칸 × 그 칸을 요구하는 시험지 수"와 학년·학기·난이도 모드별 일치율 중앙값 (a)~(f)(위 `summary.match` 지표별로 따로)를 낸다(유사·교재 문항 생성의 우선순위). 빈 문항은 후보·공급 수에서 뺀다(`--include-blank`로 포함). 저장소에는 쓰지 않는다.

## 진단평가 결과표 화면 (2026-11-20, 첫 상담용 A4 2쪽)

- `archive/assessment/diagnostic-report.html`(+ `diagnostic-report.js`·`diagnostic-report-view.js`·`diagnostic-report.css`)는 진단평가 결과지다. 계산은 `diagnostic-report-data.js`(순수 집계)가, 문구·그림 문자열은 `diagnostic-report-view.js`(순수, DOM 없음)가, 읽어 오기·입력 칸·쪽 맞춤·인쇄는 `diagnostic-report.js`가 맡는다. 시안과 같은 구성: 1쪽 총평·단계·흐름·단원·단원×단계, 2쪽 유형·틀린 문항·다음 4주 수업 계획·선생님 의견. 학원명은 `diagnostic-report.js`의 상수 `ORG_NAME`("AP 수학학원") 한 곳이고 입력 칸이 없다. "선생님 의견"은 입력 없이 빈 상자로 인쇄해 상담 때 손으로 적는다(자동 문구·화면 입력 없음, 이유: 원장님이 상담하면서 말하고 시범 수업 시간 등을 적는다).
- 입력은 주소의 `?uids=문항UID,문항UID,…`(시험지 식별값, 순서 = 문항 번호)와 선생님이 누르는 문항별 O/X다. 이유: 진단평가를 만드는 화면이 `questionUids`를 이미 갖고 있고, 만든 시험지의 출력 봉투(IndexedDB)는 30분이면 사라져 다시 여는 길로 못 쓴다. 문항의 단원·단계·유형은 교사 작업공간과 같은 자료 층(`applyArchiveMetaFoundationCatalog` → `Archive2UnifiedUnits`·`Archive2Core.metaFacetsOf`·`createLabelOf`)에서 읽는다. 자료 읽기 길(`data/…`)은 `document.baseURI`를 `archive/` 기준으로 읽는다. 이 html은 `assessment/` 안에 있어 `<base>` 태그를 쓰지 않고(배포 검사 `archive-pages-site-reach`가 src·href를 파일 위치 기준으로 풀기 때문에 `<base>`와 어긋난다), 맨 앞 인라인 스크립트가 `document.baseURI`만 한 칸 위(`archive/`)로 맞춘다. 파일 주소(src·href)는 모두 이 파일 위치 기준(`../archive2-boot.js`, `diagnostic-report.css`)이다.
- **저장하지 않는다**: 학생 이름·O/X는 서버·localStorage·sessionStorage·URL·`document.title` 어디에도 남기지 않는다. 새로고침하면 사라지는 것이 맞다(이유: 학생 정보를 아카이브가 보관하지 않는다). 문항을 모두 입력하기 전에는 결과표를 그리지 않는다(일부만 계산한 결과지가 학부모에게 나가지 않게).
- 작은 표본: 문항 3개 미만인 칸(단계·단원·단원×단계·유형)은 판정 문구·색 없이 맞은 수/문항 수만 쓴다. 단원 강약은 약한 단원 문항 수로 환산해 2문항 이상 차이일 때만 말한다. 이름 없는 유형은 "유형 미분류"로 묶고 키 글자(PT·TPL)·UID는 화면·인쇄물에 내지 않는다. 문구는 평가가 아니라 "학원이 이렇게 진행한다" 톤이다.
- A4 2쪽은 쪽 맞춤으로 고정한다: 인쇄 폭(794px)에서 따로 높이를 재 `data-fit` 0~5 중 한 쪽에 들어가는 가장 여유 있는 단계를 고르고(4·5단계는 단원이 6~8개 넘게 많을 때 단원×단계 표 칸·도넛·그래프를 줄이며, 5단계로도 넘치면 푸터를 뺀 본문을 `--shrink` 비율로 줄여 쪽 아래가 잘리지 않게 한다. 비율 0.55까지 줄여도 넘치는 극단만 화면 경고), 입력 칸의 "입력 N / M" 표시는 스크롤해도 붙어 있게 sticky다. 전부 정답이면 총평의 "틀린 문항이 있는 부분…" 꼬리 문장을 빼고, 전부 오답이면 도넛 호를 그리지 않는다. 유형 표는 10행(나머지는 한 줄 요약), 틀린 문항은 8개 넘으면 두 열로 둔다. 휴대폰 규칙은 `@media`가 아니라 `@container`(폭 640 이하)라 화면 폭과 상관없이 측정·인쇄가 같은 배치다. 색만으로 구분하지 않는다(O/X 채움·테두리, 단원×단계 농도·빗금·숫자, 판단 글자 태그). 꺾은선의 단계 띠는 글자를 찍지 않고(단계가 번갈아 나오면 글자가 겹친다) x축은 문항 번호 눈금(1·6·12·18·24번 꼴, 눈금 간격 34 이상 보장)과 그래프 아래 범례 한 줄이 맡는다. 결과표 본문은 `word-break: keep-all`(어절 단위 줄바꿈, 칸보다 긴 낱말만 `overflow-wrap: break-word`로 끊김).
- 진단평가 시험지를 만든 화면(빠른 평가)에서 이 화면을 여는 단추는 후속이다: `diagnostic-report.html?uids=` 뒤에 `questionUids`를 쉼표로 이어 붙이면 된다.

## 평가팩 공용 코드와 빠른 평가 "준비된 평가지" (2026-11-19)

- 시험지 보관함(`archive/assessment/assessment-mvp.html`)과 빠른 평가의 "준비된 평가지" 구역(`archive/archive2-quick-packs.js`, 전역 `Archive2QuickPacks`)이 **`archive/assessment/assessment-pack-core.js`(전역 `AssessmentPackCore`) 하나**를 같이 쓴다. 이유: 둘 다 "준비된 문항으로 평가 한 장을 뽑아 출제"하는 같은 일이라, 팩 → MIXED 키·`pack_id`·`pack_hash`·출제 패널 항목·엔진 주소·평가 전달 자료 정리를 두 벌로 두면 한쪽만 고쳐져 출제 건이 갈라진다.
- 키는 한 글자도 바꾸지 않는다: 팩 `id`, MIXED 키 `assessment_<팩번호>_<문항구성해시>`, localStorage `mixedQuestions_/mixedMeta_assessment_…`. 구역은 닫힌 채로 시작하고 열 때만 공용 코드와 팩 자료 파일 2개를 받는다(첫 화면 요청 0). 구역은 작업공간 상태에 값을 더하지 않고(상태는 `archive2-quick-packs.js` 안), `archive2-workspace-compose.js renderQuick`이 `Archive2QuickPacks.markup()`을 끼워 넣는다.
- 탭은 중간·기말평가·모의고사뿐이다(사용자 결정 2026-11-19): 단원평가는 즉석 조립과 겹치고, 진단평가는 즉석 조립 상품으로 따로 만든다. 팩 자료 파일에서는 지우지 않는다(옛 보관함 화면과 이미 나간 출제·학생 복습이 packId로 연다). 목록은 팩 수·문항 구성을 고정하지 않고 자료에서 읽는다.
- 테스트: `tests/archive2-quick-packs.test.js`(구역·공용 코드), `tests/assessment-assign-panel.test.js`·`tests/assessment-open-resilience.test.js`(공용 코드를 보관함 스크립트와 함께 vm에서 실행).

## 기준 시험지로 다시 만들기: 화면 연결 (2026-11-20, PR1)

- 화면 코드는 `archive/archive2-workspace-derive.js`(작업 화면 여덟째 파일, recent 뒤·main 앞), 선정은 `archive2-derive.js`(순수 함수), 출력 창의 단추는 `archive/archive2-derive-entry.js`다. 이유: 선정 규칙을 화면과 섞으면 진단평가·빠른 평가가 같이 쓰지 못한다.
- 진입 셋: (1) 출력 창(`mixed_engine.html`, 빠른 평가 결과·출제 내역에서 연 작은 창)의 "이 시험지로 다시 만들기"(PC는 도구줄, 휴대폰은 ⋯ 메뉴) (2) 출제 내역 줄의 "다시 만들기"(서버가 돌려주는 출제 당시 시험지의 UID로) (3) 문제지 만들기 결과 요약의 "다시 뽑기". 출력 창에는 카탈로그가 없어서 문항 식별자(UID·원본 파일·번호, 문제 내용은 아님)만 `postMessage`로 이 창을 연 작업 화면에 보내고, 작업 화면이 대화 상자를 연다. 응답이 없으면(작업 화면이 닫힘) `workspace.html?derive=<uid>…`를 새 창으로 연다. 이유: 작은 창에서 카탈로그를 다시 받으면 분 단위로 걸린다.
- 선택은 유형(같은/다른) · 난이도(기본/응용/심화) · 어디서 뽑을지(전체/학교 기출/유사/교과서(출판사)/교재). 결과는 단 이름 문구(`같은 세부 유형 15 · 같은 유형 6 …`, `기준보다 쉬움 n · 같음 n · 어려움 n`)와 모자람·완화 안내로 보여 주고 막지 않는다. 내부 키는 화면에 내지 않는다.
- 뽑는 단계는 원본 시험 파일을 열지 않는다(요청 0). 빈 문항 제외도 하지 않는다(`includeBlank: true`): 필드는 채워질 예정이고, 뽑힌 문항을 열어 확인하느라 첫 실행이 분 단위로 걸렸다(사용자 결정 2026-11-20). 원본은 "시험지 열기"·"문제지 만들기에서 이어서"를 눌렀을 때 고른 문항 것만 읽고, 그때 시험지 순서를 정한다: 객관식 먼저·서술형 뒤, 각 묶음 안은 뽑은(기준 시험지의 자리) 순서 그대로(객관식 여부는 카탈로그에 없어 원본 문항의 보기·정답으로 본다). 요약 안내는 선생님이 할 수 있는 것만 낸다: 유형 정보가 확정 전인지(참고용) 구분은 내부 지표로만 두고 화면에 내지 않는다. 걸러내는 조건은 설계에 있던 것(기준 문항·앞서 뽑은 문항 제외, 학년·과목 경계)뿐이다.
- UID가 없는 옛 출제본: 원본 파일 + 문항 순번(없으면 번호)으로 카탈로그에서 UID를 되찾는다. 하나도 못 찾으면 "옛 형식 출제본이라 다시 뽑기를 지원하지 않습니다"를 보이고 대화 상자는 열지 않는다.
- 문제지 만들기로 넘길 때는 새 길을 만들지 않고 이미 있는 "고른 문항 UID 목록" 범위(`?uid=` 경로, `applyUidRoute`)를 쓴다. 서버가 같은 목록으로 `selection_filters`를 재검증하므로 새 조건 키가 없다(`tests/archive2-draft-rows.test.js` "다시 뽑은 문제지 → 실제 저장 요청 범위 → 서버 재현 통과": Worker 소스의 FILTER_KEYS를 읽고 `core.matches`·`generalUseEligibility`로 재현). 넘기기 전에 만들던 문제지는 저장하고 작업 화면을 새로 연다.
- 초안에는 `derive`({baseUids, typeMode, level, source, publisher, seed, exclude, resultUids, 요약 문구})를 같이 저장한다. 다시 열면 같은 문항과 같은 안내가 보이고, "다시 뽑기"는 새 seed에 앞서 준 문항(`exclude`+`resultUids`)을 빼고 뽑는다. 선택 문항이 `resultUids`와 달라지면(문항 교체 등) 안내는 숨긴다. 이유: 고친 문제지를 "다시 만든 그대로"라고 말하면 틀린 안내가 된다.
- 대응 과목(대수↔수학I 등)은 `archive2-derive.js`가 통합 단원 층으로 한 묶음으로 보고, 학기는 과목 문항을 거르지 않는다(#2594와 같은 규칙).

## 원본 시험지·해설·정답 열기는 승인 메타 sidecar를 기다리지 않는다 (2026-11-20, 선생님 속도 실측 1순위)

- 실측(이 PC, 캐시 없는 새 프로필): 시험지 하나 열기가 `data/question_metadata.json`(압축 전 87.6MB, gzip 15.3MB)을 받고 해석한 뒤에야 첫 문항을 그렸다(전송 17.7MB 중 15.3MB, 20Mbps로 약 7초). 그림 그리는 데는 이 메타를 읽지 않는다: `render-authority.js` 등에 `_archiveMetadata`·`standardUnitKey` 사용이 없고, 채워지는 `standardUnitKey` 등은 반 출제 등록(`submitQr=1` / `osqr=1`)이 서버로 보내는 값뿐이다.
- `engine.html`은 등록 주소일 때만 `question-meta.js`를 불러온다(`<script id="engine-metadata-gate">`, 같은 자리에서 `document.write`라 순서·`await window.__ARCHIVE_METADATA_READY__`는 그대로). 평소 열기(`engine.html?data=exams/<file>&mode=exam|sol|ans`)는 sidecar 요청이 없다. 이유: 믹스 리더(`output-metadata-loader.js`)가 이미 같은 규칙이다. 테스트: `tests/archive-engine-original-metadata-on-demand.test.js`.
- 이 규칙을 되돌리지 않는다. 등록 주소에 새 이름이 생기면 위 게이트의 조건에 함께 넣는다.
