# Fast Runtime 후속 개선 — 구동·인쇄 완성도

비교 기준은 직전 통합 완료 커밋 `fc108a9a2934340e8e5ec4f7184ae73e9f245e44`이다. 기존 통합 보고서(`../three-engine-fast-runtime`)는 해당 시점의 기록이며, 이번 변경의 증거는 이 폴더에 별도로 보존한다.

## 반영한 수정

1. **Wrong 문제은행 재요청 제거.** 최초 비동기 load 이전의 desired input 때문에 모드를 바꿀 때 같은 bank를 다시 읽던 문제를 수정했다. 같은 source identity의 성공적으로 commit된 bank만 재사용한다. 실패/취소된 빌드의 bank를 재사용하지 않는다. 네트워크 단절 후에도 이미 준비된 source의 모드 전환이 가능하다.
2. **사용자 작업 우선순위 보장.** 대기 중이거나 실행 중인 foreground 요청을 prewarm이 취소하지 못하게 했다. 인쇄가 background 작업을 취소할 때 아직 시작하지 않은 queued 작업도 취소한다. 이 수정은 3엔진이 공유하는 `APScreenRuntime`에 적용된다.
3. **인쇄 preflight 중복 검사 제거.** 정상 snapshot의 전체 DOM/QR/geometry 검사를 한 번만 수행한다. 변경이 발견되어 다시 빌드한 경우에는 새 결과를 반드시 재검사한다. 검사 결과를 다음 인쇄까지 무조건 캐싱하거나 변조 검사를 없애지 않았다.
4. **Wrong 해설의 MathJax 작업 축소.** 새 box와 새 fragment만 처리하고 이미 처리된 컬럼 전체를 반복 훑지 않는다. 긴 해설 fragment는 실제 shell 폭/서체를 맞춘 staging에서 일괄 typeset한 후 DOM을 그대로 이동한다. staging을 분리해 남은 fragment의 재배치 비용을 줄이고, 8ms 시간 예산에 따라 제어권을 돌려준다. 이동/압축만으로 새 TeX가 생기지 않는 경로의 재typeset을 제거했다.
5. **임시 MathJax 자원 정리.** 분할에 사용된 원래 oversized box와 임시 staging의 MathJax 항목을 정리한다. 실제 출력 shell로 옮긴 fragment는 보존한다.
6. **인쇄 연타·예외 복구.** Wrong의 중복 인쇄 요청을 차단하고 준비 중 버튼을 비활성화한다. 인쇄 호출이나 preflight가 실패해도 lock과 버튼을 복구하고 화면에 재시도 안내를 표시한다.
7. **Mixer 이미지 준비 중복 제거.** 새 경로의 최종 이미지/readiness 검사는 공통 host에서 한 번 수행한다. legacy 경로는 기존 검사를 유지한다.
8. **브라우저 cache version 갱신.** 바뀐 core/host/executor가 기존 브라우저 캐시에 가려지지 않도록 세 엔진의 해당 script URL 버전을 올렸다.

## 실제 비교

`focused-performance.json`은 동일한 fixture를 개선 전과 후의 실제 Chrome에서 실행한 결과다.

| 항목 | 개선 전 | 개선 후 |
|---|---:|---:|
| Wrong 6회 모드 전환의 bank 재요청 | 6회 | 0회 |
| 준비된 bank를 이용한 오프라인 모드 전환 | 실패 | 성공 |
| 2개 QR 문서의 5회 preflight canvas 인코딩 | 20회 | 10회 |
| 긴 해설 MathJax 호출 | 144회 | 3회 |
| MathJax에 넘긴 DOM의 누적 대상 요소 수 | 135,075 | 3,777 |

QR canvas를 바꾸면 여전히 재빌드되어 복구된다. 인쇄 함수를 강제로 실패시키고 인쇄를 동시에 두 번 요청한 테스트에서는 실제 호출 1회, 중복 요청 거부, 버튼 복구, 다음 모드 전환 성공을 확인했다.

긴 해설의 실행 시간도 원시 측정값에 포함되어 있다. 동시 브라우저 실행/폰트 처리 영향으로 변동이 크므로, 호출·대상 DOM 감소를 모든 문서에서 동일한 시간 단축률로 해석하지 않는다. 실제 프린터의 기계적 출력 속도를 측정한 결과도 아니다.

## 출력 보존 검증

- 기본 출력: 19개 비교.
- 긴 해설 및 반·학년·유형별 해설/정답: 8개 비교.
- block HTML을 포함한 긴 해설과 모바일 review: 2개 비교.
- lifecycle: 15개.
- preview / 공개 QR / legacy·missing-module fallback: 8개.
- Archive 브라우저 회귀: 19개.
- 공통 core의 queued/active foreground 보호와 queued prewarm 취소 단위 테스트 추가.

각 출력 비교는 본문·순서·정답·이미지·문항별 위치/크기·continuation·페이지 수를 기준 버전과 비교한다. `audit-polish.py`가 저장된 PDF의 페이지 수와, baseline PDF가 있는 10개 사례의 페이지별 추출 텍스트도 검증한다.

정적/단위 테스트는 76개 중 74개 통과다. 기존 drift-ledger 및 Phase 0 SHA lock의 2개 실패는 이전 보고서에서 기준 버전에서도 재현한 항목이며 이번 작업에서 수정하지 않았다.

## 검증 중 제외한 최적화

최초 수식 처리 결과를 모든 분할 shell에 재사용해 두 번째 처리를 없애는 방식은 긴 해설의 첫 컬럼 경계를 42번째 줄에서 45번째 줄로 바꾸었다. 이 변경은 되돌렸다. 크기/분할 보존에 필요한 처리는 유지하고, 그 주변의 반복 호출과 DOM 탐색을 줄인 버전만 반영했다.

## 범위와 재실행

물리 프린터/PCL/GDI 전송은 하지 않았다. Chrome PDF, print preflight, 인쇄 호출 예외 및 재시도는 실제 브라우저에서 검증했다. API 응답을 통제했으며 운영 데이터에 쓰지 않았다. main merge는 하지 않는다.

기준 renderer 파일만 해당 커밋에서 캡처하고 변경 없는 asset을 공유하는 비교 서버:

```powershell
python tools/three-engine-fast-runtime/serve-baseline.py --revision fc108a9a2934340e8e5ec4f7184ae73e9f245e44 --port 8768
```

구현 서버는 `127.0.0.1:8766`이다. `AP_PLAYWRIGHT_MODULE`에 설치된 Playwright package 경로를 지정한다. 기존 검증 스크립트에 `AP_REPORT_DIR` 및 `AP_BASELINE_PORT` 설정을 추가해 과거 증거를 덮어쓰지 않고 재실행할 수 있게 했다.

```powershell
$env:AP_BASELINE_PORT = '8768'
$env:AP_REPORT_DIR = 'C:\Users\USER\Desktop\AP------\reports\three-engine-fast-polish'
node tests/three-engine-fast-parity.cjs
node tests/three-engine-fast-polish.cjs
node tests/three-engine-fast-lifecycle.cjs
node tests/three-engine-fast-protocols.cjs
python tools/three-engine-fast-runtime/audit-polish.py
```

검증 요약은 `summary.json`, 이번 변경 파일과 SHA-256은 `manifest.json`에 기록한다. 실제 branch HEAD와 push 결과는 완료 응답에서 전달한다.
