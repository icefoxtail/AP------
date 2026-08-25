# ALIVE Protocol

ALIVE 문항 생산 체계의 정본 문서 모음이다.

기존 `alive/` 루트의 프롬프트들은 과거 생산 규칙과 사례를 보존한다. 새 작업의 정책 기준은 이 폴더 문서를 우선한다.

## 문서 역할

1. `ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`
   - 문항 생산 정책과 판정 기준의 정본.
   - MODE, 교육과정, 생성/심화 원칙, Validator 순서, 최종 상태를 정의한다.

2. `ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md`
   - EXAM_FOLLOWUP 유사·심화 문항과 시각 에셋 재생성의 보강 실행 규칙.
   - Master Rulebook을 변경하지 않고, 해당 작업에서만 개별 Spec보다 우선한다.

3. `ALIVE_STRUCTURED_QUESTION_SCHEMA_v1.0.md`
   - LLM 내부 문항 payload 계약.
   - 객관식/주관식/서술형, canonicalAnswer, acceptableAnswers, equivalencePolicy를 정의한다.

4. `ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md`
   - Source Fingerprint, Difficulty, Validator 결과, provenance, family 정보를 실제 문항 JS와 분리해 저장하는 계약.

5. `ALIVE_PIPELINE_RUNTIME_SPEC_v1.0.md`
   - Early Exit, Validator routing, checkpoint, BLOCKED/HOLD 복구, truncation/resume 규칙.

6. `ALIVE_PROMPT_COMPILER_SPEC_v1.0.md`
   - Master Rulebook에서 현재 MODE/Profile에 필요한 규칙만 뽑아 Runtime Prompt를 조립하는 계약.

7. `ALIVE_VISUAL_SPEC_v0.1.md`
   - ESSENTIAL 시각문항의 visualSpec → SVG/PNG → 검증 흐름의 최소 계약.

## 우선순위

`사용자 현재 지시 > Master Rulebook > Similar/Advanced 보강 Spec > 선택된 개별 Spec > 기존 alive 프롬프트`

Master Rulebook 전체를 매 LLM 호출에 그대로 붙이는 것을 운영 기본값으로 삼지 않는다. Runtime Prompt는 Prompt Compiler 규격에 따라 필요한 섹션만 조립한다.

## 기존 파일 처리

기존 `alive/` 루트 문서는 삭제·개명하지 않는다. 새 체계가 실제 작업에서 충분히 검증될 때까지 회귀 비교 자료로 유지한다.
