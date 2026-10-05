# Repository Agent Instructions

## Archive 2.0 Codex Canary

이 섹션은 사용자가 **Archive 2.0 Codex multi-agent canary / Phase 10 pilot**을 명시한 경우에만 적용한다. 다른 작업에는 적용하지 않는다.

1. 작업 시작 시 아래 canonical을 **최초 1회만** 읽는다.
   - `docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Canary_Canonical_v1.md`
2. CREATE → R1 → R2 → R3 전환 때 같은 canonical/문서를 반복 재조회하지 않는다.
3. 규칙 충돌, 실제 main drift, 새로운 오류, 새 사용자 지시가 생긴 경우에만 관련 문서만 다시 확인한다.
4. ROOT는 routing-only다. 시험지 품질 작업, 문제 풀이, Meta/Visual 판정, source 재판독을 직접 하지 않는다.
5. 실제 production 작업은 canonical에 정의된 stage subagent에게 맡긴다.
6. Notion 전체 재조회는 정상 stage routing의 prerequisite가 아니다. Git canonical과 현재 코드가 실행 authority다.
7. nested `AGENTS.md`가 추가로 존재하면 해당 scope에서는 더 구체적인 지시를 함께 따른다.
