"""Fail-closed final audit for a packaged similar-exam artifact.

This module intentionally does not pretend to be a general theorem prover.  It
combines deterministic checks with required independent-review and browser
evidence ledgers.  A missing ledger cell is ``NOT_TESTED`` and therefore cannot
produce a final PASS.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json
from .source_question import extract_source_exam
from .exact_verifier import verify_question
from .metadata_finalizer import finalize_similar_metadata
from .adaptive_method_profile import lint_solution_method, method_profile_for_question


FINAL_SCHEMA_VERSION = "0.1.0"
REVIEW_FIELDS = (
    "structure",
    "math",
    "answer",
    "solution",
    "solutionArithmetic",
    "latex",
    "meta",
    "asset",
    "render",
)
ALLOWED_TYPES = {"", "객관식", "단답형", "주관식", "서술형"}
_TITLE_RE = re.compile(r"window\.examTitle\s*=\s*(\"(?:\\.|[^\"\\])*\")")
_ASSET_RE = re.compile(r"(assets/images/[^\s\"']+\.(?:svg|png))", re.I)
_HTML_TAG_RE = re.compile(r"<[^>]*>")
_BARE_MATH_RE = re.compile(
    r"(?:\b[A-Za-z][A-Za-z0-9_]*(?:\([^)]*\))?\s*(?:=|~|≤|≥|<|>)"
    r"|\b(?:P|E|V|Var)\s*\("
    r"|\b\d+(?:\.\d+)?\s*[<>≤≥]\s*(?:\d+(?:\.\d+)?|[A-Za-z])"
    r"|\\(?:frac|dfrac|sqrt|le|ge|lt|gt|sim)\b)"
)
_HALF_BOUNDARY_RE = re.compile(r"\b([A-Za-z][A-Za-z0-9_]*)\s*\+\s*0\.5\s*=\s*(-?\d+(?:\.\d+)?)")
_NUMERIC_ASSIGNMENT_TEMPLATE = r"\b{variable}\s*=\s*(-?\d+(?:\.\d+)?)"


def _read_json(path: Path, label: str) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(f"invalid {label} JSON: {path}") from error


def _asset_refs(value: Any) -> set[str]:
    refs: set[str] = set()

    def visit(item: Any) -> None:
        if isinstance(item, str):
            refs.update(match.group(1) for match in _ASSET_RE.finditer(item.replace("\\", "/")))
        elif isinstance(item, list):
            for child in item:
                visit(child)
        elif isinstance(item, dict):
            for child in item.values():
                visit(child)

    visit(value)
    return refs


def _title(script: str) -> str:
    match = _TITLE_RE.search(script)
    return json.loads(match.group(1)) if match else ""


def _math_segments(text: str) -> tuple[list[str], str, list[str]]:
    segments: list[str] = []
    outside: list[str] = []
    malformed: list[str] = []
    cursor = 0
    open_at: int | None = None
    index = 0
    while index < len(text):
        if text[index] == "\\" and index + 1 < len(text) and text[index + 1] == "$":
            index += 2
            continue
        if text[index] == "$":
            if open_at is None:
                outside.append(text[cursor:index])
                open_at = index + 1
            else:
                segments.append(text[open_at:index])
                cursor = index + 1
                open_at = None
        index += 1
    if open_at is None:
        outside.append(text[cursor:])
    else:
        malformed.append("unclosed dollar delimiter")
        outside.append(text[cursor:])
    return segments, " ".join(outside), malformed


def _static_findings(question: dict[str, Any], ordinal: int, *, similar: bool) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []

    def add(gate: str, code: str, message: str) -> None:
        findings.append({"ordinal": ordinal, "gate": gate, "code": code, "severity": "HARD_FAIL", "message": message})

    if question.get("id") != ordinal:
        add("structure", "QUESTION_ID_NOT_SEQUENTIAL", f"id must equal its 1-based ordinal ({ordinal})")

    for field in ("content", "answer", "solution"):
        if field not in question:
            add("structure", "REQUIRED_FIELD_MISSING", f"{field} is missing")
    if not isinstance(question.get("content"), str) or not question.get("content", "").strip():
        add("structure", "CONTENT_EMPTY", "content is empty")
    if not isinstance(question.get("solution"), str) or not question.get("solution", "").strip():
        add("solution", "SOLUTION_EMPTY", "solution is empty")
    choices = question.get("choices", [])
    if not isinstance(choices, list) or not all(isinstance(item, str) for item in choices):
        add("structure", "CHOICES_INVALID", "choices must be an array of strings")
    if question.get("questionType") not in ALLOWED_TYPES:
        add("meta", "QUESTION_TYPE_INVALID", "questionType is outside the canonical vocabulary")
    if similar and "기출" in (question.get("tags") or []):
        add("meta", "STALE_PROVENANCE_TAG", "similar output still contains the original-exam tag 기출")

    _, metadata_report = finalize_similar_metadata(
        question,
        question,
        strict_type=True,
    )
    for item in metadata_report.get("findings", []):
        add("meta", str(item.get("code") or "METADATA_FINALIZER_FAILED"), str(item.get("message") or "metadata finalizer failed"))

    answer = question.get("answer")
    if isinstance(answer, str) and "$" not in answer and re.search(r"(?:=|~|P\(|E\(|V\(|/|\^|≤|≥)", answer):
        add("answer", "ANSWER_MATH_NOT_DELIMITED", "mathematical answer must use $...$ when it is not numeric-only")

    for field in ("content", "solution"):
        text = str(question.get(field, ""))
        segments, outside, malformed = _math_segments(text)
        for message in malformed:
            add("latex", "LATEX_DELIMITER_UNBALANCED", f"{field}: {message}")
        for segment in segments:
            if "<" in segment or ">" in segment:
                add("latex", "RAW_ORDER_OPERATOR", f"{field}: use \\lt/\\gt inside math delimiters")
        # Archive content commonly uses ``<br>`` for line breaks.  The bare
        # math detector must not interpret the tag's ``br>`` as an equation
        # fragment (``b`` followed by the order operator ``>``).
        outside_without_html = _HTML_TAG_RE.sub(" ", outside)
        if _BARE_MATH_RE.search(outside_without_html):
            add("latex", "BARE_MATH_EXPRESSION", f"{field}: mathematical expression exists outside $...$")

    solution = str(question.get("solution", ""))
    for variable, right_hand_side in _HALF_BOUNDARY_RE.findall(solution):
        expected = float(right_hand_side) - 0.5
        assignment_re = re.compile(_NUMERIC_ASSIGNMENT_TEMPLATE.format(variable=re.escape(variable)))
        for assignment in assignment_re.findall(solution):
            if abs(float(assignment) - expected) > 1e-9:
                add(
                    "solutionArithmetic",
                    "INCONSISTENT_HALF_BOUNDARY_ARITHMETIC",
                    f"solution derives {variable}+0.5={right_hand_side} but later assigns {variable}={assignment}",
                )
                break

    exact = verify_question(question, ordinal)
    for item in exact.get("findings", []):
        findings.append({
            "ordinal": ordinal,
            "gate": item.get("gate", "computational"),
            "code": item.get("code", "EXACT_VERIFIER_FAILED"),
            "severity": item.get("severity", "HARD_FAIL"),
            "message": item.get("message", "exact verifier failed"),
        })

    # Staged/adaptive candidates carry the canonical solutionDetail.  Re-run
    # the curriculum method contract here as a final independent audit so a
    # later serializer or package operation cannot bypass the method lock.
    if isinstance(question.get("solutionDetail"), dict):
        profile = method_profile_for_question(
            student_payload=question,
            preflight_item=question,
        )
        if profile is not None:
            method_report = lint_solution_method(
                profile,
                str(question.get("solution") or ""),
                question.get("solutionDetail"),
            )
            if method_report.get("verdict") != "PASS":
                emitted_codes: set[str] = set()
                for hit in method_report.get("forbiddenHits", []):
                    code = str(hit.get("code") or "METHOD_PROFILE_FAILED")
                    emitted_codes.add(code)
                    add("method", code, str(hit.get("label") or "forbidden curriculum method"))
                for check in method_report.get("justificationChecks", []):
                    if str(check.get("verdict") or "").upper() != "FAIL":
                        continue
                    code = str(check.get("code") or "METHOD_POLICY_FAILED")
                    emitted_codes.add(code)
                    add("method", code, "curriculum method policy evidence is missing")
                if not emitted_codes:
                    add("method", "METHOD_PROFILE_FAILED", "; ".join(method_report.get("issues", [])))
    return findings


def _load_input(input_path: Path, js_path: str | None) -> tuple[str, bytes, dict[str, bytes], Path | None, tempfile.TemporaryDirectory[str] | None]:
    if input_path.suffix.lower() != ".zip":
        if input_path.suffix.lower() != ".js" or not input_path.is_file():
            raise ValueError(f"final input must be a ZIP or JS file: {input_path}")
        return input_path.as_posix(), input_path.read_bytes(), {}, input_path, None

    archive = zipfile.ZipFile(input_path, "r")
    try:
        if archive.testzip() is not None:
            raise ValueError("final input ZIP failed CRC round-trip")
        members = {
            info.filename: archive.read(info.filename)
            for info in archive.infolist()
            if not info.is_dir()
        }
    finally:
        archive.close()
    if js_path:
        selected = js_path.replace("\\", "/")
        if selected not in members:
            raise ValueError(f"requested JS member is missing: {selected}")
    else:
        candidates = sorted(
            name for name in members
            if name.startswith("install/archive/exams/similar/") and name.endswith(".js")
        )
        if not candidates and "final/staging/generated-exam.js" in members:
            candidates = ["final/staging/generated-exam.js"]
        if len(candidates) != 1:
            raise ValueError("ZIP must contain exactly one install-ready similar JS, or pass --js-path")
        selected = candidates[0]
    temporary = tempfile.TemporaryDirectory(prefix="alive-final-closure-")
    js_temp = Path(temporary.name) / "final.js"
    js_temp.write_bytes(members[selected])
    return selected, members[selected], members, js_temp, temporary


def _run_node_checks(js_path: Path) -> dict[str, Any]:
    node = shutil.which("node")
    if not node:
        return {"status": "NOT_TESTED", "message": "node executable is unavailable"}
    check = subprocess.run([node, "--check", str(js_path)], capture_output=True, text=True, timeout=20)
    vm_script = (
        "const fs=require('fs'),vm=require('vm');"
        "const file=process.argv[1],sandbox={window:{}};"
        "vm.runInNewContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});"
        "if(!Array.isArray(sandbox.window.questionBank)) process.exit(3);"
    )
    vm = subprocess.run([node, "-e", vm_script, str(js_path)], capture_output=True, text=True, timeout=20)
    return {
        "status": "PASS" if check.returncode == 0 and vm.returncode == 0 else "FAIL",
        "nodeCheckReturnCode": check.returncode,
        "vmReturnCode": vm.returncode,
        "nodeCheckStderr": check.stderr[-2000:],
        "vmStderr": vm.stderr[-2000:],
    }


def _review_rows(value: Any, count: int) -> tuple[dict[int, dict[str, Any]], list[dict[str, Any]]]:
    findings: list[dict[str, Any]] = []
    rows_value = value.get("questions") if isinstance(value, dict) else None
    if not isinstance(rows_value, list):
        return {}, [{"gate": "review", "code": "REVIEW_LEDGER_INVALID", "severity": "HARD_FAIL", "message": "questions list is missing"}]
    if value.get("artifactType") != "ALIVE_FINAL_REVIEW_LEDGER":
        findings.append({"gate": "review", "code": "REVIEW_LEDGER_TYPE_INVALID", "severity": "HARD_FAIL", "message": "unexpected review ledger artifactType"})
    rows: dict[int, dict[str, Any]] = {}
    for row in rows_value:
        if not isinstance(row, dict) or not isinstance(row.get("id"), int):
            findings.append({"gate": "review", "code": "REVIEW_ROW_INVALID", "severity": "HARD_FAIL", "message": "every review row needs an integer id"})
            continue
        if row["id"] in rows:
            findings.append({"gate": "review", "code": "REVIEW_ROW_DUPLICATE", "ordinal": row["id"], "severity": "HARD_FAIL", "message": "duplicate review row"})
        rows[row["id"]] = row
        for field in REVIEW_FIELDS:
            status = str(row.get(field, "NOT_TESTED")).upper()
            if status not in {"PASS", "FAIL", "WARN", "NOT_TESTED"}:
                findings.append({"gate": "review", "code": "REVIEW_STATUS_INVALID", "ordinal": row["id"], "severity": "HARD_FAIL", "message": f"{field} has invalid status {status}"})
    expected = set(range(1, count + 1))
    for missing in sorted(expected - set(rows)):
        findings.append({"gate": "review", "code": "REVIEW_ROW_MISSING", "ordinal": missing, "severity": "HARD_FAIL", "message": "no independent review row"})
    for extra in sorted(set(rows) - expected):
        findings.append({"gate": "review", "code": "REVIEW_ROW_OUT_OF_RANGE", "ordinal": extra, "severity": "HARD_FAIL", "message": "review row is outside question range"})
    return rows, findings


def _render_gate(value: Any, count: int) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    findings: list[dict[str, Any]] = []
    if not isinstance(value, dict):
        return {"status": "NOT_TESTED"}, [{"gate": "browser", "code": "RENDER_EVIDENCE_INVALID", "severity": "HARD_FAIL", "message": "render evidence is not an object"}]
    if value.get("artifactType") != "ALIVE_FINAL_RENDER_EVIDENCE":
        findings.append({"gate": "browser", "code": "RENDER_EVIDENCE_TYPE_INVALID", "severity": "HARD_FAIL", "message": "unexpected render evidence artifactType"})
    if value.get("actualBrowser") is not True:
        findings.append({"gate": "browser", "code": "ACTUAL_BROWSER_REQUIRED", "severity": "HARD_FAIL", "message": "actualBrowser must be true"})
    if value.get("productionEngine") is not True:
        findings.append({"gate": "browser", "code": "PRODUCTION_ENGINE_REQUIRED", "severity": "HARD_FAIL", "message": "productionEngine must be true"})
    modes = value.get("modes")
    if not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        return {"status": "FAIL", "modes": modes}, findings + [{"gate": "browser", "code": "RENDER_MODES_INCOMPLETE", "severity": "HARD_FAIL", "message": "exam, solution, answer evidence are all required"}]
    for mode, result in modes.items():
        if not isinstance(result, dict):
            findings.append({"gate": "browser", "code": "RENDER_MODE_INVALID", "severity": "HARD_FAIL", "message": f"{mode} evidence is invalid"})
            continue
        expectations = {
            "verdict": "PASS",
            "lastQuestion": count,
            "lastPageChecked": True,
            "unrenderedMath": 0,
            "overflowCount": 0,
            "badImages": [],
            "renderError": None,
        }
        for field, expected in expectations.items():
            if result.get(field) != expected:
                findings.append({"gate": "browser", "code": "RENDER_FIELD_FAILED", "severity": "HARD_FAIL", "message": f"{mode}.{field} is not {expected!r}"})
        if result.get("screenshotCaptured") is not True:
            findings.append({"gate": "browser", "code": "SCREENSHOT_MISSING", "severity": "HARD_FAIL", "message": f"{mode} screenshot is missing"})
    return {"status": "PASS" if not findings else "FAIL", "actualBrowser": value.get("actualBrowser"), "productionEngine": value.get("productionEngine"), "modes": sorted(modes)}, findings


def _external_findings(value: Any) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    if isinstance(value, list):
        items = value
    elif isinstance(value, dict) and isinstance(value.get("findings"), list):
        items = value["findings"]
    else:
        return {"status": "NOT_TESTED"}, [{"gate": "externalReview", "code": "EXTERNAL_FINDINGS_INVALID", "severity": "HARD_FAIL", "message": "findings list is missing"}]
    unresolved = []
    for item in items:
        if not isinstance(item, dict):
            unresolved.append(item)
            continue
        status = str(item.get("status", "OPEN")).upper()
        if item.get("resolved") is not True and status not in {"RESOLVED", "CLOSED", "FIXED"}:
            unresolved.append(item)
    return {"status": "PASS" if not unresolved else "FAIL", "count": len(items), "unresolvedCount": len(unresolved)}, [
        {"gate": "externalReview", "code": "UNRESOLVED_EXTERNAL_FINDING", "severity": "HARD_FAIL", "message": "external review finding remains unresolved", "finding": item}
        for item in unresolved
    ]


def _variant_proof_gate(value: Any, count: int) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Audit the optional universal-engine variant ledger.

    Legacy/B closure remains compatible when this ledger is omitted.  Once a
    universal A/B/C run supplies it, every question and the global completion
    marker become blocking closure requirements.
    """

    findings: list[dict[str, Any]] = []
    if not isinstance(value, dict):
        return {"status": "NOT_TESTED"}, [{"gate": "variant", "code": "VARIANT_LEDGER_INVALID", "severity": "HARD_FAIL", "message": "variant proof ledger is not an object"}]
    if value.get("artifactType") != "ALIVE_VARIANT_PROOF_LEDGER":
        findings.append({"gate": "variant", "code": "VARIANT_LEDGER_TYPE_INVALID", "severity": "HARD_FAIL", "message": "unexpected variant proof ledger artifactType"})
    if value.get("variantProofLedgerComplete") != "PASS":
        findings.append({"gate": "variant", "code": "VARIANT_LEDGER_INCOMPLETE", "severity": "HARD_FAIL", "message": "variantProofLedgerComplete must be PASS"})
    rows_value = value.get("questions")
    if not isinstance(rows_value, list):
        findings.append({"gate": "variant", "code": "VARIANT_ROWS_MISSING", "severity": "HARD_FAIL", "message": "variant proof questions list is missing"})
        return {"status": "FAIL", "questionCount": 0}, findings
    rows: dict[int, dict[str, Any]] = {}
    for item in rows_value:
        if not isinstance(item, dict) or not isinstance(item.get("id"), int):
            findings.append({"gate": "variant", "code": "VARIANT_ROW_INVALID", "severity": "HARD_FAIL", "message": "every variant row needs an integer id"})
            continue
        ordinal = item["id"]
        if ordinal in rows:
            findings.append({"gate": "variant", "code": "VARIANT_ROW_DUPLICATE", "ordinal": ordinal, "severity": "HARD_FAIL", "message": "duplicate variant proof row"})
        rows[ordinal] = item
        variant = item.get("variant")
        verified_class = variant.get("verifiedClass") if isinstance(variant, dict) else item.get("verifiedClass")
        status = variant.get("status") if isinstance(variant, dict) else item.get("status")
        if status != "PASS" or verified_class not in {"VERIFIED_A", "VERIFIED_B", "VERIFIED_C"}:
            findings.append({"gate": "variant", "code": "VARIANT_ROW_NOT_PASS", "ordinal": ordinal, "severity": "HARD_FAIL", "message": "variant row must carry PASS and VERIFIED_A/B/C"})
    for missing in sorted(set(range(1, count + 1)) - set(rows)):
        findings.append({"gate": "variant", "code": "VARIANT_ROW_MISSING", "ordinal": missing, "severity": "HARD_FAIL", "message": "no variant proof row"})
    for extra in sorted(set(rows) - set(range(1, count + 1))):
        findings.append({"gate": "variant", "code": "VARIANT_ROW_OUT_OF_RANGE", "ordinal": extra, "severity": "HARD_FAIL", "message": "variant row is outside question range"})
    return {"status": "PASS" if not findings else "FAIL", "questionCount": len(rows), "variantProofLedgerComplete": value.get("variantProofLedgerComplete")}, findings


