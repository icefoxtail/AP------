# 고2 유형은행 미적분Ⅱ 273/q04–280/q05: 20문항 plan·DRAWN_FEATURE_PARITY 인계

- 기준: 2026-11-26(KST). 직전 `244/q01–273/q03` PR #3117 병합 이후, `archive/exams/types/high/h2/`의 실제 `[그림: …]` 문항을 파일 번호→qid 오름차순으로 정확히 20개 선정했다.
- 대상: 미적분Ⅱ 원본 JS **5종**, 문제 그림 **20문항**: 273(7개, q04~10), 274(4개, q03~06), 277(2개, q01~02), 279(2개, q01·06), 280(5개, q01~05). 그림 없는 qid는 건너뛰었고 기하 완료분·앞선 plan·시험지·교과서·중등은 수정하지 않았다.
- Git 변경: `production/plans/<정확한 stem>/qNN-problem.plan.json` **20개 신규**와 이 인계 문서 1개. 원본 JS/해설/정답/엔진/SVG/PNG 파일 변경 없음.
- 공식 `plan-lint.cjs --shallow`: **OK 20/20**. 공식 `plan-lint.cjs --jobs 2` full: **OK 20/20**. 단, 7개는 `status:"UNSUPPORTED"`인 **상태 기록**만으로 OK이며 렌더 가능한 plan이 아니다.
- 원문 독립 대조: `sourceQuote` **20/20 정확 일치**, 원본 JS SHA-256 **5/5 대조**, 실제 drawable 필드 참조 **40건**, 구체적인 `ENGINE_CAPABILITY_PENDING` 조건 **43건** 경로 대조. 수학 대표값·특징점은 별도 독립 숫자 검산 완료.
- **DRAWN_FEATURE_PARITY: PASS 0 / ENGINE_CAPABILITY_PENDING 20.** 실제 엔진 capability 13개(`PARTIAL`), 상태 전용 `UNSUPPORTED` 7개. 본 작업에는 시각적으로 완성된 문제가 없다. 수학·형식 lint OK는 feature-parity PASS와 동의어가 아니다.
- SVG 렌더, PNG 독립 관측, 학생 화면, A4 인쇄, JS 연결, 게시: 모두 **NOT_RUN / SVG_TO_CREATE**. 문제/해설 두 축 전체 중 **문제 슬롯만** 계획했다.

## 문항별 결과

