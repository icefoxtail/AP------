"""Independent number-line observer. Does not import the producer.

Re-solves the plan's quadratic inequality with SymPy (solveset over the reals, the domain interval, the adjoined values), recomputes the integer
points, and checks the final number-line panel SVG: the end dots (place, filled = closed, hollow = open), the solution band, every integer dot,
the 0 tick, and every label (its TeX read back as a number or as the interval, centred on its owner, clear of every dot, tick and other label).
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET
import sympy as S

v = S.Symbol('v', real=True)
NS = '{http://www.w3.org/2000/svg}'
TOL = 0.01
RATIONAL = re.compile(r'^-?\d{1,15}(?:/\d{1,15})?$')


def _rational(text, code):
    if not isinstance(text, str) or not RATIONAL.fullmatch(text): raise ValueError(code)
    value = S.Rational(text)
    return value


def expected_solution(numberLine):
    """The one interval the inequality's set is (an S.Interval, S.Reals or a one-point FiniteSet), with its integer points (or None)."""
    values = numberLine.get('coefficients')
    if not isinstance(values, list) or len(values) != 3: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    c = [_rational(value, 'NL_OBSERVER_PLAN_INVALID') for value in values]
    if c[2] == 0: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    f = c[0] + c[1] * v + c[2] * v ** 2
    relation = {'<': S.Lt, '<=': S.Le, '>': S.Gt, '>=': S.Ge}.get(numberLine.get('comparator'))
    if relation is None: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    solution = S.solveset(relation(f, 0), v, S.Reals)
    domain = numberLine.get('domain')
    if domain is not None:
        lo, hi = [None if value is None else _rational(value, 'NL_OBSERVER_PLAN_INVALID') for value in domain['range']]
        states = domain.get('states', ['CLOSED', 'CLOSED'])
        solution = solution.intersect(S.Interval(-S.oo if lo is None else lo, S.oo if hi is None else hi, states[0] == 'OPEN', states[1] == 'OPEN'))
    for text in numberLine.get('adjoinedPoints', []):
        solution = solution.union(S.FiniteSet(_rational(text, 'NL_OBSERVER_PLAN_INVALID')))
    if solution == S.Reals: kind = 'ALL_REALS'
    elif isinstance(solution, S.FiniteSet) and len(solution) == 1: kind = 'POINT'
    elif isinstance(solution, S.Interval): kind = 'INTERVAL'
    else: raise ValueError('NL_OBSERVER_SOLUTION_NOT_ONE_INTERVAL')
    integers = None
    request = numberLine.get('integerPoints')
    if request is not None:
        lo = solution.inf if kind != 'ALL_REALS' else -S.oo
        hi = solution.sup if kind != 'ALL_REALS' else S.oo
        if request is not True:
            lo, hi = S.Max(lo, int(request['range'][0])), S.Min(hi, int(request['range'][1]))
        if not (lo.is_finite and hi.is_finite): raise ValueError('NL_OBSERVER_INTEGER_RANGE_UNBOUNDED')
        integers = [n for n in range(int(S.floor(lo)), int(S.ceiling(hi)) + 1) if solution.contains(S.Integer(n)) == S.true]
    return kind, solution, integers


# --- the label TeX read back: integers, -, +, \frac{..}{..}, k\sqrt{n} -------------------------------------------------------------------------
def parse_tex_number(tex, symbols=None):
    """symbols (optional): {letter: value} for a label that may carry the figure's parameter (a, 2a, \frac{a+2}{3})."""
    tex = re.sub(r'^\\displaystyle\s*', '', tex)
    tokens = re.findall(r'\\dfrac|\\frac|\\sqrt|\d+|[a-z]|[{}+\-]', tex.replace(' ', ''))
    if ''.join(tokens) != tex.replace(' ', ''): raise ValueError('NL_LABEL_TEX_UNREADABLE')
    position = [0]
    def peek(): return tokens[position[0]] if position[0] < len(tokens) else None
    def take(expected=None):
        token = peek()
        if token is None or expected is not None and token != expected: raise ValueError('NL_LABEL_TEX_UNREADABLE')
        position[0] += 1
        return token
    def group():
        take('{'); value = expression(); take('}'); return value
    def term():
        token = peek()
        if token in ('\\frac', '\\dfrac'):
            take(); return group() / group()
        if token == '\\sqrt':
            take(); return S.sqrt(group())
        if token is not None and token.isdigit():
            value = S.Integer(take())
            if peek() == '\\sqrt':
                take(); value = value * S.sqrt(group())
            elif symbols and peek() in symbols:
                value = value * symbols[take()]
            return value
        if symbols and token in symbols:
            return symbols[take()]
        raise ValueError('NL_LABEL_TEX_UNREADABLE')
    def expression():
        sign = 1
        if peek() == '-': take(); sign = -1
        value = sign * term()
        while peek() in ('+', '-'):
            value = value + term() if take() == '+' else value - term()
        return value
    value = expression()
    if position[0] != len(tokens): raise ValueError('NL_LABEL_TEX_UNREADABLE')
    return S.nsimplify(value)


