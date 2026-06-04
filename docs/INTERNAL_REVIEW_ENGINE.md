# JS아카이브 내부 검수 엔진 — 운영 가이드

## 개요

`archive/internal-review-engine.html` 은 JS 형식의 문제 파일을 브라우저에서 직접 검수하고
수정하여 원본 JS 파일에 덮어쓰는 도구입니다.
Chrome / Edge (localhost) 에서만 동작하며, File System Access API 가 필요합니다.

---

## 화면 구조

```
[상단 바]                 — 파일 열기 / 저장 / 다운로드 / 출력 모드 / 탭 전환
[왼쪽 패널]               — archive 폴더 열기 상태, 파일 목록, 필터, 검색, 통계
[가운데 패널 (탭 3개)]    — 실제 출력 / 편집 검수 / 검수표
[오른쪽 수정 패널]        — 선택 문항 수정 폼
```

---

## 탭 설명

### 실제 출력 탭

- `archive/engine.html` 을 iframe 으로 표시합니다.
- URL 파라미터: `engine.html?data=exams/.../파일명.js&mode=exam&qpp=4&v=타임스탬프`
- **저장된 JS 파일 기준으로만 표시됩니다.** 미저장 수정은 iframe 에 반영되지 않습니다.
- 미저장 수정이 있으면 iframe 위에 "미저장 수정 있음" 배지가 표시됩니다.
- 저장 후 `refreshEnginePreviewFrameOnly()` 가 호출되어 iframe.src 만 교체됩니다.
  부모 페이지 reload 는 절대 발생하지 않습니다.

### 편집 검수 탭

- `currentBank` 메모리 기준으로 문항 카드를 렌더링합니다.
- 저장하지 않은 수정도 즉시 반영됩니다 (commitEditorDraft 가 currentBank 에 직접 씁니다).
- 카드를 클릭하면 오른쪽 수정 패널에 해당 문항이 로드됩니다.
- 경고 배지, 수정됨 배지, 추천 난이도 배지가 카드에 표시됩니다.

### 검수표 탭

- 표 형태로 전체 문항을 표시합니다.
- 행을 클릭하면 오른쪽 수정 패널에 로드됩니다.
- 제거된 문항은 하단 별도 섹션에 표시됩니다.

---

## 여러 문항 수정 후 저장

1. 문항 A 클릭 → 오른쪽 패널에서 수정
2. 문항 B 클릭 → 이동 전 `commitEditorDraft()` 자동 호출 → A 수정이 `currentBank` 에 저장됨
3. 문항 B 수정
4. `수정본 저장` 클릭 → commitEditorDraft → serializeQuestionBank → 파일 덮어쓰기
5. 저장 후 A, B 수정 모두 JS 파일에 반영됨

---

## commitEditorDraft 호출 위치

다음 동작 직전에 반드시 호출됩니다.

- 다른 문항 카드/행 클릭 전
- 필터 변경 전
- 검색어 변경 전
- 미리보기 탭 전환 전
- 엔진 출력 모드 변경 전
- 저장 전
- 다운로드 전
- 제거 버튼 클릭 전
- 현재 문항 적용 버튼 클릭 전

---

## 저장 후 리셋 방지

저장 함수 `saveCurrentFile()` 은 다음을 절대 수행하지 않습니다.

- `window.location.reload()` / `location.reload()`
- `init()` / `resetApp()` 류 전역 초기화
- `state` 를 새 객체로 교체
- `fileEntries = []`
- `archiveDirHandle = null`
- `currentFileHandle = null`
- `selectedId = null` (스냅샷으로 복원)
- `currentBank = deepClone(originalBank)` (저장 성공 시 originalBank ← currentBank 방향)

저장 성공 후에는 스냅샷에서 `selectedId`, `currentFilePath`, `currentFileHandle`,
`fileEntries`, `archiveDirHandle` 를 그대로 복원합니다.

---

## 저장 후 archive 폴더 / 파일 목록 유지

- `state.fileEntries` 는 저장 과정에서 변경되지 않습니다.
- `state.archiveDirHandle` 는 저장 과정에서 변경되지 않습니다.
- 저장 완료 후 `renderFileList()` 를 다시 호출하지 않으므로 목록이 그대로 유지됩니다.

---

## 저장 후 현재 JS / 문항 선택 유지

- `state.currentFileHandle` 가 스냅샷으로 복원됩니다.
- `state.selectedId` 가 스냅샷으로 복원된 후 오른쪽 패널이 재채워집니다 (닫히지 않음).

---

## 백업

저장 전 자동으로 원본 소스를 다운로드합니다.
파일명: `원본파일명.before-internal-review-YYYYMMDD-HHMMSS.js`

---

## 줄바꿈 처리

- JS 파일 내부의 `\n` 은 그대로 유지됩니다 (`<br>` 자동 변환 금지).
- `engine.html` 이 실제 출력 시 `\n` 을 줄바꿈으로 렌더링합니다.

---

## 제외 파일 / 폴더

archive 폴더 열기 시 다음은 자동 제외됩니다.

- `db.js`, `concept_map.js`, `internal-review-engine.js`
- `tools/`, `assessment/`, `textbook/`, `node_modules/`, `.venv/`, `__pycache__/`
- `exams/` 하위가 아닌 JS 파일

---

## imageSize 필드

### 개요

`imageSize` 는 문항 스키마의 **선택 필드**입니다. 이미지가 없는 문항에는 절대 추가하지 않습니다.

### 허용값

| 값 | 의미 |
|---|---|
| `small` | 작게 (max-width 50%) |
| `half` | 절반 (max-width 65%) |
| `medium` | 보통 (max-width 80%) |
| `large` | 크게 (max-width 94%) |
| `full` | 최대 (max-width 100%) |

### 규칙

- 오른쪽 수정 패널 "이미지 크기" select 에서 설정합니다.
- **자동** (빈 값) 을 선택하면 `imageSize` 필드가 저장되지 않습니다 (필드 삭제).
- 이미지가 너무 크거나 작을 때만 수동으로 지정합니다. 대부분은 자동(기본값)으로 두면 됩니다.
- `imageSize` 는 배치용 `layoutTag` 나 `wide` 를 대체하지 않습니다.
  - `layoutTag` / `wide` 는 문항 전체 레이아웃을 결정합니다.
  - `imageSize` 는 해당 문항 이미지의 표시 크기만 조정합니다.
- `FIELD_ORDER` 에서 `image` 바로 다음 위치에 직렬화됩니다.

---

## 수정 금지 파일

- `archive/engine.html`
- `archive/mixed_engine.html`
- `archive/mixer.html`
- `archive/db.js`
- `archive/exams/**/*.js` (직접 편집 금지, 이 도구를 통해서만 수정)
- `archive/assessment/**/*.js`
- `apmath/**`
