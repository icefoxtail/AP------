# 비상 기하 이차곡선 익힘책 — 문제·해설 2축 감사

- 대상: `archive/exams/textbooks/비상교육_기하/비상_기하_이차곡선_익힘책_고2/비상_기하_이차곡선_익힘책_고2.js`, 26문항 × 2축 = **52축**. 원본 PNG `q03,q05,q10,q12,q17,q20,q23,q26` 직접 열람.
- 공식 엔진 실행형 JSON **22개**, `plan-lint.cjs --shallow` 22/22 OK, full 22/22 OK. 기존 학생용 JS/PNG 변경 없음.
- `STATIC_MAPPED`는 원문과 PNG에서 반드시 그려야 할 요소를 실제 plan 필드에 매핑한 **정적 정보 검수**다. 실제 생성 SVG·observer·학생 화면·A4의 PASS가 아니다. `ENGINE_CAPABILITY_PENDING`은 표시할 표식이 현행 엔진에서 누락되었으므로 완료 건으로 세지 않는다. 렌더 시험은 설치된 Chrome 부재로 `ARCHIVE_PREFLIGHT_FAIL`; 화면/인쇄 전부 `NOT_RUN`.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 (이 폴더 기준) | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 익힘책/q01 | 문제 | 초점 (-1/2,0) 표준형 직접 대입, 그림 불필요 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q01 | 해설 | 포물선 공식 적용만으로 완결 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q02 | 문제 | 두 초점 좌표 일치의 대수 문제, 그림 비필수 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q02 | 해설 | 두 축 방향이 다른 포물선의 공통 초점 보강 | conic PARABOLA×2 | `q02-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q03 | 문제 | 원본 PNG의 A,B,C·삼각형·F 및 좌표축 보존 | KEEP_ORIGINAL_PNG | 원본 `q03.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q03 | 해설 | 무게중심 F 조건을 만족하는 대표 A,B,C, 준선·AF,BF,CF 보조선 | conic PARABOLA | `q03-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q04 | 문제 | 초점 거리 10의 조건만으로 계산 가능 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q04 | 해설 | 초점 거리·준선 거리 10, x축 거리 8 및 두 직각, **준선 식 x=-2 라벨 누락** | conic PARABOLA+FOOT; DIRECTRIX_LABEL_ROOM | `q04-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 익힘책/q05 | 문제 | 원본 PNG의 포물선·F, A,B·l 보존 | KEEP_ORIGINAL_PNG | 원본 `q05.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q05 | 해설 | 초점현의 정확한 교점 A,B 및 AF=15,BF=15/4 보강 | conic PARABOLA | `q05-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q06 | 문제 | 타원과 포물선의 초점 일치 수식만으로 결정 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q06 | 해설 | 두 곡선을 겹쳐 공통 초점 F를 한 위치에 표시 | conic ELLIPSE+PARABOLA | `q06-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q07 | 문제 | 네 꼭짓점과 반축 관계는 좌표로 완결 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q07 | 해설 | c²=36−16을 대입하는 표준 계산만 필요 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q08 | 문제 | 타원 방정식의 평행이동 계수 비교 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q08 | 해설 | 완전제곱과 계수 비교로 완결, 보조도형 불필요 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q09 | 문제 | P(2,2)와 두 초점으로 만든 넓이 대상 삼각형·답 비노출 | ellipse-figure-v1 | `q09-problem.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q09 | 해설 | 초점 좌표 c²=15, P의 높이 2, 삼각형 영역 표시 | ellipse-figure-v1 | `q09-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q10 | 문제 | 원본 PNG의 타원·F,F′·P·OP=OF 등길이 눈금 보존 | KEEP_ORIGINAL_PNG | 원본 `q10.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q10 | 해설 | OP·OF를 추가하고 삼각형 연결, **P의 직각표식·등길이 눈금 누락** | ellipse-figure-v1; CONIC_ANGLE_AND_EQUAL_TICKS | `q10-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 익힘책/q11 | 문제 | 둘레 24 조건의 새로운 자취 방정식 자체가 물음, 해설 전 도식 불필요 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q11 | 해설 | 공통 초점을 가지는 원래 타원·새 자취, 대표 PFF′의 6+10+8=24 | conic ELLIPSE×2 | `q11-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q12 | 문제 | 원본 PNG의 A,D,B,C 영역 채움·초점·x=c 보존 | KEEP_ORIGINAL_PNG | 원본 `q12.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q12 | 해설 | AB⊥CD와 면적 대상 구현, **원본 x=c, a, -a 문자식 라벨 누락** | ellipse-figure-v1; SYMBOLIC_CONIC_COORDINATE_LABEL | `q12-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 익힘책/q13 | 문제 | 두 초점·주축 6·한 점의 대입, 그림 비필수 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q13 | 해설 | 쌍곡선 a²=9, c²=25에서 b² 계산으로 완결 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q14 | 문제 | ㄱ~ㄹ 진술의 계수·위치 판별 문제, 문제 그림은 정답 암시 우려 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q14 | 해설 | 완전제곱 중심 (1,-2), 초점·점근선 실제 표시 | conic HYPERBOLA | `q14-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q15 | 문제 | 초점·점근선 기울기로 주축 길이 계산 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q15 | 해설 | 세로 주축·초점 ±7, 점근선 ±1/√6 | conic HYPERBOLA | `q15-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q16 | 문제 | 둘레 50을 준 초점거리 계산 문제, 길이 그림은 해설에서 제시 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q16 | 해설 | PF=9, PF′=21, FF′=20의 길이 라벨을 정확히 표시 | conic HYPERBOLA | `q16-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q17 | 문제 | 원본 PNG의 왼쪽 Q·오른쪽 P 및 F,F′와 네 연결선 보존 | KEEP_ORIGINAL_PNG | 원본 `q17.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q17 | 해설 | 양쪽 가지별 거리 차의 부호 계산이 원본 PNG + 풀이로 완결; 새 그림 중복 제외 | REUSE_ORIGINAL_PNG_EXEMPT | — | N/A | EXEMPT_WITH_SOURCE_ASSET |
| 익힘책/q18 | 문제 | 소리 도착 시간차를 묻는 상황, 결과 P의 위치를 문제에 미리 표시하지 않음 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q18 | 해설 | AB=6, BP=8, AP=10과 쌍곡선 거리차 2, **B의 직각표식 누락** | conic HYPERBOLA; CONIC_RIGHT_ANGLE_ON_FOCUS | `q18-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 익힘책/q19 | 문제 | 평행한 접선의 절편을 구하는 것이 풀이 핵심, 답 노출 방지 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q19 | 해설 | 접선 y=x+3, 축과 삼각형 OAB의 넓이 영역 표시 | conic PARABOLA+TANGENT | `q19-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q20 | 문제 | 원본 PNG의 접점 P,Q·접선 두 개·C 위치 보존 | KEEP_ORIGINAL_PNG | 원본 `q20.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q20 | 해설 | TANGENT_FROM으로 P,Q 계산, 접촉현 2x+y=4 라벨 보강 | conic PARABOLA+TANGENT_FROM | `q20-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q21 | 문제 | 점 (a,a)와 접선 기울기만으로 설정 완결, 답을 그리지 않음 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q21 | 해설 | A(2,2), P(4/3,10/3), 접선 기울기 -2 | conic ELLIPSE+TANGENT | `q21-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q22 | 문제 | 조건 OA=AP의 대수적 접선 증명 문제, 정답 후보 그림 비공개 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q22 | 해설 | 타원 접점 P·외부점 A 및 OA,AP 연결, **등길이 눈금 미지원** | conic ELLIPSE; CONIC_EQUAL_LENGTH_MARK | `q22-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 익힘책/q23 | 문제 | 원본 PNG의 A·F·원점 O·직선 식과 타원 보존 | KEEP_ORIGINAL_PNG | 원본 `q23.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q23 | 해설 | A(0,-1), F(2,0), AF의 기울기 1/2·타원 | conic ELLIPSE | `q23-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q24 | 문제 | 주어진 외부점과 쌍곡선 식으로 접선 구하기 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q24 | 해설 | P(2√3,2)에서의 정확한 접선이 A(0,-4)를 통과 | conic HYPERBOLA+TANGENT | `q24-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q25 | 문제 | 미지 a,b 접점에서의 접선이 타원 넓이를 이등분한다는 수식 문제 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 익힘책/q25 | 해설 | 타원 중심 C(2,0)를 지나는 쌍곡선 P의 접선, 면 채움 없음 | conic HYPERBOLA+ELLIPSE+TANGENT | `q25-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 익힘책/q26 | 문제 | 원본 PNG의 P(-3,1)·접선 l·두 수선·직각·점선 보존 | KEEP_ORIGINAL_PNG | 원본 `q26.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 익힘책/q26 | 해설 | F,F′에서 FOOT A,B로 내린 직각 2개와 AB=4 정확히 표현 | conic HYPERBOLA+FOOT×2 | `q26-solution.plan.json` | PASS/PASS | STATIC_MAPPED |

## 직접 의존 엔진 작업

1. 기하 길이 눈금(같은 길이) 및 타원에서의 직각 표시: q10·q22.
2. 타원 초점·꼭짓점에 대한 문자식 좌표·축 라벨 및 라벨 충돌 fallback: q04·q12.
3. 초점 자체가 수선 발인 경우의 직각 표시: q18.

원본 PNG는 PNG 크롭 변경 없이 그대로 둔다. 면 채움은 넓이를 직접 묻는 q09(문제·해설), q12(해설), q19(해설)에만 적용했다. 승인·게시 가능한 실제 SVG를 아직 만들지 않았으므로 화면·인쇄 완성을 주장하지 않는다.
