# 20 매산고 고1 1학기 기말 Q07 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q07 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 평행이동 전후 직선의 관계와 수직 조건을 한 장면에서 보이게 해 해설의 기울기 계산을 보완한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 7.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 7); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q7-solution.svg`. Source alt: 평행이동한 직선과 수직 조건을 만족하는 두 직선 Source caption: P가 (1,2)만큼 옮겨진 P′와 세 직선의 관계를 나타낸다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

직선 $ax+2y+1=0$을 $x$축의 방향으로 1만큼, $y$축의 방향으로 $a$만큼 평행이동하면 직선 $ax+2y+b=0$과 일치하고 $-ax+2y+2=0$과 서로 수직일 때, $a+b$의 값은? (단, $a>0$) [4.4점]

Choices:
- $-3$
- $-1$
- $1$
- $3$
- $5$

Source answer: `①`

Source solution (verbatim from the runtime bank):

원래 직선을 오른쪽으로 $1$, 위로 $a$만큼 옮기려면 식의 $x$에 $x-1$, $y$에 $y-a$를 대입한다.
$a(x-1)+2(y-a)+1=0$,
즉 $ax+2y-3a+1=0$이다.
따라서 $b=1-3a$이다.
두 직선의 기울기는 각각 $-\dfrac a2$, $\dfrac a2$이다.
수직이므로 기울기의 곱이 $-1$이다.
$-\dfrac{a^2}{4}=-1$에서 $a^2=4$이고, $a>0$이므로 $a=2$이다.
$b=1-3\cdot2=-5$이므로 $a+b=-3$이다.
정답은 ①이다.

## Draft construction

- Method: The shift vector is (1,2), and the image line remains parallel to the original.
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

Root geometry-second result: `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayLines`. Added genuine source coordinate-axis line `X` to `displayLines`. No integrated rerun was performed.
Original four-file snapshot(s): `preparation-20-maesan-h1-1final/history/q07-display-inventory-initial`, `preparation-20-maesan-h1-1final/history/q07-display-line-initial`.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `888e677398f694da2f8be1ef49db59a2b2cd729601ee59999b331d67ab0b5fa0`, `0ab706f2db6b57fdde22621dac80a6cf3b0d9c70d840f3c373d6242508db6ef9`, `fa401b0503921a892466b5d3d0eabc938bef6bd61715c27cdc0ee111702aa196`로 동결된 `coordinates-repaired` / `2026-11-09T01-37-28-625Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
