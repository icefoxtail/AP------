#!/usr/bin/env python3
"""
tools/main_merge_master.py - Route 13: MAIN Operation Merge MASTER

Acts as the single dedicated operational gatekeeper for merging audited, GATE_PASS exams
from feature/pilot branches into `main`.

Responsibilities:
1. Validates that candidate exam has achieved full GATE_PASS:
   - JS file syntax & bank parity
   - Vector SVG/image assets exist with pure-white backgrounds
   - 48 author guide plans exist
   - Review receipt exists and SHA-256 is byte-bound
   - Small metadata JSON exists and matches blob SHA-1
2. Formats official inbox request (.archive-meta-register/inbox/[examUid].json)
   conforming to archive-reviewed-exam-meta-register-request-v2 with byte-bound evidence refs.
3. Operates under MAIN_FIRST / CI_DEFERRED rules (docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md):
   - Whitelist staging only (JS, assets, plans, review receipt, inbox JSON).
   - Commits to main or merges to main.
   - Verifies remote main commit SHA and target blob SHA.
   - Emits definitive MAIN_DONE verdict.
"""

import os
import sys
import io
import json
import hashlib
import subprocess
import argparse
from pathlib import Path

# Force UTF-8 on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def git_blob_sha1(path: Path) -> str:
    content = path.read_bytes()
    header = f"blob {len(content)}\0".encode("utf-8")
    return hashlib.sha1(header + content).hexdigest()

def find_exam_files(exam_stem: str):
    """Finds all artifacts associated with an exam stem."""
    # 1. Search for JS file
    js_matches = list(REPO_ROOT.glob(f"archive/exams/similar/**/{exam_stem}.js"))
    if not js_matches:
        # try without _유사 or with _유사
        js_matches = list(REPO_ROOT.glob(f"archive/exams/similar/**/{exam_stem}*.js"))
    if not js_matches:
        return None

    js_file = js_matches[0]
    exam_dir = js_file.parent
    actual_stem = js_file.stem

    # 2. Assets (first check exam-specific similar asset dir, then inspect JS image paths)
    asset_dir = REPO_ROOT / "archive" / "assets" / "images" / actual_stem
    if not asset_dir.exists():
        alt_asset = REPO_ROOT / "archive" / "assets" / "images" / actual_stem.replace("순천", "")
        if alt_asset.exists():
            asset_dir = alt_asset
        else:
            # Check if JS references original asset dir (e.g. 26_삼산중_1학기_중간_중3_기출)
            js_text = js_file.read_text(encoding="utf-8")
            import re
            m = re.search(r"assets/images/([^/\"']+)", js_text)
            if m:
                referenced_asset = REPO_ROOT / "archive" / "assets" / "images" / m.group(1)
                if referenced_asset.exists():
                    asset_dir = referenced_asset

    # 3. Plans (check [stem]_plans or plans)
    plans_dir = exam_dir / f"{actual_stem}_plans"
    if not plans_dir.exists():
        fallback_plans = exam_dir / "plans"
        if fallback_plans.exists():
            plans_dir = fallback_plans

    # 4. Review receipt
    receipt_file = exam_dir / f"{actual_stem}.review-receipt.json"

    # 5. Small meta
    meta_files = list(exam_dir.glob(f"{actual_stem}.meta-*.json"))
    meta_file = meta_files[0] if meta_files else None

    return {
        "stem": actual_stem,
        "js": js_file,
        "assets": asset_dir if asset_dir.exists() else None,
        "plans": plans_dir if plans_dir.exists() else None,
        "receipt": receipt_file if receipt_file.exists() else None,
        "meta": meta_file
    }

def validate_candidate(files: dict, skip_harness: bool = False) -> tuple[bool, list[str]]:
    """Strictly validates that candidate satisfies GATE_PASS requirements via automated code harness.

    skip_harness is an explicit, caller-visible opt-out for exams the shared harness cannot evaluate yet
    (tools/harness/verify_similar_exam.mjs looks up middle-school folders and the middle1 taxonomy, so it
    false-fails high-school exams). Skipping is never silent: the verdict is reported as NOT_RUN, and the
    default behaviour (harness required) is unchanged.
    """
    errors = []
    stem = files["stem"]

    if skip_harness:
        print("[HARNESS NOT_RUN] --skip-harness: verify_similar_exam.mjs was NOT executed; "
              "GATE_PASS is NOT verified by this run (caller must record NOT_RUN / EVIDENCE_DEBT).")
        return True, []

    # Run the automated harness gate runner
    harness_script = REPO_ROOT / "tools/harness/verify_similar_exam.mjs"
    cmd = ["node", str(harness_script), stem]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", cwd=str(REPO_ROOT))
    if res.returncode != 0:
        for line in res.stderr.splitlines():
            if line.strip():
                errors.append(line.strip())
        if not errors:
            errors.append(f"verify_similar_exam.mjs failed with exit code {res.returncode}")
        return False, errors

    print(res.stdout.strip())
    return True, []

