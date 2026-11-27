# 비상 대수·삼각함수 익힘책(고2) — 원문/에셋 ↔ plan 그림 필드 대조

- 원본 JS: `archive/exams/textbooks/비상교육_대수/비상_대수_삼각함수_익힘책_고2/비상_대수_삼각함수_익힘책_고2.js`
- 분모: 28문항 × 문제/해설 2축 = **56축**. 원본 PNG 9개(`q09, q12, q18, q19, q20, q22, q25, q27, q28`)를 개별로 열어 비교.
- plan 폴더/경로 접두사: `archive/tools/geometry-equation/production/plans/비상_대수_삼각함수_익힘책_고2/`. 아래 `qXX-*.plan.json`은 전부 이 경로에 있다.
- 신규 **22 plan / 22축**. 전체 shallow **22/22 PASS**, full **22/22 PASS**. plan 그림-필드 정적 패리티 **20축 PASS**, **2축 ENGINE_CAPABILITY_PENDING**. 추가로 원본 에셋 유지 3축, 실제 그림이 없는 텍스트/수식형 31축 EXEMPT.
- `DRAWN_FEATURE_PARITY=PASS`는 원문 조건별 `sourceConditions.mappedTo`와 수학 계산, 실제 출력 후보 필드(점/선/각호/치수/수선/그래프/점선)를 대조한 **정적 판정**이다. **SVG 렌더/PNG/학생 화면/A4 실물 검수는 모두 NOT_RUN**이며 이후 렌더 파이프라인에서 별도 통과시켜야 한다.
- `ASSET_KEEP`은 기존 원본 PNG를 유지한다는 뜻이지 새 SVG를 렌더/검수했다는 뜻이 아니다. `EXEMPT`는 SVG가 필요한 독립 그림이 없는 수식·텍스트 풀이축이다. 미지원 필드를 캡션으로만 설명한 축은 PASS에서 제외했다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 익힘책/q01 | 문제 | 호의 길이·중심각 수식, 독립 그림 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q01 | 해설 | `s=rθ` 계산형, 누락 도형 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q02 | 문제 | 제4사분면 조건은 텍스트에서 완결 | EXEMPT | — | — | EXEMPT |
| 익힘책/q02 | 해설 | 5-12-13 삼각형, 좌표축·수선·길이 필요 → 추가 | construction-spike-v1 | `q02-solution.plan.json` | PASS/PASS | **PASS**: Q4 점/세 변·직각·길이 |
| 익힘책/q03 | 문제 | 삼각함수 식 계산형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q03 | 해설 | 항등식·사분면 부호 계산형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q04 | 문제 | 주기 비교 수식형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q04 | 해설 | `sin,cos,tan` 주기 설명형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q05 | 문제 | 같은 동경·대칭각 수식 조건 | EXEMPT | — | — | EXEMPT |
| 익힘책/q05 | 해설 | 각도 방정식으로 해결, 필수 도해 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q06 | 문제 | 삼각함수 연립식 | EXEMPT | — | — | EXEMPT |
| 익힘책/q06 | 해설 | 치환·이차방정식 계산형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q07 | 문제 | 함수값 크기 비교 | EXEMPT | — | — | EXEMPT |
| 익힘책/q07 | 해설 | 부등식 비교 수식형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q08 | 문제 | 식과 수평 기준값만 제시, 원본 그림 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q08 | 해설 | `2sin(πx/4)=√2` 교점 1·3의 좌표/점선 보강 | trigonometric-spike-v1 | `q08-solution.plan.json` | PASS/PASS | **PASS**: 사인 곡선·수평선·교점 |
| 익힘책/q09 | 문제 | 원본 `q09.png` 그래프의 위상·극값 유지; 문제에 정답식 노출 금지 | ASSET_KEEP | 원본 `q09.png` | 해당 없음 | ASSET_KEEP: 원본 그래프 검토 |
| 익힘책/q09 | 해설 | 기존 그림의 최대/최소/주기 설명을 실제 그래프 필드에 결속 | trigonometric-spike-v1 | `q09-solution.plan.json` | PASS/PASS | **PASS**: `2sin(2x−π)+1`, 극값 3/−1·최대점 눈금·점선 |
| 익힘책/q10 | 문제 | 매개변수 `t=sin x` 수식 조건 | EXEMPT | — | — | EXEMPT |
| 익힘책/q10 | 해설 | `−1≤t≤1` 제한 포물선·닫힌 끝점 완전 표시 요구 | polynomial-spike-v1 | `q10-solution.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING**: `POLYNOMIAL_RESTRICTED_DOMAIN_CLOSED_ENDPOINTS`; 포물선은 그렸으나 끝점의 정의역 포함 표식 불충분 |
| 익힘책/q11 | 문제 | 맥동성 밝기 사인 부등식, 텍스트형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q11 | 해설 | 임곗값 `sin t=1/2`와 해당 주기 해구간 표시 | trigonometric-spike-v1 | `q11-solution.plan.json` | PASS/PASS | **PASS**: 기준선·교점 구간·주기 |
| 익힘책/q12 | 문제 | 원본 `q12.png` 반원·10등분·수선 유지; 문제용 정답 노출 없음 | ASSET_KEEP | 원본 `q12.png` | 해당 없음 | ASSET_KEEP: 원본 대표점/직각 검토 |
| 익힘책/q12 | 해설 | 반원/대표 수선 네 개 복원, 나머지 등분점 및 생략부호 엔진 제한 | construction-spike-v1 | `q12-solution.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING**: `DENSE_SEMICIRCLE_DIVISION_ELLIPSIS`; 호·반지름·P₁,P₂,P₃,P₉/Q₁,Q₂,Q₃,Q₉ 수선/직각은 그림 필드, 9점·생략 기호의 원본 패리티 미완 |
| 익힘책/q13 | 문제 | 삼각함수와 기울기 `m` 조건형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q13 | 해설 | 교점 개수 변화(7/5개) 실그래프·직선·교점 계산 보강 | trigonometric-spike-v1 | `q13-solution.plan.json` | PASS/PASS | **PASS**: `−3sin(πx/2)` 및 두 표본 직선과 교점 수 |
| 익힘책/q14 | 문제 | 삼각부등식, 도형/이미지 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q14 | 해설 | 부호표·각 구간 수식으로 결정 | EXEMPT | — | — | EXEMPT |
| 익힘책/q15 | 문제 | 외접반지름과 각 조건만 텍스트 | EXEMPT | — | — | EXEMPT |
| 익힘책/q15 | 해설 | 사인법칙 수치 계산형, 독립 출처 그림 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q16 | 문제 | 두 변·끼인각 수식 | EXEMPT | — | — | EXEMPT |
| 익힘책/q16 | 해설 | 코사인법칙 직접 대입, 독립 그림 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q17 | 문제 | 넓이/변 조건과 각의 두 후보, 대표 도해가 오해 소지 | EXEMPT | — | — | EXEMPT |
| 익힘책/q17 | 해설 | `sin B=1/2`에 두 가능각, 한 삼각형 고정 그림은 부정확 | EXEMPT | — | — | EXEMPT |
| 익힘책/q18 | 문제 | 원본 `q18.png` 불필요한 살구색 면 채움 → 제거; AB4/BC6/∠B120° 복원 | construction-spike-v1 | `q18-problem.plan.json` | PASS/PASS | **PASS**: 네 변, 길이 치수선 4·6, 각호 120°, 무채움/정답 비노출 |
| 익힘책/q18 | 해설 | 높이 수선·직각표식 누락 보완 | construction-spike-v1 | `q18-solution.plan.json` | PASS/PASS | **PASS**: 120°, 높이/수선/직각, 넓이 계산 관계 |
| 익힘책/q19 | 문제 | 원본 `q19.png` 파란 삼각형 면채움 제거; 외접원·각·변 길이 정돈 | construction-spike-v1 | `q19-problem.plan.json` | PASS/PASS | **PASS**: 외접원·ABC·변5/4·∠B60°, 무채움 |
| 익힘책/q19 | 해설 | 외심 O/반지름/AC 보조선·라벨 보강 | construction-spike-v1 | `q19-solution.plan.json` | PASS/PASS | **PASS**: 원 위 A/B/C, `AC=√21`, `OB=√7`, 중심·원주 |
| 익힘책/q20 | 문제 | 원본 `q20.png`의 두 삼각형 연결·공통변/세 30° 명시 | construction-spike-v1 | `q20-problem.plan.json` | PASS/PASS | **PASS**: AB8√3/AD2√3·각호 3개·공통 AC, 답 CD 숨김 |
| 익힘책/q20 | 해설 | AC·CD 도출 길이와 각표식 보강 | construction-spike-v1 | `q20-solution.plan.json` | PASS/PASS | **PASS**: AC8/CD2√7·주어진 각호·두 삼각형 |
| 익힘책/q21 | 문제 | 변·넓이·코사인 값 계산형 | EXEMPT | — | — | EXEMPT |
| 익힘책/q21 | 해설 | 넓이/코사인법칙 수치 계산 | EXEMPT | — | — | EXEMPT |
| 익힘책/q22 | 문제 | 원본 `q22.png` 부채꼴 면 채움 제거; 호길이 2π·중심각 2π/3 실제 호 라벨 | construction-spike-v1 | `q22-problem.plan.json` | PASS/PASS | **PASS**: OA/OB·원호·각호/길이 라벨, 무채움 |
| 익힘책/q22 | 해설 | `r=3` 유도 표시/삼각형 OAB 연결 | construction-spike-v1 | `q22-solution.plan.json` | PASS/PASS | **PASS**: 호 2π·각 2π/3·반지름 3 라벨 |
| 익힘책/q23 | 문제 | 호 비 2:5:5 텍스트 조건, 원본 그림 없음 | EXEMPT | — | — | EXEMPT |
| 익힘책/q23 | 해설 | 중심각 60°/150°/150°, 세 반지름 및 삼각형 보조선 추가 | construction-spike-v1 | `q23-solution.plan.json` | PASS/PASS | **PASS**: 원/세 호 구획·각호 3개·반지름 |
| 익힘책/q24 | 문제 | 정현법칙 변의 비 조건 | EXEMPT | — | — | EXEMPT |
| 익힘책/q24 | 해설 | 정현법칙 대입 풀이 | EXEMPT | — | — | EXEMPT |
| 익힘책/q25 | 문제 | 원본 `q25.png` 살구색 사각형 면 채움 제거, 8/3/3/5·∠B60° 복원 | construction-spike-v1 | `q25-problem.plan.json` | PASS/PASS | **PASS**: 사각형 네 변 수치·각호·무채움, AC/∠D 정답 비노출 |
| 익힘책/q25 | 해설 | AC 대각선·∠D120° 보조 정보 누락 보완 | construction-spike-v1 | `q25-solution.plan.json` | PASS/PASS | **PASS**: AC7·∠B60°/∠D120°·4변·대각선 |
| 익힘책/q26 | 문제 | 정삼각형 및 BC 내 내분 비 텍스트 | EXEMPT | — | — | EXEMPT |
| 익힘책/q26 | 해설 | P,Q 위치·AP/AQ/∠PAQ 표시 보강 | construction-spike-v1 | `q26-solution.plan.json` | PASS/PASS | **PASS**: 두 동일길이 표식·PQ2·√13·θ 각호 |
| 익힘책/q27 | 문제 | 원본 `q27.png` 원뿔의 3D 형상을 훼손하지 않고 유지 | ASSET_KEEP | 원본 `q27.png` | 해당 없음 | ASSET_KEEP: 모선8/지름4/OP4√2 확인 |
| 익힘책/q27 | 해설 | 원뿔 전개도에 호/중심각/최단선과 길이 라벨 추가 | construction-spike-v1 | `q27-solution.plan.json` | PASS/PASS | **PASS**: 부채꼴 90°, 반대쪽 모선 45°, OA8·OP4√2·AP4√2 |
| 익힘책/q28 | 문제 | 원본 `q28.png` 삼각형의 PQ/변4·6/각60° 재구성, 불필요 채움 없음 | construction-spike-v1 | `q28-problem.plan.json` | PASS/PASS | **PASS**: A/B/C/P/Q·AB4/AC6·∠A60°·PQ, 최솟값 비노출 |
| 익힘책/q28 | 해설 | 넓이 이등분 조건 `AP·AQ=12`을 만족하는 대표점·x/y 라벨 보강 | construction-spike-v1 | `q28-solution.plan.json` | PASS/PASS | **PASS**: 예시 AP3/AQ4, PQ·각호·x/y, 무채움 |

