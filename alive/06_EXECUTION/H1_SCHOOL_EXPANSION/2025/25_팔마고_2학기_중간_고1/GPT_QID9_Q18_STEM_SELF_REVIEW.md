# 2025 팔마고 고1 2학기 중간 Q18 — GPT 발문 역독해·자가검산

- source: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` / blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`
- Primary L3: **삼각형의 무게중심**, H1-RPM-209. 2022 RPM binding `DIRECT_BINDING_GAP` 사실 보존. Generated 전용 L4 3종·CrossConcept 1종·Condition 2종 등록, RPM LOCKED는 수정하지 않음.
- 원본과 기존 Q01~Q17 불변. 신규 A1~C3 9문항, 발문·정답·상세해설·오답 유도값 36개 작성. 문제용 신규 시각자산 불필요(좌표·관계 학생용 문장 명시).
- 수학: `AB=b, AC=c`이면 `[GHC]=[ABC]*c/[3(b+c)]`, `[GHB]=[ABC]*b/[3(b+c)]`. 이 식을 최종 발문마다 다시 적용. 음수 해 배제 및 C3 양끝 경계 직접 계산.

| 슬롯 | 정답 | 정확 값 | Reverse-stem | 오답 4개 경로 |
|---|---|---|---|---|
| A1 | ② | 2 | KEEP | 4/4 |
| A2 | ④ | 1 | KEEP | 4/4 |
| A3 | ① | 6 | KEEP | 4/4 |
| B1 | ⑤ | 1/5 | KEEP | 4/4 |
| B2 | ③ | 18 | KEEP | 4/4 |
| B3 | ② | 2 | KEEP | 4/4 |
| C1 | ④ | 12 | KEEP | 4/4 |
| C2 | ① | 3 | KEEP | 4/4 |
| C3 | ③ | 8 | KEEP | 4/4 |

- A/B/C: A는 직접 넓이, B는 넓이비·원면적·부분삼각형 변경, C는 양수 매개변수 역산과 두 면적조건 교집합. 질문 자연성·숫자조건·L3 필수성·5지 유일·해설 결론·오답 번호 누락 0에 대해 제작자 자체점검 수행.
- C1: $t^2/(t+6)=8\Rightarrow t=12$ (음수 해 -4 제외). C2: $6b/(b+6)=2\Rightarrow b=3$. C3: $t^2/(t+6)\ge4$의 양의 경계 $2+2\sqrt7$은 7과 8 사이이며 $6t/(t+6)\ge2$는 $t\ge3$, 따라서 자연수 최솟값 8.
- UID별 최종 student-facing stem, exact answer, four actual wrong-value witnesses, Meta and KEEP evidence: `GPT_QID9_Q18_PACKAGE.json`.
- 자체결과 **KEEP9 REVISED0 HOLD0** / answer distribution ①2②2③2④2⑤1. 별도 GPT 공개답 검수 NOT_RUN, 학생 Consumer/index·Chrome NOT_REGISTERED/NOT_TESTED. 이번 커밋은 제작 후보 단계이며 MAIN_DONE 아님.
