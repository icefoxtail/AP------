# 기하 유형은행 069·070·071 — 문제 그림 plan 운영 인계

- 기준 `main`: `5be0ec577795b1cc7165b1e7c3c38ef2c4f20871` (2026-11-25 작업 시작 시 확인)
- 브랜치: `work/typebank-geometry-069-071-20261125`
- 범위: `archive/exams/types/high/h2/` 기하 069·070·071, 실제 `[그림:]` 4문항. **068에는 그림 자리표시가 없어 3개 그림 대상 유형의 분모에서 제외.**
- GPT 산출: 문항별 `qNN-problem.plan.json` 4개. SVG·PNG와 JS `image` 연결은 **이번 산출물에 포함하지 않음**.
- 수학·원문: `sourceVsPlan=REVIEWED` 네 문항. 원문 `answer`·`solution`을 읽고 기호·조건·독립 검산 및 정답 노출을 대조함. 아래 수치는 **검산용 기록**이고 학생에게 실제로 그릴 숫자 라벨이 아님.

## 원본 JS 근거

| 유형 | 원본 파일 | 원본 Git blob SHA | 그림 qid |
|---|---|---|---|
| 069 | `기하_069_타원의접선의방정식-접점의좌표가주어진경_고2_유형은행1.js` | `3b70fc50c271c209be2ae07bc7a2551bda81471a` | 05 |
| 070 | `기하_070_타원의접선의방정식의활용-포물선과타원의_고2_유형은행1.js` | `607458c6f7144fe057524e92845fff171def17ef` | 01 |
| 071 | `기하_071_타원의접선의방정식의활용-산술평균과기하_고2_유형은행1.js` | `058a14408d99c80a95b820fc75286ca8deeccfba` | 01·02 |

## 문항별 원문 → 렌더 가능한 필드 → 독립 검산 → 판정

### 069 q05 — 접선·법선·x절편 Q,R

- 원문: `x²/16+y²/9=1`; P는 제1사분면의 이동점, P의 접선 `l`과 법선이 x축에서 각각 Q와 R을 만남. OQ×OR을 묻는다.
- plan: `conic` 수평 장축 타원; `P:ON_CONIC(x=12/5,POS)`는 지정 좌표가 아닌 대표 위치; `l:tangent(at=P)`; `n:slope=16/9,intercept=-28/15`; 숨긴 축 `axis:y=0`; `Q/R:LINE_LINE`; `O:ORIGIN`; `PQ,PR,OQ,OR` 실선 연결. 직각을 그리는 전용 표식 필드는 없음.
- 독립 검산: `P=(12/5,12/5)`, 타원 식에 대입 `9/25+16/25=1`; 접선 기울기 `-9/16`, 법선 기울기 `16/9`, 곱 `-1`; `Q=(20/3,0)`, `R=(21/20,0)`, 둘 다 오른쪽 x축. 원문의 결론은 별도 검산했으나 화면 숫자로는 비표시.
- 정답 유출: `PASS` (최종 곱·정답 선택지·절편 수치 라벨 표시 안 함). `sourceVsPlan=REVIEWED`; `featureParity=ENGINE_CAPABILITY_PENDING` (법선/접선의 수직 직각 표식 미지원: 겉보기 교차 관계만 수학적으로 일치).

### 070 q01 — 포물선·타원 교점에서 서로 수직인 두 접선

- 원문: 미지의 양수 `k`를 갖는 타원 `x²/k+y²/6=1`, 포물선 `y²=8x`, 제1사분면 공통점 `P(x₁,y₁)` 및 두 접선이 수직. `k`를 묻는다.
- plan: 두 곡선 `conics.e:ELLIPSE(major=Y,a²=6,b²=3)`·`conics.p:PARABOLA(p=2,axis=X)`; `P:CONIC_CONIC(which=2)`; `te/tp:tangent(at=P,curve=e/p)`; 파라미터나 점 좌표 수치 라벨 미지정.
- 독립 검산: 교점의 `x=-2+√7`, `y=√(8(√7-2))>0`; 타원·포물선 양쪽 식에 대입하면 각각 `1`, `0`; 두 접선의 기울기 `-2x/y`, `4/y`, 곱 `-8x/y²=-1`. 내부 렌더 대표 매개변수는 원문의 조건을 만족하지만 값 자체는 라벨로 노출하지 않음.
- 정답 유출: `PASS` (구하는 `k`, 선택지 번호, 풀이 좌표 글자 없음). `sourceVsPlan=REVIEWED`; `featureParity=ENGINE_CAPABILITY_PENDING` (**서로 수직인 접선 사이 90° 표식과 P의 문자 `(x₁,y₁)` 라벨 엔진 미지원**).

