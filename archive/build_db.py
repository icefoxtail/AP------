import os
import re
import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

EXAMS_DIR = "exams"
OUTPUT_FILE = "db.js"


# =========================================================
# 0. 공통 유틸
# =========================================================
def compact_text(value):
    return re.sub(r"\s+", "", str(value or "")).strip()


def normalize_slash(path):
    return str(path or "").replace("\\", "/")


def normalize_year(value):
    s = str(value or "").strip()
    s = s.replace("년", "")
    if not s:
        return ""
    if s.isdigit():
        n = int(s)
        if 0 <= n <= 99:
            return 2000 + n
        return n
    return ""


def normalize_grade(value):
    v = compact_text(value)
    grade_map = {
        "고등학교1학년": "고1", "고등1학년": "고1", "고등1": "고1", "고1": "고1",
        "고등학교2학년": "고2", "고등2학년": "고2", "고등2": "고2", "고2": "고2",
        "고등학교3학년": "고3", "고등3학년": "고3", "고등3": "고3", "고3": "고3",
        "중학교1학년": "중1", "중등1학년": "중1", "중등1": "중1", "중1": "중1",
        "중학교2학년": "중2", "중등2학년": "중2", "중등2": "중2", "중2": "중2",
        "중학교3학년": "중3", "중등3학년": "중3", "중등3": "중3", "중3": "중3",
    }
    return grade_map.get(v, str(value or "").strip())


def grade_to_folder(grade):
    return {
        "고1": "high/h1",
        "고2": "high/h2",
        "고3": "high/h3",
        "중1": "middle/m1",
        "중2": "middle/m2",
        "중3": "middle/m3",
    }.get(str(grade or "").strip(), "")


def normalize_semester(value, filename=""):
    v = compact_text(value)
    if v in ("1", "1학기"):
        return "1"
    if v in ("2", "2학기"):
        return "2"

    stem = os.path.splitext(os.path.basename(filename))[0]
    if "_1학기_" in stem or stem.startswith("1학기_"):
        return "1"
    if "_2학기_" in stem or stem.startswith("2학기_"):
        return "2"
    return ""


def normalize_exam_type(value, filename=""):
    v = compact_text(value).lower()
    if v in ("mid", "middle", "중간", "중간고사"):
        return "mid"
    if v in ("final", "기말", "기말고사"):
        return "final"

    stem = os.path.splitext(os.path.basename(filename))[0]
    if "_중간_" in stem or stem.startswith("중간_"):
        return "mid"
    if "_기말_" in stem or stem.startswith("기말_"):
        return "final"
    return ""


def exam_type_to_folder(exam_type):
    if exam_type == "mid":
        return "mid"
    if exam_type == "final":
        return "final"
    return ""


def semester_exam_folder(semester, exam_type):
    if not semester or not exam_type:
        return ""
    suffix = exam_type_to_folder(exam_type)
    if not suffix:
        return ""
    return f"{semester}{suffix}"


def strip_suffixes(text):
    t = str(text or "").strip()
    if not t:
        return ""
    t = re.sub(r"_(유형\d*|유사\d*|단원평가유사\d*|단원평가\d*|쪽지\d*|확인\d*|심화\d*)$", "", t)
    t = re.sub(r"(유형\d*|유사\d*|단원평가유사\d*|단원평가\d*|쪽지\d*|확인\d*|심화\d*)$", "", t)
    return t.strip("_").strip()


def detect_content_type(filename, raw_subject="", school=""):
    stem = os.path.splitext(os.path.basename(filename))[0]
    subject_raw = str(raw_subject or "").strip()

    if "단원평가유사" in stem or "단원평가" in stem:
        return "단원평가"
    if "쪽지" in stem:
        return "쪽지"
    if "유형" in stem:
        return "유형"
    if "유사" in stem:
        return "유형"

    if subject_raw in ("단원평가", "단원평가유사"):
        return "단원평가"
    if subject_raw == "쪽지":
        return "쪽지"
    if subject_raw in ("유형", "유사", "확인", "심화"):
        return "유형"
    if subject_raw == "기출":
        return "기출"

    if school:
        return "기출"

    return "유형"


