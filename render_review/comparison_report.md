# Archive 해설 실제 렌더 비교

## 기준과 입력

- 렌더러 기준은 local `main`의 `archive/engine.html`과 해당 화면/해설 실행기, CSS, pagination 코드다.
- local `main` HEAD: `7521d08098b92ae83c62e8a8f430d885e46581ba`
- `origin/main`: `522c915eaa0c9e54bf43f3884f809d65075e1dbe` (local `main`보다 2 commits 앞섬). 요청대로 fetch나 branch 이동 없이 local `main`을 사용했다.
- 격리 사본의 Git blob ID가 local `main`과 일치함을 확인했다: `engine.html` `0a7f5ebb3949c1896ef0f8aed49e6ad6d90ecc95`, `solution-render-executor.js` `fcd49bd93398bc7f8244afabbed2571dd130ace2`, `screen-runtime-adapter.js` `95ade2458bcaf8f755b8265a4e9e918d56be9268`, `layout-authority.js` `4b3aee176128072d98bcacd3753d6e6290766b0a`.
- 순천고 solution 권한 입력: `25년_2학기중간_고1_순천고_해설가독성_q14_1건수정본.zip` 안의 JS. ZIP SHA-256 `88DC16F44AA34E6BEDC17D78FC5A97DDD38B774FB4D11FC750C812E965822D03`, JS SHA-256 `9298F3A8C2539E0770699BB4EAF464F84B7DD6ADC33A196950B8E1F816F254D7`.
- 금당고 solution 권한 입력: `25년_2학기중간_고1_금당고_작은칠판_재조판_결과.zip` 안의 JS. ZIP SHA-256 `E27796211B1CA5AB5FF1BA805B0750FBDFF3FE4916560B557533B2C1FDE9FFC0`, JS SHA-256 `4423E6CA38BB27E6415269A00DD90A9CBEEF7E02767667D0ACF8F49FF8243CC5`.
- 두 ZIP의 JS를 격리된 archive 경로에만 배치했다. 현재 production JS를 solution 입력으로 쓰지 않았다. SVG와 problem 이미지 경로는 local `main`의 이미지 사본으로 충족했다.

## 렌더 조건

- Chrome `153.0.8010.53`의 실제 headless Blink renderer, PC viewport `1440 × 1100`, device scale factor 1, page zoom 100%.
- 두 건 모두 `mode=sol`, 현재 기본 `batch` renderer, 새 BrowserContext, browser cache 비활성화, service worker 우회로 실행했다.
- 화면에서 `document.fonts.ready`, local MathJax `4.1.3` startup/typeset, 모든 이미지 decode를 기다렸다. 두 건 모두 font readiness `loaded`, MathJax source `local`, renderer 완료 후 `unrenderedMath=0`이었다.
- renderer, CSS, solution 데이터, 줄바꿈은 수정하지 않았고 임시 CSS도 넣지 않았다.
- 각 `.page`를 Chrome 화면에서 PNG로 캡처하고, 19장과 18장의 page PNG를 각각 직접 열어 전 페이지를 확인했다. 같은 렌더의 Chrome PDF도 저장했다. 각 학교의 화면 page 수, PNG 수, PDF page 수가 일치한다.

## 수치 비교

| 시험지 | 문항 | solution source 줄 수 | 빈 줄 | 비어 있지 않은 줄 | 실제 화면/PDF 쪽수 | 여러 열·쪽 fragment가 있는 문항 | 물리 쪽을 넘긴 continuation | 시각적으로 과도한 source 간격 | autoCompress 적용 | 깨진 이미지 | 화면 overflow / clipping |
|---|---:|---:|---:|---:|---:|---|---|---|---:|---:|---:|
| 순천고, 재조판 전 | 23 | 1,001 | 452 | 549 | 19 / 19 | 15문항 | q8, q9, q10 (3문항) | 3문항: q2, q14, q15 | 0 | 0 / 16 | 0 |
| 금당고, 재조판 후 | 22 | 690 | 23 | 667 | 18 / 18 | 12문항 | q22 (1문항) | 0문항 | 0 | 0 / 22 | 0 |

“여러 열·쪽 fragment”는 solution DOM에서 문항이 복수 fragment로 나뉜 경우다. 그중 “물리 쪽을 넘긴 continuation”은 fragment가 서로 다른 `.page`에 나타난 문항만 센다. 빈 source line은 `solution.split(/\r?\n/)` 기준으로 포함해 세었다.

두 학교 모두 solution 문항 수와 출력 문항 수가 일치했다. MathJax는 준비 완료였고, 문제/해설 이미지가 모두 로드됐다. 브라우저 전체 문서의 가로 overflow는 없고, 직접 연 37개 page capture에서도 잘림은 보이지 않았다. DOM 폭 비교에서 일부 MathJax 내부 stretch/분수 노드가 작은 `scrollWidth` 차이를 보였지만, 페이지 밖으로 넘치거나 캡처에서 잘린 현상은 아니었다. 글씨 축소용 autoCompress inline style은 어느 문항에도 적용되지 않았다.

