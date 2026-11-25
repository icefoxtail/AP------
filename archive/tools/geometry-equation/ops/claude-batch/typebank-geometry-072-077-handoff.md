# 기하 유형은행 072–077 문제 그림 plan — 16문항 운영 인계

- 기준 `main`: `b2777f13b488aebc211c90ee20b19e73394d7f68` (2026-11-25, 작업 개시 시 GitHub에서 확인)
- 작업 브랜치: `work/typebank-geometry-072-077-20261125`
- 신규 제작용 JSON: `archive/tools/geometry-equation/production/plans/<정확한 source stem>/qNN-problem.plan.json`, **총 16개**.
- 072(4) + 073(4) + 074(2) + 076(2) + 077(4) = **5개 실제 그림 대상 유형, 16문항**. 075는 `[그림:]`이 없어 제외했다. 유형군 숫자를 배치 분모로 쓰지 않는다.
- 출처: 모든 대상의 해당 현행 JS `content`, `answer`, `solution`, `[그림:]`을 직접 읽었으며 원문 JS는 수정하지 않았다.
- 검사: `plan-lint.cjs --shallow` **16 OK / 0 FAIL / 0 SKIP**. `setup-spikes.mjs` 완료 후 full lint **16 OK / 0 FAIL / 0 SKIP**. 처음 072 q05는 `ELLIPSE_LABEL_NO_ROOM:point-B`였고 원문의 A(3,0), B(0,2) 좌표 라벨을 **보존**하며 중복된 무한 직선 AB만 빼고 원문 A–B 실선 선분은 남겨 수리했다. 재검사 full PASS.
- 수학: 별도 SymPy 계산으로 16문항 모두 방정식 대입·기울기/접선·넓이·비·절편 검산, 16/16 통과. **원문 해설과 같은 수치를 썼다는 뜻이 아니라 계산 경로를 별도로 다시 대조했다.**
- 렌더/PNG/학생화면/A4: 모두 **NOT_RUN**. GPT는 plan 작성·main 병합까지만, 실제 공식 엔진 렌더·화면 검수·JS 연결·게시/엔진 확장은 안티그래비티 후속.

## 정확한 원본 JS 및 Git blob SHA

| 유형 | 파일명 stem (`.js` 생략) | 원본 blob SHA | 그림 qid |
|---|---|---|---|
| 072 | `기하_072_타원의접선의방정식-기울기가주어진경우_고2_유형은행1` | `5c86d100827d407f296b94fd6a2cb96698e0445f` | 05·07·08·09 |
| 073 | `기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1` | `c06eaa9a16abc8354a81aeaa486fe65a4f5e4f7b` | 01·03·04·05 |
| 074 | `기하_074_타원밖의한점에서그은접선의방정식_고2_유형은행1` | `fc5f1bdf3166633d590503e68d3e2c8e29519dd0` | 04·05 |
| 076 | `기하_076_쌍곡선의접선의방정식-접점의좌표가주어진_고2_유형은행1` | `9d61f77585f1577b6f39778c3c64122ace123242` | 02·08 |
| 077 | `기하_077_쌍곡선의접선의방정식의활용1-접점의좌표_고2_유형은행1` | `5fb8101f2d0a10f3752579db70e15eae75d8d20a` | 01·02·03·04 |

## 16개 문항별 조건 → 실제 JSON 필드 → 독립 검산 → 시각 판정

