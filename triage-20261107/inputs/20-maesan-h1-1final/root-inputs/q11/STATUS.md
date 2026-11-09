# 20 매산고 고1 1학기 기말 Q11 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q11 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 현에 내린 수선이 현을 이등분하는 관계와 반지름·중심거리로 현의 길이를 구하는 순서를 그림으로 이어 준다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 11.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 11); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q11-solution.svg`. Source alt: 중심 C에서 현 AB에 내린 수선의 발 M과 반지름 3인 원 Source caption: 중심에서 현까지의 거리와 반지름으로 현의 절반 길이를 구한다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

원 $x^2+2ax+y^2-6y+4=0$가 $x$축에 접할 때, $y=-x-1$와 원이 만나는 점을 각각 $A,B$라 하자. 선분 $\overline{AB}$의 길이를 구하면? (단, $a>0$인 상수) [4.6점]

Choices:
- $2\sqrt2$
- $2\sqrt5$
- $2\sqrt7$
- $4\sqrt3$
- $4\sqrt5$

Source answer: `③`

Source solution (verbatim from the runtime bank):

완전제곱식을 만들면
$(x+a)^2+(y-3)^2=a^2+5$이다.
원의 중심은 $(-a,3)$, 반지름은 $\sqrt{a^2+5}$이다.
$x$축에 접하므로 반지름은 중심에서 $x$축까지의 거리 $3$과 같다.
$a^2+5=9$이어서 $a=2$이다. (조건 $a>0$ 사용)
따라서 중심은 $C(-2,3)$이고 반지름은 $3$이다.
직선 $y=-x-1$은 $x+y+1=0$이므로 중심에서 직선까지의 거리는
$\dfrac{|-2+3+1|}{\sqrt2}=\sqrt2$이다.
원의 중심에서 현에 내린 수선은 현을 이등분하므로 현의 길이는
$2\sqrt{3^2-(\sqrt2)^2}=2\sqrt7$이다.
정답은 ③이다.

## Draft construction

- Method: The x-axis tangency fixes the radius and center exactly.
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
## Correction note

A static plan inspection found the display line node `CM` and a display segment both used the ID `CM`. The segment ID and its scalar-label owner reference were renamed to `CMsegment`; the construction line node and source-condition mapping remain `CM`. This was a statically confirmed duplicate, not an executed failure.

## Geometry-inventory correction

Root geometry-second result: `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayLines`. Added the genuine source x-axis line `X` to `displayLines`. No integrated rerun was performed.
Original four-file snapshot(s): `preparation-20-maesan-h1-1final/history/q11-display-inventory-initial`.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `d167eff2729e3cd129eb31d0415759b8b05dfb0249e879e36a2d832964910123`, `1667aea09d9fcf280f2b3d35bc1c40238e82265a203e87d7d5266ebc4b3eeb10`, `f82f7f7736e1d02ef11abebc3bd4f2a524405cf0f629f814cfd5c1edf71f7dc1`로 동결된 `coordinates-repaired` / `2026-11-09T01-37-28-625Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
