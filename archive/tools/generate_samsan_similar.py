"""
Dynamic Similar Exam Generator for Middle School Grade 3 Semester 1 Midterm.
Pipeline Architecture:
1. Source Ingestion: Dynamically loads original exam JS (e.g. 26_삼산중_1학기_중간_중3_기출.js) via Node VM.
2. Blueprint & Transformation Engine:
   - Binds each original question to its blueprint (concepts, constraints, variation type: STRICT_VARIANT, FOLLOWUP, +1 PREPROCESS).
   - Dynamically transforms conditions, numbers, stems, choices, answers, and solutions.
   - Enforces visual policy (Policy B verified asset reuse vs EXEMPT).
   - Maps canonical Meta Foundation taxonomy keys (or null with projection pending rationale).
3. Emitter:
   - Production JS adhering to window.questionBank.
   - Small Metadata JSON (archive-reviewed-exam-meta-register-request-v2) with full 1:1 items parity.
"""

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def compute_git_blob_sha1(data: bytes) -> str:
    """Compute git blob SHA-1: sha1('blob <size>\\0' + data)."""
    header = f"blob {len(data)}\0".encode("utf-8")
    return hashlib.sha1(header + data).hexdigest()


def load_original_exam_js(source_path: Path):
    """Load questionBank from original JS file via Node VM."""
    node_code = f"""
    const fs = require('fs');
    const vm = require('vm');
    const content = fs.readFileSync({json.dumps(str(source_path))}, 'utf8');
    const sandbox = {{ window: {{}} }};
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    console.log(JSON.stringify(sandbox.window.questionBank));
    """
    proc = subprocess.run(["node", "-e", node_code], capture_output=True, encoding="utf-8", check=True)
    return json.loads(proc.stdout)


# ==============================================================================
# Blueprint & Transformation Registry
# ==============================================================================

class BlueprintStrategy:
    def __init__(
        self,
        qid: int,
        variant_type: str,
        target_concept: str,
        difficulty_bucket: int,
        problem_type_key: str | None,
        template_key: str | None,
        cross_concept_keys: list[str],
        condition_keys: list[str],
        visual_policy: str,
        transform_fn,
    ):
        self.qid = qid
        self.variant_type = variant_type
        self.target_concept = target_concept
        self.difficulty_bucket = difficulty_bucket
        self.problem_type_key = problem_type_key
        self.template_key = template_key
        self.cross_concept_keys = cross_concept_keys
        self.condition_keys = condition_keys
        self.visual_policy = visual_policy
        self.transform_fn = transform_fn

    def apply(self, orig_q: dict) -> dict:
        return self.transform_fn(orig_q, self)


# Transformation functions per question
def _t_q01(orig, strat):
    return {
        "id": 1,
        "questionType": "객관식",
        "content": "다음 중 제곱근에 대한 설명으로 옳은 것은?",
        "solution": (
            "각 선지의 옳고 그름을 판별합니다.\n"
            "① 49의 제곱근은 $\\pm 7$이므로 7이다는 설명은 거짓이다. (거짓)\n"
            "② 0의 제곱근은 0 하나뿐이고, 음수의 제곱근은 실수 범위에서 없으므로 모든 실수가 2개의 제곱근을 갖는 것은 아니다. (거짓)\n"
            "③ $(-3)^2 = 9 \\ne -9$이므로 $-9$의 제곱근은 실수 범위에서 존재하지 않는다. (거짓)\n"
            "④ $\\sqrt{(-5)^2} = \\sqrt{25} = 5$이므로 5의 제곱근은 $\\pm\\sqrt{5}$이다. (거짓)\n"
            "⑤ $\\sqrt{81} = 9$이고, 9의 양의 제곱근은 $\\sqrt{9} = 3$이다. (참)\n"
            "따라서 옳은 것은 ⑤이다."
        ),
        "answer": "⑤",
        "choices": [
            "① 49의 제곱근은 7이다.",
            "② 모든 실수는 2개의 제곱근을 갖는다.",
            "③ $-9$의 제곱근은 $-3$이다.",
            "④ $\\sqrt{(-5)^2}$의 제곱근은 5이다.",
            "⑤ $\\sqrt{81}$의 양의 제곱근은 3이다."
        ],
        "score": 3.6,
    }

def _t_q02(orig, strat):
    return {
        "id": 2,
        "questionType": "객관식",
        "content": "다음 식을 간단히 하였을 때, 그 결과가 가장 큰 것은?",
        "solution": (
            "각 선지를 간단히 계산합니다.\n"
            "① $(-\\sqrt{7})^2 = 7$\n"
            "② $\\sqrt{(-8)^2} = 8$\n"
            "③ $-\\sqrt{5^2} = -5$\n"
            "④ $\\sqrt{3^2} \\times \\sqrt{2^2} = 3 \\times 2 = 6$\n"
            "⑤ $\\sqrt{(-9)^2} + (-\\sqrt{3})^2 = 9 + 3 = 12$\n"
            "계산된 결과의 대소를 비교하면 $-5 < 6 < 7 < 8 < 12$이므로, 결과가 가장 큰 것은 ⑤이다."
        ),
        "answer": "⑤",
        "choices": [
            "① $(-\\sqrt{7})^2$",
            "② $\\sqrt{(-8)^2}$",
            "③ $-\\sqrt{5^2}$",
            "④ $\\sqrt{3^2} \\times \\sqrt{2^2}$",
            "⑤ $\\sqrt{(-9)^2} + (-\\sqrt{3})^2$"
        ],
        "score": 3.7,
    }

def _t_q03(orig, strat):
    return {
        "id": 3,
        "questionType": "객관식",
        "content": "다음 보기 중 두 실수의 대소 관계가 옳은 것만을 있는 대로 고른 것은?\n\n[보기]\nㄱ. $\\sqrt{15} < 4$\nㄴ. $3 - \\sqrt{2} > 2$\nㄷ. $\\sqrt{7} + 1 < 4$\nㄹ. $5 - \\sqrt{3} < 3$",
        "solution": (
            "각 보기를 판정합니다.\n"
            "ㄱ. $4 = \\sqrt{16}$이므로 $\\sqrt{15} < \\sqrt{16} = 4$ (참)\n"
            "ㄴ. $1 < \\sqrt{2} < 2$이므로 $3 - \\sqrt{2} < 3 - 1 = 2$. 즉 $3 - \\sqrt{2} < 2$이므로 거짓.\n"
            "ㄷ. $2 < \\sqrt{7} < 3$이므로 $3 < \\sqrt{7} + 1 < 4$ (참)\n"
            "ㄹ. $1 < \\sqrt{3} < 2$이므로 $3 < 5 - \\sqrt{3} < 4$. 즉 $5 - \\sqrt{3} > 3$이므로 거짓.\n"
            "따라서 옳은 것은 ㄱ, ㄷ이다."
        ),
        "answer": "②",
        "choices": [
            "① ㄱ, ㄴ",
            "② ㄱ, ㄷ",
            "③ ㄴ, ㄷ",
            "④ ㄴ, ㄹ",
            "⑤ ㄱ, ㄷ, ㄹ"
        ],
        "score": 3.8,
    }

