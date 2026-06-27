# AP------ 코드 리뷰 후속 — 개선점 갱신 (2026-06-27)

- 작성일: 2026-06-27
- 선행 문서: `docs/reports/ap-code-review-improvements-20260612.md` (전체 33항목)
- 성격: 위 문서의 **현황 델타 + 신규 발견**. 33항목을 다시 나열하지 않고, (A) 지난 2주 변화 (B) 새로 확인된 개선점만 정리.
- 검증 범위(정직 고지): 리포트(`apmath/js/report.js`) 경로는 직접 깊게 검토함. 보안·워커 항목은 *현황 확인(파일 추적/존재 여부) 수준*이며 새 정밀 감사가 아님 — 정밀 보안 재감사는 별도 권장.

---

## A. 기존 33항목 현황 델타 (2026-06-12 → 06-27)

| 항목 | 상태 | 근거 |
|---|---|---|
| #1 PII 파일 git 커밋 | ✅ **해결** | `initial_teacher1.json`/`initial_admin.json` 더 이상 추적 안 됨 |
| #15 모놀리식 파일 분할 | 🟠 **부분 + 일부 악화** | classroom/dashboard/student는 분할됨(`docs/reports/apmath-phase1-*-split-result.md`). 그러나 **report.js 4,040→6,088줄**, timetable.js 3,628→4,032, eie-timetable 5,049→5,800, archive/db.js 5,176→7,728 로 **오히려 증가**. report.js 분할(REFACTORING PR-1b) 미실행 |
| #33 테스트/CI 부재 | ✅ **대폭 개선** | `tests/*.test.js` 96개 + `.github/workflows/ci.yml` 도입. surface/onclick 가드 테스트 운영 중 |
| #5 `new Function()` 외부 데이터 실행 | 🔴 **잔존** | `apmath/js/core.js:1637,1647,1663`, `apmath/js/qr-omr.js:75` 여전 |
| #28 대용량 생성물 git 포함 | 🟠 **잔존** | `xlsx.full.min.js`, `assessment-*.generated.js` 여전 추적 |
| #29/#30 위생(임시/백업) | 🟠 **부분 잔존** | `CODEX_RESULT*.md`, `apmath/worker-backup/` 여전 추적 |
| #32 루트 README/구조 문서 | 🔴 **미해결** | 루트 README 없음 |

