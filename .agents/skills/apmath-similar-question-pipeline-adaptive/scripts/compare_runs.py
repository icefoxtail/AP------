#!/usr/bin/env python3
"""Compare a baseline staged Run with an adaptive experiment Run."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def find_repository_root() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "alive" / "engine" / "alive_cli.py").is_file():
            return parent
    raise SystemExit("ALIVE repository root not found")


ROOT = find_repository_root()
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from alive.engine.adaptive_compare import compare_staged_runs  # noqa: E402
from alive.engine.staged_exam import StagedRunStore  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compare baseline and adaptive ALIVE staged Runs"
    )
    parser.add_argument("--baseline-root", required=True)
    parser.add_argument("--baseline-run", required=True)
    parser.add_argument("--adaptive-root", required=True)
    parser.add_argument("--adaptive-run", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    report = compare_staged_runs(
        StagedRunStore(Path(args.baseline_root)),
        args.baseline_run,
        StagedRunStore(Path(args.adaptive_root)),
        args.adaptive_run,
    )
    serialized = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        target = Path(args.output).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(serialized + "\n", encoding="utf-8")
    print(serialized)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

