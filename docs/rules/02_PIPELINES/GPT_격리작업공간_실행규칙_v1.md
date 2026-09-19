# GPT 격리 작업공간 실행규칙 v1

- 적용일: 2026-09-20
- 상태: ACTIVE
- 대상 저장소: `icefoxtail/AP------`
- 적용 대상: GPT가 수행하는 저장소 기반 분석·생성·수정·전수검수·Meta Foundation·runtime 연결 작업
- 비적용: 단순 읽기/질의, 사용자가 명시적으로 다른 Git 작업 방식을 승인한 경우

---

## 0. 목적

이 규칙은 GPT가 장시간 작업을 위해 습관적으로 브랜치를 먼저 만들거나, GitHub의 production 파일을 중간 단계마다 직접 수정하는 것을 금지하고, 작업을 저장소 밖의 격리 작업공간에서 완결한 뒤 검증된 최종 산출물만 Git에 한 번 반영하도록 고정한다.

기본 완료 흐름:

```text
최신 origin/main 기준점 고정
→ 필요한 파일을 기준 SHA로 격리 작업공간에 확보
→ inventory / 분석 / 생성 / 수정 / 독립검수 / 테스트 완료
→ 최신 origin/main 재확인
→ 관련 변경 충돌 대조
→ 검증된 최종 파일만 적용
→ 이번 작업 파일만 1 commit
→ main fast-forward push
→ 최종 main HEAD 및 반영 파일 재확인
```

중간 산출물·실험 파일·미완료 candidate를 Git history에 누적하지 않는다.

---

## 1. 기본 원칙

GPT 저장소 작업은 별도 지시가 없으면 다음을 기본값으로 한다.

1. 작업 시작 전에 현재 `origin/main` 최신 HEAD를 실제 조회한다.
2. 그 SHA를 `BASE_MAIN_SHA`로 기록한다.
3. 필요한 원본과 규칙을 그 SHA 기준으로 확보한다.
4. 장시간 분석·생성·전수검수·candidate 제작은 저장소 밖 격리 작업공간에서 수행한다.
5. main과 일반 작업 브랜치는 작업 중 production baseline으로 간주하고 직접 누적 수정하지 않는다.
6. 모든 검수와 테스트가 끝나기 전에는 commit/push하지 않는다.
7. 최종 적용 직전에 현재 `origin/main`을 다시 조회한다.
8. `BASE_MAIN_SHA` 이후 이번 작업 관련 파일 변경 여부를 확인한다.
9. 관련 변경이 없으면 최신 main 위에 최종 파일만 적용한다.
10. 관련 변경이 있으면 그 파일만 최신 main과 다시 대조·재검한다.
11. 이번 작업 파일만 명시적으로 반영한다.
12. 사용자가 commit/push를 승인한 작업에서만 1개 final commit으로 main에 반영한다.
13. 반영 후 실제 `main HEAD == pushed commit`과 변경 파일 목록을 다시 확인한다.

---

## 2. 격리 작업공간

권장 위치:

- OS 임시 디렉터리
- container/session 작업 디렉터리
- 저장소 밖 `AI_CENTER/ROUNDS` 계열 작업공간
- 그 밖의 명시적인 repo 외부 staging 경로

금지:

- repository root의 temp/backup/PATCH/APPLY 파일
- production 디렉터리에 candidate를 임시 저장
- 오래 사는 작업 브랜치를 candidate 저장소처럼 사용
- main 파일을 단계별로 직접 덮어쓰기

API-only 환경에서 실제 로컬 파일 복사가 불가능하면 branch/main ref와 분리된 snapshot/candidate 객체를 사용할 수 있다. 이 경우에도 final apply 전까지 branch/main ref를 변경하면 안 된다.

---

## 3. 장시간 작업 상태 보존

문항 전수판독, Meta Foundation, 대규모 metadata, SVG 전수 업그레이드 등 타임아웃 가능성이 높은 작업은 격리 작업공간에 최소 다음 상태를 유지한다.

```text
STATE.json
INVENTORY.json
DECISIONS.json
WORKLOG.md
```

`STATE.json` 최소 필드:

- BASE_MAIN_SHA
- currentStage
- denominator
- completedCount
- remainingCount
- completedUidSet 또는 동등한 식별 집합
- completedSourceFiles
- remainingSourceFiles
- blockingIssues
- lastCompletedItem
- nextStartPoint

