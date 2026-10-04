import argparse
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


STATUSES = [
    "unchecked",
    "reviewed_pass",
    "reviewed_warn",
    "repair_ready",
    "repaired",
    "blocked_source_missing",
    "skip_final",
]

AGGREGATE_PRIORITY = [
    "aggregate_findings_final_strict_round1.json",
    "aggregate_findings_final_round1.json",
    "aggregate_findings.json",
]

CHUNK_FINDING_PATTERNS = [
    "agent_chunk_*_strict_*_findings.json",
    "agent_chunk_*_retry_*_findings.json",
    "agent_chunk_[0-9][0-9]_findings.json",
]

BLOCKED_KEYWORDS = [
    "source not located",
    "source could not be located",
    "source recovery required",
    "full-page evidence mismatch",
    "full page evidence mismatch",
    "crop/full-page evidence mismatch",
    "not_inspected",
    "could not be opened",
    "could not inspect",
]


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def path_mtime_iso(path):
    try:
        return datetime.fromtimestamp(Path(path).stat().st_mtime, timezone.utc).isoformat().replace("+00:00", "Z")
    except Exception:
        return ""


def read_json(path, default=None):
    path = Path(path)
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def write_text_atomic(path, text):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8", newline="\n")
    tmp.replace(path)


def write_json_atomic(path, data):
    write_text_atomic(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def normalize_path(value):
    return str(value or "").replace("\\", "/")


def file_key(candidate_file):
    return normalize_path(candidate_file)


def has_actionable_expected_correction(item):
    correction = item.get("expectedCorrection")
    if not isinstance(correction, dict):
        return False
    content = str(correction.get("content") or "").strip()
    choices = correction.get("choices")
    if content:
        return True
    if isinstance(choices, list) and any(str(choice or "").strip() for choice in choices):
        return True
    return False


def is_blocked_source_finding(item):
    severity = str(item.get("severity") or "").upper()
    haystack = " ".join(
        str(item.get(key) or "")
        for key in ["field", "issue", "notes", "evidencePath"]
    ).lower()
    if severity == "NOT_INSPECTED":
        return True
    if "used fullpageimagepaths" in haystack or "full page image inspected" in haystack:
        return False
    return any(keyword in haystack for keyword in BLOCKED_KEYWORDS) and not has_actionable_expected_correction(item)


def select_aggregate_path(review_dir):
    review_dir = Path(review_dir)
    for name in AGGREGATE_PRIORITY:
        path = review_dir / name
        if path.exists():
            return path
    candidates = sorted(review_dir.glob("aggregate_findings*.json"))
    return candidates[0] if candidates else None


def selected_related_items(selected_sources, suffix):
    paths = []
    for source in selected_sources:
        path = Path(source["path"])
        related_path = path.with_name(path.stem + suffix)
        if related_path.exists() and related_path not in paths:
            paths.append(related_path)
    items = []
    for path in paths:
        data = read_json(path, {})
        for item in data.get("items") or []:
            item = dict(item)
            item.setdefault("sourceReport", str(path))
            items.append(item)
    return items


def finding_identity(item):
    question_key = item.get("id")
    if question_key is None or question_key == "":
        question_key = item.get("displayNo") or ""
    return (
        file_key(item.get("candidateFile")),
        str(question_key),
        str(item.get("field") or ""),
    )


def load_worklist_files(review_dir):
    review_dir = Path(review_dir)
    files = {}
    summary = read_json(review_dir / "summary.json", {})
    chunks = summary.get("chunks") or []
    chunk_paths = []
    for chunk in chunks:
        path = chunk.get("path")
        if path:
            chunk_paths.append(Path(path))
    if not chunk_paths:
        chunk_paths = sorted(review_dir.glob("agent_chunk_[0-9][0-9].json"))

    for path in chunk_paths:
        if not path.is_absolute():
            path = review_dir / path
        data = read_json(path, {})
        for item in data.get("items") or []:
            key = file_key(item.get("candidateFile"))
            if not key:
                continue
            files[key] = {
                "fileKey": key,
                "examId": item.get("examId") or "",
                "term": item.get("term") or "",
                "candidateFile": item.get("candidateFile") or "",
                "examDir": item.get("examDir") or "",
                "status": "unchecked",
                "questionCount": int(item.get("questionCount") or 0),
                "riskCount": int(item.get("riskCount") or 0),
                "findingCount": 0,
                "failCount": 0,
                "warnCount": 0,
                "notInspectedCount": 0,
                "passCount": 0,
                "repairCandidateCount": 0,
                "repairedCount": 0,
                "blockedReason": "",
                "changedQuestionIds": [],
                "removedQuestionIds": [],
                "sourceReports": [],
                "evidencePaths": [],
                "lastReviewedAt": "",
                "lastRepairedAt": "",
                "memo": "",
            }
    return files, summary


def load_findings(review_dir):
    aggregate_path = select_aggregate_path(review_dir)
    selected_sources = []
    unparsed_items = []
    if aggregate_path:
        data = read_json(aggregate_path, {})
        findings = data.get("findings") or []
        selected_sources.append({
            "kind": "aggregate",
            "priority": AGGREGATE_PRIORITY.index(aggregate_path.name) + 1 if aggregate_path.name in AGGREGATE_PRIORITY else 99,
            "path": str(aggregate_path),
            "findingCount": len(findings),
            "selectionReason": "highest-priority aggregate present; chunk findings ignored",
        })
    else:
        findings = []
        seen = set()
        for priority, pattern in enumerate(CHUNK_FINDING_PATTERNS, start=4):
            for path in sorted(Path(review_dir).glob(pattern)):
                data = read_json(path, {})
                source_findings = data.get("findings") or []
                used_count = 0
                for finding in source_findings:
                    finding = dict(finding)
                    identity = finding_identity(finding)
                    if not identity[0] or identity in seen:
                        continue
                    seen.add(identity)
                    finding.setdefault("sourceReport", str(path))
                    findings.append(finding)
                    used_count += 1
                if source_findings:
                    selected_sources.append({
                        "kind": "chunk",
                        "priority": priority,
                        "path": str(path),
                        "findingCount": used_count,
                        "selectionReason": "aggregate absent; chunk priority fallback with duplicate suppression",
                    })
    grouped = defaultdict(list)
    for finding in findings:
        key = file_key(finding.get("candidateFile"))
        if key:
            grouped[key].append(finding)
        else:
            unparsed_items.append({"source": finding.get("sourceReport") or str(aggregate_path or ""), "reason": "missing_candidateFile", "raw": finding})
    return grouped, selected_sources, unparsed_items


def load_repair_candidates(selected_sources):
    grouped = defaultdict(list)
    for item in selected_related_items(selected_sources, "_repair_candidates.json"):
        key = file_key(item.get("candidateFile"))
        if key and has_actionable_expected_correction(item):
            grouped[key].append(item)
    return grouped


def load_correction_items(correction_json):
    grouped = defaultdict(list)
    if not correction_json:
        return grouped
    data = read_json(correction_json, {})
    for item in data.get("items") or []:
        if str(item.get("status") or "").lower() != "repaired":
            continue
        key = file_key(item.get("candidateFile"))
        if key:
            grouped[key].append(item)
    return grouped


def load_markers(markers_dir):
    markers = {}
    markers_dir = Path(markers_dir)
    if not markers_dir.exists():
        return markers
    for path in sorted(markers_dir.glob("*.review.json")):
        data = read_json(path, {})
        key = file_key(data.get("candidateFile")) or file_key(data.get("fileKey"))
        if key:
            markers[key] = data
    return markers


def ensure_file_entry(files, candidate_file, fallback=None):
    key = file_key(candidate_file)
    if not key:
        return None
    if key not in files:
        fallback = fallback or {}
        files[key] = {
            "fileKey": key,
            "examId": fallback.get("examId") or Path(normalize_path(candidate_file)).stem.replace(".candidate", ""),
            "term": fallback.get("term") or "",
            "candidateFile": candidate_file,
            "examDir": fallback.get("examDir") or "",
            "status": "unchecked",
            "questionCount": 0,
            "riskCount": 0,
            "findingCount": 0,
            "failCount": 0,
            "warnCount": 0,
            "notInspectedCount": 0,
            "passCount": 0,
            "repairCandidateCount": 0,
            "repairedCount": 0,
            "blockedReason": "",
            "changedQuestionIds": [],
            "removedQuestionIds": [],
            "sourceReports": [],
            "evidencePaths": [],
            "lastReviewedAt": "",
            "lastRepairedAt": "",
            "memo": "created from correction/findings without worklist entry",
        }
    return files[key]


def add_unique(target, values):
    seen = set(target)
    for value in values:
        if value and value not in seen:
            target.append(value)
            seen.add(value)


def apply_findings(files, findings_by_file, selected_sources):
    selected_paths = [source["path"] for source in selected_sources]
    for key, findings in findings_by_file.items():
        row = ensure_file_entry(files, findings[0].get("candidateFile"), findings[0])
        if not row:
            continue
        severities = Counter(str(item.get("severity") or "").upper() for item in findings)
        row["findingCount"] = len(findings)
        row["failCount"] = severities.get("FAIL", 0)
        row["warnCount"] = severities.get("WARN", 0)
        row["notInspectedCount"] = severities.get("NOT_INSPECTED", 0)
        row["passCount"] = severities.get("PASS", 0)
        add_unique(row["sourceReports"], [str(item.get("sourceReport") or "") for item in findings] or selected_paths)
        add_unique(row["evidencePaths"], [str(item.get("evidencePath") or "") for item in findings])
        if selected_paths:
            row["lastReviewedAt"] = max(path_mtime_iso(path) for path in selected_paths)


def apply_repair_candidates(files, candidates_by_file):
    for key, items in candidates_by_file.items():
        row = ensure_file_entry(files, items[0].get("candidateFile"), items[0])
        if not row:
            continue
        row["repairCandidateCount"] = len(items)
        add_unique(row["changedQuestionIds"], [item.get("id") for item in items])
        add_unique(row["sourceReports"], [str(item.get("sourceReport") or "") for item in items])
        add_unique(row["evidencePaths"], [str(item.get("evidencePath") or "") for item in items])


def apply_corrections(files, corrections_by_file, correction_json):
    for key, items in corrections_by_file.items():
        row = ensure_file_entry(files, items[0].get("candidateFile"), items[0])
        if not row:
            continue
        row["repairedCount"] = len(items)
        add_unique(row["changedQuestionIds"], [item.get("questionId") for item in items])
        add_unique(row["sourceReports"], [str(correction_json or "")])
        repaired_at = next((str(item.get("verifiedAt") or "") for item in items if item.get("verifiedAt")), "")
        row["lastRepairedAt"] = repaired_at or path_mtime_iso(correction_json)


def determine_status(row, findings, repair_candidates, corrections, marker):
    if marker and marker.get("status") == "skip_final":
        row["memo"] = marker.get("reason") or row.get("memo", "")
        return "skip_final"
    if corrections:
        return "repaired"
    blocked_findings = [item for item in findings if is_blocked_source_finding(item)]
    if blocked_findings:
        row["blockedReason"] = blocked_findings[0].get("issue") or blocked_findings[0].get("notes") or "source evidence unavailable"
        return "blocked_source_missing"
    if repair_candidates or any(has_actionable_expected_correction(item) for item in findings):
        return "repair_ready"
    if findings and all(str(item.get("severity") or "").upper() == "PASS" for item in findings):
        return "reviewed_pass"
    if findings:
        return "reviewed_warn"
    return "unchecked"


def marker_for_row(row):
    return {
        "stage": "content-choice-image-review-marker",
        "fileKey": row["fileKey"],
        "examId": row["examId"],
        "candidateFile": row["candidateFile"],
        "status": row["status"],
        "reason": row.get("blockedReason") or row.get("memo") or "",
        "updatedAt": now_iso(),
        "updatedBy": "script",
    }


def safe_marker_name(row):
    raw = row.get("examId") or Path(normalize_path(row.get("candidateFile"))).stem
    bad = '<>:"/\\|?*'
    name = "".join("_" if ch in bad else ch for ch in raw).strip() or "unknown"
    return name + ".review.json"


def queue_payload(status_filter, items):
    return {
        "generatedAt": now_iso(),
        "statusFilter": status_filter,
        "count": len(items),
        "items": items,
    }


def write_queues(queues_dir, files):
    queues_dir = Path(queues_dir)
    queue_defs = {
        "todo_review.json": ["unchecked", "reviewed_warn"],
        "todo_repair.json": ["repair_ready"],
        "todo_source_recovery.json": ["blocked_source_missing"],
        "done_skip_final.json": ["reviewed_pass", "repaired", "skip_final"],
    }
    paths = {}
    for filename, statuses in queue_defs.items():
        items = [row for row in files if row["status"] in statuses]
        path = queues_dir / filename
        write_json_atomic(path, queue_payload(statuses, items))
        paths[filename] = str(path)
    return {
        "todoReviewPath": paths["todo_review.json"],
        "todoRepairPath": paths["todo_repair.json"],
        "todoSourceRecoveryPath": paths["todo_source_recovery.json"],
        "doneSkipFinalPath": paths["done_skip_final.json"],
    }


def md_table(headers, rows):
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell).replace("\n", " ") for cell in row) + " |")
    return lines


