# ALIVE FAST_EXAM Skill 재설계 계획 v0.13

## 0. 문서 상태

- 상태: `MVP_IMPLEMENTED_NONVISUAL_RULE_MAPPED`
- 목적: 전체 시험지 자동 생성의 기본 비용과 시간을 줄이면서 독립 검산과 실제 렌더 검수를 유지한다.
- 기존 `R03`–`R17` 엔진은 삭제하지 않고 `STRICT_AUDIT`로 보존한다.
- 현재 구현은 `NONVISUAL_WHOLE_EXAM` MVP이며, ESSENTIAL/OPTIONAL 시각 의존 문항은 `F01`에서 fail-closed 처리한다. 기존 R03–R17은 STRICT_AUDIT로 보존한다. 전체 생성 기본 프로필은 구조형 유사문제이며, 수치·표면 확인형은 명시적으로 선택한다. staged 경로는 시작 시 `docs/rules` 21개 활성 문서와 compiled master를 해시 잠금하고, 검수 통과 similar 샘플에서 답·해설을 제거한 참고팩을 생성한다.

## 1. 변경 이유

기존 전체 시험지 흐름은 문항마다 분석 2회, 계획 3회, 후보 2–3개, 독립 수학검산 2회, 다중 품질검수, 문항별 렌더·패키지를 반복한다. 후보 2개 기준 약 21회, 후보 3개 기준 약 28회의 모델 호출이 필요하므로 22문항은 약 462–616회가 된다. 최대 동시 작업 4개에서는 자동 생성 도구로 사용하기 어려운 실행 시간이 발생한다.

## 2. 새 모드

```text
FAST_EXAM     전체 시험지 기본 생성
STRICT_AUDIT  명시적으로 요청한 정밀 검수
REVIEW_ONLY   기존 결과 읽기·검토
```

일반적인 “이 시험지 전체 유사문제 만들어줘”는 `FAST_EXAM`으로 해석한다. 현재 MVP capability 밖인 시각 의존 시험지는 `FAST_VISUAL_NOT_SUPPORTED`로 차단하며 기존 정밀 엔진으로 자동 대체하지 않는다.

## 3. 변형 프로필과 문항당 두 번의 모델 작업

FAST_EXAM은 다음 두 프로필을 분리한다.

```text
CONFIRMATION       숫자·표면 확인형. 숫자 재배열 허용.
STRUCTURAL_VARIANT 구조형 유사문제. 숫자만 바꾼 후보 금지. 기본값.
```

두 프로필 모두 원문 응답형·교육과정·의도 난도·오답 검증은 동일하게 유지한다. 모든 객관식 문항은 `transformationPlan.distractorProvenance`에 오답별 `choiceIndex`, 통제된 `errorFamily`, 구체적 `errorRoute`를 생성 단계에서 제출한다. 같은 문항 안에서 오류 family를 재사용할 수 없고, route는 실제 잘못된 연산·해석과 그 결과 또는 중간값을 밝혀야 한다. 구조형은 `structuralDelta`를 추가로 제출한다. 이 근거가 추상적이거나 숫자만 임의로 바꾼 흔적이면 블라인드 검수 전에 재생성한다.

### G1 통합 생성

한 명의 Luna xhigh Builder가 원문 학생용 payload를 바탕으로 핵심 개념과 출제 구조 분석, 선택된 변형 프로필에 맞는 단일 변형 계획, 학생용 문항과 선택지, 오답별 오류 경로, Answer Contract와 정답, 완전한 해설, 난도·교육과정·복제 방지 자기점검, 필요한 결정론적 Visual Spec을 한 번에 만든다.

### V1 블라인드 독립 검증

별도 Luna xhigh Verifier는 생성된 학생용 문항과 원문 학생용 payload만 받는다. Builder의 정답·해설·계획·메모는 받지 않는다. 독립 풀이 답과 수학, 교육과정, Fidelity, 난도, 선택된 변형 프로필에 따른 복제 여부, 모호성, 오답 선택지, 시각 의미 판정을 반환한다.

CLI가 V1의 독립 답과 숨겨진 Builder Answer Contract를 비교한다. 불일치는 오케스트레이터가 임의로 통과시킬 수 없다.

## 4. 호출량과 예외 처리

- 기본: `문항 수 × 2`; 22문항이면 44회
- 예외 검증: 답 불일치, 모호성, 선택지 오류, 강한 복제 의심, 시각 의미 충돌에만 1회 추가
- 자동 재생성: 문항당 최대 1회
- 재검증 후에도 실패하면 전체 Run을 실패로 보존하고 정확한 Gate를 보고
- Terra/Sol 자동 승격 금지

