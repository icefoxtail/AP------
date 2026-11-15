# 중등 등록 마감 — 실제 main 기준 읽기 전용 집계 절차

상태: **실행 준비만 완료. 최종 actual main / phase2 registered SHA는 아직 받지 않았다.** 이 문서는 등록이나 새 심사를 실행하지 않는다. 과거 aa3789, PR CI, 로컬 Consumer PASS를 최종 운영 완료로 바꾸지 않는다.

## 1. 범위와 집계 단위

| 집계 학기 | 실제 원본 경로 |
|---|---|
| 중1 1학기 | `original/middle/m1/1mid/`, `original/middle/m1/1final/` |
| 중1 2학기 | `original/middle/m1/2mid/`, `original/middle/m1/2final/` |
| 중2 1학기 | `original/middle/m2/1mid/`, `original/middle/m2/1final/` |
| 중2 2학기 | `original/middle/m2/2mid/`, `original/middle/m2/2final/` |
| 중3 2학기 | `original/middle/m3/2mid/`, `original/middle/m3/2final/` |
| 제외 | 중3 1학기 `original/middle/m3/1mid/`, `original/middle/m3/1final/` |

파일 경로에서 학기를 정한다. 문항의 semantic course가 낮은 학년이라고 원본 학기를 옮기지 않는다. 정본 키는 `questionUid`이다. 동일 UID의 native, D5, source-preservation, 4slot 요청을 더해서 문항 수로 발표하지 않는다. exam/source 수, 요청 수, UID 수, reason 발생 수를 따로 남긴다.

최종 분모는 해당 Git snapshot의 실제 원본 파일 + `question_identity_map.json.records` + `question_metadata.json.records` + 공식 source/DB/catalog parity로 확정한다. 과거 progress.json이나 검토 75/75는 검토 범위 증거이며 현행 등록 분모가 아니다.

## 2. 먼저 받아야 할 실제 증거

1. 실제 **main writer** run ID / attempt / 입력 commit / 생성된 `REGISTERED_MAIN_SHA`를 받는다. PR 테스트 run과 혼동하지 않는다.
2. 그 run의 `archive-main-registration-<run_id>-<run_attempt>` artifact 전체에서 root `report.json`, `persisted/report.json`, native/공유 검증 보고서를 읽는다.
3. workflow의 persisted 단계는 실제 등록 commit으로 detach한 뒤 `archive-registration-writer.mjs --check`를 수행한다. 따라서 `persisted/report.json.inputSha == REGISTERED_MAIN_SHA`를 확인한다. prepare `report.json.inputSha`는 대개 등록 이전 입력 commit이므로 그것을 등록 SHA로 쓰지 않는다.
4. `publishable`/`registrationReady`, 각 필수 lane의 fresh input/output digest, `blockedLanes` 및 최종 Consumer 결과를 읽는다. 선택 semantic lane의 continuation/deferred debt와 필수 등록 실패를 구분한다.
5. Pages deploy 성공과 release receipt의 `registeredMainSHA`를 따로 결속한다. main 등록, Pages 배포, 실제 브라우저 관찰은 서로 다른 완료 단계이다.

최종 실제 SHA나 해당 persisted 증거가 없으면 `ACTUAL_REGISTERED_SNAPSHOT_NOT_ESTABLISHED`로 남긴다. 자동으로 최신 브랜치 HEAD나 과거 성공 SHA를 대입하지 않는다.

## 3. 읽어야 할 정본과 산출물

