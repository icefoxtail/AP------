"""Opt-in Euclidean publication annotations for the existing v1 builder.

Coordinates remain owned by the numeric model. This module only composes
owner-bound annotations; it can never authorize publication. No font shrinking
or removal of required labels is used to disguise an unresolved layout.
"""
from copy import deepcopy
import math
import re
from .geometry_model import finite, point
from .math_expression import parse, evaluate, serialize
from .label_layout import Box, segment_hits_box

PROFILE = 'geometry-publication-v1'
ROLES = {'GIVEN', 'DERIVED_INTERMEDIATE', 'CONCLUSION'}
ID = re.compile(r'[A-Za-z0-9_-]{1,80}\Z')


def normalize(spec):
    core = deepcopy(spec)
    cfg = core.pop('publication')
    allowed = {'profile', 'fontSize', 'sourcePointLabels', 'segmentPointRefs', 'annotations'}
    if not isinstance(cfg, dict) or set(cfg) - allowed or cfg.get('profile') != PROFILE:
        raise ValueError('PUBLICATION_CONFIG_INVALID')
    if core.get('visualType') not in {'coordinate_geometry', 'line_circle_geometry'}:
        raise ValueError('PUBLICATION_EUCLIDEAN_GEOMETRY_ONLY')
    font = finite(cfg.get('fontSize', 16))
    if not 14 <= font <= 32:
        raise ValueError('PUBLICATION_FONT_RANGE_14_32')
    if not isinstance(cfg.get('sourcePointLabels'), dict) or not isinstance(cfg.get('segmentPointRefs'), dict):
        raise ValueError('PUBLICATION_OWNER_MAPS_REQUIRED')
    if not isinstance(cfg.get('annotations'), list) or len(cfg['annotations']) > 100:
        raise ValueError('PUBLICATION_ANNOTATION_ARRAY_REQUIRED')
    if not isinstance(core.get('viewport'), dict):
        raise ValueError('PUBLICATION_VIEWPORT_REQUIRED')
    # Defaults only. Never silently change an explicitly frozen coordinate frame.
    core['viewport'] = {'width': 390, 'height': 360, 'panel': 0, **core['viewport']}
    core.setdefault('axes', False)
    # The scoped auditor covers Euclidean diagrams, not a second graph system.
    if core['axes'] or any(o.get('kind') == 'FUNCTION_GRAPH' for o in core.get('objects', [])):
        raise ValueError('PUBLICATION_AXIS_FREE_GEOMETRY_ONLY')
    return core, {**cfg, 'fontSize': font}


def _cross(a, b, c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])


def inside(p, polygon):
    """Strict ray-cast containment; boundary is not readable region interior."""
    result = False
    for a, b in zip(polygon, polygon[1:]+polygon[:1]):
        if abs(_cross(a, b, p)) < 1e-8 and min(a[0], b[0])-1e-8 <= p[0] <= max(a[0], b[0])+1e-8 and min(a[1], b[1])-1e-8 <= p[1] <= max(a[1], b[1])+1e-8:
            return False
        if (a[1] > p[1]) != (b[1] > p[1]) and p[0] < (b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]:
            result = not result
    return result


def _simple_polygon(coords):
    if not 3 <= len(coords) <= 32 or len(set(coords)) != len(coords):
        return False
    for i, a in enumerate(coords):
        b = coords[(i+1) % len(coords)]
        for j in range(i+1, len(coords)):
            if j == (i+1) % len(coords) or i == (j+1) % len(coords):
                continue
            c, d = coords[j], coords[(j+1) % len(coords)]
            if max(min(a[0], b[0]), min(c[0], d[0])) <= min(max(a[0], b[0]), max(c[0], d[0]))+1e-9 and max(min(a[1], b[1]), min(c[1], d[1])) <= min(max(a[1], b[1]), max(c[1], d[1]))+1e-9:
                if _cross(a, b, c)*_cross(a, b, d) <= 1e-12 and _cross(c, d, a)*_cross(c, d, b) <= 1e-12:
                    return False
    return True


def _ring(refs):
    return min(tuple(s[i:]+s[:i]) for s in (refs, list(reversed(refs))) for i in range(len(s)))


