import json
import math
import pathlib
import subprocess
import sys
from PIL import Image, ImageDraw, ImageFont

evidence = pathlib.Path(__file__).resolve().parent
phase = sys.argv[1] if len(sys.argv) > 1 else "baseline"
pdf_dir = evidence / "a4" / phase
out_dir = pdf_dir / "rendered"
pages_dir = out_dir / "pages"
out_dir.mkdir(parents=True, exist_ok=True)
pages_dir.mkdir(parents=True, exist_ok=True)
pdftoppm = pathlib.Path("C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe")

files = sorted(pdf_dir.glob("*.pdf"))
for pdf in files:
    prefix = pages_dir / pdf.stem
    subprocess.run([str(pdftoppm), "-png", "-r", "90", str(pdf), str(prefix)], check=True, timeout=60, capture_output=True)

groups = {"text": [], "math": [], "geometry": [], "mixed-compose": []}
for image_path in sorted(pages_dir.glob("*.png")):
    stem = image_path.stem
    fixture = "mixed-compose" if stem.startswith("mixed-compose-") else stem.split("-")[0]
    if fixture not in groups:
        continue
    parts = stem.rsplit("-", 1)
    page_no = int(parts[-1])
    qpp = stem.split("qpp")[-1].split("-")[0]
    groups[fixture].append((int(qpp), page_no, image_path))

for fixture, entries in groups.items():
    entries.sort(key=lambda item: (item[0], item[1]))
    tile_w, image_h, label_h, gap = 220, 311, 22, 12
    cols = 4
    rows = math.ceil(len(entries) / cols)
    canvas = Image.new("RGB", (cols * tile_w + (cols + 1) * gap, rows * (image_h + label_h) + (rows + 1) * gap), "white")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    for index, (qpp, page_no, image_path) in enumerate(entries):
        row, col = divmod(index, cols)
        x, y = gap + col * (tile_w + gap), gap + row * (image_h + label_h + gap)
        draw.text((x, y), f"qpp {qpp} · page {page_no}", fill="#111827", font=font)
        im = Image.open(image_path).convert("RGB")
        ratio = tile_w / im.width
        im = im.resize((tile_w, int(im.height * ratio)), Image.Resampling.LANCZOS)
        canvas.paste(im, (x, y + label_h))
    canvas.save(out_dir / f"{fixture}-all-qpp-contact.png", optimize=True)

print(json.dumps({
  "phase": phase,
  "pdfs": [{"name": p.name, "bytes": p.stat().st_size} for p in files],
  "pageImages": len(list(pages_dir.glob("*.png"))),
  "contactSheets": [str((out_dir / f"{name}-all-qpp-contact.png")) for name in groups]
}, ensure_ascii=False, indent=2))
