# 2025 팔마고 QID9 q13~q16 — GPT 공개답 품질검수·핀포인트 수정 CURRENT

- 날짜: 2026-10-09 KST
- 기준 브랜치: `work/alive-25-palma-h1-2mid-qid9`
- 범위: 원본 q13~q16, A1~C3 각 9개, 고유 UID 36개
- 품질 방법: 학생 최종 발문·5지·정답·해설 공개 검토 → 수학·경계/조건 확인 → 오답 4개 근거·Meta 대조. 학교 기출 R1/R2 blind 대신 ALIVE 공개답 전용 계약 적용
- 판정: **KEEP 33 / REVISED 3 / HOLD 0**, math answer 36/36, 5지 및 오답 4/4 36/36, source QID별 locked primary L3 유지. 본 검수는 실제 브라우저 Chrome 기술 QA와 구별하며, 미수행 렌더를 PASS로 주장하지 않음
- 원본 production JS 및 앞서 출시된 q01~q12 생성문항은 변경 없음

## 검수 증거 요약

1. **q13 (9/9)** — 정수 약수의 양·음수 부호, 부분집합의 원소 수/필수 포함/쌍 커버를 독립적으로 비공집합 전체 부분집합 열거로 확인. 슬롯별 실제 계수 결과: A1 127 / A2 511 / A3 2047 / B1 1024 / B2 512 / B3 38 / C1 41 / C2 32 / C3 120. stored answer 9/9 일치.
2. **q14 (9/9)** — 양화명제 부정의 경계 포함, 이차식의 실제 최댓값·최솟값, 정수 매개변수 구간을 확인. B3의 적격 `a`: -8,-7,-6,6,7,8 (6개); C2: -6,-5,-4,-3,6,7,8 (7개); C3: `k=5,6,7,8,9`, 합 35. C1 제한 구간 끝점/꼭짓점 분기 결과 `a≥√3` 확인. 기존 C2 수정된 발문 그대로 KEEP.
3. **q15 (9/9)** — A1~A3의 다항식 항등 비교를 다양한 실수 격자에 대해 확인했고, B1/B2/B3 치환 후 원의 중심·계수 관계, C1/C2/C3 반사·평행이동 합성, C3 접선 `t=2`를 재확인. 모든 정답과 5지 대응 일치.
4. **q16 (9/9)** — A1/A2/A3, B1, C1의 집합 연산 참·거짓을 유한 전체집합의 가능한 포함관계별 부분집합 조합으로 확인. B2 `|A-B|=4`, B3 `|B|=3`, C2 `|U-(A∩B)|=9`, C3 배수집합 합집합 13/교집합 3/외부 7 → 답 10. 원본 q16의 별도 표기 모호성 기록은 기존 source provenance로 유지하고, 생성된 학생 발문의 조건은 자체 완결됨.
5. **전체** — 발문 질문 대상·선지 문형·정답 유일성·해설 최종 결론, 5개 보기, 각 오답 번호의 witness/actual choice 1:1을 검토. 원본 `<보기>`가 HTML 태그로 해석될 수 있는 q15 A1/A2/A3 3개만 조판 결함 확정.

## 핀포인트 수정 — q15 A1/A2/A3

- 수정 전: `다음 <보기> 중 ...?\\n<보기>\\nㄱ...\\nㄴ...\\nㄷ...` (미이스케이프 HTML 태그·불명확한 보기 경계)
- 수정 후: `다음 보기에서 ...?<br><br>〈보기〉<br>ㄱ...<br>ㄴ...<br>ㄷ...` (문장 속 '보기'는 평문, 독립 라벨·항목 경계는 명시 줄바꿈)
- **수정 커밋:** `f4e48c10fa4d0e383f5752a0399cec217e7535e3`
- 수정되지 않은 q15 B1~C3 및 q13/q14/q16 원문의 내용·보기·정답·해설은 KEEP. q15 A1~A3은 표면 조판만 변경하여 기존 수학적 정답·오답 근거 무효화 불필요; 최종 `content`를 기준으로 조판 재확인.

## 최종 UID별 판정

### 원본 q13 (9/9)

| 슬롯 | UID | 판정 |
|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q13-A1` | KEEP |
| A2 | `ALITE-PALMA25-2MID-Q13-A2` | KEEP |
| A3 | `ALITE-PALMA25-2MID-Q13-A3` | KEEP |
| B1 | `ALITE-PALMA25-2MID-Q13-B1` | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q13-B2` | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q13-B3` | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q13-C1` | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q13-C2` | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q13-C3` | KEEP |

### 원본 q14 (9/9)

| 슬롯 | UID | 판정 |
|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q14-A1` | KEEP |
| A2 | `ALITE-PALMA25-2MID-Q14-A2` | KEEP |
| A3 | `ALITE-PALMA25-2MID-Q14-A3` | KEEP |
| B1 | `ALITE-PALMA25-2MID-Q14-B1` | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q14-B2` | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q14-B3` | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q14-C1` | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q14-C2` | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q14-C3` | KEEP |

### 원본 q15 (9/9)

| 슬롯 | UID | 판정 |
|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q15-A1` | REVISED |
| A2 | `ALITE-PALMA25-2MID-Q15-A2` | REVISED |
| A3 | `ALITE-PALMA25-2MID-Q15-A3` | REVISED |
| B1 | `ALITE-PALMA25-2MID-Q15-B1` | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q15-B2` | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q15-B3` | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q15-C1` | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q15-C2` | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q15-C3` | KEEP |

### 원본 q16 (9/9)

| 슬롯 | UID | 판정 |
|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q16-A1` | KEEP |
| A2 | `ALITE-PALMA25-2MID-Q16-A2` | KEEP |
| A3 | `ALITE-PALMA25-2MID-Q16-A3` | KEEP |
| B1 | `ALITE-PALMA25-2MID-Q16-B1` | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q16-B2` | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q16-B3` | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q16-C1` | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q16-C2` | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q16-C3` | KEEP |

## 출시 상태 분리

- `GPT_OPEN_BOOK_REVIEW_PASS`: 36 UID. 3 UID는 변경된 학생용 최종 발문 기준 승인.
- `actualBrowserRender`: NOT_TESTED (검수 수행 시점).
- `studentConsumer/index` 와 `main/remote readback`: 품질 판정과 별도의 publication 상태. 실제 물리 등록·Chrome 결과를 확인하기 전까지 MAIN_DONE 선언 금지.
- 검수/수정 업무 산출물의 영속화는 이 원장 및 각 q13~q16 package `reviewStatus`를 통해 확인.
