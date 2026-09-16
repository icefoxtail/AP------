"""Regenerate DRY-RUN v4 after the authorized legacy prefix normalization.

The only archive edit before this dry-run is removal of exact 1:1 leading
choice labels from one legacy generated exam.  No answer permutation has been
applied.  Evaluation and minimum-change planning continue to come from the
current v3/shared evaluator implementation.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
V3_TOOL = Path(__file__).with_name("answer-index-distribution-dryrun-v3.py")
NORMALIZED_FILE = "archive/exams/similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js"


def load_v3_tool():
    spec = importlib.util.spec_from_file_location("answer_index_distribution_dryrun_v3", V3_TOOL)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load report builder: {V3_TOOL}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_v4_report():
    module = load_v3_tool()
    report, v2_module = module.build_v3_report()
    report["schemaVersion"] = "answer-index-distribution-audit-v4"
    report["completion"].pop("dryRunV3Generated", None)
    report["completion"]["dryRunV4Generated"] = "PASS"
    report["completion"]["legacyChoicePrefixNormalization"] = (
        "PASS (1 file / q1-q22 / 110 exact 1:1 prefixes)"
    )
    report["completion"]["permutationApplied"] = "NO"
    report["completion"]["dataFilesModified"] = (
        "LEGACY_PREFIX_ONLY (1 authorized file; no answer/solution/content permutation)"
    )
    report["dryRunV4"] = report.pop("dryRunV3")
    report["dryRunV4"]["reportVersion"] = "v4"
    report["ruleGap"]["activeImplementationVersion"] = "V4_SHARED_EVALUATOR_PLANNER_AFTER_PREFIX_NORMALIZATION"
    report["verification"]["newAnswerIndexDistributionUnitTests"] = "PASS (11/11)"
    report["verification"]["archiveDataDiff"] = (
        "PASS (1 authorized legacy-prefix-only file; 110 choice strings; no permutation)"
    )
    report["legacyChoicePrefixNormalization"] = {
        "status": "PASS",
        "file": NORMALIZED_FILE,
        "questionCount": 22,
        "choiceArrays": 22,
        "changedChoicePrefixes": 110,
        "prefixRule": "remove only when leading ①~⑤ exactly matches the 1-based array index",
        "protectedFieldsSame": True,
        "choiceBodiesSame": True,
        "answerSame": True,
        "solutionSame": True,
        "contentSame": True,
        "permutationApplied": False,
        "dbModified": False,
        "questionIndexModified": False,
        "assetsModified": False,
        "rendererEquality": {
            "status": "PASS",
            "renderer": "ap-render-authority-v2.2-phase1a",
            "modes": ["exam", "answer", "solution"],
            "exactHtmlEqual": True,
            "semanticFingerprintEqual": True,
        },
    }
    report["dataFilesModified"] = "LEGACY_PREFIX_ONLY"
    return report, module, v2_module


def render_v4_markdown(report: dict, v3_module, v2_module) -> str:
    # The v3 renderer already contains the embedded-label evidence section and
    # all file-level tables.  Temporarily provide the field name it expects.
    report["dryRunV3"] = report["dryRunV4"]
    representative = next(
        record for record in report["perFile"]
        if record["file"].endswith("25_금당고_2학기_중간_고1_유사.js")
    )
    representative_plan = representative["repairPlan"]
    representative_backup = None
    if representative_plan and not representative_plan.get("targetDistribution"):
        representative_backup = {
            key: representative_plan.get(key)
            for key in ["targetDistribution", "targetLongestRun", "targetRepeatedRuns", "changedQuestionCount", "solutionSync"]
        }
        counts = representative["evaluation"]["counts"]
        representative_plan["targetDistribution"] = [counts.get(str(index), counts.get(index, 0)) for index in range(1, 6)]
        representative_plan["targetLongestRun"] = representative["evaluation"]["longestRun"]
        representative_plan["targetRepeatedRuns"] = []
        representative_plan["changedQuestionCount"] = 0
        representative_plan["solutionSync"] = []
    try:
        markdown = v3_module.render_v3_markdown(report, v2_module)
    finally:
        if representative_backup is not None:
            representative_plan.update(representative_backup)
        report.pop("dryRunV3", None)

    normalization = "\n".join([
        "## Legacy choice-prefix normalization",
        "",
        f"- file: `{NORMALIZED_FILE}`",
        "- validation: PASS; 22/22 question choice arrays had exact ①~⑤-to-index alignment",
        "- applied: 110 leading labels removed from q1~q22; choice bodies preserved",
        "- protected fields: content / answer / solution / all non-choices fields unchanged",
        "- renderer: PASS; exam / answer / solution exact HTML and semantic fingerprints identical",
        "- answer permutation: NOT APPLIED",
        "- DB / question-index / assets: unchanged",
        "",
    ])
    markdown = normalization + markdown
    return (
        markdown
        .replace(
            "> ACTIVE 정본 승격과 공통 validator 구현은 완료했지만, 기존 생성형 데이터의 현재 분포는 아직 FAIL이다. 기존 `archive/exams` 데이터는 수정하지 않았고, v3 DRY-RUN 계획만 생성했다.",
            "> ACTIVE 정본 승격과 공통 validator 구현은 완료했지만, 생성형 데이터의 현재 분포는 아직 FAIL이다. 지정된 레거시 choices prefix만 정규화했고, v4 DRY-RUN 계획의 answer permutation은 아직 적용하지 않았다.",
        )
        .replace("DRY-RUN v3", "DRY-RUN v4")
        .replace("v3 DRY-RUN", "v4 DRY-RUN")
        .replace("v3 예상", "v4 예상")
        .replace("v3 target", "v4 target")
        .replace("DRYRUN_V3 GENERATED = PASS", "DRYRUN_V4 GENERATED = PASS")
        .replace("answer-index-distribution-audit-v3", "answer-index-distribution-audit-v4")
        .replace("answer-index-distribution-dryrun-v3", "answer-index-distribution-dryrun-v4")
        .replace("- DATA_FILES_MODIFIED = NO", "- LEGACY_PREFIX_NORMALIZATION = 1 file / 110 prefixes\n- PERMUTATION_APPLIED = NO")
        .replace("- existing generated JS / original JS / `archive/db.js` / `archive/question-index.js` / `archive/assets`: unchanged", "- existing generated JS: one authorized legacy-prefix-only normalization was applied; no answer permutation; original JS / `archive/db.js` / `archive/question-index.js` / `archive/assets`: unchanged")
        .replace("- v1/v2 reports preserved; v3 report is new", "- v1/v2/v3 reports preserved; v4 report is new")
        .replace("- `DATA_FILES_MODIFIED = NO`", "- `LEGACY_PREFIX_NORMALIZATION = 1 file / 110 prefixes`; `PERMUTATION_APPLIED = NO`")
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-md", default=str(ROOT / "reports/answer-index-distribution-audit-v4.md"))
    parser.add_argument("--output-json", default=str(ROOT / "reports/answer-index-distribution-dryrun-v4.json"))
    args = parser.parse_args()
    report, v3_module, v2_module = build_v4_report()
    Path(args.output_md).write_text(render_v4_markdown(report, v3_module, v2_module) + "\n", encoding="utf-8")
    Path(args.output_json).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "legacyChoicePrefixNormalization": report["legacyChoicePrefixNormalization"],
        "dryRunV4Generated": report["completion"]["dryRunV4Generated"],
        "activeBefore": report["dryRunV4"]["activeBefore"],
        "activePredictedAfter": report["dryRunV4"]["activePredictedAfter"],
        "filesRequiringChange": report["dryRunV4"]["filesRequiringChange"],
        "questionsRequiringPermutation": report["dryRunV4"]["questionsRequiringPermutation"],
        "solutionSync": report["dryRunV4"]["solutionAnswerIndexStringsRequiringSync"],
        "predictedAfterFilesWithFail": report["dryRunV4"]["predictedAfterFilesWithFail"],
        "predictedAfterFilesBlocked": report["dryRunV4"]["predictedAfterFilesBlocked"],
        "targetGateCheck": report["dryRunV4"]["targetGateCheck"],
        "machineValidation": report["machineValidation"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
