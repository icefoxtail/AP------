# 팔마고 q16 — 출제 GPT 역발문/자가점검 원장 (2026-10-09)

- 정본 시험지: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`; 원본 Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`; q16, 객관식, 상/4, 4.8점.
- **원본 source 감사 충돌 별도 보존:** 원문의 `B⊂{U−(Aᶜ∪Bᶜ)}` 중괄호는 source solution의 `B⊆A∩B` 처리와 표기 충돌. q16 신규 생성에서는 의도된 관계를 **명확한 집합 연산식/포함 기호로 새로 정의**했으며, 원본을 교정하거나 원본 PDF 검증 PASS라고 기록하지 않음.
- RPM Primary L3: **집합의 연산법칙**. 기존 검증 직접 매핑 H1-RPM-241(드모르간 법칙), H1-RPM-242(복합 연산). PT_SET_OPERATION_LAW 및 TPL_OPERATION_LAW_JUDGMENT / TPL_OPERATION_LAW_COMPOSITE 재사용. RPM LOCKED·원본 기출 불변.
- Candidate **9/9**, 제작자 역발문 `KEEP 9 / REVISED 0 / HOLD 0`. 네 오답 번호의 실제 잘못된 집합식 또는 집합 수 계산·반례 확인 `36/36`. 학생용 이미지·SVG는 필요 없음.
- A1/A2/A3/B1/C1: 전체집합 3원소 내 64개 순서쌍 중 전제 만족 모델을 열거하여 항상 참·거짓 패턴 확인. B2/B3/C2/C3: 기약 집합 원소·포함배제 수치 직접 확인.
- 사용자 지시는 **q16 제작 진행**. 이 품질 제작자의 자체검사는 독립 GPT 검수나 `USER_DIRECTED_QUALITY_APPROVED`를 임의 생성하지 않음. `GPT_OPEN_BOOK_REVIEW_NOT_RUN`, `CONSUMER_NOT_REGISTERED`, `CHROME_NOT_TESTED`. q14·q15의 미생산 상태는 강제로 완료 표시하지 않음.

| 슬롯 | 정답 | L4 · 사고 경험 | Reverse stem | 오답 재현 |
|---|---|---|---|---|
| A1 | ③ | 복합 연산 · 포함 전제를 여집합·교집합으로 전환하고 네 항등식을 판정 | KEEP | 4/4 |
| A2 | ⑤ | 복합 연산 · 포함 관계의 방향을 바꾸어 같은 복합 식을 판단 | KEEP | 4/4 |
| A3 | ① | 복합 연산 · 기호 치환 뒤 포함 관계와 연산 방향의 동시 판정 | KEEP | 4/4 |
| B1 | ④ | 복합 연산 · 서로소 분해로 집합 전체를 재구성하는 합집합 항등식 | KEEP | 4/4 |
| B2 | ② | 드모르간 법칙 · 드모르간 식을 실제 유한집합 차집합으로 변환 | KEEP | 4/4 |
| B3 | ① | 드모르간 법칙 · 완성된 복합 집합식을 거꾸로 정리하여 미지 집합을 복원 | KEEP | 4/4 |
| C1 | ⑤ | 복합 연산 · 역방향 집합식에서 숨은 포함관계를 찾아 검증 | KEEP | 4/4 |
| C2 | ② | 복합 연산 · 두 집합의 분해와 공통영역의 중복 제거를 연결 | KEEP | 4/4 |
| C3 | ④ | 드모르간 법칙 · 서로소인 여집합 영역과 겹치는 영역의 합집합 크기 계산 | KEEP | 4/4 |

## 핵심 역독해
- 원본의 중괄호를 신규 발문에 복사하여 학생 혼동을 재현하지 않았음. 모든 학생용 식은 여집합/차집합 범위가 명확함.
- A: 전제에서 포함관계를 복원한 다음 각 문장의 진위 결정이 필수. B: 유한집합·역관계 등으로 표현 전환. C: 역조건·서로소 분해·포함배제 등 추가 실제 판단 필요.
- 어느 문항도 정답·해설이 학생용 발문에 누설되지 않고, 객관식 다섯 보기는 각각 다른 응답이며 정답은 하나임.
- `matchedChoice`형 텍스트 증거의 수학적 근거를 `distractorReasons`에 상세 보존. 변경 없이 최종 후보를 작성한 것으로 KEEP 처리.
- 별도 GPT 공개답 검수 시 학생용 한국어·정답/보기·경계 반례·오답 경로를 먼저 보고 필요한 UID만 핀포인트 조정. 원본 source fidelity의 중괄호 쟁점은 작업용 unresolved provenance로 유지.

## 숫자/부울 증거 요약
- A1 ③ 상/4 H1-RPM-242 포함 전제를 여집합·교집합으로 전환하고 네 항등식을 판정
- A2 ⑤ 상/4 H1-RPM-242 포함 관계의 방향을 바꾸어 같은 복합 식을 판단
- A3 ① 상/4 H1-RPM-242 기호 치환 뒤 포함 관계와 연산 방향의 동시 판정
- B1 ④ 중/3 H1-RPM-242 서로소 분해로 집합 전체를 재구성하는 합집합 항등식
- B2 ② 중/3 H1-RPM-241 드모르간 식을 실제 유한집합 차집합으로 변환
- B3 ① 상/4 H1-RPM-241 완성된 복합 집합식을 거꾸로 정리하여 미지 집합을 복원
- C1 ⑤ 상/4 H1-RPM-242 역방향 집합식에서 숨은 포함관계를 찾아 검증
- C2 ② 상/4 H1-RPM-242 두 집합의 분해와 공통영역의 중복 제거를 연결
- C3 ④ 상/4 H1-RPM-241 서로소인 여집합 영역과 겹치는 영역의 합집합 크기 계산

## META-FIRST 영구보존 준비 — q16 신규 후보

- Primary RPM L3 `집합의 연산법칙`, record `H1-RPM-241/242`, PT·TPL은 이미 ACTIVE인 canonical을 재사용.
- canonical `COND_RANGE`: B2/B3/C3의 유한 원소범위에 실제 적용.
- Generated-only 조건 `EXT-COND-H1-Q16-SUBSET-INCLUSION`: A1/A2/A3/B1/B3/C1 포함관계의 방향이 판정의 핵심인 6 UID.
- Generated-only 조건 `EXT-COND-H1-Q16-UNION-COVER`: C2의 `A∪B=U`와 유한 원소 수 조건 1 UID.
- Generated-only 교차개념 `EXT-CC-H1-Q16-DIVISIBILITY-MULTIPLES`: C3의 정수 배수/공배수 계산 1 UID.
- registry: `archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-meta/palma-q16-cross-concepts-conditions.json`. `9 UID × meta.conditionKeys/crossConceptKeys`를 Source candidate에 결속. RPM LOCKED 변경 없음, Consumer/index는 독립 품질승인과 기술 출고 전까지 미등록.
