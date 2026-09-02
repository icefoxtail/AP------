from __future__ import annotations

"""Hash-bound cache for the deterministic staged-exam source context.

The same source exam is often used for several similar-question Runs.  Parsing
the source, rebuilding the rule snapshot, scanning the reviewed similar
catalogue, and reconnoitring source visuals are deterministic operations, so
repeating them on every Run only adds latency.  This cache stores that context
outside the Run while keeping every Run's own immutable copy and materialized
visual snapshot.

The cache is an optimization only.  A hit is accepted only when the locked
source hash, rule-pack snapshot hash, similar-catalogue fingerprint, cache
version, and every source visual hash still match.  A mismatch is a cache miss,
never a best-effort reuse.
"""

import copy
import json
from pathlib import Path
from typing import Any

from .exam_batch import EXAM_BATCH_VERSION, preflight_exam
from .reference_examples import select_reference_examples
from .run_store import atomic_write_json, sha256_file
from .rule_pack import load_rule_pack
from .source_question import json_sha256
from .visual_recon import prepare_visual_recon


CONTEXT_CACHE_VERSION = "staged-source-context-v1"
CONTEXT_CACHE_RELATIVE = Path("alive/runtime/context-cache/staged")
REFERENCE_LIMIT_PER_QUESTION = 3
REFERENCE_MAX_PER_FILE = 2


def _resolved_source(root: Path, source_file: str) -> Path:
    candidate = Path(source_file)
    return (candidate if candidate.is_absolute() else root / candidate).resolve()


def _similar_catalogue_fingerprint(root: Path) -> str:
    """Fingerprint reviewed-sample inputs without parsing them twice.

    The reference selector still performs the full parse on a cache miss.  On
    a cache hit this exact path+bytes fingerprint is the only catalogue work
    required, which is materially cheaper than extracting every JS file.
    """

    similar_root = (root / "archive" / "exams" / "similar").resolve()
    entries: list[dict[str, Any]] = []
    if similar_root.is_dir():
        for path in sorted(similar_root.rglob("*.js"), key=lambda item: item.as_posix()):
            if path.is_file():
                entries.append(
                    {
                        "path": path.relative_to(root).as_posix(),
                        "sha256": sha256_file(path),
                        "bytes": path.stat().st_size,
                    }
                )
    return json_sha256({"version": "similar-catalogue-v1", "entries": entries})


def _cache_key(
    *,
    source_path: str,
    source_sha256: str,
    rule_snapshot_sha256: str | None,
    catalogue_fingerprint: str,
) -> str:
    return json_sha256(
        {
            "cacheVersion": CONTEXT_CACHE_VERSION,
            "preflightVersion": EXAM_BATCH_VERSION,
            "sourcePath": source_path,
            "sourceSha256": source_sha256,
            "ruleSnapshotSha256": rule_snapshot_sha256,
            "catalogueFingerprint": catalogue_fingerprint,
            "referencePolicy": {
                "limitPerQuestion": REFERENCE_LIMIT_PER_QUESTION,
                "maxPerFile": REFERENCE_MAX_PER_FILE,
            },
        }
    )


def _visual_assets_match(root: Path, visual_recon: dict[str, Any]) -> bool:
    questions = visual_recon.get("questions", {})
    if not isinstance(questions, dict):
        return False
    for item in questions.values():
        if not isinstance(item, dict):
            return False
        for role in (item.get("roles") or {}).values():
            if not isinstance(role, dict):
                return False
            for asset in role.get("assets", []):
                if not isinstance(asset, dict):
                    return False
                relative = asset.get("sourcePath")
                expected = asset.get("sha256")
                if not isinstance(relative, str) or not isinstance(expected, str):
                    return False
                path = (root / relative).resolve()
                try:
                    path.relative_to(root.resolve())
                except ValueError:
                    return False
                if not path.is_file() or sha256_file(path) != expected:
                    return False
    return True


def _validate_cached_context(
    root: Path,
    context: dict[str, Any],
    *,
    key: str,
    source_path: Path,
    source_sha256: str,
    rule_snapshot_sha256: str | None,
    catalogue_fingerprint: str,
) -> bool:
    if context.get("cacheVersion") != CONTEXT_CACHE_VERSION:
        return False
    if context.get("preflightVersion") != EXAM_BATCH_VERSION:
        return False
    if context.get("cacheKey") != key:
        return False
    exam = context.get("exam")
    preflight = context.get("preflight")
    rule_pack = context.get("rulePack")
    reference_pack = context.get("referencePack")
    visual_recon = context.get("visualRecon")
    if not all(isinstance(value, dict) for value in (exam, preflight, rule_pack, reference_pack, visual_recon)):
        return False
    source_lock = preflight.get("sourceLock")
    if not isinstance(source_lock, dict):
        return False
    if source_lock.get("path") != source_path.relative_to(root).as_posix():
        return False
    if source_lock.get("sha256") != source_sha256:
        return False
    if rule_pack.get("snapshotSha256") != rule_snapshot_sha256:
        return False
    if context.get("catalogueFingerprint") != catalogue_fingerprint:
        return False
    if visual_recon.get("status") not in {"READY", "NOT_REQUIRED"}:
        return False
    if not _visual_assets_match(root, visual_recon):
        return False
    return True


