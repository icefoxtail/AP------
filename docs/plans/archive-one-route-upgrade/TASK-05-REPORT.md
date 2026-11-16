# TASK-05 보고 — CI 차단 수리와 병목 조사

조사일: 2026-11-16. 코드 브랜치 `fix/ci-blockers-20261116`는 main `9908310ccb9e8f651daca226b4ed06ba1217b2f7`에서 시작. 이 보고는 계획 브랜치에만 기록한다.

## A. 인라인 SVG fragment가 파일로 오인되는 결함

- 원인: `questionAssetReferences`가 문자열의 `url(...)`를 전부 파일 참조로 수집해 `url(#arrow_r)`도 `localAssetPath`로 전달했다. `#arrow_r`는 Archive 파일 경로가 아니므로 `unsupported local image reference`가 났다.
- 수정: `#`로 시작하는 참조만 파일 목록에서 제외하고, 인라인 SVG 내부 참조는 같은 SVG 범위에서 실제 `id` 속성 존재 여부를 검사한다. 누락 ID는 `missing inline SVG fragment` 오류로 실패한다. 주석·CDATA의 가짜 태그는 SVG 범위/ID로 취급하지 않고, quote-aware 속성 파싱으로 `data-id`나 속성값 속 문자열을 ID로 오인하지 않는다. 접두 namespace가 있으면 local-name이 정확히 `svg`인 태그만 SVG 루트로 인식한다. 기존 `url()` 파일 참조와 `img/image` 참조 추출은 유지한다.
- 변경 케이스: 정의된 fragment 통과, 누락/다른 SVG에서만 정의된 fragment 실패, style URL·foreignObject 내부 이미지 경로 보존, `data-id`·주석·속성값·CDATA의 가짜 ID, self-closing 중첩/루트 및 namespace 경계.
- 검증: `node --test tests/archive-content-scope.test.mjs` — 9/9 PASS. `git diff --check` PASS.
- 코드 커밋: A `2c278233670bae01174a02bf54a39aa19b0e92c3` (branch head의 첫 커밋).

## B. 해설 SVG 두 파일의 XML 수리

- 원인: 두 파일의 XML 선언이 `encoding='utf8'`로 되어 있어 XML 파서가 이를 유효한 인코딩 이름으로 처리하지 못하고 첫 한글 문자에서 parse fail했다. 본문 도형 데이터는 보존돼 있었다.
- 수정: XML 선언의 인코딩 이름만 표준 `UTF-8`로 변경. SVG 본문은 변경하지 않았다.
- 대상 및 확인:
  - `archive/assets/images/21_왕운중_1학기_기말_중3_수학/q17-problem-v2.svg`: ElementTree 및 저장소 `parseSvg` 통과. 이전 SHA-256 `cd61bf02d273b8df3985a4b8351d1eedf4944c0a279811b52d547b43d53ead83`, 새 SHA-256 `df269a21cfe4a9a48931e3a176b7654415ccabec105f9aef25c87d77247c9c2d`.
  - `archive/assets/images/21_팔마중_1학기_기말_중3_수학/q23-problem-v2.svg`: ElementTree 및 저장소 `parseSvg` 통과. 이전 SHA-256 `e0d7fc3e731e8d2103b35017975e6628108724badfcc6dcc7d93f04a5c506ec9`, 새 SHA-256 `ec47b02b570f79343af2f0b3328f0d71bb4a977616341c9870c3e8019ff084c0`.
- Inkscape before/after PNG를 저장소 밖 `/tmp/task05-before/`와 `/tmp/task05-after/`에 생성했다. 두 이미지 모두 시각적으로 도형·라벨·구성이 유지됐고, ImageMagick 픽셀 차이 AE=0이었다. Chromium headless는 이 실행 환경에서 socket `Operation not permitted` 및 읽기 전용 crashpad 경로로 시작되지 않아 Inkscape를 대체 렌더러로 사용했다.
- 고정값 확인: 두 기존 blob SHA 및 basename은 main의 tests, `archive/tools/geometry-equation/production/exam-figure-ledger.json`, `archive/data/meta-foundation/evidence`, `.archive-meta-register`에서 일치 참조를 찾지 못했다. 옛 영수증/장부는 변경하지 않았다.
- 코드 커밋: B `e2136a323d74bbbd3571c84106998f2d11718964`.

## C. 60초 Chrome 출력 지연 조사

| 시험지 | 문항 | 수식 토큰 수* | 이미지 자산 | 자산 합계 / 최대 |
|---|---:|---:|---:|---:|
| 16 장흥중 기말 | 24 | 787 inline | 11 (6 bitmap, 5 SVG) | 41.1 KB / 11.9 KB |
| 16 창포중 기말 | 25 | 752 inline | 5 (1 bitmap, 4 SVG) | 26.7 KB / 14.5 KB |
| 17 서울가산중 중간 | 22 | 786 (680 inline, 106 display) | 6 SVG | 32.8 KB / 6.9 KB |
| 23 풍덕중 중간 기출 | 24 | 276 inline | 0 | 0 KB |

* 시험지 JS의 수식 표기 구간 수; 브라우저 실행 시간은 아님.

