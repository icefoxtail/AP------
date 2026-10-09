# 2025 팔마고 고1 2학기 중간 — 원본 q14 A1~C3 제작자 역발문 자가검토

- 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`, 원본 q14 / 정답 ① / 원본 이차식의 최댓값과 명제 부정.
- 잠금 Primary RPM L3: **명제와 조건** (`H1-RPM-244`, L4 `명제의 참·거짓`); 기존 Generated `EXT-H1-C2-06-Q02-QUANTIFIER-NEGATION` 재사용.
- 원본 수학: 전칭 f(x)<0 부정은 존재 f(x)≥0, 이차식 최대 a²/4-5에서 a²≥20.
- 학생용 문항은 실수 x/매개변수 a/양화사/부등호 범위를 발문에 명시; 외부 문제 도형·이미지 없음(9/9).
- 최종 제작자 자가검수: **KEEP 8 / REVISED 1 / HOLD 0**, 답 위치 ①2·②2·③2·④2·⑤1, 오답 번호 36/36 1:1 연산 경로 연결.
- A/B 일부 실수 경계값 샘플과 완전제곱 논리, B3/C2/C3는 모든 허용 정수를 실제 열거. 연속 실수 범위는 해설의 정확한 부등식 변형으로 증명했으며 유한 샘플만으로 전체 수학 PASS를 주장하지 않는다.
- 기존 q01~q13 후보, 원본 production, 학생용 Consumer, RPM LOCKED 수정 없음.

## UID별 역발문 및 실제 확인

| UID | 학생이 실제로 판단할 내용 | 정답 | 오답 근거 | 판정 |
|---|---|---|---|---|
| `ALITE-PALMA25-2MID-Q14-A1` | 전칭 음수 부정→존재 비음수→이차식 최댓값과 등호 | ③ | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-A2` | 전칭명제를 존재명제로 부정→-2x²의 꼭짓점·최댓값 판정 | ⑤ | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-A3` | 2ax의 완전제곱→0 이상 존재성→양쪽 경계 판정 | ① | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-B1` | 어떤 x에서 0 이하의 부정은 모든 x에서 양수→이차함수 최솟값의 엄격 경계 | ④ | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-B2` | 구간 내 전칭명제의 부정→존재 x→구간 안 꼭짓점에서 최대 0 이상 | ② | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-B3` | 전칭 부정으로 매개변수 양쪽 범위→정수 경계 세기 | ④ | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-C1` | 제한된 구간의 전칭 부정→존재 x→꼭짓점이 구간 안팎일 때 분기→a 경계 | ① | 4/4 | KEEP |
| `ALITE-PALMA25-2MID-Q14-C2` | 서로 다른 전칭명제의 부정을 각각 계산→두 매개변수 영역 교집합→정수 개수 | ② | 4/4 | REVISED |
| `ALITE-PALMA25-2MID-Q14-C3` | 부정이 참인 a가 정확히 여섯 개→/a/≥3이어야 함→k의 열린/닫힌 경계 역산 | ③ | 4/4 | KEEP |

## 제작자 직접 수정: C2 학생 질문의 지시 대상

- 초기 발문 끝은 ‘... q: ... 의 부정이 모두 참’이어서 독자가 직전 q의 부정만 읽을 여지가 있었다.
- **수정 전:** `$-6\le a\le8$인 정수 $a$에 대하여 두 명제<br>$p$: ‘모든 실수 $x$에 대하여 $-x^2+2ax-9<0$이다.’<br>$q$: ‘모든 실수 $x$에 대하여 $-x^2+2(a-4)x-4<0$이다.’<br>의 부정이 모두 참이 되도록 하는 $a$의 개수는?`
- **수정 후:** `$-6\le a\le8$인 정수 $a$에 대하여 두 명제<br>$p$: ‘모든 실수 $x$에 대하여 $-x^2+2ax-9<0$이다.’<br>$q$: ‘모든 실수 $x$에 대하여 $-x^2+2(a-4)x-4<0$이다.’<br>명제 $p$의 부정과 명제 $q$의 부정이 모두 참이 되도록 하는 $a$의 개수는?`
- 영향을 받은 필드: C2 stem·reverseStem. 수학 조건은 변경하지 않고, 새 학생 입력으로 ¬p와 ¬q를 별도로 재해석해 정수 a=-6,-5,-4,-3,6,7,8 → 정확히 7을 다시 계산.
- 기존 C2 학생 발문의 모호성 판정은 STALE/SUPERSEDED; 수정 후 정답·보기·해설·오답 4개 계산 근거와 L3/Meta 영향을 재대조한 뒤 REVISED로 기록.

## Meta 및 출시 상태

- Generated L4 registry: `archive/generated/lite/v1/2022/H1/H22-C2-06-CORE/extension-l4/palma-q14-registry.json` (신규 3개 세분화, 기존 Q02 활성 L4 재사용).
- Generated CrossConcept/Condition registry: `archive/generated/lite/v1/2022/H1/H22-C2-06-CORE/extension-meta/palma-q14-cross-concepts-conditions.json` (필요 역할, parent RPM, UID 적용 증거 포함).
- 제작 내용 검산은 별도 GPT 공개답 검수 이력이 아니다. 현재 q14는 `CREATE_DRAFT_AUTHOR_SELF_REVIEW_COMPLETE` / `GPT_OPEN_BOOK_REVIEW_NOT_RUN` / `CONSUMER_NOT_REGISTERED` / `CHROME_NOT_TESTED`.
- 기존 q09~q12의 과거 내용 검토 이력은 보존하고, 다음 미제작 원본은 q15이다.
