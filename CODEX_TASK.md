````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 작업 목표

AP Math OS `apmath/js/report.js`의 평가 리포트 센터/크게 보기/인쇄 화면을 최소 수정한다.

현재 문제:
1. 바깥 평가 리포트 센터에 `프리미엄 분석` 버튼과 안내문이 남아 있다.
2. 바깥 평가 리포트 센터에 `기존 카드 리포트` 버튼이 남아 있어 새 평가 리포트 흐름과 혼동된다.
3. 크게 보기 화면 안쪽에도 `기본 리포트로 복귀`, `프리미엄 분석 적용` 버튼이 남아 있다.
4. 크게 보기 화면 안쪽에 `선생님 추가 메모` 패널이 별도로 생겨 레이아웃을 밀고 있다.
5. 캐시된 AI 분석이 있으면 리포트 본문 헤더에 `프리미엄 분석` 배지가 표시될 수 있다.

이번 작업의 목표:
- 평가 리포트 화면에서는 `프리미엄 분석` 사용자 노출 UI를 제거한다.
- 평가 리포트 화면에서는 `기존 카드 리포트` 버튼을 제거한다.
- 크게 보기 화면은 `리포트 센터로 돌아가기`와 `인쇄하기`만 남긴다.
- 크게 보기 화면 안쪽의 별도 선생님 메모 입력 패널은 제거한다.
- 바깥 리포트 센터의 선생님 추가 메모 입력란은 유지한다.
- 인쇄하기는 기본 리포트 본문만 안정적으로 출력한다.
- 기존 AI 내부 함수는 삭제하지 않고 UI 진입점과 화면 반영만 차단한다.

## 절대 금지

- 요청 범위 밖 파일 수정 금지
- `apmath/js/report.js` 외 파일 수정 금지
- 관리자/원장님 대시보드 수정 금지
- 학생 포털/OMR/시험지 직접 열기 흐름 수정 금지
- 시험지/아카이브 엔진 수정 금지
- 기존 리포트 본문 문구를 임의로 새 문장으로 바꾸지 말 것
- 버튼명/화면명/안내문을 요청 범위 밖에서 임의 변경하지 말 것
- 새 기능 추가 금지
- 새 카드/새 입력란/새 섹션 임의 추가 금지
- 선생님 메모란을 새로 추가하지 말 것
- `openParentReport()` 함수 자체 삭제 금지
- AI 관련 내부 함수 대삭제 금지
- `git add`, `git commit`, `git push` 실행 금지

## 수정 대상 파일

- `apmath/js/report.js`

읽기 전용 확인만 가능한 파일:
- `apmath/index.html`
- `apmath/js/ui.js`
- `apmath/js/classroom.js`

단, 읽기 전용 파일은 절대 수정하지 않는다.

## 수정 방향 요약

### 1. 바깥 평가 리포트 센터 버튼 정리

`openReportCenterExam()` 안에서 현재 아래 구조가 있다.

- 1차 버튼:
  - `리포트 크게 보기/출력`
  - `카톡 요약 복사`

- 2차 버튼:
  - `기존 카드 리포트`
  - `프리미엄 분석`

- 안내 박스:
  - `프리미엄 리포트 문구와 출력 상태는 전체화면에서 정확히 확인합니다.`

수정 후에는 바깥 평가 리포트 센터에 아래 2개 버튼만 남긴다.

- `리포트 크게 보기/출력`
- `카톡 요약 복사`

삭제/렌더링 제거 대상:
- `기존 카드 리포트` 버튼
- `프리미엄 분석` 버튼
- `프리미엄 리포트 문구와 출력 상태는 전체화면에서 정확히 확인합니다.` 안내 박스

주의:
- `openParentReport()` 함수는 삭제하지 않는다.
- `reportCenterRequestExamAiAnalysis()` 함수는 삭제하지 않는다.
- 버튼 렌더링만 제거한다.
- 3개 버튼을 한 줄에 넣지 않는다.
- 바깥 리포트 센터의 주요 버튼은 기존처럼 2열 구조를 유지한다.

### 2. 크게 보기 화면 툴바 정리

`reportCenterOpenPrintView()` 안에서 크게 보기 화면 툴바를 확인한다.

수정 후 툴바에는 아래 2개 버튼만 남긴다.

- `리포트 센터로 돌아가기`
- `인쇄하기`

삭제/렌더링 제거 대상:
- `기본 리포트로 복귀`
- `프리미엄 분석 적용`

