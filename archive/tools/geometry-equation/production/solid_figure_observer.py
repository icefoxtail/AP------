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
NAME = re.compile(r'^[A-Z]′?$')
NAME_MULTI = re.compile(r'^[A-Z]′?(?:,[A-Z]′?){1,3}$')   # one vertex, several names: "M,A,I" (an entry of a names list)
LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
NAME_TOKEN = re.compile(r'[A-Z]′?|\.')


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
        elif isinstance(x, str) and (NAME.fullmatch(x) or NAME_MULTI.fullmatch(x)): out.append(x)
        else: raise ValueError('SOLID_NAMES_INVALID')
    return out


def _poly_names(kind, n, names):
    if names is None:
        return _letters(0, n), ([] if kind == 'PYRAMID' else _letters(n, n)), (LETTERS[n] if kind == 'PYRAMID' else None)
    if isinstance(names, (str, list)):
        lst = _clean_names(NAME_TOKEN.findall(names) if isinstance(names, str) else list(names))
        need = n + 1 if kind == 'PYRAMID' else 2 * n
        if len(lst) != need: raise ValueError('SOLID_NAMES_INVALID')
        return (lst[:n], [], lst[n]) if kind == 'PYRAMID' else (lst[:n], lst[n:], None)
    base = _letters(0, n) if names.get('base') is None else _clean_names(NAME_TOKEN.findall(names['base']) if isinstance(names['base'], str) else list(names['base']))
    top = [] if kind == 'PYRAMID' else (_letters(n, n) if names.get('top') is None else _clean_names(NAME_TOKEN.findall(names['top']) if isinstance(names['top'], str) else list(names['top'])))
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
    if kind == 'REGULAR_POLYHEDRON': return build_regular(spec)
    if kind == 'BIPYRAMID': return build_bipyramid(spec)
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
        # a vertex written "M,A,I" is named M (edges and the label id use the first name) and answers to all three
        aliases = {i: name.split(',') for i, (name, _) in enumerate(verts) if name and ',' in name}
        verts = [(name.split(',')[0] if name and ',' in name else name, p) for name, p in verts]
        faces = [list(range(n))]
        if kind == 'PRISM' or kind == 'FRUSTUM':
            faces.append([i + n for i in range(n)])
            faces += [[i, (i + 1) % n, (i + 1) % n + n, i + n] for i in range(n)]
        else:
            faces += [[i, (i + 1) % n, n] for i in range(n)]
        if spec.get('cuts') is not None:
            # planes cutting parts off a convex polyhedron: the solid that is drawn is what remains (derived here from the plan alone)
            if spec.get('count') is not None: raise ValueError('SOLID_COUNT_UNSUPPORTED:CUT')
            verts, faces, aliases = apply_cuts(verts, faces, aliases, spec['cuts'])
            return {'id': spec.get('id'), 'kind': kind, 'cat': 'POLY', 'verts': verts, 'faces': faces, 'height': h, 'aliases': aliases, 'cut': True}
        return {'id': spec.get('id'), 'kind': kind, 'cat': 'POLY', 'verts': verts, 'faces': faces, 'height': h, 'aliases': aliases}
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
        if spec.get('cut') is not None:
            if kind != 'SPHERE': raise ValueError('SOLID_SPHERE_CUT_UNSUPPORTED')
            check_cut_spec(spec['cut'])
        return {'id': spec.get('id'), 'kind': kind, 'cat': 'SPHERE' if kind in ('SPHERE', 'HEMISPHERE') else 'REV',
                'r': r, 'r0': r0, 'r1': r1, 'orientation': orientation, 'height': h, 'points': pts,
                'inside': spec.get('inside'), 'cut': spec.get('cut')}
    raise ValueError('SOLID_KIND_UNSUPPORTED')


# --- regular polyhedra and bipyramids (E29) ------------------------------------------------------------------------------------------------------------
# Derived here from the plan and the spec (vertex order, orientation) alone, by other routes than the producer's: the tetrahedron from the vertices of a cube, the
# octahedron from the axes, the icosahedron and dodecahedron from their golden-ratio coordinates turned until a 5-fold axis stands upright (the producer builds the
# icosahedron from rings and the dodecahedron as its dual). Vertex order: tetrahedron base triangle (azimuths -150, -30, 90 degrees) then the apex; octahedron the square
# ring (azimuths -135, -45, 45, 135) then the upper and the lower apex; icosahedron the upper apex, the upper ring (azimuths -90 + 72k), the lower ring (-54 + 72k), the
# lower apex; dodecahedron four rings of five (upper pentagon, upper-middle, lower-middle, lower pentagon; azimuths -54 + 72k for the first two, -18 + 72k for the others).
PHI = (1 + math.sqrt(5)) / 2
REGULAR_FACE_COUNTS = (4, 8, 12, 20)


def _rot_axis_to_z(points, axis):
    """the points turned (Rodrigues) so that the direction `axis` becomes +z"""
    a = vunit(axis)
    k = vcross(a, (0.0, 0.0, 1.0))
    s, c = vlen(k), a[2]
    if s < 1e-12: return [p if c > 0 else (p[0], -p[1], -p[2]) for p in points]
    k = vmul(k, 1.0 / s)
    return [vadd(vadd(vmul(p, c), vmul(vcross(k, p), s)), vmul(k, vdot(k, p) * (1 - c))) for p in points]


def _turn_z(points, angle):
    ca, sa = math.cos(angle), math.sin(angle)
    return [(p[0] * ca - p[1] * sa, p[0] * sa + p[1] * ca, p[2]) for p in points]


def _az(p): return math.atan2(p[1], p[0])


def _sorted_from(points, start_az):
    """points ordered counter-clockwise by azimuth, beginning at the one nearest `start_az`"""
    return sorted(points, key=lambda p: (_az(p) - start_az + 1e-7) % (2 * math.pi))


def _ring_cycle(points, centre_dir):
    """the points sorted cyclically around a direction (counter-clockwise seen from outside)"""
    axis = vunit(centre_dir)
    helper = (1.0, 0.0, 0.0) if abs(axis[0]) < 0.9 else (0.0, 1.0, 0.0)
    e1 = vunit(vcross(axis, helper))
    e2 = vcross(axis, e1)
    return sorted(points, key=lambda p: math.atan2(vdot(p, e2), vdot(p, e1)))


def regular_polyhedron(count, side):
    """vertices (3-tuples) and faces (index lists) of the regular polyhedron with `count` faces and edge `side`, standing on z = 0"""
    if count == 4:
        raw = [(1.0, 1.0, 1.0), (1.0, -1.0, -1.0), (-1.0, 1.0, -1.0), (-1.0, -1.0, 1.0)]    # four vertices of a cube: edge 2 sqrt 2
        turned = _rot_axis_to_z(raw, raw[0])                                                   # the first becomes the apex on the +z axis
        apex, base = turned[0], turned[1:]
        base = _sorted_from(_turn_z(base, -math.radians(150) - _az(base[0])), -math.radians(150))
        k = side / (2 * math.sqrt(2))
        pts = [vmul(p, k) for p in [*base, apex]]
        faces = [[0, 1, 2], [0, 1, 3], [1, 2, 3], [2, 0, 3]]
    elif count == 8:
        r = side / math.sqrt(2)
        ring = _turn_z([(r, 0.0, 0.0), (0.0, r, 0.0), (-r, 0.0, 0.0), (0.0, -r, 0.0)], -math.radians(135))
        pts = [*ring, (0.0, 0.0, r), (0.0, 0.0, -r)]
        faces = [[k, (k + 1) % 4, 4] for k in range(4)] + [[k, (k + 1) % 4, 5] for k in range(4)]
    else:
        ico = [(0.0, a, b * PHI) for a in (1.0, -1.0) for b in (1.0, -1.0)] + [(a, b * PHI, 0.0) for a in (1.0, -1.0) for b in (1.0, -1.0)] + [(b * PHI, 0.0, a) for a in (1.0, -1.0) for b in (1.0, -1.0)]
        if count == 20:
            top_axis = ico[0]
            pts = _rot_axis_to_z(ico, top_axis)
            levels = sorted(pts, key=lambda p: -p[2])
            top, upper, lower, bottom = levels[0], levels[1:6], levels[6:11], levels[11]
            turn = -math.pi / 2 - _az(upper[0])
            top, bottom = _turn_z([top], turn)[0], _turn_z([bottom], turn)[0]
            upper, lower = _turn_z(upper, turn), _turn_z(lower, turn)
            upper = _sorted_from(upper, -math.pi / 2)
            lower = _sorted_from(lower, -math.pi / 2 + math.pi / 5)
            pts = [top, *upper, *lower, bottom]
            faces = [[0, 1 + k, 1 + (k + 1) % 5] for k in range(5)] + [[1 + k, 1 + (k + 1) % 5, 6 + k] for k in range(5)] \
                + [[6 + k, 6 + (k + 1) % 5, 1 + (k + 1) % 5] for k in range(5)] + [[11, 6 + (k + 1) % 5, 6 + k] for k in range(5)]
            scale = side / 2.0
        else:
            raw = [(a, b, c) for a in (1.0, -1.0) for b in (1.0, -1.0) for c in (1.0, -1.0)]
            raw += [(0.0, a * PHI, b / PHI) for a in (1.0, -1.0) for b in (1.0, -1.0)] + [(a / PHI, 0.0, b * PHI) for a in (1.0, -1.0) for b in (1.0, -1.0)] + [(a * PHI, b / PHI, 0.0) for a in (1.0, -1.0) for b in (1.0, -1.0)]
            turned = _rot_axis_to_z(raw, (0.0, 1.0, PHI))
            rows = sorted(turned, key=lambda p: -p[2])
            groups = [rows[0:5], rows[5:10], rows[10:15], rows[15:20]]
            turn = -math.pi / 2 + math.pi / 5 - _az(groups[0][0])
            groups = [_turn_z(g, turn) for g in groups]
            groups = [_sorted_from(groups[0], -math.pi / 2 + math.pi / 5), _sorted_from(groups[1], -math.pi / 2 + math.pi / 5),
                      _sorted_from(groups[2], -math.pi / 2 + math.pi / 5 + math.pi / 5), _sorted_from(groups[3], -math.pi / 2 + math.pi / 5 + math.pi / 5)]
            pts = [p for g in groups for p in g]
            # a face stands on each axis of the icosahedron: its five vertices are the ones nearest that axis
            el = math.atan(0.5)
            dirs = [(0.0, 0.0, 1.0)] + [(math.cos(el) * math.cos(-math.pi / 2 + 2 * math.pi * k / 5), math.cos(el) * math.sin(-math.pi / 2 + 2 * math.pi * k / 5), math.sin(el)) for k in range(5)] \
                + [(math.cos(el) * math.cos(-math.pi / 2 + math.pi / 5 + 2 * math.pi * k / 5), math.cos(el) * math.sin(-math.pi / 2 + math.pi / 5 + 2 * math.pi * k / 5), -math.sin(el)) for k in range(5)] + [(0.0, 0.0, -1.0)]
            faces = []
            for d in dirs:
                near = sorted(range(20), key=lambda i: -vdot(pts[i], d))[:5]
                order = _ring_cycle([pts[i] for i in near], d)
                faces.append([pts.index(p) for p in order])
            scale = side * PHI / 2.0
        pts = [vmul(p, scale) for p in pts]
    z0 = min(p[2] for p in pts)
    return [(p[0], p[1], p[2] - z0) for p in pts], faces


def _flat_names(total, names):
    if names is None: return _letters(0, total)
    lst = _clean_names(NAME_TOKEN.findall(names) if isinstance(names, str) else list(names))
    if len(lst) != total: raise ValueError('SOLID_NAMES_INVALID')
    return lst


