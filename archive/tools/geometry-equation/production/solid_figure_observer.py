"""Independent solid-figure observer. Does not import the producer.

Re-derives the 3D model from the plan alone (vertices of prisms, pyramids and frusta; radii and heights of round solids; the faces of a net) and
projects it with the declared fixed projection (orthographic, yaw 28 deg, pitch 20 deg). It then checks the FINAL SVG bytes: every edge piece
is solid or dashed according to its own depth test (rays toward the viewer against every face), pieces cover their edge exactly, vertex positions
fit one scale, ellipse centres and axes, tangent silhouette lines, net faces congruent to the solid's faces and joined along equal edges without
overlap, and every name and length label (value read back from its TeX, place beside its owner, clear of every stroke and other label).
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET

NS = '{http://www.w3.org/2000/svg}'
YAW = math.radians(28.0)
PITCH = math.radians(20.0)
POS_TOL = 0.9        # px
NAME = re.compile(r'^[A-Z]$')
LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


# --- vectors and the projection -----------------------------------------------------------------------------------------------------------
def vsub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def vadd(a, b): return (a[0] + b[0], a[1] + b[1], a[2] + b[2])
def vmul(a, k): return (a[0] * k, a[1] * k, a[2] * k)
def vdot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def vcross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def vlen(a): return math.sqrt(vdot(a, a))
def vunit(a):
    l = vlen(a)
    return a if l == 0 else vmul(a, 1.0 / l)


# the viewer sits at yaw toward +x, in front (-y) and above by pitch: n points from the object to the viewer; the screen axes follow from n
VIEW = (math.sin(YAW) * math.cos(PITCH), -math.cos(YAW) * math.cos(PITCH), math.sin(PITCH))
SCREEN_X = (math.cos(YAW), math.sin(YAW), 0.0)
SCREEN_Y = vcross(VIEW, SCREEN_X)   # n x e_x = e_y (right-handed screen)


def project(p):
    """screen units, y up"""
    return (vdot(p, SCREEN_X), vdot(p, SCREEN_Y))


# --- the model from the plan ---------------------------------------------------------------------------------------------------------------
def _letters(start, count): return [LETTERS[start + k] if start + k < 26 else None for k in range(count)]


def _clean_names(list_):
    out = []
    for x in list_:
        if x is None or x == '.': out.append(None)
        elif isinstance(x, str) and NAME.fullmatch(x): out.append(x)
        else: raise ValueError('SOLID_NAMES_INVALID')
    return out


def _poly_names(kind, n, names):
    if names is None:
        return _letters(0, n), ([] if kind == 'PYRAMID' else _letters(n, n)), (LETTERS[n] if kind == 'PYRAMID' else None)
    if isinstance(names, (str, list)):
        lst = _clean_names(list(names))
        need = n + 1 if kind == 'PYRAMID' else 2 * n
        if len(lst) != need: raise ValueError('SOLID_NAMES_INVALID')
        return (lst[:n], [], lst[n]) if kind == 'PYRAMID' else (lst[:n], lst[n:], None)
    base = _letters(0, n) if names.get('base') is None else _clean_names(list(names['base']))
    top = [] if kind == 'PYRAMID' else (_letters(n, n) if names.get('top') is None else _clean_names(list(names['top'])))
    apex = (names.get('apex') or LETTERS[n]) if kind == 'PYRAMID' else None
    return base, top, apex


def base_polygon(base):
    plane = base.get('plane', 'XY')
    kind = base.get('kind')
    if kind == 'RECT':
        w, d = float(base['width']), float(base['depth'])
        pts = [(0.0, 0.0), (w, 0.0), (w, d), (0.0, d)]
    elif kind == 'REGULAR':
        n, side = int(base['n']), float(base['side'])
        R = side / (2 * math.sin(math.pi / n))
        pts = [(R * math.cos(-math.pi / 2 - math.pi / n + 2 * math.pi * k / n), R * math.sin(-math.pi / 2 - math.pi / n + 2 * math.pi * k / n)) for k in range(n)]
    elif kind == 'POLYGON':
        pts = [(float(p[0]), float(p[1])) for p in base['points']]
    else:
        raise ValueError('SOLID_BASE_INVALID')
    return pts, plane


def build_solid(spec):
    kind = spec['kind']
    if kind in ('PRISM', 'PYRAMID', 'FRUSTUM'):
        pts, plane = base_polygon(spec['base'])
        n, h = len(pts), float(spec['height'])
        lift = (lambda p, e=0.0: (p[0], p[1], e)) if plane == 'XY' else (lambda p, e=0.0: (p[0], e, p[1]))
        bottom = [lift(p) for p in pts]
        cx = sum(p[0] for p in pts) / n
        cy = sum(p[1] for p in pts) / n
        if kind == 'PRISM':
            ext = (0.0, 0.0, h) if plane == 'XY' else (0.0, h, 0.0)
            top = [vadd(p, ext) for p in bottom]
        elif kind == 'PYRAMID':
            foot = spec.get('apex') or (cx, cy)
            top = [(float(foot[0]), float(foot[1]), h)]
        else:
            k = float(spec['topScale'])
            fx, fy = spec.get('foot') or (cx, cy)
            top = [(fx + k * (p[0] - fx), fy + k * (p[1] - fy), h) for p in pts]
        bn, tn, an = _poly_names(kind, n, spec.get('names'))
        verts = [(bn[i], bottom[i]) for i in range(n)]
        if kind == 'PYRAMID': verts.append((an, top[0]))
        else: verts += [(tn[i], top[i]) for i in range(n)]
        faces = [list(range(n))]
        if kind == 'PRISM' or kind == 'FRUSTUM':
            faces.append([i + n for i in range(n)])
            faces += [[i, (i + 1) % n, (i + 1) % n + n, i + n] for i in range(n)]
        else:
            faces += [[i, (i + 1) % n, n] for i in range(n)]
        return {'id': spec.get('id'), 'kind': kind, 'cat': 'POLY', 'verts': verts, 'faces': faces, 'height': h}
    if kind in ('CYLINDER', 'CONE', 'CONE_FRUSTUM', 'SPHERE', 'HEMISPHERE'):
        r = float(spec['radius'])
        cone = kind in ('CONE', 'CONE_FRUSTUM')
        orientation = spec.get('orientation', 'APEX_UP')
        if orientation not in ('APEX_UP', 'APEX_DOWN'):
            raise ValueError('SOLID_ORIENTATION_UNSUPPORTED')
        if orientation == 'APEX_DOWN' and not cone:
            raise ValueError('SOLID_ORIENTATION_UNSUPPORTED')
        down = orientation == 'APEX_DOWN'
        if kind == 'SPHERE': h, r0, r1 = 2 * r, r, r
        elif kind == 'HEMISPHERE': h, r0, r1 = r, r, r
        else:
            h = float(spec['height'])
            narrow = {'CYLINDER': r, 'CONE': 0.0, 'CONE_FRUSTUM': float(spec.get('topRadius', 0))}[kind]
            r0, r1 = (narrow, r) if down else (r, narrow)
        names = spec.get('names') or {}
        pts = []
        if kind == 'SPHERE': pts.append((names.get('center'), 'center', (0.0, 0.0, r)))
        elif kind == 'HEMISPHERE': pts.append((names.get('center'), 'center', (0.0, 0.0, 0.0)))
        else:
            pts.append((names.get('center'), 'center', (0.0, 0.0, h if down and kind == 'CONE' else 0.0)))
            if kind == 'CONE': pts.append((names.get('apex'), 'apex', (0.0, 0.0, 0.0 if down else h)))
            else: pts.append((names.get('top'), 'top', (0.0, 0.0, h)))
        return {'id': spec.get('id'), 'kind': kind, 'cat': 'SPHERE' if kind in ('SPHERE', 'HEMISPHERE') else 'REV',
                'r': r, 'r0': r0, 'r1': r1, 'orientation': orientation, 'height': h, 'points': pts,
                'inside': spec.get('inside')}
    raise ValueError('SOLID_KIND_UNSUPPORTED')


def poly_edges(solid):
    seen = set()
    for f in solid['faces']:
        for k in range(len(f)):
            a, b = f[k], f[(k + 1) % len(f)]
            seen.add((min(a, b), max(a, b)))
    return sorted(seen)


def vname(solid, i):
    n = solid['verts'][i][0]
    return n if n else 'v%d' % i


# --- depth test ---------------------------------------------------------------------------------------------------------------------------
def _winding_inside(poly, q):
    """winding number of a planar polygon (2D) around q: non-zero means inside"""
    wn = 0
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if a[1] <= q[1]:
            if b[1] > q[1] and (b[0] - a[0]) * (q[1] - a[1]) - (q[0] - a[0]) * (b[1] - a[1]) > 0: wn += 1
        elif b[1] <= q[1] and (b[0] - a[0]) * (q[1] - a[1]) - (q[0] - a[0]) * (b[1] - a[1]) < 0: wn -= 1
    return wn != 0


def _plane_of(solid, face):
    pts = [solid['verts'][i][1] for i in face]
    n = (0.0, 0.0, 0.0)
    for i in range(len(pts)):
        n = vadd(n, vcross(pts[i], pts[(i + 1) % len(pts)]))
    n = vunit(n)
    # 2D frame inside the plane (so the in-polygon test is done in the plane's own coordinates)
    helper = (1.0, 0.0, 0.0) if abs(n[0]) < 0.9 else (0.0, 1.0, 0.0)
    e1 = vunit(vcross(n, helper))
    e2 = vcross(n, e1)
    flat = [(vdot(vsub(p, pts[0]), e1), vdot(vsub(p, pts[0]), e2)) for p in pts]
    return {'n': n, 'p0': pts[0], 'e1': e1, 'e2': e2, 'flat': flat}


def hidden_by_faces(solid, planes, P, skip):
    for fi, pl in planes.items():
        if fi in skip: continue
        denom = vdot(pl['n'], VIEW)
        if abs(denom) < 1e-9: continue
        t = vdot(pl['n'], vsub(pl['p0'], P)) / denom
        if t <= 1e-7: continue
        H = vadd(P, vmul(VIEW, t))
        d = vsub(H, pl['p0'])
        if _winding_inside(pl['flat'], (vdot(d, pl['e1']), vdot(d, pl['e2']))): return True
    return False


def edge_skip(solid, a, b):
    skip = set()
    for fi, f in enumerate(solid['faces']):
        for k in range(len(f)):
            x, y = f[k], f[(k + 1) % len(f)]
            if (x == a and y == b) or (x == b and y == a): skip.add(fi)
    return skip


def hits_round(solid, P):
    """True when the ray from P toward the viewer enters the solid of revolution / sphere (a point on its surface that the body hides)."""
    V = VIEW
    r0, r1, h = solid['r0'], solid['r1'], solid['height']
    if solid['cat'] == 'SPHERE':
        c = (0.0, 0.0, r0 if solid['kind'] == 'SPHERE' else 0.0)
        d = vsub(P, c)
        b = vdot(d, V)
        cc = vdot(d, d) - r0 * r0
        disc = b * b - cc
        if disc <= 0: return False
        for s in (-b - math.sqrt(disc), -b + math.sqrt(disc)):
            if s > 1e-6:
                Q = vadd(P, vmul(V, s))
                if solid['kind'] == 'SPHERE' or Q[2] >= -1e-9: return True
        return False
    slope = (r1 - r0) / h
    # |P_xy + s V_xy|^2 = (r0 + slope (P_z + s V_z))^2
    px, py, pz = P
    A = V[0] ** 2 + V[1] ** 2 - (slope * V[2]) ** 2
    B = 2 * (px * V[0] + py * V[1]) - 2 * slope * V[2] * (r0 + slope * pz)
    C = px * px + py * py - (r0 + slope * pz) ** 2
    roots = []
    if abs(A) < 1e-12:
        if abs(B) > 1e-12: roots = [-C / B]
    else:
        disc = B * B - 4 * A * C
        if disc >= 0: roots = [(-B - math.sqrt(disc)) / (2 * A), (-B + math.sqrt(disc)) / (2 * A)]
    for s in roots:
        if s > 1e-6:
            z = pz + s * V[2]
            if -1e-9 <= z <= h + 1e-9 and r0 + slope * z >= -1e-9: return True
    return False


# --- SVG helpers ------------------------------------------------------------------------------------------------------------------------------
def _num(el, name):
    try: value = float(el.get(name))
    except (TypeError, ValueError): raise ValueError('SOLID_SVG_ATTRIBUTE_INVALID:' + name) from None
    if not math.isfinite(value): raise ValueError('SOLID_SVG_ATTRIBUTE_INVALID:' + name)
    return value


def _points(text):
    out = []
    for pair in (text or '').split():
        x, y = pair.split(',')
        out.append((float(x), float(y)))
    return out


def _dashed(el):
    return bool(el.get('stroke-dasharray'))


def _parse_arc(d):
    m = re.fullmatch(r'\s*M\s*(\S+)\s+(\S+)\s*A\s*(\S+)\s+(\S+)\s+0\s+(\d)\s+(\d)\s+(\S+)\s+(\S+)\s*', d or '')
    if not m: raise ValueError('SOLID_ARC_UNREADABLE')
    x0, y0, rx, ry, large, sweep, x1, y1 = m.groups()
    return float(x0), float(y0), float(rx), float(ry), int(large), int(sweep), float(x1), float(y1)


def label_number(tex):
    t = re.sub(r'\\,?\\mathrm\{[a-z]+\}', '', tex or '')
    t = t.replace('\\,', '').replace(' ', '')
    m = re.fullmatch(r'(\d+(?:\.\d+)?)', t)
    if m: return float(m.group(1))
    m = re.fullmatch(r'(\d*)\\sqrt\{(\d+)\}', t)
    if m: return (float(m.group(1)) if m.group(1) else 1.0) * math.sqrt(int(m.group(2)))
    m = re.fullmatch(r'\\frac\{(\d+)\}\{(\d+)\}', t)
    if m: return int(m.group(1)) / int(m.group(2))
    m = re.fullmatch(r'(\d*(?:\.\d+)?)\\pi', t)
    if m: return (float(m.group(1)) if m.group(1) else 1.0) * math.pi
    m = re.fullmatch(r'\\frac\{(\d+)\}\{(\d+)\}\\pi', t)
    if m: return int(m.group(1)) / int(m.group(2)) * math.pi
    m = re.fullmatch(r'(\d+(?:\.\d+)?)\^\\circ', t)
    if m: return float(m.group(1))
    return None


def _seg_dist(p, a, b):
    ax, ay, bx, by = a[0], a[1], b[0], b[1]
    dx, dy = bx - ax, by - ay
    l2 = dx * dx + dy * dy
    t = 0.0 if l2 == 0 else max(0.0, min(1.0, ((p[0] - ax) * dx + (p[1] - ay) * dy) / l2))
    return math.hypot(p[0] - (ax + t * dx), p[1] - (ay + t * dy))


def _box_seg_dist(box, a, b):
    """distance from a segment to an axis-aligned box (0 when they touch)"""
    x0, y0, x1, y1 = box[0], box[1], box[0] + box[2], box[1] + box[3]
    if (x0 <= a[0] <= x1 and y0 <= a[1] <= y1) or (x0 <= b[0] <= x1 and y0 <= b[1] <= y1): return 0.0
    edges = [((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), (x0, y1)), ((x0, y1), (x0, y0))]

    def cr(p, q, r): return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    for c, d in edges:
        if cr(a, b, c) * cr(a, b, d) < 0 and cr(c, d, a) * cr(c, d, b) < 0: return 0.0
    best = min(_seg_dist(a, c, d) for c, d in edges)
    best = min(best, min(_seg_dist(c, a, b) for c, _ in edges))
    return best


def _box_dist(a, b):
    dx = max(b[0] - (a[0] + a[2]), a[0] - (b[0] + b[2]), 0.0)
    dy = max(b[1] - (a[1] + a[3]), a[1] - (b[1] + b[3]), 0.0)
    return math.hypot(dx, dy)


def _ellipse_point(cx, cy, rx, ry, u): return (cx + rx * math.cos(u), cy - ry * math.sin(u))


# --- audit ----------------------------------------------------------------------------------------------------------------------------------
def audit(plan, svg):
    errors = []
    final_sha = 'sha256:' + hashlib.sha256(svg.encode('utf-8')).hexdigest()
    try: root = ET.fromstring(svg)
    except ET.ParseError: return {'status': 'FAIL', 'errors': ['SOLID_SVG_UNPARSEABLE'], 'finalSvgSha256': final_sha}
    if root.get('data-solid-figure') != 'solid-figure-v1': errors.append('SOLID_SVG_NOT_A_SOLID_FIGURE')
    unit = plan.get('unit')
    labels = [g for g in root.iter(NS + 'g') if g.get('data-label-role')]
    boxes = {}
    for g in labels:
        match = re.fullmatch(r'translate\(([-\d.e]+) ([-\d.e]+)\)', g.get('transform') or '')
        inner = g.find(NS + 'svg')
        if not match or inner is None:
            errors.append('SOLID_LABEL_GEOMETRY_UNREADABLE:' + str(g.get('id')))
            continue
        boxes[g.get('id')] = (float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height'))
    ctx = {'root': root, 'errors': errors, 'boxes': boxes, 'labels': labels, 'segments': [], 'unit': unit}
    try:
        if plan.get('net') is not None: audit_net(plan, ctx)
        else: audit_solids(plan, ctx)
    except (ValueError, KeyError, TypeError, IndexError, ZeroDivisionError) as error:
        errors.append('SOLID_OBSERVER_INPUT:' + str(error)[:80])
    audit_labels(plan, ctx)
    return {'status': 'FAIL' if errors else 'PASS', 'errors': errors[:40], 'finalSvgSha256': final_sha}


def _stroke_ok(el, expect_dashed, errors, ident):
    if _dashed(el) != expect_dashed: errors.append('SOLID_EDGE_VISIBILITY_MISMATCH:' + ident)
    vis = el.get('data-vis')
    if vis is not None and (vis == 'hidden') != _dashed(el): errors.append('SOLID_VIS_ATTRIBUTE_INCONSISTENT:' + ident)


def audit_solids(plan, ctx):
    root, errors = ctx['root'], ctx['errors']
    solids = [build_solid({**spec, 'id': spec.get('id') or 's%d' % (i + 1)}) for i, spec in enumerate(plan['solids'])]
    ctx['solids'] = solids
    declared = float(root.get('data-scale') or 0)
    if root.get('data-yaw') != '28' or root.get('data-pitch') != '20': errors.append('SOLID_PROJECTION_NOT_DECLARED_FIXED')
    scale = None
    frames = {}   # solid id -> (Tx, Ty): svg = (Tx + S sx, Ty - S sy) with sx, sy of the solid's own local coordinates
    named = {}
    for solid in solids:
        sid = solid['id']
        els = [e for e in root.iter(NS + 'line') if e.get('data-solid') == sid] + [e for e in root.iter(NS + 'path') if e.get('data-solid') == sid]
        if solid['cat'] == 'POLY':
            xs, ys = [], []
            for e in els:
                if e.get('data-role') != 'edge': continue
                xs += [_num(e, 'x1'), _num(e, 'x2')]
                ys += [_num(e, 'y1'), _num(e, 'y2')]
            if not xs:
                errors.append('SOLID_NO_EDGES:' + sid)
                continue
            pv = [project(p) for _, p in solid['verts']]
            mw, mh = max(p[0] for p in pv) - min(p[0] for p in pv), max(p[1] for p in pv) - min(p[1] for p in pv)
            sx = (max(xs) - min(xs)) / mw
            sy = (max(ys) - min(ys)) / mh
            if abs(sx - sy) > 0.01 * max(sx, sy): errors.append('SOLID_PROJECTION_ASPECT_MISMATCH:%s:%.3f:%.3f' % (sid, sx, sy))
            S = sx
            frames[sid] = (min(xs) - S * min(p[0] for p in pv), max(ys) + S * min(p[1] for p in pv))
        else:
            S, T = _round_frame(solid, root, errors)
            if S is None: continue
            frames[sid] = T
        if scale is None: scale = S
        elif abs(scale - S) > 0.012 * scale: errors.append('SOLID_SCALE_DIFFERS_BETWEEN_SOLIDS:' + sid)
    if scale is None: return
    if declared and abs(declared - scale) > 0.012 * scale: errors.append('SOLID_DECLARED_SCALE_MISMATCH')
    ctx['scale'] = scale
    for solid in solids:
        sid = solid['id']
        if sid not in frames: continue
        Tx, Ty = frames[sid]

        def px(p, Tx=Tx, Ty=Ty):
            q = project(p)
            return (Tx + scale * q[0], Ty - scale * q[1])
        if solid['cat'] == 'POLY':
            for i, (name, p) in enumerate(solid['verts']):
                if name: named[name] = (sid, px(p), p)
            check_poly_edges(solid, root, px, scale, errors)
            # the solid's drawn extent, for the overlap check
        else:
            for name, pid, p in solid['points']:
                if name: named[name] = (sid, px(p), p)
            check_round(solid, root, px, scale, errors, ctx['segments'], (plan.get('section') if (plan.get('section') or {}).get('kind') == 'LEVEL' and (plan['section'].get('solid') or next((x['id'] for x in solids if x['cat'] == 'REV'), None)) == solid['id'] else None))
    ctx['named'] = named
    ctx['px'] = {sid: frames[sid] for sid in frames}
    # aux segments, highlights, section
    for el in root.iter(NS + 'line'):
        if el.get('data-role') == 'segment':
            ident = el.get('data-edge') or ''
            a, b = (ident[0], ident[1]) if len(ident) == 2 else (None, None)
            if a not in named or b not in named:
                errors.append('SOLID_SEGMENT_NAME_UNKNOWN:' + ident)
                continue
            for name, (x, y) in ((a, (_num(el, 'x1'), _num(el, 'y1'))), (b, (_num(el, 'x2'), _num(el, 'y2')))):
                if math.hypot(named[name][1][0] - x, named[name][1][1] - y) > POS_TOL: errors.append('SOLID_SEGMENT_ENDPOINT_OFF:' + ident)
            sid = named[a][0]
            style = el.get('data-style')
            if style == 'AUTO':
                solid = next(s for s in solids if s['id'] == sid)
                planes = {i: _plane_of(solid, f) for i, f in enumerate(solid['faces'])}
                A, B = named[a][2], named[b][2]
                hid = sum(1 for t in (0.2, 0.4, 0.6, 0.8) if hidden_by_faces(solid, planes, vadd(A, vmul(vsub(B, A), t)), set())) >= 2
                _stroke_ok(el, hid, errors, 'segment-' + ident)
            else: _stroke_ok(el, style == 'DASHED', errors, 'segment-' + ident)
            ctx['segments'].append(((_num(el, 'x1'), _num(el, 'y1')), (_num(el, 'x2'), _num(el, 'y2'))))
    declared_segments = {s['from'] + s['to'] for s in plan.get('segments') or []}
    drawn_segments = {el.get('data-edge') for el in root.iter(NS + 'line') if el.get('data-role') == 'segment'}
    if declared_segments != drawn_segments: errors.append('SOLID_SEGMENT_SET_MISMATCH')
    highlights = [h['polygon'] for h in plan.get('highlights') or []]
    drawn = {el.get('data-polygon'): el for el in root.iter(NS + 'polygon') if el.get('data-role') == 'highlight-face'}
    if sorted(''.join(h) for h in highlights) != sorted(drawn): errors.append('SOLID_HIGHLIGHT_SET_MISMATCH')
    for h in highlights:
        el = drawn.get(''.join(h))
        if el is None: continue
        pts = _points(el.get('points'))
        if len(pts) != len(h): errors.append('SOLID_HIGHLIGHT_POINTS_MISMATCH:' + ''.join(h)); continue
        for name, q in zip(h, pts):
            if name not in named or math.hypot(named[name][1][0] - q[0], named[name][1][1] - q[1]) > POS_TOL: errors.append('SOLID_HIGHLIGHT_VERTEX_OFF:' + name)
        # planar in 3D: the named vertices must be coplanar
        P = [named[n][2] for n in h if n in named]
        if len(P) >= 4:
            nrm = vunit(vcross(vsub(P[1], P[0]), vsub(P[2], P[0])))
            if any(abs(vdot(nrm, vsub(p, P[0]))) > 1e-6 for p in P): errors.append('SOLID_HIGHLIGHT_NOT_PLANAR')
    # a nested solid must sit exactly on its host's axis
    by_id = {s['id']: s for s in solids}
    for solid in solids:
        if not solid.get('inside'):
            continue
        host = by_id.get(solid['inside'])
        if host is None or solid['id'] not in frames or host['id'] not in frames:
            errors.append('SOLID_NEST_HOST_MISSING:' + solid['id'])
            continue
        if abs(frames[solid['id']][0] - frames[host['id']][0]) > POS_TOL:
            errors.append('SOLID_NEST_AXIS_MISMATCH:' + solid['id'])
        max_inner = solid['r0'] if solid['cat'] == 'SPHERE' else max(solid['r0'], solid['r1'])
        max_host = max(host['r0'], host['r1'])
        if max_inner > max_host + 1e-6 or solid['height'] > host['height'] + 1e-6:
            errors.append('SOLID_NEST_DOES_NOT_FIT:' + solid['id'])
    section = plan.get('section')
    sec_els = [el for el in root.iter(NS + 'polygon') if el.get('data-role') == 'section']
    level_els = [el for el in root.iter(NS + 'ellipse') if el.get('data-role') == 'level-fill']
    liquid_els = [el for el in root.iter(NS + 'polygon') if el.get('data-role') == 'liquid-region']
    axial = section is not None and section.get('kind') == 'AXIAL'
    leveled = section is not None and section.get('kind') == 'LEVEL'
    if axial != bool(sec_els) or leveled != bool(level_els): errors.append('SOLID_SECTION_SET_MISMATCH')
    if section:
        solid = next(s for s in solids if s['id'] == (section.get('solid') or next(x['id'] for x in solids if x['cat'] == 'REV')))
        Tx, Ty = frames[solid['id']]
        z = solid['height']
        if axial and sec_els:
            pts = _points(sec_els[0].get('points'))
            if solid['r0'] == 0.0: exp = [(0.0, 0.0), (solid['r1'], z), (-solid['r1'], z)]
            elif solid['r1'] == 0.0: exp = [(-solid['r0'], 0.0), (solid['r0'], 0.0), (0.0, z)]
            else: exp = [(-solid['r0'], 0.0), (solid['r0'], 0.0), (solid['r1'], z), (-solid['r1'], z)]
            # the axial plane runs along the screen's horizontal: s maps to screen x = s, height z to screen y = z cos(pitch)
            want = [(Tx + scale * s_, Ty - scale * zz * math.cos(PITCH)) for s_, zz in exp]
            if len(pts) != len(want) or any(math.hypot(a[0] - b[0], a[1] - b[1]) > POS_TOL for a, b in zip(pts, want)): errors.append('SOLID_SECTION_POLYGON_MISMATCH')
        if leveled and level_els:
            m = re.fullmatch(r'(\d+)/(\d+)', section.get('at') or '')
            if not m: errors.append('SOLID_SECTION_INVALID')
            else:
                f = int(m.group(1)) / int(m.group(2))
                zl, rl = f * z, solid['r0'] + (solid['r1'] - solid['r0']) * f
                q = project((0.0, 0.0, zl))
                el = level_els[0]
                cx, cy, rx, ry = _num(el, 'cx'), _num(el, 'cy'), _num(el, 'rx'), _num(el, 'ry')
                if abs(cx - (Tx + scale * q[0])) > POS_TOL or abs(cy - (Ty - scale * q[1])) > POS_TOL or abs(rx - scale * rl) > POS_TOL or abs(ry - scale * rl * math.sin(PITCH)) > POS_TOL: errors.append('SOLID_LEVEL_ELLIPSE_MISMATCH')
                want_liquid = solid['orientation'] == 'APEX_DOWN'
                if want_liquid != bool(liquid_els): errors.append('SOLID_LIQUID_REGION_SET_MISMATCH')
                if want_liquid and liquid_els:
                    if liquid_els[0].get('data-solid') != solid['id']: errors.append('SOLID_LIQUID_REGION_SOLID_MISMATCH')
                    want_pts = [(Tx + scale * q[0], Ty - scale * q[1]) for q in _liquid_boundary(solid, zl, rl)]
                    pts = _points(liquid_els[0].get('points'))
                    if len(pts) != len(want_pts) or any(math.hypot(a[0] - b[0], a[1] - b[1]) > POS_TOL for a, b in zip(pts, want_pts)):
                        errors.append('SOLID_LIQUID_REGION_MISMATCH')
    elif liquid_els:
        errors.append('SOLID_LIQUID_REGION_WITHOUT_SECTION')
    audit_marks(plan, solid_named=named, frames=frames, scale=scale, root=root, errors=errors, px_by_id=ctx.get('px'))
    for el in root.iter(NS + 'line'):
        if el.get('data-role') == 'dim-line':
            ctx['segments'].append(((_num(el, 'x1'), _num(el, 'y1')), (_num(el, 'x2'), _num(el, 'y2'))))
    check_dim_lines(plan, ctx)


def check_poly_edges(solid, root, px, scale, errors):
    sid = solid['id']
    pieces = {}
    for e in root.iter(NS + 'line'):
        if e.get('data-role') == 'edge' and e.get('data-solid') == sid:
            pieces.setdefault(e.get('data-edge'), []).append(e)
    planes = {i: _plane_of(solid, f) for i, f in enumerate(solid['faces'])}
    model_edges = poly_edges(solid)
    expected_names = set()
    for a, b in model_edges:
        name = vname(solid, a) + vname(solid, b)
        expected_names.add(name)
        els = pieces.get(name)
        if not els:
            errors.append('SOLID_EDGE_MISSING:' + name)
            continue
        A, B = solid['verts'][a][1], solid['verts'][b][1]
        PA, PB = px(A), px(B)
        L = math.hypot(PB[0] - PA[0], PB[1] - PA[1])
        dirv = ((PB[0] - PA[0]) / L, (PB[1] - PA[1]) / L) if L > 0 else (1.0, 0.0)
        skip = edge_skip(solid, a, b)
        runs = []
        for e in els:
            p0, p1 = (_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))
            t0 = ((p0[0] - PA[0]) * dirv[0] + (p0[1] - PA[1]) * dirv[1]) / L if L else 0.0
            t1 = ((p1[0] - PA[0]) * dirv[0] + (p1[1] - PA[1]) * dirv[1]) / L if L else 0.0
            off = max(abs((p0[0] - PA[0]) * dirv[1] - (p0[1] - PA[1]) * dirv[0]), abs((p1[0] - PA[0]) * dirv[1] - (p1[1] - PA[1]) * dirv[0]))
            if off > POS_TOL: errors.append('SOLID_EDGE_OFF_LINE:' + name)
            lo, hi = min(t0, t1), max(t0, t1)
            runs.append((lo, hi, _dashed(e), e))
            # five interior samples of this piece against the depth test
            hidden_votes = 0
            for k in range(5):
                t = lo + (hi - lo) * (k + 0.5) / 5
                if hidden_by_faces(solid, planes, vadd(A, vmul(vsub(B, A), min(1.0, max(0.0, t)))), skip): hidden_votes += 1
            expect_dashed = hidden_votes >= 3
            if hidden_votes not in (0, 5) and (hi - lo) * L > 1.5: errors.append('SOLID_EDGE_PIECE_STRADDLES_VISIBILITY:' + name)
            _stroke_ok(e, expect_dashed, errors, name)
        runs.sort(key=lambda r: r[0])
        if abs(runs[0][0]) * L > POS_TOL or abs(runs[-1][1] - 1) * L > POS_TOL or any((runs[k + 1][0] - runs[k][1]) * L > POS_TOL or (runs[k][1] - runs[k + 1][0]) * L > POS_TOL for k in range(len(runs) - 1)):
            errors.append('SOLID_EDGE_NOT_COVERED_EXACTLY:' + name)
        # hidden length from a fine independent sampling versus the drawn dashed length
        N = 400
        want_hidden = sum(1 for k in range(N) if hidden_by_faces(solid, planes, vadd(A, vmul(vsub(B, A), (k + 0.5) / N)), skip)) / N * L
        drawn_hidden = sum((r[1] - r[0]) * L for r in runs if r[2])
        if abs(want_hidden - drawn_hidden) > max(2.0, 0.02 * L): errors.append('SOLID_EDGE_BREAK_MISMATCH:%s:%.1f:%.1f' % (name, want_hidden, drawn_hidden))
    extra = set(pieces) - expected_names
    if extra: errors.append('SOLID_EDGE_UNKNOWN:' + ','.join(sorted(extra))[:40])


def _round_frame(solid, root, errors):
    """Scale and translation of a round solid from its own curves: the widest circle's horizontal extreme points give the scale (x extent = 2r),
    its centre gives the translation; every other curve is then checked against that frame."""
    sid = solid['id']
    arcs = [(e, _parse_arc(e.get('d'))) for e in root.iter(NS + 'path') if e.get('data-solid') == sid]
    if solid['cat'] == 'SPHERE':
        outline = [a for e, a in arcs if e.get('data-role') == 'sphere-outline']
        if not outline:
            errors.append('SOLID_NO_CURVES:' + sid)
            return None, None
        xs = [v for a in outline for v in (a[0], a[6])]
        S = (max(xs) - min(xs)) / (2 * solid['r0'])
        cx, cy = (max(xs) + min(xs)) / 2, outline[0][1]
        q = project((0.0, 0.0, solid['r0'] if solid['kind'] == 'SPHERE' else 0.0))
        return S, (cx - S * q[0], cy + S * q[1])
    places = {'bottom': (0.0, solid['r0']), 'top': (solid['height'], solid['r1']), 'equator': (solid['r0'], solid['r0'])}
    fronts = []
    for e, a in arcs:
        name = e.get('data-circle')
        if e.get('data-half') != 'FRONT' or name not in places:
            continue
        z, rad = places[name]
        if rad > 0:
            fronts.append((a, z, rad))
    if not fronts:
        errors.append('SOLID_BASE_ARC_MISSING:' + sid)
        return None, None
    a, zc, rad = max(fronts, key=lambda item: item[0][2])
    x0, y0, rx, ry, large, sweep, x1, y1 = a
    S = rx / rad
    # the front arc's endpoints are the ellipse's horizontal extremes (or symmetric about the vertical axis): their mean is the centre x
    cx = (x0 + x1) / 2
    dy = ry * math.sqrt(max(0.0, 1 - min(1.0, ((x0 - cx) / rx) ** 2))) if rx else 0.0
    cy = y0 + dy
    q = project((0.0, 0.0, zc))
    return S, (cx - S * q[0], cy + S * q[1])


def check_round(solid, root, px, scale, errors, segments, section=None):
    sid = solid['id']
    arcs = [(e, _parse_arc(e.get('d'))) for e in root.iter(NS + 'path') if e.get('data-solid') == sid]
    lines = [e for e in root.iter(NS + 'line') if e.get('data-solid') == sid and e.get('data-role') == 'silhouette']
    sinp = math.sin(PITCH)
    r0, r1, h = solid['r0'], solid['r1'], solid['height']

    level = None
    if section is not None:
        m = re.fullmatch(r'(\d+)/(\d+)', section.get('at') or '')
        f = int(m.group(1)) / int(m.group(2))
        level = (f * h, r0 + (r1 - r0) * f)

    def circle(name):
        if name == 'level': return px((0.0, 0.0, level[0])), level[1]
        if name == 'bottom': return px((0.0, 0.0, 0.0)), r0
        if name == 'top': return px((0.0, 0.0, h)), r1
        return px((0.0, 0.0, r0)), r0   # sphere equator
    pts_by_circle = {}
    for e, (x0, y0, rx, ry, large, sweep, x1, y1) in arcs:
        role = e.get('data-role')
        if role == 'sphere-outline':
            c = px((0.0, 0.0, r0 if solid['kind'] == 'SPHERE' else 0.0))
            if abs(rx - scale * r0) > POS_TOL or abs(ry - scale * r0) > POS_TOL: errors.append('SOLID_SPHERE_OUTLINE_RADIUS:' + sid)
            for (x, y) in ((x0, y0), (x1, y1)):
                if abs(math.hypot(x - c[0], y - c[1]) - scale * r0) > POS_TOL: errors.append('SOLID_SPHERE_OUTLINE_OFF:' + sid)
            upper = e.get('data-part') == 'UPPER'
            for k in range(24):
                t0, t1 = math.pi * k / 24 + (0 if upper else math.pi), math.pi * (k + 1) / 24 + (0 if upper else math.pi)
                segments.append(((c[0] + scale * r0 * math.cos(t0), c[1] - scale * r0 * math.sin(t0)), (c[0] + scale * r0 * math.cos(t1), c[1] - scale * r0 * math.sin(t1))))
            _stroke_ok(e, False, errors, e.get('id'))
            continue
        cname = e.get('data-circle')
        if cname not in ('bottom', 'top', 'level', 'equator'):
            errors.append('SOLID_ELLIPSE_ROLE_UNKNOWN:' + str(cname))
            continue
        (cx, cy), rad = circle(cname)
        if abs(rx - scale * rad) > POS_TOL or abs(ry - scale * rad * sinp) > POS_TOL: errors.append('SOLID_ELLIPSE_AXES_MISMATCH:%s:%s' % (sid, cname))
        for (x, y) in ((x0, y0), (x1, y1)):
            f = ((x - cx) / (scale * rad)) ** 2 + ((y - cy) / (scale * rad * sinp)) ** 2
            if abs(f - 1) > 0.02: errors.append('SOLID_ELLIPSE_ENDPOINT_OFF:%s:%s' % (sid, cname))
        # param u of the arc (y up in the observer's frame), the span from the endpoints and the sweep flag
        u0 = math.atan2(-(y0 - cy) / (scale * rad * sinp), (x0 - cx) / (scale * rad))
        u1 = math.atan2(-(y1 - cy) / (scale * rad * sinp), (x1 - cx) / (scale * rad))
        span = (u1 - u0) % (2 * math.pi)
        if sweep != 0: span = -((u0 - u1) % (2 * math.pi))
        if abs(abs(span) - math.pi) > 1e-3 and (abs(span) > math.pi) != bool(large): errors.append('SOLID_ARC_FLAGS_INCONSISTENT:' + e.get('id'))
        for k in range(25):
            u = u0 + span * k / 24
            segments.append(((cx + scale * rad * math.cos(u), cy - scale * rad * sinp * math.sin(u)), (cx + scale * rad * math.cos(u + span / 24), cy - scale * rad * sinp * math.sin(u + span / 24))))
        if cname == 'level':
            if level is None: errors.append('SOLID_LEVEL_ARC_WITHOUT_SECTION')
            _stroke_ok(e, False, errors, e.get('id'))
            pts_by_circle.setdefault(cname, []).append(((x0, y0), (x1, y1)))
            continue
        votes = 0
        z = h if cname == 'top' else (level[0] if cname == 'level' else (r0 if cname == 'equator' else 0.0))
        for k in range(7):
            u = u0 + span * (k + 0.5) / 7
            # screen param u -> world circle point: sx = r cos u, sy = r sin(pitch) sin u + z cos(pitch); the circle point with that screen image
            t = u + YAW
            P = (rad * math.cos(t), rad * math.sin(t), z)
            if hits_round(solid, P): votes += 1
        _stroke_ok(e, votes >= 4, errors, e.get('id'))
        if votes not in (0, 7): errors.append('SOLID_ARC_STRADDLES_VISIBILITY:' + e.get('id'))
        pts_by_circle.setdefault(cname, []).append(((x0, y0), (x1, y1)))
    if solid['cat'] == 'SPHERE':
        if solid['kind'] == 'HEMISPHERE' and not any(e.get('data-circle') == 'bottom' for e, _ in arcs): errors.append('SOLID_BASE_ARC_MISSING:' + sid)
        return
    # silhouette lines: tangent to the circles they end on, through the (virtual) apex of the cone
    family = {name for name in ('bottom', 'top') if circle(name)[1] > 0}
    if len(lines) != 2: errors.append('SOLID_SILHOUETTE_COUNT:' + sid)
    names = family | ({'level'} if level else set())
    if set(pts_by_circle) != names: errors.append('SOLID_ELLIPSE_SET_MISMATCH:' + sid)
    apex_z = 0.0 if (solid['kind'] == 'CONE' and solid['orientation'] == 'APEX_DOWN') else h
    apex = px((0.0, 0.0, apex_z))
    for e in lines:
        a, b = (_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))
        for cname in ('bottom', 'top'):
            (cx, cy), rad = circle(cname)
            if rad <= 0: continue
            rx, ry = scale * rad, scale * rad * sinp
            for q in (a, b):
                f = ((q[0] - cx) / rx) ** 2 + ((q[1] - cy) / ry) ** 2
                if abs(f - 1) < 0.03:
                    # tangency: the line direction is orthogonal to the ellipse gradient at q
                    gx, gy = (q[0] - cx) / rx ** 2, (q[1] - cy) / ry ** 2
                    dx, dy = b[0] - a[0], b[1] - a[1]
                    if abs(dx * gx + dy * gy) / (math.hypot(dx, dy) * math.hypot(gx, gy)) > 0.03: errors.append('SOLID_SILHOUETTE_NOT_TANGENT:%s:%s' % (sid, cname))
        if solid['kind'] == 'CONE':
            if min(math.hypot(a[0] - apex[0], a[1] - apex[1]), math.hypot(b[0] - apex[0], b[1] - apex[1])) > POS_TOL: errors.append('SOLID_SILHOUETTE_MISSES_APEX:' + sid)
        elif solid['kind'] == 'CONE_FRUSTUM':
            # both ends sit on the two ellipses
            ends_on = []
            for q in (a, b):
                for cname in ('bottom', 'top'):
                    (cx, cy), rad = circle(cname)
                    f = ((q[0] - cx) / (scale * rad)) ** 2 + ((q[1] - cy) / (scale * rad * sinp)) ** 2
                    if abs(f - 1) < 0.03: ends_on.append(cname)
            if sorted(ends_on) != ['bottom', 'top']: errors.append('SOLID_SILHOUETTE_ENDS_NOT_ON_ELLIPSES:' + sid)
        if solid['kind'] == 'CYLINDER' and abs(a[0] - b[0]) > POS_TOL: errors.append('SOLID_CYLINDER_SIDE_NOT_VERTICAL')


LIQUID_SAMPLES = 28


def _apex_z(solid):
    r0, r1, h = solid['r0'], solid['r1'], solid['height']
    return 0.0 if r1 == r0 else -r0 * h / (r1 - r0)


def _tangent_params(e, apex):
    d = apex[1] - e[1]
    if abs(d) <= e[3] + 1e-9:
        raise ValueError('SOLID_LEVEL_APEX_HIDDEN')
    s = e[3] / d
    cu = math.sqrt(max(0.0, 1 - s * s))
    u_r, u_l = math.atan2(s, cu), math.atan2(s, -cu)

    def at(u): return (e[0] + e[2] * math.cos(u), e[1] + e[3] * math.sin(u))
    return {'right': at(u_r), 'left': at(u_l), 'at': at, 'uR': u_r, 'uL': u_l}


def _liquid_boundary(solid, z, rl):
    """The projected outline of the liquid below the level (screen units, offset-free)."""
    h, r0 = solid['height'], solid['r0']
    a = project((0.0, 0.0, _apex_z(solid)))
    apex = (a[0], a[1])

    def ell(rad, zz):
        c = project((0.0, 0.0, zz))
        return (c[0], c[1], rad, rad * math.sin(PITCH))
    lv = _tangent_params(ell(rl, z), apex)
    far = [lv['at'](lv['uR'] + (lv['uL'] + 2 * math.pi - lv['uR']) * k / LIQUID_SAMPLES) for k in range(LIQUID_SAMPLES + 1)]
    if r0 == 0.0:
        return [apex] + far
    bv = _tangent_params(ell(r0, 0.0), apex)
    near = [bv['at'](bv['uL'] + 2 * math.pi + (bv['uR'] - bv['uL']) * k / LIQUID_SAMPLES) for k in range(LIQUID_SAMPLES + 1)]
    return near + far


def _dist_point_seg(p, a, b):
    return _seg_dist(p, a, b)


def _parallel(u, v):
    return abs(u[0] * v[1] - u[1] * v[0]) <= 1e-6 * max(1.0, math.hypot(*u) * math.hypot(*v))


def audit_marks(plan, solid_named, frames, scale, root, errors, px_by_id):
    marks = plan.get('marks') or {}
    named = solid_named or {}
    right = {(m.get('id') or 'ra%d' % (k + 1)): m for k, m in enumerate(marks.get('rightAngles') or [])}
    equal = {}
    for k, g in enumerate(marks.get('equalLengths') or []):
        segs = []
        for pair in g.get('segments') or []:
            segs.append(list(pair) if isinstance(pair, (list, tuple)) else [pair[0], pair[1]])
        equal[g.get('id') or 'eq%d' % (k + 1)] = {**g, 'segments': segs}
    angles = {(m.get('id') or 'an%d' % (k + 1)): m for k, m in enumerate(marks.get('angles') or [])}
    drawn_right, drawn_equal, drawn_angles = set(), {}, {}
    for el in root.iter(NS + 'polyline'):
        role = el.get('data-role')
        if role == 'right-angle-mark':
            mid = el.get('data-mark')
            drawn_right.add(mid)
            pts = _points(el.get('points'))
            if len(pts) != 3 or mid not in right:
                errors.append('SOLID_RIGHT_ANGLE_MARK_UNKNOWN:' + str(mid))
                continue
            m = right[mid]
            if el.get('data-at') != m['at'] or el.get('data-refs') != ''.join(m['refs']):
                errors.append('SOLID_RIGHT_ANGLE_MARK_OWNER:' + mid)
                continue
            V, A, B = named[m['at']][2], named[m['refs'][0]][2], named[m['refs'][1]][2]
            e1, e2 = vunit(vsub(A, V)), vunit(vsub(B, V))
            if abs(vdot(e1, e2)) > 1e-6:
                errors.append('SOLID_RIGHT_ANGLE_NOT_PERPENDICULAR:' + mid)
                continue
            pv = named[m['at']][1]
            p0, p1, p2 = pts
            # the corner is the sum of the two legs
            if math.hypot(p1[0] - (p0[0] + p2[0] - pv[0]), p1[1] - (p0[1] + p2[1] - pv[1])) > POS_TOL:
                errors.append('SOLID_RIGHT_ANGLE_CORNER:' + mid)
            # each leg lies along (and on the correct side of) the projected ray
            for leg, vec in ((p0, e1), (p2, e2)):
                d = (leg[0] - pv[0], leg[1] - pv[1])
                q = project(V)
                q1 = project(vadd(V, vec))
                ray = ((q1[0] - q[0]) * scale, -(q1[1] - q[1]) * scale)
                if d[0] * ray[0] + d[1] * ray[1] <= 0 or not _parallel(d, ray):
                    errors.append('SOLID_RIGHT_ANGLE_RAY_MISMATCH:' + mid)
            q1 = project(vadd(V, e1))
            q2 = project(vadd(V, e2))
            s1 = max(1e-9, scale * math.hypot(q1[0] - project(V)[0], q1[1] - project(V)[1]))
            s2 = max(1e-9, scale * math.hypot(q2[0] - project(V)[0], q2[1] - project(V)[1]))
            l0, l1 = math.hypot(p0[0] - pv[0], p0[1] - pv[1]), math.hypot(p2[0] - pv[0], p2[1] - pv[1])
            if abs(l0 / s1 - l1 / s2) > 0.05 * max(1.0, l0 / s1) or l0 < 3.0:
                errors.append('SOLID_RIGHT_ANGLE_SIZE:' + mid)
        elif role == 'angle-mark':
            mid = el.get('data-mark')
            idx = int(el.get('data-mark-index') or 0)
            drawn_angles.setdefault(mid, []).append((idx, int(el.get('data-mark-count') or 0), _points(el.get('points'))))
    for mid in right:
        if mid not in drawn_right:
            errors.append('SOLID_RIGHT_ANGLE_MARK_MISSING:' + mid)
    for mid, rings in drawn_angles.items():
        if mid not in angles:
            errors.append('SOLID_ANGLE_MARK_UNKNOWN:' + str(mid))
            continue
        m = angles[mid]
        if len(rings) != m.get('arcs', 1) or any(c != m.get('arcs', 1) for _, c, _ in rings):
            errors.append('SOLID_ANGLE_MARK_COUNT:' + mid)
            continue
        A, V, B = named[m['refs'][0]][2], named[m['refs'][1]][2], named[m['refs'][2]][2]
        e1, e2 = vunit(vsub(A, V)), vunit(vsub(B, V))
        theta = math.acos(max(-1.0, min(1.0, vdot(e1, e2))))
        if abs(math.degrees(theta) - m.get('value', math.degrees(theta))) > 0.5:
            errors.append('SOLID_ANGLE_MARK_VALUE:' + mid)
        w = vunit(vsub(e2, vmul(e1, vdot(e1, e2))))
        pv = named[m['refs'][1]][1]
        for idx, _, pts in rings:
            if len(pts) < 3:
                errors.append('SOLID_ANGLE_MARK_GEOMETRY:' + mid)
                continue
            # the three ends: first/last on the rays, all points the same 3D radius from the vertex
            for q, vec in ((pts[0], e1), (pts[-1], e2)):
                d = (q[0] - pv[0], q[1] - pv[1])
                rq = project(vadd(V, vec))
                ray = ((rq[0] - project(V)[0]) * scale, -(rq[1] - project(V)[1]) * scale)
                if d[0] * ray[0] + d[1] * ray[1] <= 0 or not _parallel(d, ray):
                    errors.append('SOLID_ANGLE_MARK_ENDPOINT:' + mid)
            k_world = None
            for stage in range(24):
                t = theta * stage / 24
                q = project(vadd(V, vmul(vadd(vmul(e1, math.cos(t)), vmul(w, math.sin(t))), 1.0)))
                if stage == 0:
                    k_world = math.hypot(pts[0][0] - pv[0], pts[0][1] - pv[1]) / max(1e-9, scale * math.hypot(q[0] - project(V)[0], q[1] - project(V)[1]))
            for stage in range(24):
                t = theta * stage / 24
                q = project(vadd(V, vmul(vadd(vmul(e1, math.cos(t)), vmul(w, math.sin(t))), k_world)))
                qv = project(V)
                want = (pv[0] + scale * (q[0] - qv[0]), pv[1] - scale * (q[1] - qv[1]))
                if math.hypot(want[0] - pts[stage][0], want[1] - pts[stage][1]) > POS_TOL:
                    errors.append('SOLID_ANGLE_MARK_GEOMETRY:' + mid)
                    break
    for mid in angles:
        if mid not in drawn_angles:
            errors.append('SOLID_ANGLE_MARK_MISSING:' + mid)
    # equal-length ticks: two short strokes perpendicular to the projected segment at its middle
    groups = {}
    for el in root.iter(NS + 'line'):
        if el.get('data-role') != 'equal-mark':
            continue
        mid = el.get('data-mark')
        edge = el.get('data-edge') or ''
        idx = int(el.get('data-mark-index') or 0)
        cnt = int(el.get('data-mark-count') or 0)
        groups.setdefault((mid, edge), []).append((idx, cnt, el))
        if mid not in equal:
            errors.append('SOLID_EQUAL_MARK_UNKNOWN:' + str(mid))
            continue
        g = equal[mid]
        a, b = edge[0], edge[1]
        if a not in named or b not in named or [a, b] not in g['segments'] and [b, a] not in g['segments']:
            errors.append('SOLID_EQUAL_MARK_SEGMENT:' + mid)
            continue
        La = vlen(vsub(named[a][2], named[b][2]))
        ref = vlen(vsub(named[g['segments'][0][0]][2], named[g['segments'][0][1]][2]))
        if abs(La - ref) > 1e-6 * max(1.0, ref):
            errors.append('SOLID_EQUAL_MARK_LENGTH:' + mid + ':' + edge)
        p, q = (_num(el, 'x1'), _num(el, 'y1')), (_num(el, 'x2'), _num(el, 'y2'))
        pa, pb = named[a][1], named[b][1]
        dx, dy = pb[0] - pa[0], pb[1] - pa[1]
        L = math.hypot(dx, dy)
        if L <= 0:
            errors.append('SOLID_EQUAL_MARK_SEGMENT:' + mid)
            continue
        tx, ty = p[0] - q[0], p[1] - q[1]
        if abs(tx * dx + ty * dy) > 1e-3 * max(1.0, math.hypot(tx, ty) * L):
            errors.append('SOLID_EQUAL_MARK_NOT_PERPENDICULAR:' + mid)
        if abs(math.hypot(tx, ty) - 11.0) > POS_TOL:
            errors.append('SOLID_EQUAL_MARK_SIZE:' + mid)
        mid_seg = ((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2)
        c = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        if math.hypot(c[0] - mid_seg[0], c[1] - mid_seg[1]) > POS_TOL:
            errors.append('SOLID_EQUAL_MARK_NOT_AT_MIDDLE:' + mid)
    for (mid, edge), items in groups.items():
        if mid not in equal:
            continue
        count = equal[mid].get('count', 1)
        idxs = sorted(i for i, _, _ in items)
        if idxs != list(range(1, count + 1)) or any(c != count for _, c, _ in items):
            errors.append('SOLID_EQUAL_MARK_COUNT:' + mid)
    for mid, g in equal.items():
        for a, b in g['segments']:
            if (mid, a + b) not in groups and (mid, b + a) not in groups:
                errors.append('SOLID_EQUAL_MARK_MISSING:%s:%s%s' % (mid, a, b))


def check_dim_lines(plan, ctx):
    """The level, level-radius and round height dimension lines run along the model's axis and the level circle."""
    root, frames, scale = ctx.get('root'), ctx.get('px') or {}, ctx.get('scale')
    if root is None or scale is None:
        return
    solids = {s['id']: s for s in (ctx.get('solids') or [])}
    section = plan.get('section') or {}
    dims = plan.get('dims') or []
    for el in root.iter(NS + 'line'):
        if el.get('data-role') != 'dim-line':
            continue
        kind = el.get('data-kind')
        dim = el.get('data-dim') or ''
        m = re.fullmatch(r'dim-(\d+)', dim)
        if kind not in ('LEVEL', 'RADIUS', 'HEIGHT') or not m:
            continue
        k = int(m.group(1)) - 1
        if k < 0 or k >= len(dims):
            continue
        d = dims[k]
        sid = d.get('solid')
        if sid is None:
            if kind == 'LEVEL': sid = section.get('solid')
            if sid is None:
                sid = next((x['id'] for x in solids.values() if x['cat'] == 'REV'), None)
        solid = solids.get(sid)
        if solid is None or solid['cat'] == 'POLY' or sid not in frames:
            continue
        Tx, Ty = frames[sid]
        cos_p = math.cos(PITCH)
        y_of = lambda z: Ty - scale * z * cos_p
        if kind == 'HEIGHT':
            want = ((Tx, y_of(0.0)), (Tx, y_of(solid['height'])))
        elif kind == 'LEVEL':
            mm = re.fullmatch(r'(\d+)/(\d+)', section.get('at') or '')
            if not mm:
                continue
            zl = int(mm.group(1)) / int(mm.group(2)) * solid['height']
            # level:"top" dimensions the part above the plane (apex/top down to the section)
            want = ((Tx, y_of(zl)), (Tx, y_of(solid['height']))) if d.get('level') == 'top' else ((Tx, y_of(0.0)), (Tx, y_of(zl)))
        else:
            if d.get('radius') != 'level':
                continue
            mm = re.fullmatch(r'(\d+)/(\d+)', section.get('at') or '')
            if not mm:
                continue
            f = int(mm.group(1)) / int(mm.group(2))
            zl = f * solid['height']
            rl = solid['r0'] + (solid['r1'] - solid['r0']) * f
            want = ((Tx, y_of(zl)), (Tx + scale * rl, y_of(zl)))
        got = ((_num(el, 'x1'), _num(el, 'y1')), (_num(el, 'x2'), _num(el, 'y2')))
        if any(math.hypot(got[i][0] - want[i][0], got[i][1] - want[i][1]) > POS_TOL for i in (0, 1)):
            ctx['errors'].append('SOLID_DIM_LINE_MISMATCH:' + dim + ':' + str(kind))


