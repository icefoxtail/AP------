# 20 매산고 고1 1학기 기말 Q09 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q09 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 원과 직선이 두 점에서 만나는 정확한 경계를 접선으로 보여 주어 엄격한 부등식과 정수 개수를 이해하기 쉽게 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 9.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 9); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q9-solution.svg`. Source alt: 두 점에서 만나는 k의 범위와 접선 경계 Source caption: 두 접선의 k값 사이에서 원과 직선은 서로 다른 두 점에서 만난다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

두 점 $(0,1)$과 $(4,1)$을 지름의 양 끝 점으로 하는 원이 직선 $y=-x+k$와 두 점에서 만날 때, 정수 $k$의 개수는? [4.4점]

Choices:
- $1$
- $2$
- $3$
- $4$
- $5$

Source answer: `⑤`

Source solution (verbatim from the runtime bank):

지름의 중점이 원의 중심이므로
$O=\left(\frac{0+4}{2},\frac{1+1}{2}\right)$
$O=(2,1)$이다.
지름의 길이는
$\overline{AB}=\sqrt{(4-0)^2+(1-1)^2}$
$\overline{AB}=4$이므로 반지름은 $r=\frac{AB}{2}=2$이다.
직선 $y=-x+k$를 $x+y-k=0$으로 쓰면 중심 $O$에서 직선까지의 거리는
$d=\frac{|2+1-k|}{\sqrt{1^2+1^2}}$
$d=\frac{|3-k|}{\sqrt2}$이다.
원과 직선이 서로 다른 두 점에서 만나려면 중심과 직선 사이 거리가 반지름보다 작아야 한다.
$\frac{|3-k|}{\sqrt2}<2$
$|3-k|<2\sqrt2$
$-2\sqrt2<3-k<2\sqrt2$
$3-2\sqrt2<k<3+2\sqrt2$
$4<8<9$이므로 $2<2\sqrt2<3$이다.
따라서 $0<3-2\sqrt2<1$이고 $5<3+2\sqrt2<6$이다.
이 범위에 있는 정수 $k$는 $1,2,3,4,5$로 다섯 개이다. 따라서 정답은 ⑤이다.

## Draft construction

- Method: The diameter endpoints determine the exact center and radius.
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

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `8c63f0bff8bc214aa4599a8225a12e344f6a88554aa9bc05cddd977d551939c1`, `04c70a3bbdcd35662bc0785fe91deed80b13efb25895ebbe505d42c48a7e3729`, `aaf7bfd56f5b1f54405cb83586f642df3280ffb044e22c0ce32445e261df0dbb`로 동결된 `final-six` / `2026-11-09T01-29-14-381Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
