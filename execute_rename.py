import os
import csv
import shutil

def execute_rename():
    input_csv = "analysis_report.csv"
    output_dir = "ready_for_r2"
    
    if not os.path.exists(input_csv):
        print(f"오류: {input_csv} 파일이 없습니다. 분석기를 먼저 실행해주세요.")
        return

    # 1. 출력 폴더 생성
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"--- '{output_dir}' 폴더를 생성했습니다. ---")

    print("--- 파일 복사 및 이름 변경 시작 ---")
    
    success_count = 0
    fail_count = 0
    collision_count = 0

    with open(input_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            old_path = row['Original_Path']
            new_name = row['Predicted_Name']
            
            # 파일이 실제로 존재하는지 확인
            if not os.path.exists(old_path):
                print(f"[실패] 파일을 찾을 수 없음: {old_path}")
                fail_count += 1
                continue

            # 대상 경로 설정
            target_path = os.path.join(output_dir, new_name)

            # [중요] 이름 충돌 방지: 같은 이름이 이미 있다면 (1), (2) 등을 붙임
            if os.path.exists(target_path):
                base, ext = os.path.splitext(new_name)
                counter = 1
                while os.path.exists(os.path.join(output_dir, f"{base}({counter}){ext}")):
                    counter += 1
                new_name = f"{base}({counter}){ext}"
                target_path = os.path.join(output_dir, new_name)
                collision_count += 1

            try:
                # 파일 복사 (원본 보존을 위해 copy2 사용)
                shutil.copy2(old_path, target_path)
                success_count += 1
                if success_count % 100 == 0:
                    print(f"진행 중... {success_count}개 완료")
            except Exception as e:
                print(f"[에러] {old_path} 작업 중 오류: {e}")
                fail_count += 1

    print("\n" + "="*40)
    print(f"✅ 작업 완료!")
    print(f"   - 성공: {success_count}개")
    print(f"   - 충돌(이름중복): {collision_count}개")
    print(f"   - 실패: {fail_count}개")
    print(f"📂 모든 파일이 '{output_dir}' 폴더에 모였습니다.")
    print("="*40)

if __name__ == "__main__":
    execute_rename()