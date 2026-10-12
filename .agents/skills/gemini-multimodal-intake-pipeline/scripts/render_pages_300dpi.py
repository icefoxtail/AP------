#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_pages_300dpi.py
Renders all pages of a target exam PDF at 300 DPI into high-resolution PNG files
for Gemini multimodal visual inspection.
"""

import os
import sys
import argparse
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF (fitz) is not installed. Run: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Render PDF pages at 300 DPI")
    parser.add_argument("pdf", help="Path to source PDF file")
    parser.add_argument("--out-dir", default=".tmp/gmdi_rendered", help="Output directory")
    parser.add_argument("--dpi", type=int, default=300, help="Resolution DPI (default: 300)")
    args = parser.parse_args()

    doc = fitz.open(args.pdf)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    zoom = args.dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)

    rendered = []
    for i in range(len(doc)):
        page = doc[i]
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        out_file = out_dir / f"page_{i+1:02d}.png"
        pix.save(str(out_file))
        rendered.append(str(out_file))
        print(f"Rendered Page {i+1:02d}: {pix.width}x{pix.height} -> {out_file}")

    doc.close()
    print(f"\nSuccessfully rendered {len(rendered)} pages to {out_dir} at {args.dpi} DPI.")

if __name__ == "__main__":
    main()
