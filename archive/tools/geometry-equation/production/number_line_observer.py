"""Independent number-line observer. Does not import the producer.

Re-solves the plan's quadratic inequality with SymPy (solveset over the reals, the domain interval, the adjoined values), recomputes the integer
points, and checks the final number-line panel SVG: the end dots (place, filled = closed, hollow = open), the solution band, every integer dot,
the 0 tick, and every label (its TeX read back as a number or as the interval, centred on its owner, clear of every dot, tick and other label).
E35: compass constructions (the arc's circle, radius and landing point recomputed from the plan's exact centre and radius) and letter points (no value anywhere; their order,
mirror and between constraints read from the SVG coordinates) are checked the same way.
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET
import sympy as S
from point_names import tex_map

v = S.Symbol('v', real=True)
NS = '{http://www.w3.org/2000/svg}'
TOL = 0.01
SET_COLOR_LINES = {'BLUE': '#1f5fa8', 'WARM': '#b85c00', 'GREEN': '#2e7d32', 'ROSE': '#b8325f', 'VIOLET': '#6b46b3'}
RATIONAL = re.compile(r'^-?\d{1,15}(?:/\d{1,15})?$')
DECIMAL = re.compile(r'^-?\d{1,6}\.\d{1,2}$')


def _rational(text, code):
    if not isinstance(text, str) or not RATIONAL.fullmatch(text): raise ValueError(code)
    value = S.Rational(text)
    return value


SURD = re.compile(r'^[0-9+\-*/() ]*sqrt[0-9+\-*/()sqrt ]{0,60}$')


def _value(text, code):
    """An end value: an exact rational, or an exact surd text such as sqrt(10), -sqrt(10), (1+sqrt(2))/2 (SymPy parses it)."""
    if isinstance(text, str) and RATIONAL.fullmatch(text): return S.Rational(text)
    if isinstance(text, str) and DECIMAL.fullmatch(text): return S.Rational(text)   # G19: a decimal the problem writes (40.2), exactly
    if not isinstance(text, str) or not SURD.fullmatch(text) or len(text) > 64: raise ValueError(code)
    try: value = S.sympify(text, rational=True)
    except Exception: raise ValueError(code)
    if not value.is_real: raise ValueError(code)
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
    tokens = re.findall(r'\\dfrac|\\frac|\\sqrt|\d+\.\d+|\d+|[a-z]|[{}+\-]', tex.replace(' ', ''))
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
        if token is not None and re.fullmatch(r'\d+\.\d+', token):   # a decimal the problem writes (G19)
            return S.Rational(take())
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


def audit(numberLine, svg, pointNames=None):
    if 'rows' in numberLine: return audit_figure(numberLine, svg, pointNames)
    if pointNames: raise ValueError('POINT_DISPLAY_NAME_UNSUPPORTED')
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
    items = []
    owners = {}
    for label in labels:
        role, owner, label_id = label.get('data-label-role'), label.get('data-owner'), label.get('id')
        match = re.fullmatch(r'translate\(([-\d.e]+) ([-\d.e]+)\)', label.get('transform') or '')
        inner = label.find(NS + 'svg')
        if not match or inner is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(label_id)); continue
        box = (float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height'))
        boxes.append((label_id, box))
        items.append((label_id, role, box, label.get('data-tex')))
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
    _run_together(items, errors)
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
# This observer's own copy of the point-style drawing rules (E30): the half-extent of a CROSS stroke pair and the radius of the ring round an emphasised point.
CROSS_HALF_PX = 4.2
RING_RADIUS_PX = 8.0
POINT_STYLES = ('FILLED', 'HOLLOW', 'CROSS', 'TICK')
TICK_MARK_HALF_PX = 7.5          # E35: the TICK style, a short vertical stroke through the axis
# E35 (this observer's own copies): a letter point's id, how far apart (px) the places that a constraint orders must be, how near a hit's name must stand to its dot, and the compass arc rules.
SYMBOL_ID = re.compile('^-?[a-z]$')
SYMBOL_SEPARATION_PX = 10.0
NAME_BESIDE_ARC_PX = 12.0
# N08 (this observer's own copies): the first line of value labels stands 5 px under its dot; a label over its dot is at most LANE_OVER_DOT_MAX_PX above it; a leader starts at the dot's edge and ends at the label's top
LANE_FIRST_LINE_MAX_PX, LANE_OVER_DOT_MAX_PX, LEADER_END_MAX_PX, LANE_SHIFT_MAX_PX = 8.0, 6.0, 2.5, 100.0
# a value leader leaves its dot at least LEADER_MIN_ANGLE_DEG degrees steeper than the axis; the value of an overlapped dot stands outside it (the label's inner edge at most OUTWARD_TOLERANCE_PX past the dot's centre)
LEADER_MIN_ANGLE_DEG, OUTWARD_TOLERANCE_PX, LEADER_MIN_LENGTH_PX = 30.0, 4.0, 6.0
# Run-together labels (this observer's own copies): two labels on one line read as one number or as a subtraction ("-3" "-2" -> "-3-2") when they stand closer than LABEL_GAP_MIN_PX
# (the same meaning as SC_NORMAL_TICK_NUMBERS_CLOSE of the statistics observer, 5 px). The inequalities of neighbouring pieces of a set ("-3<x<-2" "-2<x<9") need more: under PIECE_GAP_MIN_PX they touch,
# under PIECE_SEPARATED_PX the earlier one must end with a comma (it may stand off its band's centre, but still over its band, by at most SET_SHIFT_MAX_PX).
LABEL_GAP_MIN_PX, PIECE_GAP_MIN_PX, PIECE_SEPARATED_PX, SET_SHIFT_MAX_PX, SET_OVER_BAND_INSET_PX = 5.0, 14.0, 30.0, 60.0, 4.0
RUN_TOGETHER_SKIP = ('note', 'ratio', 'row-label', 'span-label', 'source-name', 'variable', 'header')


ROW_LABEL_MATH = re.compile('^[A-Za-z0-9 .,()+−=≤≥-]{1,16}$')   # this observer's own copy: the row label that is set in the math face
HANGUL = re.compile('[가-힣ㄱ-ㅎㅏ-ㅣ]')


def _row_label_is_math(label):
    return isinstance(label, str) and HANGUL.search(label) is None and re.search('[≤≥=]', label) is not None and ROW_LABEL_MATH.fullmatch(label) is not None


def _row_label_tex(label):
    return label.replace('≤', '\\le ').replace('≥', '\\ge ').replace('−', '-')


def _line_gap(a, b):
    """The horizontal gap between two label boxes (x, y, w, h) that stand on one line (their heights overlap), None otherwise; negative when they overlap."""
    if min(a[1] + a[3], b[1] + b[3]) <= max(a[1], b[1]): return None
    return b[0] - (a[0] + a[2]) if b[0] >= a[0] else a[0] - (b[0] + b[2])


def _run_together(items, errors):
    """items: (id, role, box, tex). Every pair on one line keeps its gap; set labels of one row also keep the comma that separates the pieces."""
    for i, (id_a, role_a, box_a, tex_a) in enumerate(items):
        for id_b, role_b, box_b, tex_b in items[i + 1:]:
            if role_a in RUN_TOGETHER_SKIP or role_b in RUN_TOGETHER_SKIP: continue
            gap = _line_gap(box_a, box_b)
            if gap is None or gap < 0: continue            # an overlap has its own error
            if role_a == 'set' and role_b == 'set':
                first, second = (id_a, tex_a, box_a), (id_b, tex_b, box_b)
                if box_b[0] < box_a[0]: first, second = second, first
                if gap < PIECE_GAP_MIN_PX: errors.append('NL_LABELS_RUN_TOGETHER:%s:%s' % (id_a, id_b))
                elif gap < PIECE_SEPARATED_PX and not (first[1] or '').rstrip().endswith(','): errors.append('NL_PIECE_LABELS_NO_SEPARATOR:%s:%s' % (id_a, id_b))
            elif gap < LABEL_GAP_MIN_PX: errors.append('NL_LABELS_RUN_TOGETHER:%s:%s' % (id_a, id_b))


SOURCE_RIGHT_ANGLE_PX = 9.0          # the side of the right angle mark at the foot of a source perpendicular
ARC_PATH = re.compile(r'^M (-?[\d.e]+) (-?[\d.e]+) A (-?[\d.e]+) (-?[\d.e]+) 0 0 ([01]) (-?[\d.e]+) (-?[\d.e]+)$')
ARC_MIN_RISE_PX, ARC_MAX_RISE_PX, ARC_MAX_ANGLE_DEG, ARC_CLEAR_PX, ARC_SAMPLES = 8.0, 80.0, 40.0, 1.2, 48


def _end_value(raw, parameter):
    if raw is None: return None
    if 'value' in raw: return _value(raw['value'], 'NL_OBSERVER_PLAN_INVALID')
    if parameter is None: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    return _rational(raw['param']['mul'], 'NL_OBSERVER_PLAN_INVALID') * parameter + _rational(raw['param'].get('add', '0'), 'NL_OBSERVER_PLAN_INVALID')


JAMO = re.compile('^[\u3131-\u314e]$')
# E34: a point may be named by a Hangul word of 2 to 5 syllables as well (written as plain text above its dot); this observer's own copies of the span rules follow
WORD_NAME = re.compile('^[\uac00-\ud7a3]{2,5}$')
HANGUL = re.compile('[\uac00-\ud7a3]')
SPAN_LABEL_TEXT = re.compile('^[\uac00-\ud7a3][\uac00-\ud7a3 ]{0,8}$')
SPAN_LABEL_MATH = re.compile(r'^[A-Za-z0-9=+\-<>.,()]{1,12}$')
SPAN_STYLES = ('BRACE', 'ARROW', 'DOUBLE_ARROW')
SPAN_HALF_PX, SPAN_HEAD_PX, SPAN_HEAD_HALF_PX, SPAN_MIN_WIDTH_PX = 6.0, 9.0, 3.6, 24.0


def _point_flags(point):
    """What a marked point must show, read from the plan alone: its name (None, a Hangul letter or the capital id) and whether its value is written."""
    hidden = point.get('hideName') is True or ('name' in point and point['name'] is None)
    name = point.get('name')
    if hidden or name is None and not JAMO.fullmatch(point['id']): jamo = None
    else: jamo = name if isinstance(name, str) else point['id']
    if jamo is not None and not (JAMO.fullmatch(jamo) or WORD_NAME.fullmatch(jamo)) and (isinstance(name, str) or JAMO.fullmatch(point['id'])): raise ValueError('NL_OBSERVER_PLAN_INVALID')
    side = point.get('valueSide')
    if side not in (None, 'ABOVE', 'BELOW'): raise ValueError('NL_OBSERVER_PLAN_INVALID')
    return {'name_hidden': hidden, 'jamo': jamo, 'show_value': point.get('showValue') is not False, 'style': point.get('style'), 'value_above': side == 'ABOVE'}


def _check_point_style(element, point_id, style, inside, lines, by_id):
    """The drawing of one marked point in its style (FILLED, HOLLOW, CROSS) and its ring (a point inside a `within` set): read from the dot, its strokes and its ring."""
    errors = []
    fill = (element.get('fill') or '').lower()
    if style == 'FILLED':
        if fill != '#111': errors.append('NL_POINT_NOT_FILLED:' + point_id)
        if element.get('data-point-style') is not None or element.get('data-state') != 'CLOSED': errors.append('NL_POINT_STYLE:' + point_id)
    elif style == 'HOLLOW':
        if fill != '#fff' or element.get('data-point-style') != 'HOLLOW' or element.get('data-state') != 'OPEN': errors.append('NL_POINT_STYLE:' + point_id)
    elif style == 'TICK':
        marks = [l for l in lines if l.get('data-role') == 'tick-mark' and l.get('data-of') == element.get('id')]
        if fill != 'none' or element.get('stroke') != 'none' or element.get('data-point-style') != 'TICK' or element.get('data-state') != 'CLOSED': errors.append('NL_POINT_STYLE:' + point_id)
        cx, cy = _num(element, 'cx'), _num(element, 'cy')
        if len(marks) != 1: errors.append('NL_POINT_TICK_MARK_COUNT:' + point_id)
        for l in marks:
            if abs(_num(l, 'x1') - cx) > TOL or abs(_num(l, 'x2') - cx) > TOL or abs((_num(l, 'y1') + _num(l, 'y2')) / 2 - cy) > TOL or abs(abs(_num(l, 'y2') - _num(l, 'y1')) / 2 - TICK_MARK_HALF_PX) > 0.05: errors.append('NL_POINT_TICK_MARK_GEOMETRY:' + point_id)
    else:
        if fill != 'none' or element.get('stroke') != 'none' or element.get('data-point-style') != 'CROSS': errors.append('NL_POINT_STYLE:' + point_id)
        crosses = [l for l in lines if l.get('data-role') == 'cross' and l.get('data-of') == element.get('id')]
        cx, cy = _num(element, 'cx'), _num(element, 'cy')
        signs = []
        for l in crosses:
            half_x, half_y = (_num(l, 'x2') - _num(l, 'x1')) / 2, (_num(l, 'y2') - _num(l, 'y1')) / 2
            mid_x, mid_y = (_num(l, 'x2') + _num(l, 'x1')) / 2, (_num(l, 'y2') + _num(l, 'y1')) / 2
            if abs(mid_x - cx) > TOL or abs(mid_y - cy) > TOL or abs(abs(half_x) - CROSS_HALF_PX) > 0.05 or abs(abs(half_y) - CROSS_HALF_PX) > 0.05: errors.append('NL_POINT_CROSS_GEOMETRY:' + point_id)
            signs.append(1 if half_x * half_y > 0 else -1)
        if len(crosses) != 2 or sorted(signs) != [-1, 1]: errors.append('NL_POINT_CROSS_STROKES:' + point_id)
    if style != 'CROSS' and any(l.get('data-role') == 'cross' and l.get('data-of') == element.get('id') for l in lines): errors.append('NL_POINT_CROSS_UNEXPECTED:' + point_id)
    if style != 'TICK' and any(l.get('data-role') == 'tick-mark' and l.get('data-of') == element.get('id') for l in lines): errors.append('NL_POINT_TICK_MARK_UNEXPECTED:' + point_id)
    ring = by_id.get(element.get('id', '') + '-ring')
    if inside:
        if ring is None or ring.get('data-dot') != 'ring' or ring.get('data-of') != element.get('id') or (ring.get('fill') or '').lower() != 'none' \
                or abs(_num(ring, 'cx') - _num(element, 'cx')) > TOL or abs(_num(ring, 'cy') - _num(element, 'cy')) > TOL or abs(_num(ring, 'r') - RING_RADIUS_PX) > 0.05: errors.append('NL_POINT_RING:' + point_id)
    elif ring is not None: errors.append('NL_POINT_RING_UNEXPECTED:' + point_id)
    return errors


def _label_box(label):
    """The box a typeset label occupies (translate + its inner svg size), or None when unreadable."""
    inner, match = label.find(NS + 'svg'), TRANSLATE.fullmatch(label.get('transform') or '')
    if inner is None or not match: return None
    return float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height')


def _span_plan(row_spec, values):
    """The spans a POINTS row asks for, read from the plan alone: [{from,to,style,side,label,kind}] (an invalid plan is the observer's error, not a figure's)."""
    raw = row_spec.get('spans')
    if raw is None: return None
    if not isinstance(raw, list) or not 1 <= len(raw) <= 6: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    out, seen = [], set()
    for item in raw:
        if not isinstance(item, dict) or set(item) - {'from', 'to', 'label', 'style', 'side'}: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        a, b = item.get('from'), item.get('to')
        if a not in values or b not in values or a == b or frozenset((a, b)) in seen: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        seen.add(frozenset((a, b)))
        style = item.get('style', 'BRACE')
        if style not in SPAN_STYLES: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        side = item.get('side', 'BELOW' if style == 'BRACE' else 'ABOVE')
        if side not in ('ABOVE', 'BELOW'): raise ValueError('NL_OBSERVER_PLAN_INVALID')
        label = item.get('label')
        kind = None
        if label is not None:
            if not isinstance(label, str) or label != label.strip(): raise ValueError('NL_OBSERVER_PLAN_INVALID')
            if HANGUL.search(label):
                if not SPAN_LABEL_TEXT.fullmatch(label) or '  ' in label: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                kind = 'TEXT'
            else:
                if not SPAN_LABEL_MATH.fullmatch(label): raise ValueError('NL_OBSERVER_PLAN_INVALID')
                kind = 'MATH'
        out.append({'from': a, 'to': b, 'style': style, 'side': side, 'label': label, 'kind': kind})
    return out


def _check_spans(index, spans, values, px, axis_y, root, by_id, owners, label_boxes):
    """Every span of row `index`: the brace or arrow recomputed from the plan's two end values, on the plan's side of the axis, with its label centred on the outer side
    and nothing else (label, dot, another span) touching it."""
    errors = []
    tag_of = {'BRACE': 'span-brace', 'ARROW': 'span-arrow', 'DOUBLE_ARROW': 'span-arrow'}
    drawn = [e for e in root.iter() if e.get('data-row') == str(index) and e.get('data-role') in ('span-brace', 'span-arrow')]
    if len(drawn) != len(spans): errors.append('NL_SPAN_COUNT:%d' % index)
    boxes = []
    for k, span in enumerate(spans, start=1):
        sid = 'r%d-span-%d' % (index, k)
        element = by_id.get(sid)
        if element is None: errors.append('NL_SPAN_MISSING:' + sid); continue
        if element.get('data-role') != tag_of[span['style']] or element.get('data-span-style') != span['style'] or element.get('data-from') != span['from'] or element.get('data-to') != span['to'] or element.get('data-side') != span['side']:
            errors.append('NL_SPAN_ATTRIBUTES:' + sid); continue
        xa, xb = px(values[span['from']]), px(values[span['to']])
        if abs(xb - xa) < SPAN_MIN_WIDTH_PX: errors.append('NL_SPAN_TOO_SHORT:' + sid)
        direction = 1 if span['side'] == 'BELOW' else -1
        points, shape = [], None
        if span['style'] == 'BRACE':
            if element.tag != NS + 'path': errors.append('NL_SPAN_SHAPE:' + sid); continue
            tokens = re.findall(r'[MLQ]|-?\d+(?:\.\d+)?(?:e-?\d+)?', element.get('d') or '')
            # M x y, Q c c a a, L x y, Q c c a a, Q c c a a, L x y, Q c c a a: the anchors are the pairs after M, the second pair of each Q and each L
            commands, current = [], None
            for t in tokens:
                if t in ('M', 'L', 'Q'): current = [t, []]; commands.append(current)
                elif current is not None: current[1].append(float(t))
            if [c[0] for c in commands] != list('MQLQQLQ') or [len(c[1]) for c in commands] != [2, 4, 2, 4, 4, 2, 4]: errors.append('NL_SPAN_SHAPE:' + sid); continue
            anchors = [(c[1][0], c[1][1]) if c[0] in 'ML' else (c[1][2], c[1][3]) for c in commands]
            lo, hi = min(xa, xb), max(xa, xb)
            y0 = anchors[0][1]
            h = SPAN_HALF_PX
            want = [(lo, y0), (lo + h, y0 + direction * h), (( lo + hi) / 2 - h, y0 + direction * h), ((lo + hi) / 2, y0 + direction * 2 * h), ((lo + hi) / 2 + h, y0 + direction * h), (hi - h, y0 + direction * h), (hi, y0)]
            if any(abs(a[0] - w[0]) > TOL or abs(a[1] - w[1]) > TOL for a, w in zip(anchors, want)): errors.append('NL_SPAN_SHAPE:' + sid); continue
            ys = [y0, y0 + direction * 2 * h]
            points = [(lo, min(ys)), (hi, max(ys))]
            shape = (lo, min(ys), hi, max(ys))
        else:
            if element.tag != NS + 'line': errors.append('NL_SPAN_SHAPE:' + sid); continue
            y = _num(element, 'y1')
            sign = 1 if xb > xa else -1
            double = span['style'] == 'DOUBLE_ARROW'
            if abs(_num(element, 'y2') - y) > TOL: errors.append('NL_SPAN_SHAPE:' + sid); continue
            x1, x2 = _num(element, 'x1'), _num(element, 'x2')
            want1, want2 = (xa + sign * SPAN_HEAD_PX if double else xa), xb - sign * SPAN_HEAD_PX
            if abs(x1 - want1) > TOL or abs(x2 - want2) > TOL: errors.append('NL_SPAN_ENDS:' + sid)
            heads = [e for e in root.iter(NS + 'polygon') if e.get('data-role') == 'span-head' and e.get('data-of') == sid]
            tips = [(xb, sign)] + ([(xa, -sign)] if double else [])
            if len(heads) != len(tips): errors.append('NL_SPAN_HEAD_COUNT:' + sid)
            for head, (tip, dx) in zip(sorted(heads, key=lambda e: e.get('id') or ''), tips):
                try: pts = [tuple(float(v) for v in pair.split(',')) for pair in head.get('points').split()]
                except Exception: errors.append('NL_SPAN_HEAD:' + sid); continue
                if len(pts) != 3 or abs(pts[0][0] - tip) > TOL or abs(pts[0][1] - y) > TOL or any(abs(q[0] - (tip - dx * SPAN_HEAD_PX)) > TOL for q in pts[1:]) or sorted(round(q[1] - y, 2) for q in pts[1:]) != [-SPAN_HEAD_HALF_PX, SPAN_HEAD_HALF_PX]:
                    errors.append('NL_SPAN_HEAD:' + sid)
            shape = (min(xa, xb), y - SPAN_HEAD_HALF_PX, max(xa, xb), y + SPAN_HEAD_HALF_PX)
        if shape is None: continue
        # on the plan's side of the axis, clear of the dots
        if direction > 0 and shape[1] <= axis_y + 8 or direction < 0 and shape[3] >= axis_y - 8: errors.append('NL_SPAN_WRONG_SIDE:' + sid)
        boxes.append((sid, shape))
        # its label
        mine = [l for l in owners.get(sid, []) if l.get('data-label-role') == 'span-label']
        if span['label'] is None:
            if mine: errors.append('NL_SPAN_LABEL_UNEXPECTED:' + sid)
        elif len(mine) != 1: errors.append('NL_SPAN_LABEL_COUNT:' + sid)
        else:
            label = mine[0]
            text_ok = label.get('data-text') == span['label'] and label.get('data-tex') is None if span['kind'] == 'TEXT' else label.get('data-tex') == span['label'] and label.get('data-text') is None
            if not text_ok or label.get('data-span') != span['from'] + ',' + span['to']: errors.append('NL_SPAN_LABEL_TEXT:' + sid)
            box = _label_box(label)
            if box is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(label.get('id')))
            else:
                if abs(box[0] + box[2] / 2 - (xa + xb) / 2) > 0.5: errors.append('NL_SPAN_LABEL_NOT_CENTRED:' + sid)
                if direction > 0 and box[1] < shape[3] + 0.5 or direction < 0 and box[1] + box[3] > shape[1] - 0.5: errors.append('NL_SPAN_LABEL_NOT_OUTSIDE:' + sid)
    # nothing else touches a span: no other label, no dot of the row, no other span
    for sid, shape in boxes:
        grown = (shape[0] - 1, shape[1] - 1, shape[2] + 1, shape[3] + 1)
        for label_id, box in label_boxes:
            if label_id == sid + '-label': continue
            if grown[0] < box[0] + box[2] and box[0] < grown[2] and grown[1] < box[1] + box[3] and box[1] < grown[3]: errors.append('NL_SPAN_OVERLAPS_LABEL:%s:%s' % (sid, label_id))
        for circle in root.iter(NS + 'circle'):
            if circle.get('data-row') != str(index): continue
            cx, cy, r = _num(circle, 'cx'), _num(circle, 'cy'), _num(circle, 'r') + 0.8
            if grown[0] < cx + r and cx - r < grown[2] and grown[1] < cy + r and cy - r < grown[3]: errors.append('NL_SPAN_ON_DOT:%s:%s' % (sid, circle.get('id')))
    for i, (sid, a) in enumerate(boxes):
        for other, b in boxes[i + 1:]:
            if a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]: errors.append('NL_SPAN_OVERLAP:%s:%s' % (sid, other))
    return errors


def _construction_plans(numberLine, rows):
    """The compass constructions the plan asks for, per 1-based row number: [{id, center, radius (exact), hits:[(id, branch)]}] (an invalid plan is the observer's error, not a figure's)."""
    raw = numberLine.get('constructions')
    if raw is None: return {}
    if not isinstance(raw, list) or not 1 <= len(raw) <= 4: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    point_rows = [i for i, row in enumerate(rows, start=1) if row['kind'] == 'POINTS']
    out = {}
    for item in raw:
        if not isinstance(item, dict) or set(item) - {'id', 'row', 'center', 'radius', 'arc', 'hits', 'source'}: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        row = item.get('row')
        if row is None:
            if len(point_rows) != 1: raise ValueError('NL_OBSERVER_PLAN_INVALID')
            row = point_rows[0]
        source = item.get('source')
        if isinstance(source, dict) and 'perpendicular' in source:
            # a chained construction: a perpendicular of an exact height raised at the point `at`; the hypotenuse is the radius
            q = source['perpendicular']
            if set(source) != {'perpendicular'} or not isinstance(q, dict) or set(q) - {'at', 'height', 'toName'} or not isinstance(q.get('at'), str): raise ValueError('NL_OBSERVER_PLAN_INVALID')
            height = _value(q.get('height'), 'NL_OBSERVER_PLAN_INVALID')
            if not height > 0 or q.get('toName') is not None and not (isinstance(q['toName'], str) and re.fullmatch('[A-Z]', q['toName'])): raise ValueError('NL_OBSERVER_PLAN_INVALID')
            source = {'kind': 'PERPENDICULAR', 'at': q['at'], 'height': height, 'toName': q.get('toName')}
        elif source is not None:
            if not isinstance(source, dict) or set(source) - {'grid', 'from', 'to', 'toName'} or source.get('grid') is not True: raise ValueError('NL_OBSERVER_PLAN_INVALID')
            def cell(pair):
                if not isinstance(pair, list) or len(pair) != 2: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                out = []
                for entry in pair:
                    if isinstance(entry, str) and re.fullmatch(r'-?\d{1,2}', entry): entry = int(entry)
                    if isinstance(entry, bool) or not isinstance(entry, int): raise ValueError('NL_OBSERVER_PLAN_INVALID')
                    out.append(entry)
                return tuple(out)
            source = {'kind': 'GRID', 'from': cell(source.get('from')), 'to': cell(source.get('to')), 'toName': source.get('toName')}
            if source['toName'] is not None and not (isinstance(source['toName'], str) and re.fullmatch('[A-Z]', source['toName'])): raise ValueError('NL_OBSERVER_PLAN_INVALID')
        if row not in point_rows or not isinstance(item.get('radius'), dict) or not isinstance(item.get('arc'), dict) or not isinstance(item.get('hits'), list): raise ValueError('NL_OBSERVER_PLAN_INVALID')
        radius = _value(item['radius'].get('value'), 'NL_OBSERVER_PLAN_INVALID')
        side = item['arc'].get('side')
        if not radius > 0 or side not in ('LEFT', 'RIGHT', 'BOTH'): raise ValueError('NL_OBSERVER_PLAN_INVALID')
        hits = [(hit.get('id'), hit.get('branch')) for hit in item['hits'] if isinstance(hit, dict)]
        want = ['LEFT', 'RIGHT'] if side == 'BOTH' else [side]
        if len(hits) != len(item['hits']) or sorted(branch for _, branch in hits) != sorted(want) or not isinstance(item.get('center'), str) or not isinstance(item.get('id'), str):
            raise ValueError('NL_OBSERVER_PLAN_INVALID')
        out.setdefault(row, []).append({'id': item['id'], 'center': item['center'], 'radius': radius, 'hits': hits, 'source': source})
    return out


def _source_end(plan, values):
    """Where a construction's source segment ends, from the plan alone: (its place on the line in units, its height over the line in units, +1 or -1: the side of the centre it is on)."""
    source = plan['source']
    if source['kind'] == 'GRID': return source['to'][0], source['to'][1], 1 if source['to'][0] >= source['from'][0] else -1
    if source['at'] not in values or plan['center'] not in values: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    return values[source['at']], source['height'], 1 if values[source['at']] >= values[plan['center']] else -1


