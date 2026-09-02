from __future__ import annotations

import hashlib
import json
import os
import re
import time
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def make_run_id(query: str) -> str:
    slug = re.sub(r"[^0-9A-Za-z가-힣]+", "-", query).strip("-").lower()[:32]
    if not slug:
        slug = "run"
    stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    return f"{stamp}-{slug}-{uuid.uuid4().hex[:8]}"


def atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    data = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    try:
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            output.write(data)
            output.flush()
            os.fsync(output.fileno())
        # Windows virus scanners and parallel local workers can briefly hold
        # the destination manifest.  Treat that as transient backpressure,
        # not as a reason to abandon a resumable Run; a persistent lock still
        # raises after the bounded retry window.
        for attempt in range(8):
            try:
                os.replace(temporary, path)
                break
            except PermissionError:
                if attempt == 7:
                    raise
                time.sleep(0.05 * (attempt + 1))
    finally:
        if temporary.exists():
            temporary.unlink()


class RunStore:
    def __init__(self, runtime_root: Path) -> None:
        self.runtime_root = runtime_root.resolve()
        self.runtime_root.mkdir(parents=True, exist_ok=True)

    def run_dir(self, run_id: str) -> Path:
        if not re.fullmatch(r"[0-9A-Za-z가-힣._-]+", run_id):
            raise ValueError("invalid run id")
        return self.runtime_root / run_id

    def create(self, run_id: str, manifest: dict[str, Any]) -> Path:
        run_dir = self.run_dir(run_id)
        run_dir.mkdir(parents=False, exist_ok=False)
        for name in ("source", "plans", "candidates", "evidence", "render", "final"):
            (run_dir / name).mkdir()
        atomic_write_json(run_dir / "manifest.json", manifest)
        return run_dir

    def load(self, run_id: str) -> dict[str, Any]:
        path = self.run_dir(run_id) / "manifest.json"
        if not path.is_file():
            raise FileNotFoundError(f"run not found: {run_id}")
        return json.loads(path.read_text(encoding="utf-8"))

    def save(self, run_id: str, manifest: dict[str, Any]) -> None:
        manifest["updatedAt"] = utc_now()
        atomic_write_json(self.run_dir(run_id) / "manifest.json", manifest)

    def list_runs(self) -> list[dict[str, Any]]:
        runs: list[dict[str, Any]] = []
        for path in sorted(self.runtime_root.glob("*/manifest.json"), reverse=True):
            try:
                runs.append(json.loads(path.read_text(encoding="utf-8")))
            except (OSError, json.JSONDecodeError):
                continue
        return runs
