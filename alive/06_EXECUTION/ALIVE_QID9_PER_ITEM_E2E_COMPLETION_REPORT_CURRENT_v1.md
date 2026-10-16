# ALIVE QID9 — 원본 qid별 9문항 제작 완료·개별 보고·후속 인계 계약 v1.1

> **2026-10-17 원장 최신 직접 지시 / CURRENT HARD / 수동 QID9 전용**
>
> **핵심: 「1번 진행해」는 원본 q01의 A1~C3 9문항 제작 GPT 담당 범위를 끝내라는 뜻이다. 독립 품질검수(별도 GPT), 운영 메타 영구등록(main 등록 단계), 운영 브라우저·출력(Codex)은 제작자 마감의 선행 조건이 아니다.**
>
> v1.0의 `QID_E2E_COMPLETE` 단일 게이트가 역할을 잘못 통합했으므로 본 v1.1에서 해당 게이트를 **제작 완료와 후속 단계**로 명확히 분리한다. 미실행 후속 단계를 PASS로 기록하지 않는다.

## 0. 범위·역할·단계 이동

| 구간 | 소유자 | 내용 | 다음 단계 차단 기준 |
|---|---|---|---|
| `AUTHOR_CREATE` | 제작 GPT | 원본 Source Lock, A1~C3 문항·정답·오답·학생용 해설, 난이도 두 축, 확정 근거 Meta, 필수 문제/해설 SVG, 세로 배분, 자가검증 및 **9개 개별 보고** | **제작 범위 9/9 미완료일 때만 제작 마감 불가** |
| `INDEPENDENT_REVIEW` | **다른 GPT / 독립 세션** | 저자가 동결한 실제 최종 파일에 대한 한국어 발문·수학·정답 유일성·해설·오답·난이도·Meta·시각자료 독립 평가·수정 요청 | 제작자 완료의 선행 조건 **아님**. 독립 PASS는 실제 검사 후에만 기재 |
| `MAIN_META_REGISTER` | 운영 main 등록 담당 | 승인된 UID·정본 메타를 Production source/registry→Consumer/DB→index/검색에 영구 투영하고 실제 parity 검증 | 제작자 완료의 선행 조건 **아님**. 격리 sidecar는 운영 저장과 다름 |
| `CODEX_BROWSER` | **Codex** | 운영 학생 화면 문제·보기·정답·해설·수식·SVG·모바일·인쇄 검증, 필요시 수정·재검·원격 readback | 제작자 완료의 선행 조건 **아님**. 작성자 자체 Chrome은 공식 브라우저 PASS를 대체 못함 |

- 수동 QID9 작업에서 사용자의 `q01 진행해`는 **`QID_AUTHOR_COMPLETE`**를 목표로 한다. 제작 GPT가 독립 검수자·Codex·운영 등록 담당인 척하거나 그들 업무를 대신 수행·보고하면 안 된다.
- **제작자 9/9 완료 → 즉시 `READY_FOR_INDEPENDENT_GPT_REVIEW`**. 이후 검수/등록/브라우저 0/9·`NOT_RUN`이어도 제작자 성공을 실패로 강등하지 않고, **다음 qid 제작 진행 가능**. 검수자의 실제 FAIL/수리요청이 생기면 *해당 UID·직접 영향만* 제작 GPT가 고쳐 새 SHA로 재인계한다. 관련 후속 검사는 새 SHA 기준 재확인한다.
- `QID_AUTHOR_INCOMPLETE`는 Source Lock, 9개 문항, 필수 Meta·난이도·오답·해설·필수 그림, 자기검수, 개별 보고 등 **제작자가 소유한 항목**에 결손이 있는 경우에만 사용한다. 독립 GPT·운영 메타·Codex Browser 미실행은 이 사유에 넣지 않는다.
- 최종 운영 사용 가능(`RELEASE_VERIFIED`)은 독립검수/승인·main 메타 등록·실제 브라우저 등 *해당 별도 담당자의* 증거를 수납한 후에만 가능하다. `QID_AUTHOR_COMPLETE`는 `INDEPENDENT_PASS`, `MAIN_DONE`, `BROWSER_PASS`, `RELEASE_VERIFIED`가 아니다.
- 단순 제작 진행 명령을 main 병합·학생 배포 권한으로 확장하지 않는다. 기존처럼 격리 인벤토리 누적·기존 원본/유사문항·후속 초안 보호. **예약형 Library `SOURCE_ONLY_INTAKE14_20261016` CREATE→R1→R2→R3→MASTER 인계 계약에는 비적용**.