# --- labels --------------------------------------------------------------------------------------------------------------------------------
def audit_labels(plan, ctx):
    errors, boxes, root = ctx['errors'], ctx['boxes'], ctx['root']
    segs = [(a, b, None) for a, b in (ctx.get('segments') or [])]
    # every stroke on the figure is an obstacle for labels (a label's own leader line touches it by design)
    for e in root.iter(NS + 'line'):
        segs.append((((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2')))[0], ((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2')))[1], e.get('data-label') if e.get('data-role') == 'leader' else None))
    for e in root.iter(NS + 'polyline'):
        pts = _points(e.get('points'))
        for i in range(len(pts) - 1):
            segs.append((pts[i], pts[i + 1], None))
    for e in root.iter(NS + 'path'):
        if e.get('d') and e.get('data-role') in ('ellipse-arc', 'sphere-outline'):
            x0, y0, rx, ry, large, sweep, x1, y1 = _parse_arc(e.get('d'))
            # centre from the two endpoints and the radii (axis-aligned ellipse arcs between param extremes): sample by the declared role
            cx = (x0 + x1) / 2
            for cy in [y0 + (ry * math.sqrt(max(0.0, 1 - ((x0 - cx) / rx) ** 2)) if rx else 0), y0 - (ry * math.sqrt(max(0.0, 1 - ((x0 - cx) / rx) ** 2)) if rx else 0)]:
                pass
    named = ctx.get('named') or {}
    mode_net = plan.get('net') is not None
    dims = []
    if not mode_net: dims = ctx.get('dims') or []
    label_els = {g.get('id'): g for g in ctx['labels']}
    expected_dims = expected_dim_values(plan, ctx)
    seen_dims = set()
    placed = []
    for lid, g in label_els.items():
        box = boxes.get(lid)
        if box is None: continue
        role = g.get('data-label-role')
        for other_id, other in placed:
            if _box_dist(box, other) < 1.0: errors.append('SOLID_LABELS_OVERLAP:%s,%s' % (lid, other_id))
        placed.append((lid, box))
        for a, b, owner in segs:
            if owner == lid: continue
            if _box_seg_dist(box, a, b) < 0.8:
                errors.append('SOLID_LABEL_ON_STROKE:' + lid)
                break
        if role == 'vertex-name':
            value = g.get('data-value')
            anchor = None
            if mode_net:
                anchor = ctx.get('corner_px', {}).get((g.get('data-face'), int(g.get('data-corner') or -1)))
                want = ctx.get('corner_name', {}).get((g.get('data-face'), int(g.get('data-corner') or -1)))
                if want is None or value != want: errors.append('SOLID_NET_CORNER_NAME_MISMATCH:' + lid)
            else:
                name = lid[len('name-'):] if lid.startswith('name-') else None
                if name not in named or value != name: errors.append('SOLID_NAME_MISMATCH:' + lid)
                else: anchor = named[name][1]
            if anchor is None:
                errors.append('SOLID_NAME_ANCHOR_UNKNOWN:' + lid)
                continue
            cx, cy = box[0] + box[2] / 2, box[1] + box[3] / 2
            d = _box_seg_dist(box, anchor, anchor)
            if d < 1.5: errors.append('SOLID_NAME_ON_VERTEX:' + lid)
            if math.hypot(cx - anchor[0], cy - anchor[1]) > 48: errors.append('SOLID_NAME_FAR_FROM_VERTEX:' + lid)
        elif role == 'dim':
            dim = g.get('data-dim')
            seen_dims.add(dim)
            if dim not in expected_dims: errors.append('SOLID_DIM_UNKNOWN:' + str(dim))
            else:
                want, seg, symbolic = expected_dims[dim]
                tex = g.get('data-tex') or ''
                number = label_number(tex)
                if symbolic:
                    if number is not None and abs(number - want) > 1e-6 * max(1, want): errors.append('SOLID_DIM_VALUE_MISMATCH:' + dim)
                else:
                    if g.get('data-numeric') != '1' or number is None: errors.append('SOLID_DIM_NOT_NUMERIC:' + dim)
                    elif abs(number - want) > 1e-6 * max(1.0, want): errors.append('SOLID_DIM_VALUE_MISMATCH:%s:%s' % (dim, tex))
                    if ctx.get('unit') and number is not None and '\\mathrm{%s}' % ctx['unit'] not in tex and '^\\circ' not in tex: errors.append('SOLID_DIM_UNIT_MISSING:' + dim)
                leader = next((e for e in root.iter(NS + 'line') if e.get('data-role') == 'leader' and e.get('data-label') == lid), None)
                if (g.get('data-leader') == '1') != (leader is not None): errors.append('SOLID_LEADER_MISMATCH:' + lid)
                if leader is not None and seg is not None:
                    p0, p1 = (_num(leader, 'x1'), _num(leader, 'y1')), (_num(leader, 'x2'), _num(leader, 'y2'))
                    if _seg_dist(p1, seg[0], seg[1]) > 1.5 or _box_seg_dist(box, p0, p0) > 2.5: errors.append('SOLID_LEADER_NOT_ATTACHED:' + lid)
                    if _seg_dist(((seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2), p1, p1) > 1.5: errors.append('SOLID_LEADER_NOT_AT_MIDDLE:' + lid)
                elif seg is not None:
                    dist = _box_seg_dist(box, seg[0], seg[1])
                    if dist > 34: errors.append('SOLID_DIM_FAR_FROM_SEGMENT:' + dim)
                    if dist < 1.0 and not g.get('data-segment', '').startswith('net-part:angle'): errors.append('SOLID_DIM_ON_SEGMENT:' + dim)
    for dim in expected_dims:
        if dim not in seen_dims: errors.append('SOLID_DIM_LABEL_MISSING:' + dim)
    plan_names = ctx.get('expected_name_labels')
    if plan_names is not None:
        got = sorted(g.get('id') for g in ctx['labels'] if g.get('data-label-role') == 'vertex-name')
        if got != sorted(plan_names): errors.append('SOLID_NAME_LABEL_SET_MISMATCH')


def expected_dim_values(plan, ctx):
    """dim id -> (value, segment in px or None, symbolic)"""
    out = {}
    unit = plan.get('unit')
    named = ctx.get('named') or {}
    if plan.get('net') is not None:
        return ctx.get('net_dims') or {}
    solids = ctx.get('solids') or []
    dim_solid = {}
    for k, d in enumerate(plan.get('dims') or []):
        ident = 'dim-%d' % (k + 1)
        symbolic = d.get('label') is not None and label_number(d['label']) is None
        try:
            if d.get('edge') is not None or d.get('from') is not None:
                a, b = (d['edge'][0], d['edge'][1]) if d.get('edge') is not None else (d['from'], d['to'])
                A, B = named[a], named[b]
                out[ident] = (vlen(vsub(A[2], B[2])), (A[1], B[1]), symbolic)
            else:
                solid = None
                want = d.get('solid')
                for s in solids:
                    if want is not None and s['id'] == want: solid = s
                if solid is None:
                    for s in solids:
                        if d.get('level') is not None and s['cat'] == 'REV': solid = s; break
                        if d.get('radius') is not None and s['cat'] in ('REV', 'SPHERE'): solid = s; break
                        if d.get('slant') is not None and s['kind'] in ('CONE', 'CONE_FRUSTUM'): solid = s; break
                        if d.get('height') is not None and (s['cat'] == 'REV' or s['kind'] in ('PYRAMID', 'FRUSTUM')): solid = s; break
                dim_solid[ident] = solid['id']
                if d.get('radius') is not None:
                    which = d['radius']
                    if which == 'center': val = solid['r0']
                    elif which == 'level':
                        m = re.fullmatch(r'(\d+)/(\d+)', (plan.get('section') or {}).get('at') or '')
                        f = int(m.group(1)) / int(m.group(2))
                        val = solid['r0'] + (solid['r1'] - solid['r0']) * f
                    elif which == 'bottom': val = solid['r0']
                    else: val = solid['r1']
                    out[ident] = (val, None, symbolic)
                elif d.get('level') is not None:
                    m = re.fullmatch(r'(\d+)/(\d+)', (plan.get('section') or {}).get('at') or '')
                    f = int(m.group(1)) / int(m.group(2))
                    out[ident] = (solid['height'] * (1 - f) if d.get('level') == 'top' else solid['height'] * f, None, symbolic)
                elif d.get('height') is not None: out[ident] = (solid['height'], None, symbolic)
                else: out[ident] = (math.hypot(solid['r1'] - solid['r0'], solid['height']), None, symbolic)
        except (KeyError, TypeError):
            ctx['errors'].append('SOLID_DIM_PLAN_UNRESOLVED:' + ident)
    # the segments of radius / height / slant dimensions come from the drawn dim-lines (data-dim) or the silhouette; resolved in px by the dim line
    for e in ctx['root'].iter(NS + 'line'):
        if e.get('data-role') == 'dim-line' and e.get('data-dim') in out:
            v, _, s = out[e.get('data-dim')]
            out[e.get('data-dim')] = (v, ((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))), s)
    for k, d in enumerate(plan.get('dims') or []):
        ident = 'dim-%d' % (k + 1)
        if d.get('slant') is not None and ident in out:
            v, _, s = out[ident]
            sid = dim_solid.get(ident)
            sil = [e for e in ctx['root'].iter(NS + 'line') if e.get('data-role') == 'silhouette' and e.get('data-side') == 'RIGHT' and (sid is None or e.get('data-solid') == sid)]
            if sil: out[ident] = (v, ((_num(sil[0], 'x1'), _num(sil[0], 'y1')), (_num(sil[0], 'x2'), _num(sil[0], 'y2'))), s)
    # which vertex names must be labelled: every named vertex of every solid
    names = []
    for s in solids:
        if s['cat'] == 'POLY': names += ['name-' + n for n, _ in s['verts'] if n]
        else: names += ['name-' + n for n, _, _ in s['points'] if n]
    ctx['expected_name_labels'] = names
    return out