def _check_constructions(index, plans, values, px, unit_scale, axis_y, root, by_id, circles, label_boxes, owners):
    """Every compass arc of row `index`, recomputed from the plan: the circle round the centre point with the exact radius, landing on the hit (centre +- radius, exactly), drawn over the
    line, short of a quarter turn, with the centre's side of the sweep right; clear of every label and of every dot but its own hit."""
    errors = []
    drawn = [e for e in root.iter(NS + 'path') if e.get('data-role') == 'construction-arc' and e.get('data-row') == str(index)]
    wanted = [(plan, hit_id, branch) for plan in plans for hit_id, branch in plan['hits']]
    if len(drawn) != len(wanted): errors.append('NL_CONSTRUCTION_ARC_COUNT:%d' % index)
    # sources: exactly those the plan asks for (a grid: its segment and lattice lines; a perpendicular: the perpendicular, the hypotenuse and the right angle mark)
    grids = {plan['id'] for plan in plans if plan['source'] is not None and plan['source']['kind'] == 'GRID'}
    perps = [plan for plan in plans if plan['source'] is not None and plan['source']['kind'] == 'PERPENDICULAR']
    in_row = lambda e: e.get('data-row') == str(index)
    count = lambda role: sum(1 for e in root.iter() if e.get('data-role') == role and in_row(e))
    if count('source-segment') != len(grids) or count('source-perpendicular') != len(perps) or count('source-hypotenuse') != len(perps) or count('source-right-angle') != len(perps) \
            or any(e.get('data-role') == 'grid-line' and in_row(e) and e.get('data-construction') not in grids for e in root.iter(NS + 'line')):
        errors.append('NL_CONSTRUCTION_SOURCE_COUNT:%d' % index)
    for plan in plans:
        if plan['source'] is not None and plan['center'] in values: errors.extend(_check_source(index, plan, values, px, unit_scale, axis_y, root, by_id, label_boxes, owners))
    for plan, hit_id, branch in wanted:
        aid = 'r%d-con-%s-%s' % (index, plan['id'], branch.lower())
        element = by_id.get(aid)
        if element is None: errors.append('NL_CONSTRUCTION_ARC_MISSING:' + aid); continue
        if plan['center'] not in values or hit_id not in values: raise ValueError('NL_OBSERVER_PLAN_INVALID')
        centre_value, radius = values[plan['center']], plan['radius']
        # the hit is exactly centre +- radius (SymPy), whatever the engine thinks
        if S.simplify(values[hit_id] - (centre_value + radius if branch == 'RIGHT' else centre_value - radius)) != 0: errors.append('NL_CONSTRUCTION_HIT_VALUE:' + aid)
        if (element.get('data-construction'), element.get('data-center'), element.get('data-hit'), element.get('data-branch')) != (plan['id'], plan['center'], hit_id, branch): errors.append('NL_CONSTRUCTION_ARC_ATTRIBUTES:' + aid)
        try:
            if S.simplify(_value(element.get('data-radius'), 'NL_CONSTRUCTION_ARC_RADIUS_TEXT') - radius) != 0: errors.append('NL_CONSTRUCTION_ARC_RADIUS_TEXT:' + aid)
        except ValueError: errors.append('NL_CONSTRUCTION_ARC_RADIUS_TEXT:' + aid)
        match = ARC_PATH.fullmatch(element.get('d') or '')
        if not match: errors.append('NL_CONSTRUCTION_ARC_SHAPE:' + aid); continue
        x0, y0, rx, ry, sweep, x1, y1 = (float(g) for g in match.groups())
        cx, cy, R = px(centre_value), axis_y, float(radius) * unit_scale
        direction = 1 if branch == 'RIGHT' else -1
        if abs(rx - R) > TOL or abs(ry - R) > TOL: errors.append('NL_CONSTRUCTION_ARC_RADIUS:' + aid)
        if abs(math.hypot(x0 - cx, y0 - cy) - R) > TOL or abs(math.hypot(x1 - cx, y1 - cy) - R) > TOL: errors.append('NL_CONSTRUCTION_ARC_CENTER:' + aid)
        hit_dot = next((c for c in circles if c.get('data-row') == str(index) and c.get('data-point-id') == hit_id and c.get('data-dot') == 'point'), None)
        # it starts at the hit's place (from the plan) and on the dot that is drawn for the hit
        if abs(x0 - px(values[hit_id])) > TOL or abs(y0 - axis_y) > TOL or hit_dot is None or abs(x0 - _num(hit_dot, 'cx')) > TOL or abs(y0 - _num(hit_dot, 'cy')) > TOL: errors.append('NL_CONSTRUCTION_ARC_NOT_AT_HIT:' + aid)
        rise = axis_y - y1
        angle = math.degrees(math.atan2(rise, direction * (x1 - cx)))
        source = plan['source']
        # on the side of its source segment's end the arc runs from its hit exactly to that end; otherwise it only rises a little over the line
        end_x, end_rise, end_side = _source_end(plan, values) if source is not None else (None, None, 0)
        connected = source is not None and direction == end_side
        if connected:
            if abs(x1 - px(end_x)) > TOL or abs(y1 - (axis_y - float(end_rise) * unit_scale)) > TOL: errors.append('NL_CONSTRUCTION_ARC_NOT_AT_SOURCE:' + aid)
            max_rise, max_angle = float(end_rise) * unit_scale + TOL, 90.0 + 1e-6
        else: max_rise, max_angle = ARC_MAX_RISE_PX, ARC_MAX_ANGLE_DEG
        if not ARC_MIN_RISE_PX <= rise <= max_rise or not 0 < angle <= max_angle: errors.append('NL_CONSTRUCTION_ARC_EXTENT:' + aid)
        cross = (x0 - cx) * (y1 - cy) - (y0 - cy) * (x1 - cx)
        if int(sweep) != (1 if cross > 0 else 0) or match.group(5) not in ('0', '1'): errors.append('NL_CONSTRUCTION_ARC_SWEEP:' + aid)
        # clear of every label (box grown a little) and of every dot but its own hit
        points = [(cx + direction * R * math.cos(math.radians(angle) * k / ARC_SAMPLES), cy - R * math.sin(math.radians(angle) * k / ARC_SAMPLES)) for k in range(ARC_SAMPLES + 1)]
        for label_id, b in label_boxes:
            if any(b[0] - ARC_CLEAR_PX < x < b[0] + b[2] + ARC_CLEAR_PX and b[1] - ARC_CLEAR_PX < y < b[1] + b[3] + ARC_CLEAR_PX for x, y in points): errors.append('NL_CONSTRUCTION_ARC_ON_LABEL:%s:%s' % (aid, label_id))
        for circle in circles:
            if circle.get('data-row') != str(index) or circle.get('data-point-id') == hit_id: continue
            dx, dy, r = _num(circle, 'cx'), _num(circle, 'cy'), _num(circle, 'r') + 0.6
            if any(math.hypot(x - dx, y - dy) <= r for x, y in points): errors.append('NL_CONSTRUCTION_ARC_ON_DOT:%s:%s' % (aid, circle.get('id')))
    return errors


