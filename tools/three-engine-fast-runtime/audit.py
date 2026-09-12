"""Audit saved browser evidence, actual Chrome PDFs, and the handoff file set."""
from pathlib import Path
import hashlib
import json
import subprocess
import re
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'reports/three-engine-fast-runtime'
BASELINE = '6d93da5bea3ecfdcb7d164b78ad72659eeec4ab4'


def read(name):
    return json.loads((OUT / name).read_text(encoding='utf-8'))


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


parity = read('parity.json') + read('extended-parity.json')
assert len({case['name'] for case in parity}) == len(parity)
assert all(case['pass'] for case in parity)
pdf_rows = []
for case in parity:
    reader = PdfReader(OUT / (case['name'] + '.pdf'))
    expected = len(case['pair'][1]['capture'])
    pdf_rows.append({'name': case['name'], 'screenPages': expected, 'pdfPages': len(reader.pages), 'pass': len(reader.pages) == expected})
assert all(row['pass'] for row in pdf_rows)
write('pdf-page-audit.json', pdf_rows)

printed_parity = []
for case in read('print-parity.json'):
    baseline = PdfReader(OUT / (case['name'] + '-baseline.pdf'))
    current = PdfReader(OUT / (case['name'] + '.pdf'))
    texts = lambda reader: [' '.join((page.extract_text() or '').split()) for page in reader.pages]
    printed_parity.append({'name': case['name'], 'baselinePages': len(baseline.pages), 'fastPages': len(current.pages),
                           'pageCountEqual': len(baseline.pages) == len(current.pages), 'textEqualPerPage': texts(baseline) == texts(current)})
assert all(row['pageCountEqual'] and row['textEqualPerPage'] for row in printed_parity)
write('pdf-content-parity.json', printed_parity)

archive = read('archive-final.json')
assert all(item['status'] == 'PASS' for item in archive['tests']) and not archive['errors']
for name in ['lifecycle.json', 'protocols.json']:
    assert all(item['pass'] for item in read(name))
tap = (OUT / 'static-tests.tap').read_text(encoding='utf-8-sig')
baseline_tap = (OUT / 'baseline-inherited-tests.tap').read_text(encoding='utf-8-sig')
failures = re.findall(r'^not ok \d+ - (.+)$', tap, re.M)
baseline_failures = re.findall(r'^not ok \d+ - (.+)$', baseline_tap, re.M)
assert sorted(failures) == sorted(baseline_failures) and len(failures) == 2
counts = {key: int(re.search(r'^# ' + key + r' (\d+)$', tap, re.M).group(1)) for key in ['tests', 'pass', 'fail']}
summary = {
    'status': 'SELF_TESTED_BRANCH_READY_FOR_REVIEW', 'baseline': BASELINE,
    'branch': subprocess.check_output(['git', 'branch', '--show-current'], cwd=ROOT, text=True).strip(),
    'implementationCommits': ['110d7ccf6', 'd448dddc8'],
    'browserChecks': {'outputParity': len(parity), 'lifecycle': len(read('lifecycle.json')), 'protocols': len(read('protocols.json')), 'archiveRegression': len(archive['tests'])},
    'pdfChecks': {'documentsMatchingScreenPageCount': len(pdf_rows), 'baselineAndFastDocumentsWithEqualPerPageText': len(printed_parity),
                  'publicRouteDocuments': [{'kind': kind, 'pages': len(PdfReader(OUT / f'public-{kind}.pdf').pages)} for kind in ['packet', 'set', 'compact']]},
    'staticTests': {'total': counts['tests'], 'pass': counts['pass'], 'fail': counts['fail'], 'failuresAlsoReproducedOnBaseline': True, 'failureNames': failures},
    'limitations': ['Physical printer/PCL/GDI transport was not sent; Chrome PDF output and print-button preflight were tested.',
                    'Business API calls were intercepted with deterministic responses; no production records were written.',
                    'Historical Phase 0 SHA lock and drift-ledger tests already fail on the frozen baseline.',
                    'Archive retains its stricter adapter/snapshot contract and measured layout materializer; Mixer uses the shared executor observed placement strategy; Wrong uses the shared composed placement strategy.'],
    'mergedToMain': False,
}
write('summary.json', summary)

files = set(subprocess.check_output(['git', 'diff', BASELINE, '--name-only'], cwd=ROOT, text=True).splitlines())
files.update(str(p.relative_to(ROOT)).replace('\\', '/') for p in OUT.rglob('*') if p.is_file())
files.update(str(p.relative_to(ROOT)).replace('\\', '/') for p in (ROOT / 'tools/three-engine-fast-runtime').rglob('*') if p.is_file())
files.update(str(p.relative_to(ROOT)).replace('\\', '/') for p in (ROOT / 'tests').glob('three-engine-fast-*.cjs'))
files.add('tests/common-render-measurement.test.js')
files.add('reports/three-engine-fast-runtime/changed-files.json')
files.add('reports/three-engine-fast-runtime/artifact-manifest.json')
write('changed-files.json', {'relativeTo': str(ROOT), 'baseline': BASELINE, 'files': sorted(files)})
manifest = []
for name in sorted(files):
    if name.endswith('/artifact-manifest.json'):
        continue  # A manifest cannot include its own digest.
    data = (ROOT / name).read_bytes()
    manifest.append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
write('artifact-manifest.json', {'hashScope': 'working-tree bytes of every handoff file except this manifest', 'files': manifest})
print(json.dumps(summary, ensure_ascii=False, indent=2))
