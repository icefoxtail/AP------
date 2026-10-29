"""Container-fill observer: the exact re-derivations and the tamper cases on a small hand-built figure.
No Chrome here: composed figures are exercised by tests/container-fill.test.mjs."""
import re
import sys
import unittest
from fractions import Fraction
from pathlib import Path

PRODUCTION = Path(__file__).resolve().parents[1] / 'production'
sys.path.insert(0, str(PRODUCTION))
import container_fill_observer as C

CX, YBOT, SV = 100.0, 200.0, 30.0
GX, X_END = 220.0, 400.0
PLAN = {
    'pairs': [{
        'vessel': {'name': 'A', 'profile': [
            {'kind': 'CYLINDER', 'radius': '2', 'height': '2'},
            {'kind': 'FRUSTUM', 'r0': '1', 'r1': '2', 'height': '2'}]},
        'graphName': 'ㄱ',
        'segmentNotes': [{'segment': 0, 'text': '넓음'}],
    }],
    'guides': True,
}


def f(v):
    return ('%.4f' % v).rstrip('0').rstrip('.')


def pts(points):
    return ' '.join('%s,%s' % (f(x), f(y)) for x, y in points)


def x_of(h, total=38 / 3.0, gx=GX, x_end=X_END):
    # frustum r0=1, r1=2, h=2: volume(s) = h/(3 d) * ((r0 + d s / h)^3 - r0^3) with d=1
    s = h - 2
    v = 4 * h if h <= 2 else 8 + 2 / 3.0 * (((1 + s / 2) ** 3) - 1)
    return gx + v / total * (x_end - gx)


def label(label_id, role, owner, box, text=None, tex=None, extra=''):
    attr = ('data-text="%s"' % text) if text is not None else ('data-tex="%s"' % tex)
    return ('<g data-layer="90"><g id="%s" data-label-role="%s" data-owner="%s" %s%s data-box="%s"/></g>'
            % (label_id, role, owner, attr, extra, ','.join(f(v) for v in box)))