def parse_header(tex, variable, symbols=None):
    """'lo\\le v<hi', 'v>lo', 'v=p' ... -> (lower, lowerClosed, upper, upperClosed); None for an infinite side."""
    parts = re.split(r'(\\le|\\ge|<|>|=)', re.sub(r'^\\displaystyle\s*', '', tex).replace(' ', ''))
    rel = {'\\le': ('<', True), '<': ('<', False), '\\ge': ('>', True), '>': ('>', False)}
    if len(parts) == 5 and parts[2] == variable and parts[1] in ('\\le', '<') and parts[3] in ('\\le', '<'):
        return parse_tex_number(parts[0], symbols), rel[parts[1]][1], parse_tex_number(parts[4], symbols), rel[parts[3]][1]
    if len(parts) == 3 and parts[0] == variable:
        if parts[1] == '=':
            value = parse_tex_number(parts[2], symbols); return value, True, value, True
        direction, closed = rel[parts[1]]
        value = parse_tex_number(parts[2], symbols)
        return (value, closed, None, False) if direction == '>' else (None, False, value, closed)
    raise ValueError('NL_HEADER_UNREADABLE')


def _num(element, name):
    value = element.get(name)
    try: number = float(value)
    except (TypeError, ValueError): raise ValueError('NL_SVG_ATTRIBUTE_INVALID:' + name) from None
    if not math.isfinite(number): raise ValueError('NL_SVG_ATTRIBUTE_INVALID:' + name)
    return number


