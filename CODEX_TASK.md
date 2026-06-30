# CODEX_TASK — 학부모 리포트 "시험 후 후속 대책" 고도화 (v5)

> 작성: 설계 팀장 검토본. 이 문서는 처음부터 끝까지 읽고 루프 순서대로 실행한다.
> GPT 원안(신규 4블록 + 새 copy bank 5종 + 평가 종류 분기)은 코드 대조·현장 검토를 거쳐
> **신규 2블록 + 새 산문 0 + 종류 분기 0**으로 축소 확정되었다. 아래가 확정안이다.

---

## 0. 한 줄 방향

```
리포트를 "시험 결과 안내문"에서 "시험 후 보완·오답관리·복습 계획이 보이는 학부모 리포트"로 올린다.
단, 새 문구를 만들지 않고 이미 검수 통과된 기존 문구 자산을 재배치·집계해서 만든다.
```

---

## 1. 목적

현재 PDF 리포트(`reportCenterBuildCleanPdfDocument`)에 **후속 대책 흐름**을 얹는다.

- 점수카드 → 요약/추이 → **이번 시험 보완 방향(신규)** → **AP수학 오답관리(신규)** → **다음 수업 복습 계획(라벨 변경)** → 상세 문항 분석 → 의견/메시지
- 신규 블록 2개는 **기존 생성기·문구 bank를 재사용하는 얇은 composer**로만 만든다.
- 번호별(문항별) 피드백은 신규 블록에 넣지 않는다. 그건 기존 상세형 "문제별 분석/코멘트"가 담당한다. 신규 블록은 **전체(집계) 피드백 전용**이다.

### 설계 배경 (왜 이렇게 줄었나 — 임의 변경 금지)

- "시험 전 준비" 블록은 **제외**한다. (a) 유일하게 새 산문이 필요했고, (b) 단원·내부평가에 "학교 기출 확인" 같은 오문구를 유발했으며, (c) 학부모 신뢰는 사전 준비 자기보고보다 사후 대책에서 나온다.
- 쪽지시험은 애초에 학부모 리포트 대상이 아니므로 **평가 종류 분기 자체가 불필요**하다. 단원/월말/모의/학교고사의 후속 대책은 동일 문구로 통일한다. `exam_title` 파싱·종류 판별 코드를 만들지 않는다.

---

## 2. 절대 금지

- `git add`, `git commit`, `git push`, deploy. (코드만 수정하고 멈춘다.)
- 기존 dirty 파일 되돌리기/임의 정리.
- 기존 UI 문구·버튼명·화면명 변경 (단, `plan` 블록 라벨 "다음 수업 계획"→"다음 수업 복습 계획" 변경은 **이 작업의 지시 범위로 허용**).
- **Codex의 즉석 산문 창작**. 블록 텍스트는 둘 중 하나에서만 온다: (a) 기존 생성기 출력, (b) 이 문서 §7-4에 **글자 그대로 박아둔 확정 문구를 `REPORT_COPY_BANK` 고정 상수/템플릿으로 옮긴 것**(`reportCopyFillSlots` 슬롯 채움만 허용, `questionInsight`와 동일 패턴). Codex가 새 설명문을 지어내지 않는다. §7-4 문구는 한 글자도 바꾸지 않는다. (§7-3 흐름 띠 라벨 = 구조물, 산문 아님)
- 평가 종류 판별/분기 로직 신설 금지.
- 블록 키 신규 추가 시 **기존 `plan` 키 삭제/대체 금지** (저장본 호환). `plan`은 라벨만 바꾼다.
- DB / Worker API / migration / SQL 수정 금지.
- 내부 시스템 표현을 학부모 문장에 노출 금지 (`docs/codex/CODEX_FORBIDDEN_CHANGES.md` Report AI 항목). "오답관리" 블록은 학원 서비스로 읽혀야 하며 내부 운영 용어(클리닉 출력 로그, payload, 큐 등)를 노출하지 않는다.

---

## 3. 반드시 읽을 문서 (작업 전, 최소 4)

1. `docs/codex/06_CODEX_EXECUTION_RULE.md`
2. `docs/codex/CODEX_FORBIDDEN_CHANGES.md`
3. `docs/codex/CODEX_RESULT_RULE.md`
4. `docs/codex/CODEX_ALLOWED_CHANGE_SCOPE.md`
5. (참고) `tests/apmath-report-easy-language.test.js` — 신규 블록이 통과해야 할 금지어/품질 기준의 사실상의 사양

