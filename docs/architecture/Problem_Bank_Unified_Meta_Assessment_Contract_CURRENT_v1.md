# 문제은행 프로젝트 — 생성문항 공통 Meta 및 전체 평가상품 연결 계약 v1.0

## CURRENT HARD — 수정 AI OWN_AND_FIX / 메타 확장 / main 후 학생 화면 기술 마감 (2026-10-09 형님 직접 지시)
- 모든 JS Archive·ALIVE·문제은행 수정/검수/메타/출시 실행자는 [수정 AI 책임·Meta 확장·출시 마감 CURRENT](docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md)를 필독한다. **보고/미확정/NOT_TESTED로 작업 종료하지 않고**, 자신이 발견한 결함을 직접 수정하거나 실제 기술 실행자를 연결해 완료를 수납한다.
- 기존 canonical key를 먼저 검색하되 필요한 CrossConcept·Condition·Generated L4 키가 없으면 사용자 추가 승인 대기 없이 **Generated-only 확장 registry**에 의미·parent·evidence·UID를 등록한 뒤 Source/metadata/Consumer/index에 영구반영한다. RPM LOCKED·원본 기출 및 무관한 UID 보호, 무근거 추정 금지.
- 원장 직접 Generated 품질 지시의 별도 인증은 생략. **main 병합 이후 필요한 실제 Chrome 학생 조회/출력 등 기술 검사는 수정 AI가 끝까지 진행**한다. main write만으로 MAIN_DONE이 아니며, 실패하면 본 작업의 수리 대상으로 처리한다. 실제 미실행을 PASS로 꾸미지 않는다. 예외적 막힘은 시도·정확한 blockers·주체를 ledger에 남기되 재승인 요청/보고만 하고 끝내지 않는다.


> CURRENT DESIGN / DOCUMENTATION ONLY · 2026-10-09. 사용자 최우선 목표: 모든 생성문항의 정확한 Meta를 먼저 완성하고, 그 하나의 Meta로 문제지 만들기·5분 테스트·소단원 평가·단원 평가·월말 평가·미래 모의고사를 모두 연결한다. 본 문서는 제품 구현/PASS가 아니다.
> 기존 출처: Problem_Bank_Project_Master_Handoff_And_Roadmap_CURRENT.md, Problem_Bank_Generated_Meta_Retention_Audit_20261009.md, ALIVE QID9 CURRENT, Notion Common Assessment Factory 계획 v0.13. 충돌 시 사용자의 최신 명시 지시와 실제 Git main, 제품별 정본을 확인한다.

## CURRENT HARD — 원장 품질 승인 후 이중 인증 금지 (2026-10-09)
- **원장이 특정 문항·배치를 "검수하고 main에 반영"하도록 지시하면 품질 게이트는 `USER_DIRECTED_QUALITY_APPROVED`로 종료한다.** 신규 별도 GPT 세션의 정식 품질검수·독립검수 인증·재승인을 출고의 선행 조건으로 추가하지 않는다. 원장 지시는 실제 범위와 UID를 기록하고 기존 승인 상태를 보호한다.
- 이후 **Meta 필드의 정확한 영구 저장, Source→Consumer→검색 인덱스 parity, asset/렌더/Chrome, main remote readback**은 품질 재승인이 아닌 기술 출시 완결 검사로 수행한다. 실제 오류가 확인되면 해당 UID만 수정한다. 검증하지 않은 독립 검수를 PASS라고 허위 기록하지 않는다.
- 기존 팔마고 q01~q04 36개는 user-directed 품질 승인과 main/Chrome 완료다. 기존 formal independent GPT 0회는 과거 검사 횟수일 뿐 품질 미승인이나 다시 검수할 필요가 있다는 뜻이 아니다. 본 계약의 Meta-only repair로 수학 문제를 다시 검수하지 않는다.
- 원장의 직접 지시가 없는 신규 초안은 현행 품질 절차를 적용한다. 학교 기출 R1/R2 blind 및 Common Factory의 제품 단위 paper validator와 기술·권한 검사는 별개의 계약으로 유지한다.

## 1. 성공 목표 — 문항 Meta 하나, 평가 Recipe 여러 개

기출과 Generated는 원본 저장소가 달라도 UID로 검색·복원된다. 각 UID의 최종 수학 분류·난이도·유형·통합사고·승인 상태와 근거를 하나의 공통 논리 Meta 계약으로 저장한다. Source JS/metadata → Consumer shard의 record/question → index/query projection → 출제 선택에서 동일 의미가 유지되어야 한다.

교사용 Compose와 Factory는 별개 Meta 사본을 만들지 않고 같은 공통 Meta 조회권위를 소비한다. 문항 메타에는 평가 상품별 분량이나 문항 수를 일괄 영구 기록하지 않는다. 평가 Recipe·Blueprint가 목적별 선택 조건을 정의한다. 미확인 메타를 임의로 만들어 '완벽함'을 선언하지 않는다.

## 2. UID별 보존 필수 정보(논리 계약)

