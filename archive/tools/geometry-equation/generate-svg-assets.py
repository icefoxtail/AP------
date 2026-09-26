"""Thin legacy asset adapter; source prose cannot substitute for frozen facts."""
from visual_engine.entrypoints import build_independent
from visual_engine.engine import cli
from legacy_assets_parser import extract_points,parse_number,visual_kind,ranges_for

def build_svg(row,points=None,text=None):
    fact=row.get('independentFactsFrozen')
    if not isinstance(fact,dict):raise ValueError('EXPECTED_FACT_FREEZE_REQUIRED')
    result=build_independent(row,fact)
    return result['svg'],row.get('solutionImageAlt','Geometry facts'),row.get('solutionImageCaption','Point and shape relationships'),result['witness']

if __name__=='__main__':cli()
