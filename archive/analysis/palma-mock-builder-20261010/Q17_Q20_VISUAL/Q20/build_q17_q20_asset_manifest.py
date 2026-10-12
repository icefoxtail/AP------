from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path.cwd()
VISUAL_ROOT = ROOT / "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL"
ASSET_ROOT = ROOT / "archive/assets/generated-lite/palma-speed-pilot"
APPROVAL_PATH = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json"
MANIFEST = VISUAL_ROOT / "visual_asset_manifest.json"


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest().upper()


def blob(raw: bytes) -> str:
    return hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()


def canonical(path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"HEAD:{path}"], cwd=ROOT)


def readjson(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def evidence_for(qid: int, uid: str) -> Path:
    folder = VISUAL_ROOT / f"Q{qid}"
    candidates = list(folder.glob(f"{uid}*evidence*.json"))
    candidates = [p for p in candidates if "summary" not in p.name.lower()]
    if len(candidates) != 1:
        raise RuntimeError(f"expected exactly one physical evidence file for {uid}, found {[p.name for p in candidates]}")
    return candidates[0]


def alt_text(qid: int, evidence: dict[str, Any], table: dict[str, Any] | None = None) -> str:
    for key in ("alt", "altText", "solutionImageAlt", "studentFacingAlt", "visualAlt"):
        if isinstance(evidence.get(key), str) and evidence[key].strip():
            return evidence[key].strip()
    if qid == 17:
        return "반사로 펼친 경로의 점 P₁, Q, R, P₂의 순서와 최솟값이 되는 선분을 나타낸 도형."
    if qid == 18:
        return "삼각형 ABC에서 BC 위의 H와 중선 위의 G, I 및 두 삼각형의 넓이비를 나타낸 도형."
    if qid == 19:
        labels = (evidence.get("actualSvgPrimitives") or {}).get("annotations", [])
        case = next((s for s in labels if s.startswith(("m=", "n="))), "대표 직선")
        radii = next((s for s in labels if s.startswith("반지름")), "세 원호의 반지름")
        return f"큰 원과 두 반원호, 직선 {case}, {radii}; 접선과 끝점 중복 경계를 구분한 도형."
    if qid == 20:
        rows = (table or {}).get("actualSvgPrimitives", {}).get("cellTexts", [])
        headings = " / ".join(rows[:3]) if rows else "극단 배치"
        return f"{evidence.get('sourceSemanticIdentity', {}).get('checks', [{}])[0].get('sourceLabel', '집합 A')}와 집합 B의 네 소속 영역, 합집합, 전체 인원을 정확히 비교한 표({headings})."
    raise RuntimeError(f"no alt text route for qid {qid}")


def main() -> None:
    approval_raw = canonical(APPROVAL_PATH)
    approval = json.loads(approval_raw.decode("utf-8"))
    approval_blob = subprocess.check_output(["git", "rev-parse", f"HEAD:{APPROVAL_PATH}"], cwd=ROOT, text=True).strip()
    package_records = {int(row["sourceQid"]): row for row in approval["packages"] if 17 <= int(row["sourceQid"]) <= 20}
    assert set(package_records) == {17, 18, 19, 20}
    triage = readjson(VISUAL_ROOT / "visual-triage-freeze.json")
    rows_by_uid = {row["uid"]: row for row in triage["rows"] if 17 <= row["sourceQid"] <= 20}
    assert len(rows_by_uid) == 36 and triage["uniqueUidDenominator"] == 36
    output_items = []
    for qid in range(17, 21):
        approved_package = json.loads(canonical(package_records[qid]["path"]).decode("utf-8"))
        for item in approved_package["items"]:
            uid = item["uid"]
            if uid not in rows_by_uid:
                raise RuntimeError(f"missing frozen visual decisions for {uid}")
            triage_row = rows_by_uid[uid]
            evidence_path = evidence_for(qid, uid)
            evidence_bytes = evidence_path.read_bytes()
            evidence = json.loads(evidence_bytes.decode("utf-8"))
            asset_path = ASSET_ROOT / f"{uid}-solution.svg"
            if not asset_path.is_file():
                raise RuntimeError(f"missing projected solution asset for {uid}: {asset_path}")
            asset_bytes = asset_path.read_bytes()
            svg_sha = sha(asset_bytes)
            svg_blob = blob(asset_bytes)
            evidence_asset_sha = evidence.get("sourceSvgSha256") or evidence.get("finalSvgSha256") or evidence.get("assetSha256")
            evidence_asset_blob = evidence.get("sourceSvgGitBlobSha1") or evidence.get("finalSvgGitBlobSha1")
            if evidence_asset_sha and evidence_asset_sha.lower().removeprefix("sha256:") != svg_sha.lower():
                raise RuntimeError(f"evidence final SVG SHA mismatch for {uid}")
            if evidence_asset_blob and evidence_asset_blob.lower() != svg_blob:
                raise RuntimeError(f"evidence final SVG Git blob mismatch for {uid}")
            report_path = None
            for pattern in (f"{uid}*.render-report.json", f"{uid}*.visual-render-report.json"):
                found = list((VISUAL_ROOT / f"Q{qid}").glob(pattern))
                if found:
                    report_path = found[0]
                    break
            report = readjson(report_path) if report_path else {}
            renderer = report.get("renderer") or evidence.get("renderer") or (evidence.get("renderBackend") or {}).get("name")
            renderer_version = report.get("rendererVersion") or evidence.get("rendererVersion") or (evidence.get("renderBackend") or {}).get("version")
            if not renderer:
                renderer = "alive.engine.visual_renderer.render_visual_spec" if renderer_version else "UNKNOWN"
            renderer_value = f"{renderer} ({renderer_version})" if renderer_version and renderer_version not in renderer else renderer
            alt = alt_text(qid, evidence, evidence)
            output_items.append({
                "uid": uid,
                "sourceQid": qid,
                "problemDecision": triage_row["problemDecision"],
                "solutionDecision": triage_row["solutionDecision"],
                "solutionAsset": {
                    "sourceSvgPath": asset_path.relative_to(ROOT).as_posix(),
                    "sourceSvgSha256": svg_sha,
                    "sourceSvgGitBlobSha1": svg_blob,
                    "consumerAssetPath": f"assets/generated-lite/palma-speed-pilot/{uid}-solution.svg",
                    "renderer": renderer_value,
                    "renderStatus": "STATIC_READY/PENDING_POST_PROJECTION_ARCHIVE_MODE_SOL",
                    "visualEvidencePath": evidence_path.relative_to(ROOT).as_posix(),
                    "visualEvidenceSha256": sha(evidence_bytes),
                    "alt": alt,
                },
            })
    assert len(output_items) == 36
    assert len({row["uid"] for row in output_items}) == 36
    manifest = {
        "schemaVersion": "PALMA_QID9_VISUAL_ASSET_MANIFEST_V1",
        "sourceExamBlobSha1": "4cfce909c023e5c4df4a759945c8cc3e0a63ec76",
        "packageApprovalReceiptPath": APPROVAL_PATH,
        "packageApprovalReceiptSha256": sha(approval_raw),
        "packageApprovalReceiptCanonicalSha256": sha(approval_raw),
        "packageApprovalReceiptGitBlobSha1": approval_blob,
        "denominator": 36,
        "problemNeedCounts": {"EXEMPT": 36, "BENEFICIAL": 0, "REQUIRED": 0},
        "solutionNeedCounts": {"EXEMPT": 0, "BENEFICIAL": 36, "REQUIRED": 0},
        "renderStatusCounts": {"STATIC_READY/PENDING_POST_PROJECTION_ARCHIVE_MODE_SOL": 36},
        "items": output_items,
    }
    raw = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    MANIFEST.write_bytes(raw)
    print(json.dumps({"manifestPath": MANIFEST.relative_to(ROOT).as_posix(), "manifestSha256": sha(raw), "denominator": len(output_items),
                      "receiptSha256": manifest["packageApprovalReceiptSha256"], "items": [{"uid": row["uid"], "assetSha256": row["solutionAsset"]["sourceSvgSha256"],
                      "evidenceSha256": row["solutionAsset"]["visualEvidenceSha256"], "renderStatus": row["solutionAsset"]["renderStatus"]} for row in output_items]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
