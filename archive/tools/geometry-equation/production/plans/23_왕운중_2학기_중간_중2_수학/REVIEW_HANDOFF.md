# 2023 왕운중 중2 2학기 중간: 원본 대조·SVG 재설계 인계

## 범위와 판정 원칙

- **대상**: `archive/exams/original/middle/m2/2mid/23_왕운중_2학기_중간_중2_수학.js`의 q1~q24, 문제/해설 **48개 축**. 다른 시험·학년은 건드리지 않았다.
- 해당 JS의 원문 `content`·`solution`, 원본 `q*.png`, 기존 `q*-*-visual-v2.svg`를 문항별로 대조했다. `PLAN_READY`만 새 JSON 수이며, `KEEP`·`TEXT_EXEMPT`는 제작 실적으로 세지 않는다.
- 공식 가이드에 따르면 캔버스는 흰색이지만 도형 면의 기본 채움은 없다. 기존 SVG의 `fill="#fff"` 폴리곤은 기술 부채로 남아 있고, `KEEP`은 그것을 제거했다는 뜻이 아니다. 실제 불필요한 색 면과 중요한 각·길이 표식 누락이 확인된 축을 재설계했다.
- 아래 `DRAWN_FEATURE_PARITY=PASS (plan-fields)`는 **원문–plan의 렌더 필드 1:1 대응 검수**다. 공식 엔진의 SVG/PNG 출력, 학생 화면, A4와 실제 게시 단계는 모두 `NOT_RUN`.

## 문항별 독립 축 검사

| qid | 문제 축: 판정 및 1:1 도형 점검 | 해설 축: 판정 및 1:1 도형 점검 |
|---|---|---|
| 01 | `KEEP` — 두 원뿔의 밑면·모선·높이 대응 유지 | `TEXT_EXEMPT` — 닮음비의 입체 계산 설명 |
| 02 | `TEXT_EXEMPT` — 도형 없는 선택지 문제 | `TEXT_EXEMPT` — 문자 조건만으로 판단 |
| 03 | `KEEP` — 다섯 선택지의 서로 다른 각 배치 유지 | `TEXT_EXEMPT` — 선택지의 도식 직접 비교 |
| 04 | `TEXT_EXEMPT` — 텍스트 중심 판별 | `TEXT_EXEMPT` — 별도 도형 불필요 |
| 05 | **`PLAN_READY`** — AO=BO 같은 길이와 AC⊥BD의 직각이 원문에는 있으나 기존 도형의 직접 표식이 부족 | `TEXT_EXEMPT` — 새 문제 그림의 길이·직각 조건으로 직사각형+마름모 판정 가능 |
| 06 | `TEXT_EXEMPT` — 도형 없는 문제 | `TEXT_EXEMPT` — 별도 도형 불필요 |
| 07 | `KEEP` — 원호 BD=12π, 중심과 각 유지 | `KEEP` — θ·3θ 유도 관련 호 강조 유지 |
| 08 | `KEEP` — 대응 길이 108/x·같은 길이 구분 유지 | `KEEP` — 해당 길이 계산 단계 시각화 유지 |
| 09 | `KEEP` — 내심 I와 내접 수선 발 D/E/F의 직각 유지 | `TEXT_EXEMPT` — 내심의 거리 성질 설명 |
| 10 | `KEEP` — 각의 이등분선·수선의 발 Q/R 유지 | `TEXT_EXEMPT` — 기존 삼각형에 대응 |
| 11 | `KEEP` — BC=12, CD=10 및 이등분선·평행 구조 유지 | **`PLAN_READY`** — 둘레 계산에 무관한 ABEF 면색 제거, AB=BE=EF=FA=10의 같은 길이 표식 명시 |
| 12 | `KEEP` — 두 내심 I/I′ 및 146° 유지 | `TEXT_EXEMPT` — 각의 이등분선 계산 |
| 13 | `KEEP` — 닮은 두 사다리꼴의 10/15/72 및 5/4/108 대응 유지 | `TEXT_EXEMPT` — 닮음비·넓이 계산 |
| 14 | `KEEP` — BD∥EF 구조 유지 | `KEEP` — 넓이 등식의 대응 면색은 목적에 부합 |
| 15 | `KEEP` — E가 CD 중점, 50°/20°/110°와 H의 수선 유지 | **`PLAN_READY`** — 각도 해설의 무관한 삼각형 채움 제거; 수선 H, 중점 M/E, MD∥BE, 70°/40° 실제 표식 추가 |
| 16 | `KEEP` — 내심 I, 30°/50°, AH 수선 유지 | **`PLAN_READY`** — 해설의 50°−40°=10°를 꼭짓점 A의 각 호와 H 직각으로 분리 |
| 17 | `TEXT_EXEMPT` — 도형 없는 판별/계산 | `TEXT_EXEMPT` — 그림 불필요 |
| 18 | `KEEP` — BD의 수직이등분선 EF와 교점 유지 | `TEXT_EXEMPT` — 수선·거리 관계는 문제 도식에서 판독 |
| 19 | `KEEP` — 대각선 교점 O의 평행사변형 구조 유지 | `TEXT_EXEMPT` — 기존 도식에서 성질 전개 |
| 20 | `KEEP` — 외심 O, ∠OAB=33°, ∠ABC=75°, 수선 발 D 유지 | **`PLAN_READY`** — 해설의 무관한 OBC 면 채움 제거, OA=OB=OC 눈금, ∠OBC=∠BCO=42°와 목표 48° 실제 각 호 추가 |
| 21 | `KEEP` — 맞은편 변의 x+2, 2x−3, y+1, 10−2y 표기 유지 | `TEXT_EXEMPT` — 대변의 길이 등식 계산 |
| 22 | **`CONTENT_CONFLICT`** — 원문 ∠B=∠C, AB=7 cm, 면적 42 cm²는 수학적으로 양립 불가; 원본 PNG를 잘못된 비율로 재제작하지 않음 | **`CONTENT_CONFLICT`** — 두 변 AB=AC=7일 때 최대 면적 24.5 cm²이므로 42 cm²와 풀이의 PM+PN=12 cm 동시 성립 불가. **원문 수치 정오 확인 전 plan 금지** |
| 23 | `KEEP` — 70°/56° 및 이등분선 유지 | `TEXT_EXEMPT` — 각도 계산 |
| 24 | `KEEP` — 두 동심/내접 원 관련 색칠 영역과 6/8/10 유지 | `KEEP` — R=5, r=2 및 **색칠된 원 사이 영역**은 발문상 필수 |