---

## 4. 반드시 확인할 파일 (라인 앵커는 작성 시점 기준, 함수명으로 재확인)

| 파일 | 위치 | 무엇 |
|---|---|---|
| `apmath/js/report-center.js` | `AP_REPORT_STUDIO_BLOCKS` (≈1871) | 블록 배열 — 여기에 2개 추가 + plan 라벨 변경 |
| `apmath/js/report-center.js` | `reportCenterStudioDefaultOptions` (≈1889) | 기본 토글 — 신규 2개 기본 ON |
| `apmath/js/report-center.js` | `reportCenterBuildReportDraft` (≈1932) | 블록 draft 조립(autoTexts 소비) |
| `apmath/js/report-center.js` | `reportCenterMergeAiAnalysisIntoStudioState` (≈2065) | aiText 병합 (신규 블록은 aiText 없음 = 빈 문자열 처리) |
| `apmath/js/report-center.js` | `reportCenterCreateStudioStateForPrintView` autoTexts (≈2372) | **autoText 배선 1** (편집/프린트뷰 경로) |
| `apmath/js/report-center.js` | `reportCenterRenderStudioLayoutTab` rows (≈2488) | 표/구성 탭 토글 행 |
| `apmath/js/report-center.js` | 재사용 생성기들 | `reportCenterBuildParentQuestionInsight`(1459), `reportCenterBuildEvaluationMeaningItems`(1790), `reportCenterBuildEasyPlanItems`(1656), `reportCenterBuildEasyTeacherOpinionLines`(1666), `reportCenterSelectPriorityWrongRows`(1476) |
| `apmath/js/report-print.js` | `reportCenterBuildCleanPdfDocument` autoTexts (≈116) | **autoText 배선 2** (PDF 경로) |
| `apmath/js/report-print.js` | 같은 함수 섹션 조립부 (≈224~286) | PDF 섹션 HTML 배치 |
| `apmath/js/report-text.js` | `REPORT_COPY_BANK.questionInsight`(62), `reportCenterApplyEasyFinalLanguage`(224) | 재사용 bank + 최종 정화기 |

---

## 5. 허용 수정 범위

- `apmath/js/report-center.js`
- `apmath/js/report-print.js`
- `apmath/js/report-text.js`
- `tests/apmath-report-easy-language.test.js` (신규 검사 추가)
- `CODEX_RESULT.md` (결과 작성)
- 필요 시 관련 문서(`docs/**`) — §10의 master 문서 판정 포함

## 6. 제외 범위 (불가침)

DB / Worker API / migration / `eie/**` / `archive/**` / `planner` / wrong-print 엔진 / 대시보드 전체 구조 / 기존 차트 SVG 빌더 / `openParentReport`·`showParentReportModal`(카드형 리포트, 별개 흐름) 는 건드리지 않는다.

---

## 7. 설계 확정 사항

### 7-1. 최종 블록 구성 (총 9블록, 신규는 plan 뒤가 아니라 의미 흐름 위치에)

```
summary        이번 시험 요약            (기존)
trend          추이 해석                 (기존)
weakness       다시 볼 부분              (기존)
remediation    이번 시험 보완 방향        ← 신규 ①
wrongCare      AP수학 오답관리            ← 신규 ②
plan           다음 수업 복습 계획         ← 라벨 변경(키·생성기 유지)
teacherOpinion 선생님 종합 의견           (기존)
parentMessage  학부모님께 드리는 말씀      (기존)
kakaoSummary   카톡 요약문               (기존)
```

`AP_REPORT_STUDIO_BLOCKS` 배열 순서도 위와 동일하게 맞춘다(문구 탭 입력칸 순서 = 리포트 흐름 순서).

### 7-2. 구성 원칙 (모순 해소판 — 반드시 이 규칙으로)

> 검토 결과 "집계 문장을 함수가 조립" 방식은 결국 산문 창작이라 "새 산문 0" 원칙과 충돌한다.
> 해소: **신규 블록의 문장은 §7-4의 확정 문구를 `REPORT_COPY_BANK`에 상수/템플릿으로 박고, 데이터로 채우는 부분만 슬롯**으로 둔다. 함수는 "어떤 템플릿을 고르고 어떤 슬롯을 채울지"만 결정한다. 카드/라벨 나열로 바꾸지 않는다(학부모 톤은 문장형이 맞다 — 형님 확정).

