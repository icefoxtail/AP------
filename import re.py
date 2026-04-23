import re
import sys
from pathlib import Path

# ============================================================
# JS아카이브 조건표 → note-box 전수정리 스크립트
# ------------------------------------------------------------
# 기능
# 1) content 내부에서 "조건 설명용 1칸 표"를 찾아 question-note-box로 교체
# 2) 표/박스/이미지 앞뒤의 과다 <br>를 1줄 기준으로 정리
# 3) 원본은 유지하고 *_fixed.js 로 저장
#
# 사용 예시
# python fix_condition_tables.py "C:/JS아카이브/exams"
# python fix_condition_tables.py "C:/JS아카이브/exams/25_순천고_1학기_중간_고1_기출.js"
# ============================================================

CANDIDATE_EXTENSIONS = {".js"}

QUESTION_NOTE_CLASS = "question-note-box"

# 조건/안내/주의 계열로 볼 만한 헤더 패턴
HEADER_CANDIDATES = [
    "조건", "<조건>", "주의", "<주의>", "보기", "<보기>", "참고", "<참고>",
    "조건>", "&lt;조건&gt;", "&lt;주의&gt;", "&lt;보기&gt;", "&lt;참고&gt;"
]

# 실제 표 데이터로 보기 어려운 힌트
NON_TABLE_KEYWORDS = [
    "조건", "주의", "참고", "다음", "밑면", "둘레", "넓이", "직사각형",
    "이어야 합니다", "하여야 한다", "일 때", "다음을", "다음을"
]

def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")

def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")

def normalize_br_around_visuals(text: str) -> str:
    # 시각요소 앞 과다 <br> 축소
    text = re.sub(
        r'(?:\s*<br\s*/?>\s*){2,}(?=\s*<(?:div class="question-table-wrap"|div class="question-note-box"|img\b|svg\b|table\b))',
        "\n<br>\n",
        text,
        flags=re.IGNORECASE
    )
    # 시각요소 뒤 과다 <br> 축소
    text = re.sub(
        r'(?<=</(?:div|table|svg)>)(?:\s*<br\s*/?>\s*){2,}',
        "\n<br>\n",
        text,
        flags=re.IGNORECASE
    )
    return text

def strip_outer_br(s: str) -> str:
    s = re.sub(r'^(?:\s*<br\s*/?>\s*)+', '', s, flags=re.IGNORECASE)
    s = re.sub(r'(?:\s*<br\s*/?>\s*)+$', '', s, flags=re.IGNORECASE)
    return s.strip()

def collapse_multiple_br(s: str) -> str:
    return re.sub(r'(?:\s*<br\s*/?>\s*){2,}', '<br>', s, flags=re.IGNORECASE)

def clean_note_body(td_html: str) -> str:
    body = td_html.strip()

    # td 내부 첫 줄에 <b><조건></b> 같은 게 중복되면 제거 후보 처리
    body = re.sub(
        r'^\s*(?:<b>\s*)?(?:&lt;)?\s*(조건|주의|보기|참고)\s*(?:&gt;)?(?:\s*</b>)?\s*(?:<br\s*/?>\s*)*',
        '',
        body,
        flags=re.IGNORECASE
    )

    body = strip_outer_br(body)
    body = collapse_multiple_br(body)
    return body

def should_convert_condition_table(table_html: str) -> bool:
    html_no_space = re.sub(r'\s+', ' ', table_html).strip()

    # 너무 복잡한 표는 제외
    tr_count = len(re.findall(r'<tr\b', html_no_space, flags=re.IGNORECASE))
    td_count = len(re.findall(r'<td\b', html_no_space, flags=re.IGNORECASE))
    th_count = len(re.findall(r'<th\b', html_no_space, flags=re.IGNORECASE))

    # 기본 조건:
    # - 대체로 2행 구조 (헤더 1행 + 내용 1행)
    # - 내용 셀 하나
    if tr_count > 3:
        return False
    if td_count != 1:
        return False
    if th_count > 2:
        return False

    header_match = re.search(r'<th[^>]*>(.*?)</th>', html_no_space, flags=re.IGNORECASE | re.DOTALL)
    td_match = re.search(r'<td[^>]*>(.*?)</td>', html_no_space, flags=re.IGNORECASE | re.DOTALL)
    if not td_match:
        return False

    header_text = re.sub(r'<[^>]+>', '', header_match.group(1)).strip() if header_match else ''
    body_text = re.sub(r'<[^>]+>', ' ', td_match.group(1)).strip()

    has_header_hint = any(k.lower() in header_text.lower() for k in HEADER_CANDIDATES)
    has_body_hint = any(k in body_text for k in NON_TABLE_KEYWORDS)
    br_count = len(re.findall(r'<br\s*/?>', td_match.group(1), flags=re.IGNORECASE))

    # 헤더가 조건류이거나, 본문이 설명문 위주 + 줄바꿈 다수면 조건박스 후보
    if has_header_hint:
        return True
    if br_count >= 2 and has_body_hint:
        return True

    return False

