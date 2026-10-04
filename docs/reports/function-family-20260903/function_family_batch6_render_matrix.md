# 함수 계열 그래프 업그레이드 Batch 6 렌더 매트릭스

Batch 6의 9문항에 연결한 해설 SVG를 6개 영향 시험지의 production engine 해설 모드에서 확인했다. 각 시험지는 마지막 문항 표시까지 polling했고, 새 SVG의 natural size, broken image, `apRenderError`를 확인했다.

| 영향 시험지 | solution | 새 SVG | 마지막 문항 | broken image | render error |
|---|---|---:|---|---:|---|
| 21 효천고 2학기 기말 | PASS / q11 SVG loaded | 1 | q22 | 0 | none |
| 21 팔마고 2학기 기말 | PASS / q03,q04 SVG loaded | 2 | q21 | 0 | none |
| 21 제일고 2학기 기말 | PASS / q04,q05 SVG loaded | 2 | q22 | 0 | none |
| 21 순천고 2학기 기말 | PASS / q08,q11,q18 SVG loaded | 3 | q22 | 0 | none |
| 21 복성고 2학기 기말 | PASS / q03,q04,q12 SVG loaded | 3 | q23 | 0 | none |
| 21 강남여고 2학기 기말 | PASS / q03,q17 SVG loaded | 2 | q29 | 0 | none |

정적 SVG 검증은 generator의 함수식 표본점·점근선·교점 수치 검증과 XML/viewBox/fact hash/금지 토큰 검사로 수행했다. 이 매트릭스는 Batch 6 영향 시험지의 증거이며 전체 50개 시험지 최종 봉인을 대체하지 않는다.