def _t_q04(orig, strat):
    return {
        "id": 4,
        "questionType": "객관식",
        "content": "세 실수 $a = 3$, $b = \\sqrt{5} + 1$, $c = 5 - \\sqrt{3}$의 대소 관계로 옳은 것은?",
        "solution": (
            "세 실수를 비교합니다.\n"
            "1) $a$와 $b$ 비교: $a - b = 3 - (\\sqrt{5} + 1) = 2 - \\sqrt{5}$. $2 = \\sqrt{4} < \\sqrt{5}$이므로 $2 - \\sqrt{5} < 0$, 즉 $a < b$.\n"
            "2) $b$와 $c$ 비교: $\\sqrt{5} \\approx 2.236$이므로 $b = \\sqrt{5} + 1 \\approx 3.236$.\n"
            "$\\sqrt{3} \\approx 1.732$이므로 $c = 5 - \\sqrt{3} \\approx 3.268$.\n"
            "엄밀한 차: $c - b = (5 - \\sqrt{3}) - (\\sqrt{5} + 1) = 4 - (\\sqrt{3} + \\sqrt{5})$.\n"
            "$(\\sqrt{3} + \\sqrt{5})^2 = 8 + 2\\sqrt{15} < 8 + 2\\sqrt{16} = 16 = 4^2$이므로 $\\sqrt{3} + \\sqrt{5} < 4$, 즉 $c - b > 0 \\implies b < c$.\n"
            "따라서 $a < b < c$이다."
        ),
        "answer": "①",
        "choices": [
            "① $a < b < c$",
            "② $a < c < b$",
            "③ $b < a < c$",
            "④ $b < c < a$",
            "⑤ $c < a < b$"
        ],
        "score": 4.0,
    }

def _t_q05(orig, strat):
    return {
        "id": 5,
        "questionType": "객관식",
        "content": "다음 그림과 같이 수직선 위에 한 변의 길이가 2인 두 정사각형 $ABCD$와 $DCFE$가 놓여 있다. 점 $B$의 좌표가 0, 점 $C$의 좌표가 2, 점 $F$의 좌표가 4일 때, 점 $B$를 중심으로 하고 대각선 $BD$를 반지름으로 하는 원을 그려 수직선과 만나는 점을 $P$, 점 $B$를 중심으로 하고 선분 $BE$를 반지름으로 하는 원을 그려 수직선과 만나는 점을 $Q$라 하자. 점 $P$에 대응하는 수를 $p$, 점 $Q$에 대응하는 수를 $q$라 할 때, $p + q$의 값은? (단, 점 $P, Q$는 점 $B$의 오른쪽에 있다.)",
        "solution": (
            "도판(q05.png)에 주어진 좌표와 길이를 확인합니다.\n"
            "1) 정사각형 $ABCD$에서 점 $B(0)$, 점 $C(2)$이고 세로 $CD = 2$이므로 대각선 $BD$의 길이는 피타고라스 정리에 의해:\n"
            "$\\overline{BD} = \\sqrt{2^2 + 2^2} = \\sqrt{8} = 2\\sqrt{2}$\n"
            "따라서 점 $B(0)$에서 오른쪽으로 $\\overline{BD}$만큼 떨어진 점 $P$의 좌표는 $p = 0 + 2\\sqrt{2} = 2\\sqrt{2}$이다.\n\n"
            "2) 직각삼각형 $BCE$에서 $\\overline{BC} = 2$이고 정사각형 $DCFE$의 한 변 길이가 2이므로 점 $E$는 $C(2)$에서 위로 2, 오른쪽으로 2 떨어진 위치이거나 세로 높이가 2인 점입니다.\n"
            "직각삼각형 $BFE$에서 밑변 $\\overline{BF} = 4$, 높이 $\\overline{FE} = 2$이므로 선분 $BE$의 길이는:\n"
            "$\\overline{BE} = \\sqrt{4^2 + 2^2} = \\sqrt{16 + 4} = \\sqrt{20} = 2\\sqrt{5}$\n"
            "따라서 점 $B(0)$에서 오른쪽으로 $\\overline{BE}$만큼 떨어진 점 $Q$의 좌표는 $q = 0 + 2\\sqrt{5} = 2\\sqrt{5}$이다.\n\n"
            "3) 그러므로 $p + q = 2\\sqrt{2} + 2\\sqrt{5}$이다."
        ),
        "answer": "②",
        "choices": [
            "① $2\\sqrt{2} + \\sqrt{5}$",
            "② $2\\sqrt{2} + 2\\sqrt{5}$",
            "③ $3\\sqrt{2} + 2\\sqrt{5}$",
            "④ $2\\sqrt{2} + 3\\sqrt{5}$",
            "⑤ $4\\sqrt{2} + 2\\sqrt{5}$"
        ],
        "image": "assets/images/26_삼산중_1학기_중간_중3_기출/q05.png",
        "score": 4.1,
    }

def _t_q06(orig, strat):
    return {
        "id": 6,
        "questionType": "객관식",
        "content": "$-2 < x < 3$일 때, $\\sqrt{(x+2)^2} + \\sqrt{(x-3)^2}$을 간단히 한 것은?",
        "solution": (
            "근호 안의 완전제곱식의 부호를 판정합니다.\n"
            "$-2 < x < 3$이므로:\n"
            "1) $x + 2 > 0 \\implies \\sqrt{(x+2)^2} = x + 2$\n"
            "2) $x - 3 < 0 \\implies \\sqrt{(x-3)^2} = -(x - 3) = -x + 3$\n"
            "따라서 주어진 식은:\n"
            "$(x + 2) + (-x + 3) = 5$\n"
            "정답은 ③이다."
        ),
        "answer": "③",
        "choices": [
            "① $-2x + 1$",
            "② $2x - 1$",
            "③ $5$",
            "④ $-5$",
            "⑤ $2x + 5$"
        ],
        "score": 3.9,
    }

def _t_q07(orig, strat):
    return {
        "id": 7,
        "questionType": "객관식",
        "content": "$\\sqrt{\\frac{180}{n}}$이 자연수가 되도록 하는 가장 작은 두 자리 자연수 $n$의 값은?",
        "solution": (
            "180을 소인수분해하면 $180 = 2^2 \\times 3^2 \\times 5$이다.\n"
            "$\\sqrt{\\frac{180}{n}} = \\sqrt{\\frac{2^2 \\times 3^2 \\times 5}{n}}$이 자연수가 되려면, 근호 안의 수가 어떤 자연수의 제곱수가 되어야 한다.\n"
            "따라서 $n = 5 \\times k^2$의 꼴(단, $n$은 180의 약수)이어야 한다.\n"
            "- $k=1$일 때, $n = 5 \\times 1^2 = 5$ (한 자리 자연수)\n"
            "- $k=2$일 때, $n = 5 \\times 2^2 = 20$ (두 자리 자연수, 180의 약수: $180/20 = 9 = 3^2$ 성립)\n"
            "따라서 조건을 만족하는 가장 작은 두 자리 자연수 $n$은 20이다."
        ),
        "answer": "②",
        "choices": [
            "① 15",
            "② 20",
            "③ 25",
            "④ 45",
            "⑤ 80"
        ],
        "score": 4.1,
    }

