import os
import json
import re
import sys
import io

# 출력 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# --- 설정: APMATH 폴더에서 실행 기준 ---
EXAMS_DIR = 'exams'
OUTPUT_FILE = 'db.js'


def compact_text(value):
    return re.sub(r'\s+', '', str(value or '')).strip()


def normalize_year(value):
    s = str(value or '').strip()
    if not s:
        return ''
    if s.isdigit():
        n = int(s)
        if n >= 2000:
            return n
        if 0 <= n <= 99:
            return 2000 + n
        return n
    return ''


def normalize_grade(value):
    v = compact_text(value)
    grade_map = {
        '고등학교1학년': '고1',
        '고등1학년': '고1',
        '고등1': '고1',
        '고1': '고1',
        '고등학교2학년': '고2',
        '고등2학년': '고2',
        '고등2': '고2',
        '고2': '고2',
        '고등학교3학년': '고3',
        '고등3학년': '고3',
        '고등3': '고3',
        '고3': '고3',
        '중학교1학년': '중1',
        '중등1학년': '중1',
        '중등1': '중1',
        '중1': '중1',
        '중학교2학년': '중2',
        '중등2학년': '중2',
        '중등2': '중2',
        '중2': '중2',
        '중학교3학년': '중3',
        '중등3학년': '중3',
        '중등3': '중3',
        '중3': '중3',
    }
    return grade_map.get(v, str(value or '').strip())


def normalize_semester(value, filename=''):
    v = compact_text(value)
    if v in ('1', '1학기'):
        return '1'
    if v in ('2', '2학기'):
        return '2'

    stem = os.path.splitext(filename)[0]
    if '_1학기_' in stem or stem.startswith('1학기_'):
        return '1'
    if '_2학기_' in stem or stem.startswith('2학기_'):
        return '2'
    return ''


def normalize_exam_type(value, filename=''):
    v = compact_text(value).lower()
    if v in ('mid', 'middle', '중간', '중간고사'):
        return 'mid'
    if v in ('final', '기말', '기말고사'):
        return 'final'

    stem = os.path.splitext(filename)[0]
    if '_중간_' in stem or stem.startswith('중간_'):
        return 'mid'
    if '_기말_' in stem or stem.startswith('기말_'):
        return 'final'
    return ''


def strip_suffixes(text):
    t = str(text or '').strip()
    if not t:
        return ''
    t = re.sub(r'_(유형\d*|유사\d*|단원평가유사\d*|단원평가\d*|쪽지\d*)$', '', t)
    t = re.sub(r'(유형\d*|유사\d*|단원평가유사\d*|단원평가\d*|쪽지\d*)$', '', t)
    return t.strip('_').strip()


def detect_content_type(filename, raw_subject='', school=''):
    stem = os.path.splitext(filename)[0]
    subject_raw = str(raw_subject or '').strip()

    if '단원평가유사' in stem or '단원평가' in stem:
        return '단원평가'
    if '쪽지' in stem:
        return '쪽지'
    if '유형' in stem or '유사' in stem:
        return '유형'

    if subject_raw in ('단원평가', '단원평가유사'):
        return '단원평가'
    if subject_raw == '쪽지':
        return '쪽지'
    if subject_raw in ('유형', '유사'):
        return '유형'
    if subject_raw == '기출':
        return '기출'

    if school:
        return '기출'

    return '유형'


