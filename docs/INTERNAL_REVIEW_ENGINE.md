# JS아카이브 내부 검수 엔진

## 목적

GitHub에 올리기 전, 로컬에서 `archive/exams/**/*.js` 문제 파일을 시험지처럼 열어보고  
문항별로 수정한 뒤 실제 JS 파일에 바로 저장하는 내부 검수 도구입니다.  
기존 `engine.html` / `mixed_engine.html` / `mixer.html` 출력 엔진은 건드리지 않습니다.

---

## 실행 방법

```bash
cd C:\Users\USER\Desktop\AP------
python -m http.server 8765
```

브라우저(Chrome 또는 Edge)에서 접속:

```
http://localhost:8765/archive/internal-review-engine.html
```

> **Chrome / Edge 전용** — File System Access API 사용.  
> Firefox / Safari에서는 파일 저장 기능 불가 (다운로드만 가능).

---

## archive 폴더 열기

1. 왼쪽 패널 **📂 archive 폴더 열기** 클릭  
2. `C:\Users\USER\Desktop\AP------\archive` 폴더 선택  
3. 브라우저 권한 다이얼로그에서 **허용** 클릭  
4. `archive/exams/**/*.js` 파일만 왼쪽 목록에 표시됨 (textbook, tools 등 제외)  
5. 이미지가 `assets/images/**` 에서 자동 매핑됨

---

## JS 파일 열기 (단독)

- 왼쪽 패널 **📄 JS 파일 열기** 클릭  
- `.js` 파일 하나를 선택  
- 이미지 폴더는 매핑되지 않으므로 이미지 표시 불가 (경고 배지만 표시)

---

## 직접 저장 조건

| 방식 | 저장 가능 여부 |
|---|---|
| archive 폴더 열기 후 파일 선택 | **가능** (원본 덮어쓰기) |
| JS 파일 단독 열기 | **가능** (원본 덮어쓰기) |
| `input type=file` fallback | **불가** (다운로드만) |

저장 버튼 클릭 시:
1. 원본 소스를 백업 파일로 자동 다운로드  
2. 수정된 내용을 원본 파일에 덮어씀

---

## 다운로드 fallback

- **수정본 다운로드**: 현재 수정 내용을 원본 파일명으로 다운로드 (`Ctrl+D`)  
- **백업 다운로드**: 원본 소스를 `파일명.before-internal-review-YYYYMMDD-HHMMSS.js`로 다운로드

---

## 이미지가 보이는 조건

archive 폴더를 열었을 때 `assets/images/폴더명/파일명.png` 가 자동으로 매핑됩니다.  
문항의 `image` 필드는 다음 형식 모두 지원합니다 (자동 정규화):

| 입력 형식 | 정규화 결과 |
|---|---|
| `assets/images/폴더/q1.png` | `assets/images/폴더/q1.png` |
| `archive/assets/images/폴더/q1.png` | `assets/images/폴더/q1.png` |
| `./assets/images/폴더/q1.png` | `assets/images/폴더/q1.png` |
| `/assets/images/폴더/q1.png` | `assets/images/폴더/q1.png` |

파일 단독 열기 시에는 이미지가 보이지 않으며, 경고 배지로 대체됩니다.

---

## 문항 수정 방법

1. 가운데 패널에서 문항 카드 클릭 → 오른쪽 패널에 수정 폼 열림  
2. `level` / `questionType` / `layoutTag` / `tags` / `content` / `choices` / `answer` / `solution` / `image` 수정  
3. **적용** 버튼 클릭 → 현재 검수본에 즉시 반영 (카드 갱신)  
4. 저장 전까지 원본 파일은 변경되지 않음

### HTML 박스 / 표 렌더링

`content` 안에 HTML이 포함된 경우 카드 미리보기에서 그대로 렌더링됩니다.

| 태그 | 렌더링 |
|---|---|
| `<div class="box">`, `<div class="question-note-box">` | 박스 렌더링 |
| `<table>`, `<tr>`, `<td>` | 표 렌더링 |
| `<br>`, `<b>`, `<strong>`, `<em>`, `<sup>`, `<sub>` | 인라인 서식 |
| `<img>` | 이미지 |
| `script`, `iframe`, `on*` 이벤트 속성 | 자동 제거 |

---

## 삭제 / 되돌리기

- **제거 버튼**: 선택 문항을 현재 검수본에서 제거. `제거됨` 필터에서 확인 가능  
- **되돌리기 버튼**: 선택 문항을 원본 상태로 복원  
- **전체 되돌리기**: 상단 버튼 → 모든 수정/제거를 원래 상태로 되돌림  
- 실제 JS 파일은 **저장 버튼을 눌러야만** 변경됨

---

## 검수표 사용법

상단 **검수표** 버튼 클릭 → 표 형태로 전체 문항 일람 표시  
- 행 클릭 → 해당 문항의 수정 패널 열림  
- **검수표 CSV** 버튼 → `review-table-파일명-날짜시간.csv` 다운로드

---

## GitHub 올리기 전 추천 검수 흐름

1. `python -m http.server 8765` 실행  
2. Chrome에서 `http://localhost:8765/archive/internal-review-engine.html` 접속  
3. **archive 폴더 열기** → 대상 JS 파일 클릭  
4. **경고 있음** 필터로 문항 확인 → 수정 패널에서 수정 → 적용  
5. **난이도 확인** 필터로 level 불일치 문항 검토  
6. **검수표 CSV** 다운로드로 검수 기록 보관  
7. **수정본 저장** (Ctrl+S) → 백업 자동 다운로드 후 원본 덮어쓰기  
8. GitHub 커밋

---

## 기존 출력 엔진과의 분리

이 검수 엔진은 아래 파일들과 완전히 독립적입니다:

- `archive/engine.html` — 수정 없음
- `archive/mixed_engine.html` — 수정 없음
- `archive/mixer.html` — 수정 없음
- `archive/db.js` — 수정 없음

기존 엔진의 `wrapLatex` / `autoCompress` / `fitQuestionBox` / `renderExam` / `renderSol` 함수를 사용하거나 수정하지 않습니다.

---

## 주의 사항

> **저장 버튼을 누르면 실제 로컬 JS 파일이 즉시 덮어씌워집니다.**  
> 저장 전에 백업이 자동으로 다운로드되므로, 백업 파일을 반드시 보관하세요.