- **remediation(보완 방향)** = §7-4 `remediation` 템플릿 + `{labels}` 슬롯.
  - `reportCenterSelectPriorityWrongRows(wrongRows, 5)`로 우선 오답행을 고른다.
  - 각 행에 `reportCenterBuildParentQuestionInsight(row, null, { mode: 'short' })` → 구간별 라벨(`계산·검산 점검`/`풀이 순서 정리`/`조건 해석·식 세우기`/`개념부터 재정리`/`재점검 문항`).
  - 라벨을 **중복 제거**해 `{labels}`(예: `계산·검산 점검, 개념부터 재정리`)로 만들고 §7-4 `withWrong` 템플릿에 `reportCopyFillSlots`로 채운다.
  - 오답 0개: §7-4 `noWrong` 템플릿(슬롯 없음) 사용.
  - 번호 미포함(라벨만 슬롯).

- **wrongCare(AP수학 오답관리)** = §7-4 `wrongCare` **고정 2문장(슬롯 없음)** + 얇은 흐름 띠(§7-3, PDF 구조물).
  - 문항번호가 들어가는 `reportCenterBuildEasyPlanItems` 결과를 **쓰지 않는다**(번호 유입 차단). §7-4 고정 문구만 사용.
  - 학부모 친화 톤 유지, 내부 운영 용어 금지. 결과에 `/\d+번/` 패턴이 없어야 한다.

- **plan(다음 수업 복습 계획)** = 기존 `reportCenterBuildNextPlanItems` / `reportCenterBuildEasyPlanItems` 출력 **그대로**. 라벨/섹션 제목만 "다음 수업 복습 계획"으로. (이 블록은 번호 허용 — 기존 동작 유지)

- 모든 신규 블록 텍스트는 출력 직전 `reportCenterApplyEasyFinalLanguage()`를 통과시킨다. dirty(사용자 편집) 블록은 정화기 미적용 — 기존 `dirtyBlocks` 처리 규칙을 그대로 따른다.

### 7-3. 흐름 띠 상수 (유일하게 새로 추가하는 "문구" — 산문 아님)

`report-text.js`에 라벨 상수 1개만 추가:
```
const REPORT_WRONGCARE_FLOW = ['재풀이', '유사문항 복습', '반복 오답 관리', '시험 전 재확인'];
```
표시는 ` → ` 조인. 학부모 노출 텍스트이므로 금지어 검사 대상에 포함시킨다.
이 상수는 테스트에서 참조하므로 **§8 LOOP 4에서 `loadReportExports()` return에 `REPORT_WRONGCARE_FLOW`도 추가**한다.

### 7-4. 신규 블록 확정 문구 (bank에 글자 그대로 박는다 — Codex 변경 금지)

`REPORT_COPY_BANK`에 아래를 그대로 추가한다. 이것이 "새 산문 0"의 실체다 — Codex는 이 문장을 옮겨 담을 뿐 창작하지 않는다.

```
REPORT_COPY_BANK.remediation = {
  withWrong: '이번 오답은 {labels} 중심으로 다음 수업에서 보완하겠습니다.',
  noWrong:   '이번 시험은 오답이 없어, 다음 단원과 한 단계 높은 난도로 보완 학습을 이어가겠습니다.'
};
REPORT_COPY_BANK.wrongCare = {
  line1: '오답 문항은 다음 수업과 보강에서 다시 풀이한 뒤, 유사 유형으로 한 번 더 복습합니다.',
  line2: '반복해서 틀리는 단원은 따로 모아 관리하고, 다음 시험 전에 다시 확인합니다.'
};
```

- `{labels}` = §7-2 라벨 중복제거 조인(`, `).
- 이 문구들은 금지어/깨진 한국어 0으로 사전 검수됨. **수정 시 §10 회귀 위험** — 바꾸지 말 것.
- 슬롯은 `{labels}` 하나뿐. 다른 슬롯/문장 추가 금지.

---

## 8. 루프별 실행 계획

> 각 루프는 **독립 커밋 단위가 아니라 작업 단위**다(커밋 금지). 루프 끝마다 §9 검증을 돌려 회귀 0을 확인하고 다음 루프로 간다. 한 루프라도 검증 실패 시 그 루프 안에서 해결한 뒤 진행한다.

### LOOP 1 — 구조 뼈대 (배선만, 출력 변화 최소)

