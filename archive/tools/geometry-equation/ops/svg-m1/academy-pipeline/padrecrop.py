# usage: python padrecrop.py <base commit> [--write]
# 재크롭으로 폭이 좁아져 화면 표시 높이가 크게 늘어난 문제 그림을 흰 여백으로 넓힌다(한 쪽 초과 방지).
# 엔진은 문제 그림을 원래 픽셀 크기로, 단 폭 COL(약 298px)까지만 보여 준다.
import subprocess, io, sys
from PIL import Image

COL = 298.0
FLOOR = 240.0  # 이 높이 이하로는 줄이지 않는다(글자 가독성)
base = sys.argv[1]
write = "--write" in sys.argv


def disp(w, h):
    return h * COL / max(w, COL)


out = subprocess.run(["git", "-c", "core.quotepath=off", "diff", "--name-only", "--diff-filter=M", base, "HEAD", "--", "archive/assets/images"],
                     capture_output=True).stdout.decode("utf-8").splitlines()
n = 0
for p in out:
    if not p.lower().endswith(".png"):
        continue
    old = Image.open(io.BytesIO(subprocess.run(["git", "show", base + ":" + p], capture_output=True).stdout))
    new = Image.open(p)
    ow, oh = old.size
    nw, nh = new.size
    limit = max(disp(ow, oh), FLOOR)
    if disp(nw, nh) > limit * 1.05:
        target = int(round(nh * COL / limit))
        n += 1
        print(("PAD " if write else "would pad ") + p, (nw, nh), "disp %.0f" % disp(nw, nh), "old", (ow, oh), "disp %.0f" % disp(ow, oh), "->", target)
        if write:
            im = new.convert("RGB")
            c = Image.new("RGB", (target, nh), "white")
            c.paste(im, ((target - nw) // 2, 0))
            c.save(p)
print("count", n, "of", len(out))
