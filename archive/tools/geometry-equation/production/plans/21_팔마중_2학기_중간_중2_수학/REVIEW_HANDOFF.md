# 2021 팔마중 중2 2학기 중간 — 문제·해설 도형 계획 전수 점검

- 유일한 대상: `archive/exams/original/middle/m2/2mid/21_팔마중_2학기_중간_중2_수학.js` (24문항).
- 기존 SVG 21개 모두 흰색 불투명 배경 `<rect>` 존재. q18은 **SVG가 아니라** 원본을 복구한 활성 PNG `q18-restored-20261119.png`. 이 PR은 JS·운영 SVG·PNG를 바꾸지 않고 공식 엔진 JSON **44개(도형 22문항 × 문제/해설)**를 새로 작성한다.
- 근거: `archive/assets/images/21_팔마중_2학기_중간_중2_수학/`의 q01~04, q06~14, q16~20 원본 PNG 18장, q18 복구 PNG, 연결 SVG 21개를 시각적으로 비교. q21~q24는 원본 PNG가 없어 발문·기존 SVG만 비교.
- plan의 면색 기본은 없음. 원본에 빗금친 q09의 외접원–내접원 차집합에만 `pattern:HATCH`, q13에서 넓이를 지정한 세 영역에만 구별 색을 지정했다. 쌍원뿔(q17)은 `solid-figure-v1`로 뒷면 점선을 엔진이 처리하도록 한다.
- `plan-lint.cjs --shallow`와 full **44/44 OK**, 독립 수치/각/눈금/영역/소스 매핑 검사 **44/44 OK**. **최종 생성 SVG vs 원본 스캔의 1:1 DRAWN_FEATURE_PARITY는 미완료 (`RENDER_NOT_RUN`)**: 부분 저장소 렌더에서 `ARCHIVE_INPUT_INVALID:SOURCE_SCOPE`. 실제 운영 링크도 변경하지 않았다.
- 지원 기능만 사용했으므로 **`ENGINE_CAPABILITY_PENDING` 해당 항목 없음**. 단, 렌더 미실행이 지원 검증을 뜻하지 않는다. SVG 렌더·기기별 가독성·바인딩은 후속 검수가 필요하다.

