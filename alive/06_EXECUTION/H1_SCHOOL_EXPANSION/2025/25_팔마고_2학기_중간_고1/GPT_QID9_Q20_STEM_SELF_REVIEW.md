# 팔마고 2025 고1 2학기 중간 QID20 — GPT 제작자 역발문·자가검산

- 원본 소스: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`. QID20 원문은 총 30명 중 영어 17명·수학 20명의 **서술형 최솟값·최댓값**. 원본의 ‘마팔고’ 오탈자는 원본에만 유지하고 신규 학생 발문에는 복제하지 않음.
- 제작 9/9: A1~A3 STRICT_VARIANT / B1~C3 EXAM_FOLLOWUP. 원본과 같이 **모두 서술형**, `choices=[]`. 객관식 오답 4개/정답번호 분포는 NOT_APPLICABLE.
- 고정 Primary L3 `교집합과 합집합`, RPM `H1-RPM-238`. 기존 ACTIVE L4 `원소 개수`, PT `PT_SET_CARDINALITY`, TPL `TPL_OPERATION_CARDINALITY_COMPOSITE` 재사용. Generated L4 신규 정의 없음. 유효한 `COND_RANGE` 재사용 및 구체적인 조건 확장 3종 등록; CrossConcept 적용 없음.
- 각 UID에서 발문·조건·질문·응답형·실제 L3 사용·인위적 우회 풀이를 학생 문장 중심으로 역독해. 두 집합의 가능한 모든 교집합 정수 인원을 열거하여 네 영역이 음수가 아닌지, 부가 조건을 만족하는지, 최솟값·최댓값이 실제 구성 가능한지 확인. **KEEP 9 / REVISED 0 / HOLD 0**.

| 슬롯 | UID | 정답 | 가능한 교집합 인원 | 하한 구성 (모두/첫째만/둘째만/아무 쪽도 아님) | 상한 구성 | Reverse stem |
|---|---|---|---|---|---|---|
| A1 | ALITE-PALMA25-2MID-Q20-A1 | 최솟값 $8$명, 최댓값 $19$명 | 8~19 | 8/11/13/0 | 19/0/2/11 | KEEP |
| A2 | ALITE-PALMA25-2MID-Q20-A2 | 최솟값 $15$명, 최댓값 $24$명 | 15~24 | 15/9/16/0 | 24/0/7/9 | KEEP |
| A3 | ALITE-PALMA25-2MID-Q20-A3 | 최솟값 $7$명, 최댓값 $18$명 | 7~18 | 7/18/11/0 | 18/7/0/11 | KEEP |
| B1 | ALITE-PALMA25-2MID-Q20-B1 | 모두 속한 학생 $14$명, 미술 동아리에만 속한 학생 $13$명 | 14~14 | 14/13/15/6 | 14/13/15/6 | KEEP |
| B2 | ALITE-PALMA25-2MID-Q20-B2 | 최솟값 $11$명, 최댓값 $19$명 | 11~19 | 11/15/19/0 | 19/7/11/8 | KEEP |
| B3 | ALITE-PALMA25-2MID-Q20-B3 | 모두 속한 학생 $15$명, 어느 동아리에도 속하지 않은 학생 $2$명 | 15~15 | 15/8/13/2 | 15/8/13/2 | KEEP |
| C1 | ALITE-PALMA25-2MID-Q20-C1 | 최솟값 $15$명, 최댓값 $25$명 | 15~25 | 15/19/26/0 | 25/9/16/10 | KEEP |
| C2 | ALITE-PALMA25-2MID-Q20-C2 | 최솟값 $17$명, 최댓값 $23$명 | 17~23 | 17/15/12/6 | 23/9/6/12 | KEEP |
| C3 | ALITE-PALMA25-2MID-Q20-C3 | 최솟값 $8$명, 최댓값 $12$명 | 21~25 | 21/17/26/8 | 25/13/22/12 | KEEP |

## 제작 종료
- 최종 수학 증거는 각 UID의 `numericValidation`; 출제자 정답에 맞춰 뒤늦게 조건을 변경하지 않음. 오류 발견 시 해당 UID만 수정하고 영향받는 근거를 STALE로 처리하는 계약 유지.
- 문장만으로 학생 입력이 완결되어 새로운 학생용 SVG·PNG 불필요.
- 정식 독립 GPT 공개답 검수 **NOT_RUN**, 학생 Consumer/index **NOT_REGISTERED**, Chrome **NOT_TESTED**, 새 문항 main 출시 **NOT_DONE**. 작성자 자체검수와 학생 출시 품질인증을 혼동하지 않음.

