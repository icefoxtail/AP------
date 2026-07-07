# 코덱스 과제 — 오답 클리닉 "풀페이지 + 실시간 미리보기" 전환

형님, 이번 과제는 **apmath 오답 클리닉 출력 센터**를 *좁은 모달에서 헤더만 고치고 새 탭으로 확인*하던 흐름을,
**풀페이지 2단 레이아웃(좌: 설정/헤더 편집, 우: 실제 엔진 미리보기)** 으로 바꾸는 작업입니다.
헤더를 고치면 **실제 아카이브(엔진) 출력**이 우측에서 즉시 갱신되게 합니다.
(조사만 했고 코드는 손대지 않았습니다.)

---

## 0. 현재 구조 (왜 애매한가)

- 출력 센터는 `openClinicPrintCenter(classId)` 가 `showModal('오답 클리닉 출력 센터', ...)` 로 **좁은 중앙 모달** 하나에 전부 그림.
  `apmath/js/clinic-print.js:1341` (특히 헤더 섹션 `:1406~1429`).
- 헤더 값은 DOM input에서 `clinicPrintGetHeaderOptions()`(`clinic-print.js:73`)로 읽어, 출력 직전 `clinicPrintBuildPayload()`(`:591`)에 박힘.
- "오답지 만들기" → `clinicPrintSubmit()`(`:1216`) → `clinicPrintOpenStoredOrFallback()` → **저장형 wrong-clinics POST 후 새 탭**(`wrong_print_engine.html`)으로 엔진을 열어야 비로소 결과 확인.
- 즉 **헤더 수정 ↔ 결과 확인이 분리**돼 있고, 모달이 좁아 실제 출력 모양을 가늠하기 어려움.
- 엔진(`wrong_print_engine.html`)은 이미 **payload만 받으면 실제 A4 출력을 그려내는 완성된 렌더러**:
  - `render()` `wrong_print_engine.html:1768`, 모드 탭(문제지/해설지/정답표) `:112~117`, 헤더 렌더 `:976~1007`.
  - payload 로드 경로: URL `?packet=/?set=` → `?wp=` → `sessionStorage/localStorage['AP_CLINIC_PRINT_PAYLOAD']` (`:1834~1850`).

> 핵심: **엔진은 이미 "payload → 실제 출력" WYSIWYG가 완성**돼 있다. 모달이 이 렌더를 **재사용**하지 못하고 있을 뿐이다.

---

## 1. 채택 설계 — "엔진 iframe 라이브 프리뷰" (권장)

좌측은 기존 컨트롤 그대로 두고, **우측에 엔진을 iframe으로 임베드**해서 같은 렌더 코드로 미리보기한다.

```
┌─────────────────────────────────────────────────────────┐
│  [오답 클리닉 출력 센터]                        [닫기 ✕]  │  ← 풀페이지
├──────────────────────────┬──────────────────────────────┤
│ 좌 (설정/헤더 편집)       │ 우 (실제 엔진 미리보기)        │
│  · 출력 방식(학생/반/…)   │  ┌── iframe ───────────────┐  │
│  · 출력 헤더(제목/메타/   │  │ wrong_print_engine.html │  │
│    보조문구/이름·점수칸)  │  │  [문제지][해설지][정답표]│  │
│  · 시험 목록 / 학생       │  │  ▢ A4 페이지 실제 렌더   │  │
│  · 유형(최다빈출/단원별)  │  │                          │  │
│  [오답지 만들기/저장]     │  └─────────────────────────┘  │
└──────────────────────────┴──────────────────────────────┘
```

**왜 엔진에 편집 UI를 직접 넣지 않고 iframe인가?**
저장 로직(`api.post('wrong-clinics', ...)`, targets 빌드, public_set_key 처리)이 전부 **앱 쪽(clinic-print.js)** 에 있다.
엔진에 편집+저장을 옮기면 엔진이 POST/PATCH까지 떠안아 **중복·위험**해진다.
iframe 프리뷰는 **엔진 렌더 코드를 그대로 재사용**하면서 저장은 앱에 유지 → 변경 최소, 리스크 최소.
미리보기는 **저장하지 않는다**(메모리상 payload만 push).

---

## 2. 엔진 변경 (`wrong_print_engine.html`) — 최소 침습

### 2-A. 프리뷰 메시지 채널 추가
`boot()`(`:1852`) 끝부분 또는 별도 init에 `message` 리스너 추가:

```js
// 부모(클리닉 풀페이지)에서 payload를 밀어넣어 라이브 프리뷰
window.addEventListener('message', (e) => {
    // origin 체크: 같은 출처만 허용
    if (e.origin !== window.location.origin) return;
    const msg = e.data || {};
    if (msg.type !== 'AP_CLINIC_PREVIEW') return;
    state.payload = msg.payload;
    if (msg.mode) state.mode = msg.mode;   // exam/sol/ans
    schedulePreviewRender();               // 디바운스 render
});
```

