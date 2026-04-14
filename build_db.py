import os
import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ── 설정 ──────────────────────────────────────────
# 본인의 폴더 경로와 일치하는지 확인하세요.
EXAMS_DIR   = r"C:\Users\USER\Desktop\APMATH\AP\exams"
OUTPUT_FILE = r"C:\Users\USER\Desktop\APMATH\AP\db.js"
# ──────────────────────────────────────────────────

def parse_js_filename(filename):
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 4:
        return None

    year_prefix = parts[0]
    year = f"20{year_prefix}" if len(year_prefix) == 2 else year_prefix

    school_raw = parts[1]
    grade = ""
    school = school_raw
    
    m = re.search(r'(중|고)\d', school_raw)
    if m:
        grade = m.group()
        school = school_raw.replace(grade, '')

    semester = parts[2].replace('학기', '')
    exam_raw = parts[3]
    examType = 'mid' if '중간' in exam_raw else 'final' if '기말' in exam_raw else exam_raw

    subject = parts[4] if len(parts) > 4 else "수학"
    
    if not grade:
        m2 = re.search(r'(중|고)\d', subject)
        if m2:
            grade = m2.group()

    return {
        "year": year,
        "school": school,
        "grade": grade,
        "semester": semester,
        "examType": examType,
        "subject": subject,
        "file": filename
    }

def build_engine_db():
    if not os.path.exists(EXAMS_DIR):
        print(f"❌ 폴더 없음: {EXAMS_DIR}")
        return

    exams_list = []
    skipped = []

    for f in os.listdir(EXAMS_DIR):
        if f.endswith('.js'):
            meta = parse_js_filename(f)
            if meta:
                exams_list.append(meta)
            else:
                skipped.append(f)

    db_content = {
        "exams": exams_list
    }

    # db.js 파일 생성 (에러 발생 구간 수정됨)
    dir_path = os.path.dirname(OUTPUT_FILE)
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path)
        
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("window.mainDB = ")
        json.dump(db_content, f, ensure_ascii=False, indent=2)
        f.write(";")

    print(f"\n✅ 완료: 총 {len(exams_list)}개의 엔진 데이터가 db.js에 등록되었습니다.")
    if skipped:
        print(f"⚠️ 규칙에 맞지 않아 건너뛴 파일: {len(skipped)}개")
        for s in skipped:
            print(f"  - {s}")

if __name__ == "__main__":
    build_engine_db()