| QID | 원문 핵심 그림 조건 | 실제 plan 계산 노드·가시 필드 | 독립 수학 대조(그림에는 답 숫자 미표기) | featureParity |
|---|---|---|---|---|
| **072 q05** | 타원 x²/9+y²/4=1, A(3,0),B(0,2), AB에 평행한 양의 절편 접선, OCD 직각삼각형 | `conic:ELLIPSE`, `A/B:ON_CONIC(coordinates)`, `AB`, `t(slope=-2/3,tangent)`, `C/D:LINE_LINE`, `O`, OCD 세 변 | AB 기울기 −2/3; 접선 절편 C=(3√2,0),D=(0,2√2), 삼각형 넓이 6. `point-B` 라벨 겹침은 불필요한 무한 직선 AB 제거로 해결 | **PASS** |
| **072 q07** | 2x²+y²=6과 y=x의 두 교점 접선, y=2x와 평행한 두 접선의 평행사변형 | 세로 타원, 교점 P/Q, `t1/t2:tangent`, `u1/u2(slope=2,tangent)`, `diag(y=x)`, `A/B/C/D:LINE_LINE`, `polygons.ABCD(NONE)` | 교점 (±√2,±√2), 네 접선 2x+y=±3√2 및 2x−y=±3√2, 대각선 길이 3√2·6√2, 넓이 18 | **PASS** |
| **072 q08** | 세로 장축 6√3, 단축 8, A(0,−3√3), 제3사분면 P, 접선 PQ, ∠QPA=60° | `ELLIPSE(a²=27,b²=16,major=Y)`, `A:ON_CONIC(coordinates)`, `P:POINT`, `Q:TANGENT_FROM`, PA/PQ, 접선 t | P=(−8,−3√3), Q=(−16/5,9√3/5): 타원에 놓임, PQ 기울기 √3, PA 수평, 각 60° | **ENGINE_CAPABILITY_PENDING** (60° 호·텍스트 표식) |
| **072 q09** | x²/3+y²=1의 네 꼭짓점 마름모에 내접하는 타원, x축 초점 F,F′ | `conics.outer/inner:ELLIPSE`, outer 네 `ON_CONIC`, `polygons.diamond(NONE)`, inner 두 `FOCUS` | 내접 타원 a²=6/5,b²=3/5; 모든 마름모 변의 접선 판별식=0, c²=a²−b²=b² | **PASS** |
| **073 q01** | x²/3+y²=1과 위쪽 직선 y=x+4 | 타원, `lines.l(slope=1,intercept=4,label=y=x+4)` | 평행한 두 지지접선 y=x±2, 외부 직선과의 최소·최대 거리 √2·3√2, 서로 교차 없음 | **PASS** |
| **073 q03** | A(1,9),B(5,5), x²/20+y²/16=1의 점 P와 삼각형 ABP | 두 고정 `POINT(coordinates)`, `P:ON_CONIC(x=2,POS)` 대표점, AB/BP/PA | AB=4√2, 직선 x+y=10, 타원 지지 값 6, 최소 높이 2√2·최소 넓이 8. 대표 P는 비최적 | **PASS** |
| **073 q04** | A(3,0)는 타원 안, B(5,2)는 밖, 세로 타원과 삼각형 ABP | 세로 타원, `A/B:POINT(coordinates)`, `P:ON_CONIC(x=-2,POS)` 대표점, 세 변 | A:9/11<1, B:25/11+4/25>1, 직선 x−y=3; 가장 먼 평행 접선 x−y=−6, 최대 넓이 9 | **PASS** |
| **073 q05** | x²+4y²=16의 양의 축 교점 A(4,0),B(0,2), OAPB 볼록사각형 | `O`, `A/B:ON_CONIC(coordinates)`, `P:ON_CONIC(x=2,POS)` 대표점, OA/AP/PB/BO, `polygon(fill=NONE)` | P=(2,√3)로 사각형이 볼록·비퇴화; 전체 최대 넓이는 4√2, 대표 P는 미최적 | **PASS** |
| **074 q04** | x²/2+y²/5=1, 수평선 y=3의 P(k,3), 두 접선 | 세로 타원, `given(y=3,label)`, `P:POINT`, `T1/T2:TANGENT_FROM`, 접선 t1/t2, PT1/PT2 | 양수 대표 k=√10, 두 접선의 기울기 곱 4/(k²−2)=1/2 | **ENGINE_CAPABILITY_PENDING** (P(k,3) 문자 좌표 라벨) |
| **074 q05** | (0,4) 외부점에서 접점 P,Q, 왼쪽 초점 F로 PFQ 삼각형 | `E:POINT(coordinates)`(원문 무명점을 보조 E로 명명), `P/Q:TANGENT_FROM`, `F:FOCUS(side=-1)`, EP/EQ·PF/FQ/QP, polygon NONE | 접점 P=(−3,1),Q=(3,1); F=(−2√2,0), 둘레 4√3+6; 답 숫자 비표시 | **PASS** |
| **076 q02** | x²−3y²=1, A(2,1), 접선 B(0,−1/3), 법선 C(0,4), 음영 삼각형 ABC | `HYPERBOLA`, 라벨 없는 `T:ON_CONIC`, `t:tangent(at=T)`, `A:FOOT(from=B,onto=n,rightAngle=true,coordinates)`, `n(slope=-3/2)`, `B/C:LINE_LINE(coordinates)`, triangle `fill=LIGHT` | 접선 기울기 2/3, 법선 −3/2, 곱 −1; B를 법선 n에 정사영하면 A=(2,1)이 되어 원문 직각 표식까지 구현; ABC 넓이 13/3 | **PASS** (기존 FOOT를 재조합해 90° 표시 복구) |
| **076 q08** | x²−6y²=12의 P(6,−2) 접선이 포물선 y²=ax의 초점 F를 통과 | `conics.h:HYPERBOLA`, `conics.p:PARABOLA`, `P:ON_CONIC(coordinates)`, `F:FOCUS(curve=p)`, `t:tangent(curve=h)`, PF | 쌍곡선 식 성립, 접선 x+2y=2, 포물선 초점 (2,0)에서 접선 식 2=2 | **PASS** |
| **077 q01** | x²/6−y²/2=1의 (3,1) 접선 l, 초점 F,F′에서 수선 발 P,Q | `T:ON_CONIC(coordinates)` 보조명, `F/F':FOCUS(coordinates)`, `l:tangent`, `P/Q:FOOT(rightAngle=true)`, FP/F′Q | 접선 x−y=2; 초점 ±2√2; 두 거리 2∓√2, 곱 2 | **PASS** |
| **077 q02** | x²/8−y²/4=1의 (4,2) 접선 l과 초점 F,F′에서 내린 수선, PQ가 이루는 사다리꼴 | `T:ON_CONIC(coordinates)`, 두 FOCUS, `P/Q:FOOT(rightAngle=true)`, FP/F′Q/PQ/F′F 실선 | 접선 x−y=2, 초점 ±2√3, 두 높이 √6∓√2, PQ=2√6, 합 4√6 | **PASS** |
| **077 q03** | 초점 (±5,0), P(4,k) 접선의 x절편이 F′F를 3:1로 내분 | `HYPERBOLA(a²=10,b²=15)`, `F/F':FOCUS(coordinates)`, `P:ON_CONIC`, `T:LINE_LINE`, 두 내분선분 라벨 3·1, PT | T=(5/2,0)이고 F′T:TF=(15/2):(5/2)=3:1; 대표 P=(4,3)에서 타원식 16/10−9/15=1 | **ENGINE_CAPABILITY_PENDING** (P(4,k) 문자 좌표 라벨) |
| **077 q04** | P(5,k), x/y절편 Q,R, 수선의 발 S(5,0), 두 삼각형 넓이 비 16:5 | `HYPERBOLA(a²=20,b²=16)`, `P:ON_CONIC`, `Q/R:LINE_LINE`, `S:FOOT(rightAngle=true,coordinates)`, O, 두 삼각형 `LIGHT/MEDIUM` | 대표 P=(5,2), Q=(4,0),R=(0,−8),S=(5,0). 넓이 QOR=16, PRS=5라 비 16:5, 쌍곡선 식 성립 | **ENGINE_CAPABILITY_PENDING** (P(5,k) 문자 좌표 라벨) |

