# 중등 통합 메타 잔여 — 후속 D

기준 main: `61830b6cd7ef773f6d9c963142a7e95af4c48e82`. 변경할 소스와 코드의 blob는 후속 main `1a3db9d6d8f5e7e1404c17f4978398eb90dbe6a5`에서도 그대로임을 재확인했다.

## 출고 범위

- 중2 2학기: #2158의 기존 독립승인 중 2019 신흥중 기말 Q7/Q12와 2023 왕운중 중간 Q2, 합계 3 UID. 승인된 CC 2개와 TPL 1개를 ADD_ONLY로 설치한다.
- 중3 2학기: 2026 삼산중 중간 Q8/Q19와 2024 풍덕중 기말 Q23, 합계 3 UID. 기존 독립승인을 받은 Condition 1개와 TPL 1개만 ADD_ONLY로 설치한다. 같은 두 시험지의 기존 FINAL_QA 23건을 보존한다.
- #2163의 strict native rationale 운반 수리 3파일을 현재 main에 최소 재적용했다. native after/항목 우선, 네 선언 값의 정확 일치, 기존 receipt provenance와 현재 fingerprint-only 보존 분기를 유지한다.
- 새 독립 검수·임의 난도·학생 내용 변경은 0이다. 중3 1학기 소스·브랜치·패킷 변경은 0이다.

## 기존 근거와 최소 범위

중2 준비 3의 15개 입력은 기존 PR의 정확한 Git blob 그대로다. 중3의 원 정의 승인, support5 및 현재 판본은 그대로 재사용한다. 중3 E005 Q2는 기존 Mother 난도 2와 native 1 충돌이 있어 제외했다. 새 TPL 설치 후 다른 support4도 공식 auto planner에서 기존 fingerprint 불일치로 보류됨을 확인했으며, 자동 승인 확대는 0이다.

중1 2학기 난도 3건은 등록기 단독 검증은 통과했지만 기존 PT/TPL 충돌로 Consumer가 거부하므로 이 패킷에 넣지 않았다. #2158의 renderer 관련 나머지 4 UID와 다른 작업자의 활성 PR도 포함하지 않는다.

## 완료한 로컬 검증

- rationale 관련 9개 테스트 PASS 및 별도 code-only 독립 검토.
- 중2: 공식 dry/write/replay 3 UID, changed-UID Consumer 3/3, projection replay PASS. 대상 밖 28,887개 metadata/identity와 보호 입력 20개 보존.
- 중3: 공식 dry/write/replay 신규 3 + 보존 23, native planner 26, Consumer 26/26, projection replay 4건 PASS. 대상 밖 metadata 28,864개와 runtime 7,302개 및 기존 23 승인값 보존.
- 기존 4칸은 중2 47건과 중3 37건을 공식 builder/Consumer로 대조하여 등록집합·벡터·reviewer를 보존했다. 중3의 기존 pending 10건도 그대로다. compact 수정은 없다.

위 결과는 로컬 격리 검증이다. 정확한 PR HEAD CI, main 병합, 실제 main 자동등록, 실제 Consumer 및 Pages 확인은 각각 별도 기록한다.

## 병합 순서

#2208은 실제 semantic CLI 순환 import 오류만 고치는 별도 코드 PR이다. #2203의 6 UID canonical-parent retry는 기존 registry SHA에 고정되어 있으므로, 새 정의를 설치하는 D는 C의 실제 등록 영수증을 확인한 다음 병합한다. 병합 전 최신 main에서 source·metadata before·registry CAS와 중복 등록 여부를 다시 확인한다.
