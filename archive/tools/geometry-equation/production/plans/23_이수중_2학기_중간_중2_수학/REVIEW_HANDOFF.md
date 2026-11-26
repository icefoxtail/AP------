# 2023 이수중 중2 2학기 중간 — 원본/기존 SVG 2축 검수 및 렌더 인계

- 대상 JS: `archive/exams/original/middle/m2/2mid/23_이수중_2학기_중간_중2_수학.js` (24문항, 문제/해설 총 48축).
- 참조 이미지: `archive/assets/images/23_이수중_2학기_중간_중2_수학/`의 원본 `qN.png` 23개 및 현재 JS가 참조하는 해설 SVG 21개. 원본 이미지와 문항·해설 텍스트, 현행 SVG를 번호별로 대조했다.
- `REPLAN`은 바로 위 폴더의 실제 `construction-spike-v1` 제작용 JSON이다. `SOURCE_PNG_KEEP`은 품질 저하를 유발하지 않는 원본 기출 스캔 보존, `SVG_KEEP`은 기존 도형을 유지하는 판단, `EXEMPT`는 그림이 필요한 수학적 보조관계가 없는 축이다.
- 현재 단계는 **plan-only**: 학생에게 연결된 `image`/`solutionImage`·기존 SVG·기출 JS는 수정하지 않았다. 아래의 새 plan은 엔진 렌더·SVG/PNG 시각검수·휴대폰·A4·운영 연결이 각각 **NOT_RUN**이다.

## 문항별 문제/해설 독립 판정 (48/48축)

| qid | 문제 축·원본과 비교 | 해설 축·기존 결함/판정 | 해설 plan | 검증 |
| --- | --- | --- | --- | --- |
| 01 | SOURCE_PNG_KEEP — 원본 외각·연장선 보존 | REPLAN — 등변 눈금과 밑각/꼭지각 호 복원 | `q01-solution.plan.json` | shallow/full PASS, parity PASS |
| 02 | SOURCE_PNG_KEEP — 원본 기하 도식 보존 | SVG_KEEP — 기존 해설의 필요한 구간 관계 유지 | — | 기존 자산 유지 |
| 03 | SOURCE_PNG_KEEP — 문제에 필요한 원본 이미지 보존 | EXEMPT — 계산·해설은 별도의 도형 없이 완결 | — | 적용 없음 |
| 04 | SOURCE_PNG_KEEP — 여러 도형이 있는 원본 보존 | SVG_KEEP — 기존 해설 핵심 대응 도형 유지 | — | 기존 자산 유지 |
| 05 | SOURCE_PNG_KEEP — 원본 각·변 배치 보존 | SVG_KEEP — 기존 풀이 도형의 필수 선/라벨 유지 | — | 기존 자산 유지 |
| 06 | SOURCE_PNG_KEEP — 원본 도형 보존 | SVG_KEEP — 기존 도형의 해설 표식 유지 | — | 기존 자산 유지 |
| 07 | SOURCE_PNG_KEEP — 접원·세 접점·곡선 치수지시 보존 | **REPLAN (기존 plan 교체)** — 가짜 `mappedTo` 제거, 접점 D/E/F·세 직각·동일 접선 눈금/치수 1:1 | `q7-solution.plan.json` | shallow/full PASS, parity PASS |
| 08 | SOURCE_PNG_KEEP — 교차 대각선의 원본 보존 | REPLAN — 기존 SVG의 꼭짓점 위치/평행사변형 배치 오류, OA=OC=4/OB=OD=6/AB=CD=5 실제 수치 복원 | `q08-solution.plan.json` | shallow/full PASS, parity PASS |
| 09 | SOURCE_PNG_KEEP — 원본 문자·기하 조건 보존 | SVG_KEEP — 기존 해설 도형은 유지할 만한 수준 | — | 기존 자산 유지 |
| 10 | SOURCE_PNG_KEEP — 주어진 그림 보존 | EXEMPT — 도형의 추가 설명보다 식·문장 풀이가 충분 | — | 적용 없음 |
| 11 | SOURCE_PNG_KEEP — 마름모 A/B/C/D·각과 x,y 보존 | **REPLAN (기존 plan 교체)** — 가짜 `mappedTo` 제거, 네 등변·수직이등분·A60/B30·BO=OD8 표시 | `q11-solution.plan.json` | shallow/full PASS, parity PASS |
| 12 | SOURCE_PNG_KEEP — 원본 배치 보존 | SVG_KEEP — 기존 `solution-v2`의 필수 도형 관계 유지 | — | 기존 자산 유지 |
| 13 | SOURCE_PNG_KEEP — 원본 배치 보존 | SVG_KEEP — 기존 `solution-v2` 유지 | — | 기존 자산 유지 |
| 14 | SOURCE_PNG_KEEP — l,m,n과 X형 교차선 보존 | REPLAN — 기존 해설의 횡단선이 **교차하지 않는 형태**, 원본 X교차·x/10/5/7과 평행선 호응 복원 | `q14-solution.plan.json` | shallow/full PASS, parity PASS |
| 15 | SOURCE_PNG_KEEP — 원본 도형 보존 | SVG_KEEP — 기존 길이·각 해설 도식 보존 | — | 기존 자산 유지 |
| 16 | EXEMPT — 원문에 별도 시각 도형 없음 | EXEMPT — 수식/문장 풀이로 충분 | — | 적용 없음 |
| 17 | SOURCE_PNG_KEEP — 원본 조건 보존 | SVG_KEEP — 기존 해설 도형 유지 | — | 기존 자산 유지 |
| 18 | SOURCE_PNG_KEEP — 원본 조건 보존 | SVG_KEEP — 기존 해설 도형 유지 | — | 기존 자산 유지 |
| 19 | SOURCE_PNG_KEEP — 원본 맞꼭지각 도식 보존 | REPLAN — 기존 SVG가 **같은 방향 내포 삼각형**으로 잘못 표현, 실제 대칭 맞꼭지각·평행 밑변·12/10/25 치수 복원 | `q19-solution.plan.json` | shallow/full PASS, parity PASS |
| 20 | SOURCE_PNG_KEEP — 원본 조건 보존 | SVG_KEEP — 기존 계산용 도형 유지 | — | 기존 자산 유지 |
| 21 | SOURCE_PNG_KEEP — 원본 두 중심 도식 보존 | REPLAN — 기존 SVG 하단의 작고 분리된 텍스트 대신 외심 O/내심 I의 160°/130° 호·반지름 눈금 사용, 불필요한 이등변 가정 없음 | `q21-solution.plan.json` | shallow/full PASS, parity PASS |
| 22 | SOURCE_PNG_KEEP — 원본 A-E-F 보조선/점 보존 | REPLAN — 기존 해설의 보조점 F·연장선 EF 누락; 정사각형·SAS용 각45·외각65 복원 | `q22-solution.plan.json` | shallow/full PASS, parity PASS |
| 23 | SOURCE_PNG_KEEP — **원본 음영 사각형 EBFD** 보존 | REPLAN — 해설의 넓이 대상 영역·높이 부족; 오직 EBFD에 필수 음영과 점선 높이6/밑변3 지정 | `q23-solution.plan.json` | shallow/full PASS, parity PASS |
| 24 | SOURCE_PNG_KEEP — 원본 높이 AD와 직각 보존 | REPLAN — 기존 SVG의 길이 소속 혼동; A·D의 2개 직각 및 6/8/10, BC25/2·CD9/2 치수선 정확 배치 | `q24-solution.plan.json` | shallow/full PASS, parity PASS |

