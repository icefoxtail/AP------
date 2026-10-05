import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXAM_ID = "22_매산여고_1학기_중간_고1_기출"
BASE = ROOT / "archive" / "_generated" / "past-exams" / "high1_2022_2025" / "1mid" / EXAM_ID
CANDIDATE = BASE / "candidate" / f"{EXAM_ID}.candidate.js"
PAGES = BASE / "pages"


DATA = {
    "1": {
        "type": "객관식",
        "page": 1,
        "content": "다항식 (2x^2+3x+4)(x^3+x^2-3x+5)의 전개식에서 x^2의 계수를 구하시오. [3.4점]",
        "choices": ["5", "10", "15", "20", "25"],
    },
    "2": {
        "type": "객관식",
        "page": 1,
        "content": "다음은 조립제법을 이용하여 (3x^3+7x^2+5x+2)÷(3x+1)의 몫과 나머지를 구하는 과정이다. 두 다항식 P(x), Q(x)와 네 실수 a,b,c,d에 대하여 P(1)+Q(1)+a+bc-d의 값을 구하시오. [3.6점]\n3x+1=3(x+1/3)이므로 아래의 조립제법에서\n3x^3+7x^2+5x+2=(x+1/3)(P(x))+a=(3x+1)(Q(x))+a\n따라서 구하는 몫은 Q(x)이고, 나머지는 a이다.\n조립제법: b | 3 7 5 2 / -1 d -1 / 3 c 3 | a",
        "choices": ["17", "18", "19", "20", "21"],
    },
    "3": {
        "type": "객관식",
        "page": 1,
        "content": "실수 a,b에 대하여 이차방정식 ax^2+bx+27=0의 한 근이 5+√2 i일 때, a-b의 값을 구하시오. (단, i=√-1이다.) [3.7점]",
        "choices": ["-33", "-11", "0", "11", "33"],
    },
    "4": {
        "type": "객관식",
        "page": 1,
        "content": "다음 중 인수분해가 잘못된 것을 고르시오. [3.8점]",
        "choices": [
            "x^3-27=(x-3)(x^2+3x+9)",
            "(x^2+3x)(x^2+3x-3)-18=(x^2+3x+3)(x^2+3x-5)",
            "x^2+y^2-z^2-2xy=(x-y+z)(x-y-z)",
            "x^2+y^2+z^2+2xy-2yz-2zx=(x+y-z)^2",
            "x^4-1=(x+1)(x-1)(x^2+1)",
        ],
    },
    "5": {
        "type": "객관식",
        "page": 2,
        "content": "복소수 z=ix^2+(2i+1)x-3(i+1)에 대하여 z^2이 음의 실수일 때, 실수 x의 값을 구하시오. (단, i=√-1이다.) [3.9점]",
        "choices": ["-3", "-1", "0", "1", "3"],
    },
    "6": {
        "type": "객관식",
        "page": 2,
        "content": "0≤x≤5에서 이차함수 y=-1/3 x^2+2x+k의 최솟값이 3일 때, 최댓값을 구하시오. [4점]",
        "choices": ["3", "4", "5", "6", "7"],
    },
    "7": {
        "type": "객관식",
        "page": 2,
        "content": "이차항의 계수가 1인 두 이차 다항식 f(x)와 g(x)에 대하여 f(x)g(x)=x^4+2x^3-7x^2-20x-12이다. 두 다항식 f(x), g(x)가 모두 x-a로 나누어떨어질 때, f(3)+g(3)의 값을 구하시오. (단, a는 상수이다.) [4.1점]",
        "choices": ["16", "17", "18", "19", "20"],
    },
    "8": {
        "type": "객관식",
        "page": 2,
        "content": "a,b가 3이하의 자연수이다. 이차방정식 x^2+ax+b=0이 실근을 가질 때, 순서쌍 (a,b)의 개수를 구하시오. [4.1점]",
        "choices": ["3", "4", "5", "6", "7"],
    },
    "9": {
        "type": "객관식",
        "page": 3,
        "content": "두 실수 a,b에 대하여 이차함수 f(x)=x^2+2(a-3k)x+9k^2-6k+b의 그래프가 실수 k의 값에 관계없이 항상 x축에 접할 때, a-b의 값을 구하시오. [4.1점]",
        "choices": ["-2", "-1", "0", "1", "2"],
    },
    "10": {
        "type": "객관식",
        "page": 3,
        "content": "다음의 그림과 같이 이차함수 y=x^2의 그래프와 직선 y=kx+1가 두 점 A, B에서 만난다. 선분 AB가 y축과 만나는 점을 C라 하면 AC:CB=1:2일 때, 양수 k의 값을 구하시오. [4.3점]",
        "choices": ["√3/3", "1/2", "√2/2", "1", "√2"],
    },
    "11": {
        "type": "객관식",
        "page": 3,
        "content": "오른쪽 그림과 같이 AB=c, BC=a, CA=b인 삼각형 ABC의 각 변에 각 변을 지름으로 하는 반원을 그렸다. ab+bc+ca=104이고, 세 반원의 호의 길이의 합이 9π일 때, 색칠한 부분의 넓이를 구하시오. [4.3점]",
        "choices": ["25/2π", "13π", "27/2π", "14π", "29/2π"],
    },
    "12": {
        "type": "객관식",
        "page": 3,
        "content": "x에 대한 다항식 f(x)를 x-1로 나누었을 때의 나머지는 4이고, (x-2)^2으로 나누었을 때의 나머지는 2x+5이다. f(x)를 (x-2)^2(x-1)로 나누었을 때의 나머지를 구하시오. [4.6점]",
        "choices": ["-3x^2+12x-7", "-3x^2+14x-5", "-3x^2+14x-7", "x^2-2x+9", "x^2+6x+9"],
    },
    "13": {
        "type": "객관식",
        "page": 4,
        "content": "a<0<b일 때, √(b-a)/√(a-b)+√(4a)/√(-a)-√b/√(-b)를 간단히 하시오. [4.5점]",
        "choices": ["3i", "2i", "i", "0", "-i"],
    },
    "14": {
        "type": "객관식",
        "page": 4,
        "content": "x^2-6xy+ky^2-2x+2y-3을 x,y에 대한 두 일차식의 곱으로 나타낼 수 있을 때, 실수 k의 값을 구하시오. [4.3점]",
        "choices": ["5", "6", "7", "8", "9"],
    },
    "15": {
        "type": "객관식",
        "page": 4,
        "content": "z가 복소수일 때, <보기>에서 옳은 것만을 있는 대로 고르시오. [4.9점]\n<보기>\nㄱ. z/(1+z)가 실수이면 z는 실수이다.\nㄴ. z가 실수가 아니고 (z-2)^2이 실수이면, z+z̄=2이다.\nㄷ. z=a+bi(a,b는 0이 아닌 실수)에 대하여 iz=-z̄이면 z/z̄+z̄/z=0이다.",
        "choices": ["ㄱ", "ㄴ, ㄷ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄱ, ㄴ, ㄷ"],
    },
    "16": {
        "type": "객관식",
        "page": 4,
        "content": "점 (a,2)를 지나고 이차함수 y=x^2+3x+4의 그래프에 접하는 두 직선의 기울기의 합이 2일 때, 실수 a의 값을 구하시오. [4.6점]",
        "choices": ["-1", "0", "1", "2", "3"],
    },
    "17": {
        "type": "객관식",
        "page": 5,
        "content": "-1≤x≤3에서 함수 f(x)=-x^2+2ax-2a+4의 최댓값과 최솟값의 합이 0이 되도록 하는 모든 실수 a의 값의 합을 구하시오. [4.8점]",
        "choices": ["0", "2", "4", "6", "8"],
    },
    "단답형1": {
        "type": "단답형",
        "page": 5,
        "content": "복소수 z=(1-i)/(1+i)에 대하여 f(n)=z^n이라 할 때, f(1)+f(2)+f(3)+...+f(n)=-1인 50이하의 자연수 n의 개수를 구하시오. (단, i=√-1이다.) [4점]",
        "choices": [],
    },
    "단답형2": {
        "type": "단답형",
        "page": 5,
        "content": "모든 실수 x에 대하여 등식 (3x^2-x-2)^4=a8x^8+a7x^7+...+a1x+a0이 성립할 때, a2+a4+a6+a8의 값을 구하시오. (단, a0,a1,a2,...,a8은 상수이다.) [4점]",
        "choices": [],
    },
    "서술형1": {
        "type": "서술형",
        "page": 5,
        "content": "다항식 f(x)는 x로 나누어떨어지고, x-1로 나눈 나머지가 1, x+1로 나눈 나머지가 -5이다. f(x)를 x^3-x로 나눈 나머지를 구하는 과정을 서술하시오. [7점](부분점수 있음.)",
        "choices": [],
    },
    "서술형2": {
        "type": "서술형",
        "page": 6,
        "content": "이차함수 f(x)는 모든 x에 대하여 f(3-x)=f(3+x)를 만족시킨다. f(x)의 최댓값은 5이고, (0,-4)를 지날 때, 다음 물음에 답하시오. [7점](부분점수 있음.)\n(1) f(x)를 구하는 과정을 서술하시오. [3점]\n(2) 0≤x≤4에서 y={f(x)}^2+4f(x)-3의 최댓값과 최솟값을 구하는 과정을 서술하시오. [4점]",
        "choices": [],
    },
    "서술형3": {
        "type": "서술형",
        "page": 6,
        "content": "세 변의 길이가 a,b,c인 삼각형 ABC가 다음 조건을 만족시킨다.\n(가) a^2b-a^2c+2ab^2-abc-ac^2+b^3-bc^2=0\n(나) b+c=20\n(다) 5a=6b\n삼각형 ABC의 넓이를 구하는 과정을 서술하시오. [7점](부분점수 있음.)",
        "choices": [],
    },
}


