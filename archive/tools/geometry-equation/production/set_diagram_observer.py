"""Independent set-diagram observer. Does not import the producer.

Re-derives the atomic regions of the plan's sets, the truth of the plan's set expression on every cell and the declared
correspondence, then reads the FINAL SVG: the circle/oval geometry comes from the drawn elements, each element label's box from
its own transform and embedded fragment, every shaded path is sampled point by point and every arrow is traced from its source
label box to its target label box. Nothing the producer states about its own shading or placement is trusted.
"""
import hashlib
import math
import re
import xml.etree.ElementTree as ET

NS = '{http://www.w3.org/2000/svg}'
TOL = 0.75
LABEL_TOL = 2.0
CAPABILITY = 'set-diagram-figure-v1'
SHADE_FILL = '#cfcfcf'
SAMPLE_STEP = 4.0
BOUNDARY_CLEAR = 4.0


def fail(code):
    raise ValueError(code)


def num(element, name):
    try:
        value = float(element.get(name))
    except (TypeError, ValueError):
        fail('SD_SVG_ATTRIBUTE_INVALID:' + name)
    if not math.isfinite(value):
        fail('SD_SVG_ATTRIBUTE_INVALID:' + name)
    return value


def overlap(a, b):
    return a[0] < b[0] + b[2] - 0.25 and b[0] < a[0] + a[2] - 0.25 and a[1] < b[1] + b[3] - 0.25 and b[1] < a[1] + a[3] - 0.25


class Doc:
    def __init__(self, svg, kind):
        self.errors = []
        self.root = ET.fromstring(svg)
        if self.root.get('data-set-diagram') != CAPABILITY:
            self.errors.append('SD_SVG_NOT_A_SET_DIAGRAM')
        if self.root.get('data-kind') != kind:
            self.errors.append('SD_KIND_MISMATCH')
        self.by_id = {e.get('id'): e for e in self.root.iter() if e.get('id')}
        self.labels = [e for e in self.root.iter(NS + 'g') if e.get('data-label-role')]
        self.owners = {}
        for label in self.labels:
            self.owners.setdefault(label.get('data-owner'), []).append(label)
        self.errors_seen = set()

    def err(self, code):
        if code not in self.errors_seen:
            self.errors_seen.add(code)
            self.errors.append(code)

    def role(self, tag, role):
        return [e for e in self.root.iter(NS + tag) if e.get('data-role') == role]

    def label_role(self, role):
        return [l for l in self.labels if l.get('data-label-role') == role]

    def label_box(self, label):
        """The box the label actually occupies: its translate plus the width/height of the embedded fragment."""
        transform = (label.get('transform') or '').strip()
        match = re.fullmatch(r'translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)', transform)
        stated = None
        if label.get('data-box'):
            try:
                stated = tuple(float(v) for v in label.get('data-box').split(','))
            except ValueError:
                self.err('SD_LABEL_BOX_UNREADABLE:' + str(label.get('id')))
        fragments = [e for e in label if e.tag == NS + 'svg']
        if match and len(fragments) == 1:
            try:
                width = float(fragments[0].get('width'))
                height = float(fragments[0].get('height'))
            except (TypeError, ValueError):
                fail('SD_LABEL_FRAGMENT_INVALID:' + str(label.get('id')))
            box = (float(match.group(1)), float(match.group(2)), width, height)
            if stated is not None and (abs(stated[0] - box[0]) > 0.75 or abs(stated[1] - box[1]) > 0.75
                                       or abs(stated[2] - box[2]) > 0.75 or abs(stated[3] - box[3]) > 0.75):
                self.err('SD_LABEL_BOX_MISMATCH:' + str(label.get('id')))
            return box
        if stated is not None:
            return stated
        fail('SD_LABEL_BOX_MISSING:' + str(label.get('id')))

    def box_centre(self, label):
        x, y, w, h = self.label_box(label)
        return x + w / 2, y + h / 2

    def shown_text(self, label):
        return label.get('data-text') if label.get('data-text') is not None else label.get('data-tex')

    def near(self, a, b, code, tol=TOL):
        if abs(a - b) > tol:
            self.err(code)


