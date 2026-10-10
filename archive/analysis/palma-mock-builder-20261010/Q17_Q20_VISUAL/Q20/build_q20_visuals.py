from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

ROOT = Path.cwd()
VISUAL_ROOT = ROOT / "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL"
HERE = VISUAL_ROOT / "Q20"
ASSET_DIR = ROOT / "archive/assets/generated-lite/palma-speed-pilot"
PREPARED = VISUAL_ROOT / "materialize_q17_q20_visuals.py"
sys.path.insert(0, str(ROOT))
from alive.engine.visual_renderer import RENDERER_VERSION, VISUAL_SPEC_VERSION, render_visual_spec

spec = importlib.util.spec_from_file_location("palma_prepared_visuals", PREPARED)
prepared = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = prepared
spec.loader.exec_module(prepared)


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest().upper()


def blob(raw: bytes) -> str:
    return hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()


def jbytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def write_json(path: Path, value: Any) -> bytes:
    path.parent.mkdir(parents=True, exist_ok=True)
    data = jbytes(value)
    path.write_bytes(data)
    return data


def canonical_bytes(path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"HEAD:{path}"], cwd=ROOT)


def q20_spec(facts: dict[str, Any], p: dict[str, Any]) -> dict[str, Any]:
    witnesses = facts["witnesses"]
    count = len(witnesses)
    metric = "밖 인원" if p["slot"] == "C3" else "교집합"
    if count == 2:
        rows = [
            ["구역", metric + " 최소 사례", metric + " 최대 사례"],
            ["집합 A", p["A"], ""],
            ["집합 B", p["B"], ""],
        ]
        for label, key in [("A∩B", "intersection"), ("A만", "aOnly"), ("B만", "bOnly"), ("둘 다 아님", "neither"), ("A∪B", "union"), ("전체", "total")]:
            rows.append([label, str(witnesses[0][key]), str(witnesses[1][key])])
    else:
        rows = [["구역", "가능한 배치", ""] , ["집합 A", p["A"], ""], ["집합 B", p["B"], ""]]
        for label, key in [("A∩B", "intersection"), ("A만", "aOnly"), ("B만", "bOnly"), ("둘 다 아님", "neither"), ("A∪B", "union"), ("전체", "total")]:
            rows.append([label, str(witnesses[0][key]), ""])
    return {"version": VISUAL_SPEC_VERSION, "type": "table", "width": 720, "height": 600, "rows": rows}


