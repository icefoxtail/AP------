import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXAM_ID = "24_매산여고_1학기_중간_고1_기출"
BASE = ROOT / "archive" / "_generated" / "past-exams" / "high1_2022_2025" / "1mid" / EXAM_ID
CANDIDATE = BASE / "candidate" / f"{EXAM_ID}.candidate.js"
PAGES = BASE / "pages"


DATA = {
    "1": {
        "content": "두 다항식 A=x^3-3x^2+5x, B=2x^2-x+3일 때, A-2B를 계산하면? [3.5점]",
        "choices": ["x^3-5x^2+6x-3", "x^3-7x^2+7x-6", "x^3-5x^2-7x-3", "2x^3+7x^2-7x-6", "2x^3-7x^2-7x+3"],
        "page": 1,
    },
    "2": {
        "content": "다항식 P(x)=x^3-2x+1를 x+1로 나누었을 때, 나머지를 구하면? [3.6점]",
        "choices": ["0", "1", "2", "-1", "-2"],
        "page": 1,
    },
    "3": {
        "content": "다음 <보기>에서 인수분해가 바른 것을 모두 고르면? [3.7점]\n<보기>\nㄱ. (2x-y+3)(2x-y-6)+14=(2x-y+1)(2x-y-4)\nㄴ. 8x^3-1=(2x-1)(4x^2+2x+1)\nㄷ. x^3+x^2-x-1=(x-1)(x+1)^2",
        "choices": ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄷ", "ㄱ, ㄴ", "ㄴ, ㄷ", "ㄴ"],
        "page": 1,
    },
    "4": {
        "content": "다음에서 다항식 x^4-3x^3+x^2+3x-2의 인수가 아닌 것은? [3.7점]",
        "choices": ["x-2", "x-1", "x^2-3x+2", "x^2-2x+1", "x^2+1"],
        "page": 1,
    },
    "5": {
        "content": "다음 등식에서 다항식 A를 f(x), 다항식 B를 g(x)라 할 때, f(0)+g(1)의 값을 구하면? [3.9점]\n3x^3+7x^2+5x+2=(x+1/3)A+1=(3x+1)B+1",
        "choices": ["4", "5", "6", "7", "8"],
        "page": 1,
    },
    "6": {
        "content": "다음에서 A+B의 값을 구하면? [4.0점]\n가. x^2-5x+1=0일 때, 식 x^2+1/x^2의 값은 A이다.\n나. x=1-√5, y=1+√5일 때, 식 x^3-y^3의 값은 B이다.",
        "choices": ["24+16√5", "23-16√5", "-23+16√5", "-24-16√5", "16-23√5"],
        "page": 2,
    },
    "7": {
        "content": "복소수 z=(4-i)x+2(1-i)에 대하여 복소수 z가 실수가 되도록 하는 실수 x의 값을 a라 하고, 복소수 z가 순허수가 되도록 하는 실수 x의 값을 b라 할 때, ab의 값을 구하면? [3.5점]",
        "choices": ["-2", "-1", "0", "1", "2"],
        "page": 2,
    },
    "8": {
        "content": "두 복소수 α, β가 α=3+2i, β=2-3i일 때, αβ̄+ᾱβ의 값을 구하면? (단, ᾱ, β̄는 각각 α, β의 켤레복소수이다.) [3.8점]",
        "choices": ["-2+4i", "4-18i", "0", "12+4i", "12-18i"],
        "page": 2,
    },
    "9": {
        "content": "이차식 f(x)가 모든 실수 x에 대하여 (x-3)^2 f(x)=x^4-5x^3+6x^2+px+q를 만족시킬 때, 상수 p와 q에 대하여 p+q+f(1)의 값은? [4.0점]",
        "choices": ["23", "24", "25", "26", "27"],
        "page": 2,
    },
    "10": {
        "content": "이차함수 y=-x^2+4x+k의 그래프가 x축과 만나고, 직선 y=2x+3과는 만나지 않도록 하는 모든 정수 k의 값의 합을 구하면? [3.6점]",
        "choices": ["-10", "-9", "-8", "-7", "-6"],
        "page": 3,
    },
    "11": {
        "content": "x의 값의 범위가 -2≤x≤3일 때, 이차함수 y=x^2-4x+k의 최솟값은 4이다. 이 범위에서 이차함수의 최댓값을 구하면? [4.0점]",
        "choices": ["5", "8", "13", "20", "29"],
        "page": 3,
    },
    "12": {
        "content": "두 실수 a,b가 (a+3)^2+(b+4)^2=17, a+b=√17을 만족시킬 때, (a+3)(b+4)=m+n√17이라 하자. 이때 두 유리수 m,n에 대하여 m-n의 값을 구하면? [4.2점]",
        "choices": ["15/2", "23/2", "35/2", "23", "35"],
        "page": 3,
    },
    "13": {
        "content": "이차방정식 x^2+mx+n=0의 두 근을 α, β(α<β)라 하면 이차방정식 3x^2+mx-1=0의 두 근은 α+2, -1/β일 때, 실수 m,n에 대하여 m-n의 값은? [4.2점]",
        "choices": ["1", "2", "3", "4", "5"],
        "page": 3,
    },
    "14": {
        "content": "다항식 f(x)를 x^2+x+1로 나누었을 때의 몫이 Q1(x), 나머지가 2x+6이고, Q1(x)를 x^2-x+1로 나누었을 때의 몫이 (x-1)Q2(x), 나머지가 2x-3이다. f(x)를 x^3-1로 나누었을 때의 나머지를 R(x)라 할 때, R(2)의 값을 구하면? [4.3점]",
        "choices": ["2", "3", "4", "5", "6"],
        "page": 4,
    },
    "15": {
        "content": "함수 f(x)={x^2+2x-1 (-1≤x≤0), x^2-2x-1 (0<x≤2)}에 대하여 함수 y=-{f(x)}^2+6f(x)-3의 최댓값과 최솟값의 합은? [4.1점]",
        "choices": ["-13", "-17", "-21", "-25", "-29"],
        "page": 4,
    },
    "16": {
        "content": "x에 대한 사차방정식 x^4-(2a+1)x^2+a^2+a-12=0의 서로 다른 실근의 개수를 f(a)라 할 때, f(-2)+f(4)의 값을 구하면? [4.0점]",
        "choices": ["2", "3", "4", "5", "6"],
        "page": 4,
    },
    "17": {
        "content": "실수가 아닌 복소수 z에 대하여 z+1/z과 z^2/(z+1)이 모두 실수일 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, z̄는 z의 켤레복소수이다.) [4.4점]\n<보기>\nㄱ. zz̄=1\nㄴ. z+z̄=1\nㄷ. (z^4+2z^2)(z^2+2z)=3",
        "choices": ["ㄱ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"],
        "page": 4,
    },
    "18": {
        "content": "-1≤x≤1에서 이차함수 y=-x^2+4ax의 최댓값이 4일 때, 상수 a의 모든 값의 곱을 구하면? [4.5점]",
        "choices": ["-25/16", "-1", "-9/16", "-1/16", "0"],
        "page": 5,
    },
    "단답형1": {
        "content": "삼차방정식 x^3-(2a-1)x^2-ax+a=0이 중근과 다른 한 실근을 갖도록 하는 모든 실수 a의 값의 합을 구하시오. [4점]",
        "choices": [],
        "page": 5,
    },
    "단답형2": {
        "content": "두 복소수 z1=(1+√3 i)/2, z2=(1+i)/√2일 때, z1^n=z2^n=1을 만족시키는 200이하의 자연수 n의 개수를 구하면? (단, i=√-1) [4점]",
        "choices": [],
        "page": 5,
    },
    "서술형1": {
        "content": "다항식 P(x)를 x-1로 나누었을 때, 나머지가 18이고, x+3으로 나누었을 때, 나머지가 6이다. P(x)를 (x-1)(x+3)로 나누었을 때 몫을 Q(x), 나머지를 R(x)라 하자. 이때, R(0)을 구하시오. [7점]",
        "choices": [],
        "page": 6,
    },
    "서술형2": {
        "content": "이차함수 y=x^2+ax-3a-25의 그래프는 a의 값에 관계없이 항상 점 P를 지난다. 다음 물음에 답하시오. (단, a는 실수)\n(1) 점 P의 좌표를 구하시오.\n(2) 점 P가 이 이차함수의 꼭짓점일 때, 이 이차함수의 x절편을 모두 구하시오. [7점]",
        "choices": [],
        "page": 6,
    },
    "서술형3": {
        "content": "함수 f(x)={2x^2+4x (x≤-2), -x^2-2x (x>-2)}의 그래프와 직선 y=mx+4m-1이 서로 다른 세 점에서 만나도록 하는 상수 m의 값의 범위를 구하시오. [7점]",
        "choices": [],
        "page": 6,
    },
}


def page_path(page_no: int) -> str:
    return str(PAGES / f"page_p{page_no:03d}.png")


def main() -> None:
    text = CANDIDATE.read_text(encoding="utf-8")
    prefix, rest = text.split("window.questionBank = ", 1)
    array_text, suffix = rest.rsplit(";", 1)
    questions = json.loads(array_text)

    if len(questions) != 23:
        raise SystemExit(f"Unexpected question count: {len(questions)}")

    seen = []
    for q in questions:
        display_no = q["displayNo"]
        if display_no not in DATA:
            raise SystemExit(f"Unexpected displayNo: {display_no}")
        item = DATA[display_no]
        q["content"] = item["content"]
        q["choices"] = item["choices"]
        q["pageNo"] = item["page"]
        q["image"] = page_path(item["page"])
        q["fullPageImagePath"] = page_path(item["page"])
        q["imageStatus"] = "full_page_evidence"
        q["reviewStatus"] = "round18_latestB_content_choices_restored"
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
    print(f"content_restored={len(questions)}")
    print(f"objective_choice_sets_restored={objective_complete}")


if __name__ == "__main__":
    main()
