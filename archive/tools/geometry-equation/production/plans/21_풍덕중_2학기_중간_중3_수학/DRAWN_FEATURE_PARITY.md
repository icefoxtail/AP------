# 2021 풍덕중 2학기 중간 중3 — 문제/해설 도식 1:1 검수

- 원천: `archive/exams/original/middle/m3/2mid/21_풍덕중_2학기_중간_중3_수학.js`의 q01~q24, 원본 `archive/assets/images/21_풍덕중_2학기_중간_중3_수학/` 스캔 및 기존 `*-solution.svg`.
- 범위: **24문항 × 문제/해설 2축 = 48축**. 표의 상대 plan 경로는 이 문서와 같은 폴더를 기준으로 한다.
- 검사: 아래 신규 plan 29개는 `plan-lint.cjs --shallow` 및 의존성 설치 후 `plan-lint.cjs` full 모두 OK. **sourceVsPlan=REVIEWED**는 발문·선지·해설·원본 PNG/SVG와 계획의 *실제 렌더 필드* 대조를 뜻한다.
- **DRAWN_FEATURE_PARITY=FIELD_PASS는 정적 필드 1:1 검수**이며 렌더한 SVG의 시각 합격이 아니다. 모든 신규 plan의 **render/PNG/학생화면/A4=NOT_RUN**; 공식 엔진의 렌더·게시 담당자가 후속 수행한다. 기존 SVG의 유지 판정은 이미지 열람 결과다.
- `EXEMPT`는 해당 축에 원천 도식이 없음을 뜻한다. 원본 수학 조건이 정하지 않은 대표 좌표는 화면 배치용이며 문제 그림에는 계산된 정답 숫자를 적지 않았다. 흰 바탕/면 채움 없음이 기본; q21·q23·q24의 질문상 음영만 예외다.

