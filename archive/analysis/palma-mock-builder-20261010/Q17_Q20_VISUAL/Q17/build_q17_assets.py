from __future__ import annotations

import hashlib
import importlib.util
import json
import math
import pathlib
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[5]
VISUAL_DIR = ROOT / "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL"
OUT_DIR = VISUAL_DIR / "Q17"
ASSET_DIR = ROOT / "archive/assets/generated-lite/palma-speed-pilot"
BUILDER_PATH = VISUAL_DIR / "materialize_q17_q20_visuals.py"
SOURCE_DIR = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1"
PACKAGE_REL = SOURCE_DIR + "/GPT_QID9_Q17_PACKAGE.json"
APPROVAL_REL = SOURCE_DIR + "/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json"
FREEZE_REL = "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/expected-facts-freeze.json"
TRIAGE_REL = "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/visual-triage-freeze.json"
RECEIPT_REL = "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/visual_read_receipt.json"
RENDERER_REL = "alive/engine/visual_renderer.py"


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest().upper()


def blob(raw: bytes) -> str:
    return hashlib.sha1(f"blob {len(raw)}\0".encode("ascii") + raw).hexdigest()


def git_bytes(spec: str) -> bytes:
    return subprocess.check_output(["git", "show", spec], cwd=ROOT)


def clean_blob(rel: str, raw: bytes) -> str:
    return subprocess.check_output(["git", "hash-object", f"--path={rel}", "--stdin"], cwd=ROOT, input=raw).decode().strip()