def write_markdown(path, board):
    files = board["files"]
    by_status = defaultdict(list)
    for row in files:
        by_status[row["status"]].append(row)

    lines = ["# Content/Choice/Image Review Status Board", "", "## Summary"]
    for status in STATUSES:
        lines.append(f"- {status}: {board['statusCounts'].get(status, 0)}")
    lines.extend([
        "",
        "## Finding Source Policy",
        f"- findingSourcePolicy: {board['findingSourcePolicy']}",
        "- selected sources:",
    ])
    for source in board["selectedFindingSources"]:
        lines.append(
            f"  - priority {source['priority']} / {source['kind']} / "
            f"{source['path']} / findings {source['findingCount']}"
        )
    lines.extend(["", "## Next Actions", "", "### 1. Repair Ready"])
    lines.extend(md_table(["status", "examId", "candidateFile", "fail", "warn", "repairCandidateCount"], [
        [row["status"], row["examId"], row["candidateFile"], row["failCount"], row["warnCount"], row["repairCandidateCount"]]
        for row in by_status["repair_ready"]
    ]))
    lines.extend(["", "### 2. Source Recovery Needed"])
    lines.extend(md_table(["status", "examId", "candidateFile", "blockedReason"], [
        [row["status"], row["examId"], row["candidateFile"], row["blockedReason"]]
        for row in by_status["blocked_source_missing"]
    ]))
    lines.extend(["", "### 3. Review Remaining"])
    lines.extend(md_table(["status", "examId", "candidateFile", "riskCount", "findingCount"], [
        [row["status"], row["examId"], row["candidateFile"], row["riskCount"], row["findingCount"]]
        for row in by_status["unchecked"] + by_status["reviewed_warn"]
    ]))
    lines.extend(["", "### 4. Done / Skip"])
    lines.extend(md_table(["status", "examId", "candidateFile", "repairedCount"], [
        [row["status"], row["examId"], row["candidateFile"], row["repairedCount"]]
        for row in by_status["reviewed_pass"] + by_status["repaired"] + by_status["skip_final"]
    ]))
    write_text_atomic(path, "\n".join(lines) + "\n")