> 나머지 보안 항목(#2~#4,#6~#8 등)은 이번에 정밀 재확인하지 않았다. 우선순위는 선행 문서 기준 유지.

---

## B. 신규·심화 발견

### 🟠 N1. report.js 비대화 가속 — 분할 시급도 상승
- **위치**: `apmath/js/report.js` (**6,088줄**, 저장소 최대 단일 JS 중 하나)
- **문제**: 선행 #15에서 4,040줄로 지목됐는데 2주 만에 +2,000줄. 리포트 센터 + PDF 빌더 + 스튜디오 + 텍스트 생성 + 문구 bank가 한 파일에 혼재. 수정 영향 범위 파악·충돌 비용이 계속 증가.
- **개선**: REFACTORING_MASTER_PLAN PR-1b(report-text / report-center / report-print 3분할)를 **순수 이동 + surface 가드**로 실행. 이미 surface/onclick 가드가 있으니 안전 절차는 갖춰짐.

### 🟡 N2. 리포트 문구 — '생성 후 정규식 후처리' 패턴의 잠재 위험
- **위치**: `reportCenterApplyEasyFinalLanguage`, `reportHumanizeApplyApMathTone`
- **배경**: 과거 부분 어간 치환(`보완→다시 볼 부분`, `문항→문제`)이 "보완하겠습니다→다시 볼 부분하겠습니다", "문제은" 같은 **문장 파괴**를 유발 → 2026-06-27에 안전 필터(AI식 모호어만 whole-phrase 치환)로 교체 완료.
- **남은 권장**: 정규식 후처리는 원칙적으로 문장을 깨뜨릴 수 있으므로, 신규 문구는 **확정 문구 bank(`REPORT_COPY_BANK`) + 슬롯 채움**을 우선하고 정규식 치환을 늘리지 말 것.

### 🟡 N3. 문구 톤 방향 전환 잔재 — 네이밍/문서 불일치
- **위치**: `reportCenterBuildEasy*`(함수명), `tests/apmath-report-easy-language.test.js`(파일명), `docs/report-copy-final.md`
- **문제**: '쉬운말' 전면 적용을 폐기하고 전문체로 전환(2026-06-27)했으나, 함수·파일·문서 이름에 'Easy/쉬운말'이 남아 오해 소지. (코드엔 명확화 주석, 문서엔 전환 배너 추가해 1차 방어함)
- **개선**: 안정화 후 `reportCenterBuildReportText*` 등으로 리네임(호출처+surface fixture 동반 갱신). `report-copy-final.md`는 전문체 기준으로 재작성.

### 🟢 N4. PDF 인쇄 셸의 MathJax CDN 의존 — 오프라인/렌더 행
- **위치**: `reportCenterBuildCleanPdfShell`의 `<script>` MathJax 로드
- **문제**: 인쇄 셸이 외부 MathJax CDN을 동기적으로 기다려, 네트워크가 없거나 느릴 때 렌더가 멈춤(이번 검증 중 헤드리스 스크린샷이 반복 타임아웃된 원인). 인쇄 직전 화면 멈춤 위험.
- **개선**: MathJax 로컬 번들 + 로드 타임아웃/실패 폴백(수식 없는 평문 렌더) 추가. 서비스워커 cache-first(선행 #23)와도 연계.

### 🟢 N5. 죽은 코드 잔재 (휴면 기능)
- **위치**: `openParentReport`/`showParentReportModal`/`saveParentReportImage`/`buildReportCardNextPoint` (학부모 리포트 카드 v1) — 호출처 0
- **참고**: 명백한 죽은 헬퍼 3종(`reportCenterBuildCoreSummaryHtml`/`reportCenterBuildCurrentPositionText`/`reportCenterGetQuestionStatsSummary`)은 2026-06-27 제거함.
- **개선**: 카드 v1을 재사용 계획이 없으면 제거(코드/스냅샷 동반), 있으면 재배선. 방치 시 리뷰 false-positive 반복.

### ⚪ N6. 작업 트리 위생 — 트랙 혼재
- **위치**: 현재 `git status` 더티 파일 약 20개 (리포트 외 `archive/*`, `apmath/css/apms-clinic-print.css`, `apmath/js/student.js`, `wrong_print_engine.html` 등 혼재)
- **문제**: 여러 작업 트랙의 미커밋 변경이 한 워킹트리에 섞여, 커밋 범위 분리·리뷰가 어렵고 surface 가드 테스트가 무관 파일로 실패함.
- **개선**: 트랙별로 커밋/스태시 분리. 리포트 작업 커밋 시 `apmath/js/report.js` + 관련 테스트/픽스처/문서만 스테이징.

---

## C. 우선순위 제안

| 순위 | 항목 | 비고 |
|---|---|---|
| 1 | 선행 #5(new Function), 미정밀 보안 항목 재감사 | 보안 — 별도 정밀 리뷰 |
| 2 | N1 report.js 3분할 | 가드 테스트 있어 안전, 유지보수 효과 큼 |
| 3 | N6 작업 트리 정리 + 선행 #29/#30 위생 | 커밋·리뷰 신뢰성 |
| 4 | N4 MathJax 폴백 | 인쇄 안정성 |
| 5 | N3 네이밍/문서 정리, N5 죽은 코드 제거 | 안정화 후 |

> 요약: 지난 2주간 **테스트/CI(#33)와 PII(#1)는 크게 개선**됐으나, **대형 파일 분할(#15)은 오히려 후퇴**(report.js 6,088줄)했고 핵심 보안 항목(#5 등)은 잔존한다. 다음 사이클은 report.js 분할과 보안 정밀 재감사를 권장.