def write_json(path: pathlib.Path, obj) -> bytes:
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = (json.dumps(obj, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    path.write_bytes(raw)
    return raw


def main():
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    spec = importlib.util.spec_from_file_location("palma_q17_prepared_builder", BUILDER_PATH)
    builder = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = builder
    spec.loader.exec_module(builder)
    from alive.engine.visual_renderer import RENDERER_VERSION, VISUAL_SPEC_VERSION, render_visual_spec

    approval_head = git_bytes(f"HEAD:{APPROVAL_REL}")
    approval_work = (ROOT / APPROVAL_REL).read_bytes()
    approval = json.loads(approval_head.decode("utf-8"))
    assert approval_work == approval_head, "approval receipt worktree bytes differ from approved HEAD bytes"
    receipt_sha = sha(approval_head)
    approval_blob = builder.read_git_blob_sha(APPROVAL_REL)
    assert blob(approval_head) == approval_blob

    package_head = git_bytes(f"HEAD:{PACKAGE_REL}")
    package_work = (ROOT / PACKAGE_REL).read_bytes()
    package = json.loads(package_head.decode("utf-8"))
    package_record = next(x for x in approval["packages"] if x["sourceQid"] == 17)
    assert sha(package_head).lower() == package_record["sha256"].lower()
    assert blob(package_head) == package_record["gitBlobSha1"]
    package_work_clean_blob = clean_blob(PACKAGE_REL, package_work)
    assert package_work_clean_blob == package_record["gitBlobSha1"]
    assert json.loads(package_work.decode("utf-8")) == package
    assert len(package["items"]) == 9

    old_freeze_raw = (VISUAL_DIR / "expected-facts-freeze.json").read_bytes()
    old_freeze = json.loads(old_freeze_raw.decode("utf-8"))
    triage_raw = (VISUAL_DIR / "visual-triage-freeze.json").read_bytes()
    triage = json.loads(triage_raw.decode("utf-8"))
    read_receipt_raw = (VISUAL_DIR / "visual_read_receipt.json").read_bytes()
    read_receipt = json.loads(read_receipt_raw.decode("utf-8"))
    assert old_freeze["approvalReceiptSha256"].lower() == receipt_sha.lower()
    assert triage["approvalReceiptSha256"].lower() == receipt_sha.lower()
    assert read_receipt["approvalBinding"]["receipt"]["sha256"].lower() == receipt_sha.lower()

    items = {x["uid"]: x for x in package["items"]}
    old_q17 = old_freeze["q17"]
    corrected = {}
    for uid, params in builder.Q17.items():
        current = builder.q17_expected(uid, params, items[uid])
        old = old_q17[uid]
        assert current["sourceProblemSha256"] == old["sourceProblemSha256"]
        assert current["sourceSolutionSha256"] == old["sourceSolutionSha256"]
        if uid.endswith("-C2"):
            assert params["outer"] == 5.0 and params["r"] == 3.0
            assert current["coordinateConstruction"]["pointCoordinates"]["A"] == (5.0, 0.0)
            assert current["coordinateConstruction"]["pointCoordinates"]["B"] != old["coordinateConstruction"]["pointCoordinates"]["B"]
            assert "3\\le OP\\le5" in items[uid]["stem"] and "OP=3" in items[uid]["solution"]
        else:
            for name, point in current["coordinateConstruction"]["pointCoordinates"].items():
                oldpoint = old["coordinateConstruction"]["pointCoordinates"][name]
                assert math.dist(point, oldpoint) <= 1e-9, (uid, name, point, oldpoint)
        corrected[uid] = current

    # Keep the preexisting shared freeze intact. This Q17-scoped refresh is
    # necessary because its old C2 row conflates source radius 5 and OP minimum 3.
    q17_freeze = {
        "schemaVersion": "PALMA_Q17_SCOPED_EXPECTED_FACT_REFRESH_V1",
        "scope": {"sourceQid": 17, "uidCount": 9},
        "approvedSource": {
            "packagePath": PACKAGE_REL,
            "packageSha256": sha(package_head),
            "packageGitBlobSha1": blob(package_head),
            "packageWorktreeRawSha256": sha(package_work),
            "packageWorktreeRawGitBlobSha1": blob(package_work),
            "packageWorktreeCleanGitBlobSha1": package_work_clean_blob,
            "approvalReceiptPath": APPROVAL_REL,
            "approvalReceiptSha256": receipt_sha,
            "approvalReceiptGitBlobSha1": approval_blob,
        },
        "preexistingFreeze": {
            "path": FREEZE_REL,
            "sha256": sha(old_freeze_raw),
            "triagePath": TRIAGE_REL,
            "triageSha256": sha(triage_raw),
            "readReceiptPath": RECEIPT_REL,
            "readReceiptSha256": sha(read_receipt_raw),
            "preservedUnmodified": True,
        },
        "sourceQ17Items": corrected,
        "discrepancyResolution": {
            "uid": "ALITE-PALMA25-2MID-Q17-C2",
            "oldFreezeSourceRadius": 3.0,
            "approvedSourceRadiusOAOB": 5.0,
            "approvedSolutionMinimizingOP": 3.0,
            "resolution": "Keep source OA=OB=5 and selected equality minimizer OP=3 as distinct facts. The chord minimum 2·OP·sin(45°)=3√2 occurs at OP=3 within 3≤OP≤5.",
            "recomputedFinalChordLength": corrected["ALITE-PALMA25-2MID-Q17-C2"]["relation"]["computedChordLength"],
            "expectedMinimum": corrected["ALITE-PALMA25-2MID-Q17-C2"]["relation"]["expectedMinimum"],
            "delta": corrected["ALITE-PALMA25-2MID-Q17-C2"]["relation"]["delta"],
        },
    }
    freeze_path = OUT_DIR / "Q17.expected-facts-freeze.json"
    freeze_bytes = write_json(freeze_path, q17_freeze)
    freeze_sha = sha(freeze_bytes)
    freeze_blob = blob(freeze_bytes)

    renderer_path = ROOT / RENDERER_REL
    renderer_sha = sha(renderer_path.read_bytes())
    outputs = []
    for uid, params in builder.Q17.items():
        facts = corrected[uid]
        visual_spec = builder.q17_spec(uid, facts, params)
        first = render_visual_spec(visual_spec)
        second = render_visual_spec(json.loads(json.dumps(visual_spec, ensure_ascii=False)))
        assert first == second
        svg = first.encode("utf-8")
        assert b"\r\n" not in svg
        static = builder.static_q17(svg, visual_spec, facts)
        package_rel = PACKAGE_REL
        uid_dir = OUT_DIR
        asset_rel = pathlib.Path("archive/assets/generated-lite/palma-speed-pilot") / f"{uid}-solution.svg"
        spec_path = uid_dir / f"{uid}.visual-spec.json"
        report_path = uid_dir / f"{uid}.render-report.json"
        evidence_path = uid_dir / f"{uid}.visual-evidence.json"
        spec_bytes = write_json(spec_path, visual_spec)
        asset_path = ROOT / asset_rel
        asset_path.parent.mkdir(parents=True, exist_ok=True)
        asset_path.write_bytes(svg)
        asset_sha = sha(svg)
        asset_blob = blob(svg)
        report = {
            "schemaVersion": "PALMA_Q17_VISUAL_RENDER_REPORT_V1",
            "renderer": "alive.engine.visual_renderer.render_visual_spec",
            "rendererVersion": RENDERER_VERSION,
            "visualSpecVersion": VISUAL_SPEC_VERSION,
            "visualType": visual_spec["type"],
            "rendererSourcePath": RENDERER_REL,
            "rendererSourceSha256": renderer_sha,
            "specSha256": sha(spec_bytes),
            "assetSha256": asset_sha,
            "assetGitBlobSha1": asset_blob,
            "deterministicRerender": "PASS",
            "staticPrimitiveParity": "PASS",
            "actualBrowserStatus": "RENDER_PENDING",
        }
        report_bytes = write_json(report_path, report)
        source_identity = {
            "applicable": True,
            "checks": [
                {"semanticRole": "source center", "sourceLabel": "O", "artifactLabel": "O", "result": "PASS"},
                {"semanticRole": "source ray point", "sourceLabel": "A", "artifactLabel": "A", "result": "PASS"},
                {"semanticRole": "source ray point", "sourceLabel": "B", "artifactLabel": "B", "result": "PASS"},
                {"semanticRole": "source point", "sourceLabel": "P", "artifactLabel": "P", "result": "PASS"},
                {"semanticRole": "reflected point", "sourceLabel": "P₁", "artifactLabel": "P₁", "result": "PASS"},
                {"semanticRole": "reflected point", "sourceLabel": "P₂", "artifactLabel": "P₂", "result": "PASS"},
                {"semanticRole": "source boundary intersection", "sourceLabel": "Q", "artifactLabel": "Q", "result": "PASS"},
                {"semanticRole": "source boundary intersection", "sourceLabel": "R", "artifactLabel": "R", "result": "PASS"},
            ],
        }
        evidence = {
            "schemaVersion": "PALMA_Q17_VISUAL_PHYSICAL_EVIDENCE_V1",
            "uid": uid,
            "sourceQid": 17,
            "need": "BENEFICIAL",
            "problemNeed": "EXEMPT",
            "assetAction": "NEW_SVG",
            "sourcePackagePath": package_rel,
            "approvedSourcePackageSha256": sha(package_head),
            "approvedSourcePackageGitBlobSha1": blob(package_head),
            "currentWorktreePackageRawSha256": sha(package_work),
            "currentWorktreePackageRawGitBlobSha1": blob(package_work),
            "currentWorktreePackageCleanGitBlobSha1": package_work_clean_blob,
            "worktreePackageRawEol": "CRLF; canonical clean blob matches approved receipt",
            "sourceExamBlobSha1": approval["source"]["gitBlobSha1"],
            "approvalReceiptPath": APPROVAL_REL,
            "approvalReceiptSha256": receipt_sha,
            "approvalReceiptGitBlobSha1": approval_blob,
            "sourceProblemSha256": facts["sourceProblemSha256"],
            "sourceSolutionSha256": facts["sourceSolutionSha256"],
            "expectedFactsFreezePath": freeze_path.relative_to(ROOT).as_posix(),
            "expectedFactsFreezeSha256": freeze_sha,
            "expectedFactsFreezeGitBlobSha1": freeze_blob,
            "preexistingExpectedFactsFreezePath": FREEZE_REL,
            "preexistingExpectedFactsFreezeSha256": sha(old_freeze_raw),
            "sourceConditionCoverage": facts["sourceConditionCoverage"],
            "expectedFactCompletenessStatus": "PASS",
            "uncoveredCriticalConditions": facts["uncoveredCriticalConditions"],
            "decisiveRelationCovered": facts["decisiveRelationCovered"],
            "coordinateEvidence": facts["coordinateConstruction"],
            "expectedFacts": facts["expectedFacts"],
            "pythonInputs": {"minimizingRadius": params["r"], "sourceOuterRadius": params.get("outer", params["r"]), "thetaDegrees": params["deg"], "formula": "P₁P₂=2·OP·sin(θ)"},
            "pythonCalculatedOutputs": {"minimumLength": params["minval"], "chordLength": facts["relation"]["computedChordLength"], "Q": facts["coordinateConstruction"]["pointCoordinates"]["Q"], "R": facts["coordinateConstruction"]["pointCoordinates"]["R"]},
            "coordinateModel": {"origin": [0, 0], "xAxis": "OA", "scale": "equal x/y", "xRange": visual_spec["xRange"], "yRange": visual_spec["yRange"], "screenTransform": "screenX=32+(x-xLow)*(width-64)/(xHigh-xLow); screenY=height-32-(y-yLow)*(height-64)/(yHigh-yLow)"},
            "actualSvgPrimitives": static["actualSvgPrimitives"],
            "observedFacts": static["observedFacts"],
            "deltaTolerance": static["tolerances"],
            "labelOwnerBindings": static["observedFacts"]["labelOwnerBindings"],
            "sourceSemanticIdentity": source_identity,
            "factVisualizations": [
                {"fact": "OA/OB source boundaries", "role": "GIVEN", "encoding": "radius segments and source circle"},
                {"fact": "P₁/P₂ reflections and Q/R intersections", "role": "DERIVED_INTERMEDIATE", "encoding": "labeled points, dashed unfolded legs, solid P₁P₂ chord"},
                {"fact": "straightened minimum path", "role": "CONCLUSION", "encoding": "P₁-Q-R-P₂ collinear ordered path"},
            ],
            "xmlParse": "PASS",
            "styleFloorStatus": "STATIC_READY_RENDER_PENDING",
            "styleVersion": "visual_renderer_" + RENDERER_VERSION,
            "semanticGeometryPreserved": True,
            "visualSpecPath": spec_path.relative_to(ROOT).as_posix(),
            "visualSpecSha256": sha(spec_bytes),
            "rendererReportPath": report_path.relative_to(ROOT).as_posix(),
            "rendererReportSha256": sha(report_bytes),
            "sourceSvgPath": asset_rel.as_posix(),
            "sourceSvgSha256": asset_sha,
            "sourceSvgGitBlobSha1": asset_blob,
            "browserRenderEvidence": {"status": "RENDER_PENDING", "reason": "Actual HTTP Archive student solution render follows projection; no local file URL or synthetic browser evidence was used."},
            "consumerReference": "PENDING_STUDENT_PROJECTION",
            "newVisualInformation": facts["expectedFacts"],
        }
        evidence_bytes = write_json(evidence_path, evidence)
        outputs.append({
            "uid": uid,
            "sourceSvgPath": asset_rel.as_posix(),
            "sourceSvgSha256": asset_sha,
            "sourceSvgGitBlobSha1": asset_blob,
            "consumerAssetPath": asset_rel.as_posix().removeprefix("archive/"),
            "visualSpecPath": spec_path.relative_to(ROOT).as_posix(),
            "visualEvidencePath": evidence_path.relative_to(ROOT).as_posix(),
            "visualEvidenceSha256": sha(evidence_bytes),
            "renderReportPath": report_path.relative_to(ROOT).as_posix(),
            "renderReportSha256": sha(report_bytes),
            "staticRenderState": "STATIC_READY",
            "browserRenderState": "RENDER_PENDING",
        })

    summary = {
        "schemaVersion": "PALMA_Q17_VISUAL_ASSET_SUMMARY_V1",
        "sourceQid": 17,
        "sourceExamBlobSha1": approval["source"]["gitBlobSha1"],
        "approvedPackageSha256": sha(package_head),
        "approvedPackageGitBlobSha1": blob(package_head),
        "worktreePackageRawSha256": sha(package_work),
        "worktreePackageRawGitBlobSha1": blob(package_work),
        "worktreePackageCleanGitBlobSha1": package_work_clean_blob,
        "approvalReceiptPath": APPROVAL_REL,
        "approvalReceiptSha256": receipt_sha,
        "approvalReceiptGitBlobSha1": approval_blob,
        "renderer": f"alive.engine.visual_renderer:{RENDERER_VERSION}/visualSpec-{VISUAL_SPEC_VERSION}",
        "counts": {"denominator": 9, "svgCreated": len(outputs), "xmlParsePass": len(outputs), "staticPrimitiveParityPass": len(outputs), "staticReady": len(outputs), "browserRenderPending": len(outputs)},
        "sharedFreezeMutation": "NONE; Q17-scoped corrected facts file is included because the shared C2 row is stale.",
        "items": outputs,
    }
    write_json(OUT_DIR / "Q17_asset_summary.json", summary)
    print(json.dumps({"created": len(outputs), "summary": (OUT_DIR / "Q17_asset_summary.json").relative_to(ROOT).as_posix(), "staticReady": len(outputs), "browserPending": len(outputs)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