def read_text_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        with open(filepath, "r", encoding="cp949") as f:
            return f.read()


def resolve_project_paths():
    script_dir = Path(__file__).resolve().parent

    if (script_dir / EXAMS_DIR).is_dir():
        archive_dir = script_dir
        exams_path = script_dir / EXAMS_DIR
        output_path = script_dir / OUTPUT_FILE
        return archive_dir, exams_path, output_path

    if (script_dir / "archive" / EXAMS_DIR).is_dir():
        archive_dir = script_dir / "archive"
        exams_path = archive_dir / EXAMS_DIR
        output_path = archive_dir / OUTPUT_FILE
        return archive_dir, exams_path, output_path

    raise FileNotFoundError(
        "exams 폴더를 찾을 수 없습니다. build_db.py는 archive 폴더 또는 AP------ 루트에서 실행하세요."
    )


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
COURSE_BY_ALIAS = {}
UNITS_BY_GRADE = {}

for course in COURSE_TABLES:
    UNITS_BY_GRADE.setdefault(course["grade"], [])
    COURSE_BY_ALIAS[compact_text(course["course_name"])] = course
    for alias in course["aliases"]:
        COURSE_BY_ALIAS[compact_text(alias)] = course

    for unit in course["units"]:
        meta = {
            "key": unit["key"],
            "name": unit["name"],
            "order": unit["order"],
            "grade": course["grade"],
            "course_code": course["course_code"],
            "course_name": course["course_name"],
        }
        UNIT_BY_KEY[unit["key"]] = meta
        UNITS_BY_GRADE[course["grade"]].append(meta)


# =========================================================
# 2. 파일명 파서
# =========================================================
def parse_standard_exam_filename(filename):
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")
    if len(parts) < 2:
        return None

    year_raw = parts[0]
    if not re.fullmatch(r"\d{2,4}", year_raw):
        return None

    school = parts[1].strip()
    year = normalize_year(year_raw)
    grade = ""
    semester = ""
    exam_type = ""
    subject_parts = []

    grade_pattern = re.compile(r"[중고][123]")

    for p in parts[2:]:
        gm = grade_pattern.search(p)
        if gm:
            grade = normalize_grade(gm.group())
        elif "학기" in p:
            semester = normalize_semester(p, base)
        elif "중간" in p:
            exam_type = "mid"
        elif "기말" in p:
            exam_type = "final"
        elif p not in ("기출",):
            subject_parts.append(p)

    raw_subject = "_".join([x for x in subject_parts if x]).strip("_")
    content_type = detect_content_type(base, raw_subject, school)

    subject = ""
    topic = ""

    if content_type == "기출":
        subject = "" if raw_subject in ("", "기출") else raw_subject
    elif content_type == "단원평가":
        topic = "단원평가"
    elif content_type == "쪽지":
        topic = "쪽지"
    elif content_type == "유형":
        topic = strip_suffixes(raw_subject)

    return {
        "file": base,
        "school": school,
        "topic": topic,
        "grade": grade,
        "year": year,
        "semester": semester or normalize_semester("", base),
        "examType": exam_type or normalize_exam_type("", base),
        "subject": subject,
        "contentType": content_type,
    }


