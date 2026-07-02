# PRINT_CORE_MODULE_MAP

시험지 출력 엔진 공용 렌더링 코어(`archive/js/print-core.js`)의 구조 문서. 엔진 통합 Phase 1~2(2026-07-02) 산출물.
계획·배경은 `docs/plans/PRINT_ENGINE_UNIFICATION_NEXT_PLAN.md` 참조.

## 1. 소비처

| 엔진 | 로드 방식 |
|---|---|
| `archive/engine.html` | `<script src="js/print-core.js">` |
| `archive/mixed_engine.html` | `<script src="js/print-core.js">` |
| `apmath/wrong_print_engine.html` | `<script src="../archive/js/print-core.js">` (같은 Pages 오리진) |

전역 `window.PrintCore` 하나만 노출하는 IIFE. 모듈 로더/빌드 없음(기존 정적 서빙 유지).
스크립트 태그는 인라인 엔진 스크립트보다 먼저(동기) 로드되어야 한다.

## 2. API 개요

### 페이지네이션 상수
`OVERHEAD_COL(10)` `OVERHEAD_GRID(20)` `PAGE_TOLERANCE(5)` `BLOCK_GAP(15)` `ANSWER_ROWS_PER_PAGE(40)`
— 구 `SE_OVERHEAD_*` 상수. 세 엔진 공통값 그대로.

### 시험지 렌더 파이프라인
- `renderMeasuredExamPages({ staging, items, qpp, makePage, applyAutoImageSizeClasses?, onBeforePageMeasure?, onPageRendered? })`
  - staging(83mm 컬럼) 측정 → proxyHeight raw/tight 프로파일 → wide/subj2/subj4/normal 블록 페이지네이션 → 페이지 조립 → fitQuestionBox → 넘침 시 autoCompress.
  - `makePage(pageNumber)` → `{ page, body }`. **pageNumber 0 = 본문 높이 측정용**(코어가 생성 직후 제거). 헤더 구성은 엔진 책임 — 믹서의 "측정 페이지에도 헤더 포함(pNum===0||1)" 같은 엔진별 차이가 여기 남는다.
  - `onBeforePageMeasure(handle, pageIdx, isLast)`: 블록 조립 직후·typeset 전 (오답엔진 homework 체크박스).
  - `onPageRendered(handle, pageIdx, isLast)`: 페이지 확정 후 (오답엔진 그룹별 QR).
- `createImageSizer({ imageSizeClassFor?, includeInlineContentImages? })` → `applyAutoImageSizeClasses(root)`
  - 기본 비율표는 아카이브 엔진/믹서용(`defaultImageSizeClassFor`). **오답엔진은 자체 비율표(2.2/1.25/0.8)와 `includeInlineContentImages: true`를 주입** — 출력물 보존을 위해 통일하지 않았다.

### 해설지 컬럼 플로우
- `createSolutionFlow({ makeGridPage, prepareColumn? })` → `{ placeBox }`
  - 생성 시점에 첫 페이지를 즉시 만든다(세 엔진 공통 기존 동작).
  - 컬럼 넘침 시 autoCompress → 다음 컬럼/페이지 → 단독 박스면 해설 분할(`makeSolutionHtmlChunks`/`makeLongSolutionShell`, sol-box-long).
  - `prepareColumn(col)`: 부착 직후·측정 전 훅(오답엔진의 이미지 사이즈 적용).

### 정답표
- `renderAnswerPages({ data: [{no, answerHtml}], makePage })` — 40행/쪽, 열 분할점 4의 배수, 4문제마다 `group-end`.

### printHeaderOptions
- `clampText(value, max)` / `normalizePrintHeaderOptions(raw, base)` / `shouldApplyPrintHeader(type, opts)`
- `base`는 엔진별 `getDefaultPrintHeaderOptions()` 결과. `showDate`는 오답엔진에서 승격된 코어 필드(다른 엔진은 렌더에서 읽지 않음 — 드리프트 정리).
- `syncPrintHeaderControls(opts)` / `togglePrintHeaderEditorPanel(event)`: 헤더 편집 패널 DOM 동기화.

### QR
- `renderQrBadge(targetPage, { className, html, url, size })` — 기존 배지 교체 + QRious 캔버스. `html`에 `<canvas>` 필수.
- `getLastPage(area)`
- QR 대상 URL 생성(`buildQrTargetUrl` 등)과 노출 조건(`shouldRender*Qr`)은 엔진별 잔류.

