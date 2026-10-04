#!/usr/bin/env python3
"""Small candidate-only SVG structural polish gate."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--samples", type=Path, required=False)
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
        result["visualPolishPass"] = result["structuralPass"]
        result["defects"] = []
        if args.samples:
            sample = args.samples / f"{svg.parent.name}.json"
            if sample.exists():
                data = json.loads(sample.read_text(encoding="utf-8"))
                vp = data["viewport"]
                labels = []
                for item in data.get("labels", []) + data.get("annotations", []):
                    x, y = item["at"]
                    labels.append((item["id"], float(x), float(y)))
                    if not (float(vp["xMin"]) <= float(x) <= float(vp["xMax"]) and float(vp["yMin"]) <= float(y) <= float(vp["yMax"])):
                        result["defects"].append({"type": "LABEL_VIEWPORT", "id": item["id"]})
                for i, first in enumerate(labels):
                    for second in labels[i + 1:]:
                        if math.hypot(first[1] - second[1], first[2] - second[2]) < 0.12:
                            result["defects"].append({"type": "LABEL_LABEL_COLLISION", "ids": [first[0], second[0]]})
                box = data.get("conditionBox")
                if box and box.get("at"):
                    bx, by = box["at"]
                    if not (float(vp["xMin"]) <= float(bx) <= float(vp["xMax"]) and float(vp["yMin"]) <= float(by) <= float(vp["yMax"])):
                        result["defects"].append({"type": "CONDITION_BOX_VIEWPORT"})
                result["visualPolishPass"] = result["visualPolishPass"] and not result["defects"]
        results.append(result)
    args.out.write_text(json.dumps({"schema": "APMATH_GOLD_POLISH_v2", "results": results, "SVG_STRUCTURAL_VALIDITY": all(r["structuralPass"] for r in results), "VISUAL_POLISH_GATE": all(r["visualPolishPass"] for r in results)}, indent=2) + "\n", encoding="utf-8")
    print(f"SVG_STRUCTURAL_VALIDITY {sum(r['structuralPass'] for r in results)}/{len(results)}")
    print(f"VISUAL_POLISH_GATE {sum(r['visualPolishPass'] for r in results)}/{len(results)}")


if __name__ == "__main__":
    main()