# --- set expressions: U, the set ids, union, intersection, difference and a postfix complement ------------------------------------------
def parse_expression(raw, set_ids):
    if not isinstance(raw, str) or not raw or len(raw) > 80:
        fail('SD_SHADE_INVALID')
    text = raw.replace('^C', 'ᶜ').replace('^c', 'ᶜ')
    text = re.sub(r'\s+', '', text)
    ids = set(set_ids)
    position = [0]

    def peek():
        return text[position[0]] if position[0] < len(text) else None

    def take():
        ch = peek()
        position[0] += 1
        return ch

    def expr():
        value = term()
        while peek() in ('∪', '-'):
            op = take()
            right = term()
            left = value
            value = (lambda mask, l=left, r=right: l(mask) or r(mask)) if op == '∪' else \
                (lambda mask, l=left, r=right: l(mask) and not r(mask))
        return value

    def term():
        value = factor()
        while peek() == '∩':
            take()
            left = value
            right = factor()
            value = lambda mask, l=left, r=right: l(mask) and r(mask)
        return value

    def factor():
        value = atom()
        while peek() == 'ᶜ':
            take()
            inner = value
            value = lambda mask, fn=inner: not fn(mask)
        return value

    def atom():
        ch = take()
        if ch is None:
            fail('SD_SHADE_INVALID')
        if ch == '(':
            value = expr()
            if take() != ')':
                fail('SD_SHADE_INVALID')
            return value
        if ch == 'U':
            return lambda mask: True
        if ch in ids:
            index = set_ids.index(ch)
            return lambda mask, i=index: ((mask >> i) & 1) == 1
        fail('SD_SHADE_INVALID')

    fn = expr()
    if position[0] != len(text):
        fail('SD_SHADE_INVALID')
    return fn


# --- geometry -------------------------------------------------------------------------------------------------------------------------------
def ellipse_of(element):
    return {'cx': num(element, 'cx'), 'cy': num(element, 'cy'), 'rx': num(element, 'rx'), 'ry': num(element, 'ry'),
            'id': element.get('id')}


def norm2(x, y, ellipse):
    return ((x - ellipse['cx']) / ellipse['rx']) ** 2 + ((y - ellipse['cy']) / ellipse['ry']) ** 2


def margin_px(x, y, ellipse):
    return abs(math.sqrt(norm2(x, y, ellipse)) - 1) * min(ellipse['rx'], ellipse['ry'])


def inside_ellipse(x, y, ellipse):
    return norm2(x, y, ellipse) < 1.0


def box_relation(box, ellipse):
    x, y, w, h = box
    cx = max(x, min(ellipse['cx'], x + w))
    cy = max(y, min(ellipse['cy'], y + h))
    low = norm2(cx, cy, ellipse)
    high = max(norm2(x, y, ellipse), norm2(x + w, y, ellipse), norm2(x, y + h, ellipse), norm2(x + w, y + h, ellipse))
    if low < 1 < high:
        return 'CROSSES', low, high
    return ('OUTSIDE' if low >= 1 else 'INSIDE'), low, high


def box_membership(box, ellipses, doc, code):
    bits = 0
    for index, ellipse in enumerate(ellipses):
        relation, low, high = box_relation(box, ellipse)
        if relation == 'CROSSES':
            doc.err(code)
            return None
        inside = relation == 'INSIDE'
        scale = min(ellipse['rx'], ellipse['ry'])
        if inside and (1 - math.sqrt(high)) * scale < 2.5:
            doc.err(code)
            return None
        if not inside and (math.sqrt(low) - 1) * scale < 2.5:
            doc.err(code)
            return None
        if inside:
            bits |= 1 << index
    return bits


