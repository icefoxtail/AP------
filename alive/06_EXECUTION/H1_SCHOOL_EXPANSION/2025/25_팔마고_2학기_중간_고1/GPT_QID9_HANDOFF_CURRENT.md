# GPT 팔마고 Q01 제작 이력 / 새 시험지 통합 원장 우선

> **통합 이동:** Q01은 `work/alive-25-palma-h1-2mid-qid9`의 독립 Q01 커밋에 편입됐다. 기존 PR #353 및 q01 전용 브랜치는 역사 참고이며, 이 파일의 'q1 검수 완료 전 q2 금지'·blind freeze 의무는 최신 QID9 정본에 의해 대체됐다. 최신 리뷰는 공개답, 누적 배치 단위. 시험지 전체 상태는 `GPT_QID9_EXAM_HANDOFF_CURRENT.md`를 따른다.

- 기준일: 2026-10-09 KST
- 정본 Git main 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` (SHA `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`), 23 qid.
- 새 생산 branch: `work/alive-25-palma-h1-2mid-qid9`; branch HEAD는 인계할 때 Git에서 실조회. 사용자의 새 세션은 첫 실행 시 이 branch HEAD와 최신 main을 조회.
- 27개 기존 배치: 후보 문서 이미 main, 26 historical PASS/1 SVG HOLD, 학생 선택 4/공급 HOLD 23 (중복 생성 금지).
- 새 Q01 9슬롯: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q01_CREATE_DRAFT.md`에서 A1~C3 문항·5지·답·한국어 해설 9/9 작성. **아직 독립 review/학생등록 불가**.
- 우선순위: 새 Q01 독립 REVIEW부터, q1 9슬롯 개별 수학 first-blind freeze 후 공개 답 비교. REVIEW 출판 가능 UID, 신규 Blueprint/기존 family·RPM L3/L4·필수 시각·교육적 역할을 판정. Q01 closure 전 q2 자동 착수 금지.
- REVIEW 단계에서 fatal 수학 결함 발견 시 GPT가 해당 슬롯만 재설계/수정하되 9슬롯 완료 상태를 유지; 불가하면 `QID_INCOMPLETE` 이유 저장. Codex는 품질 결정 금지, 지정 Git 운영병합만.
- 80% 컨텍스트 경고: 모델이 실제 사용률을 숫자로 읽을 수 없으므로 정량 퍼센트 주장 금지. 한 qid의 Git checkpoint/handoff 후 새 세션으로 넘기는 것이 기본이다.

