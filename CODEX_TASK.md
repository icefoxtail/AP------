# 평가 리포트 — 중복 문장 제거 + 다회차 추이(원내평가) 리포트 작업 지시서

형님 지시:
- 평가 리포트가 **같은 말을 여러 섹션에서 반복**한다. 섹션 역할을 분리해 중복을 없앤다.
- 현재 리포트는 **1회 시험 중심**이다. 원내평가처럼 **여러 번 본 시험의 추이(예: 5회)**, 상승/하강, 최종 평가 점수 해석까지 리포트에 들어가게 한다.

실행: Codex / 검수: Claude

> 이 지시서는 Claude + GPT(코덱스) 두 분석을 병합한 통합 플랜이다. 단계(P1~P4)별로 끊어서 진행하고, 각 단계는 독립 커밋 가능하도록 작성한다. P5(리포트 타입 셀렉터)는 본 작업 범위에서 제외(후속).

---

## 1. 목적

1. **중복 제거(P1)** — 평가 리포트의 섹션별 역할을 강제 분리해 같은 문항 번호·같은 "풀이 흐름 확인" 문장이 여러 섹션에 반복되지 않게 한다.
2. **다회차 추이 데이터(P2)** — 학생의 최근 N회 시험을 묶어 추이/약점추이/최종평가 구조를 만드는 순수 데이터 빌더를 추가한다.
3. **PDF UI 고도화(P3)** — PDF 평가 리포트에 inline SVG 추이 그래프 + 카드 재구성 + 반복 약점 표를 넣는다.
4. **AI 입력 확장(P4)** — AI payload/schema에 추이·약점추이·최종세션 필드를 추가하고 프롬프트 기준을 보강한다.

새 DB 스키마는 만들지 않는다. 기존 `state.db.exam_sessions` + 스냅샷 구조를 재사용한다.

---

## 2. 전제 / 확인된 사실 (현재 코드 기준)

리포트 로직은 전부 `apmath/js/report.js` 단일 파일에 있다.

**중복이 발생하는 두 표면:**

- **(A) 레거시 텍스트/카카오 경로**
  - `buildExamSummary(ctx)` (244행) — "「시험」에서 N점… {오답}번 문항은 다음 수업에서 풀이 흐름을 함께 확인" 생성
  - `buildNextPoint(ctx)` (262행) — "{오답}번 문항 풀이 흐름 확인" 생성 (위와 같은 말)
  - `buildParentReportText(ctx)` (325행) — 위 둘을 한 문구에 함께 붙임
- **(B) PDF 문서 경로** `reportCenterBuildCleanPdfDocument()` (3085행)
  - `parentSummaryText` (3115행) = `meaningItems.slice(0,2).join(' ')` → "이번 시험, 이렇게 봤습니다"
  - `coreItems[1].text` (3112행) = `meaningItems[1]` → "다음에 꼭 짚어볼 부분"
  - `meaningItems[1]` (3010행) = "11번, 14번 … 보완 방향을 잡을 수 있습니다" → **요약 꼬리와 글자 단위로 동일**
  - `currentPositionText` (3041행)과 요약이 둘 다 "○○ 학생은 이번 평가에서 N점… 정답률 N%"로 시작 → 도입부 반복
  - 약한 중복: `reportCenterBuildShortReportSummaryItems`(2847행) / `reportCenterBuildInterpretiveDiagnosisLines`(2886행) / `reportCenterBuildNextPlanItems`(2942행) 가 모두 "조건 표시·풀이 순서·유사 문제·검산" 쪽으로 몰려 있음

**섹션 제목 최종 치환은 `reportCenterPolishCleanPdfDocumentHtml()` (3242행)** 에서 일어남:
"이번 시험, 이렇게 봤습니다 / 지금 어디쯤 있나요 / 다음에 꼭 짚어볼 부분 / 다음 수업에서 이렇게 합니다 / 문항별 분석 / 선생님 종합 의견" + 상단 5카드(이번 점수/맞힌 문항/전체 평균/우리 반 평균/최근 3회 평균).

**추이 확장 기반(이미 존재):**
- `getRecentAverage(studentId, limit)` (10행) — `state.db.exam_sessions`를 student_id 필터·날짜 정렬해 평균 계산
- `reportCenterGetExamReportData(studentId, sessionId)` (2477행) — sessionId 없으면 최신 1개 선택. `sessions`(전체 목록)도 함께 반환
- 스냅샷 저장 시 최근 시험 **최대 10개** 보존 구조 (560행 `slice(0, 10)`)
- 카드형 리포트 `showParentReportModal()` (4274행)에는 이미 `trendScores` 기반 막대 추이 + "지난 시험 대비 ±N점" 배지가 있음 (4279~4305행) → **그래프 로직의 참고/공용화 대상**

