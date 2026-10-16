## CURRENT HARD — 2026-10-17 제작자 종료·후속 3역할 분리 (원장 최신 직접 정정)
- **필독:** [9문항 개별 제작완료 보고서 v1.1](ALIVE_QID9_PER_ITEM_E2E_COMPLETION_REPORT_CURRENT_v1.md). `n번 진행해` = 해당 원본 qid의 9 UID/45보기/36오답·상세 해설·독립 난이도2축·확정 정본 Meta와 UID별 source/sidecar 저장·필수 SVG·세로 배분·자기검수·9개 문항별 22항목 실제 보고서 완성. 이 기준 9/9면 `QID_AUTHOR_COMPLETE` 및 다음 원본 qid 제작 허용.
- **다음 세 항목은 제작 GPT 담당/선행조건이 아님:** ① 다른 GPT의 독립품질검수 ② main 등록 단계의 운영 Meta/Consumer/index 저장·parity ③ Codex의 실제 운영 브라우저·출력 검사. 이 세 항목은 최종 SHA를 동봉하여 별도 담당에게 인계, `PENDING_NEXT_OWNER/NOT_RUN` 표시; 저자 FAIL/다음 qid 차단 근거로 사용 금지.
- 제작자 범위의 실제 누락·수학 오류·근거 없는 Meta·필수 시각자료 누락 등은 지금 qid 안에서 직접 수정하고 9/9 재확인. 수동 QID9는 세로 정답 누적 우선, 과거 가로 HARD 충돌은 최신 사용자 지시로 대체하되 검사기 미실행을 PASS로 쓰지 않는다. 예약형 Library NEW14는 변경하지 않는다.

## 매회 치환하는 변수(이외 본문 고정)
- `REPO`: icefoxtail/AP------
- `BRANCH`: 작업 브랜치
- `SOURCE_PATH`: 원본 시험지 JS
- `QID`: 원본 qid
- `DONE_BEFORE`: 완료 고유 UID 수
- `DONE_AFTER`: DONE_BEFORE+9
- `NEXT_QID`: QID+1
- `TOTAL_TARGET`: 대상 UID 수

