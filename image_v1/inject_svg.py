#!/usr/bin/env python3
import argparse
from pathlib import Path
from exam_svg_pipeline import replace_placeholder_in_file, write_json, node_syntax_check

parser = argparse.ArgumentParser(description='승인된 SVG를 플레이스홀더 위치에 정확히 1회 삽입합니다.')
parser.add_argument('--file', required=True)
parser.add_argument('--id', required=True, dest='target_id')
parser.add_argument('--field', required=True)
parser.add_argument('--placeholder', required=True)
parser.add_argument('--svg-file', required=True)
args = parser.parse_args()

svg_text = Path(args.svg_file).read_text(encoding='utf-8')
report = replace_placeholder_in_file(
    Path(args.file),
    args.target_id,
    args.field,
    args.placeholder,
    svg_text,
    backup=True,
)
syntax = node_syntax_check(Path(args.file))
report['syntax_check'] = syntax
report_path = Path(args.file).with_suffix(Path(args.file).suffix + '.inject_report.json')
write_json(report_path, report)
print(report_path)
