"""
Rigorous Multi-Layer Audit Runner for Samsan Middle School 3-1 Midterm Similar Exam.
Integrates:
1. pipeline-core official student-output validations:
   - validateStudentSerialization (LaTeX escape preservation, zero control characters)
   - validateCanonicalL1L2 (curriculum unit, subunit, order, and master table alignment)
2. M3HarnessGate fail-closed activation gate:
   - Layer 1: Schema & window.questionBank completeness
   - Layer 2: Choice uniqueness & distractor sanity (sum = 100.0)
   - Layer 3: Visual asset parity (physical PNG existence and policy compliance)
   - Layer 4: Meta Foundation registry parity (ACTIVE PT/TPL or null with pending rationale)
   - Layer 5: Small JSON contract, Git blob SHA-1 byte parity, items 1:1 parity, approval guard
3. Student presentation parity:
   - Problem sheet (mode=exam)
   - Solution sheet (mode=sol)
   - Answer table (mode=ans)
"""

import sys
import json
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from alive.engine.m3_harness_gate import M3HarnessGate, compute_git_blob_sha1


def extract_questions_and_run_pipeline_core(js_path: Path):
    """Safely extract questionBank and execute pipeline-core student-output validators."""
    node_script = f"""
    import fs from 'node:fs';
    import vm from 'node:vm';
    import {{ validateStudentSerialization, validateCanonicalL1L2 }} from './archive/tools/pipeline-core/student-output.mjs';

    const content = fs.readFileSync({json.dumps(str(js_path))}, 'utf8');
    const sandbox = {{ window: {{}} }};
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    const questions = sandbox.window.questionBank;

    const pipelineErrors = [];
    for (const q of questions) {{
        const ser = validateStudentSerialization(q);
        if (ser.status !== 'PASS') {{
            pipelineErrors.push({{ qid: q.id, type: 'SERIALIZATION', errors: ser.errors }});
        }}
        const l1l2 = validateCanonicalL1L2(q);
        if (l1l2.status !== 'PASS') {{
            pipelineErrors.push({{ qid: q.id, type: 'CANONICAL_L1L2', errors: l1l2.errors }});
        }}
    }}

    console.log(JSON.stringify({{
        questions,
        pipelineErrors,
    }}));
    """
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", node_script],
        capture_output=True,
        encoding="utf-8",
        cwd=str(PROJECT_ROOT),
        check=True
    )
    return json.loads(proc.stdout)


def audit_student_modes(questions: list[dict]):
    """Verify data sufficiency for exam, solution, and answer modes."""
    errors = []
    for q in questions:
        qid = q.get("id")
        # Exam mode
        if not q.get("content"):
            errors.append(f"Q{qid}: missing content for mode=exam")
        if q.get("questionType") == "객관식" and len(q.get("choices", [])) != 5:
            errors.append(f"Q{qid}: MC choices count != 5 for mode=exam")
        # Sol mode
        if not q.get("solution") or len(q.get("solution").strip()) < 10:
            errors.append(f"Q{qid}: insufficient solution for mode=sol")
        # Ans mode
        if not q.get("answer"):
            errors.append(f"Q{qid}: missing answer for mode=ans")
    return errors


def main():
    print("=== Samsan Middle 3-1 Midterm Similar Exam Rigorous Pipeline Audit ===")
    
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
    
    # 1. Pipeline-core official validator
    extracted = extract_questions_and_run_pipeline_core(js_path)
    questions = extracted["questions"]
    pipeline_errors = extracted["pipelineErrors"]
    print(f"Extracted {len(questions)} questions via Node VM")
    
    if pipeline_errors:
        print("\n[PIPELINE-CORE ERRORS]")
        for err in pipeline_errors:
            print(f"  - Q{err['qid']} [{err['type']}]: {err['errors']}")
        sys.exit(1)
    else:
        print("[PASS] pipeline-core: student serialization & canonical L1L2 validation")
        
    # 2. Student modes audit
    mode_errors = audit_student_modes(questions)
    if mode_errors:
        print("\n[STUDENT MODE AUDIT ERRORS]")
        for err in mode_errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("[PASS] student modes: exam, sol, ans data sufficiency")

    # 3. Small Meta & M3HarnessGate audit
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
        print("\nSUCCESS: All pipeline-core and harness gates passed without compromise.")
        sys.exit(0)
    else:
        print("\nFAILURE: One or more gates failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
