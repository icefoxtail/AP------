import os
import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXAMS_DIR = 'exams'
OUTPUT_FILE = 'db.js'


# =========================================================
# 0. 공통 유틸
# =========================================================
def compact_text(value):
    return re.sub(r'\s+', '', str(value or '')).strip()


def normalize_topic_for_matching(topic):
    t = compact_text(topic)
    t = re.sub(r'(유형\d*|유사\d*|단원평가유사\d*|단원평가\d*|쪽지\d*)$', '', t)
    return t.strip('_').strip()


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
        '고등학교1학년': '고1', '고등1학년': '고1', '고등1': '고1', '고1': '고1',
        '고등학교2학년': '고2', '고등2학년': '고2', '고등2': '고2', '고2': '고2',
        '고등학교3학년': '고3', '고등3학년': '고3', '고등3': '고3', '고3': '고3',
        '중학교1학년': '중1', '중등1학년': '중1', '중등1': '중1', '중1': '중1',
        '중학교2학년': '중2', '중등2학년': '중2', '중등2': '중2', '중2': '중2',
        '중학교3학년': '중3', '중등3학년': '중3', '중등3': '중3', '중3': '중3',
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


def read_text_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='cp949') as f:
            return f.read()


# =========================================================
# 1. 표준단원 마스터
# =========================================================
def _course(grade, course_code, course_name, aliases, units):
    return {
        "grade": grade,
        "course_code": course_code,
        "course_name": course_name,
        "aliases": aliases,
        "units": units,
    }


