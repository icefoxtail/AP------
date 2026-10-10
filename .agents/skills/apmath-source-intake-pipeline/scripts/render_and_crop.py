#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_and_crop.py
Renders PDF exam pages at 300 DPI and crops question diagrams/figures
with high fidelity for APMath Archive.
"""

import os
import sys
import argparse
from pathlib import Path

# Ensure UTF-8 output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

try:
    import fitz  # PyMuPDF
    from PIL import Image
except ImportError:
    print("Error: fitz (PyMuPDF) or PIL (Pillow) is not installed.", file=sys.stderr)
    print("Run: pip install pymupdf pillow", file=sys.stderr)
    sys.exit(1)

def render_pdf_pages(pdf_path, output_dir, dpi=300):
    """Renders all pages of a PDF to PNG at specified DPI."""
    doc = fitz.open(pdf_path)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    page_paths = []
    
    # 72 is standard PDF point unit
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    
    for i in range(len(doc)):
        page = doc[i]
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        out_file = output_path / f"page_{i+1:02d}.png"
        pix.save(str(out_file))
        page_paths.append(str(out_file))
    doc.close()
    return page_paths

def split_two_columns(page_png_path, output_dir, col_gap_pct=0.03):
    """Splits a standard Korean 2-column exam page into left and right images."""
    im = Image.open(page_png_path)
    w, h = im.size
    mid = w / 2.0
    half_gap = (w * col_gap_pct) / 2.0
    
    left_box = (0, 0, int(mid - half_gap), h)
    right_box = (int(mid + half_gap), 0, w, h)
    
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = Path(page_png_path).stem
    
    left_path = out_dir / f"{base}_col1.png"
    right_path = out_dir / f"{base}_col2.png"
    
    im.crop(left_box).save(str(left_path))
    im.crop(right_box).save(str(right_path))
    
    return [str(left_path), str(right_path)]

def crop_box(image_path, box, output_path, pad=10):
    """
    Crops a bounding box (left, top, right, bottom) with optional padding.
    Coordinates can be absolute pixels or relative fractions (0.0 ~ 1.0).
    """
    im = Image.open(image_path)
    w, h = im.size
    l, t, r, b = box
    
    # If fractional coordinates
    if 0.0 <= l <= 1.0 and 0.0 <= r <= 1.0 and 0.0 <= t <= 1.0 and 0.0 <= b <= 1.0:
        l = int(l * w)
        r = int(r * w)
        t = int(t * h)
        b = int(b * h)
        
    l = max(0, int(l) - pad)
    t = max(0, int(t) - pad)
    r = min(w, int(r) + pad)
    b = min(h, int(b) + pad)
    
    cropped = im.crop((l, t, r, b))
    out_p = Path(output_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(str(out_p))
    return str(out_p)

def main():
    parser = argparse.ArgumentParser(description="PDF High-Res Render & Asset Cropper")
    parser.add_argument("pdf", help="Path to source PDF")
    parser.add_argument("--out-dir", default=".tmp/rendered_pages", help="Directory to save rendered pages")
    parser.add_argument("--dpi", type=int, default=300, help="Rendering DPI (default: 300)")
    parser.add_argument("--split-cols", action="store_true", help="Split pages into 2 columns")
    args = parser.parse_args()

    pages = render_pdf_pages(args.pdf, args.out_dir, dpi=args.dpi)
    print(f"Rendered {len(pages)} pages to {args.out_dir} at {args.dpi} DPI.")

    if args.split_cols:
        col_dir = Path(args.out_dir) / "columns"
        for p in pages:
            cols = split_two_columns(p, col_dir)
            print(f"Split {p} -> {cols[0]}, {cols[1]}")

if __name__ == "__main__":
    main()
