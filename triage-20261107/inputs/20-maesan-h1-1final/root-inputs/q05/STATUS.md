# 20 매산고 고1 1학기 기말 Q05 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q05 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 좌표 차를 직각삼각형으로 보여 주어 거리 공식에서 두 제곱항이 어디서 오는지 따라가기 쉽게 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 5.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 5); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q5-solution.svg`. Source alt: A(2,1), B(1,3)과 좌표 차 1, 2를 나타낸 직각삼각형 Source caption: 두 점 사이의 거리를 직각삼각형의 빗변으로 나타낸다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

두 점 $A(a,1), B(1,a+1)$에 대하여 $\overline{AB}=\sqrt5$이고 $a>0$일 때, 상수 $a$의 값은? [4.1점]

Choices:
- $0$
- $1$
- $2$
- $3$
- $4$

Source answer: `③`

Source solution (verbatim from the runtime bank):

두 점 사이 거리의 제곱은 $x$좌표 차와 $y$좌표 차의 제곱의 합이다.
$\overline{AB}^{\,2}=(1-a)^2+((a+1)-1)^2$
$\overline{AB}=\sqrt5$이므로 $\overline{AB}^{\,2}=5$이다.
$(a-1)^2+a^2=5$
$a^2-2a+1+a^2=5$
$2a^2-2a-4=0$
$a^2-a-2=0$
$(a-2)(a+1)=0$
$a=2$ 또는 $a=-1$
조건 $a>0$에 맞는 값은 $a=2$이다. 따라서 정답은 ③이다.

## Draft construction

- Method: The distance is the hypotenuse of a right triangle whose legs are the horizontal and vertical coordinate differences.
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
Original four-file snapshot(s): `preparation-20-maesan-h1-1final/history/q05-display-inventory-initial`, `preparation-20-maesan-h1-1final/history/q05-display-line-initial`.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `ce493c7c958ac7898ccad94980666555c8c45aef0b860b2889aee08007f194a7`, `a29bf39425676c3f098e4cd498ecca3bcc5c89766bbf4e51d588bc8410429f32`, `dc888dc033b02d1699c62adcddf4c6eff5334bfbf14d0ccbf416f2928145464d`로 동결된 `coordinates-repaired` / `2026-11-09T01-37-28-625Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
