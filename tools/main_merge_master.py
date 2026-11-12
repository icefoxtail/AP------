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


EXTENSION_INDEX = REPO_ROOT / "archive" / "data" / "archive2-extension-keys.json"


def load_registered_extension_keys() -> tuple[set, set]:
    """Generated extension CrossConcept / Condition keys the derived index lists as GENERATED_ACTIVE and unpromoted.

    This is only a pre-check so a request is not emitted for keys the registrar is certain to refuse. The registrar
    (reviewed-exam-registration-v2.mjs, createExtensionLookup) stays the authority: it re-reads the source registry and
    also checks the ACTIVE canonical parent and the curriculum/course scope. A key accepted here is never promoted.
    """
    if not EXTENSION_INDEX.exists():
        return set(), set()
    doc = json.loads(EXTENSION_INDEX.read_text(encoding="utf-8"))
    cross, cond = set(), set()
    for d in doc.get("definitions", []):
        if d.get("status") != "GENERATED_ACTIVE" or d.get("canonicalPromoted") is not False:
            continue
        {"cross": cross, "cond": cond}.get(d.get("kind"), set()).add(d.get("key"))
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


RPM_MASTER_REL = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"
CROSSWALK_REL_DIR = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0"
UNIT_REALIGN_FIELDS = ("standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "conceptClusterKey")


def _compact_scope(value: str) -> str:
    return "".join(str(value or "").split()).replace("Ⅱ", "II").replace("Ⅰ", "I")


def _crosswalk_scope_matches(row: dict, scope: str) -> bool:
    """A crosswalk row belongs to a course when its `scope` or its `standardCourse` is that course. The 2015 high-school
    1st-year rows carry scope `수학_상`/`수학_하` but standardCourse `수학(상)`/`수학(하)` (the small meta's courseKey uses the
    latter); both spellings name the same course, so either one matches (the registrar aliases them the same way)."""
    wanted = _compact_scope(scope)
    return bool(wanted) and wanted in {_compact_scope(row.get("scope")), _compact_scope(row.get("standardCourse"))}


def _crosswalk_row_offers_template(row: dict, template_key: str) -> bool:
    """The row maps the question's TPL: its own `templateKey`, or - for a FAMILY_ACTIVE row of the same PT, which lists the
    templates the decisive step may select (Resolver `familyTemplateSelection`) - one of its `templateCandidates`."""
    if row.get("templateKey"):
        return row["templateKey"] == template_key
    if row.get("mappingStatus") == "FAMILY_ACTIVE":
        return template_key in {c.get("templateKey") for c in row.get("templateCandidates") or []}
    return False


def _crosswalk_row_fits(doc_status, row: dict, assignment: dict, classification: dict | None) -> bool:
    """Same conditions the registrar (withTargetParent) applies to a `crosswalkRef` row, except the course scope
    (which the registrar re-derives from the ACTIVE binding owner pack): ACTIVE_REFERENCE document, ACTIVE binding,
    same curriculum, same exact PT/TPL as the question, and the chosen L1/L2 as the RPM path."""
    if doc_status != "ACTIVE_REFERENCE" or row.get("bindingStatus") != "ACTIVE":
        return False
    if row.get("curriculum") != assignment["curriculum"]:
        return False
    if (row.get("rpmPath") or {}).get("majorUnit") != assignment["L1"] or (row.get("rpmPath") or {}).get("midUnit") != assignment["L2"]:
        return False
    if classification is not None and (row.get("problemTypeKey") != classification.get("problemTypeKey")
                                       or row.get("templateKey") != classification.get("templateKey")):
        return False
    return True


def complete_parent_assignment(assignment: dict) -> dict:
    """Fill L1/L2 of a parentAssignment that names only a crosswalk record."""
    if not (assignment.get("L1") and assignment.get("L2")) and assignment.get("crosswalkRecordId"):
        # A similar-high small meta records only the crosswalk row (similar-high-parent-assignment-v1). The parent
        # L1/L2 is then that row's own rpmPath, read from the official crosswalk (never guessed).
        assignment = dict(assignment)
        record_id = assignment["crosswalkRecordId"]
        hits = []
        for crosswalk_file in sorted((REPO_ROOT / CROSSWALK_REL_DIR).glob("*.json")):
            doc = json.loads(crosswalk_file.read_text(encoding="utf-8"))
            hits += [r for r in doc.get("records", []) if r.get("id") == record_id]
        rpm_path_row = (hits[0].get("rpmPath") or {}) if len(hits) == 1 else {}
        if not (rpm_path_row.get("majorUnit") and rpm_path_row.get("midUnit")):
            raise RequestGenerationError(
                f"parentAssignment has no L1/L2 and crosswalk record {record_id} gives no rpmPath (found {len(hits)}).")
        assignment["L1"], assignment["L2"] = rpm_path_row["majorUnit"], rpm_path_row["midUnit"]
    return assignment


def build_target_parent_ref(assignment: dict, classification: dict | None = None, notes: list | None = None) -> tuple[dict, list]:
    """Build the registrar `targetParentRef` (+ the evidence refs it needs) from a small-meta `parentAssignment`.

    Without a parent reference the registrar fills the student-screen parent (L1/L2) from the standard-unit
    labels (e.g. "도함수의 활용/도함수의 활용"), which is not a canonical RPM parent, so the Consumer cannot
    assign the question to a unit (`canonical_parent_missing`). `parentAssignment` holds the parent chosen per
    question: {L1, L2, curriculum, scope, parentRefMode, crosswalkRecordId}. The registrar
    (reviewed-exam-registration-v2.mjs withTargetParent) accepts the reference when
      - the (curriculum, scope, L1, L2) row exists in the canonical RPM master, and
      - L2 is the standard unit / sub-unit label, or an ACTIVE crosswalk row with the same PT/TPL
        points at that exact L1/L2 (`crosswalkRef`).
    parentRefMode UNIT_LABEL therefore carries no crosswalkRef; every other mode carries the recorded crosswalk row
    so a request is never silently downgraded to the unit-label parent. The one exception is a recorded crosswalk row that
    names the right parent but is not an ACTIVE row with the question's own PT/TPL (the registrar refuses those): an
    exact ACTIVE row for the same PT/TPL and parent is used instead, else no crosswalkRef is carried (reported in `notes`)
    and the registrar decides whether the unit-label parent is acceptable.
    """
    assignment = complete_parent_assignment(assignment)
    L1, L2 = assignment["L1"], assignment["L2"]
    curriculum = assignment["curriculum"]
    master_path = REPO_ROOT / RPM_MASTER_REL
    master = json.loads(master_path.read_text(encoding="utf-8"))
    rows = [r for r in master["records"]
            if r.get("curriculum") == curriculum and _compact_scope(r.get("scope")) == _compact_scope(assignment["scope"])
            and r.get("majorUnit") == L1 and r.get("midUnit") == L2]
    if len(rows) != 1:
        raise RequestGenerationError(
            f"parentAssignment {curriculum}/{assignment['scope']}/{L1}/{L2} is not exactly one canonical RPM master parent "
            f"(found {len(rows)}).")
    ref = {"path": RPM_MASTER_REL, "curriculum": curriculum, "scope": rows[0]["scope"], "majorUnit": L1, "midUnit": L2}
    evidence = [{"path": RPM_MASTER_REL, "sha256": sha256_file(master_path)}]
    record_id = assignment.get("crosswalkRecordId")
    if record_id and assignment.get("parentRefMode") != "UNIT_LABEL":
        crosswalk_dir = REPO_ROOT / CROSSWALK_REL_DIR
        found, all_rows = [], []
        for crosswalk_file in sorted(crosswalk_dir.glob("*.json")):
            doc = json.loads(crosswalk_file.read_text(encoding="utf-8"))
            for row in doc.get("records", []):
                all_rows.append((crosswalk_file, doc.get("status"), row))
                if row.get("id") == record_id:
                    found.append((crosswalk_file, doc.get("status"), row))
        if len(found) != 1:
            raise RequestGenerationError(f"parentAssignment crosswalk record {record_id} not found exactly once.")
        crosswalk_file, doc_status, row = found[0]
        if (row.get("rpmPath") or {}).get("majorUnit") != L1 or (row.get("rpmPath") or {}).get("midUnit") != L2:
            raise RequestGenerationError(
                f"parentAssignment crosswalk record {record_id} points at "
                f"{(row.get('rpmPath') or {}).get('majorUnit')}>{(row.get('rpmPath') or {}).get('midUnit')}, not {L1}>{L2}.")
        chosen = (crosswalk_file, row) if _crosswalk_row_fits(doc_status, row, assignment, classification) else None
        if chosen is None:
            # The recorded row names the right parent but is not an exact ACTIVE PT/TPL row for this question, so the
            # registrar would refuse it (`canonical target crosswalk classification/parent mismatch`). Another ACTIVE
            # crosswalk row with the question's own PT/TPL and the same RPM parent is equally valid evidence; the
            # registrar does not weaken. If there is none, the parent is carried without a crosswalkRef (UNIT_LABEL
            # style): the registrar then accepts it only when L2 is the question's unit/sub-unit/binding label.
            same_scope = [(f, r) for f, st, r in all_rows
                          if _crosswalk_scope_matches(r, assignment["scope"])
                          and _crosswalk_row_fits(st, r, assignment, classification)]
            if classification is not None and same_scope:
                chosen = sorted(same_scope, key=lambda pair: pair[1]["id"])[0]
                if notes is not None:
                    notes.append(f"{record_id} -> {chosen[1]['id']} (exact ACTIVE PT/TPL row)")
            elif notes is not None:
                notes.append(f"{record_id} -> UNIT_LABEL (no exact ACTIVE PT/TPL crosswalk row for "
                             f"{(classification or {}).get('problemTypeKey')}/{(classification or {}).get('templateKey')} at {L1}>{L2})")
        if chosen is not None:
            crosswalk_file, row = chosen
            cross_rel = f"{CROSSWALK_REL_DIR}/{crosswalk_file.name}"
            cross_sha = sha256_file(crosswalk_file)
            ref["crosswalkRef"] = {"path": cross_rel, "sha256": cross_sha, "recordId": row["id"]}
            evidence.append({"path": cross_rel, "sha256": cross_sha})
    return ref, evidence


def _rpm_hint(small_after: dict) -> tuple[str | None, tuple | None]:
    """The crosswalk record id (and declared L1-L4) that the small meta names for the RPM Primary path, if any.
    Small metas carry it as `rpmPrimary {l1..l4, recordId}`, flat `rpmPrimaryL1..L4` + `rpmPrimaryRecordId`, or a
    list `rpmPrimaryRecordIds`."""
    block = small_after.get("rpmPrimary") if isinstance(small_after.get("rpmPrimary"), dict) else {}
    record_id = block.get("recordId") or small_after.get("rpmPrimaryRecordId")
    ids = small_after.get("rpmPrimaryRecordIds")
    if not record_id and isinstance(ids, list) and len(ids) == 1:
        record_id = ids[0]
    declared = tuple(block.get(k) or small_after.get(f"rpmPrimaryL{n}") for n, k in enumerate(("l1", "l2", "l3", "l4"), 1))
    return record_id, (declared if all(declared) else None)


def resolve_rpm_primary_path(small_after: dict, classification: dict, curriculum: str, scope: str,
                             notes: list | None = None, label: str = "") -> tuple[dict | None, str | None]:
    """RPM Primary L1-L4 for one question from the official crosswalk only (never from name similarity).

    Candidates are the ACTIVE rows of an ACTIVE_REFERENCE crosswalk with the question's own curriculum, course scope,
    PT and TPL (a FAMILY_ACTIVE row counts when its `templateCandidates` list the question's TPL). The path is decided when
      - the small meta names a record id that is one of the candidates (the question's own final-solution pick), or
      - there is exactly one candidate path.
    Otherwise (no candidate, several different paths without a named record, a named record that is not a candidate, or
    declared L1-L4 that disagree with the named record) nothing is returned and the reason is added to `notes`
    (EVIDENCE_DEBT: the question keeps no RPM Primary path; nothing is guessed).
    Returns ({L1, L2, L3, L4, parentChain, crosswalkRecordIds}, crosswalk path relative to the repo root)."""
    if isinstance(small_after.get("rpmPrimaryPath"), dict) and small_after["rpmPrimaryPath"].get("L1"):
        return small_after["rpmPrimaryPath"], None
    pt, tpl = classification.get("problemTypeKey"), classification.get("templateKey")

    def debt(reason: str):
        if notes is not None:
            notes.append(f"{label} RPM path EVIDENCE_DEBT: {reason}")
        return None, None

    if not pt or not tpl:
        return debt("question has no PT/TPL")
    candidates = []
    crosswalk_dir = REPO_ROOT / CROSSWALK_REL_DIR
    for crosswalk_file in sorted(crosswalk_dir.glob("*.json")):
        doc = json.loads(crosswalk_file.read_text(encoding="utf-8"))
        if doc.get("status") != "ACTIVE_REFERENCE":
            continue
        for row in doc.get("records", []):
            if (row.get("bindingStatus") == "ACTIVE" and row.get("curriculum") == curriculum
                    and _crosswalk_scope_matches(row, scope)
                    and row.get("problemTypeKey") == pt and _crosswalk_row_offers_template(row, tpl)):
                candidates.append((crosswalk_file, row))
    record_id, declared = _rpm_hint(small_after)
    if record_id:
        chosen = [c for c in candidates if c[1]["id"] == record_id]
        if len(chosen) != 1:
            return debt(f"named record {record_id} is not an ACTIVE crosswalk row for {pt}/{tpl}"
                        f" (candidates: {', '.join(c[1]['id'] for c in candidates) or 'none'})")
    else:
        paths = {json.dumps(c[1]["rpmPath"], sort_keys=True) for c in candidates}
        if len(paths) != 1:
            return debt(f"{len(paths)} candidate RPM paths for {pt}/{tpl}"
                        f" ({', '.join(c[1]['id'] for c in candidates) or 'none'}) and no record named")
        chosen = [candidates[0]]
    crosswalk_file, row = chosen[0]
    rpm = row["rpmPath"]
    path = (rpm.get("majorUnit"), rpm.get("midUnit"), rpm.get("l3"), rpm.get("l4"))
    if not all(path):
        return debt(f"record {row['id']} has an incomplete RPM path")
    if declared is not None and declared != path:
        return debt(f"declared L1-L4 {list(declared)} differ from crosswalk record {row['id']} {list(path)}")
    return ({"L1": path[0], "L2": path[1], "L3": path[2], "L4": path[3], "parentChain": list(path),
             "crosswalkRecordIds": [row["id"]]}, f"{CROSSWALK_REL_DIR}/{crosswalk_file.name}")


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


def generate_inbox_request(files: dict, rpm_path_delta: bool = False, request_tag: str | None = None,
                           extra_evidence: list | None = None) -> dict:
    """Constructs official .archive-meta-register/inbox/[examUid].json conforming to v2 schema.

    `rpm_path_delta=True` builds a FINAL_QA request for an exam that is already registered: it adds only the RPM
    Primary path (`rpmPrimaryPath`) to the rows that lack it and changes no other value (empty before/after for rows
    whose path cannot be decided from the crosswalk). It keeps the original `targetParentRef` so the registrar derives
    the same L1/L2.

    `request_tag` makes the requestId differ from an earlier delta of the same exam (the registrar refuses the same
    requestId with different content), e.g. a second delta after crosswalk rows were added for questions the first one
    left without a path. `extra_evidence` ({path, sha256} refs, e.g. the reviewer's decision file) is added to the
    approval and to every item."""
    stem = files["stem"]
    js_path = str(files["js"].relative_to(REPO_ROOT)).replace("\\", "/")
    source_archive_file = js_path.replace("archive/exams/", "")
    blob_sha1 = git_blob_sha1(files["js"])

    # Load JS bank
    bank = load_json_bank(files["js"])

    # Load current metadata records. The registrar compares every `before` value with the record that is
    # registered on main right now, and requires exactly one metadata row and one identity row per question.
    # Those placeholder rows are created by the main registration writer AFTER the exam JS reaches main, so a request
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
            "The exam JS must be on this base (main) and the main registration writer must have created its metadata/identity "
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
    ] + [dict(ref) for ref in (extra_evidence or [])]

    value_fields = {
        "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level", "L3", "L4",
        "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket",
        "sourceFingerprint", "contentFingerprint", "curriculum", "curriculumKey", "courseKey", "L1", "L2",
        "rpmL1", "rpmL2", "rpmL3", "rpmL4", "rpmPrimaryPath", "rpmSemanticStatus", "semanticSourceScope", "semanticScopeRelation",
        "primaryMethod", "decisiveStep", "integrationReason", "conceptClusterKey", "secondaryConceptKeys",
        "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "curriculumApplicability", "defaultSelectable"
    }

    req_items = []
    parent_notes: list = []
    rpm_notes: list = []
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

        # RPM Primary L1-L4 (`rpmPrimaryPath`): small metas name the crosswalk record under other keys (`rpmPrimary`,
        # `rpmPrimaryL1..4`, `rpmPrimaryRecordId`) which the registrar does not read, so the path was silently dropped
        # and the search card showed "RPM L1~L4 미지정". Resolve it from the official crosswalk (see
        # resolve_rpm_primary_path); a question whose record cannot be decided keeps no path (EVIDENCE_DEBT).
        basis = cur if rpm_path_delta else after
        rpm_path, rpm_crosswalk = None, None
        if cur.get("rpmPrimaryPath"):
            rpm_path = None  # already registered: never overwritten by a crosswalk-derived value (an explicit small-meta path still flows through `after`)
        else:
            rpm_path, rpm_crosswalk = resolve_rpm_primary_path(
                s_after, {"problemTypeKey": basis.get("problemTypeKey"), "templateKey": basis.get("templateKey")},
                basis.get("curriculum") or basis.get("curriculumKey") or "",
                basis.get("courseKey") or basis.get("standardCourse") or "", rpm_notes, f"#{ord_num}")

        # Per-question parent unit (student-screen L1/L2). The registrar only accepts L1/L2 that equal the parent
        # it derives from the evidence-bound reference, so the same assignment sets both after.L1/L2 and the reference.
        parent_assignment = s_item.get("parentAssignment")
        if parent_assignment:
            parent_assignment = complete_parent_assignment(parent_assignment)
        parent_ref = None
        item_evidence = list(evidence_refs)
        if parent_assignment:
            parent_ref, parent_evidence = build_target_parent_ref(
                parent_assignment,
                {"problemTypeKey": basis.get("problemTypeKey"), "templateKey": basis.get("templateKey")},
                parent_notes)
            if rpm_path_delta and not s_item.get("unitRealign"):
                if (cur.get("L1"), cur.get("L2")) != (parent_assignment["L1"], parent_assignment["L2"]):
                    raise RequestGenerationError(
                        f"#{ord_num}: parentAssignment {parent_assignment['L1']}>{parent_assignment['L2']} differs from the "
                        f"registered parent {cur.get('L1')}>{cur.get('L2')}; an RPM path delta does not change values.")
            else:
                after["L1"], after["L2"] = parent_assignment["L1"], parent_assignment["L2"]
            for ev in parent_evidence:
                if ev not in item_evidence:
                    item_evidence.append(ev)

        if rpm_path_delta:
            after = {}
            if s_item.get("unitRealign"):
                # Reviewed realignment of the question to the curriculum unit its content belongs to (small meta item
                # `unitRealign: true`): only the unit/sub-unit/parent fields whose reviewed value differs from the
                # registered one are patched; every other value stays.
                after = {k: s_after[k] for k in UNIT_REALIGN_FIELDS if k in s_after and s_after[k] != cur.get(k)}
                if parent_assignment:
                    after["L1"], after["L2"] = parent_assignment["L1"], parent_assignment["L2"]
                    after = {k: v for k, v in after.items() if v != cur.get(k)}
        if rpm_path is not None and "rpmPrimaryPath" not in after:
            after["rpmPrimaryPath"] = rpm_path
            if rpm_crosswalk:
                cross_ev = {"path": rpm_crosswalk, "sha256": sha256_file(REPO_ROOT / rpm_crosswalk)}
                if cross_ev not in item_evidence:
                    item_evidence.append(cross_ev)

        before = {}
        for k in after.keys():
            before[k] = cur.get(k, None)

        reason = s_item.get("reason", "문항 분석 및 Gemini 독립 검수 완료")
        if rpm_path_delta:
            if rpm_path is not None and s_item.get("unitRealign"):
                reason = (f"{s_item.get('unitRealignReason') or '표준단원/세부단원을 문항 내용이 속한 교육과정 단원으로 재정렬'} "
                          f"+ RPM Primary 경로 추가: 크로스워크 {', '.join(rpm_path.get('crosswalkRecordIds') or [])}의 PT/TPL 정확 일치 행")
            elif rpm_path is not None:
                reason = (f"RPM Primary 경로만 추가(다른 승인 값 변경 없음): 크로스워크 "
                          f"{', '.join(rpm_path.get('crosswalkRecordIds') or [])}의 PT/TPL 정확 일치 행")
            elif cur.get("rpmPrimaryPath"):
                reason = "RPM Primary 경로가 이미 등록되어 있어 값을 바꾸지 않음"
            else:
                reason = "RPM Primary 경로 EVIDENCE_DEBT: 크로스워크 레코드가 결정되지 않아 이 문항은 값을 바꾸지 않음"
        req_item = {
            "questionUid": q_uid,
            "sourceOrdinal": ord_num,
            "before": before,
            "after": after,
            "reason": reason,
            "evidenceRefs": item_evidence
        }
        if parent_ref:
            req_item["targetParentRef"] = parent_ref
        req_items.append(req_item)

    for note in parent_notes:
        print(f" - NOTE: parent crosswalk adjusted: {note}")
    for note in rpm_notes:
        print(f" - NOTE: {note}")
    if rpm_path_delta and not any(item["after"] for item in req_items):
        raise RequestGenerationError("RPM path delta: no question gained an RPM Primary path (all registered or EVIDENCE_DEBT).")

    # Generated-extension keys (EXT-*) are accepted by the v2 registrar only when the extension index lists them as
    # GENERATED_ACTIVE (and the registrar's own source-registry/parent/scope checks pass). They are carried unchanged
    # and never promoted to canonical. Any other non-canonical key would be refused by the registrar, so do not emit a
    # request for it (and never rewrite the reviewed keys to make it pass).
    active_cross, active_cond = load_active_canonical_keys()
    ext_cross, ext_cond = load_registered_extension_keys()
    unregistrable = sorted({
        k for it in req_items
        for field, active, ext in (("crossConceptKeys", active_cross, ext_cross), ("conditionKeys", active_cond, ext_cond))
        for k in it["after"].get(field) or [] if k not in active and k not in ext
    })
    if unregistrable:
        raise RequestGenerationError(
            "Keys are neither ACTIVE canonical nor GENERATED_ACTIVE extensions listed in "
            "archive/data/archive2-extension-keys.json, so the reviewed-exam v2 registrar must refuse them: "
            + ", ".join(unregistrable)
            + ". Register the extension (registry + index) or use an existing canonical key; do not promote it here.")

    native_changes, sidecar_changes = split_registry_changes(meta_json.get("registryChanges", []))
    if rpm_path_delta:
        # The registry changes were applied by the exam's own registration; a delta must not send them again.
        native_changes, sidecar_changes = [], []
    if sidecar_changes:
        print(f" - NOTE: {len(sidecar_changes)} Generated-extension registryChanges entr(y/ies) are not registrar-schema "
              "canonical edits and are NOT forwarded (they stay in the small meta file).")

    id_basis = f"{stem}|{request_tag}" if request_tag else stem
    req_id = f"req-{'rpmpath' if rpm_path_delta else 'similar'}-{hashlib.sha1(id_basis.encode('utf-8')).hexdigest()[:16]}"
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
            "approvedBy": ("13th-route-main-merge-master: RPM Primary path delta (crosswalk-derived; no other value changes)"
                           if rpm_path_delta else "13th-route-main-merge-master"),
            "evidenceRefs": evidence_refs
        },
        "registryChanges": [
            {**change, "evidenceRefs": evidence_refs}
            for change in native_changes
        ],
        "items": req_items
    }

    return request

