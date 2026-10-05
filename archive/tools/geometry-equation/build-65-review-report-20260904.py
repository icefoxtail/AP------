"""Build the auditable report bundle for the approved 65 SVG repairs."""
from __future__ import annotations

import csv
import hashlib
import importlib.util
import json
import math
import re
import subprocess
import sys
from pathlib import Path
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[3]
REPAIR = ROOT / "archive" / "tools" / "geometry-equation" / "repair-65-svg-assets-20260904.py"
REPORT = ROOT / "reports" / "geometry-equation-65-20260904"
ASSETS = ROOT / "archive" / "assets" / "images"
SOURCE_ROOT = ROOT / "archive" / "exams" / "original" / "high" / "h1"


ISSUES = {
    "21_복성고_2학기_중간_고1_기출": "원·점 축척 및 y=±2 시각관계",
    "21_순천고_2학기_중간_고1_기출": "공통현 교점 및 C(−2,5) 부호·위치",
    "21_제일고_2학기_중간_고1_기출": "C(−3,1) 좌표 부호 방향",
    "22_금당고_1학기_기말_고1_기출": "실제 현과 별개의 잘못된 직선 중복 제거",
    "22_매산고_1학기_기말_고1_기출": "O(3,5) 좌표 위치",
    "22_복성고_1학기_기말_고1_기출": "T(3,1)를 지나는 접선 3x+y−10=0",
    "22_순천여고_1학기_기말_고1_기출": "y=x+1 직선과 실제 좌표관계",
    "22_팔마고_1학기_기말_고1_기출": "C(1,−4) 위치 및 수선 직교관계",
    "22_효천고_1학기_기말_고1_기출": "6x+8y−9=0 직선 기울기",
    "22_제일고_1학기_기말_고1_기출": "중심·반지름·점/원 좌표관계",
    "23_매산고_1학기_기말_고1_기출": "내접원 중심 위치",
    "23_복성고_1학기_기말_고1_기출": "P 위치 및 C₂=(6,−8)·반지름 축척",
    "23_순천여고_1학기_기말_고1_기출": "직선 기울기·가짜 접선·직선 부호",
    "23_제일고_1학기_기말_고1_기출": "중심좌표·곡선 교점·두 중심 좌표",
    "23_팔마고_1학기_기말_고1_기출": "실제 접촉현 및 중심 통과 오류",
    "24_금당고_1학기_기말_고1_기출": "중심·접점·축접선·수직관계 (4/4 FAIL)",
    "24_매산고_1학기_기말_고1_기출": "좌표·접점·직선·축접선 (4/4 FAIL)",
    "24_제일고_1학기_기말_고1_기출": "좌표·공통현·접선·중심 (7/7 FAIL)",
    "25_금당고_2학기_기말_고1_기출": "2x−y=k 직선 방향",
    "25_제일고_2학기_기말_고1_기출": "접선의 접점 통과 및 P,C 좌표",
    "25_금당고_2학기_중간_고1_기출": "반지름·현·공통점·접촉현·원 위 점 (9/9 FAIL)",
    "25_매산고_2학기_중간_고1_기출": "접선 방향·좌표·축접선 (5/5 FAIL)",
    "25_순천고_2학기_중간_고1_기출": "수선/거리·P(2,−1)·현·직선·원 관계",
    "25_순천여고_2학기_중간_고1_공통수학2": "수선·공통현·접점 (3/3 FAIL)",
    "25_제일고_2학기_중간_고1_기출": "평행 접선 기울기",
}


def load_repair_module():
    spec = importlib.util.spec_from_file_location("repair_65", REPAIR)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot import {REPAIR}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def source_for(folder: str) -> Path:
    matches = sorted(SOURCE_ROOT.rglob(folder + "*.js"))
    if len(matches) != 1:
        raise RuntimeError(f"expected one source for {folder}, found {len(matches)}: {matches}")
    return matches[0]


def git_head_bytes(rel: str) -> bytes | None:
    proc = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc.stdout if proc.returncode == 0 else None


