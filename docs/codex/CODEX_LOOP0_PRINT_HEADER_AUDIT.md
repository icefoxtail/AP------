# Loop 0 Print Header Audit

작성일: 2026-06-27

## 0. 범위와 원칙

이번 Loop 0은 코드/CSS/API/DB를 수정하지 않고, 실제 코드 기준으로 출력 헤더 수정 작업의 연결 지점과 위험 지점을 정리한다.

핵심 원칙은 다음과 같다.

- 인쇄용 헤더(`printHeaderOptions`)와 식별용 제목(`identityTitle`)을 분리한다.
- 식별용 제목은 AP 제출 QR, OMR, `class_exam_assignments.exam_title`, `exam_blueprints`, archive 파일 식별에 사용한다.
- 인쇄용 헤더는 종이에 보이는 제목/우측 메타/보조 문구/이름칸/점수칸 표시 전용이다.
- `wrapLatex`, `autoCompress`, `fitQuestionBox`, `renderSol`, `renderAns` 등 핵심 렌더링 로직은 필요한 진입부만 연결하고 본문 알고리즘은 건드리지 않는다.

## 1. 일반 `archive/engine.html` title 전달 흐름

현재 상태:

- `AppState`는 `data`, `mode`, `qpp`, `title`만 가진다. (`archive/engine.html:309`)
- 초기화 시 `window.examTitle || URL title || '수학 시험지'`를 `AppState.title`에 저장한다. (`archive/engine.html:955`)
- 상단 컨트롤 제목 `#ctrl-title`도 `AppState.title`로 표시한다. (`archive/engine.html:956`)
- `getExamTitleFull()`은 `window.examTitle`, `AppState.title`, URL `data` 파일명, fallback 순서로 제목을 만든다. (`archive/engine.html:833`)
- `makePage()`는 문제지 첫 페이지 헤더에 `getExamTitleFull()`을 사용하고, 해설지/정답표에는 `parseExamTitle(AppState.title)` 기반 메타를 사용한다. (`archive/engine.html:848`)

현재 문제:

- 인쇄 헤더와 식별 제목이 모두 `AppState.title`에 묶여 있다.
- 문제지 헤더는 사용자 입력 escape 없이 `innerHTML`에 직접 들어갈 수 있는 구조다.
- 해설지/정답표 헤더도 별도 인쇄용 옵션 없이 `AppState.title` 파생값으로 고정된다.

분리 필요 지점:

- `AppState.identityTitle`: 기존 `AppState.title`과 동일한 식별용 제목으로 유지.
- `AppState.printHeaderOptions`: 종이에 보이는 헤더 전용.
- 기존 호환을 위해 `AppState.title`은 당분간 `identityTitle`과 같은 값으로 유지한다.

## 2. 일반 `archive/engine.html` QR/assignment/title 관계

현재 상태:

- AP 제출 QR URL의 `exam` 값은 `AppState.title || '시험지'`다. (`archive/engine.html:459`, `archive/engine.html:475`)
- `class_exam_assignments.exam_title`은 `AppState.title || window.examTitle || '시험지'`다. (`archive/engine.html:653`, `archive/engine.html:672`)
- `exam_blueprints` 등록은 `archive_file`과 문항 목록 중심이며, 제목은 직접 전송하지 않는다. (`archive/engine.html:1488`)
- `render()` 끝에서 `registerBlueprintToOS()`와 `registerClassExamAssignmentToOS()`가 호출된다. (`archive/engine.html:1481`, `archive/engine.html:1482`)

현재 문제:

- 헤더 수정 UI가 `render()`를 자주 재호출하면 등록 함수도 다시 호출된다.
- 현재 등록 함수에는 중복 방지 signature가 있으나, 헤더 수정과 무관하게 signature가 유지되는지 검수해야 한다.

구현 원칙:

- QR `exam`, assignment `exam_title`은 `identityTitle`만 사용한다.
- `printHeaderOptions.title`은 QR/assignment/blueprint에 절대 사용하지 않는다.
- 헤더 수정에 따른 재렌더는 등록 signature를 변경하면 안 된다.

## 3. `archive/index.html` title 전달 흐름

현재 확인:

- `index.html`은 일반 출력 진입부에서 `engine.html` URL로 기존 `title`을 넘기는 구조다.
- 이번 1차 구현에서는 `index.html`에 헤더 수정 UI를 만들지 않는다.

구현 원칙:

- `index.html -> engine.html` URL `title`은 식별용 제목으로 유지한다.
- 인쇄용 헤더 수정은 `engine.html` 출력 화면에서 수행한다.
- URL에 긴 JSON을 직접 싣지 않는다.

