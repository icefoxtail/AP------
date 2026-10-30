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


class Extensions(unittest.TestCase):
    def test_apex_down_radii_apex_and_level_geometry(self):
        cone = O.build_solid({'kind': 'CONE', 'radius': 3, 'height': 9, 'orientation': 'APEX_DOWN', 'id': 's1'})
        self.assertEqual((cone['r0'], cone['r1']), (0.0, 3.0))
        self.assertAlmostEqual(O._apex_z(cone), 0.0)
        self.assertEqual({q[1]: q[2] for q in cone['points']}['apex'], (0.0, 0.0, 0.0))
        self.assertEqual({q[1]: q[2] for q in cone['points']}['center'], (0.0, 0.0, 9.0))
        frustum = O.build_solid({'kind': 'CONE_FRUSTUM', 'radius': 6, 'topRadius': 2, 'height': 8, 'orientation': 'APEX_DOWN', 'id': 's1'})
        self.assertEqual((frustum['r0'], frustum['r1']), (2.0, 6.0))
        self.assertLess(O._apex_z(frustum), 0.0)
        with self.assertRaises(ValueError): O.build_solid({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'orientation': 'APEX_DOWN', 'id': 's1'})
        with self.assertRaises(ValueError): O.build_solid({'kind': 'CONE', 'radius': 2, 'height': 3, 'orientation': 'SIDEWAYS', 'id': 's1'})

    def test_liquid_boundary_is_the_smaller_cone_below_the_level(self):
        solid = O.build_solid({'kind': 'CONE', 'radius': 3, 'height': 9, 'orientation': 'APEX_DOWN', 'id': 's1'})
        pts = O._liquid_boundary(solid, 3.0, 1.0)
        self.assertEqual(len(pts), O.LIQUID_SAMPLES + 2)          # the apex and the far arc
        self.assertEqual(pts[0], O.project((0.0, 0.0, 0.0)))     # starts at the apex
        # every other point is on the level ellipse
        c = O.project((0.0, 0.0, 3.0))
        b = 1.0 * math.sin(O.PITCH)
        for x, y in pts[1:]:
            self.assertAlmostEqual(((x - c[0]) / 1.0) ** 2 + ((y - c[1]) / b) ** 2, 1.0, places=9)
        # the far arc goes above the level centre (the back of the water surface)
        self.assertGreater(max(y for _, y in pts[1:]), c[1] + b * 0.9)
        squat = O.build_solid({'kind': 'CONE', 'radius': 10, 'height': 1, 'orientation': 'APEX_DOWN', 'id': 's1'})
        with self.assertRaises(ValueError): O._liquid_boundary(squat, 0.5, 5.0)

    def test_a_nested_sphere_is_built_on_its_host_ids(self):
        plan = {'capability': 'solid-figure-v1', 'solids': [
            {'id': 's1', 'kind': 'CYLINDER', 'radius': 3, 'height': 6},
            {'id': 's2', 'kind': 'SPHERE', 'radius': 3, 'inside': 's1'}]}
        solids = [O.build_solid(s) for s in plan['solids']]
        self.assertEqual(solids[1]['inside'], 's1')
        self.assertEqual({q[1]: q[2] for q in solids[1]['points']}['center'], (0.0, 0.0, 3.0))


class NetLayout(unittest.TestCase):
    SPEC = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 2, 'names': '.' * 8, 'id': 's1'}
    IDS = ['bottom', 'top'] + ['side%d' % i for i in range(4)]
    JOINS = [['side0', 'side1'], ['side1', 'side2'], ['side2', 'side3'], ['side1', 'top'], ['side3', 'bottom']]

    def setUp(self):
        self.solid = O.build_solid(self.SPEC)
        self.cycles = O.orient_cycles(self.solid, self.SPEC, self.IDS)
        self.P3 = lambda i: self.solid['verts'][i][1]
        self.layout = O.net_layout(self.cycles, self.P3, 'side0', self.JOINS)

    def test_every_unfolded_face_is_the_solids_face_and_joined_edges_coincide(self):
        self.assertEqual(sorted(self.layout), sorted(self.IDS))
        for fid, pts in self.layout.items():
            self.assertEqual(len(pts), 4)
            for i in range(4): self.assertAlmostEqual(abs(pts[(i + 1) % 4] - pts[i]), 2.0, places=9, msg=fid)
        for par, chi in self.JOINS:
            shared = [v for v in self.cycles[par] if v in self.cycles[chi]]
            self.assertEqual(len(shared), 2)
            for v in shared: self.assertAlmostEqual(abs(self.layout[par][self.cycles[par].index(v)] - self.layout[chi][self.cycles[chi].index(v)]), 0.0, places=9)

    def test_the_faces_lie_on_opposite_sides_of_their_fold(self):
        for par, chi in self.JOINS:
            shared = [v for v in self.cycles[par] if v in self.cycles[chi]]
            a, b = (self.layout[par][self.cycles[par].index(v)] for v in shared)
            side = lambda fid: ((b - a).conjugate() * (sum(self.layout[fid]) / 4 - a)).imag
            self.assertLess(side(par) * side(chi), 0)

    def test_a_bad_join_list_is_not_unfolded(self):
        self.assertIsNone(O.net_layout(self.cycles, self.P3, 'side0', [['side0', 'side1'], ['side1', 'side2'], ['side2', 'side3'], ['side0', 'top'], ['top', 'bottom']]))
        self.assertIsNone(O.net_layout(self.cycles, self.P3, 'side0', self.JOINS[:3]))

    def test_the_fit_is_a_mirror_image_onto_a_y_down_drawing_and_refuses_a_stretched_one(self):
        root = self.layout['side0']
        svg = [(100 + 40 * z.real, 200 - 40 * z.imag) for z in root]
        fit = O.net_fit(root, svg)
        self.assertIsNotNone(fit)
        for pts in self.layout.values():
            for z in pts:
                self.assertLess(abs(fit(z) - complex(100 + 40 * z.real, 200 - 40 * z.imag)), 1e-9)
        stretched = [(x + (7 if k in (1, 2) else 0), y) for k, (x, y) in enumerate(svg)]
        self.assertIsNone(O.net_fit(root, stretched))

    def test_stress_roles_come_from_the_drawn_stroke(self):
        import xml.etree.ElementTree as ET
        el = lambda stroke, width: ET.fromstring('<line xmlns="http://www.w3.org/2000/svg" stroke="%s" stroke-width="%s"/>' % (stroke, width))
        self.assertEqual(O._net_line_role(el('#c0392b', '2.4')), 'ACCENT')
        self.assertEqual(O._net_line_role(el('#111', '2.4')), 'REF')
        self.assertIsNone(O._net_line_role(el('#111', '1.6')))
        self.assertEqual(O._net_line_role(el('#ff0000', '1.6')), '?')
        self.assertEqual(O._net_line_role(el('#c0392b', '1.6')), '?')


class Counting(unittest.TestCase):
    FRUSTUM = {'kind': 'FRUSTUM', 'base': {'kind': 'RECT', 'width': 6, 'depth': 6}, 'height': 5, 'topScale': 0.6, 'names': '.' * 8, 'id': 's1'}

    def test_counting_order_goes_around_the_base_up_the_sides_and_around_the_top(self):
        solid = O.build_solid(self.FRUSTUM)
        self.assertEqual(O.count_order(solid), [(0, 1), (1, 2), (2, 3), (0, 3), (0, 4), (1, 5), (2, 6), (3, 7), (4, 5), (5, 6), (6, 7), (4, 7)])
        pyramid = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 4, 'depth': 4}, 'height': 5, 'names': '.' * 5, 'id': 's1'})
        self.assertEqual(O.count_order(pyramid), [(0, 1), (1, 2), (2, 3), (0, 3), (0, 4), (1, 4), (2, 4), (3, 4)])
        prism = O.build_solid({'kind': 'PRISM', 'base': {'kind': 'REGULAR', 'n': 3, 'side': 2}, 'height': 3, 'names': '.' * 6, 'id': 's1'})
        self.assertEqual(O.count_order(prism), [(0, 1), (1, 2), (0, 2), (0, 3), (1, 4), (2, 5), (3, 4), (4, 5), (3, 5)])
        self.assertEqual(len(O.CIRCLED), 20)
        self.assertEqual(O.CIRCLED[0], '①')
        self.assertEqual(O.CIRCLED[19], '⑳')

    def labels_for(self, solid, px, shift=None, text=None, move=None):
        """hand-built counting labels 6 px right of every vertex and edge midpoint; the optional hooks tamper them"""
        import xml.etree.ElementTree as ET
        els, boxes = [], {}
        verts = [px(p) for _, p in solid['verts']]
        mids = [px(O.vmul(O.vadd(solid['verts'][a][1], solid['verts'][b][1]), 0.5)) for a, b in O.count_order(solid)]
        for role, kind, targets, attr, texts in (('count-vertex', 'vertex', verts, 'data-tex', [str(k + 1) for k in range(len(verts))]),
                                                 ('count-edge', 'edge', mids, 'data-text', O.CIRCLED[:len(mids)])):
            for k, (x, y) in enumerate(targets):
                n = k + 1
                if move and (role, n) in move: x, y = targets[move[(role, n)] - 1]
                lid = 'count-%s-%d' % (kind[0], n)
                g = ET.Element('g', {'id': lid, 'data-label-role': role, 'data-solid': 's1', 'data-count-n': str(n), 'data-count': kind, 'data-value': str(n), attr: texts[k]})
                if text and (role, n) in text: g.set(attr, text[(role, n)])
                els.append(g)
                boxes[lid] = (x + 4.0, y - 2.0, 4.0, 4.0)
        return els, boxes

    def audit_with(self, flags, **hooks):
        solid = O.build_solid(self.FRUSTUM)
        px = lambda p: (60 + 40 * O.project(p)[0], 300 - 40 * O.project(p)[1])
        els, boxes = self.labels_for(solid, px, **hooks)
        ctx = {'errors': [], 'boxes': boxes, 'labels': els}
        O.audit_counts(solid, flags, px, ctx)
        return ctx['errors']

    def test_complete_and_nearest_numbers_pass(self):
        self.assertEqual(self.audit_with({'vertices': True, 'edges': True}), [])

    def test_a_number_nearer_to_another_target_is_confused(self):
        errors = self.audit_with({'vertices': True, 'edges': True}, move={('count-edge', 1): 11})
        self.assertTrue(any(e.startswith('SOLID_COUNT_LABEL_CONFUSED') for e in errors), errors)
        errors = self.audit_with({'vertices': True, 'edges': True}, move={('count-vertex', 2): 7})
        self.assertTrue(any(e.startswith('SOLID_COUNT_LABEL_CONFUSED') for e in errors), errors)

    def test_wrong_text_is_read_back(self):
        errors = self.audit_with({'vertices': True, 'edges': True}, text={('count-edge', 3): O.CIRCLED[3]})
        self.assertTrue(any(e.startswith('SOLID_COUNT_TEXT_MISMATCH') for e in errors), errors)
        errors = self.audit_with({'vertices': True, 'edges': True}, text={('count-vertex', 3): '4'})
        self.assertTrue(any(e.startswith('SOLID_COUNT_TEXT_MISMATCH') for e in errors), errors)

    def test_numbers_nobody_asked_for_and_missing_numbers_fail(self):
        errors = self.audit_with({'vertices': True})
        self.assertTrue(any(e.startswith('SOLID_COUNT_LABEL_UNEXPECTED') for e in errors), errors)
        solid = O.build_solid(self.FRUSTUM)
        px = lambda p: (60 + 40 * O.project(p)[0], 300 - 40 * O.project(p)[1])
        els, boxes = self.labels_for(solid, px)
        ctx = {'errors': [], 'boxes': boxes, 'labels': [g for g in els if g.get('id') != 'count-e-7']}
        O.audit_counts(solid, {'vertices': True, 'edges': True}, px, ctx)
        self.assertTrue(any(e.startswith('SOLID_COUNT_NUMBERS_NOT_COMPLETE') for e in ctx['errors']), ctx['errors'])

    PYRAMID = {'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 4, 'depth': 4}, 'height': 5, 'names': '.' * 5, 'id': 's1'}

    def audit_pyramid(self, flags, shift=None):
        """edge numbers 6 px right of each midpoint (the pyramid is drawn small, 8 edges within 270 px); shift={n: (dx, dy)} moves edge number n from its midpoint"""
        solid = O.build_solid(self.PYRAMID)
        px = lambda p: (60 + 40 * O.project(p)[0], 300 - 40 * O.project(p)[1])
        els, boxes = self.labels_for(solid, px)
        els = [g for g in els if g.get('data-label-role') == 'count-edge']
        mids = [px(O.vmul(O.vadd(solid['verts'][a][1], solid['verts'][b][1]), 0.5)) for a, b in O.count_order(solid)]
        for n, (dx, dy) in (shift or {}).items():
            boxes['count-e-%d' % n] = (mids[n - 1][0] + dx - 2.0, mids[n - 1][1] + dy - 2.0, 4.0, 4.0)
        ctx = {'errors': [], 'boxes': boxes, 'labels': els}
        O.audit_counts(solid, flags, px, ctx)
        return ctx['errors']

    def test_count_near_edge_wants_each_edge_number_nearer_to_its_own_whole_edge(self):
        # numbers just beside their own midpoints: fine with and without near
        self.assertEqual(self.audit_pyramid({'edges': True}), [])
        self.assertEqual(self.audit_pyramid({'edges': True, 'near': 'EDGE'}), [])
        # edge number 3 stands 32 px from its own midpoint (still nearer to it than to any other midpoint), but its box sits on another edge
        far = {3: (-11, 30)}
        self.assertEqual(self.audit_pyramid({'edges': True}, shift=far), [])
        errors = self.audit_pyramid({'edges': True, 'near': 'EDGE'}, shift=far)
        self.assertEqual(errors, ['SOLID_COUNT_LABEL_NEARER_TO_OTHER_EDGE:count-e-3'])

    def test_count_near_edge_measures_to_the_whole_segment_not_only_the_midpoint(self):
        # edge number 4 beside its own midpoint but 6 px off its edge: the box is 6.1 px from its own edge and 9.8 px from the nearest other one,
        # so 6.1 + 4 is more than 9.8 and it is not clearly nearer; the margin is the observer's own 4 px
        errors = self.audit_pyramid({'edges': True, 'near': 'EDGE'}, shift={4: (-7, -6)})
        self.assertEqual(errors, ['SOLID_COUNT_LABEL_NEARER_TO_OTHER_EDGE:count-e-4'])
        self.assertEqual(self.audit_pyramid({'edges': True, 'near': 'EDGE'}, shift={4: (-4, 0)}), [])


class SeveralNames(unittest.TestCase):
    BASE = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 3, 'depth': 4}, 'height': 7, 'id': 's1'}

    def test_a_vertex_written_with_several_names_is_named_by_the_first_and_answers_to_all(self):
        solid = O.build_solid({**self.BASE, 'names': {'base': ['H,B', 'C,G', 'F,D', 'E'], 'top': ['M,A,I', 'N', 'K', 'L,J']}})
        self.assertEqual([n for n, _ in solid['verts']], ['H', 'C', 'F', 'E', 'M', 'N', 'K', 'L'])
        self.assertEqual(solid['aliases'], {0: ['H', 'B'], 1: ['C', 'G'], 2: ['F', 'D'], 4: ['M', 'A', 'I'], 7: ['L', 'J']})
        self.assertIn('HM', [O.vname(solid, a) + O.vname(solid, b) for a, b in O.poly_edges(solid)])   # edges are keyed by the first names

    def test_a_letters_string_still_ignores_commas_and_single_names_have_no_aliases(self):
        solid = O.build_solid({**self.BASE, 'names': 'A,B,C,D,E,F,G,H'})
        self.assertEqual([n for n, _ in solid['verts']], list('ABCDEFGH'))
        self.assertEqual(solid['aliases'], {})

    def test_bad_several_names_are_refused(self):
        for bad in (['A,,B', 'B', 'C', 'D'], ['A,b', 'B', 'C', 'D'], ['A,B,C,D,E', 'B', 'C', 'D'], ['A,', 'B', 'C', 'D']):
            with self.assertRaises(ValueError):
                O.build_solid({**self.BASE, 'names': {'base': bad, 'top': list('EFGH')}})