def _display(row, value):
    text = row.get('text', str(value).removesuffix('.0'))
    if not isinstance(text, str) or len(text) > 256:
        raise ValueError('ANNOTATION_EXACT_TEXT_REQUIRED')
    tree = parse(text)
    observed = evaluate(tree)
    if isinstance(observed, (bool, tuple, complex)) or not math.isfinite(float(observed)) or abs(float(observed)-value) > 1e-8:
        raise ValueError('ANNOTATION_DISPLAY_VALUE_MISMATCH:'+row['id'])
    if '.' in text:
        raise ValueError('ANNOTATION_EXACT_EXPRESSION_REQUIRED:'+row['id'])
    return serialize(tree, 'plain'), serialize(tree, 'svg')


def validate_annotations(config, core, geometry):
    objects = {o['id']: o for o in core['objects']}
    points = {k: v for k, v in geometry.items() if objects[k]['kind'] == 'POINT'}
    names = config['sourcePointLabels']
    if not points or set(names) != set(points) or any(not isinstance(v, str) or not v.strip() or len(v) > 24 for v in names.values()) or len(set(names.values())) != len(names):
        raise ValueError('SOURCE_POINT_IDENTITY_COVERAGE_FAIL')
    if len(set(points.values())) != len(points):
        raise ValueError('COINCIDENT_SOURCE_POINT_IDENTITY_UNSUPPORTED')
    for oid, name in names.items():
        explicit = [o['text'] for o in core['objects'] if o['kind'] == 'POINT_NAME' and o['target'] == oid]
        if len(explicit) > 1 or (explicit[0] if explicit else objects[oid].get('name', oid)) != name:
            raise ValueError('SOURCE_POINT_IDENTITY_MISMATCH:'+oid)
    refs_map = config['segmentPointRefs']
    segments = {k for k in geometry if objects[k]['kind'] == 'SEGMENT'}
    if set(refs_map) != segments:
        raise ValueError('SEGMENT_POINT_OWNER_COVERAGE_FAIL')
    for oid, refs in refs_map.items():
        if not isinstance(refs, list) or len(refs) != 2 or any(not isinstance(r, str) or r not in points for r in refs) or refs[0] == refs[1]:
            raise ValueError('SEGMENT_POINT_REFS_REQUIRED:'+oid)
        if not all(math.dist(p, points[r]) <= 1e-8 for p, r in zip(geometry[oid], refs)):
            raise ValueError('SEGMENT_POINT_OWNER_MISMATCH:'+oid)
    if len({tuple(sorted(r)) for r in refs_map.values()}) != len(refs_map):
        raise ValueError('DUPLICATE_SEGMENT_OWNER')
    if any(o['kind'] in {'ANGLE_MARK', 'PERPENDICULAR_MARK', 'LENGTH_LABEL', 'LEADER_LINE'} for o in core['objects']):
        raise ValueError('PUBLICATION_MIXED_LEGACY_ANNOTATION')
    ids = set(objects) | {'visual-title', 'visual-desc'} | {k+'-name' for k in names}
    signatures, validated = set(), []
    common = {'id', 'kind', 'refs', 'value', 'text', 'factRole'}
    fields = {'ANGLE': common | {'marker', 'sweep'}, 'LENGTH': (common-{'refs'}) | {'owner', 'mode', 'side', 'unit'}, 'REGION': common | {'labelAt'}}
    for raw in sorted(config['annotations'], key=lambda r: str(r.get('id', '')) if isinstance(r, dict) else ''):
        if not isinstance(raw, dict) or raw.get('kind') not in fields or set(raw)-fields[raw['kind']]:
            raise ValueError('PUBLICATION_ANNOTATION_SCHEMA_FAIL')
        row = deepcopy(raw)
        oid, kind = row.get('id'), row['kind']
        if not isinstance(oid, str) or not ID.fullmatch(oid):
            raise ValueError('PUBLICATION_ANNOTATION_ID_INVALID')
        reserved = {oid+s for s in ('', '-label', '-dimension', '-cap-0', '-cap-1', '-leader')}
        if ids & reserved:
            raise ValueError('DUPLICATE_PUBLICATION_ID:'+oid)
        ids.update(reserved)
        row['factRole'] = row.get('factRole', 'DERIVED_INTERMEDIATE')
        if row['factRole'] not in ROLES:
            raise ValueError('ANNOTATION_FACT_ROLE_INVALID')
        value = finite(row.get('value'))
        if value <= 0:
            raise ValueError('ANNOTATION_POSITIVE_VALUE_REQUIRED')
        if kind in {'ANGLE', 'REGION'}:
            refs = row.get('refs')
            if not isinstance(refs, list) or any(not isinstance(r, str) or r not in points for r in refs):
                raise ValueError('ANNOTATION_POINT_REFS_REQUIRED')
            coords = [points[r] for r in refs]
            if kind == 'ANGLE':
                if len(refs) != 3 or len(set(refs)) != 3 or value >= 360:
                    raise ValueError('ANGLE_POINTS_OR_VALUE_INVALID')
                a, v, b = coords
                u, w = (a[0]-v[0], a[1]-v[1]), (b[0]-v[0], b[1]-v[1])
                norm = math.hypot(*u)*math.hypot(*w)
                if norm <= 1e-12:
                    raise ValueError('DEGENERATE_ANGLE')
                minor = math.degrees(math.acos(max(-1., min(1., (u[0]*w[0]+u[1]*w[1])/norm))))
                if abs(value-(360-minor if value > 180 else minor)) > 1e-7:
                    raise ValueError('ANGLE_VALUE_MISMATCH:'+oid)
                marker = row.get('marker', 'AUTO')
                if marker not in {'AUTO', 'ARC', 'SQUARE'} or marker == 'SQUARE' and abs(value-90) > 1e-7:
                    raise ValueError('ANGLE_MARKER_INVALID')
                row['marker'] = ('SQUARE' if abs(value-90) < 1e-7 else 'ARC') if marker == 'AUTO' else marker
                if 'sweep' in row and row['sweep'] not in {'CW', 'CCW'}:
                    raise ValueError('ANGLE_SWEEP_INVALID')
                if abs(value-180) < 1e-7 and 'sweep' not in row:
                    raise ValueError('STRAIGHT_ANGLE_EXPLICIT_SWEEP_REQUIRED')
                directions = tuple(sorted(tuple(round(c/math.hypot(*ray), 9) for c in ray) for ray in (u, w)))
                signature = (kind, refs[1], directions, value > 180, row.get('sweep') if abs(value-180) < 1e-7 else None)
            else:
                if not _simple_polygon(coords):
                    raise ValueError('REGION_SIMPLE_POLYGON_REQUIRED')
                area = abs(sum(a[0]*b[1]-a[1]*b[0] for a, b in zip(coords, coords[1:]+coords[:1])))/2
                if area <= 1e-10 or abs(area-value) > 1e-7:
                    raise ValueError('REGION_AREA_MISMATCH:'+oid)
                if 'labelAt' in row:
                    row['labelAt'] = point(row['labelAt'])
                signature = (kind, _ring(refs))
            row['coordinates'] = coords
        else:
            owner = row.get('owner')
            if not isinstance(owner, str) or owner not in segments:
                raise ValueError('LENGTH_SEGMENT_OWNER_REQUIRED')
            if abs(math.dist(*geometry[owner])-value) > 1e-7:
                raise ValueError('LENGTH_VALUE_MISMATCH:'+oid)
            row['mode'] = row.get('mode', 'ADJACENT')
            row['side'] = row.get('side', 1)
            if row['mode'] not in {'ADJACENT', 'DIMENSION'} or row['side'] not in (-1, 1) or isinstance(row['side'], bool):
                raise ValueError('LENGTH_PLACEMENT_INVALID')
            if row.get('unit', '') not in {'', 'mm', 'cm', 'm', 'km'}:
                raise ValueError('LENGTH_UNIT_INVALID')
            row['coordinates'] = geometry[owner]
            signature = (kind, owner)
        if signature in signatures:
            raise ValueError('DUPLICATE_SEMANTIC_ANNOTATION:'+oid)
        signatures.add(signature)
        row['display'], row['markup'] = _display(row, value)
        row['value'] = value
        validated.append(row)
    return {**config, 'annotations': validated}


