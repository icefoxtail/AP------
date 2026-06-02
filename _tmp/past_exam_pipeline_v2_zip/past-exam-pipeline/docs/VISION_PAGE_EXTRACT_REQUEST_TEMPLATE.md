# Vision Page Extract Request Template

Return JSON only. Match `reports/vision_page_extract_schema.json`.

Analyze the provided full page image. Extract every question on that page. The full page image is the source of truth for display number location, content, and choices; crops are auxiliary zoom evidence only and must not control PASS/FAIL for text extraction.

For each question return:

- displayNo
- questionType: 객관식 or 서술형
- content
- choices
- hasVisualAsset
- visualAssetType: graph | figure | table | diagram | image | none | unknown
- visualAssetBBox: {x1,y1,x2,y2} in full page pixel coordinates, or null
- contentConfidence
- choicesConfidence
- visualAssetConfidence
- reviewNeeded
- reviewReason

Rules:

- Do not solve.
- Do not fill answer.
- Do not write solution.
- Do not guess missing text.
- Do not create missing choices.
- If uncertain, set reviewNeeded=true.
- visualAssetBBox must crop only the graph/figure/table/diagram/image inside the question.
- visualAssetBBox must not crop the whole question.
- visualAssetBBox must not crop the whole page.

Additional crop policy:

- Full page content/choice review comes first.
- Use crops only as auxiliary zoom evidence.
- A wrong or blank crop must not cause content/choices to be rejected if the full page evidence is clear.
- `contentSource == "vision_required"` or `choicesSource == "vision_required"` must remain manual review; do not fabricate filler text.
