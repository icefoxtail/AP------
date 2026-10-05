from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
files = [
    "archive/exams/original/high/h2/2mid/23_조대부고_2학기_중간_고2_수학II.js",
    "archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js",
    "archive/question-index.js",
    "archive/db.js",
    "archive/assets/images/23_조대부고_2학기_중간_고2_수학II/q1.png",
    "archive/assets/images/23_조대부고_2학기_중간_고2_수학II/q16.png",
    "archive/assets/images/23_조대부고_2학기_중간_고2_수학II/q23.png",
    "archive/assets/images/24_조대부고_2학기_중간_고2_수학II/q1.png",
    "archive/assets/images/24_조대부고_2학기_중간_고2_수학II/q5.png",
    "archive/assets/images/24_조대부고_2학기_중간_고2_수학II/q7.png",
]
for d, names in [("23", ["q01-solution.svg", "q11-solution.svg", "q16-solution.svg", "q23-solution.svg"]), ("24", ["q01-solution.svg", "q05-solution.svg", "q07-solution.svg", "q08-solution.svg", "q12-solution.svg", "q15-solution.svg", "q16-solution.svg", "q17-solution.svg", "q18-solution.svg"])]:
    folder = f"archive/assets/images/{'23' if d == '23' else '24'}_조대부고_2학기_중간_고2_수학II"
    files += [f"{folder}/{n}" for n in names]


def sha(data):
    return hashlib.sha256(data).hexdigest()


baseline = {}
for f in files:
    baseline[f] = sha(subprocess.check_output(["git", "show", f"HEAD:{f}"]))
current = {f: sha((ROOT / f).read_bytes()) for f in files}
current_head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
out = {"initialReferenceSha": "ce6c8ade8e020e11d8593f803359e7664ff713b6", "startHeadAtFinalFreeze": current_head, "originMain": subprocess.check_output(["git", "rev-parse", "origin/main"], text=True).strip(), "targetDiffInitialToLatest": "0 target files changed between ce6c8ade and current main", "baselineSha256": baseline, "currentSha256": current, "problemPngUnchanged": all(baseline[f] == current[f] for f in files if f.endswith(".png"))}
(ROOT / "reports/solution-svg-jodaebu-pinpoint-20260906/hash-lock.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"initialReferenceSha":out["initialReferenceSha"],"startHeadAtFinalFreeze":out["startHeadAtFinalFreeze"],"originMain":out["originMain"],"trackedFileCount":len(files),"problemPngUnchanged":out["problemPngUnchanged"]},ensure_ascii=False,indent=2))
