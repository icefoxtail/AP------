"""Independent lattice-path observer. Does not import the producer.

Re-derives the expected figure from the plan alone and checks the final SVG bytes. The number of valid shortest paths through every crossing is found by
brute force: every monotone path from the start to the target is walked one road at a time, the ones that use a forbidden road or miss a required road are
dropped, and the number written at a crossing must equal the number of distinct valid prefixes that end there (a prefix that cannot be completed into a
valid path is not counted). The lattice scale is recovered from the drawn roads themselves (equally spaced distinct x and y values), every road must be
drawn exactly once at its exact position and in the style of its class (plain, broken, bold), the named points and the highlighted path must sit on the
right crossings, and no number may state the final answer when it is hidden.
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET

from container_fill_observer import seg_hits_rect, circle_hits_rect, grow, box_of, num, points_of

NS = '{http://www.w3.org/2000/svg}'
TOL = 0.05
CAPABILITY = 'lattice-path-figure-v1'
PRIM_ROLES = {'road', 'road-forbidden', 'road-via', 'path', 'point'}
ROAD_ROLES = {'road', 'road-forbidden', 'road-via'}
POINT_ID = re.compile("^[A-Z][0-9']?$")


def fail(code):
    raise ValueError(code)


def is_int(v): return isinstance(v, int) and not isinstance(v, bool)


class Plan:
    def __init__(self, lat):
        if not isinstance(lat, dict) or not isinstance(lat.get('grid'), dict): fail('LP_PLAN_INVALID')
        self.cols, self.rows = lat['grid'].get('cols'), lat['grid'].get('rows')
        if not (is_int(self.cols) and is_int(self.rows) and 1 <= self.cols <= 10 and 1 <= self.rows <= 8): fail('LP_PLAN_INVALID')
        pts = lat.get('points') or {}
        if not isinstance(pts, dict): fail('LP_PLAN_INVALID')
        self.points = {}
        for name, xy in pts.items():
            if not POINT_ID.match(name) or not (isinstance(xy, list) and len(xy) == 2 and all(is_int(v) for v in xy)): fail('LP_PLAN_INVALID')
            if not (0 <= xy[0] <= self.cols and 0 <= xy[1] <= self.rows): fail('LP_PLAN_INVALID')
            self.points[name] = (xy[0], xy[1])
        self.forbidden = {self.edge(a, b) for a, b in self.segs(lat.get('forbidden'))}
        self.via = [self.edge(a, b) for a, b in self.segs(lat.get('via'))]
        self.counts = lat.get('counts', False)
        self.hide_target = lat.get('hideTargetCount') is not False
        self.start = self.target = None
        self.total = None
        self.path = [self.ref(r) for r in lat['highlightPath']] if lat.get('highlightPath') is not None else None
        if self.counts is not False or self.via:
            self.start, self.target = self.ref(lat.get('from', 'A')), self.ref(lat.get('to', 'B'))
        self.shown_filter = None if self.counts is True else ({self.ref(r) for r in self.counts} if isinstance(self.counts, list) else set())

    def ref(self, r):
        if isinstance(r, str):
            if r not in self.points: fail('LP_PLAN_INVALID')
            return self.points[r]
        if isinstance(r, list) and len(r) == 2 and all(is_int(v) for v in r): return (r[0], r[1])
        fail('LP_PLAN_INVALID')

    def segs(self, raw):
        return [(self.ref(a), self.ref(b)) for a, b in (raw or [])]

    @staticmethod
    def edge(a, b): return tuple(sorted([a, b]))

    def expected_counts(self):
        """{node: number of distinct valid prefixes ending there}, by walking every monotone path."""
        if self.start is None: return {}
        (sx, sy), (tx, ty) = self.start, self.target
        dx, dy = (tx > sx) - (tx < sx), (ty > sy) - (ty < sy)
        need = frozenset(self.via)
        paths = []
        stack = [(self.start, (self.start,), frozenset())]
        while stack:
            node, path, used = stack.pop()
            if node == self.target:
                if need <= used: paths.append(path)
                continue
            for nxt in ((node[0] + dx, node[1]) if dx and node[0] != tx else None, (node[0], node[1] + dy) if dy and node[1] != ty else None):
                if nxt is None: continue
                e = self.edge(node, nxt)
                if e in self.forbidden: continue
                stack.append((nxt, path + (nxt,), used | ({e} if e in need else frozenset())))
        trie, per_node = {}, {}
        for path in paths:
            parent = 0
            for node in path:
                k = (parent, node)
                if k not in trie:
                    trie[k] = len(trie) + 1
                    per_node[node] = per_node.get(node, 0) + 1
                parent = trie[k]
        self.total = len(paths)
        return per_node

    def shown(self, counts):
        out = {}
        for node, c in counts.items():
            if self.shown_filter is not None and node not in self.shown_filter: continue
            if self.hide_target and node == self.target: continue
            out[node] = c
        return out


def tex_int(tex):
    if not re.fullmatch(r'\d{1,6}', tex or ''): fail('LP_LABEL_TEX_UNREADABLE')
    return int(tex)


def recover_lattice(root, plan, errors):
    """The drawn roads give the scale: cols+1 distinct x values and rows+1 distinct y values, equally spaced, one scale for both."""
    xs, ys = set(), set()
    for e in root.iter(NS + 'line'):
        if e.get('data-role') not in ROAD_ROLES: continue
        x1, y1, x2, y2 = (num(e, a) for a in ('x1', 'y1', 'x2', 'y2'))
        if abs(x1 - x2) > TOL and abs(y1 - y2) > TOL:
            errors.append('LP_ROAD_NOT_AXIS_ALIGNED:' + str(e.get('id'))); continue
        xs.update((round(x1, 2), round(x2, 2))); ys.update((round(y1, 2), round(y2, 2)))

    def collapse(values):
        out = []
        for v in sorted(values):
            if not out or v - out[-1] > TOL: out.append(v)
        return out
    cx, cy = collapse(xs), collapse(ys)
    if len(cx) != plan.cols + 1 or len(cy) != plan.rows + 1:
        errors.append('LP_LATTICE_SHAPE'); return None
    ux, uy = [b - a for a, b in zip(cx, cx[1:])], [b - a for a, b in zip(cy, cy[1:])]
    u = ux[0]
    if u <= 0 or any(abs(v - u) > TOL for v in ux + uy):
        errors.append('LP_LATTICE_NOT_EQUALLY_SPACED'); return None
    return u, cx[0], cy[-1]    # unit, x of column 0, y of row 0 (rows grow upward = y decreases)


def audit(lat, svg):
    plan = Plan(lat)
    expected = plan.expected_counts()
    if plan.start is not None and plan.total == 0: fail('LP_NO_VALID_PATH')
    errors = []
    root = ET.fromstring(svg)
    if root.get('data-lattice-path') != CAPABILITY: errors.append('LP_SVG_NOT_A_LATTICE_PATH')
    if root.get('data-cols') != str(plan.cols) or root.get('data-rows') != str(plan.rows): errors.append('LP_GRID_SIZE')
    geo = recover_lattice(root, plan, errors)
    prims = []
    if geo is not None:
        u, x0, y0 = geo
        px = lambda node: (x0 + node[0] * u, y0 - node[1] * u)
        # roads: every lattice edge exactly once, in the style of its class
        drawn = {}
        for e in root.iter(NS + 'line'):
            if e.get('data-role') not in ROAD_ROLES: continue
            a = ((num(e, 'x1') - x0) / u, (y0 - num(e, 'y1')) / u)
            b = ((num(e, 'x2') - x0) / u, (y0 - num(e, 'y2')) / u)
            ia, ib = (round(a[0]), round(a[1])), (round(b[0]), round(b[1]))
            if max(abs(a[0] - ia[0]), abs(a[1] - ia[1]), abs(b[0] - ib[0]), abs(b[1] - ib[1])) * u > TOL or abs(ia[0] - ib[0]) + abs(ia[1] - ib[1]) != 1:
                errors.append('LP_ROAD_NOT_ON_LATTICE:' + str(e.get('id'))); continue
            k = plan.edge(ia, ib)
            if k in drawn:
                errors.append('LP_ROAD_DUPLICATE:%s' % (k,)); continue
            drawn[k] = e
            prims.append((e.get('id'), 'seg', ((num(e, 'x1'), num(e, 'y1')), (num(e, 'x2'), num(e, 'y2')))))
        widths = {}
        for k, e in drawn.items():
            want = 'road-forbidden' if k in plan.forbidden else 'road-via' if k in plan.via else 'road'
            if e.get('data-role') != want: errors.append('LP_ROAD_STYLE_MISMATCH:%s:%s' % (k, e.get('data-role')))
            if bool(e.get('stroke-dasharray')) != (want == 'road-forbidden'): errors.append('LP_FORBIDDEN_NOT_BROKEN:%s' % (k,))
            try: widths[want] = float(e.get('stroke-width'))
            except (TypeError, ValueError): errors.append('LP_ROAD_WIDTH_MISSING:%s' % (k,))
        if 'road-via' in widths and 'road' in widths and not widths['road-via'] > widths['road'] + 1: errors.append('LP_VIA_NOT_BOLD')
        every = {plan.edge((i, j), (i + 1, j)) for i in range(plan.cols) for j in range(plan.rows + 1)} | {plan.edge((i, j), (i, j + 1)) for i in range(plan.cols + 1) for j in range(plan.rows)}
        for k in sorted(every - set(drawn)): errors.append('LP_ROAD_MISSING:%s' % (k,))
        for k in plan.forbidden | set(plan.via):
            if k not in every: errors.append('LP_SEGMENT_OFF_LATTICE:%s' % (k,))
        # highlighted path
        paths = [e for e in root.iter(NS + 'polyline') if e.get('data-role') == 'path']
        if plan.path is None and paths: errors.append('LP_PATH_UNEXPECTED')
        if plan.path is not None:
            if len(paths) != 1: errors.append('LP_PATH_COUNT')
            else:
                pts = points_of(paths[0])
                if len(pts) != len(plan.path) or any(abs(p[0] - q[0]) > TOL or abs(p[1] - q[1]) > TOL for p, q in zip(pts, map(px, plan.path))): errors.append('LP_PATH_MISMATCH')
                prims.append(('path', 'poly', pts))
        # named points
        circles = {c.get('data-name'): c for c in root.iter(NS + 'circle') if c.get('data-role') == 'point'}
        if set(circles) != set(plan.points): errors.append('LP_POINT_SET_MISMATCH')
        for name, c in circles.items():
            if name in plan.points:
                want = px(plan.points[name])
                if abs(num(c, 'cx') - want[0]) > TOL or abs(num(c, 'cy') - want[1]) > TOL: errors.append('LP_POINT_MISPLACED:' + name)
            prims.append((c.get('id'), 'circle', (num(c, 'cx'), num(c, 'cy'), num(c, 'r'))))
        # labels
        labels = [g for g in root.iter(NS + 'g') if g.get('data-label-role')]
        seen, counts_drawn = set(), {}
        for g in labels:
            role, lid = g.get('data-label-role'), g.get('id')
            if lid in seen: errors.append('LP_LABEL_DUPLICATE:' + str(lid))
            seen.add(lid)
            bx = box_of(g)
            cxm, cym = bx[0] + bx[2] / 2, bx[1] + bx[3] / 2
            if role == 'count':
                try: a, b = (int(v) for v in g.get('data-node').split(','))
                except Exception:
                    errors.append('LP_COUNT_NODE_UNREADABLE:' + str(lid)); continue
                if (a, b) in counts_drawn: errors.append('LP_COUNT_DUPLICATE:%d,%d' % (a, b))
                try: counts_drawn[(a, b)] = tex_int(g.get('data-tex'))
                except ValueError:
                    errors.append('LP_COUNT_TEXT_UNREADABLE:' + str(lid)); continue
                if g.get('data-count') != str(counts_drawn[(a, b)]): errors.append('LP_COUNT_ATTR_MISMATCH:%d,%d' % (a, b))
                nx, ny = px((a, b))
                if math.hypot(cxm - nx, cym - ny) > 0.75 * u: errors.append('LP_COUNT_FAR_FROM_NODE:%d,%d' % (a, b))
            elif role == 'point-name':
                name = g.get('data-name')
                if name not in plan.points or g.get('data-tex') != name:
                    errors.append('LP_NAME_MISMATCH:' + str(lid)); continue
                nx, ny = px(plan.points[name])
                if math.hypot(cxm - nx, cym - ny) > 0.75 * u: errors.append('LP_NAME_FAR_FROM_POINT:' + name)
            else: errors.append('LP_LABEL_UNEXPECTED:' + str(lid))
        if sorted(g.get('data-name') for g in labels if g.get('data-label-role') == 'point-name') != sorted(plan.points): errors.append('LP_NAME_SET_MISMATCH')
        want_shown = plan.shown(expected)
        for node, c in want_shown.items():
            if node not in counts_drawn: errors.append('LP_COUNT_MISSING:%d,%d' % node)
            elif counts_drawn[node] != c: errors.append('LP_COUNT_MISMATCH:%d,%d:%d!=%d' % (node[0], node[1], counts_drawn[node], c))
        for node in counts_drawn:
            if node not in want_shown:
                errors.append(('LP_TARGET_COUNT_SHOWN:%d,%d' if plan.hide_target and node == plan.target else 'LP_COUNT_UNEXPECTED:%d,%d') % node)
        # layout: inside the figure, apart from each other and off every line
        w, h = num(root, 'width'), num(root, 'height')
        safe = float(root.get('data-safe-margin') or 12)
        boxes = [(g, box_of(g)) for g in labels]
        for g, (x, y, bw, bh) in boxes:
            if x < safe or y < safe or x + bw > w - safe or y + bh > h - safe: errors.append('LP_LABEL_OUT_OF_BOUNDS:' + str(g.get('id')))
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                a, b = boxes[i][1], boxes[j][1]
                if a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]: errors.append('LP_LABELS_OVERLAP:%s:%s' % (boxes[i][0].get('id'), boxes[j][0].get('id')))
        for g, box in boxes:
            gb = grow(box, 1.0)
            for pid, kind, geom in prims:
                hit = (kind == 'seg' and seg_hits_rect(geom[0], geom[1], gb)) or (kind == 'poly' and any(seg_hits_rect(geom[i], geom[i + 1], gb) for i in range(len(geom) - 1))) or (kind == 'circle' and circle_hits_rect(geom[0], geom[1], geom[2], gb))
                if hit:
                    errors.append('LP_LABEL_ON_LINE:%s:%s' % (g.get('id'), pid)); break
    for group in root:
        if not (group.tag == NS + 'rect' or group.tag == NS + 'g' and group.get('data-layer') is not None): errors.append('LP_ROOT_CHILD_UNEXPECTED:' + str(group.get('id')))
        if group.tag != NS + 'g' or group.get('data-layer') is None: continue
        for child in group:
            if child.get('data-label-role') is None and child.get('data-role') not in PRIM_ROLES: errors.append('LP_PRIMITIVE_UNEXPECTED:' + str(child.get('id')))
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if errors else 'PASS', 'errors': errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(), 'nodes': len(expected)}
