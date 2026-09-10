# Archive Fast Engine v2 — Phase 0 / Phase 1A 결과

구현 기준은 원본 `AP_Archive_Fast_Engine_v2_설계도_v1.4.md` 전체다. 설계도는 수정하지 않았다.

- 시작 시 `git fetch origin main`으로 확인한 최신 main: `ea6564cdda7a496412246522fab5940086b48a65`
- 작업 브랜치: `codex/archive-fast-engine-v2-phase1a`
- 별도 worktree: `C:/Users/USER/Desktop/AP-fast-engine-v2-phase1a`
- 기존 `C:/Users/USER/Desktop/AP------`의 작업 파일/기존 변경은 수정하지 않았다.
- Phase 0 선행 Gate를 먼저 동결한 뒤 Phase 1A를 구현했다.
- 최종 판정: Phase 0 **10/10 PASS**, Phase 1A **18/18 PASS**.
- 커밋은 이 보고서를 포함하는 Git commit이다. 자기 참조 SHA 대신 `git rev-parse HEAD`로 확인하며 최종 사용자 보고에 SHA를 별도 제공한다.

## 실제 구현

1. `render-state-normalizer.js`: 실제 executor가 읽는 필드를 projection하고, 복사 후 재귀적으로 freeze한다. canonicalData의 shallow freeze를 신뢰하지 않으며 외부 raw 객체를 freeze하지 않는다. 알 수 없는 candidate 필드, accessor/function/cycle/non-plain 값은 거부한다. mode 이름을 명시적으로 매핑하고 동일 immutable candidate에서 key/build digest를 계산한다.
2. `screen-runtime.js`: 12개 canonical intent, 단일 직렬 요청 큐, 최신 요청 우선, transaction context, PendingRenderSession과 별도 RenderSession materialization, synchronous COMMIT/rollback, snapshot status/ownership, retired cleanup을 소유한다.
3. `screen-runtime-adapter.js`와 `engine.html`: 기존 canonical renderer를 그대로 사용하면서 mode/header/QR/source/QPP/강제 재렌더/인쇄 복구/명시적 invalidation을 runtime에 연결했다. DOM·AppState·URL·탭·readiness는 성공한 COMMIT에만 함께 반영한다.
4. PREPARE는 연결된 비가시 foreground 작업 root와 요청별 staging/dependency view에서 실행한다. 기존 화면은 유지한다. 백그라운드 요청 및 prewarm은 활성화하지 않았다.
5. 실제 source JS에 있는 최상위 `const` helper의 재선언 충돌을 방지하도록 로드별 함수 범위를 사용한다. source globals는 추출 직후 복원한다. fetch 실패 후 늦게 실행되는 script를 방지한다.
6. MathJax/measurement metrics와 ledger를 요청별로 분리했다. 빌드 중 발생한 폰트 로딩 완료가 사용자 요청을 다시 취소하지 않도록 수정했다.
7. `side-effect-ledger.js`: 성공한 COMMIT 이후 등록을 실행하고 HTTP ACK/실패/다음 activation 재시도를 기록한다. 재시도는 동일 logicalEffectId/idempotencyKey를 사용한다. Phase 0에서 가역성이 입증된 precommit 외부 효과가 없으므로 이를 실행 전에 거부하며 보상 미해결 수는 0이다.
8. 캐시가 없는 현재 active 결과의 인쇄 바인딩을 확인하고 인쇄마다 readiness tracker를 새로 만든다. 기존 UI 문구를 유지했다.

Phase 1B의 Answer cache hit, Phase 1C/1D snapshot cache, background scheduling, measurement batching, layout authority promotion은 구현하지 않았다.

## Phase 0 결과

정본 증거:

- `phase0-inventory.json`: render 진입점, immutable 입력 schema, session lifecycle, side-effect 계약.
- `phase0-baseline.json`: 고정 SHA의 48개 측정과 Chrome trace 요약.
- `phase0-parity.json`: desktop/mobile 실제 출력과 offscreen 기하 prototype.
- `phase0-seal.json`: 10개 Gate 및 선행 증거 SHA-256. 최종 검증에서 해당 파일 해시가 그대로임을 확인했다.

Fixture는 기존 golden 8문항, 이미지 중심 실제 시험지 24문항, 유형 시험지 32문항이다. 일반 선택지, 표/수식, SVG, 긴 해설/continuation, subjective-2up/4up, fullwidth, 규모, answer grouping/refit 대상, QR, header/QPP 경로를 포함한다. 동일 Chrome `153.0.8010.36`, desktop `1440×1000`, deviceScaleFactor 1, 각 fixture/작업 2회로 측정했다. 시각·기하 parity에는 mobile `390×1000`도 추가했다.

측정 작업은 initial exam, exam→sol, sol→ans, ans→exam, exam→sol 재진입, header, QR, QPP다. 별도로 세 모드의 실제 재빌드를 offscreen에서 비교했다. 문항 순서·page count·요소 크기·이미지 크기·mode별 ledger가 정확히 일치했고, 해당 frozen fixture의 관측 기하 허용 오차는 0이다.

기존 main에는 font wait/materialization/강제 layout read의 개별 계수기가 없으므로 이를 임의의 숫자로 채우지 않았다. 기존 render phase/MathJax 지표, 실제 크기와 Chrome Layout/Paint/Scripting trace를 보존했다. raw trace는 JSON에 기록된 저장소 외부 `.trace.json.gz` 경로에 있으며, 요약과 지표는 이 보고서 디렉터리에 남겼다.

## Phase 1A Gate 결과

`phase1a-gates.json`에 18개 canonical Gate ID별 PASS/FAIL, 근거, 구현 해시를 기록했다.

