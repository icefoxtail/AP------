# 고2 기하 유형은행 155–158 — 문제 그림 plan 인계 (2026-11-26 KST)

## 범위 및 기준

- 기준 `main`: 최초 원문 검수 `fe14b8223f9a21a3de3f77c3bf991212403f4547`, PR 준비 재확인·rebase `b2479dd7a2df59c1ae849b66a21a51f6796ed0a1`(원본 155–158 및 그림 엔진 변경 없음). 직전 151–154의 PR #3048은 병합 완료; 이 구간과 충돌하는 열린 유형은행 PR을 검색하지 못함.
- 유형군 **155/8문항, 156/3문항, 157/11문항, 158/5문항 = 총 27개** 실제 `[그림:]` 슬롯. 문항 id는 각 JS의 `window.questionBank[].id`에서 재확인함.
- 원문 JS blob: `155=92da86b2f1f32c8ee74351b8deaf7fede2424a38`, `156=a2a278cd22fc47936d60d8fb93676b40234dabf6`, `157=804a737e668e2f139f63504339d41c779caf778a`, `158=00d935f3ff64326a0d533c047911975cacc5b20e`.
- **실행 가능한 `solid-figure-v1` problem plan 25개 신규 작성**, 상태 전용·가짜 JSON은 작성하지 않음. 156/q03·157/q09는 현재 capability로 원문 공간·원주 도형을 재현 불가하여 실행 plan 없음.
- 변경은 위 25개 신규 JSON과 본 인계 문서뿐. 유형은행 JS·시험지·교과서·SVG 엔진·기존 plan 수정 없음.

## 검증과 판정

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <25 plans>`: **25 OK / 0 FAIL / 0 SKIP**.
- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <25 plans>`: **25 OK / 0 FAIL / 0 SKIP**.
- 별도 3차원 좌표 독립 계산: **27개 원문 그림 슬롯 중 25개 계획·2개 미지원**을 대조. `sourceConditions`의 실제 객체 필드 경로 **130개** 모두 존재, 길이 라벨 **49개**, 실제 직각 **16개**, 각호 **29개**, 같은 길이 그룹 **5개**를 별도 계산. 출처별 정삼각형·정사각뿔·사면체 여섯 모서리·면적·좌표·중점·수직·이면각 단면을 별도 재계산하여 모순 없음.
- `sourceVsPlan=REVIEWED`: **27/27**(미지원 원문도 직접 판독). **DRAWN_FEATURE_PARITY=PASS 23/27**, **`ENGINE_CAPABILITY_PENDING` 4/27**. 후자는 lint와 상관없이 실제 그림 정보가 불완전한 문항이다.
- 이 실행 범위는 *문제 그림 plan만* 담당한다. SVG 생성·PNG 눈검수·학생 390px·A4·현행 JS `image` 연결·게시: **SVG_TO_CREATE / NOT_RUN**. 해설 그림 2축 판정·제작도 본 배치의 완료 주장이 아님.
- 실제 Figure `points`·`segments`·`dims`·`marks`·`highlights`에 없는 정보를 `caption`이나 `sourceConditions`에 적었다는 이유로 그려졌다고 판정하지 않음. 특히 `solidCaption`에 면적 숫자를 적은 158/q03·q04는 면 자체의 넓이 주석이 아니므로 PENDING.

실제 저장 경로 접두어는 `archive/tools/geometry-equation/production/plans/<정확한 JS stem>/`이며 아래 별칭은 다음과 같다.

| 별칭 | 정확한 stem |
| --- | --- |
| 155 | `기하_155_삼수선의정리의활용-두직선이이루는각_고2_유형은행1` |
| 156 | `기하_156_삼수선의정리의활용-실생활활용_고2_유형은행1` |
| 157 | `기하_157_두평면이이루는각-이면각의크기구하기1_고2_유형은행1` |
| 158 | `기하_158_두평면이이루는각-이면각의크기구하기2_고2_유형은행1` |

## 문항별 DRAWN_FEATURE_PARITY / 엔진 인계

