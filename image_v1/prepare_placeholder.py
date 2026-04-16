#!/usr/bin/env python3
import argparse
from pathlib import Path
from exam_svg_pipeline import replace_existing_svg_with_placeholder, write_json

parser = argparse.ArgumentParser(description='기존 JS의 특정 문항/필드에 들어 있는 SVG를 플레이스홀더로 치환한 복사본을 만듭니다.')
parser.add_argument('--source', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--id', required=True, dest='target_id')
parser.add_argument('--field', required=True)
parser.add_argument('--placeholder', required=True)
args = parser.parse_args()

report = replace_existing_svg_with_placeholder(
    Path(args.source),
    Path(args.output),
    args.target_id,
    args.field,
    args.placeholder,
)
report_path = Path(args.output).with_suffix(Path(args.output).suffix + '.prepare_report.json')
write_json(report_path, report)
print(report_path)
