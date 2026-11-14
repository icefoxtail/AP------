# 등록기: 문항 단위 요청과 내용 지문 재결속 설계 (2026-11-14)

이 문서는 설계와 인계만 담는다. **코드는 고치지 않았다.** 구현은 중2 2학기 출고 라인이 맡는다. 기준 코드는 PR #1982 브랜치(`meta/received-values-registry`) 커밋 `5282bf4522`이고, 행 번호는 그 파일 기준이다.

## 가. 배경 — 두 라인이 같은 벽에 막혔다

고등 분류 등록 라인과 중2 2학기 출고 라인이 같은 두 제약에 걸렸다.

1. **요청이 시험지 전체 UID를 요구한다.**
   - `archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs`의 `registerReviewedExamV2`(1881행)가 1921~1922행에서 `patches.size !== bank.length`이면 `UID denominator mismatch`로 거절한다. 일부 문항만 넣으면 이 줄에서 거절된다.
   - 2007행은 문항마다 요청 항목이 있어야 한다고 보고(`UID/source ordinal mismatch`), 2008행은 시험지 JS 문항이 자기 `questionUid`를 갖는데 다르면 `source UID mismatch`로 거절한다.
   - 그 결과 검증이 끝난 문항만 골라 등록하고 같은 시험지의 HOLD 문항을 그대로 두는 일이 안 된다. 한 문항이라도 값이 없으면 시험지 전체가 빠진다.
2. **지문 재결속 경로는 있으나 내용 지문 불변을 검사하지 않는다.**
   - 공용 UID의 `sourceFingerprint`(발문·보기·정답·해설·그림 해시)가 과거 판본에 묶여 있으면 현재 원본과 달라 1848행 `source fingerprint drift`로 거절된다. 파일만 바뀌고 발문·보기·그림은 같은 경우가 대부분이다.
   - `validateReviewedSourceFingerprints`(1833행)는 요청 항목의 `after.sourceFingerprint`·`after.contentFingerprint`, `before` 두 값, `identityBefore`를 받아 현재 원본 기준으로 다시 묶는 길을 이미 갖고 있다(1836~1856행). 우리 요청 생성 도구가 이 길로 75개 시험지를 올렸다.
   - **허점**: 이 함수는 `after.contentFingerprint`가 계산값과 같은지만 보고, 과거 `contentFingerprint`와 같은지는 보지 않는다. 그래서 발문이나 그림이 바뀐 문항도 같은 방식으로 재결속될 수 있다. 지금은 요청을 만드는 쪽(우리 `select-p4.cjs`)이 걸러 줘서 문제가 드러나지 않았을 뿐이다.
   - 재결속 도구 `sourceRebind`(FINAL_QA 전용, 새 그림 첨부용, 1864행 `loadSourceRebindPrior`)는 이 용도로 쓸 수 없다.

## 나. 요구

1. **UID 부분집합 허용.**
   - 요청 `items`에 시험지 일부 UID만 넣어도 된다. 넣지 않은 UID의 메타 행은 한 글자도 바꾸지 않는다. HOLD 값, PT/TPL 미확정, 수학 승인 상태(`reviewStatus`, `metadataStatus`, `fieldStatus`)도 그대로다.
   - 계속 거절할 것: 시험지에 없는 UID, 같은 UID나 같은 순번의 중복, 순번이 UID와 맞지 않는 항목, 항목이 하나도 없는 요청.
   - 요청에 부분 요청임을 명시하는 필드(예: `scope: "PARTIAL_UIDS"`와 `expectedQuestionCount`는 시험지 전체 문항 수 유지)를 두어, 전체 요청과 섞이지 않게 한다. 기존 전체 요청은 동작이 같아야 한다.
2. **내용 지문 재결속.**
   - 요청 항목이 `rebind` 근거를 싣는다: 과거 blob(`priorSourceBlobSha1`), 현재 blob(`expectedSourceBlobSha1`, 이미 있음), 문항별 과거 `contentFingerprint`와 현재 계산값.
   - 등록기는 **과거 내용 지문 = 현재 계산한 내용 지문**일 때만 `sourceFingerprint`를 현재 판본으로 다시 묶는다(`validateReviewedSourceFingerprints`에 검사를 추가). 같지 않으면 거절한다. 근거 없이 `after.sourceFingerprint`만 있는 요청은 지금처럼 `before` 일치 검사만 받는다.
   - 과거 blob이 git 이력에 실제로 있는지(그 blob의 같은 순번 문항에서 내용 지문이 계산되는지)도 확인하면 가장 안전하다.