class Cuts(unittest.TestCase):
    CUBE = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 4}, 'height': 4, 'names': 'FGHEBCDA', 'id': 's1'}
    MID = [['AD', '1/2', 'M'], ['BC', '1/2', 'N'], ['CG', '1/2', 'P'], ['DH', '1/2', 'Q']]
    HEX = [['GH', '1/2', 'P'], ['GC', '1/2', 'Q'], ['BC', '1/2', 'R'], ['BA', '1/2', 'S'], ['EA', '1/2', 'T'], ['EH', '1/2', 'U']]

    def cut(self, cuts, **extra):
        return O.build_solid({**self.CUBE, 'cuts': cuts, **extra})

    def dist(self, solid, a, b):
        p = dict(solid['verts'])
        return O.vlen(O.vsub(p[a], p[b]))

    def test_four_midpoints_cut_off_an_edge_prism_and_leave_a_rectangle_section(self):
        solid = self.cut([{'through': self.MID}])
        self.assertEqual([n for n, _ in solid['verts']], ['F', 'G', 'H', 'E', 'B', 'A', 'P', 'Q', 'N', 'M'])   # kept corners, then new ones by their edge
        self.assertEqual(len(solid['faces']), 7)
        self.assertEqual(len(O.poly_edges(solid)), 15)
        self.assertEqual(len(solid['verts']) - len(O.poly_edges(solid)) + len(solid['faces']), 2)            # Euler
        self.assertAlmostEqual(self.dist(solid, 'M', 'N'), 4.0)
        self.assertAlmostEqual(self.dist(solid, 'P', 'Q'), 4.0)
        self.assertAlmostEqual(self.dist(solid, 'N', 'P'), 2 * math.sqrt(2))
        self.assertAlmostEqual(self.dist(solid, 'M', 'Q'), 2 * math.sqrt(2))
        names = {i: n for i, (n, _) in enumerate(solid['verts'])}
        self.assertEqual(sorted(names[i] for i in solid['faces'][-1]), ['M', 'N', 'P', 'Q'])               # the last face is the section

    def test_the_side_with_more_vertices_stays_and_a_tie_needs_keep(self):
        with self.assertRaisesRegex(ValueError, 'SOLID_CUT_KEEP_AMBIGUOUS'): self.cut([{'through': self.HEX}])
        low = self.cut([{'through': self.HEX, 'keep': 'F'}])
        high = self.cut([{'through': self.HEX, 'keep': 'H'}])
        self.assertEqual([n for n, _ in low['verts']][:4], ['F', 'G', 'E', 'B'])
        self.assertEqual([n for n, _ in high['verts']][:4], ['H', 'C', 'D', 'A'])
        for solid in (low, high):
            self.assertEqual((len(solid['verts']), len(O.poly_edges(solid)), len(solid['faces'])), (10, 15, 7))
            section = [solid['verts'][i][1] for i in solid['faces'][-1]]
            sides = [O.vlen(O.vsub(section[i], section[(i + 1) % 6])) for i in range(6)]
            self.assertLess(max(sides) - min(sides), 1e-6)                                               # a regular hexagon
        with self.assertRaisesRegex(ValueError, 'SOLID_NAME_UNKNOWN'): self.cut([{'through': self.HEX, 'keep': 'Z'}])

    def test_a_vertex_on_the_plane_stays_and_is_a_corner_of_the_section(self):
        through = [['FG', '1/4'], ['GH', '1/4'], ['CD', '1/3']]   # the plane also passes through B
        solid = self.cut([{'through': through}])
        self.assertEqual((len(solid['verts']), len(O.poly_edges(solid))), (9, 14))
        b = [n for n, _ in solid['verts']].index('B')
        self.assertIn(b, solid['faces'][-1])
        with self.assertRaisesRegex(ValueError, 'SOLID_CUT_KEEP_INVALID'): self.cut([{'through': through, 'keep': 'B'}])
        with self.assertRaisesRegex(ValueError, 'SOLID_CUT_INVALID'): self.cut([{'through': [['FG', '1/4'], ['HE', '3/4'], ['CD', '1/4']]}])   # C and D lie in this plane

    def test_two_planes_are_made_one_after_the_other(self):
        solid = self.cut([{'through': self.MID}, {'through': [['FG', '1/2', 'R'], ['FE', '1/2', 'S'], ['FB', '1/2', 'T']]}])
        names = [n for n, _ in solid['verts']]
        self.assertNotIn('F', names)
        for name in 'RSTMNPQ': self.assertIn(name, names)
        self.assertEqual(len(solid['verts']) - len(O.poly_edges(solid)) + len(solid['faces']), 2)
        with self.assertRaisesRegex(ValueError, 'SOLID_CUT_EDGE_UNKNOWN'): self.cut([{'through': self.MID}, {'through': [['CD', '1/2'], ['MA', '1/2'], ['NB', '1/2']]}])
        with self.assertRaisesRegex(ValueError, 'SOLID_CUT_COUNT_INVALID'): self.cut([{'through': self.MID}] * 3)

    def test_what_cannot_be_cut_is_refused(self):
        for cuts, code in (([{'through': [['FG', '1/2'], ['GC', '1/2'], ['CB', '1/2']]}], 'SOLID_CUT_NO_EFFECT'),
                           ([{'through': [['AD', '1/2'], ['BC', '1/2'], ['CG', '1/2'], ['FE', '1/4']]}], 'SOLID_CUT_NOT_PLANAR'),
                           ([{'through': [['AC', '1/2'], ['BC', '1/2'], ['CG', '1/2']]}], 'SOLID_CUT_EDGE_UNKNOWN'),
                           ([{'through': [['AD', '0/2'], ['BC', '1/2'], ['CG', '1/2']]}], 'SOLID_CUT_INVALID'),
                           ([{'through': self.MID[:2]}], 'SOLID_CUT_INVALID'),
                           ([], 'SOLID_CUT_COUNT_INVALID')):
            with self.assertRaisesRegex(ValueError, code): self.cut(cuts)
        with self.assertRaisesRegex(ValueError, 'SOLID_COUNT_UNSUPPORTED:CUT'): self.cut([{'through': self.MID}], count={'edges': True})

    def test_a_drawing_is_read_back_against_the_cut_not_the_uncut_solid(self):
        plain = {'capability': 'solid-figure-v1', 'solids': [dict(self.CUBE)]}
        cut = {'capability': 'solid-figure-v1', 'solids': [{**self.CUBE, 'cuts': [{'through': self.MID}]}]}
        edge_errors = lambda plan, svg: [e for e in O.audit(plan, svg)['errors'] if e.startswith('SOLID_EDGE_')]   # (the name labels are not drawn by this helper)
        self.assertEqual(edge_errors(cut, edge_svg(cut)), [])
        self.assertEqual(edge_errors(plain, edge_svg(plain)), [])
        self.assertTrue(any(e.startswith('SOLID_EDGE_MISSING') for e in edge_errors(cut, edge_svg(plain))))
        self.assertTrue(any(e.startswith('SOLID_EDGE_UNKNOWN') for e in edge_errors(plain, edge_svg(cut))))


class SphereCuts(unittest.TestCase):
    """A sphere cut by planes through its centre (cut:{kind,facing?}). The observer re-derives the piece as a set of points (the ball meeting half-spaces)
    and samples the ray toward the viewer; the pieces below were worked out by hand (viewer at +x, -y, +z; CUT turns the cut faces toward the viewer)."""
    PIECES = {   # kind: (boundary quarter-disks as plane + signs of its two in-plane axes, the radii where cut faces meet, the half axis a radius lies on)
        'HALF': (['Y++', 'Y+-', 'Y-+', 'Y--'], [], (0, 1)),
        'QUARTER': (['X++', 'X+-', 'Y-+', 'Y--'], ['+Z', '-Z'], (0, -1)),
        'OCTANT': (['X+-', 'Y--', 'Z-+'], ['-X', '+Y', '-Z'], (0, -1)),
        'THREE_QUARTERS': (['X-+', 'X--', 'Y++', 'Y+-'], ['+Z', '-Z'], (0, 1)),
        'SEVEN_EIGHTHS': (['X-+', 'Y++', 'Z+-'], ['+X', '-Y', '+Z'], (0, 1)),
    }

    def solid(self, kind, facing='CUT', r=5.0):
        return O.build_solid({'kind': 'SPHERE', 'radius': r, 'id': 's1', 'names': {'center': 'O'}, 'cut': {'kind': kind, 'facing': facing}})

    def test_the_pieces_are_the_ones_worked_out_by_hand(self):
        for kind, (faces, creases, axis) in self.PIECES.items():
            solid = self.solid(kind)
            feats = O.cut_features(solid)
            self.assertEqual(sorted(feats['faces']), sorted(faces), kind)
            self.assertTrue(all(f['visible'] for f in feats['faces'].values()), kind)
            self.assertEqual(sorted(feats['creases']), sorted(creases), kind)
            self.assertEqual(O.cut_radius_axis(solid), axis, kind)

    def test_turned_about_the_centre_the_cut_faces_are_behind_and_no_radius_is_seen(self):
        for kind, (faces, creases, _axis) in self.PIECES.items():
            solid = self.solid(kind, 'CURVED')
            feats = O.cut_features(solid)
            # the same faces exist (the piece is the same, turned), none of them faces the viewer, and no half axis is seen
            self.assertEqual(sorted(feats['faces']), sorted(self.invert(f) for f in faces), kind)
            self.assertFalse(any(f['visible'] for f in feats['faces'].values()), kind)
            self.assertIsNone(O.cut_radius_axis(solid), kind)

    @staticmethod
    def invert(face):
        """the face of the half-turned piece: the same plane, the signs of both in-plane axes reversed"""
        return face[0] + ''.join('-' if c == '+' else '+' for c in face[1:])

    def test_membership_and_the_depth_test(self):
        half = {'kind': 'HALF', 'facing': 'CUT'}
        self.assertTrue(O.cut_inside(half, (1.0, 1.0, 0.0), 5.0))
        self.assertFalse(O.cut_inside(half, (1.0, -1.0, 0.0), 5.0))
        self.assertFalse(O.cut_inside(half, (0.0, 4.0, 4.0), 5.0))   # outside the ball
        seven = {'kind': 'SEVEN_EIGHTHS', 'facing': 'CUT'}
        self.assertFalse(O.cut_inside(seven, (1.0, -1.0, 1.0), 5.0))   # the removed octant
        self.assertTrue(O.cut_inside(seven, (1.0, -1.0, -1.0), 5.0))
        three = {'kind': 'THREE_QUARTERS', 'facing': 'CUT'}
        self.assertFalse(O.cut_inside(three, (1.0, -1.0, 1.0), 5.0))   # the removed quarter wedge, above and below the equator
        self.assertFalse(O.cut_inside(three, (1.0, -1.0, -1.0), 5.0))
        self.assertTrue(O.cut_inside(three, (-1.0, -1.0, 1.0), 5.0))
        # turned about the centre every answer is the answer at the opposite point
        self.assertEqual(O.cut_inside({'kind': 'OCTANT', 'facing': 'CURVED'}, (1.0, -1.0, 1.0), 5.0), O.cut_inside({'kind': 'OCTANT', 'facing': 'CUT'}, (-1.0, 1.0, -1.0), 5.0))
        # a point on the flat face of the half that faces the viewer sees nothing of the piece; the back of its dome is behind the piece
        self.assertFalse(O.cut_hits(half, (2.0, 0.0, 1.0), 5.0))
        self.assertTrue(O.cut_hits(half, (0.0, 5.0 * 0.999, 0.0), 5.0))
        # the near side of the removed octant is open: a point on its three faces is seen
        self.assertFalse(O.cut_hits(seven, (0.0, -2.0, 2.0), 5.0))

    def test_an_elliptical_arc_is_read_by_the_endpoint_to_centre_conversion_of_svg(self):
        cx, cy, rx, ry, phi = 100.0, 120.0, 40.0, 20.0, 30.0
        c, s = math.cos(math.radians(phi)), math.sin(math.radians(phi))
        point = lambda t: (cx + c * rx * math.cos(t) - s * ry * math.sin(t), cy + s * rx * math.cos(t) + c * ry * math.sin(t))
        t0, t1 = math.radians(20), math.radians(110)
        a, b = point(t0), point(t1)
        pts = O.svg_arc_points(a[0], a[1], rx, ry, phi, 0, 1, b[0], b[1], 8)   # growing parameter turns clockwise on the screen: sweep 1
        self.assertAlmostEqual(math.hypot(pts[0][0] - a[0], pts[0][1] - a[1]), 0, places=6)
        self.assertAlmostEqual(math.hypot(pts[-1][0] - b[0], pts[-1][1] - b[1]), 0, places=6)
        for (x, y) in pts:
            u, w = c * (x - cx) + s * (y - cy), -s * (x - cx) + c * (y - cy)
            self.assertAlmostEqual((u / rx) ** 2 + (w / ry) ** 2, 1.0, places=6)
        mid = point((t0 + t1) / 2)
        self.assertAlmostEqual(math.hypot(pts[4][0] - mid[0], pts[4][1] - mid[1]), 0, places=5)
        # the other sweep is the other way round the same ellipse: its middle is on the far side
        other = O.svg_arc_points(a[0], a[1], rx, ry, phi, 1, 0, b[0], b[1], 8)
        self.assertGreater(math.hypot(other[4][0] - mid[0], other[4][1] - mid[1]), 20)

    def test_a_cut_that_cannot_be_drawn_is_refused_before_anything_is_checked(self):
        for cut, code in (({'kind': 'CAP'}, 'SOLID_SPHERE_CUT_KIND_UNSUPPORTED'), ({'kind': 'HALF', 'offset': 2}, 'SOLID_SPHERE_CUT_OFF_CENTRE'),
                          ({'kind': 'HALF', 'explode': True}, 'SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED'), ({'kind': 'HALF', 'facing': 'BACK'}, 'SOLID_SPHERE_CUT_FACING_INVALID'),
                          ({'kind': 'HALF', 'colour': 1}, 'SOLID_SPHERE_CUT_INVALID'), ({}, 'SOLID_SPHERE_CUT_INVALID'), ('HALF', 'SOLID_SPHERE_CUT_INVALID')):
            with self.assertRaisesRegex(ValueError, code): O.check_cut_spec(cut)
        with self.assertRaisesRegex(ValueError, 'SOLID_SPHERE_CUT_UNSUPPORTED'): O.build_solid({'kind': 'HEMISPHERE', 'radius': 3, 'id': 's1', 'cut': {'kind': 'HALF'}})
        # the audit reports it as an observer input error and does not crash
        svg = '<svg xmlns="http://www.w3.org/2000/svg" data-solid-figure="solid-figure-v1" data-yaw="28" data-pitch="20"/>'
        plan = {'capability': 'solid-figure-v1', 'solids': [{'kind': 'SPHERE', 'radius': 3, 'cut': {'kind': 'CAP'}}]}
        self.assertTrue(any(e.startswith('SOLID_OBSERVER_INPUT:SOLID_SPHERE_CUT_KIND_UNSUPPORTED') for e in O.audit(plan, svg)['errors']))

    def test_a_figure_with_no_curve_of_the_piece_has_no_frame(self):
        svg = '<svg xmlns="http://www.w3.org/2000/svg" data-solid-figure="solid-figure-v1" data-yaw="28" data-pitch="20"/>'
        plan = {'capability': 'solid-figure-v1', 'solids': [{'kind': 'SPHERE', 'radius': 3, 'names': {'center': 'O'}, 'cut': {'kind': 'QUARTER'}}]}
        self.assertTrue(any(e.startswith('SOLID_NO_CURVES') for e in O.audit(plan, svg)['errors']))