**목표:** 신규 블록 2개가 데이터 파이프라인·문구 탭·토글에 "빈 값이어도 안 깨지게" 올라온다.

1. `AP_REPORT_STUDIO_BLOCKS`(≈1871)에 순서대로 추가/변경:
   - `['plan', '다음 수업 계획']` → `['plan', '다음 수업 복습 계획']` (라벨만)
   - `['remediation', '이번 시험 보완 방향']` 추가 (weakness 다음, plan 앞 위치)
   - `['wrongCare', 'AP수학 오답관리']` 추가 (remediation 다음, plan 앞)
   - 최종 배열 순서는 §7-1과 동일하게 정렬.
2. `reportCenterStudioDefaultOptions()`(≈1889)에 토글 2개 추가, 기본값 ON:
   - `includeRemediation: true`, `includeWrongCare: true`
3. autoText 배선 2곳에 키 추가(LOOP 1에서는 **빈 문자열 placeholder** 또는 임시 호출 없이 `''`로 둬도 됨 — 실제 문구는 LOOP 2에서):
   - `report-center.js` `reportCenterCreateStudioStateForPrintView` autoTexts(≈2372): `remediation: '', wrongCare: ''`
   - `report-print.js` `reportCenterBuildCleanPdfDocument` autoTexts(≈116): `remediation: '', wrongCare: ''`
4. `reportCenterRenderStudioLayoutTab` rows(≈2488)에 토글 행 2개 추가:
   - `['includeRemediation', '이번 시험 보완 방향 포함']`
   - `['includeWrongCare', 'AP수학 오답관리 포함']`
   (둘 다 종류 무관 = scope 인자 없음. 문항별 분석표만 'detailed' scope 유지.)
5. `dirtyBlocks` 객체(`report-print.js` ≈128)에 `remediation`, `wrongCare` 추가.
6. `blockLimit`(`report-print.js` ≈70, standard/detailed 분기)에 신규 블록 길이 캡 추가 — dirty(사용자 편집) 텍스트가 길어져 레이아웃을 흩뜨리는 것 방지용(장수 제한 목적 아님):
   - standard: `remediation: 220, wrongCare: 240`
   - detailed: `remediation: 280, wrongCare: 300`
   - 출력부에서 신규 블록도 기존 `reportCenterTrimText(text, blockLimit.xxx)` 패턴으로 트림.

**완료 기준:** 문구 탭에 신규 입력칸 2개가 보이고, 표/구성 탭에 토글 2개가 보인다. PDF는 아직 신규 섹션이 안 나와도 됨(LOOP 3). 기존 출력 회귀 0.
**회귀 가드:** `plan` 키는 그대로 존재(저장본 호환). 기존 토글/블록 누락 없음.

### LOOP 2 — composer 함수 2개 (문구 채우기, 기존 문구 재사용)

**목표:** remediation/wrongCare autoText를 기존 문구 조합으로 생성.

1. `report-text.js`에 §7-3 `REPORT_WRONGCARE_FLOW` 상수 + §7-4 `REPORT_COPY_BANK.remediation`/`REPORT_COPY_BANK.wrongCare` 확정 문구 추가(글자 그대로).
2. `report-center.js`에 composer 2개 신설 — **함수는 템플릿 선택·슬롯 채움만**, 문장 조립 금지:
   - `reportCenterBuildRemediationText(data, trendData, aiAnalysis)`: 오답 有 → §7-4 `remediation.withWrong`에 `{labels}`(§7-2 라벨 중복제거 조인) 채움 / 오답 無 → `remediation.noWrong`. `reportCopyFillSlots` 사용. 정화는 출력부에서.
   - `reportCenterBuildWrongCareText(data, trendData)`: §7-4 `wrongCare.line1` + `\n` + `wrongCare.line2` 반환(고정 문구, 슬롯 없음). `reportCenterBuildEasyPlanItems` **사용 금지**(번호 유입). 흐름 띠는 PDF 구조물이라 여기 미포함.
   - 두 함수 모두 §7-4 문구 외 새 문장 생성 금지. 결과에 `/\d+번/` 없어야 함(remediation은 라벨만, wrongCare는 고정 문구).
3. autoText 배선 2곳의 `remediation`/`wrongCare`를 placeholder→실제 호출로 교체:
   - `remediation: reportCenterBuildRemediationText(data, trendData, aiAnalysis)`
   - `wrongCare: reportCenterBuildWrongCareText(data, trendData)`
   (각 호출부에서 `data`/`trendData`/`aiAnalysis` 변수가 이미 스코프에 있는지 확인 후 사용. PDF 빌더에는 `data`,`trendData`,`aiAnalysis` 모두 존재함.)

