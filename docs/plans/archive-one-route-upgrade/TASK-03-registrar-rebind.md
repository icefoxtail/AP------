# 작업 3 — 등록기 재결속 경로 (계획서 4장, 기능은 꺼 둔 채로)

기준: 같은 폴더 `PLAN.md` 4장. 판정부는 이미 main에 있다: `archive/tools/meta-foundation/source-delta.mjs`(`classify`, `fingerprints`), `source-delta-report.mjs`, `tests/archive-source-delta.test.mjs`.

## 왜

시험지 원본 JS가 그림 교체·해설 재작성 등으로 바뀌면, main 병합 때 자동 등록기가 지문 불일치(`IDENTITY_SOURCE_FINGERPRINT_MISMATCH`)로 그 문항의 메타 등록을 막는다. 실측으로 어긋난 문항의 약 90%는 문제 자체가 같다(중3 1학기 912건: 해설만 596, 그림 203, 발문·보기 80, 정답 22, 교체 10, 표기 1). 문제 번호표(UID)는 파일 경로와 순번으로 정해져 내용과 무관하므로, **번호표로 문항을 찾고 옛 판본과 비교해 문제가 같으면 지문만 갱신하고 메타 값은 그대로 따라가게** 한다. 학생 화면에서는 단원·난이도가 끊기지 않게 되고, 반대로 다른 문항으로 교체된 자리에 옛 메타가 붙어 보이는 결함은 막는다.

## 어디에 쓰나

- 새 브랜치 **`feat/registrar-rebind-20261116`**(최신 `main`에서 만든다)에만 커밋. `main` 병합·PR 생성 금지. 강제 push·이력 재작성 금지. 모델 이름을 커밋·코드에 적지 않는다. LF.
- 보고는 이 계획 브랜치의 `TASK-03-REPORT.md`.
- 열린 초안 PR #2224(`fix/middle-registration-contracts-20261116`)가 같은 등록기 파일을 고친다. 먼저 그 PR의 diff를 읽고, 겹치는 함수·행을 보고서에 적는다. 겹치는 부분은 #2224의 변경을 전제로 하지 말고 현재 `main` 기준으로 구현하되, 충돌이 날 곳을 표시한다.

## 먼저 조사할 것 (보고서 1절)

1. 자동 등록기 `archive/tools/meta-foundation/auto-register-merged-source.mjs`에서 지문 불일치로 거부하는 지점(`planQuestion`, 272행 부근)과 그 결과가 어디에 기록되는지(`auto/state.json`, pending 목록, receipts).
2. 등록기가 이미 가진 재결속 관련 경로: `reviewed-exam-registration-v2.mjs`의 `rebind.priorSourceBlobSha1`, `register-basic-scope-rebind.mjs`, 4칸 쪽 `STALE_STUDENT_PAYLOAD` 판정(`tools/4slot/`)과 continuity 예외. 새 경로가 이것들과 어떻게 다른지, 재사용할 검증이 무엇인지.
3. 정본 행에서 지문을 담는 필드와 그것을 읽는 소비자(카탈로그 빌더, 화면, 4칸 인덱스). 지문을 갱신하면 따라 바뀌는 파생물 목록.

## 만들 것

1. **재결속 계획 함수**(순수): 입력 = 정본 행, 현재 문항, 옛 문항(없을 수 있음). 출력 = `{action, deltaClass, changed, tags, reason}`.

   | 판정 | action | 꼬리표 |
   | --- | --- | --- |
   | `UNCHANGED` | 변화 없음 | 없음 |
   | `FIGURE`, `NOTATION` | `REBIND` — 지문 갱신, 값·승인 상태 전부 유지 | `sourceDrift: {class, at, priorBlob}` |
   | `SOLUTION` | `REBIND` — 단원·유형·난이도 유지 | 위 + `reviewPending: ["method"]` |
   | `STEM_EDIT` | `REBIND` — 값은 계속 쓰되 검토 대기 | 위 + `reviewPending: ["stem"]` |
   | `ANSWER` (옛 정답이 빈 값 → 채워짐) | `REBIND` | 위, `class: "ANSWER_FILLED"` |
   | `ANSWER` (값이 바뀜) | `REBIND` — 검토 대기 | 위 + `reviewPending: ["answer"]` |
   | `REPLACED` | `BLOCK` — 옛 값을 새 문항에 적용하지 않음 | `sourceDrift.class: "REPLACED"`, 재분류 대기 |
   | `NUMBER_MISMATCH`, 옛 판본 없음 | `REFUSE` — 지금처럼 거부 | 사유 기록 |

   - 등급만 보지 않는다. `changed.figure`가 다른 등급과 함께 켜져 있으면 꼬리표에 남기고, `details.otherChangedKeys`가 비어 있지 않으면(예: `sharedMaterial`) `reviewPending`에 `"other"`를 더한다.
   - 승인 상태(`fieldStatus`, `metadataStatus` 등)를 올리지 않는다. 내리지도 않는다(REPLACED 제외: 옛 값의 화면 노출만 막는 표시를 단다. 값 자체는 이력에 보존).
   - 꼬리표 필드 이름은 기존 정본 필드와 충돌하지 않게 정하고, `docs/architecture/JS_Archive_Meta_OS_CURRENT.md`의 필드·상태 어휘와 맞는지 보고서에 적는다.