# --- nets --------------------------------------------------------------------------------------------------------------------------------
def audit_net(plan, ctx):
    root, errors = ctx['root'], ctx['errors']
    net = plan['net']
    unit_plan = plan.get('unit')
    declared = float(root.get('data-scale') or 0)
    kind = net.get('kind')
    ctx['expected_name_labels'] = None
    if kind == 'CYLINDER': audit_cylinder_net(plan, ctx, declared)
    elif kind == 'CONE': audit_cone_net(plan, ctx, declared)
    else: audit_polyhedron_net(plan, ctx, declared)
    del unit_plan


def _dim_defs(plan, ctx, table):
    """net dims: part -> (value, segment px)"""
    out = {}
    for k, d in enumerate((plan['net'].get('dims') or [])):
        ident = 'dim-%d' % (k + 1)
        part = d.get('part')
        if part not in table:
            ctx['errors'].append('SOLID_DIM_PLAN_UNRESOLVED:' + ident)
            continue
        value, seg = table[part]
        symbolic = d.get('label') is not None and label_number(d['label']) is None
        out[ident] = (value, seg, symbolic)
    return out


def audit_cylinder_net(plan, ctx, declared):
    root, errors = ctx['root'], ctx['errors']
    net = plan['net']
    r, h = float(net['radius']), float(net['height'])
    rect = next((e for e in root.iter(NS + 'polygon') if e.get('data-role') == 'net-face' and e.get('data-face') == 'rect'), None)
    circles = {e.get('data-part'): e for e in root.iter(NS + 'circle') if e.get('data-role') == 'net-circle'}
    if rect is None or set(circles) != {'bottom', 'top'}:
        errors.append('SOLID_NET_PARTS_MISSING')
        return
    pts = _points(rect.get('points'))
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    w, hh = max(xs) - min(xs), max(ys) - min(ys)
    S = hh / h
    if abs(w - S * 2 * math.pi * r) > POS_TOL + 0.004 * w: errors.append('SOLID_NET_RECT_WIDTH_NOT_CIRCUMFERENCE')
    if declared and abs(declared - S) > 0.012 * S: errors.append('SOLID_DECLARED_SCALE_MISMATCH')
    cx_mid = (min(xs) + max(xs)) / 2
    for name, yedge in (('bottom', max(ys)), ('top', min(ys))):
        c = circles[name]
        cx, cy, cr = _num(c, 'cx'), _num(c, 'cy'), _num(c, 'r')
        if abs(cr - S * r) > POS_TOL: errors.append('SOLID_NET_CIRCLE_RADIUS:' + name)
        if abs(cx - cx_mid) > POS_TOL: errors.append('SOLID_NET_CIRCLE_NOT_CENTRED:' + name)
        if abs(abs(cy - yedge) - cr) > POS_TOL: errors.append('SOLID_NET_CIRCLE_NOT_TANGENT:' + name)
    cy_b, cy_t = _num(circles['bottom'], 'cy'), _num(circles['top'], 'cy')
    if cy_b < max(ys) or cy_t > min(ys): errors.append('SOLID_NET_CIRCLE_ON_WRONG_SIDE')
    table = {'rect-width': (2 * math.pi * r, ((min(xs), min(ys)), (max(xs), min(ys)))), 'rect-height': (h, ((max(xs), min(ys)), (max(xs), max(ys)))),
             'radius-top': (r, None), 'radius-bottom': (r, None)}
    ctx['net_dims'] = _dim_defs(plan, ctx, table)
    _fill_dim_lines(ctx)
    ctx['segments'] += [((min(xs), min(ys)), (max(xs), min(ys))), ((min(xs), max(ys)), (max(xs), max(ys)))]
    for e in root.iter(NS + 'line'):
        pass


