# 고2 유형은행 기하 123–132 문제 그림 plan 인계 — 2026-11-25

## 범위와 출처

- 담당 범위: **`archive/exams/types/high/h2/`의 기하 유형은행**만. 시험지·교과서·원본 JS·해설·게시 자산은 수정하지 않음.
- 기존 마지막 인계 `typebank-geometry-119-123-handoff.md`의 다음 문항 `123-q10`부터 **원문에 `[그림: …]`이 있는 다음 20문항**을 순차 선택. 유형 124–126, 128–129 및 그 밖의 그림 없는 문항은 이번 작업에서 건너뜀.
- 선택: `123-q10,q11`(2), `127-q04–q06`(3), `130-q01–q06`(6), `131-q01,q02,q04,q06,q09,q11`(6), `132-q01–q03`(3). **총 20문항 / JS stem 5종**.
- 시작 `main`: `dded83d791902e4201af9f4af6b14ccd52bbcd43`. 최종 업로드 직전 `main`: `516ec6b2138eb27ee492911eab7ce244290d6cb3`(추가 6커밋). GitHub 열린 PR 및 두 커밋의 변경 파일 점검 시 이번 `기하_123/127/130/131/132` 계획 경로와 겹침 없음.
- 원문 JS blob SHA:
  - `기하_123_평면벡터의내적-성분표시형_고2_유형은행1.js`: `6d855c863af8643588b9fe8ba573d68df687176f`
  - `기하_127_평면벡터의내적의연산법칙-두벡터가이루는_고2_유형은행1.js`: `b9ccc91576a48998a7750f5a130177000f0e3360`
  - `기하_130_도형에서내적의연산법칙의활용_고2_유형은행1.js`: `09fd405aad4903582aac1576a7c8b5956ea283fd`
  - `기하_131_평면벡터의내적과삼각형의넓이_고2_유형은행1.js`: `192de7d72f5820e44b9c3e71b4c390f9a6d252b5`
  - `기하_132_내적의최대최소-내적의정의를이용하는경우_고2_유형은행1.js`: `a78f731c8b482726221b1ce4fd3a7249649a8ef2`
- 산출물은 `archive/tools/geometry-equation/production/plans/<정확한 원본 JS stem>/qNN-problem.plan.json` **20개**와 이 인계 문서만. 문제 그림 축만 작성했고 해설 그림은 작성하지 않음.

## 검증과 판정 기준

