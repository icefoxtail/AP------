import os
import shutil

EXAMS = [
    "19_복성고_2학기_기말_고2_확률과통계",
    "19_순천고_2학기_기말_고2_확률과통계",
    "19_매산여고_2학기_기말_고2_확률과통계",
    "20_매산고_2학기_기말_고2_확률과통계",
    "20_매산여고_2학기_기말_고2_확률과통계",
    "21_순천여고_2학기_기말_고2_확률과통계",
]

SRC_JS_BASE = os.path.abspath("archive/staging/batch_14_7exams/exams/high/h2/2final")
SRC_ASSET_BASE = os.path.abspath("archive/staging/batch_14_7exams/assets/images")
GDRIVE_BASE = r"G:\내 드라이브\고등수학_스캔인테이크_작업물"

def sync_to_gdrive():
    if not os.path.exists(GDRIVE_BASE):
        print(f"ERROR: Google Drive path does not exist: {GDRIVE_BASE}")
        return False

    for slug in EXAMS:
        exam_dst_dir = os.path.join(GDRIVE_BASE, slug)
        os.makedirs(exam_dst_dir, exist_ok=True)

        # Copy JS file
        src_js = os.path.join(SRC_JS_BASE, f"{slug}.js")
        if os.path.exists(src_js):
            dst_js = os.path.join(exam_dst_dir, f"{slug}.js")
            shutil.copy2(src_js, dst_js)
            print(f"Copied JS -> {dst_js}")
        else:
            print(f"WARNING: src JS does not exist: {src_js}")

        # Copy Assets if present
        src_asset_dir = os.path.join(SRC_ASSET_BASE, slug)
        if os.path.exists(src_asset_dir):
            dst_assets1 = os.path.join(exam_dst_dir, "assets")
            os.makedirs(dst_assets1, exist_ok=True)
            dst_assets2 = os.path.join(exam_dst_dir, "assets", "images", slug)
            os.makedirs(dst_assets2, exist_ok=True)

            for f in os.listdir(src_asset_dir):
                if f.lower().endswith(".png"):
                    shutil.copy2(os.path.join(src_asset_dir, f), os.path.join(dst_assets1, f))
                    shutil.copy2(os.path.join(src_asset_dir, f), os.path.join(dst_assets2, f))
                    print(f"  Copied asset: {f}")

    print("\nGoogle Drive sync successfully completed!")
    return True

if __name__ == "__main__":
    sync_to_gdrive()