| 파일/qid | 축 | 판정 | 실제 렌더 필드로 재대조한 정보 | capability | plan경로(위 접두어+별칭) | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 155/q01 | 문제 | REQUIRED | 서로 수직인 α·β=`space.planes`; XY·l·m=`space.lines`; 30°·45°·θ=`marks.angles[0..2]` | `solid-figure-v1` | `155/q01-problem.plan.json` | PASS/PASS | PASS |
| 155/q02 | 문제 | REQUIRED | 교선 AB·수직 αβ=`space`; CAB60°·BAD60°·CADθ=`marks.angles[0..2]` | 동일 | `155/q02-problem.plan.json` | PASS/PASS | PASS |
| 155/q03 | 문제 | REQUIRED | AB12·BC4√2=`dims`; AH·BH·BC=`space.segments`; 30°·수선 두 개·θ의 진짜 단면각=`marks` | 동일 | `155/q03-problem.plan.json` | PASS/PASS | PASS |
| 155/q04 | 문제 | REQUIRED | 직육면체의 서로 다른 세 길이 비=`solids[0]`; FA·FC=`segments`; CFG60°·AFE45°·AFCθ=`marks.angles` | 동일 | `155/q04-problem.plan.json` | PASS/PASS | PASS |
| 155/q05 | 문제 | REQUIRED | 수직으로 선 정삼각형 ABC=`space.points/segments`; α·l=`space.planes/lines`; BC-l 60°와 AB-l θ=`marks.angles` | 동일 | `155/q05-problem.plan.json` | PASS/PASS | PASS |
| 155/q06 | 문제 | REQUIRED | α⊥β·l 교선=`space`; AP2√2·BP4=`dims`; 45°·60°=`marks.angles`; AB 점선=`space.segments[2]` | 동일 | `155/q06-problem.plan.json` | PASS/PASS | PASS |
| 155/q07 | 문제 | REQUIRED | AQ2·QR√6=`dims`; AP⊥PQ/PR=`rightAngles`; QAP30°·RAP60°·QPRθ=`angles` | 동일 | `155/q07-problem.plan.json` | PASS/PASS | PASS |
| 155/q08 | 문제 | REQUIRED | AB4·AD3·BF3=`dims`; 두 꼬인 대각선 DG·FH=`segments` | 동일 | `155/q08-problem.plan.json` | PASS/PASS | PASS |
| 156/q01 | 문제 | REQUIRED | PA60·AB30=`dims`; PA⊥α·ABC90°=`rightAngles`; PCB30°=`angle`; PB·PC 선분=`space` | 동일 | `156/q01-problem.plan.json` | PASS/PASS | PASS |
| 156/q02 | 문제 | REQUIRED | PB20·AB40=`dims`; PB⊥AB·CP⊥지면=`rightAngles`; CAB45°=`angle` | 동일 | `156/q02-problem.plan.json` | PASS/PASS | PASS |
| 156/q03 | 문제 | REQUIRED | 지면에서 AB를 지름으로 하는 **원 전체**와 C∈원, 그 위의 PA 및 PB·PC와 PBC60°를 한 공간 좌표로 결합 불가 | 미지원: `space` + 지면 원주 | **없음** | —/— | **ENGINE_CAPABILITY_PENDING** |
| 157/q01 | 문제 | REQUIRED | 한 변 a 정사각뿔(`base`2, `height`√2)·AB/BC=`dims`; 네 옆모서리 눈금=`equalLengths`; BC·DE 중점 M,N=`points`; AM·AN·MN=`segments`; ∠MANθ=`angle` | `solid-figure-v1` | `157/q01-problem.plan.json` | PASS/PASS | PASS |
| 157/q02 | 문제 | REQUIRED | BC2·AB√10=`dims`; 네 옆모서리 눈금=`equalLengths`; M 중점·H 밑면 중심=`points`; AHM 직각·AMHθ=`marks` | 동일 | `157/q02-problem.plan.json` | PASS/PASS | PASS |
| 157/q03 | 문제 | REQUIRED | BC2·미지 옆모서리 a=`dims`; M,H=`points`; AM·HM=`segments`; AMH60°=`angle`; 모서리 같음=`equalLengths` | 동일 | `157/q03-problem.plan.json` | PASS/PASS | PASS |
| 157/q04 | 문제 | REQUIRED | AE4·EF3=`dims`; AD 위 P·FG 위 Q=`points`; PFG·EHQ 면 구분 색칠=`highlights[0..1]` | 동일 | `157/q04-problem.plan.json` | PASS/PASS | PASS |
| 157/q05 | 문제 | REQUIRED | AB2·AD2·AE√2=`dims`; △CHF 3변=`segments` | 동일 | `157/q05-problem.plan.json` | PASS/PASS | PASS |
| 157/q06 | 문제 | REQUIRED | AB2·AD2·AE√6=`dims`; △DEG 3변=`segments` | 동일 | `157/q06-problem.plan.json` | PASS/PASS | PASS |
| 157/q07 | 문제 | REQUIRED | AB1·AD2·AE1=`dims`; △DEG=`segments` | 동일 | `157/q07-problem.plan.json` | PASS/PASS | PASS |
| 157/q08 | 문제 | REQUIRED | 정육면체 변6=`dims`; FG 중점 M·EM 위의 DI 수선 발 I=`points`; △DEM·DI·IM=`segments`; ∠DIM 직각=`mark` | 동일 | `157/q08-problem.plan.json` | PASS/PASS | PASS |
| 157/q09 | 문제 | REQUIRED | 원기둥 밑면 원주 위의 P, 다른 밑면 지름 AB·중심 O 및 PO⊥AB와 △PAB를 같은 입체로 고정 불가 | 미지원: `CYLINDER` 원주 위 공간 보조점 | **없음** | —/— | **ENGINE_CAPABILITY_PENDING** |
| 157/q10 | 문제 | REQUIRED | OA1·OB2·OC2=`dims`; O에서 3개 직각=`marks`; BC 중점 M·AM·OM=`space.points/segments` | `solid-figure-v1` | `157/q10-problem.plan.json` | PASS/PASS | PASS |
| 157/q11 | 문제 | REQUIRED | AB/AC5·BD/CD2√5·BC8·AD2=`dims[0..5]`; BC 중점 M·AM·DM=`space`; AMDθ=`marks` | 동일 | `157/q11-problem.plan.json` | PASS/PASS | PASS |
| 158/q01 | 문제 | REQUIRED | AB/AC15·BC18·AH6√3=`dims`; BD=CD=`equalLengths`; 중점 M·AH⊥BCD·AMHθ=`space/marks` | 동일 | `158/q01-problem.plan.json` | PASS/PASS | PASS |
| 158/q02 | 문제 | REQUIRED | 정삼각형 BCD 변6=`solids[0].base/dims`; AB=AC=AD2√6=`equalLengths/dims`; M 중점·AMDθ=`points/angle` | 동일 | `158/q02-problem.plan.json` | PASS/PASS | PASS |
| 158/q03 | 문제 | REQUIRED | CD14·면 ACD 넓이70 독립 계산 일치, 30°단면 호=`marks`; H 정사영=`space.points`; **면 안에 넓이 70을 직접 표시할 수 없어 `solidCaption.text`에서만 표시** | 동일 | `158/q03-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING** |
| 158/q04 | 문제 | REQUIRED | BC6·△BCD 넓이25·△ABC 넓이18·면 사이30° 독립 계산 일치; H 정사영·30°=`space/marks`; **두 면의 숫자는 상단 `solidCaption.text`에만 표시** | 동일 | `158/q04-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING** |
| 158/q05 | 문제 | REQUIRED | 한 모서리2=`dims`; BED·BGD 두 삼각면=`highlights`; BD 중점 M·∠EMGθ=`points/marks` | 동일 | `158/q05-problem.plan.json` | PASS/PASS | PASS |