def box_inside_rect(box, rect, margin=0.0):
    return box[0] >= rect[0] + margin and box[1] >= rect[1] + margin and box[0] + box[2] <= rect[0] + rect[2] - margin and box[1] + box[3] <= rect[1] + rect[3] - margin


# --- shaded paths ---------------------------------------------------------------------------------------------------------------------------
def parse_shade_path(path):
    data = path.get('d') or ''
    stripped = re.sub(r'[\s,]', '', data)
    if not stripped or re.search(r'[^MLZ0-9.\-]', stripped):
        fail('SD_SHADE_PATH_UNREADABLE')
    tokens = re.findall(r'[MLZ]|-?(?:\d+\.?\d*|\.\d+)', data)
    if ''.join(tokens) != stripped:
        fail('SD_SHADE_PATH_UNREADABLE')
    contours, current = [], None
    index = 0
    while index < len(tokens):
        command = tokens[index]
        if command == 'M':
            if index + 2 >= len(tokens):
                fail('SD_SHADE_PATH_UNREADABLE')
            current = [(float(tokens[index + 1]), float(tokens[index + 2]))]
            contours.append(current)
            index += 3
        elif command == 'L':
            if current is None or index + 2 >= len(tokens):
                fail('SD_SHADE_PATH_UNREADABLE')
            current.append((float(tokens[index + 1]), float(tokens[index + 2])))
            index += 3
        elif command == 'Z':
            index += 1
        else:
            # a number without a command: malformed for our subset
            fail('SD_SHADE_PATH_UNREADABLE')
    return [contour for contour in contours if len(contour) >= 3]


def inside_contours(x, y, contours):
    parity = False
    for contour in contours:
        inside = False
        for i in range(len(contour)):
            x1, y1 = contour[i]
            x2, y2 = contour[(i + 1) % len(contour)]
            if (y1 > y) != (y2 > y):
                crossing = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                if crossing > x:
                    inside = not inside
        parity ^= inside
    return parity