COURSE_TABLES = [
    # -------------------------
    # 중학교 (2022 개정)
    # -------------------------
    _course("중1", "M1", "중1 수학", ["중1 수학"], [
        {"key": "M1-01", "name": "소인수분해", "order": 1},
        {"key": "M1-02", "name": "정수와 유리수", "order": 2},
        {"key": "M1-03", "name": "문자와 식", "order": 3},
        {"key": "M1-04", "name": "좌표평면과 그래프", "order": 4},
        {"key": "M1-05", "name": "기본도형", "order": 5},
        {"key": "M1-06", "name": "평면도형의 성질", "order": 6},
        {"key": "M1-07", "name": "입체도형의 성질", "order": 7},
        {"key": "M1-08", "name": "자료의 정리와 해석", "order": 8},
    ]),
    _course("중2", "M2", "중2 수학", ["중2 수학"], [
        {"key": "M2-01", "name": "수와 식", "order": 1},
        {"key": "M2-02", "name": "일차부등식", "order": 2},
        {"key": "M2-03", "name": "연립일차방정식", "order": 3},
        {"key": "M2-04", "name": "일차함수와 그래프", "order": 4},
        {"key": "M2-05", "name": "도형의 성질", "order": 5},
        {"key": "M2-06", "name": "도형의 닮음", "order": 6},
        {"key": "M2-07", "name": "피타고라스 정리", "order": 7},
        {"key": "M2-08", "name": "확률", "order": 8},
    ]),
    _course("중3", "M3", "중3 수학", ["중3 수학"], [
        {"key": "M3-01", "name": "실수와 그 계산", "order": 1},
        {"key": "M3-02", "name": "다항식의 곱셈과 인수분해", "order": 2},
        {"key": "M3-03", "name": "이차방정식", "order": 3},
        {"key": "M3-04", "name": "이차함수와 그래프", "order": 4},
        {"key": "M3-05", "name": "삼각비", "order": 5},
        {"key": "M3-06", "name": "원의 성질", "order": 6},
        {"key": "M3-07", "name": "통계", "order": 7},
    ]),

    # -------------------------
    # 고등학교 (2022 개정)
    # -------------------------
    _course("고1", "H22-C", "공통수학1", ["공통수학1", "공통수학 1"], [
        {"key": "H22-C-01", "name": "다항식의 연산", "order": 1},
        {"key": "H22-C-02", "name": "항등식과 나머지 정리", "order": 2},
        {"key": "H22-C-03", "name": "인수분해", "order": 3},
        {"key": "H22-C-04", "name": "복소수와 이차방정식", "order": 4},
        {"key": "H22-C-05", "name": "이차방정식과 이차함수", "order": 5},
        {"key": "H22-C-06", "name": "여러 가지 방정식과 부등식", "order": 6},
        {"key": "H22-C-07", "name": "합의 법칙과 곱의 법칙", "order": 7},
        {"key": "H22-C-08", "name": "순열과 조합", "order": 8},
        {"key": "H22-C-09", "name": "행렬과 그 연산", "order": 9},
    ]),
    _course("고1", "H22-C2", "공통수학2", ["공통수학2", "공통수학 2"], [
        {"key": "H22-C2-01", "name": "평면좌표", "order": 1},
        {"key": "H22-C2-02", "name": "직선의 방정식", "order": 2},
        {"key": "H22-C2-03", "name": "원의 방정식", "order": 3},
        {"key": "H22-C2-04", "name": "도형의 이동", "order": 4},
        {"key": "H22-C2-05", "name": "집합", "order": 5},
        {"key": "H22-C2-06", "name": "명제", "order": 6},
        {"key": "H22-C2-07", "name": "함수", "order": 7},
        {"key": "H22-C2-08", "name": "유리함수", "order": 8},
        {"key": "H22-C2-09", "name": "무리함수", "order": 9},
    ]),
    _course("고2", "H22-A", "대수", ["대수"], [
        {"key": "H22-A-01", "name": "지수와 로그", "order": 1},
        {"key": "H22-A-02", "name": "지수함수", "order": 2},
        {"key": "H22-A-03", "name": "로그함수", "order": 3},
        {"key": "H22-A-04", "name": "삼각함수", "order": 4},
        {"key": "H22-A-05", "name": "사인법칙과 코사인법칙", "order": 5},
        {"key": "H22-A-06", "name": "등차수열과 등비수열", "order": 6},
        {"key": "H22-A-07", "name": "수열의 합", "order": 7},
        {"key": "H22-A-08", "name": "수학적 귀납법", "order": 8},
    ]),
    _course("고3", "H22-M1", "미적분I", ["미적분I", "미적분Ⅰ", "미적분 1"], [
        {"key": "H22-M1-01", "name": "함수의 극한", "order": 1},
        {"key": "H22-M1-02", "name": "함수의 연속", "order": 2},
        {"key": "H22-M1-03", "name": "미분계수", "order": 3},
        {"key": "H22-M1-04", "name": "도함수", "order": 4},
        {"key": "H22-M1-05", "name": "도함수의 활용", "order": 5},
        {"key": "H22-M1-06", "name": "부정적분", "order": 6},
        {"key": "H22-M1-07", "name": "정적분", "order": 7},
        {"key": "H22-M1-08", "name": "정적분의 활용", "order": 8},
    ]),
    _course("고3", "H22-M2", "미적분II", ["미적분II", "미적분Ⅱ", "미적분 2"], [
        {"key": "H22-M2-01", "name": "수열의 극한", "order": 1},
        {"key": "H22-M2-02", "name": "급수", "order": 2},
        {"key": "H22-M2-03", "name": "지수함수와 로그함수의 미분", "order": 3},
        {"key": "H22-M2-04", "name": "삼각함수의 미분", "order": 4},
        {"key": "H22-M2-05", "name": "여러 가지 미분법", "order": 5},
        {"key": "H22-M2-06", "name": "도함수의 활용", "order": 6},
        {"key": "H22-M2-07", "name": "여러 가지 적분법", "order": 7},
        {"key": "H22-M2-08", "name": "정적분의 활용", "order": 8},
    ]),
    _course("고2", "H22-PS", "확률과 통계", ["확률과 통계", "확률과통계"], [
        {"key": "H22-PS-01", "name": "순열과 조합", "order": 1},
        {"key": "H22-PS-02", "name": "이항정리", "order": 2},
        {"key": "H22-PS-03", "name": "확률의 뜻과 활용", "order": 3},
        {"key": "H22-PS-04", "name": "조건부확률", "order": 4},
        {"key": "H22-PS-05", "name": "확률분포", "order": 5},
        {"key": "H22-PS-06", "name": "통계적 추정", "order": 6},
    ]),
    _course("고3", "H22-GE", "기하", ["기하"], [
        {"key": "H22-GE-01", "name": "이차곡선", "order": 1},
        {"key": "H22-GE-02", "name": "이차곡선의 접선", "order": 2},
        {"key": "H22-GE-03", "name": "공간도형", "order": 3},
        {"key": "H22-GE-04", "name": "공간좌표", "order": 4},
        {"key": "H22-GE-05", "name": "벡터의 연산", "order": 5},
        {"key": "H22-GE-06", "name": "벡터의 성분", "order": 6},
        {"key": "H22-GE-07", "name": "벡터의 내적", "order": 7},
        {"key": "H22-GE-08", "name": "도형의 방정식", "order": 8},
    ]),

    # -------------------------
    # 고등학교 (2015 개정, 호환용)
    # -------------------------
    _course("고1", "H15-SA", "수학(상)", ["수학(상)", "수학상", "수학 상"], [
        {"key": "H15-SA-01", "name": "다항식의 연산", "order": 1},
        {"key": "H15-SA-02", "name": "항등식과 나머지정리", "order": 2},
        {"key": "H15-SA-03", "name": "인수분해", "order": 3},
        {"key": "H15-SA-04", "name": "복소수", "order": 4},
        {"key": "H15-SA-05", "name": "이차방정식", "order": 5},
        {"key": "H15-SA-06", "name": "이차방정식의 근과 계수", "order": 6},
        {"key": "H15-SA-07", "name": "여러 가지 방정식", "order": 7},
        {"key": "H15-SA-08", "name": "여러 가지 부등식", "order": 8},
        {"key": "H15-SA-09", "name": "평면좌표", "order": 9},
        {"key": "H15-SA-10", "name": "직선의 방정식", "order": 10},
        {"key": "H15-SA-11", "name": "원의 방정식", "order": 11},
        {"key": "H15-SA-12", "name": "도형의 이동", "order": 12},
    ]),
    _course("고1", "H15-SB", "수학(하)", ["수학(하)", "수학하", "수학 하"], [
        {"key": "H15-SB-01", "name": "집합", "order": 1},
        {"key": "H15-SB-02", "name": "명제", "order": 2},
        {"key": "H15-SB-03", "name": "함수", "order": 3},
        {"key": "H15-SB-04", "name": "유리함수", "order": 4},
        {"key": "H15-SB-05", "name": "무리함수", "order": 5},
        {"key": "H15-SB-06", "name": "경우의 수", "order": 6},
        {"key": "H15-SB-07", "name": "순열", "order": 7},
        {"key": "H15-SB-08", "name": "조합", "order": 8},
    ]),
    _course("고2", "H15-M1", "수학I", ["수학I", "수학 I", "수학Ⅰ"], [
        {"key": "H15-M1-01", "name": "지수의 뜻과 성질", "order": 1},
        {"key": "H15-M1-02", "name": "로그의 뜻과 성질", "order": 2},
        {"key": "H15-M1-03", "name": "지수함수", "order": 3},
        {"key": "H15-M1-04", "name": "로그함수", "order": 4},
        {"key": "H15-M1-05", "name": "삼각함수의 뜻과 값", "order": 5},
        {"key": "H15-M1-06", "name": "삼각함수의 그래프", "order": 6},
        {"key": "H15-M1-07", "name": "삼각방정식과 삼각부등식", "order": 7},
        {"key": "H15-M1-08", "name": "등차수열", "order": 8},
        {"key": "H15-M1-09", "name": "등비수열", "order": 9},
        {"key": "H15-M1-10", "name": "수열의 합", "order": 10},
        {"key": "H15-M1-11", "name": "수학적 귀납법", "order": 11},
    ]),
    _course("고3", "H15-M2", "수학II", ["수학II", "수학 II", "수학Ⅱ"], [
        {"key": "H15-M2-01", "name": "함수의 극한", "order": 1},
        {"key": "H15-M2-02", "name": "함수의 연속", "order": 2},
        {"key": "H15-M2-03", "name": "미분계수", "order": 3},
        {"key": "H15-M2-04", "name": "도함수", "order": 4},
        {"key": "H15-M2-05", "name": "접선의 방정식", "order": 5},
        {"key": "H15-M2-06", "name": "도함수의 활용", "order": 6},
        {"key": "H15-M2-07", "name": "부정적분", "order": 7},
        {"key": "H15-M2-08", "name": "정적분", "order": 8},
        {"key": "H15-M2-09", "name": "적분의 활용", "order": 9},
    ]),
    _course("고3", "H15-CALC", "미적분", ["미적분"], [
        {"key": "H15-CALC-01", "name": "수열의 극한", "order": 1},
        {"key": "H15-CALC-02", "name": "급수", "order": 2},
        {"key": "H15-CALC-03", "name": "지수함수와 로그함수의 미분", "order": 3},
        {"key": "H15-CALC-04", "name": "삼각함수의 미분", "order": 4},
        {"key": "H15-CALC-05", "name": "여러 가지 미분법", "order": 5},
        {"key": "H15-CALC-06", "name": "도함수의 활용", "order": 6},
        {"key": "H15-CALC-07", "name": "여러 가지 적분법", "order": 7},
        {"key": "H15-CALC-08", "name": "정적분의 활용", "order": 8},
    ]),
    _course("고2", "H15-PS", "확률과 통계", ["확률과 통계", "확률과통계"], [
        {"key": "H15-PS-01", "name": "순열과 조합", "order": 1},
        {"key": "H15-PS-02", "name": "이항정리", "order": 2},
        {"key": "H15-PS-03", "name": "확률의 뜻과 활용", "order": 3},
        {"key": "H15-PS-04", "name": "조건부확률", "order": 4},
        {"key": "H15-PS-05", "name": "확률분포", "order": 5},
        {"key": "H15-PS-06", "name": "통계적 추정", "order": 6},
    ]),
    _course("고3", "H15-GV", "기하와 벡터", ["기하와 벡터", "기하와벡터"], [
        {"key": "H15-GV-01", "name": "포물선", "order": 1},
        {"key": "H15-GV-02", "name": "타원", "order": 2},
        {"key": "H15-GV-03", "name": "쌍곡선", "order": 3},
        {"key": "H15-GV-04", "name": "이차곡선과 직선", "order": 4},
        {"key": "H15-GV-05", "name": "벡터의 연산", "order": 5},
        {"key": "H15-GV-06", "name": "평면벡터의 성분과 내적", "order": 6},
        {"key": "H15-GV-07", "name": "직선과 원의 방정식", "order": 7},
        {"key": "H15-GV-08", "name": "공간도형", "order": 8},
        {"key": "H15-GV-09", "name": "공간좌표", "order": 9},
    ]),
]


