# RPM 중등 2022 L1/L2 정리 — 운영 체크포인트

## 현재 상태와 권한

- 사용자 우선순위: 중1 시험지 검토에 앞서 RPM 중학 1-1~3-2의 L1/L2와 실제 선택 연결을 정리한다.
- 작업자: `GPT_ROOT_933015CD0A4F`; AWCR taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, instructionRevision `2`.
- 브랜치: `fix/rpm-middle-l1-l2-20261113`; PR: https://github.com/icefoxtail/AP------/pull/1958
- 시작 main: `a6708a849faca7ccfd438937138d7e88bd5ee23c`; 최근 확인 main: `2b90b85dd848806ba62f844b85225db8bcae5ee3` (별도 G7 PR #1955 병합, 이 작업과 파일 겹침 없음).
- 상태: **MAIN_DONE — PR #1958 병합 후 원격 main SHA·tree·정본/helper 바이트 검증 완료.**
- 직전 원격 체크포인트: `71137cfe8d6b0caba3926fce98ad28e53e80bdbf`, tree `5c092f6731d79fb4af26d6092cf6704de53c2a2c`.
- AWCR r4: Drive `1OPzyBkhimVFPj_vooQtMzpsDqVLqPib0`, raw SHA256 `c518a83ceb80141ebbce7d7577f458319593221292703db226c76fd40c875d08` (raw 재조회 검증).

최신 상태는 `progress.json`, 원격 브랜치 HEAD, PR의 실제 검사 결과를 함께 확인한다. 오래된 PASS나 문서의 대기 상태만으로 운영 완료를 추정하지 않는다. 사용자는 이 범위의 PR/main 병합 및 연속 진행을 이미 승인했다.

## 운영병합 완료

- main: `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`; tree: `cc07dc4b5b7c886cde7fdfb670dfc65d4c9c98df`.
- 검사된 PR HEAD: `9a29f38c36a3a8531dbd9fe25a7cbe32c1899788`; 5개 workflow 모두 성공.
- 최종 runtime 247/247, 실제 Chrome의 PC/모바일·정확 UID풀·새 문서/뒤로가기 복원 및 기존 50문항 출력 통과. root가 스크린샷 5개를 직접 확인.
- 새 중2/중3 부모 8개에 연결된 현행 자료가 없는 점은 별도 데이터 공백이다. 기존 2015를 2022로 바꾸지 않았다.
- 세부 영수증: `ci-and-merge-receipt.json`; 복사용 재개 지시: `HANDOFF.md`.
- AWCR r6: `1mYrP0EJOjIZDERuBbS9vFLg0wrYGXWPb`, raw SHA `3fb629180d9754d50533a2eda58db65f9fd6b03f5843757b55a255d95f8c70ae`, 원격 readback 검증.

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

위 대기/실패 항목은 이전 시도 이력이다. 최종 게시 tree의 CI와 실제 Chrome 검증은 완료했고, 원격 main 병합 결과는 상단 운영병합 완료 절 및 영수증이 소유한다. R1/R2/R3 전체 시험지 검증은 재실행하지 않는다.

## 다음 실행

RPM 부모 정비는 완료했다. 추가 목차 검사를 반복하지 않는다. 다음은 중1 첫 시험지의 기존 24문항 읽기 근거를 재사용한 의미 분류/연결 수리다. 시험지별 PR/main·원격 SHA, 진행표와 AWCR를 이어간다.

## 중1 시험지 작업 재개점

- 브랜치: `review/m1-existing-meta-20261113`
- 원격 안전 체크포인트: `92e0256664eba86eed13cdf32060a3e3e1d73a3e`, tree `28e44eb7217061d5ed2abbf5169933880ee69d26`.
- 진행표: `docs/operations/m1-meta-review-20261113/progress.json`
- 읽기 근거: 같은 폴더 `01-shinheung-semantic-read-checkpoint.json`
- 13~24번 후보 대조: `01-shinheung-candidate-comparison.json`, SHA256 `c887310c2501c3d70a010315a7fda02c73a6964ba45b70c3aa106a99c4a62ce9`.
- 1~12번 후보는 해당 브랜치 `docs/operations/m1-meta-review-20261113/01-shinheung-first-half-candidate.json`에 보존. SHA256 `60b32054eb8d0ba90fc6a37af29364e8685e7b30c4ee5b6a4a7aff1f01259218`. 병합된 정본과 같은 authority 바이트에 결속되어 있다.
- 전체 **44시험지 / 1,047문항**, 완료 **0시험지**. 첫 대상은 **2026 신흥중 중1 2학기 중간 / 24문항**.
- 원본 blob `c36139a90e9bcd378577ece8f891423bee6b0a19`, SHA256 `1bac8b9ef1d47f88ac66c69cf6c3299e708321d10cf84f073fca0c1a20bc4564`.

24문항의 발문·그림·해설 읽기를 반복할 필요는 없다. 저장된 근거를 사용하되 새 main의 부모 정본 및 실제 PT/TPL 연결과 다시 결속한다. 빈 메타 채우기 병행 작업과 겹치지 않게 문항별 담당·범위를 확인한다. 최신년도부터 한 시험지씩 최소 수정 → PR → main 병합 → 원격 SHA 확인 순서로 마감한다. 없는 유형에 임의 대체 키를 넣지 않는다. 완료 목록과 다음 학년·학기 인계도 진행표에 누적한다.
