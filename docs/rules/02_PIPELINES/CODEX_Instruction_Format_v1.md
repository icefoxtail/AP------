# CODEX Instruction Format v1

- status: **CURRENT / HARD**
- scope: APMS / AP Math OS / Archive 2.0 / JS Archive에서 GPT가 Codex 실행 지시서를 작성할 때
- authority: 사용자의 현재 명시 지시 > 최신 Notion CURRENT/router > 이 문서 > 세부 프로젝트 정본

## 1. 핵심 원칙

Codex 지시서는 **정본 설명서가 아니라 짧은 실행 명령**이다.

기본 길이는 **10~15줄**이다. 사용자가 상세 지시서를 명시적으로 요구하지 않는 한 장문 prompt를 만들지 않는다.

지시서에는 아래만 남긴다.

1. 시작 1줄
2. 대상 / GOAL
3. 실제 작업 범위
4. 꼭 필요한 최소 검증
5. Git / 완료 상태
6. 짧은 최종 보고

## 2. 시작 문장

다음 정도로 끝낸다.

> 작업 전 Notion 「GPT 작업 전 필독 라우터」 → 해당 프로젝트 시작 페이지 → 현재 작업 CURRENT → latest main을 1회 확인하고 시작하라.

라우터가 가리키는 세부 정본문서를 지시서에 다시 1~8번 목록으로 복사하지 않는다.

## 3. 작업 지시

- 이번 작업에서 실제로 바꿀 파일/qid/locus만 적는다.
- branch/SHA/packet 값은 이번 실행에 직접 필요한 경우만 한 줄로 적는다.
- 이미 PASS한 stage를 다시 설명하거나 재실행시키지 않는다.
- 작은 pinpoint repair를 전체 pipeline 재수행으로 확대하지 않는다.
- source repair면 open qid와 source 확인 범위만 적고, 정본의 source 규칙 전체를 복붙하지 않는다.

## 4. 최소 검증

기본값:

- changed locus 확인
- direct dependency 확인
- 필요한 targeted validator **1회**
- unrelated mutation 0 확인

다음은 기본 지시에서 제외한다.

- 수정하지 않은 범위 전수검사
- 이미 PASS한 이전 stage 전체 재검
- unrelated global CI
- 같은 validator 반복 실행
- 같은 Notion/main/PASS artifact 반복 조회

main 반영이 범위에 있으면 **merge/publish 직전에 latest main과 한 번만 최종 대조**한다.

추가 검증은 실제 conflict, source ambiguity, stale ref, required validator FAIL처럼 구체적인 위험 신호가 생긴 경우에만 한다.

## 5. 고정 템플릿

~~~text
[대상] <파일/시험지/작업>

작업 전 Notion 라우터 → 프로젝트 시작 페이지 → 현재 작업 CURRENT → latest main을 1회 확인한다.

[GOAL]
<이번 실행에서 실제로 끝낼 것>

[작업]
<수정/구현 범위. 필요한 qid·파일만>

[최소 확인]
변경 범위 + direct dependency만 확인하고 필요한 targeted validator를 1회 실행한다.
이미 PASS한 단계·unrelated 범위·전체 CI는 다시 돌리지 않는다.

[완료]
<branch push 또는 main 반영 등 종료 상태>
변경 내용 + commit/SHA + blocker만 짧게 보고한다.
~~~

## 6. 금지

- 정본 내용을 지시서에 수십~수백 줄 재복사
- “혹시 모르니” 검증 추가
- 같은 authority 반복 조회
- 이미 끝난 R1/R2/R3 전체 재실행
- 보고 형식이 실제 작업보다 커지는 장문 packet
- 사용자가 요구하지 않은 독립검수/전체 CI/추가 gate를 자동 추가

## 7. 예외

사용자가 직접 상세 packet을 요구했거나, 대량삭제/파괴적 migration처럼 정확한 실행 경계가 없으면 위험한 작업만 필요한 세부사항을 추가한다.

그 경우에도 **정본 복붙이 아니라 이번 작업의 delta만** 적는다.

## 8. 한 줄 규칙

> **Codex에게 정본을 설명하지 말고, 정본을 읽게 한 뒤 이번에 무엇을 끝낼지만 짧게 지시한다.**
