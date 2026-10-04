from __future__ import annotations

import hashlib
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908'
FACTS = REPORT / '645_specialist_v1_expected_facts_r44.json'
OUT_ROOT = ROOT / 'archive' / '_generated' / 'hs-quadratic-svg-upgrade-20260908' / 'candidate-r44' / 'assets'
MANIFEST = REPORT / '646_specialist_candidate_visual_manifest_r44.json'
BASE_PATH = Path(__file__).with_name('generate-deterministic-candidate-visuals-r11.py')
spec = importlib.util.spec_from_file_location('base_visuals_r44', BASE_PATH)
base = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(base)


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def fact_digest(fact: dict) -> str:
    return digest(json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8'))


def repair_layout(case_id: str, svg: str) -> str:
    # Keep the mathematical anchors intact while making the two densest layouts
    # readable in both the 800px desktop and narrow/mobile render captures.
    if case_id == 'hs-r44-001':
        old = '<rect x="545" y="350" width="205" height="80" rx="8" class="box"/><text x="560" y="381" class="panel">최댓값=9 · 최솟값=17/9 · 결과=-96</text>'
        new = ('<rect x="70" y="350" width="660" height="85" rx="8" class="box"/>'
               '<text x="88" y="379" class="panel">최댓값=9 · 최솟값=17/9</text>'
               '<text x="88" y="408" class="panel">결과=-96</text>')
        svg = svg.replace(old, new)
    if case_id == 'hs-r44-003':
        label_pattern = re.compile(
            r'(<circle cx="[^"]+" cy="97" r="4" class="point"/><text x="[^"]+" y=")'
            r'\d+(" text-anchor="middle" class="small label">\d+</text>)'
        )
        index = 0

        def stagger(match: re.Match[str]) -> str:
            nonlocal index
            y = 70 if index % 2 == 0 else 84
            index += 1
            return f'{match.group(1)}{y}{match.group(2)}'

        svg = label_pattern.sub(stagger, svg)
        old = ('<rect x="70" y="215" width="580" height="65" rx="8" class="box"/>'
               '<text x="88" y="248" class="panel">결과=85 · 개수=10 · 정수해=38,39,40,41,42,43,44,45,46,47 · '
               '38≤x≤47, 최댓값+최솟값=85</text>')
        new = ('<rect x="70" y="210" width="580" height="80" rx="8" class="box"/>'
               '<text x="88" y="238" class="panel">결과=85 · 개수=10 · 정수해=38,39,40,41,42</text>'
               '<text x="88" y="266" class="panel">43,44,45,46,47 · 38≤x≤47, 최댓값+최솟값=85</text>')
        svg = svg.replace(old, new)
    return svg


def render(case_id: str, item: dict) -> str:
    fact = item['expectedFacts']
    if item['expectedVisualType'] == 'number-line':
        svg = base.number_line(case_id, fact, '부등식·매개변수 해집합 수직선')
        if any(interval.get('left') is None for interval in fact.get('solutionIntervals', [])) or fact.get('solutionInterval', [1, 1])[0] is None:
            svg = svg.replace('<circle cx="70" cy="125" r="7" class="open"/>', '<path d="M 70 125 l 8 -5 l 0 10 z" class="arrow"/>', 1)
        if any(interval.get('right') is None for interval in fact.get('solutionIntervals', [])) or fact.get('solutionInterval', [1, 1])[1] is None:
            svg = svg.replace('<circle cx="610" cy="125" r="7" class="open"/>', '<path d="M 610 125 l -8 -5 l 0 10 z" class="arrow"/>', 1)
    else:
        svg = base.cartesian(case_id, fact, '이차방정식·판별식·함수 구조 그래프')
    return repair_layout(case_id, svg).replace('candidate_builder_python_r11', 'candidate_builder_python_r44')


data = json.loads(FACTS.read_text(encoding='utf-8'))
rows = []
for index, item in enumerate(data['rows'], 1):
    case_id = f'hs-r44-{index:03d}'
    out = OUT_ROOT / f'{case_id}.svg'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(case_id, item), encoding='utf-8', newline='\n')
    raw = out.read_bytes()
    rows.append({
        'questionUid': item['questionUid'],
        'caseId': case_id,
        'assetPath': out.relative_to(ROOT).as_posix(),
        'assetBytes': len(raw),
        'assetSha256': digest(raw),
        'factSha256': fact_digest(item['expectedFacts']),
        'status': 'CANDIDATE_GENERATED_NO_PASS',
    })
output = {
    'schemaVersion': 'HS_QUADRATIC_SPECIALIST_CANDIDATE_VISUAL_MANIFEST_R44',
    'status': 'CANDIDATE_GENERATED_NO_PASS',
    'productionAuthorized': False,
    'v1Facts': FACTS.relative_to(ROOT).as_posix(),
    'rows': rows,
    'note': 'Generated from one fresh source-only cartesian/function fact and six fresh source-only number-line facts; dense mobile labels and summary panels were repaired without changing fact anchors; no semantic or final PASS is claimed.',
}
MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'status': output['status'], 'generated': len(rows)}, ensure_ascii=False, indent=2))
