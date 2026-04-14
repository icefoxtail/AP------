import os
import re

def fix_js_files():
    # 타겟 폴더를 exams로 지정
    target_dir = './exams'
    
    # exams 폴더가 있는지 확인
    if not os.path.exists(target_dir):
        print("exams 폴더를 찾을 수 없습니다. 폴더 위치를 확인해주세요.")
        return

    count = 0
    for file in os.listdir(target_dir):
        if file.endswith('.js'):
            filepath = os.path.join(target_dir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = f.read()
            
            # 1. 단일 백슬래시(\)를 이중 백슬래시(\\)로 변환 (이미 \\인 경우 제외)
            data = re.sub(r'(?<!\\)\\(?!\\)', r'\\\\', data)
            
            # 2. 서술형 빈 choices 배열 제거
            data = re.sub(r'\s*"choices":\s*\[(\s*"\s*",?)*\s*\],?', '', data)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(data)
            count += 1
            
    print(f"완료! exams 폴더 안의 총 {count}개 JS 파일이 성공적으로 수정되었습니다.")

if __name__ == '__main__':
    fix_js_files()