## 순서·차단 게이트
1. **PRELIGHT/보호**: Notion GPT 필독 라우터 → Archive 시작 → lifecycle → GPT 생성 5단계 및 최신 Git AGENTS, 이 정본, Meta·RPM Crosswalk, 생성 확장, 교육과정/해설/Visual/Golden 문서를 실제로 읽는다. 경로·버전/sha·적용 조항 기록. latest main 및 BRANCH, QID 중복 유무, 기존 qid 보호 범위를 고정한다.
2. **SOURCE LOCK HARD**: SOURCE_PATH 원본 id/ordinal, qid_v1 identity map·sourceUid 정확한 매칭, 원본 Git Blob SHA+raw file SHA256, source object/content/choices/answer/solution hashes, 원본 이미지/그래프/표 의존성을 확인한다. 학생 입력만으로 원본을 먼저 풀고 answer·solution과 대조한다. `GPT_QID9_QNN_SOURCE_LOCK.json`에 실제 증거 저장. source mismatch, 답 충돌 미해결, 필수 그림 누락, qid 중복 시 SOURCE_LOCK_BLOCKED; 임의 원본 수정·생성 금지.
3. **RPM·META-FIRST**: 원본 결정적 사고 분석 후 기존 RPM 전체 L3/L4 → 관련/선수 → Generated 확장을 비교한다. 기존 키 우선; PT/TPL binding 누락과 L3 부재 구분. 문항별 Primary L3/L4 → CrossConcept(기존 Canonical ACTIVE/Generated 재사용, 없으면 EXT-CROSS 신규 GENERATED_ACTIVE) → Condition → Integration → 최종 판단의 실제 사용단계 기록. 원본 출처와 생성 목표 단원 구분. level 하/중/상과 difficultyBucket 1..5를 독립 판정.
4. **A1~C3 9문항**: A 핵심숙달, B 조건·역산·추가 판단, C 복합·경계·분기. 개별 고유 UID/학생용 자연스러운 발문/정답 유일 5지/상세 풀이/각 오답4의 실제 오류→선지 수치 1:1, 학년 교육과정. 최종 발문·보기·그림만 다시 읽어 Reverse Stem KEEP/REVISED/HOLD. 결함 시 해당 UID/의존 증거만 STALE 처리하고 수정·재검.
5. **문제/해설 Visual 별도 판정**: UID마다 두 시각자료 필요성과 면제 근거, 실제 SVG 경로·Git SHA. 좌표/그래프/도형은 Python 수치검증 후 생성. source PNG 보호. 실렌더 안 했으면 NOT_RUN.
6. **가로 정답 HARD**: 정확히 객관식 9개라면 ①~⑤ 각 1~2회, 분포 정렬은 [1,2,2,2,2]. 고정/비객관식 예외 시 근거와 분모를 명시. 수학적 정답·발문 변경 금지, 검증된 5지 보기 순서만 조정.
7. **세로 누적 HARD**: 이전 모든 qid의 Draft/Receipt에서 q01~직전 qid의 동일 슬롯 A1, A2, A3, B1, B2, B3, C1, C2, C3 각각의 ①~⑤ 횟수를 산출한다. qid *내부* A/B/C 세로3칸 중복 검사는 누적 세로 분포가 아님. 복수정답 qid/서술형은 별도 분모. 현재 qid 9칸을 가로 제약 하 최적화: 우선 전체 슬롯 max-min 합, 동률이면 worst slot max-min, 동률이면 빈도제곱 합을 최소화. 고정 보기와 직전 qid 반복 제약 명시, feasible 후보 수/선택 objective 증거 저장.
8. **최종 재결속**: 보기45개, 실제 오답 경로36개, answer와 solution 마지막 결론, Draft/Blueprint/Meta Registry/Receipt parity. 정답 배분 검사기를 실제 실행해 결과 JSON을 receipt에 결속: `node alive/06_EXECUTION/tools/qid9-answer-distribution-check.mjs <evidence.json>`. HARD FAIL 또는 미실행이면 AUTHOR_COMPLETE 금지.
9. **1작업 1커밋**: 지정 브랜치에 해당 qid SourceLock/Preflight/Draft/Blueprint/Receipt/VisualNumericEvidence·실SVG 및 누적 MetaRegistry/Progress/Handoff만 커밋→push. 원격 readback: 신규 9 고유 UID, DONE_AFTER/TOTAL_TARGET, source/blob 불변, Meta, 가로·세로 배분, SVG 실파일 SHA, 보호 qid 불변, HEAD 일치. independent/browser/consumer/main 미실행은 NOT_RUN.

## 정답 배분 evidence JSON 검사기 입력 계약
```json
{
  "schemaVersion": "QID9_ANSWER_DISTRIBUTION_EVIDENCE_v1",
  "qid": 19,
  "slots": ["A1","A2","A3","B1","B2","B3","C1","C2","C3"],
  "answers": ["⑤","④","②","②","④","③","⑤","①","①"],
  "before": {"A1":[3,2,7,4,1],"A2":[2,5,6,3,1],"A3":[3,1,6,4,3],"B1":[2,3,4,6,2],"B2":[1,1,6,4,5],"B3":[3,3,5,5,1],"C1":[2,3,3,8,1],"C2":[2,4,6,2,3],"C3":[2,3,7,5,0]},
  "previousAnswers": ["⑤","④","②","②","④","③","⑤","①","①"],
  "optimization": {"feasibleCandidateCount":1,"selectedObjective":[0,0,0],"optimalObjective":[0,0,0],"proofMethod":"EXAMPLE_ONLY_REPLACE_WITH_REAL_SEARCH"}
}
```
위 예시는 **검사기 입력 형태 설명 전용**으로, q19의 실제 답/최적화 증거가 아니다. 실제 입력은 Git 현재 Draft/Receipt로 생성한다. 검사기는 주어진 before+answers의 분포·목적함수·선택된 최적값 일치 및 직전 패턴 차이를 검사하며, 외부 전수 탐색의 실제 실행 여부 자체를 보증하지 않는다. `optimization`의 최적성 증거는 후보 전수탐색 실행 로그/해시로 별도 보존한다.

## 최종 완료 보고
qid별 3×3 정답 번호표, 가로 ①~⑤ 사용 횟수, 9개 세로라인 before/after 빈도표와 목적함수 비교, 신규 9 UID, Primary/CC·난이도, 문제/해설 SVG, SourceLock, Git SHA/readback, 모든 NOT_RUN, 다음 qid를 짧게 보고한다. 기존 qid 내용 무단 변경 금지.
