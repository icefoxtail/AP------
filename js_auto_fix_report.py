import os
import re
import sys
import io
import shutil
from typing import List, Tuple, Optional

# 출력 인코딩
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# =========================
# 설정
# =========================
TARGET_DIRS = ["exams"]
MAKE_BACKUP = True
BACKUP_DIRNAME = "_backup_before_fix"
OVERWRITE_ORIGINAL = True          # True면 원본 덮어쓰기, False면 _fixed.js 생성
FIX_SUFFIX = "_fixed"

# 수정 옵션
FIX_TRAILING_COMMAS = True
FIX_SUBJECTIVE_CHOICES = True      # choices 1개/2개 등 애매한 후반부는 []로 보정
FIX_N_BACKSLASH = True             # '\n[a-z]' 경계 정리
FIX_ODD_DOLLARS = False            # 홀수 $ 자동수정은 위험하므로 기본 False
FIX_TABLE_BR = True
FIX_SVG_BR = True
FIX_SVG_LATEX = False              # SVG 내부 LaTeX 자동 제거는 위험하므로 기본 False
ADD_MISSING_CHOICES = True         # FAIL 방지용: choices 누락 시 [] 추가

# choices 자동 [] 처리 기준
CHOICES_TO_EMPTY_IF_LEN_LE = 2     # 1개/2개면 주관식으로 간주해서 []


# =========================
# 기본 유틸
# =========================
def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8-sig") as f:
        return f.read()

