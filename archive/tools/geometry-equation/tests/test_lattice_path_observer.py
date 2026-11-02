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


ABSENT13 = [[[3, 0], [4, 0]], [[0, 4], [1, 4]], [[1, 4], [2, 4]], [[0, 3], [0, 4]], [[1, 3], [1, 4]], [[4, 0], [4, 1]]]
Q13 = {'grid': {'cols': 4, 'rows': 4}, 'points': {'A': [0, 0], 'B': [4, 4], 'P': [2, 2]}, 'absent': ABSENT13, 'exclude': ['P'], 'counts': True}


class AbsentAndExclude(unittest.TestCase):
    """22 hyocheon q13: six roads do not exist and the crossing P may not be used. The observer walks every path without those roads and without P."""

    def test_walking_the_paths_without_the_absent_roads_and_without_p(self):
        plan = O.Plan(Q13)
        counts = plan.expected_counts()
        self.assertEqual(plan.total, 28)
        rows = [[1, 1, 1, 1], [1, 2, 3, 4, 4], [1, 3, None, 4, 8], [1, 4, 4, 8, 16], [None, None, 4, 12, 28]]
        for y, row in enumerate(rows):
            for x, c in enumerate(row):
                if c is not None: self.assertEqual(counts[(x, y)], c, (x, y))
        self.assertNotIn((2, 2), counts)             # nothing is counted at P
        self.assertNotIn((4, 0), counts)             # no road reaches (4,0)
        self.assertEqual(plan.shown_excluded(), {(2, 2)})
        self.assertNotIn((4, 4), plan.shown(counts)) # the answer at B stays hidden
        self.assertEqual(plan.absent, {O.Plan.edge(tuple(a), tuple(b)) for a, b in ABSENT13})

    def test_the_complement_check_64_minus_6_times_6(self):
        without_p = O.Plan({k: v for k, v in Q13.items() if k != 'exclude'})
        without_p.expected_counts()
        self.assertEqual(without_p.total, 64)
        self.assertEqual(64 - 6 * 6, 28)

    def test_a_counts_list_decides_whether_the_zero_is_written(self):
        self.assertEqual(O.Plan({**Q13, 'counts': ['A']}).shown_excluded(), set())
        self.assertEqual(O.Plan({**Q13, 'counts': ['P']}).shown_excluded(), {(2, 2)})
        plain = O.Plan({k: v for k, v in Q13.items() if k not in ('exclude', 'absent')})
        self.assertEqual(plain.shown_excluded(), set())

    def test_plans_with_a_conflict_are_errors(self):
        for extra in ({'forbidden': [[[3, 0], [4, 0]]]}, {'via': [[[3, 0], [4, 0]]]}, {'exclude': ['A']}, {'exclude': ['B']}):
            with self.assertRaises(ValueError): O.Plan({**Q13, **extra})
        with self.assertRaises(ValueError): O.Plan({**Q13, 'counts': False})


if __name__ == '__main__':
    unittest.main()