def _unit(v):
    n = math.hypot(*v)
    return v[0]/n, v[1]/n


def _interior_candidates(polygon):
    signed = sum(a[0]*b[1]-a[1]*b[0] for a, b in zip(polygon, polygon[1:]+polygon[:1]))
    center = tuple(sum((a[i]+b[i])*(a[0]*b[1]-a[1]*b[0]) for a, b in zip(polygon, polygon[1:]+polygon[:1]))/(3*signed) for i in (0, 1))
    xs, ys = [p[0] for p in polygon], [p[1] for p in polygon]
    candidates = [center]+[(min(xs)+(max(xs)-min(xs))*i/10, min(ys)+(max(ys)-min(ys))*j/10) for i in range(1, 10) for j in range(1, 10)]
    def clearance(p):
        distances = []
        for a, b in zip(polygon, polygon[1:]+polygon[:1]):
            dx, dy = b[0]-a[0], b[1]-a[1]
            t = max(0., min(1., ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)))
            distances.append(math.dist(p, (a[0]+t*dx, a[1]+t*dy)))
        return min(distances)
    return sorted((p for p in candidates if inside(p, polygon)), key=lambda p: (-clearance(p), math.dist(p, center), p))


def box_owned(label, box):
    corners = [(x, y) for x in (box.x, box.right) for y in (box.y, box.bottom)]
    if 'ownerPolygon' in label:
        polygon = label['ownerPolygon']
        # Corners alone miss concave notches: the boundary must not enter the box.
        return all(inside(p, polygon) for p in corners) and not any(segment_hits_box(a, b, box) for a, b in zip(polygon, polygon[1:]+polygon[:1]))
    if 'ownerWedge' in label:
        v, start, delta, limit = label['ownerWedge']
        for p in corners:
            theta = math.atan2(p[1]-v[1], p[0]-v[0])
            if ((theta-start) if delta > 0 else (start-theta)) % (2*math.pi) > abs(delta)+1e-9 or math.dist(p, v) > limit:
                return False
        # A reflex wedge's excluded rays can pass between valid corners.
        for theta in (start, start+delta):
            end = (v[0]+limit*math.cos(theta), v[1]+limit*math.sin(theta))
            if segment_hits_box(v, end, box):
                return False
    if label.get('nearestSegmentOwner'):
        center = (box.x+box.width/2, box.y+box.height/2)
        def distance(ends):
            a, b = ends; dx, dy = b[0]-a[0], b[1]-a[1]
            t = max(0., min(1., ((center[0]-a[0])*dx+(center[1]-a[1])*dy)/(dx*dx+dy*dy)))
            return math.dist(center, (a[0]+t*dx, a[1]+t*dy))
        own = distance(label['ownerSegment'])
        if any(distance(ends)+label['font']*.25 < own for ends in label['otherSegments']):
            return False
    return True


