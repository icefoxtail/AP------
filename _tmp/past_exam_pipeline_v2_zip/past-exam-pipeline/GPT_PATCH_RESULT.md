# GPT_PATCH_RESULT

## 1. 수정 파일
- helpers/validate_final_candidates.py
- helpers/scanned_exam_pipeline.py
- docs/PAST_EXAM_PIPELINE_V2_POLICY.md
- docs/VISION_PAGE_EXTRACT_REQUEST_TEMPLATE.md
- README.md
- PAST_EXAM_PIPELINE_V2_EXTERNAL_ADVISORY_REQUEST.md

## 2. 반영 내용
- V2 validator에서 `image` 공백을 `fullPageImagePath` 또는 `cropPath`로 fallback하던 버그를 제거했다.
- `answerStatus: external_agent_required` 상태의 blank answer/solution을 정상 처리하도록 수정했다.
- `displayNo` 비교를 V2 문자열 기준으로 보정했다.
- `contentSource == vision_required` 또는 `choicesSource == vision_required`는 PASS가 아니라 `needs_work`로 남기도록 했다.
- full-page 기준 발문/보기 검수 원칙을 정책 문서, Vision 요청 템플릿, 외부 자문 요청서, handoff manifest 생성 문구에 명시했다.
- cropPath/debug crop은 확대 보조 증거일 뿐 content/choices PASS/FAIL 기준이 아니라고 명시했다.

## 3. 고정 정책
```text
fullPageImagePath 또는 sourcePageEvidencePaths 기준으로
displayNo 위치를 확인하고,
JS content/choices와 원문을 비교한다.
cropPath는 확대 보조일 뿐, PASS/FAIL의 기준이 아니다.
```

## 4. 검증
- npm run check PASS
- python -m py_compile PASS
- validate_final_candidates.py V2 dummy sample PASS

## 5. 판정
외부 자문 CONDITIONAL PASS에서 지적된 validator V2 비호환 2건을 보정했다.
