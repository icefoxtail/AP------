import argparse, os, fitz

parser = argparse.ArgumentParser(description="Render PDF pages to PNG using PyMuPDF")
parser.add_argument("--pdf", required=True, help="Input PDF path")
parser.add_argument("--out", required=True, help="Output directory")
parser.add_argument("--dpi", type=int, default=200, help="DPI resolution (default 200)")

args = parser.parse_args()
os.makedirs(args.out, exist_ok=True)

doc = fitz.open(args.pdf)
print(f"Rendering {args.pdf} ({len(doc)} pages) at {args.dpi} DPI...")

for page_idx in range(len(doc)):
    page = doc[page_idx]
    pix = page.get_pixmap(dpi=args.dpi)
    out_file = os.path.join(args.out, f"page_{page_idx+1:02d}.png")
    pix.save(out_file)
    print(f" - Saved {out_file} ({pix.width}x{pix.height})")

print("Rendering complete!")
