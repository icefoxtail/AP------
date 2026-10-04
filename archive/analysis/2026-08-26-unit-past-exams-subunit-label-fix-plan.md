# 단원별기출 소단원 영문 노출 수정 계획서

- 작성일: 2026-08-26
- 대상: `archive/unit-past-exams.html` 및 고1·고2 단원별기출 데이터
- 상태: 구현·정합성 보정·브라우저 QA·독립 검수 완료
- 범위: 소단원 표시명 품질 수정, 메타데이터 정합성 보정, 단원별기출 UI 회귀 검증

## 1. 사용자 요청과 첨부 자료의 구분

사용자 요청은 다음과 같다.

> 아카이브의 단원별기출에서 소단원이 영어로 출력되는 원인을 확인하고, 수정 계획을 세운다.

첨부 이미지는 현재 화면 상태를 보여주는 증거 자료다. 이미지 안의 `derivative`, `continuity`, 난이도 버튼, 출제 방식 등의 문구는 추가 작업 지시가 아니라 재현 기준으로 취급한다.

초기 요청 단계에서는 계획서만 작성했으며, 이후 사용자 승인에 따라 아래 계획을 실행했다. 첨부 이미지의 문구는 재현 기준으로만 사용하고, 이미지 자체의 지시문으로 확장하지 않았다.

## 2. 확인된 현상

고2 `미적분Ⅰ → 미분계수`에서 다음 화면이 재현된다.

| 표시명 | 문항 수 | 현재 key |
|---|---:|---|
| `derivative` | 40 | `H15-M2-03-DERIVATIVE` |
| `미분계수` | 18 | `H15-M2-03-DERIVATIVE_DEFINITION` |
| `continuity` | 1 | `H15-M2-03-CONTINUITY` |

해당 단원 전체는 59문항이며, 문제지 분할 수와 난이도 분포는 이번 이슈와 무관하므로 보존해야 한다.

위 표는 첨부 이미지에서 확인한 수정 전 historical baseline이다. 현행 source rebaseline과 생성물 재생성 후 검증된 현재 분포는 `미분 39 / 미분계수 19 / 함수의 연속 1`이며, 총 59문항과 key 기반 필터 정합성은 보존됐다.

현재 단원별기출 범위 전체를 스캔한 결과, 영문 문구가 포함된 소단원은 고1 236문항, 고2 422문항이었다. canonical label 적용 후 운영 화면의 영문 노출은 0건이다. 중1·중2·중3 단원별기출에서는 같은 유형의 영문 소단원이 확인되지 않았다.

## 3. 원인과 영향 경로

### 3.1 표시 경로

1. [unit-past-exams.js](../unit-past-exams.js)의 `joinApprovedMetadata()`가 승인 sidecar의 `subUnit`을 레코드에 그대로 병합한다.
2. [unit-past-exams-core.js](../unit-past-exams-core.js)의 `getSubUnitOptions()`가 레코드의 `subUnit`을 표시 label로 그대로 사용한다.
3. UI는 그 label을 `<option>`과 고급 조합 행에 escape만 한 뒤 출력한다.

따라서 현재 UI에는 `subUnitKey`와 표시명 사이의 canonical label 검증 단계가 없다.

### 3.2 데이터 경로

- 원본 `archive/exams/**/*.js`의 일부 문항이 `subUnit: "derivative"`와 같은 값을 보유한다.
- [JS아카이브 표준단원키 마스터테이블](../../docs/rules/JS아카이브_표준단원키_마스터테이블.md)의 확장 소단원 표에도 `derivative`, `continuity`, `integral` 등 영문 label이 남아 있다.
- `build-approved-question-metadata-v1.mjs`는 원본 문항 JS의 비어 있지 않은 소단원 값을 authoritative source로 취급한다. sidecar만 직접 고치면 다음 생성 때 원래 값으로 돌아가거나 source/classification conflict가 발생할 수 있다.

### 3.3 별도 검토가 필요한 분류 이슈

`H15-M2-03-CONTINUITY` 1문항은 영어 표시 문제와 별개로, `미분계수` 부모 단원 아래에 `연속` key가 들어간 분류 정합성 문제일 수 있다. 영문을 한국어로 바꾸는 작업에서 key를 임의로 변경하지 않고, 해당 문항의 원문·해설·분류 근거를 별도 검토한다.

## 4. 수정 원칙