def build_regular(spec):
    count, side = spec.get('faces'), float(spec['side'])
    if count not in REGULAR_FACE_COUNTS: raise ValueError('SOLID_REGULAR_FACES_UNSUPPORTED')
    pts, faces = regular_polyhedron(count, side)
    # every edge of every face is `side` long and every face is planar: the construction checks itself
    for f in faces:
        for k in range(len(f)):
            if abs(vlen(vsub(pts[f[k]], pts[f[(k + 1) % len(f)]])) - side) > 1e-7 * side: raise ValueError('SOLID_OBSERVER_REGULAR_EDGE')
    names = _flat_names(len(pts), spec.get('names'))
    aliases = {i: n.split(',') for i, n in enumerate(names) if n and ',' in n}
    verts = [(n.split(',')[0] if n and ',' in n else n, pts[i]) for i, n in enumerate(names)]
    return {'id': spec.get('id'), 'kind': 'REGULAR_POLYHEDRON', 'cat': 'POLY', 'verts': verts, 'faces': faces, 'height': max(p[2] for p in pts), 'aliases': aliases}


def build_bipyramid(spec):
    base, h = spec['base'], float(spec['height'])
    ring2d, plane = base_polygon(base)
    if plane != 'XY': raise ValueError('SOLID_BASE_PLANE_UNSUPPORTED')
    n = len(ring2d)
    ring = [(x, y, h) for x, y in ring2d]
    cx, cy = sum(p[0] for p in ring) / n, sum(p[1] for p in ring) / n
    pts = [*ring, (cx, cy, 2 * h), (cx, cy, 0.0)]
    faces = [[i, (i + 1) % n, n] for i in range(n)] + [[i, (i + 1) % n, n + 1] for i in range(n)]
    names = _flat_names(len(pts), spec.get('names'))
    aliases = {i: nm.split(',') for i, nm in enumerate(names) if nm and ',' in nm}
    verts = [(nm.split(',')[0] if nm and ',' in nm else nm, pts[i]) for i, nm in enumerate(names)]
    return {'id': spec.get('id'), 'kind': 'BIPYRAMID', 'cat': 'POLY', 'verts': verts, 'faces': faces, 'height': 2 * h, 'aliases': aliases}


# --- planes cutting a convex polyhedron -----------------------------------------------------------------------------------------------------------------
CUT_EPS = 1e-6
CUT_AT = re.compile(r'^([1-9]\d?)/([1-9]\d?)$')


def apply_cuts(verts, faces, aliases, cuts):
    """The polyhedron left after cutting by one or two planes, one after the other. A plane is given by 3-6 points, each at the fraction p/q of an edge
    (written as its two vertex names) of the solid as it is at that cut; the side with strictly more vertices stays (keep:"<vertex>" decides a tie).
    The remaining vertices keep their order, the new vertices (one per edge crossing the plane) follow, ordered by the (low, high) indices of their edge in
    the solid before the cut; the section is one more face. Re-derived here independently of the producer."""
    if not isinstance(cuts, list) or not 1 <= len(cuts) <= 2: raise ValueError('SOLID_CUT_COUNT_INVALID')
    for number, cut in enumerate(cuts, 1):
        verts, faces, aliases = _cut_once(verts, faces, aliases, cut)
    return verts, faces, aliases


def _cut_once(verts, faces, aliases, cut):
    entries = cut.get('through')
    if not isinstance(entries, list) or not 3 <= len(entries) <= 6: raise ValueError('SOLID_CUT_INVALID')

    def index_of(name):
        for i, (n, _) in enumerate(verts):
            if n == name or name in aliases.get(i, []): return i
        return -1
    edges = set()
    for f in faces:
        for i in range(len(f)):
            edges.add((min(f[i], f[(i + 1) % len(f)]), max(f[i], f[(i + 1) % len(f)])))
    through = []
    for entry in entries:
        text, at = entry[0], entry[1]
        names = NAME_TOKEN.findall(text)
        if len(names) != 2 or ''.join(names) != text or '.' in names: raise ValueError('SOLID_CUT_INVALID')
        a, b = index_of(names[0]), index_of(names[1])
        if a < 0 or b < 0 or a == b or (min(a, b), max(a, b)) not in edges: raise ValueError('SOLID_CUT_EDGE_UNKNOWN:' + text)
        m = CUT_AT.fullmatch(at)
        if not m or int(m.group(1)) >= int(m.group(2)): raise ValueError('SOLID_CUT_INVALID')
        t = int(m.group(1)) / int(m.group(2))
        point = vadd(verts[a][1], vmul(vsub(verts[b][1], verts[a][1]), t))
        label = entry[2] if len(entry) > 2 and entry[2] != '.' else None
        through.append({'key': (min(a, b), max(a, b)), 'p': point, 'name': label})
    if len({x['key'] for x in through}) != len(through): raise ValueError('SOLID_CUT_INVALID')
    # the plane from the first three points that are not on one line (the producer takes the widest triple; coplanar points give the same plane)
    normal = None
    for i in range(len(through)):
        for j in range(i + 1, len(through)):
            for k in range(j + 1, len(through)):
                c = vcross(vsub(through[j]['p'], through[i]['p']), vsub(through[k]['p'], through[i]['p']))
                if normal is None and vlen(c) > 1e-9: normal = c
    if normal is None: raise ValueError('SOLID_CUT_DEGENERATE')
    n = vunit(normal)
    d = vdot(n, through[0]['p'])
    if any(abs(vdot(n, x['p']) - d) > 2 * CUT_EPS for x in through): raise ValueError('SOLID_CUT_NOT_PLANAR')
    dist = [vdot(n, v[1]) - d for v in verts]
    pos, neg = sum(1 for x in dist if x > CUT_EPS), sum(1 for x in dist if x < -CUT_EPS)
    if pos == 0 or neg == 0: raise ValueError('SOLID_CUT_NO_EFFECT')
    keep = cut.get('keep')
    if keep is not None:
        i = index_of(keep)
        if i < 0: raise ValueError('SOLID_NAME_UNKNOWN')
        if abs(dist[i]) <= CUT_EPS: raise ValueError('SOLID_CUT_KEEP_INVALID')
        sign = 1.0 if dist[i] > 0 else -1.0
    elif pos != neg: sign = 1.0 if pos > neg else -1.0
    else: raise ValueError('SOLID_CUT_KEEP_AMBIGUOUS')
    side = [sign * x for x in dist]   # positive on the side that stays
    crossing = lambda a, b: (side[a] > CUT_EPS and side[b] < -CUT_EPS) or (side[a] < -CUT_EPS and side[b] > CUT_EPS)
    crossings = {}
    for lo, hi in sorted(edges):
        if crossing(lo, hi):
            t = side[lo] / (side[lo] - side[hi])
            crossings[(lo, hi)] = vadd(verts[lo][1], vmul(vsub(verts[hi][1], verts[lo][1]), t))
    if any(x['key'] not in crossings for x in through): raise ValueError('SOLID_CUT_INVALID')
    kept = [i for i in range(len(verts)) if side[i] >= -CUT_EPS]
    new_of = {old: j for j, old in enumerate(kept)}
    cross_of = {key: len(kept) + j for j, key in enumerate(sorted(crossings))}
    out = [verts[i] for i in kept]
    out_aliases = {new_of[i]: a for i, a in aliases.items() if i in new_of}
    for key in sorted(crossings):
        out.append((next((x['name'] for x in through if x['key'] == key), None), crossings[key]))
    new_faces = []
    for f in faces:
        cycle = []
        for i in range(len(f)):
            a, b = f[i], f[(i + 1) % len(f)]
            if side[a] >= -CUT_EPS: cycle.append(new_of[a])
            key = (min(a, b), max(a, b))
            if key in cross_of and crossing(a, b): cycle.append(cross_of[key])
        if len(set(cycle)) >= 3: new_faces.append(cycle)
    section = [new_of[i] for i in kept if abs(side[i]) <= CUT_EPS] + [cross_of[key] for key in sorted(crossings)]
    if len(section) < 3: raise ValueError('SOLID_CUT_DEGENERATE')
    # counter-clockwise seen from the removed side (outside of the section face)
    u = vmul(n, -sign)
    helper = (1.0, 0.0, 0.0) if abs(u[0]) < 0.9 else (0.0, 1.0, 0.0)
    e1 = vunit(vcross(u, helper))
    e2 = vcross(u, e1)
    centre = vmul(tuple(sum(out[i][1][c] for i in section) for c in range(3)), 1.0 / len(section))
    section.sort(key=lambda i: math.atan2(vdot(vsub(out[i][1], centre), e2), vdot(vsub(out[i][1], centre), e1)))
    new_faces.append(section)
    return out, new_faces, out_aliases


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


# --- vertex references: "#b0" "#t2" "#apex" "#v5" (optionally "s2#b0") stand for a vertex wherever a name does ---------------------------------------
# A vertex without a name is known by the key "<solid id>.<slot>" ("s1.b0"); a key is the name when there is one. Keys are joined "AB" while they are plain
# names and "s1.b0-s1.b1" as soon as one is a canonical key. Written here from the grammar alone (not from the producer).
VREF = re.compile(r'^([a-z][a-z0-9]{0,7})?#(?:([btv])(\d{1,2})|(apex2?))$')
PLAIN_KEY = re.compile(r'^[A-Z]′?$')


def join_keys(keys):
    keys = list(keys)
    return ''.join(keys) if all(PLAIN_KEY.fullmatch(k) for k in keys) else '-'.join(keys)


def split_edge(edge):
    """the two keys of a data-edge written by join_keys"""
    if '-' in edge:
        a, b = edge.split('-', 1)
        return a, b
    parts = re.findall(r'[A-Z]′?', edge)
    return (parts[0], parts[1]) if len(parts) == 2 else (None, None)


def _ring_size(solid):
    n = len(solid['verts'])
    return n - 1 if solid['kind'] == 'PYRAMID' else n - 2 if solid['kind'] == 'BIPYRAMID' else n // 2


def vertex_slot(solid, i):
    if solid['kind'] == 'REGULAR_POLYHEDRON': return 'v%d' % i
    n = _ring_size(solid)
    if solid['kind'] == 'PYRAMID': return 'b%d' % i if i < n else 'apex'
    if solid['kind'] == 'BIPYRAMID': return 'b%d' % i if i < n else 'apex' if i == n else 'apex2'
    return 'b%d' % i if i < n else 't%d' % (i - n)


def vertex_keys(solid, i):
    """the keys a polyhedron vertex answers to: its names, or its canonical key when it has none (a solid with cuts renumbers: names only)"""
    name = solid['verts'][i][0]
    if name: return solid['aliases'].get(i, [name])
    return [] if solid.get('cut') else ['%s.%s' % (solid['id'], vertex_slot(solid, i))]