| 경로 / 증거 | 확인할 내용 | 이것만으로는 주장할 수 없는 것 |
|---|---|---|
| `archive/data/question_identity_map.json` | source/ordinal/UID, fingerprint identity 연결; 중복·누락 | 최종 메타 승인 |
| `archive/data/question_metadata.json` | 현재 UID별 approval type/status/revision/evidence refs와 요청된 필드 | status 문자열만으로 실제 학생 Consumer 승인 |
| `archive/data/meta-foundation/runtime/*.json` 및 canonical input manifest | 현재 승인 runtime row와 ACTIVE pack/version의 실제 연결 | row 존재만으로 유효한 native leaf/기존 승인 재생 |
| `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/*.json` 및 typed sidecar | 발급 요청/범위, 실제 before/after, 보존 cohort, original authority, durable proof | 발급 당시 `consumerSearchStatus: NOT_RUN`만으로 현재 실패 판단 |
| `.archive-meta-register/auto/receipts/*.json`, `auto/state.json` | 자동 등록 receipt/revision, pending debt, continuation/cursor | 과거 `consumerStatus: PENDING_VERIFICATION`만으로 현재 미등록 판단 |
| `.archive-meta-register/auto/writer-state.json` | lane별 현재 fingerprint와 continuation, blocked lanes | 전체 문항의 수학/메타 검토 완료 |
| `archive/data/item-4slot-index.json` | UID별 REGISTERED, pending, file 상태 | PT/TPL/CC/난도 전체 승인 |
| `.archive-meta-register/auto/4slot/last-verification.json` 및 `auto/4slot/receipts/<indexSha256>.json` | 현재 index raw SHA/inputDigest/counts, replayChanged=false, consumerVerified | pending이 있어도 status PASS_WITH_SUPPLEMENTS를 전체 완료로 해석 |
| `archive/data/archive2-canonical-input-manifest.json`, `archive/data/generated-lite-consumer/v1/index.json` | 학생 검색이 실제 읽는 current input/digest | raw catalog 필드만으로 canonical assignment 승인 |
| 실제 main run `native/archive-meta-register-pass/requests/*.json`와 applied/rejected/pending/projection-pending 목록 | 실제 시도/소비/거부된 exact request 및 UID scope | 역사 rejected 파일이 남았다는 이유로 현재도 미해결 판정 |
| 실제 main run `consumer-preflight-*.json`, 최종 Consumer 및 projection 보고서 | fresh request별 changed UID, passed/failed/skipped/unobserved/assignmentPending | D5-only PASS를 advanced 메타 승인으로 확대 |

현재 request가 소비된 뒤에는 artifact의 exact saved request 또는 그 요청이 있던 immutable Git blob을 읽는다. 빈 before/after 보존 요청을 임의의 새 승인 요청으로 재구성하지 않는다.

## 4. 읽기 전용 실행 순서

기존 실제 run의 fresh 결과로 충분하면 다시 돌리지 않는다. 아래 명령은 최종 실제 SHA가 전달된 후, 별도 clean inspection checkout에서 **필요한 불일치가 있을 때만** 사용한다. sparse 입력 누락은 INPUT_MISSING이며 제품 실패나 PASS로 바꾸지 않는다. 산출 보고서는 repo 밖 또는 `.tmp`에만 쓴다.

### A. 실제 snapshot 고정 확인

```bash
TASK_REPO=/absolute/path/to/inspection-checkout
TASK_REGISTERED_SHA=<actual_registered_main_sha>
TASK_OUT=/absolute/path/to/closeout-evidence
cd "$TASK_REPO"
test "$(git rev-parse HEAD)" = "$TASK_REGISTERED_SHA"
git diff --exit-code HEAD -- archive .archive-meta-register tools/ci
```

검사 checkout에 임시 생성 데이터가 남아 있으면 운영 snapshot과 구분한다. 최신 remote main이 등록 이후 이동했다면 `REGISTERED_MAIN_SHA` 기준 결과와 새 main drift를 별도 적고, 두 snapshot의 counts를 섞지 않는다.

### B. 현재 writer fingerprint 확인 — artifact가 없거나 불일치할 때만

```bash
node tools/ci/archive-registration-writer.mjs --check --work-dir "$TASK_OUT/persisted-check"
```

`--check`는 등록 생산자를 실행하지 않는다. 평가 report만 지정 work-dir에 쓴다. `mode=check`, `inputSha`, `registrationReady`, `publishable`, lane별 needed/digest를 확인한다. phase1/phase2의 bound inbox가 모두 소비된 다음 HEAD에서는 run scope가 inactive로 돌아가므로 semantic parameter drift가 정상적으로 나타날 수 있다. 이를 즉시 native 승인 실패로 해석하지 않는다.

### C. source/DB/identity/metadata/catalog parity — fresh 기존 보고서가 우선

기존 공식 함수 `archive/tools/verify-archive-registration.mjs`의 `verifyRegistration({root,sources})`를 사용한다. 한 번에 다섯 학기 실제 source 목록을 전달하면 전체 데이터를 학기마다 반복 파싱할 필요가 없다. 이 함수는 읽기 전용이며 approved native의 진위를 전수 심사하는 도구는 아니다.

