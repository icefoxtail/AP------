import json
import re
import sys
from pathlib import Path


VALID_ESCAPES = set('"\\/bfnrtu')


def sanitize_json_string_escapes(text):
    out = []
    in_string = False
    escaped = False
    for char in text:
        if not in_string:
            out.append(char)
            if char == '"':
                in_string = True
            continue
        if escaped:
            if char in VALID_ESCAPES:
                out.append(char)
            else:
                out.append("\\")
                out.append(char)
            escaped = False
            continue
        if char == "\\":
            out.append("\\")
            escaped = True
            continue
        if char == '"':
            out.append(char)
            in_string = False
            continue
        code = ord(char)
        if code < 32:
            if char == "\n":
                out.append("\\n")
            elif char == "\r":
                out.append("\\r")
            elif char == "\t":
                out.append("\\t")
            else:
                out.append(f"\\u{code:04x}")
            continue
        out.append(char)
    if escaped:
        out.append("\\")
    return "".join(out)


def extract_question_bank(text):
    match = re.search(r"window\.questionBank\s*=\s*(\[.*?\]);?\s*$", text, re.S)
    if not match:
        raise ValueError("window.questionBank array not found")
    return match


def repair_file(path):
    text = path.read_text(encoding="utf-8")
    match = extract_question_bank(text)
    before = text[: match.start(1)]
    bank = match.group(1)
    after = text[match.end(1) :]
    repaired_bank = sanitize_json_string_escapes(bank)
    # Verify the repaired candidate can be parsed by the same JSON gate.
    json.loads(repaired_bank)
    if repaired_bank != bank:
        path.write_text(before + repaired_bank + after, encoding="utf-8")
        return True
    return False


def main():
    if len(sys.argv) < 2:
        print("usage: repair_candidate_json_escapes.py candidate.js [...]", file=sys.stderr)
        return 2
    changed = 0
    failed = []
    for raw in sys.argv[1:]:
        path = Path(raw)
        try:
            if repair_file(path):
                changed += 1
        except Exception as exc:
            failed.append({"file": str(path), "error": str(exc)})
    print(json.dumps({"checked": len(sys.argv) - 1, "changed": changed, "failed": failed}, ensure_ascii=False, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
