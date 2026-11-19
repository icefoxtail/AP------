"""Long-lived host for the production worker scripts (worker.py and the *-observer-worker.py files).

worker.mjs normally starts one python process per request and pays the interpreter start plus the module imports (sympy etc.) every time.
This host keeps one process alive and runs each requested script with runpy exactly as `python <script>` would: the request bytes arrive on a
fresh sys.stdin, whatever the script prints is captured as that request's stdout. Python modules stay imported between requests; nothing else is shared.

Protocol (one JSON object per line, UTF-8):
  request : {"script": "<absolute path>", "request": "<raw request text>"}
  response: {"code": <exit code>, "stdout": "<captured stdout>", "stderr": "<captured stderr, first 8192 chars>"}
A script that raises or exits non-zero is reported with code != 0; worker.mjs then replays that one request in a fresh process so the error text is the classic one.
"""
import io
import json
import os
import runpy
import sys


MPMATH_DEFAULT_DPS = 15  # what a fresh python process starts with


def reset_mpmath():
    """Some scripts raise mpmath.mp.dps and never put it back; a fresh process would start every request at 15 digits."""
    module = sys.modules.get('mpmath')
    if module is not None:
        module.mp.dps = MPMATH_DEFAULT_DPS


def run(script, raw):
    reset_mpmath()
    out, err = io.StringIO(), io.StringIO()
    old = sys.stdin, sys.stdout, sys.stderr
    stdin = io.TextIOWrapper(io.BytesIO(raw), encoding='utf-8')
    sys.stdin, sys.stdout, sys.stderr = stdin, out, err
    code = 0
    folder = os.path.dirname(script)
    if folder not in sys.path:
        sys.path.insert(0, folder)
    try:
        runpy.run_path(script, run_name='__main__')
    except SystemExit as exit_:
        value = exit_.code
        if value is None:
            code = 0
        elif isinstance(value, int):
            code = value
        else:
            err.write(str(value) + '\n')
            code = 1
    except BaseException:
        import traceback
        traceback.print_exc()
        code = 1
    finally:
        sys.stdin, sys.stdout, sys.stderr = old
        reset_mpmath()
    return code, out.getvalue(), err.getvalue()


def main():
    channel = sys.stdout.buffer
    stdin = sys.stdin.buffer
    while True:
        line = stdin.readline()
        if not line:
            return
        try:
            message = json.loads(line.decode('utf-8'))
            code, stdout, stderr = run(message['script'], message['request'].encode('utf-8'))
            body = json.dumps({'code': code, 'stdout': stdout, 'stderr': stderr[:8192]}, ensure_ascii=False).encode('utf-8')
        except BaseException as error:
            body = json.dumps({'code': 1, 'stdout': '', 'stderr': 'HOST_ERROR:' + repr(error)[:500]}, ensure_ascii=False).encode('utf-8')
        channel.write(body + b'\n')
        channel.flush()


if __name__ == '__main__':
    main()
