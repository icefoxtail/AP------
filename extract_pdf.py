import os
import json
import re

# ── 설정 ──────────────────────────────────────────
R2_PUBLIC_URL = "https://pub-4e78e71560154e7a86ec04d0bd37c191.r2.dev"
PDF_DIR       = r"C:\Users\USER\Desktop\APMATH\AP\ready_for_r2"
OUTPUT_FILE   = r"C:\Users\USER\Desktop\APMATH\AP\data\catalog.json"
# ──────────────────────────────────────────────────

# 시험 구분 키워드
EXAM_KEYWORDS = ['중간', '기말']

# 유형 키워드 → 분류
TYPE_MAP = {
    '문제지': 'q',
    '문제':   'q',
    '해설지': 'sol',
    '해설':   'sol',
    '정답지': 'ans',
    '정답':   'ans',
}

def classify_type(part):
    """마지막 파트에서 유형 판별"""
    for keyword, kind in TYPE_MAP.items():
        if keyword in part:
            return kind
    return 'q'  # 기본값: 문제지

def find_exam_idx(parts):
    """중간/기말 키워드가 포함된 파트의 인덱스 반환"""
    for i, p in enumerate(parts):
        for kw in EXAM_KEYWORDS:
            if kw in p:
                return i
    return -1

def extract_grade(school):
    """학교명에서 학년 추출 (예: 연향중3 → 중3, 금당중1 → 중1, 고1 → 고1)"""
    m = re.search(r'(중|고)(\d)', school)
    if m:
        return m.group(1) + m.group(2)
    return None

def parse_filename(filename):
    """
    유연한 파싱:
    - 첫 파트: 연도 (4자리 숫자)
    - 두 번째 파트: 학교 (학년 포함)
    - 중간/기말 포함 파트: 시험구분
    - 마지막 파트: 유형 (문제지/해설지/정답)
    - 그 사이: 과목 또는 학년 (있을 수도 없을 수도)
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 3:
        return None

    # 연도
    year = parts[0]
    if not re.match(r'^\d{4}$', year):
        return None

    # 학교 (두 번째)
    school = parts[1]

    # 마지막 파트 = 유형
    type_part = parts[-1]
    kind = classify_type(type_part)

    # 시험구분 = 중간/기말 포함 파트
    exam_idx = find_exam_idx(parts)
    if exam_idx == -1:
        return None  # 시험구분 불명확
    exam = parts[exam_idx]

    # 학년 추출 (학교명 또는 중간 파트에서)
    grade = extract_grade(school)
    if not grade:
        # 학교 파트에 없으면 중간 파트에서 탐색
        for p in parts[2:exam_idx]:
            g = extract_grade(p)
            if g:
                grade = g
                break

    # 과목: 학교~시험구분 사이 파트 (있으면)
    subject_parts = parts[2:exam_idx]
    subject = '_'.join(subject_parts) if subject_parts else '수학'

    return {
        'year':    year,
        'school':  school,
        'grade':   grade,
        'subject': subject,
        'exam':    exam,
        'kind':    kind,
    }

def extract_metadata():
    if not os.path.exists(PDF_DIR):
        print(f"❌ 폴더 없음: {PDF_DIR}")
        return

    all_pdfs = sorted([
        f for f in os.listdir(PDF_DIR)
        if f.lower().endswith('.pdf')
    ])
    print(f"🔍 PDF 총 {len(all_pdfs)}개 발견")

    # 키: (year, school, exam) → entry
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
                'year':     meta['year'],
                'school':   meta['school'],
                'grade':    meta['grade'],
                'subject':  meta['subject'],
                'exam':     meta['exam'],
                'fileName': filename,
            }

        kind = meta['kind']
        if kind == 'q':
            entries[key]['url']      = url
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