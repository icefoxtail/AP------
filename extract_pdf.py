import os
import json
import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ── 설정 ──────────────────────────────────────────
R2_PUBLIC_URL = "https://pub-a1a47eadaf4f4f2bbc9d65c13ee8abba.r2.dev"
PDF_DIR       = r"C:\Users\USER\Desktop\APMATH\AP\pdf_archive"
OUTPUT_FILE   = r"C:\Users\USER\Desktop\APMATH\AP\data\catalog.json"
# ──────────────────────────────────────────────────

EXAM_KEYWORDS = ['중간', '기말']

TYPE_MAP = {
    '문제지': 'q', '문제': 'q',
    '해설지': 'sol', '해설': 'sol', '풀이': 'sol',
    '정답지': 'ans', '정답': 'ans',
}

def classify_type(stem):
    for keyword, kind in TYPE_MAP.items():
        if keyword in stem:
            return kind
    return 'q'

def find_exam_idx(parts):
    for i, p in enumerate(parts):
        for kw in EXAM_KEYWORDS:
            if kw in p:
                return i
    return -1

def extract_grade(text):
    m = re.search(r'(중|고)(\d)', text)
    if m:
        return m.group(1) + m.group(2)
    return None

def parse_filename(filename):
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 3:
        return None

    year = parts[0]
    if not re.match(r'^\d{4}$', year):
        return None

    school = parts[1]
    exam_idx = find_exam_idx(parts)
    if exam_idx == -1:
        return None

    exam = parts[exam_idx]
    grade = extract_grade(school)
    if not grade:
        for p in parts[2:exam_idx]:
            g = extract_grade(p)
            if g:
                grade = g
                break

    subject_parts = parts[2:exam_idx]
    subject = '_'.join(subject_parts) if subject_parts else '수학'
    kind = classify_type(stem)

    return {
        'year': year, 'school': school, 'grade': grade,
        'subject': subject, 'exam': exam, 'kind': kind,
    }

def collect_pdfs(root):
    """하위 폴더 전체 재귀 탐색"""
    result = []
    for dirpath, _, files in os.walk(root):
        for f in files:
            if f.lower().endswith('.pdf'):
                result.append(f)
    return sorted(set(result))

def extract_metadata():
    if not os.path.exists(PDF_DIR):
        print(f"❌ 폴더 없음: {PDF_DIR}")
        return

    all_pdfs = collect_pdfs(PDF_DIR)
    print(f"🔍 PDF 총 {len(all_pdfs)}개 발견")

    entries = {}
    skipped = []

    for filename in all_pdfs:
        meta = parse_filename(filename)
        if not meta:
            skipped.append(filename)
            continue

        key = (meta['year'], meta['school'], meta['exam'])
        url = f"{R2_PUBLIC_URL}/{filename}"

        if key not in entries:
            entries[key] = {
                'year': meta['year'], 'school': meta['school'],
                'grade': meta['grade'], 'subject': meta['subject'],
                'exam': meta['exam'], 'fileName': filename,
            }

        kind = meta['kind']
        if kind == 'q':
            entries[key]['url'] = url
            entries[key]['fileName'] = filename
        elif kind == 'sol':
            entries[key]['solUrl'] = url
        elif kind == 'ans':
            entries[key]['ansUrl'] = url

    catalog = {"files": list(entries.values())}

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    sol = sum(1 for e in catalog['files'] if 'solUrl' in e)
    ans = sum(1 for e in catalog['files'] if 'ansUrl' in e)
    print(f"\n✅ 완료: {len(catalog['files'])}개 등록")
    print(f"   해설 연결: {sol}개 / 정답 연결: {ans}개")
    print(f"   건너뜀: {len(skipped)}개")
    if skipped:
        print("\n[건너뜀 목록]")
        for s in skipped[:20]:
            print(f"  - {s}")
        if len(skipped) > 20:
            print(f"  ... 외 {len(skipped)-20}개")

if __name__ == "__main__":
    extract_metadata()