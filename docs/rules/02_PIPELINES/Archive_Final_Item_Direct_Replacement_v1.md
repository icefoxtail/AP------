# Archive Final Item Direct Replacement v1

status: **CURRENT / ACTIVE**  
scope: **REVIEW2 이후에도 남은 ITEM_HOLD의 held qid 직접 복구·대체**  
execution style: **DIRECT AUTHORING / NO GENERATION PIPELINE**  
updated: 2026-09-30

## 0. 목적

이 문서는 CREATE → REVIEW1 → REVIEW2와 수정프로토콜을 모두 거친 뒤에도 남은 `ITEM_HOLD` 문항을 최종적으로 정상화하는 정본이다.

목표는 pipeline을 완주하는 것이 아니라 **학생에게 실제로 제공할 수 있는 수학적으로 정상적인 문항을 만드는 것**이다.

기본 흐름:

```text
REVIEW2_DONE_WITH_ITEM_HOLDS
→ D: 원본 확인
→ 원본 기반 직접 복구
→ 복구 불가 시 해당 qid만 직접 대체문항 작성
→ 직접 재풀이·보기 전수검증·해설 검증
→ replacement qid Meta fresh 판정
→ ITEM_HOLD 제거
→ itemHoldCount=0
→ READY_FOR_COMMIT
```

## 1. 실행 경계 — HARD

이 recovery scope에서는 문항 대체를 위해 다음 실행기를 열지 않는다.

- ALIVE CLI generation
- pipeline-core work-batch
- provider FINAL_AUDIT
- 별도 similar-question pipeline
- whole-exam regeneration

위 시스템의 RULE_DRIFT, provider unavailable, legacy dispatch disabled, work-batch 오류는 **이 직접 대체작업의 blocker가 아니다.**

다만 이 문서는 기존 JS schema, 학생용 해설 규칙, 교육과정, Meta semantic authority, Git safety를 무효화하지 않는다.

## 2. 적용 조건

다음 조건일 때 적용한다.

1. 해당 qid가 REVIEW2 후에도 ITEM_HOLD다.
2. 앞단에서 허용된 `REPAIR_BEFORE_HOLD`, `ONE_SEMANTIC_LOCUS_REPAIR`, `AUDITED_SOURCE_REPAIR`를 이미 시도했다.
3. 기존 문항을 최소수정으로 정상화하기 어렵거나 source 자체가 모순·유실·비결정적이다.
4. 정상 PASS 문항은 건드리지 않는다.

시험지 전체를 다시 검수하지 않는다. **held qid와 직접 연결된 asset/Meta만 작업한다.**

## 3. 복구 우선순위

### 3.1 원본 우선

먼저 로컬 원본 PDF/scan/image를 찾는다.

원본으로 정상 복구가 가능하면 대체문항을 만들지 않고 해당 qid만 source repair한다.

### 3.2 원본 자체가 잘못된 경우

다음은 직접 대체문항 허용 사유다.

- 원문 조건 자체가 모순
- 공식 해설까지 같은 모순을 답습
- 필요한 조건 또는 시각자료가 유실되어 truth를 확정할 수 없음
- 정상화하려면 사실상 문항 전체를 다시 출제해야 함
- 여러 복원안 중 하나를 추측으로 골라야 함

이 경우 원문 exact 복원을 목표로 하지 않는다. **같은 교육적 역할을 하는 정상 문항 1개로 qid를 교체한다.**

## 4. 대체문항 Fidelity

대체문항은 원문과 완전히 같을 필요가 없다.

반드시 유지:

- 같은 교육과정 범위
- 같은 또는 매우 가까운 핵심 개념
- 같은 response form
- 비슷한 풀이 단계 수
- 비슷한 사고 부담과 난이도대
- 시험지에서의 해당 번호 역할
- 객관식이면 보기 5개
- 시각자료가 핵심이면 새 문항과 정확히 맞는 시각자료

가능하면 유지:

- 원문의 대표적인 오답 포인트
- 풀이 진입 방식
- 문항 길이와 조판 밀도

금지:

- 상위 학년/이후 단원으로 해결
- 원문 오류를 그대로 복제
- 정답부터 정한 뒤 조건을 억지로 맞춤
- 의미 없이 숫자만 갈아 끼운 부자연스러운 clone
- 원문보다 2단계 이상 난도를 올림

## 5. SOLUTION FIRST — HARD

문항 작성 순서는 다음을 고정한다.

```text
핵심 개념/난도 역할 확정
→ 조건과 목표 설계
→ 직접 풀이
→ 실제 해 존재/정답 유일성 확인
→ canonical answer 동결
→ 오답 경로 4개 설계
→ choices 작성
→ answer 위치 결정/배열
→ 학생용 solution 작성
→ blind re-solve
```

**정답 번호나 보기 모양을 먼저 정한 뒤 문제를 끼워 맞추지 않는다.**

