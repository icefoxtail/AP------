# 중3 2학기 기말 유사시험지 공식 SVG production plan 1사이클 — 2026-11-28

## 범위 및 원칙

- 기준: 원격 `origin/main` 9a0a04a5a5d686d799333bb9424530cae9015080에서 감사를 시작하고, 푸시 직전 갱신된 `176f021d8`을 fast-forward로 반영했다(대상 경로 변경 없음). 공개된 열린 PR 88건 각각의 정확한 변경 파일을 다시 조사한 결과 두 시험지의 원문·기존 plan·production 경로에는 변경 충돌이 없었다.
- 대상: `19_동산여중_2학기_기말_중3_유사`(25문항), `19_연향중_2학기_기말_중3_유사`(23문항). 기출 및 고교 파일은 변경하지 않았다.
- 공식 엔진의 `construction-spike-v1` 평면/좌표 작도 또는 `solid-figure-v1` 입체의 **실행형 JSON만** `archive/tools/geometry-equation/production/plans/<stem>/`에 80개 생성했다. 손 SVG·엔진 우회 없음.
- 이 표의 **문제/해설**은 서로 독립된 축이다. `REQUIRED`: 문항의 위치 관계·논증을 보존하는 그림이 필요한 축. `BENEFICIAL`: 글만으로도 해결되지만 공식 작도·보조선이 학습에 기여하는 축. `EXEMPT`: SVG 없이 표/식/명제 논리가 정보 손실 없이 충분한 축. `BLOCKED`: 원문 모순 또는 정답 유일성 문제로 제작을 중단한 축.

## 문항·문제/해설 축 전수 판정

### 19_동산여중 (25문항·50축)

| 번호 | 문제 축 | 해설 축 | 수학·교육적 이유와 계획에 표시한 핵심 관계 |
|---|---|---|---|
| 01 | BENEFICIAL | BENEFICIAL | 평행선·직각에 의한 5–12–13 삼각형을 보조 도형으로 나타냄. |
| 02 | BENEFICIAL | BENEFICIAL | 7²+24²=25²를 그림 속 직각·변 대응으로 확인. |
| 03 | EXEMPT | EXEMPT | 특수각 삼각비 **표의 빈칸**은 sin60°=√3/2와 cos45°=√2/2만 채우면 된다. 표 자체가 완성된 시각 자료이며 새 SVG는 항목·정답을 중복한다. 해설도 수치 대입 외의 공간 관계가 없다. |
| 04 | EXEMPT | EXEMPT | 다섯 식의 참·거짓은 특수각 값으로 직접 판정한다. sin90°+cos0°=2 등이 충분하고 단일 도형은 다섯 독립 명제에 잘못된 공통 상황을 부여한다. 해설도 식 비교가 핵심이다. |
| 05 | BENEFICIAL | BENEFICIAL | 30° 직각삼각형에서 빗변 6√2, 맞은편 변 3√2의 위치를 대응. |
| 06 | EXEMPT | EXEMPT | 제공된 삼각비 **조회표**에서 sin21°=0.3584, cos23°=0.9205, tan22°=0.4040을 읽는다. 문제와 해설 모두 표 읽기·산술평균이며 기하 SVG가 새로운 증거를 추가하지 않는다. |
| 07 | REQUIRED | REQUIRED | 직각삼각형 두 개가 공유하는 BC 및 DC=BC=2√3, AB=√3의 연쇄를 그림으로 결합. |
| 08 | REQUIRED | BENEFICIAL | 수선발 H가 두 60° 밑각을 나누는 방향이 넓이 36√3 계산의 공간적 전제. |
| 09 | REQUIRED | REQUIRED | 지름 8 원의 내접 정육각형을 중심각 60°인 여섯 합동 삼각형으로 분해. |
| 10 | BENEFICIAL | BENEFICIAL | 관측 눈높이 1.5m와 올려다본 60°를 서로 다른 높이 구간으로 표시; 24+1.5=25.5m. |
| 11 | BENEFICIAL | BENEFICIAL | A–B–H 순서와 30°/45° 위치를 따라 h/(400+h)=tan30°. |
| 12 | EXEMPT | EXEMPT | 외부점 접선 2개, 현의 수선 이등분, 같은 호의 원주각 등 **독립적인 다섯 정리**의 참·거짓 분류가 과제다. 하나의 도형이 모든 명제를 동시에 보여줄 수 없고 해설도 언어적 정리 검증만으로 완결된다. |
| 13 | REQUIRED | REQUIRED | 반지름10·중심에서 현까지 거리6·현 길이16의 수직 이등분 관계. |
| 14 | REQUIRED | REQUIRED | 지름16과 AM4에서 OM4, CD8√3을 구하는 수선발 M의 관계. |
| 15 | BLOCKED | BLOCKED | **원문 호 조건/각도 충돌 및 호 지정 모호성**. 아래 독립 반례 참조. 레거시 스케치가 Q를 반대쪽 반원에 둔 것은 원문 작은 호 PB 조건의 증거가 될 수 없으며, 임의 그림을 공식 plan으로 승인하지 않는다. |
| 16 | REQUIRED | REQUIRED | 지름 AB에 대한 C의 직각, 같은 쪽 원주각 30°, BC6√3의 대응. |
| 17 | REQUIRED | BENEFICIAL | 내접사각형의 대각 BAD와 BCD의 보각 102° 관계. |
| 18 | BENEFICIAL | BENEFICIAL | 지름13을 빗변으로 하는 5–12–13 직각삼각형과 sinA+cosA=17/13. |
| 19 | REQUIRED | REQUIRED | 두 접점 직각 90°와 APB48°에서 중심각 AOB132°를 유도. |
| 20 | REQUIRED | REQUIRED | 내접원의 동일 접선 길이 분할 u+v=8, v+t=11, u+t=9에서 CF=t=6. |
| 21 | BENEFICIAL | BENEFICIAL | 지름 AT와 접선 PT의 직각 및 32°의 여각 58°. |
| 22 | BENEFICIAL | BENEFICIAL | 5–12–13 직각삼각형에서 C의 세 삼각비를 대응. |
| 23 | REQUIRED | REQUIRED | 반지름1 사분원·42° 반직선의 호 좌표와 x=1 위의 탄젠트 높이를 나타냄; 0.67·0.74·0.90은 반올림값. |
| 24 | BENEFICIAL | BENEFICIAL | x절편 −3과 기울기 tan30°=√3/3인 좌표 직선; y절편√3. |
| 25 | REQUIRED | REQUIRED | 두 동심원 반지름10/6, 내부 원에 접한 큰 원의 현의 수직 이등분; AB=16. |

