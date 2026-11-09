# 23 제일고 고2 확률과통계 OPEN 입력 중간 보존

상태: CHECKPOINT / DRAFT_ONLY / NOT_READY. 다른 PC에서 같은 바이트와 검사 상태를 확인할 수 있도록 동결본만 저장했다. 시험지 완료·공식 렌더·게시·구현자 인계를 뜻하지 않는다.

- 브랜치: codex/svg-triage-20261107
- 부모 커밋: 3b313e686d6a48305ca0333ffbb1f34ce22c5ef3
- 원문: archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js
- 원문 기준 main: 7563515ad7ea796f7c9f26881afe7f8f267f1ddf
- 원문 blob: 7ed637a7cb8f81e06b1fddd59e348be822e5e924

## 저장한 두 동결본

1. [OPEN 8문항 상태](checkpoints/open-eight-20261109/CHECKPOINT_STATUS.json): Q01·09·10·11·15·18·22·23, 입력·STATUS 32파일.
   - [원본 스냅샷 manifest](checkpoints/open-eight-20261109/SNAPSHOT_MANIFEST.json) SHA-256: 7e9728802eae35dc73bb89c58749fd5631bfb2ab137d08b70ef4a7fefb3b15f4
2. [Q19 정정본 상태](checkpoints/q19-corrected-20261109/CHECKPOINT_STATUS.json): Q19 입력·STATUS 4파일.
   - [원본 스냅샷 manifest](checkpoints/q19-corrected-20261109/SNAPSHOT_MANIFEST.json) SHA-256: 9de9eaf5825f1804226e1e0dd8606e762ebc8141aa28cb4a42fecdb9e7ee4143

입력 36파일의 브랜치 위치는 각 manifest의 remotePath를 따른다: root-inputs/qNN/. 동결본 2개의 manifest·CHECKPOINT_STATUS도 원본 바이트 그대로 저장했다. 원시 실행 로그는 이번 커밋에 넣지 않는다.

## 정확한 검사 상태

- Q01·09·10·11·18·22·23: 동결 입력에 결속된 해당 입력 함수 검사 PASS, 총 7문항. 전체 수학·시각 검수 또는 렌더 PASS가 아니다.
- Q15: NUMBER_LINE_ROW_LABEL_INVALID 이후 n=81, n=225 라벨로 정정한 초안. **현재 수정본 재검사 NOT_RUN**.
- Q19: NUMBER_LINE_POINTS_INVALID 이후 지원되는 소문자 기호 ID 및 참조를 정정한 초안. **현재 수정본 재검사 NOT_RUN**.
- Q11: **CONTENT 주의 유지**. 사건이 공집합이 아니라는 조건만으로 확률이 양수라고 보장되지 않는다. 확률 0인 사건에서는 조건부확률 표현이 정의되지 않을 수 있다. 입력 검사 PASS가 원문의 이 문제를 해결하지 않는다.
- OPEN 8문항 상태 파일의 Q19 제외·정정 중 문구는 먼저 작성된 시점의 기록이다. 뒤에 동결된 Q19 상태 파일이 이를 보완하며, Q19 재검 완료로 바꾸지는 않는다.

## 보존 범위와 제한

- 진행 중인 원본 drafts는 읽거나 수정하지 않았다. 두 지정 스냅샷의 파일만 사용하고 각 크기·SHA-256을 해당 manifest와 대조했다.
- 기존 Q05·12·13·14·16·20 입력·신엔진 실물, 기존 EXEMPT, 다른 시험지 및 원문 JS·자산·엔진·ledger·대기열은 변경하지 않는다.
- 원본 STATUS의 과거 NOT_RUN 및 LOCAL_ONLY 기록은 보존한다. 최신 동결 상태는 각 CHECKPOINT_STATUS를 확인한다.
- main 병합·기존 파일 덮어쓰기·render·engine.prepare/build·독립 전체 수학검토·시각검수·CI 실행·게시·구현자 인계는 수행하지 않았다.
