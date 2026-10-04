import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXAM_ID = "22_제일고_1학기_중간_고1_기출"
BASE = ROOT / "archive" / "_generated" / "past-exams" / "high1_2022_2025" / "1mid" / EXAM_ID
CANDIDATE = BASE / "candidate" / f"{EXAM_ID}.candidate.js"
PAGES = BASE / "pages"


DATA = {
    "1": {
        "page": 1,
        "content": "다항식 A를 x^2+x-1로 나누었더니 몫이 2x+1이고 나머지가 3x+2이었다. 이 때, 다항식 A를 구한 것으로 알맞은 것은? [4.1점]",
        "choices": ["2x^3+3x^2+2x+1", "2x^3+3x^2+2x-1", "2x^3+3x^2-2x+1", "2x^3-3x^2+2x+1", "2x^3-3x^2+2x-1"],
    },
    "2": {
        "page": 1,
        "content": "이차식 x^4+x^3+x^2+x+1의 인수인 것을 고르면? [4.2점]",
        "choices": ["x^2-2x+2", "x^2+2x+3", "x^2+3x+1", "x^2+3x-1", "x^2+3x-2"],
    },
    "3": {
        "page": 1,
        "content": "다음은 조립제법을 이용하여 (3x^3+7x^2+5x+2)÷(3x+1)의 몫과 나머지를 구하는 과정이다. 빈칸에 알맞은 것을 고르면? [4.3점]\n3x+1=3(x+1/3)이므로 아래쪽의 조립제법에서\n3x^3+7x^2+5x+2=(3x+1)(라)+(마)\n따라서 구하는 몫은 (라)이고, 나머지는 (마)이다.",
        "choices": ["(가) 1/3", "(나) -5", "(다) 1", "(라) x^2+2x+1", "(마) 1/3"],
    },
    "4": {
        "page": 2,
        "content": "다음 중 옳지 않은 것을 고른 것은? [4.4점]",
        "choices": [
            "a^2-b^2=(a+b)(a-b)",
            "a^2+b^2+c^2+2ab+2bc+2ca=(a+b+c)^2",
            "a^3+b^3=(a+b)(a^2-ab+b^2)",
            "a^3-b^3=(a-b)^3+3ab(a-b)",
            "a^4+a^2b^2+b^4=(a^2+ab+b^2)(a^2-ab+b^2)",
        ],
    },
    "5": {
        "page": 2,
        "content": "x^2+xy-6y^2+5x+5y+6의 인수로 알맞은 것은? [4.4점]",
        "choices": ["(x+2y+3)", "(x-2y+3)", "(x+2y-3)", "(x-3y+2)", "(x+3y-2)"],
    },
    "6": {
        "page": 2,
        "content": "방정식 x^3=-1의 한 허근을 w라고 할 때, 다음 중 옳은 것을 모두 고른 것은? (단, w̄는 w의 켤레복소수) [4.5점]\nㄱ. w^2-w+1=0\nㄴ. w^2=1/w\nㄷ. 1/(w-1)+1/(w̄-1)=-1",
        "choices": ["ㄱ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"],
    },
    "7": {
        "page": 2,
        "content": "x에 대한 삼차방정식 x^3-ax^2+(a+1)x-a^2-a=0의 서로 다른 실근의 개수를 f(a)라 할 때, f(-2)+f(-1)+f(0)+f(1)+f(2)의 값으로 알맞은 것은? [4.6점]",
        "choices": ["5", "6", "7", "8", "9"],
    },
    "8": {
        "page": 2,
        "content": "두 이차다항식 P(x), Q(x)가 다음 조건을 만족시킨다.\n(가) 모든 실수 x에 대하여 P(x)+Q(x)=0\n(나) P(x)Q(x)는 x^2-1로 나누어 떨어진다.\nP(0)=2일 때, Q(2)의 값으로 알맞은 것은? [4.7점]",
        "choices": ["2", "4", "6", "8", "10"],
    },
    "9": {
        "page": 2,
        "content": "다항식 1+x+2x^2+3x^3+4x^4+...+10x^10을 x-1로 나누었을 때 몫을 Q(x)라 하자. Q(x)를 x+1로 나누었을 때, 나머지로 알맞은 것은? [4.8점]",
        "choices": ["5", "10", "15", "20", "25"],
    },
    "10": {
        "page": 3,
        "content": "다음 중 옳은 것은? (단, i=√-1) [4.2점]",
        "choices": [
            "1/(2-i)의 실수부분은 1/2이다.",
            "a=0이면 a+bi는 허수이다.",
            "1-√2 i의 허수부분은 √2이다.",
            "√3/√-2=-√(3/2)이다.",
            "√-5√-7=-√35이다.",
        ],
    },
    "11": {
        "page": 3,
        "content": "x=2/(1-√3 i)일 때, 5x^3-5x^2+7x-1의 값은? [4.7점]",
        "choices": ["i", "√2 i", "√3 i", "2i", "√5 i"],
    },
    "12": {
        "page": 3,
        "content": "0이 아닌 복소수 z에 대하여 다음 보기 중 항상 실수인 것만 있는대로 고른 것은? [4.4점]\n<보기>\nㄱ. z-z̄\nㄴ. zz̄\nㄷ. z^2+z̄^2\nㄹ. z^2-z̄^-2\nㅁ. 1/z+1/z̄",
        "choices": ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄷ, ㄹ", "ㄴ, ㄷ, ㅁ", "ㄴ, ㄷ, ㄹ", "ㄴ, ㄹ, ㅁ"],
    },
    "13": {
        "page": 3,
        "content": "f(x)=x^2+2x+5일 때, 이차방정식 f(2x-1)=0의 두 근의 곱은? [3.7점]",
        "choices": ["-1", "1", "2", "5", "10"],
    },
    "14": {
        "page": 3,
        "content": "이차식 2x^2+4x+3를 복소수의 범위에서 인수분해하면? [3.8점]",
        "choices": [
            "2(x+(2+√2 i)/2)(x+(2-√2 i)/2)",
            "2(x+(2+√2 i)/2)(x-(2-√2 i)/2)",
            "2(x-(2+√2 i)/2)(x-(2-√2 i)/2)",
            "4(x+(2+√2 i)/2)(x+(2-√2 i)/2)",
            "4(x-(2+√2 i)/2)(x-(2-√2 i)/2)",
        ],
    },
    "15": {
        "page": 4,
        "content": "이차방정식 x^2-2x+1=0의 두 근을 α, β라고 할 때, 1/(α^2-3α+6)+1/(β^2-3β+6)의 값은? [4.5점]",
        "choices": ["1/2", "1/3", "1/4", "1/5", "1/6"],
    },
    "16": {
        "page": 4,
        "content": "이차방정식 x^2-(2k+3)x+2k+6=0의 두 근의 차가 3인 정수일 때, 모든 실수 k의 값의 합을 구하면? [4.3점]",
        "choices": ["-5", "-1", "1", "3", "5"],
    },
    "17": {
        "page": 4,
        "content": "2≤x≤4에서 이차함수 f(x)=-x^2+4ax+2a-6의 최댓값이 6일 때, 실수 a의 값의 합은? [5.2점]",
        "choices": ["14/9", "7/3", "9/4", "3/2", "8/5"],
    },
    "18": {
        "page": 4,
        "content": "(0,6)을 지나는 직선 y=ax+b에 대하여 이차함수 f(x)=-x^2+4x+5와 한 점에서 접하고 g(x)=x^2+6x+9와 서로 다른 두 점에서 만날 때, a+b의 값은? [5.2점]",
        "choices": ["2", "4", "6", "8", "12"],
    },
    "서술형1": {
        "page": 5,
        "content": "삼차방정식 x^3-x^2+2x-1=0의 세 근을 α, β, γ라 할 때, 1/α, 1/β, 1/γ를 세 근으로 하고 x^3의 계수가 1인 삼차방정식을 구하시오. [3점]",
        "choices": [],
    },
    "서술형2": {
        "page": 5,
        "content": "삼차방정식 x^3-x^2-x-2=0의 한 허근을 w라고 할 때 다음 물음에 답하시오.\n(1) w^2022+w^2021+w^2020+...+w^2+w+1의 값을 구하시오. [3점]\n(2) 계수가 실수인 이차식 f(x)에 대하여 다음 조건을 만족한다고 한다.\n(가) w̄ f(w)=1\n(나) f(0)=1\nf(x)를 구하시오. [4점]",
        "choices": [],
    },
    "서술형3": {
        "page": 6,
        "content": "두 실수 a,b에 대하여 1/i+2/i^2+3/i^3+4/i^4+...+125/i^125=a+bi일 때, a-b의 값을 구하시오. (단, i=√-1) [5점]",
        "choices": [],
    },
    "서술형4": {
        "page": 6,
        "content": "이차함수 y=f(x)가 다음 조건을 모두 만족시키는 함수 y=f(x)의 그래프와 x축의 교점의 좌표를 각각 (α,0), (3,0)이라고 할 때, α-3의 값을 구하시오. (단, α>3) [5점]\n(가) 모든 실수 x에 대하여 f(2-x)=f(2+x)이다.\n(나) x의 값의 범위가 -1≤x≤4일 때, 함수 f(x)의 최댓값은 9, 최솟값은 0이다.\n(다) 이차함수 y=f(x)의 그래프와 직선 y=-2x+14는 접한다.",
        "choices": [],
    },
}


def page_path(page_no: int) -> str:
    return str(PAGES / f"page_p{page_no:03d}.png")


def main() -> None:
    text = CANDIDATE.read_text(encoding="utf-8")
    prefix, rest = text.split("window.questionBank = ", 1)
    array_text, suffix = rest.rsplit(";", 1)
    questions = json.loads(array_text)

    if len(questions) != 22:
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
        q["reviewStatus"] = "round19_latestB_content_choices_restored"
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
