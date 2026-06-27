# AP Math Report Studio — 쉬운말 마무리 작업 계획

기준 문서: `docs/report-copy-final.md`(쉬운말 최종본 = 단일 소스), `docs/report-copy-review.md`(검수/변형 후보).
대상 코드: `apmath/js/report.js`.

확정된 방향:
- 상세형(detailed): 블록당 문장 풍부 + 상세형 전용 섹션 추가 + 분석표 더 자세히 (3가지 모두).
- PDF 분량: 표준형 1장 / 상세형 2장.
- PDF 통증점: 내용 잘림·넘침 + 여백·밀도.

작업 순서: 1단계 → 2단계 → 3단계 (깨끗한 문구 위에 풍부화·레이아웃을 올린다).

---

## 현재 구조 요약

쉬운말은 2중 구조로 들어가 있다.

1. 깨끗한 신규 생성기: `reportCenterEasy*` 계열 (요약/계획/학부모메시지). final.md 거의 반영됨.
2. 레거시 생성기 + 정화 레이어: 옛 문구 생성 후 `reportCenterApplyEasyFinalLanguage()`(L168) / `reportHumanizeApplyApMathTone()`(L98)로 후처리.

PDF 빌더 `reportCenterBuildCleanPdfDocument()`(L3880~)가 auto 블록에 정화를 통과시킨다.
사용자가 직접 편집한(dirty) 블록은 정화 제외 — 의도된 동작이므로 유지.

`length`(표준형/상세형)은 현재 UI 드롭다운(L4501)과 길이 경고(L282)에만 존재. 생성기·빌더가 분기하지 않아 상세형 = 표준형과 사실상 동일.

---

## 1단계 — 전체 문구 정리 (표준형 기준, 금지어 0)

목표: PDF auto 블록 출력에서 review 문서의 금지 표현이 0이 되게.

### 1-1. PDF 활성 경로 레거시 생성기 소스 수정
정화 레이어 의존을 줄이고 생성 시점부터 쉬운말로.
- `reportCenterBuildInterpretiveDiagnosisLines()`(L2820~, teacherOpinion) — 최우선.
  "매우 안정적인 성취 / 이 흐름 / 학습 폭 / 확인 포인트" → final.md teacherOpinion 템플릿으로 교체.
- summary/trend/weakness 생성기(`reportCenterBuildSingleExamSummaryText`,
  `reportCenterBuildTrendSummaryText`, `reportCenterBuildWeaknessSummaryText`) 잔여 표현 점검.
- fallback `정답률 %로 마무리했습니다`(L4440) → final.md summary 계열로.

### 1-2. 정화 레이어 안전망 보강
`reportCenterApplyEasyFinalLanguage()`에 누락 매핑 추가:
- "자연스럽게 확장", "안정적으로(/유지)", "사고력", "성취(를) 유지", "흔들림 없이",
  "확인 포인트", "확인할 부분" 등 review 문서 §3 전체를 커버.

### 1-3. 구 학부모카드 경로 정리(사용처 확인 후)
- `buildExamSummary()`(L520), `buildReportCardNextPoint()`(L5713),
  `openParentReport()`(L5736) 경로가 살아있는지 확인.
- 살아있으면 동일 기준으로 수정, 죽은 코드면 제거 후보로 표시.

### 1-4. 회귀 테스트
- `tests/`에 생성기 단위 테스트: mock data로 각 블록 생성 →
  `AP_REPORT_EASY_FORBIDDEN_RE` 매치 0 검증.
- 표준형/상세형 각각, 오답 있음/만점/첫시험 케이스 커버.

PASS: 모든 블록 auto 텍스트에서 금지어 0, dirty 블록은 정화 미적용 유지.

---

## 2단계 — 표준형/상세형 풍부화

목표: `length` 모드를 생성기 → PDF 빌더까지 관통.

### 2-1. length 전파
- `reportCenterBuildCleanPdfDocument(options.length)` 수신,
  `studioState.textOptions.length`를 빌더 옵션으로 연결.

### 2-2. 블록당 문장 풍부화
- 각 easy 생성기에 `length` 인자. 표준형 = 1문장(현행),
  상세형 = 2~3문장 (final.md/review §6 변형 후보 활용).

### 2-3. 상세형 전용 섹션 추가
- 문항별 짧은 코멘트 섹션, 추이 해석 확장 블록을 상세형에서만 렌더.

### 2-4. 분석표 더 자세히
- 상세형 분석표에 난도/정답률/코멘트 컬럼·설명 추가.

### 2-5. slice 한도 length별 분리
- 표준형 360/320 유지, 상세형은 detailed 한도(L277~ 280/300/420…)로 상향.

PASS: 상세형이 표준형보다 실제로 내용이 더 들어가고, 금지어 0 유지(1단계 테스트 재사용).

---

## 3단계 — PDF 레이아웃

목표: 표준형 1장 / 상세형 2장, 잘림·넘침·여백 해결.

### 3-1. 잘림·넘침 제거
- 고정 글자 slice로 문장 중간이 잘리는 문제 → 문장 경계 기준 트림 또는
  length별 한도로 전환. `overflow:hidden` 잘림 CSS 점검(L4233~).

### 3-2. 표준형 1장 보장
- 섹션 on/off + 한도 조합으로 A4 1장 핏.

### 3-3. 상세형 2장 레이아웃
- 분석표/문항 코멘트를 2페이지로 보내는 page-break 지점 명시,
  `break-inside:avoid` 점검.

### 3-4. 여백·밀도
- `aprc-pdf-*` 간격(섹션/카드/표) 조정.

### 3-5. 인쇄 검수
- 브라우저 print 미리보기로 표준형 1장 / 상세형 2장 확인.

PASS: 표준형 1장에 잘림 없음, 상세형 2장에 모든 블록 온전 출력, 여백 균일.

---

## 리스크 / 메모

- dirty(사용자 편집) 블록은 정화하지 않는 정책 유지 — 1단계에서 건드리지 않는다.
- review 문서 §12 "검수 필요 문구"는 final.md가 최종본이므로 final.md를 우선 적용한다.
- AI 분석 텍스트(`aiAnalysis.*`)는 외부 입력 — 정화 레이어를 반드시 통과시키고 길이 제한.
