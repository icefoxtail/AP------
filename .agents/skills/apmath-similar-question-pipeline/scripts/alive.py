#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def find_repository_root() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "alive" / "engine" / "alive_cli.py").is_file():
            return parent
    raise SystemExit("ALIVE repository root not found")


def main() -> int:
    root = find_repository_root()
    command = [sys.executable, "-m", "alive.engine.alive_cli", *sys.argv[1:]]
    return subprocess.call(command, cwd=root)


if __name__ == "__main__":
    raise SystemExit(main())
