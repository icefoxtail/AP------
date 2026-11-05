# 기존 4slot의 main 병합 후 자동 등록 — CURRENT v1

2026-11-05 사용자 승인. **4slot 작성·검수는 진행 중인 별도 라인의 작업을 그대로 사용한다. 다시 작성하거나 PT/TPL에서 추정하지 않는다.**

## 입력과 자동 처리

입력 정본은 `archive/data/item-4slot/**/*.4slot.json`의 기존 `archive-meta-4slot-compact-v1`이다. 별도 inbox 제출 없이 main 병합, 원본/사전 변경, 시간별 누락 복구 때 `Archive Main Auto Metadata`의 4slot 단계가 처리한다. 기존 의미 메타 단계가 실패해도 4slot 단계는 독립 실행한다.

`tools/4slot/build-4slot-runtime.cjs`가 compact 값·사전·검토/근거 참조를 읽고, 실제 source의 문항번호를 배열 순번으로 변환하여 `question_identity_map.json`의 기존 UID에 결속한다. UID를 새로 발명하지 않는다. 사전의 given/goal/method/condition 용어 번호, format, candidates, reviewedBy, evidence를 보존한다. 실제 문항을 다시 읽고 분류하는 AI 호출은 없다.

출력은 `archive/data/item-4slot-index.json`과 `.archive-meta-register/auto/4slot/`의 기계 검증 영수증이다. source JS, compact 원본, 작성 브랜치, 정답/해설, 기존 의미 메타 승인에는 쓰지 않는다. `archive/item-4slot.js`는 UID 조회와 슬롯별 용어 검색 API다. 기존 검색 화면·출제 자격을 바꾸지 않는다. 인덱스와 API 제공은 새 검색 UI나 유사도 품질 검수 완료를 뜻하지 않는다.

## 보존·변경·실패

- source blob가 달라도 실제 학생 필드가 같으면 기존 4slot을 재사용한다. 실제 발문·보기·정답·해설·시각 참조가 바뀐 문항만 `STALE_STUDENT_PAYLOAD`로 분리한다. 원본을 되돌리거나 새 해설의 method를 추정하지 않는다.
- 과거 blob를 확보할 수 없고 유효한 저장 baseline도 없으면 `SOURCE_BASELINE_UNAVAILABLE`다. 최신 SHA로 숫자만 바꾸어 통과시키지 않는다.
- 로컬 에셋은 첫 등록 이후 바이트 변경을 감시한다. 원격 R2·시각 품질 검수나 최초 에셋의 과거 판본 검증을 했다고 표시하지 않는다.
- 기존 검수자·표본·근거를 그대로 참조하며 자동 실행을 독립 수학검수로 기록하지 않는다. 사전에 없는 후보는 candidates로 보존하며 임의 번호를 만들지 않는다.
- 문항별 오류는 pending 목록에 남기고 해당 문항만 활성 인덱스에서 제외한다. 정상 문항은 계속 등록한다. `PASS_WITH_SUPPLEMENTS`는 등록된 부분의 기계 검증 성공이고 전체 의미 품질 PASS가 아니다. 4slot 누락/STALE 때문에 학생 문제 접근을 막지 않는다.
- 동일 입력은 바이트 단위 동일 출력이다. 누락·신규·삭제 compact를 매번 직접 목록에서 확인하므로 이벤트 누락 후에도 복구한다. 변경 없는 파일은 재분류하지 않는다. 검증 단계는 캐시를 무조건 신뢰하지 않고 입력으로 재계산한다.
- 파생 인덱스·검증 영수증은 같은 원격 커밋에 저장한다. main 경합 시 기존 non-force push helper가 최신 main에서 다시 만들고 검증한다. 같은 index SHA의 영수증은 덮어쓰지 않는다.

## 운영 경계와 롤백

기존 작성 브랜치 `work/4slot-annotate-v1`의 대량 evidence는 그대로 둔다. 본 단계는 **검수 후 main에 들어온 compact를 자동 등록**하는 단계이지, 미검수 작업 브랜치를 통째로 승인·병합하는 단계가 아니다. 기존 import 도구/검수 절차는 변경하지 않는다.

등록된 인덱스는 배포 명세에서 허용된 경우 읽기 전용 Consumer로 게시한다. 원시 증거·작성 브랜치 전체를 학생 패키지에 넣지 않는다. UI 연결은 별도 확인 범위다.

중단은 `.archive-meta-register/auto/config.json`의 `fourSlotEnabled:false`다. 기존 작성물·등록 결과를 삭제하지 않는다. 수정은 원래 compact의 해당 문항만 고쳐 main에 병합하면 다시 자동 처리한다.
