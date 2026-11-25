# 미래엔 공통수학Ⅱ 명제 중단원 마무리 — 2축 판정 (q01–q06)

- 원문: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_명제_중단원마무리_고1/미래엔_공통수학2_명제_중단원마무리_고1.js`
- 범위: 11문항 중 q01–q06, **6문항·12축**. q07–q11은 후속 배치.
- 문제축 6개는 텍스트의 집합·진술·조건이 완결되므로 EXEMPT. 해설 집합 그림은 기본 색칠 없음.

| qid | 문제 축 개별 판정 | 해설 축 개별 판정 | capability | 해설 plan | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 명제·조건·주관적 문장 분류 질문 | EXEMPT — 각각 참·거짓·조건·명제 아님이라는 문장 판정 | — | — | N/A |
| q02 | EXEMPT — 전체집합과 원소에 대한 두 조건이 숫자로 완결 | BENEFICIAL — P가 Q에 포함되는 구조와 여집합의 위치를 확인 | set-diagram-figure-v1 | `q02-solution.plan.json` | PASS: P={2,4}, Q={1,2,4,5,6,7}, U−Q={3} |
| q03 | EXEMPT — 역·대우의 문장 진위를 묻는 텍스트 문제 | EXEMPT — x=1/2, x=0 반례 두 개로 진위 확정 | — | — | N/A |
| q04 | EXEMPT — 세 쌍의 조건식이 각각 완결 | BENEFICIAL — 첫째 보기의 Q=[−3,0]⊂P=(−∞,1] 관계는 수직선이 도움; 둘째·셋째는 식 판정 | number-line-figure-v1 | `q04-solution.plan.json` | PASS: P의 1, Q의 −3·0 닫힌 끝점 및 포함 |
| q05 | EXEMPT — 전칭·존재 명제의 문장 부정 문제 | EXEMPT — x²−x+1>0, 절댓값<0의 불가능성으로 완결 | — | — | N/A |
| q06 | EXEMPT — 함의 p⇒~q와 보기 명제가 모두 제시 | BENEFICIAL — P∩Q=∅의 서로소 구조를 두 원으로 표시 | set-diagram-figure-v1 | `q06-solution.plan.json` | PASS: P와 Q의 겹치는 영역·원소 없음 |

- `plan-lint.cjs --shallow`: 3/3 PASS; full: 3/3 PASS.
- 유한 원소 전체 1~7 및 각 소속, 구간 끝점과 포함, P∩Q=∅를 독립 재대조해 **DRAWN_FEATURE_PARITY 3/3 PASS**.
- 문제 정답 비노출, 기본 면 채움 없음. 출력 SVG 육안 QA는 후속 렌더 담당 작업.
