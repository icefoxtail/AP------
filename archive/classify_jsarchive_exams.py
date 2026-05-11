# classify_jsarchive_exams.py
# 저장 위치: C:\Users\USER\Desktop\AP------\archive\classify_jsarchive_exams.py
# 목적: archive/exams 루트에 남아 있는 JS 파일을 original / similar / types 하위 폴더로 자동 분류 이동

from pathlib import Path
import re
import shutil
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent
EXAMS_DIR = ROOT / "exams"

GRADE_FOLDER = {
    "고1": "high/h1",
    "고2": "high/h2",
    "고3": "high/h3",
    "중1": "middle/m1",
    "중2": "middle/m2",
    "중3": "middle/m3",
}

TERM_FOLDER = {
    ("1", "mid"): "1mid",
    ("1", "final"): "1final",
    ("2", "mid"): "2mid",
    ("2", "final"): "2final",
}

CLASSIFIED_ROOTS = {"original", "similar", "types"}


def normalize_year(raw: str):
    s = str(raw or "").strip().replace("년", "")
    if not s.isdigit():
        return ""
    n = int(s)
    if 0 <= n <= 99:
        return 2000 + n
    return n


def detect_grade(name: str):
    m = re.search(r"[중고][123]", name)
    return m.group(0) if m else ""


def detect_semester(name: str):
    if "1학기" in name:
        return "1"
    if "2학기" in name:
        return "2"
    return ""


def detect_exam_type(name: str):
    if "중간" in name:
        return "mid"
    if "기말" in name:
        return "final"
    return ""


def detect_content_group(filename: str):
    stem = Path(filename).stem

    # 학교 기출 원본
    if re.match(r"^\d{2,4}_.+_[12]학기_(중간|기말)_[중고][123]_기출$", stem):
        return "original"

    # 학교 기출 기반 유사
    if re.match(r"^\d{2,4}_.+_[12]학기_(중간|기말)_[중고][123]_유사\d*$", stem):
        return "similar"

    # 단원평가 / 단원평가유사 / 쪽지 등 시험형 자료
    if "단원평가" in stem or "쪽지" in stem:
        return "similar"

    # 단원별/교재별 유형
    if "유형" in stem or "확인" in stem or "심화" in stem:
        return "types"

    # 비상/RPM/AP수학 등 교재·자체 유형형 자료
    if stem.startswith("비상_") or "_RPM_" in stem or "_AP수학_" in stem:
        return "types"

    # 학교명과 연도가 있으면 기본은 original
    if re.match(r"^\d{2,4}_.+_", stem):
        return "original"

    return "types"


def infer_target_relative_path(filename: str):
    stem = Path(filename).stem
    group = detect_content_group(filename)
    grade = detect_grade(stem)
    semester = detect_semester(stem)
    exam_type = detect_exam_type(stem)

    grade_folder = GRADE_FOLDER.get(grade, "")
    term_folder = TERM_FOLDER.get((semester, exam_type), "")

    if group in ("original", "similar"):
        if grade_folder and term_folder:
            return Path(group) / grade_folder / term_folder / filename
        if grade_folder:
            return Path(group) / grade_folder / "unsorted" / filename
        return Path(group) / "unsorted" / filename

    if group == "types":
        if grade_folder:
            return Path("types") / grade_folder / filename
        return Path("types") / "unsorted" / filename

    return Path("types") / "unsorted" / filename


def is_root_js_file(path: Path):
    if not path.is_file():
        return False
    if path.suffix.lower() != ".js":
        return False
    if path.name in {"db.js", "concept_map.js"}:
        return False
    if path.parent != EXAMS_DIR:
        return False
    return True


def safe_move(src: Path, dst: Path):
    dst.parent.mkdir(parents=True, exist_ok=True)

    if dst.exists():
        if src.read_bytes() == dst.read_bytes():
            src.unlink()
            return "DUPLICATE_REMOVED"
        raise FileExistsError(f"대상 파일이 이미 존재하고 내용이 다릅니다: {dst}")

    shutil.move(str(src), str(dst))
    return "MOVED"


def main():
    if not EXAMS_DIR.exists():
        raise SystemExit(f"exams 폴더를 찾을 수 없습니다: {EXAMS_DIR}")

    root_files = sorted([p for p in EXAMS_DIR.iterdir() if is_root_js_file(p)], key=lambda p: p.name)

    if not root_files:
        print("분류할 루트 JS 파일이 없습니다.")
        return

    moved = []
    duplicate_removed = []
    failed = []

    print(f"분류 대상 JS 파일: {len(root_files)}개")
    print()

    for src in root_files:
        rel_target = infer_target_relative_path(src.name)
        dst = EXAMS_DIR / rel_target

        try:
            result = safe_move(src, dst)
            if result == "MOVED":
                moved.append((src.name, str(rel_target).replace("\\", "/")))
                print(f"이동: {src.name} -> {str(rel_target).replace('\\', '/')}")
            elif result == "DUPLICATE_REMOVED":
                duplicate_removed.append(src.name)
                print(f"중복 삭제: {src.name}")
        except Exception as e:
            failed.append((src.name, str(rel_target).replace("\\", "/"), str(e)))
            print(f"실패: {src.name} -> {str(rel_target).replace('\\', '/')}")
            print(f"  사유: {e}")

    print()
    print("분류 완료")
    print(f"이동 완료: {len(moved)}개")
    print(f"중복 삭제: {len(duplicate_removed)}개")
    print(f"실패: {len(failed)}개")

    if failed:
        print()
        print("[실패 목록]")
        for name, target, reason in failed:
            print(f"- {name} -> {target}")
            print(f"  {reason}")
        raise SystemExit(1)

    print()
    print("다음 명령으로 db.js 재생성:")
    print("python build_db.py")


if __name__ == "__main__":
    main()