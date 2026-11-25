# 미래엔 대수 — 수열 대단원 마무리: SVG 두 축 EXEMPT 검수 (q01–q09)

- 원문: `archive/exams/textbooks/미래엔_대수/미래엔_대수_수열_대단원마무리_고2/미래엔_대수_수열_대단원마무리_고2.js`
- 원문 SHA-256: `8ba0df81f23b02cc8ea836d670441d1b96071fb4314107628ce53fbb00660683`
- 범위: q01–q09 **9문항, 18축**. 전체 16문항 중 q10–q16은 후속 배치.
- 원문에는 주어진 도형·좌표·구간별 그래프가 없고, 이 범위에서는 수열의 식·항·비·합을 계산하는 문항뿐이다. 이유가 있는 EXEMPT는 plan JSON을 강제 생성하지 않는다. 계획하지 않은 항목의 lint는 `N/A`, DRAWN_FEATURE_PARITY는 `EXEMPT`이다.

| qid | 축 | 판정 및 개별 이유 | capability / plan | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT: `a_n=3^n−3=78`을 만족하는 지수 n 한 값 계산. | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT: `3^n=81`에서 n=4를 구함. | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT: 등차수열 a₁=4a₃, a₂+a₁₀=14의 연립식. | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT: 공차·첫항을 대입해 a₅=4 도출. | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT: 세 등차수열 항 a,b,c의 합과 곱 조건. | — | N/A | EXEMPT |
| q03 | 해설 | EXEMPT: `(b-d)b(b+d)`와 `a+b+c`로 제곱합 30을 계산; 위치 도식·비율 없음. | — | N/A | EXEMPT |
| q04 | 문제 | EXEMPT: S₅=S₁₁ 조건 아래 합 Sₙ 최대값 계산. | — | N/A | EXEMPT |
| q04 | 해설 | EXEMPT: a₈>0, a₉<0의 부호 변화로 최대 S₈=128 확정; 원문에 없는 임의 좌표를 그리면 수열 그래프를 오독할 수 있음. | — | N/A | EXEMPT |
| q05 | 문제 | EXEMPT: Sₙ=n²−4n에서 일반항과 공차 확인. | — | N/A | EXEMPT |
| q05 | 해설 | EXEMPT: 차분 Sₙ−Sₙ₋₁의 직접 전개. | — | N/A | EXEMPT |
| q06 | 문제 | EXEMPT: 양의 등비수열 a₂=27, a₇=a₅/3의 비 관계. | — | N/A | EXEMPT |
| q06 | 해설 | EXEMPT: 공비 제곱 r²=1/3과 a₆=3의 기호식 계산. | — | N/A | EXEMPT |
| q07 | 문제 | EXEMPT: 등비수열 부분합 S₆/S₃=17의 식 변형. | — | N/A | EXEMPT |
| q07 | 해설 | EXEMPT: `1+r³=17`로 r³=16, 따라서 a₆/a₃=16. | — | N/A | EXEMPT |
| q08 | 문제 | EXEMPT: 망원급수형 합의 일반항을 이용하는 수치 계산. | — | N/A | EXEMPT |
| q08 | 해설 | EXEMPT: 중간 항 상쇄 후 a₁₁=92; 선분·길이·좌표 등의 그림 구성 요소가 없음. | — | N/A | EXEMPT |
| q09 | 문제 | EXEMPT: `Σ(3a_k+2)=40`에서 합을 구하는 단일 선형식. **CONTENT_CONFLICT: 정답 필드 `6` vs 해설 결론 `10`**. | — | N/A | EXEMPT |
| q09 | 해설 | EXEMPT: `3Σa_k+10=40 ⇒ Σa_k=10`; 해설 결론은 10이고 answer 6과 불일치. 원문 변경하지 않음. | — | N/A | EXEMPT |

## 원문 CONTENT_CONFLICT (q09)

- 원문 `answer: "$6$"`, 해설 최종 `"$10$"`; 독립 계산 `3Σa_k+5·2=40 ⇒ Σa_k=10`.
- **판정:** 콘텐츠 데이터 오류로 별도 수정·승인이 필요할 수 있으나 이번 승인 범위는 production plan이므로 **source JS를 건드리지 않는다**.
- **엔진 capability pending:** 없음 (이 묶음에는 그릴 대상 없음); **plan-lint:** N/A; **렌더·게시 QA:** NOT_RUN.
