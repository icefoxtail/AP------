#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import sys
from pathlib import Path
from dataclasses import dataclass

SKIP_DIR_NAMES = {
    ".git", ".idea", ".vscode", "__pycache__", "node_modules",
    "backup", "backups", "venv", ".venv"
}

SKIP_FILE_SUFFIXES = {
    ".min.js"
}

@dataclass
class FileReport:
    path: Path
    changed: bool
    replacements: int
    residual_tf_count: int
    parse_warnings: list

def read_text_safely(path: Path):
    encodings = ["utf-8", "utf-8-sig", "cp949", "euc-kr"]
    last_error = None
    for enc in encodings:
        try:
            return path.read_text(encoding=enc), enc
        except Exception as e:
            last_error = e
    raise last_error

def write_text_safely(path: Path, text: str, encoding: str):
    path.write_text(text, encoding=encoding, newline="")

def parse_brace_group(s: str, start_idx: int):
    """
    s[start_idx] must be '{'
    Returns: (group_text_including_braces, next_index_after_group)
    Supports nested braces.
    """
    if start_idx >= len(s) or s[start_idx] != "{":
        return None, start_idx

    depth = 0
    i = start_idx
    while i < len(s):
        ch = s[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return s[start_idx:i + 1], i + 1
        i += 1

    return None, start_idx

def convert_tf_to_frac(text: str):
    """
    Converts only exact macro pattern:
      \\tf{...}{...}
      \\tf   { ... }   { ... }
    Nested braces are supported.

    Does NOT touch:
      - plain text
      - malformed patterns
      - other macros
    """
    i = 0
    out = []
    replacements = 0
    warnings = []

    while i < len(text):
        if text.startswith("\\tf", i):
            macro_start = i
            j = i + 3  # after \tf

            # Do not convert things like \tfoo
            if j < len(text) and (text[j].isalnum() or text[j] == "_"):
                out.append(text[i])
                i += 1
                continue

            # allow whitespace between \tf and first brace
            while j < len(text) and text[j].isspace():
                j += 1

            if j >= len(text) or text[j] != "{":
                # malformed or legacy odd case: leave untouched
                out.append(text[i])
                i += 1
                continue

            group1, next1 = parse_brace_group(text, j)
            if group1 is None:
                warnings.append(f"Unclosed first brace near index {macro_start}")
                out.append(text[i])
                i += 1
                continue

            k = next1
            while k < len(text) and text[k].isspace():
                k += 1

            if k >= len(text) or text[k] != "{":
                warnings.append(f"Missing second brace group near index {macro_start}")
                out.append(text[i])
                i += 1
                continue

            group2, next2 = parse_brace_group(text, k)
            if group2 is None:
                warnings.append(f"Unclosed second brace near index {macro_start}")
                out.append(text[i])
                i += 1
                continue

            # Safe conversion
            out.append("\\frac")
            out.append(group1)
            out.append(group2)
            replacements += 1
            i = next2
            continue

        out.append(text[i])
        i += 1

    new_text = "".join(out)
    residual = new_text.count("\\tf")
    return new_text, replacements, residual, warnings

def should_skip_file(path: Path):
    name_lower = path.name.lower()
    for suffix in SKIP_FILE_SUFFIXES:
        if name_lower.endswith(suffix):
            return True
    return False

def collect_js_files(root: Path):
    files = []
    for current_root, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
        for filename in filenames:
            path = Path(current_root) / filename
            if path.suffix.lower() != ".js":
                continue
            if should_skip_file(path):
                continue
            files.append(path)
    return sorted(files)

def process_file(path: Path, apply: bool):
    text, encoding = read_text_safely(path)
    new_text, replacements, residual, warnings = convert_tf_to_frac(text)

    changed = (new_text != text)
    if apply and changed:
        write_text_safely(path, new_text, encoding)

    return FileReport(
        path=path,
        changed=changed,
        replacements=replacements,
        residual_tf_count=residual,
        parse_warnings=warnings
    )

def main():
    parser = argparse.ArgumentParser(
        description="Recursively replace \\tf{...}{...} with \\frac{...}{...} in JS files."
    )
    parser.add_argument(
        "target",
        help="Target root folder containing JS files"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually write changes to files. Without this flag, script runs in dry-run mode."
    )
    parser.add_argument(
        "--show-unchanged",
        action="store_true",
        help="Also print unchanged files."
    )
    args = parser.parse_args()

    root = Path(args.target).resolve()
    if not root.exists():
        print(f"[ERROR] Target does not exist: {root}")
        sys.exit(1)
    if not root.is_dir():
        print(f"[ERROR] Target is not a folder: {root}")
        sys.exit(1)

    js_files = collect_js_files(root)
    if not js_files:
        print(f"[INFO] No JS files found under: {root}")
        return

    mode = "APPLY" if args.apply else "DRY-RUN"
    print("=" * 80)
    print(f"[MODE] {mode}")
    print(f"[ROOT] {root}")
    print(f"[FILES] {len(js_files)} JS files found")
    print("=" * 80)

    reports = []
    total_changed_files = 0
    total_replacements = 0
    total_residual = 0
    total_warnings = 0

    for path in js_files:
        try:
            report = process_file(path, apply=args.apply)
            reports.append(report)

            total_replacements += report.replacements
            total_residual += report.residual_tf_count
            total_warnings += len(report.parse_warnings)

            if report.changed:
                total_changed_files += 1
                print(f"[CHANGED] {path} | replacements={report.replacements} | residual_tf={report.residual_tf_count}")
            elif args.show_unchanged:
                print(f"[UNCHANGED] {path}")

            for w in report.parse_warnings:
                print(f"  [WARN] {path} | {w}")

        except Exception as e:
            print(f"[ERROR] {path} | {e}")

    print("\n" + "=" * 80)
    print("[SUMMARY]")
    print(f"  Changed files     : {total_changed_files}")
    print(f"  Total replacements: {total_replacements}")
    print(f"  Residual \\tf count: {total_residual}")
    print(f"  Parse warnings    : {total_warnings}")
    print("=" * 80)

    if not args.apply:
        print("[NOTE] Dry-run only. No files were modified.")
        print("[NOTE] Add --apply to actually write changes.")
    else:
        print("[NOTE] Apply mode completed.")

if __name__ == "__main__":
    main()