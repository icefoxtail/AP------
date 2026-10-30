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
FILL = {'bar': '#ececec', 'barHi': '#b5b5b5', 'barHi2': '#8e8e8e', 'cell': '#fff', 'cellHi': '#c9c9c9', 'cellHi2': '#9b9b9b'}
DICE_NAME_TEXT = re.compile('^[\uac00-\ud7a3][\uac00-\ud7a3 ]{0,7}$')
BRANCH_WIDTH, BRANCH_WIDTH_HI = 1.4, 3.0      # this observer's own copy of the stroke widths of a branch and of a branch on a highlighted path
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


SCATTER_REGION_OPACITY = {1: 0.12, 2: 0.26}      # this observer's own copy of how dark a highlighted rectangle is (tone 1 / 2, #111)
SCATTER_RING_R = 7.6


def scatter_marks(chart, doc, fx, fy, xr, yr):
    """E36: reference lines (x=k, y=k, y=x), highlighted rectangles with the points they hold (rings, a count the plan asks for), re-derived from the plan's points with exact fractions."""
    points = [(frac(p['x'], 'SC_PLAN_INVALID'), frac(p['y'], 'SC_PLAN_INVALID')) for p in chart['points']]
    xs, ys = frac(chart.get('xStep', '1'), 'SC_PLAN_INVALID') if 'xStep' in chart else None, frac(chart.get('yStep', '1'), 'SC_PLAN_INVALID') if 'yStep' in chart else None
    plan_refs = chart.get('refLines') or []
    refs = {e.get('id'): e for e in doc.role('line', 'ref-line')}
    if len(refs) != len(plan_refs): doc.err('SC_SCATTER_REF_COUNT')
    for i, g in enumerate(plan_refs):
        t = g.get('type')
        if t == 'y=x' and chart.get('diagonal') is True: fail('STAT_SCATTER_GUIDE_INVALID')
        e = refs.get('ref-%d' % i)
        if e is None: doc.err('SC_SCATTER_REF_MISSING:%d' % i); continue
        if t in ('x=k', 'y=k'):
            v = frac(g.get('value'), 'STAT_SCATTER_GUIDE_INVALID')
            r = xr if t == 'x=k' else yr
            if not r[0] <= v <= r[1]: fail('STAT_SCATTER_GUIDE_OUT_OF_RANGE')
            want = ((fx(v), fy(yr[0])), (fx(v), fy(yr[1]))) if t == 'x=k' else ((fx(xr[0]), fy(v)), (fx(xr[1]), fy(v)))
        elif t == 'y=x':
            t0, t1 = max(xr[0], yr[0]), min(xr[1], yr[1])
            want = ((fx(t0), fy(t0)), (fx(t1), fy(t1)))
        else: fail('STAT_SCATTER_GUIDE_INVALID')
        got = ((num(e, 'x1'), num(e, 'y1')), (num(e, 'x2'), num(e, 'y2')))
        if any(abs(a - b) > TOL for pa, pb in zip(got, want) for a, b in zip(pa, pb)): doc.err('SC_SCATTER_REF_PLACE:%d' % i)
        if e.get('data-type') != t or (t != 'y=x' and frac(e.get('data-value'), 'SC_PLAN_INVALID') != frac(g['value'], 'SC_PLAN_INVALID')): doc.err('SC_SCATTER_REF_DATA:%d' % i)
    plan_regions = chart.get('regions') or []
    rects = {e.get('id'): e for e in doc.role('rect', 'scatter-region')}
    if len(rects) != len(plan_regions): doc.err('SC_SCATTER_REGION_COUNT')
    rings = {(e.get('data-region'), e.get('data-point')): e for e in doc.circles if e.get('data-role') == 'point-ring'}
    want_rings, count_labels = set(), {}
    dots = {int(c.get('data-index')): c for c in doc.circles if c.get('data-index') is not None}
    for j, g in enumerate(plan_regions):
        x0 = frac(g['xMin'], 'SC_PLAN_INVALID') if 'xMin' in g else xr[0]
        x1 = frac(g['xMax'], 'SC_PLAN_INVALID') if 'xMax' in g else xr[1]
        y0 = frac(g['yMin'], 'SC_PLAN_INVALID') if 'yMin' in g else yr[0]
        y1 = frac(g['yMax'], 'SC_PLAN_INVALID') if 'yMax' in g else yr[1]
        if not (xr[0] <= x0 < x1 <= xr[1] and yr[0] <= y0 < y1 <= yr[1]): fail('STAT_SCATTER_REGION_INVALID')
        for v, step, lo in ((x0, xs, xr[0]), (x1, xs, xr[0]), (y0, ys, yr[0]), (y1, ys, yr[0])):
            if step and (v - lo) % step: fail('STAT_SCATTER_REGION_NOT_ON_STEP')
        inside = [i for i, (x, y) in enumerate(points) if x0 <= x <= x1 and y0 <= y <= y1]
        if not inside: fail('STAT_SCATTER_REGION_EMPTY')
        tone = g.get('tone', 1)
        e = rects.get('region-%d' % j)
        if e is None: doc.err('SC_SCATTER_REGION_MISSING:%d' % j)
        else:
            top, left = fy(y1), fx(x0)
            if abs(num(e, 'x') - left) > TOL or abs(num(e, 'y') - top) > TOL or abs(num(e, 'width') - (fx(x1) - left)) > TOL or abs(num(e, 'height') - (fy(y0) - top)) > TOL: doc.err('SC_SCATTER_REGION_PLACE:%d' % j)
            if e.get('fill') != '#111' or abs(float(e.get('fill-opacity') or 0) - SCATTER_REGION_OPACITY[tone]) > 1e-9: doc.err('SC_SCATTER_REGION_STYLE:%d' % j)
        if g.get('markPoints') is True:
            for i in inside: want_rings.add((str(j), str(i)))
        label = [l for l in doc.label_role('count-value') if l.get('data-owner') == 'region-%d' % j]
        if g.get('countLabel') is True:
            text = str(len(inside)) + g.get('countUnit', '')
            if len(label) != 1: doc.err('SC_SCATTER_COUNT_LABEL:%d' % j)
            else:
                l = label[0]
                if (l.get('data-text') if g.get('countUnit') else l.get('data-tex')) != (text if g.get('countUnit') else NORM_DISPLAY + text): doc.err('SC_SCATTER_COUNT_MISMATCH:%d' % j)
                if l.get('data-value') != str(len(inside)): doc.err('SC_SCATTER_COUNT_MISMATCH:%d' % j)
                if clearance(box_of(l), drawn_obstacles(doc)) < 1.0: doc.err('SC_SCATTER_COUNT_LABEL_CLEARANCE:%d' % j)
        elif label: doc.err('SC_SCATTER_COUNT_LABEL_UNEXPECTED:%d' % j)
    if set(rings) != want_rings: doc.err('SC_SCATTER_RING_SET')
    for (j, i), e in rings.items():
        d = dots.get(int(i))
        if d is None or abs(num(e, 'cx') - num(d, 'cx')) > TOL or abs(num(e, 'cy') - num(d, 'cy')) > TOL or abs(num(e, 'r') - SCATTER_RING_R) > TOL: doc.err('SC_SCATTER_RING_PLACE:%s:%s' % (j, i))


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
    scatter_marks(chart, doc, fx, fy, xr, yr)
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


def dice_names(chart):
    """What the plan says about the two variables, read from the plan alone: (col letter, row letter, col show, row show, col text, row text); show is LETTER, NONE or TEXT."""
    absent = object()
    def one(v, fallback):
        if v is absent: return fallback, 'LETTER', None
        if v is None: return fallback, 'NONE', None
        if isinstance(v, str) and re.fullmatch('[a-z]', v): return v, 'LETTER', None
        if isinstance(v, str) and DICE_NAME_TEXT.fullmatch(v) and '  ' not in v and not v.endswith(' '): return fallback, 'TEXT', v
        fail('STAT_DICE_VARIABLE_INVALID')
    col = one(chart['colVar'] if 'colVar' in chart else absent, 'a')
    row = one(chart['rowVar'] if 'rowVar' in chart else absent, 'b')
    if col[0] == row[0]: fail('STAT_DICE_VARIABLE_INVALID')
    return col[0], row[0], col[1], row[1], col[2], row[2]