def make_norm(solids, named):
    """name or reference -> key of its vertex (the name when it has one); ValueError with the plan's error code otherwise"""
    def norm(x, unknown='SOLID_NAME_UNKNOWN'):
        if not isinstance(x, str): raise ValueError(unknown)
        if '#' not in x:
            if x not in named: raise ValueError(unknown)
            return x
        m = VREF.fullmatch(x)
        if not m: raise ValueError('SOLID_VREF_INVALID:' + x[:16])
        prefix, ring, index, apex = m.groups()
        found = []
        for solid in solids:
            if solid['cat'] != 'POLY' or solid.get('cut') or (prefix is not None and solid['id'] != prefix): continue
            total, n, kind = len(solid['verts']), _ring_size(solid), solid['kind']
            if ring == 'v': i = int(index) if int(index) < total else None
            elif kind == 'REGULAR_POLYHEDRON': i = None
            elif apex == 'apex': i = n if kind in ('PYRAMID', 'BIPYRAMID') else None
            elif apex == 'apex2': i = n + 1 if kind == 'BIPYRAMID' else None
            elif ring == 'b': i = int(index) if int(index) < n else None
            else: i = None if kind in ('PYRAMID', 'BIPYRAMID') else (n + int(index) if int(index) < n else None)
            if i is not None: found.append((solid, i))
        if len(found) != 1: raise ValueError('SOLID_VREF_UNKNOWN:' + x[:16] if not found else 'SOLID_VREF_AMBIGUOUS:' + x[:16])
        return vertex_keys(found[0][0], found[0][1])[0]
    return norm


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
    t = re.sub(r'\\,?\\mathrm\{[a-z]+\}(\^2)?', '', tex or '')
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
    ctx = {'root': root, 'errors': errors, 'boxes': boxes, 'labels': labels, 'segments': [], 'unit': unit, 'label_text': {}}
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
    specs_by_id = {s_['id']: s_ for s_ in solids_with_ids(plan)}
    counted = set()
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
                if name:
                    for alias in solid['aliases'].get(i, [name]): named[alias] = (sid, px(p), p)
                    if i in solid['aliases']: ctx['label_text'][name] = ','.join(solid['aliases'][i])
                else:
                    for key in vertex_keys(solid, i): named[key] = (sid, px(p), p)
            check_poly_edges(solid, root, px, scale, errors)
            audit_counts(solid, (specs_by_id.get(sid) or {}).get('count') or {}, px, ctx)
            counted.add(sid)
            # the solid's drawn extent, for the overlap check
        else:
            for name, pid, p in solid['points']:
                if name: named[name] = (sid, px(p), p)
            check_round(solid, root, px, scale, errors, ctx['segments'], (plan.get('section') if (plan.get('section') or {}).get('kind') == 'LEVEL' and (plan['section'].get('solid') or next((x['id'] for x in solids if x['cat'] == 'REV'), None)) == solid['id'] else None))
    for g in ctx['labels']:
        if g.get('data-label-role') in COUNT_ROLES and g.get('data-solid') not in counted: errors.append('SOLID_COUNT_LABEL_UNEXPECTED:' + str(g.get('id')))
    ctx['named'] = named
    ctx['px'] = {sid: frames[sid] for sid in frames}
    norm = ctx['norm'] = make_norm(solids, named)
    # aux segments, highlights, section
    plan_segments = [(norm(s_['from']), norm(s_['to'])) for s_ in plan.get('segments') or []]
    declared_pairs = {join_keys(pair): pair for pair in plan_segments}
    for el in root.iter(NS + 'line'):
        if el.get('data-role') == 'segment':
            ident = el.get('data-edge') or ''
            a, b = declared_pairs.get(ident, (None, None))
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
    declared_segments = {join_keys(pair) for pair in plan_segments}
    drawn_segments = {el.get('data-edge') for el in root.iter(NS + 'line') if el.get('data-role') == 'segment'}
    if declared_segments != drawn_segments: errors.append('SOLID_SEGMENT_SET_MISMATCH')
    all_highlights = plan.get('highlights') or []
    highlights = [[norm(n) for n in h['polygon']] for h in all_highlights if h.get('polygon') is not None]
    drawn = {el.get('data-polygon'): el for el in root.iter(NS + 'polygon') if el.get('data-role') == 'highlight-face' and el.get('data-polygon') is not None}
    if sorted(join_keys(h) for h in highlights) != sorted(drawn): errors.append('SOLID_HIGHLIGHT_SET_MISMATCH')
    for entry in all_highlights:
        if entry.get('polygon') is None: continue
        key = join_keys([norm(n) for n in entry['polygon']])
        el = drawn.get(key)
        if el is not None and (el.get('data-fill') or 'LIGHT') != (entry.get('fill') or 'LIGHT'): errors.append('SOLID_HIGHLIGHT_FILL_MISMATCH:' + key)
    for h in highlights:
        el = drawn.get(join_keys(h))
        if el is None: continue
        pts = _points(el.get('points'))
        if len(pts) != len(h): errors.append('SOLID_HIGHLIGHT_POINTS_MISMATCH:' + join_keys(h)); continue
        for name, q in zip(h, pts):
            if name not in named or math.hypot(named[name][1][0] - q[0], named[name][1][1] - q[1]) > POS_TOL: errors.append('SOLID_HIGHLIGHT_VERTEX_OFF:' + name)
        # planar in 3D: the named vertices must be coplanar
        P = [named[n][2] for n in h if n in named]
        if len(P) >= 4:
            nrm = vunit(vcross(vsub(P[1], P[0]), vsub(P[2], P[0])))
            if any(abs(vdot(nrm, vsub(p, P[0]))) > 1e-6 for p in P): errors.append('SOLID_HIGHLIGHT_NOT_PLANAR')
    check_face_highlights(all_highlights, solids, frames, scale, root, errors)
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
    check_body_fill(plan, solids, frames, scale, root, errors)
    audit_marks(plan, solid_named=named, frames=frames, scale=scale, root=root, errors=errors, px_by_id=ctx.get('px'), norm=norm)
    for el in root.iter(NS + 'line'):
        if el.get('data-role') == 'dim-line':
            ctx['segments'].append(((_num(el, 'x1'), _num(el, 'y1')), (_num(el, 'x2'), _num(el, 'y2'))))
    check_dim_lines(plan, ctx)


def solids_with_ids(plan):
    return [{**spec, 'id': spec.get('id') or 's%d' % (i + 1)} for i, spec in enumerate(plan['solids'])]


# --- counting numbers: 1, 2, ... beside the vertices and circled numbers beside the edge midpoints -------------------------------------------------------
COUNT_ROLES = ('count-vertex', 'count-edge')
COUNT_MARGIN = 2.0   # px: a counting number is nearer to its own target than to any other by at least this
COUNT_FAR = 48.0     # px: a counting number's centre is never farther than this from its own target
CIRCLED = [chr(0x2460 + k) for k in range(20)]


def count_order(solid):
    """the edges (vertex index pairs) in counting order: around the base ring (edge i joins vertices i and i+1, the closing edge last), then the side
    edges by their base vertex, then around the top ring"""
    if solid['kind'] == 'REGULAR_POLYHEDRON': return poly_edges(solid)
    n = _ring_size(solid)

    def slot(e):
        a, b = e
        if a < n and b < n: return (0, a if b == a + 1 else b)
        if solid['kind'] == 'BIPYRAMID': return (1, a) if b == n else (2, a)
        if a >= n and b >= n: return (2, a - n if b == a + 1 else b - n)
        return (1, a)
    return sorted(poly_edges(solid), key=slot)


def audit_counts(solid, flags, px, ctx):
    """every vertex / edge of a solid that asked for counting numbers has exactly one number 1..N, written as such, nearest to its own target"""
    errors, boxes = ctx['errors'], ctx['boxes']
    sid = solid['id']
    mine_all = [g for g in ctx['labels'] if g.get('data-solid') == sid and g.get('data-label-role') in COUNT_ROLES]
    for role, want in (('count-vertex', bool(flags.get('vertices'))), ('count-edge', bool(flags.get('edges')))):
        mine = [g for g in mine_all if g.get('data-label-role') == role]
        if not want:
            if mine: errors.append('SOLID_COUNT_LABEL_UNEXPECTED:%s:%s' % (sid, role))
            continue
        if role == 'count-vertex':
            targets = [px(p) for _, p in solid['verts']]
            texts, attr = [str(k + 1) for k in range(len(targets))], 'data-tex'
            if any(name for name, _ in solid['verts']): errors.append('SOLID_COUNT_NAMES_CONFLICT:' + sid)
        else:
            order = count_order(solid)
            targets = [px(vmul(vadd(solid['verts'][a][1], solid['verts'][b][1]), 0.5)) for a, b in order]
            texts, attr = [CIRCLED[k] if k < len(CIRCLED) else '?' for k in range(len(targets))], 'data-text'
        numbers = []
        for g in mine:
            try: numbers.append(int(g.get('data-count-n')))
            except (TypeError, ValueError): errors.append('SOLID_COUNT_LABEL_UNREADABLE:' + str(g.get('id')))
        if sorted(numbers) != list(range(1, len(targets) + 1)): errors.append('SOLID_COUNT_NUMBERS_NOT_COMPLETE:%s:%s:%s' % (sid, role, sorted(numbers)[:24]))
        for g in mine:
            lid = str(g.get('id'))
            try: n = int(g.get('data-count-n'))
            except (TypeError, ValueError): continue
            box = boxes.get(g.get('id'))
            if not 1 <= n <= len(targets) or box is None: continue
            if g.get(attr) != texts[n - 1] or g.get('data-value') != str(n) or g.get('data-count') != ('vertex' if role == 'count-vertex' else 'edge'): errors.append('SOLID_COUNT_TEXT_MISMATCH:' + lid)
            cx, cy = box[0] + box[2] / 2, box[1] + box[3] / 2
            own = math.hypot(cx - targets[n - 1][0], cy - targets[n - 1][1])
            if own > COUNT_FAR: errors.append('SOLID_COUNT_LABEL_FAR:' + lid)
            if any(own + COUNT_MARGIN >= math.hypot(cx - t[0], cy - t[1]) for k, t in enumerate(targets) if k != n - 1): errors.append('SOLID_COUNT_LABEL_CONFUSED:' + lid)
            if role == 'count-vertex' and _box_seg_dist(box, targets[n - 1], targets[n - 1]) < 1.5: errors.append('SOLID_COUNT_ON_VERTEX:' + lid)


HIGHLIGHT_FILLS = ('LIGHT', 'MEDIUM', 'WARM', 'GREEN', 'ROSE', 'VIOLET')


def face_names(solid):
    """the names of a polyhedron's faces, in the order of its face list: bottom, (top,) side0, side1, ... (side i stands on the i-th edge of the base)"""
    if solid['kind'] == 'REGULAR_POLYHEDRON': return ['f%d' % i for i in range(len(solid['faces']))]
    n = _ring_size(solid)
    if solid['kind'] == 'BIPYRAMID': return ['top%d' % i for i in range(n)] + ['bottom%d' % i for i in range(n)]
    return (['bottom'] if solid['kind'] == 'PYRAMID' else ['bottom', 'top']) + ['side%d' % i for i in range(n)]


