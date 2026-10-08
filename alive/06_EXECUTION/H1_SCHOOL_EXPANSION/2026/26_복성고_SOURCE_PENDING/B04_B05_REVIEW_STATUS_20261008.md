# 복성고 B04·B05 독립 재계산 및 학생 공급 게이트 — 2026-10-08

## 대상·Authority
- 학생용 수리본 기준: `pilot/alive-lite-bokseong-b04-b05-blueprint-r2-20261008` / `f8bc815938550471aed680855427bc92f16c0b4f` / PR #326.
- 별도 REVIEW 핀포인트 브랜치: `review/alive-lite-bokseong-b04-b05-20261008`. B05 q21 S07 학생용 해설의 집합 중괄호만 정확히 1개 필드 수정, 다른 문항·정답·보기·원본 기출 불변.
- 범위: B04 원본 q17 9·q20 9·q23 8 = 26; B05 원본 q21 9·q22 10 = 19; 총 **45 UID**.
- 상세 UID·계산·정답비교·Git shard SHA: [B04_B05_REVIEW_RECOMPUTE_HOLD_LEDGER_20261008.json](B04_B05_REVIEW_RECOMPUTE_HOLD_LEDGER_20261008.json).

## 실제 재계산과 공식 REVIEW의 구별
- 학생용 발문·보기 기반 수학 재계산: **45/45**. 재계산값과 저장 answer 수치/표현 비교 MATCH **45/45**.
- 객관식 **23/23**: 각 5지 확인, 계산값이 나오는 위치 정확히 한 개, 번호 중복 0. 주관식 **22/22**: 재계산값과 저장 답 일치. 기존 해설의 핵심 수학 및 결론 대조 완료.
- **엄격한 blind REVIEW는 PASS가 아니다.** 이번 세션에서 index의 `answerValue`가 독립 풀이의 불변 freeze보다 먼저 노출되었다. 따라서 뒤에 같은 답을 재계산했더라도 `A1_BLIND_FREEZE` evidence는 무효. `FORMAL_INDEPENDENT_REVIEW=NOT_COMPLETED`, `APPROVED_UIDS=[]`.
- 단순 객관식 유일정답 검사와 오개념 기반 오답의 교육적 적절성은 별개다. 후자는 학생용 최종 REVIEW/렌더에서 확정한다.

## 객관식 정답 위치 전후 (23개 기준)
| 분모 | ① | ② | ③ | ④ | ⑤ |
| --- | ---: | ---: | ---: | ---: | ---: |
| 현재 REVIEW 대상 23개, 전 | 4 (17.4%) | 5 (21.7%) | 8 (34.8%) | 4 (17.4%) | 2 (8.7%) |
| 현재 REVIEW 대상 23개, 후 | 4 (17.4%) | 5 (21.7%) | 8 (34.8%) | 4 (17.4%) | 2 (8.7%) |
| 승인 0개 / 전후 | 0 | 0 | 0 | 0 | 0 |
| 분류 HOLD q22 10개 / 전후 | 0 | 0 | 0 | 0 | 0 |

- 가장 큰 ③ 비율 34.8%, 40% 경보 이하. **보기/정답 위치 변경 0건**, `CHOICE_ORDER_LOCKED` 새 판정 없음. HOLD q22는 주관식만 포함.
- 기존 설계계획의 목표 위치는 학생 실제 분포가 아니며 `historicalChoicePositionPlan`만 남는다.

## UID별 주요 결함·미해결
1. B05 **q21 S01~S09 9 UID**: 실제 조합 선택 구조. `H22-C-08-COMBINATION`, RPM `H1-RPM-194` `조합의 활용/선택 조건` 의미 일치. 학습용 미세 표기 결함 S07 기존 `${1,2}$` → 해설 `$\\{1,2\\}$`로 핀포인트 교정. 재확인 결과 수학값 60, 정답 불변. 완전 clean blind 및 학생 조회는 미완료.
2. B05 **q22 S01~S10 10 UID**: 절댓값 연립조건과 이차부등식/공통 정수해·매개변수 복합. 현재 RPM exact L3/L4 없음. `연립일차부등식`이나 AM-GM 계열 `절대부등식`으로 허위 매핑 금지. **10 UID 분류 HOLD**, no canonical write. H1 ACTIVE PT/TPL reuse 후보만 존재하고 RPM 승격 확정 아님.
3. B04 **26 UID**: 숫자 수학은 일치하나 `DIRECT_BINDING_GAP` active PT/TPL ↔ MATRIX_OPERATION/APPLICATION 하위단원 결속 부채. RPM 자체 `행렬의 연산/성질`은 존재. q23 8 UID의 primary L3/L4 `행렬의 성질/곱셈의 성질`이 경로수/행렬곱셈 문제의 핵심과 맞는지 재판정 대상. 정본 신규 유형 임의 등록하지 않음.
4. 학생 화면 구조: 기존 `archive/generated-bank.html`는 `choices.length===5`만 승인 조회를 허용하여 **22개 주관식 조회 실패**, q23 S01 HTML table을 `textContent`로 노출. 제한적 코드 수정 [PR #328](https://github.com/icefoxtail/AP------/pull/328)에서 진행(기존 승인 130 UID 보호). 독립 REVIEW나 실등록 완료 증거로 승계 불가.

## 등록·publication — 엄격한 현재값
- `REVIEW_PASS=0/45` (선행 값 누출로 formal gate invalid).
- `RPM_EXACT_L3_L4_HOLD=10`; `PT_BINDING_REVIEW_PENDING=26`; `OTHER_REVIEW_PENDING=9`.
- `CONSUMER_DB_REGISTERED_NEW=0` / `STUDENT_SELECTABLE_NEW=0` / `STUDENT_LOOKUP_VERIFIED_NEW=0`.
- `B04_B05_MAIN_PUBLISHED_UIDS=0`. 복성고 production 승격 커밋 **없음**. 기존 원본·B03/효천고 Consumer 승인 레코드 보호.
- 실제 수리본 q21 S07 current shard Git blob: `a52484a92dcc43bfeaf92d2e744b8f737c06f355`. 수정 후 전체 R2 evidence / SHA 재생성은 아직 미수행.
- `FINAL_STATUS=REVIEW_PENDING_NOT_MAIN_DONE`. DB/학생 화면 실검증 없이 MAIN_DONE 기록 금지.

## 다음 정상 조치
- 새로 완전히 분리된 clean student-only bundle에서 45 전 문항 독립 풀이를 물리 동결한 후 stored answer/solution을 처음 공개.
- q22 10개 exact RPM L3/L4 결정 또는 UID별 HOLD 유지, B04 26개 기존 PT/L3/L4 binding 의미 검증 및 필요한 좁은 metadata migration.
- 승인된 문항의 학생용 5지 distractor 품질/해설/렌더를 확인하고 Consumer adapter에서 주관식·표 조회/선택, 1개 대표 표 문항 및 1개 일반 문항, HOLD 거부 실제 Chrome 검증.
- 기존 130 승인 UID·original 경로 보존, 승인 UID만 consumer DB 등록 후 조회 증거 및 selected main commit/remote SHA readback. 이전 CREATE 검수로 REVIEW PASS 승계 금지.