def face_polygon_svg(plan, entries, tamper=None):
    """the edge figure of the first polyhedron plus one shaded polygon per (face name, tint), drawn from the observer's own projection"""
    solid = O.build_solid({**plan['solids'][0], 'id': 's1'})
    names = O.face_names(solid)

    def px(p):
        q = O.project(p)
        return (60 + SCALE * q[0], 200 - SCALE * q[1])
    body = ''
    for face, fill in entries:
        pts = [px(solid['verts'][i][1]) for i in solid['faces'][names.index(face)]]
        if tamper: pts = tamper(face, pts)
        body += '<polygon id="h-%s" data-role="highlight-face" data-solid="s1" data-face="%s"%s fill="#7fa6e8" fill-opacity="0.32" stroke="none" points="%s"/>' % (face, face, (' data-fill="%s"' % fill) if fill else '', ' '.join('%.3f,%.3f' % p for p in pts))
    return edge_svg(plan).replace('</svg>', body + '</svg>')


class FaceHighlights(unittest.TestCase):
    """A face shaded by its name ({face:"side1"}): the observer finds the face's corners itself and reads the drawn polygon and its tint back."""
    PLAN = {'capability': 'solid-figure-v1', 'solids': [{'kind': 'FRUSTUM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 4}, 'height': 5, 'topScale': 0.6, 'names': '.' * 8}]}

    def errors(self, plan, svg):
        return [e for e in O.audit(plan, svg)['errors'] if e.startswith('SOLID_HIGHLIGHT')]

    def test_the_faces_of_each_kind_of_polyhedron_are_named_in_the_order_of_their_list(self):
        prism = O.build_solid({'kind': 'PRISM', 'base': {'kind': 'REGULAR', 'n': 3, 'side': 2}, 'height': 3, 'id': 's1'})
        pyramid = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 3, 'id': 's1'})
        frustum = O.build_solid({**self.PLAN['solids'][0], 'id': 's1'})
        self.assertEqual(O.face_names(prism), ['bottom', 'top', 'side0', 'side1', 'side2'])
        self.assertEqual(O.face_names(pyramid), ['bottom', 'side0', 'side1', 'side2', 'side3'])
        self.assertEqual(O.face_names(frustum), ['bottom', 'top', 'side0', 'side1', 'side2', 'side3'])
        for solid in (prism, pyramid, frustum): self.assertEqual(len(O.face_names(solid)), len(solid['faces']))
        # a side face stands on the matching edge of the base: side i holds the base vertices i and i+1
        self.assertEqual(sorted(frustum['faces'][O.face_names(frustum).index('side1')][:2]), [1, 2])

    def test_a_drawing_matching_the_plan_passes_and_each_tamper_is_caught(self):
        plan = {**self.PLAN, 'highlights': [{'face': 'top', 'fill': 'MEDIUM'}, {'face': 'side1', 'fill': 'WARM'}, {'face': 'side0'}]}
        entries = [('top', 'MEDIUM'), ('side1', 'WARM'), ('side0', None)]
        self.assertEqual(self.errors(plan, face_polygon_svg(plan, entries)), [])
        # a corner moved, in another cyclic order the same face is still the same face
        rotate = lambda face, pts: pts[1:] + pts[:1] if face == 'side1' else pts
        self.assertEqual(self.errors(plan, face_polygon_svg(plan, entries, rotate)), [])
        self.assertEqual(self.errors(plan, face_polygon_svg(plan, entries, lambda face, pts: pts[::-1])), [])
        move = lambda face, pts: [(pts[0][0] + 6, pts[0][1])] + pts[1:] if face == 'top' else pts
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FACE_VERTEX_OFF') for e in self.errors(plan, face_polygon_svg(plan, entries, move))))
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FILL_MISMATCH') for e in self.errors(plan, face_polygon_svg(plan, [('top', 'MEDIUM'), ('side1', 'GREEN'), ('side0', None)]))))
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FILL_MISMATCH') for e in self.errors(plan, face_polygon_svg(plan, [('top', 'MEDIUM'), ('side1', 'WARM'), ('side0', 'ROSE')]))))
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FACE_SET_MISMATCH') for e in self.errors(plan, face_polygon_svg(plan, entries[:2]))))
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FACE_SET_MISMATCH') for e in self.errors(plan, face_polygon_svg(plan, entries + [('bottom', None)]))))
        # a plan that shades no face but a figure that does
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FACE_SET_MISMATCH') for e in self.errors(self.PLAN, face_polygon_svg(plan, entries))))

    def test_the_plan_is_checked_before_the_drawing(self):
        svg = edge_svg(self.PLAN)
        for highlights, code in (([{'face': 'top', 'fill': 'PINK'}], 'SOLID_HIGHLIGHT_FILL_INVALID'), ([{'face': 'top'}, {'face': 'top'}], None)):
            plan = {**self.PLAN, 'highlights': highlights}
            errors = O.audit(plan, svg)['errors']
            if code: self.assertTrue(any(e.startswith('SOLID_OBSERVER_INPUT:' + code) for e in errors), errors)
        # a face the solid does not have is read as no drawn face
        plan = {**self.PLAN, 'highlights': [{'face': 'side9'}]}
        self.assertTrue(any(e.startswith('SOLID_HIGHLIGHT_FACE') for e in self.errors(plan, svg)))


class BodyFill(unittest.TestCase):
    """A level section with fill "BOTTOM" / "TOP" shades the part of the solid on that side: the polygon must be the hull of the circles that bound it."""
    S, TX, TY = 30.0, 200.0, 260.0

    def setUp(self):
        self.solid = O.build_solid({'kind': 'CONE', 'radius': 6, 'height': 8, 'id': 's1'})
        self.plan = {'section': {'kind': 'LEVEL', 'at': '1/2', 'fill': 'BOTTOM'}}

    def px(self, z):
        q = O.project((0.0, 0.0, z))
        return (self.TX + self.S * q[0], self.TY - self.S * q[1])

    def circle(self, z, r):
        cx, cy = self.px(z)
        return [(cx + self.S * r * math.cos(math.radians(k)), cy - self.S * r * math.sin(O.PITCH) * math.sin(math.radians(k))) for k in range(0, 360, 5)]

    def check(self, points, plan=None, side='BOTTOM'):
        svg = '<svg xmlns="http://www.w3.org/2000/svg"><polygon data-role="body-fill" data-solid="s1" data-side="%s" points="%s"/></svg>' % (side, ' '.join('%.3f,%.3f' % p for p in points))
        import xml.etree.ElementTree as ET
        errors = []
        O.check_body_fill(plan or self.plan, [self.solid], {'s1': (self.TX, self.TY)}, self.S, ET.fromstring(svg), errors)
        return errors

    def test_the_hull_of_the_two_circles_of_the_lower_part_passes(self):
        hull = O._hull(self.circle(0.0, 6.0) + self.circle(4.0, 3.0))
        self.assertGreater(len(hull), 20)
        self.assertEqual(self.check(hull), [])
        self.assertEqual(self.check(hull[::-1]), [])   # either way round
        # the upper part is the hull of the level circle and the apex
        top = {'section': {'kind': 'LEVEL', 'at': '1/2', 'fill': 'TOP'}}
        hull_top = O._hull(self.circle(4.0, 3.0) + [self.px(8.0)])
        self.assertEqual(self.check(hull_top, top, 'TOP'), [])
        self.assertTrue(self.check(hull_top, self.plan))   # the lower part's plan against the upper part's polygon

    def test_a_polygon_that_is_not_that_hull_is_refused(self):
        hull = O._hull(self.circle(0.0, 6.0) + self.circle(4.0, 3.0))
        # a corner pulled out, the polygon squashed so that the circles stick out, the wrong side named, a polygon where the plan has none, none where it has one
        self.assertTrue(self.check([(hull[0][0] + 25, hull[0][1])] + hull[1:]))
        top = min(p[1] for p in hull)
        self.assertTrue(any(e.startswith('SOLID_BODY_FILL_MISMATCH:circle_outside') for e in self.check([(x, max(y, top + 40)) for x, y in hull])))
        self.assertIn('SOLID_BODY_FILL_MISMATCH:attributes', self.check(hull, side='TOP'))
        self.assertIn('SOLID_BODY_FILL_SET_MISMATCH', self.check(hull, {'section': {'kind': 'LEVEL', 'at': '1/2'}}))
        errors = []
        import xml.etree.ElementTree as ET
        O.check_body_fill(self.plan, [self.solid], {'s1': (self.TX, self.TY)}, self.S, ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg"/>'), errors)
        self.assertIn('SOLID_BODY_FILL_SET_MISMATCH', errors)

    def test_the_hull_helper_is_a_convex_hull(self):
        square = [(0.0, 0.0), (4.0, 0.0), (4.0, 4.0), (0.0, 4.0), (2.0, 2.0), (1.0, 3.0)]
        self.assertEqual(sorted(O._hull(square)), sorted(square[:4]))
        self.assertAlmostEqual(O._area(O._hull(square)), 16.0)


class VertexReferences(unittest.TestCase):
    """E28b: "#b0", "#t2", "#apex", "#v5" (and "s2#b0") stand for a vertex wherever a name does; the observer resolves them from the grammar alone."""

    def table(self, solids):
        named = {}
        for s in solids:
            for i, (name, p) in enumerate(s['verts']):
                for key in (s['aliases'].get(i, [name]) if name else O.vertex_keys(s, i)): named[key] = (s['id'], (0.0, 0.0), p)
        return named

    def norm(self, specs):
        solids = [O.build_solid({**spec, 'id': 's%d' % (i + 1)}) for i, spec in enumerate(specs)]
        return O.make_norm(solids, self.table(solids)), solids

    def test_slots_of_a_prism_a_pyramid_and_the_model_order(self):
        prism = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 3}, 'height': 2, 'names': UNNAMED}
        norm, _ = self.norm([prism])
        self.assertEqual([norm(x) for x in ('#b0', '#b3', '#t0', '#t3', '#v0', '#v4', '#v7')], ['s1.b0', 's1.b3', 's1.t0', 's1.t3', 's1.b0', 's1.t0', 's1.t3'])
        for bad in ('#apex', '#b4', '#t4', '#v8'): self.assertRaises(ValueError, norm, bad)
        pyramid = {'kind': 'PYRAMID', 'base': {'kind': 'REGULAR', 'n': 5, 'side': 2}, 'height': 4, 'names': '.' * 6}
        norm, _ = self.norm([pyramid])
        self.assertEqual([norm(x) for x in ('#b4', '#apex', '#v5', '#v0')], ['s1.b4', 's1.apex', 's1.apex', 's1.b0'])
        for bad in ('#t0', '#b5', '#v6'): self.assertRaises(ValueError, norm, bad)

    def test_a_named_vertex_keeps_its_name_and_a_plain_name_must_exist(self):
        norm, _ = self.norm([{'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 2, 'names': {'base': 'FGHE', 'top': 'BCDA'}}])
        self.assertEqual([norm(x) for x in ('#b0', '#t2', 'G', '#v6')], ['F', 'D', 'G', 'D'])
        self.assertRaises(ValueError, norm, 'Z')
        self.assertRaises(ValueError, norm, 5)
        self.assertRaises(ValueError, norm, '#q1')
        self.assertRaises(ValueError, norm, 'b0')

    def test_several_polyhedra_need_the_solid_id_and_a_cut_solid_has_no_slots(self):
        prism = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 2, 'names': UNNAMED}
        pyramid = {'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 3, 'names': '.....'}
        norm, _ = self.norm([prism, pyramid])
        self.assertRaises(ValueError, norm, '#b0')           # fits both
        self.assertEqual(norm('s2#b0'), 's2.b0')
        self.assertEqual(norm('#t0'), 's1.t0')                # only the prism has a top ring
        self.assertEqual(norm('#apex'), 's2.apex')            # only the pyramid has an apex
        self.assertRaises(ValueError, norm, 's9#b0')
        cut = {**prism, 'names': {'base': 'FGHE', 'top': 'BCDA'}, 'cuts': [{'through': [['AD', '1/2', 'M'], ['BC', '1/2', 'N'], ['CG', '1/2', 'P'], ['DH', '1/2', 'Q']]}]}
        norm, _ = self.norm([cut])
        self.assertRaises(ValueError, norm, '#b0')
        self.assertEqual(norm('F'), 'F')

    def test_keys_are_joined_plain_or_with_a_dash_and_split_back(self):
        self.assertEqual(O.join_keys(['A', 'B']), 'AB')
        self.assertEqual(O.join_keys(['A′', 'B']), 'A′B')
        self.assertEqual(O.join_keys(['s1.b0', 's1.b1']), 's1.b0-s1.b1')
        self.assertEqual(O.join_keys(['A', 's1.b1']), 'A-s1.b1')
        self.assertEqual(O.join_keys(['s1.b0', 'B', 'C']), 's1.b0-B-C')
        self.assertEqual(O.split_edge('AB'), ('A', 'B'))
        self.assertEqual(O.split_edge('A′B'), ('A′', 'B'))
        self.assertEqual(O.split_edge('s1.b0-s1.b1'), ('s1.b0', 's1.b1'))
        self.assertEqual(O.split_edge('A-s2.apex'), ('A', 's2.apex'))
        self.assertEqual(O.split_edge('ABC'), (None, None))


class NetFaceLabelsAndMarks(unittest.TestCase):
    """E28b: face-area labels, right-angle squares at net corners and circles left out of a net, read back from hand-built SVG pieces."""

    SVG = '<svg xmlns="http://www.w3.org/2000/svg">%s</svg>'

    def root(self, body):
        import xml.etree.ElementTree as ET
        return ET.fromstring(self.SVG % body)

    def test_a_label_number_reads_a_squared_unit(self):
        self.assertEqual(O.label_number('6\\,\\mathrm{cm}^2'), 6.0)
        self.assertEqual(O.label_number('6\\,\\mathrm{cm}'), 6.0)
        self.assertAlmostEqual(O.label_number('48\\pi\\,\\mathrm{cm}^2'), 48 * math.pi)
        self.assertIsNone(O.label_number('S'))

    def test_a_point_is_inside_a_polygon_or_a_circle_by_a_margin(self):
        square = ('poly', [(0.0, 0.0), (10.0, 0.0), (10.0, 10.0), (0.0, 10.0)])
        self.assertTrue(O._inside_region(square, (5.0, 5.0), 1.0))
        self.assertFalse(O._inside_region(square, (0.5, 5.0), 1.0))
        self.assertFalse(O._inside_region(square, (11.0, 5.0)))
        circle = ('circle', 0.0, 0.0, 5.0)
        self.assertTrue(O._inside_region(circle, (3.0, 0.0), 1.0))
        self.assertFalse(O._inside_region(circle, (4.5, 0.0), 1.0))

    def test_the_area_of_a_face_is_half_the_cross_sum(self):
        P = {0: (0.0, 0.0, 0.0), 1: (4.0, 0.0, 0.0), 2: (0.0, 3.0, 0.0), 3: (4.0, 3.0, 5.0)}
        self.assertAlmostEqual(O.area3([0, 1, 2], P.get), 6.0)
        self.assertAlmostEqual(O.area3([2, 1, 0], P.get), 6.0)

    def label_ctx(self, plan_entry, value_area=6.0, region=None, unit='cm'):
        return {'errors': [], 'face_label_plan': {'top': plan_entry}, 'face_areas': {'top': value_area}, 'face_regions': {'top': region or ('poly', [(0.0, 0.0), (100.0, 0.0), (100.0, 100.0), (0.0, 100.0)])}, 'unit': unit}

    def label_group(self, tex, numeric='1', lid='face-label-top', face='top'):
        return self.root('<g id="%s" data-label-role="face-label" data-face-of="%s" data-numeric="%s" data-tex="%s"/>' % (lid, face, numeric, tex)).find(O.NS + 'g')

    def test_a_face_label_is_checked_against_the_area_and_the_face(self):
        box = (40.0, 40.0, 20.0, 12.0)
        ctx = self.label_ctx({'face': 'top'})
        O.check_face_label(self.label_group('6\\,\\mathrm{cm}^2'), box, ctx)
        self.assertEqual(ctx['errors'], [])
        for tex, expected in (('7\\,\\mathrm{cm}^2', 'SOLID_FACE_LABEL_VALUE_MISMATCH'), ('6', 'SOLID_FACE_LABEL_UNIT_MISSING')):
            ctx = self.label_ctx({'face': 'top'})
            O.check_face_label(self.label_group(tex), box, ctx)
            self.assertTrue(any(e.startswith(expected) for e in ctx['errors']), (tex, ctx['errors']))
        ctx = self.label_ctx({'face': 'top'})
        O.check_face_label(self.label_group('6\\,\\mathrm{cm}^2'), (95.0, 40.0, 20.0, 12.0), ctx)    # sticks out of the face
        self.assertTrue(any(e.startswith('SOLID_FACE_LABEL_OUTSIDE_FACE') for e in ctx['errors']), ctx['errors'])
        ctx = self.label_ctx({'face': 'top', 'text': 'S'})
        O.check_face_label(self.label_group('S', numeric='0'), box, ctx)                               # a symbol is not compared with the area
        self.assertEqual(ctx['errors'], [])
        ctx = self.label_ctx({'face': 'top', 'text': 'S'})
        O.check_face_label(self.label_group('9', numeric='0'), box, ctx)
        self.assertTrue(any(e.startswith('SOLID_FACE_LABEL_VALUE_MISMATCH') for e in ctx['errors']), ctx['errors'])
        ctx = self.label_ctx({'face': 'top'})
        O.check_face_label(self.label_group('6\\,\\mathrm{cm}^2', face='side0', lid='face-label-side0'), box, ctx)
        self.assertTrue(any(e.startswith('SOLID_FACE_LABEL_UNKNOWN') for e in ctx['errors']), ctx['errors'])

    def right_angle_case(self, points, corner=0, plan_corner=0):
        P = {0: (0.0, 0.0, 0.0), 1: (4.0, 0.0, 0.0), 2: (0.0, 3.0, 0.0)}
        root = self.root('<polyline id="net-ra-top-%d" data-role="net-right-angle" data-face="top" data-corner="%d" points="%s"/>' % (corner, corner, points))
        errors = []
        O.check_net_right_angles({'rightAngles': [{'face': 'top', 'corner': plan_corner}]}, root, errors, {'top': [0, 1, 2]}, {'top': [(10.0, 10.0), (50.0, 10.0), (10.0, 40.0)]}, P.get)
        return errors

    def test_a_right_angle_square_has_equal_legs_along_the_two_edges_at_a_true_right_corner(self):
        self.assertEqual(self.right_angle_case('10,20 20,20 20,10'), [])
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_GEOMETRY') for e in self.right_angle_case('10,20 22,23 20,10')))   # corner not the sum of the legs
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_GEOMETRY') for e in self.right_angle_case('10,16 24,16 24,10')))   # unequal legs
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_GEOMETRY') for e in self.right_angle_case('12,20 22,20 20,10')))   # a leg off its edge
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_GEOMETRY') for e in self.right_angle_case('10,12 11,12 11,10')))     # too small
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_GEOMETRY') for e in self.right_angle_case('10,40 40,40 40,10')))     # larger than half an edge
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_NOT_RIGHT') for e in self.right_angle_case('10,20 20,20 20,10', corner=1, plan_corner=1)))
        self.assertTrue(any(e.startswith('SOLID_NET_RIGHT_ANGLE_SET_MISMATCH') for e in self.right_angle_case('10,20 20,20 20,10', corner=0, plan_corner=2)))

    def circles(self, part, extra):
        root = self.root('<circle id="c" data-role="net-circle" data-part="%s" %s fill="#fff" cx="1" cy="1" r="5"/>' % (part, extra))
        return {part: root.find(O.NS + 'circle')}

    def test_the_circles_left_out_are_exactly_the_listed_ones_and_look_so(self):
        errors = []
        O.check_excluded_circles({'excluded': ['top']}, self.circles('top', 'data-excluded="1" stroke="#888" stroke-dasharray="5 4"'), ['bottom', 'top'], errors)
        self.assertEqual(errors, [])
        for net, circles, expected in (
                ({'excluded': ['top']}, self.circles('top', 'stroke="#888" stroke-dasharray="5 4"'), 'SOLID_NET_EXCLUDED_SET_MISMATCH'),
                ({'excluded': ['top']}, self.circles('top', 'data-excluded="1" stroke="#111"'), 'SOLID_NET_EXCLUDED_STYLE_MISMATCH'),
                ({}, self.circles('top', 'data-excluded="1" stroke="#888" stroke-dasharray="5 4"'), 'SOLID_NET_EXCLUDED_SET_MISMATCH'),
                ({}, self.circles('top', 'stroke="#111" stroke-dasharray="5 4"'), 'SOLID_NET_EXCLUDED_STYLE_MISMATCH'),
                ({'excluded': ['rect']}, self.circles('top', 'stroke="#111"'), 'SOLID_NET_EXCLUDED_PLAN_INVALID')):
            errors = []
            O.check_excluded_circles(net, circles, ['bottom', 'top'], errors)
            self.assertTrue(any(e.startswith(expected) for e in errors), (expected, errors))
        errors = []
        O.check_excluded_circles({}, self.circles('top', 'stroke="#111"'), ['bottom', 'top'], errors)
        self.assertEqual(errors, [])


class RegularPolyhedraAndBipyramids(unittest.TestCase):
    """E29: the observer builds regular polyhedra (by routes other than the producer's) and bipyramids from the plan alone."""

    def regular(self, faces, side=2.0):
        return O.build_solid({'kind': 'REGULAR_POLYHEDRON', 'faces': faces, 'side': side, 'id': 's1'})

    def azimuth_deg(self, p): return math.degrees(math.atan2(p[1], p[0]))

    def test_each_solid_has_its_vertices_edges_faces_and_equal_edges(self):
        for faces, V, E, sides in ((4, 4, 6, 3), (8, 6, 12, 3), (12, 20, 30, 5), (20, 12, 30, 3)):
            solid = self.regular(faces, 3.0)
            pts = [p for _, p in solid['verts']]
            self.assertEqual((len(pts), len(O.poly_edges(solid)), len(solid['faces'])), (V, E, faces))
            self.assertEqual(V - E + faces, 2)
            self.assertTrue(all(len(f) == sides for f in solid['faces']))
            for a, b in O.poly_edges(solid): self.assertAlmostEqual(O.vlen(O.vsub(pts[a], pts[b])), 3.0, places=9)
            self.assertAlmostEqual(min(p[2] for p in pts), 0.0, places=12)
            # every face is planar (all its vertices on the plane of the first three)
            for f in solid['faces']:
                n = O.vunit(O.vcross(O.vsub(pts[f[1]], pts[f[0]]), O.vsub(pts[f[2]], pts[f[0]])))
                self.assertTrue(all(abs(O.vdot(n, O.vsub(pts[i], pts[f[0]]))) < 1e-9 for i in f))

    def test_the_documented_vertex_order_of_each_solid(self):
        centre = lambda pts: tuple(sum(p[k] for p in pts) / len(pts) for k in range(3))
        pts = [p for _, p in self.regular(20)['verts']]
        c = centre(pts)
        self.assertEqual(max(range(12), key=lambda i: pts[i][2]), 0)       # the upper apex first, the lower apex last
        self.assertEqual(min(range(12), key=lambda i: pts[i][2]), 11)
        for k in range(5):
            self.assertAlmostEqual(self.azimuth_deg(O.vsub(pts[1 + k], c)) % 360, (-90 + 72 * k) % 360, places=6)     # upper ring, the first towards the viewer
            self.assertAlmostEqual(self.azimuth_deg(O.vsub(pts[6 + k], c)) % 360, (-54 + 72 * k) % 360, places=6)     # lower ring, each between two upper ones
            self.assertGreater(pts[1 + k][2], c[2])
            self.assertLess(pts[6 + k][2], c[2])
        pts = [p for _, p in self.regular(12)['verts']]
        c = centre(pts)
        zs = [p[2] for p in pts]
        self.assertTrue(all(zs[i] > zs[j] for i in range(0, 5) for j in range(5, 20)))      # the upper pentagon first, then the next ring, ...
        self.assertTrue(all(zs[i] > zs[j] for i in range(5, 10) for j in range(10, 20)) and all(zs[i] > zs[j] for i in range(10, 15) for j in range(15, 20)))
        for k in range(5):
            for start, base in ((0, -54), (5, -54), (10, -18), (15, -18)):
                self.assertAlmostEqual(self.azimuth_deg(O.vsub(pts[start + k], c)) % 360, (base + 72 * k) % 360, places=6)
        pts = [p for _, p in self.regular(8)['verts']]
        for k in range(1, 4): self.assertAlmostEqual(self.azimuth_deg(pts[k]) - self.azimuth_deg(pts[0]), 90 * k, places=6)     # the ring runs counter-clockwise from the front left
        self.assertAlmostEqual(self.azimuth_deg(pts[0]), -135, places=6)
        self.assertAlmostEqual(pts[4][2], 2 * pts[0][2], places=9)             # the upper apex over the ring; the lower apex on the floor
        self.assertAlmostEqual(pts[5][2], 0.0, places=9)
        pts = [p for _, p in self.regular(4)['verts']]
        self.assertTrue(pts[3][2] > pts[0][2] and abs(pts[0][2]) < 1e-9)       # a base on the floor and the apex above it

    def test_the_construction_refuses_what_it_cannot_build(self):
        for faces in (6, 5, 0, 3, '8', None):
            self.assertRaises(ValueError, O.build_solid, {'kind': 'REGULAR_POLYHEDRON', 'faces': faces, 'side': 2, 'id': 's1'})
        self.assertRaises(ValueError, O.build_solid, {'kind': 'REGULAR_POLYHEDRON', 'faces': 8, 'side': 2, 'names': 'ABC', 'id': 's1'})

    def test_a_bipyramid_is_two_pyramids_on_one_ring(self):
        solid = O.build_solid({'kind': 'BIPYRAMID', 'base': {'kind': 'REGULAR', 'n': 5, 'side': 3}, 'height': 2.0, 'id': 's1'})
        pts = [p for _, p in solid['verts']]
        self.assertEqual((len(pts), len(O.poly_edges(solid)), len(solid['faces'])), (7, 15, 10))
        self.assertTrue(all(abs(p[2] - 2.0) < 1e-9 for p in pts[:5]))
        self.assertAlmostEqual(pts[5][2], 4.0)
        self.assertAlmostEqual(pts[6][2], 0.0)
        self.assertEqual(O.face_names(solid), ['top%d' % i for i in range(5)] + ['bottom%d' % i for i in range(5)])
        self.assertEqual(O.count_order(solid)[:6], [(0, 1), (1, 2), (2, 3), (3, 4), (0, 4), (0, 5)])
        self.assertEqual(O.count_order(solid)[-5:], [(0, 6), (1, 6), (2, 6), (3, 6), (4, 6)])
        self.assertRaises(ValueError, O.build_solid, {'kind': 'BIPYRAMID', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2, 'plane': 'XZ'}, 'height': 2, 'id': 's1'})

    def test_references_and_face_names_follow_the_kind(self):
        named = lambda solids: {key: ('x', (0.0, 0.0), (0.0, 0.0, 0.0)) for s in solids for i in range(len(s['verts'])) for key in O.vertex_keys(s, i)}
        solids = [O.build_solid({'kind': 'BIPYRAMID', 'base': {'kind': 'REGULAR', 'n': 5, 'side': 3}, 'height': 2, 'names': '.......', 'id': 's1'})]
        norm = O.make_norm(solids, named(solids))
        self.assertEqual([norm(x) for x in ('#b4', '#apex', '#apex2', '#v6', '#v5')], ['s1.b4', 's1.apex', 's1.apex2', 's1.apex2', 's1.apex'])
        for bad in ('#t0', '#b5', '#v7'): self.assertRaises(ValueError, norm, bad)
        solids = [O.build_solid({'kind': 'REGULAR_POLYHEDRON', 'faces': 20, 'side': 2, 'names': '.' * 12, 'id': 's1'})]
        norm = O.make_norm(solids, named(solids))
        self.assertEqual([norm(x) for x in ('#v0', '#v11')], ['s1.v0', 's1.v11'])
        for bad in ('#b0', '#t0', '#apex', '#apex2', '#v12'): self.assertRaises(ValueError, norm, bad)
        self.assertEqual(O.face_names(self.regular(12)), ['f%d' % i for i in range(12)])
        self.assertEqual(O.count_order(self.regular(8)), O.poly_edges(self.regular(8)))


class WordsOnTheFigure(unittest.TestCase):
    """E28c: the axis of a rotation solid and the words written on a vertex, an axis, an edge, a slant or a visible face: targets re-derived from the plan"""
    cuboid = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 5, 'depth': 3}, 'height': 3, 'names': UNNAMED}

    def solids(self, *specs):
        return [O.build_solid({**spec, 'id': 's%d' % (i + 1)}) for i, spec in enumerate(specs)]

    def norm_of(self, solids):
        named = {key: ('x', (0.0, 0.0), (0.0, 0.0, 0.0)) for s in solids if s['cat'] == 'POLY' for i in range(len(s['verts'])) for key in O.vertex_keys(s, i)}
        named.update({n: ('x', (0.0, 0.0), p) for s in solids if s['cat'] != 'POLY' for n, _, p in s['points'] if n})
        return O.make_norm(solids, named)

    def test_the_axis_of_a_rotation_solid_is_kept_by_the_construction_and_refused_elsewhere(self):
        self.assertEqual(self.solids({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'axis': {'label': '회전축'}})[0]['axis'], {'label': '회전축'})
        self.assertEqual(self.solids({'kind': 'CONE', 'radius': 2, 'height': 3, 'axis': True})[0]['axis'], {'label': None})
        self.assertIsNone(self.solids({'kind': 'CONE', 'radius': 2, 'height': 3})[0]['axis'])
        for kind in ('SPHERE', 'HEMISPHERE'):
            self.assertRaises(ValueError, O.build_solid, {'kind': kind, 'radius': 2, 'axis': True, 'id': 's1'})
        self.assertRaises(ValueError, O.build_solid, {'kind': 'CONE', 'radius': 2, 'height': 3, 'axis': True, 'inside': 's0', 'id': 's2'})

    def test_labels_are_numbered_axis_words_first_then_in_the_order_written(self):
        solids = self.solids({'kind': 'CONE', 'radius': 3, 'height': 6, 'names': {'apex': 'A'}}, {'kind': 'CYLINDER', 'radius': 2, 'height': 4, 'axis': {'label': '회전축'}})
        plan = {'labels': [{'text': '모선', 'at': {'slant': True, 'solid': 's1'}}, {'text': '꼭짓점', 'at': 'A'}]}
        planned, axes = O.planned_text_labels(plan, solids, self.norm_of(solids))
        self.assertEqual([(i, k, t, g) for i, k, t, g, _ in planned], [('text-tl1', 'AXIS', '회전축', 's2'), ('text-tl2', 'SLANT', '모선', 's1'), ('text-tl3', 'VERTEX', '꼭짓점', 'A')])
        self.assertEqual(axes, {'s2'})
        # a labelled axis is a drawn axis, even where the solid does not ask for one
        solids = self.solids({'kind': 'CYLINDER', 'radius': 2, 'height': 4})
        planned, axes = O.planned_text_labels({'labels': [{'text': '회전축', 'at': {'axis': True}}]}, solids, self.norm_of(solids))
        self.assertEqual((planned[0][:4], axes), (('text-tl1', 'AXIS', '회전축', 's1'), {'s1'}))

    def test_edges_and_faces_are_resolved_from_the_plan(self):
        solids = self.solids(self.cuboid)
        norm = self.norm_of(solids)
        planned, _ = O.planned_text_labels({'labels': [{'text': '모서리', 'at': {'edge': ['#b1', '#b2']}}, {'text': '앞면', 'at': {'face': 'side0'}}, {'text': '꼭짓점', 'at': '#t2'}]}, solids, norm)
        self.assertEqual([(k, g) for _, k, _, g, _ in planned], [('EDGE', 's1.b1-s1.b2'), ('FACE', 's1|side0'), ('VERTEX', 's1.t2')])
        for bad in ({'text': '앞', 'at': {}}, {'text': '앞', 'at': {'axis': True}}, {'text': '앞', 'at': {'slant': True}}, {'text': '앞', 'at': 'Z'}, {'text': '$x$', 'at': '#b0'}, {'text': '앞 ', 'at': '#b0'}):
            self.assertRaises(ValueError, O.planned_text_labels, {'labels': [bad]}, solids, norm)

    def test_a_face_is_labelled_only_when_it_faces_the_viewer(self):
        solid = self.solids(self.cuboid)[0]
        frame = (0.0, 300.0)
        facing = {face: O._face_polygon_px(solid, face, frame, 40.0)[1] for face in O.face_names(solid)}
        self.assertEqual(facing, {'bottom': False, 'top': True, 'side0': True, 'side1': True, 'side2': False, 'side3': False})
        pts, front = O._face_polygon_px(solid, 'side0', frame, 40.0)
        self.assertTrue(front)
        self.assertEqual(len(pts), 4)
        # the polygon is the projected outline, scaled: the first two corners are the front-bottom edge b0 -> b1
        b0, b1 = O.project(solid['verts'][0][1]), O.project(solid['verts'][1][1])
        self.assertAlmostEqual(pts[0][0], 0.0 + 40.0 * b0[0])
        self.assertAlmostEqual(pts[1][1], 300.0 - 40.0 * b1[1])
        self.assertRaises(ValueError, O._face_polygon_px, solid, 'nope', frame, 40.0)


