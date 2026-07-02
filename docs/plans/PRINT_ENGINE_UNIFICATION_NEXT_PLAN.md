# PRINT_ENGINE_UNIFICATION_NEXT_PLAN

시험지 출력 엔진 3종(엔진 / 믹서엔진 / 오답엔진)의 렌더링 코어 통합과, 통합 후 미리보기 기반 문항 편집(단원별 문항수 확인, id별 제외, 시험범위 밖 문항 제외) 기능까지의 로드맵.

## 1. 현재 상태

### 1.1 엔진 3종 비교

| | 엔진 (`archive/engine.html`) | 믹서엔진 (`archive/mixed_engine.html`) | 오답엔진 (`apmath/wrong_print_engine.html`) |
|---|---|---|---|
| 용도 | 아카이브 시험 파일 통째 출력 | 믹서 카트(자유 구성) 출력 | 오답 클리닉 문항 출력 |
| 데이터 입력 | URL 파라미터(`data=exams/x.js`) — 무상태, 링크 공유 가능 | `localStorage` 키 핸드오프(`mixedQuestions_<key>` + `?key=`) — 휘발성, 공유 불가 | 서버 API(`packet`/`set` 키) + URL 압축(`wp=`) + storage + **postMessage 실시간 채널** |
| qpp(문항/쪽) | index 모달(`qppModal`)에서 4/6 고정, 엔진 내 변경 불가 | 2/4/6/8 **라이브 변경** | 4 고정(`CLINIC_QPP`) |
| 문항 조작 | 없음(파일 전체 id순 출력) | 셔플, 카트 자유 구성, PDF 뷰어 지원 | 오답 자동 추출 |
| 헤더 편집 | 팝오버 폼 | 팝오버 폼(복붙 동일) | 팝오버 + **미리보기 인라인 편집**(contenteditable, 포커스 보존 로직 포함) |
| 미리보기 | 새 탭(`fit=screen` 축소 지원) | 새 탭 | **임베드 iframe(`preview=1`) + 설정 변경 시 자동 갱신**(`apmath/js/clinic-print.js` 좌설정/우미리보기) |
| OS 연동 | 블루프린트·출제이력 자동 등록(`registerBlueprintToOS`, `registerClassExamAssignmentToOS` — `submitQr`/`class` 파라미터 있을 때만) | 출제 학급 선택 모달 | 서버 저장 payload → 짧은 QR 키 |

### 1.2 문제점

- **렌더링 코어 삼중 복제**: `SE_OVERHEAD_*` 상수, staging 측정, 페이지네이션, `printHeaderOptions` 정규화(clampText/normalize/getDefault), QR 패치가 세 파일에 거의 동일 코드로 존재. 이미 드리프트 시작(오답엔진에만 `showDate`, 믹서에만 qpp 셀렉트/셔플). 기능 하나 추가 시 3회 작업 + 회귀 3배.
- **아카이브 QR 출제 흐름에 내용 확인 단계 없음**: `archive/index.html`의 "AP 제출 QR" 경로는 시험 → 출력방식 → qpp → 출제 대상 선택 → 최종 확인(**명단만**) → 출제 완료 순서라, 시험 내용을 한 번도 보지 않고 출제가 끝난다.
- **믹서 핸드오프 휘발성**: localStorage 기반이라 "어제 만든 믹서 시험지 재출력"이 불가능하고 링크 공유도 안 된다.

### 1.3 활용 가능한 기존 자산 (확인됨)

- 시험 데이터 문항마다 단원 메타 보유: `id`, `level`, `standardUnit`, `standardUnitKey`, `standardUnitOrder`, `standardCourse`, `category`, `questionType`, `tags`.
- `archive/db.js` 시험 메타에 시험범위 보유: `rangeStartUnitKey`~`rangeEndUnitKey`, `courseRanges` — "범위 밖 문항" 자동 판별 가능.
- 블루프린트 등록이 이미 `question_no`(출력 순번)와 `source_question_no`(원본 id)를 분리 저장 — 문항 제외·재번호 시 스키마 변경 불필요.
- `engine.html`에 `fit=screen` 축소 렌더 존재, 등록 API는 `submitQr`/`class` 없으면 no-op — 부작용 없는 미리보기 임베드가 지금도 가능.
- 오답엔진의 `preview=1` 모드: 툴바 축소, `AP_CLINIC_PREVIEW` postMessage 수신, `AP_CLINIC_HEADER_EDIT` 역방향 동기화, 편집 중 재렌더 보류(포커스 보존) — 표준화할 원형.

