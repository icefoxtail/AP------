# ALIVE LITE v0.5 — 학교 마커 · L3 공유망 · 원본 슬롯 모의고사 설계

작성일: 2026-10-08 KST
상태: **DESIGN / PILOT INTEGRATION PLAN / NOT ACTIVE IN ARCHIVE2 RUNTIME**
대상: 고1·고2 학교별 기출 기반 생성 유형은행, 학교 맞춤 모의고사, 오답 재시험, 학교 간 문제 공유.
우선 적용 후보: 2026 효천고 고1 1학기 중간 26문항. 현재 pilot branch 후보 22문항은 독립검수·렌더·실제 Archive2 DB join 이전 단계다.

## 0. 정본 관계와 최상위 원칙

- 상위 ALIVE LITE 생산 규칙: `ALIVE_GPT_LITE_MASS_EXPANSION_PRODUCTION_PLAN_v0.2.md`, `ALIVE_GPT_LITE_MASS_EXPANSION_WORKER_CONTRACT_v0.3.md`, `ALIVE_GPT_LITE_CURRICULUM_HARD_GATE_v0.4.md`.
- 기존 LOCKED RPM Primary taxonomy, Meta Foundation, curriculum authority, difficulty v1.3, original·types·similar, ALIVE FULL 봉인, Archive1 기출 direct-open 및 Common Factory의 기존 권한·서버 canonical 정책을 침범하지 않는다.
- **하나의 생성 문항 UID = 하나의 실제 저장 본문**. 학교별·시험지별로 문항을 복사하지 않는다. 별도 관계 인덱스만 추가한다.
- **L3 = 학교 간 의미 공유 후보를 찾는 기본 키**. 단, 교육과정/학년/진도 접근 자격이 서로 호환되어야 한다.
- **L4/Blueprint/난이도/출제 역할 = 실제 원본 슬롯 대체 적격성 판정 키**. L3 일치만으로 모의고사 동일 슬롯을 자동 대체하지 않는다.
- 생성 시 수학 설계·발문·보기·정답·학생용 해설·L1~L4·CrossConcept·Condition·Integration·작성자 난이도를 원패스 완성한다. 독립 수학 검수, 중복, 교육과정·실제 렌더 검사는 별도 수집된 증거로 확인한다.
- 원본 시험지와 기존 생성 문항의 학교·연도·시험·qid를 위조하지 않는다. 모든 실제 공급용 상태는 해당 소비 경로의 current 품질 gate를 따른다.

## 1. 식별자와 마커 — 출처와 실제 사용 자격을 분리

### A. 원본 seed 마커 — lineage only
- `sourceExamUid`: 학교/연도/학년/학기/중간·기말/과목을 한 덩어리의 안정적 식별자로 참조.
- `sourceArchiveFile` + `sourceQuestionOrdinal` + `sourceArtifactSha`: 정확한 원본 슬롯의 불변 provenance.
- `generatedQuestionUid` + `revision` + `batchId` + `blueprintId`: 생성 문항의 실제 식별자와 버전.
- `sourceSchoolMarker`는 **유래/연결**일 뿐 `그 학교 실제 기출` 표시나 슬롯 대체 인증이 아니다.

### B. 공유·대체 연결 — 별도 다대다 관계
- `l3SharedKey`: 최소한 `curriculum + standardCourse + canonical RPM primary L3 identity`가 결속된 공통 연결키. 동일한 한글 L3 라벨만 비교하지 않는다.
- `originSlotKey`: `sourceExamUid + qid`.
- `eligibleSlotKey`: 다른 학교를 포함한 `targetExamUid + qid`. 하나의 UID가 여러 eligible 슬롯에 연결될 수 있다.
- `relationshipType`: `SOURCE_DERIVED` / `SAME_L3_PRACTICE` / `SLOT_REPLACEMENT_CANDIDATE` / `SLOT_REPLACEMENT_ELIGIBLE` 분리.
- `replacementEligibility`: `UNASSESSED`, `REJECTED`, `ELIGIBLE` + 근거. 이는 설계용 상태이며 기존 런타임 enum으로 간주하지 않는다.
- source 파생관계나 shared L3 조회 결과를 곧바로 ELIGIBLE로 승격하지 않는다.

### C. 메타 계층
1. 교육과정·학년·과목·학기/학습 시점·L1/L2: 대상 범위와 사용 자격.
2. 정확한 RPM Primary L3: 공통 주개념 검색.
3. RPM canonical L4 / 승인 대기 extension L4 / semantic Blueprint: 문제 유형 세분화 및 대체 비교. **새 extension L4는 별도 candidate registry**에 누적하고 LOCKED RPM 정본에 자동 추가 금지.
4. CrossConcept / Condition / Integration / PT·TPL / difficultyBucket 1~5 / level: 풀이 성격과 난이도 보정.
5. questionType / image·SVG·table / expected solvingTime(실측 아니면 추정 표시) / scoringRole / 서술형 rubric: 시험지 슬롯 형식 적합성.