def build_status_board(
    review_dir,
    out_json,
    out_md,
    correction_json=None,
    markers_dir=None,
    queues_dir=None,
    write_markers=False,
):
    review_dir = Path(review_dir).resolve()
    out_json = Path(out_json).resolve()
    out_md = Path(out_md).resolve()
    markers_dir = Path(markers_dir).resolve() if markers_dir else review_dir / "markers"
    queues_dir = Path(queues_dir).resolve() if queues_dir else review_dir / "queues"
    correction_json = Path(correction_json).resolve() if correction_json else None

    files, summary = load_worklist_files(review_dir)
    findings_by_file, selected_sources, finding_unparsed = load_findings(review_dir)
    candidates_by_file = load_repair_candidates(selected_sources)
    corrections_by_file = load_correction_items(correction_json)
    markers = load_markers(markers_dir)

    apply_findings(files, findings_by_file, selected_sources)
    apply_repair_candidates(files, candidates_by_file)
    apply_corrections(files, corrections_by_file, correction_json)

    for key, row in files.items():
        row["status"] = determine_status(
            row,
            findings_by_file.get(key, []),
            candidates_by_file.get(key, []),
            corrections_by_file.get(key, []),
            markers.get(key),
        )

    rows = sorted(files.values(), key=lambda row: (STATUSES.index(row["status"]), row["term"], row["examId"], row["candidateFile"]))
    counts = {status: 0 for status in STATUSES}
    counts.update(Counter(row["status"] for row in rows))
    queue_paths = write_queues(queues_dir, rows)

    board = {
        "stage": "content-choice-image-review-status-board",
        "generatedAt": now_iso(),
        "reviewDir": str(review_dir),
        "sourceEvidencePolicy": summary.get("sourceEvidencePolicy") or "full_page_first_crop_zoom_only",
        "findingSourcePolicy": "aggregate_only_when_available_priority_fallback",
        "selectedFindingSources": selected_sources,
        "unparsedItems": finding_unparsed + ((read_json(correction_json, {}) or {}).get("unparsedItems") if correction_json else []),
        "statusCounts": counts,
        "files": rows,
        "queues": queue_paths,
    }

    write_json_atomic(out_json, board)
    write_markdown(out_md, board)

    if write_markers:
        markers_dir.mkdir(parents=True, exist_ok=True)
        for row in rows:
            write_json_atomic(markers_dir / safe_marker_name(row), marker_for_row(row))

    return board


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-dir", required=True)
    parser.add_argument("--out-json", required=True)
    parser.add_argument("--out-md", required=True)
    parser.add_argument("--correction-json", default="")
    parser.add_argument("--markers-dir", default="")
    parser.add_argument("--queues-dir", default="")
    parser.add_argument("--write-markers", action="store_true")
    args = parser.parse_args()

    board = build_status_board(
        review_dir=args.review_dir,
        out_json=args.out_json,
        out_md=args.out_md,
        correction_json=args.correction_json or None,
        markers_dir=args.markers_dir or None,
        queues_dir=args.queues_dir or None,
        write_markers=args.write_markers,
    )
    print(json.dumps({
        "fileCount": len(board["files"]),
        "statusCounts": board["statusCounts"],
        "queues": board["queues"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