## 2. 최종 목표

세 엔진을 **하나의 렌더 코어 + 소스별 어댑터** 구조로 수렴하고, UI는 "작업대(Workbench)" 패턴으로 통일한다.

```
┌────────────────────────────────────────────────────────┐
│ 툴바: [시험지|해설지|정답표] [문항/쪽 2·4·6·8] [셔플]     │
│       [QR출력 ▾] [인쇄/PDF] [출제하기 →]                 │
├──────────────────┬─────────────────────────────────────┤
│ 소스 패널(교체식) │  라이브 미리보기 (print-core iframe)  │
│ · 아카이브: 시험  │  · 설정 변경 시 postMessage 즉시 갱신  │
│   정보+문항 목록  │  · 제목/보조문구 인라인 직접 편집       │
│ · 믹서: 카트+필터 │  · 실제 인쇄물과 동일한 페이지네이션    │
│ · 클리닉: 학생/   │                                     │
│   시험 선택       │                                     │
├──────────────────┴─────────────────────────────────────┤
│ [출제하기] → 대상 선택(학년→반→학생) → 최종확인(명단+시험지) │
└────────────────────────────────────────────────────────┘
```

각 엔진에서 가져와 표준화하는 것:

- **오답엔진**: `preview=1` + postMessage 채널, 인라인 헤더 편집, 서버 저장 payload(짧은 키·재출력).
- **믹서엔진**: qpp 라이브 변경(2/4/6/8), 셔플. qpp가 엔진 안에서 바뀌면 `archive/index.html`의 `qppModal` 단계 삭제 가능.
- **엔진**: URL 무상태 로딩, OS 블루프린트/출제이력 등록, `fit=screen`.

통합 데이터 계약: `{ source: 'archive'|'mixer'|'clinic', items[], meta, headerOptions, qpp, qrOptions }`. 로딩 우선순위는 서버 키 > URL > storage > postMessage(미리보기).

통합 후 문항 편집 기능(아카이브 소스 패널):

- 단원별 문항수·난이도 분포 요약 + 단원 단위 on/off
- 문항 목록에서 id별 제외/복원, 체크 변경 시 미리보기 즉시 재렌더
- `db.js` 시험범위 메타 기준 "범위 밖 문항" 자동 표시 + 일괄 제외
- 제외 상태는 URL 파라미터(`exclude=5,12,17`)로 표현 — 무상태·공유·재출력 유지

## 3. 절대 금지/보류

- **기존 QR URL 하위호환 절대 유지**: 이미 인쇄되어 나간 시험지의 QR이 `wrong_print_engine.html?packet=...`, `engine.html?data=...` 등을 가리킨다. 세 파일의 URL·파라미터는 영구히 동작해야 하며, 통합은 내부 구현 교체로만 한다. 최종 수렴 시에도 기존 파일은 shim으로 유지.
- **인쇄물 페이지네이션 회귀 금지**: 코어 추출 전후 출력물이 페이지 단위로 동일해야 한다(리포트 PDF와 동일하게 page-break 검수 최우선). 믹서엔진은 "Rulebook v1.9" 자체 수정분이 있어 별도 비교 필수.
- 믹서의 3패널 자유 구성 UI(mixer.html) 자체 개편은 이번 범위에서 **보류** — 카트 소스 패널로의 이식은 최종 수렴(Phase 6) 시점에 판단.
- Phase 4(워커 API) 전까지 서버/스키마 변경 금지. 프론트 커밋만으로 워커 API는 반영되지 않음(별도 배포 토폴로지) 유의.

## 4. Phase 구조

### Phase 0 — 아카이브 출제 전 미리보기 (선행 퀵윈, 코어 통합과 독립) ✅ 완료 (2026-07-02)

QR 출제 경로에서 시험 내용을 확인하고 출제하도록 한다. 기존 `fit=screen`과 등록 API 가드를 그대로 활용.

