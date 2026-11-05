# Main 병합 후 자동 메타 등록 — CURRENT v1

2026-11-05 사용자 결정. 원본/메타 핀포인트 수정 작업자는 표적 검증과 main 병합으로 마감한다. 등록 JSON 작성·파생 데이터 갱신·재시도를 작업자에게 다시 요구하지 않는다.

## 실행과 책임

`Archive Main Auto Metadata`가 main의 시험지 JS 변경을 받아 변경 ordinal/UID만 처리한다. 별도 inbox 작성 없이 소스에 **실제로 명시된** 메타와 최신 ACTIVE 정본을 확인하여 UID별 소형 요청·영수증을 자동 생성한다. 기존 공식 ACTIVE validator, runtime summary, native build, 실제 Consumer resolver, race-safe push helper를 재사용한다. 전체 시험지 재검수·무관한 UID 재분류·학생용 JS 쓰기는 하지 않는다.

등록은 `metadataRegistrationStatus=REGISTERED`, 근거는 `MAIN_MERGED_EXPLICIT_METADATA`로 기록한다. 이것은 독립 수학검수 또는 FINAL_QA/REVIEW2의 합성 승인이 아니다. 기존 의미 메타와 문제 내용이 같으면 기존 검토 출처를 보존한다. 실제 분류 또는 문제 내용이 바뀌면 이전 독립검수 상태를 새로운 값에 소급하지 않는다. 최신 source에 결속된 등록값은 기존 usable-meta Consumer 경로로 검증한다. 엄격 canonical QA 승인과 등록 성공은 별도다.

## 델타·누락·실패

- 기준은 `auto/state.json`의 마지막 처리 commit이며 이벤트 하나의 HEAD^가 아니다. 여러 병합/누락 이벤트를 누적 대조한다. UID/ordinal/문항번호/실제 fingerprint를 확인하고 재배치·불명확한 식별은 해당 UID만 후보완으로 분리한다.
- 소스에 없는 필드는 정상 sidecar를 지우지 않는다. 바뀐 필드만 새 소스 선언을 적용한다. 정확한 ACTIVE 과정/과목/단원/PT 바인딩, TPL 부모, CC/Condition 및 난이도 필드가 필요하다. 없는 키나 의미 근거를 발명하지 않는다.
- 등록 가능한 UID는 진행하고 불가능한 UID는 원인과 입력 서명을 pending에 기록한다. 같은 입력의 같은 의미 결함을 매시간 재검하지 않으며 소스·관련 메타·registry가 바뀌면 재시도한다. 신규 누락 메타의 내용 작성은 여전히 의미 검토 작업이며 빈값을 승인 처리하지 않는다.
- 동일 UID·source/메타·registry 판본은 동일 request ID다. 기존 요청 내용이 다르면 덮어쓰지 않는다. 영수증은 immutable, Consumer 검증 결과는 `last-verification.json`으로 분리한다.
- 원본/비대상 메타 보존, UID별 sidecar/runtime/Consumer 값 대조, 두 번째 실행의 중복 없음이 통과한 뒤 생성물·대기열·cursor를 **한 커밋**으로 저장한다. 검증 실패 시 부분 생성물과 cursor를 원격에 게시하지 않는다.
- reviewed 등록기와 같은 concurrency group을 사용한다. 다른 파생 writer가 main을 전진시키면 기존 helper로 최신 main에서 재생성·재검증 후 최대 3회 안전 push한다. 강제 push·보호 해제는 하지 않는다. 인프라 실패는 이슈/실행 증거를 남기고 시간별 catch-up이 마지막 영속 cursor부터 재시도한다.
- 봇 push에 downstream push 이벤트를 기대하지 않는다. 성공적인 새 저장 후 Pages workflow를 명시 dispatch한다. 배포 성공은 별도 결과이며 등록 성공으로 추정하지 않는다.

## 시범 및 운영 경계

초기 기준 main은 config에 고정하고 이미 병합된 동산중 2022 중3 q01 한 문항만 pilot target으로 지정한다. 같은 시험지 나머지 24문항과 장부 73건 전체를 소급 처리하지 않는다. 새 source 변경은 이후 정상 자동 처리한다. 실제 pilot 성공 증거는 Actions 로그·remote main·자동 영수증·Consumer 확인으로 남긴다.

메타 의미 판단 정본, 기존 canonical 정의, REVIEW2/FINAL_QA 독립 품질 게이트는 유지한다. 기존 수동 inbox와 META_V2 payload 경로도 유지하며 이 경로의 생성물은 해당 자동 writer 책임이다. 이 문서가 자동 등록 동작의 정본이고 다른 문서에는 포인터만 둔다.

## 롤백

`auto/config.json`의 `enabled`를 false로 바꾸면 신규 자동 적용을 멈춘다. 이미 등록한 원본 및 기존 검토 증거는 지우지 않는다. 오등록 수리는 해당 UID의 before/after 소형 요청으로 수행하고 공용 JSON 전체를 과거 판본으로 되돌리지 않는다. 최종 제출 전 dry-run에는 write가 없고 PR job은 읽기 권한만 갖는다.
