from __future__ import annotations

STAGES = (
    ("R00_REQUEST_NORMALIZE", "Request normalize"),
    ("R00A_CAPABILITY_PRECHECK", "Milestone capability precheck"),
    ("R01_SOURCE_RESOLVE", "Source resolve"),
    ("R02_SOURCE_LOCK", "Source lock and hash"),
    ("R03_SOURCE_ANALYSIS", "Independent source analysis"),
    ("R04_CURRICULUM_FINGERPRINT", "Curriculum contract and fingerprint"),
    ("R05_PLAN_POOL", "Transformation plan pool"),
    ("R06_PLAN_CRITIC", "Plan critic and reducer"),
    ("R07_CANDIDATE_BUILD", "Candidate build"),
    ("R08_LOCAL_CHECKS", "Deterministic local checks"),
    ("R09_INDEPENDENT_MATH", "Independent math verification"),
    ("R10_QUALITY_GATES", "Curriculum, fidelity, difficulty, and anti-clone"),
    ("R11_DISTRACTOR", "Distractor or response-form verification"),
    ("R12_FINAL_REDUCER", "Candidate judge and final reducer"),
    ("R13_STRUCTURED_ADAPTER", "Structured question adapter"),
    ("R14_JS_SERIALIZER", "JS Archive serializer"),
    ("R15_REAL_RENDER", "Exam, solution, and answer real render"),
    ("R16_PACKAGE", "Package round-trip and report"),
    ("R17_LOCAL_FREEZE", "Local freeze"),
)

GENERATION_MODES = ("TYPE_BANK", "EXAM_FOLLOWUP", "STRICT_VARIANT")
OPERATION_MODES = ("GENERATE", "REVIEW_ONLY", "SERIALIZE_ONLY")
OUTPUT_PROFILES = ("REVIEW_TEXT", "PROBLEM_ANSWER_ONLY", "JS_ARCHIVE")
FOLLOWUP_KINDS = ("CONFIRMATION", "ADVANCED")


def initial_stages() -> list[dict[str, object]]:
    return [
        {"stageId": stage_id, "label": label, "status": "PENDING", "evidence": []}
        for stage_id, label in STAGES
    ]
