
from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Tuple, List, Dict, Any

QUESTIONBANK_RE = re.compile(r'window\.questionBank\s*=\s*\[', re.MULTILINE)


@dataclass
class Span:
    start: int
    end: int


@dataclass
class ObjectRef:
    id_value: str
    start: int
    end: int
    text: str


@dataclass
class FieldRef:
    field_name: str
    value_start: int
    value_end: int
    quote: str
    raw_literal: str
    decoded_value: str


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def _consume_js_string(text: str, start: int) -> int:
    quote = text[start]
    i = start + 1
    escaped = False
    while i < len(text):
        ch = text[i]
        if escaped:
            escaped = False
            i += 1
            continue
        if ch == '\\':
            escaped = True
            i += 1
            continue
        if quote == '`' and ch == '$' and i + 1 < len(text) and text[i + 1] == '{':
            # 템플릿 보간은 지원하지 않음
            raise ValueError('템플릿 문자열 보간(${...})은 지원하지 않습니다.')
        if ch == quote:
            return i + 1
        i += 1
    raise ValueError('JS 문자열 종료 따옴표를 찾지 못했습니다.')


def decode_js_string_literal(literal: str) -> str:
    if len(literal) < 2 or literal[0] not in ('"', "'", '`') or literal[-1] != literal[0]:
        raise ValueError('지원하지 않는 JS 문자열 리터럴입니다.')
    quote = literal[0]
    body = literal[1:-1]
    out = []
    i = 0
    while i < len(body):
        ch = body[i]
        if ch != '\\':
            out.append(ch)
            i += 1
            continue
        if i + 1 >= len(body):
            out.append('\\')
            break
        nxt = body[i + 1]
        mapping = {
            'n': '\n',
            'r': '\r',
            't': '\t',
            'b': '\b',
            'f': '\f',
            'v': '\v',
            '\\': '\\',
            '"': '"',
            "'": "'",
            '`': '`',
        }
        if nxt in mapping:
            out.append(mapping[nxt])
            i += 2
        elif nxt == 'x' and i + 3 < len(body):
            out.append(chr(int(body[i + 2:i + 4], 16)))
            i += 4
        elif nxt == 'u':
            if i + 2 < len(body) and body[i + 2] == '{':
                j = body.find('}', i + 3)
                if j == -1:
                    raise ValueError('잘못된 유니코드 이스케이프입니다.')
                out.append(chr(int(body[i + 3:j], 16)))
                i = j + 1
            elif i + 5 < len(body):
                out.append(chr(int(body[i + 2:i + 6], 16)))
                i += 6
            else:
                raise ValueError('잘못된 유니코드 이스케이프입니다.')
        elif nxt == '\n':
            i += 2
        else:
            # JS에서는 알 수 없는 이스케이프도 다음 문자를 그대로 취급
            out.append(nxt)
            i += 2
    return ''.join(out)


def serialize_js_string(value: str, quote: str = '"') -> str:
    if quote not in ('"', "'", '`'):
        raise ValueError('quote는 ", \', ` 중 하나여야 합니다.')
    body = value
    if quote == '`':
        body = body.replace('\\', '\\\\')
        body = body.replace('`', '\\`')
        body = body.replace('${', '\\${')
        return f'`{body}`'
    body = body.replace('\\', '\\\\')
    if quote == '"':
        body = body.replace('"', '\\"')
    else:
        body = body.replace("'", "\\'")
    body = body.replace('\r', '\\r').replace('\n', '\\n')
    return f'{quote}{body}{quote}'


def find_questionbank_array_span(text: str) -> Span:
    m = QUESTIONBANK_RE.search(text)
    if not m:
        raise ValueError('window.questionBank 배열을 찾지 못했습니다.')
    start = text.find('[', m.end() - 1)
    if start == -1:
        raise ValueError('questionBank 배열 시작 [ 를 찾지 못했습니다.')
    depth = 0
    i = start
    in_string = False
    string_quote = ''
    escaped = False
    while i < len(text):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == string_quote:
                in_string = False
            i += 1
            continue
        if ch in ('"', "'", '`'):
            in_string = True
            string_quote = ch
            i += 1
            continue
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return Span(start, i + 1)
        i += 1
    raise ValueError('questionBank 배열 종료 ] 를 찾지 못했습니다.')


