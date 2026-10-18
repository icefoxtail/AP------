import os
from PIL import Image
import numpy as np

crop_specs = [
    # 1. Exam 1 순천고
    {
        'slug': '22_순천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q4.png',
        'file': '.tmp/batch_14/exam1_22_순천고_확통/page_01.png',
        'box': [2325, 570, 2770, 775],
        'masks': []
    },
    {
        'slug': '22_순천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q8.png',
        'file': '.tmp/batch_14/exam1_22_순천고_확통/page_02.png',
        'box': [2325, 313, 2795, 570],
        'masks': [[0, 220, 50, 257]]
    },
    # 2. Exam 2 효천고
    {
        'slug': '22_효천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q11.png',
        'file': '.tmp/batch_14/exam2_22_효천고_확통/page_02.png',
        'box': [420, 3130, 950, 3600],
        'masks': []
    },
    {
        'slug': '22_효천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q20.png',
        'file': '.tmp/batch_14/exam2_22_효천고_확통/page_03.png',
        'box': [1700, 2150, 2650, 2500],
        'masks': []
    },
    {
        'slug': '22_효천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q24.png',
        'file': '.tmp/batch_14/exam2_22_효천고_확통/page_04.png',
        'box': [1670, 2180, 2750, 2690],
        'masks': []
    },
    # 3. Exam 3 복성고
    {
        'slug': '22_복성고_2학기_기말_고2_확률과통계',
        'qid_name': 'q13.png',
        'file': '.tmp/batch_14/exam3_22_복성고_확통/page_02.png',
        'box': [1500, 2130, 1950, 2520],
        'masks': []
    },
    {
        'slug': '22_복성고_2학기_기말_고2_확률과통계',
        'qid_name': 'q16.png',
        'file': '.tmp/batch_14/exam3_22_복성고_확통/page_03.png',
        'box': [180, 480, 750, 850],
        'masks': []
    },
    # 4. Exam 4 21_효천고
    {
        'slug': '21_효천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q3.png',
        'file': '.tmp/batch_14/exam4_21_효천고_확통/page_01.png',
        'box': [610, 2060, 1200, 2520],
        'masks': []
    },
    {
        'slug': '21_효천고_2학기_기말_고2_확률과통계',
        'qid_name': 'q23.png',
        'file': '.tmp/batch_14/exam4_21_효천고_확통/page_04.png',
        'box': [830, 115, 1190, 470],
        'masks': [[0, 0, 30, 80]]
    },
    # 5. Exam 5 매산고
    {
        'slug': '20_매산고_2학기_기말_고2_확률과통계',
        'qid_name': 'q5.png',
        'file': '.tmp/batch_14/exam5_20_매산고_확통/page_02.png',
        'box': [310, 460, 1020, 810],
        'masks': []
    },
    {
        'slug': '20_매산고_2학기_기말_고2_확률과통계',
        'qid_name': 'q11.png',
        'file': '.tmp/batch_14/exam5_20_매산고_확통/page_03.png',
        'box': [1450, 680, 1980, 1120],
        'masks': []
    },
]

for spec in crop_specs:
    im = Image.open(spec['file'])
    c = im.crop(spec['box'])
    arr = np.array(c.convert('RGB'), dtype=np.float32)
    for m in spec['masks']:
        x1, y1, x2, y2 = m
        arr[y1:y2, x1:x2] = [255.0, 255.0, 255.0]
    black_point = 40
    bg_threshold = 215
    for ch in range(3):
        channel = arr[:, :, ch]
        stretched = (channel - black_point) / (bg_threshold - black_point) * 255.0
        arr[:, :, ch] = np.clip(stretched, 0.0, 255.0)
    cleaned = Image.fromarray(arr.astype(np.uint8))
    w, h = cleaned.size
    padded = Image.new('RGB', (w + 40, h + 40), (255, 255, 255))
    padded.paste(cleaned, (20, 20))

    # Dual Mirroring save:
    # 1. Staging
    staging_dir = os.path.join('archive', 'staging', 'batch_14_5exams', 'assets', 'images', spec['slug'])
    os.makedirs(staging_dir, exist_ok=True)
    staging_path = os.path.join(staging_dir, spec['qid_name'])
    padded.save(staging_path)

    # 2. Canonical
    canonical_dir = os.path.join('archive', 'assets', 'images', spec['slug'])
    os.makedirs(canonical_dir, exist_ok=True)
    canonical_path = os.path.join(canonical_dir, spec['qid_name'])
    padded.save(canonical_path)

    # Verify 4 corners are pure white
    corners = [
        padded.getpixel((0, 0)),
        padded.getpixel((w + 39, 0)),
        padded.getpixel((0, h + 39)),
        padded.getpixel((w + 39, h + 39))
    ]
    assert all(c == (255, 255, 255) for c in corners), f"Corners not pure white for {spec['slug']}/{spec['qid_name']}"

    print(f"[{spec['slug']}] {spec['qid_name']}: {w+40}x{h+40} dual-mirrored to staging & canonical.")

print("\nAll 11 diagram assets successfully cropped, pure-white cleaned, and dual-mirrored!")
