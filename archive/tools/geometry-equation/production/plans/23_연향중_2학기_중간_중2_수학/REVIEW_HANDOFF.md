# 2023 연향중 중2 2학기 중간: 원본 대조·SVG 재설계 인계

## 범위와 판정 원칙

- **대상**: `archive/exams/original/middle/m2/2mid/23_연향중_2학기_중간_중2_수학.js`의 q1~q24, 문제/해설 **48개 축**. 다른 시험·학년은 범위 밖이다.
- **대조 자료**: 해당 JS의 `content`·`solution` 및 `archive/assets/images/23_연향중_2학기_중간_중2_수학/` 아래 원본 `q*.png`와 현행 `q*-*-visual-v2.svg`. 원본 스캔과 기존 SVG를 별도 전체 접촉표로 시각 대조했다.
- `PLAN_READY`는 공식 `construction-spike-v1` / `PLANE_FIGURE_v1`의 **실행형 plan**이고, 해당 축의 `sourceConditions.mappedTo`가 실제 그려지는 필드를 가리킨다. `KEEP`은 새 plan을 작성한 것으로 세지 않는다. `TEXT_EXEMPT`는 해당 해설/문제에 별도의 도형이 불필요하다는 **축별** 판단이다.
- `DRAWN_FEATURE_PARITY=PASS (plan-fields)`는 원문·원본 그림과 plan의 **그려질 필드**가 1:1 대응함을 확인했다는 뜻이며 렌더 실물 PASS가 아니다. 엔진 SVG/PNG·학생화면·A4는 이 라인의 작업 범위 밖이므로 모두 `NOT_RUN`. 학생 게시 전 후속 렌더 검수가 필요하다.
- 현행 v2 SVG에는 `fill="white"` 캔버스 및 도형의 `fill="#fff"`가 있다. **흰 캔버스는 공식 가이드가 허용하나, 내부 폴리곤의 불필요한 흰 채움은 잔존 기술 부채**다. `KEEP` 표시는 이 스타일 부채가 정리됐다는 뜻이 아니다. 실제로 풀이를 오도하는 채색과 원본 대비 결함이 확인된 축을 우선 재설계했다.

## 문항별 독립 축 검사

