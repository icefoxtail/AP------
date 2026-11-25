# 기하 119–123 문제 그림 plan 인계 — 2026-11-25

## 범위·증거

- 작업 시작 `main`: `4373ccfb54e7910b16e53f25dd0dbdb343064cdd` (PR #3024 병합). 동일 문항의 기존 plan·겹치는 열린 PR 없음.
- 실제 `[그림: …]` 원본 문항 **15개**, 유형군/JS stem **5종**. 기하 `119-q03..q11` 9개 + `120-q01..q02` 2개 + `121-q02` 1개 + `122-q02,q05` 2개 + `123-q09` 1개. 숫자·문항 id 오름차순, 그림이 없는 qid는 제외.
- 원본 JS blob SHA:
  - `기하_119_내적의기하학적인의미_고2_유형은행1.js`: `54b770fff3b0f0fc8a3cff0b867d648911759146`
  - `기하_120_내적사이의관계_고2_유형은행1.js`: `1b4dd4b83acbe552bf07aba05bb16acf5640e688`
  - `기하_121_평면벡터내적의부호의활용_고2_유형은행1.js`: `68147fe684bcd7a88375605bc3bbb34e0a201068`
  - `기하_122_평면벡터의내적의성질과수직_고2_유형은행1.js`: `9f760758b1466ae7e05384587445aa0d4fe6fe3c`
  - `기하_123_평면벡터의내적-성분표시형_고2_유형은행1.js`: `6d855c863af8643588b9fe8ba573d68df687176f`
- 산출: `archive/tools/geometry-equation/production/plans/<정확한 stem>/qNN-problem.plan.json` 15개와 이 문서 1개. 기존 JS/그림 자산/게시 파일 미수정.
- 각 원본 JS의 발문·보기·정답·해설·`[그림]` 재확인 및 좌표·길이·직각·원·접원·내분비·내적 별도 Node 독립 계산 **15/15 PASS**. 정답을 plan의 학생용 숫자·라벨로 직접 노출하지 않음.
- `plan-lint.cjs --shallow` **15/15 PASS**, `plan-lint.cjs` full **15/15 PASS** (2026-11-25). full은 기존 격리 설치된 공식 엔진 의존성 재사용: 이번 작업 중 두 번째 동일 의존성 설치가 `ENOSPC`로 실패하여 작업자가 생성한 중복 임시 설치만 제거함. full 재실행 결과는 실패·건너뜀 없이 전부 OK.
- 모든 15건: `sourceVsPlan=REVIEWED`, `featureParity=PASS` **(실제 필드 대조 단계)**, `planLintShallow=PASS`, `planLintFull=PASS`. 새 엔진 기능 요구가 확인된 문항 없음 (`ENGINE_CAPABILITY_PENDING=0`). 이는 실제 SVG 시각검수 완료를 의미하지 않음.
- SVG/PNG 실제 생성, 학생 화면/390px/A4 인쇄 검수, JS 연결·게시: **전부 NOT_RUN**. 상태 `SVG_TO_CREATE`. 해설 그림 축은 이번 문제 plan 대상에서 제외하며 완료로 보고하지 않음.

## 문항별 plan 필드·원문 정답 검증

| qid | 정답 | 문제 그림에 구현한 조건·독립 수학 검산 | sourceVsPlan | featureParity | shallow/full | SVG·PNG·화면·A4 |
|---|---|---|---|---|---|---|
| 119-q03 | ⑤ | AB=BC=5 이등변, 두 실제 길이·등변 눈금, 밑각 θ 호. AB·AC=18, cosθ=3/5 검산(답 미표시) | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q04 | ④ | AB=3·BC=5 치수선, 삼각형 실제 좌표는 AB·AC=16도 만족; 답 내적 7 미표시 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q05 | ① | AB=14·BD=6 치수선, 내심 I와 세 변에 동시에 접하는 원, BC 접점 D, ID⊥BC. BA·BI=84 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q06 | ③ | AB=10 지름 실제 원, BP=6 현, ∠APB 직각, AB·AP=64 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q07 | ⑤ | AB 지름의 전체 원, C·D 원주 위(상·하 대표 배치), AC=8·AD=3 치수선, 두 원주각 직각; 64−9=55 검산. AB=10은 미제시 대표 길이로 미표기 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q08 | ② | AB>5를 만족하는 대표 지름, 위쪽 P·아래쪽 Q, AP=3·BQ=5 치수선, 두 원주각 직각; 내적 합 −16 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q09 | ⑤ | 사각형 OAPB, ∠OAP·∠OBP 각각 90°, OA2·OB3 치수선, OP·AB 벡터 화살표; 내적 5 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q10 | ① | 변 6 정삼각형과 실제 내접원, 중심 O·BC 접점 D, 선분 A-O-D, 접점 직각; 내적 15 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q11 | ④ | AB=AC=10·BC=12 치수선, 같은 변 눈금, 삼각형에 실제 접하는 중심 O의 내접원; OA·OB=−15 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 120-q01 | ⑤ | ∠B=90°, AB3·BC4, BC 삼등분 D,E, AB 중점 M과 눈금, AD·AE·AC·MC 네 선분; 식=43 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 120-q02 | ⑤ | B 직각, AB 삼등분 A₁,A₂, BC 사등분 C₁,C₂,C₃(정확한 순서·눈금), A·C발 연결선 5개; 발문 내적 75/−288 및 AC=13 검산(답 미표시) | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 121-q02 | ③ | 원점 O 중심 반지름2 전체 원, A(2,0), 제1사분면 대표 이동점 P, OA=a·OP=p 벡터 화살표 및 각 호. 정답 대응 원호는 미색칠 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 122-q02 | ① | OA5·OB12 및 O 직각, 두 실제 계산 직선의 교점 P(수선의 발), OP⊥AB 마커, OP=60/13 검산(답 미표시) | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 122-q05 | ① | 직사각형 AB4·BC2, 내부 대표점 P와 PA·PB·PC·PD 선분, 정답 자취 원은 노출하지 않음; 내적 0의 자취 원 반지름1 검산 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 123-q09 | ② | 직사각형 AB2·AD3, BC 삼등분점 E,F와 등분 눈금, 벡터 AE·AF 화살표; 내적 6 검산(답 미표시) | REVIEWED | PASS | PASS/PASS | NOT_RUN |

## 후속 작업

1. 이번 15건은 실제 **문제 SVG/PNG 생성 전**이다. 공식 엔진으로 렌더한 뒤 실물·학생 화면/390px·A4 읽기 검수, 점/라벨 충돌·치수선 방향 점검, 필요하면 엔진 수정 및 재검사를 한다. 이번 `featureParity=PASS`는 렌더 필드 존재의 검수에 한정된다.
2. 다음 미작성 그림 문항은 **`기하 123-q10`**. 최신 `main`과 열린 PR에서 중복을 확인하고 이어서 15–20 실제 qid 배치를 만든다. 기하 205종 범위 완료 전 다른 과목으로 건너뛰지 않는다.
3. 원본 JS·해설·이미지 경로를 임의 변경하거나 수기 SVG로 대체하지 않는다.
