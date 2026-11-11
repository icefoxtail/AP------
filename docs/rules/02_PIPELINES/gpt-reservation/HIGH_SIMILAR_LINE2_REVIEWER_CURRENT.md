# 고등 유사문항 검수·수리·출고 라인 예약 프롬프트 정본 (Line 2: REVIEWER & MERGER)

- **파일 위치**: `docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md`
- **역할**: `HIGH_SIMILAR_REVIEWER_MERGER` — 독립 블라인드 풀이(R1), 직접 수리, 영수증 발급, 하네스 게이트, 병합.
- **권한 경계**: 생성 라인의 draft PR만 인수한다. 생성자와 다른 세션에서 실행한다.
- **일정(사용자 지정 2026-11-11)**: 홀수 시각 17분 `17 1,3,5,7,9,11,13,15,17,19,21,23 * * *` (KST, 하루 12회, 생성 1시간 뒤). 모델 Sonnet, effort medium. 생성이 아직 끝나지 않아 인수할 draft PR이 없으면 `NO_INPUT`으로 끝나고 다음 홀수 시각에 이어받는다.
- **이유**: 생성자의 정답과 해설을 보지 않은 채 다시 푸는 것이 유일한 독립 검증이다. 같은 세션이 만들고 검수하면 같은 오류를 복사한다.

---

## 1. 필독 정본

생성 라인 §1의 1~6번과 같고, 추가로 아래를 연다.
- `tools/harness/verify_similar_exam.mjs` — 고등 폴더·고등 분류 체계를 이미 지원하는 출고 게이트.
- `docs/agents/exam-release.md` — 출고와 main 병합 조건.
- 형식 견본으로 쓴 병합 완료 `.review-receipt.json`(고등은 `questionsReview` 구조: `derivedAnswer|blindFrozenAnswer, candidateAnswer, match, method|note`).

---

## 2. 작업 절차

1. **인수**: 제목이 `[HIGH-유사 생성완료]`인 열린 draft PR 중 가장 오래된 것 1개. 시작 메시지가 PR 번호를 지정하면 그 PR을 인수한다. **인수 표시**: PR에 `[검수 인수]` 코멘트가 이미 있는 PR은 다른 검수자가 잡고 있으므로 건너뛰고, 인수하면 바로 `[검수 인수] <세션 id>` 코멘트를 남긴다(같은 PR을 두 검수자가 동시에 수정하지 않기 위해서다). 없으면 `NO_INPUT`으로 끝낸다. PR 브랜치를 체크아웃한다. 이 회차에 시험지는 1개만 처리한다.
2. **R1 독립 블라인드 풀이 (먼저, 동결)**
   - 생성자의 `answer`, `solution`, 메타의 정답 관련 내용을 **열기 전에** 발문(`content`)·보기(`choices`)·그림만 읽고 전 문항을 직접 푼다. 답을 파일에 먼저 동결(`blindFrozenAnswer`)한다. 그다음에 후보 정답과 비교한다.
   - 불일치는 결함으로 확정하고 원인을 가린다(발문 모호, 보기 중복 정답, 정답 오류, 계산 오류).
