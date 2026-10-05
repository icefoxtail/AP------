"""Synthetic regression contracts frozen independently of SVG/witness output."""
import ast
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import build
from visual_engine.label_layout import Box
from visual_engine.publication import box_owned
from visual_engine.past_exam_adapter import adapt_expected_facts
from audit_publication import audit

FIXTURES = Path(__file__).parent/'publication-fixtures'
NS = '{http://www.w3.org/2000/svg}'
ET.register_namespace('', NS)


def load(name='owner-triangle'):
    return json.loads((FIXTURES/(name+'.spec.json')).read_text()), json.loads((FIXTURES/(name+'.review.json')).read_text())


def check(svg, review, name='owner-triangle', **override):
    args = {'source_bytes': (FIXTURES/(name+'.source.txt')).read_bytes(), 'solution_bytes': (FIXTURES/(name+'.solution.txt')).read_bytes(), **override}
    return audit(svg, review, **args)


def edit(svg, oid, mutate):
    root = ET.fromstring(svg)
    node = next(e for e in root.iter() if e.get('id') == oid)
    mutate(node, root)
    return ET.tostring(root, encoding='utf-8')


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
            spec = json.loads(f.read_text()); before = copy.deepcopy(spec)
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

    def test_collinear_ray_alias_does_not_duplicate_the_same_angle(self):
        s,_=load();s['objects'].append({'id':'M','kind':'POINT','at':[1.5,0]})
        s['publication']['sourcePointLabels']['M']='M'
        s['publication']['annotations'].append({'id':'alias','kind':'ANGLE','refs':['M','A','C'],'value':90})
        with self.assertRaisesRegex(ValueError,'DUPLICATE_SEMANTIC'):build(s)

    def test_straight_angle_needs_explicit_direction(self):
        s,_=load();s['publication']['annotations']=[{'id':'straight','kind':'ANGLE','refs':['B','A','D'],'value':180}]
        s['objects'].append({'id':'D','kind':'POINT','at':[-3,0]});s['publication']['sourcePointLabels']['D']='D'
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
        tree=ast.parse((Path(__file__).resolve().parents[1]/'audit_publication.py').read_text())
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
            svg=Path(tmp)/'f.svg';svg.write_text(build(s)['svg'])
            cmd=[sys.executable,str(Path(__file__).resolve().parents[1]/'audit_publication.py'),'--svg',str(svg),'--review',str(FIXTURES/'owner-triangle.review.json'),'--source',str(FIXTURES/'owner-triangle.source.txt'),'--solution',str(FIXTURES/'owner-triangle.solution.txt'),'--out',str(Path(tmp)/'should-not-exist.json')]
            result=subprocess.run(cmd,capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0);self.assertIn('OUTPUT_SCOPE',result.stderr)
            self.assertFalse((Path(tmp)/'should-not-exist.json').exists())


if __name__=='__main__':unittest.main()
