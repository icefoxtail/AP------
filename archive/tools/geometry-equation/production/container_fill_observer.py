"""Independent container-fill observer. Does not import the producer.

Re-derives everything from the plan's own data with exact fractions (the profile of every vessel, the cumulative heights and the volume below every piece
boundary from the closed form pi*h*(r0^2+r0*r1+r1^2)/3, the time of every tick) and checks the final SVG bytes: the vertical scale is recovered from the drawn
vessel silhouette (its pixel height over the plan's total height), the drawn silhouette is compared with the plan's profile at that scale (equal scale in x and y),
and every vertex of the drawn height-time curve must lie on t(h) = volume(h)/volume(total) of the plan, with the kinks at the piece boundaries, the end at the
top of the vessel, level guides at the right heights, and every label tied to its own row. Nothing the producer states about its own scale is trusted.
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET
from fractions import Fraction

NS = '{http://www.w3.org/2000/svg}'
TOL = 0.03          # a vertex, dot, tick or guide on its exact position (pixels)
CHORD_TOL = 0.35    # largest horizontal gap between a drawn chord and the exact curve
LABEL_TOL = 1.5     # a label centred on its tick
CAPABILITY = 'container-fill-figure-v1'
PRIM_ROLES = {'vessel-fill', 'vessel-wall', 'vessel-sep', 'axis', 'arrow', 'x-tick', 'y-tick', 'curve', 'break-point', 'guide'}


def fail(code):
    raise ValueError(code)


def frac(raw, code):
    if isinstance(raw, bool): fail(code)
    if isinstance(raw, int): return Fraction(raw)
    if not isinstance(raw, str): fail(code)
    m = re.fullmatch(r'(-?)(\d{1,12})(?:\.(\d{1,6}))?', raw)
    if m: return Fraction(('-' if m.group(1) else '') + m.group(2) + ('.' + m.group(3) if m.group(3) else ''))
    m = re.fullmatch(r'(-?\d{1,12})/(\d{1,12})', raw)
    if m and int(m.group(2)) != 0: return Fraction(int(m.group(1)), int(m.group(2)))
    fail(code)


def tex_number(tex):
    """A label's TeX read back as one exact number: an integer, a decimal or a stacked fraction."""
    tex = re.sub(r'^\\displaystyle\s*', '', tex or '').replace(' ', '')
    m = re.fullmatch(r'(-?)(\d+(?:\.\d+)?)', tex)
    if m: return Fraction(('-' if m.group(1) else '') + m.group(2))
    m = re.fullmatch(r'(-?)\\d?frac\{(\d+)\}\{(\d+)\}', tex)
    if m and int(m.group(3)) != 0: return Fraction(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    fail('CF_LABEL_TEX_UNREADABLE')


def num(element, name):
    try: value = float(element.get(name))
    except (TypeError, ValueError): fail('CF_SVG_ATTRIBUTE_INVALID:' + name)
    if not math.isfinite(value): fail('CF_SVG_ATTRIBUTE_INVALID:' + name)
    return value


def points_of(element):
    try:
        pts = [tuple(float(v) for v in item.split(',')) for item in element.get('points').split()]
    except Exception: fail('CF_POINTS_INVALID:' + str(element.get('id')))
    if any(len(p) != 2 or not all(map(math.isfinite, p)) for p in pts): fail('CF_POINTS_INVALID:' + str(element.get('id')))
    return pts


def box_of(label):
    try: x, y, w, h = [float(v) for v in label.get('data-box').split(',')]
    except Exception: fail('CF_LABEL_BOX_MISSING:' + str(label.get('id')))
    return x, y, w, h


def centre(label):
    x, y, w, h = box_of(label)
    return x + w / 2, y + h / 2


def grow(box, m): return box[0] - m, box[1] - m, box[2] + 2 * m, box[3] + 2 * m


def seg_hits_rect(p, q, box):
    """Segment p-q against a rectangle (x, y, w, h), Liang-Barsky."""
    x1, y1 = p
    x2, y2 = q
    bx, by, bw, bh = box
    t0, t1 = 0.0, 1.0
    dx, dy = x2 - x1, y2 - y1
    for pp, qq in ((-dx, x1 - bx), (dx, bx + bw - x1), (-dy, y1 - by), (dy, by + bh - y1)):
        if pp == 0:
            if qq < 0: return False
        else:
            r = qq / pp
            if pp < 0:
                if r > t1: return False
                t0 = max(t0, r)
            else:
                if r < t0: return False
                t1 = min(t1, r)
    return t0 <= t1


def circle_hits_rect(cx, cy, r, box):
    bx, by, bw, bh = box
    return math.hypot(min(max(cx, bx), bx + bw) - cx, min(max(cy, by), by + bh) - cy) <= r


def point_seg_dist(x, y, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    length2 = dx * dx + dy * dy
    t = max(0.0, min(1.0, ((x - a[0]) * dx + (y - a[1]) * dy) / length2)) if length2 else 0.0
    return math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy))


