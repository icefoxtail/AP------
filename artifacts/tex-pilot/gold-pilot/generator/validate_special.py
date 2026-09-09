#!/usr/bin/env python3
"""Numeric authority for the isolated SPECIAL lane."""

from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path


def line(p, q):
    a, b = p[1] - q[1], q[0] - p[0]
    c = p[0] * q[1] - q[0] * p[1]
    return a, b, c


def normalized(coefficients):
    norm = math.hypot(coefficients[0], coefficients[1])
    return tuple(value / norm for value in coefficients)


def intersection(first, second):
    a1, b1, c1 = first
    a2, b2, c2 = second
    det = a1 * b2 - a2 * b1
    if abs(det) < 1e-12:
        raise SystemExit("SPECIAL_FACT_ERROR: coincident or parallel lines")
    return ((b1 * c2 - b2 * c1) / det, (c1 * a2 - c2 * a1) / det)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("facts", type=Path)
    parser.add_argument("tex", type=Path)
    parser.add_argument("--witness", type=Path, required=True)
    args = parser.parse_args()
    data = json.loads(args.facts.read_text(encoding="utf-8"))
    src = data["sourceFacts"]
    ab, pq = line(src["A"], src["B"]), line(src["P"], src["Q"])
    for name, coefficients in (("AB", ab), ("PQ", pq)):
        expected_coefficients = data.get("derivedFacts", {}).get(name)
        if expected_coefficients:
            actual = normalized(coefficients)
            expected = tuple(float(expected_coefficients[key]) for key in ("a", "b", "c"))
            if max(abs(actual[i] - expected[i]) for i in range(3)) > 1e-8:
                raise SystemExit(f"SPECIAL_FACT_ERROR: derived {name} line parity mismatch")
    hit = intersection(ab, pq)
    expected = src["limitPoint"]
    if math.hypot(hit[0] - expected[0], hit[1] - expected[1]) > 1e-8:
        raise SystemExit(f"SPECIAL_FACT_ERROR: R mismatch calculated={hit} expected={expected}")
    text = args.tex.read_text(encoding="utf-8")
    marker = re.search(r"derived-witness R=\(([-0-9.]+),([-0-9.]+)\)", text)
    if not marker or math.hypot(float(marker.group(1)) - hit[0], float(marker.group(2)) - hit[1]) > 1e-8:
        raise SystemExit("SPECIAL_FACT_ERROR: handcrafted TeX does not carry calculated R witness")
    args.witness.parent.mkdir(parents=True, exist_ok=True)
    args.witness.write_text(json.dumps({"schema": "APMATH_SPECIAL_GEOMETRY_WITNESS_v1", "id": data["id"], "AB": list(ab), "PQ": list(pq), "ABCanonical": list(normalized(ab)), "PQCanonical": list(normalized(pq)), "R": [round(hit[0], 12), round(hit[1], 12)], "sourceFacts": src, "derivedFacts": data.get("derivedFacts", {})}, indent=2) + "\n", encoding="utf-8")
    print(f"SPECIAL_FACT_PASS R=({hit[0]:.12g},{hit[1]:.12g})")


if __name__ == "__main__":
    main()