def extract_question_objects(text: str) -> List[ObjectRef]:
    arr = find_questionbank_array_span(text)
    array_text = text[arr.start + 1:arr.end - 1]
    objs: List[ObjectRef] = []
    i = 0
    depth = 0
    in_string = False
    string_quote = ''
    escaped = False
    obj_start: Optional[int] = None
    while i < len(array_text):
        ch = array_text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == string_quote:
                in_string = False
            i += 1
            continue
        if ch in ('"', "'", '`'):
            in_string = True
            string_quote = ch
            i += 1
            continue
        if ch == '{':
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and obj_start is not None:
                obj_end = i + 1
                obj_text = array_text[obj_start:obj_end]
                id_value = parse_object_id(obj_text)
                objs.append(ObjectRef(
                    id_value=id_value,
                    start=arr.start + 1 + obj_start,
                    end=arr.start + 1 + obj_end,
                    text=obj_text,
                ))
                obj_start = None
        i += 1
    return objs


def parse_object_id(obj_text: str) -> str:
    m = re.search(r'(?:"id"|\'id\'|id)\s*:\s*', obj_text)
    if not m:
        raise ValueError('객체에서 id 필드를 찾지 못했습니다.')
    i = m.end()
    while i < len(obj_text) and obj_text[i].isspace():
        i += 1
    if i >= len(obj_text):
        raise ValueError('id 값이 비어 있습니다.')
    if obj_text[i] in ('"', "'", '`'):
        end = _consume_js_string(obj_text, i)
        return decode_js_string_literal(obj_text[i:end])
    m_num = re.match(r'-?\d+(?:\.\d+)?', obj_text[i:])
    if not m_num:
        raise ValueError('지원하지 않는 id 값 형식입니다.')
    return m_num.group(0)


def find_object_by_id(text: str, target_id: str) -> ObjectRef:
    target = str(target_id)
    for obj in extract_question_objects(text):
        if obj.id_value == target:
            return obj
    raise ValueError(f'id={target_id} 객체를 찾지 못했습니다.')


def find_field_in_object(obj_text: str, field_name: str) -> FieldRef:
    pattern = re.compile(rf'(?:"{re.escape(field_name)}"|\'{re.escape(field_name)}\'|{re.escape(field_name)})\s*:\s*')
    m = pattern.search(obj_text)
    if not m:
        raise ValueError(f'필드 {field_name} 를 찾지 못했습니다.')
    i = m.end()
    while i < len(obj_text) and obj_text[i].isspace():
        i += 1
    if i >= len(obj_text) or obj_text[i] not in ('"', "'", '`'):
        raise ValueError(f'필드 {field_name} 이 문자열 리터럴이 아닙니다.')
    end = _consume_js_string(obj_text, i)
    literal = obj_text[i:end]
    return FieldRef(
        field_name=field_name,
        value_start=i,
        value_end=end,
        quote=literal[0],
        raw_literal=literal,
        decoded_value=decode_js_string_literal(literal),
    )


def replace_field_decoded_value(obj_text: str, field_name: str, new_value: str) -> str:
    field = find_field_in_object(obj_text, field_name)
    new_literal = serialize_js_string(new_value, field.quote)
    return obj_text[:field.value_start] + new_literal + obj_text[field.value_end:]