1. `engine.html`에 `preview=1` 모드 추가: 상단 툴바 숨김, `fit=screen` 강제, 등록 함수 2종 방어적 스킵, QR 삽입 생략.
2. `renderAssignTargetSelectView` 헤더에 "시험지 미리보기" 버튼 → 우측 슬라이드 iframe(좁은 화면은 오버레이/접이식). iframe은 첫 클릭 시 lazy load.
3. `renderAssignTargetReviewView`(최종 확인)를 좌측 명단 / 우측 시험지 미리보기 2단으로 — "이 명단에게 이 시험지가 출제됩니다"를 한 화면에서 확정. Phase 2 완료 후 표준 채널로 자연 흡수.

**구현 노트 (계획과 다른 점/추가된 것):**

- 제출/해설 QR 차단은 `shouldRenderSubmitQr()`/`shouldRenderSolutionQr()`에 `isPreviewMode()` 가드 한 곳으로 처리 — 등록 함수 2종은 `shouldRenderSubmitQr()`을 게이트로 쓰므로 자동으로 함께 차단된다.
- preview 모드에서 모드 탭(시험지/해설지/정답표)은 남겨서 출제 전 해설·정답까지 확인 가능.
- 미리보기 iframe은 `#assignTargetBody`가 조작마다 innerHTML 재렌더되는 구조라 **모달 박스의 형제 요소**(`#assignTargetPreviewPane`)로 두었고, 같은 시험이면 src를 유지해 뷰 전환/체크 조작에도 리로드되지 않음(검증됨).
- 미리보기 열림 시 모달 폭 920→1400px 확장, ≤1024px에서는 세로 스택(44vh) 폴백.
- 출제 진행(progress) 화면 진입 시 미리보기는 자동으로 닫힌다.
- 로컬 프리뷰 한정 이슈: `npx serve`의 cleanUrls가 `engine.html?query` 리다이렉트 시 쿼리를 유실 → 루트에 `serve.json`(`cleanUrls: false`) 추가로 해결(운영 Pages는 영향 없음).
- 검증 완료: preview 무부작용(등록 API 미호출), 일반 모드 회귀 없음(submitQr QR 삽입 정상), 재렌더 iframe 생존, review 2단, 모바일 폴백, 콘솔 에러 없음.

### Phase 1 — print-core.js 추출 (전제 작업) ✅ 완료 (2026-07-02)

- 페이지네이션·staging 측정·`printHeaderOptions`·QR 패치·모드 탭·screen-fit을 공용 모듈(`archive/js/print-core.js` 등 단일 파일)로 추출.
- 세 엔진이 코어를 소비하도록 교체. **UX 변경 동결** — 출력물 무변화가 검증 기준.
- 드리프트 정리: `showDate` 등 옵션 차이를 코어 옵션으로 승격.

**구현 노트 (계획과 다른 점/판단 기록):**

- 코어 구조와 API는 `docs/implemented/PRINT_CORE_MODULE_MAP.md`에 정리. `window.PrintCore` 단일 전역, 빌드 없음. 중복 코드 약 1,540줄 삭제(엔진 3종), 코어 690줄 신설.
- 시험지 페이지네이션은 `renderMeasuredExamPages` 하나로 통합하되 `makePage(pageNumber)` / `onBeforePageMeasure`(오답 homework) / `onPageRendered`(오답 그룹별 QR) 훅으로 엔진 차이를 흡수. 해설 컬럼 플로우는 `createSolutionFlow`(+`prepareColumn` 훅), 정답표는 `renderAnswerPages`.
- **믹서 "Rulebook v1.9" 자체 수정분 판단 — 흡수하지 않고 엔진 잔류로 확정**: 믹서만의 diff(측정 페이지 헤더 포함 `pNum===0||1` 조건, `extractChoice`의 `.answer` 키 부재, `protectRenderSegments`의 구식 보호 순서, PDF 모드, [성역] wrapLatex)는 전부 코어 추출 범위 밖 레이어(콘텐츠 파이프라인·makePage 훅)에 있어 코어에 넣을 필요가 없었다. 콘텐츠 정규화 파이프라인 전체는 Phase 1 범위에서 의도적으로 제외(1.2절 목록 그대로) — 오답엔진의 `normalizeViewBlocks` 마커 정규식도 엔진마다 달라 통일 시 출력이 변한다.
- 이미지 자동 사이즈 비율표가 아카이브(2.2/1.4/0.7/0.4)와 오답엔진(2.2/1.25/0.8)이 서로 달라, 코어 `createImageSizer`에 비율 함수·인라인 이미지 대기 여부를 주입하는 방식으로 각자 유지(출력 보존).
- `showDate`는 코어 `normalizePrintHeaderOptions`로 승격(엔진/믹서는 렌더에서 안 읽으므로 무해). screen-fit `updateScreenFitScale(maxScale)`에 상한 파라미터를 둠 — Phase 2 preview 축소(0.72)용.
- 엔진/믹서 `renderSol`에 있던 도달 불가 사(死)코드(이른 `return` 뒤 구현) 제거 — 출력 무영향.
- MathJax typeset은 코어에서 try/catch로 통일(오답엔진 방식) — 실패 시에도 렌더 계속. 정상 경로 무변화.
- 검증: 로컬 프리뷰로 전/후 페이지 시그니처 완전 일치 확인 — 엔진(qpp4/qpp6/해설 분할/정답표/QR 2종), 믹서(qpp2/qpp8/고정시드 셔플/해설), 오답(exam/review, `wp=` 하위호환). 상세는 implemented 문서 4절. `packet=`/`set=`/`data=`/`key=` 로딩 코드는 미변경.
- OS 등록 API·세션 복원 블록은 엔진/믹서에 아직 중복 — 렌더링 코어가 아니라 Phase 1 범위 밖. 이후 Phase에서 공용화 후보.

