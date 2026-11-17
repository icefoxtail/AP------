# Batch65: 한 문항 여러 플랜을 composite 한 장으로 통합

- 78문항, 시험지 40개. 종류: PLANE 10, SET 38, GRAPH2 24, STAT 3, MULTI2 1, NL 2.
- 옛 `-1/-2/...` 플랜은 `history/batch65-composite/`로 옮겼고 `qN-solution.json` 하나만 남겼다. 정답 숨김은 쓰지 않았다.
- 패널 제목은 옛 플랜 caption에서 기계적으로 뽑았다(한글·ASCII 16자 이내, 못 뽑으면 "경우 k"). 공장 렌더 결과를 보고 고친다.
- 대표 표본 렌더(집합·그래프 2패널·수직선 줄 합치기·다중곡선 2패널·통계 2패널)는 ARCHIVE_BOUND였다. 평면도형 일부는 라벨 자리 부족(LAYOUT_INVENTORY_INCOMPLETE)이 나올 수 있어 공장 결과를 기다린다.
- 합칠 수 없는 문항(종류 혼합, 수직선 4줄 초과, 축 있는 작도, 3패널 이상 그래프 등)은 `COMPOSITE-HOLD.tsv`에 남긴다.
