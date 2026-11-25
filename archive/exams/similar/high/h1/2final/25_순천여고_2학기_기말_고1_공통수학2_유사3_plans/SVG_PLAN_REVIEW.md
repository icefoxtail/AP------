# 25 순천여고 2학기 기말 고1 공통수학2 유사3 — 그림 플랜 2축 검수

## 범위와 판정 규약

- 검사 대상: `archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3.js`, 원본 21문항(Q01–Q21)과 문제/해설 총 42축. 검수 시작 시 기준 `main`: `899f8d6b18d8258dce66daafa8bab42227350d93`; 시험지 blob `eb889788ff0e31ca330250bf2ede838d11d24001`.
- `archive/exams/similar/high/h1/1mid/25_제일고*1학기*중간*고1*유사.js`는 열린 [PR #3056](https://github.com/icefoxtail/AP------/pull/3056)의 Q01–Q22와 중복되어 **작업하지 않음**. 이 배치의 실제 작업 범위는 유사3 21문항뿐이다.
- `REQUIRED`: 문제 원문 자체에서 도형·그래프·대응도가 정보 전달에 필수. `BENEFICIAL`: 해설의 논리와 수치 관계를 그림으로 확인하면 도움. `EXEMPT`: 장식, 순수 대수식, 표 없는 문장형 진리판정으로 별도 도형이 정보를 더하지 않음. 양 축을 독립 판정한다.
- 새 JSON은 이 파일과 같은 `_plans/`에 저장하며 아래 `N/`으로 표시한다. 과거에 작성되어 정상 작동하는 플랜은 `L/`로 표시한다(`L/` = `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3/`). `L/` 플랜은 **수정하지 않고 재검증**한다. 원본 JS·그림 SVG·유형은행·교과서는 변경하지 않는다.
- `DRAWN_FEATURE_PARITY=PASS`는 원문 문항·해설에서 요구하는 **그려져야 할** 좌표, 수식별 그래프, 선분, 직선, 집합 라벨, 화살표, 직각, 길이의 의미를 해당 plan의 실제 선언 필드와 수작업으로 1:1 대조해 일치하고 `plan-lint`의 독립 엔진 검증이 성공했다는 뜻이다. 이는 인쇄물 시각 검수나 원본 PNG 픽셀 일치를 뜻하지 않는다. EXEMPT 축은 `N/A`이다. 모든 필요한 primitive가 지원되어 `ENGINE_CAPABILITY_PENDING`은 없다.

## 문항별 문제·해설 2축

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint(shallow/full) | DRAWN_FEATURE_PARITY | EXEMPT 사유·실제 필드 1:1 대조 |
|---|---|---|---|---|---|---|---|
| 유사3/Q01 | 문제 | EXEMPT | — | — | — | N/A | 자연수 전체집합에서 이차부등식 명제의 부정만 물음. 도형 필드 없음. |
| 유사3/Q01 | 해설 | EXEMPT | — | — | — | N/A | `(x-2)(x-6)<0`, 원소 3·4·5와 합 12의 계산식; 수직선은 정보 중복. |
| 유사3/Q02 | 문제 | EXEMPT | — | — | — | N/A | 복소수·무리수·이차식의 명제 참거짓 보기만 있음. |
| 유사3/Q02 | 해설 | EXEMPT | — | — | — | N/A | 반례, 전개, 완전제곱식으로 참거짓 검증; 공간 관계 없음. |
| 유사3/Q03 | 문제 | EXEMPT | — | — | — | N/A | 홀짝 명제의 대우 증명 빈칸에 대한 문자식. |
| 유사3/Q03 | 해설 | EXEMPT | — | — | — | N/A | `n=2k+1`, `n²+2n=4(k²+2k)+3` 대수 전개. |
| 유사3/Q04 | 문제 | EXEMPT | — | — | — | N/A | 실수쌍에 관한 `p,q,r`의 조건과 보기 문장만 있음. |
| 유사3/Q04 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `N/q04-solution.plan.json` | OK/OK | PASS | **이름 `P=Q`가 보이는 안쪽 원** ⊂ `R`, `(1,1)`∈P·R, `(2,-1)`∈R만: `diagram.sets/subset/elements`; 기존 L 플랜의 빠진 Q 라벨 보완. |
| 유사3/Q05 | 문제 | EXEMPT | — | — | — | N/A | `(가) P∪Q=Q`, `(나) Q∩Rᶜ=Q` 집합식으로만 제시. |
| 유사3/Q05 | 해설 | BENEFICIAL | `composite-panels-v1` | `N/q05-solution.plan.json` | OK/OK | PASS | 패널 1 `P⊂Q`, 패널 2 `Q∩R=∅`; `panels[*].plan.diagram.subset/disjoint/elements`, 예시 U={1,2,3,4}, P={1}, Q={1,2}, R={3}. 기존 L 플랜에 빠졌던 Q 관계 보완. 두 패널 모두 무색칠. |
| 유사3/Q06 | 문제 | EXEMPT | — | — | — | N/A | 양수 x,y의 유리·다항식 최솟값 대수 문제. |
| 유사3/Q06 | 해설 | EXEMPT | — | — | — | N/A | `s=2x+4y` 치환, `(x-1)²`, 산술기하평균 등호 조건만 사용. |
| 유사3/Q07 | 문제 | REQUIRED | `construction-spike-v1` | `L/q7-problem.json` | OK/OK | PASS | ①–⑤ **다섯 좌표 그래프**와 열린/닫힌 점, 가지·선분, 각 선택지의 정의역·치역 판정 근거: `mathPlan.nodes`, `displayPoints` 49개, `displaySegments` 33개, 답 선택 표시는 별도 없음. |
| 유사3/Q07 | 해설 | EXEMPT | — | — | — | N/A | 이미 문제에 나타난 5개 그래프의 수평선 판정(③만 일대일대응)을 글로 설명; 별도 중복 그림 불필요. |
| 유사3/Q08 | 문제 | EXEMPT | — | — | — | N/A | `f(2x-3)=4x+1`과 역함수값 한 개의 계산. |
| 유사3/Q08 | 해설 | EXEMPT | — | — | — | N/A | `f(-1)=5` 대입으로 종료하는 대수식. |
| 유사3/Q09 | 문제 | REQUIRED | `set-diagram-figure-v1` | `L/q9-problem.json` | OK/OK | PASS | 세 열 모두 X={1,2,3,4}; f 화살표 `1→4,2→1,3→2,4→3`와 g 화살표 `1→3,2→4,3→1,4→2` **8개**; `diagram.columns/arrows/arrowGroups(f,g)`. 정답 h는 노출하지 않음. |
| 유사3/Q09 | 해설 | BENEFICIAL | `set-diagram-figure-v1` | `L/q9-solution.json` | OK/OK | PASS | `h∘f=g`: f 화살표 유지, h는 `1→4,2→1,3→2,4→3` **4개**; `diagram.arrowGroups(f,h)`와 두 그룹 `arrows` 총 8개. |
| 유사3/Q10 | 문제 | EXEMPT | — | — | — | N/A | 일차함수 f의 합성과 역함수값을 식으로 요구. |
| 유사3/Q10 | 해설 | EXEMPT | — | — | — | N/A | 계수비교 `a=2,b=3`, 대입계산만 필요. |
| 유사3/Q11 | 문제 | EXEMPT | — | — | — | N/A | 이차함수식, 역함수 존재 조건, 역함수 정의역의 문장. |
| 유사3/Q11 | 해설 | BENEFICIAL | `piecewise-polynomial-spike-v1` | `L/q11-solution.json` | OK/OK | PASS | 포물선 계수 `[12,-6,1]`, 꼭짓점 `V(3,3)`, 직선 `y=x+2`, 교점 `B(2,4)`·`A(5,7)`; `graphPlan.pieces/requiredPoints/overlays.lines`, `a≥3`으로 B 제외. |
| 유사3/Q12 | 문제 | EXEMPT | — | — | — | N/A | 유리식 정의역 x≠−3, 치역 y≠4, 통과점 (−1,1)의 문장. |
| 유사3/Q12 | 해설 | BENEFICIAL | `rational-spike-v1` | `L/q12-solution.json` | OK/OK | PASS | `y=(4x+6)/(x+3)`, 점근선 x=−3,y=4, `A(−1,1)` 및 보조 절편 `(−3/2,0),(0,2)`; `graphPlan.numerator/denominator/overlays.points/callouts`. |
| 유사3/Q13 | 문제 | EXEMPT | — | — | — | N/A | 주어진 유리함수와 x축 대칭·평행이동의 판별을 식과 문장으로 요구. |
| 유사3/Q13 | 해설 | EXEMPT | — | — | — | N/A | 분수함수 `3+2/(x−2)`와 x축 반사 `−3−2/(x−2)`의 상수항·부호 비교로 완결; 사용되지 않는 장식성 SVG 파일은 축 근거가 아님. |
| 유사3/Q14 | 문제 | EXEMPT | — | — | — | N/A | 유리식 `f∘f=x`, `f(0)=−1` 대수 조건. |
| 유사3/Q14 | 해설 | BENEFICIAL | `rational-spike-v1` | `L/q14-solution.json` | OK/OK | PASS | `(-2x−2)/(x+2)`, 대칭선 `y=x`, 점근선 x=−2,y=−2, `A(0,−1),B(−1,0),C(−2,−2)`; `graphPlan.numerator/denominator/overlays.lines/points/callouts`. |
| 유사3/Q15 | 문제 | REQUIRED | `rational-spike-v1` | `L/q15-problem.json` | OK/OK | PASS | `y=k/x(k>0)`와 `y=−x+6`, 제1사분면 교점 P,Q는 `graphPlan`과 `overlays.lines/points`에 각각 대응. numerator의 내부 값은 형상을 만들기 위한 수치이지만 화면 수식은 **`y=k/x`**, k=13/2와 보조선/답은 비노출. |
| 유사3/Q15 | 해설 | BENEFICIAL | `rational-spike-v1` | `N/q15-solution.plan.json` | OK/OK | PASS | 동일 곡선·직선·교점 P,Q, 보조점 R=(v,v), **PR, RQ, PQ 선분**(`overlays.segments`), R 직각(`rightAngles`), `PQ=2√5` 길이(`length:true`). **면 채움 0**: 기존 L 해설의 `fill:LIGHT` 제거. |
| 유사3/Q16 | 문제 | EXEMPT | — | — | — | N/A | `(3x+1)/(x−3)`의 합성·방정식 식만 있음. |
| 유사3/Q16 | 해설 | EXEMPT | — | — | — | N/A | 분수식 통분으로 `f(f(x))=x`; 근 두 개의 배제는 대수 조건. |
| 유사3/Q17 | 문제 | EXEMPT | — | — | — | N/A | `y=−√(2x+4)+3`과 직선 `y=−x+k`의 교점 개수만 진술. |
| 유사3/Q17 | 해설 | BENEFICIAL | `sqrt-affine-spike-v1` | `N/q17-solution.plan.json` | OK/OK | PASS | 근호함수의 시작 `A(−2,3)`, 경계선 `y=−x+1` 및 점선 접선 `y=−x+1/2`, `B(0,1)`, 접점 `T(−3/2,2)`의 **좌표·직선 라벨**을 `graphPlan.overlays`에 모두 그림. |
| 유사3/Q18 | 문제 | REQUIRED | `piecewise-polynomial-spike-v1` | `L/q18-problem.json` | OK/OK | PASS | 끝점 `(0,0),(2,1)`, 꺾임 `(1,2)`를 두 선분 `2x`·`3−x`로 정확히 연결; `sourceDomain:[0,2]` 양 끝 닫힘. 결과값·보조선은 비노출. |
| 유사3/Q18 | 해설 | BENEFICIAL | `piecewise-polynomial-spike-v1` | `N/q18-solution.plan.json` | OK/OK | PASS | 원래 꺾은선 세 점 + `y=(x+1)/2`와 P(1/3,2/3)·Q(5/3,4/3), 두 수평선 y=1/3,y=5/3 및 교점 `X₁(1/6,1/3),X₂(5/6,5/3),X₃(4/3,5/3)`를 `overlays.lines/points`로 연결·좌표 표시. |
| 유사3/Q19 | 문제 | EXEMPT | — | — | — | N/A | 두 구간의 다항함수 조건식과 역함수 관계를 문장으로 진술. |
| 유사3/Q19 | 해설 | BENEFICIAL | `piecewise-polynomial-spike-v1` | `L/q19-solution.json` | OK/OK | PASS | x<−1에서 `−x²−2x−4`, x≥−1에서 `x²+2x−2`, 접합 `V(−1,−3)`, `A(0,−2),B(−2,−4)`; `graphPlan.pieces/requiredPoints`. |
| 유사3/Q20 | 문제 | EXEMPT | — | — | — | N/A | 자연수 a,b,c와 정의역·치역·사분면 조건만 있음. 구체 모양 선택을 미리 그리면 부적절. |
| 유사3/Q20 | 해설 | BENEFICIAL | `sqrt-affine-spike-v1` | `N/q20-solution.plan.json` | OK/OK | PASS | 14개 조합 중 예시 `(a,b,c)=(1,3,1)`만 선택; `y=1−√(x+3)`의 시작 `S(−3,1)`, x절편 `Z(−2,0)`, y절편 `Y(0,1−√3)`를 `graphPlan.overlays.points`의 좌표라벨로 표시. 부적절한 사분면 면 채움 없음. |
| 유사3/Q21 | 문제 | EXEMPT | — | — | — | N/A | 제한 정의역 이차함수와 역함수 방정식을 식으로만 제시. |
| 유사3/Q21 | 해설 | BENEFICIAL | `sqrt-affine-spike-v1` | `N/q21-solution.plan.json` | OK/OK | PASS | 역함수 곡선 `3−√(x+1)`의 시작 `A(−1,3)`, 직선 `y=5−x`, 유일한 교점 `P((5+√13)/2,(5−√13)/2)`를 `graphPlan.overlays.lines/points`에 좌표로 표시. 허위 반대편 교점 없음. |

## 검증 수치와 한계

- 총 **21문항 × 2축 = 42축**: `REQUIRED` 문제 **4**(Q07,Q09,Q15,Q18), `BENEFICIAL` 해설 **12**(Q04,Q05,Q09,Q11,Q12,Q14,Q15,Q17,Q18,Q19,Q20,Q21), `EXEMPT` **26**. `ENGINE_CAPABILITY_PENDING` **0**.
- 새 `_plans/`에 실행 가능한 플랜 **7개**(Q04·05·15·17·18·20·21 해설). 재사용하는 기존 `L/` 플랜 **9개**. 실제 사용할 시각 플랜 합계 **16개**. 기존 L/ 플랜 중 우선순위가 낮아진 Q04·05·15·17·18·20·21 해설 7개는 사용하지 않음.
- lint: 신규 7개 `--shallow` **7 OK**, `--full` **7 OK**. 기존 16개를 모두 독립 `--full` 검증 **16 OK**(동일 16개 중 사용하는 것은 9개). 따라서 **실사용 16축 전부 shallow/full PASS**(legacy의 shallow 16 OK도 확인). 필드 parity는 실사용 **16 PASS**, EXEMPT 26 N/A, pending 0.
- 명령(엔진 종속 패키지가 있는 로컬 체크아웃에서 실행):
  ```bash
  node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow --engine /tmp/ap-exam-plan-ofQE0d/suncheon archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3_plans/*.plan.json
  node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --jobs 3 --engine /tmp/ap-exam-plan-ofQE0d/suncheon archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3_plans/*.plan.json
  node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow --engine /tmp/ap-exam-plan-ofQE0d/suncheon docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3
  node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --jobs 3 --engine /tmp/ap-exam-plan-ofQE0d/suncheon docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3/q*.json
  ```
- 검증 한계: 엔진 플랜 검증+독립 SVG 관측기 경로까지 검증했다. 별도 A4 편집·학생 화면 레이아웃 출력과 최종 브라우저 육안 비교는 **NOT_RUN**이다. 표의 PASS는 필드 parity이고 종이/PDF 픽셀 1:1이 아니다.
