from __future__ import annotations
import hashlib
import importlib.util
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]; REPORT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908'; FACTS = REPORT / '426_specialist_v1_expected_facts_r31.json'; OUT_ROOT = ROOT / 'archive' / '_generated' / 'hs-quadratic-svg-upgrade-20260908' / 'candidate-r31' / 'assets'; MANIFEST = REPORT / '427_specialist_candidate_visual_manifest_r31.json'; BASE_PATH = Path(__file__).with_name('generate-deterministic-candidate-visuals-r11.py'); spec = importlib.util.spec_from_file_location('base_visuals_r31', BASE_PATH); base = importlib.util.module_from_spec(spec); assert spec.loader is not None; spec.loader.exec_module(base)
def digest(value: bytes) -> str: return hashlib.sha256(value).hexdigest()
def fact_digest(fact: dict) -> str: return digest(json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8'))
def render(case_id: str, item: dict) -> str:
    fact = item['expectedFacts']; svg = base.number_line(case_id, fact, '부등식·매개변수 해집합 수직선') if item['expectedVisualType'] == 'number-line' else base.cartesian(case_id, fact, '이차함수 그래프와 핵심 조건')
    if item['expectedVisualType'] == 'number-line' and isinstance(fact.get('solutionInterval'), list) and fact['solutionInterval'][0] is None:
        svg = svg.replace('<circle cx="70" cy="125" r="7" class="open"/>', '<path d="M 70 125 l 8 -5 l 0 10 z" class="arrow"/>', 1)
    return svg.replace('candidate_builder_python_r11', 'candidate_builder_python_r31')
data = json.loads(FACTS.read_text(encoding='utf-8')); rows = []
for index, item in enumerate(data['rows'], 1):
    case_id = f'hs-r31-{index:03d}'; out = OUT_ROOT / f'{case_id}.svg'; out.parent.mkdir(parents=True, exist_ok=True); out.write_text(render(case_id, item), encoding='utf-8', newline='\n'); raw = out.read_bytes(); rows.append({'questionUid': item['questionUid'], 'caseId': case_id, 'assetPath': out.relative_to(ROOT).as_posix(), 'assetBytes': len(raw), 'assetSha256': digest(raw), 'factSha256': fact_digest(item['expectedFacts']), 'status': 'CANDIDATE_GENERATED_NO_PASS'})
output = {'schemaVersion': 'HS_QUADRATIC_SPECIALIST_CANDIDATE_VISUAL_MANIFEST_R31', 'status': 'CANDIDATE_GENERATED_NO_PASS', 'productionAuthorized': False, 'v1Facts': FACTS.relative_to(ROOT).as_posix(), 'rows': rows, 'note': 'Generated from 4 fresh source-only function/cartesian facts and 4 fresh source-only parameter/inequality number-line facts; no semantic or final PASS is claimed.'}; MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'); print(json.dumps({'status': output['status'], 'generated': len(rows)}, ensure_ascii=False, indent=2))