class NetSymbolsAndEdgeLabels(unittest.TestCase):
    """E28c: face symbols, words and lengths at net edges, written from the grammar alone"""

    def test_a_face_symbol_is_one_circled_number_one_hangul_letter_or_one_in_parentheses(self):
        for ok in ('①', '⑳', '㉮', '㉠', '가', '힣', 'ㄱ', 'ㅎ', '(가)', '(ㄴ)', '(7)', '(12)'):
            self.assertTrue(O.FACE_SYMBOL.fullmatch(ok), ok)
        for bad in ('①②', '가나', '(100)', '(0)', '(가나)', '①.', 'a①', '※', '', ' ①', '㉮㉯', '⑳⑴'):
            self.assertFalse(O.FACE_SYMBOL.fullmatch(bad), bad)
        # plain ASCII such as (3) is TeX whatever the symbol rule says: the producer sets it as math
        self.assertTrue(O.SYMBOLIC.fullmatch('(3)'))
        self.assertFalse(O.SYMBOLIC.fullmatch('①'))
        self.assertFalse(O.SYMBOLIC.fullmatch('가'))

    def test_edge_labels_follow_the_dims_and_a_hangul_text_is_a_word(self):
        net = {'dims': [{'face': 'side2', 'edge': 0}],
               'edgeLabels': [{'face': 'top', 'edge': 0}, {'face': 'top', 'edge': 1, 'text': '5'}, {'face': 'side0', 'edge': 0, 'text': 'a'}, {'face': 'side0', 'edge': 1, 'text': '높이'}]}
        entries = O.net_edge_entries(net)
        self.assertEqual([(e['face'], e['edge'], e.get('label'), e.get('word')) for e in entries],
                         [('side2', 0, None, None), ('top', 0, None, None), ('top', 1, '5', None), ('side0', 0, 'a', None), ('side0', 1, None, '높이')])
        self.assertEqual(O.net_edge_entries({}), [])
        self.assertEqual(O.net_edge_entries({'dims': [{'face': 'top', 'edge': 0, 'label': 'l'}]})[0]['label'], 'l')
        self.assertRaises(ValueError, O.net_edge_entries, {'edgeLabels': [{'face': 'top', 'edge': 0, 'text': '가나다라마바사아자차카타파'}]})
        self.assertRaises(ValueError, O.net_edge_entries, {'edgeLabels': [{'face': 'top', 'edge': 0, 'text': '밑 변 $'}]})