def audit(numberLine, svg):
    if 'rows' in numberLine: return audit_figure(numberLine, svg)
    errors = []
    kind, solution, integers = expected_solution(numberLine)
    root = ET.fromstring(svg)
    variable = numberLine.get('variable', 'x')
    if root.get('data-number-line') != 'number-line-v1': errors.append('NL_SVG_NOT_A_NUMBER_LINE')
    if root.get('data-variable') != variable: errors.append('NL_VARIABLE_MISMATCH')
    unit_left, unit_right, px_left, px_right = (_num(root, name) for name in ('data-unit-left', 'data-unit-right', 'data-px-left', 'data-px-right'))
    if not (unit_left < unit_right and px_left < px_right): raise ValueError('NL_SVG_MAP_INVALID')
    def px(value): return px_left + (float(value) - unit_left) / (unit_right - unit_left) * (px_right - px_left)
    by_id = {element.get('id'): element for element in root.iter() if element.get('id')}
    axis = by_id.get('x-axis')
    if axis is None: raise ValueError('NL_AXIS_MISSING')
    axis_y, axis_x1, axis_x2 = _num(axis, 'y1'), _num(axis, 'x1'), _num(axis, 'x2')
    if abs(_num(axis, 'y2') - axis_y) > TOL or axis_x1 > px_left or axis_x2 < px_right: errors.append('NL_AXIS_DOES_NOT_COVER_MAP')
    circles = [element for element in root.iter(NS + 'circle')]
    # End dots: the solution's own ends, nothing else.
    ends = {}
    if kind == 'POINT': ends['endpoint-point'] = (list(solution)[0], True)
    elif kind == 'INTERVAL':
        if solution.inf.is_finite: ends['endpoint-lower'] = (solution.inf, not solution.left_open)
        if solution.sup.is_finite: ends['endpoint-upper'] = (solution.sup, not solution.right_open)
    drawn_ends = {element.get('id') for element in circles if element.get('data-dot') == 'endpoint'}
    if drawn_ends != set(ends): errors.append('NL_ENDPOINT_SET_MISMATCH:' + ','.join(sorted(drawn_ends ^ set(ends))))
    for end_id, (value, closed) in ends.items():
        element = by_id.get(end_id)
        if element is None: continue
        if abs(_num(element, 'cx') - px(value)) > TOL or abs(_num(element, 'cy') - axis_y) > TOL: errors.append('NL_ENDPOINT_POSITION:' + end_id)
        if not px_left - TOL <= _num(element, 'cx') <= px_right + TOL: errors.append('NL_ENDPOINT_OUTSIDE_MAP:' + end_id)
        fill = (element.get('fill') or '').lower()
        if fill != ('#111' if closed else '#fff') or element.get('data-state') != ('CLOSED' if closed else 'OPEN'): errors.append('NL_ENDPOINT_STATE:' + end_id)
        text = element.get('data-value', '')
        if not re.fullmatch(r'[0-9+\-*/()sqrt]{1,64}', text) or S.simplify(S.sympify(text) - value) != 0: errors.append('NL_ENDPOINT_VALUE:' + end_id)
    # The band: from the lower end (or the axis start) to the upper end (or the arrow), on the axis; no band for one point.
    band = by_id.get('solution-band')
    if kind == 'POINT':
        if band is not None: errors.append('NL_BAND_FOR_A_POINT')
    elif band is None: errors.append('NL_BAND_MISSING')
    else:
        lower = solution.inf if kind == 'INTERVAL' else -S.oo
        upper = solution.sup if kind == 'INTERVAL' else S.oo
        x1, x2 = _num(band, 'x1'), _num(band, 'x2')
        if abs(_num(band, 'y1') - axis_y) > TOL or abs(_num(band, 'y2') - axis_y) > TOL: errors.append('NL_BAND_OFF_AXIS')
        if lower.is_finite and abs(x1 - px(lower)) > TOL or not lower.is_finite and abs(x1 - axis_x1) > TOL: errors.append('NL_BAND_LOWER_EXTENT')
        if upper.is_finite and abs(x2 - px(upper)) > TOL or not upper.is_finite and x2 < px_right: errors.append('NL_BAND_UPPER_EXTENT')
    # Integer points: exactly the integers of the set (in the requested range), each above its place.
    integer_dots = [element for element in circles if element.get('data-dot') == 'integer']
    dots = {element.get('data-value'): element for element in integer_dots}
    want = [] if integers is None else [str(n) for n in integers]
    if len(integer_dots) != len(want) or set(dots) != set(want): errors.append('NL_INTEGER_POINTS_MISMATCH')
    for text, element in dots.items():
        if re.fullmatch(r'-?\d+', text or '') and abs(_num(element, 'cx') - px(int(text))) > TOL: errors.append('NL_INTEGER_POSITION:' + text)
        if (element.get('fill') or '').lower() != '#111': errors.append('NL_INTEGER_NOT_FILLED:' + text)
    ticks = [element for element in root.iter(NS + 'line') if element.get('data-role') == 'tick']
    for tick in ticks:
        if tick.get('data-value') != '0' or abs(_num(tick, 'x1') - px(0)) > TOL or abs(_num(tick, 'x2') - px(0)) > TOL: errors.append('NL_TICK_POSITION:' + (tick.get('id') or ''))
    # Labels: read every label's TeX back and bind it to its owner.
    labels = [element for element in root.iter(NS + 'g') if element.get('data-label-role')]
    boxes = []
    owners = {}
    for label in labels:
        role, owner, label_id = label.get('data-label-role'), label.get('data-owner'), label.get('id')
        match = re.fullmatch(r'translate\(([-\d.e]+) ([-\d.e]+)\)', label.get('transform') or '')
        inner = label.find(NS + 'svg')
        if not match or inner is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(label_id)); continue
        box = (float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height'))
        boxes.append((label_id, box))
        centre = box[0] + box[2] / 2
        owners.setdefault(owner, []).append(label_id)
        tex = label.get('data-tex')
        try:
            if role == 'header':
                if kind == 'ALL_REALS':
                    if label.get('data-text') != '모든 실수': errors.append('NL_HEADER_MISMATCH')
                    continue
                lower, lower_closed, upper, upper_closed = parse_header(tex or '', variable)
                if kind == 'POINT': same = lower == upper == list(solution)[0]
                else:
                    same = (lower is None) == (not solution.inf.is_finite) and (upper is None) == (not solution.sup.is_finite)
                    same = same and (lower is None or lower == solution.inf and lower_closed == (not solution.left_open))
                    same = same and (upper is None or upper == solution.sup and upper_closed == (not solution.right_open))
                if not same: errors.append('NL_HEADER_MISMATCH')
                continue
            if role == 'variable':
                if tex != variable: errors.append('NL_VARIABLE_LABEL_MISMATCH')
                if box[0] < axis_x2: errors.append('NL_VARIABLE_LABEL_ON_AXIS')
                continue
            value = parse_tex_number(tex or '')
        except ValueError as error:
            errors.append(str(error) + ':' + str(label_id)); continue
        target = by_id.get(owner)
        if target is None: errors.append('NL_LABEL_OWNER_MISSING:' + str(label_id)); continue
        if role == 'endpoint':
            if owner not in ends or value != S.nsimplify(ends[owner][0]): errors.append('NL_ENDPOINT_LABEL_VALUE:' + str(label_id))
            at, below = _num(target, 'cx'), True
        elif role == 'integer':
            if str(value) != target.get('data-value'): errors.append('NL_INTEGER_LABEL_VALUE:' + str(label_id))
            at, below = _num(target, 'cx'), False
        elif role == 'tick':
            if value != 0: errors.append('NL_TICK_LABEL_VALUE:' + str(label_id))
            at, below = _num(target, 'x1'), True
        else: errors.append('NL_LABEL_ROLE_UNKNOWN:' + str(label_id)); continue
        if abs(centre - at) > 0.5: errors.append('NL_LABEL_NOT_CENTRED:' + str(label_id))
        if below and box[1] < axis_y + 1.6: errors.append('NL_LABEL_NOT_BELOW_AXIS:' + str(label_id))
        if not below and box[1] + box[3] > _num(target, 'cy') - _num(target, 'r'): errors.append('NL_LABEL_NOT_ABOVE_DOT:' + str(label_id))
    # Every integer dot is labelled (ALL), or only the smallest and the largest (ENDS, when the labels cannot all have room).
    mode = root.get('data-integer-labels')
    if want and mode not in ('ALL', 'ENDS') or not want and mode is not None: errors.append('NL_INTEGER_LABEL_MODE')
    labelled = set(want) if mode == 'ALL' else {want[0], want[-1]} if want else set()
    for owner_id in list(ends) + [tick.get('id') for tick in ticks]:
        if len(owners.get(owner_id, [])) != 1: errors.append('NL_LABEL_COUNT:' + str(owner_id))
    for text, element in dots.items():
        if len(owners.get(element.get('id'), [])) != (1 if text in labelled else 0): errors.append('NL_LABEL_COUNT:' + str(element.get('id')))
    if len([label for label in labels if label.get('data-label-role') == 'header']) != 1: errors.append('NL_HEADER_COUNT')
    # Clear of each other, of every dot (with its stroke) and of every tick.
    for i, (label_id, a) in enumerate(boxes):
        for other_id, b in boxes[i + 1:]:
            if a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]: errors.append('NL_LABEL_OVERLAP:' + label_id + ':' + other_id)
        for circle in circles:
            cx, cy, r = _num(circle, 'cx'), _num(circle, 'cy'), _num(circle, 'r') + 0.8
            dx, dy = max(a[0] - cx, 0, cx - a[0] - a[2]), max(a[1] - cy, 0, cy - a[1] - a[3])
            if math.hypot(dx, dy) <= r: errors.append('NL_LABEL_ON_DOT:' + label_id + ':' + str(circle.get('id')))
        for tick in ticks:
            x, y1, y2 = _num(tick, 'x1'), _num(tick, 'y1'), _num(tick, 'y2')
            if a[0] - 0.6 <= x <= a[0] + a[2] + 0.6 and a[1] <= max(y1, y2) + 0.6 and min(y1, y2) - 0.6 <= a[1] + a[3]: errors.append('NL_LABEL_ON_TICK:' + label_id)
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if errors else 'PASS', 'errors': errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(),
            'observed': {'kind': kind, 'set': str(solution), 'integers': None if integers is None else [str(n) for n in integers]}}