def page_path(page_no: int) -> str:
    return str(PAGES / f"page_p{page_no:03d}.png")


def main() -> None:
    text = CANDIDATE.read_text(encoding="utf-8")
    prefix, rest = text.split("window.questionBank = ", 1)
    array_text, suffix = rest.rsplit(";", 1)
    original = json.loads(array_text)

    if len(original) != 23:
        raise SystemExit(f"Expected scaffold count 23 before reconcile, got {len(original)}")

    questions = [q for q in original if q["displayNo"] != "단답형3"]
    if len(questions) != 22:
        raise SystemExit(f"Expected reconciled count 22, got {len(questions)}")

    seen = []
    for idx, q in enumerate(questions, start=1):
        display_no = q["displayNo"]
        if display_no not in DATA:
            raise SystemExit(f"Unexpected displayNo: {display_no}")
        item = DATA[display_no]
        q["id"] = idx
        q["sourceQuestionNo"] = display_no
        q["questionType"] = item["type"]
        q["content"] = item["content"]
        q["choices"] = item["choices"]
        q["pageNo"] = item["page"]
        q["image"] = page_path(item["page"])
        q["fullPageImagePath"] = page_path(item["page"])
        q["imageStatus"] = "full_page_evidence"
        q["reviewStatus"] = "round18_latestB_content_choices_restored_reconciled"
        seen.append(display_no)

    missing = set(DATA) - set(seen)
    if missing:
        raise SystemExit(f"Missing displayNos in candidate: {sorted(missing)}")

    rendered = prefix + "window.questionBank = " + json.dumps(
        questions, ensure_ascii=False, indent=2
    ) + ";" + suffix
    CANDIDATE.write_text(rendered, encoding="utf-8")
    objective_complete = sum(1 for q in questions if q["questionType"] == "객관식" and len(q["choices"]) == 5)
    print(f"updated={CANDIDATE}")
    print("removed=단답형3")
    print("type_relabelled=단답형1,단답형2")
    print(f"content_restored={len(questions)}")
    print(f"objective_choice_sets_restored={objective_complete}")


if __name__ == "__main__":
    main()