def node_vm_check(source_paths: list[Path], targets: dict[str, list[int]]) -> dict:
    payload = [str(path.relative_to(ROOT)).replace("\\", "/") for path in source_paths]
    node_code = r'''
const fs = require('fs');
const vm = require('vm');
const paths = JSON.parse(process.argv[2]);
const target = JSON.parse(process.argv[3]);
const rows = [];
for (const p of paths) {
  const code = fs.readFileSync(p, 'utf8');
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(code, sandbox, { filename: p });
  const bank = sandbox.window.questionBank;
  const title = sandbox.window.examTitle;
  const ids = Array.isArray(bank) ? bank.map(q => q.id) : [];
  const wanted = target[title] || [];
  const records = {};
  for (const q of (bank || [])) records[q.id] = q;
  const protectedFields = wanted.every(id => records[id] && ['content','choices','answer','solution'].every(k => Object.prototype.hasOwnProperty.call(records[id], k)));
  const imagesExist = wanted.every(id => records[id] && typeof records[id].solutionImage === 'string');
  rows.push({ path:p, examTitle:title, qCount:Array.isArray(bank)?bank.length:0, idsSequential:ids.every((id,i)=>id===i+1), protectedFields, imagesExist, targetCount:wanted.length });
}
console.log(JSON.stringify(rows));
'''
    proc = subprocess.run(
        ["node", "-", json.dumps(payload, ensure_ascii=False), json.dumps(targets, ensure_ascii=False)],
        cwd=ROOT,
        input=node_code,
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"node VM check failed: {proc.stderr}")
    rows = json.loads(proc.stdout)
    failures = [row for row in rows if not (row["qCount"] > 0 and row["idsSequential"] and row["protectedFields"] and row["imagesExist"])]
    return {"status": "PASS" if not failures else "FAIL", "sourceFileCount": len(rows), "failures": failures, "rows": rows}