## 1. 제작 GPT 필수 수행 영역 — 개별 UID 9/9

### G0 — 정본 숙독·원본 Source Lock
- 실제 Notion 필독 라우터·Archive 시작·생명주기·생성 5단계 및 최신 Git AGENTS·QID9·Meta·교육과정·해설·Golden/Negative·시각 정본을 확인하고 문서별 경로/SHA/실제 적용 조항 기록. 정본 충돌은 최신 직접 지시와 실제 범위를 명시.
- 최신 main/원본 시험지·기존 유사/생성 인벤토리와 qid 원문(발문·선지·답·해설·에셋), **sourceUid/sourceQid/ordinal parity**, Git blob/raw SHA256, 원본 답 독립 직접 풀이, 보호·중복 점검. Source Lock 실패 시 제작 완료 불가.

### G1 — 제작·문항별 품질
각 A1~C3에 대해:
1. **불변량/Blueprint/변형 사고**: 원본 Primary RPM L3 유지, 별개 질문·추가 판단, A/B/C 위치만 바꾸는 가짜 난이도 금지.
2. **최종 자연스러운 발문·보기 5개·정답 1개**: 충분한 조건, 경계, 다중해석·우회풀이/정답 유일성 직접 점검.
3. **오답 4개 번호별 실제 재현**: 잘못된 출발→계산/판단→최종 보기 1:1; 9개 총 45개 보기·36개 오답 실근거.
4. **학생용 해설**: 중간 계산/판정·경계·조건 사용 이유·최종 결론. 학생 작은 칠판 기준, 불충분하면 제작자가 보강.
5. **난이도 독립 판정**: `level` 하·중·상과 `difficultyBucket` 1~5를 각기 **실제 사고·함정·조건·계산량** 근거로 확정. A/B/C에 기계적으로 매핑 금지.
6. **정밀 메타**: 정본 RPM L1/L2/L3/L4, Primary L3/L4, 기존 ACTIVE PT/TPL, CrossConcept·Condition·IntegrationPattern, sourceUid/sourceQid·provenance, 교육과정·standardUnit/subUnit, level/difficultyBucket. **최종 UID별 실제 지원 source/sidecar/registry에 저장하고 동일 UID로 읽어 검증**, 작성자의 설계 메모만으로 완료 불가. 현재 지원 정본키 우선, 꼭 필요한 Generated-only 확장은 실제 등록, RPM LOCKED 불변; 근거 없는 가짜 키나 `NONE` 금지.
7. **문제 SVG·해설 SVG 필요성 별도 판정**: 필요한 실제 자산이면 제작 시점에 생성·UID 연결·수학/라벨/좌표 검사, 불필요하면 각기 교육적 이유를 명시. 화면 운영 검사 자체는 Codex 담당.
8. **최종 Reverse Stem·자체 풀이/수리**: 발문·선지만 재독해, 누락/모호성·원본 L3 정합/난도·해설·오답·Meta 재확인, 변경 영향 증거 `STALE→fresh` 갱신.
9. **세로 정답 누적 우선**: 슬롯 A1~C3 각각 q01→현재 qid의 ①~⑤ 빈도, 균형 목적함수·동률 무작위 선택·현재 답/선지 재연결, 가로 2/2/2/2/1 강제 금지. 기존 가로-HARD 검사기와의 상충은 기록하고 허위 PASS 표시 금지.
10. **제작 영역 기술 검사**: 최종 JS 구문/5지/UID 9개/답/해설/오답·source-sidecar Meta 값·자산 실제 존재/경로/SHA·격리 인벤토리·이전 qid 보호를 검증하고 도구 실행 여부를 정확히 기록. 독립 검수·운영 DB/index·실제 운영 Chrome을 여기에 억지로 추가하지 않는다.

