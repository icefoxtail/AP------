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
FILL = {'bar': '#ececec', 'barHi': '#b5b5b5', 'barHi2': '#8e8e8e', 'cell': '#fff', 'cellHi': '#c9c9c9'}
UNKNOWN_BAR_FRACTION = 0.4        # this observer's own copy of how high a dotted unknown-class outline stands: this fraction of the plot (axis start to axis top)
SUM_FREE_TEXT = re.compile(r'^[0-9A-Za-z가-힣+=.%() -]{1,12}$')
SUM_PLAIN_NUMBER = re.compile(r'^\d{1,6}(?:\.\d{1,4})?$')
SUM_LEADING_NUMBER = re.compile(r'^(\d{1,6}(?:\.\d{1,4})?)(?=\D)')
UNKNOWN_LABEL = re.compile(r'^[A-Za-z0-9+\-= ()?]{1,10}$')


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


def title_lines(text):
    """The lines an axis title of a frequency chart is written in (this observer's own rule): up to 14 characters on one line; 15 to 28 characters break at the single space that
    leaves the two lines most alike (the first such space), each at most 14 characters; anything else cannot be drawn."""
    if not isinstance(text, str) or not 1 <= len(text) <= 28 or re.search(r'[\x00-\x1f<>&"\\]', text): fail('STAT_TITLE_INVALID')
    if len(text) <= 14: return [text]
    if text.startswith(' ') or text.endswith(' ') or '  ' in text: fail('STAT_TITLE_INVALID')
    best = None
    for i, ch in enumerate(text):
        if ch == ' ' and len(text[:i]) <= 14 and len(text[i + 1:]) <= 14:
            d = abs(len(text[:i]) - len(text[i + 1:]))
            if best is None or d < best[0]: best = (d, [text[:i], text[i + 1:]])
    if best is None: fail('STAT_TITLE_INVALID')
    return best[1]


def leaf_particle(digit):
    """The particle after a leaf digit in the key text, from the digit's Korean reading: a syllable with a final consonant (영 일 삼 육 칠 팔) takes 은, one without (이 사 오 구) takes 는."""
    reading = '영일이삼사오육칠팔구'[digit]
    return '은' if (ord(reading) - 0xAC00) % 28 else '는'


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

    def check_title_lines(self, label_id, expected, owner_axis):
        """A title of one line is label `label_id`; a longer one is `label_id` and `label_id-2`, one line each, nothing beyond."""
        lines = title_lines(expected)
        for j, line in enumerate(lines):
            self.check_title(label_id if j == 0 else '%s-%d' % (label_id, j + 1), line, owner_axis)
        for j in range(len(lines), 4):
            if any(l.get('id') == '%s-%d' % (label_id, j + 1) for l in self.labels): self.err('SC_TITLE_UNEXPECTED:%s-%d' % (label_id, j + 1))

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
        hidden_sum = None
        if 'frequencies' in s:
            freq = list(s['frequencies'])
            if len(freq) != n: fail('STAT_FREQUENCY_COUNT_MISMATCH')
            known = [f for f in freq if f is not None]  # a null frequency is a class the problem does not show
            if not known: fail('STAT_FREQUENCY_INVALID')
            given = s.get('total', chart.get('total') if i == 0 else None)
            if len(known) == n:
                total = sum(known)
                if given is not None and given != total: fail('STAT_FREQUENCY_TOTAL_MISMATCH')
            else:
                total = given
                if total is not None and (not isinstance(total, int) or total < sum(known)): fail('STAT_FREQUENCY_TOTAL_MISMATCH')
            if y_kind == 'FREQUENCY':
                values = [None if f is None else Fraction(f) for f in freq]
                if total is not None and len(known) < n: hidden_sum = Fraction(total - sum(known))
            else:
                if total is None: fail('STAT_UNKNOWN_NEEDS_TOTAL')
                values = [None if f is None else Fraction(f, total) for f in freq]
                if len(known) < n: hidden_sum = Fraction(total - sum(known), total)
        else:
            values = [None if x is None else frac(x, 'SC_PLAN_INVALID') for x in s['relativeFrequencies']]
            known = [v for v in values if v is not None]
            if not known: fail('STAT_FREQUENCY_INVALID')
            if len(known) == n:
                if sum(known) != 1: fail('STAT_RELATIVE_SUM_NOT_ONE')
            else:
                if sum(known) > 1: fail('STAT_RELATIVE_SUM_NOT_ONE')
                hidden_sum = 1 - sum(known)  # relative frequencies add up to 1: the hidden classes hold what is left
        series.append({'name': s.get('name'), 'values': values, 'hidden_sum': hidden_sum})
    mids = [(b[i] + b[i + 1]) / 2 for i in range(n)]
    polygon = kind == 'FREQUENCY_POLYGON' or chart.get('polygon') is True
    for s in series:
        s['vertices'] = [(mids[0] - width, Fraction(0))] + [None if v is None else (m, v) for m, v in zip(mids, s['values'])] + [(mids[-1] + width, Fraction(0))]
    return b, width, mids, series, polygon, y_kind


def sum_runs(e, n):
    """The runs of classes one classSums entry covers, read from the plan alone: from..to is one run; classes is a list of class numbers or of [from, to] pairs, ascending, adjacent runs merged."""
    def whole(v):
        if isinstance(v, bool) or not isinstance(v, int) or not 0 <= v < n: fail('STAT_CLASS_SUM_INVALID')
        return v
    if 'classes' not in e:
        lo, hi = whole(e.get('from')), whole(e.get('to'))
        if hi < lo: fail('STAT_CLASS_SUM_INVALID')
        return [(lo, hi)]
    raw = e['classes']
    if 'from' in e or 'to' in e or not isinstance(raw, list) or not 2 <= len(raw) <= 24: fail('STAT_CLASS_SUM_INVALID')
    if all(isinstance(x, list) for x in raw):
        pairs = []
        for x in raw:
            if len(x) != 2: fail('STAT_CLASS_SUM_INVALID')
            pairs.append((whole(x[0]), whole(x[1])))
    else: pairs = [(whole(v), whole(v)) for v in raw]
    runs = []
    for a, b in pairs:
        if b < a or (runs and a <= runs[-1][1]): fail('STAT_CLASS_SUM_INVALID')
        if runs and a == runs[-1][1] + 1: runs[-1] = (runs[-1][0], b)
        else: runs.append((a, b))
    return runs


