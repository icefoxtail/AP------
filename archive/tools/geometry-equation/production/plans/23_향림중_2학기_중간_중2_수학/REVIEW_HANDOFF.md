# 2023 향림중 중2 2학기 중간 — 원본/기존 SVG 2축 검수 및 렌더 인계

- 대상 JS: `archive/exams/original/middle/m2/2mid/23_향림중_2학기_중간_중2_수학.js` (24문항, 문제/해설 총 48축).
- 원본 `archive/assets/images/23_향림중_2학기_중간_중2_수학/qN.png` 15개, 현행 JS가 참조하는 문제 그림 SVG 15개·해설 SVG 6개와 발문/해설을 1:1로 시각·수학 대조했다.
- `REPLAN`: 공식 엔진 실행 가능 `construction-spike-v1` plan. `SVG_KEEP`: 원본의 필요 특징이 이미 읽히므로 기존 학생용 SVG 보존. `EXEMPT`: 별도 그림 없이 문자·수식으로 완결하는 축. 새 SVG를 수동 작성하지 않았다.
- 현재 **plan-only** 단계. 새 plan의 SVG/PNG 렌더 및 최종 학생 화면/A4/JS 자산 연결은 모두 **NOT_RUN**이다.

## 문항별 문제/해설 독립 판정 (48/48축)

| qid | 문제 축·원본과 비교 | 해설 축·기존 결함/판정 | 새 plan | 검증 |
| --- | --- | --- | --- | --- |
| 01 | EXEMPT — 문자/계산 발문, 별도 도형 불필요 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 02 | SVG_KEEP — 원본 도형과 기존 문제 SVG 대응 | EXEMPT — 기호·문장 계산으로 충분 | — | 기존 문제 SVG 유지 |
| 03 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 04 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 05 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 06 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 07 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 08 | SVG_KEEP — 원본 도형의 선·각 배치 유지 | EXEMPT — 수식 중심 풀이 | — | 기존 문제 SVG 유지 |
| 09 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 10 | SVG_KEEP — 원본 도형의 필수 조건 읽힘 | EXEMPT — 추가 해설 그림 없이 충분 | — | 기존 문제 SVG 유지 |
| 11 | SVG_KEEP — 원본 보조선/라벨 대응 | EXEMPT — 원문 그림과 식으로 충분 | — | 기존 문제 SVG 유지 |
| 12 | SVG_KEEP — 이등분선과 두 수선의 문제 조건 유지 | REPLAN — 불필요한 초록 면색 제거, 직각 C/D·각 이등분·PC=PD·OC=OD 길이 눈금 복원 | `q12-solution.plan.json` | shallow/full PASS, parity PASS |
| 13 | SVG_KEEP — 원본 도형·길이 조건 읽힘 | EXEMPT — 문제 그림과 풀이 텍스트로 충분 | — | 기존 문제 SVG 유지 |
| 14 | SVG_KEEP — 원본 선/길이·각 대응 | SVG_KEEP — 기존 해설이 결정적 관계를 표현 | — | 기존 문제·해설 SVG 유지 |
| 15 | SVG_KEEP — 원본 직각삼각형·60° 보존 | REPLAN — 넓이 문제가 아닌데 불필요한 삼각형 면색; 외심 O·직각 A·AOC 정삼각형 눈금·반지름 치수 복원 | `q15-solution.plan.json` | shallow/full PASS, parity PASS |
| 16 | SVG_KEEP — 원본 도형 관계 보존 | EXEMPT — 그림 중복 없이 계산으로 충분 | — | 기존 문제 SVG 유지 |
| 17 | SVG_KEEP — 원본 도형 관계 보존 | EXEMPT — 별도 풀이 그림 불필요 | — | 기존 문제 SVG 유지 |
| 18 | **REPLAN** — 기존 70° 호가 대각선 쪽 각으로 읽히는 소속 오류 위험; 정확한 ∠ADC, AB7, BD10·평행변 복원 | EXEMPT — 평행사변형 성질의 문장 풀이로 충분 | `q18-problem.plan.json` | shallow/full PASS, parity PASS |
| 19 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 20 | SVG_KEEP — 원본 평행선·큰 삼각형·넓이 17/8 보존 | REPLAN — 기존 해설이 **ACE 영역에 8을 적음**(실제 ACE=9). ABC=8와 ACE=9를 서로 다른 해당 면 안에만 표시, ACD=9 관계 복원 | `q20-solution.plan.json` | shallow/full PASS, parity PASS |
| 21 | SVG_KEEP — 원본 도형·주어진 각 보존 | EXEMPT — 문제 그림 및 계산 풀이로 충분 | — | 기존 문제 SVG 유지 |
| 22 | EXEMPT — 별도 도형 조건 없음 | EXEMPT — 계산 풀이 | — | 적용 없음 |
| 23 | SVG_KEEP — 원본 내접원·둘레/반지름 조건 보존 | REPLAN — 기존 해설 보조 점선/라벨 혼잡; 임의 직각 꼭짓점 도입 없이 세 접점·3 직각·반지름 3·둘레 40 복원 | `q23-solution.plan.json` | shallow/full PASS, parity PASS |
| 24 | SVG_KEEP — 원본 평행사변형/각 이등분 조건 보존 | REPLAN — 길이 문제에 불필요한 삼각형 면색, B-E-F-C 분할 치수/각 이등분 호 부정확; AB6/AD10과 BF6·BE4·EF2 복원 | `q24-solution.plan.json` | shallow/full PASS, parity PASS |