def rect_dist(x, y, box):
    bx, by, bw, bh = box
    return math.hypot(max(bx - x, 0, x - (bx + bw)), max(by - y, 0, y - (by + bh)))


def poly_rect_dist(pts, box):
    """The distance from a polyline to a box: the nearest point of the line, found by walking along it in 2 px steps."""
    best = math.inf
    for i in range(len(pts) - 1):
        (ax, ay), (cx, cy) = pts[i], pts[i + 1]
        steps = max(1, math.ceil(math.hypot(cx - ax, cy - ay) / 2))
        for k in range(steps + 1): best = min(best, rect_dist(ax + (cx - ax) * k / steps, ay + (cy - ay) * k / steps, box))
    return best


def canon(points):
    """A vertex list without repeated or collinear vertices (open or closed alike), for shape comparison."""
    out = []
    for p in points:
        if not out or math.hypot(p[0] - out[-1][0], p[1] - out[-1][1]) > TOL: out.append(p)
    return out


def drop_collinear(points, closed):
    pts = list(points)
    changed = True
    while changed and len(pts) > 2:
        changed = False
        n = len(pts)
        for i in range(n):
            if not closed and i in (0, n - 1): continue
            a, b, c = pts[i - 1], pts[i], pts[(i + 1) % n]
            if point_seg_dist(b[0], b[1], a, c) < 0.02 and (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]) > 0:
                del pts[i]
                changed = True
                break
    return pts


def same_shape(a, b, closed):
    a = drop_collinear(canon(a), closed)
    b = drop_collinear(canon(b), closed)
    if closed and len(a) > 1 and math.hypot(a[0][0] - a[-1][0], a[0][1] - a[-1][1]) <= TOL: a = a[:-1]
    if closed and len(b) > 1 and math.hypot(b[0][0] - b[-1][0], b[0][1] - b[-1][1]) <= TOL: b = b[:-1]
    if len(a) != len(b): return False
    n = len(a)
    close = lambda p, q: math.hypot(p[0] - q[0], p[1] - q[1]) <= TOL * 2
    for seq in (b, b[::-1]):
        shifts = range(n) if closed else (0,)
        for s in shifts:
            if all(close(a[i], seq[(i + s) % n]) for i in range(n)): return True
    return False