## 물리 체크포인트 (2026-10-09)
- 첫 작업 qid: **1**, 신규 9개 CREATED_DRAFT, 개별 UID suffix A1/A2/A3/B1/B2/B3/C1/C2/C3.
- Q01 draft Git blob: `255fc333c6a60dc397e32cf27c75fce88ebdcdf3`. 최신 branch HEAD는 다음 세션에서 readback 후 결속한다.
- 학생용 5지 9/9, 보기 문자열 중복 0, 정답기호 ①2 / ②2 / ③1 / ④2 / ⑤2; 구조/작성자 계산 확인만 수행.
- 독립 GPT first-blind review: **0/9 NOT_STARTED**. 신규 Generated L4는 source-specific 설계 registry에서 즉시 GENERATED_ACTIVE지만 9개 학생용 UID는 독립검수 전이므로 출제되지 않음. Meta 정확 binding, 실제 Chrome, 학생용 신규 9 UID 등록도 모두 미실행.
- Draft tracking PR: [#353](https://github.com/icefoxtail/AP------/pull/353) **DRAFT, DO NOT MERGE UNTIL GPT QUALITY GATES**.
- MAIN 정본 규칙: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`; 9슬롯 디자인·모의고사 선택 및 순환. 사용자 요청의 기존 27개는 main 후보 보존, 4학생 공급/23 공급보류 상태 유지.

## CURRENT 2026-10-09 — L3 고정·발문 우선·검수 즉시 출고 변경
- 최신 실행 정본 main: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 상단 CURRENT USER AUTHORITY, `alive/06_EXECUTION/ALIVE_LITE_L3_L4_EXTENSION_DISCOVERY_CONTRACT_v1.md` USER OVERRIDE.
- **추가 설계 시트**: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q01_L3_L4_CROSSCONCEPT_DESIGN.json` Git blob `21c19ee23b7eee2152dfe86b2602343885ebfcff`; 원본 RPM L3 `H1-RPM-231 집합과 원소` 고정, A1~C3 9개 각각 L4·CrossConcept·조건·결정적 풀이를 기록. Generated 전용 EXT-L4 2종 즉시 설계 등록, 기존 RPM LOCKED는 불변.
- q1 **발문 우선 재작성**: A1/A2 질문 단순화, B3는 학생 주장식 대신 ㄱㄴㄷㄹ 학교식 참거짓, C2/C3는 핵심 질문을 고정 L3의 원소 소속 판정으로 보정. B2에서 이전 '①도 거짓' 해설 모순 수정. 이는 CREATE 보정이지 독립검수 PASS 아님.
- **새 출시 정책**: GPT 첫 독립검수에서 통과한 UID는 별도 L4 승인/분류 통합을 기다리지 않고 Generated Consumer DB·인덱스·학생용 Archive 2.0 검색/선택 및 main 병합으로 바로 보내야 한다. 필요한 adapter/렌더·실제 readback은 최소 기술 closure이며, 미실행이면 DONE 금지. Archive 1 원본 불변.
- 다음 창은 생성자 답·해설이 이미 같은 채팅에 노출된 점을 인지하고, 첫 답 동결을 신규 별도 창의 진짜 독립 입력에서 진행한다. **불필요한 추가 quality approval 단계는 만들지 않는다.**

## CURRENT — Generated L4 물리 등록·즉시 출시 기본방침
- q1 Generated 전용 EXT-L4 registry: `archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/registry.json`; 현재 Git blob `87d45f9fdbd49573acd10453abaf3af8a5a793f2`, 2종 등록. `GENERATED_ACTIVE`는 L4 사용 가능 의미 라벨 등록이고, q1 9 UID의 학생 공급은 아직 `REVIEW_NOT_RUN`이다.
- q1 SOURCE-L3 `H1-RPM-231 집합과 원소` 고정. B3는 ㄱㄴㄷㄹ 학교식 발문, C2/C3는 원소 소속 조건을 이용하는 최종 질문으로 보정한 후보본. 모든 슬롯은 새 독립 GPT에서 최초 수학 답·발문 품질검수 필요.
- 첫 독립 PASS UID는 Generated Consumer에 즉시 등록하고 사용자/교사가 Archive 2.0에서 조회·선택/모의고사 출제할 수 있도록 동시 마감. 더 이상 L4 승인·중복 유형 통합을 선행 gate로 기다리지 않는다. Runtime 구현·조회가 실제 실패하면 최소 기술 수정 후 재검증하며 허위 완료 금지.

## CURRENT OVERRIDE — 2026-10-09 Generated 공개답 발문 우선 검수 (이전 'blind freeze 필수' 절차 우선 대체)
- 원장 최신 지시와 main `ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 기준: 생성문항 검수자는 **정답·상세 해설·설계 파일을 처음부터 열어도 된다**. 학생용 발문·보기의 한국 내신 품질을 가장 먼저 판단하고 직접 수정한 뒤, 해설의 수학 계산·경계·오답을 단계적으로 추적한다.
- `STUDENT_ONLY` 파일은 선택적인 발문 모아보기 보조자료다. 별도 차단·'답 안 보고 먼저 9개 풀어 동결'을 필수로 요구하는 아래 과거 인계 문장은 HISTORY이다. 기존 기출 R1/R2 blind 계약은 불변.
- 의심 문항만 대체 풀이/정확 경계 대입을 집중 수행한다. 문항 품질 PASS는 최종 검수자가 실제 확인한 것을 기록하고 모든 PASS UID를 Archive2 Consumer/index/main에 즉시 등록·학생 조회 검증까지 마감한다.

## 다음 창에 붙여넣을 메시지

팔마고 GPT QID9 작업을 이어라. 최신 main과 `work/alive-25-palma-h1-2mid-qid9`의 `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q01_CREATE_DRAFT.md`, `GPT_QID9_Q01_L3_L4_CROSSCONCEPT_DESIGN.json`, `archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/registry.json`, 이 HANDOFF 파일, `alive/06_EXECUTION/ALIVE_LITE_EXECUTION_RULES.md`를 먼저 읽어라. 새 qid로 가지 말고 q1의 9문항만 독립검수하라. 후보의 답·해설을 보기 전 학생용 발문·5지·필요 그림만 동결해서 9개 전부 먼저 풀고, 이후 비교 및 맞춤 수정·정확한 RPM 매핑·출시 eligibility를 기록하라. Codex는 Git 병합만 담당한다. 완료 결과를 Git에 저장해 새로운 HANDOFF를 갱신하라.