def dice_tones(chart, faces, col_var, row_var):
    """The tone (0 none, 1, 2) of every cell, from the plan alone: the one highlight condition is tone 1; highlightGroups give each group its tone (no cell in two groups, none empty)."""
    tones = {}
    groups = chart.get('highlightGroups')
    if groups is not None and 'highlight' in chart: fail('STAT_DICE_GROUP_INVALID')
    if groups is None:
        pred = chart.get('highlight')
        for r in range(1, faces + 1):
            for k in range(1, faces + 1): tones[(k, r)] = 1 if pred is not None and _predicate(pred, {col_var: k, row_var: r}) else 0
        return tones
    if not isinstance(groups, list) or not 1 <= len(groups) <= 4: fail('STAT_DICE_GROUP_INVALID')
    hits = {(k, r): [] for r in range(1, faces + 1) for k in range(1, faces + 1)}
    for index, g in enumerate(groups):
        if not isinstance(g, dict) or set(g) - {'highlight', 'cells', 'tone'} or ('highlight' in g) == ('cells' in g): fail('STAT_DICE_GROUP_INVALID')
        tone = g.get('tone', 1)
        if tone not in (1, 2) or isinstance(tone, bool): fail('STAT_DICE_GROUP_INVALID')
        if 'highlight' in g:
            for (k, r) in hits:
                if _predicate(g['highlight'], {col_var: k, row_var: r}): hits[(k, r)].append(index)
        else:
            listed = g['cells']
            if not isinstance(listed, list) or not 1 <= len(listed) <= faces * faces: fail('STAT_DICE_GROUP_INVALID')
            seen = set()
            for e in listed:
                if not isinstance(e, list) or len(e) != 2 or any(isinstance(v, bool) or not isinstance(v, int) or not 1 <= v <= faces for v in e) or tuple(e) in seen: fail('STAT_DICE_GROUP_INVALID')
                seen.add(tuple(e)); hits[tuple(e)].append(index)
    if any(len(v) > 1 for v in hits.values()): fail('STAT_DICE_GROUP_OVERLAP')
    if any(not any(index in v for v in hits.values()) for index in range(len(groups))): fail('STAT_DICE_GROUP_EMPTY')
    for cell, v in hits.items(): tones[cell] = groups[v[0]].get('tone', 1) if v else 0
    return tones


def audit_dice(chart, doc):
    faces = chart.get('faces', 6)
    cell_mode = chart.get('cell', 'PAIR')
    col_var, row_var, col_show, row_show, col_text, row_text = dice_names(chart)
    tones = dice_tones(chart, faces, col_var, row_var)
    cells = {(int(r.get('data-col')), int(r.get('data-row'))): r for r in doc.role('rect', 'cell')}
    if set(cells) != {(k, r) for k in range(1, faces + 1) for r in range(1, faces + 1)}: doc.err('SC_CELL_SET')
    corner = doc.by_id.get('corner')
    if corner is None: fail('SC_CORNER_MISSING')
    x0, y0, size = num(corner, 'x'), num(corner, 'y'), num(corner, 'width')
    count = 0
    for (k, r), rect in cells.items():
        if abs(num(rect, 'x') - (x0 + k * size)) > TOL or abs(num(rect, 'y') - (y0 + r * size)) > TOL or abs(num(rect, 'width') - size) > TOL or abs(num(rect, 'height') - size) > TOL: doc.err('SC_CELL_GRID:%d,%d' % (k, r))
        tone = tones[(k, r)]
        count += tone > 0
        if rect.get('data-highlight') != str(tone) or (rect.get('fill') or '').lower() != FILL[{0: 'cell', 1: 'cellHi', 2: 'cellHi2'}[tone]]: doc.err('SC_CELL_HIGHLIGHT:%d,%d' % (k, r))
        text = {'PAIR': '(%d,%d)' % (k, r), 'SUM': str(k + r), 'PRODUCT': str(k * r), 'NONE': None}[cell_mode]
        labels = doc.owners.get(rect.get('id'), [])
        if text is None:
            if labels: doc.err('SC_CELL_TEXT_UNEXPECTED:%d,%d' % (k, r))
        elif len(labels) != 1 or labels[0].get('data-tex') != text: doc.err('SC_CELL_TEXT:%d,%d' % (k, r))
        elif abs(centre(labels[0])[0] - (x0 + (k + .5) * size)) > LABEL_TOL or abs(centre(labels[0])[1] - (y0 + (r + .5) * size)) > LABEL_TOL: doc.err('SC_CELL_TEXT_PLACE:%d,%d' % (k, r))
    if sum(1 for r in cells.values() if r.get('data-highlight') in ('1', '2')) != count: doc.err('SC_HIGHLIGHT_COUNT')
    for axis in ('col', 'row'):
        heads = sorted((int(r.get('data-value')), r) for r in doc.rects if r.get('data-role') == 'head' and r.get('data-axis') == axis)
        if [v for v, _ in heads] != list(range(1, faces + 1)): doc.err('SC_HEADERS:' + axis)
        for v, r in heads:
            labels = doc.owners.get(r.get('id'), [])
            if len(labels) != 1 or labels[0].get('data-tex') != str(v): doc.err('SC_HEADER_LABEL:%s%d' % (axis, v))
    # the variables: a letter in the corner (and the diagonal that divides it), a Hangul phrase beside the table (over the columns, left of the rows), or nothing
    names = {l.get('data-axis'): l.get('data-tex') for l in doc.label_role('var')}
    want = {axis: letter for axis, letter, show in (('col', col_var, col_show), ('row', row_var, row_show)) if show == 'LETTER'}
    if names != want: doc.err('SC_VARIABLE_LABELS')
    diagonal = doc.by_id.get('corner-diagonal')
    if diagonal is not None and not want: doc.err('SC_CORNER_DIAGONAL')       # no letter in the corner: nothing to divide it
    texts = {l.get('data-axis'): l for l in doc.label_role('var-name')}
    want_texts = {axis: text for axis, text, show in (('col', col_text, col_show), ('row', row_text, row_show)) if show == 'TEXT'}
    if {a: l.get('data-text') for a, l in texts.items()} != want_texts or any(l.get('data-tex') is not None for l in texts.values()): doc.err('SC_VARIABLE_NAMES')
    if 'col' in texts:
        bx, by, bw, bh = box_of(texts['col'])
        if abs(bx + bw / 2 - (x0 + size + faces * size / 2)) > LABEL_TOL or by + bh > y0: doc.err('SC_VARIABLE_NAME_PLACE:col')
    if 'row' in texts:
        bx, by, bw, bh = box_of(texts['row'])
        if abs(by + bh / 2 - (y0 + size + faces * size / 2)) > LABEL_TOL or bx + bw > x0: doc.err('SC_VARIABLE_NAME_PLACE:row')
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
    # highlightPaths: each path names the labels from the root's child down to a leaf; those branches are heavy and those leaves ringed (resolved here from the plan alone)
    lit = []
    raw_paths = chart.get('highlightPaths')
    if raw_paths is not None:
        if not isinstance(raw_paths, list) or not 1 <= len(raw_paths) <= 12: fail('STAT_TREE_HIGHLIGHT_INVALID')
        for path in raw_paths:
            if not isinstance(path, list) or not 1 <= len(path) <= 3 or any(not isinstance(x, str) for x in path): fail('STAT_TREE_HIGHLIGHT_INVALID')
            cur = by_id['n0']
            for label in path:
                nxt = [by_id[c] for c in cur['children'] if by_id[c]['label'] == label]
                if len(nxt) != 1: fail('STAT_TREE_HIGHLIGHT_INVALID')
                cur = nxt[0]
            if cur['children'] or cur['id'] in lit: fail('STAT_TREE_HIGHLIGHT_INVALID')
            lit.append(cur['id'])
    lit_branches = set()
    for leaf in lit:
        cur = by_id[leaf]
        while cur['parent'] is not None: lit_branches.add(cur['id']); cur = by_id[cur['parent']]
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
        try: drawn_width = float(ln.get('stroke-width'))
        except (TypeError, ValueError): drawn_width = -1.0
        if abs(drawn_width - (BRANCH_WIDTH_HI if n['id'] in lit_branches else BRANCH_WIDTH)) > 0.01 or ln.get('data-highlight') != ('1' if n['id'] in lit_branches else None): doc.err('SC_BRANCH_HIGHLIGHT:' + n['id'])
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
    rings = {e.get('data-leaf'): e for e in doc.role('ellipse', 'leaf-ring')}
    if len(doc.role('ellipse', 'leaf-ring')) != len(rings) or set(rings) != set(lit): doc.err('SC_LEAF_RING_SET')
    for leaf, ring in rings.items():
        if leaf not in centres: continue
        label = doc.by_id.get('node-' + leaf)
        bx, by, bw, bh = box_of(label) if label is not None and label.get('data-box') else (centres[leaf][0] - 4, centres[leaf][1] - 4, 8, 8)
        rx, ry = num(ring, 'rx'), num(ring, 'ry')
        if abs(num(ring, 'cx') - (bx + bw / 2)) > LABEL_TOL or abs(num(ring, 'cy') - (by + bh / 2)) > LABEL_TOL or rx < bw / 2 or ry < bh / 2: doc.err('SC_LEAF_RING_PLACE:' + leaf)
        if (ring.get('fill') or '') != 'none' or (ring.get('stroke') or '') != '#111': doc.err('SC_LEAF_RING_STYLE:' + leaf)
    paths = {l.get('data-leaf'): l for l in doc.label_role('path-probability')}
    column = chart.get('pathColumn')
    if column is not None and not isinstance(column, bool): fail('SC_PLAN_INVALID')
    if column and chart.get('showPathProbability') is not True: fail('STAT_TREE_PATH_NEEDS_PROBABILITIES')
    if column and paths:
        # pathColumn: every path probability starts at the same x, right of every leaf label
        lefts = [box_of(l)[0] for l in paths.values()]
        right_edge = max((box_of(doc.by_id['node-' + leaf])[0] + box_of(doc.by_id['node-' + leaf])[2] for leaf in paths if doc.by_id.get('node-' + leaf) is not None and doc.by_id['node-' + leaf].get('data-box')), default=0)
        if max(lefts) - min(lefts) > 0.5 or min(lefts) < right_edge + 8: doc.err('SC_PATH_COLUMN')
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
    return {'leaves': len(leaves), 'paths': {n['id']: str(n['path']) for n in leaves} if has_p else None, **({'highlighted': sorted(lit)} if lit else {})}


