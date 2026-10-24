"""
Rigorous Multi-Layer Audit Runner for Geumdang Middle School 3-2 Midterm Similar Exam.
Integrates:
1. pipeline-core official student-output validations:
   - validateStudentSerialization (LaTeX escape preservation, zero control characters)
   - validateCanonicalL1L2 (curriculum unit, subunit, order, and master table alignment)
2. M3HarnessGate fail-closed activation gate:
   - Layer 1: Schema & window.questionBank completeness
   - Layer 2: Choice uniqueness & distractor sanity (sum = 100.0)
   - Layer 3: Visual asset parity (physical SVG existence and policy compliance)
   - Layer 4: Meta Foundation registry parity (ACTIVE PT/TPL)
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
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Node execution failed: {proc.stderr}")
    return json.loads(proc.stdout)


def simulate_student_modes(questions: list[dict]):
    """Simulate presentation requirements for exam, sol, and ans modes."""
    failures = []
    for q in questions:
        qid = q.get("id")
        content = q.get("content") or ""
        choices = q.get("choices") or []
        answer = q.get("answer") or ""
        solution = q.get("solution") or ""

        # mode=exam: content non-empty, choices non-empty for MC
        if not content.strip():
            failures.append(f"Q{qid}: empty content in mode=exam")
        if q.get("questionType") == "객관식" and len(choices) != 5:
            failures.append(f"Q{qid}: invalid choices count in mode=exam")

        # mode=sol: solution must be present and pedagogical
        if not solution.strip() or len(solution.strip()) < 10:
            failures.append(f"Q{qid}: insufficient solution in mode=sol")

        # mode=ans: answer must be present
        if not answer.strip():
            failures.append(f"Q{qid}: missing answer in mode=ans")

    return failures


def main():
    print("=== Geumdang Middle 3-2 Midterm Similar Exam Rigorous Pipeline Audit ===")
    js_path = PROJECT_ROOT / "archive/exams/similar/middle/m3/2mid/25_금당중_2학기_중간_중3_유사.js"
    meta_path = PROJECT_ROOT / "archive/exams/similar/middle/m3/2mid/25_금당중_2학기_중간_중3_유사.meta-q01-q24.json"

    raw_js_bytes = js_path.read_bytes()
    blob_sha1 = compute_git_blob_sha1(raw_js_bytes)
    print(f"Read JS file: {len(raw_js_bytes)} bytes | Git blob SHA-1: {blob_sha1}")

    extracted = extract_questions_and_run_pipeline_core(js_path)
    questions = extracted["questions"]
    pipeline_errors = extracted["pipelineErrors"]

    print(f"Extracted {len(questions)} questions via Node VM")
    if pipeline_errors:
        print(f"[FAIL] pipeline-core errors: {json.dumps(pipeline_errors, indent=2, ensure_ascii=False)}")
        sys.exit(1)
    else:
        print("[PASS] pipeline-core: student serialization & canonical L1L2 validation")

    student_mode_failures = simulate_student_modes(questions)
    if student_mode_failures:
        print(f"[FAIL] Student mode parity errors: {student_mode_failures}")
        sys.exit(1)
    else:
        print("[PASS] student modes: exam, sol, ans data sufficiency")

    small_meta = json.loads(meta_path.read_text(encoding="utf-8"))
    print(f"Loaded small meta JSON: {len(small_meta.get('items', []))} items | Declared blob SHA-1: {small_meta.get('expectedSourceBlobSha1')}")

    # Visual QIDs for Geumdang: Q01, Q04~Q24 (all except Q02, Q03)
    geumdang_visual_qids = {i for i in range(1, 25) if i not in (2, 3)}

    gate = M3HarnessGate(PROJECT_ROOT)
    res = gate.validate_exam(
        questions,
        raw_js_bytes,
        small_meta,
        expected_question_count=24,
        visual_qids=geumdang_visual_qids,
    )

    print("\n--- Gate Check Results ---")
    print(f"Gate Status: {res['status']} | Findings Count: {len(res['findings'])}")

    if res["findings"]:
        print("Findings Details:")
        for f in res["findings"]:
            print(f"  [{f['severity']}] Layer: {f['layer']} | Code: {f['code']} | QID: {f['qid']} | Msg: {f['message']}")
        sys.exit(1)

    print("\nSUCCESS: All pipeline-core and harness gates passed without compromise.")


if __name__ == "__main__":
    main()
