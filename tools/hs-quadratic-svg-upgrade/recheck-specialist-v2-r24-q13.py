from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908'
VISUAL = json.loads((REPORT / '303_specialist_candidate_visual_manifest_r24.json').read_text(encoding='utf-8'))
ITEM = next(row for row in VISUAL['rows'] if row['caseId'] == 'hs-r24-001')
ASSET = ROOT / ITEM['assetPath']
OUTPUT = REPORT / '318_specialist_v2_artifact_only_r24_recheck_q13.json'
SVG_NS = '{http://www.w3.org/2000/svg}'


def main() -> None:
    root = ET.fromstring(ASSET.read_bytes())
    observed_text = ' '.join((node.text or '').strip() for node in root.iter() if node.tag == f'{SVG_NS}text')
    output = {
        'schemaVersion': 'HS_QUADRATIC_SPECIALIST_V2_ARTIFACT_ONLY_R24_RECHECK_Q13',
        'status': 'V2_ARTIFACT_ONLY_RECHECK_RECORDED_NO_FINAL_PASS',
        'productionAuthorized': False,
        'rows': [{
            'questionUid': ITEM['questionUid'],
            'caseId': ITEM['caseId'],
            'assetPath': ITEM['assetPath'],
            'artifactFactHash': root.attrib.get('data-fact-hash'),
            'observedText': observed_text,
            'observedElements': {
                'svgTitlePresent': root.find(f'{SVG_NS}title') is not None,
                'polylineCount': len(root.findall(f'{SVG_NS}polyline')),
                'lineCount': len(root.findall(f'{SVG_NS}line')),
                'circleCount': len(root.findall(f'{SVG_NS}circle')),
                'textCount': len(root.findall(f'{SVG_NS}text')),
                'responsiveViewBox': root.attrib.get('preserveAspectRatio') == 'xMidYMid meet'
            },
            'inputVisibilityProfile': 'ARTIFACT_ONLY',
            'priorReviewVisibility': 'NONE',
            'repairScope': 'R24_Q13_RENDER_LABEL_ONLY',
            'status': 'V2_OBSERVED_RECHECK_RECORDED_NO_SEMANTIC_PASS'
        }],
        'semanticIndependentFactAdjudication': 'PENDING_TARGETED_V3',
        'note': 'Targeted artifact-only recheck after q13 label layout repair; source, solution, and V1 facts were not read by this extractor.'
    }
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': output['status'], 'rows': len(output['rows']), 'semanticIndependentFactAdjudication': output['semanticIndependentFactAdjudication']}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