def prepare_staged_context(
    root: Path,
    source_file: str,
    *,
    use_cache: bool = True,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Return deterministic source context and cache telemetry.

    The source and rule/catalogue hashes are computed before looking for a
    cache entry.  On a valid hit, the cached preflight is reused; the exact
    hashes and versioned key keep it bound to the same authoritative inputs.
    """

    root = Path(root).resolve()
    source_path = _resolved_source(root, source_file)
    source_sha256 = sha256_file(source_path)
    canonical_source_path = source_path.relative_to(root).as_posix()
    rule_pack = load_rule_pack(root)
    catalogue_fingerprint = _similar_catalogue_fingerprint(root)
    rule_snapshot_sha256 = rule_pack.get("snapshotSha256")
    key = _cache_key(
        source_path=canonical_source_path,
        source_sha256=source_sha256,
        rule_snapshot_sha256=rule_snapshot_sha256,
        catalogue_fingerprint=catalogue_fingerprint,
    )
    cache_path = root / CONTEXT_CACHE_RELATIVE / f"{key}.json"

    if use_cache and cache_path.is_file():
        try:
            cached = json.loads(cache_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError):
            cached = None
        if isinstance(cached, dict) and _validate_cached_context(
            root,
            cached,
            key=key,
            source_path=source_path,
            source_sha256=source_sha256,
            rule_snapshot_sha256=rule_snapshot_sha256,
            catalogue_fingerprint=catalogue_fingerprint,
        ):
            return (
                {
                    "exam": copy.deepcopy(cached["exam"]),
                    "preflight": copy.deepcopy(cached["preflight"]),
                    "rule_pack": copy.deepcopy(cached["rulePack"]),
                    "reference_pack": copy.deepcopy(cached["referencePack"]),
                    "visual_recon": copy.deepcopy(cached["visualRecon"]),
                },
                {
                    "enabled": True,
                    "status": "HIT",
                    "cacheVersion": CONTEXT_CACHE_VERSION,
                    "cacheKey": key,
                    "path": cache_path.relative_to(root).as_posix(),
                    "catalogueFingerprint": catalogue_fingerprint,
                },
            )

    # Only a cache miss pays the full source extraction/preflight cost.  The
    # source bytes, rule snapshot, and reviewed-sample catalogue were already
    # hash-bound above; the cached preflight is accepted only for this exact
    # versioned context key.
    exam, preflight = preflight_exam(root, source_file)
    source_lock = preflight.get("sourceLock") or {}
    if source_lock.get("sha256") != source_sha256:
        raise ValueError("source hash changed during staged context preparation")
    canonical_source_path = str(source_lock.get("path") or canonical_source_path)
    key = _cache_key(
        source_path=canonical_source_path,
        source_sha256=source_sha256,
        rule_snapshot_sha256=rule_snapshot_sha256,
        catalogue_fingerprint=catalogue_fingerprint,
    )
    cache_path = root / CONTEXT_CACHE_RELATIVE / f"{key}.json"
    reference_pack = select_reference_examples(
        root,
        exam,
        source_path=source_file,
        limit_per_question=REFERENCE_LIMIT_PER_QUESTION,
        max_per_file=REFERENCE_MAX_PER_FILE,
    )
    try:
        visual_recon = prepare_visual_recon(root, exam, preflight)
    except (OSError, ValueError) as error:
        visual_recon = {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_STAGED_VISUAL_RECON",
            "status": "BLOCKED",
            "ready": False,
            "visualQuestionCount": 0,
            "heldOrdinals": [],
            "humanInspectionRequired": False,
            "browserInspectionRequired": False,
            "inspectionScope": "local-asset-decode-and-safe-path-only",
            "questions": {},
            "codes": ["STAGED_VISUAL_RECON_ERROR"],
            "error": str(error),
        }
    context = {
        "exam": exam,
        "preflight": preflight,
        "rule_pack": rule_pack,
        "reference_pack": reference_pack,
        "visual_recon": visual_recon,
    }
    cache_payload = {
        "cacheVersion": CONTEXT_CACHE_VERSION,
        "preflightVersion": EXAM_BATCH_VERSION,
        "cacheKey": key,
        "catalogueFingerprint": catalogue_fingerprint,
        "sourcePath": canonical_source_path,
        "sourceSha256": source_sha256,
        "ruleSnapshotSha256": rule_snapshot_sha256,
        "exam": exam,
        "preflight": preflight,
        "rulePack": rule_pack,
        "referencePack": reference_pack,
        "visualRecon": visual_recon,
    }
    if use_cache and visual_recon.get("status") in {"READY", "NOT_REQUIRED"}:
        try:
            atomic_write_json(cache_path, cache_payload)
        except OSError:
            # A cache write must never block or alter a production Run.
            pass
    return context, {
        "enabled": bool(use_cache),
        "status": "MISS" if use_cache else "BYPASS",
        "cacheVersion": CONTEXT_CACHE_VERSION,
        "cacheKey": key,
        "path": cache_path.relative_to(root).as_posix(),
        "catalogueFingerprint": catalogue_fingerprint,
    }