```bash
node --input-type=module - "$TASK_REPO" <<'JS'
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root = process.argv[2];
const {verifyRegistration} = await import(pathToFileURL(root + '/archive/tools/verify-archive-registration.mjs').href);
const paths = execFileSync('git', ['ls-tree','-r','--name-only','-z','HEAD','--','archive/exams/original/middle/'], {cwd:root}).toString('utf8').split('\0').filter(Boolean);
const sources = paths.map(p => p.replace(/^archive\/exams\//,''))
  .filter(p => /^original\/middle\/(?:m[12]\/[12](?:mid|final)|m3\/2(?:mid|final))\/[^/]+\.js$/.test(p));
if (!sources.length) throw Error('NO_INCLUDED_SOURCE_FILES');
console.log(JSON.stringify(verifyRegistration({root,sources}), null, 2));
JS
```

반환값 `pendingSemantic`은 그 함수가 보는 일부 reviewStatus/metadataStatus 조건일 뿐, 모든 미등록·HOLD의 총수가 아니다.

### D. 학생 Consumer — 구체적인 잔여 요청만 필요 시

```bash
node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs \
  --root "$TASK_REPO" \
  --request /absolute/path/to/exact-saved-request.json
```

다수 요청은 `--request`를 반복한다. typed scoped receipt는 원래 계약에 맞는 `--scoped`를 사용한다. 이 도구는 source hash와 canonical input manifest를 검증하고 `Archive2Canonical` → `ProblemBankMeta.buildIndex` 학생 검색 경로를 실제로 읽는다. 임의 UID 목록이나 승인 내용을 새로 만들어 넣지 않는다. `skipped`, `unobserved`, `assignmentPending`, canonical/usable lane을 모두 기록한다. 특히 difficulty-only 성공에 남은 assignmentPending은 advanced 승인 완료가 아니다.

### E. 4slot — current index와 receipt를 먼저 해시 대조

현재 index raw SHA256이 last-verification/index receipt의 `indexSha256`과 같고 inputDigest/counts/replay evidence가 맞는지 읽는다. actual writer의 fourSlot lane fingerprint도 fresh여야 한다. 재현이 필요한 구체적 불일치가 있을 때만:

```bash
node tools/4slot/build-4slot-runtime.cjs --root "$TASK_REPO" --check --report "$TASK_OUT/four-slot-check.json"
```

`--write`는 사용하지 않는다. `--check`는 전체 builder를 읽기 계산하므로 준비 단계나 이미 fresh한 최종 증거가 있는 경우에는 실행하지 않는다.

### F. 과거 backlog는 보조 진단만

```bash
node tools/ci/archive-meta-backlog-overview.mjs --root "$TASK_REPO" --summary
```

이 출력은 `DIAGNOSTIC_ONLY`, `registrationEvidenceStatus: NOT_EVALUATED`이다. 오래된 pending-supplement/receipt를 보므로 현재 미등록의 확정 집계가 아니다. 여기서 empty after를 evidence-missing으로 분류해도 현대 typed source-preservation의 `{}` before/after에는 적용하지 않는다.

**실행 금지:** register/write, compile/build_db 재생성, AutoMeta `--verify`의 repo proof write, prepare main writer, request 재발급, metadata/source 수정. 이번 inventory는 기존 증거 조회와 필요 시 위 읽기 검사에 한정한다.

## 5. 학기별 census 규칙

한 번 로드한 identity/metadata의 `records`를 `sourceArchiveFile`로 학기 분류한다. UID와 source+sourceOrdinal join은 각각 중복 검사를 한다. 누락·중복은 따로 `IDENTITY_OR_SCOPE_UNRESOLVED`로 보고하고 임의로 한 행을 선택하지 않는다.

각 학기에 다음 값을 별도로 기록한다.

- 실제 source 수, unique identity UID 수, metadata UID 수, parity 상태.
- 현재 승인/receipt 범주별 unique UID 수: basic/partial, FINAL_QA/native, META_PIPELINE_AUDIT, D5-only, 기존 승인 보존. 이것은 서로 겹칠 수 있으므로 합계로 총 승인 UID를 만들지 않는다.
- 실제 현재 runtime에 연결된 UID와 final Consumer가 검증한 UID. receipt/status 존재와 실제 Consumer 검증을 구분한다.
- 4slot REGISTERED unique UID, pending reason 발생 수, mapped pending unique UID, unmapped/file-level errors.
- current inbox unique UID와 current run의 rejected/pending/projection failures. historical state.pending도 별도 column으로 남기되 fresh 실패로 간주하지 않는다.
- 아래의 기술적 병목/추가 근거 HOLD/UNKNOWN은 **해당 요청 작업 기준 UID 집합**으로 작성한다. 한 UID에 다른 종류 작업이 겹치면 각 작업 축의 상태를 유지한다.

