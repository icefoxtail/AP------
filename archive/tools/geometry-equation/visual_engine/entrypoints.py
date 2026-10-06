"""STANDARD structured facts, explicit SPECIAL registry, diagnostic LEGACY."""
import json
from pathlib import Path
from .engine import build,ROOT

REGISTRY=Path(__file__).with_name('legacy_registry.json')

def classification(row,fact):
    if fact.get('specialVisual'):return 'SPECIAL'
    if fact.get('visualSpec'):return 'STANDARD'
    return 'LEGACY'

def build_independent(row,fact):
    if not fact.get('independentFactHash'):raise ValueError('EXPECTED_FACT_FREEZE_REQUIRED')
    lane=classification(row,fact)
    if lane=='STANDARD':
        spec=fact['visualSpec']
        if spec['sourceFacts'].get('independentFactHash')!=fact['independentFactHash']:
            raise ValueError('FROZEN_FACT_HASH_BINDING_FAIL')
        result=build(spec);result['witness']['independentFactHash']=fact['independentFactHash'];return result
    if lane=='SPECIAL':
        special=fact['specialVisual'];registry=json.loads(Path(__file__).with_name('special_registry.json').read_text(encoding='utf-8'))
        if not isinstance(special,dict) or special.get('adapter') not in registry['adapters'] or not fact.get('visualSpec'):raise ValueError('SPECIAL_REQUIRES_NUMERIC_SEMANTIC_AND_COMMON_QA')
        spec=fact['visualSpec']
        if spec['sourceFacts'].get('independentFactHash')!=fact['independentFactHash']:raise ValueError('FROZEN_FACT_HASH_BINDING_FAIL')
        asset=(ROOT/special['path']).resolve()
        if not asset.is_relative_to((ROOT/'.tmp/archive').resolve()):raise ValueError('SPECIAL_ASSET_SCOPE_VIOLATION')
        result=build(spec);svg=asset.read_text(encoding='utf-8')
        from .engine import sha
        result['svg']=svg;result['witness'].update(classification='SPECIAL',status='CANDIDATE_REQUIRES_COMMON_QA',normalizedSvgSha256=sha(svg),publicationAuthorized=False)
        result['witness']['requiredGates']=['ACTUAL_SVG_PARITY','DISPLAYED_MATH_PARITY','RENDERED_LAYOUT','ARCHIVE_RENDER'];return result
    if not fact.get('allowLegacyDiagnostic'):raise ValueError('STRUCTURED_VISUAL_SPEC_REQUIRED')
    suffixes=json.loads(REGISTRY.read_text(encoding='utf-8'))['legacySuffixes']
    if not any(row.get('qKey','').endswith(s) for s in suffixes):raise ValueError('LEGACY_UNSUPPORTED')
    from legacy_independent_builder import _build_custom_svg
    legacy=_build_custom_svg(row,fact)
    if legacy is None:raise ValueError('LEGACY_UNSUPPORTED')
    svg,witness=legacy;witness.update(status='LEGACY_REVIEW_REQUIRED',classification='LEGACY',publicationAuthorized=False)
    return {'svg':svg,'witness':witness}
