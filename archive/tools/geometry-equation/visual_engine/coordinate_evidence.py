"""Fail-closed coordinate provenance for geometry publication candidates.

Publication coordinates must declare whether they came directly from source facts
or are a constructed Euclidean realization. Constructed realizations are accepted
only when normalization, every point coordinate, constraints, construction steps,
residuals, and degeneracy checks are explicit and internally verified.
"""
import math
import re

ID = re.compile(r'[A-Za-z0-9_-]{1,100}\Z')
MODES = {'SOURCE_COORDINATES', 'CONSTRUCTED_REALIZATION'}
CONDITION_KINDS = {'DISTANCE', 'PERPENDICULAR', 'PARALLEL', 'COLLINEAR', 'MIDPOINT', 'EQUAL_DISTANCE'}


def _check(condition, message):
    if not condition:
        raise ValueError(message)


def _number(value):
    if isinstance(value, bool):
        raise ValueError('CONSTRUCTED_NONFINITE_NUMBER')
    try:
        value = float(value)
    except (TypeError, ValueError):
        raise ValueError('CONSTRUCTED_NONFINITE_NUMBER') from None
    if not math.isfinite(value):
        raise ValueError('CONSTRUCTED_NONFINITE_NUMBER')
    return value


def _pair(value):
    _check(isinstance(value, (list, tuple)) and len(value) == 2, 'CONSTRUCTED_POINT_PAIR_REQUIRED')
    return tuple(_number(v) for v in value)


def _vector(a, b):
    return b[0]-a[0], b[1]-a[1]


def _condition_residual(points, row):
    kind = row.get('kind')
    refs = row.get('refs')
    _check(kind in CONDITION_KINDS and isinstance(refs, list) and all(r in points for r in refs),
           'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
    p = [points[r] for r in refs]
    if kind == 'DISTANCE':
        _check(len(p) == 2 and 'expected' in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+row['id'])
        return abs(math.dist(p[0], p[1])-_number(row['expected']))
    if kind in {'PERPENDICULAR', 'PARALLEL'}:
        _check(len(p) == 4 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+row['id'])
        u, v = _vector(p[0], p[1]), _vector(p[2], p[3])
        nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERATE_CONDITION:'+row['id'])
        value = u[0]*v[0]+u[1]*v[1] if kind == 'PERPENDICULAR' else u[0]*v[1]-u[1]*v[0]
        return abs(value)/(nu*nv)
    if kind == 'COLLINEAR':
        _check(len(p) == 3 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+row['id'])
        u, v = _vector(p[0], p[1]), _vector(p[0], p[2])
        nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERATE_CONDITION:'+row['id'])
        return abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)
    if kind == 'MIDPOINT':
        _check(len(p) == 3 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+row['id'])
        midpoint = ((p[1][0]+p[2][0])/2, (p[1][1]+p[2][1])/2)
        return math.dist(p[0], midpoint)
    if kind == 'EQUAL_DISTANCE':
        _check(len(p) == 4 and 'expected' not in row, 'CONSTRUCTED_CONDITION_SCHEMA:'+row['id'])
        return abs(math.dist(p[0], p[1])-math.dist(p[2], p[3]))
    raise ValueError('UNSUPPORTED_CONSTRUCTED_CONDITION:'+str(kind))


def _degeneracy_metric(points, row):
    kind, refs = row.get('kind'), row.get('refs')
    _check(isinstance(refs, list) and all(r in points for r in refs),
           'CONSTRUCTED_DEGENERACY_SCHEMA:'+str(row.get('id')))
    p = [points[r] for r in refs]
    if kind == 'NONCOLLINEAR':
        _check(len(p) == 3, 'CONSTRUCTED_DEGENERACY_SCHEMA:'+row['id'])
        u, v = _vector(p[0], p[1]), _vector(p[0], p[2])
        nu, nv = math.hypot(*u), math.hypot(*v)
        _check(nu > 1e-12 and nv > 1e-12, 'CONSTRUCTED_DEGENERACY_FAIL:'+row['id'])
        return abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)
    if kind == 'DISTINCT_POINTS':
        _check(len(p) == 2, 'CONSTRUCTED_DEGENERACY_SCHEMA:'+row['id'])
        return math.dist(p[0], p[1])
    raise ValueError('UNSUPPORTED_CONSTRUCTED_DEGENERACY:'+str(kind))


