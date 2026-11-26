# 2021 이수중 중2 2학기 중간 — 문제·해설 도형 계획 전수 점검

- 유일한 대상: `archive/exams/original/middle/m2/2mid/21_이수중_2학기_중간_중2_수학.js` (26문항).
- 현재 문항 그림 SVG 19개 전부에 흰색 불투명 배경 `<rect>`가 남아 있다. 이 PR은 원본 JS·기존 SVG를 수정하지 않고 **공식 기하 엔진 plan JSON 38개(도형 19문항 × 문제/해설)**만 작성한다. plan 엔진의 기본면은 `none`이며 원문이 넓이를 요구한 q04·q18만 `regions`로 칠한다.
- 증거: 원본 `archive/assets/images/21_이수중_2학기_중간_중2_수학/q04.png`, `q06.png`~`q21.png` 총 17장과 연결 SVG 19개를 실제로 나란히 열어 확인. q25·q26은 별도 원본 PNG가 없으므로 JS의 원문/해설과 기존 연결 SVG를 대조했다.
- `plan-lint.cjs --shallow` 및 full: 38/38 OK. 독립 geometry/source-field 검산: 38/38 OK. **DRAWN_FEATURE_PARITY의 렌더 SVG/원본 픽셀 1:1 항목은 `NOT_RUN`**: 이 환경의 부분 저장소에서 렌더 입력이 `ARCHIVE_INPUT_INVALID:SOURCE_SCOPE`로 거절되었음. 학생용 실제 SVG는 아직 바뀌지 않았고 추후 운영 렌더/바인딩 필수.
- `ENGINE_CAPABILITY_PENDING`: 없음. 계획된 보조선·길이 치수·각호·직각·평행·눈금·원의 접점·음영은 문서화된 `construction-spike-v1`에서 표현 가능. **렌더 성공 자체는 미확인**이며 엔진 능력 승인으로 해석하면 안 됨.

| qid | 축 | 원본 대비 주요 판정·재설계 요소 | capability | 계획 파일 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| q01 | 문항/해설 | 일차방정식 식 비교; 원본 도형 없음. SVG 신규 생성 대상 아님 | N/A | — | N/A | TEXT_ONLY |
| q02 | 문항/해설 | 수평 직선의 식; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q03 | 문항/해설 | 연립방정식 교점 서술; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q04 | 문항/해설 | **원본에 있는 삼각형 ABC 음영이 연결 SVG에서 빠짐**; 두 식의 직선·x/y축·교점·x절편·영역을 복구 | construction-spike-v1 | `q04-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q05 | 문항/해설 | 이등변삼각형의 참거짓 보기; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q06 | 문항/해설 | AB=AC, B 각 이등분선, C=72°, BC=3; 같은 길이 눈금·두 각호·치수 소속과 길이 축척 보정 | construction-spike-v1 | `q06-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q07 | 문항/해설 | 원본 하단이 잘린 이등변삼각형; AB=AC·중점 M·BAM=25°만 근거로 복원하고 임의 관계 배제 | construction-spike-v1 | `q07-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q08 | 문항/해설 | 원본 점선 호 길이 지시선 누락; AB9·AC12·DE4·AC=EC와 A/E 직각 표시를 정확한 담당 선분에 배정 | construction-spike-v1 | `q08-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q09 | 문항/해설 | 두 직각삼각형의 B/E 직각 두 개를 독립 표시; 근거 없는 등변 눈금 없음 | construction-spike-v1 | `q09-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q10 | 문항/해설 | 외심 O를 지나는 세 수직이등분선, D/E/F의 각 직각과 중점 눈금을 빠짐없이 지정 | construction-spike-v1 | `q10-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q11 | 문항/해설 | 외심의 세 반지름과 BAO25°·OBC30°·OAC x 각주인 고정 | construction-spike-v1 | `q11-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q12 | 문항/해설 | 원본에서 BC 밑변 잘린 부분; 발문 조건으로 삼각형 완성, 외심 O와 내심 I 구별 | construction-spike-v1 | `q12-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q13 | 문항/해설 | 원본 아래쪽 잘림; DE∥BC와 BD5·CE4의 다른 선분 길이·내심 I를 구분 | construction-spike-v1 | `q13-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q14 | 문항/해설 | 내심 I의 BIC112°와 A의 작은 각 x의 소속을 구분 | construction-spike-v1 | `q14-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q15 | 문항/해설 | 평행사변형 두 평행쌍, A110°·D25°·B y·C x 각을 각 꼭짓점에 고정 | construction-spike-v1 | `q15-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q16 | 문항/해설 | 대각선 AC8/BD12의 점선 원본 지시를 치수선으로, 변 AB6과 교점 O의 중점 관계를 분리 | construction-spike-v1 | `q16-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q17 | 문항/해설 | AD11·AB8의 원본 점선 치수호를 치수선으로, A→F·D→E의 서로 다른 각이등분선을 보존 | construction-spike-v1 | `q17-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q18 | 문항/해설 | B/E와 D/F 이등분선, BC18·CD13·면적108 조건에서 **EBFD만** 음영; 사각형 면 경계 정정 | construction-spike-v1 | `q18-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q19 | 문항/해설 | 직사각형 두 대각선, AC12 길이·D60°·OD x·A y의 주인 혼동 방지 | construction-spike-v1 | `q19-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q20 | 문항/해설 | 마름모 대각선 BD와 CD 위 수선발 H·직각표식·B24°를 분리 | construction-spike-v1 | `q20-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q21 | 문항/해설 | 정사각형 대각선 AC 위 E, ABE10°와 DEC x가 서로 다른 꼭짓점에 부착 | construction-spike-v1 | `q21-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q22 | 문항/해설 | 사각형 대각선 성질의 텍스트 선택지; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q23 | 문항/해설 | 두 점을 지나는 일차함수 서술; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q24 | 문항/해설 | 기온 변화의 일차함수 서술; 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q25 | 문항/해설 | 원본 PNG 없음. 연결 SVG·증명 원문 기반 밑각과 A각 이등분 호 그룹을 독립 보강 | construction-spike-v1 | `q25-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |
| q26 | 문항/해설 | 원본 PNG 없음. 5·12·13cm 직각삼각형, 내심 I·반지름·직각·접점을 생성 가능한 원으로 정의 | construction-spike-v1 | `q26-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |

## 운영 전 필수 재검수

1. 전체 38축을 엔진으로 렌더해 L1/관측기/인쇄 A4/휴대폰 읽기를 통과시키고, 각 원본 스캔(17장)과 원문 qid를 1:1 대조한다. 렌더 실패는 원문을 바꾸지 않고 plan을 재조정한다.
2. 문제/해설용 SVG를 공식 바인딩으로 JS의 해당 qid에 연결한다. 이 계획 PR에는 연결·이미지 파일 변경이 없으므로 현재 링크의 흰색 배경 결함은 여전히 운영 중이다.
3. q25·q26의 원본 PNG 부재는 대체 자료 검증 후 `ORIGINAL_ASSET_PARITY` 판정을 별도 종료한다.
