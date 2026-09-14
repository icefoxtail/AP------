# Past Exam V3 COMPLETE — current start and completion route

V2 full-page extraction remains the source transcription engine. The current
start/completion authority is
[`Past_Exam_V3_COMPLETE.md`](../../../docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md).
S0.5 is mandatory before source inventory or builder output. A bare PASS string
or reading only one existing JS is insufficient.

1. Read current rules. Select 2–3 good complete production JS files in Git main,
   preferring the same course, grade and term. Save their repository paths as a
   JSON array in `samples.json`. Read each complete file with
   `git show origin/main:archive/exams/original/...js`.
2. Prepare a manifest identifying the target PDF/page images, examId and canonical
   archiveRelativePath. Existing target JS is the baseline, never a calibration
   sample. Prepare an empty observation draft:

```powershell
node archive/tools/past-exam-pipeline/calibration.mjs --prepare --manifest <target-manifest.json> --samples <samples.json> --out <new-calibration-draft.json>
```

3. Fill the draft with genuine reader/session/time information, all sample
   question observations and solution excerpts, six sample-axis observations,
   and an anchored production-quality profile. When baselineStatus is PRESENT,
   read the whole target JS and record its baselineObservation and every
   baselineQuestionObservation. Its original bytes are retained in the lock's
   baselineSnapshotBase64, so a later authorized promotion does not erase the
   calibration baseline. Keep the target
   source facts separate. Freeze into a new path:

```powershell
node archive/tools/past-exam-pipeline/calibration.mjs --freeze --manifest <target-manifest.json> --decision <completed-observations.json> --out <new-reference-sample-lock.json>
```

Copy the returned `referenceSampleLock` file reference into the target manifest.
No PASS is issued until the reducer validates actual Git blob hashes, full
question coverage, anchored observations and the quality profile. Both prepare
and builder start compare origin/main with the live origin main ref; fetch first
if stale. Keep locks under repository staging so core can bind relative refs.

4. Use the existing run-one-exam / run-selected V2 extraction commands below.
   Direct Python extraction enforces the same calibration gate. Freeze an
   extraction-source JS separately before filling the candidate. New handoffs
   carry `PAST_EXAM_V3_COMPLETE`, protected source hashes, the entire completion
   baseline, and the exact allowed fields from `completion-contract.json`.
   New visual crops already use `assets/images/<examId>/qNNN_visual.png` inside
   staging; no post-review source-image renaming is needed. Put solution SVGs
   under the same staged exam asset directory. Pass that directory as `--assets`
   to promotion. The common preparer infers assetRoot from the staged manifest;
   use `--asset-root <staged-root>` explicitly if needed, and
   `--source-asset-root archive` when the frozen source JS refers to existing
   production images. These options read assets; they do not write production.
5. Solve all questions locally from source; write new student solutions and
   classification; triage every question; create required/beneficial solution
   visuals using frozen facts and numeric generation. Build work is not a blind
   reviewer PASS. Run common preparation:

```powershell
node archive/tools/pipeline-core/cli.mjs prepare-v2 --pipeline past-exam --past-exam-manifest <staged-manifest.json> --source <frozen-extraction.js> --candidate <completed-candidate.js> --source-registry-ref <registry-file-ref.json> --run-id <run-id> --work-batch-id <job-id> --builder-id <reader-id> --builder-session-id <reader-session-id> --builder-model <actual-model> --workdir <new-staging-directory>
```

This is a draft, not a completed audit. It binds calibration, source inventory,
geometry v1.1 project policy, and FULL_EXAM publication intent. Follow
pipeline-core/AGENT_BUDGET.md for machine collection, one provider-attested
FINAL_AUDIT with sealed U1/U2/U3, then the bounded `REPAIR_REQUIRED` → builder
repair → independent `TARGETED_RECHECK` loop (maximum three iterations). U3
returns typed solutionQuality and visualBenefit decisions, then common closure
decides. Each repair uses a new revision/inputSha and immutable freeze;
validated reuse is required for unaffected axes.
Use the canonical promotion helper only after all six render cases, source/math/
visual/solution/metadata gates, and production authority pass.

`npm --prefix archive/tools/past-exam-pipeline test` covers calibration and
handoff hardening. `npm --prefix archive/tools/pipeline-core test` covers common
closure and typed quality gates. These software fixtures do not qualify real
exam solutions or prove that a person/agent genuinely read the files.

---

# AP Math Past Exam Pipeline

Promotion now requires `--closure-manifest <run.json>` validated by
[`../pipeline-core/README.md`](../pipeline-core/README.md). Candidate and asset
bytes must already be canonical and reviewed; promotion no longer reserializes
the accepted JS. Extraction drafts may remain incomplete, but cannot be promoted
using only a `reviewed_pass` string. `npm run quality -- --manifest <run.json>`
checks the shared final evidence contract without production writes.

## Hardening contract