class EqualSlantOfACone(unittest.TestCase):
    """E28c: equalSlant groups re-derived from the plan"""

    def solids(self, *specs):
        return [O.build_solid({**spec, 'id': 's%d' % (i + 1)}) for i, spec in enumerate(specs)]

    def test_groups_are_numbered_like_the_plan_and_default_to_the_only_cone(self):
        cone = {'kind': 'CONE', 'radius': 3, 'height': 6}
        frustum = {'kind': 'CONE_FRUSTUM', 'radius': 4, 'topRadius': 2, 'height': 5}
        solids = self.solids(cone)
        self.assertEqual(O.planned_slant_marks({'marks': {'equalSlant': True}}, solids), [('es1', 's1', 1)])
        self.assertEqual(O.planned_slant_marks({'marks': {'equalSlant': {'count': 2}}}, solids), [('es1', 's1', 2)])
        self.assertEqual(O.planned_slant_marks({}, solids), [])
        both = self.solids(cone, frustum)
        self.assertEqual(O.planned_slant_marks({'marks': {'equalSlant': [{'solid': 's1'}, {'solid': 's2', 'count': 3, 'id': 'f'}]}}, both), [('es1', 's1', 1), ('f', 's2', 3)])
        for bad in (True, {'solid': 's9'}):
            self.assertRaises(ValueError, O.planned_slant_marks, {'marks': {'equalSlant': bad}}, both)
        self.assertRaises(ValueError, O.planned_slant_marks, {'marks': {'equalSlant': True}}, self.solids({'kind': 'CYLINDER', 'radius': 2, 'height': 3}))


class CutsThroughCorners(unittest.TestCase):
    """E28c: a plane through corners of the solid, cut by the observer's own construction"""
    base = {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 3}, 'height': 2, 'names': 'EFGHABCD', 'id': 's1'}

    def cut(self, cuts, **over):
        return O.build_solid({**self.base, 'cuts': cuts, **over})

    def test_three_corners_cut_the_corner_off(self):
        solid = self.cut([{'vertices': ['A', 'C', 'F']}])
        names = sorted(n for n, _ in solid['verts'])
        self.assertEqual(names, ['A', 'C', 'D', 'E', 'F', 'G', 'H'])
        self.assertEqual((len(solid['verts']), len(O.poly_edges(solid)), len(solid['faces'])), (7, 12, 7))
        self.assertEqual(sorted(len(f) for f in solid['faces']), [3, 3, 3, 3, 4, 4, 4])
        section = solid['faces'][-1]
        self.assertEqual(sorted(solid['verts'][i][0] for i in section), ['A', 'C', 'F'])

    def test_corners_can_be_named_by_slot_in_the_first_cut_only(self):
        named = self.cut([{'vertices': ['A', 'C', 'F']}])
        by_slot = self.cut([{'vertices': ['#t0', '#t2', '#b1']}], names='.' * 8)
        self.assertEqual([p for _, p in by_slot['verts']], [p for _, p in named['verts']])
        for bad in (['#t0', '#t2', '#b9'], ['#apex', '#t2', '#b1'], ['s2#b0', '#t2', '#b1'], ['#t0', '#t2', 'Z']):
            self.assertRaises(ValueError, self.cut, [{'vertices': bad}], names='.' * 8)
        self.assertRaises(ValueError, self.cut, [{'vertices': ['#t0', '#t2', '#b1']}, {'vertices': ['#t0', '#t3', '#b0']}], names='.' * 8)

    def test_a_second_cut_names_the_corners_that_are_left(self):
        self.assertRaises(ValueError, self.cut, [{'vertices': ['A', 'C', 'F']}, {'vertices': ['B', 'D', 'G']}])

    def test_corners_and_edge_points_make_one_plane(self):
        solid = self.cut([{'vertices': ['F'], 'through': [['AD', '1/2', 'P'], ['BC', '1/2', 'Q']], 'keep': 'G'}])
        self.assertEqual(sorted(n for n, _ in solid['verts'] if n), ['C', 'D', 'E', 'F', 'G', 'H', 'P', 'Q'])

    def test_a_diagonal_plane_needs_keep_and_the_refusals_are_explicit(self):
        self.assertRaises(ValueError, self.cut, [{'vertices': ['A', 'C', 'G', 'E']}])
        half = self.cut([{'vertices': ['A', 'C', 'G', 'E'], 'keep': 'B'}])
        self.assertEqual((len(half['verts']), len(O.poly_edges(half)), len(half['faces'])), (6, 9, 5))
        for cuts in ([{'vertices': ['A', 'C']}], [{'vertices': []}], [{}], [{'vertices': ['A', 'A', 'C']}], [{'vertices': ['A', 'C', 'F', 'D']}], [{'vertices': ['E', 'F', 'G']}],
                     [{'vertices': ['A', 'C', 'F'], 'keep': 'A'}], [{'vertices': 'ACF'}], [{'vertices': ['A', 'C', 7]}]):
            self.assertRaises(ValueError, self.cut, cuts)


