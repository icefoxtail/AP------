from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908'
MANIFEST = REPORT / '303_specialist_candidate_visual_manifest_r24.json'
TARGET = 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r24/assets/hs-r24-001.svg'
OUT = REPORT / '313_specialist_visual_repair_r24_q13.json'


def sha(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def main() -> None:
    asset = ROOT / TARGET
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    item = next(row for row in manifest['rows'] if row['caseId'] == 'hs-r24-001')
    old_hash = item['assetSha256']
    raw = asset.read_text(encoding='utf-8')
    pattern = r'(<rect x="545" y="350" width="205" height="80" rx="8" class="box"/>)<text x="560" y="381" class="panel">.*?</text>'
    replacement = r'\1<text x="560" y="381" class="panel">최댓값=2 · 최솟값=0.22222</text><text x="560" y="407" class="panel">결과=20/9</text>'
    updated, count = re.subn(pattern, replacement, raw, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f'panel replacement count={count}')
    asset.write_text(updated, encoding='utf-8', newline='\n')
    new_bytes = asset.read_bytes()
    item['assetBytes'] = len(new_bytes)
    item['assetSha256'] = sha(new_bytes)
    repair = {
        'schemaVersion': 'HS_QUADRATIC_SPECIALIST_VISUAL_REPAIR_R24_Q13',
        'status': 'CANDIDATE_RENDER_LABEL_REPAIRED_NO_PASS',
        'questionUid': item['questionUid'],
        'caseId': item['caseId'],
        'assetPath': item['assetPath'],
        'oldAssetSha256': old_hash,
        'newAssetSha256': sha(new_bytes),
        'repair': 'Split the long Cartesian summary panel into two readable lines; fact hash and geometry unchanged.',
        'inputVisibilityProfile': 'CANDIDATE_RENDER_REPAIR',
        'priorReviewVisibility': 'V1_V2_V3_FROZEN_FOR_Q13',
        'statusNote': 'Only render-label layout changed; semantic facts and protected question fields were not changed.'
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    OUT.write_text(json.dumps(repair, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': repair['status'], 'caseId': repair['caseId'], 'oldAssetSha256': old_hash, 'newAssetSha256': repair['newAssetSha256']}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