UNIT_BY_KEY = {}
UNITS_BY_GRADE = {}
COURSE_BY_ALIAS = {}
UNIT_NAME_INDEX_BY_GRADE = {}

for course in COURSE_TABLES:
    grade = course["grade"]
    UNITS_BY_GRADE.setdefault(grade, [])
    UNIT_NAME_INDEX_BY_GRADE.setdefault(grade, {})

    for alias in course["aliases"]:
        COURSE_BY_ALIAS[compact_text(alias)] = course
    COURSE_BY_ALIAS[compact_text(course["course_name"])] = course

    for unit in course["units"]:
        meta = {
            "key": unit["key"],
            "name": unit["name"],
            "order": unit["order"],
            "grade": grade,
            "course_code": course["course_code"],
            "course_name": course["course_name"],
        }
        UNIT_BY_KEY[unit["key"]] = meta
        UNITS_BY_GRADE[grade].append(meta)
        UNIT_NAME_INDEX_BY_GRADE[grade][compact_text(unit["name"])] = meta


# =========================================================
# 2. 별칭 매핑
# =========================================================
ALIAS_UNIT_MAP = {
    "중1": {
        "일차방정식활용": "문자와 식",
    },
    "중2": {
        "단항식의계산": "수와 식",
        "유리수와순환소수": "수와 식",
    },
    "중3": {
        "제곱근과실수": "실수와 그 계산",
    },
    "고1": {
        "항등식과나머지정리": "항등식과 나머지 정리",
        "복소수": "복소수와 이차방정식",
        "이차방정식": "복소수와 이차방정식",
        "이차함수": "이차방정식과 이차함수",
        "경우의수": "합의 법칙과 곱의 법칙",
        "순열과조합": "순열과 조합",
        "행렬": "행렬과 그 연산",
    },
    "고2": {
        "등차수열": "등차수열과 등비수열",
        "등비수열": "등차수열과 등비수열",
        "순열": "순열과 조합",
        "조합": "순열과 조합",
        "확률의뜻과활용": "확률의 뜻과 활용",
        "확률의개념과활용": "확률의 뜻과 활용",
    },
    "고3": {
        "미분계수와도함수": "도함수",
        "벡터": "벡터의 연산",
    },
}