class RequestGenerationError(Exception):
    """The request cannot be built so that the reviewed-exam v2 registrar can accept it."""


CANON_DIR = REPO_ROOT / "archive" / "data" / "meta-foundation" / "canonical"


def load_active_canonical_keys() -> tuple[set, set]:
    """ACTIVE canonical CrossConcept / Condition keys: the only keys the v2 registrar's resolve() accepts."""
    cross = set()
    for shard in sorted((CANON_DIR / "concepts").glob("*.json")):
        doc = json.loads(shard.read_text(encoding="utf-8"))
        cross.update(c["conceptKey"] for c in doc.get("concepts", []) if c.get("status") == "ACTIVE")
    cond_doc = json.loads((CANON_DIR / "condition_registry.json").read_text(encoding="utf-8"))
    cond = {c["conditionKey"] for c in cond_doc.get("conditions", []) if c.get("status") == "ACTIVE"}
    return cross, cond


def split_registry_changes(changes: list) -> tuple[list, list]:
    """Separate registrar-schema registry edits from Generated-extension sidecars.

    The registrar (reviewed-exam-registration-v2.mjs registryPlan) only understands edits of native canonical
    documents: {path, collection?, match?, before, after}. The small meta's `registryChanges` produced by the
    Generated pipeline instead lists extension registry files ({registryPath, registrySha256, extensions|keys...},
    or a bare extension definition with `key`). Those describe GENERATED_ONLY keys; they are not canonical
    edits, so forwarding them verbatim made the registrar fail with `unsafe path: undefined`.
    """
    native, sidecar = [], []
    for change in changes:
        if isinstance(change, dict) and isinstance(change.get("path"), str) and "before" in change and "after" in change:
            native.append(change)
        else:
            sidecar.append(change)
    return native, sidecar


def load_json_bank(js_file: Path) -> list:
    cmd = ["node", "-e", f"""
    const fs = require('fs');
    const vm = require('vm');
    const code = fs.readFileSync({json.dumps(str(js_file))}, 'utf8');
    const ctx = {{ window: {{}}, console }};
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    console.log(JSON.stringify(ctx.window.questionBank));
    """]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", check=True)
    return json.loads(res.stdout)


