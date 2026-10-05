# 함수·유리함수·무리함수 dense sampling audit v2

- 상태: **DENSE_SAMPLING_PASS**
- graph cases: 135
- rational graph cases: 57
- curve branches: 254
- nonlinear curve branches: 254
- cases PASS/FAIL: 135/0
- below 200 points: 0
- rational/asymptote below 300 points: 0
- undefined/non-finite or serialization failures: 0

검증 대상 SVG를 다시 읽어 실제 `<polyline points>`의 pair 수를 ledger의 curveSampleCounts와 비교했다. 일반 curve는 200점 이상, RATIONAL_GRAPH curve는 300점 이상이며 직선·선분 primitive는 curve density 대상에서 제외했다.
