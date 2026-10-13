# 2025 제일고 고1 2학기 기말 — ALIVE QID9 4·5차 품질검수 핸드오프

**작성:** 2026-10-13 (Asia/Seoul)  
**상태:** HANDOFF_ONLY / 문서 인계. 4·5차 품질검수, 수정, Consumer 등록, main 병합을 이 문서 작성으로 완료한 것이 아님.

## 0. 다음 창에서 할 일

**4차 q16~q20 = 5 원본 × 9 = 45문항**, 이어서 **5차 q21~q22 = 2 원본 × 9 = 18문항**을 순차 실행한다. 다음 창은 4차부터 즉시 실제 검수·수정하고, 4차 Git 검수 마감 후 사용자 재지시를 기다리지 말고 5차를 이어간다. 문서 읽기·상태 확인만 하고 종료하지 않는다.

형님 강조사항: **문항 생성 단계에서 Meta를 완성하는 것이 원칙. 이번 63 UID의 근거부채는 직접 정본 대조·수정하여 해소한다.** 단, 정확한 근거가 없으면 허위 값이나 가짜 PASS를 쓰지 않는다.

## 1. 기준점: 실제 Git 확인 (작성 시점)

- 저장소: https://github.com/icefoxtail/AP------
- 작업 브랜치: work/alive-25-jeil-h1-2final-qid9
- 작업 브랜치 확인 HEAD: 547ba35c99954634388cbcd2e8e6f45ef2d0620a
- 확인 당시 main HEAD: 9ef346166197eb6f0eed48453fe44a72ecfe162f (변동 가능, 다음 창에서 다시 확인)
- 공통 디렉터리: alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_제일고_2학기_기말_고1/
- 실제 학교 원본: archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js
- 원본 Git blob SHA: 252c1cc9a687cadd961183b56ea10d21bf1976b4
- 현황 원장: GPT_QID9_PROGRESS_CURRENT.json
- 메타 원장: GPT_QID9_GENERATED_META_REGISTRY_v1.json
- 실행 정본: alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md
- 메타 필수 계약: docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md
- 반드시 적용: AGENTS.md / 현재 Notion 'GPT 작업 전 필독 라우터' → 'Archive 2.0 / JS Archive 시작 페이지' → 'Archive 전체 작업 생명주기'.

**현재 기준 198/198 AUTHOR DRAFT, 135/198 GPT 품질검수 완료, 나머지 63/198. Consumer indexed 0, 학생 Chrome 검증 0.**

이미 검수 완료한 q01~q15 135 UID는 다시 검수하지 않는다. 범위 밖에서 실제 직접 의존성 결함이 밝혀질 때만 해당 UID만 표적 확인한다.

### 완료된 검수 배치 (재사용할 물리 증거)

- 1차 q01~q05 / 45문항: GPT_QID9_Q01_Q05_OPENBOOK_REVIEW_20261013.json / 커밋 7f72ba53624ba615f2b1392be0165fccbb9fa06c
- 2차 q06~q10 / 45문항: GPT_QID9_Q06_Q10_BLIND_MATH_FREEZE_20261013.json 및 GPT_QID9_Q06_Q10_OPENBOOK_REVIEW_20261013.json / 커밋 0291bf717a7c296171aa278cc7984d2504ed414c
- 3차 q11~q15 / 45문항: GPT_QID9_Q11_Q15_BLIND_MATH_FREEZE_20261013.json 및 GPT_QID9_Q11_Q15_OPENBOOK_REVIEW_20261013.json / 커밋 547ba35c99954634388cbcd2e8e6f45ef2d0620a
- 기존 승인 135 UID·원본 학교 JS·RPM LOCKED는 보호한다.

## 2. 63 UID 메타 근거부채 — 원인과 수정 책임

**고유 63 UID = 4차 45 + 5차 18. q21의 두 원인은 동일한 9 UID에 중첩되어 있으므로 72 UID가 아니다.**

### 4차 q16~q20: 45문항

