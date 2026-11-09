# 20 매산고 고1 1학기 기말 Q12 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q12 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 원점 대칭한 두 중심과 주어진 중심 거리를 그림으로 연결하고, a=2와 a=−2가 모두 가능한 점을 분명히 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 12.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 12); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q12-solution.svg`. Source alt: 원점 대칭인 중심 O(−1,1), O′(1,−1)와 거리 √8 Source caption: a=2인 한 경우의 중심 거리와 반지름을 나타낸다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

원 $O: x^2+y^2+ax-2y-1=0$을 원점에 대하여 대칭이동한 원을 $O'$라고 하자. 원 $O$의 중심과 원 $O'$의 중심 사이의 거리가 $\sqrt8$이라고 할 때, 원 $O$의 넓이는? [4.6점]

Choices:
- $3\pi$
- $5\pi$
- $7\pi$
- $9\pi$
- $11\pi$

Source answer: `①`

Source solution (verbatim from the runtime bank):

완전제곱식을 만들면
$x^2+ax=\left(x+\frac a2\right)^2-\frac{a^2}{4}$
$y^2-2y=(y-1)^2-1$
따라서 원 $O$의 방정식은
$\left(x+\frac a2\right)^2+(y-1)^2=\frac{a^2}{4}+2$이다.
그러므로 중심은 $O\left(-\frac a2,1\right)$이고, 원점 대칭한 원 $O'$의 중심은 $O'\left(\frac a2,-1\right)$이다.
두 중심의 $x$좌표 차는 $a$이고 $y$좌표 차는 $-2$이므로
$OO'^2=a^2+(-2)^2$
$OO'^2=a^2+4$이다.
$OO'=\sqrt8$이므로
$a^2+4=8$
$a^2=4$
원의 반지름 제곱은 $\frac{a^2}{4}+2=3$이다.
원의 넓이는 $3\pi$이므로 정답은 ①이다.

## Draft construction

- Method: For a=2, the center pair is (−1,1) and (1,−1), with distance √8 and equal radii √3.
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

Root geometry inventory required source point `S`, the given origin of reflection, in `displayPoints`; added `S`. No integrated rerun was performed.
Original four-file snapshot(s): `preparation-20-maesan-h1-1final/history/q12-display-inventory-initial`.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `efc32beaf00432cfcde67c0a1748d7ca361e4cfdd2960e9e1d97e143c5b4b520`, `2b4166dedbcd3052dce31c126d11524649308acacd4df57da7d125b6a979afea`, `54906dd4107b3434adf14eb383f71de539070b6e0d6489163d8b3551a6551d23`로 동결된 `coordinates-repaired` / `2026-11-09T01-37-28-625Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