# --- the dot plot (E34): stacks of dots over a number line --------------------------------------------------------------------------------------
# This observer's own copies of the drawing rules: the first dot sits DOT_FIRST above the line, the others a diameter and DOT_GAP apart, the radius is the smaller of DOT_MAX_R and
# 0.45 of a unit; a segment of the line runs a unit beyond its data on each side, rounded out to the label step; a cut line leaves between its two parts room for the two numbers
# next to the cut (half the width of each, 14.5 px a digit, and 8 px).
DOT_FIRST, DOT_GAP, DOT_MAX_R, DOT_MINOR = 7.0, 1.5, 5.5, 3.0
DOT_MAX_STACK, DOT_MAX_POINTS = 12, 60


def dot_plan(chart):
    """The data of a dot plot from the plan alone: ([(value, count)] ascending, break (from, to) or None)."""
    def whole(v):
        if isinstance(v, str) and re.fullmatch(r'\d{1,4}', v): v = int(v)
        if isinstance(v, bool) or not isinstance(v, int) or not 0 <= v <= 9999: fail('STAT_DOT_VALUE_INVALID')
        return v
    if ('values' in chart) == ('counts' in chart): fail('STAT_DOT_PLOT_INVALID')
    tally = {}
    if 'values' in chart:
        raw = chart['values']
        if not isinstance(raw, list) or not 1 <= len(raw) <= DOT_MAX_POINTS: fail('STAT_DOT_PLOT_INVALID')
        for v in raw: tally[whole(v)] = tally.get(whole(v), 0) + 1
    else:
        raw = chart['counts']
        if not isinstance(raw, list) or not 1 <= len(raw) <= DOT_MAX_POINTS: fail('STAT_DOT_PLOT_INVALID')
        for e in raw:
            if not isinstance(e, dict) or set(e) != {'value', 'count'}: fail('STAT_DOT_PLOT_INVALID')
            v, k = whole(e['value']), e['count']
            if isinstance(k, bool) or not isinstance(k, int) or not 1 <= k <= DOT_MAX_STACK: fail('STAT_DOT_STACK_TOO_TALL')
            if v in tally: fail('STAT_DOT_PLOT_INVALID')
            tally[v] = k
    if max(tally.values()) > DOT_MAX_STACK or sum(tally.values()) > DOT_MAX_POINTS: fail('STAT_DOT_STACK_TOO_TALL')
    points = sorted(tally.items())
    br = None
    if 'axisBreak' in chart:
        b = chart['axisBreak']
        if not isinstance(b, dict) or set(b) != {'from', 'to'}: fail('STAT_DOT_BREAK_INVALID')
        lo, hi = b['from'], b['to']
        if any(isinstance(x, bool) or not isinstance(x, int) or not 0 <= x <= 9999 for x in (lo, hi)) or hi - lo < 2: fail('STAT_DOT_BREAK_INVALID')
        if any(lo < v < hi for v, _ in points) or not any(v <= lo for v, _ in points) or not any(v >= hi for v, _ in points): fail('STAT_DOT_BREAK_INVALID')
        br = (lo, hi)
    return points, br


