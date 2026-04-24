from pathlib import Path
import re

# JS 파일 폴더 경로로 바꾸세요
TARGET_DIR = Path(r"./exams")

# level 필드만 정확히 교체
pattern = re.compile(r'(\blevel\s*:\s*["\'])중상(["\'])')

changed_files = []

for path in TARGET_DIR.glob("*.js"):
    text = path.read_text(encoding="utf-8")
    new_text, count = pattern.subn(r'\1상\2', text)
    if count > 0:
        path.write_text(new_text, encoding="utf-8")
        changed_files.append((path.name, count))

print("변경 완료")
for name, count in changed_files:
    print(f"{name}: {count}개")
print(f"총 파일 수: {len(changed_files)}")