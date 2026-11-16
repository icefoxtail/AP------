# 작업 4 — 유형 잠금의 코드 쪽 해제와 CI 조건 정리 (계획서 6-2·7-1장)

기준: 같은 폴더 `PLAN.md` 6-2장·7-1장, `docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md` §0(브랜치 `claude/pt-tpl-unlock` / PR #2288 판본. main에 아직 없으면 그 브랜치에서 읽는다).

## 왜

2026-11-16 사용자 결정: 유형(PT/TPL)을 공식 판정기 결과에만 묶지 않는다. 문서는 고쳤고(PR #2288), 코드에 남은 잠금을 푼다. 원칙은 그대로다: 근거 없이 채우지 않는다, 키가 살아 있는지·TPL의 상위 PT가 맞는지는 계속 검사한다. 푸는 것은 "판정기가 낸 값만", "연결 행이 미리 있어야만", "유형이 없으면 CI 통과 불가"라는 제한이다.

## 어디에 쓰나

- 새 브랜치 **`feat/type-unlock-code-20261116`**(최신 `main`에서 만든다)에만 커밋. `main` 병합·PR 생성 금지. 강제 push 금지. 모델 이름을 적지 않는다. LF.
- 보고는 이 계획 브랜치의 `TASK-04-REPORT.md`.
- 항목마다 커밋을 나눈다(아래 A~D). 한 항목이 위험하다고 판단되면 구현하지 말고 조사 결과와 선택지만 보고한다.

## 항목

**A. CI 미리보기가 유형 보류 문항을 막는 문제 (오늘 실측, 가장 급함)**
- 현상: 유형이 없는 문항(typeHold)이 든 단원 등록 PR이 `tools/ci/archive-pr-native-preview.mjs`에서 `PR_NATIVE_PREVIEW:CONSUMER_NOT_PASS`로 실패한다. consumer 자체는 PASS(failures 0)인데 `difficultyAssignmentInformation`(943행 부근)이 `assignmentPending`(reason `assignment_missing`) 행을 난이도 요청 소속일 때만 허용한다.
- 등록기 쪽 설계: `reviewed-exam-registration-v2.mjs` 3019~3022행·3110행 주석에 따르면 `assignment_missing`은 usable-meta 경로로 검증되는 설계된 경우다(`isTypeHoldRecord`, 131행).
- 할 일: 미리보기 조건을 등록기의 설계와 맞춘다 — 등록기가 typeHold로 받아들이는 행(REVIEW2, `metaFoundationHoldReason: TYPE_PATH_UNBOUND_UNIT_SUB_ONLY`, PT 없음)은 미리보기에서도 허용한다. 그 밖의 `assignment_missing`은 지금처럼 막는다. 테스트: typeHold 행이 든 요청 통과, typeHold가 아닌 미배정 행은 여전히 실패.
- 검사를 넓게 푸는 것이 아니라 두 곳의 기준을 일치시키는 것임을 테스트와 주석으로 남긴다.

**B. 교육과정 연결 행이 없으면 거부되는 문제**
- 현상: 등록기 `resolve()`(1717~1718행)는 (교육과정, 과목, 단원, 소단원, PT) 연결 행이 없으면 `ACTIVE curriculum binding missing`으로 거부한다. 직접 판정한 유형이 맞는 키라도 그 단원에 연결 행이 없으면 등록할 수 없다.
- 할 일: 등록기의 검사는 그대로 두고, **요청 생성 쪽**이 연결 행을 추가만 하는 `registryChanges`를 함께 만들게 한다. 요청 생성기 후보: `archive/tools/meta-foundation/`의 요청 빌더(`build-meta-request.mjs` 또는 현재 쓰이는 생성기를 찾아 보고서에 적는다)와 `tools/main_merge_master.py`. 연결 행 추가의 기존 형식·검증(`registryChanges`, 크로스워크 `DIRECT_ACTIVE` 행 추가 규칙은 `docs/agents/metadata.md` "확장 원칙" 절)을 그대로 따른다.
- 조건: 키가 ACTIVE이고 TPL의 상위가 맞을 때만. 연결 행 추가에는 근거(판정 원장의 문항 번호표와 결정 단계)를 붙인다. 기존 행은 수정하지 않는다.

**C. 유형 보류로 등록된 문항에 나중에 유형을 채우는 경로**
- 현상: typeHold로 등록된 행(`metadataStatus: approved_partial_with_explicit_holds`, `fieldStatus.problemType/template: manual_review_pending`)에 이후 PT/TPL을 등록하는 정식 경로가 있는지 확인한다. 등록기 2585~2600행의 "source/approved metadata parity"와 2645~2650행의 typeHold 조건을 읽고, REVIEW2 요청으로 PT/TPL을 처음 등록할 때 hold 표시(`metaFoundationHoldReason`, `l3Disposition`, `l4Disposition`)가 어떻게 되는지 실제 dry-run으로 확인한다.
- 이미 되면: 되는 요청의 최소 예시와 dry-run 출력을 보고서에 적는다(코드 변경 없음).
- 안 되면: hold 표시를 해제하고 PT/TPL·L3·L4를 채우는 경로를 추가한다. 승인 종류는 REVIEW2(독립 판정 2회 일치)로 하고, 판정 근거(두 원장의 해시)를 요청에 담게 한다.

**D. 새 기출 생산 단계의 판정기 일치 강제**
- 현상: `archive/tools/past-exam-pipeline/lib/completion-evidence.mjs`(119행 부근)가 `checkResolverProjectionParity`로 후보 메타의 PT/TPL이 판정기 결과와 같기를 강제한다.
- 할 일: 불일치를 오류로 막지 않고, 후보에 직접 판정 근거(`decisiveStep`과 원문 구절)가 있으면 `PROJECTION_DIRECT`(가칭) 상태로 통과시키고 "크로스워크 행 추가 후보" 목록에 올린다. 근거가 없으면 지금처럼 오류. `stage-meta-bridge.mjs`의 상태 어휘(`PROJECTION_REUSE`, `PROJECTION_PENDING`)와 테스트(`stage-meta-bridge.test.mjs`)를 함께 맞춘다.
- 이 항목은 예약 라인의 생산 게이트라 영향이 크다. 구현 전에 이 게이트를 부르는 곳과 `PROJECTION_REUSE`에 기대는 소비자를 조사해 보고서에 적고, 소비자가 새 상태를 모르면 깨지는 곳이 있으면 구현하지 말고 선택지만 낸다.

## 규칙

- 키의 ACTIVE·상위 검사는 약하게 만들지 않는다. 봉인 문서(`docs/rules/MANIFEST.md` 등재), 크로스워크 봉인 다이제스트, 기존 영수증은 고치지 않는다. 크로스워크는 추가만.
- 테스트를 지우거나 건너뛰게 하지 않는다. 기대값을 바꿀 때는 이유를 주석과 보고서에 적는다.
- 전체 테스트는 돌리지 않아도 된다(NOT_RUN). 바뀐 파일을 직접 다루는 테스트는 실행한다.

## 보고 형식 (`TASK-04-REPORT.md`)

항목 A~D 각각: 조사한 사실(파일:행), 한 일 또는 하지 않은 이유, 커밋 해시, 테스트 결과, 남은 위험. 마지막에 임의로 정한 것과 NOT_RUN.