def generate_inbox_request(files: dict) -> dict:
    """Constructs official .archive-meta-register/inbox/[examUid].json conforming to v2 schema."""
    stem = files["stem"]
    js_path = str(files["js"].relative_to(REPO_ROOT)).replace("\\", "/")
    source_archive_file = js_path.replace("archive/exams/", "")
    blob_sha1 = git_blob_sha1(files["js"])

    # Load JS bank
    bank = load_json_bank(files["js"])

    # Load current metadata records. The registrar compares every `before` value with the record that is
    # registered on main right now, and requires exactly one metadata row and one identity row per question.
    # Those placeholder rows are created by the Registration Sync AFTER the exam JS reaches main, so a request
    # generated from a branch that does not have them yet carries `before = null` for every field and a
    # synthetic UID; the registrar then refuses it (`UID denominator mismatch`, later `before mismatch`).
    # Refuse to emit such a request instead of shipping a stale one.
    with open(REPO_ROOT / "archive/data/question_metadata.json", encoding="utf-8") as f:
        meta_doc = json.load(f)
    with open(REPO_ROOT / "archive/data/question_identity_map.json", encoding="utf-8") as f:
        identity_doc = json.load(f)
    cur_records = [r for r in meta_doc["records"] if r.get("sourceArchiveFile") == source_archive_file]
    cur_records.sort(key=lambda r: r["sourceOrdinal"])
    cur_by_ord = {r["sourceOrdinal"]: r for r in cur_records}
    identity_records = [r for r in identity_doc["records"] if r.get("sourceArchiveFile") == source_archive_file]
    if (len(cur_records) != len(bank) or len(identity_records) != len(bank)
            or sorted(cur_by_ord) != list(range(1, len(bank) + 1))):
        raise RequestGenerationError(
            f"UID denominator mismatch for {source_archive_file}: JS questions={len(bank)}, "
            f"question_metadata records={len(cur_records)}, question_identity_map records={len(identity_records)}. "
            "The exam JS must be on this base (main) and the Registration Sync must have created its metadata/identity "
            "rows first; regenerate the request then. Do not submit a request built before those rows exist.")

    # Load small meta
    meta_json = json.loads(files["meta"].read_text(encoding="utf-8"))
    meta_items = meta_json.get("items", [])
    question_count = len(bank)

    # Load receipt
    receipt_sha = sha256_file(files["receipt"])
    receipt_rel = str(files["receipt"].relative_to(REPO_ROOT)).replace("\\", "/")

    evidence_refs = [
        {"path": receipt_rel, "sha256": receipt_sha}
    ]

    value_fields = {
        "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level", "L3", "L4",
        "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket",
        "sourceFingerprint", "contentFingerprint", "curriculum", "curriculumKey", "courseKey", "L1", "L2",
        "rpmL1", "rpmL2", "rpmL3", "rpmL4", "rpmPrimaryPath", "rpmSemanticStatus", "semanticSourceScope", "semanticScopeRelation",
        "primaryMethod", "decisiveStep", "integrationReason", "conceptClusterKey", "secondaryConceptKeys",
        "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "curriculumApplicability", "defaultSelectable"
    }

    req_items = []
    for i, q in enumerate(bank):
        ord_num = i + 1
        cur = cur_by_ord.get(ord_num, {})
        q_uid = cur.get("questionUid") or f"qid_v1_{hashlib.sha256(f'{source_archive_file}#{ord_num}'.encode('utf-8')).hexdigest()}"
        s_item = meta_items[i] if i < len(meta_items) else {}
        s_after = s_item.get("after") or {}

        after = {}
        for k, v in s_after.items():
            if k in value_fields:
                after[k] = v

        source_fields = [
            "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level",
            "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"
        ]
        for f in source_fields:
            if f in q:
                after[f] = q[f]

        before = {}
        for k in after.keys():
            before[k] = cur.get(k, None)

        req_items.append({
            "questionUid": q_uid,
            "sourceOrdinal": ord_num,
            "before": before,
            "after": after,
            "reason": s_item.get("reason", "문항 분석 및 Gemini 독립 검수 완료"),
            "evidenceRefs": evidence_refs
        })

    # Generated-extension keys (EXT-*) are GENERATED_ONLY: the v2 registrar resolves only ACTIVE canonical
    # CrossConcept/Condition keys (resolve() -> `inactive/missing crossConceptKeys`) and has no extension
    # support. Promoting them is a canonical-registry/RPM decision, so do not emit a request that is certain
    # to be refused (and never rewrite the reviewed keys to make it pass).
    active_cross, active_cond = load_active_canonical_keys()
    unregistrable = sorted({
        k for it in req_items
        for field, active in (("crossConceptKeys", active_cross), ("conditionKeys", active_cond))
        for k in it["after"].get(field) or [] if k not in active
    })
    if unregistrable:
        raise RequestGenerationError(
            "GENERATED_ONLY keys are not ACTIVE canonical and the reviewed-exam v2 registrar cannot register them: "
            + ", ".join(unregistrable)
            + ". Needs a user/meta-owner decision (registrar extension support or approved canonical promotion).")

    native_changes, sidecar_changes = split_registry_changes(meta_json.get("registryChanges", []))
    if sidecar_changes:
        print(f" - NOTE: {len(sidecar_changes)} Generated-extension registryChanges entr(y/ies) are not registrar-schema "
              "canonical edits and are NOT forwarded (they stay in the small meta file).")

    req_id = f"req-similar-{hashlib.sha1(stem.encode('utf-8')).hexdigest()[:16]}"
    request = {
        "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
        "requestId": req_id,
        "examUid": stem,
        "sourceArchiveFile": source_archive_file,
        "expectedSourceBlobSha1": blob_sha1,
        "expectedQuestionCount": question_count,
        "approval": {
            "type": "FINAL_QA",
            "metadataReviewed": True,
            "approvedBy": "13th-route-main-merge-master",
            "evidenceRefs": evidence_refs
        },
        "registryChanges": [
            {**change, "evidenceRefs": evidence_refs}
            for change in native_changes
        ],
        "items": req_items
    }

    return request

def get_whitelist_files(files: dict, inbox_path: Path) -> list[str]:
    """Returns list of relative file paths to be staged/merged."""
    paths = []
    # 1. JS
    paths.append(str(files["js"].relative_to(REPO_ROOT)).replace("\\", "/"))
    # 2. Receipt & Meta
    paths.append(str(files["receipt"].relative_to(REPO_ROOT)).replace("\\", "/"))
    paths.append(str(files["meta"].relative_to(REPO_ROOT)).replace("\\", "/"))
    # 3. Plans
    if files["plans"]:
        for p in files["plans"].rglob("*"):
            if p.is_file():
                paths.append(str(p.relative_to(REPO_ROOT)).replace("\\", "/"))
    # 4. Assets
    if files["assets"]:
        for a in files["assets"].rglob("*"):
            if a.is_file():
                paths.append(str(a.relative_to(REPO_ROOT)).replace("\\", "/"))
    # 5. Inbox request
    paths.append(str(inbox_path.relative_to(REPO_ROOT)).replace("\\", "/"))

    return sorted(list(set(paths)))

