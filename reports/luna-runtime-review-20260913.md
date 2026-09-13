# AP MATH 3엔진 Fast Runtime — Luna 전수 실동작 검수 보고서

- 검수일: 2026-09-13 (Asia/Seoul)
- 검수 대상 저장소: `icefoxtail/AP------`
- 검수 기준 브랜치: `main`
- 검수 기준 HEAD: `66ca5aaa53847108496f00fda58358e82ed7efaa`
- `origin/main`: `66ca5aaa53847108496f00fda58358e82ed7efaa`
- 시작 게이트: 통과. 검수 시작 시 일반 `git status --short` 출력은 비어 있었다.

## OVERALL

**PASS / RELEASE_CANDIDATE**

Archive, Mixer, Wrong 세 엔진의 실제 production caller, 저장 payload, URL protocol, output mode, viewport, QR, MathJax, source snapshot, latest-wins, rollback/recovery, preview, PDF 생성 경로를 순서대로 확인했다. 제품 P0/P1/P2 결함은 발견하지 못했다.

검수 중 발견된 제한은 production 경로 결함이 아니라 test-only Unit Past 다중 paper fixture의 경로 불일치 2건과, 현재 `main`의 기준이 갱신된 뒤 남아 있는 정적 drift/SHA lock/하네스 검증 3건이다. 이 항목들은 아래 FAIL 분류에 재현 조건과 범위를 기록했다.

## DENOMINATOR

정의한 canonical output/route case는 총 **126건**이다.

| 엔진 | 검수 완료 | canonical | 보류/차단 | 비고 |
|---|---:|---:|---:|---|
| Archive | 42 | 42 | 0 | production source profile 5종(대표 파일 6종), exam/sol/ans, qpp4/6/8, 1440/390 |
| Mixer | 34 | 36 | 2 | test-only Unit Past 다중 paper fixture 2건이 404 |
| Wrong | 48 | 48 | 0 | student/class/public/compact/packet 및 image source |
| **합계** | **124** | **126** | **2** | physical printer/PCL/GDI는 N/A |

추가로 Wrong의 QPP 6/8 조합은 현재 고정된 `CLINIC_QPP=4` 정책 때문에 canonical 실행 대상에서 제외했고, Mixer `mode=pdf`는 별도 PDF viewer 경로로 검증했다.

## ENGINE COVERAGE

### Archive

- production source profile 5종 × `exam/sol/ans` × viewport `1440/390` × qpp4: **30/30 PASS**
- 대표 production source × `exam/sol/ans` × viewport `1440/390` × qpp6/8: **12/12 PASS**
- 실제 production DB/index caller `goEngine`에서 source A/B 전환, 동일 source 재로드, header, QR submit+solution, QR on/off, prewarm, latest-wins, MathJax/source/commit/print failure recovery를 확인했다.
- 대표 source:
  - `original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js`
  - `original/high/h1/2mid/21_강남여고_2학기_중간_고1_기출.js`
  - `original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js`
  - `original/middle/m1/2final/23_왕운중_2학기_기말_중1_기출.js`
  - `similar/high/h1/2final/25_제일고_2학기_기말_고1_유사.js`
  - `original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js`

### Mixer

- storage fixture matrix qpp4/6/8 × `exam/sol/ans` × 2 viewport: **10/10 PASS**
- Assessment actual pack `M3_FINAL_UNIT_POLY_10`, qpp4/6/8 × `exam/sol/ans` × `1440/390`: **18/18 PASS**
- 실제 `archive/mixer.html` production DB(462 entries) caller → mixed engine qpp6: **PASS**
- Unit Past production archive preview: **2/2 PASS**
- Unit Past production collection preview: **2/2 PASS**
- Clinic Mixed `saveClinicMixedPayload` + `buildMixedEngineClinicUrl` → mixed engine: **PASS**
- rapid sequence `exam → qpp8 → sol → header → qpp6 → ans → QR → exam`: **PASS**
- shuffle/source change 뒤 source ref set 보존 및 새 snapshot 생성: **PASS**
- 보류 2건은 `tests/fixtures/unit-past-exams-multi-paper.html`가 `/tests/fixtures/mixed_engine.html`를 만들고 404를 받는 test-only 경로다. 동일한 production `/archive/unit-past-exams.html` 경로는 `/archive/mixed_engine.html`을 만들며 통과했다.

### Wrong

- student storage/recipient/duplex 4 modes × 2 viewport: **8/8 PASS**
- class/grade/type 3 × 4 output modes × 2 viewport: **24/24 PASS**
- public `?set=` review+lock: **2/2 PASS**
- public `?packet=`: **2/2 PASS**
- compact `?wp=`: **2/2 PASS**
- solution image가 포함된 실제 source qpp8 × 4 modes × 2 viewport: **8/8 PASS**
  - source: `original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js`
