"""Independent observer of final SVG bytes and separately frozen source facts.

No visual_engine imports. This scoped XML observer deliberately rejects SVG
features it cannot interpret. A static PASS is NOT an Archive render PASS or
approval of the source solution. Source/solution bytes must match the review.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
PROFILE = 'geometry-publication-v1'
NS = '{http://www.w3.org/2000/svg}'


def _number(v):
    if isinstance(v, bool):
        raise ValueError('NONFINITE_NUMBER')
    try:
        value = float(v)
    except (ValueError, TypeError):
        raise ValueError('NONFINITE_NUMBER') from None
    if not math.isfinite(value):
        raise ValueError('NONFINITE_NUMBER')
    return value


def _pair(v):
    if not isinstance(v, (list, tuple)) or len(v) != 2:
        raise ValueError('POINT_PAIR_REQUIRED')
    return tuple(map(_number, v))


def _tag(e):
    if not isinstance(e.tag, str) or not e.tag.startswith(NS):
        raise ValueError('SVG_NAMESPACE_REQUIRED')
    return e.tag[len(NS):]


def _xy(e):
    tag = _tag(e)
    if tag == 'circle':
        return [(_number(e.get('cx')), _number(e.get('cy')))]
    if tag == 'line':
        return [(_number(e.get('x1')), _number(e.get('y1'))), (_number(e.get('x2')), _number(e.get('y2')))]
    values = [_number(n) for n in re.split(r'[\s,]+', e.get('points', '').strip())]
    if len(values) < 4 or len(values) % 2:
        raise ValueError('INVALID_ACTUAL_POINTS')
    return list(zip(values[::2], values[1::2]))


def _ring(p):
    p = [tuple(round(x, 6) for x in v) for v in p]
    return min(tuple(s[i:]+s[:i]) for s in (p, p[::-1]) for i in range(len(s)))


def _distance(p, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    n = dx*dx+dy*dy
    if n == 0:
        raise ValueError('DEGENERATE_ACTUAL_SEGMENT')
    t = ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/n
    return t, math.dist(p, (a[0]+max(0, min(1, t))*dx, a[1]+max(0, min(1, t))*dy))


def _inside(p, polygon, boundary=False):
    # Winding number, not the generator's ray-cast helper.
    winding = 0
    for a, b in zip(polygon, polygon[1:]+polygon[:1]):
        if _distance(p, a, b)[1] < 1e-6:
            return boundary
        cross = (b[0]-a[0])*(p[1]-a[1])-(p[0]-a[0])*(b[1]-a[1])
        if a[1] <= p[1] < b[1] and cross > 0:
            winding += 1
        elif b[1] <= p[1] < a[1] and cross < 0:
            winding -= 1
    return winding != 0


def _area(p):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a, b in zip(p, p[1:]+p[:1])))/2


def _check(condition, message):
    if not condition:
        raise ValueError(message)


def _power_spans(element):
    """Observe superscript ranges in flattened text, including nested powers.

    Frozen review rows declare powerSpans as [start, end] character offsets.
    Comparing text alone cannot distinguish 23 from 2 raised to 3.
    """
    spans, cursor = [], 0
    def visit(node):
        nonlocal cursor
        span = None
        if node.get('baseline-shift') == 'super':
            span = [cursor, None]
            spans.append(span)
        cursor += len(node.text or '')
        for child in node:
            visit(child)
            cursor += len(child.tail or '')
        if span is not None:
            span[1] = cursor
    visit(element)
    return spans


def _visible_tree(root):
    """Fail closed on hidden, transformed, inherited or unobserved rendering."""
    allowed = {
        'svg': {'viewBox', 'width', 'height', 'preserveAspectRatio', 'role', 'aria-labelledby', 'style'},
        'g': set(), 'circle': {'cx', 'cy', 'r'}, 'line': {'x1', 'y1', 'x2', 'y2'},
        'polyline': {'points'}, 'polygon': {'points'}, 'rect': {'x', 'y', 'width', 'height'},
        'text': {'x', 'y', 'font-size', 'font-family', 'font-style', 'text-anchor', 'dominant-baseline'},
        'tspan': {'x', 'y', 'font-family', 'font-style', 'baseline-shift', 'font-size'},
        'title': set(), 'desc': set(),
    }
    shapes = {'circle', 'line', 'polyline', 'polygon', 'rect'}
    nodes = list(root.iter())
    _check(len(nodes) <= 10000, 'SVG_COMPLEXITY_LIMIT')
    vb = [_number(v) for v in root.get('viewBox', '').split()]
    _check(len(vb) == 4 and vb[:2] == [0, 0] and min(vb[2:]) > 0, 'INVALID_VIEWBOX')
    _check(_number(root.get('width')) == vb[2] and _number(root.get('height')) == vb[3] and root.get('preserveAspectRatio') == 'xMidYMid meet', 'ROOT_FRAME_MISMATCH')
    _check(root.get('style') == 'max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round', 'UNSUPPORTED_SVG_STYLE')
    backgrounds = []
    for e in nodes:
        tag = _tag(e)
        _check(tag in allowed and (tag != 'svg' or e is root), 'UNSUPPORTED_SVG_ELEMENT:'+tag)
        attrs = allowed[tag] | {'id'} | ({'stroke', 'stroke-width', 'stroke-dasharray', 'fill'} if tag in shapes else set())
        _check(not {a for a in e.attrib if a not in attrs and not a.startswith('data-')}, 'UNSUPPORTED_SVG_ATTRIBUTE:'+tag)
        if tag == 'g':
            _check(set(e.attrib) == {'data-layer'} and len(e) == 1 and _tag(e[0]) in shapes | {'text'}, 'UNSUPPORTED_SVG_INHERITANCE')
        elif tag == 'text':
            _check(all(_tag(n) == 'tspan' for n in list(e.iter())[1:]), 'UNSUPPORTED_TEXT_CHILD')
            for n in list(e.iter())[1:]:
                if e.get('data-label-kind') != 'CONDITION_BOX':
                    _check(not {'x', 'y'} & set(n.attrib), 'REPOSITIONED_MATH_SPAN')
                _check('font-size' not in n.attrib or n.get('baseline-shift') == 'super', 'SHRUNK_BASE_LABEL_SPAN')
            _check(0 < _number(e.get('font-size')) <= 64, 'LABEL_FONT_INVALID')
            _check(e.get('text-anchor', 'start') in {'start', 'middle'} and e.get('dominant-baseline', 'auto') in {'auto', 'central'}, 'UNSUPPORTED_TEXT_ANCHOR')
        elif tag == 'tspan':
            _check(e.get('baseline-shift', '') in {'', 'super'} and e.get('font-size', '') in {'', '70%'}, 'UNSUPPORTED_MATH_FORMAT')
        elif tag in shapes:
            _check(not list(e), 'UNSUPPORTED_GEOMETRY_CHILD')
            if tag == 'rect' and not e.get('id'):
                backgrounds.append(e)
                _check(e in list(root) and e.get('fill') == '#fff' and set(e.attrib) == {'width', 'height', 'fill'}, 'UNREVIEWED_RECT')
                _check([_number(e.get(k)) for k in ('width', 'height')] == vb[2:], 'BACKGROUND_FRAME_MISMATCH')
                continue
            if e.get('data-role') == 'region':
                _check(tag == 'polygon' and e.get('fill') == '#e8edf4' and e.get('stroke') == 'none', 'REGION_VISIBILITY_INVALID')
            else:
                _check(e.get('stroke') in {'#111', '#555', '#777'} and 0.4 <= _number(e.get('stroke-width')) <= 4, 'GEOMETRY_INVISIBLE_OR_UNSUPPORTED_STROKE')
                _check(e.get('fill') in {'none', '#111', '#fff'}, 'UNSUPPORTED_GEOMETRY_FILL')
                if e.get('fill') != 'none':
                    _check((tag == 'circle' and e.get('data-role') == 'point' and e.get('fill') == '#111') or (tag == 'rect' and e.get('data-role') == 'conditionBox' and e.get('fill') == '#fff'), 'OCCLUDING_GEOMETRY_FILL')
            if tag == 'circle':
                _check(_number(e.get('r')) > 0, 'INVALID_CIRCLE_RADIUS')
        elif tag != 'svg':
            _check(not list(e), 'UNSUPPORTED_DESCRIPTION_CHILD')
    children = list(root)
    _check(len(backgrounds) == 1 and len(children) >= 3 and [_tag(e) for e in children[:3]] == ['title', 'desc', 'rect'] and all(_tag(e) == 'g' for e in children[3:]), 'UNSUPPORTED_SVG_STRUCTURE')
    regions = [i for i, e in enumerate(nodes) if e.get('data-role') == 'region']
    ink = [i for i, e in enumerate(nodes) if _tag(e) in {'circle', 'line', 'polyline', 'text'}]
    _check(not regions or not ink or max(regions) < min(ink), 'REGION_OCCLUDES_GEOMETRY')



def _coordinate_condition_residual(points, row):
    kind, refs = row.get('kind'), row.get('refs')
    _check(isinstance(refs, list) and all(r in points for r in refs), 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
    p = [points[r] for r in refs]
    def vector(a, b): return b[0]-a[0], b[1]-a[1]
    if kind == 'DISTANCE':
        _check(len(p) == 2 and 'expected' in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        return abs(math.dist(p[0], p[1])-_number(row['expected']))
    if kind in {'PERPENDICULAR', 'PARALLEL'}:
        _check(len(p) == 4 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        u, v = vector(p[0], p[1]), vector(p[2], p[3]); nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERATE_CONDITION:'+row['id'])
        value = u[0]*v[0]+u[1]*v[1] if kind == 'PERPENDICULAR' else u[0]*v[1]-u[1]*v[0]
        return abs(value)/(nu*nv)
    if kind == 'COLLINEAR':
        _check(len(p) == 3 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        u, v = vector(p[0], p[1]), vector(p[0], p[2]); nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERATE_CONDITION:'+row['id'])
        return abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)
    if kind == 'MIDPOINT':
        _check(len(p) == 3 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        return math.dist(p[0], ((p[1][0]+p[2][0])/2, (p[1][1]+p[2][1])/2))
    if kind == 'EQUAL_DISTANCE':
        _check(len(p) == 4 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        return abs(math.dist(p[0], p[1])-math.dist(p[2], p[3]))
    if kind == 'ANGLE':
        _check(len(p) == 3 and len(set(refs)) == 3 and 'expected' in row,
               'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        a, v, b = p
        u, w = vector(v, a), vector(v, b)
        nu, nw = math.hypot(*u), math.hypot(*w)
        _check(nu > 1e-12 and nw > 1e-12, 'CONSTRUCTED_DEGENERATE_CONDITION:'+row['id'])
        minor = math.degrees(math.acos(max(-1., min(1., (u[0]*w[0]+u[1]*w[1])/(nu*nw)))))
        expected = _number(row['expected'])
        _check(0 < expected < 360, 'CONSTRUCTED_ANGLE_EXPECTATION_RANGE:'+row['id'])
        observed = 360-minor if expected > 180 else minor
        return abs(observed-expected)
    raise ValueError('UNSUPPORTED_CONSTRUCTED_CONDITION:'+str(kind))


def _coordinate_degeneracy_metric(points, row):
    kind, refs = row.get('kind'), row.get('refs')
    _check(isinstance(refs, list) and all(r in points for r in refs), 'CONSTRUCTED_DEGENERACY_SCHEMA:'+str(row.get('id')))
    p = [points[r] for r in refs]
    if kind == 'NONCOLLINEAR':
        _check(len(p) == 3, 'CONSTRUCTED_DEGENERACY_SCHEMA:'+row['id'])
        u, v = (p[1][0]-p[0][0], p[1][1]-p[0][1]), (p[2][0]-p[0][0], p[2][1]-p[0][1])
        nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERACY_FAIL:'+row['id'])
        return abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)
    if kind == 'DISTINCT_POINTS':
        _check(len(p) == 2, 'CONSTRUCTED_DEGENERACY_SCHEMA:'+row['id'])
        return math.dist(p[0], p[1])
    raise ValueError('UNSUPPORTED_CONSTRUCTED_DEGENERACY:'+str(kind))


def _audit_coordinate_evidence(evidence, points):
    _check(isinstance(evidence, dict), 'COORDINATE_EVIDENCE_REQUIRED')
    mode = evidence.get('mode')
    _check(mode in {'SOURCE_COORDINATES', 'CONSTRUCTED_REALIZATION'}, 'COORDINATE_EVIDENCE_MODE_REQUIRED')
    rationale = evidence.get('rationale')
    _check(isinstance(rationale, str) and 8 <= len(rationale.strip()) <= 2000, 'COORDINATE_EVIDENCE_RATIONALE_REQUIRED')
    if mode == 'SOURCE_COORDINATES':
        _check(set(evidence) == {'mode', 'rationale', 'sourcePointIds'}, 'SOURCE_COORDINATE_EVIDENCE_SCHEMA')
        ids = evidence.get('sourcePointIds')
        _check(isinstance(ids, list) and len(ids) == len(set(ids)) and set(ids) == set(points),
               'SOURCE_COORDINATE_ID_COVERAGE_FAIL')
        return {'type':'COORDINATE_EVIDENCE','mode':mode,'conditionCount':0,'residualPassCount':0,'degeneracyPassCount':0}

    required = {'mode', 'rationale', 'normalization', 'freeVariables', 'pointCoordinates',
                'conditions', 'constructionSteps', 'residualChecks', 'degeneracyChecks'}
    _check(set(evidence) == required, 'CONSTRUCTED_COORDINATE_EVIDENCE_SCHEMA')
    coords = evidence['pointCoordinates']
    _check(isinstance(coords, dict) and set(coords) == set(points), 'CONSTRUCTED_POINT_COORDINATE_COVERAGE_FAIL')
    coords = {k:_pair(v) for k,v in coords.items()}
    _check(all(math.dist(coords[k], points[k]) <= 1e-12 for k in points), 'CONSTRUCTED_POINT_COORDINATE_MISMATCH')

    norm = evidence['normalization']
    _check(isinstance(norm, dict) and set(norm) == {'originPoint','xAxisPoint','unitScale'}, 'CONSTRUCTED_NORMALIZATION_SCHEMA')
    origin, axis, scale = norm.get('originPoint'), norm.get('xAxisPoint'), _number(norm.get('unitScale'))
    _check(origin in points and axis in points and origin != axis and scale > 0, 'CONSTRUCTED_NORMALIZATION_INVALID')
    _check(math.dist(coords[origin], (0.0,0.0)) <= 1e-12 and abs(coords[axis][1]) <= 1e-12 and abs(coords[axis][0]-scale) <= 1e-12,
           'CONSTRUCTED_NORMALIZATION_MISMATCH')

    variables = evidence['freeVariables']
    _check(isinstance(variables, list) and len(variables) <= 100, 'CONSTRUCTED_FREE_VARIABLES_SCHEMA')
    variable_ids = []
    for row in variables:
        _check(isinstance(row, dict) and set(row) == {'id','value'} and isinstance(row.get('id'), str) and re.fullmatch('[A-Za-z0-9_-]{1,100}', row['id']),
               'CONSTRUCTED_FREE_VARIABLE_SCHEMA')
        _number(row['value']); variable_ids.append(row['id'])
    _check(len(variable_ids) == len(set(variable_ids)), 'CONSTRUCTED_FREE_VARIABLE_DUPLICATE')

    conditions = evidence['conditions']
    _check(isinstance(conditions, list) and 1 <= len(conditions) <= 100, 'CONSTRUCTED_CONDITION_ARRAY_REQUIRED')
    computed, order = {}, []
    for row in conditions:
        _check(isinstance(row, dict) and set(row) <= {'id','kind','refs','expected','tolerance'} and
               {'id','kind','refs','tolerance'} <= set(row) and isinstance(row.get('id'), str) and re.fullmatch('[A-Za-z0-9_-]{1,100}', row['id']),
               'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        tolerance = _number(row['tolerance'])
        _check(0 < tolerance <= 1e-6, 'CONSTRUCTED_TOLERANCE_OUT_OF_RANGE:'+row['id'])
        residual = _coordinate_condition_residual(coords, row)
        _check(residual <= tolerance, 'CONSTRUCTED_CONDITION_RESIDUAL_FAIL:'+row['id'])
        _check(row['id'] not in computed, 'CONSTRUCTED_CONDITION_DUPLICATE')
        computed[row['id']] = (residual, tolerance); order.append(row['id'])

    steps = evidence['constructionSteps']
    _check(isinstance(steps, list) and 1 <= len(steps) <= 200, 'CONSTRUCTED_STEP_ARRAY_REQUIRED')
    step_ids, outputs = [], []
    for row in steps:
        _check(isinstance(row, dict) and set(row) == {'id','operation','output','inputs'} and
               isinstance(row.get('id'), str) and re.fullmatch('[A-Za-z0-9_-]{1,100}', row['id']) and
               isinstance(row.get('operation'), str) and re.fullmatch('[A-Z0-9_]{2,80}', row['operation']) and
               row.get('output') in points and isinstance(row.get('inputs'), list) and all(isinstance(v,str) and v for v in row['inputs']),
               'CONSTRUCTED_STEP_SCHEMA:'+str(row.get('id')))
        step_ids.append(row['id']); outputs.append(row['output'])
    _check(len(step_ids) == len(set(step_ids)) and len(outputs) == len(set(outputs)) and set(outputs) == set(points),
           'CONSTRUCTED_STEP_COVERAGE_FAIL')

    checks = evidence['residualChecks']
    _check(isinstance(checks, list) and len(checks) == len(conditions), 'CONSTRUCTED_RESIDUAL_COVERAGE_FAIL')
    seen = set()
    for row in checks:
        _check(isinstance(row, dict) and set(row) == {'conditionId','residual','tolerance'} and row.get('conditionId') in computed and row['conditionId'] not in seen,
               'CONSTRUCTED_RESIDUAL_SCHEMA')
        seen.add(row['conditionId']); residual, tolerance = computed[row['conditionId']]
        declared, declared_tolerance = _number(row['residual']), _number(row['tolerance'])
        _check(abs(declared_tolerance-tolerance) <= 1e-15 and abs(declared-residual) <= max(1e-12,tolerance*1e-6),
               'CONSTRUCTED_RESIDUAL_EVIDENCE_MISMATCH:'+row['conditionId'])
        _check(declared <= declared_tolerance, 'CONSTRUCTED_RESIDUAL_FAIL:'+row['conditionId'])
    _check(seen == set(order), 'CONSTRUCTED_RESIDUAL_COVERAGE_FAIL')

    degeneracy = evidence['degeneracyChecks']
    _check(isinstance(degeneracy, list) and 1 <= len(degeneracy) <= 100, 'CONSTRUCTED_DEGENERACY_COVERAGE_REQUIRED')
    deg_ids = set()
    for row in degeneracy:
        _check(isinstance(row, dict) and set(row) == {'id','kind','refs','observed','minimum'} and
               isinstance(row.get('id'), str) and re.fullmatch('[A-Za-z0-9_-]{1,100}', row['id']) and row['id'] not in deg_ids,
               'CONSTRUCTED_DEGENERACY_SCHEMA:'+str(row.get('id')))
        deg_ids.add(row['id']); observed, minimum = _number(row['observed']), _number(row['minimum'])
        metric = _coordinate_degeneracy_metric(coords, row)
        _check(abs(observed-metric) <= 1e-9, 'CONSTRUCTED_DEGENERACY_EVIDENCE_MISMATCH:'+row['id'])
        _check(minimum >= 0 and metric > minimum, 'CONSTRUCTED_DEGENERACY_FAIL:'+row['id'])
    return {'type':'COORDINATE_EVIDENCE','mode':mode,'conditionCount':len(conditions),
            'residualPassCount':len(checks),'degeneracyPassCount':len(degeneracy)}


def audit(svg_bytes: bytes, review: dict, *, source_bytes: bytes | None = None, solution_bytes: bytes | None = None) -> dict:
    errors, observations = [], []
    report = {'schemaVersion': 'geometry-publication-audit-v1', 'authority': 'INDEPENDENT_STATIC_OBSERVER', 'publicationAuthorized': False,
              'renderStatus': 'NOT_RUN', 'scope': 'frozen expected facts versus actual SVG; source-solve correctness and visual review remain external',
              'svgSha256': hashlib.sha256(svg_bytes).hexdigest(), 'errors': errors, 'observations': observations}
    try:
        groups = ('points', 'segments', 'circles', 'arcs', 'incidences', 'lines', 'angles', 'lengths', 'regions', 'otherLabels')
        allowed = {'schemaVersion', 'sourceSha256', 'solutionSha256', 'coordinateModel', 'coordinateEvidence'} | set(groups)
        _check(isinstance(review, dict) and not set(review)-allowed and review.get('schemaVersion') == 'geometry-publication-review-v1', 'FROZEN_REVIEW_CONTRACT_REQUIRED')
        for k, data in [('sourceSha256', source_bytes), ('solutionSha256', solution_bytes)]:
            _check(isinstance(data, bytes) and len(data) > 0, 'SOURCE_SOLUTION_BYTES_REQUIRED')
            _check(isinstance(review.get(k), str) and re.fullmatch('[0-9a-f]{64}', review[k]) and hashlib.sha256(data).hexdigest() == review[k], 'SOURCE_SOLUTION_HASH_MISMATCH:'+k)
            report[k] = review[k]
        report['reviewSha256'] = hashlib.sha256(json.dumps(review, sort_keys=True, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode()).hexdigest()
        facts = {key: review.get(key, []) for key in groups}
        _check(all(isinstance(rows, list) and len(rows) <= 1000 for rows in facts.values()) and bool(facts['points']), 'INDEPENDENT_FACT_ARRAY_REQUIRED')
        all_ids = [r['id'] for rows in facts.values() for r in rows]
        _check(all(isinstance(i, str) and re.fullmatch('[A-Za-z0-9_-]{1,100}', i) for i in all_ids) and len(all_ids) == len(set(all_ids)), 'INVALID_OR_DUPLICATE_REVIEW_ID')
        other_labels_by_id={row['id']:row for row in facts['otherLabels'] if isinstance(row,dict) and isinstance(row.get('id'),str)}
        annotation_rows={row['id']:row for key in ('angles','lengths') for row in facts[key] if isinstance(row,dict) and isinstance(row.get('id'),str)}
        model = review['coordinateModel']
        _check(set(model) == {'originX', 'originY', 'sx', 'sy'}, 'FROZEN_FRAME_SCHEMA')
        ox, oy, sx, sy = [_number(model[k]) for k in ('originX', 'originY', 'sx', 'sy')]
        _check(sx > 0 and sy > 0 and abs(sx-sy) < 1e-9, 'FROZEN_EQUAL_UNIT_FRAME_REQUIRED')
        inverse = lambda p: ((p[0]-ox)/sx, (oy-p[1])/sy)
        source_points = {r['id']: _pair(r['at']) for r in facts['points']}
        _check(len(set(source_points.values())) == len(source_points), 'COINCIDENT_SOURCE_IDENTITY_UNSUPPORTED')
        coordinate_observation = _audit_coordinate_evidence(review.get('coordinateEvidence'), source_points)
        report['coordinateEvidenceMode'] = coordinate_observation['mode']
        report['coordinateEvidenceSha256'] = hashlib.sha256(json.dumps(review['coordinateEvidence'], sort_keys=True, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode()).hexdigest()
        observations.append(coordinate_observation)
        raw = svg_bytes.decode('utf-8')
        _check('<!DOCTYPE' not in raw.upper() and '<!ENTITY' not in raw.upper(), 'UNSUPPORTED_SVG_DTD')
        root = ET.fromstring(raw)
        _check(root.tag == NS+'svg' and root.get('data-publication-profile') == PROFILE, 'PUBLICATION_PROFILE_REQUIRED')
        _visible_tree(root)
        ids, primitives, labels, signatures = {}, {}, {}, set()
        for e in root.iter():
            tag, oid = _tag(e), e.get('id')
            if oid:
                _check(oid not in ids, 'DUPLICATE_SVG_ID:'+oid)
                ids[oid] = e
            if tag in {'circle', 'line', 'polyline', 'polygon'}:
                _check(bool(oid), 'UNIDENTIFIED_PRIMITIVE')
                p = _xy(e)
                if tag == 'circle':
                    sig = (tag, tuple(round(x, 6) for x in p[0]), round(_number(e.get('r')), 6))
                elif tag == 'polygon':
                    sig = (tag, _ring(p))
                else:
                    q = tuple(tuple(round(x, 6) for x in v) for v in p)
                    sig = ('stroke', min(q, q[::-1]))
                _check(sig not in signatures, 'DUPLICATE_ACTUAL_PRIMITIVE:'+oid)
                signatures.add(sig); primitives[oid] = e
            elif tag == 'rect' and oid:
                primitives[oid] = e
            elif tag == 'text':
                _check(bool(oid), 'UNIDENTIFIED_LABEL')
                labels[oid] = e
        covered, label_covered = set(), set()
        def read(oid, tag):
            e = ids.get(oid)
            _check(e is not None and _tag(e) == tag, 'ACTUAL_ELEMENT_MISSING_OR_WRONG_KIND:'+str(oid))
            covered.add(oid)
            return e
        def read_leader(oid):
            e = ids.get(oid)
            _check(e is not None and _tag(e) in {'line','polyline'}, 'ACTUAL_ELEMENT_MISSING_OR_WRONG_KIND:'+str(oid))
            covered.add(oid)
            return e
        def leader_length(points):
            return sum(math.dist(a,b) for a,b in zip(points,points[1:]))
        def pt(oid):
            _check(oid in source_points, 'UNKNOWN_SOURCE_POINT:'+str(oid))
            return _xy(read(oid, 'circle'))[0]
        def label(oid, expected, owner=None, annotation=None, kind=None, power_spans=()):
            e = read(oid, 'text')
            _check(isinstance(expected, str) and ''.join(e.itertext()) == expected, 'LABEL_TEXT_MISMATCH:'+oid)
            _check(_power_spans(e) == list(power_spans), 'LABEL_POWER_SCOPE_MISMATCH:'+oid)
            if owner is not None:
                _check(e.get('data-owner') == owner, 'LABEL_OWNER_IDENTITY_MISMATCH:'+oid)
            if annotation is not None:
                _check(e.get('data-annotation') == annotation, 'LABEL_ANNOTATION_IDENTITY_MISMATCH:'+oid)
            if kind:
                _check(e.get('data-label-kind') == kind, 'LABEL_KIND_MISMATCH:'+oid)
            label_covered.add(oid)
            return (_number(e.get('x')), _number(e.get('y'))), _number(e.get('font-size')), e
        def condition_box_binding(row, annotation_id):
            box_id=row.get('conditionBoxId')
            box_fact=other_labels_by_id.get(box_id)
            _check(isinstance(box_id,str) and box_fact is not None, 'ANNOTATION_CONDITION_BOX_REVIEW_REQUIRED:'+annotation_id)
            _check(annotation_id in box_fact.get('conditionBoxFor',[]), 'ANNOTATION_CONDITION_BOX_BINDING_MISMATCH:'+annotation_id)
            _check(isinstance(row.get('text'),str) and row['text'] in str(box_fact.get('text','')), 'ANNOTATION_CONDITION_BOX_TEXT_MISMATCH:'+annotation_id)
            return box_id
        for row in facts['points']:
            oid = row['id']; e = read(oid, 'circle'); actual = inverse(pt(oid))
            _check(math.dist(actual, source_points[oid]) < 1e-6, 'SOURCE_POINT_COORDINATE_MISMATCH:'+oid)
            name = row.get('name')
            _check(e.get('data-role') == 'point' and e.get('data-owner') == oid and e.get('data-source-label') == name and .5 <= _number(e.get('r')) <= 4, 'SOURCE_POINT_IDENTITY_MISMATCH:'+oid)
            label_placement = row.get('labelPlacement', 'OWNER_ADJACENT')
            _check(label_placement in {'OWNER_ADJACENT', 'LEADER_CALLOUT'}, 'POINT_NAME_LABEL_PLACEMENT_INVALID:'+oid)
            if name is None:
                _check(label_placement == 'OWNER_ADJACENT', 'ANONYMOUS_POINT_LABEL_PLACEMENT_INVALID:'+oid)
                _check(not any(label.get('data-owner') == oid and label.get('data-label-kind') == 'POINT_NAME' for label in labels.values()), 'UNEXPECTED_VISIBLE_SOURCE_POINT_NAME:'+oid)
            else:
                label_id = row.get('labelId', oid+'-name')
                anchor, font, le = label(label_id, name, oid, kind='POINT_NAME', power_spans=row.get('powerSpans', []))
                _check(le.get('data-source-label') == name, 'POINT_NAME_SOURCE_BINDING_MISMATCH:'+oid)
                anchor_candidates = row.get('labelAtCandidates')
                _check(anchor_candidates is None or (isinstance(anchor_candidates,list) and 1<=len(anchor_candidates)<=32 and
                       all(isinstance(candidate,list) and len(candidate)==2 and all(isinstance(v,(int,float)) and not isinstance(v,bool) for v in candidate) for candidate in anchor_candidates) and
                       len({tuple(candidate) for candidate in anchor_candidates})==len(anchor_candidates)), 'POINT_NAME_ANCHOR_CANDIDATES_INVALID:'+oid)
                _check(not (anchor_candidates is not None and 'labelAt' in row), 'POINT_NAME_ANCHOR_CANDIDATES_CONFLICT:'+oid)
                if anchor_candidates is not None:
                    expected_candidates=[(ox+_number(candidate[0])*sx,oy-_number(candidate[1])*sy) for candidate in anchor_candidates]
                    _check(min(math.dist(anchor,expected) for expected in expected_candidates)<.01, 'POINT_NAME_ANCHOR_CANDIDATE_MISMATCH:'+oid)
                elif 'labelAt' in row:
                    expected = (ox+_number(row['labelAt'][0])*sx, oy-_number(row['labelAt'][1])*sy)
                    _check(math.dist(anchor, expected) < .01, 'POINT_NAME_ANCHOR_MISMATCH:'+oid)
                if label_placement == 'LEADER_CALLOUT':
                    _check('labelAt' in row or anchor_candidates is not None, 'POINT_NAME_LEADER_ANCHOR_REQUIRED:'+oid)
                    leader = read_leader(row.get('leaderId',label_id+'-leader')); points = _xy(leader); a,b=points[0],points[-1]
                    fact_role = row.get('factRole', 'GIVEN')
                    _check(leader.get('data-owner') == oid and leader.get('data-annotation') == label_id and leader.get('data-owner-kind') == 'POINT' and leader.get('data-fact-role') == fact_role, 'POINT_NAME_LEADER_OWNER_METADATA_MISMATCH:'+oid)
                    _check(math.dist(a,pt(oid)) < .01, 'POINT_NAME_LEADER_OWNER_MISMATCH:'+oid)
                    _check(math.dist(b,anchor) < font*4 and leader_length(points) <= font*12, 'POINT_NAME_LEADER_LABEL_MISMATCH:'+oid)
                else:
                    _check(math.dist(anchor, pt(oid)) <= font*5, 'POINT_NAME_SOURCE_BINDING_MISMATCH:'+oid)
                    _check(row.get('leaderId',label_id+'-leader') not in ids, 'UNEXPECTED_POINT_NAME_LEADER:'+oid)
            observations.append({'id': oid, 'type': 'POINT_IDENTITY', 'observed': actual, 'sourceLabel': name,
                                 'labelPlacement': label_placement})
        for row in facts['segments']:
            oid = row['id']; e = read(oid, 'line'); ends, refs = _xy(e), row['points']
            _check(len(refs) == 2 and refs[0] != refs[1] and all(math.dist(p, pt(r)) < .01 for p, r in zip(ends, refs)), 'SEGMENT_POINT_OWNER_MISMATCH:'+oid)
            _check(e.get('data-owner-points') == ' '.join(refs), 'SEGMENT_OWNER_METADATA_MISMATCH:'+oid)
            observations.append({'id': oid, 'type': 'SEGMENT', 'observedEndpoints': list(map(inverse, ends))})
        actual_circles = {}
        for row in facts['circles']:
            e = read(row['id'], 'circle'); center = inverse(_xy(e)[0]); radius = _number(e.get('r'))/sx
            _check(math.dist(center, _pair(row['center'])) < 1e-6 and abs(radius-_number(row['radius'])) < 1e-7, 'CIRCLE_PARITY_FAIL:'+row['id'])
            actual_circles[row['id']] = (center, radius)
            observations.append({'id': row['id'], 'type': 'CIRCLE', 'center': center, 'radius': radius})
        for row in facts['arcs']:
            oid = row['id']
            _check(set(row) == {'id','center','radius','startPoint','endPoint','sweep','degrees'} and
                   row['center'] in source_points and row['startPoint'] in source_points and row['endPoint'] in source_points and
                   row['startPoint'] != row['endPoint'] and row['sweep'] in {'CW','CCW'}, 'CIRCULAR_ARC_REVIEW_SCHEMA:'+oid)
            e = read(oid, 'polyline'); screen_points = _xy(e); model_points = [inverse(p) for p in screen_points]
            center, radius = source_points[row['center']], _number(row['radius'])
            degrees = _number(row['degrees'])
            _check(3 < len(screen_points) <= 257 and 0 < degrees < 360, 'CIRCULAR_ARC_SAMPLE_OR_SWEEP_RANGE:'+oid)
            _check(e.get('data-owner-points') == row['startPoint']+' '+row['endPoint'] and
                   e.get('data-center-point') == row['center'] and e.get('data-sweep') == row['sweep'] and
                   abs(_number(e.get('data-owner-radius'))-radius) < 1e-7, 'CIRCULAR_ARC_OWNER_METADATA_MISMATCH:'+oid)
            _check(math.dist(model_points[0],source_points[row['startPoint']]) < 1e-6 and
                   math.dist(model_points[-1],source_points[row['endPoint']]) < 1e-6, 'CIRCULAR_ARC_ENDPOINT_IDENTITY_MISMATCH:'+oid)
            radial_deltas=[abs(math.dist(p,center)-radius) for p in model_points]
            _check(max(radial_deltas) < 1e-6, 'CIRCULAR_ARC_RADIUS_MISMATCH:'+oid)
            angles=[math.atan2(p[1]-center[1],p[0]-center[0]) for p in model_points]
            deltas=[(q-a+math.pi)%(2*math.pi)-math.pi for a,q in zip(angles,angles[1:])]
            direction_ok=all(d>1e-10 for d in deltas) if row['sweep']=='CCW' else all(d < -1e-10 for d in deltas)
            observed=abs(math.degrees(sum(deltas)))
            _check(direction_ok and abs(observed-degrees)<1e-5, 'CIRCULAR_ARC_SWEEP_MISMATCH:'+oid)
            observations.append({'id':oid,'type':'CIRCULAR_ARC','centerPoint':row['center'],'radius':radius,
                                 'startPoint':row['startPoint'],'endPoint':row['endPoint'],'sweep':row['sweep'],
                                 'expectedDegrees':degrees,'observedDegrees':observed,'maxRadialDelta':max(radial_deltas)})
        for row in facts['incidences']:
            _check(set(row) == {'id', 'point', 'circle'} and row['point'] in source_points and row['circle'] in actual_circles, 'CIRCLE_INCIDENCE_SCHEMA:'+str(row.get('id')))
            center, radius = actual_circles[row['circle']]
            actual_point = inverse(pt(row['point']))
            delta = abs(math.dist(actual_point, center)-radius)
            _check(delta <= 1e-7, 'CIRCLE_INCIDENCE_FAIL:'+row['id'])
            observations.append({'id': row['id'], 'type': 'CIRCLE_INCIDENCE', 'point': row['point'], 'circle': row['circle'], 'observedPoint': actual_point, 'observedCenter': center, 'observedRadius': radius, 'radialDelta': delta})
        for row in facts['lines']:
            ends = list(map(inverse, _xy(read(row['id'], 'line')))); a, b, c = map(_number, row['coefficients']); norm = math.hypot(a, b)
            _check(norm > 0 and math.dist(*ends) > 1e-8 and all(abs(a*x+b*y+c)/norm < 1e-7 for x, y in ends), 'LINE_PARITY_FAIL:'+row['id'])
            observations.append({'id': row['id'], 'type': 'LINE', 'endpoints': ends})
        def owner_mark(e, row, kind, owner):
            _check(e.get('data-owner') == owner and e.get('data-annotation') == row['id'] and e.get('data-owner-kind') == kind, 'ANNOTATION_OWNER_MISMATCH:'+row['id'])
            _check(row.get('factRole') in {'GIVEN', 'DERIVED_INTERMEDIATE', 'CONCLUSION'} and e.get('data-fact-role') == row['factRole'], 'FACT_ROLE_MISMATCH:'+row['id'])
        semantic_angles, radii_at_vertex = set(), {}
        for row in facts['angles']:
            oid = row['id']; e = read(oid, 'polyline'); p, refs = _xy(e), row['points']
            _check(len(refs) == 3 and len(set(refs)) == 3, 'INVALID_ANGLE_POINTS')
            a, v, b = map(pt, refs)
            owner_mark(e, row, 'ANGLE', oid)
            _check(e.get('data-owner-points') == ' '.join(refs), 'ANGLE_POINT_IDENTITY_MISMATCH:'+oid)
            value = _number(row['degrees'])
            _check(0 < value < 360, 'ANGLE_EXPECTATION_RANGE')
            show_label = row.get('showLabel', True)
            _check(isinstance(show_label, bool), 'ANGLE_LABEL_VISIBILITY_INVALID:'+oid)
            label_placement = row.get('labelPlacement', 'OWNER_WEDGE')
            _check(label_placement in {'OWNER_WEDGE', 'LEADER_CALLOUT', 'CONDITION_BOX'}, 'ANGLE_LABEL_PLACEMENT_INVALID:'+oid)
            anchor_candidates = row.get('labelAtCandidates')
            _check(anchor_candidates is None or (isinstance(anchor_candidates,list) and 1<=len(anchor_candidates)<=32 and
                   all(isinstance(candidate,list) and len(candidate)==2 and all(isinstance(v,(int,float)) and not isinstance(v,bool) for v in candidate) for candidate in anchor_candidates) and
                   len({tuple(candidate) for candidate in anchor_candidates})==len(anchor_candidates)), 'ANGLE_LABEL_ANCHOR_CANDIDATES_INVALID:'+oid)
            _check(not (anchor_candidates is not None and 'labelAt' in row), 'ANGLE_LABEL_ANCHOR_CANDIDATES_CONFLICT:'+oid)
            _check(label_placement != 'LEADER_CALLOUT' or (show_label and ('labelAt' in row or anchor_candidates is not None)), 'ANGLE_LEADER_CALLOUT_ANCHOR_REQUIRED:'+oid)
            _check(label_placement != 'CONDITION_BOX' or (not show_label and 'conditionBoxId' in row and anchor_candidates is None and 'labelAt' not in row), 'ANGLE_CONDITION_BOX_SCHEMA:'+oid)
            directions = tuple(sorted((round((q[0]-v[0])/math.dist(q,v), 8), round((q[1]-v[1])/math.dist(q,v), 8)) for q in (a,b)))
            sig = (refs[1], directions, value > 180, row.get('sweep') if abs(value-180) < 1e-7 else None)
            _check(sig not in semantic_angles, 'DUPLICATE_SEMANTIC_ANGLE:'+oid); semantic_angles.add(sig)
            def ray(p, q):
                u, w = (p[0]-v[0], p[1]-v[1]), (q[0]-v[0], q[1]-v[1])
                norm = math.hypot(*u)*math.hypot(*w)
                return norm > 0 and abs(u[0]*w[1]-u[1]*w[0])/norm < 1e-6 and u[0]*w[0]+u[1]*w[1] > 0
            _check(ray(p[0], a) and ray(p[-1], b), 'ANGLE_RAY_DIRECTION_MISMATCH:'+oid)
            if row['marker'] == 'SQUARE':
                _check(len(p) == 3 and abs(value-90) < 1e-7, 'RIGHT_ANGLE_MARK_INVALID:'+oid)
                _check(math.dist((p[0][0]+p[2][0]-p[1][0], p[0][1]+p[2][1]-p[1][1]), v) < .01, 'RIGHT_ANGLE_VERTEX_MISMATCH:'+oid)
                u, w = (p[0][0]-v[0], p[0][1]-v[1]), (p[2][0]-v[0], p[2][1]-v[1])
                _check(abs(u[0]*w[0]+u[1]*w[1])/(math.hypot(*u)*math.hypot(*w)) < 1e-6 and abs(math.hypot(*u)-math.hypot(*w)) < .01, 'RIGHT_ANGLE_NOT_SQUARE:'+oid)
                observed, turn_sign = 90., 1 if u[0]*w[1]-u[1]*w[0] > 0 else -1
            elif row['marker'] == 'ARC':
                _check(3 <= len(p) <= 257, 'ANGLE_ARC_SAMPLE_COUNT_INVALID')
                radii = [math.dist(q, v) for q in p]
                _check(min(radii) > 0 and max(radii)-min(radii) < .01, 'ANGLE_ARC_CENTER_RADIUS_MISMATCH:'+oid)
                angles = [math.atan2(q[1]-v[1], q[0]-v[0]) for q in p]
                deltas = [(q-a+math.pi) % (2*math.pi)-math.pi for a, q in zip(angles, angles[1:])]
                _check(all(d > 1e-10 for d in deltas) or all(d < -1e-10 for d in deltas), 'ANGLE_ARC_BACKTRACKING:'+oid)
                observed, turn_sign = abs(math.degrees(sum(deltas))), 1 if sum(deltas) > 0 else -1
                _check(abs(observed-value) < 1e-5, 'ANGLE_SWEEP_VALUE_MISMATCH:'+oid)
            else:
                raise ValueError('UNSUPPORTED_ANGLE_EXPECTATION')
            radius = math.dist(p[0], v)
            previous = radii_at_vertex.setdefault(refs[1], [])
            _check(all(abs(radius-r) >= 6 for r in previous), 'MULTI_ANGLE_RADIUS_COLLISION:'+oid); previous.append(radius)
            if row.get('sweep'):
                _check(row['sweep'] in {'CW', 'CCW'} and (turn_sign > 0) == (row['sweep'] == 'CW'), 'ANGLE_EXPLICIT_SWEEP_MISMATCH:'+oid)
            if abs(value-180) < 1e-7:
                _check(row.get('sweep') in {'CW', 'CCW'}, 'STRAIGHT_ANGLE_EXPLICIT_SWEEP_REQUIRED')
            if show_label:
                anchor, font, le = label(oid+'-label', row['text'], oid, oid, 'ANGLE_LABEL', row.get('powerSpans', [])); owner_mark(le, row, 'ANGLE', oid)
                if anchor_candidates is not None:
                    expected_candidates=[(ox+_number(candidate[0])*sx,oy-_number(candidate[1])*sy) for candidate in anchor_candidates]
                    _check(min(math.dist(anchor,expected) for expected in expected_candidates)<.01, 'ANGLE_LABEL_ANCHOR_CANDIDATE_MISMATCH:'+oid)
                elif 'labelAt' in row:
                    expected = (ox+_number(row['labelAt'][0])*sx, oy-_number(row['labelAt'][1])*sy)
                    _check(math.dist(anchor, expected) < .01, 'ANGLE_LABEL_ANCHOR_MISMATCH:'+oid)
                if label_placement == 'OWNER_WEDGE':
                    _check(oid+'-leader' not in ids, 'UNEXPECTED_ANGLE_LEADER:'+oid)
                    theta, start = math.atan2(anchor[1]-v[1], anchor[0]-v[0]), math.atan2(a[1]-v[1], a[0]-v[0])
                    _check(0 < (turn_sign*(theta-start)) % (2*math.pi) < math.radians(value)+1e-7 and math.dist(anchor, v) <= min(math.dist(a, v), math.dist(b, v)), 'ANGLE_LABEL_OUTSIDE_OWNER_WEDGE:'+oid)
                else:
                    leader = read_leader(oid+'-leader'); owner_mark(leader, row, 'ANGLE', oid)
                    leader_points = _xy(leader);start,end=leader_points[0],leader_points[-1]
                    _check(leader.get('data-owner-points') == ' '.join(refs), 'ANGLE_LEADER_POINT_IDENTITY_MISMATCH:'+oid)
                    _check(min(math.dist(start, p0) for p0 in p) < .01, 'ANGLE_LEADER_OWNER_MISMATCH:'+oid)
                    _check(math.dist(end, anchor) < font*4 and leader_length(leader_points) <= font*12, 'ANGLE_LEADER_LABEL_MISMATCH:'+oid)
            elif label_placement=='CONDITION_BOX':
                _check(oid+'-label' not in ids and oid+'-leader' not in ids, 'ANGLE_CONDITION_BOX_DUPLICATE_LABEL:'+oid)
                condition_box_binding(row,oid)
            else:
                _check(oid+'-label' not in ids, 'HIDDEN_ANGLE_LABEL_PRESENT:'+oid)
                _check(oid+'-leader' not in ids, 'HIDDEN_ANGLE_LEADER_PRESENT:'+oid)
            observations.append({'id': oid, 'type': 'ANGLE', 'ownerVertex': refs[1], 'expectedAngleDeg': value,
                                 'observedAngleDeg': observed, 'radiusPx': radius, 'labelShown': show_label,
                                 'labelPlacement': label_placement})
        declared_segments = {r['id'] for r in facts['segments']}
        segment_points = {r['id']: r['points'] for r in facts['segments']}
        length_owners = set()
        for row in facts['lengths']:
            oid, owner = row['id'], row['segment']
            _check(owner in declared_segments and owner not in length_owners, 'INVALID_OR_DUPLICATE_LENGTH_OWNER:'+oid); length_owners.add(owner)
            a, b = _xy(read(owner, 'line')); value = math.dist(inverse(a), inverse(b))
            _check(abs(value-_number(row['value'])) < 1e-7, 'LENGTH_VALUE_MISMATCH:'+oid)
            label_placement = row.get('labelPlacement', 'OWNER_SEGMENT')
            _check(label_placement in {'OWNER_SEGMENT', 'LEADER_CALLOUT', 'CONDITION_BOX'}, 'LENGTH_LABEL_PLACEMENT_INVALID:'+oid)
            anchor_candidates = row.get('labelAtCandidates')
            _check(anchor_candidates is None or (isinstance(anchor_candidates,list) and 1<=len(anchor_candidates)<=32 and
                   all(isinstance(candidate,list) and len(candidate)==2 and all(isinstance(v,(int,float)) and not isinstance(v,bool) for v in candidate) for candidate in anchor_candidates) and
                   len({tuple(candidate) for candidate in anchor_candidates})==len(anchor_candidates)), 'LENGTH_LABEL_ANCHOR_CANDIDATES_INVALID:'+oid)
            _check(not (anchor_candidates is not None and 'labelAt' in row), 'LENGTH_LABEL_ANCHOR_CANDIDATES_CONFLICT:'+oid)
            if label_placement == 'CONDITION_BOX':
                _check('conditionBoxId' in row and anchor_candidates is None and 'labelAt' not in row, 'LENGTH_CONDITION_BOX_SCHEMA:'+oid)
                condition_box_binding(row,oid)
                _check(oid+'-label' not in ids and oid+'-leader' not in ids and oid+'-dimension' not in ids and oid+'-cap-0' not in ids and oid+'-cap-1' not in ids, 'LENGTH_CONDITION_BOX_DUPLICATE_LABEL:'+oid)
                fraction, distance = None, None
            else:
                anchor, font, le = label(oid+'-label', row['text'], owner, oid, 'LENGTH_LABEL', row.get('powerSpans', [])); owner_mark(le, row, 'LENGTH', owner)
                if label_placement == 'LEADER_CALLOUT':
                    _check('labelAt' in row or anchor_candidates is not None, 'LENGTH_LEADER_CALLOUT_ANCHOR_REQUIRED:'+oid)
                    if anchor_candidates is not None:
                        expected_candidates=[(ox+_number(candidate[0])*sx,oy-_number(candidate[1])*sy) for candidate in anchor_candidates]
                        _check(min(math.dist(anchor,expected) for expected in expected_candidates)<.01, 'LENGTH_LABEL_ANCHOR_CANDIDATE_MISMATCH:'+oid)
                    else:
                        expected = (ox+_number(row['labelAt'][0])*sx, oy-_number(row['labelAt'][1])*sy)
                        _check(math.dist(anchor, expected) < .01, 'LENGTH_LABEL_ANCHOR_MISMATCH:'+oid)
                    _check(oid+'-dimension' not in ids and oid+'-cap-0' not in ids and oid+'-cap-1' not in ids, 'UNEXPECTED_LENGTH_DIMENSION_WITH_CALLOUT:'+oid)
                    leader = read_leader(oid+'-leader'); owner_mark(leader, row, 'LENGTH', owner); leader_points = _xy(leader);start,end=leader_points[0],leader_points[-1]
                    _check(leader.get('data-owner-points') == ' '.join(segment_points[owner]), 'LENGTH_LEADER_POINT_IDENTITY_MISMATCH:'+oid)
                    _check(math.dist(start, ((a[0]+b[0])/2,(a[1]+b[1])/2)) < .01, 'LENGTH_LEADER_OWNER_MISMATCH:'+oid)
                    _check(math.dist(end,anchor) < font*4 and leader_length(leader_points) <= font*12, 'LENGTH_LEADER_LABEL_MISMATCH:'+oid)
                    fraction, distance = _distance(anchor, a, b)
                else:
                    _check(oid+'-leader' not in ids, 'UNEXPECTED_LENGTH_LEADER:'+oid)
                    fraction, distance = _distance(anchor, a, b)
                    _check(.05 <= fraction <= .95 and distance < font*7, 'LENGTH_LABEL_DETACHED:'+oid)
                    if row['mode'] == 'DIMENSION':
                        dim = read(oid+'-dimension', 'line'); owner_mark(dim, row, 'LENGTH', owner); ends = _xy(dim)
                        shifts = [(p[0]-q[0], p[1]-q[1]) for p, q in zip(ends, (a, b))]
                        _check(math.dist(*shifts) < .01, 'DIMENSION_ENDPOINT_SPAN_MISMATCH:'+oid)
                        dx, dy = b[0]-a[0], b[1]-a[1]
                        _check(abs(shifts[0][0]*dx+shifts[0][1]*dy)/math.hypot(dx, dy) < .01 and math.hypot(*shifts[0]) > font, 'DIMENSION_NOT_OWNER_NORMAL:'+oid)
                        for i, endpoint in enumerate(ends):
                            cap = read(oid+'-cap-'+str(i), 'line'); owner_mark(cap, row, 'LENGTH', owner); p, q = _xy(cap)
                            _check(math.dist(((p[0]+q[0])/2, (p[1]+q[1])/2), endpoint) < .01, 'DIMENSION_CAP_ENDPOINT_MISMATCH:'+oid)
                            _check(math.dist(p, q) > 0 and abs((p[0]-q[0])*dx+(p[1]-q[1])*dy)/(math.dist(p, q)*math.hypot(dx, dy)) < 1e-6, 'DIMENSION_CAP_ORIENTATION_MISMATCH:'+oid)
                    else:
                        _check(row['mode'] == 'ADJACENT', 'LENGTH_MODE_INVALID')
                        _check(distance <= font*2.5, 'LENGTH_LABEL_TOO_FAR_FROM_OWNER:'+oid)
                        for other in declared_segments-{owner}:
                            other_distance = _distance(anchor, *_xy(read(other, 'line')))[1]
                            _check(other_distance+font*.25 >= distance, 'LENGTH_OWNER_AMBIGUOUS_USE_DIMENSION:'+oid)
            observations.append({'id': oid, 'type': 'LENGTH', 'ownerSegment': owner, 'observedLength': value,
                                 'projectionFraction': fraction, 'offsetPx': distance, 'labelPlacement': label_placement})
        for row in facts['regions']:
            oid = row['id']; e = read(oid, 'polygon'); p, refs = _xy(e), row['points']
            owner_mark(e, row, 'REGION', oid)
            _check(3 <= len(refs) <= 32 and len(set(refs)) == len(refs) and _ring(p) == _ring(list(map(pt, refs))) and e.get('data-owner-points') == ' '.join(refs), 'REGION_BOUNDARY_OWNER_MISMATCH:'+oid)
            value = _area(list(map(inverse, p)))
            _check(value > 0 and abs(value-_number(row['value'])) < 1e-7, 'REGION_AREA_MISMATCH:'+oid)
            anchor, font, le = label(oid+'-label', row['text'], oid, oid, 'AREA_LABEL', row.get('powerSpans', [])); owner_mark(le, row, 'REGION', oid)
            if row.get('leader', False):
                leader = read_leader(oid+'-leader'); owner_mark(leader, row, 'REGION', oid); leader_points=_xy(leader);a,b=leader_points[0],leader_points[-1]
                _check(_inside(a, p, True) and math.dist(b, anchor) < font*4 and leader_length(leader_points) <= font*6, 'REGION_LEADER_OWNER_MISMATCH:'+oid)
            else:
                _check(_inside(anchor, p), 'AREA_LABEL_OUTSIDE_OWNER_REGION:'+oid)
            observations.append({'id': oid, 'type': 'REGION', 'observedArea': value, 'ownerPoints': refs, 'leader': row.get('leader', False)})
        for row in facts['otherLabels']:
            _, _, e = label(row['id'], row['text'], power_spans=row.get('powerSpans', []))
            _check([''.join(n.itertext()) for n in e.iter() if n.get('baseline-shift') == 'super'] == row.get('powers', []), 'OTHER_LABEL_POWER_SCOPE_MISMATCH:'+row['id'])
            if e.get('data-label-kind') == 'CONDITION_BOX':
                read(row['id']+'-box', 'rect')
            condition_for=row.get('conditionBoxFor',[])
            _check(isinstance(condition_for,list) and len(condition_for)==len(set(condition_for)), 'CONDITION_BOX_ANNOTATION_LIST_INVALID:'+row['id'])
            for annotation_id in condition_for:
                annotation=annotation_rows.get(annotation_id)
                _check(annotation is not None and annotation.get('labelPlacement')=='CONDITION_BOX' and annotation.get('conditionBoxId')==row['id'], 'CONDITION_BOX_ANNOTATION_BINDING_MISMATCH:'+row['id'])
        for annotation_id,annotation in annotation_rows.items():
            if annotation.get('labelPlacement')=='CONDITION_BOX':
                box_fact=other_labels_by_id.get(annotation.get('conditionBoxId'))
                _check(box_fact is not None and annotation_id in box_fact.get('conditionBoxFor',[]), 'CONDITION_BOX_ANNOTATION_REVIEW_MISSING:'+annotation_id)
        _check(set(primitives) <= covered, 'UNREVIEWED_PRIMITIVES:'+','.join(sorted(set(primitives)-covered)))
        _check(set(labels) == label_covered, 'UNREVIEWED_LABELS:'+','.join(sorted(set(labels)-label_covered)))
        fonts = [_number(e.get('font-size')) for e in labels.values() if e.get('data-label-kind') in {'POINT_NAME', 'ANGLE_LABEL', 'LENGTH_LABEL', 'AREA_LABEL', 'COORDINATE_LABEL', 'EQUATION_LABEL', 'CONDITION_BOX'}]
        _check(bool(fonts) and min(fonts) >= 14 and max(fonts)-min(fonts) < 1e-7, 'GEOMETRY_BASE_FONT_INCONSISTENT')
        report['coverage'] = {'declaredFacts': len(all_ids), 'observations': len(observations), 'primitiveCount': len(primitives), 'labelCount': len(labels), 'unreviewedPrimitives': 0, 'unreviewedLabels': 0}
    except (ValueError, KeyError, TypeError, IndexError, ZeroDivisionError, OverflowError, UnicodeDecodeError, ET.ParseError) as error:
        errors.append(str(error))
    report['status'] = 'FAIL' if errors else 'PASS'
    return report


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for name in ('svg', 'review', 'source', 'solution'):
        p.add_argument('--'+name, required=True)
    p.add_argument('--out')
    args = p.parse_args()
    result = audit(Path(args.svg).read_bytes(), json.loads(Path(args.review).read_text(encoding='utf-8')), source_bytes=Path(args.source).read_bytes(), solution_bytes=Path(args.solution).read_bytes())
    text = json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False)+'\n'
    if args.out:
        target = Path(args.out).resolve()
        _check(target.is_relative_to((ROOT/'.tmp/archive').resolve()), 'EVIDENCE_OUTPUT_SCOPE_VIOLATION')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding='utf-8')
    print(text)
    return 0 if result['status'] == 'PASS' else 1


if __name__ == '__main__':
    raise SystemExit(main())
