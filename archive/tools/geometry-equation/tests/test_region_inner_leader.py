"""A region's value stands outside it on a leader that starts on a dot INSIDE the region (never on its boundary, where it reads as the length of a side or radius):
the spots the engine offers, the layout rule for the leader, and the 'no spot' case. Pure functions only (no browser)."""
import math
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from visual_engine import engine, label_layout
from visual_engine.label_layout import Box

SQUARE = [[(100.0, 100.0), (260.0, 100.0), (260.0, 220.0), (100.0, 220.0)]]
EDGES = [{'id': 'e%d' % i, 'kind': 'line', 'geometry': [SQUARE[0][i], SQUARE[0][(i + 1) % 4]]} for i in range(4)]


def inside(point, polygons):
    return label_layout.point_in_even_odd(point, polygons)


def boundary_distance(point, polygons):
    return min(label_layout.point_segment_distance(point, poly[i], poly[(i + 1) % len(poly)]) for poly in polygons for i in range(len(poly)))


def placement(region, others=(), occupied=None, size=(36.0, 18.0), spots=None):
    label = {'id': 'r-label', 'target': 'r', 'regionLeader': {
        'anchors': [], 'inner': spots if spots is not None else engine._region_inner_points(region, occupied or EDGES),
        'gaps': list(engine.REGION_LEADER_GAPS), 'polygons': region, 'near': None, 'only': True,
        'regions': [{'id': 'r', 'polygons': region}] + [{'id': 'o%d' % i, 'polygons': p} for i, p in enumerate(others)]}}
    return label_layout.region_inner_leader_placement(label, size[0], size[1], occupied or EDGES, lambda box, owner_check=False: True)


class Spots(unittest.TestCase):
    def test_spots_are_well_inside_and_clear_of_strokes(self):
        diagonal = {'id': 'd', 'kind': 'line', 'geometry': [(100.0, 100.0), (260.0, 220.0)]}
        spots = engine._region_inner_points(SQUARE, EDGES + [diagonal])
        self.assertTrue(spots)
        for spot in spots:
            at = tuple(spot['at'])
            self.assertTrue(inside(at, SQUARE))
            self.assertGreaterEqual(boundary_distance(at, SQUARE), engine.REGION_INNER_CLEAR_PX - 1e-6)
            self.assertGreaterEqual(label_layout.point_segment_distance(at, *diagonal['geometry']), engine.REGION_INNER_STROKE_PX - 1e-6)

    def test_a_hole_and_a_point_are_avoided(self):
        ring = SQUARE + [[(150.0, 130.0), (210.0, 130.0), (210.0, 190.0), (150.0, 190.0)]]
        point = {'id': 'p', 'kind': 'point', 'geometry': [125.0, 160.0, 4.0]}
        for spot in engine._region_inner_points(ring, EDGES, ()) + engine._region_inner_points(ring, EDGES + [point], ()):
            self.assertFalse(130 - 9 < spot['at'][1] < 190 + 9 and 150 - 9 < spot['at'][0] < 210 + 9)
        for spot in engine._region_inner_points(SQUARE, EDGES + [point]):
            self.assertGreaterEqual(math.dist(spot['at'], (125.0, 160.0)), 4.0 + engine.REGION_INNER_POINT_PX - 1e-6)

    def test_a_region_too_small_for_a_spot_has_none(self):
        tiny = [[(0.0, 0.0), (12.0, 0.0), (12.0, 12.0), (0.0, 12.0)]]
        self.assertEqual(engine._region_inner_points(tiny, []), [])


