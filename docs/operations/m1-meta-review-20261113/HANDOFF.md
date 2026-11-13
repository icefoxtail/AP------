# 중1 기존 시험지 메타 전수 검토 인계

## 현재 상태

**운영 완료 3/44장 · 읽기 및 운영 마감 71/1,047문항 · 남은 41장.** 다음은 **04. 2025 동산중 중1 2학기 기말 24문항**이며 아직 읽기나 수정에 착수하지 않았다.

- 저장소: https://github.com/icefoxtail/AP------
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`; owner: `GPT_ROOT_933015CD0A4F`; instructionRevision: `2`.
- 담당 branch: `review/m1-existing-meta-20261113`.
- 최신 실제 등록 main: `bf35b7e13417b033ee167117d567a9f0262712d6`, tree `31bb7763bb56018167279ad094dd787989129f75`.
- 마감 문서 작성 직전 원격 체크포인트: `9cb4da0e188c6d86df57f7d481792de256bf5e6f`, tree `4e233b44378e8fd9270a4bcd79e7cd70df567159`. 이 마감 문서의 최종 게시 head/tree는 원격 branch와 후속 AWCR에서 확인한다.
- 최신 실제 raw 검증 AWCR **r25**: file `1TkwXt4gNdT8OOoZkkm_0Xkjnh7Clhl_V`, raw SHA256 `2ee49e31a74b94a0a59009e92decba963902950f879a2faa09fcef58cef47d2d`. **r26**에는 팔마 운영 마감과 정확한 마감 게시 head 및 동산 nextAction을 기록한다. 이전 revision을 덮어쓰지 않는다.
- 완료표와 전체 큐는 [README.md](README.md), 실행 원장은 [progress.json](progress.json)이다. 큐는 연도 내림차순 → 학기 내림차순 → 기말 먼저 → 학교명 순서다.

## 이번에 마감한 팔마중 24문항

[PR1969](https://github.com/icefoxtail/AP------/pull/1969)의 head `e5860a968cc65f4e8817dc8492c14959f8d9b7d1`에서 필수 CI 4 workflow·6 job을 모두 확인한 뒤 merge `e25ceabf2c977b667d2b7a3740ab8ef50670f781`에 병합했다. 공식 writer [43493276504](https://github.com/icefoxtail/AP------/actions/runs/43493276504), register job132119704696은 실제 main `bf35b7e1…`에 PUSHED attempts1로 등록했다.

- [운영 마감](03-palma-operational-closeout.json) raw `c24ab0c96a956604c11aa2b0c6db5869d71afd2a6e155666d8cb9006b995b6e3`.
- [실제 writer·영수증·최종 Consumer](03-palma-pr1969-main-writer-final.json) raw `110af27f8326ce3f8715a57c5ae5d53c6f61c6030c18626ca7ea04cd930c44d8`.
- [실제 main 보호 비교](03-palma-main-bf35-minimal-protection.json) raw `bbbce5f85c1638ccc4642391e7960e3fb8276928f78727860b0063a2e65a183d`.
- [실제 main의 동일 RPM 입력 확인](03-palma-main-bf35-rpm-parent-reuse.json) raw `5a390fc76a40013ea022ac96714d98df24afe18e20a3b6dfbe5e10790185180d`.
- [의미 원장](03-palma-semantic-review.json) raw `0621f824a750a0067d378c29387a407f919c9d690875c0c857b620818e10af18`.

전체 발문·선지·제공 풀이24와 실제 그림37을 읽었다. 메타24문항 중 native 분류14문항을 수정했다. 정확한 RPM leaf19개와 debt5개(Q6·Q8·Q12·Q13·Q14)를 구분했다. 작도·합동 parent-only3개, Q6/Q8의 LEGACY_PARENT_AMBIGUOUS를 명시했고 잘못된 leaf로 대체하지 않았다. 기존 crosswalk260을 보존하며 정확한 DIRECT13개만 추가했다. PT1·TPL3·binding3은 공식 writer가 적용했다.

실제 영수증의 metadata24·identity24·runtime24·정본7과 최종 post-AutoMeta Consumer changed/checked/passed24/24/24, 실패·미관측·solverOnly·assignmentPending0을 확인했다. 영수증 raw `174a337a8e6aaca46c897c7d3fbbc6bccbc0c30072b81a2e9781373aaa4c1fdd`, 승인 참조8개가 모두 실제 Git과 일치한다. Identity24는 적용 요청 수이며, 기준 대비 실제 fingerprint 변경은 Q1/Q3/Q4/Q10의4개다.

정상 문제·정답·해설·그림37·UID·배점·난이도·source reviewStatus를 보존했다. 실제 main의 핵심23파일이 격리 PASS와 같아 대상 밖 metadata/identity/runtime 및 완료47문항 보호 결과를 재사용했다. Canonical input manifest와141개 resource, 관련 runtime/loader9개도 같아 24문항의 부모 대조를 다시 실행하지 않았다. 실제 main의 최종 Consumer24는 공식 writer가 새로 확인했다.

Source raw `1fa5adbc46ef6180400a4666c4328bb2d2b6655d059e660291ccf550803332c7`, blob `2b8411c03707eaa39fdf0159e3de448d459da181`. 요청 `m1-palma-2026-mid-meta-review-20261113`의 raw는 `c59a32637f1fc578152a94297844500f4b4ca65b891757830aaf3264b2feb5f5`, canonical SHA는 `7eabd34d965a39395f9121a14f037c70deb4f69ec9910d14fd647c73695cb0d4`다. 요청은 실제 main에서 소비됐으므로 inbox에 다시 넣지 않는다. 필요한 경우 head `e5860a9…`의 원래 경로나 writer artifact의 archived request에서 읽는다.

수학 FINAL QA나 실제 Pages 배포를 확인했다고 주장하지 않는다. 전역 REGISTRATION_PARTIAL은 optional semantic lane의 후속 상태이며 팔마 요청의 실패가 아니다. Shared Meta의 기존 고1 진단 오류와 M2/M3 자료 부족15개는 [CI 증거](03-palma-pr1969-ci.json)에 별도로 기록했다.

## 이미 완료한 작업 — 반복하지 말 것

- RPM 6권의 2022 L1/L2 정리: [PR1958](https://github.com/icefoxtail/AP------/pull/1958), branch `fix/rpm-middle-l1-l2-20261113`, head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`. 대단원24·중단원54, 기존326leaf 보존과 부모9개 정정.
- 신흥중24: [PR1964](https://github.com/icefoxtail/AP------/pull/1964), [첫 마감](01-shinheung-operational-closeout.json). 다른 owner의 후속 [PR1967](https://github.com/icefoxtail/AP------/pull/1967) 이후 현재 source raw는 `2f1ab79eba940498b5c575ad1509a038b3f2dabd390823177635d83937fe4b56`이다. 그 최신 상태를 왕운·팔마 등록 후에도 보존했다.
- 왕운중23: [PR1968](https://github.com/icefoxtail/AP------/pull/1968), actual main `738af248bd62813a572ac81725892b3f12ee2beb`, [마감](02-wangun-operational-closeout.json). 의미 원장은 sourceOrdinal/UID가 바로잡힌 [revision3](02-wangun-semantic-review-rev3.json)만 사용한다.
- 과정명 한 필드 교정: [PR1966](https://github.com/icefoxtail/AP------/pull/1966), actual main51cf·Consumer1/1·기존runtime613 보존으로 마감했다.

## 다음 실행 절차

1. 연결된 Notion의 최신 라우터 → Archive 시작 페이지 → 생명주기 → 해당 메타 정본 포인터를 읽는다. 현재 포인터는 [라우터 기록](notion-current-metadata-route-refresh-20261113.json)에 있다. 마지막 라우터 ID는 `3e10e68b-d69f-81f1-9397-e7cd1c8d3cfd`, 시작은 `3e10e68b-d69f-8189-8cc8-fb85cb4b1398`, 생명주기는 `3e10e68b-d69f-81fd-b161-ffc3f6227b6e`다. 실제 내용과 정본은 최신 Git에서 확인한다.
2. 최신 원격 main·담당 branch·AWCR의 정확한 현재 task 및 병행 PR/UID 범위를 확인한다. [팔마 진입 시 범위](03-palma-concurrent-work-check.json)는 당시 기록이다. PR1405의 2023~2025 기말 sidecar, PR1751의 빈 메타 요청과 동산의 실제 UID 겹침을 다시 확인한다. PR1959는 향림2024 source/그림 변경이므로 그 차례에서 재확인한다. 알려진 다른 owner task를 임의 인수하지 않는다.
3. 동산24의 sourceOrdinal과 questionUid를 명시적으로 결속한다. 배열 위치를 문항 번호로 쓰지 않는다. 메타가 있거나 과거 PASS여도 모든 발문·선지·그림·제공 풀이를 읽는다. 서브에이전트를 쓰면 실제 읽기 근거와 figure hash를 확인한다.
4. 현재 native 정본, 잠긴 RPM master, crosswalk, 2022 부모 정본 및 실제 Archive 2.0 resolver를 대조한다. 정확한 기존 분류는 유지하고 명백한 오분류만 수정한다. 정본에 세부 유형이 없으면 근거 누락을 기록하며 임의 대체하지 않는다. 오래된 교육과정 source를 일괄 2022로 바꾸지 않는다.
5. 같은 입력의 증거는 재사용한다. 필요한 정본 추가는 공식 reviewed-exam v2 요청을 통해 적용한다. Native/compiled/metadata/runtime 생성물을 직접 게시하지 않는다. `checkpoint-tools/build-reviewed-exam-v2-request.mjs`, `extract-reviewed-exam-projections.py`, `audit-actual-rpm-parents.mjs`를 사용한다. 원본 source before와 metadata before의 null/빈 문자열은 구분한다.
6. 한 시험지의 PR → 정확한 head CI → main 병합 → 실제 요청별 영수증 → 최종 post-AutoMeta Consumer → 실제 원격 SHA·직접 영향 확인을 끝낸 뒤 다음 시험지로 이동한다. 전역 workflow SUCCESS만으로 요청 REGISTERED를 추정하지 않는다. 전체 R1/R2/R3는 실행하지 않는다.
7. 완료표·인계·검증 근거를 담당 branch에 저장하고 원격 raw/blob/tree를 재읽는다. 새 AWCR revision에는 안전한 상태·참조·SHA·남은 일·nextAction만 저장하고 실제 raw를 재읽는다. 원문 프롬프트·정답/해설·credentials·upstream raw 출력은 공유하지 않는다.

최신 main을 담당 branch에 반영할 때는 다른 owner 변경을 보존한다. 현재 마감 체크포인트는 부모 `9cb4da0e…`와 실제 main `bf35b7e1…`를 합치며, main에서 가져오는 운영 파일은 그 Git blob과 같음을 확인한다. API 게시에는 `checkpoint-tools/prepare-staged-checkpoint-packet.py`를 사용하고 expected_sha lease·원격 재읽기를 유지한다.

## 복사용 인계 프롬프트

> AP------ 중1 기존 시험지 메타 전수 검토를 이어 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. 연결된 Notion 라우터/시작/생명주기, 정확한 현재 AWCR r25 이후, 최신 Git main과 branch의 docs/operations/m1-meta-review-20261113/HANDOFF.md·progress.json을 먼저 확인하세요. RPM6권 L1/L2와 신흥24·왕운23·팔마24는 운영 완료했으므로 반복하지 마세요. 팔마 PR1969·actual main bf35b7e13417b033ee167117d567a9f0262712d6·등록24/정본7·최종Consumer24/24·대상밖보존을 검증했습니다. 현재3/44장·71문항 완료, 남은41장입니다. 다음은4번2025동산중중1 2학기기말24문항이며 아직 시작하지 않았습니다. 병행 빈 메타 작업의 실제 UID 겹침을 확인한 뒤 모든 발문·그림·제공 풀이를 읽고, native와 실제RPM/Archive부모를 의미 기준으로 최소 정정하세요. 한 시험지씩 PR→main→실제등록·최종Consumer·원격SHA→완료표·branch/AWCR 체크포인트를 마감하며44장 끝까지 이어갑니다. 전체R1/R2/R3와 같은 입력의 검증을 반복하지 말고 정상 데이터와 source reviewStatus를 보존하세요.

중1 전체를 마감하면 이 원장에 전체 종료와 남은 taxonomy debt를 기록하고, 같은 6권 L1/L2 정본·학년/학기별 큐 및 한 시험지 단위 마감 방식을 다음 학년·학기로 넘긴다. 아직 검토하지 않은 학년이나 시험지를 완료로 표시하지 않는다.
