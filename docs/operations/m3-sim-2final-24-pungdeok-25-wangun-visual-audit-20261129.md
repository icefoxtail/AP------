# 중3 유사시험지 2학기 기말 — 24 풍덕중 / 25 왕운중 공식 SVG production plan 감사

- 감사일: 2026-11-29 (KST). 대상은 이 문서에 적은 **정확히 두 시험지**이며, 이전 PR #3494의 24 연향중·24 왕운중 등 종전 대상은 포함하지 않는다.
- 출발 시 원격 `origin/main`: `2a84293c1e4f03e639859af033a452e7f2f76057`. 출판 전 원격 진행을 재확인해 고1 PR #3497 병합 `9a1b0ed8e61e05abbe56b0d95723903dcf0179e4`로 작업 브랜치를 fast-forward했고, 이후 고2 PR #3498 병합 `4f2356624daace63c91a84b7ccff2d599c3961b9` 위로 독립 커밋을 rebase했다. 각 회차 대상 경로 변경 0건. 별도 worktree/브랜치에서만 작성, main 체크아웃 무변경.
- 저장소/하위 `AGENTS.md`, `docs/agents/visual-svg.md`, `docs/agents/typebank-figure-plan-execution.md`, `docs/agents/git-evidence.md`, 공식 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` 및 관련 공통 운영 규칙 숙지.
- 작업 개시 시 열린 PR **87개 전체**에 대해 PR별 변경 파일 경로 **3,573개**를 조회. 두 대상의 JS, 원본 SVG, legacy `_plans`, 공식 production `plans`, 감사 문서 경로 직접 충돌 **0건**. 당시 main에 두 대상의 공식 production plan **0개**.
- 범위: `archive/exams/similar/middle/m3/2final/24_풍덕중_2학기_기말_중3_유사.js` (23문항), `.../25_왕운중_2학기_기말_중3_유사.js` (24문항). 원본 JS·SVG·legacy 계획은 **수정하지 않음**.

## 판정 정의와 전수 총계

문제(P)와 해설(S)은 별도 축이다. `REQUIRED`: 그 축의 원문 도형/산점도를 제공하는 것이 핵심. `BENEFICIAL`: 풀이의 논리·작도를 시각적으로 보완하되 원문만으로도 논증 가능. `EXEMPT`: 해당 축에 독립 도형을 추가할 수학·교육적 필요가 없고, 누락이 아님. `BLOCKED`: 오류·상호 모순·필수 자료 누락·정답 노출로 정합적 제작이 불가능한 축. 이 판정은 엔진 렌더 성공의 선언이 **아니다**.

| 시험지 | 문항 | 문제축 REQUIRED | 해설축 BENEFICIAL | EXEMPT | BLOCKED | 실행형 JSON |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 24 풍덕중 | 23 | 21 | 22 | 3 | 0 | 43 |
| 25 왕운중 | 24 | 17 | 16 | 15 | 0 | 33 |
| **합계** | **47** | **38** | **38** | **18** | **0** | **76** |

실행형 산출물은 오직 `archive/tools/geometry-equation/production/plans/<stem>/qNN-problem.plan.json` 및 `qNN-solution.plan.json`이다. EXEMPT에 실행형·상태 파일을 만들지 않았다. 손 SVG·자체 SVG 생성기·렌더 우회는 사용하지 않았다. 아래 표의 P/S 표시는 해당 질문 번호의 **각 축에 실제 존재하는** 공식 JSON 파일과 1:1 결속한다.

### 24 풍덕중 — 23문항·46축

| 문항 | P 판정 | S 판정 | 독립 수학 검산·원문 조건 및 도형 결속 요지 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 내접원의 변은 접선, 외접원의 두 꼭짓점을 잇는 변은 현. 용어 정의만으로 선택지 판별. |
| 02 | REQUIRED | BENEFICIAL | `AB=24`, `OM⊥AB`이므로 `AM=BM=12`. 문제의 길이 24를 선분에, 해설의 12는 별도 도형에만 결속. 원본 그림 파일 부재; 공식 엔진 점·현 신규 작도. |
| 03 | REQUIRED | BENEFICIAL | 반현 8, 현-호 높이 4이면 `r²=8²+(r−4)²`, `r=10`. 원본 호/현/중점 대응. |
| 04 | REQUIRED | BENEFICIAL | `OM=ON`인 한 원의 현은 `AB=CD` (`OA²=OM²+AM²=ON²+CN²`); 해설에는 두 현의 동일 길이 표시. |
| 05 | REQUIRED | BENEFICIAL | 동일 반지름, 현 길이 18이면 중심거리 `√(r²−9²)`가 같으므로 `ON=OM=8`. |
| 06 | REQUIRED | BENEFICIAL | `d(O,AB)=d(O,AC)` ⇒ `AB=AC` ⇒ 밑각 70°씩 ⇒ 꼭지각 40°. |
| 07 | REQUIRED | BENEFICIAL | 외부 한 점의 접선 `PA=PB`: `2x−1=15`, `x=8`. |
| 08 | REQUIRED | BENEFICIAL | 접점 직각으로 `OP=√(5000²+12000²)=13000`, 지표 높이 8000 km. |
| 09 | REQUIRED | BENEFICIAL | 삼각형 `AB=7, BC=10, CA=9`에서 `CE=CF=(10+9−7)/2=6`; 접선 치환으로 `CP+PR+RC=2×6=12`. |
| 10 | REQUIRED | BENEFICIAL | 반지름 8의 두 직각 벽 접선: 한 변 8인 정사각형−¼원 `64−16π cm²`. 원본은 이름 있는 점 없는 영역도형. |
| 11 | REQUIRED | BENEFICIAL | 외접사각형 `AB+CD=AD+BC=22`, `AB−CD=2`; `CD=10`, `AB=12`. |
| 12 | REQUIRED | BENEFICIAL | 접선 `AB=15`, 중심선 `AD=5`: `(r+5)²=r²+15²`, `r=20`, `AO=25`. |
| 13 | REQUIRED | BENEFICIAL | 같은 호 중심각 `2×48°=96°`. |
| 14 | REQUIRED | BENEFICIAL | P·Q가 현 AB 같은 쪽의 원 위에 있어 같은 호에 대한 원주각 `∠APB=∠AQB=45°`. |
| 15 | REQUIRED | BENEFICIAL | 앞 문항 원주각 45°, 중심각 90°, 지름 24 ⇒ 호 길이 `2π×12×90/360=6π m`. |
| 16 | REQUIRED | BENEFICIAL | 교차 현: 호 BC=`2×50=100°`; `2×110=호 AD+호 BC`, 호 AD=120°; `∠ACD=60°`. 원본 SVG 부재; 실제 교차점 P를 가지는 원 내부 현 신규 작도. |
| 17 | REQUIRED | BENEFICIAL | 접선 교각 50° ⇒ 작은 호 AB 130°, 큰 호 AB 230° ⇒ 그 호에 대한 원주각 115°. |
| 18 | REQUIRED | BENEFICIAL | 지름 BC ⇒ `∠BAC=90°`; `∠ACB=90−35=55°`=접현각. |
| 19 | REQUIRED | BENEFICIAL | 접현각 65°, `∠ABC=25°`, `∠BAD=115°` ⇒ `∠ADB=40°`. |
| 20 | REQUIRED | BENEFICIAL | 원호의 서로 다른 세 점 A,B,C의 AB·BC 수직이등분선 교점이 유일한 원심. 해설 축에 중점/수선 보조 작도를 실제 점·선분으로 추가. |
| 21 | EXEMPT | BENEFICIAL | 24등분점에 5칸 간격으로 총 24현을 긋는 **작도 자체가 질문**; 문제축 그림을 선제 제공하면 활동을 대신하게 되어 생략. 해설은 `{24/5}` 별 다각형의 24현 실제 연결. 각 현의 중심각 `5×360/24=75°`, 길이 `2R sin37.5°`, 중심거리 `R cos37.5°`가 일정해 안쪽에 동심원에 접하는 24방향 경계가 생김. |
| 22 | REQUIRED | BENEFICIAL | 원주각 BGD30° ⇒ 호 BD60°, 호 BD=3·호 AC ⇒ 호 AC20°. 지름의 반원에서 호 CD=`180−60−20=100°`, 원주각 CFD50°. |
| 23 | REQUIRED | BENEFICIAL | 원 내접사각형의 대각합 180°: `∠B=110°` ⇒ `∠D=70°`. |

### 25 왕운중 — 24문항·48축

| 문항 | P 판정 | S 판정 | 독립 수학 검산·원문 조건 및 도형 결속 요지 |
| --- | --- | --- | --- |
| 01 | REQUIRED | BENEFICIAL | 반지름 13, 현 24: 중심에서 현까지 거리 `√(13²−12²)=5`. |
| 02 | REQUIRED | BENEFICIAL | P의 두 접선 길이 동일, C/D에서의 외부 접선 길이 분할: 기존 원본 세 접선 기하 및 `CD=5`·`PD=8` 조건에서 `CA=4`. |
| 03 | REQUIRED | BENEFICIAL | 원 외접사각형의 대변합 `AB+CD=BC+DA`로 `CD=9`, 문항의 미지량 `x=7`. |
| 04 | REQUIRED | BENEFICIAL | 두 접선 교각 60° ⇒ 작은 호 120°, 같은 호를 보는 원주각 60°. |
| 05 | REQUIRED | BENEFICIAL | 지름 AB와 `∠AOC=70°`: `∠BOC=110°`, 이등변 OBC의 밑각 35°. |
| 06 | REQUIRED | BENEFICIAL | 원본 SVG·legacy 실행 가능 계획 부재: 정확한 좌표 `A=(4,0), B=(0,0), C=(-44/13,16√3/13), D=(-5,3√3), O=(2,4√3)`로 신규 작도. 모두 `|X−O|=2√13`, `AB=BC=4, CD=2√3, DA=6√3`, `∠A=30°`; 삼각형 ABD=`6√3`, BCD=`2√3`, 합 `8√3`. 대각선 BD는 해설 축에만 추가. |
| 07 | REQUIRED | BENEFICIAL | 반지름 이등변삼각형에서 중심각 `∠AOC=140°`, `∠BOC=110°`; 관련 도형 중심각 `∠AOB=110°` (원본 배치 기준). |
| 08 | REQUIRED | BENEFICIAL | 호 ABCD=`2×110=220°`, 남은 호 DEA140°; `∠ABC−∠CAD`는 호 DEA의 절반 `70°`. |
| 09 | REQUIRED | BENEFICIAL | 호 DC64°, 호 BC52°, 반원 AD116°, AB128° ⇒ `x=64°`, 교차현각 `y=84°`, 합148°. |
| 10 | REQUIRED | BENEFICIAL | 교차현 예각45°와 이웃한 둔각135°에 대한 호 AD·BC 합270° ⇒ 두 호의 길이 합 `3πr/2`. |
| 11 | REQUIRED | BENEFICIAL | 접현각28° ⇒ 호 BC56°, 호 AB112°, 호 AC(점 B 경유)168° ⇒ `∠ABC=(360−168)/2=96°`. |
| 12 | REQUIRED | BENEFICIAL | 지름 CD로 B 직각, `AT⊥BT`, `BC⊥BT` ⇒ AT∥BC. `∠BCA=64°`, `∠ACD=26°`, 따라서 `∠BCD=38°`. |
| 13 | EXEMPT | EXEMPT | 통계 용어 참·거짓: ㄷ(중앙값의 강건성), ㅁ(`Σ(xᵢ−x̄)=0`)만 참. 범주 판단에 도표 불필요. |
| 14 | EXEMPT | EXEMPT | 다섯 보기의 대푯값·산포도 각각 `6,4,3,82/5=16.4,√2`; 최대 ④. 숫자 비교 문제로 좌표도형 무의미. |
| 15 | EXEMPT | EXEMPT | 크기순 여섯 변량 중앙값 `13=(x+x+4)/2`, `x=11`, 넷째 `15`. 순서 이미 주어짐. |
| 16 | EXEMPT | EXEMPT | 모든 자료 ×3이면 평균 `10×3=30`, 분산 `6×3²=54`; 기호 연산만으로 충분. |
| 17 | EXEMPT | EXEMPT | 표의 가중평균 `(2+15+30+35+18)/20=5`; 제곱편차 가중합104, 분산 `104/20=5.2`. 표가 원문에 있으므로 별도 그래프 중복. |
| 18 | REQUIRED | EXEMPT | 문제 산점도는 오른쪽 위로 기우는 원본 17마커를 `chart.points[0..16]`과 전수 결속. 독립 공분산 `5.8131487889>0`. 해설의 핵심은 양의 상관관계를 선택지에 적용하는 **언어적 분류**로, 이미 주어진 산점도를 반복할 교육적 이득이 작음. |
| 19 | EXEMPT | EXEMPT | 선수 C=평균65+편차(−4)=61 kg, 빠진 D 편차4, 표준편차 `√[(9+4+16+16+1)/5]=√(46/5)`. 원본의 표 수치가 완결되어 도형 불필요. |
| 20 | REQUIRED | BENEFICIAL | 지름 AB10 ⇒ 반지름5; AH9, OT∥AH의 사각형 OKHT에서 `KH=5`, `AK=9−5=4`. 직각 OAK에서 `OK=√(5²−4²)=3=HT`, 삼각형 면적 `9×3/2=27/2 cm²`. 해설 축에 실제 HT 치수 표시. |
| 21 | REQUIRED | BENEFICIAL | 반원의 접선 PT12, 외부 선분 BP6: `(r+6)²=r²+144` ⇒ r9, 반원 면적 `81π/2`. |
| 22 | REQUIRED | BENEFICIAL | 내접 육각형의 여섯 호 중심각 합360°. `2(∠A+∠C+∠E)`에는 각 호 두 번씩 ⇒ 세 각 합360°. |
| 23 | REQUIRED | BENEFICIAL | `∠ACB=64°` ⇒ `α+β=116°`; D에서 접선·연장선 각 `β−α`를 이등분하므로 `∠AED=180−(α+β)/2=122°`. 원본 연장선 배치에 결속. |
| 24 | EXEMPT | EXEMPT | 숫자 다섯 개 `10,11,13,13,310`: 합357, 평균71.4, 중앙값13, 최빈값13. 극단값 310에 왜곡되지 않는 중앙값 선정; 문장/원자료로 충분. |

## EXEMPT 18개 축의 개별 근거

같은 문항이라도 축별로 **독립** 평가하였다. 이하 각 항목은 의도적으로 공식 실행형 계획을 작성하지 않은 축이다.

1. 풍덕 01-P: 접선/현의 정의를 글로 묻는 빈칸이며 그림이 암기 평가를 바꾸지 않는다.
2. 풍덕 01-S: 접점 하나와 원 위 양 끝점 두 개라는 정의가 완결되어 예시 그림을 더할 실익이 낮다.
3. 풍덕 21-P: 원주 24등분과 `i→i+5` 연결 지시가 이미 작도 규칙이며, 해답 패턴을 미리 보이면 과제가 무력해진다.
4. 왕운 13-P: 참·거짓 7개 중 통계 정의/성질을 평가하며 그래프 표본이 명제의 논리값을 바꾸지 않는다.
5. 왕운 13-S: `Σ(xᵢ−x̄)=0` 등 정의 반례·정리로 직접 판별하므로 그림은 별도 근거가 되지 않는다.
6. 왕운 14-P: 보기마다 명시된 정수 자료의 평균·중앙값·최빈값·분산·표준편차를 계산하는 직접 비교형이다.
7. 왕운 14-S: `16.4>6>4>3>√2`의 산술 비교가 정답의 충분한 증명이다.
8. 왕운 15-P: 이미 오름차순으로 주어진 여섯 수의 중간 두 수를 고르면 되고 추가 좌표 시각화가 불필요하다.
9. 왕운 15-S: `x+2=13`이라는 한 변수 선형식만 풀이하면 넷째 변량이 결정된다.
10. 왕운 16-P: 자료 일괄 ×3의 평균/분산 변환식 적용이며 개별 점이나 막대가 없다.
11. 왕운 16-S: 편차 제곱의 배율9는 대수 증명으로 충분하고 그림으로 추가할 결정적 관계가 없다.
12. 왕운 17-P: 5행의 원문 도수 표가 이미 완결된 주 자료라 별도 히스토그램은 문제 요구를 중복한다.
13. 왕운 17-S: 표 각 행의 `도수×편차²`를 합하는 `104/20` 계산이 답을 직접 지지한다.
14. 왕운 18-S: 문제축에 원본 17점 산점도가 있고 해설은 이를 양의 상관관계로 이름 붙여 사례를 분류한다.
15. 왕운 19-P: 원문 5인 편차 표에 필요한 모든 값이 있으므로 새로운 공간/산점도 관계가 존재하지 않는다.
16. 왕운 19-S: 누락된 편차를 총합0에서 구한 뒤 `√(46/5)`를 산출하는 표 기반 산술이다.
17. 왕운 24-P: 다섯 숫자 중 310의 이상치를 인지하고 대푯값을 계산하는 문제로 원자료가 완결되어 있다.
18. 왕운 24-S: 정렬 `10,11,13,13,310`과 평균/최빈값 계산을 문자로 바로 설명할 수 있다.

## 실제 그리기 필드·원문·원본 SVG 대응 증거

- 공식 JSON **76개** 각각 `capability`, 실제 소비되는 `mathPlan.nodes`/`displayPoints`/`displaySegments`/`displayLines`/`displayCircles`/`planeMarks`/`rightAngles` 또는 `chart.points`를 갖는다. `caption`·`sourceConditions`만 있는 설명용 상태 JSON은 없음.
- **DRAWN_FEATURE_PARITY**: 76개 전체에서 실제 작도 필드의 항목 **1,715개**를 계수하였고, 실제 필드를 가리키는 `sourceConditions[].mappedTo` **1,725/1,725** 경로를 독립 역참조하였다. `construction-spike-v1` **75개 전부**의 `sourceQuote`는 해당 문항 원문 substring에 **75/75** 일치. 산점도 1개는 차트 field에 직접 결속.
- 원본 학생용 SVG를 보유한 **35개 문제축**의 기하 점 ID **175/175**, 통계 산점도 마커 `pt-0..16` **17/17**, 원본 `data-role=line/segment` 식별 선분·직선 **151/151**, `data-label-kind=EQUATION_LABEL` 표기 ID **72/72**가 실제 그리기 항목과 일치. 특히 통계 점 17개는 단순 개수뿐 아니라 원본 스크린 좌표를 역변환한 `chart.points` 순서·좌표 **17/17** 일치. 식별 가능한 SOURCE_POINT 61개의 원본 좌표는 각각 원본 SVG의 아핀 변환과 오차 0.0005 미만으로 **61/61** 대응.
- 원본 점 목록에는 없지만 정적 계획에 있는 보조점: **풍덕 03 O, 10 C/O/A/B/X/Y, 20 M; 왕운 08 O, 10 O/P**. 모두 `hiddenPointNames` + `hiddenPointStyle:NONE`로 학생용 표시에서 숨겨져 있으며, 원본에 없던 문자 표식을 보이는 점으로 늘리지 않는다. 풍덕 02/16, 왕운 06의 새 그림 및 풍덕 21의 해설 별 도형은 비교할 원본 SVG가 없으므로 **신규 작도**로 분리하고 원본 대응 수에 끼워 넣지 않는다.
- 풍덕 09 원본 삼각형/내접원/세 접점 및 접선 PR과 문제 선분 수치 7·10·9, 풍덕 10의 벽과 원 영역, 왕운 18의 원본 통계 마커처럼 도형 의미·수치도 대조. 실제 출력물의 시각적 충돌·A4 크기·학생 화면 표시는 아직 확인되지 않았다.
- 독립 식/반례 감사: 위 **47행**의 수치·정리 검산; 특히 새 왕운 06은 네 변·각·동일 원·넓이를 정확 좌표로 모두 확인, 풍덕 21은 24현의 길이와 중심거리가 일치함을 24개 실제 연결에 대해 검산, 왕운 18은 공분산 양수로 확인. **원문 정답 모순·자료 부재로 인한 BLOCKED 0건**(이는 정적 감사 결과이며 미실행 렌더의 결함 가능성을 배제하지 않음).

## 공식 검증·렌더 경계

- 같은 두 생산 디렉터리의 `*.plan.json` **76개**를 `find ... -print0 | xargs -0 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow --json --jobs 5`로 검사: **76/76 PASS** (exit 0).
- 동일 파일 전체를 `--shallow` 없이 `node .../plan-lint.cjs --json --jobs 5`로 검사: **76/76 PASS** (exit 0). 실제 lint 대상에는 EXEMPT 레거시 상태 계획이 포함되지 않았다.
- **실제 렌더 직접 시도**: `node archive/tools/geometry-equation/production/render-plan.mjs --item .tmp/render-q02-item.json --plan archive/tools/geometry-equation/production/plans/24_풍덕중_2학기_기말_중3_유사/q02-problem.plan.json --out .tmp/render-q02-direct`
- 위 커맨드 **exit 1**, `status=FAILED`, `stage=measure`, `code=ARCHIVE_PREFLIGHT_FAIL`; Playwright `browserType.launch`: Chrome distribution `/opt/google/chrome/chrome` 없음. 별도로 `/usr/bin/chromium --version` 재현 시 `/usr/lib/chromium/chromium` 실행 파일 부재, **exit 127**. 따라서 **RENDER_NOT_RUN**(아카이브 측정 전 실패), 실제 결과 SVG·학생용 문제/해설 화면·A4·충돌/클리핑·관측기 PASS **NOT_RUN**. shallow/full lint 성공을 렌더 성공으로 전환 표기하지 않는다.
- Windows 큐: **접근하지 않음 / 현재 상태 미확인 / 체크 변경 없음**. 원본 2종은 변경하지 않았고 기출시험지·고1·고2·고3도 변경하지 않음.
- 큐의 전체 완료: 이 감사·계획은 PR에 반영할 준비가 된 정적 작업일 뿐, 실제 렌더 및 최종 시각 검수가 불가하므로 **전체 완료 선언 보류**. 병합 전 체크는 없음.

## Git 출판 및 원격 검증

PR 번호, 병합 SHA, 개별 변경 파일 Git blob SHA readback은 정상 main 병합 후 **실제 검증값으로만** 채운다. 로컬 lint 및 근거 수치를 원격 병합 완료로 혼동하지 않는다.

## 후속 후보 선정 (제작은 **하지 않음**)

- 최신 원격 main의 `m3/2final` JS 38건 중 공식 production plan이 아직 없는 21건을 대상으로 다시 열려 있는 PR의 실제 변경 파일 경로를 대조했다. 이번 두 건을 제외하면 **충돌 없는 미작성 2final 후보 0건**: 다른 미작성 후보들은 열린 PR의 원본/legacy 작업 경로와 충돌한다. `m3/2mid` 40건은 공식 plan 있는 39건 + 열린 PR 충돌 1건으로 **선정 가능한 미작성 대상 0건**.
- 다음 독립 사이클은 같은 중3 유사시험지의 **1학기 기말**로 넘긴다. `archive/exams/similar/middle/m3/1final/25_연향중_1학기_기말_중3_유사.js` 및 `archive/exams/similar/middle/m3/1final/25_왕운중_1학기_기말_중3_유사.js`: 모두 main에 원문 JS 있음, 해당 공식 production plan 디렉터리 없음, 검사 당시 87개 열린 PR의 변경 경로와 직접 일치 없음. 다음 사이클 시작 시 main/PR 전체 변경 파일 경로를 **재검증해야** 한다.
