from __future__ import annotations

import re
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "archive"
EXAM_ROOT = ARCHIVE / "exams" / "original"
OUT = ROOT / "tmp" / "2mid-image-contact-sheets"
COLS = 5
ROWS = 8
CELL_W = 260
CELL_H = 175
LABEL_H = 35


def font(size: int) -> ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def target_exam_files() -> list[Path]:
    return sorted(
        path
        for path in EXAM_ROOT.rglob("*.js")
        if path.parent.name == "2mid"
    )


def image_rows() -> list[tuple[str, Path]]:
    script = r"""
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=process.argv[1]; const out=[];
function walk(d){let a=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())a=a.concat(walk(p));else if(e.isFile()&&e.name.endsWith('.js')&&path.basename(path.dirname(p))==='2mid')a.push(p)}return a}
for(const file of walk(path.join(root,'archive','exams','original')).sort()){
  const s={window:{}};vm.createContext(s);vm.runInContext(fs.readFileSync(file,'utf8'),s,{filename:file});
  for(const q of s.window.questionBank||[]) if(q.image) out.push({title:s.window.examTitle,qid:q.id,image:q.image});
}
process.stdout.write(JSON.stringify(out));
"""
    result = subprocess.run(
        ["node", "-e", script, str(ROOT)],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    rows: list[tuple[str, Path]] = []
    for row in json.loads(result.stdout):
        rel = row["image"].replace("/", "\\")
        asset = ARCHIVE / rel
        rows.append((f'{row["title"]} · q{int(row["qid"]):02d} · {asset.name}', asset))
    return rows


def build() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = image_rows()
    page_size = COLS * ROWS
    label_font = font(13)
    for page_index in range(0, len(rows), page_size):
        sheet = Image.new("RGB", (COLS * CELL_W, ROWS * CELL_H), "white")
        draw = ImageDraw.Draw(sheet)
        for offset, (label, asset) in enumerate(rows[page_index : page_index + page_size]):
            col = offset % COLS
            row = offset // COLS
            x = col * CELL_W
            y = row * CELL_H
            draw.rectangle((x, y, x + CELL_W - 1, y + CELL_H - 1), outline="#999999")
            try:
                with Image.open(asset) as source:
                    image = source.convert("RGB")
                    image.thumbnail((CELL_W - 12, CELL_H - LABEL_H - 12), Image.Resampling.LANCZOS)
                    px = x + (CELL_W - image.width) // 2
                    py = y + 5 + (CELL_H - LABEL_H - 10 - image.height) // 2
                    sheet.paste(image, (px, py))
            except Exception as exc:
                draw.text((x + 8, y + 40), f"LOAD ERROR\n{exc}", fill="red", font=label_font)
            short = label if len(label) <= 34 else f"{label[:31]}..."
            draw.text((x + 5, y + CELL_H - LABEL_H + 3), short, fill="black", font=label_font)
        number = page_index // page_size + 1
        sheet.save(OUT / f"contact-{number:02d}.jpg", quality=90, subsampling=0)
    print(f"images={len(rows)} sheets={(len(rows) + page_size - 1) // page_size} out={OUT}")


if __name__ == "__main__":
    build()
