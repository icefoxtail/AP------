#!/usr/bin/env python3
"""Read finalized packets from a private Google Drive folder into archive Git paths."""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys
from urllib.parse import urlencode
from urllib.request import Request as HttpRequest, urlopen
import xml.etree.ElementTree as ET

from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials

FOLDER_MIME = "application/vnd.google-apps.folder"
SCOPE = ["https://www.googleapis.com/auth/drive.readonly"]
MAX_BYTES = 12 * 1024 * 1024
SHA_RE = re.compile(r"[0-9a-f]{64}\Z")


def safe_path(value):
    if not isinstance(value, str) or not value or "\\" in value:
        raise ValueError("Invalid relative path")
    path = PurePosixPath(value)
    if path.is_absolute() or str(path) != value or any(x in (".", "..") for x in value.split("/")):
        raise ValueError("Unsafe relative path: " + value)
    return path


def destination(value):
    path = safe_path(value)
    parts = path.parts
    if len(parts) < 4 or parts[0] != "archive":
        raise ValueError("Outside archive: " + value)
    if path.suffix == ".js":
        if len(parts) < 7 or parts[:3] != ("archive", "exams", "original") or parts[3] not in ("middle", "high"):
            raise ValueError("JS outside canonical originals: " + value)
    elif path.suffix in (".png", ".svg"):
        if "assets" not in parts[1:] and "images" not in parts[1:]:
            raise ValueError("Image outside archive assets/images: " + value)
    else:
        raise ValueError("Only final JS/PNG/SVG may sync: " + value)
    return path


class Drive:
    def __init__(self, credentials_json):
        credentials = Credentials.from_service_account_info(json.loads(credentials_json), scopes=SCOPE)
        credentials.refresh(Request())
        self.token = credentials.token

    def read(self, url):
        req = HttpRequest(url, headers={"Authorization": "Bearer " + self.token})
        with urlopen(req, timeout=45) as resp:
            data = resp.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError("Download exceeds 12 MiB")
        return data

    def children(self, folder_id):
        result = []
        token = None
        while True:
            args = {"q": f"'{folder_id}' in parents and trashed = false",
                    "pageSize": 1000, "fields": "nextPageToken,files(id,name,mimeType)"}
            if token:
                args["pageToken"] = token
            response = json.loads(self.read("https://www.googleapis.com/drive/v3/files?" + urlencode(args)))
            result.extend(response.get("files", []))
            token = response.get("nextPageToken")
            if not token:
                return result

    def download(self, file_id):
        return self.read("https://www.googleapis.com/drive/v3/files/" + file_id + "?alt=media")


def tree(drive, folder_id, prefix=""):
    files = {}
    for entry in drive.children(folder_id):
        relative = prefix + entry["name"]
        safe_path(relative)
        if entry["mimeType"] == FOLDER_MIME:
            children = tree(drive, entry["id"], relative + "/")
            for name, item in children.items():
                if name in files:
                    raise ValueError("Duplicate source: " + name)
                files[name] = item
        else:
            if relative in files:
                raise ValueError("Duplicate source: " + relative)
            files[relative] = entry
    return files


def validate_file(target, data):
    if target.suffix == ".js":
        data.decode("utf-8", errors="strict")
    elif target.suffix == ".png" and not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError("PNG signature invalid")
    elif target.suffix == ".svg":
        if not ET.fromstring(data).tag.endswith("svg"):
            raise ValueError("SVG root invalid")


def main():
    secret = os.environ["ARCHIVE_DRIVE_SERVICE_ACCOUNT_JSON"]
    folder = os.environ["ARCHIVE_DRIVE_FINAL_FOLDER_ID"]
    paths_file = os.environ["ARCHIVE_SYNC_PATHS_FILE"]
    drive = Drive(secret)
    updates = {}
    # Each exam folder is ignored until its own SYNC_READY.json is finalized.
    for exam in drive.children(folder):
        if exam["mimeType"] != FOLDER_MIME:
            continue
        files = tree(drive, exam["id"])
        ready = files.get("SYNC_READY.json")
        if not ready:
            continue
        manifest = json.loads(drive.download(ready["id"]))
        if manifest.get("version") != 1 or manifest.get("status") != "FINAL_READY":
            raise ValueError("Bad SYNC_READY.json: " + exam["name"])
        entries = manifest.get("files")
        if not isinstance(entries, list) or not entries:
            raise ValueError("Empty ready manifest: " + exam["name"])
        for entry in entries:
            source = str(safe_path(entry["source"]))
            target = destination(entry["target"])
            digest = entry["sha256"]
            if not isinstance(digest, str) or not SHA_RE.fullmatch(digest):
                raise ValueError("Missing valid SHA-256: " + source)
            if source == "SYNC_READY.json" or source not in files:
                raise ValueError("Missing source in Drive: " + source)
            if str(target) in updates:
                raise ValueError("Multiple packets target the same file: " + str(target))
            data = drive.download(files[source]["id"])
            if hashlib.sha256(data).hexdigest() != digest:
                raise ValueError("SHA mismatch: " + source)
            validate_file(target, data)
            updates[str(target)] = data
            if len(updates) > 150:
                raise ValueError("More than 150 synced files")
    # Never delete existing files; only write after validating all ready packets.
    for name, data in updates.items():
        target = Path(name)
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists() or target.read_bytes() != data:
            target.write_bytes(data)
    Path(paths_file).write_text("".join(n + "\n" for n in sorted(updates)), encoding="utf-8")
    print(f"Finalized Drive files checked: {len(updates)}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"DRIVE_FINAL_SYNC_FAILED: {error}", file=sys.stderr)
        sys.exit(1)
