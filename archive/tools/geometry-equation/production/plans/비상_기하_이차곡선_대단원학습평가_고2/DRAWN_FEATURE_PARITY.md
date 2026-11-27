# 비상 기하 이차곡선 대단원학습평가 — 문제·해설 2축 감사

- 대상: `archive/exams/textbooks/비상교육_기하/비상_기하_이차곡선_대단원학습평가_고2/비상_기하_이차곡선_대단원학습평가_고2.js`, 13문항 × 2축 = **26축**. 원본 PNG `q05,q07,q10,q11,q12,q13` 직접 열람.
- 모든 `qNN-*.plan.json`은 공식 `ellipse-figure-v1`(conic 포함) 또는 `construction-spike-v1` 실행형 JSON. **15개 plan, shallow 15/15 OK, full 15/15 OK**. 기존 JS와 PNG를 변경하지 않음.
- `DRAWN_FEATURE_PARITY=STATIC_MAPPED`는 실제 `points`·`lines`·`segments`·`FOOT.rightAngle`·`planeMarks`·`polygons`에 원문의 핵심 정보를 매핑한 **plan 필드의 정적 대조**다. 렌더된 SVG의 육안·observer PASS를 의미하지 않는다. `ENGINE_CAPABILITY_PENDING`은 실제 필드에 빠진 표식·라벨이 있으므로 완성 아님. 모든 축의 **실물 SVG/PNG·학생 화면·A4 = NOT_RUN** (`ARCHIVE_PREFLIGHT_FAIL`: Chrome 실행 파일 없음).

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 (이 폴더 기준) | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 대단원/q01 | 문제 | 두 초점의 축 방향 이해를 돕는 그림 추가, 정답 비노출 | conic PARABOLA×2 | `q01-problem.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q01 | 해설 | 두 초점 좌표·연결선 구현, √5 선분 라벨 자리 부족 | conic PARABOLA×2; CONIC_SEGMENT_LABEL_LEADER | `q01-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 대단원/q02 | 문제 | 최적점·답을 숨긴 대표 P와 PA,PB | conic PARABOLA | `q02-problem.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q02 | 해설 | 초점 B, 준선 x=-3, 수선의 발 H, 직각·7 라벨 | conic PARABOLA+FOOT | `q02-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q03 | 문제 | 수식만으로 두 포물선 지정, 그림은 답 유도에 중복 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 대단원/q03 | 해설 | 준선 l와 다른 포물선의 F 사이 길이 6·직각 | conic PARABOLA×2+FOOT | `q03-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q04 | 문제 | 두 초점·한 꼭짓점이 모두 좌표로 지정됨 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 대단원/q04 | 해설 | 초점 거리 5와 단반지름 4, a²=41 | ellipse-figure-v1 | `q04-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q05 | 문제 | 원본 PNG에 A,B,P, 축, AB=5의 대표 배치 있음. PNG 유지 | KEEP_ORIGINAL_PNG | 원본 `q05.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q05 | 해설 | 원본의 AP:PB 비표시 보강: 실제 내분점·3t/2t, AB=5 | construction+DIVISION_POINT+dimensions | `q05-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q06 | 문제 | 관측소 좌표·거리·시간차만으로 구성 완결 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 대단원/q06 | 해설 | ±8 두 초점, 차이 4인 쌍곡선, 초점 거리 16 | conic HYPERBOLA | `q06-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q07 | 문제 | 원본 PNG의 원·쌍곡선·F,F′,P 보존 | KEEP_ORIGINAL_PNG | 원본 `q07.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q07 | 해설 | 원과 쌍곡선의 실제 교점·삼각형 구현, **P의 직각표식·원본 곡선식 지시선 누락** | conic HYPERBOLA+CIRCLE; CONIC_RIGHT_ANGLE_AT_INTERSECTION+CURVE_LABEL_LAYOUT | `q07-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 대단원/q08 | 문제 | 완전제곱 부호 판정 자체를 묻는 텍스트 문항 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 대단원/q08 | 해설 | a<-1의 대표 가로 주축 쌍곡선·점근선 | conic HYPERBOLA | `q08-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q09 | 문제 | 주어진 직선·쌍곡선 접선 판별식 계산 문항 | TEXT_ONLY_EXEMPT | — | N/A | EXEMPT |
| 대단원/q09 | 해설 | 접점·초점은 정확하나 **직선 y=3x+5와 FF′=2√5 라벨 충돌** | conic HYPERBOLA+TANGENT; CONIC_LABEL_ROOM | `q09-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 대단원/q10 | 문제 | 원본 PNG의 타원·포물선·P,Q,A·x=-2·직각 보존 | KEEP_ORIGINAL_PNG | 원본 `q10.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q10 | 해설 | 실제 공통점 P, x=-2와 FOOT 직각 구현, **두 곡선 수식 지시선의 배치 누락** | conic ELLIPSE+PARABOLA+FOOT; CURVE_LABEL_LAYOUT | `q10-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 대단원/q11 | 문제 | 원본 PNG의 오른쪽 가지 A,B와 C,D·초점현 보존 | KEEP_ORIGINAL_PNG | 원본 `q11.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q11 | 해설 | AB=6을 만족하는 m=5√2/2의 정확한 대표 배치, **왼쪽 가지만 점선 불가** | conic HYPERBOLA; BRANCH_DASH_STYLE | `q11-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |
| 대단원/q12 | 문제 | 원본 PNG의 접선·B,C,D·사각형 보존 | KEEP_ORIGINAL_PNG | 원본 `q12.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q12 | 해설 | 접선 두 개를 TANGENT_FROM으로 생성, A,C,D,B 면적 영역·두 대각선 | conic PARABOLA+TANGENT_FROM | `q12-solution.plan.json` | PASS/PASS | STATIC_MAPPED |
| 대단원/q13 | 문제 | 원본 PNG의 타원·쌍곡선 P·접선 둘 보존 | KEEP_ORIGINAL_PNG | 원본 `q13.png` | N/A | ORIGINAL_ASSET_REVIEWED |
| 대단원/q13 | 해설 | 두 접선의 기울기 실제 직교·공통점 P 구현, **교각 직각표식·곡선식 지시선 누락** | conic ELLIPSE+HYPERBOLA; CONIC_TANGENT_ANGLE_MARK+CURVE_LABEL_LAYOUT | `q13-solution.plan.json` | PASS/PASS | ENGINE_CAPABILITY_PENDING |

## 직접 의존 엔진 작업

1. conic 교점의 직각표식 및 두 접선이 이루는 각의 `rightAngle`/`planeMarks` 지원: q07·q13.
2. conic 곡선·접선·선분 라벨의 충돌 없는 지시선 fallback: q01·q07·q09·q10·q13.
3. 쌍곡선 개별 가지의 `dashed`/강조 스타일: q11. 원본 PNG는 엔진 보강 전까지 보존.

plan에는 흰색 배경이나 기본 면 채움을 따로 선언하지 않았으며, 명시적 `fill`은 면적을 묻는 q07·q12에만 사용하였다. 원본 PNG의 배경은 보존한다. `plan-lint PASS`를 SVG 렌더 PASS·게시 PASS로 치환하지 않는다.