---

## 3. 절대 금지

```text
- git add / git commit / git push / deploy 금지. (작업 트리 변경까지만)
- 새 DB 스키마/마이그레이션 생성 금지. exam_sessions 등 데이터 row 변경 금지(읽기 전용).
- P5(단일/누적/기간/원내평가 묶음 리포트 타입 셀렉터) 구현 금지 — 본 작업 범위 밖.
- 기존 단일-시험 리포트가 깨지지 않아야 한다(회차 1개 학생, 회차 0개 학생 모두 동작).
```

### 변경 허용 파일 (이 목록 외 전부 변경 금지)

```text
변경 허용:
- apmath/js/report.js            (P1~P4 본체)
- tests/report-exam-trend.test.mjs  (신규 테스트, 선택)
- CODEX_RESULT.md               (결과 기록, 신규/수정)

그 외 파일 변경 금지.
(P4에서 proxy/worker schema 변경이 필요해지면 직접 고치지 말고 CODEX_RESULT.md에 후속 작업으로 남긴다 — §5 P4 참조.)
- EIE / 일정관리(schedule) / 대시보드 등 타 도메인 파일 변경 금지.
```

> **행 번호 주의:** 이 지시서의 244행·3085행 등 숫자는 작성 시점 기준 **참고용**이다. 실제 수정 위치는 항상 **함수명 기준**으로 찾는다(작업 중 파일이 바뀌면 행 번호가 틀어진다).

---

## 4. 섹션 역할 재정의 (P1·P3 공통 기준)

각 섹션은 **단독 역할**만 갖는다. 소스를 서로 겹치지 않게 분리한다.

| 섹션 제목 | 단독 역할 | 데이터 소스 |
|---|---|---|
| 이번 시험, 이렇게 봤습니다 | **이번 1회 결과만** — 점수, 정답률, 평균 대비 위치, 오답 개수 | 선택된 단일 세션 |
| 지금 어디쯤 있나요 | **추이만** — 최근 N회 점수 흐름, 상승/하강/유지, 최고·최저 | `examTrend` (P2) |
| 다음에 꼭 짚어볼 부분 | **약점만** — 반복 오답 단원, 반복 실수 유형, 최종 평가 우선 문항 | `weaknessTrend` (P2) |
| 다음 수업에서 이렇게 합니다 | **실행 계획만** — 재풀이 → 유사문항 → 검산 → 오답노트 순서 | `nextPlan` |

점수/정답률 **사실 진술**은 상단 카드에서만 1차로 노출하고, 산문 섹션에서는 중복 서술하지 않는다.

---

## 5. 허용 작업 범위

### P1 — 중복 제거 (즉시, 저위험, 데이터 변경 0)

1. **PDF 경로 소스 분리** (`reportCenterBuildCleanPdfDocument` 3110~3118행)
   - "이번 시험, 이렇게 봤습니다"(`parentSummaryText`)는 **이번 1회 결과 요약**만 담는다(문항 번호 나열 금지).
   - "다음에 꼭 짚어볼 부분"(`coreItems[1]`)은 **약점/우선 문항**만 담는다.
   - 두 슬롯이 같은 문장을 갖지 않도록 **fallback 중복 가드** 추가. 단순 `===` 비교가 아니라 공백/문장부호/중복 조사 차이를 정규화한 뒤 비교한다. 아래 헬퍼를 신규로 둔다:
     ```js
     function reportCenterNormalizeSentenceForCompare(value) { /* 공백·문장부호·조사 정규화 */ }
     function reportCenterIsDuplicateText(a, b) { /* 정규화 후 동등 비교 */ }
     function reportCenterPickNonDuplicateText(primary, fallback, previousTexts) { /* 중복이면 fallback 선택 */ }
     ```
2. **레거시 텍스트 경로 분리** (`buildExamSummary` 244 / `buildNextPoint` 262 / `buildParentReportText` 325)
   - `buildExamSummary`는 이번 결과 요약, `buildNextPoint`는 다음 행동만. 같은 "{오답}번 문항 풀이 흐름 확인" 문장이 한 문구 안에서 2회 반복되지 않게 한다.
3. **프리미엄 요약 문구 중첩 해소** — `reportCenterBuildShortReportSummaryItems` / `reportCenterBuildInterpretiveDiagnosisLines` / `reportCenterBuildNextPlanItems` 의 기본 문구가 4번 섹션 표의 역할 경계를 넘지 않도록 조정.
4. 점수/정답률 사실 진술을 산문에서 제거(카드 단독).

