import argparse, cv2, numpy as np, os

parser = argparse.ArgumentParser(description="Normalize diagram asset background to pure white #FFFFFF and remove pencil marks")
parser.add_argument("--src", required=True, help="Input crop PNG")
parser.add_argument("--dst", required=True, help="Output normalized PNG")
parser.add_argument("--thresh", type=int, default=215, help="Background white threshold (default 215)")

args = parser.parse_args()

img = cv2.imdecode(np.fromfile(args.src, dtype=np.uint8), cv2.IMREAD_COLOR)
if img is None:
    print(f"Error loading {args.src}")
    exit(1)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Pixels brighter than thresh become 255 (pure white)
mask_bg = gray > args.thresh

# Enhance contrast for lines/text
result = img.copy()
result[mask_bg] = [255, 255, 255]

# Save output using imencode to handle non-ascii paths
os.makedirs(os.path.dirname(os.path.abspath(args.dst)), exist_ok=True)
ext = os.path.splitext(args.dst)[1]
is_success, buf = cv2.imencode(ext, result)
if is_success:
    buf.tofile(args.dst)
    print(f"Normalized asset saved to {args.dst}")
else:
    print(f"Error encoding {args.dst}")
    exit(1)
