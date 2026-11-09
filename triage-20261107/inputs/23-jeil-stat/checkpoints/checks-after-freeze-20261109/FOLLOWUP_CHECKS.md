# Q15·Q19 후속 입력 검사 보존

기존 스냅샷·STATUS·입력은 수정하지 않고 이후의 실제 검사 결과만 추가한다.

- 기준 원격 커밋: c1ad026624192540d07d58e202fc35bbb9bb75c8
- 후속 실행: corrected-two / 2026-11-09T02-16-29-889Z
- Q15·Q19 모두 실제 expandNumberLineFigure와 적용 가능한 입력·출처·스냅샷 결속 검사 PASS. 후보 실패·harness 문제 0.
- 검사된 두 문항 6개 JSON은 앞서 저장한 c1ad0266의 실제 입력 바이트와 같다. 전체 9문항 27개 JSON도 검사 기록 SHA-256 → 동결본 SHA-256 → 원격 Git blob SHA-1 연결이 모두 일치한다.
- 따라서 Q15·Q19의 이전 재검 NOT_RUN은 당시 기록으로 보존하고, 동일 입력에 대한 최신 입력 검사 상태는 PASS로 읽는다. 전체 9문항의 적용 가능한 입력 검사 통과이며 시험지 최종 완료 판정은 아니다.

## 확인 파일

- [INPUT_CHECK_READBACK.json](INPUT_CHECK_READBACK.json): 원본 후속 검사 요약. SHA-256 151278448f0368f3e5939bac8c143df35d90adf551244eec096459e0d3e134db.
- [EVIDENCE_MANIFEST.json](EVIDENCE_MANIFEST.json): 원본 근거 목록. SHA-256 83cdc9cff21cf2c26e4983ca2f0eb2f80016086b02c6af8128558148269368e4.
- [REMOTE_INPUT_BINDINGS.json](REMOTE_INPUT_BINDINGS.json): 브랜치 경로·SHA-256·Git blob SHA를 연결한 확인표.

원본 근거 37파일과 readback의 크기·SHA-256도 모두 대조했다. manifest에 열거된 원시 로그·과거 파일 전체를 이 커밋에 복사하지는 않는다. 이번 커밋에는 위 두 원본 요약, 원격 바이트 결속표, 이 설명만 추가한다.

## 유지하는 제한

Q11 CONTENT 주의는 해결되지 않았다. 공집합이 아닌 사건도 확률 0일 수 있어 조건부확률이 정의되지 않을 가능성이 남는다.

렌더·engine.prepare/build·시각 검수·독립 전체 수학 검토·CI 실행·게시·구현자 인계·main 병합은 NOT_RUN이다. 기존 SVG·PNG·원문·다른 작업과 이전 스냅샷·STATUS는 그대로다. DRAFT_ONLY / NOT_READY를 유지한다.
