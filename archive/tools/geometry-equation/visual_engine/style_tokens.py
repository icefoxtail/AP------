from pathlib import Path
import json

def load():
    tokens=json.loads(Path(__file__).with_name('style_tokens.json').read_text(encoding='utf-8'))
    if not tokens['mainShape']>tokens['secondaryShape']>tokens['auxiliary']>tokens['indicator']:
        raise ValueError('GEOMETRY_STROKE_HIERARCHY_FAIL')
    if not tokens['mainCurve']>tokens['axis']>tokens['auxiliary']:
        raise ValueError('GRAPH_STROKE_HIERARCHY_FAIL')
    return tokens