def parse_standard_exam_filename(filename):
    """
    기출형
    예:
    - 25_효천고_1학기_중간_고1_기출.js
    - 25_순천여고_1학기_중간_고2_확률과통계.js
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 2:
        return None

    year_raw = parts[0]
    if not re.fullmatch(r'\d{2,4}', year_raw):
        return None

    school = parts[1].strip()
    year = normalize_year(year_raw)
    grade = ''
    semester = ''
    exam_type = ''
    subject_parts = []

    grade_pattern = re.compile(r'[중고][123]')

    for p in parts[2:]:
        grade_match = grade_pattern.search(p)
        if grade_match:
            grade = normalize_grade(grade_match.group())
        elif '학기' in p:
            semester = normalize_semester(p, filename)
        elif '중간' in p:
            exam_type = 'mid'
        elif '기말' in p:
            exam_type = 'final'
        else:
            subject_parts.append(p)

    raw_subject = '_'.join([x for x in subject_parts if x]).strip('_')
    content_type = detect_content_type(filename, raw_subject, school)

    topic = ''
    subject = ''

    if content_type == '기출':
        subject = '' if raw_subject in ('', '기출') else raw_subject
    elif content_type == '유형':
        if '유사' in stem:
            topic = '중간 유사' if exam_type == 'mid' else '기말 유사' if exam_type == 'final' else '유사문항'
    elif content_type == '단원평가':
        topic = '중간평가' if '중간평가' in stem else '단원평가'

    return {
        "file": filename,
        "school": school,
        "topic": topic,
        "grade": grade,
        "year": year,
        "semester": semester or normalize_semester('', filename),
        "examType": exam_type or normalize_exam_type('', filename),
        "subject": subject,
        "contentType": content_type
    }


def parse_unit_type_filename(filename):
    """
    단원형
    예:
    - 일차방정식활용_중1_유형.js
    - 유리수와순환소수_중2_유형2.js
    - 제곱근과실수_중3_단원평가.js
    - 일차방정식_중1_쪽지.js
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 3:
        return None

    if not re.fullmatch(r'[중고][123]', parts[1]):
        return None

    topic = strip_suffixes(parts[0])
    grade = normalize_grade(parts[1])
    tail = '_'.join(parts[2:]).strip()

    content_type = '유형'
    if '단원평가' in tail:
        content_type = '단원평가'
    elif '쪽지' in tail:
        content_type = '쪽지'
    elif '유형' in tail or '유사' in tail:
        content_type = '유형'

    return {
        "file": filename,
        "school": "",
        "topic": topic,
        "grade": grade,
        "year": "",
        "semester": "",
        "examType": "",
        "subject": "",
        "contentType": content_type
    }


def parse_eval_type_filename(filename):
    """
    새 평가형
    예:
    - 1학기_중간평가_중1_단원평가.js
    - 1학기_중간평가_중1_단원평가유사1.js
    - 2학기_기말평가_고1_단원평가.js
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 4:
        return None

    if parts[0] not in ('1학기', '2학기'):
        return None

    if not re.fullmatch(r'[중고][123]', parts[2]):
        return None

    semester = normalize_semester(parts[0], filename)
    eval_name = parts[1].strip()
    grade = normalize_grade(parts[2].strip())
    tail = '_'.join(parts[3:]).strip()

    content_type = '유형'
    if '단원평가' in tail:
        content_type = '단원평가'
    elif '쪽지' in tail:
        content_type = '쪽지'
    elif '유형' in tail or '유사' in tail:
        content_type = '유형'

    exam_type = ''
    if '중간' in eval_name:
        exam_type = 'mid'
    elif '기말' in eval_name:
        exam_type = 'final'

    return {
        "file": filename,
        "school": "",
        "topic": eval_name,
        "grade": grade,
        "year": "",
        "semester": semester,
        "examType": exam_type,
        "subject": "",
        "contentType": content_type
    }


def parse_apmath_legacy_filename(filename):
    """
    기존 AP수학형
    예:
    - 26_AP수학_1학기_일차방정식활용_중1_유형.js
    - 26_AP수학_1학기_중간_중1_중간평가.js
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 3:
        return None

    year_raw = parts[0]
    if not re.fullmatch(r'\d{2,4}', year_raw):
        return None
    if parts[1] != 'AP수학':
        return None

    year = normalize_year(year_raw)
    school = 'AP수학'
    semester = normalize_semester('', filename)
    exam_type = normalize_exam_type('', filename)
    grade = ''
    tail_parts = []

    grade_pattern = re.compile(r'[중고][123]')

    for p in parts[2:]:
        grade_match = grade_pattern.search(p)
        if grade_match:
            grade = normalize_grade(grade_match.group())
        elif '학기' in p:
            semester = normalize_semester(p, filename)
        elif '중간' in p or '기말' in p:
            continue
        else:
            tail_parts.append(p)

    raw_subject = '_'.join([x for x in tail_parts if x]).strip('_')
    content_type = detect_content_type(filename, raw_subject, school)

    if '중간평가' in stem:
        topic = '중간평가'
    else:
        topic = strip_suffixes(raw_subject)

    return {
        "file": filename,
        "school": school,
        "topic": topic,
        "grade": grade,
        "year": year,
        "semester": semester,
        "examType": exam_type,
        "subject": "",
        "contentType": content_type
    }