## 실제 화면에서 본 차이

### 순천고: 빈 source line이 화면 공백으로 이어짐

빈 줄 452개는 전체 source line의 약 45.2%다. 실제 캡처에서도 빈 줄 간격이 해설 높이에 직접 반영돼 q2, q14, q15가 특히 느슨하고 길게 보인다. 대표 화면은 [q2, 1쪽](suncheon_before_reflow/pages/page-01.png), [q14, 10쪽](suncheon_before_reflow/pages/page-10.png), [q15, 11쪽](suncheon_before_reflow/pages/page-11.png)이다. q8~q10은 여러 열/물리 쪽에 걸쳐 이어진다. 이 점은 source spacing과 continuation 배치 현상을 따로 구분해야 한다.

### 금당고: 작은 칠판 재조판으로 본문 흐름이 촘촘해짐

빈 줄은 452개에서 23개로 429개, 약 94.9% 줄었다. 비어 있지 않은 풀이 줄은 549개에서 667개로 늘었지만, 실제 output은 19쪽에서 18쪽으로 한 쪽 줄었다. q18 [13쪽](geumdang_after_reflow/pages/page-13.png), q19 [14쪽](geumdang_after_reflow/pages/page-14.png)은 설명, 식, 다음 계산이 더 연속적으로 읽힌다. 두 solution 모두 화면상 세로 여백이 줄었고, `solutionImage`도 풀이를 가로막지 않고 각 해설의 앞부분에서 보조 역할을 한다.

### 재조판 뒤에도 남은 pagination 결함

금당고에서는 q9 [5쪽](geumdang_after_reflow/pages/page-05.png), q15 [10쪽](geumdang_after_reflow/pages/page-10.png), q20 [15쪽](geumdang_after_reflow/pages/page-15.png)의 끝부분이 다음 열 위쪽에 한두 줄만 남고 열의 나머지가 비어 있다. q22는 [17쪽](geumdang_after_reflow/pages/page-17.png)에서 거의 끝난 뒤 마지막 두 줄이 [18쪽](geumdang_after_reflow/pages/page-18.png)으로 넘어가, 마지막 쪽 대부분이 비어 있다. 이 공백은 source blank line 때문이 아니다. q22는 source 빈 줄이 4개뿐이며, q18/q19는 각각 2개다.

## 핵심 질문에 대한 답

1. **순천고 해설은 화면에서도 빈 줄 때문에 늘어져 보이는가?** 그렇다. 특히 q2, q14, q15 캡처에서 source blank line과 화면의 큰 문단 간격이 그대로 대응한다.
2. **금당고 재조판 후 작은 칠판처럼 더 자연스러운가?** 그렇다. q18/q19와 전체 page 수·빈 줄 수가 이를 뒷받침한다. 다만 q9/q15/q20/q22의 끝부분 배치 문제는 별도로 남는다.
3. **현재 renderer의 `\n` / `\n\n` 처리를 구조적으로 바꿔야 하는가?** 이번 비교만으로는 전역 newline parser 변경이 필요하다고 보이지 않는다. 원본 빈 줄 452개가 23개로 줄자 화면 간격도 실제로 개선됐다.
4. **source 재조판만으로 충분한가?** source 공백으로 인한 늘어짐을 해결하는 데는 충분하다. renderer의 열/쪽 끝에서 생기는 짧은 continuation은 source 재조판만으로 해결되지 않았다.
5. **renderer를 개선한다면 최소 수정 범위는 무엇인가?** 한두 줄만 다음 열/쪽 상단에 고립시키는 widow/orphan 배치를 줄이는 column/page balancing 또는 최소 continuation 크기 규칙이 근거 있는 후보이다. 문장·수식을 끊지 않고, 기존 글자 크기와 source 줄바꿈 의미를 유지하는 범위가 적절하다. 코드 수정은 하지 않았다.

## 정리: 해결된 점과 남은 점

- **A. 데이터 재조판으로 해결:** 순천고의 과도한 blank-line spacing. 금당고는 source 빈 줄을 94.9% 줄였고 화면에서 풀이가 연속적으로 보인다.
- **B. renderer 개선이 필요해 보이는 점:** 적은 양의 결론만 다음 열/쪽으로 넘겨 큰 빈 공간을 남기는 pagination. 가장 분명한 사례는 금당고 q22의 18쪽이다.
- **C. 아직 판단하기 어려운 점:** 실제 프린터/다른 기기에서의 글꼴 대체와 인쇄 오차. 이번 기준은 local `main` renderer의 동일한 PC Chrome 조건이다.

## 저장 위치 및 변경 상태

- 전체 문서 긴 PNG와 PDF는 학교별 폴더에 있다. 페이지별 PNG는 각 폴더의 `pages/`에 순서대로 저장했다.
- 대표 비교 화면은 [compare/index.html](compare/index.html)에서 나란히 볼 수 있다.
- 엔진 변경 0, 이번 작업의 production 데이터 변경 0. 기존 dirty/staged 상태는 건드리지 않았다. commit/push 없음.
