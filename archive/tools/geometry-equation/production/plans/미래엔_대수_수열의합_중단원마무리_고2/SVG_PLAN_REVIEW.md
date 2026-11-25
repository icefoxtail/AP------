# 수열의 합 중단원 마무리 — 문제/해설 2축 원문·plan 검수

- JS: `archive/exams/textbooks/미래엔_대수/미래엔_대수_수열의합_중단원마무리_고2/미래엔_대수_수열의합_중단원마무리_고2.js`
- 원문 SHA-256: `f1a964d9f9a27463521ac1952c8ae95b7e92a71843cd307b32a6f4cf09436e70`
- 이번 검토: q01–q05, 5문항 / 10축. 전체 15문항 중 나머지 q06–q15은 이번 범위에 포함하지 않음.
- 판정 규칙: 문제·해설 축을 각각 독립 검토했다. EXEMPT는 실제 도형·표가 필요 없는 식 계산과 논리의 구체적 사유이며 plan 파일이 아니다. 렌더/학생 화면/A4 확인은 `NOT_RUN`.

| qid | 축 | 판정 및 개별 사유 | capability / plan | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT: 세 묶음의 수열을 Σ 기호로 전환하는 식 문제로 원문 도형 없음 | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT: 첫항·공차·마지막 번호 9,30,10을 구하는 수치 계산으로 도형 불필요 | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT: Σa_k,Σb_k 두 합과 일차결합 두 개만 주어진 기호식 | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT: 합의 선형성과 상수항 20개 합으로 직접 계산, 위치·축 불필요 | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT: 일차·이차·삼차의 Σ합 세 식을 계산하는 유형 | — | N/A | EXEMPT |
| q03 | 해설 | EXEMPT: Σk·Σk²·Σk³ 공식 대입, 도식화하면 계산 중복 | — | N/A | EXEMPT |
| q04 | 문제 | EXEMPT: 1/((k+1)(k+2))의 망원급수형 수치 합 | — | N/A | EXEMPT |
| q04 | 해설 | EXEMPT: 인접항 1/(k+1)−1/(k+2)이 소거되고 양 끝만 남아 식 배열로 충분 | — | N/A | EXEMPT |
| q05 | 문제 | EXEMPT: Σ(b−a)=7, Σ(a+2b)=11의 두 합 연립식 | — | N/A | EXEMPT |
| q05 | 해설 | EXEMPT: A=Σa, B=Σb 대입 후 B−A=7, A+2B=11 연립으로 A=−1 | — | N/A | EXEMPT |

- 이 범위는 모두 기호식·점화식 계산/귀납 전개에 해당하므로 신규 SVG plan 생성 0건. `ENGINE_CAPABILITY_PENDING` 0건. 모든 EXEMPT는 위 표의 개별 사유로 판정.
