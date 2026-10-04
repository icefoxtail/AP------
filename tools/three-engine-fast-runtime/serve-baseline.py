"""Serve captured renderer files from a revision, sharing unchanged asset files."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--revision', required=True)
parser.add_argument('--port', type=int, default=8768)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
files = ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/wrong_print_engine.html',
         'archive/screen-runtime.js', 'archive/common-fast-runtime.js', 'archive/exam-render-executor.js',
         'archive/solution-render-executor.js', 'archive/answer-render-executor.js']
with tempfile.TemporaryDirectory(prefix='ap-fast-baseline-') as directory:
    captured = Path(directory)
    for name in files:
        target = captured / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(subprocess.check_output(['git', 'show', f'{args.revision}:{name}'], cwd=root))

    class Handler(SimpleHTTPRequestHandler):
        def translate_path(self, path):
            current = Path(super().translate_path(path))
            candidate = captured / current.relative_to(root)
            return str(candidate if candidate.is_file() else current)

        def log_message(self, *_):
            pass

    print(f'Captured {args.revision}: http://127.0.0.1:{args.port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(root))).serve_forever()
