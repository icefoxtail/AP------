# AP Math Past Exam Pipeline

## V2 방향

이 파이프라인은 이제 **시험지 추출 전용**입니다.

기존 문항별 전체 crop 기반 구조를 기본값에서 제거하고, full page PNG + page-level Vision JSON 기반으로 candidate JS를 만듭니다.

## 핵심 정책

- PDF는 페이지별 full page PNG로 렌더링합니다.
- 문항별 전체 crop은 기본 생성하지 않습니다.
- candidate JS의 `image`는 비어 있거나 그래프/도형/표/이미지 같은 visual asset crop만 가리킵니다.
- candidate JS의 `image`는 full page 또는 question crop을 가리키면 실패입니다.
- `fullPageImagePath`는 모든 문항의 근거 이미지로 유지합니다.
- `answer`와 `solution`은 파이프라인에서 채우지 않습니다.
- 정답/해설은 candidate JS + full page 이미지 + reports 압축본을 받은 GPT/Gemini가 별도 작성합니다.

## 기본 흐름

```text
PDF
→ pages/page_p001.png
→ reports/vision_page_extract_request.json
→ 외부 Vision 호출 또는 사전 생성 JSON 입력
→ candidate/*.candidate.js
→ assets/q###_visual.png only when visualAssetBBoxOnPage exists and passes gate
→ reports/extraction_manual_review.csv
→ reports/answer_solution_required.csv
→ reports/gpt_gemini_handoff_manifest.json
```

## Vision JSON 없이 실행한 경우

Vision JSON이 없으면 파이프라인은 full page 이미지, Vision 요청서, schema, 빈 candidate skeleton, review reports를 만듭니다.

이 상태는 정상 최종본이 아니라 `manual_review`입니다. `reports/vision_page_extract_request.json`과 `reports/vision_page_extract_schema.json`을 기준으로 page-level Vision 결과를 만든 뒤 `manifest.visionPageExtractJsonPath` 또는 `--vision-json`으로 다시 실행합니다.

## 실행 예시

```powershell
cd C:\Users\USER\Desktop\past-exam-pipeline
node run-one-exam.mjs --manifest .\manifests\sample.json
```

Vision JSON이 있는 경우:

```powershell
cd C:\Users\USER\Desktop\past-exam-pipeline
node run-one-exam.mjs --manifest .\manifests\sample.json
```

manifest에 아래 필드를 넣습니다.

```json
{
  "visionPageExtractJsonPath": "C:/path/to/vision_page_extract.json"
}
```

또는 helper를 직접 실행합니다.

```powershell
python .\helpers\scanned_exam_pipeline.py `
  --manifest C:\path\to\manifest.json `
  --out C:\path\to\generated\exam `
  --dpi 220 `
  --candidate-file C:\path\to\generated\exam\candidate\exam.candidate.js `
  --vision-json C:\path\to\vision_page_extract.json
```

## Debug question crops

기본값은 꺼져 있습니다.

```json
{
  "createQuestionCrops": false
}
```

디버그로 켜도 `crops/debug_questions/`에만 저장되며 candidate `image`에는 연결되지 않습니다.

## 주요 파일

- `helpers/scanned_exam_pipeline.py`: full page render, Vision JSON 반영, candidate JS 생성, visual asset crop gate
- `helpers/crop_visual_assets_from_full_pages.py`: 이미 만들어진 candidate JS에서 full page bbox 기반 visual asset crop 재실행
- `helpers/audit_generated_visual_asset_links.py`: candidate `image`가 page/question crop을 가리키는지 감사
- `docs/PAST_EXAM_PIPELINE_V2_POLICY.md`: 정책 문서
- `docs/VISION_PAGE_EXTRACT_REQUEST_TEMPLATE.md`: Vision 호출 프롬프트 템플릿
- `examples/vision_page_extract.example.json`: Vision JSON 예시
- `PAST_EXAM_PIPELINE_V2_EXTERNAL_ADVISORY_REQUEST.md`: 외부 자문 요청서

## 검증

```powershell
npm run check
python -m py_compile .\helpers\scanned_exam_pipeline.py .\helpers\crop_visual_assets_from_full_pages.py .\helpers\audit_generated_visual_asset_links.py
```

## 금지 회귀

- `image = cropPath`
- `image = fullPageImagePath`
- `image`가 `pages/` 또는 `crops/questions/`를 가리키는 구조
- visual asset crop 실패 시 question crop fallback
- answer/solution을 추출 파이프라인에서 채우는 구조


## V2 full-page-first review rule

For content and choices, the full page image is the source of truth.

- Verify display number position from `fullPageImagePath` or `sourcePageEvidencePaths`.
- Compare JS `content` and `choices` against the full-page original.
- Use crops only as auxiliary zoom evidence.
- Do not let crop failure decide content/choice PASS or FAIL.
- `contentSource: "vision_required"` or `choicesSource: "vision_required"` means manual review is still required; downstream agents must not write dummy content.
