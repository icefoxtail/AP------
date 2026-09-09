from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUN = ROOT / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
TARGETS = [
    "20_매산고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "20_매산여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_여천고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_여천고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "23_중앙여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_한영고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_부영여고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "24_여양고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_여천고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_여천고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "24_중앙여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_한영고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
]


for name in TARGETS:
    path = RUN / "packages" / name / "reports" / "EXCLUDED_QUESTIONS.md"
    text = path.read_text(encoding="utf-8")
    marker = "## B replacement projection"
    if marker not in text:
        text = text.rstrip() + "\n\n" + marker + "\n\n- The original source question remains excluded from the original lineage. A separate B1 derived replacement is active in this external-review package only; production adoption remains unauthorized.\n"
        path.write_text(text, encoding="utf-8")
