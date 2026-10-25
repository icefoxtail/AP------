"""Independent solid-figure observer: its own depth test, the model re-derived from the plan, and tamper cases on hand-built SVGs.
No Chrome and no producer import here: the SVGs below are drawn from the observer's own projection, so they exercise the checks only.
The composed (engine-made) panels are exercised by tests/solid-figure.test.mjs."""
import math
import re
import sys
import unittest
from pathlib import Path

GEOMETRY = Path(__file__).resolve().parents[1]
PRODUCTION = GEOMETRY / 'production'
sys.path.insert(0, str(PRODUCTION))
import solid_figure_observer as O

SCALE = 40.0
UNNAMED = '.' * 8


def cuboid_plan(**over):
    plan = {'capability': 'solid-figure-v1', 'solids': [{'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 3}, 'height': 2, 'names': UNNAMED}]}
    plan.update(over)
    return plan


def edge_svg(plan, tamper=None):
    """A figure of the first (polyhedron) solid with every edge cut at its visibility changes, drawn at SCALE from translation (60, 200)."""
    solid = O.build_solid({**plan['solids'][0], 'id': 's1'})
    planes = {i: O._plane_of(solid, f) for i, f in enumerate(solid['faces'])}

    def px(p):
        q = O.project(p)
        return (60 + SCALE * q[0], 200 - SCALE * q[1])
    lines = []
    for a, b in O.poly_edges(solid):
        A, B = solid['verts'][a][1], solid['verts'][b][1]
        skip = O.edge_skip(solid, a, b)
        N = 200
        flags = [O.hidden_by_faces(solid, planes, O.vadd(A, O.vmul(O.vsub(B, A), (k + 0.5) / N)), skip) for k in range(N)]
        cuts = [0.0] + [k / N for k in range(1, N) if flags[k] != flags[k - 1]] + [1.0]
        for c in range(len(cuts) - 1):
            mid = (cuts[c] + cuts[c + 1]) / 2
            hidden = O.hidden_by_faces(solid, planes, O.vadd(A, O.vmul(O.vsub(B, A), mid)), skip)
            p0, p1 = px(O.vadd(A, O.vmul(O.vsub(B, A), cuts[c]))), px(O.vadd(A, O.vmul(O.vsub(B, A), cuts[c + 1])))
            name = O.vname(solid, a) + O.vname(solid, b)
            lines.append({'name': name, 'hidden': hidden, 'p0': p0, 'p1': p1})
    if tamper: tamper(lines)
    body = ''
    for k, l in enumerate(lines):
        dash = ' stroke-dasharray="5 4"' if l['hidden'] else ''
        body += '<line id="e%d" data-role="edge" data-solid="s1" data-edge="%s" data-vis="%s" stroke="#111" stroke-width="1.6"%s x1="%.3f" y1="%.3f" x2="%.3f" y2="%.3f"/>' % (k, l['name'], 'hidden' if l['hidden'] else 'solid', dash, l['p0'][0], l['p0'][1], l['p1'][0], l['p1'][1])
    return '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" data-solid-figure="solid-figure-v1" data-mode="SOLIDS" data-scale="%s" data-yaw="28" data-pitch="20">%s</svg>' % (SCALE, body)


class Projection(unittest.TestCase):
    def test_screen_axes_are_orthonormal_and_the_view_is_in_front(self):
        self.assertAlmostEqual(O.vlen(O.SCREEN_X), 1.0)
        self.assertAlmostEqual(O.vlen(O.SCREEN_Y), 1.0)
        self.assertAlmostEqual(O.vdot(O.SCREEN_X, O.SCREEN_Y), 0.0)
        self.assertAlmostEqual(O.vdot(O.SCREEN_X, O.VIEW), 0.0)
        self.assertAlmostEqual(O.vdot(O.SCREEN_Y, O.VIEW), 0.0)
        self.assertLess(O.VIEW[1], 0)           # in front of the picture (-y)
        self.assertGreater(O.VIEW[2], 0)        # above
        self.assertGreater(O.SCREEN_Y[2], 0)    # up is up

    def test_a_horizontal_circle_projects_to_an_axis_aligned_ellipse(self):
        r = 3.0
        pts = [O.project((r * math.cos(t), r * math.sin(t), 0.0)) for t in [k * math.pi / 18 for k in range(36)]]
        for x, y in pts:
            self.assertAlmostEqual((x / r) ** 2 + (y / (r * math.sin(O.PITCH))) ** 2, 1.0, places=9)


class DepthTest(unittest.TestCase):
    def test_cuboid_hides_exactly_three_edges_at_the_back_bottom_left_corner(self):
        solid = O.build_solid({'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 3}, 'height': 2, 'names': {'base': 'FGHE', 'top': 'BCDA'}, 'id': 's1'})
        planes = {i: O._plane_of(solid, f) for i, f in enumerate(solid['faces'])}
        hidden = []
        for a, b in O.poly_edges(solid):
            A, B = solid['verts'][a][1], solid['verts'][b][1]
            votes = sum(1 for k in range(20) if O.hidden_by_faces(solid, planes, O.vadd(A, O.vmul(O.vsub(B, A), (k + .5) / 20)), O.edge_skip(solid, a, b)))
            self.assertIn(votes, (0, 20))
            if votes: hidden.append(O.vname(solid, a) + O.vname(solid, b))
        self.assertEqual(sorted(hidden), ['EA', 'FE', 'HE'])   # an edge is named by its two vertices in index order

    def test_round_solid_ray_test(self):
        cyl = O.build_solid({'kind': 'CYLINDER', 'radius': 2, 'height': 5, 'id': 's1'})
        front = (2 * math.cos(O.YAW - math.pi / 2), 2 * math.sin(O.YAW - math.pi / 2), 0.0)   # on the circle, facing the viewer
        back = (-front[0], -front[1], 0.0)
        self.assertFalse(O.hits_round(cyl, front))
        self.assertTrue(O.hits_round(cyl, back))
        top_back = (back[0], back[1], 5.0)
        self.assertFalse(O.hits_round(cyl, top_back))        # the top disc faces up: its back rim is seen
        cone = O.build_solid({'kind': 'CONE', 'radius': 2, 'height': 5, 'id': 's1'})
        self.assertTrue(O.hits_round(cone, back))
        sphere = O.build_solid({'kind': 'SPHERE', 'radius': 2, 'id': 's1'})
        self.assertTrue(O.hits_round(sphere, (back[0], back[1], 2.0)))
        self.assertFalse(O.hits_round(sphere, (front[0], front[1], 2.0)))


class Labels(unittest.TestCase):
    def test_label_numbers(self):
        self.assertEqual(O.label_number('5\\,\\mathrm{cm}'), 5.0)
        self.assertAlmostEqual(O.label_number('5\\sqrt{3}'), 5 * math.sqrt(3))
        self.assertAlmostEqual(O.label_number('\\sqrt{3}\\,\\mathrm{cm}'), math.sqrt(3))
        self.assertAlmostEqual(O.label_number('8\\pi'), 8 * math.pi)
        self.assertAlmostEqual(O.label_number('\\frac{10}{3}'), 10 / 3)
        self.assertAlmostEqual(O.label_number('\\frac{7}{2}\\pi'), 3.5 * math.pi)
        self.assertEqual(O.label_number('144^\\circ'), 144.0)
        self.assertIsNone(O.label_number('2\\pi r'))
        self.assertIsNone(O.label_number('h'))


class EdgeAudit(unittest.TestCase):
    def test_a_faithful_drawing_passes(self):
        plan = cuboid_plan()
        result = O.audit(plan, edge_svg(plan))
        self.assertEqual(result['status'], 'PASS', result['errors'])

    def test_a_hidden_edge_drawn_solid_fails(self):
        plan = cuboid_plan()

        def tamper(lines):
            for l in lines:
                if l['hidden']:
                    l['hidden'] = False
                    break
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertEqual(result['status'], 'FAIL')
        self.assertTrue(any(e.startswith('SOLID_EDGE_VISIBILITY_MISMATCH') for e in result['errors']), result['errors'])

    def test_a_visible_edge_drawn_dashed_fails(self):
        plan = cuboid_plan()

        def tamper(lines):
            for l in lines:
                if not l['hidden']:
                    l['hidden'] = True
                    break
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertEqual(result['status'], 'FAIL')
        self.assertTrue(any(e.startswith('SOLID_EDGE_VISIBILITY_MISMATCH') for e in result['errors']), result['errors'])

    def test_a_missing_edge_fails(self):
        plan = cuboid_plan()
        result = O.audit(plan, edge_svg(plan, lambda lines: lines.pop(3)))
        self.assertEqual(result['status'], 'FAIL')
        self.assertTrue(any(e.startswith('SOLID_EDGE_MISSING') or e.startswith('SOLID_EDGE_NOT_COVERED') for e in result['errors']), result['errors'])

    def test_a_gap_in_an_edge_fails(self):
        plan = cuboid_plan()

        def tamper(lines):
            l = lines[0]
            l['p1'] = (l['p0'][0] + (l['p1'][0] - l['p0'][0]) * 0.7, l['p0'][1] + (l['p1'][1] - l['p0'][1]) * 0.7)
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertEqual(result['status'], 'FAIL')

    def test_a_wrong_break_point_fails(self):
        # an L-shaped prism has edges that are partly hidden: move the dash change along such an edge
        plan = {'capability': 'solid-figure-v1', 'solids': [{'kind': 'PRISM', 'base': {'kind': 'POLYGON', 'points': [[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]]}, 'height': 2, 'names': '.' * 12}]}
        self.assertEqual(O.audit(plan, edge_svg(plan))['status'], 'PASS')
        moved = []

        def tamper(lines):
            groups = {}
            for l in lines: groups.setdefault(l['name'], []).append(l)
            for group in groups.values():
                if len(group) >= 2:
                    a, b = group[0], group[1]
                    dx, dy = b['p1'][0] - a['p0'][0], b['p1'][1] - a['p0'][1]
                    a['p1'] = (a['p1'][0] + dx * 0.25, a['p1'][1] + dy * 0.25)
                    b['p0'] = a['p1']
                    moved.append(a['name'])
                    return
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertTrue(moved, 'the L-shaped prism has a partly hidden edge')
        self.assertEqual(result['status'], 'FAIL')
        self.assertTrue(any(e.startswith(('SOLID_EDGE_BREAK_MISMATCH', 'SOLID_EDGE_VISIBILITY_MISMATCH', 'SOLID_EDGE_PIECE_STRADDLES')) for e in result['errors']), result['errors'])

    def test_a_moved_vertex_fails(self):
        plan = cuboid_plan()

        def tamper(lines):
            l = lines[0]
            l['p0'] = (l['p0'][0], l['p0'][1] + 8)
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertEqual(result['status'], 'FAIL')

    def test_a_stretched_drawing_fails_the_aspect_check(self):
        plan = cuboid_plan()

        def tamper(lines):
            for l in lines:
                l['p0'] = (l['p0'][0] * 1.15, l['p0'][1])
                l['p1'] = (l['p1'][0] * 1.15, l['p1'][1])
        result = O.audit(plan, edge_svg(plan, tamper))
        self.assertEqual(result['status'], 'FAIL')
        self.assertTrue(any(e.startswith('SOLID_PROJECTION_ASPECT_MISMATCH') for e in result['errors']), result['errors'])


class Nets(unittest.TestCase):
    def test_orientation_and_adjacency_of_a_cube_net(self):
        spec = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 2, 'names': '.' * 8, 'id': 's1'}
        solid = O.build_solid(spec)
        ids = ['bottom', 'top'] + ['side%d' % i for i in range(4)]
        cycles = O.orient_cycles(solid, spec, ids)
        verts = [p for _, p in solid['verts']]
        for fid, cyc in cycles.items():
            n = (0.0, 0.0, 0.0)
            for i in range(len(cyc)): n = O.vadd(n, O.vcross(verts[cyc[i]], verts[cyc[(i + 1) % len(cyc)]]))
            centre = tuple(sum(verts[v][k] for v in cyc) / len(cyc) for k in range(3))
            self.assertGreater(O.vdot(n, O.vsub(centre, (1.0, 1.0, 1.0))), 0, fid)   # outward

    def test_polygon_overlap(self):
        a = [(0, 0), (2, 0), (2, 2), (0, 2)]
        self.assertFalse(O._polys_overlap(a, [(2, 0), (4, 0), (4, 2), (2, 2)]))       # sharing an edge
        self.assertTrue(O._polys_overlap(a, [(1, 1), (3, 1), (3, 3), (1, 3)]))
        self.assertTrue(O._polys_overlap(a, [(0, 0), (2, 0), (2, 2), (0, 2)]))


class PlanModel(unittest.TestCase):
    def test_default_and_explicit_names(self):
        solid = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 5, 'depth': 5}, 'height': 9, 'id': 's1'})
        self.assertEqual([n for n, _ in solid['verts']], ['A', 'B', 'C', 'D', 'E'])
        self.assertEqual(solid['verts'][4][1], (2.5, 2.5, 9.0))
        prism = O.build_solid({'kind': 'PRISM', 'base': {'kind': 'POLYGON', 'plane': 'XZ', 'points': [[0, 0], [6, 0], [4, 4], [0, 4]]}, 'height': 3, 'names': {'base': 'FGCB', 'top': 'EHDA'}, 'id': 's1'})
        self.assertEqual(dict(prism['verts'])['H'], (6.0, 3.0, 0.0))
        with self.assertRaises(ValueError): O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 1, 'depth': 1}, 'height': 1, 'names': 'AB', 'id': 's1'})
        with self.assertRaises(ValueError): O.build_solid({'kind': 'TORUS', 'id': 's1'})


if __name__ == '__main__':
    unittest.main()
