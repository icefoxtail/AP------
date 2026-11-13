# 다음 작업자 인계 — RPM 부모 정비 완료 / 중1 시험지 재개

## 현재 목표

중1 기존 시험지 전체 44장·1,047문항을 2026년부터 내림차순으로, 한 장의 모든 문항 의미를 읽고 메타 오분류만 최소 수정한다. 한 시험지씩 PR→main→원격 SHA 후 다음으로 간다. 빈 메타 병행 작업과 중복하지 않고, 정상 문제·정답·해설·이미지를 보존한다. R1/R2/R3 전체 재실행은 하지 않는다. 사용자에게 추가 승인을 반복 요청하지 않는다.

## 완료

RPM 중1-1~중3-2 현행 부모 정본 24 L1 / 54 L2와 실제 Archive 선택 연결을 완료했다. 기존 155 L3/326 leaf 부모 대조 및9leaf 정정,13개 모호 키 임의배정 방지,2015/기존 저장경로 보존을 검증했다.

- PR: https://github.com/icefoxtail/AP------/pull/1958
- 실제 main: `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`
- tree: `cc07dc4b5b7c886cde7fdfb670dfc65d4c9c98df`
- authority SHA256: `6128cf2c8c863f132d6c9d8b51804aff9ba636ce5cdbaf99f41217962aec40ab`
- 최종5workflow PASS; runtime247/247; 실제 Chrome PC/모바일·선택풀·URL 복원 PASS. 중2/중3 일부 현재 부모의 실제 자료0건은 데이터 공백으로 기록했다. 배포 완료 여부는 이 기록에서 주장하지 않는다.
- 정본 설명: `docs/rules/01_CANONICAL/taxonomy/rpm-middle-2022/RPM_MIDDLE_2022_PARENTS.md`
- 부모 감사3종·CI/병합 영수증은 이 폴더에 있다.

## 아직 미완료

**시험지 완료는 0/44**다. 첫 시험지는 **2026 신흥중 중1 2학기 중간24문항**이다. 발문·그림·해설을 전부 읽은 근거는 이미 보존되어 있으므로 같은 바이트를 처음부터 다시 읽지 않는다. 기존 PT/TPL 및 RPM 연결에 명확한 오분류·정본 연결 공백이 있어, 후보를 검토 완료나 운영 적용으로 승격하지 않는다.

- 작업 브랜치: `review/m1-existing-meta-20261113`
- 원격 체크포인트: `92e0256664eba86eed13cdf32060a3e3e1d73a3e`
- 원장: `docs/operations/m1-meta-review-20261113/progress.json`
- 읽기: `01-shinheung-semantic-read-checkpoint.json`
- 후보: `01-shinheung-first-half-candidate.json` 및 `01-shinheung-candidate-comparison.json`
- 첫 시험지 source blob: `c36139a90e9bcd378577ece8f891423bee6b0a19`
- source SHA256: `1bac8b9ef1d47f88ac66c69cf6c3299e708321d10cf84f073fca0c1a20bc4564`

## 다음 실행 순서

1. 연결 Notion의 필독 라우터/Archive 시작·생명주기를 확인하고, 기존 역할 진입과 최신 Git main을 확인한다. 현재 명시 지시가 내부 기본값보다 우선한다.
2. 시험지 브랜치를 현재 main에 결합하고 진행표 첫 시험지에서 이어간다. 위 source SHA가 같으면 기존 읽기 근거를 재사용한다.
3. 24문항의 의미 판정을 현재 canonical PT/TPL, binding, crosswalk, 공식 Resolver에 결속한다. 없는 리프를 잘못된 리프로 대체하지 않는다. 실제 부족한 항목만 EVIDENCE_DEBT와 후속 조치로 기록한다.
4. 허용된 공식 registryChanges/시험지별 요청으로 명백한 오분류를 최소 수정한다. 대형 question_metadata/catalog/runtime 수동 수정은 하지 않는다. 기존 승인 여부와 무관하게 메타 의미를 확인하되 기존 본문 검수는 반복하지 않는다.
5. 수정/직접 영향만 검증한 뒤 첫 시험지 PR/main/원격 SHA, 완료표와 다음 대상, AWCR append-only revision을 남긴다.

## AWCR 연결

정확한 taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner `GPT_ROOT_933015CD0A4F`, instructionRevision2. 최신검증 r6는 file `1mYrP0EJOjIZDERuBbS9vFLg0wrYGXWPb`, raw SHA256 `3fb629180d9754d50533a2eda58db65f9fd6b03f5843757b55a255d95f8c70ae`다. 전체 task는 IN_PROGRESS이며 원문 질문·정답·해설·hidden reasoning을 AWCR에 넣지 않는다.
