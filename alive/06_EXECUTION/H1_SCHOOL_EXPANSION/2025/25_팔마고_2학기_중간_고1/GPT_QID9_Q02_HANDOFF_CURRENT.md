# 팔마고 2025 GPT QID9 q2 — 다음 창 인계 CURRENT

- Git 작업 branch: `pilot/gpt-palma25-2mid-q02-9slots-20261009`, next 창에서 branch SHA 최신 확인. Source `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76` q2.
- 정책: main `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` / 2026-10-09 Gemini 0~5·학교식 한국어 발문·답 위치 1~2회 분산.
- q2 CREATE 9/9: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q02_CREATE_DRAFT.md`; 수학 설계 `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q02_DESIGN.json`; **먼저 열어야 할** 독립풀이 학생 입력 `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q02_STUDENT_ONLY.md`.
- q2 슬롯: A1~C3 각 1개, 5지/한국어 해설 9/9, 현재 정답 위치 ①2·②2·③1·④2·⑤2. 외부 독립검수 0/9 / 출시 0/9.
- 주 L3: H1-RPM-243/244의 **명제와 조건**. C2/C3의 전체명제·매개변수 결합은 Generated EXT-L4 제안 1종, RAM canonical 임의 변경 금지.
- 기존 q1 9개는 별도 PR #353(독립검수 전), 이번 q2는 격리된 독립 branch. 기존 팔마고 27개 후보는 main, 학생용 기존 4개는 이전 등록. 기존 q1 재검/수정은 이 q2 디자인 범위 밖.
- **다음 단계:** 별도 새 GPT 세션에서 학생입력 9개 먼저 읽고 독립적으로 풀어 freeze. 그 후 설계/초안 읽고 발문·오답·문항 L3·경계·수학·교육과정·Meta 대조. 필요 핀포인트 수리, 통과한 UID는 Archive 2.0에 즉시 등록 및 실제 조회·main 운영병합. q2 검수 닫기 전 q3 제작 금지.

## 저장·검증 체크포인트 (2026-10-09)
- 격리 생성 PR: [#354](https://github.com/icefoxtail/AP------/pull/354) **DRAFT**, 독립 검수 전 병합 금지.
- 학생용 답 숨긴 packet Git blob: `9cd01308a556550d120b29ddf5bdf37c46b8341e`; 9개 발문·45개 보기.
- 최종 제작자 Q02 CREATE blob: `ef60d76af6e4e0d3637a26f249216ac892e0528f`; 수학적으로 시도한 답과 보기 위치는 ①2/②2/③1/④2/⑤2.
- 제작자 후속 재검: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q02_SELF_RECHECK.md`, blob `d70aff2e3b0e09be90c155a6cf457e8093fdf8b3`. **수학 조건/정수 개수/선지 9문항 계산 일치; 외부 GPT 독립 검수는 미실행.**
- 위험 확인: 기존 RPM 243·244 semantic은 있으나, 실제 9개 학생 문항의 PT/TPL 및 Generated Consumer adapter 연동은 아직 최종 검증되지 않았다. 제품 기술 정합성을 해결하는 것은 추가 '품질 승인'이 아니라 독립검수 PASS 후 출시를 위한 최소 구현이다.

## 다음 창에 붙여넣을 프롬프트

2025 팔마고 고1 2학기 중간 q2 QID9 작업을 이어라. 먼저 최신 main과 `pilot/gpt-palma25-2mid-q02-9slots-20261009` HEAD 확인 후 `GPT_QID9_Q02_STUDENT_ONLY.md`의 9문항 발문·보기만 보고 정답과 모든 보기의 판정을 독립 풀이해 물리 동결하라. 그 후 `GPT_QID9_Q02_CREATE_DRAFT.md`, `GPT_QID9_Q02_DESIGN.json`, main QID9 CURRENT를 읽고 한국어 내신식 발문을 최우선으로 수학·Meta·CrossConcept·조건 경계·오답을 한 번 검수하라. 승인 UID는 별도 L4 승인 대기 없이 Archive 2.0 Generated Consumer DB와 main까지 실제 반영·검증하고 핸드오프 문서를 갱신하라. q2 완료 전 다음 원본은 시작하지 마라.