## 렌더 후속 체크와 엔진 이슈

1. **q10/해설**: 제한 포물선의 실제 정의역 `[-1,1]`에 두 **채운 끝점**이 들어가고 영역 밖 곡선이 보이지 않도록 `POLYNOMIAL_RESTRICTED_DOMAIN_CLOSED_ENDPOINTS` 지원 필요. 현재 전체 실수 그래프의 표시 창 제한만 lint가 받아 주므로 1:1 PASS 불가.
2. **q12/해설**: 원본 `P₁…P₉`, `Q₁…Q₉`의 축약 기호, 대표 네 수선 및 세부 직각을 지원하는 `DENSE_SEMICIRCLE_DIVISION_ELLIPSIS` 기능 필요. 현재 대표 `P₁,P₂,P₃,P₉`만 위치·수선·직각을 지원. 원본의 의미를 모두 표시한 렌더로 검증 전 PASS 불가.
3. 모든 새 plan은 **흰색 직사각형 기본 배경/문제와 무관한 채움 도형을 추가하지 않음**. 다만 렌더 결과의 배경·라벨 겹침·필기체 해상도는 학생 화면/A4 렌더 확인 전 `NOT_RUN`.
4. 원본 PNG·JS 소스는 계획 작성 범위에 따라 변경하지 않았고, plan이 렌더/검수될 때 문제 축과 해설 축을 각각 후속 연결해야 한다.