진행률은 추정하지 않고 실제 denominator와 완료 식별자 기준으로 계산한다.

타임아웃 후 재개 시:

```text
STATE 확인
→ BASE_MAIN_SHA 확인
→ 완료 집합 확인
→ 미완료 집합 재계산
→ 정확한 다음 지점부터 재개
```

최종 전수검수/reverse validation 단계에서는 완료 여부와 관계없이 전체 denominator를 다시 검사할 수 있다.

---

## 4. Git 반영 규칙

기본 Git 반영은 다음 조건을 모두 만족한 뒤 한 번만 수행한다.

```text
WORK_COMPLETE == true
REVIEW_COMPLETE == true
REQUIRED_TESTS_PASS == true
LATEST_MAIN_RECHECKED == true
RELATED_MAIN_DRIFT_RESOLVED == true
```

반영 시:

- 최종 파일만 적용
- 이번 작업 파일만 명시적으로 stage/tree 구성
- `git add .`, `git add -A` 금지
- unrelated dirty/staged/untracked 파일 금지
- 다른 작업자의 변경 덮어쓰기 금지
- force push 금지
- 사용자가 요청한 경우에만 commit/push
- 가능하면 1 task = 1 final commit

최종 보고 전 반드시 확인:

- final commit SHA
- main HEAD
- origin/main 또는 원격 main HEAD
- 실제 변경 파일 목록
- 필수 테스트 결과
- 필요 시 runtime/catalog/compiled parity

---

## 5. 브랜치/PR 예외

GPT는 작업 시작 시 자동으로 브랜치를 만들지 않는다.

브랜치/PR은 다음 경우에만 허용한다.

1. 사용자가 명시적으로 branch/PR 방식을 요구한 경우
2. 병렬 개발자가 같은 관련 파일을 동시에 수정하고 있어 격리 final apply보다 PR review가 더 안전한 경우
3. 소스코드를 여러 차례 저장소 상태에서 수정·테스트해야 하며 branch 자체가 검증 환경인 경우
4. repository governance가 direct main update를 금지하고 PR을 강제하는 경우

예외를 사용하더라도 불필요한 중간 commit·실험 artifact 누적은 금지한다.
브랜치를 사용했다는 이유만으로 오래된 main 기준 final apply가 허용되지 않는다. merge 직전 최신 main과 관련 파일을 다시 대조한다.

---

## 6. 작은 핀포인트 수정

한두 파일의 짧은 문서/코드 핀포인트 수정도 기본적으로 최신 main 확인 후 수행한다.

다만 별도의 대형 STATE/INVENTORY 파일을 만드는 것이 작업 자체보다 큰 경우에는 생략할 수 있다.

생략 가능한 것은 상태 파일뿐이며 다음은 생략하지 않는다.

- 최신 main 기준 확인
- 요청 범위 한정
- unrelated 변경 금지
- final apply 직전 main 재확인
- 최종 변경 파일 확인

---

## 7. Meta Foundation / Archive2 특별 적용

Meta Foundation 단원 작업의 완료 기준은 사용자가 별도로 축소하지 않는 한 단순 canonical promotion으로 끝내지 않는다.

가능하면 동일 격리 작업에서 다음을 함께 닫는다.

```text
inventory
→ L3/L4 / PT/TPL / CrossConcept / Condition
→ difficulty fresh blind
→ legacy compare / recheck
→ candidate / independent review
→ canonical / compiled dry-run
→ runtime sidecar
→ Archive2 catalog join
→ Archive2 eligibility
→ tests
→ final single Git apply
```

canonical 승격 후 runtime을 별도 후속 작업으로 남기는 2회 반영 구조는 기본값으로 사용하지 않는다.

---

## 8. 충돌 시 우선순위

이 규칙은 **GPT의 작업공간·Git 반영 방식**에 대한 공통 실행 규칙이다.

수학 품질, source 보호, 독립검수, render, seal, Meta Foundation semantic authority 등은 각각의 기존 canonical/Common Protocol 규칙을 그대로 따른다.

충돌 시:

- 품질/수학/봉인 HARD gate는 기존 Common Protocol을 우선한다.
- L1/L2 및 Meta Foundation semantic authority는 각 canonical 규칙을 우선한다.
- 작업공간 선택, branch 기본값, final Git apply 방식은 본 규칙을 우선한다.
- 사용자 최신 명시 지시는 본 규칙의 허용 범위 안에서 가장 높은 작업 지시다.