### Phase 2 — 미리보기 채널 표준화 ✅ 완료 (2026-07-02)

- 오답엔진의 `preview=1` + postMessage(payload 수신/헤더 편집 역방향) + 인라인 헤더 편집 + 포커스 보존 재렌더 보류를 코어로 이동.
- 메시지 타입을 `AP_CLINIC_*`에서 공용 이름(`AP_PRINT_PREVIEW`/`AP_PRINT_HEADER_EDIT`)으로 일반화, 기존 타입은 별칭 수신 유지.
- engine.html/mixed_engine.html도 임베드 미리보기 가능해짐.

**구현 노트 (계획과 다른 점/판단 기록):**

- `PrintCore.createPreviewController({ render, onPreviewMessage })`로 코어화: 250ms 디바운스, 편집 중(포커스가 `.clinic-editable`) 재렌더 보류 + focusout flush, 메시지 수신(수신 payload 적용은 엔진 훅), 인라인 헤더 편집(`enableHeaderInlineEdit`), `postHeaderEdit`.
- **수신은 신·구 타입 모두, 발신(헤더 편집)은 신·구 타입 동시 발신**: 덕분에 `apmath/js/clinic-print.js`는 한 줄도 수정하지 않았다(레거시 `AP_CLINIC_PREVIEW` 발신 → 별칭 수신, 레거시 `AP_CLINIC_HEADER_EDIT` 수신 → 동시 발신 중 하나 수신). 캐시로 신/구 버전이 섞여도 어느 조합이든 동작. 중복 수신은 양쪽 디바운스(재렌더 250ms/부모 push 150ms)가 흡수하며 핸들러가 멱등이라 안전.
- engine.html(Phase 0 preview)과 mixed_engine.html(preview 신설: 전용 CSS + screen-fit + no-data 시 alert 대신 안내 박스)에 채널 배선 — `mode`/`headerOptions` 수신 시 재렌더. **인라인 헤더 편집은 두 엔진에서 비활성**: 부모가 편집값을 상태로 관리해 echo하지 않으면 재렌더 때 편집값이 되돌아가 오해를 유발하므로, 부모 상태 관리가 생기는 Phase 3(툴바/작업대)에서 활성화한다.
- 믹서 `shouldRenderSolutionQr`/`shouldRenderSubmitQr`에 preview 가드 추가(엔진과 동일) — preview에서 QR 삽입·OS 등록(블루프린트/출제이력) 무부작용 보장.
- 검증(로컬 프리뷰): 오답엔진 iframe 하니스로 레거시/공용 타입 수신 렌더, 헤더 편집 blur→부모 신·구 타입 수신, 편집 중 메시지 보류→focusout flush 재렌더 확인. 엔진/믹서 preview에서 mode·headerOptions 반영, QR 차단(submitQr=1&solQr=1에도 미출력), 비-preview 렌더 시그니처 무변화, 콘솔 에러 없음.

