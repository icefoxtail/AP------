# 비상_미적분1_미분_익힘책_고2: 문항·해설 2축 정적 SVG 플랜 검수

원문: `archive/exams/textbooks/비상교육_미적분1/비상_미적분1_미분_익힘책_고2/비상_미적분1_미분_익힘책_고2.js` (`비상_미적분1` 경로의 동일 이름 파일과 Git blob SHA 동일)

- 본 보고는 원문 텍스트/해설 SHA256과 원본 PNG의 점·선·라벨을 확인한 **정적 특징↔JSON 필드 1:1 검수**다. 최종 SVG 렌더·학생 화면·원본 PDF 픽셀 일치 검사는 실행하지 않았다.
- `ENGINE_CAPABILITY_PENDING`은 지원하지 않는 도형을 다른 그림으로 속여 제작하지 않았다는 뜻이며, 해당 축의 실행 JSON은 작성하지 않았다.
- 새 플랜에는 기본 흰색 배경·불필요한 면 채움 관련 필드를 추가하지 않았다.
- **2026-11-27 재검수 보완:** q20 문제축의 `y=f′(x)`와 q23 문제·해설축의 `y=x²−5` 곡선 식 이름을 확인했다. `overlays.names`에서 원본 식 그대로 표기하면 `OVERLAY_NAME_TEXT_INVALID`·`OVERLAY_NAME_NOT_LINEAR`로 거절되어, 실행 가능한 `도함수`·`포물선` 소유 라벨을 각각 추가했다. 도형·원·안내선의 정적 조건은 확인했지만 **수식 라벨의 문자 단위 원본 1:1과 실제 렌더 패리티는 미완료**다. 최종 `DRAWN_FEATURE_PARITY`는 PASS로 인정하지 않는다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 비상_미적분1_미분_익힘책_고2/q01 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q01 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q02 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q02 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q03 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q03 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q03-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q04 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q04 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q05 | 문항 | ENGINE_CAPABILITY_PENDING | PIECEWISE_DISCONTINUOUS_MIXED_DEGREE3_WITH_EXACT_DASHED_GUIDES_AND_CUSPS | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 문항 | 세부 | −2,0,2,3,4,5,7의 안내 점선, 꺾임 x=0·2, x=3에서 수평 접선을 지나는 S형 곡선, x=4의 (4,2)●/(4,1)○, x=5의 (5,−1)○/(5,−2)●, 오른쪽 급증 곡선과 y=3 등 원본 가이드 전부 필요. 불연속 x=4,5; 미분불가 x=0,2,4,5. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q05 | 해설 | ENGINE_CAPABILITY_PENDING | PIECEWISE_DISCONTINUOUS_MIXED_DEGREE3_WITH_EXACT_DASHED_GUIDES_AND_CUSPS | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 해설 | 세부 | −2,0,2,3,4,5,7의 안내 점선, 꺾임 x=0·2, x=3에서 수평 접선을 지나는 S형 곡선, x=4의 (4,2)●/(4,1)○, x=5의 (5,−1)○/(5,−2)●, 오른쪽 급증 곡선과 y=3 등 원본 가이드 전부 필요. 불연속 x=4,5; 미분불가 x=0,2,4,5. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q06 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q06 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q07 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q07 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q08 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q08 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q09 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q09 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q09-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q10 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q10 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q11 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q11 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q12 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q12 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q13 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q13 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q13-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q14 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q14 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q14-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q15 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q15 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q15-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q16 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q16 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q16-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q17 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q17 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q17-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q18 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q18 | 해설 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q19 | 문항 | ENGINE_CAPABILITY_PENDING | SOLID_SPHERE_CONTAINS_TANGENT_CYLINDER_WITH_RADIUS_GUIDES | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 문항 | 세부 | 구 R=3cm 내부에 원기둥이 내접, 위/아래 타원 테두리(숨은 호 점선), 중심●에서 접점으로 반지름 3cm 지시선, 직각 관계 r²+(h/2)²=9; 현재 solid-figure는 원기둥 내부 구만 지원하므로 원기둥 내접 구로 뒤집지 말 것. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q19 | 해설 | ENGINE_CAPABILITY_PENDING | SOLID_SPHERE_CONTAINS_TANGENT_CYLINDER_WITH_RADIUS_GUIDES | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 해설 | 세부 | 구 R=3cm 내부에 원기둥이 내접, 위/아래 타원 테두리(숨은 호 점선), 중심●에서 접점으로 반지름 3cm 지시선, 직각 관계 r²+(h/2)²=9; 현재 solid-figure는 원기둥 내부 구만 지원하므로 원기둥 내접 구로 뒤집지 말 것. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q20 | 문항 | LABEL_ALIAS_ADDED | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q20-problem.json` | PASS/PASS | STATIC_GEOMETRY_PASS / CURVE_FORMULA_LABEL_ALIAS_ONLY / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q20 | 해설 | BENEFICIAL | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q20-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q21 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q21 | 해설 | ENGINE_CAPABILITY_PENDING | QUARTIC_IRREDUCIBLE_CUBIC_CRITICAL_ROOT_WITH_CERTIFIED_INTERVAL_MINIMUM | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 해설 | 세부 | h(x)=x⁴−3x³−9x−22 (x≥0)의 도함수 4x³−9x²−9의 유일한 양의 근은 유리수·한 겹 근호가 아닌 삼차근. 최소값을 −53과 비교하는 경계의 오차보증/표시가 필요. 수치 −52.4를 정확한 점으로 위조 금지. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q22 | 문항 | EXEMPT | 독립 그림 없음: 문항 또는 해설의 식·대수 논증만으로 완결 | — | NOT_APPLICABLE/NOT_APPLICABLE | EXEMPT_NO_DRAWN_FEATURES |
| 비상_미적분1_미분_익힘책_고2/q22 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q22-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q23 | 문항 | LABEL_ALIAS_ADDED | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q23-problem.json` | PASS/PASS | STATIC_GEOMETRY_PASS / CURVE_FORMULA_LABEL_ALIAS_ONLY / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q23 | 해설 | LABEL_ALIAS_ADDED | polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q23-solution.json` | PASS/PASS | STATIC_GEOMETRY_PASS / CURVE_FORMULA_LABEL_ALIAS_ONLY / RENDER_NOT_RUN |
| 비상_미적분1_미분_익힘책_고2/q24 | 문항 | ENGINE_CAPABILITY_PENDING | SCENE_PICTOGRAM_LAMP_PERSON_SHADOW_WITH_GEOMETRY_DIMENSIONS | — | NOT_APPLICABLE/NOT_APPLICABLE | BLOCKED_BY_ENGINE_CAPABILITY / ORIGINAL_REVIEWED |
| ↳ 필요 엔진 확장 | 문항 | 세부 | 원본 발문 사진식 가로등 머리·기둥·사람 실루엣·바닥 그림자와 같은 원근 장면에 3m·1.6m 길이 표시, 광선 실선과 가로등 밑 직각 표시가 필요. 생산 엔진은 장면 픽토그램과 정밀한 평면도형의 혼합을 미지원. | — | — | 원본 특징 미완성 |
| 비상_미적분1_미분_익힘책_고2/q24 | 해설 | BENEFICIAL | construction-spike-v1 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q24-solution.json` | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / SOURCE_TEXT_REVIEWED / RENDER_NOT_RUN |

합계: 24문항/48축 · 실행 플랜 13 · 엔진 대기 6 · 그림 불필요 29 · 발문 원본 PNG 5개