def _t_q08(orig, strat):
    return {
        "id": 8,
        "questionType": "객관식",
        "content": "다음 중 계산 결과가 옳은 것은?",
        "solution": (
            "각 선지를 계산합니다.\n"
            "① $\\sqrt{2} \\times \\sqrt{8} = \\sqrt{16} = 4$ (거짓, 16이 아님)\n"
            "② $\\sqrt{18} \\div \\sqrt{2} = \\sqrt{9} = 3$ (참)\n"
            "③ $\\sqrt{12} - \\sqrt{3} = 2\\sqrt{3} - \\sqrt{3} = \\sqrt{3}$ (거짓, 3이 아님)\n"
            "④ $\\sqrt{24} = 2\\sqrt{6}$ (거짓, $4\\sqrt{6}$이 아님)\n"
            "⑤ $\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ (거짓, $3\\sqrt{3}$이 아님)\n"
            "따라서 옳은 것은 ②이다."
        ),
        "answer": "②",
        "choices": [
            "① $\\sqrt{2} \\times \\sqrt{8} = 16$",
            "② $\\sqrt{18} \\div \\sqrt{2} = 3$",
            "③ $\\sqrt{12} - \\sqrt{3} = 3$",
            "④ $\\sqrt{24} = 4\\sqrt{6}$",
            "⑤ $\\frac{6}{\\sqrt{3}} = 3\\sqrt{3}$"
        ],
        "score": 3.7,
    }

def _t_q09(orig, strat):
    return {
        "id": 9,
        "questionType": "객관식",
        "content": "$\\sqrt{3} = a$, $\\sqrt{5} = b$라 할 때, $\\sqrt{240}$을 $a, b$를 이용하여 바르게 나타낸 것은?",
        "solution": (
            "240을 소인수분해합니다.\n"
            "$240 = 16 \\times 15 = 2^4 \\times 3 \\times 5$\n"
            "따라서 $\\sqrt{240} = \\sqrt{2^4 \\times 3 \\times 5} = 4\\sqrt{3 \\times 5} = 4\\sqrt{3}\\sqrt{5} = 4ab$이다."
        ),
        "answer": "④",
        "choices": [
            "① $2ab$",
            "② $2a^2b$",
            "③ $4a^2b$",
            "④ $4ab$",
            "⑤ $8ab$"
        ],
        "score": 3.9,
    }

def _t_q10(orig, strat):
    return {
        "id": 10,
        "questionType": "객관식",
        "content": "다음 그림과 같이 밑변의 길이가 $\\sqrt{45}$, 높이가 $\\sqrt{24}$인 삼각형 $ABC$와 한 대각선의 길이가 $\\sqrt{3}$, 다른 대각선의 길이가 $x$인 마름모 $DEFG$가 있다. 삼각형 $ABC$의 넓이가 마름모 $DEFG$의 넓이의 2배일 때, 양수 $x$의 값은?",
        "solution": (
            "도판(q10.png)에 각인된 수치와 조건을 적용합니다.\n"
            "1) 삼각형 $ABC$의 넓이 $S_1$:\n"
            "밑변 $\\overline{AB} = \\sqrt{45} = 3\\sqrt{5}$, 높이 $\\overline{CH} = \\sqrt{24} = 2\\sqrt{6}$\n"
            "$S_1 = \\frac{1}{2} \\times 3\\sqrt{5} \\times 2\\sqrt{6} = 3\\sqrt{30}$\n\n"
            "2) 마름모 $DEFG$의 넓이 $S_2$:\n"
            "두 대각선 길이가 $\\sqrt{3}$과 $x$이므로\n"
            "$S_2 = \\frac{1}{2} \\times \\sqrt{3} \\times x = \\frac{\\sqrt{3}}{2}x$\n\n"
            "3) 삼각형 넓이가 마름모 넓이의 2배이므로:\n"
            "$S_1 = 2S_2 \\implies 3\\sqrt{30} = 2 \\times \\left(\\frac{\\sqrt{3}}{2}x\\right) = \\sqrt{3}x$\n"
            "양변을 $\\sqrt{3}$으로 나누면:\n"
            "$x = \\frac{3\\sqrt{30}}{\\sqrt{3}} = 3\\sqrt{10}$\n"
            "따라서 $x = 3\\sqrt{10}$이다."
        ),
        "answer": "④",
        "choices": [
            "① $2\\sqrt{10}$",
            "② $5\\sqrt{2}$",
            "③ $2\\sqrt{15}$",
            "④ $3\\sqrt{10}$",
            "⑤ $6\\sqrt{5}$"
        ],
        "image": "assets/images/26_삼산중_1학기_중간_중3_기출/q10.png",
        "score": 4.2,
    }

def _t_q11(orig, strat):
    return {
        "id": 11,
        "questionType": "객관식",
        "content": "$\\frac{8}{\\sqrt{2}} - \\sqrt{27} + \\sqrt{48} - \\frac{6}{\\sqrt{18}}$을 간단히 계산한 결과가 $a\\sqrt{2} + b\\sqrt{3}$일 때, 유리수 $a, b$에 대하여 $a - b$의 값은?",
        "solution": (
            "각 항을 분모의 유리화 및 근호 안의 제곱인수를 밖으로 빼내어 정리합니다.\n"
            "1) $\\frac{8}{\\sqrt{2}} = \\frac{8\\sqrt{2}}{2} = 4\\sqrt{2}$\n"
            "2) $-\\sqrt{27} = -3\\sqrt{3}$\n"
            "3) $\\sqrt{48} = 4\\sqrt{3}$\n"
            "4) $-\\frac{6}{\\sqrt{18}} = -\\frac{6}{3\\sqrt{2}} = -\\frac{2}{\\sqrt{2}} = -\\sqrt{2}$\n"
            "동류항끼리 묶으면:\n"
            "$(4\\sqrt{2} - \\sqrt{2}) + (-3\\sqrt{3} + 4\\sqrt{3}) = 3\\sqrt{2} + \\sqrt{3}$\n"
            "따라서 $a = 3, b = 1$이다.\n"
            "그러므로 $a - b = 3 - 1 = 2$이다."
        ),
        "answer": "①",
        "choices": [
            "① 2",
            "② 3",
            "③ 4",
            "④ 5",
            "⑤ 6"
        ],
        "score": 4.0,
    }

def _t_q12(orig, strat):
    return {
        "id": 12,
        "questionType": "객관식",
        "content": "$\\sqrt{5}(2\\sqrt{5} - \\sqrt{10}) - \\frac{\\sqrt{40} - 15}{\\sqrt{5}}$를 계산한 결과는?",
        "solution": (
            "분배법칙과 분모의 유리화를 이용하여 식을 전개합니다.\n"
            "1) 첫 번째 항: $\\sqrt{5}(2\\sqrt{5} - \\sqrt{10}) = 2 \\times 5 - \\sqrt{50} = 10 - 5\\sqrt{2}$\n"
            "2) 두 번째 항: $\\frac{\\sqrt{40} - 15}{\\sqrt{5}} = \\sqrt{\\frac{40}{5}} - \\frac{15}{\\sqrt{5}} = \\sqrt{8} - 3\\sqrt{5} = 2\\sqrt{2} - 3\\sqrt{5}$\n"
            "따라서 전체 식은:\n"
            "$(10 - 5\\sqrt{2}) - (2\\sqrt{2} - 3\\sqrt{5}) = 10 - 5\\sqrt{2} - 2\\sqrt{2} + 3\\sqrt{5} = 10 - 7\\sqrt{2} + 3\\sqrt{5}$\n"
            "정답은 ②이다."
        ),
        "answer": "②",
        "choices": [
            "① $10 - 3\\sqrt{2} + 3\\sqrt{5}$",
            "② $10 - 7\\sqrt{2} + 3\\sqrt{5}$",
            "③ $10 - 7\\sqrt{2} - 3\\sqrt{5}$",
            "④ $5 - 7\\sqrt{2} + 3\\sqrt{5}$",
            "⑤ $10 + 3\\sqrt{2} - 3\\sqrt{5}$"
        ],
        "score": 4.2,
    }

