# 공통 Meta 구현·운영 인계 — 2026-10-09

계획: `docs/plans/Problem_Bank_Unified_Meta_Implementation_20261009.md`.
최초 main `71f6f476f`, 조사 후 최초 배포 `ce30e7246`. 작업 중 추가된 승인 정책 main `0a029b3f1`을 병합했다. 사용자 직접 품질 승인과 별도 GPT 수행 이력은 구별하며, 새 GPT 재인증을 요구하지 않는다.

## 단계별 실제 상태

| 단계 | 상태 | 실제 결과 / 경계 |
|---|---|---|
| M0 | IMPLEMENTED | `problem-bank-meta.js`: 기존 canonical 필드의 공통 query view, semantic RPM vs storage bucket, 1~5/UNKNOWN, direct vs verified profile. 승인과 Meta 완성은 별개 |
| M1 | ADAPTER_IMPLEMENTED / UPSTREAM_HOOK_OPEN | 승인된 Meta를 source JS/metadata/Consumer record/question/index에 같은 UID로 저장. 실제 승인/user directive evidence bytes+UID+status+Meta digest, CAS/rollback. 새 UID 등록 및 기존 UID 수정 가능. 생성/승인 캠페인의 실제 호출 자동 연결은 아직 없음 |
| M2 | EVIDENCE_BACKFILL_IMPLEMENTED | cutover 정확한 323 UID에 source와 exact crosswalk 근거의 partial projection/field debt ledger. source JS·문항·승인 재작성 없음. 상세 Meta 재인증 아님 |
| M3 | QUERY_AND_SEARCH_IMPLEMENTED | `problem-bank-search.html`에서 기출+Generated L1~L4·난이도 공통 조회, 기존 source direct-open, 승인 Generated 정확한 UID+ordinal 복원/선택 화면 연결 |
| M4 | SHARED_CONSUMER_IMPLEMENTED / FACTORY_INTEGRATION_OPEN | Compose의 기존 기출 구성 필터와 네 Recipe가 같은 Meta query 사용. 기본 4/12/20/24, VERIFIED gap·UID/확인된 family coverage. Generated를 Compose Saved Paper에 섞는 서버 연결과 실제 Factory pack 소비/출시는 미완료 |
| M5 | GENERATED_ADAPTER_IMPLEMENTED / PRODUCER_AUTOMATION_OPEN | register/update/withdraw CLI에서 Consumer/index와 shard hash 동기화. 원본은 기존 catalog 등록/재생성 경로를 그대로 읽음. 임의 Source 파일 수정 watcher, 기존 다문항 generated shard의 원자적 sibling 동기화는 없음 |

## 복원 분모와 근거 부족

323 레거시 중 실제 저장된 값: RPM L1~L4 각 228, problemType 229, template 214, difficulty 316, CrossConcept 110, Condition 85, Integration 110. 나머지는 UNKNOWN/field debt. RPM L3/L4는 global LOCKED를 승계하지 않고 canonical master의 CANONICAL_DRAFT를 따라 `RPM_EXISTING_DRAFT`와 실파일 SHA로 연결한다.

난이도 미확정 7 UID는 HYC26 Q18 001/002/004 및 Q20 001/002/003/004. 하·중·상 환산 없음. 모든 레거시 projection은 `LEGACY_NOT_RECERTIFIED`; 실제 검수 승인과 검색 가능 346 UID는 유지한다.

후속 23 UID 중 19개에는 pinned authority와 현재 Meta digest가 일치하는 조회용 label alias를 연결했다. raw RPM 코드·승인 Meta SHA는 그대로다. 나머지 4개는 strict parent 불일치의 alias evidence debt이며 기존 승인/선택은 유지한다. `meta-browse-alias-receipt-20261009.json`의 UID별 disposition을 따른다. 과거 cutover roster 밖의 미래 등록은 이 backfill/alias 작업 대상에 섞지 않으며 철회된 historical UID는 기존 evidence의 inactive 상태로 남긴다.

`legacy-meta-evidence-323.json`에 UID/필드/source와 metadata SHA/authority/debt/student payload hash를 남겼다. Consumer question/index에는 조회값과 compact evidence pointer만 투영한다. 동일 metadata 파일의 UID별 join과 모든 기존 shard digest alias를 확인한다.

## 테스트와 보호

Focused Meta/등록/복원/기존 Consumer 회귀, Runtime Guard 및 실제 Chrome raw logs: `docs/reports/problem-bank-meta-20261009/`. 실제 13,336 catalog +346 Generated를 사용한다. 원본 시험/해설/정답 direct-open, 6MB snapshot의 storage failure, Compose 클릭, Generated 검색/인쇄도 별도 기존 Chrome audit로 확인했다.

