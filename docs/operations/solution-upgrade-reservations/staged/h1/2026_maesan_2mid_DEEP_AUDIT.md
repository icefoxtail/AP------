# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q11 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|11`; ordinal: 11; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 두 점 $A(-1,4)$, $B(4,a)$에 대하여 선분 $AB$와 점 $P$에서 만나는 직선 $l:2x+y-17=0$이 있다.<br>점 $A$, $B$에서 직선 $l$에 내린 두 수선의 발을 각각 $A\prime$, $B\prime$라 할 때,<br>$\overline{AA\prime}:\overline{BB\prime}=3:2$를 만족시키는 양수 $a$의 값은? [4.7점]
- 보기: ["17","18","19","20","21"]; 정답: ③
- 기존 solution 핵심 원문: `$30=3|a-9|$,` / `$|a-9|=10$이다.` / `절댓값 식을 두 경우로 나눈다.` / `(1) $a-9=10$이면 $a=19$이다.`
- 판정·독립 검산: AA'=15/√5, BB'=|a-9|/√5, 비 3:2에서 |a-9|=10→a=19 또는 -1, 양수로 19. 독립 검산 15:10=3:2, 직선 대입값 -15와 10으로 선분 교차 확인. KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q11-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q12 — HOLD (READ_EVIDENCED, VISUAL_HOLD)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|12`; ordinal: 12; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 그림과 같이 좌표평면 위에 원 $C:(x-8)^2+(y-4)^2=1$과 점 $A(2,0)$이 있다. 원 $C$ 위의 점 $P$와 직선 $y=x$ 위의 점 $Q$에 대하여 $\overline{AQ}+\overline{QP}$의 최솟값은? [4.7점]
- 보기: ["$2\\sqrt{17}-2$","$2\\sqrt{17}-1$","$2\\sqrt{17}$","$\\sqrt{17}-2$","$\\sqrt{17}-1$"]; 정답: ②
- 기존 solution 핵심 원문: `=\sqrt{68}=2\sqrt{17}$이다.` / `반지름이 $1$이어서 $A'$에서 원까지의 가장 짧은 거리는` / `$2\sqrt{17}-1$이다.` / `따라서 합은 이 값보다 작을 수 없다.`
- 판정·독립 검산: 문제 그림 q012_visual.png 실물 미판독으로 HOLD/VISUAL_HOLD. 텍스트만으로는 A'=(0,2), 중심 (8,4), 반지름 1에서 A'C-1=2√17-1 계산이 맞다. 그러나 원본 그림의 A, C, 직선 y=x의 실제 배치·표시를 확인하지 못했으므로 학생용 시각 정합성 보류.
- 그림: assets/images/26_매산고_2학기_중간_고1_기출/q012_visual.png; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q12-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q13 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|13`; ordinal: 13; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 전체집합 $U$의 공집합이 아닌 부분집합 $A$, $B$에 대하여 $S(A,B)=(A\cap B^C)\cup(A\cup B^C)^C$라 할 때, 다음 중 보기에서 옳은 것만을 있는 대로 고른 것은? [4.8점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. $n(S(A,B))=n(A\cup B)$이면<br>$n(A\cap B)=0$이다.<br>ㄴ. $S(A,B)=A^C$이면 $A\cup B=U$이다.<br>ㄷ. $S(A,B)\cap C^C=S(A\cap B,B\cap C)$이다.</div>
- 보기: ["ㄱ","ㄱ, ㄴ","ㄱ, ㄷ","ㄴ, ㄷ","ㄱ, ㄴ, ㄷ"]; 정답: ②
- 기존 solution 핵심 원문: `따라서 $A\subseteq B$이다.` / `또 $A^C=S(A,B)$의 원소는 $A$에 속하지 않으므로` / `$S(A,B)$의 두 부분 중 $A^C\cap B$에 속해야 한다.` / `따라서 $A^C\subseteq B$이다.`
- 판정·독립 검산: 드모르간으로 S=(A∩Bᶜ)∪(Aᶜ∩B). ㄱ은 n(A∪B)=n(A∩B)+n(S)로 증명; ㄴ은 A⊆B와 Aᶜ⊆B로 B=U; ㄷ은 U={1,2,3}, A={1,2},B={1,3},C={2,3} 반례에서 좌변 ∅ 우변 {1,3}. 각 보기를 분리해 증명하므로 KEEP. 독립 집합 대입 확인.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q13-solution.svg; 실물 시각 판독 NOT_RUN.

## Q14 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|14`; ordinal: 14; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 집합<br>$A=\{(x,\dfrac{3}{4}x+2)\mid x\text{는 실수}\}$,<br>$B=\{(x,y)\mid (x+a)^2+(y-a)^2=a^2\}$에 대하여 $n(A\cap B)=1$이 되게 하는 모든 실수 $a$값의 합은? [4.9점]
- 보기: ["$\\dfrac{13}{3}$","$\\dfrac{14}{3}$","5","$\\dfrac{16}{3}$","$\\dfrac{17}{3}$"]; 정답: ②
- 기존 solution 핵심 원문: `$\dfrac{|3(-a)-4a+8|}{\sqrt{3^2+(-4)^2}}=|a|# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$\dfrac{|8-7a|}{5}=|a|# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$|8-7a|=5|a|$이다.` / `양변이 $0$ 이상이므로 제곱해도 동치이다.`
- 판정·독립 검산: a=0일 때 B={(0,0)}이고 A에 포함되지 않음. a≠0에서 직선 3x-4y+8=0과 중심(-a,a), 반지름 |a|의 접선 조건 |8-7a|=5|a|→(3a-2)(a-4)=0→2/3,4, 합14/3. 독립 대입 두 값 모두 거리=반지름 확인. KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q14-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q15 — HOLD (READ_EVIDENCED, VISUAL_HOLD)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|15`; ordinal: 15; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 그림과 같이 좌표평면 위에 원 $C:(x-4)^2+(y-4)^2=16$, 직선 $y=mx\ (0<m<1)$이 있다.<br>원 $C$의 중심을 $A$, 점 $A$에서 직선 $y=mx$에 내린 수선의 발을 $H$, 직선 $y=mx$가 원 $C$와 만나는 두 점 중 원점 $O$에 가까운 점을 $B$라 할 때,<br>$\overline{OH}:\overline{BH}=\sqrt{3}:1$이다. 상수 $m$의 값은? [4.9점]
- 보기: ["$\\sqrt{3}-1$","$3-2\\sqrt{2}$","$2\\sqrt{3}-3$","$\\sqrt{5}-2$","$2-\\sqrt{3}$"]; 정답: ⑤
- 기존 solution 핵심 원문: `또 직각삼각형 $ABH$에서` / `$BH^2=AB^2-AH^2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=16-\dfrac{16(1-m)^2}{1+m^2}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{16(1+m^2)-16(1-2m+m^2)}{1+m^2}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 문제 그림 q015_visual.png 실물 미판독으로 HOLD/VISUAL_HOLD. 텍스트 기준 중심(4,4), R=4, OH²=16(1+m)²/(1+m²), BH²=32m/(1+m²), OH²=3BH²→m²-4m+1=0→m=2-√3(0<m<1). 식은 독립 검산 일치하나 그림의 O,H,B 순서·수선·좌표 실물 확인 전 시각 PASS 불가.
- 그림: assets/images/26_매산고_2학기_중간_고1_기출/q015_visual.png; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q15-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q16 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|단답형1`; ordinal: 16; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;단답형1&gt;<br>집합 $A=\{2,4,6,8\}$의 진부분집합의 개수를 구하시오. [4점]
- 보기: []; 정답: $15$
- 기존 solution 핵심 원문: `집합 $A$의 원소는 $4$개이므로 부분집합의 개수는` / `$2^4=16$개이다.` / `진부분집합은 자기 자신 $A$를 제외한 부분집합이므로` / `$16-1=15$개이다.`
- 판정·독립 검산: 원소 네 개의 부분집합 2⁴=16, 자기 자신 하나를 제외한 진부분집합 15. 공집합은 진부분집합에 포함됨. 독립 계수 확인. KEEP.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q17 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|단답형2`; ordinal: 17; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;단답형2&gt;<br>좌표평면 위의 세 점 $A(2,4)$, $B(-4,7)$, $C(8,-2)$에 대하여 선분 $AB$, 선분 $BC$, 선분 $CA$를 각각 $2:1$로 내분하는 점을 $M$, $N$, $P$라 할 때, 삼각형 $MNP$의 무게중심의 좌표를 구하시오. [5점]
- 보기: []; 정답: $\left(2,3\right)$
- 기존 solution 핵심 원문: `$N=\left(\dfrac{1\cdot(-4)+2\cdot8}3,` / `\dfrac{1\cdot7+2\cdot(-2)}3\right)# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 21; KEEP: 18; UPGRADE: 0; HOLD: 3; UNREAD: 0
- nextQid: null; unfinished: visual verification q12,q15,q18; Golden/Negative/render QA NOT_RUN; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q6 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|6`; ordinal: 6; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 세 점 $A(-3,1)$, $B(2,-4)$, $C(4,k)$에 대하여 삼각형 $ABC$의 무게중심 $G$가 $x$축 위에 있을 때, 상수 $k$의 값은? [4.1점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ⑤
- 기존 solution 핵심 원문: `삼각형의 무게중심의 $y$좌표는 세 꼭짓점의 $y$좌표의 평균이다.` / `무게중심이 $x$축 위에 있으므로` / `$\dfrac{1-4+k}{3}=0$이다.`
- 판정·독립 검산: y좌표 평균 (1-4+k)/3=0에서 k=3이 바로 나온다. 독립 검산 1-4+3=0. 원문은 x축 위 조건을 y=0으로 정확히 변환한다.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q6-solution.svg; 실물 시각 판독 NOT_RUN.

## Q7 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|7`; ordinal: 7; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 중 방정식 $x^2+y^2+4x-2y+k+1=0$이 원을 나타내도록 하는 실수 $k$값이 아닌 것은? [4.3점]
- 보기: ["0","1","2","3","4"]; 정답: ⑤
- 기존 solution 핵심 원문: `중심이 $(-2,1)$인 원을 나타내려면 반지름의 제곱이 양수여야 한다.` / `$4-k>0# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$k<4$이다.` / `보기의 $0,1,2,3$은 모두 $4$보다 작으므로 원을 나타낸다.` / `$k=4$이면` / `$(x+2)^2+(y-1)^2=0$이 되어`
- 판정·독립 검산: 완전제곱 후 (x+2)²+(y-1)²=4-k, 실제 원의 반지름 양수 조건 4-k>0을 명시한다. k=4는 점 하나라는 경계도 설명한다. 보기 0,1,2,3은 성립하고 4만 제외, ⑤ 검산.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q8 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|8`; ordinal: 8; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 이차함수 $y=x^2-1$ 위의 점 $(1,0)$에서의 접선 $l$과 평행하고 점 $(2,3)$을 지나는 직선의 방정식이 $ax+y+b=0$이다. 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.4점]
- 보기: ["$-1$","0","1","2","3"]; 정답: ①
- 기존 solution 핵심 원문: `$m=2$이다.` / `구하는 직선은 이 접선과 평행하므로 기울기도 $2$이다.` / `점 $(2,3)$을 지나므로` / `$y-3=2(x-2)$,` / `$y=2x-1$이다.` / `이를 $ax+y+b=0$ 꼴로 고치면 $-2x+y+1=0$이다.`
- 판정·독립 검산: 포물선과 y=m(x-1)의 교점 (x-1)(x+1-m)=0에서 중근 조건 m-1=1을 써 m=2를 도출한다. 이어 y-3=2(x-2)→-2x+y+1=0에서 a+b=-1. 접점 x=1에서 인수 중복 확인. 미분 없이 공통수학 범위 풀이.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q9 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|9`; ordinal: 9; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 평행이동 $(x,y)\to(x+k,y-2)$에 의하여 원<br>$x^2+y^2+2x-6y-15=0$이 옮겨지는 원이 직선<br>$2x-3y+6=0$과 접하도록 하는 모든 상수 $k$값의 합은? [4.5점]
- 보기: ["$-4$","$-3$","$-2$","$-1$","0"]; 정답: ④
- 기존 solution 핵심 원문: `$2k+1=5\sqrt{13}$ 또는 $2k+1=-5\sqrt{13}$이므로` / `$k=\dfrac{-1+5\sqrt{13}}2$ 또는` / `$k=\dfrac{-1-5\sqrt{13}}2$이다.` / `두 값은 모두 접하는 조건을 만족한다.` / `따라서 구하는 합은` / `$\dfrac{-1+5\sqrt{13}}2+\dfrac{-1-5\sqrt{13}}2# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 원 중심 (-1,3), 반지름 5; 이동 중심 (k-1,1). 거리 |2k+1|/√13=5의 두 부호를 각각 풀고 합 -1을 보인다. 독립 검산 두 해에서 거리 5. 부호·경우 누락 없음.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q9-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q10 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|10`; ordinal: 10; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $y=0$, $y=\dfrac{4}{3}x$가 이루는 각 중 작은 각을 이등분하는 직선의 방정식을 $y=mx$라 할 때, 상수 $m$의 값은? [4.6점]
- 보기: ["$-1$","$-\\dfrac{1}{2}$","0","$\\dfrac{1}{2}$","1"]; 정답: ④
- 기존 solution 핵심 원문: `점 $R(1,m)$에서 두 직선까지의 거리가 같으므로` / `$m=\dfrac{|4-3m|}{5}# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\dfrac{4-3m}{5}$이다.` / `따라서` / `$5m=4-3m# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$8m=4# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 10; KEEP: 10; UPGRADE: 0; HOLD: 0; UNREAD: 11
- nextQid: 11; unfinished: q11–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
- Claims: claims/h1/e12c566f55a9f2d5c59c181a34dac741eb57c676.json; status IN_PROGRESS

## Q1 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|1`; ordinal: 1; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음 보기에서 집합인 것의 개수는? [3.6점]<br><div class="note-box"><div style="text-align:center;font-weight:600;margin-bottom:4px;">&lt;보기&gt;</div>ㄱ. 좋아하는 과일의 모임<br>ㄴ. 12의 약수의 모임<br>ㄷ. 노래를 잘하는 학생의 모임<br>ㄹ. 5보다 작은 자연수의 모임</div>
- 보기: ["0","1","2","3","4"]; 정답: ③
- 기존 solution 핵심 원문: `따라서 집합이 아니다.` / `ㄹ. $5$보다 작은 자연수는 $1,2,3,4$로 분명하게 정해진다.` / `따라서 집합이다.` / `집합인 것은 ㄴ, ㄹ의 $2$개이다.` / `따라서 정답은 ③이다.`
- 판정·독립 검산: ㄱ·ㄷ은 주관적 기준이라 집합이 아니고, ㄴ의 약수 {1,2,3,4,6,12}, ㄹ의 자연수 {1,2,3,4}는 명확하다. 원문 해설이 네 경우를 독립 단락으로 나누고 두 집합을 정확히 열거하여 2개→③까지 연결한다. 독립 열거 검산 일치.
- 그림: 문제 image 없음; 해설그림: 없음; 실물 시각 판독 NOT_RUN.

## Q2 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|2`; ordinal: 2; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 집합 $A=\{1,2,3,4\}$, $B=\{2,4,6,8\}$에 대하여 집합 $A\cup B$의 모든 원소의 합은? [3.7점]
- 보기: ["23","24","25","26","27"]; 정답: ②
- 기존 solution 핵심 원문: `$A\cup B$에는 $A$ 또는 $B$에 속하는 원소를 중복 없이 모은다.` / `$A\cup B=\{1,2,3,4,6,8\}$이다.` / `따라서 모든 원소의 합은` / `$1+2+3+4+6+8=24$이다.` / `따라서 정답은 ②이다.`
- 판정·독립 검산: 합집합의 중복 2,4를 한 번만 세는 원문 식 A∪B={1,2,3,4,6,8}→1+2+3+4+6+8=24가 핵심을 모두 보여 준다. 독립 합산 24=②. solutionImage 실물 시각 확인은 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q2-solution.svg; 실물 시각 판독 NOT_RUN.

## Q3 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|3`; ordinal: 3; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 두 직선 $3x-y+2=0$, $(k-1)x+y-5=0$이 서로 수직일 때, 상수 $k$의 값은? [3.8점]
- 보기: ["$\\dfrac{4}{3}$","$\\dfrac{5}{3}$","$2$","$\\dfrac{7}{3}$","$\\dfrac{8}{3}$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 서로 수직이므로` / `$3(1-k)=-1$이다.` / `따라서 $1-k=-\dfrac13$이고` / `$k=\dfrac43$이다.` / `따라서 정답은 ①이다.`
- 판정·독립 검산: 첫째 기울기 3, 둘째 기울기 1-k가 원문에서 직접 유도되고 3(1-k)=-1을 사용한다. 독립 검산 k=4/3이면 두 기울기 3,-1/3으로 곱 -1. 마지막 1-k=-1/3→k=4/3은 단순 일차방정식으로 KEEP. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q3-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q4 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|4`; ordinal: 4; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 좌표평면 위의 점 $(1,a)$를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 점의 좌표가 $(2,5)$일 때, 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.9점]
- 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ④
- 기존 solution 핵심 원문: `이 점이 $(2,5)$와 같으므로` / `$1+b=2$, $a-3=5$이다.` / `따라서 $b=1$, $a=8$이고` / `$a+b=9$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 이동 좌표 (1+b,a-3)=(2,5)에서 b=1,a=8, 합 9=④. x·y 이동의 부호와 대응 좌표가 원문에 모두 제시돼 별도 논리 점프가 없다. 독립 대입 (1+1,8-3)=(2,5). 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q4-solution.svg; 실물 시각 판독 NOT_RUN.

## Q5 — KEEP (READ_EVIDENCED, VISUAL_QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|5`; ordinal: 5; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: 다음은 서로 다른 두 원 $C_1$, $C_2$의 방정식이다.<br>$C_1:x^2+y^2+4x-2y-4=0$,<br>$C_2:(x-3)^2+(y+5)^2=r^2$<br>두 원 $C_1$, $C_2$의 반지름의 합이 $7$일 때, $C_2$의 반지름의 길이는? [4.1점]
- 보기: ["1","2","3","4","5"]; 정답: ④
- 기존 solution 핵심 원문: `$C_2$의 반지름의 길이를 $R$라 하자.` / `두 원의 반지름의 합이 $7$이므로` / `$3+R=7$` / `$R=7-3=4$이다.` / `따라서 정답은 ④이다.`
- 판정·독립 검산: 완전제곱 x²+4x+4=(x+2)², y²-2y+1=(y-1)², 오른쪽 4+4+1=9가 원문에 나타난다. 따라서 반지름 3, R=7-3=4=④. 독립 검산 원 C1의 반지름 제곱 4+1+4=9. 그림 시각 NOT_RUN.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q5-solution-v2.svg; 실물 시각 판독 NOT_RUN.


- 판정·독립 검산: 각 이등분선 위 R(1,m), 0<m<4/3에서 4-3m>0을 먼저 확정하고 거리 m=(4-3m)/5, 8m=4, m=1/2를 전개한다. 검산 두 거리 모두 1/2. 부호 선택을 설명하므로 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 판독 NOT_RUN.

 / `$=\left(\dfrac{12}{3},\dfrac{3}{3}\right)=(4,1)$이다.` / `$P$는 $CA$를 $2:1$로 내분하므로`
- 판정·독립 검산: 내분점 M=(-2,6), N=(4,1), P=(4,2)를 원문이 각 좌표별 계산으로 제시한다. 무게중심 ((-2+4+4)/3,(6+1+2)/3)=(2,3). 독립 재계산 일치. KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q17-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q18 — HOLD (READ_EVIDENCED, VISUAL_HOLD)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|단답형3`; ordinal: 18; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;단답형3&gt;<br>방정식 $f(x,y)=0$이 나타내는 도형이 그림과 같다. 방정식 $f(y-1,x+1)=0$이 나타내는 도형의 그래프를 좌표를 명확히 나타내어 그리시오. (단, 좌표를 명시하지 않을 시 오답 처리함.) [6점]
- 보기: []; 정답: 중심 $(-3,0)$, 반지름 $1$인 원의 왼쪽 아래 $\dfrac14$원호와 선분 $(-4,0)-(-3,0)$, $(-3,0)-(-3,-1)$
- 기존 solution 핵심 원문: `원래 원의 중심 $(-1,-2)$는` / `$(-2-1,-1+1)=(-3,0)$으로 옮겨진다.` / `원래 그림의 점 $(-2,-2)$, $(-1,-2)$, $(-1,-3)$은 각각` / `$(-2-1,-2+1)=(-3,-1)$,`
- 판정·독립 검산: 문제 원본 그래프 q018_visual.png를 보지 못해 원래 도형의 중심(-1,-2)·점 3개·원호 방향을 확인할 수 없음. 대수적 변환 (u,v)→(v-1,u+1)은 맞고 제시 점의 변환도 일치하지만 원본 그림 자체를 판독해야 하므로 HOLD/VISUAL_HOLD.
- 그림: assets/images/26_매산고_2학기_중간_고1_기출/q018_visual.png; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q18-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q19 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|서술형1`; ordinal: 19; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;서술형1&gt;<br>$x$가 실수일 때, $\left|\sqrt{x^2+4x+20}-\sqrt{x^2-8x+17}\right|$의 최댓값이 되는 $x$의 값을 $\alpha$,<br>그 때의 최댓값을 $\beta$라 할 때, 실수 $\alpha$, $\beta$에 대해 $\alpha\times\beta$의 값을 구하는 과정을 서술하시오. [6점]
- 보기: []; 정답: $18\sqrt5$
- 기존 solution 핵심 원문: `=\sqrt{36+9}=3\sqrt5$이므로 최댓값은 많아야 $3\sqrt5$이다.` / `등호는 $A,B,X$가 한 직선 위에 있고 $X$가 선분 $AB$ 바깥에 있을 때 가능하다.` / `직선 $AB$의 기울기는` / `$\dfrac{1-4}{4-(-2)}=-\dfrac12$이다.`
- 판정·독립 검산: 거리 XA=√((x+2)²+16), XB=√((x-4)²+1), 역삼각부등식 |XA-XB|≤AB=3√5. A(-2,4),B(4,1)의 직선 y=3-x/2가 x축에서 (6,0)과 만나고 B가 A와 X 사이이므로 등호 성립. αβ=6·3√5=18√5. 독립 거리 검산 x=6에서 XA=√80=4√5, XB=√5, 차3√5. KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q19-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## Q20 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|서술형2`; ordinal: 20; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;서술형2&gt;<br>복소수 전체의 집합 $\mathbb{C}$의 공집합이 아닌 세 부분집합 $A=\{z\mid z^6=1\}$, $B=\{z\mid z+\overline{z}=1,\ z\overline{z}=1\}$, $C$에 대하여<br>$A\cup B\cup C=A$, $A\cap B\cap C=\varnothing$을 만족하는 집합 $C$의 개수를 구하는 과정을 서술하시오. [7점]
- 보기: []; 정답: $15$
- 기존 solution 핵심 원문: `$=(z-1)-z=-1$이다.` / `따라서` / `$z^6=(z^3)^2=(-1)^2=1$이므로 $B\subseteq A$이다.` / `이제 $A$의 원소의 개수를 구한다.`
- 판정·독립 검산: z=s+ti에서 s=1/2, t=±√3/2; B의 각 원소는 z²-z+1=0→z³=-1→z⁶=1이므로 B⊆A. z⁶-1 인수분해로 서로 다른 여섯 근, n(A\B)=4, 공집합 아닌 C는 2⁴-1=15. 독립 원소 개수 검산. 복소수는 고1 공통수학1 개념도 포함하는 고1 범위이므로 과목 분류 재확인 QA 필요하나 수학적 해설은 KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q20-solution.svg; 실물 시각 판독 NOT_RUN.

## Q21 — KEEP (READ_EVIDENCED, QA_NOT_RUN)

- sourceIdentityKey: `sha256:d8cfc9ae74b38e1fd2ead13d054b39a0802fb217581c127e6e394817888a1ac1|서술형3`; ordinal: 21; sourceBlobSha: `e12c566f55a9f2d5c59c181a34dac741eb57c676`
- 문제 원문: &lt;서술형3&gt;<br>좌표평면 위의 두 점 $A(6,-1)$, $B(2,5)$에 대하여 $\angle APB=45^\circ$를 만족시키는 점 $P$가 있다.<br>세 점 $A$, $B$, $P$를 지나는 원을 $C$라 할 때,<br>원 $C$의 중심이 지나는 모든 $x$좌표의 값들의 곱을 구하는 과정을 서술하시오. [7점]
- 보기: []; 정답: $7$
- 기존 solution 핵심 원문: `따라서 원의 중심은 $M$에서 수직이등분선을 따라` / `거리 $\sqrt{13}$만큼 떨어진 두 점이다.` / `직선 $AB$의 기울기는` / `$\dfrac{5-(-1)}{2-6}=-\dfrac32$이므로`
- 판정·독립 검산: AB=2√13, ∠APB=45°에서 AB에 대한 작은 중심각 90°, R²=26. M=(4,2), OM²=26-13=13, 수직이등분선 k-2=(2/3)(h-4)에서 (13/9)(h-4)²=13→h=1 또는7, 곱7. 독립 중심 (1,0),(7,4)에서 A,B까지 거리√26 확인. KEEP.
- 그림: 문제 image 없음; 해설그림: assets/images/26_매산고_2학기_중간_고1_기출/q21-solution-v2.svg; 실물 시각 판독 NOT_RUN.

## 남은 작업

Q1–Q21 문항별 텍스트 감사 근거 기록. 그림 원본 q12,q15,q18 실물 미확인으로 VISUAL_HOLD; Golden/Negative·렌더 출고 검증 NOT_RUN. 운영 PASS 아님.
