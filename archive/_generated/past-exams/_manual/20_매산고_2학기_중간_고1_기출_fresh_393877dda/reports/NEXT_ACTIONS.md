# Past Exam Pipeline V2 Next Actions

## Current policy

- Full page PNG images are the extraction evidence.
- Page-level Vision JSON is the extraction source for content, choices, and visual asset bbox.
- Question-wide crops are disabled by default.
- Candidate `image` must never point to a page image or question crop.
- Candidate `image` may point only to a visual asset crop made from `visualAssetBBoxOnPage`.
- `answer` and `solution` are intentionally outside this extraction pipeline.

## Next handoff

Send the candidate JS, pages directory, assets directory, and reports directory to GPT/Gemini for answer/solution fill.
