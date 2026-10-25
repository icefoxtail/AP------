"""Independent statistics-chart observer. Does not import the producer.

Re-derives everything from the plan's own data with exact fractions (class midpoints, polygon vertices with the zero-frequency end classes, relative
frequencies, the Korean-curriculum quartiles, sorted leaves, the dice-table predicate, branch and path probabilities) and checks the final SVG bytes:
the axis scale is recovered from the tick marks and the numbers their labels read, never from anything the producer states about its own scale.
"""
import ast
import hashlib
import math
import re
import xml.etree.ElementTree as ET
from fractions import Fraction

NS = '{http://www.w3.org/2000/svg}'
TOL = 0.02
LABEL_TOL = 1.5
CAPABILITY = 'stat-chart-figure-v1'
FILL = {'bar': '#ececec', 'barHi': '#b5b5b5', 'cell': '#fff', 'cellHi': '#c9c9c9'}


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
    fail('SC_LABEL_TEX_UNREADABLE')


def num(element, name):
    try: value = float(element.get(name))
    except (TypeError, ValueError): fail('SC_SVG_ATTRIBUTE_INVALID:' + name)
    if not math.isfinite(value): fail('SC_SVG_ATTRIBUTE_INVALID:' + name)
    return value


def box_of(label):
    try: x, y, w, h = [float(v) for v in label.get('data-box').split(',')]
    except Exception: fail('SC_LABEL_BOX_MISSING:' + str(label.get('id')))
    return x, y, w, h


def centre(label):
    x, y, w, h = box_of(label)
    return x + w / 2, y + h / 2


