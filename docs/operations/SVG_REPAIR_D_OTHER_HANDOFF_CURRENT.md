# D라인 기타 레이아웃 후속 작업 장부

기준 SHA는 `d9f517af14c01ebf154890d541d6771fc74fe8fa`이다. 수리 커밋은 `681be35249638a0f57358df8a4130cf9f1f923a1`이며, 이 장부는 기준판과 수리판을 공식 엔진으로 실행한 결과를 정리한다.

전체 149건 중 `ARCHIVE_BOUND` 13건이다. 공식 lint는 147건 통과, 2건 실패다. 검증된 신규 SVG 경로 12개를 수리 커밋에 넣었다.

## 다음 작업

정확한 성공 판정에는 lint와 `render-plan.mjs --accept-scored 1`을 사용한다. 아래 표의 렌더 상태와 운영 자산 상태를 확인해 이어받는다.

| 항목 | Plan 경로 | 문항 | 렌더 또는 자산 상태 | 다음 조치 |
| --- | --- | --- | --- | --- |
| d001 | `archive/tools/geometry-equation/production/plans/기하_013_두포물선이이루는선분의길이_고2_유형은행1/q05-problem.plan.json` | q5 | `LEADER_CROSSING` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| d003 | `archive/tools/geometry-equation/production/plans/기하_022_타원의자취의방정식_고2_유형은행1/q02-problem.plan.json` | q2 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d004 | `archive/tools/geometry-equation/production/plans/기하_024_타원의정의의활용-삼각형의둘레의길이와장_고2_유형은행1/q02-problem.plan.json` | q2 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d005 | `archive/tools/geometry-equation/production/plans/기하_031_타원의정의를이용한거리의합의최대최소_고2_유형은행1/q03-problem.plan.json` | q3 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d006 | `archive/tools/geometry-equation/production/plans/기하_034_타원과포물선_고2_유형은행1/q06-problem.plan.json` | q6 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d007 | `archive/tools/geometry-equation/production/plans/기하_046_쌍곡선의방정식-타원과쌍곡선의초점을공유_고2_유형은행1/q03-problem.plan.json` | q3 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d009 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q01-problem.plan.json` | q1 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d010 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q02-problem.plan.json` | q2 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d011 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q03-problem.plan.json` | q3 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d012 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q04-problem.plan.json` | q4 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d013 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q05-problem.plan.json` | q5 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d014 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q06-problem.plan.json` | q6 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d015 | `archive/tools/geometry-equation/production/plans/기하_050_쌍곡선의정의의활용-직각삼각형사각형의넓_고2_유형은행1/q07-problem.plan.json` | q7 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d016 | `archive/tools/geometry-equation/production/plans/기하_052_쌍곡선의정의를이용한거리의합의최대최소_고2_유형은행1/q05-problem.plan.json` | q5 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d017 | `archive/tools/geometry-equation/production/plans/기하_061_포물선의접선의방정식의활용-접점이미지수_고2_유형은행1/q04-problem.plan.json` | q4 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d018 | `archive/tools/geometry-equation/production/plans/기하_063_포물선의접선의성질_고2_유형은행1/q02-problem.plan.json` | q2 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d019 | `archive/tools/geometry-equation/production/plans/기하_148_직선과평면의수직관계-빈칸추론_고2_유형은행1/q04-problem.plan.json` | q4 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d020 | `archive/tools/geometry-equation/production/plans/기하_151_삼수선의정리2_고2_유형은행1/q03-problem.plan.json` | q3 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d021 | `archive/tools/geometry-equation/production/plans/기하_152_삼수선의정리의활용-삼각형의넓이_고2_유형은행1/q06-problem.plan.json` | q6 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d022 | `archive/tools/geometry-equation/production/plans/기하_154_삼수선의정리의활용-서로직교하는세선분_고2_유형은행1/q07-problem.plan.json` | q7 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d023 | `archive/tools/geometry-equation/production/plans/기하_157_두평면이이루는각-이면각의크기구하기1_고2_유형은행1/q01-problem.plan.json` | q1 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d024 | `archive/tools/geometry-equation/production/plans/기하_157_두평면이이루는각-이면각의크기구하기1_고2_유형은행1/q03-problem.plan.json` | q3 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d025 | `archive/tools/geometry-equation/production/plans/기하_157_두평면이이루는각-이면각의크기구하기1_고2_유형은행1/q07-problem.plan.json` | q7 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d026 | `archive/tools/geometry-equation/production/plans/기하_160_정사영의길이_고2_유형은행1/q04-problem.plan.json` | q4 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d027 | `archive/tools/geometry-equation/production/plans/기하_161_정사영의길이-각의크기구하기_고2_유형은행1/q02-problem.plan.json` | q2 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d028 | `archive/tools/geometry-equation/production/plans/기하_162_교선에수직이아닌정사영의길이_고2_유형은행1/q01-problem.plan.json` | q1 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d029 | `archive/tools/geometry-equation/production/plans/기하_163_정사영의넓이1_고2_유형은행1/q01-problem.plan.json` | q1 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d030 | `archive/tools/geometry-equation/production/plans/기하_164_두평면의교선이주어질때-두평면의이면각을_고2_유형은행1/q08-problem.plan.json` | q8 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d031 | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q02-problem.plan.json` | q2 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d032 | `archive/tools/geometry-equation/production/plans/기하_168_정육면체에서정사영을이용하여이면각의크기_고2_유형은행1/q06-problem.plan.json` | q6 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d033 | `archive/tools/geometry-equation/production/plans/기하_177_정사각뿔의활용_고2_유형은행1/q03-problem.plan.json` | q3 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d034 | `archive/tools/geometry-equation/production/plans/기하_186_선분의길이와합의최솟값2_고2_유형은행1/q02-problem.plan.json` | q2 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d044 | `archive/tools/geometry-equation/production/plans/미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1/q04-problem.plan.json` | q4 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d045 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_P94-97_20261023_유사50/q10-problem.plan.json` | qBV-BAKBAL-H-COM2-P94-Q04-T1-R2 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d046 | `archive/exams/similar/high/h1/1mid/24_금당고_1학기_중간_고1_유사_plans/q13-solution.plan.json` | q13 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d047 | `archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사2_plans/q19-solution.plan.json` | q19 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d048 | `archive/exams/similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제_plans/q07-solution.plan.json` | q7 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d050 | `archive/exams/similar/middle/m1/2final/23_연향중_2학기_기말_중1_유사_plans/q15-problem.plan.json` | q15 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d051 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q24-solution.plan.json` | q24 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d052 | `archive/exams/similar/high/h2/1mid/21_순천고_1학기_중간_고2_수학I_유사_plans/q18-solution.plan.json` | q18 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d053 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3_plans/q08-solution.plan.json` | q8 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d054 | `archive/tools/geometry-equation/production/plans/21_향림중_2학기_중간_중3_수학/q20-solution.plan.json` | q20 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d055 | `archive/tools/geometry-equation/production/plans/20_신흥중_2학기_중간_중3_수학/q14-problem.plan.json` | q14 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d056 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q26-solution.plan.json` | q26 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d057 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중2_수학/q23-problem.plan.json` | q23 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d058 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d059 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중2_수학/q10-problem.plan.json` | q10 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d060 | `archive/tools/geometry-equation/production/plans/20_신흥중_2학기_중간_중3_수학/q14-solution.plan.json` | q14 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d061 | `archive/tools/geometry-equation/production/plans/22_매산중_2학기_중간_중3_수학/q23-solution.plan.json` | q23 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d062 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q26-problem.plan.json` | q26 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d063 | `archive/tools/geometry-equation/production/plans/19_이수중_2학기_중간_중3_수학/q23-solution.plan.json` | q23 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d064 | `archive/tools/geometry-equation/production/plans/25_금당중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d065 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q21-solution.plan.json` | q21 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d066 | `archive/tools/geometry-equation/production/plans/19_동산여중_2학기_기말_중3_수학/q01-problem-v3.plan.json` | qq01 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d067 | `archive/tools/geometry-equation/production/plans/19_동산여중_2학기_기말_중3_수학/q01-solution-v2.plan.json` | qq01 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d068 | `archive/tools/geometry-equation/production/plans/19_동산여중_2학기_기말_중3_수학/q01-solution-v3.plan.json` | qq01 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d069 | `archive/tools/geometry-equation/production/plans/21_왕의중_2학기_기말_중3_수학/q18-solution.plan.json` | qq18 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d070 | `archive/tools/geometry-equation/production/plans/21_왕의중_2학기_기말_중3_수학/q19-solution.plan.json` | qq19 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d071 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_기말_중3_기출/q19-problem.plan.json` | q19 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d072 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_기말_중3_기출/q20-problem.plan.json` | q20 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d073 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_기말_중2_기출/q21-solution.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| d074 | `archive/tools/geometry-equation/production/plans/20_이수중_2학기_기말_중2_수학/q4-solution.plan.json` | q4 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d075 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중2_기출/q22-solution.plan.json` | q22 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d076 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q22-problem.plan.json` | q22 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d077 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q22-solution.plan.json` | q22 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d078 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q3-problem.plan.json` | q3 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d079 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q3-solution.plan.json` | q3 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d080 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q4-problem.plan.json` | q4 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d081 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q4-solution.plan.json` | q4 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d082 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q5-problem.plan.json` | q5 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d083 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q5-solution.plan.json` | q5 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d084 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q6-problem.plan.json` | q6 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d085 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q6-solution.plan.json` | q6 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d086 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q7-problem.plan.json` | q7 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d087 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q7-solution.plan.json` | q7 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d088 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q8-problem.plan.json` | q8 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d089 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q8-solution.plan.json` | q8 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d090 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q9-problem.plan.json` | q9 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d091 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q9-solution.plan.json` | q9 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d092 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q25-problem.plan.json` | q25 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d093 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q25-solution.plan.json` | q25 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d094 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q11-problem.plan.json` | q11 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d095 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q14-problem.plan.json` | q14 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d096 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q19-problem.plan.json` | q19 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d097 | `archive/tools/geometry-equation/production/plans/22_향림중_2학기_기말_중3_기출/q19-solution.plan.json` | q19 | `ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL` | 원본 시험의 수식 조판 완료 상태와 미조판 요소를 확인한다. |
| d098 | `archive/tools/geometry-equation/production/plans/23_순천여중_2학기_기말_중3_기출/q20-solution.plan.json` | q20 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d099 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q18-problem.plan.json` | q18 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d100 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q18-solution.plan.json` | q18 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d101 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q20-problem.plan.json` | q20 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d102 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q20-solution.plan.json` | q20 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d103 | `archive/tools/geometry-equation/production/plans/23_연향중_2학기_기말_중3_기출/q24-problem.plan.json` | q24 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d104 | `archive/tools/geometry-equation/production/plans/23_순여중_2학기_기말_중3_기출/q20-problem.plan.json` | q20 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d105 | `archive/tools/geometry-equation/production/plans/23_순여중_2학기_기말_중3_기출/q20-solution.plan.json` | q20 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d106 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_기말_중2_기출/q17-solution.plan.json` | q17 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d107 | `archive/tools/geometry-equation/production/plans/25_풍덕중_2학기_기말_중3_기출/q24-problem.plan.json` | q24 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d108 | `archive/tools/geometry-equation/production/plans/25_풍덕중_2학기_기말_중3_기출/q24-solution.plan.json` | q24 | `STAT_LABEL_OUT_OF_BOUNDS` | 라벨의 실측 바깥 방향에 필요한 여백을 반영한다. |
| d109 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_기말_중2_기출/q06-problem.plan.json` | q6 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d110 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_기말_중2_기출/q06-solution.plan.json` | q6 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d111 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q34-solution.plan.json` | qBV-BAKBAL-H-COM2-P140-Q12-S1-R1 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d112 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P146-149_20261023_유사50/q34-solution.plan.json` | qBV-BAKBAL-H-COM2-P148-Q12-S1-R1 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d113 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P142-145_20261023_유사50/q19-solution.plan.json` | qBV-BAKBAL-H-COM2-P143-Q07-T1-R1 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d114 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P142-145_20261023_유사50/q05-solution.plan.json` | qBV-BAKBAL-H-COM2-P142-Q02-S1-R1 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d115 | `archive/tools/geometry-equation/production/plans/26_왕운중_2학기_중간_중2_기출/q24-problem.plan.json` | q24 | `TEXT_CLIPPED` | 실측 글자 상자와 SVG 경계를 대조하여 라벨 위치나 여백을 보강한다. |
| d116 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q01-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q01-T1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d117 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q02-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q01-S1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d118 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q03-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q01-S2-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d119 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q04-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q02-T1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d120 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q05-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q02-S1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d121 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q06-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q02-S2-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d122 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q07-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q03-T1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d123 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q08-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q03-S1-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d124 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_집합과명제_P138-141_20261023_유사50/q09-solution.plan.json` | qBV-BAKBAL-H-COM2-P138-Q03-S2-R1 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d125 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_P98-101_20261023_유사50/q11-solution.plan.json` | qBV-BAKBAL-H-COM2-P98-Q04-S1-R2 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d126 | `archive/tools/geometry-equation/production/plans/백발백중_공통수학2_도형의이동_P90-93_20261022_유사50/q15-solution.plan.json` | qBV-BAKBAL-H-COM2-P90-Q05-S2-R2 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d127 | `archive/tools/geometry-equation/production/plans/비상_확률과통계_통계_익힘책_고2/q14-solution.plan.json` | q14 | `STAT_LABELS_TOO_CLOSE` | 통계 표기 사이를 띄우고 수학 값과 대응 위치를 확인한다. |
| d128 | `archive/tools/geometry-equation/production/plans/비상_대수_지수함수와로그함수_중단원학습점검_고2/q11-solution.plan.json` | q11 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d129 | `archive/tools/geometry-equation/production/plans/비상_기하_이차곡선_대단원학습평가_고2/q02-problem.plan.json` | q2 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d130 | `archive/tools/geometry-equation/production/plans/비상_기하_이차곡선_대단원학습평가_고2/q02-solution.plan.json` | q2 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| d131 | `archive/tools/geometry-equation/production/plans/비상_기하_이차곡선_익힘책_고2/q02-solution.plan.json` | q2 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d132 | `archive/tools/geometry-equation/production/plans/비상_기하_이차곡선_익힘책_고2/q05-solution.plan.json` | q5 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d133 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터의연산_중단원학습점검_고2/q08-solution.plan.json` | q8 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d134 | `archive/tools/geometry-equation/production/plans/비상_기하_벡터_대단원학습평가_고2/q15-solution.plan.json` | q15 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d135 | `archive/tools/geometry-equation/production/plans/비상_기하_도형의방정식_중단원학습점검_고2/q08-solution.plan.json` | q8 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d136 | `archive/tools/geometry-equation/production/plans/비상_기하_도형의방정식_중단원학습점검_고2/q10-solution.plan.json` | q10 | `SOLID_LABELS_NO_ROOM` | 입체도형의 이름·치수 라벨 위치와 필요 여백을 조정한다. |
| d137 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1/q11-solution.plan.json` | qqid_v1_90beabb8e33f1068efd593cd02eedaca90aac60e54c1b2479dde764f8b6857cd | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d138 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_선분의내분과직선_중단원학습점검_고1/q06-solution.plan.json` | qqid_v1_728774a2314cfbdfa88a63449f9759677ca6746214dfaee5271d3af156849e1f | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d139 | `archive/tools/geometry-equation/production/plans/비상_공통수학1_방정식과부등식_익힘책_고1/q06-problem.plan.json` | q6 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d140 | `archive/tools/geometry-equation/production/plans/비상_미적분1_함수의극한과연속_대단원학습평가_고2/q12-solution.plan.json` | q12 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d141 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분_익힘책_고2/q22-solution.json` | q22 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d142 | `archive/tools/geometry-equation/production/plans/비상_미적분1_미분계수와도함수_중단원학습점검_고2/q14-solution.json` | q14 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d143 | `archive/tools/geometry-equation/production/plans/21_순천고_1학기_중간_고2_수학I_유사/q18-solution.plan.json` | q18 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d144 | `archive/tools/geometry-equation/production/plans/26_제일고_1학기_중간_고2_기하_유사/q17-solution.plan.json` | q17 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d145 | `archive/tools/geometry-equation/production/plans/26_제일고_1학기_중간_고2_기하_유사/q20-solution.plan.json` | q20 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d146 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_집합_중단원학습점검_고1/q11-solution.plan.json` | qqid_v1_4e7e9dff0e37f3b56d3041d4583aad5c8e2b737ddcd407afdcf8f6c3e4e05d58 | `SET_COUNT_LABEL_NO_ROOM` | 집합 영역의 원소 수 라벨이 해당 영역 안에서 읽히도록 배치한다. |
| d147 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/q12-solution.plan.json` | q12 | `TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL` | 최종 검사와 같은 간격을 만족하는 지시선 후보를 선택한다. |
| d148 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/q17-solution.plan.json` | q17 | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |
| d149 | `archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_익힘책_고1/q08-solution.plan.json` | qqid_v1_0c587370973c7d176eb219c11f5aa99f7771d53ba225fe222730eb1fd0f333bb | `ELLIPSE_LABEL_NO_ROOM` | 타원 라벨 앵커와 도형 안팎의 필수 공간을 재계산한다. |

## 표시 영역 사전검사

기준판 35건에서 파일명 차단 8건과 수식 조판 미완료 27건을 확인했다. 실제 시험지 파일명에 쓰인 ²·θ를 허용한 뒤 8건이 공식 렌더에서 통과했다. 조판 미완료 27건은 장부에 남겼다.

Archive 2.0 전체 검사에서 응답 시간 검사가 실패했다. 냉간 과목 선택과 첫 화면 시간 실패는 기준판에서도 재현했고, 일반 과목 선택과 원본 직접 열기 검사는 수리판에서 개별 재실행해 통과했다.