3. **영수증·재실행·투영·소비자 검사의 분모.**
   - 영수증(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.json`)의 `totalQuestions`(2370, 2392행은 `applied.length`)와 `appliedRecords`를 "요청에 들어 있던 UID"로 읽게 한다. 기존 필드 이름·형식은 바꾸지 않고, 부분 요청일 때만 `scope`와 `partialUidCount`를 더한다.
   - 재실행(replay, 1929~1943행): `previous.appliedRecords`의 UID만 현재 행과 비교한다. 지금도 UID별 비교라 큰 변경은 필요 없고, 1943행 `totalQuestions: rows.length`만 부분 분모에 맞춘다.
   - `verifyConsumerValues`(2443행)와 투영 검증(`--verify-projection`)은 `records`(영수증의 적용 행)만 돌므로 분모 의존이 적다. `verify-changed-uid-consumer-approval.mjs`의 `deriveUnit`은 요청 항목만 보므로 그대로 쓸 수 있다. 시험지 전체 분모를 가정한 곳이 있는지 `rows.length`, `bank.length` 사용처를 한 번 훑어 확인한다.

## 다. 변경 위치와 규모 (추정), 테스트, 건드리지 않을 것

| 파일 | 변경 | 줄 수(추정) |
|---|---|---|
| `archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs` | `registerReviewedExamV2` 1921~1922행 분모 검사를 부분 요청 규칙으로 분기, 2000행대 문항 루프에서 요청에 없는 UID는 건너뛰고 행 보존, `validateReviewedSourceFingerprints` 내용 지문 불변 검사와 근거 필드 검사, 영수증 필드 | 80~110 |
| `archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs` | 부분 요청에서 분모를 가정한 곳 확인(필요할 때만) | 0~20 |
| `tests/archive-reviewed-exam-registration-v2.test.mjs` | 아래 테스트 | 80~120 |
| 문서 | `docs/architecture/Reviewed_Exam_Meta_Registration_v2.md`에 부분 요청·재결속 절 | 10~20 |

필요한 테스트 (6~8개):
1. 일부 UID만 넣은 요청이 dry-run과 쓰기를 통과하고, 넣지 않은 UID의 메타 행·HOLD·승인 상태가 바이트 단위로 그대로다.
2. 시험지에 없는 UID, UID 중복, 순번 중복, 빈 `items`는 거절된다.
3. 부분 요청이 `scope` 표시 없이 오면 지금처럼 `UID denominator mismatch`로 거절된다(기존 전체 요청 회귀).
4. 내용 지문이 같고 파일만 바뀐 문항은 근거와 함께 재결속되어 통과하고 `sourceFingerprint`가 현재 판본이 된다.
5. 발문이나 그림이 바뀐 문항(내용 지문 다름)은 근거를 실어도 거절된다.
6. 과거 blob·현재 blob 근거가 틀리거나 빠지면 거절된다.
7. 영수증 재실행(replay)이 부분 요청에서도 변경 없이 PASS이고, 영수증에 `scope`/`partialUidCount`가 남는다.
8. 소비자·투영 검증(`verifyConsumerValues`)이 부분 요청의 적용 행에서만 돈다.

건드리지 않을 것: 봉인 문서(`docs/rules/MANIFEST.md` 등재 문서), 등록 영수증의 기존 필드와 형식(필드 추가만), `alive/` 영수증, LOCKED 정본 표(RPM CANONICAL_MASTER, 크로스워크 기존 행), 4칸 사전 본체, 이미 병합된 영수증 파일.

## 라. 다른 PR과의 관계와 병합 순서

- #1952: REVIEW2 완화(typeHold 등). 초안, main과 충돌 없음.
- #1982: 받아 둔 값 등록부, `fieldCandidates`, typeHold 소비자 검사. #1952 커밋 3개 위에 만들었다. 이 문서의 행 번호는 #1982 기준이다.
- #1995: 고등 분류 등록 요청 13개(자료). #1982에 의존한다.
- 이 설계의 구현 PR은 **#1982 위에** 만들고 #1982 다음에 병합한다. #1995와는 파일이 겹치지 않는다. 병합 순서: #1952 → #1982 → (이 설계의 구현) → #1995 이후 자료 PR. 주의: 고등 분류에서 빠진 시험지 약 233개는 판정한 문항 자신의 연결 개념·통합 유형 등록값이 비어 있어서이므로, 부분 UID 허용만으로는 거의 풀리지 않는다. 이 구현이 푸는 것은 판정하지 않은 문항 때문에 시험지 전체가 막히는 경우와 지문 재결속 경우다.

## 마. 참고 — 우리 쪽이 내용 지문을 거르는 방식

`D:/AI_WORKSPACES/APMS/_luna/classify-final/register/select-p4.cjs`(저장소 밖 작업 폴더):
- 판정할 때 쓴 시험지 사본(`meta-backfill-A/archive/exams`)과 최신 main의 시험지를 읽어 blob이 다르면 문항별 내용 지문을 비교한다.
- 내용 지문 정의는 등록기와 같다: `sha256(JSON.stringify({ content, choices(배열일 때), image }))`(`cfpOf`). 정답·해설은 넣지 않는다.
- 모든 문항이 같으면 `blobOnlyDrift`로 표시해 살리고(고등 판정분에서 75개 시험지), 하나라도 다르면 `source-drift`로 시험지를 뺀다.
- 살린 문항은 `build-p5.mjs`가 `after.sourceFingerprint`/`contentFingerprint`, `before`, `identityBefore`를 채워 기존 재결속 길로 보낸다. 등록기 쪽에는 내용 지문 불변 검사가 없으므로 이 걸러내기가 유일한 방어였다. 이 설계가 구현되면 같은 검사가 등록기 안으로 들어온다.
