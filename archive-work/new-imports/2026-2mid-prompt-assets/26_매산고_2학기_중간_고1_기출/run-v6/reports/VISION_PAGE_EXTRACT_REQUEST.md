# Vision Page Extract Request

Return JSON only. Do not solve, do not fill answers, and do not write solutions.

For each full page image, extract every question on that page and return:

- displayNo
- questionType
- content
- choices
- hasVisualAsset
- visualAssetType
- visualAssetBBox on the full page image coordinate system
- contentConfidence
- choicesConfidence
- visualAssetConfidence
- reviewNeeded
- reviewReason

The visualAssetBBox must crop only the visual asset inside the question, such as a graph, figure, table, diagram, or image. It must not be the whole question crop.

Answers and solutions are intentionally outside this extraction pipeline.
