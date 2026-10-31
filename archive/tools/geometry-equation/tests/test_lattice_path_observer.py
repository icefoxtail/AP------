"""Lattice-path observer: the brute-force path counts and the plans it cannot read. No Chrome here: composed figures are exercised by tests/lattice-path.test.mjs."""
import sys
import unittest
from pathlib import Path

PRODUCTION = Path(__file__).resolve().parents[1] / 'production'
sys.path.insert(0, str(PRODUCTION))
import lattice_path_observer as O

Q12 = {'grid': {'cols': 6, 'rows': 3}, 'points': {'A': [0, 0], 'B': [6, 3], 'P': [4, 1], 'Q': [4, 2]},
       'forbidden': [['P', 'Q']], 'counts': True}


class Counts(unittest.TestCase):
    def test_walking_every_path_gives_the_binomial_and_the_complement(self):
        plain = O.Plan({'grid': {'cols': 6, 'rows': 3}, 'points': {'A': [0, 0], 'B': [6, 3]}, 'counts': True})
        counts = plain.expected_counts()
        self.assertEqual(plain.total, 84)
        self.assertEqual((counts[(3, 1)], counts[(2, 2)], counts[(6, 3)]), (4, 6, 84))
        plan = O.Plan(Q12)
        counts = plan.expected_counts()
        self.assertEqual((plan.total, counts[(4, 1)], counts[(4, 2)]), (69, 5, 10))

    def test_a_required_road_keeps_only_prefixes_that_can_still_reach_it(self):
        plan = O.Plan({**Q12, 'forbidden': [], 'via': [['P', 'Q']]})
        counts = plan.expected_counts()
        self.assertEqual((plan.total, counts[(4, 2)], counts[(6, 3)]), (15, 5, 15))
        self.assertNotIn((0, 3), counts)

    def test_the_target_count_is_not_shown_unless_asked(self):
        plan = O.Plan(Q12)
        shown = plan.shown(plan.expected_counts())
        self.assertNotIn((6, 3), shown)
        self.assertIn((0, 0), shown)
        plan = O.Plan({**Q12, 'hideTargetCount': False})
        self.assertEqual(plan.shown(plan.expected_counts())[(6, 3)], 69)

    def test_plans_that_cannot_be_read_are_errors(self):
        for bad in ({}, {'grid': {'cols': 0, 'rows': 2}}, {'grid': {'cols': 3, 'rows': 3}, 'points': {'a': [0, 0]}},
                    {'grid': {'cols': 3, 'rows': 3}, 'points': {'A': [9, 0]}},
                    {'grid': {'cols': 3, 'rows': 3}, 'points': {'A': [0, 0]}, 'counts': True}):
            with self.assertRaises(ValueError): O.Plan(bad)
        with self.assertRaises(Exception): O.audit({'grid': {'cols': 3, 'rows': 3}}, '<svg')


if __name__ == '__main__':
    unittest.main()
