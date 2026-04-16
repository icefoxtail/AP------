#!/usr/bin/env python3
from pathlib import Path
import shutil
from exam_svg_pipeline import build_geumdang_q5_svg, write_json, replace_existing_svg_with_placeholder, replace_placeholder_in_file, verify_injection, node_syntax_check

base = Path(__file__).resolve().parent
pilot = base / 'pilot_outputs'
pilot.mkdir(exist_ok=True)

source_js = Path('/mnt/data/25_금당중_1학기_중간_중3_기출.js')
placeholder_js = pilot / '25_금당중_1학기_중간_중3_기출__placeholder.js'
final_js = pilot / '25_금당중_1학기_중간_중3_기출__injected.js'
placeholder = '{{SVG_Q5}}'
target_id = '5'
field_name = 'content'

svg, card = build_geumdang_q5_svg()
svg_path = pilot / 'geumdang_q5.svg'
svg_path.write_text(svg, encoding='utf-8')
write_json(pilot / 'geumdang_q5_review_card.json', card)

prep_report = replace_existing_svg_with_placeholder(
    source_js,
    placeholder_js,
    target_id,
    field_name,
    placeholder,
)
write_json(pilot / 'step1_prepare_report.json', prep_report)

shutil.copyfile(placeholder_js, final_js)
inject_report = replace_placeholder_in_file(
    final_js,
    target_id,
    field_name,
    placeholder,
    svg,
    backup=True,
)
inject_report['syntax_check'] = node_syntax_check(final_js)
write_json(pilot / 'step2_inject_report.json', inject_report)

verify_report = verify_injection(
    placeholder_js,
    final_js,
    target_id,
    field_name,
    placeholder,
    svg,
)
verify_report['syntax_check_after'] = node_syntax_check(final_js)
write_json(pilot / 'step3_verify_report.json', verify_report)

print('DONE')
print(svg_path)
print(pilot / 'geumdang_q5_review_card.json')
print(placeholder_js)
print(final_js)
print(pilot / 'step1_prepare_report.json')
print(pilot / 'step2_inject_report.json')
print(pilot / 'step3_verify_report.json')