### 공통 판정

- `sourceVsPlan: REVIEWED` **16/16**. `planLintShallow: PASS` **16/16**, `planLintFull: PASS` **16/16**.
- `featureParity: PASS` **12/16**; `ENGINE_CAPABILITY_PENDING` **4/16**: **072 q08**(60°), **074 q04**(P(k,3)), **077 q03**(P(4,k)), **077 q04**(P(5,k)). **076 q02는 2026-11-25 재검토에서 실제 `FOOT.rightAngle`로 수정하고 shallow/full PASS를 재검증함**. 나머지 네 문항의 문자·각도 표식은 캡션만으로 완료 취급하지 않음.
- 077 q03의 3과 1은 절대거리 3·1이 아닌 **비례 표식**이다. 실제 길이 15/2·5/2를 가진 두 선분에 그 비율로만 표시한다.
- 072 q08은 구하는 PA 길이의 계산 좌표를 내부에 썼지만 학생용 좌표 라벨/길이는 넣지 않았다. 073은 움직이는 P의 **비최적 대표점**으로 정답 노출을 피했다. 074 q04, 076 q08, 077 q03·q04의 미지 계수도 내부 실제 도형 구성에만 쓰고 답 수치 라벨을 넣지 않음. **answerLeak: PASS 16/16**.
- 모든 SVG, PNG, 실제 폰트 배치 실물, 학생용 화면, A4 인쇄, JS `image`/`solutionImage` 연결은 **NOT_RUN**. `featureParity: PASS`는 JSON *필드 대조 결과*이지 렌더링 시각 품질 PASS가 아님.
- 다음 작업: **기하 078번부터** 그림 자리표시/qid를 다시 실측하여 다음 15~20문항 배치를 예약. 기하 완료 후 미적분II, 이후 비어 있는 시험지·유사·교과서·문제집 순서.