def runs_of(m):
    """The runs of one derived class sum: its own `runs` (a group) or the single run from..to."""
    return m.get('runs') or [(m['from'], m['to'])]


def derive_marks(chart, series, polygon):
    """Everything the plan marks on a frequency chart, re-derived from the plan alone: the emphasis tone of each class, the polygon points that carry a mark, the
    restored bars, the classes whose value stays unwritten and the class sums (a numeric label must equal the exact sum; hidden classes count only through the stated total)."""
    kind = chart['kind']
    tones = {}
    for e in chart.get('highlightClasses') or []:
        ks = ([e['class']] if 'class' in e else list(e['classes'])) if isinstance(e, dict) else [e]
        for k in ks: tones[k] = e.get('tone', 1) if isinstance(e, dict) else 1
    if any(sr['values'][k] is None for k in tones for sr in series): fail('STAT_HIGHLIGHT_UNKNOWN_CLASS')  # a hidden class has no bar or point to mark
    marks = {}
    if kind == 'FREQUENCY_POLYGON':
        for k, t in tones.items():
            for s in range(len(series)): marks[(s, k)] = {'tone': t, 'show': False}
    for e in chart.get('highlightPoints') or []:
        marks[(e.get('series', 0), e['class'])] = {'tone': e.get('tone', 1), 'show': e.get('showValue') is True}
    for (s, k) in marks:
        if series[s]['values'][k] is None: fail('STAT_HIGHLIGHT_UNKNOWN_CLASS')
    restored = set(chart.get('restoredClasses') or [])
    hide = set(chart.get('hideValues') or [])
    sums = []
    for e in chart.get('classSums') or []:
        s = e.get('series', 0)
        sr = series[s]
        runs = sum_runs(e, len(series[0]['values']))
        lo, hi = runs[0][0], runs[-1][1]
        members = [k for a, b in runs for k in range(a, b + 1)]
        inside = [sr['values'][k] for k in members]
        hidden = [v for v in inside if v is None]
        known = sum((v for v in inside if v is not None), Fraction(0))
        label = e.get('label')
        if label is not None: label = str(label)
        free = False
        if label == '?':
            if not hidden: fail('STAT_CLASS_SUM_LABEL_INVALID')
        elif label is not None:
            # a plain number is the exact sum; any other text (6명, 합계) is a stated fact: checked only where the sum is derivable, and only through the number it starts with
            free = SUM_PLAIN_NUMBER.fullmatch(label) is None
            if free and (not SUM_FREE_TEXT.fullmatch(label) or label != label.strip() or e.get('unit') is not None): fail('STAT_CLASS_SUM_LABEL_INVALID')
            total, derivable = known, True
            if hidden:
                all_hidden = [k for k, v in enumerate(sr['values']) if v is None]
                derivable = not (sr['hidden_sum'] is None or any(k not in members for k in all_hidden))
                if derivable: total = known + sr['hidden_sum']
            if not free and not derivable: fail('STAT_CLASS_SUM_UNKNOWN')
            lead = SUM_LEADING_NUMBER.match(label) if free else None
            number = label if not free else (lead.group(1) if lead else None)
            if number is not None and derivable and frac(number, 'STAT_CLASS_SUM_LABEL_INVALID') != total: fail('STAT_CLASS_SUM_LABEL_MISMATCH')
        sums.append({'series': s, 'from': lo, 'to': hi, 'label': label, 'unit': e.get('unit', ''), **({'free': True} if free else {}), **({'runs': runs} if len(runs) > 1 else {})})
    for i, m in enumerate(sums):
        if any(o['series'] == m['series'] and {k for a, b in runs_of(o) for k in range(a, b + 1)} & {k for a, b in runs_of(m) for k in range(a, b + 1)} for o in sums[:i]): fail('STAT_CLASS_SUM_OVERLAP')
    return tones, marks, restored, hide, sums


def box_distance(box, point):
    x, y, w, h = box
    return math.hypot(max(x - point[0], 0, point[0] - x - w), max(y - point[1], 0, point[1] - y - h))


def segment_hits_box(a, c, box):
    x, y, w, h = box
    t0, t1 = 0.0, 1.0
    dx, dy = c[0] - a[0], c[1] - a[1]
    for p, q in ((-dx, a[0] - x), (dx, x + w - a[0]), (-dy, a[1] - y), (dy, y + h - a[1])):
        if p == 0:
            if q < 0: return False
            continue
        t = q / p
        if p < 0:
            if t > t1: return False
            t0 = max(t0, t)
        else:
            if t < t0: return False
            t1 = min(t1, t)
    return True


def segment_box_distance(a, c, box):
    """The exact distance between a segment and an axis-aligned box (0 when they meet)."""
    if segment_hits_box(a, c, box): return 0.0
    x, y, w, h = box
    best = min(box_distance(box, a), box_distance(box, c))
    dx, dy = c[0] - a[0], c[1] - a[1]
    length2 = dx * dx + dy * dy
    for p in ((x, y), (x + w, y), (x + w, y + h), (x, y + h)):
        t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length2)) if length2 else 0.0
        best = min(best, math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy)))
    return best


def drawn_obstacles(doc):
    """Every line, polyline, arrow head, dot, ring and bar edge of the final SVG with its half stroke width: what a label must stay clear of (grid lines are cut around labels)."""
    def pad(e):
        if (e.get('stroke') or 'none') == 'none': return 0.0
        try: return float(e.get('stroke-width') or 0) / 2
        except ValueError: return 0.0
    out = []
    for e in doc.lines:
        if e.get('data-role') == 'grid': continue
        out.append(('segs', [((num(e, 'x1'), num(e, 'y1')), (num(e, 'x2'), num(e, 'y2')))], pad(e)))
    for tag in ('polyline', 'polygon'):
        for e in doc.root.iter(NS + tag):
            pts = [tuple(float(v) for v in pair.split(',')) for pair in (e.get('points') or '').split()]
            if tag == 'polygon': pts = pts + pts[:1]
            out.append(('segs', list(zip(pts, pts[1:])), pad(e)))
    for e in doc.circles: out.append(('circle', (num(e, 'cx'), num(e, 'cy'), num(e, 'r')), pad(e)))
    for e in doc.role('rect', 'bar'):
        x, y, w, h = num(e, 'x'), num(e, 'y'), num(e, 'width'), num(e, 'height')
        c = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
        out.append(('segs', list(zip(c, c[1:] + c[:1])), pad(e)))
    return out


