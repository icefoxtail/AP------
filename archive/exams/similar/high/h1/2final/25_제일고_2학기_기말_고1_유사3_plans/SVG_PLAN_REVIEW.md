# 2025 제일고 고1 2학기 기말 유사3 — SVG plan 정밀검수 (1차 배치)

- 기준 JS: `archive/exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사3.js` (Git blob `c63011fe916b781888953b9797b1cc2c27516711`, SHA-256 `f7a2a68f2c09dd00cc586b53ec521d73a49015f41807008c4dddac2015fc2107`).
- 이번 범위: **Q01~Q12, 12문항/24축**. Q13~Q22(10문항)는 다음 배치. 이 장부의 모든 `qN-*.plan.json`은 같은 `_plans/` 폴더를 기준으로 한다.
- 같은 JS SHA-256에 결속된 `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사3/`의 기존 엔진 계획을 문항·축별로 대조한 뒤 제작 경로로 이관했다. 단순 타 시험지 숫자 치환이 아니다.
- **공식 검사**: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <12개 제작 plan 경로>` = 12/12 OK, FAIL 0, SKIP 0; 같은 12개를 `--jobs 2` full로 검사 = 12/12 OK, FAIL 0, SKIP 0. 실제 SVG 렌더·PNG·학생 화면·A4·JS 이미지 연결 변경은 모두 `NOT_RUN` 또는 `UNCHANGED`.
- `DRAWN_FEATURE_PARITY=PASS`는 원본 발문·해설·기존 문제 이미지의 좌표·선분·라벨·각·직각·방향·길이·그래프 조건을 **실제 렌더 대상 JSON 필드**에 대조했다는 뜻이며, 렌더 시각검증 PASS는 아니다. EXEMPT는 장식·단순식 중복을 제외한 개별 사유다.

| 파일/qid | 축 | 판정·개별 사유 | capability | plan 경로 | shallow/full | DRAWN_FEATURE_PARITY / 실제 필드 |
| --- | --- | --- | --- | --- | --- | --- |
| 제일고 유사3/Q01 | 문제 | EXEMPT — 다섯 문장의 참·거짓 판단 | — | — | N/A | N/A |
| 제일고 유사3/Q01 | 해설 | EXEMPT — 반례와 전칭명제의 문장 설명으로 완결 | — | — | N/A | N/A |
| 제일고 유사3/Q02 | 문제 | EXEMPT — 두 점·이동 조건이 좌표로 완결 | — | — | N/A | N/A |
| 제일고 유사3/Q02 | 해설 | BENEFICIAL — 같은 벡터로 두 점 이동 | construction-spike-v1 | `q2-solution.plan.json` | PASS/PASS | PASS — A(1,5)→B(4,3), C(2,1)→D(5,−1)를 `SOURCE_POINT`·`displaySegments[sAB,sCD].arrow=END`로 표시. x 변위 +3, y 변위 −2는 직교 보조선과 길이 라벨 3,2 |
| 제일고 유사3/Q03 | 문제 | EXEMPT — 원의 방정식·접점이 식과 좌표로 주어짐 | — | — | N/A | N/A |
| 제일고 유사3/Q03 | 해설 | BENEFICIAL — 접선·반지름의 직각과 삼각형 넓이 | construction-spike-v1 | `q3-solution.plan.json` | PASS/PASS | PASS — O(0,0), P(3,1), A(10/3,0), B(0,10), 원 r=√10, 직선 3x+y=10, OP·OA·OB, `rightAngles[rP]`, 넓이를 묻는 △OAB만 `regions[tri]`로 채움 |
| 제일고 유사3/Q04 | 문제 | EXEMPT — 함의의 부등식 조건만 필요 | — | — | N/A | N/A |
| 제일고 유사3/Q04 | 해설 | BENEFICIAL — 대우의 경계선 교점 | construction-spike-v1 | `q4-solution.plan.json` | PASS/PASS | PASS — x+y=9, x=3, y=6 세 `SOURCE_LINE`·식 라벨과 (3,6) 점; 색은 선 구분만 사용 |
| 제일고 유사3/Q05 | 문제 | EXEMPT — p,q,r의 구간 조건이 명시됨 | — | — | N/A | N/A |
| 제일고 유사3/Q05 | 해설 | BENEFICIAL — 진리집합 포함관계 | number-line-figure-v1 | `q5-solution.plan.json` | PASS/PASS | PASS — Q:(−∞,4], P:(−∞,−3)∪[1,4], R:(−∞,−3)을 세 `rows[].pieces`에 개·폐구간으로 작성, 위·중·아래 행 설명 명시 |
| 제일고 유사3/Q06 | 문제 | EXEMPT — A,B 및 대칭축 y=x가 식으로 주어짐 | — | — | N/A | N/A |
| 제일고 유사3/Q06 | 해설 | BENEFICIAL — 대칭점·최단 경로 | construction-spike-v1 | `q6-solution.plan.json` | PASS/PASS | PASS — A(1,5), B(3,7), 대칭점 C(5,1)를 `pointNames.C=A'`로 표시, P(4,4), y=x·y=−3x+16 두 직선, AP=A'P 등분표식 |
| 제일고 유사3/Q07 | 문제 | EXEMPT — 반지름은 미지수이고 주어진 좌표로 방정식 수립 가능 | — | — | N/A | N/A |
| 제일고 유사3/Q07 | 해설 | BENEFICIAL — 두 접선과 반지름의 직각 관계 | construction-spike-v1 | `q7-solution.plan.json` | PASS/PASS | PASS — C(1,1), P(5,4), r=2, 두 접선 기울기 1±√21/6의 정확한 `SOURCE_LINE`, 두 수선의 발 T1·T2와 `rightAngles[r1,r2]` |
| 제일고 유사3/Q08 | 문제 | EXEMPT — 네 학생의 진술을 도식 없이 판정 | — | — | N/A | N/A |
| 제일고 유사3/Q08 | 해설 | EXEMPT — 참·거짓 후보 소거는 문장으로 완결 | — | — | N/A | N/A |
| 제일고 유사3/Q09 | 문제 | EXEMPT — 절편형 직선과 점의 조건이 모두 주어짐 | — | — | N/A | N/A |
| 제일고 유사3/Q09 | 해설 | BENEFICIAL — 등호 때 두 절편의 길이 | construction-spike-v1 | `q9-solution.plan.json` | PASS/PASS | PASS — A(6,0), B(0,12), P(2,8), 2x+y=12에 대응하는 직선, `dimensions[dOA]=6`·`[dOB]=12`. 넓이를 묻지 않아 기존 삼각형 채움 제거 |
| 제일고 유사3/Q10 | 문제 | REQUIRED — 함수의 대응도 자체가 발문 자료 | set-diagram-figure-v1 | `q10-problem.plan.json` | PASS/PASS | PASS — 1→4, 2→5, 3→1, 4→2, 5→3의 `diagram.arrows` 다섯 개; 정답 경로 강조 없음 |
| 제일고 유사3/Q10 | 해설 | BENEFICIAL — 역함수를 두 번 추적 | set-diagram-figure-v1 | `q10-solution.plan.json` | PASS/PASS | PASS — 같은 다섯 화살표와 `highlightPaths`로 2←4←1 역추적, 해설 전용 |
| 제일고 유사3/Q11 | 문제 | EXEMPT — 무리함수 식과 사분면 조건이 명시됨 | — | — | N/A | N/A |
| 제일고 유사3/Q11 | 해설 | BENEFICIAL — k=1과 경계 k=2 그래프 비교 | multi-curve-figure-v1 | `q11-solution.plan.json` | PASS/PASS | PASS — `SQRT` 두 곡선의 부호·오프셋과 (4,1), (3,0), (0,−1) 표시, 면 채움 없음 |
| 제일고 유사3/Q12 | 문제 | REQUIRED — 실제 f 그래프의 값이 문제 조건 | piecewise-polynomial-spike-v1 | `q12-problem.plan.json` | PASS/PASS | PASS — 원그림의 (2,1), (4,2), (6,4), (9,6) 경유, y=x 기준선, 좌표 보조선; 답 8 및 해설용 경로는 없음 |
| 제일고 유사3/Q12 | 해설 | BENEFICIAL — 합성함수·역함수의 값 추적 | piecewise-polynomial-spike-v1 | `q12-solution.plan.json` | PASS/PASS | PASS — f(6)=4, f(4)=2, f⁻¹(4)=6을 `overlays.points/guides/segments`와 y=x 기준선에 대조 |

**합계:** 12문항/24축 = REQUIRED 2 + BENEFICIAL 10 + EXEMPT 12. 제작용 plan 12개, shallow 12/12, full 12/12, DRAWN_FEATURE_PARITY 12/12, ENGINE_CAPABILITY_PENDING 0. 면 채움은 넓이를 묻는 Q03 해설 1건뿐. 렌더·실물 검수·게시 `NOT_RUN`.
