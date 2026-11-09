# 20 매산고 고1 1학기 기말 Q10 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q10 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 같은 직선 위에서 내분점과 외분점의 순서 및 두 축 조건을 함께 보여 주어 두 비례식의 차이를 분명하게 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 10.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 10); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q10-solution.svg`. Source alt: A, B와 내분점 P, 외분점 Q의 좌표 및 한 직선 위 위치 Source caption: AP:PB=1:2인 P와 QA:QB=1:2인 Q의 순서를 나타낸다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

두 점 $A(1,-1), B(2,2)$에 대하여 선분 $\overline{AB}$를 $a:2$로 내분한 점이 $x$축 위에, 선분 $\overline{AB}$를 $b:2$로 외분한 점이 $y$축 위에 있을 때, $a+b$의 값은? (단, $a,b>0$인 상수) [4.4점]

Choices:
- $0$
- $1$
- $2$
- $3$
- $4$

Source answer: `③`

Source solution (verbatim from the runtime bank):

내분점의 좌표 공식에 따라 선분 AB를 a:2로 내분하는 점 P의 y좌표는
$\dfrac{2(-1)+a\cdot2}{a+2}$이다.
P가 x축 위에 있으므로 이 값은 0이다.
$-2+2a=0$에서 $a=1$이다.

외분점 Q에 대하여 AQ:QB=b:2이다. 외분점의 좌표 공식에 따라 Q의 x좌표는
$\dfrac{2\cdot1-b\cdot2}{2-b}$이다.
Q가 y축 위에 있으므로 이 값은 0이다.
$2-2b=0$에서 $b=1$이다.

따라서 $a+b=1+1=2$이고, 정답은 ③이다.

## Draft construction

- Method: P is between A and B; Q lies beyond A on the same line.
- Mathematical facts are encoded as construction operations or exact translations from the normalized/source frame; derived points are not marked as raw given coordinates.
- Source conditions and any illustrative case limitations are written in `plan.json`; final answer appears only at the end of `publish.json` caption.
- This is a draft intended to help a student follow the exact relationships used in the source solution.

## Verification status

- JSON syntax parse: PASS (Python json parser; item, plan and publish only).
- `construction.validate` / `construction.execute`: NOT_RUN.
- `phase2.specFor`: NOT_RUN.
- Semantic and viewport gates: NOT_RUN.
- Rendering, layout, PNG review, independent visual review, publication: NOT_RUN.
- No stage is claimed PASS or published.

## Geometry-inventory correction

Root geometry-second result: `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayLines`. Added the genuine source coordinate axes `X` and `Y` to `displayLines`. No integrated rerun was performed.
Original four-file snapshot(s): `preparation-20-maesan-h1-1final/history/q10-display-inventory-initial`.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `f67a961e7fa7c61b67068ba4b326d2bb56a1c0bdddd71094d5027fc883a10f94`, `ff6499da8af369c9bad5007022a0ff6299a1da92d24d3d732e32ad9ef446fad4`, `ad4eb4a1b51843d0211ff4b44b3dd24bd1e4e144719fda85c704892a4c99ed50`로 동결된 `coordinates-repaired` / `2026-11-09T01-37-28-625Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