# --- Venn -----------------------------------------------------------------------------------------------------------------------------------
def audit_venn(plan, doc):
    sets = [raw['id'] for raw in plan['sets']]
    names = {raw['id']: raw.get('name', raw['id']) for raw in plan['sets']}
    ellipses = doc.role('ellipse', 'set')
    drawn = {e.get('data-set'): ellipse_of(e) for e in ellipses}
    if len(ellipses) != len(sets) or set(drawn) != set(sets):
        doc.err('SD_SET_ELLIPSE_SET')
    ordered = [drawn[s] for s in sets if s in drawn]
    if len(ordered) != len(sets):
        return {'sets': len(sets), 'ellipses': len(ellipses)}
    universal = doc.role('rect', 'universal')
    if len(universal) != 1:
        fail('SD_UNIVERSAL_RECT')
    rect = (num(universal[0], 'x'), num(universal[0], 'y'), num(universal[0], 'width'), num(universal[0], 'height'))
    # universal-set label
    universal_labels = doc.label_role('universal-name')
    if len(universal_labels) != 1 or doc.shown_text(universal_labels[0]) != 'U':
        doc.err('SD_UNIVERSAL_LABEL')
    # set labels
    for set_id in sets:
        labels = [l for l in doc.label_role('set-name') if l.get('data-set') == set_id]
        if len(labels) != 1:
            doc.err('SD_SET_LABEL:' + set_id)
            continue
        label = labels[0]
        if doc.shown_text(label) != names[set_id]:
            doc.err('SD_SET_LABEL_TEXT:' + set_id)
        box, ellipse = doc.label_box(label), drawn[set_id]
        centre = (box[0] + box[2] / 2, box[1] + box[3] / 2)
        if not box_inside_rect(box, rect, 1.0):
            doc.err('SD_SET_LABEL_OUTSIDE:' + set_id)
        if inside_ellipse(centre[0], centre[1], ellipse):
            doc.err('SD_SET_LABEL_INSIDE_SET:' + set_id)
        nearest = min(math.hypot(centre[0] - (ellipse['cx'] + ellipse['rx'] * math.cos(t / 90 * math.pi)),
                                 centre[1] - (ellipse['cy'] + ellipse['ry'] * math.sin(t / 90 * math.pi))) for t in range(360))
        if nearest > 60:
            doc.err('SD_SET_LABEL_NOT_NEXT_TO_SET:' + set_id)
    # element labels: each inside exactly the declared cell
    element_labels = {l.get('data-element'): l for l in doc.label_role('element')}
    if len(element_labels) != len(plan.get('elements') or []) or set(element_labels) != {str(i) for i in range(len(plan.get('elements') or []))}:
        doc.err('SD_ELEMENT_LABEL_SET')
    for index, element in enumerate(plan.get('elements') or []):
        label = element_labels.get(str(index))
        if label is None:
            continue
        if doc.shown_text(label) != element['text']:
            doc.err('SD_ELEMENT_TEXT:%d' % index)
        box = doc.label_box(label)
        if not box_inside_rect(box, rect, 1.0):
            doc.err('SD_ELEMENT_OUTSIDE_UNIVERSAL:%d' % index)
        bits = box_membership(box, ordered, doc, 'SD_ELEMENT_REGION:%d' % index)
        if bits is None:
            continue
        want = 0
        for set_id in element.get('in') or []:
            want |= 1 << sets.index(set_id)
        if bits != want:
            doc.err('SD_ELEMENT_REGION:%d' % index)
    # shading
    shade = plan.get('shade')
    shade_paths = doc.role('path', 'shade')
    if shade is None:
        if shade_paths:
            doc.err('SD_SHADE_UNEXPECTED')
        return {'sets': len(sets), 'elements': len(plan.get('elements') or [])}
    fn = parse_expression(shade, sets)
    contours = []
    for path in shade_paths:
        if (path.get('fill') or '').lower() != SHADE_FILL:
            doc.err('SD_SHADE_FILL')
        if not path.get('data-cell'):
            doc.err('SD_SHADE_CELL_MISSING')
        for contour in parse_shade_path(path):
            for x, y in contour:
                if x < rect[0] - 1 or y < rect[1] - 1 or x > rect[0] + rect[2] + 1 or y > rect[1] + rect[3] + 1:
                    doc.err('SD_SHADE_OUTSIDE_UNIVERSAL')
                    break
            contours.append(contour)
    if not contours:
        doc.err('SD_SHADE_MISSING')
        return {'sets': len(sets), 'elements': len(plan.get('elements') or [])}
    expected_total = actual_total = mismatch = 0
    steps_x = int((rect[2] - 2 * BOUNDARY_CLEAR) / SAMPLE_STEP)
    steps_y = int((rect[3] - 2 * BOUNDARY_CLEAR) / SAMPLE_STEP)
    for j in range(steps_y + 1):
        y = rect[1] + BOUNDARY_CLEAR + j * SAMPLE_STEP
        for i in range(steps_x + 1):
            x = rect[0] + BOUNDARY_CLEAR + i * SAMPLE_STEP
            if min(margin_px(x, y, ellipse) for ellipse in ordered) < BOUNDARY_CLEAR:
                continue
            bits = 0
            for index, ellipse in enumerate(ordered):
                if inside_ellipse(x, y, ellipse):
                    bits |= 1 << index
            want = bool(fn(bits))
            got = inside_contours(x, y, contours)
            expected_total += want
            actual_total += got
            if want != got:
                mismatch += 1
    if expected_total == 0:
        doc.err('SD_SHADE_EMPTY')
    else:
        if mismatch:
            doc.err('SD_SHADE_MISMATCH:%d' % mismatch)
        if abs(actual_total - expected_total) / expected_total > 0.04:
            doc.err('SD_SHADE_AREA')
    return {'sets': len(sets), 'elements': len(plan.get('elements') or []), 'shadeSamples': expected_total, 'mismatch': mismatch}


