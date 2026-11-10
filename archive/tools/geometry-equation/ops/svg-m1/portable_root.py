"""Shared portable paths and UTF-8 process invocation for svg-m1."""
import os
import subprocess
import sys
from pathlib import Path

# Windows' default CP949 console/pipe encoding cannot represent all test output.
for stream in (sys.stdout, sys.stderr):
    reconfigure = getattr(stream, 'reconfigure', None)
    if callable(reconfigure):
        try:
            reconfigure(encoding='utf-8')
        except (OSError, ValueError):
            pass

def repo_root():
    def valid(p):
        return (p / '.git').exists() and (p / 'archive/tools/geometry-equation/visual-browser-runtime.mjs').is_file()
    if os.environ.get('APMS_ROOT'):
        p = Path(os.environ['APMS_ROOT']).resolve()
        if not valid(p): raise RuntimeError(f'Invalid APMS_ROOT: {p}')
        return p
    for base in (Path.cwd(), Path(__file__).resolve().parent):
        for p in (base, *base.parents):
            if valid(p): return p
    raise RuntimeError('Repository root not found; set APMS_ROOT')

def run(argv, *, cwd, timeout=120, env=None):
    env = dict(os.environ if env is None else env)
    env['PYTHONUTF8'] = '1'
    return subprocess.run([str(x) for x in argv], cwd=cwd, env=env, capture_output=True, text=True, encoding='utf-8', errors='strict', timeout=timeout, check=True)

def valid_ord(o):
    # 숫자 번호(1, 2, ...) 또는 문자열 id(q01, s01, ...). bool 은 거부.
    return (type(o) is int and o >= 1) or (type(o) is str and o.strip() != '' and o == o.strip())

def ord_key(k):
    # JSON 객체 키(문자열) -> ord: 숫자 문자열이면 int, 아니면 문자열 id 그대로.
    return int(k) if isinstance(k, int) or (isinstance(k, str) and k.isdigit()) else k

def asset_name(o, suffix=''):
    # 엔진 규칙: 숫자 번호 → q{n}-solution.svg, 문자열 id → <id>-solution.svg
    return (f'q{o}' if type(o) is int else str(o)) + f'-solution{suffix}.svg'

def item_key(camp, o):
    return f'{camp}-q{o}' if type(o) is int else f'{camp}-{o}'

def source_bank(root, src):
    import json
    source = (root / src).resolve()
    if not source.is_relative_to((root / 'archive/exams/original').resolve()): raise ValueError('source outside original exams')
    script = "const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.questionBank.map(q=>({id:q.id,image:q.solutionImage||''}))))"
    rows = json.loads(run(['node','-e',script,source],cwd=root).stdout)
    if not isinstance(rows,list) or not rows: raise ValueError('empty source bank')
    result={}
    for q in rows:
        o=q.get('id')
        if not valid_ord(o) or o in result: raise ValueError('invalid or duplicate source ord')
        result[o]=q
    return result

def validate_triage(root, src, rows):
    if not isinstance(rows,list) or not rows: raise ValueError('empty triage')
    bank=source_bank(root,src); result={}
    allowed={'FIGURE','REPLACE','KEEP','KEEP_EXISTING','EXEMPT','UNSUPPORTED','CONTENT','NO_SOURCE_FIGURE'}
    for row in rows:
        o=row.get('ord')
        if not valid_ord(o) or o in result: raise ValueError('invalid or duplicate triage ord')
        if row.get('decision') not in allowed: raise ValueError(f'q{o}: invalid decision')
        result[o]=row
    if set(result)!=set(bank): raise ValueError('triage ords do not match source bank')
    for o,row in result.items():
        if row['decision'] in ('KEEP','KEEP_EXISTING'):
            image=bank[o]['image']
            if not isinstance(image,str) or not image: raise ValueError(f'q{o}: KEEP requires existing solutionImage')
            archive=(root/'archive').resolve(); asset=(archive/image).resolve()
            if not asset.is_relative_to(archive) or not asset.is_file(): raise ValueError(f'q{o}: KEEP asset missing')
    return result,bank

def sha256_file(path):
    import hashlib
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def require_hash(path, expected):
    if not isinstance(expected,str) or len(expected.removeprefix('sha256:'))!=64 or sha256_file(path)!=expected.lower().removeprefix('sha256:'):
        raise ValueError(f'digest mismatch: {path}')