def parse_unit_type_filename(filename):
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")
    if len(parts) < 3:
        return None
    if not re.fullmatch(r"[중고][123]", parts[1]):
        return None

    topic = strip_suffixes(parts[0])
    grade = normalize_grade(parts[1])
    tail = "_".join(parts[2:]).strip()

    content_type = "유형"
    if "단원평가" in tail:
        content_type = "단원평가"
    elif "쪽지" in tail:
        content_type = "쪽지"

    return {
        "file": base,
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
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")
    if len(parts) < 4:
        return None
    if parts[0] not in ("1학기", "2학기"):
        return None
    if not re.fullmatch(r"[중고][123]", parts[2]):
        return None

    semester = normalize_semester(parts[0], base)
    eval_name = parts[1].strip()
    grade = normalize_grade(parts[2].strip())
    tail = "_".join(parts[3:]).strip()

    content_type = "유형"
    if "단원평가" in tail:
        content_type = "단원평가"
    elif "쪽지" in tail:
        content_type = "쪽지"

    exam_type = ""
    if "중간" in eval_name:
        exam_type = "mid"
    elif "기말" in eval_name:
        exam_type = "final"

    return {
        "file": base,
        "school": "",
        "topic": eval_name,
        "grade": grade,
        "year": "",
        "semester": semester,
        "examType": exam_type,
        "subject": "",
        "contentType": content_type,
    }


def parse_publisher_unit_type_filename(filename):
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")

    if len(parts) < 5:
        return None

    publisher = parts[0].strip()
    course_name = parts[1].strip()

    if publisher not in ("비상",):
        return None

    grade_idx = -1
    for i, p in enumerate(parts):
        if re.fullmatch(r"[중고][123]", p.strip()):
            grade_idx = i
            break

    if grade_idx == -1 or grade_idx < 3:
        return None

    grade = normalize_grade(parts[grade_idx].strip())
    tail = "_".join(parts[grade_idx + 1:]).strip()

    if "확인" in tail:
        suffix = "유형확인"
        content_type = "유형"
    elif "심화" in tail:
        suffix = "유형심화"
        content_type = "유형"
    elif "단원평가" in tail:
        suffix = "단원평가"
        content_type = "단원평가"
    elif "쪽지" in tail:
        suffix = "쪽지"
        content_type = "쪽지"
    else:
        return None

    middle = parts[2:grade_idx]
    unit_topic = middle[0].strip() if middle else ""
    source_scope = "_".join(middle[1:]).strip("_") if len(middle) >= 2 else ""

    topic_parts = [publisher]
    if unit_topic:
        topic_parts.append(unit_topic)
    if source_scope:
        topic_parts.append(source_scope)
    topic_parts.append(suffix)

    return {
        "file": base,
        "school": publisher,
        "topic": "_".join(topic_parts),
        "grade": grade,
        "year": "",
        "semester": "",
        "examType": "",
        "subject": course_name,
        "contentType": content_type,
    }


def parse_apmath_legacy_filename(filename):
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")
    if len(parts) < 3:
        return None

    if not re.fullmatch(r"\d{2,4}", parts[0]):
        return None
    if parts[1] != "AP수학":
        return None

    year = normalize_year(parts[0])
    school = "AP수학"
    semester = normalize_semester("", base)
    exam_type = normalize_exam_type("", base)
    grade = ""
    tail = []

    for p in parts[2:]:
        gm = re.search(r"[중고][123]", p)
        if gm:
            grade = normalize_grade(gm.group())
        elif "학기" in p:
            semester = normalize_semester(p, base)
        elif "중간" in p or "기말" in p:
            continue
        else:
            tail.append(p)

    raw_subject = "_".join(tail).strip("_")
    content_type = detect_content_type(base, raw_subject, school)
    topic = "중간평가" if "중간평가" in stem else strip_suffixes(raw_subject)

    return {
        "file": base,
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
    base = os.path.basename(filename)
    stem = os.path.splitext(base)[0]
    parts = stem.split("_")
    if len(parts) < 3:
        return None

    if not re.fullmatch(r"\d{2,4}", parts[0]):
        return None
    if parts[1] != "RPM":
        return None

    year = normalize_year(parts[0])
    school = "RPM"
    semester = normalize_semester("", base)
    exam_type = normalize_exam_type("", base)
    grade = ""
    tail = []

    for p in parts[2:]:
        gm = re.search(r"[중고][123]", p)
        if gm:
            grade = normalize_grade(gm.group())
        elif "학기" in p:
            semester = normalize_semester(p, base)
        elif "중간" in p or "기말" in p:
            continue
        else:
            tail.append(p)

    return {
        "file": base,
        "school": school,
        "topic": strip_suffixes("_".join(tail).strip("_")),
        "grade": grade,
        "year": year,
        "semester": semester,
        "examType": exam_type,
        "subject": "",
        "contentType": "유형",
    }


def parse_filename(filename):
    base = os.path.basename(filename)
    for parser in (
        parse_eval_type_filename,
        parse_unit_type_filename,
        parse_apmath_legacy_filename,
        parse_rpm_filename,
        parse_publisher_unit_type_filename,
        parse_standard_exam_filename,
    ):
        meta = parser(base)
        if meta:
            return meta
    return None


# =========================================================
# 3. JS 문항 데이터 추출
# =========================================================
def find_matching_bracket(text, start_idx, open_char="[", close_char="]"):
    depth = 0
    in_single = in_double = in_backtick = False
    in_line_comment = in_block_comment = False
    escape = False

    for i in range(start_idx, len(text)):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""

        if in_line_comment:
            if ch == "\n":
                in_line_comment = False
            continue
        if in_block_comment:
            if ch == "*" and nxt == "/":
                in_block_comment = False
            continue
        if in_single:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_single = False
            continue
        if in_double:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_double = False
            continue
        if in_backtick:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "`":
                in_backtick = False
            continue

        if ch == "/" and nxt == "/":
            in_line_comment = True
            continue
        if ch == "/" and nxt == "*":
            in_block_comment = True
            continue
        if ch == "'":
            in_single = True
            continue
        if ch == '"':
            in_double = True
            continue
        if ch == "`":
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

    in_single = in_double = in_backtick = False
    in_line_comment = in_block_comment = False
    escape = False

    for i, ch in enumerate(array_text):
        nxt = array_text[i + 1] if i + 1 < len(array_text) else ""

        if in_line_comment:
            if ch == "\n":
                in_line_comment = False
            continue
        if in_block_comment:
            if ch == "*" and nxt == "/":
                in_block_comment = False
            continue
        if in_single:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_single = False
            continue
        if in_double:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_double = False
            continue
        if in_backtick:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "`":
                in_backtick = False
            continue

        if ch == "/" and nxt == "/":
            in_line_comment = True
            continue
        if ch == "/" and nxt == "*":
            in_block_comment = True
            continue
        if ch == "'":
            in_single = True
            continue
        if ch == '"':
            in_double = True
            continue
        if ch == "`":
            in_backtick = True
            continue

        if ch == "[":
            depth_bracket += 1
            continue
        if ch == "]":
            depth_bracket -= 1
            continue

        if ch == "{":
            if depth_bracket == 1 and depth_brace == 0:
                count += 1
            depth_brace += 1
            continue
        if ch == "}":
            depth_brace -= 1
            continue

    return count


def extract_question_array_text(text):
    markers = ["window.questionBank", "window.문항데이터", "questionBank"]
    start = -1

    for marker in markers:
        idx = text.find(marker)
        if idx != -1:
            start = idx
            break

    if start == -1:
        return ""

    array_start = text.find("[", start)
    if array_start == -1:
        return ""

    array_end = find_matching_bracket(text, array_start, "[", "]")
    if array_end == -1:
        return ""

    return text[array_start:array_end + 1]


def extract_qcount_from_js(filepath):
    try:
        text = read_text_file(filepath)
    except Exception:
        return 0

    array_text = extract_question_array_text(text)
    if not array_text:
        return 0

    return count_top_level_objects_in_array(array_text)


def extract_standard_unit_keys(text):
    keys = []
    seen = set()
    patterns = [
        r"standardUnitKey\s*:\s*[\"']([^\"']+)[\"']",
        r"\"standardUnitKey\"\s*:\s*\"([^\"]+)\"",
    ]

    for pattern in patterns:
        for raw in re.findall(pattern, text):
            key = raw.strip()
            if not key or key.startswith("RAW-"):
                continue
            if key in UNIT_BY_KEY and key not in seen:
                seen.add(key)
                keys.append(key)

    return keys


def extract_standard_course_names(text):
    names = []
    seen = set()
    patterns = [
        r"standardCourse\s*:\s*[\"']([^\"']+)[\"']",
        r"\"standardCourse\"\s*:\s*\"([^\"]+)\"",
    ]

    for pattern in patterns:
        for raw in re.findall(pattern, text):
            name = raw.strip()
            key = compact_text(name)
            if key and key not in seen:
                seen.add(key)
                names.append(name)

    return names


def extract_standard_unit_names(text):
    names = []
    seen = set()
    patterns = [
        r"standardUnit\s*:\s*[\"']([^\"']+)[\"']",
        r"\"standardUnit\"\s*:\s*\"([^\"]+)\"",
    ]

    for pattern in patterns:
        for raw in re.findall(pattern, text):
            name = raw.strip()
            key = compact_text(name)
            if key and key not in seen:
                seen.add(key)
                names.append(name)

    return names


# =========================================================
# 4. range/courseRanges 구성
# =========================================================
def make_empty_range(reason="unresolved"):
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


def dedupe_units(units):
    result = []
    seen = set()
    for u in units:
        if not u:
            continue
        if u["key"] in seen:
            continue
        seen.add(u["key"])
        result.append(u)
    return result


def build_course_ranges_from_units(units):
    grouped = {}
    for unit in units:
        grouped.setdefault(unit["course_code"], []).append(unit)

    ranges = []
    for _, arr in grouped.items():
        arr = sorted(arr, key=lambda x: x["order"])
        s = arr[0]
        e = arr[-1]
        ranges.append({
            "standardCourse": s["course_name"],
            "courseCode": s["course_code"],
            "rangeStartUnitKey": s["key"],
            "rangeStartUnit": s["name"],
            "rangeStartUnitOrder": s["order"],
            "rangeEndUnitKey": e["key"],
            "rangeEndUnit": e["name"],
            "rangeEndUnitOrder": e["order"],
        })

    ranges.sort(key=lambda x: (x["standardCourse"], x["rangeStartUnitOrder"], x["rangeEndUnitOrder"]))
    return ranges


def build_range_payload(units, reason, meta):
    units = dedupe_units(units)
    if not units:
        return make_empty_range(reason)

    course_ranges = build_course_ranges_from_units(units)

    if meta.get("grade", "").startswith("중") or len(course_ranges) == 1:
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

    return {
        "rangeStartUnitKey": "",
        "rangeStartUnit": "",
        "rangeStartUnitOrder": 999,
        "rangeEndUnitKey": "",
        "rangeEndUnit": "",
        "rangeEndUnitOrder": 999,
        "courseRanges": course_ranges,
        "primaryStandardCourse": "",
        "_rangeReason": "multi_course_exam",
    }


def resolve_units_from_names(unit_names, grade):
    resolved = []

    for unit_name in unit_names:
        unit_compact = compact_text(unit_name)
        if not unit_compact:
            continue

        for unit in UNITS_BY_GRADE.get(grade, []):
            name_compact = compact_text(unit["name"])
            if unit_compact == name_compact or unit_compact in name_compact or name_compact in unit_compact:
                resolved.append(unit)
                break

    return dedupe_units(resolved)


def resolve_units_from_topic(topic, grade):
    topic_compact = compact_text(strip_suffixes(topic))
    if not topic_compact:
        return []

    aliases = {
        "일차방정식활용": "문자와 식",
        "유리수와순환소수": "수와 식",
        "단항식의계산": "수와 식",
        "제곱근과실수": "실수와 그 계산",
        "항등식과나머지정리": "항등식과 나머지 정리",
        "복소수": "복소수와 이차방정식",
        "이차방정식": "복소수와 이차방정식",
        "이차함수": "이차방정식과 이차함수",
        "경우의수": "합의 법칙과 곱의 법칙",
        "순열과조합": "순열과 조합",
        "행렬": "행렬과 그 연산",
        "등차수열": "등차수열과 등비수열",
        "등비수열": "등차수열과 등비수열",
        "순열": "순열과 조합",
        "조합": "순열과 조합",
        "확률의뜻과활용": "확률의 뜻과 활용",
        "확률의개념과활용": "확률의 뜻과 활용",
        "미분계수와도함수": "도함수",
        "벡터": "벡터의 연산",
        "지수로그": "지수와 로그",
        "지수로그함수": "지수와 로그",
        "삼각함수": "삼각함수",
        "사인코사인법칙": "사인법칙과 코사인법칙",
    }

    target = aliases.get(topic_compact, topic_compact)

    for unit in UNITS_BY_GRADE.get(grade, []):
        unit_compact = compact_text(unit["name"])
        if target == unit_compact or target in unit_compact or unit_compact in target:
            return [unit]

    return []


def is_exam_similar_file(filename):
    stem = os.path.splitext(os.path.basename(filename))[0]
    return bool(re.fullmatch(r"\d{2,4}_.+_[12]학기_(중간|기말)_[중고][123]_유사\d*", stem))


def build_origin_exam_filename(filename):
    stem = os.path.splitext(os.path.basename(filename))[0]
    origin_stem = re.sub(r"_유사\d*$", "_기출", stem)
    return origin_stem + ".js"


def extract_range_meta_from_js(filepath, meta, origin_range_map=None):
    filename = os.path.basename(filepath)

    if is_exam_similar_file(filename) and origin_range_map:
        origin_file = build_origin_exam_filename(filename)
        inherited = origin_range_map.get(origin_file)
        if inherited and (inherited.get("courseRanges") or inherited.get("rangeStartUnitKey")):
            copied = json.loads(json.dumps(inherited, ensure_ascii=False))
            copied["_rangeReason"] = "inherit_from_origin_exam"
            return copied

    try:
        text = read_text_file(filepath)
    except Exception:
        return make_empty_range("file_read_fail")

    raw_keys = extract_standard_unit_keys(text)
    units_by_key = dedupe_units([UNIT_BY_KEY.get(k) for k in raw_keys])

    if units_by_key:
        return build_range_payload(units_by_key, "question_keys", meta)

    unit_names = extract_standard_unit_names(text)
    units_by_name = resolve_units_from_names(unit_names, meta.get("grade", ""))

    if units_by_name:
        return build_range_payload(units_by_name, "unit_name_match", meta)

    topic_units = resolve_units_from_topic(meta.get("topic", ""), meta.get("grade", ""))

    if topic_units:
        return build_range_payload(topic_units, "topic_alias_fallback", meta)

    return make_empty_range("unresolved")


# =========================================================
# 5. 하위 폴더 스캔 / 경로 분류
# =========================================================
def collect_js_files_recursive(exams_path):
    results = []

    for path in exams_path.rglob("*.js"):
        if not path.is_file():
            continue

        rel_path = normalize_slash(path.relative_to(exams_path))
        name = path.name

        if name.lower() in ("db.js", "concept_map.js"):
            continue

        results.append({
            "abs_path": path,
            "rel_path": rel_path,
            "filename": name,
        })

    results.sort(key=lambda x: x["rel_path"])
    return results


def is_already_classified_relpath(rel_path):
    first = normalize_slash(rel_path).split("/")[0]
    return first in ("original", "similar", "types")


def infer_folder_relpath(meta):
    grade_folder = grade_to_folder(meta.get("grade", ""))

    if meta.get("contentType") == "기출":
        term_folder = semester_exam_folder(meta.get("semester", ""), meta.get("examType", ""))
        if grade_folder and term_folder:
            return normalize_slash(f"original/{grade_folder}/{term_folder}/{os.path.basename(meta.get('file', ''))}")
        if grade_folder:
            return normalize_slash(f"original/{grade_folder}/unsorted/{os.path.basename(meta.get('file', ''))}")
        return normalize_slash(f"original/unsorted/{os.path.basename(meta.get('file', ''))}")

    if meta.get("contentType") in ("단원평가", "쪽지"):
        term_folder = semester_exam_folder(meta.get("semester", ""), meta.get("examType", ""))
        if grade_folder and term_folder:
            return normalize_slash(f"similar/{grade_folder}/{term_folder}/{os.path.basename(meta.get('file', ''))}")
        if grade_folder:
            return normalize_slash(f"similar/{grade_folder}/unsorted/{os.path.basename(meta.get('file', ''))}")
        return normalize_slash(f"similar/unsorted/{os.path.basename(meta.get('file', ''))}")

    if meta.get("contentType") == "유형":
        if grade_folder:
            return normalize_slash(f"types/{grade_folder}/{os.path.basename(meta.get('file', ''))}")
        return normalize_slash(f"types/unsorted/{os.path.basename(meta.get('file', ''))}")

    if grade_folder:
        return normalize_slash(f"types/{grade_folder}/{os.path.basename(meta.get('file', ''))}")
    return normalize_slash(f"types/unsorted/{os.path.basename(meta.get('file', ''))}")


def normalize_meta_file_path(meta, rel_path):
    rel_path = normalize_slash(rel_path)
    filename = os.path.basename(rel_path)

    if is_already_classified_relpath(rel_path):
        meta["file"] = rel_path
    else:
        meta["file"] = infer_folder_relpath({**meta, "file": filename})

    return meta


# =========================================================
# 6. 정렬/검증/빌드
# =========================================================
def sort_key(item):
    grade_order = {"고3": 0, "고2": 1, "고1": 2, "중3": 3, "중2": 4, "중1": 5}
    type_order = {"기출": 0, "단원평가": 1, "쪽지": 2, "유형": 3}
    year = item.get("year")
    year_key = int(year) if isinstance(year, int) else -1
    return (
        -year_key,
        grade_order.get(item.get("grade", ""), 99),
        type_order.get(item.get("contentType", ""), 99),
        item.get("school", ""),
        item.get("examType", ""),
        item.get("subject", ""),
        item.get("topic", ""),
        item.get("file", "")
    )


def validate_db_js_content(content):
    bad_patterns = [
        r'"연도"\s*:',
        r'"학교"\s*:',
        r'"시험"\s*:',
        r'\d{2,4}년\s*,',
        r'window\.mainDB\s*=\s*\{\s*"시험"',
        r'"file"\s*:\s*"exams/',
        r'"file"\s*:\s*"\\',
    ]

    for pattern in bad_patterns:
        if re.search(pattern, content):
            raise ValueError(f"금지 패턴 검출: {pattern}")

    if '"exams"' not in content:
        raise ValueError('window.mainDB.exams 구조가 없습니다.')


def build_engine_db():
    try:
        archive_dir, exams_path, output_path = resolve_project_paths()
    except Exception as e:
        print(f"❌ 오류: {e}")
        return

    if not exams_path.exists():
        print(f"❌ 오류: '{exams_path}' 폴더를 찾을 수 없습니다.")
        return

    all_files = collect_js_files_recursive(exams_path)

    exams_list = []
    skipped = []
    qcount_failed = []
    range_failed = []

    parsed_meta_map = {}

    for file_info in all_files:
        filename = file_info["filename"]
        rel_path = file_info["rel_path"]

        meta = parse_filename(filename)
        if meta and meta.get("file"):
            meta = normalize_meta_file_path(meta, rel_path)
            parsed_meta_map[rel_path] = meta
        else:
            skipped.append(rel_path)

    origin_range_map = {}

    for file_info in all_files:
        rel_path = file_info["rel_path"]
        filename = file_info["filename"]
        meta = parsed_meta_map.get(rel_path)

        if not meta or meta.get("contentType") != "기출":
            continue

        filepath = file_info["abs_path"]
        range_meta = extract_range_meta_from_js(filepath, meta, origin_range_map={})

        if range_meta.get("courseRanges") or range_meta.get("rangeStartUnitKey"):
            payload = {
                "rangeStartUnitKey": range_meta.get("rangeStartUnitKey", ""),
                "rangeStartUnit": range_meta.get("rangeStartUnit", ""),
                "rangeStartUnitOrder": range_meta.get("rangeStartUnitOrder", 999),
                "rangeEndUnitKey": range_meta.get("rangeEndUnitKey", ""),
                "rangeEndUnit": range_meta.get("rangeEndUnit", ""),
                "rangeEndUnitOrder": range_meta.get("rangeEndUnitOrder", 999),
                "courseRanges": range_meta.get("courseRanges", []),
                "primaryStandardCourse": range_meta.get("primaryStandardCourse", ""),
            }

            origin_range_map[filename] = payload
            origin_range_map[os.path.basename(meta.get("file", filename))] = payload

    for file_info in all_files:
        rel_path = file_info["rel_path"]
        meta = parsed_meta_map.get(rel_path)
        if not meta:
            continue

        filepath = file_info["abs_path"]
        qcount = extract_qcount_from_js(filepath)
        meta["qCount"] = qcount

        if qcount == 0:
            qcount_failed.append(rel_path)

        range_meta = extract_range_meta_from_js(filepath, meta, origin_range_map)
        meta.update({k: v for k, v in range_meta.items() if not k.startswith("_")})

        if not range_meta.get("courseRanges") and not range_meta.get("rangeStartUnitKey"):
            range_failed.append(f'{rel_path} ({range_meta.get("_rangeReason", "unknown")})')

        exams_list.append(meta)

    exams_list.sort(key=sort_key)

    db_content = {"exams": exams_list}

    output_text = "window.mainDB = "
    output_text += json.dumps(db_content, ensure_ascii=False, indent=2)
    output_text += ";\n"

    validate_db_js_content(output_text)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_text)

    print(f"✅ db.js 생성 완료: 총 {len(exams_list)}개 파일 등록")
    print(f"✅ archive 기준 위치: {archive_dir}")
    print(f"✅ exams 기준 위치: {exams_path}")
    print(f"✅ db.js 출력 위치: {output_path}")
    print("✅ 출력 구조: window.mainDB.exams")
    print("✅ file 경로: exams/ 제외, exams 내부 상대경로")
    print("✅ 하위 폴더 스캔: original / similar / types 포함")
    print("✅ 유형 폴더 학년 구분 대응: types/high/h1~h3, types/middle/m1~m3")
    print("✅ 금지 구조 검사 통과: \"시험\", \"연도\", \"학교\", 2026년 패턴, file: exams/ 없음")

    if skipped:
        print(f"⚠️ 파일명 규칙 미매칭으로 건너뜀({len(skipped)}개):")
        for x in skipped:
            print("  -", x)

    if qcount_failed:
        print(f"⚠️ qCount 추출 실패 또는 0개({len(qcount_failed)}개):")
        for x in qcount_failed:
            print("  -", x)

    if range_failed:
        print(f"⚠️ range 메타 추론 실패({len(range_failed)}개):")
        for x in range_failed:
            print("  -", x)


if __name__ == "__main__":
    build_engine_db()