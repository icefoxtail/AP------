from __future__ import annotations

"""Load and fingerprint the active ``docs/rules`` source pack.

The ALIVE runtime must be able to prove which operational rules were in force
when a Run started.  This module deliberately stores paths and hashes instead
of copying the rule prose into every agent packet.  Agents can read the
authoritative files from the repository, while the Run keeps an auditable,
immutable snapshot of the exact source-pack state.
"""

import json
import re
from pathlib import Path
from typing import Any

from .run_store import sha256_file
from .source_question import json_sha256


RULE_PACK_SCHEMA_VERSION = "0.1.0"
RULE_MANIFEST_RELATIVE = Path("docs/rules/MANIFEST.md")
COMPILED_MASTER_RELATIVE = Path("archive/data/master_tables/js_archive_tag_master.json")

# These are the files named by the current rules index's active read paths.
# The MANIFEST remains the byte-level source of truth; this list prevents a
# regenerated but accidentally incomplete MANIFEST from silently reducing the
# rule set used by the engine.
RULE_READ_ORDER = (
    "docs/rules/00_RULES_INDEX.md",
    "docs/rules/01_CANONICAL/프로젝트_컨텍스트.md",
    "docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md",
    "docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md",
    "docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md",
    "docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md",
    "docs/rules/04_VISUAL/도형추출.md",
    "docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md",
    "docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md",
    "docs/rules/02_PIPELINES/문제해설추출.md",
    "docs/rules/02_PIPELINES/수정프로토콜.md",
    "docs/rules/02_PIPELINES/수정후보고프로토콜.md",
    "docs/rules/02_PIPELINES/작업방식_5문항배치루프_필수.md",
    "docs/rules/02_PIPELINES/해설프로토콜.md",
    "docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md",
    "docs/rules/02_PIPELINES/JS_변환_프롬프트.md",
    "docs/rules/02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md",
    "docs/rules/03_REVIEW/무결성검수.md",
    "docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md",
    "docs/rules/03_REVIEW/JS아카이브_1차검수_프로토콜.md",
    "docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md",
    "docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md",
)

_MANIFEST_LINE = re.compile(r"^- (.+?) \| (\d+) bytes \| sha256 ([0-9a-f]{64})$")


class RulePackError(ValueError):
    """Raised when a rule-pack manifest is malformed."""


def _safe_relative(value: str) -> str:
    normalized = value.replace("\\", "/").strip()
    path = Path(normalized)
    if not normalized or path.is_absolute() or ":" in normalized.split("/")[0]:
        raise RulePackError(f"rule-pack path is not relative: {value}")
    if any(part in {"", ".", ".."} for part in path.parts):
        raise RulePackError(f"rule-pack path contains an unsafe segment: {value}")
    return "/".join(path.parts)


def _manifest_entries(path: Path) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    seen: set[str] = set()
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeError) as error:
        raise RulePackError(f"cannot read rule-pack manifest: {path}") from error
    for line in lines:
        match = _MANIFEST_LINE.match(line.strip())
        if not match:
            continue
        relative, expected_bytes, expected_sha256 = match.groups()
        relative = _safe_relative(relative)
        if relative in seen:
            raise RulePackError(f"duplicate rule-pack manifest path: {relative}")
        seen.add(relative)
        entries.append(
            {
                "relativePath": relative,
                "expectedBytes": int(expected_bytes),
                "expectedSha256": expected_sha256,
            }
        )
    if not entries:
        raise RulePackError("rule-pack manifest contains no file entries")
    return entries


def _record_file(root: Path, repository_path: str, expected: dict[str, Any] | None = None) -> dict[str, Any]:
    path = root / repository_path
    if not path.is_file():
        return {
            "path": repository_path,
            "status": "MISSING",
            "bytes": None,
            "sha256": None,
            **({"expectedBytes": expected["expectedBytes"], "expectedSha256": expected["expectedSha256"]} if expected else {}),
        }
    actual_bytes = path.stat().st_size
    actual_sha256 = sha256_file(path)
    record: dict[str, Any] = {
        "path": repository_path,
        "status": "PASS",
        "bytes": actual_bytes,
        "sha256": actual_sha256,
    }
    if expected is not None:
        record.update(
            {
                "expectedBytes": expected["expectedBytes"],
                "expectedSha256": expected["expectedSha256"],
            }
        )
        if actual_bytes != expected["expectedBytes"] or actual_sha256 != expected["expectedSha256"]:
            record["status"] = "DRIFT"
    return record


def _compiled_master_summary(root: Path) -> dict[str, Any]:
    path = root / COMPILED_MASTER_RELATIVE
    record = _record_file(root, COMPILED_MASTER_RELATIVE.as_posix())
    if record["status"] != "PASS":
        return record
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        record.update({"status": "INVALID", "error": str(error)})
        return record
    if not isinstance(payload, list) or any(not isinstance(item, dict) for item in payload):
        record.update({"status": "INVALID", "error": "compiled master must be a JSON object array"})
        return record
    record["entryCount"] = len(payload)
    record["activeEntryCount"] = sum(item.get("status", "active") == "active" for item in payload)
    return record


