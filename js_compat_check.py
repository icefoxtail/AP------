import os
import re
import json
import sys
import io
from typing import List, Tuple, Dict, Any, Optional

# 출력 인코딩
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TARGET_DIRS = ["exams"]
REPORT_JSON = "js_compat_report.json"
REPORT_TXT = "js_compat_report.txt"


# -----------------------------
# 기본 유틸
# -----------------------------
def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8-sig") as f:
        return f.read()


def write_text(path: str, text: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def iter_js_files(base_dir: str, target_dirs: List[str]) -> List[str]:
    files = []
    for rel in target_dirs:
        full = os.path.join(base_dir, rel)
        if not os.path.isdir(full):
            continue
        for root, _, filenames in os.walk(full):
            for name in filenames:
                if name.lower().endswith(".js"):
                    files.append(os.path.join(root, name))
    return sorted(files)


def compact_spaces(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def relpath(path: str, base: str) -> str:
    return os.path.relpath(path, base).replace("\\", "/")


# -----------------------------
# 문자열/주석 무시 스캐너
# -----------------------------
def mask_comments_keep_strings(src: str) -> str:
    """
    주석만 공백으로 마스킹.
    문자열 내용은 유지.
    """
    out = []
    i = 0
    n = len(src)
    state = "code"
    quote = ""
    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""

        if state == "code":
            if ch == "/" and nxt == "/":
                out.append(" ")
                out.append(" ")
                i += 2
                state = "line_comment"
            elif ch == "/" and nxt == "*":
                out.append(" ")
                out.append(" ")
                i += 2
                state = "block_comment"
            elif ch in ("'", '"', "`"):
                quote = ch
                out.append(ch)
                i += 1
                state = "string"
            else:
                out.append(ch)
                i += 1

        elif state == "line_comment":
            if ch == "\n":
                out.append("\n")
                i += 1
                state = "code"
            else:
                out.append(" ")
                i += 1

        elif state == "block_comment":
            if ch == "*" and nxt == "/":
                out.append(" ")
                out.append(" ")
                i += 2
                state = "code"
            else:
                out.append("\n" if ch == "\n" else " ")
                i += 1

        elif state == "string":
            out.append(ch)
            if ch == "\\":
                if i + 1 < n:
                    out.append(src[i + 1])
                    i += 2
                else:
                    i += 1
            elif ch == quote:
                i += 1
                state = "code"
            else:
                i += 1

    return "".join(out)


def find_matching_bracket(src: str, start_idx: int, open_ch: str, close_ch: str) -> int:
    """
    문자열/주석을 고려해 괄호 짝 찾기.
    start_idx는 open_ch 위치.
    """
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


def split_top_level_items(src: str) -> List[str]:
    """
    배열/객체 내부의 top-level comma split.
    """
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
                items.append(src[start:i].strip())
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

    tail = src[start:].strip()
    if tail:
        items.append(tail)
    return items


# -----------------------------
# questionBank / 문항 객체 추출
# -----------------------------
def extract_exam_title(src: str) -> Optional[str]:
    m = re.search(r'window\.examTitle\s*=\s*([\'"`])(.*?)\1\s*;', src, re.DOTALL)
    return m.group(2).strip() if m else None


def extract_question_bank_array(src: str) -> Tuple[Optional[str], Optional[str]]:
    """
    return: (array_text_without_outer_brackets, error_message)
    """
    m = re.search(r'window\.questionBank\s*=\s*', src)
    if not m:
        return None, "window.questionBank 선언이 없습니다."

    i = m.end()
    while i < len(src) and src[i].isspace():
        i += 1

    if i >= len(src):
        return None, "window.questionBank 뒤에 값이 없습니다."

    if src[i] == "[":
        end = find_matching_bracket(src, i, "[", "]")
        if end == -1:
            return None, "window.questionBank 배열 괄호가 닫히지 않았습니다."
        return src[i + 1:end], None

    if src[i] == "{":
        end = find_matching_bracket(src, i, "{", "}")
        if end == -1:
            return None, "window.questionBank 객체 괄호가 닫히지 않았습니다."
        obj_text = src[i:end + 1]
        q_match = re.search(r'\b(questions|problems)\s*:\s*\[', obj_text)
        if not q_match:
            return None, "window.questionBank가 객체인데 questions/problems 배열이 없습니다."
        arr_start = q_match.end() - 1
        arr_end = find_matching_bracket(obj_text, arr_start, "[", "]")
        if arr_end == -1:
            return None, "questions/problems 배열 괄호가 닫히지 않았습니다."
        return obj_text[arr_start + 1:arr_end], None

    return None, "window.questionBank 값이 배열/객체가 아닙니다."


def extract_top_level_objects(array_body: str) -> List[str]:
    objs = []
    i = 0
    n = len(array_body)

    while i < n:
        if array_body[i] == "{":
            end = find_matching_bracket(array_body, i, "{", "}")
            if end == -1:
                break
            objs.append(array_body[i:end + 1])
            i = end + 1
        else:
            i += 1
    return objs


# -----------------------------
# 개별 문항 검사
# -----------------------------
KEY_PATTERNS = {
    "id": re.compile(r'(?<![A-Za-z0-9_])["\']?id["\']?\s*:'),
    "content": re.compile(r'(?<![A-Za-z0-9_])["\']?content["\']?\s*:'),
    "choices": re.compile(r'(?<![A-Za-z0-9_])["\']?choices["\']?\s*:'),
    "answer": re.compile(r'(?<![A-Za-z0-9_])["\']?answer["\']?\s*:'),
    "solution": re.compile(r'(?<![A-Za-z0-9_])["\']?solution["\']?\s*:'),
    "layoutTag": re.compile(r'(?<![A-Za-z0-9_])["\']?layoutTag["\']?\s*:'),
    "tags": re.compile(r'(?<![A-Za-z0-9_])["\']?tags["\']?\s*:'),
    "wide": re.compile(r'(?<![A-Za-z0-9_])["\']?wide["\']?\s*:'),
}


def has_key(obj_text: str, key: str) -> bool:
    return bool(KEY_PATTERNS[key].search(obj_text))


def extract_field_value_span(obj_text: str, key: str) -> Optional[Tuple[int, int]]:
    m = KEY_PATTERNS[key].search(obj_text)
    if not m:
        return None

    i = m.end()
    while i < len(obj_text) and obj_text[i].isspace():
        i += 1
    if i >= len(obj_text):
        return None

    ch = obj_text[i]
    if ch in ('"', "'", "`"):
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

    # 숫자/불리언/식
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
            if c in ('"', "'", "`"):
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
    if not s.startswith("[") or not s.endswith("]"):
        return None
    inner = s[1:-1].strip()
    if not inner:
        return 0
    parts = split_top_level_items(inner)
    return len([p for p in parts if p.strip()])


def count_dollar(text: str) -> int:
    return text.count("$")


def check_latex_dollar_parity(obj_text: str, key: str) -> Optional[str]:
    span = extract_field_value_span(obj_text, key)
    if not span:
        return None
    value = obj_text[span[0]:span[1]]
    if count_dollar(value) % 2 != 0:
        return f"{key}의 $ 개수가 홀수입니다."
    return None


def check_n_backslash_command(obj_text: str, key: str) -> Optional[str]:
    span = extract_field_value_span(obj_text, key)
    if not span:
        return None
    value = obj_text[span[0]:span[1]]
    if re.search(r'\\n[a-zA-Z]', value):
        return f"{key}에 '\\n[a-z]' 패턴이 있습니다. 줄바꿈/LaTeX 경계 확인 필요."
    return None


def check_svg_table_rules(obj_text: str) -> List[str]:
    issues = []

    svg_blocks = re.findall(r"<svg[\s\S]*?</svg>", obj_text, re.IGNORECASE)
    for idx, svg in enumerate(svg_blocks, start=1):
        if re.search(r"<br\s*/?>", svg, re.IGNORECASE):
            issues.append(f"SVG #{idx} 내부에 <br>가 있습니다.")
        if "$" in svg or re.search(r'\\(frac|sqrt|text|begin|dfrac)', svg):
            issues.append(f"SVG #{idx} 내부에 LaTeX 흔적이 있습니다.")
        for m in re.finditer(r"<text[^>]*>(.*?)</text>", svg, re.IGNORECASE | re.DOTALL):
            text_body = m.group(1)
            if "<tspan" not in text_body and "\n" in text_body.strip():
                issues.append(f"SVG #{idx} <text> 내부 줄바꿈이 tspan 없이 들어갔을 수 있습니다.")

    if re.search(r"<div[^>]*>\s*<br\s*/?>\s*<table", obj_text, re.IGNORECASE):
        issues.append("table 직전 불필요한 <br>가 있습니다.")
    if re.search(r"</table>\s*<br\s*/?>", obj_text, re.IGNORECASE):
        issues.append("table 직후 불필요한 <br>가 있습니다.")
    if re.search(r"<table[\s\S]*?style\s*=\s*['\"][^'\"]*font-size", obj_text, re.IGNORECASE):
        issues.append("table 인라인 font-size가 있습니다.")
    return issues


def check_object(obj_text: str, idx: int) -> Dict[str, Any]:
    issues = []
    warnings = []

    for key in ("id", "content", "choices", "answer", "solution"):
        if not has_key(obj_text, key):
            issues.append(f"{idx}번 문항: 필수 필드 '{key}' 누락")

    # choices 배열 여부 / 개수
    if has_key(obj_text, "choices"):
        span = extract_field_value_span(obj_text, "choices")
        if not span:
            issues.append(f"{idx}번 문항: choices 값을 해석할 수 없음")
        else:
            choices_text = obj_text[span[0]:span[1]].strip()
            if not choices_text.startswith("["):
                issues.append(f"{idx}번 문항: choices가 배열이 아님")
            else:
                count = count_array_items(choices_text)
                if count is None:
                    issues.append(f"{idx}번 문항: choices 개수 계산 실패")
                else:
                    if count == 0:
                        pass
                    elif count != 5:
                        warnings.append(f"{idx}번 문항: choices 개수 {count}개 (보통 객관식은 5개)")

    # layoutTag / tags / wide 룰북 경고
    if has_key(obj_text, "wide"):
        span = extract_field_value_span(obj_text, "wide")
        if span:
            wide_text = obj_text[span[0]:span[1]].strip()
            if wide_text == "true" and not has_key(obj_text, "layoutTag"):
                warnings.append(f"{idx}번 문항: wide:true 사용. 수동 지정인지 확인 필요.")

    # 달러 짝수 / \n[a-z]
    for key in ("content", "answer", "solution", "choices"):
        msg = check_latex_dollar_parity(obj_text, key)
        if msg:
            warnings.append(f"{idx}번 문항: {msg}")

    for key in ("solution", "choices"):
        msg = check_n_backslash_command(obj_text, key)
        if msg:
            warnings.append(f"{idx}번 문항: {msg}")

    # SVG/table
    for msg in check_svg_table_rules(obj_text):
        warnings.append(f"{idx}번 문항: {msg}")

    return {
        "index": idx,
        "issues": issues,
        "warnings": warnings,
    }


# -----------------------------
# 파일 단위 검사
# -----------------------------
def inspect_js_file(path: str, base_dir: str) -> Dict[str, Any]:
    result = {
        "file": relpath(path, base_dir),
        "status": "PASS",
        "summary": [],
        "issues": [],
        "warnings": [],
        "question_count": 0,
        "examTitle": None,
    }

    try:
        src = read_text(path)
    except Exception as e:
        result["status"] = "FAIL"
        result["issues"].append(f"파일 읽기 실패: {e}")
        return result

    masked = mask_comments_keep_strings(src)

    exam_title = extract_exam_title(masked)
    result["examTitle"] = exam_title
    if not exam_title:
        result["warnings"].append("window.examTitle이 없습니다.")

    array_body, err = extract_question_bank_array(masked)
    if err:
        result["status"] = "FAIL"
        result["issues"].append(err)
        return result

    objs = extract_top_level_objects(array_body)
    result["question_count"] = len(objs)

    if len(objs) == 0:
        result["status"] = "FAIL"
        result["issues"].append("questionBank에서 문항 객체를 하나도 추출하지 못했습니다.")
        return result

    # top-level trailing garbage check
    stripped = re.sub(r"\{[\s\S]*?\}", "{}", array_body)
    if re.search(r"[A-Za-z0-9가-힣]", stripped):
        result["warnings"].append("questionBank 배열 내부에 객체 외 문자열/식이 섞였을 수 있습니다.")

    # 개별 문항 검사
    for i, obj in enumerate(objs, start=1):
        checked = check_object(obj, i)
        result["issues"].extend(checked["issues"])
        result["warnings"].extend(checked["warnings"])

    # 파일 레벨 추가 검사
    if "window.questionBank" not in masked and ("questions" in masked or "problems" in masked):
        result["warnings"].append("window.questionBank 직접 선언이 아니라 우회 구조일 수 있습니다.")

    if result["issues"]:
        result["status"] = "FAIL"
    elif result["warnings"]:
        result["status"] = "WARN"

    result["summary"].append(f"문항 수: {result['question_count']}")
    if exam_title:
        result["summary"].append(f"examTitle: {exam_title}")

    return result


# -----------------------------
# 리포트 출력
# -----------------------------
def build_text_report(results: List[Dict[str, Any]]) -> str:
    lines = []
    total = len(results)
    fail = sum(1 for r in results if r["status"] == "FAIL")
    warn = sum(1 for r in results if r["status"] == "WARN")
    passed = sum(1 for r in results if r["status"] == "PASS")

    lines.append("JS 엔진 호환성 검사 보고서")
    lines.append("=" * 60)
    lines.append(f"총 파일: {total}")
    lines.append(f"PASS : {passed}")
    lines.append(f"WARN : {warn}")
    lines.append(f"FAIL : {fail}")
    lines.append("")

    for r in results:
        lines.append(f"[{r['status']}] {r['file']}")
        for s in r["summary"]:
            lines.append(f"  - {s}")
        if r["issues"]:
            lines.append("  Issues:")
            for msg in r["issues"]:
                lines.append(f"    * {msg}")
        if r["warnings"]:
            lines.append("  Warnings:")
            for msg in r["warnings"]:
                lines.append(f"    * {msg}")
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    files = iter_js_files(base_dir, TARGET_DIRS)

    if not files:
        print("❌ 검사할 JS 파일이 없습니다.")
        return

    results = [inspect_js_file(path, base_dir) for path in files]

    # 저장
    json_path = os.path.join(base_dir, REPORT_JSON)
    txt_path = os.path.join(base_dir, REPORT_TXT)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    txt_report = build_text_report(results)
    write_text(txt_path, txt_report)

    total = len(results)
    fail = sum(1 for r in results if r["status"] == "FAIL")
    warn = sum(1 for r in results if r["status"] == "WARN")
    passed = sum(1 for r in results if r["status"] == "PASS")

    print("✅ JS 엔진 호환성 검사 완료")
    print(f"총 파일: {total}")
    print(f"PASS : {passed}")
    print(f"WARN : {warn}")
    print(f"FAIL : {fail}")
    print(f"텍스트 보고서: {REPORT_TXT}")
    print(f"JSON 보고서  : {REPORT_JSON}")


if __name__ == "__main__":
    main()