- 원문 그림 설명의 점·좌표·비·선분·내적·곡선·화살표·각호 등을 `mathPlan/graphPlan/ellipse/conic`, 표시 목록, `planeMarks`, `sourceConditions[].mappedTo`에 문항별 대조. 각 JSON에 `sourceQuote`, `caption`, `accessibilityDescription`, `newVisualInformation` 기록. 독립 필드 참조 검사 **20문항·sourceConditions 55행·실제 id 참조 155건 전부 존재** 확인.
- 실제 독립 SymPy 수학 검산 **20/20 PASS**: 길이·내분비·각·내적·면적·극값, 고정 좌표와 곡선 조건을 다시 계산. 학생용 그림에 최종 정답을 불필요하게 미리 표시하지 않음.
- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <20 경로>`: **20 OK, 0 FAIL, 0 SKIP**.
- 같은 도구의 **full**(조판·모델 심화 검증): **20 OK, 0 FAIL, 0 SKIP**. 원본 잠금 SHA와 일치하는 `NotoSansKR.ttf` 및 독립 설치된 기존 공식 `node_modules`/Python 의존성을 **읽기 전용으로 재사용**. 엔진 파일 수정 없음.
- `sourceVsPlan=REVIEWED`는 **원문 텍스트와 기입 필드의 대조**가 완료되었다는 뜻이다. `DRAWN_FEATURE_PARITY=PASS`도 **plan에 구현 요청 필드가 존재한다는 뜻**이지 실제 SVG 화면 검수 합격이 아님. 미표현 기능과 원문 자체 오류를 PASS로 위장하지 않음.
- 상태 분포: **PASS 17 / ENGINE_CAPABILITY_PENDING 2 / SOURCE_DESCRIPTION_CONFLICT 1**. SVG/PNG 렌더·390px 학생 화면·A4 인쇄·게시·원본 JS 연결은 모두 **NOT_RUN** (`SVG_TO_CREATE`).

## 20문항 원문↔필드 1:1 검수

아래 `Pnnn/qNN`의 실제 경로는 공통 기본 경로 `archive/tools/geometry-equation/production/plans/` 아래 `기하_nnn_<원본 JS stem의 나머지>/qNN-problem.plan.json`이다. 축은 모두 `문제 그림(PROBLEM_VISUAL)`.

| 파일/qid | 원문 기하 조건 → plan 표시 필드 및 독립 계산 | sourceVsPlan | capability | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| 123-q10 | 원 x²+y²=10, 직선 y=x+2, A(1,3)·B(−3,−1), OA·OB 선분; 내적 −6 | REVIEWED | ellipse-figure-v1 | PASS/PASS | PASS |
| 123-q11 | P(0,5), Q(0,−5), x축의 A₁…A₁₀ 전부, 대표 A₄ 연결; 합 135 | REVIEWED | construction-spike-v1 | PASS/PASS | **ENGINE_CAPABILITY_PENDING**: 점 이름 파서가 아래첨자 0을 거절해 A₁₀ 대신 A10으로 표시됨 |
| 127-q04 | 한 변 1 정삼각형, AB=a, AC=b 방향 화살표, 60° 각호; 결합 벡터 크기 7 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 127-q05 | 한 변 1 정육각형 ABCDEF, BA=a, BC=b, 120°; 제곱 크기 13 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 127-q06 | 한 변 1 정사각형 ABCD, AB=a, AD=b, 직각; 내적 1 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q01 | ∠A=90°, AB=6, BD:DC=1:2, AD 연결, 동일 삼등분 눈금; 내적 24 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q02 | 한 변 6 정삼각형, B-P-Q-C 삼등분, AP·AQ; 내적 26 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q03 | OA3·OB4·AB3, AP:PB=1:2, OP; 내적 2 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q04 | AB3·AC2, AD 각 이등분선·동등 각호, BD:DC=3:2; 내적 8/5 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q05 | AB2·AD4 직사각형, AE:ED=1:3, BF:FC=3:1, AF·BE; 벡터식 제곱 20 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 130-q06 | 한 변 4 정삼각형, AB 중점 D, AC 위 F-E 순 삼등분, BF·DE; 벡터식 제곱 28 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 131-q01 | 삼각형 OAB, OA6·OB4, 내적 12; 넓이 6√3 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 131-q02 | 삼각형 OAB, OA2·OB4, 벡터합 크기 2√7; 넓이 2√3 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 131-q04 | 평행사변형 OABC, OA=a 길이3·OC=b 길이8, 내적12; 넓이 12√3 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 131-q06 | x축 A(−3,0)·B(3,0), 제1사분면 y=4/x 위의 대표 P(4,1), AP·BP; 최소 제곱 32 | REVIEWED | multi-curve-figure-v1 | PASS/PASS | PASS |
| 131-q09 | 타원 x²/16+y²/7=1, 초점 F(3,0)·F′(−3,0), P 위의 PF·PF′ 선분; 합 5 | REVIEWED | ellipse-figure-v1 | PASS/PASS | **ENGINE_CAPABILITY_PENDING**: 원문의 두 벡터 화살촉을 타원 capability의 선분이 지원하지 않음 |
| 131-q11 | 타원 x²/3+y²=1, A(1,0)·B(0,1), 접점 P(−3/2,1/2), 접선 y=x+2; 계수식 5 | REVIEWED_WITH_CONFLICT | ellipse-figure-v1 | PASS/PASS | **SOURCE_DESCRIPTION_CONFLICT**: 원문은 접선이 1·2·4사분면을 지난다 하나 실제로 1·2·3사분면을 지남 |
| 132-q01 | 원점 O, P(2,0), 중심(5,4) 반지름2 원과 내부 Q; 극값 합 20 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 132-q02 | 원점 O, P(0,3), 중심(4,4) 반지름2 원과 내부 Q; 극값 합 24 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |
| 132-q03 | P(4,3), 중심 C(2,5) 반지름2 원과 내부 Q; 극값 합 46 | REVIEWED | construction-spike-v1 | PASS/PASS | PASS |

## 후속 인계

1. **기능 추가**: 점 이름 `A_{10}`처럼 아래첨자 0이 포함된 표기 지원, `ellipse-figure-v1`의 PF/PF′ 방향 화살촉 지원. 이 두 건은 엔진 기능 부채이며 plan-lint 성공으로 해결되지 않음.
2. **원문 정정 협의**: 131-q11의 접선 (y=x+2)는 제4사분면에 진입하지 않는다. 원문 `[그림:]` 설명 변경은 별도 권한·공정으로 넘기며 이번 배치에서 JS를 수정하지 않음.
3. **SVG/PNG 후속**: 공식 엔진 렌더, 화면·390px·A4 확인, 필드→실물 대응 및 글자/화살촉/점 라벨 충돌 검수. 현재 SVG/PNG는 생성하지 않았으므로 실물 parity는 미검수.
4. **다음 배치**: 최신 `main`·PR에서 중복 확인 후 `기하 132-q04` 이후의 `[그림:]` 실제 문항으로 이어간다. 기하 완료 전 미적분Ⅱ 착수 금지.