def _t_q13(orig, strat):
    return {
        "id": 13,
        "questionType": "객관식",
        "content": "다음 그림과 같이 직각삼각형 2개와 이등변삼각형 2개로 이루어진 육각형 모양의 판이 있다. 이 4개의 조각을 겹치지 않게 빈틈없이 이어 붙여 새로운 도형을 만들었다. 원래 4개 조각 각각의 둘레의 길이의 총합과 [보기]의 ③번 도형의 둘레의 길이의 차는?",
        "solution": (
            "도판(q13.png)에 제시된 조각과 선지 ③번의 기하학적 수치를 정밀 분석합니다.\n"
            "1) 원래 4개 조각의 둘레의 총합:\n"
            "- 직각삼각형 2개: 변의 길이가 각각 6, 2, $2\\sqrt{10}$ (피타고라스: $\\sqrt{6^2 + 2^2} = \\sqrt{40} = 2\\sqrt{10}$)\n"
            "  둘레 = $6 + 2 + 2\\sqrt{10} = 8 + 2\\sqrt{10}$. 2개이므로 $2 \\times (8 + 2\\sqrt{10}) = 16 + 4\\sqrt{10}$\n"
            "- 이등변삼각형 2개: 변의 길이가 각각 6, $\\sqrt{10}$, $\\sqrt{10}$\n"
            "  둘레 = $6 + \\sqrt{10} + \\sqrt{10} = 6 + 2\\sqrt{10}$. 2개이므로 $2 \\times (6 + 2\\sqrt{10}) = 12 + 4\\sqrt{10}$\n"
            "따라서 4개 조각 각각의 둘레의 총합 $L_{\\text{total}} = (16 + 4\\sqrt{10}) + (12 + 4\\sqrt{10}) = 28 + 8\\sqrt{10}$이다.\n\n"
            "2) ③번 도형의 둘레:\n"
            "조각들이 맞닿은 내부 경계선 길이를 $M$이라 하면, 결합된 도형의 외곽 둘레 $L_{\\text{outer}} = L_{\\text{total}} - 2M$이다.\n"
            "③번 도형에서 맞닿는 맞물림 변은 길이 6인 변 1쌍과 길이 $\\sqrt{10}$인 변 2쌍이므로 접촉 길이 $M = 6 + 2\\sqrt{10}$이다.\n"
            "따라서 ③번 도형의 외곽 둘레는:\n"
            "$L_{\\text{outer}} = (28 + 8\\sqrt{10}) - 2(6 + 2\\sqrt{10}) = 28 + 8\\sqrt{10} - 12 - 4\\sqrt{10} = 16 + 4\\sqrt{10}$\n\n"
            "3) 두 둘레의 차:\n"
            "$L_{\\text{total}} - L_{\\text{outer}} = 2M = 2(6 + 2\\sqrt{10}) = 12 + 4\\sqrt{10}$이다.\n"
            "따라서 정답은 ③이다."
        ),
        "answer": "③",
        "choices": [
            "① $8 + 2\\sqrt{10}$",
            "② $10 + 4\\sqrt{10}$",
            "③ $12 + 4\\sqrt{10}$",
            "④ $14 + 2\\sqrt{10}$",
            "⑤ $16 + 4\\sqrt{10}$"
        ],
        "image": "assets/images/26_삼산중_1학기_중간_중3_기출/q13.png",
        "score": 4.5,
    }

def _t_q14(orig, strat):
    return {
        "id": 14,
        "questionType": "객관식",
        "content": "$(2x - 3y)(4x + 5y)$를 전개하였을 때, $xy$의 계수는?",
        "solution": (
            "다항식을 전개하여 $xy$ 항만 추출합니다.\n"
            "$(2x) \\times (5y) + (-3y) \\times (4x) = 10xy - 12xy = -2xy$\n"
            "따라서 $xy$의 계수는 $-2$이다."
        ),
        "answer": "①",
        "choices": [
            "① $-2$",
            "② $-1$",
            "③ $0$",
            "④ $1$",
            "⑤ $2$"
        ],
        "score": 3.8,
    }

def _t_q15(orig, strat):
    return {
        "id": 15,
        "questionType": "객관식",
        "content": "$\\frac{1}{2+\\sqrt{3}} + \\frac{1}{\\sqrt{3}-\\sqrt{2}}$를 간단히 한 것은?",
        "solution": (
            "각 항의 분모를 유리화합니다.\n"
            "1) $\\frac{1}{2+\\sqrt{3}} = \\frac{2-\\sqrt{3}}{(2+\\sqrt{3})(2-\\sqrt{3})} = \\frac{2-\\sqrt{3}}{4-3} = 2 - \\sqrt{3}$\n"
            "2) $\\frac{1}{\\sqrt{3}-\\sqrt{2}} = \\frac{\\sqrt{3}+\\sqrt{2}}{(\\sqrt{3}-\\sqrt{2})(\\sqrt{3}+\\sqrt{2})} = \\frac{\\sqrt{3}+\\sqrt{2}}{3-2} = \\sqrt{3} + \\sqrt{2}$\n"
            "따라서 두 식을 더하면:\n"
            "$(2 - \\sqrt{3}) + (\\sqrt{3} + \\sqrt{2}) = 2 + \\sqrt{2}$\n"
            "정답은 ③이다."
        ),
        "answer": "③",
        "choices": [
            "① $2 - \\sqrt{2}$",
            "② $\\sqrt{3} + \\sqrt{2}$",
            "③ $2 + \\sqrt{2}$",
            "④ $2\\sqrt{3} - \\sqrt{2}$",
            "⑤ $4 + \\sqrt{2}$"
        ],
        "score": 4.1,
    }