1. 화면 표시는 `subUnitKey` exact match를 기준으로 한다. label 문자열을 기준으로 필터링하거나 합치지 않는다.
2. 표시명은 canonical master label을 우선한다. 원본의 legacy 영문 label을 UI에 직접 노출하지 않는다.
3. `subUnitKey`, 문항 수, 난이도, 문제지 분할, question UID는 표시명 수정만으로 바꾸지 않는다.
4. 영문 label을 기계적으로 번역하지 않는다. key별 한국어 표준명과 부모 단원 관계를 먼저 검토한다.
5. `question_metadata.json`만 수동 수정하지 않는다. master source, 원본 JS, classification 결과, sidecar, question index 사이의 생성 순서를 지킨다.
6. 현재 작업 트리의 기존 변경 파일은 보존한다. generator 실행으로 `db.js`, 원본 시험지 JS, `question-index.js`를 무관하게 덮어쓰지 않는다.

## 5. 단계별 실행 계획

### Phase 0 — 변경 경계 고정

- 현재 `git status --short`와 대상 파일 hash를 기록한다.
- 이번 이슈에 직접 관련된 파일과 기존 작업 파일을 분리한 manifest를 만든다.
- 계획서 승인 전에는 생성기, 일괄 치환, DB/index rebuild를 실행하지 않는다.

산출물:

- 대상 파일 manifest
- 영문 소단원 inventory
- 현재 고1·고2 catalog count baseline

### Phase 1 — canonical 소단원 label 표 확정

- `subUnitKey → canonical Korean label` 표를 만든다.
- 우선 화면 재현 단원인 `H15-M2-03-*`를 검토한다.
- 고1·고2 전체 영문 key를 parent unit별로 묶어 검토한다.
- label이 영문이라는 사실과 key가 잘못 분류됐다는 사실을 분리한다.
- 근거가 부족한 key는 임의로 통합하지 않고 `검토 필요` 상태로 남긴다.

산출물:

- canonical label mapping 파일 또는 master source 변경안
- key별 근거·검토 상태·영향 문항 수
- `H15-M2-03-CONTINUITY` 1문항의 별도 분류 판정

### Phase 2 — 표시 계층의 안전장치 구현

- 단원별기출 core에 canonical label resolver를 둔다.
- resolver는 `subUnitKey`와 parent scope가 모두 일치할 때만 master label을 반환한다.
- master에 없는 key 또는 검토 보류 key는 영어 원문을 노출하지 않고 `소단원 검토 필요` 또는 기존 `미분류 소단원` 정책으로 처리한다.
- `getSubUnitOptions()`, 상세 소단원 select, 고급 조합 row, 선택 결과 요약이 동일 resolver를 사용하도록 한다.
- 필터·선택·출력 payload에는 기존 key를 계속 사용한다.

목표:

- 데이터가 완전히 재생성되기 전에도 단원별기출 화면에서 영어가 노출되지 않도록 한다.
- 표시명 처리 경로가 한 곳으로 모여 이후 데이터 누락에도 재발하지 않도록 한다.

### Phase 3 — 원본 및 생성 데이터 정합성 보정

canonical label 표가 확정된 뒤 다음 순서로 진행한다.

1. master source 문서 갱신
2. `build-tag-master-v1.mjs`로 master JSON 재생성
3. 원본 문항 JS와 classification 결과의 label을 key 기준으로 backfill
4. `build-approved-question-metadata-v1.mjs`로 `question_metadata.json`과 runtime 재생성
5. `build-question-index.mjs`로 `question-index.js` 재생성
6. 생성 전후 문항 수, UID, key, 난이도, source fingerprint를 비교

실행 메모:

- 마스터 문서와 `js_archive_tag_master.json`의 소단원 label은 전부 canonical 한국어 표기로 갱신했다.
- 현재 작업 트리에 이미 존재하던 원본 시험지 JS 수정 때문에 metadata builder의 기존 fingerprint/classification gate가 `235/225`건에서 중단되었다. 이 안전장치는 약화하지 않고 `migrate-question-identity-map-v1.mjs`로 identity map을 현행 source fingerprint 기준으로 재기준화했다.
- 이후 `build-complete-subunit-classification-v1.mjs`를 재생성해 stale classification output을 현행 production source에 맞췄고, 승인 metadata builder 결과는 source fingerprint `0`, source-classification conflict `0`으로 통과했다.
- identity runtime도 새 identity digest로 재생성했다. 현재 operational baseline은 438개 파일·10,690문항이며, 작업 트리에 추가된 post-checkpoint similar 8개 파일·178문항은 production archive에 자동 편입하지 않고 reconciliation exclusion으로 명시했다.
- 원본 JS의 문항 내용·보기·정답·해설·이미지는 수정하지 않았다. 기존 source 변경으로 현재 고2 미분계수 분포는 59문항 중 `미분 39 / 미분계수 19 / 함수의 연속 1`로 집계되며, 총 문항 수와 key 기반 필터 정합성을 우선 보존한다.