def _check_source(index, plan, values, px, unit_scale, axis_y, root, by_id, label_boxes, owners):
    """The source grid of one construction, recomputed from the plan: the segment from the centre (on the line) to its end, with length sqrt(dx^2+dy^2) equal to the radius exactly, on a lattice of
    unit cells (one cell is one unit of the line) that covers exactly the segment's box; no lattice line or segment runs through a label; the end's name (if the plan gives one) stands beside it."""
    errors = []
    if plan['source']['kind'] == 'PERPENDICULAR': return _check_perpendicular(index, plan, values, px, unit_scale, axis_y, root, by_id, label_boxes, owners)
    source, cid = plan['source'], plan['id']
    (fx, fy), (tx, ty) = source['from'], source['to']
    sid = 'r%d-src-%s' % (index, cid)
    if fy != 0 or S.Integer(fx) != values[plan['center']] or ty < 1: errors.append('NL_CONSTRUCTION_SOURCE_PLAN:' + sid)
    if S.simplify(plan['radius'] ** 2 - S.Integer((tx - fx) ** 2 + ty ** 2)) != 0: errors.append('NL_CONSTRUCTION_SOURCE_LENGTH:' + sid)
    seg = by_id.get(sid)
    if seg is None or seg.tag != NS + 'line' or seg.get('data-role') != 'source-segment': errors.append('NL_CONSTRUCTION_SOURCE_MISSING:' + sid); return errors
    if (seg.get('data-construction'), seg.get('data-from'), seg.get('data-to')) != (cid, '%d,%d' % (fx, fy), '%d,%d' % (tx, ty)): errors.append('NL_CONSTRUCTION_SOURCE_ATTRIBUTES:' + sid)
    got = tuple(_num(seg, name) for name in ('x1', 'y1', 'x2', 'y2'))
    want = (px(fx), axis_y - fy * unit_scale, px(tx), axis_y - ty * unit_scale)
    if any(abs(a - b) > TOL for a, b in zip(got, want)): errors.append('NL_CONSTRUCTION_SOURCE_SEGMENT:' + sid)
    grid = [e for e in root.iter(NS + 'line') if e.get('data-role') == 'grid-line' and e.get('data-row') == str(index) and e.get('data-construction') == cid]
    left, right, top = min(fx, tx), max(fx, tx), axis_y - ty * unit_scale
    verticals, horizontals = [e for e in grid if e.get('data-axis') == 'y'], [e for e in grid if e.get('data-axis') == 'x']
    if len(verticals) != right - left + 1 or len(horizontals) != ty or len(grid) != len(verticals) + len(horizontals): errors.append('NL_CONSTRUCTION_SOURCE_GRID_COUNT:' + sid)
    for k in range(left, right + 1):
        x = px(k)
        if not any(abs(_num(e, 'x1') - x) <= TOL and abs(_num(e, 'x2') - x) <= TOL and abs(_num(e, 'y1') - axis_y) <= TOL and abs(_num(e, 'y2') - top) <= TOL for e in verticals): errors.append('NL_CONSTRUCTION_SOURCE_GRID_LINE:%s:v%d' % (sid, k))
    for j in range(1, ty + 1):
        y = axis_y - j * unit_scale
        if not any(abs(_num(e, 'y1') - y) <= TOL and abs(_num(e, 'y2') - y) <= TOL and abs(_num(e, 'x1') - px(left)) <= TOL and abs(_num(e, 'x2') - px(right)) <= TOL for e in horizontals): errors.append('NL_CONSTRUCTION_SOURCE_GRID_LINE:%s:h%d' % (sid, j))
    lines = [tuple(_num(e, name) for name in ('x1', 'y1', 'x2', 'y2')) for e in grid] + [got]
    for label_id, b in label_boxes:
        for x1, y1, x2, y2 in lines:
            steps = max(2, int(math.hypot(x2 - x1, y2 - y1) / 2) + 1)
            if any(b[0] - ARC_CLEAR_PX < x1 + (x2 - x1) * k / steps < b[0] + b[2] + ARC_CLEAR_PX and b[1] - ARC_CLEAR_PX < y1 + (y2 - y1) * k / steps < b[1] + b[3] + ARC_CLEAR_PX for k in range(steps + 1)):
                errors.append('NL_CONSTRUCTION_SOURCE_ON_LABEL:%s:%s' % (sid, label_id)); break
    names = [l for l in owners.get(sid, []) if l.get('data-label-role') == 'source-name']
    if source['toName'] is None:
        if names: errors.append('NL_CONSTRUCTION_SOURCE_NAME_UNEXPECTED:' + sid)
    elif len(names) != 1 or names[0].get('data-tex') != source['toName'] or names[0].get('data-text') is not None: errors.append('NL_CONSTRUCTION_SOURCE_NAME:' + sid)
    else:
        box = _label_box(names[0])
        if box is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(names[0].get('id')))
        else:
            end_x = px(tx)
            beside = box[0] >= end_x - TOL and box[0] - end_x <= NAME_BESIDE_ARC_PX if tx >= fx else box[0] + box[2] <= end_x + TOL and end_x - (box[0] + box[2]) <= NAME_BESIDE_ARC_PX
            if not beside or box[1] + box[3] > top + TOL: errors.append('NL_CONSTRUCTION_SOURCE_NAME_PLACE:' + sid)
    return errors