### Phase 3 — 툴바 통일 ✅ 완료 (2026-07-02)

- qpp 라이브 셀렉트(2/4/6/8), 셔플(믹서 소스 전용 노출), QR 팝오버, 헤더 편집을 코어 툴바 단일 구현으로.
- `archive/index.html`의 `qppModal` 단계 제거(출제 흐름 1단계 단축).

**구현 노트 (계획과 다른 점/판단 기록):**

- `print-core.js`에 `renderPrintHeaderEditorHTML()` / `renderQrOutputPopoverHTML()` / `renderQppSelectorHTML(current)` / `changeQppParam(qpp)` 추가. 엔진/믹서는 HTML에 `<span id="print-header-editor-slot">` 등 placeholder만 두고, 정적 마크업(헤더편집·QR팝오버)은 스크립트 최상단에서, qpp 셀렉트는 `AppState.qpp`가 확정되는 시점(`init()`)에서 `outerHTML` 교체로 주입 — 마크업의 단일 소스는 코어 하나.
- **CSS는 의도적으로 각 엔진 `<style>`에 유지**(코어로 옮기지 않음): 클래스명(`.qr-output-wrap` 등)이 이미 두 엔진에서 byte-identical했고, 팝오버 열림 상태가 `.wrap.open .panel{display:block}` CSS 규칙에 의존해 인라인 스타일로 흡수하려면 토글 함수까지 다시 손대야 해 리스크만 커짐. "코어 툴바 단일 구현"은 마크업+동작(드리프트가 실제로 나던 지점)에 한정, 테마 CSS는 엔진 로컬 유지가 더 안전하다고 판단.
- **qpp 셀렉트를 아카이브 엔진에 신설**(이전엔 URL 파라미터로만 고정, 툴바에 값 표시 텍스트만 있었음)하며 옵션을 믹서와 동일하게 2/4/6/8로 통일 — 계획 문구 그대로. 엔진에 `.ctrl-right`/`.qpp-selector`/`#qppSelect*` CSS를 믹서에서 그대로 복사해 시각적으로도 동일하게 맞춤.
- 믹서의 로컬 `changeQpp(val)` 함수는 코어 `changeQppParam`과 완전히 동일해 삭제하고 셀렉트 마크업이 `PrintCore.changeQppParam(this.value)`를 직접 호출하도록 교체(죽은 코드 방지).
- `archive/index.html`: `qppModal`(HTML+전용 CSS `.qpp-btns`/`.qpp-opt`) 완전 삭제. `selectExamMode(withSubmitQr)`가 모달을 여는 대신 `confirmQpp(DEFAULT_ARCHIVE_QPP=4)`를 바로 호출 — qpp는 이제 engine.html 툴바에서 라이브로 바꿀 수 있으므로 사전 선택이 불필요해졌다는 계획의 전제를 그대로 반영. `confirmQpp`/`closeModal`의 나머지 분기(제출 QR 대상 선택 패널 vs 일반 출력)는 무변경.
- 검증(로컬 프리뷰): 엔진 qpp 4→6 라이브 전환, 믹서 qpp 4→8 라이브 전환 + 고정시드 셔플이 Phase 1 baseline과 페이지 시그니처 완전 일치. 헤더 편집(제목 입력→렌더 반영)·QR 팝오버(체크→URL 파라미터·버튼 텍스트 반영)가 코어 주입 마크업에서도 정상 동작. preview 모드에서 qpp 셀렉트도 기존 QR/헤더편집과 함께 숨김 확인. `index.html`에서 qppModal 없이 `selectExamMode(false)`/`selectExamMode(true)` 둘 다 기본 qpp=4로 `goEngine`/`openAssignTargetPanel`에 바로 진입 확인(스텁으로 재현). 콘솔 에러 없음.

### Phase 4 — 데이터 계약 통일 + 믹서 서버 저장화 (유일한 워커 변경 Phase) ✅ 프론트/워커 코드 완료, ⚠️ 워커 미배포 (2026-07-02)

- 통합 payload 스키마 확정. 로딩 우선순위: 서버 키 > URL > storage > postMessage.
- 믹서 localStorage 핸드오프를 오답 클리닉 packet API 패턴의 서버 저장으로 교체(공유·재출력 가능). 워커 라우트 추가/일반화.

**구현 노트 (계획과 다른 점/판단 기록):**

