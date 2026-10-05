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
8. R2 blind 입력은 정답/해설을 제외한 학생용 필드만 먼저 추출한다. freeze 전 답 노출은 실패 실행으로 보존하고, 새 `archive_r2`에서 clean blind 실행을 수행한다. 구조 validator PASS만으로 이 실패를 닫지 않는다.
9. multi-exam pilot은 CREATE/R1/R2/R3 각각 동시 담당 1개를 유지하는 stage별 직렬 컨베이어다. 역할은 고정하되 다음 시험지는 새 subagent 세션으로 시작한다. 같은 시험지의 동일 stage 수정·재확인·closure는 기존 세션에서 이어간다. CREATE 5개 동시 실행은 금지하며 concurrency 5는 상한이다. MAIN은 ROOT의 기술 routing, MASTER는 실제 continuation에만 사용한다.
10. R1 DEEP는 수학/answer 검수와 별도로 전 qid의 QUESTION_LAYOUT / SOLUTION_LAYOUT / META / VISUAL_SVG 4축 독립 검수를 기록한다. MAIN_DONE은 실제 production canonical 반영, asset reference 확인, 최종 production SHA에 결속된 closeout receipt까지 완료해야 한다.
11. 사용자에게 위임받은 이번 운영 라인에서 ROOT는 routing과 최종 운영 결정권을 가진다. worker의 검증된 근거에 따라 최소 수정안 적용, 오류 복구, 보류/인계 및 승인 범위 내 publication을 자율 결정하며 같은 적용 여부를 사용자에게 반복 확인하지 않는다. 수학·Meta·Visual·source의 직접 검수는 여전히 해당 worker가 수행한다. 원문 대비 수정은 provenance와 evidence에 명시하고 검증 실패를 강제 PASS로 처리하지 않는다. 위임 범위 밖의 새 목표나 복구 불가능한 필수 입력 부족만 사용자에게 요청한다.
12. CREATE/R1 worker가 해설을 작성·수정할 때는 현재 해설 품질 프로토콜의 Golden/Negative sample preflight를 실제 작업 전에 수행한다. 작업 뒤 읽은 샘플을 preflight로 소급 기록하지 않는다. 늦게 발견한 순서 오류는 보존하고, 프로토콜이 허용하는 최소 correction-review pass에서 샘플을 먼저 확인한 후 변경 locus만 다시 검수한다.
13. R1/R2의 학생용 입력은 지문·보기뿐 아니라 모든 참조 그림·표·도형을 포함한다. 필요한 그림을 실제로 열어 확인하기 전 blind/independent freeze를 하지 않는다. 입력 누락으로 결정할 수 없는 답을 freeze하고 upstream 답을 공개한 경우 해당 실행은 실패 기록으로 보존하고 완전한 학생용 입력으로 새 세션에서 검수한다.
14. 학생용 bundle은 실제 current final source에서 추출하고 문항별 학생 필드의 일치와 참조 자산을 freeze 전에 확인한다. 기존 CREATE/old student bundle을 현재 SHA만 붙여 재사용하지 않는다. Git blob SHA-1, 파일 SHA-256 및 각 gate의 raw/clean-filter hash 계약을 구별한다.
15. 완전한 학생 입력으로 답을 먼저 freeze한 뒤 비교에서 발견된 계산·선택기호 표기 오류는 blind 오염이 아니다. 원 freeze와 사전 추론은 보존하고 같은 stage에서 해당 locus만 근거 있는 adjudication/encoding correction을 한다. 정답을 맞힐 때까지 새 agent를 반복 호출하지 않는다. freeze 전 답 노출·그림 누락이나 student body 교체로 기존 freeze가 무효인 경우에만 영향 qid의 fresh 검수를 수행한다.
