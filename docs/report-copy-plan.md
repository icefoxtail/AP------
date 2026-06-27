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

## 1단계 — 전체 문구 정리 (표준형 기준, 금지어 0) ✅ 완료 (2026-06-27)

목표: PDF auto 블록 출력에서 review 문서의 금지 표현이 0이 되게.

완료 내역:
- 렌더 경로 소스 수정: 스튜디오 초안 plan fallback을 `reportCenterBuildEasyPlanItems`로 교체(L4435),
  `finalEvaluation.nextPlan` 생성기 쉬운말화(L6067~), summary fallback 정리(L4440),
  `reportCenterSoftenDiagnosisText` '관리/확인할 부분' 유입 제거.
- 안전망 보강: `reportCenterApplyEasyFinalLanguage`(보장 정화기) + `reportHumanizeApplyApMathTone`에
  안정화·현재 흐름·자연스럽게 확장/연결·사고력·성취/강점 유지·학습 폭·흔들림·확인 포인트 매핑 추가.
- 죽은 코드 정리: `reportCenterBuildExamDiagnosisLines`를 easy 생성기로 위임,
  `buildReportCardNextPoint`·학부모 카드 v1 라벨·`reportCenterGetQuestionStatsSummary` 쉬운말화.
- 일일 리포트(`buildExamSummary`/`buildNextPoint`/조퇴·학생 문구) 금지어 라이트 정리.
- 회귀 테스트 추가: `tests/apmath-report-easy-language.test.js` (16 groups PASS).
  report.js 샌드박스 로드 → applyEasy 코퍼스 하드검증 + easy 생성기 목 데이터 검증.

메모: humanize는 maxChangeRatio 가드가 있는 톤 다듬기용(원문 보존 fallback 존재). 금지어 "보장"
정화는 applyEasy가 담당. 내부 상담 초안(`reportCenterBuildCounselPreview`, L2492 "[현재 확인 포인트]")은
학부모 발송 범위 밖이라 유지.

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

## 2단계 — 표준형/상세형 풍부화 ✅ 완료 (2026-06-27)

목표: `length` 모드를 생성기 → PDF 빌더까지 관통.

완료 내역:
- length 감지: 빌더 상단에서 `options.studioState.textOptions.length`(또는 `options.length`)로
  `isDetailed` 판정. 인쇄 경로(`reportCenterPrintCleanPdf`/`reportCenterBuildPrintDocument`)가
  studioState를 넘기므로 '문구 길이' 드롭다운 → 상세형이 즉시 반영됨.
- 블록 라인/길이 분기: 표준형 plan 3·선생님 의견 2줄, 상세형 plan 6·선생님 의견 4줄,
  트림 한도(summary/weakness/plan/teacher)도 length별. 상세형 요약에 점수 위치(평균 대비) 문장 1줄 추가.
- 상세형 전용 섹션: '문제별 코멘트'(`reportCenterBuildQuestionCommentCards`) — 우선 문항 5개에
  `reportCenterBuildParentQuestionInsight` 기반 짧은 해석 카드.
- 분석표 length-aware: 표준형 = 먼저 볼 문제 5행, 상세형 = 틀린 문제 전체 + 문항별 해석 보강.
- 코멘트 카드 CSS 추가(`.aprc-qcomment*`).
- 테스트 확장: 분석표 표준 5행/상세 전체행, 코멘트 카드 5개·금지어 0 검증(17 groups PASS).
  surface 픽스처 갱신(신규 함수 1개 반영).

메모: 상세형 약점 한 줄 덧붙임은 '문제별 코멘트' 섹션과 중복되어 제거. parentMessage는
이미 3~4문장이라 표준/상세 공통 유지. 실제 1장/2장 페이지 핏·여백은 3단계에서 처리.

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

## 3단계 — PDF 레이아웃 ✅ 완료 (2026-06-27)

결정 반영: 분석표·문항 코멘트를 상세형 전용으로(원장님 선택). 표준형은 서술 중심.
최종 측정: 표준형 283mm(0.95쪽 = A4 1장 ✓), 상세형 625mm(2.11쪽 ≈ 2장).
빌더에서 '문제별 분석' 표와 브릿지 노트("아래 분석 자료 참고")를 `isDetailed` 게이트 처리.
후속 완료: 스튜디오 레이아웃 탭의 '문항별 분석표 포함'에 '· 상세형 전용' 표기 +
표준형일 때 비활성화(흐림) + 안내 문구('상세형에서만 출력') 추가
(`reportCenterRenderStudioLayoutTab`). 나머지 토글(그래프·약점표)은 두 포맷 공통이라 그대로.
남은 권장: 실인쇄(브라우저 print) page-break 최종 확인.

---

### (이전) 3단계 진행 기록

목표: 표준형 1장 / 상세형 2장, 잘림·넘침·여백 해결.

검증 방법: 목 데이터 렌더 하니스(앱 미구동). report.js를 샌드박스 로드 →
데이터 제공 함수만 목으로 오버라이드 → 빌더 호출 → A4 시트 가이드(297mm 경계선) 위에
표준형/상세형을 올린 미리보기로 페이지 핏 측정.

측정 결과(밀도 압축 전 → 후):
- 표준형: 440mm(1.48쪽) → 351mm(1.18쪽)
- 상세형: 753mm(2.54쪽) → 625mm(2.11쪽)

적용한 밀도 압축(공통, `reportCenterPremiumReportStyle`):
- 섹션 여백 6mm→3.1mm, 헤더 패딩 11/8→5/5, 학생밴드 5→3.2mm, 점수카드 4.2→3.2mm,
  패널 4.5→3.4mm, 본문 줄간격 1.56→1.5, 섹션타이틀 14→13px·여백 9→6px,
  분석표 폰트 10→9.7px·셀 패딩 3/5, 푸터/브릿지 노트 축소. 잘림 없음(내용 흐름 유지).
- 상세형 문항 코멘트 카드 5→4.

남은 결정/작업:
- 표준형이 콘텐츠 양상 ~1.18쪽으로, 마지막 '학부모 말씀' 박스가 2쪽으로 살짝 넘침.
  정확히 1쪽에 맞추려면 (A) 분석표를 상세형 전용으로 내려 표준형은 서술 중심으로 두거나,
  (B) 표준형에 분석표 유지하고 ~1.2쪽 허용. → 원장님 결정 필요.
- 상세형 2.11쪽은 실데이터 변동 포함 사실상 2쪽. 코멘트 카드 수/추이 그래프 높이로 미세조정 가능.
- 실제 인쇄(브라우저 print)에서 페이지 분할 지점 최종 확인 권장.

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
