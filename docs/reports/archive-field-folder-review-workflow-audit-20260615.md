# Archive Field Folder Review Workflow Audit

작성일: 2026-06-15

## 1. 검토 범위

사용자 정정에 따라 `archive/internal-review-engine` 앱이 아니라, 실제 검수 현장 폴더와 파이프라인 산출물을 기준으로 확인했다.

주 확인 대상:

- `reports/high1_exam_inventory_20260601/content_choice_image_review/`
- `archive/tools/past-exam-pipeline/helpers/build_content_choice_image_review_worklists.py`
- `archive/tools/past-exam-pipeline/helpers/aggregate_content_choice_image_review_findings.py`
- `archive/tools/past-exam-pipeline/helpers/review_pipeline_candidates.py`
- `archive/textbook/generated/agent_work_status.json`
- `archive/archive/docs/PAST_EXAM_PDF_TO_JS_PIPELINE_RULEBOOK.md`

## 2. 현재 구조 요약

`content_choice_image_review` 폴더는 이미 다음 흐름을 갖고 있다.

- 작업 지시서: `AGENT_REVIEW_INSTRUCTIONS.md`
- 원본 작업 묶음: `agent_chunk_01.json` ~ `agent_chunk_04.json`
- 에이전트 결과: `agent_chunk_XX_findings.json`
- 취합 결과: `aggregate_findings*.json`
- 수정 후보: `*_repair_candidates.json`
- 액션 목록: `round1_actionable_failures.md`
- 수정 결과: `round1_correction_result.md`

즉, 검수 작업 단위와 결과 파일은 존재한다. 그러나 "파일별 현재 상태"를 한눈에 보여주는 상태판은 없다.

## 3. 핵심 부족점

### 3.1 확인 완료 파일 마커 부재

현재는 각 chunk 결과와 aggregate 파일을 읽어야만 어떤 시험지가 검수됐는지 알 수 있다. 파일 단위로 다음 상태를 바로 확인할 수 있는 마커가 없다.

필요한 상태:

- `unchecked`: 아직 검수 전
- `reviewed_pass`: 확인했고 수정 불필요
- `reviewed_warn`: 확인했지만 애매하거나 보류
- `repair_ready`: 수정 근거 있음
- `repaired`: 수정 반영 완료
- `blocked_source_missing`: 원본/페이지/crop 부족으로 중단
- `skip_final`: 이제 다시 안 봐도 되는 파일

권장 산출물:

- `review_status_board.json`
- `review_status_board.md`
- 파일별 marker sidecar: `<examId>.review.json`

### 3.2 "뭘 고쳤는지" 추적이 사람용 문서에만 있음

`round1_correction_result.md`에 수정 목록은 있지만, 한글 파일명이 일부 깨져 있다. 또한 기계가 재사용하기 좋은 구조가 아니다.

문제점:

- 수정된 candidate 파일의 정확한 path가 사람이 다시 확인하기 어렵다.
- 어떤 문항의 어떤 필드를 수정했는지 JSON으로 고정되어 있지 않다.
- 재실행 시 이미 반영된 항목을 자동 제외하기 어렵다.

권장 산출물:

```json
{
  "examId": "",
  "candidateFile": "",
  "questionId": 0,
  "displayNo": "",
  "field": "content",
  "action": "updated",
  "beforeHash": "",
  "afterHash": "",
  "evidencePath": "",
  "status": "repaired",
  "verifiedBy": "node --check",
  "verifiedAt": ""
}
```

### 3.3 재검수 제외 기준이 없음

현재 `aggregate_findings_final_strict_round1_fail_items.json`, `round1_actionable_failures.md`, `round1_correction_result.md`를 사람이 같이 읽어야 다음 작업 대상이 나온다.

필요한 기능:

- `repaired + node --check PASS` 항목 자동 제외
- `blocked_source_missing`만 다음 source recovery queue로 이동
- `manual_verify`와 `repair_ready` 분리
- chunk 재생성 시 완료된 파일 제외 옵션

### 3.4 폴더 다시 지정/작업 재개 UX가 약함

앱이 아니라 폴더 파이프라인 기준에서도 같은 문제가 있다. `build_content_choice_image_review_worklists.py`는 매번 `--root`, `--out-dir`, `--chunks`를 직접 지정해야 하고, `aggregate_content_choice_image_review_findings.py`도 매번 `--review-dir`, `--out`을 지정한다.

현재 `summary.json`에 root/out path가 들어 있긴 하지만, 재개 명령의 기준 파일로 충분히 쓰이지 않는다.

권장:

- `review_session.json`을 폴더 루트에 저장
- `resume_review.py --session review_session.json`
- 마지막 root/out/chunk/exclude state 자동 사용
- 완료 chunk는 자동 skip

### 3.5 저장 안정성 위험

현재 주요 산출물은 큰 JSON 파일로 누적된다. 실제 확인한 큰 파일 예시는 다음과 같다.

- `aggregate_findings_final_strict_round1.json`: 약 3.1 MB
- `aggregate_findings_final_round1.json`: 약 3.1 MB
- `risk_items.json`: 약 1.65 MB
- `agent_chunk_01.json`: 약 1.24 MB

수동 편집/저장에 기대면 에디터 멈춤, 인코딩 깨짐, 중간 저장 실패가 생기기 쉽다. 실제 `round1_correction_result.md`에도 한글 깨짐이 있어 보고서 신뢰성이 낮아진다.

권장:

- 사람이 큰 JSON을 직접 저장하지 않도록 한다.
- 수정은 `patch_plan.json`으로 작게 기록한다.
- 적용 스크립트는 임시 파일에 쓰고 검증 후 원자적 교체한다.
- 적용 직후 `node --check`와 candidate parse 검증을 자동 실행한다.
- 모든 보고서는 UTF-8 고정, 가능하면 `ensure_ascii=false` + BOM 없는 UTF-8로 통일한다.

## 4. 우선순위 제안

### P0

1. `review_status_board.json/md` 생성기 추가
2. `round1_correction_result.md`와 별도로 `round1_correction_result.json` 생성
3. 완료/보류/재검수 대상 자동 분리

### P1

1. `review_session.json` 기반 resume 명령 추가
2. worklist 생성 시 `--exclude-status reviewed_pass,repaired,skip_final` 지원
3. unresolved 전용 queue 생성

### P2

1. 파일별 sidecar marker 도입
2. 상태판을 사람이 보는 HTML/CSV로 export
3. 큰 aggregate JSON을 JSONL 또는 per-exam shard로 분할

## 5. 권장 폴더 구조

```text
content_choice_image_review/
  review_session.json
  review_status_board.json
  review_status_board.md
  markers/
    24_제일고_1학기_기말_고1_기출.review.json
  patches/
    round1_patch_plan.json
    round1_correction_result.json
  queues/
    todo_review.json
    todo_repair.json
    todo_source_recovery.json
    done_skip_final.json
```

## 6. 결론

현재 폴더는 검수 자료와 결과는 충분히 만들지만, 작업 상태를 보존하고 다음 라운드에서 중복 작업을 막는 "운영 상태 레이어"가 빠져 있다. 사용자가 원하는 기능은 새 앱보다 먼저 폴더 기반 상태판/마커/재개 기능으로 넣는 편이 맞다.

가장 먼저 만들 것은 `review_status_board`다. 이것만 있어도 "이미 확인한 파일", "수정 완료", "이제 안 해도 되는 파일", "원본 복구 필요"가 한 화면 또는 한 JSON에서 갈린다.