def audit_dot(chart, doc):
    points, br = dot_plan(chart)
    x_axis = doc.by_id.get('x-axis')
    if x_axis is None: fail('SC_AXIS_MISSING')
    axis_y = num(x_axis, 'y1')
    values = [v for v, _ in points]
    groups = [[v for v in values if v <= br[0]], [v for v in values if v >= br[1]]] if br else [values]
    majors = doc.role('line', 'x-tick')
    ticks = []
    for tick in majors:
        label = doc.label_of(tick.get('id'), 'x-tick')
        if label is None: continue
        try: value = tex_number(label.get('data-tex'))
        except ValueError as e: doc.err(str(e) + ':' + label.get('id')); continue
        if value.denominator != 1 or frac(tick.get('data-value'), 'SC_TICK_VALUE_INVALID') != value: doc.err('SC_TICK_VALUE_MISMATCH:' + tick.get('id')); continue
        if abs(num(tick, 'x1') - num(tick, 'x2')) > TOL or abs(num(tick, 'y1') - axis_y) > TOL or not num(tick, 'y2') > axis_y: doc.err('SC_TICK_NOT_PERPENDICULAR:' + tick.get('id'))
        if abs(centre(label)[0] - num(tick, 'x1')) > LABEL_TOL: doc.err('SC_TICK_LABEL_NOT_CENTRED:' + label.get('id'))
        ticks.append((int(value), num(tick, 'x1')))
    ticks.sort()
    if len({v for v, _ in ticks}) != len(ticks): doc.err('SC_DOT_TICK_DUPLICATE')
    # one linear scale per segment of the line, the same unit length in all of them
    scale, unit, step = [], None, None
    cut = (max(groups[0]) + min(groups[1])) / 2 if br else None      # a tick belongs to the part of the line whose data lie on its side of the middle of the gap between the data
    seg_ticks = [[t for t in ticks if (t[0] <= cut if k == 0 else t[0] > cut)] for k in range(2)] if br else [ticks]
    for k, group in enumerate(seg_ticks):
        if len(group) < 2: fail('SC_AXIS_TICKS_MISSING:x-tick')
        (v0, c0), (v1, c1) = group[0], group[-1]
        slope = (c1 - c0) / (v1 - v0)
        if slope <= 0: doc.err('SC_AXIS_DIRECTION:x-tick'); slope = abs(slope) or 1.0
        for v, c in group:
            if abs(c0 + (v - v0) * slope - c) > 0.05: doc.err('SC_AXIS_NOT_LINEAR:x-tick')
        diffs = {group[i + 1][0] - group[i][0] for i in range(len(group) - 1)}
        if len(diffs) != 1: doc.err('SC_DOT_TICKS_NOT_EVEN')
        if step is None: step = min(diffs)
        elif min(diffs) != step: doc.err('SC_DOT_TICKS_NOT_EVEN')
        if unit is None: unit = slope
        elif abs(slope - unit) > 0.02: doc.err('SC_DOT_UNIT_DIFFERS')
        scale.append((v0, c0, group))
    if step is None or unit is None: fail('SC_AXIS_TICKS_MISSING:x-tick')
    if chart.get('step') is not None and chart['step'] != step: doc.err('SC_DOT_STEP_MISMATCH')
    def x_of(value):
        k = next((i for i, (_, _, group) in enumerate(scale) if group[0][0] <= value <= group[-1][0]), None)     # the part of the line that covers the value
        if k is None: doc.err('SC_DOT_VALUE_OFF_AXIS:%d' % value); k = 0
        v0, c0, _ = scale[k]
        return c0 + (value - v0) * unit
    # each segment runs one unit past its data on both sides, rounded out to the step (never below 0)
    for k, data in enumerate(groups):
        lo, hi = max(0, ((min(data) - 1) // step) * step), -(-(max(data) + 1) // step) * step
        if (scale[k][2][0][0], scale[k][2][-1][0]) != (lo, hi): doc.err('SC_DOT_SEGMENT_RANGE:%d' % k)
    r_want = min(DOT_MAX_R, 0.45 * unit)
    # the minor ticks: every integer of a segment that is not a label tick, only when the step is more than 1
    minors = doc.role('line', 'x-minor')
    want_minor = set()
    if step > 1:
        for _, _, group in scale: want_minor |= {v for v in range(group[0][0], group[-1][0] + 1) if v % step}
    drawn = {}
    for tick in minors:
        v = frac(tick.get('data-value'), 'SC_TICK_VALUE_INVALID')
        if v.denominator != 1: doc.err('SC_DOT_MINOR_VALUE'); continue
        drawn[int(v)] = drawn.get(int(v), 0) + 1
        if abs(num(tick, 'x1') - x_of(int(v))) > TOL or abs(num(tick, 'x2') - num(tick, 'x1')) > TOL or abs(num(tick, 'y1') - axis_y) > TOL or not 0 < num(tick, 'y2') - axis_y < 5: doc.err('SC_DOT_MINOR_PLACE:%d' % int(v))
    if set(drawn) != want_minor or any(n != 1 for n in drawn.values()): doc.err('SC_DOT_MINOR_SET')
    # the line is cut where the plan says, with the gap between its parts
    breaks = [e for e in doc.role('line', 'axis-break') if e.get('data-axis') == 'x']
    if (len(breaks) == 2) != (br is not None) or len(breaks) not in (0, 2): doc.err('SC_AXIS_BREAK_MISMATCH')
    if br:
        left_end, right_start = scale[0][1] + (scale[0][2][-1][0] - scale[0][0]) * unit, scale[1][1]
        want_gap = 14.5 * (len(str(scale[0][2][-1][0])) + len(str(scale[1][2][0][0]))) / 2 + 8
        if abs((right_start - left_end) - want_gap) > 0.1: doc.err('SC_DOT_GAP')
        mids = [(num(e, 'x1') + num(e, 'x2')) / 2 for e in breaks]
        if any(not left_end < m < right_start for m in mids): doc.err('SC_DOT_BREAK_PLACE')
    # the dots: one per datum, at its value, stacked from the line
    dots = [e for e in doc.circles if e.get('data-role') == 'dot']
    by_value = {}
    for e in dots: by_value.setdefault(e.get('data-value'), []).append(e)
    if set(by_value) != {str(v) for v, _ in points}: doc.err('SC_DOT_VALUE_SET')
    pitch = 2 * r_want + DOT_GAP
    for value, count in points:
        mine = sorted(by_value.get(str(value), []), key=lambda e: -num(e, 'cy'))
        if len(mine) != count: doc.err('SC_DOT_COUNT:%d' % value); continue
        for j, e in enumerate(mine):
            if abs(num(e, 'cx') - x_of(value)) > TOL: doc.err('SC_DOT_X:%d' % value)
            if abs(num(e, 'r') - r_want) > 0.02: doc.err('SC_DOT_RADIUS:%d' % value)
            if abs(num(e, 'cy') - (axis_y - DOT_FIRST - r_want - j * pitch)) > 0.05: doc.err('SC_DOT_STACK:%d' % value)
            if e.get('data-index') != str(j + 1): doc.err('SC_DOT_INDEX:%d' % value)
    if len(dots) != sum(c for _, c in points): doc.err('SC_DOT_TOTAL')
    doc.check_title('x-title', chart.get('xTitle', ''), 'x')
    return {'dots': sum(c for _, c in points), 'values': {str(v): c for v, c in points}, 'step': step}


# ---- NORMAL_CURVE (E36) ---------------------------------------------------------------------------------------------------------------------------------------------------------------
# This observer's own copies of the drawing rules: the tallest curve (the one with the smallest sd) is NORM_PEAK high, the others in the ratio of their sds; a tick is NORM_TICK long; a shade of
# tone 1 / 2 is #111 at 0.16 / 0.34 opacity. The scale of the x axis is the window of the plan against the two ends of each polyline (never anything the producer states about its own scale).
NORM_PEAK, NORM_TICK, NORM_STEP_MAX = 140.0, 5.0, 2.05
NORM_OPACITY = {1: 0.16, 2: 0.34}
NORM_SYMBOL = re.compile('^[A-Za-zμσ]$')
NORM_TEXT = re.compile('^[A-Za-z0-9μσ+\\-=.()^]{1,10}$')
NORM_NAME = re.compile('^(?:[A-Za-z0-9μσ+\\-=.()^, ]{1,14}|[가-힣][가-힣A-Za-z0-9 ()]{0,9})$')
NORM_PLAIN = re.compile(r'^-?\d{1,6}(?:\.\d{1,4})?$')
NORM_AREA_SUM = re.compile(r'^\d(?:\.\d{1,4})?(?:[+-]\d(?:\.\d{1,4})?){0,2}$')
NORM_AREA_SYMBOL = re.compile(r'^[A-Za-z?]$')
NORM_DISPLAY = '\\displaystyle '
NORM_AREA_TOL, NORM_MEASURED_TOL = 2e-4, 6e-4


def decimal_of(q):
    """The finite decimal of a rational (None when it has none): integers plainly, 3/2 as 1.5, 1/2 as 0.5."""
    d, twos, fives = q.denominator, 0, 0
    while d % 2 == 0: d //= 2; twos += 1
    while d % 5 == 0: d //= 5; fives += 1
    if d != 1: return None
    k = max(twos, fives)
    n = q.numerator * 10 ** k // q.denominator
    digits = str(abs(n)).rjust(k + 1, '0')
    return ('-' if n < 0 else '') + (digits[:-k] + '.' + digits[-k:] if k else digits)


def tex_num(q):
    d = decimal_of(q)
    return d if d is not None else ('-' if q < 0 else '') + '\\frac{%d}{%d}' % (abs(q.numerator), q.denominator)


def normal_tex(text):
    return text.replace('σ', '\\sigma ').replace('μ', '\\mu ').strip()


def try_frac(raw):
    try: return frac(raw, 'SC_PLAN_INVALID')
    except ValueError: return None


def phi(z): return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def normal_area(za, zb):
    return phi(zb if zb is not None else 40.0) - phi(za if za is not None else -40.0)


def normal_plan(chart):
    """Everything a normal-curve figure shows, derived from the plan alone with exact fractions (this observer's own rules): curves, window, ticks (sorted, with the text each shows), shades with
    their exact areas, area labels, symmetric pairs."""
    keys = {'kind', 'curves', 'ticks', 'zAxis', 'shades', 'areaLabels', 'symmetry', 'xLabel', 'span'}
    if set(chart) - keys: fail('STAT_CHART_PLAN_INVALID')
    raw_curves = chart.get('curves')
    if not isinstance(raw_curves, list) or not 1 <= len(raw_curves) <= 3: fail('STAT_NORMAL_CURVE_INVALID')
    curves, ids = [], set()
    for raw in raw_curves:
        if not isinstance(raw, dict) or set(raw) - {'id', 'mean', 'sd', 'label', 'meanLine'}: fail('STAT_NORMAL_CURVE_INVALID')
        if not isinstance(raw.get('id'), str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,3}', raw['id']) or raw['id'] in ids: fail('STAT_NORMAL_CURVE_INVALID')
        ids.add(raw['id'])
        mean, sd = try_frac(raw.get('mean')), try_frac(raw.get('sd'))
        if mean is None and not (isinstance(raw.get('mean'), str) and NORM_SYMBOL.match(raw['mean'])): fail('STAT_NORMAL_PARAM_INVALID')
        if sd is None and not (isinstance(raw.get('sd'), str) and NORM_SYMBOL.match(raw['sd'])): fail('STAT_NORMAL_PARAM_INVALID')
        if sd is not None and sd <= 0: fail('STAT_NORMAL_SD_INVALID')
        label = raw.get('label')
        if label is not None and (not isinstance(label, str) or not NORM_NAME.match(label)): fail('STAT_NORMAL_LABEL_INVALID')
        mean_text = raw['mean'] if mean is None else decimal_of(mean)
        if mean_text is None: fail('STAT_NORMAL_PARAM_INVALID')
        curves.append({'id': raw['id'], 'mean': mean, 'sd': sd, 'mean_text': mean_text, 'sd_text': raw['sd'] if sd is None else (decimal_of(sd) or str(sd)), 'label': label,
                       'mean_line': raw['meanLine'] if 'meanLine' in raw else len(raw_curves) == 1})
    framed = any(c['mean'] is None or c['sd'] is None for c in curves)
    if framed and len(curves) > 1: fail('STAT_NORMAL_SYMBOLIC_MULTI')
    by_id = {c['id']: c for c in curves}
    span = Fraction(4)
    if 'span' in chart:
        span = try_frac(chart['span'])
        if span is None or not Fraction(5, 2) <= span <= 5: fail('STAT_NORMAL_SPAN_INVALID')
    if framed: lo, hi = -span, span
    else:
        sd_min, sd_max = min(c['sd'] for c in curves), max(c['sd'] for c in curves)
        if sd_max > 4 * sd_min: fail('STAT_NORMAL_SD_RATIO')
        if max(c['mean'] for c in curves) - min(c['mean'] for c in curves) > 6 * sd_min: fail('STAT_NORMAL_WINDOW_TOO_WIDE')
        lo, hi = min(c['mean'] - span * c['sd'] for c in curves), max(c['mean'] + span * c['sd'] for c in curves)
    raw_ticks = chart.get('ticks')
    if not isinstance(raw_ticks, list) or not 1 <= len(raw_ticks) <= 10: fail('STAT_NORMAL_TICK_INVALID')

    def sym_text(c, z):
        if z == 0: return c['mean_text']
        sign, a = ('-', -z) if z < 0 else ('+', z)
        if c['sd'] is not None:
            off = decimal_of(a * c['sd'])
            if off is None: fail('STAT_NORMAL_TICK_TEXT_UNREPRESENTABLE')
            return c['mean_text'] + sign + off
        coef = '' if a == 1 else decimal_of(a)
        if coef is None: fail('STAT_NORMAL_TICK_TEXT_UNREPRESENTABLE')
        return c['mean_text'] + sign + coef + c['sd_text']
    plan_ticks = []
    for i, raw in enumerate(raw_ticks):
        t = {'x': raw} if isinstance(raw, (str, int)) and not isinstance(raw, bool) else raw
        if not isinstance(t, dict) or set(t) - {'x', 'z', 'text', 'curve', 'hideZ'} or ('x' in t) == ('z' in t): fail('STAT_NORMAL_TICK_INVALID')
        c = by_id.get(t['curve']) if 'curve' in t else curves[0]
        if c is None: fail('STAT_NORMAL_TICK_INVALID')
        if framed:
            if 'x' in t: fail('STAT_NORMAL_TICK_INVALID')
            u = z = frac(t['z'], 'STAT_NORMAL_TICK_INVALID')
        elif 'x' in t:
            u = frac(t['x'], 'STAT_NORMAL_TICK_INVALID'); z = (u - c['mean']) / c['sd']
        else:
            z = frac(t['z'], 'STAT_NORMAL_TICK_INVALID'); u = c['mean'] + z * c['sd']
        if not lo <= u <= hi: fail('STAT_NORMAL_TICK_OUT_OF_WINDOW')
        if 'text' in t:
            text = t['text']
            if not isinstance(text, str) or not NORM_TEXT.match(text): fail('STAT_NORMAL_TICK_TEXT_INVALID')
            if not framed and NORM_PLAIN.match(text) and frac(text, 'SC_PLAN_INVALID') != u: fail('STAT_NORMAL_TICK_TEXT_MISMATCH')
            tex = NORM_DISPLAY + normal_tex(text)
        elif framed:
            text = sym_text(c, u); tex = NORM_DISPLAY + normal_tex(text)
        else:
            text = decimal_of(u) or '%d/%d' % (u.numerator, u.denominator); tex = NORM_DISPLAY + tex_num(u)
        plan_ticks.append({'plan': i, 'u': u, 'z': z, 'text': text, 'tex': tex, 'curve': c['id'], 'hide_z': t.get('hideZ') is True})
    for i, a in enumerate(plan_ticks):
        for b in plan_ticks[i + 1:]:
            if a['u'] == b['u'] or a['text'] == b['text']: fail('STAT_NORMAL_TICK_DUPLICATE')
    ticks = sorted(plan_ticks, key=lambda t: t['u'])

    def ref(r):
        if isinstance(r, int) and not isinstance(r, bool) and 0 <= r < len(plan_ticks): return plan_ticks[r]
        if isinstance(r, str):
            for t in plan_ticks:
                if t['text'] == r: return t
        return fail('STAT_NORMAL_BOUNDARY_NOT_TICKED')
    z_of = (lambda c, u: u) if framed else (lambda c, u: (u - c['mean']) / c['sd'])
    shades = []
    raw_shades = chart.get('shades', [])
    if not isinstance(raw_shades, list) or len(raw_shades) > 6: fail('STAT_NORMAL_SHADE_INVALID')
    for raw in raw_shades:
        if not isinstance(raw, dict) or set(raw) - {'curve', 'from', 'to', 'tone'}: fail('STAT_NORMAL_SHADE_INVALID')
        c = by_id.get(raw['curve']) if 'curve' in raw else curves[0]
        if c is None: fail('STAT_NORMAL_SHADE_INVALID')
        a_ref, b_ref = raw.get('from'), raw.get('to')
        if a_ref is None and b_ref is None: fail('STAT_NORMAL_SHADE_INVALID')
        if raw.get('tone', 1) not in (1, 2) or isinstance(raw.get('tone'), bool): fail('STAT_NORMAL_SHADE_INVALID')
        a = None if a_ref is None else ref(a_ref)
        b = None if b_ref is None else ref(b_ref)
        if a and b and a['u'] >= b['u']: fail('STAT_NORMAL_SHADE_RANGE')
        za = None if a is None else float(z_of(c, a['u']))
        zb = None if b is None else float(z_of(c, b['u']))
        shades.append({'curve': c['id'], 'from': None if a is None else a['u'], 'to': None if b is None else b['u'], 'tone': raw.get('tone', 1), 'za': za, 'zb': zb, 'area': normal_area(za, zb), 'label': None})
    raw_labels = chart.get('areaLabels', [])
    if not isinstance(raw_labels, list) or len(raw_labels) > len(shades): fail('STAT_NORMAL_AREA_LABEL_INVALID')
    for raw in raw_labels:
        if not isinstance(raw, dict) or set(raw) - {'shade', 'text'}: fail('STAT_NORMAL_AREA_LABEL_INVALID')
        j, text = raw.get('shade'), raw.get('text')
        if isinstance(j, bool) or not isinstance(j, int) or not 0 <= j < len(shades) or shades[j]['label'] is not None or not isinstance(text, str): fail('STAT_NORMAL_AREA_LABEL_INVALID')
        if NORM_AREA_SUM.match(text):
            if abs(float(label_value(text)) - shades[j]['area']) > NORM_AREA_TOL: fail('STAT_NORMAL_AREA_LABEL_MISMATCH')
        elif not NORM_AREA_SYMBOL.match(text): fail('STAT_NORMAL_AREA_LABEL_INVALID')
        shades[j]['label'] = text
    for i, a in enumerate(shades):
        for b in shades[i + 1:]:
            if a['label'] is not None and a['label'] == b['label'] and re.fullmatch(r'[A-Za-z]', a['label']) and abs(a['area'] - b['area']) > 1e-5: fail('STAT_NORMAL_AREA_SYMBOL_UNEQUAL')
    raw_sym = chart.get('symmetry', [])
    if not isinstance(raw_sym, list) or len(raw_sym) > 2: fail('STAT_NORMAL_SYMMETRY_INVALID')
    symmetry = []
    for raw in raw_sym:
        if not isinstance(raw, dict) or set(raw) - {'curve', 'pair'}: fail('STAT_NORMAL_SYMMETRY_INVALID')
        c = by_id.get(raw['curve']) if 'curve' in raw else curves[0]
        if c is None or not isinstance(raw.get('pair'), list) or len(raw['pair']) != 2: fail('STAT_NORMAL_SYMMETRY_INVALID')
        a, b = ref(raw['pair'][0]), ref(raw['pair'][1])
        if a is b or z_of(c, a['u']) + z_of(c, b['u']) != 0: fail('STAT_NORMAL_SYMMETRY_MISMATCH')
        symmetry.append({'curve': c['id'], 'pair': sorted([a['u'], b['u']])})
    z_axis = chart.get('zAxis') is True
    if 'zAxis' in chart and not isinstance(chart['zAxis'], bool): fail('STAT_CHART_PLAN_INVALID')
    if z_axis and len(curves) > 1: fail('STAT_NORMAL_Z_AXIS_AMBIGUOUS')
    if z_axis and all(t['hide_z'] for t in ticks): fail('STAT_NORMAL_Z_AXIS_EMPTY')
    x_label = chart.get('xLabel', 'x')
    if not isinstance(x_label, str) or not re.fullmatch(r'[A-Za-z]', x_label): fail('STAT_NORMAL_LABEL_INVALID')
    for c in curves:
        if c['mean_line'] and not any(t['u'] == (0 if framed else c['mean']) for t in ticks): fail('STAT_NORMAL_MEAN_NOT_TICKED')
    return {'framed': framed, 'curves': curves, 'lo': lo, 'hi': hi, 'span': span, 'ticks': ticks, 'shades': shades, 'symmetry': symmetry, 'z_axis': z_axis, 'x_label': x_label}


def label_value(text):
    """The number an area label written as a sum or difference of decimals stands for (exact)."""
    return sum((-1 if sign == '-' else 1) * Fraction(term) for sign, term in re.findall(r'([+-]?)(\d(?:\.\d{1,4})?)', text))


def points_of(element):
    try: return [tuple(float(v) for v in pair.split(',')) for pair in (element.get('points') or '').split()]
    except ValueError: fail('SC_SVG_ATTRIBUTE_INVALID:points')


def inside_polygon(point, poly):
    """Ray casting: is the point inside the polygon."""
    x, y = point
    hit = False
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        if (y0 > y) != (y1 > y) and x < x0 + (y - y0) * (x1 - x0) / (y1 - y0): hit = not hit
    return hit


def polygon_clearance(point, poly):
    """The distance from a point to the nearest edge of the polygon."""
    best = math.inf
    for a, b in zip(poly, poly[1:] + poly[:1]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        length2 = dx * dx + dy * dy
        t = max(0.0, min(1.0, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / length2)) if length2 else 0.0
        best = min(best, math.hypot(point[0] - (a[0] + t * dx), point[1] - (a[1] + t * dy)))
    return best


def segments_cross(a, b, c, d):
    """Do the segments a-b and c-d cross properly (not merely touch)?"""
    def orient(p, q, r): return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    return orient(a, b, c) * orient(a, b, d) < 0 and orient(c, d, a) * orient(c, d, b) < 0


def shoelace(poly):
    return abs(sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]))) / 2


