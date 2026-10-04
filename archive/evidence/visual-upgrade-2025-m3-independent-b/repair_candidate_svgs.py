#!/usr/bin/env python3
"""Apply the audited typography, owner-label and fact-role repairs to final SVG bytes."""
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

EVID = Path('archive/evidence/visual-upgrade-2025-m3-independent-b')
BLUE = '#1f5f9f'
TEAL = '#3e7773'
MATH_FONT = 'Times New Roman,Cambria Math,serif'
TEXT_FONT = 'Arial,Malgun Gothic,sans-serif'

RENAMES = {
    'pt-I': 'pt-O', 'pt-F': 'pt-P', 'pt-E': 'pt-R', 'pt-D': 'pt-Q',
    'label-point-I': 'label-point-O', 'label-point-F': 'label-point-P',
    'label-point-E': 'label-point-R', 'label-point-D': 'label-point-Q',
    'seg-AF': 'seg-AP', 'seg-BF': 'seg-BP', 'seg-AE': 'seg-AR',
    'seg-CE': 'seg-CR', 'seg-BD': 'seg-BQ', 'seg-CD': 'seg-CQ',
    'tick-AF-1': 'tick-AP-1', 'tick-BF-1': 'tick-BP-1', 'tick-BF-2': 'tick-BP-2',
    'tick-AE-1': 'tick-AR-1', 'tick-CE-1': 'tick-CR-1', 'tick-CE-2': 'tick-CR-2',
    'tick-CE-3': 'tick-CR-3', 'tick-BD-1': 'tick-BQ-1', 'tick-BD-2': 'tick-BQ-2',
    'tick-CD-1': 'tick-CQ-1', 'tick-CD-2': 'tick-CQ-2', 'tick-CD-3': 'tick-CQ-3',
}

def fmt(v):
    return f'{v:.6f}'.rstrip('0').rstrip('.')

def children_by_id(root):
    return {node.get('id'): node for node in root.iter() if node.get('id')}

def find_parent(root, child):
    for parent in root.iter():
        if child in list(parent):
            return parent
    return root

def add_segment_tick(root, segment_id, tick_id):
    ids = children_by_id(root)
    seg = ids['seg-' + segment_id]
    x1, y1, x2, y2 = (float(seg.get(key)) for key in ('x1', 'y1', 'x2', 'y2'))
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    nx, ny = -dy / length, dx / length
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    half = 4.5
    tick = ET.Element('{http://www.w3.org/2000/svg}line', {
        'id': tick_id,
        'data-owner-segment': 'seg-' + segment_id,
        'data-fact-role': 'GIVEN',
        'x1': fmt(mx - nx * half), 'y1': fmt(my - ny * half),
        'x2': fmt(mx + nx * half), 'y2': fmt(my + ny * half),
        'stroke': '#202124', 'stroke-width': '1.45',
    })
    find_parent(root, seg).append(tick)

def encode(root):
    return ET.tostring(root, encoding='unicode', xml_declaration=False) + '\n'