## 4. `archive/mixer.html` mixedMeta 저장 흐름

현재 상태:

- `mixed-title-input`에서 사용자 제목을 읽는다. (`archive/mixer.html:371`, `archive/mixer.html:2033`)
- `autoTitle` fallback을 만들고 `meta = { title, count, generatedAt }`를 저장한다. (`archive/mixer.html:2035`)
- 문항은 `localStorage['mixedQuestions_' + sessionKey]`에 저장한다. (`archive/mixer.html:2037`)
- 메타는 `localStorage['mixedMeta_' + sessionKey]`에 저장한다. (`archive/mixer.html:2038`)
- `mixed_engine.html?qpp=...&key=...`를 새 창으로 연다.

현재 문제:

- `meta.title`이 출력 헤더와 식별 제목을 겸한다.
- `printHeaderOptions`가 저장되지 않는다.
- `identityTitle` 필드가 없다.

구현 원칙:

- `meta.identityTitle = customTitle || autoTitle` 추가.
- `meta.printHeaderOptions` 추가.
- 기존 `meta.title`은 호환 fallback으로 유지.

## 5. `archive/mixed_engine.html` title/meta 전달 흐름

현재 상태:

- `AppState`는 `data`, `meta`, `mode`, `qpp`, `key`를 가진다. (`archive/mixed_engine.html:863`)
- `mixedMeta_{key}` 또는 `sessionStorage.mixedMeta`를 읽어 `AppState.meta`에 넣는다. (`archive/mixed_engine.html:1607`, `archive/mixed_engine.html:1643`)
- fallback assessment pack도 `meta.title`, `meta.customTitle`을 만든다. (`archive/mixed_engine.html:572`)
- `makePage()`는 `AppState.meta?.customTitle || AppState.meta?.title || 'JS아카이브 믹서 출제'`를 헤더 제목으로 쓴다. (`archive/mixed_engine.html:1212`, `archive/mixed_engine.html:1224`)

현재 문제:

- 인쇄 헤더, QR exam, 과제 등록 제목이 모두 `meta.customTitle/title`에 묶여 있다.
- 문제지 헤더에 사용자 문자열이 `innerHTML`로 직접 들어갈 수 있는 구조다.

분리 필요 지점:

- `getIdentityTitle()`을 도입해 `meta.identityTitle || meta.customTitle || meta.title || fallback`으로 식별 제목을 확정한다.
- `printHeaderOptions.title`은 `makePage()` 렌더링에서만 사용한다.

## 6. `archive/mixed_engine.html` QR/assignment/title 관계

현재 상태:

- AP 제출 QR URL의 `exam` 값은 `AppState.meta?.customTitle || AppState.meta?.title || 'JS아카이브 믹서 출제'`다. (`archive/mixed_engine.html:500`, `archive/mixed_engine.html:516`)
- `class_exam_assignments.exam_title`도 같은 제목을 사용한다. (`archive/mixed_engine.html:732`, `archive/mixed_engine.html:750`)
- `exam_blueprints`는 `MIXED:{key}` archive file과 원본 문항 추적 정보를 전송한다. (`archive/mixed_engine.html:801`)
- `render()` 끝에서 blueprint와 assignment 등록이 호출된다. (`archive/mixed_engine.html:1599`, `archive/mixed_engine.html:1600`)

구현 원칙:

- QR `exam`, assignment `exam_title`은 `identityTitle`만 사용한다.
- `printHeaderOptions.title`은 이 경로에 들어가면 안 된다.
- 재렌더 시 등록 signature가 헤더 옵션에 의해 변경되지 않는지 확인한다.

## 7. APMS `clinic-print.js` payload/title 흐름

현재 상태:

- `clinicPrintBuildPayload()`가 payload를 만든다. (`apmath/js/clinic-print.js:541`)
- 기본 `printTitle`은 학년/반 기준 자동 생성이다. (`apmath/js/clinic-print.js:562`)
- 유형 출력은 `clinicPrintBuildTypePayload()`에서 `printTitle`을 다시 만든다. (`apmath/js/clinic-print.js:674`, `apmath/js/clinic-print.js:721`)
- payload는 `AP_CLINIC_PRINT_PAYLOAD`로 sessionStorage/localStorage에 저장된다. (`apmath/js/clinic-print.js:599`, `apmath/js/clinic-print.js:602`)
- 현재 오답 출력 센터 UI에는 헤더 직접 입력 섹션이 없다.

현재 문제:

