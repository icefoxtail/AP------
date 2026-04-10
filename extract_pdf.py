import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_OUT_DIR = os.path.join(BASE_DIR, "data")

def extract_pdf_data():
    if not os.path.exists(DATA_OUT_DIR):
        os.makedirs(DATA_OUT_DIR)

    catalog = {"years": set(), "exams": set(), "files": []}

    for root, dirs, files in os.walk(BASE_DIR):
        if "data" in root or ".git" in root:
            continue
            
        for filename in files:
            if not filename.endswith(".pdf"):
                continue

            name_part = os.path.splitext(filename)[0]
            parts = name_part.split("_")

            if len(parts) < 2:
                print(f"[Skip] 규칙 위반 파일 무시됨: {filename}")
                continue

            year = parts[0]
            school = parts[1]
            
            file_type = "문제"
            if "정답" in name_part: file_type = "정답"
            elif "해설" in name_part: file_type = "해설"

            exam_season = "기타"
            for p in parts:
                if "중간" in p or "기말" in p:
                    exam_season = p
                    break
            
            subject = parts[2] if len(parts) > 2 else "수학"
            
            catalog["files"].append({
                "year": year, "school": school, "subject": subject,
                "exam": exam_season, "type": file_type, "fileName": filename
            })

            catalog["years"].add(year)
            catalog["exams"].add(exam_season)

    catalog["years"] = sorted(list(catalog["years"]), reverse=True)
    catalog["exams"] = sorted(list(catalog["exams"]))
    
    with open(os.path.join(DATA_OUT_DIR, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    extract_pdf_data()