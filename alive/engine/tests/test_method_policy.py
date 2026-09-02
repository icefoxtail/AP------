from __future__ import annotations

import unittest

from alive.engine.adaptive_method_profile import lint_solution_method, method_profile_for_unit


class MethodPolicyTests(unittest.TestCase):
    def test_continuity_correction_is_required_only_for_normal_approximation(self) -> None:
        profile = method_profile_for_unit("H15-PS-05")
        self.assertIsNotNone(profile)
        self.assertEqual(
            "REQUIRED",
            profile["methodPolicy"]["binomialNormalApproximation"]["continuityCorrection"],
        )

        exact_binomial = lint_solution_method(
            profile,
            "[풀이 과정] 이항분포의 확률질량함수를 이용해 정확히 계산한다.",
        )
        self.assertEqual("PASS", exact_binomial["verdict"])

        missing = lint_solution_method(
            profile,
            "[풀이 과정] 이항분포를 정규분포로 근사하여 표준화한다.",
        )
        self.assertEqual("FAIL", missing["verdict"])
        self.assertTrue(
            any(
                item["code"] == "CONTINUITY_CORRECTION_POLICY"
                and item["verdict"] == "FAIL"
                for item in missing["justificationChecks"]
            )
        )

        present = lint_solution_method(
            profile,
            "[풀이 과정] 이항분포를 정규분포로 근사한다. 연속성 수정을 적용하여 경계에 0.5를 더한 뒤 표준화한다.",
        )
        self.assertEqual("PASS", present["verdict"])
        self.assertTrue(
            any(
                item["code"] == "CONTINUITY_CORRECTION_POLICY"
                and item["verdict"] == "PASS"
                for item in present["justificationChecks"]
            )
        )


if __name__ == "__main__":
    unittest.main()
