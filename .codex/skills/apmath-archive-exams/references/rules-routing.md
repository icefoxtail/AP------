# APMath archive rule routing

Use this as the short router. Do not copy the full rule pack into a candidate
or handoff; read the authoritative files in the order below.

## Current authority

1. Start with `docs/rules/00_RULES_INDEX.md`.
2. Verify `docs/rules/MANIFEST.md` and the compiled master at
   `archive/data/master_tables/js_archive_tag_master.json` before a
   source-pack-bound final decision.
3. For a new JS extraction/import, read the current canonical rulebook,
   standard-unit master, subunit operating rules, integrated exam-workflow
   protocol, and `문제해설추출.md`; add the extraction v4 protocol when using
   the full-page Vision route.
4. For answer/solution completion, add `해설프로토콜.md`, the relevant
   solution-quality protocol, `무결성검수.md`, and
   `수학_문항오류_검증_프로토콜_v2.1.md`.
5. For corrections and final release, add `수정프로토콜.md`,
   `작업방식_5문항배치루프_필수.md`, the 1차/2차/3차 review protocols, and
   the real-render requirements in the integrated protocol.
6. For a graph, geometry, table, or SVG, read current
   `04_VISUAL/도형추출.md`; read the geometry-equation SVG review protocol
   only when that special lane applies.

`90_ARCHIVE/` contains legacy, draft, superseded, or historical documents. It
is not current authority for a new import.

## Pipeline boundaries

The adjacent `archive/tools/past-exam-pipeline/` documents are implementation
contracts, not replacements for the rulebook:

- `README.md` describes invocation and generated files;
- `docs/PAST_EXAM_PIPELINE_V2_POLICY.md` defines full-page-first extraction,
  visual-only crop links, and external answer/solution handoff;
- `helpers/validate_final_candidates.py` validates a V2 candidate;
- `promote-reviewed-exam.mjs` is the V2 promotion helper and must run only
  after a `reviewed_pass` envelope.

The extraction pipeline may leave `answer` and `solution` blank with a pending
external status. Production promotion may not.

## Similar-question boundary

`apmath-similar-question-pipeline` owns generation of similar questions and
similar exams. Its production Archive is read-only during generation and its
packages are not original-archive registrations. The `4batch` skill is a
deprecated compatibility alias; `adaptive` is an explicit comparison lane.
Do not merge their ALIVE stages, model routing, or experimental runtime into
this original-exam import skill.