def validate_coordinate_evidence(core):
    source = core.get('sourceFacts')
    evidence = source.get('coordinateEvidence') if isinstance(source, dict) else None
    _check(isinstance(evidence, dict), 'COORDINATE_EVIDENCE_REQUIRED')
    mode = evidence.get('mode')
    _check(mode in MODES, 'COORDINATE_EVIDENCE_MODE_REQUIRED')
    rationale = evidence.get('rationale')
    _check(isinstance(rationale, str) and 8 <= len(rationale.strip()) <= 2000,
           'COORDINATE_EVIDENCE_RATIONALE_REQUIRED')
    points = {o['id']: _pair(o['at']) for o in core.get('objects', []) if o.get('kind') == 'POINT'}
    _check(points, 'COORDINATE_EVIDENCE_POINT_SET_REQUIRED')

    if mode == 'SOURCE_COORDINATES':
        _check(set(evidence) == {'mode', 'rationale', 'sourcePointIds'}, 'SOURCE_COORDINATE_EVIDENCE_SCHEMA')
        ids = evidence.get('sourcePointIds')
        _check(isinstance(ids, list) and len(ids) == len(set(ids)) and set(ids) == set(points),
               'SOURCE_COORDINATE_ID_COVERAGE_FAIL')
        return evidence

    required = {'mode', 'rationale', 'normalization', 'freeVariables', 'pointCoordinates',
                'conditions', 'constructionSteps', 'residualChecks', 'degeneracyChecks'}
    _check(set(evidence) == required, 'CONSTRUCTED_COORDINATE_EVIDENCE_SCHEMA')

    coords = evidence['pointCoordinates']
    _check(isinstance(coords, dict) and set(coords) == set(points), 'CONSTRUCTED_POINT_COORDINATE_COVERAGE_FAIL')
    coords = {k: _pair(v) for k, v in coords.items()}
    _check(all(math.dist(coords[k], points[k]) <= 1e-12 for k in points),
           'CONSTRUCTED_POINT_COORDINATE_MISMATCH')

    norm = evidence['normalization']
    _check(isinstance(norm, dict) and set(norm) == {'originPoint', 'xAxisPoint', 'unitScale'},
           'CONSTRUCTED_NORMALIZATION_SCHEMA')
    origin, axis = norm.get('originPoint'), norm.get('xAxisPoint')
    scale = _number(norm.get('unitScale'))
    _check(origin in points and axis in points and origin != axis and scale > 0,
           'CONSTRUCTED_NORMALIZATION_INVALID')
    _check(math.dist(coords[origin], (0.0, 0.0)) <= 1e-12 and
           abs(coords[axis][1]) <= 1e-12 and abs(coords[axis][0]-scale) <= 1e-12,
           'CONSTRUCTED_NORMALIZATION_MISMATCH')

    variables = evidence['freeVariables']
    _check(isinstance(variables, list) and len(variables) <= 100, 'CONSTRUCTED_FREE_VARIABLES_SCHEMA')
    variable_ids = []
    for row in variables:
        _check(isinstance(row, dict) and set(row) == {'id', 'value'} and
               isinstance(row.get('id'), str) and ID.fullmatch(row['id']),
               'CONSTRUCTED_FREE_VARIABLE_SCHEMA')
        _number(row['value']); variable_ids.append(row['id'])
    _check(len(variable_ids) == len(set(variable_ids)), 'CONSTRUCTED_FREE_VARIABLE_DUPLICATE')

    conditions = evidence['conditions']
    _check(isinstance(conditions, list) and 1 <= len(conditions) <= 100,
           'CONSTRUCTED_CONDITION_ARRAY_REQUIRED')
    condition_ids, computed = [], {}
    for row in conditions:
        _check(isinstance(row, dict) and set(row) <= {'id', 'kind', 'refs', 'expected', 'tolerance'} and
               {'id', 'kind', 'refs', 'tolerance'} <= set(row) and
               isinstance(row.get('id'), str) and ID.fullmatch(row['id']),
               'CONSTRUCTED_CONDITION_SCHEMA:'+str(row.get('id')))
        tolerance = _number(row['tolerance'])
        _check(0 < tolerance <= 1e-6, 'CONSTRUCTED_TOLERANCE_OUT_OF_RANGE:'+row['id'])
        residual = _condition_residual(coords, row)
        _check(residual <= tolerance, 'CONSTRUCTED_CONDITION_RESIDUAL_FAIL:'+row['id'])
        condition_ids.append(row['id']); computed[row['id']] = (residual, tolerance)
    _check(len(condition_ids) == len(set(condition_ids)), 'CONSTRUCTED_CONDITION_DUPLICATE')

    steps = evidence['constructionSteps']
    _check(isinstance(steps, list) and 1 <= len(steps) <= 200, 'CONSTRUCTED_STEP_ARRAY_REQUIRED')
    step_ids, outputs = [], []
    for row in steps:
        _check(isinstance(row, dict) and set(row) == {'id', 'operation', 'output', 'inputs'} and
               isinstance(row.get('id'), str) and ID.fullmatch(row['id']) and
               isinstance(row.get('operation'), str) and re.fullmatch(r'[A-Z0-9_]{2,80}', row['operation']) and
               row.get('output') in points and isinstance(row.get('inputs'), list) and
               all(isinstance(v, str) and v for v in row['inputs']),
               'CONSTRUCTED_STEP_SCHEMA:'+str(row.get('id')))
        step_ids.append(row['id']); outputs.append(row['output'])
    _check(len(step_ids) == len(set(step_ids)) and len(outputs) == len(set(outputs)) and set(outputs) == set(points),
           'CONSTRUCTED_STEP_COVERAGE_FAIL')

    checks = evidence['residualChecks']
    _check(isinstance(checks, list) and len(checks) == len(conditions),
           'CONSTRUCTED_RESIDUAL_COVERAGE_FAIL')
    seen = set()
    for row in checks:
        _check(isinstance(row, dict) and set(row) == {'conditionId', 'residual', 'tolerance'} and
               row.get('conditionId') in computed and row['conditionId'] not in seen,
               'CONSTRUCTED_RESIDUAL_SCHEMA')
        seen.add(row['conditionId'])
        residual, tolerance = computed[row['conditionId']]
        declared, declared_tolerance = _number(row['residual']), _number(row['tolerance'])
        _check(abs(declared_tolerance-tolerance) <= 1e-15 and
               abs(declared-residual) <= max(1e-12, tolerance*1e-6),
               'CONSTRUCTED_RESIDUAL_EVIDENCE_MISMATCH:'+row['conditionId'])
        _check(declared <= declared_tolerance, 'CONSTRUCTED_RESIDUAL_FAIL:'+row['conditionId'])
    _check(seen == set(condition_ids), 'CONSTRUCTED_RESIDUAL_COVERAGE_FAIL')

    degeneracy = evidence['degeneracyChecks']
    _check(isinstance(degeneracy, list) and 1 <= len(degeneracy) <= 100,
           'CONSTRUCTED_DEGENERACY_COVERAGE_REQUIRED')
    deg_ids = set()
    for row in degeneracy:
        _check(isinstance(row, dict) and set(row) == {'id', 'kind', 'refs', 'observed', 'minimum'} and
               isinstance(row.get('id'), str) and ID.fullmatch(row['id']) and row['id'] not in deg_ids,
               'CONSTRUCTED_DEGENERACY_SCHEMA:'+str(row.get('id')))
        deg_ids.add(row['id'])
        observed, minimum = _number(row['observed']), _number(row['minimum'])
        metric = _degeneracy_metric(coords, row)
        _check(abs(observed-metric) <= 1e-9, 'CONSTRUCTED_DEGENERACY_EVIDENCE_MISMATCH:'+row['id'])
        _check(minimum >= 0 and metric > minimum, 'CONSTRUCTED_DEGENERACY_FAIL:'+row['id'])

    return evidence
