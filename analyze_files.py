import os
import re
import csv

def analyze_files_v2():
    base_path = "pdf_archive"
    output_file = "analysis_report.csv"
    
    # 제거할 단원명 및 불필요한 태그 목록
    trash_keywords = [
        "이차함수", "삼각함수", "다항식", "방정식", "부등식", "확률", "통계", 
        "행렬", "지수", "로그", "수열", "극한", "미분", "적분", "집합", "명제",
        "주관식", "객관식", "단답형", "문제및정답", "문제및해설"
    ]

    # 해설지 판별 키워드
    sol_keywords = ["정답", "해설", "풀이", "답지", "답"]

    results = []

    for root, dirs, files in os.walk(base_path):
        for filename in files:
            if not filename.lower().endswith(".pdf"): continue
            
            full_path = os.path.join(root, filename)
            name_only = os.path.splitext(filename)[0]
            
            # 0. 불필요한 태그 및 단원명 삭제
            clean_name = name_only
            for kw in trash_keywords:
                clean_name = clean_name.replace(kw, "")
            clean_name = clean_name.replace("__", "_").strip("_")

            # 1. 연도 추출 (4자리 숫자)
            year_match = re.search(r"(\d{4})", clean_name)
            year = year_match.group(1) if year_match else "0000"

            # 2. 학교, 학년, 학과 처리 (공고1전 등 포함)
            # 패턴: [가-힣]+ + 숫자 + [가-힣](학과) 또는 그냥 숫자
            school = "미상학교"
            grade = "미상학년"
            
            # 특수 케이스: 공고1전, 공고1토 등 (학교+학년+학과를 학교명으로 취급)
            spec_match = re.search(r"([가-힣]*공고\d[가-힣])", clean_name)
            if spec_match:
                school = spec_match.group(1)
                # 학과는 학교명에 넣었으니 학년은 숫자에서 추출
                grade_num = re.search(r"\d", school).group()
                grade = f"고{grade_num}"
            else:
                # 일반 케이스: 연향중2 -> 학교: 연향중, 학년: 중2
                sg_match = re.search(r"([가-힣]+)([123])", clean_name)
                if sg_match:
                    school_name = sg_match.group(1)
                    grade_num = sg_match.group(2)
                    grade_type = "고" if "고" in school_name or "고등" in root else "중"
                    school = school_name
                    grade = f"{grade_type}{grade_num}"

            # 3. 시험 정보 추출 (1학기 중간, 1중, 2기 등)
            exam = "미상시험"
            exam_match = re.search(r"([12])\s*(?:학기)?\s*(중간|기말|중|기)", clean_name)
            if exam_match:
                sem, etype = exam_match.groups()
                etype = "중간" if "중" in etype else "기말"
                exam = f"{sem}학기{etype}"

            # 4. 해설지 여부 확인
            is_sol = any(kw in name_only for kw in sol_keywords)

            # 5. 과목 추출 (기본값 수학, 특수과목 우선)
            subject = "수학"
            for sub in ["확통", "미적", "기하", "수1", "수2", "경제수학"]:
                if sub in clean_name:
                    subject = sub
                    break

            # 6. A안 최종 규칙 적용
            if is_sol:
                # 해설지: 연도_학교_학년_시험_해설 (4단)
                predicted = f"{year}_{school}_{grade}_{exam}_해설.pdf"
            else:
                # 문제지: 연도_학교_학년_과목_시험 (5단)
                predicted = f"{year}_{school}_{grade}_{subject}_{exam}.pdf"

            results.append({
                "Original_Path": full_path,
                "Original_Name": filename,
                "Predicted_Name": predicted,
                "Status": "OK" if "미상" not in (school+grade+exam) else "Check"
            })

    with open(output_file, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["Original_Path", "Original_Name", "Predicted_Name", "Status"])
        writer.writeheader()
        writer.writerows(results)

    print(f"✅ V2 분석 완료: '{output_file}' 확인 부탁드립니다.")

if __name__ == "__main__":
    analyze_files_v2()