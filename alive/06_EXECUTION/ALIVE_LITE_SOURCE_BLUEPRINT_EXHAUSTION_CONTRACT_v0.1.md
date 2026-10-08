# ALIVE LITE — 원본별 Blueprint 탐색 완료 계약 v0.1

작성일: 2026-10-08 KST
상태: CURRENT / 단일 CREATE 세션, source-qid별 완료 게이트
적용 범위: ALIVE 생성 전용. 기존 Archive original 및 R1/R2/R3 품질 계약 유지.
우선순위: 이 문서는 CREATE 단일 세션 생산량 실험 v0.1의 **원본별 종료 조건**을 보완·우선한다. 채팅 1=CREATE, 채팅 2=독립 REVIEW+main.

## 핵심 구분
- **세션 분모 = 시험지 전체**: 사용 가능한 긴 단일 채팅 세션 동안 다음 원본을 계속 생산. 1~3 source qid 뒤 자동 종료 금지.
- **탐색·완료 단위 = source qid 하나**: 신규 문항을 몇 개 만들었다는 이유만으로 완료 금지.
- **탐색된 유형 = meaningfully distinct semantic Blueprint**: 숫자·부호·학교·문형만 바꾼 instance는 신규 Blueprint로 세지 않는다.
- **종료 판단 = 관련 기존 L4/새 L4 후보/조건·CrossConcept·Integration의 구조 탐색을 완료하고 미채택 후보를 이유별 분류**. 가능한 모든 수학 구조를 수학적으로 증명했다는 의미는 아님; 검토한 범위와 합리적 stop reason을 기록한다.

## CREATE 원본 1개 루프
1. SOURCE UNDERSTAND: 학생용 원본 발문·보기·필수 시각자료와 원본 풀이를 읽고 교육과정·실제 RPM L3·원본 L4·결정적 풀이 steps를 파악.
2. BLUEPRINT EXPLORE: **먼저 제작할 문제가 아닌** 같은 L3 안의 관련 RPM L4 전체 후보를 펼치고, 서로 다른 출제 목적/결정적 풀이 구조/조건/교차개념/통합방식을 후보별로 분리. 신규 extension L4는 RPM LOCKED 정본과 격리.
3. BLUEPRINT TRIAGE: 후보를 `ACCEPT / DUPLICATE / L3_DRIFT / CURRICULUM_VIOLATION / NO_VALID_MATH_STRUCTURE / HOLD` 중 하나로 판정; ACCEPT에 의미적 구별 근거 및 교육과정 안의 풀이 가능성 기록.
4. PRODUCE: ACCEPT 후보마다 문항 발문, 적절한 객관식 5지 또는 원본 주관식 계약, 유일 정답, 상세 학생 해설, L1/L2/L3/L4/CrossConcept/Condition/Integration/난이도/학교·qid provenance를 함께 완성. 각 후보 아래 숫자/문형 instance는 별도 count. SVG 필수문항은 spec/asset 생성, 시각 디자인 일괄검수는 후속.
5. SELF-CHECK: 계산·선지·해설 내부 일치와 같은 Blueprint 중복·교육과정·메타 정합만 생성자 점검. 독립 수학 검수 PASS로 위장하지 않음.
6. SOURCE CLOSE: 원본별 exploration ledger에 **탐색 후보 수/ACCEPT 수/실제 완성 UID 수/숫자변형 수/미개척 L4·제외 사유/잔여 HOLD** 기록. 의미적 확장 후보를 합리적으로 소진했다면 `SOURCE_EXPANSION_DONE`; 잔여가 있거나 작업 한계라면 `SOURCE_CONTINUATION_REQUIRED`. 제작 0건도 근거 있는 탐색 완료라면 가능.
7. NEXT: 같은 CREATE 채팅 세션에서 즉시 다음 source qid로 이동. 세션 수명 때문에 앞 qid로 돌아갈 필요가 없도록 checkpoint/receipt를 남김.

## Ledger 최소 스키마
```json
{
  "sourceQid": 1,
  "rpmL3Id": "verified canonical identity",
  "originalL4Id": "verified canonical identity",
  "examSourceSha": "sha",
  "exploredBlueprints": [
    {
      "id": "BP_ID",
      "targetL4Id": "RPM or EXT candidate identity",
      "decisiveStepSignature": "distinct mathematical decision",
      "disposition": "ACCEPT | DUPLICATE | L3_DRIFT | CURRICULUM_VIOLATION | NO_VALID_MATH_STRUCTURE | HOLD",
      "reason": "brief evidence",
      "generatedUids": [],
      "numericInstanceCount": 0
    }
  ],
  "candidateCount": 0,
  "acceptedBlueprintCount": 0,
  "notExploredL4": [
    {"l4": "canonical id", "reason": "reason for not producing"}
  ],
  "sourceStatus": "SOURCE_EXPANSION_DONE | SOURCE_CONTINUATION_REQUIRED"
}
```
위 코드는 계약 예시이며 실제 Meta/RPM 필드명은 최신 정본을 우선한다.

## 종료/방지 게이트
- 탐색 전에 4~6문항부터 만들고 임의로 다음 qid 이동 금지.
- L4 후보 목록 중 건너뛴 개념은 왜 제외했는지 기록해야 함. 단순한 모든 L4 조합 brute force는 금지; 같은 L3와 교육과정의 실질적 관련성부터 평가.
- 10문항 생산했다고 자동 완료 아님. 후보 12개를 발견했으나 7개만 제작했다면 계속 제작 또는 HOLD 사유를 기록.
- 달성량 KPI는 `unique candidate count` + `distinct ACCEPT Blueprint count` + `source expansion completed count` + `verified/released after REVIEW`로 분리.
- CREATE는 최종 수학 PASS 권한이 없다. REVIEW 두 번째 창에서 fresh blind 독립 수학·메타 검수 후 수정/MAIN 병합까지 마감.
- 같은 세션에 계속 진행할 수 있도록 qid 끝마다 작은 durable receipt만 남긴다. 1~3문항 batch 강제 부활 금지.

## 파일럿/기존 이력
복성고 2026 1학기 기말(23 original qids)에서 본 계약 사용. 효천고 기존 후보 수(94 보고)는 이 계약으로 소급 `SOURCE_EXPANSION_DONE` 처리 불가; 원본별 Blueprint 탐색 ledger 없는 기존 건은 `EXPANSION_NOT_AUDITED`로 유지하고 후속 검토 시 gap 분석.

## CURRENT ADDENDUM — L3/L4 외연 확장 포함 원본별 완료 게이트 (2026-10-08)
- 기존 RPM 내 L4만 검사하고 탐색 완료로 끝내지 않는다. 현재 및 prior/lower-only RPM L3/L4 전체를 조회한 뒤, 실제 primaryMethod가 다른 경우에만 새 L3, 기존 L3 안의 다른 결정적 풀이 구조에는 새 L4 후보를 생성한다.
- EXT candidate의 독립 REVIEW 상태와 CREATE 원본 탐색 완료는 분리하지만 **미발견·미분류·미생성 유효 EXT Blueprint가 남아 있으면 SOURCE_EXPANSION_DONE 금지**. 후보 등록만으로 canonical 인정 금지.
- 각 source close에 기존 L4 coverage, EXT L3/L4 후보 ID·예시 UID·canonicalComparator, CONDITION_ONLY 수, 미개척 영역·stop reason을 ledger로 저장. RPM semantic과 PT/TPL machine projection gap 구별.
- 신규 라우터: ALIVE_LITE_L3_L4_EXTENSION_DISCOVERY_CONTRACT_v1.md.
