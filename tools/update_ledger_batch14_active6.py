import json
import datetime

ledger_path = 'archive/intake_tracking_ledger.json'

with open(ledger_path, 'r', encoding='utf-8') as f:
    ledger = json.load(f)

completed = ledger.get('completed_exams', {})

# Remove the 4 mistaken ones from earlier
mistaken_keys = [
    r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2022_순천고2_확통_2기말.pdf",
    r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2022_효천고2_확통_2기말.pdf",
    r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2022_복성고2_확통_2기말.pdf",
    r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2021_효천고2_확통_2기말.pdf"
]

for k in mistaken_keys:
    if k in completed:
        del completed[k]
        print(f"Removed mistaken key: {k}")

now_iso = datetime.datetime.now().isoformat()

# 19_매산고 (already in archive on main)
completed[r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2019_매산고2_확통_2기말.pdf"] = {
    "status": "ALREADY_EXISTING_ARCHIVE",
    "canonicalSlug": "2019_매산고_2학기_기말_고2_확률과통계",
    "jsPath": "archive/exams/original/high/h2/2final/2019_매산고_2학기_기말_고2_확률과통계.js",
    "marked_at": now_iso
}

# The 6 active exams of Batch 14
active_exams = [
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2019_복성고2_확통_2기말.pdf",
        "slug": "19_복성고_2학기_기말_고2_확률과통계",
        "q_count": 20,
        "score": 100,
        "diagrams": 1
    },
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2019_순천고2_확통_2기말.pdf",
        "slug": "19_순천고_2학기_기말_고2_확률과통계",
        "q_count": 21,
        "score": 100,
        "diagrams": 1
    },
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2019_매여고2_확통_2기말.pdf",
        "slug": "19_매산여고_2학기_기말_고2_확률과통계",
        "q_count": 22,
        "score": 100,
        "diagrams": 0
    },
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2020_매산고2_확통_2기말.pdf",
        "slug": "20_매산고_2학기_기말_고2_확률과통계",
        "q_count": 19,
        "score": 100,
        "diagrams": 2
    },
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2020_매여고2_확통_2기말.pdf",
        "slug": "20_매산여고_2학기_기말_고2_확률과통계",
        "q_count": 23,
        "score": 100,
        "diagrams": 0
    },
    {
        "pdf": r"C:\Users\USER\Desktop\기출정리 파일\(4)2기말\확률과 통계\2021_순여고2_확통_2기말.pdf",
        "slug": "21_순천여고_2학기_기말_고2_확률과통계",
        "q_count": 23,
        "score": 100,
        "diagrams": 1
    }
]

for ex in active_exams:
    completed[ex["pdf"]] = {
        "batchTag": "h2-2final-20261018-b14",
        "canonicalSlug": ex["slug"],
        "questionsCount": ex["q_count"],
        "scoreTotal": ex["score"],
        "diagramsCount": ex["diagrams"],
        "marked_at": now_iso
    }
    print(f"Updated {ex['slug']}")

ledger['completed_exams'] = completed

with open(ledger_path, 'w', encoding='utf-8') as f:
    json.dump(ledger, f, ensure_ascii=False, indent=2)

print("Ledger update complete.")