class Pair:
    """The exact derivation of one vessel from the plan."""

    def __init__(self, raw):
        if not isinstance(raw, dict) or not isinstance(raw.get('vessel'), dict): fail('CF_PLAN_INVALID')
        profile = raw['vessel'].get('profile')
        if not isinstance(profile, list) or not 1 <= len(profile) <= 4: fail('CF_PLAN_INVALID')
        self.name = raw['vessel'].get('name')
        self.graph_name = raw.get('graphName')
        self.pieces = []
        self.z = [Fraction(0)]
        for pc in profile:
            if not isinstance(pc, dict): fail('CF_PLAN_INVALID')
            if pc.get('kind') == 'CYLINDER': r0 = r1 = frac(pc.get('radius'), 'CF_PLAN_INVALID')
            elif pc.get('kind') == 'FRUSTUM': r0, r1 = frac(pc.get('r0'), 'CF_PLAN_INVALID'), frac(pc.get('r1'), 'CF_PLAN_INVALID')
            else: fail('CF_PLAN_INVALID')
            h = frac(pc.get('height'), 'CF_PLAN_INVALID')
            if h <= 0 or r0 < 0 or r1 <= 0: fail('CF_PLAN_INVALID')
            self.pieces.append((r0, r1, h))
            self.z.append(self.z[-1] + h)
        # volume below each boundary over pi: a frustum of height h holds h (r0^2 + r0 r1 + r1^2) / 3
        self.vol = [Fraction(0)]
        for r0, r1, h in self.pieces: self.vol.append(self.vol[-1] + h * (r0 * r0 + r0 * r1 + r1 * r1) / 3)
        self.height = self.z[-1]
        self.total = self.vol[-1]
        self.flow = frac(raw['flowPi'], 'CF_PLAN_INVALID') if raw.get('flowPi') is not None else None
        self.x_ticks = [frac(v, 'CF_PLAN_INVALID') for v in raw.get('xTicks', [])]
        self.y_ticks = [frac(v, 'CF_PLAN_INVALID') for v in raw.get('yTicks', [])]
        self.notes = {n['segment']: n['text'] for n in raw.get('segmentNotes', [])}
        self.max_radius = max(max(r0, r1) for r0, r1, _ in self.pieces)

    def volume_at(self, h):
        """Volume over pi below height h (a float in the vessel): the cube-difference closed form of the integral of r(z)^2."""
        h = min(max(h, 0.0), float(self.height))
        k = 0
        while k + 1 < len(self.pieces) and h > float(self.z[k + 1]): k += 1
        r0, r1, hh = (float(v) for v in self.pieces[k])
        s = h - float(self.z[k])
        d = r1 - r0
        inside = r0 * r0 * s if d == 0 else hh / (3 * d) * ((r0 + d * s / hh) ** 3 - r0 ** 3)
        return float(self.vol[k]) + inside


class Doc:
    def __init__(self, svg, n):
        self.errors = []
        self.root = ET.fromstring(svg)
        if self.root.get('data-container-fill') != CAPABILITY: self.errors.append('CF_SVG_NOT_A_CONTAINER_FILL')
        if self.root.get('data-pairs') != str(n): self.errors.append('CF_PAIR_COUNT')
        self.labels = [e for e in self.root.iter(NS + 'g') if e.get('data-label-role')]
        self.by_id = {}
        for label in self.labels: self.by_id.setdefault(label.get('id'), []).append(label)
        self.seen = set()
        self.prims = []   # (id, kind, geometry) for the label-versus-line check
        self.width = num(self.root, 'width') if self.root.get('width') else None
        self.height = num(self.root, 'height') if self.root.get('height') else None

    def err(self, code): self.errors.append(code)

    def role(self, tag, role, pair=None):
        return [e for e in self.root.iter(NS + tag) if e.get('data-role') == role and (pair is None or e.get('data-pair') == str(pair))]

    def label(self, label_id, expect=True):
        found = self.by_id.get(label_id, [])
        if len(found) != 1:
            if expect or found: self.err('CF_LABEL_COUNT:' + label_id)
            return None
        self.seen.add(label_id)
        return found[0]