Every run accepts only an independently verified inventory and freezes
`reports/source_inventory.json` before Vision content is accepted. The input
inventory must be in `INDEPENDENT_INVENTORY_VERIFIED` (or already frozen)
state. The inventory is keyed by `sourceDocumentSha256` and
`sourceQuestionNo`; `id`, candidate array order, and `qNN` filenames are not
source identity. The paired `source_identity_map.json` must cover every
non-excluded source question exactly once. A missing disposition or a candidate
set that differs from the frozen included set is a hard failure.

`EXTRACTION_VALIDATED` means only that the full-page extraction package is
structurally complete. It is not equivalent to `SOURCE_FIDELITY_PASS`,
`MATH_REVIEW_PASS`, `ASSET_REVIEW_PASS`, `PRE_PROMOTION_VALIDATED`, or
`PRODUCTION_RELEASE_PASS`. The final candidate validator emits
`PRE_PROMOTION_VALIDATED` only when all evidence bindings and answer/solution
fields are complete; the promotion helper enforces the same SHA-bound contract.

The handoff lock protects `content`, `choices`, source identity/page evidence,
and visual asset bindings. Answer/solution work may change only
`answer`, `solution`, their status fields, and explicitly declared subunit
metadata. An extraction mismatch routes to `SOURCE_FIDELITY_RESTORATION`; it
cannot be silently repaired in the answer/solution lane.

Visual assets require provenance and semantic evidence in addition to PNG
decode: source document/question/page, bbox, asset SHA, crop generator,
`CROP_PURITY`, contamination, clipping, required-label, and question-semantic
checks. `PNG_DECODE_PASS` never implies `ASSET_SEMANTIC_PASS`. A direct asset
must bind to the same source question; a shared visual is valid only as an
explicit `SHARED_MATERIAL` binding with a `sharedMaterialUid` and complete
`dependencyQuestionSet`.

The exact ZIP is checked by two independent consumers:

```powershell
node archive/tools/past-exam-pipeline/portable-package-check.mjs --zip <deliverable.zip> --manifest <manifest.json>
node archive/tools/past-exam-pipeline/release-closure-check.mjs --release <release-closure.json>
```

The release closure requires bound candidate/production/runtime/render hashes
and `PASS` for production `exam`, `sol`, and `ans`. If a deliverable ZIP exists,
the exact ZIP, fresh extraction, package browser, and package hashes are also
required; production-browser evidence and package-browser evidence are never
interchangeable. A production-only flow records `packageApplicable: false` and
`portablePackageStatus: NOT_APPLICABLE`. `NOT_TESTED`, `WARN`, `FAIL`, or a
staging path correction can never be promoted to `DONE`.

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
cd <repo-root>
node archive\tools\past-exam-pipeline\run-one-exam.mjs --manifest <path-to-manifest.json>
```

Vision JSON이 있는 경우:

```powershell
cd <repo-root>
node archive\tools\past-exam-pipeline\run-one-exam.mjs --manifest <path-to-manifest.json>
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
- `helpers/validate_final_candidates.py`: V2 후보의 최종 필드·상태·이미지 경로 검증
- `lib/hardening.mjs`: source identity, evidence SHA, mutation, asset, serialization, release, and production-write gates
- `lib/portable-package.mjs`: independent ZIP consumer/extraction parity gate
- `promote-reviewed-exam.mjs`: `reviewed_pass` 후보를 canonical Archive로 승격
- `docs/PAST_EXAM_PIPELINE_V2_POLICY.md`: 정책 문서
- `docs/VISION_PAGE_EXTRACT_REQUEST_TEMPLATE.md`: Vision 호출 프롬프트 템플릿
- `examples/vision_page_extract.example.json`: Vision JSON 예시
- `PAST_EXAM_PIPELINE_V2_EXTERNAL_ADVISORY_REQUEST.md`: 외부 자문 요청서

## 검증

```powershell
npm run check
python -m py_compile .\helpers\scanned_exam_pipeline.py .\helpers\crop_visual_assets_from_full_pages.py .\helpers\audit_generated_visual_asset_links.py
npm test
```

## 금지 회귀

- `image = cropPath`
- `image = fullPageImagePath`
- `image`가 `pages/` 또는 `crops/questions/`를 가리키는 구조
- visual asset crop 실패 시 question crop fallback
- answer/solution을 추출 파이프라인에서 채우는 구조
- `build_candidates_from_verified_maps.py` 같은 legacy full-page fallback
  shortcut으로 candidate를 직접 구성하는 경로

최종 candidate에는 `subUnitKey`, `subUnit`, `subUnitConfidence`,
`subUnitClassificationDepth`가 필요하며, 세부단원 master와의 parent·label
정합성은 promotion 전에 확인합니다.


## V2 full-page-first review rule

For content and choices, the full page image is the source of truth.

- Verify display number position from `fullPageImagePath` or `sourcePageEvidencePaths`.
- Compare JS `content` and `choices` against the full-page original.
- Use crops only as auxiliary zoom evidence.
- Do not let crop failure decide content/choice PASS or FAIL.
- `contentSource: "vision_required"` or `choicesSource: "vision_required"` means manual review is still required; downstream agents must not write dummy content.
