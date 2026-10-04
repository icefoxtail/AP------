"""Thin independent-facts adapter. Writes only isolated candidates."""
from visual_engine.entrypoints import build_independent
from visual_engine.engine import cli
from legacy_independent_builder import extract_points,extract_radius,parse_number

def build_svg(row,fact):
    result=build_independent(row,fact)
    return result['svg'],result['witness']

if __name__=='__main__':cli()
