# 복성고 2026 B03 38문항 학생용 입력 독립풀이 동결

> Source student-only JS blobs: Q09 `53e64e5ffed64a810c1074a0999ecc846ee05de2`, Q13 `aad4768126f448344d8fece65269d9b388757453`, Q14 `1923ce75195a3d24fbd0682f2a4000c2228a9078`, Q16 `cf7d6c86b9a44082dfc5c53b02cfb909f37b4c24`.

> **동결 시점:** 저장 정답과 solution을 `fetch_file` 출력/비교하기 전. 단 생성 인덱스 preview가 `Q09-S01/S02`의 답 위치를 공개했으므로 두 건은 `ANSWER_EXPOSED_BEFORE_FREEZE`로 오염 표시한다. 나머지 36개는 학생용 발문+선지만 인지한 판정이다.

> 학교 original Git blob `8266fa476906e9134b94f23e803bd3b2fb26ece4`. 수정 후 학생용 입력이 달라진 UID는 이 freeze 재사용 불가.

| UID | 독립 계산값 | 동결 번호 | 접근 오염 | 계산 근거 |
|---|---:|:---:|---|---|
| ALITE-BSG26-B03-Q09-S01 | 36 | ① | ANSWER_EXPOSED_BEFORE_FREEZE | 소수 4개 중 2·비소수 6개 중 1 → 6×6 |
| ALITE-BSG26-B03-Q09-S02 | 40 | ③ | ANSWER_EXPOSED_BEFORE_FREEZE | 세 수 합 홀수: 홀1 짝2=30, 홀3=10 |
| ALITE-BSG26-B03-Q09-S03 | 66 | ① | CLEAN_STUDENT_FIRST | 네 수 합 짝수: 홀0짝4=1+홀2짝2=60+홀4짝0=5 |
| ALITE-BSG26-B03-Q09-S04 | 63 | ④ | CLEAN_STUDENT_FIRST | 3의 배수3개 중 하나, 나머지7개 중 둘=3×21 |
| ALITE-BSG26-B03-Q09-S05 | 15 | ① | CLEAN_STUDENT_FIRST | 가장 작은 수 4 확정, 5~10에서 둘 고름=15 |
| ALITE-BSG26-B03-Q09-S06 | 24 | ④ | CLEAN_STUDENT_FIRST | 홀수4개 중 하나·짝수4개 중 둘=4×6 |
| ALITE-BSG26-B03-Q09-S07 | 52 | ⑤ | CLEAN_STUDENT_FIRST | 전체 C(8,3)=56-소수 없는 C(4,3)=4 |
| ALITE-BSG26-B03-Q09-S08 | 19 | ② | CLEAN_STUDENT_FIRST | 3의 배수 중 둘 3×6=18 + 셋 1 |
| ALITE-BSG26-B03-Q09-S09 | 9 | ③ | CLEAN_STUDENT_FIRST | 1은 홀수, 나머지 둘의 합 짝수: 홀홀3+짝짝6 |
| ALITE-BSG26-B03-Q09-S10 | 18 | ③ | CLEAN_STUDENT_FIRST | 소수 짝홀 3×짝수비소수4=12 + 소수 홀홀3×홀수비소수2=6 |
| ALITE-BSG26-B03-Q13-R01 | -1 | ② | CLEAN_STUDENT_FIRST | 켤레 비실수 세제곱근의 합=-1 |
| ALITE-BSG26-B03-Q13-R02 | -1 | ③ | CLEAN_STUDENT_FIRST | w7=w, w11=w², 합=-1 |
| ALITE-BSG26-B03-Q13-R03 | 1 | ① | CLEAN_STUDENT_FIRST | 1+w=-w², 1+w²=-w, 역수의 합=-w-w²=1 |
| ALITE-BSG26-B03-Q13-R04 | 3 | ⑤ | CLEAN_STUDENT_FIRST | (1-w)(1-w²)=1-(-1)+1=3 |
| ALITE-BSG26-B03-Q13-R05 | 6 | ① | CLEAN_STUDENT_FIRST | 실수 w^n=1인 n은 3의 배수; 1~20 총 6 |
| ALITE-BSG26-B03-Q13-R06 | -3 | ② | CLEAN_STUDENT_FIRST | (w-w²)²=(w+w²)²-4w³=1-4 |
| ALITE-BSG26-B03-Q13-R07 | 1 | ④ | CLEAN_STUDENT_FIRST | 1+w=-w² → (1+w)^6=w^12=1 |
| ALITE-BSG26-B03-Q13-R08 | 2 | ⑤ | CLEAN_STUDENT_FIRST | x³-1=(x-1)(x²+x+1), a+b=2 |
| ALITE-BSG26-B03-Q13-R09 | -1 | ② | CLEAN_STUDENT_FIRST | 20=3×6+2, 마지막 w+w²=-1 |
| ALITE-BSG26-B03-Q14-I01 | 6 | ① | CLEAN_STUDENT_FIRST | D>=0 ↔ |k|>=3, -5..5 정수 6 |
| ALITE-BSG26-B03-Q14-I02 | 6 | ⑤ | CLEAN_STUDENT_FIRST | 최솟값 k-9>0, k=10..15 6개 |
| ALITE-BSG26-B03-Q14-I03 | 6 | ② | CLEAN_STUDENT_FIRST | 실근 없음 ↔ (k-2)²<4 ⇒ k=1,2,3 합6 |
| ALITE-BSG26-B03-Q14-I04 | 3 | ③ | CLEAN_STUDENT_FIRST | [1,k+3] 정수 수 k+3=6 ⇒k3 |
| ALITE-BSG26-B03-Q14-I05 | 4 | ④ | CLEAN_STUDENT_FIRST | 접하는 중근 1개 ↔ k²=16, 자연수 k4 |
| ALITE-BSG26-B03-Q14-I06 | 5 | ② | CLEAN_STUDENT_FIRST | x²-4x+k의 최솟값 k-4>0 => k 최소5 |
| ALITE-BSG26-B03-Q14-I07 | 3 | ③ | CLEAN_STUDENT_FIRST | [1,3]에서 최대 x²-4x=-3이므로 k<=3 |
| ALITE-BSG26-B03-Q14-I08 | 21 | ⑤ | CLEAN_STUDENT_FIRST | 정수해 정확히3개: k=6,7,8 ⇒합21 |
| ALITE-BSG26-B03-Q14-I09 | 5 | ③ | CLEAN_STUDENT_FIRST | k,k+1,k+2의 합 3k+3=18 ⇒k5 |
| ALITE-BSG26-B03-Q14-I10 | (가),(나) | ④ | CLEAN_STUDENT_FIRST | k=2 하나의 실근 참, k=1 판별식음수 참, k=3 양 끝은 3±√5라 (다) 거짓 |
| ALITE-BSG26-B03-Q16-F01 | 11 | ① | CLEAN_STUDENT_FIRST | n=1이면 0 하나만, n=2..12는 ±(n-1),±(n+2) 서로 다름 |
| ALITE-BSG26-B03-Q16-F02 | 9 | ④ | CLEAN_STUDENT_FIRST | n 1~10 중 5만 25와 중복 |
| ALITE-BSG26-B03-Q16-F03 | 36 | ⑤ | CLEAN_STUDENT_FIRST | x²=4,9 근 ±2,±3 곱36 |
| ALITE-BSG26-B03-Q16-F04 | 10 | ① | CLEAN_STUDENT_FIRST | 근 ±1,±2 제곱합 2+8=10 |
| ALITE-BSG26-B03-Q16-F05 | 3 | ④ | CLEAN_STUDENT_FIRST | n=1,9,16일 때 ±√n가 정수이며 ±2와 다름 |
| ALITE-BSG26-B03-Q16-F06 | 2 | ② | CLEAN_STUDENT_FIRST | x²=9만 정수근 ±3 |
| ALITE-BSG26-B03-Q16-F07 | -25 | ③ | CLEAN_STUDENT_FIRST | 양의 두 근 3,4 → (x²-9)(x²-16)=x4-25x2+144 |
| ALITE-BSG26-B03-Q16-F08 | 164 | ④ | CLEAN_STUDENT_FIRST | 근 ±1,±3 네제곱합2+162=164 |
| ALITE-BSG26-B03-Q16-F09 | 2 | ① | CLEAN_STUDENT_FIRST | (x²-1)²=0 서로 다른 실근 ±1 2개 |

## 총계
- 38 UID 동결; `CLEAN_STUDENT_FIRST` 36 / `ANSWER_EXPOSED_BEFORE_FREEZE` 2.
- 풀이 기반 번호 히스토그램: ①9, ②7, ③8, ④8, ⑤6.
- 아직 저장 정답·해설, Meta/RPM, 오답 적절성, 중복, 범위, Consumer 등록 검토 전. 이 동결은 수학 검수의 최초 단계이자 대조 전 증거다.