def transform(path):
    root = ET.parse(path).getroot()
    exam = path.parent.name
    qid = int(path.stem.removeprefix('q').removesuffix('-solution'))
    sourceIdentityRepair = exam.startswith('25_풍덕중') and qid == 18
    if sourceIdentityRepair:
        for node in list(root.iter()):
            ident = node.get('id')
            if ident in RENAMES:
                node.set('id', RENAMES[ident])
            for attr in ('data-owner-point', 'data-owner-segment', 'data-owner-vertex'):
                value = node.get(attr)
                if value:
                    node.set(attr, RENAMES.get(value, value))
            for attr in ('data-owner-rays', 'data-angle-rays'):
                value = node.get(attr)
                if value:
                    node.set(attr, ' '.join(RENAMES.get(part, part) for part in value.split()))

    ids = children_by_id(root)
    # Use the original point names on the tangential triangle. The diagram's
    # geometry and owner segments already follow the source side lengths.
    if exam.startswith('25_풍덕중') and qid == 18:
        label_text = {
            'label-point-O': 'O', 'label-point-P': 'P',
            'label-point-Q': 'Q', 'label-point-R': 'R',
        }
        for ident, value in label_text.items():
            if ident not in ids:
                raise ValueError(f'RENAMED_SOURCE_LABEL_MISSING:{ident}')
            ids[ident].text = value
        for tick in root.iter():
            if tick.get('id', '').startswith('tick-'):
                tick.set('stroke', TEAL)
                tick.set('stroke-width', '1.5')
                tick.set('data-fact-role', 'DERIVED_INTERMEDIATE')

    # Remove helper letters absent from the source. Keep O and the asked x wedge.
    if exam.startswith('25_풍덕중') and qid == 17:
        for ident in ('label-point-P', 'label-point-B', 'label-point-C'):
            if ident in ids:
                parent = find_parent(root, ids[ident])
                parent.remove(ids[ident])

    # The source q14 figure names only O and x. Avoid assigning extra letters
    # to constructed chord endpoints and perpendicular feet.
    if exam.startswith('25_풍덕중') and qid == 14:
        for ident in ('label-point-A', 'label-point-B', 'label-point-H',
                      'label-point-E', 'label-point-F', 'label-point-N'):
            if ident in ids:
                find_parent(root, ids[ident]).remove(ids[ident])
    if exam.startswith('25_풍덕중') and qid == 22:
        ids['label-length-CD'].set('x', '205')
        ids['label-length-CD'].set('y', '130')
        ids['label-length-CD'].set('text-anchor', 'start')
        ids['label-length-AB'].text = '1.5'
        ids['label-length-AB'].set('x', '68')
        ids['label-length-AB'].set('y', '212')
        ids['label-length-AB'].set('text-anchor', 'end')

    # Correct the false given-style encoding: PA=PB is the conclusion of this
    # proof question. Show only the given equal radii OA=OB with matching marks.
    if exam.startswith('25_풍덕중') and qid == 20:
        for ident in ('tick-PA-1', 'tick-PB-1'):
            if ident in ids:
                find_parent(root, ids[ident]).remove(ids[ident])
        ids = children_by_id(root)
        if 'tick-OA-1' not in ids:
            add_segment_tick(root, 'OA', 'tick-OA-1')
        if 'tick-OB-1' not in ids:
            add_segment_tick(root, 'OB', 'tick-OB-1')

    # Fact roles are visible in the bytes as well as in the final evidence row.
    if exam.startswith('25_풍덕중') and qid == 15:
        locus = ids['circle-midpointLocus']
        locus.set('stroke', BLUE)
        locus.set('stroke-width', '1.8')
        locus.set('data-encoding-role', 'CONCLUSION_STYLE')
        for ident in ('right-angle-M', 'right-angle-N'):
            ids[ident].set('stroke', TEAL)
            ids[ident].set('data-fact-role', 'DERIVED_INTERMEDIATE')
    if exam.startswith('25_왕운중') and qid == 11:
        ids['label-length-AH'].set('fill', BLUE)
        ids['label-length-AH'].set('data-encoding-role', 'CONCLUSION_STYLE')
        ids['label-length-CH'].set('fill', TEAL)
        ids['label-length-CH'].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 13:
        for ident in ('label-length-BH', 'label-length-HC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 22:
        for ident in ('label-length-BD', 'label-length-CD'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 7:
        ids['note-answer'].set('fill', BLUE)
        ids['note-answer'].set('data-encoding-role', 'CONCLUSION_STYLE')
    if exam.startswith('25_왕운중') and qid == 10:
        ids['label-point-C'].set('x', '105')
        ids['label-point-C'].set('y', '229')
        ids['label-point-C'].set('text-anchor', 'start')
        note = ids['note-note-ratio']
        note.set('y', '263')
        note.text = 'sin A : cos B = 1 : 1'
        note.set('fill', BLUE)
        note.set('data-encoding-role', 'CONCLUSION_STYLE')
        for ident in ('label-angle-A', 'label-angle-B'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_왕운중') and qid == 22:
        note = ids['note-note-ratios']
        note.set('fill', BLUE)
        note.set('data-encoding-role', 'CONCLUSION_STYLE')
    if exam.startswith('25_왕운중') and qid == 6:
        ids['label-length-CH'].set('fill', TEAL)
        ids['label-length-CH'].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_왕운중') and qid == 21:
        ids['label-length-AH'].set('fill', TEAL)
        ids['label-length-AH'].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 2:
        for ident in ('label-length-AC', 'label-length-BC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 13:
        for ident in ('label-length-AH', 'label-length-BH', 'label-length-HC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 2:
        for ident in ('label-length-AC', 'label-length-BC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 6:
        for ident in ('label-length-AB', 'label-length-BC', 'label-length-AC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 7:
        ids['label-length-BC'].set('fill', TEAL)
        ids['label-length-BC'].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_왕운중') and qid == 2:
        for ident in ('label-length-AB', 'label-length-BC', 'label-length-AC'):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_왕운중') and qid == 13:
        for ident in ('label-length-halfAB',):
            ids[ident].set('fill', TEAL)
            ids[ident].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_왕운중') and qid == 2:
        ids['label-length-AC'].set('x', '132')
        ids['label-length-AC'].set('y', '140')
        ids['label-length-AC'].set('text-anchor', 'end')
    if exam.startswith('25_왕운중') and qid == 22:
        ids['label-length-AB'].set('x', '68')
        ids['label-length-AB'].set('y', '125')
        ids['label-length-AB'].set('text-anchor', 'end')
    if exam.startswith('25_왕운중') and qid == 22:
        ids['label-length-AB'].set('x', '68')
        ids['label-length-AB'].set('y', '125')
        ids['label-length-AB'].set('text-anchor', 'end')
    if exam.startswith('25_풍덕중') and qid == 14:
        ids['label-length-radius'].set('fill', TEAL)
        ids['label-length-radius'].set('data-encoding-role', 'DERIVED_STYLE')
    if exam.startswith('25_풍덕중') and qid == 20:
        for ident in ('right-angle-A', 'right-angle-B'):
            ids[ident].set('stroke', TEAL)
            ids[ident].set('data-fact-role', 'DERIVED_INTERMEDIATE')

    for node in root.iter('{http://www.w3.org/2000/svg}text'):
        ident = node.get('id', '')
        kind = node.get('data-label-kind', 'annotation')
        if kind == 'point':
            node.set('font-size', '26px')
            node.set('font-family', MATH_FONT)
            node.set('font-style', 'italic')
            node.set('data-font-role', 'math')
        elif kind in ('length', 'angle'):
            node.set('font-size', '25px')
            node.set('font-family', MATH_FONT)
            node.set('data-font-role', 'math')
        else:
            node.set('font-size', '26px')
            node.set('font-family', MATH_FONT if ident.startswith('note-') else TEXT_FONT)
            node.set('data-font-role', 'math' if ident.startswith('note-') else 'text')
    path.write_text(encode(root), encoding='utf-8')

def remap_nested(value):
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            mapped_key = {'I': 'O', 'F': 'P', 'E': 'R', 'D': 'Q'}.get(key, key)
            out[mapped_key] = remap_nested(item)
        return out
    if isinstance(value, list):
        return [remap_nested(item) for item in value]
    if isinstance(value, str):
        pairs = {'AF': 'AP', 'BF': 'BP', 'AE': 'AR', 'CE': 'CR', 'BD': 'BQ', 'CD': 'CQ'}
        symbols = {'I': 'O', 'F': 'P', 'E': 'R', 'D': 'Q'}
        return RENAMES.get(value, pairs.get(value, symbols.get(value, value)))
    return value

ET.register_namespace('', 'http://www.w3.org/2000/svg')
assetsPath = EVID / 'build_outputs.json'
built = json.loads(assetsPath.read_text(encoding='utf-8'))
for asset in built['assets']:
    svgPath = Path(asset['svgPath'])
    transform(svgPath)
    if svgPath.parent.name.startswith('25_풍덕중') and int(asset['qid']) == 18:
        for key in ('coordinateModel', 'pythonInputs', 'pythonOutputs', 'structuredExpectedFacts', 'actualSvgPrimitives',
                    'pointLabelOwners', 'lengthLabelOwners', 'angleLabelOwners', 'rightAngleMarks', 'congruenceTickOwners'):
            if key in asset:
                asset[key] = remap_nested(asset[key])
        asset['alt'] = str(asset.get('alt', '')).replace('내심 I', '중심 O').replace('I', 'O')
        asset['caption'] = str(asset.get('caption', '')).replace('내심 I', '중심 O').replace('I', 'O')
    if svgPath.parent.name.startswith('25_풍덕중') and int(asset['qid']) == 22:
        label = next(row for row in asset['lengthLabelOwners'] if row['id'] == 'label-length-CD')
        label['position'] = [205, 130]
    raw = svgPath.read_bytes()
    asset['svgSha256'] = 'sha256:' + hashlib.sha256(raw).hexdigest()
    asset['finalSvgSha256'] = asset['svgSha256']
    asset['finalSvgGitBlobSha'] = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    asset['physicalSvgGitBlobSha'] = asset['finalSvgGitBlobSha']

for record in built['assets']:
    key = record['questionUid'].split('|')[-1]
    if record['sourcePath'].endswith('25_왕운중_2학기_중간_중3_수학.js') and int(key) == 10:
        record['expectedFacts'][-1]['statement'] = 'sin A:cos B=1:1 is the CONCLUSION.'
    if record['sourcePath'].endswith('25_풍덕중_2학기_중간_중3_수학.js') and int(key) == 7:
        record['expectedFacts'][-1]['statement'] = 'AC=2√6 is the CONCLUSION.'

built['assetCount'] = len(built['assets'])
built['qualityRepair'] = {
    'finalViewportMinimumCssFontPx': 11,
    'defaultTargetCssFontPx': 12,
    'authoredPointFontPx': 26,
    'authoredLengthAngleFontPx': 25,
    'mathFontFamily': MATH_FONT,
    'textFontFamily': TEXT_FONT,
    'conclusionStyle': BLUE,
    'derivedStyle': TEAL,
}
if built['assetCount'] != 17:
    raise ValueError(f'FINAL_CHANGED_SVG_COUNT_MISMATCH:{built["assetCount"]}')
assetsPath.write_text(json.dumps(built, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'finalChangedSvgCount': built['assetCount'], 'qualityRepair': built['qualityRepair']}, ensure_ascii=False))