def audit_cone_net(plan, ctx, declared):
    root, errors = ctx['root'], ctx['errors']
    net = plan['net']
    r = float(net['radius'])
    l = float(net['slant']) if net.get('slant') is not None else math.hypot(r, float(net['height']))
    sector = next((e for e in root.iter(NS + 'path') if e.get('data-role') == 'net-face' and e.get('data-face') == 'sector'), None)
    base = next((e for e in root.iter(NS + 'circle') if e.get('data-role') == 'net-circle'), None)
    if sector is None or base is None:
        errors.append('SOLID_NET_PARTS_MISSING')
        return
    m = re.fullmatch(r'\s*M\s*(\S+)\s+(\S+)\s*L\s*(\S+)\s+(\S+)\s*A\s*(\S+)\s+(\S+)\s+0\s+(\d)\s+(\d)\s+(\S+)\s+(\S+)\s*Z\s*', sector.get('d') or '')
    if not m:
        errors.append('SOLID_NET_SECTOR_UNREADABLE')
        return
    ax, ay, x1, y1, rx, ry, large, sweep, x2, y2 = [float(v) for v in m.groups()]
    R1, R2 = math.hypot(x1 - ax, y1 - ay), math.hypot(x2 - ax, y2 - ay)
    S = R1 / l
    if abs(R1 - R2) > POS_TOL or abs(rx - R1) > POS_TOL or abs(ry - R1) > POS_TOL: errors.append('SOLID_NET_SECTOR_NOT_CIRCULAR')
    if declared and abs(declared - S) > 0.012 * S: errors.append('SOLID_DECLARED_SCALE_MISMATCH')
    angle = math.degrees(math.acos(max(-1.0, min(1.0, ((x1 - ax) * (x2 - ax) + (y1 - ay) * (y2 - ay)) / (R1 * R2)))))
    want = 360 * r / l
    if want > 180: angle = 360 - angle
    if abs(angle - want) > 0.35: errors.append('SOLID_NET_SECTOR_ANGLE_MISMATCH:%.2f:%.2f' % (angle, want))
    if int(large) != (1 if want > 180 else 0): errors.append('SOLID_NET_SECTOR_FLAGS_MISMATCH')
    cx, cy, cr = _num(base, 'cx'), _num(base, 'cy'), _num(base, 'r')
    if abs(cr - S * r) > POS_TOL: errors.append('SOLID_NET_CIRCLE_RADIUS:base')
    # arc length of the sector equals the circumference of the base circle; the base circle touches the arc at its middle
    if abs(math.radians(want) * R1 - 2 * math.pi * cr) > POS_TOL + 0.004 * R1: errors.append('SOLID_NET_ARC_NOT_CIRCUMFERENCE')
    mid = ((x1 + x2) / 2 - ax, (y1 + y2) / 2 - ay)
    ml = math.hypot(*mid)
    axis = (mid[0] / ml, mid[1] / ml) if ml > 1e-6 else (0.0, 1.0)
    if want > 180: axis = (-axis[0], -axis[1])
    if abs(math.hypot(cx - ax, cy - ay) - (R1 + cr)) > POS_TOL * 1.5 or abs((cx - ax) * axis[1] - (cy - ay) * axis[0]) > POS_TOL * 1.5: errors.append('SOLID_NET_CIRCLE_NOT_TANGENT:base')
    table = {'slant': (l, ((ax, ay), (x2, y2))), 'arc': (2 * math.pi * r, ((ax + axis[0] * R1 - 0.12 * R1 * axis[1], ay + axis[1] * R1 + 0.12 * R1 * axis[0]), (ax + axis[0] * R1 + 0.12 * R1 * axis[1], ay + axis[1] * R1 - 0.12 * R1 * axis[0]))), 'radius': (r, None), 'angle': (want, ((ax, ay), (ax + axis[0] * R1 * 0.35, ay + axis[1] * R1 * 0.35)))}
    ctx['net_dims'] = _dim_defs(plan, ctx, table)
    _fill_dim_lines(ctx)
    # the sector outline as obstacle segments
    a1 = math.atan2(y1 - ay, x1 - ax)
    a2 = math.atan2(y2 - ay, x2 - ax)
    d = (a2 - a1) % (2 * math.pi)
    if want > 180 and d < math.pi: d = d - 2 * math.pi
    pts = [(ax + R1 * math.cos(a1 + d * k / 32), ay + R1 * math.sin(a1 + d * k / 32)) for k in range(33)]
    ctx['segments'] += [((ax, ay), pts[0])] + [(pts[k], pts[k + 1]) for k in range(32)] + [(pts[-1], (ax, ay))]
    ctx['segments'] += _circle_segments(cx, cy, cr)


