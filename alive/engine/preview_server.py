from __future__ import annotations

"""Local-only server for Archive-engine render evidence.

It maps one staging preview into the Archive engine's accepted ``exams/``
script namespace without copying or registering the preview in
``archive/exams``.  This is a developer/test utility, never a publication
server.
"""

import argparse
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


class PreviewHandler(SimpleHTTPRequestHandler):
    preview_path: Path
    preview_dir: Path
    operation_dir: Path | None
    root_path: Path
    preview_url: str

    def _preview_for_request(self) -> Path | None:
        request_path = urlsplit(self.path).path
        if request_path == self.preview_url:
            candidate = self.preview_path
        else:
            match = re.fullmatch(r"/archive/exams/__alive_high1_preview_([A-Za-z0-9_-]+)\.js", request_path)
            if match:
                candidate = self.preview_dir / f"{match.group(1).lower()}.js"
            else:
                operation_match = re.fullmatch(
                    r"/archive/exams/__alive_high1_operation_([A-Za-z0-9_-]+)\.js",
                    request_path,
                )
                if not operation_match or self.operation_dir is None:
                    return None
                candidate = self.operation_dir / f"{operation_match.group(1).lower()}.js"
        try:
            candidate.resolve().relative_to(self.root_path)
        except ValueError:
            return None
        return candidate if candidate.is_file() else None

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
        preview = self._preview_for_request()
        if preview is not None:
            data = preview.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> int:
    parser = argparse.ArgumentParser(description="Serve a local ALIVE preview to archive/engine.html")
    parser.add_argument("--preview", required=True, help="repository-relative or absolute preview JS path")
    parser.add_argument("--operation-dir", help="optional directory containing assembled operation scripts")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    root = Path.cwd().resolve()
    preview = Path(args.preview).resolve()
    if not preview.is_file():
        raise SystemExit(f"preview JS does not exist: {preview}")
    try:
        preview.relative_to(root)
    except ValueError as error:
        raise SystemExit("preview must remain inside the repository root") from error
    PreviewHandler.preview_path = preview
    PreviewHandler.preview_dir = root / "alive" / "runtime" / "high1-preview"
    operation_dir = Path(args.operation_dir).resolve() if args.operation_dir else None
    if operation_dir is not None:
        try:
            operation_dir.relative_to(root)
        except ValueError as error:
            raise SystemExit("operation directory must remain inside the repository root") from error
        if not operation_dir.is_dir():
            raise SystemExit(f"operation directory does not exist: {operation_dir}")
    PreviewHandler.operation_dir = operation_dir
    PreviewHandler.root_path = root
    PreviewHandler.preview_url = "/archive/exams/__alive_high1_preview.js"
    PreviewHandler.directory = str(root)
    server = ThreadingHTTPServer(("127.0.0.1", args.port), PreviewHandler)
    server.daemon_threads = True
    print(f"SERVER_READY http://127.0.0.1:{args.port}/archive/engine.html", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        return 0
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
