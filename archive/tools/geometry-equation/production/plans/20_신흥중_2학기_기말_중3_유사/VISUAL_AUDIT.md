# 2020 신흥중 중3 2학기 기말 유사 — 문제·해설 48축 감사

- 원문: `archive/exams/similar/middle/m3/2final/20_신흥중_2학기_기말_중3_유사.js` (24문항)
- 공식 plan 폴더: 이 문서가 있는 폴더. 표의 `qNN`은 `qNN-problem.plan.json`과 `qNN-solution.plan.json`을 뜻한다. 두 파일 중 어느 하나라도 없으면 별도 표시한다.
- 기초 inventory: 최신 main의 실행형 34개 유지. `q08` 문제·해설 2개 신규 작성. 기존 JS·SVG·레거시 plan은 변경하지 않는다.
- `REQUIRED`는 발문의 조건을 도형으로 읽는 데 필요하고, `BENEFICIAL`은 풀이의 결정적 구조를 그림으로 확인하는 데 유익하다는 뜻이다. `EXEMPT`는 그림이 계산·텍스트를 실제로 보완하지 않는다는 개별 판단이다.

| qid | 문제축 | 문제축 근거 | 해설축 | 해설축 근거 및 독립 수학 확인 | 공식 plan |
|---|---|---|---|---|---|
| 01 | REQUIRED | 직각삼각형 B·변 AB 8, BC 6·x의 상대 위치 필요 | BENEFICIAL | 빗변 10, sin C=8/10=4/5의 변 대응 확인 | q01 2개 유지 |
| 02 | REQUIRED | 수선 AH와 30°·45°가 서로 다른 직각삼각형에 속함 | BENEFICIAL | AH=6cos30°=3√3, AC=3√6 확인 | q02 2개 유지 |
| 03 | REQUIRED | AB 10·BC 12·끼인각 60°의 위치 보존 | BENEFICIAL | 넓이=10·12·sin60°/2=30√3 확인 | q03 2개 유지 |
| 04 | REQUIRED | 평행사변형과 BC의 중점 M 위치 필요 | BENEFICIAL | MC=6, 높이=6sin60°=3√3, 넓이=9√3 확인 | q04 2개 유지 |
| 05 | REQUIRED | BC의 연장선과 외부 수선 H가 발문 핵심 | BENEFICIAL | CH=BC=t, AH=t, BH=2t에서 tan∠BAC=1/3 확인 | q05 2개 유지 |
| 06 | REQUIRED | 지름 AB, 반원 위 C, 두 호 4:1의 순서 필요 | BENEFICIAL | 180°를 5등분한 BC 중심각 36° 확인 | q06 2개 유지 |
| 07 | BENEFICIAL | 두 중심각 35°·70°와 대응 현/호 비교를 시각화 | BENEFICIAL | 0~180°에서 중심각이 클수록 해당 현·호가 큼을 확인 | q07 2개 유지 |
| 08 | REQUIRED | 가로 15·세로 10의 직사각형, 세 변 접원과 오른쪽 작은 원의 배치 필수 | BENEFICIAL | BC·AD는 위아래 평행변(간격 10). R=5, (10-r)²+(5-r)²=(5+r)², r=20−10√3(0<r<5) 검산 | **q08 2개 신규** |
| 09 | REQUIRED | 원 밖 A의 두 접선과 T에서 그은 접선의 교점 B,C 구분 | BENEFICIAL | AP=√(13²−5²)=12, 접선 길이 합으로 △ABC 둘레 24 확인 | q09 2개 유지 |
| 10 | REQUIRED | 외접 사각형의 수직 대각선과 변 11, 9의 대응 필수 | BENEFICIAL | x−y=2, x²−y²=11²−9²=40 ⇒ x+y=20 확인 | q10 2개 유지 |
| 11 | REQUIRED | 직각사다리꼴·내접원 접점 F의 순서가 중요 | BENEFICIAL | r=BF=3, 높이6, (6+x)²=(6−x)²+36 ⇒ x=3/2 확인 | q11 2개 유지 |
| 12 | REQUIRED | 호 ACB·CB·AC와 중심각/원주각의 구별 필요 | BENEFICIAL | AC의 중심각 114−2·34=46°, x=23° 확인 | q12 2개 유지 |
| 13 | REQUIRED | 원 외부 두 할선과 3개 같은 호의 대응 필요 | BENEFICIAL | 같은 호 t=110°, 나머지 작은 AD=30°, 원주각 15° 확인 | q13 2개 유지 |
| 14 | REQUIRED | P의 두 접선과 접현각 CAD·CBE의 방향 중요 | BENEFICIAL | AB=180−50=130°, AC=160°, BC=70°, CBE=35° 확인 | q14 2개 유지 |
| 15 | REQUIRED | 원에 내접한 오각형의 두 원주각이 같은 CD 호를 함께 봄 | BENEFICIAL | B+E=(360+76)/2=218° 확인 | q15 2개 유지 |
| 16 | EXEMPT | 대푯값이라는 용어를 찾는 객관식; 도형·그래프 조건 없음 | EXEMPT | 평균·중앙값·최빈값의 정의를 구별하는 순수 개념 설명으로 충분 | 없음(의도적) |
| 17 | EXEMPT | 세 변량의 평균과 k≠0은 대수적 조건뿐 | EXEMPT | (x+y+z−3m)/(3k)=0으로 해결되어 수직선·그림 필요 없음 | 없음(의도적) |
| 18 | EXEMPT | 7개 수와 평균·최빈값이 모두 문자·수치로 주어짐 | EXEMPT | a+b=3, (a,b)=(0,3)으로 정렬 −3,−2,0,3,3,6,7; 중앙값 3의 정렬 계산이 텍스트로 완결 | 없음(의도적) |
| 19 | EXEMPT | 3수준 학생 수와 평균이 원문 표에 모두 제시됨 | EXEMPT | 가중평균 (10·92+15·80+10·68)/35=80, 표를 재그리면 중복 | 없음(의도적) |
| 20 | EXEMPT | 세 수의 평균·표준편차로 곱의 대칭합을 묻는 대수 문항 | EXEMPT | Σx=15, Σx²=87, Σxy=(225−87)/2=69, 세 곱의 평균 23으로 계산 완결 | 없음(의도적) |
| 21 | REQUIRED | 60°·45° 밑각과 수선의 발 H의 양쪽 배치 필요 | BENEFICIAL | 높이 h=12/(1/√3+1)=6(3−√3), 넓이 36(3−√3) 확인 | q21 2개 유지 |
| 22 | REQUIRED | 원에 내접한 사각형과 E·F의 연장선 교점 구조 필요 | BENEFICIAL | A+D=210°, C+D=230°, A+C=180° ⇒ (A,B,C,D)=(80,50,100,130)° 검산 | q22 2개 유지 |
| 23 | REQUIRED | 접점 A,B와 PA·PB 및 공통 PO의 위치 필요 | BENEFICIAL | OA=OB, PO 공통, ∠PAO=∠PBO=90° ⇒ 직각삼각형 합동으로 PA=PB 확인 | q23 2개 유지 |
| 24 | EXEMPT | 두 집단의 평균·분산 수치만 주어진 산포도 계산 | EXEMPT | 전체 평균9, 분산=((4+1)+(9+1))/2=15/2; 표준 계산에 새 도표 불필요 | 없음(의도적) |

