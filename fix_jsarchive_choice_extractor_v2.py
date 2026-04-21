# fix_jsarchive_choice_extractor_v2.py
# 사용 예:
#   python fix_jsarchive_choice_extractor_v2.py D:\JS아카이브\exams
#   python fix_jsarchive_choice_extractor_v2.py D:\JS아카이브\exams --apply
#   python fix_jsarchive_choice_extractor_v2.py D:\JS아카이브\exams D:\JS아카이브\others --apply

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from typing import List, Optional, Tuple


CIRCLED_MARKERS = ["①", "②", "③", "④", "⑤"]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> str:
    path.write_text(text, encoding="utf-8", newline="\n")
    return text


def find_matching(text: str, start: int, open_ch: str, close_ch: str) -> int:
    in_str = False
    esc = False
    quote = ""
    depth = 0

    for i in range(start, len(text)):
        ch = text[i]

        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == quote:
                in_str = False
            continue

        if ch in ("'", '"'):
            in_str = True
            quote = ch
            continue

        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i

    raise ValueError(f"매칭되는 {close_ch} 를 찾지 못했습니다.")


def find_questionbank_array_span(text: str) -> Tuple[int, int]:
    m = re.search(r"window\.questionBank\s*=\s*\[", text)
    if not m:
        raise ValueError("window.questionBank = [ 를 찾지 못했습니다.")
    arr_start = text.find("[", m.start())
    arr_end = find_matching(text, arr_start, "[", "]")
    return arr_start, arr_end


def split_top_level_objects(array_text: str) -> List[Tuple[int, int, str]]:
    items: List[Tuple[int, int, str]] = []
    in_str = False
    esc = False
    quote = ""
    depth = 0
    obj_start: Optional[int] = None

    for i, ch in enumerate(array_text):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == quote:
                in_str = False
            continue

        if ch in ("'", '"'):
            in_str = True
            quote = ch
            continue

        if ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                items.append((obj_start, i + 1, array_text[obj_start:i + 1]))
                obj_start = None

    return items


def find_string_field_span(obj_text: str, field: str) -> Optional[Tuple[int, int, str]]:
    m = re.search(rf'"{re.escape(field)}"\s*:\s*"', obj_text)
    if not m:
        return None

    value_start = obj_text.find('"', m.end() - 1)
    i = value_start + 1
    esc = False

    while i < len(obj_text):
        ch = obj_text[i]
        if esc:
            esc = False
        elif ch == "\\":
            esc = True
        elif ch == '"':
            return value_start, i, obj_text[value_start:i + 1]
        i += 1

    return None


def find_array_field_span(obj_text: str, field: str) -> Optional[Tuple[int, int, str]]:
    m = re.search(rf'"{re.escape(field)}"\s*:\s*\[', obj_text)
    if not m:
        return None

    arr_start = obj_text.find("[", m.start())
    arr_end = find_matching(obj_text, arr_start, "[", "]")
    return arr_start, arr_end, obj_text[arr_start:arr_end + 1]


def decode_js_string(literal: str) -> str:
    return json.loads(literal)


def encode_js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def parse_choices_array_literal(arr_literal: str) -> List[str]:
    try:
        data = json.loads(arr_literal)
        if isinstance(data, list):
            return [str(x) for x in data]
    except Exception:
        pass
    return []


def encode_choices_array(choices: List[str], indent: str = "      ") -> str:
    if not choices:
        return "[]"

    lines = ["["]
    for i, c in enumerate(choices):
        comma = "," if i < len(choices) - 1 else ""
        lines.append(f'\n{indent}{json.dumps(c, ensure_ascii=False)}{comma}')
    lines.append("\n    ]")
    return "".join(lines)


def normalize_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def strip_question_number_at_line_start(text: str) -> str:
    text = normalize_newlines(text)
    lines = text.split("\n")
    out = []

    for line in lines:
        # 예: "1. 다음...", "12. 다음..."
        line2 = re.sub(r"^(\s*(?:<br>\s*)*)(\d+)\.\s*", r"\1", line)
        out.append(line2)

    return "\n".join(out).strip()


