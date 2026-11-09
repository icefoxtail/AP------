# 20 매산고 고1 1학기 기말 Q08 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q08 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 주어진 점에서 반지름을 읽고, 접점에서 반지름과 접선이 수직인 이유를 그림으로 확인하게 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 8.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 8); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q8-solution.svg`. Source alt: 반지름 5인 원과 기울기가 -1인 두 접선 Source caption: 두 접점에서 원의 반지름은 접선과 수직이고 두 접선은 서로 평행하다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

원 $x^2+y^2=r^2$에 대하여 원 위의 한 점이 $(3,4)$일 때, 기울기가 $-1$인 접선의 방정식을 구하면? [4.3점]

Choices:
- $y=-x\pm5\sqrt2$
- $y=-x\pm5\sqrt3$
- $y=-x\pm5\sqrt5$
- $y=-x\pm6\sqrt2$
- $y=-x\pm6\sqrt3$

Source answer: `①`

Source solution (verbatim from the runtime bank):

$(3,4)$가 원 위에 있으므로 $r^2=3^2+4^2=25$, 따라서 $r=5$이다.
기울기가 $-1$인 직선을 $y=-x+c$, 즉 $x+y-c=0$이라 하자.
원의 중심은 원점이므로 중심에서 이 직선까지의 거리는
$\dfrac{|c|}{\sqrt{1^2+1^2}}=\dfrac{|c|}{\sqrt2}$이다.
접할 때 이 거리는 반지름 $5$와 같으므로 $|c|=5\sqrt2$이다.
따라서 접선은 $y=-x+5\sqrt2$, $y=-x-5\sqrt2$이고, 정답은 ①이다.

## Draft construction

- Method: The given point determines the circle radius 5.
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


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `aab467f60d600e38567637f891fe6de5150c1ae0b7e1ce7e0715d6f7bebd8f40`, `9fc41cbf5ea8a7916b17f242f0e6c6696ce27d8df0aab175fb0ac781fc5e8b65`, `74e466e8e804e0f3dbd18958254519c6c1ad8c86417982699d53e711bcb1ff26`로 동결된 `geometry-second` / `2026-11-09T01-27-49-548Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
