# ALIVE GPT QID9 — 원본 한 문항 × 9개 슬롯 작업 계약 CURRENT

## CURRENT USER AUTHORITY — L3 고정·L4 확장·발문 우선·1회 검수 후 즉시 공급 (2026-10-09)
이 절은 **GPT 신규 ALIVE QID9 문항 생성·검수·Generated Bank 출시**에 한하여 아래의 'EXT 승격 별도 승인 대기', '정본 미승격 HOLD', '별도 사람 승인'을 대체한다. 수학적 오류·교육과정 위반·발문 결함·필수 그림 누락을 승인하는 규칙은 아니다. 원본 Archive와 RPM Primary LOCKED ID는 직접 변경하지 않는다.

### 1. L3 고정과 사고 확장의 설계 순서
1. 원본의 실제 **Primary RPM L3**를 잠근다. 최종 발문이 학생에게 요구하는 결정적 수학 판단이 이 L3에 남아야 한다. 단순 provenance label만 같게 쓰지 않는다. 새로운 L3가 실제 주목표가 됐다면 QID9의 해당 슬롯은 재설계한다.
2. 해당 L3 아래 기존 RPM L4·Generated EXT-L4를 먼저 조회한다. 적용 가능한 기존 L4를 재사용하고, 같은 L4 아래 수치 인스턴스·Condition/CrossConcept 변화는 별개 문항 UID로 충분히 보존한다.
3. 목표 경험에 필요한 **L4 / CrossConcept(이미 학습한 개념) / Condition / Integration** 후보를 펼친 뒤, 핵심 판단·출제 방식·기대 난도에 의미가 있는 조합을 선택한다. 필수 개념 각각의 역할과 선후관계(예: 이차함수-직선 교점 → 판별식 → 정수 조건)를 한 줄로 남긴다. 임의 개념 나열은 불허한다.
4. 9개 슬롯 A1→C3를 원본 개념에서 점차 확장한다. A는 핵심 풀이를 익히는 의도적 수치·조건 변형; B는 추가 판단·역산·반례·표현 전환; C는 실제 기출처럼 자연스러운 복합 추론·경계/경우 분기. 원본이 쉬워도 B/C 발전을 제한하지 않는다. 여러 개념 결합은 일반적으로 사고 부담을 늘리지만 실제 난도는 풀이 판단·분기·숨은 조건과 계산 부담을 따로 보고 확정한다.
5. 슬롯별 최소 설계 증거: `lockedL3Id / lockedL3DecisiveStep / chosenExistingOrGeneratedL4 / crossConcepts(역할 포함) / conditions / integrationPath / addedDecisionFromPrevious / finalQuestionObjective / schoolExamStyleEvidence / difficultyBasis`. 새로운 L4가 필요해도 우선 문제 의미를 확정한 뒤 등록한다.

### 2. 신규 Generated L4 즉시 등록·후속 통합
- 기존 L4가 최종 발문의 수학 목표를 설명하지 못할 때 GPT는 **Generated 전용 EXT-L4 ID를 생성 시 즉시 등록**한다. 상태는 `GENERATED_ACTIVE`로 취급하며 별도의 사람 승인·RPM 마스터 승격 대기 때문에 독립검수 통과 문항을 차단하지 않는다. Generated EXT-L4는 RPM LOCKED와 별도 namespace이며 기존 공식 ID인 것처럼 표시하지 않는다.
- 신규 EXT의 부모 L3, 이름·정의, 결정적 풀이 서명, 생성 UID, 기존 비교 L4, CrossConcept, source provenance를 물리 registry/metadata로 저장한다. 같은 의미 L4가 뒤늦게 확인되더라도 **이미 출시된 UID는 보존**하고 추후 alias/merge 표를 만들어 정리한다. 중복 의미 구조는 9개 고유 Blueprint로 과대 집계하지 않는다.
- 실제 제품에 `GENERATED_ACTIVE` 처리/데이터 등록 경로가 아직 없다면, 현행 Generated Consumer가 읽을 수 있는 최소 adapter·index를 먼저 구현한다. 구현하지 않은 등록이나 학생 노출을 가정해 `MAIN_DONE`이라고 보고하지 않는다. 이 절은 GPT의 생성/출시 권한 정책이며 코드 실행 가능성 선언이 아니다.

