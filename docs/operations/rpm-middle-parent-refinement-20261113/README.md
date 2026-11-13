# RPM 중등 2022 L1/L2 정리 — 운영 체크포인트

## 현재 상태와 권한

- 사용자 우선순위: 중1 시험지 검토에 앞서 RPM 중학 1-1~3-2의 L1/L2와 실제 선택 연결을 정리한다.
- 작업자: `GPT_ROOT_933015CD0A4F`; AWCR taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, instructionRevision `2`.
- 브랜치: `fix/rpm-middle-l1-l2-20261113`; PR: https://github.com/icefoxtail/AP------/pull/1958
- 시작 main: `a6708a849faca7ccfd438937138d7e88bd5ee23c`; 최근 확인 main: `2b90b85dd848806ba62f844b85225db8bcae5ee3` (별도 G7 PR #1955 병합, 이 작업과 파일 겹침 없음).
- 상태: **공식 부모 대조·수정과 집중 회귀 완료. 최종 tree의 CI·실제 Chrome 검사·main 병합 대기.**
- 직전 원격 체크포인트: `71137cfe8d6b0caba3926fce98ad28e53e80bdbf`, tree `5c092f6731d79fb4af26d6092cf6704de53c2a2c`.
- AWCR r4: Drive `1OPzyBkhimVFPj_vooQtMzpsDqVLqPib0`, raw SHA256 `c518a83ceb80141ebbce7d7577f458319593221292703db226c76fd40c875d08` (raw 재조회 검증).

최신 상태는 `progress.json`, 원격 브랜치 HEAD, PR의 실제 검사 결과를 함께 확인한다. 오래된 PASS나 문서의 대기 상태만으로 운영 완료를 추정하지 않는다. 사용자는 이 범위의 PR/main 병합 및 연속 진행을 이미 승인했다.

## 현재 정본과 변경 범위

공식 출판사 6권 대조 결과는 **24 L1 / 54 L2**다. 학기 순서대로 L2는 **9 / 9 / 10 / 10 / 9 / 7**개다. 기존 목차 대비 중2-1 일차함수의 그래프 (1)/(2), 중3-1 제곱근의 뜻과 성질/무리수와 실수, 중3-2 원주각/원주각의 활용이 분리된다.

- 부모 정본: `archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json`
- 브라우저/Node 공용 해석: `archive/rpm-middle-toc.js`
- 생성/검사: `archive/tools/meta-foundation/build-rpm-middle-toc.mjs`
- 정본 설명: `docs/rules/01_CANONICAL/taxonomy/rpm-middle-2022/RPM_MIDDLE_2022_PARENTS.md`

**155개 기존 L3 / 326개 leaf의 부모를 전부 대조**하고, 명백한 기존 부모 오류 9개를 수정했다. `M1-RPM-177/178`은 위치 관계, `M1-RPM-183/184`는 기본 도형, `M2-RPM-194`는 여러 가지 사각형, `M3-RPM-104/105`는 다항식의 곱셈, `M3-RPM-127/128`은 이차방정식의 활용이다. 공식 장 경계와 실제 유형 페이지 근거는 아래 감사 기록에 보존했다.

| 감사 파일 | 범위 |
|---|---|
| `m1-parent-placement-audit.json` | 57 L3 / 119 leaf |
| `m2-parent-placement-audit.json` | 59 L3 / 118 leaf |
| `m3-parent-placement-audit.json` | 39 L3 / 89 leaf |

M2의 176·177·195·199처럼 유형 이름이 여러 장에 걸치는 항목은 현재 부모를 유지하고 한계를 기록했다. L3/L4 이름·식별자를 새로 만들거나 기출 문항 분류의 정확성을 확정한 감사가 아니다. 필요한 leaf 근거 없이 넓은 부모나 개념만 주어진 **13개 모호한 기존 키는 자동 배정하지 않는다**.

locked v1 정본·crosswalk·승인 fingerprint·시험지·정답·해설·이미지는 보존한다. 새 현재 부모 경로는 기존 leaf에 유일하게 역연결해 원래 승인·저장 규약을 사용한다. UI 선택만 현재 부모를 사용하고 request primaryPaths·저장 snapshot·Archive2Core는 기존 표현을 유지한다. 현재 helper는 UnitPastExamsCore에서 직접 불러오므로 Worker 및 기존 재생 경로에 새 의존성을 추가하지 않는다.

2015 자료는 원래 교육과정을 유지하고 이전 소단원을 별도로 표시한다. 명시된 originalCurriculum/curriculum을 연도 추정보다 우선한다. 고등 분류는 범위 밖이다.

## 검증과 남은 확인

- 최종 v1.2 helper/공식 resolver 35/35, UnitPast·quick pool·Unified·통합·URL 69/69 통과.
- Core 의존성 분리 후 기존 apply bridge 23/23 및 실제 Worker bundle/deploy 15/15 통과.
- UI/producer/reader/URL 집중 검사 14/14 통과. 호출별 수치는 일부 중복이므로 합산하지 않는다.
- 부모 정본 생성물 `--check` 및 기존 subunit grouping `--check` 통과, 기존 생성물 재생성 없음.
- 독립 검토: 326 leaf 왕복·L3/L4 보존, 13개 모호 키 보류, 명시 교육과정 우선순위, Node/브라우저 UMD 로드 순서 확인.
- 로컬 전체 guard는 sparse checkout의 원본/생성 입력 부재로 미완료. 이를 품질 PASS로 보고하지 않는다.
- 로컬 Chrome은 socket EPERM으로 실행하지 못했고 sandbox 외부 실행은 자동 승인 정책 `sandbox_approval=false`로 거절됐다. 저장소의 기존 GitHub Chrome job을 사용한다.
- 직전 CI의 runtime 계약 243개와 50문항 실제 Chrome 출력은 통과했다. 새 RPM UI 검사는 세로 스크롤바를 제외한 `clientWidth`를 전체 viewport와 비교해 실패했다. 실제 너비 1440, clientWidth 1425, 가로 넘침 없음. viewport와 문서 폭을 구분하도록 검사 코드를 수정했다.
- 직전 CI 통합 실패의 캐시 literal·producer fixture는 현재 변경에 맞게 수정했다. Core 의존성은 분리해 기존 bridge/Worker 계약을 그대로 만족시킨다.

**최종 게시 tree의 CI와 RPM 실제 화면 검증을 아직 PASS로 선언하지 않는다.** 실제 Chrome 화면·선택 UID 풀·URL 복원·모바일 배치를 확인한 뒤 사용자 승인 범위로 main에 병합하고 원격 SHA를 확인한다. R1/R2/R3 전체 시험지 검증은 재실행하지 않는다.

## 다음 실행

1. 최신 main을 병합하고 정확한 tree를 원격 브랜치에 저장한다. 다른 작업의 파일을 수정하지 않는다.
2. PR #1958의 최종 SHA에서 필요한 CI/Chrome 결과와 스크린샷을 확인하고 근거를 기록한다.
3. main에 병합 후 원격 SHA/파일 바이트를 직접 확인한다. AWCR 다음 immutable revision을 저장·재조회한다.
4. 이 브랜치에 병합 영수증과 인계 상태를 남긴 뒤 아래 시험지 작업을 재개한다.

## 중1 시험지 작업 재개점

- 브랜치: `review/m1-existing-meta-20261113`
- 원격 안전 체크포인트: `f05383131e035ad28b613a238ec072c2c9b265b2`, tree `39597ac187cb60af16eb4cdb7f7a9d28cc024de1`.
- 진행표: `docs/operations/m1-meta-review-20261113/progress.json`
- 읽기 근거: 같은 폴더 `01-shinheung-semantic-read-checkpoint.json`
- 13~24번 후보 대조: `01-shinheung-candidate-comparison.json`, SHA256 `c887310c2501c3d70a010315a7fda02c73a6964ba45b70c3aa106a99c4a62ce9`.
- 1~12번 후보 초안은 해당 worktree `.tmp/m1-meta-review/01-first-half-candidate.json`에 보존. SHA256 `b1858bef96295c38e8be7243aecbbbb91027446a7c4624459f3aa725f418c17b`. 이번 정본 병합 후 바뀐 부모를 대조하고 Git에 저장한다.
- 전체 **44시험지 / 1,047문항**, 완료 **0시험지**. 첫 대상은 **2026 신흥중 중1 2학기 중간 / 24문항**.
- 원본 blob `c36139a90e9bcd378577ece8f891423bee6b0a19`, SHA256 `1bac8b9ef1d47f88ac66c69cf6c3299e708321d10cf84f073fca0c1a20bc4564`.

24문항의 발문·그림·해설 읽기를 반복할 필요는 없다. 저장된 근거를 사용하되 새 main의 부모 정본 및 실제 PT/TPL 연결과 다시 결속한다. 빈 메타 채우기 병행 작업과 겹치지 않게 문항별 담당·범위를 확인한다. 최신년도부터 한 시험지씩 최소 수정 → PR → main 병합 → 원격 SHA 확인 순서로 마감한다. 없는 유형에 임의 대체 키를 넣지 않는다. 완료 목록과 다음 학년·학기 인계도 진행표에 누적한다.
