import os
from pdf2image import convert_from_path

# --- 경로 설정 ---
POPPLER_PATH = r'C:\poppler\Library\bin' 
INPUT_DIR = r'C:\Users\USER\Desktop\APMATH\AP\ready_for_r2'
OUTPUT_DIR = r'C:\Users\USER\Desktop\APMATH\AP\data\images'

os.makedirs(OUTPUT_DIR, exist_ok=True)

def run_selective_conversion():
    # 모든 파일 가져오기
    all_files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.pdf')]
    
    # 필터링 조건: '1중간' 포함 AND ('해설지'/'정답' 제외)
    target_files = [
        f for f in all_files 
        if "1중간" in f and "해설" not in f and "정답" not in f
    ]
    
    total = len(target_files)
    
    if total == 0:
        print("보고: 조건에 맞는 '문제지' 파일을 찾을 수 없습니다.")
        return

    print(f"보고: 총 {len(all_files)}개 중 1학기 중간고사 '문제지' {total}개만 선별 변환합니다.")

    for idx, filename in enumerate(target_files, 1):
        school_name = os.path.splitext(filename)[0]
        pdf_path = os.path.join(INPUT_DIR, filename)
        
        try:
            pages = convert_from_path(
                pdf_path, 
                dpi=400, 
                poppler_path=POPPLER_PATH,
                fmt='png'
            )
            
            for i, page in enumerate(pages):
                save_path = os.path.join(OUTPUT_DIR, f"{school_name}_p{i+1}.png")
                page.save(save_path, 'PNG')
            
            print(f"[{idx}/{total}] 변환 성공: {school_name}")
            
        except Exception as e:
            print(f"[{idx}/{total}] 실패: {school_name} - {str(e)}")

if __name__ == "__main__":
    run_selective_conversion()