def get_whitelist_files(files: dict, inbox_path: Path = None) -> list[str]:
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
    if inbox_path and inbox_path.exists():
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
    parser.add_argument("--rpm-path-delta", action="store_true",
                        help="For an exam that is already registered: build a FINAL_QA request that only adds the RPM Primary "
                             "path (rpmPrimaryPath) from the official crosswalk and changes no other value. Writes "
                             ".archive-meta-register/inbox/rpmpath-<exam>.json with --apply (no other file is staged); "
                             "otherwise use --out or the dry run. Skips the GATE_PASS harness (the exam is already on main).")
    parser.add_argument("--request-tag", help="With --rpm-path-delta: a short label that changes the requestId and the inbox file "
                                              "name (rpmpath-<exam>-<tag>.json), for a further delta of an exam whose first delta "
                                              "is already registered.")
    parser.add_argument("--evidence", action="append", default=[],
                        help="Repository-relative path of a decision/evidence file to SHA-bind into the request "
                             "(repeatable); added to the approval and to every item.")
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

    valid, errors = (True, []) if args.rpm_path_delta else validate_candidate(files, skip_harness=args.skip_harness)
    if not valid:
        print("\n[GATE_PASS FAILED] Errors encountered:")
        for err in errors:
            print(f"  * {err}")
        sys.exit(1)

    if args.rpm_path_delta:
        print("\n[RPM PATH DELTA] exam already on main; GATE_PASS harness not applicable. Only rpmPrimaryPath is added.")
    elif args.skip_harness:
        print("\n[GATE_PASS NOT VERIFIED] harness skipped (NOT_RUN); continuing to request generation only.")
    else:
        print("\n[GATE_PASS VERIFIED] All candidate artifacts satisfy quality contract.")
    inbox_request = None
    try:
        extra_evidence = []
        for rel in args.evidence:
            evidence_path = REPO_ROOT / rel
            if not evidence_path.is_file():
                raise RequestGenerationError(f"--evidence file not found: {rel}")
            extra_evidence.append({"path": rel.replace("\\", "/"), "sha256": sha256_file(evidence_path)})
        inbox_request = generate_inbox_request(files, rpm_path_delta=args.rpm_path_delta,
                                               request_tag=args.request_tag, extra_evidence=extra_evidence)
    except RequestGenerationError as err:
        if args.out:
            print(f"\n[REQUEST NOT GENERATED] {err}", file=sys.stderr)
            sys.exit(1)
        print(f"\n[REQUEST DEFERRED] {err}")
        print(" -> Staging exam files without inbox request so the main registration writer can initialize placeholder rows on main first.")

    inbox_path = None
    if inbox_request:
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
        inbox_name = (f"rpmpath-{files['stem']}{'-' + args.request_tag if args.request_tag else ''}.json"
                      if args.rpm_path_delta else f"{files['stem']}.json")
        inbox_path = inbox_dir / inbox_name

        if args.apply:
            inbox_path.write_text(json.dumps(inbox_request, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\n[INBOX CREATED] Wrote {inbox_path.relative_to(REPO_ROOT)}")

    whitelist = (get_whitelist_files(files, inbox_path) if not args.rpm_path_delta
                 else [str(inbox_path.relative_to(REPO_ROOT)).replace("\\", "/")])
    print(f"\n[Whitelist Files: {len(whitelist)} files]")
    for w in whitelist[:10]:
        print(f"  + {w}")
    if len(whitelist) > 10:
        print(f"  ... and {len(whitelist) - 10} more files")

    if args.dry_run or not args.apply:
        if inbox_request:
            print("\n[DRY RUN] Generated Inbox Request:")
            print(json.dumps(inbox_request, indent=2, ensure_ascii=False)[:1000] + "\n  ... (truncated for display)")
        else:
            print("\n[DRY RUN] Inbox request deferred until exam JS is on main and the main registration writer runs.")
        print("\nTo execute operation merge, rerun with '--apply'.")
        return

    # Stage files in a single atomic invocation
    print("\n[STAGING] Staging whitelist files for main merge...")
    subprocess.run(["git", "add"] + whitelist, cwd=REPO_ROOT, check=True)

    print("[STAGING COMPLETE] Whitelist staged. Ready for commit/merge.")
    if inbox_request:
        print(f"Run `git commit -m \"feat(similar): release {files['stem']} and submit reviewed meta request\"`")
    else:
        print(f"Run `git commit -m \"feat(similar): release {files['stem']}\"`")

if __name__ == "__main__":
    main()