def audit_normal(chart, doc):
    plan = normal_plan(chart)
    framed, curves, ticks, shades = plan['framed'], plan['curves'], plan['ticks'], plan['shades']
    x_axis = doc.by_id.get('x-axis')
    if x_axis is None: fail('SC_AXIS_MISSING')
    base = num(x_axis, 'y1')
    lo, hi = plan['lo'], plan['hi']
    sd_of = (lambda c: 1.0) if framed else (lambda c: float(c['sd']))
    mean_of = (lambda c: 0.0) if framed else (lambda c: float(c['mean']))
    sd_min = min(sd_of(c) for c in curves)
    # the scale of the axis: the window of the plan against the two ends of the first curve's polyline
    first = doc.by_id.get('curve-' + curves[0]['id'])
    if first is None: fail('SC_NORMAL_CURVE_MISSING')
    first_pts = points_of(first)
    if len(first_pts) < 50: fail('SC_NORMAL_CURVE_SPARSE')
    xl, xr = first_pts[0][0], first_pts[-1][0]
    slope = (xr - xl) / float(hi - lo)
    if slope <= 0: fail('SC_AXIS_DIRECTION:x')
    px = lambda u: xl + (float(u) - float(lo)) * slope
    ux = lambda x: float(lo) + (x - xl) / slope
    height = lambda c: NORM_PEAK * sd_min / sd_of(c)
    ycurve = lambda c, x: base - height(c) * math.exp(-(((ux(x) - mean_of(c)) / sd_of(c)) ** 2) / 2)
    # the curves
    polylines = list(doc.root.iter(NS + 'polyline'))
    if len(polylines) != len(curves): doc.err('SC_NORMAL_CURVE_COUNT')
    dashes = []
    for c in curves:
        e = doc.by_id.get('curve-' + c['id'])
        if e is None: doc.err('SC_NORMAL_CURVE_MISSING:' + c['id']); continue
        pts = points_of(e)
        dashes.append(e.get('stroke-dasharray') or '')
        if len(pts) < 50 or abs(pts[0][0] - xl) > 0.05 or abs(pts[-1][0] - xr) > 0.05: doc.err('SC_NORMAL_CURVE_RANGE:' + c['id']); continue
        if any(not 0 < x1 - x0 <= NORM_STEP_MAX for (x0, _), (x1, _) in zip(pts, pts[1:])): doc.err('SC_NORMAL_CURVE_SPARSE:' + c['id'])
        else:
            bad = [i for i, (x, y) in enumerate(pts) if abs(y - ycurve(c, x)) > 0.05]
            if bad: doc.err('SC_NORMAL_CURVE_SHAPE:%s:%d' % (c['id'], bad[0]))
            if any(abs((y0 + y1) / 2 - ycurve(c, (x0 + x1) / 2)) > 0.25 for (x0, y0), (x1, y1) in zip(pts, pts[1:])): doc.err('SC_NORMAL_CURVE_CHORD:' + c['id'])
            top = min(pts, key=lambda p: p[1])
            if abs(top[0] - px(mean_of(c))) > 1.2 or not 0 <= height(c) - (base - top[1]) <= 0.2: doc.err('SC_NORMAL_PEAK:' + c['id'])
        if e.get('stroke') != '#111' or e.get('fill') != 'none': doc.err('SC_NORMAL_CURVE_STYLE:' + c['id'])
    if len(curves) > 1 and len(set(dashes)) != len(dashes): doc.err('SC_NORMAL_CURVE_STYLE_SAME')
    # the ticks
    expected_lines = {'x-axis'}
    if len(doc.role('line', 'x-tick')) != len(ticks): doc.err('SC_NORMAL_TICK_COUNT')
    labels_expected = {}
    for i, t in enumerate(ticks):
        e = doc.by_id.get('x-tick-%d' % i)
        expected_lines.add('x-tick-%d' % i)
        if e is None: doc.err('SC_NORMAL_TICK_MISSING:%d' % i); continue
        x = num(e, 'x1')
        if abs(x - px(t['u'])) > 0.05 or abs(num(e, 'x2') - x) > 0.02 or abs(num(e, 'y1') - base) > 0.02 or abs(num(e, 'y2') - (base + NORM_TICK)) > 0.02: doc.err('SC_NORMAL_TICK_PLACE:%d' % i)
        labels_expected['x-tick-%d-label' % i] = ('x-tick', 'x-tick-%d' % i, t['tex'], x)
        if plan['z_axis'] and not t['hide_z']: labels_expected['z-tick-%d-label' % i] = ('z-tick', 'x-tick-%d' % i, NORM_DISPLAY + tex_num(t['z']), x)
    labels_expected['x-label'] = ('axis-title', 'x-axis', plan['x_label'], None)
    if plan['z_axis']: labels_expected['z-label'] = ('axis-title', 'z-row', 'z', None)
    for j, s in enumerate(shades):
        if s['label'] is not None: labels_expected['area-%d' % j] = ('area-value', 'shade-%d' % j, NORM_DISPLAY + normal_tex(s['label']), None)
    for c in curves:
        if c['label'] is not None:
            hangul = re.search('[가-힣]', c['label']) is not None
            labels_expected['curve-%s-name' % c['id']] = ('curve-name', 'curve-' + c['id'], c['label'] if hangul else NORM_DISPLAY + normal_tex(c['label']), None)
    got = {l.get('id'): l for l in doc.labels}
    if set(got) != set(labels_expected): doc.err('SC_NORMAL_LABEL_SET')
    for lid, (role, owner, tex, cx) in labels_expected.items():
        l = got.get(lid)
        if l is None: continue
        if l.get('data-label-role') != role or l.get('data-owner') != owner: doc.err('SC_NORMAL_LABEL_ROLE:' + lid)
        if l.get('data-tex') != tex and l.get('data-text') != tex: doc.err('SC_NORMAL_LABEL_TEXT:' + lid)
        bx, by, bw, bh = box_of(l)
        if cx is not None:
            if abs(bx + bw / 2 - cx) > LABEL_TOL: doc.err('SC_NORMAL_LABEL_NOT_CENTRED:' + lid)
            if lid.startswith('x-tick') and by < base + NORM_TICK: doc.err('SC_NORMAL_TICK_LABEL_ABOVE_AXIS:' + lid)
    for i, t in enumerate(ticks):
        xlab, zlab = got.get('x-tick-%d-label' % i), got.get('z-tick-%d-label' % i)
        if xlab is not None and zlab is not None and box_of(zlab)[1] < box_of(xlab)[1] + box_of(xlab)[3]: doc.err('SC_NORMAL_Z_ROW_OVERLAP:%d' % i)
    xlab = got.get('x-label')
    if xlab is not None and not (box_of(xlab)[0] > xr and abs(centre(xlab)[1] - base) <= LABEL_TOL + 1): doc.err('SC_NORMAL_X_LABEL_PLACE')
    # mean lines
    for c in curves:
        e = doc.by_id.get('mean-' + c['id'])
        if c['mean_line']:
            expected_lines.add('mean-' + c['id'])
            x = px(mean_of(c))
            if e is None or abs(num(e, 'x1') - x) > 0.05 or abs(num(e, 'x2') - x) > 0.05 or abs(num(e, 'y1') - base) > 0.05 or abs(num(e, 'y2') - (base - height(c))) > 0.05: doc.err('SC_NORMAL_MEAN_LINE:' + c['id'])
        elif e is not None: doc.err('SC_NORMAL_MEAN_LINE_UNEXPECTED:' + c['id'])
    # shaded areas
    by_curve = {c['id']: c for c in curves}
    if len(doc.role('polygon', 'shade')) != len(shades): doc.err('SC_NORMAL_SHADE_COUNT')
    polys, drawn_area, exact_window = {}, {}, {}
    whole_bell = lambda c: height(c) * sd_of(c) * slope * math.sqrt(2 * math.pi)
    for j, s in enumerate(shades):
        c = by_curve[s['curve']]
        e = doc.by_id.get('shade-%d' % j)
        if e is None: doc.err('SC_NORMAL_SHADE_MISSING:%d' % j); continue
        pts = points_of(e)
        polys[j] = pts
        xa = xl if s['from'] is None else px(s['from'])
        xb = xr if s['to'] is None else px(s['to'])
        if len(pts) < 4 or abs(pts[0][0] - xa) > 0.05 or abs(pts[0][1] - base) > 0.05 or abs(pts[-1][0] - xb) > 0.05 or abs(pts[-1][1] - base) > 0.05: doc.err('SC_NORMAL_SHADE_BASE:%d' % j); continue
        inner = pts[1:-1]
        if abs(inner[0][0] - xa) > 0.05 or abs(inner[-1][0] - xb) > 0.05: doc.err('SC_NORMAL_SHADE_EDGE:%d' % j)
        if any(abs(y - ycurve(c, x)) > 0.05 for x, y in inner) or any(not xa - 0.05 <= x <= xb + 0.05 for x, _ in inner) or any(b[0] < a[0] - 1e-9 for a, b in zip(inner, inner[1:])): doc.err('SC_NORMAL_SHADE_CURVE:%d' % j)
        if e.get('fill') != '#111' or abs(float(e.get('fill-opacity') or 0) - NORM_OPACITY[s['tone']]) > 1e-9 or e.get('data-curve') != c['id']: doc.err('SC_NORMAL_SHADE_STYLE:%d' % j)
        for side, u in (('from', s['from']), ('to', s['to'])):
            edge = doc.by_id.get('edge-%d-%s' % (j, side))
            if u is None:
                if edge is not None: doc.err('SC_NORMAL_EDGE_UNEXPECTED:%d:%s' % (j, side))
                continue
            expected_lines.add('edge-%d-%s' % (j, side))
            x = px(u)
            if edge is None or abs(num(edge, 'x1') - x) > 0.05 or abs(num(edge, 'x2') - x) > 0.05 or abs(num(edge, 'y1') - base) > 0.05 or abs(num(edge, 'y2') - ycurve(c, x)) > 0.05: doc.err('SC_NORMAL_EDGE:%d:%s' % (j, side))
        # the area as drawn: the polygon's area against the whole bell (height x sd in pixels x sqrt(2 pi)), compared with the exact area inside the window
        z_lo = float(lo) if framed else float((lo - c['mean']) / c['sd'])
        z_hi = float(hi) if framed else float((hi - c['mean']) / c['sd'])
        exact = normal_area(max(z_lo, s['za']) if s['za'] is not None else z_lo, min(z_hi, s['zb']) if s['zb'] is not None else z_hi)
        drawn = shoelace(pts) / whole_bell(c)
        drawn_area[j], exact_window[j] = drawn, exact
        if abs(drawn - exact) > NORM_MEASURED_TOL: doc.err('SC_NORMAL_SHADE_AREA:%d' % j)
        if s['label'] is not None and NORM_AREA_SUM.match(s['label']):
            value = float(label_value(s['label']))
            if abs(value - s['area']) > NORM_AREA_TOL or abs(value - drawn) > NORM_AREA_TOL + NORM_MEASURED_TOL + (s['area'] - exact): doc.err('SC_NORMAL_AREA_LABEL_VALUE:%d' % j)
    for i, a in enumerate(shades):
        for k, b in enumerate(shades[i + 1:], i + 1):
            if a['label'] is not None and a['label'] == b['label'] and re.fullmatch(r'[A-Za-z]', a['label']) and i in drawn_area and k in drawn_area:
                if abs(drawn_area[i] + (a['area'] - exact_window[i]) - drawn_area[k] - (b['area'] - exact_window[k])) > NORM_MEASURED_TOL: doc.err('SC_NORMAL_EQUAL_AREAS:%d:%d' % (i, k))
    # symmetric pairs: dotted lines at both positions up to the curve and a level line between their tops
    for s, sy in enumerate(plan['symmetry']):
        c = by_curve[sy['curve']]
        xa, xb = px(sy['pair'][0]), px(sy['pair'][1])
        for side, x in (('a', xa), ('b', xb)):
            expected_lines.add('sym-%d-%s' % (s, side))
            e = doc.by_id.get('sym-%d-%s' % (s, side))
            if e is None or abs(num(e, 'x1') - x) > 0.05 or abs(num(e, 'x2') - x) > 0.05 or abs(num(e, 'y1') - base) > 0.05 or abs(num(e, 'y2') - ycurve(c, x)) > 0.05 or not e.get('stroke-dasharray'): doc.err('SC_NORMAL_SYMMETRY_LINE:%d:%s' % (s, side))
        expected_lines.add('sym-%d-bar' % s)
        e = doc.by_id.get('sym-%d-bar' % s)
        y = ycurve(c, xa)
        if e is None or abs(num(e, 'x1') - xa) > 0.05 or abs(num(e, 'x2') - xb) > 0.05 or abs(num(e, 'y1') - y) > 0.05 or abs(num(e, 'y2') - y) > 0.05 or abs(ycurve(c, xb) - y) > 0.05: doc.err('SC_NORMAL_SYMMETRY_BAR:%d' % s)
    # area labels: inside their area, or outside with a leader that ends in a dot inside it
    dots = {e.get('data-shade'): e for e in doc.circles if e.get('data-role') == 'area-dot'}
    leaders = {e.get('data-shade'): e for e in doc.role('line', 'area-leader')}
    for j, s in enumerate(shades):
        label = got.get('area-%d' % j)
        if s['label'] is None:
            if str(j) in dots or str(j) in leaders: doc.err('SC_NORMAL_AREA_LEADER_UNEXPECTED:%d' % j)
            continue
        if label is None or j not in polys: continue
        bx, by, bw, bh = box_of(label)
        poly = polys[j]
        nx, ny = int(bw // 2) + 1, int(bh // 2) + 1
        samples = [(bx + k * 2.0, by) for k in range(nx)] + [(bx + bw, by)] + [(bx + k * 2.0, by + bh) for k in range(nx)] + [(bx + bw, by + bh)] + [(bx, by + k * 2.0) for k in range(ny)] + [(bx + bw, by + k * 2.0) for k in range(ny)]
        whole = all(inside_polygon(p, poly) for p in samples)
        dot, leader = dots.get(str(j)), leaders.get(str(j))
        if whole:
            if dot is not None or leader is not None: doc.err('SC_NORMAL_AREA_LEADER_UNEXPECTED:%d' % j)
        else:
            if dot is None or leader is None: doc.err('SC_NORMAL_AREA_LABEL_OUTSIDE:%d' % j); continue
            expected_lines.add('area-%d-leader' % j)
            d = (num(dot, 'cx'), num(dot, 'cy'))
            if not inside_polygon(d, poly) or polygon_clearance(d, poly) < 4: doc.err('SC_NORMAL_AREA_DOT_OUTSIDE:%d' % j)
            ends = [(num(leader, 'x1'), num(leader, 'y1')), (num(leader, 'x2'), num(leader, 'y2'))]
            if math.hypot(ends[1][0] - d[0], ends[1][1] - d[1]) > 0.05 or abs(box_distance((bx, by, bw, bh), ends[0]) - 2.0) > 0.1: doc.err('SC_NORMAL_AREA_LEADER:%d' % j)
            for other in list(doc.lines) + list(doc.root.iter(NS + 'polyline')) + list(doc.root.iter(NS + 'polygon')):
                oid = other.get('id')
                if oid in ('curve-' + shades[j]['curve'], 'shade-%d' % j, 'edge-%d-from' % j, 'edge-%d-to' % j, leader.get('id')) or other.get('data-role') in ('arrow', 'mean-line', 'symmetry'): continue
                pts = [((num(other, 'x1'), num(other, 'y1')), (num(other, 'x2'), num(other, 'y2')))] if other.tag == NS + 'line' else None
                if pts is None:
                    ring = points_of(other)
                    pts = list(zip(ring, ring[1:] + (ring[:1] if other.tag == NS + 'polygon' else [])))[: len(ring) - (0 if other.tag == NS + 'polygon' else 1)]
                if any(segments_cross(ends[0], ends[1], c0, c1) for c0, c1 in pts): doc.err('SC_NORMAL_LEADER_CROSSES:%d:%s' % (j, oid))
    # nothing else is drawn
    if {e.get('id') for e in doc.lines} != expected_lines: doc.err('SC_NORMAL_LINE_SET')
    # labels that had a free place keep clear of every drawn line (but their own leader and dot) and of every other label
    for lid, l in got.items():
        if not (lid.startswith('area-') or lid.endswith('-name')): continue
        box = box_of(l)
        own = {'area-%s-leader' % lid.split('-')[1], 'area-%s-dot' % lid.split('-')[1]} if lid.startswith('area-') else set()
        view = type('View', (), {})()
        view.lines = [e for e in doc.lines if e.get('id') not in own]
        view.circles = [e for e in doc.circles if e.get('id') not in own]
        view.root, view.role = doc.root, doc.role
        if clearance(box, drawn_obstacles(view)) < 2.0: doc.err('SC_NORMAL_LABEL_CLEARANCE:' + lid)
        for oid, o in got.items():
            if oid == lid: continue
            ob = box_of(o)
            if not (box[0] + box[2] + 2 <= ob[0] or ob[0] + ob[2] + 2 <= box[0] or box[1] + box[3] + 2 <= ob[1] or ob[1] + ob[3] + 2 <= box[1]): doc.err('SC_NORMAL_LABELS_CLOSE:%s:%s' % (lid, oid))
        if lid.endswith('-name'):
            e = doc.by_id.get('curve-' + lid[len('curve-'):-len('-name')])
            if e is not None and min(box_distance(box, p) for p in points_of(e)) > 40: doc.err('SC_NORMAL_NAME_FAR:' + lid)
    return {'curves': len(curves), 'ticks': len(ticks), 'shades': [round(s['area'], 4) for s in shades], 'drawnAreas': {str(j): round(v, 4) for j, v in drawn_area.items()}}


AUDITS = {'HISTOGRAM': audit_freq, 'FREQUENCY_POLYGON': audit_freq, 'STEM_LEAF': audit_stem, 'BOX_PLOT': audit_box, 'SCATTER': audit_scatter, 'DICE_TABLE': audit_dice, 'TREE': audit_tree, 'DOT_PLOT': audit_dot, 'NORMAL_CURVE': audit_normal}


def audit(chart, svg):
    kind = chart.get('kind') if isinstance(chart, dict) else None
    if kind not in AUDITS: fail('STAT_KIND_UNSUPPORTED')
    doc = Doc(svg, kind)
    observed = AUDITS[kind](chart, doc)
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if doc.errors else 'PASS', 'errors': doc.errors, 'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(), 'observed': observed}