이 단계에서 문항 내용·보기·정답·해설·이미지는 수정하지 않는다. 분류 key를 바꾸는 문항은 label backfill과 분리된 검토 목록으로 남긴다.

### Phase 4 — 테스트 및 브라우저 QA

자동 검증:

- `node --check` 대상 JS 통과
- 단원별기출 core/UI/runtime focused tests 통과
- 고1·고2 모든 활성 unit의 소단원 label에 영문 alphabet 0건
- `subUnitKey` parent scope mismatch 0건
- 고2 미분계수 총 59문항 및 현행 source 기준 소단원별 count 보존
- 기존 question UID, difficulty bucket, selection result, generated paper count 보존
- metadata source join 및 question-index count 정합성 통과

브라우저 검증:

- `unit-past-exams.html?grade=h2`에서 미분계수 화면 확인
- 소단원 select와 고급 조합 select의 표시명이 모두 한국어인지 확인
- `derivative`, `continuity` 문자열의 DOM 노출 여부를 직접 검사
- 미분계수의 빠른 출제·고급 조합·문제지 생성까지 수행
- 320px/768px에서 overflow 없음 확인
- console warning/error, fallback, URL 복원, print/assign handoff 회귀 확인

아카이브 회귀 검증:

- 생성 데이터가 실제 원본 시험지 JS의 문항 수와 일치하는지 확인
- 기존 `exam`, `sol`, `ans` 렌더링을 대표 시험지로 확인
- 이미지가 선언된 시험지는 `naturalWidth`와 solution image 로딩을 확인

## 6. 완료 기준

다음 조건을 모두 만족해야 완료로 판정한다.

- 단원별기출 고1·고2 활성 단원에서 영문 소단원 표시 0건
- 고2 미분계수 화면에서 총 59문항과 소단원별 count가 baseline과 일치
- 소단원 필터는 label이 아니라 기존 `subUnitKey` exact match로 동작
- parent scope mismatch와 중복 UID가 0건
- canonical label mapping과 원본·sidecar·index의 값이 일치
- 분류 보류 문항은 영어로 숨기지 않고 검토 상태가 기록됨
- 기존 출제·출력·학생 출제·해설·정답 흐름에 회귀 없음
- 현재 작업 트리의 무관한 수정 사항이 덮어쓰이지 않음

## 7. 롤백 기준

- canonical label mapping이 parent unit과 충돌하면 Phase 1에서 중단한다.
- metadata builder의 source conflict가 발생하면 sidecar를 억지로 맞추지 않고 원본/classification 근거부터 조정한다.
- 문항 수, UID, key, 난이도, 출력 문항이 baseline과 달라지면 생성 산출물을 승격하지 않는다.
- 브라우저에서 영문 노출 또는 필터 결과 불일치가 남으면 완료로 보고하지 않는다.
- rollback은 무관한 전체 worktree를 되돌리는 방식이 아니라 이번 변경 파일과 생성 산출물만 별도 보관 후 복구하는 방식으로 진행한다.

## 8. 실행 결과 및 독립 검수

- `node archive/tools/intelligence/audit-question-identity-map.mjs`: 10,690 records, UID collision 0, errors 0.
- `node --test tests/archive-question-metadata-consistency.test.mjs`: 2/2 PASS.
- `node --test tests/archive-unit-past-exams-core.test.js tests/archive-unit-past-exams-ui.test.js`: 14/14 PASS.
- complete classification, baseline reconciliation, identity contract/runtime tests: 모두 PASS. baseline은 post-checkpoint similar 8개 파일·178문항을 제외한 상태로 유지된다.
- 독립 검수에서 발견된 DB/index P1에 대해 존재하지 않는 stale similar DB 참조 16개만 제거하고 `build-question-index.mjs`를 재생성했다. 최종 DB/index audit은 missing 0, qCount mismatch 0, index count mismatch 0이다. types/similar 자료의 기존 school·연도 필드 공백은 원본 기출 범위 밖의 기존 메타데이터 경고로 별도 기록했다.
- 브라우저 QA: 고2 미분계수 옵션 `미분`, `미분계수`, `함수의 연속`만 노출, 영문 0건, console error/warn 0건; 320px·768px overflow 없음; 80문항 제한·문제지 출력·학생 출제 handoff PASS.
- 최종 독립 검수 에이전트는 `apmath-archive-exams` 검수 스킬 기준으로 변경 diff, 생성물, builder gate, DB/index 정합성, 회귀 테스트, 브라우저 QA를 재확인했고 최종 PASS를 반환했다. P0/P1은 없으며, `types/similar`의 기존 school·연도 필드 공백 28/60건은 원본 기출 범위 밖 P2 리스크로 남겼다.