def extract_table(svg: bytes, visual_spec: dict[str, Any], facts: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    root = ET.fromstring(svg.decode("utf-8"))
    cells = [e for e in root.iter() if e.tag.endswith("text") and e.attrib.get("class") == "cell-text"]
    rects = [e for e in root.iter() if e.tag.endswith("rect") and e.attrib.get("class") == "cell"]
    expected = [value for row in visual_spec["rows"] for value in row]
    observed = [(e.text or "").strip() for e in cells]
    assert observed == expected and len(rects) == len(expected)
    row_count = len(visual_spec["rows"])
    column_count = len(visual_spec["rows"][0])
    cell_width = (visual_spec["width"] - 32) / column_count
    cell_height = (visual_spec["height"] - 32) / row_count
    observed_cells = []
    for index, (text, element) in enumerate(zip(expected, cells)):
        row, column = divmod(index, column_count)
        expected_center = [16 + column * cell_width + cell_width / 2, 16 + row * cell_height + cell_height / 2]
        center = [float(element.attrib["x"]), float(element.attrib["y"])]
        approx_width = 13 * 0.6 * len(text)
        assert all(abs(a-b) < 1e-6 for a, b in zip(center, expected_center))
        assert approx_width <= cell_width
        observed_cells.append({"row": row, "column": column, "text": text, "centerPx": center,
                               "cellWidthPx": cell_width, "cellHeightPx": cell_height, "approxTextWidthPx": approx_width})
    witness_observations = []
    for witness in facts["witnesses"]:
        regions = {"R11": witness["intersection"], "R10": witness["aOnly"], "R01": witness["bOnly"], "R00": witness["neither"]}
        total = sum(regions.values())
        assert regions["R11"] + regions["R10"] == params["a"]
        assert regions["R11"] + regions["R01"] == params["b"]
        assert total == params["N"] == witness["total"]
        assert regions["R11"] + regions["R10"] + regions["R01"] == witness["union"]
        assert regions["R00"] == params["N"] - witness["union"]
        witness_observations.append({"regions": regions, "computedUnion": total - regions["R00"], "computedOutside": regions["R00"],
                                     "computedTotal": total, "ARecovered": regions["R11"] + regions["R10"],
                                     "BRecovered": regions["R11"] + regions["R01"]})
    assert len(witness_observations) == len(facts["witnesses"])
    return {"xmlParse": "PASS", "actualSvgPrimitives": {"tableRectCount": len(rects), "tableTextCount": len(cells),
             "tableRows": row_count, "tableColumns": column_count, "cellTexts": observed, "cells": observed_cells},
            "observedFacts": {"cellTextParity": "PASS", "rowCount": row_count, "columnCount": column_count,
              "cardinalityByRegionParity": "PASS", "unionOutsideTotalParity": "PASS", "setCardinalityRecovery": "PASS",
              "witnesses": witness_observations},
            "deltaTolerance": {"cellCenterPx": 1e-6, "approxTextWidthOverflowPx": 0}}


def main() -> None:
    HERE.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    package_rel = prepared.SOURCE_DIR + "/GPT_QID9_Q20_PACKAGE.json"
    package_raw = canonical_bytes(package_rel)
    approval_path = prepared.APPROVAL_REL
    approval_raw = canonical_bytes(approval_path)
    approval = json.loads(approval_raw.decode("utf-8"))
    approval_head_blob = subprocess.check_output(["git", "rev-parse", f"HEAD:{approval_path}"], cwd=ROOT, text=True).strip()
    package = json.loads(package_raw.decode("utf-8"))
    package_worktree_raw = (ROOT / package_rel).read_bytes()
    frozen = json.loads((VISUAL_ROOT / "expected-facts-freeze.json").read_text(encoding="utf-8"))
    triage = json.loads((VISUAL_ROOT / "visual-triage-freeze.json").read_text(encoding="utf-8"))
    frozen_q20 = frozen["q20"]
    triage_rows = {row["uid"]: row for row in triage["rows"] if row["sourceQid"] == 20}
    params = prepared.Q20
    assert len(package["items"]) == len(params) == len(frozen_q20) == len(triage_rows) == 9
    receipt_row = next(row for row in approval["packages"] if row["sourceQid"] == 20)
    assert sha(package_raw).lower() == receipt_row["sha256"].lower() and blob(package_raw) == receipt_row["gitBlobSha1"]
    assert sha(approval_raw).lower() == frozen["approvalReceiptSha256"].lower()
    assert json.loads(package_worktree_raw.decode("utf-8")) == package
    assert frozen["sourceExamBlobSha1"] == approval["source"]["gitBlobSha1"] == "4cfce909c023e5c4df4a759945c8cc3e0a63ec76"
    package_items = {row["uid"]: row for row in package["items"]}
    assert set(package_items) == set(params) == set(frozen_q20) == set(triage_rows)
    out = []
    for uid, p in params.items():
        item = package_items[uid]
        facts = frozen_q20[uid]
        recalculated = prepared.q20_expected(uid, p, item)
        assert json.loads(json.dumps(recalculated, ensure_ascii=False)) == facts
        assert facts["decisiveRelationCovered"] and not facts["uncoveredCriticalConditions"]
        visual_spec = q20_spec(facts, p)
        svg_text = render_visual_spec(visual_spec)
        assert svg_text == render_visual_spec(json.loads(json.dumps(visual_spec, ensure_ascii=False)))
        svg = svg_text.encode("utf-8")
        static = extract_table(svg, visual_spec, facts, p)
        asset = ASSET_DIR / f"{uid}-solution.svg"
        asset.write_bytes(svg)
        spec_path = HERE / f"{uid}.visual-spec.json"
        report_path = HERE / f"{uid}.render-report.json"
        evidence_path = HERE / f"{uid}.visual-evidence.json"
        spec_bytes = write_json(spec_path, visual_spec)
        report = {"schemaVersion": "PALMA_Q20_VISUAL_RENDER_REPORT_V1", "renderer": "alive.engine.visual_renderer.render_visual_spec",
                  "rendererVersion": RENDERER_VERSION, "visualSpecVersion": VISUAL_SPEC_VERSION, "visualType": "table",
                  "specSha256": sha(json.dumps(visual_spec, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()),
                  "assetSha256": sha(svg), "assetGitBlobSha1": blob(svg), "deterministicRerender": "PASS", "actualBrowserStatus": "RENDER_PENDING"}
        report_bytes = write_json(report_path, report)
        witnesses = facts["witnesses"]
        expected_facts = {"setCardinalities": {"values": {"A": p["a"], "B": p["b"]}, "role": "GIVEN"},
                          "totalCardinality": {"value": p["N"], "role": "GIVEN"},
                          "cardinalityByRegion": {"values": [{"R11": w["intersection"], "R10": w["aOnly"], "R01": w["bOnly"], "R00": w["neither"]} for w in witnesses], "role": "DERIVED_INTERMEDIATE"},
                          "intersectionCardinality": {"values": [w["intersection"] for w in witnesses], "role": "DERIVED_INTERMEDIATE"},
                          "unionCardinality": {"values": [w["union"] for w in witnesses], "role": "DERIVED_INTERMEDIATE"},
                          "outsideCardinality": {"values": [w["neither"] for w in witnesses], "role": "DERIVED_INTERMEDIATE"},
                          "extremeConfiguration": {"values": witnesses, "role": "CONCLUSION"}}
        table_rows = visual_spec["rows"]
        region_rows = {"A∩B": "R11", "A만": "R10", "B만": "R01", "둘 다 아님": "R00", "A∪B": "R10 ∪ R11 ∪ R01", "전체": "U"}
        label_bindings = []
        for cell in static["actualSvgPrimitives"]["cells"]:
            label = cell["text"]
            if label in region_rows:
                label_bindings.append({"text": label, "screenCell": {"row": cell["row"], "column": cell["column"], "centerPx": cell["centerPx"]},
                                      "semanticOwner": region_rows[label], "result": "PASS"})
        ev = {"schemaVersion": "PALMA_Q20_VISUAL_ITEM_PHYSICAL_EVIDENCE_V1", "uid": uid, "sourceQid": 20,
              "need": "BENEFICIAL", "problemNeed": "EXEMPT", "assetAction": "NEW_SVG",
              "sourcePackagePath": package_rel, "sourcePackageSha256": sha(package_raw), "sourcePackageGitBlobSha1": blob(package_raw),
              "sourcePackageWorktreeRawSha256": sha(package_worktree_raw), "sourcePackageWorktreeRawGitBlobSha1": blob(package_worktree_raw),
              "approvalReceiptPath": approval_path, "approvalReceiptSha256": sha(approval_raw), "approvalReceiptGitBlobSha1": blob(approval_raw),
              "approvalReceiptHeadBlobSha1": approval_head_blob, "sourceExamBlobSha1": approval["source"]["gitBlobSha1"],
              "approvedPackageUidSet": receipt_row["uids"], "approvedUid": uid, "sourceProblemSha256": facts["sourceProblemSha256"].removeprefix("sha256:"),
              "sourceSolutionSha256": facts["sourceSolutionSha256"].removeprefix("sha256:"), "sourceConditionCoverage": facts["sourceConditionCoverage"],
              "decisiveRelationCovered": True, "uncoveredCriticalConditions": [], "expectedFactCompletenessStatus": "PASS",
              "expectedFacts": expected_facts, "pythonInputs": {"setSizes": {"A": p["a"], "B": p["b"]}, "universeTotal": p["N"],
                 "witnessIntersectionValues": p["xs"], "regionFormula": "R10=|A|-|A∩B|; R01=|B|-|A∩B|; R00=N-|A∪B|; R11=|A∩B|"},
              "pythonCalculatedOutputs": {"witnesses": witnesses},
              "coordinateModel": {"visualType": "table", "semantics": "Exact cell values; row/cell area has no cardinality meaning.",
                 "layout": {"rows": len(table_rows), "columns": len(table_rows[0]), "width": visual_spec["width"], "height": visual_spec["height"]}},
              "actualSvgPrimitives": static["actualSvgPrimitives"], "observedFacts": static["observedFacts"], "deltaTolerance": static["deltaTolerance"],
              "labelOwnerBindings": label_bindings,
              "sourceSemanticIdentity": {"applicable": True, "checks": [{"semanticRole": "A", "sourceLabel": p["A"], "artifactLabel": p["A"], "result": "PASS"},
                 {"semanticRole": "B", "sourceLabel": p["B"], "artifactLabel": p["B"], "result": "PASS"},
                 {"semanticRole": "universe", "sourceLabel": "전체 N", "artifactLabel": "전체", "result": "PASS"}]},
              "factVisualizations": [{"fact": "A and B set cardinalities and total population", "role": "GIVEN", "encoding": "set-name and total rows"},
                 {"fact": "A∩B, A-only, B-only and neither counts", "role": "DERIVED_INTERMEDIATE", "encoding": "one exact count per canonical membership region"},
                 {"fact": "union and outside counts", "role": "DERIVED_INTERMEDIATE", "encoding": "explicit table cells recomputed from four regions"},
                 {"fact": "the solution's endpoint or fixed witness configurations", "role": "CONCLUSION", "encoding": "case columns keyed to minimum/maximum witness"}],
              "xmlParse": static["xmlParse"], "renderer": "alive.engine.visual_renderer.render_visual_spec", "rendererVersion": RENDERER_VERSION,
              "styleFloorStatus": "STATIC_ONLY_RENDER_PENDING", "styleVersion": "visual_renderer_" + RENDERER_VERSION, "semanticGeometryPreserved": True,
              "visualSpecPath": spec_path.relative_to(ROOT).as_posix(), "visualSpecSha256": sha(spec_bytes),
              "rendererReportPath": report_path.relative_to(ROOT).as_posix(), "rendererReportSha256": sha(report_bytes),
              "sourceSvgPath": asset.relative_to(ROOT).as_posix(), "sourceSvgSha256": sha(svg), "sourceSvgGitBlobSha1": blob(svg),
              "browserRenderEvidence": {"status": "RENDER_PENDING", "reason": "Actual HTTP Archive mode=sol browser QA follows projection; no browser render was attempted before projection."},
              "consumerReference": "PENDING_PROJECTION", "newVisualInformation": ["exact four-region membership witness in each solution case", "union and outside counts verified against total"]}
        evidence_bytes = write_json(evidence_path, ev)
        out.append({"uid": uid, "assetPath": asset.relative_to(ROOT).as_posix(), "assetSha256": sha(svg), "assetGitBlobSha1": blob(svg),
                    "evidencePath": evidence_path.relative_to(ROOT).as_posix(), "evidenceSha256": sha(evidence_bytes), "renderer": RENDERER_VERSION,
                    "rowCount": len(table_rows), "witnessCount": len(witnesses), "renderStatus": "RENDER_PENDING"})
    summary = {"schemaVersion": "PALMA_Q20_VISUAL_ASSET_SUMMARY_V1", "sourceExamBlobSha1": approval["source"]["gitBlobSha1"],
               "packageApprovalReceiptPath": approval_path, "packageApprovalReceiptSha256": sha(approval_raw), "packageApprovalReceiptHeadBlobSha1": approval_head_blob,
               "packagePath": package_rel, "packageSha256": sha(package_raw), "packageGitBlobSha1": blob(package_raw),
               "packageWorktreeRawSha256": sha(package_worktree_raw), "packageWorktreeRawGitBlobSha1": blob(package_worktree_raw),
               "renderer": "alive.engine.visual_renderer:" + RENDERER_VERSION + "/visualSpec-" + VISUAL_SPEC_VERSION,
               "counts": {"denominator": 9, "svgCreated": len(out), "xmlParsePass": len(out), "tableCellParityPass": len(out), "renderPending": len(out)}, "items": out}
    write_json(HERE / "Q20_asset_summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
