# JS Archive Codex Fast Lane v1

status: CURRENT / CODEX DEFAULT
updated: 2026-10-12
authority: 사용자 직접 지시 — CREATE → R1 → R2 → R3 → 프로덕션 main 간소화
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## 2026-10-13 사용자 직접 지시 — 문항 HOLD로 종료 금지

문항 결함은 종료 사유가 아니라 담당자가 완성해야 할 수정 작업이다. 아래의 blocker 반환·과거 terminal HOLD 문구보다 이 지시가 우선한다.

```text
결함 발견 → 담당자가 수정프로토콜로 직접 수정
→ 원문 확인이 필요한 해당 qid/그림/공통 자료만 대조
→ 원문 복구가 불가능하면 승인된 ALIVE 문형 대체를 반드시 적용
→ 대체 후보의 결함은 수정하거나 다른 후보 생성
→ 해당 문항의 독립 검수·Meta·필요 에셋·표시 마감
→ 기존 정상 문항 재사용 → main 반영·원격 일치
```

- 문항/해설/필수 에셋 결손에 HOLD를 걸고 작업을 종료하거나 사용자에게 돌려보내지 않는다. 문항 하나 때문에 시험지 전체·11개 roster·골 진행을 멈추지 않는다.
- 원문 복구 불가능 판정은 ALIVE 문형 대체로 전환하는 근거이지 최종 HOLD 근거가 아니다. 대체 후보가 실패하면 그 후보를 수정하거나 다른 후보를 생성한다. 실패한 후보를 반복 검증하거나 강제 PASS하지 않는다.
- ALIVE 대체는 해당 문항만 기존 승인 문형/제작 경로로 수행한다. 동일 교육과정·단원·목표 난이도와 문항 수를 유지하며 실제 풀이·정답/보기·해설·근거 있는 Meta·필요 문제/해설 에셋을 완성한다. 새 엔진·공유 도구 개발·ALIVE 전면 파이프라인 확장은 하지 않는다.
- 원문과 과거 실패/freeze는 보존하고 대체 사실·이유·출처를 기존 provenance에 기록한다. 대체문항을 원문과 동일하다고 표시하지 않는다. 학생 입력이 바뀐 해당 qid만 완전한 새 입력으로 독립 검수하며 정상 unchanged 문항은 재검하지 않는다.
- ROOT는 복구/대체 담당자를 즉시 연결하고 완료를 수납한다. worker가 결함을 보고하는 것은 수정 인계이며 종료가 아니다. 실제 권한·실행 오류는 사실대로 기록하고 기술 실행 문제로 인계한다. 이를 문항 HOLD로 바꾸거나 미완료 검수를 PASS로 표시하지 않는다.

## 1. 적용과 종료

Codex 원본 시험지 제작·마감의 기본 경로다. Execution/Common/role/CODEX_MAINTENANCE의 중복 절차, NONSTOP 도구 복구, 자동 등록 확대보다 이 지시가 우선한다. GPT 예약라인과 ALIVE Generated 출시 계약은 변경하지 않는다. 명시적으로 지정한 다른 종료 조건은 유지한다.

```text
현재 JS·에셋 + 유효한 기존 완료 기록
→ 아직 완료하지 않은 CREATE → R1 → R2 → R3
→ 검증된 프로덕션 JS·필수 에셋만 main 반영
→ 원격 파일 일치 확인 → 종료
```

기본 종료는 **프로덕션 main 반영**이다. 등록·index/Consumer 재생성·학생 사이트 배포는 별도 요청 범위에서 수행하며 main 병합의 선행조건으로 추가하지 않는다. main 반영과 학생 사이트 출시 완료를 구분하여 보고한다. 변경한 Meta의 필수 직접 dependency가 등록 데이터라면 그 결손을 정확히 남기며 등록 완료를 주장하지 않는다.

## 2. 단계별 한 번