# =========================================================
# 3. 파일명 파서
# =========================================================
def parse_standard_exam_filename(filename):
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
        "contentType": content_type,
    }


def parse_unit_type_filename(filename):
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
        "contentType": content_type,
    }


def parse_eval_type_filename(filename):
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
        "contentType": content_type,
    }


def parse_apmath_legacy_filename(filename):
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
        "contentType": content_type,
    }


def parse_rpm_filename(filename):
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
        "contentType": "유형",
    }


def parse_filename_upgraded(filename):
    for parser in (
        parse_eval_type_filename,
        parse_unit_type_filename,
        parse_apmath_legacy_filename,
        parse_rpm_filename,
        parse_standard_exam_filename,
    ):
        meta = parser(filename)
        if meta:
            return meta
    return None


# =========================================================
# 4. qCount 추출
# =========================================================
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
        text = read_text_file(filepath)
    except Exception:
        return 0

    markers = ['window.questionBank', 'window.문항데이터', 'questionBank']
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


# =========================================================
# 5. range / courseRanges 추출
# =========================================================
def make_empty_range(reason='unresolved'):
    return {
        "rangeStartUnitKey": "",
        "rangeStartUnit": "",
        "rangeStartUnitOrder": 999,
        "rangeEndUnitKey": "",
        "rangeEndUnit": "",
        "rangeEndUnitOrder": 999,
        "courseRanges": [],
        "primaryStandardCourse": "",
        "_rangeReason": reason,
    }


