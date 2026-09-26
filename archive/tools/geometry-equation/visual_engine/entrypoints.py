"""STANDARD structured facts, explicit SPECIAL registry, diagnostic LEGACY."""
import json
from pathlib import Path
from .engine import build

REGISTRY=Path(__file__).with_name('legacy_registry.json')

def classification(row,fact):
    if fact.get('visualSpec'):return 'STANDARD'
    if fact.get('specialVisual'):return 'SPECIAL'
    return 'LEGACY'

def build_independent(row,fact):
    if not fact.get('independentFactHash'):raise ValueError('EXPECTED_FACT_FREEZE_REQUIRED')
    lane=classification(row,fact)
    if lane=='STANDARD':
        spec=fact['visualSpec']
        if spec['sourceFacts'].get('independentFactHash')!=fact['independentFactHash']:
            raise ValueError('FROZEN_FACT_HASH_BINDING_FAIL')
        result=build(spec);result['witness']['independentFactHash']=fact['independentFactHash'];return result
    if lane=='SPECIAL':raise ValueError('SPECIAL_REQUIRES_NUMERIC_SEMANTIC_AND_COMMON_QA')
    if not fact.get('allowLegacyDiagnostic'):raise ValueError('STRUCTURED_VISUAL_SPEC_REQUIRED')
    suffixes=json.loads(REGISTRY.read_text(encoding='utf-8'))['legacySuffixes']
    if not any(row.get('qKey','').endswith(s) for s in suffixes):raise ValueError('LEGACY_UNSUPPORTED')
    from legacy_independent_builder import _build_custom_svg
    legacy=_build_custom_svg(row,fact)
    if legacy is None:raise ValueError('LEGACY_UNSUPPORTED')
    svg,witness=legacy;witness.update(status='LEGACY_REVIEW_REQUIRED',classification='LEGACY',publicationAuthorized=False)
    return {'svg':svg,'witness':witness}
