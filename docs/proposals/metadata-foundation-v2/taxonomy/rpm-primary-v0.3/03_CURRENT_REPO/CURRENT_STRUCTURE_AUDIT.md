# Current Repo Audit — v0.2 기준

현재 `archive/unit-past-exams-core.js`는 교육과정별/학년별 단원 profile을 직접 가지고 있고,
`subUnitKey`를 실제 출력 필터로 사용한다.

`archive/tools/intelligence/build-approved-question-metadata-v1.mjs`는
source exam JS의 subUnitKey/subUnit을 classification보다 우선하는 production authority로 본다.

따라서 taxonomy 변경은:
1. 정본문서 동결
2. 기존 key migration map
3. source exam metadata 갱신
4. classification 정합
5. builder
6. runtime 검증
순으로 해야 한다.

## 중요한 구조 문제
기존 `standardUnitKey`의 계층 깊이가 중등/고등에서 일정하지 않다.
새 canonical L1/L2를 기존 필드명과 곧바로 동일시하지 않는다.

## 이번 v0.2의 입장
- 기존 `js_archive_tag_master.json`을 정본 출처로 삼지 않는다.
- RPM-primary canonical docs를 기준으로 기존 master를 감사한다.
- 15개정 taxonomy는 중요한 원본 데이터로 보존한다.
- 15↔22 bridge는 별도 계층으로 관리한다.