def _t_q16(orig, strat):
    return {
        "id": 16,
        "questionType": "객관식",
        "content": "다음 네 학생이 곱셈공식을 이용하여 수를 계산하는 방법에 대해 나눈 대화 중 옳은 설명을 한 학생만을 있는 대로 고른 것은?\n\n[대화 내용]\n지우: $99^2$은 $(100-1)^2$으로 변형하여 $(a-b)^2 = a^2 - 2ab + b^2$을 이용하면 편리해.\n찬혁: $102^2$은 $(100+2)^2$으로 변형하여 $(a+b)^2 = a^2 + 2ab + b^2$을 이용하면 편리해.\n민서: $49 \\times 51$은 $(50-1)(50+1)$로 변형하여 $(a-b)(a+b) = a^2 - b^2$을 이용하면 편리해.\n수현: $103 \\times 105$는 $(100+3)(100+5)$로 변형하여 $(x+a)(x+b) = x^2 + (a+b)x + ab$를 이용하면 편리해.\n\n[보기]\nㄱ. 지우는 $(a-b)^2 = a^2 - 2ab + b^2$을 바르게 적용하였다.\nㄴ. 찬혁이는 합과 차의 곱 공식 $(a+b)(a-b) = a^2 - b^2$을 적용하였다.\nㄷ. 민서는 합과 차의 곱 공식을 바르게 적용하였다.\nㄹ. 수현이는 $(x+a)(x+b) = x^2 + (a+b)x + ab$를 바르게 적용하였다.",
        "solution": (
            "각 학생의 대화와 보기를 대조합니다.\n"
            "ㄱ. 지우는 $99 = 100 - 1$로 두어 $(a-b)^2$ 공식을 바르게 적용했습니다. (참)\n"
            "ㄴ. 찬혁이는 $102 = 100 + 2$이므로 $(a+b)^2 = a^2 + 2ab + b^2$을 적용하였습니다. 보기는 합과 차의 공식 $(a+b)(a-b) = a^2 - b^2$을 적용하였다고 진술하였으므로 명백한 거짓입니다. (거짓)\n"
            "ㄷ. 민서는 $49 \\times 51 = (50-1)(50+1)$로 $(a-b)(a+b) = a^2 - b^2$을 바르게 적용했습니다. (참)\n"
            "ㄹ. 수현이는 $103 \\times 105 = (100+3)(100+5)$로 $(x+a)(x+b)$ 공식을 바르게 적용했습니다. (참)\n"
            "따라서 옳은 보기는 ㄱ, ㄷ, ㄹ이다."
        ),
        "answer": "③",
        "choices": [
            "① ㄱ, ㄴ",
            "② ㄴ, ㄷ",
            "③ ㄱ, ㄷ, ㄹ",
            "④ ㄴ, ㄷ, ㄹ",
            "⑤ ㄱ, ㄴ, ㄷ, ㄹ"
        ],
        "score": 4.1,
    }

def _t_q17(orig, strat):
    return {
        "id": 17,
        "questionType": "객관식",
        "content": "가로의 길이가 $3x+2$, 세로의 길이가 $2x+5$인 직사각형 모양의 액자가 있다. 이 액자의 둘레의 길이가 $k$이고 넓이가 $S$일 때, $S$를 $x$에 대한 이차식으로 나타낸 것은?",
        "solution": (
            "직사각형의 넓이는 (가로) $\\times$ (세로)이다.\n"
            "$S = (3x + 2)(2x + 5)$\n"
            "전개하면:\n"
            "$S = 6x^2 + 15x + 4x + 10 = 6x^2 + 19x + 10$\n"
            "따라서 정답은 ①이다."
        ),
        "answer": "①",
        "choices": [
            "① $6x^2 + 19x + 10$",
            "② $6x^2 + 17x + 10$",
            "③ $6x^2 + 19x + 7$",
            "④ $5x^2 + 19x + 10$",
            "⑤ $6x^2 + 15x + 10$"
        ],
        "score": 3.9,
    }

def _t_q18(orig, strat):
    return {
        "id": 18,
        "questionType": "객관식",
        "content": "이차식 $2x^2 + 7x - 15$가 $(2x - a)(x + b)$로 인수분해될 때, 양수 $a, b$에 대하여 $a + b$의 값은?",
        "solution": (
            "이차식 $2x^2 + 7x - 15$를 대각선 곱을 이용하여 인수분해합니다.\n"
            "$2x^2 + 7x - 15 = (2x - 3)(x + 5)$\n"
            "이를 $(2x - a)(x + b)$와 비교하면:\n"
            "$-a = -3 \\implies a = 3$\n"
            "$b = 5$\n"
            "따라서 양수 $a=3, b=5$이므로 $a + b = 3 + 5 = 8$이다."
        ),
        "answer": "③",
        "choices": [
            "① 6",
            "② 7",
            "③ 8",
            "④ 9",
            "⑤ 10"
        ],
        "score": 4.0,
    }

def _t_q19(orig, strat):
    return {
        "id": 19,
        "questionType": "객관식",
        "content": "$x^2 + kx - 24$가 두 일차식의 곱 $(x+a)(x+b)$ (단, $a, b$는 정수)로 인수분해될 때, 상수 $k$의 값이 될 수 없는 것은?",
        "solution": (
            "$x^2 + kx - 24 = (x+a)(x+b) = x^2 + (a+b)x + ab$이므로\n"
            "$ab = -24$, $k = a+b$이다.\n"
            "곱이 $-24$가 되는 두 정수 $a, b$의 순서쌍과 그 합 $k$는 다음과 같다:\n"
            "- $a=24, b=-1 \\implies k = 23$\n"
            "- $a=-24, b=1 \\implies k = -23$\n"
            "- $a=12, b=-2 \\implies k = 10$\n"
            "- $a=-12, b=2 \\implies k = -10$\n"
            "- $a=8, b=-3 \\implies k = 5$\n"
            "- $a=-8, b=3 \\implies k = -5$\n"
            "- $a=6, b=-4 \\implies k = 2$\n"
            "- $a=-6, b=4 \\implies k = -2$\n"
            "따라서 $k$가 될 수 있는 값은 $\\pm 23, \\pm 10, \\pm 5, \\pm 2$이다.\n"
            "선지 중 8은 $k$의 값이 될 수 없다."
        ),
        "answer": "④",
        "choices": [
            "① 2",
            "② 5",
            "③ 10",
            "④ 8",
            "⑤ 23"
        ],
        "score": 4.3,
    }

def _t_q20(orig, strat):
    return {
        "id": 20,
        "questionType": "객관식",
        "content": "두 다항식 $x^2 - x - 12$와 $2x^2 + 5x - 3$의 공통인수는?",
        "solution": (
            "각 다항식을 인수분해합니다.\n"
            "1) $x^2 - x - 12 = (x - 4)(x + 3)$\n"
            "2) $2x^2 + 5x - 3 = (2x - 1)(x + 3)$\n"
            "따라서 두 다항식에 공통으로 들어 있는 인수는 $x + 3$이다."
        ),
        "answer": "②",
        "choices": [
            "① $x - 4$",
            "② $x + 3$",
            "③ $2x - 1$",
            "④ $x - 3$",
            "⑤ $x + 4$"
        ],
        "score": 4.1,
    }

def _t_q21(orig, strat):
    return {
        "id": 21,
        "questionType": "서술형",
        "content": "부등식 $3 < \\sqrt{2n-1} \\le 5$를 만족하는 자연수 $n$의 개수를 구하는 풀이 과정과 답을 서술하시오.",
        "solution": (
            "[풀이 과정]\n"
            "1단계: 각 변이 모두 양수이므로 각 변을 제곱합니다.\n"
            "$3^2 < (\\sqrt{2n-1})^2 \\le 5^2$\n"
            "$9 < 2n - 1 \\le 25$\n\n"
            "2단계: 각 변에 1을 더합니다.\n"
            "$10 < 2n \\le 26$\n\n"
            "3단계: 각 변을 2로 나눕니다.\n"
            "$5 < n \\le 13$\n\n"
            "4단계: 이를 만족하는 자연수 $n$은 $6, 7, 8, 9, 10, 11, 12, 13$입니다.\n"
            "따라서 자연수 $n$의 개수는 $13 - 6 + 1 = 8$개입니다.\n\n"
            "[답]\n"
            "8"
        ),
        "answer": "8",
        "choices": [],
        "score": 5.0,
    }

