import os
import json
import re
import sys
import io

# 출력 인코딩 설정 (한글 깨짐 방지)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# --- 설정: APMATH 폴더에서 실행 기준 ---
EXAMS_DIR   = 'exams' 
OUTPUT_FILE = 'db.js'

def parse_filename_refined(filename):
    stem = os.path.splitext(filename)[0]
    parts = stem.split('_')

    # 최소 2토막(연도_이름) 이상은 되어야 분석 가능
    if len(parts) < 2:
        return None

    # 1. 연도 추출 (2자리 -> 4자리 변환)
    year_raw = parts[0]
    year = f"20{year_raw}" if len(year_raw) == 2 and year_raw.isdigit() else year_raw

    # 2. 핵심 키워드 분류를 위한 준비
    school = parts[1]
    grade = ""
    semester = ""
    examType = ""
    subject_parts = []

    # 학년/학기/시험유형 키워드 정의
    grade_pattern = re.compile(r'[중고][123]')
    
    # 3. 나머지 토막들을 순회하며 정보 분류 (Exclusion Logic)
    for p in parts[2:]:
        if grade_pattern.search(p):
            grade = grade_pattern.search(p).group()
        elif '학기' in p:
            semester = p.replace('학기', '').strip()
        elif '중간' in p:
            examType = 'mid'
        elif '기말' in p:
            examType = 'final'
        else:
            # 위 키워드에 해당하지 않는 '유사', '대수', '단항식의계산' 등은 모두 과목/유형으로 병합
            subject_parts.append(p)

    # 4. 기본값 및 예외 처리
    if not examType: examType = "기출" # 중간/기말 표시 없으면 '기출'로 간주
    if not semester: semester = "1"    # 기본 1학기
    subject = "_".join(subject_parts) if subject_parts else "수학"

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
    base_path = os.path.dirname(os.path.abspath(__file__))
    exams_path = os.path.join(base_path, EXAMS_DIR)
    output_path = os.path.join(base_path, OUTPUT_FILE)

    if not os.path.exists(exams_path):
        print(f"❌ 오류: '{exams_path}' 폴더를 찾을 수 없습니다.")
        return

    exams_list = []
    skipped = []

    # 파일 읽기 및 정렬 (파일명 순)
    all_files = sorted([f for f in os.listdir(exams_path) if f.endswith('.js')])

    for f in all_files:
        meta = parse_filename_refined(f)
        if meta:
            exams_list.append(meta)
        else:
            skipped.append(f)

    # JSON 구조 생성
    db_content = {"exams": exams_list}

    # db.js 쓰기
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("window.mainDB = ")
            json.dump(db_content, f, ensure_ascii=False, indent=2)
            f.write(";")
        
        print(f"✅ 동기화 완료: 총 {len(exams_list)}개의 파일을 db.js에 등록했습니다.")
        if skipped:
            print(f"⚠️ 건너뜀({len(skipped)}개): {skipped}")
            
    except Exception as e:
        print(f"❌ 파일 쓰기 실패: {e}")

if __name__ == "__main__":
    build_engine_db()