| qid | 축 | 원본 대비 결함 및 설계 판정 | capability | 계획 파일 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| q01 | 문항/해설 | 원본 점선 호 길이표기를 AC와 AB 각각의 문자식 치수선으로 복구, B=C 밑각 호 대응 | construction-spike-v1 | `q01-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q02 | 문항/해설 | **기존 등변 눈금 대응이 원본과 어긋남**; BA=BC와 BD=DC=CA를 서로 다른 그룹으로 분리 | construction-spike-v1 | `q02-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q03 | 문항/해설 | 두 직각삼각형 B/E의 직각 및 세 변 경계만 표기, 근거 없는 음영 없음 | construction-spike-v1 | `q03-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q04 | 문항/해설 | 원본 직각이등변의 두 눈금·A 직각·D/E 수선 직각·a/b 길이 소속을 전부 지정 | construction-spike-v1 | `q04-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q05 | 문항/해설 | 참거짓 보기만 있음. 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q06 | 문항/해설 | **현재 SVG는 120°를 M에 잘못 놓음**. A로 이동, MD=ME·BM=MC 눈금과 두 수선 직각 복원 | construction-spike-v1 | `q06-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q07 | 문항/해설 | 원본 잘린 원호: 외심 O와 A/B/C 원 위 관계, 중심각 y·원주각 x, 20°·30° 소속 확인 | construction-spike-v1 | `q07-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q08 | 문항/해설 | 내심 AI/BI 연장선이 D/E로 이어지는 선순서와 AEB80°·ADB76° 위치 분리 | construction-spike-v1 | `q08-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q09 | 문항/해설 | **외접원 안의 원본 빗금·내접원 구멍은 필수 의미**; 원환 도형 하나에만 HATCH, AB6·BC8·AC10 | construction-spike-v1 | `q09-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q10 | 문항/해설 | 연속 각의 3:2와 D의 구할 각을 각 소속에 맞게 표시, 면칠 삭제 | construction-spike-v1 | `q10-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q11 | 문항/해설 | **원본 실선 BD가 연결 SVG에 점선**으로 잘못 변형됨. 두 대각선 모두 실선 | construction-spike-v1 | `q11-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q12 | 문항/해설 | **BD 잘못된 점선** 정정, OA=OC·OB=OD 두 중점 눈금을 분리 | construction-spike-v1 | `q12-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q13 | 문항/해설 | P 내부 네 삼각형 중 기지 넓이 PDA9·PAB10·PBC16의 구별 표기; PCD는 무채움 | construction-spike-v1 | `q13-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q14 | 문항/해설 | **BD 잘못된 점선**을 원본 실선으로 복구, O 교점 보존 | construction-spike-v1 | `q14-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q15 | 문항/해설 | 참거짓 보기만 있음. 원본 도형 없음 | N/A | — | N/A | TEXT_ONLY |
| q16 | 문항/해설 | 별개의 닮은 사다리꼴 두 개와 AD6·BC8·FG12·EF8의 실제 대응 치수; 해설에만 EH9 | construction-spike-v1 | `q16-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q17 | 문항/해설 | 기존 수제 원뿔 모양의 뒷선 점선·높이선 자동화, 원뿔 닮음비 5:4·큰 밑넓이 25π·작은 높이12 | solid-figure-v1 | `q17-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q18 | 문항/해설 | 활성 PNG 기반 재설계. AB6·AD4·DC5·BC9의 점선 치수호를 정식 치수선으로, BD 보조선 포함 | construction-spike-v1 | `q18-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ACTIVE_PNG · RENDER_NOT_RUN |
| q19 | 문항/해설 | A 직각·H 수선발 직각과 AB5·BH4의 정확한 대응 길이 | construction-spike-v1 | `q19-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q20 | 문항/해설 | BO=OD 눈금이 원본과 달라짐; BD의 수직이등분선 EF·O 직각·BO5·BC8을 복원 | construction-spike-v1 | `q20-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · RENDER_NOT_RUN |
| q21 | 문항/해설 | 원본 PNG 부재. 원문과 현재 SVG 기반 AB=AC·A40°·외심 O/내심 I·IBO각 복원 | construction-spike-v1 | `q21-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |
| q22 | 문항/해설 | 원본 PNG 부재. 내심 I 둘레 AIB:BIC:AIC=5:6:7 호를 세 군으로 구별 | construction-spike-v1 | `q22-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |
| q23 | 문항/해설 | 원본 PNG 부재. 중점 M의 두 구간 눈금, AP와 CP 연장선 점선, AD5 | construction-spike-v1 | `q23-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |
| q24 | 문항/해설 | 원본 PNG 부재. 접힌 종이의 살아 있는 BE·ED와 접기 전 원래 경계 점선, P/Q 수선·16/12/20 치수 | construction-spike-v1 | `q24-{problem,solution}.plan.json` | OK/OK | PLAN_PASS · ORIGINAL_PNG_ABSENT · RENDER_NOT_RUN |

## 운영 전 필수 재검수

1. 44축 전체의 공식 렌더·독립 관측기·PC/A4/모바일 검사를 통과시키고 원본 스캔 18장 및 `q18-restored-20261119.png`와 1:1 대조한다.
2. 문제/해설 plan 출력의 공식 운영 바인딩은 이 plan-only PR에 포함되지 않는다. 학생에게 보이는 기존 흰색 배경·오각도 배치는 여전히 살아 있으므로 실제 SVG 교체는 별도 실무 후속 조건이다.
3. q21~q24는 원본 PNG가 없어 정확한 에셋 1:1 동등성 판정 불가. 원본 이미지 확보 시 개별 재검수한다.
