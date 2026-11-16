# 확장 SVG 장부 초기 준비 (초기 목록)

main c57e1a1 기준 351시험지 9,093문항. 이는 초기 목록 수이며 검수/그림 필요/plan 완료 수가 아니다.

- index.json: 전체 source 경로 기반 시험지 소유 및 연결 목록.
- figure-ledger.schema.json: 문항별 장부 구조. 기존 운영 장부를 대체하지 않는다.
- prepared/docs/plans/archive-one-route-upgrade/svg-plans-expanded/: 시험지별 _figure-ledger.jsonl.
- 모든 행 UNASSESSED, NOT_INSPECTED, NOT_REVIEWED, NOT_STARTED, NOT_RUN, UNVERIFIED.
- 빈 자산 배열은 자산 없음이 아니라 아직 미조사이다. inventoryStatus로 구분한다.
- UID/sourceId null은 미확인이다. source path+ordinal를 안정 식별자로 사용하고 실제 판독 때 보강한다.
- _decisions.jsonl 및 q*-solution.json은 아직 생성하지 않았다. 경로만 예정되어 있다.
- 실제 검사/판정 이후에만 need·selfcheck·plan 상태를 바꾼다. 계획완료를 게시완료로 표시하지 않는다.
- 교과서 basename 중복은 전체 source 경로를 보존하여 회피한다.
- 유형판정 완료 후 root가 소유를 분배하고 최신 main과 재대조한 뒤 필요한 부분만 결과 브랜치에 추가한다.
- 기존 ledger-upsert/portable_root를 새 범위에 그대로 실행하지 않는다.

원격 index.json은 351시험지와 문항순번 9,093개 및 공통 rowDefaults를 저장한다. 개별 문항 장부 파일은 향후 판독시 materialize하며 현재 미생성임을 ledgerMaterialized=false로 표시한다. 운영 장부/원문/그림/엔진 수정은 없다.