### 모드 탭 / 잠금 / 팝오버
- `isQrSolutionMode()` — `?qr=1`.
- `setActiveModeTab(mode)` — `btn-<mode>` id 또는 `data-mode` 매칭.
- `applyQrSolutionLockUI({ title, hideTabsBar?, solActive? })` — 엔진/믹서: 기본값, 오답엔진: `hideTabsBar:true, solActive:false`.
- `getQrOutputState` / `syncQrOutputControls` / `toggleQrOutputPopover` / `setQrOutputParam` — QR 출력 팝오버(엔진/믹서). `setQrOutputParam`은 URL만 갱신, 재렌더는 호출부 책임.
- `installPopoverAutoClose([wrapIds])` — 바깥 클릭 닫기.

### 미리보기 채널 (Phase 2)
- `isPreviewMode()` — `?preview=1`.
- `createPreviewController({ render, onPreviewMessage, editableClass? })` → `{ install, scheduleRender, requestRender, enableHeaderInlineEdit, postHeaderEdit }`
  - `install()`: 같은 오리진 postMessage 수신(`AP_PRINT_PREVIEW` + 레거시 `AP_CLINIC_PREVIEW` 별칭) → `onPreviewMessage(msg)`(상태 적용은 엔진 책임) → 250ms 디바운스 재렌더. 편집 중(포커스가 editableClass) 재렌더 보류 + focusout flush.
  - `enableHeaderInlineEdit()`: preview-mode에서 첫 페이지 헤더의 제목/보조문구를 contenteditable로. blur 시 `postHeaderEdit(field, value)` — **신·구 타입(`AP_PRINT_HEADER_EDIT`+`AP_CLINIC_HEADER_EDIT`) 동시 발신**으로 구버전 부모(clinic-print.js)와 캐시 불일치에도 동작. 수신부 디바운스가 중복 흡수.
  - `.clinic-editable` CSS는 소비 엔진 책임(현재 오답엔진만 정의·활성). 아카이브 엔진/믹서는 채널(mode/headerOptions)만 배선 — 인라인 편집은 부모 상태 관리가 생기는 Phase 3에서 활성화.
- 부모 예시: `apmath/js/clinic-print.js`(무변경 — 레거시 타입 발신/수신이 별칭·동시발신으로 커버됨).

### screen-fit
- `shouldUseScreenFit(params)` / `updateScreenFitScale(maxScale=1)` / `installScreenFitAutoRescale(getMaxScale?)`
- `maxScale`은 preview 임베드 축소 상한(0.72 등)용 — Phase 2에서 오답엔진 preview에 사용 예정.

### 기타
- `raf()` / `typeset(targets)`(MathJax try/catch — 미로드/실패 시 렌더 계속) / `autoCompress` / `fitQuestionBox` / `appendTextElement` / `appendHeaderFill` / `makeSolutionHtmlChunks` / `makeLongSolutionShell` / `waitForQuestionImage`

## 3. 코어에 넣지 않은 것 (엔진별 잔류 — 의도적)

- **콘텐츠 파이프라인**: `wrapLatex`(믹서 [성역]), `normalizeViewBlocks`(오답엔진은 마커 정규식이 다름), `protectRenderSegments`(믹서는 구식 보호 순서 유지 — Rulebook v1.9 자체 수정분), `extractChoice`(믹서는 `.answer` 키 미지원), choices/notes/tables 정규화 전부.
- **makePage**: 헤더 레이아웃이 엔진마다 다름(엔진: parseExamTitle 기반, 오답: 러닝 헤더/이름·날짜). 훅으로 주입.
- **데이터 로딩**: `data=` 스크립트 로딩(엔진), localStorage/packId(믹서), packet/set/wp/storage/postMessage(오답).
- **OS 등록 API**(blueprint/출제이력)·세션 복원: 엔진/믹서에 중복이지만 Phase 1 범위 밖(렌더링 코어 아님).
- **switchMode**: 엔진/믹서는 URL 이동, 오답엔진은 in-place 상태 전환.

## 4. 검증 기록 (2026-07-02)

로컬 프리뷰(`static-root`, 포트 5533)에서 코어 교체 전/후 페이지 시그니처(페이지 수, 페이지별 문항 분포, fit/compress 클래스·인라인 폰트, 해설 분할 청크 수, 정답표 셀·group-end, QR 배지 위치) 완전 일치 확인:

- 엔진: `22_금당고_1학기_기말_고1_기출`(21문항, wide 4, 이미지 1) — qpp=4(9쪽)/qpp=6(8쪽)/해설지(분할 63·51청크)/정답표/submitQr+solQr.
- 믹서: 동일 문항 localStorage 핸드오프 — qpp=2(13쪽)/qpp=8(7쪽)/고정시드 셔플/해설지.
- 오답엔진: 학생 payload 21문항 — exam(러닝 헤더·homework·QR)/review(정답표+분할 해설 36·69·5·51·55청크), `wp=` QR 하위호환(payload 복원·잠금 UI).
- `packet=`/`set=` 서버 경로는 코드 미변경(`loadWrongClinicPayloadFromServer` 그대로).
