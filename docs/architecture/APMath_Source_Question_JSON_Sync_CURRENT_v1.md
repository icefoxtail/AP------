# AP수학 원본 문항 JSON 동기화

상태: 현재 구현 계약

## 역할과 경계

- 기존 문항 JS와 메타데이터 sidecar가 제작·검수·원본 보존의 authority다. `archive/tools/export-question-json.mjs`는 이 source를 그대로 담은 JSON envelope, `manifest.json`, `uid-index.json`을 만든다.
- `archive/tools/sync-question-json.mjs`는 exporter 결과의 source 분모, 파일별 SHA-256/바이트 수, 문항 배열·메타데이터 개수, UID occurrence references를 대조한다. 문항 본문을 정규화하거나 UID occurrence를 합치지 않는다.
- `outputs/apmath-question-json/`은 raw export 출력이고, `outputs/apmath-question-bank/`은 검증된 동기화 snapshot이다. 둘 다 저장소 밖의 작업 결과이며 Pages 배포물에 넣지 않는다.
- `sourceRevision`은 export가 실행된 Git HEAD 문맥이다. `sourceWorkingTreeStatus`와 파일별 현재 source SHA-256 및 HEAD blob SHA-1을 함께 읽어야 하며, `sourceRevision`만으로 모든 파일 바이트가 commit과 같다고 간주하지 않는다.
- `outputs/apmath-question-bank/current.json`은 활성 snapshot의 상대 경로와 content SHA-256을 가리킨다. snapshot 디렉터리는 immutable이며 source 추가·수정·삭제 반영은 새 snapshot을 만들고 pointer를 원자적으로 교체한다. 같은 내용의 재실행은 현재 pointer를 바꾸지 않는다. 활성 snapshot과 직전 정상 snapshot까지만 유지하며 이전 snapshot은 성공적인 pointer 교체 뒤에만 정리한다. 현재 pointer가 가리키는 snapshot은 정리 대상에서 제외한다.

## Occurrence와 상태

- 모든 source occurrence를 보존한다. 반복 UID는 `uid-index.json`의 refs 배열에 모두 남고, UID가 없는 occurrence는 `sourcePath#ordinal` key로 `unresolvedSourceKeys`에 보존한다.
- candidate/review/PASS/APPROVED/UNKNOWN Meta, metadata fingerprint, unresolved parent 상태는 source occurrence를 제외하거나 동기화를 막는 기준이 아니다. 그 상태는 envelope와 별도 annotation에 그대로 남는다. 문항을 명시적으로 비활성화·철회한 원본 기록도 exporter가 source에 있는 그대로 보존한다.
- Generated와 모든 `similar` occurrence를 원본 관계 annotation 조회 분모에 포함한다. 원본 연결은 sidecar 또는 문항에 기록된 source exam path와 sourceQid가 실제 원본 exam에서 단 하나의 occurrence로 확인될 때만 `LINKED` annotation을 만든다. 특히 유사문항은 파일명으로 원본을 추정하지 않는다. 증거가 빠졌거나 겹치면 `UNRESOLVED` 사유를 기록한다. 어느 상태도 문항 출제 가능 여부를 바꾸지 않는다.
- 원본 JSON은 기존 JS 객체와 sidecar의 완전한 파생 표현이다. 정답·해설을 포함하는 데이터는 기존 학생 접근 권한, Pages 경로, 정답 공개 경계를 변경하지 않는다.

## Snapshot과 실패 복구

1. Sync는 exporter를 저장소 밖의 임시 디렉터리에 실행한다.
2. manifest가 `COMPLETE`이고 모든 선언 source 파일, output SHA/크기, 총 source 분모·문항 수, UID별 refs와 unresolved source keys가 맞는지 검증한다.
3. parent relation annotations를 추가하고 전체 content hash로 불변 snapshot을 기록한다.
4. 모든 검증이 끝난 뒤 `current.json`을 원자적으로 교체한다. exporter, 검증, 복사 또는 pointer 교체가 실패하면 기존 pointer를 보존하고 status/evidence에 실패 원인과 last-good snapshot을 기록한다. Pointer 교체 뒤 status 파일 쓰기나 오래된 snapshot 정리가 실패하면 활성화 여부는 `activationCommitted`로 별도 기록하고, 활성화된 snapshot은 성공 상태와 경고로 보고한다.

고아로 남은 새 snapshot은 `current.json`이 가리키지 않는 한 활성 데이터가 아니다. 24시간 이내의 `.pending-*` snapshot은 다른 실행이 만들고 있을 수 있어 보존하고 경고로 남긴다. 24시간이 지난 pending snapshot만 age check 뒤 정리 대상이 된다.

## 출고 연결

기존 main Pages release의 source materialization과 기존 출고 검증 뒤에 별도 JSON sync 단계를 실행한다. 해당 단계는 Pages artifact 경로 밖으로 결과를 저장하고, run evidence에 JSON sync 상태와 로그를 남긴다. 성공 snapshot은 Actions cache에 저장하고 해당 run의 Actions artifact로도 보관해 다음 실행에서 last-good를 복구한다. 이전 cache가 없으면 남아 있는 마지막 성공 artifact를 찾아 복구한다. 두 복구 경로 모두 없으면 exporter 실패 status에 `lastGoodAvailable: false`를 기록한다.

Actions cache와 artifact는 Pages 사이트에 배포되지 않지만 GitHub 저장소 접근 권한의 적용을 받는다. 이들은 공개 저장소에서 비공개 저장소처럼 취급하지 않는다. JSON sync 오류는 기존 출고 검증 결과를 덮지 않고 신규 student selection gate로 추가하지 않는다. JSON status job은 오류를 별도로 표시하지만 Pages deploy job은 기존 `build` 성공만 의존하므로 JSON 실패가 기존 사이트 배포를 막지 않는다. 기존 Pages build 또는 실제 배포의 실패는 기존 workflow 조건대로 실패로 남는다.