- `printTitle`은 QR compact payload와 화면 헤더의 fallback을 겸한다.
- 사용자 지정 출력 헤더가 payload에 없다.
- 모드 변경 시 기본 제목과 사용자 직접 수정 제목의 관계가 정의되어 있지 않다.

구현 원칙:

- payload에 `headerOptions`를 추가한다.
- `printTitle`은 기존 호환 및 QR compact payload 식별용 fallback으로 유지한다.
- 사용자가 헤더 제목을 직접 수정한 경우 모드 변경 기본값으로 덮어쓰지 않는다.

## 8. `wrong_print_engine.html` title/header 전달 흐름

현재 상태:

- `state = { payload, banks, mode }` 구조다. (`apmath/wrong_print_engine.html:128`)
- `escapeHtml()`은 이미 존재한다. (`apmath/wrong_print_engine.html:140`)
- QR compact payload는 `payload.printTitle`을 `t` 값으로 사용한다. (`apmath/wrong_print_engine.html:242`, `apmath/wrong_print_engine.html:253`, `apmath/wrong_print_engine.html:264`, `apmath/wrong_print_engine.html:276`)
- `makePage(area, type, title, metaLeft, metaRight, pageNumber)`가 헤더를 만든다. (`apmath/wrong_print_engine.html:880`)
- 헤더 제목/메타는 `escapeHtml()` 처리 후 `innerHTML`로 들어간다. (`apmath/wrong_print_engine.html:888`)
- `getGroupTitle(defaultTitle)`은 `pageMeta.title || payload.printTitle || '오답 클리닉'` 흐름이다. (`apmath/wrong_print_engine.html:962`)
- 학생/반/학년/유형 렌더 함수가 각각 `pageMeta.title`, `metaLeft`, `metaRight`를 만든다. (`apmath/wrong_print_engine.html:1119`, `apmath/wrong_print_engine.html:1153`, `apmath/wrong_print_engine.html:1169`, `apmath/wrong_print_engine.html:1233`)
- 해설지와 정답표도 별도 title/meta를 만든다. (`apmath/wrong_print_engine.html:1424`, `apmath/wrong_print_engine.html:1527`)

현재 문제:

- 사용자 지정 공통 제목을 도입할 때 `pageMeta.title`이 우선되면 학생별 제목에 밀릴 수 있다.
- 헤더 적용 우선순위는 type/mode별로 정의해야 한다.

보완 우선순위:

```js
function getRenderHeaderTitle(type, pageMeta) {
  const opts = getPrintHeaderOptions();
  const canApply =
    type === 'exam' ||
    (type === 'sol' && opts.applyToSolution) ||
    (type === 'ans' && opts.applyToAnswer) ||
    (type === 'review' && (opts.applyToSolution || opts.applyToAnswer));

  return canApply && opts.title
    ? opts.title
    : pageMeta?.title || getIdentityTitle() || fallbackTitle;
}
```

## 9. `wrong_print_engine.html` review 모드

현재 상태:

- `render()`는 `exam`, `sol`, `ans` 외에 `review` 모드를 처리한다. (`apmath/wrong_print_engine.html:1651`)
- `review`는 `renderStudentReviewPacket()`을 호출한다. (`apmath/wrong_print_engine.html:1576`)
- `switchMode()`는 QR solution mode일 때 `review`로 잠근다. (`apmath/wrong_print_engine.html:1684`)

구현 원칙:

- `review`는 정답표와 해설지 묶음 출력이므로 헤더 적용 대상에 포함한다.
- `applyToAnswer` 또는 `applyToSolution` 중 하나라도 true이면 `review` 패킷 제목/메타에 반영한다.
- QR로 열린 review 모드에서도 식별용 `printTitle`은 유지한다.

## 10. 인쇄용 헤더와 식별용 제목 분리 위치

일반 엔진:

- `AppState.title` 초기화 직후 `identityTitle` 확정.
- `makePage()`에서만 `printHeaderOptions` 사용.
- `buildSubmitQrTargetUrl()`, `registerClassExamAssignmentToOS()`는 `identityTitle` 사용.

믹서:

- `mixer.html` 저장 시 `mixedMeta.identityTitle`와 `mixedMeta.printHeaderOptions` 추가.
- `mixed_engine.html` init 후 `identityTitle` 확정.
- `makePage()`에서만 `printHeaderOptions` 사용.
- QR/assignment는 `identityTitle` 사용.

APMS 오답:

