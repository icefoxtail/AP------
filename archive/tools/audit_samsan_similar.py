"""
Audit runner for Samsan Middle School 3-1 Midterm Similar Exam.
Executes M3HarnessGate with fail-closed validation on:
- Production JS raw bytes and Node VM execution
- Small metadata JSON registration contract
- Diagram physical asset parity
- Canonical Meta Foundation taxonomy registry (no hallucinated keys)
- Review integrity (strict rejection of forged reviewStatus)
- Distractor sanity and 100.0 point score sum
"""

import sys
import json
import subprocess
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from alive.engine.m3_harness_gate import M3HarnessGate, compute_git_blob_sha1


def extract_questions_via_node(js_path: Path):
    """Safely extract window.questionBank using Node VM."""
    node_script = f"""
    const fs = require('fs');
    const content = fs.readFileSync({json.dumps(str(js_path))}, 'utf8');
    const sandbox = {{ window: {{}} }};
    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    console.log(JSON.stringify(sandbox.window.questionBank));
    """
    proc = subprocess.run(["node", "-e", node_script], capture_output=True, encoding="utf-8", check=True)
    return json.loads(proc.stdout)


def main():
    print("=== Samsan Middle 3-1 Midterm Similar Exam Rigorous Audit ===")
    
    js_path = PROJECT_ROOT / "archive" / "exams" / "similar" / "middle" / "m3" / "1mid" / "26_삼산중_1학기_중간_중3_유사.js"
    meta_path = PROJECT_ROOT / "archive" / "exams" / "similar" / "middle" / "m3" / "1mid" / "26_삼산중_1학기_중간_중3_유사.meta-q01-q24.json"
    
    if not js_path.exists():
        print(f"FAIL: JS file not found at {js_path}")
        sys.exit(1)
    if not meta_path.exists():
        print(f"FAIL: Small meta JSON not found at {meta_path}")
        sys.exit(1)
        
    raw_js_bytes = js_path.read_bytes()
    computed_sha1 = compute_git_blob_sha1(raw_js_bytes)
    print(f"Read JS file: {len(raw_js_bytes)} bytes | Git blob SHA-1: {computed_sha1}")
    
    questions = extract_questions_via_node(js_path)
    print(f"Extracted {len(questions)} questions via Node VM")
    
    with open(meta_path, "r", encoding="utf-8") as f:
        small_meta = json.load(f)
    print(f"Loaded small meta JSON: {len(small_meta.get('items', []))} items | Declared blob SHA-1: {small_meta.get('expectedSourceBlobSha1')}")
    
    gate = M3HarnessGate(repo_root=PROJECT_ROOT)
    result = gate.validate_exam(
        questions=questions,
        raw_js_bytes=raw_js_bytes,
        small_meta=small_meta,
        expected_question_count=24
    )
    
    print("\n--- Gate Check Results ---")
    status = result.get("status")
    findings_count = result.get("findingsCount", 0)
    print(f"Gate Status: {status} | Findings Count: {findings_count}")
    
    if findings_count > 0:
        print("\n[FINDINGS]")
        for f in result.get("findings", []):
            layer = f.get("layer")
            code = f.get("code")
            msg = f.get("message")
            qid = f.get("qid")
            qid_str = f" [Q{qid}]" if qid is not None else ""
            print(f"  - [{layer}] {code}{qid_str}: {msg}")
            
    if status == "PASS":
        print("\nSUCCESS: All harness gates passed without compromise.")
        sys.exit(0)
    else:
        print("\nFAILURE: One or more gates failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