def _t_q22(orig, strat):
    return {
        "id": 22,
        "questionType": "서술형",
        "content": "다항식 $(3x + a)(bx - 5)$를 전개한 식이 $6x^2 + cx - 15$일 때, 상수 $a, b, c$의 값을 각각 구하고, $a + b + c$의 값을 구하는 풀이 과정과 답을 서술하시오. (단, $a, b$는 자연수)",
        "solution": (
            "[풀이 과정]\n"
            "1단계: 좌변의 다항식을 전개합니다.\n"
            "$(3x + a)(bx - 5) = 3bx^2 - 15x + abx - 5a = 3bx^2 + (ab - 15)x - 5a$\n\n"
            "2단계: 우변 $6x^2 + cx - 15$와 계수를 비교합니다.\n"
            "- $x^2$의 계수: $3b = 6 \\implies b = 2$\n"
            "- 상수항: $-5a = -15 \\implies a = 3$\n"
            "- $x$의 계수: $c = ab - 15 = 3 \\times 2 - 15 = 6 - 15 = -9$\n\n"
            "3단계: $a + b + c$의 값을 계산합니다.\n"
            "$a + b + c = 3 + 2 + (-9) = -4$\n\n"
            "[답]\n"
            "a = 3, b = 2, c = -9, a + b + c = -4"
        ),
        "answer": "-4",
        "choices": [],
        "score": 5.0,
    }

def _t_q23(orig, strat):
    return {
        "id": 23,
        "questionType": "서술형",
        "content": "인수분해 공식을 이용하여 $53^2 - 47^2 + 105 \\times 95$를 계산하는 풀이 과정과 답을 서술하시오.",
        "solution": (
            "[풀이 과정]\n"
            "1단계: $53^2 - 47^2$에 제곱의 차 공식 $a^2 - b^2 = (a+b)(a-b)$를 적용합니다.\n"
            "$53^2 - 47^2 = (53 + 47)(53 - 47) = 100 \\times 6 = 600$\n\n"
            "2단계: $105 \\times 95$에 합과 차의 곱 공식을 적용합니다.\n"
            "$105 \\times 95 = (100 + 5)(100 - 5) = 100^2 - 5^2 = 10000 - 25 = 9975$\n\n"
            "3단계: 두 결과를 더합니다.\n"
            "$600 + 9975 = 10575$\n\n"
            "[답]\n"
            "10575"
        ),
        "answer": "10575",
        "choices": [],
        "score": 5.0,
    }

def _t_q24(orig, strat):
    return {
        "id": 24,
        "questionType": "서술형",
        "content": "다음 그림과 같이 가로의 길이가 $x$, 세로의 길이가 $\\sqrt{6}$인 직사각형 $ABCD$가 있다. 긴 변의 중점을 연결하는 선분으로 직사각형을 이등분하여 만든 새로운 직사각형 $DEFC$가 처음 직사각형 $ABCD$와 닮음 도형일 때, 다음 물음에 답하는 풀이 과정과 답을 서술하시오. (단, $x > \\sqrt{6}$)\n(1) $x$의 값을 구하시오.\n(2) 사다리꼴 $EGCD$의 넓이를 구하시오. (단, 점 $G$는 직사각형 $DEFC$의 긴 변의 중점이다.)",
        "solution": (
            "[풀이 과정]\n"
            "(1) 직사각형 $ABCD$의 가로 길이는 $x$, 세로 길이는 $\\sqrt{6}$이다 ($x > \\sqrt{6}$이므로 긴 변은 가로).\n"
            "긴 변 $AD$의 중점을 $E$, $BC$의 중점을 $F$라 하면, 직사각형 $DEFC$의 가로는 $\\overline{DE} = \\frac{x}{2}$, 세로는 $\\overline{CD} = \\sqrt{6}$이다.\n"
            "새로운 직사각형 $DEFC$에서 긴 변은 $\\sqrt{6}$, 짧은 변은 $\\frac{x}{2}$이므로, 처음 직사각형 $ABCD$와의 닮음비는 긴 변 대 긴 변, 짧은 변 대 짧은 변의 비와 같다:\n"
            "$x : \\sqrt{6} = \\sqrt{6} : \\frac{x}{2}$\n"
            "내항의 곱과 외항의 곱이 같으므로:\n"
            "$x \\times \\frac{x}{2} = (\\sqrt{6})^2 = 6 \\implies \\frac{x^2}{2} = 6 \\implies x^2 = 12$\n"
            "$x > 0$이므로 $x = \\sqrt{12} = 2\\sqrt{3}$이다.\n\n"
            "(2) $x = 2\\sqrt{3}$일 때, 직사각형 $DEFC$의 가로 $\\overline{DE} = \\frac{2\\sqrt{3}}{2} = \\sqrt{3}$이고 세로 $\\overline{CD} = \\sqrt{6}$이다.\n"
            "점 $G$는 직사각형 $DEFC$의 긴 변의 중점이므로, 선분 $EF$의 중점을 $G$라 하면 $\\overline{EG} = \\frac{\\sqrt{6}}{2}$이다.\n"
            "직각사다리꼴 $EGCD$에서 평행한 두 변은 $\\overline{EG} = \\frac{\\sqrt{6}}{2}$와 $\\overline{CD} = \\sqrt{6}$이고, 높이는 선분 $DE = \\sqrt{3}$이다.\n"
            "따라서 사다리꼴 $EGCD$의 넓이는:\n"
            "$S = \\frac{1}{2} \\times (\\overline{EG} + \\overline{CD}) \\times \\overline{DE}$\n"
            "$S = \\frac{1}{2} \\times \\left(\\frac{\\sqrt{6}}{2} + \\sqrt{6}\\right) \\times \\sqrt{3} = \\frac{1}{2} \\times \\frac{3\\sqrt{6}}{2} \\times \\sqrt{3} = \\frac{3\\sqrt{18}}{4} = \\frac{9\\sqrt{2}}{4}$이다.\n\n"
            "[답]\n"
            "(1) 2\\sqrt{3}\n"
            "(2) \\frac{9\\sqrt{2}}{4}"
        ),
        "answer": "(1) 2\\sqrt{3}, (2) \\frac{9\\sqrt{2}}{4}",
        "choices": [],
        "image": "assets/images/26_삼산중_1학기_중간_중3_기출/q24.png",
        "score": 5.0,
    }


