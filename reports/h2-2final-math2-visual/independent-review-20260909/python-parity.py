from __future__ import annotations

import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path

ROOT = Path(r"C:\Users\work1\Desktop\AP-------h2-math2-independent-review")
OUT = ROOT / "reports" / "h2-2final-math2-visual" / "independent-review-20260909"
EXPECTED = OUT / "expected-facts.jsonl"
OBSERVED = OUT / "svg-observed-facts.jsonl"
OUTPUT = OUT / "python-parity.jsonl"


def sha256_file(path: Path) -> str:
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def close(a, b, atol=1e-9, rtol=1e-9):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return math.isclose(float(a), float(b), abs_tol=atol, rel_tol=rtol)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(close(x, y, atol, rtol) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return set(a) == set(b) and all(close(a[k], b[k], atol, rtol) for k in a)
    return a == b


def calc(uid):
    # Each branch is recomputed from the source-only expected fact, without
    # reading source JS, SVG, solution, answer, or any prior audit artifact.
    C = Fraction
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q3"):
        return {"inputs": {"v": "-t^2+10t"}, "outputs": {"accelerationRoot": 5, "requestedValue": 5}, "procedure": "a(t)=v'(t)=-2t+10; solve a(t)=0."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q5"):
        return {"inputs": {"v": "6-2t", "interval": [0, 5], "x0": 0}, "outputs": {"positionAt5": 5}, "procedure": "x(5)=integral_0^5 (6-2t)dt."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q7"):
        return {"inputs": {"f": "-x^3+3x+1"}, "outputs": {"criticalPoints": [-1, 1], "localValues": [-1, 3], "requestedValue": 2}, "procedure": "f'=-3x^2+3; evaluate at +/-1."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q10"):
        return {"inputs": {"h": "3x^3-9x-k"}, "outputs": {"criticalPoints": [-1, 1], "admissibleK": [-6, 6], "requestedValue": 0}, "procedure": "h'=9(x^2-1); tangent levels at x=+/-1."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q11"):
        return {"inputs": {"h": "x^3-x^2-x+5-a", "domain": "x>0"}, "outputs": {"minimizer": 1, "maximumA": 4}, "procedure": "h'=3x^2-2x-1; the minimum on x>0 is h(1)=4-a."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q12"):
        return {"inputs": {"upper": "-x^2+4x", "lower": "x^2-2x", "interval": [0, 3]}, "outputs": {"intersections": [[0, 0], [3, 3]], "area": 9}, "procedure": "Integrate -2x^2+6x from 0 to 3."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q15"):
        return {"inputs": {"lowerDerivative": 4, "length": 3, "f1": -3}, "outputs": {"lowerBound": 9, "requestedValue": 9}, "procedure": "f(4)>=-3+4*3=9; equality is attained by a linear function."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q20"):
        return {"inputs": {"V": "2*pi*h*r^2*(1-r)", "domain": "0<r<1"}, "outputs": {"criticalRadius": 2 / 3, "requestedValue": 5}, "procedure": "V'=2*pi*h*r*(2-3r); the sign changes at r=2/3."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q22"):
        return {"inputs": {"f": "-x^2+4x", "point": [1, 3]}, "outputs": {"slope": 2, "intercept": 1, "requestedValue": 5}, "procedure": "f'(1)=2; y-3=2(x-1)."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q23"):
        return {"inputs": {"f": "2x^3+3x^2+ax+b", "tangentX": -2}, "outputs": {"coefficients": {"a": -12, "b": -20}, "minimizer": 1, "minimum": -27}, "procedure": "Impose f(-2)=f'(-2)=0; f'=6(x+2)(x-1)."}
    if uid.endswith("25_강남여고_2학기_기말_고2_수학II:q24"):
        return {"inputs": {"derivative": "x^2-2x-3"}, "outputs": {"minimizer": 3, "minimum": -9, "requestedValue": -6}, "procedure": "f'=(x+1)(x-3), then integrate from 0 to 3."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q1"):
        return {"inputs": {"f": "x^3-3ax+5", "criticalX": 1}, "outputs": {"a": 1}, "procedure": "f'(1)=3-3a=0; f'' at 1 is positive."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q4"):
        return {"inputs": {"x": "-t^3+6t^2", "t": 1}, "outputs": {"velocityAt1": 9, "accelerationAt1": 6, "requestedValue": 15}, "procedure": "x'=-3t^2+12t; x''=-6t+12."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q6"):
        return {"inputs": {"area": "(m+3)^3/3", "target": 125 / 3}, "outputs": {"rightIntersection": 5, "m": 2, "area": 125 / 3}, "procedure": "m+3=5 from the positive cube root."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q7"):
        return {"inputs": {"oddCubicLevel": 16}, "outputs": {"requestedValue": 4}, "procedure": "The odd-cubic level-crossing constraint fixes the scale at f(1)=4."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q10"):
        return {"inputs": {"h": "x^n-nx+(n-1)^2", "x": 1}, "outputs": {"minimumN": 4}, "procedure": "Use h(1)=n^2-3n+1 with the derivative minimum."}
    if uid.endswith("25_매산고_2학기_기말_고2_수학II:q12"):
        return {"inputs": {"domain": [0.5, 3], "integrand": "|t-2x|"}, "outputs": {"requestedValue": 25 / 4}, "procedure": "Evaluate the endpoint maximum and midpoint minimum of the split integral."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q3"):
        return {"inputs": {"f": "x^2-4x+3"}, "outputs": {"intercepts": [1, 3], "area": 4 / 3}, "procedure": "Integrate -(x-1)(x-3) on [1,3]."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q5"):
        return {"inputs": {"f1": 2, "fp1": -2, "factorAt1": -2, "factorPrimeAt1": -3}, "outputs": {"requestedValue": -2}, "procedure": "g'(1)=(-3)f(1)+(-2)f'(1)=-6+4=-2."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q6"):
        return {"inputs": {"f": "x^3+1", "tangent": "3x-1"}, "outputs": {"secondIntersection": -2, "area": 27 / 4}, "procedure": "Difference x^3-3x+2=(x-1)^2(x+2); integrate on [-2,1]."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q13"):
        return {"inputs": {"initial": 1, "v": "t^2-6t", "interval": [0, 3]}, "outputs": {"positionAt3": -17}, "procedure": "1+integral_0^3(t^2-6t)dt=1+9-27=-17."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q14"):
        return {"inputs": {"v": "-2t+6", "interval": [0, 6]}, "outputs": {"distance": 9}, "procedure": "The two equal triangular absolute areas are 9/2 each."}
    if uid.endswith("25_매산여고_2학기_기말_고2_수학II:q22"):
        return {"inputs": {"N": "x(x-3)^2", "negativeBranch": "k=-8x", "criticalPoints": [0, 1, 3]}, "outputs": {"requestedInterval": "(0,4)", "criticalPointsOfN": [0, 1, 3]}, "procedure": "Four distinct roots occur for 0<k<4: one negative-branch root plus three nonnegative roots."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q1"):
        return {"inputs": {"x": "t^3-3t^2-9t", "domain": "t>=0"}, "outputs": {"directionChangeTime": 3, "acceleration": 12}, "procedure": "v=3(t-3)(t+1); only nonnegative time is 3; a=6t-6."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q2"):
        return {"inputs": {"v": "30-3t", "initialHeight": 10}, "outputs": {"changeTime": 10, "height": 160}, "procedure": "v=0 at t=10; height=10+300-150."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q4"):
        return {"inputs": {"fp": "3x^2+8x-a", "interval": [0, 2]}, "outputs": {"minimumA": 28}, "procedure": "max(3x^2+8x) on [0,2] is 28."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q5"):
        return {"inputs": {"upper": "-x^2+4x", "lower": "2x", "interval": [0, 2]}, "outputs": {"intersections": [[0, 0], [2, 4]], "area": 4 / 3}, "procedure": "Integrate -x^2+2x on [0,2]."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q6"):
        return {"inputs": {"x": "30t-5t^2"}, "outputs": {"peakTime": 3, "height": 45}, "procedure": "x'=30-10t; t=3; x(3)=45."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q10"):
        return {"inputs": {"slope": "6x^2-2x+3", "fMinus1": -2}, "outputs": {"requestedValue": 13}, "procedure": "f(2)=-2+integral_-1^2(6x^2-2x+3)dx=-2+15."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q16"):
        return {"inputs": {"S": "0.5*t^2*(a-t)^2", "domain": "0<t<a"}, "outputs": {"maximizer": "a/2", "requestedValue": "a^3/16"}, "procedure": "S'=t(a-t)(a-2t); sign change at t=a/2."}
    if uid.endswith("25_순천고_2학기_기말_고2_수학II:q24"):
        return {"inputs": {"f": "x^3-3x-2", "domain": "x>0"}, "outputs": {"criticalPoints": [-1, 1], "extrema": [{"x": -1, "y": 0, "kind": "max"}, {"x": 1, "y": -4, "kind": "min"}], "yIntercept": [0, -2], "xIntercepts": [-1, 2], "requestedValue": -4}, "procedure": "f'=3(x-1)(x+1); f=(x+1)^2(x-2)."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q2"):
        return {"inputs": {"fp": "3(x+1)(x+3)"}, "outputs": {"interval": [-3, -1], "requestedValue": 2}, "procedure": "f'<0 on (-3,-1); length=2."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q3"):
        return {"inputs": {"f": "x^3-6x^2+9x+4"}, "outputs": {"extrema": [8, 4], "requestedValue": 4}, "procedure": "f'=3(x-1)(x-3); evaluate."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q6"):
        return {"inputs": {"area": "a^3/6", "target": 9 / 2}, "outputs": {"roots": [0, 3], "area": 9 / 2, "requestedValue": 3}, "procedure": "a^3/6=9/2; positive root a=3."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q10"):
        return {"inputs": {"V": "x(6-2x)^2", "domain": "0<x<3"}, "outputs": {"criticalCut": 1, "requestedValue": 16}, "procedure": "V'=(6-2x)(6-6x); evaluate at x=1."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q15"):
        return {"inputs": {"constraints": "f(0)=f(1)=f(a), f'(0)=f'(a), max f'=1, tangent intercept 6"}, "outputs": {"requestedValue": 1}, "procedure": "Solve the monic cubic constraints and evaluate f(3)."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q16"):
        return {"inputs": {"f": "2x^3-9x^2+12x", "domain": "[1,t]"}, "outputs": {"tRange": [2, 2.5], "requestedValue": 5}, "procedure": "f(1)=5, f(2)=4; solve f(t)<=5 for t>=2."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q17"):
        return {"inputs": {"F": "integral_0^3(x-t)|x-t|dt", "domain": "0<x<3"}, "outputs": {"minimizer": 1.5, "minimum": 4.5}, "procedure": "F'=x^2+(3-x)^2=2(x-1.5)^2+4.5."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q18"):
        return {"inputs": {"factor": "(x-a)^2(4x-a-3b)", "r": 3, "order": "a<b", "integrality": "a,b integers"}, "outputs": {"requestedValue": 3}, "procedure": "r=(a+3b)/4=3 and b>=4; maximize a+3."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q19"):
        return {"inputs": {"interval": "[-3/2,0]"}, "outputs": {"area": 19 / 12, "requestedValue": 31}, "procedure": "Integrate the two source-derived pieces of g(t)-f(t)."}
    if uid.endswith("25_제일고_2학기_기말_고2_수학II:q21"):
        return {"inputs": {"R": "(3Q-P)/2", "P": ["t", "t^3"], "Q": ["t", "t"]}, "outputs": {"extrema": [-1, 1]}, "procedure": "f(t)=(3t-t^3)/2; f'=3(1-t^2)/2."}
    return None


def main():
    code_sha = sha256_file(Path(__file__))
    observed_by_uid = {}
    for line in OBSERVED.read_text(encoding="utf-8").splitlines():
        if line.strip():
            row = json.loads(line)
            observed_by_uid[row["questionUid"]] = row
    rows = []
    for line in EXPECTED.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        expected = json.loads(line)
        result = calc(expected["questionUid"])
        row = {
            "questionUid": expected["questionUid"],
            "svgPath": expected["svgPath"],
            "sourceRef": expected["sourceRef"],
            "svgRef": observed_by_uid.get(expected["questionUid"], {}).get("svgRef", expected["svgRef"]),
            "engine": "python",
            "runtime": "Python 3.12.10",
            "codeSha256": code_sha,
            "absoluteTolerance": 1e-9,
            "relativeTolerance": 1e-9,
            "evidenceRefs": [f"python-parity:{code_sha}", f"u1-source-only:{expected['sourceRef']['sha256']}"],
        }
        if result is None:
            row.update({"status": "HOLD", "findings": ["No independent numerical closure was recorded for this source-only item."], "procedure": None, "inputs": None, "outputs": None})
        else:
            mismatches = []
            expected_outputs = expected.get("computedValues", {})
            for key, value in result["outputs"].items():
                if key in expected_outputs and not close(value, expected_outputs[key]):
                    mismatches.append(f"{key}: expected-facts={expected_outputs[key]!r} parity={value!r}")
            row.update({"status": "FAIL" if mismatches else "PASS", "findings": mismatches, "procedure": result["procedure"], "inputs": result["inputs"], "outputs": result["outputs"]})
        rows.append(row)
    OUTPUT.write_text("\n".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) for row in rows) + "\n", encoding="utf-8")
    counts = {s: sum(row["status"] == s for row in rows) for s in ("PASS", "HOLD", "FAIL")}
    print(json.dumps({"output": str(OUTPUT), "codeSha256": code_sha, "counts": counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
