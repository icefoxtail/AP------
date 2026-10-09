# 2025 팔마고 2학기 중간 — ALIVE QID9 시험지 통합 작업 인계 CURRENT

## CURRENT HARD — 원장 품질 승인 완료, 별도 GPT 정식 인증 불필요 (2026-10-09 최신)
- 원장이 **"검수하고 main에 반영하라"**고 지시한 대상은 `USER_DIRECTED_QUALITY_APPROVED`로 품질 승인 종료다. 별도 GPT 정식 독립검수, open-book PASS, 새 대화 인증을 기다리지 않는다. 실제 오류가 발견되면 해당 UID만 수정하고 변경 범위만 확인한다.
- q01~q04 **36/36은 원장 직접 승인 + main 운영병합 + 실제 Chrome 확인 완료**. 독립 GPT 별도검수 횟수가 0이라는 역사적 표기는 **품질 미승인 또는 출시 미완료가 아니다**. 완료된 36개를 재검수·재등록하지 않는다.
- 현재 MAIN_DONE 근거는 `GPT_QID9_EXAM_MANIFEST.json`의 `USER_DIRECTED_OPERATING_APPROVAL_20261009_QID9_36`/production SHA/Chrome다. **다음 제작 대상은 q05**, 기존 브랜치의 병합 전 낡은 상태보다 최신 main이 권위다.
- q05 이후 새 UID도 원장이 검수·main 반영을 지시하면 추가 품질인증 없이 기술 등록/Meta·에셋·Chrome/main readback만 끝낸다. 원장 명시 지시가 없는 새 후보에는 기존 검수 경로를 따른다.