def check_face_highlights(highlights, solids, frames, scale, root, errors):
    """a highlight written as {face: "side2"} shades exactly the drawn polygon of that face of that polyhedron, in the tint the plan names"""
    polys = [x for x in solids if x['cat'] == 'POLY']
    want = {}
    for h in highlights:
        if h.get('face') is None: continue
        owner = next((x for x in polys if x['id'] == h.get('solid')), None) if h.get('solid') is not None else (polys[0] if len(polys) == 1 else None)
        if owner is None or owner.get('cut'): raise ValueError('SOLID_HIGHLIGHT_INVALID')
        if (h.get('fill') or 'LIGHT') not in HIGHLIGHT_FILLS: raise ValueError('SOLID_HIGHLIGHT_FILL_INVALID')
        want[(owner['id'], h['face'])] = h.get('fill') or 'LIGHT'
    drawn = {}
    for el in root.iter(NS + 'polygon'):
        if el.get('data-role') == 'highlight-face' and el.get('data-face') is not None:
            key = (el.get('data-solid'), el.get('data-face'))
            if key in drawn: errors.append('SOLID_HIGHLIGHT_FACE_SET_MISMATCH')
            drawn[key] = el
    if set(drawn) != set(want): errors.append('SOLID_HIGHLIGHT_FACE_SET_MISMATCH')
    for (sid, face), fill in want.items():
        el = drawn.get((sid, face))
        if el is None: continue
        solid = next(x for x in polys if x['id'] == sid)
        names = face_names(solid)
        if face not in names:
            errors.append('SOLID_HIGHLIGHT_FACE_UNKNOWN:' + face)
            continue
        if sid not in frames: continue
        Tx, Ty = frames[sid]

        def px(p):
            q = project(p)
            return (Tx + scale * q[0], Ty - scale * q[1])
        cycle = solid['faces'][names.index(face)]
        expected = [px(solid['verts'][i][1]) for i in cycle]
        pts = _points(el.get('points'))
        n = len(expected)
        ok = len(pts) == n and any(all(math.hypot(pts[i][0] - expected[(d * i + k) % n][0], pts[i][1] - expected[(d * i + k) % n][1]) <= POS_TOL for i in range(n)) for d in (1, -1) for k in range(n))
        if not ok: errors.append('SOLID_HIGHLIGHT_FACE_VERTEX_OFF:' + face)
        if (el.get('data-fill') or 'LIGHT') != fill: errors.append('SOLID_HIGHLIGHT_FILL_MISMATCH:' + face)


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
    if solid.get('cut'): return _cut_frame(solid, root, errors)
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
    if solid.get('cut'):
        check_cut_sphere(solid, root, px, scale, errors, segments)
        return
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


BODY_TOL = 1.2   # px


def _hull(points):
    pts = sorted(set(points))
    if len(pts) < 3: return pts

    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cr(lower[-2], lower[-1], p) <= 0: lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cr(upper[-2], upper[-1], p) <= 0: upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def _area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2


def check_body_fill(plan, solids, frames, scale, root, errors):
    """a level plane with fill "BOTTOM" / "TOP" shades the part of the solid on that side: the polygon is the convex hull of the circles that bound that part
    (re-derived here: every vertex on one of the circles' projections, the polygon convex, every point of every circle inside it, and its area the hull's)"""
    section = plan.get('section') or {}
    fill = section.get('fill') if section.get('kind') == 'LEVEL' else None
    els = [el for el in root.iter(NS + 'polygon') if el.get('data-role') == 'body-fill']
    if bool(fill) != bool(els) or len(els) > 1:
        errors.append('SOLID_BODY_FILL_SET_MISMATCH')
        return
    if not els: return
    el = els[0]
    solid = next(x for x in solids if x['id'] == (section.get('solid') or next(y['id'] for y in solids if y['cat'] == 'REV')))
    if el.get('data-solid') != solid['id'] or el.get('data-side') != fill: errors.append('SOLID_BODY_FILL_MISMATCH:attributes')
    Tx, Ty = frames[solid['id']]
    m = re.fullmatch(r'(\d+)/(\d+)', section.get('at') or '')
    f = int(m.group(1)) / int(m.group(2))
    h, r0, r1 = solid['height'], solid['r0'], solid['r1']
    zl, rl = f * h, r0 + (r1 - r0) * f

    def px(z):
        q = project((0.0, 0.0, z))
        return (Tx + scale * q[0], Ty - scale * q[1])
    circles = [(0.0, r0), (zl, rl)] if fill == 'BOTTOM' else [(zl, rl)] + ([(h, r1)] if r1 > 0 else [])
    apex = [px(h)] if (fill == 'TOP' and r1 == 0) else []
    samples, curves = list(apex), []
    for z, rad in circles:
        cx, cy = px(z)
        rx, ry = scale * rad, scale * rad * math.sin(PITCH)
        curves.append((cx, cy, rx, ry))
        samples += [(cx + rx * math.cos(math.radians(k)), cy - ry * math.sin(math.radians(k))) for k in range(360)]
    poly = _points(el.get('points'))
    if len(poly) < 6:
        errors.append('SOLID_BODY_FILL_MISMATCH:vertices')
        return
    for (x, y) in poly:
        on_curve = any(abs(math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * min(rx, ry) <= BODY_TOL for cx, cy, rx, ry in curves)
        if not on_curve and not any(math.hypot(x - a[0], y - a[1]) <= BODY_TOL for a in apex):
            errors.append('SOLID_BODY_FILL_MISMATCH:vertex_off_circle')
            break
    turns = [(poly[(i + 1) % len(poly)][0] - poly[i][0]) * (poly[(i + 2) % len(poly)][1] - poly[(i + 1) % len(poly)][1]) - (poly[(i + 1) % len(poly)][1] - poly[i][1]) * (poly[(i + 2) % len(poly)][0] - poly[(i + 1) % len(poly)][0]) for i in range(len(poly))]
    if not (all(t >= -1e-6 for t in turns) or all(t <= 1e-6 for t in turns)): errors.append('SOLID_BODY_FILL_MISMATCH:not_convex')
    sign = 1 if sum(turns) > 0 else -1
    for (x, y) in samples:
        for i in range(len(poly)):
            a, b = poly[i], poly[(i + 1) % len(poly)]
            edge = math.hypot(b[0] - a[0], b[1] - a[1])
            if edge < 1e-9: continue
            if sign * ((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])) / edge < -0.8:
                errors.append('SOLID_BODY_FILL_MISMATCH:circle_outside')
                return
    want = _area(_hull(samples))
    if abs(_area(poly) - want) > 0.006 * want: errors.append('SOLID_BODY_FILL_MISMATCH:area')


def _dist_point_seg(p, a, b):
    return _seg_dist(p, a, b)


def _parallel(u, v):
    return abs(u[0] * v[1] - u[1] * v[0]) <= 1e-6 * max(1.0, math.hypot(*u) * math.hypot(*v))


def audit_marks(plan, solid_named, frames, scale, root, errors, px_by_id, norm=None):
    marks = plan.get('marks') or {}
    named = solid_named or {}
    norm = norm or (lambda x: x)
    right = {(m.get('id') or 'ra%d' % (k + 1)): {**m, 'at': norm(m['at']), 'refs': [norm(r) for r in m['refs']]} for k, m in enumerate(marks.get('rightAngles') or [])}
    equal = {}
    for k, g in enumerate(marks.get('equalLengths') or []):
        segs = []
        for pair in g.get('segments') or []:
            segs.append([norm(x) for x in (list(pair) if isinstance(pair, (list, tuple)) else [pair[0], pair[1]])])
        equal[g.get('id') or 'eq%d' % (k + 1)] = {**g, 'segments': segs}
    angles = {(m.get('id') or 'an%d' % (k + 1)): {**m, 'refs': [norm(r) for r in m['refs']]} for k, m in enumerate(marks.get('angles') or [])}
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
            if el.get('data-at') != m['at'] or el.get('data-refs') != join_keys(m['refs']):
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
        a, b = split_edge(edge)
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
            if (mid, join_keys([a, b])) not in groups and (mid, join_keys([b, a])) not in groups:
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


# --- a sphere cut by planes through its centre (cut:{kind,facing?}) -----------------------------------------------------------------------------
# The piece is re-derived here from the radius and the cut alone, as a set of points (a ball intersected with half-spaces) and not as the producer's list of
# octants: a face, a rim arc or a radius exists where probes on its two sides disagree about being inside the piece; the depth test samples the ray toward the
# viewer. The SVG is then checked against that: faces, limb stretches, rim arcs and radii (each piece solid or dashed as the depth test says), centre dot.
CUT_KINDS = ('HALF', 'QUARTER', 'OCTANT', 'THREE_QUARTERS', 'SEVEN_EIGHTHS')
CUT_FACING = ('CUT', 'CURVED')
AXIS_VEC = ((1.0, 0.0, 0.0), (0.0, 1.0, 0.0), (0.0, 0.0, 1.0))
PLANE_AXES = {'X': (0, 1, 2), 'Y': (1, 0, 2), 'Z': (2, 0, 1)}   # normal axis, then the two axes inside the plane
CUT_TOL_T = 4e-3           # a piece of a rim arc or radius may end this far (as a fraction of the whole) from where the depth test changes
CUT_FACE_VERTEX_TOL = 1.2  # px


def check_cut_spec(cut):
    if not isinstance(cut, dict) or set(cut) - {'kind', 'facing', 'offset', 'explode'}: raise ValueError('SOLID_SPHERE_CUT_INVALID')
    if cut.get('explode') is not None: raise ValueError('SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED')
    if cut.get('offset') not in (None, 0): raise ValueError('SOLID_SPHERE_CUT_OFF_CENTRE')
    if not isinstance(cut.get('kind'), str): raise ValueError('SOLID_SPHERE_CUT_INVALID')
    if cut['kind'] not in CUT_KINDS: raise ValueError('SOLID_SPHERE_CUT_KIND_UNSUPPORTED')
    if cut.get('facing', 'CUT') not in CUT_FACING: raise ValueError('SOLID_SPHERE_CUT_FACING_INVALID')
    return {'kind': cut['kind'], 'facing': cut.get('facing', 'CUT')}


def cut_inside(cut, d, r):
    """is the point d (relative to the centre) in the piece: the closed ball meeting the half-spaces of the kind"""
    if vlen(d) > r * (1 + 1e-9): return False
    x, y, z = (-d[0], -d[1], -d[2]) if cut['facing'] == 'CURVED' else d
    kind = cut['kind']
    if kind == 'HALF': return y >= 0
    if kind == 'QUARTER': return x <= 0 and y >= 0
    if kind == 'OCTANT': return x <= 0 and y >= 0 and z <= 0
    if kind == 'THREE_QUARTERS': return x <= 0 or y >= 0
    return not (x > 0 and y < 0 and z > 0)   # SEVEN_EIGHTHS


def cut_hits(cut, d, r):
    """does the ray from d toward the viewer pass through the piece (sampled along the part of it that lies inside the ball)"""
    b = vdot(d, VIEW)
    disc = b * b - (vdot(d, d) - r * r)
    if disc <= 1e-12: return False
    s = math.sqrt(disc)
    lo, hi = max(-b - s, 1e-7), -b + s
    if hi <= lo + 1e-7: return False
    n = 240
    return any(cut_inside(cut, vadd(d, vmul(VIEW, lo + (hi - lo) * (k + 0.5) / n)), r) for k in range(n))


def _around_axis(cut, k, s, r):
    """the four probes beside the half axis k (sign s) halfway out"""
    _, i, j = PLANE_AXES['XYZ'[k]]
    m = vmul(AXIS_VEC[k], 0.5 * r * s)
    return [cut_inside(cut, vadd(m, vadd(vmul(AXIS_VEC[i], a * 0.01 * r), vmul(AXIS_VEC[j], b * 0.01 * r))), r) for a in (1, -1) for b in (1, -1)]


def cut_features(solid):
    cut, r = check_cut_spec(solid['cut']), solid['r0']
    eps = 1e-3 * r
    faces, creases = {}, {}
    for pid in 'XYZ':
        n, i, j = PLANE_AXES[pid]
        for si in (1, -1):
            for sj in (1, -1):
                e1, e2 = vmul(AXIS_VEC[i], si), vmul(AXIS_VEC[j], sj)
                mid = vmul(vadd(e1, e2), 0.97 * r / math.sqrt(2))
                nrm = AXIS_VEC[n]
                up, down = cut_inside(cut, vadd(mid, vmul(nrm, eps)), r), cut_inside(cut, vsub(mid, vmul(nrm, eps)), r)
                if up == down: continue
                outward = vmul(nrm, -1.0) if up else nrm
                visible = vdot(outward, VIEW) > 1e-9 and not cut_hits(cut, vmul(vadd(e1, e2), 0.45 * r), r)
                faces[pid + ('+' if si > 0 else '-') + ('+' if sj > 0 else '-')] = {'plane': pid, 'e1': e1, 'e2': e2, 'outward': outward, 'visible': visible}
    for k in range(3):
        for s in (1, -1):
            if sum(_around_axis(cut, k, s, r)) in (1, 3): creases[('+' if s > 0 else '-') + 'XYZ'[k]] = {'axis': k, 'sign': s}
    return {'cut': cut, 'faces': faces, 'creases': creases}


