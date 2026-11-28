# E라인 기타 SVG 렌더 후속 작업 장부

기준 SHA는 `d9f517af14c01ebf154890d541d6771fc74fe8fa`이다. 수리 커밋은 `63255f3795fe1ee374652dc07d8d8e6e0f0825ad`이며, 이 장부는 기준판과 수리판을 공식 엔진으로 실행한 결과를 정리한다.

전체 67건 중 `ARCHIVE_BOUND` 31건이다. 공식 lint는 66건 통과, 1건 실패다. 검증된 신규 SVG 경로 6개를 수리 커밋에 넣었다.

## 다음 작업

정확한 성공 판정에는 lint와 `render-plan.mjs --accept-scored 1`을 사용한다. 아래 표의 렌더 상태와 운영 자산 상태를 확인해 이어받는다.

| 항목 | Plan 경로 | 문항 | 렌더 또는 자산 상태 | 다음 조치 |
| --- | --- | --- | --- | --- |
| e001 | `archive/tools/geometry-equation/production/plans/기하_025_타원의정의의활용-타원위의점에서두초점까_고2_유형은행1/q03-problem.plan.json` | q3 | `ENGINE_CAPABILITY_PENDING` | Plan의 미지원 사유와 필요한 도형 기능을 확인한다. |
| e002 | `archive/tools/geometry-equation/production/plans/기하_026_타원의정의의활용-타원위의점에서두초점까_고2_유형은행1/q01-problem.plan.json` | q1 | `LABEL_OVERLAP` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e003 | `archive/tools/geometry-equation/production/plans/기하_026_타원의정의의활용-타원위의점에서두초점까_고2_유형은행1/q03-problem.plan.json` | q3 | `LABEL_OVERLAP` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e004 | `archive/tools/geometry-equation/production/plans/기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1/q01-problem.plan.json` | q1 | `LINE_TOO_SHORT` | 해당 단계의 실패 상세를 재현하고 원문 조건과 렌더 계약을 대조한다. |
| e005 | `archive/tools/geometry-equation/production/plans/기하_164_두평면의교선이주어질때-두평면의이면각을_고2_유형은행1/q02-problem.plan.json` | q2 | `LABEL_GEOMETRY_COLLISION` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e008 | `archive/tools/geometry-equation/production/plans/미적분II_082_지수함수로그함수의극한의활용1_고2_유형은행1/q02-problem.plan.json` | q2 | `OVERLAY_LINE_MISMATCH` | 원래 식과 최종 획의 기울기·절편을 대조한다. |
| e009 | `archive/tools/geometry-equation/production/plans/미적분II_093_삼각함수의덧셈정리2_고2_유형은행1/q13-problem.plan.json` | q13 | `ANGLE_LABEL_TOO_FAR` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e010 | `archive/tools/geometry-equation/production/plans/미적분II_117_지수로그함수와삼각함수의극한의활용_고2_유형은행1/q02-problem.plan.json` | q2 | `OVERLAY_LINE_MISMATCH` | 원래 식과 최종 획의 기울기·절편을 대조한다. |
| e011 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_기말_중2_기출/q1-solution.plan.json` | q1 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| e012 | `archive/exams/similar/high/h2/1mid/24_순천여고_1학기_중간_고2_수학I_유사_plans/q07-solution.plan.json` | q7 | `OVERLAY_LINE_MISMATCH` | 원래 식과 최종 획의 기울기·절편을 대조한다. |
| e013 | `archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사2_plans/q04-solution.plan.json` | q4 | `NUMBER_LINE_LABELS_TOO_CLOSE` | 수직선 위 순서와 소유 점을 유지하며 라벨 높이 또는 간격을 조정한다. |
| e014 | `archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사2_plans/q05-solution.plan.json` | q5 | `NUMBER_LINE_LABELS_TOO_CLOSE` | 수직선 위 순서와 소유 점을 유지하며 라벨 높이 또는 간격을 조정한다. |
| e015 | `archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사2_plans/q06-solution.plan.json` | q6 | `NUMBER_LINE_LABELS_TOO_CLOSE` | 수직선 위 순서와 소유 점을 유지하며 라벨 높이 또는 간격을 조정한다. |
| e016 | `archive/exams/similar/middle/m3/1mid/26_연향중_1학기_중간_중3_유사2_plans/q03-solution.plan.json` | q3 | `NUMBER_LINE_LABELS_TOO_CLOSE` | 수직선 위 순서와 소유 점을 유지하며 라벨 높이 또는 간격을 조정한다. |
| e022 | `archive/tools/geometry-equation/production/plans/21_왕운중_2학기_중간_중2_수학/q24-solution.plan.json` | q24 | `PATH_LABEL_NO_ROOM` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e023 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q19-solution.plan.json` | q19 | `DIMENSION_TOO_SHORT:dGpD` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e024 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q19-solution.plan.json` | q19 | `REGION_LEADER_NO_INNER_SPOT` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e025 | `archive/tools/geometry-equation/production/plans/19_왕운중_2학기_기말_중3_기출/q5-solution-v2.plan.json` | q5 | `ANGLE_LABEL_TOO_FAR` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e026 | `archive/tools/geometry-equation/production/plans/20_신흥중_2학기_기말_중3_기출/q3-solution.plan.json` | q3 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e027 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_기말_중2_기출/q13-solution.plan.json` | q13 | `SET_LABEL_NO_ROOM` | 집합 이름과 자기 영역의 소유 관계를 유지하는 배치를 찾는다. |
| e028 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중1_기출/q24-solution.plan.json` | q24 | `PATH_LABEL_NO_ROOM` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e029 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중1_기출/q24-problem.plan.json` | q24 | `PATH_LABEL_NO_ROOM` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e031 | `archive/tools/geometry-equation/production/plans/23_신흥중_2학기_기말_중2_기출/q12-solution.plan.json` | q12 | `REGION_LEADER_NO_INNER_SPOT` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e032 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_P94-97_20261023_유사50/q04-solution.plan.json` | qBV-BAKBAL-H-COM2-P94-Q02-T1-R2 | `LINE_MISSING` | 필수 선분과 최종 SVG 획을 소유 ID별로 대조한다. |
| e034 | `archive/exams/similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사3_plans/q04-solution.plan.json` | q4 | `SET_LABEL_NO_ROOM` | 집합 이름과 자기 영역의 소유 관계를 유지하는 배치를 찾는다. |
| e035 | `archive/tools/geometry-equation/production/plans/비상_미적분1_함수의극한과연속_익힘책_고2/q21-solution.plan.json` | q21 | `MEASURED_OWNER_LAYOUT_VORONOI_BOX_FAIL` | 해당 단계의 실패 상세를 재현하고 원문 조건과 렌더 계약을 대조한다. |
| e036 | `archive/tools/geometry-equation/production/plans/비상_대수_수열_익힘책_고2/q26-solution.plan.json` | q26 | `MISSING_KOREAN_GLYPH` | 글꼴 매핑과 브라우저의 조판 상태를 확인한다. |
| e037 | `archive/tools/geometry-equation/production/plans/비상_기하_이차곡선_익힘책_고2/q14-solution.plan.json` | q14 | `LABEL_TOO_FAR` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e038 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_함수와그래프_대단원학습평가_고1/q05-solution-composition.plan.json` | qqid_v1_eb0e28e5b618598bcba08bd35a3e8028e195ccbae0ac791b1f67cd86f20fe4a8 | `MISSING_KOREAN_GLYPH` | 글꼴 매핑과 브라우저의 조판 상태를 확인한다. |
| e039 | `archive/tools/geometry-equation/production/plans/1학기_중간평가_중1_단원평가유사1/q05-solution.plan.json` | q5 | `PUBLICATION_TEXT_NOT_READY` | 글꼴 매핑과 브라우저의 조판 상태를 확인한다. |
| e040 | `archive/tools/geometry-equation/production/plans/1학기_중간평가_중1_단원평가유사2/q14-solution.plan.json` | q14 | `PUBLICATION_TEXT_NOT_READY` | 글꼴 매핑과 브라우저의 조판 상태를 확인한다. |
| e042 | `archive/tools/geometry-equation/production/plans/비상_공통수학1_여러가지방정식과부등식_중단원학습점검_고1/q07-solution.plan.json` | q7 | `NUMBER_LINE_LABEL_TOO_LARGE` | 해당 라벨의 실측 높이와 수직선 행의 예약 공간을 대조한다. |
| e043 | `archive/tools/geometry-equation/production/plans/AP수학학원_1학기_기말_중1_기말고사/q23-solution.plan.json` | q23 | `NUMBER_LINE_LABELS_TOO_CLOSE` | 수직선 위 순서와 소유 점을 유지하며 라벨 높이 또는 간격을 조정한다. |
| e045 | `archive/tools/geometry-equation/production/plans/18_연향중_1학기_기말_중2_유사/q19-solution.plan.json` | q19 | `NUMBER_LINE_LABEL_TOO_LARGE` | 해당 라벨의 실측 높이와 수직선 행의 예약 공간을 대조한다. |
| e046 | `archive/tools/geometry-equation/production/plans/비상_미적분1_함수의극한과연속_익힘책_고2/q15-solution-sum.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e047 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_집합과명제_대단원학습평가_고1/q05-solution.plan.json` | qqid_v1_2b8c59e1f2ab4fddbc663f3d0086e6ea34d27e5ec0086095bbc1dca15f32b224 | `LABEL_GEOMETRY_COLLISION` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| e048 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/q13-solution-minus1.plan.json` | q13 | `LINE_MISSING` | 필수 선분과 최종 SVG 획을 소유 ID별로 대조한다. |
| e049 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/q13-solution-plus2.plan.json` | q13 | `LINE_MISSING` | 필수 선분과 최종 SVG 획을 소유 ID별로 대조한다. |
| e050 | `archive/tools/geometry-equation/production/plans/20_왕의중_2학기_기말_중2_기출/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e051 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중2_기출/q22-solution.plan.json` | q22 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e052 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q09-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e053 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e054 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e055 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q13-solution.plan.json` | q13 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e056 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e057 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e058 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q17-solution.plan.json` | q17 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e059 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q20-solution.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e060 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| e061 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q24-solution.plan.json` | q24 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