### 071 q01 — 가로 장축 타원·축절편·색칠된 OAB

- 원문: `x²+4y²=16`, 제1사분면의 `P(x₁,y₁)`에서 접선과 양의 x·y축이 만나는 A, B, 색칠된 직각삼각형 OAB의 최소 넓이를 묻는다.
- plan: `conic:ELLIPSE(major=X,a²=16,b²=4)`; 대표 `P:ON_CONIC(x=2,POS)`, `t:tangent(at=P)`; 숨긴 x/y축과의 `A/B:LINE_LINE`; `O:ORIGIN`; 실선 OA/OB/AB; `polygons.OAB(fill=LIGHT)`로 실제 음영 구현.
- 독립 검산: `P=(2,√3)`, `4/16+3/4=1`; `t: x/8+√3·y/4=1`; A=(8,0), B=(0,4/√3) 양의 축, 대표 삼각형 넓이 `16/√3`이며 실제 최소형을 선택한 것이 아니다.
- 정답 유출: `PASS` (최소 넓이·최적 접점 비표시). `sourceVsPlan=REVIEWED`; `featureParity=ENGINE_CAPABILITY_PENDING` (원문에 명시된 P의 기호 좌표 `(x₁,y₁)`을 점 라벨로 표시하는 기능 부재. 곡선·축절편·음영 필드는 실제 구현).

### 071 q02 — 세로 장축 타원·축절편·색칠된 OAB

- 원문: `x²/8+y²/18=1`, 제1사분면 P의 접선·양의 축절편 A/B·색칠된 OAB, 최소 넓이. 원문은 P의 문자 좌표 라벨을 그림에 요구하지 않는다.
- plan: `conic:ELLIPSE(major=Y,a²=18,b²=8)`; `P:ON_CONIC(x=√2,POS)`; `t:tangent(at=P)`; 숨긴 양축 직선과 `A/B:LINE_LINE`; `O:ORIGIN`; OA/OB/AB; `polygons.OAB(fill=LIGHT)`.
- 독립 검산: `P=(√2,3√6/2)`에서 `2/8+(27/2)/18=1`; 접선의 절편 `A=(4√2,0)`, `B=(0,2√6)`, 넓이 `8√3`, 최솟값 등호가 아닌 대표점.
- 정답 유출: `PASS` (최소 넓이·최적 접점 비표시). `sourceVsPlan=REVIEWED`; `featureParity=PASS` (원문 도식의 곡선·방향·점·축·양의 절편·접선·음영을 실제 렌더 필드로 모두 표현함. **이미지 자체의 관찰 PASS를 의미하지 않음**).

## 게이트 및 후속 작업

| QID | sourceVsPlan | featureParity | planLintShallow | planLintFull | SVG/PNG/학생화면/A4 |
|---|---|---|---|---|---|
| 069 q05 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS | PASS | NOT_RUN |
| 070 q01 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS | PASS | NOT_RUN |
| 071 q01 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS | PASS | NOT_RUN |
| 071 q02 | REVIEWED | PASS | PASS | PASS | NOT_RUN |

- `plan-lint.cjs --shallow <4 plans>` → `4 OK / 0 FAIL / 0 SKIP`.
- `plan-lint.cjs <4 plans>` → `4 OK / 0 FAIL / 0 SKIP` (setup-spikes 실행 후).
- **ENGINE_CAPABILITY_PENDING 3 qids:** 069 q05·070 q01의 직각 표시, 070 q01·071 q01의 문자 좌표 표기. 렌더를 진행하기 전 또는 진행 시 공식 conic 기능 확장 후 실제 SVG·PNG/학생화면/A4에서 재확인 필요.
- 실제 SVG/PNG는 생성하지 않았고 `image`·`solutionImage` 및 원본 JS 파일도 수정하지 않았음.
- 다음 유형군 후보: 072부터 다시 본문 `[그림:]` 유무를 확인하고 **그림 있는 JS 3종씩** 진행. 유형 번호만 보고 분모를 강제로 채우지 않는다.