def replace_placeholder_in_file(
    file_path: Path,
    target_id: str,
    field_name: str,
    placeholder: str,
    svg_text: str,
    backup: bool = True,
) -> Dict[str, Any]:
    original = file_path.read_text(encoding='utf-8')
    obj = find_object_by_id(original, str(target_id))
    field = find_field_in_object(obj.text, field_name)
    count = field.decoded_value.count(placeholder)
    if count != 1:
        raise ValueError(f'플레이스홀더 개수가 1이 아닙니다. 현재 개수={count}')
    updated_value = field.decoded_value.replace(placeholder, svg_text)
    updated_obj = replace_field_decoded_value(obj.text, field_name, updated_value)
    updated_text = original[:obj.start] + updated_obj + original[obj.end:]

    bak_path = file_path.with_suffix(file_path.suffix + '.bak')
    if backup:
        shutil.copyfile(file_path, bak_path)

    file_path.write_text(updated_text, encoding='utf-8')

    return {
        'file': str(file_path),
        'backup_file': str(bak_path) if backup else None,
        'target_id': str(target_id),
        'field_name': field_name,
        'placeholder': placeholder,
        'placeholder_count_before': count,
        'svg_sha256': sha256_text(svg_text),
        'updated_object_sha256': sha256_text(updated_obj),
    }


def replace_existing_svg_with_placeholder(
    file_path: Path,
    output_path: Path,
    target_id: str,
    field_name: str,
    placeholder: str,
) -> Dict[str, Any]:
    text = file_path.read_text(encoding='utf-8')
    obj = find_object_by_id(text, str(target_id))
    field = find_field_in_object(obj.text, field_name)
    svg_matches = list(re.finditer(r'<svg\b.*?</svg>', field.decoded_value, flags=re.DOTALL))
    if len(svg_matches) != 1:
        raise ValueError(f'대상 필드 내 SVG 개수가 1이 아닙니다. 현재 개수={len(svg_matches)}')
    match = svg_matches[0]
    original_svg = match.group(0)
    new_decoded = field.decoded_value[:match.start()] + placeholder + field.decoded_value[match.end():]
    updated_obj = replace_field_decoded_value(obj.text, field_name, new_decoded)
    updated_text = text[:obj.start] + updated_obj + text[obj.end:]
    output_path.write_text(updated_text, encoding='utf-8')
    return {
        'source_file': str(file_path),
        'output_file': str(output_path),
        'target_id': str(target_id),
        'field_name': field_name,
        'placeholder': placeholder,
        'original_svg_sha256': sha256_text(original_svg),
        'original_svg_length': len(original_svg),
    }


def extract_svg_from_field(text: str, target_id: str, field_name: str) -> str:
    obj = find_object_by_id(text, str(target_id))
    field = find_field_in_object(obj.text, field_name)
    m = re.search(r'<svg\b.*?</svg>', field.decoded_value, flags=re.DOTALL)
    if not m:
        raise ValueError('대상 필드에서 <svg>...</svg> 를 찾지 못했습니다.')
    return m.group(0)


def verify_injection(
    before_file: Path,
    after_file: Path,
    target_id: str,
    field_name: str,
    placeholder: str,
    approved_svg_text: str,
) -> Dict[str, Any]:
    before = before_file.read_text(encoding='utf-8')
    after = after_file.read_text(encoding='utf-8')

    before_obj = find_object_by_id(before, str(target_id))
    after_obj = find_object_by_id(after, str(target_id))

    before_field = find_field_in_object(before_obj.text, field_name)
    after_field = find_field_in_object(after_obj.text, field_name)

    expected_after = before_field.decoded_value.replace(placeholder, approved_svg_text)
    content_exact_match = (after_field.decoded_value == expected_after)
    approved_hash = sha256_text(approved_svg_text)
    inserted_hash = sha256_text(extract_svg_from_field(after, str(target_id), field_name))

    # 비도형 영역 무변경 검사: 대상 객체에서 필드 내용만 expected_after인지 검사
    rebuilt_after_obj = replace_field_decoded_value(before_obj.text, field_name, expected_after)
    non_target_unchanged = (after_obj.text == rebuilt_after_obj)

    # 전체 파일에서 대상 객체만 바뀌었는지 검사
    expected_after_full = before[:before_obj.start] + rebuilt_after_obj + before[before_obj.end:]
    only_target_changed = (after == expected_after_full)

    return {
        'before_file': str(before_file),
        'after_file': str(after_file),
        'target_id': str(target_id),
        'field_name': field_name,
        'approved_svg_sha256': approved_hash,
        'inserted_svg_sha256': inserted_hash,
        'content_exact_match': content_exact_match,
        'non_target_unchanged': non_target_unchanged,
        'only_target_changed': only_target_changed,
        'placeholder_present_before': placeholder in before_field.decoded_value,
        'placeholder_present_after': placeholder in after_field.decoded_value,
    }