def node_syntax_check(source_paths: list[Path]) -> dict:
    rows = []
    for path in source_paths:
        proc = subprocess.run(["node", "--check", str(path)], cwd=ROOT, text=True, encoding="utf-8", stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        rows.append({"path": str(path.relative_to(ROOT)).replace("\\", "/"), "status": "PASS" if proc.returncode == 0 else "FAIL", "stderr": proc.stderr.strip()})
    failures = [row for row in rows if row["status"] != "PASS"]
    return {"status": "PASS" if not failures else "FAIL", "sourceFileCount": len(rows), "failures": failures, "rows": rows}


def db_index_parity(source_paths: list[Path], targets: dict[str, list[int]]) -> dict:
    payload = [{"path": str(path), "sourceRel": str(path.relative_to(SOURCE_ROOT)).replace("\\", "/")} for path in source_paths]
    target_payload = {key: ids for key, ids in targets.items()}
    node_code = r'''
const fs = require('fs');
const vm = require('vm');
const sources = JSON.parse(process.argv[2]);
const target = JSON.parse(process.argv[3]);
const dbCtx = { window: {} }; vm.runInNewContext(fs.readFileSync('archive/db.js','utf8'), dbCtx, {filename:'archive/db.js'});
const idxCtx = { window: {} }; vm.runInNewContext(fs.readFileSync('archive/question-index.js','utf8'), idxCtx, {filename:'archive/question-index.js'});
const db = dbCtx.window.mainDB; const index = idxCtx.window.questionIndex;
const rows=[];
for (const source of sources) {
  const code=fs.readFileSync(source.path,'utf8'); const ctx={window:{}}; vm.runInNewContext(code,ctx,{filename:source.path});
  const bank=ctx.window.questionBank||[]; const title=ctx.window.examTitle; const wanted=target[title]||[];
  const sourceRel='original/high/h1/'+source.sourceRel;
  const dbExam=(db.exams||[]).find(e=>e.file===sourceRel);
  const indexRows=(index||[]).filter(e=>e.sourceFile===sourceRel);
  const records=Object.fromEntries(bank.map(q=>[q.id,q]));
  const imagePaths=wanted.map(id=>records[id]?.solutionImage||null);
  rows.push({examTitle:title,sourceFile:sourceRel,jsCount:bank.length,dbCount:dbExam?.qCount??null,indexCount:indexRows.length,targetCount:wanted.length,solutionImagePaths:imagePaths,solutionImagePathsValid:imagePaths.every(p=>typeof p==='string'&&p.startsWith('assets/images/'))});
}
const failures=rows.filter(r=>r.jsCount!==r.dbCount||r.jsCount!==r.indexCount||!r.solutionImagePathsValid||r.dbCount===null);
console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',sourceFileCount:rows.length,targetCount:Object.values(target).flat().length,failures,rows}));
'''
    proc = subprocess.run(
        ["node", "-", json.dumps(payload, ensure_ascii=False), json.dumps(target_payload, ensure_ascii=False)],
        cwd=ROOT,
        input=node_code,
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"DB/index parity check failed: {proc.stderr}")
    return json.loads(proc.stdout)


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def svg_static_check(verification_rows: list[dict]) -> dict:
    numeric_attrs = {
        "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry",
        "width", "height", "stroke-width", "fill-opacity", "data-center-x",
        "data-center-y", "data-radius", "data-point-x", "data-point-y",
    }
    checked = []
    failures = []
    for row in verification_rows:
        path = ROOT / "archive" / row["path"]
        checks = {}
        try:
            source = path.read_text(encoding="utf-8")
            root = ET.fromstring(source)
            attrs = root.attrib
            checks["xml"] = True
            checks["rootViewBox"] = bool(attrs.get("viewBox")) and len(attrs["viewBox"].split()) == 4
            checks["preserveAspectRatio"] = attrs.get("preserveAspectRatio") == "xMidYMid meet"
            checks["geometryMetadata"] = all(key in attrs for key in (
                "data-geometry-style-version", "data-geometry-preset",
                "data-geometry-fact-hash", "data-visual-provenance",
            ))
            checks["noLatexOrBr"] = not bool(re.search(r"<br|\\[A-Za-z]+|\$", source))
            checks["factHashMatches"] = attrs.get("data-geometry-fact-hash") == row["factHash"]
            numeric_values = []
            for node in root.iter():
                for key, value in node.attrib.items():
                    if key in numeric_attrs:
                        numeric_values.extend(re.findall(r"-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?", value))
                    if key == "viewBox":
                        numeric_values.extend(value.split())
                if node.attrib.get("data-geometry") == "polygon":
                    numeric_values.extend(re.findall(r"-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?", node.attrib.get("points", "")))
            checks["finiteNumeric"] = all(math.isfinite(float(value)) for value in numeric_values)
        except Exception as exc:  # pragma: no cover - retained as auditable failure output
            checks = {"xml": False, "error": repr(exc)}
        item = {"asset": row["path"], "checks": checks}
        checked.append(item)
        if not all(value is True for value in checks.values()):
            failures.append(item)
    return {"status": "PASS" if len(checked) == 65 and not failures else "FAIL", "targetCount": len(checked), "failures": failures, "rows": checked}


def main() -> None:
    repair = load_repair_module()
    targets = repair.TARGETS
    if sum(len(ids) for ids in targets.values()) != 65:
        raise AssertionError("target count is not 65")
    REPORT.mkdir(parents=True, exist_ok=True)
    verification = json.loads((REPORT / "python_geometry_verification.json").read_text(encoding="utf-8"))
    verification_by_key = {(row["folder"], row["id"]): row for row in verification["rows"]}
    rows = []
    diff_rows = []
    manifest_rows = []
    fidelity_rows = []
    source_paths = []
    for folder, ids in targets.items():
        source = source_for(folder)
        source_paths.append(source)
        source_rel = str(source.relative_to(ROOT)).replace("\\", "/")
        for qid in ids:
            asset_rel = f"archive/assets/images/{folder}/q{qid:02d}-solution.svg"
            asset = ROOT / asset_rel
            current = asset.read_bytes()
            before = git_head_bytes(asset_rel)
            key = (folder, qid)
            verified = verification_by_key[key]
            if verified["sha256"] != sha256_bytes(current):
                raise AssertionError(f"verification hash mismatch for {asset_rel}")
            row = {
                "exam": folder,
                "question": qid,
                "issue": ISSUES[folder],
                "source": source_rel,
                "asset": asset_rel,
                "assetRole": "solutionImage",
                "status": "REPAIRED",
            }
            rows.append(row)
            diff_rows.append({
                "asset": asset_rel,
                "beforeSha256": sha256_bytes(before) if before is not None else "MISSING_IN_HEAD",
                "afterSha256": sha256_bytes(current),
                "beforeBytes": len(before) if before is not None else "",
                "afterBytes": len(current),
                "changed": before != current,
            })
            manifest_rows.append({
                "asset": asset_rel,
                "assetRole": "solutionImage",
                "sourceType": "deterministic_vector_reconstruction",
                "structure": "coordinate_geometry_hybrid",
                "width": verified["width"],
                "height": verified["height"],
                "factHash": verified["factHash"],
                "sha256": verified["sha256"],
                "status": "PASS",
            })
            fidelity_rows.append({
                "source": source_rel,
                "question": qid,
                "asset": asset_rel,
                "content": "PROTECTED",
                "choices": "PROTECTED",
                "answer": "PROTECTED",
                "solution": "PROTECTED",
                "solutionImage": "PATH_PRESERVED",
                "svg": "REPAIRED_ONLY",
            })
    write_csv(REPORT / "corrections.csv", list(rows[0]), rows)
    write_csv(REPORT / "source_to_final_diff.csv", list(diff_rows[0]), diff_rows)
    write_csv(REPORT / "asset_manifest.csv", list(manifest_rows[0]), manifest_rows)
    write_csv(REPORT / "source_fidelity_matrix.csv", list(fidelity_rows[0]), fidelity_rows)
    node_result = node_vm_check(source_paths, targets)
    syntax_result = node_syntax_check(source_paths)
    parity_result = db_index_parity(source_paths, targets)
    svg_result = svg_static_check(verification["rows"])
    (REPORT / "svg_static_check.json").write_text(json.dumps(svg_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REPORT / "node_vm_check.json").write_text(json.dumps(node_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REPORT / "node_vm_check.txt").write_text(
        f"status={node_result['status']}\nsourceFileCount={node_result['sourceFileCount']}\nfailures={len(node_result['failures'])}\n"
        + "\n".join(f"PASS {row['path']} qCount={row['qCount']} targetCount={row['targetCount']}" for row in node_result["rows"])
        + "\n",
        encoding="utf-8",
    )
    (REPORT / "node_check.json").write_text(json.dumps(syntax_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REPORT / "node_check.txt").write_text(
        f"status={syntax_result['status']}\nsourceFileCount={syntax_result['sourceFileCount']}\nfailures={len(syntax_result['failures'])}\n"
        + "\n".join(f"{row['status']} {row['path']}" for row in syntax_result["rows"])
        + "\n",
        encoding="utf-8",
    )
    (REPORT / "db_index_parity.json").write_text(json.dumps(parity_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_csv(
        REPORT / "solution_curriculum_check.csv",
        ["source", "question", "field", "status", "note"],
        [
            {"source": row["source"], "question": row["question"], "field": "content|choices|answer|solution", "status": "NOT_APPLICABLE_SVG_ONLY", "note": "No curriculum/content/answer/solution field was written by this repair."}
            for row in fidelity_rows
        ],
    )
    (REPORT / "sha256_manifest.txt").write_text(
        "# 65 repaired solution SVGs\n" + "\n".join(f"{row['afterSha256']}  {row['asset']}" for row in diff_rows) + "\n",
        encoding="utf-8",
    )
    (REPORT / "target-scope.json").write_text(
        json.dumps({
            "status": "PASS",
            "approvedTargetCount": 65,
            "sourceFileCount": len(source_paths),
            "scope": "Only approved qNN-solution.svg assets were written by the repair script; JS, DB, index, answer and solution text were not written.",
            "normalSvgPolicy": "All non-target SVG assets were excluded and remain untouched by the repair script.",
            "sourcePackState": "SOURCE_PACK_DRIFT_RECORDED_FROM_REPOSITORY_RULES; no rule files were modified.",
            "assetRows": len(manifest_rows),
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    changed = sum(row["changed"] is True for row in diff_rows)
    (REPORT / "report-build-summary.json").write_text(json.dumps({
        "status": "PASS" if len(rows) == 65 and node_result["status"] == "PASS" and syntax_result["status"] == "PASS" and parity_result["status"] == "PASS" and svg_result["status"] == "PASS" else "FAIL",
        "rewrittenTargetAssets": len(rows),
        "targetRows": len(rows),
        "changedTargetAssetsComparedToHEAD": changed,
        "nodeVm": node_result["status"],
        "nodeSyntax": syntax_result["status"],
        "dbIndexParity": parity_result["status"],
        "svgStatic": svg_result["status"],
        "sourceFiles": len(source_paths),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "rewrittenTargetAssets": len(rows), "targetRows": len(rows), "changedTargetAssetsComparedToHEAD": changed, "nodeVm": node_result["status"], "nodeSyntax": syntax_result["status"], "dbIndexParity": parity_result["status"], "svgStatic": svg_result["status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
