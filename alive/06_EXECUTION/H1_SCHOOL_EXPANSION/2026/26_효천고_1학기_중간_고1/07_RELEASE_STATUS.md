# 효천고 release

## CURRENT — Generated Bank REVIEW→Consumer DB 대기 (2026-10-08)
- main candidate 분모 94 UID / shard 25 / L2 manifest 9. 과거 REVIEW 원장 91 PASS+1 repair PASS+2 HOLD는 정답 위치·오답 설계 새 게이트 도입 전 snapshot이고 `archive2ConsumerRegisteredCount=0`.
- `pilot/alive-lite-hyocheon-answer-position-repair-20261008`: phase1~4 합계 45개의 변경 기록(UID unique 여부는 final diff로 확인), 독립 수학 재검수 미완. 기존 92를 최종 등록 승인 수로 자동 상속하지 않는다.
- NEXT: `ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md` → repair branch 영향 UID 독립 review+정답 위치/오답 품질+해설 동기화 → HOLD 분리 → 최종 approved UID 결정 → Generated 전용 Archive2 Consumer 등록/학생용 readback → main merge/push → `REVIEW_CONSUMER_MAIN_DONE`으로 상태 갱신.
- 현재 `CONSUMER_DB_REGISTERED=0`, `STUDENT_SUPPLY_VERIFIED=0`, `REVIEW_CONSUMER_MAIN_DONE=NO`. 정상 candidate materialization은 소비자 등록이 아니다.


Archive2 product DB 통합=NOT_TESTED. verified student supply 0 (현재 확인 근거 기준). 파일럿 Git 저장과 운영 main release 분리.