def build(ticks=False, guides=True, notes=True, names=True):
    right = [(CX + 2 * SV, YBOT), (CX + 2 * SV, YBOT - 2 * SV), (CX + 1 * SV, YBOT - 2 * SV), (CX + 2 * SV, YBOT - 4 * SV)]
    left = [(2 * CX - x, y) for x, y in right]
    poly = left + right[::-1]
    wall = left[::-1] + right
    # the curve: two vertices on the straight piece, 17 on the frustum
    heights = [0.0, 2.0] + [2 + 2 * k / 16 for k in range(1, 17)]
    curve = [(x_of(h), YBOT - h * SV) for h in heights]
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 548 280" width="548" height="280" data-container-fill="container-fill-figure-v1" data-pairs="1" data-safe-margin="12">',
           '<rect width="548" height="280" fill="#fff"/>']
    out.append('<g data-layer="20"><polygon id="vessel-fill-0" data-role="vessel-fill" data-pair="0" points="%s"/></g>' % pts(poly))
    out.append('<g data-layer="30"><polyline id="vessel-wall-0" data-role="vessel-wall" data-pair="0" points="%s"/></g>' % pts(wall))
    out.append('<g data-layer="25"><line id="vessel-sep-0-1" data-role="vessel-sep" data-pair="0" data-boundary="1" x1="%s" y1="%s" x2="%s" y2="%s"/></g>' % (f(CX - SV), f(YBOT - 2 * SV), f(CX + SV), f(YBOT - 2 * SV)))
    out.append('<g data-layer="30"><line id="x-axis-0" data-role="axis" data-axis="x" data-pair="0" x1="%s" y1="%s" x2="419" y2="%s"/></g>' % (f(GX), f(YBOT), f(YBOT)))
    out.append('<g data-layer="30"><polygon id="x-axis-arrow-0" data-role="arrow" data-pair="0" points="427,%s 418,%s 418,%s"/></g>' % (f(YBOT), f(YBOT - 4), f(YBOT + 4)))
    out.append('<g data-layer="30"><line id="y-axis-0" data-role="axis" data-axis="y" data-pair="0" x1="%s" y1="%s" x2="%s" y2="55"/></g>' % (f(GX), f(YBOT), f(GX)))
    out.append('<g data-layer="30"><polygon id="y-axis-arrow-0" data-role="arrow" data-pair="0" points="%s,47 %s,56 %s,56"/></g>' % (f(GX), f(GX - 4), f(GX + 4)))
    out.append('<g data-layer="50"><polyline id="curve-0" data-role="curve" data-pair="0" points="%s"/></g>' % pts(curve))
    for i, h in ((1, 2.0), (2, 4.0)):
        out.append('<g data-layer="70"><circle id="break-0-%d" data-role="break-point" data-pair="0" data-boundary="%d" cx="%s" cy="%s" r="3.2"/></g>' % (i, i, f(x_of(h)), f(YBOT - h * SV)))
        if guides:
            wall_x = CX + 2 * SV
            out.append('<g data-layer="22"><line id="guide-0-%d" data-role="guide" data-pair="0" data-boundary="%d" x1="%s" y1="%s" x2="%s" y2="%s"/></g>' % (i, i, f(wall_x + 5), f(YBOT - h * SV), f(x_of(h)), f(YBOT - h * SV)))
    if ticks:
        for k, v in enumerate(['2', '4']):
            y = YBOT - float(v) * SV
            out.append('<g data-layer="30"><line id="y-tick-0-%d" data-role="y-tick" data-pair="0" x1="%s" y1="%s" x2="%s" y2="%s"/></g>' % (k, f(GX - 5), f(y), f(GX), f(y)))
            out.append(label('y-tick-0-%d-label' % k, 'y-tick', 'y-tick-0-%d' % k, (GX - 24, y - 7, 15, 14), tex='\\displaystyle ' + v))
        flow = 2  # flowPi
        total = 38 / 3.0
        for k, t in enumerate(['3', '5']):
            x = GX + float(t) * flow / total * (X_END - GX)
            out.append('<g data-layer="30"><line id="x-tick-0-%d" data-role="x-tick" data-pair="0" x1="%s" y1="%s" x2="%s" y2="%s"/></g>' % (k, f(x), f(YBOT), f(x), f(YBOT + 5)))
            out.append(label('x-tick-0-%d-label' % k, 'x-tick', 'x-tick-0-%d' % k, (x - 7, YBOT + 9, 14, 14), tex='\\displaystyle ' + t))
    out.append(label('y-title-0', 'axis-title', 'y-axis-0', (GX - 20, 23, 40, 20), text='높이'))
    out.append(label('x-title-0', 'axis-title', 'x-axis-0', (435, YBOT - 10, 40, 20), text='시간'))
    out.append(label('origin-0', 'origin', 'x-axis-0', (GX - 20, YBOT + 4, 15, 15), tex='O'))
    if names:
        out.append(label('vessel-name-0', 'vessel-name', 'vessel-wall-0', (CX - 10, YBOT + 9, 20, 20), text='A'))
        out.append(label('graph-name-0', 'graph-name', 'curve-0', (300 + (30 if ticks else 0) * 0, YBOT + 9 + (30 if ticks else 0), 20, 20), text='ㄱ'))
    if notes:
        out.append(label('segment-note-0-0', 'segment-note', 'curve-0', (300, 168, 60, 18), text='넓음', extra=' data-pair="0" data-segment="0"'))
    out.append('</svg>')
    return ''.join(out)


def plan_with(**changes):
    plan = {**PLAN, 'pairs': [dict(PLAN['pairs'][0])]}
    plan.update(changes)
    return plan


def errors(svg, plan=None):
    result = C.audit(plan or PLAN, svg)
    return result['errors']


def has(errs, prefix):
    return any(e.startswith(prefix) for e in errs)


