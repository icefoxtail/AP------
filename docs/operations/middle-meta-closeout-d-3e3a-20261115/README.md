# 중등 통합 메타 잔여 — 후속 D 준비

기준 main: `61830b6cd7ef773f6d9c963142a7e95af4c48e82`

## 현재 고정한 범위

- #2163의 정확한 native rationale 운반 수리 3파일을 현재 main에 최소 재적용한다. 명시 native after/항목이 우선하며, 요청과 현재 source의 두 rationale 필드 네 값이 모두 기존 native decisive step과 같을 때만 운반한다. 기존 receipt provenance와 현재 fingerprint-only 보존 분기를 유지한다.
- #2158의 유효한 부분만 재사용한다: 중2 2학기 2019 신흥중 기말 Q7/Q12, 2023 왕운중 중간 Q2. 학생 내용과 비선택 44문항은 변경하지 않는다. 기존 승인된 CC 2개와 TPL 1개의 ADD_ONLY 정의 설치 및 해당 3 UID 등록 요청을 포함한다.
- 중3 1학기 소스·브랜치·패킷은 제외한다. #2158의 나머지 4 UID 및 다른 작업자의 renderer PR은 이 준비본에 포함하지 않는다.
- 중1 2학기 난도 3건은 공식 난도 등록기 검증은 통과했지만 기존 PT/TPL 충돌로 Consumer가 거부하므로 이 준비본에 포함하지 않는다. 의미 보류를 해제하거나 Consumer 검증을 완화하지 않는다.

## 검증 상태

- 현재 source·metadata·identity·registry before를 실제 main과 대조했다.
- rationale code의 원격 main 44개 dependency blob을 고정하고, 관련 8개 테스트 및 명시 native 우선순위 1개 테스트를 실행하여 9 PASS/0 FAIL/0 SKIP을 확인했다.
- 별도 agent의 code-only 독립 검토를 첨부한다.
- 중2 준비 3 UID의 기존 #2158 exact HEAD CI는 모두 통과했다. 최신 조합의 공식 PR CI와 실제 main 자동등록·Consumer·Pages는 별도 필수 조건이며 아직 완료로 선언하지 않는다.

## 순서

현재 브랜치는 검증 가능한 준비본이다. #2203의 정확한 6 UID canonical-parent retry는 현재 registry SHA에 고정돼 있으므로, 새 정의를 설치하는 D의 main 병합은 C의 실제 등록 및 영수증 확인 이후에만 수행한다. 병합 전 최신 main에서 입력 CAS와 중복 등록 여부를 다시 확인하고 필요한 통합 검증을 마친다.
