from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908'
MANIFEST = json.loads((REPORT / '330_current_candidate_bank_manifest_r25.json').read_text(encoding='utf-8'))
OUTPUT = REPORT / '344_source_repair_visual_v2_artifact_only_r25.json'
TARGETS = [
    ('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js', 20),
    ('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js', 22),
    ('archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 16),
    ('archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 6),
    ('archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 9),
    ('archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 13),
    ('archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 14),
    ('archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 6),
    ('archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 7),
    ('archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js', 4),
    ('archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js', 5),
]


def main() -> None:
    visual_rows = {(row['sourceJsPath'], row['id']): row for row in MANIFEST['visualRows']}
    rows = []
    for source_path, question_id in TARGETS:
        item = visual_rows[(source_path, question_id)]
        asset = ROOT / item['assetPath']
        root = ET.fromstring(asset.read_bytes())
        text = ' '.join((node.text or '').strip() for node in root.iter() if node.tag == '{http://www.w3.org/2000/svg}text')
        rows.append({
            'sourceJsPath': source_path,
            'id': question_id,
            'assetPath': item['assetPath'],
            'artifactFactHash': root.attrib.get('data-fact-hash'),
            'observedText': text,
            'observedElements': {
                'svgTitlePresent': root.find('{http://www.w3.org/2000/svg}title') is not None,
                'polylineCount': len(root.findall('{http://www.w3.org/2000/svg}polyline')),
                'lineCount': len(root.findall('{http://www.w3.org/2000/svg}line')),
                'circleCount': len(root.findall('{http://www.w3.org/2000/svg}circle')),
                'textCount': len(root.findall('{http://www.w3.org/2000/svg}text')),
                'responsiveViewBox': root.attrib.get('preserveAspectRatio') == 'xMidYMid meet'
            },
            'inputVisibilityProfile': 'ARTIFACT_ONLY',
            'priorReviewVisibility': 'NONE',
            'status': 'V2_OBSERVED_RECHECK_RECORDED_NO_SEMANTIC_PASS'
        })
    output = {'schemaVersion': 'HS_QUADRATIC_SOURCE_REPAIR_VISUAL_V2_ARTIFACT_ONLY_R25', 'status': 'V2_ARTIFACT_ONLY_RECHECK_RECORDED_NO_FINAL_PASS', 'productionAuthorized': False, 'rows': rows, 'semanticIndependentFactAdjudication': 'PENDING_TARGETED_V3', 'note': 'Artifact-only recheck of visual rows affected by current-source solution repairs; no source solution or expected fact was read here.'}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': output['status'], 'rows': len(rows), 'semanticIndependentFactAdjudication': output['semanticIndependentFactAdjudication']}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