1. **q16 (9 UID):** 실제 각 후보의 primaryL3Id 및 rpmRecordId가 null이며 RPM_LOCKED_PRIMARY_L3_NOT_MAPPED_FOR_NESTED_RATIONAL이 기록됨. 원본 q16은 복분수형 유리식 정리 문제. 먼저 원본 내용·검증된 풀이로 결정적 수학 기능 확인 → high1 RPM crosswalk와 ACTIVE canonical/Meta Foundation에서 정확한 L3/L4 찾기. 일치하지 않는 RPM 키 임의 강제 금지. 필요한 경우 유효 parent를 검증한 Generated-only extension을 기존 정책에 맞게 등록하고 후보 Meta + GPT_QID9_Q16_META_REGISTRY_DELTA.json까지 동일 UID로 결속한다. 단순 NONE/null 처리로 마감 금지.
2. **q17 (9), q18 (9), q19 (9), q20 (9), 총 36 UID:** 각 후보 및 source 루트 sourceUid=null. qid_v1 정확한 원본 UID hash 미확인 상태. 원본 Git blob·qid·공식 UID 생성/레지스트리 authority를 직접 대조한 뒤 source.sourceUid → 9개 후보 sourceUid → 메타 원장 UID assignment 및 관련 receipt/sidecar를 함께 수정한다. 눈짐작·가짜 SHA/UID 금지. 확실한 source 관계가 입증되면 해당 EVIDENCE_DEBT를 갱신한다.
3. 4차 전체 45 UID의 student stem·보기·필수 원본/문제 SVG만 먼저 보고 수학 답을 물리적 ledger에 동결한 뒤 author answer/solution/meta를 공개해 대조. 객관식은 5선지/오답 4개 실제 계산, 정답 유일성·교육과정·발문·난이도·L3/L4·PT/TPL·Condition/CrossConcept·provenance·필수 도형/해설 SVG 확인.
4. q17은 루트 그래프·정사각형 조건, q18은 조각함수 경계와 합성함수, q19는 양화/부정과 조건, q20은 역함수 교점/그래프를 표적 고위험 확인한다.
5. 결함은 발견한 해당 UID만 최소수정하고 풀이·정답·오답 근거·Meta·SVG 등 직접 영향만 재검. q16의 미확정 L3를 추측으로 해결하지 않는다.

**4차 완료조건:** q16~q20 45 UID를 전수 판단, 확인된 오류 수리, Meta 근거부채 정확하게 처분, source/registry/sidecar 일치, 변동 자산 검증, 4차 freeze+review ledger 물리 저장, 같은 작업 브랜치에 대상만 1커밋, remote readback 및 progress 갱신. 전부 PASS가 실증되었을 때만 누적 승인 180/198. 미해결이 있으면 정확히 특정하고 허위 PASS/완료 숫자 금지.

### 5차 q21~q22: 18문항 (4차 후 연속)

1. **q21 (9 UID):** sourceUid=null + 'RPM_EXACT_L3_TELESCOPING_NOT_PRESENT_PARENT_H1_RPM_263'가 함께 기록됨. 원본 q21은 1/[x(x+1)] 망원합에 관한 서술형. 기존 Generated L3 EXT-L3-JEIL25-Q21-RATIONAL-TELESCOPING가 메타 원장에 이미 있으므로 **중복 생성 금지**. 기존 L3의 parent H1-RPM-263이 실제 수학적 주개념과 맞는지 확인 → 정확한 RPM L3 / Generated-only parent 구조로 정리. source UID도 q17~20과 동일하게 정본 근거로 복원. 별개 원인 두 건이 같은 9 UID에 중첩된다는 점에 주의.
2. **q22 (9 UID):** sourceUid=null. 원본은 자연수 a,b,c 및 a²+b²=c²의 귀류법/짝홀 관련 증명, 생성 후보는 다양한 정수론·증명 문항. 9개 각각의 전칭 주장에 **일반적인 완전한 증명**이 있는지 검사. 제작자의 유한 예시 검사(예: 192개 피타고라스 수)만으로 전체 정수에 대한 증명 PASS 금지. 반례·짝홀·모듈러/나머지·조건 범위·교육과정 밖 풀이 여부를 표적 확인한다.
3. q21·q22에서도 blind answer/proof freeze → 작성자 풀이 비교 → 9 UID당 확정 결함만 표적 수리 → L1~L4/주 L3/RPM/UID/Meta 확장·SVG 독립 확인. 객관식이면 5지 전체, 서술형이면 논증 완결성 및 결과 표현을 실제 문제 형식대로 검수한다.