- parent preview `AP_PRINT_PREVIEW/AP_CLINIC_PREVIEW`, stale storage block, header edit message, edit race × 2: **2/2 PASS**
- recipient, `pageBreakByStudent`, duplex blank/homework, running header, clinic QR, review lock, source reuse, long solution 경로를 확인했다.

## SHARED BROWSER / REGRESSION TESTS

| 테스트 | 결과 |
|---|---:|
| `tests/three-engine-fast-parity.cjs` | 19/19 PASS |
| `tests/three-engine-fast-lifecycle.cjs` | 15/15 PASS |
| `tests/three-engine-fast-protocols.cjs` | 8/8 PASS |
| `tests/three-engine-fast-polish.cjs` | PASS |
| 관련 unit/regression 선택 suite | 29/29 PASS |

polish 검증에서 bank request는 6→0, offline reuse는 성공, QR preflight canvas encode는 20→10, mutation rebuild은 통과했다. 긴 solution의 MathJax 호출은 144→3, DOM target은 135075→3777로 감소했다.

선택 static suite는 109건 중 106 PASS, 3건은 아래와 같이 현재 main 기준의 분류된 실패다.

1. inherited drift-ledger mismatch: ledger가 희망 구현이 아니라 현재 production 차이를 기록해야 한다는 기준 불일치.
2. main integration/test-harness conflict: Phase 0가 세 엔진 파일 목록 대신 exact edge-based dependency denominator를 요구한다. 최신 `main`에서 `archive/exams/test-fixtures/render-authority-golden.js`가 제거된 상태와의 충돌이다.
3. inherited SHA lock mismatch: Phase 0 SHA baseline이 frozen closure 전체의 현재 바이트를 lock해야 한다는 기준 불일치.

위 3건은 이번 runtime 실행에서 발견된 제품 동작 결함으로 승격하지 않았다.

## PRINT / PDF

- Archive direct production PDF: exam 5 pages, sol 6 pages, ans 1 page. raw TeX 0, overflow 0.
- Mixer 대표 PDF: exam 3, sol 1, ans 1 pages.
- Wrong 대표 PDF: exam 3, sol 5, ans 3 pages.
- public packet 6, public set 6, compact 4 pages.
- pypdf page-count와 browser PDF 생성 결과를 모두 확인했고, 대표 출력에서 overflow와 raw TeX 노출을 발견하지 못했다.
- 물리 프린터, PCL/GDI 드라이버, 실제 용지 출력은 실행 환경상 N/A다.

## LATEST-WINS / ROLLBACK / CACHE

- 빠른 연속 요청에서 마지막 intent가 표시/출력 상태를 차지하는 latest-wins를 확인했다.
- source, MathJax, commit, print 실패 뒤 사용자 재시도와 정상 상태 복귀를 확인했다.
- cache prewarm 및 offline snapshot 재사용이 동작했고, snapshot/source ref가 source 변경 때 새로 생성되며 이전 source와 섞이지 않았다.
- QR은 preflight canvas encoding과 on/off 양쪽을 확인했다.

## VISUAL REVIEW

실제 production bank, Mixer qpp6 storage, Wrong duplex exam/sol, Unit Past production preview screenshot을 확인했다. 페이지 여백, header, 문제/해설 분리, QR/solution image, blank page, viewport별 레이아웃에서 관찰 가능한 시각 결함은 없었다.

## FAIL / BLOCKED REGISTER

- **[FAIL-001, test-only]** Unit Past multi-paper fixture 2건: fixture가 `/tests/fixtures/mixed_engine.html`을 참조하지만 해당 경로가 404. production `/archive/unit-past-exams.html` 경로는 정상.
- **[FAIL-002, inherited/static]** drift ledger 기준 불일치.
- **[FAIL-003, inherited/static]** 최신 main의 render-authority fixture 제거와 정적 하네스 기대치 충돌.
- **[FAIL-004, inherited/static]** frozen closure SHA baseline mismatch.

P0/P1/P2 제품 결함: **0건**.

## FILE / GIT SCOPE

검수 중 production 파일 변경은 없었다. 임시 screenshot/PDF/evidence는 저장소 외부 또는 기존 ignore 대상에 남겼고, 이번 변경에서는 보고서 파일 1개만 추가한다.

## FINAL

**RELEASE_CANDIDATE — PASS**

현재 `main`의 Fast Runtime 통합 상태는 세 엔진의 실제 caller와 출력 경로에서 릴리스 후보로 판단할 수 있다. 남은 조치는 test-only fixture 경로와 inherited static ledger/SHA 하네스 기준을 저장소 정책에 맞게 정리하는 것이다.