### G2 — 제작자 보고서·인계
- **9개 UID 각각 22항목 개별 보고서**를 작성한다. 아래 항목 중 **1~16,20~22는 제작자 소유**, **17~19는 후속 단계 인계 필드**로서 목적·담당자·입력 SHA·상태를 기록한다. 후속 미실행은 정상적인 `NOT_RUN / PENDING_NEXT_OWNER`이고 제작자 실패가 아니다.
- 보고서에 최종 문항 source SHA·UID 메타·Source Lock·문항별 근거·오답 4/4·수학해설·난이도 근거·시각 두 축·세로 정답 배분·발견 결함/수정 영향·검사실행 상태를 묶는다. 후속 담당자가 원본·답·메타·자산을 추가 질문 없이 열 수 있는 인계 파일/경로를 제공한다.
- 큰 이미지/로그/브라우저 스냅샷 등 비프로덕션 evidence는 격리/Drive Vault에 보관한다. 현재 제작의 Git/격리 범위 지시를 우선한다.

## 2. 원본 qid 제작자 완료 판정

```text
QID_AUTHOR_COMPLETE ⇔
  sourceLock == VERIFIED
  AND final_slots == {A1,A2,A3,B1,B2,B3,C1,C2,C3}
  AND author_math_unique_answers == 9/9
  AND choices == 45/45 AND reproduced_wrong_routes == 36/36
  AND student_solutions_complete == 9/9
  AND independently_reasoned_level_and_difficulty == 9/9
  AND canonical_L1_to_L4_PT_TPL_Cross_Condition_Integration == 9/9
  AND UID_bound_author_source_or_metadata == 9/9
  AND problem_and_solution_visual_decision_and_required_assets == 9/9
  AND reverse_stem_and_author_recheck == 9/9
  AND vertical_answer_ledger == VERIFIED
  AND source_and_existing_qids_unchanged == VERIFIED
  AND per_uid_22_field_reports_and_handoff == 9/9
  AND unresolved_AUTHOR_SCOPE_errors_or_debts == 0
```

- **아래 셋은 공식 QID_AUTHOR_COMPLETE 식에서 제외한다.** `independentGPTReview`, `productionMetaConsumerIndexRegistration`, `codexProductionBrowserPrint`. 제작자 보고서는 각 단계 `NOT_RUN/PENDING_NEXT_OWNER`과 소유자를 명시하되 완료율 분모에 더하거나 실패로 계산하지 않는다.
- 제작자 범위의 *실제 필수* 항목이 미완료이면 `QID_AUTHOR_INCOMPLETE`로 보고하고 해당 qid의 누락을 보완한다. 모든 AUTHOR_SCOPE 항목 9/9면 **다음 qid 제작 가능**, 후속 개별 검수 결과가 들어오면 기존 후보를 폐기하지 않고 수정 사항만 반영한다.
- `RELEASE_VERIFIED`는 후속 세 단계 검증 및 사용자 지시 범위의 main/학생 공급 종료를 따로 판정하며 제작자가 임의로 주장하지 않는다.

## 3. UID별 22항목 보고서 규격 (A1~C3 9회 실제 작성)

**각 항목은 단순 PASS 외에 구체적인 풀이·수치·정본 키·이유·파일/항목 SHA·실행 결과 또는 후속 담당과 인계 증거를 포함한다.**