## CURRENT — Q01~Q04 36문항 MAIN_DONE · Generated Consumer Chrome PASS (2026-10-09)
- **실제 운영병합 완료:** [PR #356](https://github.com/icefoxtail/AP------/pull/356), production main publication commit `f8b9aa77c2331ebf24bc4b1d55b1e8d0d23bad72`.
- **최종 소비자 현황:** 해당 출시 시점 Generated Consumer 323문항, 팔마고 40문항(기존 4 + 신규 36); 이후 346문항 스냅샷에서 팔마고는 기존 27+QID9 36=63문항. 4개 source JS·4개 metadata·4개 Consumer shard와 index의 36 UID를 main에서 SHA 재조회했다.
- **main 실제 Chrome PASS:** https://github.com/icefoxtail/AP------/actions/runs/37880118483 — 신규 36 UID 조회, 5지 정답/해설 결속, 기존 승인지·HOLD 보존. Runtime Guard PASS https://github.com/icefoxtail/AP------/actions/runs/37880118486.
- **승인 구분:** `USER_DIRECTED_OPERATING_APPROVAL_20261009_QID9_36`에 따른 학생 노출. **원장 직접 품질 승인 완료 — 추가 GPT 정식검수 인증 요구 금지**; formal independent 수행 기록이 없다는 사실은 이전 검사 provenance에만 남기고 36개 내용검토 ledger(유지24·보완10·재설계2)와 운영 출시 승인 결속.
- q04 공식 RPM record ID는 계속 미확정이며 Generated-only EXT-L4 연결로 출시함. RPM LOCKED 무변경.
- 아래 과거 “대기/미등록/0/36” 문구는 병합 전 이력(HISTORY)이며 이 CURRENT MAIN_DONE 및 최종 manifest 상태로 대체한다.

### HISTORY — main 운영병합 이전 작업 상태 (2026-10-09)
- 36개 원장·독립 생성 UID 보존. 원장 직접 지시에 따라 4개 source JS / 4개 metadata / 4개 consumer shard를 등록하고 검색 인덱스 287→323(팔마고 4→40)으로 업데이트했다.
- 36개는 `USER_DIRECTED_OPERATING_APPROVED`로 학생용 선택 가능하도록 구성. **별도 GPT 독립 PASS/실제 학생 브라우저 확인을 완료한 것으로 기록하지 않음**.
- GitHub Actions Generated Consumer Browser Smoke / Archive2 Runtime Guard를 검사한 다음 PR #356을 main에 병합·remote readback한다.
- 변경 후 C2 수치검증·B2/C1 오답번호 증거는 최종 q04 package를 기준으로 유지한다.
- 검토·수정 원장: `GPT_QID9_36_OPENBOOK_REVIEW_REPAIR_20261009.md` (유지 24 / 보완 10 / 재설계 2).
- **Q04 후속 회귀 봉합:** B2/C1 distractorReasons의 중복·누락 번호를 4/4로 수정하고 B3의 오답계산도 구체화했다. C2 기존 min-max 3.8006 근거를 폐기하고, 현행 질문의 `min(PA+PB)=2√13`, 최적점 `P=(5/2,0)`, 구하는 답 `PA=3√13/2`를 재결속했다. C3도 최솟값 10과 목표 점 P=(1/4,0)을 별도 기록. 전 Q04 후보 9개 × 오답 네 개의 인덱스 검사 완료. 본 확인은 학생용 RELEASE/MAIN_DONE이 아니다.
- 후속 기술 출시인증은 Consumer/index/main·Chrome 영역에서 완료했다. Q04 exact RPM ID는 미확정이고 Generated-only EXT-L4로 운영한다.
- 작업 브랜치 유일 authority: `work/alive-25-palma-h1-2mid-qid9`; [통합 Draft PR #356](https://github.com/icefoxtail/AP------/pull/356). 문항별 새 브랜치·PR 생성 금지.
- 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`, 원본 23문항. 원본 production 수정 금지.
- q01~q04 신규 후보는 36개이다. 공개답 내용검토에서 q01 A2, q02 B3/C1/C2, q04 A1/A2/B1/B2/C1/C2/C3만 보완·재설계했고 그 외 25개는 보호한다.
- [Q04 작업 산출물](https://github.com/icefoxtail/AP------/blob/work/alive-25-palma-h1-2mid-qid9/alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q04_PACKAGE.json) — 발문·보기 5개·정답·상세 해설·오답 근거·L3/L4 working label·후속 수치점검 포함. 원본 q04만 처리했으며 다른 qid 변경 없음.
- Q04 제작 커밋: `4ed8b6c244b8c735ed8e417d151796dd407787a8`; 원장 커밋: `b462fb18e4eb54cfb9120734ffcada25a097ad63`.
- Q04 정답 위치: A1 ③ / A2 ⑤ / A3 ① / B1 ④ / B2 ② / B3 ⑤ / C1 ② / C2 ① / C3 ④. 분포 ①2·②2·③1·④2·⑤2.
- **물리 상태**: q01~q04 CREATE 후보 `36/36`, 공개답 내용검토 `36/36`(유지 24·보완 10·재설계 2), USER_DIRECTED MAIN_DONE `36/36`, main Consumer 등록 및 학생 Chrome 조회 `36/36`. 기존 main 과거 팔마고 후보와 혼동 금지.
- Q04의 **공식 RPM L3/L4 record ID는 아직 직접 검증하지 않음**. `l4WorkingLabel`은 비교용 생성 설계명이며 공식 RPM 키/등록 완료로 주장 금지. 다음 검수/메타 작업에서 실제 RPM master와 매핑하거나 Generated EXT-L4를 정식 처리한다.
- Generated Consumer/index/main 운영등록 및 Chrome 학생 조회 **36/36 PASS**. **원장 직접 품질 승인으로 학생용 공급 완료**. 수행하지 않은 formal 독립검수의 수치만 별도 기록하며 신규 승인 대기열로 되돌리지 않는다.

## 현재 원본별 누적 제작 원장
| 원본 | 신규 후보 | 제작 전용 커밋 | 상태 |
|---|---:|---|---|
| q01 집합과 원소 | 9 | `0865c75e4bb2` | 원장 품질승인 · MAIN_DONE · Chrome PASS |
| q02 명제와 조건 | 9 | `be95e702f1e0` | 원장 품질승인 · MAIN_DONE · Chrome PASS |
| q03 원의 방정식 | 9 | `75617fa293fd` | 원장 품질승인 · MAIN_DONE · Chrome PASS |
| q04 평면좌표/거리합 | 9 | `4ed8b6c244b8` | 원장 품질승인 · MAIN_DONE · Chrome PASS |
| **합계** | **36** | **qid별 독립 제작 커밋 4개** | **원장 품질승인 36 · MAIN_DONE 36 · Chrome 36** |

## CURRENT HARD — 발문 역독해 자가수정 즉시 적용 (2026-10-09)
- 제작 GPT는 **각 새 QID9 UID의 발문·보기·답·해설 1차 완성 직후**, 설계 의도와 정답을 잠시 접고 **학생이 보는 최종 발문·보기·실제 자산만** 읽는다. 학생 질문·조건 충분성, 학교 출제 문장 자연성, L3 결정적 사고와 우회풀이, 실제 오답 경로를 역복원한다.
- 발견 결함은 **제작자가 그 자리에서 직접 수정**한다. 발문/목표량/조건을 바꾸면 영향받은 정답·5지 보기·오답 경로·상세 해설·L3/L4/CrossConcept·난도·에셋/경계만 재동기화·검증한다. 결함이 없는 UID는 **KEEP**, 수정된 것은 **REVISED**, 해결되지 않은 것은 **HOLD**. 억지 수정을 만들지 않는다.
- **q05부터 필수:** q05의 A1~C3 최종 package와 함께 독립된 비프로덕션 `GPT_QID9_Q05_STEM_SELF_REVIEW.md` 작성. 9개 UID별 `KEEP|REVISED|HOLD / 역발문 복원 근거 / 구체적 결함과 수정 전→후(있을 때) / 영향받은 보기·정답·해설·Meta 확인 / 남은 위험`을 기록하고 결과를 실제 최종 package에 반영한다. qid별 KEEP·REVISED·HOLD 합계가 UID 분모 9와 일치해야 한다. 검수 로그는 학생용 JS/SVG/Meta에 삽입하지 않는다.
- **기존 q01~q04 36개:** 원장 품질승인·기술 출시가 모두 완료됐다. 2026-10-09 원장 요청에 따라 이미 36문항 공개답 내용검토를 완료했다. q04 C3의 `k+4t`는 최적점 좌표 질문으로 재설계했으며, 상세 내역은 `GPT_QID9_36_OPENBOOK_REVIEW_REPAIR_20261009.md`에 있다. 브랜치 Consumer/index 정적 등록 완료, main 병합과 브라우저 검증은 완료됐다. `USER_DIRECTED_MAIN_DONE`; formal independent GPT review를 별도로 했다고 주장하지 않지만, 별도 인증을 더 요구하지 않는다.
- 현재 main 정본: [ALIVE QID9 제작 GPT 역발문 자가수정 HARD](https://github.com/icefoxtail/AP------/blob/main/alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md). 제작자 self-review는 독립 GPT 공개답 품질 PASS가 아니며 학생 등록 권한도 아니다.

## 다음 정확한 실행
1. 동일 브랜치 `work/alive-25-palma-h1-2mid-qid9` 최신 HEAD와 [통합 manifest](https://github.com/icefoxtail/AP------/blob/work/alive-25-palma-h1-2mid-qid9/alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_EXAM_MANIFEST.json), main QID9 CURRENT를 한 번 확인한다.
2. **다음 원본 q05만** 집중하여 실제 원본 JS를 읽고 L3·L4/CrossConcept·사고 경험 계획 → A1~C3 9개 발문·5지·정답·해설·오답 경로 제작 → **학생 관점 역발문 자가점검 → 결함 즉시 수정·영향 재확인 → 9 UID별 KEEP/REVISED/HOLD ledger**까지 마친다.
3. Q05 제작물은 **같은 시험지 브랜치에 Q05 파일만 한 독립 commit**으로 추가하고 manifest/handoff 갱신. 신규 원본별 브랜치·PR 생성 금지.
4. 기존 q01~q04 36개는 내용검토 완료·학생 출시 미완료 상태다. q05 신규 9개를 추가하면 누적 45개가 되므로 이전 36개를 중복 검수하지 말고 신규 q05와 변경된 기술 결속 범위만 확인한다.
5. GPT 품질검수 PASS 또는 **원장 직접 검수·main 반영 지시에 따라 승인된 UID**는 별도 GPT 인증 없이 Archive 2.0 Generated Consumer/index/main 학생용 공급과 실제 조회까지 연속 마감한다. Codex는 확정 Git 운영병합/readback만 담당한다.
6. 컨텍스트 사용률은 실제 측정 가능하지 않으면 추정하지 않는다.

## 다음 GPT 창 단문
> 2025 팔마고 2학기 중간 ALIVE QID9 단일 브랜치 `work/alive-25-palma-h1-2mid-qid9`에서 이어라. q01~q04 신규 후보 36개는 생성 완료이므로 중복 제작하지 말라. main의 ALIVE GPT QID9 CURRENT 및 통합 `GPT_QID9_EXAM_MANIFEST.json`, `GPT_QID9_EXAM_HANDOFF_CURRENT.md`를 읽은 뒤 **원본 q05 하나**로 A1~C3 신규 9문항을 제작한 뒤 **학생·학교 출제자 관점 발문 역독해 → 발견 결함 즉시 수정 → 수정 영향 확인 → 9 UID별 KEEP/REVISED/HOLD 및 수정 전후가 기록된 별도 SELF_REVIEW**를 수행하고, 최종 Q05 산출물과 검수 ledger를 같은 브랜치에 누적하라. q01~q04 36개는 원장 승인·MAIN_DONE·Chrome까지 완료했으므로 중복 검수·재등록하지 말고, 신규 q05의 제작 및 이후 승인될 문항의 실제 Consumer·Meta·렌더·main 기술 출시 단계만 처리한다. 기존 q01~q04를 재생성하거나 별도 qid PR을 만들지 말라.