**완료 기준:** `node tests/apmath-report-easy-language.test.js`에 신규 export를 추가하면(LOOP 4) 금지어 0으로 통과할 문구가 생성된다. 수동 확인: 두 함수가 빈 문자열이 아닌 학부모 친화 문장을 반환(오답 유/무 양쪽).
**회귀 가드:** remediation·wrongCare 결과 모두 `/\d+번/` 미포함. §7-4 외 새 문장 없음. 내부 용어 미포함.

### LOOP 3 — PDF 섹션 배치

**목표:** PDF에 신규 2섹션을 의미 순서대로 출력 + 토글/정화기 연동.

1. `report-print.js` 섹션 조립부(≈247 "다음 수업에서 이렇게 합니다" 앞)에 삽입 순서:
   - (기존 trend/weakness 그리드 ≈229 다음) →
   - **보완 방향** 섹션: `studioOptions.includeRemediation`일 때만. 제목 "이번 시험 보완 방향", 본문 = 정화 처리된 `studioTexts.remediation`.
   - **AP수학 오답관리** 섹션: `studioOptions.includeWrongCare`일 때만. 제목 "AP수학 오답관리", 본문 2문장 + 하단 흐름 띠(`REPORT_WRONGCARE_FLOW.join(' → ')`)를 작은 칩/텍스트로.
   - (기존 "다음 수업에서 이렇게 합니다" 섹션 제목을 **"다음 수업 복습 계획"** 으로 변경.)
2. 정화/ dirty 처리: 기존 `studioTexts`/`dirtyBlocks` 패턴 그대로. 신규 2블록도
   `dirtyBlocks.remediation ? studioTexts.remediation : reportCenterApplyEasyFinalLanguage(studioTexts.remediation)` 형태로 처리.
3. 흐름 띠 스타일은 기존 `.aprc-*` 클래스 톤에 맞춘 인라인/기존 클래스 재사용. 새 광고성 비주얼 금지(얇은 텍스트 띠 수준).
4. 표준형/상세형: 두 블록 모두 양쪽 ON(장수 제한 없음). 단 상세형에서만 remediation 끝에 근거를 덧붙이고 싶으면 **번호가 아니라** 기존 상세 분석표가 담당하므로 추가하지 않는다(분리 원칙 유지).
5. **[PDF 안정성 — 필수]** 신규 두 섹션은 한 문단·한 띠가 페이지 경계에서 쪼개지면 안 된다. 각 섹션에 전용 클래스(예: `aprc-pdf-remediation`, `aprc-pdf-wrongcare`)를 주고, **`@media print`의 `break-inside:avoid !important` 목록 두 곳에 모두 추가**한다:
   - `reportCenterPremiumReportStyle()` 내 `.aprc-pdf-parent-message, .aprc-pdf-score-grid, .aprc-pdf-point-grid, .aprc-pdf-parent-summary { break-inside:avoid … }` (≈505)
   - `reportCenterBuildCleanPdfShell()` 내 동일 성격 블록 (≈521~533)
   - 흐름 띠는 오답관리 본문과 같은 패널 안에 두어 함께 묶이게 한다(제목·문장·띠가 분리되지 않도록). 제목+첫 문단은 기존 `.aprc-section-title` break 규칙으로 이미 보호됨 — 신규 섹션도 `.aprc-section-title` 구조를 따른다.

**완료 기준:** 표준형/상세형 모두에서 보완 방향·오답관리 섹션이 복습 계획 위에 출력. 토글 OFF 시 해당 섹션 사라짐. **신규 섹션의 문단/흐름 띠가 페이지 경계에서 잘리지 않는다(한 섹션이 통째로 같은 페이지에).**
**회귀 가드:** 기존 섹션(요약/추이/문항분석/코멘트/의견/메시지) 위치·동작 유지. 상세형 문항별 분석표는 여전히 'detailed' + `includeQuestionAnalysis`에서만. **기존 break-inside 목록 항목 삭제 금지(추가만).**

### LOOP 4 — 테스트 확장

**목표:** 신규 블록을 회귀 스위트에 고정.

