# 2025 팔마고 고1 2학기 중간 — GPT QID9 원본 3번 인계 CURRENT

## 물리 체크포인트
- branch: `pilot/gpt-palma25-2mid-q03-9slots-20261009`; 최신 branch HEAD는 인계 받은 창에서 원격 조회
- main 생성·검수 정책: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 의 **2026-10-09 '생성 문항 공개답 기반 발문→풀이추적' CURRENT HARD**
- protected source: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, source blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`, qid **3**
- Locked L3: 원의 방정식, RPM H1-RPM-217/218
- q3 A1~C3 9/9 CREATE_DRAFT, 5지 9/9, 답 분포 ①2 ②2 ③2 ④2 ⑤1
- 제작 후 자체 수학·답·보기 점검 9/9, 중복 보기 0
- **다른 GPT의 실제 문항 품질 검수 0/9**, **학생용 Archive 2.0 신규 등록 0/9**. 이 수치를 임의 PASS로 바꾸지 말 것
- 기존 팔마고 27개 후보는 main에 별도 보존, 기출 원문 불변. q1 PR #353 및 q2 PR #354의 처리·출시 상태를 q3가 덮어쓰지 말 것

## 파일
- [9문항 발문·답·해설](https://github.com/icefoxtail/AP------/blob/pilot/gpt-palma25-2mid-q03-9slots-20261009/alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q03_CREATE_DRAFT.md) — blob `87c596ac21b6644cd35e5689f7d2c85bede37fdf`
- `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q03_DESIGN.json` — L3 잠금/L4·CrossConcept 경로, blob `75a9b39f6ad8d09a1471fe2fbc49564cc223e6de`
- `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q03_SELF_RECHECK.md` — 작성자 재검/결정론적 9문항 계산검사, blob `daa81ee27dd1daa6088bce9699d1ba29d9cf3edc`
- `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q03_STUDENT_ONLY.md` — 학생용 발문만 모아본 **선택적 보조 자료**, blob `4f9c130fa055d7143b1c48853014632d56a8e1eb`
- `archive/generated/lite/v1/2022/H1/H22-C2-03-CIRCLE_EQUATION/extension-l4/registry.json` — Generated 전용 L4 2종

## 다음 정확한 작업
1. 새 GPT 검수자가 초안의 **발문·보기·답·상세 해설을 한꺼번에 확인할 수 있는 공개검수**를 수행한다. 기존 독립 blind-first/freeze 의무는 **신규 Generated 검수에서 폐지**됐음. 선택적으로 학생용만 먼저 읽을 수 있지만 필수 재풀이하지 않는다.
2. 발문을 **학교 선생님의 내신 스타일처럼 자연스럽고 명확한지 먼저** 판정·직접 수정. 질문 대상·보기 형식·조건 누락/과잉 체크.
3. 해설 모든 핵심 수학 과정·조건·경계·정답을 추적 검증하고 5지 오개념·정답 단독성을 판정. 의심/고위험 UID만 다른 풀이로 핀포인트 재검.
4. L3 원의 방정식 고정과 L4/CrossConcept의 실제 결정적 역할·난도 재판정. Generated 새 L4 추가 사람승인 대기 불필요.
5. 검수 PASS UID 전부 Archive 2.0 Generated Consumer JS+metadata+index에 즉시 등록·실제 학생 검색/선택·main 병합/원격 readback. 오류 문항만 개별 수정 후 재검. 아직 수행하지 않은 Chrome/DB 등록은 PASS 선언 금지.
6. 완료된 q3와 다음 qid 작업은 물리 checkpoint 및 다음 HANDOFF로 분리.

## 다음 GPT 대화에 붙여넣을 문장
> 2025 팔마고 고1 2학기 중간 GPT QID9 3번 품질 검수와 운영등록을 이어라. 최신 main 및 `pilot/gpt-palma25-2mid-q03-9slots-20261009`를 읽고, `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q03_CREATE_DRAFT.md`의 A1~C3 9개 발문·보기·정답·해설을 **공개 상태로** 검수한다. 발문 품질을 첫 번째로 직접 보정하고, 수학은 해설 계산·경계·최종 정답을 단계별 추적하며 고위험 의심 UID만 재계산한다. L3·L4·CrossConcept의 역할과 5지 오답을 확인한 뒤 PASS한 문항은 추가 메타 승인을 기다리지 말고 Archive 2.0 Generated Consumer·main에 등록해 학생 조회까지 마감한다. 허위 PASS 금지, q3 종료 전 q4 금지. 종료 시 새로운 HANDOFF 저장.