4slot pending의 `ordinal`은 표시 번호일 수 있다. `sourceOrdinal`로 곧장 해석하지 않고 identity `sourceQuestionNo` 또는 index `sourceDisplayNumber`를 exact source와 결합한다. 여러 UID에 걸리거나 매핑되지 않으면 UNKNOWN/unmapped로 남긴다. file-level error를 그 파일 모든 문항의 실패로 자동 확장하지 않는다.

## 6. 병목 분류 기준

| 분류 | 필요한 현재 증거 | 다음 작업 |
|---|---|---|
| 승인 완료 + 실제 등록/Consumer 확인 | exact immutable 승인, current receipt/runtime chain, actual persisted SHA, 해당 fresh final Consumer | 배포/화면 단계만 남았는지 따로 확인 |
| 기술적 등록 병목 | 이미 승인된 exact target이 있고 current 공식 거부가 source binding/receipt transport/provider 순서/dependency/canonical 소비 문제임이 확인됨 | 승인값을 보존하는 좁은 transport/등록 경로 수리 후 공식 재등록/Consumer |
| 추가 원승인·근거 필요 HOLD | 명시된 unresolved disposition, 원교육과정 provenance 미확정, 독립 Primary 보존 권한, 교차학년 관계/target 승인 등 | item별 누락 증거/승인을 정확히 확보; 현재 값을 추측하여 채우지 않음 |
| UNKNOWN | current evidence가 낡거나 없거나 reason만으로 authority 상태를 정할 수 없음 | 필요한 exact receipt/immutable evidence/정본 연결만 조사 |
| 제외 | M3S1 원본 범위 | 이번 작업 승인·변경 없음. debt를 삭제하지 않고 유지 |

`STALE_STUDENT_PAYLOAD` / `STALE_ASSET_BYTES`는 단독으로 기계적 문제를 뜻하지 않는다. current source-owner 승인/실제 renderer continuity 증거가 있으면 운반 수리가 될 수 있고, 실제 의미 변경이면 별도 근거가 필요하다. `activeDefinitionMatch` 후보나 crosswalk에 하나만 있는 TPL은 독립 승인으로 승격하지 않는다.

4slot의 유효한 `EXPLICIT_REVIEW_HOLD:<reason>`는 해당 hold proof가 실제 검증된 경우에만 HOLD 근거이다. `INVALID_REGISTRATION_HOLD`, `FOUR_SLOT_ITEM_MISSING`, identity 오류는 그 이름만으로 새 수학검수 필요/불필요를 결정하지 않는다.

## 7. 알려진 M2 9건과 M3 E020 Q16 — 기존 경계만 연결

상세 UID/source/immutable commit/path/raw SHA 및 다음 작업은 `middle-closeout-existing-hold-evidence-map.json`에 있다. 이는 final current count가 아니며 실제 main에서 새 authority가 생겼는지 마지막에 확인한다.

| 항목 | 이미 있는 승인 / 확인된 사실 | 남은 구체적 작업 |
|---|---|---|
| E015 Q7/Q8, E021 Q8 | EXISTING_PRIMARY_RETENTION_ONLY 독립 승인은 존재. 허용 필드는 PT/TPL/CC/condition이며 curriculum 제외 | 원교육과정 provenance를 UID에 명시 결속. 기존 Primary 승인을 유지하여 current request 재구성 |
| E015 Q10, E048 Q14, E054 Q10 | e083의 exact 정의/적용 승인 존재. RPM·정의 curriculum context는 source 원교육과정 승인과 별개 | 해당 UID의 원교육과정 근거 확인/명시 수납 후 승인된 정의/적용을 운반. 검증을 통과하려 curriculum을 채우지 않음 |
| E021 Q22 | CC7의 exact CC 추가 승인. CC7 자체가 source curriculum을 추정하지 않고 별도 provenance를 요구 | 원교육과정 근거를 확인하고 official request에 필요한 기존 Primary 권한도 별도 확인. 그 후자의 현행 완전성은 이 보고서에서 UNKNOWN |
| E052 Q6, E058 Q9 | native originalCurriculum=2015 직접값 존재. CC7 추가 승인 존재. frozen follow6이 retained-primary 경계를 남김 | exact UID/PT/TPL의 독립 existing-primary 보존 판단 및 binding 근거를 확보. **교육과정 부재로 분류하지 않음** |
| M3 E020 Q16 | native는 M1-2 tuple. 기존 공식 policy predicate에서 course_namespace_invalid / assignment_target_mismatch. full registration Consumer는 실행 안 함 | 명시 교차학년 관계 PREREQUISITE_LOWER_GRADE + 정확 semantic/target RPM 및 M3 target tuple 승인, 또는 권한 있는 최종 tuple 정정. allowlist 확대/target 추측 금지 |

