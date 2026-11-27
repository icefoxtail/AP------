# 매산여고 고1 1학기 중간 유사 SVG 플랜 전수 점검

- 기준: 2026-11-27, `main` `f888ba8`; 지정된 해당 시험지 JS 23문항 / 문제·해설 46축 전수 분류.
- 동일 폴더의 실행 가능한 `*.plan.json`: 8개. 그중 유사시험지의 SVG 직접 연결축 5개를 모두 포함하며, 원본 기출의 핵심 도형을 추가 복원한 보충 플랜 3개.
- 원문과 `archive/assets/images/26_매산여고_1학기_중간_고1_기출/`, `archive/assets/images/26_매산여고_1학기_중간_고1_유사/`의 그림을 대조. **기출과 유사는 수치·문제가 다를 수 있어 기출 수치를 유사문제로 복사하지 않는다.**
- `plan-lint.cjs --shallow` 및 deep(full): **8/8 OK**, FAIL 0, SKIP 0 (전체 21개 공동 검사).
- **렌더·Chrome 역관측 미완료**: 실행 환경의 `/usr/lib/chromium/chromium` 부재로 `ARCHIVE_PREFLIGHT_FAIL`. 따라서 `DRAWN_FEATURE_PARITY`는 실제 출력 SVG 1:1 최종 PASS가 아니라 **원문·에셋 대비 플랜의 구조적 필드 확인**이다.
- **ENGINE_CAPABILITY_PENDING — TRANSPARENT_CANVAS_OPTION**: 엔진의 번호선·입체·도형 출력에 `<rect fill="#fff">`가 고정 출력된다. 이 라인(시험지 플랜)에서 엔진을 수정하거나 손으로 SVG를 보정하지 않는다. `background:transparent` 같은 지원되는 plan 계약·렌더 옵션이 필요하다.
- 면 채움은 오직 원문 영역 지정(`PQCR`, `S_1/S_2`)에만 사용하고 나머지 그림은 면 채움 없음. 원본의 잘못된/과도한 장식은 의미 관계가 유지되는 범위에서 정밀 교체.

## 문항별 1:1 축 검수

| 문항/축 | 기존결함·판정 | capability | plan경로 | lint shallow/full | DRAWN_FEATURE_PARITY (플랜 단계) |
|---|---|---|---|---|---|
| q01/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q01/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q02/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q02/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q03/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q03/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q04/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q04/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q05/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q05/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q06/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q06/해설 | 원본의 k별 접점 비교가 유사해설에서 생략됨 → k=−1/4 각각 별도 접점; 검수: 원본 그래프·접점 패턴 대조; 계산된 (−1,0),(4,0) | `composite-panels-v1` | [q06-solution.plan.json](./q06-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q07/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q07/해설 | 기존 그래프 경계/꼭짓점의 좌표·수선 가독성 개선; 검수: (−1,6),(2,−3),(4,1), x=−1/4 세로 안내선 | `polynomial-spike-v1` | [q07-solution.plan.json](./q07-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q08/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q08/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q09/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q09/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q10/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q10/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q11/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q11/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q12/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q12/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q13/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q13/해설 | 원본 기출의 포물선·직선 교차 그림 누락 → k=8 사례; 검수: 곡선과 y=−3x+7의 두 교점 | `polynomial-spike-v1` | [q13-solution.plan.json](./q13-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q14/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q14/해설 | 현재 이미지가 t=0 사례만 표시·플랜 EXEMPT → 정답 범위 추가; 검수: 0,3,4 표본값 + 닫힌 t∈[−1,3] | `number-line-figure-v1` | [q14-solution.plan.json](./q14-solution.plan.json) | OK/OK | REDESIGNED_RELATION_1:1 / RENDER_UNVERIFIED |
| q15/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q15/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q16/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q16/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q17/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q17/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q18/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q18/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q19/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q19/해설 | UNSUPPORTED 구식 판정·두 포물선 그래프 미생성; 검수: f·g 서로 다른 색, V(2,−3),W(3,10), 공통점 (0,1),(5,6) | `piecewise-polynomial-spike-v1` | [q19-solution.plan.json](./q19-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q20/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q20/해설 | 기존 SVG의 t/임의 점 표기가 조건의 해집합을 분명하게 나타내지 않음·EXEMPT; 검수: 정답 1≤a≤2, 닫힌 구간 표식 | `number-line-figure-v1` | [q20-solution.plan.json](./q20-solution.plan.json) | OK/OK | REDESIGNED_RELATION_1:1 / RENDER_UNVERIFIED |
| q21/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q21/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q22/문제 | AB/AC=12·PR∥BC 표시 부족, 직각/수선은 보존; 검수: A·Q 직각, AB=AC=12, PR∥BC, P/Q/R, 영역 PQCR | `construction-spike-v1` | [q22-problem.plan.json](./q22-problem.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q22/해설 | △APR·△BPQ에 불필요한 파란/주황 면 채움; 검수: A·Q 직각, x/12−x, ∠B=45°, PR∥BC, PQCR만 연한 강조 | `construction-spike-v1` | [q22-solution.plan.json](./q22-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q23/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q23/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |

## 잔여 엔진 기능·릴리스 게이트

- 플랜 필드에 있는 각 점·길이·선·점선·영역은 린트의 모델/식 검증을 통과했지만, SVG 픽셀 출력·라벨 충돌·배경의 최종 확인은 **PENDING**이다.
- `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`: 흰색 기본 캔버스 제거(전역).
- 렌더/독립 관측 환경 정상화 후 모든 8개 플랜에서 `DRAWN_FEATURE_PARITY`를 최종 SVG 레이어·라벨·투명도까지 다시 1:1 확인해야 학생 운영 SVG 교체가 가능하다.

## 검사 명령

```bash
find archive/tools/geometry-equation/production/plans/26_매산여고_1학기_중간_고1_유사 -name '*.plan.json' -print0 | xargs -0 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow
find archive/tools/geometry-equation/production/plans/26_매산여고_1학기_중간_고1_유사 -name '*.plan.json' -print0 | xargs -0 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs
```
