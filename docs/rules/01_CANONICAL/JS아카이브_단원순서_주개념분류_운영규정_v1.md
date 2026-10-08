# JS아카이브 — 단원 순서 기반 주개념 분류 규칙 v1

작성: 2026-10-08 / 적용 범위: Archive 신규 문항·ALIVE LITE CREATE/REVIEW.
상태: USER_DIRECTED PROPOSAL FOR CLASSIFICATION; RPM Primary LOCKED 원본은 변경하지 않는다.

## 1. 핵심 원칙

- 하나의 문항에서 앞·뒤 단원의 개념이 함께 쓰이면 실제 학생 풀이의 질문 목표와 필수 결정적 풀이 방법을 먼저 확인한다.
- **필수적이고 문제의 평가 목표를 지배하는 개념이 뒤 단원에 있다면 뒤 단원(L1/L2/L3/L4)을 주분류**로 한다. 앞 단원의 필수 개념은 prerequisite/CrossConcept로 보존한다.
- 단순히 발문에서 먼저 등장한 용어, 원본 seed의 category, 계산에 먼저 쓴 선행개념으로 주분류를 정하지 않는다. 반대로 뒤 단원 단어가 나왔다는 이유만으로 주개념을 뒤로 밀지 않는다.
- source seed의 unit key·순서는 역사적 출처 메타로 보존한다. 새 generated UID의 standardUnitKey/standardUnitOrder/subUnitKey는 새 문항의 최종 주개념에 맞추어 재부여한다.
- target 범위에서 아직 배우지 않은 뒤 단원 개념이 핵심이면 앞 단원으로 잘못 태깅하지 않는다. 학생 공급 시 CURRICULUM_SCOPE_NOT_YET_TAUGHT로 분리한다.
- 2022 공통수학1 마스터: H22-C-04(복소수와 이차방정식, 4) → H22-C-05(5) → H22-C-06(여러 가지 방정식과 부등식, 6).

## 2. 강제 분류 순서

1. 완성된 발문·학생용 자료·교육과정 안의 풀이에서 primaryMethod, decisiveStep, questionGoal을 확정한다.
2. 풀이에 필수적인 각 개념의 current curriculum standardUnitOrder를 실제 표준단원 마스터에서 조회한다.
3. 주된 해결 대상이 뒤 단원이라면 그 unit/L3/L4를 primary로 결정하고, 앞 단원 개념을 별도 prerequisite/crossConcept로 둔다.
4. 주된 단원의 RPM L3가 이미 있으면 반드시 재사용한다. L4를 더 세분화할 필요가 있을 때에만 EXT_L4_CANDIDATE를 제안한다. 기존 L3가 존재하는데 신규 L3라고 주장하지 않는다.
5. 현재 및 이미 이수한 범위 어느 RPM L3에도 맞지 않을 때만 독립 candidate registry에 EXT_L3_CANDIDATE를 만든다. 정본 taxonomy 자동 승격 금지.
6. 원본 sourceUnitKey와 생성 targetUnitKey가 다른 이유를 orderAwarePrimaryClassification에 기록하고 생성 JS/shard/meta/index/manifest/receipt를 함께 정정한다.
7. REVIEW는 새 문항의 독립 풀이에서 주개념을 다시 판정하고, 실제 등록/학생 공급은 별도 gate를 따른다.

## 3. q8 필수 회귀 — 삼차방정식

- 2026 복성고 1학기 기말 original q8은 H22-C-04-COMPLEX_BASIC로 저장돼 있지만, 학생의 주된 계산 목표는 실수계수 삼차방정식의 근·계수 결정이다.
- 신규 문항의 primary unit은 H22-C-06 (6단원), L2 H22-C-06-HIGHER_EQUATION, RPM L3 삼차·사차방정식, RPM L4 인수분해형, record H1-RPM-172.
- 4단원 켤레복소수/켤레허근의 성질은 필수 선수개념이다. 원본 source q8 unit 4는 provenance로 별도 남긴다.
- 앞서 만든 EXT-H1-BSG26-REALCUBIC-CONJROOT-L3는 이미 정확한 기존 RPM parent가 있으므로 SUPERSEDED_PARENT_EXISTS로 집계에서 제외한다. 필요하면 켤레허근 이차인수 구성에 대한 EXT L4만 심사한다.

## 4. q11 필수 회귀 — 절댓값이 포함된 부등식

- 원본 q11과 신규 학생용 문항은 공통수학1 6단원 H22-C-06, 하위 세부단원 H22-C-06-INEQUALITY에 둔다.
- 절댓값을 포함한 부등식은 절댓값 내부 일차식의 영점·구간분할·거리합/차를 이용해 해를 구한다.
- RPM의 절대부등식(산술·기하평균, 코시형)과는 다른 의미다. 문자 이름이 비슷하다고 병합하지 않는다.
- 별도 주제 분류 후보표 archive/data/meta-foundation/candidates/high1/2022-commonmath1-absolute-value-inequality-v1.json에 proposed L3 절댓값을 포함한 부등식과 하위 L4 후보를 기록한다.
- candidate ID EXT-H1-BSG26-ABS-PIECEWISE-L3, independent semantic review가 끝나기 전까지 공식 RPM L3로 가장하지 않는다. ACTIVE PT는 정본 L3 승격의 증명이 아니다.

## 5. 회귀·종료 게이트

- B02 신규 q8 UID 7개가 H22-C-06-HIGHER_EQUATION에 각각 한 번, H22-C-04-COMPLEX_BASIC 신규 shard에는 0개인지 검사한다.
- H22-C-04 기존 효천고 승인 5 UID는 그대로 보존한다.
- q11 신규 UID 9개가 새 분류 후보표와 연결되고 RPM 절대부등식으로 오분류되지 않는지 검사한다.
- 저장된 source exam blob SHA, 모든 generated UID/정답/해설/난도는 그대로 유지한다.
- CREATE 판정은 독립 수학·메타 PASS가 아니다. main/DB/student availability는 독립 REVIEW 후 처리한다.