- `?preview=1` 쿼리로 들어오면 **프리뷰 모드**임을 표시(인쇄 버튼 숨김/비활성 등 UI 미세 조정은 선택).
- 최초 진입 시 payload가 없을 수 있으니 "설정을 입력하면 미리보기가 표시됩니다" 안내문 정도만.

### 2-B. 디바운스 렌더
헤더 input 한 글자마다 `render()`(폰트/MathJax/문제은행)를 부르면 비싸다. 200~300ms 디바운스:

```js
let _previewTimer = null;
function schedulePreviewRender() {
    clearTimeout(_previewTimer);
    _previewTimer = setTimeout(() => { render(); }, 250);
}
```

- `render()`는 매번 `loadAllQuestionBanks()`를 부르지만 fetch가 `cache:'force-cache'`(`:515`)라 2회차부터 빠름. 그래도 **디바운스 필수**.
- (선택 최적화) 직전 payload의 문항 셋이 동일하고 **헤더만 바뀐 경우**, bank 재로드 건너뛰는 가드. 1차에서는 생략 가능.

### 2-C. 모드 탭 동기화
프리뷰에서 사용자가 엔진 내부 탭(문제지/해설지/정답표)을 눌러도 동작은 그대로(`switchMode`). 부모가 모드를 강제로 바꾸고 싶으면 `AP_CLINIC_PREVIEW` 메시지의 `mode` 로 덮어씀.

---

## 3. 앱 변경 (`apmath/js/clinic-print.js`)

### 3-A. 풀페이지 레이아웃
- `openClinicPrintCenter()`(`:1341`) 의 `showModal(...)` 본문을 **좌/우 2단 셸**로 재구성.
  - 좌측 = 지금의 컨트롤 전부(출력 방식/헤더/시험/학생/유형) 그대로 이동.
  - 우측 = `<iframe id="clinic-print-preview-frame" src="wrong_print_engine.html?preview=1">`.
- **풀페이지 처리**: `applyModalContent`(`ui.js:352`)가 `#modal-content`의 inline `width/maxWidth/height/maxHeight`를 매 렌더마다 리셋(`ui.js:376~383`)하므로,
  `showModal` **직후** `#modal-content`에 클래스 토글로 전체화면을 입힌다:
  ```js
  showModal('오답 클리닉 출력 센터', `...`);
  document.getElementById('modal-content')?.classList.add('clinic-print-fullscreen');
  ```
  닫기 시(모달 close 훅 또는 직접) `clinic-print-fullscreen` 클래스 제거로 다른 모달에 영향 없게.
- 새 CSS 클래스(예 `apms-clinic-print.css` 또는 scope.css):
  ```css
  #modal-content.clinic-print-fullscreen{
      position:fixed; inset:0; width:100vw; max-width:none;
      height:100vh; max-height:none; border-radius:0; margin:0;
  }
  .clinic-print-layout{ display:grid; grid-template-columns:minmax(360px,420px) 1fr; height:100%; }
  .clinic-print-layout__controls{ overflow:auto; }            /* 좌: 스크롤 */
  .clinic-print-layout__preview{ height:100%; }
  .clinic-print-layout__preview iframe{ width:100%; height:100%; border:0; }
  @media (max-width:880px){
      .clinic-print-layout{ grid-template-columns:1fr; }       /* 모바일: 위 컨트롤/아래 프리뷰 또는 탭 전환 */
  }
  ```

### 3-B. 라이브 갱신 배선
좌측 컨트롤이 바뀔 때마다 **payload를 재빌드해서 iframe에 postMessage**.

- 공통 헬퍼 추가:
  ```js
  function clinicPrintPushPreview(classId) {
      const frame = document.getElementById('clinic-print-preview-frame');
      if (!frame?.contentWindow) return;
      const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
      // 미리보기용 payload: 현재 선택값으로 빌드(미선택이면 안내). 저장은 하지 않음.
      let payload;
      if (mode === 'type') {
          payload = clinicPrintBuildTypePayload(classId);
      } else {
          payload = clinicPrintBuildPayload(classId, {
              selectedExamKeys: clinicPrintGetCheckedValues('clinic-print-exam'),
              selectedStudentIds: clinicPrintGetCheckedValues('clinic-print-student'),
              mode,
              headerOptions: clinicPrintGetHeaderOptions(classId)
          });
      }
      frame.contentWindow.postMessage(
          { type: 'AP_CLINIC_PREVIEW', payload, mode: clinicPrintGetPreviewEngineMode() },
          window.location.origin
      );
  }
  ```
- 호출 지점(전부 이미 존재하는 갱신 훅에 한 줄 추가):
  - 헤더 input `oninput`(`:1411,1416,1420`) + 체크박스(`:1424~1427`) → `clinicPrintPushPreview`.
  - `clinicPrintSwitchMode`(`:743`), `clinicPrintUpdateStudentList`(`:1151`), `clinicPrintRenderTypePanel`(`:872`),
    `clinicPrintSetTypeScope/Mode`(`:850,:861`), 단원 add/remove/move/DnD(`:1091~1148`) 끝에 `clinicPrintPushPreview` 추가.
  - 시험 체크 `onchange`(`:1363`) → 이미 `clinicPrintUpdateStudentList` 부르니 그 안에서 한 번만.