| qid | 문제 축: 판정 및 1:1 도형 점검 | 해설 축: 판정 및 1:1 도형 점검 |
|---|---|---|
| 01 | `KEEP` — AB=AC 눈금, AD의 각 이등분, P/B/C 연결 유지 | **`PLAN_READY`** — 기존 문제 그림만으로 설명된 AD⊥BC, BD=DC, PB=PC 및 A의 반각을 해설 표식으로 분리 |
| 02 | `KEEP` — 주어진 서로 같은 다섯 변의 표식 유지 | `TEXT_EXEMPT` — 각도 계산은 문제 도식과 풀이 글로 판독 가능 |
| 03 | `KEEP` — 직각 D/C, AD=AC, EC=4 유지 | `KEEP` — 넓이 DBE 강조의 면 채움은 의도적·필요 |
| 04 | `KEEP` — O, OA=3, 30°, 45° 위치 유지 | `TEXT_EXEMPT` — 별도 해설 도식 없이 기존 각·길이로 계산 가능 |
| 05 | `KEEP` — 외심 O, 내심 I, 64° 유지 | `TEXT_EXEMPT` — 기존 점·각으로 대조 가능 |
| 06 | `KEEP` — DE∥BC, I, 두 삼각형의 관계 유지 | `TEXT_EXEMPT` — 추가 시각요소 없이 문장 유도 가능 |
| 07 | `TEXT_EXEMPT` — 선택지 텍스트형 문항 | `TEXT_EXEMPT` — 그림 없는 판별 해설 |
| 08 | **`PLAN_READY`** — 삼각형 ADP=17, BCP=13, CDP=16을 **실제 면 내부 텍스트**에 배치; 미지의 ABP=14는 노출하지 않음 | `TEXT_EXEMPT` — 새 문제 그림의 세 수치로 넓이 합 등식 설명 가능 |
| 09 | `KEEP` — 57°, 7, x, y 및 연결선 유지 | `TEXT_EXEMPT` — 기존 정보로 비례·각 계산 가능 |
| 10 | `KEEP` — 정사각형, 10, x 유지 | `TEXT_EXEMPT` — 도식 반복 불필요 |
| 11 | **`PLAN_READY`** — 원본에 **실선**인 정사각형의 AC·BD 대각선을 기존 점선에서 복구; EFGH의 직각·합동 길이 및 I·J 교점 표시 | `KEEP` — 작은 면적을 합동으로 옮기는 넓이 해설의 채움은 의도적 |
| 12 | `KEEP` — 사각형 ㄱ~ㅁ 선택지 도식 유지 | `TEXT_EXEMPT` — 별도 풀이 그림 불필요 |
| 13 | `KEEP` — 두 닮은 사각형의 대응변·치수 유지 | `TEXT_EXEMPT` — 기존 비교 도식으로 계산 가능 |
| 14 | `KEEP` — 직육면체의 4, 8, x, 9, 6, y 값과 면 위치 유지 | `TEXT_EXEMPT` — 비율 계산, 새 입체도 불필요 |
| 15 | `KEEP` — AB=4, AD=2, AC=8, BD=5 유지 | `TEXT_EXEMPT` — 기존 대각선 도형으로 계산 가능 |
| 16 | `KEEP` — 대응각 눈금 및 BC=12, CD=24 유지 | `TEXT_EXEMPT` — 닮음 대응은 본문에서 설명 가능 |
| 17 | `KEEP` — 12, 18, 15 및 중점 표시 유지 | `TEXT_EXEMPT` — 중점연결 정리 계산 |
| 18 | `KEEP` — DE∥BC 및 변의 각 부분 길이 유지 | `TEXT_EXEMPT` — 기존 평행선 도식으로 충분 |
| 19 | `KEEP` — 세 평행선·두 횡단선 및 해당 길이 유지 | `TEXT_EXEMPT` — 비례식 계산 |
| 20 | `KEEP` — JS의 실제 그림 참조와 기존 자산의 선·값 확인 | `TEXT_EXEMPT` — 해설은 주어진 도식을 재사용 |
| 21 | `KEEP` — 직선 l과 수선의 발·8/6 표시 유지 | `TEXT_EXEMPT` — 기존 직각삼각형에서 길이 관계 유도 |
| 22 | `KEEP` — 원/삼각형/중심 및 반지름 관계 유지 | `KEEP` — R=13/2, r=2의 해설 라벨, 불필요한 면색 없음 |
| 23 | `KEEP` — 50° 및 이등분선 구조 유지 | `TEXT_EXEMPT` — 기존 삼각형에서 각 추적 |
| 24 | `KEEP` — AC 중점 O, 수직 EF, DE=2, BC=8 유지 | **`PLAN_READY`** — 둘레 문제인데 칠해진 AFCE 면을 제거하고 O의 직각, AO=OC·EO=OF 눈금과 치수선 재구성 |

## 생성 plan과 그려질 기능의 연결

| qid/축 | plan | 기존 결함/개선 | 렌더 필드 대조 |
|---|---|---|---|
| 01/S | `q01-solution.plan.json` | 풀이 핵심의 수선·중점·같은 거리 표식 부재 | `rightAngles.perpD`, `equalLengths.equalBDCD`, `equalPBPC`, `angles.halfA1/2` → `PASS` |
| 08/P | `q08-problem.plan.json` | 17·13·16의 삼각형 대응을 숫자만으로 파악하기 어려움 | `textLabels.area17/13/16`, `parallels.parallelTopBottom` → `PASS` |
| 11/P | `q11-problem.plan.json` | 원본 실선 대각선을 점선으로 저하 | `displaySegments.sAE/sEC/sBE/sED` (실선), `rightAngles.cornerE`, 합동 길이 표식 → `PASS` |
| 24/S | `q24-solution.plan.json` | 둘레 해설의 무관한 채색·중점/직각 강조 부족 | `rightAngles.perpendicularO`, `equalLengths.diagonalMidpoint/otherMidpoint`, `dimensions.dimDE/dimBC`; `regions` 없음 → `PASS` |

## 검증 및 게시 경계

- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow .../q*.plan.json` → **4/4 OK**.
- 같은 파일의 일반/full lint → **4/4 OK** (공식 Noto Sans KR 고정 폰트·잠금 의존성으로 검사).
- 네 plan의 문제/해설 원문 인용, 소스 조건과 `mappedTo` 대상, 숫자·길이·각·실선·정답 비노출·기본 no-fill → `sourceVsPlan=REVIEWED`, `DRAWN_FEATURE_PARITY=PASS (plan-fields)`.
- **SVG/PNG 실물 생성·학생 화면·A4 시각검수·JS 게시**: `NOT_RUN`. `KEEP` v2의 불필요한 흰 내부 채움은 별도 정리 과제로 남으며, 이 문서는 그 사실을 숨기지 않는다.