3. **직접 수리 (Own & Repair)**: 결함을 검수자가 직접 고친다(JS 문항, 해설, 선지, 메타, plan). 고친 문항은 다시 블라인드로 푼다. **수리한 내용은 같은 PR 브랜치에 커밋하고 push한 뒤에 하네스를 돌린다**(push하지 않은 수리는 수리가 아니다). 타인에게 미루지 않는다.
4. **원본 1:1 대조 (STRICT_VARIANT)**: 원본 문항과 유사 문항을 나란히 놓고 형식, 개념, 유형, 풀이 구조, 배점, 그림 구조가 보존됐는지, 수치·상수가 실제로 바뀌었는지, 교육과정 범위 안인지 확인한다. 원본과 숫자만 같은 복사본이거나, 풀이 구조가 바뀐 문항은 수리한다.
5. **분포·형식 점검**: 문항 수와 배점 합 100.0, 정답 번호 max−min ≤ 1·3연속 없음, KaTeX 표기, 오답 4개가 서로 다른 오류 경로인지.
6. **해설 점검**: 작은칠판 구조(조건·목표 → 공식 이유 → 등호 중심 전개 → 경계·판정 → 정답). 그림 값을 해설에 다시 적었는지. 학생에게 노출되면 안 되는 제작 메모가 없는지.
7. **메타 점검**: 문항마다 `primaryMethod`·`decisiveStep`·`difficultyReason`이 서로 다르고 그 문항의 식·수·조건을 담았는지, `rpm`이 현행 표의 한 줄인지, PT/TPL을 확정값처럼 쓰지 않았는지, 난이도가 보수적인지, **빈 칸이 없는지**(PT/TPL·RPM·CrossConcept·Condition·4칸·난이도 전부 채워졌는지). 맞는 키가 없다는 이유로 비운 칸이 있으면 비워 두지 않고 직접 채운다(새 키는 `registryChanges`, 크로스워크 행 추가, 4칸 판정). 근사 키로 때운 문항도 정확한 키로 고친다. 정말 만들 수 없던 칸만 `hold`에 구체 사유가 있어야 한다. 하위 도구·절차는 생성 라인 문서 §3과 같다. `approval.reviewStatus`를 검수 결과에 맞게 갱신한다.
8. **그림·plan 점검**: 문항 수 × 2개의 plan이 유효한 JSON인지, EXEMPT 사유 또는 capability/`sourceQuote`(12~40자 정확 인용)/`caption`/`engineEvidence`가 맞는지, 렌더된 SVG를 실제로 열어 점 라벨·값·음영이 발문과 일치하고 정답을 누설하지 않는지.
9. **영수증 발급**: 최종 JS blob에 `<stem>_유사.review-receipt.json`을 결속한다(고등 `questionsReview` 구조). 생성자가 쓴 영수증은 인정하지 않는다.
10. **게이트**: `node tools/harness/verify_similar_exam.mjs <similarStem>` exit 0. 실패하면 수리 후 재실행하고, 끝내 통과하지 못하면 병합하지 않고 PR에 사유를 남긴다. `--no-verify`·검사 완화 금지.
11. **main 운영병합 (이것이 이 라인의 목적이다. main에 들어가지 않으면 의미가 없다)**: 하네스 게이트 exit 0이면 PR CI를 기다리지 않고(사용자 지시 2026-11-11: CI 대기 생략, 하네스 통과는 유지) **13번 루트 운영병합**을 실행한다: `python3 tools/main_merge_master.py --exam <similarStem> --apply`. 이 도구가 화이트리스트(JS·에셋·plans·영수증)와 등록 요청 `.archive-meta-register/inbox/<examUid>.json`을 만들어 main에 반영한다. 단순 PR 병합만으로는 메타 등록 요청이 빠질 수 있으므로 이 도구를 먼저 쓴다. 도구가 이 환경에서 막히면(예: main 직접 push 거부) 오류 문구를 PR에 남기고, 같은 도구가 만든 inbox 요청 파일을 PR 브랜치에 포함한 뒤 GitHub PR 병합(merge commit)으로 대신하며 그 사실을 보고한다. `--no-verify`·보호 규칙 우회·강제 push 금지. 병합 뒤 **원격 main의 SHA와 `<stem>_유사.js` blob을 재조회해 보고한다**(`MAIN_DONE`은 이 재조회까지 해야 선언한다). 병합 방식 세부는 `docs/agents/exam-release.md`, `docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md`를 따른다.
11-1. **등록 요청 보류(`REQUEST DEFERRED: UID denominator mismatch`)는 실패가 아니라 순서다.** 병합 직후에는 main 등록 writer가 아직 그 시험지의 `question_metadata`·`question_identity_map` 행을 만들기 전이라 도구가 inbox 요청 생성을 보류한다(2026-11-11 실측: 광양제철고 유사 19문항, 행 0개). 임의로 inbox 파일을 만들지 않는다. 이때 병합 자체는 `MAIN_DONE`(파일 main 반영·원격 재조회)로 보고하고 등록 요청은 `INBOX_PENDING`으로 따로 적는다.
11-2. **정산(reconcile)**: 매 회차 시작 시, main에는 있는데 inbox 요청 파일이 아직 없는 이전 회차 병합 시험지(`git log`의 `[HIGH-유사 출고]` 커밋과 `.archive-meta-register/inbox/`를 대조)가 있으면 그 시험지에 `python3 tools/main_merge_master.py --exam <stem> --apply`를 다시 실행한다. main 등록 writer가 행을 만든 뒤라면 요청이 생성돼 main에 반영된다. 아직 보류면 그 사실만 보고하고 다음 회차로 넘긴다. 정산은 새 시험지 인수보다 먼저 하되 한 회차 시간의 일부만 쓴다.
12. 병합하지 못한 경우 PR을 draft로 두고 `REVIEW_BLOCKED` + 첫 막힌 단계를 PR에 남긴다. 다음 회차가 이어받을 수 있게 한다.

---

## 3. 독립 창 등록용 실제 프롬프트 전문

```text
[HIGH_SIMILAR_REVIEWER_MERGER - 고등 유사시험지 2단계 독립검수·수리·출고 라인]
저장소: icefoxtail/AP------ (세션에 없으면 add_repo로 추가).
먼저 AGENTS.md와 docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md 를 실제로 열어 끝까지 읽고 그대로 따른다.
요약: (1) 제목 '[HIGH-유사 생성완료]'인 가장 오래된 draft PR 1개를 인수한다. 없으면 NO_INPUT. (2) 생성자의 answer/solution을 열기 전에 발문·보기·그림만 보고 전 문항을 독립 풀이해 동결한 뒤 비교한다. (3) 결함은 직접 수리하고 다시 블라인드로 푼다. (4) 원본과 1:1 대조(STRICT_VARIANT), 정답 분포, 해설, 메타, plan·SVG를 점검한다. (5) review-receipt.json을 직접 발급하고 'node tools/harness/verify_similar_exam.mjs <stem>'이 exit 0이면 PR CI를 기다리지 않고 `python3 tools/main_merge_master.py --exam <stem> --apply`로 main에 운영병합한다(CI 대기 생략은 사용자 지시, 하네스 통과는 필수). 병합 뒤 원격 main SHA·blob을 재조회해 보고한다. 실패하면 병합하지 않고 PR에 REVIEW_BLOCKED와 사유를 남긴다. 검사 우회·완화 금지.
마지막 보고: 시험지명, 결함 수정 건수, 하네스 결과, 병합 여부와 main SHA, 메타 점검 요약.
```
