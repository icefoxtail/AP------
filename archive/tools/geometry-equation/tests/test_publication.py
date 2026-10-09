"""Synthetic regression contracts frozen independently of SVG/witness output."""
import ast
import copy
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import build, prepare
from visual_engine.label_layout import Box, find_clear_leader_path, leader_clear
from visual_engine.publication import box_owned
from visual_engine.past_exam_adapter import adapt_expected_facts
from visual_engine.coordinate_evidence import _condition_residual
from audit_publication import audit, _coordinate_condition_residual

FIXTURES = Path(__file__).parent/'publication-fixtures'
NS = '{http://www.w3.org/2000/svg}'
ET.register_namespace('', NS)


def load(name='owner-triangle'):
    return json.loads((FIXTURES/(name+'.spec.json')).read_text(encoding='utf-8')), json.loads((FIXTURES/(name+'.review.json')).read_text(encoding='utf-8'))


def check(svg, review, name='owner-triangle', **override):
    args = {'source_bytes': (FIXTURES/(name+'.source.txt')).read_bytes(), 'solution_bytes': (FIXTURES/(name+'.solution.txt')).read_bytes(), **override}
    return audit(svg, review, **args)


def edit(svg, oid, mutate):
    root = ET.fromstring(svg)
    node = next(e for e in root.iter() if e.get('id') == oid)
    mutate(node, root)
    return ET.tostring(root, encoding='utf-8')


def proper_segment_cross(a, b, c, d):
    cross=lambda u,v:u[0]*v[1]-u[1]*v[0]
    ab=(b[0]-a[0],b[1]-a[1]); cd=(d[0]-c[0],d[1]-c[1])
    ac=(c[0]-a[0],c[1]-a[1]); ad=(d[0]-a[0],d[1]-a[1])
    ca=(a[0]-c[0],a[1]-c[1]); cb=(b[0]-c[0],b[1]-c[1])
    return cross(ab,ac)*cross(ab,ad)<0 and cross(cd,ca)*cross(cd,cb)<0


def point_segment_distance_for_test(point, start, end):
    dx,dy=end[0]-start[0],end[1]-start[1]
    length2=dx*dx+dy*dy
    t=0.0 if length2==0 else max(0.0,min(1.0,((point[0]-start[0])*dx+(point[1]-start[1])*dy)/length2))
    return math.dist(point,(start[0]+t*dx,start[1]+t*dy))



def constructed_evidence():
    return {
        'mode':'CONSTRUCTED_REALIZATION',
        'rationale':'Synthetic regression realizes the triangle from metric and perpendicular constraints.',
        'normalization':{'originPoint':'A','xAxisPoint':'B','unitScale':3},
        'freeVariables':[],
        'pointCoordinates':{'A':[0,0],'B':[3,0],'C':[0,3]},
        'conditions':[
            {'id':'AB_LENGTH','kind':'DISTANCE','refs':['A','B'],'expected':3,'tolerance':1e-9},
            {'id':'AC_LENGTH','kind':'DISTANCE','refs':['A','C'],'expected':3,'tolerance':1e-9},
            {'id':'A_RIGHT','kind':'PERPENDICULAR','refs':['A','B','A','C'],'tolerance':1e-9},
        ],
        'constructionSteps':[
            {'id':'STEP_A','operation':'ANCHOR_ORIGIN','output':'A','inputs':[]},
            {'id':'STEP_B','operation':'PLACE_POSITIVE_X','output':'B','inputs':['A','AB_LENGTH']},
            {'id':'STEP_C','operation':'PERPENDICULAR_DISTANCE_INTERSECTION','output':'C','inputs':['A','B','AC_LENGTH','A_RIGHT']},
        ],
        'residualChecks':[
            {'conditionId':'AB_LENGTH','residual':0,'tolerance':1e-9},
            {'conditionId':'AC_LENGTH','residual':0,'tolerance':1e-9},
            {'conditionId':'A_RIGHT','residual':0,'tolerance':1e-9},
        ],
        'degeneracyChecks':[
            {'id':'TRIANGLE_NONDEGENERATE','kind':'NONCOLLINEAR','refs':['A','B','C'],'observed':1,'minimum':0.1},
        ],
    }


