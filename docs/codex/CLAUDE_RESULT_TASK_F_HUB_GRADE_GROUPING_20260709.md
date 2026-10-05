# CLAUDE RESULT — Task F (시험지 목록 최근 1개월 학년 그룹 + 과거 검색 + 심플 카드)

작성일: 2026-07-09
구현: Claude / 검수 요청 대상: Codex
지시서: `docs/codex/CODEX_TASK_REPORT_CENTER_ENTRY_AVG_UX_20260709.md` 의 Task F
설계 근거: 목업 v2(원장 확정) — 최근 1개월 학년 그룹, 상태 배지 제거, 심플 카드, 응시=학원 전체, 과거 검색.

## 1. 구현 요약

- 기본 화면 = **최근 30일 시험지만** 학년별 섹션(`중1→고3→미지정`). 학년 필터 칩(개수 포함)으로 즉시 좁히기. `최근 1개월` 배지 + `1개월 이전 시험지 N개는 검색으로` 안내.
- 카드 **심플화 + 상태 배지 제거**: `문항분석 / 오답입력 / 반` 칩 삭제. 카드 = `시험명` + `학교 · 날짜 · 응시 N` + `›`. 학년은 헤더로 이동.
- **응시 N = 학원 전체**: `reportCenterGetGroupCohortSummary(group).gradeExamCount`(코호트) 우선, 없으면 담당 학생 로컬 수 fallback. `title` 툴팁으로 스코프 표기(`학원 전체 응시 인원` / `담당 학생 응시 인원`).
- **과거 검색**: 키워드(학교·시험명) + 연도 + 월. 검색 시 30일 제한 해제, 전체 이력 대상, 결과는 **연/월 그룹**(학년 롤오버 오표기 회피). `검색 결과 N개` + `검색 초기화`.

## 2. 변경 파일

- `apmath/js/report-center.js`
  - `reportCenterBuildExamHubList`: 그룹에 `sessions[]` 노출(코호트 응시수·검색·날짜필터용).
  - 신규: `reportCenterGradeRank`, `reportCenterHubSearchState`, `reportCenterSetHubSearch`, `reportCenterClearHubSearch`, `reportCenterGetHubTakerCount`, `reportCenterRenderExamHubCard`, `reportCenterRenderExamHubSection`.
  - `reportCenterRenderExamHubList` 전면 재작성(최근-그룹 / 검색-결과 분기). 상태는 `window.AP_REPORT_HUB_SEARCH = { keyword, year, month, grade }`, 변경 시 `openReportCenterRefresh()`로 드릴다운 재렌더.
- `tests/report-center-hub-grade-grouping.test.mjs` 신규(회귀).
- `tests/fixtures/apmath-surface-report.json`: `node tests/apmath-global-surface.test.js --update`로 신규 전역 함수만 반영(다른 fixture 변경 없음 확인).

## 3. 검증

PASS:

```bash
node --check apmath/js/report-center.js
node tests/report-center-hub-grade-grouping.test.mjs
node tests/report-center-shell.test.mjs
node tests/report-center-inline-report-entry.test.mjs
node tests/apmath-report-center-unified-entry.test.mjs
node tests/report-center-student-view.test.mjs
node tests/report-school-exam-counsel.test.mjs
node tests/report-center-advanced-policy.test.mjs
node tests/apmath-global-surface.test.js
node tests/apmath-onclick-defined.test.js
```

- `node tools/run-tests.js` → `PASS 88 / FAIL 6 / total 94`. 실패 6개는 stash baseline과 동일한 기존 실패(archive/assessment/classroom/worker/student-portal). 이번 변경과 무관.
- run-tests.js는 `.test.js`만 수집(도구 20-21행)하므로 리포트센터 `.mjs` 테스트는 개별 실행이 이 저장소 관행. 신규 테스트도 `.mjs`로 동일 규칙.

## 4. 검수 요청 포인트 (Codex)

- 응시 수 학원 전체화가 `report_exam_cohort_stats` 존재에 의존(Task C 데이터 검증에 종속). 코호트 없을 때 로컬 fallback이 "학원 전체"가 아님 — 라벨/툴팁 처리가 오해 없는지 확인.
- 키워드 입력은 `onchange`(Enter/blur)로 재렌더 → 값은 상태에서 복원. 각 키 입력마다 재렌더하지 않아 포커스 유지. UX 적정성 확인.
- 검색 결과 연/월 그룹핑에서 `latestDate`가 archive 그룹 대표 날짜인 점(같은 시험지가 여러 날짜면 대표 1개) — 실데이터에서 문제 없는지.
- 30일 경계(`>= cutoff`, 문자열 날짜 비교) 및 `latestDate` 공백 시 과거로 분류되는 처리.

## 5. 2차 검수(Codex) 반영

- **P1 — 날짜 fallback 버그 수정**: `reportCenterBuildExamHubList`의 `latestDate` 갱신이 최초 row에서만 `exam_date || created_at`을 쓰고 갱신 시엔 `exam_date`만 봤다. 세션별 `const sessionDate = session.exam_date || session.created_at || ''`로 통일해 init·update 모두 `sessionDate` 기준으로 갱신(`report-center.js:1969` 부근). 같은 archive에 `exam_date` 없이 `created_at`만 최신인 세션이 있어도 최근 1개월/연월 검색/정렬이 맞는다.
- **P2 — 기존 허브 테스트 갱신**: `tests/report-center-exam-hub.test.mjs`가 삭제된 구형 칩(`문항분석/오답입력`)·`aprc-exam-card` 클래스를 기대해 FAIL이었다. 데이터층 단언(build-list)은 유지하고, 렌더 단언을 새 UX 계약으로 교체(옛 날짜 데이터는 30일 밖이라 기본 화면에서 아카이브로 빠짐 → `최근 1개월` 배지·`1개월 이전 시험지 2개`·구형 칩 부재 검증). 최근/검색/코호트 카드 렌더는 `report-center-hub-grade-grouping.test.mjs`가 담당.
  - 1차 보고서에서 이 테스트를 실행하지 않고 "리포트센터 테스트 10종 PASS"로 적은 것은 보고 누락이었다. 정정한다.
- **P1 회귀 테스트 추가**: `report-center-hub-grade-grouping.test.mjs`에 "옛 exam_date + 최신 created_at 혼재" 케이스 추가. 수정 되돌리면 FAIL, 적용 시 PASS로 버그를 실제로 포착함을 확인.

## 6. 재검증 (전체)

PASS(개별 실행): `report-center-exam-hub`, `report-center-hub-grade-grouping`, `report-center-shell`, `report-center-inline-report-entry`, `apmath-report-center-unified-entry`, `report-center-student-view`, `report-school-exam-counsel`, `report-center-advanced-policy` (이상 `.mjs`), `apmath-global-surface`, `apmath-onclick-defined` (`.js`), `node --check apmath/js/report-center.js`.

`node tools/run-tests.js` → `PASS 88 / FAIL 6 / total 94`. 실패 6개는 baseline 동일 기존 실패(이번 변경 무관). run-tests.js는 `.test.js`만 수집하므로 리포트센터 `.mjs`는 개별 실행이 관행.

## 7. 미검증

REAL BROWSER E2E: NOT VERIFIED
Reason: apmath는 워커+인증+실데이터가 필요해 로컬 프리뷰로 클릭 플로우/코호트 응답 확인 불가(이전 라운드와 동일). Node/VM 회귀로 대체.
