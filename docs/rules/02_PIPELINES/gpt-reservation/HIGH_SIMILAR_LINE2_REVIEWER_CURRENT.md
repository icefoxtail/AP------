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

1. **인수**: 제목이 `[HIGH-유사 생성완료]`인 열린 draft PR 중 가장 오래된 것 1개. 없으면 `NO_INPUT`으로 끝낸다. PR 브랜치를 체크아웃한다. 이 회차에 시험지는 1개만 처리한다.
2. **R1 독립 블라인드 풀이 (먼저, 동결)**
   - 생성자의 `answer`, `solution`, 메타의 정답 관련 내용을 **열기 전에** 발문(`content`)·보기(`choices`)·그림만 읽고 전 문항을 직접 푼다. 답을 파일에 먼저 동결(`blindFrozenAnswer`)한다. 그다음에 후보 정답과 비교한다.
   - 불일치는 결함으로 확정하고 원인을 가린다(발문 모호, 보기 중복 정답, 정답 오류, 계산 오류).
3. **직접 수리 (Own & Repair)**: 결함을 검수자가 직접 고친다(JS 문항, 해설, 선지, 메타, plan). 고친 문항은 다시 블라인드로 푼다. 타인에게 미루지 않는다.
4. **원본 1:1 대조 (STRICT_VARIANT)**: 원본 문항과 유사 문항을 나란히 놓고 형식, 개념, 유형, 풀이 구조, 배점, 그림 구조가 보존됐는지, 수치·상수가 실제로 바뀌었는지, 교육과정 범위 안인지 확인한다. 원본과 숫자만 같은 복사본이거나, 풀이 구조가 바뀐 문항은 수리한다.
5. **분포·형식 점검**: 문항 수와 배점 합 100.0, 정답 번호 max−min ≤ 1·3연속 없음, KaTeX 표기, 오답 4개가 서로 다른 오류 경로인지.
6. **해설 점검**: 작은칠판 구조(조건·목표 → 공식 이유 → 등호 중심 전개 → 경계·판정 → 정답). 그림 값을 해설에 다시 적었는지. 학생에게 노출되면 안 되는 제작 메모가 없는지.
7. **메타 점검**: 문항마다 `primaryMethod`·`decisiveStep`·`difficultyReason`이 서로 다르고 그 문항의 식·수·조건을 담았는지, `rpm`이 현행 표의 한 줄인지, PT/TPL을 확정값처럼 쓰지 않았는지, 난이도가 보수적인지, 빈 칸에 `hold` 사유가 있는지. `approval.reviewStatus`를 검수 결과에 맞게 갱신한다.
8. **그림·plan 점검**: 문항 수 × 2개의 plan이 유효한 JSON인지, EXEMPT 사유 또는 capability/`sourceQuote`(12~40자 정확 인용)/`caption`/`engineEvidence`가 맞는지, 렌더된 SVG를 실제로 열어 점 라벨·값·음영이 발문과 일치하고 정답을 누설하지 않는지.
9. **영수증 발급**: 최종 JS blob에 `<stem>_유사.review-receipt.json`을 결속한다(고등 `questionsReview` 구조). 생성자가 쓴 영수증은 인정하지 않는다.
10. **게이트**: `node tools/harness/verify_similar_exam.mjs <similarStem>` exit 0. 실패하면 수리 후 재실행하고, 끝내 통과하지 못하면 병합하지 않고 PR에 사유를 남긴다. `--no-verify`·검사 완화 금지.
11. **병합**: 게이트 exit 0이고 PR CI가 전부 녹색일 때만 PR을 ready로 바꾸어 병합한다. 병합 방식은 `docs/agents/exam-release.md`를 따른다(`python tools/main_merge_master.py --exam <stem> --apply`가 현행 계약이면 그 경로). 병합 뒤 `main`의 SHA와 파일을 재조회해 보고한다.
12. 병합하지 못한 경우 PR을 draft로 두고 `REVIEW_BLOCKED` + 첫 막힌 단계를 PR에 남긴다. 다음 회차가 이어받을 수 있게 한다.

---

## 3. 독립 창 등록용 실제 프롬프트 전문

```text
[HIGH_SIMILAR_REVIEWER_MERGER - 고등 유사시험지 2단계 독립검수·수리·출고 라인]
저장소: icefoxtail/AP------ (세션에 없으면 add_repo로 추가).
먼저 AGENTS.md와 docs/rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md 를 실제로 열어 끝까지 읽고 그대로 따른다.
요약: (1) 제목 '[HIGH-유사 생성완료]'인 가장 오래된 draft PR 1개를 인수한다. 없으면 NO_INPUT. (2) 생성자의 answer/solution을 열기 전에 발문·보기·그림만 보고 전 문항을 독립 풀이해 동결한 뒤 비교한다. (3) 결함은 직접 수리하고 다시 블라인드로 푼다. (4) 원본과 1:1 대조(STRICT_VARIANT), 정답 분포, 해설, 메타, plan·SVG를 점검한다. (5) review-receipt.json을 직접 발급하고 'node tools/harness/verify_similar_exam.mjs <stem>'이 exit 0이며 PR CI가 녹색일 때만 병합한다. 실패하면 병합하지 않고 PR에 REVIEW_BLOCKED와 사유를 남긴다. 검사 우회·완화 금지.
마지막 보고: 시험지명, 결함 수정 건수, 하네스 결과, 병합 여부와 main SHA, 메타 점검 요약.
```
