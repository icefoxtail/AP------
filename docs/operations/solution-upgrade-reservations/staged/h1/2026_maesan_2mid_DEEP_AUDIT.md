# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

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

## 남은 작업

Q11–Q21은 아직 문항별 읽기·판정 근거를 기록하지 않았다. 이 문서를 완료로 취급하지 말고 같은 claim을 이어받아 Q11부터 순서대로 진행한다.
