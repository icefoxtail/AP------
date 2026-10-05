# 함수 계열 그래프 업그레이드 Batch 2 렌더 매트릭스

검수 대상은 Batch 2에서 해설 SVG를 새로 연결한 시험지와, 같은 시험지의 전체 표시 영향이다. 각 시험지는 production `archive/engine.html`에서 마지막 문항 표시까지 polling으로 확인했다.

| examId | exam | solution | answer | last question | broken image | render error |
|---|---|---|---|---|---:|---|
| `24_금당고_2학기_기말_고1_기출` | PASS / 6 pages / q21 | PASS / 8 pages / q03,q05 SVG loaded | PASS / 1 page | q21 | 0 | none |
| `25_팔마고_2학기_기말_고1_기출` | PASS / 6 pages / q23 | PASS / 8 pages / q04,q06 SVG loaded | PASS / 1 page | q23 | 0 | none |
| `25_제일고_2학기_기말_고1_기출` | PASS / 6 pages / q22 | PASS / 7 pages / q11,q13 SVG loaded | PASS / 1 page | q22 | 0 | none |
| `23_강남여고_2학기_기말_고1_기출` | PASS / 7 pages / q24 | PASS / 7 pages / q05 SVG loaded | PASS / 1 page | q24 | 0 | none |
| `23_금당고_2학기_기말_고1_기출` | PASS / 6 pages / q21 | PASS / 7 pages / q07 SVG loaded | PASS / 1 page | q21 | 0 | none |
| `24_강남여고_2학기_기말_고1_기출` | PASS / 6 pages / q24 | PASS / 7 pages / q06 SVG loaded | PASS / 1 page | q24 | 0 | none |
| `25_순천고_2학기_기말_고1_기출` | PASS / 6 pages / q23 | PASS / 7 pages / q17,q18,q23 SVG loaded | PASS / 1 page | q23 | 0 | none |

정적 SVG 검증은 별도 generator의 수치 fact check, XML/viewBox/fact hash/금지 토큰 검사로 수행했다. 이 매트릭스는 해당 7개 시험지의 staging/working-tree 렌더 증거이며, 전체 50개 시험지 최종 봉인을 대체하지 않는다.
