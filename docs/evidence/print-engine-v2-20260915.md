# Print engine v2 검증 및 교체 안내

## 결과와 적용 범위

- 브랜치: `codex/print-engine-v2`, 기준 커밋 `027357a70`.
- 목표: 기존 기능 유지(functional parity), 잘림 방지·재렌더·출력 안정성 개선(quality superiority).
- 이번 변경은 Archive / Mixer / Wrong의 **호환 가능한 QPP=4 시험지 compositor 교체**이다. 기존 source normalization, MathJax, transaction/snapshot cache, 해설/정답 executors를 재사용한다. 전체 앱을 처음부터 재작성한 것으로 표현하지 않는다.
- 일반 4문항 시험지는 새 경로를 기본 사용한다. `fullwidth`, `subjective-2up`, `subjective-4up`, `wide` 힌트가 있는 문서의 기본 배치는 기존 경로를 유지한다. `equalSlots=1`을 명시하면 이 문서도 엄격한 네 칸에 배치한다.
- `slotEngine=legacy`는 기존 시험지 경로로 복원한다. 다른 QPP와 해설/정답은 기존 동작을 유지한다.
- main 병합, 원격 push, 배포, 실제 프린터 작업 전송은 실행하지 않았다.

## 설계

`archive/equal-slot-engine.js`와 CSS가 네 개의 동일 슬롯을 만들고 canonical 문항 DOM을 실제 너비에 배치한다. 기존 두 열과 `.q-box { flex:1 }` 구조를 유지한다. 마지막 페이지도 빈 슬롯을 남긴다. 순서는 왼쪽 위/아래, 오른쪽 위/아래이다.

수식은 배치된 문항을 묶어 처리한다. 이미지/폰트 준비 뒤 실제 슬롯에서 크기를 측정한다. 정상 문항은 `scale=1`을 유지하고, 넘치는 문항만 최대 7가지 내부 조판 후보를 비교한다. 명시한 선택지 레이아웃은 유지한다. 선택 결과는 `data-equal-slot-scale`, `data-equal-slot-profile`, `data-equal-slot-status`에 기록한다. 0.85 미만은 warning, 0.75 미만은 review로 기록한다. 이 값은 임시 가독성 기준이며 잘림 검사와 별개이다.

QR/페이지 번호 배치 후 최종 fitting과 audit를 한 번 수행한다. 같은 노드·크기·내용에 대한 중복 finalize는 fitting을 재실행하지 않지만 최종 검사는 수행한다. 기존 snapshot cache도 그대로 재사용한다. 새로운 영구 문항 단위 캐시를 구현했다고 주장하지 않는다.

### 실제 PDF에서 찾고 수정한 문제

`transform: scale()`만 적용하면 Chrome의 인쇄 화면상 경계는 맞아도, 축소 전 높이로 페이지가 나뉘어 2번의 선택지가 다음 PDF 페이지로 이동했다. 페이지별 선택지 표식 검사로 재현했다. 실제 인쇄 레이아웃에도 축소가 반영되는 CSS `zoom`과 고정된 원래 너비를 사용해 해결했다.

html2canvas 1.x는 zoom된 글자 크기를 제대로 그리지 않아 문자 겹침이 생겼다. 이미지 인쇄에서만 private clone의 zoom을 동등한 transform으로 변환한다. 원래 snapshot은 변경하지 않는다. Archive/Mixer raster와 공용 native PCL/GDI 캡처가 이 함수를 사용한다. Wrong은 기존 브라우저 인쇄 경로를 유지한다.

### 오류 차단

- 실제 문항 내용의 사방 경계, MathJax 내부 요소, 내부 스크롤 잘림, 균등 슬롯, 페이지와 고정 요소 경계를 검사한다.
- 이미지 실패, 수식 오류, 인쇄 준비 실패는 성공으로 처리하지 않는다.
- Archive의 vector print에서 준비 오류를 경고만 남기고 계속 인쇄하던 경로를 수정했다. snapshot 및 slot preflight를 통과하기 전의 오류는 print 호출을 차단한다.
- strict 모드에서 필수 compositor/executor 로딩 실패는 legacy로 조용히 전환하지 않고 실패한다. 기본 특수 문서는 v2가 없어도 기존 경로로 실행한다.

## 검증 결과

### 자동 테스트

Node 테스트 **56 passed, 0 failed**. 대상 파일:

```powershell
node --test tests/equal-slot-engine.test.js tests/layout-authority.test.js tests/archive-fast-engine-runtime.test.js tests/print-runtime.test.js tests/print-readiness-adapter.test.js tests/archive-inline-image-readiness.test.js tests/print-contract.test.js tests/archive-mathjax-render-loop.test.js tests/archive-mixer-loader-isolation.test.js tests/apmath-wrong-print-qr-solution-regression.test.js
```

실제 Chromium 통합 결과는 `reports/print-engine-v2/browser-all.json`에 저장된다. **39 기능 시나리오 + 6 성능 측정 그룹 모두 PASS**:

