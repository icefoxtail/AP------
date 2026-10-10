# JS Archive / Problem Bank — JS 신규·수정·검수 시 Metadata 필수 계약 (CURRENT v1.0)

> 2026-10-10 원장 지시. 적용: 학교 기출(original), 유사문항(similar), ALIVE/Generated, 교재·평가용 JS의 신규 제작·기존 수정·검수. 이 문서는 **메타데이터 확인·기록 의무**이며 무관한 문항 전수 재분류 명령이나 신규 품질 재승인 단계가 아니다. 현재 사용자 명시 범위·종료 조건이 우선한다.

## 1. 작업 진입과 범위

- 신규 JS/신규 UID: 각 문항의 메타 계약을 생성 단계에 함께 작성하고 출시 이전에 확인한다. 이미 존재하는 필드만 복사해 완성이라고 판정하지 않는다.
- 기존 JS 수정: 대상 UID 및 변경으로 메타가 달라질 직접 의존 UID의 기존 메타를 확인한다. 기존 값이 유효하면 KEEP, 오류·누락이면 해당 필드만 수정한다. 무관한 UID 전체 재검·R1/R2/R3 재진입 금지.
- JS/문항 검수: **메타 축을 누락하지 않는다.** 요청된 분모의 각 UID를 문항 실제 발문·필요한 풀이 사실과 최신 master로 대조해 KEEP/CORRECT/HOLD 또는 EVIDENCE_DEBT를 남긴다. 검수 지시가 수정까지 포함하면 확인된 결함은 같은 승인 범위에서 핀포인트 수리한다.
- source-only 인테이크처럼 사용자가 메타 후속 작업을 명시한 경우에는 미완성 사실을 기록하되 해당 지시를 넘어 임의 확장하지 않는다.
- 모든 검증과 출시 기록은 현재 source/metadata SHA와 동일 UID에 결속한다. 동일 artifact 중복 검증을 금지한다.

## 2. 문항 JS 기본 필수 필드

각 신규 candidate/production 문항은 기존 기본 스키마를 보존한다.

`id, level, category, originalCategory, standardCourse, standardUnitKey, standardUnit, standardUnitOrder, questionType, layoutTag, tags, wide, content, choices, answer, solution, subUnitKey, subUnit, subUnitConfidence, subUnitClassificationDepth`

- `level`은 '하'|'중'|'상'만 허용. 문제의 사고·조건·함정 근거로 판단하며 문제은행 1~5 난이도와 **임의 환산 금지**.
- `questionType`은 실제 응답형(객관식/단답형/서술형 등 현재 schema 허용값); `tags`는 도형·그래프·표·서술형 등 실제 필요 요소를 표시한다.
- `layoutTag:'grid'`, `wide:false` 기본. 기존 승인 배치 보존; 특수배치는 사용자 명시 지시 없이 자동 추정·변경 금지.
- `image`, `solutionImage` 및 관련 visual 필드는 실제 해당 문항에 필요한 경우에만 현재 지원 schema·asset 실파일과 연계한다.
- `standardCourse → standardUnitKey → standardUnit → standardUnitOrder`와 `standardUnitKey → subUnitKey → subUnit`의 정합을 최신 Markdown/compiled master 직접 대조. `subUnitConfidence` 허용값: `existing_preserved|candidate_evidence|category_or_cue_inferred|rule_inferred`; `subUnitClassificationDepth`: `complete_candidate|complete_category|complete_documented|complete_rule`.
- 키는 정식 master/허용된 extension parent에 실제 존재해야 하며 label/order/parent가 맞아야 한다. `RAW-*`, `RRAW-*`, `UNMAPPED-*`, `PROPOSED-*`를 정식 분류로 가장하지 않는다. 근거 불명 시 임의 채움 대신 정확한 문항·필드·사유를 분류 debt에 남긴다. 기존 legacy 누락은 범위 내에서만 처리한다.

기준: `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`, `JS아카이브_표준단원키_마스터테이블.md`, `JS아카이브_세부단원_운영규칙_v1.md`, `archive/data/master_tables/js_archive_tag_master.json`.

## 3. 공통 문제은행의 추가 필수 메타 판정

JS 객체 단독에 모든 확장 필드를 억지 삽입하지 않는다. **현재 실제 schema의 문항 JS/sidecar·Meta Foundation/Generated registry/Consumer/projection에서** 다음 축을 문항 UID 단위로 확정·보존·검증한다.