class Placement(unittest.TestCase):
    def test_the_leader_starts_inside_leaves_once_and_the_label_is_outside(self):
        found = placement(SQUARE)
        self.assertIsNotNone(found)
        box, start, end, direction = found
        self.assertTrue(inside(start, SQUARE))
        self.assertGreaterEqual(boundary_distance(start, SQUARE), engine.REGION_INNER_CLEAR_PX - 1e-6)
        self.assertFalse(inside(end, SQUARE))
        for corner in ((box.x, box.y), (box.right, box.y), (box.x, box.bottom), (box.right, box.bottom)):
            self.assertFalse(inside(corner, SQUARE))
        # one crossing of the boundary and never back
        samples = [(start[0] + (end[0] - start[0]) * k / 200, start[1] + (end[1] - start[1]) * k / 200) for k in range(201)]
        states = [inside(point, SQUARE) for point in samples]
        self.assertEqual(sum(1 for a, b in zip(states, states[1:]) if a != b), 1)

    def test_the_leader_crosses_no_stroke_but_the_boundary(self):
        cut = {'id': 'cut', 'kind': 'line', 'geometry': [(100.0, 160.0), (260.0, 160.0)]}
        found = placement(SQUARE, occupied=EDGES + [cut])
        self.assertIsNotNone(found)
        _, start, end, _ = found
        for stroke in EDGES + [cut]:
            a, b = stroke['geometry']
            if stroke['id'] == 'cut':
                self.assertFalse(label_layout.segments_intersect(start, end, a, b) if hasattr(label_layout, 'segments_intersect') else label_layout.segment_segment_distance(start, end, a, b) <= 0.5)

    def test_it_never_runs_through_another_filled_region(self):
        neighbour = [[(260.0, 100.0), (400.0, 100.0), (400.0, 220.0), (260.0, 220.0)]]
        found = placement(SQUARE, others=[neighbour])
        self.assertIsNotNone(found)
        _, start, end, _ = found
        for k in range(201):
            point = (start[0] + (end[0] - start[0]) * k / 200, start[1] + (end[1] - start[1]) * k / 200)
            self.assertFalse(inside(point, neighbour))

    def test_a_spot_inside_an_overlapping_region_is_not_used(self):
        overlap = [[(180.0, 100.0), (330.0, 100.0), (330.0, 220.0), (180.0, 220.0)]]
        found = placement(SQUARE, others=[overlap])
        self.assertIsNotNone(found)
        self.assertFalse(inside(found[1], overlap))

    def test_no_spot_means_no_placement_and_never_a_boundary_start(self):
        self.assertIsNone(placement(SQUARE, spots=[]))
        found = placement(SQUARE)
        self.assertGreaterEqual(boundary_distance(found[1], SQUARE), 1.0)


BOX = [(130.0, 120.0), (240.0, 120.0), (240.0, 200.0), (130.0, 200.0)]
CUT_BOX = [{'id': 'b%d' % i, 'kind': 'line', 'geometry': [BOX[i], BOX[(i + 1) % 4]]} for i in range(4)]


class PieceCutOffByStrokes(unittest.TestCase):
    """A region cut by strokes (the trapezoid of a drawing with a height and a diagonal): the roomiest spots all lie in the big closed piece, whose leader would have to cross strokes,
    so the spot that lets the leader out is among the later ones. Those are tried only when the first ones fail."""
    OCCUPIED = EDGES + CUT_BOX

    def sites(self, more):
        spots = engine._region_inner_points(SQUARE, self.OCCUPIED)
        first = spots[:engine.REGION_INNER_FIRST]
        label = {'id': 'r-label', 'target': 'r', 'regionLeader': {
            'anchors': [], 'inner': first, 'innerMore': spots[engine.REGION_INNER_FIRST:] if more else [], 'gaps': list(engine.REGION_LEADER_GAPS),
            'polygons': SQUARE, 'near': None, 'only': True, 'regions': [{'id': 'r', 'polygons': SQUARE}]}}
        return spots, label_layout.region_inner_leader_placement(label, 36.0, 18.0, self.OCCUPIED, lambda box, owner_check=False: True)

    def test_the_first_spots_alone_find_no_leader_and_the_later_ones_do(self):
        spots, none = self.sites(False)
        self.assertGreater(len(spots), engine.REGION_INNER_FIRST)
        self.assertIsNone(none, 'the roomiest spots all lie inside the closed box')
        _, found = self.sites(True)
        self.assertIsNotNone(found)
        start = found[1]
        self.assertTrue(inside(start, SQUARE))
        self.assertFalse(130.0 - 7 < start[0] < 240.0 + 7 and 120.0 - 7 < start[1] < 200.0 + 7, 'the dot stands in the free strip outside the box')
        self.assertGreaterEqual(boundary_distance(start, SQUARE), engine.REGION_INNER_CLEAR_PX - 1e-6)

    def test_a_label_beside_the_middle_of_the_side_its_leader_crosses_is_refused_in_the_further_tier(self):
        side = [((100.0, 100.0), (260.0, 100.0))]
        exit_point = (180.0, 100.0)
        above_middle = Box(160.0, 62.0, 40.0, 18.0)       # right above the middle of the side: reads as its length
        beyond_the_end = Box(268.0, 66.0, 40.0, 18.0)     # past the end of the side
        far_away = Box(160.0, 20.0, 40.0, 18.0)           # a long leader away from it
        self.assertTrue(label_layout.label_reads_as_side(above_middle, exit_point, side))
        self.assertFalse(label_layout.label_reads_as_side(beyond_the_end, (255.0, 100.0), side))
        self.assertFalse(label_layout.label_reads_as_side(far_away, exit_point, side))

    def test_the_first_thirty_spots_and_their_order_do_not_change(self):
        spots = engine._region_inner_points(SQUARE, self.OCCUPIED)
        self.assertEqual(spots[:engine.REGION_INNER_FIRST], engine._region_inner_points(SQUARE, self.OCCUPIED, (), engine.REGION_INNER_FIRST))
        self.assertLessEqual(len(spots), engine.REGION_INNER_FIRST + engine.REGION_INNER_MORE)


if __name__ == '__main__':
    unittest.main()