### 19_연향중 (23문항·46축)

| 번호 | 문제 축 | 해설 축 | 수학·교육적 이유와 계획에 표시한 핵심 관계 |
|---|---|---|---|
| 01 | REQUIRED | BENEFICIAL | B 직각인 √7–3–4 삼각형의 A/C 삼각비 대응. |
| 02 | REQUIRED | BENEFICIAL | BC에 수직인 DE로 생성되는 두 닮은 직각삼각형; BC13, 여각 x. |
| 03 | REQUIRED | REQUIRED | 공식 `solid-figure-v1` 직육면체: AD6, GH2, DH3; EG=2√10, AG=7 공간 피타고라스 및 ∠AGE. |
| 04 | EXEMPT | EXEMPT | ㄱ~ㄹ은 sin30°+cos60°=1, cos45°−sin45°=0, sin60°tan30°=1/2, tan60°/cos30°=2의 **네 독립적인 대수 명제**다. 한 그림을 추가하면 식별·참거짓과 무관한 가상 배치만 증가하고 해설도 정리 계산뿐이다. |
| 05 | REQUIRED | REQUIRED | 반지름1 사분원의 OAB/OCD 직각삼각형 및 a,b 여각; AB=sin a, CD=tan a. |
| 06 | REQUIRED | BENEFICIAL | 부러진 나무의 수직15m·빗변25m·수평20m와 37°의 두 삼각비. |
| 07 | REQUIRED | BENEFICIAL | 사각형의 대각선 사이 각60°·BD10·넓이20√3에서 AC8. |
| 08 | REQUIRED | REQUIRED | BC8√3인 이등변삼각형의 높이4·양변8·내접원 반지름8√3−12. |
| 09 | REQUIRED | REQUIRED | 같은 길이 현 AB,CD 및 중심 거리5, 반지름13, 넓이60. |
| 10 | REQUIRED | REQUIRED | OM=ON인 두 현의 같은 길이 및 꼭짓각 C50°. |
| 11 | REQUIRED | BENEFICIAL | 삼각형의 내접원 접선 길이 BD11, CF6에서 BC17. |
| 12 | BLOCKED | BLOCKED | **직사각형 세 변 접촉 불가능**. 아래 두 줄의 독립 모순 증명 참조. 반지름을 임의로 고쳐 그릴 수 없다. |
| 13 | REQUIRED | REQUIRED | 지름 AB 원에 그은 3접선; AC2, BD8에서 CD10, 수평차6, 지름8. |
| 14 | REQUIRED | BENEFICIAL | 원주각 APB62°와 중심각 AOB124°의 관계. |
| 15 | REQUIRED | REQUIRED | 세 연속 호 AB,BC,CD 각110° 및 남은 AD30°; 외부 할선각40°, ACD15°. |
| 16 | EXEMPT | EXEMPT | 선택지 ①~⑤가 **서로 다른 다섯 사각형의 각·방향 조건**이다. ① 지름에 대한 90° 두 원주각, ④ 대각선 교점의 여각 90−25=65°로 판정하고 ③ 42°≠48°, ⑤ 40°≠50°를 비교하면 완결된다. 한 개의 공통 SVG는 다섯 상황을 대표하지 못하며 해설도 조건별 각의 논리 검증이다. |
| 17 | REQUIRED | REQUIRED | 두 교차현의 내부각65°, 원주각20°가 호 BD90°와 원둘레20cm를 결정. |
| 18 | REQUIRED | REQUIRED | 접선–현의 각30°·40°를 원주각으로 옮겨 내접사각형 보각70° 계산. |
| 19 | REQUIRED | REQUIRED | 내접하는 크고 작은 원의 반지름12/6, 공통 내부 접점 B, 접선 AP, 수선발 H에서 BP4√6. |
| 20 | REQUIRED | BENEFICIAL | 외부점 접선 PB와 할선 PAC에서 PB²=4·9, 끼인각30°, 넓이6. |
| 21 | REQUIRED | REQUIRED | A에서 BC로 내린 수선 AH를 기준으로 75°·45°·30°를 분할, AH5√3, AB5√6. |
| 22 | REQUIRED | REQUIRED | 통나무 원의 현 BC 중점 D, 깊이 AD18·반현 BD24에서 r25, 지름50. |
| 23 | REQUIRED | REQUIRED | 반원 AB180°와 호 CD44°의 외부 두 할선각 APB=(180−44)/2=68°. |