- `tests/archive-original-exam-access.browser.cjs`의 RENDER_READY 대기는 60,000 ms다. 현재 `archive/engine.html`의 시험지 렌더는 staging 전체를 한 번 MathJax typeset한 뒤, 문항별로 raw 높이를 읽고 CSS class를 바꾼 다음 `requestAnimationFrame` 후 tight 높이를 다시 읽는다. 최대 22~25회 반복되는 강제 레이아웃 측정이 수식 처리 뒤 비용 후보이다. 대상별 자산은 합계 0~41.1KB로 작아 이미지 다운로드량만으로 병목을 설명할 근거는 약하다.
- 코드에는 `APRenderLoop`가 단계별 시간과 MathJax 호출 시간을 수집하지만 이 browser test의 출력에는 그 metrics가 포함되지 않는다. 따라서 수식 수와 레이아웃 반복은 원인 후보이지 런타임 인과 확정이 아니다.
- 17 서울가산 시험지로 해당 browser test를 한 번 실행했으나 Chrome은 페이지 탐색 전 sandbox socket/crashpad 권한 오류로 시작하지 못했다. 보안 설정이나 60초 한도를 변경하지 않았고 재시도하지 않았다. **Chrome 런타임 측정: 네 시험지 모두 NOT_RUN.** 이번 실행에서는 60초 timeout을 실제로 넘긴 로그를 재현하지 못했다.
- 선택지(미구현): 다음 CI 실행에서 기존 렌더 metrics를 출력해 MathJax/레이아웃 단계를 분리 계측한다. 확인 뒤 필요한 경우 문항별 강제 측정 반복을 줄이거나 재사용하되 페이지 나눔·인쇄 결과 동등성을 검증한다. 이미 staging MathJax는 batch 호출이므로 호출 수를 근거 없이 늘리거나 timeout을 늘리는 대신 계측이 먼저다.

## D. Archive Main Auto Metadata 시간 조사

GitHub Actions 최근 성공 5회와 main push 성공 5회를 구분했다. 전체 최근 성공 5회 중 4회가 PR 읽기 전용 test여서 register를 실행하지 않았다. 이 4회를 main 등록기 실행시간으로 해석하지 않는다.

| main run | job | checkout | prepare | persist | 주요 등록기 단계 |
|---|---:|---:|---:|---:|---|
| [43859397720](https://github.com/icefoxtail/AP------/actions/runs/43859397720) | 16:25 | 142초 | 395초 | 430초 | bind 10초, dispatch 2초 |
| [43851716722](https://github.com/icefoxtail/AP------/actions/runs/43851716722) | 8:47 | 160초 | 335초 | 5초 | bind 10초, dispatch 4초 |
| [43847844638](https://github.com/icefoxtail/AP------/actions/runs/43847844638) | 29:14 | 159초 | 368초 | 1207초 | bind 12초, dispatch 2초 |
| [43839891878](https://github.com/icefoxtail/AP------/actions/runs/43839891878) | 40:53 | 199초 | 464초 | 1763초 | bind 17초, dispatch 1초 |
| [43836934643](https://github.com/icefoxtail/AP------/actions/runs/43836934643) | 50:37 | 198초 | 1395초 | 1417초 | bind 16초, dispatch 2초 |

- 가장 큰 변동 원인은 단순 매번 전체 계산이 아니라 persist 중 main 경쟁에 따른 race-safe 재생성이다. Run 43839891878은 lost race 2회 뒤 각각 semantic/shared/generated/studentIndexes/fourSlot을 다시 만들었고 attempts=3, persist 1763초였다. 43847844638도 1회 재생성 후 persist 1207초. 반면 경쟁이 없던 43851716722는 persist 5초. 즉 race 재생성은 큰 절감 후보이나 그 차이를 보장 가능한 절감량으로 볼 수는 없다.
- 코드에는 input/output fingerprint 기반 lane cache/NO_OP와 최종 staged-tree digest 수렴 검증이 이미 있다. shared lane은 변경된 output이 없어도 165~213초 걸린 사례가 있어 전체 builder 비용 후보이지만, “매번 전부 재계산”이라고 단정하지 않는다. semantic/4slot의 기존 reuse도 보존해야 한다. 시험지별 증분 빌드, 불변 입력 캐시, 등록 요청 batch 처리가 후보이나 전역 parent-link/catalog/parity/readiness 검증과 직렬 쓰기를 유지하고 전체 결과 동등성을 입증해야 한다. 단순 병렬 write나 검증 제거는 제안하지 않는다.
- PR의 `Prepare and verify PR registration data once` 단계는 PR2283의 관측 115/142/179/232초, PR2224의 1257/779/829/684/272초였다. PR 준비는 요청별 dry-run/write/verify 및 공통 projection 준비의 반복이 비용 후보다. 계획서의 “35 요청 = 42.5분”을 잇는 특정 run 및 실제 요청 수는 **NOT_VERIFIED**라 선형 환산하지 않았다.
- 워크플로 실행 및 writer/timeout/검증 설정 변경: NOT_RUN. 이번 D는 읽기 전용 조사와 제안만 했다.

앞 작업 병합 뒤 합칠 곳: 코드 변경은 main 기준이므로 TASK-03/04가 아직 미병합이면 직접 의존 변경이 있는지 병합 시 확인한다. 이 작업은 운영 데이터·영수증·봉인 파일을 변경하지 않았다.
