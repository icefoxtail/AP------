"""Reproducible synthetic publication fixtures; never writes production files."""
import hashlib
import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import build, ROOT
from audit_publication import audit

FIXTURES = Path(__file__).parent/'publication-fixtures'
OUT = ROOT/'archive/_generated/geometry-visual-engine/publication-tests'


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for f in sorted(FIXTURES.glob('*.spec.json')):
        name = f.name.removesuffix('.spec.json')
        spec = json.loads(f.read_text(encoding='utf-8'))
        result = build(spec)
        if result != build(spec):
            raise ValueError('NONDETERMINISTIC_PUBLICATION:'+name)
        review = json.loads((FIXTURES/(name+'.review.json')).read_text(encoding='utf-8'))
        report = audit(result['svg'].encode(), review, source_bytes=(FIXTURES/(name+'.source.txt')).read_bytes(), solution_bytes=(FIXTURES/(name+'.solution.txt')).read_bytes())
        (OUT/(name+'.svg')).write_text(result['svg'], encoding='utf-8', newline='\n')
        for suffix, value in [('audit', report), ('witness', result['witness'])]:
            (OUT/(name+'.'+suffix+'.json')).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        rows.append({'id':name,'svg':(OUT/(name+'.svg')).relative_to(ROOT).as_posix(),'svgSha256':hashlib.sha256(result['svg'].encode()).hexdigest(),'staticStatus':report['status'],'buildStatus':result['witness']['status']})
    (OUT/'manifest.json').write_text(json.dumps(rows, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(rows))
    return 0 if rows and all(r['staticStatus']=='PASS' and r['buildStatus']=='CANDIDATE_REQUIRES_QA' for r in rows) else 1


if __name__=='__main__':raise SystemExit(main())
