import argparse, cv2, numpy as np, os

parser = argparse.ArgumentParser(description="Normalize diagram asset background to pure white #FFFFFF with proper margin/padding")
parser.add_argument("--src", required=True, help="Input crop PNG")
parser.add_argument("--dst", required=True, help="Output normalized PNG")
parser.add_argument("--thresh", type=int, default=215, help="Background white threshold (default 215)")
parser.add_argument("--padding", type=int, default=16, help="Pure white margin padding in pixels (default 16)")

args = parser.parse_args()

img = cv2.imdecode(np.fromfile(args.src, dtype=np.uint8), cv2.IMREAD_COLOR)
if img is None:
    print(f"Error loading {args.src}")
    exit(1)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Pixels brighter than thresh become 255 (pure white)
mask_bg = gray > args.thresh
result = img.copy()
result[mask_bg] = [255, 255, 255]

# Remove single-pixel border noise if accidentally captured from adjacent box/lines
h, w, _ = result.shape
for i in range(min(2, max(1, h // 10))):
    if np.mean(result[i, :]) > 180:
        result[i, :] = [255, 255, 255]
    if np.mean(result[h - 1 - i, :]) > 180:
        result[h - 1 - i, :] = [255, 255, 255]
for j in range(min(2, max(1, w // 10))):
    if np.mean(result[:, j]) > 180:
        result[:, j] = [255, 255, 255]
    if np.mean(result[:, w - 1 - j]) > 180:
        result[:, w - 1 - j] = [255, 255, 255]

# Add generous, clean white padding to ensure proper margins (avoiding over-cropped, cramped visuals)
if args.padding > 0:
    result = cv2.copyMakeBorder(
        result,
        args.padding, args.padding, args.padding, args.padding,
        cv2.BORDER_CONSTANT,
        value=[255, 255, 255]
    )

# Save output
os.makedirs(os.path.dirname(os.path.abspath(args.dst)), exist_ok=True)
ext = os.path.splitext(args.dst)[1]
is_success, buf = cv2.imencode(ext, result)
if is_success:
    buf.tofile(args.dst)
    print(f"Normalized asset with {args.padding}px margin saved to {args.dst}")
else:
    print(f"Error encoding {args.dst}")
    exit(1)