문제가 조금이라도 불안하면 answer/choice만 패치하지 말고 candidate를 폐기하고 다시 설계한다.

## 6. 객관식 보기 품질 — HARD

### 6.1 오답은 실제 오류에서 만든다

오답 4개는 가능한 한 서로 다른 실제 오류 경로에서 만든다.

권장 오류군:

- 조건 하나 누락
- 부호 오류
- 계수 오류
- 지수/제곱 처리 오류
- 경계값 포함·제외 오류
- 연산 순서 오류
- 식 변형 오류
- 조건 해석 오류
- 잘못된 대입
- 산술 계산 오류
- 그래프/도형 표현 해석 오류

`정답 ±1, ±2` 식의 근거 없는 주변 숫자 채우기는 금지한다.

각 오답은 학생이 그 선택에 도달할 수 있는 짧은 수학적 경로가 내부적으로 설명되어야 한다.

### 6.2 보기 5개는 한 세트처럼 보여야 한다

학생이 보기의 모양만 보고 정답을 추측할 수 없어야 한다.

숫자형 보기 HARD RULE:

- 비교 가능한 단일 수치라면 기본적으로 오름차순 배열한다.
- 단위, 부호 표기, 분수/소수 표현 형식을 통일한다.
- 같은 의미의 중복값/동치식 금지.
- 4개가 한 구간에 모였는데 1개만 멀리 떨어진 **단독 outlier** 금지.
- 예: `1, 3, 4, 5, 20`처럼 한 값만 규모가 튀어 정답/오답을 시각적으로 드러내는 구성은 FAIL이다.
- 실제 오류 경로에서 나온 값이라도 보기 전체를 부자연스럽게 만들 정도의 outlier면 그 오답을 버리고 다른 오류 경로를 만든다.
- 인접 간격이 완전히 같을 필요는 없지만, 한 간격만 나머지보다 압도적으로 큰 구성은 피한다.
- 정답만 음수/분수/소수/긴 식이고 나머지가 모두 단순 정수인 식의 시각적 단서 금지.

식·문장형 보기:

- 표현 길이와 복잡도를 가능한 한 균형 있게 한다.
- 정답만 유독 정교하거나 긴 문장이 되지 않게 한다.
- 문법/단위/표기 차이만으로 정답이 보이지 않게 한다.

### 6.3 모든 보기 전수 검증

객관식은 최종 저장 전 반드시 5개 전부 확인한다.

- 정답 정확히 1개
- 중복/동치 보기 0
- 각 오답이 실제로 틀림
- 조건에 따라 다른 보기도 정답이 되는 숨은 경우 없음
- 존재하지 않는 해를 전제로 한 보기 없음
- 보기 순서 변경 후 answer index 동기화

## 7. 정답 번호 분산 — ③ DEFAULT 금지

**③을 기본값 또는 선호값으로 사용하지 않는다.**

정답 번호는 수학 정답을 확정한 뒤, 보기 품질을 해치지 않는 범위에서 결정한다.

### 7.1 시험지 분포를 먼저 본다

대체 대상 qid를 제외하고 현재 시험지의 객관식 정답 위치 ①~⑤ 개수를 센다.

우선순위:

1. 현재 시험지에서 덜 사용된 번호
2. 바로 앞/뒤 문항과 다른 번호
3. 최근 대체문항에서 반복되지 않은 번호
4. 위 조건이 비슷하면 **③ 이외의 자연스러운 번호를 우선**

### 7.2 목표 번호에 맞춰 오답을 억지 생성하지 않는다

숫자형 보기를 오름차순으로 놓을 때 정답을 ①에 두려면 자연스러운 오답 4개가 정답보다 커야 하고, ⑤라면 자연스러운 오답 4개가 작아야 한다.

그 구조가 부자연스럽다면 **목표 번호를 포기하고 다음 덜 사용된 feasible 번호를 선택**한다.

정답 위치 분산보다 다음이 우선한다.

```text
수학적 무결성
> 오답의 실제 오류 경로
> 보기 자연성
> 정답 위치 분산
```

### 7.3 반복 제한

가능한 범위에서:

- 동일 정답 번호 3연속 금지
- 새 대체 객관식 여러 개를 연속 생성할 때 같은 번호 반복을 피한다.
- ③이 다른 번호보다 과도하게 많으면 이후 대체문항에서 ①/②/④/⑤ 중 feasible한 번호를 우선한다.

정답 번호를 바꾸기 위해 **정답값 자체를 바꾸지 않는다.**
보기 순서 또는 자연스러운 distractor 설계만 조정한다.

## 8. 직접 재풀이 — BLIND SELF CHECK

candidate를 완성한 뒤 작성 중 계산을 정답 근거로 재사용하지 않는다.

문제와 보기만 놓고 처음 보는 문제처럼 다시 푼다.

확인:

