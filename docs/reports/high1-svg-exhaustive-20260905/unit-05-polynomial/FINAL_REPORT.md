# Unit 05 — 다항식의 연산 전수 검수

- 상태: `COMPLETE_FOR_HANDOFF`
- 대상 key: H15-SA-01, H22-C-01
- 원본 문항: **78**
- source files: **25**
- visual assets at intake: **0**
- source-only reviewed: **78/78**
- source holds: **0**
- polynomial-scope protected diff at intake: **0**

대부분이 식 계산형 문항으로 visual dependency를 source-only 검토한다. inline SVG가 있는
25_강남여고 q16은 XML/viewBox/금지 노드/external ref 검증을 통과했다.

기존 4건 모두 현재 source를 다시 확인해 독립 재계산으로 해소했다. 25_순천여고
1학기 중간 q3는 D드라이브 원본 PDF에서 원문과 정답표를 복구했다.
원문은 $A=x^{2}-xy+2y^{2}$, $B=x^{2}+xy+y^{2}$, $C=x^{2}-y^{2}$의 연산에서
$xy$ 계수를 묻고, $(A+2B)-(B+C)=x^{2}+4y^{2}$이므로 계수는 0, 정답표는 ③이다.
기존 조립제법 source hold와 유사문제 전환 기록은 superseded 처리하고 원본 source를
정정했다.

근거: [D-drive source recovery](08_source_recovery_q3_d_drive.json)
