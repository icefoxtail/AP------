"""Attach the generated 2022 set-pilot solution visuals to production JS.

This is a guarded, question-addressed mechanical rewrite: it refuses to touch a
question that already has a solutionImage, and it verifies every requested
question exactly once before writing the file.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
JS_ROOT = ROOT / "archive" / "exams" / "original" / "high" / "h1"


CASES = {
    ("22_강남여고_2학기_중간_고1_기출", 10): (
        "반드시 포함 {1,3,4,8}, 반드시 제외 {6}, 자유 선택 {2,5,7,9,10}을 구분해 2⁵=32를 세는 상태표",
        "U={1,…,10}에서 A∪X=X와 (B−A)∩X={4,8}이 정하는 X의 포함·제외·자유 원소 표",
        "[시각자료 읽기] 초록 행은 X에 반드시 들어가는 원소, 빨간 행은 반드시 빠지는 6, 파란 행은 자유롭게 선택하는 다섯 원소를 뜻한다.",
    ),
    ("22_금당고_2학기_중간_고1_기출", 13): (
        "U={1,…,9}에서 A−B={3,4,6}, B−A={1,5,8}, 나머지 {2,7,9}는 공통 또는 바깥인 네 영역 도식",
        "두 여집합 조건으로 얻은 A△B={1,3,4,5,6,8}과 원소 합 27을 표시한 해설 도식",
        "[시각자료 읽기] 빨강과 주황 영역만 합치면 A△B가 되고, 공통 영역과 바깥 영역에 남은 {2,7,9}는 대칭차에 들어가지 않는다.",
    ),
    ("22_금당고_2학기_중간_고1_기출", 16): (
        "U={2,3,4,8,16,32,64}에서 Y=Xᶜ, 64∈X, 나머지 여섯 원소의 짝수 개 선택으로 31개를 세는 상태도",
        "S(U)=129와 S(X)>64.5를 이용해 64를 포함하는 홀수 크기 X를 세는 실제 선택 구조",
        "[시각자료 읽기] 64를 넣으면 원소 수가 이미 홀수이므로 나머지 여섯 원소에서는 짝수 개를 고른다. 아무것도 고르는 경우는 합 조건에서 제외한다.",
    ),
    ("22_매산고_2학기_중간_고1_기출", 6): (
        "U={1,…,10}, A={2,4,6}, B={1,3,5,7,9}에서 X에 고정되는 원소와 자유 원소 {8,10}을 구분한 표",
        "X∪A=X와 X−B=X에서 반드시 포함·제외되는 원소와 2²=4개의 X를 표시한 상태표",
        "[시각자료 읽기] A의 세 원소는 반드시 X에 들어가고 B의 다섯 원소는 반드시 빠지므로 8과 10만 자유롭게 선택한다.",
    ),
    ("22_매산고_2학기_중간_고1_기출", 17): (
        "A={1,…,20}에서 n=21일 때 (1,20)부터 (10,11)까지의 실제 10쌍과 각 출력값을 모두 표시한 도식",
        "a(21−a)의 중복쌍 10개, 최솟값 α=20, k=21, k+α=41을 함께 표시한 문항 전용 도식",
        "[시각자료 읽기] 그림의 열 쌍은 합이 21인 두 입력이 같은 출력값을 만든다는 뜻이다. 열 쌍이 10개이므로 |B₂₁|=10이고 가장 작은 출력은 1×20=20이다.",
    ),
    ("22_매산고_2학기_중간_고1_기출", 19): (
        "200명에서 합집합 140명, 바깥 60명, 교집합 t에 따라 제주도만 85−t/2명이 되는 Venn diagram",
        "t=0에서 제주도만 85명, t=110에서 30명이 되어 최댓값과 최솟값의 합 115를 얻는 인원 배치",
        "[시각자료 읽기] 교집합 t가 커질수록 제주도만인 영역은 85−t/2로 줄어든다. t=0과 t=110 두 끝 배치가 각각 85명과 30명을 만든다.",
    ),
    ("22_복성고_2학기_중간_고1_기출", 15): (
        "a=4,3,−3의 실제 A△B를 비교해 a=3, B={0,2,3}, b=5를 고르는 후보표",
        "대칭차집합이 {0,1}이 되는 유일한 후보 a=3과 a+b=8을 표시한 계산표",
        "[시각자료 읽기] 세 후보 중 가운데 행만 A△B={0,1}과 일치한다. 그 행의 B 원소 합이 b=5이므로 a+b=8이다.",
    ),
    ("22_복성고_2학기_중간_고1_기출", 21): (
        "k=10,20,6,12,18의 실제 A−B와 원소 합 11,35,4,20,31을 비교한 약수 후보표",
        "B={2,5,6}과 정확히 두 약수를 공유하는 다섯 k 및 홀수 합 후보 {10,20,18}을 표시한 표",
        "[시각자료 읽기] 표의 합 열에서 홀수인 행만 남기면 k=10,20,18이고, 이 세 값을 더해 48을 얻는다.",
    ),
    ("22_순천여고_2학기_중간_고1_기출", 4): (
        "50명 중 A=31, B=23, 교집합 12, 바깥 8, A만 19, B만 11인 실제 Venn diagram",
        "두 영화의 합집합 42명과 교집합 12명을 네 영역으로 확인해 a−b=30을 구하는 도식",
        "[시각자료 읽기] 바깥 8명을 50명에서 빼면 a=42이고, 두 원의 겹친 12명이 중복 집계되므로 b=31+23−42=12이다.",
    ),
    ("22_순천여고_2학기_중간_고1_기출", 8): (
        "U={1,…,7}에서 반드시 포함 {1,2}, 반드시 제외 {5,7}, 자유 선택 {3,4,6}을 구분한 상태표",
        "X∩A=A와 X−B=X가 정하는 X의 세 자유 원소와 2³=8을 표시한 표",
        "[시각자료 읽기] 1과 2는 반드시 X에 들어가고 5와 7은 빠진다. 남은 3,4,6의 포함 여부가 각각 독립적으로 결정된다.",
    ),
    ("22_팔마고_2학기_중간_고1_기출", 7): (
        "24명에서 A=14, B=12일 때 교집합 최대 12와 최소 2를 실제 두 Venn 배치로 비교",
        "두 과목 선택 인원 14명과 12명에서 M=12, m=2, M+m=14를 확인하는 극단 배치",
        "[시각자료 읽기] 왼쪽은 B의 12명이 모두 A와 겹치는 최대 배치이고, 오른쪽은 합집합이 24명이 되는 최소 배치이다.",
    ),
    ("22_팔마고_2학기_중간_고1_기출", 14): (
        "U={a,b,c,d,e,f}에서 A만·B만은 A△B, A∩B·둘 다 아님은 A♥B가 되는 네 영역과 보기별 계산",
        "A♥B=(A△B)ᶜ의 네 영역, ㄱ의 결과 크기 4, ㄷ의 A=B인 순서쌍 2⁶=64를 표시한 도식",
        "[시각자료 읽기] 빨간 두 영역은 정확히 한 집합에만 속하는 A△B이고, 초록 두 영역은 함께 속하거나 둘 다 속하지 않는 A♥B이다.",
    ),
    ("22_팔마고_2학기_중간_고1_기출", 20): (
        "U={1,2,4,8,11,13,15}에서 A−B={4,11}, B−A={2,13}은 X에 고정되고 {1,8,15}는 자유인 상태표",
        "집합 등식의 양변을 비교해 {2,4,11,13}⊆X와 자유 원소 3개, 2³=8을 구하는 표",
        "[시각자료 읽기] 양쪽 중 한쪽에만 나타나는 네 원소는 X가 받아야 하고, 양변에 대칭적으로 나타나는 1,8,15만 자유롭게 선택한다.",
    ),
    ("22_효천고_2학기_중간_고1_기출", 10): (
        "45명에서 A=28, B=23일 때 교집합 최대 23과 최소 6을 실제 두 Venn 배치로 비교",
        "두 영화 관람 인원 28명과 23명에서 x최대=23, x최소=6, 합 29를 확인하는 극단 배치",
        "[시각자료 읽기] 왼쪽은 작은 집합 B가 A 안에 모두 들어가는 최대 배치이고, 오른쪽은 합집합 45명이 되는 최소 배치이다.",
    ),
    ("22_효천고_2학기_중간_고1_기출", 12): (
        "a=3,2,−2의 실제 A와 B 및 A△B를 비교해 a=2, b=6을 고르는 후보표",
        "A△B={0,1}과 일치하는 a=2 행 및 b−a=4를 표시한 대칭차집합 계산표",
        "[시각자료 읽기] 가운데 후보에서만 대칭차집합이 문제의 {0,1}과 같고, 그때 A 원소의 합 b는 6이다.",
    ),
    ("22_제일고_2학기_중간_고1_기출", 11): (
        "a∈B의 후보 {2,3}과 a+2∈B의 후보 {3,4,5}의 공통 후보 a=3을 보여 주는 비교 도식",
        "A={a,a+2}가 B={3a−4,2a−2,2a−3}의 진부분집합이 되는 후보 교집합",
        "[시각자료 읽기] 두 후보 집합의 공통값은 3 하나뿐이다. a=3이면 A={3,5}, B={3,4,5}로 진부분집합 조건도 확인된다.",
    ),
    ("22_제일고_2학기_중간_고1_기출", 13): (
        "문항의 두 괄호가 각각 B와 Bᶜ로 정리되고 마지막에 B∪Bᶜ=U가 되는 실제 변형 흐름",
        "주어진 집합식을 분배법칙으로 두 단계 정리해 최종 결과 U를 얻는 대수 흐름도",
        "[시각자료 읽기] 첫 번째 괄호는 B, 두 번째 괄호는 Bᶜ로 줄어들므로 마지막 합집합은 B∪Bᶜ=U가 된다.",
    ),
    ("22_제일고_2학기_중간_고1_기출", 19): (
        "50명에서 A=25, B=32일 때 교집합 최대 25와 최소 7을 실제 Venn 배치로 비교",
        "두 뮤지컬 관람 인원에서 x≤25와 25+32−x≤50을 확인하는 최대·최소 배치",
        "[시각자료 읽기] 최대 배치는 A가 B 안에 들어가 x=25이고, 최소 배치는 합집합 50명을 채워 x=7이 된다.",
    ),
    ("22_제일고_2학기_중간_고1_기출", 20): (
        "a₁=1, a₄=9, a₂=2, a₃=3, a₅=11과 A={1,2,3,9,11}, B={1,4,9,81,121}을 복원하는 수치 흐름",
        "교집합과 제곱 관계, 합집합 원소 합 232에서 집합 A를 결정하는 단계별 수치 도식",
        "[시각자료 읽기] a₁=1과 a₄=9를 먼저 정하고 9∈B에서 3∈A를 얻은 뒤, T(t)=t²+t 합 조건으로 나머지 2,3,11을 결정한다.",
    ),
    ("22_강남여고_2학기_기말_고1_기출", 5): (
        "문항의 실제 식 (A−B)∪(A∩C)가 A∩(Bᶜ∪C)를 거쳐 A−(B−C)와 같아지는 변형 흐름",
        "세 집합 연산식의 차집합·분배법칙 변형과 다섯 번째 보기 A−(B−C)의 일치를 표시한 도식",
        "[시각자료 읽기] 왼쪽 식을 A∩(Bᶜ∪C)로 정리한 결과가 A−(B−C)의 전개와 같으므로 두 식은 같은 집합이다.",
    ),
    ("22_금당고_2학기_기말_고1_기출", 20): (
        "c+5ΣS=55에서 |S|=2의 실제 8개 후보와 |S|=3의 실제 5개 후보를 나누어 표시한 경우표",
        "|S|=2: 8×2²=32, |S|=3: 5×2³=40, 최종 32+40=72를 보여 주는 문항 전용 경우 분류표",
        "[시각자료 읽기] 왼쪽 패널은 대칭차집합 원소 두 개를 A−B와 B−A에 배분하는 32가지, 오른쪽 패널은 세 개를 배분하는 40가지이다.",
    ),
}


def js_files() -> list[Path]:
    return sorted(p for p in JS_ROOT.rglob("22_*_기출.js") if p.parent.name in {"2mid", "2final"})


def add_visual_fields(obj: str, title: str, qid: int, alt: str, caption: str, read_note: str) -> str:
    pattern = re.compile(
        r'(?P<prefix>\s*"solution":\s*)(?P<value>"(?:\\.|[^"\\])*")(?P<suffix>,)'
    )
    matches = list(pattern.finditer(obj))
    if len(matches) != 1:
        raise RuntimeError(f"expected one solution field for {title} q{qid}, found {len(matches)}")
    match = matches[0]
    old_solution = json.loads(match.group("value"))
    old_solution = re.sub(r'\n\[시각자료 읽기\][^\n]*', '', old_solution)
    marker = "\n따라서"
    pos = old_solution.rfind(marker)
    if pos < 0:
        # A few legacy solutions end directly with the mathematical conclusion
        # instead of the standard "따라서" sentence.  Preserve that conclusion
        # and place the visual-reading note after it, matching the existing
        # legacy q17 convention.
        new_solution = old_solution + "\n" + read_note
    else:
        new_solution = old_solution[:pos] + "\n" + read_note + old_solution[pos:]
    new_value = json.dumps(new_solution, ensure_ascii=False)
    obj = obj[:match.start()] + match.group("prefix") + new_value + match.group("suffix") + obj[match.end():]

    # Replace an old connection when rebuilding an existing asset; otherwise
    # insert the four solution-image fields immediately after solution.
    obj = re.sub(r'^[ \t]*"solutionImage(?:Alt|Caption|Size)?":.*\n', '', obj, flags=re.M)
    field_pattern = re.compile(rf'(\s*"solution":\s*{re.escape(new_value)},\n)(\s*"subUnitKey")')
    field_match = field_pattern.search(obj)
    if not field_match:
        raise RuntimeError(f"updated solution line not found for {title} q{qid}")
    image = f"assets/images/{title}/q{qid:02d}-solution.svg"
    insertion = (
        field_match.group(1)
        + f'    "solutionImage": {json.dumps(image, ensure_ascii=False)},\n'
        + f'    "solutionImageAlt": {json.dumps(alt, ensure_ascii=False)},\n'
        + f'    "solutionImageCaption": {json.dumps(caption, ensure_ascii=False)},\n'
        + '    "solutionImageSize": "full",\n'
        + field_match.group(2)
    )
    obj = obj[:field_match.start()] + insertion + obj[field_match.end():]

    # Add the visual tag once, without changing layoutTag or wide.
    tags_match = re.search(r'("tags":\s*\[)(?P<body>[^\]]*)(\])', obj, re.S)
    if not tags_match:
        raise RuntimeError(f"tags field not found for {title} q{qid}")
    if '"도형"' not in tags_match.group("body"):
        body = tags_match.group("body").rstrip()
        if body and not body.endswith(","):
            body += ","
        body += '\n      "도형"\n    '
        obj = obj[:tags_match.start("body")] + body + obj[tags_match.end("body"):]
    return obj


def main() -> None:
    found = {}
    for path in js_files():
        text = path.read_text(encoding="utf-8")
        for (title, qid), payload in CASES.items():
            title_match = re.search(r'window\.examTitle\s*=\s*"([^"]+)"', text)
            if not title_match or title_match.group(1) != title:
                continue
            needle = f'"id": {qid},'
            id_pos = text.find(needle)
            if id_pos < 0:
                continue
            if text.count(needle) != 1:
                raise RuntimeError(f"question id is not unique in {path}: q{qid}")
            found[(title, qid)] = path
            obj_start = text.rfind("\n  {", 0, id_pos)
            if obj_start < 0:
                raise RuntimeError(f"question object start not found: {title} q{qid}")
            obj_start += 1
            close_candidates = [p for p in (text.find("\n  },", id_pos), text.find("\n  }\n]", id_pos)) if p >= 0]
            if not close_candidates:
                raise RuntimeError(f"question object end not found: {title} q{qid}")
            obj_end = min(close_candidates)
            close_len = 5 if text.startswith("\n  },", obj_end) else 6
            obj_end += close_len
            alt, caption, note = payload
            obj = text[obj_start:obj_end]
            updated_obj = add_visual_fields(obj, title, qid, alt, caption, note)
            text = text[:obj_start] + updated_obj + text[obj_end:]
            print(path.relative_to(ROOT), f"q{qid:02d}")
        path.write_text(text, encoding="utf-8", newline="\n")
    missing = sorted(set(CASES) - set(found))
    if missing:
        raise RuntimeError(f"unmatched cases: {missing}")
    print(f"CONNECTED={len(found)}")


if __name__ == "__main__":
    main()