def write_text(path: str, text: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

def relpath(path: str, base: str) -> str:
    return os.path.relpath(path, base).replace("\\", "/")

def iter_js_files(base_dir: str, target_dirs: List[str]) -> List[str]:
    files = []
    for rel in target_dirs:
        full = os.path.join(base_dir, rel)
        if not os.path.isdir(full):
            continue
        for root, _, filenames in os.walk(full):
            for name in filenames:
                if name.lower().endswith(".js"):
                    if name.endswith(f"{FIX_SUFFIX}.js"):
                        continue
                    files.append(os.path.join(root, name))
    return sorted(files)


# =========================
# 스캐너
# =========================
def find_matching_bracket(src: str, start_idx: int, open_ch: str, close_ch: str) -> int:
    n = len(src)
    i = start_idx
    depth = 0
    state = "code"
    quote = ""

    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""

        if state == "code":
            if ch == "/" and nxt == "/":
                i += 2
                state = "line_comment"
                continue
            if ch == "/" and nxt == "*":
                i += 2
                state = "block_comment"
                continue
            if ch in ("'", '"', "`"):
                quote = ch
                i += 1
                state = "string"
                continue

            if ch == open_ch:
                depth += 1
            elif ch == close_ch:
                depth -= 1
                if depth == 0:
                    return i
            i += 1

        elif state == "line_comment":
            if ch == "\n":
                state = "code"
            i += 1

        elif state == "block_comment":
            if ch == "*" and nxt == "/":
                i += 2
                state = "code"
            else:
                i += 1

        elif state == "string":
            if ch == "\\":
                i += 2
            elif ch == quote:
                i += 1
                state = "code"
            else:
                i += 1

    return -1


def extract_question_bank_span(src: str) -> Tuple[Optional[int], Optional[int], Optional[str]]:
    m = re.search(r'window\.questionBank\s*=\s*', src)
    if not m:
        return None, None, "window.questionBank 선언 없음"

    i = m.end()
    while i < len(src) and src[i].isspace():
        i += 1

    if i >= len(src):
        return None, None, "window.questionBank 값 없음"

    if src[i] == "[":
        end = find_matching_bracket(src, i, "[", "]")
        if end == -1:
            return None, None, "window.questionBank 배열 괄호 불일치"
        return i, end, None

    if src[i] == "{":
        end = find_matching_bracket(src, i, "{", "}")
        if end == -1:
            return None, None, "window.questionBank 객체 괄호 불일치"
        return i, end, None

    return None, None, "window.questionBank 값이 배열/객체 아님"


def split_top_level_items(src: str) -> List[Tuple[int, int, str]]:
    items = []
    start = 0
    i = 0
    n = len(src)
    state = "code"
    quote = ""
    depth_paren = depth_brack = depth_brace = 0

    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""

        if state == "code":
            if ch == "/" and nxt == "/":
                i += 2
                state = "line_comment"
                continue
            if ch == "/" and nxt == "*":
                i += 2
                state = "block_comment"
                continue
            if ch in ("'", '"', "`"):
                quote = ch
                i += 1
                state = "string"
                continue

            if ch == "(":
                depth_paren += 1
            elif ch == ")":
                depth_paren -= 1
            elif ch == "[":
                depth_brack += 1
            elif ch == "]":
                depth_brack -= 1
            elif ch == "{":
                depth_brace += 1
            elif ch == "}":
                depth_brace -= 1
            elif ch == "," and depth_paren == 0 and depth_brack == 0 and depth_brace == 0:
                items.append((start, i, src[start:i]))
                start = i + 1
            i += 1

        elif state == "line_comment":
            if ch == "\n":
                state = "code"
            i += 1

        elif state == "block_comment":
            if ch == "*" and nxt == "/":
                i += 2
                state = "code"
            else:
                i += 1

        elif state == "string":
            if ch == "\\":
                i += 2
            elif ch == quote:
                i += 1
                state = "code"
            else:
                i += 1

    items.append((start, n, src[start:n]))
    return items


def extract_top_level_objects(array_body: str) -> List[Tuple[int, int, str]]:
    objs = []
    i = 0
    n = len(array_body)
    while i < n:
        if array_body[i] == "{":
            end = find_matching_bracket(array_body, i, "{", "}")
            if end == -1:
                break
            objs.append((i, end + 1, array_body[i:end + 1]))
            i = end + 1
        else:
            i += 1
    return objs


def key_exists(obj_text: str, key: str) -> bool:
    return bool(re.search(rf'(?<![A-Za-z0-9_])["\']?{re.escape(key)}["\']?\s*:', obj_text))


def extract_field_value_span(obj_text: str, key: str) -> Optional[Tuple[int, int]]:
    m = re.search(rf'(?<![A-Za-z0-9_])["\']?{re.escape(key)}["\']?\s*:', obj_text)
    if not m:
        return None

    i = m.end()
    while i < len(obj_text) and obj_text[i].isspace():
        i += 1
    if i >= len(obj_text):
        return None

    ch = obj_text[i]
    if ch in ("'", '"', "`"):
        quote = ch
        j = i + 1
        while j < len(obj_text):
            if obj_text[j] == "\\":
                j += 2
            elif obj_text[j] == quote:
                return (i, j + 1)
            else:
                j += 1
        return None

    if ch == "[":
        end = find_matching_bracket(obj_text, i, "[", "]")
        return (i, end + 1) if end != -1 else None

    if ch == "{":
        end = find_matching_bracket(obj_text, i, "{", "}")
        return (i, end + 1) if end != -1 else None

    j = i
    depth_p = depth_b = depth_c = 0
    state = "code"
    quote = ""
    while j < len(obj_text):
        c = obj_text[j]
        nxt = obj_text[j + 1] if j + 1 < len(obj_text) else ""

        if state == "code":
            if c == "/" and nxt == "/":
                break
            if c == "/" and nxt == "*":
                break
            if c in ("'", '"', "`"):
                quote = c
                state = "string"
                j += 1
                continue

            if c == "(":
                depth_p += 1
            elif c == ")":
                depth_p -= 1
            elif c == "[":
                depth_b += 1
            elif c == "]":
                depth_b -= 1
            elif c == "{":
                depth_c += 1
            elif c == "}":
                if depth_p == 0 and depth_b == 0 and depth_c == 0:
                    break
                depth_c -= 1
            elif c == "," and depth_p == 0 and depth_b == 0 and depth_c == 0:
                break
            j += 1
        else:
            if c == "\\":
                j += 2
            elif c == quote:
                state = "code"
                j += 1
            else:
                j += 1

    return (i, j)


def count_array_items(array_literal: str) -> Optional[int]:
    s = array_literal.strip()
    if not (s.startswith("[") and s.endswith("]")):
        return None
    inner = s[1:-1].strip()
    if not inner:
        return 0
    items = split_top_level_items(inner)
    return len([x for _, _, x in items if x.strip()])


# =========================
# 자동 수정 함수
# =========================
def remove_top_level_junk_in_array(array_body: str) -> Tuple[str, int]:
    """
    questionBank 배열 내부 top-level에서 객체/쉼표/공백 외 찌꺼기 제거
    """
    out = []
    last = 0
    removed = 0
    objs = extract_top_level_objects(array_body)

    if not objs:
        return array_body, 0

    for start, end, obj in objs:
        between = array_body[last:start]
        cleaned_between = re.sub(r'[^,\s]', '', between)
        if cleaned_between != between:
            removed += 1
        out.append(cleaned_between)
        out.append(obj)
        last = end

    tail = array_body[last:]
    cleaned_tail = re.sub(r'[^,\s]', '', tail)
    if cleaned_tail != tail:
        removed += 1
    out.append(cleaned_tail)

    rebuilt = "".join(out)

    if FIX_TRAILING_COMMAS:
        rebuilt = re.sub(r',(\s*])', r'\1', rebuilt)

    return rebuilt, removed


def fix_missing_choices(obj_text: str) -> Tuple[str, int]:
    if key_exists(obj_text, "choices"):
        return obj_text, 0
    if not ADD_MISSING_CHOICES:
        return obj_text, 0

    m = re.search(r'(?<![A-Za-z0-9_])["\']?content["\']?\s*:\s*', obj_text)
    if not m:
        return obj_text, 0

    insert_pos = m.end()
    while insert_pos < len(obj_text) and obj_text[insert_pos].isspace():
        insert_pos += 1

    # content 값 뒤에 삽입
    span = extract_field_value_span(obj_text, "content")
    if not span:
        return obj_text, 0
    end = span[1]

    insertion = '\n    "choices": [],'
    return obj_text[:end] + "," + insertion + obj_text[end:], 1


def fix_choices_if_subjective(obj_text: str) -> Tuple[str, int]:
    if not FIX_SUBJECTIVE_CHOICES:
        return obj_text, 0

    span = extract_field_value_span(obj_text, "choices")
    if not span:
        return obj_text, 0

    value = obj_text[span[0]:span[1]]
    cnt = count_array_items(value)
    if cnt is None:
        return obj_text, 0

    if 0 < cnt <= CHOICES_TO_EMPTY_IF_LEN_LE:
        new_obj = obj_text[:span[0]] + "[]" + obj_text[span[1]:]
        return new_obj, 1

    return obj_text, 0


def fix_n_backslash_patterns(text: str) -> Tuple[str, int]:
    if not FIX_N_BACKSLASH:
        return text, 0

    count = 0

    def repl(m):
        nonlocal count
        count += 1
        return r'\n ' + m.group(1)

    new_text = re.sub(r'\\n([A-Za-z])', repl, text)
    return new_text, count


def fix_odd_dollars(text: str) -> Tuple[str, int]:
    if not FIX_ODD_DOLLARS:
        return text, 0
    count = 0

    def fix_field(js: str, key: str) -> Tuple[str, int]:
        span = extract_field_value_span(js, key)
        if not span:
            return js, 0
        value = js[span[0]:span[1]]
        if value.count("$") % 2 == 1:
            # 위험하므로 맨 뒤에 $ 하나 추가
            fixed_value = value + "$"
            return js[:span[0]] + fixed_value + js[span[1]:], 1
        return js, 0

    for key in ("content", "answer", "solution"):
        text, c = fix_field(text, key)
        count += c

    return text, count


def fix_table_br(text: str) -> Tuple[str, int]:
    if not FIX_TABLE_BR:
        return text, 0
    count = 0
    new = re.sub(r'(<div[^>]*>)\s*<br\s*/?>\s*(<table)', r'\1\2', text, flags=re.I)
    if new != text:
        count += 1
        text = new
    new = re.sub(r'(</table>)\s*<br\s*/?>', r'\1', text, flags=re.I)
    if new != text:
        count += 1
        text = new
    return text, count


def fix_svg_br(text: str) -> Tuple[str, int]:
    if not FIX_SVG_BR:
        return text, 0

    count = 0

    def repl(m):
        nonlocal count
        svg = m.group(0)
        new_svg = re.sub(r'<br\s*/?>', '', svg, flags=re.I)
        if new_svg != svg:
            count += 1
        return new_svg

    new_text = re.sub(r'<svg[\s\S]*?</svg>', repl, text, flags=re.I)
    return new_text, count


def fix_svg_latex(text: str) -> Tuple[str, int]:
    if not FIX_SVG_LATEX:
        return text, 0

    count = 0

    def repl_svg(m):
        nonlocal count
        svg = m.group(0)
        new_svg = re.sub(r'\$[^$]*\$', '', svg)
        new_svg = re.sub(r'\\(frac|sqrt|text|dfrac|begin|end)\b', '', new_svg)
        if new_svg != svg:
            count += 1
        return new_svg

    new_text = re.sub(r'<svg[\s\S]*?</svg>', repl_svg, text, flags=re.I)
    return new_text, count


def normalize_object(obj_text: str) -> Tuple[str, List[str]]:
    changes = []

    new_obj, c = fix_missing_choices(obj_text)
    if c:
        obj_text = new_obj
        changes.append("choices 누락 -> [] 추가")

    new_obj, c = fix_choices_if_subjective(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"choices {CHOICES_TO_EMPTY_IF_LEN_LE}개 이하 -> [] 보정")

    new_obj, c = fix_n_backslash_patterns(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"\\n[a-z] {c}건 공백 보정")

    new_obj, c = fix_odd_dollars(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"홀수 $ {c}건 보정")

    new_obj, c = fix_table_br(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"table 주변 <br> {c}건 제거")

    new_obj, c = fix_svg_br(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"SVG 내부 <br> {c}건 제거")

    new_obj, c = fix_svg_latex(obj_text)
    if c:
        obj_text = new_obj
        changes.append(f"SVG 내부 LaTeX {c}건 제거")

    return obj_text, changes


def rebuild_array_body(array_body: str) -> Tuple[str, List[str]]:
    changes = []

    cleaned, removed = remove_top_level_junk_in_array(array_body)
    if removed:
        changes.append(f"배열 top-level 찌꺼기 정리 {removed}건")

    objs = extract_top_level_objects(cleaned)
    if not objs:
        return cleaned, changes

    rebuilt_parts = []
    last = 0
    total_obj_changes = 0

    for idx, (start, end, obj) in enumerate(objs, start=1):
        rebuilt_parts.append(cleaned[last:start])
        fixed_obj, obj_changes = normalize_object(obj)
        if obj_changes:
            total_obj_changes += len(obj_changes)
        rebuilt_parts.append(fixed_obj)
        last = end

    rebuilt_parts.append(cleaned[last:])
    rebuilt = "".join(rebuilt_parts)

    if FIX_TRAILING_COMMAS:
        new_rebuilt = re.sub(r',(\s*])', r'\1', rebuilt)
        if new_rebuilt != rebuilt:
            changes.append("배열 trailing comma 제거")
            rebuilt = new_rebuilt

    if total_obj_changes:
        changes.append(f"문항 내부 수정 {total_obj_changes}건")

    return rebuilt, changes


def fix_question_bank_block(src: str) -> Tuple[str, List[str], Optional[str]]:
    start, end, err = extract_question_bank_span(src)
    if err:
        return src, [], err

    block = src[start:end + 1]
    changes = []

    if block.startswith("["):
        array_body = block[1:-1]
        fixed_body, arr_changes = rebuild_array_body(array_body)
        changes.extend(arr_changes)
        fixed_block = "[" + fixed_body + "]"
        return src[:start] + fixed_block + src[end + 1:], changes, None

    if block.startswith("{"):
        q_match = re.search(r'\b(questions|problems)\s*:\s*\[', block)
        if not q_match:
            return src, [], "questionBank 객체 안 questions/problems 배열 없음"

        arr_start = q_match.end() - 1
        arr_end = find_matching_bracket(block, arr_start, "[", "]")
        if arr_end == -1:
            return src, [], "questionBank 내부 배열 괄호 불일치"

        array_body = block[arr_start + 1:arr_end]
        fixed_body, arr_changes = rebuild_array_body(array_body)
        changes.extend(arr_changes)
        fixed_block = block[:arr_start + 1] + fixed_body + block[arr_end:]
        return src[:start] + fixed_block + src[end + 1:], changes, None

    return src, [], "questionBank 값 형식 오류"


# =========================
# 파일 단위 처리
# =========================
def ensure_backup(base_dir: str) -> str:
    backup_dir = os.path.join(base_dir, BACKUP_DIRNAME)
    os.makedirs(backup_dir, exist_ok=True)
    return backup_dir


def backup_file(src_path: str, base_dir: str, backup_dir: str) -> None:
    rel = relpath(src_path, base_dir)
    dst = os.path.join(backup_dir, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src_path, dst)


def output_path_for(src_path: str) -> str:
    if OVERWRITE_ORIGINAL:
        return src_path
    root, ext = os.path.splitext(src_path)
    return root + FIX_SUFFIX + ext


def process_file(path: str, base_dir: str, backup_dir: Optional[str]) -> Tuple[str, List[str], Optional[str]]:
    try:
        original = read_text(path)
    except Exception as e:
        return relpath(path, base_dir), [], f"파일 읽기 실패: {e}"

    fixed, changes, err = fix_question_bank_block(original)
    if err:
        return relpath(path, base_dir), [], err

    if fixed != original:
        if MAKE_BACKUP and backup_dir:
            backup_file(path, base_dir, backup_dir)

        out_path = output_path_for(path)
        write_text(out_path, fixed)

    return relpath(path, base_dir), changes, None


# =========================
# 실행
# =========================
def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    files = iter_js_files(base_dir, TARGET_DIRS)

    if not files:
        print("❌ 검사/수정할 JS 파일이 없습니다.")
        return

    backup_dir = ensure_backup(base_dir) if MAKE_BACKUP else None

    fixed_count = 0
    unchanged_count = 0
    fail_count = 0
    details = []

    for path in files:
        rel, changes, err = process_file(path, base_dir, backup_dir)
        if err:
            fail_count += 1
            details.append((rel, "FAIL", [err]))
            continue

        if changes:
            fixed_count += 1
            details.append((rel, "FIXED", changes))
        else:
            unchanged_count += 1
            details.append((rel, "UNCHANGED", []))

    report_lines = []
    report_lines.append("JS 자동 수정기 실행 결과")
    report_lines.append("=" * 60)
    report_lines.append(f"총 파일: {len(files)}")
    report_lines.append(f"수정됨: {fixed_count}")
    report_lines.append(f"변경없음: {unchanged_count}")
    report_lines.append(f"실패: {fail_count}")
    report_lines.append("")

    for rel, status, msgs in details:
        report_lines.append(f"[{status}] {rel}")
        for msg in msgs:
            report_lines.append(f"  - {msg}")
        report_lines.append("")

    report_path = os.path.join(base_dir, "js_auto_fix_report.txt")
    write_text(report_path, "\n".join(report_lines))

    print("✅ JS 자동 수정 완료")
    print(f"총 파일: {len(files)}")
    print(f"수정됨: {fixed_count}")
    print(f"변경없음: {unchanged_count}")
    print(f"실패: {fail_count}")
    if MAKE_BACKUP:
        print(f"백업 폴더: {BACKUP_DIRNAME}")
    print("리포트: js_auto_fix_report.txt")


if __name__ == "__main__":
    main()