def _check_perpendicular(index, plan, values, px, unit_scale, axis_y, root, by_id, label_boxes, owners):
    """The perpendicular source of a chained construction, recomputed from the plan: a perpendicular of the exact height raised on the line at the point `at`, the hypotenuse from the centre to its tip,
    the right angle mark at the foot; |at - centre|^2 + height^2 must be the radius squared exactly; no line runs through a label; the tip's name (if the plan gives one) stands beside the tip."""
    errors = []
    source, cid = plan['source'], plan['id']
    sid = 'r%d-src-%s' % (index, cid)
    at, centre = source['at'], plan['center']
    if at not in values or at == centre or source['height'] <= 0: errors.append('NL_CONSTRUCTION_SOURCE_PLAN:' + sid); return errors
    height, leg = source['height'], values[at] - values[centre]
    if S.simplify(plan['radius'] ** 2 - (leg ** 2 + height ** 2)) != 0: errors.append('NL_CONSTRUCTION_SOURCE_LENGTH:' + sid)
    perp, hyp, mark = by_id.get(sid + '-perp'), by_id.get(sid + '-hyp'), by_id.get(sid + '-right')
    if perp is None or hyp is None or mark is None or perp.get('data-role') != 'source-perpendicular' or hyp.get('data-role') != 'source-hypotenuse' or mark.get('data-role') != 'source-right-angle':
        errors.append('NL_CONSTRUCTION_SOURCE_MISSING:' + sid); return errors
    for element in (perp, hyp, mark):
        if element.get('data-construction') != cid or element.get('data-row') != str(index) or element.get('data-at') not in (None, at) or (element is not mark and element.get('data-at') != at): errors.append('NL_CONSTRUCTION_SOURCE_ATTRIBUTES:' + sid)
    try:
        if S.simplify(_value(perp.get('data-height'), 'NL_CONSTRUCTION_SOURCE_ATTRIBUTES') - height) != 0: errors.append('NL_CONSTRUCTION_SOURCE_ATTRIBUTES:' + sid)
    except ValueError: errors.append('NL_CONSTRUCTION_SOURCE_ATTRIBUTES:' + sid)
    foot_x, centre_x, tip_y = px(values[at]), px(values[centre]), axis_y - float(height) * unit_scale
    got_perp = tuple(_num(perp, name) for name in ('x1', 'y1', 'x2', 'y2'))
    got_hyp = tuple(_num(hyp, name) for name in ('x1', 'y1', 'x2', 'y2'))
    if any(abs(a - b) > TOL for a, b in zip(got_perp, (foot_x, axis_y, foot_x, tip_y))) or any(abs(a - b) > TOL for a, b in zip(got_hyp, (centre_x, axis_y, foot_x, tip_y))): errors.append('NL_CONSTRUCTION_SOURCE_SEGMENT:' + sid)
    # the right angle mark: a small square corner between the perpendicular and the line, on the centre's side of the foot
    sign = 1 if values[at] > values[centre] else -1
    nums = re.findall(r'-?\d+(?:\.\d+)?(?:e-?\d+)?', mark.get('d') or '')
    commands = re.findall(r'[ML]', mark.get('d') or '')
    corner = [(foot_x - sign * SOURCE_RIGHT_ANGLE_PX, axis_y), (foot_x - sign * SOURCE_RIGHT_ANGLE_PX, axis_y - SOURCE_RIGHT_ANGLE_PX), (foot_x, axis_y - SOURCE_RIGHT_ANGLE_PX)]
    if commands != ['M', 'L', 'L'] or len(nums) != 6 or any(abs(float(nums[2 * k]) - corner[k][0]) > TOL or abs(float(nums[2 * k + 1]) - corner[k][1]) > TOL for k in range(3)): errors.append('NL_CONSTRUCTION_SOURCE_RIGHT_ANGLE:' + sid)
    lines = [got_perp, got_hyp, (corner[0][0], corner[0][1], corner[1][0], corner[1][1]), (corner[1][0], corner[1][1], corner[2][0], corner[2][1])]
    for label_id, b in label_boxes:
        for x1, y1, x2, y2 in lines:
            steps = max(2, int(math.hypot(x2 - x1, y2 - y1) / 2) + 1)
            if any(b[0] - ARC_CLEAR_PX < x1 + (x2 - x1) * k / steps < b[0] + b[2] + ARC_CLEAR_PX and b[1] - ARC_CLEAR_PX < y1 + (y2 - y1) * k / steps < b[1] + b[3] + ARC_CLEAR_PX for k in range(steps + 1)):
                errors.append('NL_CONSTRUCTION_SOURCE_ON_LABEL:%s:%s' % (sid, label_id)); break
    names = [l for l in owners.get(sid + '-hyp', []) if l.get('data-label-role') == 'source-name']
    if source['toName'] is None:
        if names: errors.append('NL_CONSTRUCTION_SOURCE_NAME_UNEXPECTED:' + sid)
    elif len(names) != 1 or names[0].get('data-tex') != source['toName'] or names[0].get('data-text') is not None: errors.append('NL_CONSTRUCTION_SOURCE_NAME:' + sid)
    else:
        box = _label_box(names[0])
        if box is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(names[0].get('id')))
        else:
            beside = box[0] >= foot_x - TOL and box[0] - foot_x <= NAME_BESIDE_ARC_PX if values[at] >= values[centre] else box[0] + box[2] <= foot_x + TOL and foot_x - (box[0] + box[2]) <= NAME_BESIDE_ARC_PX
            if not beside or box[1] + box[3] > tip_y + TOL: errors.append('NL_CONSTRUCTION_SOURCE_NAME_PLACE:' + sid)
    return errors


