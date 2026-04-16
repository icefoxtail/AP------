#!/usr/bin/env python3
from pathlib import Path
from exam_svg_pipeline import build_geumdang_q5_svg, write_json

base = Path(__file__).resolve().parent
out = base / 'pilot_outputs'
out.mkdir(exist_ok=True)

svg, card = build_geumdang_q5_svg()
(out / 'geumdang_q5.svg').write_text(svg, encoding='utf-8')
write_json(out / 'geumdang_q5_review_card.json', card)
print(out / 'geumdang_q5.svg')
print(out / 'geumdang_q5_review_card.json')