def parse_rpm_filename(filename):
    """
    RPM형
    예:
    - 26_RPM_1학기_중간_중2_유리수와순환소수.js
    """
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    if len(parts) < 3:
        return None

    year_raw = parts[0]
    if not re.fullmatch(r'\d{2,4}', year_raw):
        return None
    if parts[1] != 'RPM':
        return None

    year = normalize_year(year_raw)
    school = 'RPM'
    semester = normalize_semester('', filename)
    exam_type = normalize_exam_type('', filename)
    grade = ''
    leftovers = []

    grade_pattern = re.compile(r'[중고][123]')

    for p in parts[2:]:
        grade_match = grade_pattern.search(p)
        if grade_match:
            grade = normalize_grade(grade_match.group())
        elif '학기' in p:
            semester = normalize_semester(p, filename)
        elif '중간' in p or '기말' in p:
            continue
        else:
            leftovers.append(p)

    topic = strip_suffixes('_'.join(leftovers).strip('_'))

    return {
        "file": filename,
        "school": school,
        "topic": topic,
        "grade": grade,
        "year": year,
        "semester": semester,
        "examType": exam_type,
        "subject": "",
        "contentType": "유형"
    }


def parse_filename_upgraded(filename):
    meta = parse_eval_type_filename(filename)
    if meta:
        return meta

    meta = parse_unit_type_filename(filename)
    if meta:
        return meta

    meta = parse_apmath_legacy_filename(filename)
    if meta:
        return meta

    meta = parse_rpm_filename(filename)
    if meta:
        return meta

    meta = parse_standard_exam_filename(filename)
    if meta:
        return meta

    return None


def find_matching_bracket(text, start_idx, open_char='[', close_char=']'):
    depth = 0
    in_single = False
    in_double = False
    in_backtick = False
    in_line_comment = False
    in_block_comment = False
    escape = False

    for i in range(start_idx, len(text)):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ''

        if in_line_comment:
            if ch == '\n':
                in_line_comment = False
            continue

        if in_block_comment:
            if ch == '*' and nxt == '/':
                in_block_comment = False
            continue

        if in_single:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == "'":
                in_single = False
            continue

        if in_double:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '"':
                in_double = False
            continue

        if in_backtick:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '`':
                in_backtick = False
            continue

        if ch == '/' and nxt == '/':
            in_line_comment = True
            continue

        if ch == '/' and nxt == '*':
            in_block_comment = True
            continue

        if ch == "'":
            in_single = True
            continue

        if ch == '"':
            in_double = True
            continue

        if ch == '`':
            in_backtick = True
            continue

        if ch == open_char:
            depth += 1
        elif ch == close_char:
            depth -= 1
            if depth == 0:
                return i

    return -1


