# 22 효천고 2학기 중간 고1 q9 독립 재검산

## 변경 확인

- 대상 production JS: archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js
- 대상 문항: id=9
- 발문에서 $Q≠∅$ 조건 제거: YES
- 선택지 순서와 내용: 유지
- standardUnitKey: H15-SB-02 유지
- subUnitKey: H15-SB-02-NECESSARY_SUFFICIENT 유지
- answer: ⑤ 유지

## 진리집합 독립 검산

q가 ~p이기 위한 충분조건이지만 필요조건은 아니므로

    Q ⊆ P^c
    Q ≠ P^c

이다. 따라서 P∩Q=∅이다.

| 보기 | 항상 성립 여부 | 논리 근거 |
|---|---|---|
| ① P-Q=P | 참 | P와 Q가 서로소이므로 P에서 Q를 빼도 P가 남는다. |
| ② P∩Q=∅ | 참 | Q⊆P^c와 동치인 관계이다. |
| ③ Q-P=Q | 참 | P와 Q가 서로소이므로 Q에서 P를 빼도 Q가 남는다. |
| ④ P⊆Q^c | 참 | P∩Q=∅이므로 P의 모든 원소는 Q^c에 속한다. |
| ⑤ P∪Q=P | 거짓(항상 성립하지 않음) | 반례 U={1,2,3}, P={1}, Q={2}에서 P^c={2,3}이므로 조건을 만족하지만 P∪Q={1,2}≠P이다. |

⑤는 모든 경우에 참이라고 할 수 없으므로 옳지 않은 것은 ⑤이다. 공집합을 별도로 가정하지 않아도 이 반례로 정답이 결정된다.

## 기계 재검산 결과

    EXTRA_Q_NONEMPTY_CONDITION_REMOVED = YES
    ANSWER = ⑤
    ANSWER_MATCH = PASS
    SOLUTION_HAS_COUNTEREXAMPLE = YES
    SOLUTION_HAS_BANNED_STUDENT_PHRASES = NO
    INDEPENDENT_RECHECK = PASS

해설에는 학생이 판단해야 할 집합 관계와 반례만 포함되어 있으며, 금지된 운영 문구는 포함하지 않았다.