- iframe `load` 이벤트에서 **최초 1회 push**(엔진 부팅 후 보장). 이후에는 reload 없이 message만.
- **디바운스**는 엔진 쪽(2-B)에 있으니 앱은 매 입력 push해도 됨. 부담되면 앱에도 150ms 디바운스.

### 3-C. 엔진 내부 모드 탭 ↔ 미리보기
- 우측 프리뷰의 "문제지/해설지/정답표"는 엔진 자체 탭으로 두는 게 가장 단순(엔진이 알아서 render).
- 단, payload를 새로 push하면 엔진 `state.mode`가 유지되도록 2-A에서 `mode` 미전달 시 기존 모드 보존.

### 3-D. 저장/출력 버튼은 그대로
- "오답지 만들기"(`clinicPrintSubmit`, `:1216`)는 **변경 없이** 기존 저장형 POST + 새 탭 유지.
- 저장 payload의 `headerOptions`는 지금처럼 `clinicPrintGetHeaderOptions()`로 DOM에서 읽으므로 **프리뷰와 저장 결과가 자동 일치**.

---

## 4. 단계별 작업 순서 (Loop)

1. **Loop 1 — 엔진 프리뷰 채널**: `wrong_print_engine.html`에 `message` 리스너 + 디바운스 `render` + `?preview=1` 안내문. (단독 테스트: 콘솔에서 `frame.contentWindow.postMessage(...)`로 갱신 확인)
2. **Loop 2 — 풀페이지 셸**: `.clinic-print-fullscreen` CSS + `openClinicPrintCenter` 2단 레이아웃, 우측 iframe 부착, `load` 시 최초 push. (헤더 미편집 상태로 실제 출력이 우측에 뜨는지)
3. **Loop 3 — 라이브 배선**: 헤더/모드/시험/학생/유형 변경 훅에 `clinicPrintPushPreview` 연결. 입력 즉시 우측 갱신 확인.
4. **Loop 4 — 반응형·회귀**: 모바일(≤880px) 단단 레이아웃/탭 전환, 닫기 시 풀스크린 클래스 정리, **기존 "저장→새 탭 출력"이 동일하게 동작**하는지 회귀. 다크모드 색(.eie 아니라 apmath 토큰) 확인.

---

## 5. 리스크 / 주의

- **iframe reload 금지**: 최초 1회만 로드하고 이후 payload는 message로만 교체. `src` 재설정·reload는 폰트/문제은행 재다운로드라 느려짐.
- **render 비용**: `render()`가 매번 `loadAllQuestionBanks`(`:1771`) 호출. force-cache라 2회차부터 빠르지만 **디바운스 필수**. 헤더만 바뀔 때 bank 재로드 스킵 가드는 2차 최적화로.
- **풀스크린 클래스 누수**: `applyModalContent`가 width/height를 리셋해도 **클래스는 안 지움**. 모달 닫힐 때 반드시 `clinic-print-fullscreen` 제거(안 하면 다음 일반 모달이 전체화면으로 뜸).
- **제목 dirty 플래그**: 모드 전환 시 제목 보존 로직(`clinicPrintSetHeaderTitleDirty`, `clinicPrintRefreshHeaderDefault` `:62~71`) 그대로 유지. 프리뷰 push가 이 값을 건드리지 않게.
- **origin 체크**: postMessage 양방향 모두 `window.location.origin`로 제한(같은 출처에서 서빙되는 전제).
- **빈 선택 미리보기**: 시험/학생 미선택이면 엔진이 "출력할 오답 문항이 없습니다"를 그대로 보여줌(`:1790`) — 정상. 좌측에도 기존 안내 유지.
- **배포 토폴로지**: apmath는 프론트(Pages)와 워커(Cloudflare) 별도 배포. 이번 변경은 **프론트(html/js/css)만** 손대므로 워커 영향 없음. (참고: `apmath-deploy-topology`)

---

### 부록: 검증 방법
- 헤더 제목/메타/보조문구 타이핑 → 우측 A4 헤더(`page-header-title/meta/subtitle`)가 250ms 내 갱신되는지.
- 이름칸/점수칸 체크 토글 → 우측 `header-fill-line` 표시/숨김 즉시 반영.
- 모드 학생↔반↔학년↔유형 전환 → 우측 페이지 구성이 따라 바뀌는지.
- "오답지 만들기" → 기존처럼 새 탭 저장형 출력이 뜨고, **그 출력 헤더가 미리보기와 동일**한지.
- 모달 닫고 다른 일반 모달(예: 학생 상세) 열었을 때 전체화면으로 안 뜨는지(클래스 정리 확인).