def clearance(box, obstacles):
    best = math.inf
    for kind, shape, pad in obstacles:
        if kind == 'circle': best = min(best, box_distance(box, shape[:2]) - shape[2] - pad)
        else:
            for a, c in shape: best = min(best, segment_box_distance(a, c, box) - pad)
    return best


def audit_freq(chart, doc):
    b, width, mids, series, polygon, y_kind = derive_freq(chart)
    tones, marks, restored, hide, sums = derive_marks(chart, series, polygon)
    n = len(b) - 1
    kind = chart['kind']
    # unknownLabels: a hidden class of a histogram carries a symbol in a dotted outline (never a bar), re-read from the plan
    unknown = {}
    unknown_rel = {}       # relHeight (opt-in): the outline heights stand in this ratio, the highest keeping UNKNOWN_BAR_FRACTION of the plot; an entry without one counts as 1 once any entry has one
    for e in chart.get('unknownLabels') or []:
        k = e.get('class')
        if kind != 'HISTOGRAM' or polygon: fail('STAT_UNKNOWN_LABEL_UNSUPPORTED')
        if isinstance(k, bool) or not isinstance(k, int) or not 0 <= k < n or k in unknown: fail('STAT_UNKNOWN_LABEL_INVALID')
        if series[0]['values'][k] is not None: fail('STAT_UNKNOWN_LABEL_CLASS_KNOWN')
        if not isinstance(e.get('label'), str) or not UNKNOWN_LABEL.fullmatch(e['label']) or e['label'] != e['label'].strip(): fail('STAT_UNKNOWN_LABEL_INVALID')
        unknown[k] = e['label']
        if 'relHeight' in e: unknown_rel[k] = frac(e['relHeight'], 'STAT_UNKNOWN_LABEL_INVALID')
    show_ends = chart.get('showEndValues') is True
    if show_ends and (not polygon or len(series) != 1): fail('STAT_SHOW_END_VALUES_UNSUPPORTED')
    fx, _, xvals = doc.axis_map('x-tick', 'x')
    fy, _, yvals = doc.axis_map('y-tick', 'y')
    if set(xvals) != set(b): doc.err('SC_X_TICKS_NOT_BOUNDARIES')
    top = max(v for s in series for v in s['values'] if v is not None)
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
        values = series[0]['values']
        shown_classes = {i for i, v in enumerate(values) if v is not None}  # a hidden class has no bar
        if len(bars) != len(shown_classes): doc.err('SC_BAR_COUNT')
        for bar in bars:
            i = int(bar.get('data-class', -1))
            if i not in shown_classes: doc.err('SC_BAR_INDEX' if not 0 <= i < n else 'SC_BAR_HIDDEN_CLASS:%d' % i); continue
            x0, x1 = fx(b[i]), fx(b[i + 1])
            top_y = fy(values[i])
            if abs(num(bar, 'x') - x0) > TOL or abs(num(bar, 'x') + num(bar, 'width') - x1) > TOL: doc.err('SC_BAR_X_RANGE:%d' % i)
            if abs(num(bar, 'y') - top_y) > TOL or abs(num(bar, 'y') + num(bar, 'height') - base) > TOL: doc.err('SC_BAR_HEIGHT:%d' % i)
            tone = tones.get(i, 0)
            want = ['bar', 'barHi', 'barHi2'][tone]
            if (bar.get('fill') or '').lower() != FILL[want] or bar.get('data-highlight') != str(tone): doc.err('SC_BAR_HIGHLIGHT:%d' % i)
            dashed = bar.get('stroke-dasharray') is not None
            if dashed != (i in restored) or (bar.get('data-restored') == '1') != (i in restored): doc.err('SC_BAR_RESTORED:%d' % i)
        if {int(bar.get('data-class', -1)) for bar in bars} != shown_classes: doc.err('SC_BAR_CLASSES')
    if kind == 'HISTOGRAM' or unknown:
        # the dotted outlines: exactly the planned classes, on their own x range, standing on the axis, UNKNOWN_BAR_FRACTION of the plot high, dotted and unfilled, each with its symbol centred inside
        outlines = {}
        for r in doc.role('rect', 'bar-unknown'):
            key = int(r.get('data-class', -1))
            if key in outlines: doc.err('SC_UNKNOWN_DUPLICATE:%d' % key)
            outlines[key] = r
        if set(outlines) != set(unknown): doc.err('SC_UNKNOWN_SET_MISMATCH')
        plot_height = base - fy(max(yvals))
        if unknown_rel:
            if any(v < Fraction(1, 20) or v > 20 for v in unknown_rel.values()): fail('STAT_UNKNOWN_LABEL_INVALID')
            rel = {k: unknown_rel.get(k, Fraction(1)) for k in unknown}
            top_rel = max(rel.values())
        for k, r in outlines.items():
            if k not in unknown: continue
            if abs(num(r, 'x') - fx(b[k])) > TOL or abs(num(r, 'x') + num(r, 'width') - fx(b[k + 1])) > TOL: doc.err('SC_UNKNOWN_X_RANGE:%d' % k)
            if abs(num(r, 'y') + num(r, 'height') - base) > TOL or abs(num(r, 'height') - UNKNOWN_BAR_FRACTION * plot_height * (float(rel[k] / top_rel) if unknown_rel else 1.0)) > TOL: doc.err('SC_UNKNOWN_HEIGHT:%d' % k)
            if r.get('stroke-dasharray') is None or (r.get('fill') or 'none') != 'none' or (r.get('stroke') or '') != '#111': doc.err('SC_UNKNOWN_STYLE:%d' % k)
            mine = [l for l in doc.owners.get(r.get('id'), []) if l.get('data-label-role') == 'unknown-label']
            if len(mine) != 1: doc.err('SC_UNKNOWN_LABEL_COUNT:%d' % k); continue
            label = mine[0]
            if re.sub(r'^\\displaystyle\s*', '', label.get('data-tex') or '').replace(' ', '') != unknown[k].replace(' ', '') or label.get('data-class') != str(k): doc.err('SC_UNKNOWN_LABEL_VALUE:%d' % k)
            lx, ly = centre(label)
            bx, by, bw, bh = box_of(label)
            if abs(lx - (num(r, 'x') + num(r, 'width') / 2)) > LABEL_TOL or abs(ly - (num(r, 'y') + num(r, 'height') / 2)) > LABEL_TOL: doc.err('SC_UNKNOWN_LABEL_NOT_CENTRED:%d' % k)
            if bx < num(r, 'x') or bx + bw > num(r, 'x') + num(r, 'width') or by < num(r, 'y') or by + bh > num(r, 'y') + num(r, 'height'): doc.err('SC_UNKNOWN_LABEL_OUTSIDE:%d' % k)
        if len(doc.label_role('unknown-label')) != len(unknown): doc.err('SC_UNKNOWN_LABEL_COUNT')
    polylines = doc.role('polyline', 'polygon')
    vertices = [e for e in doc.circles if e.get('data-vertex') is not None]
    if not polygon:
        if polylines or vertices: doc.err('SC_UNEXPECTED_POLYGON')
    else:
        for s, serie in enumerate(series):
            want = [None if v is None else (fx(v[0]), fy(v[1])) for v in serie['vertices']]
            dots = {}
            for d in vertices:
                if d.get('data-series') == str(s): dots[int(d.get('data-vertex'))] = d
            if set(dots) != {k for k, w in enumerate(want) if w is not None}: doc.err('SC_POLYGON_VERTEX_COUNT:%d' % s)
            for k, d in dots.items():
                if k < len(want) and want[k] is not None and (abs(num(d, 'cx') - want[k][0]) > TOL or abs(num(d, 'cy') - want[k][1]) > TOL): doc.err('SC_POLYGON_DOT:%d:%d' % (s, k))
            if 0 in dots and abs(num(dots[0], 'cy') - base) > TOL or n + 1 in dots and abs(num(dots[n + 1], 'cy') - base) > TOL: doc.err('SC_POLYGON_ENDS_NOT_ZERO:%d' % s)
            # a hidden class breaks the polygon: one polyline per run of consecutive known vertices (a lone vertex is only its dot)
            runs, run = [], []
            for k, w in enumerate(want + [None]):
                if w is not None: run.append((k, w))
                else:
                    if len(run) >= 2: runs.append(run)
                    run = []
            lines = [p for p in polylines if p.get('data-series') == str(s)]
            if len(lines) != len(runs): doc.err('SC_POLYGON_COUNT:%d' % s); continue
            drawn = []
            for line in lines:
                try: drawn.append([tuple(float(v) for v in pair.split(',')) for pair in line.get('points').split()])
                except ValueError: doc.err('SC_POLYGON_POINTS_UNREADABLE'); drawn.append([])
                if (line.get('stroke-dasharray') is not None) != (s == 1): doc.err('SC_POLYGON_STYLE:%d' % s)
            drawn.sort(key=lambda pts: pts[0][0] if pts else 0)
            for pts, run in zip(drawn, sorted(runs, key=lambda r: r[0][1][0])):
                if len(pts) != len(run): doc.err('SC_POLYGON_VERTEX_COUNT:%d' % s); continue
                for (px, py), (k, (wx, wy)) in zip(pts, run):
                    if abs(px - wx) > TOL or abs(py - wy) > TOL: doc.err('SC_POLYGON_VERTEX:%d:%d' % (s, k))
    # marked polygon points: a ring or a solid dot on exactly the planned vertices
    drawn_marks = {}
    for e in doc.role('circle', 'point-mark'):
        key = (int(e.get('data-series', -1)), int(e.get('data-class', -1)))
        if key in drawn_marks: doc.err('SC_MARK_DUPLICATE:%d:%d' % key)
        drawn_marks[key] = e
    if set(drawn_marks) != set(marks): doc.err('SC_MARK_SET_MISMATCH')
    for (s, k), e in drawn_marks.items():
        if (s, k) not in marks: continue
        spec = marks[(s, k)]
        v = series[s]['values'][k]
        if abs(num(e, 'cx') - fx(mids[k])) > TOL or abs(num(e, 'cy') - fy(v)) > TOL: doc.err('SC_MARK_NOT_ON_POINT:%d:%d' % (s, k))
        ring = (e.get('fill') or 'none') == 'none'
        if e.get('data-tone') != str(spec['tone']) or ring != (spec['tone'] == 1) or not 5 <= num(e, 'r') <= 12: doc.err('SC_MARK_STYLE:%d:%d' % (s, k))
    # value labels: the plan's own list of labelled points, each with the right number, tied to its owner, near its point and clear of every drawn line
    wanted = set()
    if chart.get('showValues') is True:
        for i, v in enumerate(series[0]['values']):
            if v is None or v == 0 or (i in restored and chart.get('showRestoredValues') is not True) or i in hide: continue
            wanted.add((0, i))
    wanted |= {key for key, spec in marks.items() if spec['show']}
    shown = {}
    for l in doc.label_role('value'):
        key = (int(l.get('data-series', 0)), int(l.get('data-class', -1)))
        if key in shown: doc.err('SC_VALUE_LABEL_DUPLICATE:%d' % key[1])
        shown[key] = l
    obstacles = drawn_obstacles(doc) if shown else []
    for key in sorted(wanted):
        s, i = key
        label = shown.get(key)
        if label is None: doc.err('SC_VALUE_LABEL_MISSING:%d' % i); continue
        v = series[s]['values'][i]
        try: read = tex_number(label.get('data-tex'))
        except ValueError as e: doc.err(str(e)); continue
        if read != v: doc.err('SC_VALUE_LABEL_VALUE:%d' % i)
        ax, ay = fx(mids[i]), fy(v)
        owner = doc.by_id.get(label.get('data-owner'))
        if owner is None or (owner.get('data-vertex') is not None and (int(owner.get('data-series', -1)), int(owner.get('data-vertex')) - 1) != key) or (owner.get('data-role') == 'bar' and (s, int(owner.get('data-class', -1))) != key):
            doc.err('SC_VALUE_LABEL_OWNER:%d' % i)
        cx, cy = centre(label)
        box = box_of(label)
        if not polygon:
            if abs(cx - ax) > LABEL_TOL: doc.err('SC_VALUE_LABEL_NOT_CENTRED:%d' % i)
            if cy > ay: doc.err('SC_VALUE_LABEL_NOT_ABOVE:%d' % i)
        elif math.hypot(cx - ax, cy - ay) > 70 or box_distance(box, (ax, ay)) < 1: doc.err('SC_VALUE_LABEL_FAR_FROM_POINT:%d' % i)
        if clearance(box, obstacles) <= 0: doc.err('SC_VALUE_LABEL_TOUCHES_LINE:%d' % i)
        for other in doc.labels:
            if other is label or other.get('data-label-role') == 'value' and other.get('id') < label.get('id'): continue  # two value labels are compared once
            ox, oy, ow, oh = box_of(other)
            if box[0] < ox + ow and ox < box[0] + box[2] and box[1] < oy + oh and oy < box[1] + box[3]: doc.err('SC_VALUE_LABEL_OVERLAP:%d' % i)
    for key in shown:
        if key not in wanted: doc.err('SC_VALUE_LABELS_UNEXPECTED' if not wanted else 'SC_VALUE_LABEL_UNEXPECTED:%d' % key[1])
    # showEndValues: the polygon's two zero end points write their 0, near the point, clear of every line and of every other label
    ends = doc.label_role('end-value')
    if show_ends:
        end_obstacles = drawn_obstacles(doc)
        if sorted(int(l.get('data-vertex', -1)) for l in ends) != [0, n + 1]: doc.err('SC_END_VALUE_SET_MISMATCH')
        for label in ends:
            k = int(label.get('data-vertex', -1))
            if k not in (0, n + 1): continue
            if label.get('data-owner') != 'vertex-s0-%d' % k: doc.err('SC_END_VALUE_OWNER:%d' % k)
            try:
                if tex_number(label.get('data-tex')) != 0: doc.err('SC_END_VALUE_VALUE:%d' % k)
            except ValueError as e: doc.err(str(e)); continue
            ax, ay = fx(series[0]['vertices'][k][0]), fy(series[0]['vertices'][k][1])
            cx, cy = centre(label)
            box = box_of(label)
            if math.hypot(cx - ax, cy - ay) > 70 or box_distance(box, (ax, ay)) < 1: doc.err('SC_END_VALUE_FAR_FROM_POINT:%d' % k)
            if clearance(box, end_obstacles) <= 0: doc.err('SC_END_VALUE_TOUCHES_LINE:%d' % k)
            for other in doc.labels:
                if other is label: continue
                ox, oy, ow, oh = box_of(other)
                if box[0] < ox + ow and ox < box[0] + box[2] and box[1] < oy + oh and oy < box[1] + box[3]: doc.err('SC_END_VALUE_OVERLAP:%d' % k)
    elif ends: doc.err('SC_END_VALUES_UNEXPECTED')
    # class sums: a bracket under the x tick labels from the left edge of class `from` to the right edge of class `to`, its sum written beneath; a group of runs (classes) has one
    # bracket per run, a stem from each down to one joining line, and its sum written under the middle of that line
    brackets = doc.role('polyline', 'class-sum')
    key_of = lambda e: (int(e.get('data-series', -1)), int(e.get('data-from', -1)), int(e.get('data-to', -1)))
    if sorted(key_of(e) for e in brackets) != sorted((m['series'], a, b) for m in sums for a, b in runs_of(m)): doc.err('SC_CLASS_SUM_SET_MISMATCH')
    tick_bottom = max((box_of(l)[1] + box_of(l)[3] for l in doc.label_role('x-tick')), default=base)

    def sum_label(m, owner, middle, floor, tag):
        texts = [l for l in doc.owners.get(owner.get('id'), []) if l.get('data-label-role') == 'class-sum']
        if m['label'] is None:
            if texts: doc.err('SC_CLASS_SUM_LABEL_UNEXPECTED:' + tag)
        elif len(texts) != 1: doc.err('SC_CLASS_SUM_LABEL_COUNT:' + tag)
        else:
            text = texts[0].get('data-text') or ''
            if m.get('free'):
                if text != m['label'] + m['unit']: doc.err('SC_CLASS_SUM_LABEL_VALUE:' + tag)       # a stated fact: written exactly as the plan gives it
            else:
                read = re.fullmatch(r'(\?|\d+(?:\.\d+)?)(.*)', text)
                if read is None or read.group(2) != m['unit'] or read.group(1) != m['label'] and (read.group(1) == '?' or m['label'] == '?' or Fraction(read.group(1)) != Fraction(m['label'])): doc.err('SC_CLASS_SUM_LABEL_VALUE:' + tag)
            lx, _ = centre(texts[0])
            if abs(lx - middle) > LABEL_TOL: doc.err('SC_CLASS_SUM_LABEL_NOT_CENTRED:' + tag)
            if box_of(texts[0])[1] < floor: doc.err('SC_CLASS_SUM_LABEL_NOT_BELOW:' + tag)

    run_geometry = {}      # (series, from, to) -> (xl, xr, yb) as drawn
    for e in brackets:
        owner = [m for m in sums if key_of(e) in [(m['series'], a, b) for a, b in runs_of(m)]]
        if len(owner) != 1: continue
        m = owner[0]
        tag = '%d-%d-%d' % key_of(e)
        try: pts = [tuple(float(v) for v in pair.split(',')) for pair in e.get('points').split()]
        except Exception: doc.err('SC_CLASS_SUM_POINTS:' + tag); continue
        if len(pts) != 4 or abs(pts[0][0] - pts[1][0]) > TOL or abs(pts[2][0] - pts[3][0]) > TOL or abs(pts[1][1] - pts[2][1]) > TOL or abs(pts[0][1] - pts[3][1]) > TOL or not pts[1][1] > pts[0][1]:
            doc.err('SC_CLASS_SUM_SHAPE:' + tag); continue
        xl, xr, yb = pts[0][0], pts[3][0], pts[1][1]
        _, lo, hi = key_of(e)
        run_geometry[key_of(e)] = (xl, xr, yb)
        # the left end lies in the left half of class `from` and the right end in the right half of class `to`: it spans exactly those classes
        if not fx(b[lo]) - TOL <= xl < fx(mids[lo]) or not fx(mids[hi]) < xr <= fx(b[hi + 1]) + TOL: doc.err('SC_CLASS_SUM_SPAN:' + tag)
        if pts[0][1] < tick_bottom + 1 or yb <= base: doc.err('SC_CLASS_SUM_NOT_BELOW:' + tag)
        if (e.get('stroke-dasharray') is not None) != (m['series'] == 1): doc.err('SC_CLASS_SUM_STYLE:' + tag)
        if len(runs_of(m)) == 1: sum_label(m, e, (xl + xr) / 2, yb, tag)
    joins = doc.role('polyline', 'class-sum-join')
    group_sums = [m for m in sums if len(runs_of(m)) > 1]
    if sorted(key_of(e) for e in joins) != sorted((m['series'], m['from'], m['to']) for m in group_sums): doc.err('SC_CLASS_SUM_JOIN_SET')
    stems = doc.role('line', 'class-sum-stem')
    for m in group_sums:
        found = [e for e in joins if key_of(e) == (m['series'], m['from'], m['to'])]
        if len(found) != 1: continue
        join = found[0]
        tag = 'group-%d-%d-%d' % key_of(join)
        geometry = [run_geometry.get((m['series'], a, b)) for a, b in runs_of(m)]
        if any(g is None for g in geometry): continue
        try: pts = [tuple(float(v) for v in pair.split(',')) for pair in join.get('points').split()]
        except Exception: doc.err('SC_CLASS_SUM_POINTS:' + tag); continue
        yb = geometry[0][2]
        centres_x = [(g[0] + g[1]) / 2 for g in geometry]
        if any(abs(g[2] - yb) > TOL for g in geometry): doc.err('SC_CLASS_SUM_GROUP_ROW:' + tag)
        if len(pts) != 4 or not 4 <= pts[1][1] - yb <= 40 or abs(pts[0][0] - centres_x[0]) > TOL or abs(pts[0][1] - yb) > TOL or abs(pts[1][0] - centres_x[0]) > TOL \
                or abs(pts[2][0] - centres_x[-1]) > TOL or abs(pts[2][1] - pts[1][1]) > TOL or abs(pts[3][0] - centres_x[-1]) > TOL or abs(pts[3][1] - yb) > TOL:
            doc.err('SC_CLASS_SUM_JOIN_SHAPE:' + tag); continue
        if (join.get('stroke-dasharray') is not None) != (m['series'] == 1): doc.err('SC_CLASS_SUM_STYLE:' + tag)
        mine = [e for e in stems if e.get('data-group') == join.get('data-group')]
        want_stems = centres_x[1:-1]
        if len(mine) != len(want_stems) or sorted(round(num(e, 'x1'), 1) for e in mine) != sorted(round(x, 1) for x in want_stems) \
                or any(abs(num(e, 'x1') - num(e, 'x2')) > TOL or abs(num(e, 'y1') - yb) > TOL or abs(num(e, 'y2') - pts[1][1]) > TOL for e in mine): doc.err('SC_CLASS_SUM_STEMS:' + tag)
        sum_label(m, join, (centres_x[0] + centres_x[-1]) / 2, pts[1][1], tag)
    doc.check_title_lines('x-title', chart.get('xTitle', '계급'), 'x')
    doc.check_title_lines('y-title', chart.get('yTitle', '도수(명)' if y_kind == 'FREQUENCY' else '상대도수'), 'y')
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
    observed = {'classes': n, 'yKind': y_kind, 'polygon': polygon, 'totals': [sum(v for v in s['values'] if v is not None) for s in series].__repr__()}
    if any(None in s['values'] for s in series): observed['hidden'] = [[k for k, v in enumerate(s['values']) if v is None] for s in series]
    if marks: observed['marks'] = sorted([s, k, spec['tone']] for (s, k), spec in marks.items())
    if sums: observed['sums'] = [[m['series'], m['from'], m['to'], m['label']] + ([[list(r) for r in m['runs']]] if m.get('runs') else []) for m in sums]
    if unknown: observed['unknown'] = sorted([k, v] for k, v in unknown.items())
    return observed


