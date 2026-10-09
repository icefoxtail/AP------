# 2025 팔마고 2학기 중간 — ALIVE QID9 시험지 통합 작업 인계 CURRENT

## CURRENT — Q04 제작·36문항 공개답 내용 보정 완료 / 다음 Q05 (2026-10-09)
- 검토·수정 원장: `GPT_QID9_36_OPENBOOK_REVIEW_REPAIR_20261009.md` (유지 25 / 보완 9 / 재설계 2).
- 후속 기술 출시인증 미완료: Q04 exact RPM L3/L4 결속, Generated Consumer·index/DB, 실제 렌더 및 main remote readback `NOT_TESTED`.
- 작업 브랜치 유일 authority: `work/alive-25-palma-h1-2mid-qid9`; [통합 Draft PR #356](https://github.com/icefoxtail/AP------/pull/356). 문항별 새 브랜치·PR 생성 금지.
- 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, Git blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`, 원본 23문항. 원본 production 수정 금지.
- q01~q04 신규 후보는 36개이다. 공개답 내용검토에서 q01 A2, q02 B3/C1/C2, q04 A1/A2/B1/B2/C1/C2/C3만 보완·재설계했고 그 외 25개는 보호한다.
- [Q04 작업 산출물](https://github.com/icefoxtail/AP------/blob/work/alive-25-palma-h1-2mid-qid9/alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q04_PACKAGE.json) — 발문·보기 5개·정답·상세 해설·오답 근거·L3/L4 working label·후속 수치점검 포함. 원본 q04만 처리했으며 다른 qid 변경 없음.
- Q04 제작 커밋: `4ed8b6c244b8c735ed8e417d151796dd407787a8`; 원장 커밋: `b462fb18e4eb54cfb9120734ffcada25a097ad63`.
- Q04 정답 위치: A1 ③ / A2 ⑤ / A3 ① / B1 ④ / B2 ② / B3 ⑤ / C1 ② / C2 ① / C3 ④. 분포 ①2·②2·③1·④2·⑤2.
- **물리 상태**: q01~q04 CREATE 후보 `36/36`, 공개답 내용검토 `36/36`(유지 25·보완 9·재설계 2), 최종 기술 release PASS `0/36`, 신규 학생 등록 `0/36`. 기존 main 과거 팔마고 후보와 혼동 금지.
- Q04의 **공식 RPM L3/L4 record ID는 아직 직접 검증하지 않음**. `l4WorkingLabel`은 비교용 생성 설계명이며 공식 RPM 키/등록 완료로 주장 금지. 다음 검수/메타 작업에서 실제 RPM master와 매핑하거나 Generated EXT-L4를 정식 처리한다.
- 브라우저 렌더/Generated Consumer 선택·모의고사 출제/remote main publication은 **NOT_TESTED/NOT_REGISTERED**. 후보 36개를 학생용 PASS로 주장하지 않는다.

## 현재 원본별 누적 제작 원장
| 원본 | 신규 후보 | 제작 전용 커밋 | 상태 |
|---|---:|---|---|
| q01 집합과 원소 | 9 | `0865c75e4bb2` | 내용검토 완료, 출시 미검증 |
| q02 명제와 조건 | 9 | `be95e702f1e0` | 내용검토 완료, 출시 미검증 |
| q03 원의 방정식 | 9 | `75617fa293fd` | 내용검토 완료, 출시 미검증 |
| q04 평면좌표/거리합 | 9 | `4ed8b6c244b8` | 내용검토 완료, 출시 미검증 |
| **합계** | **36** | **qid별 독립 제작 커밋 4개** | **공개답 내용 검토 36·기술 출시 0** |

## CURRENT HARD — 발문 역독해 자가수정 즉시 적용 (2026-10-09)
- 제작 GPT는 **각 새 QID9 UID의 발문·보기·답·해설 1차 완성 직후**, 설계 의도와 정답을 잠시 접고 **학생이 보는 최종 발문·보기·실제 자산만** 읽는다. 학생 질문·조건 충분성, 학교 출제 문장 자연성, L3 결정적 사고와 우회풀이, 실제 오답 경로를 역복원한다.
- 발견 결함은 **제작자가 그 자리에서 직접 수정**한다. 발문/목표량/조건을 바꾸면 영향받은 정답·5지 보기·오답 경로·상세 해설·L3/L4/CrossConcept·난도·에셋/경계만 재동기화·검증한다. 결함이 없는 UID는 **KEEP**, 수정된 것은 **REVISED**, 해결되지 않은 것은 **HOLD**. 억지 수정을 만들지 않는다.
- **q05부터 필수:** q05의 A1~C3 최종 package와 함께 독립된 비프로덕션 `GPT_QID9_Q05_STEM_SELF_REVIEW.md` 작성. 9개 UID별 `KEEP|REVISED|HOLD / 역발문 복원 근거 / 구체적 결함과 수정 전→후(있을 때) / 영향받은 보기·정답·해설·Meta 확인 / 남은 위험`을 기록하고 결과를 실제 최종 package에 반영한다. qid별 KEEP·REVISED·HOLD 합계가 UID 분모 9와 일치해야 한다. 검수 로그는 학생용 JS/SVG/Meta에 삽입하지 않는다.
- **기존 q01~q04 36개:** 2026-10-09 원장 요청에 따라 이미 36문항 공개답 내용검토를 완료했다. q04 C3의 `k+4t`는 최적점 좌표 질문으로 재설계했으며, 상세 내역은 `GPT_QID9_36_OPENBOOK_REVIEW_REPAIR_20261009.md`에 있다. 신규 학생용 기술 출시/인덱싱은 미완료이므로 최종 RELEASE 또는 MAIN_DONE은 아니다.
- 현재 main 정본: [ALIVE QID9 제작 GPT 역발문 자가수정 HARD](https://github.com/icefoxtail/AP------/blob/main/alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md). 제작자 self-review는 독립 GPT 공개답 품질 PASS가 아니며 학생 등록 권한도 아니다.

## 다음 정확한 실행
1. 동일 브랜치 `work/alive-25-palma-h1-2mid-qid9` 최신 HEAD와 [통합 manifest](https://github.com/icefoxtail/AP------/blob/work/alive-25-palma-h1-2mid-qid9/alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_EXAM_MANIFEST.json), main QID9 CURRENT를 한 번 확인한다.
2. **다음 원본 q05만** 집중하여 실제 원본 JS를 읽고 L3·L4/CrossConcept·사고 경험 계획 → A1~C3 9개 발문·5지·정답·해설·오답 경로 제작 → **학생 관점 역발문 자가점검 → 결함 즉시 수정·영향 재확인 → 9 UID별 KEEP/REVISED/HOLD ledger**까지 마친다.
3. Q05 제작물은 **같은 시험지 브랜치에 Q05 파일만 한 독립 commit**으로 추가하고 manifest/handoff 갱신. 신규 원본별 브랜치·PR 생성 금지.
4. 기존 q01~q04 36개는 내용검토 완료·학생 출시 미완료 상태다. q05 신규 9개를 추가하면 누적 45개가 되므로 이전 36개를 중복 검수하지 말고 신규 q05와 변경된 기술 결속 범위만 확인한다.
5. 최초 품질검수 PASS UID만 Archive 2.0 Generated Consumer/index/main 학생용 공급과 실제 조회까지 연속 마감한다. Codex는 확정 Git 운영병합/readback만 담당한다.
6. 컨텍스트 사용률은 실제 측정 가능하지 않으면 추정하지 않는다.

## 다음 GPT 창 단문
> 2025 팔마고 2학기 중간 ALIVE QID9 단일 브랜치 `work/alive-25-palma-h1-2mid-qid9`에서 이어라. q01~q04 신규 후보 36개는 생성 완료이므로 중복 제작하지 말라. main의 ALIVE GPT QID9 CURRENT 및 통합 `GPT_QID9_EXAM_MANIFEST.json`, `GPT_QID9_EXAM_HANDOFF_CURRENT.md`를 읽은 뒤 **원본 q05 하나**로 A1~C3 신규 9문항을 제작한 뒤 **학생·학교 출제자 관점 발문 역독해 → 발견 결함 즉시 수정 → 수정 영향 확인 → 9 UID별 KEEP/REVISED/HOLD 및 수정 전후가 기록된 별도 SELF_REVIEW**를 수행하고, 최종 Q05 산출물과 검수 ledger를 같은 브랜치에 누적하라. q01~q04 36개는 이미 공개답 내용 검토했으므로 중복 검수하지 말고, 신규 q05 및 기존 36개 중 미완료된 실제 Consumer·Meta·렌더·main 기술 출시 단계를 이어 처리한다. 기존 q01~q04를 재생성하거나 별도 qid PR을 만들지 말라.
