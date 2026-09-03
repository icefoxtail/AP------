# 함수 계열 그래프 업그레이드 Batch 5 렌더 매트릭스

Batch 5의 10문항에 연결한 해설 SVG를 7개 영향 시험지의 production engine 해설 모드에서 확인했다. 각 시험지는 마지막 문항 표시까지 polling했고, 새 SVG의 natural size, broken image, `apRenderError`를 확인했다.

| 영향 시험지 | solution | 새 SVG | 마지막 문항 | broken image | render error |
|---|---|---|---|---:|---|
| 25 효천고 2학기 기말 | PASS / q08,q11 SVG loaded | 2 | q23 | 0 | none |
| 25 팔마고 2학기 기말 | PASS / q11 SVG loaded | 1 | q23 | 0 | none |
| 21 복성고 2학기 기말 | PASS / q03 SVG loaded | 1 | q23 | 0 | none |
| 21 강남여고 2학기 기말 | PASS / q03 SVG loaded | 1 | q24 | 0 | none |
| 21 순천고 2학기 기말 | PASS / q08,q11 SVG loaded | 2 | q22 | 0 | none |
| 21 금당고 2학기 기말 | PASS / q04,q08 SVG loaded | 2 | q22 | 0 | none |
| 21 팔마고 2학기 기말 | PASS / q05 SVG loaded | 1 | q21 | 0 | none |

`exam / answer` 모드는 동일 source payload에서 기존 batch의 전체 표시 검증을 계승할 수 있는 영향 범위로 기록했다. 해설 자산이 새로 추가된 현재 파일은 solution mode에서 직접 확인했다. 전체 50개 시험지 최종 봉인은 별도 Render Matrix와 사용자 독립 검수 후 진행한다.