### 3. 학생용 발문을 첫 번째 품질 게이트로
- **1순위는 한국어 발문**: 교사가 내신에 낼 법한 자연스러운 문장, 의미상 필요한 조건만 사용, 질문 대상·답형 일치, 일관된 수식·단위·보기 형식, 그림과 정보 표현의 완결성을 먼저 검토한다. '한 학생이 주장하였다', 불필요한 캐릭터·이질량 합산·억지 목표값·장황한 정의역 설명은 실제 사고 경험을 평가하는 필수 이유가 없으면 표준 내신식으로 바꾼다.
- **2순위는 수학·교육과정·선지**: 학생용 최종 입력에서 독립 풀이를 동결한 뒤 답·다섯 보기의 유일성·경계·개념 적합성을 검수한다. 오류가 있으면 새 설계부터 수정한다.
- **3순위는 상세 한국어 해설**: 앞의 정확한 발문과 풀이 구조를 간명하게 설명한다. 설명 문장이 길다는 이유만으로 고품질이라고 평가하지 않는다.

### 4. GPT 최초 독립검수 PASS → Archive 2.0 즉시 공급
- GPT가 **최종 학생 발문·보기·필수 자산을 기준으로 한 번 독립검수**를 완료하고 PASS한 UID는 별도 L4 승인·중복 승격 회의·보류 승인 없이 **같은 업무에서 Generated JS + metadata + Consumer shard/index 등록 → Git main 운영병합 → 학생 검색·선택·출제 가능**까지 마감한다.
- 최소 기술 검증은 UID 중복 0, 정답/보기 정합, 실제 asset 존재, 표준 대/중단원 표시·기본 스키마, Generated Consumer 조회/readback, 변경 경로 최소 Chrome smoke다. **기술 검증은 또 다른 품질 승인 절차가 아니다.** 오류가 있으면 해당 장애를 직접 수리하여 완료한다.
- 문제를 학생에게 공급한 후 제기된 오류 신고나 원장 지시에 따라 **해당 UID만 즉시 검색·출제 비활성화**하고 이력을 보존한다. 이를 위한 `enabled / complaintStatus / ownerDecision`와 복구·교체 경로를 설계한다. 교사 판단 전이라도 명백한 수학 오류가 확인되면 잘못된 정답의 출제는 중단한다.
- 9개 제작 의무와 9개 자동 PASS는 다르다. **독립검수에 통과한 모든 문항을 즉시 공급**하며 한 슬롯의 품질 실패나 출시 기술 실패를 이유로 무관한 다른 PASS 슬롯을 집단 보류하지 않는다. Archive 1 원본 및 기존 수학 시험지 인덱스는 변경하지 않는다.

---

2026-10-09 사용자 직접 지시. `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`는 ALIVE MODE/proof/교육과정에 계속 상위. 이 문서는 **교육용 생산량과 세션 작업 단위**의 현재 사용자 override를 구현하며 무검수 출시를 허용하지 않는다.

