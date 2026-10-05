import argparse
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-dir", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--include-retry", action="store_true")
    parser.add_argument("--exclude-original-chunks", default="", help="comma-separated chunk numbers to ignore, e.g. 3")
    args = parser.parse_args()

    review_dir = Path(args.review_dir).resolve()
    out = Path(args.out).resolve()
    summary_path = review_dir / "summary.json"
    summary = read_json(summary_path) if summary_path.exists() else {}
    expected = summary.get("chunks") or []
    findings = []
    chunk_reports = []
    missing_reports = []
    invalid_reports = []

    excluded = {int(x) for x in args.exclude_original_chunks.split(",") if x.strip()}
    for chunk in expected:
        if int(chunk["chunk"]) in excluded:
            continue
        path = review_dir / f"agent_chunk_{int(chunk['chunk']):02d}_findings.json"
        if not path.exists():
            missing_reports.append(str(path))
            continue
        try:
            data = read_json(path)
        except Exception as exc:
            invalid_reports.append({"path": str(path), "error": str(exc)})
            continue
        chunk_reports.append(
            {
                "chunk": data.get("chunk", chunk["chunk"]),
                "path": str(path),
                "examCountReviewed": data.get("examCountReviewed", 0),
                "questionCountReviewed": data.get("questionCountReviewed", 0),
                "passCount": data.get("passCount", 0),
                "warnCount": data.get("warnCount", 0),
                "failCount": data.get("failCount", 0),
                "notInspectedCount": data.get("notInspectedCount", 0),
                "findingCount": len(data.get("findings") or []),
            }
        )
        for finding in data.get("findings") or []:
            finding["sourceReport"] = str(path)
            findings.append(finding)
    if args.include_retry:
        retry_paths = list(review_dir.glob("agent_chunk_*_retry_*_findings.json"))
        retry_paths.extend(review_dir.glob("agent_chunk_*_strict_*_findings.json"))
        for path in sorted(retry_paths):
            try:
                data = read_json(path)
            except Exception as exc:
                invalid_reports.append({"path": str(path), "error": str(exc)})
                continue
            chunk_reports.append(
                {
                    "chunk": data.get("chunk", path.stem),
                    "path": str(path),
                    "examCountReviewed": data.get("examCountReviewed", 0),
                    "questionCountReviewed": data.get("questionCountReviewed", 0),
                    "passCount": data.get("passCount", 0),
                    "warnCount": data.get("warnCount", 0),
                    "failCount": data.get("failCount", 0),
                    "notInspectedCount": data.get("notInspectedCount", 0),
                    "findingCount": len(data.get("findings") or []),
                }
            )
            for finding in data.get("findings") or []:
                finding["sourceReport"] = str(path)
                findings.append(finding)

    by_severity = Counter(str(item.get("severity") or "UNKNOWN") for item in findings)
    by_field = Counter(str(item.get("field") or "unknown") for item in findings)
    by_term = defaultdict(Counter)
    for item in findings:
        by_term[str(item.get("term") or "unknown")][str(item.get("severity") or "UNKNOWN")] += 1

    repair_candidates = [
        item
        for item in findings
        if str(item.get("severity") or "").upper() in {"FAIL", "WARN"}
        and item.get("expectedCorrection")
    ]
    fail_items = [item for item in findings if str(item.get("severity") or "").upper() == "FAIL"]

    aggregate = {
        "stage": "aggregate-content-choice-image-1to1-review-findings",
        "generatedAt": now_iso(),
        "reviewDir": str(review_dir),
        "expectedChunkCount": len(expected),
        "completedChunkCount": len(chunk_reports),
        "missingReports": missing_reports,
        "invalidReports": invalid_reports,
        "chunkReports": chunk_reports,
        "findingCount": len(findings),
        "bySeverity": dict(by_severity),
        "byField": dict(by_field),
        "byTermSeverity": {term: dict(counter) for term, counter in sorted(by_term.items())},
        "failCount": len(fail_items),
        "repairCandidateCount": len(repair_candidates),
        "failItemsPath": str(out.with_name(out.stem + "_fail_items.json")),
        "repairCandidatesPath": str(out.with_name(out.stem + "_repair_candidates.json")),
        "findings": findings,
        "status": "complete" if not missing_reports and not invalid_reports else "waiting_for_reports",
    }
    write_json(out.with_name(out.stem + "_fail_items.json"), {"items": fail_items})
    write_json(out.with_name(out.stem + "_repair_candidates.json"), {"items": repair_candidates})
    write_json(out, aggregate)
    print(json.dumps({k: aggregate[k] for k in ["completedChunkCount", "expectedChunkCount", "findingCount", "bySeverity", "failCount", "repairCandidateCount", "status"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