| # | 제작자 개별 보고 항목 | 제작자 종료 시 요구 |
|---|---|---|
| 1 | UID·sourceUid·sourceQid·슬롯·source/항목 SHA·출처 | VERIFIED |
| 2 | 원본 Primary L3·교육과정·변형 후 유지/추가 사고 | 근거 |
| 3 | Blueprint·불변량·자유도·실제 추가 사고 | 근거 |
| 4 | 학생용 자연스러운 발문·조건·모호성·역발문 | 근거 |
| 5 | 객관식 5지·정답 독립 풀이·정답 유일성 | 5/5 |
| 6 | 오답 4개 번호별 실제 오류 경로 | 4/4 |
| 7 | 학생용 단계별 해설·작은 칠판 재현성 | 확인 |
| 8 | `level` 하/중/상 선정의 독립 근거 | 확인 |
| 9 | `difficultyBucket` 1~5 선정의 독립 근거 | 확인 |
| 10 | RPM L1→L4·Primary·canonical parent/namespace | 키·풀이 결속 |
| 11 | PT/TPL·CrossConcept·Condition·IntegrationPattern | 실제 키/근거 |
| 12 | 교육과정·표기·수학식·경계 점검 | 확인 |
| 13 | 문제 시각자료 필요성·제작/면제·실제 asset/SHA | 확인 |
| 14 | 해설 시각자료 필요성·제작/면제·실제 asset/SHA | 확인 |
| 15 | qid별 세로 슬롯 정답 배분 전후 및 변경 재검 | 확인 |
| 16 | 제작자 최종 Reverse Stem·자체검산·결함수리 | 근거 |
| 17 | **운영 Meta 등록 인계 (main 담당)** | **최종 UID/source/sidecar/key/SHA 전달, 상태 PENDING**. 운영 parity PASS는 요구 안 함 |
| 18 | **독립 품질검수 인계 (별도 GPT)** | **최종 입력·답·해설·메타·asset/SHA 전달, 상태 PENDING**. 독립 PASS는 요구 안 함 |
| 19 | **운영 브라우저 검사 인계 (Codex)** | **브라우저 검사 대상 파일/URL 준비정보·asset/SHA 전달, 상태 PENDING**. Chrome PASS는 요구 안 함 |
| 20 | 제작자가 실제 실행한 검증기·Golden/Negative/회귀 범위 | 실제 결과·미실시 이유(필수 선행 의무는 별도 정본 준수) |
| 21 | 제작 중 결함→수정→영향 재검 이력 | 정확한 적용 범위 |
| 22 | **제작자 개별 종료** | `ITEM_AUTHOR_COMPLETE`/`ITEM_AUTHOR_INCOMPLETE` 및 실제 증거 |

**원본 qid 종합 보고:** 원본 SHA, 9 UID/45선지/36오답, 문항별 난도·L3/L4/PT/TPL·Meta, 문제/해설 SVG, 세로 정답 누적표, 자체 검수·수리·보호, 9×22 작성 상태, `QID_AUTHOR_COMPLETE` 또는 `QID_AUTHOR_INCOMPLETE`, 독립 GPT·운영 Meta·Codex 각각의 **후속 소유자 및 PENDING**, 다음 qid 진행 가능 여부를 제시한다.

## 4. 효천고 기존 q01~q03와 변경 전 v1.0의 처리

- 기존 q01 보고서의 `QID_INCOMPLETE/FAIL`은 **독립 품질검수 0/9, 운영 Meta 0/9, 운영 Chrome 0/9을 제작자의 실패로 계산했다는 점에서 판정 기준 오류**다. 그 셋을 저자 실패 원인에서 제거하여 **제작자 범위만 독립적으로 재판정**한다. 기존 실제 제작 증거·동결 SHA·시각 캡처/격리 검사는 그대로 보존한다.
- 기존 기록상 `Golden/Negative` 등 **제작자 자신의 필수 규정에 해당하는 검사가 누락된 경우**까지 자동 PASS로 승격하지 않는다. 해당 필요 여부·실제 적용 범위와 수행 상태를 확인하고, 결손이면 제작자 부분만 보강한다. **무조건 q01 자체를 실패로 두거나 q02·q03 초안을 폐기하지 않는다.**
- 수동 qid 순차 제작의 제어 기준은 `QID_AUTHOR_COMPLETE`다. 실제 별도 GPT 검수자가 후에 발견한 결함은 해당 UID를 제작자에게 되돌리고 같은 UID 수정·변경 영향 재검을 진행한다. 메타/main/브라우저 담당의 운영 결함은 해당 담당자가 수리한다.
- 과거 `QID_E2E_COMPLETE`는 **출고/총괄 현황 용어**로만 사용하고 제작 GPT에게 독립 GPT·Codex 수행을 강요하지 않는다. 새 runtime enum을 도입하는 문서가 아니다.

## 5. 권위·상충 해소

- 우선 순위: 사용자의 **2026-10-17 최신 직접 역할 정정** → 본 수동 QID9 제작자 종료 규정 → 기존 QID9 계약의 제작·메타·시각·정답 배분·검수 정확성 기준. **품질 기준 자체는 완화하지 않고 책임과 완료판정만 분리한다.**
- 원본 정본·생성물·기존 검수의 실제 SHA와 PASS는 보존. 작성하지 않은 결과를 생성하거나 미실행을 PASS로 꾸미지 않는다.
- 예약형 Library NEW14는 기존 CREATE/R1/R2/R3 인계 우선·MASTER 최종 판단 규칙이 계속 우선한다.