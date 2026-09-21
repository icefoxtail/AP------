# CODEX Meta Foundation 단원정리 실행 프로토콜 v1

- 적용일: 2026-09-21
- 상태: `ACTIVE`
- 대상: Codex가 수행하는 JS Archive / Archive 2.0 Meta Foundation 단원 단위 정리 작업
- 기본 실행: 최신 `origin/main` → 전용 작업 branch → GOAL 완주 → checkpoint/evidence 보존 → GPT 독립검수 → 사용자 승인 후 main 반영

## 0. 목적

이 문서는 여러 Meta Foundation Pack을 실제 정리하면서 정착된 작업 순서를 Codex가 반복 실행할 수 있도록 고정한다.

이 문서는 L1/L2/L3/L4, CrossConcept, Condition, IntegrationPattern, difficultyBucket, Pack/Shard/Compiled/Ownership의 의미를 재정의하지 않는다. 의미와 authority는 기존 canonical 문서가 담당하고, 본 문서는 **Codex의 실행 순서·branch 운용·checkpoint·검증·handoff**만 담당한다.

```text
Notion/Git 정본 확인
→ 최신 main
→ 전용 branch
→ source baseline
→ L3/L4
→ CrossConcept
→ Condition
→ IntegrationPattern
→ difficulty blind
→ legacy compare
→ independent recheck
→ exception closure
→ final item freeze
→ candidate
→ compile
→ runtime
→ Archive2/global integrity
→ branch 종료
→ GPT 독립검수
→ 사용자 승인 후 main
```

## 1. Authority

작업 시작 전에 최소 다음을 읽는다.

1. 연결된 Notion의 `GPT 작업 전 필독 라우터`
2. `Archive 2.0 / JS Archive 시작 페이지`
3. 해당 작업의 최신 진행 현황/체크포인트
4. 본 문서
5. `docs/rules/00_RULES_INDEX.md`
6. `docs/rules/MANIFEST.md`
7. `docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
8. `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
9. `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
10. `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`

Notion 연결이 없는 Codex 환경에서는 본 Git 문서와 Git 정본을 authority로 사용하고, 작업 시작점은 branch/checkpoint/evidence에서 복원한다.

```text
L1/L2
→ 표준단원키 마스터 + 세부단원 운영규칙

L3/L4/CrossConcept/Condition/alias/binding/ownership
→ Meta Foundation 운영규칙 + canonical data

difficulty
→ difficultyBucket 운영규칙

compiled/
→ ACTIVE canonical에서 생성되는 read-only 파생본
```

사용자의 현재 명시적 지시는 프로젝트 내부 실행 규칙보다 우선한다.

## 2. GPT와 Codex 작업 방식 분리

### GPT
장시간 작업은 컨텍스트/타임아웃 위험 때문에 단계 또는 하위 배치마다 상태를 보존하고 보고 후 STOP하는 방식을 기본으로 한다.

### Codex
Codex Meta Foundation 작업은 **GOAL 완주형**으로 운영한다.

```text
latest main
→ dedicated working branch
→ protocol stages
→ checkpoint commits + actual evidence/ledger
→ GOAL completion
→ branch handoff
```

checkpoint는 사용자 승인 대기 지점이 아니라 상태 보존·복구·사후 감사용이다.

작업 상태 source:
- 전용 branch
- checkpoint commits
- item-level assignment ledger
- evidence
- candidate
- review receipt
- test / validation 결과

별도 임시 INVENTORY 파일을 작업 중심으로 만들지 않는다.

## 3. GPT → Codex 짧은 GOAL 지시서

Codex 지시서는 세부 프로토콜을 다시 장황하게 복붙하지 않는다. 다음만 짧게 지정한다.

1. Notion 선조회
2. 작업 대상 Pack/단원
3. 최종 GOAL과 DONE 조건
4. 전용 branch 사용
5. GOAL 완료 후 main에 merge하지 말고 branch 상태로 종료

기본 템플릿:

```text
작업 시작 전에 연결된 Notion의
「GPT 작업 전 필독 라우터」,
「Archive 2.0 / JS Archive 시작 페이지」,
해당 작업의 최신 진행 현황,
그리고 Git의 「CODEX Meta Foundation 단원정리 실행 프로토콜 v1」을 먼저 읽어라.

최신 main과 기존 branch/checkpoint를 확인한 뒤
[대상]의 [최종 GOAL]을 프로토콜 DONE 조건까지 끝까지 수행하라.