def cut_radius_axis(solid):
    """the half axis a radius label lies on: part of the piece, seen, the most horizontal on the screen (the right one when equal); None when none is seen"""
    cut, r = check_cut_spec(solid['cut']), solid['r0']
    best = None
    for k in range(3):
        for s in (1, -1):
            if not any(_around_axis(cut, k, s, r)): continue
            if any(cut_hits(cut, vmul(AXIS_VEC[k], u * r * s), r) for u in (0.25, 0.5, 0.75)): continue
            sx = vdot(vmul(AXIS_VEC[k], s), SCREEN_X)
            score = (round(abs(sx), 9), 1 if sx > 0 else 0)
            if best is None or score > best[0]: best = (score, (k, s))
    return None if best is None else best[1]


def _parse_arc_full(d):
    m = re.fullmatch(r'\s*M\s*(\S+)\s+(\S+)\s*A\s*(\S+)\s+(\S+)\s+(\S+)\s+(\d)\s+(\d)\s+(\S+)\s+(\S+)\s*', d or '')
    if not m: raise ValueError('SOLID_ARC_UNREADABLE')
    x0, y0, rx, ry, rot, large, sweep, x1, y1 = m.groups()
    return float(x0), float(y0), float(rx), float(ry), float(rot), int(large), int(sweep), float(x1), float(y1)


def svg_arc_points(x1, y1, rx, ry, phi_deg, fa, fs, x2, y2, n):
    """points along an SVG elliptical arc (the endpoint-to-centre conversion of the SVG specification)"""
    phi = math.radians(phi_deg)
    cp, sp = math.cos(phi), math.sin(phi)
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    x1p, y1p = cp * dx + sp * dy, -sp * dx + cp * dy
    rx, ry = abs(rx), abs(ry)
    lam = (x1p / rx) ** 2 + (y1p / ry) ** 2
    if lam > 1: rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = (rx * ry) ** 2 - (rx * y1p) ** 2 - (ry * x1p) ** 2
    den = (rx * y1p) ** 2 + (ry * x1p) ** 2
    co = math.sqrt(max(0.0, num / den)) if den else 0.0
    if fa == fs: co = -co
    cxp, cyp = co * rx * y1p / ry, -co * ry * x1p / rx
    cx, cy = cp * cxp - sp * cyp + (x1 + x2) / 2, sp * cxp + cp * cyp + (y1 + y2) / 2
    th1 = math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx)
    th2 = math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx)
    dth = th2 - th1
    if fs == 0 and dth > 0: dth -= 2 * math.pi
    elif fs == 1 and dth < 0: dth += 2 * math.pi
    out = []
    for k in range(n + 1):
        th = th1 + dth * k / n
        out.append((cx + cp * rx * math.cos(th) - sp * ry * math.sin(th), cy + sp * rx * math.cos(th) + cp * ry * math.sin(th)))
    return out


def _parse_subpaths(d):
    subs = []
    for chunk in re.findall(r'M([^M]*)', d or ''):
        body = chunk.strip()
        if body.endswith('Z'): body = body[:-1]
        pts = []
        for part in body.split('L'):
            nums = part.split()
            if len(nums) != 2: raise ValueError('SOLID_CUT_FACE_PATH_UNREADABLE')
            pts.append((float(nums[0]), float(nums[1])))
        subs.append(pts)
    return subs


def _unit_circle_arc_ok(pts, centre_px, scale, e1, e2, r, t0, t1, errors, ident):
    """every point of a drawn arc lies on the projection of the circle through e1, e2 about the centre, within the angles t0..t1 (fractions of a quarter turn)"""
    p1, p2 = project(e1), project(e2)
    a, b, c, d = scale * p1[0], scale * p2[0], -scale * p1[1], -scale * p2[1]
    det = a * d - b * c
    if abs(det) < 1e-9:
        errors.append('SOLID_SPHERE_CUT_ARC_DEGENERATE:' + ident)
        return
    for (x, y) in pts:
        vx, vy = x - centre_px[0], y - centre_px[1]
        u, w = (d * vx - b * vy) / det, (-c * vx + a * vy) / det
        if abs(math.hypot(u, w) - r) * scale > 1.0:
            errors.append('SOLID_SPHERE_CUT_ARC_OFF_CIRCLE:' + ident)
            return
        ang = math.atan2(w, u) / (math.pi / 2)
        if ang < t0 - 0.02 or ang > t1 + 0.02:
            errors.append('SOLID_SPHERE_CUT_ARC_OUT_OF_SPAN:' + ident)
            return


def _cut_pieces(root, sid, role, tag):
    out = {}
    for e in root.iter(NS + tag):
        if e.get('data-solid') == sid and e.get('data-role') == role: out.setdefault(e.get('data-arc') if tag == 'path' else e.get('data-edge'), []).append(e)
    return out


def _cut_frame(solid, root, errors):
    """scale and translation of a cut sphere from its own rim arcs and radii: the longest piece, drawn between the two points it should join"""
    sid, r = solid['id'], solid['r0']
    best = None
    for ident, els in _cut_pieces(root, sid, 'cut-arc', 'path').items():
        if not ident or len(ident) != 3: continue
        n, i, j = PLANE_AXES[ident[0]]
        e1, e2 = vmul(AXIS_VEC[i], 1 if ident[1] == '+' else -1), vmul(AXIS_VEC[j], 1 if ident[2] == '+' else -1)
        for e in els:
            t0, t1 = _num(e, 'data-t0'), _num(e, 'data-t1')
            x0, y0, _rx, _ry, _rot, _l, _s, x1, y1 = _parse_arc_full(e.get('d'))
            a = tuple(r * (math.cos(t0 * math.pi / 2) * e1[k] + math.sin(t0 * math.pi / 2) * e2[k]) for k in range(3))
            b = tuple(r * (math.cos(t1 * math.pi / 2) * e1[k] + math.sin(t1 * math.pi / 2) * e2[k]) for k in range(3))
            pa, pb = project(a), project(b)
            want = math.hypot(pb[0] - pa[0], pb[1] - pa[1])
            if want > 1e-6 and (best is None or want > best[0]): best = (want, math.hypot(x1 - x0, y1 - y0) / want, (x0, y0), a)
    for ident, els in _cut_pieces(root, sid, 'cut-crease', 'line').items():
        if not ident or len(ident) != 2 or ident[1] not in 'XYZ': continue
        k = 'XYZ'.index(ident[1])
        sign = 1 if ident[0] == '+' else -1
        for e in els:
            t0, t1 = _num(e, 'data-t0'), _num(e, 'data-t1')
            a, b = vmul(AXIS_VEC[k], sign * r * t0), vmul(AXIS_VEC[k], sign * r * t1)
            pa, pb = project(a), project(b)
            want = math.hypot(pb[0] - pa[0], pb[1] - pa[1])
            if want > 1e-6 and (best is None or want > best[0]): best = (want, math.hypot(_num(e, 'x2') - _num(e, 'x1'), _num(e, 'y2') - _num(e, 'y1')) / want, (_num(e, 'x1'), _num(e, 'y1')), a)
    if best is None:
        errors.append('SOLID_NO_CURVES:' + sid)
        return None, None
    S, start, a = best[1], best[2], best[3]
    qa = project(a)
    centre = (start[0] - S * qa[0], start[1] + S * qa[1])
    q = project((0.0, 0.0, r))
    return S, (centre[0] - S * q[0], centre[1] + S * q[1])