## BLOCKED 원문 오류 — 독립 증명과 처리 제한

1. **동산여중 15번 문제·해설**: AB가 지름이고 P는 AB 한쪽 반원에 있다. Q가 (통상 지시되는) **작은 호 PB**에 있으면 반원 A→P→Q→B 순서가 된다. ∠APQ가 보는, P를 포함하지 않는 호 AQ는 180°보다 크므로 **∠APQ>90°**, 원문 28°와 양립할 수 없다. 좌표 예: 원의 A=180°, P=120°, Q=60°, B=0°이면 ∠APQ=120°다. 반대로 Q를 **큰 호 PB**에 둬 28°를 구성할 수는 있으나 원문은 큰 호를 지정하지 않았다. 원문/그림 구속을 정정하기 전에는 62° 해설을 제작 승인할 수 없다. **두 축 모두 BLOCKED, plan 없음.**
2. **연향중 12번 문제·해설**: 통상 직사각형 ABCD에서 가로 AB=18cm, 세로 BC=12cm다. BC와 AD는 서로 마주보는 평행선이므로 두 변에 모두 접하는 원의 지름은 **18cm**, 반지름은 **9cm**이다. 그러나 원이 직사각형 내부에 있으려면 세로 길이 12cm에서 **지름≤12cm(반지름≤6cm)**여야 한다. 9>6으로 모순. 원문 해설의 ‘세로 12cm이므로 반지름6cm’는 서로 마주보는 BC/AD 접선 조건을 충족하지 못한다. **두 축 모두 BLOCKED, plan 없음.**

## 실행·독립 검증 및 한계

- 총계: **48문항·96축 = REQUIRED 53, BENEFICIAL 27, EXEMPT 12, BLOCKED 4**. 실행형 JSON **80개**(동산여중 40, 연향중 40). 위의 6개 EXEMPT 문항은 각 문제/해설 모두 각각 1축씩, 2개 BLOCKED 문항도 각 2축씩 합산했다.
- 공식 `plan-lint.cjs --shallow --quiet`: **80/80 PASS**, FAIL=0, SKIP=0.
- 공식 `plan-lint.cjs --quiet --jobs 3`(full): **80/80 PASS**, FAIL=0, SKIP=0.
- 독립 실제 그리기 필드 감사: **DRAWN_FEATURE_PARITY 80/80 PASS**, 현출 선분·원·호·각·표기·입체 필드 **721/721 정확 매핑**, 문제에 정답 factRole 선공개 없음, 40개 해설 도형은 대응 문제 도형과 별도로 도출 표식·치수를 갖는다. 재현: `node .tmp/check-drawn-parity.mjs` (임시 도구, PR에는 불포함).
- 독립 수학 검산: **48문항·116식 불일치 0건**. 여기에는 BLOCKED 2문항의 독립 반례와 불가능성 검산을 포함하며, 원문 오류를 정상 정답으로 인정했다는 의미가 아니다. 재현: `node .tmp/check-independent-math.mjs` (임시 도구, PR에는 불포함).
- 실제 렌더: **RENDER_NOT_RUN**. `node archive/tools/geometry-equation/production/render-plan.mjs --item .tmp/render-item.json --plan .../q01-problem.plan.json --out .tmp/render-probe` 직접 실행 시 `stage=measure`, `ARCHIVE_PREFLIGHT_FAIL`; Playwright `browserType.launch: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`. 정적 lint 성공은 실제 렌더 성공이 아니다.
- Windows 큐 파일 **접근·사용하지 않음**: 체크 상태 미확인, 완료 체크 변경 0. 원문 BLOCKED가 남아 두 시험지 모두 **전체 완료 선언 보류**.
- PR 병합 및 변경 파일별 **원격 main Git blob 해시 readback** 결과는 병합 완료 후 PR 증빙에 별도로 남긴다.