주의:
- 처음 `root.innerHTML`에 들어가는 툴바가 이미 2개 버튼이면 그대로 유지한다.
- 그 아래에서 `printToolbar.innerHTML = ...`로 다시 덮어쓰며 4개 버튼을 만드는 블록은 제거하거나 2개 버튼만 남기도록 수정한다.
- 크게 보기 안쪽에서 프리미엄 분석 요청으로 진입할 수 없게 한다.
- `reportCenterResetPrintViewAiAnalysis()` 함수와 `reportCenterRequestPrintViewAiAnalysis()` 함수 자체는 삭제하지 않는다.

### 3. 크게 보기 안쪽 선생님 메모 패널 제거

`reportCenterOpenPrintView()` 안에서 `.report-print-stage` 앞에 아래 패널을 삽입하는 부분을 찾는다.

- `section.report-print-control-panel`
- `label for="report-print-teacher-memo"`
- `textarea#report-print-teacher-memo`

수정 기준:
- 크게 보기 화면 안쪽에는 별도 선생님 추가 메모 패널을 렌더링하지 않는다.
- 바깥 리포트 센터의 `textarea#report-center-exam-teacher-memo`는 유지한다.
- 기존 메모 값은 크게 보기 진입 시 `teacherMemo`로 읽어 리포트 본문에 반영되는 기존 흐름을 유지한다.
- 크게 보기 화면 안에서 메모를 수정하는 기능은 제거한다.
- `reportCenterGetExamReportTeacherMemo()`는 크게 보기 메모 textarea가 없어도 바깥 리포트 센터 메모 또는 `window.AP_REPORT_PENDING_TEACHER_MEMO`를 읽을 수 있으므로 유지한다.
- `reportCenterSyncPrintMemoToCenter()`, `reportCenterHandlePrintViewMemoInput()` 함수는 삭제하지 않아도 된다. 다만 크게 보기 UI에서 호출되지 않게 한다.

### 4. 프리미엄 분석 본문 배지 제거

`reportCenterBuildCleanPdfDocument()` 안에서 아래와 같은 로직을 찾는다.

- `const aiBadgeHtml = aiAnalysis ? '<div class="aprc-ai-badge">프리미엄 분석</div>' : '';`
- 또는 동등한 `프리미엄 분석` 배지 렌더링

수정 기준:
- 리포트 본문 헤더에 `프리미엄 분석` 배지가 나오지 않게 한다.
- 가장 안전한 방식은 `aiBadgeHtml`을 빈 문자열로 고정하는 것이다.
- 해당 배지를 위한 CSS는 삭제하지 않아도 된다.
- 본문에서 사용자에게 `프리미엄 분석`이라는 문구가 보이지 않아야 한다.

### 5. 평가 리포트에서 캐시된 AI 분석 반영 차단

현재 `reportCenterBuildCleanPdfDocument()`, `reportCenterPrintCleanPdf()`, `reportCenterRefreshPremiumExamPreview()`, `reportCenterOpenPrintView()` 등에서 `reportCenterGetCachedAiAnalysis(sessionId)`가 전달될 수 있다.

이번 작업에서는 평가 리포트 화면을 기본 리포트 중심으로 안정화한다.

수정 기준:
- 평가 리포트 크게 보기와 인쇄에는 캐시된 AI 분석을 반영하지 않는다.
- `reportCenterBuildCleanPdfDocument()` 내부에서 `aiAnalysis`는 기본적으로 `null`이 되게 한다.
- 또는 해당 함수 호출부에서 `aiAnalysis: null`을 명시한다.
- 더 안전한 방식은 `reportCenterBuildCleanPdfDocument()` 안에서 `const aiAnalysis = null;` 흐름으로 고정하는 것이다.
- 단, AI 내부 함수와 캐시 함수 자체는 삭제하지 않는다.
- `reportCenterCopyExamKakaoSummary()`는 카톡 요약 복사 기능이므로 함부로 망가뜨리지 않는다. 단, 평가 리포트 본문/출력에는 프리미엄 분석이 반영되지 않게 한다.
- 기존 캐시 데이터가 localStorage에 남아 있어도 평가 리포트 화면과 인쇄 본문에는 `프리미엄 분석` 표시나 AI 문장 반영이 나오지 않게 한다.