def check_cut_sphere(solid, root, px, scale, errors, segments):
    sid, r = solid['id'], solid['r0']
    feats = cut_features(solid)
    cut = feats['cut']
    C = px((0.0, 0.0, r))

    def loc(v):
        q = project(v)
        return (C[0] + scale * q[0], C[1] - scale * q[1])

    def arc_at(ident, t):
        f = feats['faces'][ident]
        th = t * math.pi / 2
        return tuple(r * (math.cos(th) * f['e1'][k] + math.sin(th) * f['e2'][k]) for k in range(3))
    # the elements of this solid are all known roles
    for e in root.iter():
        if e.get('data-solid') == sid and e.get('data-role') not in ('cut-face', 'cut-arc', 'cut-crease', 'sphere-limb', 'center-dot', 'dim-line'):
            errors.append('SOLID_SPHERE_CUT_ELEMENT_UNKNOWN:%s:%s' % (sid, e.get('data-role')))
    # rim arcs: one set of pieces per boundary quarter-disk, tiling the arc, each solid or dashed as the depth test says
    arcs = _cut_pieces(root, sid, 'cut-arc', 'path')
    if set(arcs) != set(feats['faces']): errors.append('SOLID_SPHERE_CUT_ARC_SET_MISMATCH:%s:%s' % (sorted(set(arcs) ^ set(feats['faces']))[:6], sid))
    for ident, els in arcs.items():
        if ident not in feats['faces']: continue
        f = feats['faces'][ident]
        runs = []
        for e in els:
            t0, t1 = _num(e, 'data-t0'), _num(e, 'data-t1')
            x0, y0, rx, ry, rot, large, sweep, x1, y1 = _parse_arc_full(e.get('d'))
            if large != 0: errors.append('SOLID_SPHERE_CUT_ARC_FLAGS:' + ident)
            for (got, want) in (((x0, y0), loc(arc_at(ident, t0))), ((x1, y1), loc(arc_at(ident, t1)))):
                if math.hypot(got[0] - want[0], got[1] - want[1]) > POS_TOL: errors.append('SOLID_SPHERE_CUT_ARC_ENDPOINT_OFF:' + ident)
            drawn = svg_arc_points(x0, y0, rx, ry, rot, large, sweep, x1, y1, 12)
            _unit_circle_arc_ok(drawn, C, scale, f['e1'], f['e2'], r, t0, t1, errors, ident)
            segments.extend((drawn[k], drawn[k + 1]) for k in range(len(drawn) - 1))
            votes = sum(1 for k in range(5) if cut_hits(cut, arc_at(ident, t0 + (t1 - t0) * (k + 0.5) / 5), r))
            _stroke_ok(e, votes >= 3, errors, ident)
            if votes not in (0, 5) and (t1 - t0) * math.pi / 2 * r * scale > 1.5: errors.append('SOLID_SPHERE_CUT_PIECE_STRADDLES:' + ident)
            runs.append((t0, t1, _dashed(e)))
        runs.sort()
        if runs and (abs(runs[0][0]) > CUT_TOL_T or abs(runs[-1][1] - 1) > CUT_TOL_T or any(abs(runs[k + 1][0] - runs[k][1]) > CUT_TOL_T for k in range(len(runs) - 1))): errors.append('SOLID_SPHERE_CUT_ARC_NOT_COVERED:' + ident)
        n = 200
        want_hidden = sum(1 for k in range(n) if cut_hits(cut, arc_at(ident, (k + 0.5) / n), r)) / n
        if abs(want_hidden - sum(b - a for a, b, dashed in runs if dashed)) > 0.02: errors.append('SOLID_SPHERE_CUT_BREAK_MISMATCH:' + ident)
    # radii where cut faces meet
    creases = _cut_pieces(root, sid, 'cut-crease', 'line')
    if set(creases) != set(feats['creases']): errors.append('SOLID_SPHERE_CUT_CREASE_SET_MISMATCH:%s:%s' % (sorted(set(creases) ^ set(feats['creases']))[:6], sid))
    for ident, els in creases.items():
        if ident not in feats['creases']: continue
        k, sign = feats['creases'][ident]['axis'], feats['creases'][ident]['sign']
        at = lambda t: vmul(AXIS_VEC[k], sign * r * t)
        runs = []
        for e in els:
            t0, t1 = _num(e, 'data-t0'), _num(e, 'data-t1')
            for (got, want) in (((_num(e, 'x1'), _num(e, 'y1')), loc(at(t0))), ((_num(e, 'x2'), _num(e, 'y2')), loc(at(t1)))):
                if math.hypot(got[0] - want[0], got[1] - want[1]) > POS_TOL: errors.append('SOLID_SPHERE_CUT_CREASE_ENDPOINT_OFF:' + ident)
            votes = sum(1 for m in range(5) if cut_hits(cut, at(t0 + (t1 - t0) * (m + 0.5) / 5), r))
            _stroke_ok(e, votes >= 3, errors, ident)
            if votes not in (0, 5) and (t1 - t0) * r * scale > 1.5: errors.append('SOLID_SPHERE_CUT_PIECE_STRADDLES:' + ident)
            runs.append((t0, t1, _dashed(e)))
        runs.sort()
        if runs and (abs(runs[0][0]) > CUT_TOL_T or abs(runs[-1][1] - 1) > CUT_TOL_T or any(abs(runs[k2 + 1][0] - runs[k2][1]) > CUT_TOL_T for k2 in range(len(runs) - 1))): errors.append('SOLID_SPHERE_CUT_CREASE_NOT_COVERED:' + ident)
        n = 200
        want_hidden = sum(1 for m in range(n) if cut_hits(cut, at((m + 0.5) / n), r)) / n
        if abs(want_hidden - sum(b - a for a, b, dashed in runs if dashed)) > 0.02: errors.append('SOLID_SPHERE_CUT_BREAK_MISMATCH:' + ident)
    # the limb: the circle of the sphere the view grazes; drawn exactly where the piece reaches it
    limb = [e for e in root.iter(NS + 'path') if e.get('data-solid') == sid and e.get('data-role') == 'sphere-limb']
    spans = []
    for e in limb:
        x0, y0, rx, ry, large, sweep, x1, y1 = _parse_arc(e.get('d'))
        if abs(rx - scale * r) > POS_TOL or abs(ry - scale * r) > POS_TOL: errors.append('SOLID_SPHERE_OUTLINE_RADIUS:' + sid)
        angs = []
        for (x, y) in ((x0, y0), (x1, y1)):
            if abs(math.hypot(x - C[0], y - C[1]) - scale * r) > POS_TOL: errors.append('SOLID_SPHERE_OUTLINE_OFF:' + sid)
            angs.append(math.atan2(-(y - C[1]), x - C[0]) % (2 * math.pi))
        span = (angs[1] - angs[0]) % (2 * math.pi)
        if sweep != 0 or large != (1 if span > math.pi else 0): errors.append('SOLID_ARC_FLAGS_INCONSISTENT:' + str(e.get('id')))
        spans.append((angs[0], span))
        for k in range(25):
            a0, a1 = angs[0] + span * k / 25, angs[0] + span * (k + 1) / 25
            segments.append(((C[0] + scale * r * math.cos(a0), C[1] - scale * r * math.sin(a0)), (C[0] + scale * r * math.cos(a1), C[1] - scale * r * math.sin(a1))))
        mid = angs[0] + span / 2
        q = tuple(r * (math.cos(mid) * SCREEN_X[k] + math.sin(mid) * SCREEN_Y[k]) for k in range(3))
        octant = ''.join('+' if v >= 0 else '-' for v in q)
        if e.get('data-octant') != octant: errors.append('SOLID_SPHERE_CUT_LIMB_OCTANT:' + str(e.get('id')))
    n = 720
    for k in range(n):
        phi = 2 * math.pi * (k + 0.5) / n
        v = tuple(r * (math.cos(phi) * SCREEN_X[m] + math.sin(phi) * SCREEN_Y[m]) for m in range(3))
        want = cut_inside(cut, v, r)
        # a sample within a degree of the end of a drawn stretch or of a coordinate plane may fall either way
        near_end = any(min((phi - a) % (2 * math.pi), (a - phi) % (2 * math.pi)) < math.radians(1.0) or min((phi - (a + s)) % (2 * math.pi), ((a + s) - phi) % (2 * math.pi)) < math.radians(1.0) for a, s in spans)
        near_plane = any(abs(c) < 0.02 * r for c in v)
        got = any(((phi - a) % (2 * math.pi)) <= s for a, s in spans)
        if got != want and not near_end and not near_plane:
            errors.append('SOLID_SPHERE_CUT_LIMB_MISMATCH:' + sid)
            break
    # flat faces: exactly the seen boundary quarter-disks; quarter-disks of one plane that face one way and touch along a radius are one fill (a half-disk, three
    # quarters, a whole disk), painted beneath the strokes and exactly covering their quarter-disks
    QUAD = {'++': 0, '-+': 1, '--': 2, '+-': 3}
    groups = {}
    for ident, f in feats['faces'].items():
        if f['visible']: groups.setdefault((f['plane'], f['outward']), []).append(ident)
    expected = {}
    for (plane, outward), idents in groups.items():
        have = {QUAD[i[1:]] for i in idents}
        if len(have) == 4: runs = [(0, 4)]
        else:
            runs = []
            for k in sorted(have):
                if (k - 1) % 4 not in have:
                    n = 1
                    while (k + n) % 4 in have: n += 1
                    runs.append((k, n))
        for k0, n in runs:
            expected[frozenset(i for i in idents if (QUAD[i[1:]] - k0) % 4 < n)] = (plane, k0, n)
    order = {id(e): k for k, e in enumerate(root.iter())}
    first_stroke = min([order[id(e)] for e in root.iter() if e.get('data-solid') == sid and e.get('data-role') in ('cut-arc', 'cut-crease', 'sphere-limb')] or [10 ** 9])
    drawn_sets = []
    for e in root.iter(NS + 'path'):
        if e.get('data-solid') != sid or e.get('data-role') != 'cut-face': continue
        ids = frozenset((e.get('data-faces') or '').split())
        drawn_sets.append(ids)
        if order[id(e)] > first_stroke: errors.append('SOLID_SPHERE_CUT_FACE_NOT_BENEATH:' + str(e.get('id')))
        subs = _parse_subpaths(e.get('d'))
        if len(subs) != 1 or ids not in expected:
            errors.append('SOLID_SPHERE_CUT_FACE_PIECES_MISMATCH:' + str(e.get('id')))
            continue
        plane, k0, n = expected[ids]
        _, i_ax, j_ax = PLANE_AXES[plane]
        p1, p2 = project(AXIS_VEC[i_ax]), project(AXIS_VEC[j_ax])
        a_, b_, c_, d_ = scale * p1[0], scale * p2[0], -scale * p1[1], -scale * p2[1]
        det = a_ * d_ - b_ * c_
        coords = [((d_ * (x - C[0]) - b_ * (y - C[1])) / det, (-c_ * (x - C[0]) + a_ * (y - C[1])) / det) for x, y in subs[0]]
        near_centre = [q for q in coords if math.hypot(q[0], q[1]) * scale < CUT_FACE_VERTEX_TOL]
        rim = [q for q in coords if math.hypot(q[0], q[1]) * scale >= CUT_FACE_VERTEX_TOL]
        ok = len(near_centre) == (0 if n == 4 else 1) and len(rim) >= 8 * n
        if ok and any(abs(math.hypot(q[0], q[1]) - r) * scale > CUT_FACE_VERTEX_TOL for q in rim): ok = False
        if ok:
            # the rim vertices run one way round, in steps of at most 8 degrees, and cover exactly the span of their quarter-disks
            angs = [math.degrees(math.atan2(q[1], q[0])) for q in rim]
            steps = [((angs[m + 1] - angs[m] + 180) % 360) - 180 for m in range(len(angs) - 1)]
            if n == 4: steps.append(((angs[0] - angs[-1] + 180) % 360) - 180)
            direction = 1 if sum(steps) > 0 else -1
            if any(st * direction <= 0 or abs(st) > 8.0 for st in steps): ok = False
            if ok and n < 4:
                lo, hi = 90.0 * k0, 90.0 * (k0 + n)
                def near(x, y): return min((x - y) % 360, (y - x) % 360) <= 3.0
                if not ((near(angs[0], lo) and near(angs[-1], hi)) or (near(angs[0], hi) and near(angs[-1], lo))): ok = False
        if ok:
            area = abs(sum(coords[m][0] * coords[(m + 1) % len(coords)][1] - coords[(m + 1) % len(coords)][0] * coords[m][1] for m in range(len(coords)))) / 2
            if abs(area - n * math.pi * r * r / 4) > 0.01 * n * math.pi * r * r / 4: ok = False
        if not ok: errors.append('SOLID_SPHERE_CUT_FACE_SHAPE_MISMATCH:' + str(e.get('id')))
    if sorted(map(sorted, drawn_sets)) != sorted(map(sorted, expected)): errors.append('SOLID_SPHERE_CUT_FACE_SET_MISMATCH:' + sid)
    # the named centre carries a dot; an unnamed one none
    dots = [e for e in root.iter(NS + 'circle') if e.get('data-solid') == sid and e.get('data-role') == 'center-dot']
    named = any(name for name, _pid, _p in solid['points'])
    if named != bool(dots) or len(dots) > 1: errors.append('SOLID_SPHERE_CUT_CENTRE_DOT_MISMATCH:' + sid)
    for e in dots:
        if math.hypot(_num(e, 'cx') - C[0], _num(e, 'cy') - C[1]) > POS_TOL: errors.append('SOLID_SPHERE_CUT_CENTRE_DOT_OFF:' + sid)
    # the radius dimension line: from the centre along the chosen half axis
    axis = cut_radius_axis(solid)
    for e in root.iter(NS + 'line'):
        if e.get('data-solid') != sid or e.get('data-role') != 'dim-line' or e.get('data-kind') != 'RADIUS': continue
        if axis is None:
            errors.append('SOLID_SPHERE_CUT_RADIUS_HIDDEN:' + sid)
            continue
        want = (loc((0.0, 0.0, 0.0)), loc(vmul(AXIS_VEC[axis[0]], axis[1] * r)))
        got = ((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2')))
        if any(math.hypot(got[i][0] - want[i][0], got[i][1] - want[i][1]) > POS_TOL for i in (0, 1)): errors.append('SOLID_SPHERE_CUT_RADIUS_LINE_MISMATCH:' + str(e.get('data-dim')))


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
                if name not in named or value != ctx['label_text'].get(name, name): errors.append('SOLID_NAME_MISMATCH:' + lid)
                else: anchor = named[name][1]
            if anchor is None:
                errors.append('SOLID_NAME_ANCHOR_UNKNOWN:' + lid)
                continue
            cx, cy = box[0] + box[2] / 2, box[1] + box[3] / 2
            d = _box_seg_dist(box, anchor, anchor)
            if d < 1.5: errors.append('SOLID_NAME_ON_VERTEX:' + lid)
            # a vertex with several names ("M,A,I") is one wide label: its centre is half its width farther out; a single name keeps the 48 px bound
            far = 48 + (box[2] / 2 if ',' in (value or '') else 0)
            if math.hypot(cx - anchor[0], cy - anchor[1]) > far: errors.append('SOLID_NAME_FAR_FROM_VERTEX:' + lid)
        elif role == 'face-label':
            check_face_label(g, box, ctx)
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
    drawn_face_labels = sorted(str(g.get('data-face-of')) for g in ctx['labels'] if g.get('data-label-role') == 'face-label')
    if drawn_face_labels != sorted(ctx.get('face_label_plan') or {}): errors.append('SOLID_FACE_LABEL_SET_MISMATCH')
    plan_names = ctx.get('expected_name_labels')
    if plan_names is not None:
        got = sorted(g.get('id') for g in ctx['labels'] if g.get('data-label-role') == 'vertex-name')
        if got != sorted(plan_names): errors.append('SOLID_NAME_LABEL_SET_MISMATCH')


def _inside_region(region, q, margin=0.0):
    """q lies inside a region: ('poly', points) or ('circle', cx, cy, r), at least `margin` px from its outline"""
    if region[0] == 'circle':
        return math.hypot(q[0] - region[1], q[1] - region[2]) <= region[3] - margin
    pts = region[1]
    return _winding_inside(pts, q) and min(_seg_dist(q, pts[i], pts[(i + 1) % len(pts)]) for i in range(len(pts))) >= margin


def check_face_label(g, box, ctx):
    """net.faceLabels: the label of a face writes that face's area (a number is checked against the area worked out from the plan, a symbol is not) and lies wholly inside the face"""
    errors = ctx['errors']
    fid = g.get('data-face-of')
    entry = (ctx.get('face_label_plan') or {}).get(fid)
    lid = str(g.get('id'))
    if entry is None or g.get('id') != 'face-label-%s' % fid:
        errors.append('SOLID_FACE_LABEL_UNKNOWN:' + lid)
        return
    want = (ctx.get('face_areas') or {}).get(fid)
    tex = g.get('data-tex') or ''
    number = label_number(tex)
    symbolic = entry.get('text') is not None and label_number(entry['text']) is None
    if want is None:
        errors.append('SOLID_FACE_LABEL_UNKNOWN:' + lid)
        return
    if symbolic:
        if number is not None: errors.append('SOLID_FACE_LABEL_VALUE_MISMATCH:%s:%s' % (fid, tex))
    else:
        if g.get('data-numeric') != '1' or number is None: errors.append('SOLID_FACE_LABEL_NOT_NUMERIC:' + str(fid))
        elif abs(number - want) > 1e-6 * max(1.0, want): errors.append('SOLID_FACE_LABEL_VALUE_MISMATCH:%s:%s' % (fid, tex))
        if ctx.get('unit') and number is not None and '\\mathrm{%s}^2' % ctx['unit'] not in tex: errors.append('SOLID_FACE_LABEL_UNIT_MISSING:' + str(fid))
    region = (ctx.get('face_regions') or {}).get(fid)
    if region is None or box is None: return
    x, y, w, h = box
    if not all(_inside_region(region, c, 1.0) for c in ((x, y), (x + w, y), (x, y + h), (x + w, y + h), (x + w / 2, y + h / 2))): errors.append('SOLID_FACE_LABEL_OUTSIDE_FACE:' + str(fid))


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
                norm = ctx.get('norm') or (lambda x: x)
                A, B = named[norm(a)], named[norm(b)]
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
        except (KeyError, TypeError, ValueError):
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
    check_excluded_circles(net, circles, ['bottom', 'top'], errors)
    ctx['face_label_plan'] = {e.get('face'): e for e in net.get('faceLabels') or []}
    ctx['face_areas'] = {'rect': 2 * math.pi * r * h, 'bottom': math.pi * r * r, 'top': math.pi * r * r}
    ctx['face_regions'] = {'rect': ('poly', [(min(xs), min(ys)), (max(xs), min(ys)), (max(xs), max(ys)), (min(xs), max(ys))]),
                           'bottom': ('circle', _num(circles['bottom'], 'cx'), _num(circles['bottom'], 'cy'), _num(circles['bottom'], 'r')),
                           'top': ('circle', _num(circles['top'], 'cx'), _num(circles['top'], 'cy'), _num(circles['top'], 'r'))}
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
    check_excluded_circles(net, {'base': base}, ['base'], errors)
    ctx['face_label_plan'] = {e.get('face'): e for e in net.get('faceLabels') or []}
    ctx['face_areas'] = {'sector': math.pi * r * l, 'base': math.pi * r * r}
    ctx['face_regions'] = {'base': ('circle', cx, cy, cr)}
    table = {'slant': (l, ((ax, ay), (x2, y2))), 'arc': (2 * math.pi * r, ((ax + axis[0] * R1 - 0.12 * R1 * axis[1], ay + axis[1] * R1 + 0.12 * R1 * axis[0]), (ax + axis[0] * R1 + 0.12 * R1 * axis[1], ay + axis[1] * R1 - 0.12 * R1 * axis[0]))), 'radius': (r, None), 'angle': (want, ((ax, ay), (ax + axis[0] * R1 * 0.35, ay + axis[1] * R1 * 0.35)))}
    ctx['net_dims'] = _dim_defs(plan, ctx, table)
    _fill_dim_lines(ctx)
    # the sector outline as obstacle segments
    a1 = math.atan2(y1 - ay, x1 - ax)
    a2 = math.atan2(y2 - ay, x2 - ax)
    d = (a2 - a1) % (2 * math.pi)
    if want > 180 and d < math.pi: d = d - 2 * math.pi
    pts = [(ax + R1 * math.cos(a1 + d * k / 32), ay + R1 * math.sin(a1 + d * k / 32)) for k in range(33)]
    ctx['face_regions']['sector'] = ('poly', [(ax, ay)] + pts)
    ctx['segments'] += [((ax, ay), pts[0])] + [(pts[k], pts[k + 1]) for k in range(32)] + [(pts[-1], (ax, ay))]
    ctx['segments'] += _circle_segments(cx, cy, cr)


def check_excluded_circles(net, circles, parts, errors):
    """net.excluded: exactly the listed circles are drawn dashed and grey (not part of the surface), the others are plain"""
    want = set(net.get('excluded') or [])
    if len(want) != len(net.get('excluded') or []) or not want <= set(parts): errors.append('SOLID_NET_EXCLUDED_PLAN_INVALID')
    for part in parts:
        el = circles.get(part)
        if el is None: continue
        excluded = el.get('data-excluded') == '1'
        if excluded != (part in want): errors.append('SOLID_NET_EXCLUDED_SET_MISMATCH:' + part)
        style_ok = (_dashed(el) and (el.get('stroke') or '').lower() == '#888') if part in want else (not _dashed(el) and (el.get('stroke') or '').lower() == '#111')
        if not style_ok: errors.append('SOLID_NET_EXCLUDED_STYLE_MISMATCH:' + part)


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


def area3(cyc, P3):
    """the area of a planar face given as a cycle of vertex indices (half the length of the sum of cross products)"""
    nrm = (0.0, 0.0, 0.0)
    for i in range(len(cyc)): nrm = vadd(nrm, vcross(P3(cyc[i]), P3(cyc[(i + 1) % len(cyc)])))
    return vlen(nrm) / 2


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
    ctx['face_label_plan'] = {e.get('face'): e for e in net.get('faceLabels') or []}
    ctx['face_areas'] = {fid: area3(cyc, P3) for fid, cyc in cycles.items()}
    ctx['face_regions'] = {fid: ('poly', polys[fid]) for fid in ids}
    segs = []
    for fid in ids:
        poly = polys[fid]
        segs += [(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))]
    ctx['segments'] += segs
    audit_net_layout_and_emphasis(net, ctx, cycles, polys, P3, root_id, joins, solid)


# --- net layout re-derived from the plan, tinted faces and stressed edges ---------------------------------------------------------------------------------
NET_FILL_STYLE = {'LIGHT': ('#7fa6e8', 0.32), 'MEDIUM': ('#7fa6e8', 0.55)}
NET_ACCENT_STROKE = '#c0392b'


def net_flatten(pts3):
    """a face (cycle seen counter-clockwise from outside) in its own plane: origin at its first vertex, x along its first edge"""
    nrm = (0.0, 0.0, 0.0)
    for i in range(len(pts3)): nrm = vadd(nrm, vcross(pts3[i], pts3[(i + 1) % len(pts3)]))
    nrm = vunit(nrm)
    ex = vunit(vsub(pts3[1], pts3[0]))
    ey = vcross(nrm, ex)
    return [complex(vdot(vsub(p, pts3[0]), ex), vdot(vsub(p, pts3[0]), ey)) for p in pts3]


def net_layout(cycles, P3, root_id, joins):
    """face id -> corner list (complex) of the net unfolded along the plan's joins, in the root face's own frame; None when the joins cannot be unfolded"""
    flat = {fid: net_flatten([P3(i) for i in cyc]) for fid, cyc in cycles.items()}
    placed = {root_id: list(flat[root_id])}
    pending = [tuple(j) for j in joins]
    while pending:
        k = next((i for i, (par, chi) in enumerate(pending) if par in placed and chi not in placed), None)
        if k is None: return None
        par, chi = pending.pop(k)
        cp, cc = cycles[par], cycles[chi]
        common = [v for v in cp if v in cc]
        if len(common) != 2: return None
        edge = next(((cp[i], cp[(i + 1) % len(cp)]) for i in range(len(cp)) if cp[i] in common and cp[(i + 1) % len(cp)] in common), None)
        if edge is None: return None
        a, b = edge
        pa, pb = placed[par][cp.index(a)], placed[par][cp.index(b)]
        ca, cb = flat[chi][cc.index(a)], flat[chi][cc.index(b)]
        if abs(pb - pa) < 1e-12 or abs(cb - ca) < 1e-12: return None
        turn = ((pb - pa) / abs(pb - pa)) / ((cb - ca) / abs(cb - ca))
        placed[chi] = [turn * (q - ca) + pa for q in flat[chi]]
    return placed if len(placed) == len(cycles) else None


def net_fit(layout_root, svg_root):
    """the similarity (a mirror image when the picture's y runs down) taking the root face's layout onto its drawn polygon; None when no such map fits all corners"""
    s0, s1 = complex(*svg_root[0]), complex(*svg_root[1])
    for mirror in (True, False):
        f = (lambda z: z.conjugate()) if mirror else (lambda z: z)
        w0, w1 = f(layout_root[0]), f(layout_root[1])
        if abs(w1 - w0) < 1e-12: return None
        a = (s1 - s0) / (w1 - w0)
        b = s0 - a * w0
        if all(abs(a * f(z) + b - complex(*sp)) <= POS_TOL for z, sp in zip(layout_root, svg_root)):
            return lambda z, a=a, b=b, f=f: a * f(z) + b
    return None


def _px_pair_same(a, b):
    d = lambda p, q: math.hypot(p[0] - q[0], p[1] - q[1])
    return (d(a[0], b[0]) <= POS_TOL and d(a[1], b[1]) <= POS_TOL) or (d(a[0], b[1]) <= POS_TOL and d(a[1], b[0]) <= POS_TOL)


def _net_line_role(e):
    stroke = (e.get('stroke') or '').lower()
    try: width = float(e.get('stroke-width') or 0)
    except ValueError: return '?'
    if stroke == NET_ACCENT_STROKE and width >= 2.2: return 'ACCENT'
    if stroke == '#111' and width >= 2.2: return 'REF'
    if stroke == '#111' and width <= 1.8: return None
    return '?'


def audit_net_layout_and_emphasis(net, ctx, cycles, polys, P3, root_id, joins, solid):
    root, errors = ctx['root'], ctx['errors']
    layout = net_layout(cycles, P3, root_id, joins)
    if layout is None:
        errors.append('SOLID_NET_LAYOUT_UNRESOLVED')
        return
    fit = net_fit(layout[root_id], polys[root_id])
    if fit is None:
        errors.append('SOLID_NET_LAYOUT_MISMATCH:' + root_id)
        return
    expected_px = {fid: [(fit(z).real, fit(z).imag) for z in pts] for fid, pts in layout.items()}
    for fid, want in expected_px.items():
        got = polys.get(fid) or []
        if len(got) != len(want) or any(math.hypot(g[0] - w[0], g[1] - w[1]) > POS_TOL for g, w in zip(got, want)): errors.append('SOLID_NET_LAYOUT_MISMATCH:' + fid)
    order = {id(el): k for k, el in enumerate(root.iter())}
    first_line = min([order[id(e)] for e in root.iter(NS + 'line') if e.get('data-role') == 'net-edge'] or [10 ** 9])
    first_label = min([order[id(g)] for g in ctx['labels']] or [10 ** 9])
    # tinted faces: exactly the planned faces, each drawn on that face's own polygon, under every line and label
    want_fill = {}
    for h in net.get('highlights') or []:
        if h.get('face') in want_fill or h.get('face') not in cycles: errors.append('SOLID_NET_HIGHLIGHT_PLAN_INVALID')
        else: want_fill[h['face']] = h.get('fill') or 'LIGHT'
    drawn = {}
    for el in root.iter(NS + 'polygon'):
        if el.get('data-role') != 'net-highlight': continue
        if el.get('data-face') in drawn: errors.append('SOLID_NET_HIGHLIGHT_DUPLICATE:' + str(el.get('data-face')))
        drawn[el.get('data-face')] = el
    if sorted(want_fill) != sorted(drawn): errors.append('SOLID_NET_HIGHLIGHT_SET_MISMATCH')
    for fid, el in drawn.items():
        if fid not in want_fill: continue
        want = expected_px[fid]
        got = _points(el.get('points'))
        if len(got) != len(want) or any(math.hypot(g[0] - w[0], g[1] - w[1]) > POS_TOL for g, w in zip(got, want)): errors.append('SOLID_NET_HIGHLIGHT_FACE_MISMATCH:' + fid)
        color, opacity = NET_FILL_STYLE.get(want_fill[fid], ('?', -1.0))
        try: opac = float(el.get('fill-opacity'))
        except (TypeError, ValueError): opac = -2.0
        if (el.get('fill') or '').lower() != color or abs(opac - opacity) > 1e-9 or el.get('data-fill') != want_fill[fid]: errors.append('SOLID_NET_HIGHLIGHT_FILL_MISMATCH:' + fid)
        if order[id(el)] > min(first_line, first_label): errors.append('SOLID_NET_HIGHLIGHT_OVER_LINES:' + fid)
    # stressed edges: the planned edges, nothing else, drawn in the planned role
    names_by_face = {}
    for fid, cyc in cycles.items():
        given = (net.get('corners') or {}).get(fid)
        names_by_face[fid] = list(given) if given is not None else [solid['verts'][i][0] for i in cyc]
    expected = []
    expected_diagonals = []   # ((px, px), role, label, face id, 'i-j')

    def adjacent(n, i, j): return (i + 1) % n == j or (j + 1) % n == i
    for s in net.get('segments') or []:
        role = s.get('role') or 'ACCENT'
        if s.get('diagonal') is not None:
            fid, pair = s.get('face'), s['diagonal']
            if fid not in cycles or not isinstance(pair, list) or len(pair) != 2 or not all(isinstance(v, int) for v in pair):
                errors.append('SOLID_NET_SEGMENT_PLAN_INVALID')
                continue
            i, j = sorted(pair)
            n = len(cycles[fid])
            if not 0 <= i < j < n or adjacent(n, i, j):
                errors.append('SOLID_NET_SEGMENT_PLAN_INVALID')
                continue
            pts = expected_px[fid]
            expected_diagonals.append(((pts[i], pts[j]), role, '%s:%d-%d' % (fid, i, j), fid, '%d-%d' % (i, j)))
            continue
        if s.get('face') is not None:
            fid, ei = s['face'], s['edge']
            if fid not in cycles or not isinstance(ei, int) or not 0 <= ei < len(cycles[fid]):
                errors.append('SOLID_NET_SEGMENT_PLAN_INVALID')
                continue
            pts = expected_px[fid]
            expected.append(((pts[ei], pts[(ei + 1) % len(pts)]), role, '%s:%d' % (fid, ei)))
        else:
            a_name, b_name = s.get('from'), s.get('to')
            found = []
            for fid, cyc in cycles.items():
                names, pts = names_by_face[fid], expected_px[fid]
                n = len(cyc)
                for k in range(n):
                    x = names[k] if k < len(names) else None
                    y = names[(k + 1) % n] if (k + 1) % n < len(names) else None
                    if x and y and {x, y} == {a_name, b_name}: found.append((pts[k], pts[(k + 1) % n]))
            if not found:
                # no drawn edge carries the two names: a diagonal of one face (both names on it, not neighbours) does
                diagonals = []
                for fid, cyc in cycles.items():
                    names, pts = names_by_face[fid], expected_px[fid]
                    n = len(cyc)
                    if a_name in names and b_name in names:
                        i, j = sorted((names.index(a_name), names.index(b_name)))
                        if i != j and not adjacent(n, i, j): diagonals.append(((pts[i], pts[j]), fid, '%d-%d' % (i, j)))
                if diagonals and all(_px_pair_same(diagonals[0][0], d[0]) for d in diagonals):
                    expected_diagonals.append((diagonals[0][0], role, '%s%s' % (a_name, b_name), diagonals[0][1], diagonals[0][2]))
                    continue
            if not found or any(not _px_pair_same(found[0], f) for f in found):
                errors.append('SOLID_NET_SEGMENT_PLAN_UNRESOLVED:%s%s' % (a_name, b_name))
                continue
            expected.append((found[0], role, '%s%s' % (a_name, b_name)))
    net_lines = [e for e in root.iter(NS + 'line') if e.get('data-role') == 'net-edge']
    drawn_lines = [(e, ((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))), _net_line_role(e)) for e in net_lines]
    for seg, role, label in expected:
        hits = [d for d in drawn_lines if _px_pair_same(d[1], seg)]
        if len(hits) != 1: errors.append('SOLID_NET_EMPHASIS_EDGE_MISSING:' + label)
        elif hits[0][2] != role: errors.append('SOLID_NET_EMPHASIS_ROLE_MISMATCH:' + label)
    for e, seg, role in drawn_lines:
        ident = str(e.get('id'))
        if role == '?': errors.append('SOLID_NET_EDGE_STYLE_UNKNOWN:' + ident)
        elif role is not None and not any(_px_pair_same(seg, x[0]) for x in expected): errors.append('SOLID_NET_EMPHASIS_UNEXPECTED:' + ident)
        if e.get('data-accent') != role: errors.append('SOLID_NET_ACCENT_ATTRIBUTE_INCONSISTENT:' + ident)
    # stressed face diagonals: exactly the planned ones, each on its own face between the two planned corners, in the planned role
    diag_els = [e for e in root.iter(NS + 'line') if e.get('data-role') == 'net-diagonal']
    used = set()
    for seg, role, label, fid, pair in expected_diagonals:
        hits = [e for e in diag_els if _px_pair_same(((_num(e, 'x1'), _num(e, 'y1')), (_num(e, 'x2'), _num(e, 'y2'))), seg)]
        if len(hits) != 1:
            errors.append('SOLID_NET_DIAGONAL_MISSING:' + label)
            continue
        e = hits[0]
        used.add(id(e))
        if e.get('data-face') != fid or e.get('data-diagonal') != pair: errors.append('SOLID_NET_DIAGONAL_FACE_MISMATCH:' + label)
        if _net_line_role(e) != role: errors.append('SOLID_NET_DIAGONAL_ROLE_MISMATCH:' + label)
        if e.get('data-accent') != role: errors.append('SOLID_NET_ACCENT_ATTRIBUTE_INCONSISTENT:' + str(e.get('id')))
        if _dashed(e): errors.append('SOLID_NET_DIAGONAL_STYLE_MISMATCH:' + label)
    for e in diag_els:
        if id(e) not in used: errors.append('SOLID_NET_DIAGONAL_UNEXPECTED:' + str(e.get('id')))
    check_net_right_angles(net, root, errors, cycles, expected_px, P3)