# --- the standalone number-line figure (number-line-figure-v1) ---------------------------------------------------------------------------------
# Rows of solution sets on one shared scale (SET), the common part of the SET rows (RESULT) and marked points with an internal division (POINTS).
# Everything is re-solved from the plan's own strings (SymPy); nothing of the engine's model is read.
TRANSLATE = re.compile(r'translate\(([-\d.e]+) ([-\d.e]+)\)')


def _end_value(raw, parameter):
    if raw is None: return None
    if 'value' in raw: return _rational(raw['value'], 'NL_OBSERVER_PLAN_INVALID')
    if parameter is None: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    return _rational(raw['param']['mul'], 'NL_OBSERVER_PLAN_INVALID') * parameter + _rational(raw['param'].get('add', '0'), 'NL_OBSERVER_PLAN_INVALID')


def _pieces_of(solution):
    if solution == S.EmptySet: return []
    parts = list(solution.args) if isinstance(solution, S.Union) else [solution]
    if not all(isinstance(part, S.Interval) for part in parts): raise ValueError('NL_OBSERVER_SET_NOT_INTERVALS')
    return sorted(parts, key=lambda part: float(part.inf) if part.inf.is_finite else -1e18)


def expected_figure(numberLine):
    parameter_spec = numberLine.get('parameter')
    parameter = None if parameter_spec is None else _rational(parameter_spec['value'], 'NL_OBSERVER_PLAN_INVALID')
    rows, sets = [], []
    for row in numberLine['rows']:
        kind = row['kind']
        parametric = None
        if kind == 'SET':
            parts = []
            for piece in row['pieces']:
                lo, hi = _end_value(piece['lo'], parameter), _end_value(piece['hi'], parameter)
                parts.append((-S.oo if lo is None else lo, piece['lo'] is not None and 'param' in piece['lo'], piece['hi'] is not None and 'param' in piece['hi'],
                              S.Interval(-S.oo if lo is None else lo, S.oo if hi is None else hi,
                                         True if piece['lo'] is None else piece['lo']['state'] == 'OPEN', True if piece['hi'] is None else piece['hi']['state'] == 'OPEN')))
            parts.sort(key=lambda item: float(item[0]) if item[0].is_finite else -1e18)
            parametric = [(item[1], item[2]) for item in parts]
            solution = S.Union(*[item[3] for item in parts])
            sets.append(solution)
        elif kind == 'RESULT':
            solution = sets[0]
            for other in sets[1:]: solution = solution.intersect(other)
        elif kind == 'POINTS':
            values = {point['id']: _rational(point['value'], 'NL_OBSERVER_PLAN_INVALID') for point in row['points'] if 'value' in point}
            for point in row['points']:
                if 'divides' in point:
                    m, n = (S.Integer(part) for part in point['divides']['ratio'])
                    values[point['id']] = (n * values[point['divides']['from']] + m * values[point['divides']['to']]) / (m + n)
            rows.append({'kind': kind, 'values': values, 'spec': row})
            continue
        else: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        pieces = _pieces_of(solution)
        integers = None
        request = row.get('integerPoints')
        if request is not None:
            bounded = all(piece.inf.is_finite and piece.sup.is_finite for piece in pieces)
            lo = min(piece.inf for piece in pieces) if bounded else -S.oo
            hi = max(piece.sup for piece in pieces) if bounded else S.oo
            if request is not True: lo, hi = S.Max(lo, int(request['range'][0])), S.Min(hi, int(request['range'][1]))
            if not (lo.is_finite and hi.is_finite): raise ValueError('NL_OBSERVER_INTEGER_RANGE_UNBOUNDED')
            integers = [k for k in range(int(S.floor(lo)), int(S.ceiling(hi)) + 1) if solution.contains(S.Integer(k)) == S.true]
        rows.append({'kind': kind, 'pieces': pieces, 'integers': integers, 'spec': row, 'parametric': parametric})
    return parameter_spec, parameter, rows