1. `tests/apmath-report-easy-language.test.js`의 `loadReportExports()` return에 **3개 모두** 추가:
   `reportCenterBuildRemediationText, reportCenterBuildWrongCareText, REPORT_WRONGCARE_FLOW`
2. 검사 추가(기존 `assertClean` 재사용):
   - 오답 有/無 양쪽에서 두 함수 결과가 금지어 0, 깨진 한국어 0, 비어있지 않음.
   - **remediation·wrongCare 둘 다** 숫자+"번" 패턴(`/\d+번/`)이 **없어야** 함.
   - wrongCare 결과 + `REPORT_WRONGCARE_FLOW.join(' → ')`가 금지어 0.
3. 가능하면 `tests/report-exam-trend.test.mjs`도 무회귀 확인(읽기만, 실패 시 원인 분리 기록).

**완료 기준:** `node tests/apmath-report-easy-language.test.js` 통과(그룹 수 증가). 기존 검사 전부 유지.

### LOOP 5 — 육안 검수 + 무회귀 확정

**목표:** 실제 출력 확인.

1. `tests/report-pdf-render-harness.js`가 있으면 활용해 표준형/상세형 1건씩 렌더 결과를 확인(오답 有/無 각각이면 더 좋음).
2. 체크리스트:
   - 보완 방향: 집계 문장, 번호 없음, 금지어 없음.
   - 오답관리: 2문장 + 흐름 띠, 광고처럼 안 보임, 내부 용어 없음.
   - 복습 계획: 라벨이 "다음 수업 복습 계획", 내용은 기존과 동일.
   - **[PDF 안정성 — 최우선 검수]** 신규 두 섹션이 페이지 경계에서 쪼개지지 않는지 실제 인쇄 미리보기로 확인. 문단 중간/흐름 띠가 다음 페이지로 넘어가면 **불합격** — `break-inside:avoid` 누락이므로 LOOP 3-5로 돌아가 수정.
   - 긴 dirty 입력(사용자가 길게 편집)·오답 다수 케이스에서도 섹션 단위로 안 잘리는지 확인(`blockLimit` 캡 동작 포함).
   - 표준형도 2장 넘어가도 무방(장수 제한 없음). 단 **섹션이 통째로 넘어가는 건 OK, 섹션 내부가 갈라지는 건 불가**.
   - 토글 ON/OFF, 편집 후 PDF 반영, 편집 취소 동작 정상.
3. 확인 못 한 항목은 `CODEX_RESULT.md` 미검증 섹션에 명시. **PDF page-break 검수 결과는 §13 자체 검수에 반드시 기록**(통과/케이스).

---

## 9. 검증 명령

```
node --check apmath/js/report-text.js
node --check apmath/js/report-center.js
node --check apmath/js/report-print.js
node tests/apmath-report-easy-language.test.js
node tests/report-exam-trend.test.mjs      # 존재 시, 무회귀 확인용
```

- `node --check` 3개로 문법 오류를 테스트 실행 전에 먼저 잡는다(JS 3파일 수정 작업).
- 두 테스트가 통과해야 한다. 실패 시 추정 금지 — 원인을 코드에서 확인하고 해결.
- 테스트 실행 외 `git`/deploy 명령 금지.

---

## 10. CODEX_RESULT.md 작성 기준

`docs/codex/CODEX_RESULT_RULE.md` 형식(1~14 섹션)을 그대로 따른다. 특히:

- 1. 생성/수정 파일: 실제 수정한 파일만.
- 3. 실행 결과: 위 검증 명령 출력 요약(통과/그룹 수).
- 8. 미검증: 육안 검수에서 확인 못 한 평가 종류/케이스.
- 10~12. master 문서 3종(`docs/MASTER_RULEBOOK.md`, `docs/MASTER_CURRENT_PROGRESS.md`, `docs/MASTER_NEXT_WORK.md`) 업데이트 판정과 사유를 명시. (이번 작업은 리포트 내부 확장이므로 RULEBOOK 변경은 통상 불필요 — 판정 근거를 적을 것.)
- 13. 자체 검수: §8 LOOP 5 체크리스트 결과.
- 검수요청서/외부감사 문서는 작성하지 않는다.

---

## 11. 한 줄 인수 메모

```
신규 산문 0. 기존 문구 재배치만. plan은 라벨만. 종류 분기 없음. 커밋 금지.
막히면 "기존 생성기에서 가져온다"로 돌아온다 — 그게 이 작업의 핵심 제약이다.
```