def decorate(prepared, labels, obstacles, viewport, semantic):
    pub, vertices = semantic['publication'], {}
    font = pub['fontSize']
    prepared.update(publicationProfile=PROFILE, publicationWarnings=[])
    positions = {o['id']: viewport.screen(o['at']) for o in semantic['spec']['objects'] if o['kind'] == 'POINT'}
    for p in prepared['primitives']:
        if p['id'] in pub['sourcePointLabels']:
            p.update(owner=p['id'], sourceLabel=pub['sourcePointLabels'][p['id']])
        if p['id'] in pub['segmentPointRefs']:
            p['ownerPoints'] = pub['segmentPointRefs'][p['id']]
    for label in labels:
        if label['kind'] in {'POINT_NAME', 'COORDINATE_LABEL', 'LENGTH_LABEL', 'EQUATION_LABEL'}:
            label['font'] = font
            label['allowSuppress'] = False
        if label['kind'] in {'POINT_NAME', 'COORDINATE_LABEL'}:
            label.update(owner=label['target'], sourceLabel=pub['sourcePointLabels'][label['target']], allowPanel=False)
            if label['kind'] == 'POINT_NAME':
                label['gaps'] = (10, 16, 24)
                p, rays = positions[label['target']], []
                for refs in pub['segmentPointRefs'].values():
                    if label['target'] in refs:
                        q = positions[refs[1] if refs[0] == label['target'] else refs[0]]
                        rays.append(math.atan2(q[1]-p[1], q[0]-p[0]))
                dirs = [('N', -math.pi/2), ('NE', -math.pi/4), ('E', 0), ('SE', math.pi/4), ('S', math.pi/2), ('SW', 3*math.pi/4), ('W', math.pi), ('NW', -3*math.pi/4)]
                dirs.sort(key=lambda d: -min((abs((d[1]-r+math.pi) % (2*math.pi)-math.pi) for r in rays), default=math.pi))
                label['directions'] = [d[0] for d in dirs]
    def add(p):
        prepared['primitives'].append(p)
        pts = p.get('points', [p.get('from'), p.get('to')])
        obstacles.append({'id': p['id'], 'kind': 'line', 'geometry': pts+pts[:1] if p['kind'] == 'polygon' else pts})
    for row in pub['annotations']:
        oid, kind = row['id'], row['kind']
        meta = {'owner': row.get('owner', oid), 'annotation': oid, 'ownerKind': kind, 'factRole': row['factRole']}
        suffix = '°' if kind == 'ANGLE' else (' '+row['unit'] if row.get('unit') else '')
        label = {'id': oid+'-label', 'kind': {'ANGLE': 'ANGLE_LABEL', 'LENGTH': 'LENGTH_LABEL', 'REGION': 'AREA_LABEL'}[kind], 'text': row['display']+suffix, 'markup': row['markup']+suffix, 'math': True, 'font': font, 'priority': 1, 'centered': True, 'allowPanel': False, **meta}
        pts = [viewport.screen(p) for p in row['coordinates']]
        if kind == 'ANGLE':
            a, v, b = pts
            start = math.atan2(a[1]-v[1], a[0]-v[0])
            delta = (math.atan2(b[1]-v[1], b[0]-v[0])-start+math.pi) % (2*math.pi)-math.pi
            if row['value'] > 180:
                delta = delta-2*math.pi if delta > 0 else delta+2*math.pi
            if abs(row['value']-180) < 1e-7:
                delta = math.pi if row['sweep'] == 'CW' else -math.pi
            elif row.get('sweep') and (delta > 0) != (row['sweep'] == 'CW'):
                raise ValueError('ANGLE_SWEEP_OWNER_MISMATCH:'+oid)
            level = vertices.get(row['refs'][1], 0)
            vertices[row['refs'][1]] = level+1
            radius, limit = 16+12*level, min(math.dist(a, v), math.dist(b, v))*.85
            if radius*1.6 > limit:
                prepared['publicationWarnings'].append('ANGLE_SPACE_REFRAME:'+oid)
            if row['marker'] == 'SQUARE':
                u, w = _unit((a[0]-v[0], a[1]-v[1])), _unit((b[0]-v[0], b[1]-v[1]))
                path = [(v[0]+radius*u[0], v[1]+radius*u[1]), (v[0]+radius*(u[0]+w[0]), v[1]+radius*(u[1]+w[1])), (v[0]+radius*w[0], v[1]+radius*w[1])]
            else:
                count = max(16, math.ceil(abs(delta)*16))
                path = [(v[0]+radius*math.cos(start+delta*i/count), v[1]+radius*math.sin(start+delta*i/count)) for i in range(count+1)]
            add({'id': oid, 'kind': 'polyline', 'points': path, 'role': 'indicator', 'token': 'indicator', 'layer': 65, 'ownerPoints': row['refs'], **meta})
            # Bounded radial search continues far enough for a 45-degree wedge;
            # never put an angle label outside its owner just to satisfy collision.
            radii = [radius+font*k for k in (1.7, 2.5, 3.3, 4.1, 4.9, 5.7, 6.5)]
            mid = start+delta/2
            label.update(at=v, candidateCenters=[(v[0]+r*math.cos(mid), v[1]+r*math.sin(mid)) for r in radii if r < limit], ownerWedge=[v, start, delta, limit])
        elif kind == 'LENGTH':
            a, b = pts
            ux, uy = _unit((b[0]-a[0], b[1]-a[1]))
            nx, ny = -uy*row['side'], ux*row['side']
            offset = font*2.6 if row['mode'] == 'DIMENSION' else 0
            if offset:
                da, db = (a[0]+nx*offset, a[1]+ny*offset), (b[0]+nx*offset, b[1]+ny*offset)
                add({'id': oid+'-dimension', 'kind': 'line', 'from': da, 'to': db, 'token': 'indicator', 'role': 'dimension', 'layer': 60, **meta})
                for i, p in enumerate((da, db)):
                    add({'id': oid+'-cap-'+str(i), 'kind': 'line', 'from': (p[0]-nx*4, p[1]-ny*4), 'to': (p[0]+nx*4, p[1]+ny*4), 'token': 'indicator', 'role': 'dimensionCap', 'layer': 60, **meta})
            offsets = (offset+font*1.25, offset-font*1.3, offset+font*2) if offset else (font*1.25, font*1.75, font*2.25)
            centers = [(a[0]+(b[0]-a[0])*t+nx*d, a[1]+(b[1]-a[1])*t+ny*d) for d in offsets for t in (.5, .35, .65)]
            label.update(at=centers[0], candidateCenters=centers, nearestSegmentOwner=row['mode']=='ADJACENT', ownerSegment=pts, otherSegments=[[positions[r] for r in refs] for key, refs in pub['segmentPointRefs'].items() if key!=row['owner']])
        else:
            add({'id': oid, 'kind': 'polygon', 'points': pts, 'role': 'region', 'token': 'indicator', 'layer': 15, 'fill': '#e8edf4', 'noStroke': True, 'ownerPoints': row['refs'], **meta})
            centers = _interior_candidates(pts)
            if not centers:
                prepared['publicationWarnings'].append('REGION_SPACE_REFRAME:'+oid)
                centers = [pts[0]]
            if 'labelAt' in row:
                at = viewport.screen(row['labelAt'])
                if inside(at, pts):
                    centers = [at]+centers
                else:
                    label['leaderFrom'] = min(centers, key=lambda p: math.dist(p, at))
                    centers = [at]
            label.update(at=centers[0], candidateCenters=centers)
            if 'leaderFrom' not in label:
                label['ownerPolygon'] = pts
        labels.append(label)