- **실제 버그 확인**: `apmath/student/index.html`의 `buildOmrReviewUrl`이 `archive_file='MIXED:<key>'`로부터 `mixed_engine.html?key=<key>`를 만들어 학생에게 "내 시험 다시 보기" 링크로 제공하는데, 이 `key`는 지금까지 **출제한 선생님 브라우저의 localStorage에만** 존재했다 — 학생이 자기 폰으로 열면 원천적으로 "데이터가 없습니다"가 뜨는 구조였다. Phase 4는 이 실사용 버그를 고치는 작업이기도 하다.
- 새 워커 라우트 `apmath/worker-backup/worker/routes/mixer-sets.js` + `index.js` 등록. 오답 클리닉의 배포/권한 모델(반·학생 대상 지정)은 통째로 가져오지 않고 **"불투명 payload 저장/조회"만** 하는 훨씬 단순한 테이블(`mixer_sets` 1개, `CREATE TABLE IF NOT EXISTS` 런타임 마이그레이션 — `wrong_clinic_*`와 동일하게 `schema.sql`에는 반영하지 않음, 기존 관례 유지)로 설계 — 믹서는 애초에 배포 대상 개념이 없어 그 복잡도가 불필요.
- **생성(POST)에 로그인을 요구하지 않기로 판단**: 기존 믹서 "일반 시험지 출력"(`openMixedEngine(false)`)이 로그인 없이도 동작했고, 로그인 요구를 추가하면 그 경로가 깨진다. `verifyAuth`가 헤더 없으면 `null`을 반환할 뿐 막지 않는 특성을 활용해 `teacher`가 있으면 `created_by`만 채우고, 없어도 생성은 통과시켰다. 남용 방지는 문항 수 상한(300)·payload 크기 상한(~600KB)만 적용 — 별도 rate limit은 이 Phase 범위 밖(기존 코드베이스에 그런 인프라 자체가 없음).
- **`archive/mixed_engine.html`**: `fetchMixerSetFromServer(key)` 추가, `init()`에서 `rawData`/`rawMeta`를 "서버 우선, 실패 시 기존 localStorage" 문자열로만 교체 — 그 아래 파싱/에러 처리/packId 폴백 분기는 **한 글자도 건드리지 않았다**(기존 3가지 에러 메시지 분기를 정확히 보존하기 위해 데이터 구조가 아닌 문자열 레벨에서만 소스를 바꿔치기하는 최소 diff 선택).
- **`archive/mixer.html`**: `openMixedEngine`을 `async`로 바꾸고 `saveMixerSetToServer`(POST, 실패 시 `null`)를 먼저 시도 → 성공하면 서버 키, 실패하면 기존 `mix_<timestamp>` 로컬 키로 즉시 폴백. `await` 뒤에 `window.open`을 호출하는 패턴은 `apmath/js/clinic-print.js`의 `clinicPrintSaveAndOpen`과 동일한 기존 선례(사용자 제스처 체인이 끊겨 팝업 차단 위험이 있음을 감수)를 따랐고, 그 파일처럼 `window.open`이 `null`을 반환하면 안내하도록 추가.
- `MIXED:<key>` 마커를 소비하는 다른 지점(`classroom.js`/`qr-omr.js`/`dashboard-admin.js`/`report-center.js`/`student/index.html`)은 전부 `key` 문자열만 그대로 전달할 뿐 포맷을 가정하지 않아 **무수정** — `mixed_engine.html`이 서버 우선으로 알아서 해석하므로 하위 호환 자동 유지.
- **검증 한계**: 워커가 아직 배포되지 않아(`ap-math-os-v2612`, [[apmath-deploy-topology]]) 실제 서버 저장/조회 왕복은 확인 못 했다. 로컬 프리뷰에서 확인한 것: (1) 실제 미배포 엔드포인트를 그대로 호출해 404/네트워크 실패 시 150ms 내로 조용히 `null` 반환 후 기존 localStorage로 정상 폴백(콘솔 에러 없음), (2) `fetchMixerSetFromServer`를 모킹해 서버 응답이 있을 때 localStorage보다 우선 사용됨을 확인, (3) `openMixedEngine` 전체 흐름이 서버 실패 상황에서도 기존과 동일하게 `window.open`까지 도달. **배포 후 실제 라운드트립(POST→키 발급→GET→학생 기기에서 재출력) 재확인 필요** — 사용자에게 배포 여부 확인 요청.