| 분류 | 시나리오 | 확인 내용 |
|---|---:|---|
| 레이아웃 | 10 | 세 엔진, 4/8/9문항, 모바일 390px, 2명 수신자, 네 칸 동일 크기, 순서, QR 겹침, screen/print media |
| 기존 기능 비교 | 14 | 특수 배치, 해설/정답, Wrong review, Archive/Mixer QPP 6/8의 텍스트·페이지·크기 일치 |
| 캐시와 오류 주입 | 6 | 동일 root snapshot HIT, 반복 finalize 멱등성, 왼쪽 이탈/수식 이탈/내부 잘림, 이미지 실패 |
| 인쇄 차단 | 9 | slot preflight 실패 시 print 0회, v2 로딩 실패, 특수 문서의 기존 경로 유지; 추가로 executor 로딩 실패와 Archive snapshot 오류 검사 |
| 성능 | 6 그룹 | 3엔진 × 2구현, 각 24문항 3회, 첫 렌더와 강제 재렌더 측정 |

별도 quality 비교는 세 엔진 모두 동일 9문항에서 기존 넘침 **1문항 → 새 엔진 0문항**을 확인했다. 이 숫자는 해당 fixture의 결과이며 전체 아카이브 전수 검증이 아니다.

### 로컬 성능

Chrome 153, Windows, 실제 MathJax, 동일 24문항, 구현당 3회 중앙값. 엔진 계측 시간이며 CDN/운영체제/기기 부하에 따라 달라진다. 성능 비교 구간에 다른 브라우저 검증을 동시에 실행하지 않았다.

| 엔진 | 첫 렌더 기존 → 새 | 강제 재렌더 기존 → 새 | MathJax 호출 기존 → 새 | 레이아웃 대기 기존 → 새 |
|---|---:|---:|---:|---:|
| Archive | 2088.5 → 2068.3 ms | 2214.5 → 1421.5 ms | 1 → 1 | 9 → 2 |
| Mixer | 2541.7 → 2136.6 ms | 1702.3 → 1509.3 ms | 1 → 1 | 13 → 1 |
| Wrong | 2871.9 → 2179.8 ms | 1622.0 → 1408.7 ms | 13 → 1 | 14 → 2 |

첫 렌더 변화는 약 1% / 16% / 24%, 강제 재렌더는 약 36% / 11% / 13% 단축이었다. 특히 Archive 첫 렌더 차이는 측정 오차 범위일 수 있다. 보편적인 배수 성능 향상이나 모든 문항의 속도 향상을 보장하지 않는다. 따뜻한 모드 복원은 기존 snapshot HIT를 유지한다.

### PDF·이미지 검증

- 세 엔진 각 9문항 PDF(각 3페이지)를 생성해 전체 9페이지를 렌더하여 눈으로 확인했다.
- 페이지별 마지막 선택지 표식을 추출해 문항과 선택지가 같은 PDF 페이지에 남는지 확인했다.
- Archive/Mixer html2canvas 출력은 캡처 후 문자 겹침과 긴 문항 끝을 확인했다.
- 실제 프린터/PCL/GDI 장치 출력, 모든 브라우저, 전체 은행의 문항은 아직 검증 범위가 아니다. 프린터 교체 승인 전에는 사용자 장치에서 대표 시험지의 실제 양면 출력을 확인해야 한다.

## 실행 및 비교

브랜치 작업 폴더에서:

```powershell
python -m http.server 8879 --bind 127.0.0.1
```

`http://127.0.0.1:8879/tests/fixtures/equal-slot-preview.html`을 열면 세 엔진의 새 2×2 / 기존 / 특수 배치 호환 모드를 선택할 수 있다. 이는 테스트용 합성 문항이다.

브라우저 자동 검증은 Playwright와 pypdf가 필요하다. 이 환경의 번들 사용 예:

```powershell
$env:AP_PLAYWRIGHT_MODULE='C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:AP_SLOT_PHASE='all'
node tests/equal-slot-engine-browser.cjs
# 선택 실행: layout, parity, lifecycle, guards, performance, quality, raster
```

하네스는 자체 로컬 서버를 만들고 닫는다. 출력은 ignored `reports/print-engine-v2/`에 저장한다. 주요 결과는 `browser-all.json`, `browser-quality.json`, `browser-raster.json`, `unit-tests.txt`, 엔진별 PDF/PNG이다.

## 교체 판단

브랜치의 4문항 경로는 비교 시험이 가능한 상태다. 기존 기능 전체를 새 코드로 재작성한 것은 아니며, 특수 배치와 다른 출력 모드는 호환 경로를 유지한다. 대표 실제 시험지와 사용자 프린터 확인 후 이 브랜치를 통합하는 것이 다음 단계다. 롤백은 URL의 `slotEngine=legacy` 또는 브랜치 변경 취소로 가능하다.

## 독립 검수

`print-engine-v2-review-20260915.md`: scoped spec PASS / code quality PASS, 미해결 P0/P1/P2 없음. PDF fragmentation, vector fail-closed, strict dependency fallback, MathJax inner footprint, 중복 최종 검사 지적을 수정한 뒤 검수 완료. 수치 원본 요약은 `print-engine-v2-results-20260915.json`에 함께 보관한다.