## 신규/교체 plan 실제 렌더 필드 대비 원문 특징 (10/10)

| qid | DRAWN_FEATURE_PARITY 실제 필드 1:1 대응 | 면 채움 | 엔진 지원 |
| --- | --- | --- | --- |
| 01 | 연장선 `sDB`; `equalABAC`; `exterior120`, `baseB60`, `baseC60`, `apex60` | 없음 | 지원 |
| 07 | 내접원 `incircle`, 접점 D/E/F; `rightD/rightE/rightF`; `tangentFromA/B/C`; AB10/AC9/BC13와 BE7 길이 치수 | 없음 | 지원 |
| 08 | 진짜 평행사변형 A-B-C-D와 양분 대각선; `halfAC/halfBD/opposite5`; 4/6/5 대응 `dimensions` | 없음 | 지원 |
| 11 | `equalRhombus`, `bisectBD/bisectAC`, `perpDiagonals`; `given60A/angle30B`, BO·OD 8 | 없음 | 지원 |
| 14 | 3선 `threeParallel`, X 교차; `upperX/whole10/upper5/lower7`; l/m/n `textLabels` | 없음 | 지원 |
| 19 | 위 EAD·아래 BAC 맞꼭지각, `parallelBases`; `top12/upper10/whole25/answer18` | 없음 | 지원 |
| 21 | A80, O160, I130, B/C10 실제 `angles`; `equalRadii` | 없음 | 지원 |
| 22 | `POLAR_POINT → LINE_INTERSECTION`으로 E와 F 작도; `sEF`; `given20`, D45×2, C20, E65; `equalADCD` | 없음 | 지원 |
| 23 | `targetEBFD`의 18 면적만 `regions`; `sAH` 점선, `perpH`; BC13·AB10·h6·ED/BF3 | **넓이 대상만 LIGHT** | 지원 |
| 24 | `rightA/rightD`, `dimAB10/dimBD8/dimAD6/dimBC25half/dimCD9half` | 없음 | 지원 |

문제용 plan을 새로 그리지 않은 23축은 **원본 기출 PNG를 보존하는 것이 원본 대비 화질·정보를 지키는 판단**이다. 유지되는 기존 SVG 11축은 이번 신규 plan의 lint/필드 패리티 통과 수에 포함시키지 않는다. 기존 SVG의 최종 픽셀 레이아웃까지 새로 인증했다는 뜻도 아니다.

## 검증·인계

- 공식 `plan-lint.cjs --shallow`: 이수중 10/10 PASS. 공식 `plan-lint.cjs` full: 이수중 10/10 PASS.
- 별도 독립 기하 검산: 구성점 좌표/중점·각 이등분·직각·평행·눈금·길이·음영 다각형 면적·원문 `sourceConditions.mappedTo` ID 존재를 원문과 대조했다. **DRAWN_FEATURE_PARITY 10/10 PASS**, 가짜 mapping 0.
- `ENGINE_CAPABILITY_PENDING`: 0건 (현존 필드로 명시적 기능 모두 표현함). 이것은 향후 배치·폰트 문제가 발생하지 않는다는 보증이 아니다.
- 엔진 SVG 렌더 / PNG 표본 시각·실측 / 390px 학생 화면 / A4 인쇄 / 운영 자산 교체: **모두 NOT_RUN**. 담당 렌더 라인이 기존 `solutionImage`를 검사 통과 SVG로 교체·게시해야 실제 학생에게 반영된다.