- 조건이 동시에 성립하는 실제 대상이 존재하는가
- 실수/정수/자연수/정의역 조건을 만족하는가
- 정답이 유일한가
- 객관식 5개 중 정확히 하나만 맞는가
- 제곱·제곱근·분모·로그·절댓값 등에서 허근/정의역 오류가 없는가
- solution 없이도 동일 답을 다시 얻는가

검산 불일치 시 candidate 전체를 재설계한다.

## 9. 학생용 solution

solution은 새 문항을 실제로 푸는 풀이로 새로 작성한다.

- 기존 오류 문항의 solution 부분수정 재사용 금지
- 조건 해석 → 핵심 식/관계 → 계산/판단 → 결론 순서
- answer와 결론 exact 일치
- 해당 학년 교육과정 밖 풀이 금지
- 학생이 solution만 읽어도 재현 가능
- 작은칠판 조판 규칙 준수

## 10. 시각자료

새 문항에 시각자료가 본질적이면 해당 qid의 problem/solution visual만 새 문항 truth에 맞게 만든다.

- 원문 오류 visual 재사용 금지
- 좌표/라벨/길이/각/비율이 새 문항과 일치해야 함
- 정상 non-target asset 수정 금지

이 direct replacement scope에서는 시각자료를 만들기 위해 ALIVE/pipeline-core generation flow를 열지 않는다. 시각자료 자체의 수학적·표현적 품질 규칙은 계속 적용한다.

## 11. replacement qid Meta — FRESH

문항 내용이 교체되면 기존 qid의 의미 메타를 그대로 복사하지 않는다.

새 문제 + 검증된 새 solution 기준으로 **해당 qid만** fresh 재판정한다.

최소:

- standardCourse / standardUnit
- RPM semantic L3/L4
- 가능한 ACTIVE problemTypeKey/templateKey binding
- CrossConcept / Condition 계열 해당 시
- difficulty fresh blind
- category/tags 등 content-owned metadata

projection/binding gap은 기존 Meta canonical 규칙에 따라 기록하되, 이미 확정 가능한 semantic truth를 임의로 HOLD시키지 않는다.

## 12. 적용 범위 / 불변성

변경 허용:

- target held qid
- target qid problem/solution asset
- target qid Meta
- recovery receipt/evidence

불변:

- non-target qids
- unrelated exam files
- unrelated assets
- main

대체 적용 전후 non-target qid가 바뀌지 않았는지 확인한다.

## 13. Provenance

대체문항은 원본 exact 복원이라고 기록하지 않는다.

receipt/evidence/Notion에 최소:

```text
recoveryType = QUESTION_REPLACEMENT
method = CODEX_DIRECT_AUTHORING
replacementScope = QUESTION_ONLY
replacedQid = <qid>
reason = ORIGINAL_ITEM_UNRECOVERABLE_AFTER_REVIEW2
originalSourceRef = <source/blob ref>
```

production question object에 임의 provenance field를 추가하지 않는다.

## 14. 완료 조건

해당 qid는 다음을 모두 만족해야 PASS다.

- 문항 성립
- 직접 재풀이 PASS
- 정답 유일
- 객관식이면 5 choices 전수 PASS
- 보기 자연성 PASS
- 정답번호 분산 규칙 PASS
- 학생용 solution PASS
- 필요한 visual PASS
- replacement qid Meta fresh PASS
- JS syntax/schema integrity PASS
- non-target qid 불변 PASS

모든 held qid가 닫히면:

```text
ITEM_RECOVERY_DONE
itemHoldCount = 0
READY_FOR_COMMIT
```

까지만 승격한다. main publish는 별도 writer가 수행한다.

## 15. 참고 품질 원칙

이 정본은 다음 문서의 **문항 설계·검산 품질 원칙만** 흡수한다. 해당 문서의 실행 pipeline은 상속하지 않는다.

- `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md` — EXAM_FOLLOWUP, 수학 무결성, FREEZE 후 끼워맞추기 금지
- `alive/90_ARCHIVE/LEGACY_PROMPTS/[시험지 유사 문항 생성 프롬프트 v7].md` — 독립문항, 내부 검산, 보기 품질
- `alive/90_ARCHIVE/LEGACY_PROMPTS/시험지분석유사문제출제.md` — 난도/풀이구조 동치와 오류 기반 distractor
- `alive/90_ARCHIVE/LEGACY_PROMPTS/생성문제검수프롬프트.md` — 성립/정답/해설 검수
- `alive/90_ARCHIVE/LEGACY_PROMPTS/숫자변형생성용.md` — solution-first self audit

우선순위:

```text
사용자 현재 지시
> 이 Direct Replacement 정본
> 현재 JS Archive canonical rules
> 위 참고문서의 품질 원칙
```

## 16. 한 줄 원칙

**살릴 수 있으면 원본으로 살리고, 못 살리면 같은 교육적 역할의 정상 문항을 직접 새로 만든다. 답은 직접 다시 풀어 확정하고, 보기는 실제 오답 경로로 예쁘게 만들며, ③을 기본값으로 쓰지 않는다.**
