"""Read only the requested exam's projection rows; never load a whole projection.

Usage: python3 this.py REPO_ROOT SOURCE_ARCHIVE_FILE EXPECTED_COUNT
Stdout contains metadata/identity rows and exact Git blob/raw SHA256 bindings.
"""
import hashlib
import json
import pathlib
import re
import sys


def stream_records(file):
    decoder = json.JSONDecoder()
    with file.open("r", encoding="utf8") as handle:
        buffer = ""
        while True:
            chunk = handle.read(65536)
            if not chunk:
                raise ValueError("records array missing: " + str(file))
            buffer += chunk
            match = re.search(r'"records"\s*:\s*\[', buffer)
            if match:
                buffer = buffer[match.end():]
                break
            if len(buffer) > 1024 * 1024:
                raise ValueError("unexpected projection header: " + str(file))
        while True:
            buffer = buffer.lstrip(" \n\r\t,")
            if buffer.startswith("]"):
                return
            try:
                value, end = decoder.raw_decode(buffer)
            except json.JSONDecodeError:
                chunk = handle.read(65536)
                if not chunk:
                    raise ValueError("truncated records array: " + str(file))
                buffer += chunk
                continue
            if not isinstance(value, dict):
                raise ValueError("non-object projection record: " + str(file))
            yield value
            buffer = buffer[end:]


def hashes(file):
    blob = hashlib.sha1(("blob " + str(file.stat().st_size) + "\0").encode())
    raw = hashlib.sha256()
    with file.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            blob.update(chunk)
            raw.update(chunk)
    return {"blobSha1": blob.hexdigest(), "sha256": raw.hexdigest()}


if __name__ == "__main__":
    root, source, count = pathlib.Path(sys.argv[1]), sys.argv[2], int(sys.argv[3])
    result = {}
    for name, rel in (("metadata", "archive/data/question_metadata.json"),
                      ("identity", "archive/data/question_identity_map.json")):
        file = root / rel
        rows = [row for row in stream_records(file) if row.get("sourceArchiveFile") == source]
        if len(rows) != count:
            raise ValueError(f"{name} source denominator mismatch: {len(rows)} != {count}")
        result[name] = rows
        result[name + "Snapshot"] = {"path": rel, **hashes(file)}
    print(json.dumps(result, ensure_ascii=False))
