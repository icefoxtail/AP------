"""Explicit run scope, read-only production, and bounded runtime policy."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[4]
ALLOWED={'engineVersion','runId','outputRoot','productionBaselinePolicy','allowProductionWrite','maxRelayoutPasses'}

def validate_config(config):
    if not isinstance(config,dict) or set(config)-ALLOWED:raise ValueError('UNKNOWN_CONFIG_FIELD')
    if config.get('engineVersion')!='geometry-visual-v1' or config.get('productionBaselinePolicy')!='READ_ONLY' or config.get('allowProductionWrite') is not False:raise ValueError('PRODUCTION_WRITE_FORBIDDEN')
    run=config.get('runId','')
    if not isinstance(run,str) or not re.fullmatch('[A-Za-z0-9_-]{1,80}',run):raise ValueError('INVALID_RUN_ID')
    cap=config.get('maxRelayoutPasses',3)
    if isinstance(cap,bool) or not isinstance(cap,int) or not 1<=cap<=3:raise ValueError('INVALID_RELAYOUT_CAP')
    return {**config,'maxRelayoutPasses':cap}

def resolve_output(config):
    config=validate_config(config);run=config['runId']
    allowed=(ROOT/'archive/_generated/geometry-visual-engine'/run).resolve()
    family=(ROOT/'archive/_generated/geometry-visual-engine').resolve()
    path=(ROOT/config.get('outputRoot',f'archive/_generated/geometry-visual-engine/{run}')).resolve()
    if not allowed.is_relative_to(family) or not path.is_relative_to(allowed):raise ValueError('PRODUCTION_WRITE_FORBIDDEN')
    return path
