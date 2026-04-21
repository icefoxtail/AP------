import os
from pdf2image import convert_from_path

# ── 경로 설정 ──────────────────────────────────────────────
POPPLER_PATH = r'C:\poppler\Library\bin'
INPUT_DIR = r'C:\Users\USER\Desktop\APMATH\AP\ready_for_r2'
OUTPUT_DIR = r'C:\Users\USER\Desktop\APMATH\AP\data\images'

os.makedirs(OUTPUT_DIR, exist_ok=True)


def run_selective_conversion():
    all_files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.pdf')]

    # 1중간 문제지만 선별 (해설지/정답 제외)
    target_files = [
        f for f in all_files
        if "문제" in f and "해설" not in f and "정답" not in f
    ]

    total = len(target_files)
    if total == 0:
        print("보고: 조건에 맞는 파일을 찾을 수 없습니다.")
        return

    print(f"총 {len(all_files)}개 중 1학기 중간 문제지 {total}개 선별 변환합니다.\n")

    for idx, filename in enumerate(target_files, 1):
        school_name = os.path.splitext(filename)[0]  # 예: 2025_금당중_1학기_중간_중3_기출
        pdf_path = os.path.join(INPUT_DIR, filename)

        # 이미 변환된 파일 있으면 건너뜀
        first_page = os.path.join(OUTPUT_DIR, f"{school_name}_문제지_p1.png")
        if os.path.exists(first_page):
            print(f"[{idx}/{total}] 건너뜀 (이미 존재): {school_name}")
            continue

        try:
            pages = convert_from_path(
                pdf_path,
                dpi=200,  # 400→200 낮춰서 파일 크기 절약
                poppler_path=POPPLER_PATH,
                fmt='png'
            )

            for i, page in enumerate(pages):
                # ★ 파일명에 '문제지' 추가 → generator 필터 통과
                save_path = os.path.join(OUTPUT_DIR, f"{school_name}_문제지_p{i+1}.png")
                page.save(save_path, 'PNG')

            print(f"[{idx}/{total}] 완료: {school_name} ({len(pages)}페이지)")

        except Exception as e:
            print(f"[{idx}/{total}] 실패: {school_name} — {e}")


if __name__ == "__main__":
    run_selective_conversion()