def count_top_level_objects_in_array(array_text):
    depth_brace = 0
    depth_bracket = 0
    count = 0

    in_single = False
    in_double = False
    in_backtick = False
    in_line_comment = False
    in_block_comment = False
    escape = False

    for i, ch in enumerate(array_text):
        nxt = array_text[i + 1] if i + 1 < len(array_text) else ''

        if in_line_comment:
            if ch == '\n':
                in_line_comment = False
            continue

        if in_block_comment:
            if ch == '*' and nxt == '/':
                in_block_comment = False
            continue

        if in_single:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == "'":
                in_single = False
            continue

        if in_double:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '"':
                in_double = False
            continue

        if in_backtick:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '`':
                in_backtick = False
            continue

        if ch == '/' and nxt == '/':
            in_line_comment = True
            continue

        if ch == '/' and nxt == '*':
            in_block_comment = True
            continue

        if ch == "'":
            in_single = True
            continue

        if ch == '"':
            in_double = True
            continue

        if ch == '`':
            in_backtick = True
            continue

        if ch == '[':
            depth_bracket += 1
            continue
        if ch == ']':
            depth_bracket -= 1
            continue

        if ch == '{':
            if depth_bracket == 1 and depth_brace == 0:
                count += 1
            depth_brace += 1
            continue

        if ch == '}':
            depth_brace -= 1
            continue

    return count


def extract_qcount_from_js(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='cp949') as f:
            text = f.read()
    except Exception:
        return 0

    markers = [
        'window.questionBank',
        'window.문항데이터',
        'questionBank'
    ]

    start = -1
    for marker in markers:
        idx = text.find(marker)
        if idx != -1:
            start = idx
            break

    if start == -1:
        return 0

    array_start = text.find('[', start)
    if array_start == -1:
        return 0

    array_end = find_matching_bracket(text, array_start, '[', ']')
    if array_end == -1:
        return 0

    array_text = text[array_start:array_end + 1]
    count = count_top_level_objects_in_array(array_text)
    return count if count > 0 else 0


def sort_key(item):
    grade_order = {"고3": 0, "고2": 1, "고1": 2, "중3": 3, "중2": 4, "중1": 5}
    year = item.get("year")
    year_key = int(year) if isinstance(year, int) else -1
    grade_key = grade_order.get(item.get("grade", ""), 99)
    school_key = item.get("school", "")
    file_key = item.get("file", "")
    return (-year_key, grade_key, school_key, file_key)


def build_engine_db():
    base_path = os.path.dirname(os.path.abspath(__file__))
    exams_path = os.path.join(base_path, EXAMS_DIR)
    output_path = os.path.join(base_path, OUTPUT_FILE)

    if not os.path.exists(exams_path):
        print(f"❌ 오류: '{exams_path}' 폴더를 찾을 수 없습니다.")
        return

    exams_list = []
    skipped = []
    qcount_failed = []

    all_files = sorted([f for f in os.listdir(exams_path) if f.lower().endswith('.js')])

    for filename in all_files:
        meta = parse_filename_upgraded(filename)
        if meta and meta.get("file"):
            file_path = os.path.join(exams_path, filename)
            qcount = extract_qcount_from_js(file_path)
            meta["qCount"] = qcount

            if qcount == 0:
                qcount_failed.append(filename)

            exams_list.append(meta)
        else:
            skipped.append(filename)

    exams_list.sort(key=sort_key)

    db_content = {"exams": exams_list}

    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("window.mainDB = ")
            json.dump(db_content, f, ensure_ascii=False, indent=2)
            f.write(";")

        print(f"✅ 동기화 완료: 총 {len(exams_list)}개의 파일을 db.js에 등록했습니다.")
        if skipped:
            print(f"⚠️ 파일명 규칙 미매칭으로 건너뜀({len(skipped)}개): {skipped}")
        if qcount_failed:
            print(f"⚠️ qCount 추출 실패 또는 0개({len(qcount_failed)}개): {qcount_failed}")

    except Exception as e:
        print(f"❌ 파일 쓰기 실패: {e}")


if __name__ == "__main__":
    build_engine_db()