class BallsInACylinder(unittest.TestCase):
    """E28c: balls stacked in a cylinder, expanded from the plan's own grammar"""

    def specs(self, host, *more):
        return O.expanded_solid_specs({'solids': [{'kind': 'CYLINDER', 'radius': 3, 'height': 18, **host}, *more]})

    def test_a_stack_is_equal_balls_resting_on_each_other_from_the_bottom(self):
        specs = self.specs({'stack': {'count': 3, 'radius': 3}})
        self.assertEqual([(s['id'], s['kind']) for s in specs], [('s1', 'CYLINDER'), ('s1b1', 'SPHERE'), ('s1b2', 'SPHERE'), ('s1b3', 'SPHERE')])
        self.assertEqual([s.get('centerZ') for s in specs], [None, 3.0, 9.0, 15.0])
        self.assertTrue(all(s['inside'] == 's1' for s in specs[1:]))
        self.assertNotIn('stack', specs[0])
        solids = [O.build_solid(s) for s in specs]
        self.assertEqual([s['cz'] for s in solids[1:]], [3.0, 9.0, 15.0])
        self.assertEqual(solids[1]['points'][0][2], (0.0, 0.0, 3.0))

    def test_a_list_rests_each_ball_on_the_one_before_unless_it_says_where(self):
        specs = self.specs({'inside': [{'kind': 'SPHERE', 'radius': 2}, {'kind': 'SPHERE', 'radius': 3}, {'kind': 'SPHERE', 'radius': 1, 'centerZ': 15}]})
        self.assertEqual([s.get('centerZ') for s in specs[1:]], [2.0, 7.0, 15.0])
        # the plan's own solids keep their ids by their place in the plan, the balls follow their cylinder
        specs = self.specs({'stack': {'count': 2, 'radius': 1}}, {'kind': 'CONE', 'radius': 2, 'height': 3})
        self.assertEqual([s['id'] for s in specs], ['s1', 's1b1', 's1b2', 's2'])

    def test_a_ball_at_a_given_height_has_its_centre_there_and_a_plain_sphere_rests_on_the_floor(self):
        self.assertEqual(O.build_solid({'kind': 'SPHERE', 'radius': 2, 'id': 's1'})['cz'], 2.0)
        ball = O.build_solid({'kind': 'SPHERE', 'radius': 2, 'inside': 's1', 'centerZ': 7, 'id': 's2'})
        self.assertEqual((ball['cz'], ball['points'][0][2]), (7.0, (0.0, 0.0, 7.0)))
        self.assertEqual(O.build_solid({'kind': 'HEMISPHERE', 'radius': 2, 'id': 's1'})['cz'], 0.0)

    def test_what_the_grammar_does_not_allow_is_refused(self):
        for host in ({'stack': {'count': 1, 'radius': 3}}, {'stack': {'count': 7, 'radius': 1}}, {'stack': {'count': 2.5, 'radius': 1}},
                     {'stack': {'count': 2, 'radius': 1}, 'inside': [{'kind': 'SPHERE', 'radius': 1}]}, {'inside': []},
                     {'inside': [{'kind': 'CONE', 'radius': 1}]}, {'inside': [{'kind': 'SPHERE', 'radius': 1}] * 7}):
            self.assertRaises(ValueError, self.specs, host)
        self.assertRaises(ValueError, O.expanded_solid_specs, {'solids': [{'kind': 'CONE', 'radius': 2, 'height': 3, 'stack': {'count': 2, 'radius': 1}}]})


class StackedRoundSolids(unittest.TestCase):
    """E33: on:"<id>" stands a round solid on the flat top circle of another, on one axis; the lifts, the shared joint circle, the axis through the stack and what a
    joint circle hides are derived here from the plan alone"""

    def build(self, *specs):
        solids = [O.build_solid({**spec, 'id': spec.get('id') or 's%d' % (i + 1)}) for i, spec in enumerate(specs)]
        return solids, O.resolve_stacks(solids)

    @staticmethod
    def frustum(**over):
        return {'kind': 'CONE_FRUSTUM', 'radius': 6, 'topRadius': 3, 'height': 4, 'orientation': 'APEX_DOWN', **over}

    def test_the_guest_stands_on_the_top_circle_of_its_host_and_the_axis_runs_through_both(self):
        solids, stacks = self.build(self.frustum(axis={'label': 'l'}, names={'center': 'P'}), {'kind': 'HEMISPHERE', 'radius': 6, 'on': 's1', 'names': {'center': 'O'}})
        self.assertEqual([m['id'] for m in stacks[0]['members']], ['s1', 's2'])
        self.assertEqual([m['lift'] for m in stacks[0]['members']], [0.0, 4.0])
        self.assertEqual(stacks[0]['height'], 10.0)
        self.assertEqual((solids[0]['covered'], solids[1]['covered']), (True, False))
        self.assertEqual(solids[0]['axis'], {'label': 'l', 'span': 10.0})
        self.assertEqual(solids[1]['points'][0][2], (0.0, 0.0, 4.0))   # the hemisphere's own centre is raised with it
        self.assertEqual(solids[0]['points'][0][2], (0.0, 0.0, 0.0))

    def test_a_bowl_has_its_flat_disc_on_top_and_carries_a_guest_there(self):
        solids, stacks = self.build({'kind': 'HEMISPHERE', 'radius': 3, 'orientation': 'APEX_DOWN', 'names': {'center': 'O'}}, {'kind': 'CONE', 'radius': 3, 'height': 5, 'on': 's1', 'axis': True})
        self.assertEqual(solids[0]['points'][0][2], (0.0, 0.0, 3.0))   # the disc is at the top, a radius above the pole
        self.assertEqual([m['lift'] for m in stacks[0]['members']], [0.0, 3.0])
        self.assertEqual(solids[1]['axis'], {'label': None, 'span': 8.0})
        # a ball made of two hemispheres: the dome on the bowl
        solids, stacks = self.build({'kind': 'HEMISPHERE', 'radius': 2, 'orientation': 'APEX_DOWN'}, {'kind': 'HEMISPHERE', 'radius': 2, 'on': 's1', 'axis': {'label': 'l'}})
        self.assertEqual(stacks[0]['height'], 4.0)

    def test_a_chain_adds_up_the_heights(self):
        solids, stacks = self.build({'kind': 'CYLINDER', 'radius': 2, 'height': 3}, {'kind': 'CYLINDER', 'radius': 2, 'height': 1.5, 'on': 's1'}, {'kind': 'CONE', 'radius': 2, 'height': 2, 'on': 's2'})
        self.assertEqual([m['lift'] for m in stacks[0]['members']], [0.0, 3.0, 4.5])
        self.assertEqual(stacks[0]['height'], 6.5)
        self.assertEqual([s['covered'] for s in solids], [True, True, False])

    def test_the_joint_circle_has_one_radius_and_the_grammar_is_kept(self):
        cases = [
            ((self.frustum(), {'kind': 'HEMISPHERE', 'radius': 5, 'on': 's1'}), 'SOLID_STACK_JOINT_MISMATCH'),   # the radii at the joint differ
            (({'kind': 'CONE', 'radius': 2, 'height': 3}, {'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's1'}), 'SOLID_STACK_JOINT_MISMATCH'),   # a cone's point is no circle
            (({'kind': 'HEMISPHERE', 'radius': 2}, {'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's1'}), 'SOLID_STACK_JOINT_MISMATCH'),   # a dome has no flat top
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3}, {'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's9'}), 'SOLID_STACK_UNKNOWN'),
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's1'},), 'SOLID_STACK_UNKNOWN'),   # on itself
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3}, {'kind': 'CYLINDER', 'radius': 2, 'height': 1, 'on': 's1'}, {'kind': 'CYLINDER', 'radius': 2, 'height': 1, 'on': 's1'}), 'SOLID_STACK_BRANCH'),
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's2'}, {'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'on': 's1'}), 'SOLID_STACK_CYCLE'),
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3}, {'kind': 'SPHERE', 'radius': 2, 'on': 's1'}), 'SOLID_STACK_UNSUPPORTED:SPHERE'),
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3}, {'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 1, 'on': 's1'}), 'SOLID_STACK_UNSUPPORTED:PRISM'),
            (({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'axis': True}, {'kind': 'CONE', 'radius': 2, 'height': 3, 'on': 's1', 'axis': True}), 'SOLID_AXIS_STACK_DUPLICATE'),
        ]
        for specs, code in cases:
            with self.assertRaises(ValueError) as caught:
                self.build(*specs)
            self.assertTrue(str(caught.exception).startswith(code), (code, str(caught.exception)))
        # a lone hemisphere has no axis; a hemisphere that stands on something may carry the stack's
        self.assertRaises(ValueError, O.build_solid, {'kind': 'HEMISPHERE', 'radius': 2, 'axis': True, 'id': 's1'})
        self.assertEqual(O.build_solid({'kind': 'HEMISPHERE', 'radius': 2, 'axis': True, 'on': 's1', 'id': 's2'})['axis'], {'label': None})

    def test_the_far_half_of_a_joint_circle_is_behind_the_guest_and_the_near_half_is_seen(self):
        (host, guest), stacks = self.build({'kind': 'CYLINDER', 'radius': 2, 'height': 5}, {'kind': 'CONE', 'radius': 2, 'height': 4, 'on': 's1'})
        front = (2 * math.cos(O.YAW - math.pi / 2), 2 * math.sin(O.YAW - math.pi / 2), 5.0)   # the joint circle, facing the viewer
        back = (-front[0], -front[1], 5.0)
        chain = stacks[0]['members']
        self.assertFalse(O.hits_round(host, back))   # a lone cylinder shows its whole top rim
        self.assertTrue(O.hits_any(chain, back))      # with a cone on it the far half is hidden
        self.assertFalse(O.hits_any(chain, front))
        # a dome on a frustum, a bowl under a cone
        (frustum, dome), stacks = self.build(self.frustum(), {'kind': 'HEMISPHERE', 'radius': 6, 'on': 's1'})
        front = (6 * math.cos(O.YAW - math.pi / 2), 6 * math.sin(O.YAW - math.pi / 2), 4.0)
        back = (-front[0], -front[1], 4.0)
        self.assertTrue(O.hits_any(stacks[0]['members'], back))
        self.assertFalse(O.hits_any(stacks[0]['members'], front))
        (bowl, cone), stacks = self.build({'kind': 'HEMISPHERE', 'radius': 3, 'orientation': 'APEX_DOWN'}, {'kind': 'CONE', 'radius': 3, 'height': 5, 'on': 's1'})
        front = (3 * math.cos(O.YAW - math.pi / 2), 3 * math.sin(O.YAW - math.pi / 2), 3.0)
        back = (-front[0], -front[1], 3.0)
        self.assertTrue(O.hits_any(stacks[0]['members'], back))
        self.assertFalse(O.hits_any(stacks[0]['members'], front))

    def test_a_bowl_and_a_dome_hide_the_far_side_of_their_curved_surface_and_a_bowl_never_hides_its_own_rim(self):
        away = O.vunit((-O.VIEW[0], -O.VIEW[1], 0.0))   # the horizontal direction from the viewer into the picture
        a = math.radians(20)
        bowl = O.build_solid({'kind': 'HEMISPHERE', 'radius': 2, 'orientation': 'APEX_DOWN', 'id': 's1'})
        self.assertEqual((bowl['cz'], bowl['height']), (2.0, 2.0))
        self.assertFalse(O.hits_round(bowl, (2 * away[0], 2 * away[1], 2.0)))   # the flat disc is the top: its far rim is seen
        # 20 degrees below the rim the ray from the far side runs through the body under the disc's plane; from the near side it leaves at once
        self.assertTrue(O.hits_round(bowl, (2 * math.cos(a) * away[0], 2 * math.cos(a) * away[1], 2.0 - 2 * math.sin(a))))
        self.assertFalse(O.hits_round(bowl, (-2 * math.cos(a) * away[0], -2 * math.cos(a) * away[1], 2.0 - 2 * math.sin(a))))
        dome = O.build_solid({'kind': 'HEMISPHERE', 'radius': 2, 'id': 's2'})
        self.assertEqual(dome['cz'], 0.0)
        self.assertTrue(O.hits_round(dome, (2 * away[0], 2 * away[1], 0.0)))   # the far rim of the flat disc is behind the dome
        self.assertFalse(O.hits_round(dome, (-2 * away[0], -2 * away[1], 0.0)))
        self.assertTrue(O.hits_round(dome, (2 * math.cos(a) * away[0], 2 * math.cos(a) * away[1], 2 * math.sin(a))))
        self.assertFalse(O.hits_round(dome, (-2 * math.cos(a) * away[0], -2 * math.cos(a) * away[1], 2 * math.sin(a))))