def audit_pair(doc, p, pd, model, n_pairs):
    err = doc.err
    n = len(pd.pieces)
    z = [float(v) for v in pd.z]
    fills = doc.role('polygon', 'vessel-fill', p)
    if len(fills) != 1: err('CF_VESSEL_MISSING:%d' % p); return None
    poly = points_of(fills[0])
    ys = [y for _, y in poly]
    ybot, ytop = max(ys), min(ys)
    sv = (ybot - ytop) / float(pd.height)
    if sv <= 0: err('CF_VESSEL_SCALE:%d' % p); return None
    bottom = [x for x, y in poly if abs(y - ybot) < TOL]
    cx = (min(bottom) + max(bottom)) / 2
    right = []
    for k, (r0, r1, h) in enumerate(pd.pieces):
        right.append((cx + float(r0) * sv, ybot - z[k] * sv))
        right.append((cx + float(r1) * sv, ybot - z[k + 1] * sv))
    right = canon(right)
    left = [(2 * cx - x, y) for x, y in right]
    if not same_shape(poly, left + right[::-1], True): err('CF_VESSEL_SHAPE:%d' % p)
    walls = doc.role('polyline', 'vessel-wall', p)
    if len(walls) != 1: err('CF_VESSEL_WALL_COUNT:%d' % p)
    else:
        wall_pts = points_of(walls[0])
        if not same_shape(wall_pts, left[::-1] + right, False): err('CF_VESSEL_WALL:%d' % p)
        doc.prims.append((walls[0].get('id'), 'poly', wall_pts))
    seps = doc.role('line', 'vessel-sep', p)
    if len(seps) != n - 1: err('CF_VESSEL_SEP_COUNT:%d' % p)
    for i in range(1, n):
        found = [s for s in seps if s.get('data-boundary') == str(i)]
        w = float(min(pd.pieces[i - 1][1], pd.pieces[i][0])) * sv
        y = ybot - z[i] * sv
        if len(found) != 1: err('CF_VESSEL_SEP:%d:%d' % (p, i)); continue
        s = found[0]
        xs = sorted([num(s, 'x1'), num(s, 'x2')])
        if abs(num(s, 'y1') - y) > TOL or abs(num(s, 'y2') - y) > TOL or abs(xs[0] - (cx - w)) > TOL or abs(xs[1] - (cx + w)) > TOL: err('CF_VESSEL_SEP:%d:%d' % (p, i))
        doc.prims.append((s.get('id'), 'seg', ((num(s, 'x1'), num(s, 'y1')), (num(s, 'x2'), num(s, 'y2')))))
    # --- axes of the graph
    xa = [a for a in doc.role('line', 'axis', p) if a.get('data-axis') == 'x']
    ya = [a for a in doc.role('line', 'axis', p) if a.get('data-axis') == 'y']
    if len(xa) != 1 or len(ya) != 1: err('CF_AXIS_COUNT:%d' % p); return None
    xa, ya = xa[0], ya[0]
    gx = num(ya, 'x1')
    if abs(num(ya, 'x2') - gx) > TOL or abs(num(xa, 'y1') - num(xa, 'y2')) > TOL: err('CF_AXIS_NOT_STRAIGHT:%d' % p)
    if abs(num(xa, 'y1') - ybot) > TOL: err('CF_BASELINE:%d' % p)          # the graph stands on the vessel's floor: one vertical scale
    if abs(num(xa, 'x1') - gx) > TOL: err('CF_AXIS_ORIGIN:%d' % p)
    y_tip_end = min(num(ya, 'y1'), num(ya, 'y2'))
    if max(num(ya, 'y1'), num(ya, 'y2')) < ybot - TOL or y_tip_end > ytop - 4: err('CF_AXIS_RANGE:%d' % p)
    if gx < cx + float(pd.max_radius) * sv + 4: err('CF_LAYOUT_ORDER:%d' % p)
    for a in (xa, ya): doc.prims.append((a.get('id'), 'seg', ((num(a, 'x1'), num(a, 'y1')), (num(a, 'x2'), num(a, 'y2')))))
    arrows = doc.role('polygon', 'arrow', p)
    x_tip = y_tip = None
    for a in arrows:
        pts = points_of(a)
        doc.prims.append((a.get('id'), 'closed', pts))
        for x, y in pts:
            if abs(y - ybot) < TOL and x > gx + 20: x_tip = x
            if abs(x - gx) < TOL and y < ytop: y_tip = y
    if len(arrows) != 2 or x_tip is None or y_tip is None: err('CF_ARROWS:%d' % p)
    # --- the curve
    curves = doc.role('polyline', 'curve', p)
    if len(curves) != 1: err('CF_CURVE_COUNT:%d' % p); return None
    v = points_of(curves[0])
    doc.prims.append((curves[0].get('id'), 'poly', v))
    if len(v) < 2: err('CF_CURVE_SHORT:%d' % p); return None
    x_end, y_end = v[-1]
    if abs(v[0][0] - gx) > TOL or abs(v[0][1] - ybot) > TOL: err('CF_CURVE_START:%d' % p)
    if abs(y_end - (ybot - float(pd.height) * sv)) > TOL or x_end <= gx + 10: err('CF_CURVE_END:%d' % p)
    if x_tip is not None and x_end > x_tip - 4: err('CF_CURVE_PAST_ARROW:%d' % p)
    scale = x_end - gx
    total = float(pd.total)

    def x_at(h): return gx + pd.volume_at(h) / total * scale

    bad = 0
    for k, (x, y) in enumerate(v):
        h = (ybot - y) / sv
        if h < -1e-3 or h > float(pd.height) + 1e-3: err('CF_CURVE_OUT_OF_VESSEL:%d:%d' % (p, k)); bad += 1
        elif abs(x - x_at(h)) > TOL: err('CF_CURVE_POINT:%d:%d' % (p, k)); bad += 1
        if bad >= 3: break
    for k in range(1, len(v)):
        if v[k][0] < v[k - 1][0] - 1e-6 or v[k][1] > v[k - 1][1] + 1e-6: err('CF_CURVE_MONOTONE:%d:%d' % (p, k)); break
    for k in range(1, len(v)):
        xm, ym = (v[k][0] + v[k - 1][0]) / 2, (v[k][1] + v[k - 1][1]) / 2
        if abs(x_at((ybot - ym) / sv) - xm) > CHORD_TOL: err('CF_CURVE_CHORD:%d:%d' % (p, k)); break
    # --- kinks, dots
    dots = doc.role('circle', 'break-point', p)
    if len(dots) != n: err('CF_BREAK_COUNT:%d' % p)
    for i in range(1, n + 1):
        ex, ey = gx + float(pd.vol[i]) / total * scale, ybot - z[i] * sv
        if not any(math.hypot(x - ex, y - ey) <= TOL for x, y in v): err('CF_CURVE_KINK:%d:%d' % (p, i))
        found = [d for d in dots if d.get('data-boundary') == str(i)]
        if len(found) != 1 or math.hypot(num(found[0], 'cx') - ex, num(found[0], 'cy') - ey) > TOL: err('CF_BREAK_POINT:%d:%d' % (p, i))
        if i > 1:
            px0 = gx + float(pd.vol[i - 1]) / total * scale
            if ex - px0 < 8 - TOL: err('CF_KINKS_TOO_CLOSE:%d:%d' % (p, i))
    for d in dots: doc.prims.append((d.get('id'), 'circle', (num(d, 'cx'), num(d, 'cy'), num(d, 'r'))))
    # --- numeric ticks only where the plan gives a value
    for role, axis, expected in (('x-tick', 'x', pd.x_ticks), ('y-tick', 'y', pd.y_ticks)):
        ticks = doc.role('line', role, p)
        got = {}
        for t in ticks:
            label = doc.label(t.get('id') + '-label')
            doc.prims.append((t.get('id'), 'seg', ((num(t, 'x1'), num(t, 'y1')), (num(t, 'x2'), num(t, 'y2')))))
            if label is None: continue
            try: value = tex_number(label.get('data-tex'))
            except ValueError as e: err(str(e) + ':' + label.get('id')); continue
            coord = num(t, 'x1') if axis == 'x' else num(t, 'y1')
            if axis == 'x' and (abs(num(t, 'x1') - num(t, 'x2')) > TOL or abs(num(t, 'y1') - ybot) > TOL): err('CF_TICK_NOT_PERPENDICULAR:' + t.get('id'))
            if axis == 'y' and (abs(num(t, 'y1') - num(t, 'y2')) > TOL or abs(num(t, 'x2') - gx) > TOL): err('CF_TICK_NOT_PERPENDICULAR:' + t.get('id'))
            cxl, cyl = centre(label)
            if axis == 'x' and abs(cxl - coord) > LABEL_TOL or axis == 'y' and abs(cyl - coord) > LABEL_TOL + 1: err('CF_TICK_LABEL_NOT_CENTRED:' + label.get('id'))
            lx, ly, lw, lh = box_of(label)
            # the label stands beside its own tick: under the x axis of this row, or left of the y axis of this row
            if axis == 'x' and not ybot + 3 <= ly <= ybot + 22 or axis == 'y' and lx + lw > gx - 3: err('CF_TICK_LABEL_PLACE:' + label.get('id'))
            if value in got: err('CF_TICK_DUPLICATE:' + t.get('id'))
            got[value] = coord
        if set(got) != set(expected): err('CF_%s_TICK_SET:%d' % (axis.upper(), p)); continue
        for value, coord in got.items():
            want = gx + float(value * pd.flow) / total * scale if axis == 'x' else ybot - float(value) * sv
            if abs(coord - want) > TOL: err('CF_%s_TICK_POSITION:%d:%s' % (axis.upper(), p, value))
    # --- guides: level, between the vessel and the kink, cut only where a label stands
    guides = doc.role('line', 'guide', p)
    all_boxes = [box_of(l) for l in doc.labels]
    if not model['guides']:
        if guides: err('CF_GUIDE_UNEXPECTED:%d' % p)
    else:
        for i in range(1, n + 1):
            y = ybot - z[i] * sv
            xe = gx + float(pd.vol[i]) / total * scale
            wall = cx + float(max(pd.pieces[i - 1][1], pd.pieces[i][0] if i < n else 0)) * sv
            parts = []
            for g in [g for g in guides if g.get('data-boundary') == str(i)]:
                if abs(num(g, 'y1') - y) > TOL or abs(num(g, 'y2') - y) > TOL: err('CF_GUIDE_NOT_LEVEL:%d:%d' % (p, i)); continue
                parts.append(tuple(sorted([num(g, 'x1'), num(g, 'x2')])))
            if not parts: err('CF_GUIDE_MISSING:%d:%d' % (p, i)); continue
            parts.sort()
            if parts[0][0] < wall + 1: err('CF_GUIDE_INSIDE_VESSEL:%d:%d' % (p, i))
            if parts[-1][1] > xe + TOL: err('CF_GUIDE_PAST_KINK:%d:%d' % (p, i))
            cur, gaps = wall + 5, []
            for a, b in parts:
                if a > cur + 0.5: gaps.append((cur, a))
                cur = max(cur, b)
            if xe > cur + 0.5: gaps.append((cur, xe))
            for a, b in gaps:
                if a < wall + 5.5 and b <= wall + 12: continue     # the guide starts a few pixels off the wall
                covered = any(bx - 3.5 <= a + 4.5 and bx + bw + 3.5 >= b - 4.5 and by - 3.5 < y < by + bh + 3.5 for bx, by, bw, bh in all_boxes)
                if not covered: err('CF_GUIDE_GAP:%d:%d' % (p, i))
    # --- labels of this row
    yt = doc.label('y-title-%d' % p)
    if yt is not None:
        if yt.get('data-text') != model['yTitle']: err('CF_TITLE_MISMATCH:y-title-%d' % p)
        bx, by, bw, bh = box_of(yt)
        ref = y_tip if y_tip is not None else y_tip_end - 8
        if abs(bx + bw / 2 - gx) > LABEL_TOL or not (ref - 8 <= by + bh <= ref - 1): err('CF_TITLE_PLACE:y-title-%d' % p)
    xt = doc.label('x-title-%d' % p)
    if xt is not None:
        if xt.get('data-text') != model['xTitle']: err('CF_TITLE_MISMATCH:x-title-%d' % p)
        bx, by, bw, bh = box_of(xt)
        if x_tip is None or bx < x_tip + 2 or abs(by + bh / 2 - ybot) > 3: err('CF_TITLE_PLACE:x-title-%d' % p)
    og = doc.label('origin-%d' % p, expect=model['origin'])
    if og is not None:
        if not model['origin']: err('CF_ORIGIN_UNEXPECTED:%d' % p)
        else:
            bx, by, bw, bh = box_of(og)
            if og.get('data-tex') != 'O' or bx + bw > gx or by < ybot: err('CF_ORIGIN:%d' % p)
    vn = doc.label('vessel-name-%d' % p, expect=pd.name is not None)
    if vn is not None:
        bx, by, bw, bh = box_of(vn)
        if pd.name is None or vn.get('data-text') != pd.name: err('CF_NAME_MISMATCH:vessel-name-%d' % p)
        if abs(bx + bw / 2 - cx) > LABEL_TOL or not ybot + 2 <= by <= ybot + 45: err('CF_NAME_PLACE:vessel-name-%d' % p)
    gn = doc.label('graph-name-%d' % p, expect=pd.graph_name is not None)
    if gn is not None:
        bx, by, bw, bh = box_of(gn)
        if pd.graph_name is None or gn.get('data-text') != pd.graph_name: err('CF_NAME_MISMATCH:graph-name-%d' % p)
        if not gx <= bx + bw / 2 <= x_end or not ybot + 2 <= by <= ybot + 45: err('CF_NAME_PLACE:graph-name-%d' % p)
    # segment notes: beside their own piece of the curve, nearer to it than to any other piece
    segments = []
    for k in range(n):
        segments.append([pt for pt in v if -1e-6 <= (ybot - pt[1]) / sv - z[k] and (ybot - pt[1]) / sv <= z[k + 1] + 1e-6])
    for k in range(n):
        label = doc.label('segment-note-%d-%d' % (p, k), expect=k in pd.notes)
        if label is None: continue
        if k not in pd.notes: err('CF_NOTE_UNEXPECTED:%d:%d' % (p, k)); continue
        if label.get('data-text') != pd.notes[k] or label.get('data-segment') != str(k): err('CF_NOTE_MISMATCH:%d:%d' % (p, k))
        nb = box_of(label)
        if nb[0] < gx + 3 or nb[1] + nb[3] > ybot - 3 or nb[1] < ytop - 14: err('CF_NOTE_OUTSIDE_GRAPH:%d:%d' % (p, k))
        d_own = poly_rect_dist(segments[k], nb)
        if d_own > 40 or any(poly_rect_dist(segments[j], nb) < d_own - 0.5 for j in range(n) if j != k): err('CF_NOTE_NOT_BESIDE_SEGMENT:%d:%d' % (p, k))
    return {'scale': sv, 'x_end': x_end}