def _circle_segments(cx, cy, r, n=32):
    p = [(cx + r * math.cos(2 * math.pi * k / n), cy + r * math.sin(2 * math.pi * k / n)) for k in range(n)]
    return [(p[k], p[(k + 1) % n]) for k in range(n)]


def _fill_dim_lines(ctx):
    root = ctx['root']
    dims = ctx.get('net_dims') or {}
    for e in root.iter(NS + 'line'):
        if e.get('data-role') == 'dim-line' and e.get('data-dim') in dims:
            v, _, s = dims[e.get('data-dim')]
            dims[e.get('data-dim')] = (v, ((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))), s)
            ctx['segments'].append(((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))))
    for ident, (v, seg, s) in list(dims.items()):
        if seg is None: ctx['errors'].append('SOLID_DIM_SEGMENT_UNKNOWN:' + ident)
    for circ in ctx['root'].iter(NS + 'circle'):
        if circ.get('data-role') == 'net-circle': ctx['segments'] += _circle_segments(_num(circ, 'cx'), _num(circ, 'cy'), _num(circ, 'r'))


def orient_cycles(solid, spec, ids):
    """face id -> vertex cycle running counter-clockwise seen from outside (the outward normal decides between the listed cycle and its reversal)"""
    verts = [p for _, p in solid['verts']]
    n_base = len(base_polygon(spec['base'])[0])

    def newell(cyc):
        nrm = (0.0, 0.0, 0.0)
        for i in range(len(cyc)): nrm = vadd(nrm, vcross(verts[cyc[i]], verts[cyc[(i + 1) % len(cyc)]]))
        return vunit(nrm)
    interior = vmul(tuple(sum(p[k] for p in verts) for k in range(3)), 1.0 / len(verts))
    out = {}
    plane = spec['base'].get('plane', 'XY')
    axis = (0.0, 0.0, 1.0) if plane == 'XY' else (0.0, 1.0, 0.0)
    base_cycle = solid['faces'][0]
    sign = 1.0 if vdot(newell(base_cycle), axis) > 0 else -1.0
    for fid, cyc in zip(ids, solid['faces']):
        if solid['kind'] == 'PRISM':
            if fid == 'bottom': want = vmul(axis, -1.0)
            elif fid == 'top': want = axis
            else:
                i = int(fid[4:])
                d = vsub(verts[(i + 1) % n_base], verts[i])
                want = vmul(vcross(d, axis), sign)
        else:
            if fid == 'bottom': want = (0.0, 0.0, -1.0)
            elif fid == 'top': want = (0.0, 0.0, 1.0)
            else:
                c = vmul(tuple(sum(verts[v][k] for v in cyc) for k in range(3)), 1.0 / len(cyc))
                want = vsub(c, interior)
        out[fid] = list(cyc) if vdot(newell(cyc), want) >= 0 else list(reversed(cyc))
    return out


