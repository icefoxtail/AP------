# 리포트 센터 PDF 무중복 압축 + 리뷰 수정 — Codex Task 지시서 (루프)

작성일 2026-07-03 · 실행자: Codex Task · 브랜치: **`feat/report-center-redesign` 위에서 이어서** (이미 6 STEP 완료된 상태)

> 배경: 문항별 분석(문항 카드)이 리포트에 들어오면서, 학부모 리포트의 기존 프로즈가 **그 내용을 반복하는 잉여**가 됐다. 이번 라운드는 **PDF를 무중복으로 압축 재구성** + 직전 검수에서 나온 자잘한 수정.
> 사용자 확정 2대 원칙: **카드 중복 절대 금지 · 문구 중복 절대 금지.**

---

## 0. 루프 실행 규약

STEP = 독립 실행·검증·게이트 통과의 "루프 1회". **DoD 초록 전 다음 STEP 금지.**

**검수 정책 (중요):**
- **하위 에이전트로 검수하지 말 것.** Codex는 구현 + 자체 테스트까지만.
- 최종 검수는 **사람 쪽(Claude/Opus)이 나중에 직접** 한다. Codex는 검수/리뷰 에이전트 스폰 금지.

**공통 규약:**
- `main` 직접 커밋/푸시 금지. `feat/report-center-redesign`에 STEP마다 커밋. 커밋 말미 `Co-Authored-By: Codex <noreply@anthropic.com>`.
- **전 STEP 프론트(`apmath/js`)만.** 워커/D1 변경 없음. **함수 삭제 금지 — 안 쓰는 섹션은 렌더만 빼거나 고급 모드 뒤로.**
- 회귀 가드(항상 초록):
  ```
  node tests/report-exam-trend.test.mjs
  node tests/exam-question-review-card.test.mjs
  node tests/apmath-report-easy-language.test.js
  node tests/apmath-global-surface.test.js
  node tests/report-center-shell.test.mjs
  node tests/report-center-exam-hub.test.mjs
  node tests/report-center-exam-dashboard.test.mjs
  node tests/report-center-student-view.test.mjs
  node tests/report-center-advanced-policy.test.mjs
  ```
- 새 함수 추가 시 `node tests/apmath-global-surface.test.js --update` 후 **`tests/fixtures/apmath-surface-report.json`만** 바뀐 것 확인(classroom/dashboard 픽스처 건드리지 말 것).
- 문구 톤: AI식 모호어·과한 캐주얼 금지, 학부모 문구는 가정 지도 제안 금지·학원 책임 강조([[apmath-report-copy-voice]]). 페이지브레이크 준수([[apmath-report-pdf-page-break]]).

---

## 1. 목표 PDF 배치 (확정)

`reportCenterBuildCleanPdfDocument()` (report-print.js)의 기본(표준) 출력을 아래 **6블록**으로 압축한다.

```
1. 상단 스코어      점수 · 정답률 · 반/전체 평균 대비 (기존 시험 중심 카드. 추이 카드는 고급 전용 유지)
2. 한 줄 총평       2~3문장. 이번 시험 위치 + 오답이 몰린 지점. (짧게)
3. 오답 문항 분석    ★핵심★ 문항 카드 = [번호·단원·난도·정답률] · 함정 · 풀이 포인트
                    (표·코멘트·카드 3섹션을 이 하나로 통합. 문항은 딱 한 번 등장)
4. 오답 원인 한눈에  카드를 가로지르는 종합 1블록 (예: "조건→식 전환에서 주로 막힘"). 짧게.
5. 학원 조치        단원별 보강 계획 불릿 2~3개. (지도 포인트를 카드에서 빼서 여기 한 곳에만)
6. 학부모님께        2문장. 관계·책임만. 2·5 재서술 금지.
```

### 무중복 규칙 (2대 원칙 구현 — 반드시 준수)
- **카드 중복 금지**: 오답 문항은 **오직 3번 카드**에만. 기존 `문제별 분석(표)`·`문제별 코멘트` 섹션은 **렌더 제거**(표 정보는 카드가 포함). 같은 문항 번호가 서로 다른 섹션 타입에 두 번 나오면 안 된다.
- **문구 중복 금지**: "다시 풀이·보강" 성격의 계획 문장은 **5번(학원 조치)에만 1회**. 문항 카드에는 **함정 + 풀이 포인트만**(진단), **지도 포인트(teach)는 카드에서 빼서** 5번으로 모은다. → "보강하겠습니다"가 문항 수만큼 반복되는 것을 원천 차단.
- 6번 학부모 말씀은 2번 총평·5번 조치 문장을 **재사용/재서술 금지**(관계·신뢰 표현만).