def node_syntax_check(file_path: Path) -> Dict[str, Any]:
    result = subprocess.run(
        ['node', '--check', str(file_path)],
        capture_output=True,
        text=True,
        encoding='utf-8',
    )
    return {
        'file': str(file_path),
        'ok': result.returncode == 0,
        'stdout': result.stdout,
        'stderr': result.stderr,
        'returncode': result.returncode,
    }


def write_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


def exam_style_defaults() -> Dict[str, Any]:
    return {
        'width': 160,
        'height': 120,
        'font_family': 'serif',
        'font_size': 10,
        'stroke': 'black',
        'stroke_width': 1,
        'axis_stroke_width': 1.5,
        'grid_stroke': '#eee',
        'grid_size': 20,
    }


def build_geumdang_q5_svg() -> Tuple[str, Dict[str, Any]]:
    # 금당중 5번용 시험지 스타일 SVG
    s = exam_style_defaults()
    svg = f"""<svg width="{s['width']}" height="{s['height']}" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="{s['grid_size']}" height="{s['grid_size']}" patternUnits="userSpaceOnUse"><path d="M {s['grid_size']} 0 L 0 0 0 {s['grid_size']}" fill="none" stroke="{s['grid_stroke']}" stroke-width="1"/></pattern></defs><rect width="160" height="120" fill="url(#grid)"/><line x1="0" y1="100" x2="160" y2="100" stroke="{s['stroke']}" stroke-width="{s['axis_stroke_width']}"/><path d="M 60 100 A 56.57 56.57 0 0 1 116.57 100" fill="none" stroke="{s['stroke']}" stroke-width="{s['stroke_width']}"/><path d="M 3.43 100 A 56.57 56.57 0 0 1 60 100" fill="none" stroke="{s['stroke']}" stroke-width="{s['stroke_width']}"/><line x1="60" y1="100" x2="100" y2="100" stroke="blue" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="60" stroke="blue" stroke-width="2"/><line x1="60" y1="100" x2="100" y2="60" stroke="red" stroke-width="2"/><text x="58" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">2</text><text x="18" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">0</text><text x="38" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">1</text><text x="78" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">3</text><text x="98" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">4</text><text x="118" y="115" font-family="{s['font_family']}" font-size="{s['font_size']}">5</text><text x="55" y="95" font-family="{s['font_family']}" font-size="{s['font_size']}">A</text><text x="102" y="112" font-family="{s['font_family']}" font-size="{s['font_size']}">B</text><text x="102" y="58" font-family="{s['font_family']}" font-size="{s['font_size']}">C</text><text x="116" y="95" font-family="{s['font_family']}" font-size="{s['font_size']}">P</text><text x="3" y="95" font-family="{s['font_family']}" font-size="{s['font_size']}">Q</text></svg>"""
    card = {
        'question': '25_금당중_1학기_중간_중3_기출.js / id 5',
        'viewBox': '0 0 160 120',
        'width': 160,
        'height': 120,
        '핵심점': {
            'A': [60, 100],
            'B': [100, 100],
            'C': [100, 60],
            'P': [116.57, 100],
            'Q': [3.43, 100],
        },
        '특수요소': {
            '모눈패턴': 1,
            '원호': 2,
            '삼각형 선분': 3,
        },
        '라벨': ['A', 'B', 'C', 'P', 'Q', '0', '1', '2', '3', '4', '5'],
        '조건반영': {
            '한_눈금': '20px',
            'AB': 2,
            'BC': 2,
            'AC': '2√2',
            '원_반지름': 'AC',
            '좌표_기준': 'A=2, B=4, C=(4,2격자 위)',
        },
        '승인후_고정값': [
            'viewBox=0 0 160 120',
            'A=(60,100)',
            'B=(100,100)',
            'C=(100,60)',
            '원호 반지름=56.57',
        ],
        'svg_sha256': sha256_text(svg),
    }
    return svg, card
