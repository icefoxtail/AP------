# 복성고 고1 1학기 중간 유사 SVG 플랜 전수 점검

- 기준: 2026-11-27, `main` `f888ba8`; 지정된 해당 시험지 JS 24문항 / 문제·해설 48축 전수 분류.
- 동일 폴더의 실행 가능한 `*.plan.json`: 13개. 그중 유사시험지의 SVG 직접 연결축 8개를 모두 포함하며, 원본 기출의 핵심 도형을 추가 복원한 보충 플랜 5개.
- 원문과 `archive/assets/images/26_복성고_1학기_중간_고1_기출/`, `archive/assets/images/26_복성고_1학기_중간_고1_유사/`의 그림을 대조. **기출과 유사는 수치·문제가 다를 수 있어 기출 수치를 유사문제로 복사하지 않는다.**
- `plan-lint.cjs --shallow` 및 deep(full): **13/13 OK**, FAIL 0, SKIP 0 (전체 21개 공동 검사).
- **렌더·Chrome 역관측 미완료**: 실행 환경의 `/usr/lib/chromium/chromium` 부재로 `ARCHIVE_PREFLIGHT_FAIL`. 따라서 `DRAWN_FEATURE_PARITY`는 실제 출력 SVG 1:1 최종 PASS가 아니라 **원문·에셋 대비 플랜의 구조적 필드 확인**이다.
- **ENGINE_CAPABILITY_PENDING — TRANSPARENT_CANVAS_OPTION**: 엔진의 번호선·입체·도형 출력에 `<rect fill="#fff">`가 고정 출력된다. 이 라인(시험지 플랜)에서 엔진을 수정하거나 손으로 SVG를 보정하지 않는다. `background:transparent` 같은 지원되는 plan 계약·렌더 옵션이 필요하다.
- 면 채움은 오직 원문 영역 지정(`PQCR`, `S_1/S_2`)에만 사용하고 나머지 그림은 면 채움 없음. 원본의 잘못된/과도한 장식은 의미 관계가 유지되는 범위에서 정밀 교체.

## 문항별 1:1 축 검수

