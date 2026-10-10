#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
crop_diagrams.py
Crops mathematical diagrams, graphs, and figures from 300 DPI rendered pages
based on pixel coordinates identified by Gemini multimodal vision.

[Image Quality Contract]
- Automatically removes scan background noise and gray shading, forcing background to pure white (#FFFFFF).
- Preserves smooth anti-aliased line strokes via contrast stretching.
- Supports 'clean_masks' in crop spec JSON to cleanly erase external scribbles, handwriting, or margin text.
"""

import os
import sys
import json
import argparse
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("Error: Pillow and numpy must be installed. Run: pip install pillow numpy", file=sys.stderr)
    sys.exit(1)

def clean_diagram_image(img, bg_threshold=220, black_point=40, clean_masks=None):
    """
    1. Erases specified scribble / text / margin regions using clean_masks (set to pure #FFFFFF).
    2. Remaps background gray shading (>= bg_threshold) to pure white (#FFFFFF).
    3. Smoothly stretches stroke contrast between black_point and bg_threshold.
    """
    arr = np.array(img.convert("RGB"), dtype=np.float32)

    # 1. Apply clean masks (relative coordinates to crop box: [x1, y1, x2, y2])
    if clean_masks:
        for m in clean_masks:
            if isinstance(m, dict) and "box" in m:
                box = m["box"]
            elif isinstance(m, (list, tuple)):
                box = m
            else:
                continue
            x1, y1, x2, y2 = box
            x1 = max(0, int(x1))
            y1 = max(0, int(y1))
            x2 = min(arr.shape[1], int(x2))
            y2 = min(arr.shape[0], int(y2))
            arr[y1:y2, x1:x2] = [255.0, 255.0, 255.0]

    # 2. White-point whitening and contrast stretch
    # Stretch [black_point, bg_threshold] to [0, 255]
    for c in range(3):
        ch = arr[:, :, c]
        stretched = (ch - black_point) / (bg_threshold - black_point) * 255.0
        arr[:, :, c] = np.clip(stretched, 0.0, 255.0)

    return Image.fromarray(arr.astype(np.uint8))

def crop_diagram(page_path, box, out_path, pad=0, clean_bg=True, bg_threshold=220, black_point=40, clean_masks=None):
    im = Image.open(page_path)
    w, h = im.size
    l, t, r, b = box

    l = max(0, int(l) - pad)
    t = max(0, int(t) - pad)
    r = min(w, int(r) + pad)
    b = min(h, int(b) + pad)

    cropped = im.crop((l, t, r, b))

    if clean_bg:
        cropped = clean_diagram_image(
            cropped,
            bg_threshold=bg_threshold,
            black_point=black_point,
            clean_masks=clean_masks
        )

    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    cropped.save(out_path)
    return cropped.size

def main():
    parser = argparse.ArgumentParser(description="Crop diagrams with background whitening and scribble removal")
    parser.add_argument("--spec", help="JSON file containing list of crop specifications")
    parser.add_argument("--pages-dir", default=".tmp/gmdi_rendered", help="Directory of rendered pages")
    parser.add_argument("--dest-dir", required=True, help="Destination directory (e.g. archive/assets/images/<slug>)")
    parser.add_argument("--no-clean-bg", action="store_true", help="Disable automatic pure white background cleaning")
    parser.add_argument("--bg-threshold", type=int, default=220, help="Brightness threshold above which background is pure #FFFFFF (default: 220)")
    parser.add_argument("--black-point", type=int, default=40, help="Black point for contrast stretching (default: 40)")
    args = parser.parse_args()

    if not args.spec:
        print("Error: --spec JSON file must be provided.", file=sys.stderr)
        sys.exit(1)

    with open(args.spec, "r", encoding="utf-8") as f:
        crops = json.load(f)

    dest_dir = Path(args.dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)

    print(f"Executing {len(crops)} crop operations to {dest_dir} (pure white #FFFFFF background cleaning: {not args.no_clean_bg})...")
    for item in crops:
        page_num = item["page"]
        qid = item["qid"]
        box = item["box"]  # [l, t, r, b]
        clean_masks = item.get("clean_masks", [])
        page_file = Path(args.pages_dir) / f"page_{page_num:02d}.png"
        out_file = dest_dir / f"q{qid:02d}.png"

        if not page_file.exists():
            print(f"Error: Page image does not exist: {page_file}", file=sys.stderr)
            continue

        size = crop_diagram(
            str(page_file),
            box,
            str(out_file),
            clean_bg=not args.no_clean_bg,
            bg_threshold=args.bg_threshold,
            black_point=args.black_point,
            clean_masks=clean_masks
        )
        print(f"  [Q{qid:02d}] {size[0]}x{size[1]}px from Page {page_num:02d} -> {out_file.name} (Cleaned to #FFFFFF)")

    print("All crops completed and cleaned successfully.")

if __name__ == "__main__":
    main()
