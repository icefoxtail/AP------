# make_jsarchive_exam_folders.py
# 실행 위치: AP------ 프로젝트 루트

from pathlib import Path

BASE_DIR = Path("exams")

TYPES = ["original", "similar"]
SCHOOLS = {
    "high": ["h1", "h2", "h3"],
    "middle": ["m1", "m2", "m3"],
}
TERMS = ["1mid", "1final", "2mid", "2final"]

def main():
    created = []
    existed = []

    for content_type in TYPES:
        for school_level, grades in SCHOOLS.items():
            for grade in grades:
                for term in TERMS:
                    folder = BASE_DIR / content_type / school_level / grade / term
                    if folder.exists():
                        existed.append(str(folder).replace("\\", "/"))
                    else:
                        folder.mkdir(parents=True, exist_ok=True)
                        created.append(str(folder).replace("\\", "/"))

    print("JS아카이브 exams 폴더 구조 생성 완료")
    print(f"새로 생성: {len(created)}개")
    print(f"이미 존재: {len(existed)}개")

    print("\n[생성/확인된 최종 구조]")
    for content_type in TYPES:
        for school_level, grades in SCHOOLS.items():
            for grade in grades:
                for term in TERMS:
                    print(str(BASE_DIR / content_type / school_level / grade / term).replace("\\", "/"))

if __name__ == "__main__":
    main()