# 함수 계열 그래프 업그레이드 Batch 3 렌더 매트릭스

Batch 3의 8문항에 연결한 해설 SVG와 해당 시험지 전체의 production engine 표시를 확인했다. 마지막 문항 표시까지 polling으로 확인했으며, `broken image=0`, `apRenderError=없음`을 기록했다.

| examId | exam | solution | answer | last question | broken image | render error |
|---|---|---|---|---|---:|---|
| `24_금당고_2학기_기말_고1_기출` | PASS / 8 pages | PASS / 8 pages / q10,q11,q16 SVG loaded | PASS / 1 page | q21 | 0 | none |
| `25_금당고_2학기_기말_고1_기출` | PASS / 6 pages | PASS / 6 pages / q22 SVG loaded | PASS / 1 page | q22 | 0 | none |
| `25_팔마고_2학기_기말_고1_기출` | PASS / 6 pages | PASS / 9 pages / q23 SVG loaded | PASS / 1 page | q23 | 0 | none |
| `25_제일고_2학기_기말_고1_기출` | PASS / 6 pages | PASS / 7 pages / q20 SVG loaded | PASS / 1 page | q22 | 0 | none |
| `23_강남여고_2학기_기말_고1_기출` | PASS / 7 pages | PASS / 7 pages / q24 SVG loaded | PASS / 1 page | q24 | 0 | none |
| `24_매산여고_2학기_기말_고1_기출` | PASS / 6 pages | PASS / 6 pages / q23 SVG loaded | PASS / 1 page | q22 | 0 | none |

정적 SVG 검증은 generator의 수치 fact check와 XML/viewBox/fact hash/금지 토큰 검사로 수행했다. 이 매트릭스는 Batch 3 영향 시험지의 증거이며 전체 50개 시험지 최종 봉인을 대체하지 않는다.