def _unavailable(required: bool, code: str, detail: str) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "schemaVersion": RULE_PACK_SCHEMA_VERSION,
        "artifactType": "ALIVE_RULE_PACK_SNAPSHOT",
        "status": "NOT_AVAILABLE",
        "required": required,
        "codes": [code],
        "details": [detail],
        "manifest": None,
        "files": [],
        "compiledMaster": None,
        "readOrder": list(RULE_READ_ORDER),
        "authority": {
            "canonical": [path for path in RULE_READ_ORDER if "/01_CANONICAL/" in path],
            "pipelines": [path for path in RULE_READ_ORDER if "/02_PIPELINES/" in path],
            "review": [path for path in RULE_READ_ORDER if "/03_REVIEW/" in path],
            "visual": [path for path in RULE_READ_ORDER if "/04_VISUAL/" in path],
            "compiledMaster": COMPILED_MASTER_RELATIVE.as_posix(),
        },
    }
    payload["snapshotSha256"] = json_sha256(payload)
    return payload


def load_rule_pack(root: Path, *, required: bool | None = None) -> dict[str, Any]:
    """Return a deterministic snapshot of the active rule source pack.

    ``required=None`` makes repository production roots strict while keeping
    small isolated unit-test roots usable.  A root containing ``docs/rules`` or
    the compiled master is treated as a production-like root and therefore
    requires a valid pack.
    """

    root = Path(root).resolve()
    if required is None:
        required = (root / "docs" / "rules").is_dir() or (root / COMPILED_MASTER_RELATIVE).is_file()
    manifest_path = root / RULE_MANIFEST_RELATIVE
    if not manifest_path.is_file():
        return _unavailable(bool(required), "RULE_PACK_MANIFEST_MISSING", str(RULE_MANIFEST_RELATIVE))

    try:
        entries = _manifest_entries(manifest_path)
    except RulePackError as error:
        return _unavailable(bool(required), "RULE_PACK_MANIFEST_INVALID", str(error))

    by_path = {item["relativePath"]: item for item in entries}
    files: list[dict[str, Any]] = []
    for entry in entries:
        repository_path = f"docs/rules/{entry['relativePath']}"
        files.append(_record_file(root, repository_path, entry))

    missing_read_order = [
        path
        for path in RULE_READ_ORDER
        if path.removeprefix("docs/rules/") not in by_path
    ]
    missing_required = [
        path
        for path in RULE_READ_ORDER
        if not (root / path).is_file()
    ]
    manifest_record = _record_file(root, RULE_MANIFEST_RELATIVE.as_posix())
    compiled_master = _compiled_master_summary(root)
    codes: list[str] = []
    details: list[str] = []
    if missing_read_order:
        codes.append("RULE_PACK_MANIFEST_INCOMPLETE")
        details.append("missing from MANIFEST: " + ", ".join(missing_read_order))
    if missing_required:
        codes.append("RULE_PACK_REQUIRED_FILE_MISSING")
        details.append("missing active rule file: " + ", ".join(missing_required))
    if any(item["status"] in {"MISSING", "DRIFT"} for item in files):
        codes.append("SOURCE_PACK_DRIFT")
        details.append("one or more MANIFEST file hashes do not match the working tree")
    if compiled_master["status"] in {"MISSING", "INVALID"}:
        codes.append("COMPILED_MASTER_UNAVAILABLE")
        details.append("compiled master is missing or invalid")

    payload: dict[str, Any] = {
        "schemaVersion": RULE_PACK_SCHEMA_VERSION,
        "artifactType": "ALIVE_RULE_PACK_SNAPSHOT",
        "status": "READY" if not codes else "SOURCE_PACK_DRIFT",
        "required": bool(required),
        "codes": sorted(set(codes)),
        "details": details,
        "manifest": manifest_record,
        "files": files,
        "compiledMaster": compiled_master,
        "readOrder": list(RULE_READ_ORDER),
        "authority": {
            "canonical": [path for path in RULE_READ_ORDER if "/01_CANONICAL/" in path],
            "pipelines": [path for path in RULE_READ_ORDER if "/02_PIPELINES/" in path],
            "review": [path for path in RULE_READ_ORDER if "/03_REVIEW/" in path],
            "visual": [path for path in RULE_READ_ORDER if "/04_VISUAL/" in path],
            "compiledMaster": COMPILED_MASTER_RELATIVE.as_posix(),
        },
    }
    payload["snapshotSha256"] = json_sha256(payload)
    return payload


def rule_pack_is_ready(snapshot: dict[str, Any]) -> bool:
    return snapshot.get("status") == "READY" and isinstance(snapshot.get("snapshotSha256"), str)
