#!/usr/bin/env python3
"""Prepare local API input from a frozen index; never publish or stage anything.

Example:
  python prepare-staged-checkpoint-packet.py --root /path/to/repo \
    --parent FULL_COMMIT_SHA --out-prefix .tmp/m1-meta-review/checkpoint \
    --allowed-prefix docs/operations/m1-meta-review-20261113/ \
    --known-remote-ref refs/remotes/origin/main

Only the two JSON outputs persist. write-tree uses a temporary index and object
directory under .tmp/m1-meta-review, with the real object directory read through
an alternate. A caller-supplied known-remote-ref is a local reuse hint, never a
claim that this script contacted or verified a remote.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import tempfile


REPOSITORY = "icefoxtail/AP------"
SCRATCH = ".tmp/m1-meta-review"
FILE_MODES = {"100644", "100755"}
FULL_SHA = re.compile(r"[0-9a-f]{40}\Z")


class PacketError(Exception):
    pass


def digest(data):
    return hashlib.sha256(data).hexdigest()


def utf8(data, label):
    try:
        return data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as error:
        raise PacketError(f"non-UTF-8 {label}") from error


def relative_path(value):
    if (not isinstance(value, str) or not value or value.startswith("/")
            or "\\" in value or any(ord(c) < 32 or ord(c) == 127 for c in value)
            or any(part in {"", ".", ".."} or part.lower() == ".git"
                   for part in value.split("/"))):
        raise PacketError(f"unsafe relative path: {value!r}")
    # Reject surrogate paths that cannot be represented by the API's UTF-8 JSON.
    try:
        value.encode("utf-8", errors="strict")
    except UnicodeEncodeError as error:
        raise PacketError("non-UTF-8 path") from error
    return value


def git(root, env, *args):
    result = subprocess.run(
        ["git", "-C", str(root), "-c", "core.fsmonitor=false", *args],
        env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        timeout=60, check=False,
    )
    if result.returncode:
        detail = result.stderr.decode("utf-8", errors="replace").strip()[:600]
        raise PacketError(f"git {args[0]} failed ({result.returncode}): {detail}")
    return result.stdout


def git_text(root, env, *args):
    return utf8(git(root, env, *args), "git output").strip()


def full_commit(root, env, value):
    if not FULL_SHA.fullmatch(value):
        raise PacketError("parent arguments must be full lowercase SHA-1 commit IDs")
    resolved = git_text(root, env, "rev-parse", "--verify", "--end-of-options",
                        value + "^{commit}")
    if resolved != value:
        raise PacketError("parent must identify the commit itself, not a tag")
    return resolved


def tree_of(root, env, commit):
    return git_text(root, env, "rev-parse", "--verify", commit + "^{tree}")


def known_refs(root, env, values):
    result = []
    for value in dict.fromkeys(values):
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._/-]*", value):
            raise PacketError(f"expected a plain known ref name or commit SHA: {value!r}")
        commit = git_text(root, env, "rev-parse", "--verify", "--end-of-options",
                          value + "^{commit}")
        result.append({"suppliedRef": value, "commit": commit,
                       "tree": tree_of(root, env, commit)})
    return result


def changes_between(root, env, before_tree, after_tree):
    raw = git(root, env, "diff-tree", "--no-commit-id", "--raw", "--no-abbrev",
              "--no-renames", "--no-ext-diff", "--no-textconv", "-r", "-z",
              before_tree, after_tree)
    if not raw:
        return []
    parts = raw.split(b"\0")
    if parts.pop() != b"" or len(parts) % 2:
        raise PacketError("unexpected NUL-delimited diff-tree output")
    result = []
    pattern = re.compile(rb":([0-7]{6}) ([0-7]{6}) ([0-9a-f]{40}) ([0-9a-f]{40}) ([AMD])")
    for header, path_bytes in zip(parts[::2], parts[1::2]):
        match = pattern.fullmatch(header)
        if not match:
            raise PacketError("unexpected changed entry type or diff status")
        old_mode, mode, old_blob, blob, status = (x.decode("ascii") for x in match.groups())
        path = relative_path(utf8(path_bytes, "changed path"))
        if old_mode not in FILE_MODES | {"000000"} or mode not in FILE_MODES | {"000000"}:
            raise PacketError(f"only regular files are supported: {path}")
        if ((status == "A") != (old_mode == "000000")
                or (status == "D") != (mode == "000000")
                or (old_mode == "000000") != (old_blob == "0" * 40)
                or (mode == "000000") != (blob == "0" * 40)):
            raise PacketError(f"inconsistent changed entry: {path}")
        result.append({"path": path, "status": status,
                       "beforeMode": old_mode if old_mode != "000000" else None,
                       "beforeBlobSha1": old_blob if old_mode != "000000" else None,
                       "mode": mode if mode != "000000" else None,
                       "blobSha1": blob if mode != "000000" else None})
    if len({x["path"] for x in result}) != len(result):
        raise PacketError("duplicate changed paths")
    return result


def tree_blobs(root, env, tree, paths):
    if not paths:
        return {}
    raw = git(root, env, "ls-tree", "-r", "-z", "--full-tree", tree, "--", *paths)
    result = {}
    for item in raw.split(b"\0"):
        if not item:
            continue
        header, path_bytes = item.split(b"\t", 1)
        mode, kind, blob = header.decode("ascii").split(" ")
        path = relative_path(utf8(path_bytes, "known-ref path"))
        if path in paths and kind == "blob":
            result[path] = {"mode": mode, "blobSha1": blob}
    return result


def output_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def write_new_or_identical(outputs):
    for path, data in outputs:
        if path.is_symlink() or path.exists() and not path.is_file():
            raise PacketError(f"output is not a regular file: {path}")
        if path.exists() and path.read_bytes() != data:
            raise PacketError(f"existing output differs; use a new prefix: {path}")
    created = []
    try:
        for path, data in outputs:
            try:
                fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            except FileExistsError:
                if path.is_symlink() or not path.is_file() or path.read_bytes() != data:
                    raise PacketError(f"output appeared with different bytes: {path}")
                continue
            with os.fdopen(fd, "wb") as handle:
                created.append((path, os.fstat(handle.fileno()).st_ino, data))
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
    except Exception:
        # Remove only this invocation's unchanged new output, never a pre-existing file.
        for path, inode, data in created:
            if path.is_file() and not path.is_symlink() and path.stat().st_ino == inode:
                if path.read_bytes() == data:
                    path.unlink()
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--root", required=True)
    parser.add_argument("--parent", required=True)
    parser.add_argument("--out-prefix", required=True)
    parser.add_argument("--allowed-prefix", action="append", default=[])
    parser.add_argument("--allowed-file", action="append", default=[])
    parser.add_argument("--additional-parent")
    parser.add_argument("--known-remote-ref", action="append", default=[])
    args = parser.parse_args()
    root = Path(args.root).resolve(strict=True)
    if not root.is_dir():
        raise PacketError("root must be a working-tree directory")
    env = dict(os.environ)
    for name in ("GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
                 "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_EXTERNAL_DIFF"):
        env.pop(name, None)
    env.update(GIT_OPTIONAL_LOCKS="0", GIT_NO_LAZY_FETCH="1", GIT_TERMINAL_PROMPT="0",
               GIT_NO_REPLACE_OBJECTS="1", GIT_LITERAL_PATHSPECS="1")
    if Path(git_text(root, env, "rev-parse", "--show-toplevel")).resolve() != root:
        raise PacketError("root must be the exact repository working-tree root")
    if git_text(root, env, "rev-parse", "--show-object-format") != "sha1":
        raise PacketError("the GitHub checkpoint packet requires a SHA-1 repository")
    parent = full_commit(root, env, args.parent)
    if git_text(root, env, "rev-parse", "--verify", "HEAD") != parent:
        raise PacketError("HEAD does not equal the supplied parent")
    additional = full_commit(root, env, args.additional_parent) if args.additional_parent else None
    if additional == parent:
        raise PacketError("additional parent duplicates the primary parent")
    prefixes = sorted({relative_path(x.rstrip("/")) + "/" for x in args.allowed_prefix})
    files = sorted({relative_path(x) for x in args.allowed_file})
    if not prefixes and not files:
        raise PacketError("at least one explicit allowed prefix or file is required")
    out_prefix = relative_path(args.out_prefix)
    if not out_prefix.startswith(SCRATCH + "/"):
        raise PacketError(f"output prefix must be under {SCRATCH}/")
    packet_path = root / (out_prefix + "-packet.json")
    info_path = root / (out_prefix + "-info.json")
    for directory in [root / SCRATCH, packet_path.parent]:
        if directory.resolve() != directory:
            raise PacketError("output directories must not contain symlinks")
        directory.mkdir(parents=True, exist_ok=True)
    index_path = Path(git_text(root, env, "rev-parse", "--path-format=absolute", "--git-path", "index"))
    if not stat.S_ISREG(index_path.lstat().st_mode):
        raise PacketError("current index must be a regular file")
    if git_text(root, env, "rev-parse", "--shared-index-path"):
        raise PacketError("split index is not supported; no real index is rewritten by this helper")
    index_bytes = index_path.read_bytes()
    index_sha = digest(index_bytes)
    object_path = Path(git_text(root, env, "rev-parse", "--path-format=absolute", "--git-path", "objects"))
    if "\n" in str(object_path) or "\r" in str(object_path):
        raise PacketError("unsafe object-directory path")
    before_tree = tree_of(root, env, parent)
    refs = known_refs(root, env, args.known_remote_ref)

    with tempfile.TemporaryDirectory(prefix=".checkpoint-read-", dir=root / SCRATCH) as temporary:
        temporary = Path(temporary)
        index_copy = temporary / "index"
        index_copy.write_bytes(index_bytes)
        objects = temporary / "objects"
        (objects / "info").mkdir(parents=True)
        (objects / "info" / "alternates").write_text(str(object_path) + "\n", encoding="utf-8")
        private_env = {**env, "GIT_INDEX_FILE": str(index_copy), "GIT_OBJECT_DIRECTORY": str(objects)}
        if git(root, private_env, "ls-files", "--unmerged", "-z"):
            raise PacketError("index contains unmerged entries")
        expected_tree = git_text(root, private_env, "write-tree")
        changes = changes_between(root, private_env, before_tree, expected_tree)
        for change in changes:
            if change["path"] not in files and not any(change["path"].startswith(p) for p in prefixes):
                raise PacketError(f"changed path was not explicitly allowed: {change['path']}")
        present_paths = [x["path"] for x in changes if x["blobSha1"]]
        reference_blobs = [(ref, tree_blobs(root, private_env, ref["tree"], present_paths)) for ref in refs]
        cache = {}

        def blob_bytes(blob):
            if blob not in cache:
                data = git(root, private_env, "cat-file", "blob", blob)
                actual = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
                if actual != blob:
                    raise PacketError(f"blob hash/content mismatch: {blob}")
                utf8(data, f"blob {blob}")
                cache[blob] = data
            return cache[blob]

        entries, file_info = [], []
        for change in changes:
            old_raw = blob_bytes(change["beforeBlobSha1"]) if change["beforeBlobSha1"] else None
            raw = blob_bytes(change["blobSha1"]) if change["blobSha1"] else None
            entry = {"path": change["path"], "mode": change["mode"] or change["beforeMode"], "type": "blob"}
            reused = next((ref for ref, blobs in reference_blobs
                           if blobs.get(change["path"], {}).get("blobSha1") == change["blobSha1"]), None) if raw is not None else None
            if raw is None:
                entry["sha"] = None
            elif reused:
                entry["sha"] = change["blobSha1"]
            else:
                entry["content"] = utf8(raw, change["path"])
            entries.append(entry)
            file_info.append({**change, "rawSha256": digest(raw) if raw is not None else None,
                              "beforeRawSha256": digest(old_raw) if old_raw is not None else None,
                              "packetMode": entry["mode"], "reusedKnownRemoteRef": reused,
                              "encoding": "DELETE" if raw is None else "KNOWN_REF_BLOB_SHA" if reused else "UTF8_CONTENT"})

    if index_path.read_bytes() != index_bytes:
        raise PacketError("real index changed during capture; use a fresh snapshot")
    if git_text(root, env, "rev-parse", "--verify", "HEAD") != parent:
        raise PacketError("HEAD changed during capture")
    if known_refs(root, env, args.known_remote_ref) != refs:
        raise PacketError("a supplied known ref changed during capture")
    packet = {"repository_full_name": REPOSITORY, "base_tree_sha": before_tree, "tree_elements": entries}
    packet_data = output_bytes(packet)
    info = {"schemaVersion": "staged-checkpoint-packet-v1", "repositoryFullName": REPOSITORY,
            "root": str(root), "parent": parent, "additionalParent": additional,
            "additionalParentTree": tree_of(root, env, additional) if additional else None,
            "before": {"parent": parent, "tree": before_tree}, "baseTree": before_tree,
            "expectedTree": expected_tree, "indexSnapshotSha256": index_sha,
            "fileCount": len(changes), "files": file_info,
            "allowedPrefixes": prefixes, "allowedFiles": files, "knownRemoteRefs": refs,
            "remoteVerified": False, "remoteVerification": "NOT_PERFORMED; refs are caller-supplied local reuse hints",
            "privateIndexAndObjectDirectory": True, "workingTreeContentUsed": False,
            "packetPath": str(packet_path.relative_to(root)), "packetSha256": digest(packet_data),
            "mutations": {"realIndex": False, "refs": False, "realObjectDatabase": False,
                          "sourceFiles": False, "apiOrNetworkCalls": False}}
    info_data = output_bytes(info)
    write_new_or_identical([(packet_path, packet_data), (info_path, info_data)])
    print(json.dumps({"packetPath": str(packet_path.relative_to(root)), "packetSha256": digest(packet_data),
                      "infoPath": str(info_path.relative_to(root)), "infoSha256": digest(info_data),
                      "parent": parent, "expectedTree": expected_tree, "fileCount": len(changes),
                      "remoteVerified": False}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (PacketError, OSError, subprocess.TimeoutExpired) as error:
        raise SystemExit(f"checkpoint packet error: {error}")