def audit_polyhedron_net(plan, ctx, declared):
    root, errors = ctx['root'], ctx['errors']
    net = plan['net']
    solid = build_solid({**net['solid'], 'id': 's1'})
    n_base = len(base_polygon(net['solid']['base'])[0])
    kind = solid['kind']
    # face ids and vertex cycles (orientation is irrelevant for distances); the same ids as the plan's joins use
    ids = []
    if kind == 'PYRAMID':
        ids = ['bottom'] + ['side%d' % i for i in range(n_base)]
    else:
        ids = ['bottom', 'top'] + ['side%d' % i for i in range(n_base)]
    cycles = dict(zip(ids, solid['faces']))
    polys = {e.get('data-face'): _points(e.get('points')) for e in root.iter(NS + 'polygon') if e.get('data-role') == 'net-face'}
    if set(polys) != set(ids):
        errors.append('SOLID_NET_FACE_SET_MISMATCH')
        return
    P3 = lambda i: solid['verts'][i][1]
    root_id = net['root']
    if root_id not in cycles:
        errors.append('SOLID_NET_FACE_UNKNOWN')
        return

    def perimeter3(cyc): return sum(vlen(vsub(P3(cyc[i]), P3(cyc[(i + 1) % len(cyc)]))) for i in range(len(cyc)))

    def perimeter2(poly): return sum(math.hypot(poly[i][0] - poly[(i + 1) % len(poly)][0], poly[i][1] - poly[(i + 1) % len(poly)][1]) for i in range(len(poly)))
    S = perimeter2(polys[root_id]) / perimeter3(cycles[root_id])
    if declared and abs(declared - S) > 0.012 * S: errors.append('SOLID_DECLARED_SCALE_MISMATCH')
    # the drawn corner order is the face's cycle counter-clockwise seen from outside (the listed cycle, or its reversal when that points inward)
    cycles.update(orient_cycles(solid, net['solid'], ids))
    signs = {}
    for fid, cyc in cycles.items():
        poly = polys[fid]
        if len(poly) != len(cyc):
            errors.append('SOLID_NET_FACE_CORNER_COUNT:' + fid)
            continue
        worst = 0.0
        for i in range(len(cyc)):
            for j in range(i + 1, len(cyc)):
                d3 = vlen(vsub(P3(cyc[i]), P3(cyc[j]))) * S
                d2 = math.hypot(poly[i][0] - poly[j][0], poly[i][1] - poly[j][1])
                worst = max(worst, abs(d2 - d3) - 0.003 * d3)
        if worst > POS_TOL: errors.append('SOLID_NET_FACE_NOT_CONGRUENT:' + fid)
        area = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly))) / 2
        signs[fid] = 1 if area > 0 else -1
    if len(set(signs.values())) > 1: errors.append('SOLID_NET_FACE_ORIENTATION_MIXED')
    # joins: a spanning tree whose shared edges coincide in the net and lie on opposite sides
    joins = net.get('joins') or []
    if len(joins) != len(ids) - 1: errors.append('SOLID_NET_NOT_A_TREE')
    reach = {root_id}
    fold_edges = {fid: set() for fid in ids}
    for par, chi in joins:
        if par not in cycles or chi not in cycles:
            errors.append('SOLID_NET_FACE_UNKNOWN')
            continue
        common = [v for v in cycles[par] if v in cycles[chi]]
        if len(common) != 2:
            errors.append('SOLID_NET_FACES_NOT_ADJACENT:%s,%s' % (par, chi))
            continue
        for v in common:
            a = polys[par][cycles[par].index(v)]
            b = polys[chi][cycles[chi].index(v)]
            if math.hypot(a[0] - b[0], a[1] - b[1]) > POS_TOL: errors.append('SOLID_NET_JOIN_EDGE_MISMATCH:%s,%s' % (par, chi))
        # opposite sides of the shared edge
        a0 = polys[par][cycles[par].index(common[0])]
        a1 = polys[par][cycles[par].index(common[1])]

        def side(poly):
            c = (sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly))
            return (a1[0] - a0[0]) * (c[1] - a0[1]) - (a1[1] - a0[1]) * (c[0] - a0[0])
        if side(polys[par]) * side(polys[chi]) >= 0: errors.append('SOLID_NET_JOIN_SAME_SIDE:%s,%s' % (par, chi))
        reach.add(chi)
        key = frozenset(common)
        fold_edges[par].add(key)
        fold_edges[chi].add(key)
    if reach != set(ids): errors.append('SOLID_NET_NOT_A_TREE')
    # no overlap between faces (centroid / vertex containment and proper edge crossings)
    fids = list(ids)
    for i in range(len(fids)):
        for j in range(i + 1, len(fids)):
            if _polys_overlap(polys[fids[i]], polys[fids[j]]): errors.append('SOLID_NET_FACES_OVERLAP:%s,%s' % (fids[i], fids[j]))
    # edge lines: each polygon edge is drawn; dashed exactly for fold edges
    edge_els = {}
    for e in root.iter(NS + 'line'):
        if e.get('data-role') == 'net-edge': edge_els.setdefault(e.get('data-face'), []).append(e)
    for fid, cyc in cycles.items():
        poly = polys.get(fid) or []
        for i in range(len(cyc)):
            a, b = poly[i], poly[(i + 1) % len(cyc)]
            key = frozenset((cyc[i], cyc[(i + 1) % len(cyc)]))
            want_fold = key in fold_edges[fid]
            found = [e for e in edge_els.get(fid, []) if {(round(_num(e, 'x1'), 1), round(_num(e, 'y1'), 1)), (round(_num(e, 'x2'), 1), round(_num(e, 'y2'), 1))} == {(round(a[0], 1), round(a[1], 1)), (round(b[0], 1), round(b[1], 1))}]
            drawn_elsewhere = [e for fid2, els in edge_els.items() for e in els if want_fold and {(round(_num(e, 'x1'), 1), round(_num(e, 'y1'), 1)), (round(_num(e, 'x2'), 1), round(_num(e, 'y2'), 1))} == {(round(a[0], 1), round(a[1], 1)), (round(b[0], 1), round(b[1], 1))}]
            if not found and not drawn_elsewhere:
                errors.append('SOLID_NET_EDGE_MISSING:%s:%d' % (fid, i))
                continue
            e = (found or drawn_elsewhere)[0]
            if _dashed(e) != want_fold: errors.append('SOLID_NET_EDGE_STYLE_MISMATCH:%s:%d' % (fid, i))
    # corner names: corners that coincide in the net are one place and a name is written once there (the first face, in face order, that lists it)
    corner_px, corner_name, expected_labels = {}, {}, []
    clusters = []
    for fid, cyc in cycles.items():
        given = (net.get('corners') or {}).get(fid)
        names = list(given) if given is not None else [solid['verts'][i][0] for i in cyc]
        if len(names) != len(cyc): errors.append('SOLID_NAMES_INVALID')
        for i in range(len(cyc)):
            name = names[i] if i < len(names) else None
            pt = polys[fid][i]
            home = next((g for g in clusters if math.hypot(g['p'][0] - pt[0], g['p'][1] - pt[1]) < 0.35), None)
            if home is None:
                home = {'p': pt, 'names': set()}
                clusters.append(home)
            if not name or name in home['names']: continue
            home['names'].add(name)
            corner_px[(fid, i)] = home['p']
            corner_name[(fid, i)] = name
            expected_labels.append('corner-%s-%d' % (fid, i))
    ctx['corner_px'] = corner_px
    ctx['corner_name'] = corner_name
    ctx['expected_name_labels'] = None
    got = sorted(g.get('id') for g in ctx['labels'] if g.get('data-label-role') == 'vertex-name')
    if got != sorted(expected_labels): errors.append('SOLID_NAME_LABEL_SET_MISMATCH')
    dims = {}
    for k, d in enumerate(net.get('dims') or []):
        ident = 'dim-%d' % (k + 1)
        fid, ei = d['face'], d['edge']
        cyc = cycles[fid]
        value = vlen(vsub(P3(cyc[ei]), P3(cyc[(ei + 1) % len(cyc)])))
        a, b = polys[fid][ei], polys[fid][(ei + 1) % len(cyc)]
        symbolic = d.get('label') is not None and label_number(d['label']) is None
        dims[ident] = (value, (a, b), symbolic)
    ctx['net_dims'] = dims
    segs = []
    for fid in ids:
        poly = polys[fid]
        segs += [(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))]
    ctx['segments'] += segs


def _polys_overlap(a, b):
    def cr(p, q, r): return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    na, nb = len(a), len(b)
    for i in range(na):
        for j in range(nb):
            p, q, r, s = a[i], a[(i + 1) % na], b[j], b[(j + 1) % nb]
            if cr(p, q, r) * cr(p, q, s) < -1e-6 and cr(r, s, p) * cr(r, s, q) < -1e-6: return True

    def inside(poly, pt):
        return _winding_inside(poly, pt)

    def shrink(poly):
        c = (sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly))
        return [(c[0] + (p[0] - c[0]) * 0.9, c[1] + (p[1] - c[1]) * 0.9) for p in poly], c
    sa, ca = shrink(a)
    sb, cb = shrink(b)
    return any(inside(b, p) for p in sa) or any(inside(a, p) for p in sb) or inside(b, ca) or inside(a, cb)