최종 실행: focused **55/55**, Runtime Guard **42/42**, actual Chrome shared search / 기존 Generated 인쇄 / original·snapshot·Compose·unit interaction 모두 exit 0. 신규 scope의 raw retention report는 `PASS_NEW_UID_SCOPE_ONLY` (323 legacy exemption, 23 pinned historical, failures 0)이며 legacy Meta 재인증 PASS가 아니다. Runtime의 실제 크기 Meta L1+난이도 render는 500ms 상한 안이었다. raw log에 측정값을 보존했다.

기준 `ce30e7246`의 62 Consumer shard와 현재를 독립 비교했다: 346개 question 전체 필드에서 `metaProjection` 추가만 제외하면 동일; index UID 순서/approval/reviewStatus/consumerSelectable/source tuple/ordinal/storage bucket/HOLD 동일. 원본 JS·에셋·RPM LOCKED 수정 없음.

중간 실패는 UID별 sidecar cache, 잘못된 global LOCKED 승계, 현재 shard hash alias, 오래된 cache-version assertion, hash 알고리즘 혼동이었다. 출시 전 최소 수정했고 수학·승인 이력의 PASS를 소급 변경하지 않았다.

SHA-256/FNV-1a를 실제 producer의 서로 다른 직렬화 계약으로 복원한다. B07 BP01의 낡은 fingerprint 한 건은 current source/Consumer 학생 필드가 동일하고 source blob이 일치하는 것을 확인해 metadata-only로 수리했다. 이전 fingerprint와 raw bytes는 `fingerprint-repair.json`에 보존했다. 151개 missing/unsupported legacy fingerprint는 UNKNOWN이며 알고리즘을 추정하지 않았다.

`archive2-compose-scope.test.js`의 두 data expectation 실패는 분리된 baseline `ce30e7246`에서도 재현했다: 삼각비 selectable scope 기대와 high2/high3 source population 기대. Runtime Guard의 범위·시간·분모는 완화하지 않았다. 변경된 JS에 맞춰 cache version의 정확한 기대값만 갱신했다.

## 첫 미완료 지점과 다음 실행

**첫 미완료: M1 실제 생성/승인 producer의 등록 adapter 호출 자동화.** 지금 등록은 `node archive/tools/generated-meta/register-approved-generated-meta.mjs --input <registration.json>`으로 실행한다. 현재 generator/품질 승인 flow가 최종 Meta와 기술 evidence를 확정한 뒤 이 CLI를 호출하는 단일 출고 entrypoint를 결속해야 한다. 입력은 실제 승인/user directive evidence이며 신규 독립 GPT 검수를 추가 요구하지 않는다.

adapter 입력: `repoRoot`, `uid`, `meta`, `approval:{status}`, `reviewEvidence:{path,sha256,reviewStatus}`, `paths:{sourceShard,sourceMetadata,consumerShard,consumerIndex}`, 각 파일의 actual `expectedSha256`. 새 UID는 `newRegistration.indexRow`의 학교/학년/과목/sourceQid/localOrdinal/bucket/승인/Consumer path를 제공한다. source/metadata는 기존 생성 경로에 이미 있어야 하고 Consumer shard는 빈 파일로 준비한다. 단일 문항 source shard만 허용하며 다문항 shard를 억지로 변경하지 않는다. 정확한 executable 입력 예제와 negative cases는 adapter test에 있다. 철회는 `action:'withdraw'` + exact UID/reason/evidence/CAS로 남긴다.

**다음 M4:** 기존 사전제작 assessment pack은 86 pack/1,593 slot/970 distinct source refs. 현재 catalog로 exact file+questionNo 매칭 494 slot, 미매칭 1,099. 모호한 UID를 추정하지 않는다. 현재 immutable pack의 actual source/body fingerprint를 기준으로 identity bridge를 추가하고, backend 권한·revision 유지 하에 shared Meta queryRecipe를 실제 사전생산 tooling에 연결한다. 기존 pack을 재생성·철회하지 않는다.

불명 레거시 Meta는 field debt 목록에서 필요한 locus만 별도 authored/승인 근거로 해결한다. 323 일괄 재검수, 팔마고 HOLD23 복구 재시작, QID9 신규 제작, 원본 물리 폴더 변경은 하지 않는다.

## 커밋

- `ce30e7246`: 계획·공통 Meta view (main 수납·remote SHA 확인)
- `2d048d014`, `4b5c5513b`: 등록/수정/철회 adapter·actual bytes gate·new UID runtime 호환
- `a9773b11f`: 323 evidence-only backfill
- `87cf1a0e3`: Compose/shared recipes/통합 검색 및 Chrome 회귀
- `4c9f9e41b`: 현재 canonical key/parent·사용자 승인·VERIFIED Meta marker와 해시 알고리즘 정합성
- `93e90cdf1`: 19 exact browse aliases, 4 debt, 신규/철회 scope, BP01 metadata fingerprint 수리
- 최종 evidence와 운영 readback은 이번 closeout 후속 커밋에 결속한다. 마지막 payload main SHA와 remote bytes는 `problem-bank-meta-20261009/remote-readback.json` 참조. 이후 receipt-only 커밋은 검증된 제품 bytes를 변경하지 않는다