class PublicationTests(unittest.TestCase):
    def test_positive_fixture_inventory(self):
        self.assertEqual(len(list(FIXTURES.glob('*.spec.json'))), 5)
        for f in FIXTURES.glob('*.spec.json'):
            name = f.name.removesuffix('.spec.json')
            with self.subTest(name=name):
                spec, review = load(name); result = build(spec)
                self.assertEqual(result['witness']['layout']['unresolved'], [])
                observed = check(result['svg'].encode(), review, name)
                self.assertEqual(observed['errors'], [])
                self.assertFalse(observed['publicationAuthorized'])
                self.assertEqual(observed['renderStatus'], 'NOT_RUN')

    def test_idempotent_pure_rebuild(self):
        for f in FIXTURES.glob('*.spec.json'):
            spec = json.loads(f.read_text(encoding='utf-8')); before = copy.deepcopy(spec)
            a, b = build(spec), build(spec)
            self.assertEqual(a, b); self.assertEqual(spec, before)
            self.assertFalse(a['witness']['publicationAuthorized'])
            self.assertIn('INDEPENDENT_PUBLICATION_AUDIT', a['witness']['requiredGates'])

    def test_annotation_order_does_not_change_bytes(self):
        s, _ = load(); a = build(s)
        s['publication']['annotations'].reverse()
        self.assertEqual(a['svg'], build(s)['svg'])

    def test_same_value_two_owners_are_not_duplicate(self):
        s, r = load('equal-length-owners'); svg = build(s)['svg'].encode()
        self.assertEqual(check(svg, r, 'equal-length-owners')['status'], 'PASS')
        self.assertEqual(svg.count(b'>3</text>'), 2)

    def test_measurements_do_not_shrink_or_suppress(self):
        s, _ = load(); result = build(s, {'lAB-label': [1000, 1000]})
        self.assertEqual(result['witness']['status'], 'POLISH_REQUIRED')
        self.assertIn('lAB-label', result['witness']['layout']['unresolved'])
        self.assertEqual(result['witness']['layout']['suppressed'], [])
        self.assertTrue(all(l['font'] == 16 for l in result['witness']['layout']['labels']))

    def test_production_fragment_build_rejects_estimated_or_stale_measurements(self):
        s,_=load();_,labels,_,_,_,_=prepare(s)
        ids={label['id'] for label in labels}
        svg='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'
        fragments={label_id:{'labelId':label_id,'owner':'source-bound','factRole':'DERIVED_INTERMEDIATE',
            'fragmentSha256':'sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest(),'svg':svg,
            'intrinsic':{'width':10,'height':10}} for label_id in ids}
        measurements={label_id:[10,10] for label_id in ids}
        with self.assertRaisesRegex(ValueError,'BROWSER_MEASURED_TYPOGRAPHY_REQUIRED'):
            build(s,strict_measured_fragments=True)
        with self.assertRaisesRegex(ValueError,'FROZEN_FRAGMENT_INVENTORY_MISMATCH'):
            build(s,measurements,{key:value for key,value in fragments.items() if key!=next(iter(ids))},strict_measured_fragments=True)
        with self.assertRaisesRegex(ValueError,'BROWSER_LABEL_MEASUREMENT_REQUIRED'):
            build(s,{},fragments,strict_measured_fragments=True)
        tampered=dict(fragments);first=next(iter(ids));tampered[first]={**tampered[first],'fragmentSha256':'sha256:'+'0'*64}
        with self.assertRaisesRegex(ValueError,'FROZEN_FRAGMENT_HASH_MISMATCH'):
            build(s,measurements,tampered,strict_measured_fragments=True)

    def test_annotation_hash_changes_even_without_legacy_fact_change(self):
        s, _ = load(); a = build(s)['witness']['publicationSpecSha256']
        s['publication']['annotations'][0]['factRole'] = 'GIVEN'
        self.assertNotEqual(a, build(s)['witness']['publicationSpecSha256'])

    def test_adapter_preserves_overlay_and_hash_binding(self):
        s, _ = load(); uid = s.pop('id')
        bundle = {'schemaVersion':'past-exam-expected-facts-v1', 'questionUid':uid, 'route':'STANDARD', **s}
        before = copy.deepcopy(bundle); r = adapt_expected_facts(bundle)
        self.assertEqual(r['visualSpec']['publication'], s['publication']); self.assertEqual(bundle, before)
        self.assertEqual(r['independentFactHash'], r['visualSpec']['sourceFacts']['independentFactHash'])

    def test_profile_defaults_only(self):
        s, _ = load(); r = build(s)
        self.assertEqual(r['witness']['coordinateModel']['sx'], 64)
        self.assertIn('width="384"', r['svg'])

    def test_unlabeled_source_construction_point_keeps_identity_without_visible_name(self):
        s, r = load()
        s['objects'].append({'id':'P0','kind':'POINT','at':[1,1],'name':None})
        s['publication']['sourcePointLabels']['P0'] = None
        s['sourceFacts']['coordinateEvidence']['sourcePointIds'].append('P0')
        r['points'].append({'id':'P0','at':[1,1],'name':None})
        r['coordinateEvidence']['sourcePointIds'].append('P0')
        svg = build(s)['svg'].encode()
        root = ET.fromstring(svg)
        point = next(e for e in root.iter() if e.get('id') == 'P0')
        self.assertIsNone(point.get('data-source-label'))
        self.assertIsNone(next((e for e in root.iter() if e.get('id') == 'P0-name'), None))
        self.assertEqual(check(svg, r)['status'], 'PASS')

    def test_independent_observer_checks_frozen_point_circle_incidence(self):
        def case(at):
            s, r = load()
            s['objects'].extend([
                {'id':'P0','kind':'POINT','at':at,'name':None},
                {'id':'C0','kind':'CIRCLE','center':[2,2],'radius':0.5},
            ])
            s['publication']['sourcePointLabels']['P0'] = None
            s['sourceFacts']['coordinateEvidence']['sourcePointIds'].append('P0')
            r['points'].append({'id':'P0','at':at,'name':None})
            r['coordinateEvidence']['sourcePointIds'].append('P0')
            r.setdefault('circles', []).append({'id':'C0','center':[2,2],'radius':0.5})
            r['incidences'] = [{'id':'P0-on-C0','point':'P0','circle':'C0'}]
            return s, r

        s, r = case([2.5,2])
        self.assertEqual(check(build(s)['svg'].encode(), r)['status'], 'PASS')
        s, r = case([2.2,2.2])
        result = check(build(s)['svg'].encode(), r)
        self.assertEqual(result['status'], 'FAIL')
        self.assertIn('CIRCLE_INCIDENCE_FAIL:P0-on-C0', result['errors'])

    def test_angle_label_can_use_a_frozen_adjacent_anchor(self):
        s, r = load()
        s['publication']['annotations'][0]['labelAt'] = [0.8,0.8]
        r['angles'][0]['labelAt'] = [0.8,0.8]
        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')
        shifted = edit(result['svg'].encode(), 'a90-label', lambda e,root:e.set('x','40'))
        self.assertIn('ANGLE_LABEL_ANCHOR_MISMATCH:a90', check(shifted, r)['errors'])

    def test_square_angle_marker_can_carry_a_right_angle_without_text(self):
        s, r = load()
        s['publication']['annotations'][0]['showLabel'] = False
        r['angles'][0]['showLabel'] = False

        result = build(s)
        root = ET.fromstring(result['svg'])
        self.assertIsNone(next((e for e in root.iter() if e.get('id') == 'a90-label'), None))
        marker = next(e for e in root.iter() if e.get('id') == 'a90')
        self.assertEqual(marker.tag, NS+'polyline')
        self.assertEqual(marker.get('data-role'), 'indicator')
        self.assertEqual(len(marker.get('points').split()), 3)
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

        def skew_square(e, root):
            points = e.get('points').split()
            middle = [float(value) for value in points[1].split(',')]
            e.set('points', f'{points[0]} {middle[0]+10},{middle[1]+10} {points[2]}')
        broken = edit(result['svg'].encode(), 'a90', skew_square)
        self.assertIn('RIGHT_ANGLE_VERTEX_MISMATCH:a90', check(broken, r)['errors'])

    def test_textless_arc_angle_is_rejected(self):
        s, _ = load()
        s['publication']['annotations'][0]['marker'] = 'ARC'
        s['publication']['annotations'][0]['showLabel'] = False
        with self.assertRaisesRegex(ValueError, 'ANGLE_LABEL_REQUIRED_FOR_NON_SQUARE_MARKER:a90'):
            build(s)

    def test_angle_label_can_use_an_owner_bound_leader_callout(self):
        s, r = load()
        s['publication']['annotations'][0]['labelPlacement'] = 'LEADER_CALLOUT'
        s['publication']['annotations'][0]['labelAt'] = [1.0,1.0]
        r['angles'][0]['labelPlacement'] = 'LEADER_CALLOUT'
        r['angles'][0]['labelAt'] = [1.0,1.0]

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        root = ET.fromstring(result['svg'])
        leader = next(e for e in root.iter() if e.get('id') == 'a90-leader')
        self.assertEqual(leader.tag, NS+'line')
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

        broken = edit(result['svg'].encode(), 'a90-leader', lambda e,root:e.set('x1','0'))
        self.assertIn('ANGLE_LEADER_OWNER_MISMATCH:a90', check(broken, r)['errors'])

    def test_angle_callout_selects_the_first_clear_owner_bound_anchor(self):
        s, r = load()
        annotation = s['publication']['annotations'][0]
        annotation['labelPlacement'] = 'LEADER_CALLOUT'
        annotation['labelAtCandidates'] = [[3.0,1.3],[1.0,1.0]]
        angle = r['angles'][0]
        angle['labelPlacement'] = 'LEADER_CALLOUT'
        angle['labelAtCandidates'] = [[3.0,1.3],[1.0,1.0]]

        # In this frozen realization, the first candidate's straight leader
        # crosses BC, while the second candidate remains inside the open
        # angle wedge.  The check is intentionally derived from literal
        # screen-space points instead of the routing implementation.
        marker_midpoint = (112.0,272.0)
        first_anchor = (288.0,204.8)
        second_anchor = (160.0,224.0)
        bc_start, bc_end = (288.0,288.0),(96.0,96.0)
        self.assertTrue(proper_segment_cross(marker_midpoint,first_anchor,bc_start,bc_end))
        self.assertFalse(proper_segment_cross(marker_midpoint,second_anchor,bc_start,bc_end))

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        label = next(row for row in result['witness']['layout']['labels'] if row['id']=='a90-label')
        self.assertAlmostEqual(label['baseline'][0],160.0)
        self.assertAlmostEqual(label['baseline'][1],224.0)
        self.assertEqual(check(result['svg'].encode(), r)['status'],'PASS')

        root = ET.fromstring(result['svg'])
        leader = next(e for e in root.iter() if e.get('id')=='a90-leader')
        self.assertEqual(leader.tag,NS+'line')

    def test_leader_router_bends_around_a_blocking_segment(self):
        wall={'id':'wall','kind':'line','geometry':[(20.0,-5.0),(20.0,5.0)]}
        route=find_clear_leader_path((0.0,0.0),(40.0,0.0),[wall],set(),Box(-20.0,-20.0,80.0,40.0))
        self.assertIsNotNone(route)
        self.assertEqual(route[0],[0.0,0.0])
        self.assertEqual(route[-1],[40.0,0.0])
        self.assertGreater(len(route),2)
        self.assertTrue(all(not proper_segment_cross(a,b,(20.0,-5.0),(20.0,5.0)) for a,b in zip(route,route[1:])))
        self.assertLess(sum(math.dist(a,b) for a,b in zip(route,route[1:])),60.0)

    def test_leader_clearance_rejects_crossing_a_circle_boundary(self):
        circle={'id':'circle','kind':'circle','geometry':(20.0,0.0,10.0)}
        start,end=(-20.0,0.0),(60.0,0.0)
        safe=Box(-40.0,-40.0,120.0,80.0)
        self.assertFalse(leader_clear(start,end,[circle],set()))
        route=find_clear_leader_path(start,end,[circle],set(),safe)
        self.assertIsNotNone(route)
        self.assertGreater(len(route),2)
        for a,b in zip(route,route[1:]):
            self.assertGreaterEqual(point_segment_distance_for_test(circle['geometry'][:2],a,b),10.0-1e-6)

    def test_angle_callout_across_a_closed_source_boundary_fails_closed(self):
        s, r = load()
        s['publication']['annotations'][0].update(labelPlacement='LEADER_CALLOUT',labelAtCandidates=[[3.0,1.3]])
        r['angles'][0].update(labelPlacement='LEADER_CALLOUT',labelAtCandidates=[[3.0,1.3]])

        result=build(s)
        self.assertEqual(result['witness']['status'],'POLISH_REQUIRED')
        self.assertIn('a90-label',result['witness']['layout']['unresolved'])
        svg=result['svg'].encode('utf-8')
        report=check(svg,r)
        self.assertEqual(report['status'],'FAIL')
        self.assertIn('ACTUAL_ELEMENT_MISSING_OR_WRONG_KIND:a90-label',report['errors'])

    def test_builder_serializes_a_clear_polyline_leader_around_an_open_segment(self):
        s, r = load()
        s['publication']['fontSize']=16
        s['publication']['annotations']=s['publication']['annotations'][:1]
        r['lengths'],r['regions']=[],[]
        s['objects'].extend([
            {'id':'D','kind':'POINT','at':[.5625,.703125],'name':'D'},
            {'id':'E','kind':'POINT','at':[.703125,.5625],'name':'E'},
            {'id':'DE','kind':'SEGMENT','from':[.5625,.703125],'to':[.703125,.5625]},
        ])
        s['publication']['sourcePointLabels'].update({'D':'D','E':'E'})
        s['publication']['segmentPointRefs']['DE']=['D','E']
        s['sourceFacts']['coordinateEvidence']['sourcePointIds'].extend(['D','E'])
        r['points'].extend([
            {'id':'D','at':[.5625,.703125],'name':'D'},
            {'id':'E','at':[.703125,.5625],'name':'E'},
        ])
        r['segments'].append({'id':'DE','points':['D','E']})
        r['coordinateEvidence']['sourcePointIds'].extend(['D','E'])
        s['publication']['annotations'][0].update(labelPlacement='LEADER_CALLOUT',labelAtCandidates=[[.8,1.5]])
        r['angles'][0].update(labelPlacement='LEADER_CALLOUT',labelAtCandidates=[[.8,1.5]])

        result=build(s)
        self.assertEqual(result['witness']['layout']['unresolved'],[])
        svg=result['svg'].encode('utf-8')
        root=ET.fromstring(svg)
        leader=next(e for e in root.iter() if e.get('id')=='a90-leader')
        self.assertEqual(leader.tag,NS+'polyline')
        points=[tuple(map(float,pair.split(','))) for pair in leader.get('points').split()]
        wall=next(e for e in root.iter() if e.get('id')=='DE')
        wall_start=(float(wall.get('x1')),float(wall.get('y1')))
        wall_end=(float(wall.get('x2')),float(wall.get('y2')))
        self.assertTrue(all(not proper_segment_cross(a,b,wall_start,wall_end) for a,b in zip(points,points[1:])))
        self.assertEqual(check(svg,r)['status'],'PASS')

    def test_annotation_value_can_move_to_an_audited_condition_box_without_a_crossing_leader(self):
        s,r=load()
        annotation=s['publication']['annotations'][0]
        expected=next(row for row in r['angles'] if row['id']==annotation['id'])
        line=f"∠{''.join(expected['points'])}={expected['text']}"
        annotation.update(showLabel=False,labelPlacement='CONDITION_BOX',conditionBoxId='angle-facts')
        s['objects'].append({'id':'angle-facts','kind':'CONDITION_BOX','at':[2.3,2.3],'lines':[line]})
        expected.update(showLabel=False,labelPlacement='CONDITION_BOX',conditionBoxId='angle-facts')
        r.setdefault('otherLabels',[]).append({'id':'angle-facts','text':line,'powers':[],'conditionBoxFor':[annotation['id']]})
        result=build(s)
        self.assertEqual(result['witness']['layout']['unresolved'],[])
        root=ET.fromstring(result['svg'])
        self.assertIsNone(next((e for e in root.iter() if e.get('id')==annotation['id']+'-label'),None))
        self.assertEqual(check(result['svg'].encode(),r)['status'],'PASS')
        wrong=copy.deepcopy(r);wrong['otherLabels'][0]['text']=line.replace(expected['text'],'89°')
        self.assertEqual(check(result['svg'].encode(),wrong)['status'],'FAIL')

    def test_length_value_can_move_to_an_audited_condition_box_without_a_dimension_or_leader(self):
        s,r=load()
        annotation=next(row for row in s['publication']['annotations'] if row['kind']=='LENGTH')
        expected=next(row for row in r['lengths'] if row['id']==annotation['id'])
        points=s['publication']['segmentPointRefs'][annotation['owner']]
        line=f"{''.join(points)}={expected['text']}"
        annotation.update(labelPlacement='CONDITION_BOX',conditionBoxId='length-facts')
        s['objects'].append({'id':'length-facts','kind':'CONDITION_BOX','at':[2.3,2.3],'lines':[line]})
        expected.update(labelPlacement='CONDITION_BOX',conditionBoxId='length-facts')
        r.setdefault('otherLabels',[]).append({'id':'length-facts','text':line,'powers':[],'conditionBoxFor':[annotation['id']]})
        result=build(s)
        self.assertEqual(result['witness']['layout']['unresolved'],[])
        root=ET.fromstring(result['svg'])
        self.assertIsNone(next((e for e in root.iter() if e.get('id')==annotation['id']+'-label'),None))
        self.assertEqual(check(result['svg'].encode(),r)['status'],'PASS')

    def test_length_label_can_use_an_owner_bound_leader_callout(self):
        s, r = load()
        s['publication']['annotations'][1]['labelPlacement'] = 'LEADER_CALLOUT'
        s['publication']['annotations'][1]['labelAt'] = [1.6,.75]
        length = next(row for row in r['lengths'] if row['id']=='lAB')
        length['labelPlacement'] = 'LEADER_CALLOUT'
        length['labelAt'] = [1.6,.75]

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        root = ET.fromstring(result['svg'])
        leader = next(e for e in root.iter() if e.get('id') == 'lAB-leader')
        self.assertEqual(leader.tag, NS+'line')
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

        broken = edit(result['svg'].encode(), 'lAB-leader', lambda e,root:e.set('x1','0'))
        self.assertIn('LENGTH_LEADER_OWNER_MISMATCH:lAB', check(broken, r)['errors'])

    def test_circular_arc_uses_exact_source_endpoints_radius_and_sweep(self):
        s, r = load()
        s['objects'].append({'id':'arcBC','kind':'CIRCULAR_ARC','centerPoint':'A',
            'startPoint':'B','endPoint':'C','sweep':'CCW'})
        r['arcs'] = [{'id':'arcBC','center':'A','radius':3,'startPoint':'B',
            'endPoint':'C','sweep':'CCW','degrees':90}]

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        root = ET.fromstring(result['svg'])
        arc = next(e for e in root.iter() if e.get('id') == 'arcBC')
        self.assertEqual(arc.tag, NS+'polyline')
        self.assertGreaterEqual(len(arc.get('points').split()), 33)
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

        def distort_middle(e, root):
            points = e.get('points').split()
            middle = len(points)//2
            xy = [float(value) for value in points[middle].split(',')]
            points[middle] = f'{xy[0]+12},{xy[1]}'
            e.set('points',' '.join(points))
        broken = edit(result['svg'].encode(), 'arcBC', distort_middle)
        self.assertIn('CIRCULAR_ARC_RADIUS_MISMATCH:arcBC', check(broken, r)['errors'])

    def test_constructed_coordinate_angle_condition_supports_minor_and_reflex_angles(self):
        to_rad = math.radians
        points = {
            'O': (0.0, 0.0),
            'A': (math.cos(to_rad(203)), math.sin(to_rad(203))),
            'B': (math.cos(to_rad(337)), math.sin(to_rad(337))),
        }
        minor = {'id':'central-minor','kind':'ANGLE','refs':['A','O','B'],'expected':134,'tolerance':1e-7}
        reflex = {'id':'central-reflex','kind':'ANGLE','refs':['A','O','B'],'expected':226,'tolerance':1e-7}
        self.assertLess(_condition_residual(points, minor), 1e-10)
        self.assertLess(_condition_residual(points, reflex), 1e-10)
        self.assertLess(_coordinate_condition_residual(points, minor), 1e-10)
        self.assertLess(_coordinate_condition_residual(points, reflex), 1e-10)
        wrong = {**reflex, 'expected':225}
        self.assertAlmostEqual(_condition_residual(points, wrong), 1.0, places=8)
        self.assertAlmostEqual(_coordinate_condition_residual(points, wrong), 1.0, places=8)

    def test_point_name_can_use_a_frozen_owner_adjacent_anchor(self):
        s, r = load()
        s['publication']['pointLabelAnchors'] = {'A':[-0.8,0.8]}
        r['points'][0]['labelAt'] = [-0.8,0.8]
        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')
        shifted = edit(result['svg'].encode(), 'A-name', lambda e,root:e.set('x','40'))
        self.assertIn('POINT_NAME_ANCHOR_MISMATCH:A', check(shifted, r)['errors'])

    def test_point_identity_can_use_an_owner_bound_leader_callout(self):
        s, r = load()
        s['publication']['pointLabelCallouts'] = {'C':[0.3,1.7]}
        source_point = next(p for p in r['points'] if p['id']=='C')
        source_point['labelPlacement'] = 'LEADER_CALLOUT'
        source_point['labelAt'] = [0.3,1.7]

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'], [])
        root = ET.fromstring(result['svg'])
        leader = next(e for e in root.iter() if e.get('id') == 'C-name-leader')
        self.assertEqual(leader.tag, NS+'line')
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

        broken = edit(result['svg'].encode(), 'C-name-leader', lambda e,root:e.set('x1','0'))
        self.assertIn('POINT_NAME_LEADER_OWNER_MISMATCH:C', check(broken, r)['errors'])

    def test_point_callout_selects_a_clear_owner_bound_baseline(self):
        s, r = load()
        s['publication']['fontSize'] = 24
        s['publication']['annotations'] = []
        s['publication']['pointLabelCalloutCandidates'] = {'C':[[2.5,-0.5],[0.3,1.7]]}
        r['angles'],r['lengths'],r['regions'] = [],[],[]
        point = next(row for row in r['points'] if row['id']=='C')
        point['labelPlacement'] = 'LEADER_CALLOUT'
        point['labelAtCandidates'] = [[2.5,-0.5],[0.3,1.7]]

        # The first baseline sends C's leader through AB; the second stays
        # on C's side of BC and inside C's point-identity Voronoi region.
        source=(96.0,96.0)
        first=(256.0,320.0)
        second=(115.2,179.2)
        ab_start,ab_end=(96.0,288.0),(288.0,288.0)
        self.assertTrue(proper_segment_cross(source,first,ab_start,ab_end))
        self.assertFalse(proper_segment_cross(source,second,ab_start,ab_end))

        result = build(s)
        self.assertEqual(result['witness']['layout']['unresolved'],[])
        label = next(row for row in result['witness']['layout']['labels'] if row['id']=='C-name')
        self.assertAlmostEqual(label['baseline'][0],115.2)
        self.assertAlmostEqual(label['baseline'][1],179.2)
        svg=result['svg'].encode('utf-8')
        self.assertEqual(check(svg,r)['status'],'PASS')
        root=ET.fromstring(svg)
        leader=next(e for e in root.iter() if e.get('id')=='C-name-leader')
        self.assertEqual(leader.tag,NS+'line')
        start=(float(leader.get('x1')),float(leader.get('y1')))
        end=(float(leader.get('x2')),float(leader.get('y2')))
        bc=next(e for e in root.iter() if e.get('id')=='BC')
        bc_start=(float(bc.get('x1')),float(bc.get('y1')))
        bc_end=(float(bc.get('x2')),float(bc.get('y2')))
        self.assertFalse(proper_segment_cross(start,end,bc_start,bc_end))

    def test_publication_condition_box_uses_the_shared_geometry_annotation_font(self):
        s, r = load()
        s['objects'].append({'id':'ratio-note','kind':'CONDITION_BOX','at':[1.5,3.4],
            'lines':['호의 비 3:5:7']})
        r['otherLabels'] = [{'id':'ratio-note','text':'호의 비 3:5:7'}]
        result = build(s)
        root = ET.fromstring(result['svg'])
        note = next(e for e in root.iter() if e.get('id')=='ratio-note')
        self.assertEqual(note.get('font-size'), '16')
        self.assertEqual(check(result['svg'].encode(), r)['status'], 'PASS')

    def test_concave_region_box_cannot_bridge_notch(self):
        p = [(0,0),(10,0),(10,10),(6,10),(6,3),(4,3),(4,10),(0,10)]
        self.assertFalse(box_owned({'ownerPolygon':p}, Box(2,5,6,2)))

    def test_input_schema_rejections(self):
        def missing_names(s): s['publication']['sourcePointLabels'].pop('A')
        def wrong_segment(s): s['publication']['segmentPointRefs']['AB'] = ['A','C']
        def legacy_mix(s): s['objects'].append({'id':'legacy','kind':'ANGLE_MARK','refs':['B','A','C'],'value':90})
        def duplicate(s):
            row=copy.deepcopy(s['publication']['annotations'][0]);row['id']='duplicate';s['publication']['annotations'].append(row)
        mutations = [missing_names, wrong_segment, legacy_mix, duplicate,
            lambda s:s['publication'].update(unknown=True), lambda s:s['publication'].update(fontSize=10),
            lambda s:s['publication'].update(fontSize=float('nan')), lambda s:s.update(axes=True),
            lambda s:s['publication']['annotations'][0].update(value=89),
            lambda s:s['publication']['annotations'][1].update(value=4),
            lambda s:s['publication']['annotations'][2].update(value=5),
            lambda s:s['publication']['annotations'][0].update(id='A-name'),
            lambda s:s['publication']['annotations'][0].update(text='90.0'),
            lambda s:s['publication']['annotations'][1].update(side=True),
            lambda s:s['publication']['annotations'][0].update(refs=['B','B','C']),
            lambda s:s['publication']['sourcePointLabels'].update(A='B')]
        for i, mutate in enumerate(mutations):
            with self.subTest(i=i):
                s,_=load();mutate(s)
                with self.assertRaises(ValueError): build(s)

    def test_coordinate_evidence_required_and_source_coverage(self):
        s,_=load()
        self.assertEqual(s['sourceFacts']['coordinateEvidence']['mode'],'SOURCE_COORDINATES')
        missing=copy.deepcopy(s);missing['sourceFacts'].pop('coordinateEvidence')
        with self.assertRaisesRegex(ValueError,'COORDINATE_EVIDENCE_REQUIRED'):build(missing)
        bad=copy.deepcopy(s);bad['sourceFacts']['coordinateEvidence']['sourcePointIds'].pop()
        with self.assertRaisesRegex(ValueError,'SOURCE_COORDINATE_ID_COVERAGE_FAIL'):build(bad)

    def test_constructed_realization_requires_complete_verified_evidence(self):
        s,r=load();e=constructed_evidence()
        s['sourceFacts']['coordinateEvidence']=copy.deepcopy(e)
        r['coordinateEvidence']=copy.deepcopy(e)
        result=build(s);report=check(result['svg'].encode(),r)
        self.assertEqual(report['status'],'PASS')
        self.assertEqual(result['witness']['coordinateEvidenceMode'],'CONSTRUCTED_REALIZATION')
        self.assertEqual(report['coordinateEvidenceMode'],'CONSTRUCTED_REALIZATION')
        self.assertEqual(len(result['witness']['coordinateEvidenceSha256']),64)
        self.assertEqual(len(report['coordinateEvidenceSha256']),64)
        for mutate,code in [
            (lambda x:x['constructionSteps'].pop(),'CONSTRUCTED_STEP_COVERAGE_FAIL'),
            (lambda x:x['residualChecks'][0].update(residual=.25),'CONSTRUCTED_RESIDUAL_EVIDENCE_MISMATCH'),
            (lambda x:x['degeneracyChecks'][0].update(observed=.5),'CONSTRUCTED_DEGENERACY_EVIDENCE_MISMATCH'),
            (lambda x:x['pointCoordinates']['C'].__setitem__(1,2.5),'CONSTRUCTED_POINT_COORDINATE_MISMATCH'),
        ]:
            with self.subTest(code=code):
                bad=copy.deepcopy(s);mutate(bad['sourceFacts']['coordinateEvidence'])
                with self.assertRaisesRegex(ValueError,code):build(bad)

    def test_independent_auditor_recomputes_constructed_coordinate_evidence(self):
        s,r=load();e=constructed_evidence()
        s['sourceFacts']['coordinateEvidence']=copy.deepcopy(e)
        r['coordinateEvidence']=copy.deepcopy(e)
        svg=build(s)['svg'].encode()
        report=check(svg,r)
        self.assertEqual(report['status'],'PASS')
        self.assertEqual(report['coordinateEvidenceMode'],'CONSTRUCTED_REALIZATION')
        self.assertEqual(report['observations'][0]['type'],'COORDINATE_EVIDENCE')
        bad=copy.deepcopy(r);bad['coordinateEvidence']['residualChecks'][0]['residual']=.25
        report=check(svg,bad)
        self.assertEqual(report['status'],'FAIL')
        self.assertIn('CONSTRUCTED_RESIDUAL_EVIDENCE_MISMATCH',str(report['errors']))
        missing=copy.deepcopy(r);missing.pop('coordinateEvidence')
        self.assertIn('COORDINATE_EVIDENCE_REQUIRED',str(check(svg,missing)['errors']))

    def test_collinear_ray_alias_does_not_duplicate_the_same_angle(self):
        s,_=load();s['objects'].append({'id':'M','kind':'POINT','at':[1.5,0]})
        s['publication']['sourcePointLabels']['M']='M'
        s['sourceFacts']['coordinateEvidence']['sourcePointIds'].append('M')
        s['publication']['annotations'].append({'id':'alias','kind':'ANGLE','refs':['M','A','C'],'value':90})
        with self.assertRaisesRegex(ValueError,'DUPLICATE_SEMANTIC'):build(s)

    def test_straight_angle_needs_explicit_direction(self):
        s,_=load();s['publication']['annotations']=[{'id':'straight','kind':'ANGLE','refs':['B','A','D'],'value':180}]
        s['objects'].append({'id':'D','kind':'POINT','at':[-3,0]});s['publication']['sourcePointLabels']['D']='D'
        s['sourceFacts']['coordinateEvidence']['sourcePointIds'].append('D')
        with self.assertRaisesRegex(ValueError,'EXPLICIT_SWEEP'):build(s)
        s['publication']['annotations'][0]['sweep']='CW'
        self.assertIn('straight',build(s)['svg'])

    def test_reflex_arc_is_not_minor_arc(self):
        s,_=load();s['publication']['annotations']=[{'id':'reflex','kind':'ANGLE','refs':['B','A','C'],'value':270}]
        r=ET.fromstring(build(s)['svg']);pts=next(e for e in r.iter() if e.get('id')=='reflex').get('points')
        self.assertGreater(len(pts.split()), 60)
        s['publication']['annotations'][0]['marker']='SQUARE'
        with self.assertRaisesRegex(ValueError,'MARKER'):build(s)

    def test_independent_observer_has_no_generator_import(self):
        tree=ast.parse((Path(__file__).resolve().parents[1]/'audit_publication.py').read_text(encoding='utf-8'))
        imports=[n.module for n in ast.walk(tree) if isinstance(n,ast.ImportFrom)]
        imports += [a.name for n in ast.walk(tree) if isinstance(n,ast.Import) for a in n.names]
        allowed={'__future__','argparse','hashlib','json','math','pathlib','re','xml.etree.ElementTree'}
        self.assertTrue(set(imports)<=allowed)

    def test_source_and_solution_bytes_required(self):
        s,r=load();svg=build(s)['svg'].encode()
        self.assertEqual(audit(svg,r)['status'],'FAIL')
        self.assertEqual(check(svg,r,source_bytes=b'changed source')['status'],'FAIL')
        self.assertEqual(check(svg,r,solution_bytes=b'changed solution')['status'],'FAIL')

    def test_review_is_not_builder_witness(self):
        s,r=load();a=build(s)
        self.assertEqual(check(a['svg'].encode(),a['witness'])['status'],'FAIL')
        r['coordinateModel']['sx']=float('nan')
        self.assertEqual(check(a['svg'].encode(),r)['status'],'FAIL')

    def test_actual_mutations_fail_without_metadata_changes(self):
        s,r=load();svg=build(s)['svg'].encode()
        mutations=[('A',lambda e,root:e.set('cx','100')),
            ('AB',lambda e,root:e.set('x2','230')),
            ('a90',lambda e,root:e.set('points','100,288 116,272 96,272')),
            ('area',lambda e,root:e.set('points','96,288 280,288 96,96')),
            ('lAB-dimension',lambda e,root:e.set('x2','250')),
            ('lAB-cap-0',lambda e,root:e.set('x1','80')),
            ('area-label',lambda e,root:e.set('x','300')),
            ('A-name',lambda e,root:e.set('data-owner','B')),
            ('lAB-label',lambda e,root:e.set('font-size','10')),
            ('a90-label',lambda e,root:e.set('x','50')),
            ('a90-label',lambda e,root:e.set('data-fact-role','GIVEN')),
            ('A-name',lambda e,root:setattr(e,'text','B'))]
        for oid,mutate in mutations:
            with self.subTest(oid=oid):self.assertEqual(check(edit(svg,oid,mutate),r)['status'],'FAIL')

    def test_duplicate_primitive_even_with_new_id(self):
        s,r=load();svg=build(s)['svg'].encode()
        for oid in ('area','AB','a90'):
            def clone(e,root):
                n=copy.deepcopy(e);n.set('id','dup-'+oid)
                for g in root:
                    if e in list(g):g.append(n);break
            self.assertEqual(check(edit(svg,oid,clone),r)['status'],'FAIL')

    def test_duplicate_id(self):
        s,r=load();svg=build(s)['svg'].encode()
        self.assertEqual(check(edit(svg,'B',lambda e,root:e.set('id','A')),r)['status'],'FAIL')

    def test_unreviewed_visible_primitive(self):
        s,r=load();svg=build(s)['svg'].encode()
        def extra(e,root):
            g=ET.SubElement(root,NS+'g',{'data-layer':'50'})
            ET.SubElement(g,NS+'line',{'id':'extra','x1':'50','y1':'50','x2':'60','y2':'60','stroke':'#111','stroke-width':'1','fill':'none'})
        self.assertIn('UNREVIEWED_PRIMITIVES',str(check(edit(svg,'A',extra),r)['errors']))

    def test_invisible_or_unobservable_effects_rejected(self):
        s,r=load();svg=build(s)['svg'].encode()
        for attrs in ({'transform':'translate(10 20)'},{'opacity':'0'},{'stroke':'none'},{'stroke-opacity':'0'},{'style':'display:none'},{'clip-path':'url(#missing)'},{'class':'hidden'},{'onload':'alert(1)'}):
            with self.subTest(attrs=attrs):
                self.assertEqual(check(edit(svg,'AB',lambda e,root:e.attrib.update(attrs)),r)['status'],'FAIL')
        def cover(e,root): ET.SubElement(root,NS+'rect',{'width':'384','height':'384','fill':'#fff'})
        self.assertEqual(check(edit(svg,'A',cover),r)['status'],'FAIL')

    def test_child_math_reposition_or_font_cheat(self):
        s,r=load();svg=build(s)['svg'].encode()
        for attrs in ({'x':'300'},{'font-size':'70%'},{'fill':'white'}):
            def mutate(e,root):
                text=e.text;e.text=None;ET.SubElement(e,NS+'tspan',attrs).text=text
            self.assertEqual(check(edit(svg,'lAB-label',mutate),r)['status'],'FAIL')

    def test_annotation_power_scope_cannot_change_without_text_change(self):
        s, r = load(); svg = build(s)['svg'].encode()
        self.assertEqual(check(svg, r)['status'], 'PASS')
        for oid in ('a90-label', 'lAB-label', 'area-label', 'A-name'):
            def superscript(e, root):
                text = e.text; e.text = None
                ET.SubElement(e, NS+'tspan', {'baseline-shift':'super', 'font-size':'70%'}).text = text
            with self.subTest(oid=oid):
                result = check(edit(svg, oid, superscript), r)
                self.assertEqual(result['status'], 'FAIL')
                self.assertIn('LABEL_POWER_SCOPE_MISMATCH', str(result['errors']))

    def test_frozen_annotation_power_spans_accept_only_declared_scope(self):
        s, r = load()
        s['publication']['annotations'][1]['text'] = '3^1'
        r['lengths'][0].update(text='31', powerSpans=[[1, 2]])
        svg = build(s)['svg'].encode()
        self.assertEqual(check(svg, r)['status'], 'PASS')
        r['lengths'][0]['powerSpans'] = [[0, 1]]
        self.assertEqual(check(svg, r)['status'], 'FAIL')

    def test_arc_observation_uses_real_samples(self):
        name='multi-angle-owner';s,r=load(name);svg=build(s)['svg'].encode()
        def wrong_center(e,root):
            p=[tuple(map(float,x.split(','))) for x in e.get('points').split()]
            e.set('points',' '.join(f'{x+2},{y+2}' for x,y in p))
        self.assertEqual(check(edit(svg,'lower',wrong_center),r,name)['status'],'FAIL')
        def backtrack(e,root):
            p=e.get('points').split();p[4],p[5]=p[5],p[4];e.set('points',' '.join(p))
        self.assertEqual(check(edit(svg,'lower',backtrack),r,name)['status'],'FAIL')
        r['angles'][0]['degrees']=46
        self.assertEqual(check(svg,r,name)['status'],'FAIL')

    def test_region_leader_owns_actual_region(self):
        name='region-leader';s,r=load(name);svg=build(s)['svg'].encode()
        self.assertEqual(check(edit(svg,'area-leader',lambda e,root:e.set('x1','350')),r,name)['status'],'FAIL')
        self.assertEqual(check(edit(svg,'area-leader',lambda e,root:e.set('data-owner','AB')),r,name)['status'],'FAIL')

    def test_audit_cli_output_cannot_write_production(self):
        s,r=load()
        with tempfile.TemporaryDirectory() as tmp:
            svg=Path(tmp)/'f.svg';svg.write_text(build(s)['svg'], encoding='utf-8')
            cmd=[sys.executable,str(Path(__file__).resolve().parents[1]/'audit_publication.py'),'--svg',str(svg),'--review',str(FIXTURES/'owner-triangle.review.json'),'--source',str(FIXTURES/'owner-triangle.source.txt'),'--solution',str(FIXTURES/'owner-triangle.solution.txt'),'--out',str(Path(tmp)/'should-not-exist.json')]
            result=subprocess.run(cmd,capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0);self.assertIn('OUTPUT_SCOPE',result.stderr)
            self.assertFalse((Path(tmp)/'should-not-exist.json').exists())


if __name__=='__main__':unittest.main()