def remove_duplicate_empty_lines(text: str) -> str:
    text = normalize_newlines(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def has_existing_choices(choices: List[str]) -> bool:
    return bool(choices and any(str(c).strip() for c in choices))


def has_choice_markers(content: str) -> bool:
    if any(m in content for m in CIRCLED_MARKERS):
        return True

    # 1) 2) 3) 4) 5)
    if re.search(r'(^|[\s\n<])1\s*\)\s*', content):
        return True

    # 1. 2. 3. 4. 5.  (문항 번호 1. 다음... 과 충돌 줄이려고 2개 이상 숫자선택지 패턴이 있어야 하게 뒤에서 재검증)
    if re.search(r'(^|[\s\n<])1\s*\.\s*', content) and re.search(r'(^|[\s\n<])2\s*\.\s*', content):
        return True

    return False


def split_circled_choices(content: str) -> Optional[Tuple[str, List[str]]]:
    if not any(m in content for m in CIRCLED_MARKERS):
        return None

    first_positions = [content.find(m) for m in CIRCLED_MARKERS if m in content]
    first_choice_pos = min(pos for pos in first_positions if pos >= 0)

    stem = content[:first_choice_pos].rstrip()
    choices_part = content[first_choice_pos:].strip()

    pattern = r"(①|②|③|④|⑤)\s*(.*?)(?=(?:①|②|③|④|⑤)\s*|$)"
    matches = re.findall(pattern, choices_part, flags=re.DOTALL)

    choices = []
    for _, body in matches:
        body = body.strip()
        if body:
            choices.append(body)

    if len(choices) >= 2:
        return remove_duplicate_empty_lines(strip_question_number_at_line_start(stem)), choices
    return None


def split_numbered_choices(content: str) -> Optional[Tuple[str, List[str]]]:
    text = normalize_newlines(content)

    marker_pattern = r'(?<!\d)([1-5])\s*([.)])\s*'
    matches = list(re.finditer(marker_pattern, text))

    if len(matches) < 2:
        return None

    valid = []
    expected = 1

    for m in matches:
        num = int(m.group(1))
        punct = m.group(2)

        if num == expected:
            valid.append((m.start(), m.end(), num, punct))
            expected += 1
            if expected == 6:
                break

    if len(valid) < 2:
        return None

    first_start = valid[0][0]
    stem = text[:first_start].rstrip()

    # stem이 너무 짧고 바로 "1."로 시작하는 문항번호일 뿐이면 오탐 방지
    if not stem.strip():
        return None

    choices = []
    for i, (start, end, num, punct) in enumerate(valid):
        body_start = end
        body_end = valid[i + 1][0] if i + 1 < len(valid) else len(text)
        body = text[body_start:body_end].strip()
        if body:
            choices.append(body)

    if len(choices) < 2:
        return None

    # 1,2,3... 순서성 재검증
    if len(valid) != len(choices):
        return None

    # 보기 본문이 너무 긴 경우는 오탐 가능성 높음. 다만 SVG/표 섞인 문제 고려해서 제한은 약하게.
    cleaned_stem = remove_duplicate_empty_lines(strip_question_number_at_line_start(stem))
    if not cleaned_stem:
        return None

    return cleaned_stem, choices


def split_content_and_choices(content: str) -> Optional[Tuple[str, List[str]]]:
    # 우선순위 1: 원형번호
    circled = split_circled_choices(content)
    if circled:
        return circled

    # 우선순위 2: 숫자보기
    numbered = split_numbered_choices(content)
    if numbered:
        return numbered

    return None


def process_object(obj_text: str) -> Tuple[str, List[str]]:
    logs: List[str] = []
    new_obj = obj_text

    content_span = find_string_field_span(new_obj, "content")
    if not content_span:
        return obj_text, logs

    c_start, c_end, c_literal = content_span
    content_value = decode_js_string(c_literal)

    choices_span = find_array_field_span(new_obj, "choices")
    choices_value: List[str] = []
    if choices_span:
        _, _, arr_literal = choices_span
        choices_value = parse_choices_array_literal(arr_literal)

    stripped_content = strip_question_number_at_line_start(content_value)
    if stripped_content != content_value:
        logs.append("content 앞 번호 제거")

    final_content = stripped_content
    final_choices = choices_value[:]

    if not has_existing_choices(final_choices) and has_choice_markers(stripped_content):
        split_result = split_content_and_choices(stripped_content)
        if split_result:
            final_content, final_choices = split_result
            logs.append(f"보기 {len(final_choices)}개를 content에서 choices로 분리")

    if not logs:
        return obj_text, logs

    # content 치환
    content_span2 = find_string_field_span(new_obj, "content")
    if content_span2:
        s, e, _ = content_span2
        new_obj = new_obj[:s] + encode_js_string(final_content) + new_obj[e + 1:]

    # choices 치환/삽입
    choices_span2 = find_array_field_span(new_obj, "choices")
    if choices_span2:
        s, e, _ = choices_span2
        new_obj = new_obj[:s] + encode_choices_array(final_choices) + new_obj[e + 1:]
    elif final_choices:
        answer_match = re.search(r'\n(\s*)"answer"\s*:', new_obj)
        insert_block = f'\n    "choices": {encode_choices_array(final_choices)},'
        if answer_match:
            idx = answer_match.start()
            new_obj = new_obj[:idx] + insert_block + new_obj[idx:]
        else:
            idx = new_obj.rfind("}")
            if idx != -1:
                prefix = "" if new_obj[:idx].rstrip().endswith(",") else ","
                new_obj = new_obj[:idx] + prefix + insert_block + "\n" + new_obj[idx:]

    return new_obj, logs


def process_file(path: Path, apply: bool) -> Tuple[bool, List[str]]:
    original = read_text(path)

    try:
        arr_start, arr_end = find_questionbank_array_span(original)
    except Exception as e:
        return False, [f"questionBank 인식 실패: {e}"]

    array_body = original[arr_start:arr_end + 1]
    objects = split_top_level_objects(array_body)

    if not objects:
        return False, ["문항 객체를 찾지 못함"]

    new_array = array_body
    total_logs: List[str] = []
    offset = 0
    changed_any = False

    for idx, (s, e, obj_text) in enumerate(objects, start=1):
        new_obj, logs = process_object(obj_text)
        if logs:
            changed_any = True
            total_logs.append(f"객체 {idx}: " + "; ".join(logs))
            real_s = s + offset
            real_e = e + offset
            new_array = new_array[:real_s] + new_obj + new_array[real_e:]
            offset += len(new_obj) - (e - s)

    if not changed_any:
        return False, ["변경 없음"]

    new_text = original[:arr_start] + new_array + original[arr_end + 1:]

    if apply:
        backup = path.with_suffix(path.suffix + ".bak")
        if not backup.exists():
            shutil.copy2(path, backup)
        write_text(path, new_text)

    return True, total_logs


def iter_js_files(paths: List[Path]) -> List[Path]:
    result: List[Path] = []
    for p in paths:
        if p.is_file() and p.suffix.lower() == ".js":
            result.append(p)
        elif p.is_dir():
            result.extend(sorted(p.rglob("*.js")))
    return sorted(set(result))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("targets", nargs="+", help="검사할 JS 파일 또는 폴더")
    parser.add_argument("--apply", action="store_true", help="실제 수정 적용")
    args = parser.parse_args()

    targets = [Path(x) for x in args.targets]
    files = iter_js_files(targets)

    if not files:
        print("대상 JS 파일이 없습니다.")
        return

    print(f"대상 파일 수: {len(files)}")
    print(f"모드: {'실제 적용' if args.apply else '드라이런'}")
    print("-" * 70)

    changed_count = 0

    for path in files:
        changed, logs = process_file(path, apply=args.apply)
        if changed:
            changed_count += 1
            print(f"[수정대상] {path}")
            for log in logs:
                print(f"  - {log}")
        else:
            print(f"[통과] {path}")
            for log in logs:
                print(f"  - {log}")

    print("-" * 70)
    print(f"변경 필요 파일 수: {changed_count}")
    if not args.apply:
        print("실제 수정하려면 --apply 옵션으로 다시 실행하세요.")


if __name__ == "__main__":
    main()