def _scale_of(row_spec, values):
    """The graduated axis a POINTS row asks for: ({integer: label...}, {minor value: parts}) re-derived from its subdivisions, or None."""
    subdivisions = row_spec.get('subdivisions')
    if subdivisions is None: return None
    if not isinstance(subdivisions, list) or not subdivisions: raise ValueError('NL_OBSERVER_PLAN_INVALID')
    ranges = []
    for item in subdivisions:
        a, b, parts = item.get('from'), item.get('to'), item.get('parts')
        if isinstance(parts, str): parts = int(parts)
        if not (isinstance(a, str) and isinstance(b, str) and re.fullmatch(r'-?\d{1,4}', a) and re.fullmatch(r'-?\d{1,4}', b) and isinstance(parts, int) and 2 <= parts <= 10 and int(a) < int(b)):
            raise ValueError('NL_OBSERVER_PLAN_INVALID')
        ranges.append((int(a), int(b), parts))
    low = min([int(S.floor(value)) for value in values] + [r[0] for r in ranges])
    high = max([int(S.ceiling(value)) for value in values] + [r[1] for r in ranges])
    minor = {}
    for a, b, parts in ranges:
        for k in range(a, b):
            for j in range(1, parts):
                minor[S.Rational(k * parts + j, parts)] = parts
    return list(range(low, high + 1)), minor


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
        if 'color' in row and (kind != 'SET' or not isinstance(row['color'], str) or row['color'] not in SET_COLOR_LINES):
            raise ValueError('NL_OBSERVER_SET_COLOR_INVALID')
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
            values = {point['id']: _value(point['value'], 'NL_OBSERVER_PLAN_INVALID') for point in row['points'] if 'value' in point}
            for point in row['points']:
                if 'divides' in point:
                    m, n = (S.Integer(part) for part in point['divides']['ratio'])
                    values[point['id']] = (n * values[point['divides']['from']] + m * values[point['divides']['to']]) / (m + n)
            rows.append({'kind': kind, 'values': values, 'symbols': [point for point in row['points'] if 'value' not in point and 'divides' not in point], 'spec': row})
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