## 엔진 capability 후속 (Antigravity)

1. **156/q03** — `space.planes` 위에 중심·지름을 엄밀히 정의한 원을 표시하고 C를 원주에 고정하며, 평면 밖 PA·PB·PC와 직각·각호를 함께 렌더할 수 있는 공통 기능. 이 항목은 실행 plan 없음.
2. **157/q09** — `CYLINDER`의 위·아래 원주점 지정, 아래 원 지름 AB 및 중심 O, 위 원주 P를 한 3D 모델에 결합해 PO⊥AB·평면 PAB를 보여주는 기능. 실행 plan 없음.
3. **158/q03** — `space` 사면체의 **정확한 삼각면 ACD 안**에 `넓이 70`의 수식 글자를 묶어 그리는 기능. 현재 상단 제목은 그려지지만 원문 위치 충실도가 남아 있으므로 렌더 전 보강 필요.
4. **158/q04** — 삼각면 BCD와 ABC에 각각 넓이 25·18을 다른 면에 오인되지 않게 표기하는 기능. 상단 요약만으로 완성 처리 금지.

확장 후 `원문 → 정확한 plan필드 → 공식 재-lint → 엔진 렌더 SVG/PNG → 학생 390px·A4 → JS 연결/게시` 순서로 마감한다. 새 plan은 도형 실제 표시를 추정한 사전 설계이며 **렌더된 그림의 가독성 또는 학생 출고를 완료한 증거는 아니다**.

**다음 미작성 기하 유형군: 159**. 기하 205종이 끝나기 전에는 미적분Ⅱ로 이동하지 않는다.