### Phase 5 — 아카이브 문항 편집 소스 패널 (단원별 문항수 / id별 제외 / 범위 밖 제외)

- 좌측 소스 패널: 단원 요약(문항수 + 난이도 분포, 단원 on/off) + 문항 목록(개별 제외/복원). 변경 시 postMessage 재렌더.
- `db.js` `courseRanges` 기준 "범위 밖" 배지 + 일괄 제외 버튼.
- 제외 상태는 `exclude=` URL 파라미터. **번호는 재번호 + 원본 id 추적**(`question_no` / `source_question_no` 분리 저장 활용).
- **출제 정합성**: 블루프린트/출제이력 등록, `q` 파라미터(문항 수), 채점 기준이 전부 "제외 반영 후" 기준으로 흘러가야 함. 어긋나면 OMR/제출 채점 문항 수 불일치 — 이 Phase의 최대 리스크.

### Phase 6 — 단일 print_engine.html 수렴 (장기)

- 단일 엔진 + 소스 어댑터. 기존 세 파일은 리다이렉트 shim.
- 믹서 카트 패널 이식 여부 판단.

## 5. 수정 가능 파일

| Phase | 파일 |
|---|---|
| 0 | `archive/engine.html`, `archive/index.html` |
| 1~3 | `archive/engine.html`, `archive/mixed_engine.html`, `apmath/wrong_print_engine.html`, `apmath/js/clinic-print.js`, `archive/index.html`, 신규 공용 코어 JS/CSS |
| 4 | 위 + `archive/mixer.html`, `apmath/worker-backup/worker/routes/*`(믹서 payload 저장 라우트) |
| 5 | `archive/engine.html`(소스 패널), `archive/index.html`, 코어 JS |

오답엔진은 `apmath/`, 나머지는 `archive/`에 있으나 같은 Pages 오리진이므로 공용 JS 공유 가능.

## 6. 제외 범위

- 믹서 3패널 UI(mixer.html) 자체 개편, 자동출제(autogen) 로직 변경
- OMR/채점 로직 변경(Phase 5는 등록되는 문항 수·번호 정합성만 보장)
- 시험 데이터 파일 포맷 변경, `db.js` 생성 파이프라인 변경
- 클리닉 오답 추출 로직(clinic-print.js의 payload 구성) 변경 — 미리보기 채널 코어화 시 소비부만 교체

## 7. 검증 기준

- **출력물 회귀(모든 Phase 공통, 최우선)**: 대표 시험 파일(4qpp/6qpp, wide 문항, 이미지 포함), 믹서 카트(2/8qpp, 셔플), 클리닉 packet을 코어 교체 전후 인쇄 미리보기로 페이지 단위 비교. 섹션/문항이 페이지 경계에서 쪼개지지 않아야 함.
- **미리보기 무부작용**: `preview=1`에서 블루프린트/출제이력 등록 API 호출이 발생하지 않음(네트워크 탭 확인).
- **기존 QR 하위호환**: 기존 형식 URL(`packet=`, `set=`, `wp=`, `data=`, `key=`) 전부 정상 렌더.
- **출제 흐름**: 일반 출력 경로 무변화 → QR 경로 미리보기 열기/닫기 → 최종 확인 2단 → 출제 후 학생 포털 노출 확인.
- **Phase 5 정합성**: 문항 제외 후 출제 시 블루프린트 문항 수·번호, `q` 파라미터, 정답표가 모두 제외 반영 후 기준으로 일치.
- 모바일 폭(likely <900px)에서 미리보기 접이식/오버레이 폴백 동작.
- 로컬 검증은 `.claude/launch.json` 프리뷰 서버 사용.

## 8. 문서 업데이트 기준

- Phase 완료 시 본 문서의 해당 Phase에 완료 표시 및 실제 구현과 다른 점 기록.
- Phase 1 완료 시 코어 모듈 구조를 `implemented/` 문서로 남김.
- Phase 4 완료 시 워커 라우트 추가분을 도메인 문서에 반영.
- 출제 대상 선택 흐름과 겹치는 변경은 `ARCHIVE_EXAM_TARGET_SELECTION_NEXT_PLAN.md`와 상호 참조 유지.