def is_exam_similar_file(filename):
    stem = os.path.splitext(filename)[0]
    return bool(re.fullmatch(r'\d{2,4}_.+_[12]학기_(중간|기말)_[중고][123]_유사\d*', stem))


def build_origin_exam_filename(filename):
    stem = os.path.splitext(filename)[0]
    origin_stem = re.sub(r'_유사\d*$', '_기출', stem)
    return origin_stem + '.js'


def extract_standard_course_names(text):
    names = []
    seen = set()
    patterns = [
        r'standardCourse\s*:\s*[\'"]([^\'"]+)[\'"]',
        r'"standardCourse"\s*:\s*"([^"]+)"',
    ]
    for pattern in patterns:
        for v in re.findall(pattern, text):
            key = compact_text(v)
            if key and key not in seen:
                seen.add(key)
                names.append(v.strip())
    return names


def extract_standard_unit_names(text):
    names = []
    seen = set()
    patterns = [
        r'standardUnit\s*:\s*[\'"]([^\'"]+)[\'"]',
        r'"standardUnit"\s*:\s*"([^"]+)"',
    ]
    for pattern in patterns:
        for v in re.findall(pattern, text):
            key = compact_text(v)
            if key and key not in seen:
                seen.add(key)
                names.append(v.strip())
    return names


