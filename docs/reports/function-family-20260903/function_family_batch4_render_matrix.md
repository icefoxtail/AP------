# 함수 계열 그래프 업그레이드 Batch 4 렌더 매트릭스

Batch 4의 10문항에 연결한 해설 SVG를 7개 영향 시험지의 production engine에서 확인했다. 각 시험지는 마지막 문항 표시까지 polling했고, 깨진 이미지와 `apRenderError`를 확인했다.

| 영향 시험지 | exam | solution | answer | broken image | render error |
|---|---|---|---|---:|---|
| 25 금당고 2학기 기말 | PASS / q22 | PASS / q09,q15 SVG loaded | PASS / 1 page | 0 | none |
| 25 팔마고 2학기 기말 | PASS / q23 | PASS / q14 SVG loaded | PASS / 1 page | 0 | none |
| 24 매산여고 2학기 기말 | PASS / q22 | PASS / q03,q05,q07 SVG loaded | PASS / 1 page | 0 | none |
| 23 강남여고 2학기 기말 | PASS / q24 | PASS / q06 SVG loaded | PASS / 1 page | 0 | none |
| 23 금당고 2학기 기말 | PASS / q21 | PASS / q20 SVG loaded | PASS / 1 page | 0 | none |
| 24 금당고 2학기 기말 | PASS / q21 | PASS / q18 SVG loaded | PASS / 1 page | 0 | none |
| 25 제일고 2학기 기말 | PASS / q22 | PASS / q14 SVG loaded | PASS / 1 page | 0 | none |

정적 SVG 검증은 generator의 함수식 표본점·점근선·교점 수치 검증과 XML/viewBox/fact hash/금지 토큰 검사로 수행했다. 이 매트릭스는 Batch 4 영향 시험지의 증거이며 전체 50개 시험지 최종 봉인을 대체하지 않는다.