def convert_condition_table_block(match: re.Match) -> str:
    full_block = match.group(0)
    table_html = match.group("table")

    if not should_convert_condition_table(table_html):
        return full_block

    header_match = re.search(r'<th[^>]*>(.*?)</th>', table_html, flags=re.IGNORECASE | re.DOTALL)
    td_match = re.search(r'<td[^>]*>(.*?)</td>', table_html, flags=re.IGNORECASE | re.DOTALL)
    if not td_match:
        return full_block

    header_raw = header_match.group(1).strip() if header_match else ""
    td_raw = td_match.group(1).strip()

    header_text_plain = re.sub(r'<[^>]+>', '', header_raw).strip()
    body = clean_note_body(td_raw)

    # 헤더 텍스트 정리
    header_html = ""
    if header_text_plain:
        # <조건> 형태 유지
        header_html = f'<b>{header_text_plain}</b><br>'

    note_html = f'<div class="{QUESTION_NOTE_CLASS}">{header_html}{body}</div>'
    return note_html

def convert_condition_tables(text: str) -> tuple[str, int]:
    pattern = re.compile(
        r'''
        (?P<prefix>(?:\s*<br\s*/?>\s*)*)
        <div\s+class="question-table-wrap">\s*
            (?P<table>
                <table[^>]*>.*?</table>
            )
        \s*</div>
        (?P<suffix>(?:\s*<br\s*/?>\s*)*)
        ''',
        flags=re.IGNORECASE | re.DOTALL | re.VERBOSE
    )

    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        replaced = convert_condition_table_block(m)
        if replaced != m.group(0):
            count += 1
            # 앞뒤 과다 br 제거하고 note-box만 남김
            return "\n" + replaced + "\n"
        return m.group(0)

    new_text = pattern.sub(repl, text)
    return new_text, count

def fix_single_file(path: Path) -> tuple[Path, int, bool]:
    original = read_text(path)
    text = original

    text, convert_count = convert_condition_tables(text)
    text = normalize_br_around_visuals(text)

    changed = text != original
    out_path = path.with_name(path.stem + "_fixed.js")

    if changed:
        write_text(out_path, text)

    return out_path, convert_count, changed

def iter_js_files(target: Path):
    if target.is_file():
        if target.suffix.lower() in CANDIDATE_EXTENSIONS:
            yield target
        return

    for p in target.rglob("*"):
        if p.is_file() and p.suffix.lower() in CANDIDATE_EXTENSIONS:
            yield p

def main():
    if len(sys.argv) < 2:
        print("사용법: python fix_condition_tables.py <폴더 또는 js파일>")
        sys.exit(1)

    target = Path(sys.argv[1])
    if not target.exists():
        print(f"경로 없음: {target}")
        sys.exit(1)

    total_files = 0
    changed_files = 0
    total_converted = 0

    for js_file in iter_js_files(target):
        total_files += 1
        out_path, convert_count, changed = fix_single_file(js_file)
        total_converted += convert_count
        if changed:
            changed_files += 1
            print(f"[수정] {js_file.name} -> {out_path.name} | 조건표 변환 {convert_count}건")
        else:
            print(f"[유지] {js_file.name} | 변환 없음")

    print("-" * 60)
    print(f"검사 파일 수: {total_files}")
    print(f"수정 파일 수: {changed_files}")
    print(f"조건표 변환 총계: {total_converted}")

if __name__ == "__main__":
    main()