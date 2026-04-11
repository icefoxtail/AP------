import os
import json
import re

# [확정] 원장님의 R2 버킷 공용 주소
R2_PUBLIC_URL = "https://pub-4e78e71560154e7a86ec04d0bd37c191.r2.dev"
PDF_DIR = "pdf_archive"
OUTPUT_FILE = "data/catalog.json"

def extract_metadata():
    if not os.path.exists(PDF_DIR):
        print(f"오류: {PDF_DIR} 폴더를 찾을 수 없습니다.")
        return

    catalog = {"files": []}
    
    # 파일명 규칙: 2024_연향중_중2_수학_1학기중간.pdf (5개 그룹)
    pattern = re.compile(r"(\d{4})_(.+?)_(.+?)_(.+?)_(.+?)\.pdf")

    for filename in sorted(os.listdir(PDF_DIR)):
        if filename.endswith(".pdf"):
            match = pattern.match(filename)
            if match:
                year, school, grade, subject, exam = match.groups()
                catalog["files"].append({
                    "year": year,
                    "school": school,
                    "grade": grade,
                    "subject": subject,
                    "exam": exam,
                    "fileName": filename,
                    "url": f"{R2_PUBLIC_URL}/{filename}"
                })
            else:
                print(f"[경고] 파일명 규칙 불일치, 건너뜀: {filename}")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    
    print(f"완료: {len(catalog['files'])}개의 파일이 등록되었습니다.")

if __name__ == "__main__":
    extract_metadata()