# --- mapping --------------------------------------------------------------------------------------------------------------------------------
def segment_hits_box(a, b, box):
    (x1, y1), (x2, y2) = a, b
    bx, by, bw, bh = box
    if abs(x2 - x1) < 1e-9:
        if x1 < bx or x1 > bx + bw:
            return False
        return max(y1, y2) > by and min(y1, y2) < by + bh
    low, high = 0.0, 1.0
    for p, q in ((-(x2 - x1), x1 - bx), (x2 - x1, bx + bw - x1), (-(y2 - y1), y1 - by), (y2 - y1, by + bh - y1)):
        if abs(p) < 1e-9:
            if q < 0:
                return False
            continue
        t = q / p
        if p < 0:
            low = max(low, t)
        else:
            high = min(high, t)
        if low > high:
            return False
    return high > 0 and low < 1


def audit_mapping(plan, doc):
    columns = plan['columns']
    ovals = doc.role('ellipse', 'oval')
    drawn = {int(e.get('data-column', -1)): ellipse_of(e) for e in ovals}
    if len(ovals) != len(columns) or set(drawn) != set(range(len(columns))):
        fail('SD_OVAL_SET')
    ordered = [drawn[i] for i in range(len(columns))]
    names = doc.label_role('column-name')
    for index, column in enumerate(columns):
        labels = [l for l in names if l.get('data-column') == str(index)]
        if len(labels) != 1:
            doc.err('SD_COLUMN_NAME:%d' % index)
            continue
        if doc.shown_text(labels[0]) != column.get('name', column['id']):
            doc.err('SD_COLUMN_NAME_TEXT:%d' % index)
        box = doc.label_box(labels[0])
        if box[1] + box[3] > ordered[index]['cy'] - ordered[index]['ry'] + 4:
            doc.err('SD_COLUMN_NAME_PLACE:%d' % index)
    elements = {(l.get('data-column'), l.get('data-element')): l for l in doc.label_role('element')}
    expected = {(str(c), str(e)) for c, column in enumerate(columns) for e in range(len(column['elements']))}
    if set(elements) != expected:
        doc.err('SD_ELEMENT_LABEL_SET')
    element_boxes = {}
    for c, column in enumerate(columns):
        last_y = -1e9
        for e, text in enumerate(column['elements']):
            label = elements.get((str(c), str(e)))
            if label is None:
                continue
            if doc.shown_text(label) != text:
                doc.err('SD_ELEMENT_TEXT:%d:%d' % (c, e))
            box = doc.label_box(label)
            element_boxes[(c, e)] = box
            relation, _, _ = box_relation(box, ordered[c])
            if relation != 'INSIDE':
                doc.err('SD_ELEMENT_NOT_IN_OVAL:%d:%d' % (c, e))
            for other, oval in enumerate(ordered):
                if other == c:
                    continue
                if box_relation(box, oval)[0] == 'INSIDE':
                    doc.err('SD_ELEMENT_IN_OTHER_OVAL:%d:%d' % (c, e))
            centre_y = box[1] + box[3] / 2
            if centre_y <= last_y:
                doc.err('SD_ELEMENT_ORDER:%d' % c)
            last_y = centre_y
    arrows = {}
    for poly in doc.role('polyline', 'arrow'):
        index = int(poly.get('data-arrow', -1))
        if index in arrows:
            doc.err('SD_ARROW_DUPLICATE:%d' % index)
        arrows[index] = poly
    want = {i: arrow for i, arrow in enumerate(plan['arrows'])}
    if set(arrows) != set(want):
        doc.err('SD_ARROW_SET')
    for index, arrow in want.items():
        poly = arrows.get(index)
        if poly is None:
            continue
        from_column, from_element = int(arrow['from']['column']), int(arrow['from']['element'])
        to_column, to_element = int(arrow['to']['column']), int(arrow['to']['element'])
        if poly.get('data-from-column') != str(from_column) or poly.get('data-from-element') != str(from_element) \
                or poly.get('data-to-column') != str(to_column) or poly.get('data-to-element') != str(to_element):
            doc.err('SD_ARROW_DECLARATION:%d' % index)
        source_box, target_box = element_boxes.get((from_column, from_element)), element_boxes.get((to_column, to_element))
        if source_box is None or target_box is None:
            doc.err('SD_ARROW_ENDPOINT_LABEL:%d' % index)
            continue
        try:
            points = [tuple(float(v) for v in pair.split(',')) for pair in (poly.get('points') or '').split()]
        except ValueError:
            fail('SD_ARROW_POINTS_UNREADABLE')
        if len(points) != 4:
            doc.err('SD_ARROW_POINTS:%d' % index)
            continue
        sy, ty = source_box[1] + source_box[3] / 2, target_box[1] + target_box[3] / 2
        forward = from_column < to_column
        want_start = (source_box[0] + source_box[2] if forward else source_box[0], sy)
        want_end = (target_box[0] if forward else target_box[0] + target_box[2], ty)
        start_gap = points[0][0] - want_start[0] if forward else want_start[0] - points[0][0]
        end_gap = want_end[0] - points[-1][0] if forward else points[-1][0] - want_end[0]
        if not 1.5 <= start_gap <= 7 or abs(points[0][1] - want_start[1]) > LABEL_TOL:
            doc.err('SD_ARROW_START:%d' % index)
        if not 1.5 <= end_gap <= 7 or abs(points[-1][1] - want_end[1]) > LABEL_TOL:
            doc.err('SD_ARROW_END:%d' % index)
        if abs(points[1][1] - sy) > LABEL_TOL or abs(points[2][1] - ty) > LABEL_TOL:
            doc.err('SD_ARROW_STUB:%d' % index)
        if forward and not (points[1][0] > points[0][0] + 4 and points[2][0] < points[3][0] - 4):
            doc.err('SD_ARROW_STUB:%d' % index)
        if not forward and not (points[1][0] < points[0][0] - 4 and points[2][0] > points[3][0] + 4):
            doc.err('SD_ARROW_STUB:%d' % index)
        dashed = poly.get('stroke-dasharray') is not None
        if dashed != (arrow.get('style', 'SOLID') == 'DASHED'):
            doc.err('SD_ARROW_STYLE:%d' % index)
        highlighted = index in set(plan.get('highlight', {}).get('arrows', []))
        try:
            width = float(poly.get('stroke-width'))
        except (TypeError, ValueError):
            width = 1.4
        if (width >= 2.0) != highlighted:
            doc.err('SD_ARROW_HIGHLIGHT:%d' % index)
        heads = [h for h in doc.role('polygon', 'arrow-head') if h.get('data-arrow') == str(index)]
        if len(heads) != 1:
            doc.err('SD_ARROW_HEAD:%d' % index)
        else:
            try:
                head = [tuple(float(v) for v in pair.split(',')) for pair in (heads[0].get('points') or '').split()]
            except ValueError:
                fail('SD_ARROW_HEAD_UNREADABLE')
            if len(head) != 3:
                doc.err('SD_ARROW_HEAD:%d' % index)
            else:
                tip = points[-1]
                distances = sorted(math.hypot(px - tip[0], py - tip[1]) for px, py in head)
                if distances[0] > 2.5 or not 7 <= distances[1] <= 11 or not 7 <= distances[2] <= 11:
                    doc.err('SD_ARROW_HEAD:%d' % index)
        for a, b in zip(points, points[1:]):
            for (c, e), box in element_boxes.items():
                if (c, e) in ((from_column, from_element), (to_column, to_element)):
                    continue
                if segment_hits_box(a, b, (box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2)):
                    doc.err('SD_ARROW_CROSSES_LABEL:%d' % index)
    marked = {}
    for rect in doc.role('rect', 'element-highlight'):
        key = (int(rect.get('data-column', -1)), int(rect.get('data-element', -1)))
        if key in marked:
            doc.err('SD_ELEMENT_HIGHLIGHT_DUPLICATE')
        marked[key] = rect
    wanted_marks = {(int(spot['column']), int(spot['element'])) for spot in plan.get('highlight', {}).get('elements', [])}
    if set(marked) != wanted_marks:
        doc.err('SD_ELEMENT_HIGHLIGHT_SET')
    for key, rect in marked.items():
        box = element_boxes.get(key)
        if box is None:
            doc.err('SD_ELEMENT_HIGHLIGHT_SET')
            continue
        x, y, w, h = num(rect, 'x'), num(rect, 'y'), num(rect, 'width'), num(rect, 'height')
        if x > box[0] or y > box[1] or x + w < box[0] + box[2] or y + h < box[1] + box[3]:
            doc.err('SD_ELEMENT_HIGHLIGHT_PLACE:%d:%d' % key)
        if w - box[2] > 16 or h - box[3] > 16:
            doc.err('SD_ELEMENT_HIGHLIGHT_PLACE:%d:%d' % key)
    return {'columns': len(columns), 'arrows': len(plan['arrows']), 'isFunction': plan_is_function(plan)}