| Gate | 결과 |
|---|---|
| CANONICAL_INTENT_ENUM | PASS |
| CANDIDATE_RENDER_STATE | PASS |
| RENDER_AFFECTING_TRANSITIVE_IMMUTABILITY | PASS |
| KEY_INPUT_DIGEST_BUILD_INPUT_DIGEST_PARITY | PASS |
| ALL_RENDER_ENTRY_ROUTED | PASS |
| RENDER_TRANSACTION_CONTEXT | PASS |
| PENDING_RENDER_SESSION | PASS |
| PENDING_TO_CURRENT_MATERIALIZATION_GATE | PASS |
| PENDING_TARGET_SESSION_ID_PARITY | PASS |
| RENDER_STATE_2PC | PASS |
| SYNCHRONOUS_ATOMIC_COMMIT | PASS |
| SNAPSHOT_STATUS_COMMIT | PASS |
| COMMIT_ROLLBACK | PASS |
| REQUEST_GENERATION_STALENESS_ONLY | PASS |
| DIRECT_RENDER_BYPASS | PASS — 0 |
| SIDE_EFFECT_DELIVERY_FAILURE_CONTRACT | PASS |
| SIDE_EFFECT_COMPENSATION_CONTRACT | PASS |
| BACKGROUND_SIDE_EFFECT_COUNT | PASS — 0 |

## 정적 검사 및 실제 브라우저

- Node 테스트: **46 PASS / 0 FAIL**, `static-tests.tap`.
- `node --check`: engine inline script를 포함한 **18개 대상 PASS**, `node-check.json`.
- `git diff --check`: PASS.
- Chrome 트랜잭션 시나리오: **19 PASS / 0 FAIL / 예기치 않은 pageerror 0**, `phase1a-browser.json`.
- `screenRuntime=legacy` 및 legacy executor fallback: 세 모드씩 **6 PASS**, `legacy-browser.json`.
- desktop/mobile × 세 모드: **6개 실제-render parity PASS**. 본문·문항 순서·페이지·이미지·요소 기하 및 해당 mode ledger를 비교했다. 이전 mode의 stale ledger를 계속 유지하는 것을 parity 조건으로 삼지 않았다.
- 최종 구현 파일 해시를 고정한 **48개 반복 재측정**: `phase1a-baseline.json`. 실행 시작/끝과 최종 verification에서 파일 해시 일치.
- 모든 대응 샘플의 page count와 MathJax call count가 기존 baseline과 일치했다.
- MathJax/레이아웃/font/source/schema/image 실패, history COMMIT 예외, 늦은 요청 폐기, 헤더 입력 외부 변경, source 재진입, QR/preview/해설 잠금, 등록 재시도, 반복 인쇄 dry-run과 PRINT_STALE_REBUILD를 실제 canonical engine에서 검증했다.
- DOM에 남은 abandoned build/staging root는 0, active root ownership PASS.

브라우저 테스트의 업무 API는 실제 네트워크를 전송하기 전에 Playwright route로 대체했다. 503/200 응답에 대한 클라이언트 계약을 검증했으며 운영 출제 이력·blueprint를 생성하지 않았다. 인쇄는 `printDryRun=1`로 준비 동작을 검증했으며 물리 프린터 출력은 수행하지 않았다.

## 성능 관측 및 남은 문제

이 단계의 통과 판정은 Phase 1A transaction foundation Gate다. 성능 SLA나 cache promotion 완료로 판정하지 않는다. `performance-comparison.json`에 전체 비교를 남겼다.

| Fixture/작업 | main 평균 renderReady | Phase 1A 평균 renderReady |
|---|---:|---:|
| golden / initial | 780ms | 661ms |
| 이미지 24문항 / initial | 2,513ms | 2,679ms |
| 이미지 24문항 / 해설 전환·재진입 | 6,367ms | 6,487ms |
| 32문항 / initial | 3,162ms | 2,776ms |
| 32문항 / 해설 전환·재진입 | 20,932ms | 19,964ms |
| 32문항 / 헤더 변경 | 20,690ms | 23,378ms |

모든 mode 진입은 여전히 authoritative rebuild다. 이미지 시험지 초기 렌더와 일부 헤더 재렌더는 느려진 관측이 있으므로 성능 무회귀를 주장하지 않는다. 특히 32문항 헤더 재렌더의 약 13% 증가는 후속 최적화 전에 추가 재현·분석할 항목으로 남긴다. 이 작업에서 Phase 1B나 measurement 최적화를 앞당겨 적용하지 않았다.

추가 범위 제한: 전체 archive 시험지 전수 브라우저 회귀, 운영 API의 수신측 end-to-end ACK, 물리 인쇄는 검증하지 않았다. 검증한 Phase 1A correctness Gate의 미해결 FAIL은 없다.

## 재현

저장소 root를 `python -m http.server 8766 --bind 127.0.0.1`로 제공한다. Playwright를 저장소 외부에 설치하고 `AP_PLAYWRIGHT_MODULE`을 해당 모듈 경로로 설정한다.

```text
node tests/archive-fast-engine-browser.cjs
node tools/archive-fast-engine/parity.cjs phase1a
node tools/archive-fast-engine/baseline.cjs phase1a
node tools/archive-fast-engine/verify.cjs
```

Phase 0 재측정은 frozen SHA의 runtime 파일이 있는 checkout에서만 `baseline.cjs phase0`로 실행한다. 해당 도구는 runtime 파일이 frozen SHA와 다르면 실행을 거부한다. runtime rollback은 `?screenRuntime=legacy`다.

변경 파일 전체 목록은 `changed-files.json`에 기록했다. 원본 설계도, 관련 없는 시험지 bank, 기존 사용자 변경, 임시/백업 파일은 커밋에 포함하지 않았다.
