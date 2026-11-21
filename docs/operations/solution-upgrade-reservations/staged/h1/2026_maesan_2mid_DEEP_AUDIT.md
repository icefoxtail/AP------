# 2026 매산고 고1 2학기 중간고사 — 심층 감사 (진행 중)

- lane: lane40; course: 공통수학2; sourceKind: original; sourceTerm: 2mid; year: 2026
- sourcePath: archive/exams/original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js
- sourceBlobSha: e12c566f55a9f2d5c59c181a34dac741eb57c676; totalQuestions: 21; readEvidence: 5; KEEP: 5; UPGRADE: 0; HOLD: 0; UNREAD: 16
- nextQid: 6; unfinished: q6–q21 full review and any upgrades; QA: Golden/Negative gate and visual render NOT_RUN; release PASS NOT_CLAIMED
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

## 남은 작업

Q6–Q21은 아직 문항별 읽기·판정 근거를 기록하지 않았다. 이 문서를 완료로 취급하지 말고 같은 claim을 이어받아 Q6부터 순서대로 진행한다.