## 생성 plan과 그려질 기능의 연결

| qid/축 | plan | 기존 결함/개선 | 렌더 필드 대조 |
|---|---|---|---|
| 05/P | `q05-problem.plan.json` | AO=BO·AC⊥BD 그림 표식 부족 | `equalLengths.equalHalfDiagonals`, `rightAngles.diagonalPerpendicular` → `PASS`; 문제 정답 문자는 텍스트 라벨에 쓰지 않음 |
| 11/S | `q11-solution.plan.json` | 둘레와 무관한 면 채움 | `equalLengths.rhombusSides`, `dimensions.base12/side10`, `parallels.adBcParallel`; `regions` 없음 → `PASS` |
| 15/S | `q15-solution.plan.json` | 각 추적의 수선·중점·각 호 미흡, 면색 잔존 | `PERPENDICULAR_FOOT.H`, `rightAngles.footH`, `equalLengths.midpointE/midpointM`, `parallels.parallelME`, `angles.angle50B/20B/110C/70A/40D` → `PASS` |
| 16/S | `q16-solution.plan.json` | 50°·40°·10° 해설 각도를 시각적으로 구별하기 어려움 | `rightAngles.perpH`, `angles.halfA/height40/result10`, 원문 두 밑각 → `PASS` |
| 20/S | `q20-solution.plan.json` | 넓이와 무관한 면 채움, 외심/각도 관계 약화 | `rightAngles.perpOD`, `equalLengths.radii`, `angles.given33/given75/angle42B/angle42C/answer48`, `regions` 없음 → `PASS` |

## 수학적 정합성 중단 사유: q22

원문이 `∠B=∠C`라고 했으므로 `AB=AC=7`. 두 변 사이 각을 θ라 하면 넓이는 `1/2·7·7·sin θ ≤ 49/2 = 24.5 cm²`이다. 원문의 `42 cm²`는 불가능하다. 해설 역시 이를 전제로 `PM+PN=12 cm`를 구하므로 **도형 엔진의 한계가 아니라 소스 내용의 모순**이다. 사용자 범위가 plan 재설계로 지정되어 있어 JS 수치를 임의 수정하지 않았다. `ENGINE_CAPABILITY_PENDING`으로 거짓 분류하지 않고 `SOURCE_CONTENT_BLOCKED`로 남긴다.

## 검증 및 게시 경계

- 5개 plan의 `plan-lint --shallow` → **5/5 OK**.
- 동일 plan의 일반/full lint → **5/5 OK** (공식 고정 폰트·잠금 의존성).
- source 문장과 `sourceConditions.mappedTo`를 실제 점/선/표식 필드로 추적하고 원본 도면의 주어진 수치·표식·문제 정답 비노출을 대조 → 5건 `sourceVsPlan=REVIEWED`, `DRAWN_FEATURE_PARITY=PASS (plan-fields)`.
- 엔진 SVG/PNG 렌더, 학생 화면, A4, JS 게시 → **`NOT_RUN`**. q22는 원문 정오표와 풀이 재확인 후 재시도. 기존 v2의 흰 내부 폴리곤 채움은 잔존 기술 부채다.