## 단위·산출
1. 시험지 source 분모 고정 후 **source qid 하나**만 읽는다. 학생 원본(발문·보기·필요 이미지), 원본 풀이·curriculum·real RPM L3/L4를 이해한다. 한 세션에서 여러 source qid를 한꺼번에 생산하지 않는다.
2. A1~A3 반복 숙달(기본·수치·조건), B1~B3 사고 확장(판단 추가·역산·표현 전환), C1~C3 실전 평가(종합·변별·고난도)을 각각 목표로 설계한다. **아홉 칸을 전부 채우는 제작 시도를 의무화**한다. A 숫자변형은 의도적으로 허용하되 새 Blueprint라고 하지 않는다.
3. 슬롯마다 학생 발문, 5지 또는 원본 형식에 맞는 정식 답형, 정답, 한국어 상세 해설, 실제 오답 이유, 레벨/1~5 bucket, RPM 경로, 원본 UID/수식·에셋 요구를 명시한다. C3 최고난도 등급도 실제 풀이 기준으로 검수하여 조정한다. 서로 다른 9개 L4를 억지로 만들지 않는다.
4. 9개를 물리 draft로 만들되 어느 하나가 과도하게 억지스럽거나 수학이 틀리면 `QID_INCOMPLETE`로 반환한다. **9 PASS 강제 불가**. 다음 qid에 자동 이동하지 않고 해당 원본의 나머지 슬롯부터 이어서 완성한다.
5. 별도 GPT 독립 REVIEW: 먼저 학생용 문장/보기/그림만 읽어 9개 개별 계산·답 동결 → 저장된 답·해설과 대조 → 발문 의미·교육적 품질·Meta·필수 에셋 점검. CREATE의 자체 확인은 독립 승인 아님.
6. GPT가 확정한 승인분만 학생 Consumer source에 등록하고 실렌더·DB 인덱스·학생 조회·remote SHA gate를 완료한다. Codex는 지정 파일에 대한 Git main 운영병합·readback만 담당한다. 이전 main 후보에 있던 기존 UID와의 중복/유사도는 별도로 판단한다.

## 세션·정본·인계
- source QID별 branch 파일과 durable 9-slot ledger를 남긴다. `A1~C3 -> UID/path/SHA/created/reviewed/release/HOLD reason` + source file SHA + latest main + next exact step가 최소 인계 필드다.
- 한 source qid의 설계/생산이 끝나면 checkpoint·HANDOFF 문서로 새 채팅을 바로 시작할 수 있게 한다. 80% 토큰 사용률은 도구에서 제공하지 않으면 **측정 불가**, 감지한 척 숫자를 적지 않는다. 장문·복잡도 증가, 대화 단절 위험, qid 완료 시점에 선제 인계한다.
- 인계 문서에 붙여넣을 짧은 실행 프롬프트를 포함한다. 다음 창은 기존 Git branch와 main을 확인하고 **첫 미완료 단계**부터 처리한다. 성공한 단계 중복 재작업 금지.
- 기존 팔마고 27후보는 main candidate 아카이브 보존; 학생 등록은 4이고 23은 supply HOLD로 별도 유지. 이 계획은 기존 HOLD를 자동으로 푸는 면제권이 아니다.

## 모의고사 3×3 선택·순환 계약 (설계; 현재 제품 구현/실출시 아님)
- 생성문항은 `sourceExamPath + sourceQid + generatedUid + purposeGroup(A/B/C) + slot(A1..C3) + difficulty + rpmPrimary + supplyEligibility`를 독립 메타로 보존한다. 같은 슬롯에 향후 여러 instance UID가 있을 수 있다.
- 학교 기출의 실제 문항 수는 불변이다. 한 시험지 회차는 각 원본 sourceQid 자리에 **승인 생성문항 1개**만 뽑는다. 원본 내용/문항 수를 자동 변조하지 않는다.
- 교사는 A 전체/B 전체/C 전체, 혹은 `A1+B1`, `C1+C2+C3` 등 임의 슬롯 합집합을 선택할 수 있다. 회차 3·4·5개 일괄 출력까지 장기 설계. 지정한 슬롯 안의 해당 qid 승인 후보를 먼저 **미사용 UID 우선으로 순환**하고 부족할 때만 재사용한다.
- 슬롯별 승인 UID가 없으면 임의 다른 목적·수학 난도로 대체하지 않는다. 누락된 sourceQid/slot 수를 보여주고 출제 범위를 재선택하거나 추가 제작 검수를 진행한다. HOLD·미검수 UID는 출제 풀에 포함하지 않는다.
- 9슬롯 작업량은 **제작 의무**, 학생 출시는 독립 게이트 통과한 문항만. 고유 semantic Blueprint 9개를 강제하지 않는다.