주의:
- AI 관련 함수 삭제 금지
- 백엔드 API 라우팅 수정 금지
- 캐시 삭제 로직 강제 실행 금지
- 기존 캐시가 있어도 출력에 쓰지 않는 방향으로 처리

### 6. 크게 보기 레이아웃 보정

이번 레이아웃 보정은 구조 대수술이 아니라 UI 제거에 따른 최소 보정이다.

보존:
- `.report-print-stage`
- `#report-print-document-root`
- `.aprc-pdf-document` 190mm 폭
- 인쇄용 A4 구조
- `reportCenterBuildCleanPdfShell()`
- MathJax 로딩 후 `window.print()` 트리거
- `reportCenterPrintCleanPdf()`

수정 가능:
- `reportCenterInjectPrintViewStyle()`에서 불필요해진 `.report-print-control-panel` 관련 CSS는 남겨도 되지만, 가능하면 그대로 두어도 무방하다.
- 툴바 버튼이 2개만 남았을 때 보기 좋게 정렬되도록 `.report-print-toolbar`와 `.report-print-toolbar .btn`만 최소 보정 가능하다.
- 190mm 폭은 인쇄 품질 보존을 위해 건드리지 않는다.
- 화면이 좁을 때는 `.report-print-stage`의 가로 스크롤로 대응한다.

권장 툴바 구조:
- desktop/mobile 모두 2개 버튼이 자연스럽게 보이도록 기존 flex 구조 유지
- 버튼은 동일 높이 유지
- `리포트 센터로 돌아가기`와 `인쇄하기`만 표시

## 함수별 작업 기준

### 반드시 확인/수정할 함수

- `openReportCenterExam()`
  - `기존 카드 리포트` 버튼 제거
  - `프리미엄 분석` 버튼 제거
  - `프리미엄 리포트 문구와 출력 상태는 전체화면에서 정확히 확인합니다.` 안내 박스 제거
  - `리포트 크게 보기/출력`, `카톡 요약 복사` 버튼은 유지
  - 바깥 `report-center-exam-teacher-memo`는 유지

- `reportCenterOpenPrintView()`
  - 툴바는 `리포트 센터로 돌아가기`, `인쇄하기`만 유지
  - `기본 리포트로 복귀`, `프리미엄 분석 적용` 제거
  - `report-print-control-panel` 삽입 제거
  - `report-print-teacher-memo` textarea 렌더링 제거
  - `report-print-document-root` 래핑은 유지

- `reportCenterBuildCleanPdfDocument()`
  - `프리미엄 분석` 배지 제거
  - 평가 리포트 본문에서 AI 분석 반영 차단
  - 기존 기본 리포트 본문 구조는 보존

- `reportCenterPrintCleanPdf()`
  - 인쇄 시 `aiAnalysis`를 전달하지 않거나 `null`로 전달
  - 인쇄 본문은 기본 리포트 기준으로 출력

- `reportCenterRefreshPremiumExamPreview()`
  - 프리뷰 갱신 시 `aiAnalysis`를 전달하지 않거나 `null`로 전달
  - 단, 함수명은 변경하지 않는다.

### 삭제하지 말아야 할 함수

- `openParentReport()`
- `reportCenterRequestExamAiAnalysis()`
- `reportCenterRequestPrintViewAiAnalysis()`
- `reportCenterResetExamAiAnalysis()`
- `reportCenterResetPrintViewAiAnalysis()`
- `reportCenterSetCachedAiAnalysis()`
- `reportCenterGetCachedAiAnalysis()`
- `reportCenterBuildExamAiPayload()`
- `reportCenterNormalizeAiAnalysis()`
- `reportCenterCopyExamKakaoSummary()`

## 사용자 노출 문구 제거 기준

아래 문구는 평가 리포트 센터/크게 보기/출력 본문에서 사용자에게 보이지 않아야 한다.

- `프리미엄 분석`
- `프리미엄 분석 적용`
- `기본 리포트로 복귀`
- `프리미엄 리포트 문구와 출력 상태는 전체화면에서 정확히 확인합니다.`

아래 문구는 보존한다.

- `리포트 크게 보기/출력`
- `카톡 요약 복사`
- `리포트 센터로 돌아가기`
- `인쇄하기`
- `선생님 추가 메모` 바깥 리포트 센터 textarea placeholder
- 평가 리포트 본문 제목/섹션명
- 학부모 메시지 본문
- 다음 수업 계획 본문
- 세부 문항 분석 자료
- footer