**5차 완료조건:** 18 UID 검수 및 수정·메타 debt closure, 증명 전수 판정, UID/등록 메타 직접 의존성 결속, freeze+review ledger 저장, 작업 브랜치 단일 대상 커밋·remote readback. 실제 전부 PASS면 누적 198/198 및 미해결 Meta 근거부채 0/198이 되어야 함. 근거가 남았으면 완료로 둔갑시키지 않는다.

## 3. 작업 기록과 출시 범위

- 변경 전 source/choices/solution/Meta/asset의 실제 권한을 확인하고, qid별 최초 독립 답/핵심 계산을 **작성자 답·해설 읽기 전에 동결**한다.
- 고등학교 1학년 2학기 교육과정 내 풀이만 허용. 모델·원본 해설·자가 검산이 검수자의 별도 판단을 대체하지 않음.
- 기존 source/exam, UID 및 provenance 정본 불변. generated original content와 원본 기출 파일 혼동 금지.
- 생성 UID의 L1~L4·RPM primary L3·L4·PT/TPL·CrossConcept/Condition/IntegrationPattern·level(하/중/상)·difficultyBucket(1~5)를 전부 문항 실제 풀이 근거로 판정한다. 기존 canonical 재사용, 필요한 Generated-only 확장만 허용하며 RPM LOCKED 전역 수정 금지.
- source 후보 JSON + GPT_QID9_GENERATED_META_REGISTRY_v1.json + q16 메타 delta + 기존 q17~q22 evidence·receipt·handoff 등 실제 직접 의존 파일을 확인하고, 수정된 필드가 하나만 업데이트된 채 다른 곳에 과거 debt가 남지 않도록 함.
- 새 ledger 예: GPT_QID9_Q16_Q20_BLIND_MATH_FREEZE_20261013.json, GPT_QID9_Q16_Q20_OPENBOOK_REVIEW_20261013.json; 5차는 Q21_Q22 이름으로 동일. 실제 생성 날짜·검수 결과와 일치시키고 이전 인증/PASS 수치 임의 복사 금지.
- 기존 문항 내용 검수와 실제 소비자 출시는 분리. **이 인계는 4차·5차 품질검수용이다.** Consumer/index/main/Pages/학생 Chrome 검색·선택·표시/문제지·해설·정답표 출력은 실제 기술 출고를 수행하기 전까지 NOT_RUN; 최종 6차 운영등록·출력 검증에서 별도 마감. 최신 사용자 출고 지시가 달라지면 그 지시가 우선이다.
- 브랜치·main HEAD는 다음 창에서 최신 재조회. 형님이 확정한 이전 135문항은 재검수·재승인하지 않는다. 다른 예약 레인이나 프로젝트를 OFF/변경하지 않는다.

## 4. 다음 대화창 복사 시작 프롬프트

2025 제일고 고1 2학기 기말 ALIVE 유사문항 198개 검수를 이어서 해. Git 브랜치 work/alive-25-jeil-h1-2final-qid9에서 GPT_QID9_Q16_Q22_REVIEW_HANDOFF_CURRENT.md부터 읽어. 이전 q01~q15 135문항은 이미 검수 PASS니까 재검수하지 마. **4차 q16~q20 45문항, 이어서 5차 q21~q22 18문항을 실제 독립 풀이 → 제작 답안 대조 → 필요 최소수정 → Meta 원본 UID/RPM L3/L4 근거부채 직접 해결 → SVG 확인 → 문항별 검수 ledger → Git 대상만 커밋·원격 readback까지 수행해.** q16 RPM L3 null 9 UID, q17~q22 sourceUid null 54 UID, q21의 RPM L3 의미 불일치를 반드시 해결하고 임의로 NONE·PASS 처리하지 마. q22의 9개 증명은 유한 테스트만으로 통과시키지 마. 4차 마감 후 나에게 다시 물어보지 말고 5차까지 이어가. 최종 6차 Consumer/main/Chrome은 미실행이면 완료라고 하지 마. 각 차수별 실제 완료 상태만 보고해.