## 기하·값 독립 검증

- q08 꼭짓점은 A(0,10), B(0,0), C(15,0), D(15,10)인 실제 가능한 직사각형이다. 큰 원 중심 O(5,5), 작은 원 중심 O′(15−r,r), r=20−10√3. 큰 원은 AB·BC·AD, 작은 원은 BC·CD에 접하고, 두 중심의 거리 제곱은 `(10-r)^2+(5-r)^2=(5+r)^2`이다. **원문 모순 아님.**
- 원문 JS의 선택지·정답은 위 계산들과 비교했다. 외부 렌더와 화면·인쇄 확인은 별개다.
- 새 plan의 `sourceQuote`는 각 문제/해설 원문과 바이트 문자열로 일치해야 한다. 신설·유지 계획의 `sourceConditions[].mappedTo`는 선언된 실제 그리기 필드에 매핑돼야 한다.

## 검증 및 종료 상태

- REQUIRED 17축, BENEFICIAL 19축, EXEMPT 12축, BLOCKED 0축. 실행형 plan 36개.
- 공식 `plan-lint.cjs` shallow/full: 다른 시험지와 합쳐 **각각 58/58 OK, FAIL 0, SKIP 0**. 이 시험지 자체는 36/36.
- `DRAWN_FEATURE_PARITY`는 렌더와 별도로 실제 배열·필드에서 검증함. 신흥중의 372개 `sourceConditions[].mappedTo`가 모두 실존, sourceQuote 36/36 JS 문자열 정확 일치. 문항별 표식과 수학 수치는 위 qid 표의 독립 계산으로 대조했다. 정적 판정 36/36 PASS.
- 공식 렌더 **RENDER_NOT_RUN**: q08 문제에 대해 `render-plan.mjs --item ... --plan ... --out ...` 실행 시 `stage=measure`, `ARCHIVE_PREFLIGHT_FAIL`, `browserType.launch: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`. 실제 Chrome SVG·PNG 생성 성공 0건. 학생 화면/A4 NOT_RUN.
- 원격 main 병합 SHA와 변경 파일별 blob SHA는 PR 병합 후 최종 보고에 별도 기록한다. 정적 lint가 실제 Chromium 렌더 성공을 뜻하지 않는다.