def audit(container, svg):
    if not isinstance(container, dict) or not isinstance(container.get('pairs'), list) or not 1 <= len(container['pairs']) <= 3: fail('CF_PLAN_INVALID')
    model = {'guides': container.get('guides') is True, 'origin': container.get('origin') is not False,
             'xTitle': container.get('xTitle', '시간'), 'yTitle': container.get('yTitle', '높이')}
    pairs = [Pair(raw) for raw in container['pairs']]
    doc = Doc(svg, len(pairs))
    observed = [audit_pair(doc, p, pd, model, len(pairs)) for p, pd in enumerate(pairs)]
    # nothing else may be drawn: every drawn primitive has a known role and every label is one the plan asked for
    for group in doc.root:
        if not (group.tag == NS + 'rect' or group.tag == NS + 'g' and group.get('data-layer') is not None): doc.err('CF_ROOT_CHILD_UNEXPECTED:' + str(group.get('id')))
        if group.tag != NS + 'g' or group.get('data-layer') is None: continue
        for child in group:
            if child.get('data-label-role') is None and child.get('data-role') not in PRIM_ROLES: doc.err('CF_PRIMITIVE_UNEXPECTED:' + str(child.get('id')))
    for label in doc.labels:
        if label.get('id') not in doc.seen: doc.err('CF_LABEL_UNEXPECTED:' + str(label.get('id')))
    w, h = doc.width, doc.height
    safe = float(doc.root.get('data-safe-margin') or 12)
    boxes = [(label, box_of(label)) for label in doc.labels]
    for label, (x, y, bw, bh) in boxes:
        if w is not None and (x < safe or y < safe or x + bw > w - safe or y + bh > h - safe): doc.err('CF_LABEL_OUT_OF_BOUNDS:' + label.get('id'))
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            a, b = boxes[i][1], boxes[j][1]
            if a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]: doc.err('CF_LABELS_OVERLAP:%s:%s' % (boxes[i][0].get('id'), boxes[j][0].get('id')))
    for label, box in boxes:
        g = grow(box, 1.0)
        for pid, kind, geo in doc.prims:
            hit = False
            if kind == 'seg': hit = seg_hits_rect(geo[0], geo[1], g)
            elif kind == 'poly': hit = any(seg_hits_rect(geo[i], geo[i + 1], g) for i in range(len(geo) - 1))
            elif kind == 'closed': hit = any(seg_hits_rect(geo[i], geo[(i + 1) % len(geo)], g) for i in range(len(geo)))
            elif kind == 'circle': hit = circle_hits_rect(geo[0], geo[1], geo[2], g)
            if hit: doc.err('CF_LABEL_ON_LINE:%s:%s' % (label.get('id'), pid)); break
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if doc.errors else 'PASS', 'errors': doc.errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(),
            'observed': [None if o is None else {'scale': round(o['scale'], 4), 'xEnd': round(o['x_end'], 3)} for o in observed]}