## 신규 plan 원문 특징 → 실제 렌더 필드 1:1 대응 (6/6)

| qid / 축 | DRAWN_FEATURE_PARITY 실제 도형 요소·필드 | 면 채움 | 엔진 지원 |
| --- | --- | --- | --- |
| 12 / 해설 | `sOP/sPC/sPD`; `perpC/perpD`; `bisectorUpper/bisectorLower`; `equalDistances/equalRadial` | 없음 | 지원 |
| 15 / 해설 | `rightA`; `given60C/angle60A/angle60O`; `equilateralAOC/hypotenuseHalves`; `radius6` | 없음 | 지원 |
| 18 / 문제 | `parallelHorizontal/parallelSides`; `given70`(∠ADC); `dimAB7/dimBD10`; 대각선 교점 O | 없음 | 지원 |
| 20 / 해설 | `parallelACDE`; `givenABC8`은 [ABC] 실제 삼각형, `derivedACE9`은 [ACE] 실제 삼각형; `equalACD9` | **넓이 분할의 두 면만 LIGHT/WARM** | 지원 |
| 23 / 해설 | `incircle`; 접점 D/E/F `PERPENDICULAR_FOOT`; `perpD/perpE/perpF`; `threeRadii`, `radius3`, `perimeter40` | 없음 | 지원 |
| 24 / 해설 | `bisectorA1/A2`, `bisectorD1/D2`; `abBf/cdCe`; `side6/top10/be4/ef2/bf6` | 없음 | 지원 |

특히 **문제 plan q18에는 미지의 AC 길이나 ④ 정답을 넣지 않았다.** q20의 두 면은 서로 겹치지 않으며 면적을 독립적으로 계산해 8과 9임을 확인했다. q23의 대표 삼각형은 둘레 40, 내접원의 반지름 3이 정확한 부등변삼각형이며 원문에 없는 직각 꼭짓점을 임의 추가하지 않는다.

## 검증·인계

- 공식 `plan-lint.cjs --shallow` 향림중 6/6 PASS, full 6/6 PASS.
- 독립 `DRAWN_FEATURE_PARITY` 향림중 6/6 PASS: 점 구성·치수·각·수선·평행·원·길이눈금·넓이와 `sourceConditions.mappedTo` 모두 실제 기하 필드에 대응했다.
- `ENGINE_CAPABILITY_PENDING` 0건. 이는 렌더 시 배치/폰트/가시성 오류가 없다는 주장과 다르다.
- 기존 문제 SVG 14축과 해설 SVG 1축은 신규 plan의 lint/feature-parity 통과 건수에 섞지 않았다. 이미지/해설을 포함한 모든 원본 자산·JS를 그대로 두어, 최종 교체는 렌더 검증 후 별도 운영 단계다.
- 렌더·PNG 표본 대조·학생 모바일·A4 인쇄·운영 연결 **NOT_RUN**.