2. **옛 판본 찾기**: `source-delta-report.mjs`가 쓰는 방식(시험지당 `git log --raw` 1회 + `git cat-file --batch` 1회)을 함수로 빼서 재사용한다. 정본 행의 지문과 일치하는 가장 최근 blob을 옛 판본으로 삼는다. 못 찾으면 `REFUSE`.
3. **등록기 연결(기능 스위치 뒤)**: `auto-register-merged-source.mjs`에서 지문 불일치를 만났을 때, 환경변수 `ARCHIVE_REBIND=1`(또는 CLI `--rebind`)일 때만 위 계획을 적용한다. **스위치가 꺼져 있으면 동작이 지금과 바이트 단위로 같아야 한다**(테스트로 고정).
   - 스위치가 꺼져 있어도 `--rebind-report <저장소 밖 경로>`를 주면 "켰다면 무엇을 했을지"를 문항별 JSON으로 낸다(쓰기 없음).
   - 적용 시 검증: 번호표·순번·문항 수 일치, 옛 blob이 실제 git 이력에 존재, 재결속 전후 메타 값(지문·꼬리표 외) 동일.
   - 영수증: 기존 영수증 형식을 따르되 재결속임을 구분하는 종류를 둔다. 기존 영수증 파일은 고치지 않는다.
4. **source-delta 보강**(PR #2262 검수 지적, 작은 수정): ① 수식 구분 기호 밖의 "숫자 공백 숫자"(`1 2` 대 `12`)는 같은 값으로 보지 않는다 ② `\text{...}` 안의 공백은 유지 ③ `<img ...>` 정규식이 속성값 안의 `>`에서 끊기지 않게 한다 ④ `ANSWER`에 "빈 값 → 채움" 구분 플래그 추가. 기존 테스트의 기대값이 바뀌면 이유를 보고서에 적는다.
5. 테스트: 판정표의 모든 행, 스위치 꺼짐 = 무변화, 옛 판본 없음, 번호 불일치, 같은 입력 재실행 시 중복 없음.

## 규칙

- 봉인 문서, 크로스워크 봉인, 4칸 사전, 기존 영수증은 고치지 않는다. 검사를 약하게 만들지 않는다.
- 화면 코드, 카탈로그 빌더, 4칸 인덱스 생성은 이번에 고치지 않는다(다음 작업). 다만 꼬리표가 그쪽에서 무시되어 오류가 나지 않는지 확인하고 보고서에 적는다.
- 전체 테스트는 돌리지 않아도 된다(NOT_RUN). 새 테스트와 `tests/archive-source-delta.test.mjs`, 등록기 관련 기존 테스트 중 바뀐 파일을 직접 다루는 것은 실행한다.

## 완료 기준

- 새 테스트 통과, 스위치 꺼짐 무변화 테스트 통과.
- `--rebind-report`를 현재 main의 실제 대기 상태에 돌린 결과를 보고서에 붙인다: 지문 불일치 문항 수, action별·등급별 수(학년·학기별), 표본 10문항의 판정과 근거. 소요 시간.

## 보고 형식 (`TASK-03-REPORT.md`)

1절 조사, 커밋 해시, 만든·바꾼 파일, 꼬리표 필드와 어휘 대조, #2224와 겹치는 곳, 실제 보고 결과, 스위치를 켤 때 필요한 후속(화면·4칸·카탈로그), 임의로 정한 것, NOT_RUN.
