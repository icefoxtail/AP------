import sys, os, cv2, numpy as np

def audit_image(path):
    if not os.path.exists(path):
        return False, "FILE_NOT_FOUND"
    
    img = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return False, "CANNOT_DECODE_IMAGE"
    
    h, w, _ = img.shape
    if h < 40 or w < 40:
        return False, f"IMAGE_TOO_SMALL ({w}x{h} < 40x40)"
    
    # 1. Outer Margin Gate:
    # "에셋은 조금 여백이 있어야하는데 너무 많이 자르는 경우가 오히려 문제"
    # The outer 3px border must be clean white (#FFFFFF) so labels (A, B, C, numbers, arrows) are not cut off by tight cropping,
    # and no dark lines from adjacent problems/boxes are captured.
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    top = gray[0:3, :]
    bot = gray[-3:, :]
    left = gray[:, 0:3]
    right = gray[:, -3:]
    
    for edge, name in [(top, 'top'), (bot, 'bottom'), (left, 'left'), (right, 'right')]:
        non_white = np.sum(edge < 220)
        total_pixels = edge.size
        # Max 2% tolerance for slight anti-aliasing noise, but no dark lines or clipped content
        if non_white > max(1, int(total_pixels * 0.02)):
            return False, f"NO_WHITE_MARGIN_ON_{name.upper()} (clipped content or dark border touching edge: {non_white}/{total_pixels}px dark)"
            
    # 2. Content check: Must not be a blank white box
    dark_content_pixels = np.sum(gray < 220)
    if dark_content_pixels < 20:
        return False, "EMPTY_IMAGE (no diagram content detected)"
        
    return True, f"OK ({w}x{h}, margin verified)"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python audit_asset.py <image_path>")
        sys.exit(1)
    
    path = sys.argv[1]
    ok, msg = audit_image(path)
    if ok:
        print(f"[ASSET_PASS] {msg}")
        sys.exit(0)
    else:
        print(f"[ASSET_FAIL] {msg}")
        sys.exit(1)
