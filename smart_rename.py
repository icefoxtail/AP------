import os
import re

def suncheon_smart_rename():
    # 터미널 위치가 'AP수학아카이브'여야 함
    path = "pdf_archive"
    # 패턴: 연도_학교학년_과목_학기시험[_해설].pdf
    pattern = re.compile(r"(\d{4})_(.+?)([123])_(.+?)_([12])(중간|기말)(_해설)?\.pdf")

    if not os.path.exists(path):
        print(f"오류: {path} 폴더를 찾을 수 없습니다. cd .. 를 입력해 보세요.")
        return

    print("--- [A안] 파일명 정밀 교정 시작 ---")
    count = 0
    for filename in sorted(os.listdir(path)):
        if not filename.endswith(".pdf"): continue
        match = pattern.match(filename)
        if match:
            year, school, grade_num, subject, sem, exam_type, is_sol = match.groups()
            full_grade = f"고{grade_num}"
            full_exam = f"{sem}학기{exam_type}"
            
            if is_sol:
                # [A안] 해설지는 과목(subject)을 제거: 연도_학교_학년_시험_해설.pdf
                new_name = f"{year}_{school}_{full_grade}_{full_exam}_해설.pdf"
            else:
                # [A안] 문제지는 과목 포함: 연도_학교_학년_과목_시험.pdf
                new_name = f"{year}_{school}_{full_grade}_{subject}_{full_exam}.pdf"
            
            if filename != new_name:
                os.rename(os.path.join(path, filename), os.path.join(path, new_name))
                print(f"[교정] {filename} -> {new_name}")
                count += 1
    print(f"✅ 총 {count}개 교정 완료. 이제 R2에 던지시면 됩니다.")

if __name__ == "__main__":
    suncheon_smart_rename()