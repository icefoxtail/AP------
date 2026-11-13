# RPM 중등 2022 L1/L2 정리 — 운영 체크포인트

## 작업 상태

- 작업자: `GPT_ROOT_933015CD0A4F`
- AWCR taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, instructionRevision `2`
- 작업 브랜치: `fix/rpm-middle-l1-l2-20261113`
- 시작 main: `a6708a849faca7ccfd438937138d7e88bd5ee23c`
- 상태: 구현 및 집중 회귀 완료, 통합 검사·실제 Chrome 검증·PR/main 병합 대기
- 최신 상태는 같은 폴더의 `progress.json` 및 이 브랜치 원격 HEAD를 함께 확인한다. 아래 체크 결과만으로 운영 완료를 추정하지 않는다.

## 현재 우선순위와 산출물

사용자 최신 지시로 중1 기존 시험지 메타 전수 검토보다 **RPM 중학 1-1~3-2의 L1/L2 정리와 실제 분류 연결**을 먼저 진행한다.

공식 출판사 6권을 대조한 결과는 L1 **24개**, L2 **54개**다. L2는 학기 순서대로 **9 / 9 / 10 / 10 / 9 / 7개**다. 기존 목차 대비 중2-1 일차함수의 그래프 (1)/(2), 중3-1 제곱근/무리수와 실수, 중3-2 원주각/원주각의 활용이 구분된다.

- 현재 부모 정본: `archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json`
- 브라우저/Node 공용 경로 해석: `archive/rpm-middle-toc.js`
- 생성 및 정합성 검사: `archive/tools/meta-foundation/build-rpm-middle-toc.mjs`
- 상세 설명: `docs/rules/01_CANONICAL/taxonomy/rpm-middle-2022/RPM_MIDDLE_2022_PARENTS.md`

기존 locked v1 정본·crosswalk·승인 fingerprint·시험지·정답·해설·이미지는 변경하지 않는다. 기존 326개 leaf와 L3/L4를 현재 L1/L2에 연결하는 별도 정본을 둔다. 새 경로 입력은 기존 leaf에 유일하게 역연결해 원래 승인·저장 규약을 적용한다. UI 선택 범위만 현행 부모를 사용하고 request primaryPaths 및 saved snapshot 경로는 기존 표현을 보존한다.

기존 넓은 키만으로 새 L2를 결정할 수 없으면 임의 배정하지 않는다. 2015 자료는 원래 교육과정을 보존하며 이전 소단원 분류를 별도로 표시한다. 이번 작업은 M2/M3 전체 PT/TPL 연결이나 개별 시험지의 의미 검토 완료를 뜻하지 않는다.

## 현재 검증과 남은 검사

- 부모 정본: 24 L1 / 54 L2 및 6권 출처 근거 대조.
- 326 leaf의 base → effective → base 왕복 및 L3/L4·crosswalk ID 보존 검사 통과.
- quick pool 회귀 20건 통과.
- UnitPast 및 새 부모 통합 회귀 24건 통과.
- 기존 subunit grouping 생성물 변경 없이 `--check` 통과.
- URL 안의 JSON 부모키를 쉼표로 분리하던 문제 수정. 실제 모듈의 일반/학교별 URL 왕복 독립 확인 완료, 회귀 파일 추가 중.
- 전체 runtime guard, 실제 Chrome 검증, 최종 독립 검토, 원격 동일 tree 확인, PR/main 병합은 진행 중이다.

R1/R2/R3 전체 시험지 재검증은 실행하지 않는다. 공유 카탈로그와 등록 정본은 기존 main의 검증 결과를 재사용한다. runtime guard는 공식 `--registered` 모드로 등록 스냅샷을 재생성하지 않고 검사한다.

## 이어서 할 일

1. 최신 main 및 열린 PR을 확인하고 동시 작업의 변경을 덮어쓰지 않는다.
2. 위 진행 중 검사 결과를 `progress.json`에 반영한다. 필수 실패는 원인 확인 후 수정하거나 명시하고 품질 PASS를 추정하지 않는다.
3. 해당 브랜치의 정확한 tree를 원격에 저장하고 PR을 생성한다. 사용자 승인 범위에 따라 main 병합 후 원격 SHA를 직접 확인한다.
4. AWCR 다음 immutable revision을 기록하고 raw 저장본의 SHA와 revision을 재확인한다.
5. 아래 중1 시험지 전수 검토를 재개한다. 현재 완료 시험지는 0장이므로 완료 건수로 올리지 않는다.

## 중1 기존 시험지 검토 재개점

- 별도 작업 브랜치: `review/m1-existing-meta-20261113`
- 안전 체크포인트: `adf587b63e860722c9c8ec630509e4d8fe7b0a2a`
- 진행표: `docs/operations/m1-meta-review-20261113/progress.json`
- 발문·그림·해설 읽기 기록: 같은 폴더의 `01-shinheung-semantic-read-checkpoint.json`
- 전체 44시험지 / 1,047문항, 완료 0시험지 / 의미 대조 마감 0문항.
- 첫 대상: **2026 신흥중 중1 2학기 중간 / 24문항**.
- source blob: `c36139a90e9bcd378577ece8f891423bee6b0a19`
- source SHA256: `1bac8b9ef1d47f88ac66c69cf6c3299e708321d10cf84f073fca0c1a20bc4564`
- 24문항 읽기 기록은 보존되어 있다. 현재 메타 정본·Archive 2.0 세부 유형과의 대조, 필요한 최소 수정, 집중 검증 및 시험지별 PR/main 병합은 아직 남아 있다.

재개 전 이 목차 PR을 최신 main에서 확인하고 그 main을 기준으로 시험지 브랜치를 준비한다. 빈 메타 채우기 병행 작업과 범위를 겹치지 않는다. 사용자 요청대로 최신년도부터 한 장씩 끝까지 마감한다. 완료 목록 및 다음 학년·학기 인계도 기존 진행표에 누적한다.

## 복사용 인계

> AP------의 `fix/rpm-middle-l1-l2-20261113` 원격 HEAD와 이 문서·progress.json을 먼저 읽으세요. Notion 필독 라우터와 최신 main을 확인하고 현재 작업을 이어가세요. RPM 2022 중학 6권 L1 24/L2 54 정본과 기존 326 leaf의 부모 연결을 구현했으며, 본 체크포인트 시점에는 통합 검증과 PR/main 병합이 남아 있습니다. locked v1/기존 원문/승인/저장 경로를 보존하고 effective parent만 별도 관리합니다. 목차 병합 후 `review/m1-existing-meta-20261113`의 2026 신흥중 2학기 중간 24문항부터 의미 대조를 재개하세요. 원본 읽기 기록은 이미 저장했으므로 불필요하게 처음부터 다시 읽지 마세요. 아직 완료 시험지는 0/44입니다. AWCR은 기존 taskId 및 owner를 이어 쓰고 immutable 다음 revision 저장 후 원격 raw SHA·revision을 검증하세요.
