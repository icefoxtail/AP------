"""ROOT-only diagnostic replay of frozen browser measurements; no acceptance changes.
Usage: python replay-layout-diagnostic.py snapshot.json --out trace.json
No browser, publication, Git, or source mutation. sys.setprofile only observes returns.
"""
import argparse
import collections
import dataclasses
import hashlib
import json
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('snapshot')
parser.add_argument('--out', required=True)
args = parser.parse_args()
root = next(p for p in Path(__file__).resolve().parents if (p / 'archive/tools/geometry-equation/visual_engine/engine.py').is_file())
sys.path.insert(0, str(root / 'archive/tools/geometry-equation'))
from visual_engine import label_layout as ll
from visual_engine.engine import build, prepare

snapshot = json.loads(Path(args.snapshot).read_text(encoding='utf-8-sig'))
if snapshot.get('schemaVersion') != 'APMATH_LAYOUT_FAILURE_DIAGNOSTIC_v1':
    raise SystemExit('INVALID_DIAGNOSTIC_SCHEMA')
if not all(key in snapshot for key in ('spec', 'measurements', 'fragments', 'built')):
    raise SystemExit('PREPARE_FAILURE_HAS_NO_LAYOUT_TO_REPLAY')
expected = snapshot['built']
targets = set(expected['witness']['layout']['unresolved'])
rows = {}
passes = 0

def serial(value):
    if dataclasses.is_dataclass(value): return dataclasses.asdict(value)
    if isinstance(value, dict): return {k: serial(v) for k, v in value.items()}
    if isinstance(value, (tuple, list, set, frozenset)): return [serial(v) for v in value]
    return value

def enclosing(frame):
    while frame is not None:
        if frame.f_code.co_name == 'layout_pass' and frame.f_code.co_filename == ll.__file__:
            return frame
        frame = frame.f_back
    return None

def record(label_id, reason, sample=None, blocker=None):
    row = rows.setdefault(label_id, {'counts': collections.Counter(), 'blockerCounts': collections.Counter(), 'samples': {}})
    row['counts'][reason] += 1
    if blocker is not None: row['blockerCounts'][str(blocker.get('id'))] += 1
    samples = row['samples'].setdefault(reason, [])
    if sample is not None and len(samples) < 4: samples.append(serial(sample))

def observe(frame, event, result):
    global passes
    if frame.f_code.co_filename != ll.__file__: return
    name = frame.f_code.co_name
    if event == 'call' and name == 'layout_pass':
        passes += 1
        return
    if event != 'return' or name not in ('acceptable', 'acceptable_fallback', 'leader_clear', 'visible_owner_leader'): return
    outer = enclosing(frame)
    if outer is None: return
    label = outer.f_locals.get('label', {})
    lid = label.get('id')
    if lid not in targets: return
    local = frame.f_locals
    if name in ('acceptable', 'acceptable_fallback'):
        if result:
            record(lid, 'BOX_ACCEPTED_BEFORE_OWNER_LEADER')
            return
        box = local.get('box')
        if box is None: return
        sample = {'pass': passes, 'box': box, 'anchor': label.get('at'), 'target': label.get('target'), 'ownerCheck': local.get('owner_check', True)}
        found = False
        safe = outer.f_locals['safe_area']
        if not safe.contains(box):
            record(lid, 'OUTSIDE_SAFE_AREA', {**sample, 'safeArea': safe}); found = True
        for obstacle in outer.f_locals['occupied']:
            pad = label['labelGap'] if obstacle['kind'] == 'label' and 'labelGap' in label else 6
            if ll.collision(box, obstacle, pad):
                record(lid, 'BOX_COLLISION', {**sample, 'blocker': obstacle}, obstacle); found = True
        if local.get('owner_check', True):
            own = outer.f_locals.get('line_owner')
            if own is not None and not ll.line_label_unambiguous(box, own, outer.f_locals['other_lines'], *outer.f_locals['owner_limits']):
                record(lid, 'LINE_OWNER_AMBIGUOUS', {**sample, 'owner': own, 'limits': outer.f_locals['owner_limits']}); found = True
            marker = outer.f_locals.get('owner_marker')
            if marker is not None and not ll.point_box_has_unambiguous_owner(box, marker, outer.f_locals['competing_markers']):
                record(lid, 'POINT_OWNER_AMBIGUOUS', {**sample, 'owner': marker}); found = True
        if not found: record(lid, 'OTHER_OWNER_OR_SECTOR_REJECTION', sample)
    elif name == 'leader_clear' and result is False:
        obstacle = local.get('obstacle')
        record(lid, 'LEADER_BLOCKED', {'pass': passes, 'from': local.get('start'), 'to': local.get('end'), 'nearStart': local.get('near_start'), 'ownerIds': local.get('owner_ids'), 'blocker': obstacle}, obstacle)
    elif name == 'visible_owner_leader' and result is None:
        record(lid, 'VISIBLE_LEADER_REJECTED', {'pass': passes, 'from': local.get('start'), 'to': local.get('end'), 'box': local.get('box'), 'incident': local.get('incident')})

sys.setprofile(observe)
try:
    actual = build(snapshot['spec'], snapshot['measurements'], snapshot['fragments'], strict_measured_fragments=True)
finally:
    sys.setprofile(None)

sha = lambda text: 'sha256:' + hashlib.sha256(text.encode('utf-8')).hexdigest()
raw_layout_equal = actual['witness']['layout'] == expected['witness']['layout']
# The worker wire serializes Python tuples to JSON arrays; compare at the same boundary.
# Keep the raw comparison visible, and still require every serialized value plus SVG byte to match.
actual_layout_wire = json.loads(json.dumps(actual['witness']['layout'], ensure_ascii=False, allow_nan=False))
layout_wire_equal = actual_layout_wire == expected['witness']['layout']
same = actual['svg'] == expected['svg'] and layout_wire_equal
prepared, labels, obstacles, viewport, semantic, sampling = prepare(snapshot['spec'])
report = {
    'schemaVersion': 'APMATH_LAYOUT_REJECTION_TRACE_v1',
    'status': 'EXACT_REPLAY' if same else 'REPLAY_MISMATCH',
    'classification': 'DIAGNOSTIC_ONLY', 'productionAuthorized': False,
    'snapshotPath': str(Path(args.snapshot).resolve()),
    'identity': snapshot['identity'], 'lineage': snapshot['lineage'],
    'expectedSvgSha256': sha(expected['svg']), 'replayedSvgSha256': sha(actual['svg']),
    'rawPythonLayoutEqualToJsonSnapshot': raw_layout_equal,
    'wireNormalizedLayoutEqual': layout_wire_equal,
    'replayedLayout': actual_layout_wire,
    'layoutPassCount': passes,
    'unresolved': actual['witness']['layout']['unresolved'],
    'coordinateModel': viewport.model(), 'measurements': snapshot['measurements'],
    'labels': labels, 'obstacles': obstacles,
    'placedLabels': actual['witness']['layout']['labels'],
    'leaders': actual['witness']['layout']['leaders'],
    'rejections': rows,
    'notes': ['Counts cover all tried layout passes; counts are not unique candidates.',
              'BOX_ACCEPTED_BEFORE_OWNER_LEADER is not final placement approval.',
              'At most four raw examples per reason; blockerCounts cover all observed rejections.',
              'No solver constants, candidates, return values, or owner rules are changed.']
}
Path(args.out).write_text(json.dumps(serial(report), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'status': report['status'], 'unresolved': report['unresolved'], 'out': str(Path(args.out).resolve())}, ensure_ascii=False))
if not same: raise SystemExit(2)
