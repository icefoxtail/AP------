# 20 매산고 고1 1학기 기말 Q13 — local visual draft

Status: DRAFT_ONLY / NOT_READY  
Owner: UNKNOWN  
Scope: Q13 only; local draft files only. The original exam JS and legacy solution SVG/PNG assets remain untouched.  
Replacement rationale: 직선의 대칭을 점의 반사로 구성하고, 반사된 직선이 원의 중심을 지나면 원을 이등분한다는 핵심을 눈으로 확인하게 한다.

## Source identity

- Source: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 13.
- Source snapshot: `preparation-20-maesan-h1-1final/source-runtime-bank.json` (runtime entry id 13); source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`; source Git blob `830a02dfed7703f109a615015e658aadc3def794`; base `ca13990f5ba49e16af134945e3c26bf35d7a89c5`.
- Legacy visual reference: `assets/images/20_매산고_1학기_기말_고1_기출/q13-solution.svg`. Source alt: 직선 y=x 대칭 후 원 중심 C(1,−1)을 지나는 직선과 원 Source caption: 반사된 직선이 원의 중심을 지나면 원을 이등분한다. Size: full.
- Legacy SVG/PNG is preserved; this draft does not overwrite it or alter the original source.

## Exact source question

직선 $2x-y+3=0$을 직선 $y=x$에 대하여 대칭이동한 직선이 원 $x^2-2x+y^2+ay+a^2-14=0$을 이등분할 때, 상수 $a^2$의 값은? [4.6점]

Choices:
- $2$
- $4$
- $6$
- $8$
- $10$

Source answer: `②`

Source solution (verbatim from the runtime bank):

직선 $y=x$에 대한 대칭이동은 $x$와 $y$를 서로 바꾸는 것이므로
$2y-x+3=0$이다.
원 방정식을 완전제곱식으로 바꾸면
$(x-1)^2+\left(y+\frac a2\right)^2=15-\frac{3a^2}{4}$이다.
따라서 원의 중심은 $\left(1,-\frac a2\right)$이다.
직선이 원을 이등분하려면 원의 중심을 지나야 한다.
중심을 반사된 직선에 대입하면
$2\left(-\frac a2\right)-1+3=0$
$-a+2=0$
$a=2$
따라서 $a^2=4$이고 정답은 ②이다.

## Draft construction

- Method: The source line and reflected line meet on the reflection axis; the reflected line is built from the mirrored points.
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

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `7e587d7654316e3f2fcc03db055307d019f0b21794611dc62669c189d5b908f8`, `ae9d31c30ee0421a160bb6e26afb3f076cdebb9e8bbc9b66703303967a55ea41`, `575e2a4bc832fc670309daf94d8be03165829263e02b4181509a00cde3fe7ed1`로 동결된 `final-six` / `2026-11-09T01-29-14-381Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
