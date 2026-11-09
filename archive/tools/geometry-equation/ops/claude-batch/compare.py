# usage: python compare.py <구형 svg 또는 png> <신형 svg 또는 png> <out.png>
# 구형(왼쪽)과 신형(오른쪽)을 나란히 붙인 비교 PNG를 만든다. 상단에 "구형" / "신형" 표시.
# svg는 .tmp/svg-m1/svg2png.cjs(폭 600)로 PNG화한다. 저장소 루트는 이 파일 위치(<repo>/.tmp/work/)로 자동 탐지한다(build-pub.py와 같은 방식).
import sys, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W = Path(__file__).resolve().parent
ROOT = W.parent.parent
SVG2PNG = W.parent / 'svg-m1' / 'svg2png.cjs'
FONT = 'C:/Windows/Fonts/malgun.ttf'
PANEL_W = 600
HEAD_H = 44
GAP = 16


def to_png(src: Path, tmpdir: Path, name: str) -> Image.Image:
    if src.suffix.lower() == '.svg':
        if not SVG2PNG.exists():
            sys.exit(f"ERROR: {SVG2PNG} 이 없다. 복원(HANDOFF_SVG_ENGINE.md §3): cd {ROOT} && mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/")
        png = tmpdir / f'{name}.png'
        r = subprocess.run(['node', str(SVG2PNG), str(src), str(png), str(PANEL_W)], cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0 or not png.exists():
            sys.exit(f"ERROR: svg2png 실패: {src}\n{r.stdout}\n{r.stderr}")
        src = png
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    if im.width != PANEL_W:
        im = im.resize((PANEL_W, max(1, round(im.height * PANEL_W / im.width))), Image.LANCZOS)
    return im


def main():
    if len(sys.argv) != 4:
        sys.exit('usage: python compare.py <구형 svg|png> <신형 svg|png> <out.png>')
    old, new, out = (Path(a).resolve() for a in sys.argv[1:4])
    for p in (old, new):
        if not p.exists():
            sys.exit(f'ERROR: 파일이 없다: {p}')
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        a = to_png(old, td, 'old')
        b = to_png(new, td, 'new')
    h = max(a.height, b.height)
    canvas = Image.new('RGB', (PANEL_W * 2 + GAP, HEAD_H + h), 'white')
    canvas.paste(a, (0, HEAD_H))
    canvas.paste(b, (PANEL_W + GAP, HEAD_H))
    d = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype(FONT, 26)
    except OSError:
        font = ImageFont.load_default()
    d.text((12, 6), '구형', fill=(200, 30, 30), font=font)
    d.text((PANEL_W + GAP + 12, 6), '신형', fill=(20, 90, 200), font=font)
    d.line([(PANEL_W + GAP // 2, 0), (PANEL_W + GAP // 2, canvas.height)], fill=(150, 150, 150), width=2)
    d.line([(0, HEAD_H - 1), (canvas.width, HEAD_H - 1)], fill=(150, 150, 150), width=1)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)
    print(f'compare -> {out} ({canvas.width}x{canvas.height})')


if __name__ == '__main__':
    main()
