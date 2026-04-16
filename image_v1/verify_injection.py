#!/usr/bin/env python3
import argparse
from pathlib import Path
from exam_svg_pipeline import verify_injection, write_json, node_syntax_check

parser = argparse.ArgumentParser(description='플레이스홀더 치환 전/후 파일을 비교하여 도형 삽입 무결성을 검증합니다.')
parser.add_argument('--before', required=True)
parser.add_argument('--after', required=True)
parser.add_argument('--id', required=True, dest='target_id')
parser.add_argument('--field', required=True)
parser.add_argument('--placeholder', required=True)
parser.add_argument('--svg-file', required=True)
args = parser.parse_args()

svg_text = Path(args.svg_file).read_text(encoding='utf-8')
report = verify_injection(
    Path(args.before),
    Path(args.after),
    args.target_id,
    args.field,
    args.placeholder,
    svg_text,
)
report['syntax_check_after'] = node_syntax_check(Path(args.after))
report_path = Path(args.after).with_suffix(Path(args.after).suffix + '.verify_report.json')
write_json(report_path, report)
print(report_path)