| 파일/qid | 축 | 기존 결함 / 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 풍덕/q01 | problem | 저화질 PNG; 각 A 호·직각 B·변 5,12 정리 | construction-spike-v1 | `q01-problem.plan.json` | OK/OK | FIELD_PASS: A,B,C·각 호·직각·두 길이 |
| 풍덕/q01 | solution | 별도 해설 그림 없음; 빗변 13의 대응 추가 | construction-spike-v1 | `q01-solution.plan.json` | OK/OK | FIELD_PASS: 5·12·13·직각 |
| 풍덕/q02 | problem | 그림 없는 삼각비 식 계산 | EXEMPT | — | N/A | EXEMPT |
| 풍덕/q02 | solution | 도식 불필요한 식 해설 | EXEMPT | — | N/A | EXEMPT |
| 풍덕/q03 | problem | 흐린 사분원; 단위 반지름·수선·직각·x 확인 | construction-spike-v1 | `q03-problem.plan.json` | OK/OK | FIELD_PASS: A/B/C/D/E·반지름 1·사분호·두 직각·x |
| 풍덕/q03 | solution | cos x의 대상 AB를 도식으로 명시 | construction-spike-v1 | `q03-solution.plan.json` | OK/OK | FIELD_PASS: AC=1·AB 굵게·CB 수선 |
| 풍덕/q04 | problem | 저화질 직각삼각형·x/y/4/30° | construction-spike-v1 | `q04-problem.plan.json` | OK/OK | FIELD_PASS: 30°·직각·미지 x/y·빗변 4 |
| 풍덕/q04 | solution | 특수각 두 변 계산 대응 | construction-spike-v1 | `q04-solution.plan.json` | OK/OK | FIELD_PASS: 2√3·2·4·30° |
| 풍덕/q05 | problem | 발문에 삼각비만 있음 | EXEMPT | — | N/A | EXEMPT |
| 풍덕/q05 | solution | 길이비를 보여 주는 보충 직각삼각형 없음 | construction-spike-v1 | `q05-solution.plan.json` | OK/OK | FIELD_PASS: k·3k·√10k·직각 |
| 풍덕/q06 | problem | 원 PNG 흐림; 현 x/반현 5/중심수선 구분 | construction-spike-v1 | `q06-problem.plan.json` | OK/OK | FIELD_PASS: 원 O·현·5·x·점선·직각 |
| 풍덕/q06 | solution | 중심 수선의 현 이등분 강조 | construction-spike-v1 | `q06-solution.plan.json` | OK/OK | FIELD_PASS: 5+5·수선·원 |
| 풍덕/q07 | problem | 기울어진 두 평행 현·거리 5·7과 x의 판독 저하 | construction-spike-v1 | `q07-problem.plan.json` | OK/OK | FIELD_PASS: 평행 현·중심거리 5/5·반현 7·x |
| 풍덕/q07 | solution | 같게 떨어진 두 현의 길이 비교 | construction-spike-v1 | `q07-solution.plan.json` | OK/OK | FIELD_PASS: 두 현의 반분 7 네 곳·두 수선 |
| 풍덕/q08 | problem | 그림 없이 삼각비 표와 계산식 | EXEMPT | — | N/A | EXEMPT |
| 풍덕/q08 | solution | 도식 없는 표 읽기·계산 | EXEMPT | — | N/A | EXEMPT |
| 풍덕/q09 | problem | 저화질 둔각·6/8 표기 | construction-spike-v1 | `q09-problem.plan.json` | OK/OK | FIELD_PASS: BC6·CA8·∠C135° |
| 풍덕/q09 | solution | 기존 수선과 길이가 명료하고 불필요 채움 없음 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q9-solution.svg |
| 풍덕/q10 | problem | 기존 개선판 지시선·30°/60°·10m 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q10-problem-v2.svg |
| 풍덕/q10 | solution | 기존 삼각비 보조선·h/m 표기 충분 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q10-solution.svg |
| 풍덕/q11 | problem | 흐린 좌표축/단위 사분호·두 직각·a,b | construction-spike-v1/SOURCE_COORDINATE_AXES_v1 | `q11-problem.plan.json` | OK/OK | FIELD_PASS: x/y축·OB=1(원호)·A/B/C/D·수선·a,b |
| 풍덕/q11 | solution | 좌표 B의 가로/세로 성분·여각 대응 추가 | construction-spike-v1/SOURCE_COORDINATE_AXES_v1 | `q11-solution.plan.json` | OK/OK | FIELD_PASS: OA=cos a·AB=sin a·a+b=90° |
| 풍덕/q12 | problem | 저화질 BC24·직각 표식 | construction-spike-v1 | `q12-problem.plan.json` | OK/OK | FIELD_PASS: AB/BC/AC·직각 B·24 |
| 풍덕/q12 | solution | 피타고라스 세 변 명시 | construction-spike-v1 | `q12-solution.plan.json` | OK/OK | FIELD_PASS: 18·24·30·직각 |
| 풍덕/q13 | problem | 저화질 정육각형 윤곽 | construction-spike-v1 | `q13-problem.plan.json` | OK/OK | FIELD_PASS: 정육각형 여섯 변·3cm |
| 풍덕/q13 | solution | **기존 파란 기본 면 채움 제거**, 6등분 보조선만 | construction-spike-v1 | `q13-solution.plan.json` | OK/OK | FIELD_PASS: 중심·6개 삼각형·무채움 |
| 풍덕/q14 | problem | 흐린 관측 높이 h·거리40·30°/45° | construction-spike-v1 | `q14-problem.plan.json` | OK/OK | FIELD_PASS: 40·30°·45°·높이 점선·직각 |
| 풍덕/q14 | solution | 기존 h, u/v, 두 관측점·수직발 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q14-solution.svg |
| 풍덕/q15 | problem | 겹친 두 원·√6/2·접선 AB 스캔 저하 | construction-spike-v1 | `q15-problem.plan.json` | OK/OK | FIELD_PASS: 동심원·두 반지름·접선 현 |
| 풍덕/q15 | solution | 기존 직각·R/r 보조선 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q15-solution.svg |
| 풍덕/q16 | problem | 원·두 접선·외부 3·반지름2·x를 원본 대비 재정렬 | construction-spike-v1 | `q16-problem.plan.json` | OK/OK | FIELD_PASS: P/O/A/B·3·2·x·접점 직각 |
| 풍덕/q16 | solution | 기존 두 접선의 길이/반지름 구분 충분 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q16-solution.svg |
| 풍덕/q17 | problem | 기존 q17 개선판에 내접원 접점·8/10/11/6 충분 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q17-problem-v2.svg |
| 풍덕/q17 | solution | 기존 접선 길이 대응색과 눈금 적절(기본 면 채움 없음) | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q17-solution.svg |
| 풍덕/q18 | problem | **원본 q18 PNG 심한 크롭**; P-C-A·P-D-B·C-E-D 순서, 7/3/4·접점 전면 재구성 | construction-spike-v1 | `q18-problem.plan.json` | OK/OK | FIELD_PASS: 6점·원·3접선·순서·PC7/CA3/CD4 |
| 풍덕/q18 | solution | 기존 접선 구간의 표식·수학 관계 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q18-solution.svg |
| 풍덕/q19 | problem | **원본 q19 PNG 잘림**; x/y 호·두 4cm·수선 명확화 | construction-spike-v1 | `q19-problem.plan.json` | OK/OK | FIELD_PASS: 4+4·x/y 분할각·C 직각 |
| 풍덕/q19 | solution | **기존 주황 면 채움 제거**, DH 수선과 삼각비 수치 추가 | construction-spike-v1 | `q19-solution.plan.json` | OK/OK | FIELD_PASS: AD8·AC4√3·DH 점선·직각·x/y |
| 풍덕/q20 | problem | **원본 q20 PNG 하단 잘림**; 정사각형-반원·ED 접선 F 재구성 | construction-spike-v1 | `q20-problem.plan.json` | OK/OK | FIELD_PASS: A~F·O·반원·네 변8·접선 F |
| 풍덕/q20 | solution | 기존 접선쌍 눈금/동색 그룹·x 충분 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q20-solution.svg |
| 풍덕/q21 | problem | 저화질 동심원; **문제에서 요구한 고리 음영만 유지** | construction-spike-v1 | `q21-problem.plan.json` | OK/OK | FIELD_PASS: 내외원·현10·고리만 LIGHT |
| 풍덕/q21 | solution | 기존 R/r·중점 M·5cm와 요청 음영 적절 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q21-solution.svg |
| 풍덕/q22 | problem | 서술형 원본 BD2·15°/30° 스캔 저하 | construction-spike-v1 | `q22-problem.plan.json` | OK/OK | FIELD_PASS: BD2·∠B15°·∠D30°·C 직각 |
| 풍덕/q22 | solution | 기존 보조선·2/√3/1·각 표식 충분 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q22-solution.svg |
| 풍덕/q23 | problem | 반원/30° 및 **실제 활꼴만 음영** | construction-spike-v1 | `q23-problem.plan.json` | OK/OK | FIELD_PASS: 반원·반지름3·∠B30°·활꼴 |
| 풍덕/q23 | solution | 기존 3π−(9√3)/4의 음영 범위 정확 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q23-solution.svg |
| 풍덕/q24 | problem | 원본 빗변·내접원·색칠 범위 흐림 | construction-spike-v1 | `q24-problem.plan.json` | OK/OK | FIELD_PASS: AB6·AC8·A 직각·내접원·원외 삼각형 LIGHT |
| 풍덕/q24 | solution | 기존 내접원 r와 접점·면적 구분 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q24-solution.svg |

## 인계

- 신규 plan **29/29 shallow PASS, 29/29 full PASS**, 29/29 정적 `FIELD_PASS`. 기존 양호한 SVG 14축은 수정하지 않았고 도식 없는 5축은 면제했다.
- `q11`은 단순 평면도형이 아니라 **좌표축 포함 SOURCE_COORDINATE_AXES** 계약을 사용했다. `q18/q19/q20`은 잘린 원본의 관계를 원문 해설의 길이 조건으로 독립 복원했다.
- 원본 JS·PNG·기존 SVG는 변경하지 않았으며, 손으로 그린 SVG는 없다. 후속 엔진 담당자의 생성 SVG·출판 크기·학생 화면·A4 실물 검수 전에는 운영 SVG 게시 완료로 취급하면 안 된다.
