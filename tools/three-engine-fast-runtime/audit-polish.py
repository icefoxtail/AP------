"""Validate the follow-up evidence without rewriting the earlier integration audit."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'reports/three-engine-fast-polish'
BASE = 'fc108a9a2934340e8e5ec4f7184ae73e9f245e44'
read = lambda name: json.loads((OUT / name).read_text(encoding='utf-8'))
def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

cases = read('parity.json') + read('solution-parity.json') + read('rich-parity.json')
assert len(cases) == 29 and all(case['pass'] for case in cases)
pdfs = []
for case in cases:
    current = PdfReader(OUT / (case['name'] + '.pdf'))
    row = {'name': case['name'], 'pages': len(current.pages), 'pageCountMatches': len(current.pages) == len(case['pair'][1]['capture'])}
    baseline = OUT / (case['name'] + '-baseline.pdf')
    if baseline.exists():
        texts = lambda doc: [' '.join((page.extract_text() or '').split()) for page in doc.pages]
        row['baselinePdfTextMatches'] = texts(current) == texts(PdfReader(baseline))
    assert row['pageCountMatches'] and row.get('baselinePdfTextMatches', True), row
    pdfs.append(row)
write('pdf-audit.json', pdfs)
for name in ['lifecycle.json', 'protocols.json']:
    assert all(row['pass'] for row in read(name)), name
archive = read('archive-final.json')
assert not archive['errors'] and all(row['status'] == 'PASS' for row in archive['tests'])
performance = read('focused-performance.json')
assert performance[1]['requestsDuringSwitch'] == 0 and performance[1]['offlineSwitch']['ok']
assert performance[1]['print']['mutationRebuilt'] and performance[1]['print']['failureRecovery']['canRenderAgain']
assert performance[1]['longSolution']['pages'] == performance[0]['longSolution']['pages']
tap = (OUT / 'static-tests.tap').read_text(encoding='utf-8-sig')
failures = re.findall(r'^not ok \d+ - (.+)$', tap, re.M)
old_tap = (ROOT / 'reports/three-engine-fast-runtime/baseline-inherited-tests.tap').read_text(encoding='utf-8-sig')
assert sorted(failures) == sorted(re.findall(r'^not ok \d+ - (.+)$', old_tap, re.M))
summary = {'baseline': BASE, 'status': 'PASS_WITH_TWO_INHERITED_STATIC_FAILURES',
           'outputParity': len(cases), 'pdfPageChecks': len(pdfs), 'pdfContentChecks': sum('baselinePdfTextMatches' in row for row in pdfs),
           'lifecycle': len(read('lifecycle.json')), 'protocols': len(read('protocols.json')), 'archiveRegression': len(archive['tests']),
           'static': {key: int(re.search(r'^# ' + key + r' (\d+)$', tap, re.M).group(1)) for key in ['tests', 'pass', 'fail']},
           'inheritedFailures': failures, 'physicalPrinterTested': False, 'mainMerged': False}
write('summary.json', summary)
paths = set(subprocess.check_output(['git', 'diff', BASE, '--name-only'], cwd=ROOT, text=True).splitlines())
paths.update(str(path.relative_to(ROOT)).replace('\\', '/') for path in OUT.rglob('*') if path.is_file())
paths.update(['tests/three-engine-fast-polish.cjs', 'tools/three-engine-fast-runtime/serve-baseline.py', 'tools/three-engine-fast-runtime/audit-polish.py'])
write('manifest.json', {'baseline': BASE, 'hashScope': 'working-tree bytes; this manifest excluded from its own digest', 'files': [
    {'path': path, 'sha256': hashlib.sha256((ROOT / path).read_bytes()).hexdigest()}
    for path in sorted(paths) if not path.endswith('/manifest.json')]})
print(json.dumps(summary, ensure_ascii=False, indent=2))