def audit_final_closure(
    root: Path,
    input_path: Path,
    review_ledger_path: Path | None,
    render_evidence_path: Path | None,
    external_findings_path: Path | None,
    output_path: Path | None = None,
    js_path: str | None = None,
    variant_proof_ledger_path: Path | None = None,
) -> dict[str, Any]:
    """Audit a final JS/ZIP and return a per-question fail-closed report."""

    temporary: tempfile.TemporaryDirectory[str] | None = None
    try:
        selected, script_bytes, package_members, js_file, temporary = _load_input(input_path.resolve(), js_path)
        assert js_file is not None
        node = _run_node_checks(js_file)
        artifact = extract_source_exam(js_file)
        questions = artifact["questions"]
        title = _title(script_bytes.decode("utf-8-sig"))
        similar = "유사" in title or "/similar/" in selected.replace("\\", "/")
        static_by_question: dict[int, list[dict[str, Any]]] = {}
        all_static: list[dict[str, Any]] = []
        for ordinal, question in enumerate(questions, 1):
            findings = _static_findings(question, ordinal, similar=similar)
            static_by_question[ordinal] = findings
            all_static.extend(findings)

        refs = _asset_refs(questions)
        asset_findings: list[dict[str, Any]] = []
        for ref in sorted(refs):
            if package_members:
                normalized_selected = selected.replace("\\", "/")
                if normalized_selected.startswith("install/"):
                    member = "install/archive/" + ref
                elif normalized_selected.startswith(("original/", "similar/")):
                    prefix = normalized_selected.split("/", 1)[0]
                    member = f"{prefix}/archive/{ref}"
                elif normalized_selected == "final/staging/generated-exam.js":
                    match = re.search(r"/q(\d{1,3})(-solution)?\.(svg|png)$", ref, re.I)
                    if match:
                        member = f"final/assets/q{int(match.group(1)):03d}{match.group(2) or ''}.{match.group(3).lower()}"
                    else:
                        member = "final/assets/" + Path(ref).name
                else:
                    member = "archive/" + ref
                if member not in package_members:
                    ordinal_match = re.search(r"/q(\d{1,3})(?:-solution)?\.", ref)
                    asset_findings.append({"gate": "asset", "code": "ASSET_MISSING", "ordinal": int(ordinal_match.group(1)) if ordinal_match else None, "severity": "HARD_FAIL", "message": member})
            else:
                member_path = root / "archive" / ref
                if not member_path.is_file():
                    asset_findings.append({"gate": "asset", "code": "ASSET_MISSING", "severity": "HARD_FAIL", "message": member_path.as_posix()})
        all_static.extend(asset_findings)
        review_value = _read_json(review_ledger_path, "review ledger") if review_ledger_path else None
        review_rows, review_findings = _review_rows(review_value, len(questions)) if review_value is not None else ({}, [{"gate": "review", "code": "REVIEW_LEDGER_NOT_TESTED", "severity": "HARD_FAIL", "message": "review ledger was not supplied"}])
        render_value = _read_json(render_evidence_path, "render evidence") if render_evidence_path else None
        browser_gate, browser_findings = _render_gate(render_value, len(questions)) if render_value is not None else ({"status": "NOT_TESTED"}, [{"gate": "browser", "code": "RENDER_EVIDENCE_NOT_TESTED", "severity": "HARD_FAIL", "message": "render evidence was not supplied"}])
        external_value = _read_json(external_findings_path, "external findings") if external_findings_path else None
        external_gate, external_findings = _external_findings(external_value) if external_value is not None else ({"status": "NOT_TESTED"}, [{"gate": "externalReview", "code": "EXTERNAL_REVIEW_NOT_TESTED", "severity": "HARD_FAIL", "message": "external findings were not supplied"}])
        variant_value = _read_json(variant_proof_ledger_path, "variant proof ledger") if variant_proof_ledger_path else None
        variant_gate, variant_findings = _variant_proof_gate(variant_value, len(questions)) if variant_value is not None else ({"status": "NOT_REQUIRED"}, [])

        question_rows: list[dict[str, Any]] = []
        for ordinal in range(1, len(questions) + 1):
            static = static_by_question.get(ordinal, [])
            row = review_rows.get(ordinal, {})
            exact = verify_question(questions[ordinal - 1], ordinal)
            checks = {
                "structure": "FAIL" if any(item["gate"] == "structure" for item in static) else "PASS",
                "math": str(row.get("math", "NOT_TESTED")).upper(),
                "answer": "FAIL" if any(item["gate"] == "answer" for item in static) else str(row.get("answer", "NOT_TESTED")).upper(),
                "solution": "FAIL" if any(item["gate"] == "solution" for item in static) else str(row.get("solution", "NOT_TESTED")).upper(),
                "solutionArithmetic": "FAIL" if any(item["gate"] == "solutionArithmetic" for item in static) else str(row.get("solutionArithmetic", "NOT_TESTED")).upper(),
                "latex": "FAIL" if any(item["gate"] == "latex" for item in static) else str(row.get("latex", "NOT_TESTED")).upper(),
                "meta": "FAIL" if any(item["gate"] == "meta" for item in static) else str(row.get("meta", "NOT_TESTED")).upper(),
                "asset": "FAIL" if any(item.get("ordinal") in {None, ordinal} and item["gate"] == "asset" for item in asset_findings) else str(row.get("asset", "NOT_TESTED")).upper(),
                "render": str(row.get("render", "NOT_TESTED")).upper(),
            }
            question_rows.append({
                "id": ordinal,
                "status": "PASS" if all(value == "PASS" for value in checks.values()) and exact.get("status") != "FAIL" else "FAIL",
                "checks": checks,
                "exactVerification": exact,
                "findings": static,
            })

            for field, status in checks.items():
                if status != "PASS":
                    all_static.append({
                        "ordinal": ordinal,
                        "gate": field,
                        "code": "QUESTION_GATE_NOT_PASS",
                        "severity": "HARD_FAIL",
                        "message": f"question {ordinal} {field} status is {status}",
                    })

        gate_status = {
            "package": "PASS" if input_path.suffix.lower() != ".zip" or not any(name.startswith("../") for name in package_members) else "FAIL",
            "node": node["status"],
            "questions": "PASS" if all(row["status"] == "PASS" for row in question_rows) else "FAIL",
            "browser": browser_gate["status"],
            "externalReview": external_gate["status"],
        }
        if variant_proof_ledger_path:
            gate_status["variant"] = variant_gate["status"]
        overall = "PASS" if all(value == "PASS" for value in gate_status.values()) else "FAIL"
        report = {
            "schemaVersion": FINAL_SCHEMA_VERSION,
            "artifactType": "ALIVE_FINAL_CLOSURE_AUDIT",
            "status": overall,
            "input": input_path.as_posix(),
            "selectedJsPath": selected,
            "title": title,
            "questionCount": len(questions),
            "gates": gate_status,
            "browser": browser_gate,
            "externalReview": external_gate,
            "variant": variant_gate,
            "questions": question_rows,
            "findings": all_static + review_findings + browser_findings + external_findings + variant_findings,
            "node": node,
            "publicationStatus": "NOT_PUBLISHED",
        }
        if output_path:
            atomic_write_json(output_path.resolve(), report)
        return report
    finally:
        if temporary is not None:
            temporary.cleanup()


__all__ = ["FINAL_SCHEMA_VERSION", "audit_final_closure"]
