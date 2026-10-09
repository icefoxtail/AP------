# GPT 팔마고 QID9 세션 인계 — CURRENT

- 기준일: 2026-10-09 KST
- 정본 Git main 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` (SHA `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`), 23 qid.
- 새 생산 branch: `pilot/gpt-palma25-2mid-q01-9slots-20261009`; branch HEAD는 인계할 때 Git에서 실조회. 사용자의 새 세션은 첫 실행 시 이 branch HEAD와 최신 main을 조회.
- 27개 기존 배치: 후보 문서 이미 main, 26 historical PASS/1 SVG HOLD, 학생 선택 4/공급 HOLD 23 (중복 생성 금지).
- 새 Q01 9슬롯: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q01_CREATE_DRAFT.md`에서 A1~C3 문항·5지·답·한국어 해설 9/9 작성. **아직 독립 review/학생등록 불가**.
- 우선순위: 새 Q01 독립 REVIEW부터, q1 9슬롯 개별 수학 first-blind freeze 후 공개 답 비교. REVIEW 출판 가능 UID, 신규 Blueprint/기존 family·RPM L3/L4·필수 시각·교육적 역할을 판정. Q01 closure 전 q2 자동 착수 금지.
- REVIEW 단계에서 fatal 수학 결함 발견 시 GPT가 해당 슬롯만 재설계/수정하되 9슬롯 완료 상태를 유지; 불가하면 `QID_INCOMPLETE` 이유 저장. Codex는 품질 결정 금지, 지정 Git 운영병합만.
- 80% 컨텍스트 경고: 모델이 실제 사용률을 숫자로 읽을 수 없으므로 정량 퍼센트 주장 금지. 한 qid의 Git checkpoint/handoff 후 새 세션으로 넘기는 것이 기본이다.

## 물리 체크포인트 (2026-10-09)
- 첫 작업 qid: **1**, 신규 9개 CREATED_DRAFT, 개별 UID suffix A1/A2/A3/B1/B2/B3/C1/C2/C3.
- Q01 draft Git blob: `55825f4c838081a3997e72c341c81456866cddc4`. 최신 branch HEAD는 다음 세션에서 readback 후 결속한다.
- 학생용 5지 9/9, 보기 문자열 중복 0, 정답기호 ①2 / ②2 / ③1 / ④2 / ⑤2; 구조/작성자 계산 확인만 수행.
- 독립 GPT first-blind review: **0/9 NOT_STARTED**. Meta 정확 binding, 실제 Chrome, 학생용 신규 9 UID 등록도 모두 미실행.
- Draft tracking PR: [#353](https://github.com/icefoxtail/AP------/pull/353) **DRAFT, DO NOT MERGE UNTIL GPT QUALITY GATES**.
- MAIN 정본 규칙: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`; 9슬롯 디자인·모의고사 선택 및 순환. 사용자 요청의 기존 27개는 main 후보 보존, 4학생 공급/23 공급보류 상태 유지.

## 다음 창에 붙여넣을 메시지

팔마고 GPT QID9 작업을 이어라. 최신 main과 `pilot/gpt-palma25-2mid-q01-9slots-20261009`의 `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q01_CREATE_DRAFT.md`, 이 HANDOFF 파일, `alive/06_EXECUTION/ALIVE_LITE_EXECUTION_RULES.md`를 먼저 읽어라. 새 qid로 가지 말고 q1의 9문항만 독립검수하라. 후보의 답·해설을 보기 전 학생용 발문·5지·필요 그림만 동결해서 9개 전부 먼저 풀고, 이후 비교 및 맞춤 수정·정확한 RPM 매핑·출시 eligibility를 기록하라. Codex는 Git 병합만 담당한다. 완료 결과를 Git에 저장해 새로운 HANDOFF를 갱신하라.
