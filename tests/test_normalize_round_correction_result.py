import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HELPERS = ROOT / "archive" / "tools" / "past-exam-pipeline" / "helpers"
sys.path.insert(0, str(HELPERS))

from normalize_round_correction_result import normalize_correction_result


class NormalizeRoundCorrectionResultTest(unittest.TestCase):
    def test_writes_unparsed_items_without_claiming_repaired(self):
        with tempfile.TemporaryDirectory() as tmp:
            review_dir = Path(tmp)
            md = review_dir / "round1_correction_result.md"
            out = review_dir / "round1_correction_result.json"
            md.write_text(
                "# Round 1 Content/Choices Correction Result\n\n"
                "## JS Edits\n"
                "- 24_???_1??_?? id 15 content: restored omitted phrase\n\n"
                "## Verification\n"
                "- node --check: 10/10 candidate files OK\n",
                encoding="utf-8",
            )

            result = normalize_correction_result(review_dir=review_dir, input_md=md, out_json=out)

            self.assertEqual(result["status"], "manual_parse_required")
            self.assertEqual(result["items"], [])
            self.assertEqual(len(result["unparsedItems"]), 1)
            written = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(written["unparsedItems"][0]["raw"], "24_???_1??_?? id 15 content: restored omitted phrase")


if __name__ == "__main__":
    unittest.main()