> P1만으로도 형님이 지적한 "같은 말 두 번"은 해소되어야 한다. P2 이전에 단독 검수 가능.

### P2 — 다회차 추이 데이터 빌더 (순수 함수)

신규 함수 `reportCenterGetExamTrendData(studentId, options)` 추가. 순수 계산(부수효과 없음), `state.db.exam_sessions` 읽기 전용.

```js
{
  selectedSessions: [
    { id, date, title, score, questionCount, wrongCount, correctRate, overallAvg, classAvg }
  ],
  trend: {
    firstScore, latestScore, scoreDelta,
    direction,        // 'up' | 'down' | 'flat' | 'mixed'
    bestScore, worstScore, averageScore, recentAverage
  },
  weaknessTrend: [
    { unitKey, unit, wrongCount, appearedInSessions, lastSeenDate, resolved }
  ],
  finalSession: { /* 최종(최신) 세션 요약 */ },
  finalEvaluation: { scorePosition, trendComment, nextPlan }
}
```

- `options.limit` 기본 5(최근 5회). 회차 < 2면 `direction='flat'`, 그래프 비활성 신호 반환.
- **정렬/필터 공용화(회귀 방지):** 신규 공용 함수 `reportCenterGetSortedStudentExamSessions(studentId)`를 추가하고, `getRecentAverage`도 **내부만** 이 함수를 쓰도록 정리한다. `getRecentAverage`의 반환값/시그니처/동작은 바꾸지 않는다(평균만 반환 유지). `reportCenterGetExamTrendData`도 이 공용 함수를 사용한다.
- `selectedSessions` 각 항목의 `overallAvg`/`classAvg`는 **해당 세션과 동일 평가로 묶이는 cohort 기준**으로 계산한다(현재 시험 1회만이 아니라 과거 각 시험별로). 계산 불가 시 `null`로 둔다.
- `weaknessTrend`는 선택 세션들의 오답 단원 빈도 누적으로 산출. `resolved`는 최신 세션에서 더 이상 오답이 아닌 단원.

### P3 — PDF UI 고도화

1. **inline SVG 추이 그래프** 헬퍼 신규(예: `reportCenterBuildTrendSvg(trend, selectedSessions)`).
   - `<canvas>` 금지(인쇄/PDF 변환 깨짐 위험). 순수 SVG.
   - X=회차/날짜, Y=점수. 실선=학생 점수, 점선=전체 평균, 보조선=반 평균. 최종 점 강조 + 상승/하강 화살표.
   - 평균값(`overallAvg`/`classAvg`)이 `null`인 세션이 섞일 수 있다 → 해당 **평균선만 생략**(그래프 자체는 그림). 학생 점수 실선은 항상 그린다.
   - **PDF·카드형은 동일한 추이 데이터 빌더(`reportCenterGetExamTrendData`)를 공유**한다. SVG 렌더 헬퍼는 **PDF 전용**으로 우선 적용한다. 카드형 `showParentReportModal`(현재 막대 추이 4279~4295행)은 **기존 UI를 깨지 않는 범위**에서 동일 데이터 빌더만 참조하도록 조정한다(막대→SVG 강제 교체 금지).
2. **"지금 어디쯤 있나요" 섹션에 그래프 + 추이 요약 한 줄** 삽입(섹션 역할 표 기준).
3. **상단 카드 재구성**(3247행 `scoreGridHtml`): 최근 평가 점수 / 최근 N회 평균 / 첫→최근 / 최고·최저 / 상승·하강 상태.
4. **반복 약점 표** 추가(`weaknessTrend` 기반).
5. `reportCenterPolishCleanPdfDocumentHtml`에 신규 섹션 제목 보정 라인 추가.
6. 회차 1개: "첫 평가 기록입니다" 처리(4282행 패턴 재사용). 회차 0개: 기존 빈 박스 유지.

### P4 — AI 입력 확장 (범위 제한: report.js payload까지만)

> **주의:** AI schema는 `apmath/js/report.js` 한 곳이 아니라 **3곳**에서 `required`로 강제된다 —
> `report-ai-proxy/api/report-analysis.js`(`REQUIRED_FIELDS`/`validateAnalysisShape`), `apmath/worker-backup/worker/routes/reports-ai.js`(schema `required`), 그리고 frontend.
> 새 필드를 `required`로 넣으면 proxy/worker 검증이 깨진다. 따라서 이번 작업은 아래로 제한한다.

