# ALIVE LITE v0.6 — 생성 우선 실행 순서 (2026-10-08 사용자 지시)

상태: FILE PILOT RUN ORDER / 기존 설계 v0.5의 구현 우선순위보다 본 작업 순서가 우선.
상위 생산 규칙: ALIVE_GPT_LITE_MASS_EXPANSION_WORKER_CONTRACT_v0.3.md.
관련: ALIVE_GPT_LITE_SCHOOL_MARKER_L3_SHARING_MOCK_EXAM_PLAN_v0.5.md, ALIVE_GPT_LITE_CURRICULUM_HARD_GATE_v0.4.md.

## 반드시 적용할 작업 순서
1. 원본 시험지 qid inventory → source qid 1~3개를 생성 배치로 선정. 고정 1:1 대응을 하지 않는다.
2. 원본별 여러 유효 Blueprint/L4 extension 후보 탐색. 교육과정·시험 범위 guardrail 안에서 수량 자율 결정.
3. GPT 출제자가 신규 발문·보기·정답·학생용 완전한 해설·L1/L2/RPM L3/L4·확장 메타·난이도를 **원패스 완성**한다.
4. L2별 shard·UID/seed marker/원본 qid/blueprint/revision·메타·원장 누적 → Git readback 확인. 후보 수·유효 의미유형 수를 구분.
5. 독립 학생용 입력 기반 수학검수·정답 유일성·교육과정·실제 렌더/중복/Meta 정합 확인. 미실행 증거는 PASS가 아닌 NOT_TESTED.
6. **생산 및 품질 후보 풀을 충분히 구축한 다음** source-slot / L3 sharing index materialization, 학교 간 공유, 난이도·L4 슬롯 대체 적격성 승인, seeded A/B/C mock paper/Archive2 UI DB 연동을 진행.
7. 실제 생성 파일이 Git에 저장되었다는 이유만으로 Archive2 DB/모의고사 출제 가능이라고 주장하지 않는다. sourceKind/generated와 verified supply를 격리한다.

## 작업자 금지 사항
- 실문항 품질·대체 풀도 충분하지 않은 상황에서 원본 마커·모의고사 UI만 먼저 반복 개발하는 행위.
- 원본당 신규 1개를 대량 확장으로 보고하거나, 숫자변형 개수를 새 사고유형 개수로 보고하는 행위.
- 정본 밖 교육과정 개념 도입, 신규 L4를 승인 없이 canonical RPM으로 위장, 기존 original 덮어쓰기.
- 다른 생성 배치가 저장한 UID를 재사용하거나, 통합 인덱스를 append하지 않고 신규 shard만 생성하는 행위.

## 현재 파일럿 핸드오프
- 원본: `26_효천고_1학기_중간_고1_기출c.js` (26문항)
- 후보 이전 단계: q1=4, q3=4, q5=9, q19=4, q23=1 = 22.
- 신규 생산 배치: q6=6, q7=6 = 12.
- **누적 34 generated candidates**, 원본 7 qid 사용, 미생성 19 qid.
- 생성 브랜치: `pilot/alive-lite-hyocheon-generation-q06-q07-20261008`.
- 마커 프로토타입: `pilot/alive-lite-school-marker-20261008` 별도 보존. 생성 브랜치의 34개를 모의고사 정식 공급으로 바로 간주하지 않는다.
- 모든 생성 후보의 독립 수학검수·실제 엔진 렌더·Archive2 product DB join은 별도 미완료.

## 다음 작업
- 이미지 없는 고1 1학기 q8/q9 등 다음 원본을 일정 배치 규모로 선택해 **문항 생산을 계속**한다.
- 배치마다 원본 처리 수, 생성 후보 수, 중복 제외 수, 독립 검수 수, 실제 등록 수를 분리 집계.
- 마커/모의고사 프로토타입 확장은 검증된 후보 풀이 필요한 적격 수량에 도달한 뒤 재개.