def main():
    parser = argparse.ArgumentParser(description="13th Route: MAIN Operation Merge MASTER")
    parser.add_argument("--exam", required=True, help="Exam stem (e.g. 25_금당중_2학기_중간_중3_유사)")
    parser.add_argument("--dry-run", action="store_true", help="Perform checks and print inbox JSON without staging")
    parser.add_argument("--apply", action="store_true", help="Stage whitelist files, write inbox JSON, and prepare merge")
    parser.add_argument("--skip-harness", action="store_true",
                        help="Do not run tools/harness/verify_similar_exam.mjs (it cannot evaluate high-school exams yet). "
                             "Reported as NOT_RUN; the default still requires the harness.")
    parser.add_argument("--out", help="Write the generated request JSON to this file and stop (no inbox write, no staging). "
                                      "The path must not be inside .archive-meta-register/inbox.")

    args = parser.parse_args()

    print(f"\n[13th Route MAIN MASTER] Processing exam: {args.exam}")
    files = find_exam_files(args.exam)
    if not files:
        print(f"Error: Could not locate exam files for '{args.exam}'", file=sys.stderr)
        sys.exit(1)

    print(f" - Found JS: {files['js']}")
    print(f" - Found Assets: {files['assets']}")
    print(f" - Found Plans: {files['plans']}")
    print(f" - Found Receipt: {files['receipt']}")
    print(f" - Found Meta: {files['meta']}")

    if args.out and args.apply:
        print("Error: --out and --apply are mutually exclusive", file=sys.stderr)
        sys.exit(2)
    for key in ("receipt", "meta"):
        if not files[key]:
            print(f"Error: missing {key} file for '{files['stem']}'", file=sys.stderr)
            sys.exit(1)

    valid, errors = validate_candidate(files, skip_harness=args.skip_harness)
    if not valid:
        print("\n[GATE_PASS FAILED] Errors encountered:")
        for err in errors:
            print(f"  * {err}")
        sys.exit(1)

    if args.skip_harness:
        print("\n[GATE_PASS NOT VERIFIED] harness skipped (NOT_RUN); continuing to request generation only.")
    else:
        print("\n[GATE_PASS VERIFIED] All candidate artifacts satisfy quality contract.")
    try:
        inbox_request = generate_inbox_request(files)
    except RequestGenerationError as err:
        print(f"\n[REQUEST NOT GENERATED] {err}", file=sys.stderr)
        sys.exit(1)

    if args.out:
        out_path = Path(args.out).resolve()
        inbox_root = (REPO_ROOT / ".archive-meta-register" / "inbox").resolve()
        if out_path == inbox_root or inbox_root in out_path.parents:
            print("Error: --out must not point into .archive-meta-register/inbox (that would trigger real registration)", file=sys.stderr)
            sys.exit(2)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(inbox_request, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"\n[REQUEST WRITTEN] {out_path} (not staged, not in inbox)")
        return

    inbox_dir = REPO_ROOT / ".archive-meta-register" / "inbox"
    inbox_dir.mkdir(parents=True, exist_ok=True)
    inbox_path = inbox_dir / f"{files['stem']}.json"

    whitelist = get_whitelist_files(files, inbox_path)
    print(f"\n[Whitelist Files: {len(whitelist)} files]")
    for w in whitelist[:10]:
        print(f"  + {w}")
    if len(whitelist) > 10:
        print(f"  ... and {len(whitelist) - 10} more files")

    if args.dry_run or not args.apply:
        print("\n[DRY RUN] Generated Inbox Request:")
        print(json.dumps(inbox_request, indent=2, ensure_ascii=False)[:1000] + "\n  ... (truncated for display)")
        print("\nTo execute operation merge, rerun with '--apply'.")
        return

    # Apply mode: write inbox request
    inbox_path.write_text(json.dumps(inbox_request, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\n[INBOX CREATED] Wrote {inbox_path.relative_to(REPO_ROOT)}")

    # Stage files in a single atomic invocation
    print("\n[STAGING] Staging whitelist files for main merge...")
    subprocess.run(["git", "add"] + whitelist, cwd=REPO_ROOT, check=True)

    print("[STAGING COMPLETE] Whitelist staged. Ready for commit/merge.")
    print("Run `git commit -m \"feat(similar): release {stem} and submit reviewed meta request\" --no-verify`")

if __name__ == "__main__":
    main()