| 담당 | 수행 | 종료 뒤 금지 |
| --- | --- | --- |
| CREATE | 현재 추출 JS로 문제·정답·해설·Meta·필요 에셋 완성 | PDF routine 재대조, 다른 도구 개발 |
| R1 | 전 qid 수학·해설·조판·Meta·Visual 독립 심사 한 번 | 같은 시험지 4축 재심사 |
| R2 | 완전한 학생 입력·그림으로 전 qid blind 답안 sweep 한 번 | R1 4축 반복, MATCH 문항 심층 재풀이 |
| R3 | changed/open/direct dependency만 심사; 전체 구조와 공식 엔진 표시 한 번 마감 | 전 문항 수학·Meta 재심사 |
| ROOT | 기존 완료 기록 수납, 지정 파일 병합, 원격 bytes 확인 | 품질 재심사, 등록/배포 자동 확대 |

- generic validator는 **새로 수행한 stage 정상 마감 때 한 번**이다. ROOT는 같은 validator를 다시 실행하지 않는다.
- R3 actual render는 기존 지원 경로로 한 번 수행한다. 유효한 동일 입력·자산·렌더 조건의 receipt는 재사용한다. 렌더 실패를 고쳤을 때만 영향 case를 재확인한다. ROOT가 다시 화면을 검수하지 않는다. 기존 §25의 근거 있는 면제는 실제 미실행 상태를 보존한다.
- 필수 증거만 작성한다. 기존 유효 증거를 새 포맷·seal·원장·보고서로 바꾸기 위한 재검은 금지한다. 기존 완료 기록과 실제 파일을 직접 읽고 인계한다.
- CREATE/R1/R2/R3별 동시 담당 1개인 컨베이어를 유지한다. 완료 stage의 slot을 바로 다음 시험지에 인계한다. ROOT는 routing/publication만, worker는 Luna High를 유지한다.

## 3. 재개와 최소 수정

- **첫 미완료 단계부터 이어간다.** 이미 통과한 CREATE/R1/R2/R3를 처음부터 실행하지 않는다.
- 변경 없는 JS·asset·필수 입력에 결속된 PASS/freeze/receipt는 유지한다. main의 무관한 변경, 작업 폴더 이동, helper 업데이트만으로 품질 검수를 무효화하지 않는다.
- 실제 결함이면 담당 기존 session이 해당 qid·필수 직접 dependency만 고친다. 변경 범위에 필요한 확인 한 번으로 닫는다. 실제 추가 실패가 있어야 다음 확인을 수행한다.
- 해설·Meta만 바뀌고 학생 지문·보기·문제 그림이 정확히 같으면 기존 blind freeze를 유지한다. 원 freeze를 덮거나 새 SHA만 붙여 유효한 척하지 않는다. 실제 학생 입력 교체·답 사전 노출·필수 그림 누락으로 freeze가 무효일 때만 영향 qid를 clean 검수한다.
- 문항별 품질·필수 Meta/Visual·정답 정확성은 유지한다. 알려진 결함을 시간 때문에 PASS로 만들지 않는다.

## 4. 시험지 작업 중 도구 수정 절대 금지

시험지 run의 ROOT/CREATE/R1/R2/R3/MASTER 모두 다음을 금지한다.

- validator/renderer/engine/compiler/등록기/공유 registry/CI/공통 helper 수정
- 새 자동화·호환 스크립트 작성, 임시 wrapper로 gate 우회
- 도구 고장 복구를 위한 MASTER 자동 투입 또는 인프라 작업으로 scope 확대
- helper 포맷 오류 때문에 이전 PASS를 다시 만들거나 전 시험지를 재검수

### 생산 경로에서 제거하는 도구 의존

`archive-create-preflight.mjs`, `archive-codex-stage-kit.mjs`의 bind/seal/verify-complete/intake, `archive-codex-handoff.mjs`의 assignment receipt/accept/dispatcher, bundle adapter/postfreeze/freeze CLI, 등록 candidate worktree/compiler/rebuild는 **기본 생산의 필수 호출에서 제거한다**. 새 completion event·추가 승인 receipt·도구 전용 proof를 만들기 위해 검수 결과를 다시 포장하지 않는다. 기존 CLI 파일은 다른 작업/과거 증거 호환용으로 남으며 이 라인의 시작·전환·병합 gate가 아니다.