def audit_figure(numberLine, svg, pointNames=None):
    errors = []
    parameter_spec, parameter, rows = expected_figure(numberLine)
    # The name each point must show (its display name's TeX; the id itself without one), read from the plan alone.
    name_tex = tex_map(pointNames, [point['id'] for row in numberLine['rows'] if row['kind'] == 'POINTS' for point in row['points'] if re.fullmatch('[A-Z]', point['id'])])
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
    ticks = [element for element in lines if element.get('data-role') in ('tick', 'subtick')]
    labels = [element for element in root.iter(NS + 'g') if element.get('data-label-role')]
    owners = {}
    for label in labels: owners.setdefault(label.get('data-owner'), []).append(label)
    if len(rows) != len({element.get('data-row') for element in lines if element.get('data-role') == 'axis'}): errors.append('NL_ROW_COUNT')
    def read(label, symbols=None):
        return parse_tex_number(label.get('data-tex') or '', symbols)
    def at_value(expression): return S.simplify(S.sympify(expression).subs(at_sample))
    # E34: the points whose value the plan writes above the dot (over the name), and every label's box (a span must keep clear of all of them)
    value_above = {(str(i), point['id']) for i, r_ in enumerate(rows, start=1) if r_['kind'] == 'POINTS' for point in r_['spec']['points'] if ('value' in point or 'divides' in point) and _point_flags(point)['value_above']}
    # E35: the compass constructions the plan asks for, per row, and for each hit the sides its arcs rise to (its name must stand on the other side)
    con_plans = _construction_plans(numberLine, rows)
    name_sides = {}
    for index_, plans_ in con_plans.items():
        for plan_ in plans_:
            for hit_id_, branch_ in plan_['hits']: name_sides.setdefault((str(index_), hit_id_), set()).add(branch_)
            if plan_['source'] is not None: name_sides.setdefault((str(index_), plan_['center']), set()).add('LEFT' if _source_end(plan_, rows[index_ - 1]['values'])[2] > 0 else 'RIGHT')
    unit_scale = (px_right - px_left) / (unit_right - unit_left)
    label_boxes = [(label.get('id'), box) for label, box in ((l, _label_box(l)) for l in labels) if box is not None]
    for index, row in enumerate(rows, start=1):
        axis = by_id.get('r%d-axis' % index)
        if axis is None: errors.append('NL_AXIS_MISSING:%d' % index); continue
        axis_y, axis_x1, axis_x2 = _num(axis, 'y1'), _num(axis, 'x1'), _num(axis, 'x2')
        if abs(_num(axis, 'y2') - axis_y) > TOL or axis_x1 > px_left or axis_x2 < px_right: errors.append('NL_AXIS_DOES_NOT_COVER_MAP:%d' % index)
        in_row = lambda element: element.get('data-row') == str(index)
        row_circles = [element for element in circles if in_row(element)]
        row_labels = [element for element in labels if in_row(element)]
        # the row's own label (E30): a plain Korean word left of the axis, centred on it; none when the plan gives none
        row_label_plan = row['spec'].get('label')
        row_label_nodes = [element for element in row_labels if element.get('data-label-role') == 'row-label']
        if row_label_plan is None:
            if row_label_nodes: errors.append('NL_ROW_LABEL_UNEXPECTED:%d' % index)
        elif len(row_label_nodes) != 1: errors.append('NL_ROW_LABEL_COUNT:%d' % index)
        else:
            node = row_label_nodes[0]
            if _row_label_is_math(row_label_plan):
                # a label that states a relation (no Hangul, with <= >= =) is set in the math face: its TeX is the text with the relation signs written out
                text_ok = node.get('data-text') is None and re.sub(r'^\\displaystyle\s*', '', node.get('data-tex') or '') == _row_label_tex(row_label_plan)
            else: text_ok = node.get('data-text') == row_label_plan and node.get('data-tex') is None
            if not text_ok or node.get('data-owner') != 'r%d-axis' % index: errors.append('NL_ROW_LABEL_TEXT:%d' % index)
            inner, match = node.find(NS + 'svg'), TRANSLATE.fullmatch(node.get('transform') or '')
            if inner is None or not match: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(node.get('id')))
            else:
                left, top, width, height = float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height')
                if left + width > axis_x1 - 4: errors.append('NL_ROW_LABEL_NOT_LEFT_OF_AXIS:%d' % index)
                if abs(top + height / 2 - axis_y) > 2.0: errors.append('NL_ROW_LABEL_NOT_ON_AXIS:%d' % index)
                if left < 0: errors.append('NL_ROW_LABEL_OUTSIDE_FIGURE:%d' % index)
        if len([l for l in row_labels if l.get('data-label-role') == 'variable']) != (0 if numberLine.get('axisVariable') is False else 1): errors.append('NL_VARIABLE_LABEL_COUNT:%d' % index)
        if row['kind'] == 'POINTS':
            values = row['values']
            drawn = {element.get('data-point-id'): element for element in row_circles if element.get('data-dot') == 'point'}
            symbols = row['symbols']
            for point in symbols:
                if not isinstance(point['id'], str) or not SYMBOL_ID.fullmatch(point['id']): raise ValueError('NL_OBSERVER_PLAN_INVALID')
            flags = {point['id']: _point_flags(point) for point in row['spec']['points'] if 'value' in point or 'divides' in point}
            scale = _scale_of(row['spec'], list(values.values()))
            if set(drawn) != set(values) | {point['id'] for point in symbols}: errors.append('NL_POINT_SET_MISMATCH:%d' % index)
            # within: every point is classified against the set of an earlier SET / RESULT row, solved here from the plan (inside: FILLED and ringed, outside: CROSS, unless the plan styles the point)
            within = row['spec'].get('within')
            within_pieces = None
            if within is not None:
                if isinstance(within, bool) or not isinstance(within, int) or not 1 <= within < index or 'pieces' not in rows[within - 1]: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                within_pieces = rows[within - 1]['pieces']
            for point_id, value in values.items():
                element = drawn.get(point_id)
                if element is None: continue
                flag = flags[point_id]
                if abs(_num(element, 'cx') - px(value)) > TOL or abs(_num(element, 'cy') - axis_y) > TOL: errors.append('NL_POINT_POSITION:' + point_id)
                # a plain id (P0, m1) is the plan's handle for a point whose name is not drawn: any other id must be a capital letter or a Hangul consonant letter
                if not (re.fullmatch('[A-Z]', point_id) or JAMO.fullmatch(point_id)) and not (re.fullmatch('[A-Za-z][A-Za-z0-9]{0,5}', point_id) and flag['name_hidden']): errors.append('NL_POINT_ID_NEEDS_HIDDEN_NAME:' + point_id)
                inside = None if within_pieces is None else any(piece.contains(value) == S.true for piece in within_pieces)
                style = flag['style'] if flag['style'] is not None else ('CROSS' if inside is False else 'FILLED')
                if style not in POINT_STYLES: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                errors.extend(_check_point_style(element, point_id, style, inside, lines, by_id))
                text = element.get('data-value', '')
                try: value_ok = S.simplify(_value(text, 'NL_POINT_VALUE') - value) == 0
                except ValueError: value_ok = False
                if not value_ok: errors.append('NL_POINT_VALUE:' + point_id)
                if element.get('data-value-shown') != (None if flag['show_value'] else 'false'): errors.append('NL_POINT_VALUE_FLAG:' + point_id)
                mine = owners.get(element.get('id'), [])
                names = [l for l in mine if l.get('data-label-role') == 'point-name']
                vals = [l for l in mine if l.get('data-label-role') == 'point-value']
                if len(names) != (0 if flag['name_hidden'] else 1) or len(vals) != (1 if flag['show_value'] else 0): errors.append('NL_POINT_LABEL_COUNT:' + point_id)
                # a value the plan hides is written nowhere on its point (only a name may be owned by it)
                if not flag['show_value'] and any(l.get('data-label-role') != 'point-name' for l in mine): errors.append('NL_POINT_VALUE_SHOWN:' + point_id)
                for l in names:
                    if flag['jamo'] is not None:
                        if l.get('data-text') != flag['jamo'] or l.get('data-tex') is not None: errors.append('NL_POINT_NAME_LABEL:' + point_id)
                    elif l.get('data-tex') != name_tex[point_id] or l.get('data-text') is not None: errors.append('NL_POINT_NAME_LABEL:' + point_id)
                for l in vals:
                    try:
                        if read(l) != value: errors.append('NL_POINT_VALUE_LABEL:' + point_id)
                    except ValueError as error: errors.append(str(error) + ':' + str(l.get('id')))
            # E35: letter points. A dot with no value and one label, its name (italic letter, as the plan spells it); its place is read from the SVG and the plan's constraints
            # (between, mirrorOf, the row's order) are checked on those coordinates. Nothing about the place is written: no value label, no data-value.
            px_of = {point_id: _num(element, 'cx') for point_id, element in drawn.items() if point_id in values or any(sp['id'] == point_id for sp in symbols)}
            for point in symbols:
                point_id = point['id']
                element = drawn.get(point_id)
                if element is None: continue
                if abs(_num(element, 'cy') - axis_y) > TOL: errors.append('NL_POINT_POSITION:' + point_id)
                if element.get('data-symbol') != point_id or element.get('data-value') is not None or element.get('data-value-shown') is not None: errors.append('NL_SYMBOL_DOT:' + point_id)
                style = point.get('style') or 'FILLED'
                if style not in POINT_STYLES: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                errors.extend(_check_point_style(element, point_id, style, None, lines, by_id))
                mine = owners.get(element.get('id'), [])
                names = [l for l in mine if l.get('data-label-role') == 'point-symbol']
                if len(names) != 1 or len(mine) != 1: errors.append('NL_SYMBOL_LABEL_COUNT:' + point_id)
                for l in names:
                    if l.get('data-tex') != point_id or l.get('data-text') is not None: errors.append('NL_SYMBOL_LABEL_TEXT:' + point_id)
            def x_of(token):
                if not isinstance(token, str): raise ValueError('NL_OBSERVER_PLAN_INVALID')
                return px_of[token] if token in px_of else px(_value(token, 'NL_OBSERVER_PLAN_INVALID'))
            for point in symbols:
                point_id = point['id']
                if point_id not in px_of: continue
                between = point.get('between')
                if between is not None:
                    if not isinstance(between, list) or len(between) != 2: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                    a, b = sorted(x_of(token) for token in between)
                    if not a + SYMBOL_SEPARATION_PX <= px_of[point_id] <= b - SYMBOL_SEPARATION_PX: errors.append('NL_SYMBOL_BETWEEN:' + point_id)
                mirror = point.get('mirrorOf')
                if mirror is not None:
                    if mirror not in px_of: raise ValueError('NL_OBSERVER_PLAN_INVALID')
                    if abs(px_of[point_id] + px_of[mirror] - 2 * px(0)) > TOL or abs(px_of[point_id] - px(0)) < SYMBOL_SEPARATION_PX: errors.append('NL_SYMBOL_MIRROR:' + point_id)
            order = row['spec'].get('order')
            if order is not None:
                if not isinstance(order, list) or len(order) < 2 or any(token not in px_of for token in order): raise ValueError('NL_OBSERVER_PLAN_INVALID')
                for left_id, right_id in zip(order, order[1:]):
                    if not px_of[left_id] + SYMBOL_SEPARATION_PX <= px_of[right_id]: errors.append('NL_SYMBOL_ORDER:%s:%s' % (left_id, right_id))
            # every point of the row, as a place on the number line (a letter point's place is read back from where it is drawn)
            all_u = {point_id: float(value) for point_id, value in values.items()}
            for point_id, x in px_of.items():
                if point_id not in all_u: all_u[point_id] = unit_left + (x - px_left) / (px_right - px_left) * (unit_right - unit_left)
            # The band spans the outermost points (unless the plan turns it off); each internal division carries its ratio parts over its two sub-segments.
            band = by_id.get('r%d-band-1' % index)
            row_bands = [element for element in lines if element.get('data-role') == 'solution-band' and in_row(element)]
            if row['spec'].get('band') is False or len(row['spec']['points']) == 1:   # one point has no band to draw
                if row_bands: errors.append('NL_BAND_UNEXPECTED:%d' % index)
            elif band is None: errors.append('NL_BAND_MISSING:%d' % index)
            elif abs(_num(band, 'x1') - px(min(all_u.values()))) > TOL or abs(_num(band, 'x2') - px(max(all_u.values()))) > TOL or abs(_num(band, 'y1') - axis_y) > TOL: errors.append('NL_BAND_EXTENT:%d' % index)
            # The graduated axis: a labelled tick at every integer of the range and shorter ticks at the equal parts, nowhere else.
            row_ticks = [element for element in ticks if in_row(element)]
            if scale is None:
                if row_ticks: errors.append('NL_UNEXPECTED_TICK:%d' % index)
            else:
                integers, minor = scale
                majors = [t for t in row_ticks if t.get('data-role') == 'tick' and t.get('data-scale') == 'major']
                subs = [t for t in row_ticks if t.get('data-role') == 'subtick' and t.get('data-scale') == 'minor']
                if len(majors) + len(subs) != len(row_ticks) or len(majors) != len(integers) or {t.get('data-value') for t in majors} != {str(k) for k in integers}: errors.append('NL_SCALE_MAJOR_SET:%d' % index)
                major_half = None
                for tick in majors:
                    text = tick.get('data-value', '')
                    if not re.fullmatch(r'-?\d+', text): continue
                    if abs(_num(tick, 'x1') - px(int(text))) > TOL or abs(_num(tick, 'x2') - px(int(text))) > TOL or abs((_num(tick, 'y1') + _num(tick, 'y2')) / 2 - axis_y) > TOL: errors.append('NL_SCALE_MAJOR_POSITION:' + str(tick.get('id')))
                    major_half = abs(_num(tick, 'y2') - _num(tick, 'y1')) / 2
                    own = owners.get(tick.get('id'), [])
                    if len(own) != 1 or own[0].get('data-label-role') != 'tick': errors.append('NL_LABEL_COUNT:' + str(tick.get('id'))); continue
                    try:
                        if read(own[0]) != int(text): errors.append('NL_TICK_LABEL_VALUE:' + str(own[0].get('id')))
                    except ValueError as error: errors.append(str(error) + ':' + str(own[0].get('id')))
                seen = {}
                for tick in subs:
                    try: value = S.Rational(tick.get('data-value', ''))
                    except (TypeError, ValueError): errors.append('NL_SCALE_MINOR_VALUE:' + str(tick.get('id'))); continue
                    seen[value] = seen.get(value, 0) + 1
                    if value not in minor or abs(_num(tick, 'x1') - px(value)) > TOL or abs(_num(tick, 'x2') - px(value)) > TOL or abs((_num(tick, 'y1') + _num(tick, 'y2')) / 2 - axis_y) > TOL: errors.append('NL_SCALE_MINOR_POSITION:' + str(tick.get('id')))
                    elif tick.get('data-parts') != str(minor[value]): errors.append('NL_SCALE_MINOR_PARTS:' + str(tick.get('id')))
                    if major_half is not None and not abs(_num(tick, 'y2') - _num(tick, 'y1')) / 2 < major_half - 0.5: errors.append('NL_SCALE_MINOR_NOT_SHORTER:' + str(tick.get('id')))
                    if owners.get(tick.get('id')): errors.append('NL_SCALE_MINOR_LABELLED:' + str(tick.get('id')))
                if set(seen) != set(minor) or any(count != 1 for count in seen.values()): errors.append('NL_SCALE_MINOR_SET:%d' % index)
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
            # spans (E34): a brace or arrow between two points of the row, recomputed from the plan's two end values
            span_plan = _span_plan(row['spec'], all_u)
            if span_plan is None:
                if any(e.get('data-row') == str(index) and e.get('data-role') in ('span-brace', 'span-arrow') for e in root.iter()): errors.append('NL_SPAN_UNEXPECTED:%d' % index)
            else: errors.extend(_check_spans(index, span_plan, all_u, px, axis_y, root, by_id, owners, label_boxes))
            # E35: compass arcs, recomputed from the plan's centre, radius and hits
            errors.extend(_check_constructions(index, con_plans.get(index, []), values, px, unit_scale, axis_y, root, by_id, circles, label_boxes, owners))
            continue
        # SET / RESULT rows
        pieces = row['pieces']
        color = row['spec'].get('color')
        band_stroke = SET_COLOR_LINES[color] if color is not None else '#111'
        if color is not None:
            arrow = by_id.get('r%d-axis-arrow' % index)
            if axis.get('stroke') != '#111' or arrow is None or arrow.get('fill') != '#111' or arrow.get('stroke') != 'none':
                errors.append('NL_AXIS_COLOR:%d' % index)
            for tick in (element for element in ticks if in_row(element)):
                if tick.get('stroke') != '#111':
                    errors.append('NL_TICK_COLOR:' + tick.get('id'))
        bands = sorted([element for element in lines if element.get('data-role') == 'solution-band' and in_row(element)], key=lambda element: int(element.get('data-piece', 0)))
        if len(bands) != len(pieces): errors.append('NL_BAND_COUNT:%d' % index)
        expected_ends = {}
        for k, (piece, band) in enumerate(zip(pieces, bands), start=1):
            if band.get('stroke') != band_stroke: errors.append('NL_BAND_COLOR:' + band.get('id'))
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
            hide_set = row['spec'].get('hideSetLabel')
            if hide_set is not None and not isinstance(hide_set, bool): raise ValueError('NL_OBSERVER_PLAN_INVALID')
            if len(mine) != (0 if hide_set else 1): errors.append('NL_SET_LABEL_COUNT:%s' % band.get('id'))
            for l in mine:
                try: lower, lower_closed, upper, upper_closed = parse_header(re.sub(r',\s*$', '', l.get('data-tex') or ''), variable, free)
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
            if fill != (band_stroke if closed else '#fff') or element.get('data-state') != ('CLOSED' if closed else 'OPEN'): errors.append('NL_ENDPOINT_STATE:' + element.get('id'))
            if element.get('stroke') != band_stroke: errors.append('NL_ENDPOINT_COLOR:' + element.get('id'))
            text = element.get('data-value', '')
            try: ok_value = S.simplify(_value(text, 'NL_ENDPOINT_VALUE') - value) == 0
            except ValueError: ok_value = False
            if not ok_value: errors.append('NL_ENDPOINT_VALUE:' + element.get('id'))
            mine = [l for l in owners.get(element.get('id'), []) if l.get('data-label-role') == 'endpoint']
            if not mine:
                # two open dots of one row at the very same place and value (the pieces k<0 and k>0 of k!=0) share one number: the other dot of that place carries it
                twin = [other for other in drawn_ends.values() if other is not element and abs(_num(other, 'cx') - _num(element, 'cx')) < 0.5 and abs(_num(other, 'cy') - _num(element, 'cy')) < 0.5
                        and other.get('data-value') == element.get('data-value') and other.get('data-state') == element.get('data-state')]
                mine = [l for other in twin for l in owners.get(other.get('id'), []) if l.get('data-label-role') == 'endpoint'] if len(twin) == 1 else []
                if len(mine) == 1 and len([l for l in owners.get(twin[0].get('id'), []) if l.get('data-label-role') == 'endpoint']) != 1: mine = []
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
            if color is not None and element.get('stroke') != '#111': errors.append('NL_INTEGER_COLOR:' + text)
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
            if tick.get('data-role') != 'tick' or tick.get('data-scale') is not None: errors.append('NL_UNEXPECTED_TICK:%d' % index); continue
            if tick.get('data-value') != '0' or abs(_num(tick, 'x1') - px(0)) > TOL: errors.append('NL_TICK_POSITION:' + str(tick.get('id')))
            mine = owners.get(tick.get('id'), [])
            if len(mine) != 1: errors.append('NL_LABEL_COUNT:' + str(tick.get('id')))
            for l in mine:
                try:
                    if read(l) != 0: errors.append('NL_TICK_LABEL_VALUE:' + str(l.get('id')))
                except ValueError as error: errors.append(str(error) + ':' + str(l.get('id')))
    # the parameter note: "a=value" and the Korean tail
    notes = [l for l in labels if l.get('data-label-role') == 'note']
    hide_note = None if parameter_spec is None else parameter_spec.get('hideNote')
    if hide_note is not None and not isinstance(hide_note, bool): raise ValueError('NL_OBSERVER_PLAN_INVALID')
    if parameter_spec is None:
        if notes: errors.append('NL_NOTE_WITHOUT_PARAMETER')
    elif hide_note:
        if notes: errors.append('NL_NOTE_HIDDEN_BUT_DRAWN')     # hideNote: the sample value of the parameter (which may be the answer) is written nowhere
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
    items = []
    shifted_sets = []
    lane_leaders = []
    for label in labels:
        role, owner, label_id = label.get('data-label-role'), label.get('data-owner'), label.get('id')
        match, inner = TRANSLATE.fullmatch(label.get('transform') or ''), label.find(NS + 'svg')
        if not match or inner is None: errors.append('NL_LABEL_GEOMETRY_UNREADABLE:' + str(label_id)); continue
        box = (float(match.group(1)), float(match.group(2)), _num(inner, 'width'), _num(inner, 'height'))
        boxes.append((label_id, box))
        items.append((label_id, role, box, label.get('data-tex')))
        centre = box[0] + box[2] / 2
        row_n = label.get('data-row')
        axis = by_id.get('r%s-axis' % row_n) if row_n else None
        axis_y = _num(axis, 'y1') if axis is not None else None
        if role in ('note', 'ratio', 'row-label', 'span-label', 'source-name'): continue
        if role == 'variable':
            if label.get('data-tex') != variable: errors.append('NL_VARIABLE_LABEL_MISMATCH:' + str(label_id))
            if axis is not None and box[0] < _num(axis, 'x2'): errors.append('NL_VARIABLE_LABEL_ON_AXIS:' + str(label_id))
            continue
        target = by_id.get(owner)
        if target is None: errors.append('NL_LABEL_OWNER_MISSING:' + str(label_id)); continue
        at = (_num(target, 'x1') + _num(target, 'x2')) / 2 if role == 'set' else _num(target, 'x1') if role == 'tick' else _num(target, 'cx')
        sides = name_sides.get((row_n, target.get('data-point-id'))) if role == 'point-name' else None
        if sides is not None and len(sides) == 1:
            # a compass arc rises from this point towards its centre (or this is the centre of a source grid): the name stands on the other side of the dot, above it and near it
            dot_x = _num(target, 'cx')
            beside = box[0] >= dot_x and box[0] - dot_x <= NAME_BESIDE_ARC_PX if 'RIGHT' in sides else box[0] + box[2] <= dot_x and dot_x - (box[0] + box[2]) <= NAME_BESIDE_ARC_PX
            if not beside: errors.append('NL_CONSTRUCTION_NAME_SIDE:' + str(label_id))
        elif role == 'set' and abs(centre - at) > 0.5 and abs(centre - at) <= SET_SHIFT_MAX_PX and box[0] + SET_OVER_BAND_INSET_PX <= at <= box[0] + box[2] - SET_OVER_BAND_INSET_PX: shifted_sets.append((label_id, box))
        elif abs(centre - at) > 0.5 and not (role in ('endpoint', 'point-value') and any(l.get('data-role') == 'label-leader' and l.get('data-label') == label_id for l in lines)): errors.append('NL_LABEL_NOT_CENTRED:' + str(label_id))
        # a point's value is written below the axis, or (on a graduated axis, whose ticks use the space below) stacked above its name
        stacked = role == 'point-value' and (any(t.get('data-scale') for t in ticks if t.get('data-row') == row_n) or (row_n, target.get('data-point-id')) in value_above)
        # N08: a value label that does not fit on the first line under its dot stands over the dot (a row whose names are not drawn) or on a second line under; slid sideways it is joined to its own dot by a straight leader
        lane = None
        if role in ('endpoint', 'point-value') and not stacked:
            dot_top, dot_bottom = _num(target, 'cy') - _num(target, 'r'), _num(target, 'cy') + _num(target, 'r')
            # over the dot only in a row that draws no point name (a value over a name is the plan's own valueSide ABOVE, checked below)
            if box[1] + box[3] <= dot_top + 0.01 and not any(l.get('data-label-role') == 'point-name' and l.get('data-row') == row_n for l in labels): lane = 'ABOVE'
            elif box[1] - dot_bottom > LANE_FIRST_LINE_MAX_PX: lane = 'BELOW2'
        if lane is not None:
            own = [l for l in lines if l.get('data-role') == 'label-leader' and l.get('data-label') == label_id]
            shifted = abs(centre - at) > 0.5
            if lane == 'ABOVE' and not shifted and (dot_top - (box[1] + box[3]) > LANE_OVER_DOT_MAX_PX or own): errors.append('NL_LABEL_LANE_ABOVE:' + str(label_id))
            elif len(own) != (1 if (shifted or lane == 'BELOW2') else 0): errors.append('NL_LABEL_LANE_LEADER:' + str(label_id))
            elif own:
                leader = own[0]
                x1, y1, x2, y2 = _num(leader, 'x1'), _num(leader, 'y1'), _num(leader, 'x2'), _num(leader, 'y2')
                start_ok = abs(x1 - _num(target, 'cx')) <= TOL and (dot_bottom - 0.5 <= y1 <= dot_bottom + LEADER_END_MAX_PX if lane == 'BELOW2' else dot_top - LEADER_END_MAX_PX <= y1 <= dot_top + 0.5)
                end_ok = box[0] - 0.01 <= x2 <= box[0] + box[2] + 0.01 and (box[1] - LEADER_END_MAX_PX <= y2 <= box[1] + 0.01 if lane == 'BELOW2' else box[1] + box[3] - 0.01 <= y2 <= box[1] + box[3] + LEADER_END_MAX_PX)
                if leader.get('data-of') != owner or not start_ok or not end_ok or abs(centre - at) > LANE_SHIFT_MAX_PX: errors.append('NL_LABEL_LANE_LEADER:' + str(label_id))
                else: lane_leaders.append((label_id, owner, x1, y1, x2, y2))
        if lane is not None: pass
        elif stacked:
            if box[1] + box[3] > _num(target, 'cy') - _num(target, 'r'): errors.append('NL_LABEL_NOT_ABOVE_DOT:' + str(label_id))
            for other in owners.get(owner, []):
                if other.get('data-label-role') == 'point-name':
                    other_match, other_inner = TRANSLATE.fullmatch(other.get('transform') or ''), other.find(NS + 'svg')
                    if other_match and other_inner is not None and box[1] + box[3] > float(other_match.group(2)) + 0.5: errors.append('NL_VALUE_NOT_ABOVE_NAME:' + str(label_id))
        elif role in ('endpoint', 'tick', 'point-value', 'point-symbol') and axis_y is not None and box[1] < axis_y + 1.6: errors.append('NL_LABEL_NOT_BELOW_AXIS:' + str(label_id))
        if role in ('integer', 'point-name') and box[1] + box[3] > _num(target, 'cy') - _num(target, 'r'): errors.append('NL_LABEL_NOT_ABOVE_DOT:' + str(label_id))
        if role == 'set' and axis_y is not None and box[1] + box[3] > axis_y - 8: errors.append('NL_LABEL_NOT_ABOVE_BAND:' + str(label_id))
    # a leader belongs to a label on the second line or a slid label, and crosses no other label, no dot of another point and no other leader
    for leader in (element for element in lines if element.get('data-role') == 'label-leader'):
        if leader.get('data-label') not in {item[0] for item in lane_leaders}: errors.append('NL_LEADER_UNEXPECTED:' + str(leader.get('id')))
        # a value leader is steeper than the axis (a flatter one reads as an underline)
        try: slope = math.degrees(math.atan2(abs(_num(leader, 'y2') - _num(leader, 'y1')), abs(_num(leader, 'x2') - _num(leader, 'x1'))))
        except ValueError: slope = 0.0
        if slope < LEADER_MIN_ANGLE_DEG: errors.append('NL_LEADER_TOO_SHALLOW:' + str(leader.get('id')))
        try: length = math.hypot(_num(leader, 'x2') - _num(leader, 'x1'), _num(leader, 'y2') - _num(leader, 'y1'))
        except ValueError: length = 0.0
        if length < LEADER_MIN_LENGTH_PX: errors.append('NL_LEADER_TOO_SHORT:' + str(leader.get('id')))
    # two dots of one row whose circles overlap: each value is joined to its own dot by a leader, the left dot's value stands wholly left of it and the right dot's wholly right of it (so the values keep the order of the dots)
    box_of = dict(boxes)
    value_of = {}
    for label in labels:
        if label.get('data-label-role') in ('endpoint', 'point-value') and label.get('id') in box_of: value_of.setdefault(label.get('data-owner'), label.get('id'))
    leader_labels = {leader.get('data-label') for leader in lines if leader.get('data-role') == 'label-leader'}
    point_dots = [circle for circle in circles if circle.get('data-dot') in ('point', 'endpoint') and circle.get('id') in value_of]
    for i, first in enumerate(point_dots):
        for second in point_dots[i + 1:]:
            if first.get('data-row') != second.get('data-row') or abs(_num(first, 'cy') - _num(second, 'cy')) > 0.5: continue
            if abs(_num(first, 'cx') - _num(second, 'cx')) >= _num(first, 'r') + _num(second, 'r'): continue
            left, right = (first, second) if (_num(first, 'cx'), first.get('id')) <= (_num(second, 'cx'), second.get('id')) else (second, first)
            left_label, right_label = value_of[left.get('id')], value_of[right.get('id')]
            for dot, label_id in ((left, left_label), (right, right_label)):
                if label_id not in leader_labels: errors.append('NL_OVERLAP_DOTS_NO_LEADER:' + label_id)
            left_box, right_box = box_of[left_label], box_of[right_label]
            if left_box[0] + left_box[2] > _num(left, 'cx') + OUTWARD_TOLERANCE_PX: errors.append('NL_OVERLAP_DOTS_NOT_OUTWARD:' + left_label)
            if right_box[0] < _num(right, 'cx') - OUTWARD_TOLERANCE_PX: errors.append('NL_OVERLAP_DOTS_NOT_OUTWARD:' + right_label)
            if left_box[0] + left_box[2] / 2 >= right_box[0] + right_box[2] / 2: errors.append('NL_OVERLAP_DOTS_VALUE_ORDER:%s:%s' % (left_label, right_label))
    def _samples(x1, y1, x2, y2):
        steps = max(1, int(math.ceil(math.hypot(x2 - x1, y2 - y1))))
        return [(x1 + (x2 - x1) * k / steps, y1 + (y2 - y1) * k / steps) for k in range(steps + 1)]
    def _orient(ax, ay, bx, by, cx, cy):
        value = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
        return (value > 0) - (value < 0)
    for label_id, owner_id, x1, y1, x2, y2 in lane_leaders:
        points = _samples(x1, y1, x2, y2)
        for other_id, b in boxes:
            if other_id != label_id and any(b[0] - 0.5 < x < b[0] + b[2] + 0.5 and b[1] - 0.5 < y < b[1] + b[3] + 0.5 for x, y in points): errors.append('NL_LEADER_CROSSES_LABEL:' + label_id + ':' + other_id)
        for circle in circles:
            if circle.get('id') != owner_id and any(math.hypot(x - _num(circle, 'cx'), y - _num(circle, 'cy')) <= _num(circle, 'r') + 0.5 for x, y in points): errors.append('NL_LEADER_CROSSES_DOT:' + label_id + ':' + str(circle.get('id')))
    for i, first in enumerate(lane_leaders):
        for second in lane_leaders[i + 1:]:
            a, b = first[2:], second[2:]
            if _orient(*a[:2], *a[2:], *b[:2]) != _orient(*a[:2], *a[2:], *b[2:]) and _orient(*b[:2], *b[2:], *a[:2]) != _orient(*b[:2], *b[2:], *a[2:]): errors.append('NL_LEADER_CROSSES_LEADER:' + first[0] + ':' + second[0])
    _run_together(items, errors)
    for label_id, role, box, tex in items:
        if role == 'set' and (tex or '').rstrip().endswith(',') and not any(other_id != label_id and other_role == 'set' and other_box[0] > box[0] and _line_gap(box, other_box) is not None and 0 <= _line_gap(box, other_box) < PIECE_SEPARATED_PX + 6 for other_id, other_role, other_box, _ in items): errors.append('NL_SET_COMMA_UNEXPECTED:' + label_id)
    for label_id, box in shifted_sets:
        if not any(other_id != label_id and role == 'set' and _line_gap(box, other_box) is not None and 0 <= _line_gap(box, other_box) < PIECE_SEPARATED_PX + 6 for other_id, role, other_box, _ in items): errors.append('NL_LABEL_NOT_CENTRED:' + label_id)
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
