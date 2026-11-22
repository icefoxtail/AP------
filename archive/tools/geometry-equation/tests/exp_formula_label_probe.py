"""Probe for exp-formula-label.test.mjs: reads a JSON list of {text, a, k, c, base, shift} on stdin and prints, for each, the TeX the engine serializer makes of the
label text and the glyph codes the observer works out from the exact numbers (never from the text)."""
import json
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'production'))
from visual_engine.math_expression import parse, serialize
from graph_observer import _exp_formula_glyphs, _exp_log_observer_base

rows = json.load(sys.stdin)
out = []
for row in rows:
    base = _exp_log_observer_base(row.get('base'), 'EXPONENTIAL')
    want = _exp_formula_glyphs(Fraction(row['a']), Fraction(row['k']), Fraction(row['c']), base, Fraction(row.get('shift', '0')))
    out.append({'text': row['text'], 'tex': serialize(parse(row['text'])), 'want': want})
sys.stdout.reconfigure(encoding='utf8')
print(json.dumps(out, ensure_ascii=False))