| 축 | 반드시 식별·영구보존할 내용 |
| --- | --- |
| Identity·Provenance | UID, 원본/생성 sourceKind, sourceQid/ordinal, 원본 JS·shard ref, 원본/source/asset SHA·fingerprint, 생성 family·원본/변형/Blueprint 관계(확인된 경우) |
| 교육과정 | 학년·개정·과목·standardCourse, standardUnitKey·subUnitKey 및 master parent·label |
| RPM L1~L4 | primary L3/L4 및 해당 L1/L2 부모, recordId, verified namespace·registry/authority ref: RPM_LOCKED / RPM_EXISTING_DRAFT / GENERATED_EXT_L4 |
| 개념·조건·복합 | secondaryConceptKeys, crossConceptKeys[], conditionKeys[], integrationPattern 및 실제 역할·분류 근거 |
| 유형·템플릿 | problemTypeKey, templateKey 및 기존 활성 키/근거 있는 결손 상태. 독창성·변형 유사 관계와 시험지 간 중복/회차 선정에 활용 |
| 난이도·문항 속성 | difficultyBucket 1~5, 기존 level 하·중·상, 근거/불확실성, 객관식·주관식 등 답형, 시각자료·수식·표 존재/자산 무결성 |
| 품질·학생 공급 | 문제·정답·해설 검수 근거 및 SHA, 승인/REVIEW/HOLD/실제 오류, 선택 가능 상태, 학생용 정답 비공개와 source 변경에 따른 증거 freshness |
| 조회 Projection | semantic rpmL2와 physical storageBucketKey(기존 Consumer l2 호환)를 분리하고 UID→원본/Consumer 1:1 복원을 보장 |

현재 field 명칭은 논리 계약으로서, 최종 migration 시 기존 canonical Meta Foundation/ALIVE 필드를 먼저 재사용한다. 같은 뜻의 중복 DB 열을 새로 만들지 않는다. Generated Consumer l2는 subUnitKey 계열 물리 bucket으로 RPM L2와 동일시하지 않는다. 기존 6개 비-ALITE 팔마고 승인 UID를 재발급하지 않는다.

## 3. Meta 완성 판정의 엄격한 의미

- CONFIRMED: 정확한 source·수학·RPM/Generated EXT 정본 및 근거와 연결된 유효 값. 필수 계층·부모·namespace·난이도 관계를 검증한다.
- NOT_APPLICABLE: 진짜 해당하지 않는 개념/조건은 [] 또는 NONE으로 명시. 비어 있음/정보 없음과 다르다.
- UNKNOWN / EVIDENCE_DEBT: 판단 근거 부족, 정확한 UID·필드·사유·필요한 증거를 저장. 1~5 난이도를 하·중·상에서 임의로 환산하거나 가짜 RPM LOCKED를 만들지 않는다.
- STALE / INVALID: source 변경으로 영향받는 이전 증거가 낡았거나 실제 오류가 확인됨. 영향 locus만 재판정하고 제품별 노출·채점 위험을 차단한다.
- Meta 구조의 상태와 수학·해설 품질검수/승인, Chrome 렌더 PASS, 현재 학생 공급 여부는 모두 다른 축이다. 단일 'PASS'로 혼동 금지.

Notion Factory v0.13은 중등 전체 JS 활용/교사의 검색·직접 선택과 검증 완료 Common 상품 eligibility를 분리한다. UNKNOWN을 이유로 전체 문항을 자동 삭제·일괄 사용 차단하지 않는다. 다만 엄격한 검증 완료 제품에는 필요한 자료가 확정된 UID만 사용하고, 빈 자리는 정확한 coverage gap으로 보여 준다. ALIVE 미승인/HOLD는 학생 Consumer 자동 공급에서 제외한다.

## 4. 같은 Meta를 쓰는 평가상품

| 사용 경로 | 목적·선택 기준 | 제품별 기본값/역할 |
| --- | --- | --- |
| 문제지 만들기 | 학년·과목·L1~L4·1~5 난이도·유형·출처·답형에 따른 검색/수동 선택 | 기존 Compose→Saved Paper→Assignment. 교사가 직접 제작하며 문항 수 사용자 지정 |
| 5분 테스트 | 좁은 핵심 L3/L4 숙달, 실제 난이도·형태·중복/출처·품질 기준 | Common Factory 사전생산 및 검증, 기본 4문항 |
| 소단원 평가 | 선택된 L2 범위 내 L3/L4의 개념·유형·난이도 분배 | Common Factory 사전생산, 기본 12문항 |
| 단원 평가 | 단원 범위 전체 L3/L4·조건·통합사고·난이도 구성 | Common Factory 사전생산, 기본 20문항 |
| 월말 평가 | 실제 지정 진도/다중 소단원 범위·L3/L4 커버리지/난이도 Recipe | Common Factory 사전생산, 기본 24문항 |
| 향후 모의고사 | 목적별 시험 범위, 난이도/유형 비율, 원본 자리/생성 variant 회피, 회차 간 중복 회피 | 별도 Recipe/Immutable paper. 문항 수·시간 미확정; 구현 완료 아님 |

