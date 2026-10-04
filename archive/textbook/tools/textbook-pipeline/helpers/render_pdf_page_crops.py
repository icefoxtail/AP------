import argparse
import json
from pathlib import Path

import fitz


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--prefix", default="page")
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    zoom = args.dpi / 72
    matrix = fitz.Matrix(zoom, zoom)
    items = []
    for index, page in enumerate(doc):
        page_no = index + 1
        out_file = out_dir / f"{args.prefix}_p{page_no:03d}.png"
        if not out_file.exists():
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            pix.save(out_file)
        items.append({
            "pageNo": page_no,
            "pageIndex": index,
            "imagePath": str(out_file),
            "fileName": out_file.name,
            "width": int(page.rect.width),
            "height": int(page.rect.height),
        })

    print(json.dumps({
        "status": "ok",
        "pdf": str(pdf_path),
        "outDir": str(out_dir),
        "dpi": args.dpi,
        "pageCount": len(items),
        "items": items,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