def extract_standard_unit_keys(text):
    keys = []
    seen = set()
    patterns = [
        r'standardUnitKey\s*:\s*[\'"]([^\'"]+)[\'"]',
        r'"standardUnitKey"\s*:\s*"([^"]+)"',
    ]
    for pattern in patterns:
        for v in re.findall(pattern, text):
            key = str(v).strip()
            if not key or key.startswith('RAW-'):
                continue
            if key not in seen:
                seen.add(key)
                keys.append(key)
    return keys


def resolve_key_direct(raw_key):
    return UNIT_BY_KEY.get(raw_key)


def dedupe_units(units):
    result = []
    seen = set()
    for u in units:
        if u and u["key"] not in seen:
            seen.add(u["key"])
            result.append(u)
    return result


def dedupe_courses(courses):
    result = []
    seen = set()
    for c in courses:
        if not c:
            continue
        key = (c["grade"], c["course_code"])
        if key not in seen:
            seen.add(key)
            result.append(c)
    return result


def get_candidate_courses(meta, standard_courses):
    candidates = []

    # 1차: JS 내부 standardCourse 우선
    for course_name in standard_courses:
        course = COURSE_BY_ALIAS.get(compact_text(course_name))
        if course:
            candidates.append(course)

    if candidates:
        return dedupe_courses(candidates)

    # 2차: 파일 메타 subject/topic 기반
    grade = meta.get("grade", "")
    aliases = [compact_text(meta.get("subject", "")), compact_text(meta.get("topic", ""))]
    for alias in aliases:
        if not alias:
            continue
        course = COURSE_BY_ALIAS.get(alias)
        if course and course["grade"] == grade:
            candidates.append(course)

    # 3차: 중학교는 grade 단일 course
    if not candidates and grade.startswith("중"):
        for course in COURSE_TABLES:
            if course["grade"] == grade and course["course_code"] in ("M1", "M2", "M3"):
                candidates.append(course)

    return dedupe_courses(candidates)


def resolve_units_from_names(unit_names, candidate_courses, grade):
    resolved = []

    for unit_name in unit_names:
        unit_compact = compact_text(unit_name)
        if not unit_compact:
            continue

        found = None

        # 1차: candidate course 내부에서 탐색
        for course in candidate_courses:
            for unit in course["units"]:
                name_compact = compact_text(unit["name"])
                if unit_compact == name_compact or unit_compact in name_compact or name_compact in unit_compact:
                    found = UNIT_BY_KEY[unit["key"]]
                    break
            if found:
                break

        if found:
            resolved.append(found)
            continue

        # 2차: grade 전체에서 탐색
        for unit in UNITS_BY_GRADE.get(grade, []):
            name_compact = compact_text(unit["name"])
            if unit_compact == name_compact or unit_compact in name_compact or name_compact in unit_compact:
                resolved.append(unit)
                break

    return dedupe_units(resolved)


def infer_unit_meta_from_alias(topic, grade):
    if not topic or not grade:
        return None
    normalized = normalize_topic_for_matching(topic)
    mapped_name = ALIAS_UNIT_MAP.get(grade, {}).get(normalized)
    if not mapped_name:
        return None
    return UNIT_NAME_INDEX_BY_GRADE.get(grade, {}).get(compact_text(mapped_name))


def infer_unit_meta_from_topic(topic, grade):
    if not topic or not grade:
        return None

    topic_compact = normalize_topic_for_matching(topic)
    if not topic_compact:
        return None

    # 1차: grade 전체 exact / 포함
    for unit in UNITS_BY_GRADE.get(grade, []):
        unit_compact = compact_text(unit["name"])
        if topic_compact == unit_compact or topic_compact in unit_compact or unit_compact in topic_compact:
            return unit

    # 2차: alias
    alias_meta = infer_unit_meta_from_alias(topic_compact, grade)
    if alias_meta:
        return alias_meta

    return None