def check_net_right_angles(net, root, errors, cycles, expected_px, P3):
    """net.rightAngles: a small square at a corner whose two edges are truly perpendicular (3D), its legs along the two edges of the drawn face, equally long, nothing else drawn"""
    want = []
    for m in net.get('rightAngles') or []:
        fid, ci = m.get('face'), m.get('corner')
        if fid not in cycles or not isinstance(ci, int) or isinstance(ci, bool) or not 0 <= ci < len(cycles[fid]) or (fid, ci) in want:
            errors.append('SOLID_NET_RIGHT_ANGLE_PLAN_INVALID')
            continue
        cyc, n = cycles[fid], len(cycles[fid])
        V, A, B = P3(cyc[ci]), P3(cyc[(ci - 1) % n]), P3(cyc[(ci + 1) % n])
        if abs(vdot(vunit(vsub(A, V)), vunit(vsub(B, V)))) > 1e-6: errors.append('SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:%s:%d' % (fid, ci))
        want.append((fid, ci))
    drawn = {}
    for el in root.iter(NS + 'polyline'):
        if el.get('data-role') != 'net-right-angle': continue
        try: key = (el.get('data-face'), int(el.get('data-corner')))
        except (TypeError, ValueError):
            errors.append('SOLID_NET_RIGHT_ANGLE_UNREADABLE:' + str(el.get('id')))
            continue
        if key in drawn: errors.append('SOLID_NET_RIGHT_ANGLE_DUPLICATE:%s:%d' % key)
        drawn[key] = el
    if sorted(want) != sorted(drawn): errors.append('SOLID_NET_RIGHT_ANGLE_SET_MISMATCH')
    for (fid, ci), el in drawn.items():
        if (fid, ci) not in want or fid not in expected_px: continue
        pts_px, n = expected_px[fid], len(expected_px[fid])
        V, A, B = pts_px[ci], pts_px[(ci - 1) % n], pts_px[(ci + 1) % n]
        pts = _points(el.get('points'))
        if len(pts) != 3:
            errors.append('SOLID_NET_RIGHT_ANGLE_GEOMETRY:%s:%d' % (fid, ci))
            continue
        p0, p1, p2 = pts
        la, lb = math.hypot(A[0] - V[0], A[1] - V[1]), math.hypot(B[0] - V[0], B[1] - V[1])
        l0, l2 = math.hypot(p0[0] - V[0], p0[1] - V[1]), math.hypot(p2[0] - V[0], p2[1] - V[1])
        on_a = l0 > 0 and abs((p0[0] - V[0]) * (A[1] - V[1]) - (p0[1] - V[1]) * (A[0] - V[0])) <= POS_TOL * la and (p0[0] - V[0]) * (A[0] - V[0]) + (p0[1] - V[1]) * (A[1] - V[1]) > 0
        on_b = l2 > 0 and abs((p2[0] - V[0]) * (B[1] - V[1]) - (p2[1] - V[1]) * (B[0] - V[0])) <= POS_TOL * lb and (p2[0] - V[0]) * (B[0] - V[0]) + (p2[1] - V[1]) * (B[1] - V[1]) > 0
        corner_ok = math.hypot(p1[0] - (p0[0] + p2[0] - V[0]), p1[1] - (p0[1] + p2[1] - V[1])) <= POS_TOL
        if not (on_a and on_b and corner_ok and abs(l0 - l2) <= POS_TOL and l0 >= 3.0 and l0 <= 0.5 * min(la, lb)): errors.append('SOLID_NET_RIGHT_ANGLE_GEOMETRY:%s:%d' % (fid, ci))


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
