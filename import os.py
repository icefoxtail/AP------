import os
import re
import json

# --- 확정된 폴더 구조 설정 (APMATH 기준) ---
DB_FILE = 'db.js'       # 현재 폴더(APMATH)에 위치한 db.js
TARGET_FOLDER = 'exams' # 하위 폴더인 exams 내부의 js 파일들을 타겟으로 함

def run_perfect_sync():
    # 1. 절대 경로 확보 (실행 환경에 따른 경로 오류 원천 차단)
    base_path = os.path.dirname(os.path.abspath(__file__))
    db_full_path = os.path.join(base_path, DB_FILE)
    exams_dir = os.path.join(base_path, TARGET_FOLDER)

    if not os.path.exists(db_full_path):
        print(f"❌ 오류: '{db_full_path}' 경로에 db.js가 없습니다.")
        return

    if not os.path.exists(exams_dir):
        print(f"❌ 오류: '{exams_dir}' 폴더가 없습니다.")
        return

    # 2. DB 로드 및 파싱
    try:
        with open(db_full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'window\.mainDB\s*=\s*(\{.*?\});', content, re.DOTALL)
        exams_data = json.loads(match.group(1))['exams']
    except Exception as e:
        print(f"❌ DB 로드 실패: {e}")
        return

    print("📊 DB 로드 완료 및 정밀 동기화 시작 (동적 필터 적용)...")
    print("-" * 65)

    change_count = 0

    # 3. 정밀 파일명 교차 검증 및 수정
    for item in exams_data:
        master_name = item['file']     
        t_school = item['school']      
        t_year = item['year'][-2:]     
        t_subject = item['subject']    # DB에서 과목/유형 속성을 직접 로드
        
        current_files = [f for f in os.listdir(exams_dir) if f.endswith('.js')]

        for f in current_files:
            # 기본 포함 검사: 연도와 학교명 (예: '제일고1', '금당중2' 등 모두 통과)
            if t_year in f and t_school in f:
                
                # 다중 교차 필터링: 양쪽 파일명의 핵심 속성 일치 여부 1:1 대조
                if ('중간' in master_name) != ('중간' in f): continue
                if ('기말' in master_name) != ('기말' in f): continue
                
                if ('고1' in master_name) != ('고1' in f): continue
                if ('고2' in master_name) != ('고2' in f): continue
                if ('중2' in master_name) != ('중2' in f): continue
                if ('중3' in master_name) != ('중3' in f): continue
                
                # [수정] 하드코딩된 필터 대신 DB 값(t_subject)으로 동적 검사
                if t_subject == '기출':
                    # 기출은 파일명에 '기출' 또는 '_r'이 있어야 통과
                    if '기출' not in f and '_r' not in f:
                        continue
                else:
                    # '단항식의계산', '유사' 등 그 외의 값은 파일명에 정확히 있어야 통과
                    if t_subject not in f:
                        continue
                
                # 완전히 일치하는 파일은 변경 건너뜀
                if f == master_name:
                    continue 
                
                old_path = os.path.join(exams_dir, f)
                new_path = os.path.join(exams_dir, master_name)

                # 파일 존재 여부 실시간 확인 (WinError 2 방지)
                if os.path.exists(old_path):
                    try:
                        # 중복 파일명 존재 시 삭제 후 rename (충돌 방지)
                        if os.path.exists(new_path):
                            os.remove(new_path)
                        
                        os.rename(old_path, new_path)
                        print(f"✅ 정밀 복구 및 수정: {f}\n   ➔ {master_name}")
                        change_count += 1
                        break # 매칭 성공 시 다음 DB 항목으로 이동
                    except Exception as e:
                        print(f"⚠️ {f} 변경 실패: {e}")

    print("-" * 65)
    print(f"✨ 작업 완료: 총 {change_count}개의 파일이 완벽하게 정리되었습니다.")

if __name__ == "__main__":
    run_perfect_sync()