### 현재 섹션 → 목표 매핑 (report-print.js 마커 기준)
- `aprc-pdf-parent-summary`(총평) → **2. 한 줄 총평** (짧게 유지/축약)
- `aprc-pdf-table-panel`(문제별 분석 표) → **제거**(카드로 통합)
- `aprc-pdf-review-panel`(문제별 분석 카드) → **3. 오답 문항 분석** (카드=함정+풀이, teach 제거)
- `aprc-pdf-qcomment-panel`(문제별 코멘트) → **제거**(카드로 통합)
- `aprc-pdf-point-grid`의 `다음에 꼭 짚어볼 부분`(weakness) + `aprc-pdf-remediation` → **4. 오답 원인 한눈에**(종합 1블록)
- `aprc-pdf-wrong-care`(오답관리) + `aprc-pdf-next-plan`(복습 계획) + `aprc-pdf-diagnosis`(종합 의견) + 카드에서 뺀 teach → **5. 학원 조치**(불릿 통합)
- `aprc-pdf-parent-message`(학부모님께) → **6.**(2문장으로 축약)
- `지금 어디쯤 있나요`(추이)·분포 그래프 → **고급 전용 유지**(기본 미노출).

> 삭제가 아니라 **렌더 통합**이다. 기존 텍스트 빌더(`reportCenterBuildRemediationText`·`WrongCareText`·`EasyPlanItems`·`InterpretiveDiagnosisLines`·`EasyWeaknessText`)는 **함수 보존**하되, 5·4블록을 만들 때 중복 없이 **합성 1회만** 사용한다(모두 나열 금지). 관련 studioOptions(`includeRemediation/WrongCare/TeacherOpinion`)는 고급 모드 전용으로 내리거나 4·5 합성에만 반영.

---

## STEP 1 — 무중복 압축 PDF 재구성 (핵심)

**목표**: 위 6블록 배치 + 2대 무중복 규칙을 `reportCenterBuildCleanPdfDocument`에 반영.

**대상 파일**
- `apmath/js/report-print.js`
- `tests/report-exam-trend.test.mjs` / `tests/apmath-report-easy-language.test.js` (기대 갱신)
- `tests/report-pdf-dedup.test.mjs` (신규 — 무중복 가드)
- `tests/fixtures/apmath-surface-report.json` (--update, 새 함수 추가 시)

**작업**
1. 섹션 순서/게이트를 6블록으로 재배치. `문제별 분석(표)`·`문제별 코멘트` 섹션 렌더 제거(코드/함수는 보존, 호출만 제외 or 고급 게이트).
2. 문항 카드 호출 시 **teach(지도 포인트) 숨김** 옵션 사용(STEP 2에서 카드 옵션 추가분 사용). 카드 = 함정 + 풀이 포인트 + 헤더(번호·단원·난도·정답률).
3. **4. 오답 원인 한눈에**: weakness+remediation을 합성한 짧은 1블록 헬퍼(신규 `reportCenterBuildWrongCauseSummary(data)` 등) — 문항별 반복 아닌 패턴 종합.
4. **5. 학원 조치**: wrongCare+plan+diagnosis+카드에서 뺀 단원별 teach를 합성한 불릿 2~3개 헬퍼(신규 `reportCenterBuildActionPlan(data)` 등). "다시 풀이·보강" 문장은 여기 1회.
5. **6. 학부모님께**: 2문장으로 축약(관계·책임). 2·5 문장 재사용 금지.
6. 추이/분포는 고급 전용 유지.

**검증**
```
node tests/report-pdf-dedup.test.mjs
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
```
**dedup 테스트가 assert할 것 (핵심)**
- 오답 있는 표준 리포트에서 **문항 카드 섹션(`aprc-pdf-review-panel`)이 기본 렌더**되고, `aprc-pdf-table-panel`·`aprc-pdf-qcomment-panel`은 **미렌더**(문항 3중복 제거).
- 특정 오답 문항 번호(예: `19번`)가 **PDF 전체에서 카드 영역 밖에 중복 등장하지 않음**.
- "다시 풀이" 성격 계획 문장이 **PDF 전체에서 1회만** 등장(문항 수만큼 반복 아님). teach 문구가 카드마다 반복되지 않음.
- 6블록이 목표 순서로 존재. 만점(오답 0)은 3·4·5가 적절히 생략/대체.
- 문구 금지어 0.

**DoD**: 위 4개 초록 + 회귀 전체 초록. 육안 덤프(`node -e`)로 6블록·무중복 확인.

