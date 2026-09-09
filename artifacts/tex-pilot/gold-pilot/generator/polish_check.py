#!/usr/bin/env python3
"""Small candidate-only SVG structural polish gate."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    results = []
    for svg in sorted(args.output_dir.glob("*/*.svg")):
        root = ET.parse(svg).getroot()
        viewbox = root.get("viewBox", "").split()
        valid_viewbox = len(viewbox) == 4
        positive = False
        if valid_viewbox:
            try:
                positive = float(viewbox[2]) > 0 and float(viewbox[3]) > 0
            except ValueError:
                positive = False
        tags = {element.tag.rsplit("}", 1)[-1] for element in root.iter()}
        result = {
            "id": svg.parent.name,
            "path": str(svg),
            "bytes": svg.stat().st_size,
            "viewBox": root.get("viewBox"),
            "viewBoxPositive": positive,
            "hasWidth": bool(root.get("width")),
            "hasHeight": bool(root.get("height")),
            "hasClipPath": "clipPath" in tags,
            "paths": sum(1 for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "path"),
            "lines": sum(1 for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "line"),
            "circles": sum(1 for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "circle"),
            "texts": sum(1 for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "text"),
        }
        result["structuralPass"] = all((valid_viewbox, positive, result["hasWidth"], result["hasHeight"], result["paths"] + result["lines"] + result["circles"] > 0))
        results.append(result)
    args.out.write_text(json.dumps({"schema": "APMATH_GOLD_POLISH_v1", "results": results, "allStructuralPass": all(r["structuralPass"] for r in results)}, indent=2) + "\n", encoding="utf-8")
    print(f"POLISH_STRUCTURAL_PASS {sum(r['structuralPass'] for r in results)}/{len(results)}")


if __name__ == "__main__":
    main()
