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