주의:
- 바깥 리포트 센터의 `선생님 추가 메모` placeholder는 유지한다.
- 크게 보기 안쪽에는 별도 메모 패널을 만들지 않는다.

## 검증 명령

반드시 실행한다.

```bash
node --check apmath/js/report.js
git status --short
````

사용자 노출 문구 잔존 여부를 확인한다.

macOS/Linux/WSL/Git Bash 환경:

```bash
grep -n "프리미엄 분석\|프리미엄 분석 적용\|기본 리포트로 복귀\|프리미엄 리포트 문구와 출력 상태" apmath/js/report.js || true
```

Windows PowerShell 환경:

```powershell
Select-String -Path apmath/js/report.js -Pattern "프리미엄 분석|프리미엄 분석 적용|기본 리포트로 복귀|프리미엄 리포트 문구와 출력 상태"
```

검색 결과가 남아도 다음 조건이면 허용 가능하다.

* 삭제하지 않은 내부 함수의 에러 메시지나 toast에만 남은 경우
* 사용자 진입점이 제거되어 실제 화면에 노출되지 않는 경우
* 단, `openReportCenterExam()`, `reportCenterOpenPrintView()`, `reportCenterBuildCleanPdfDocument()`에서 사용자에게 렌더링되는 문자열로 남아 있으면 수정해야 한다.

## 수동 확인 체크리스트

수정 후 브라우저에서 확인할 항목을 `CODEX_RESULT.md`에 적는다.

* 평가 리포트 센터에서 버튼이 `리포트 크게 보기/출력`, `카톡 요약 복사` 2개만 보이는지
* 평가 리포트 센터에서 `기존 카드 리포트` 버튼이 사라졌는지
* 평가 리포트 센터에서 `프리미엄 분석` 버튼이 사라졌는지
* 평가 리포트 센터에서 프리미엄 안내 박스가 사라졌는지
* 바깥 리포트 센터의 선생님 추가 메모는 그대로 보이는지
* 크게 보기 화면에서 `리포트 센터로 돌아가기`, `인쇄하기`만 보이는지
* 크게 보기 화면 안쪽의 선생님 추가 메모 패널이 사라졌는지
* 리포트 본문 헤더에 `프리미엄 분석` 배지가 보이지 않는지
* 인쇄하기가 정상적으로 새 창을 여는지
* 인쇄 본문에 툴바/메모패널/프리미엄 UI가 섞이지 않는지

## CODEX_RESULT.md 작성 형식

루트의 `CODEX_RESULT.md`에 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

* 수정한 파일 목록
* 읽기 전용 확인 파일 목록

## 2. 구현 완료 또는 확인 완료

* 바깥 평가 리포트 센터 `프리미엄 분석` 버튼 제거 여부
* 바깥 평가 리포트 센터 `기존 카드 리포트` 버튼 제거 여부
* 바깥 평가 리포트 센터 프리미엄 안내 박스 제거 여부
* 크게 보기 툴바 정리 여부
* 크게 보기 안쪽 선생님 메모 패널 제거 여부
* 바깥 선생님 추가 메모 유지 여부
* 리포트 본문 `프리미엄 분석` 배지 제거 여부
* 평가 리포트 출력에서 AI 캐시 반영 차단 여부
* 인쇄하기 흐름 보존 여부
* 기존 리포트 본문 보존 여부

## 3. 실행 결과

* `node --check apmath/js/report.js`: PASS/FAIL
* `git status --short` 결과
* `프리미엄 분석`/`기본 리포트로 복귀`/`기존 카드 리포트` 검색 결과 요약

## 4. 결과 요약

* 화면에서 무엇이 사라졌는지
* 레이아웃에서 무엇이 정리됐는지
* 인쇄 흐름은 어떻게 보존했는지

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 점

* 기존 문구·버튼명·화면명을 요청 범위 밖에서 임의 변경하지 않았는지
* 선생님 메모란을 불필요하게 새로 만들지 않았는지
* 바깥 선생님 추가 메모는 유지했는지
* 본문 리포트/인쇄 흐름을 망가뜨리지 않았는지
* AI 내부 함수 삭제 없이 UI 진입점과 출력 반영만 정리했는지
* `openParentReport()` 함수 자체는 삭제하지 않았는지

## 6. 다음 조치

* 실제 브라우저에서 확인할 체크리스트
* 추가 수정이 필요할 경우 다음 후보

## 최종 출력

터미널 마지막 출력은 반드시 아래 문장으로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