| 파일/qid | 축·원문 핵심 | 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 273/q04 | (e^{2x})·(y=-x+a)·같은 넓이 A/B | PARTIAL | exponential-affine-spike-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q04-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q05 | (e^{-x})·(y=√e)·A/B | PARTIAL | exponential-affine-spike-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q05-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q06 | (ln x)·(x=e²)·A/B | PARTIAL | logarithmic-affine-spike-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q06-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q07 | (asin x)·(3cos x)·A/B | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q07-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q08 | (2xsin x)·미지 기울기 직선·A/B | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q08-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q09 | (2sin(πx))·(y=k)·(S₂=2S₁) | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q09-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 273/q10 | (xe^x)·(x=k)·A/B | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q10-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 274/q03 | (e^x/√(2e^x+1))·수평 이등분 | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 274/q04 | ((ln x)/x)·(x=k) 양쪽 같은 넓이 | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q04-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 274/q05 | (kcos x)·(3sin x)·이등분 | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q05-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 274/q06 | (2sin x)·(acos x)·이등분 | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q06-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 277/q01 | (sin 2x)·(y=½), (y=1)·영역 | PARTIAL | trigonometric-spike-v1 | [JSON](../../production/plans/미적분II_277_역함수를직접구하지않고넓이구하기_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 277/q02 | (xe^x)·((2,2e²))·보조선 | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_277_역함수를직접구하지않고넓이구하기_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 279/q01 | 단면 정사각형 (√(32-3x))·높이 8 | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_279_밑면과평행한평면으로자른단면의한변의길이_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 279/q06 | 로그 곡면 그릇·단면 (√\ln(x+1)) | UNSUPPORTED | 상태 전용 | [JSON](../../production/plans/미적분II_279_밑면과평행한평면으로자른단면의한변의길이_고2_유형은행1/q06-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 280/q01 | 반지름 2·높이 5 원기둥·60° 절단 | PARTIAL | solid-figure-v1 | [JSON](../../production/plans/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q01-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 280/q02 | 지름 (6a)·높이 (3a) 원기둥·30° 절단 | PARTIAL | solid-figure-v1 | [JSON](../../production/plans/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q02-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 280/q03 | 반지름 (r)·높이 (3r) 물통·기울인 수면 | PARTIAL | solid-figure-v1 | [JSON](../../production/plans/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q03-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 280/q04 | 반지름 3·높이 (3√3) 물통·60° 수면 | PARTIAL | solid-figure-v1 | [JSON](../../production/plans/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q04-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |
| 280/q05 | 반지름 4cm 반구·30° 수면 | PARTIAL | solid-figure-v1 | [JSON](../../production/plans/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q05-problem.plan.json) | OK/OK | ENGINE_CAPABILITY_PENDING |

## 원문–필드 1:1 독립 검수

- 각 plan의 `sourceConditions[].mappedTo`는 존재하는 실제 `graphPlan`·`solids`·`dims` 필드에 닿거나, 보이지 않는 필수 특징의 엔진 결함을 `ENGINE_CAPABILITY_PENDING: <구체 원인>`으로 표시한다. `caption`, 설명 문구만으로 시각 PASS를 만들지 않았다. 전체 sourceVsPlan=**REVIEWED 20/20**.
- **273/q04~06**: 자연밑 지수·로그의 계수는 원문 식과 1:1. q04는 대표 (a=2)의 기울기 -1 직선, q05는 (k=1) 오른쪽 경계, q06은 (a=1) 수평선을 보여 줄 뿐 이 대표값이 원문의 동일 넓이 조건을 만족한다고 주장하지 않는다. (√e), (x=e²), 미지 교점·면 채움은 실제로 보이지 않으므로 보류했다.
- **273/q07·09, 274/q05·06, 277/q01**: 단일 삼각곡선의 진폭·주기와 점을 독립 계산했다. q273/07의 원문 범위 ([0,π/3])는 엔진 최소 1/4주기보다 짧아 (3cos x)만 ([0,π/2])까지 연장했으며 경계 불일치를 별도 기록했다. q273/09는 예 (k=1)에서 실제 두 교점만 맞추고 (S₂=2S₁)을 주장하지 않는다. q277/01은 (sin(2π/12)=1/2), (sin(2π/4)=1)이 정확하다; 두 수평선은 실제 `referenceLines`와 `overlays.lines`이고 색칠된 영역은 보류했다.
- **280/q01~05**: 원기둥·반구 **외형**만 실제 `solid-figure-v1` 모델로 작성했다. q02는 (a=1), q03은 (r=2)의 닮은꼴 대표 치수. q04는 실수형 모델이 (3√3)의 대수 표현을 받지 않아 **약 5.1961524의 시각 투영만** 쓰고 정확 치수 라벨·비스듬한 수면·물 채움을 미완료로 기록했다. 모든 q280은 본래의 절단 쐐기나 남은 물이 **전혀 그려지지 않은 PARTIAL** 상태다.
- **UNSUPPORTED qid 7개**: 273/q08·q10, 274/q03·q04, 277/q02, 279/q01·q06. 복합 초월 함수 곡선·동적 단면 3D를 지원하지 않아 차선의 엉뚱한 곡선이나 평면으로 대체하지 않았다. 이 7개 JSON은 `status` 기록이지 렌더할 plan이 아니다.
- 문제 그림의 답값(예: q273/04의 (a=e²/2), q273/09의 (k=4/π), q274/05의 (k=4))을 필드나 이미지 라벨에 넣지 않았다. 표본값을 쓰는 곳에는 반드시 '예시'라고 표기했다.

## 주된 엔진 보강 분류

| 기능 종류 | 해당 문항 |
|---|---|
| 곱함수 (xe^x), (2x\sin x), ((\ln x)/x), 지수/근호 합성 그래프 | 273/q08·q10, 274/q03·q04, 277/q02 |
| 두 삼각곡선 동축·기호 진폭·영역 채움 | 273/q07·q09, 274/q05·q06, 277/q01 |
| 자연 로그·지수의 초월 경계/미지 교점·동등 면, 정확 (sqrt e) | 273/q04·q05·q06 |
| 변하는 정사각형 단면의 3차원 입체·곡면 그릇 | 279/q01·q06 |
| 원기둥 지름을 지나는 기울어진 절단 평면·쐐기 부피 | 280/q01·q02 |
| 기울어진 용기의 자유 수면과 물 부피, 반구 자유 수면 | 280/q03·q04·q05 |
| 대수적 무리수 높이의 정확 3D 길이 모델 | 280/q04 |

## 원본 JS SHA-256 — 모두 미수정

| 번호 | SHA-256 |
|---|---|
| 273 | `e03ed5263b05860ce00252fce2ee81bfba12c3c272414e88009d5c7811f4cc7f` |
| 274 | `ee74b8cbe5339428dba98f4117af9c5e8b40561e5406c83e4f4be641f3baf505` |
| 277 | `d1f7e8698efca2cd6cb7779b4ac40246c830b5236d0a8c3810d4755d2423436b` |
| 279 | `4155422f1c38e1c328d4d1d8bedfdf08b9df21703ece5c2c0696de5855dec522` |
| 280 | `d4c09821301fea46777219c55c355771ba471be17b44bbb913603c01128c861b` |

## 다음 작업

1. 다음 미작성 `[그림:]`은 **`미적분II_281_x축에수직인평면으로자른단면이주어진입체_고2_유형은행1.js`의 q01**. 다음에도 연속 그림 문항 20~30개만 작업한다.
2. 엔진 담당은 위 결함을 공통 capability로 보강한 뒤 `PARTIAL` 13개와 상태만 남긴 7개를 실제 drawable로 완성하고 다시 원문–필드 패리티를 검사한다.
3. 그 뒤 공식 엔진 렌더→SVG 독립 관측→PNG→학생 화면→A4→별도 JS 연결·출고를 수행한다. **plan/main 병합만으로 시각 완료나 학생 배포를 선언하지 않는다.**