위 문서의 공란은 전 세계 어디에도 근거가 없다는 증명이 아니다. 여기서 확인한 기존 승인 범위 밖의 값은 UNKNOWN으로 남긴다. E020의 usableMetaLane 표시만으로 changed-UID 필수 gate가 닫히지 않는다.

## 8. 중3 1학기 제외를 실제 결과와 결속

prepare writer의 active `semanticRunScope`와 `excludedScopeBefore`, 최종 `excludedScopeGuard`를 읽는다. 이 scope는 immutable HEAD의 exact bound inbox 집합에 적용되며 pending debt를 유지한다. semantic report의 scope digest, deferred count, excluded attempted/applied 0 및 writer 보호 rows/pending 검사를 확인한다.

입력 main → 실제 registered commit 사이 M3S1의 source/request 변경 0뿐 아니라 metadata/runtime/identity/4slot의 보호 row 집합 동일성을 확인한 실제 guard가 필요하다. global container count/version만 바뀐 것은 row 변경과 구분한다. 같은 UID가 범위 밖으로 이동하거나 삭제된 경우도 포함한다.

inbox가 실제 소비된 후 다음 HEAD에서 scope가 inactive인 것은 정상 lifecycle이다. 이를 영구 M3S1 freeze로 보고하거나 기존 debt 완료로 지우지 않는다. phase2는 새 exact inbox manifest로 별도 활성화한다.

## 9. 최종 보고서 형식

최종 헤더: actual registered SHA / input SHA / main writer run+attempt / persisted proof raw SHA / Consumer proof raw SHA / Pages deploy+registered SHA / 검사 시각.

학기별 표: `source 수 | 고유 UID 분모 | current native/advanced 등록 확인 | D5-only 확인 | 기존 승인 보존 | 4slot REGISTERED | 기술적 잔여 UID | 근거 HOLD UID | UNKNOWN UID`.

별도 목록: `UID, source, 작업 종류, current receipt/revision, current official reason, 승인 근거 ref, 필요한 다음 작업, 판정 근거 snapshot`.

수치 주의: 보존 UID를 새 승인으로 세지 않는다. 반복 요청/한 UID의 여러 reason/부모 공급자와 소비자를 더하지 않는다. raw metadata status, 과거 rejected/pending 수, 4slot 결과를 하나의 ‘전체 완료율’로 합치지 않는다. 최종 closeout이 실제 요구한 등록 병목을 해결했다는 설명과, 별도 추가 원승인 작업은 명확히 연결한다.

## 10. 준비 단계에서 확인한 코드 진입점

검토 snapshot: `ae9cf910ed51aa17723a930bcf6f6a32a8f3046a`. 최종 실행 전 actual main의 해당 코드/정본이 바뀌었다면 변경점을 좁게 확인한다.

- `tools/ci/archive-registration-writer.mjs`: `checkRegistration`, `assess`, `prepareRegistration`, final `excludedScopeGuard`; state `.archive-meta-register/auto/writer-state.json`.
- `tools/ci/reviewed-meta-register-pass.sh`: exact request 보관, applied/rejected/pending/projection-pending, Consumer preflight.
- `tools/ci/verify-registered-consumer-approval.sh`: 공식 final Consumer 호출.
- `archive/tools/verify-archive-registration.mjs`: `verifyRegistration` parity.
- `archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs`: `loadConsumer`, `verifyChangedUidConsumerApproval`.
- `tools/4slot/build-4slot-runtime.cjs` 및 `tools/ci/archive-four-slot-pass.sh`: readonly check 및 digest-bound registration receipts.
- `archive/tools/meta-foundation/semantic-run-scope.mjs`: immutable scope와 excluded row/pending guard.
- `tools/ci/archive-meta-backlog-overview.mjs`: 역사 backlog 전용 진단.

이 준비 과정에서는 큰 inventory, 등록기, Consumer, builder를 새로 실행하지 않았고 생산 파일·승인·receipt를 변경하지 않았다.
