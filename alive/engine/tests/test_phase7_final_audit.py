from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.phase7_final_audit import audit_phase7


class Phase7FinalAuditTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]

    def test_authoritative_m1_08_runs_are_phase7_active_bounded(self) -> None:
        report = audit_phase7(
            self.root,
            ("20260901-middle-m1-08-a03", "20260901-middle-m1-08-b02"),
        )
        self.assertEqual("PASS_ACTIVE_BOUNDED", report["status"])
        self.assertEqual(2, report["passedRunCount"])
        self.assertTrue(all(row["errors"] == [] for row in report["runs"]))
        self.assertEqual("NOT_PERFORMED", report["productionArchiveRegistration"])

    def test_missing_run_is_hold_and_never_promoted(self) -> None:
        report = audit_phase7(self.root, ("missing-phase7-run",))
        self.assertEqual("HOLD", report["status"])
        self.assertEqual("HOLD", report["promotionState"])
        self.assertEqual("FAIL", report["runs"][0]["status"])


if __name__ == "__main__":
    unittest.main()
