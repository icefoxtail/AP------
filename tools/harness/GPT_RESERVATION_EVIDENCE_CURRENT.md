# GPT 예약 하네스 증거 계약 v1 — GPT BOOK 5레인 전용

**적용:** GPT BOOK COURIER/MATH_META/VISUAL/RELEASE/ALL_MASTER. Gemini 6단계 및 원본 Drive, 기존 HIGH/기출 예약은 대상 외.
**현재 운영:** 사용자 지시로 모든 GPT 예약은 OFF. 검증기 병합/문서 저장은 재가동 승인이 아니다. 임의 ON 금지.

기존 Library `/문제은행/GPT_교재유사문항_최종검수/00_CONTROL/00_ROUTER_CURRENT.md`가 작업 지시의 정본이다. 이 문서는 각 단계의 **실행 주장과 증거를 분리하는 부가 규칙**이며, 본업·품질 검수·실제 인계·Git 병합 기준을 대체하지 않는다.

## 작업별 실제 증거

- **COURIER:** 정확한 Drive 원본의 실제 바이트 SHA와 Library 복사본의 다시 내려받은 SHA 일치, `00_ASSIGNMENT.json`의 batch/revision/source ID. 구 404나 파일명 검색만으로 NO_INPUT 금지.
- **MATH_META:** `11_MATH_META_RECEIPT.json`의 입력/출력 file ID·SHA를 실제 다운로드로 대조하고 기존 수학 QA 증거 재사용.
- **VISUAL:** `21_VISUAL_RECEIPT.json`의 입력 ID/SHA가 직전 MATH 영수증 출력과 일치해야 한다. 실제 입력·출력 bytes의 SHA를 검증하고 기존 SVG QA를 반복하지 않는다.
- **RELEASE:** 기존 RELEASE 영수증과 별개로 GitHub PR merged, 원격 main HEAD/대상 blob를 실제 조회해야 MAIN_DONE을 증명할 수 있다. PR 생성만으로 완료 선언 금지.
- **ALL_MASTER:** stage별 막힘을 직접 복구하되 동시 writer 점유·정확한 원본 ID·직전 출력 SHA 확인. `ROUTED`는 `QUALITY_PASS`가 아니다.

## 판정 및 저장

각 회차는 기존 stage receipt/AWCR를 우선 재사용한다. 추가 증거를 남길 때는 동일 batch/revision/stage/inputSHA/outputSHA별로 짧은 append-only Library `00_CONTROL/00_HARNESS_AUDIT_<timestamp>.json`을 저장하고 실제 file ID/readback을 남긴다. 필수 필드: batchId,revision,stage,receiptFileId,inputFileId,inputSha,outputFileId,outputSha,providerReadback,verdict,firstMissingStep,nextAction,observedAt. 없거나 조회할 수 없는 필드는 `UNKNOWN`이지 PASS가 아니다. `FAIL`은 실제 불일치가 확인된 경우다. 자기 보고 SHA와 자기 보고 remoteReadbackSha가 동일한 것만으로 remote attestation을 선언하지 않는다.

하네스 결함으로 정상 예약본업·다른 배치를 멈추지 말고, 발견한 대상의 증거 부족만 구분하고 기존 OWNER/ALL_MASTER에 핀포인트 복구를 맡긴다. AI 내부 Skill 주입 여부는 일반 예약 채팅에서 확인 불가능하면 `UNKNOWN`이다.

로컬 바이트 검증기: `node tools/harness/verify-gpt-reservation.mjs --stage MATH_META --receipt <receipt.json> --input <input.json> --output <output.json>`.
테스트: `node --test tools/harness/verify-gpt-reservation.test.mjs`.
로컬 `BYTE_EVIDENCE_PASS`는 **해당 바이트 검사만** 통과한 것이며 원격 제공자 인증, 수학 품질, Git main 승인 아님.