def build_course_ranges_from_units(units):
    grouped = {}
    for unit in units:
        grouped.setdefault(unit["course_code"], []).append(unit)

    course_ranges = []
    for course_code, grouped_units in grouped.items():
        grouped_units = sorted(grouped_units, key=lambda x: x["order"])
        start_unit = grouped_units[0]
        end_unit = grouped_units[-1]
        course_ranges.append({
            "standardCourse": start_unit["course_name"],
            "courseCode": start_unit["course_code"],
            "rangeStartUnitKey": start_unit["key"],
            "rangeStartUnit": start_unit["name"],
            "rangeStartUnitOrder": start_unit["order"],
            "rangeEndUnitKey": end_unit["key"],
            "rangeEndUnit": end_unit["name"],
            "rangeEndUnitOrder": end_unit["order"],
        })

    course_ranges.sort(key=lambda x: (x["standardCourse"], x["rangeStartUnitOrder"], x["rangeEndUnitOrder"]))
    return course_ranges


def build_range_payload(units, reason, meta):
    if not units:
        return make_empty_range(reason)

    course_ranges = build_course_ranges_from_units(units)

    # 중학교는 course 하나뿐이라 top-level range 바로 채움
    if meta.get("grade", "").startswith("중"):
        cr = course_ranges[0]
        return {
            "rangeStartUnitKey": cr["rangeStartUnitKey"],
            "rangeStartUnit": cr["rangeStartUnit"],
            "rangeStartUnitOrder": cr["rangeStartUnitOrder"],
            "rangeEndUnitKey": cr["rangeEndUnitKey"],
            "rangeEndUnit": cr["rangeEndUnit"],
            "rangeEndUnitOrder": cr["rangeEndUnitOrder"],
            "courseRanges": course_ranges,
            "primaryStandardCourse": cr["standardCourse"],
            "_rangeReason": reason,
        }

    # 고등은 과목별로 분리
    if len(course_ranges) == 1:
        cr = course_ranges[0]
        return {
            "rangeStartUnitKey": cr["rangeStartUnitKey"],
            "rangeStartUnit": cr["rangeStartUnit"],
            "rangeStartUnitOrder": cr["rangeStartUnitOrder"],
            "rangeEndUnitKey": cr["rangeEndUnitKey"],
            "rangeEndUnit": cr["rangeEndUnit"],
            "rangeEndUnitOrder": cr["rangeEndUnitOrder"],
            "courseRanges": course_ranges,
            "primaryStandardCourse": cr["standardCourse"],
            "_rangeReason": reason,
        }

    # 고등 복수 과목 파일은 top-level 단일 range를 비워두고 courseRanges만 사용
    return {
        "rangeStartUnitKey": "",
        "rangeStartUnit": "",
        "rangeStartUnitOrder": 999,
        "rangeEndUnitKey": "",
        "rangeEndUnit": "",
        "rangeEndUnitOrder": 999,
        "courseRanges": course_ranges,
        "primaryStandardCourse": "",
        "_rangeReason": 'multi_course_exam',
    }


def extract_range_meta_from_js(filepath, meta, origin_range_map=None):
    filename = os.path.basename(filepath)

    # 1) 기출 유사 파일은 원본 기출 range / courseRanges 상속 우선
    if is_exam_similar_file(filename) and origin_range_map:
        origin_file = build_origin_exam_filename(filename)
        inherited = origin_range_map.get(origin_file)
        if inherited and (inherited.get("courseRanges") or inherited.get("rangeStartUnitKey")):
            copied = json.loads(json.dumps(inherited, ensure_ascii=False))
            copied["_rangeReason"] = "inherit_from_origin_exam"
            return copied

    # 2) 파일 읽기
    try:
        text = read_text_file(filepath)
    except Exception:
        return make_empty_range('file_read_fail')

    # 3) standardUnitKey 직접 추출
    raw_keys = extract_standard_unit_keys(text)
    resolved_by_key = dedupe_units([resolve_key_direct(k) for k in raw_keys])

    if resolved_by_key:
        return build_range_payload(resolved_by_key, 'question_keys', meta)

    # 4) standardCourse + standardUnit 이름 복원
    standard_courses = extract_standard_course_names(text)
    unit_names = extract_standard_unit_names(text)
    candidate_courses = get_candidate_courses(meta, standard_courses)
    resolved_by_name = resolve_units_from_names(unit_names, candidate_courses, meta.get("grade", ""))

    if resolved_by_name:
        return build_range_payload(resolved_by_name, 'course_unit_name_match', meta)

    # 5) topic fallback (단일단원 자료)
    fallback = infer_unit_meta_from_topic(meta.get("topic", ""), meta.get("grade", ""))
    if fallback:
        return build_range_payload([fallback], 'topic_alias_fallback', meta)

    # 6) 기출/빈 subject 보수 처리
    if meta.get("contentType") == "기출" and not compact_text(meta.get("subject", "")):
        return make_empty_range('subject_ambiguous')

    return make_empty_range('topic_match_fail')


