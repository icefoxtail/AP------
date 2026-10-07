from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT = Path("C:/Users/USER/Desktop/AP-worktrees/h1-final-pdf-pilot-20261007/AP------")
TEMP = ROOT / ".tmp/archive/h1-final-pdf-pilot-20261007/22_강남여고_1학기_기말_고1_기출"
JS_URL = "/archive/exams/original/high/h1/1final/22_강남여고_1학기_기말_고1_기출.js"
ASSET_PREFIX = "/archive/assets/images/22_강남여고_1학기_기말_고1_기출/"
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def translate_path(self, raw):
        url = unquote(urlsplit(raw).path)
        if url == JS_URL:
            return str(TEMP / "22_강남여고_1학기_기말_고1_기출.js")
        if url.startswith(ASSET_PREFIX):
            suffix = url[len(ASSET_PREFIX):]
            target = (TEMP / "assets/images/22_강남여고_1학기_기말_고1_기출" / suffix).resolve()
            if target.is_relative_to(TEMP.resolve()):
                return str(target)
        return super().translate_path(raw)
ThreadingHTTPServer(("127.0.0.1", 8769), Handler).serve_forever()
