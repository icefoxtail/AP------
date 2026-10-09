# 2025 팔마고 고1 2학기 중간 QID21 — 제작자 역발문·수학 자가검산

- 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`; Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`. 원본 Q21은 p/q 진리집합과 r↔¬p의 필요조건·충분조건 서술형이다. 원본과 기존 Q01~Q20은 변경하지 않는다.
- 9개 슬롯 전부 서술형이며 `choices=[]`. A1~A3는 STRICT_VARIANT; B1~C3는 EXAM_FOLLOWUP. 학생용 시각자료는 문항·해설 각각 판단했고 모두 구간식과 포함관계로 재현 가능하여 NO_VISUAL; 정답 누설용 그림이나 장식용 SVG는 추가하지 않는다.
- Primary RPM L3: `필요조건·충분조건` / `H1-RPM-247` DIRECT_ACTIVE; ACTIVE `PT_NEC_SUFF_RELATION` 및 TPL SET_RELATION/DIRECT_JUDGMENT/INTERVAL_PARAMETER 재사용, 신규 Generated 키 무단 생성 없음.
- 사고 경험: A = 원형 숙달, B = 포함 역전·동치·반례, C = 매개변수·경계·정수 조건. 형식만 다른 허위 독립 Blueprint로 주장하지 않는다.
- 최종 발문만 다시 읽어 질문 대상/변수 실수 조건/구간 끝점/정답형을 복원하고 기존 설계 목표와 대조했다. 별도 정답·해설 공개 GPT 검수는 실시하지 않았다.

| 슬롯 | UID | 정답 | 수학적 포함·경계 판정 근거 | 역발문 |
|---|---|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q21-A1` | (1) $P=[-4,2],\ Q=(3,5)$; (2) 필요조건(충분조건 아님) | Q=(3,5)⊂(2,∞)⊂R; x=6 gives r true q false | KEEP |
| A2 | `ALITE-PALMA25-2MID-Q21-A2` | (1) $P=[-3,5],\ Q=(-7,-3)$; (2) 필요조건(충분조건 아님) | Q=(-7,-3) lies outside P, -3 excluded; r(6) true q(6) false | KEEP |
| A3 | `ALITE-PALMA25-2MID-Q21-A3` | (1) $P=[-5,-1],\ Q=[1,3]$; (2) 필요조건(충분조건 아님) | [1,3]⊂(-1,∞); r(4) true q(4) false | KEEP |
| B1 | `ALITE-PALMA25-2MID-Q21-B1` | 충분조건(필요조건 아님) | R=(-∞,-2)∪(4,∞)⊂Q=(-∞,-1)∪(3,∞), x=-3/2∈Q\R | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q21-B2` | 필요충분조건 | complements of ≤0 and >0 equal on all real x | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q21-B3` | 필요조건도 충분조건도 아님 | q(0) true r(0) false; r(3) true q(3) false | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q21-C1` | $k\le-6$ 또는 $k\ge2$ | (k,k+2)⊂(-∞,-4) iff k+2≤-4; (k,k+2)⊂(2,∞) iff k≥2 | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q21-C2` | $0\le t\le1$ | R⊂Q iff (t−2,t+2)⊂[−2,3], giving 0≤t≤1 | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q21-C3` | $k=1,2,3,4,5$ (총 $5$개) | r: \|2x−1\|>5, q: \|2x−1\|≥k; r⇒q iff k≤5; x=−2 refutes q⇒r for each k≤5 | KEEP |

## 주요 경계 점검
- A2의 `x=-3`은 p가 참이므로 r에서 제외한다. A3의 q 닫힌 구간도 전부 r 안에 있다.
- B1의 반례 `x=-3/2`, B3의 반례 `x=0`과 `x=3`으로 반대 함의를 각각 부정했다.
- C1의 열린구간은 `k=-6`, `k=2`에서도 완전히 r 안에 포함된다. C2의 `t=0`, `t=1`도 r의 열린 경계 때문에 가능하다.
- C3에서 `k=5`는 여전히 충분조건만 된다. `x=-2`에서는 q 참/r 거짓이고, `k=6,7,8`에는 `5<|2x-1|<k`인 반례가 존재한다.

## 제작 closure
- 9 UID / 9 solutions / 객관식 0 / 정답 분포 N/A / KEEP 9 / REVISED 0 / HOLD 0.
- `AUTHOR_SELF_RECHECK_COMPLETE`는 이번 최종 후보의 발문·수학·Meta에 대한 제작자 자가검수만 뜻한다. `GPT_OPEN_BOOK_REVIEW=NOT_RUN`, `CONSUMER=NOT_REGISTERED`, `CHROME=NOT_TESTED`, `MAIN_Q21_RELEASE=NOT_DONE`.

## 표시 전용 핀포인트 수리 (2026-10-10)
- A1~A3 학생용 발문에서 문자열 리터럴 `\\n`을 렌더용 `<br>`로 변경. B1 해설의 `\\dfrac32`을 명시적 `\\dfrac{3}{2}`로 정규화.
- 조건·정답·진리집합·증명·난이도·Meta·UID의 의미 변화 없음. 최종 candidate의 표시 문자열만 fresh 확인; 기존 수학 self-check와 구간 포함 판정은 변화 없음.