## 2. 두 가지 조회 모드

### 모드 ① 학교 간 L3 공유 연습
- 교사가 효천고 해당 단원을 선택하면, 그 학교 원본 관련 문항을 기본 노출한다.
- 추가 연습 선택 시 여러 학교·생성문항에서 **동일한 canonical L3**를 검색하여 후보를 확장한다.
- 다른 학년의 문제는 target 교육과정 이수 범위를 충족하는 경우에만 진입. 같은 L3 라벨이더라도 상위 학년 풀이·문제 개념이 필요한 문항은 제외.
- L4가 달라도 **L3 학습용**으로는 추천 가능. 확장 L4는 candidate 표기하고 정식 품질 승인 수준을 속이지 않는다.
- 타교 sourceMarker는 노출하되 생성 문항을 타교 실제 기출로 오인시키지 않는다.

### 모드 ② 원본 슬롯 대체형 학교별 모의고사
- 원본 시험지 구성(문항 수, 순서, 객관/서술, 기본 단원 분포)을 template로 사용한다.
- 각 원본 qid마다 `SLOT_REPLACEMENT_ELIGIBLE` 문항 중 정확한 target 교육과정/학기/이수 범위, primary L3, 필요한 L4·Blueprint와 질문 목표, 객관/서술형, 난이도 허용 범위·계산 부담·시각자료 유무를 확인한다.
- 시험지 전체 난이도 분포를 유지할 기본 `SCHOOL_BALANCED` 모드와 새로운 L4를 포함할 `L3_EXPANDED` 모드를 분리한다. EXPANDED 모드도 커리큘럼과 검증 gate를 완화하지 않는다.
- 해당 슬롯 대체후보 0개이면 교사 설정대로 `KEEP_ORIGINAL` 또는 `UNFILLED_REPORT`. 무자격 문항으로 몰래 채우지 않는다.
- 단원 선택 시 시험지 전체가 아닌 일치하는 원본 슬롯만으로 부분 모의고사를 만들 수 있다. 대상 범위를 벗어난 원본 슬롯을 유지할지는 UI에서 명시적으로 설정.
- **출제본 생성 시마다 선택된 UID+revision+원본 슬롯 매핑+seed+템플릿 SHA를 동결**해 재출력·답지·채점에서 동일 문항을 보장한다. 재생성 버튼은 새 paperRevision을 만든다.

## 3. 랜덤 배정/중복 방지

1. 대체 슬롯별 eligible 후보집합을 확정하고, 확정 당시 revision을 고정한다.
2. seed 기반 PRNG로 선택해 같은 조건·seed로 재현 가능하게 한다.
3. 한 회차 내 동일 UID 사용 금지. 같은 semantic Blueprint 또는 사실상 동형 parameter 문제 중복은 가능한 범위에서 억제한다.
4. A/B/C 여러 회차 생성 시 이전 회차 UID 반복 최소화. 부족할 때는 반복 필요성을 사용자에게 노출하고 강제 unique를 가장하지 않는다.
5. 후보 가중치는 원본 L3·L4의 적합성, difficultyBucket, 풀이 구조 다양성, 이전 오답/최근 사용 이력으로 조정한다. 임의 예측 점수나 측정되지 않은 학교 적중률을 근거처럼 제시하지 않는다.
6. 학생에게 제공할 시험지에는 정답·해설 필드를 노출하지 않는다. 정답지/해설지는 별도 권한과 생성 모드에서만 제공한다.

## 4. 학교별 오답 재시험 → 생성 공급 루프

- 학생의 오답 기록은 `paperRevision + selectedUid + sourceSlot + skill L3/L4 + 응답·정오`로 기록한다.
- 같은 원본 슬롯의 다른 eligible UID를 우선 선택해 재시험을 구성한다.
- 동일한 결정 구조에서 반복 오답 시 하위 난도·선수 개념 연습으로, 안정적인 정답 시 다른 Blueprint·L4로 확장한다. 점수/학습 행동 없이 숙련 확정을 주장하지 않는다.
- 후보 부족 현황(`eligibleCount`, `eligibleL4Coverage`, `reusePressure`, `reviewPending`)을 ALIVE 생산 우선순위에 반영한다.
- 학생 개인정보/실명/응답 데이터는 공개 Git 마커 파일에 저장하지 않는다. 학교·문항 메타와 학생별 기록은 별도 접근제어 경로를 갖는다.

## 5. 저장·조회·DB 연결 계획