- **report.js의 AI payload 확장까지만** 수행: payload에 `selectedSessions`, `examTrend`, `weaknessTrend`, `finalSession` 추가.
- 새 응답 필드(`trendSummary`, `trendDiagnosis`, `finalExamComment`, `recurringWeaknesses`, `longitudinalPlan`)는 **선택(optional)** 으로만 소비한다. 기존 schema/응답과 **호환**되어야 하며, frontend fallback은 **기존 필드만으로도** 정상 동작해야 한다.
- 프롬프트 기준(가능한 범위 내) 보강: "최근 여러 시험의 점수 흐름을 **먼저** 해석하고, 최종 평가의 문항 분석은 **마지막에** 연결한다."
- **proxy/worker schema 변경은 본 작업에서 하지 않는다.** 새 필드를 `required`로 승격하거나 proxy/worker 검증을 바꿔야 하는 부분은 **범위 초과**로 `CODEX_RESULT.md` 후속 작업에 기록한다.
- AI 응답이 없을 때 P1~P3의 fallback 문구가 그대로 동작해야 한다(AI는 다듬기 역할).

---

## 6. 검수 기준 (Claude 검수)

- [ ] **(핵심 FAIL 룰)** 같은 문항 번호 + 같은 "풀이 흐름 확인" 문장이 서로 다른 섹션에 반복되면 FAIL.
- [ ] 중복 가드는 단순 `===`가 아니라 **공백/문장부호/중복 조사 차이를 정규화한 뒤** 비교한다.
- [ ] AI 분석 **없는** 학생 리포트에서 "다음에 꼭 짚어볼 부분"이 "이번 시험 요약" 꼬리와 글자 단위로 다르다.
- [ ] "N점 / 정답률 N%" 사실 문구가 산문 섹션에 반복되지 않는다(카드 제외).
- [ ] 회차 2개 이상 학생: 추이 SVG 그래프 + 상승/하강 + 최종 평가 점수 해석이 노출된다.
- [ ] 회차 1개 학생: "첫 평가 기록" 처리. 회차 0개: 기존 빈 박스 유지(에러 없음).
- [ ] 카드형(`showParentReportModal`)과 PDF가 **동일한 추이 데이터 빌더(`reportCenterGetExamTrendData`)** 를 사용한다. 렌더링 방식은 카드형 기존 UI를 보존할 수 있다(SVG는 PDF 전용).
- [ ] `getRecentAverage`의 반환값/동작이 바뀌지 않는다(내부 정렬만 공용 함수로 정리).
- [ ] `reportCenterGetExamTrendData`는 순수 함수이며 `exam_sessions`를 변경하지 않는다.
- [ ] P4 새 AI 필드는 optional이며, proxy/worker schema는 변경하지 않는다(필요 시 후속으로 기록).
- [ ] 기존 단일-시험 리포트 출력이 깨지지 않는다(회귀 없음).
- [ ] 가능하면 `reportCenterGetExamTrendData` / 추이 방향 계산 / 중복 가드에 대한 테스트를 `tests/`에 추가.

---

## 7. 산출물

- 변경: `apmath/js/report.js` (P1~P4)
- 신규(선택): `tests/report-exam-trend.test.mjs` 등 추이/중복가드 테스트
- `CODEX_RESULT.md` — 변경 파일·구현 요약·검수 결과·후속 조치(P5 등) 기록

배포·커밋은 저장소 규칙대로 실행하지 않고 CODEX_RESULT 다음 조치로만 남긴다.

---

## 8. 구현 우선순위 (이대로 순서대로)

```text
1. P1 중복 제거를 먼저 끝내고, 기존 단일 평가 리포트가 동일하게 열리는지 확인한다.
2. P2 순수 데이터 빌더를 추가한다. getRecentAverage의 반환값/동작은 바꾸지 않는다(내부 정렬만 공용 함수로 정리).
3. P3 PDF UI에만 SVG 추이 그래프와 반복 약점 표를 넣는다. 카드형은 동일 데이터 빌더만 참조하고 기존 UI를 깨지 않는다.
4. P4는 report.js payload 확장까지 우선한다. proxy/worker schema 변경이 필요하면 범위 초과로 CODEX_RESULT.md 후속 작업에 기록한다.
5. 모든 행 번호는 참고용이며 함수명 기준으로 위치를 찾는다.
6. 작업 후 CODEX_RESULT.md에 변경 파일, 미변경 파일, P1~P4 완료 여부, 회귀 검수 결과, 후속 P5를 명시한다.
```

> 이번 작업의 핵심은 **P1~P3**이다. 이 셋만으로 "중복 제거 + 다회차 추이 + 그래프 + 최종 평가 해석"은 모두 구현된다. P4는 frontend payload 확장까지만 수행하고, proxy/worker schema가 필요하면 후속으로 남긴다.