- `clinic-print.js` 출력 센터에서 `headerOptions` 생성.
- `wrong_print_engine.html` `makePage()` 또는 wrapper 함수에서 `headerOptions` 적용.
- QR compact payload `t`와 payload `printTitle`은 기존 식별/fallback 의미 유지.

## 11. 엔진별 최소 수정 파일

Loop 1:

- `archive/engine.html`

Loop 2:

- `archive/mixer.html`
- `archive/mixed_engine.html`

Loop 3:

- `apmath/js/clinic-print.js`
- `apmath/wrong_print_engine.html`
- `apmath/css/apms-clinic-print.css`

Loop 4:

- 필요 시 테스트/검증 문서만 추가한다.

## 12. 다음 Loop 구현 순서

1. 일반 `archive/engine.html`
   - `identityTitle`, `printHeaderOptions`, 헤더 수정 패널 도입.
   - `makePage()`에 인쇄용 헤더 반영.
   - QR/assignment는 `identityTitle` 사용.

2. 믹서 `archive/mixer.html` / `archive/mixed_engine.html`
   - `mixedMeta.printHeaderOptions`, `mixedMeta.identityTitle` 저장.
   - `mixed_engine.html` 출력 화면 헤더 수정 패널 도입.
   - QR/assignment는 `identityTitle` 사용.

3. APMS 오답 출력
   - 출력 센터 모달에 헤더 섹션 추가.
   - payload `headerOptions` 추가.
   - `wrong_print_engine.html`의 exam/sol/ans/review에 반영.

4. 회귀 검수
   - 문제지/해설지/정답표/review 모드.
   - QR/assignment/blueprint.
   - qpp, shuffle, QR 출력 옵션.

## 13. 회귀 위험 함수 목록

일반 엔진:

- `makePage()`
- `getExamTitleFull()`
- `buildSubmitQrTargetUrl()`
- `registerClassExamAssignmentToOS()`
- `registerBlueprintToOS()`
- `render()`
- `switchMode()`

믹서:

- `openMixedEngine()`
- `makePage()`
- `buildSubmitQrTargetUrl()`
- `registerClassExamAssignmentToOS()`
- `registerBlueprintToOS()`
- `render()`
- `switchMode()`
- `changeQpp()`
- `shuffleData()`

APMS 오답:

- `clinicPrintBuildPayload()`
- `clinicPrintBuildTypePayload()`
- `clinicPrintOpenEngine()`
- `clinicPrintSwitchMode()`
- `makePage()`
- `getGroupTitle()`
- `renderMeasuredExamPages()`
- `renderStudentPages()`
- `renderClassPages()`
- `renderGradePages()`
- `renderTypePages()`
- `renderSol()`
- `renderAns()`
- `renderStudentReviewPacket()`
- `render()`
- `switchMode()`
- QR payload builders: `buildStudentQrPayload()`, `buildClassQrPayload()`, `buildGradeQrPayload()`, `buildTypeQrPayload()`

## 14. 보안/안정성 보완 사항

- 일반 `engine.html`과 `mixed_engine.html`에는 신규 헤더 문자열용 `escapeHtml()` 또는 DOM `textContent` 삽입 방식을 도입해야 한다.
- `wrong_print_engine.html`은 기존 `escapeHtml()`을 재사용하되, 신규 `subtitle`, `metaRight`도 같은 경로로 escape한다.
- 길이 제한은 `title: 80`, `metaRight: 60`, `subtitle: 120`으로 통일한다.
- 전역 고정 sessionStorage 키는 다중 탭 충돌 위험이 있으므로, URL 전달이 필요할 때는 `headerKey` 기반 네임스페이스를 사용한다.
- 단, 1차 구현에서 출력 화면 내부 수정만 처리하는 경우에는 URL 전달 없이 `AppState.printHeaderOptions`만으로 시작할 수 있다.

## 15. Pass/Fail에 추가할 기준

추가 PASS:

- 오답 출력 `review` 모드에서도 헤더 적용 정책이 유지된다.
- 헤더 수정 후 재렌더해도 AP 제출 QR, `class_exam_assignments`, `exam_blueprints` 식별값이 바뀌지 않는다.
- 학생별 오답 출력에서 사용자 지정 공통 제목이 학생명 제목보다 우선 적용될 수 있다.

추가 FAIL:

- `pageMeta.title`이 항상 우선되어 사용자 지정 헤더 제목이 무시된다.
- 인쇄용 헤더 변경이 등록 signature를 바꿔 과제 등록이 중복 또는 다른 제목으로 저장된다.
- 일반/믹서 엔진에서 사용자 입력 헤더가 escape 없이 `innerHTML`에 들어간다.