def audit_figure(numberLine, svg):
    errors = []
    parameter_spec, parameter, rows = expected_figure(numberLine)
    variable = numberLine.get('variable', 'x')
    symbol = None if parameter_spec is None else S.Symbol(parameter_spec['name'])
    free = None if parameter_spec is None else {parameter_spec['name']: symbol}
    at_sample = {} if symbol is None else {symbol: parameter}
    root = ET.fromstring(svg)
    if root.get('data-number-line') != 'number-line-v1' or root.get('data-figure') != 'number-line-figure-v1': errors.append('NL_SVG_NOT_A_NUMBER_LINE')
    if root.get('data-variable') != variable: errors.append('NL_VARIABLE_MISMATCH')
    unit_left, unit_right, px_left, px_right = (_num(root, name) for name in ('data-unit-left', 'data-unit-right', 'data-px-left', 'data-px-right'))
    if not (unit_left < unit_right and px_left < px_right): raise ValueError('NL_SVG_MAP_INVALID')
    def px(value): return px_left + (float(value) - unit_left) / (unit_right - unit_left) * (px_right - px_left)
    by_id = {element.get('id'): element for element in root.iter() if element.get('id')}
    circles = list(root.iter(NS + 'circle'))
    lines = list(root.iter(NS + 'line'))
    ticks = [element for element in lines if element.get('data-role') == 'tick']
    labels = [element for element in root.iter(NS + 'g') if element.get('data-label-role')]
    owners = {}
    for label in labels: owners.setdefault(label.get('data-owner'), []).append(label)
    if len(rows) != len({element.get('data-row') for element in lines if element.get('data-role') == 'axis'}): errors.append('NL_ROW_COUNT')
    def read(label, symbols=None):
        return parse_tex_number(label.get('data-tex') or '', symbols)
    def at_value(expression): return S.simplify(S.sympify(expression).subs(at_sample))
    for index, row in enumerate(rows, start=1):
        axis = by_id.get('r%d-axis' % index)
        if axis is None: errors.append('NL_AXIS_MISSING:%d' % index); continue
        axis_y, axis_x1, axis_x2 = _num(axis, 'y1'), _num(axis, 'x1'), _num(axis, 'x2')
        if abs(_num(axis, 'y2') - axis_y) > TOL or axis_x1 > px_left or axis_x2 < px_right: errors.append('NL_AXIS_DOES_NOT_COVER_MAP:%d' % index)
        in_row = lambda element: element.get('data-row') == str(index)
        row_circles = [element for element in circles if in_row(element)]
        row_labels = [element for element in labels if in_row(element)]
        if len([l for l in row_labels if l.get('data-label-role') == 'variable']) != 1: errors.append('NL_VARIABLE_LABEL_COUNT:%d' % index)
        if row['kind'] == 'POINTS':
            values = row['values']
            drawn = {element.get('data-point-id'): element for element in row_circles if element.get('data-dot') == 'point'}
            if set(drawn) != set(values): errors.append('NL_POINT_SET_MISMATCH:%d' % index)
            for point_id, value in values.items():
                element = drawn.get(point_id)
                if element is None: continue
                if abs(_num(element, 'cx') - px(value)) > TOL or abs(_num(element, 'cy') - axis_y) > TOL: errors.append('NL_POINT_POSITION:' + point_id)
                if (element.get('fill') or '').lower() != '#111': errors.append('NL_POINT_NOT_FILLED:' + point_id)
                text = element.get('data-value', '')
                if not RATIONAL.fullmatch(text) or S.Rational(text) != value: errors.append('NL_POINT_VALUE:' + point_id)
                names = [l for l in owners.get(element.get('id'), []) if l.get('data-label-role') == 'point-name']
                vals = [l for l in owners.get(element.get('id'), []) if l.get('data-label-role') == 'point-value']
                if len(names) != 1 or len(vals) != 1: errors.append('NL_POINT_LABEL_COUNT:' + point_id)
                for l in names:
                    if l.get('data-tex') != point_id: errors.append('NL_POINT_NAME_LABEL:' + point_id)
                for l in vals:
                    try:
                        if read(l) != value: errors.append('NL_POINT_VALUE_LABEL:' + point_id)
                    except ValueError as error: errors.append(str(error) + ':' + str(l.get('id')))
            # The band spans the outermost points; each internal division carries its ratio parts over its two sub-segments.
            band = by_id.get('r%d-band-1' % index)
            if band is None: errors.append('NL_BAND_MISSING:%d' % index)
            elif abs(_num(band, 'x1') - px(min(values.values()))) > TOL or abs(_num(band, 'x2') - px(max(values.values()))) > TOL or abs(_num(band, 'y1') - axis_y) > TOL: errors.append('NL_BAND_EXTENT:%d' % index)
            for point in row['spec']['points']:
                if 'divides' not in point: continue
                owner = drawn.get(point['id'])
                ratio = [l for l in owners.get(owner.get('id') if owner is not None else None, []) if l.get('data-label-role') == 'ratio']
                if len(ratio) != 2: errors.append('NL_RATIO_LABEL_COUNT:' + point['id']); continue
                a_id, b_id = point['divides']['from'], point['divides']['to']
                for label in ratio:
                    inner, match = label.find(NS + 'svg'), TRANSLATE.fullmatch(label.get('transform') or '')
                    if inner is None or not match: continue
                    centre = float(match.group(1)) + _num(inner, 'width') / 2
                    span = (label.get('data-span') or '').split(',')
                    want = {(a_id, point['id']): point['divides']['ratio'][0], (point['id'], b_id): point['divides']['ratio'][1]}.get(tuple(span))
                    if want is None or any(sid not in values for sid in span): errors.append('NL_RATIO_SPAN:' + str(label.get('id'))); continue
                    if abs(centre - (px(values[span[0]]) + px(values[span[1]])) / 2) > 0.5: errors.append('NL_RATIO_NOT_CENTRED:' + str(label.get('id')))
                    if label.get('data-tex') != want: errors.append('NL_RATIO_VALUE:' + str(label.get('id')))
            continue
        # SET / RESULT rows
        pieces = row['pieces']
        bands = sorted([element for element in lines if element.get('data-role') == 'solution-band' and in_row(element)], key=lambda element: int(element.get('data-piece', 0)))
        if len(bands) != len(pieces): errors.append('NL_BAND_COUNT:%d' % index)
        expected_ends = {}
        for k, (piece, band) in enumerate(zip(pieces, bands), start=1):
            if abs(_num(band, 'y1') - axis_y) > TOL or abs(_num(band, 'y2') - axis_y) > TOL: errors.append('NL_BAND_OFF_AXIS:%s' % band.get('id'))
            x1, x2 = _num(band, 'x1'), _num(band, 'x2')
            if piece.inf.is_finite:
                if abs(x1 - px(piece.inf)) > TOL: errors.append('NL_BAND_LOWER_EXTENT:%s' % band.get('id'))
                expected_ends[(k, 'lo')] = (piece.inf, not piece.left_open)
            elif abs(x1 - axis_x1) > TOL: errors.append('NL_BAND_LOWER_EXTENT:%s' % band.get('id'))
            if piece.sup.is_finite:
                if abs(x2 - px(piece.sup)) > TOL: errors.append('NL_BAND_UPPER_EXTENT:%s' % band.get('id'))
                expected_ends[(k, 'hi')] = (piece.sup, not piece.right_open)
            elif x2 < px_right: errors.append('NL_BAND_UPPER_EXTENT:%s' % band.get('id'))
            # the piece's own inequality label: reads back as the piece (ends and open/closed)
            mine = [l for l in owners.get(band.get('id'), []) if l.get('data-label-role') == 'set']
            if len(mine) != 1: errors.append('NL_SET_LABEL_COUNT:%s' % band.get('id'))
            for l in mine:
                try: lower, lower_closed, upper, upper_closed = parse_header(l.get('data-tex') or '', variable, free)
                except ValueError as error: errors.append(str(error) + ':' + str(l.get('id'))); continue
                ok = (lower is None) == (not piece.inf.is_finite) and (upper is None) == (not piece.sup.is_finite)
                if ok and lower is not None: ok = at_value(lower - piece.inf) == 0 and lower_closed == (not piece.left_open)
                if ok and upper is not None: ok = at_value(upper - piece.sup) == 0 and upper_closed == (not piece.right_open)
                if not ok: errors.append('NL_SET_LABEL_MISMATCH:%s' % l.get('id'))
        # endpoint dots and their labels
        drawn_ends = {(int(element.get('data-piece')), element.get('data-end')): element for element in row_circles if element.get('data-dot') == 'endpoint'}
        if set(drawn_ends) != set(expected_ends): errors.append('NL_ENDPOINT_SET_MISMATCH:%d' % index)
        for key, (value, closed) in expected_ends.items():
            element = drawn_ends.get(key)
            if element is None: continue
            if abs(_num(element, 'cx') - px(value)) > TOL or abs(_num(element, 'cy') - axis_y) > TOL: errors.append('NL_ENDPOINT_POSITION:' + element.get('id'))
            fill = (element.get('fill') or '').lower()
            if fill != ('#111' if closed else '#fff') or element.get('data-state') != ('CLOSED' if closed else 'OPEN'): errors.append('NL_ENDPOINT_STATE:' + element.get('id'))
            text = element.get('data-value', '')
            if not RATIONAL.fullmatch(text) or S.Rational(text) != value: errors.append('NL_ENDPOINT_VALUE:' + element.get('id'))
            mine = [l for l in owners.get(element.get('id'), []) if l.get('data-label-role') == 'endpoint']
            if len(mine) != 1: errors.append('NL_LABEL_COUNT:' + element.get('id')); continue
            try:
                shown = read(mine[0], free)
                if at_value(shown - value) != 0: errors.append('NL_ENDPOINT_LABEL_VALUE:' + element.get('id'))
                # a SET row's end that the plan gives through the parameter is written with it, a constant one without
                if row['parametric'] is not None:
                    wants = row['parametric'][key[0] - 1][0 if key[1] == 'lo' else 1]
                    if (symbol is not None and symbol in S.sympify(shown).free_symbols) != wants: errors.append('NL_ENDPOINT_PARAMETER_TEXT:' + element.get('id'))
            except ValueError as error: errors.append(str(error) + ':' + str(mine[0].get('id')))
        # integer dots
        integer_dots = {element.get('data-value'): element for element in row_circles if element.get('data-dot') == 'integer'}
        want = [] if row['integers'] is None else [str(k) for k in row['integers']]
        if len(integer_dots) != len(want) or set(integer_dots) != set(want): errors.append('NL_INTEGER_POINTS_MISMATCH:%d' % index)
        for text, element in integer_dots.items():
            if re.fullmatch(r'-?\d+', text or '') and abs(_num(element, 'cx') - px(int(text))) > TOL: errors.append('NL_INTEGER_POSITION:' + text)
            if (element.get('fill') or '').lower() != '#111': errors.append('NL_INTEGER_NOT_FILLED:' + text)
        modes = dict(item.split(':') for item in (root.get('data-integer-labels') or '').split(',') if item)
        mode = modes.get(str(index))
        if want and mode not in ('ALL', 'ENDS') or not want and mode is not None: errors.append('NL_INTEGER_LABEL_MODE:%d' % index)
        labelled = set(want) if mode == 'ALL' else {want[0], want[-1]} if want else set()
        for text, element in integer_dots.items():
            mine = [l for l in owners.get(element.get('id'), []) if l.get('data-label-role') == 'integer']
            if len(mine) != (1 if text in labelled else 0): errors.append('NL_LABEL_COUNT:' + str(element.get('id')))
            for l in mine:
                try:
                    if str(read(l)) != text: errors.append('NL_INTEGER_LABEL_VALUE:' + str(l.get('id')))
                except ValueError as error: errors.append(str(error) + ':' + str(l.get('id')))
        for tick in [t for t in ticks if in_row(t)]:
            if tick.get('data-value') != '0' or abs(_num(tick, 'x1') - px(0)) > TOL: errors.append('NL_TICK_POSITION:' + str(tick.get('id')))
            mine = owners.get(tick.get('id'), [])
            if len(mine) != 1: errors.append('NL_LABEL_COUNT:' + str(tick.get('id')))
            for l in mine:
                try:
                    if read(l) != 0: errors.append('NL_TICK_LABEL_VALUE:' + str(l.get('id')))
                except ValueError as error: errors.append(str(error) + ':' + str(l.get('id')))
    # the parameter note: "a=value" and the Korean tail
    notes = [l for l in labels if l.get('data-label-role') == 'note']
    if parameter_spec is None:
        if notes: errors.append('NL_NOTE_WITHOUT_PARAMETER')
    else:
        values_ = [l for l in notes if l.get('data-tex')]
        texts = [l for l in notes if l.get('data-text')]
        if len(values_) != 1 or len(texts) != 1 or texts[0].get('data-text') != '일 때의 그림': errors.append('NL_NOTE_LABELS')
        for l in values_:
            try:
                left, right = re.sub(r'^\\displaystyle\s*', '', l.get('data-tex')).replace(' ', '').split('=', 1)
                if left != parameter_spec['name'] or parse_tex_number(right) != parameter: errors.append('NL_NOTE_VALUE')
            except ValueError as error: errors.append(str(error))
    # geometry of every label: centred on its owner, on the right side of its axis, clear of each other, of every dot and of every tick
    boxes = []
    for label in labels:
        role, owner, label_id = label.get('data-label-role'), label.get('data-owner'), label.get('id')
        match, inner = TRANSLATE.fullmatch(label.get('transform') or ''), label.find(NS + 'svg')
        if not match or inner is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(label_id)); continue
        box = (float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height'))
        boxes.append((label_id, box))
        centre = box[0] + box[2] / 2
        row_n = label.get('data-row')
        axis = by_id.get('r%s-axis' % row_n) if row_n else None
        axis_y = _num(axis, 'y1') if axis is not None else None
        if role in ('note', 'ratio'): continue
        if role == 'variable':
            if label.get('data-tex') != variable: errors.append('NL_VARIABLE_LABEL_MISMATCH:' + str(label_id))
            if axis is not None and box[0] < _num(axis, 'x2'): errors.append('NL_VARIABLE_LABEL_ON_AXIS:' + str(label_id))
            continue
        target = by_id.get(owner)
        if target is None: errors.append('NL_LABEL_OWNER_MISSING:' + str(label_id)); continue
        at = (_num(target, 'x1') + _num(target, 'x2')) / 2 if role == 'set' else _num(target, 'x1') if role == 'tick' else _num(target, 'cx')
        if abs(centre - at) > 0.5: errors.append('NL_LABEL_NOT_CENTRED:' + str(label_id))
        if role in ('endpoint', 'tick', 'point-value') and axis_y is not None and box[1] < axis_y + 1.6: errors.append('NL_LABEL_NOT_BELOW_AXIS:' + str(label_id))
        if role in ('integer', 'point-name') and box[1] + box[3] > _num(target, 'cy') - _num(target, 'r'): errors.append('NL_LABEL_NOT_ABOVE_DOT:' + str(label_id))
        if role == 'set' and axis_y is not None and box[1] + box[3] > axis_y - 8: errors.append('NL_LABEL_NOT_ABOVE_BAND:' + str(label_id))
    for i, (label_id, a) in enumerate(boxes):
        for other_id, b in boxes[i + 1:]:
            if a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]: errors.append('NL_LABEL_OVERLAP:' + label_id + ':' + other_id)
        for circle in circles:
            cx, cy, r = _num(circle, 'cx'), _num(circle, 'cy'), _num(circle, 'r') + 0.8
            dx, dy = max(a[0] - cx, 0, cx - a[0] - a[2]), max(a[1] - cy, 0, cy - a[1] - a[3])
            if math.hypot(dx, dy) <= r: errors.append('NL_LABEL_ON_DOT:' + label_id + ':' + str(circle.get('id')))
        for tick in ticks:
            x, y1, y2 = _num(tick, 'x1'), _num(tick, 'y1'), _num(tick, 'y2')
            if a[0] - 0.6 <= x <= a[0] + a[2] + 0.6 and a[1] <= max(y1, y2) + 0.6 and min(y1, y2) - 0.6 <= a[1] + a[3]: errors.append('NL_LABEL_ON_TICK:' + label_id)
    raw = svg.encode('utf-8')
    observed = [{'kind': row['kind'], 'set': ', '.join(str(piece) for piece in row['pieces']) if 'pieces' in row else {k: str(v) for k, v in row['values'].items()},
                 'integers': None if row.get('integers') is None else [str(k) for k in row['integers']]} for row in rows]
    return {'status': 'FAIL' if errors else 'PASS', 'errors': errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(), 'observed': {'rows': observed}}