class BallsOffTheAxis(unittest.TestCase):
    """E33: at:{x,y,z?} puts a ball of a cylinder off its axis (x along the screen's horizontal, y into the picture); stack.layers lays equal balls out in rows"""

    @staticmethod
    def specs(host):
        return O.expanded_solid_specs({'solids': [{'kind': 'CYLINDER', 'radius': 12, 'height': 40, **host}]})

    def test_rows_of_equal_balls_rest_on_the_row_below(self):
        specs = self.specs({'stack': {'radius': 6, 'layers': [2, 2, 1]}})
        balls = specs[1:]
        self.assertEqual([b['id'] for b in balls], ['s1b1', 's1b2', 's1b3', 's1b4', 's1b5'])
        self.assertEqual([(b['at']['x'], b['at']['y']) for b in balls], [(-6.0, 0.0), (6.0, 0.0), (-6.0, 0.0), (6.0, 0.0), (0.0, 0.0)])
        self.assertEqual([b['centerZ'] for b in balls[:4]], [6.0, 6.0, 18.0, 18.0])
        self.assertAlmostEqual(balls[4]['centerZ'], 18 + math.sqrt(108), places=5)   # between two balls 12 apart: 6 across, so 12^2 - 6^2 up
        # a row of three or of one, and the plan's own old stacks and lists stay where they were
        self.assertEqual([b['at']['x'] for b in self.specs({'stack': {'radius': 3, 'layers': [3]}})[1:]], [-6.0, 0.0, 6.0])
        old = self.specs({'stack': {'count': 3, 'radius': 3}})
        self.assertTrue(all('at' not in b for b in old[1:]))
        self.assertEqual([b['centerZ'] for b in old[1:]], [3.0, 9.0, 15.0])

    def test_a_ball_without_a_height_falls_onto_the_floor_or_the_balls_before_it(self):
        specs = self.specs({'inside': [{'kind': 'SPHERE', 'radius': 3, 'at': {'x': 0, 'y': 0}}, {'kind': 'SPHERE', 'radius': 3, 'at': {'x': 3, 'y': 0}},
                                       {'kind': 'SPHERE', 'radius': 2, 'at': {'x': -8, 'y': 0}}, {'kind': 'SPHERE', 'radius': 3, 'at': {'x': 6, 'y': -4, 'z': 20}}]})[1:]
        self.assertEqual(specs[0]['centerZ'], 3.0)
        self.assertAlmostEqual(specs[1]['centerZ'], 3 + math.sqrt(27), places=5)   # touching the first ball, 3 across
        self.assertEqual(specs[2]['centerZ'], 2.0)                                  # nothing under it: on the floor
        self.assertEqual(specs[3]['centerZ'], 20.0)                                 # told where
        self.assertNotIn('z', specs[3]['at'])

    def test_a_list_without_any_at_keeps_the_old_rule_one_on_the_other(self):
        specs = self.specs({'inside': [{'kind': 'SPHERE', 'radius': 2}, {'kind': 'SPHERE', 'radius': 3}]})[1:]
        self.assertEqual([b['centerZ'] for b in specs], [2.0, 7.0])

    def test_what_the_grammar_does_not_allow_is_refused(self):
        for host in ({'stack': {'radius': 6, 'layers': [2, 2, 1], 'count': 5}}, {'stack': {'radius': 6, 'layers': []}}, {'stack': {'radius': 6, 'layers': [1]}},
                     {'stack': {'radius': 2, 'layers': [3, 3, 1]}}, {'stack': {'radius': 2, 'layers': [2, 1.5]}}, {'stack': {'radius': 2, 'layers': [2, True]}}, {'stack': {'radius': 2, 'layers': 'ab'}},
                     {'inside': [{'kind': 'SPHERE', 'radius': 3, 'centerZ': 3, 'at': {'x': 0, 'y': 0, 'z': 3}}]}, {'inside': [{'kind': 'SPHERE', 'radius': 3, 'at': {'x': 0, 'w': 1}}]},
                     {'inside': [{'kind': 'SPHERE', 'radius': 3, 'at': 5}]}):
            self.assertRaises(ValueError, self.specs, host)

    def test_the_centre_of_a_ball_carries_its_place_off_the_axis(self):
        ball = O.build_solid({'kind': 'SPHERE', 'radius': 3, 'inside': 's1', 'centerZ': 7, 'at': {'x': 4, 'y': -2}, 'id': 's1b1'})
        x, y, z = ball['points'][0][2]
        self.assertAlmostEqual(x, 4 * math.cos(O.YAW) + (-2) * (-math.sin(O.YAW)), places=9)
        self.assertAlmostEqual(y, 4 * math.sin(O.YAW) + (-2) * math.cos(O.YAW), places=9)
        self.assertEqual(z, 7.0)
        self.assertEqual(ball['at'], (4.0, -2.0))
        # the screen shows x as the horizontal and y (into the picture) as a rise of y sin(pitch): the centre projects to (4, -2 sin(pitch) + 7 cos(pitch))
        sx, sy = O.project((x, y, z))
        self.assertAlmostEqual(sx, 4.0, places=9)
        self.assertAlmostEqual(sy, -2 * math.sin(O.PITCH) + 7 * math.cos(O.PITCH), places=9)
        # only a ball inside a cylinder stands off the axis
        for spec in ({'kind': 'SPHERE', 'radius': 3, 'at': {'x': 1, 'y': 0}, 'id': 's1'}, {'kind': 'CONE', 'radius': 3, 'height': 2, 'inside': 's0', 'at': {'x': 1, 'y': 0}, 'id': 's2'}):
            self.assertRaises(ValueError, O.build_solid, spec)

    def test_the_depth_test_of_a_ball_uses_its_own_centre(self):
        ball = O.build_solid({'kind': 'SPHERE', 'radius': 3, 'inside': 's1', 'centerZ': 3, 'at': {'x': 5, 'y': 0}, 'id': 's1b1'})
        away = O.vunit((-O.VIEW[0], -O.VIEW[1], 0.0))
        cx, cy = 5 * O.SCREEN_X[0], 5 * O.SCREEN_X[1]
        far = (cx + 3 * away[0], cy + 3 * away[1], 3.0)    # the far side of the equator of this ball
        near = (cx - 3 * away[0], cy - 3 * away[1], 3.0)
        self.assertTrue(O.hits_round(ball, far))
        self.assertFalse(O.hits_round(ball, near))
        # the same points are not on a ball standing on the axis
        axis_ball = O.build_solid({'kind': 'SPHERE', 'radius': 3, 'inside': 's1', 'centerZ': 3, 'id': 's1b2'})
        self.assertFalse(O.hits_round(axis_ball, far))


class WedgeEdgeAxisAndRightAngle(unittest.TestCase):
    """E33: cut.axis puts the edge of a wedge on X, Y or Z; cut.rightAngle names the two radii in the cut faces perpendicular to that edge; dims[].half picks a radius's half axis.
    Everything is derived from the cut alone, by point membership and the depth test of the observer."""

    @staticmethod
    def sphere(**cut):
        return O.build_solid({'kind': 'SPHERE', 'radius': 3, 'id': 's1', 'cut': cut})

    def test_the_checked_cut_carries_its_axis_and_right_angle_and_refuses_what_has_no_wedge(self):
        self.assertEqual(O.check_cut_spec({'kind': 'THREE_QUARTERS'}), {'kind': 'THREE_QUARTERS', 'facing': 'CUT', 'axis': 'Z', 'rightAngle': False})
        self.assertEqual(O.check_cut_spec({'kind': 'QUARTER', 'axis': 'Y', 'rightAngle': True}), {'kind': 'QUARTER', 'facing': 'CUT', 'axis': 'Y', 'rightAngle': True})
        for cut in ({'kind': 'QUARTER', 'axis': 'W'}, {'kind': 'QUARTER', 'axis': 'y'}, {'kind': 'QUARTER', 'axis': 3}, {'kind': 'HALF', 'axis': 'Y'}, {'kind': 'OCTANT', 'axis': 'X'},
                    {'kind': 'SEVEN_EIGHTHS', 'axis': 'Z'}, {'kind': 'HALF', 'rightAngle': True}, {'kind': 'OCTANT', 'rightAngle': True}, {'kind': 'QUARTER', 'rightAngle': 'yes'}):
            self.assertRaises(ValueError, O.check_cut_spec, cut)

    def test_the_removed_quarter_and_the_kept_one_in_each_frame(self):
        r = 3.0
        def inside(kind, axis, d, facing='CUT'):
            return O.cut_inside(O.check_cut_spec({'kind': kind, 'axis': axis, 'facing': facing}), d, r)
        # THREE_QUARTERS: x>0 & y<0 is out for Z (as before), x>0 & z>0 for Y, y<0 & z>0 for X; points on the other sides stay
        self.assertFalse(inside('THREE_QUARTERS', 'Z', (1.0, -1.0, 0.5)))
        self.assertTrue(inside('THREE_QUARTERS', 'Z', (1.0, 1.0, 0.5)))
        self.assertFalse(inside('THREE_QUARTERS', 'Y', (1.0, 0.5, 1.0)))
        self.assertFalse(inside('THREE_QUARTERS', 'Y', (1.0, -0.5, 1.0)))
        self.assertTrue(inside('THREE_QUARTERS', 'Y', (1.0, 0.5, -1.0)))
        self.assertTrue(inside('THREE_QUARTERS', 'Y', (-1.0, 0.5, 1.0)))
        self.assertFalse(inside('THREE_QUARTERS', 'X', (0.5, -1.0, 1.0)))
        self.assertFalse(inside('THREE_QUARTERS', 'X', (-0.5, -1.0, 1.0)))
        self.assertTrue(inside('THREE_QUARTERS', 'X', (0.5, 1.0, 1.0)))
        # QUARTER keeps the quarter opposite: x<0 & z<0 (Y), z<0 & y>0 (X), x<0 & y>0 (Z)
        self.assertTrue(inside('QUARTER', 'Y', (-1.0, 0.5, -1.0)))
        self.assertFalse(inside('QUARTER', 'Y', (-1.0, 0.5, 1.0)))
        self.assertTrue(inside('QUARTER', 'X', (0.5, 1.0, -1.0)))
        self.assertFalse(inside('QUARTER', 'X', (0.5, -1.0, -1.0)))
        self.assertTrue(inside('QUARTER', 'Z', (-1.0, 1.0, 0.5)))
        # turned about the centre (CURVED) every point is read from the other side
        self.assertFalse(inside('THREE_QUARTERS', 'Y', (-1.0, 0.5, -1.0), 'CURVED'))   # read as (1, -0.5, 1): in the removed quarter
        self.assertTrue(inside('THREE_QUARTERS', 'Y', (1.0, 0.5, 1.0), 'CURVED'))

    def test_the_edge_and_the_two_faces_of_the_wedge_follow_the_axis(self):
        for axis, creases in (('Z', {'+Z', '-Z'}), ('Y', {'+Y', '-Y'}), ('X', {'+X', '-X'})):
            self.assertEqual(set(O.cut_features(self.sphere(kind='THREE_QUARTERS', axis=axis))['creases']), creases, axis)
        faces = O.cut_features(self.sphere(kind='THREE_QUARTERS', axis='Y'))['faces']
        self.assertEqual(sorted(faces), ['X++', 'X-+', 'Z++', 'Z+-'])   # a vertical and a horizontal half-disk, each two quarter-disks
        self.assertTrue(all(f['visible'] for f in faces.values()))

    def test_the_radii_of_the_right_angle_lie_in_the_cut_faces_and_a_wedge_turned_away_hides_them(self):
        def radii(**cut):
            return sorted((('+' if s > 0 else '-') + 'XYZ'[k], seen) for k, s, seen in O.cut_edge_radii(self.sphere(**cut)))
        self.assertEqual(radii(kind='THREE_QUARTERS', axis='Y'), [('+X', True), ('+Z', True)])
        self.assertEqual(radii(kind='THREE_QUARTERS'), [('+X', True), ('-Y', True)])
        self.assertEqual(radii(kind='QUARTER', axis='Y'), [('-X', True), ('-Z', True)])
        self.assertEqual(radii(kind='QUARTER'), [('+Y', True), ('-X', True)])
        self.assertTrue(all(not seen for _name, seen in radii(kind='THREE_QUARTERS', axis='Y', facing='CURVED')))
        # the half axes a radius label may lie on: the seen ones; a named half axis is taken only when it is one of them
        solid = self.sphere(kind='THREE_QUARTERS', axis='Y')
        self.assertEqual(O.cut_radius_axis(solid, '+X'), (0, 1))
        self.assertEqual(O.cut_radius_axis(solid, '+Z'), (2, 1))
        names = lambda items: [('+' if s_ > 0 else '-') + 'XYZ'[k_] for k_, s_ in items]
        self.assertEqual(names(O.cut_seen_axes(solid)), ['+X', '+Y', '-Y', '+Z'])   # -X and -Z are inside the piece: not seen
        self.assertIsNone(O.cut_radius_axis(solid, '-X'))
        self.assertIsNone(O.cut_radius_axis(solid, '-Z'))
        self.assertEqual(O.cut_radius_axis(solid), (0, 1))   # unnamed: the most horizontal on the screen, the right one when equal


class HeightFeet(unittest.TestCase):
    """E33: the height of a pyramid or frustum (apex or top centre straight down to the base plane) and its foot, derived from the plan's solids alone"""

    def test_the_foot_is_straight_below_the_apex_or_the_centre_of_the_top_face(self):
        pyramid = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 4, 'depth': 2}, 'height': 6, 'names': 'ABCDV', 'id': 's1'})
        top, foot = O.poly_height_points(pyramid)
        self.assertEqual(top, (2.0, 1.0, 6.0))
        self.assertEqual(foot, (2.0, 1.0, 0.0))
        # an apex pushed off the centre (an oblique pyramid): its foot is below it, not at the centre of the base
        oblique = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 4, 'depth': 2}, 'height': 6, 'apex': [3, 2], 'names': 'ABCDV', 'id': 's1'})
        self.assertEqual(O.poly_height_points(oblique), ((3.0, 2.0, 6.0), (3.0, 2.0, 0.0)))
        frustum = O.build_solid({'kind': 'FRUSTUM', 'base': {'kind': 'RECT', 'width': 4, 'depth': 4}, 'height': 3, 'topScale': 0.5, 'names': 'ABCDEFGH', 'id': 's1'})
        top, foot = O.poly_height_points(frustum)
        self.assertEqual((round(top[0], 9), round(top[1], 9), top[2]), (2.0, 2.0, 3.0))
        self.assertEqual(foot[2], 0.0)

    def test_a_height_dimension_belongs_to_the_named_solid_or_the_first_that_has_a_height_line(self):
        solids = [O.build_solid({'kind': 'PRISM', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 3, 'names': UNNAMED, 'id': 's1'}),
                  O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 2, 'depth': 2}, 'height': 3, 'names': 'ABCDV', 'id': 's2'}),
                  O.build_solid({'kind': 'CONE', 'radius': 2, 'height': 3, 'id': 's3'})]
        self.assertEqual(O.height_dim_solid({}, {'height': True}, solids)['id'], 's2')   # a prism's height is an edge: the pyramid is the first with a height line
        self.assertEqual(O.height_dim_solid({}, {'height': True, 'solid': 's3'}, solids)['id'], 's3')
        self.assertIsNone(O.height_dim_solid({}, {'height': True, 'solid': 's9'}, solids))

    def test_two_segments_are_the_same_line_whichever_end_comes_first(self):
        a, b = (10.0, 20.0), (40.0, 60.0)
        self.assertTrue(O._same_segment(a, b, a, b) and O._same_segment(a, b, b, a))
        self.assertTrue(O._same_segment(a, b, (10.4, 20.0), (40.0, 60.4)))
        self.assertFalse(O._same_segment(a, b, (10.0, 20.0), (40.0, 62.0)))
        self.assertFalse(O._same_segment(a, b, (10.0, 20.0), (10.0, 20.0)))

    def test_the_default_foot_vertex_is_the_base_vertex_farthest_right_on_the_screen(self):
        pyramid = O.build_solid({'kind': 'PYRAMID', 'base': {'kind': 'RECT', 'width': 3, 'depth': 4}, 'height': 5, 'names': 'ABCDV', 'id': 's1'})
        xs = [O.project(v[1])[0] for v in pyramid['verts'][:4]]
        self.assertEqual(xs.index(max(xs)), 2)   # C(3, 4): 3 cos 28 + 4 sin 28


