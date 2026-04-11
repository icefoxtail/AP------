import os
import csv
import shutil

# [1] 원장님 집 컴퓨터 절대 경로 (고정)
BASE_DIR = r"C:\Users\USER\Desktop\APMATH\AP"
PDF_ROOT = os.path.join(BASE_DIR, "pdf_archive")
CSV_FILE = os.path.join(BASE_DIR, "AP수학_파일명분류_사전보고서.csv")
# 목적지를 pdf_archive 외부로 명확히 분리
OUTPUT_DIR = os.path.join(BASE_DIR, "ready_for_r2")

def ironclad_rename_v10():
    # [2] 원장님 제안: 목적지 루트 폴더 생성
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if not os.path.exists(CSV_FILE):
        print(f"❌ 지시서(CSV) 누락: {CSV_FILE}")
        return

    # [3] 물리 파일 전수조사 (이름 -> 절대경로 매핑)
    print("🔍 파일 시스템 정밀 스캔 중...")
    file_map = {}
    for root, dirs, files in os.walk(PDF_ROOT):
        # 복사될 폴더가 원본 폴더 안에 있을 경우를 대비한 방어 로직
        if "ready_for_r2" in root: continue 
        for f in files:
            clean_name = f.strip().lower()
            file_map[clean_name] = os.path.abspath(os.path.join(root, f))

    print(f"📂 실제 물리 파일 {len(file_map)}개 확인 완료.")

    success, fail = 0, 0
    with open(CSV_FILE, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            old_name = row['원본파일명'].strip().lower()
            new_name = row['제안파일명'].strip()
            
            if old_name in file_map:
                src = file_map[old_name]
                # [4] 핵심: 목적지 경로도 절대경로화
                dst = os.path.abspath(os.path.join(OUTPUT_DIR, new_name))
                
                # [5] 원장님 묘수: 목적지 디렉토리가 없으면 강제로 만듦 (WinError 3 박멸)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                
                # 중복 파일명 처리 (번호 부여)
                if os.path.exists(dst):
                    name_part, ext_part = os.path.splitext(new_name)
                    c = 1
                    while os.path.exists(os.path.join(OUTPUT_DIR, f"{name_part}({c}){ext_part}")):
                        c += 1
                    dst = os.path.join(OUTPUT_DIR, f"{name_part}({c}){ext_part}")

                try:
                    # [6] 복사 실행
                    shutil.copy2(src, dst)
                    success += 1
                except Exception as e:
                    print(f"❌ 복사 실패 ({old_name}): {e}")
                    fail += 1
            else:
                fail += 1

    print("\n" + "="*40)
    print(f"✅ [MASTER IRONCLAD v10.0] 작업 완료")
    print(f" - 복사 성공: {success}건")
    print(f" - 매칭 실패: {fail}건")
    print(f"📂 결과물 위치: {OUTPUT_DIR}")
    print("="*40)

if __name__ == "__main__":
    ironclad_rename_v10()