1. **Identity·출처**: UID, exam/sourceJsPath/sourceQid, 원본·유사/Generated 관계, variant/family, provenance, 현재 source SHA, 기존 승인·품질 근거. 기존 UID·sourceQid·provenance 보존.
2. **교육과정/표준분류**: 과정(H15/H22 등 원본에 맞는 체계), standardUnit/subUnit parent/label/order, canonical category.
3. **RPM 사고분류**: 실제 핵심 `L1→L2→L3→L4`, Primary L3 및 L4, 원본↔variant 주개념/유형 정합, 정확한 canonical RPM key와 parent. RPM LOCKED 값/분류판단을 근거 없이 새로 쓰거나 변경하지 않는다.
4. **추가 사고축**: `CrossConcept`, `Condition`, `IntegrationPattern`, `problemType(PT)/template(TPL)`을 실제로 필요한 개념·조건·사고·풀이 구조로 판정한다. 해당하지 않으면 NOT_APPLICABLE(`[]`/`NONE`), 실제 적용하지만 미등록이면 기존 canonical 확인 후 허용된 Generated-only extension registry에 중복·parent·의미·UID·근거를 결속. 기출에 Generated 전용 키를 무단 적용하지 않는다.
5. **난이도 두 축**: 학습용 `level=하/중/상`과 문제은행 `difficultyBucket=1~5`(현재 schema의 대응 필드)을 독립 판정. 어려움을 계산량만으로 추정하거나 숫자를 하/중/상에서 기계 변환하지 않는다.
6. **검색·평가·승인**: 검색 가능한 실제 meta projection, 승인/REVIEW/HOLD/STALE, 선택 가능 여부와 제품별 eligibility, visual 필요성의 문제용/해설용 독립 판정. 학생용 정답 공개 권한과 품질/기술 검증 상태를 혼동하지 않는다.

위 항목의 필수성은 **필드 존재 여부 + 값의 근거 + canonical parent + 저장 위치 + 검색 projection parity**로 평가한다. 적용 가능한 필드만 실제 확정하고, 근거 부족은 `UNKNOWN/EVIDENCE_DEBT`(필드·사유·필요 자료)로 보존한다. 없는 개념에 가짜 `NONE`, 모르는 사실에 추정 값, 미등록 키에 `CONFIRMED`를 넣지 않는다.

기준: `docs/architecture/Problem_Bank_Unified_Meta_Assessment_Contract_CURRENT_v1.md`, `docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md` 및 현재 Meta Foundation/RPM/Generated registries.

## 4. 필수 검수·수정 판정

- **KEEP**: 실제 문항 근거, 최신 master, parent/namespace, 난이도, UID·source/Consumer/index 정합 확인됨.
- **CORRECT**: 확인된 오류만 승인 범위에서 수정, 변경 영향 문항 및 직접 dependency만 재검. 관련 근거·before/after 기록.
- **HOLD/EVIDENCE_DEBT**: 실제 근거가 부족하거나 충돌. 잘못된 키/난이도/출처를 추정하지 않으며 원인·필드·필요한 증거·후속 소유자를 기록한다. 나머지 정상 UID 작업은 계속.
- 메타-only 작업은 `content/choices/answer/solution/image/layoutTag/wide`에 손대지 않는다. 반대로 JS 본문 수정으로 개념·정답·난이도·출처 fingerprint가 달라지면 영향 메타와 검색 projection을 stale 처리하고 해당 UID만 갱신한다.
- validator 정적 스키마 PASS는 수학적 Meta 판정의 PASS를 대신하지 않는다. 누락/UNKNOWN을 조용히 삭제하거나 필터에서 제외하여 완료 숫자를 맞추지 않는다.

## 5. 작업 마감

- 신규 제작/검수/수정의 **해당 범위**에서 필드 누락·invalid 값·마스터/parent 불일치·UID 충돌을 확인하고, `KEEP/CORRECT/HOLD/EVIDENCE_DEBT` 건수와 영향을 받은 UID를 짧게 기록한다.
- 운영 반영까지 지시된 경우에는 실제 **source JS·metadata/registry → Consumer/DB·Catalog → 문항 index·통합 검색 projection** 동기화, 현재 source SHA/UID 값 일치, 검색·개별 선택·Compose/출력 관련 기술 확인, 최신 main 및 원격 readback까지 닫는다. 기술 미실시는 NOT_TESTED, 문서만 작성했다면 POLICY_ONLY.
- Compose와 Factory(5분4/소단원12/단원20/월말24)는 **같은 문항 Meta**를 사용한다. Product Recipe와 문항 Meta는 구분하고, 엄격한 Factory eligibility와 교사의 직접 검색·선택 권한을 혼동하지 않는다.
- 보고 항목: `scope/UID count; field coverage; canonical parent/key status; RPM L1-L4; Cross/Condition/Integration/PT-TPL; level/difficulty1-5; provenance; source→Consumer→index parity; exact debt; actual validation/readback`. 항목별 미수행은 PASS라고 쓰지 않는다.
- 이 정책 도입만으로 기존 모든 production JS/Meta를 일괄 마이그레이션하지 않는다. 기존 인증된 UID의 품질 판정을 소급 무효화하지 않는다.