class DimSide(unittest.TestCase):
    """E33: dims[].side says which side of its segment a label stands on (page coordinates, y down); read back from the label's box and the segment"""

    BOX = (100.0, 100.0, 40.0, 20.0)   # x, y, width, height

    def check(self, side, seg, box):
        errors = []
        O.check_dim_side({'dims': [{'edge': 'AB', 'side': side}]}, 'dim-1', seg, box, errors)
        return errors

    def test_a_label_above_a_nearly_horizontal_segment_is_on_its_top(self):
        seg = ((90.0, 160.0), (190.0, 150.0))   # runs right and slightly up on the page
        self.assertEqual(self.check('TOP', seg, (120.0, 100.0, 40.0, 20.0)), [])
        self.assertEqual(self.check('BOTTOM', seg, (120.0, 170.0, 40.0, 20.0)), [])
        self.assertEqual(self.check('TOP', seg, (120.0, 170.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_MISMATCH:dim-1'])
        self.assertEqual(self.check('BOTTOM', seg, (120.0, 100.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_MISMATCH:dim-1'])

    def test_the_side_is_the_side_of_the_segments_line_whichever_end_is_first(self):
        seg = ((190.0, 150.0), (90.0, 160.0))   # the same segment written the other way round
        self.assertEqual(self.check('TOP', seg, (120.0, 100.0, 40.0, 20.0)), [])
        self.assertEqual(self.check('TOP', seg, (120.0, 170.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_MISMATCH:dim-1'])
        # a label past the end of its segment is still on the segment's top when it is above the line
        self.assertEqual(self.check('TOP', ((100.0, 150.0), (120.0, 150.0)), (50.0, 100.0, 40.0, 20.0)), [])

    def test_left_and_right_of_a_nearly_vertical_segment(self):
        seg = ((150.0, 200.0), (156.0, 120.0))
        self.assertEqual(self.check('LEFT', seg, (90.0, 150.0, 40.0, 20.0)), [])
        self.assertEqual(self.check('RIGHT', seg, (170.0, 150.0, 40.0, 20.0)), [])
        self.assertEqual(self.check('LEFT', seg, (170.0, 150.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_MISMATCH:dim-1'])

    def test_a_side_the_segment_does_not_face_and_an_unknown_side_are_plan_errors(self):
        flat = ((90.0, 150.0), (190.0, 150.0))
        self.assertEqual(self.check('LEFT', flat, (30.0, 140.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_PLAN_INVALID:dim-1'])   # a horizontal segment has no left
        self.assertEqual(self.check('UP', flat, (30.0, 140.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_PLAN_INVALID:dim-1'])
        # 17 degrees off the direction is the limit: sin 17 = 0.29 is refused, a segment tilted 20 degrees (0.34) is accepted
        t17 = ((100.0, 100.0), (100.0 + 100 * math.cos(math.radians(17)), 100.0 - 100 * math.sin(math.radians(17))))
        t20 = ((100.0, 100.0), (100.0 + 100 * math.cos(math.radians(20)), 100.0 - 100 * math.sin(math.radians(20))))
        self.assertEqual(self.check('LEFT', t17, (40.0, 90.0, 40.0, 20.0)), ['SOLID_DIM_SIDE_PLAN_INVALID:dim-1'])
        self.assertEqual(self.check('LEFT', t20, (40.0, 90.0, 40.0, 20.0)), [])

    def test_no_side_no_check_and_the_dimension_of_a_plan_is_found_by_its_id(self):
        self.assertEqual(O.plan_dim({'dims': [{'edge': 'AB'}, {'edge': 'BC', 'side': 'TOP'}]}, 'dim-2'), {'edge': 'BC', 'side': 'TOP'})
        self.assertEqual(O.plan_dim({'dims': [{'edge': 'AB'}]}, 'dim-3'), {})
        self.assertEqual(O.plan_dim({}, 'dim-1'), {})
        errors = []
        O.check_dim_side({'dims': [{'edge': 'AB'}]}, 'dim-1', ((0.0, 0.0), (10.0, 0.0)), (0.0, 0.0, 1.0, 1.0), errors)
        self.assertEqual(errors, [])


class TintedBase(unittest.TestCase):
    """E33: baseFill tints the base circle of a cylinder, cone or frustum and may name it; the grammar is read here from the plan alone"""

    def test_the_forms_of_baseFill_and_their_defaults(self):
        def fill(value, **solid):
            return O.build_solid({'kind': 'CONE', 'radius': 4, 'height': 6, 'id': 's1', 'baseFill': value, **solid})['base_fill']
        self.assertEqual(fill(True), {'face': 'BOTTOM', 'fill': 'LIGHT', 'label': None})
        self.assertEqual(fill('MEDIUM'), {'face': 'BOTTOM', 'fill': 'MEDIUM', 'label': None})
        self.assertEqual(fill({'fill': 'WARM', 'label': 'S'}), {'face': 'BOTTOM', 'fill': 'WARM', 'label': 'S'})
        self.assertEqual(fill({'face': 'TOP', 'label': '밑면'}, orientation='APEX_DOWN'), {'face': 'TOP', 'fill': 'LIGHT', 'label': '밑면'})
        self.assertIsNone(O.build_solid({'kind': 'CONE', 'radius': 4, 'height': 6, 'id': 's1'})['base_fill'])

    def test_what_has_no_base_circle_or_a_bad_form_is_refused(self):
        cone = {'kind': 'CONE', 'radius': 4, 'height': 6, 'id': 's1'}
        for value, extra in (({'fill': 'RED'}, {}), ({'face': 'SIDE'}, {}), ({'colour': 'LIGHT'}, {}), (5, {}), ({'label': 'S^2'}, {}), ({'label': ' S'}, {}), ({'label': ''}, {}),
                             ({'face': 'TOP'}, {}), (True, {'orientation': 'APEX_DOWN'})):
            with self.assertRaises(ValueError, msg=str((value, extra))): O.build_solid({**cone, 'baseFill': value, **extra})
        for kind in ('SPHERE', 'HEMISPHERE'):
            with self.assertRaises(ValueError) as caught: O.build_solid({'kind': kind, 'radius': 3, 'id': 's1', 'baseFill': True})
            self.assertEqual(str(caught.exception), 'SOLID_BASE_FILL_UNSUPPORTED:' + kind)

    def test_a_joint_circle_of_a_stack_is_no_base(self):
        def stack(a, b):
            solids = [O.build_solid({'kind': 'CYLINDER', 'radius': 3, 'height': 4, 'id': 's1', **a}), O.build_solid({'kind': 'CONE', 'radius': 3, 'height': 4, 'id': 's2', 'on': 's1', **b})]
            return O.resolve_stacks(solids)
        self.assertRaises(ValueError, stack, {'baseFill': {'face': 'TOP'}}, {})
        self.assertRaises(ValueError, stack, {}, {'baseFill': True})
        self.assertEqual(len(stack({'baseFill': True}, {})), 1)

    def test_the_name_of_a_base_is_planned_after_the_axis_words_and_before_the_written_labels(self):
        solids = [O.build_solid({'kind': 'CYLINDER', 'radius': 2, 'height': 4, 'axis': {'label': '회전축'}, 'baseFill': {'label': 'S'}, 'id': 's1'}),
                  O.build_solid({'kind': 'CONE', 'radius': 3, 'height': 5, 'baseFill': {'face': 'BOTTOM', 'label': '밑면'}, 'id': 's2'})]
        plan = {'labels': [{'text': '모선', 'at': {'slant': True, 'solid': 's2'}}]}
        named = {}
        planned, axes = O.planned_text_labels(plan, solids, O.make_norm(solids, named))
        self.assertEqual([(i, k, t, g) for i, k, t, g, _ in planned],
                         [('text-tl1', 'AXIS', '회전축', 's1'), ('text-tl2', 'BASE', 'S', 's1|base'), ('text-tl3', 'BASE', '밑면', 's2|base'), ('text-tl4', 'SLANT', '모선', 's2')])
        self.assertEqual(axes, {'s1'})


class AngleLabels(unittest.TestCase):
    """E33: marks.angles[].label — its number is read from the plan's own text, the angle from the named points, the place from the page"""

    def ctx(self, box, tex='90^\\circ', value=None):
        import xml.etree.ElementTree as ET
        g = ET.Element('g', {'id': 'angle-label-an1', 'data-label-role': 'angle-label', 'data-mark': 'an1', 'data-tex': tex, 'data-value': tex if value is None else value})
        named = {'A': ('s1', (100.0, 100.0), (0.0, 0.0, 0.0)), 'B': ('s1', (160.0, 100.0), (3.0, 0.0, 0.0)), 'D': ('s1', (100.0, 40.0), (0.0, 3.0, 0.0))}
        return {'errors': [], 'boxes': {'angle-label-an1': box}, 'norm': lambda x: x, 'named': named, 'labels': [g]}

    PLAN = {'marks': {'angles': [{'refs': ['B', 'A', 'D'], 'arcs': 1, 'label': '90^\\circ'}]}}

    def test_the_number_of_a_label_is_the_degrees_after_the_last_equals_sign(self):
        self.assertEqual(O.angle_label_number('55^\\circ'), 55.0)
        self.assertEqual(O.angle_label_number('\\angle A=55^\\circ'), 55.0)
        self.assertEqual(O.angle_label_number('90.5^\\circ'), 90.5)
        for symbol in ('y^\\circ', 'x', '55', '55^\\circ x', '', None): self.assertIsNone(O.angle_label_number(symbol))

    def test_a_label_beside_its_arc_on_the_side_of_the_angle_passes(self):
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0))   # centre (125, 69): up and to the right of the vertex, between the two rays
        O.check_angle_labels(self.PLAN, ctx)
        self.assertEqual(ctx['errors'], [])

    def test_wrong_number_text_place_and_missing_label_are_caught(self):
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0), tex='55^\\circ')
        O.check_angle_labels({'marks': {'angles': [{'refs': ['B', 'A', 'D'], 'arcs': 1, 'label': '55^\\circ'}]}}, ctx)   # the angle is 90 degrees
        self.assertEqual(ctx['errors'], ['SOLID_ANGLE_LABEL_VALUE_MISMATCH:an1'])
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0), tex='80^\\circ')
        O.check_angle_labels(self.PLAN, ctx)
        self.assertEqual(ctx['errors'], ['SOLID_ANGLE_LABEL_TEXT_MISMATCH:an1'])
        ctx = self.ctx((40.0, 120.0, 30.0, 18.0))   # down and to the left: behind the vertex
        O.check_angle_labels(self.PLAN, ctx)
        self.assertEqual(ctx['errors'], ['SOLID_ANGLE_LABEL_OFF_SIDE:an1'])
        ctx = self.ctx((300.0, 300.0, 30.0, 18.0))
        O.check_angle_labels(self.PLAN, ctx)
        self.assertIn('SOLID_ANGLE_LABEL_FAR_FROM_ANGLE:an1', ctx['errors'])
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0))
        ctx['labels'] = []
        O.check_angle_labels(self.PLAN, ctx)
        self.assertEqual(ctx['errors'], ['SOLID_ANGLE_LABEL_SET_MISMATCH'])
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0))
        O.check_angle_labels({}, ctx)   # a label nobody asked for
        self.assertEqual(ctx['errors'], ['SOLID_ANGLE_LABEL_SET_MISMATCH'])
        # a symbol is not compared with the angle
        ctx = self.ctx((110.0, 60.0, 30.0, 18.0), tex='y^\\circ')
        O.check_angle_labels({'marks': {'angles': [{'refs': ['B', 'A', 'D'], 'arcs': 1, 'label': 'y^\\circ'}]}}, ctx)
        self.assertEqual(ctx['errors'], [])


class SlantPartsAndLevelPoints(unittest.TestCase):
    """E33: names.level/levelRim/rim of a cone with a LEVEL section and the parts of its slant, derived here from the plan alone"""

    @staticmethod
    def cone(**names):
        return O.build_solid({'kind': 'CONE', 'radius': 6, 'height': 8, 'id': 's1', 'names': {'apex': 'T', 'center': 'A', **names}})

    PLAN = {'section': {'solid': 's1', 'kind': 'LEVEL', 'at': '2/5', 'fill': 'BOTTOM'}}

    def test_the_level_points_are_the_centre_and_the_contour_generator_points_of_the_two_circles(self):
        solid = self.cone(level='C', levelRim='D', rim='B')
        O.add_level_points(self.PLAN, [solid])
        pts = {name: p for name, _pid, p in solid['points'] if name}
        self.assertEqual(sorted(pts), ['A', 'B', 'C', 'D', 'T'])
        self.assertEqual(pts['C'], (0.0, 0.0, 3.2))
        # on the page T, D and B lie on one straight line (the contour generator), D 3/5 of the way down it (the radii 3.6 and 6)
        T, D, B = (O.project(pts[k]) for k in 'TDB')
        cross = (D[0] - T[0]) * (B[1] - T[1]) - (D[1] - T[1]) * (B[0] - T[0])
        self.assertAlmostEqual(cross, 0.0, places=9)
        self.assertAlmostEqual((D[0] - T[0]) / (B[0] - T[0]), 0.6, places=9)
        # in the plane of each circle the point is a radius from its centre
        self.assertAlmostEqual(math.hypot(pts['D'][0] - pts['C'][0], pts['D'][1] - pts['C'][1]), 3.6, places=9)
        self.assertAlmostEqual(math.hypot(pts['B'][0] - pts['A'][0], pts['B'][1] - pts['A'][1]), 6.0, places=9)

    def test_what_has_no_level_or_no_base_circle_is_refused(self):
        for names, plan, kind in (({'level': 'C'}, {}, 'CONE'), ({'levelRim': 'D'}, {}, 'CONE'), ({'level': 'C'}, {'section': {'solid': 's9', 'kind': 'LEVEL', 'at': '1/2'}}, 'CONE'),
                                  ({'level': 'C'}, {'section': {'kind': 'AXIAL'}}, 'CONE')):
            solid = self.cone(**names)
            with self.assertRaises(ValueError, msg=str((names, plan))): O.add_level_points(plan, [solid])
        down = O.build_solid({'kind': 'CONE', 'radius': 6, 'height': 8, 'orientation': 'APEX_DOWN', 'id': 's1', 'names': {'rim': 'B'}})
        with self.assertRaises(ValueError): O.add_level_points({}, [down])
        with self.assertRaises(ValueError): O.build_solid({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'id': 's1', 'names': {'level': 'C'}})
        # the rim needs no section
        solid = self.cone(rim='B')
        O.add_level_points({}, [solid])
        self.assertEqual([n for n, _p, _q in solid['points'] if n], ['A', 'T', 'B'])

    def test_a_slant_part_is_found_on_the_drawn_line_by_its_radius(self):
        solid = self.cone()
        seg = ((100.0, 50.0), (160.0, 250.0))   # apex above, base end below: the page's y grows down
        top = O.slant_part_segment(seg, solid, 'top', 0.4)
        bottom = O.slant_part_segment(seg, solid, 'bottom', 0.4)
        # the level is at 2/5 of the height: its circle has 3/5 of the base radius, so it is 3/5 of the way from the apex
        for got, want in ((top, ((100.0 + 36.0, 50.0 + 120.0), (100.0, 50.0))), (bottom, ((160.0, 250.0), (136.0, 170.0)))):
            for p, q in zip(sorted(got), sorted(want)): self.assertAlmostEqual(math.hypot(p[0] - q[0], p[1] - q[1]), 0.0, places=6)
        self.assertEqual(top[1], seg[0])
        self.assertEqual(bottom[0], seg[1])
        # the line given the other way round is the same
        self.assertEqual(O.slant_part_segment((seg[1], seg[0]), solid, 'top', 0.4), top)
        self.assertIsNone(O.slant_part_segment(seg, O.build_solid({'kind': 'CYLINDER', 'radius': 2, 'height': 3, 'id': 's2'}), 'top', 0.5))