| 문항/축 | 기존결함·판정 | capability | plan경로 | lint shallow/full | DRAWN_FEATURE_PARITY (플랜 단계) |
|---|---|---|---|---|---|
| q01/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q01/해설 | 원본 3개 직선 교점 비교 해설 그래프 누락; 검수: (가) x축 두 점/(나) 만나지 않음/(다) 두 점, 세 패널 | `composite-panels-v1` | [q01-solution.plan.json](./q01-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q02/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q02/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q03/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q03/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q04/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q04/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q05/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q05/해설 | 구식 UNSUPPORTED 판정으로 입체도형·삼각형 AFC 생략; 검수: A~H, 숨은 모서리 점선, AF/FC/AC 굵은 면대각선 | `solid-figure-v1` | [q05-solution.plan.json](./q05-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q06/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q06/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q07/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q07/해설 | 원본 두 이차함수와 공통 직선 비교 누락; 검수: k=0에서 두 포물선과 y=−x의 비접촉, 두 패널 | `composite-panels-v1` | [q07-solution.plan.json](./q07-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q08/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q08/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q09/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q09/해설 | 구간 경계/최고점 라벨 정밀 검수; 검수: x=−2/3,2, 꼭짓점(2/3,16/3) | `polynomial-spike-v1` | [q09-solution.plan.json](./q09-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q10/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q10/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q11/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q11/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 (원본 기출 그림의 수치/사건이 달라 해당 SVG 직접 재사용 불가) | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q12/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q12/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q13/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q13/해설 | 함숫값/근/축 라벨 유지·교차 표식 검수; 검수: 절편(2,0),(8,0),(0,16), 점(3,−5), 꼭짓점(5,−9) | `polynomial-spike-v1` | [q13-solution.plan.json](./q13-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q14/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q14/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 (원본 기출 그림의 수치/사건이 달라 해당 SVG 직접 재사용 불가) | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q15/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q15/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q16/문제 | 문제 그림에서 α·β 길이 라벨 누락; 검수: B 직각, A/B/C/D/P/Q, AB=α,BC=β | `construction-spike-v1` | [q16-problem.plan.json](./q16-problem.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q16/해설 | 해설 그림 BP=u,BQ=v 길이 라벨 누락; 검수: 직각 B, 직사각형 BPDQ, BP=u,BQ=v, D∈AC | `construction-spike-v1` | [q16-solution.plan.json](./q16-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q17/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q17/해설 | 복소평면 원 그림 있음에도 기존 EXEMPT, 보조선/좌표 계획 없음; 검수: 반지름 2, 점 (±√3,±1), AB/CD 보조선은 실선 (원본은 점선) | `construction-spike-v1` | [q17-solution.plan.json](./q17-solution.plan.json) | OK/OK | PARTIAL — ENGINE_CAPABILITY_PENDING:COMPLEX_PLANE_AXIS_TITLES(Re/Im)+COORDINATE_DASHED_GUIDES; RENDER_UNVERIFIED |
| q18/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q18/해설 | S1/S2 구별·보조선·모든 꼭짓점 원본 대비 검토; 검수: B(−3,0),O,D(0,18),C(−6,36),A(6,0), S1/S2 각기 다른 면 | `polynomial-spike-v1` | [q18-solution.plan.json](./q18-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q19/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q19/해설 | 근호 좌표를 지원하지 않는다는 구식 UNSUPPORTED; 검수: 정사각형 6, O 정확한 근호, 반지름, P/Q,BP=2, 접선·원호 | `construction-spike-v1` | [q19-solution.plan.json](./q19-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q20/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q20/해설 | 원본 두 포물선의 접선 그래프 미재현; 검수: k=√5, 두 곡선 정확한 계수, 접점((3−√5)/2,4) | `piecewise-polynomial-spike-v1` | [q20-solution.plan.json](./q20-solution.plan.json) | OK/OK | SOURCE_RELATION_1:1 / RENDER_UNVERIFIED |
| q21/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q21/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q22/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q22/해설 | 꼭짓점의 구간 밖 위치·끝값 식별 검수; 검수: [1,3], (1,8),(3,18), 꼭짓점(9/2,81/4) | `polynomial-spike-v1` | [q22-solution.plan.json](./q22-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q23/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q23/해설 | 좌우 대칭·끝값·해설 점 라벨 검수; 검수: [0,6], (0,4/5),(6,4/5), (5,29/5), 꼭짓점(3,49/5) | `polynomial-spike-v1` | [q23-solution.plan.json](./q23-solution.plan.json) | OK/OK | STRUCTURAL_1:1 / RENDER_UNVERIFIED |
| q24/문제 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |
| q24/해설 | 유사 원문에 문제/해설 SVG 연결 없음. 도형 없이 텍스트·수식으로 관계가 완결되는 축 | — (TEXT_ONLY) | — | N/A | N/A — NO_DRAWN_FEATURE |

## 잔여 엔진 기능·릴리스 게이트

- 플랜 필드에 있는 각 점·길이·선·점선·영역은 린트의 모델/식 검증을 통과했지만, SVG 픽셀 출력·라벨 충돌·배경의 최종 확인은 **PENDING**이다.
- `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`: 흰색 기본 캔버스 제거(전역).
- `ENGINE_CAPABILITY_PENDING:COMPLEX_PLANE_AXIS_TITLES`: 복성고 q17/해설의 Re·Im 축 제목을 construction-spike-v1에서 명시하는 기능. 현재 플랜은 수학적으로 동일한 좌표 x,y를 쓰며 원본과 글자 1:1은 미달이다.
- `ENGINE_CAPABILITY_PENDING:COORDINATE_DASHED_GUIDES`: 복성고 q17/해설의 좌표평면 내 AB·CD 보조선을 점선으로 출력하는 옵션. `displaySegments[].dashed`는 PLANE_FIGURE_v1에만 허용되므로 좌표평면에서는 거절된다. 현재 플랜은 정확한 위치의 실선 보조선으로 처리한 부분 패리티이다.
- 렌더/독립 관측 환경 정상화 후 모든 13개 플랜에서 `DRAWN_FEATURE_PARITY`를 최종 SVG 레이어·라벨·투명도까지 다시 1:1 확인해야 학생 운영 SVG 교체가 가능하다.

## 검사 명령

```bash
find archive/tools/geometry-equation/production/plans/26_복성고_1학기_중간_고1_유사 -name '*.plan.json' -print0 | xargs -0 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow
find archive/tools/geometry-equation/production/plans/26_복성고_1학기_중간_고1_유사 -name '*.plan.json' -print0 | xargs -0 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs
```