def stem_plan(chart):
    """The plan's own leaves, re-derived without the producer: per group the rows (stem -> leaves in ascending order; a letter leaf, a str, stands where the plan
    puts it, 1-based among that stem's leaves) and `ordered`, every leaf of the group in rank order (an int is the full value, a str is a letter leaf)."""
    raw = [{'values': chart['values']}] if 'values' in chart else chart['groups']
    groups, letters = [], []
    for g in raw:
        numbers, symbols = [], []
        for v in g['values']:
            if isinstance(v, dict):
                symbols.append((v['symbol'], v['stem'], v['order']))
                letters.append(v['symbol'])
            else: numbers.append(v)
        groups.append({'name': g.get('name'), 'numbers': sorted(numbers), 'symbols': symbols})
    if len(set(letters)) != len(letters): fail('STAT_STEM_SYMBOL_DUPLICATE')
    stem_ids = [v // 10 for g in groups for v in g['numbers']] + [st for g in groups for _, st, _ in g['symbols']]
    stems = list(range(min(stem_ids), max(stem_ids) + 1))
    for g in groups:
        g['rows'] = {}
        for s in stems:
            row = [v % 10 for v in g['numbers'] if v // 10 == s]
            placed = sorted((o, sym) for sym, st, o in g['symbols'] if st == s)
            for k, (o, sym) in enumerate(placed):
                if (k and placed[k - 1][0] == o) or o - 1 > len(row): fail('STAT_STEM_SYMBOL_ORDER_CONFLICT')
                row.insert(o - 1, sym)
            g['rows'][s] = row
        g['ordered'] = [s * 10 + leaf if isinstance(leaf, int) else leaf for s in stems for leaf in g['rows'][s]]
    return groups, stems


def class_plan(chart, groups):
    """Each class group of the plan: (group, from, to, stem, leaf places inside [from, to) of that stem's row, count). A letter leaf counts only when the whole-number
    leaves on either side of it settle which side of the class edge it is on; otherwise the plan is refused (the figure would state a frequency nobody knows)."""
    out = []
    for cl in chart.get('classGroups') or []:
        gi = cl.get('group', 0)
        frm, to = int(cl['from']), int(cl['to'])
        stem = frm // 10
        if to <= frm or (to - 1) // 10 != stem: fail('STAT_STEM_CLASS_UNSUPPORTED')
        row = groups[gi]['rows'].get(stem)
        if row is None: fail('STAT_STEM_CLASS_EMPTY')
        clo, chi = frm - 10 * stem, to - 10 * stem
        inside = []
        for j, leaf in enumerate(row):
            if isinstance(leaf, int): hit = clo <= leaf < chi
            else:
                left = [v for v in row[:j] if isinstance(v, int)]
                right = [v for v in row[j + 1:] if isinstance(v, int)]
                low, high = (left[-1] if left else 0), (right[0] if right else 9)
                if low >= clo and high < chi: hit = True
                elif high < clo or low >= chi: hit = False
                else: fail('STAT_STEM_CLASS_UNDETERMINED')
            if hit: inside.append(j)
        if not inside: fail('STAT_STEM_CLASS_EMPTY')
        if inside[-1] - inside[0] + 1 != len(inside): fail('STAT_STEM_CLASS_UNDETERMINED')
        if any(o[0] == gi and o[1] < to and frm < o[2] for o in out): fail('STAT_STEM_CLASS_OVERLAP')
        label = cl.get('label')
        if label is not None and str(label) != str(len(inside)): fail('STAT_STEM_CLASS_COUNT_MISMATCH')
        out.append((gi, frm, to, stem, inside, len(inside), label is not None))
    return out


def read_leaf(label):
    """A drawn leaf read back from its own TeX: an int (the ones digit) or a str (a letter leaf)."""
    tex = re.sub(r'^\\displaystyle\s*', '', label.get('data-tex') or '').replace(' ', '')
    if re.fullmatch(r'[a-z]', tex): return tex
    return int(tex_number(tex))


def audit_stem(chart, doc):
    groups, stems = stem_plan(chart)
    total = sum(len(g['ordered']) for g in groups)
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
    if len(leaves) != total: doc.err('SC_LEAF_COUNT_MISMATCH')
    stem_x = sum(c[0] for c in stem_y.values()) / max(len(stem_y), 1)
    for gi, g in enumerate(groups):
        for s in stems:
            want = g['rows'][s]
            mine = sorted([l for l in leaves if l.get('data-group') == str(gi) and l.get('data-stem') == str(s)], key=lambda l: int(l.get('data-index')))
            read = []
            for l in mine:
                try: leaf = read_leaf(l)
                except ValueError as e: doc.err(str(e)); continue
                read.append(leaf)
                if isinstance(leaf, str):
                    # a letter leaf carries its letter and no value
                    if l.get('data-symbol') != leaf or l.get('data-value') is not None: doc.err('SC_LEAF_SYMBOL_ATTRIBUTE:%d' % s)
                elif l.get('data-value') != str(s * 10 + leaf) or l.get('data-symbol') is not None: doc.err('SC_LEAF_VALUE_ATTRIBUTE:%d' % s)
            if read != want: doc.err('SC_LEAVES_MISMATCH:g%d:%d' % (gi, s))
            xs = [centre(l)[0] for l in mine]
            if (gi == 0 and not two and xs != sorted(xs)) or (gi == 0 and two and xs != sorted(xs, reverse=True)) or (gi == 1 and xs != sorted(xs)): doc.err('SC_LEAF_ORDER:g%d:%d' % (gi, s))
            if two and ((gi == 0 and any(x >= stem_x for x in xs)) or (gi == 1 and any(x <= stem_x for x in xs))): doc.err('SC_LEAF_SIDE:g%d' % gi)
            if not two and any(x <= stem_x for x in xs): doc.err('SC_LEAF_SIDE:g%d' % gi)
            for k, l in enumerate(mine):
                if s in stem_y and abs(centre(l)[1] - stem_y[s][1]) > LABEL_TOL: doc.err('SC_LEAF_NOT_ON_STEM_ROW:%d' % s)
    # marks: the rank-th smallest leaf of the group is circled (a rank counts the letter leaves too)
    marks = []
    for m in chart.get('marks') or []:
        gi = m.get('group', 0)
        n = len(groups[gi]['ordered'])
        if m.get('median') is True: ranks = [(n + 1) // 2] if n % 2 else [n // 2, n // 2 + 1]
        elif 'rank' in m: ranks = [m['rank']]
        else: ranks = m['ranks']
        marks += [(gi, r) for r in ranks]
    drawn = doc.role('ellipse', 'mark')
    if sorted((int(e.get('data-group')), int(e.get('data-rank'))) for e in drawn) != sorted(marks): doc.err('SC_MARK_SET_MISMATCH')
    stem_rows = sorted((c[1], s) for s, c in stem_y.items())

    def row_of(label):
        y = centre(label)[1]
        return min(range(len(stem_rows)), key=lambda k: abs(stem_rows[k][0] - y)) if stem_rows else 0

    for e in drawn:
        gi, rank = int(e.get('data-group')), int(e.get('data-rank'))
        ordered = groups[gi]['ordered']
        if not 1 <= rank <= len(ordered): doc.err('SC_MARK_RANK'); continue
        item = ordered[rank - 1]
        if isinstance(item, str):
            if e.get('data-symbol') != item or e.get('data-value') is not None: doc.err('SC_MARK_SYMBOL:%d' % rank)
        elif e.get('data-value') != str(item) or e.get('data-symbol') is not None: doc.err('SC_MARK_VALUE:%d' % rank)
        # the circled leaf is found from the picture alone: the group's leaves ordered by stem row (top to bottom) and along the row (away from the stem), counted to the rank
        mine = [l for l in leaves if l.get('data-group') == str(gi)]
        geo = sorted(mine, key=lambda l: (row_of(l), -centre(l)[0] if (gi == 0 and two) else centre(l)[0]))
        if len(geo) != len(ordered): doc.err('SC_MARK_TARGET:%d' % rank); continue
        target = geo[rank - 1]
        cx, cy = centre(target)
        if abs(num(e, 'cx') - cx) > LABEL_TOL or abs(num(e, 'cy') - cy) > LABEL_TOL: doc.err('SC_MARK_NOT_ON_LEAF:%d' % rank)
        try: leaf = read_leaf(target)
        except ValueError as err: doc.err(str(err)); continue
        if leaf != (item if isinstance(item, str) else item % 10): doc.err('SC_MARK_LEAF_VALUE:%d' % rank)
    # rank labels: the order number of each circled leaf, counted here from the largest (or smallest) value of its group, written centred above its circle
    order_labels = doc.label_role('rank-number')
    mode = chart.get('rankLabels')
    if mode is None:
        if order_labels: doc.err('SC_RANK_LABELS_UNEXPECTED')
    else:
        if mode not in ('FROM_LARGEST', 'FROM_SMALLEST') or not marks: fail('STAT_STEM_RANK_LABELS_INVALID')
        want_orders = {(gi, r): (len(groups[gi]['ordered']) - r + 1 if mode == 'FROM_LARGEST' else r) for gi, r in marks}
        got = {}
        for l in order_labels:
            key = (int(l.get('data-group', -1)), int(l.get('data-rank', -1)))
            if key in got: doc.err('SC_RANK_LABEL_DUPLICATE:%d' % key[1])
            got[key] = l
        if set(got) != set(want_orders): doc.err('SC_RANK_LABEL_SET_MISMATCH')
        circles = {(int(e.get('data-group')), int(e.get('data-rank'))): e for e in drawn}
        for key, l in got.items():
            if key not in want_orders: continue
            try: read = tex_number(l.get('data-tex'))
            except ValueError as e: doc.err(str(e)); continue
            if read != want_orders[key] or l.get('data-order') != str(want_orders[key]): doc.err('SC_RANK_LABEL_VALUE:%d' % key[1])
            circle = circles.get(key)
            if circle is None: continue
            lx, ly, lw, lh = box_of(l)
            if abs(lx + lw / 2 - num(circle, 'cx')) > LABEL_TOL: doc.err('SC_RANK_LABEL_NOT_CENTRED:%d' % key[1])
            if ly + lh > num(circle, 'cy') - num(circle, 'ry') + 1: doc.err('SC_RANK_LABEL_NOT_ABOVE:%d' % key[1])
    # class groups: a bracket under exactly the leaves of the class, its count (counted here from the plan) centred below it
    wanted = class_plan(chart, groups)
    brackets = doc.role('polyline', 'class-bracket')
    if sorted((int(b.get('data-group')), int(b.get('data-from')), int(b.get('data-to'))) for b in brackets) != sorted((w[0], w[1], w[2]) for w in wanted): doc.err('SC_CLASS_SET_MISMATCH')
    for b in brackets:
        key3 = (int(b.get('data-group')), int(b.get('data-from')), int(b.get('data-to')))
        found = [w for w in wanted if (w[0], w[1], w[2]) == key3]
        if len(found) != 1: continue
        gi, frm, to, stem, inside, count, has_label = found[0]
        tag = '%d-%d-%d' % key3
        try: pts = [tuple(float(v) for v in pair.split(',')) for pair in b.get('points').split()]
        except Exception: doc.err('SC_CLASS_BRACKET_POINTS:' + tag); continue
        if len(pts) != 4 or abs(pts[0][0] - pts[1][0]) > TOL or abs(pts[2][0] - pts[3][0]) > TOL or abs(pts[1][1] - pts[2][1]) > TOL or abs(pts[0][1] - pts[3][1]) > TOL or not pts[1][1] > pts[0][1]:
            doc.err('SC_CLASS_BRACKET_SHAPE:' + tag); continue
        xl, xr, yb = pts[0][0], pts[3][0], pts[1][1]
        if not xl < xr: doc.err('SC_CLASS_BRACKET_SHAPE:' + tag); continue
        # the leaves of this stem row in the group, in order away from the stem, found from the picture (by row position), not from the producer's stem/index attributes
        at_row = [k for k, (_, s2) in enumerate(stem_rows) if s2 == stem]
        if len(at_row) != 1: doc.err('SC_CLASS_ROW_MISSING:' + tag); continue
        top_row = at_row[0]
        row_leaves = sorted([l for l in leaves if l.get('data-group') == str(gi) and row_of(l) == top_row], key=lambda l: -centre(l)[0] if (gi == 0 and two) else centre(l)[0])
        if len(row_leaves) != len(groups[gi]['rows'][stem]): doc.err('SC_CLASS_ROW_LEAVES:' + tag); continue
        covered = [l.get('id') for l in row_leaves if xl <= centre(l)[0] <= xr]
        if covered != [row_leaves[j].get('id') for j in inside]: doc.err('SC_CLASS_COVER_MISMATCH:' + tag)
        if any(yb <= box_of(l)[1] + box_of(l)[3] + 2 for l in row_leaves): doc.err('SC_CLASS_BRACKET_NOT_BELOW:' + tag)
        counts = doc.owners.get(b.get('id'), [])
        if not has_label:
            if counts: doc.err('SC_CLASS_COUNT_UNEXPECTED:' + tag)
        elif len(counts) != 1 or counts[0].get('data-label-role') != 'class-count': doc.err('SC_CLASS_COUNT_LABEL:' + tag)
        else:
            try: shown = tex_number(counts[0].get('data-tex'))
            except ValueError as e: doc.err(str(e) + ':' + tag); continue
            if shown != count: doc.err('SC_CLASS_COUNT_VALUE:' + tag)
            cx, _ = centre(counts[0])
            if abs(cx - (xl + xr) / 2) > LABEL_TOL: doc.err('SC_CLASS_COUNT_NOT_CENTRED:' + tag)
            if box_of(counts[0])[1] < yb: doc.err('SC_CLASS_COUNT_NOT_BELOW:' + tag)
    # key
    unit = chart.get('unitText', '')
    key = chart.get('key')
    numeric = sorted(v for g in groups for v in g['numbers'])
    first = next((v for v in groups[0]['ordered'] if isinstance(v, int)), None)
    if key is None and first is None: fail('STAT_STEM_KEY_INVALID')
    ks, kl = (key['stem'], key['leaf']) if key else (first // 10, first % 10)
    if key and ks * 10 + kl not in numeric: doc.err('SC_KEY_NOT_IN_DATA')
    keys = doc.label_role('key')
    if len(keys) != 1 or keys[0].get('data-text') != '%d | %d%s %d%s' % (ks, kl, leaf_particle(kl), ks * 10 + kl, unit): doc.err('SC_KEY_TEXT')
    heads = {l.get('data-text') for l in doc.label_role('header')}
    want_heads = {'줄기'} | ({g['name'] for g in groups} if two else {'잎'})
    if heads != want_heads: doc.err('SC_HEADERS')
    doc.check_title('title', chart.get('title'), 'x')

    def median_of(ordered):
        n = len(ordered)
        mid = [ordered[(n + 1) // 2 - 1]] if n % 2 else [ordered[n // 2 - 1], ordered[n // 2]]
        return None if any(isinstance(v, str) for v in mid) else str(median([Fraction(v) for v in mid]))

    observed = {'n': [len(g['ordered']) for g in groups], 'median': [median_of(g['ordered']) for g in groups]}
    if wanted: observed['classes'] = [{'group': w[0], 'from': w[1], 'to': w[2], 'count': w[5]} for w in wanted]
    return observed


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