---

## STEP 2 — 문항 카드: 지도 포인트 옵션화

**목표**: `reportCenterBuildQuestionReviewCard`가 리포트 문맥에서 **teach(지도 포인트)를 숨길 수 있게** 옵션 추가(익명 모드는 이미 숨김 — 동일 메커니즘 확장). STEP 1이 이 옵션을 사용.

**대상 파일**
- `apmath/js/report-print.js`
- `tests/exam-question-review-card.test.mjs` (케이스 추가)

**작업**
1. 카드 opts에 `showTeach`(기본 true, 익명 시 false 유지) 또는 `hideTeach` 추가. 리포트 기본 카드는 `showTeach:false`로 호출(teach는 5번 블록으로 이동).
2. teach를 숨겨도 함정·풀이 포인트는 정상.

**검증**
```
node tests/exam-question-review-card.test.mjs
node tests/apmath-global-surface.test.js
```
**assert**: `showTeach:false`면 카드에 지도 포인트 미노출, 함정·풀이 포인트는 노출. 기본/익명 동작 회귀 없음.

**DoD**: 위 초록 + 회귀 초록.

---

## STEP 3 — 검수 수정: 고급 모드 전역 리셋 제거

**목표**: 학생 상세 → 리포트 진입이 사용자의 고급 모드 선호를 **localStorage째 끄는** 부작용 제거([report-center.js:1663](apmath/js/report-center.js:1663) `reportCenterSetAdvancedMode(false)`).

**대상 파일**: `apmath/js/report-center.js`, `tests/report-center-student-view.test.mjs`(보강)

**작업**
- `reportCenterOpenStudentDrilldown`에서 전역 `reportCenterSetAdvancedMode(false)` 호출 제거. 드릴다운을 보이려면 **전역 선호를 바꾸지 말고**, 진입 시 nav만 세팅하고 렌더 분기가 기본(비고급) 경로를 타게 하거나, "이번 오픈만 드릴다운" 1회성 플래그를 쓴다. 고급 모드를 켜둔 사용자의 선호가 보존돼야 한다.

**검증/DoD**: `node tests/report-center-student-view.test.mjs` + 회귀 초록. 고급 on 상태에서 학생 상세 진입 후에도 고급 선호가 유지됨을 테스트로 assert.

---

## STEP 4 — 검수 수정: 드릴다운 셸 헤더 정리 + CODEX_RESULT 정리

**목표**: (a) 드릴다운 셸이 레벨과 무관하게 "시험지 목록" 섹션으로 bodyHtml을 감싸는 문제([report-center.js:1685](apmath/js/report-center.js:1685)) 정리 — L0에서만 목록 헤더, L1/L2는 각자 헤더/back만. (b) `CODEX_RESULT.md`의 **다른 작업(오답 클리닉) 잔재 섹션 1~14 제거**하고 이 리포트 센터 개편 내용만 남김.

**대상 파일**: `apmath/js/report-center.js`, `CODEX_RESULT.md`

**작업**
1. `reportCenterBuildDrilldownShell`이 `nav.level==='list'`일 때만 "시험지 목록/시험지 찾기" 프레임을 두고, `exam`/`student`는 bodyHtml(자체 헤더·back 보유)만 렌더. 셸 헤더의 학생명이 드릴다운 대상과 어긋나지 않게 정리.
2. `CODEX_RESULT.md`를 이번 개편(리포트 센터 재정렬 + PDF 압축) 기준으로 재작성. 클리닉 관련 섹션 제거.

**검증/DoD**: 회귀 전체 초록. 셸 렌더 육안 확인(L0/L1/L2 헤더 일관). CODEX_RESULT에 clinic 잔재 없음.

---

## 부록 A — 절대 하지 말 것
- 함수/텍스트 빌더 **삭제 금지**(렌더 통합/게이팅만). STEP당 [대상 파일] 밖 수정 금지. 워커/D1 변경 금지.
- 하위 에이전트 검수 스폰 금지. `main` 직접 커밋/푸시 금지. 회귀 빨간 채로 다음 STEP 금지.
- global-surface 픽스처는 report만 `--update`.

## 부록 B — 사후 검수(사람이 함)
Claude가 직접: (1)표준 PDF가 6블록·무중복(문항 1회·계획 문장 1회)인지 (2)teach가 카드 밖 5번에만 있는지 (3)고급 선호가 학생 진입에도 보존되는지 (4)셸 헤더 L0/L1/L2 일관 (5)회귀·표면 스냅샷 (6)삭제된 함수 없음 (7)CODEX_RESULT 정리 확인.
