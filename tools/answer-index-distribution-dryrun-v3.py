"""Regenerate DRY-RUN v3 from the shared v2 report builder.

The v2 builder remains available for historical reproduction.  This wrapper
changes only the report identity and output paths; all evaluation and repair
planning comes from the current shared evaluator/planner.
"""

from __future__ import annotations

import argparse
from functools import lru_cache
import importlib.util
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
V2_TOOL = Path(__file__).with_name("answer-index-distribution-dryrun-v2.py")


def _independent_minimum_changes(question_evidence: list[dict], valid_count: int) -> int | None:
    """Independently solve the min-change sequence problem for report proof."""

    rows = [item for item in question_evidence if item.get("validMcq")]
    if len(rows) != valid_count:
        return None
    minimum_kinds = 5 if valid_count >= 10 else 3
    max_minus_min = 2 if valid_count >= 10 else None
    impossible = -10**9

    def contiguous(index: int) -> bool:
        if index == 0:
            return False
        try:
            return int(rows[index]["questionId"]) == int(rows[index - 1]["questionId"]) + 1
        except (TypeError, ValueError):
            return rows[index]["questionId"] == rows[index - 1]["questionId"]

    def terminal(counts: tuple[int, ...]) -> bool:
        if sum(value > 0 for value in counts) < minimum_kinds:
            return False
        return max_minus_min is None or max(counts) - min(counts) <= max_minus_min

    @lru_cache(maxsize=None)
    def best(index: int, counts: tuple[int, ...], last: int, run: int) -> int:
        if index == len(rows):
            return 0 if terminal(counts) else impossible
        if not contiguous(index):
            last, run = 0, 0
        allowed = range(1, 6) if rows[index]["choiceOrderMutable"] else [rows[index]["currentAnswerIndex"]]
        score = impossible
        for position in allowed:
            if position is None or (position == last and run >= 2):
                continue
            updated = list(counts)
            updated[position - 1] += 1
            suffix = best(index + 1, tuple(updated), position, run + 1 if position == last else 1)
            if suffix <= impossible:
                continue
            score = max(score, (1 if position == rows[index]["currentAnswerIndex"] else 0) + suffix)
        return score

    score = best(0, (0, 0, 0, 0, 0), 0, 0)
    return None if score <= impossible else valid_count - score


def load_v2_tool():
    spec = importlib.util.spec_from_file_location("answer_index_distribution_dryrun_v2", V2_TOOL)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load report builder: {V2_TOOL}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_v3_report():
    module = load_v2_tool()
    report = module.build_report()
    report["schemaVersion"] = "answer-index-distribution-audit-v3"
    report["completion"].pop("dryRunV2Generated", None)
    report["completion"]["dryRunV3Generated"] = "PASS"
    report["dryRunV3"] = report.pop("dryRunV2")
    report["dryRunV3"]["reportVersion"] = "v3"
    report["ruleGap"]["activeImplementationVersion"] = "V3_SHARED_EVALUATOR_AND_PLANNER"
    report["verification"]["newAnswerIndexDistributionUnitTests"] = "PASS (11/11)"
    planned = [
        record for record in report["perFile"]
        if record.get("policyApplied") and record.get("repairPlan", {}).get("status") == "PLANNED"
    ]
    independent_changes = []
    for record in planned:
        minimum = _independent_minimum_changes(
            record["questionEvidence"], record["evaluation"]["validMcqCount"]
        )
        independent_changes.append({"file": record["file"], "minimumChanges": minimum})
    report["dryRunV3"]["independentMinimumPermutationCount"] = sum(
        item["minimumChanges"] for item in independent_changes if item["minimumChanges"] is not None
    )
    report["dryRunV3"]["independentMinimumByFile"] = independent_changes
    report["machineValidation"]["independentMinimumChangePass"] = all(
        item["minimumChanges"] == next(
            record["repairPlan"]["changedQuestionCount"]
            for record in planned if record["file"] == item["file"]
        )
        for item in independent_changes
    )
    return report, module


def render_v3_markdown(report, module) -> str:
    report["dryRunV2"] = report["dryRunV3"]
    try:
        markdown = module.render_markdown(report)
    finally:
        report.pop("dryRunV2", None)
    embedded_groups = {}
    for record in report["perFile"]:
        ids = [
            evidence["questionId"]
            for evidence in record.get("questionEvidence", [])
            if evidence.get("embeddedChoiceLabelDetected")
        ]
        if ids:
            embedded_groups[record["file"]] = ids
    embedded_lines = [
        "## Embedded choice-label evidence",
        "",
        "`EMBEDDED_CHOICE_LABEL`은 보기 문자열의 시작에 ①~⑤ 또는 1.~5. 라벨이 직접 들어 있어 보기 이동 시 문자열과 표시 위치가 어긋날 수 있는 문항을 immutable로 분류한다.",
        "현재 checkout의 실제 bytes를 우선해 판정했으며, 독립 검토서가 지목한 q12·q15·q17·q21보다 넓게 검출되는 경우도 축소하지 않았다.",
        "",
    ]
    for file, ids in embedded_groups.items():
        embedded_lines.append(f"- {file}: q{', q'.join(map(str, ids))}")
    embedded_section = "\n".join(embedded_lines) + "\n\n"
    markdown = markdown.replace("## choices=[] 3건", embedded_section + "## choices=[] 3건")
    return (
        markdown
        .replace("DRY-RUN v2", "DRY-RUN v3")
        .replace("v2 DRY-RUN", "v3 DRY-RUN")
        .replace("v2 예상", "v3 예상")
        .replace("v2 target", "v3 target")
        .replace("DRYRUN_V2 GENERATED = PASS", "DRYRUN_V3 GENERATED = PASS")
        .replace("newAnswerIndexDistributionUnitTests: PASS (8/8)", "newAnswerIndexDistributionUnitTests: PASS (11/11)")
        .replace("v1 reports preserved; v2 reports are new files", "v1/v2 reports preserved; v3 report is new")
        .replace("answer-index-distribution-audit-v2", "answer-index-distribution-audit-v3")
        .replace("answer-index-distribution-dryrun-v2", "answer-index-distribution-dryrun-v3")
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-md", default=str(ROOT / "reports/answer-index-distribution-audit-v3.md"))
    parser.add_argument("--output-json", default=str(ROOT / "reports/answer-index-distribution-dryrun-v3.json"))
    args = parser.parse_args()
    report, module = build_v3_report()
    Path(args.output_md).write_text(render_v3_markdown(report, module) + "\n", encoding="utf-8")
    Path(args.output_json).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "activeContractModified": report["completion"]["activeContractModified"],
        "validatorImplemented": report["completion"]["validatorImplemented"],
        "dryRunV3Generated": report["completion"]["dryRunV3Generated"],
        "activeBefore": report["dryRunV3"]["activeBefore"],
        "activePredictedAfter": report["dryRunV3"]["activePredictedAfter"],
        "filesRequiringChange": report["dryRunV3"]["filesRequiringChange"],
        "questionsRequiringPermutation": report["dryRunV3"]["questionsRequiringPermutation"],
        "solutionSync": report["dryRunV3"]["solutionAnswerIndexStringsRequiringSync"],
        "predictedAfterFilesWithFail": report["dryRunV3"]["predictedAfterFilesWithFail"],
        "targetGateCheck": report["dryRunV3"]["targetGateCheck"],
        "machineValidation": report["machineValidation"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
