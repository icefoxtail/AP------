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
def parse_tex_number(tex):
    tex = re.sub(r'^\\displaystyle\s*', '', tex)
    tokens = re.findall(r'\\dfrac|\\frac|\\sqrt|\d+|[{}+\-]', tex.replace(' ', ''))
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
            return value
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


def parse_header(tex, variable):
    """'lo\\le v<hi', 'v>lo', 'v=p' ... -> (lower, lowerClosed, upper, upperClosed); None for an infinite side."""
    parts = re.split(r'(\\le|\\ge|<|>|=)', re.sub(r'^\\displaystyle\s*', '', tex).replace(' ', ''))
    rel = {'\\le': ('<', True), '<': ('<', False), '\\ge': ('>', True), '>': ('>', False)}
    if len(parts) == 5 and parts[2] == variable and parts[1] in ('\\le', '<') and parts[3] in ('\\le', '<'):
        return parse_tex_number(parts[0]), rel[parts[1]][1], parse_tex_number(parts[4]), rel[parts[3]][1]
    if len(parts) == 3 and parts[0] == variable:
        if parts[1] == '=':
            value = parse_tex_number(parts[2]); return value, True, value, True
        direction, closed = rel[parts[1]]
        value = parse_tex_number(parts[2])
        return (value, closed, None, False) if direction == '>' else (None, False, value, closed)
    raise ValueError('NL_HEADER_UNREADABLE')


def _num(element, name):
    value = element.get(name)
    try: number = float(value)
    except (TypeError, ValueError): raise ValueError('NL_SVG_ATTRIBUTE_INVALID:' + name) from None
    if not math.isfinite(number): raise ValueError('NL_SVG_ATTRIBUTE_INVALID:' + name)
    return number


def audit(numberLine, svg):
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