### 작성/보관 authority
```text
archive/generated/lite/v1/<curriculum>/<grade>/<L2-key>/
  manifest.json
  shards/<batchId>.js
  metadata/<batchId>.json
  extension-l4/registry.json                 # 신규 L4 후보 (정본 아님)
archive/data/generated-lite/
  generated-question-index.json              # 전체 생성 UID → 최종 shard/revision
  source-slot-links.json                     # 원본 seed 슬롯 → 생성 UID들
  l3-sharing-index.json                      # canonical L3 → 검증 가능 UID pool
  slot-replacement-eligibility.json          # 대상 슬롯 ↔ 적격 UID, 근거/검증 SHA
```
위 인덱스 경로는 **제안 설계**, 현재 실제 제품 통합파일이라고 주장하지 않는다. 이미 생성된 pilot 파일은 유지하고 별도 adapter와 migration으로 연결한다. 대형 DB에서는 단일 거대 JSON에 매번 전체 rewrite하지 않고 키별/shard별 인덱스 또는 서버 canonical persistence를 선택해 동시 업데이트/성능을 검증한다.

### 서비스 연동 순서
1. Archive 원본 `sourceArchiveFile/qid` 안정적 provenance → generated UID의 일대다 역색인.
2. 동일 L3 candidate search, 다른 학교 참조/필터 및 학년 커리큘럼 hard gate.
3. verified eligible slot mapping materialization + runtime consumer readback.
4. 실제 Archive2/Factory 출력 경로로 시험/답/해설 mode 테스트, 정답 비공개·PDF/재열기·revision 재현 테스트.
5. 교사용 모의고사 생성 UI → 학생별 재시험 → 다른 학교 L3 공유.
- 기존 `archive2-catalog.json` 및 `question_metadata.json` 등 무거운 canonical DB를 파일럿 등록만으로 임의 변경하지 않는다.
- **Git 파일이 생긴 것 ≠ Archive2 DB 검색·출제 등록**. 각각 별도 receipt/readback으로 상태 보고.

## 6. 실제 출제 자격/품질 gate

- 최소 gate: 각 문항의 학생용 발문+보기+시각정보 blind 독립 수학 검산, 유일정답, 해설과 정답/보기 일치, 원패스 작성자 메타 정합성 검사, 같은 학년·시험 범위의 문제·해설 개념만 사용, 중복/실제 렌더 및 소비 경로 적합성.
- L3 공유 후보 노출과 원본 슬롯 대체 공급을 분리한다. 미검수 생성 후보가 학생용 시험지에 자동 섞이지 않도록 한다.
- `originSlotKey`의 확장 개수와 `eligibleSlotKey`별 실제 대체 가능한 UID 수는 다를 수 있다.
- FULL seal/Common verified 공급은 각 정식 CURRENT 계약의 별도 증거 필요. LITE 문서만으로 자동 승격 불가.
- 학교 간 교차 연결에서는 타교 원본의 시험 범위·해당 학년 교육과정을 위반하는 문제를 자동 제외한다. **L3 공유 발견 ≠ 교차 학교 대체 자동 허용**.

## 7. 파일럿 검증 범위와 성공조건

- 입력: 효천고 고1 2026 1학기 중간 (26문항), 최신 source SHA와 기존 ALIVE LITE pilot UID를 readback.
- 샘플: 효천고 q5(생성 후보 9개), q23(1개), 신규 q1/q3/q19 등을 대상으로 학교/원본번호 마커 구현과 same-L3 탐색을 시도.
- 최소 사례: (A) 동일 학교 같은 슬롯 eligible 여부 (B) 같은 L3 다른 L4의 연습-only 매칭 (C) 다른 학교의 같은 L3 발견 (D) 다른 학년 상위 개념 제외 (E) 후보 0개 fallback (F) seeded rerun 동일 paperRevision/선택 결과.
- 성공 수치: `sourceSlots`, `generatedUids`, `sameL3Discoverable`, `slotEligible`, `paperGenerated`, `crossSchoolCandidate`, `curriculumRejected`, `actualDBIntegrated` 별도 보고.
- 현재 구현 전 상태: **DESIGN_ONLY / actualDBIntegrated=NOT_TESTED / paperGenerated=0**. 이전 pilot의 22문항은 품질 미확정 candidate이며 이를 사용 가능한 모의고사 22문항으로 집계하지 않는다.

## 8. 다음 단계 구현 우선순위

**P0** — 기존 생성 UID/원본 번호/정본 L3 adapter 및 저장구조 실사.
**P1** — source-slot marker + L3 shared candidate read model (read-only) / 격리된 pilot index.
**P2** — curriculum + L4/Blueprint/difficulty 슬롯 적격성 gate / seeded A/B/C 시험지 assembly.
**P3** — 실제 Archive2 loader·검색·시험/정답/해설 render·DB readback 및 권한 regression.
**P4** — 오답 재시험·학교 간 공유·부족 유형 생산 루프.

**결정 요약:** L2는 문항 본문 보관, L3는 학교 간 공유, L4/Blueprint는 실제 풀이유형과 슬롯 적합성, 학교/원본 마커는 시험지 템플릿, generated UID는 전역 중복 없는 식별자. 한 문항은 여러 학교 슬롯에서 재사용하되 원문 기출과 생성 문항의 출처를 혼동하지 않는다.
