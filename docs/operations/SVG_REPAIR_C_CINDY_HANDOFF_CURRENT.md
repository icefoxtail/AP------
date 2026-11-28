# C라인 Cindy 정확 유리수 후속 작업 장부

기준 SHA는 `d9f517af14c01ebf154890d541d6771fc74fe8fa`이다. 수리 커밋은 `c3518453e8bf14823ef1a512edff7a21ba6660b0`이며, 이 장부는 기준판과 수리판을 공식 엔진으로 실행한 결과를 정리한다.

전체 332건 중 `ARCHIVE_BOUND` 267건이다. 공식 lint는 332건 통과, 0건 실패다. 검증된 신규 SVG 경로 149개를 수리 커밋에 넣었다.

## 다음 작업

정확한 성공 판정에는 lint와 `render-plan.mjs --accept-scored 1`을 사용한다. 아래 표의 렌더 상태와 운영 자산 상태를 확인해 이어받는다.

| 항목 | Plan 경로 | 문항 | 렌더 또는 자산 상태 | 다음 조치 |
| --- | --- | --- | --- | --- |
| c002 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c003 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c004 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c005 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c016 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c019 | `archive/tools/geometry-equation/production/plans/21_금당중_2학기_중간_중3_수학/q07-problem.plan.json` | q7 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c020 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c030 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q10-problem.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c067 | `archive/tools/geometry-equation/production/plans/23_신흥중_2학기_중간_중2_수학/q09-solution.plan.json` | q9 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c071 | `archive/tools/geometry-equation/production/plans/23_신흥중_2학기_중간_중2_수학/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c072 | `archive/tools/geometry-equation/production/plans/23_신흥중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c075 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c076 | `archive/tools/geometry-equation/production/plans/19_동산중_2학기_중간_중2_수학/q24-solution.plan.json` | q24 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c077 | `archive/tools/geometry-equation/production/plans/20_풍덕중_2학기_중간_중2_수학/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c078 | `archive/tools/geometry-equation/production/plans/21_금당중_2학기_중간_중3_수학/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c079 | `archive/tools/geometry-equation/production/plans/21_금당중_2학기_중간_중3_수학/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c080 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q08-solution.plan.json` | q8 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c081 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c082 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c083 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c084 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q17-solution.plan.json` | q17 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c085 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c086 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q20-solution.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c087 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_중간_중3_수학/q21-solution.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c088 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중3_수학/q02-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c089 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중3_수학/q08-solution.plan.json` | q8 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c090 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_중간_중3_수학/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c091 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q04-solution.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c092 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c093 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q02-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c094 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q05-solution.plan.json` | q5 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c095 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q10-solution.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c096 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c097 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `IMMUTABLE_PREFLIGHT_CANDIDATE_EXISTS` | 같은 표시 배율의 측정이 중복되는 경로를 확인하고 기존 측정 결과를 재사용한다. |
| c098 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c099 | `archive/tools/geometry-equation/production/plans/20_금당중_2학기_중간_중2_수학/q22-solution.plan.json` | q22 | `IMMUTABLE_PREFLIGHT_CANDIDATE_EXISTS` | 같은 표시 배율의 측정이 중복되는 경로를 확인하고 기존 측정 결과를 재사용한다. |
| c100 | `archive/tools/geometry-equation/production/plans/20_왕의중_2학기_중간_중2_수학/q10-solution.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c101 | `archive/tools/geometry-equation/production/plans/20_왕의중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c102 | `archive/tools/geometry-equation/production/plans/22_신흥중_2학기_중간_중3_수학/q21-solution.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c103 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_중간_중3_수학/q09-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c104 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c105 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q06-problem.plan.json` | q6 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c106 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q07-problem.plan.json` | q7 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c107 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q11-problem.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c108 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q12-problem.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c109 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q14-problem.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c110 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q15-problem.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c111 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q18-problem.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c112 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q20-problem.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c113 | `archive/tools/geometry-equation/production/plans/21_이수중_2학기_중간_중2_수학/q21-problem.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c114 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중3_수학/q09-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c115 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중3_수학/q16-solution.plan.json` | q16 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c116 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c117 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중3_수학/q23-solution.plan.json` | q23 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c118 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c119 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q13-solution.plan.json` | q13 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c120 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `DIMENSION_LABEL_AMBIGUOUS_OWNER` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| c121 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c122 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q16-solution.plan.json` | q16 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c123 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q17-solution.plan.json` | q17 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c124 | `archive/tools/geometry-equation/production/plans/23_금당중_2학기_중간_중2_수학/q25-solution.plan.json` | q25 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c125 | `archive/tools/geometry-equation/production/plans/23_신흥중_2학기_중간_중2_수학/q21-solution.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c126 | `archive/tools/geometry-equation/production/plans/24_왕운중_2학기_중간_중2_수학/q04-problem.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c127 | `archive/tools/geometry-equation/production/plans/24_왕운중_2학기_중간_중2_수학/q18-problem.plan.json` | q18 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c128 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c129 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c130 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c131 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c132 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q16-solution.plan.json` | q16 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c133 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q17-solution.plan.json` | q17 | `REGION_LEADER_NO_INNER_SPOT` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| c134 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q18-solution.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c135 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c136 | `archive/tools/geometry-equation/production/plans/24_향림중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c137 | `archive/tools/geometry-equation/production/plans/24_신흥중_2학기_중간_중2_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c138 | `archive/tools/geometry-equation/production/plans/24_신흥중_2학기_중간_중2_수학/q20-solution.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c139 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c140 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c141 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q21-solution.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c142 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c143 | `archive/tools/geometry-equation/production/plans/24_연향중_2학기_중간_중2_수학/q5-problem.plan.json` | q5 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c144 | `archive/tools/geometry-equation/production/plans/24_매산중_2학기_중간_중2_수학/q10-problem.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c145 | `archive/tools/geometry-equation/production/plans/24_매산중_2학기_중간_중2_수학/q21-problem.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c146 | `archive/tools/geometry-equation/production/plans/24_매산중_2학기_중간_중2_수학/q22-problem.plan.json` | q22 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c147 | `archive/tools/geometry-equation/production/plans/26_삼산중_2학기_중간_중3_기출/q18-problem.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c148 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q16-solution.plan.json` | q16 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c149 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q18-solution.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c150 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q20-solution.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c151 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q14-problem.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c152 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c153 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q16-problem.plan.json` | q16 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c154 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q18-problem.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c155 | `archive/tools/geometry-equation/production/plans/25_연향중_2학기_중간_중2_수학/q20-problem.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c156 | `archive/tools/geometry-equation/production/plans/25_왕운중_2학기_중간_중2_수학/q08-problem.plan.json` | q8 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c157 | `archive/tools/geometry-equation/production/plans/25_왕운중_2학기_중간_중2_수학/q22-problem.plan.json` | q22 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c158 | `archive/tools/geometry-equation/production/plans/25_왕운중_2학기_중간_중2_수학/q22-solution.plan.json` | q22 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c159 | `archive/tools/geometry-equation/production/plans/25_왕운중_2학기_중간_중2_수학/q24-problem.plan.json` | q24 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c160 | `archive/tools/geometry-equation/production/plans/25_왕운중_2학기_중간_중2_수학/q24-solution.plan.json` | q24 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c161 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q1-solution.plan.json` | q1 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c162 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q2-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c163 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q4-solution.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c164 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q5-solution.plan.json` | q5 | `RIGHT_ANGLE_RAY_OWNER_MISMATCH` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| c165 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q6-solution.plan.json` | q6 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c166 | `archive/tools/geometry-equation/production/plans/21_팔마중_2학기_기말_중3_기출/q9-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c167 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q1-solution.plan.json` | q1 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c168 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q10-solution.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c169 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c170 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q2-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c171 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q21-solution.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c172 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q4-solution.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c173 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q6-solution.plan.json` | q6 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c174 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q7-solution.plan.json` | q7 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c175 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q8-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c176 | `archive/tools/geometry-equation/production/plans/21_풍덕중_2학기_기말_중3_기출/q9-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c177 | `archive/tools/geometry-equation/production/plans/23_풍덕중_2학기_기말_중3_기출/q13-problem.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c178 | `archive/tools/geometry-equation/production/plans/23_풍덕중_2학기_기말_중3_기출/q13-solution.plan.json` | q13 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c180 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중3_기출/q1-solution.plan.json` | q1 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c182 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중3_기출/q3-solution.plan.json` | q3 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c184 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중3_기출/q4-solution.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c186 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중3_기출/q5-solution.plan.json` | q5 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c188 | `archive/tools/geometry-equation/production/plans/22_연향중_2학기_기말_중3_기출/q6-solution.plan.json` | q6 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c190 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q1-solution.plan.json` | q1 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c192 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c194 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q11-solution.plan.json` | q11 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c196 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c198 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q2-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c200 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q20-solution.plan.json` | q20 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c202 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q21-solution.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c204 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q3-solution.plan.json` | q3 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c206 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q5-solution.plan.json` | q5 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c208 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q6-solution.plan.json` | q6 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c210 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q7-solution.plan.json` | q7 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c212 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q8-solution.plan.json` | q8 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c214 | `archive/tools/geometry-equation/production/plans/22_풍덕중_2학기_기말_중3_기출/q9-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c215 | `archive/tools/geometry-equation/production/plans/26_팔마중_2학기_중간_중2_기출/q21-problem.plan.json` | q21 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c216 | `archive/tools/geometry-equation/production/plans/20_제일고_1학기_중간_고2_수학I_유사/q18-problem.plan.json` | q18 | `POLICY_PROVENANCE_MISMATCH` | 측정 배율·후보 해시·렌더가 같은 측정 판본을 가리키는지 대조한다. |
| c217 | `archive/tools/geometry-equation/production/plans/20_제일고_1학기_중간_고2_수학I_유사/q18-solution.plan.json` | q18 | `DIMENSION_CROSSES_STROKE` | 오류를 반환한 라벨·지시선·표식의 소유 관계와 최종 배치를 대조한다. |
| c231 | `archive/tools/geometry-equation/production/plans/21_풍덕중_1학기_중간_중2_유사/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c236 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q10-solution.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c241 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q06-solution.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c242 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q07-solution.plan.json` | q7 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c244 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `POLICY_PROVENANCE_MISMATCH` | 측정 배율·후보 해시·렌더가 같은 측정 판본을 가리키는지 대조한다. |
| c247 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q19-solution.plan.json` | q19 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c251 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q06-problem.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c252 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q06-solution.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c268 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q02-problem.plan.json` | q2 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c269 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q02-solution.plan.json` | q2 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c273 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q06-problem.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c274 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q06-solution.plan.json` | q6 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c279 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q02-solution.plan.json` | q2 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c281 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q04-solution.plan.json` | q4 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c282 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q05-problem.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c283 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q05-solution.plan.json` | q5 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c286 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q09-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c287 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q10-problem.plan.json` | q10 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c289 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c291 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q13-solution.plan.json` | q13 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c292 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q14-problem.plan.json` | q14 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| c293 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q14-solution.plan.json` | q14 | `TARGET_HORIZONTAL_OVERFLOW` | 실측 모바일 너비와 해당 문항의 표시 영역을 대조하고 배치를 조정한다. |
| c295 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q17-solution.plan.json` | q17 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c297 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q18-solution.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c298 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q20-problem.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c299 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q20-solution.plan.json` | q20 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c301 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q22-solution.plan.json` | q22 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c302 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q23-problem.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c303 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q23-solution.plan.json` | q23 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c304 | `archive/tools/geometry-equation/production/plans/19_신흥중_2학기_중간_중2_수학/q7-solution.plan.json` | q7 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c312 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q14-problem.plan.json` | q14 | `POLICY_PROVENANCE_MISMATCH` | 측정 배율·후보 해시·렌더가 같은 측정 판본을 가리키는지 대조한다. |
| c315 | `archive/tools/geometry-equation/production/plans/19_연향중_2학기_중간_중2_수학/q19-problem.plan.json` | q19 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c318 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q10-solution.plan.json` | q10 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c319 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q12-solution.plan.json` | q12 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c320 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q14-solution.plan.json` | q14 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c321 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q15-solution.plan.json` | q15 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c322 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q16-solution.plan.json` | q16 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c323 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q18-solution.plan.json` | q18 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c324 | `archive/tools/geometry-equation/production/plans/21_신흥중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c325 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q07-solution.plan.json` | q7 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c326 | `archive/tools/geometry-equation/production/plans/21_연향중_2학기_중간_중3_수학/q09-solution.plan.json` | q9 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c327 | `archive/tools/geometry-equation/production/plans/21_동산중_2학기_중간_중3_수학/q19-solution.plan.json` | q19 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c328 | `archive/tools/geometry-equation/production/plans/21_동산중_2학기_중간_중3_수학/q24-solution.plan.json` | q24 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c329 | `archive/tools/geometry-equation/production/plans/21_동산중_2학기_중간_중3_수학/q25-solution.plan.json` | q25 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c330 | `archive/tools/geometry-equation/production/plans/21_매산중_2학기_중간_중3_수학/q08-solution.plan.json` | q8 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
| c331 | `archive/tools/geometry-equation/production/plans/21_매산중_2학기_중간_중3_수학/q21-solution.plan.json` | q21 | `PRESERVED_EXISTING` | 기존 SVG와 새 후보의 자산 연결·출처를 대조한 뒤 교체 여부를 결정한다. |
| c332 | `archive/tools/geometry-equation/production/plans/21_매산중_2학기_중간_중3_수학/q22-solution.plan.json` | q22 | `LAYOUT_INVENTORY_INCOMPLETE` | 미배치 라벨과 소유 도형을 확인하고 거리·지시선 후보를 재배치한다. |