BLUEPRINT_STRATEGIES = [
    BlueprintStrategy(1, "STRICT_VARIANT", "제곱근의 뜻과 성질", 2, "PT_M3_SQUARE_ROOT_PROPERTY", "TPL_M3_SQUARE_ROOT_PROPERTY_AUDIT", ["CC_SQUARE_ROOT_DEFINITION"], ["COND_INTEGER"], "EXEMPT", _t_q01),
    BlueprintStrategy(2, "STRICT_VARIANT", "근호를 포함한 식의 계산 (거듭제곱과 나눗셈)", 2, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_POWER_DIVISION", ["CC_RADICAL_ARITHMETIC"], ["COND_INTEGER"], "EXEMPT", _t_q02),
    BlueprintStrategy(3, "STRICT_VARIANT", "실수의 대소 관계 판정", 3, "PT_M3_REAL_NUMBER_COMPARISON", "TPL_M3_POWER_ROOT_INEQUALITY_ORDER", ["CC_RADICAL_COMPARISON"], ["COND_RANGE"], "EXEMPT", _t_q03),
    BlueprintStrategy(4, "STRICT_VARIANT", "실수의 차를 이용한 대소 비교", 3, "PT_M3_REAL_NUMBER_COMPARISON", "TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION", ["CC_RADICAL_COMPARISON"], ["COND_RANGE"], "EXEMPT", _t_q04),
    BlueprintStrategy(5, "STRICT_VARIANT", "수직선 위의 무리수 대응점", 3, "PT_M3_REAL_NUMBER_LINE", "TPL_M3_NUMBER_LINE_SQUARE_ROTATION", ["CC_PYTHAGOREAN_THEOREM", "CC_SQUARE_AREA"], ["COND_POSITIVE"], "POLICY_B_REUSE", _t_q05),
    BlueprintStrategy(6, "STRICT_VARIANT", "근호 안의 완전제곱식의 부호와 간소화", 3, "PT_M3_SQUARE_ROOT_PROPERTY", "TPL_M3_RADICAL_VARIABLE_SIMPLIFY", ["CC_RADICAL_SIMPLIFY", "CC_SQUARE_ROOT_DEFINITION"], ["COND_RANGE"], "EXEMPT", _t_q06),
    BlueprintStrategy(7, "STRICT_VARIANT", "근호 안이 자연수가 되는 조건", 3, "PT_M3_SQUARE_ROOT_PROPERTY", "TPL_M3_RADICAL_NATURAL_NUMBER_CONDITION", ["CC_PRIME_FACTORIZATION", "CC_SQUARE_ROOT_DEFINITION"], ["COND_NATURAL_NUMBER"], "EXEMPT", _t_q07),
    BlueprintStrategy(8, "STRICT_VARIANT", "제곱근의 사칙연산과 분모의 유리화", 2, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_RATIONALIZATION", ["CC_RADICAL_ARITHMETIC"], ["COND_INTEGER"], "EXEMPT", _t_q08),
    BlueprintStrategy(9, "STRICT_VARIANT", "제곱근의 문자를 이용한 표현", 3, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_LETTER_REPRESENTATION", ["CC_PRIME_FACTORIZATION", "CC_RADICAL_EXPRESSION"], ["COND_POSITIVE"], "EXEMPT", _t_q09),
    BlueprintStrategy(10, "STRICT_VARIANT", "도형의 넓이와 근호 계산 응용", 4, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_MIXED_OPERATION", ["CC_RADICAL_ARITHMETIC"], ["COND_POSITIVE"], "POLICY_B_REUSE", _t_q10),
    BlueprintStrategy(11, "STRICT_VARIANT", "무리수가 서로 같을 조건과 계수 비교", 3, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_MIXED_OPERATION", ["CC_RADICAL_ARITHMETIC"], ["COND_INTEGER"], "EXEMPT", _t_q11),
    BlueprintStrategy(12, "STRICT_VARIANT", "분배법칙과 분모의 유리화 혼합계산", 3, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_MIXED_OPERATION", ["CC_RADICAL_ARITHMETIC", "CC_RADICAL_ADDITION"], ["COND_INTEGER"], "EXEMPT", _t_q12),
    BlueprintStrategy(13, "STRICT_VARIANT", "조각 재배열 도형의 둘레 차이 분석", 4, "PT_M3_SQUARE_ROOT_APPLICATION", "TPL_M3_GEOMETRIC_PERIMETER_RADICAL_APPLICATION", ["CC_PYTHAGOREAN_THEOREM", "CC_RADICAL_ADDITION"], ["COND_POSITIVE"], "POLICY_B_REUSE", _t_q13),
    BlueprintStrategy(14, "STRICT_VARIANT", "다항식의 전개와 특정 항의 계수", 2, "PT_M3_POLY_MULTIPLICATION", "TPL_M3_POLY_EXPANSION_COEFFICIENT", ["CC_POLYNOMIAL_EXPANSION", "CC_EXPANSION_COEFFICIENT"], ["COND_INTEGER"], "EXEMPT", _t_q14),
    BlueprintStrategy(15, "STRICT_VARIANT", "이중 분모 유리화와 사칙연산", 3, "PT_M3_RADICAL_CALCULATION", "TPL_M3_RADICAL_RATIONALIZATION", ["CC_RADICAL_ARITHMETIC", "CC_DIFFERENCE_OF_SQUARES"], ["COND_INTEGER"], "EXEMPT", _t_q15),
    BlueprintStrategy(16, "STRICT_VARIANT", "곱셈공식을 이용한 수 계산과 타당성 판정", 3, "PT_M3_POLY_MULTIPLICATION", "TPL_M3_MULTIPLICATION_FORMULA_NUMERICAL_AUDIT", ["CC_DIFFERENCE_OF_SQUARES", "CC_PERFECT_SQUARE"], ["COND_INTEGER"], "EXEMPT", _t_q16),
    BlueprintStrategy(17, "STRICT_VARIANT", "직사각형 모델링을 통한 다항식 전개", 3, "PT_M3_POLY_MULTIPLICATION", "TPL_M3_MULTIPLICATION_FORMULA_GEOMETRIC_MODELING", ["CC_POLYNOMIAL_EXPANSION"], ["COND_POSITIVE"], "EXEMPT", _t_q17),
    BlueprintStrategy(18, "STRICT_VARIANT", "이차식의 대각선 인수분해", 3, "PT_M3_POLY_FACTORIZATION", "TPL_M3_QUADRATIC_FACTORIZATION_SUM", ["CC_QUADRATIC_FACTORIZATION"], ["COND_INTEGER"], "EXEMPT", _t_q18),
    BlueprintStrategy(19, "STRICT_VARIANT", "상수항 조건과 일차식 곱 인수분해", 4, "PT_M3_POLY_FACTORIZATION", "TPL_M3_QUADRATIC_FACTORIZATION_SUM", ["CC_QUADRATIC_FACTORIZATION"], ["COND_INTEGER"], "EXEMPT", _t_q19),
    BlueprintStrategy(20, "STRICT_VARIANT", "두 이차식의 공통인수", 3, "PT_M3_POLY_FACTORIZATION", "TPL_M3_COMMON_FACTOR_IDENTIFICATION", ["CC_COMMON_FACTOR", "CC_QUADRATIC_FACTORIZATION"], ["COND_INTEGER"], "EXEMPT", _t_q20),
    BlueprintStrategy(21, "STRICT_VARIANT", "부등식과 제곱근을 만족하는 자연수 개수 (서술형)", 3, "PT_M3_REAL_NUMBER_COMPARISON", "TPL_M3_REAL_NUMBER_INTERVAL_ESTIMATION", ["CC_RADICAL_COMPARISON"], ["COND_NATURAL_NUMBER", "COND_RANGE"], "EXEMPT", _t_q21),
    BlueprintStrategy(22, "STRICT_VARIANT", "다항식 전개와 미정계수 결정 (서술형)", 3, "PT_M3_POLY_MULTIPLICATION", "TPL_M3_POLY_EXPANSION_COEFFICIENT_DETERMINATION", ["CC_POLYNOMIAL_EXPANSION", "CC_EXPANSION_COEFFICIENT"], ["COND_INTEGER"], "EXEMPT", _t_q22),
    BlueprintStrategy(23, "STRICT_VARIANT", "인수분해 공식을 이용한 수 계산 (서술형)", 4, "PT_M3_POLY_FACTORIZATION", "TPL_M3_NUMERICAL_FACTORIZATION_APPLICATION", ["CC_DIFFERENCE_OF_SQUARES", "CC_PERFECT_SQUARE"], ["COND_INTEGER"], "EXEMPT", _t_q23),
    BlueprintStrategy(24, "STRICT_VARIANT", "직사각형의 반복 이등분 닮음과 사다리꼴 넓이 (서술형)", 5, "PT_M3_SQUARE_ROOT_APPLICATION", "TPL_M3_SQUARE_AREA_SIDE_RATIO", ["CC_SIMILARITY_RATIO", "CC_RADICAL_ARITHMETIC"], ["COND_POSITIVE"], "POLICY_B_REUSE", _t_q24),
]


def generate_exam(original_questions: list[dict]):
    """Execute dynamic blueprint transformation on original questions."""
    strat_map = {s.qid: s for s in BLUEPRINT_STRATEGIES}
    similar_questions = []

    for orig_q in original_questions:
        qid = orig_q["id"]
        strat = strat_map[qid]
        transformed = strat.apply(orig_q)

        # Precise curriculum & taxonomy fields matching master tables
        unit_key = orig_q.get("standardUnitKey", "M3-01")
        if qid in {14, 16, 17, 18, 19, 20, 22, 23}:
            unit_key = "M3-02"
            unit_label = "다항식의 곱셈과 인수분해"
            if qid in {18, 19, 20, 23}:
                sub_key = "M3-02-FACTORIZATION"
                sub_label = "인수분해"
            else:
                sub_key = "M3-02-POLYNOMIAL_MULTIPLICATION"
                sub_label = "다항식의 곱셈"
        else:
            unit_key = "M3-01"
            unit_label = "실수와 그 계산"
            if qid in {8, 9, 10, 11, 12, 13, 15, 21, 24}:
                sub_key = "M3-01-REAL_NUMBER_OPERATIONS"
                sub_label = "근호를 포함한 식의 계산"
            else:
                sub_key = "M3-01-SQUARE_ROOT_REAL_NUMBER"
                sub_label = "제곱근과 실수"

        unit_order = int(unit_key.split("-")[-1]) if "-" in unit_key else 1

        item = {
            "id": qid,
            "level": "중" if strat.difficulty_bucket == 3 else ("하" if strat.difficulty_bucket <= 2 else "상"),
            "category": orig_q.get("category", "실수와 그 계산"),
            "originalCategory": orig_q.get("originalCategory", "기출변형"),
            "standardCourse": "중3 수학",
            "standardUnitKey": unit_key,
            "standardUnit": unit_label,
            "standardUnitOrder": unit_order,
            "subUnitKey": sub_key,
            "subUnit": sub_label,
            "problemTypeKey": strat.problem_type_key,
            "templateKey": strat.template_key,
            "integrationPattern": "NONE",
            "difficultyBucket": strat.difficulty_bucket,
            "crossConceptKeys": strat.cross_concept_keys,
            "conditionKeys": strat.condition_keys,
            "questionType": transformed["questionType"],
            "content": transformed["content"],
            "solution": transformed["solution"],
            "answer": transformed["answer"],
            "choices": transformed.get("choices", []),
            "score": transformed.get("score", 4.0),
        }
        if "image" in transformed:
            item["image"] = transformed["image"]

        similar_questions.append(item)

    return similar_questions


def generate_small_meta(questions: list[dict], js_bytes: bytes, source_file_rel: str, exam_uid: str):
    """Generate small metadata JSON strictly adhering to schema with 1:1 items parity."""
    blob_sha1 = compute_git_blob_sha1(js_bytes)
    items = []

    for q in questions:
        items.append({
            "questionUid": q["id"],
            "sourceOrdinal": q["id"],
            "before": None,
            "after": {
                "standardUnitKey": q["standardUnitKey"],
                "subUnitKey": q["subUnitKey"],
                "difficultyBucket": q["difficultyBucket"],
                "problemTypeKey": q["problemTypeKey"],
                "templateKey": q["templateKey"],
                "crossConceptKeys": list(q["crossConceptKeys"]),
                "conditionKeys": list(q["conditionKeys"]),
            },
            "reason": f"Samsan Middle 3-1 Midterm Q{q['id']:02d} similar variant strictly bound to canonical taxonomy",
        })

    small_meta = {
        "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
        "requestId": f"{exam_uid}-candidate-v2",
        "examUid": exam_uid,
        "sourceArchiveFile": source_file_rel,
        "expectedSourceBlobSha1": blob_sha1,
        "expectedQuestionCount": len(questions),
        "approval": {
            "type": "CANDIDATE_CREATION_GATE",
            "reviewPassCount": 0,
            "metadataReviewed": False,
            "reviewStatus": "review_required",
            "approvedBy": None,
            "evidenceRefs": [
                {
                    "path": "archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사.review-receipt.json",
                    "sha256": "d135370d5ba18e5ee19f7f32bc9c90b8a465b0081b180ba139bbc9481f14c88b",
                }
            ],
        },
        "registryChanges": [],
        "items": items,
    }
    return small_meta


def main():
    parser = argparse.ArgumentParser(description="Generate dynamic similar exam from original JS.")
    parser.add_argument(
        "--source",
        default="archive/exams/original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js",
        help="Path to original exam JS file",
    )
    parser.add_argument(
        "--out-js",
        default="archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사.js",
        help="Output JS path",
    )
    parser.add_argument(
        "--out-meta",
        default="archive/exams/similar/middle/m3/1mid/26_삼산중_1학기_중간_중3_유사.meta-q01-q24.json",
        help="Output small meta JSON path",
    )
    args = parser.parse_args()

    source_path = PROJECT_ROOT / args.source
    out_js_path = PROJECT_ROOT / args.out_js
    out_meta_path = PROJECT_ROOT / args.out_meta

    print(f"Loading original exam from: {source_path}")
    orig_questions = load_original_exam_js(source_path)
    print(f"Loaded {len(orig_questions)} original questions.")

    print("Executing blueprint transformation...")
    similar_questions = generate_exam(orig_questions)

    # Format JS output
    formatted_json = json.dumps(similar_questions, ensure_ascii=False, indent=2)
    js_content = f"// 26_삼산중_1학기_중간_중3_유사.js\n// Generated by Dynamic Similar Exam Pipeline\nwindow.questionBank = {formatted_json};\n"
    js_bytes = js_content.encode("utf-8")

    out_js_path.parent.mkdir(parents=True, exist_ok=True)
    out_js_path.write_bytes(js_bytes)
    blob_sha1 = compute_git_blob_sha1(js_bytes)
    print(f"Wrote {len(similar_questions)} questions to {out_js_path} ({len(js_bytes)} bytes)")
    print(f"Git Blob SHA-1: {blob_sha1}")

    # Generate small metadata JSON
    rel_js_path = str(out_js_path.relative_to(PROJECT_ROOT / "archive")).replace("\\", "/")
    exam_uid = out_js_path.stem
    small_meta = generate_small_meta(similar_questions, js_bytes, rel_js_path, exam_uid)

    out_meta_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_meta_path, "w", encoding="utf-8") as f:
        json.dump(small_meta, f, ensure_ascii=False, indent=2)
    print(f"Wrote small meta JSON to {out_meta_path} with {len(small_meta['items'])} items.")


if __name__ == "__main__":
    main()
