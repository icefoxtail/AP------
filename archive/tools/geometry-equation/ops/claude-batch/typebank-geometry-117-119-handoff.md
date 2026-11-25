# 기하 117–119 문제 그림 plan 인계 — 2026-11-25

## 범위·버전·책임

- 기준 운영 `main`: `2e24a842c36d45bfe45907adceaa0fca9479857c` (직전 PR #3021 병합), 기존 동일 문항 plan 및 겹치는 열린 PR 없음.
- 유형군 순서: 기하 117부터 원문 JS 숫자·문항 id 오름차순. 실제 `[그림: …]` 자리표시가 있는 **15문항**, 3개 JS stem. `118-q06`은 그림 자리표시가 없어 작업 대상에서 제외. 다음 미작성 그림 문항은 `119-q03`.
- 원본 JS blob SHA:
  - `기하_117_벡터의합의크기의합의최대최소_고2_유형은행1.js`: `c42362f4bb31c8e35fe4bbcae06ffbc2b7a68dd5`
  - `기하_118_평면벡터의내적-각도제시형_고2_유형은행1.js`: `aae194180a30c11ed9e9e4a66d0896c03349a48b`
  - `기하_119_내적의기하학적인의미_고2_유형은행1.js`: `54b770fff3b0f0fc8a3cff0b867d648911759146`
- 저장 위치: `archive/tools/geometry-equation/production/plans/<위 JS stem>/qNN-problem.plan.json`; 원본 JS·SVG·PNG·게시 파일을 변경하지 않음.
- 수학 독립 검산: 실제 `[그림]` 존재, 원본 정답·풀이, 점·선분·원·호·타원·포물선 방정식·평행·수직·길이·내적을 별도 Node 계산으로 **15/15 PASS**.
- `plan-lint.cjs --shallow`: **15/15 PASS**. `plan-lint.cjs` full (격리 설치 후): **15/15 PASS**. `sourceVsPlan=REVIEWED` **15/15**.
- 시각 필드 일치: **12 PASS / 3 ENGINE_CAPABILITY_PENDING**. `plan-lint` PASS와 다르며, 보강 대상을 아래에 열거한다.
- 공식 SVG 렌더/PNG 변환/학생 화면/390px/A4 실물/JS 연결·게시: 모두 **NOT_RUN**. 모든 15문항 문제 그림의 런타임 상태는 **SVG_TO_CREATE**. 해설 그림은 이 배치 범위 외이며 완료로 주장하지 않음.

## 문항별 수학·시각 필드 검수표

| qid | 원본 정답 | 정확히 작도한 핵심 정보·검산 | sourceVsPlan | featureParity | shallow/full | 렌더/PNG/학생화면/A4 |
|---|---|---|---|---|---|---|
| 117-q01 | ① | O 중심 반지름 5의 **사분원 호만**, A(5,0), B(0,5), x=3 직선, P(3,a) 텍스트 표시·호 위 Q; P는 임의 대표 높이 1 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 117-q02 | ② | A(-1,0) 중심 원 r=1 위 P, B(5,0)–C(1,3) 선분 위 Q, 벡터 OP·AQ 화살표; P,Q는 대표 위치 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 117-q03 | ⑤ | 변 8 정삼각형, A 지나는 l∥BC 실제 두 직선과 평행 표식, 원 O의 세 직선까지 거리 모두 2√3, 외부 중심, 원 위 P | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q01 | ② | 변 6 정삼각형, AC 중점 M의 두 동등 눈금, BM 실제 선분 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q02 | ① | ∠B=90° 마커, AC=13·BC=5 실제 치수선; 미제시 AB=12 노출 금지 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q03 | ② | ∠A 직각, AB=6·AC=8, BC 중점 M, AM, ∠MAC=x 각 호와 라벨 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q04 | ④ | AB=5 지름의 **윗쪽 반원 호만**, C는 호 위·BC=2의 실제 현 치수선 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q05 | ① | O·C(3,4), 원 r=1, OC 위 A, 실제 접점 B와 OB⊥BC, 벡터 OA·OB 화살표 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q07 | ③ | 반지름 3 원·A 꼭대기 정육각형, G₁=centroid(OBC), G₂=centroid(OEF), 두 벡터 화살표 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS/PASS | NOT_RUN |
| 118-q08 | ③ | 한 변 4 정사각형, AB/CD/DA 세 중점·독립 동등 눈금, PR·BQ 화살표 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 118-q09 | ② | y²=12x 포물선, F=(3,0), 준선 d:x=-3, P에서 준선 수선 발 H·직각, PF·PH 경로 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS/PASS | NOT_RUN |
| 118-q10 | ③ | 타원 x²/25+y²/9, 원 x²+y²=19, F(4,0)·F′(-4,0), 1사분면 실제 교점 P, PF·PF′ 경로 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS/PASS | NOT_RUN |
| 118-q11 | ② | C에서 AB로 내린 수선 CH·직각 H, AH:HB=1:2 도형 인접 텍스트; 구한 AB·높이 수치 노출 금지 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q01 | ③ | AB=8, 이등변 삼각형 밑각 A·B에 동일한 각 호 두 개 | REVIEWED | PASS | PASS/PASS | NOT_RUN |
| 119-q02 | ③ | B 직각 표시, AB=5·BC=12 실제 치수선; 도출되는 AC=13은 미기재 | REVIEWED | PASS | PASS/PASS | NOT_RUN |

## 엔진 보강 필요 장부 — 실제 시각 정보 누락

1. **118-q07**: `construction-spike-v1` 벡터 `planeMarks.vectors`는 `vec(AB)` 같은 단문자 ID만 라벨로 허용한다. 실제 화살표 `A→G1`·`A→G2` 및 점 표시 `G₁`·`G₂`는 있으나 원문 벡터 명칭 `\vec{AG_1}`, `\vec{AG_2}`을 화살표 위에 붙이는 기능이 없다. `vec(AG1)` 지정은 `VECTOR_LABEL_INVALID`로 실패하는 계약 제약. 다문자/첨자 종점 벡터 라벨 확장 필요.
2. **118-q09**: `ellipse-figure-v1`의 conic `segments[]`에는 화살촉/벡터 수식 라벨이 없다. 원문 `\vec{PF}`, `\vec{PH}`를 PF·PH 연결선과 H 수직으로만 표현한다. 준선 식 `x=-3`을 직접 `lines[].label`로 주면 full 검사에서 `ELLIPSE_LABEL_NO_ROOM:line-d`이 발생하여, 실제 준선은 정확히 x=-3에 두되 짧은 이름 `d`만 표시하고 식은 caption/accessibility/sourceConditions에 둠. 필요한 기능: conic 벡터 화살촉+표식 및 준선 식의 지시선/라벨 여백 확장.
3. **118-q10**: 동일 conic 경로 한계로 `\vec{PF}`, `\vec{PF'}`은 정확한 선분으로만 표시. 타원·원 교차점 `P`는 `CONIC_CONIC` (1사분면) 실제 엔진 검산 통과. 필요한 기능: 두 선분의 벡터 화살촉과 수식 라벨.

이 3문항의 `featureParity`는 **PASS가 아니다**. 엔진 확장 뒤 해당 qid 재검사·SVG/PNG 렌더·실물 및 학생 화면/A4 검수·게시 작업을 후속 담당자가 수행한다. 그 외 12문항도 SVG 미렌더 상태여서 최종 시각 검수 PASS로 보지 않는다.

## 후속 작업자 체크

1. 이 PR이 병합된 최신 `main`을 가져온 뒤 `119-q03`부터 원문 그림 자리표시 기준으로 15~20개 문항을 구성한다. 기하 완료 이전 미적분Ⅱ나 다른 시험지·유사문항·교과서·문제집으로 건너뛰지 않는다.
2. 이번 batch의 운영 `main` 병합과 실제 SVG 생성·게시를 구분한다. `plan-lint` PASS는 실제 학생용 SVG 배포가 아니다.
3. 위 3개 보강 목록을 renderer/visual-engine 담당자에게 남긴다. 원본 JS 수정을 통해 누락을 감추거나 수기 SVG를 올리지 않는다.
