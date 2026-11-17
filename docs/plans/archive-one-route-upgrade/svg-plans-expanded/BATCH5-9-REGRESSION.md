# 저장 batch5~9 공식 부분검사 회귀

- 범위: 저장 사본 240 plan. 원격 및 기존 plan 사본을 직접 변경하지 않음.
- 공식 전처리 포함 결과 219 PASS, 21 FAIL. 수직선 wrapper 35건 및 벡터 전처리 1건은 검사기 오탐을 제거했다.
- construction은 expandPlaneVectors→조건바인딩→construction math→phase2.specFor, 그래프는 frame_graph→graph→phase2.specFor. 수직선은 expandNumberLineFigure→compositePanels→solveNumberLineFigure→numberLineFigureSpec. 통계는 checkStatChartPlan→solveStatChart, 입체는 solveSolidFigure→solidFigureSpec.
- 실제 실패: batch5 비상대수 사인코사인법칙 유형심화/확인 Q16 SOURCE_POINT O 표시 누락 2건; batch7 복성고 수학II Q14 축제목 V/π 허용문자 위반 1건; batch6·9 통계18건 불허 최상위 accessibilityDescription.
- 통계 실제 호출경로 render-plan.mjs125행 checkStatChartPlan(authored)에 필터 없이 전달된다. stat-chart-v1.mjs1788행 허용키 목록에 accessibilityDescription이 없어 실제로 렌더 진입 전에 실패한다. 엔진/기준 완화하지 않았다.
- 통계18개는 accessibilityDescription과 caption이 정확히 같은지 확인 후 불허 키만 삭제. 검수 기록에 전후 해시와 정확 경로를 보존했다.
- 추가 3개 최소보완과 함께 독립 재검: 21/21 PASS. 통계18개는 추가로 statChartSpec까지 통과. 정확 결과 BATCH5-9-REGRESSION-CHECK.json.
- full render 및 새 PNG 시각검수 NOT_RUN. 부분검사 결과를 렌더통과로 표기하지 않음. 이 보고와 계획21개만 지정 결과 브랜치에 저장하며 기존 원문·SVG·엔진·검사기는 변경하지 않는다.