# =========================================================
# 6. 정렬
# =========================================================
def sort_key(item):
    grade_order = {"고3": 0, "고2": 1, "고1": 2, "중3": 3, "중2": 4, "중1": 5}
    year = item.get("year")
    year_key = int(year) if isinstance(year, int) else -1
    grade_key = grade_order.get(item.get("grade", ""), 99)
    school_key = item.get("school", "")
    file_key = item.get("file", "")
    return (-year_key, grade_key, school_key, file_key)


# =========================================================
# 7. 메인 빌드
# =========================================================
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
    range_failed = []

    all_files = sorted([f for f in os.listdir(exams_path) if f.lower().endswith('.js')])

    parsed_meta_map = {}
    for filename in all_files:
        meta = parse_filename_upgraded(filename)
        if meta and meta.get("file"):
            parsed_meta_map[filename] = meta
        else:
            skipped.append(filename)

    # 1차: 원본 기출 range/courseRanges 확보
    origin_range_map = {}

    for filename in all_files:
        meta = parsed_meta_map.get(filename)
        if not meta or meta.get("contentType") != '기출':
            continue

        file_path = os.path.join(exams_path, filename)
        range_meta = extract_range_meta_from_js(file_path, meta, origin_range_map={})
        if range_meta.get("courseRanges") or range_meta.get("rangeStartUnitKey"):
            origin_range_map[filename] = {
                "rangeStartUnitKey": range_meta.get("rangeStartUnitKey", ""),
                "rangeStartUnit": range_meta.get("rangeStartUnit", ""),
                "rangeStartUnitOrder": range_meta.get("rangeStartUnitOrder", 999),
                "rangeEndUnitKey": range_meta.get("rangeEndUnitKey", ""),
                "rangeEndUnit": range_meta.get("rangeEndUnit", ""),
                "rangeEndUnitOrder": range_meta.get("rangeEndUnitOrder", 999),
                "courseRanges": range_meta.get("courseRanges", []),
                "primaryStandardCourse": range_meta.get("primaryStandardCourse", ""),
            }

    # 2차: 전체 메타 생성
    for filename in all_files:
        meta = parsed_meta_map.get(filename)
        if not meta:
            continue

        file_path = os.path.join(exams_path, filename)
        qcount = extract_qcount_from_js(file_path)
        meta["qCount"] = qcount

        if qcount == 0:
            qcount_failed.append(filename)

        range_meta = extract_range_meta_from_js(file_path, meta, origin_range_map)
        meta.update({k: v for k, v in range_meta.items() if not k.startswith('_')})

        if not range_meta["courseRanges"] and not range_meta["rangeStartUnitKey"]:
            reason = range_meta.get("_rangeReason", "unknown")
            range_failed.append(f"{filename} ({reason})")

        exams_list.append(meta)

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
        if range_failed:
            print(f"⚠️ range 메타 추론 실패({len(range_failed)}개): {range_failed}")

    except Exception as e:
        print(f"❌ 파일 쓰기 실패: {e}")


if __name__ == "__main__":
    build_engine_db()