ESSENTIAL 시각, 서술형, 최고난도, 교육과정 경계, 재생성 문항은 `manualAuditRecommended`로 표시한다. 빠른 Gate가 통과하면 이 표시는 `AUTO_READY`를 막지 않으며, 이후 사용자 요청으로 선택 정밀 검수를 돌린다.

## 5. 제거·통합 범위

| 기존 | FAST_EXAM |
|---|---|
| R03 분석 A/B | G1 내부 분석 1회 |
| R04 Fingerprint | G1 artifact에 포함 |
| R05 Plan A/B/C | 단일 Plan |
| R06 Plan Critic | 제거 |
| R07 후보 2–3개 | 후보 1개 |
| R08 모델성 로컬검사 | 결정론적 CLI |
| R09 I2/I3 | V1 1회, 예외 시 추가 1회 |
| R10–R12 다중 검수·판정 | V1 + 결정론적 reducer |
| 문항별 R13–R17 | 전체 시험 조립 뒤 1회 수행 |

## 6. 상태와 저장 구조

Parent 상태:

```text
GENERATING -> REVIEWING -> ASSEMBLING -> RENDERING -> AUTO_READY
```

문항 상태:

```text
PENDING -> GENERATED -> READY
                  |
                  +-> RECHECKING -> READY
                              |
                              +-> REGENERATING -> GENERATED
                                              |
                                              +-> FAILED
```

런타임은 `alive/runtime/fast-runs/{runId}/` 하나를 사용한다. 22개의 완전한 child Run은 만들지 않는다. Agent는 `inbox/`에만 쓰고, CLI가 검증 후 `questions/qNN/attempt-NN/`의 immutable artifact로 원자적 확정한다. 재생성 시 이전 attempt 디렉터리는 보존한다.

## 7. 완료 계약

`AUTO_READY`는 전 문항 `READY`, 번호·배점·총점·응답형·metadata·중복·choice label 결정론적 검사, 전체 Structured Exam과 JS serializer semantic round-trip, 실제 production renderer의 exam/solution/answer, 마지막 문항·마지막 페이지·MathJax·overflow·이미지 decode, review report와 evidence ZIP round-trip을 모두 요구한다. Production Archive에는 등록하지 않는다.

별도 `STRICT_AUDIT`까지 통과한 범위만 `AUDITED`로 부른다.

## 8. 구현 순서

1. fast manifest, question state, inbox acceptance schema
2. Builder/Verifier packet과 validator
3. answer comparison, risk flag, bounded regeneration reducer
4. capacity-safe dispatch/resume controller
5. whole-exam adapter·serializer 재사용
6. 전체 3화면 render와 package 재사용
7. 중단·누락·중복 dispatch·불일치·재생성 회귀테스트
8. Golden Exam 1개로 시간·호출량·품질 측정
9. MVP 회귀검증 통과 후 `NONVISUAL_WHOLE_EXAM` capability를 `ACTIVE_MVP`로 승격
10. 시각 원본 사전검사와 deterministic Visual Spec/SVG lane을 별도 구현 후 capability를 확장

## 9. 성공 기준

- 정상 22문항 기준 모델 호출 44회에 근접
- 자동 예외를 포함해 목표 45–55회 범위
- 최대 동시 작업 4개에서 중단 후 무중복 재개
- 문항별 브라우저 렌더 제거, 전체 3화면 렌더 1회
- 빠른 생성 결과와 수동 정밀 감사 상태를 명확히 분리
- 사용자 승인 전 production Archive 변경 없음

## 10. MVP 구현 현황

- 구현 모듈: `alive/engine/fast_exam.py`
- CLI: `fast-exam-start`, `fast-exam-prepare`, `fast-dispatch-start`, `fast-dispatch-fail`, `fast-submit`, `fast-reconcile`, `fast-exam-status`, `fast-exam-assemble`, `fast-exam-record-render`, `fast-exam-package`
- 회귀검증: `alive/engine/tests/test_fast_exam.py` 포함 전체 엔진 테스트 통과
- 추가 hardening: `CONFIRMATION`/`STRUCTURAL_VARIANT` 프로필, 구조형 숫자·표면 clone precheck, 객관식 distractor provenance precheck
- 실제 브라우저 검수는 Codex 오케스트레이터가 production renderer에서 수행하고 `fast-exam-record-render`로 증거를 확정한다.
- 현재 전체 시험지 기본 경로는 `STAGED_EXAM`이며, `S01A_VISUAL_RECON`과
  deterministic SVG lane은 staged에 구현되어 있다. FAST의 per-question
  visual lane과 최종 ZIP 재렌더 자동화는 별도 범위로 남긴다.
