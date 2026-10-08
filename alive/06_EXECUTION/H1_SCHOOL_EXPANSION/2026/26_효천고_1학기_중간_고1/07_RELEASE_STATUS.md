# 효천고 release

## CURRENT — 생성문제 학생용 정적 Consumer 데이터 등록 (2026-10-08)
- Approved generated UID **92/94**, excluded HOLD **2** (Q10-001, Q18-003). 원본 시험지 수정 없음.
- 정답 위치 수정 branch `pilot/alive-lite-hyocheon-answer-position-repair-20261008`의 45문항 보기 변경분을 별도 최종 Consumer payload에 반영. Q19-004는 이전 main에서 잘못 고친 answer ④ 대신 실제 수학값 -3인 수정 branch 정답 ② 사용.
- 정식 Generated Consumer 정적 registry `archive/data/generated-lite-consumer/v1/index.json` → 승인 JSON shard 25개. Archive 2.0 홈의 **검수 완료 생성문제** 타일은 `archive/generated-bank.html`에 연결; UID/단원 검색·문항 조회·문항 선택/인쇄 소비 경로 구현.
- 등록 데이터/프로그램 반영 상태 `STATIC_CONSUMER_REGISTERED`. **실제 브라우저/학생 계정 end-to-end smoke 및 원격 배포 확인은 아직 NOT_RUN**. `STUDENT_SUPPLY_VERIFIED=NO`, `REVIEW_CONSUMER_MAIN_DONE=NO` (완료 주장 금지). 브라우저 smoke 후 같은 문서 갱신.
- 기존 Archive 2.0 original catalog `archive/data/archive2-catalog.json`, 원본 `archive/db.js` 및 원본 UID는 그대로 유지. ALITE UID를 original qid_v1로 변환하지 않음.


## CURRENT — Generated Bank REVIEW→Consumer DB 대기 (2026-10-08)
- main candidate 분모 94 UID / shard 25 / L2 manifest 9. 과거 REVIEW 원장 91 PASS+1 repair PASS+2 HOLD는 정답 위치·오답 설계 새 게이트 도입 전 snapshot이고 `archive2ConsumerRegisteredCount=0`.
- `pilot/alive-lite-hyocheon-answer-position-repair-20261008`: phase1~4 합계 45개의 변경 기록(UID unique 여부는 final diff로 확인), 독립 수학 재검수 미완. 기존 92를 최종 등록 승인 수로 자동 상속하지 않는다.
- NEXT: `ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md` → repair branch 영향 UID 독립 review+정답 위치/오답 품질+해설 동기화 → HOLD 분리 → 최종 approved UID 결정 → Generated 전용 Archive2 Consumer 등록/학생용 readback → main merge/push → `REVIEW_CONSUMER_MAIN_DONE`으로 상태 갱신.
- 현재 `CONSUMER_DB_REGISTERED=0`, `STUDENT_SUPPLY_VERIFIED=0`, `REVIEW_CONSUMER_MAIN_DONE=NO`. 정상 candidate materialization은 소비자 등록이 아니다.


Archive2 product DB 통합=NOT_TESTED. verified student supply 0 (현재 확인 근거 기준). 파일럿 Git 저장과 운영 main release 분리.