def median(values):
    n = len(values)
    return values[(n - 1) // 2] if n % 2 else (values[n // 2 - 1] + values[n // 2]) / 2


def five_numbers(values):
    """Q1 is the median of the lower half, Q3 of the upper half; the middle value is left out of both when n is odd."""
    values = sorted(values)
    n = len(values)
    h = n // 2
    return {'min': values[0], 'q1': median(values[:h]), 'median': median(values), 'q3': median(values[n - h:]), 'max': values[-1]}


class Doc:
    def __init__(self, svg, kind):
        self.errors = []
        self.root = ET.fromstring(svg)
        if self.root.get('data-stat-chart') != CAPABILITY: self.errors.append('SC_SVG_NOT_A_STAT_CHART')
        if self.root.get('data-kind') != kind: self.errors.append('SC_KIND_MISMATCH')
        self.by_id = {e.get('id'): e for e in self.root.iter() if e.get('id')}
        self.lines = list(self.root.iter(NS + 'line'))
        self.rects = list(self.root.iter(NS + 'rect'))
        self.circles = list(self.root.iter(NS + 'circle'))
        self.labels = [e for e in self.root.iter(NS + 'g') if e.get('data-label-role')]
        self.owners = {}
        for label in self.labels: self.owners.setdefault(label.get('data-owner'), []).append(label)

    def err(self, code): self.errors.append(code)

    def role(self, tag, role):
        return [e for e in self.root.iter(NS + tag) if e.get('data-role') == role]

    def label_role(self, role): return [e for e in self.labels if e.get('data-label-role') == role]

    def label_of(self, owner_id, role=None):
        found = [l for l in self.owners.get(owner_id, []) if role is None or l.get('data-label-role') == role]
        if len(found) != 1: self.err('SC_LABEL_COUNT:' + str(owner_id)); return None
        return found[0]

    def axis_map(self, role, axis):
        """The scale of one axis recovered from its tick marks and the numbers their labels read. Returns (value -> coordinate, coordinate -> value, tick values)."""
        ticks = self.role('line', role)
        pairs = []
        for tick in ticks:
            label = self.label_of(tick.get('id'), role)
            if label is None: continue
            try: value = tex_number(label.get('data-tex'))
            except ValueError as e: self.err(str(e) + ':' + label.get('id')); continue
            if frac(tick.get('data-value'), 'SC_TICK_VALUE_INVALID') != value: self.err('SC_TICK_VALUE_MISMATCH:' + tick.get('id'))
            coord = num(tick, 'x1') if axis == 'x' else num(tick, 'y1')
            if axis == 'x' and abs(num(tick, 'x1') - num(tick, 'x2')) > TOL or axis == 'y' and abs(num(tick, 'y1') - num(tick, 'y2')) > TOL: self.err('SC_TICK_NOT_PERPENDICULAR:' + tick.get('id'))
            cx, cy = centre(label)
            if axis == 'x' and abs(cx - coord) > LABEL_TOL or axis == 'y' and abs(cy - coord) > LABEL_TOL + 1: self.err('SC_TICK_LABEL_NOT_CENTRED:' + label.get('id'))
            pairs.append((value, coord))
        if len(pairs) < 2 or len({v for v, _ in pairs}) != len(pairs): fail('SC_AXIS_TICKS_MISSING:' + role)
        pairs.sort()
        (v0, c0), (v1, c1) = pairs[0], pairs[-1]
        slope = (c1 - c0) / float(v1 - v0)
        if slope == 0: fail('SC_AXIS_SCALE_DEGENERATE:' + role)
        for v, c in pairs:
            if abs(c0 + float(v - v0) * slope - c) > 0.05: self.err('SC_AXIS_NOT_LINEAR:' + role)
        if axis == 'x' and slope <= 0 or axis == 'y' and slope >= 0: self.err('SC_AXIS_DIRECTION:' + role)
        return (lambda v: c0 + float(v - v0) * slope), (lambda c: v0 + Fraction((c - c0) / slope).limit_denominator(100000)), [v for v, _ in pairs]

    def check_title(self, label_id, expected, owner_axis):
        found = [l for l in self.labels if l.get('id') == label_id]
        if not expected:
            if found: self.err('SC_TITLE_UNEXPECTED:' + label_id)
            return
        if len(found) != 1 or found[0].get('data-text') != expected: self.err('SC_TITLE_MISMATCH:' + label_id)

    def near(self, a, b, code, tol=TOL):
        if abs(a - b) > tol: self.err(code)


def derive_freq(chart):
    kind = chart.get('kind')
    b = [frac(x, 'SC_PLAN_INVALID') for x in chart['boundaries']]
    n = len(b) - 1
    width = b[1] - b[0]
    if any(b[i + 1] - b[i] != width for i in range(n)) or width <= 0: fail('STAT_CLASS_WIDTH_UNEQUAL')
    relative = any('relativeFrequencies' in s for s in chart['series'])
    y_kind = chart.get('yKind') or ('RELATIVE' if relative else 'FREQUENCY')
    series = []
    for i, s in enumerate(chart['series']):
        if 'frequencies' in s:
            freq = list(s['frequencies'])
            if len(freq) != n: fail('STAT_FREQUENCY_COUNT_MISMATCH')
            total = sum(freq)
            given = s.get('total', chart.get('total') if i == 0 else None)
            if given is not None and given != total: fail('STAT_FREQUENCY_TOTAL_MISMATCH')
            values = [Fraction(f) if y_kind == 'FREQUENCY' else Fraction(f, total) for f in freq]
        else:
            values = [frac(x, 'SC_PLAN_INVALID') for x in s['relativeFrequencies']]
            if sum(values) != 1: fail('STAT_RELATIVE_SUM_NOT_ONE')
        series.append({'name': s.get('name'), 'values': values})
    mids = [(b[i] + b[i + 1]) / 2 for i in range(n)]
    polygon = kind == 'FREQUENCY_POLYGON' or chart.get('polygon') is True
    for s in series:
        s['vertices'] = [(mids[0] - width, Fraction(0))] + list(zip(mids, s['values'])) + [(mids[-1] + width, Fraction(0))]
    return b, width, mids, series, polygon, y_kind


def audit_freq(chart, doc):
    b, width, mids, series, polygon, y_kind = derive_freq(chart)
    n = len(b) - 1
    kind = chart['kind']
    fx, _, xvals = doc.axis_map('x-tick', 'x')
    fy, _, yvals = doc.axis_map('y-tick', 'y')
    if set(xvals) != set(b): doc.err('SC_X_TICKS_NOT_BOUNDARIES')
    top = max(v for s in series for v in s['values'])
    if max(yvals) <= top: doc.err('SC_Y_AXIS_DOES_NOT_REACH_DATA')
    steps = {yvals[i + 1] - yvals[i] for i in range(len(yvals) - 1)}
    if len(steps) > 1 or (yvals and yvals[0] != min(steps or {yvals[0]})): doc.err('SC_Y_TICKS_NOT_EVEN')
    x_axis, y_axis = doc.by_id.get('x-axis'), doc.by_id.get('y-axis')
    if x_axis is None or y_axis is None: fail('SC_AXIS_MISSING')
    base = fy(Fraction(0))
    doc.near(num(x_axis, 'y1'), base, 'SC_X_AXIS_NOT_AT_ZERO')
    doc.near(num(y_axis, 'y1'), base, 'SC_Y_AXIS_START')
    if b[0] == 0: doc.near(num(y_axis, 'x1'), fx(Fraction(0)), 'SC_Y_AXIS_NOT_AT_ORIGIN')
    elif num(y_axis, 'x1') >= fx(min(b[0], mids[0] - width if polygon else b[0])): doc.err('SC_Y_AXIS_NOT_LEFT_OF_DATA')
    breaks = [e for e in doc.role('line', 'axis-break') if e.get('data-axis') == 'x']
    if (len(breaks) == 2) != (b[0] > 0) or len(breaks) not in (0, 2): doc.err('SC_AXIS_BREAK_MISMATCH')
    if (b[0] > 0) != (doc.label_role('origin') != []): doc.err('SC_ORIGIN_LABEL_MISMATCH')
    bars = doc.role('rect', 'bar')
    if kind == 'FREQUENCY_POLYGON' and bars: doc.err('SC_BARS_IN_POLYGON_CHART')
    if kind == 'HISTOGRAM':
        highlight = set(chart.get('highlightClasses') or [])
        values = series[0]['values']
        if len(bars) != n: doc.err('SC_BAR_COUNT')
        for bar in bars:
            i = int(bar.get('data-class', -1))
            if not 0 <= i < n: doc.err('SC_BAR_INDEX'); continue
            x0, x1 = fx(b[i]), fx(b[i + 1])
            top_y = fy(values[i])
            if abs(num(bar, 'x') - x0) > TOL or abs(num(bar, 'x') + num(bar, 'width') - x1) > TOL: doc.err('SC_BAR_X_RANGE:%d' % i)
            if abs(num(bar, 'y') - top_y) > TOL or abs(num(bar, 'y') + num(bar, 'height') - base) > TOL: doc.err('SC_BAR_HEIGHT:%d' % i)
            want = 'barHi' if i in highlight else 'bar'
            if (bar.get('fill') or '').lower() != FILL[want] or bar.get('data-highlight') != ('1' if i in highlight else '0'): doc.err('SC_BAR_HIGHLIGHT:%d' % i)
        if {int(bar.get('data-class', -1)) for bar in bars} != set(range(n)): doc.err('SC_BAR_CLASSES')
    polylines = doc.role('polyline', 'polygon')
    vertices = [e for e in doc.circles if e.get('data-vertex') is not None]
    if not polygon:
        if polylines or vertices: doc.err('SC_UNEXPECTED_POLYGON')
    else:
        if len(polylines) != len(series): doc.err('SC_POLYGON_COUNT')
        for s, serie in enumerate(series):
            line = [p for p in polylines if p.get('data-series') == str(s)]
            dots = sorted([d for d in vertices if d.get('data-series') == str(s)], key=lambda d: int(d.get('data-vertex')))
            if len(line) != 1: doc.err('SC_POLYGON_COUNT:%d' % s); continue
            try: points = [tuple(float(v) for v in pair.split(',')) for pair in line[0].get('points').split()]
            except ValueError: doc.err('SC_POLYGON_POINTS_UNREADABLE'); continue
            want = [(fx(x), fy(y)) for x, y in serie['vertices']]
            if len(points) != len(want) or len(dots) != len(want): doc.err('SC_POLYGON_VERTEX_COUNT:%d' % s); continue
            for k, ((px, py), (wx, wy)) in enumerate(zip(points, want)):
                if abs(px - wx) > TOL or abs(py - wy) > TOL: doc.err('SC_POLYGON_VERTEX:%d:%d' % (s, k))
                if abs(num(dots[k], 'cx') - wx) > TOL or abs(num(dots[k], 'cy') - wy) > TOL: doc.err('SC_POLYGON_DOT:%d:%d' % (s, k))
            if points and (abs(points[0][1] - base) > TOL or abs(points[-1][1] - base) > TOL): doc.err('SC_POLYGON_ENDS_NOT_ZERO:%d' % s)
            if (line[0].get('stroke-dasharray') is not None) != (s == 1): doc.err('SC_POLYGON_STYLE:%d' % s)
    # value labels
    shown = {l.get('data-class'): l for l in doc.label_role('value')}
    if chart.get('showValues') is True:
        for i, v in enumerate(series[0]['values']):
            if v == 0: continue
            label = shown.get(str(i))
            if label is None: doc.err('SC_VALUE_LABEL_MISSING:%d' % i); continue
            try: read = tex_number(label.get('data-tex'))
            except ValueError as e: doc.err(str(e)); continue
            if read != v: doc.err('SC_VALUE_LABEL_VALUE:%d' % i)
            cx, cy = centre(label)
            if abs(cx - fx(mids[i])) > LABEL_TOL: doc.err('SC_VALUE_LABEL_NOT_CENTRED:%d' % i)
            if cy > fy(v): doc.err('SC_VALUE_LABEL_NOT_ABOVE:%d' % i)
        if len(shown) != sum(1 for v in series[0]['values'] if v != 0): doc.err('SC_VALUE_LABEL_COUNT')
    elif shown: doc.err('SC_VALUE_LABELS_UNEXPECTED')
    doc.check_title('x-title', chart.get('xTitle', '계급'), 'x')
    doc.check_title('y-title', chart.get('yTitle', '도수(명)' if y_kind == 'FREQUENCY' else '상대도수'), 'y')
    legends = doc.label_role('legend')
    if len(series) > 1:
        if sorted(l.get('data-text') for l in legends) != sorted(s['name'] for s in series): doc.err('SC_LEGEND_NAMES')
    elif legends: doc.err('SC_LEGEND_UNEXPECTED')
    grids = doc.role('line', 'grid')
    if chart.get('grid') is True:
        # a grid line may be cut into pieces around labels: compare the set of line positions
        horizontal = {round(num(g, 'y1'), 1) for g in grids if abs(num(g, 'y1') - num(g, 'y2')) < TOL}
        vertical = {round(num(g, 'x1'), 1) for g in grids if abs(num(g, 'x1') - num(g, 'x2')) < TOL}
        if horizontal != {round(fy(v), 1) for v in yvals}: doc.err('SC_GRID_HORIZONTAL')
        if vertical != {round(fx(v), 1) for v in b[1:]}: doc.err('SC_GRID_VERTICAL')
    elif grids: doc.err('SC_GRID_UNEXPECTED')
    return {'classes': n, 'yKind': y_kind, 'polygon': polygon, 'totals': [sum(s['values']) for s in series].__repr__()}


def audit_stem(chart, doc):
    raw = [{'values': chart['values']}] if 'values' in chart else chart['groups']
    groups = [{'name': g.get('name'), 'values': sorted(g['values'])} for g in raw]
    allv = [v for g in groups for v in g['values']]
    stems = list(range(min(allv) // 10, max(allv) // 10 + 1))
    two = len(groups) == 2
    stem_labels = doc.label_role('stem')
    if sorted(int(l.get('data-value')) for l in stem_labels) != stems: doc.err('SC_STEMS_MISMATCH')
    stem_y = {}
    for l in stem_labels:
        s = int(l.get('data-value'))
        try: read = tex_number(l.get('data-tex'))
        except ValueError as e: doc.err(str(e)); continue
        if read != s: doc.err('SC_STEM_LABEL_VALUE:%d' % s)
        stem_y[s] = centre(l)
    ys = [stem_y[s][1] for s in stems if s in stem_y]
    if ys != sorted(ys) or len(set(round(y, 1) for y in ys)) != len(ys): doc.err('SC_STEM_ORDER')
    leaves = doc.label_role('leaf')
    if len(leaves) != len(allv): doc.err('SC_LEAF_COUNT_MISMATCH')
    stem_x = sum(c[0] for c in stem_y.values()) / max(len(stem_y), 1)
    for gi, g in enumerate(groups):
        for s in stems:
            want = [v % 10 for v in g['values'] if v // 10 == s]
            mine = sorted([l for l in leaves if l.get('data-group') == str(gi) and l.get('data-stem') == str(s)], key=lambda l: int(l.get('data-index')))
            read = []
            for l in mine:
                try: read.append(int(tex_number(l.get('data-tex'))))
                except ValueError as e: doc.err(str(e))
                if l.get('data-value') != str(s * 10 + read[-1] if read else -1): doc.err('SC_LEAF_VALUE_ATTRIBUTE:%d' % s)
            if read != want: doc.err('SC_LEAVES_MISMATCH:g%d:%d' % (gi, s))
            xs = [centre(l)[0] for l in mine]
            if (gi == 0 and not two and xs != sorted(xs)) or (gi == 0 and two and xs != sorted(xs, reverse=True)) or (gi == 1 and xs != sorted(xs)): doc.err('SC_LEAF_ORDER:g%d:%d' % (gi, s))
            if two and ((gi == 0 and any(x >= stem_x for x in xs)) or (gi == 1 and any(x <= stem_x for x in xs))): doc.err('SC_LEAF_SIDE:g%d' % gi)
            if not two and any(x <= stem_x for x in xs): doc.err('SC_LEAF_SIDE:g%d' % gi)
            for k, l in enumerate(mine):
                if s in stem_y and abs(centre(l)[1] - stem_y[s][1]) > LABEL_TOL: doc.err('SC_LEAF_NOT_ON_STEM_ROW:%d' % s)
    # marks: the rank-th smallest value of the group circles that leaf
    marks = []
    for m in chart.get('marks') or []:
        gi = m.get('group', 0)
        n = len(groups[gi]['values'])
        ranks = ([(n + 1) // 2] if n % 2 else [n // 2, n // 2 + 1]) if m.get('median') is True else m['ranks']
        marks += [(gi, r) for r in ranks]
    drawn = doc.role('ellipse', 'mark')
    if sorted((int(e.get('data-group')), int(e.get('data-rank'))) for e in drawn) != sorted(marks): doc.err('SC_MARK_SET_MISMATCH')
    for e in drawn:
        gi, rank = int(e.get('data-group')), int(e.get('data-rank'))
        values = groups[gi]['values']
        if not 1 <= rank <= len(values): doc.err('SC_MARK_RANK'); continue
        value = values[rank - 1]
        if e.get('data-value') != str(value): doc.err('SC_MARK_VALUE:%d' % rank)
        s = value // 10
        before = sum(1 for v in values[:rank - 1] if v // 10 == s)
        target = [l for l in leaves if l.get('data-group') == str(gi) and l.get('data-stem') == str(s) and l.get('data-index') == str(before)]
        if len(target) != 1: doc.err('SC_MARK_TARGET:%d' % rank); continue
        cx, cy = centre(target[0])
        if abs(num(e, 'cx') - cx) > LABEL_TOL or abs(num(e, 'cy') - cy) > LABEL_TOL: doc.err('SC_MARK_NOT_ON_LEAF:%d' % rank)
        if tex_number(target[0].get('data-tex')) != value % 10: doc.err('SC_MARK_LEAF_VALUE:%d' % rank)
    # key
    unit = chart.get('unitText', '')
    key = chart.get('key')
    first = groups[0]['values'][0]
    ks, kl = (key['stem'], key['leaf']) if key else (first // 10, first % 10)
    if key and ks * 10 + kl not in allv: doc.err('SC_KEY_NOT_IN_DATA')
    keys = doc.label_role('key')
    if len(keys) != 1 or keys[0].get('data-text') != '%d | %d은 %d%s' % (ks, kl, ks * 10 + kl, unit): doc.err('SC_KEY_TEXT')
    heads = {l.get('data-text') for l in doc.label_role('header')}
    want_heads = {'줄기'} | ({g['name'] for g in groups} if two else {'잎'})
    if heads != want_heads: doc.err('SC_HEADERS')
    doc.check_title('title', chart.get('title'), 'x')
    return {'n': [len(g['values']) for g in groups], 'median': [str(median([Fraction(v) for v in g['values']])) for g in groups]}


def audit_box(chart, doc):
    fx, _, xvals = doc.axis_map('x-tick', 'x')
    x_axis = doc.by_id.get('x-axis')
    if x_axis is None: fail('SC_AXIS_MISSING')
    axis_y = num(x_axis, 'y1')
    allmin, allmax = None, None
    for s, raw in enumerate(chart['series']):
        if 'values' in raw:
            if len(raw['values']) < 4: fail('STAT_BOX_NEEDS_FOUR_VALUES')
            five = five_numbers([frac(v, 'SC_PLAN_INVALID') for v in raw['values']])
        else:
            five = {k: frac(raw['summary'][k], 'SC_PLAN_INVALID') for k in ('min', 'q1', 'median', 'q3', 'max')}
            order = [five[k] for k in ('min', 'q1', 'median', 'q3', 'max')]
            if order != sorted(order): fail('STAT_BOX_SUMMARY_NOT_ORDERED')
        allmin = five['min'] if allmin is None else min(allmin, five['min'])
        allmax = five['max'] if allmax is None else max(allmax, five['max'])
        box = doc.by_id.get('box-s%d' % s)
        if box is None: doc.err('SC_BOX_MISSING:%d' % s); continue
        if abs(num(box, 'x') - fx(five['q1'])) > TOL or abs(num(box, 'x') + num(box, 'width') - fx(five['q3'])) > TOL: doc.err('SC_BOX_RANGE:%d' % s)
        top, bottom = num(box, 'y'), num(box, 'y') + num(box, 'height')
        if bottom >= axis_y: doc.err('SC_BOX_BELOW_AXIS:%d' % s)
        mid_y = (top + bottom) / 2
        med = doc.by_id.get('median-s%d' % s)
        if med is None or abs(num(med, 'x1') - fx(five['median'])) > TOL or abs(num(med, 'x2') - fx(five['median'])) > TOL or abs(num(med, 'y1') - top) > TOL or abs(num(med, 'y2') - bottom) > TOL: doc.err('SC_MEDIAN:%d' % s)
        for name, a, b in (('whisker-s%d-lo' % s, five['min'], five['q1']), ('whisker-s%d-hi' % s, five['q3'], five['max'])):
            w = doc.by_id.get(name)
            if w is None or abs(num(w, 'x1') - fx(a)) > TOL or abs(num(w, 'x2') - fx(b)) > TOL or abs(num(w, 'y1') - mid_y) > TOL or abs(num(w, 'y2') - mid_y) > TOL: doc.err('SC_WHISKER:' + name)
        for name, v in (('cap-s%d-min' % s, five['min']), ('cap-s%d-max' % s, five['max'])):
            c = doc.by_id.get(name)
            if c is None or abs(num(c, 'x1') - fx(v)) > TOL or abs(num(c, 'x2') - fx(v)) > TOL or not (num(c, 'y1') < mid_y < num(c, 'y2')): doc.err('SC_CAP:' + name)
        names = [l for l in doc.label_role('series-name') if l.get('data-series') == str(s)]
        if raw.get('name'):
            if len(names) != 1 or names[0].get('data-text') != raw['name']: doc.err('SC_SERIES_NAME:%d' % s)
        elif names: doc.err('SC_SERIES_NAME_UNEXPECTED')
        values = [l for l in doc.label_role('value') if l.get('data-series') == str(s)]
        if chart.get('showValues') is True:
            got = {l.get('data-key'): l for l in values}
            if set(got) != {'min', 'q1', 'median', 'q3', 'max'}: doc.err('SC_VALUE_LABELS:%d' % s)
            for k, l in got.items():
                try: read = tex_number(l.get('data-tex'))
                except ValueError as e: doc.err(str(e)); continue
                if k in five and read != five[k]: doc.err('SC_VALUE_LABEL_VALUE:%d:%s' % (s, k))
                if k in five and abs(centre(l)[0] - fx(five[k])) > LABEL_TOL: doc.err('SC_VALUE_LABEL_NOT_CENTRED:%d:%s' % (s, k))
        elif values: doc.err('SC_VALUE_LABELS_UNEXPECTED')
    if not (min(xvals) <= allmin and allmax <= max(xvals)): doc.err('SC_AXIS_DOES_NOT_COVER_DATA')
    breaks = doc.role('line', 'axis-break')
    if (len(breaks) == 2) != (min(xvals) > 0) or len(breaks) not in (0, 2): doc.err('SC_AXIS_BREAK_MISMATCH')
    doc.check_title('x-title', chart.get('xTitle', ''), 'x')
    return {'series': len(chart['series'])}


def audit_scatter(chart, doc):
    fx, ix, xvals = doc.axis_map('x-tick', 'x')
    fy, iy, yvals = doc.axis_map('y-tick', 'y')
    xr = [frac(v, 'SC_PLAN_INVALID') for v in chart['xRange']]
    yr = [frac(v, 'SC_PLAN_INVALID') for v in chart['yRange']]
    circles = {int(c.get('data-index')): c for c in doc.circles if c.get('data-index') is not None}
    if len(circles) != len(chart['points']): doc.err('SC_POINT_COUNT')
    on_diagonal = 0
    for i, p in enumerate(chart['points']):
        x, y = frac(p['x'], 'SC_PLAN_INVALID'), frac(p['y'], 'SC_PLAN_INVALID')
        if not (xr[0] <= x <= xr[1] and yr[0] <= y <= yr[1]): fail('STAT_POINT_OUTSIDE_RANGE')
        on_diagonal += x == y
        c = circles.get(i)
        if c is None: continue
        if abs(num(c, 'cx') - fx(x)) > TOL or abs(num(c, 'cy') - fy(y)) > TOL: doc.err('SC_POINT_POSITION:%d' % i)
        name = p.get('name')
        labels = [l for l in doc.label_role('point-name') if l.get('data-owner') == c.get('id')]
        if name:
            if len(labels) != 1 or labels[0].get('data-value') != name or labels[0].get('data-tex') != name: doc.err('SC_POINT_NAME:%d' % i)
            elif not (0 < centre(labels[0])[0] - num(c, 'cx') < 40) or abs(centre(labels[0])[1] - num(c, 'cy')) > LABEL_TOL: doc.err('SC_POINT_NAME_PLACE:%d' % i)
        elif labels: doc.err('SC_POINT_NAME_UNEXPECTED:%d' % i)
    # the points that sit on y = x, counted from the drawn dots through the recovered scales
    seen = sum(1 for c in circles.values() if ix(num(c, 'cx')) == iy(num(c, 'cy')))
    if seen != on_diagonal: doc.err('SC_DIAGONAL_COUNT_MISMATCH')
    diagonal = doc.by_id.get('diagonal')
    if chart.get('diagonal') is True:
        t0, t1 = max(xr[0], yr[0]), min(xr[1], yr[1])
        if diagonal is None or abs(num(diagonal, 'x1') - fx(t0)) > TOL or abs(num(diagonal, 'y1') - fy(t0)) > TOL or abs(num(diagonal, 'x2') - fx(t1)) > TOL or abs(num(diagonal, 'y2') - fy(t1)) > TOL: doc.err('SC_DIAGONAL')
    elif diagonal is not None: doc.err('SC_DIAGONAL_UNEXPECTED')
    if not (xvals[0] >= xr[0] and xvals[-1] <= xr[1] and yvals[0] >= yr[0] and yvals[-1] <= yr[1]): doc.err('SC_TICK_OUTSIDE_RANGE')
    grids = doc.role('line', 'grid')
    if chart.get('grid') is not False:
        if not grids: doc.err('SC_GRID_MISSING')
        for g in grids:
            if abs(num(g, 'x1') - num(g, 'x2')) < TOL:
                v = ix(num(g, 'x1'))
                if not (xr[0] <= v <= xr[1]): doc.err('SC_GRID_OUTSIDE')
            elif abs(num(g, 'y1') - num(g, 'y2')) < TOL:
                v = iy(num(g, 'y1'))
                if not (yr[0] <= v <= yr[1]): doc.err('SC_GRID_OUTSIDE')
            else: doc.err('SC_GRID_SLANTED')
    elif grids: doc.err('SC_GRID_UNEXPECTED')
    xb = [e for e in doc.role('line', 'axis-break') if e.get('data-axis') == 'x']
    yb = [e for e in doc.role('line', 'axis-break') if e.get('data-axis') == 'y']
    if len(xb) != (2 if xr[0] > 0 else 0) or len(yb) != (2 if yr[0] > 0 else 0): doc.err('SC_AXIS_BREAK_MISMATCH')
    doc.check_title('x-title', chart.get('xTitle', ''), 'x')
    doc.check_title('y-title', chart.get('yTitle', ''), 'y')
    return {'points': len(chart['points']), 'onDiagonal': on_diagonal}


def _ast_value(node, env):
    if isinstance(node, ast.Expression): return _ast_value(node.body, env)
    if isinstance(node, ast.Constant) and isinstance(node.value, int) and not isinstance(node.value, bool): return node.value
    if isinstance(node, ast.Name) and node.id in env: return env[node.id]
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub): return -_ast_value(node.operand, env)
    if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.Sub, ast.Mult)):
        a, b = _ast_value(node.left, env), _ast_value(node.right, env)
        return a + b if isinstance(node.op, ast.Add) else a - b if isinstance(node.op, ast.Sub) else a * b
    fail('STAT_DICE_EXPR_INVALID')


def _predicate(p, env):
    if 'any' in p: return any(_predicate(x, env) for x in p['any'])
    if 'all' in p: return all(_predicate(x, env) for x in p['all'])
    if 'not' in p: return not _predicate(p['not'], env)
    value = _ast_value(ast.parse(p['expr'].strip(), mode='eval'), env)
    if 'in' in p: return value in [int(x) for x in p['in']]
    other = int(p['value'])
    return {'=': value == other, '<': value < other, '<=': value <= other, '>': value > other, '>=': value >= other}[p['cmp']]


def audit_dice(chart, doc):
    faces = chart.get('faces', 6)
    cell_mode = chart.get('cell', 'PAIR')
    col_var, row_var = chart.get('colVar', 'a'), chart.get('rowVar', 'b')
    pred = chart.get('highlight')
    cells = {(int(r.get('data-col')), int(r.get('data-row'))): r for r in doc.role('rect', 'cell')}
    if set(cells) != {(k, r) for k in range(1, faces + 1) for r in range(1, faces + 1)}: doc.err('SC_CELL_SET')
    corner = doc.by_id.get('corner')
    if corner is None: fail('SC_CORNER_MISSING')
    x0, y0, size = num(corner, 'x'), num(corner, 'y'), num(corner, 'width')
    count = 0
    for (k, r), rect in cells.items():
        if abs(num(rect, 'x') - (x0 + k * size)) > TOL or abs(num(rect, 'y') - (y0 + r * size)) > TOL or abs(num(rect, 'width') - size) > TOL or abs(num(rect, 'height') - size) > TOL: doc.err('SC_CELL_GRID:%d,%d' % (k, r))
        env = {col_var: k, row_var: r}
        want = bool(pred is not None and _predicate(pred, env))
        count += want
        if rect.get('data-highlight') != ('1' if want else '0') or (rect.get('fill') or '').lower() != FILL['cellHi' if want else 'cell']: doc.err('SC_CELL_HIGHLIGHT:%d,%d' % (k, r))
        text = {'PAIR': '(%d,%d)' % (k, r), 'SUM': str(k + r), 'PRODUCT': str(k * r), 'NONE': None}[cell_mode]
        labels = doc.owners.get(rect.get('id'), [])
        if text is None:
            if labels: doc.err('SC_CELL_TEXT_UNEXPECTED:%d,%d' % (k, r))
        elif len(labels) != 1 or labels[0].get('data-tex') != text: doc.err('SC_CELL_TEXT:%d,%d' % (k, r))
        elif abs(centre(labels[0])[0] - (x0 + (k + .5) * size)) > LABEL_TOL or abs(centre(labels[0])[1] - (y0 + (r + .5) * size)) > LABEL_TOL: doc.err('SC_CELL_TEXT_PLACE:%d,%d' % (k, r))
    if sum(1 for r in cells.values() if r.get('data-highlight') == '1') != count: doc.err('SC_HIGHLIGHT_COUNT')
    for axis in ('col', 'row'):
        heads = sorted((int(r.get('data-value')), r) for r in doc.rects if r.get('data-role') == 'head' and r.get('data-axis') == axis)
        if [v for v, _ in heads] != list(range(1, faces + 1)): doc.err('SC_HEADERS:' + axis)
        for v, r in heads:
            labels = doc.owners.get(r.get('id'), [])
            if len(labels) != 1 or labels[0].get('data-tex') != str(v): doc.err('SC_HEADER_LABEL:%s%d' % (axis, v))
    names = {l.get('data-axis'): l.get('data-tex') for l in doc.label_role('var')}
    if names != {'col': col_var, 'row': row_var}: doc.err('SC_VARIABLE_LABELS')
    return {'highlighted': count, 'total': faces * faces}


def audit_tree(chart, doc):
    nodes = []

    def walk(raw, node_id, parent, depth, p):
        if depth > 3: fail('STAT_TREE_TOO_DEEP')
        nodes.append({'id': node_id, 'parent': parent, 'depth': depth, 'label': raw.get('label'), 'p': p, 'children': []})
        kids = raw.get('children') or []
        if kids:
            given = ['p' in k for k in kids]
            if len(kids) < 2 or any(g != given[0] for g in given): fail('STAT_TREE_INVALID')
            ps = [frac(k['p'], 'SC_PLAN_INVALID') if g else None for k, g in zip(kids, given)]
            if given[0] and sum(ps) != 1: fail('STAT_TREE_BRANCH_PROBABILITY_SUM')
            for i, k in enumerate(kids):
                nodes[[n['id'] for n in nodes].index(node_id)]['children'].append('%s.%d' % (node_id, i + 1))
                walk(k, '%s.%d' % (node_id, i + 1), node_id, depth + 1, ps[i])
    walk(chart['root'], 'n0', None, 0, None)
    by_id = {n['id']: n for n in nodes}
    has_p = any(n['p'] is not None for n in nodes)
    for n in nodes: n['path'] = Fraction(1) if n['parent'] is None else (by_id[n['parent']]['path'] * n['p'] if has_p else None)
    leaves = [n for n in nodes if not n['children']]
    if has_p and sum(n['path'] for n in leaves) != 1: fail('STAT_TREE_BRANCH_PROBABILITY_SUM')
    centres = {}
    for n in nodes:
        label = doc.by_id.get('node-' + n['id'])
        if n['label'] is None:
            if label is None or label.tag != NS + 'circle': doc.err('SC_NODE_MISSING:' + n['id']); continue
            centres[n['id']] = (num(label, 'cx'), num(label, 'cy'))
            continue
        if label is None or label.get('data-label-role') != 'node': doc.err('SC_NODE_MISSING:' + n['id']); continue
        text = label.get('data-text') or label.get('data-tex')
        if text != n['label']: doc.err('SC_NODE_LABEL:' + n['id'])
        c = centre(label)
        if abs(c[0] - float(label.get('data-cx'))) > LABEL_TOL or abs(c[1] - float(label.get('data-cy'))) > LABEL_TOL: doc.err('SC_NODE_CENTRE:' + n['id'])
        centres[n['id']] = c
    for n in nodes:
        if n['id'] not in centres: continue
        for k in range(len(n['children']) - 1):
            a, b = n['children'][k], n['children'][k + 1]
            if a in centres and b in centres and not centres[a][1] < centres[b][1]: doc.err('SC_SIBLING_ORDER:' + n['id'])
        for child in n['children']:
            if child in centres and not centres[n['id']][0] < centres[child][0]: doc.err('SC_DEPTH_ORDER:' + child)
        if n['children'] and all(c in centres for c in n['children']):
            ys = [centres[c][1] for c in n['children']]
            if not min(ys) <= centres[n['id']][1] <= max(ys): doc.err('SC_PARENT_NOT_BETWEEN_CHILDREN:' + n['id'])
    branches = {l.get('data-child'): l for l in doc.role('line', 'branch')}
    if set(branches) != {n['id'] for n in nodes if n['parent'] is not None}: doc.err('SC_BRANCH_SET')
    for n in nodes:
        if n['parent'] is None or n['id'] not in branches: continue
        ln = branches[n['id']]
        if ln.get('data-parent') != n['parent']: doc.err('SC_BRANCH_PARENT:' + n['id'])
        if n['id'] not in centres or n['parent'] not in centres: continue
        (px, py), (cx, cy) = centres[n['parent']], centres[n['id']]
        x1, y1, x2, y2 = num(ln, 'x1'), num(ln, 'y1'), num(ln, 'x2'), num(ln, 'y2')
        length = math.hypot(cx - px, cy - py)

        def off(x, y): return abs((cx - px) * (y - py) - (cy - py) * (x - px)) / length
        t1 = ((x1 - px) * (cx - px) + (y1 - py) * (cy - py)) / length ** 2
        t2 = ((x2 - px) * (cx - px) + (y2 - py) * (cy - py)) / length ** 2
        if off(x1, y1) > 0.3 or off(x2, y2) > 0.3 or not (0 < t1 < t2 < 1): doc.err('SC_BRANCH_NOT_BETWEEN_NODES:' + n['id'])
        probs = [l for l in doc.label_role('branch-probability') if l.get('data-child') == n['id']]
        if has_p:
            if len(probs) != 1: doc.err('SC_BRANCH_PROBABILITY_COUNT:' + n['id']); continue
            try: read = tex_number(probs[0].get('data-tex'))
            except ValueError as e: doc.err(str(e)); continue
            if read != n['p']: doc.err('SC_BRANCH_PROBABILITY:' + n['id'])
            c = centre(probs[0])
            if math.hypot(c[0] - (x1 + x2) / 2, c[1] - (y1 + y2) / 2) > 60: doc.err('SC_BRANCH_PROBABILITY_PLACE:' + n['id'])
        elif probs: doc.err('SC_BRANCH_PROBABILITY_UNEXPECTED:' + n['id'])
    paths = {l.get('data-leaf'): l for l in doc.label_role('path-probability')}
    if chart.get('showPathProbability') is True:
        if not has_p: fail('STAT_TREE_PATH_NEEDS_PROBABILITIES')
        if set(paths) != {n['id'] for n in leaves}: doc.err('SC_PATH_SET')
        for n in leaves:
            if n['id'] not in paths: continue
            tex = re.sub(r'^\\displaystyle\s*', '', paths[n['id']].get('data-tex')).replace(' ', '')
            left, _, right = tex.partition('=')
            try:
                factors = [tex_number(f) for f in left.split('\\times')]
                total = tex_number(right)
            except ValueError as e: doc.err(str(e)); continue
            chain, cur = [], n
            while cur['parent'] is not None: chain.append(cur['p']); cur = by_id[cur['parent']]
            prod = Fraction(1)
            for f in factors: prod *= f
            if sorted(factors) != sorted(chain) or prod != total or total != n['path']: doc.err('SC_PATH_PROBABILITY:' + n['id'])
    elif paths: doc.err('SC_PATH_UNEXPECTED')
    return {'leaves': len(leaves), 'paths': {n['id']: str(n['path']) for n in leaves} if has_p else None}


AUDITS = {'HISTOGRAM': audit_freq, 'FREQUENCY_POLYGON': audit_freq, 'STEM_LEAF': audit_stem, 'BOX_PLOT': audit_box, 'SCATTER': audit_scatter, 'DICE_TABLE': audit_dice, 'TREE': audit_tree}


def audit(chart, svg):
    kind = chart.get('kind') if isinstance(chart, dict) else None
    if kind not in AUDITS: fail('STAT_KIND_UNSUPPORTED')
    doc = Doc(svg, kind)
    observed = AUDITS[kind](chart, doc)
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if doc.errors else 'PASS', 'errors': doc.errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(), 'observed': observed}