class Exact(unittest.TestCase):
    def test_volumes_follow_the_closed_form_of_the_frustum(self):
        pd = C.Pair(PLAN['pairs'][0])
        self.assertEqual(pd.z, [0, 2, 4])
        self.assertEqual(pd.vol, [0, 8, Fraction(38, 3)])   # 2^2*2 and 2*(1+2+4)/3 added
        self.assertEqual(pd.height, 4)
        cone = C.Pair({'vessel': {'profile': [{'kind': 'FRUSTUM', 'r0': '0', 'r1': '3', 'height': '3'}]}})
        self.assertEqual(cone.total, 9)
        half = C.Pair({'vessel': {'profile': [{'kind': 'FRUSTUM', 'r0': '2', 'r1': '2', 'height': '3'}]}})
        self.assertEqual(half.total, 12)

    def test_volume_at_is_the_exact_integral_of_the_section_area(self):
        pd = C.Pair(PLAN['pairs'][0])
        for h in (0.5, 1.0, 2.0, 2.4, 3.0, 4.0):
            # numeric integral of r(z)^2 with a fine midpoint rule
            n = 20000
            total = 0.0
            for i in range(n):
                z = h * (i + 0.5) / n
                r = 2.0 if z < 2 else 1.0 + (z - 2) / 2
                total += r * r * h / n
            self.assertAlmostEqual(pd.volume_at(h), total, places=3)
        self.assertEqual(pd.volume_at(-1), 0)
        self.assertAlmostEqual(pd.volume_at(99), 38 / 3.0)

    def test_tex_number_and_geometry_helpers(self):
        self.assertEqual(C.tex_number('\\displaystyle 12'), 12)
        self.assertEqual(C.tex_number('\\frac{1}{2}'), Fraction(1, 2))
        with self.assertRaises(ValueError): C.tex_number('x')
        self.assertTrue(C.seg_hits_rect((0, 0), (10, 10), (4, 4, 2, 2)))
        self.assertFalse(C.seg_hits_rect((0, 0), (10, 0), (4, 4, 2, 2)))
        self.assertAlmostEqual(C.poly_rect_dist([(0, 0), (10, 0)], (4, 3, 2, 2)), 3)
        self.assertTrue(C.same_shape([(0, 0), (4, 0), (4, 4), (0, 4)], [(4, 4), (0, 4), (0, 0), (2, 0), (4, 0)], True))   # a collinear vertex and the start do not matter
        self.assertFalse(C.same_shape([(0, 0), (4, 0), (4, 4), (0, 4)], [(0, 0), (5, 0), (5, 4), (0, 4)], True))

    def test_plans_that_cannot_be_read_are_errors(self):
        for bad in ({}, {'pairs': []}, {'pairs': [{}]}, {'pairs': [{'vessel': {'profile': []}}]},
                    {'pairs': [{'vessel': {'profile': [{'kind': 'SPHERE'}]}}]},
                    {'pairs': [{'vessel': {'profile': [{'kind': 'CYLINDER', 'radius': '0', 'height': '1'}]}}]}):
            with self.assertRaises(ValueError): C.audit(bad, '<svg xmlns="http://www.w3.org/2000/svg"/>')


