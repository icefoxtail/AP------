"""Read-only production freeze and regression inventory for the code upgrade."""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_RUN = 'main-integration-v1'

def run_path(value):
    path = (ROOT / value).resolve()
    family = (ROOT / 'archive/_generated/geometry-visual-engine').resolve()
    if not path.is_relative_to(family):
        raise ValueError('EVIDENCE_OUTPUT_SCOPE_VIOLATION')
    return path

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', *args], cwd=cwd, encoding='utf-8').strip()

def protected():
    return sorted(p for folder in ('archive/assets', 'archive/exams')
                  for p in (ROOT/folder).rglob('*') if p.is_file())

def freeze(run):
    run = run_path(run)
    branch = git('branch', '--show-current')
    main_head = git('rev-parse', 'origin/main')
    ancestor = subprocess.run(['git', 'merge-base', '--is-ancestor', main_head, 'HEAD'], cwd=ROOT)
    if ancestor.returncode != 0:
        raise ValueError('LATEST_MAIN_NOT_ANCESTOR_OF_INTEGRATION')
    if (run/'config/baseline.json').exists():
        raise ValueError('BASELINE_ALREADY_FROZEN')
    baseline = {
        'schemaVersion': 'GEOMETRY_VISUAL_BASELINE_v1',
        'branch': branch, 'head': main_head, 'integrationStartHead': git('rev-parse', 'HEAD'),
        'productionBaselinePolicy': 'READ_ONLY', 'allowProductionWrite': False,
        'initialStatus': git('status', '--porcelain=v1', '-uall'),
        'protectedFiles': {str(p.relative_to(ROOT)).replace('\\','/'): digest(p) for p in protected()},
        'coreFiles': {str(p.relative_to(ROOT)).replace('\\','/'): digest(p)
                      for p in (ROOT/'archive/tools/geometry-equation').glob('*') if p.is_file()},
        'rules': {}, 'goldEvidence': {},
    }
    manifest = (ROOT/'docs/rules/MANIFEST.md').read_text(encoding='utf-8-sig')
    for folder in ('01_CANONICAL', '02_PIPELINES', '04_VISUAL'):
        for p in sorted((ROOT/'docs/rules'/folder).glob('*.md')):
            name = p.relative_to(ROOT/'docs/rules').as_posix()
            line = next((v for v in manifest.splitlines() if v.startswith('- '+name+' |')), None)
            baseline['rules'][name] = {'bytes': p.stat().st_size, 'sha256': digest(p),
                'manifestParity': bool(line and digest(p) in line and f'{p.stat().st_size} bytes' in line)}
    gold = ROOT/'artifacts/tex-pilot/gold-pilot'
    for p in sorted(gold.rglob('*')):
        if p.is_file() and p.suffix in {'.json','.md','.py','.cjs','.tex'}:
            baseline['goldEvidence'][p.relative_to(ROOT).as_posix()] = digest(p)
    samples = [p.relative_to(ROOT).as_posix() for p in sorted((gold/'samples').rglob('*.json'))]
    fixtures = {'goldInputs': samples, 'goldIterationReuseOnly': True,
        'circleOverlap': {'sourceAsset': 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q11-solution.svg',
            'sourceRole': 'real circle tangent cluster, independently frozen numeric fixture',
            'center': [1,1], 'radius': 1, 'nearbyPoints': [[1,1],[1.1,1.1],[1.2,1.2]],
            'mustSeparate': ['POINT_NAME','COORDINATE_LABEL']},
        'mutations': ['wrong perpendicular mark','wrong intersection','exponent corruption',
            'duplicate equation label','bad graph aspect','conditionBox multiline','Hangul glyph',
            'coordinate overlap','point-name overlap','tick-coordinate overlap','circle tangent cluster',
            'cubic/quartic','rational/log/tan discontinuity']}
    write(run/'config/baseline.json', baseline)
    write(run/'config/regression-fixtures.json', fixtures)
    write(run/'config/inheritance-review.json', {
        'authority': ['explicit user instructions','execution plan v1.1','integration spec v1.0','legacy canonical'],
        'skillBranchCheckException': 'Latest-main ancestry check superseded by explicit dedicated branch and no main merge',
        'goldClaimNotInherited': 'r10 defects retains P1-ARCHIVE-RENDER NOT_RUN; item visual-review retains three POLISH_REQUIRED despite aggregate zero. New gates must recompute item totals.',
        'port': ['canonical numeric geometry','source/derived fact split','semantic verification','deterministic witness'],
        'replace': ['regex math serializer','fixed label offsets','standalone-only final gate'],
        'assetPublication': 'No production promotion; code qualification fixtures only'})
    return verify(run)

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def verify(run):
    run = run_path(run)
    baseline = json.loads((run/'config/baseline.json').read_text(encoding='utf-8'))
    actual = {p.relative_to(ROOT).as_posix(): digest(p) for p in protected()}
    changed = sorted(k for k in set(actual)|set(baseline['protectedFiles'])
                     if actual.get(k) != baseline['protectedFiles'].get(k))
    result = {'BASELINE_FROZEN': 'PASS' if not changed else 'FAIL',
        'PRODUCTION_MUTATION_COUNT': len(changed), 'protectedFileCount': len(actual), 'changed': changed}
    if changed:
        raise ValueError(json.dumps(result))
    if git('branch','--show-current') != baseline['branch']:
        raise ValueError('WRONG_BRANCH')
    return result

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify', action='store_true')
    parser.add_argument('--run', default=f'archive/_generated/geometry-visual-engine/{DEFAULT_RUN}')
    args = parser.parse_args()
    print(json.dumps(verify(args.run) if args.verify else freeze(args.run)))