4/12/20/24는 2026-10-07 Factory v0.13의 현행 기본 문항 수이며 과거 4/12/22/25는 HISTORY. Factory 공용 평가는 교사가 누를 때 새로 제작하지 않고 이미 제작·검수·봉인된 카드로 공급한다. 교사의 맞춤 문제지 제작은 Compose가 담당한다. 일반 구성의 유연성/미확정 경고와 검증 완료 Common의 엄격한 Recipe를 동일한 차단 규칙으로 뭉개지 않는다.

## 5. 데이터 파이프라인과 엄격한 완료 게이트

1. 제작/원본 인수: 확정된 문항 Meta·실제 출처/설계·family 관계를 UID로 저장. 없는 정보를 NONE으로 오기록하지 않음.
2. 검수: **원장 직접 검수·main 반영 지시 시 `USER_DIRECTED_QUALITY_APPROVED`로 품질 승인 종료**하고 별도 GPT 검수를 강제하지 않는다. 그 외 생성 신규 초안은 발문 우선 공개답 추적, 기출은 R1/R2 계약을 적용한다. self-check를 독립 수행으로 허위 표시하지 않는다.
3. 등록: 설계·승인 Meta → generated Source JS/metadata → 승인 Consumer record/question → index/query projection을 SHA/UID 단위로 무손실 동기화. 평가별 서로 다른 분류값 생성 금지.
4. 소비: Compose·Factory의 동일 Meta 조회/eligibility adapter. 기출 source fingerprint 복원, Generated 승인 shard UID+localOrdinal 복원, 권한별 정답/해설 비공개.
5. Factory: Expected Registry → AssessmentBlueprint → Recipe → Eligible Pool → deterministic bundle builder → 독립 paper validator → immutable artifact/release pointer → 교사 카드/출력/Assignment.
6. 변경: 신규 등록·수정·HOLD/회수 시 index/검색/Factory pool을 증분 갱신하고 현재 artifact SHA·영향 dependency만 재검사.

회귀 테스트는 동일 UID의 source/Consumer/검색 필드 parity, 잘못된 parent/namespace/difficulty/Meta SHA/검수 ref 실패, 실제 그림 누락, 미승인·HOLD 차단, 기출+Generated 같은 L2/L3/L4 조회 및 원본 복원을 포함한다. Common의 4/12/20/24 Recipe와 1~5/UNKNOWN 처리, 같은 family/UID 중복회피, 부족한 슬롯의 정직한 표시를 검사한다. Archive Runtime Contract의 direct-open, 응답성, frozen snapshot, 서버 저장 권한, 학생용 정답 비공개와 실제 Chrome도 유지한다.

## 6. 실제 다음 구현 순서 — Meta 완성이 최우선

**M0 계약 결속:** 기존 current Git schema·Factory v0.13·Compose 입력을 일대일 매핑하고 필수 필드와 확정/미적용/미정 판정 규칙을 동결. 표본 UID 1개로 source→index까지 검색 가능한 메타 계약 fixture 구성.
**M1 신규 Generated 저장 엔드투엔드:** 신규 Meta gate를 실제 Create/Register adapter에 결속해 Source JS/metadata→Consumer→통합 검색 index에 자동 영구보존하고 부정 테스트 PASS.
**M2 기존 승인 323 근거 backfill:** SHA·설계/검수 원장과 실제 RPM 근거가 있는 필드만 복원, 불명 난이도 7건 등은 정확한 EVIDENCE_DEBT ledger로 유지; 기존 승인 강제 무효화 금지.
**M3 기출+Generated 공통 조회:** 동일 RPM L1~L4와 difficulty를 지원하는 논리 검색·선택 권위/정확한 source 복원. physical bucket과 semantic L2 구분.
**M4 모든 평가의 Meta 소비 확인:** Compose 및 Factory의 5분/소단원/단원/월말 Recipe가 새 공통 Meta로 동일한 UID·coverage·난이도·중복 기준을 이용하는지 실제 코드와 검증 테스트에 결속.
**M5 자동 출시/변경 인덱싱:** 승인 새 UID·수정·철회 등 이벤트에 증분 색인 일치·CAS/회귀.
**M6 후속 제품:** Factory 카드 공급·모의고사·다회차 UX 구현은 별도 제품 단계. Meta 완성 전 이미 구현됐다고 주장하지 않는다.

## 7. 재진입 및 제외

다음 작업자는 반드시 Notion 라우터→Archive 시작 페이지→생명주기→이 문서→Problem Bank Master Handoff→최신 origin/main을 확인한다. 기존 팔마고 HOLD23 재검, QID9 신규 문항 제작, 기출 원본 물리 L2 이동은 본 인프라 scope가 아니다. 과거 snapshot 숫자를 최신 운영 분모로 고정하지 않는다.

**완료 선언 기준:** 한 UID의 정확한 Meta가 모든 영구 Source/Consumer/index 계층에 실제 보존되고 Compose와 각 Factory Recipe가 같은 분류를 소비할 수 있다는 증거가 있어야 한다. '문서 작성'과 '메타 구현 완료/평가 상품 공급 완료'를 구분한다.
