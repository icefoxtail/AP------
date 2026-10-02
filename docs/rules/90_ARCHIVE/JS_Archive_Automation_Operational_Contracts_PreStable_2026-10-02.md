# HISTORY — JS Archive Automation Operational Contracts before Stable v1

- 상태: **HISTORY / DO NOT PRELOAD / NOT EXECUTION AUTHORITY**
- 정리일: 2026-10-02
- 후속 설계: `02_PIPELINES/JS_Archive_Automation_Stable_Operating_Contract_v1.md`

## 보관 대상

2026-10-02 안정화 재설계 이전에 사용한 다음 운영 계약은 모두 역사 기록으로만 남긴다.

- existing-slot-only 3-lane return simulation
- CREATE 3 / R1 1→3 / R2 3 / R3 3 Phase A/B
- overnight R3 SURGE / single CREATE recovery
- CREATE/R3 slot role remap
- persistent blind context isolation across whole recurring thread
- dormant never-run clean slot rescue
- new task creation prohibition
- 운영감시자 / FLEX / simulation coordinator topology
- one-item-oriented publish consumer semantics
- GPT R3 retry legacy routing

## 왜 폐기했는가

1. recurring thread 전체를 contamination 단위로 보면서 clean slot이 시간이 갈수록 소진됐다.
2. 새 task 생성 금지와 결합돼 fresh blind recovery가 유한 자원이 됐다.
3. router/CURRENT 자체에 target-specific detail이 누적되어 새 worker도 preload 단계에서 오염될 수 있었다.
4. 감시자/조율자가 문제를 발견하고 문서만 갱신한 뒤 durable closure를 만들지 않는 사례가 반복됐다.
5. slot role 재활용이 CREATE/R1/R2/R3의 context를 섞었다.
6. publish가 시험지별 consumer처럼 해석되어 실제 batch release 구조와 충돌했다.

## 관련 Git history

- `e3f421afdbe15840c37c2d3e67f0160292d08f62` — isolate blind review across recurring runs
- `b19cc196527528431a75f183fac5ad8a7b982f0c` — action-first flex rescue
- `1252e7ab524d74770ac361094cbbf2e9a4a47b56` — no-stop/final-debt
- 과거 상세 문구는 해당 commit과 Notion HISTORY에 보존한다.

이 파일은 이전 계약을 다시 활성화하기 위한 문서가 아니다.