def finalize(prepared, result, obstacles):
    """One leader per region label per fresh build, never patch an old SVG."""
    warnings = list(prepared.get('publicationWarnings', []))
    for label in result['labels']:
        if 'leaderFrom' not in label:
            continue
        box = Box(**label['box'])
        center, start = (box.x+box.width/2, box.y+box.height/2), label['leaderFrom']
        dx, dy = start[0]-center[0], start[1]-center[1]
        extent = max(abs(dx)/(box.width/2+8), abs(dy)/(box.height/2+8))
        if extent <= 1:
            warnings.append('REGION_LEADER_NO_CLEARANCE:'+label['id'])
            continue
        end = (center[0]+dx/extent, center[1]+dy/extent)
        oid = label['annotation']+'-leader'
        if math.dist(start, end) > label['font']*6:
            warnings.append('REGION_LEADER_TOO_LONG:'+oid)
        if any(segment_hits_box(start, end, Box(**o['box']).expand(4)) for o in result['labels'] if o['id'] != label['id']):
            warnings.append('REGION_LEADER_LABEL_COLLISION:'+oid)
        prepared['primitives'].append({'id': oid, 'kind': 'line', 'from': start, 'to': end, 'role': 'leader', 'token': 'leaderLine', 'layer': 60, 'owner': label['owner'], 'annotation': label['annotation'], 'ownerKind': 'REGION', 'factRole': label['factRole']})
    if warnings:
        result['unresolved'].extend(warnings)
        result['status'] = 'POLISH_REQUIRED'
    result['publicationWarnings'] = warnings
