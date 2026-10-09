# 공통 Meta 구현 계획 — 2026-10-09

기준: origin/main `71f6f476fae053fd966896a9df3d22c44a22cb9a`. 사용자 요청의 4개 architecture CURRENT/감사, root/archive AGENTS, Runtime 계약 및 Notion Common Assessment Factory v0.13을 확인했다. 원 작업 폴더의 변경은 보존하고 별도 worktree에서 구현한다.

## 실제 조사 결과

- Meta Foundation canonical/compiled/runtime 및 `archive2-core.js`의 catalog decode·분류·난이도 필터, `archive2-source.js`의 fingerprint/UID 복원은 재사용한다. RPM LOCKED를 수정하지 않는다.
- Consumer는 346 승인 UID/62 shard이며 cutover 323과 후속 23을 구별한다. 기존 HOLD23 복구는 완료 상태를 보호한다. `generated-bank.html`은 승인 index와 UID+localOrdinal로 복원한다. 현재 Consumer `l2`는 물리 bucket이며 semantic RPM L2가 아니다.
- `generated-meta-retention-gate.cjs`는 23개 신규의 source/metadata/Consumer/index Meta parity를 검사하지만 등록 writer가 아니다. 심사 SHA 문자열만으로 실제 review bytes를 증명하지 못한다. 생성 metadata와 Consumer question 사이의 projection이 기존 323에서 여러 필드를 잃는다.
- 기존 323의 difficulty 7개는 자동 환산하지 않는다. UID가 일치하는 source/metadata/record와 exact RPM recordId crosswalk에서 복원 가능한 값만 별도 ledger에 근거/bytes SHA를 남긴다. 누락 CrossConcept/Condition/Integration은 []/NONE으로 채우지 않는다.
- Compose는 catalog 기반이고 Generated 검색은 별도 화면이다. 공통 query adapter가 필요하나 원본 direct-open·기존 snapshot/서버 권한을 교체할 이유는 없다.
- 현재 tracked runtime/tooling 검색에서 v0.13 Expected Registry→Recipe→Factory release의 완성 구현을 확인하지 못했다. `common-fast-runtime.js`는 renderer이지 Factory가 아니다. 외부에서 완료된 제품을 새로 만든다고 주장하지 않는다. 새 Recipe consumer는 공통 Meta 입력에만 연결하고 Common 제품 발행/교사 클릭 생성으로 확대하지 않는다.

## 단계와 완료 조건

| 단계 | 최소 변경 | 검증 / 완료 기준 |
|---|---|---|
| M0 | 공통 논리 Meta adapter: 기존 필드 재사용, rpmL2/bucket 분리, UNKNOWN/debt·검수와 Meta completeness 분리 | 실제 catalog/Consumer fixture, 누락≠NONE, UID 중복/잘못된 parent 부정검사 |
| M1 | 승인 payload를 source JS/metadata→Consumer record/question/index로 전달하는 CAS 등록 adapter, 실제 evidence bytes 검증 | parity·source drift·evidence drift·CAS·rollback 테스트. 자동 upstream 연결은 실제 producer 확인 후 연결 |
| M2 | cutover 정확한 323 UID의 evidence 기반 복원 및 debt ledger | student content/choices/answer/solution/image/UID 불변, 승인 상태 불변, 잘못된 연결은 debt |
| M3 | 기출+Generated 공통 query/filter/정확한 restore; 기존 engine 유지 | L1~L4·1~5/UNKNOWN·승인/HOLD 검사, 변경 흐름 Chrome 및 Runtime Guard |
| M4 | Compose/Factory가 같은 Meta adapter를 소비; 4/12/20/24 Recipe input/coverage gap | UID/family 중복·미확정 bucket 강제배정 금지. 서버 Factory 제품 출시와 구별 |
| M5 | 등록/변경/철회 때 파생 index 동기화, CI parity 검증 | new/update/revoke·CAS·현재 source freshness 검사 |

각 단계에서 이미 있는 모듈·저장소·검증은 확장하고 복제하지 않는다. 조회용 projection은 파생물이며 새로운 수학 authority가 아니다. source 전체 복사·UID 재발급·레거시 일괄 재검수·QID9 제작은 하지 않는다.

## 운영

완성 범위를 독립 커밋으로 수납한다. 필요한 focused tests와 `node tools/check-archive2-runtime.cjs`를 실행한다. 화면/출력/선택 변경은 실제 Chrome로 검증한다. 최신 main 재확인 후 non-force 운영 push, remote target bytes readback을 수행한다. 미완료 단계는 첫 결손/API/명령을 별도 closeout에 기록한다. 검증되지 않은 Meta·Chrome·Factory 공급 PASS를 발급하지 않는다.