def plan_is_function(plan):
    seen = set()
    for arrow in plan['arrows']:
        key = (arrow['from']['column'], arrow['from']['element'])
        if key in seen:
            return False
        seen.add(key)
    return True


def audit_table(plan, doc):
    """Membership table: re-derive every cell from the plan, then read the drawn grid, labels and marks.

    The cell rectangles come from the FINAL SVG (the frame plus the drawn separator lines), never from the producer's
    layout numbers. A mark is required exactly in the cells where the plan says the element is a member and forbidden
    everywhere else.
    """
    sets = [raw['id'] for raw in plan['sets']]
    names = {raw['id']: raw.get('name', raw['id']) for raw in plan['sets']}
    elements = plan.get('elements') or []
    frames = doc.role('rect', 'table-frame')
    if len(frames) != 1:
        fail('SD_TABLE_FRAME')
    frame = frames[0]
    x0, y0 = num(frame, 'x'), num(frame, 'y')
    x1, y1 = x0 + num(frame, 'width'), y0 + num(frame, 'height')
    vertical_lines = doc.role('line', 'grid-v')
    horizontal_lines = doc.role('line', 'grid-h')
    for line in vertical_lines:
        x, top, bottom = num(line, 'x1'), num(line, 'y1'), num(line, 'y2')
        if abs(num(line, 'x2') - x) > 0.5 or not (x0 + 2 <= x <= x1 - 2):
            doc.err('SD_TABLE_GRID')
        if abs(top - y0) > 1 or abs(bottom - y1) > 1:
            doc.err('SD_TABLE_GRID')
    for line in horizontal_lines:
        y, left, right = num(line, 'y1'), num(line, 'x1'), num(line, 'x2')
        if abs(num(line, 'y2') - y) > 0.5 or not (y0 + 2 <= y <= y1 - 2):
            doc.err('SD_TABLE_GRID')
        if abs(left - x0) > 1 or abs(right - x1) > 1:
            doc.err('SD_TABLE_GRID')
    vertical = sorted(num(line, 'x1') for line in vertical_lines)
    horizontal = sorted(num(line, 'y1') for line in horizontal_lines)
    if len(vertical) != len(sets) or len(horizontal) != len(elements):
        doc.err('SD_TABLE_GRID')
        return {'sets': len(sets), 'elements': len(elements)}
    xs = [x0] + vertical + [x1]
    ys = [y0] + horizontal + [y1]
    if any(b <= a for a, b in zip(xs, xs[1:])) or any(b <= a for a, b in zip(ys, ys[1:])):
        doc.err('SD_TABLE_GRID')
        return {'sets': len(sets), 'elements': len(elements)}

    def cell(column, row):
        # column 0 is the element column; set column j is column j+1. Row 0 is the header row; element i is row i+1.
        return (xs[column], ys[row], xs[column + 1] - xs[column], ys[row + 1] - ys[row])

    def centred(box, target, code):
        cx, cy = box[0] + box[2] / 2, box[1] + box[3] / 2
        tx, ty = target[0] + target[2] / 2, target[1] + target[3] / 2
        if math.hypot(cx - tx, cy - ty) > 3.0:
            doc.err(code)

    headers = doc.label_role('col-set')
    if len(headers) != len(sets):
        doc.err('SD_TABLE_HEADER')
    for column, set_id in enumerate(sets):
        labels = [l for l in headers if l.get('data-set') == set_id]
        if len(labels) != 1:
            doc.err('SD_TABLE_HEADER:' + set_id)
            continue
        if doc.shown_text(labels[0]) != names[set_id]:
            doc.err('SD_TABLE_HEADER_TEXT:' + set_id)
        centred(doc.label_box(labels[0]), cell(column + 1, 0), 'SD_TABLE_HEADER_PLACE:' + set_id)
    rows = doc.label_role('row-element')
    if len(rows) != len(elements):
        doc.err('SD_TABLE_ELEMENT')
    for index, element in enumerate(elements):
        labels = [l for l in rows if l.get('data-element') == str(index)]
        if len(labels) != 1:
            doc.err('SD_TABLE_ELEMENT:%d' % index)
            continue
        if doc.shown_text(labels[0]) != element['text']:
            doc.err('SD_TABLE_ELEMENT_TEXT:%d' % index)
        centred(doc.label_box(labels[0]), cell(0, index + 1), 'SD_TABLE_ELEMENT_PLACE:%d' % index)

    marks = {}
    for mark in doc.role('circle', 'membership'):
        key = (mark.get('data-element'), mark.get('data-set'))
        if key in marks:
            doc.err('SD_TABLE_MARK_DUPLICATE')
        marks[key] = mark
    expected = {(str(index), set_id) for index, element in enumerate(elements) for set_id in element.get('in') or []}
    if set(marks) != expected:
        doc.err('SD_TABLE_MARK_SET')
    for (index, set_id), mark in marks.items():
        if index not in {str(i) for i in range(len(elements))} or set_id not in sets:
            doc.err('SD_TABLE_MARK_SET')
            continue
        column, row = sets.index(set_id) + 1, int(index) + 1
        box = cell(column, row)
        cx, cy = num(mark, 'cx'), num(mark, 'cy')
        if not (box[0] + 1 <= cx <= box[0] + box[2] - 1 and box[1] + 1 <= cy <= box[1] + box[3] - 1):
            doc.err('SD_TABLE_MARK_PLACE:%s:%s' % (index, set_id))
        radius = num(mark, 'r')
        if not 3 <= radius <= 7:
            doc.err('SD_TABLE_MARK_RADIUS:%s:%s' % (index, set_id))
    return {'sets': len(sets), 'elements': len(elements), 'marks': len(marks)}


def audit(diagram, svg):
    kind = diagram.get('kind') if isinstance(diagram, dict) else None
    if kind not in ('VENN', 'MAPPING', 'MEMBERSHIP_TABLE'):
        fail('SET_KIND_UNSUPPORTED')
    doc = Doc(svg, kind)
    if kind == 'VENN':
        observed = audit_venn(diagram, doc)
    elif kind == 'MAPPING':
        observed = audit_mapping(diagram, doc)
    else:
        observed = audit_table(diagram, doc)
    # label boxes may never overlap one another
    boxes = [doc.label_box(label) for label in doc.labels]
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            if overlap(boxes[i], boxes[j]):
                doc.err('SD_LABEL_OVERLAP')
                break
    raw = svg.encode('utf-8')
    return {'status': 'FAIL' if doc.errors else 'PASS', 'errors': doc.errors,
            'finalSvgSha256': 'sha256:' + hashlib.sha256(raw).hexdigest(), 'observed': observed}