정상 경로는 **JS·에셋 직접 열람 → 담당자 검수 기록 → 기존 generic 구조 validator 1회 → 다음 담당자**다. R1/R2에는 정답·해설을 제거한 완전한 학생 입력을 전달하고, 독립 답/이유와 실제 그림 열람을 파일로 먼저 동결한다. 입력 추출과 동결의 정확성은 유지하되 특정 helper·bundle schema·seal에 종속시키지 않는다. ROOT가 정답-bearing 원본을 blind worker에게 보내거나 불완전한 입력으로 진행하는 것은 금지한다.

편의 도구가 막히면 그 도구를 건너뛰고 실제 JS·에셋·기존 증거를 직접 읽어 진행한다. generic의 실제 문항/구조 결함은 해당 locus를 고친다. 도구 전용 schema/호환 결함은 실패 로그를 보존하고 담당자가 같은 품질 항목을 직접 확인한 `MANUAL_STAGE_COMPLETE` 기록으로 인계한다. `genericValidatorStatus:FAIL_TOOL` 또는 `NOT_RUN`을 사실대로 남기며 generic PASS/sealed-event/자동 consumer 수납 완료를 주장하지 않는다. 자동 helper를 사용하지 않은 수동 인계와 표준 Git 병합은 허용한다. 실제 JS parse 실패·정답/필수 Meta/asset 결손·미완료 독립 검수는 수동 완료로 우회하지 않는다.

문항의 품질/입력/에셋 결손은 위 복구→ALIVE 대체→영향 검수로 완료한다. 직접 읽기에서 해결되지 않았다는 이유로 문항 HOLD를 최종 반환하지 않는다. 실제 권한·실행 오류는 정확한 실패 위치와 진행 상태로 ROOT에 인계하며 다른 시험지는 계속 진행한다. 사용자에게 별도 도구 수정을 요청받은 작업에서만 도구를 고친다. 문항/에셋 수정·대체는 공유 도구 수정과 구별한다.

## 5. main 지연 차단

- publication은 지정 프로덕션 JS와 필수 에셋의 allowlist만 사용한다. evidence는 기존 위치에 보존하며 병합 대상 확장의 이유로 쓰지 않는다.
- 원격 main이 앞서가면 최신 main을 parent로 **동일한 승인 bytes만** 다시 적용한다. 무관한 파일 drift 때문에 검수·렌더·등록을 반복하지 않는다. 강제 push와 `git add .`/`git add -A`는 금지한다.
- 같은 대상 파일이 실제로 바뀌었을 때만 overlap을 해결한다. 의미 충돌이면 해당 locus 담당에게만 반환한다.
- remote readback 한 번으로 파일 일치를 확인하고 종료한다. 지속적인 main 추적·통합 rebuild loop는 금지한다.

## 6. 시간과 보고

기존 CREATE 진행분이 있는 JS **2개 약 2시간 마감**을 운영 목표로 삼는다. 완료 시간 보장이나 품질 gate 면제는 아니다. 처음에 남은 stage만 확인하며 진행률을 초기화하지 않는다.

30분마다 ROOT는 현재 단계·실제 진척·blocker 유무만 짧게 알린다. 기술 인계/병합 한 단계에서 10분 동안 진척이 없으면 반복 시도를 중단하고 실패 위치를 반환한다. 2시간 초과 시 완료/미완료 시험지와 정확한 남은 단계를 명시하며, 자동 도구 개발·추가 검수로 목표를 확장하지 않는다.

결과 형식은 `examUid / stage / 결과 / SHA / evidence 경로 / 다음 단계 또는 정확한 blocker`로 최소화한다. 하지 않은 검수·렌더·등록·배포를 완료로 표시하지 않는다.