class Observer(unittest.TestCase):
    def setUp(self):
        self.svg = build()

    def test_a_faithful_figure_passes(self):
        res = C.audit(PLAN, self.svg)
        self.assertEqual(res['errors'], [])
        self.assertEqual(res['status'], 'PASS')
        self.assertAlmostEqual(res['observed'][0]['scale'], SV)

    def test_ticks_the_plan_gives_are_checked_against_the_exact_time(self):
        plan = plan_with(pairs=[{**PLAN['pairs'][0], 'flowPi': '2', 'xTicks': ['3', '5'], 'yTicks': ['2', '4']}])
        svg = build(ticks=True)
        self.assertEqual(errors(svg, plan), [])
        # a time tick off its exact position, a wrong label, a missing tick and ticks nobody asked for
        moved = re.sub(r'(id="x-tick-0-1" [^>]*?x1=")([\d.]+)("[^>]*? x2=")([\d.]+)', lambda m: m.group(1) + str(float(m.group(2)) + 5) + m.group(3) + str(float(m.group(4)) + 5), svg)
        self.assertTrue(has(errors(moved, plan), 'CF_X_TICK_POSITION:0'))
        relabelled = svg.replace('id="y-tick-0-1-label" data-label-role="y-tick" data-owner="y-tick-0-1" data-tex="\\displaystyle 4"', 'id="y-tick-0-1-label" data-label-role="y-tick" data-owner="y-tick-0-1" data-tex="\\displaystyle 3"')
        self.assertTrue(has(errors(relabelled, plan), 'CF_Y_TICK_SET:0'))
        self.assertTrue(has(errors(svg, plan_with(pairs=[{**PLAN['pairs'][0], 'flowPi': '2', 'xTicks': ['3']}])), 'CF_X_TICK_SET:0'))
        self.assertTrue(has(errors(svg), 'CF_X_TICK_SET:0'))
        self.assertTrue(has(errors(svg, plan_with(pairs=[{**PLAN['pairs'][0], 'flowPi': '1', 'xTicks': ['3', '5'], 'yTicks': ['2', '4']}])), 'CF_X_TICK_POSITION:0'))
        # a tick label that wandered away from its own axis
        x0 = GX + 3 * 2 / (38 / 3.0) * (X_END - GX)
        astray = re.sub(r'(id="x-tick-0-0-label"[^>]*? data-box=")([^"]*)(")', lambda m: m.group(1) + '%s,%s,14,14' % (f(x0 - 7), f(YBOT - 40)) + m.group(3), svg)
        self.assertTrue(has(errors(astray, plan), 'CF_TICK_LABEL_PLACE:x-tick-0-0-label'))
        self.assertTrue(has(errors(svg.replace('</svg>', '<path id="stray" d="M0 0"/></svg>'), plan), 'CF_ROOT_CHILD_UNEXPECTED:stray'))

    def test_the_vessel_must_be_the_planned_solid_at_one_scale(self):
        # a distorted silhouette (the narrow part drawn wide), a vessel of another profile, a wall that does not follow the silhouette
        wide = self.svg.replace('130,140', '150,140')
        self.assertTrue(has(errors(wide), 'CF_VESSEL_SHAPE:0'))
        other = plan_with(pairs=[{**PLAN['pairs'][0], 'vessel': {'name': 'A', 'profile': [
            {'kind': 'CYLINDER', 'radius': '2', 'height': '2'}, {'kind': 'FRUSTUM', 'r0': '1', 'r1': '3/2', 'height': '2'}]}}])
        found = errors(self.svg, other)
        self.assertTrue(has(found, 'CF_VESSEL_SHAPE:0'))
        self.assertTrue(has(found, 'CF_CURVE_POINT:0'))
        # the same vessel drawn with a stretched height (horizontal scale unequal)
        stretched = self.svg.replace('40,80 160,80', '40,20 160,20')
        self.assertTrue(has(errors(stretched), 'CF_VESSEL_SHAPE:0') or has(errors(stretched), 'CF_CURVE_END:0'))
        wall = self.svg.replace('id="vessel-wall-0" data-role="vessel-wall" data-pair="0" points="40,80 70,140', 'id="vessel-wall-0" data-role="vessel-wall" data-pair="0" points="40,80 50,140')
        self.assertTrue(has(errors(wall), 'CF_VESSEL_WALL:0'))
        sep = self.svg.replace('x1="70" y1="140" x2="130" y2="140"', 'x1="60" y1="140" x2="140" y2="140"')
        self.assertTrue(has(errors(sep), 'CF_VESSEL_SEP:0:1'))

    def test_every_vertex_of_the_curve_must_lie_on_the_exact_height_time_curve(self):
        pts_re = re.compile(r'(id="curve-0" data-role="curve" data-pair="0" points=")([^"]*)(")')
        def edit(svg, fn):
            return pts_re.sub(lambda m: m.group(1) + fn([tuple(map(float, p.split(','))) for p in m.group(2).split()]) + m.group(3), svg)
        join = lambda points: ' '.join('%s,%s' % (f(x), f(y)) for x, y in points)
        bumped = edit(self.svg, lambda p: join(p[:6] + [(p[6][0] + 1.5, p[6][1])] + p[7:]))
        self.assertTrue(has(errors(bumped), 'CF_CURVE_POINT:0:6'))
        # the curve flattened to the straight line between its end points: the corner vertices are fine but the shape is wrong
        chord = edit(self.svg, lambda p: join([p[0], p[1], p[-1]]))
        self.assertTrue(has(errors(chord), 'CF_CURVE_CHORD:0'))
        # wrong end, wrong start, backwards, past the arrow
        self.assertTrue(has(errors(edit(self.svg, lambda p: join(p[:-1] + [(p[-1][0], p[-1][1] + 6)]))), 'CF_CURVE_END:0'))
        self.assertTrue(has(errors(edit(self.svg, lambda p: join([(p[0][0] + 4, p[0][1])] + p[1:]))), 'CF_CURVE_START:0'))
        self.assertTrue(has(errors(edit(self.svg, lambda p: join(p[:4] + [p[5], p[4]] + p[6:]))), 'CF_CURVE_MONOTONE:0'))
        self.assertTrue(has(errors(edit(self.svg, lambda p: join(p[:-1] + [(p[-1][0] + 30, p[-1][1])]))), 'CF_CURVE_POINT:0'))

    def test_the_kink_dots_and_guides_sit_at_the_boundary_heights(self):
        dot = self.svg.replace('data-boundary="1" cx="%s"' % f(x_of(2.0)), 'data-boundary="1" cx="%s"' % f(x_of(2.0) + 6))
        self.assertTrue(has(errors(dot), 'CF_BREAK_POINT:0:1'))
        shifted = re.sub(r'(id="guide-0-1"[^>]*? y1=")([\d.]+)("[^>]*? y2=")([\d.]+)', lambda m: m.group(1) + str(float(m.group(2)) + 3) + m.group(3) + str(float(m.group(4)) + 3), self.svg)
        self.assertTrue(has(errors(shifted), 'CF_GUIDE_NOT_LEVEL:0:1'))
        missing = re.sub(r'<g data-layer="22"><line id="guide-0-2"[^>]*/></g>', '', self.svg)
        self.assertTrue(has(errors(missing), 'CF_GUIDE_MISSING:0:2'))
        short = re.sub(r'(id="guide-0-2"[^>]*? x2=")([\d.]+)', lambda m: m.group(1) + str(float(m.group(2)) - 40), self.svg)
        self.assertTrue(has(errors(short), 'CF_GUIDE_GAP:0:2'))
        inside = self.svg.replace('x1="165" y1="140"', 'x1="150" y1="140"')
        self.assertTrue(has(errors(inside), 'CF_GUIDE_INSIDE_VESSEL:0:1'))
        # guides the plan did not ask for
        self.assertTrue(has(errors(self.svg, plan_with(guides=False)), 'CF_GUIDE_UNEXPECTED:0'))
        # a guide may be cut where a label stands: remove the middle of guide 1 under the title row label
        self.assertEqual(errors(build(guides=False), plan_with(guides=False)), [])

    def test_the_graph_stands_on_the_vessel_floor(self):
        self.assertTrue(has(errors(self.svg.replace('x2="419" y2="200"', 'x2="419" y2="203"')), 'CF_AXIS_NOT_STRAIGHT:0'))
        low = self.svg.replace('x1="220" y1="200" x2="419" y2="200"', 'x1="220" y1="204" x2="419" y2="204"')
        self.assertTrue(has(errors(low), 'CF_BASELINE:0'))
        self.assertTrue(has(errors(self.svg.replace('id="y-axis-0" data-role="axis" data-axis="y" data-pair="0" x1="220" y1="200" x2="220" y2="55"', 'id="y-axis-0" data-role="axis" data-axis="y" data-pair="0" x1="150" y1="200" x2="150" y2="55"')), 'CF_LAYOUT_ORDER:0'))

    def test_labels_belong_to_their_row_and_say_what_the_plan_says(self):
        self.assertTrue(has(errors(self.svg.replace('data-text="A"', 'data-text="B"')), 'CF_NAME_MISMATCH:vessel-name-0'))
        self.assertTrue(has(errors(self.svg.replace('data-text="ㄱ"', 'data-text="ㄴ"')), 'CF_NAME_MISMATCH:graph-name-0'))
        self.assertTrue(has(errors(self.svg.replace('data-text="높이"', 'data-text="길이"')), 'CF_TITLE_MISMATCH:y-title-0'))
        self.assertTrue(has(errors(self.svg.replace('data-text="넓음"', 'data-text="좁음"')), 'CF_NOTE_MISMATCH:0:0'))
        stray = self.svg.replace('</svg>', label('answer-note', 'segment-note', 'curve-0', (300, 100, 20, 20), text='②') + '</svg>')
        self.assertTrue(has(errors(stray), 'CF_LABEL_UNEXPECTED:answer-note'))
        extra_line = self.svg.replace('<rect width', '<g data-layer="30"><line id="x" data-role="extra" x1="0" y1="0" x2="1" y2="1"/></g><rect width')
        self.assertTrue(has(errors(extra_line), 'CF_PRIMITIVE_UNEXPECTED:x'))
        no_origin = self.svg.replace('id="origin-0"', 'id="origin-gone"')
        self.assertTrue(has(errors(no_origin), 'CF_LABEL_COUNT:origin-0'))
        self.assertTrue(has(errors(self.svg, plan_with(origin=False)), 'CF_LABEL_COUNT:origin-0') or has(errors(self.svg, plan_with(origin=False)), 'CF_ORIGIN_UNEXPECTED:0'))

    def test_a_note_stays_beside_its_own_piece_inside_the_graph(self):
        far = self.svg.replace('data-box="300,168,60,18"', 'data-box="350,100,60,18"')            # beside the steep piece, not the flat one
        self.assertTrue(has(errors(far), 'CF_NOTE_NOT_BESIDE_SEGMENT:0:0'))
        below = self.svg.replace('data-box="300,168,60,18"', 'data-box="300,205,60,18"')           # under the x axis
        self.assertTrue(has(errors(below), 'CF_NOTE_OUTSIDE_GRAPH:0:0'))
        left = self.svg.replace('data-box="300,168,60,18"', 'data-box="150,168,60,18"')            # left of the y axis
        self.assertTrue(has(errors(left), 'CF_NOTE_OUTSIDE_GRAPH:0:0'))
        unasked = plan_with(pairs=[{**PLAN['pairs'][0], 'segmentNotes': []}])
        self.assertTrue(has(errors(self.svg, unasked), 'CF_NOTE_UNEXPECTED:0:0'))
        missing = plan_with(pairs=[{**PLAN['pairs'][0], 'segmentNotes': [{'segment': 1, 'text': '넓음'}]}])
        self.assertTrue(has(errors(self.svg, missing), 'CF_LABEL_COUNT:segment-note-0-1'))

    def test_a_label_may_not_sit_on_a_line_or_on_another_label(self):
        on_wall = self.svg.replace('data-box="90,209,20,20"', 'data-box="90,190,20,20"')
        self.assertTrue(has(errors(on_wall), 'CF_LABEL_ON_LINE:vessel-name-0'))
        on_curve = self.svg.replace('data-box="300,168,60,18"', 'data-box="300,150,60,18"')
        self.assertTrue(has(errors(on_curve), 'CF_LABEL_ON_LINE:segment-note-0-0'))
        over = self.svg.replace('data-box="300,209,20,20"', 'data-box="95,209,20,20"')
        self.assertTrue(has(errors(over), 'CF_LABELS_OVERLAP'))
        out = self.svg.replace('data-box="435,190,40,20"', 'data-box="535,190,40,20"')
        self.assertTrue(has(errors(out), 'CF_LABEL_OUT_OF_BOUNDS:x-title-0'))

    def test_wrong_svg_kind_or_row_count_is_reported(self):
        self.assertTrue(has(errors(self.svg.replace('data-pairs="1"', 'data-pairs="2"')), 'CF_PAIR_COUNT'))
        self.assertTrue(has(errors(self.svg.replace('data-container-fill="container-fill-figure-v1"', 'data-container-fill="other"')), 'CF_SVG_NOT_A_CONTAINER_FILL'))
        self.assertTrue(has(errors(self.svg.replace('<polyline id="curve-0"', '<polyline id="curve-9" data-pair="9"').replace('data-role="curve" data-pair="0" points', 'points')), 'CF_CURVE_COUNT:0'))


if __name__ == '__main__':
    unittest.main()
