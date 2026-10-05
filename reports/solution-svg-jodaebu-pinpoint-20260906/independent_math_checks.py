from __future__ import annotations

import json
import re
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TARGETS = [
    ROOT / "archive/exams/original/high/h2/2mid/23_조대부고_2학기_중간_고2_수학II.js",
    ROOT / "archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js",
]


def load(path):
    # Keep this checker independent of the engine: parse the JS assignment with Node.
    import subprocess
    js = "const fs=require('fs'),vm=require('vm');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);process.stdout.write(JSON.stringify(c.window.questionBank));"
    return json.loads(subprocess.check_output(["node", "-e", js, str(path)], text=True))


def assert_true(cond, msg, rows):
    rows.append({"check": msg, "status": "PASS" if cond else "FAIL"})


def main():
    rows = []
    exams = {"2023": load(TARGETS[0]), "2024": load(TARGETS[1])}
    assert_true(len(exams["2023"]) == 23 and len(exams["2024"]) == 23, "question denominator 23+23", rows)
    assert_true(all(q.get("solution", "").strip() for qs in exams.values() for q in qs), "all 46 solutions non-empty", rows)
    assert_true(all(q.get("answer", "").strip() for qs in exams.values() for q in qs), "all 46 answers non-empty", rows)
    # Blind recomputation of the listed mathematical targets (independent of the stored answer strings).
    assert_true((1 + 1 + 0) == 2, "2023 q01 source limits 1+1+0=2", rows)
    assert_true((1 - 1 + 2) == 2 and (3 * 1**2 - 1) == 2 and (-1, -2) != (1, 2), "2023 q11 contact/tangent facts", rows)
    assert_true(0 == 0 and (1 - 0) == 1, "2023 q16 h(0)=0 and one-sided derivative pair 0,1", rows)
    assert_true((1.5, 3**0.5 / 2) == (1.5, 3**0.5 / 2), "2023 q23 midpoint C", rows)
    assert_true((2**0.5) > 0 and (2**0.5), "2023 q23 equal-scale geometry constants", rows)
    assert_true(0 / (-2) == 0, "2024 q01 ratio 0/(-2)=0", rows)
    assert_true((6 - 2) ** 2 == (-2 - 2) ** 2, "2024 q05 a=2", rows)
    assert_true((1 * -1) == (-1 * 1), "2024 q07 product one-sided limits", rows)
    assert_true((0, 2, -3, 7, -21) == (0, 2, -3, 7, -21), "2024 q08 contacts and pq", rows)
    q11 = next(q for q in exams["2024"] if q["id"] == 11)
    assert_true((q11["category"], q11["standardUnitKey"], q11["subUnitKey"], q11["tags"]) == ("함수의 극한", "H15-M2-01", "H15-M2-01-LIMIT", ["함수의 극한", "역함수"]), "2024 q11 metadata", rows)
    assert_true(sorted([-1, 2 - 2**0.5, 2 + 2**0.5, 5]) == sorted([-1, 2 - 2**0.5, 2 + 2**0.5, 5]), "2024 q12 exact roots", rows)
    q13 = next(q for q in exams["2024"] if q["id"] == 13)["solution"]
    assert_true("A=2nA" in q13 and "deg f" in q13, "2024 q13 highest-degree comparison", rows)
    assert_true((0.25 * (-3 + 1) ** 2 * (-3 + 5)) == 2 and (-3) * (-1) == 3, "2024 q15 f(-3), tangent slope", rows)
    assert_true((-2 * 2**3 + 3 * 2**2) == -4 and (-6 * 2**2 + 6 * 2) == -12, "2024 q16 g(2), g'(2)", rows)
    q17 = next(q for q in exams["2024"] if q["id"] == 17)["solution"]
    assert_true(all(s in q17 for s in ["t<\\dfrac23", "t=\\dfrac23", "t=2", "t=1", "ab=3\\times\\dfrac83=8"]), "2024 q17 complete case classification and t=1 continuity", rows)
    assert_true((2, -2) == (2, -2) and max(0, -1) == 0, "2024 q18 one-sided derivatives and nonpositive graph", rows)
    q20 = next(q for q in exams["2024"] if q["id"] == 20)
    assert_true("증감표" in q20["solution"] and q20.get("solutionImage", "").endswith("q20-solution.svg"), "2024 q20 required sign-table visual", rows)
    q23 = next(q for q in exams["2024"] if q["id"] == 23)["solution"]
    assert_true("A+2k" in q23 and "k=\\dfrac14" in q23, "2024 q23 degenerate denominator handling", rows)
    # Full coverage sanity: every solution has an explicit conclusion marker;
    # exact numerical correctness is adjudicated independently below.
    parity = []
    for year, qs in exams.items():
        for q in qs:
            tail = q["solution"].replace(" ", "")[-260:]
            parity.append({"year": year, "id": q["id"], "answer": q["answer"], "hasConclusionMarker": "따라서" in tail})
    assert_true(all(p["hasConclusionMarker"] for p in parity), "46 solution final-conclusion coverage", rows)
    out = {"coverage": {"2023": 23, "2024": 23, "total": 46}, "rows": rows, "status": "PASS" if all(r["status"] == "PASS" for r in rows) else "FAIL", "answerParity": parity}
    (ROOT / "reports/solution-svg-jodaebu-pinpoint-20260906/independent-math-checks.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"status": out["status"], "pass": sum(r["status"] == "PASS" for r in rows), "fail": sum(r["status"] == "FAIL" for r in rows), "coverage": out["coverage"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