전용 Codex branch에서 작업하고 기존 branch/checkpoint가 있으면 이어서 사용하라.
각 checkpoint는 ledger/evidence와 commit으로 보존하되 사용자 승인 대기 없이 다음 stage로 계속 진행하라.

GOAL 전체 완료 또는 실제 HARD BLOCKER 발생 시에만 보고하라.
main에는 merge하지 말고 branch 상태로 종료하라.
완료 branch는 이후 GPT 독립검수를 받는다.
```

## 4. START GATE

1. 최신 `origin/main` 실제 조회.
2. 해당 SHA를 `BASE_MAIN_SHA`로 기록.
3. 전용 branch 생성: `codex/meta-foundation/<pack-or-domain>`.
4. 같은 Pack/단원의 기존 branch/PR/candidate/evidence/checkpoint 확인.
5. 기존 상태가 있으면 새로 시작하지 않고 이어서 사용.
6. 실제 source 기준 파일 수·문항 수·UID·source identity·source defect·HOLD 분모 확정.
7. ACTIVE Pack / Concept Shard / Condition Registry / compiled / runtime 확인.
8. production JS migration은 Meta Foundation promotion과 분리. 별도 승인 없이 섞지 않음.

## 5. ENGINE CAPABILITY PREFLIGHT

semantic 작업 전에 확인:
- compiler가 특정 Pilot/Pack에 hard-code되어 있지 않은가
- candidate Pack compile 경로가 있는가
- runtime sidecar 생성 경로가 Pack-generic인가
- Archive2 catalog join 경로가 있는가
- eligibility / duplicate / global audit 경로가 있는가

부족하면 `ENGINE_CAPABILITY_BLOCK`으로 기록한다.

- semantic assignment는 final candidate freeze까지 진행 가능.
- actual compiler/runtime 미실행 시 해당 gate PASS 금지.
- 사용자 지시가 engine 보강까지 포함하면 같은 branch에서 별도 checkpoint로 보강 후 regression.
- 범위 밖 engine 보강 임의 수행 금지.

## 6. 표준 실행 순서

### Stage 1 — Source / Curriculum Baseline
- denominator
- UID/source identity uniqueness
- curriculum
- standardUnitKey / subUnitKey
- source defect / unreadable / missing asset
- 기존 metadata를 fresh 판정 전에 정답처럼 사용 금지

**Gate:** denominator와 source identity 고정.

### Stage 2 — L3 Fresh Assignment
전 문항을 실제 `content + solution` 기준으로 fresh 판정.
- 질문 목표
- decisive strategy
- 기존 ACTIVE L3 재사용
- 타 Pack canonical L3 참조 가능성
- 신규 L3 필요성

미등록 key는 candidate일 뿐 canonical이 아니다.

**Gate:** 전체 denominator에 L3 또는 explicit HOLD.

### Stage 3 — L3 Compression / Reuse
- semantic duplicate 병합
- 과분화 축소
- 단순 조건/난이도 차이 제거
- CrossConcept로 내려야 할 요소 분리
- 기존 canonical 재사용 우선
- 내부 분석어 canonical label 승격 금지

**Gate:** L3 working freeze, 합계 = denominator.

### Stage 4 — L4 Fresh Assignment
L3 내부에서 조건 배치·decisive step 순서·반복 가능한 풀이 골격으로 판정.

새 L4 근거가 아닌 것:
- 숫자/계수 차이
- 보기 형식
- 난이도
- CrossConcept 종류/개수

### Stage 5 — L4 Compression / Reuse
- semantic duplicate 병합
- 사용 0 candidate 제거/보류
- 기존 canonical L4 재사용
- L4→L3 parent integrity
- curriculum applicability

**Gate:** L3/L4 item-level freeze.

### Stage 6 — CrossConcept Fresh Assignment
- mapped 전체 fresh 판정
- 기존 ACTIVE CrossConcept 우선
- 신규 concept 최소화
- Primary taxonomy 중복 금지
- Condition/IntegrationPattern 역할 혼입 금지

**Gate:** mapped 전체 assignment, duplicate/unregistered 0 또는 명시적 HOLD.

### Stage 7 — Condition Fresh Assignment
CONDITION_CORE 기준으로 실제 해 선택·값 제한·부호·범위·정의/비퇴화에 decisive하게 작용하는 조건만 부여.

- 문장에 표현이 있다는 이유만으로 부여 금지
- broad rule 대량 자동 부여 후 바로 PASS 금지
- batch 사용 시 source-semantic reverse check

**Gate:** mapped 전체 DONE, unregistered 0.

### Stage 8 — IntegrationPattern Fresh Assignment
현재 canonical enum을 실제 풀이 결합 구조로 판정.

```text
NONE
SEQUENTIAL
INTERDEPENDENT
REINTERPRETATION
CASE_BRANCH
DEEP_COMPOSITE
```

CrossConcept 개수/Condition 존재만으로 non-NONE 금지.

**Gate:** mapped 전체 assignment, invalid enum 0.

### Stage 9 — Difficulty Fresh Blind
기존 `level`/기존 difficultyBucket 공개 전 fresh blind 동결.

기준:
- 실제 학생 풀이 사고 단계
- 계산 부담
- 조건 해석
- 전략 선택
- 결합 복잡도
- 교육과정 내 체감 난이도

필요 시 confidence/boundary/rationale 기록.
자동 구조 점수만으로 확정 금지.

**Gate:** full mapped denominator blind freeze.

### Stage 10 — Legacy Compare
blind freeze 이후에만 기존 level/legacy difficulty 비교.
현재 contract의 실제 enum 사용.

### Stage 11 — Independent Recheck
최소 trigger 합집합:
- boundary
- low confidence
- strong conflict
- 동일 L3/L4 내부 difficulty span endpoint
- visual/direct-source 고위험
- semantic outlier

review 후 새 endpoint 발생 시 reverse validation으로 추가 재검.

**Gate:** mandatory trigger 미검수 0.

### Stage 12 — Exception / HOLD Closure
분리:
- source defect
- wrong solution
- wrong image
- taxonomy gap
- manual review
- unreadable/missing source

source 대체/문항 생성 등 사용자 승인 필수 조치는 자동 수행 금지.

**Gate:** 모든 exception이 item-level PASS/HOLD/manual_review + 이유.

### Stage 13 — Final Item-level Freeze
최소 필드:
- source identity
- curriculum
- L1/L2
- L3/L4
- CrossConcept
- Condition
- IntegrationPattern
- difficulty
- review status

필수:
- denominator exact
- UID/source identity unique
- duplicate 0
- invalid enum 0
- unmapped 0 또는 explicit HOLD
- freeze hash 또는 동등 fingerprint

### Stage 14 — Forward / Reverse Integrity

Forward:
```text
item → L1 → L2 → active binding → L3 → L4 parent
→ CrossConcept → Condition → IntegrationPattern → difficulty
```

Reverse:
```text
canonical key → owner → parent/binding → usage → alias
→ semantic duplicate → deprecated use → candidate leakage
```

Promotion-blocking 오류 0.

### Stage 15 — Candidate Pack / Evidence
- 자기 Pack scope만 수정
- L3/L4 ownerPack 준수
- shared concept ownerConceptShard 준수
- Condition은 CONDITION_CORE 재사용
- 타 ACTIVE Pack 정의 재작성 금지
- candidate/evidence와 canonical 분리

### Stage 16 — Canonical Dry-run / Global Compile
```text
candidate → schema → key uniqueness → owner uniqueness → L4 parent
→ curriculum binding → concept/condition existence → alias collision
→ leakage → applicability → global compile
```

dry-run과 actual promotion 구분.
`compiled/` 직접 수정 금지.

### Stage 17 — Runtime / Archive2 Integration
- runtime sidecar
- taxonomy/CrossConcept/Condition/binding usage
- difficulty distribution
- Archive2 catalog join
- eligibility
- orphan/unused/unregistered
- duplicate UID/source identity
- global integrity

### Stage 18 — Final Regression / Promotion Candidate
Pack 수정: 해당 Pack + global collision regression.
Concept Shard 수정: affected Pack dependency closure만 targeted regression.
무관 Pack 전체 자동 재판독 금지.
production JS metadata migration은 별도 승인 없이 수행 금지.

## 7. Checkpoint Commit

권장:
1. `checkpoint(meta): freeze taxonomy`
2. `checkpoint(meta): freeze relational metadata`
3. `checkpoint(meta): freeze difficulty`
4. `checkpoint(meta): close exceptions and freeze assignments`
5. `checkpoint(meta): build candidate and dry-run`
6. `checkpoint(meta): validate runtime and archive2`

Checkpoint는 **멈춤 지점이 아니다.**

각 checkpoint에서:
- actual ledger/evidence 저장
- `git status`/변경 파일/denominator/gate 확인
- checkpoint commit
- **처음 받은 original GOAL과 DONE 조건을 다시 확인**
- 현재 완료 checkpoint와 남은 stage를 대조
- 다음 미완료 stage로 자동 진행

checkpoint commit 이후에는 새 작업으로 재해석하거나 범위를 임의로 바꾸지 않는다. **항상 original GOAL을 기준으로 남은 단계만 이어서 수행하고, DONE 조건 충족 또는 실제 HARD BLOCKER까지 계속 진행한다.**

의미 없는 소량 commit, scratch/backup/temp artifact commit 금지.

## 8. 재개 규칙

```text
current branch
→ git log --oneline
→ git diff main...HEAD
→ candidate/evidence/item-level ledger
→ 마지막 완료 gate
→ 정확한 다음 stage
```

새 inventory부터 만들지 않는다.
branch + checkpoint + ledger/evidence가 상태 source다.

## 9. HARD BLOCKER

다음처럼 실제 진행 불가능 또는 사용자 승인 필수일 때만 중간 STOP:
- source 실제 손상/누락
- 권한/도구 부재
- source 대체/신규 문항 생성 승인 필요
- 범위 밖 치명적 engine 수정 필수
- 해결 불가능한 정본 충돌
- continuation이 production 손상 위험 유발

일반 ambiguity/review/candidate는 HARD BLOCKER가 아니다. HOLD/evidence로 기록하고 가능한 GOAL을 계속 진행한다.

## 10. Codex 완료 후 GPT 독립검수

Codex는 GOAL 완료 후 **main에 merge하지 않고 branch 상태로 종료**한다.

GPT 독립검수:
1. Notion 진행상태/protocol
2. branch checkpoint history
3. `main...branch` 전체 diff
4. denominator / item-level ledger / evidence coverage
5. L3/L4/CrossConcept/Condition/IntegrationPattern/difficulty freeze
6. candidate/canonical/compiled/runtime/Archive2 parity
7. ownership / alias / duplicate / global integrity
8. 실제 테스트와 미검수 영역

결함은 전체 재작업이 아니라 핀포인트 수정만 Codex에 재지시.
GPT PASS 후에도 사용자 명시 승인 전 main merge 금지.

## 11. main 반영

사용자가 main 반영을 지시한 경우에만:
1. 최신 `origin/main`
2. `BASE_MAIN_SHA` 이후 관련 drift
3. 관련 파일만 재대조/재검
4. branch final diff + 필수 테스트
5. checkpoint commits → **squash → main 1 final commit**
6. merge 후 main/origin-main/변경 파일/canonical-compiled-runtime-Archive2 parity 확인

## 12. DONE 조건

- [ ] denominator
- [ ] curriculum/L1/L2 closure
- [ ] L3/L4 freeze
- [ ] CrossConcept freeze
- [ ] Condition freeze
- [ ] IntegrationPattern freeze
- [ ] difficulty fresh blind
- [ ] legacy compare
- [ ] mandatory independent recheck
- [ ] exception/HOLD closure
- [ ] final item-level freeze
- [ ] forward/reverse integrity
- [ ] candidate/evidence
- [ ] compiler actual validation 또는 명시적 ENGINE_CAPABILITY_BLOCK
- [ ] compiled parity
- [ ] runtime actual validation
- [ ] Archive2 catalog join
- [ ] eligibility
- [ ] duplicate UID/source identity 0
- [ ] alias/ownership/global integrity PASS
- [ ] 최신 main drift 처리
- [ ] branch 상태로 GPT 독립검수 handoff

## 13. 한 줄 운영 정의

> Codex는 Meta Foundation 단원 작업을 최신 main에서 분기한 전용 branch에서 GOAL 완주형으로 수행한다. checkpoint는 상태 보존·복구·사후 감사용이며 사용자 승인 대기 지점이 아니다. source baseline → L3/L4 → CrossConcept → Condition → IntegrationPattern → difficulty blind → legacy compare → independent recheck → exception closure → final freeze → candidate → compile → runtime → Archive2/global integrity 순으로 닫고, 완료 후 main에 merge하지 않은 branch를 GPT 독립검수에 넘긴다.
